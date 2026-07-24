package main

import (
	"context"
	"errors"
	"fmt"
	"io"
	"mime"
	"net/http"
	"net/http/cookiejar"
	"net/url"
	"os"
	"path/filepath"
	"regexp"
	"strings"
	"sync"
	"time"

	"github.com/chromedp/cdproto/network"
	"github.com/chromedp/chromedp"
)

const assessmentURLFormat = "https://assessment.corsis.com/serent/admin/assessments/%s"

var invalidFilenameCharacters = regexp.MustCompile(`[<>:"/\\|?*\x00-\x1f]`)
var browserImportMutex sync.Mutex

type attachment struct {
	QuestionNumber string `json:"questionNumber"`
	QuestionText   string `json:"questionText"`
	Name           string `json:"name"`
	URL            string `json:"url"`
}

type scrapedQuestion struct {
	QuestionNumber string       `json:"questionNumber"`
	QuestionText   string       `json:"questionText"`
	FreeResponse   string       `json:"freeResponse"`
	Comments       string       `json:"comments"`
	Attachments    []attachment `json:"attachments"`
}

type scrapeResult struct {
	Questions            []scrapedQuestion `json:"questions"`
	ResultSummaryURL     string            `json:"resultSummaryURL"`
	PageURL              string            `json:"pageURL"`
	PageTitle            string            `json:"pageTitle"`
	ScoreSectionCount    int               `json:"scoreSectionCount"`
	ActiveStorageLinks   int               `json:"activeStorageLinks"`
	CommentElementCount  int               `json:"commentElementCount"`
	ResponseCardCount    int               `json:"responseCardCount"`
	CommentCount         int               `json:"commentCount"`
	FreeResponseCount    int               `json:"freeResponseCount"`
	UnknownQuestionCount int               `json:"unknownQuestionCount"`
	FrameCount           int               `json:"frameCount"`
}

type assessmentGrabRequest struct {
	Year string `json:"year"`
	Code string `json:"code"`
}

type grabbedAssessment struct {
	Year       string
	Code       string
	ReportPath string
	Scrape     scrapeResult
}

