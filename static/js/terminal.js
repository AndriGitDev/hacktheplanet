const MAX_LINES = 60;
const TYPE_SPEED = 25; // ms per character

export function initTerminal(container) {
    let lineCount = 0;
    const queue = [];
    let typing = false;

    // persistent cursor element
    const cursor = document.createElement('span');
    cursor.className = 'cursor';

    function processQueue() {
        if (typing || queue.length === 0) return;
        typing = true;

        const { text, style } = queue.shift();
        const line = document.createElement('div');
        line.className = 'term-line ' + style;
        container.appendChild(line);
        line.appendChild(cursor);
        lineCount++;

        // trim old lines
        while (lineCount > MAX_LINES) {
            container.removeChild(container.firstChild);
            lineCount--;
        }

        let i = 0;
        function typeChar() {
            if (i < text.length) {
                line.insertBefore(document.createTextNode(text[i]), cursor);
                i++;
                container.scrollTop = container.scrollHeight;
                setTimeout(typeChar, TYPE_SPEED);
            } else {
                typing = false;
                container.scrollTop = container.scrollHeight;
                processQueue();
            }
        }
        typeChar();
    }

    return function onTerminal(data) {
        queue.push(data);
        processQueue();
    };
}
