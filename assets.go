package main

import "embed"

// staticFiles contains the only files that may be served directly by the app.
//
//go:embed index.html diff.html styles.css app.js diff_app.js
var staticFiles embed.FS
