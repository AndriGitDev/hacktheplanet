// Canvas world map with animated proxy-chain arcs.
// Decodes the bundled TopoJSON (land-110m) by hand — no libraries.

function decodeTopology(topo) {
  const { scale, translate } = topo.transform;
  const arcs = topo.arcs.map((arc) => {
    let x = 0;
    let y = 0;
    return arc.map(([dx, dy]) => {
      x += dx;
      y += dy;
      return [x * scale[0] + translate[0], y * scale[1] + translate[1]];
    });
  });

  const rings = [];
  for (const geom of topo.objects.land.geometries) {
    const polys = geom.type === 'Polygon' ? [geom.arcs] : geom.arcs;
    for (const poly of polys) {
      for (const ringArcs of poly) {
        const ring = [];
        for (const idx of ringArcs) {
          const arc = idx >= 0 ? arcs[idx] : arcs[~idx].slice().reverse();
          // Consecutive arcs share an endpoint; skip the duplicate.
          ring.push(...(ring.length ? arc.slice(1) : arc));
        }
        rings.push(ring);
      }
    }
  }
  return rings;
}

export class WorldMap {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.rings = null;
    this.base = null; // offscreen land render
    this.route = [];
    this.revealed = 0; // how many hops are lit
    this.revealStart = 0; // timestamp the latest hop started drawing
    this.alarm = false;
    this.running = false;
    this._resize = () => this.resize();
    window.addEventListener('resize', this._resize);
  }

  async load() {
    const res = await fetch('/data/land-110m.json');
    this.rings = decodeTopology(await res.json());
    this.resize();
  }

  // Equirectangular projection into the canvas, slightly cropped at the
  // poles where there is nothing but drama anyway.
  project(lng, lat) {
    const w = this.canvas.width;
    const h = this.canvas.height;
    return [((lng + 180) / 360) * w, ((76 - lat) / 152) * h];
  }

  resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const rect = this.canvas.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    this.canvas.width = Math.round(rect.width * dpr);
    this.canvas.height = Math.round(rect.height * dpr);
    this.renderBase();
  }

  renderBase() {
    if (!this.rings) return;
    const { width: w, height: h } = this.canvas;
    this.base = document.createElement('canvas');
    this.base.width = w;
    this.base.height = h;
    const ctx = this.base.getContext('2d');

    // Graticule
    ctx.strokeStyle = 'rgba(57, 255, 20, 0.07)';
    ctx.lineWidth = 1;
    for (let lng = -180; lng <= 180; lng += 30) {
      const [x] = this.project(lng, 0);
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
      ctx.stroke();
    }
    for (let lat = -60; lat <= 60; lat += 30) {
      const [, y] = this.project(0, lat);
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }

    // Landmasses
    ctx.strokeStyle = 'rgba(57, 255, 20, 0.55)';
    ctx.fillStyle = 'rgba(57, 255, 20, 0.08)';
    ctx.lineWidth = Math.max(1, w / 900);
    for (const ring of this.rings) {
      ctx.beginPath();
      ring.forEach(([lng, lat], i) => {
        const [x, y] = this.project(lng, lat);
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      });
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    }
  }

  setRoute(cities) {
    this.route = cities;
    this.revealed = 0;
  }

  revealNextHop() {
    if (this.revealed < this.route.length - 1) {
      this.revealed += 1;
      this.revealStart = performance.now();
    }
  }

  revealAll() {
    this.revealed = Math.max(0, this.route.length - 1);
    this.revealStart = 0;
  }

  setAlarm(on) {
    this.alarm = on;
  }

  start() {
    if (this.running) return;
    this.running = true;
    const loop = (t) => {
      if (!this.running) return;
      this.draw(t);
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
  }

  stop() {
    this.running = false;
  }

  arcPath(ctx, a, b, progress) {
    const [x1, y1] = this.project(a.lng, a.lat);
    const [x2, y2] = this.project(b.lng, b.lat);
    const mx = (x1 + x2) / 2;
    const my = (y1 + y2) / 2 - Math.hypot(x2 - x1, y2 - y1) * 0.25;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    if (progress >= 1) {
      ctx.quadraticCurveTo(mx, my, x2, y2);
    } else {
      // Walk the quadratic bezier up to `progress`.
      let px = x1;
      let py = y1;
      const steps = 24;
      for (let i = 1; i <= steps * progress; i++) {
        const t = i / steps;
        px = (1 - t) ** 2 * x1 + 2 * (1 - t) * t * mx + t * t * x2;
        py = (1 - t) ** 2 * y1 + 2 * (1 - t) * t * my + t * t * y2;
        ctx.lineTo(px, py);
      }
    }
    ctx.stroke();
  }

  draw(t) {
    const ctx = this.ctx;
    const { width: w, height: h } = this.canvas;
    ctx.clearRect(0, 0, w, h);
    if (this.base) ctx.drawImage(this.base, 0, 0);
    if (this.alarm) {
      ctx.fillStyle = 'rgba(255, 45, 85, 0.06)';
      ctx.fillRect(0, 0, w, h);
    }

    const accent = this.alarm ? 'rgba(255, 45, 85,' : 'rgba(255, 212, 0,';
    const fontPx = Math.max(9, Math.round(w / 70));
    ctx.font = `${fontPx}px "Share Tech Mono", monospace`;

    for (let i = 0; i < this.revealed; i++) {
      const isLatest = i === this.revealed - 1;
      const progress = isLatest && this.revealStart
        ? Math.min(1, (t - this.revealStart) / 600)
        : 1;
      ctx.strokeStyle = `${accent} 0.85)`;
      ctx.lineWidth = Math.max(1.2, w / 700);
      ctx.shadowColor = `${accent} 1)`;
      ctx.shadowBlur = 8;
      this.arcPath(ctx, this.route[i], this.route[i + 1], progress);
      ctx.shadowBlur = 0;
    }

    // Nodes + labels for every endpoint that is lit.
    const pulse = 0.5 + 0.5 * Math.sin(t / 300);
    for (let i = 0; i <= this.revealed && i < this.route.length; i++) {
      const c = this.route[i];
      const [x, y] = this.project(c.lng, c.lat);
      const isTarget = i === this.route.length - 1;
      const r = isTarget ? 3 + pulse * 4 : 2.5;
      ctx.fillStyle = isTarget ? `${accent} 0.95)` : 'rgba(57, 255, 20, 0.9)';
      ctx.beginPath();
      ctx.arc(x, y, r * (w / 600), 0, Math.PI * 2);
      ctx.fill();
      if (isTarget && this.revealed >= this.route.length - 1) {
        ctx.strokeStyle = `${accent} ${0.7 - pulse * 0.5})`;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(x, y, (6 + pulse * 10) * (w / 600), 0, Math.PI * 2);
        ctx.stroke();
      }
      ctx.fillStyle = isTarget ? `${accent} 0.9)` : 'rgba(57, 255, 20, 0.65)';
      const label = isTarget ? `▸ ${c.name}` : c.name;
      ctx.fillText(label, Math.min(x + 6, w - 80), Math.max(y - 6, fontPx));
    }
  }

  destroy() {
    this.stop();
    window.removeEventListener('resize', this._resize);
  }
}
