package main

import (
	"io/fs"
	"strings"
	"testing"
)

// The whole product is the embedded frontend; make sure it is actually in
// the binary and still says what it is.
func TestEmbeddedAssets(t *testing.T) {
	required := []string{
		"static/index.html",
		"static/css/style.css",
		"static/js/main.js",
		"static/js/data.js",
		"static/js/panels.js",
		"static/js/worldmap.js",
		"static/js/fx.js",
		"static/js/audio.js",
		"static/data/land-110m.json",
		"static/img/og-hack-the-planet.svg",
	}
	for _, path := range required {
		if _, err := fs.Stat(embedded, path); err != nil {
			t.Errorf("missing embedded asset %s: %v", path, err)
		}
	}
}

func TestIndexStaysFictional(t *testing.T) {
	b, err := fs.ReadFile(embedded, "static/index.html")
	if err != nil {
		t.Fatal(err)
	}
	html := string(b)
	for _, marker := range []string{"Hack the Planet", "0 packets harmed", "fiction"} {
		if !strings.Contains(html, marker) {
			t.Errorf("index.html lost its %q marker", marker)
		}
	}
}
