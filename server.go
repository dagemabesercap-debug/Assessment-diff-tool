package main

import (
	"sync"

	"archive/zip"
	"encoding/json"
	"flag"
	"fmt"
	"io"
	"log"
	"math"
	"net/http"
	"net/http/httputil"
	"net/url"
	"os"
	"path/filepath"
	"sort"
	"strings"
	"time"
)

type Portco struct {
	Name           string                    `json:"name"`
	Years          []string                  `json:"years"`
	Scores         map[string]int            `json:"scores"`
	CategoryScores map[string]map[string]int `json:"categoryScores"`
}

var (
	portcosMutex sync.Mutex
	debugMode         bool
	parserDebugLogger *log.Logger
	dataDirectory     = envOrDefault("ASSESSMENT_DATA_DIR", "data")
)

func envOrDefault(name, fallback string) string {
	if value := strings.TrimSpace(os.Getenv(name)); value != "" {
		return value
	}
	return fallback
}

func parserDebugLogPath() string {
	return filepath.Join(dataDirectory, "logs", "pdf_json_parser.log")
}

func loadPortcos() ([]Portco, error) {
	dbPath := filepath.Join(dataDirectory, "portcos.json")
	if _, err := os.Stat(dbPath); os.IsNotExist(err) {
		portcos := []Portco{}
		if err := os.MkdirAll(dataDirectory, 0700); err != nil {
			return nil, err
		}
		if err := savePortcos(portcos); err != nil {
			return nil, err
		}

		return portcos, nil
	}

	f, err := os.Open(dbPath)
	if err != nil {
		return nil, err
	}
	defer f.Close()

	var portcos []Portco
	err = json.NewDecoder(f).Decode(&portcos)
	if err != nil {
		return nil, err
	}

	return portcos, nil
}

func savePortcos(portcos []Portco) error {
	if err := os.MkdirAll(dataDirectory, 0700); err != nil {
		return err
	}
	dbPath := filepath.Join(dataDirectory, "portcos.json")
	f, err := os.Create(dbPath)
	if err != nil {
		return err
	}
	defer f.Close()

	encoder := json.NewEncoder(f)
	encoder.SetIndent("", "  ")
	return encoder.Encode(portcos)
}

func portcoDataDir(companyName string) (string, error) {
	companyName = strings.TrimSpace(companyName)
	if companyName == "" {
		return "", fmt.Errorf("company name is required")
	}
	if filepath.IsAbs(companyName) || strings.ContainsAny(companyName, `/\:`) || strings.ContainsRune(companyName, 0) {
		return "", fmt.Errorf("company name contains invalid path characters")
	}
	if companyName == "." || companyName == ".." {
		return "", fmt.Errorf("company name is invalid")
	}

	return filepath.Join(dataDirectory, "portcos", companyName), nil
}

func configureDebugLogging(enabled bool) (*os.File, error) {
	if !enabled {
		return nil, nil
	}

	logPath := parserDebugLogPath()
	if err := os.MkdirAll(filepath.Dir(logPath), 0700); err != nil {
		return nil, err
	}

	logFile, err := os.OpenFile(logPath, os.O_CREATE|os.O_WRONLY|os.O_APPEND, 0600)
	if err != nil {
		return nil, err
	}

	parserDebugLogger = log.New(logFile, "", log.LstdFlags|log.Lmicroseconds)
	debugLogf("debug logging enabled for pdf_json_parser output")
	return logFile, nil
}

func debugLogf(format string, args ...any) {
	if parserDebugLogger == nil {
		return
	}
	parserDebugLogger.Printf(format, args...)
}

func debugLogJSON(label string, value any) {
	if parserDebugLogger == nil {
		return
	}

	data, err := json.MarshalIndent(value, "", "  ")
	if err != nil {
		debugLogf("%s: failed to marshal JSON output: %v", label, err)
		return
	}

	debugLogf("%s:\n%s", label, data)
}

