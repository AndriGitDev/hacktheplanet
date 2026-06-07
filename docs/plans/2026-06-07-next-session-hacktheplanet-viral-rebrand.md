# Hack the Planet Viral Rebrand Implementation Plan

> **For Hermes:** Use subagent-driven-development skill to implement this plan task-by-task. If the first implementation slice becomes a full rewrite, keep the current app recoverable until the replacement is verified.

**Goal:** Rebrand `hacktheplanet` into a viral-worthy, obviously harmless hacker-movie simulator for Kastro Labs, deployed at `https://htp.kastro.is`.

**Architecture:** Treat the current Go/WebSocket app as the baseline that already works in production. First remove copy that implies real offensive capability, then either polish the existing static frontend or replace it with a modern single-page simulation UI while preserving the simple Go static server and `/ws` event stream if it remains useful.

**Tech Stack:** Go 1.26.2, `github.com/coder/websocket`, embedded static assets, vanilla ES modules, CSS, Three.js via import map. Optional rewrite path: Vite + TypeScript frontend emitted into `static/` while keeping Go as the production server.

---

## Fresh Session Boot Checklist

1. Recall context from Memento before coding:
   - `Kastro Labs live tool URLs corrected`
   - `hacktheplanet Kastro Labs viral hacker simulator htp.kastro.is`
   - `Kastro Labs conversion strategy uses Kastro Lookup first`
   - `repo-hacktheplanet multi-panel hacker movie dashboard`
2. Open the repos:
   - `cd /root/workspace/github/AndriGitDev/hacktheplanet`
   - `git status --short --branch`
   - `git pull --ff-only`
   - optionally inspect `/root/workspace/github/AndriGitDev/kastro` for the Labs wrapper page.
3. Read these files before editing:
   - `static/index.html`
   - `static/css/style.css`
   - `static/js/main.js`
   - `static/js/hack.js`
   - `static/js/hack3d.js`
   - `static/js/audio.js`
   - `server.go`, `websocket.go`, `generators.go`, `messages.go`
   - `nixpacks.toml`, `go.mod`
4. Verify local commands before and after edits:
   - `gofmt -w *.go`
   - `go test ./...`
   - `go build ./...`
   - `git diff --check`
   - local smoke: run `PORT=3001 go run .`, then fetch `http://127.0.0.1:3001/` and open/smoke in a browser if available.
5. Production facts:
   - Live URL: `https://htp.kastro.is`
   - Kastro Labs wrapper links here.
   - Do not change DNS/Coolify/production settings unless Andri explicitly asks.

---

## Strategic Direction

### Brand target

**Name:** Hack the Planet by Kastro Labs

**One-liner:** A cinematic hacker-movie simulator for harmless chaos, dramatic terminals, and infrastructure jokes.

**Safety truth:** It does not hack anything. It is a toy interface and shareable visual joke.

### Viral target

Make it something people want to send to colleagues with: “open this before the security meeting.” It should feel like:

- `Hackers` / `Sneakers` / `WarGames` cinema energy.
- Nordically weird Kastro humour, not generic cyberpunk slop.
- Screenshot-worthy panels, big dramatic moments, and shareable achievements.
- Clearly fake targets and fictional operations, never real breach claims.

### Non-negotiable safety copy

Replace or avoid phrases like:

- “CLICK TO INITIATE BREACH”
- “REMOTE CODE EXECUTION” when attached to real CVE IDs
- “ROOT ACCESS ACHIEVED”
- “EXFILTRATED”
- “TRACE LOST. THEY CAN'T FIND US”

Use fictional framing instead:

- “Start cinematic simulation”
- “Load movie logic”
- “Bypass plot firewall”
- “Mainframe vibes acquired”
- “No packets were harmed”
- “Toy interface — zero real targets”

---

## Product Concept

### Core modes

1. **Cinematic Mode** — full-screen guided sequence with dramatic panels, fake plot beats, glitch effects, and a clear toy disclaimer.
2. **Dashboard Mode** — persistent multi-panel cockpit: terminal, map, matrix, packet noise, fake alerts, synth audio, progress bars.
3. **Screenshot Mode** — freezes the UI into a clean shareable state with a small Kastro Labs watermark and disclaimer.
4. **Boss Mode** — instantly turns the UI into a boring “Quarterly Infrastructure Hygiene Report” joke screen.

