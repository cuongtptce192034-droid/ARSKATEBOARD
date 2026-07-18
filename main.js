document.querySelector('a-scene').addEventListener('loaded', function () {
    const character = document.querySelector('#my-character');
    const btnPlus = document.querySelector('#btn-plus');
    const btnMinus = document.querySelector('#btn-minus');
    
    // ??i texture load xong m?i x? lý ?? tránh l?i tàng hình
    character.addEventListener('materialtextureloaded', () => {
        const material = character.getObject3D('mesh').material;
        const COLS = 5, ROWS = 7;
        let isJumping = false; // C? ch? ch?ng spam
        let currentFrame = 25;
        let scale = 1.5;

        function setFrame(frameIndex) {
            const col = frameIndex % COLS;
            const row = Math.floor(frameIndex / COLS);
            material.map.repeat.set(1 / COLS, 1 / ROWS);
            material.map.offset.set(col / COLS, 1 - (row + 1) / ROWS);
            material.needsUpdate = true;
        }

        // Logic Nh?y (Ch?ng spam)
        async function playJump() {
            if (isJumping) return; // N?u ?ang nh?y, b? qua m?i l?nh m?i
            isJumping = true;
            for (let i = 0; i <= 24; i++) {
                setFrame(i);
                await new Promise(r => setTimeout(r, 60));
            }
            isJumping = false; // Xong hành ??ng thì m? khóa
        }

        // Vòng l?p m?c ??nh
        function playDefaultLoop() {
            if (!isJumping) {
                setFrame(currentFrame);
                currentFrame = (currentFrame >= 34) ? 25 : currentFrame + 1;
            }
            setTimeout(playDefaultLoop, 100);
        }

        playDefaultLoop();

        // X? lý t??ng tác
        character.addEventListener('click', playJump);

        // Logic Zoom
        btnPlus.addEventListener('click', () => {
            scale = Math.min(scale + 0.2, 4);
            character.setAttribute('scale', `${scale} ${scale} ${scale}`);
        });

        btnMinus.addEventListener('click', () => {
            scale = Math.max(scale - 0.2, 0.5);
            character.setAttribute('scale', `${scale} ${scale} ${scale}`);
        });
    });
});