// grabAssessments opens one visible browser so the user signs in once, then
// imports every requested assessment with the same authenticated session.
func grabAssessments(ctx context.Context, companyDirectory string, requests []assessmentGrabRequest) ([]grabbedAssessment, error) {
	fmt.Println("Waiting for mutex...")
	browserImportMutex.Lock()
	fmt.Println("Mutex acquired")
	defer func() {
		browserImportMutex.Unlock()
		fmt.Println("Mutex released")
	}()

	profileDirectory, err := os.MkdirTemp("", "assessment-document-grabber-")
	if err != nil {
		return nil, fmt.Errorf("create temporary profile directory: %w", err)
	}
	defer os.RemoveAll(profileDirectory)

	allocatorOptions := append(chromedp.DefaultExecAllocatorOptions[:],
		chromedp.Flag("headless", false),
		chromedp.Flag("disable-popup-blocking", false),
		chromedp.Flag("no-sandbox", true),
		chromedp.Flag("disable-crash-reporter", true),
		chromedp.Flag("disable-breakpad", true),
		chromedp.Flag("disable-features", "Crashpad"),
		chromedp.Flag("start-fullscreen", true),
		chromedp.Flag("window-size", "1440,900"),
		chromedp.UserDataDir(profileDirectory),
	)
	allocatorContext, cancelAllocator := chromedp.NewExecAllocator(ctx, allocatorOptions...)
	defer cancelAllocator()
	browserContext, cancelBrowser := chromedp.NewContext(allocatorContext)
	defer cancelBrowser()

	results := make([]grabbedAssessment, 0, len(requests))
	for index, request := range requests {
		targetURL := fmt.Sprintf(assessmentURLFormat, url.PathEscape(request.Code))
		fmt.Printf("Opening assessment %s (%s). Complete sign-in in the browser window if prompted.\n", request.Code, request.Year)
		if err := chromedp.Run(browserContext, chromedp.Navigate(targetURL)); err != nil {
			return nil, fmt.Errorf("open assessment %s: %w", request.Code, err)
		}
		if err := waitForAssessment(browserContext, targetURL, 10*time.Minute); err != nil {
			return nil, err
		}
		if err := scrollEntirePage(browserContext); err != nil {
			return nil, err
		}
		if err := waitForIndicatorResponses(browserContext, 90*time.Second); err != nil {
			return nil, err
		}
		scrape, err := scrapeAssessment(browserContext)
		if err != nil {
			return nil, err
		}
		if scrape.ResultSummaryURL == "" {
			return nil, fmt.Errorf("result summary link not found on %q (%s); the page selector needs inspection", scrape.PageTitle, scrape.PageURL)
		}
		if len(scrape.Questions) == 0 {
			return nil, fmt.Errorf("no question containers found on %q (%s); the page selector needs inspection", scrape.PageTitle, scrape.PageURL)
		}
		fmt.Printf("Browser scrape for %s: %d response cards, %d comments, %d written responses, %d unmapped questions.\n",
			request.Year, scrape.ResponseCardCount, scrape.CommentCount, scrape.FreeResponseCount, scrape.UnknownQuestionCount)
		httpClient, browserUserAgent, _, err := authenticatedHTTPClient(browserContext, targetURL)
		if err != nil {
			return nil, err
		}
		yearDirectory := filepath.Join(companyDirectory, request.Year)
		if err := os.MkdirAll(yearDirectory, 0755); err != nil {
			return nil, fmt.Errorf("create year directory: %w", err)
		}
		reportPath := filepath.Join(companyDirectory, request.Year+".pdf")
		temporaryReportPath := filepath.Join(companyDirectory, "."+request.Year+"-import.pdf")
		_ = os.Remove(temporaryReportPath)
		temporaryReportPath, err = downloadURL(httpClient, browserUserAgent, targetURL, scrape.ResultSummaryURL, temporaryReportPath, false)
		if err != nil {
			return nil, fmt.Errorf("download result summary for %s: %w", request.Year, err)
		}
		if err := os.Remove(reportPath); err != nil && !errors.Is(err, os.ErrNotExist) {
			return nil, fmt.Errorf("replace result summary for %s: %w", request.Year, err)
		}
		if err := os.Rename(temporaryReportPath, reportPath); err != nil {
			return nil, fmt.Errorf("store result summary for %s: %w", request.Year, err)
		}

		for questionIndex := range scrape.Questions {
			question := &scrape.Questions[questionIndex]
			questionDirectory := filepath.Join(yearDirectory, "attachments", "Question "+sanitizePathPart(question.QuestionNumber, "Unknown"))
			for attachmentIndex := range question.Attachments {
				item := &question.Attachments[attachmentIndex]
				outputPath, err := downloadAttachment(httpClient, browserUserAgent, targetURL, questionDirectory, *item)
				if err != nil {
					return nil, fmt.Errorf("question %s attachment %q: %w", item.QuestionNumber, item.Name, err)
				}
				item.Name = filepath.Base(outputPath)
			}
		}
		results = append(results, grabbedAssessment{Year: request.Year, Code: request.Code, ReportPath: reportPath, Scrape: scrape})
		fmt.Printf("Imported assessment %d of %d for %s.\n", index+1, len(requests), request.Year)
	}
	return results, nil
}

func waitForAssessment(ctx context.Context, targetURL string, timeout time.Duration) error {
	deadline := time.Now().Add(timeout)
	lastRedirect := time.Time{}
	for time.Now().Before(deadline) {
		if ctx.Err() != nil {
			return ctx.Err()
		}
		var ready bool
		var currentURL string
		err := chromedp.Run(ctx,
			chromedp.Location(&currentURL),
			chromedp.Evaluate(`document.querySelectorAll('[data-testid="indicator-scores"], a[href*="active_storage"]').length > 0`, &ready),
		)
		if err == nil && strings.Contains(currentURL, targetURL) && ready {
			return chromedp.Run(ctx, chromedp.Sleep(2*time.Second))
		}
		// Corsis sends a successful admin login to /serent/admin/home instead
		// of preserving the originally requested assessment URL. Once that
		// authenticated landing page is visible, explicitly resume the target.
		if err == nil && strings.Contains(currentURL, "/serent/admin/home") && time.Since(lastRedirect) > 5*time.Second {
			fmt.Println("Authentication complete; returning to:", targetURL)
			if navigateErr := chromedp.Run(ctx, chromedp.Navigate(targetURL)); navigateErr != nil {
				return fmt.Errorf("open assessment after login: %w", navigateErr)
			}
			lastRedirect = time.Now()
		}
		time.Sleep(time.Second)
	}
	return fmt.Errorf("timed out waiting for sign-in and assessment page %s", targetURL)
}

