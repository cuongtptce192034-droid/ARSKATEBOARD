document.querySelector('a-scene').addEventListener('loaded', function () {
    const character = document.querySelector('#my-character');
    
    // ??i texture t?i xong ?? tránh l?i "nhân v?t tàng hình" [8, 9]
    character.addEventListener('materialtextureloaded', () => {
        const material = character.getObject3D('mesh').material;
        const COLS = 5;
        const ROWS = 7;
        
        let isJumping = false; // "C?u chì" ch?ng spam animation [10]
        let currentFrame = 25;
        let lastTime = 0;
        const fps = 10; // T?c ?? ho?t ?nh m?c ??nh
        const frameInterval = 1000 / fps;

        // Hàm ??t khung hình chính xác trên l??i [8, 11, 12]
        function setFrame(index) {
            const col = index % COLS;
            const row = Math.floor(index / COLS);
            material.map.repeat.set(1 / COLS, 1 / ROWS);
            // Three.js texture b?t ??u t? góc trái d??i [13]
            material.map.offset.set(col / COLS, 1 - (row + 1) / ROWS);
        }

        // Vòng l?p Default m??t mà b?ng requestAnimationFrame [14, 15]
        function animate(time) {
            if (!isJumping) {
                const delta = time - lastTime;
                if (delta > frameInterval) {
                    setFrame(currentFrame);
                    currentFrame = currentFrame >= 34 ? 25 : currentFrame + 1;
                    lastTime = time;
                }
            }
            requestAnimationFrame(animate);
        }

        // Tr?ng thái Jump (frame 0-24) s? d?ng async ?? khóa spam [7, 16]
        async function playJump() {
            if (isJumping) return;
            isJumping = true;
            
            for (let i = 0; i <= 24; i++) {
                setFrame(i);
                await new Promise(r => setTimeout(r, 60)); // T?c ?? nh?y nhanh h?n
            }
            
            isJumping = false;
        }

        // L?ng nghe click qua cursor [3]
        character.addEventListener('click', playJump);

        // --- Logic Zoom t??ng tác cao [17, 18] ---
        let scaleVal = 1.5;
        
        // Zoom chu?t (Desktop)
        window.addEventListener('wheel', (e) => {
            scaleVal += e.deltaY * -0.001;
            scaleVal = Math.min(Math.max(0.5, scaleVal), 4);
            character.setAttribute('scale', `${scaleVal} ${scaleVal} ${scaleVal}`);
        });

        // Zoom ?a ?i?m (Mobile - Pinch Zoom) [17, 19]
        let initialDist = 0;
        window.addEventListener('touchstart', (e) => {
            if (e.touches.length === 2) {
                initialDist = Math.hypot(
                    e.touches.pageX - e.touches[20].pageX,
                    e.touches.pageY - e.touches[20].pageY
                );
            }
        });

        window.addEventListener('touchmove', (e) => {
            if (e.touches.length === 2 && initialDist > 0) {
                const currentDist = Math.hypot(
                    e.touches.pageX - e.touches[20].pageX,
                    e.touches.pageY - e.touches[20].pageY
                );
                const zoomFactor = currentDist / initialDist;
                scaleVal = Math.min(Math.max(0.5, scaleVal * zoomFactor), 4);
                character.setAttribute('scale', `${scaleVal} ${scaleVal} ${scaleVal}`);
                initialDist = currentDist;
            }
        });

        requestAnimationFrame(animate);
    });
});