// World map with proper continent outlines using real lat/lng coordinates
// Format: [longitude, latitude] — rendered via equirectangular projection
// Simplified coastlines but recognizable shapes

const continents = [
    // North America
    { points: [
        [-55,50],[-60,46],[-67,45],[-70,43],[-74,40],[-76,36],[-80,32],[-82,29],[-82,25],
        [-84,30],[-88,30],[-90,29],[-94,29],[-97,26],[-97,22],[-105,20],[-100,18],[-96,16],
        [-88,15],[-84,11],[-82,9],[-78,8],
        [-82,9],[-84,11],[-88,15],[-92,16],[-96,16],[-100,18],[-105,20],
        [-110,24],[-115,28],[-117,32],[-120,34],[-122,37],[-122,40],[-124,44],[-124,48],
        [-128,52],[-133,56],[-140,59],[-148,61],[-155,59],[-162,63],[-166,65],[-170,66],
        [-168,70],[-162,71],[-155,72],[-145,71],[-137,70],[-130,70],[-120,72],[-110,74],
        [-100,74],[-90,74],[-82,73],[-78,72],[-73,68],[-65,62],[-58,54],[-55,50]
    ]},
    // South America
    { points: [
        [-78,8],[-72,12],[-68,11],[-63,10],[-60,7],[-55,5],[-52,3],[-50,0],
        [-48,-2],[-44,-3],[-40,-5],[-38,-8],[-35,-10],[-36,-14],[-38,-16],[-39,-18],
        [-40,-22],[-42,-23],[-44,-23],[-47,-25],[-48,-27],[-50,-30],[-52,-33],
        [-55,-35],[-57,-38],[-65,-42],[-65,-46],[-68,-50],[-68,-54],
        [-72,-52],[-74,-48],[-74,-44],[-72,-40],[-71,-36],[-70,-30],
        [-70,-24],[-70,-18],[-72,-15],[-75,-12],[-76,-8],[-78,-3],[-80,0],
        [-78,3],[-77,6],[-78,8]
    ]},
    // Europe
    { points: [
        [-9,36],[-8,40],[-9,43],[-2,44],[0,44],[3,43],[5,44],[3,47],
        [-2,48],[-5,48],[-6,52],[-5,55],[-3,58],[-5,58],[-7,58],
        [0,58],[5,60],[5,62],[8,63],[12,66],[15,68],[18,70],[25,71],[30,70],
        [28,66],[30,62],[28,58],[24,56],[18,56],[14,54],[14,52],[18,50],
        [22,48],[26,44],[28,42],[28,38],[26,36],[24,36],[22,38],[18,40],
        [16,38],[14,42],[12,44],[10,44],[8,44],[6,44],[3,43],
        [10,42],[12,38],[16,38],[18,40],[22,38],[26,36],
        [18,36],[15,38],[12,38],[10,42],[8,40],[6,44],[3,43],
        [-2,44],[-9,43],[-8,40],[-9,36]
    ]},
    // Africa
    { points: [
        [-5,36],[-6,34],[-8,32],[-12,28],[-17,22],[-16,18],[-17,14],[-15,11],
        [-8,5],[-5,5],[0,5],[2,6],[5,4],[8,4],[10,4],[10,2],[9,0],
        [9,-3],[12,-6],[14,-8],[16,-12],[18,-16],[20,-18],[25,-22],
        [30,-26],[32,-28],[28,-33],[26,-34],[20,-34],[18,-32],
        [15,-26],[12,-18],[12,-12],[14,-8],[16,-6],[18,-4],
        [35,-12],[40,-10],[42,-2],[45,2],[44,8],[47,10],[50,12],
        [48,15],[43,13],[42,15],[38,18],[36,20],[34,22],[33,28],[32,31],
        [30,32],[25,32],[20,33],[15,34],[12,35],[10,36],[5,36],[0,36],[-5,36]
    ]},
    // Asia
    { points: [
        [28,42],[32,42],[36,38],[40,42],[44,42],[48,40],[50,38],[52,38],
        [55,36],[58,34],[62,32],[65,30],[68,28],[72,24],[75,20],[78,16],
        [80,13],[80,8],[78,6],[80,8],[82,12],[84,16],[86,18],[88,22],
        [90,22],[92,20],[95,18],[98,16],[100,14],[102,10],[104,2],
        [103,-1],[105,0],[108,2],[110,4],[112,8],[115,12],[118,16],
        [118,22],[120,26],[122,30],[125,34],[128,36],[130,38],
        [132,34],[134,36],[136,38],[140,42],[142,44],[145,44],
        [142,48],[140,52],[142,55],[138,58],[140,62],[148,65],
        [155,62],[160,60],[165,62],[170,64],[178,66],[180,68],
        [180,72],[175,72],[170,70],[160,68],[148,68],[140,66],
        [130,62],[120,58],[115,52],[110,48],[100,48],[90,50],
        [85,52],[80,48],[75,44],[70,44],[68,42],[65,40],
        [62,38],[60,40],[55,42],[50,42],[48,40],[44,42],
        [40,42],[36,38],[32,42],[28,42]
    ]},
    // India
    { points: [
        [68,30],[70,28],[72,24],[73,20],[75,16],[76,12],[78,8],
        [80,8],[80,12],[82,16],[84,18],[86,22],[88,22],
        [88,24],[86,26],[84,28],[80,30],[76,32],[72,32],[68,30]
    ]},
    // Australia
    { points: [
        [114,-14],[116,-14],[118,-16],[120,-16],[124,-14],[128,-14],[130,-12],
        [132,-12],[135,-14],[137,-14],[139,-16],[142,-14],[144,-14],
        [146,-18],[148,-20],[150,-22],[152,-25],[153,-28],[152,-32],
        [150,-35],[148,-38],[146,-39],[142,-39],[140,-38],
        [138,-35],[136,-34],[132,-34],[130,-32],[128,-30],
        [126,-32],[124,-34],[122,-34],[120,-32],[118,-30],
        [116,-28],[115,-24],[114,-22],[114,-20],[113,-18],[114,-14]
    ]},
    // Japan
    { points: [
        [130,31],[131,33],[132,34],[134,34],[135,36],[137,38],[139,40],[140,42],[141,43],
        [142,44],[140,44],[139,42],[137,40],[136,37],[134,35],[132,33],[130,31]
    ]},
    // UK
    { points: [
        [-5,50],[-4,51],[0,51],[1,53],[0,54],[-1,55],[-2,57],[-3,58],
        [-5,58],[-6,56],[-5,54],[-5,52],[-5,50]
    ]},
    // Indonesia
    { points: [
        [96,5],[98,4],[100,2],[102,0],[104,-2],[105,-5],[106,-6],
        [108,-7],[110,-7],[112,-7],[114,-8],[116,-8],[118,-8],
        [120,-8],[122,-6],[120,-4],[118,-2],[115,0],[112,2],
        [108,4],[104,4],[100,4],[96,5]
    ]},
    // New Zealand
    { points: [
        [172,-35],[174,-37],[176,-38],[178,-40],[178,-42],[176,-44],[174,-46],
        [172,-45],[170,-44],[168,-44],[168,-42],[170,-40],[172,-38],[172,-35]
    ]},
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

    function latLngToXY(lat, lng) {
        const x = ((lng + 180) / 360) * w;
        const y = ((90 - lat) / 180) * h;
        return [x, y];
    }

    function drawContinent(cont) {
        ctx.beginPath();
        for (let i = 0; i < cont.points.length; i++) {
            const [x, y] = latLngToXY(cont.points[i][1], cont.points[i][0]);
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }
        ctx.closePath();
    }

    function drawMap() {
        frame++;
        ctx.clearRect(0, 0, w, h);

        // subtle grid
        ctx.lineWidth = 0.5;
        for (let i = 0; i <= 18; i++) {
            const x = (i / 18) * w;
            const alpha = 0.03 + Math.sin(frame * 0.008 + i * 0.4) * 0.01;
            ctx.strokeStyle = `rgba(0, 255, 65, ${alpha})`;
            ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
        }
        for (let i = 0; i <= 9; i++) {
            const y = (i / 9) * h;
            const alpha = 0.03 + Math.sin(frame * 0.008 + i * 0.4) * 0.01;
            ctx.strokeStyle = `rgba(0, 255, 65, ${alpha})`;
            ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
        }

        // equator line
        const eqY = h / 2;
        ctx.strokeStyle = 'rgba(0, 255, 65, 0.06)';
        ctx.lineWidth = 1;
        ctx.setLineDash([4, 8]);
        ctx.beginPath(); ctx.moveTo(0, eqY); ctx.lineTo(w, eqY); ctx.stroke();
        ctx.setLineDash([]);

        // draw continents - outer glow
        for (const cont of continents) {
            ctx.strokeStyle = 'rgba(0, 255, 65, 0.06)';
            ctx.lineWidth = 4;
            drawContinent(cont);
            ctx.stroke();
        }

        // draw continents - fill
        for (const cont of continents) {
            ctx.fillStyle = 'rgba(0, 255, 65, 0.04)';
            drawContinent(cont);
            ctx.fill();
        }

        // draw continents - sharp edge
        for (const cont of continents) {
            ctx.strokeStyle = 'rgba(0, 255, 65, 0.3)';
            ctx.lineWidth = 1;
            drawContinent(cont);
            ctx.stroke();
        }

        // persistent city dots
        for (let i = cityDots.length - 1; i >= 0; i--) {
            const cd = cityDots[i];
            cd.age++;
            if (cd.age > 600) { cityDots.splice(i, 1); continue; }
            const alpha = cd.age > 500 ? (600 - cd.age) / 100 : 1;
            const pulseR = 2.5 + Math.sin(frame * 0.05 + cd.phase) * 1;

            ctx.fillStyle = `rgba(0, 229, 255, ${0.7 * alpha})`;
            ctx.shadowColor = '#00e5ff';
            ctx.shadowBlur = 8;
            ctx.beginPath();
            ctx.arc(cd.x, cd.y, pulseR, 0, Math.PI * 2);
            ctx.fill();

            // ripple
            const ringR = pulseR + 4 + Math.sin(frame * 0.03 + cd.phase) * 2;
            ctx.strokeStyle = `rgba(0, 229, 255, ${0.15 * alpha})`;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.arc(cd.x, cd.y, ringR, 0, Math.PI * 2);
            ctx.stroke();

            ctx.shadowBlur = 0;
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
            ctx.strokeStyle = `rgba(0, 229, 255, ${alpha * 0.12})`;
            ctx.lineWidth = 4;
            ctx.shadowColor = '#00e5ff';
            ctx.shadowBlur = 8;
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.quadraticCurveTo(midX, midY, x2, y2);
            ctx.stroke();

            // sharp arc
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
                    const tt = Math.max(0, t - tr * 0.025);
                    const dotX = (1-tt)*(1-tt)*x1 + 2*(1-tt)*tt*midX + tt*tt*x2;
                    const dotY = (1-tt)*(1-tt)*y1 + 2*(1-tt)*tt*midY + tt*tt*y2;
                    const trAlpha = 1 - tr / 5;
                    ctx.fillStyle = tr === 0 ? '#ffffff' : `rgba(0, 229, 255, ${trAlpha * 0.5})`;
                    if (tr === 0) { ctx.shadowColor = '#00e5ff'; ctx.shadowBlur = 12; }
                    ctx.beginPath();
                    ctx.arc(dotX, dotY, tr === 0 ? 2.5 : 1.5, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.shadowBlur = 0;
                }
            }

            // labels
            if (alpha > 0.3) {
                ctx.fillStyle = `rgba(0, 229, 255, ${alpha * 0.5})`;
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
        for (const pt of [src, dst]) {
            const nearby = cityDots.some(d => Math.hypot(d.x - pt[0], d.y - pt[1]) < 10);
            if (!nearby) {
                cityDots.push({ x: pt[0], y: pt[1], age: 0, phase: Math.random() * Math.PI * 2 });
            }
        }
        if (connections.length > 20) connections.shift();
    };
}
