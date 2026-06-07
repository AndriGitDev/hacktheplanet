// Ambient viral spectacle layer for the dashboard.
// Harmless by design: this renders decorative particles and fictional telemetry only.

function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
}

export function initSpectacle(canvas, { firewallMeter, vibeMeter } = {}) {
    if (!canvas) return { pulse() {} };

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const ctx = canvas.getContext('2d');
    let width = 0;
    let height = 0;
    let dpr = 1;
    let frame = 0;
    let pulsePower = 0;
    const nodes = [];
    const sparks = [];

    function resize() {
        const rect = canvas.getBoundingClientRect();
        dpr = clamp(window.devicePixelRatio || 1, 1, 2);
        width = Math.max(1, rect.width);
        height = Math.max(1, rect.height);
        canvas.width = Math.floor(width * dpr);
        canvas.height = Math.floor(height * dpr);
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        seedNodes();
    }

    function seedNodes() {
        nodes.length = 0;
        const count = Math.max(34, Math.floor((width * height) / 24000));
        for (let i = 0; i < count; i++) {
            const band = i / Math.max(1, count - 1);
            nodes.push({
                x: width * (0.12 + Math.random() * 0.8),
                y: height * (0.08 + Math.random() * 0.84),
                r: 1 + Math.random() * 2.4,
                phase: Math.random() * Math.PI * 2,
                speed: 0.002 + Math.random() * 0.006,
                hue: band < 0.36 ? '0,255,65' : band < 0.72 ? '0,229,255' : '255,212,59',
            });
        }
    }

    function addSpark(x, y, hue = '255,212,59') {
        if (reduceMotion) return;
        for (let i = 0; i < 10; i++) {
            const a = Math.random() * Math.PI * 2;
            const v = 1.5 + Math.random() * 4.8;
            sparks.push({ x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, life: 1, hue, size: 1 + Math.random() * 3 });
        }
    }

    function pulse() {
        pulsePower = 1;
        document.body.classList.add('wow-pulse');
        setTimeout(() => document.body.classList.remove('wow-pulse'), 820);
        addSpark(width * 0.66, height * 0.42, '255,212,59');
        addSpark(width * 0.50, height * 0.56, '0,229,255');
        addSpark(width * 0.78, height * 0.62, '255,79,216');
    }

    function line(a, b, alpha, hue) {
        ctx.strokeStyle = `rgba(${hue},${alpha})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        const midX = (a.x + b.x) / 2 + Math.sin(frame * 0.012 + a.phase) * 18;
        const midY = (a.y + b.y) / 2 + Math.cos(frame * 0.01 + b.phase) * 12;
        ctx.quadraticCurveTo(midX, midY, b.x, b.y);
        ctx.stroke();
    }

    function drawGlobe(cx, cy, radius) {
        ctx.save();
        ctx.translate(cx, cy);
        const glow = ctx.createRadialGradient(0, 0, radius * 0.1, 0, 0, radius * 1.35);
        glow.addColorStop(0, `rgba(255,212,59,${0.12 + pulsePower * 0.18})`);
        glow.addColorStop(0.58, 'rgba(0,229,255,0.055)');
        glow.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(0, 0, radius * 1.45, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = `rgba(255,212,59,${0.22 + pulsePower * 0.35})`;
        ctx.lineWidth = 1.4;
        for (let i = 0; i < 5; i++) {
            const rr = radius * (0.32 + i * 0.15);
            ctx.beginPath();
            ctx.ellipse(0, 0, rr * (1.1 + Math.sin(frame * 0.01 + i) * 0.12), rr * 0.28, frame * 0.006 + i * 0.55, 0, Math.PI * 2);
            ctx.stroke();
        }
        ctx.strokeStyle = `rgba(0,255,65,${0.18 + pulsePower * 0.24})`;
        for (let i = -2; i <= 2; i++) {
            ctx.beginPath();
            ctx.arc(0, i * radius * 0.18, radius * (0.75 - Math.abs(i) * 0.08), 0, Math.PI * 2);
            ctx.stroke();
        }
        ctx.restore();
    }

    function draw() {
        frame++;
        ctx.clearRect(0, 0, width, height);
        const gradient = ctx.createRadialGradient(width * 0.68, height * 0.42, 20, width * 0.68, height * 0.42, Math.max(width, height) * 0.72);
        gradient.addColorStop(0, `rgba(255,212,59,${0.06 + pulsePower * 0.13})`);
        gradient.addColorStop(0.32, 'rgba(0,229,255,0.045)');
        gradient.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);

        const maxDistance = Math.min(width, height) * 0.24;
        for (let i = 0; i < nodes.length; i++) {
            const a = nodes[i];
            a.x += Math.sin(frame * a.speed + a.phase) * 0.18;
            a.y += Math.cos(frame * a.speed + a.phase) * 0.14;
            for (let j = i + 1; j < nodes.length; j++) {
                const b = nodes[j];
                const dx = a.x - b.x;
                const dy = a.y - b.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < maxDistance) line(a, b, (1 - dist / maxDistance) * (0.12 + pulsePower * 0.28), a.hue);
            }
        }

        for (const node of nodes) {
            const blink = 0.55 + Math.sin(frame * 0.045 + node.phase) * 0.38;
            ctx.fillStyle = `rgba(${node.hue},${0.38 + blink * 0.44})`;
            ctx.shadowColor = `rgb(${node.hue})`;
            ctx.shadowBlur = 10 + pulsePower * 18;
            ctx.beginPath();
            ctx.arc(node.x, node.y, node.r + pulsePower * 1.2, 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur = 0;
        }

        drawGlobe(width * 0.69, height * 0.43, Math.min(width, height) * 0.17);

        for (let i = sparks.length - 1; i >= 0; i--) {
            const s = sparks[i];
            s.x += s.vx;
            s.y += s.vy;
            s.vx *= 0.97;
            s.vy *= 0.97;
            s.life -= 0.025;
            if (s.life <= 0) {
                sparks.splice(i, 1);
                continue;
            }
            ctx.fillStyle = `rgba(${s.hue},${s.life})`;
            ctx.fillRect(s.x, s.y, s.size, s.size);
        }

        if (firewallMeter && frame % 8 === 0) firewallMeter.textContent = `${72 + Math.floor(Math.random() * 28)}%`;
        if (vibeMeter && frame % 12 === 0) vibeMeter.textContent = String(9001 + Math.floor(Math.random() * 337));
        pulsePower *= 0.92;
        requestAnimationFrame(draw);
    }

    resize();
    window.addEventListener('resize', resize);
    if (!reduceMotion) setInterval(() => addSpark(width * (0.45 + Math.random() * 0.42), height * (0.18 + Math.random() * 0.55), Math.random() > 0.5 ? '0,229,255' : '255,212,59'), 1400);
    draw();

    return { pulse };
}
