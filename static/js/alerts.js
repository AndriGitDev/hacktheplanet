const MAX_ALERTS = 12;

export function initAlerts(container, flashEl) {
    let count = 0;

    return function onAlert(data) {
        const item = document.createElement('div');
        item.className = 'alert-item ' + data.severity;

        const time = new Date().toLocaleTimeString('en-US', { hour12: false });
        item.textContent = '[' + time + '] ' + data.text;

        container.appendChild(item);
        count++;

        while (count > MAX_ALERTS) {
            container.removeChild(container.firstChild);
            count--;
        }

        container.scrollTop = container.scrollHeight;

        // screen flash on critical
        if (data.severity === 'critical') {
            flashEl.style.background = 'rgba(255, 0, 64, 0.3)';
            flashEl.classList.remove('flash');
            void flashEl.offsetWidth; // reflow
            flashEl.classList.add('flash');
        }
    };
}