### Optional advanced interactions

- User can enter a harmless fictional “operation codename” that only changes labels locally.
- Theme switcher: VHS green, cyber amber, Nordic noir, LCARS-adjacent, Kastro yellow/black.
- Achievements: “Firewall Enjoyer”, “Mainframe Appreciator”, “No Packets Harmed”, “I Read the Disclaimer”.
- URL share state: `?mode=vhs&codename=firewall-party` without storing personal data.
- Audio defaults off or opt-in only; respect reduced-motion preferences.

---

## Rewrite Decision Gate

Before rewriting, run this gate:

1. If current app can be made safe and viral with CSS/JS copy changes in under one session, do the polish path.
2. If layout responsiveness, animation structure, and state orchestration block viral quality, do the rewrite path.
3. Preserve Go server unless there is a clear reason to replace it; Coolify/Nixpacks already deploys the current shape.
4. Avoid adding backend storage, analytics, auth, or real network scanning.

Recommended default: **rewrite the frontend, keep the Go server**.

---

## Task 1: Add public safety and brand framing

**Objective:** Make the existing app safe to share under Kastro Labs before deeper UI work.

**Files:**
- Modify: `static/index.html`
- Modify: `static/js/hack.js`
- Modify: `static/css/style.css`

**Steps:**
1. Change document title to `Hack the Planet by Kastro Labs`.
2. Add a fixed but unobtrusive disclaimer: “Toy interface. No real targets. No hacking.”
3. Change the launch button:
   - from: `CLICK TO INITIATE BREACH`
   - to: `START CINEMATIC SIMULATION`
4. Replace real/offensive-sounding sequence text in `static/js/hack.js` with fictional movie-hacker copy.
5. Keep humour high, specificity fake, and capability claims zero.
6. Run:
   - `go test ./...`
   - `go build ./...`
   - `git diff --check`

**Acceptance:** No UI copy implies real exploit, real breach, real exfiltration, real evasion, or real target compromise.

---

## Task 2: Add a proper Kastro Labs identity layer

**Objective:** Make the simulator feel intentionally Kastro-branded rather than a random hacker dashboard.

**Files:**
- Modify: `static/index.html`
- Modify: `static/css/style.css`
- Optional create: `static/js/branding.js`

**Steps:**
1. Add a small `Kastro Labs` mark/watermark.
2. Add a footer/status strip item: `htp.kastro.is · harmless simulator`.
3. Use Kastro yellow/black as an accent without destroying the green-screen fantasy.
4. Add an “About this toy” modal or panel with:
   - one-line explanation
   - safety disclaimer
   - link back to `https://kastro.is/en/labs/hack-the-planet`
5. Run local smoke and verify all controls remain reachable on mobile.

**Acceptance:** A screenshot clearly shows Kastro Labs ownership and harmless simulator framing.

---

## Task 3: Make it mobile and shareable

**Objective:** Ensure it works as a LinkedIn/social share object, not only on a desktop monitor.

**Files:**
- Modify: `static/css/style.css`
- Modify: `static/index.html`
- Optional modify: `static/js/main.js`

**Steps:**
1. Add responsive layout breakpoints:
   - desktop: full multi-panel cockpit
   - tablet: 2-column cockpit
   - mobile: stacked panels with the launch button and core terminal visible first
2. Add Open Graph/Twitter metadata:
   - `og:title`: `Hack the Planet by Kastro Labs`
   - `og:description`: `A harmless Hollywood hacker simulator. It does not hack anything.`
   - `og:url`: `https://htp.kastro.is`
   - add an OG image later if no asset exists yet.
3. Add `prefers-reduced-motion` handling for scanlines, shake, and heavy animation.
4. Run browser/mobile smoke.

**Acceptance:** The first screen is understandable and clickable on a phone; social metadata is present.

---

## Task 4: Upgrade the cinematic sequence

**Objective:** Turn the current sequence into a memorable, viral mini-performance.

**Files:**
- Modify: `static/js/hack.js`
- Modify: `static/js/hack3d.js`
- Modify: `static/js/audio.js`
- Optional create: `static/js/scenes.js`

