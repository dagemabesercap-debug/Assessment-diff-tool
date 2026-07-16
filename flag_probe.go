//go:build ignore

package main

import (
	"encoding/json"
	"fmt"
	"os"
	"path/filepath"
)

func debugLogf(format string, args ...any) {}

func main() {
	for _, path := range []string{
		"Serent Capital - Studio Designer (2025).pdf",
		"Serent Capital - Studio Designer (2026).pdf",
	} {
		questions, err := parsePDF(path)
		if err != nil {
			panic(err)
		}
		data, err := json.MarshalIndent(questions, "", "  ")
		if err != nil {
			panic(err)
		}
		year := "2025"
		if filepath.Base(path) == "Serent Capital - Studio Designer (2026).pdf" {
			year = "2026"
		}
		writeJSON(path+".json", data)
		writeJSON(filepath.Join("pdf_json_parser", filepath.Base(path)+".json"), data)
		writeJSON(filepath.Join("data", "portcos", "Studio Designer", year+".json"), data)
		fmt.Printf("regenerated %s with %d questions\n", path, len(questions))
	}
}

func writeJSON(path string, data []byte) {
	if err := os.MkdirAll(filepath.Dir(path), 0755); err != nil && filepath.Dir(path) != "." {
		panic(err)
	}
	if err := os.WriteFile(path, data, 0644); err != nil {
		panic(err)
	}
}
