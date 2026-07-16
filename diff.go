package main

import (
	"math"
	"regexp"
	"sort"
	"strconv"
	"strings"
)

type OptionDiff struct {
	Text        string `json:"text"`
	Checked2025 *bool  `json:"checked_2025,omitempty"`
	Checked2026 *bool  `json:"checked_2026,omitempty"`
	Status      string `json:"status"` // "added", "removed", "unchanged"
}

type EvidenceDiff struct {
	Text        string `json:"text"`
	Checked2025 *bool  `json:"checked_2025,omitempty"`
	Checked2026 *bool  `json:"checked_2026,omitempty"`
	Status      string `json:"status"` // "added", "removed", "unchanged"
}

type AlignedQuestionDiff struct {
	Category         string         `json:"category"`
	Q2025Number      string         `json:"q2025_number,omitempty"`
	Q2026Number      string         `json:"q2026_number,omitempty"`
	Text2025         string         `json:"text_2025,omitempty"`
	Text2026         string         `json:"text_2026,omitempty"`
	IsNew            bool           `json:"isNew"`
	IsDeleted        bool           `json:"isDeleted"`
	Score2025        string         `json:"score_2025,omitempty"`
	Score2026        string         `json:"score_2026,omitempty"`
	ScoreDelta       *float64       `json:"score_delta,omitempty"`
	Comments2025     string         `json:"comments_2025,omitempty"`
	Comments2026     string         `json:"comments_2026,omitempty"`
	FreeResponse2025 string         `json:"free_response_2025,omitempty"`
	FreeResponse2026 string         `json:"free_response_2026,omitempty"`
	Attachments2025  []string       `json:"attachments_2025,omitempty"`
	Attachments2026  []string       `json:"attachments_2026,omitempty"`
	OptionsDiff      []OptionDiff   `json:"options_diff,omitempty"`
	EvidenceDiff     []EvidenceDiff `json:"evidence_diff,omitempty"`
}

func tokenize(s string) map[string]bool {
	s = strings.ToLower(s)
	re := regexp.MustCompile(`[^\w\s]`)
	s = re.ReplaceAllString(s, " ")
	fields := strings.Fields(s)
	tokens := make(map[string]bool)
	for _, f := range fields {
		tokens[f] = true
	}
	return tokens
}

func jaccardSimilarity(s1, s2 string) float64 {
	t1 := tokenize(s1)
	t2 := tokenize(s2)
	if len(t1) == 0 && len(t2) == 0 {
		return 1.0
	}
	if len(t1) == 0 || len(t2) == 0 {
		return 0.0
	}
	intersection := 0
	for k := range t1 {
		if t2[k] {
			intersection++
		}
	}
	union := len(t1) + len(t2) - intersection
	return float64(intersection) / float64(union)
}

func parseScore(s string) (float64, bool) {
	s = strings.TrimSpace(s)
	val, err := strconv.ParseFloat(s, 64)
	if err == nil {
		return val, true
	}
	re := regexp.MustCompile(`(?i)score:\s*(\d+(?:\.\d+)?)`)
	matches := re.FindStringSubmatch(s)
	if len(matches) > 1 {
		val, err = strconv.ParseFloat(matches[1], 64)
		if err == nil {
			return val, true
		}
	}
	return 0.0, false
}

