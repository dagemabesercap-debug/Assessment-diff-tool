# Cybersecurity Assessment Diff & Portfolio Tool

This project enables private equity firms and cybersecurity teams to parse yearly cybersecurity assessment reports (PDFs), manage multiple portfolio companies ("portcos"), track security posture trends over time, and compare changes between arbitrary years via an interactive, glassmorphic dark-mode web dashboard.

## Key Features
- **Portfolio Homepage**: Select and monitor security trends for multiple portfolio companies.
- **Dynamic Charting**: Automatically plots year-over-year security score trends using Chart.js.
- **Dynamic PDF Parser Backend**: Upload one or more assessment PDFs, assign them to a company name and year, and have the Go backend parse, calculate scores, and generate structured data on the fly.
- **Detailed Diff Comparison**: Select any two assessment years to inspect side-by-side differences with checkmark diffing, delta score badges, and respondent comments.

## Project Structure
- `index.html`: The Portfolio Homepage dashboard.
- `diff.html`: The detailed year-over-year comparison dashboard.
- `styles.css`: CSS styling (glassmorphic dark-mode design system).
- `app.js`: JavaScript logic for the Portfolio Homepage.
- `diff_app.js`: JavaScript logic for the diff comparison view.
- `server.go`: The Go backend HTTP server providing API endpoints, file uploads, PDF parsing, and dynamic diffing.
- `parser.go`: Core PDF text grouping, sanitization, and checkbox option parsing logic.
- `diff.go`: Text-similarity Jaccard matching and difference calculation logic.
- `data/`: Folder containing company metadata (`portcos.json`) and parsed JSON files.

## Quick Start

### 1. Build and Start the Go Backend Server
Build and run the unified server binary from the root directory:
```bash
go build
./assessment_diff_tool
```
The server will start at:
[http://localhost:8080](http://localhost:8080)

### 2. Using the Tool
1. Open the Portfolio Homepage.
2. Select **Studio Designer** from the sidebar to review its historical trend (2025 vs 2026).
3. Click **Compare Diff** to see detailed question-level changes.
4. Click **+ Add Portfolio Company** to create a new company account, upload multiple assessment PDFs, assign their respective years, and parse them instantly!
