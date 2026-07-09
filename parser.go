package main

import (
	"math"
	"regexp"
	"sort"
	"strconv"
	"strings"

	"github.com/dslipak/pdf"
)

type Option struct {
	Text    string `json:"text"`
	Checked bool   `json:"checked"`
}

type Evidence struct {
	Text    string `json:"text"`
	Checked bool   `json:"checked"`
}

type Question struct {
	Number       string     `json:"number"`
	Text         string     `json:"text"`
	Category     string     `json:"category"`
	Score        string     `json:"score,omitempty"`
	Options      []Option   `json:"options"`
	Evidence     []Evidence `json:"evidence"`
	Attachments  []string   `json:"attachments"`
	FreeResponse string     `json:"freeresponse,omitempty"`
	Comments     string     `json:"comments,omitempty"`
}

type TextElement struct {
	Text string
	X    float64
	Y    float64
}

type pendingQuestion struct {
	Number   string
	Parts    []string
	Category string
	Score    string
	StartY   float64
}

type ParsedQuestion struct {
	Question Question
	StartY   float64
	EndY     float64
}

var (
	// Whitespace after the dot prevents decimal scores such as "5.0" from matching.
	qNumRegex        = regexp.MustCompile(`^\s*(\d+)\.\s+(.+)$`)
	scoreLineRegex   = regexp.MustCompile(`(?i)^\s*(Score:\s*\d+(?:\.\d+)?|Not Scored|N/A|\d+\.\d+)\s*$`)
	trailingScoreRe  = regexp.MustCompile(`(?i)\s+(Score:\s*\d+(?:\.\d+)?|Not Scored|N/A|\d+\.\d+)\s*$`)
	categorySuffixRe = regexp.MustCompile(`(?i)\s+(N/A|Score:\s*\d+(?:\.\d+)?|\d+(?:\.\d+)?)\s*$`)

	// This extra guard prevents numbered answer text, such as "1. GDPR", from
	// being treated as a question start.
	questionLeadRe = regexp.MustCompile(`(?i)^(please|which|what|how|who|where|when|why|is|are|do|does|did|has|have|can|should|select|list|identify|describe|indicate|provide|confirm|upload|enter|name|explain|state|for|to|ai/llm|secure)\b`)
)

var categoryNames = map[string]string{
	"COMPANY INFORMATION":       "COMPANY INFORMATION",
	"SECURITY TOOLS":            "SECURITY TOOLS",
	"ORGANIZATION AND PLANNING": "ORGANIZATION AND PLANNING",
	"TECHNICAL AND TOOLING":     "TECHNICAL AND TOOLING",
	"SECURE PROCESS":            "SECURE PROCESS",
	"RECURRING HYGIENE":         "RECURRING HYGIENE",
	"VALIDATION CALL":           "VALIDATION CALL",
}