func CompareQuestionLists(q2025, q2026 []Question) []AlignedQuestionDiff {
	matched2025 := make(map[int]bool)
	var diffs []AlignedQuestionDiff

	// Loop over 2026 questions to find matches in 2025
	for _, q26 := range q2026 {
		bestMatchIdx := -1
		bestSimilarity := 0.0

		for idx25, q25 := range q2025 {
			if matched2025[idx25] {
				continue
			}
			sim := jaccardSimilarity(q26.Text, q25.Text)
			if sim > bestSimilarity {
				bestSimilarity = sim
				bestMatchIdx = idx25
			}
		}

		if bestSimilarity >= 0.7 && bestMatchIdx != -1 {
			matched2025[bestMatchIdx] = true
			q25 := q2025[bestMatchIdx]
			diffs = append(diffs, alignQuestions(q25, q26))
		} else {
			diffs = append(diffs, alignNewQuestion(q26))
		}
	}

	// Any remaining unmatched 2025 questions are deleted
	for idx25, q25 := range q2025 {
		if !matched2025[idx25] {
			diffs = append(diffs, alignDeletedQuestion(q25))
		}
	}

	// Sort diffs by category and then by 2026 question number (or 2025 question number if deleted)
	sort.Slice(diffs, func(i, j int) bool {
		catOrder := map[string]int{
			"COMPANY INFORMATION":       1,
			"SECURITY TOOLS":            2,
			"ORGANIZATION AND PLANNING": 3,
			"TECHNICAL AND TOOLING":     4,
			"SECURE PROCESS":            5,
			"RECURRING HYGIENE":         6,
			"VALIDATION CALL":           7,
		}

		cI := catOrder[diffs[i].Category]
		cJ := catOrder[diffs[j].Category]
		if cI != cJ {
			return cI < cJ
		}

		numIStr := diffs[i].Q2026Number
		if numIStr == "" {
			numIStr = diffs[i].Q2025Number
		}
		numJStr := diffs[j].Q2026Number
		if numJStr == "" {
			numJStr = diffs[j].Q2025Number
		}

		nI, _ := strconv.Atoi(numIStr)
		nJ, _ := strconv.Atoi(numJStr)
		return nI < nJ
	})

	return diffs
}

func alignQuestions(q25, q26 Question) AlignedQuestionDiff {
	diff := AlignedQuestionDiff{
		Category:         q26.Category,
		Q2025Number:      q25.Number,
		Q2026Number:      q26.Number,
		Text2025:         q25.Text,
		Text2026:         q26.Text,
		IsNew:            false,
		IsDeleted:        false,
		Score2025:        q25.Score,
		Score2026:        q26.Score,
		Comments2025:     q25.Comments,
		Comments2026:     q26.Comments,
		FreeResponse2025: q25.FreeResponse,
		FreeResponse2026: q26.FreeResponse,
		Attachments2025:  q25.Attachments,
		Attachments2026:  q26.Attachments,
	}

	s25, ok25 := parseScore(q25.Score)
	s26, ok26 := parseScore(q26.Score)
	if ok25 && ok26 {
		delta := s26 - s25
		delta = math.Round(delta*10) / 10
		diff.ScoreDelta = &delta
	}

	diff.OptionsDiff = alignOptions(q25.Options, q26.Options)
	diff.EvidenceDiff = alignEvidence(q25.Evidence, q26.Evidence)
	return diff
}

func alignNewQuestion(q26 Question) AlignedQuestionDiff {
	diff := AlignedQuestionDiff{
		Category:         q26.Category,
		Q2026Number:      q26.Number,
		Text2026:         q26.Text,
		IsNew:            true,
		IsDeleted:        false,
		Score2026:        q26.Score,
		Comments2026:     q26.Comments,
		FreeResponse2026: q26.FreeResponse,
		Attachments2026:  q26.Attachments,
	}

	for _, opt := range q26.Options {
		ch26 := opt.Checked
		diff.OptionsDiff = append(diff.OptionsDiff, OptionDiff{
			Text:        opt.Text,
			Checked2026: &ch26,
			Status:      "added",
		})
	}

	for _, ev := range q26.Evidence {
		ch26 := ev.Checked
		diff.EvidenceDiff = append(diff.EvidenceDiff, EvidenceDiff{
			Text:        ev.Text,
			Checked2026: &ch26,
			Status:      "added",
		})
	}

	return diff
}

