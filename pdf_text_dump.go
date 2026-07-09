//go:build ignore

package main

import (
	"fmt"
	"math"
	"os"
	"sort"
	"strings"

	"github.com/dslipak/pdf"
)

func main() {
	if len(os.Args) < 2 {
		fmt.Println("usage: go run pdf_text_dump.go <pdf>")
		os.Exit(1)
	}
	r, err := pdf.Open(os.Args[1])
	if err != nil {
		panic(err)
	}
	terms := []string{"score", "organization", "technical", "secure process", "recurring", "hygiene", "assessment overview", "%"}
	for pageNum := 1; pageNum <= r.NumPage(); pageNum++ {
		page := r.Page(pageNum)
		var texts []pdf.Text
		texts = append(texts, page.Content().Text...)
		sort.Slice(texts, func(i, j int) bool {
			if math.Abs(texts[i].Y-texts[j].Y) < 2 {
				return texts[i].X < texts[j].X
			}
			return texts[i].Y > texts[j].Y
		})
		var lines []struct {
			y float64
			s string
		}
		for _, t := range texts {
			if len(lines) == 0 || math.Abs(lines[len(lines)-1].y-t.Y) >= 4.5 {
				lines = append(lines, struct {
					y float64
					s string
				}{y: t.Y})
			}
			lines[len(lines)-1].s += t.S
		}
		for _, line := range lines {
			lower := strings.ToLower(line.s)
			for _, term := range terms {
				if strings.Contains(lower, term) {
					fmt.Printf("page=%02d y=%6.1f %s\n", pageNum, line.y, strings.TrimSpace(line.s))
					break
				}
			}
		}
	}
}
