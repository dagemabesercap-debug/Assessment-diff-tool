package main

import (
	"encoding/json"
	"os"
	"testing"
)

func TestParsePDFStudioDesignerAssessmentShape(t *testing.T) {
	tests := []struct {
		name           string
		path           string
		wantQuestions  int
		wantCategories map[string]int
		wantLastNumber string
		wantLastCat    string
	}{
		{
			name:          "2025",
			path:          "Serent Capital - Studio Designer (2025).pdf",
			wantQuestions: 67,
			wantCategories: map[string]int{
				"COMPANY INFORMATION":       7,
				"SECURITY TOOLS":            25,
				"ORGANIZATION AND PLANNING": 4,
				"TECHNICAL AND TOOLING":     20,
				"SECURE PROCESS":            5,
				"RECURRING HYGIENE":         5,
				"VALIDATION CALL":           1,
			},
			wantLastNumber: "67",
			wantLastCat:    "VALIDATION CALL",
		},
		{
			name:          "2026",
			path:          "Serent Capital - Studio Designer (2026).pdf",
			wantQuestions: 69,
			wantCategories: map[string]int{
				"COMPANY INFORMATION":       7,
				"SECURITY TOOLS":            25,
				"ORGANIZATION AND PLANNING": 4,
				"TECHNICAL AND TOOLING":     21,
				"SECURE PROCESS":            6,
				"RECURRING HYGIENE":         5,
				"VALIDATION CALL":           1,
			},
			wantLastNumber: "69",
			wantLastCat:    "VALIDATION CALL",
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			requireFixture(t, tt.path)
			questions, err := parsePDF(tt.path)
			if err != nil {
				t.Fatalf("parsePDF failed: %v", err)
			}
			if len(questions) != tt.wantQuestions {
				t.Fatalf("expected %d questions, got %d", tt.wantQuestions, len(questions))
			}

			counts := make(map[string]int)
			for _, q := range questions {
				counts[q.Category]++
				if q.Text == "" {
					t.Fatalf("question %s has empty text", q.Number)
				}
			}
			for category, want := range tt.wantCategories {
				if got := counts[category]; got != want {
					t.Fatalf("category %q expected %d questions, got %d", category, want, got)
				}
			}

			last := questions[len(questions)-1]
			if last.Number != tt.wantLastNumber || last.Category != tt.wantLastCat || last.Comments == "" {
				t.Fatalf("unexpected last question: number=%q category=%q comments=%q", last.Number, last.Category, last.Comments)
			}
		})
	}
}

func TestParsePDFMatchesReferenceJSONForStudioDesigner(t *testing.T) {
	for _, path := range []string{
		"Serent Capital - Studio Designer (2025).pdf",
		"Serent Capital - Studio Designer (2026).pdf",
	} {
		t.Run(path, func(t *testing.T) {
			requireFixture(t, path)
			requireFixture(t, path+".json")
			got, err := parsePDF(path)
			if err != nil {
				t.Fatalf("parsePDF failed: %v", err)
			}

			raw, err := os.ReadFile(path + ".json")
			if err != nil {
				t.Fatalf("failed reading reference JSON: %v", err)
			}
			var want []Question
			if err := json.Unmarshal(raw, &want); err != nil {
				t.Fatalf("failed decoding reference JSON: %v", err)
			}

			if len(got) != len(want) {
				t.Fatalf("expected %d questions, got %d", len(want), len(got))
			}
			for i := range want {
				if got[i].Number != want[i].Number ||
					got[i].Text != want[i].Text ||
					got[i].Category != want[i].Category ||
					got[i].Score != want[i].Score ||
					got[i].Comments != want[i].Comments {
					t.Fatalf("question index %d mismatch\nwant: %+v\ngot:  %+v", i, want[i], got[i])
				}
			}
		})
	}
}

func TestParsePDFStudioDesignerSummaryScores(t *testing.T) {
	tests := []struct {
		name           string
		path           string
		wantOverall    int
		wantCategories map[string]int
	}{
		{
			name:        "2025",
			path:        "Serent Capital - Studio Designer (2025).pdf",
			wantOverall: 83,
			wantCategories: map[string]int{
				"ORGANIZATION AND PLANNING": 64,
				"TECHNICAL AND TOOLING":     100,
				"SECURE PROCESS":            76,
				"RECURRING HYGIENE":         55,
			},
		},
		{
			name:        "2026",
			path:        "Serent Capital - Studio Designer (2026).pdf",
			wantOverall: 63,
			wantCategories: map[string]int{
				"ORGANIZATION AND PLANNING": 72,
				"TECHNICAL AND TOOLING":     64,
				"SECURE PROCESS":            73,
				"RECURRING HYGIENE":         39,
			},
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			requireFixture(t, tt.path)
			overall, categories, ok, err := parseAssessmentScores(tt.path)
			if err != nil {
				t.Fatalf("parseAssessmentScores failed: %v", err)
			}
			if !ok {
				t.Fatal("expected summary scores to be found")
			}

			if overall != tt.wantOverall {
				t.Fatalf("expected overall score %d, got %d", tt.wantOverall, overall)
			}
			for category, want := range tt.wantCategories {
				if got := categories[category]; got != want {
					t.Fatalf("category %q expected score %d, got %d", category, want, got)
				}
			}
		})
	}
}

func requireFixture(t *testing.T, path string) {
	t.Helper()
	if _, err := os.Stat(path); os.IsNotExist(err) {
		t.Skipf("integration fixture %q is intentionally not stored in the repository", path)
	} else if err != nil {
		t.Fatalf("failed checking fixture %q: %v", path, err)
	}
}
