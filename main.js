document.querySelector('a-scene').addEventListener('loaded', function () {
    const character = document.querySelector('#my-character');
    
    character.addEventListener('materialtextureloaded', () => {
        const material = character.getObject3D('mesh').material;
        const COLS = 5;
        const ROWS = 7;
        let isAnimating = false;

        function setFrame(frameIndex) {
            const col = frameIndex % COLS;
            const row = Math.floor(frameIndex / COLS);
            material.map.repeat.set(1 / COLS, 1 / ROWS);
            material.map.offset.set(col / COLS, 1 - (row + 1) / ROWS);
            material.needsUpdate = true;
        }

        async function playAnimation(startFrame, endFrame, fps) {
            if (isAnimating) return;
            isAnimating = true;
            for (let i = startFrame; i <= endFrame; i++) {
                setFrame(i);
                await new Promise(r => setTimeout(r, 1000 / fps));
            }
            isAnimating = false;
            playDefaultLoop();
        }

        function playDefaultLoop() {
            let frame = 25;
            setInterval(() => {
                if (!isAnimating) {
                    setFrame(frame);
                    frame++;
                    if (frame > 34) frame = 25;
                }
            }, 100);
        }

        playDefaultLoop();

        // Nh?y khi nh?n vào nhân v?t
        character.addEventListener('click', () => {
            playAnimation(0, 24, 15);
        });
    });
});