document.querySelector('a-scene').addEventListener('loaded', function () {
    const character = document.querySelector('#my-character');
    const material = character.getObject3D('mesh').material;

    // C?u hình chu?n 5 c?t, 7 hàng
    const COLS = 5;
    const ROWS = 7;
    let isAnimating = false; // Khiên ch?ng spam

    function setFrame(frameIndex) {
        const col = frameIndex % COLS;
        const row = Math.floor(frameIndex / COLS);
        
        // T? l? c?t hình
        material.map.repeat.set(1 / COLS, 1 / ROWS);
        // V? trí c?t chu?n xác
        material.map.offset.set(col / COLS, 1 - (row + 1) / ROWS);
        material.needsUpdate = true;
    }

    async function playAnimation(startFrame, endFrame, fps) {
        if (isAnimating) return; // N?u ?ang nh?y thì ch?n l?nh m?i
        isAnimating = true;

        for (let i = startFrame; i <= endFrame; i++) {
            setFrame(i);
            await new Promise(resolve => setTimeout(resolve, 1000 / fps));
        }

        isAnimating = false; // M? khóa sau khi xong
        playDefaultLoop();
    }

    let defaultFrame = 25;
    function playDefaultLoop() {
        if (isAnimating) return; // Không ch?y default n?u ?ang nh?y
        setFrame(defaultFrame);
        defaultFrame++;
        if (defaultFrame > 34) defaultFrame = 25;
        setTimeout(playDefaultLoop, 100); 
    }

    // B?t ??u ch?y vòng l?p m?c ??nh
    playDefaultLoop();

    // S? ki?n click ?? nh?y
    window.addEventListener('click', () => {
        playAnimation(0, 24, 15);
    });
});