document.querySelector('a-scene').addEventListener('loaded', function () {
    const character = document.querySelector('#my-character');
    
    // "C?u chì" an toàn: ??i ?nh t?i xong m?i làm gì thì làm
    character.addEventListener('materialtextureloaded', () => {
        console.log("?nh ?ã load xong, b?t ??u ch?y...");
        
        const material = character.getObject3D('mesh').material;
        if (!material.map) return;

        const COLS = 5;
        const ROWS = 7;
        let isAnimating = false;

        function setFrame(frameIndex) {
            const col = frameIndex % COLS;
            const row = Math.floor(frameIndex / COLS);
            material.map.repeat.set(1 / COLS, 1 / ROWS);
            material.map.offset.set(col / COLS, 1 - (row + 1) / ROWS);
            material.needsUpdate = true;
        }

        async function playAnimation(startFrame, endFrame, fps) {
            if (isAnimating) return;
            isAnimating = true;
            for (let i = startFrame; i <= endFrame; i++) {
                setFrame(i);
                await new Promise(resolve => setTimeout(resolve, 1000 / fps));
            }
            isAnimating = false;
            playDefaultLoop();
        }

        let defaultFrame = 25;
        function playDefaultLoop() {
            if (isAnimating) return;
            setFrame(defaultFrame);
            defaultFrame++;
            if (defaultFrame > 34) defaultFrame = 25;
            setTimeout(playDefaultLoop, 100); 
        }

        // B?t ??u ch?y vòng l?p Default
        playDefaultLoop();

        // S? ki?n click ?? nh?y
        window.addEventListener('click', () => {
            playAnimation(0, 24, 15);
        });
    });
});