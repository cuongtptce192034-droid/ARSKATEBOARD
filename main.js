document.addEventListener('DOMContentLoaded', () => {
    const char = document.querySelector('#char');
    const btnZoomIn = document.querySelector('#btn-zoom-in');
    const btnZoomOut = document.querySelector('#btn-zoom-out');
    
    // G?i ID ?nh ?ã ???c preload, ch?ng ?? tuy?t ??i
    const idleFrames = [
        '#idle_1', '#idle_2', '#idle_3', '#idle_4', '#idle_5',
        '#idle_6', '#idle_7', '#idle_8', '#idle_9', '#idle_10'
    ];
    
    const jumpFrames = [
        '#jump_1', '#jump_2', '#jump_3', '#jump_4', '#jump_5',
        '#jump_6', '#jump_7', '#jump_8', '#jump_9', '#jump_10',
        '#jump_11', '#jump_12', '#jump_13', '#jump_14', '#jump_15',
        '#jump_16', '#jump_17', '#jump_18', '#jump_19', '#jump_20',
        '#jump_21', '#jump_22', '#jump_23', '#jump_24', '#jump_25'
    ];
    
    let isJumping = false;
    let frameIndex = 0;

    // 1. Ch?y Animation Idle (T?ng t?c ?? l?i v? 150ms vì ?nh ?ã preload m??t r?i)
    setInterval(() => {
        if (!isJumping) {
            frameIndex = (frameIndex + 1) % idleFrames.length;
            char.setAttribute('src', idleFrames[frameIndex]);
        }
    }, 150); 

    // 2. Ch?c n?ng Nh?y
    char.addEventListener('click', () => {
        if (isJumping) return;
        isJumping = true;
        let jumpStep = 0;

        const jumpInterval = setInterval(() => {
            char.setAttribute('src', jumpFrames[jumpStep]);
            jumpStep++;
            if (jumpStep >= jumpFrames.length) {
                clearInterval(jumpInterval);
                setTimeout(() => { isJumping = false; }, 2000); 
            }
        }, 100); 
    });

    // 3. Ch?c n?ng Zoom in / Zoom out
    let currentScale = 1; // T? l? g?c
    
    btnZoomIn.addEventListener('click', () => {
        currentScale += 0.3; // M?i l?n b?m t?ng 30%
        char.setAttribute('scale', `${currentScale} ${currentScale} ${currentScale}`);
    });

    btnZoomOut.addEventListener('click', () => {
        currentScale -= 0.3; // M?i l?n b?m gi?m 30%
        if (currentScale < 0.4) currentScale = 0.4; // Không cho thu nh? quá m?c bi?n m?t
        char.setAttribute('scale', `${currentScale} ${currentScale} ${currentScale}`);
    });
});