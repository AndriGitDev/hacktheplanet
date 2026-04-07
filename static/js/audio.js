let audioCtx = null;
let enabled = false;

function ensureContext() {
    if (!audioCtx) {
        audioCtx = new AudioContext();
    }
    return audioCtx;
}

export function isEnabled() {
    return enabled;
}

export function toggle() {
    enabled = !enabled;
    if (enabled) ensureContext();
    return enabled;
}

export function beep(freq = 440, duration = 0.08, vol = 0.1) {
    if (!enabled) return;
    const ctx = ensureContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.value = freq;
    osc.type = 'sine';
    gain.gain.setValueAtTime(vol, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    osc.start();
    osc.stop(ctx.currentTime + duration);
}

export function keyclick() {
    if (!enabled) return;
    const ctx = ensureContext();
    const bufferSize = ctx.sampleRate * 0.02;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.1));
    }
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    const gain = ctx.createGain();
    gain.gain.value = 0.03;
    source.connect(gain);
    gain.connect(ctx.destination);
    source.start();
}

export function alertSound(severity) {
    if (!enabled) return;
    if (severity === 'critical') {
        beep(880, 0.15, 0.15);
        setTimeout(() => beep(660, 0.15, 0.15), 150);
    } else if (severity === 'warning') {
        beep(660, 0.1, 0.1);
    } else {
        beep(440, 0.06, 0.05);
    }
}
