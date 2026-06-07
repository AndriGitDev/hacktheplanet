// Full-screen cinematic simulation sequence.
// Intentionally harmless: all text is fictional movie-hacker theatre.

import { createHack3D } from './hack3d.js';

const PHASES = [
    {
        name: 'BOOT', duration: 4200, color: '#00ff41', bgEffect: 'grid',
        lines: [
            { t: 0, text: '> Warming up cathode-ray imagination engine...', speed: 24 },
            { t: 260, text: '> Loading movie_logic.dll', speed: 20 },
            { t: 520, text: '  [OK] trenchcoat shader', speed: 15 },
            { t: 760, text: '  [OK] dramatic keyboard clacks', speed: 15 },
            { t: 1000, text: '  [OK] legally distinct mainframe aura', speed: 15 },
            { t: 1320, text: '> Safety interlock: Toy interface. No real targets.', speed: 18 },
            { t: 1900, text: '> Operation codename accepted: {CODENAME}', speed: 22 },
            { t: 2700, text: '> Simulation armed. Reality remains unharmed.', speed: 24 },
        ],
        bar: { start: 400, end: 3200, label: 'CALIBRATING VIBES' },
    },
    {
        name: 'DIALUP', duration: 4700, color: '#00e5ff', bgEffect: 'scan',
        lines: [
            { t: 0, text: '> Dialling 555-MAINFRAME through a fictional modem...', speed: 24 },
            { t: 500, text: '> Handshake squeal translated into leadership buy-in.', speed: 20 },
            { t: 1100, text: '> Plot satellite acquired over Reykjavík-ish coordinates.', speed: 22 },
            { t: 1800, text: '> Routing through 14 imaginary coffee machines...', speed: 18 },
            { t: 2800, text: '> No networks scanned. No packets harmed. Good cinema though.', speed: 20 },
            { t: 3600, text: '', speed: 0, special: 'uplink' },
        ],
        bar: { start: 300, end: 3600, label: 'ESTABLISHING CINEMATIC UPLINK' },
    },
    {
        name: 'PLOT FIREWALL', duration: 5200, color: '#ffb000', bgEffect: 'firewall', shake: true,
        lines: [
            { t: 0, text: '> PLOT FIREWALL DETECTED: ENTERPRISE-GRADE HANDWAVING', speed: 25 },
            { t: 600, text: '> Analyzing rule set: 2,847 lines of cyber nonsense.', speed: 18 },
            { t: 1200, text: '> Deploying plot device: “I am in.”', speed: 24 },
            { t: 1900, text: '> Layer 1 ████████████ politely ignored', speed: 22 },
            { t: 2400, text: '> Layer 2 ████████████ defeated by montage', speed: 22 },
            { t: 3000, text: '> Layer 3 ████████████ bypassed with sunglasses', speed: 22 },
            { t: 3800, text: '', speed: 0, special: 'firewall' },
            { t: 4300, text: '> Plot firewall now believes this is a training video.', speed: 22 },
        ],
        bar: { start: 700, end: 3900, label: 'BYPASSING PLOT FIREWALL' },
    },
    {
        name: 'MAINFRAME', duration: 5200, color: '#00ff41', bgEffect: 'tunnel',
        lines: [
            { t: 0, text: '> Approaching mainframe vibes chamber...', speed: 24 },
            { t: 560, text: '> Spinning up rotating cube because executives expect it.', speed: 19 },
            { t: 1220, text: '> Rendering hexadecimal confetti at irresponsible speed.', speed: 18 },
            { t: 1900, text: '> whoami', speed: 32 },
            { t: 2200, text: '  person enjoying a harmless web toy', speed: 28 },
            { t: 2850, text: '> MAINFRAME VIBES ACQUIRED', speed: 34 },
            { t: 3300, text: '', speed: 0, special: 'mainframe' },
            { t: 4100, text: '> Reality check: no shells, no files, no secrets, no crime.', speed: 20 },
        ],
        bar: { start: 500, end: 3400, label: 'ACQUIRING MAINFRAME VIBES' },
    },
    {
        name: 'CHAOS MONTAGE', duration: 5200, color: '#ff4fd8', bgEffect: 'datastream',
        lines: [
            { t: 0, text: '> Initiating chaos montage...', speed: 24 },
            { t: 420, text: '> Downloading: dramatic_pause.wav (0 bytes)', speed: 18 },
            { t: 920, text: '> Downloading: stock_footage_of_server_room.mov (locally imagined)', speed: 16 },
            { t: 1600, text: '> Compressing bureaucracy into a neon progress bar...', speed: 18 },
            { t: 2300, text: '> Uplinking snack budget to the board of vibes.', speed: 20 },
            { t: 3100, text: '> TRANSFER COMPLETE: 0 GB. Perfectly GDPR-friendly.', speed: 24 },
            { t: 3900, text: '', speed: 0, special: 'noPackets' },
        ],
        bar: { start: 300, end: 3900, label: 'MOVING PURELY FICTIONAL DATA' },
    },
    {
        name: 'END CARD', duration: 5200, color: '#ffd43b', bgEffect: 'fade',
        lines: [
            { t: 0, text: '> Closing simulation tunnel that never existed...', speed: 22 },
            { t: 500, text: '> Restoring workplace credibility...', speed: 20 },
            { t: 1000, text: '> Award unlocked: No Packets Harmed.', speed: 20 },
            { t: 1700, text: '> Screenshot now recommended. Share responsibly.', speed: 22 },
            { t: 2500, text: '', speed: 0, special: 'complete' },
        ],
    },
];