func parsePDF(path string) ([]Question, error) {
	debugLogf("pdf_json_parser: opening PDF %s", path)
	r, err := pdf.Open(path)
	if err != nil {
		return nil, err
	}

	var questions []Question
	currentCategory := "COMPANY INFORMATION"
	lastQuestionNumber := 0
	numPages := r.NumPage()
	debugLogf("pdf_json_parser: %s has %d pages", path, numPages)

	for pageNum := 1; pageNum <= numPages; pageNum++ {
		page := r.Page(pageNum)
		if page.V.IsNull() {
			debugLogf("pdf_json_parser: page %d is null; skipped", pageNum)
			continue
		}
		pageStartQuestionCount := len(questions)
		pageContent := page.Content()

		// Group and sort text elements.
		var elements []TextElement
		for _, t := range pageContent.Text {
			// Filter out header/footer.
			if t.Y > 760 || t.Y < 40 {
				continue
			}
			elements = append(elements, TextElement{
				Text: t.S,
				X:    t.X,
				Y:    t.Y,
			})
		}

		// Group elements into visual lines by Y coordinate.
		var lines [][]TextElement
		for _, el := range elements {
			found := false
			for i, line := range lines {
				if math.Abs(line[0].Y-el.Y) < 4.5 {
					lines[i] = append(line, el)
					found = true
					break
				}
			}
			if !found {
				lines = append(lines, []TextElement{el})
			}
		}

		// Sort lines by Y descending: top of page to bottom.
		sort.Slice(lines, func(i, j int) bool {
			return lines[i][0].Y > lines[j][0].Y
		})

		// Separate each line into left and right columns.
		var leftColumnText []TextElement
		var rightColumnText []TextElement

		for _, line := range lines {
			// Sort line elements by X ascending: left to right.
			sort.Slice(line, func(i, j int) bool {
				return line[i].X < line[j].X
			})

			var leftText, rightText string
			leftX := -1.0
			rightX := -1.0

			for _, el := range line {
				if el.X < 200 {
					if leftX == -1 {
						leftX = el.X
					}
					leftText += el.Text
				} else {
					if rightX == -1 {
						rightX = el.X
					}
					rightText += el.Text
				}
			}

			leftText = strings.TrimSpace(leftText)
			rightText = strings.TrimSpace(rightText)

			if leftText != "" {
				leftColumnText = append(leftColumnText, TextElement{
					Text: leftText,
					X:    leftX,
					Y:    line[0].Y,
				})
			}
			if rightText != "" {
				rightColumnText = append(rightColumnText, TextElement{
					Text: rightText,
					X:    rightX,
					Y:    line[0].Y,
				})
			}
		}

		// boundary is reached: next question, score line, respondent comments,
		// category header, or page end.
		var pageParsedQuestions []ParsedQuestion
		var currentQ *pendingQuestion
		inComments := false
		pendingCategoryPrefix := ""

		flushQuestion := func() {
			if currentQ == nil {
				return
			}
			qText := strings.Join(currentQ.Parts, " ")
			qText, score := splitTrailingScore(qText)
			if currentQ.Score == "" && score != "" {
				currentQ.Score = score
			}

			pageParsedQuestions = append(pageParsedQuestions, ParsedQuestion{
				Question: Question{
					Number:   currentQ.Number,
					Text:     cleanJoinedText([]string{qText}),
					Category: currentQ.Category,
					Score:    strings.TrimSpace(currentQ.Score),
				},
				StartY: currentQ.StartY,
			})
			currentQ = nil
		}

		setLastQuestionEndY := func(endY float64) {
			if len(pageParsedQuestions) == 0 {
				return
			}
			last := &pageParsedQuestions[len(pageParsedQuestions)-1]
			if last.EndY == 0 {
				last.EndY = endY
			}
		}

		var commentsBlock []TextElement

		for _, el := range leftColumnText {
			text := strings.TrimSpace(el.Text)

			if text == "" {
				continue
			}

			if pendingCategoryPrefix != "" {
				if category, ok := categoryHeader(pendingCategoryPrefix + " " + text); ok {
					flushQuestion()
					setLastQuestionEndY(el.Y)
					currentCategory = category
					pendingCategoryPrefix = ""
					inComments = false
					continue
				}
				pendingCategoryPrefix = ""
			}

			if prefix, ok := categoryPrefix(text); ok {
				flushQuestion()
				setLastQuestionEndY(el.Y)
				pendingCategoryPrefix = prefix
				inComments = false
				continue
			}

			if category, ok := categoryHeader(text); ok {
				flushQuestion()
				setLastQuestionEndY(el.Y)
				currentCategory = category
				inComments = false
				continue
			}

			if strings.HasPrefix(strings.ToUpper(text), "RESPONDENT COMMENTS") {
				flushQuestion()
				inComments = true
				continue
			}

			if matches := detectQuestionStart(el); matches != nil {
				flushQuestion()
				setLastQuestionEndY(el.Y)
				qNum, _ := strconv.Atoi(matches[1])
				// Ensure strictly increasing question numbers to prevent false positives.
				if qNum > lastQuestionNumber {
					inComments = false
					lastQuestionNumber = qNum
					qText, score := splitTrailingScore(matches[2])
					currentQ = &pendingQuestion{
						Number:   matches[1],
						Parts:    []string{qText},
						Category: currentCategory,
						Score:    score,
						StartY:   el.Y,
					}
					continue
				}
			}

			if scoreLineRegex.MatchString(text) {
				if currentQ != nil {
					currentQ.Score = text
					flushQuestion()
				}
				continue
			}

			if inComments {
				commentsBlock = append(commentsBlock, el)
				continue
			}

			if currentQ != nil {
				qText, score := splitTrailingScore(text)
				if qText != "" {
					currentQ.Parts = append(currentQ.Parts, qText)
				}
				if score != "" {
					currentQ.Score = score
				}
			}
		}
		flushQuestion()

		// Fallback: if a question was flushed by score/comments before its lower
		// Y-bound was known, use the next question start as the lower boundary.
		for i := 0; i < len(pageParsedQuestions)-1; i++ {
			if pageParsedQuestions[i].EndY == 0 {
				pageParsedQuestions[i].EndY = pageParsedQuestions[i+1].StartY
			}
			q := &pageParsedQuestions[i].Question
			startY := pageParsedQuestions[i].StartY
			endY := pageParsedQuestions[i].EndY

			// Grab all right column elements within Y bounds.
			var qElements []TextElement
			for _, re := range rightColumnText {
				if re.Y <= (startY+5.0) && re.Y > endY {
					qElements = append(qElements, re)
				}
			}

			// Sort right column elements by Y descending, X ascending.
			sort.Slice(qElements, func(i, j int) bool {
				if math.Abs(qElements[i].Y-qElements[j].Y) < 4.5 {
					return qElements[i].X < qElements[j].X
				}
				return qElements[i].Y > qElements[j].Y
			})

			// Group elements into lines
			var rightLines []string
			var currentLine []string
			var currentLineY float64 = -1.0

			for _, qe := range qElements {
				if currentLineY == -1.0 {
					currentLineY = qe.Y
					currentLine = append(currentLine, qe.Text)
				} else if math.Abs(currentLineY-qe.Y) < 4.5 {
					currentLine = append(currentLine, qe.Text)
				} else {
					rightLines = append(rightLines, strings.Join(currentLine, ""))
					currentLineY = qe.Y
					currentLine = []string{qe.Text}
				}
			}
			if len(currentLine) > 0 {
				rightLines = append(rightLines, strings.Join(currentLine, ""))
			}

			var currentOptionText []string
			var currentEvidenceText []string
			var optionChecked bool
			var evidenceChecked bool
			var inOption bool
			var inEvidence bool

			for _, rawTxt := range rightLines {
				txt := strings.TrimSpace(rawTxt)
				if txt == "" {
					continue
				}

				if strings.HasPrefix(txt, "\uF02E") {
					txt = strings.TrimPrefix(txt, "\uF02E")
					txt = strings.TrimSpace(txt)
				}

				// Detect attachment.
				if strings.HasPrefix(txt, "") || strings.HasPrefix(txt, "Attachment:") {
					cleanTxt := strings.TrimPrefix(txt, "")
					cleanTxt = strings.TrimPrefix(cleanTxt, "Attachment:")
					cleanTxt = strings.TrimSpace(cleanTxt)
					if cleanTxt != "" {
						files := strings.Split(cleanTxt, ",")
						for _, f := range files {
							if attachment := strings.TrimSpace(f); attachment != "" {
								q.Attachments = append(q.Attachments, attachment)
							}
						}
					}
					continue
				}

				// Free-form response for non-checkbox questions.
				if strings.HasPrefix(txt, "Free-Form Response:") {
					resp := strings.TrimPrefix(txt, "Free-Form Response:")
					resp = strings.TrimSpace(resp)
					if resp != "" {
						q.Comments = resp
					}
					continue
				}

				// Detect standard checkbox option or evidence checkbox.
				isOptChecked := strings.HasPrefix(txt, "")
				isOptUnchecked := strings.HasPrefix(txt, "")

				if isOptChecked || isOptUnchecked {
					if inOption {
						q.Options = append(q.Options, Option{
							Text:    cleanJoinedText(currentOptionText),
							Checked: optionChecked,
						})
						inOption = false
					}
					if inEvidence {
						q.Evidence = append(q.Evidence, Evidence{
							Text:    cleanJoinedText(currentEvidenceText),
							Checked: evidenceChecked,
						})
						inEvidence = false
					}

					cleanText := strings.TrimPrefix(txt, "")
					cleanText = strings.TrimPrefix(cleanText, "")
					cleanText = strings.TrimSpace(cleanText)

					// Check if it's in the required evidence block.
					if strings.Contains(strings.ToLower(cleanText), "required evidence") || strings.Contains(strings.ToLower(cleanText), "please check when provided") {
						inEvidence = true
						evidenceChecked = isOptChecked
						currentEvidenceText = []string{cleanText}
					} else {
						inOption = true
						optionChecked = isOptChecked
						currentOptionText = []string{cleanText}
					}
				} else {
					if inEvidence {
						currentEvidenceText = append(currentEvidenceText, txt)
					} else if inOption {
						currentOptionText = append(currentOptionText, txt)
					} else if len(q.Options) == 0 && len(q.Evidence) == 0 {
						if q.Comments != "" {
							q.Comments += " " + txt
						} else {
							q.Comments = txt
						}
					}
				}
			}

			if inOption {
				q.Options = append(q.Options, Option{
					Text:    cleanJoinedText(currentOptionText),
					Checked: optionChecked,
				})
			}
			if inEvidence {
				q.Evidence = append(q.Evidence, Evidence{
					Text:    cleanJoinedText(currentEvidenceText),
					Checked: evidenceChecked,
				})
			}

			// Assign respondent comments for this question.
			var qComments []string
			for _, ce := range commentsBlock {
				if ce.Y <= (startY+5.0) && ce.Y > endY {
					qComments = append(qComments, ce.Text)
				}
			}
			if len(qComments) > 0 {
				joinedComments := cleanJoinedText(qComments)
				joinedComments = strings.TrimPrefix(joinedComments, "-")
				joinedComments = strings.TrimSpace(joinedComments)
				if q.Comments != "" {
					q.Comments += "\n" + joinedComments
				} else {
					q.Comments = joinedComments
				}
			}

			if q.Category == "" {
				q.Category = currentCategory
			}
			questions = append(questions, *q)
			debugLogQuestion(pageNum, *q)
		}

		// Handle the last question on the page.
		if len(pageParsedQuestions) > 0 {
			lastIdx := len(pageParsedQuestions) - 1
			q := &pageParsedQuestions[lastIdx].Question
			startY := pageParsedQuestions[lastIdx].StartY
			endY := 0.0

			var qElements []TextElement
			for _, re := range rightColumnText {
				if re.Y <= (startY + 5.0) {
					qElements = append(qElements, re)
				}
			}

			sort.Slice(qElements, func(i, j int) bool {
				if math.Abs(qElements[i].Y-qElements[j].Y) < 4.5 {
					return qElements[i].X < qElements[j].X
				}
				return qElements[i].Y > qElements[j].Y
			})

			// Group elements into lines
			var rightLines []string
			var currentLine []string
			var currentLineY float64 = -1.0

			for _, qe := range qElements {
				if currentLineY == -1.0 {
					currentLineY = qe.Y
					currentLine = append(currentLine, qe.Text)
				} else if math.Abs(currentLineY-qe.Y) < 4.5 {
					currentLine = append(currentLine, qe.Text)
				} else {
					rightLines = append(rightLines, strings.Join(currentLine, ""))
					currentLineY = qe.Y
					currentLine = []string{qe.Text}
				}
			}
			if len(currentLine) > 0 {
				rightLines = append(rightLines, strings.Join(currentLine, ""))
			}

			var currentOptionText []string
			var currentEvidenceText []string
			var optionChecked bool
			var evidenceChecked bool
			var inOption bool
			var inEvidence bool

			for _, rawTxt := range rightLines {
				txt := strings.TrimSpace(rawTxt)
				if txt == "" {
					continue
				}

				if strings.HasPrefix(txt, "\uF02E") {
					txt = strings.TrimPrefix(txt, "\uF02E")
					txt = strings.TrimSpace(txt)
				}

				if strings.HasPrefix(txt, "") || strings.HasPrefix(txt, "Attachment:") {
					cleanTxt := strings.TrimPrefix(txt, "")
					cleanTxt = strings.TrimPrefix(cleanTxt, "Attachment:")
					cleanTxt = strings.TrimSpace(cleanTxt)
					if cleanTxt != "" {
						files := strings.Split(cleanTxt, ",")
						for _, f := range files {
							if attachment := strings.TrimSpace(f); attachment != "" {
								q.Attachments = append(q.Attachments, attachment)
							}
						}
					}
					continue
				}

				if strings.HasPrefix(txt, "Free-Form Response:") {
					resp := strings.TrimPrefix(txt, "Free-Form Response:")
					resp = strings.TrimSpace(resp)
					if resp != "" {
						q.Comments = resp
					}
					continue
				}

				isOptChecked := strings.HasPrefix(txt, "")
				isOptUnchecked := strings.HasPrefix(txt, "")

				if isOptChecked || isOptUnchecked {
					if inOption {
						q.Options = append(q.Options, Option{
							Text:    cleanJoinedText(currentOptionText),
							Checked: optionChecked,
						})
						inOption = false
					}
					if inEvidence {
						q.Evidence = append(q.Evidence, Evidence{
							Text:    cleanJoinedText(currentEvidenceText),
							Checked: evidenceChecked,
						})
						inEvidence = false
					}

					cleanText := strings.TrimPrefix(txt, "")
					cleanText = strings.TrimPrefix(cleanText, "")
					cleanText = strings.TrimSpace(cleanText)

					if strings.Contains(strings.ToLower(cleanText), "required evidence") || strings.Contains(strings.ToLower(cleanText), "please check when provided") {
						inEvidence = true
						evidenceChecked = isOptChecked
						currentEvidenceText = []string{cleanText}
					} else {
						inOption = true
						optionChecked = isOptChecked
						currentOptionText = []string{cleanText}
					}
				} else {
					if inEvidence {
						currentEvidenceText = append(currentEvidenceText, txt)
					} else if inOption {
						currentOptionText = append(currentOptionText, txt)
					} else if len(q.Options) == 0 && len(q.Evidence) == 0 {
						if q.Comments != "" {
							q.Comments += " " + txt
						} else {
							q.Comments = txt
						}
					}
				}
			}

			if inOption {
				q.Options = append(q.Options, Option{
					Text:    cleanJoinedText(currentOptionText),
					Checked: optionChecked,
				})
			}
			if inEvidence {
				q.Evidence = append(q.Evidence, Evidence{
					Text:    cleanJoinedText(currentEvidenceText),
					Checked: evidenceChecked,
				})
			}

			var qComments []string
			for _, ce := range commentsBlock {
				if ce.Y <= (startY+5.0) && ce.Y > endY {
					qComments = append(qComments, ce.Text)
				}
			}
			if len(qComments) > 0 {
				joinedComments := cleanJoinedText(qComments)
				joinedComments = strings.TrimPrefix(joinedComments, "-")
				joinedComments = strings.TrimSpace(joinedComments)
				if q.Comments != "" {
					q.Comments += "\n" + joinedComments
				} else {
					q.Comments = joinedComments
				}
			}

			if q.Category == "" {
				q.Category = currentCategory
			}
			questions = append(questions, *q)
			debugLogQuestion(pageNum, *q)
		}

		debugLogf(
			"pdf_json_parser: page %d summary: raw_text=%d filtered_elements=%d visual_lines=%d left_lines=%d right_lines=%d detected_questions=%d emitted_questions=%d",
			pageNum,
			len(pageContent.Text),
			len(elements),
			len(lines),
			len(leftColumnText),
			len(rightColumnText),
			len(pageParsedQuestions),
			len(questions)-pageStartQuestionCount,
		)
	}

	for i := range questions {
		questions[i].Text = cleanJoinedText([]string{questions[i].Text})
		questions[i].Comments = strings.TrimSpace(questions[i].Comments)
	}

	debugLogf("pdf_json_parser: completed %s with %d questions", path, len(questions))
	return questions, nil
}

