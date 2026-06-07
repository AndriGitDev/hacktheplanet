import { initMatrix } from './matrix.js';
import { initHexDump } from './hexdump.js';
import { initTerminal } from './terminal.js';
import { initAlerts } from './alerts.js';
import { initProgress } from './progress.js';
import { initWorldMap } from './worldmap.js';
import { initNetwork } from './network.js';
import * as audio from './audio.js';
import { startHackSequence } from './hack.js';
import { setupExperience } from './experience.js';
import { initSpectacle } from './spectacle.js';

// Init all panels
initMatrix(document.getElementById('matrix-canvas'));

const onHex = initHexDump(document.getElementById('hex-content'));
const onTerminal = initTerminal(document.getElementById('terminal-content'));
const onAlert = initAlerts(
    document.getElementById('alert-content'),
    document.getElementById('alert-flash')
);
const onProgress = initProgress(document.getElementById('progress-content'));
const onMapConnection = initWorldMap(document.getElementById('map-canvas'));
const onNodePulse = initNetwork(document.getElementById('network-canvas'));
const spectacle = initSpectacle(document.getElementById('spectacle-canvas'), {
    firewallMeter: document.getElementById('plot-firewall-meter'),
    vibeMeter: document.getElementById('vibe-pressure-meter'),
});

// Clock and uptime
const clockEl = document.getElementById('clock');
const uptimeEl = document.getElementById('uptime');
const startTime = Date.now();

function updateClock() {
    const now = new Date();
    clockEl.textContent = now.toLocaleTimeString('en-US', { hour12: false }) + '.' +
        String(now.getMilliseconds()).padStart(3, '0').slice(0, 2);
    const elapsed = Math.floor((Date.now() - startTime) / 1000);
    const h = String(Math.floor(elapsed / 3600)).padStart(2, '0');
    const m = String(Math.floor((elapsed % 3600) / 60)).padStart(2, '0');
    const s = String(elapsed % 60).padStart(2, '0');
    uptimeEl.textContent = 'UPTIME: ' + h + ':' + m + ':' + s;
}
setInterval(updateClock, 50);
updateClock();

// Experience controls
let hacking = false;
const experience = setupExperience({
    onStart: ({ codename, theme }) => {
        if (hacking) return;
        hacking = true;
        experience.setRunning(true);
        startHackSequence(() => {
            hacking = false;
            experience.setRunning(false);
        }, { codename, theme });
        spectacle.pulse();
    },
    onWow: () => spectacle.pulse(),
});

// Audio toggle
const audioBtn = document.getElementById('audio-toggle');
audioBtn.addEventListener('click', () => {
    const on = audio.toggle();
    audioBtn.textContent = on ? '\u{1F50A}' : '\u{1F507}';
});

// WebSocket connection with reconnect
let ws;
let reconnectDelay = 1000;
const statusDots = document.querySelectorAll('.status-dot');

function connect() {
    const proto = location.protocol === 'https:' ? 'wss:' : 'ws:';
    ws = new WebSocket(proto + '//' + location.host + '/ws');

    ws.onopen = () => {
        reconnectDelay = 1000;
    };

    ws.onmessage = (event) => {
        const msg = JSON.parse(event.data);
        switch (msg.type) {
            case 'hex':
                onHex(msg.data);
                break;
            case 'terminal':
                onTerminal(msg.data);
                audio.keyclick();
                break;
            case 'alert':
                onAlert(msg.data);
                audio.alertSound(msg.data.severity);
                break;
            case 'progress':
                onProgress(msg.data);
                break;
            case 'map_connection':
                onMapConnection(msg.data);
                audio.beep(220, 0.05, 0.03);
                break;
            case 'node_pulse':
                onNodePulse(msg.data);
                audio.beep(330, 0.04, 0.03);
                break;
        }
    };

    ws.onclose = () => {
        setTimeout(() => {
            reconnectDelay = Math.min(reconnectDelay * 2, 10000);
            connect();
        }, reconnectDelay);
    };

    ws.onerror = () => {
        ws.close();
    };
}

connect();
