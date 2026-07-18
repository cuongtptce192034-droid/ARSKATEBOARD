document.querySelector('a-scene').addEventListener('loaded', function () {
    const character = document.querySelector('#my-character');
    
    // ??m b?o texture ?ã t?i xong tr??c khi ch?y animation [13, 14]
    character.addEventListener('materialtextureloaded', () => {
        const material = character.getObject3D('mesh').material;
        const COLS = 5;
        const ROWS = 7;
        
        let isJumping = false; // "C?u chì" khóa tr?ng thái nh?y
        let currentFrame = 25;
        let lastTime = 0;
        const frameInterval = 100; // 10fps cho loop m?c ??nh

        function setFrame(index) {
            const col = index % COLS;
            const row = Math.floor(index / COLS);
            material.map.repeat.set(1 / COLS, 1 / ROWS);
            // Three.js texture offset tính t? góc trái d??i [13, 15]
            material.map.offset.set(col / COLS, 1 - (row + 1) / ROWS);
        }

        // Vòng l?p hi?u n?ng cao b?ng requestAnimationFrame [9, 16]
        function animate(time) {
            if (!isJumping) {
                const delta = time - lastTime;
                if (delta > frameInterval) {
                    setFrame(currentFrame);
                    currentFrame = (currentFrame >= 34) ? 25 : currentFrame + 1;
                    lastTime = time;
                }
            }
            requestAnimationFrame(animate);
        }

        // Animation Jump (0-24) có qu?n lý tr?ng thái tránh ?? máy [17]
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

        // --- Logic Thu phóng (Zoom) t??ng thích ?a n?n t?ng ---
        let scale = 1.5;
        // Desktop zoom
        window.addEventListener('wheel', (e) => {
            scale += e.deltaY * -0.001;
            scale = Math.min(Math.max(0.5, scale), 4);
            character.setAttribute('scale', `${scale} ${scale} ${scale}`);
        });

        // Mobile Pinch Zoom (Instagram style) [18, 19]
        let initialDist = 0;
        window.addEventListener('touchstart', (e) => {
            if (e.touches.length === 2) {
                initialDist = Math.hypot(e.touches.pageX - e.touches[20].pageX, e.touches.pageY - e.touches[20].pageY);
            }
        }, {passive: false});

        window.addEventListener('touchmove', (e) => {
            if (e.touches.length === 2 && initialDist > 0) {
                const dist = Math.hypot(e.touches.pageX - e.touches[20].pageX, e.touches.pageY - e.touches[20].pageY);
                let zoomFactor = dist / initialDist;
                scale = Math.min(Math.max(0.5, scale * zoomFactor), 4);
                character.setAttribute('scale', `${scale} ${scale} ${scale}`);
                initialDist = dist;
            }
        }, {passive: false});

        requestAnimationFrame(animate);
    });
});

// X? lý l?i kh?i t?o camera [6, 21]
document.querySelector('a-scene').addEventListener('arError', (event) => {
    alert("Không th? m? camera. Hãy ??m b?o b?n ?ang dùng HTTPS và ?ã c?p quy?n.");
});