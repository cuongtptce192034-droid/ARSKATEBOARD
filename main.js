document.querySelector('a-scene').addEventListener('loaded', function () {
    const character = document.querySelector('#my-character');
    const sceneEl = document.querySelector('a-scene');
    
    // 1. CH?N ?OÁN L?I NH?N DI?N AR
    sceneEl.addEventListener("arReady", (event) => {
        console.log("MindAR ?ã s?n sàng!");
    });

    sceneEl.addEventListener("arError", (event) => {
        alert("L?i camera: Hãy ??m b?o b?n ?ang dùng HTTPS và ?ã c?p quy?n truy c?p."); // [1]
    });

    const targetEl = document.querySelector('#target');
    targetEl.addEventListener("targetFound", event => {
        console.log("?ã tìm th?y m?c tiêu!");
        document.querySelector('#scanning-overlay').classList.add('hidden'); // [4]
    });

    targetEl.addEventListener("targetLost", event => {
        console.log("M?t d?u m?c tiêu!");
        document.querySelector('#scanning-overlay').classList.remove('hidden');
    });

    // 2. LOGIC SPRITESHEET (S? d?ng requestAnimationFrame ?? m??t h?n) [7, 8]
    character.addEventListener('materialtextureloaded', () => {
        const material = character.getObject3D('mesh').material;
        const COLS = 5;
        const ROWS = 7;
        let isJumping = false;
        let currentFrame = 25;
        let lastTime = 0;

        function setFrame(index) {
            const col = index % COLS;
            const row = Math.floor(index / COLS);
            material.map.repeat.set(1 / COLS, 1 / ROWS);
            material.map.offset.set(col / COLS, 1 - (row + 1) / ROWS); // [9]
        }

        function animate(time) {
            if (!isJumping) {
                const delta = time - lastTime;
                if (delta > 100) { // 10fps
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

        character.addEventListener('click', playJump);
        requestAnimationFrame(animate);
    });

    // 3. LOGIC ZOOM D?NG NÚT B?M (+, -)
    let scaleVal = 1.5;
    const step = 0.2; // M?i l?n b?m t?ng/gi?m 0.2

    document.getElementById('zoomIn').addEventListener('click', () => {
        scaleVal = Math.min(scaleVal + step, 5); // Phóng to t?i ?a 5 l?n
        character.setAttribute('scale', `${scaleVal} ${scaleVal} ${scaleVal}`);
    });

    document.getElementById('zoomOut').addEventListener('click', () => {
        scaleVal = Math.max(scaleVal - step, 0.5); // Thu nh? t?i thi?u 0.5 l?n
        character.setAttribute('scale', `${scaleVal} ${scaleVal} ${scaleVal}`);
    });
});