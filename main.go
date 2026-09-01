// Hack the Planet — a cinematic hacker-movie simulator by Kastro Labs.
// The entire simulation runs client-side; this binary only serves the
// embedded static assets.
package main

import (
	"context"
	"embed"
	"flag"
	"fmt"
	"io/fs"
	"log"
	"net/http"
	"os"
	"os/signal"
	"strconv"
	"syscall"
	"time"
)

//go:embed static static/.well-known/security.txt
var embedded embed.FS

const banner = `
 ██╗  ██╗ █████╗  ██████╗██╗  ██╗  ████████╗██╗  ██╗███████╗
 ██║  ██║██╔══██╗██╔════╝██║ ██╔╝  ╚══██╔══╝██║  ██║██╔════╝
 ███████║███████║██║     █████╔╝      ██║   ███████║█████╗
 ██╔══██║██╔══██║██║     ██╔═██╗      ██║   ██╔══██║██╔══╝
 ██║  ██║██║  ██║╚██████╗██║  ██╗     ██║   ██║  ██║███████╗
 ╚═╝  ╚═╝╚═╝  ╚═╝ ╚═════╝╚═╝  ╚═╝     ╚═╝   ╚═╝  ╚═╝╚══════╝
 ██████╗ ██╗      █████╗ ███╗   ██╗███████╗████████╗
 ██╔══██╗██║     ██╔══██╗████╗  ██║██╔════╝╚══██╔══╝
 ██████╔╝██║     ███████║██╔██╗ ██║█████╗     ██║
 ██╔═══╝ ██║     ██╔══██║██║╚██╗██║██╔══╝     ██║
 ██║     ███████╗██║  ██║██║ ╚████║███████╗   ██║
 ╚═╝     ╚══════╝╚═╝  ╚═╝╚═╝  ╚═══╝╚══════╝   ╚═╝
`

func main() {
	port := flag.Int("port", 8080, "HTTP server port")
	flag.Parse()

	// Platforms like Railway/Coolify inject PORT.
	if envPort := os.Getenv("PORT"); envPort != "" {
		if p, err := strconv.Atoi(envPort); err == nil {
			*port = p
		}
	}

	static, err := fs.Sub(embedded, "static")
	if err != nil {
		log.Fatal(err)
	}

	mux := http.NewServeMux()
	mux.HandleFunc("/healthz", func(w http.ResponseWriter, _ *http.Request) {
		w.Header().Set("Content-Type", "text/plain; charset=utf-8")
		fmt.Fprintln(w, "ok — no packets harmed")
	})
	mux.Handle("/", withHeaders(http.FileServerFS(static)))

	srv := &http.Server{
		Addr:              fmt.Sprintf(":%d", *port),
		Handler:           mux,
		ReadHeaderTimeout: 10 * time.Second,
	}

	fmt.Print(banner)
	log.Printf(">> SIMULATION ONLINE -- http://localhost:%d", *port)

	ctx, stop := signal.NotifyContext(context.Background(), syscall.SIGINT, syscall.SIGTERM)
	defer stop()

	go func() {
		if err := srv.ListenAndServe(); err != http.ErrServerClosed {
			log.Printf("server stopped: %v", err)
			stop()
		}
	}()

	<-ctx.Done()
	log.Println(">> POWERING DOWN THE THEATRE...")
	shutdownCtx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	srv.Shutdown(shutdownCtx)
}

func withHeaders(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodGet && r.Method != http.MethodHead {
			w.Header().Set("Allow", "GET, HEAD")
			http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
			return
		}
		w.Header().Set("Strict-Transport-Security", "max-age=31536000")
		w.Header().Set("X-Content-Type-Options", "nosniff")
		w.Header().Set("X-Frame-Options", "DENY")
		w.Header().Set("Referrer-Policy", "strict-origin-when-cross-origin")
		w.Header().Set("Permissions-Policy", "camera=(), microphone=(), geolocation=()")
		w.Header().Set("Content-Security-Policy", "default-src 'self'; base-uri 'self'; object-src 'none'; frame-ancestors 'none'; form-action 'self'; script-src 'self' https://cdn.vercel-insights.com 'unsafe-inline'; style-src 'self' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data:; connect-src 'self' https://vitals.vercel-insights.com; upgrade-insecure-requests")
		w.Header().Set("X-No-Packets-Were-Harmed", "true")
		next.ServeHTTP(w, r)
	})
}
