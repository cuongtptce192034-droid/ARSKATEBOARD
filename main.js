window.addEventListener("load", () => {

const character=document.querySelector("#character");

const plus=document.querySelector("#btn-plus");

const minus=document.querySelector("#btn-minus");

const scene=document.querySelector("a-scene");

const COLS=5;
const ROWS=7;

const JUMP_START=0;
const JUMP_END=24;

const IDLE_START=25;
const IDLE_END=34;

let material;

let idleFrame=IDLE_START;

let playingJump=false;

let scale=1.5;

scene.addEventListener("renderstart",()=>{

material=character.getObject3D("mesh").material;

material.map.repeat.set(
1/COLS,
1/ROWS
);

startIdle();

});

function setFrame(index){

const col=index%COLS;

const row=Math.floor(index/COLS);

material.map.offset.set(

col/COLS,

1-(row+1)/ROWS

);

material.map.needsUpdate=true;

}

function sleep(ms){

return new Promise(resolve=>setTimeout(resolve,ms));

}

async function playJump(){

if(playingJump) return;

playingJump=true;

for(let i=JUMP_START;i<=JUMP_END;i++){

setFrame(i);

await sleep(60);

}

playingJump=false;

}

function startIdle(){

setInterval(()=>{

if(playingJump) return;

setFrame(idleFrame);

idleFrame++;

if(idleFrame>IDLE_END){

idleFrame=IDLE_START;

}

},100);

}

character.addEventListener("click",playJump);

plus.addEventListener("click",()=>{

scale=Math.min(scale+0.2,4);

character.object3D.scale.set(scale,scale,scale);

});

minus.addEventListener("click",()=>{

scale=Math.max(scale-0.2,0.5);

character.object3D.scale.set(scale,scale,scale);

});

});