func scrollEntirePage(ctx context.Context) error {
	var pageHeight int
	if err := chromedp.Run(ctx, chromedp.Evaluate(`Math.max(document.body.scrollHeight, document.documentElement.scrollHeight)`, &pageHeight)); err != nil {
		return fmt.Errorf("measure assessment page: %w", err)
	}
	for position := 0; position < pageHeight; position += 700 {
		if err := chromedp.Run(ctx,
			chromedp.Evaluate(fmt.Sprintf("window.scrollTo(0, %d)", position), nil),
			chromedp.Sleep(75*time.Millisecond),
		); err != nil {
			return fmt.Errorf("scroll assessment page: %w", err)
		}
	}
	return chromedp.Run(ctx,
		chromedp.Evaluate("window.scrollTo(0, 0)", nil),
		chromedp.Sleep(time.Second),
	)
}

func waitForIndicatorResponses(ctx context.Context, timeout time.Duration) error {
	deadline := time.Now().Add(timeout)
	lastCount := -1
	stableChecks := 0
	for time.Now().Before(deadline) {
		if ctx.Err() != nil {
			return ctx.Err()
		}
		var state struct {
			Cards int `json:"cards"`
			Busy  int `json:"busy"`
		}
		err := chromedp.Run(ctx, chromedp.Evaluate(`(() => {
  const documents = [document];
  for (const frame of document.querySelectorAll('iframe')) {
    try { if (frame.contentDocument) documents.push(frame.contentDocument); } catch (_) {}
  }
  return {
    cards: documents.reduce((count, doc) => count + doc.querySelectorAll('[data-test-id="indicator-responses"], [data-testid="indicator-responses"]').length, 0),
    busy: documents.reduce((count, doc) => count + doc.querySelectorAll('turbo-frame[busy], turbo-frame[aria-busy="true"]').length, 0)
  };
})()`, &state))
		if err == nil && state.Cards > 0 && state.Busy == 0 {
			if state.Cards == lastCount {
				stableChecks++
			} else {
				stableChecks = 0
			}
			lastCount = state.Cards
			if stableChecks >= 3 {
				return nil
			}
		} else {
			stableChecks = 0
		}
		time.Sleep(time.Second)
	}
	return fmt.Errorf("timed out waiting for Turbo indicator response cards to finish loading")
}

