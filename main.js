document.querySelector('a-scene').addEventListener('loaded', function () {
    const character = document.querySelector('#my-character');
    const material = character.getObject3D('mesh').material;

    // Cấu hình chuẩn 5 cột, 7 hàng
    const COLS = 5;
    const ROWS = 7;
    let isAnimating = false; // Khiên chống spam

    function setFrame(frameIndex) {
        const col = frameIndex % COLS;
        const row = Math.floor(frameIndex / COLS);
        
        // Tỉ lệ cắt hình
        material.map.repeat.set(1 / COLS, 1 / ROWS);
        // Vị trí cắt chuẩn xác
        material.map.offset.set(col / COLS, 1 - (row + 1) / ROWS);
        material.needsUpdate = true;
    }

    async function playAnimation(startFrame, endFrame, fps) {
        if (isAnimating) return; // Nếu đang nhảy thì chặn lệnh mới
        isAnimating = true;

        for (let i = startFrame; i <= endFrame; i++) {
            setFrame(i);
            await new Promise(resolve => setTimeout(resolve, 1000 / fps));
        }

        isAnimating = false; // Mở khóa sau khi xong
        playDefaultLoop();
    }

    let defaultFrame = 25;
    function playDefaultLoop() {
        if (isAnimating) return; // Không chạy default nếu đang nhảy
        setFrame(defaultFrame);
        defaultFrame++;
        if (defaultFrame > 34) defaultFrame = 25;
        setTimeout(playDefaultLoop, 100); 
    }

    // Bắt đầu chạy vòng lặp mặc định
    playDefaultLoop();

    // Sự kiện click để nhảy
    window.addEventListener('click', () => {
        playAnimation(0, 24, 15);
    });
});
