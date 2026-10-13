# Coolify deployment

Production: https://htp.kastro.is.

Coolify builds GitHub `main` with `Dockerfile.coolify` from `/` on Baracoa, publishes `ghcr.io/andrigitdev/hacktheplanet`, and runs the image on Kastro-Host-A. Cloudflare proxied A records point each hostname to the deployment server. Traefik manages origin HTTPS certificates and renewal through HTTP-01 on port 80.

The container listens on port 8080. Its Docker healthcheck and Coolify healthcheck probe `/healthz` every 30 seconds with a five-second timeout and three retries. All production hostnames must have DNS records. Git pushes automatically deploy.

Build locally with `docker build -f Dockerfile.coolify .` from this directory. Run with `docker run --rm -p 8080:8080 <image>`. Vercel configuration remains available for rollback during the migration window; page-view analytics are disabled on Coolify.