func parseAssessmentScores(path string) (int, map[string]int, bool, error) {
	r, err := pdf.Open(path)
	if err != nil {
		return 0, nil, false, err
	}

	overall := 0
	categoryScores := make(map[string]int)
	scoreRe := regexp.MustCompile(`(?i)SCORE:\s*(\d{1,3})`)
	categoryScoreRe := regexp.MustCompile(`(?i)(Recurring Hygiene|Organization and Planning|Technical and Tooling|Secure Process)\s*(\d{1,3})`)

	for pageNum := 1; pageNum <= r.NumPage(); pageNum++ {
		page := r.Page(pageNum)
		if page.V.IsNull() {
			continue
		}

		for _, line := range extractVisualLines(page.Content().Text) {
			if overall == 0 {
				if match := scoreRe.FindStringSubmatch(line); len(match) == 2 {
					if score, err := strconv.Atoi(match[1]); err == nil {
						overall = score
					}
				}
			}

			for _, match := range categoryScoreRe.FindAllStringSubmatch(line, -1) {
				if len(match) != 3 {
					continue
				}
				score, err := strconv.Atoi(match[2])
				if err != nil {
					continue
				}
				categoryScores[summaryCategoryName(match[1])] = score
			}
		}

		if overall > 0 && len(categoryScores) >= 4 {
			return overall, categoryScores, true, nil
		}
	}

	return overall, categoryScores, overall > 0 || len(categoryScores) > 0, nil
}

