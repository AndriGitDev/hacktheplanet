// Full-screen cinematic hacking sequence
// Each phase has: duration, text lines, visual effects, color scheme

const PHASES = [
    {
        name: 'INIT',
        duration: 4000,
        color: '#00ff41',
        bgEffect: 'grid',
        lines: [
            { t: 0, text: '> INITIALIZING BREACH PROTOCOL v4.2.1...', speed: 30 },
            { t: 300, text: '> Loading exploit modules...', speed: 20 },
            { t: 600, text: '  [OK] kernel_inject.so', speed: 15 },
            { t: 800, text: '  [OK] ssl_forge.so', speed: 15 },
            { t: 1000, text: '  [OK] firewall_bypass.so', speed: 15 },
            { t: 1200, text: '  [OK] trace_evade.so', speed: 15 },
            { t: 1500, text: '> Establishing encrypted tunnel...', speed: 25 },
            { t: 2000, text: '> Routing through 14 proxy nodes...', speed: 25 },
            { t: 2500, text: '> TOR circuit established: ENTRY -> RELAY x12 -> EXIT', speed: 20 },
            { t: 3200, text: '> BREACH PROTOCOL ARMED. AWAITING TARGET.', speed: 30 },
        ],
        bar: { start: 500, end: 3500, label: 'LOADING MODULES' },
    },
    {
        name: 'SCAN',
        duration: 5000,
        color: '#00e5ff',
        bgEffect: 'scan',
        lines: [
            { t: 0, text: '> SCANNING TARGET NETWORK 10.0.0.0/8...', speed: 25 },
            { t: 500, text: '> Probing 16,777,216 hosts...', speed: 20 },
            { t: 2000, text: '> 847 hosts discovered. Analyzing services...', speed: 25 },
            { t: 2800, text: '> PORT 22   [SSH]    OpenSSH 8.9 -- PATCHED', speed: 15 },
            { t: 3000, text: '> PORT 80   [HTTP]   nginx/1.24 -- PATCHED', speed: 15 },
            { t: 3200, text: '> PORT 443  [HTTPS]  nginx/1.24 -- PATCHED', speed: 15 },
            { t: 3400, text: '> PORT 3306 [MYSQL]  MariaDB 10.11 -- PATCHED', speed: 15 },
            { t: 3600, text: '> PORT 8443 [HTTPS]  Apache Tomcat/9.0.12', speed: 15 },
            { t: 3900, text: '', speed: 0, special: 'vulnerability' },
            { t: 4200, text: '> CVE-2024-21733: REMOTE CODE EXECUTION', speed: 30 },
            { t: 4600, text: '> EXPLOIT AVAILABLE. TARGET ACQUIRED.', speed: 30 },
        ],
        bar: { start: 0, end: 2500, label: 'SCANNING NETWORK' },
        ipScroll: true,
    },
    {
        name: 'EXPLOIT',
        duration: 5000,
        color: '#00ff41',
        bgEffect: 'tunnel',
        lines: [
            { t: 0, text: '> DEPLOYING EXPLOIT: CVE-2024-21733', speed: 25 },
            { t: 500, text: '> Crafting malicious serialized object...', speed: 20 },
            { t: 1000, text: '> Injecting payload at offset 0x7FFF4A3B...', speed: 25 },
            { t: 1500, text: '> BUFFER OVERFLOW TRIGGERED', speed: 40 },
            { t: 2000, text: '> Shellcode executing in ring 0...', speed: 25 },
            { t: 2500, text: '> Escalating privileges: user -> root', speed: 25 },
            { t: 3000, text: '> # whoami', speed: 40 },
            { t: 3200, text: '  root', speed: 40 },
            { t: 3500, text: '> ROOT ACCESS ACHIEVED', speed: 40 },
            { t: 4000, text: '> Approaching firewall perimeter...', speed: 25 },
        ],
        bar: { start: 0, end: 3500, label: 'DEPLOYING EXPLOIT' },
    },
    {
        name: 'FIREWALL',
        duration: 4000,
        color: '#ffb000',
        bgEffect: 'firewall',
        lines: [
            { t: 0, text: '> FIREWALL DETECTED: ENTERPRISE GRADE', speed: 30 },
            { t: 500, text: '> Analyzing rule set... 2,847 rules found', speed: 20 },
            { t: 1000, text: '> Crafting evasion packets...', speed: 25 },
            { t: 1500, text: '> Layer 1 ████████████ BYPASSED', speed: 30 },
            { t: 2000, text: '> Layer 2 ████████████ BYPASSED', speed: 30 },
            { t: 2500, text: '> Layer 3 ████████████ BYPASSED', speed: 30 },
            { t: 3000, text: '> FIREWALL NEUTRALIZED', speed: 40 },
            { t: 3500, text: '> ENTERING SECURE NETWORK...', speed: 30 },
        ],
        bar: { start: 500, end: 3000, label: 'BREACHING FIREWALL' },
    },
    {
        name: 'EXFILTRATE',
        duration: 5000,
        color: '#00ff41',
        bgEffect: 'datastream',
        lines: [
            { t: 0, text: '> CONNECTED TO MAINFRAME CORE', speed: 30 },
            { t: 400, text: '> Mapping file system...', speed: 20 },
            { t: 800, text: '  /classified/project-BLACKBIRD/', speed: 15 },
            { t: 1000, text: '  /classified/project-NIGHTFALL/', speed: 15 },
            { t: 1200, text: '  /classified/project-CHIMERA/', speed: 15 },
            { t: 1600, text: '> Initiating data exfiltration...', speed: 25 },
            { t: 2000, text: '> Downloading: satellite_codes.db (2.4 GB)', speed: 20 },
            { t: 2800, text: '> Downloading: agent_identities.enc (847 MB)', speed: 20 },
            { t: 3600, text: '> Downloading: operation_files.tar.gz (5.1 GB)', speed: 20 },
            { t: 4200, text: '> TRANSFER COMPLETE: 8.347 GB EXFILTRATED', speed: 25 },
        ],
        bar: { start: 1600, end: 4200, label: 'EXFILTRATING DATA' },
    },
    {
        name: 'DETECTED',
        duration: 4000,
        color: '#ff0040',
        bgEffect: 'alarm',
        shake: true,
        lines: [
            { t: 0, text: '', speed: 0, special: 'alarm' },
            { t: 200, text: '  ██ INTRUSION DETECTION SYSTEM TRIGGERED ██', speed: 50 },
            { t: 600, text: '> TRACE INITIATED FROM 10.0.1.1', speed: 30 },
            { t: 1000, text: '> TRACE PROGRESS: 7 HOPS REMAINING', speed: 25 },
            { t: 1400, text: '> DEPLOYING COUNTERMEASURES...', speed: 30 },
            { t: 1800, text: '> Spoofing MAC address...', speed: 20 },
            { t: 2200, text: '> Injecting false trail to 192.168.42.13...', speed: 20 },
            { t: 2600, text: '> Fragmenting connection across 8 nodes...', speed: 20 },
            { t: 3000, text: '> TRACE LOST. THEY CAN\'T FIND US.', speed: 30 },
            { t: 3500, text: '> Cleaning up...', speed: 25 },
        ],
        bar: { start: 1400, end: 3000, label: 'EVADING TRACE' },
    },
    {
        name: 'CLEANUP',
        duration: 4000,
        color: '#00ff41',
        bgEffect: 'fade',
        lines: [
            { t: 0, text: '> INITIATING CLEANUP PROTOCOL', speed: 25 },
            { t: 400, text: '> Erasing access logs... done', speed: 20 },
            { t: 800, text: '> Removing backdoor artifacts... done', speed: 20 },
            { t: 1200, text: '> Patching exploited vulnerability... done', speed: 20 },
            { t: 1600, text: '> Restoring original file timestamps... done', speed: 20 },
            { t: 2000, text: '> Zeroing memory buffers... done', speed: 20 },
            { t: 2400, text: '> Closing encrypted tunnel... done', speed: 20 },
            { t: 2800, text: '> GHOST MODE: ALL TRACES ELIMINATED', speed: 30 },
            { t: 3200, text: '', speed: 0, special: 'complete' },
        ],
    },
];

