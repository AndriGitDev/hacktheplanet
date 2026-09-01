# Hack the Planet

A cinematic hacker-movie simulator by [Kastro Labs](https://kastro.is). Live at [htp.kastro.is](https://htp.kastro.is).

**Mash any keys. Become a movie hacker.** Pick a fictional target, type literally anything while convincing code pours out of your fingertips, survive the firewall counterattack, crack the password one glowing character at a time, siphon the files, and walk away with a mission report worth screenshotting.

It is 100% fiction. Nothing is scanned, contacted, or harmed. Every target is invented, every exploit is theatre, and the only thing under attack is realism.

## How it plays

1. **Boot** — BIOS theatrics. The reality driver is intentionally NOT FOUND.
2. **Jack in** — pick a two-word hacker handle with zero humility (or randomize one).
3. **Pick a target** — THE GIBSON, an orbital disco satellite, an evil bank's bonus pool, or the Global Genius Database.
4. **The run** — type *anything*; any keys work. Fill the ACCESS meter, out-type the TRACE during the firewall counterattack (go idle and you *will* get traced), then keep mashing through the exfil.
5. **Debrief** — keystroke stats, trace peak, an operator rating from SCRIPT KIDDIE to ZERO COOL CERTIFIED, and a copyable mission report.

Extras: `ESC` summons a boss-screen spreadsheet, sound is synth-only and off by default, the world map decodes real TopoJSON with zero libraries, and the whole thing works on a phone via the big MASH button.

## Running it

```bash
go run .          # http://localhost:8080
PORT=3001 go run . # any port you like
```

One Go binary, all assets embedded, no runtime dependencies, no database, no analytics, no network calls except serving itself.

## Deploying

The production site deploys the `static` directory directly to Vercel. Import this repository in the Vercel dashboard and keep the detected framework preset as **Other**; `vercel.json` sets the output directory and production security headers. No build command or environment variables are required.

`htp.kastro.is` is served through BunnyCDN. After the first Vercel deployment:

1. Add `htp.kastro.is` to the Vercel project.
2. Change the BunnyCDN pull-zone origin from Coolify to the Vercel deployment hostname.
3. Purge the BunnyCDN cache and verify `/`, `/.well-known/security.txt`, and `/healthz` before removing the Coolify service.

The Go server remains available for local development and self-hosting.

## Stack

- **Server:** Go standard library only (`embed` + `net/http`), ~100 lines.
- **Frontend:** vanilla ES modules, two canvases, CSS. No frameworks, no build step.
- **Audio:** WebAudio oscillators, generated on the fly.

## Checks

```bash
gofmt -l .
go test ./...
go vet ./...
go build ./...
```