func scrapeAssessment(ctx context.Context) (scrapeResult, error) {
	const script = `(() => {
  const questions = new Map();
  const seen = new Set();
  const documents = [document];
  for (const frame of document.querySelectorAll('iframe')) {
    try {
      if (frame.contentDocument) documents.push(frame.contentDocument);
    } catch (_) {
    }
  }
  let scoreSectionCount = 0;
  let activeStorageLinks = 0;
  let commentElementCount = 0;
  let responseCardCount = 0;
  const textOf = element => (element?.innerText || element?.textContent || '').trim();
  const valueOf = element => {
    if (!element) return '';
    if (typeof element.value === 'string') return element.value.trim();
    return textOf(element);
  };
  const commentSelector = [
    'textarea[name*="comment" i]',
    'textarea[id*="comment" i]',
    'textarea[placeholder*="comment" i]',
    'input[name*="comment" i]',
    'input[id*="comment" i]',
    'input[placeholder*="comment" i]',
    '[contenteditable="true"]',
    '[role="textbox"]',
    '[data-testid*="comment"]',
    '.comments',
    '.comment',
    '[class*="comment"]'
  ].join(', ');
  const locate = (element, doc) => {
    let container = element;
    while (container && container !== doc.body) {
      const positions = container.querySelectorAll('span.position, .position, [data-testid*="position"]');
      if (positions.length === 1) return { container, position: positions[0] };
      container = container.parentElement;
    }
    return { container: element.parentElement, position: null };
  };
  const questionNumberFrom = (container, position, fallback = 'Unknown') => {
    const positionText = textOf(position);
    let match = positionText.match(/(?:question|indicator)?\s*#?\s*(\d+)/i);
    if (match) return match[1];
    const explicit = container?.querySelector(
      '[data-question-number], [data-position], [data-test-id="indicator-position"], [data-testid="indicator-position"], .question-number, .indicator-position'
    );
    if (explicit) {
      match = (explicit.getAttribute('data-question-number') || explicit.getAttribute('data-position') || textOf(explicit)).match(/\d+/);
      if (match) return match[0];
    }
    const firstCard = container?.querySelector('.indicator-card:first-child');
    match = textOf(firstCard).match(/^\s*(?:question|indicator)?\s*#?\s*(\d+)(?:\s|[.):#-])/i);
    return match ? match[1] : fallback;
  };
  const extractComment = container => {
    const candidates = [...container.querySelectorAll(commentSelector)];
    for (const candidate of candidates) {
      const text = valueOf(candidate);
      if (text && !/^(respondent\s+)?comments?\s*:?\s*$/i.test(text)) {
        return text;
      }
    }
    const label = [...container.querySelectorAll('label, dt, strong, h4, h5, p, div, span')]
      .find(node => /^(respondent\s+)?comments?\s*:?\s*$/i.test(textOf(node)));
    if (!label) return '';
    const visited = new Set([label]);
    const siblings = [];
    let sibling = label.nextElementSibling;
    while (sibling && siblings.length < 5) {
      siblings.push(sibling);
      visited.add(sibling);
      sibling = sibling.nextElementSibling;
    }
    if (label.parentElement) {
      for (const node of label.parentElement.querySelectorAll(':scope > *')) {
        if (!visited.has(node)) siblings.push(node);
      }
    }
    for (const candidate of siblings) {
      const text = valueOf(candidate);
      if (text && !/^(respondent\s+)?comments?\s*:?\s*$/i.test(text)) {
        return text;
      }
    }
    return '';
  };
  const extractIndicatorResponses = responseCard => {
    let comments = '';
    let freeResponse = '';
    for (const well of responseCard.querySelectorAll('.well')) {
      const wellText = textOf(well);
      const boldLabels = [...well.querySelectorAll('b, strong')].map(textOf);
      if (boldLabels.some(label => /^comments?\s*:?$/i.test(label))) {
        const clone = well.cloneNode(true);
        for (const label of clone.querySelectorAll('b, strong')) {
          if (/^comments?\s*:?$/i.test(textOf(label))) label.remove();
        }
        comments = textOf(clone).replace(/^comments?\s*:?\s*/i, '').trim();
        continue;
      }
      const parentText = textOf(well.parentElement);
      if (/free-form\s+response\s*:/i.test(parentText)) {
        freeResponse = wellText;
      }
    }
    return { comments, freeResponse };
  };
  const mergeQuestion = (questionNumber, container, position) => {
    const match = textOf(position).match(/\d+/);
    const resolvedNumber = match ? match[0] : questionNumber;
    const questionText = textOf(container?.querySelector('p.description, .description, [data-testid*="description"]'));
    const comments = container ? extractComment(container) : '';
    const existing = questions.get(resolvedNumber);
    if (!existing) {
      questions.set(resolvedNumber, { questionNumber: resolvedNumber, questionText, freeResponse: '', comments, attachments: [] });
      return questions.get(resolvedNumber);
    }
    if (!existing.questionText && questionText) {
      existing.questionText = questionText;
    }
    if (!existing.comments && comments) {
      existing.comments = comments;
    }
    return existing;
  };

  for (const currentDocument of documents) {
    scoreSectionCount += currentDocument.querySelectorAll('[data-testid="indicator-scores"]').length;
    commentElementCount += currentDocument.querySelectorAll(
      commentSelector
    ).length;
    const links = currentDocument.querySelectorAll(
      'a[href*="/rails/active_storage/"], a[href*="active_storage/blobs"], a[href*="active_storage/attachments"]'
    );
    activeStorageLinks += links.length;

    for (const responseCard of currentDocument.querySelectorAll(
      '[data-test-id="indicator-responses"], [data-testid="indicator-responses"]'
    )) {
      responseCardCount++;
      const found = locate(responseCard, currentDocument);
      const question = mergeQuestion(
        questionNumberFrom(found.container, found.position),
        found.container,
        found.position
      );
      const responses = extractIndicatorResponses(responseCard);
      if (responses.comments) question.comments = responses.comments;
      if (responses.freeResponse) question.freeResponse = responses.freeResponse;
    }

    for (const link of links) {
      if (seen.has(link.href)) continue;
      seen.add(link.href);

      const found = locate(link.closest('[data-testid="indicator-scores"]') || link, currentDocument);
      const question = mergeQuestion(found.position ? textOf(found.position).match(/\d+/)?.[0] || 'Unknown' : 'Unknown', found.container, found.position);
      question.attachments.push({
        questionNumber: question.questionNumber,
        questionText: question.questionText,
        name: link.getAttribute('download') || link.textContent.trim(),
        url: link.href
      });
    }
    for (const commentNode of currentDocument.querySelectorAll(commentSelector)) {
      const found = locate(commentNode, currentDocument);
      const question = mergeQuestion(textOf(found.position || commentNode).match(/\d+/)?.[0] || 'Unknown', found.container, found.position || commentNode);
      const commentText = extractComment(found.container || commentNode.parentElement || currentDocument.body) || valueOf(commentNode);
      if (commentText && !question.comments) {
        question.comments = commentText;
      }
    }
    for (const position of currentDocument.querySelectorAll('span.position, .position, [data-testid*="position"]')) {
      const found = locate(position, currentDocument);
      mergeQuestion(textOf(found.position || position).match(/\d+/)?.[0] || 'Unknown', found.container, found.position || position);
    }
  }

  const allLinks = documents.flatMap(doc => [...doc.querySelectorAll('a[href]')]);
  const summaryLink = allLinks.find(link => {
    const label = textOf(link) + ' ' + (link.title || '') + ' ' + (link.getAttribute('download') || '');
    return /(result|assessment)\s*(summary|report)/i.test(label);
  }) || allLinks.find(link => /\.pdf(?:$|\?)/i.test(link.href) && /(summary|report)/i.test(link.href));

  const questionResults = [...questions.values()];
  return {
    questions: questionResults,
    resultSummaryURL: summaryLink?.href || '',
    pageURL: location.href,
    pageTitle: document.title,
    scoreSectionCount,
    activeStorageLinks,
    commentElementCount,
    responseCardCount,
    commentCount: questionResults.filter(question => question.comments).length,
    freeResponseCount: questionResults.filter(question => question.freeResponse).length,
    unknownQuestionCount: questionResults.filter(question => question.questionNumber === 'Unknown').length,
    frameCount: documents.length - 1
  };
})()`

	var result scrapeResult
	if err := chromedp.Run(ctx, chromedp.Evaluate(script, &result)); err != nil {
		return scrapeResult{}, fmt.Errorf("scrape assessment document data: %w", err)
	}
	return result, nil
}

