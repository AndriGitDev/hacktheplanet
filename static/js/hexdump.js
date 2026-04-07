const MAX_LINES = 200;

export function initHexDump(container) {
    let lineCount = 0;

    return function onHex(data) {
        const line = document.createElement('div');
        line.className = 'hex-line';
        line.innerHTML =
            '<span class="hex-offset">' + data.offset + '</span>  ' +
            data.hex +
            '<span class="hex-ascii">' + escapeHtml(data.ascii) + '</span>';
        container.appendChild(line);
        lineCount++;

        if (lineCount > MAX_LINES) {
            container.removeChild(container.firstChild);
            lineCount--;
        }

        container.scrollTop = container.scrollHeight;
    };
}

function escapeHtml(s) {
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
