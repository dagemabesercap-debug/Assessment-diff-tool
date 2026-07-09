package main

import (
	"fmt"
	"os"
	"path/filepath"

	"github.com/dslipak/pdf"
)

func extractRows() {
	files := []string{
		"Serent Capital - Studio Designer (2025).pdf",
		"Serent Capital - Studio Designer (2026).pdf",
	}

	for _, file := range files {
		inputPath := filepath.Join("..", file)
		outputPath := file + ".rows.txt"

		fmt.Printf("Extracting rows from %s...\n", inputPath)
		text, err := getRows(inputPath)
		if err != nil {
			fmt.Printf("Error: %v\n", err)
			continue
		}

		err = os.WriteFile(outputPath, []byte(text), 0644)
		if err != nil {
			fmt.Printf("Error writing %s: %v\n", outputPath, err)
			continue
		}
		fmt.Printf("Saved rows to %s\n", outputPath)
	}
}

func getRows(path string) (string, error) {
	r, err := pdf.Open(path)
	if err != nil {
		return "", err
	}

	var output string
	numPages := r.NumPage()

	for pageNum := 1; pageNum <= numPages; pageNum++ {
		page := r.Page(pageNum)
		if page.V.IsNull() {
			continue
		}

		output += fmt.Sprintf("--- PAGE %d ---\n", pageNum)

		rows, err := page.GetTextByRow()
		if err != nil {
			return "", err
		}

		for _, row := range rows {
			var rowText string
			for _, txt := range row.Content {
				rowText += txt.S
			}
			output += rowText + "\n"
		}
	}

	return output, nil
}
