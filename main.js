document.addEventListener('DOMContentLoaded', () => {
    const char = document.querySelector('#char');
    const btnZoomIn = document.querySelector('#btn-zoom-in');
    const btnZoomOut = document.querySelector('#btn-zoom-out');

    const idlePaths = Array.from({length: 10}, (_, i) => `./default/Untitled_Artwork-${i + 1}.png`);
    const jumpPaths = Array.from({length: 25}, (_, i) => `./jump/Untitled_Artwork-${i + 1}.png`);

    // HÀM PRELOAD: Ép trình duy?t n?p s?n ?nh vào RAM tr??c
    function preloadImages(paths) {
        paths.forEach(path => {
            const img = new Image();
            img.src = path;
        });
    }
    preloadImages([...idlePaths, ...jumpPaths]);

    let isJumping = false;
    let frameIndex = 0;

    // Animation ch?y m??t
    setInterval(() => {
        if (!isJumping) {
            frameIndex = (frameIndex + 1) % idlePaths.length;
            char.setAttribute('src', idlePaths[frameIndex]);
        }
    }, 150);

    // X? lý nh?y
    char.addEventListener('click', () => {
        if (isJumping) return;
        isJumping = true;
        let jumpStep = 0;

        const jumpInterval = setInterval(() => {
            char.setAttribute('src', jumpPaths[jumpStep]);
            jumpStep++;
            if (jumpStep >= jumpPaths.length) {
                clearInterval(jumpInterval);
                setTimeout(() => { isJumping = false; }, 500); 
            }
        }, 80);
    });

    // Zoom
    let scale = 1;
    btnZoomIn.addEventListener('click', () => { scale += 0.2; char.setAttribute('scale', `${scale} ${scale} ${scale}`); });
    btnZoomOut.addEventListener('click', () => { scale = Math.max(0.4, scale - 0.2); char.setAttribute('scale', `${scale} ${scale} ${scale}`); });
});