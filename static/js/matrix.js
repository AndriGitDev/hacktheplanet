const chars = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEFabcdef{}[]<>=/\\|;:\'\"!@#$%^&*()';

export function initMatrix(canvas) {
    const ctx = canvas.getContext('2d');
    let columns = [];
    let w = 0, h = 0;
    const fontSize = 13;
    const speed = 1.3;

    function resize() {
        const rect = canvas.parentElement.getBoundingClientRect();
        w = rect.width;
        h = rect.height;
        canvas.width = w;
        canvas.height = h;
        const colCount = Math.floor(w / fontSize);
        while (columns.length < colCount) {
            columns.push({
                y: Math.random() * h / fontSize | 0,
                speed: 0.5 + Math.random() * 1.0,
                chars: [],
            });
        }
        columns.length = colCount;
    }

    resize();
    new ResizeObserver(resize).observe(canvas.parentElement);

    function draw() {
        // fade with slight green tint for richer trails
        ctx.fillStyle = 'rgba(6, 10, 15, 0.06)';
        ctx.fillRect(0, 0, w, h);

        for (let i = 0; i < columns.length; i++) {
            const col = columns[i];
            const ch = chars[Math.random() * chars.length | 0];
            const x = i * fontSize;
            const y = col.y * fontSize;

            // white-hot head character
            ctx.font = `bold ${fontSize}px monospace`;
            ctx.fillStyle = '#ffffff';
            ctx.shadowColor = '#00ff41';
            ctx.shadowBlur = 15;
            ctx.fillText(ch, x, y);

            // bright green second character
            ctx.font = `${fontSize}px monospace`;
            ctx.shadowBlur = 8;
            ctx.fillStyle = '#00ff41';
            if (col.y > 1) {
                const ch2 = chars[Math.random() * chars.length | 0];
                ctx.fillText(ch2, x, y - fontSize);
            }

            // medium green trail characters
            ctx.shadowBlur = 3;
            ctx.fillStyle = '#00cc33';
            if (col.y > 2) {
                const ch3 = chars[Math.random() * chars.length | 0];
                ctx.fillText(ch3, x, y - fontSize * 2);
            }

            ctx.shadowBlur = 0;

            // randomly switch some trailing chars to dim
            if (Math.random() > 0.95 && col.y > 3) {
                ctx.fillStyle = 'rgba(0, 80, 20, 0.5)';
                const ch4 = chars[Math.random() * chars.length | 0];
                ctx.fillText(ch4, x, y - fontSize * (3 + Math.random() * 5 | 0));
            }

            col.y += col.speed * speed;

            if (col.y * fontSize > h + fontSize * 10 && Math.random() > 0.98) {
                col.y = -Math.random() * 20 | 0;
                col.speed = 0.5 + Math.random() * 1.0;
            }
        }
        requestAnimationFrame(draw);
    }

    draw();
}
