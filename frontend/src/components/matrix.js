document.addEventListener('DOMContentLoaded', () => {
    const matrixBackground = document.querySelector('.matrix-background');

    if (matrixBackground) {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        matrixBackground.appendChild(canvas);

        const columns = Math.floor(canvas.width / 20) + 1;
        const drops = [];

        for (let x = 0; x < columns; x++) {
            drops[x] = 1;
        }

        function draw() {
            context.fillStyle = 'rgba(0, 0, 0, 0.05)';
            context.fillRect(0, 0, canvas.width, canvas.height);

            context.fillStyle = '#0F0';
            context.font = '15pt monospace';

            for (let i = 0; i < drops.length; i++) {
                const text = String.fromCharCode(Math.random() * 128);
                context.fillText(text, i * 20, drops[i] * 20);

                if (drops[i] * 20 > canvas.height || Math.random() > 0.975) {
                    drops[i] = 0;
                }

                drops[i]++;
            }
        }

        setInterval(draw, 33);
    }
});
