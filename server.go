package main

import (
	"embed"
	"fmt"
	"io/fs"
	"log"
	"net/http"
)

func startServer(port int, staticFS embed.FS, hub *Hub) *http.Server {
	mux := http.NewServeMux()

	sub, err := fs.Sub(staticFS, "static")
	if err != nil {
		log.Fatal(err)
	}
	mux.Handle("GET /", http.FileServer(http.FS(sub)))
	mux.Handle("GET /ws", handleWebSocket(hub))

	srv := &http.Server{
		Addr:    fmt.Sprintf(":%d", port),
		Handler: mux,
	}
	return srv
}
