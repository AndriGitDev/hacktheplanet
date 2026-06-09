// Run-screen panels: the terminal (hackertyper engine), the password
// cracker, and the exfil file list.

import { CODE } from './data.js';

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export class Terminal {
  constructor(el) {
    this.el = el;
    this.codeLine = 0;
    this.codeCol = 0;
    this.current = null; // element receiving hackertyper output
  }

  clear() {
    this.el.innerHTML = '';
    this.current = null;
  }

  trim() {
    while (this.el.children.length > 220) this.el.removeChild(this.el.firstChild);
  }

  scroll() {
    this.el.scrollTop = this.el.scrollHeight;
  }

  line(text, cls = 'sys') {
    const div = document.createElement('div');
    div.className = `tl ${cls}`;
    div.textContent = text;
    this.el.appendChild(div);
    this.current = null;
    this.trim();
    this.scroll();
    return div;
  }

  async typeLine(text, cls = 'sys', cps = 80) {
    const div = this.line('', cls);
    for (const ch of text) {
      div.textContent += ch;
      this.scroll();
      await sleep(1000 / cps);
    }
    return div;
  }

  // The magic: every call pours the next few characters of the corpus
  // into the terminal, so mashing any keys "writes" convincing code.
  emitCode(chars = 3) {
    for (let i = 0; i < chars; i++) {
      if (!this.current) {
        this.current = document.createElement('div');
        this.current.className = 'tl code';
        this.current.textContent = '';
        this.el.appendChild(this.current);
        this.trim();
      }
      const line = CODE[this.codeLine % CODE.length];
      if (this.codeCol >= line.length) {
        this.codeLine += 1;
        this.codeCol = 0;
        this.current = null;
        // Blank corpus lines become visual breathing room for free.
        continue;
      }
      this.current.textContent += line[this.codeCol];
      this.codeCol += 1;
    }
    this.scroll();
  }
}

export class Cracker {
  constructor(el) {
    this.el = el;
    this.timer = null;
  }

  idle(text = 'AWAITING TARGET') {
    this.stop();
    this.el.innerHTML = `<div class="crack-idle">${text}</div>`;
  }

  stop() {
    if (this.timer) clearInterval(this.timer);
    this.timer = null;
  }

  // Cycle glyphs and lock the password in one character at a time.
  run(password, ms = 5200, onLock = () => {}) {
    this.stop();
    const glyphs = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#$%&';
    this.el.innerHTML = password
      .split('')
      .map(() => '<span class="crack-slot">·</span>')
      .join('');
    const slots = [...this.el.querySelectorAll('.crack-slot')];
    let locked = 0;
    const lockEvery = ms / password.length;
    let lastLock = performance.now();

    return new Promise((resolve) => {
      this.timer = setInterval(() => {
        const now = performance.now();
        for (let i = locked; i < slots.length; i++) {
          slots[i].textContent = glyphs[(Math.random() * glyphs.length) | 0];
        }
        if (now - lastLock >= lockEvery && locked < slots.length) {
          slots[locked].textContent = password[locked];
          slots[locked].classList.add('locked');
          locked += 1;
          lastLock = now;
          onLock(locked, slots.length);
        }
        if (locked >= slots.length) {
          this.stop();
          resolve();
        }
      }, 45);
    });
  }
}

export class Exfil {
  constructor(el) {
    this.el = el;
    this.rows = [];
    this.active = 0;
    this.running = false;
  }

  load(files) {
    this.el.innerHTML = '';
    this.active = 0;
    this.rows = files.map((name) => {
      const row = document.createElement('div');
      row.className = 'exfil-row';
      row.innerHTML = `<span class="exfil-name">${name}</span>` +
        '<span class="exfil-bar"><i></i></span><span class="exfil-pct">--</span>';
      this.el.appendChild(row);
      return { row, name, pct: 0, bar: row.querySelector('i'), label: row.querySelector('.exfil-pct') };
    });
  }

  // Files trickle on their own; keystrokes shove them forward hard.
  start(onDone) {
    this.running = true;
    const tick = () => {
      if (!this.running) return;
      this.advance(2.4);
      if (this.active >= this.rows.length) {
        this.running = false;
        onDone();
        return;
      }
      setTimeout(tick, 70);
    };
    tick();
  }

  boost() {
    if (this.running) this.advance(6 + Math.random() * 4);
  }

  advance(amount) {
    const f = this.rows[this.active];
    if (!f) return;
    f.pct = Math.min(100, f.pct + amount);
    f.bar.style.width = `${f.pct}%`;
    f.label.textContent = `${Math.floor(f.pct)}%`;
    if (f.pct >= 100) {
      f.label.textContent = 'OK';
      f.row.classList.add('done');
      this.active += 1;
    }
  }

  stop() {
    this.running = false;
  }
}
