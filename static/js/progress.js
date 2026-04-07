export function initProgress(container) {
    const bars = {};

    return function onProgress(data) {
        let item = bars[data.id];

        if (!item) {
            item = document.createElement('div');
            item.className = 'progress-item';
            item.innerHTML =
                '<div class="progress-label">' +
                    '<span class="progress-name"></span>' +
                    '<span class="progress-pct"></span>' +
                '</div>' +
                '<div class="progress-bar"><div class="progress-fill"></div></div>';
            container.appendChild(item);
            bars[data.id] = item;
        }

        item.querySelector('.progress-name').textContent = data.label;
        item.querySelector('.progress-pct').textContent = Math.floor(data.percent) + '%';
        item.querySelector('.progress-fill').style.width = Math.min(data.percent, 100) + '%';

        if (data.done) {
            item.classList.add('done');
            item.querySelector('.progress-pct').textContent = 'COMPLETE';
            setTimeout(() => {
                item.classList.remove('done');
            }, 1000);
        }
    };
}