func extractVisualLines(texts []pdf.Text) []string {
	sort.Slice(texts, func(i, j int) bool {
		if math.Abs(texts[i].Y-texts[j].Y) < 4.5 {
			return texts[i].X < texts[j].X
		}
		return texts[i].Y > texts[j].Y
	})

	var lines []string
	var currentY float64
	var current strings.Builder
	for _, text := range texts {
		if text.S == "" {
			continue
		}
		if current.Len() == 0 {
			currentY = text.Y
		} else if math.Abs(currentY-text.Y) >= 4.5 {
			lines = append(lines, strings.TrimSpace(current.String()))
			current.Reset()
			currentY = text.Y
		}
		current.WriteString(text.S)
	}
	if current.Len() > 0 {
		lines = append(lines, strings.TrimSpace(current.String()))
	}

	return lines
}

func summaryCategoryName(name string) string {
	switch strings.ToLower(strings.Join(strings.Fields(name), " ")) {
	case "recurring hygiene":
		return "RECURRING HYGIENE"
	case "organization and planning":
		return "ORGANIZATION AND PLANNING"
	case "technical and tooling":
		return "TECHNICAL AND TOOLING"
	case "secure process":
		return "SECURE PROCESS"
	default:
		return strings.ToUpper(name)
	}
}

