document.querySelector('a-scene').addEventListener('loaded', function () {
    const character = document.querySelector('#my-character');
    const btnPlus = document.querySelector('#btn-plus');
    const btnMinus = document.querySelector('#btn-minus');
    
    character.addEventListener('materialtextureloaded', () => {
        const material = character.getObject3D('mesh').material;
        const COLS = 5, ROWS = 7;
        let isJumping = false, currentFrame = 25, lastTime = 0;
        let scale = 1.5;

        // Logic Animation
        function setFrame(index) {
            const col = index % COLS;
            const row = Math.floor(index / COLS);
            material.map.repeat.set(1 / COLS, 1 / ROWS);
            material.map.offset.set(col / COLS, 1 - (row + 1) / ROWS);
        }

        function animate(time) {
            if (!isJumping) {
                if (time - lastTime > 100) {
                    setFrame(currentFrame);
                    currentFrame = (currentFrame >= 34) ? 25 : currentFrame + 1;
                    lastTime = time;
                }
            }
            requestAnimationFrame(animate);
        }

        async function playJump() {
            if (isJumping) return;
            isJumping = true;
            for (let i = 0; i <= 24; i++) {
                setFrame(i);
                await new Promise(r => setTimeout(r, 60)); 
            }
            isJumping = false;
        }

        // --- Logic Nút Zoom ---
        btnPlus.addEventListener('click', () => {
            scale = Math.min(scale + 0.2, 4);
            character.setAttribute('scale', `${scale} ${scale} ${scale}`);
        });

        btnMinus.addEventListener('click', () => {
            scale = Math.max(scale - 0.2, 0.5);
            character.setAttribute('scale', `${scale} ${scale} ${scale}`);
        });

        character.addEventListener('click', playJump);
        requestAnimationFrame(animate);
    });
});