const COLS = 5, ROWS = 7;
const IDLE_START = 25, IDLE_END = 34;
const JUMP_START = 0, JUMP_END = 24;

const marker = document.querySelector("#marker");
const character = document.querySelector("#character");
const plus = document.querySelector("#plus");
const minus = document.querySelector("#minus");

let material = null;
let scale = 1.5;
let idleFrame = IDLE_START;
let jumping = false;
let tracking = false;
let lastTime = 0;

function setFrame(frame) {
    if (!material || !material.map) return;
    const col = frame % COLS;
    const row = Math.floor(frame / COLS);
    
    // Tính toán offset chu?n: Three.js tính t? góc trái d??i [6]
    material.map.offset.set(col / COLS, 1 - (row + 1) / ROWS);
    material.map.needsUpdate = true; // Ép c?p nh?t texture ngay l?p t?c [7]
}

// KH?C PH?C L?I ?EN MÀN HÌNH: Ch? kh?i t?o khi ?nh nhân v?t ?ã n?p xong [5]
character.addEventListener('materialtextureloaded', () => {
    material = character.getObject3D("mesh").material;
    material.map.repeat.set(1 / COLS, 1 / ROWS);
    // Fix l?i màu s?c quá t?i trên m?t s? trình duy?t master [8]
    material.map.colorSpace = 'srgb'; 
    setFrame(IDLE_START);
});

marker.addEventListener("targetFound", () => { tracking = true; });
marker.addEventListener("targetLost", () => { tracking = false; });

// Jump 0-24 và ch?ng spam
async function jump() {
    if (jumping) return;
    jumping = true;
    for (let i = JUMP_START; i <= JUMP_END; i++) {
        setFrame(i);
        await new Promise(r => setTimeout(r, 55)); // 55ms (~18fps) cho Jump m??t mà
    }
    jumping = false;
}

// Vòng l?p Idle (requestAnimationFrame thay cho setInterval ?? nh? máy [9])
function animate(time) {
    // ?i?u khi?n t?c ?? khung hình th? công ?? tránh "?? c?ng" khi t?t FPS [10]
    if (time - lastTime > 120) { 
        lastTime = time;
        if (tracking && !jumping) {
            setFrame(idleFrame);
            idleFrame = (idleFrame >= IDLE_END) ? IDLE_START : idleFrame + 1;
        }
    }
    requestAnimationFrame(animate);
}

character.addEventListener("click", () => {
    if (tracking) jump();
});

// Zoom tr?c ti?p qua object3D ?? ph?n h?i t?c thì [11]
plus.onclick = () => {
    scale = Math.min(scale + 0.2, 5);
    character.object3D.scale.set(scale, scale, scale);
};

minus.onclick = () => {
    scale = Math.max(scale - 0.2, 0.5);
    character.object3D.scale.set(scale, scale, scale);
};

requestAnimationFrame(animate);