func detectQuestionStart(el TextElement) []string {
	text := strings.TrimSpace(el.Text)
	matches := qNumRegex.FindStringSubmatch(text)
	if len(matches) < 3 {
		return nil
	}
	// This narrow guard rejects respondent comments and score lines that are slightly
	// indented to the right. Adjust if the source template changes.
	if el.X < 40.0 || el.X > 52.5 {
		return nil
	}
	qText, _ := splitTrailingScore(matches[2])
	if !questionLeadRe.MatchString(strings.TrimSpace(qText)) {
		return nil
	}
	return matches
}

func debugLogQuestion(pageNum int, q Question) {
	debugLogf(
		"pdf_json_parser: page=%d question=%s category=%q score=%q options=%d evidence=%d attachments=%d comments=%t text=%q",
		pageNum,
		q.Number,
		q.Category,
		q.Score,
		len(q.Options),
		len(q.Evidence),
		len(q.Attachments),
		q.Comments != "",
		q.Text,
	)
}

func categoryPrefix(text string) (string, bool) {
	switch normalizeHeaderText(text) {
	case "RECURRING", "VALIDATION":
		return normalizeHeaderText(text), true
	default:
		return "", false
	}
}

func categoryHeader(text string) (string, bool) {
	category, ok := categoryNames[normalizeHeaderText(text)]
	return category, ok
}

