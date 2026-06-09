// Hack the Planet — orchestrator.
// boot → login → mission select → the run → access granted → debrief.

import {
  BOOT_LINES, HANDLE_FIRST, HANDLE_LAST, MISSIONS, CHATTER, RANKS,
  PROXY_CITIES, TRACED_EXCUSES,
} from './data.js';
import { Terminal, Cracker, Exfil } from './panels.js';
import { WorldMap } from './worldmap.js';
import { MatrixRain, flash, shake, scrambleIn, reducedMotion } from './fx.js';
import { synth } from './audio.js';

const $ = (sel) => document.querySelector(sel);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const pick = (arr) => arr[(Math.random() * arr.length) | 0];

const state = {
  screen: 'boot',
  handle: 'GHOST PUFFIN',
  mission: null,
  stage: 'idle',
  keys: 0,
  access: 0,
  trace: 0,
  tracePeak: 0,
  startTime: 0,
  runToken: 0, // bumped to cancel a run's async loops
};

const rain = new MatrixRain($('#rain'));
const map = new WorldMap($('#map-canvas'));
const term = new Terminal($('#terminal'));
const cracker = new Cracker($('#crack-display'));
const exfil = new Exfil($('#exfil-list'));

// ---------------------------------------------------------------- screens

function show(name) {
  state.screen = name;
  document.querySelectorAll('.screen').forEach((s) => {
    s.classList.toggle('active', s.id === `screen-${name}`);
  });
  if (name === 'run') {
    map.resize();
    map.start();
  } else {
    map.stop();
  }
}

// ------------------------------------------------------------------ boot

async function boot() {
  show('boot');
  rain.start();
  const log = $('#boot-log');
  log.innerHTML = '';
  let skipped = false;
  const skip = () => { skipped = true; };
  window.addEventListener('keydown', skip, { once: true });
  window.addEventListener('pointerdown', skip, { once: true });

  for (const line of BOOT_LINES) {
    const div = document.createElement('div');
    div.textContent = line.t;
    log.appendChild(div);
    synth.beep();
    if (!skipped) await sleep(reducedMotion ? 40 : line.d);
  }
  window.removeEventListener('keydown', skip);
  window.removeEventListener('pointerdown', skip);
  await sleep(skipped ? 150 : 600);
  login();
}

// ----------------------------------------------------------------- login

function randomHandle() {
  return `${pick(HANDLE_FIRST)} ${pick(HANDLE_LAST)}`;
}

function login() {
  show('login');
  const input = $('#handle-input');
  input.value = '';
  input.placeholder = randomHandle();
  setTimeout(() => input.focus(), 50);
}

function submitHandle() {
  const input = $('#handle-input');
  const raw = (input.value || input.placeholder).trim().toUpperCase();
  state.handle = raw.slice(0, 24) || 'GHOST PUFFIN';
  synth.beep();
  missions();
}

// -------------------------------------------------------------- missions

function missions() {
  show('missions');
  $('#missions-greeting').textContent = `WELCOME, ${state.handle}.`;
  const grid = $('#mission-grid');
  if (grid.childElementCount) return;
  for (const m of MISSIONS) {
    const card = document.createElement('button');
    card.className = 'mission-card';
    card.type = 'button';
    card.innerHTML =
      `<span class="m-threat">${'▰'.repeat(m.threat)}${'▱'.repeat(5 - m.threat)} THREAT</span>` +
      `<strong>${m.name}</strong>` +
      `<em>${m.tagline}</em>` +
      `<p>${m.brief}</p>` +
      `<span class="m-host">${m.host} · ${m.ip}</span>`;
    card.addEventListener('click', () => startRun(m));
    grid.appendChild(card);
  }
}

// ----------------------------------------------------------------- input

// Any key (or tap on the mash button) is a "hack keystroke" during the run.
function onHackKey(e) {
  if (state.screen !== 'run') return;
  if (e.metaKey || e.ctrlKey || e.altKey) return;
  if (e.key === 'Escape') return;
  if (e.key && e.key.length > 1 && e.key !== 'Enter' && e.key !== 'Backspace' && e.key !== 'Tab') return;
  if (e.key === ' ' || e.key === 'Tab') e.preventDefault();
  registerKeystroke();
}

function registerKeystroke() {
  const s = state.stage;
  if (!['inject', 'firewall', 'crack', 'exfil'].includes(s)) return;
  state.keys += 1;
  synth.key();
  term.emitCode(3);

  if (s === 'inject') {
    setAccess(state.access + 0.8);
    if (state.keys % 14 === 0) term.line(`>> ${pick(CHATTER.inject)}`);
  } else if (s === 'firewall') {
    setTrace(state.trace - 2.4);
    setAccess(state.access + 0.12);
  } else if (s === 'crack') {
    setAccess(Math.min(80, state.access + 0.1));
  } else if (s === 'exfil') {
    exfil.boost();
    setAccess(Math.min(99, state.access + 0.25));
    if (state.keys % 18 === 0) term.line(`>> ${pick(CHATTER.exfil)}`);
  }
}