export function startHackSequence(onComplete, options = {}) {
    try {
        _runHackSequence(onComplete, options);
    } catch (e) {
        console.error('Simulation sequence error:', e);
        if (onComplete) onComplete();
    }
}

function _runHackSequence(onComplete, options) {
    const codename = (options.codename || 'NO-PACKETS-HARMED').toUpperCase();
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const overlay = document.createElement('div');
    Object.assign(overlay.style, {
        position: 'fixed', inset: '0', zIndex: '200000',
        background: 'radial-gradient(circle at 50% 25%, rgba(0,229,255,.16), transparent 35%), #060a0f', opacity: '0',
        transition: 'opacity 0.8s ease', fontFamily: "'Share Tech Mono', 'Courier New', monospace",
    });

    const cvs = document.createElement('canvas');
    Object.assign(cvs.style, { position: 'absolute', inset: '0', width: '100%', height: '100%', zIndex: '1', pointerEvents: 'none' });
    overlay.appendChild(cvs);

    const brand = document.createElement('div');
    brand.textContent = 'HACK THE PLANET by KASTRO LABS // TOY INTERFACE // NO REAL TARGETS';
    Object.assign(brand.style, {
        position: 'absolute', left: 'clamp(18px,4vw,52px)', top: '22px', zIndex: '4',
        color: '#ffd43b', letterSpacing: '2.5px', fontSize: '11px', textShadow: '0 0 16px rgba(255,212,59,.45)',
    });
    overlay.appendChild(brand);

    let hack3d = null;
    let currentPhaseName = null;
    if (!reduceMotion) {
        createHack3D(overlay)
            .then(h => { hack3d = h; if (currentPhaseName) hack3d.setScene(currentPhaseName); })
            .catch(e => console.warn('3D layer failed to load, falling back to 2D:', e));
    }

    const terminal = document.createElement('div');
    Object.assign(terminal.style, {
        position: 'absolute', left: 'clamp(18px,4vw,52px)', top: '64px', right: 'clamp(18px,4vw,52px)', bottom: '132px',
        overflow: 'hidden', fontSize: 'clamp(12px,1.4vw,16px)', lineHeight: '1.65', zIndex: '2', color: '#9cffad',
    });
    overlay.appendChild(terminal);

    const barContainer = document.createElement('div');
    Object.assign(barContainer.style, { position: 'absolute', bottom: '62px', left: 'clamp(18px,4vw,52px)', right: 'clamp(18px,4vw,52px)', zIndex: '2', display: 'none' });
    const barLabel = document.createElement('div');
    Object.assign(barLabel.style, { fontSize: '10px', letterSpacing: '2px', marginBottom: '6px', color: '#93a363' });
    const barTrack = document.createElement('div');
    Object.assign(barTrack.style, { height: '9px', background: 'rgba(0,255,65,0.08)', border: '1px solid rgba(255,212,59,0.35)', overflow: 'hidden' });
    const barFill = document.createElement('div');
    Object.assign(barFill.style, { height: '100%', width: '0%', background: '#00ff41', boxShadow: '0 0 18px rgba(0,255,65,0.6)', transition: 'width 0.1s linear' });
    barTrack.appendChild(barFill);
    barContainer.appendChild(barLabel);
    barContainer.appendChild(barTrack);
    overlay.appendChild(barContainer);

    const phaseName = document.createElement('div');
    Object.assign(phaseName.style, { position: 'absolute', top: '22px', right: 'clamp(18px,4vw,52px)', fontSize: '10px', letterSpacing: '3px', zIndex: '4', color: '#7cff9b' });
    overlay.appendChild(phaseName);

    const bigText = document.createElement('div');
    Object.assign(bigText.style, {
        position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%) scale(0.82)',
        fontSize: 'clamp(30px,7vw,92px)', fontWeight: 'bold', letterSpacing: 'clamp(4px,1vw,12px)', textAlign: 'center',
        zIndex: '3', opacity: '0', transition: reduceMotion ? 'opacity .15s' : 'opacity .3s, transform .3s',
        pointerEvents: 'none', whiteSpace: 'normal', width: 'min(1100px, 92vw)', textTransform: 'uppercase',
    });
    overlay.appendChild(bigText);

    document.body.appendChild(overlay);

    const ctx = cvs.getContext('2d');
    let w, h;
    function resize() { w = window.innerWidth; h = window.innerHeight; cvs.width = w; cvs.height = h; }
    resize();
    const onResize = () => resize();
    window.addEventListener('resize', onResize);

    let audioCtx;
    try { audioCtx = new AudioContext(); } catch (e) { /* no audio */ }
    function tone(freq, dur, vol = 0.055, type = 'sine') {
        if (!audioCtx) return;
        try {
            const o = audioCtx.createOscillator(), g = audioCtx.createGain();
            o.connect(g); g.connect(audioCtx.destination); o.frequency.value = freq; o.type = type;
            g.gain.setValueAtTime(vol, audioCtx.currentTime); g.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + dur);
            o.start(); o.stop(audioCtx.currentTime + dur);
        } catch (e) { /* ignore audio errors */ }
    }
    function typeTick() { tone(760 + Math.random() * 520, 0.018, 0.022, 'square'); }

    let bgFrame = 0, currentBg = 'grid', shaking = false, particles = [], tunnelT = 0, running = true;
    function drawBg() {
        if (!running) return;
        bgFrame++;
        if (hack3d) ctx.clearRect(0, 0, w, h);
        else { ctx.fillStyle = 'rgba(6,10,15,0.16)'; ctx.fillRect(0, 0, w, h); }
        if (shaking && !reduceMotion) { ctx.save(); ctx.translate((Math.random() - 0.5) * 7, (Math.random() - 0.5) * 7); }
        if (!hack3d) {
            if (currentBg === 'grid' || currentBg === 'fade') {
                ctx.strokeStyle = 'rgba(0,255,65,0.055)'; ctx.lineWidth = 0.5;
                const sp = 42, off = (bgFrame * 0.5) % sp;
                for (let x = off; x < w; x += sp) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke(); }
                for (let y = off; y < h; y += sp) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke(); }
            } else if (currentBg === 'scan') {
                const sy = (bgFrame * 3) % h; ctx.fillStyle = 'rgba(0,229,255,0.05)'; ctx.fillRect(0, sy - 30, w, 60);
                ctx.strokeStyle = 'rgba(0,229,255,0.35)'; ctx.beginPath(); ctx.moveTo(0, sy); ctx.lineTo(w, sy); ctx.stroke();
            } else if (currentBg === 'tunnel') {
                tunnelT += 0.02; const cx = w / 2, cy = h / 2; ctx.strokeStyle = 'rgba(0,255,65,0.08)';
                for (let i = 0; i < 14; i++) { const s = ((i * 0.08 + tunnelT) % 1) * Math.max(w, h); ctx.globalAlpha = 1 - s / Math.max(w, h); ctx.strokeRect(cx - s / 2, cy - s / 2, s, s); }
                ctx.globalAlpha = 1;
            } else if (currentBg === 'firewall') {
                for (let i = 0; i < 4; i++) { const fy = (0.22 + i * 0.17) * h; ctx.strokeStyle = 'rgba(255,176,0,0.36)'; ctx.lineWidth = 2; ctx.shadowColor = '#ffb000'; ctx.shadowBlur = 10; ctx.beginPath(); ctx.moveTo(0, fy); ctx.lineTo(w, fy); ctx.stroke(); ctx.shadowBlur = 0; }
            } else if (currentBg === 'datastream') {
                ctx.fillStyle = 'rgba(255,79,216,0.045)'; ctx.font = '12px monospace';
                for (let i = 0; i < 28; i++) for (let j = 0; j < 12; j++) ctx.fillText(String.fromCharCode(0x30A0 + Math.random() * 96), (i / 28) * w, ((bgFrame * (1.3 + i * .16) + j * 20) % (h + 50)) - 25);
            }
        }
        for (let i = particles.length - 1; i >= 0; i--) {
            const p = particles[i]; p.x += p.vx; p.y += p.vy; p.life -= 0.01;
            if (p.life <= 0) { particles.splice(i, 1); continue; }
            ctx.fillStyle = `rgba(${p.r},${p.g},${p.b},${p.life})`; ctx.fillRect(p.x, p.y, p.size, p.size);
        }
        if (shaking && !reduceMotion) ctx.restore();
        requestAnimationFrame(drawBg);
    }

    function burst(x, y, n, r, g, b) {
        if (reduceMotion) return;
        for (let i = 0; i < n; i++) { const a = Math.random() * Math.PI * 2, sp = 1 + Math.random() * 4; particles.push({ x, y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, life: 0.5 + Math.random() * 0.6, size: 1 + Math.random() * 3, r, g, b }); }
    }

    function showBig(text, color, ms = 1500) {
        bigText.textContent = text; bigText.style.color = color; bigText.style.textShadow = `0 0 32px ${color}, 0 0 70px ${color}`; bigText.style.opacity = '1'; bigText.style.transform = 'translate(-50%,-50%) scale(1)';
        setTimeout(() => { bigText.style.opacity = '0'; bigText.style.transform = 'translate(-50%,-50%) scale(0.82)'; }, ms);
    }

    async function typeLine(text, speed, phase) {
        const line = document.createElement('div');
        line.style.whiteSpace = window.innerWidth < 680 ? 'normal' : 'nowrap';
        line.style.textShadow = '0 0 5px rgba(0,255,65,.35)';
        if (/OK|ACQUIRED|COMPLETE|No Packets|Toy interface|Safety/.test(text)) {
            line.style.color = phase.color; line.style.textShadow = `0 0 14px ${phase.color}`; line.style.fontWeight = 'bold';
        }
        terminal.appendChild(line); terminal.scrollTop = terminal.scrollHeight;
        const rendered = text.replace('{CODENAME}', codename);
        if (!rendered || speed === 0) return;
        for (let i = 0; i < rendered.length; i++) {
            line.textContent += rendered[i]; typeTick(); terminal.scrollTop = terminal.scrollHeight;
            await new Promise(r => setTimeout(r, reduceMotion ? 1 : speed));
        }
    }

    async function runPhase(phase, idx) {
        currentBg = phase.bgEffect; shaking = !!phase.shake; currentPhaseName = phase.name;
        phaseName.textContent = `[${idx + 1}/${PHASES.length}] ${phase.name}`; phaseName.style.color = phase.color;
        if (hack3d) hack3d.setScene(phase.name);
        if (phase.bar) {
            barContainer.style.display = 'block'; barLabel.textContent = phase.bar.label; barLabel.style.color = phase.color; barFill.style.width = '0%'; barFill.style.background = phase.color; barFill.style.boxShadow = `0 0 14px ${phase.color}`;
        } else barContainer.style.display = 'none';

        const waits = [];
        for (const ld of phase.lines) {
            waits.push(new Promise(resolve => setTimeout(async () => {
                try {
                    if (ld.special === 'uplink') { showBig('SATELLITE VIBES ONLINE', '#00e5ff', 1800); tone(330, .2, .09, 'sawtooth'); burst(w / 2, h / 2, 42, 0, 229, 255); if (hack3d) hack3d.event('vuln'); }
                    else if (ld.special === 'firewall') { showBig('PLOT FIREWALL BYPASSED', '#ffb000', 1800); tone(220, .35, .1, 'square'); burst(w / 2, h / 2, 54, 255, 176, 0); if (hack3d) { hack3d.event('bypass'); hack3d.shake(.45); } }
                    else if (ld.special === 'mainframe') { showBig('MAINFRAME VIBES ACQUIRED', '#00ff41', 2100); tone(523, .18, .09); setTimeout(() => tone(659, .18, .09), 160); setTimeout(() => tone(784, .32, .1), 320); burst(w / 2, h / 2, 72, 0, 255, 65); }
                    else if (ld.special === 'noPackets') { showBig('NO PACKETS HARMED', '#ff4fd8', 1900); burst(w / 2, h / 2, 60, 255, 79, 216); }
                    else if (ld.special === 'complete') { showBig('HACK THE PLANET\nBY KASTRO LABS', '#ffd43b', 2600); burst(w / 2, h / 2, 90, 255, 212, 59); }
                    else await typeLine(ld.text, ld.speed, phase);
                } catch (e) { console.error('Phase line error:', e); }
                resolve();
            }, ld.t)));
        }
        if (phase.bar) setTimeout(() => { const start = Date.now(), dur = phase.bar.end - phase.bar.start; (function tick() { const p = Math.min(100, ((Date.now() - start) / dur) * 100); barFill.style.width = p + '%'; if (p < 100) requestAnimationFrame(tick); })(); }, phase.bar.start);
        await Promise.all([...waits, new Promise(r => setTimeout(r, reduceMotion ? Math.min(phase.duration, 1200) : phase.duration))]);
        shaking = false;
    }

    async function runSequence() {
        try {
            overlay.style.opacity = '1'; await new Promise(r => setTimeout(r, reduceMotion ? 80 : 800));
            for (let i = 0; i < PHASES.length; i++) { while (terminal.children.length > 8) terminal.removeChild(terminal.firstChild); await runPhase(PHASES[i], i); await new Promise(r => setTimeout(r, reduceMotion ? 80 : 420)); }
            await new Promise(r => setTimeout(r, reduceMotion ? 80 : 900));
            terminal.innerHTML = '';
            const stats = [
                '+====================================================+',
                '|            HACK THE PLANET BY KASTRO LABS          |',
                '+====================================================+',
                `|  Codename:  ${codename.padEnd(34).slice(0, 34)} |`,
                '|  Mode:      Hollywood hacker simulator              |',
                '|  Targets:   0 real systems                          |',
                '|  Data:      0 GB exfiltrated                        |',
                '|  Packets:   unharmed                                |',
                '|  Status:    MAINFRAME VIBES ACQUIRED                |',
                '+====================================================+',
                'Press Screenshot Mode on the dashboard for a clean share state.',
            ];
            for (const s of stats) { const l = document.createElement('div'); l.style.whiteSpace = window.innerWidth < 680 ? 'normal' : 'nowrap'; l.style.color = s.includes('MAINFRAME') || s.includes('KASTRO') ? '#ffd43b' : '#00e5ff'; l.style.textShadow = '0 0 4px currentColor'; l.textContent = s; terminal.appendChild(l); await new Promise(r => setTimeout(r, reduceMotion ? 20 : 100)); }
            barContainer.style.display = 'none'; phaseName.textContent = ''; await new Promise(r => setTimeout(r, reduceMotion ? 350 : 3200));
            overlay.style.opacity = '0'; await new Promise(r => setTimeout(r, reduceMotion ? 80 : 800));
        } catch (e) { console.error('Sequence error:', e); }
        finally {
            running = false; if (hack3d) try { hack3d.dispose(); } catch (e) { /* noop */ }
            overlay.remove(); window.removeEventListener('resize', onResize); if (audioCtx) try { audioCtx.close(); } catch (e) { /* noop */ }
            if (onComplete) onComplete();
        }
    }

    drawBg();
    runSequence();
}
