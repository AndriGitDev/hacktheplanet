// World map using lat/lng continental outlines (simplified but recognizable)
const continents = [
    // North America
    { points: [[-10,70],[-20,60],[-30,55],[-50,50],[-65,48],[-80,50],[-100,40],[-120,35],[-125,40],[-125,50],[-130,55],[-140,60],[-165,62],[-168,65],[-165,70],[-140,70],[-120,72],[-100,75],[-80,75],[-60,73],[-30,72],[-10,70]] },
    // Central America / Mexico
    { points: [[-100,40],[-100,32],[-105,25],[-100,20],[-95,18],[-90,15],[-85,12],[-80,10],[-78,8],[-80,15],[-85,20],[-90,22],[-95,25],[-95,30],[-100,35],[-100,40]] },
    // South America
    { points: [[-78,8],[-75,5],[-70,5],[-60,0],[-50,-2],[-45,-5],[-40,-10],[-38,-15],[-40,-22],[-45,-25],[-48,-28],[-52,-32],[-55,-35],[-60,-40],[-65,-45],[-68,-52],[-72,-50],[-75,-45],[-75,-40],[-72,-35],[-70,-25],[-70,-18],[-68,-10],[-72,-5],[-75,0],[-78,5],[-78,8]] },
    // Europe
    { points: [[0,45],[0,50],[-5,55],[-10,58],[0,62],[5,60],[10,62],[15,65],[20,68],[25,70],[30,68],[32,65],[30,60],[35,58],[28,55],[30,50],[25,45],[22,42],[18,40],[10,38],[5,40],[0,42],[0,45]] },
    // Africa
    { points: [[-15,30],[-17,20],[-15,12],[-10,5],[0,5],[10,2],[12,0],[15,-2],[20,-5],[30,-10],[35,-15],[38,-20],[35,-25],[32,-30],[28,-33],[22,-34],[18,-32],[15,-28],[12,-20],[10,-10],[5,0],[0,5],[-5,10],[-10,15],[-15,20],[-15,30]] },
    // Asia (main mass)
    { points: [[30,68],[35,65],[40,60],[45,55],[50,50],[55,45],[60,40],[65,35],[70,30],[75,25],[80,22],[85,20],[90,22],[95,20],[100,22],[105,20],[110,22],[115,25],[120,30],[125,35],[130,40],[132,42],[135,38],[140,42],[145,45],[150,55],[155,60],[160,62],[170,65],[175,68],[180,68],[180,70],[170,72],[160,70],[150,68],[140,65],[130,60],[120,55],[110,50],[100,50],[90,55],[80,55],[70,60],[60,62],[50,60],[40,62],[35,65],[30,68]] },
    // India subcontinent
    { points: [[68,28],[70,25],[72,22],[75,18],[78,10],[80,12],[82,15],[85,20],[88,22],[90,22],[88,25],[85,27],[80,30],[75,30],[70,30],[68,28]] },
    // Southeast Asia / Indonesia
    { points: [[95,20],[98,15],[100,8],[103,2],[105,0],[108,-2],[110,0],[112,-2],[115,-5],[118,-8],[120,-6],[118,-2],[115,2],[112,5],[108,8],[105,12],[102,15],[98,18],[95,20]] },
    // Australia
    { points: [[115,-14],[120,-15],[125,-15],[130,-13],[135,-13],[140,-16],[145,-18],[148,-20],[150,-23],[152,-28],[150,-32],[148,-35],[145,-38],[140,-38],[135,-35],[130,-33],[125,-34],[120,-33],[118,-30],[115,-28],[114,-25],[113,-22],[115,-18],[115,-14]] },
    // UK / Ireland
    { points: [[-8,52],[-5,50],[0,51],[2,53],[0,56],[-3,58],[-5,57],[-7,55],[-8,52]] },
    // Japan
    { points: [[130,32],[132,33],[134,34],[136,36],[138,38],[140,40],[142,43],[140,44],[138,42],[136,38],[134,35],[132,33],[130,32]] },
];

