// Synth sound effects via WebAudio. No samples, no network, off by default.

class Synth {
  constructor() {
    this.ctx = null;
    this.enabled = false;
  }

  toggle() {
    this.enabled = !this.enabled;
    if (this.enabled && !this.ctx) {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (this.enabled) this.ctx.resume();
    return this.enabled;
  }

  tone({ freq = 440, type = 'square', dur = 0.06, gain = 0.04, slide = 0 }) {
    if (!this.enabled || !this.ctx) return;
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, t);
    if (slide) osc.frequency.exponentialRampToValueAtTime(Math.max(40, freq + slide), t + dur);
    g.gain.setValueAtTime(gain, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    osc.connect(g).connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + dur + 0.02);
  }

  // Quiet blip per keystroke, pitch wanders so it sounds alive.
  key() {
    this.tone({ freq: 700 + Math.random() * 700, dur: 0.035, gain: 0.022 });
  }

  beep() {
    this.tone({ freq: 980, dur: 0.08, gain: 0.04 });
  }

  alarm() {
    this.tone({ freq: 880, type: 'sawtooth', dur: 0.18, gain: 0.05, slide: -440 });
  }

  hop() {
    this.tone({ freq: 520, type: 'triangle', dur: 0.1, gain: 0.05, slide: 260 });
  }

  crack() {
    this.tone({ freq: 1400 + Math.random() * 400, type: 'square', dur: 0.05, gain: 0.035 });
  }

  granted() {
    if (!this.enabled || !this.ctx) return;
    [523.25, 659.25, 783.99, 1046.5].forEach((f, i) => {
      setTimeout(() => this.tone({ freq: f, type: 'triangle', dur: 0.35, gain: 0.06 }), i * 110);
    });
  }

  traced() {
    if (!this.enabled || !this.ctx) return;
    [392, 311, 233].forEach((f, i) => {
      setTimeout(() => this.tone({ freq: f, type: 'sawtooth', dur: 0.3, gain: 0.05 }), i * 160);
    });
  }
}

export const synth = new Synth();
