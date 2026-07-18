const character = document.querySelector('#my-character');
const material = character.getObject3D('mesh').material;

// C?u hình sprite
const COLS = 5;
const ROWS = 7;
let isAnimating = false; // Bi?n "Khóa" ?? ch?n spam

// Hàm c?p nh?t frame
function setFrame(frameIndex) {
    const col = frameIndex % COLS;
    const row = Math.floor(frameIndex / COLS);
    
    // T? l? c?t
    material.map.repeat.set(1 / COLS, 1 / ROWS);
    // V? trí c?t (Công th?c chu?n cho UV map)
    material.map.offset.set(col / COLS, 1 - (row + 1) / ROWS);
    material.needsUpdate = true;
}

// Hàm ch?y Animation
async function playAnimation(startFrame, endFrame, fps) {
    if (isAnimating) return; // N?u ?ang ch?y thì ch?n l?nh m?i (Ch?ng spam)
    isAnimating = true;

    for (let i = startFrame; i <= endFrame; i++) {
        setFrame(i);
        await new Promise(resolve => setTimeout(resolve, 1000 / fps));
    }

    isAnimating = false; // M? khóa sau khi xong
    // T? ??ng quay v? tr?ng thái Default (25-34)
    playDefaultLoop();
}

// Ch?y vòng l?p Default (Frame 25-34)
let defaultFrame = 25;
function playDefaultLoop() {
    if (isAnimating) return; // Không ch?y n?u ?ang nh?y
    setFrame(defaultFrame);
    defaultFrame++;
    if (defaultFrame > 34) defaultFrame = 25;
    setTimeout(playDefaultLoop, 100); 
}

// B?t ??u
playDefaultLoop();

// Gán s? ki?n cho màn hình (Ví d?: Click vào màn hình là nh?y)
window.addEventListener('click', () => {
    playAnimation(0, 24, 15); // Nh?y t? 0 ??n 24, t?c ?? 15fps
});