func main() {
	flag.BoolVar(&debugMode, "debug", false, "write PDF parser debug output to logs/pdf_json_parser.log")
	flag.Parse()

	debugLogFile, debugErr := configureDebugLogging(debugMode)
	if debugErr != nil {
		fmt.Printf("Error initializing debug logging: %v\n", debugErr)
	} else if debugLogFile != nil {
		defer func() {
			debugLogf("debug logging stopped")
			if err := debugLogFile.Close(); err != nil {
				fmt.Printf("Error closing debug log: %v\n", err)
			}
		}()
		fmt.Printf("Debug logging enabled at %s\n", parserDebugLogPath())
	}

	// Initialize data folders and DB
	_, err := loadPortcos()
	if err != nil {
		fmt.Printf("Error initializing database: %v\n", err)
	}

	port := envOrDefault("PORT", "8090")
	if !strings.Contains(port, ":") {
		port = ":" + port
	}
	fmt.Printf("Starting Portfolio Assessment Server on http://localhost%s\n", port)

	// API Handlers
	http.HandleFunc("/api/portcos", handlePortcos)
	http.HandleFunc("/api/portcos/upload", handleUpload)
	http.HandleFunc("/api/portcos/grab", handleGrabAssessments)
	http.HandleFunc("/api/attachments", handleAttachmentDownload)
	http.HandleFunc("/api/reports", handleReportDownload)
	http.HandleFunc("/api/evidence", handleEvidenceDownload)
	http.HandleFunc("/api/diff", handleDiff)
	http.HandleFunc("/health/live", handleHealth)
	http.HandleFunc("/health/ready", handleHealth)

	// noVNC iframe endpoint - proxies to the internal websockify service
	http.HandleFunc("/novnc-view/", handleNoVNCView)

	http.Handle("/", http.FileServer(http.FS(staticFiles)))

	server := &http.Server{
		Addr:              port,
		Handler:           http.DefaultServeMux,
		ReadHeaderTimeout: 10 * time.Second,
		IdleTimeout:       60 * time.Second,
	}
	err = server.ListenAndServe()
	if err != nil {
		fmt.Printf("Error starting server: %v\n", err)
	}
}

func handleHealth(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}
	if _, err := os.Stat(filepath.Join(dataDirectory, "portcos.json")); err != nil {
		http.Error(w, "storage unavailable", http.StatusServiceUnavailable)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	_, _ = w.Write([]byte(`{"status":"ok"}`))
}

// Handlers
func handlePortcos(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	switch r.Method {
	case http.MethodGet:
		handleListPortcos(w, r)
	case http.MethodDelete:
		handleDeletePortco(w, r)
	default:
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
	}
}

func handleListPortcos(w http.ResponseWriter, r *http.Request) {
	portcos, err := loadPortcos()
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	json.NewEncoder(w).Encode(portcos)
}

