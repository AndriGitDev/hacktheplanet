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

// edges between nodes (index pairs)
const EDGES = [
    [0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[6,7],[7,8],[8,9],[9,0],
    [0,5],[1,6],[2,7],[3,8],[4,9]
];

export function initNetwork(canvas) {
    const ctx = canvas.getContext('2d');
    let w = 0, h = 0;
    const nodes = [];
    const pulses = {}; // nodeId -> { intensity, decay timer }
    const packets = []; // traveling data packets

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
        const r = Math.min(w, h) * 0.35;
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

    // periodically spawn data packets along edges
    setInterval(() => {
        if (nodes.length === 0) return;
        const edge = EDGES[Math.random() * EDGES.length | 0];
        const reverse = Math.random() > 0.5;
        packets.push({
            from: reverse ? edge[1] : edge[0],
            to: reverse ? edge[0] : edge[1],
            progress: 0,
            speed: 0.01 + Math.random() * 0.02,
        });
        if (packets.length > 20) packets.shift();
    }, 500);

    function draw() {
        ctx.clearRect(0, 0, w, h);
        if (nodes.length === 0) { requestAnimationFrame(draw); return; }

        // draw edges
        for (const [a, b] of EDGES) {
            ctx.strokeStyle = 'rgba(0, 255, 65, 0.15)';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(nodes[a].x, nodes[a].y);
            ctx.lineTo(nodes[b].x, nodes[b].y);
            ctx.stroke();
        }

        // draw packets
        for (let i = packets.length - 1; i >= 0; i--) {
            const p = packets[i];
            p.progress += p.speed;
            if (p.progress >= 1) {
                packets.splice(i, 1);
                continue;
            }
            const n1 = nodes[p.from];
            const n2 = nodes[p.to];
            const x = n1.x + (n2.x - n1.x) * p.progress;
            const y = n1.y + (n2.y - n1.y) * p.progress;
            ctx.fillStyle = '#00e5ff';
            ctx.shadowColor = '#00e5ff';
            ctx.shadowBlur = 8;
            ctx.beginPath();
            ctx.arc(x, y, 2, 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur = 0;
        }

        // draw nodes
        for (const node of nodes) {
            const pulse = pulses[node.id];
            let radius = 6;
            let glow = 0;
            let color = 'rgba(0, 255, 65, 0.6)';

            if (pulse && pulse.intensity > 0) {
                radius = 6 + pulse.intensity * 8;
                glow = pulse.intensity * 15;
                color = `rgba(255, 176, 0, ${0.6 + pulse.intensity * 0.4})`;
                pulse.intensity *= 0.96;
                if (pulse.intensity < 0.01) pulse.intensity = 0;
            }

            // glow
            if (glow > 0) {
                ctx.shadowColor = '#ffb000';
                ctx.shadowBlur = glow;
            }

            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.arc(node.x, node.y, radius, 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur = 0;

            // outer ring
            ctx.strokeStyle = 'rgba(0, 255, 65, 0.3)';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.arc(node.x, node.y, radius + 3, 0, Math.PI * 2);
            ctx.stroke();

            // label
            ctx.fillStyle = 'rgba(0, 255, 65, 0.5)';
            ctx.font = '7px monospace';
            ctx.textAlign = 'center';
            ctx.fillText(node.name, node.x, node.y + radius + 14);
        }

        requestAnimationFrame(draw);
    }

    draw();

    return function onNodePulse(data) {
        pulses[data.id] = { intensity: 1.0 };
    };
}