window.addEventListener('keydown', onHackKey);
$('#mash').addEventListener('pointerdown', (e) => {
  e.preventDefault();
  registerKeystroke();
});

// ---------------------------------------------------------------- meters

function setAccess(v) {
  state.access = Math.max(0, Math.min(100, v));
  $('#access-bar').style.width = `${state.access}%`;
  $('#access-pct').textContent = `${Math.floor(state.access)}%`;
}

function setTrace(v) {
  state.trace = Math.max(0, Math.min(100, v));
  state.tracePeak = Math.max(state.tracePeak, state.trace);
  $('#trace-bar').style.width = `${state.trace}%`;
  $('#trace-pct').textContent = `${Math.floor(state.trace)}%`;
}

function setStage(stage, label, hint) {
  state.stage = stage;
  $('#stage-label').textContent = label;
  $('#hint').textContent = hint;
}

function setAlarm(on) {
  document.body.classList.toggle('alarm', on);
  map.setAlarm(on);
  rain.setAlarm(on);
}

// ------------------------------------------------------------------ run

function buildRoute(mission) {
  const target = PROXY_CITIES.find((c) => c.name === mission.city) ||
    { name: mission.city, lat: 47.4, lng: 8.5 };
  const hops = PROXY_CITIES
    .filter((c) => c.name !== target.name)
    .sort(() => Math.random() - 0.5)
    .slice(0, 5);
  return [...hops, target];
}

async function startRun(mission) {
  state.mission = mission;
  state.keys = 0;
  state.tracePeak = 0;
  state.startTime = performance.now();
  const token = ++state.runToken;

  show('run');
  setAlarm(false);
  setAccess(0);
  setTrace(0);
  term.clear();
  cracker.idle();
  exfil.load(mission.files);
  $('#run-target').textContent = `${mission.name} · ${mission.host} · ${mission.ip}`;
  $('#run-operator').textContent = `OPERATOR: ${state.handle}`;

  const route = buildRoute(mission);
  map.setRoute(route);

  // STAGE 1 — connect: the proxy chain assembles itself for drama.
  setStage('connect', 'STAGE 1/5 · UPLINK', 'establishing proxy chain…');
  await term.typeLine(`$ uplink --target ${mission.host} (${mission.ip}) --drama max`, 'cmd');
  for (let i = 0; i < route.length - 1; i++) {
    if (token !== state.runToken) return;
    await sleep(reducedMotion ? 80 : 650);
    map.revealNextHop();
    synth.hop();
    term.line(`   hop ${i + 1}/${route.length - 1} ➜ ${route[i + 1].name} [encrypted, fictional]`);
  }
  await sleep(400);
  if (token !== state.runToken) return;
  term.line('>> PROXY CHAIN ESTABLISHED. You are everywhere and nowhere.', 'good');

  // STAGE 2 — inject: the keyboard becomes the weapon.
  setStage('inject', 'STAGE 2/5 · INJECT', 'TYPE ANYTHING — any keys work. seriously, mash.');
  term.line('>> START TYPING TO INJECT CODE. The mainframe cannot tell the difference.', 'good');
  while (state.access < 45) {
    if (token !== state.runToken) return;
    await sleep(120);
  }

  // STAGE 3 — firewall counterattack: survive the trace.
  const survived = await firewallBattle(token);
  if (token !== state.runToken) return;
  if (!survived) return traced();

  // STAGE 4 — crack the password.
  setStage('crack', 'STAGE 3/5 · CRACK', 'brute-forcing… keep typing for style points');
  term.line('$ crack --wordlist classics.txt --style "one glowing character at a time"', 'cmd');
  await cracker.run(mission.password, reducedMotion ? 800 : 5200, () => synth.crack());
  if (token !== state.runToken) return;
  flash('rgba(57,255,20,0.18)');
  term.line(`>> PASSWORD ACCEPTED: "${mission.password}"`, 'good');
  term.line(`   ${mission.passwordJoke}`);
  await sleep(900);

  // STAGE 5 — exfil.
  setStage('exfil', 'STAGE 4/5 · EXFIL', 'keep typing — every keystroke pulls files faster');
  term.line('$ exfil --everything --gently', 'cmd');
  await new Promise((resolve) => exfil.start(resolve));
  if (token !== state.runToken) return;
  setAccess(100);
  granted();
}