func handleDeletePortco(w http.ResponseWriter, r *http.Request) {
	portcosMutex.Lock()
	defer portcosMutex.Unlock()

	companyName := strings.TrimSpace(r.URL.Query().Get("name"))
	if companyName == "" {
		http.Error(w, "Missing query parameter: name", http.StatusBadRequest)
		return
	}
	year := strings.TrimSpace(r.URL.Query().Get("year"))

	portcoDir, err := portcoDataDir(companyName)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	portcos, err := loadPortcos()
	if err != nil {
		http.Error(w, "Failed loading portfolio companies: "+err.Error(), http.StatusInternalServerError)
		return
	}

	foundIdx := -1
	for idx, p := range portcos {
		if p.Name == companyName {
			foundIdx = idx
			break
		}
	}
	if foundIdx == -1 {
		http.Error(w, "Portfolio company not found", http.StatusNotFound)
		return
	}

	if year != "" {
		p := &portcos[foundIdx]
		yearIdx := -1
		for i, y := range p.Years {
			if y == year {
				yearIdx = i
				break
			}
		}
		if yearIdx == -1 {
			http.Error(w, "Year not found in portfolio company", http.StatusNotFound)
			return
		}

		p.Years = append(p.Years[:yearIdx], p.Years[yearIdx+1:]...)
		delete(p.Scores, year)
		delete(p.CategoryScores, year)

		if err := savePortcos(portcos); err != nil {
			http.Error(w, "Failed saving portfolio database: "+err.Error(), http.StatusInternalServerError)
			return
		}

		yearDir := filepath.Join(portcoDir, year)
		if err := os.RemoveAll(yearDir); err != nil {
			http.Error(w, "Deleted portfolio metadata but failed removing year files: "+err.Error(), http.StatusInternalServerError)
			return
		}

		w.WriteHeader(http.StatusOK)
		w.Write([]byte(`{"success":true}`))
		return
	}

	portcos = append(portcos[:foundIdx], portcos[foundIdx+1:]...)
	if err := savePortcos(portcos); err != nil {
		http.Error(w, "Failed saving portfolio database: "+err.Error(), http.StatusInternalServerError)
		return
	}

	if err := os.RemoveAll(portcoDir); err != nil {
		http.Error(w, "Deleted portfolio metadata but failed removing company files: "+err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
	w.Write([]byte(`{"success":true}`))
}

func handleUpload(w http.ResponseWriter, r *http.Request) {
	portcosMutex.Lock()
	defer portcosMutex.Unlock()

	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	// Parse multi-part form
	err := r.ParseMultipartForm(50 << 20) // Max 50MB
	if err != nil {
		http.Error(w, "Failed to parse form: "+err.Error(), http.StatusBadRequest)
		return
	}

	companyName := strings.TrimSpace(r.FormValue("company_name"))
	year := strings.TrimSpace(r.FormValue("year"))

	if companyName == "" || year == "" {
		http.Error(w, "Missing company_name or year", http.StatusBadRequest)
		return
	}

	file, _, err := r.FormFile("file")
	if err != nil {
		http.Error(w, "Failed to get file: "+err.Error(), http.StatusBadRequest)
		return
	}
	defer file.Close()

	// Create temp directories
	portcoDir, err := portcoDataDir(companyName)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	err = os.MkdirAll(portcoDir, 0755)
	if err != nil {
		http.Error(w, "Failed to create company data directory: "+err.Error(), http.StatusInternalServerError)
		return
	}

	// Save temporary PDF
	pdfPath := filepath.Join(portcoDir, year+".pdf")
	tempFile, err := os.Create(pdfPath)
	if err != nil {
		http.Error(w, "Failed to save PDF: "+err.Error(), http.StatusInternalServerError)
		return
	}
	defer tempFile.Close()

	_, err = io.Copy(tempFile, file)
	if err != nil {
		http.Error(w, "Failed writing PDF contents: "+err.Error(), http.StatusInternalServerError)
		return
	}

	// Run Parser logic
	fmt.Printf("Parsing uploaded PDF for %s (%s)...\n", companyName, year)
	debugLogf("pdf_json_parser: Parsing %s to JSON for company=%q year=%q", pdfPath, companyName, year)
	questions, err := parsePDF(pdfPath)
	if err != nil {
		debugLogf("pdf_json_parser: Error parsing %s: %v", pdfPath, err)
		http.Error(w, "Failed to parse assessment PDF: "+err.Error(), http.StatusInternalServerError)
		return
	}
	debugLogf("pdf_json_parser: Parsed %d questions from %s", len(questions), pdfPath)

	// Save parsed JSON
	jsonPath := filepath.Join(portcoDir, year+".json")
	jsonData, err := json.MarshalIndent(questions, "", "  ")
	if err != nil {
		debugLogf("pdf_json_parser: Error marshalling JSON for %s: %v", pdfPath, err)
		http.Error(w, "Failed to serialize JSON: "+err.Error(), http.StatusInternalServerError)
		return
	}
	debugLogJSON(fmt.Sprintf("pdf_json_parser: JSON output for %s (%s)", companyName, year), questions)

	err = os.WriteFile(jsonPath, jsonData, 0644)
	if err != nil {
		debugLogf("pdf_json_parser: Error writing output file %s: %v", jsonPath, err)
		http.Error(w, "Failed to write JSON output: "+err.Error(), http.StatusInternalServerError)
		return
	}
	debugLogf("pdf_json_parser: Saved %d questions to %s", len(questions), jsonPath)

	// Use explicit PDF summary scores when present; fall back to dynamic
	// calculation for templates that do not expose a summary page.
	overall, catScores, foundSummaryScores, scoreErr := parseAssessmentScores(pdfPath)
	if scoreErr != nil {
		debugLogf("pdf_json_parser: Error parsing summary scores from %s: %v", pdfPath, scoreErr)
	}
	if !foundSummaryScores {
		overall, catScores = calculateScoresForQuestions(questions)
	}

	// Load DB, update with new year/scores, and save
	portcos, err := loadPortcos()
	if err != nil {
		portcos = []Portco{}
	}

	foundIdx := -1
	for idx, p := range portcos {
		if p.Name == companyName {
			foundIdx = idx
			break
		}
	}

	if foundIdx == -1 {
		// New Portfolio Company
		newP := Portco{
			Name:  companyName,
			Years: []string{year},
			Scores: map[string]int{
				year: overall,
			},
			CategoryScores: map[string]map[string]int{
				year: catScores,
			},
		}
		portcos = append(portcos, newP)
	} else {
		// Existing Portfolio Company - Update/Add year
		p := &portcos[foundIdx]
		yearExists := false
		for _, y := range p.Years {
			if y == year {
				yearExists = true
				break
			}
		}
		if !yearExists {
			p.Years = append(p.Years, year)
			// Sort years
			sort.Strings(p.Years)
		}

		p.Scores[year] = overall
		p.CategoryScores[year] = catScores
	}

	savePortcos(portcos)

	fmt.Printf("Successfully saved parsed JSON and updated scores for %s (%s)\n", companyName, year)
	w.WriteHeader(http.StatusOK)
	w.Write([]byte(`{"success":true}`))
}

type grabAssessmentsPayload struct {
	CompanyName string                  `json:"company_name"`
	Assessments []assessmentGrabRequest `json:"assessments"`
}

func handleGrabAssessments(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var payload grabAssessmentsPayload
	decoder := json.NewDecoder(io.LimitReader(r.Body, 1<<20))
	decoder.DisallowUnknownFields()
	if err := decoder.Decode(&payload); err != nil {
		http.Error(w, "Invalid request: "+err.Error(), http.StatusBadRequest)
		return
	}
	payload.CompanyName = strings.TrimSpace(payload.CompanyName)
	portcoDir, err := portcoDataDir(payload.CompanyName)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	if len(payload.Assessments) == 0 {
		http.Error(w, "At least one assessment code and year is required", http.StatusBadRequest)
		return
	}
	seenYears := make(map[string]bool)
	for index := range payload.Assessments {
		assessment := &payload.Assessments[index]
		assessment.Year = strings.TrimSpace(assessment.Year)
		assessment.Code = strings.TrimSpace(assessment.Code)
		if assessment.Year == "" || assessment.Code == "" {
			http.Error(w, "Every assessment requires both a code and a year", http.StatusBadRequest)
			return
		}
		if strings.ContainsAny(assessment.Year, `/\\:`) || assessment.Year == "." || assessment.Year == ".." {
			http.Error(w, "Invalid assessment year", http.StatusBadRequest)
			return
		}
		if seenYears[assessment.Year] {
			http.Error(w, "Each assessment year must be unique", http.StatusBadRequest)
			return
		}
		seenYears[assessment.Year] = true
	}
	if err := os.MkdirAll(portcoDir, 0755); err != nil {
		http.Error(w, "Failed to create company folder: "+err.Error(), http.StatusInternalServerError)
		return
	}

	grabbed, err := grabAssessments(r.Context(), portcoDir, payload.Assessments)
	if err != nil {
		http.Error(w, "Document grabber failed: "+err.Error(), http.StatusInternalServerError)
		return
	}
	for _, assessment := range grabbed {
		debugLogJSON(fmt.Sprintf("document_grabber: browser scrape for %s (%s)", payload.CompanyName, assessment.Year), assessment.Scrape)
		if err := importGrabbedAssessment(payload.CompanyName, portcoDir, assessment); err != nil {
			http.Error(w, "Failed to import "+assessment.Year+": "+err.Error(), http.StatusInternalServerError)
			return
		}
	}

	warnings := make([]string, 0)
	for _, assessment := range grabbed {
		nonEmptyComments := 0
		nonEmptyResponses := 0
		for _, question := range assessment.Scrape.Questions {
			if strings.TrimSpace(question.Comments) != "" {
				nonEmptyComments++
			}
			if strings.TrimSpace(question.FreeResponse) != "" {
				nonEmptyResponses++
			}
		}
		if nonEmptyComments == 0 {
			warnings = append(warnings, fmt.Sprintf("No non-empty browser comments were extracted for %s; inspect the assessment page comment element if comments were expected.", assessment.Year))
		}
		if nonEmptyResponses == 0 {
			warnings = append(warnings, fmt.Sprintf("No non-empty browser written responses were extracted for %s; %d response cards were loaded.", assessment.Year, assessment.Scrape.ResponseCardCount))
		}
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]any{"success": true, "company_name": payload.CompanyName, "years": len(grabbed), "warnings": warnings})
}

func importGrabbedAssessment(companyName, portcoDir string, assessment grabbedAssessment) error {
	portcosMutex.Lock()
	defer portcosMutex.Unlock()

	questions, err := parsePDF(assessment.ReportPath)
	if err != nil {
		return fmt.Errorf("parse downloaded result summary: %w", err)
	}
	scrapedByNumber := make(map[string]scrapedQuestion, len(assessment.Scrape.Questions))
	responseNumbers := make(map[string]bool)
	for _, scraped := range assessment.Scrape.Questions {
		scrapedByNumber[scraped.QuestionNumber] = scraped
		if strings.TrimSpace(scraped.Comments) != "" || strings.TrimSpace(scraped.FreeResponse) != "" {
			responseNumbers[scraped.QuestionNumber] = true
		}
	}
	matchedResponseNumbers := make(map[string]bool)
	for index := range questions {
		scraped, ok := scrapedByNumber[questions[index].Number]
		if !ok {
			continue
		}
		if responseNumbers[scraped.QuestionNumber] {
			matchedResponseNumbers[scraped.QuestionNumber] = true
		}
		browserComments := strings.TrimSpace(scraped.Comments)
		if browserComments != "" {
			questions[index].Comments = browserComments
		}
		browserFreeResponse := strings.TrimSpace(scraped.FreeResponse)
		if browserFreeResponse != "" {
			questions[index].FreeResponse = browserFreeResponse
		}
		if len(scraped.Attachments) > 0 {
			questions[index].Attachments = questions[index].Attachments[:0]
			for _, item := range scraped.Attachments {
				questions[index].Attachments = append(questions[index].Attachments, item.Name)
			}
		}
	}
	if len(responseNumbers) > len(matchedResponseNumbers) {
		unmatched := make([]string, 0, len(responseNumbers)-len(matchedResponseNumbers))
		for number := range responseNumbers {
			if !matchedResponseNumbers[number] {
				unmatched = append(unmatched, number)
			}
		}
		sort.Strings(unmatched)
		return fmt.Errorf("browser responses were extracted but could not be matched to report questions: %s", strings.Join(unmatched, ", "))
	}

	jsonData, err := json.MarshalIndent(questions, "", "  ")
	if err != nil {
		return err
	}
	if err := os.WriteFile(filepath.Join(portcoDir, assessment.Year+".json"), jsonData, 0644); err != nil {
		return err
	}
	overall, categoryScores, foundSummaryScores, scoreErr := parseAssessmentScores(assessment.ReportPath)
	if scoreErr != nil {
		debugLogf("document_grabber: score parsing failed for %s (%s): %v", companyName, assessment.Year, scoreErr)
	}
	if !foundSummaryScores {
		overall, categoryScores = calculateScoresForQuestions(questions)
	}
	return upsertPortcoAssessment(companyName, assessment.Year, overall, categoryScores)
}

func upsertPortcoAssessment(companyName, year string, overall int, categoryScores map[string]int) error {
	portcos, err := loadPortcos()
	if err != nil {
		return err
	}
	for index := range portcos {
		if portcos[index].Name != companyName {
			continue
		}
		p := &portcos[index]
		if p.Scores == nil {
			p.Scores = make(map[string]int)
		}
		if p.CategoryScores == nil {
			p.CategoryScores = make(map[string]map[string]int)
		}
		found := false
		for _, existingYear := range p.Years {
			if existingYear == year {
				found = true
				break
			}
		}
		if !found {
			p.Years = append(p.Years, year)
			sort.Strings(p.Years)
		}
		p.Scores[year] = overall
		p.CategoryScores[year] = categoryScores
		return savePortcos(portcos)
	}
	portcos = append(portcos, Portco{
		Name: companyName, Years: []string{year},
		Scores:         map[string]int{year: overall},
		CategoryScores: map[string]map[string]int{year: categoryScores},
	})
	return savePortcos(portcos)
}

func handleAttachmentDownload(w http.ResponseWriter, r *http.Request) {
	company, year := r.URL.Query().Get("portco"), r.URL.Query().Get("year")
	question, filename := r.URL.Query().Get("question"), filepath.Base(r.URL.Query().Get("file"))
	portcoDir, err := portcoDataDir(company)
	if err != nil || !validStoragePart(year) || !validStoragePart(question) || filename == "" || filename == "." {
		http.Error(w, "Invalid attachment request", http.StatusBadRequest)
		return
	}
	path := filepath.Join(portcoDir, year, "attachments", "Question "+sanitizePathPart(question, "Unknown"), filename)
	w.Header().Set("Content-Disposition", fmt.Sprintf(`attachment; filename=%q`, filename))
	http.ServeFile(w, r, path)
}

func handleReportDownload(w http.ResponseWriter, r *http.Request) {
	company, year := r.URL.Query().Get("portco"), r.URL.Query().Get("year")
	portcoDir, err := portcoDataDir(company)
	if err != nil || !validStoragePart(year) {
		http.Error(w, "Invalid report request", http.StatusBadRequest)
		return
	}
	w.Header().Set("Content-Disposition", fmt.Sprintf(`attachment; filename=%q`, sanitizePathPart(company+" - Assessment Report ("+year+").pdf", "assessment-report.pdf")))
	http.ServeFile(w, r, filepath.Join(portcoDir, year+".pdf"))
}

func handleEvidenceDownload(w http.ResponseWriter, r *http.Request) {
	company, year := r.URL.Query().Get("portco"), r.URL.Query().Get("year")
	portcoDir, err := portcoDataDir(company)
	if err != nil || !validStoragePart(year) {
		http.Error(w, "Invalid evidence request", http.StatusBadRequest)
		return
	}

	attachmentsRoot := filepath.Join(portcoDir, year, "attachments")
	files, err := evidenceFiles(attachmentsRoot)
	if err != nil {
		if os.IsNotExist(err) {
			http.Error(w, "No evidence files found for this assessment year", http.StatusNotFound)
			return
		}
		http.Error(w, "Failed to read evidence files: "+err.Error(), http.StatusInternalServerError)
		return
	}
	if len(files) == 0 {
		http.Error(w, "No evidence files found for this assessment year", http.StatusNotFound)
		return
	}

	filename := sanitizePathPart(company+" - Evidence ("+year+").zip", "assessment-evidence.zip")
	w.Header().Set("Content-Type", "application/zip")
	w.Header().Set("Content-Disposition", fmt.Sprintf(`attachment; filename=%q`, filename))

	archive := zip.NewWriter(w)
	for _, path := range files {
		info, err := os.Stat(path)
		if err != nil {
			archive.Close()
			return
		}
		relativePath, err := filepath.Rel(attachmentsRoot, path)
		if err != nil {
			archive.Close()
			return
		}
		header, err := zip.FileInfoHeader(info)
		if err != nil {
			archive.Close()
			return
		}
		header.Name = filepath.ToSlash(relativePath)
		header.Method = zip.Deflate
		entry, err := archive.CreateHeader(header)
		if err != nil {
			archive.Close()
			return
		}
		file, err := os.Open(path)
		if err != nil {
			archive.Close()
			return
		}
		_, copyErr := io.Copy(entry, file)
		closeErr := file.Close()
		if copyErr != nil || closeErr != nil {
			archive.Close()
			return
		}
	}
	_ = archive.Close()
}

func evidenceFiles(root string) ([]string, error) {
	files := make([]string, 0)
	err := filepath.WalkDir(root, func(path string, entry os.DirEntry, err error) error {
		if err != nil {
			return err
		}
		if entry.Type().IsRegular() {
			files = append(files, path)
		}
		return nil
	})
	if err != nil {
		return nil, err
	}
	sort.Strings(files)
	return files, nil
}

func validStoragePart(value string) bool {
	return value != "" && value != "." && value != ".." && !filepath.IsAbs(value) && !strings.ContainsAny(value, `/\\:`) && !strings.ContainsRune(value, 0)
}

func handleDiff(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	company := r.URL.Query().Get("portco")
	yearA := r.URL.Query().Get("yearA")
	yearB := r.URL.Query().Get("yearB")

	if company == "" || yearA == "" || yearB == "" {
		http.Error(w, "Missing query parameters: portco, yearA, yearB", http.StatusBadRequest)
		return
	}

	portcoDir, err := portcoDataDir(company)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	jsonAPath := filepath.Join(portcoDir, yearA+".json")
	jsonBPath := filepath.Join(portcoDir, yearB+".json")

	qA, err := readJSONQuestions(jsonAPath)
	if err != nil {
		status := http.StatusInternalServerError
		if os.IsNotExist(err) {
			status = http.StatusNotFound
		}
		http.Error(w, "Failed reading year A JSON: "+err.Error(), status)
		return
	}

	qB, err := readJSONQuestions(jsonBPath)
	if err != nil {
		status := http.StatusInternalServerError
		if os.IsNotExist(err) {
			status = http.StatusNotFound
		}
		http.Error(w, "Failed reading year B JSON: "+err.Error(), status)
		return
	}

	diffs := CompareQuestionLists(qA, qB)
	json.NewEncoder(w).Encode(diffs)
}

func readJSONQuestions(path string) ([]Question, error) {
	f, err := os.Open(path)
	if err != nil {
		return nil, err
	}
	defer f.Close()

	var qs []Question
	err = json.NewDecoder(f).Decode(&qs)
	return qs, err
}

func calculateScoresForQuestions(questions []Question) (int, map[string]int) {
	catSum := make(map[string]float64)
	catCount := make(map[string]int)

	for _, q := range questions {
		if q.Category == "COMPANY INFORMATION" || q.Category == "SECURITY TOOLS" || q.Category == "VALIDATION CALL" {
			continue
		}

		scoreStr := q.Score
		if scoreStr == "Not Scored" || scoreStr == "N/A" || scoreStr == "" {
			if len(q.Options) > 0 {
				score := calculateDynamicScore(q)
				catSum[q.Category] += score
				catCount[q.Category]++
			}
		} else {
			if val, ok := parseScore(scoreStr); ok {
				catSum[q.Category] += val
				catCount[q.Category]++
			}
		}
	}

	categoryScores := make(map[string]int)
	var overallSum float64
	var overallCount int

	for cat, sum := range catSum {
		count := catCount[cat]
		if count > 0 {
			avgPct := (sum / (float64(count) * 5.0)) * 100.0
			categoryScores[cat] = int(math.Round(avgPct))
			overallSum += sum
			overallCount += count
		}
	}

	overallScore := 0
	if overallCount > 0 {
		overallScore = int(math.Round((overallSum / (float64(overallCount) * 5.0)) * 100.0))
	}

	return overallScore, categoryScores
}

func calculateDynamicScore(q Question) float64 {
	noneChecked := false
	var checkableOpts []Option
	for _, opt := range q.Options {
		lowerText := strings.ToLower(opt.Text)
		if strings.Contains(lowerText, "none of these") || strings.Contains(lowerText, "none of the above") {
			if opt.Checked {
				noneChecked = true
			}
		} else {
			checkableOpts = append(checkableOpts, opt)
		}
	}

	if noneChecked {
		return 0.0
	}

	if len(checkableOpts) == 0 {
		checkableOpts = q.Options
	}

	checkedCount := 0
	for _, opt := range checkableOpts {
		if opt.Checked {
			checkedCount++
		}
	}

	if len(checkableOpts) == 0 {
		return 0.0
	}

	return (float64(checkedCount) / float64(len(checkableOpts))) * 5.0
}

// handleNoVNCView proxies requests to the internal websockify service
// and injects iframe-friendly headers to allow embedding the VNC view
func handleNoVNCView(w http.ResponseWriter, r *http.Request) {
	// Allow iframe embedding from same origin
	w.Header().Set("X-Frame-Options", "SAMEORIGIN")
	w.Header().Set("Content-Security-Policy", "frame-ancestors 'self'")

	target, _ := url.Parse("http://localhost:6080")
	proxy := httputil.NewSingleHostReverseProxy(target)

	// Update the request path before proxying
	originalPath := r.URL.Path
	if r.URL.Path != "/novnc-view" {
		r.URL.Path = strings.TrimPrefix(r.URL.Path, "/novnc-view")
	} else {
		r.URL.Path = "/"
	}

	log.Printf("Proxying VNC request: %s %s -> http://localhost:6080%s", r.Method, originalPath, r.URL.Path)

	proxy.ServeHTTP(w, r)
}
