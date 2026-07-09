package main

import (
	"fmt"
	"math"
	"os"
	"path/filepath"
	"sort"

	"github.com/dslipak/pdf"
)

type TextElement struct {
	Text string
	X    float64
	Y    float64
}

// ByCoords implements sort.Interface for TextElement
type ByCoords []TextElement

func (a ByCoords) Len() int      { return len(a) }
func (a ByCoords) Swap(i, j int) { a[i], a[j] = a[j], a[i] }
func (a ByCoords) Less(i, j int) bool {
	// First sort by Y descending (top to bottom)
	// If Y is close (within 2 units), sort by X ascending (left to right)
	yDiff := a[i].Y - a[j].Y
	if math.Abs(yDiff) < 2.0 {
		return a[i].X < a[j].X
	}
	return a[i].Y > a[j].Y
}

func extractLayout() {
	files := []string{
		"Serent Capital - Studio Designer (2025).pdf",
		"Serent Capital - Studio Designer (2026).pdf",
	}

	for _, file := range files {
		inputPath := filepath.Join("..", file)
		outputPath := file + ".layout.txt"

		fmt.Printf("Extracting layout from %s...\n", inputPath)
		text, err := getLayout(inputPath)
		if err != nil {
			fmt.Printf("Error: %v\n", err)
			continue
		}

		err = os.WriteFile(outputPath, []byte(text), 0644)
		if err != nil {
			fmt.Printf("Error writing: %v\n", err)
			continue
		}
		fmt.Printf("Saved layout to %s\n", outputPath)
	}
}

func getLayout(path string) (string, error) {
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

		var elements []TextElement
		texts := page.Content().Text
		for _, t := range texts {
			elements = append(elements, TextElement{
				Text: t.S,
				X:    t.X,
				Y:    t.Y,
			})
		}

		// Sort elements by coordinates
		sort.Sort(ByCoords(elements))

		// Group elements by Y coordinate (within tolerance) and build lines
		if len(elements) == 0 {
			continue
		}

		currentY := elements[0].Y
		var line string

		for _, el := range elements {
			if math.Abs(el.Y-currentY) >= 2.0 {
				// New line
				output += line + "\n"
				line = el.Text
				currentY = el.Y
			} else {
				// Append to current line with space if there's a gap
				if len(line) > 0 {
					line += " " + el.Text
				} else {
					line = el.Text
				}
			}
		}
		if len(line) > 0 {
			output += line + "\n"
		}
	}

	return output, nil
}