func authenticatedHTTPClient(ctx context.Context, targetURL string) (*http.Client, string, int, error) {
	var browserCookies []*network.Cookie
	var browserUserAgent string
	if err := chromedp.Run(ctx, chromedp.ActionFunc(func(ctx context.Context) error {
		var err error
		browserCookies, err = network.GetCookies().WithURLs([]string{targetURL}).Do(ctx)
		return err
	}), chromedp.Evaluate("navigator.userAgent", &browserUserAgent)); err != nil {
		return nil, "", 0, fmt.Errorf("read browser authentication: %w", err)
	}

	target, err := url.Parse(targetURL)
	if err != nil {
		return nil, "", 0, fmt.Errorf("parse assessment URL: %w", err)
	}
	jar, err := cookiejar.New(nil)
	if err != nil {
		return nil, "", 0, fmt.Errorf("create cookie jar: %w", err)
	}
	cookies := make([]*http.Cookie, 0, len(browserCookies))
	for _, cookie := range browserCookies {
		cookies = append(cookies, &http.Cookie{
			Name:     cookie.Name,
			Value:    cookie.Value,
			Path:     cookie.Path,
			Domain:   cookie.Domain,
			Secure:   cookie.Secure,
			HttpOnly: cookie.HTTPOnly,
		})
	}
	jar.SetCookies(target, cookies)

	transport := http.DefaultTransport.(*http.Transport).Clone()
	client := &http.Client{Transport: transport, Jar: jar, Timeout: 10 * time.Minute}
	return client, browserUserAgent, len(browserCookies), nil
}

