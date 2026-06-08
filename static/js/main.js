(() => {
    'use strict';

    const $ = (selector) => document.querySelector(selector);
    const $$ = (selector) => Array.from(document.querySelectorAll(selector));

    const state = {
        screen: 'boot',
        missionKey: 'hack',
        step: 0,
        running: false,
        logic: 0,
        transcript: [],
        operator: '',
        particles: [],
        t: 0,
    };

    const missions = {
        hack: {
            title: 'Hack the Planet',
            code: 'HTP-01',
            brief: 'Overthrow a prop mainframe with dramatic lighting and suspiciously fast typing.',
            operatorPool: ['GHOST PUFFIN', 'NEON SKALD', 'NULL VIKING', 'CAPTAIN 2600', 'SUDO RAVEN'],
            buttons: ['Acquire vibes', 'Route through movie logic', 'Deploy toy trick', 'Overclock mainframe', 'Hack the planet'],
            steps: [
                'Acquire mainframe vibes from a prop satellite.',
                'Route through movie logic and three unnecessary maps.',
                'Deploy a toy trick against the cinematic layer.',
                'Overclock the fake mainframe until typography shakes.',
                'Print trophy screen and spare reality from involvement.',
            ],
            readouts: [
                'Mainframe vibes acquired.',
                'Movie logic accepts the premise.',
                'Toy trick failed successfully.',
                'Planet vulnerable to dramatic lighting.',
                'Planet hacked in fiction only.',
            ],
            method: '37% movie logic, 42% YAML, 21% Kastro yellow',
            verdict: 'Stylish, harmless, aggressively non-compliant with reality.',
        },
        save: {
            title: 'Save the Planet',
            code: 'HTP-02',
            brief: 'Patch the neon infrastructure before the montage becomes management policy.',
            operatorPool: ['PATCH WIZARD', 'CONSENT BADGER', 'CAPTAIN SCOPE', 'LOG HERDER', 'CTRL ALT SHEEP'],
            buttons: ['Open change window', 'Patch vibes', 'Rotate toy secrets', 'Document everything', 'Save the planet'],
            steps: [
                'Open an emergency change window in the imagination zone.',
                'Patch vulnerable vibes before they become conference slides.',
                'Rotate toy secrets that were never secrets to begin with.',
                'Write a remediation note with suspiciously good margins.',
                'Close the incident with zero real systems touched.',
            ],
            readouts: [
                'Change window approved by movie logic.',
                'Vibes patched. Neon stable.',
                'Toy secrets rotated into confetti.',
                'Boring logs save the day.',
                'Planet saved in fiction only.',
            ],
            method: '51% patch notes, 29% consent, 20% dramatic restraint',
            verdict: 'Heroic, documented, aggressively harmless.',
        },
        confuse: {
            title: 'Confuse the Planet',
            code: 'HTP-03',
            brief: 'Deploy jazz, rubber ducks, malformed YAML, and one legally distinct trench coat.',
            operatorPool: ['YAML GOBLIN', 'DUCK IN THE SHELL', 'JAZZ ROOT', 'BORK ORACLE', 'TRÖLLWARE INTERN'],
            buttons: ['Summon duck', 'Inject jazz', 'Malformed YAML', 'Ask the trench coat', 'Confuse planet'],
            steps: [
                'Summon advisory rubber duck and wait for it to blink first.',
                'Inject modal jazz into the soundtrack of the fake terminal.',
                'Malformed YAML achieves sentience, then apologises.',
                'Ask the trench coat if this is cyber enough.',
                'Confuse the planet until it voluntarily enters safe mode.',
            ],
            readouts: [
                'Duck has opinions.',
                'Jazz accepted. Time signature unstable.',
                'YAML indentation threatening discourse.',
                'Trench coat says: probably.',
                'Planet confused in fiction only.',
            ],
            method: '33% ducks, 33% jazz, 33% YAML, 1% governance',
            verdict: 'Absurd, reversible, aesthetically suspicious.',
        },
    };

    const els = {
        bootPanel: $('#boot-panel'),
        bootButton: $('#boot-button'),
        missionSelect: $('#mission-select'),
        stage: $('#stage'),
        report: $('#report'),
        ritualButton: $('#ritual-button'),
        stageTitle: $('#stage-title'),
        stageBrief: $('#stage-brief'),
        missionCode: $('#mission-code'),
        stepList: $('#step-list'),
        logicMeter: $('#logic-meter'),
        logicValue: $('#logic-value'),
        readout: $('#planet-readout'),
        terminal: $('#terminal'),
        reportOperator: $('#report-operator'),
        reportMission: $('#report-mission'),
        reportMethod: $('#report-method'),
        reportVerdict: $('#report-verdict'),
        reportTitle: $('#report-title'),
        copyReport: $('#copy-report'),
        copyLog: $('#copy-log'),
        newRun: $('#new-run'),
        resetRun: $('#reset-run'),
        toastStack: $('#toast-stack'),
        clock: $('#clock'),
    };

    function show(screen) {
        state.screen = screen;
        els.bootPanel.hidden = screen !== 'boot';
        els.missionSelect.hidden = screen !== 'missions';
        els.stage.hidden = screen !== 'stage';
        els.report.hidden = screen !== 'report';
        requestAnimationFrame(() => window.scrollTo({ top: 0, behavior: 'smooth' }));
    }

    function toast(message) {
        const item = document.createElement('div');
        item.className = 'toast';
        item.textContent = message;
        els.toastStack.appendChild(item);
        setTimeout(() => item.remove(), 4200);
    }

    function log(text, className = '') {
        const line = document.createElement('div');
        line.className = `term-line ${className}`.trim();
        line.textContent = text;
        els.terminal.appendChild(line);
        els.terminal.scrollTop = els.terminal.scrollHeight;
        state.transcript.push(text);
    }

    function pick(array) { return array[Math.floor(Math.random() * array.length)]; }

    function currentMission() { return missions[state.missionKey]; }

    function setLogic(value) {
        state.logic = Math.max(0, Math.min(100, value));
        els.logicMeter.style.width = `${state.logic}%`;
        els.logicValue.textContent = `${Math.round(state.logic)}%`;
    }

    function renderSteps() {
        const mission = currentMission();
        els.stepList.innerHTML = mission.steps.map((step, index) => {
            const status = index < state.step ? 'done' : index === state.step ? 'active' : '';
            return `<li class="${status}" data-index="${String(index + 1).padStart(2, '0')}">${step}</li>`;
        }).join('');
    }

    function setButtonText() {
        const mission = currentMission();
        const text = mission.buttons[Math.min(state.step, mission.buttons.length - 1)];
        els.ritualButton.querySelector('span').textContent = text;
    }

    function startMission(key) {
        state.missionKey = key;
        state.step = 0;
        state.logic = 0;
        state.running = false;
        state.transcript = [];
        const mission = currentMission();
        state.operator = pick(mission.operatorPool);

        els.stageTitle.textContent = mission.title;
        els.stageBrief.textContent = mission.brief;
        els.missionCode.textContent = mission.code;
        els.readout.textContent = 'Awaiting operator ritual.';
        els.terminal.innerHTML = '';
        setLogic(0);
        renderSteps();
        setButtonText();
        show('stage');
        log(`KASTRO LABS // ${mission.code} // REALITY LOCK GREEN`, 'warn');
        log(`operator = ${state.operator}`, 'bone');
        log('network_io = 0; packets_harmed = 0; crimes = 0', 'muted');
        log(`mission = ${mission.title}`);
        toast(`${mission.title} loaded. Big yellow button armed.`);
    }

    function performStep() {
        if (state.running) return;
        const mission = currentMission();
        if (state.step >= mission.steps.length) return finishRun();

        state.running = true;
        document.body.classList.add('simulation-running');
        els.ritualButton.disabled = true;
        const stepIndex = state.step;
        const command = mission.buttons[stepIndex].toLowerCase().replaceAll(' ', '-');
        log(`> ${command}`, 'warn');
        els.readout.textContent = mission.readouts[stepIndex];
        toast(mission.readouts[stepIndex]);

        const bursts = [
            'rendering local pixels; no sockets opened',
            'cinematic layer responding with unnecessary confidence',
            'dramatic typing synthesised in memory',
            'reality lock remains green',
        ];
        bursts.forEach((line, index) => {
            setTimeout(() => log(`  ${line}`, index === 3 ? 'muted' : ''), 170 + index * 180);
        });

        setTimeout(() => {
            state.step += 1;
            setLogic((state.step / mission.steps.length) * 100);
            renderSteps();
            state.running = false;
            document.body.classList.remove('simulation-running');
            els.ritualButton.disabled = false;
            if (state.step >= mission.steps.length) {
                setButtonText();
                finishRun();
            } else {
                setButtonText();
            }
        }, 930);
    }

    function finishRun() {
        const mission = currentMission();
        state.step = mission.steps.length;
        setLogic(100);
        renderSteps();
        els.readout.textContent = `${mission.title}: complete. Reality untouched.`;
        log('> print-hacker-movie-report', 'warn');
        log('RESULT: planet dramatically handled in fiction only', 'bone');
        log('DAMAGE: 0 packets harmed', 'muted');
        els.reportOperator.textContent = state.operator;
        els.reportMission.textContent = mission.title;
        els.reportMethod.textContent = mission.method;
        els.reportVerdict.textContent = mission.verdict;
        els.reportTitle.textContent = `${mission.title} complete. Reality untouched.`;
        els.toastStack.innerHTML = '';
        setTimeout(() => show('report'), 760);
    }

    function resetAll() {
        state.step = 0;
        state.logic = 0;
        state.running = false;
        state.transcript = [];
        show('boot');
        toast('Cabinet reset. Reality still safe. Obviously.');
    }

    function reportText() {
        const mission = currentMission();
        return [
            '⚡ Kastro Labs // Hacker Movie Report ⚡',
            `Operator: ${state.operator}`,
            `Mission: ${mission.title}`,
            `Method: ${mission.method}`,
            'Damage: 0 packets harmed · 0 real targets · 0 crimes',
            `Verdict: ${mission.verdict}`,
            'Note: This was a harmless browser toy and screenshot ritual. No real targets, packets, secrets, or systems were touched.',
        ].join('\n');
    }

    async function copyText(text, success) {
        try {
            await navigator.clipboard.writeText(text);
            toast(success);
        } catch (err) {
            const ta = document.createElement('textarea');
            ta.value = text;
            document.body.appendChild(ta);
            ta.select();
            document.execCommand('copy');
            ta.remove();
            toast(success);
        }
    }

    function sizeCanvas(canvas) {
        const rect = canvas.getBoundingClientRect();
        const dpr = Math.min(2, window.devicePixelRatio || 1);
        canvas.width = Math.max(1, Math.floor(rect.width * dpr));
        canvas.height = Math.max(1, Math.floor(rect.height * dpr));
        const ctx = canvas.getContext('2d');
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        return { ctx, width: rect.width, height: rect.height };
    }

    function seedParticles() {
        state.particles = Array.from({ length: 140 }, () => ({
            x: Math.random(),
            y: Math.random(),
            s: .4 + Math.random() * 2.3,
            v: .18 + Math.random() * .88,
            h: Math.random(),
        }));
    }

    function drawAtmosphere() {
        const canvas = $('#atmosphere');
        const { ctx, width, height } = sizeCanvas(canvas);
        ctx.clearRect(0, 0, width, height);
        ctx.fillStyle = 'rgba(0,0,0,.08)';
        ctx.fillRect(0, 0, width, height);
        ctx.font = '13px ui-monospace, monospace';
        state.particles.forEach((p, index) => {
            p.y += p.v / Math.max(500, height);
            if (p.y > 1.05) { p.y = -.05; p.x = Math.random(); }
            const glyph = index % 17 === 0 ? 'HTP' : index % 11 === 0 ? '0' : index % 7 === 0 ? '1' : '·';
            ctx.fillStyle = index % 9 === 0 ? 'rgba(255,212,0,.45)' : 'rgba(124,255,139,.25)';
            ctx.fillText(glyph, p.x * width, p.y * height);
        });
        requestAnimationFrame(drawAtmosphere);
    }

    function drawPlanet() {
        const canvas = $('#planet-canvas');
        const { ctx, width, height } = sizeCanvas(canvas);
        state.t += .018;
        ctx.clearRect(0, 0, width, height);

        const cx = width / 2;
        const cy = height / 2;
        const r = Math.min(width, height) * .235;
        const mission = currentMission();
        const pulse = 1 + Math.sin(state.t * 4) * .025 + state.logic / 1000;

        ctx.fillStyle = '#050505';
        ctx.fillRect(0, 0, width, height);

        ctx.strokeStyle = 'rgba(255,212,0,.18)';
        ctx.lineWidth = 1;
        for (let x = -40; x < width + 40; x += 42) {
            ctx.beginPath(); ctx.moveTo(x + Math.sin(state.t + x) * 8, 0); ctx.lineTo(x - 60, height); ctx.stroke();
        }
        for (let y = 28; y < height; y += 42) {
            ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(width, y + Math.sin(state.t + y) * 8); ctx.stroke();
        }

        ctx.save();
        ctx.translate(cx, cy);
        ctx.scale(pulse, pulse);
        ctx.strokeStyle = 'rgba(247,240,216,.28)';
        ctx.lineWidth = 2;
        for (let i = -4; i <= 4; i += 1) {
            ctx.beginPath();
            ctx.ellipse(0, 0, r, Math.max(3, Math.abs(r * i / 4)), state.t * .65, 0, Math.PI * 2);
            ctx.stroke();
        }
        for (let i = 0; i < 9; i += 1) {
            const a = state.t * .7 + i * Math.PI / 9;
            ctx.beginPath();
            ctx.ellipse(0, 0, Math.abs(Math.cos(a)) * r, r, 0, 0, Math.PI * 2);
            ctx.stroke();
        }
        ctx.strokeStyle = '#ffd400';
        ctx.shadowColor = '#ffd400';
        ctx.shadowBlur = 20;
        ctx.lineWidth = 3;
        const arcs = 4 + Math.floor(state.logic / 18);
        for (let i = 0; i < arcs; i += 1) {
            const a = state.t * (1.2 + i * .03) + i * .86;
            const x1 = Math.cos(a) * r * .92;
            const y1 = Math.sin(a * 1.4) * r * .52;
            const x2 = Math.cos(a + 1.4) * r * .92;
            const y2 = Math.sin((a + 1.4) * 1.4) * r * .52;
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.quadraticCurveTo(Math.sin(a) * r * .35, -r * 1.15, x2, y2);
            ctx.stroke();
        }
        ctx.shadowBlur = 0;
        ctx.fillStyle = state.logic >= 100 ? '#7cff8b' : '#ffd400';
        ctx.beginPath();
        ctx.arc(0, 0, Math.max(8, r * .08 + state.logic * .11), 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        ctx.fillStyle = '#ffd400';
        ctx.font = '900 12px ui-monospace, monospace';
        ctx.fillText(`${mission.code} // ${mission.title.toUpperCase()}`, 18, height - 74);
        ctx.fillStyle = 'rgba(247,240,216,.72)';
        ctx.fillText('REAL TARGETS: 0', 18, height - 52);
        ctx.fillText('PACKETS HARMED: 0', 18, height - 32);
        requestAnimationFrame(drawPlanet);
    }

    function tickClock() {
        els.clock.textContent = `${new Date().toLocaleTimeString('en-GB', { timeZone: 'UTC', hour12: false })} UTC`;
    }

    function initEvents() {
        els.bootButton.addEventListener('click', () => { show('missions'); toast('Toy mainframe booted. Pick your fiction.'); });
        $$('.mission-card').forEach((card) => card.addEventListener('click', () => startMission(card.dataset.mission)));
        els.ritualButton.addEventListener('click', performStep);
        els.copyReport.addEventListener('click', () => copyText(reportText(), 'Report copied. Use irresponsibly only in fiction.'));
        els.copyLog.addEventListener('click', () => copyText(state.transcript.join('\n'), 'Operator transcript copied.'));
        els.newRun.addEventListener('click', () => { show('missions'); toast('Run archived in imagination. Choose again.'); });
        els.resetRun.addEventListener('click', resetAll);
    }

    function init() {
        seedParticles();
        initEvents();
        tickClock();
        setInterval(tickClock, 1000);
        drawAtmosphere();
        drawPlanet();
    }

    init();
})();