export function initWorldMap(canvas) {
    const ctx = canvas.getContext('2d');
    let w = 0, h = 0;
    const connections = [];
    const cityDots = []; // persistent pulsing dots
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

    function latLngToXY(lat, lng) {
        const x = ((lng + 180) / 360) * w;
        const y = ((90 - lat) / 180) * h;
        return [x, y];
    }

    function drawMap() {
        frame++;
        ctx.clearRect(0, 0, w, h);

        // grid with subtle animation
        ctx.lineWidth = 0.5;
        for (let i = 0; i <= 18; i++) {
            const x = (i / 18) * w;
            const alpha = 0.04 + Math.sin(frame * 0.01 + i * 0.5) * 0.01;
            ctx.strokeStyle = `rgba(0, 255, 65, ${alpha})`;
            ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
        }
        for (let i = 0; i <= 9; i++) {
            const y = (i / 9) * h;
            const alpha = 0.04 + Math.sin(frame * 0.01 + i * 0.5) * 0.01;
            ctx.strokeStyle = `rgba(0, 255, 65, ${alpha})`;
            ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
        }

        // draw continents with glow
        for (const cont of continents) {
            // outer glow
            ctx.strokeStyle = 'rgba(0, 255, 65, 0.08)';
            ctx.lineWidth = 3;
            ctx.beginPath();
            for (let i = 0; i < cont.points.length; i++) {
                const [x, y] = latLngToXY(cont.points[i][1], cont.points[i][0]);
                if (i === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            }
            ctx.closePath();
            ctx.stroke();

            // fill
            ctx.fillStyle = 'rgba(0, 255, 65, 0.04)';
            ctx.fill();

            // sharp edge
            ctx.strokeStyle = 'rgba(0, 255, 65, 0.3)';
            ctx.lineWidth = 1;
            ctx.beginPath();
            for (let i = 0; i < cont.points.length; i++) {
                const [x, y] = latLngToXY(cont.points[i][1], cont.points[i][0]);
                if (i === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            }
            ctx.closePath();
            ctx.stroke();
        }

        // draw persistent city dots with pulse
        for (let i = cityDots.length - 1; i >= 0; i--) {
            const cd = cityDots[i];
            cd.age++;
            if (cd.age > 600) { cityDots.splice(i, 1); continue; }
            const alpha = cd.age > 500 ? (600 - cd.age) / 100 : 1;
            const pulseR = 3 + Math.sin(frame * 0.05 + cd.phase) * 1.5;

            ctx.fillStyle = `rgba(0, 229, 255, ${0.6 * alpha})`;
            ctx.shadowColor = '#00e5ff';
            ctx.shadowBlur = 8;
            ctx.beginPath();
            ctx.arc(cd.x, cd.y, pulseR, 0, Math.PI * 2);
            ctx.fill();

            // ripple ring
            const ringR = pulseR + 4 + Math.sin(frame * 0.03 + cd.phase) * 3;
            ctx.strokeStyle = `rgba(0, 229, 255, ${0.2 * alpha})`;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.arc(cd.x, cd.y, ringR, 0, Math.PI * 2);
            ctx.stroke();

            ctx.shadowBlur = 0;
        }

        // draw connections
        for (let i = connections.length - 1; i >= 0; i--) {
            const c = connections[i];
            c.progress += 0.012;

            if (c.progress > 1.8) {
                connections.splice(i, 1);
                continue;
            }

            const [x1, y1] = c.src;
            const [x2, y2] = c.dst;
            const dist = Math.hypot(x2 - x1, y2 - y1);
            const midX = (x1 + x2) / 2;
            const midY = (y1 + y2) / 2 - dist * 0.15;
            const alpha = c.progress > 1 ? Math.max(0, 1 - (c.progress - 1) * 1.25) : Math.min(1, c.progress * 3);

            // arc glow
            ctx.strokeStyle = `rgba(0, 229, 255, ${alpha * 0.15})`;
            ctx.lineWidth = 4;
            ctx.shadowColor = '#00e5ff';
            ctx.shadowBlur = 10;
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.quadraticCurveTo(midX, midY, x2, y2);
            ctx.stroke();

            // arc line
            ctx.strokeStyle = `rgba(0, 229, 255, ${alpha * 0.8})`;
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.quadraticCurveTo(midX, midY, x2, y2);
            ctx.stroke();
            ctx.shadowBlur = 0;

            // traveling dot with trail
            if (c.progress <= 1) {
                const t = c.progress;
                for (let tr = 0; tr < 5; tr++) {
                    const tt = Math.max(0, t - tr * 0.03);
                    const dotX = (1-tt)*(1-tt)*x1 + 2*(1-tt)*tt*midX + tt*tt*x2;
                    const dotY = (1-tt)*(1-tt)*y1 + 2*(1-tt)*tt*midY + tt*tt*y2;
                    const trAlpha = (1 - tr / 5);
                    ctx.fillStyle = tr === 0 ? '#ffffff' : `rgba(0, 229, 255, ${trAlpha * 0.6})`;
                    if (tr === 0) {
                        ctx.shadowColor = '#00e5ff';
                        ctx.shadowBlur = 15;
                    }
                    ctx.beginPath();
                    ctx.arc(dotX, dotY, tr === 0 ? 3 : 2, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.shadowBlur = 0;
                }
            }

            // labels
            if (alpha > 0.3) {
                ctx.fillStyle = `rgba(0, 229, 255, ${alpha * 0.5})`;
                ctx.font = '8px monospace';
                ctx.fillText(c.srcName, x1 + 6, y1 - 6);
                ctx.fillText(c.dstName, x2 + 6, y2 - 6);
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
        // add city dots if not already present nearby
        for (const pt of [{ xy: src }, { xy: dst }]) {
            const nearby = cityDots.some(d => Math.hypot(d.x - pt.xy[0], d.y - pt.xy[1]) < 10);
            if (!nearby) {
                cityDots.push({ x: pt.xy[0], y: pt.xy[1], age: 0, phase: Math.random() * Math.PI * 2 });
            }
        }
        if (connections.length > 20) connections.shift();
    };
}
