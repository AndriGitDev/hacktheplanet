const ACHIEVEMENTS = {
    start: ['MAINFRAME VIBES ACQUIRED', 'You pushed the big cinematic button. Bold.'],
    screenshot: ['SCREENSHOT BAIT READY', 'Animations paused just enough for social proof.'],
    boss: ['MANAGER PROXIMITY DETECTED', 'Quarterly infrastructure hygiene camouflage enabled.'],
    theme: ['AESTHETIC SWITCHER', 'The hacker movie now has lighting direction.'],
    disclaimer: ['I READ THE DISCLAIMER', 'Security culture begins with not pretending toys are weapons.'],
};

function slugCodename(value) {
    return (value || 'NO-PACKETS-HARMED')
        .toUpperCase()
        .replace(/[^A-Z0-9 -]/g, '')
        .replace(/\s+/g, '-')
        .slice(0, 28) || 'NO-PACKETS-HARMED';
}

export function setupExperience({ onStart }) {
    const body = document.body;
    const hackBtn = document.getElementById('hack-btn');
    const screenshotBtn = document.getElementById('screenshot-mode');
    const bossBtn = document.getElementById('boss-mode');
    const exitBossBtn = document.getElementById('exit-boss');
    const aboutBtn = document.getElementById('about-toggle');
    const aboutModal = document.getElementById('about-modal');
    const codenameInput = document.getElementById('codename-input');
    const shareOverlay = document.getElementById('share-overlay');
    const bossScreen = document.getElementById('boss-screen');
    const achievementStack = document.getElementById('achievement-stack');
    const themeChips = [...document.querySelectorAll('[data-theme-choice]')];

    const params = new URLSearchParams(window.location.search);
    const initialTheme = params.get('mode') || 'vhs';
    const initialCodename = slugCodename(params.get('codename') || codenameInput.value);

    function toast(key) {
        const [title, copy] = ACHIEVEMENTS[key] || ACHIEVEMENTS.start;
        const item = document.createElement('div');
        item.className = 'achievement';
        item.innerHTML = `<span>ACHIEVEMENT UNLOCKED</span><strong>${title}</strong><em>${copy}</em>`;
        achievementStack.appendChild(item);
        setTimeout(() => item.classList.add('visible'), 20);
        setTimeout(() => {
            item.classList.remove('visible');
            setTimeout(() => item.remove(), 350);
        }, 4200);
    }

    function applyTheme(theme) {
        body.dataset.theme = theme;
        themeChips.forEach(chip => chip.classList.toggle('active', chip.dataset.themeChoice === theme));
    }

    function updateShareUrl() {
        const url = new URL(window.location.href);
        url.searchParams.set('mode', body.dataset.theme || 'vhs');
        url.searchParams.set('codename', slugCodename(codenameInput.value).toLowerCase());
        history.replaceState(null, '', url);
    }

    applyTheme(initialTheme);
    codenameInput.value = initialCodename;
    updateShareUrl();

    codenameInput.addEventListener('input', () => {
        codenameInput.value = slugCodename(codenameInput.value);
        updateShareUrl();
    });

    themeChips.forEach(chip => chip.addEventListener('click', () => {
        applyTheme(chip.dataset.themeChoice);
        updateShareUrl();
        toast('theme');
    }));

    hackBtn.addEventListener('click', () => {
        toast('start');
        onStart({ codename: slugCodename(codenameInput.value), theme: body.dataset.theme || 'vhs' });
    });

    screenshotBtn.addEventListener('click', async () => {
        body.classList.toggle('screenshot-ready');
        shareOverlay.hidden = !body.classList.contains('screenshot-ready');
        screenshotBtn.textContent = body.classList.contains('screenshot-ready') ? 'Exit screenshot mode' : 'Screenshot mode';
        toast('screenshot');
        updateShareUrl();
        if (navigator.clipboard && body.classList.contains('screenshot-ready')) {
            try { await navigator.clipboard.writeText(window.location.href); } catch (_) { /* non-critical */ }
        }
    });

    bossBtn.addEventListener('click', () => {
        bossScreen.hidden = false;
        toast('boss');
    });

    exitBossBtn.addEventListener('click', () => {
        bossScreen.hidden = true;
    });

    aboutBtn.addEventListener('click', () => {
        if (aboutModal?.showModal) aboutModal.showModal();
        else aboutModal.setAttribute('open', '');
        toast('disclaimer');
    });

    document.addEventListener('keydown', (event) => {
        if (event.key.toLowerCase() === 'b') bossScreen.hidden = !bossScreen.hidden;
        if (event.key.toLowerCase() === 's') screenshotBtn.click();
        if (event.key === 'Escape') {
            bossScreen.hidden = true;
            if (body.classList.contains('screenshot-ready')) screenshotBtn.click();
        }
    });

    return {
        getCodename: () => slugCodename(codenameInput.value),
        setRunning(isRunning) {
            hackBtn.disabled = isRunning;
            hackBtn.classList.toggle('running', isRunning);
        },
    };
}
