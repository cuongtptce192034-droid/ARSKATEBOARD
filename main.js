document.addEventListener('DOMContentLoaded', () => {
    const container = document.querySelector('#char-container');
    const hitbox = document.querySelector('#hitbox');
    const btnZoomIn = document.querySelector('#btn-zoom-in');
    const btnZoomOut = document.querySelector('#btn-zoom-out');
    
    const idleIds = ['#idle_1', '#idle_2', '#idle_3', '#idle_4', '#idle_5', '#idle_6', '#idle_7', '#idle_8', '#idle_9', '#idle_10'];
    const jumpIds = ['#jump_1', '#jump_2', '#jump_3', '#jump_4', '#jump_5', '#jump_6', '#jump_7', '#jump_8', '#jump_9', '#jump_10', '#jump_11', '#jump_12', '#jump_13', '#jump_14', '#jump_15', '#jump_16', '#jump_17', '#jump_18', '#jump_19', '#jump_20', '#jump_21', '#jump_22', '#jump_23', '#jump_24', '#jump_25'];
    
    const idleElements = [];
    const jumpElements = [];

    // T?o s?n 35 ?nh và ?N ?i toàn b?
    function createFrames(ids, arrayToStore) {
        ids.forEach(id => {
            const img = document.createElement('a-image');
            img.setAttribute('src', id);
            img.setAttribute('height', '2');
            img.setAttribute('width', '2');
            img.setAttribute('material', 'transparent: true; alphaTest: 0.5');
            img.setAttribute('visible', 'false'); 
            container.appendChild(img);
            arrayToStore.push(img);
        });
    }

    createFrames(idleIds, idleElements);
    createFrames(jumpIds, jumpElements);

    let isJumping = false;
    let frameIndex = 0;
    
    let currentActiveElement = idleElements[0];
    currentActiveElement.setAttribute('visible', 'true');

    // 1. Ch?y Animation Idle (T?t ?nh c?, M? ?nh m?i)
    setInterval(() => {
        if (!isJumping) {
            currentActiveElement.setAttribute('visible', 'false'); 
            frameIndex = (frameIndex + 1) % idleElements.length;
            currentActiveElement = idleElements[frameIndex]; 
            currentActiveElement.setAttribute('visible', 'true'); 
        }
    }, 150); 

    // 2. Ch?c n?ng Nh?y (B?m vào Hitbox)
    hitbox.addEventListener('click', () => {
        if (isJumping) return;
        isJumping = true;
        
        currentActiveElement.setAttribute('visible', 'false');
        
        let jumpStep = 0;
        currentActiveElement = jumpElements[jumpStep];
        currentActiveElement.setAttribute('visible', 'true');

        const jumpInterval = setInterval(() => {
            currentActiveElement.setAttribute('visible', 'false'); 
            jumpStep++;
            
            if (jumpStep >= jumpElements.length) {
                clearInterval(jumpInterval);
                // Gi? nguyên frame cu?i trong 2 giây ch?
                currentActiveElement = jumpElements[jumpElements.length - 1];
                currentActiveElement.setAttribute('visible', 'true');
                
                setTimeout(() => { 
                    isJumping = false; 
                }, 2000); 
            } else {
                currentActiveElement = jumpElements[jumpStep]; 
                currentActiveElement.setAttribute('visible', 'true'); 
            }
        }, 100); 
    });

    // 3. Ch?c n?ng Zoom in / Zoom out
    let currentScale = 1; 
    
    btnZoomIn.addEventListener('click', () => {
        currentScale += 0.3; 
        container.setAttribute('scale', `${currentScale} ${currentScale} ${currentScale}`);
        hitbox.setAttribute('scale', `${currentScale} ${currentScale} ${currentScale}`);
    });

    btnZoomOut.addEventListener('click', () => {
        currentScale -= 0.3; 
        if (currentScale < 0.4) currentScale = 0.4; 
        container.setAttribute('scale', `${currentScale} ${currentScale} ${currentScale}`);
        hitbox.setAttribute('scale', `${currentScale} ${currentScale} ${currentScale}`);
    });
});