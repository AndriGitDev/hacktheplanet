// Simplified world map continent outlines (Mercator-ish projection)
// Coordinates are normalized 0-1 for both x and y
const continents = [
    // North America
    [
        [0.05,0.15],[0.08,0.12],[0.12,0.10],[0.15,0.10],[0.18,0.12],
        [0.20,0.15],[0.22,0.18],[0.22,0.22],[0.20,0.28],[0.18,0.32],
        [0.15,0.35],[0.12,0.38],[0.10,0.38],[0.08,0.35],[0.06,0.32],
        [0.05,0.28],[0.04,0.22],[0.05,0.15]
    ],
    // South America
    [
        [0.18,0.48],[0.20,0.45],[0.23,0.45],[0.25,0.48],[0.27,0.52],
        [0.28,0.58],[0.27,0.65],[0.25,0.72],[0.22,0.78],[0.20,0.78],
        [0.18,0.72],[0.17,0.65],[0.17,0.58],[0.18,0.48]
    ],
    // Europe
    [
        [0.42,0.12],[0.45,0.10],[0.48,0.10],[0.52,0.12],[0.54,0.15],
        [0.53,0.18],[0.50,0.22],[0.48,0.25],[0.45,0.25],[0.43,0.22],
        [0.42,0.18],[0.42,0.12]
    ],
    // Africa
    [
        [0.42,0.28],[0.45,0.26],[0.50,0.26],[0.54,0.28],[0.56,0.32],
        [0.57,0.38],[0.56,0.48],[0.54,0.55],[0.50,0.62],[0.47,0.65],
        [0.44,0.62],[0.42,0.55],[0.41,0.48],[0.41,0.38],[0.42,0.28]
    ],
    // Asia
    [
        [0.55,0.08],[0.60,0.06],[0.65,0.08],[0.70,0.10],[0.75,0.12],
        [0.80,0.15],[0.82,0.18],[0.82,0.25],[0.80,0.30],[0.75,0.35],
        [0.70,0.38],[0.65,0.38],[0.60,0.35],[0.56,0.30],[0.55,0.25],
        [0.54,0.18],[0.55,0.08]
    ],
    // Australia
    [
        [0.78,0.55],[0.82,0.52],[0.86,0.52],[0.90,0.55],[0.92,0.58],
        [0.90,0.65],[0.86,0.68],[0.82,0.68],[0.78,0.65],[0.77,0.58],
        [0.78,0.55]
    ]
];

export function initWorldMap(canvas) {
    const ctx = canvas.getContext('2d');
    let w = 0, h = 0;
    const connections = [];

    function resize() {
        const rect = canvas.parentElement.getBoundingClientRect();
        // account for panel header
        const header = canvas.parentElement.querySelector('.panel-header');
        const headerH = header ? header.offsetHeight : 0;
        w = rect.width;
        h = rect.height - headerH;
        canvas.width = w;
        canvas.height = h;
        canvas.style.marginTop = headerH + 'px';
    }

    resize();
    new ResizeObserver(resize).observe(canvas.parentElement);

    function latLngToXY(lat, lng) {
        const x = ((lng + 180) / 360) * w;
        const y = ((90 - lat) / 180) * h;
        return [x, y];
    }

    function drawMap() {
        ctx.clearRect(0, 0, w, h);

        // draw grid
        ctx.strokeStyle = 'rgba(0, 255, 65, 0.06)';
        ctx.lineWidth = 0.5;
        for (let i = 0; i <= 12; i++) {
            const x = (i / 12) * w;
            ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
        }
        for (let i = 0; i <= 6; i++) {
            const y = (i / 6) * h;
            ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
        }

        // draw continents
        ctx.strokeStyle = 'rgba(0, 255, 65, 0.25)';
        ctx.fillStyle = 'rgba(0, 255, 65, 0.05)';
        ctx.lineWidth = 1;
        for (const cont of continents) {
            ctx.beginPath();
            for (let i = 0; i < cont.length; i++) {
                const x = cont[i][0] * w;
                const y = cont[i][1] * h;
                if (i === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            }
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
        }

        // draw connections
        for (let i = connections.length - 1; i >= 0; i--) {
            const c = connections[i];
            c.progress += 0.015;

            if (c.progress > 1.5) {
                connections.splice(i, 1);
                continue;
            }

            const [x1, y1] = c.src;
            const [x2, y2] = c.dst;

            // draw arc
            const midX = (x1 + x2) / 2;
            const midY = (y1 + y2) / 2 - Math.abs(x2 - x1) * 0.2;
            const alpha = c.progress > 1 ? Math.max(0, 1 - (c.progress - 1) * 2) : 0.8;

            ctx.strokeStyle = `rgba(0, 229, 255, ${alpha})`;
            ctx.lineWidth = 1.5;
            ctx.shadowColor = '#00e5ff';
            ctx.shadowBlur = 6;
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.quadraticCurveTo(midX, midY, x2, y2);
            ctx.stroke();
            ctx.shadowBlur = 0;

            // traveling dot
            if (c.progress <= 1) {
                const t = c.progress;
                const dotX = (1-t)*(1-t)*x1 + 2*(1-t)*t*midX + t*t*x2;
                const dotY = (1-t)*(1-t)*y1 + 2*(1-t)*t*midY + t*t*y2;
                ctx.fillStyle = '#ffffff';
                ctx.shadowColor = '#00e5ff';
                ctx.shadowBlur = 10;
                ctx.beginPath();
                ctx.arc(dotX, dotY, 3, 0, Math.PI * 2);
                ctx.fill();
                ctx.shadowBlur = 0;
            }

            // endpoint dots
            ctx.fillStyle = `rgba(0, 255, 65, ${alpha})`;
            ctx.beginPath(); ctx.arc(x1, y1, 3, 0, Math.PI * 2); ctx.fill();
            ctx.beginPath(); ctx.arc(x2, y2, 3, 0, Math.PI * 2); ctx.fill();

            // labels
            if (alpha > 0.3) {
                ctx.fillStyle = `rgba(0, 229, 255, ${alpha * 0.7})`;
                ctx.font = '8px monospace';
                ctx.fillText(c.srcName, x1 + 5, y1 - 5);
                ctx.fillText(c.dstName, x2 + 5, y2 - 5);
            }
        }

        requestAnimationFrame(drawMap);
    }

    drawMap();

    return function onMapConnection(data) {
        const src = latLngToXY(data.srcLat, data.srcLng);
        const dst = latLngToXY(data.dstLat, data.dstLng);
        connections.push({
            src, dst,
            srcName: data.srcName,
            dstName: data.dstName,
            progress: 0
        });
        // cap active connections
        if (connections.length > 15) {
            connections.shift();
        }
    };
}