**Steps:**
1. Extract sequence copy into structured scenes:
   - `boot`
   - `dialup`
   - `mainframeVibes`
   - `plotFirewall`
   - `noPacketsHarmed`
   - `victoryScreenshot`
2. Replace technical exploit claims with fake cinematic beats.
3. Add one or two big visual moments:
   - CRT bloom / VHS tracking roll
   - fake satellite uplink grid
   - “MAINFRAME VIBES ACQUIRED” splash
4. Add an end card with:
   - `Hack the Planet by Kastro Labs`
   - `No packets were harmed.`
   - replay CTA
5. Verify the sequence can be replayed without stale state.

**Acceptance:** The sequence is funny and screenshot-worthy while remaining explicitly harmless.

---

## Task 5: Add screenshot/share mode

**Objective:** Let users create a clean shareable moment without backend storage.

**Files:**
- Modify: `static/index.html`
- Modify: `static/js/main.js`
- Optional create: `static/js/share.js`
- Modify: `static/css/style.css`

**Steps:**
1. Add a `Screenshot mode` button.
2. When clicked, freeze animations enough to make the UI readable.
3. Add a temporary overlay label:
   - `Hack the Planet by Kastro Labs`
   - `Toy interface. No real targets.`
4. If using browser APIs, prefer client-side `navigator.share()` only when available; otherwise copy URL or show instructions.
5. Do not send screenshots to a backend.

**Acceptance:** Users can produce a clean screenshot manually; no personal data or backend storage is introduced.

---

## Task 6: Optional frontend rewrite spike

**Objective:** Decide whether a Vite/TypeScript rewrite is worth it before committing to it.

**Files:**
- Optional create: `frontend/` or `ui-spike/`
- Do not delete current `static/` until replacement is verified.

**Steps:**
1. Create a throwaway spike if needed:
   - `pnpm create vite ui-spike --template vanilla-ts` or write a minimal manual Vite setup.
2. Prototype only:
   - scene state machine
   - responsive panel shell
   - one cinematic transition
   - share/end card
3. Compare against current app:
   - bundle simplicity
   - deployment complexity
   - visual quality
   - maintainability
4. If adopted, configure build output to `static/` or embed `dist/` from Go.
5. Commit spike only if it becomes the chosen path; otherwise delete it.

**Acceptance:** The next session has evidence for polish-vs-rewrite, not vibes. Vibes are useful; evidence keeps them house-trained.

---

## Task 7: Deployment-safe verification

**Objective:** Push only a verified simulator that remains harmless and reachable.

**Commands:**
```bash
gofmt -w *.go
go test ./...
go build ./...
git diff --check
PORT=3001 go run .
```

Smoke locally:
```bash
python3 - <<'PY'
from urllib.request import urlopen
with urlopen('http://127.0.0.1:3001/', timeout=10) as r:
    print(r.status, r.headers.get('content-type'))
PY
```

After push/deploy, verify production:
```bash
python3 - <<'PY'
from urllib.request import urlopen
url = 'https://htp.kastro.is'
with urlopen(url, timeout=15) as r:
    body = r.read(200000).decode('utf-8', 'ignore')
    print(r.status, r.headers.get('content-type'))
    assert 'Hack the Planet' in body or 'HACK THE PLANET' in body
    assert 'Toy interface' in body or 'toy interface' in body
PY
```

**Acceptance:** Local gates pass, production returns 200 after deploy, and the body contains the harmless simulator marker.

---

## Out of Scope Unless Explicitly Approved

- Real scanning, exploitation, OSINT collection, or target input that implies real targeting.
- User accounts, storage, server-side screenshot capture, analytics, or tracking.
- DNS/Coolify changes.
- Security product positioning that makes Hack the Planet sound like a real offensive capability.

---

## Acceptance Criteria for the Next Session

- The app says `Hack the Planet by Kastro Labs`.
- The primary CTA starts a simulation, not a breach.
- Every page/state has a clear harmless-toy disclaimer.
- The current offensive-sounding sequence text is replaced with fictional movie-hacker copy.
- The UI is materially more screenshot-worthy on desktop and usable on mobile.
- `go test ./...`, `go build ./...`, and `git diff --check` pass.
- Production at `https://htp.kastro.is` is smoked after deployment.
- A Memento note captures what shipped, what remains, and whether polish or full rewrite was chosen.
