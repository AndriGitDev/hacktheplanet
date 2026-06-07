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
    const toolLoad = $('#tool-load');
    const toastStack = $('#toast-stack');
    const breachOverlay = $('#breach-overlay');
    const closeBreach = $('#close-breach');

    const tools = [
        { name: 'passive-dns', detail: 'correlating fixture-only DNS history', status: 'RUN', progress: 34 },
        { name: 'subfinder-sim', detail: 'enumerating seeded subdomains', status: 'RUN', progress: 48 },
        { name: 'httpx-theatre', detail: 'replaying synthetic header probes', status: 'RUN', progress: 61 },
        { name: 'tls-scry', detail: 'parsing fake certificate chain', status: 'RUN', progress: 76 },
        { name: 'dirb-mime', detail: 'testing local wordlist against fixture paths', status: 'RUN', progress: 29 },
        { name: 'log-shard', detail: 'tailing generated app logs', status: 'RUN', progress: 54 },
        { name: 'hashcat-stage', detail: 'cracking toy hashes in animation only', status: 'HOT', progress: 68 },
        { name: 'loot-vault', detail: 'staging fake evidence receipts', status: 'IDLE', progress: 12 },
    ];

    const scenario = [
        'Load authorised fictional scope and safety interlocks.',
        'Run passive reconnaissance from local fixtures.',
        'Identify stale admin panel and weak demo password policy.',
        'Stage password-cracker theatre against fake hash material.',
        'Simulate web session capture and privilege escalation.',
        'Generate fictional loot manifest and defensive remediation notes.',
        'Burn access, close session, and confirm no real systems were touched.',
    ];

    const fakeHashes = [
        '8f14e45fceea167a5a36dedd4bea2543',
        'c9f0f895fb98ab9159f51fd0297e236d',
        '45c48cce2e2d7fbdea1afc51c7c6ad26',
        'd3d9446802a44259755d38e6d163e820',
        '6512bd43d9caa6e02c990b0a82652dca',
        'c20ad4d76fe97759aa27a0c99bff6710',
        'c51ce410c124a10e0db5e4b97fc2af39',
    ];

    const commandOutput = {
        help: [
            ['cyan', 'HTP/OS command palette'],
            ['', '  tools     list running fake recon tools'],
            ['', '  crack     spike the password-cracker theatre'],
            ['', '  target    show fictional target dossier'],
            ['', '  hack      run the simulated Hack Target scenario'],
            ['', '  safety    explain why nothing here is real'],
            ['', '  clear     clear console'],
        ],
        tools: tools.map((tool) => ['', `${tool.name.padEnd(14)} ${tool.status.padEnd(4)} ${String(tool.progress).padStart(3)}%  ${tool.detail}`]),
        target: [
            ['warn', 'TARGET DOSSIER — FICTIONAL'],
            ['', 'host: aurora.example-corp.test'],
            ['', 'ip:   203.0.113.42 (documentation range)'],
            ['', 'stack: nginx fixture, fake Grafana panel, seeded logs'],
            ['', 'notes: vulnerable-looking details are theatrical and local'],
        ],
        safety: [
            ['warn', 'Safety model'],
            ['', 'No fetch/WebSocket/API calls are made to targets.'],
            ['', 'No DNS lookups, port scans, password attempts, or exploit traffic occur.'],
            ['', 'All tool activity is generated in browser memory from fixed strings.'],
        ],
    };

    let crackProgress = 8;
    let graphFrame = 0;
    let packetFrame = 0;
    let hacking = false;

    function line(className, text) {
        const div = document.createElement('div');
        div.className = `term-line ${className || ''}`.trim();
        div.textContent = text;
        terminal.appendChild(div);
        terminal.scrollTop = terminal.scrollHeight;
    }

    function block(rows) {
        rows.forEach(([className, text]) => line(className, text));
    }

    function toast(message) {
        const item = document.createElement('div');
        item.className = 'toast';
        item.textContent = message;
        toastStack.appendChild(item);
        setTimeout(() => item.remove(), 4300);
    }

    function renderTools() {
        toolSwarm.innerHTML = tools.map((tool) => {
            const badgeClass = tool.status === 'HOT' ? 'hot' : tool.status === 'IDLE' ? 'idle' : '';
            return `<section class="tool-card">
                <header><span>${tool.name}</span><span class="badge ${badgeClass}">${tool.status}</span></header>
                <div class="progress" style="--value:${tool.progress}%"><span></span></div>
                <p>${tool.detail}</p>
            </section>`;
        }).join('');
        const avg = tools.reduce((sum, tool) => sum + tool.progress, 0) / tools.length;
        toolLoad.textContent = `${Math.round(avg)}%`;
    }

    function renderScenario(activeIndex = -1, doneThrough = -1) {
        scenarioSteps.innerHTML = scenario.map((step, index) => {
            const cls = index === activeIndex ? 'active' : index <= doneThrough ? 'done' : '';
            return `<li class="${cls}">${step}</li>`;
        }).join('');
    }

    function addHashLine(forceHit = false) {
        const row = document.createElement('div');
        row.className = 'hash-line';
        const hash = fakeHashes[Math.floor(Math.random() * fakeHashes.length)];
        const rate = `${(180 + Math.random() * 760).toFixed(1)} kH/s`;
        const result = forceHit || Math.random() > .82 ? '<b>DEMO-HIT</b>' : 'searching';
        row.innerHTML = `<span>${hash.slice(0, 12)}…${hash.slice(-6)}</span><span>${rate}</span><span>${result}</span>`;
        hashRain.prepend(row);
        while (hashRain.children.length > 24) hashRain.lastElementChild.remove();
    }

    function setCrackProgress(value) {
        crackProgress = Math.max(0, Math.min(100, value));
        crackFill.style.width = `${crackProgress}%`;
        crackPercent.textContent = `${Math.round(crackProgress)}%`;
    }

    function animateIdle() {
        tools.forEach((tool) => {
            const drift = tool.status === 'IDLE' ? Math.random() * 4 : 1 + Math.random() * 9;
            tool.progress = (tool.progress + drift) % 100;
            if (tool.progress < 8) tool.progress += 12;
        });
        renderTools();
        setCrackProgress((crackProgress + Math.random() * 6) % 100);
        addHashLine(false);
    }

    function runCrackerSpike() {
        toast('Password cracker theatre spiking — fake hashes only.');
        line('warn', 'hashcat-stage: loading toy hash corpus from browser memory');
        for (let i = 0; i < 9; i += 1) {
            setTimeout(() => {
                setCrackProgress(Math.min(99, crackProgress + 7 + Math.random() * 9));
                addHashLine(i > 5);
                line(i > 5 ? 'cyan' : '', `hashcat-stage: batch ${i + 1}/9 ${i > 5 ? 'demo hit staged' : 'mask iteration complete'}`);
            }, i * 260);
        }
    }

    function runHackScenario() {
        if (hacking) return;
        hacking = true;
        hackButton.classList.add('running');
        hackButton.querySelector('span').textContent = 'Hacking…';
        toast('Running staged Hack Target scenario. Still no real target.');
        line('red', '>>> HACK TARGET pressed: beginning fictional scenario');
        renderScenario(0, -1);

        scenario.forEach((step, index) => {
            setTimeout(() => {
                renderScenario(index, index - 1);
                const prefix = String(index + 1).padStart(2, '0');
                line(index === 0 ? 'warn' : 'cyan', `[${prefix}/${scenario.length}] ${step}`);
                tools[index % tools.length].status = index > 3 ? 'HOT' : 'RUN';
                tools[index % tools.length].progress = 92;
                setCrackProgress(Math.min(100, crackProgress + 13));
                addHashLine(index > 2);
                renderTools();
            }, index * 1050);
        });

        setTimeout(() => {
            renderScenario(-1, scenario.length - 1);
            line('warn', '>>> Scenario complete: fictional compromise report generated');
            line('muted', 'No network calls, no password attempts, no exploit traffic, no persistence.');
            hackButton.classList.remove('running');
            hackButton.querySelector('span').textContent = 'Hack Target';
            hacking = false;
            breachOverlay.classList.add('visible');
        }, scenario.length * 1050 + 450);
    }

    function executeCommand(raw) {
        const command = raw.trim().toLowerCase();
        if (!command) return;
        line('warn', `root@htp-os:~# ${raw}`);
        if (command === 'clear') {
            terminal.innerHTML = '';
            return;
        }
        if (command === 'hack') {
            runHackScenario();
            return;
        }
        if (command === 'crack') {
            runCrackerSpike();
            return;
        }
        if (commandOutput[command]) {
            block(commandOutput[command]);
            return;
        }
        line('red', `unknown command: ${raw}`);
        line('muted', 'type help for available simulator commands');
    }

    function initDisclaimer() {
        const acknowledged = localStorage.getItem('htp-fake-disclaimer-ack') === 'true';
        if (acknowledged) disclaimer.classList.add('hidden');
        ackCheck.addEventListener('change', () => { enterButton.disabled = !ackCheck.checked; });
        enterButton.addEventListener('click', () => {
            localStorage.setItem('htp-fake-disclaimer-ack', 'true');
            disclaimer.classList.add('hidden');
            commandInput.focus();
            toast('HTP/OS booted. Simulation is local-only.');
        });
        aboutButton.addEventListener('click', () => {
            ackCheck.checked = true;
            enterButton.disabled = false;
            disclaimer.classList.remove('hidden');
        });
    }

    function initTerminal() {
        block([
            ['cyan', 'HTP/OS v3.0 — fake hacker operating system'],
            ['warn', 'Safety interlock active: no scanning, no cracking, no exploitation.'],
            ['muted', 'Recon tools and crackers are theatre. Press Hack Target for a staged scenario.'],
        ]);
        commandForm.addEventListener('submit', (event) => {
            event.preventDefault();
            executeCommand(commandInput.value);
            commandInput.value = '';
        });
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

    function drawGraph() {
        const canvas = $('#graph-canvas');
        const { ctx, width, height } = sizeCanvas(canvas);
        graphFrame += .014;
        ctx.clearRect(0, 0, width, height);
        const center = { x: width * .52, y: height * .50 };
        const nodes = [
            ['fw', '#ffd43b'], ['vpn', '#66ff99'], ['admin', '#ff4d6d'], ['db', '#62dfff'], ['logs', '#66ff99'], ['ci', '#ffd43b'],
        ].map(([label, color], index, arr) => {
            const angle = Math.PI * 2 * index / arr.length + graphFrame;
            return { label, color, x: center.x + Math.cos(angle) * width * .31, y: center.y + Math.sin(angle) * height * .29 };
        });
        ctx.strokeStyle = 'rgba(255,212,59,.26)';
        ctx.lineWidth = 1;
        nodes.forEach((node) => {
            ctx.beginPath(); ctx.moveTo(center.x, center.y); ctx.lineTo(node.x, node.y); ctx.stroke();
        });
        ctx.fillStyle = '#ffd43b';
        ctx.shadowColor = '#ffd43b';
        ctx.shadowBlur = 18;
        ctx.beginPath(); ctx.arc(center.x, center.y, 9, 0, Math.PI * 2); ctx.fill();
        ctx.shadowBlur = 0;
        ctx.font = '10px JetBrains Mono';
        nodes.forEach((node) => {
            ctx.fillStyle = node.color;
            ctx.beginPath(); ctx.arc(node.x, node.y, 6, 0, Math.PI * 2); ctx.fill();
            ctx.fillStyle = 'rgba(220,255,231,.8)';
            ctx.fillText(node.label, node.x + 10, node.y + 4);
        });
        requestAnimationFrame(drawGraph);
    }

    function drawPackets() {
        const canvas = $('#packet-canvas');
        if (!canvas) return;
        const { ctx, width, height } = sizeCanvas(canvas);
        packetFrame += 1;
        ctx.clearRect(0, 0, width, height);
        ctx.font = '11px JetBrains Mono';
        for (let i = 0; i < 28; i += 1) {
            const y = ((packetFrame * (1.2 + i * .05)) + i * 23) % (height + 28) - 14;
            const x = 10 + (i % 4) * (width / 4);
            ctx.fillStyle = i % 5 === 0 ? 'rgba(255,212,59,.55)' : 'rgba(102,255,153,.42)';
            ctx.fillText(`203.0.113.42 → 192.0.2.${14 + i} TLS1.3 ${64 + ((i * 37) % 900)}B`, x, y);
        }
        requestAnimationFrame(drawPackets);
    }

    function tickClock() {
        $('#clock').textContent = new Date().toLocaleTimeString('en-GB', { timeZone: 'UTC', hour12: false });
    }

    function init() {
        renderTools();
        renderScenario();
        initDisclaimer();
        initTerminal();
        setCrackProgress(crackProgress);
        for (let i = 0; i < 16; i += 1) addHashLine(false);
        drawGraph();
        drawPackets();
        tickClock();
        setInterval(tickClock, 1000);
        setInterval(animateIdle, 1500);
    }

    init();
})();
