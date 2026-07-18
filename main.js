document.addEventListener('DOMContentLoaded', () => {
    const char = document.querySelector('#char');
    
    // Liệt kê thủ công 10 ảnh Default
    const idleFrames = [
        './default/Untitled_Artwork-1.png', './default/Untitled_Artwork-2.png', './default/Untitled_Artwork-3.png',
        './default/Untitled_Artwork-4.png', './default/Untitled_Artwork-5.png', './default/Untitled_Artwork-6.png',
        './default/Untitled_Artwork-7.png', './default/Untitled_Artwork-8.png', './default/Untitled_Artwork-9.png',
        './default/Untitled_Artwork-10.png'
    ];
    
    // Liệt kê thủ công 25 ảnh Jump
    const jumpFrames = [
        './jump/Untitled_Artwork-1.png', './jump/Untitled_Artwork-2.png', './jump/Untitled_Artwork-3.png',
        './jump/Untitled_Artwork-4.png', './jump/Untitled_Artwork-5.png', './jump/Untitled_Artwork-6.png',
        './jump/Untitled_Artwork-7.png', './jump/Untitled_Artwork-8.png', './jump/Untitled_Artwork-9.png',
        './jump/Untitled_Artwork-10.png', './jump/Untitled_Artwork-11.png', './jump/Untitled_Artwork-12.png',
        './jump/Untitled_Artwork-13.png', './jump/Untitled_Artwork-14.png', './jump/Untitled_Artwork-15.png',
        './jump/Untitled_Artwork-16.png', './jump/Untitled_Artwork-17.png', './jump/Untitled_Artwork-18.png',
        './jump/Untitled_Artwork-19.png', './jump/Untitled_Artwork-20.png', './jump/Untitled_Artwork-21.png',
        './jump/Untitled_Artwork-22.png', './jump/Untitled_Artwork-23.png', './jump/Untitled_Artwork-24.png',
        './jump/Untitled_Artwork-25.png'
    ];
    
    let isJumping = false;
    let frameIndex = 0;

    // Chạy loop Idle
    setInterval(() => {
        if (!isJumping) {
            frameIndex = (frameIndex + 1) % idleFrames.length;
            char.setAttribute('src', idleFrames[frameIndex]);
        }
    }, 200); // Tăng lên 200ms để điện thoại tải ảnh kịp, tránh đơ

    char.addEventListener('click', () => {
        if (isJumping) return;
        isJumping = true;
        let jumpStep = 0;

        const jumpInterval = setInterval(() => {
            char.setAttribute('src', jumpFrames[jumpStep]);
            jumpStep++;
            if (jumpStep >= jumpFrames.length) {
                clearInterval(jumpInterval);
                setTimeout(() => { isJumping = false; }, 1000);
            }
        }, 80); // Chạy nhanh hơn để animation nhảy mượt
    });
});