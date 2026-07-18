document.querySelector('a-scene').addEventListener('loaded', function () {
    const scene = document.querySelector('a-scene');
    const character = document.querySelector('#my-character');
    const material = character.getObject3D('mesh').material;

    // ========== CẤU HÌNH SPRITE ==========
    const COLS = 5;
    const ROWS = 7;
    let isAnimating = false;
    let currentScale = 1.0;
    const MIN_SCALE = 0.5;
    const MAX_SCALE = 4.0;

    // ========== CẬP NHẬT STATUS ==========
    function updateStatus(statusMsg, animMsg) {
        document.getElementById('statusText').textContent = statusMsg;
        if (animMsg) document.getElementById('animText').textContent = animMsg;
    }

    // ========== SPRITE ANIMATION ==========
    function setFrame(frameIndex) {
        const col = frameIndex % COLS;
        const row = Math.floor(frameIndex / COLS);
        
        material.map.repeat.set(1 / COLS, 1 / ROWS);
        material.map.offset.set(col / COLS, 1 - (row + 1) / ROWS);
        material.needsUpdate = true;
    }

    async function playAnimation(startFrame, endFrame, fps, animName) {
        if (isAnimating) return; // Chống spam
        isAnimating = true;
        updateStatus('Animating', animName);

        for (let i = startFrame; i <= endFrame; i++) {
            setFrame(i);
            await new Promise(resolve => setTimeout(resolve, 1000 / fps));
        }

        isAnimating = false;
        playDefaultLoop();
    }

    // ========== IDLE LOOP (FRAME 25-34 VÔ HẠN) ==========
    let defaultFrame = 25;
    let idleLoop = null;
    
    function playDefaultLoop() {
        if (isAnimating) return;
        setFrame(defaultFrame);
        defaultFrame++;
        if (defaultFrame > 34) defaultFrame = 25;
        updateStatus('Idle', 'Frame ' + defaultFrame);
        idleLoop = setTimeout(playDefaultLoop, 100);
    }

    // ========== ZOOM CONTROL ==========
    function updateScale() {
        character.setAttribute('geometry', {
            primitive: 'plane',
            width: 1 * currentScale,
            height: 1 * currentScale
        });
        document.getElementById('zoomValue').textContent = currentScale.toFixed(1) + 'x';
        document.getElementById('scaleText').textContent = currentScale.toFixed(2);
    }

    document.getElementById('zoomIn').addEventListener('click', (e) => {
        e.stopPropagation();
        if (currentScale < MAX_SCALE) {
            currentScale = Math.min(currentScale + 0.1, MAX_SCALE);
            updateScale();
        }
    });

    document.getElementById('zoomOut').addEventListener('click', (e) => {
        e.stopPropagation();
        if (currentScale > MIN_SCALE) {
            currentScale = Math.max(currentScale - 0.1, MIN_SCALE);
            updateScale();
        }
    });

    // ========== CLICK ĐỂ JUMP (FRAME 0-24) ==========
    window.addEventListener('click', (e) => {
        // Bỏ qua khi bấm nút zoom
        if (e.target.id === 'zoomIn' || e.target.id === 'zoomOut') {
            return;
        }
        playAnimation(0, 24, 15, 'Jump');
    });

    // ========== SCENE EVENTS ==========
    scene.addEventListener('markerFound', () => {
        updateStatus('Marker Found', 'Starting Idle');
        if (idleLoop) clearTimeout(idleLoop);
        playDefaultLoop();
    });

    scene.addEventListener('markerLost', () => {
        if (idleLoop) clearTimeout(idleLoop);
        isAnimating = true;
        updateStatus('Marker Lost', 'Waiting...');
    });

    // ========== KHỞI ĐỘNG BAN ĐẦU ==========
    updateStatus('Initializing', 'Scan marker...');
    setTimeout(() => {
        updateStatus('Ready', 'Waiting for click');
        playDefaultLoop();
    }, 500);
});