async function firewallBattle(token) {
  setStage('firewall', 'STAGE !/5 · FIREWALL', 'COUNTERATTACK! TYPE FASTER TO BEAT THE TRACE!');
  setAlarm(true);
  synth.alarm();
  flash('rgba(255,45,85,0.3)');
  shake();
  term.line(`!! ${pick(CHATTER.firewall)}`, 'bad');

  const duration = reducedMotion ? 3000 : 7500;
  const start = performance.now();
  let lastAlarm = 0;
  while (performance.now() - start < duration) {
    if (token !== state.runToken) return false;
    // Idle hands get traced in ~5.5s; steady mashing holds the line.
    setTrace(state.trace + 1.75);
    if (state.trace >= 100) {
      setAlarm(false);
      return false;
    }
    const now = performance.now();
    if (now - lastAlarm > 1300) {
      synth.alarm();
      term.line(`!! ${pick(CHATTER.firewall)}`, 'bad');
      lastAlarm = now;
    }
    await sleep(95);
  }
  setAlarm(false);
  flash('rgba(57,255,20,0.2)');
  term.line('>> FIREWALL DOWN. The black ice melts politely.', 'good');
  // Residual heat bleeds off.
  const decay = setInterval(() => {
    setTrace(state.trace - 4);
    if (state.trace <= 0) clearInterval(decay);
  }, 100);
  return true;
}

// --------------------------------------------------------------- endings

async function granted() {
  setStage('granted', 'STAGE 5/5 · IN', '');
  synth.granted();
  flash('rgba(57,255,20,0.45)', 500);
  show('splash');
  scrambleIn($('#splash-title'), 'ACCESS GRANTED');
  $('#splash-sub').textContent = state.mission.victory;
  await sleep(reducedMotion ? 1200 : 3200);
  debrief();
}

function traced() {
  state.stage = 'traced';
  exfil.stop();
  cracker.stop();
  synth.traced();
  flash('rgba(255,45,85,0.5)', 600);
  shake();
  show('traced');
  $('#traced-excuse').textContent = pick(TRACED_EXCUSES);
}

function debrief() {
  const secs = (performance.now() - state.startTime) / 1000;
  const kps = state.keys / Math.max(1, secs);
  const rank = [...RANKS].reverse().find((r) => kps >= r.minKps) || RANKS[0];
  const m = state.mission;

  show('debrief');
  $('#r-operator').textContent = state.handle;
  $('#r-target').textContent = `${m.name} (${m.host})`;
  $('#r-time').textContent = `${secs.toFixed(1)}s`;
  $('#r-keys').textContent = `${state.keys} (${kps.toFixed(1)}/sec)`;
  $('#r-trace').textContent = `${Math.floor(state.tracePeak)}% — ${state.tracePeak >= 85 ? 'uncomfortably close' : state.tracePeak >= 50 ? 'spicy' : 'they never got close'}`;
  $('#r-rank').textContent = rank.name;
  $('#r-ranknote').textContent = rank.note;
  $('#r-victory').textContent = m.victorySub;
}

function reportText() {
  const m = state.mission;
  return [
    '=== HACK THE PLANET · MISSION REPORT ===',
    `operator ......... ${state.handle}`,
    `target ........... ${m.name} (${m.host}) [fictional]`,
    `result ........... ${m.victory}`,
    `keystrokes ....... ${$('#r-keys').textContent}`,
    `trace peak ....... ${$('#r-trace').textContent}`,
    `rank ............. ${$('#r-rank').textContent}`,
    'packets harmed ... 0',
    '',
    'simulated at https://htp.kastro.is — a harmless toy by Kastro Labs',
  ].join('\n');
}

// ------------------------------------------------------------- boss mode

function toggleBoss() {
  document.body.classList.toggle('boss');
}

// --------------------------------------------------------------- wiring

$('#btn-login').addEventListener('click', submitHandle);
$('#handle-input').addEventListener('keydown', (e) => {
  if (e.key === 'Enter') submitHandle();
});
$('#btn-random').addEventListener('click', () => {
  $('#handle-input').value = randomHandle();
  synth.beep();
});

$('#btn-retry').addEventListener('click', () => startRun(state.mission));
$('#btn-abort').addEventListener('click', () => { state.runToken++; missions(); });
$('#btn-replay').addEventListener('click', () => startRun(state.mission));
$('#btn-newtarget').addEventListener('click', () => { state.runToken++; missions(); });
$('#btn-copy').addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText(reportText());
    $('#btn-copy').textContent = 'COPIED ✓';
    setTimeout(() => { $('#btn-copy').textContent = 'COPY REPORT'; }, 1600);
  } catch {
    $('#btn-copy').textContent = 'CLIPBOARD BLOCKED';
  }
});

$('#btn-sound').addEventListener('click', () => {
  const on = synth.toggle();
  $('#btn-sound').textContent = on ? 'SOUND: ON' : 'SOUND: OFF';
  if (on) synth.beep();
});

window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') toggleBoss();
});
$('#boss').addEventListener('click', toggleBoss);

setInterval(() => {
  const now = new Date();
  $('#clock').textContent = `${now.toISOString().slice(11, 19)} UTC`;
}, 1000);

// ------------------------------------------------------------------ go

(async function init() {
  await map.load().catch(() => {}); // map is decorative; never block the show
  boot();
})();