export function startHackSequence(onComplete) {
    const overlay = document.createElement('div');
    overlay.id = 'hack-overlay';
    overlay.innerHTML = `
        <canvas id="hack-canvas"></canvas>
        <div id="hack-terminal"></div>
        <div id="hack-bar-container">
            <div id="hack-bar-label"></div>
            <div id="hack-bar"><div id="hack-bar-fill"></div></div>
        </div>
        <div id="hack-phase-name"></div>
        <div id="hack-big-text"></div>
        <div id="hack-ip-scroll"></div>
    `;
    document.body.appendChild(overlay);

    const canvas = document.getElementById('hack-canvas');
    const ctx = canvas.getContext('2d');
    const terminal = document.getElementById('hack-terminal');
    const barContainer = document.getElementById('hack-bar-container');
    const barLabel = document.getElementById('hack-bar-label');
    const barFill = document.getElementById('hack-bar-fill');
    const phaseName = document.getElementById('hack-phase-name');
    const bigText = document.getElementById('hack-big-text');
    const ipScroll = document.getElementById('hack-ip-scroll');

    let w, h;
    function resize() {
        w = window.innerWidth;
        h = window.innerHeight;
        canvas.width = w;
        canvas.height = h;
    }
    resize();
    window.addEventListener('resize', resize);

    // Audio context (always plays during sequence for immersion)
    let audioCtx;
    try { audioCtx = new AudioContext(); } catch(e) {}

    function playTone(freq, dur, vol = 0.08, type = 'sine') {
        if (!audioCtx) return;
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.frequency.value = freq;
        osc.type = type;
        gain.gain.setValueAtTime(vol, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + dur);
        osc.start();
        osc.stop(audioCtx.currentTime + dur);
    }

    function playTypeTick() {
        playTone(800 + Math.random() * 400, 0.02, 0.03, 'square');
    }

    function playAlarm() {
        for (let i = 0; i < 6; i++) {
            setTimeout(() => {
                playTone(i % 2 === 0 ? 880 : 440, 0.15, 0.12, 'sawtooth');
            }, i * 150);
        }
    }

    function playSuccess() {
        playTone(523, 0.15, 0.1);
        setTimeout(() => playTone(659, 0.15, 0.1), 150);
        setTimeout(() => playTone(784, 0.3, 0.12), 300);
    }

    function playBreach() {
        playTone(100, 0.5, 0.15, 'sawtooth');
        setTimeout(() => playTone(150, 0.3, 0.1, 'square'), 200);
    }

    // Background effects
    let bgFrame = 0;
    let currentBgEffect = 'grid';
    let currentColor = '#00ff41';
    let shaking = false;
    let particles = [];
    let firewallLayers = [
        { y: 0.3, broken: false, breakTime: 0 },
        { y: 0.5, broken: false, breakTime: 0 },
        { y: 0.7, broken: false, breakTime: 0 },
    ];
    let tunnelSpeed = 0;

    function drawBackground() {
        bgFrame++;
        ctx.fillStyle = 'rgba(6, 10, 15, 0.15)';
        ctx.fillRect(0, 0, w, h);

        // Apply shake
        if (shaking) {
            ctx.save();
            ctx.translate(
                (Math.random() - 0.5) * 8,
                (Math.random() - 0.5) * 8
            );
        }

        switch (currentBgEffect) {
            case 'grid': drawGrid(); break;
            case 'scan': drawScanEffect(); break;
            case 'tunnel': drawTunnel(); break;
            case 'firewall': drawFirewall(); break;
            case 'datastream': drawDataStream(); break;
            case 'alarm': drawAlarmBg(); break;
            case 'fade': drawFadeBg(); break;
        }

        // draw particles
        for (let i = particles.length - 1; i >= 0; i--) {
            const p = particles[i];
            p.x += p.vx;
            p.y += p.vy;
            p.life -= 0.01;
            if (p.life <= 0) { particles.splice(i, 1); continue; }
            ctx.fillStyle = `rgba(${p.r}, ${p.g}, ${p.b}, ${p.life})`;
            ctx.fillRect(p.x, p.y, p.size, p.size);
        }

        if (shaking) ctx.restore();

        requestAnimationFrame(drawBackground);
    }

    function drawGrid() {
        ctx.strokeStyle = `rgba(0, 255, 65, 0.04)`;
        ctx.lineWidth = 0.5;
        const spacing = 40;
        const offset = (bgFrame * 0.5) % spacing;
        for (let x = -spacing + offset; x < w + spacing; x += spacing) {
            ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
        }
        for (let y = -spacing + offset; y < h + spacing; y += spacing) {
            ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
        }
    }

    function drawScanEffect() {
        drawGrid();
        // scanning beam
        const scanY = (bgFrame * 3) % h;
        const grad = ctx.createLinearGradient(0, scanY - 40, 0, scanY + 40);
        grad.addColorStop(0, 'transparent');
        grad.addColorStop(0.5, 'rgba(0, 229, 255, 0.08)');
        grad.addColorStop(1, 'transparent');
        ctx.fillStyle = grad;
        ctx.fillRect(0, scanY - 40, w, 80);

        // scan line
        ctx.strokeStyle = 'rgba(0, 229, 255, 0.3)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(0, scanY);
        ctx.lineTo(w, scanY);
        ctx.stroke();
    }

    function drawTunnel() {
        tunnelSpeed += 0.02;
        const cx = w / 2;
        const cy = h / 2;
        ctx.strokeStyle = 'rgba(0, 255, 65, 0.06)';
        ctx.lineWidth = 1;

        for (let i = 0; i < 15; i++) {
            const scale = ((i * 0.07 + tunnelSpeed) % 1);
            const size = scale * Math.max(w, h);
            ctx.globalAlpha = 1 - scale;
            ctx.strokeRect(cx - size/2, cy - size/2, size, size);
        }
        ctx.globalAlpha = 1;

        // speed lines
        for (let i = 0; i < 5; i++) {
            const angle = Math.random() * Math.PI * 2;
            const r1 = 50 + Math.random() * 100;
            const r2 = r1 + 50 + Math.random() * 200;
            ctx.strokeStyle = `rgba(0, 255, 65, ${0.1 + Math.random() * 0.1})`;
            ctx.beginPath();
            ctx.moveTo(cx + Math.cos(angle) * r1, cy + Math.sin(angle) * r1);
            ctx.lineTo(cx + Math.cos(angle) * r2, cy + Math.sin(angle) * r2);
            ctx.stroke();
        }
    }

    function drawFirewall() {
        const cx = w / 2;

        for (let i = 0; i < firewallLayers.length; i++) {
            const layer = firewallLayers[i];
            const y = layer.y * h;

            if (layer.broken) {
                // shattered fragments
                const elapsed = bgFrame - layer.breakTime;
                if (elapsed < 60) {
                    for (let f = 0; f < 8; f++) {
                        const fx = cx + (f - 4) * (w / 8) + Math.sin(elapsed * 0.1 + f) * elapsed * 2;
                        const fy = y + (elapsed * elapsed * 0.05) * (f % 2 === 0 ? 1 : -1);
                        const alpha = Math.max(0, 1 - elapsed / 60);
                        ctx.fillStyle = `rgba(255, 176, 0, ${alpha * 0.3})`;
                        ctx.fillRect(fx - 15, fy - 2, 30, 4);
                    }
                }
            } else {
                // intact firewall line
                ctx.strokeStyle = 'rgba(255, 176, 0, 0.4)';
                ctx.lineWidth = 2;
                ctx.shadowColor = '#ffb000';
                ctx.shadowBlur = 10;
                ctx.beginPath();
                ctx.moveTo(0, y);
                ctx.lineTo(w, y);
                ctx.stroke();
                ctx.shadowBlur = 0;

                // hex pattern along line
                ctx.fillStyle = 'rgba(255, 176, 0, 0.15)';
                ctx.font = '8px monospace';
                for (let x = (bgFrame * 2) % 80; x < w; x += 80) {
                    ctx.fillText('██ FIREWALL ██', x, y - 4);
                }

                // shield icon
                ctx.fillStyle = 'rgba(255, 176, 0, 0.2)';
                ctx.font = '14px monospace';
                ctx.fillText('◆ LAYER ' + (i + 1) + ' ◆', w / 2 - 40, y + 16);
            }
        }
    }

    function drawDataStream() {
        // vertical data streams
        for (let i = 0; i < 30; i++) {
            const x = (i / 30) * w + ((bgFrame * (1 + i * 0.1)) % 20);
            const alpha = 0.03 + Math.sin(bgFrame * 0.05 + i) * 0.02;
            ctx.fillStyle = `rgba(0, 255, 65, ${alpha})`;
            ctx.font = '10px monospace';
            for (let j = 0; j < 20; j++) {
                const y = ((bgFrame * (2 + i * 0.3) + j * 16) % (h + 100)) - 50;
                const ch = String.fromCharCode(0x30A0 + Math.random() * 96);
                ctx.fillText(ch, x, y);
            }
        }
    }

    function drawAlarmBg() {
        // red pulsing border
        const pulse = Math.sin(bgFrame * 0.15) * 0.5 + 0.5;
        ctx.strokeStyle = `rgba(255, 0, 64, ${0.2 + pulse * 0.3})`;
        ctx.lineWidth = 4;
        ctx.shadowColor = '#ff0040';
        ctx.shadowBlur = 20 * pulse;
        ctx.strokeRect(10, 10, w - 20, h - 20);
        ctx.shadowBlur = 0;

        // red scan line
        const scanY = (bgFrame * 5) % h;
        ctx.fillStyle = `rgba(255, 0, 64, 0.05)`;
        ctx.fillRect(0, scanY - 2, w, 4);

        // WARNING text
        if (bgFrame % 30 < 15) {
            ctx.fillStyle = 'rgba(255, 0, 64, 0.06)';
            ctx.font = 'bold 80px monospace';
            ctx.textAlign = 'center';
            ctx.fillText('⚠ WARNING ⚠', w / 2, h / 2);
            ctx.textAlign = 'left';
        }
    }

    function drawFadeBg() {
        drawGrid();
        // gentle green pulse
        const pulse = Math.sin(bgFrame * 0.03) * 0.5 + 0.5;
        ctx.fillStyle = `rgba(0, 255, 65, ${pulse * 0.02})`;
        ctx.fillRect(0, 0, w, h);
    }

    function spawnParticles(x, y, count, r, g, b) {
        for (let i = 0; i < count; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = 1 + Math.random() * 4;
            particles.push({
                x, y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                life: 0.5 + Math.random() * 0.5,
                size: 1 + Math.random() * 3,
                r, g, b
            });
        }
    }

    // IP scroll effect for scan phase
    let ipScrollInterval = null;
    function startIpScroll() {
        ipScroll.style.display = 'block';
        ipScrollInterval = setInterval(() => {
            const ip = `${Math.random()*255|0}.${Math.random()*255|0}.${Math.random()*255|0}.${Math.random()*255|0}`;
            const port = [22, 80, 443, 3306, 5432, 8080, 8443, 27017][Math.random()*8|0];
            const status = ['CLOSED', 'FILTERED', 'CLOSED', 'CLOSED', 'FILTERED'][Math.random()*5|0];
            const line = document.createElement('div');
            line.textContent = `${ip}:${port} -- ${status}`;
            line.style.color = status === 'FILTERED' ? '#ffb000' : 'rgba(0, 255, 65, 0.3)';
            ipScroll.appendChild(line);
            if (ipScroll.children.length > 15) ipScroll.removeChild(ipScroll.firstChild);
            ipScroll.scrollTop = ipScroll.scrollHeight;
        }, 80);
    }
    function stopIpScroll() {
        if (ipScrollInterval) clearInterval(ipScrollInterval);
        ipScroll.style.display = 'none';
        ipScroll.innerHTML = '';
    }

    // Type text with typewriter effect
    function typeLine(text, speed, style) {
        return new Promise(resolve => {
            const line = document.createElement('div');
            line.className = 'hack-line';
            if (style) line.style.cssText = style;
            terminal.appendChild(line);

            // keep scrolled to bottom
            terminal.scrollTop = terminal.scrollHeight;

            if (speed === 0 || text === '') {
                resolve();
                return;
            }

            let i = 0;
            function type() {
                if (i < text.length) {
                    line.textContent += text[i];
                    i++;
                    playTypeTick();
                    terminal.scrollTop = terminal.scrollHeight;
                    setTimeout(type, speed);
                } else {
                    resolve();
                }
            }
            type();
        });
    }

    // Show big dramatic text
    function showBigText(text, color, duration = 1500) {
        bigText.textContent = text;
        bigText.style.color = color;
        bigText.style.textShadow = `0 0 30px ${color}, 0 0 60px ${color}`;
        bigText.classList.add('visible');
        setTimeout(() => {
            bigText.classList.remove('visible');
        }, duration);
    }

    // Run a single phase
    async function runPhase(phase, phaseIndex) {
        currentBgEffect = phase.bgEffect;
        currentColor = phase.color;
        shaking = !!phase.shake;

        // phase name indicator
        phaseName.textContent = `[${phaseIndex + 1}/${PHASES.length}] ${phase.name}`;
        phaseName.style.color = phase.color;

        // progress bar
        if (phase.bar) {
            barContainer.style.display = 'block';
            barLabel.textContent = phase.bar.label;
            barLabel.style.color = phase.color;
            barFill.style.width = '0%';
            barFill.style.background = phase.color;
            barFill.style.boxShadow = `0 0 10px ${phase.color}`;
        } else {
            barContainer.style.display = 'none';
        }

        if (phase.ipScroll) startIpScroll();

        const phaseStart = Date.now();
        const linePromises = [];

        for (const lineData of phase.lines) {
            const delay = lineData.t;
            linePromises.push(new Promise(resolve => {
                setTimeout(async () => {
                    if (lineData.special === 'vulnerability') {
                        showBigText('VULNERABILITY FOUND', '#ff0040', 2000);
                        playTone(200, 0.5, 0.12, 'sawtooth');
                        spawnParticles(w/2, h/2, 30, 255, 0, 64);
                    } else if (lineData.special === 'alarm') {
                        showBigText('⚠ DETECTED ⚠', '#ff0040', 2500);
                        playAlarm();
                        spawnParticles(w/2, h/2, 50, 255, 0, 64);
                    } else if (lineData.special === 'complete') {
                        showBigText('HACK COMPLETE', '#00ff41', 3000);
                        playSuccess();
                        spawnParticles(w/2, h/2, 80, 0, 255, 65);
                    } else {
                        let style = '';
                        if (lineData.text.includes('[OK]')) style = 'color: #00ff41;';
                        else if (lineData.text.includes('BYPASSED') || lineData.text.includes('ACHIEVED') ||
                                 lineData.text.includes('COMPLETE') || lineData.text.includes('ELIMINATED') ||
                                 lineData.text.includes('NEUTRALIZED') || lineData.text.includes('root')) {
                            style = `color: ${phase.color}; text-shadow: 0 0 10px ${phase.color}; font-weight: bold;`;
                        }
                        else if (lineData.text.includes('██')) style = `color: ${phase.color}; font-weight: bold;`;
                        await typeLine(lineData.text, lineData.speed, style);
                    }
                    resolve();
                }, delay);
            }));
        }

        // animate progress bar
        if (phase.bar) {
            const barStart = phase.bar.start;
            const barEnd = phase.bar.end;
            const barDuration = barEnd - barStart;
            setTimeout(() => {
                const startT = Date.now();
                function updateBar() {
                    const elapsed = Date.now() - startT;
                    const pct = Math.min(100, (elapsed / barDuration) * 100);
                    barFill.style.width = pct + '%';
                    if (pct < 100) requestAnimationFrame(updateBar);
                }
                updateBar();
            }, barStart);
        }

        // firewall breaking effect
        if (phase.name === 'FIREWALL') {
            for (let i = 0; i < 3; i++) {
                setTimeout(() => {
                    firewallLayers[i].broken = true;
                    firewallLayers[i].breakTime = bgFrame;
                    spawnParticles(w/2, firewallLayers[i].y * h, 40, 255, 176, 0);
                    playBreach();
                }, 1500 + i * 500);
            }
        }

        // wait for all lines and phase duration
        await Promise.all([
            ...linePromises,
            new Promise(resolve => setTimeout(resolve, phase.duration))
        ]);

        if (phase.ipScroll) stopIpScroll();
        shaking = false;
    }

    // Main sequence
    async function runSequence() {
        // initial fade in
        overlay.classList.add('visible');
        await new Promise(r => setTimeout(r, 800));

        for (let i = 0; i < PHASES.length; i++) {
            // clear terminal between phases (keep last 5 lines)
            while (terminal.children.length > 5) {
                terminal.removeChild(terminal.firstChild);
            }
            await runPhase(PHASES[i], i);
            await new Promise(r => setTimeout(r, 500));
        }

        // final stats screen
        await new Promise(r => setTimeout(r, 1500));
        terminal.innerHTML = '';
        await typeLine('╔══════════════════════════════════════╗', 10, 'color: #00ff41;');
        await typeLine('║       OPERATION SUMMARY              ║', 10, 'color: #00ff41; font-weight: bold;');
        await typeLine('╠══════════════════════════════════════╣', 10, 'color: #00ff41;');
        await typeLine('║  Target:    MAINFRAME-CORE            ║', 15, 'color: #00e5ff;');
        await typeLine('║  Exploit:   CVE-2024-21733            ║', 15, 'color: #00e5ff;');
        await typeLine('║  Data:      8.347 GB exfiltrated      ║', 15, 'color: #00e5ff;');
        await typeLine('║  Duration:  00:00:31                  ║', 15, 'color: #00e5ff;');
        await typeLine('║  Traces:    ZERO                      ║', 15, 'color: #00ff41; font-weight: bold;');
        await typeLine('║  Status:    MISSION ACCOMPLISHED       ║', 15, 'color: #ffb000; font-weight: bold;');
        await typeLine('╚══════════════════════════════════════╝', 10, 'color: #00ff41;');

        barContainer.style.display = 'none';
        phaseName.textContent = '';

        await new Promise(r => setTimeout(r, 3000));

        // fade out and cleanup
        overlay.classList.remove('visible');
        await new Promise(r => setTimeout(r, 800));
        overlay.remove();
        window.removeEventListener('resize', resize);
        if (audioCtx) audioCtx.close();

        // reset firewall state for next run
        firewallLayers.forEach(l => { l.broken = false; });
        tunnelSpeed = 0;
        particles = [];

        if (onComplete) onComplete();
    }

    drawBackground();
    runSequence();
}
