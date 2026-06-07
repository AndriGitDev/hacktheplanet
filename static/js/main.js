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
    const runButton = $('#run-cycle');
    const assetList = $('#asset-list');
    const findingsEl = $('#findings');
    const timelineEl = $('#timeline');
    const trafficRate = $('#traffic-rate');
    const confidenceEl = $('#confidence');
    const riskScore = $('#risk-score');
    const toastStack = $('#toast-stack');

    const assets = [
        { host: 'edge-01.example-corp.test', ip: '192.0.2.14', role: 'CDN terminator', ports: '443/tcp, 80/tcp', note: 'HSTS present, certificate expires in 37 days.', tag: 'web' },
        { host: 'vpn-gw.example-corp.test', ip: '198.51.100.22', role: 'remote access gateway', ports: '443/tcp', note: 'MFA policy simulated as enabled; posture check pending.', tag: 'identity' },
        { host: 'mail-relay.example-corp.test', ip: '203.0.113.19', role: 'mail edge', ports: '25/tcp, 587/tcp', note: 'SPF aligned; DMARC simulated at p=quarantine.', tag: 'mail' },
        { host: 'grafana.ops.example-corp.test', ip: '192.0.2.88', role: 'observability', ports: '443/tcp', note: 'Login page fingerprint resembles Grafana 10.x.', tag: 'ops' },
        { host: 'build-cache.example-corp.test', ip: '198.51.100.71', role: 'CI cache', ports: '443/tcp, 22/tcp', note: 'SSH banner intentionally redacted in this toy.', tag: 'ci' },
    ];

    const findings = [
        { severity: 'med', title: 'Certificate rotation window is narrow', body: 'edge-01 certificate chain has 37 simulated days remaining. Realistic operational risk, fake evidence.', evidence: 'x509.not_after = 2026-07-14T09:22:11Z' },
        { severity: 'low', title: 'Security headers mostly present', body: 'CSP, HSTS, X-Content-Type-Options observed in generated response set. Frame policy missing in one fake sample.', evidence: 'response[3].headers.frame-ancestors = null' },
        { severity: 'med', title: 'Legacy SSH exposure needs owner review', body: 'build-cache shows a fictional SSH service. No connection was attempted; this is rendered from seed data.', evidence: 'asset.port = 22/tcp / source = local fixture' },
        { severity: 'high', title: 'Demo secret detected and immediately invalidated', body: 'A fake token pattern appeared in a synthetic log line. It is not a credential and has no system behind it.', evidence: 'token = htp_demo_[redacted]_fixture' },
    ];

    const timeline = [
        '00:00 Scope loaded from local fixture: example-corp.test and RFC 5737 address space only.',
        '00:03 Passive DNS corpus generated. No resolver queries were sent.',
        '00:08 HTTP response samples replayed from deterministic simulator state.',
        '00:13 TLS chain inspected from fake certificate objects.',
        '00:21 Findings normalized into analyst queue.',
        '00:34 Operator note: app is theatrical, but workflow mirrors real triage language.',
    ];

    const commandOutput = {
        help: [
            ['cyan', 'Available commands:'],
            ['', '  scope     show authorised fictional scope'],
            ['', '  recon     generate a passive reconnaissance summary'],
            ['', '  dns       print fake DNS records'],
            ['', '  http      inspect simulated HTTP headers'],
            ['', '  tls       inspect simulated certificate details'],
            ['', '  notes     show analyst timeline'],
            ['', '  run       run a fake recon cycle'],
            ['', '  clear     clear terminal'],
        ],
        scope: [
            ['warn', 'Scope: SIMULATED / LOCAL FIXTURE ONLY'],
            ['', 'Organisation: Example Corp Test Environment'],
            ['', 'Domains: example-corp.test, *.example-corp.test'],
            ['', 'IP space: 192.0.2.0/24, 198.51.100.0/24, 203.0.113.0/24'],
            ['muted', 'These are documentation ranges. No internet traffic is generated.'],
        ],
        recon: [
            ['cyan', 'Passive recon summary'],
            ['', '5 assets inventoried from seed corpus'],
            ['', '9 synthetic services mapped'],
            ['', '4 findings staged for analyst review'],
            ['warn', 'Realism mode: details are plausible but fabricated.'],
        ],
        dns: [
            ['', 'A    edge-01.example-corp.test      192.0.2.14'],
            ['', 'A    vpn-gw.example-corp.test       198.51.100.22'],
            ['', 'MX   mail-relay.example-corp.test   priority=10'],
            ['', 'TXT  _dmarc.example-corp.test       v=DMARC1; p=quarantine; rua=mailto:dmarc@example-corp.test'],
            ['muted', 'DNS output is a local fixture. No resolver was contacted.'],
        ],
        http: [
            ['', 'GET https://edge-01.example-corp.test/ 200 OK'],
            ['', 'Server: htp-simulated-edge'],
            ['', 'Strict-Transport-Security: max-age=31536000; includeSubDomains'],
            ['', 'Content-Security-Policy: default-src \'self\'; frame-ancestors \'none\''],
            ['', 'X-Request-ID: sim-7f3c9d2b'],
        ],
        tls: [
            ['', 'Subject: CN=edge-01.example-corp.test'],
            ['', 'Issuer: CN=Kastro Demo Intermediate CA'],
            ['', 'SAN: edge-01.example-corp.test, www.example-corp.test'],
            ['warn', 'Not After: 2026-07-14T09:22:11Z (37 simulated days)'],
            ['muted', 'Certificate object is fake and generated in browser memory.'],
        ],
        notes: timeline.map((line) => ['', line]),
    };

    let runCount = 0;
    let confidence = 72;
    let packetFrame = 0;
    let graphFrame = 0;

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
        setTimeout(() => item.remove(), 4200);
    }

    function renderAssets() {
        assetList.innerHTML = assets.map((asset) => `
            <section class="asset-card">
                <header><span>${asset.host}</span><span class="badge">${asset.tag}</span></header>
                <p><code>${asset.ip}</code> · ${asset.role}</p>
                <p>Open services: ${asset.ports}</p>
                <p>${asset.note}</p>
            </section>
        `).join('');
    }

    function renderFindings() {
        findingsEl.innerHTML = findings.map((finding) => `
            <section class="finding">
                <header><span>${finding.title}</span><span class="badge ${finding.severity}">${finding.severity}</span></header>
                <p>${finding.body}</p>
                <footer>${finding.evidence}</footer>
            </section>
        `).join('');
    }

    function renderTimeline() {
        timelineEl.innerHTML = timeline.map((item) => `<li>${item}</li>`).join('');
    }

    function setMetrics(active = false) {
        const traffic = active ? (18 + Math.random() * 54) : (Math.random() * 2.2);
        trafficRate.textContent = `${traffic.toFixed(1)} kB/s`;
        confidence = Math.min(96, confidence + (active ? Math.random() * 1.8 : Math.random() * .18));
        confidenceEl.textContent = `${Math.floor(confidence)}%`;
        const high = findings.some((finding) => finding.severity === 'high');
        riskScore.textContent = high && confidence > 78 ? 'High' : 'Medium';
        riskScore.style.color = high && confidence > 78 ? 'var(--red)' : 'var(--yellow)';
    }

    function runCycle() {
        runCount += 1;
        toast('Fake recon cycle running from local fixtures only.');
        line('warn', `cycle[${runCount}] starting passive-only simulated workflow`);
        const sequence = [
            'loading fixture corpus: assets.json, dns.json, headers.json',
            'normalising hostnames and documentation IP ranges',
            'replaying synthetic HTTP/TLS observations',
            'correlating findings with analyst timeline',
            'cycle complete: no packets sent, no systems touched',
        ];
        sequence.forEach((text, index) => setTimeout(() => {
            line(index === sequence.length - 1 ? 'cyan' : '', `cycle[${runCount}] ${text}`);
            setMetrics(true);
        }, index * 520));
    }

    function executeCommand(raw) {
        const command = raw.trim().toLowerCase();
        if (!command) return;
        line('warn', `htp@simulator:~$ ${raw}`);
        if (command === 'clear') {
            terminal.innerHTML = '';
            return;
        }
        if (command === 'run') {
            runCycle();
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
            toast('Entered fake operations room. Nothing here touches real systems.');
        });
        aboutButton.addEventListener('click', () => {
            ackCheck.checked = true;
            enterButton.disabled = false;
            disclaimer.classList.remove('hidden');
        });
    }

    function initTerminal() {
        block([
            ['cyan', 'Hack the Planet console v2.0 — realistic fake operations mode'],
            ['warn', 'Safety interlock: local simulation only. No scanning. No exploitation.'],
            ['muted', 'Type help, or press “Run fake recon cycle”.'],
        ]);
        commandForm.addEventListener('submit', (event) => {
            event.preventDefault();
            executeCommand(commandInput.value);
            commandInput.value = '';
        });
        runButton.addEventListener('click', runCycle);
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
        graphFrame += .012;
        ctx.clearRect(0, 0, width, height);
        const center = { x: width * .5, y: height * .48 };
        const nodes = assets.map((asset, index) => {
            const angle = (Math.PI * 2 * index / assets.length) + graphFrame;
            return { asset, x: center.x + Math.cos(angle) * width * .29, y: center.y + Math.sin(angle) * height * .28 };
        });
        ctx.strokeStyle = 'rgba(255,212,59,.30)';
        ctx.lineWidth = 1;
        nodes.forEach((node) => {
            ctx.beginPath();
            ctx.moveTo(center.x, center.y);
            ctx.lineTo(node.x, node.y);
            ctx.stroke();
        });
        ctx.fillStyle = 'rgba(255,212,59,.95)';
        ctx.shadowColor = '#ffd43b';
        ctx.shadowBlur = 18;
        ctx.beginPath();
        ctx.arc(center.x, center.y, 8, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
        nodes.forEach((node) => {
            ctx.fillStyle = 'rgba(102,255,153,.95)';
            ctx.beginPath();
            ctx.arc(node.x, node.y, 5, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = 'rgba(216,252,226,.78)';
            ctx.font = '10px JetBrains Mono';
            ctx.fillText(node.asset.ip, node.x + 9, node.y + 4);
        });
        requestAnimationFrame(drawGraph);
    }

    function drawPackets() {
        const canvas = $('#packet-canvas');
        const { ctx, width, height } = sizeCanvas(canvas);
        packetFrame += 1;
        ctx.clearRect(0, 0, width, height);
        ctx.font = '11px JetBrains Mono';
        for (let i = 0; i < 28; i += 1) {
            const y = ((packetFrame * (1.2 + i * .05)) + i * 23) % (height + 28) - 14;
            const x = 10 + (i % 4) * (width / 4);
            const color = i % 7 === 0 ? '255,212,59' : i % 5 === 0 ? '98,223,255' : '102,255,153';
            ctx.fillStyle = `rgba(${color},${0.25 + (i % 6) * .08})`;
            const src = assets[i % assets.length].ip;
            const dst = assets[(i + 2) % assets.length].ip;
            ctx.fillText(`${src} → ${dst}  TLS1.3  ${64 + ((i * 37) % 900)}B`, x, y);
        }
        requestAnimationFrame(drawPackets);
    }

    function tickClock() {
        $('#clock').textContent = new Date().toLocaleTimeString('en-GB', { timeZone: 'UTC', hour12: false });
        setMetrics(false);
    }

    function init() {
        renderAssets();
        renderFindings();
        renderTimeline();
        initDisclaimer();
        initTerminal();
        drawGraph();
        drawPackets();
        tickClock();
        setInterval(tickClock, 1000);
    }

    init();
})();
