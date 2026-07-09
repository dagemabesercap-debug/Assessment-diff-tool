package main

import (
	"fmt"
	"strings"

	"github.com/dslipak/pdf"
)

func main() {
	r, err := pdf.Open("../Serent Capital - Studio Designer (2026).pdf")
	if err != nil {
		panic(err)
	}

	numPages := r.NumPage()
	scoreMatches := 0
	for pageNum := 1; pageNum <= numPages; pageNum++ {
		page := r.Page(pageNum)
		if page.V.IsNull() {
			continue
		}

		for _, t := range page.Content().Text {
			if strings.Contains(strings.ToLower(t.S), "score") {
				fmt.Printf("Page %d: %q\n", pageNum, t.S)
				scoreMatches++
			}
		}
	}
	fmt.Printf("Total score matches in 2025: %d\n", scoreMatches)
}
