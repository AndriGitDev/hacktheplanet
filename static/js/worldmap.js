// Simple continent outlines using [longitude, latitude]
// Each continent is a single non-self-intersecting polygon
// Traced clockwise around the outer boundary only

const continents = [
    // North America (simplified outer boundary)
    [[-57,50],[-65,44],[-74,40],[-80,32],[-82,25],[-88,30],[-97,26],
     [-105,20],[-117,32],[-122,37],[-124,48],[-130,55],[-148,60],
     [-168,66],[-168,72],[-140,72],[-100,74],[-80,74],[-65,60],[-57,50]],

    // South America
    [[-80,8],[-70,12],[-60,5],[-50,0],[-35,-5],[-38,-15],[-42,-23],
     [-52,-33],[-58,-38],[-66,-46],[-68,-55],[-75,-48],[-72,-35],
     [-70,-18],[-75,-5],[-80,0],[-80,8]],

    // Europe (simplified)
    [[-9,36],[-9,43],[-3,48],[-6,54],[-3,58],[5,62],[15,69],[25,71],
     [30,70],[28,60],[24,55],[20,50],[26,44],[28,38],[24,36],[18,40],
     [12,44],[6,44],[3,43],[-2,44],[-9,36]],

    // Africa
    [[-17,14],[-12,24],[-5,36],[10,37],[20,33],[32,31],[36,20],
     [42,12],[50,12],[44,2],[40,-8],[35,-18],[28,-33],[18,-34],
     [12,-18],[9,-3],[10,4],[2,6],[-5,5],[-15,11],[-17,14]],

    // Asia (outer boundary, simplified)
    [
     [28,42],[36,38],[42,42],[52,38],[62,32],[72,24],[78,16],[80,8],
     [88,22],[95,18],[100,14],[104,2],[108,2],[115,12],[120,26],
     [128,36],[135,38],[140,42],[145,44],[148,56],[155,62],[170,65],
     [180,68],[180,72],[160,68],[140,66],[130,62],[115,52],[100,48],
     [80,48],[68,42],[55,42],[48,40],[40,42],[28,42]],

    // Australia
    [[114,-14],[124,-14],[132,-12],[138,-14],[144,-14],[148,-20],
     [153,-27],[152,-33],[148,-38],[140,-38],[132,-34],[124,-34],
     [118,-30],[114,-22],[114,-14]],

    // India (sub-polygon)
    [[68,30],[72,24],[76,14],[78,8],[82,14],[88,22],[86,26],[80,30],[68,30]],

    // Japan
    [[130,31],[134,34],[137,38],[141,43],[140,44],[136,37],[130,31]],

    // UK
    [[-5,50],[1,51],[1,53],[-2,57],[-5,58],[-6,55],[-5,50]],

    // Indonesia (very simplified)
    [[96,5],[104,2],[106,-6],[114,-8],[120,-8],[120,-4],[112,2],[104,4],[96,5]],
];