func alignDeletedQuestion(q25 Question) AlignedQuestionDiff {
	diff := AlignedQuestionDiff{
		Category:         q25.Category,
		Q2025Number:      q25.Number,
		Text2025:         q25.Text,
		IsNew:            false,
		IsDeleted:        true,
		Score2025:        q25.Score,
		Comments2025:     q25.Comments,
		FreeResponse2025: q25.FreeResponse,
		Attachments2025:  q25.Attachments,
	}

	for _, opt := range q25.Options {
		ch25 := opt.Checked
		diff.OptionsDiff = append(diff.OptionsDiff, OptionDiff{
			Text:        opt.Text,
			Checked2025: &ch25,
			Status:      "removed",
		})
	}

	for _, ev := range q25.Evidence {
		ch25 := ev.Checked
		diff.EvidenceDiff = append(diff.EvidenceDiff, EvidenceDiff{
			Text:        ev.Text,
			Checked2025: &ch25,
			Status:      "removed",
		})
	}

	return diff
}

func alignOptions(opts25, opts26 []Option) []OptionDiff {
	var diffs []OptionDiff
	matched25 := make(map[int]bool)

	for _, opt26 := range opts26 {
		bestMatchIdx := -1
		bestSimilarity := 0.0

		for idx25, opt25 := range opts25 {
			if matched25[idx25] {
				continue
			}
			sim := jaccardSimilarity(opt26.Text, opt25.Text)
			if sim > bestSimilarity {
				bestSimilarity = sim
				bestMatchIdx = idx25
			}
		}

		if bestSimilarity >= 0.8 && bestMatchIdx != -1 {
			matched25[bestMatchIdx] = true
			opt25 := opts25[bestMatchIdx]
			ch25 := opt25.Checked
			ch26 := opt26.Checked

			status := "unchanged"
			if ch25 != ch26 {
				if ch26 {
					status = "added"
				} else {
					status = "removed"
				}
			}

			diffs = append(diffs, OptionDiff{
				Text:        opt26.Text,
				Checked2025: &ch25,
				Checked2026: &ch26,
				Status:      status,
			})
		} else {
			ch26 := opt26.Checked
			diffs = append(diffs, OptionDiff{
				Text:        opt26.Text,
				Checked2026: &ch26,
				Status:      "added",
			})
		}
	}

	for idx25, opt25 := range opts25 {
		if !matched25[idx25] {
			ch25 := opt25.Checked
			diffs = append(diffs, OptionDiff{
				Text:        opt25.Text,
				Checked2025: &ch25,
				Status:      "removed",
			})
		}
	}

	return diffs
}

func alignEvidence(evs25, evs26 []Evidence) []EvidenceDiff {
	var diffs []EvidenceDiff
	matched25 := make(map[int]bool)

	for _, ev26 := range evs26 {
		bestMatchIdx := -1
		bestSimilarity := 0.0

		for idx25, ev25 := range evs25 {
			if matched25[idx25] {
				continue
			}
			sim := jaccardSimilarity(ev26.Text, ev25.Text)
			if sim > bestSimilarity {
				bestSimilarity = sim
				bestMatchIdx = idx25
			}
		}

		if bestSimilarity >= 0.8 && bestMatchIdx != -1 {
			matched25[bestMatchIdx] = true
			ev25 := evs25[bestMatchIdx]
			ch25 := ev25.Checked
			ch26 := ev26.Checked

			status := "unchanged"
			if ch25 != ch26 {
				if ch26 {
					status = "added"
				} else {
					status = "removed"
				}
			}

			diffs = append(diffs, EvidenceDiff{
				Text:        ev26.Text,
				Checked2025: &ch25,
				Checked2026: &ch26,
				Status:      status,
			})
		} else {
			ch26 := ev26.Checked
			diffs = append(diffs, EvidenceDiff{
				Text:        ev26.Text,
				Checked2026: &ch26,
				Status:      "added",
			})
		}
	}

	for idx25, ev25 := range evs25 {
		if !matched25[idx25] {
			ch25 := ev25.Checked
			diffs = append(diffs, EvidenceDiff{
				Text:        ev25.Text,
				Checked2025: &ch25,
				Status:      "removed",
			})
		}
	}

	return diffs
}
