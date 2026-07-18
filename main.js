const COLS = 5;
const ROWS = 7;

const IDLE_START = 25;
const IDLE_END = 34;

const JUMP_START = 0;
const JUMP_END = 24;

const marker = document.querySelector("#marker");
const character = document.querySelector("#character");
const plus = document.querySelector("#plus");
const minus = document.querySelector("#minus");

let material = null;
let scale = 1.5;
let idleFrame = IDLE_START;
let jumping = false;
let tracking = false;

function sleep(ms){
  return new Promise(r=>setTimeout(r,ms));
}

function setFrame(frame){
  // S?A T?I ?ÂY: N?u ?nh ch?a load xong (map = null) thì b? qua, không ?? crash code
  if(!material || !material.map) return;

  const col = frame % COLS;
  const row = Math.floor(frame / COLS);

  material.map.repeat.set(1/COLS, 1/ROWS);
  material.map.offset.set(col/COLS, 1 - (row+1)/ROWS);
  material.map.needsUpdate = true;
}

function initMaterial(){
  const mesh = character.getObject3D("mesh");
  
  // S?A T?I ?ÂY: ??i cho ??n khi c? mesh và ?nh n?n (map) s?n sàng h?n m?i gán
  if(!mesh || !mesh.material || !mesh.material.map){
    requestAnimationFrame(initMaterial);
    return;
  }

  material = mesh.material;
  material.map.repeat.set(1/COLS, 1/ROWS);
  setFrame(IDLE_START);
}

marker.addEventListener("targetFound",()=>{
  tracking = true;
  if(!material){
    initMaterial();
  }
});

marker.addEventListener("targetLost",()=>{
  tracking = false;
});

async function jump(){
  if(jumping) return;
  jumping = true;

  for(let i=JUMP_START; i<=JUMP_END; i++){
    setFrame(i);
    await sleep(60);
  }
  jumping = false;
}

let last = 0;
function animate(time){
  if(time - last > 100){
    last = time;
    if(tracking && !jumping){
      setFrame(idleFrame);
      idleFrame++;
      if(idleFrame > IDLE_END){
        idleFrame = IDLE_START;
      }
    }
  }
  requestAnimationFrame(animate);
}
requestAnimationFrame(animate);

character.addEventListener("click",()=>{
  if(tracking){
    jump();
  }
});

plus.onclick = () => {
  scale = Math.min(scale + 0.2, 4);
  character.object3D.scale.set(scale, scale, scale);
};

minus.onclick = () => {
  scale = Math.max(scale - 0.2, 0.5);
  character.object3D.scale.set(scale, scale, scale);
};