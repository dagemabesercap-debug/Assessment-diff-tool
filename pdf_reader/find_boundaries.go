package main

import (
	"fmt"
	"math"
	"sort"

	"github.com/dslipak/pdf"
)

func findBoundaries() {
	r, err := pdf.Open("../Serent Capital - Studio Designer (2025).pdf")
	if err != nil {
		panic(err)
	}

	page := r.Page(8)
	if page.V.IsNull() {
		fmt.Println("Page 8 is null")
		return
	}

	var elements []TextElement
	for _, t := range page.Content().Text {
		elements = append(elements, TextElement{
			Text: t.S,
			X:    t.X,
			Y:    t.Y,
		})
	}

	// Group by Y (within 3.0 tolerance)
	var lines [][]TextElement
	for _, el := range elements {
		found := false
		for i, line := range lines {
			if math.Abs(line[0].Y-el.Y) < 3.0 {
				lines[i] = append(line, el)
				found = true
				break
			}
		}
		if !found {
			lines = append(lines, []TextElement{el})
		}
	}

	// Sort lines by Y descending (top to bottom)
	sort.Slice(lines, func(i, j int) bool {
		return lines[i][0].Y > lines[j][0].Y
	})

	fmt.Println("--- Page 8 Columns Layout ---")
	for _, line := range lines {
		// Sort elements in the same line by X ascending (left to right)
		sort.Slice(line, func(i, j int) bool {
			return line[i].X < line[j].X
		})

		// Reconstruct columns based on X gaps
		var columns []string
		var currentCol string
		var lastX float64

		if len(line) > 0 {
			currentCol = line[0].Text
			lastX = line[0].X
		}

		for i := 1; i < len(line); i++ {
			el := line[i]
			if el.X-lastX > 15.0 {
				columns = append(columns, currentCol)
				currentCol = el.Text
			} else {
				currentCol += el.Text
			}
			lastX = el.X
		}
		if len(currentCol) > 0 {
			columns = append(columns, currentCol)
		}

		// Print columns separated by |
		fmt.Printf("Y: %5.1f | ", line[0].Y)
		for idx, col := range columns {
			if idx > 0 {
				fmt.Print("   |   ")
			}
			fmt.Print(col)
		}
		fmt.Println()
	}
}
