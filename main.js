document.querySelector('a-scene').addEventListener('loaded', () => {
    const character = document.querySelector('#my-character');
    
    // C?u chì: Ch? ?nh load xong
    character.addEventListener('materialtextureloaded', () => {
        const material = character.getObject3D('mesh').material;
        const COLS = 5, ROWS = 7;
        let isAnimating = false, scale = 2;

        function setFrame(f) {
            const col = f % COLS, row = Math.floor(f / COLS);
            material.map.repeat.set(1/COLS, 1/ROWS);
            material.map.offset.set(col/COLS, 1 - (row+1)/ROWS);
            material.needsUpdate = true;
        }

        async function playJump() {
            if (isAnimating) return;
            isAnimating = true;
            for (let i = 0; i <= 24; i++) {
                setFrame(i);
                await new Promise(r => setTimeout(r, 60));
            }
            isAnimating = false;
        }

        // Vòng l?p m?c ??nh (Idle)
        let frame = 25;
        setInterval(() => {
            if (!isAnimating) {
                setFrame(frame);
                frame = (frame >= 34) ? 25 : frame + 1;
            }
        }, 100);

        // Click ?? nh?y
        character.addEventListener('click', playJump);

        // Zoom b?ng cu?n chu?t/c?m ?ng 2 ngón
        window.addEventListener('wheel', (e) => {
            scale -= e.deltaY * 0.001;
            scale = Math.min(Math.max(scale, 0.5), 5);
            character.setAttribute('scale', `${scale} ${scale} ${scale}`);
        });
    });
});