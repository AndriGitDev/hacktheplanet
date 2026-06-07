(() => {
    'use strict';

    const $ = (selector) => document.querySelector(selector);
    const terminal = $('#terminal');
    const commandInput = $('#command-input');
    const commandForm = $('#command-form');
    const disclaimer = $('#disclaimer');
    const ackCheck = $('#ack-check');
    const enterButton = $('#enter-app');
    const aboutButton = $('#about-btn');
    const hackButton = $('#hack-target');
    const toolSwarm = $('#tool-swarm');
    const crackFill = $('#crack-fill');
    const crackPercent = $('#crack-percent');
    const hashRain = $('#hash-rain');
    const scenarioSteps = $('#scenario-steps');
    const sceneTitle = $('#scene-title');
    const traceCount = $('#trace-count');
    const toastStack = $('#toast-stack');
    const breachOverlay = $('#breach-overlay');
    const closeBreach = $('#close-breach');
    const movieOverlay = $('#movie-overlay');
    const movieTitle = $('#movie-title');
    const movieLog = $('#movie-log');
    const overlayCount = $('#overlay-count');

    const tools = [
        { name: 'sat-trace', detail: 'bouncing through fictional plot satellites', status: 'RUN', progress: 44 },
        { name: 'neonmap', detail: 'painting fake network constellations', status: 'RUN', progress: 57 },
        { name: 'port-cinema', detail: 'replaying seeded service banners', status: 'RUN', progress: 63 },
        { name: 'auth-theatre', detail: 'testing toy credentials against memory only', status: 'HOT', progress: 71 },
        { name: 'hashstorm', detail: 'melting demo hashes for visual drama', status: 'HOT', progress: 68 },
        { name: 'plotwall', detail: 'bypassing fictional plot firewall', status: 'RUN', progress: 39 },
        { name: 'loot-prop', detail: 'assembling fake trophy manifest', status: 'IDLE', progress: 19 },
    ];

    const scenario = [
        'Boot cinematic safety interlock and lock target to fiction.',
        'Spin up recon swarm and paint the fake world trace globe.',
        'Find dramatic-looking but harmless “admin” route in local fixtures.',
        'Surge toy password-cracker theatre against demo hashes.',
        'Trigger plot firewall bypass with movie logic only.',
        'Stage fake mainframe handshake and trophy screen.',
        'Print remediation notes and confirm reality was not touched.',
    ];

    const movieLines = [
        'safety.interlock = TRUE',
        'target = aurora.example-corp.test // FICTIONAL',
        'packet_engine = OFFLINE_RENDERER',
        'trace_globe.spawn(plot_nodes=12)',
        'tool_swarm.recon(mode="cinema")',
        'password_cracker.load(toy_hashes)',
        'plot_firewall.bypass(method="movie_logic")',
        'mainframe.vibes = MAXIMUM',
        'no_packets_harmed = TRUE',
    ];

    const fakeHashes = ['8f14e45fceea167a5a36dedd4bea2543', 'c9f0f895fb98ab9159f51fd0297e236d', '45c48cce2e2d7fbdea1afc51c7c6ad26', 'd3d9446802a44259755d38e6d163e820', '6512bd43d9caa6e02c990b0a82652dca', 'c20ad4d76fe97759aa27a0c99bff6710', 'c51ce410c124a10e0db5e4b97fc2af39'];

    const commandOutput = {
        help: [['cyan', 'HTP/OS cinematic command palette'], ['', '  tools     list fake Hollywood recon swarm'], ['', '  crack     spike the toy password-cracker theatre'], ['', '  target    show fictional target dossier'], ['', '  hack      press the big yellow button from the console'], ['', '  safety    prove this is local harmless theatre'], ['', '  clear     clear console']],
        target: [['warn', 'TARGET DOSSIER — FICTIONAL PROP'], ['', 'host: aurora.example-corp.test'], ['', 'ip:   203.0.113.42 (documentation range)'], ['', 'genre: Hollywood mainframe fever dream'], ['', 'promise: visual spectacle only; no systems contacted']],
        safety: [['warn', 'Safety proof'], ['', 'The browser renders strings, canvas particles, and timers.'], ['', 'No DNS lookups, scans, password attempts, exploit traffic, or external target calls occur.'], ['', 'The Hack Target button starts a local state machine. That is all.']],
    };

    let crackProgress = 12;
    let graphFrame = 0;
    let overlayFrame = 0;
    let hacking = false;
    let traceSeconds = 300;

    function line(className, text) {
        const div = document.createElement('div');
        div.className = `term-line ${className || ''}`.trim();
        div.textContent = text;
        terminal.appendChild(div);
        terminal.scrollTop = terminal.scrollHeight;
    }
    function block(rows) { rows.forEach(([className, text]) => line(className, text)); }
    function toast(message) { const item = document.createElement('div'); item.className = 'toast'; item.textContent = message; toastStack.appendChild(item); setTimeout(() => item.remove(), 4300); }

    function renderTools() {
        toolSwarm.innerHTML = tools.map((tool) => {
            const badgeClass = tool.status === 'HOT' ? 'hot' : tool.status === 'IDLE' ? 'idle' : '';
            return `<section class="tool-card"><header><span>${tool.name}</span><span class="badge ${badgeClass}">${tool.status}</span></header><div class="progress" style="--value:${tool.progress}%"><span></span></div><p>${tool.detail}</p></section>`;
        }).join('');
    }

    function renderScenario(activeIndex = -1, doneThrough = -1) {
        scenarioSteps.innerHTML = scenario.map((step, index) => `<li class="${index === activeIndex ? 'active' : index <= doneThrough ? 'done' : ''}">${step}</li>`).join('');
    }

    function addHashLine(forceHit = false) {
        const row = document.createElement('div');
        row.className = 'hash-line';
        const hash = fakeHashes[Math.floor(Math.random() * fakeHashes.length)];
        const rate = `${(220 + Math.random() * 1120).toFixed(1)} kH/s`;
        const result = forceHit || Math.random() > .84 ? '<b>PROP-HIT</b>' : 'searching';
        row.innerHTML = `<span>${hash.slice(0, 12)}…${hash.slice(-6)}</span><span>${rate}</span><span>${result}</span>`;
        hashRain.prepend(row);
        while (hashRain.children.length > 24) hashRain.lastElementChild.remove();
    }
    function setCrackProgress(value) { crackProgress = Math.max(0, Math.min(100, value)); crackFill.style.width = `${crackProgress}%`; crackPercent.textContent = `${Math.round(crackProgress)}%`; }

    function animateIdle() {
        tools.forEach((tool) => { const drift = tool.status === 'IDLE' ? Math.random() * 4 : 2 + Math.random() * 10; tool.progress = (tool.progress + drift) % 100; if (tool.progress < 8) tool.progress += 14; });
        renderTools();
        setCrackProgress((crackProgress + Math.random() * 7) % 100);
        addHashLine(false);
        traceSeconds = Math.max(0, traceSeconds - (hacking ? 2 : 1));
        if (traceSeconds === 0) traceSeconds = 300;
        traceCount.textContent = `${String(Math.floor(traceSeconds / 60)).padStart(2, '0')}:${String(traceSeconds % 60).padStart(2, '0')}`;
    }

    function runCrackerSpike() {
        toast('Toy password-cracker theatre spiking. No real cracking.');
        line('warn', 'hashstorm: loading demo hashes for cinematic burn');
        for (let i = 0; i < 11; i += 1) setTimeout(() => { setCrackProgress(Math.min(99, crackProgress + 6 + Math.random() * 10)); addHashLine(i > 6); line(i > 6 ? 'magenta' : '', `hashstorm: frame ${i + 1}/11 ${i > 6 ? 'prop hit staged' : 'mask animation complete'}`); }, i * 220);
    }

    function movieLogLine(text, className = '') {
        const div = document.createElement('div');
        div.className = `term-line ${className}`.trim();
        div.textContent = `> ${text}`;
        movieLog.appendChild(div);
        movieLog.scrollTop = movieLog.scrollHeight;
    }

    function runHackScenario() {
        if (hacking) return;
        hacking = true;
        hackButton.classList.add('running');
        hackButton.querySelector('span').textContent = 'Hacking…';
        movieOverlay.classList.add('visible');
        movieLog.innerHTML = '';
        overlayCount.textContent = '3';
        movieTitle.textContent = 'INITIALISING MAINFRAME THEATRE';
        toast('Cinematic simulation started. Reality remains untouched.');
        line('red', '>>> HACK TARGET: Hollywood sequence armed');
        renderScenario(0, -1);

        [3, 2, 1].forEach((num, index) => setTimeout(() => { overlayCount.textContent = String(num); movieLogLine(`countdown ${num}: no real network activity`, index === 0 ? 'warn' : ''); }, index * 520));

        scenario.forEach((step, index) => {
            setTimeout(() => {
                const title = ['BOOTING TRACE GLOBE', 'RECON SWARM ONLINE', 'ADMIN ROUTE GLITCH', 'TOY HASHSTORM', 'PLOT FIREWALL', 'MAINFRAME VIBES', 'REALITY CHECK'][index];
                movieTitle.textContent = title;
                overlayCount.textContent = String(scenario.length - index);
                renderScenario(index, index - 1);
                sceneTitle.textContent = title;
                line(index % 2 ? 'cyan' : 'magenta', `[${String(index + 1).padStart(2, '0')}/${scenario.length}] ${step}`);
                movieLogLine(step, index > 3 ? 'magenta' : 'cyan');
                movieLogLine(movieLines[index % movieLines.length]);
                tools[index % tools.length].status = 'HOT';
                tools[index % tools.length].progress = 96;
                setCrackProgress(Math.min(100, crackProgress + 12));
                addHashLine(index > 2);
                renderTools();
            }, 1700 + index * 1080);
        });

        setTimeout(() => {
            renderScenario(-1, scenario.length - 1);
            movieOverlay.classList.remove('visible');
            line('warn', '>>> HOLLYWOOD ENDING: Planet hacked. Reality untouched.');
            line('muted', 'No packets harmed. No targets contacted. No credentials used.');
            hackButton.classList.remove('running');
            hackButton.querySelector('span').textContent = 'Hack Target';
            hacking = false;
            breachOverlay.classList.add('visible');
        }, 1700 + scenario.length * 1080 + 700);
    }

    function executeCommand(raw) {
        const command = raw.trim().toLowerCase();
        if (!command) return;
        line('warn', `root@htp-os:~# ${raw}`);
        if (command === 'clear') { terminal.innerHTML = ''; return; }
        if (command === 'hack') { runHackScenario(); return; }
        if (command === 'crack') { runCrackerSpike(); return; }
        if (command === 'tools') { block(tools.map((tool) => ['', `${tool.name.padEnd(13)} ${tool.status.padEnd(4)} ${String(Math.round(tool.progress)).padStart(3)}%  ${tool.detail}`])); return; }
        if (commandOutput[command]) { block(commandOutput[command]); return; }
        line('red', `unknown command: ${raw}`); line('muted', 'type help for available simulator commands');
    }

    function initDisclaimer() {
        if (localStorage.getItem('htp-fake-disclaimer-ack') === 'true') disclaimer.classList.add('hidden');
        ackCheck.addEventListener('change', () => { enterButton.disabled = !ackCheck.checked; });
        enterButton.addEventListener('click', () => { localStorage.setItem('htp-fake-disclaimer-ack', 'true'); disclaimer.classList.add('hidden'); commandInput.focus(); toast('HTP/OS booted. Hollywood mode; local-only.'); });
        aboutButton.addEventListener('click', () => { ackCheck.checked = true; enterButton.disabled = false; disclaimer.classList.remove('hidden'); });
    }

    function initTerminal() {
        block([['cyan', 'HTP/OS v4.0 — Hollywood hacker-movie mode'], ['warn', 'Safety interlock active: toy interface, no real targets, no hacking.'], ['muted', 'Recon swarm, cracker theatre, and world trace are rendered locally. Press Hack Target.']]);
        commandForm.addEventListener('submit', (event) => { event.preventDefault(); executeCommand(commandInput.value); commandInput.value = ''; });
        hackButton.addEventListener('click', runHackScenario);
        closeBreach.addEventListener('click', () => breachOverlay.classList.remove('visible'));
    }

    function sizeCanvas(canvas) {
        const rect = canvas.getBoundingClientRect();
        const dpr = Math.min(2, window.devicePixelRatio || 1);
        canvas.width = Math.max(1, Math.floor(rect.width * dpr));
        canvas.height = Math.max(1, Math.floor(rect.height * dpr));
        const ctx = canvas.getContext('2d');
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        return { ctx, width: rect.width, height: rect.height };
    }

    function drawMatrix() {
        const canvas = $('#matrix-canvas');
        const { ctx, width, height } = sizeCanvas(canvas);
        const columns = Math.ceil(width / 18);
        const drops = Array.from({ length: columns }, () => Math.random() * height);
        const glyphs = '01#$%&{}[]<>/\\HTPKASTROPLANET';
        function frame() {
            ctx.fillStyle = 'rgba(2,4,3,.11)'; ctx.fillRect(0, 0, width, height);
            ctx.font = '14px JetBrains Mono';
            drops.forEach((y, i) => {
                const char = glyphs[Math.floor(Math.random() * glyphs.length)];
                ctx.fillStyle = i % 9 === 0 ? 'rgba(255,212,59,.72)' : 'rgba(102,255,153,.56)';
                ctx.fillText(char, i * 18, y);
                drops[i] = y > height + Math.random() * 900 ? 0 : y + 16 + Math.random() * 7;
            });
            requestAnimationFrame(frame);
        }
        frame();
    }

    function drawGlobe() {
        const canvas = $('#globe-canvas');
        const { ctx, width, height } = sizeCanvas(canvas);
        graphFrame += .018;
        ctx.clearRect(0, 0, width, height);
        const cx = width / 2, cy = height / 2, r = Math.min(width, height) * .34;
        ctx.strokeStyle = 'rgba(98,223,255,.18)'; ctx.lineWidth = 1;
        for (let i = -3; i <= 3; i += 1) { ctx.beginPath(); ctx.ellipse(cx, cy, r, Math.abs(r * i / 3), graphFrame, 0, Math.PI * 2); ctx.stroke(); }
        for (let i = 0; i < 10; i += 1) { const a = graphFrame + i * Math.PI / 5; ctx.beginPath(); ctx.ellipse(cx, cy, r * Math.abs(Math.cos(a)), r, 0, 0, Math.PI * 2); ctx.stroke(); }
        ctx.strokeStyle = 'rgba(255,212,59,.65)'; ctx.shadowColor = '#ffd43b'; ctx.shadowBlur = 16;
        for (let i = 0; i < 7; i += 1) {
            const a1 = graphFrame * 1.7 + i * .9, a2 = a1 + 1.6;
            const x1 = cx + Math.cos(a1) * r * .9, y1 = cy + Math.sin(a1 * 1.2) * r * .55;
            const x2 = cx + Math.cos(a2) * r * .9, y2 = cy + Math.sin(a2 * 1.2) * r * .55;
            ctx.beginPath(); ctx.moveTo(x1, y1); ctx.quadraticCurveTo(cx, cy - r * .8, x2, y2); ctx.stroke();
        }
        ctx.shadowBlur = 0; ctx.font = '11px JetBrains Mono'; ctx.fillStyle = 'rgba(220,255,231,.8)'; ctx.fillText('FICTIONAL TRACE GLOBE', 14, 22); ctx.fillStyle = '#ffd43b'; ctx.fillText('NO PACKETS HARMED', 14, 40);
        requestAnimationFrame(drawGlobe);
    }

    function drawOverlayOrb() {
        const canvas = $('#overlay-canvas');
        const { ctx, width, height } = sizeCanvas(canvas);
        overlayFrame += .04;
        ctx.clearRect(0, 0, width, height);
        const cx = width / 2, cy = height / 2, r = Math.min(width, height) * .30;
        for (let i = 0; i < 90; i += 1) {
            const a = overlayFrame + i * .42;
            const rr = r + Math.sin(overlayFrame * 2 + i) * 34;
            ctx.fillStyle = i % 7 === 0 ? 'rgba(255,212,59,.9)' : 'rgba(102,255,153,.45)';
            ctx.fillRect(cx + Math.cos(a) * rr, cy + Math.sin(a * 1.7) * rr * .7, 2, 2);
        }
        requestAnimationFrame(drawOverlayOrb);
    }

    function tickClock() { $('#clock').textContent = new Date().toLocaleTimeString('en-GB', { timeZone: 'UTC', hour12: false }); }

    function init() {
        renderTools(); renderScenario(); initDisclaimer(); initTerminal(); setCrackProgress(crackProgress);
        for (let i = 0; i < 18; i += 1) addHashLine(false);
        drawMatrix(); drawGlobe(); drawOverlayOrb(); tickClock();
        setInterval(tickClock, 1000); setInterval(animateIdle, 1200);
    }
    init();
})();
