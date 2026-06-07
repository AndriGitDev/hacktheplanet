const ACHIEVEMENTS = {
    start: ['MAINFRAME VIBES ACQUIRED', 'You pushed the big cinematic button. Bold.'],
    screenshot: ['SCREENSHOT BAIT READY', 'Animations paused just enough for social proof.'],
    boss: ['MANAGER PROXIMITY DETECTED', 'Quarterly infrastructure hygiene camouflage enabled.'],
    share: ['SHARE LINK COPIED', 'A harmless simulator link is ready for the group chat.'],
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

export function setupExperience({ onStart, onWow }) {
    const body = document.body;
    const hackBtn = document.getElementById('hack-btn');
    const copyShareBtn = document.getElementById('copy-share');
    const screenshotBtn = document.getElementById('screenshot-mode');
    const bossBtn = document.getElementById('boss-mode');
    const exitBossBtn = document.getElementById('exit-boss');
    const aboutBtn = document.getElementById('about-toggle');
    const aboutModal = document.getElementById('about-modal');
    const codenameInput = document.getElementById('codename-input');
    const shareOverlay = document.getElementById('share-overlay');
    const shareUrl = document.getElementById('share-url');
    const shareCopyStatus = document.getElementById('share-copy-status');
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
        themeChips.forEach(chip => {
            const isActive = chip.dataset.themeChoice === theme;
            chip.classList.toggle('active', isActive);
            chip.setAttribute('aria-pressed', String(isActive));
        });
    }

    function isTypingTarget(target) {
        return target?.matches?.('input, textarea, select, [contenteditable="true"]');
    }

    function updateShareUrl() {
        const url = new URL(window.location.href);
        url.searchParams.set('mode', body.dataset.theme || 'vhs');
        url.searchParams.set('codename', slugCodename(codenameInput.value).toLowerCase());
        history.replaceState(null, '', url);
        if (shareUrl) shareUrl.textContent = url.href;
        return url.href;
    }

    async function copyShareLink({ showToast = true } = {}) {
        const url = updateShareUrl();
        let message = 'Share link ready. Copy it from screenshot mode if browser copy is blocked.';
        if (navigator.clipboard) {
            try {
                await navigator.clipboard.writeText(url);
                message = 'Share link copied. Toy interface only — no real targets.';
            } catch (_) {
                message = 'Share link ready; browser copy permission was blocked.';
            }
        }
        if (shareCopyStatus) shareCopyStatus.textContent = message;
        if (copyShareBtn) copyShareBtn.textContent = message.includes('copied') ? 'Link copied' : 'Copy share link';
        if (showToast) toast('share');
        if (copyShareBtn) setTimeout(() => { copyShareBtn.textContent = 'Copy share link'; }, 1800);
        return message;
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

    copyShareBtn.addEventListener('click', () => copyShareLink());

    screenshotBtn.addEventListener('click', async () => {
        body.classList.toggle('screenshot-ready');
        const isScreenshotReady = body.classList.contains('screenshot-ready');
        shareOverlay.hidden = !isScreenshotReady;
        screenshotBtn.textContent = isScreenshotReady ? 'Exit screenshot mode' : 'Screenshot mode';
        screenshotBtn.setAttribute('aria-pressed', String(isScreenshotReady));
        toast('screenshot');
        updateShareUrl();
        if (shareCopyStatus) {
            shareCopyStatus.textContent = isScreenshotReady
                ? 'Share link ready. Copy permission depends on your browser.'
                : 'Screenshot mode freezes the frame and copies the share link when allowed.';
        }
        if (isScreenshotReady) await copyShareLink({ showToast: false });
    });

    bossBtn.addEventListener('click', () => {
        bossScreen.hidden = false;
        bossBtn.setAttribute('aria-pressed', 'true');
        toast('boss');
    });

    exitBossBtn.addEventListener('click', () => {
        bossScreen.hidden = true;
        bossBtn.setAttribute('aria-pressed', 'false');
    });

    aboutBtn.addEventListener('click', () => {
        if (aboutModal?.showModal) aboutModal.showModal();
        else aboutModal.setAttribute('open', '');
        toast('disclaimer');
    });

    document.addEventListener('keydown', (event) => {
        if (isTypingTarget(event.target)) {
            if (event.key === 'Enter') hackBtn.click();
            if (event.key !== 'Escape') return;
        }
        if (event.key.toLowerCase() === 'b') {
            bossScreen.hidden = !bossScreen.hidden;
            bossBtn.setAttribute('aria-pressed', String(!bossScreen.hidden));
        }
        if (event.key.toLowerCase() === 'c') copyShareLink();
        if (event.key.toLowerCase() === 's') screenshotBtn.click();
        if (event.key.toLowerCase() === 'w') {
            onWow?.();
            toast('start');
        }
        if (event.key === 'Escape') {
            bossScreen.hidden = true;
            bossBtn.setAttribute('aria-pressed', 'false');
            if (body.classList.contains('screenshot-ready')) screenshotBtn.click();
        }
    });

    return {
        getCodename: () => slugCodename(codenameInput.value),
        setRunning(isRunning) {
            body.classList.toggle('simulation-running', isRunning);
            hackBtn.disabled = isRunning;
            hackBtn.classList.toggle('running', isRunning);
        },
    };
}
