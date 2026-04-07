package main

import (
	"embed"
	"fmt"
	"io/fs"
	"log"
	"net/http"
)

// noCacheHandler wraps a handler to add cache-busting headers
func noCacheHandler(h http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Cache-Control", "no-cache, no-store, must-revalidate")
		w.Header().Set("Pragma", "no-cache")
		w.Header().Set("Expires", "0")
		h.ServeHTTP(w, r)
	})
}

func startServer(port int, staticFS embed.FS, hub *Hub) *http.Server {
	mux := http.NewServeMux()

	sub, err := fs.Sub(staticFS, "static")
	if err != nil {
		log.Fatal(err)
	}
	mux.Handle("GET /", noCacheHandler(http.FileServer(http.FS(sub))))
	mux.Handle("GET /ws", handleWebSocket(hub))

	srv := &http.Server{
		Addr:    fmt.Sprintf(":%d", port),
		Handler: mux,
	}
	return srv
}
