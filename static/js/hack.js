// Full-screen cinematic hacking sequence
// All styling is inline — no external CSS dependency

import { createHack3D } from './hack3d.js';

const PHASES = [
    {
        name: 'INIT', duration: 4000, color: '#00ff41', bgEffect: 'grid',
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
        name: 'SCAN', duration: 5000, color: '#00e5ff', bgEffect: 'scan',
        lines: [
            { t: 0, text: '> SCANNING TARGET NETWORK 10.0.0.0/8...', speed: 25 },
            { t: 500, text: '> Probing 16,777,216 hosts...', speed: 20 },
            { t: 2000, text: '> 847 hosts discovered. Analyzing services...', speed: 25 },
            { t: 2800, text: '> PORT 22   [SSH]    OpenSSH 8.9 -- PATCHED', speed: 15 },
            { t: 3000, text: '> PORT 80   [HTTP]   nginx/1.24 -- PATCHED', speed: 15 },
            { t: 3200, text: '> PORT 443  [HTTPS]  nginx/1.24 -- PATCHED', speed: 15 },
            { t: 3400, text: '> PORT 8443 [HTTPS]  Apache Tomcat/9.0.12', speed: 15 },
            { t: 3700, text: '', speed: 0, special: 'vulnerability' },
            { t: 4000, text: '> CVE-2024-21733: REMOTE CODE EXECUTION', speed: 30 },
            { t: 4400, text: '> EXPLOIT AVAILABLE. TARGET ACQUIRED.', speed: 30 },
        ],
        bar: { start: 0, end: 2500, label: 'SCANNING NETWORK' },
    },
    {
        name: 'EXPLOIT', duration: 5000, color: '#00ff41', bgEffect: 'tunnel',
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
        name: 'FIREWALL', duration: 4000, color: '#ffb000', bgEffect: 'firewall',
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
        name: 'EXFILTRATE', duration: 5000, color: '#00ff41', bgEffect: 'datastream',
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
        name: 'DETECTED', duration: 4000, color: '#ff0040', bgEffect: 'alarm', shake: true,
        lines: [
            { t: 0, text: '', speed: 0, special: 'alarm' },
            { t: 200, text: '  ## INTRUSION DETECTION SYSTEM TRIGGERED ##', speed: 50 },
            { t: 600, text: '> TRACE INITIATED FROM 10.0.1.1', speed: 30 },
            { t: 1000, text: '> TRACE PROGRESS: 7 HOPS REMAINING', speed: 25 },
            { t: 1400, text: '> DEPLOYING COUNTERMEASURES...', speed: 30 },
            { t: 1800, text: '> Spoofing MAC address...', speed: 20 },
            { t: 2200, text: '> Injecting false trail to 192.168.42.13...', speed: 20 },
            { t: 2600, text: '> Fragmenting connection across 8 nodes...', speed: 20 },
            { t: 3000, text: "> TRACE LOST. THEY CAN'T FIND US.", speed: 30 },
            { t: 3500, text: '> Cleaning up...', speed: 25 },
        ],
        bar: { start: 1400, end: 3000, label: 'EVADING TRACE' },
    },
    {
        name: 'CLEANUP', duration: 4000, color: '#00ff41', bgEffect: 'fade',
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
    try {
        _runHackSequence(onComplete);
    } catch (e) {
        console.error('Hack sequence error:', e);
        if (onComplete) onComplete();
    }
}

function _runHackSequence(onComplete) {
    // Build overlay with ALL inline styles — no CSS dependency
    const overlay = document.createElement('div');
    Object.assign(overlay.style, {
        position: 'fixed', inset: '0', zIndex: '200000',
        background: '#060a0f', opacity: '0',
        transition: 'opacity 0.8s ease',
        fontFamily: "'Share Tech Mono', 'Courier New', monospace",
    });

    const cvs = document.createElement('canvas');
    Object.assign(cvs.style, { position: 'absolute', inset: '0', width: '100%', height: '100%', zIndex: '1', pointerEvents: 'none' });
    overlay.appendChild(cvs);

    // 3D scene layer — sits below the 2D overlay canvas so particles still render on top
    let hack3d = null;
    createHack3D(overlay)
        .then(h => {
            hack3d = h;
            // If a phase was already set before 3D finished loading, apply it now
            if (currentPhaseName) hack3d.setScene(currentPhaseName);
        })
        .catch(e => console.warn('3D layer failed to load, falling back to 2D:', e));
    let currentPhaseName = null;

    const terminal = document.createElement('div');
    Object.assign(terminal.style, {
        position: 'absolute', left: '40px', top: '60px', right: '40px', bottom: '120px',
        overflow: 'hidden', fontSize: '13px', lineHeight: '1.6', zIndex: '2', color: '#00cc33',
    });
    overlay.appendChild(terminal);

    const barContainer = document.createElement('div');
    Object.assign(barContainer.style, {
        position: 'absolute', bottom: '60px', left: '40px', right: '40px',
        zIndex: '2', display: 'none',
    });
    const barLabel = document.createElement('div');
    Object.assign(barLabel.style, { fontSize: '9px', letterSpacing: '2px', marginBottom: '4px', color: '#0a5f0a' });
    const barTrack = document.createElement('div');
    Object.assign(barTrack.style, { height: '6px', background: 'rgba(0,255,65,0.08)', border: '1px solid rgba(0,255,65,0.15)', overflow: 'hidden' });
    const barFill = document.createElement('div');
    Object.assign(barFill.style, { height: '100%', width: '0%', background: '#00ff41', boxShadow: '0 0 10px rgba(0,255,65,0.4)', transition: 'width 0.1s linear' });
    barTrack.appendChild(barFill);
    barContainer.appendChild(barLabel);
    barContainer.appendChild(barTrack);
    overlay.appendChild(barContainer);

    const phaseName = document.createElement('div');
    Object.assign(phaseName.style, {
        position: 'absolute', top: '20px', right: '40px',
        fontSize: '9px', letterSpacing: '3px', zIndex: '2', color: '#0a5f0a',
    });
    overlay.appendChild(phaseName);

    const bigText = document.createElement('div');
    Object.assign(bigText.style, {
        position: 'absolute', top: '50%', left: '50%',
        transform: 'translate(-50%,-50%) scale(0.8)',
        fontSize: 'clamp(28px,5vw,60px)', fontWeight: 'bold', letterSpacing: '8px',
        zIndex: '3', opacity: '0', transition: 'opacity 0.3s, transform 0.3s',
        pointerEvents: 'none', whiteSpace: 'nowrap',
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

    function tone(freq, dur, vol = 0.08, type = 'sine') {
        if (!audioCtx) return;
        try {
            const o = audioCtx.createOscillator(), g = audioCtx.createGain();
            o.connect(g); g.connect(audioCtx.destination);
            o.frequency.value = freq; o.type = type;
            g.gain.setValueAtTime(vol, audioCtx.currentTime);
            g.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + dur);
            o.start(); o.stop(audioCtx.currentTime + dur);
        } catch (e) { /* ignore audio errors */ }
    }

    function typeTick() { tone(800 + Math.random() * 400, 0.02, 0.03, 'square'); }

    // background effect state
    let bgFrame = 0, currentBg = 'grid', shaking = false, particles = [], tunnelT = 0;
    let running = true;

    function drawBg() {
        if (!running) return;
        bgFrame++;
        // When 3D is active we keep the 2D canvas mostly transparent so the 3D shows through.
        // Fade existing 2D content out each frame instead of painting the dark background on top.
        if (hack3d) {
            ctx.clearRect(0, 0, w, h);
        } else {
            ctx.fillStyle = 'rgba(6,10,15,0.15)';
            ctx.fillRect(0, 0, w, h);
        }
        if (shaking) { ctx.save(); ctx.translate((Math.random() - 0.5) * 8, (Math.random() - 0.5) * 8); }

        if (hack3d) {
            // 3D scene provides backgrounds — skip redundant 2D decor
        } else if (currentBg === 'grid' || currentBg === 'fade') {
            ctx.strokeStyle = 'rgba(0,255,65,0.04)';
            ctx.lineWidth = 0.5;
            const sp = 40, off = (bgFrame * 0.5) % sp;
            for (let x = off; x < w; x += sp) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke(); }
            for (let y = off; y < h; y += sp) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke(); }
        } else if (currentBg === 'scan') {
            const sy = (bgFrame * 3) % h;
            ctx.fillStyle = 'rgba(0,229,255,0.04)';
            ctx.fillRect(0, sy - 30, w, 60);
            ctx.strokeStyle = 'rgba(0,229,255,0.3)'; ctx.lineWidth = 1;
            ctx.beginPath(); ctx.moveTo(0, sy); ctx.lineTo(w, sy); ctx.stroke();
        } else if (currentBg === 'tunnel') {
            tunnelT += 0.02;
            const cx = w / 2, cy = h / 2;
            ctx.strokeStyle = 'rgba(0,255,65,0.06)'; ctx.lineWidth = 1;
            for (let i = 0; i < 12; i++) {
                const s = ((i * 0.08 + tunnelT) % 1) * Math.max(w, h);
                ctx.globalAlpha = 1 - s / Math.max(w, h);
                ctx.strokeRect(cx - s / 2, cy - s / 2, s, s);
            }
            ctx.globalAlpha = 1;
        } else if (currentBg === 'firewall') {
            for (let i = 0; i < 3; i++) {
                const fy = (0.3 + i * 0.2) * h;
                ctx.strokeStyle = 'rgba(255,176,0,0.3)'; ctx.lineWidth = 2;
                ctx.shadowColor = '#ffb000'; ctx.shadowBlur = 8;
                ctx.beginPath(); ctx.moveTo(0, fy); ctx.lineTo(w, fy); ctx.stroke();
                ctx.shadowBlur = 0;
            }
        } else if (currentBg === 'datastream') {
            ctx.fillStyle = 'rgba(0,255,65,0.03)'; ctx.font = '10px monospace';
            for (let i = 0; i < 25; i++) {
                for (let j = 0; j < 15; j++) {
                    const x = (i / 25) * w;
                    const y = ((bgFrame * (1.5 + i * 0.2) + j * 16) % (h + 50)) - 25;
                    ctx.fillText(String.fromCharCode(0x30A0 + Math.random() * 96), x, y);
                }
            }
        } else if (currentBg === 'alarm') {
            const p = Math.sin(bgFrame * 0.15) * 0.5 + 0.5;
            ctx.strokeStyle = `rgba(255,0,64,${0.2 + p * 0.3})`; ctx.lineWidth = 4;
            ctx.shadowColor = '#ff0040'; ctx.shadowBlur = 20 * p;
            ctx.strokeRect(10, 10, w - 20, h - 20);
            ctx.shadowBlur = 0;
        }

        // particles
        for (let i = particles.length - 1; i >= 0; i--) {
            const p = particles[i];
            p.x += p.vx; p.y += p.vy; p.life -= 0.01;
            if (p.life <= 0) { particles.splice(i, 1); continue; }
            ctx.fillStyle = `rgba(${p.r},${p.g},${p.b},${p.life})`;
            ctx.fillRect(p.x, p.y, p.size, p.size);
        }

        if (shaking) ctx.restore();
        requestAnimationFrame(drawBg);
    }

    function burst(x, y, n, r, g, b) {
        for (let i = 0; i < n; i++) {
            const a = Math.random() * Math.PI * 2, sp = 1 + Math.random() * 4;
            particles.push({ x, y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, life: 0.5 + Math.random() * 0.5, size: 1 + Math.random() * 3, r, g, b });
        }
    }

    function typeLine(text, speed) {
        return new Promise(resolve => {
            const line = document.createElement('div');
            line.style.whiteSpace = 'nowrap';
            line.style.textShadow = '0 0 4px rgba(0,255,65,0.3)';
            terminal.appendChild(line);
            terminal.scrollTop = terminal.scrollHeight;
            if (!text || speed === 0) { resolve(); return; }
            let i = 0;
            (function tick() {
                if (i < text.length) {
                    line.textContent += text[i++];
                    typeTick();
                    terminal.scrollTop = terminal.scrollHeight;
                    setTimeout(tick, speed);
                } else { resolve(); }
            })();
        });
    }

    function showBig(text, color, ms = 1500) {
        bigText.textContent = text;
        bigText.style.color = color;
        bigText.style.textShadow = `0 0 30px ${color}, 0 0 60px ${color}`;
        bigText.style.opacity = '1';
        bigText.style.transform = 'translate(-50%,-50%) scale(1)';
        setTimeout(() => {
            bigText.style.opacity = '0';
            bigText.style.transform = 'translate(-50%,-50%) scale(0.8)';
        }, ms);
    }

    async function runPhase(phase, idx) {
        currentBg = phase.bgEffect;
        shaking = !!phase.shake;
        phaseName.textContent = `[${idx + 1}/${PHASES.length}] ${phase.name}`;
        phaseName.style.color = phase.color;
        currentPhaseName = phase.name;
        if (hack3d) hack3d.setScene(phase.name);

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

        const waits = [];
        for (const ld of phase.lines) {
            waits.push(new Promise(resolve => {
                setTimeout(async () => {
                    try {
                        if (ld.special === 'vulnerability') { showBig('VULNERABILITY FOUND', '#ff0040', 2000); tone(200, 0.5, 0.12, 'sawtooth'); burst(w / 2, h / 2, 30, 255, 0, 64); if (hack3d) { hack3d.event('vuln'); hack3d.shake(0.4); } }
                        else if (ld.special === 'alarm') { showBig('!! DETECTED !!', '#ff0040', 2500); for (let j = 0; j < 6; j++) setTimeout(() => tone(j % 2 ? 880 : 440, 0.15, 0.12, 'sawtooth'), j * 150); burst(w / 2, h / 2, 50, 255, 0, 64); if (hack3d) hack3d.shake(0.8); }
                        else if (ld.special === 'complete') { showBig('HACK COMPLETE', '#00ff41', 3000); tone(523, 0.15, 0.1); setTimeout(() => tone(659, 0.15, 0.1), 150); setTimeout(() => tone(784, 0.3, 0.12), 300); burst(w / 2, h / 2, 80, 0, 255, 65); }
                        else {
                            // Trigger 3D events based on line content
                            if (hack3d) {
                                if (ld.text.includes('BYPASSED')) { hack3d.event('bypass'); hack3d.shake(0.3); }
                                else if (ld.text.includes('BUFFER OVERFLOW')) { hack3d.event('overflow'); hack3d.shake(0.5); }
                                else if (ld.text.startsWith('> Downloading:')) hack3d.event('file');
                                else if (ld.text.includes('DEPLOYING COUNTERMEASURES')) hack3d.event('scatter');
                            }
                            const style = ld.text.includes('[OK]') || ld.text.includes('BYPASSED') || ld.text.includes('ACHIEVED') || ld.text.includes('COMPLETE') || ld.text.includes('NEUTRALIZED') || ld.text.includes('ELIMINATED') || ld.text === '  root'
                                ? `color:${phase.color};text-shadow:0 0 10px ${phase.color};font-weight:bold` : '';
                            const line = document.createElement('div');
                            line.style.whiteSpace = 'nowrap';
                            line.style.textShadow = '0 0 4px rgba(0,255,65,0.3)';
                            if (style) line.style.cssText += ';' + style;
                            terminal.appendChild(line);
                            terminal.scrollTop = terminal.scrollHeight;
                            await new Promise(r2 => {
                                let ci = 0;
                                (function tick() {
                                    if (ci < ld.text.length) { line.textContent += ld.text[ci++]; typeTick(); terminal.scrollTop = terminal.scrollHeight; setTimeout(tick, ld.speed); }
                                    else r2();
                                })();
                            });
                        }
                    } catch (e) { console.error('Phase line error:', e); }
                    resolve();
                }, ld.t);
            }));
        }

        if (phase.bar) {
            setTimeout(() => {
                const start = Date.now(), dur = phase.bar.end - phase.bar.start;
                (function tick() { const p = Math.min(100, ((Date.now() - start) / dur) * 100); barFill.style.width = p + '%'; if (p < 100) requestAnimationFrame(tick); })();
            }, phase.bar.start);
        }

        await Promise.all([...waits, new Promise(r => setTimeout(r, phase.duration))]);
        shaking = false;
    }

    async function runSequence() {
        try {
            // fade in
            overlay.style.opacity = '1';
            await new Promise(r => setTimeout(r, 800));

            for (let i = 0; i < PHASES.length; i++) {
                while (terminal.children.length > 5) terminal.removeChild(terminal.firstChild);
                await runPhase(PHASES[i], i);
                await new Promise(r => setTimeout(r, 500));
            }

            // stats screen
            await new Promise(r => setTimeout(r, 1500));
            terminal.innerHTML = '';
            const stats = [
                '+===========================================+',
                '|         OPERATION SUMMARY                 |',
                '+===========================================+',
                '|  Target:    MAINFRAME-CORE                |',
                '|  Exploit:   CVE-2024-21733                |',
                '|  Data:      8.347 GB exfiltrated          |',
                '|  Duration:  00:00:31                      |',
                '|  Traces:    ZERO                          |',
                '|  Status:    MISSION ACCOMPLISHED          |',
                '+===========================================+',
            ];
            for (const s of stats) {
                const l = document.createElement('div');
                l.style.whiteSpace = 'nowrap';
                l.style.color = s.includes('MISSION') ? '#ffb000' : s.includes('ZERO') ? '#00ff41' : '#00e5ff';
                l.style.textShadow = '0 0 4px currentColor';
                l.textContent = s;
                terminal.appendChild(l);
                await new Promise(r => setTimeout(r, 120));
            }

            barContainer.style.display = 'none';
            phaseName.textContent = '';
            await new Promise(r => setTimeout(r, 3000));

            // fade out
            overlay.style.opacity = '0';
            await new Promise(r => setTimeout(r, 800));
        } catch (e) {
            console.error('Sequence error:', e);
        } finally {
            running = false;
            if (hack3d) try { hack3d.dispose(); } catch (e) {}
            overlay.remove();
            window.removeEventListener('resize', onResize);
            if (audioCtx) try { audioCtx.close(); } catch (e) {}
            if (onComplete) onComplete();
        }
    }

    drawBg();
    runSequence();
}
