// World map using real TopoJSON geographic data
// Includes a minimal inline TopoJSON decoder (no dependencies)

export function initWorldMap(canvas) {
    const ctx = canvas.getContext('2d');
    let w = 0, h = 0;
    const connections = [];
    const cityDots = [];
    let frame = 0;
    let landPolygons = []; // will be filled from TopoJSON

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

    // --- Minimal TopoJSON decoder ---
    function decodeTopojson(topo) {
        const transform = topo.transform;
        const arcs = topo.arcs.map(arc => {
            let x = 0, y = 0;
            return arc.map(p => {
                x += p[0]; y += p[1];
                if (transform) {
                    return [
                        x * transform.scale[0] + transform.translate[0],
                        x * transform.scale[1] + transform.translate[1]
                    ];
                }
                return [x, y];
            });
        });

        // properly decode with transform
        if (transform) {
            const sx = transform.scale[0], sy = transform.scale[1];
            const tx = transform.translate[0], ty = transform.translate[1];
            topo.arcs.forEach((arc, ai) => {
                let x = 0, y = 0;
                arcs[ai] = arc.map(p => {
                    x += p[0]; y += p[1];
                    return [x * sx + tx, y * sy + ty];
                });
            });
        }

        function resolveArc(idx) {
            if (idx >= 0) return arcs[idx];
            return [...arcs[~idx]].reverse();
        }

        function resolveRing(indices) {
            let coords = [];
            for (const idx of indices) {
                const arc = resolveArc(idx);
                // skip first point of subsequent arcs (shared with previous arc's last point)
                coords = coords.concat(coords.length === 0 ? arc : arc.slice(1));
            }
            return coords;
        }

        const polygons = [];
        const geom = topo.objects.land;
        for (const g of geom.geometries) {
            if (g.type === 'Polygon') {
                for (const ring of g.arcs) {
                    polygons.push(resolveRing(ring));
                }
            } else if (g.type === 'MultiPolygon') {
                for (const poly of g.arcs) {
                    for (const ring of poly) {
                        polygons.push(resolveRing(ring));
                    }
                }
            }
        }
        return polygons;
    }

    // Load map data
    fetch('/data/land-110m.json')
        .then(r => r.json())
        .then(topo => {
            landPolygons = decodeTopojson(topo);
        })
        .catch(e => console.error('Failed to load map data:', e));

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
        ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(0, h / 2); ctx.lineTo(w, h / 2); ctx.stroke();
        ctx.setLineDash([]);

        // draw land polygons from TopoJSON
        if (landPolygons.length > 0) {
            // fill
            ctx.fillStyle = 'rgba(0,255,65,0.04)';
            for (const poly of landPolygons) {
                ctx.beginPath();
                for (let i = 0; i < poly.length; i++) {
                    const [x, y] = toXY(poly[i][0], poly[i][1]);
                    if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
                }
                ctx.closePath();
                ctx.fill();
            }

            // glow edge
            ctx.strokeStyle = 'rgba(0,255,65,0.08)';
            ctx.lineWidth = 3;
            for (const poly of landPolygons) {
                ctx.beginPath();
                for (let i = 0; i < poly.length; i++) {
                    const [x, y] = toXY(poly[i][0], poly[i][1]);
                    if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
                }
                ctx.closePath();
                ctx.stroke();
            }

            // sharp edge
            ctx.strokeStyle = 'rgba(0,255,65,0.3)';
            ctx.lineWidth = 0.8;
            for (const poly of landPolygons) {
                ctx.beginPath();
                for (let i = 0; i < poly.length; i++) {
                    const [x, y] = toXY(poly[i][0], poly[i][1]);
                    if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
                }
                ctx.closePath();
                ctx.stroke();
            }
        }

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

            ctx.strokeStyle = `rgba(0,229,255,${alpha * 0.12})`;
            ctx.lineWidth = 4;
            ctx.shadowColor = '#00e5ff';
            ctx.shadowBlur = 8;
            ctx.beginPath(); ctx.moveTo(x1, y1); ctx.quadraticCurveTo(midX, midY, x2, y2); ctx.stroke();

            ctx.strokeStyle = `rgba(0,229,255,${alpha * 0.8})`;
            ctx.lineWidth = 1.5;
            ctx.beginPath(); ctx.moveTo(x1, y1); ctx.quadraticCurveTo(midX, midY, x2, y2); ctx.stroke();
            ctx.shadowBlur = 0;

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
