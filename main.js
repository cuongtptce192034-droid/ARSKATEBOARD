document.addEventListener('DOMContentLoaded', () => {
    const char = document.querySelector('#char');
    
    // Danh sách 10 ảnh Default (1-10)
    const idleFrames = [];
    for(let i = 1; i <= 10; i++) {
        idleFrames.push(`./default/Untitled_Artwork-${i}.png`);
    }
    
    // Danh sách 25 ảnh Jump (1-25)
    const jumpFrames = [];
    for(let i = 1; i <= 25; i++) {
        jumpFrames.push(`./jump/Untitled_Artwork-${i}.png`);
    }
    
    let isJumping = false;
    let frameIndex = 0;

    // Animation Default chạy tuần hoàn
    setInterval(() => {
        if (!isJumping) {
            frameIndex = (frameIndex + 1) % idleFrames.length;
            char.setAttribute('src', idleFrames[frameIndex]);
        }
    }, 150); 

    // Sự kiện nhấn vào nhân vật
    char.addEventListener('click', () => {
        if (isJumping) return; 

        isJumping = true;
        let jumpStep = 0;

        const jumpInterval = setInterval(() => {
            char.setAttribute('src', jumpFrames[jumpStep]);
            jumpStep++;
            if (jumpStep >= jumpFrames.length) {
                clearInterval(jumpInterval);
                setTimeout(() => {
                    isJumping = false;
                }, 2000); // Chống spam 2 giây
            }
        }, 100); 
    });
});