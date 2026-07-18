document.querySelector('a-scene').addEventListener('loaded', () => {
    const character = document.querySelector('#my-character');
    
    // T? ??ng ?n UI quét khi load xong
    document.querySelector('a-scene').addEventListener('arReady', () => {
        document.querySelector('#scanning-overlay').classList.add('hidden');
    });

    character.addEventListener('materialtextureloaded', () => {
        const material = character.getObject3D('mesh').material;
        // T?ng ?? sáng v?t li?u AR
        material.emissive = new THREE.Color(0xffffff);
        material.emissiveIntensity = 0.5;

        const COLS = 5, ROWS = 7;
        let isJumping = false, currentFrame = 25, scale = 1.5;

        function setFrame(f) {
            const col = f % COLS, row = Math.floor(f / COLS);
            material.map.repeat.set(1/COLS, 1/ROWS);
            material.map.offset.set(col/COLS, 1 - (row+1)/ROWS);
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

        function loop() {
            if (!isJumping) {
                setFrame(currentFrame);
                currentFrame = (currentFrame >= 34) ? 25 : currentFrame + 1;
            }
            setTimeout(loop, 100);
        }

        character.addEventListener('click', playJump);
        document.querySelector('#btn-plus').addEventListener('click', () => {
            scale = Math.min(scale + 0.2, 4);
            character.setAttribute('scale', `${scale} ${scale} ${scale}`);
        });
        document.querySelector('#btn-minus').addEventListener('click', () => {
            scale = Math.max(scale - 0.2, 0.5);
            character.setAttribute('scale', `${scale} ${scale} ${scale}`);
        });

        loop();
    });
});