export function initWorldMap(canvas) {
    const ctx = canvas.getContext('2d');
    let w = 0, h = 0;
    const connections = [];
    const cityDots = [];
    let frame = 0;

    function resize() {
        const rect = canvas.parentElement.getBoundingClientRect();
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

    function toXY(lng, lat) {
        return [((lng + 180) / 360) * w, ((90 - lat) / 180) * h];
    }

    function tracePath(pts) {
        ctx.beginPath();
        for (let i = 0; i < pts.length; i++) {
            const [x, y] = toXY(pts[i][0], pts[i][1]);
            if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
        }
        ctx.closePath();
    }

    function drawMap() {
        frame++;
        ctx.clearRect(0, 0, w, h);

        // grid
        ctx.strokeStyle = 'rgba(0,255,65,0.04)';
        ctx.lineWidth = 0.5;
        for (let i = 0; i <= 18; i++) {
            const x = (i / 18) * w;
            ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
        }
        for (let i = 0; i <= 9; i++) {
            const y = (i / 9) * h;
            ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
        }

        // equator
        ctx.setLineDash([4, 8]);
        ctx.strokeStyle = 'rgba(0,255,65,0.06)';
        ctx.beginPath(); ctx.moveTo(0, h / 2); ctx.lineTo(w, h / 2); ctx.stroke();
        ctx.setLineDash([]);

        // continents: glow layer
        ctx.strokeStyle = 'rgba(0,255,65,0.06)';
        ctx.lineWidth = 4;
        for (const pts of continents) { tracePath(pts); ctx.stroke(); }

        // continents: fill
        ctx.fillStyle = 'rgba(0,255,65,0.04)';
        for (const pts of continents) { tracePath(pts); ctx.fill(); }

        // continents: edge
        ctx.strokeStyle = 'rgba(0,255,65,0.3)';
        ctx.lineWidth = 1;
        for (const pts of continents) { tracePath(pts); ctx.stroke(); }

        // city dots
        for (let i = cityDots.length - 1; i >= 0; i--) {
            const cd = cityDots[i];
            cd.age++;
            if (cd.age > 600) { cityDots.splice(i, 1); continue; }
            const alpha = cd.age > 500 ? (600 - cd.age) / 100 : 1;
            const r = 2.5 + Math.sin(frame * 0.05 + cd.phase) * 1;

            ctx.fillStyle = `rgba(0,229,255,${0.7 * alpha})`;
            ctx.shadowColor = '#00e5ff';
            ctx.shadowBlur = 8;
            ctx.beginPath(); ctx.arc(cd.x, cd.y, r, 0, Math.PI * 2); ctx.fill();
            ctx.shadowBlur = 0;

            // ripple
            const rr = r + 4 + Math.sin(frame * 0.03 + cd.phase) * 2;
            ctx.strokeStyle = `rgba(0,229,255,${0.15 * alpha})`;
            ctx.lineWidth = 0.5;
            ctx.beginPath(); ctx.arc(cd.x, cd.y, rr, 0, Math.PI * 2); ctx.stroke();
        }

        // connections
        for (let i = connections.length - 1; i >= 0; i--) {
            const c = connections[i];
            c.progress += 0.012;
            if (c.progress > 1.8) { connections.splice(i, 1); continue; }

            const [x1, y1] = c.src;
            const [x2, y2] = c.dst;
            const dist = Math.hypot(x2 - x1, y2 - y1);
            const midX = (x1 + x2) / 2;
            const midY = (y1 + y2) / 2 - dist * 0.15;
            const alpha = c.progress > 1 ? Math.max(0, 1 - (c.progress - 1) * 1.25) : Math.min(1, c.progress * 3);

            // glow arc
            ctx.strokeStyle = `rgba(0,229,255,${alpha * 0.12})`;
            ctx.lineWidth = 4;
            ctx.shadowColor = '#00e5ff';
            ctx.shadowBlur = 8;
            ctx.beginPath(); ctx.moveTo(x1, y1); ctx.quadraticCurveTo(midX, midY, x2, y2); ctx.stroke();

            // sharp arc
            ctx.strokeStyle = `rgba(0,229,255,${alpha * 0.8})`;
            ctx.lineWidth = 1.5;
            ctx.beginPath(); ctx.moveTo(x1, y1); ctx.quadraticCurveTo(midX, midY, x2, y2); ctx.stroke();
            ctx.shadowBlur = 0;

            // traveling dot
            if (c.progress <= 1) {
                const t = c.progress;
                for (let tr = 0; tr < 5; tr++) {
                    const tt = Math.max(0, t - tr * 0.025);
                    const dx = (1 - tt) * (1 - tt) * x1 + 2 * (1 - tt) * tt * midX + tt * tt * x2;
                    const dy = (1 - tt) * (1 - tt) * y1 + 2 * (1 - tt) * tt * midY + tt * tt * y2;
                    ctx.fillStyle = tr === 0 ? '#ffffff' : `rgba(0,229,255,${(1 - tr / 5) * 0.5})`;
                    if (tr === 0) { ctx.shadowColor = '#00e5ff'; ctx.shadowBlur = 12; }
                    ctx.beginPath(); ctx.arc(dx, dy, tr === 0 ? 2.5 : 1.5, 0, Math.PI * 2); ctx.fill();
                    ctx.shadowBlur = 0;
                }
            }

            // labels
            if (alpha > 0.3) {
                ctx.fillStyle = `rgba(0,229,255,${alpha * 0.5})`;
                ctx.font = '8px monospace';
                ctx.fillText(c.srcName, x1 + 5, y1 - 5);
                ctx.fillText(c.dstName, x2 + 5, y2 - 5);
            }
        }

        requestAnimationFrame(drawMap);
    }

    drawMap();

    return function onMapConnection(data) {
        const src = toXY(data.srcLng, data.srcLat);
        const dst = toXY(data.dstLng, data.dstLat);
        connections.push({ src, dst, srcName: data.srcName, dstName: data.dstName, progress: 0 });
        for (const pt of [src, dst]) {
            if (!cityDots.some(d => Math.hypot(d.x - pt[0], d.y - pt[1]) < 10)) {
                cityDots.push({ x: pt[0], y: pt[1], age: 0, phase: Math.random() * Math.PI * 2 });
            }
        }
        if (connections.length > 20) connections.shift();
    };
}
