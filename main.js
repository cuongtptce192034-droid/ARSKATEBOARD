// ============================================
// CONFIGURATION CONSTANTS
// ============================================
const COLS = 5;
const ROWS = 7;

const IDLE_START = 25;
const IDLE_END = 34;

const JUMP_START = 0;
const JUMP_END = 24;

const IDLE_SPEED = 120;
const JUMP_FRAME_SPEED = 60;
const MIN_SCALE = 0.5;
const MAX_SCALE = 4;
const SCALE_STEP = 0.2;
const SPAM_ALERT_DURATION = 800;

// ============================================
// DOM ELEMENTS
// ============================================
const marker = document.querySelector("#marker");
const character = document.querySelector("#character");
const plusBtn = document.querySelector("#plus");
const minusBtn = document.querySelector("#minus");
const statusIndicator = document.querySelector("#status");
const spamWarning = document.querySelector("#spam-warning");
const scene = document.querySelector("a-scene");
const debugStatus = document.querySelector("#debug-status");
const debugMarker = document.querySelector("#debug-marker");
const debugScale = document.querySelector("#debug-scale");

// ============================================
// STATE VARIABLES
// ============================================
let material = null;
let scale = 1.5;
let idleFrame = IDLE_START;
let jumping = false;
let tracking = false;
let lastIdleFrameTime = 0;
let spamWarningTimeout = null;
let animationRunning = false;

// ============================================
// UTILITY FUNCTIONS
// ============================================

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function showSpamAlert() {
  if (spamWarningTimeout) {
    clearTimeout(spamWarningTimeout);
  }
  spamWarning.style.display = "block";
  spamWarningTimeout = setTimeout(() => {
    spamWarning.style.display = "none";
  }, SPAM_ALERT_DURATION);
}

function updateStatus() {
  if (tracking) {
    statusIndicator.classList.add("tracking");
    debugStatus.textContent = "✅ Status: Tracking";
  } else {
    statusIndicator.classList.remove("tracking");
    debugStatus.textContent = "❌ Status: Not Tracking";
  }
}

function updateDebug() {
  debugMarker.textContent = `Marker: ${tracking ? "FOUND ✅" : "NOT FOUND ❌"}`;
  debugScale.textContent = `Scale: ${scale.toFixed(1)}x`;
}

// ============================================
// SPRITESHEET ANIMATION
// ============================================

function setFrame(frame) {
  if (!material || !material.map) return;

  const col = frame % COLS;
  const row = Math.floor(frame / COLS);

  material.map.repeat.set(1 / COLS, 1 / ROWS);
  material.map.offset.set(col / COLS, 1 - (row + 1) / ROWS);
  material.map.needsUpdate = true;
}

function initMaterial() {
  const mesh = character.getObject3D("mesh");

  if (!mesh || !mesh.material || !mesh.material.map) {
    requestAnimationFrame(initMaterial);
    return;
  }

  material = mesh.material;
  material.map.minFilter = THREE.LinearFilter;
  material.map.magFilter = THREE.LinearFilter;
  material.map.repeat.set(1 / COLS, 1 / ROWS);
  
  setFrame(IDLE_START);
  
  if (!animationRunning) {
    animationRunning = true;
    animate(Date.now());
  }
}

// ============================================
// ANIMATION LOGIC
// ============================================

async function jump() {
  if (jumping) {
    showSpamAlert();
    return;
  }
  
  if (!tracking) {
    return;
  }

  jumping = true;

  try {
    for (let i = JUMP_START; i <= JUMP_END; i++) {
      if (!tracking) break;
      setFrame(i);
      await sleep(JUMP_FRAME_SPEED);
    }
  } catch (error) {
    console.error("Jump animation error:", error);
  } finally {
    jumping = false;
    if (tracking) {
      setFrame(IDLE_START);
      idleFrame = IDLE_START;
    }
  }
}

function animate(time) {
  if (tracking && !jumping && time - lastIdleFrameTime > IDLE_SPEED) {
    lastIdleFrameTime = time;
    
    setFrame(idleFrame);
    idleFrame++;
    
    if (idleFrame > IDLE_END) {
      idleFrame = IDLE_START;
    }
  }

  requestAnimationFrame(animate);
}

// ============================================
// MARKER TRACKING
// ============================================

marker.addEventListener("targetFound", () => {
  tracking = true;
  updateStatus();
  updateDebug();
  
  if (!material) {
    initMaterial();
  } else {
    setFrame(IDLE_START);
    idleFrame = IDLE_START;
  }
});

marker.addEventListener("targetLost", () => {
  tracking = false;
  jumping = false;
  updateStatus();
  updateDebug();
});

// ============================================
// USER INTERACTIONS
// ============================================

character.addEventListener("click", () => {
  if (tracking && !jumping) {
    jump();
  }
});

plusBtn.addEventListener("click", () => {
  const newScale = Math.min(scale + SCALE_STEP, MAX_SCALE);
  if (newScale !== scale) {
    scale = newScale;
    character.object3D.scale.set(scale, scale, scale);
    updateDebug();
  }
});

minusBtn.addEventListener("click", () => {
  const newScale = Math.max(scale - SCALE_STEP, MIN_SCALE);
  if (newScale !== scale) {
    scale = newScale;
    character.object3D.scale.set(scale, scale, scale);
    updateDebug();
  }
});

// ============================================
// SCENE EVENTS
// ============================================

if (scene) {
  scene.addEventListener("loaded", () => {
    updateStatus();
    updateDebug();
    
    if (material && !animationRunning) {
      animationRunning = true;
      animate(Date.now());
    }
  });

  scene.addEventListener("error", (err) => {
    console.error("Scene error:", err);
  });
}

// ============================================
// TEXTURE LOADING
// ============================================

const textureImg = document.querySelector("#sheet");
if (textureImg) {
  textureImg.addEventListener("load", () => {
    console.log("Texture loaded");
  });
  
  textureImg.addEventListener("error", () => {
    console.error("Failed to load spritesheet.png");
  });
}

// ============================================
// INITIALIZATION
// ============================================

if (!animationRunning) {
  animationRunning = true;
  requestAnimationFrame(animate);
}

updateStatus();
updateDebug();
