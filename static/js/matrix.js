const chars = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEF';

export function initMatrix(canvas) {
    const ctx = canvas.getContext('2d');
    let columns = [];
    let w = 0, h = 0;
    const fontSize = 14;

    function resize() {
        const rect = canvas.parentElement.getBoundingClientRect();
        w = rect.width;
        h = rect.height;
        canvas.width = w;
        canvas.height = h;
        const colCount = Math.floor(w / fontSize);
        // preserve existing columns, add new ones
        while (columns.length < colCount) {
            columns.push(Math.random() * h / fontSize | 0);
        }
        columns.length = colCount;
    }

    resize();
    new ResizeObserver(resize).observe(canvas.parentElement);

    function draw() {
        ctx.fillStyle = 'rgba(10, 10, 10, 0.05)';
        ctx.fillRect(0, 0, w, h);

        ctx.font = fontSize + 'px monospace';

        for (let i = 0; i < columns.length; i++) {
            const ch = chars[Math.random() * chars.length | 0];
            const x = i * fontSize;
            const y = columns[i] * fontSize;

            // bright head character
            ctx.fillStyle = '#aaffaa';
            ctx.fillText(ch, x, y);

            // slightly dimmer trail
            if (columns[i] > 0) {
                const prevCh = chars[Math.random() * chars.length | 0];
                ctx.fillStyle = '#00ff41';
                ctx.fillText(prevCh, x, y - fontSize);
            }

            if (y > h && Math.random() > 0.975) {
                columns[i] = 0;
            }
            columns[i]++;
        }
        requestAnimationFrame(draw);
    }

    draw();
}