func normalizeHeaderText(text string) string {
	text = strings.ToUpper(strings.Join(strings.Fields(text), " "))
	text = categorySuffixRe.ReplaceAllString(text, "")
	return strings.TrimSpace(text)
}

func splitTrailingScore(text string) (string, string) {
	text = strings.TrimSpace(text)
	match := trailingScoreRe.FindStringSubmatchIndex(text)
	if match == nil {
		return text, ""
	}

	fullStart := match[0]
	scoreStart := match[2]
	scoreEnd := match[3]

	cleanText := strings.TrimSpace(text[:fullStart])
	score := strings.TrimSpace(text[scoreStart:scoreEnd])
	return cleanText, score
}

func cleanJoinedText(parts []string) string {
	var clean []string
	for _, p := range parts {
		trimmed := strings.TrimSpace(p)
		if trimmed != "" {
			clean = append(clean, trimmed)
		}
	}
	joined := strings.Join(clean, " ")
	// Strip out residual encoding artifacts from the raw PDF text:
	joined = strings.ReplaceAll(joined, "  ", " ")
	joined = strings.ReplaceAll(joined, "  ", " ")
	joined = strings.ReplaceAll(joined, "  ", " ")
	joined = strings.ReplaceAll(joined, "  ", " ")
	replacer := strings.NewReplacer(
		" .", ".",
		" ,", ",",
		" ;", ";",
		" :", ":",
		" ?", "?",
		" !", "!",
		" )", ")",
		"( ", "(",
	)
	return strings.TrimSpace(replacer.Replace(joined))
}