func downloadAttachment(client *http.Client, userAgent, referer, folder string, item attachment) (string, error) {
	if err := os.MkdirAll(folder, 0755); err != nil {
		return "", err
	}
	return downloadURL(client, userAgent, referer, item.URL, filepath.Join(folder, sanitizePathPart(item.Name, "attachment")), true)
}

func downloadURL(client *http.Client, userAgent, referer, sourceURL, requestedPath string, useDisposition bool) (string, error) {
	request, err := http.NewRequest(http.MethodGet, sourceURL, nil)
	if err != nil {
		return "", err
	}
	request.Header.Set("Referer", referer)
	request.Header.Set("User-Agent", userAgent)
	request.Header.Set("Accept", "*/*")

	response, err := client.Do(request)
	if err != nil {
		return "", err
	}
	defer response.Body.Close()
	if response.StatusCode < 200 || response.StatusCode >= 300 {
		body, _ := io.ReadAll(io.LimitReader(response.Body, 512))
		return "", fmt.Errorf("server returned %s from %s: %s", response.Status, response.Request.URL, strings.TrimSpace(string(body)))
	}

	filename := filepath.Base(requestedPath)
	if disposition := response.Header.Get("Content-Disposition"); useDisposition && disposition != "" {
		if _, parameters, parseErr := mime.ParseMediaType(disposition); parseErr == nil && parameters["filename"] != "" {
			filename = parameters["filename"]
		}
	}
	if filename == "" {
		if parsedURL, parseErr := url.Parse(sourceURL); parseErr == nil {
			filename = filepath.Base(parsedURL.Path)
		}
	}
	filename = sanitizePathPart(filename, "attachment")
	outputPath := uniquePath(filepath.Join(filepath.Dir(requestedPath), filename))
	if err := os.MkdirAll(filepath.Dir(outputPath), 0755); err != nil {
		return "", err
	}

	output, err := os.OpenFile(outputPath, os.O_CREATE|os.O_WRONLY|os.O_EXCL, 0644)
	if err != nil {
		return "", err
	}
	_, copyErr := io.Copy(output, response.Body)
	closeErr := output.Close()
	if copyErr != nil {
		os.Remove(outputPath)
		return "", copyErr
	}
	if closeErr != nil {
		return "", closeErr
	}
	return outputPath, nil
}

func sanitizePathPart(value, fallback string) string {
	value = invalidFilenameCharacters.ReplaceAllString(strings.TrimSpace(value), "_")
	value = strings.TrimRight(value, ". ")
	if value == "" || value == "." || value == ".." {
		return fallback
	}
	return value
}

func uniquePath(path string) string {
	if _, err := os.Stat(path); errors.Is(err, os.ErrNotExist) {
		return path
	}
	extension := filepath.Ext(path)
	base := strings.TrimSuffix(path, extension)
	for index := 2; ; index++ {
		candidate := fmt.Sprintf("%s (%d)%s", base, index, extension)
		if _, err := os.Stat(candidate); errors.Is(err, os.ErrNotExist) {
			return candidate
		}
	}
}
