const COLS = 5;
const ROWS = 7;

const IDLE_START = 25;
const IDLE_END = 34;

const JUMP_START = 0;
const JUMP_END = 24;

const character = document.querySelector("#character");
const target = document.querySelector("#target");

const plus = document.querySelector("#plus");
const minus = document.querySelector("#minus");

let mesh = null;
let material = null;

let scale = 1.5;

let idleFrame = IDLE_START;

let tracking = false;

let jumping = false;

function setFrame(frame){

if(!material) return;

const col = frame % COLS;

const row = Math.floor(frame / COLS);

material.map.repeat.set(

1/COLS,

1/ROWS

);

material.map.offset.set(

col/COLS,

1-(row+1)/ROWS

);

material.map.needsUpdate=true;

}

function sleep(ms){

return new Promise(r=>setTimeout(r,ms));

}

async function playJump(){

if(jumping) return;

jumping=true;

for(let i=JUMP_START;i<=JUMP_END;i++){

setFrame(i);

await sleep(60);

}

jumping=false;

}

function idle(){

if(tracking && !jumping){

setFrame(idleFrame);

idleFrame++;

if(idleFrame>IDLE_END){

idleFrame=IDLE_START;

}

}

requestAnimationFrame(idle);

}

target.addEventListener("targetFound",()=>{

tracking=true;

mesh=character.getObject3D("mesh");

if(!mesh){

console.log("mesh null");

return;

}

material=mesh.material;

material.map.wrapS=THREE.ClampToEdgeWrapping;

material.map.wrapT=THREE.ClampToEdgeWrapping;

setFrame(IDLE_START);

console.log("FOUND");

});

target.addEventListener("targetLost",()=>{

tracking=false;

console.log("LOST");

});

character.addEventListener("click",()=>{

if(tracking){

playJump();

}

});

plus.onclick=()=>{

scale=Math.min(scale+0.2,4);

character.object3D.scale.set(scale,scale,scale);

}

minus.onclick=()=>{

scale=Math.max(scale-0.2,0.5);

character.object3D.scale.set(scale,scale,scale);

}

setInterval(()=>{

if(tracking && !jumping){

idleFrame++;

if(idleFrame>IDLE_END){

idleFrame=IDLE_START;

}

}

},100);

idle();