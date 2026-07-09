package main

import (
	"bytes"
	"fmt"
	"os"
	"path/filepath"

	"github.com/dslipak/pdf"
)

func main() {
	files := []string{
		"Serent Capital - Studio Designer (2025).pdf",
		"Serent Capital - Studio Designer (2026).pdf",
	}

	for _, file := range files {
		inputPath := filepath.Join("..", file)
		outputPath := file + ".txt"

		fmt.Printf("Processing %s...\n", inputPath)
		text, err := readPdf(inputPath)
		if err != nil {
			fmt.Printf("Error reading %s: %v\n", inputPath, err)
			continue
		}

		err = os.WriteFile(outputPath, []byte(text), 0644)
		if err != nil {
			fmt.Printf("Error writing %s: %v\n", outputPath, err)
			continue
		}
		fmt.Printf("Saved text to %s\n", outputPath)
	}
	extractLayout()
	extractRows()
	findBoundaries()
}

func readPdf(path string) (string, error) {
	r, err := pdf.Open(path)
	if err != nil {
		return "", err
	}

	var buf bytes.Buffer
	b, err := r.GetPlainText()
	if err != nil {
		return "", err
	}
	buf.ReadFrom(b)

	return buf.String(), nil
}
