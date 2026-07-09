package main

import (
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"os"
	"path/filepath"
	"testing"
)

func TestHandleDeletePortcoRemovesMetadataAndFiles(t *testing.T) {
	withTempWorkingDir(t)

	companyName := "Acme Security"
	companyDir := filepath.Join("data", "portcos", companyName)
	if err := os.MkdirAll(companyDir, 0755); err != nil {
		t.Fatalf("failed creating company dir: %v", err)
	}
	if err := os.WriteFile(filepath.Join(companyDir, "2026.json"), []byte("[]"), 0644); err != nil {
		t.Fatalf("failed writing company JSON: %v", err)
	}

	portcos := []Portco{
		{
			Name:           companyName,
			Years:          []string{"2026"},
			Scores:         map[string]int{"2026": 80},
			CategoryScores: map[string]map[string]int{"2026": {"RECURRING HYGIENE": 80}},
		},
		{
			Name:           "Keep Me",
			Years:          []string{"2026"},
			Scores:         map[string]int{"2026": 90},
			CategoryScores: map[string]map[string]int{"2026": {"RECURRING HYGIENE": 90}},
		},
	}
	if err := os.MkdirAll("data", 0755); err != nil {
		t.Fatalf("failed creating data dir: %v", err)
	}
	if err := savePortcos(portcos); err != nil {
		t.Fatalf("failed saving portcos: %v", err)
	}

	req := httptest.NewRequest(http.MethodDelete, "/api/portcos?name=Acme%20Security", nil)
	rec := httptest.NewRecorder()

	handlePortcos(rec, req)

	if rec.Code != http.StatusOK {
		t.Fatalf("expected status %d, got %d: %s", http.StatusOK, rec.Code, rec.Body.String())
	}
	if _, err := os.Stat(companyDir); !os.IsNotExist(err) {
		t.Fatalf("expected company dir to be removed, stat err: %v", err)
	}

	remaining := readPortcosForTest(t)
	if len(remaining) != 1 || remaining[0].Name != "Keep Me" {
		t.Fatalf("unexpected remaining portcos: %+v", remaining)
	}
}

func TestHandleDeletePortcoRejectsUnsafeName(t *testing.T) {
	withTempWorkingDir(t)

	if err := os.MkdirAll("data", 0755); err != nil {
		t.Fatalf("failed creating data dir: %v", err)
	}
	if err := savePortcos([]Portco{}); err != nil {
		t.Fatalf("failed saving portcos: %v", err)
	}

	req := httptest.NewRequest(http.MethodDelete, "/api/portcos?name=..%5Coutside", nil)
	rec := httptest.NewRecorder()

	handlePortcos(rec, req)

	if rec.Code != http.StatusBadRequest {
		t.Fatalf("expected status %d, got %d: %s", http.StatusBadRequest, rec.Code, rec.Body.String())
	}
}

func withTempWorkingDir(t *testing.T) {
	t.Helper()

	originalWd, err := os.Getwd()
	if err != nil {
		t.Fatalf("failed getting working dir: %v", err)
	}
	if err := os.Chdir(t.TempDir()); err != nil {
		t.Fatalf("failed changing working dir: %v", err)
	}
	t.Cleanup(func() {
		if err := os.Chdir(originalWd); err != nil {
			t.Fatalf("failed restoring working dir: %v", err)
		}
	})
}

func readPortcosForTest(t *testing.T) []Portco {
	t.Helper()

	raw, err := os.ReadFile(filepath.Join("data", "portcos.json"))
	if err != nil {
		t.Fatalf("failed reading portcos: %v", err)
	}

	var portcos []Portco
	if err := json.Unmarshal(raw, &portcos); err != nil {
		t.Fatalf("failed decoding portcos: %v", err)
	}

	return portcos
}
