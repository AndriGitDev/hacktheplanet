const NODE_DEFS = [
    { id: 'node-0', name: 'NSA-RELAY-7' },
    { id: 'node-1', name: 'DARKNET-PROXY-3' },
    { id: 'node-2', name: 'TOR-EXIT-12' },
    { id: 'node-3', name: 'BOTNET-C2-ALPHA' },
    { id: 'node-4', name: 'SATCOM-UPLINK-9' },
    { id: 'node-5', name: 'MAINFRAME-CORE' },
    { id: 'node-6', name: 'GCHQ-NODE-4' },
    { id: 'node-7', name: 'PENTAGON-DMZ' },
    { id: 'node-8', name: 'ECHELON-TAP-2' },
    { id: 'node-9', name: 'SHADOW-NET-6' },
];

const EDGES = [
    [0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[6,7],[7,8],[8,9],[9,0],
    [0,5],[1,6],[2,7],[3,8],[4,9]
];

export function initNetwork(canvas) {
    const ctx = canvas.getContext('2d');
    let w = 0, h = 0;
    const nodes = [];
    const pulses = {};
    const packets = [];
    let frame = 0;
    let ringAngle = 0;

    function resize() {
        const rect = canvas.parentElement.getBoundingClientRect();
        const header = canvas.parentElement.querySelector('.panel-header');
        const headerH = header ? header.offsetHeight : 0;
        w = rect.width;
        h = rect.height - headerH;
        canvas.width = w;
        canvas.height = h;
        canvas.style.marginTop = headerH + 'px';
        layoutNodes();
    }

    function layoutNodes() {
        const cx = w / 2;
        const cy = h / 2;
        const r = Math.min(w, h) * 0.32;
        for (let i = 0; i < NODE_DEFS.length; i++) {
            const angle = (i / NODE_DEFS.length) * Math.PI * 2 - Math.PI / 2;
            nodes[i] = {
                ...NODE_DEFS[i],
                x: cx + Math.cos(angle) * r,
                y: cy + Math.sin(angle) * r,
            };
        }
    }

    resize();
    new ResizeObserver(resize).observe(canvas.parentElement);

    setInterval(() => {
        if (nodes.length === 0) return;
        const edge = EDGES[Math.random() * EDGES.length | 0];
        const reverse = Math.random() > 0.5;
        packets.push({
            from: reverse ? edge[1] : edge[0],
            to: reverse ? edge[0] : edge[1],
            progress: 0,
            speed: 0.008 + Math.random() * 0.015,
        });
        if (packets.length > 25) packets.shift();
    }, 400);

    function draw() {
        frame++;
        ringAngle += 0.003;
        ctx.clearRect(0, 0, w, h);
        if (nodes.length === 0) { requestAnimationFrame(draw); return; }

        const cx = w / 2;
        const cy = h / 2;

        // rotating concentric rings
        ctx.save();
        ctx.translate(cx, cy);
        for (let r = 1; r <= 3; r++) {
            const radius = Math.min(w, h) * (0.12 + r * 0.12);
            ctx.strokeStyle = `rgba(0, 255, 65, ${0.04 + r * 0.01})`;
            ctx.lineWidth = 0.5;
            ctx.setLineDash([4, 8]);
            ctx.beginPath();
            ctx.arc(0, 0, radius, ringAngle * (r % 2 === 0 ? 1 : -1), ringAngle * (r % 2 === 0 ? 1 : -1) + Math.PI * 1.8);
            ctx.stroke();
            ctx.setLineDash([]);

            // tick marks
            for (let t = 0; t < 12; t++) {
                const a = ringAngle * (r % 2 === 0 ? 1 : -1) + (t / 12) * Math.PI * 2;
                ctx.strokeStyle = `rgba(0, 255, 65, 0.08)`;
                ctx.beginPath();
                ctx.moveTo(Math.cos(a) * (radius - 3), Math.sin(a) * (radius - 3));
                ctx.lineTo(Math.cos(a) * (radius + 3), Math.sin(a) * (radius + 3));
                ctx.stroke();
            }
        }
        ctx.restore();

        // draw edges with gradient
        for (const [a, b] of EDGES) {
            const n1 = nodes[a], n2 = nodes[b];
            const isInner = Math.abs(a - b) > 1 && !(a === 0 && b === 9) && !(a === 9 && b === 0);
            const alpha = isInner ? 0.08 : 0.12;

            ctx.strokeStyle = `rgba(0, 255, 65, ${alpha})`;
            ctx.lineWidth = isInner ? 0.5 : 1;
            ctx.beginPath();
            ctx.moveTo(n1.x, n1.y);
            ctx.lineTo(n2.x, n2.y);
            ctx.stroke();
        }

        // draw packets with trails
        for (let i = packets.length - 1; i >= 0; i--) {
            const p = packets[i];
            p.progress += p.speed;
            if (p.progress >= 1) {
                packets.splice(i, 1);
                continue;
            }
            const n1 = nodes[p.from];
            const n2 = nodes[p.to];

            // trail
            for (let t = 0; t < 4; t++) {
                const tt = Math.max(0, p.progress - t * 0.03);
                const x = n1.x + (n2.x - n1.x) * tt;
                const y = n1.y + (n2.y - n1.y) * tt;
                const alpha = (1 - t / 4) * 0.8;
                ctx.fillStyle = t === 0 ? '#00e5ff' : `rgba(0, 229, 255, ${alpha})`;
                if (t === 0) {
                    ctx.shadowColor = '#00e5ff';
                    ctx.shadowBlur = 10;
                }
                ctx.beginPath();
                ctx.arc(x, y, t === 0 ? 2.5 : 1.5, 0, Math.PI * 2);
                ctx.fill();
                ctx.shadowBlur = 0;
            }

            // highlight edge as packet travels
            ctx.strokeStyle = 'rgba(0, 229, 255, 0.08)';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(n1.x, n1.y);
            ctx.lineTo(n2.x, n2.y);
            ctx.stroke();
        }

        // draw nodes
        for (const node of nodes) {
            const pulse = pulses[node.id];
            let radius = 5;
            let glow = 0;
            let color = 'rgba(0, 255, 65, 0.7)';

            if (pulse && pulse.intensity > 0) {
                radius = 5 + pulse.intensity * 10;
                glow = pulse.intensity * 20;
                color = `rgba(255, 176, 0, ${0.7 + pulse.intensity * 0.3})`;
                pulse.intensity *= 0.97;
                if (pulse.intensity < 0.01) pulse.intensity = 0;
            }

            // outer ring with rotation
            const nodeAngle = frame * 0.02;
            ctx.strokeStyle = `rgba(0, 255, 65, 0.2)`;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.arc(node.x, node.y, radius + 6, nodeAngle, nodeAngle + Math.PI * 1.5);
            ctx.stroke();

            // second ring
            ctx.beginPath();
            ctx.arc(node.x, node.y, radius + 10, -nodeAngle, -nodeAngle + Math.PI);
            ctx.stroke();

            // glow
            if (glow > 0) {
                ctx.shadowColor = '#ffb000';
                ctx.shadowBlur = glow;
                // pulse ring
                const pulseRing = radius + 15 * pulse.intensity;
                ctx.strokeStyle = `rgba(255, 176, 0, ${pulse.intensity * 0.3})`;
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.arc(node.x, node.y, pulseRing, 0, Math.PI * 2);
                ctx.stroke();
            }

            // core
            ctx.fillStyle = color;
            ctx.shadowColor = glow > 0 ? '#ffb000' : '#00ff41';
            ctx.shadowBlur = glow > 0 ? glow : 6;
            ctx.beginPath();
            ctx.arc(node.x, node.y, radius, 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur = 0;

            // label
            ctx.fillStyle = 'rgba(0, 255, 65, 0.4)';
            ctx.font = '7px monospace';
            ctx.textAlign = 'center';
            ctx.fillText(node.name, node.x, node.y + radius + 16);
        }

        // center hub indicator
        ctx.fillStyle = `rgba(0, 255, 65, ${0.1 + Math.sin(frame * 0.03) * 0.05})`;
        ctx.beginPath();
        ctx.arc(cx, cy, 4, 0, Math.PI * 2);
        ctx.fill();

        requestAnimationFrame(draw);
    }

    draw();

    return function onNodePulse(data) {
        pulses[data.id] = { intensity: 1.0 };
    };
}
