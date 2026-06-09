// Visual effects: matrix rain background, screen flashes, text scramble.

const REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export class MatrixRain {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.chars = 'アカサタナハマヤラワ0123456789ABCDEF$#%&@';
    this.alarm = false;
    this.running = false;
    this._resize = () => this.resize();
    window.addEventListener('resize', this._resize);
    this.resize();
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.fontSize = Math.max(12, Math.round(window.innerWidth / 110));
    this.cols = Math.ceil(this.canvas.width / this.fontSize);
    this.drops = Array.from({ length: this.cols }, () =>
      Math.random() * -this.canvas.height / this.fontSize);
  }

  setAlarm(on) {
    this.alarm = on;
  }

  start() {
    if (this.running || REDUCED) return;
    this.running = true;
    let last = 0;
    const loop = (t) => {
      if (!this.running) return;
      if (t - last > 50) {
        this.step();
        last = t;
      }
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
  }

  stop() {
    this.running = false;
  }

  step() {
    const { ctx, canvas, fontSize } = this;
    ctx.fillStyle = 'rgba(2, 8, 4, 0.12)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.font = `${fontSize}px monospace`;
    ctx.fillStyle = this.alarm ? 'rgba(255, 45, 85, 0.5)' : 'rgba(57, 255, 20, 0.5)';
    for (let i = 0; i < this.drops.length; i++) {
      const ch = this.chars[(Math.random() * this.chars.length) | 0];
      ctx.fillText(ch, i * fontSize, this.drops[i] * fontSize);
      if (this.drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
        this.drops[i] = 0;
      }
      this.drops[i] += 1;
    }
  }
}

// Full-screen color flash (firewall hits, access granted).
export function flash(color = 'rgba(57,255,20,0.25)', ms = 180) {
  if (REDUCED) return;
  const el = document.getElementById('flash');
  el.style.transition = 'none';
  el.style.background = color;
  el.style.opacity = '1';
  requestAnimationFrame(() => {
    el.style.transition = `opacity ${ms}ms ease-out`;
    el.style.opacity = '0';
  });
}

export function shake(el = document.body, ms = 350) {
  if (REDUCED) return;
  el.classList.remove('fx-shake');
  void el.offsetWidth; // restart animation
  el.classList.add('fx-shake');
  setTimeout(() => el.classList.remove('fx-shake'), ms);
}

// Scramble-in text reveal for big dramatic headings.
export function scrambleIn(el, text, ms = 900) {
  if (REDUCED) {
    el.textContent = text;
    return;
  }
  const glyphs = '!<>-_\\/[]{}—=+*^?#$%&';
  const start = performance.now();
  const tick = (t) => {
    const p = Math.min(1, (t - start) / ms);
    const settled = Math.floor(text.length * p);
    let out = text.slice(0, settled);
    for (let i = settled; i < text.length; i++) {
      out += text[i] === ' ' ? ' ' : glyphs[(Math.random() * glyphs.length) | 0];
    }
    el.textContent = out;
    if (p < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

export const reducedMotion = REDUCED;
