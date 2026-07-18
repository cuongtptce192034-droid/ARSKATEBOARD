// ============================================
// CONFIGURATION CONSTANTS
// ============================================
const COLS = 5;
const ROWS = 7;

const IDLE_START = 25;
const IDLE_END = 34;

const JUMP_START = 0;
const JUMP_END = 24;

const IDLE_SPEED = 120;        // ms between idle frames
const JUMP_FRAME_SPEED = 60;   // ms between jump frames
const MIN_SCALE = 0.5;
const MAX_SCALE = 4;
const SCALE_STEP = 0.2;
const SPAM_ALERT_DURATION = 800; // ms to show spam warning

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

/**
 * Sleep for specified milliseconds (Promise-based)
 */
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Show spam alert temporarily
 */
function showSpamAlert() {
  if (spamWarningTimeout) {
    clearTimeout(spamWarningTimeout);
  }
  spamWarning.style.display = "block";
  spamWarningTimeout = setTimeout(() => {
    spamWarning.style.display = "none";
  }, SPAM_ALERT_DURATION);
}

/**
 * Update UI status indicator
 */
function updateStatus() {
  if (tracking) {
    statusIndicator.classList.add("tracking");
  } else {
    statusIndicator.classList.remove("tracking");
  }
}

// ============================================
// SPRITESHEET ANIMATION
// ============================================

/**
 * Set current frame on spritesheet
 * Calculates UV offset based on frame index
 */
function setFrame(frame) {
  if (!material || !material.map) return;

  const col = frame % COLS;
  const row = Math.floor(frame / COLS);

  material.map.repeat.set(1 / COLS, 1 / ROWS);
  material.map.offset.set(col / COLS, 1 - (row + 1) / ROWS);
  material.map.needsUpdate = true;
}

/**
 * Initialize material after mesh is ready
 * Waits for mesh and texture to load before setting up
 */
function initMaterial() {
  const mesh = character.getObject3D("mesh");

  // Wait until mesh, material, and texture are ready
  if (!mesh || !mesh.material || !mesh.material.map) {
    console.log("⏳ Waiting for mesh/material/texture to load...");
    requestAnimationFrame(initMaterial);
    return;
  }

  material = mesh.material;
  material.map.minFilter = THREE.LinearFilter;
  material.map.magFilter = THREE.LinearFilter;
  material.map.repeat.set(1 / COLS, 1 / ROWS);
  
  setFrame(IDLE_START);
  console.log("✅ Material initialized successfully");
  
  // Start animation loop if not already running
  if (!animationRunning) {
    animationRunning = true;
    animate(Date.now());
  }
}

// ============================================
// ANIMATION LOGIC
// ============================================

/**
 * Jump animation sequence
 * Plays frames JUMP_START to JUMP_END with anti-spam protection
 */
async function jump() {
  // ANTI-SPAM: Block jump if already jumping, not tracking, or too soon
  if (jumping) {
    showSpamAlert();
    return;
  }
  
  if (!tracking) {
    return;
  }

  jumping = true;

  try {
    // Play jump animation frames
    for (let i = JUMP_START; i <= JUMP_END; i++) {
      if (!tracking) break; // Stop if marker lost
      setFrame(i);
      await sleep(JUMP_FRAME_SPEED);
    }
  } catch (error) {
    console.error("Jump animation error:", error);
  } finally {
    jumping = false;
    // Reset to idle if still tracking
    if (tracking) {
      setFrame(IDLE_START);
      idleFrame = IDLE_START;
    }
  }
}

/**
 * Main animation loop - handles idle animation
 * Runs independently from jump animation
 */
function animate(time) {
  // Update idle animation only when tracking and not jumping
  if (tracking && !jumping && time - lastIdleFrameTime > IDLE_SPEED) {
    lastIdleFrameTime = time;
    
    setFrame(idleFrame);
    idleFrame++;
    
    // Loop back to start when reaching end
    if (idleFrame > IDLE_END) {
      idleFrame = IDLE_START;
    }
  }

  requestAnimationFrame(animate);
}

// ============================================
// MARKER TRACKING
// ============================================

/**
 * Marker found - start tracking
 */
marker.addEventListener("targetFound", () => {
  tracking = true;
  updateStatus();
  
  // Initialize material on first detection
  if (!material) {
    console.log("🎯 Marker found - initializing material...");
    initMaterial();
  } else {
    // Material already initialized, just reset frame
    setFrame(IDLE_START);
    idleFrame = IDLE_START;
  }
  
  console.log("🎯 Marker found - tracking started");
});

/**
 * Marker lost - stop tracking
 */
marker.addEventListener("targetLost", () => {
  tracking = false;
  updateStatus();
  jumping = false; // Reset jumping state
  console.log("❌ Marker lost - tracking stopped");
});

// ============================================
// USER INTERACTIONS
// ============================================

/**
 * Character click - trigger jump
 */
character.addEventListener("click", () => {
  if (tracking && !jumping) {
    console.log("👆 Character clicked - jumping!");
    jump();
  }
});

/**
 * Zoom In button
 */
plusBtn.addEventListener("click", () => {
  const newScale = Math.min(scale + SCALE_STEP, MAX_SCALE);
  if (newScale !== scale) {
    scale = newScale;
    character.object3D.scale.set(scale, scale, scale);
    console.log(`🔍 Zoomed in: ${scale.toFixed(1)}x`);
  }
});

/**
 * Zoom Out button
 */
minusBtn.addEventListener("click", () => {
  const newScale = Math.max(scale - SCALE_STEP, MIN_SCALE);
  if (newScale !== scale) {
    scale = newScale;
    character.object3D.scale.set(scale, scale, scale);
    console.log(`🔍 Zoomed out: ${scale.toFixed(1)}x`);
  }
});

// ============================================
// SCENE EVENTS
// ============================================

/**
 * Wait for A-Frame scene to be ready before initializing
 */
if (scene) {
  scene.addEventListener("loaded", () => {
    console.log("✨ A-Frame scene loaded - initializing AR Skateboard...");
    console.log(`Spritesheet grid: ${COLS}x${ROWS}`);
    console.log(`Idle frames: ${IDLE_START}-${IDLE_END}`);
    console.log(`Jump frames: ${JUMP_START}-${JUMP_END}`);
    console.log("🎥 Camera is ready, point at your marker to start!");
    
    // Initial status update
    updateStatus();
    
    // Start animation if material is ready
    if (material && !animationRunning) {
      animationRunning = true;
      animate(Date.now());
    }
  });

  /**
   * Handle scene errors
   */
  scene.addEventListener("error", (err) => {
    console.error("❌ A-Frame scene error:", err);
  });
}

/**
 * Log when textures are ready
 */
const textureImg = document.querySelector("#sheet");
if (textureImg) {
  textureImg.addEventListener("load", () => {
    console.log("📸 Spritesheet texture loaded successfully");
  });
  textureImg.addEventListener("error", () => {
    console.error("❌ Failed to load spritesheet.png - check file path and CORS!");
  });
}

// ============================================
// INITIALIZATION (fallback if scene already loaded)
// ============================================

// Start animation loop
if (!animationRunning) {
  animationRunning = true;
  requestAnimationFrame(animate);
}

// Initial status update
updateStatus();

console.log("✨ AR Skateboard initializing...");
console.log(`Spritesheet grid: ${COLS}x${ROWS}`);
console.log(`Idle frames: ${IDLE_START}-${IDLE_END}`);
console.log(`Jump frames: ${JUMP_START}-${JUMP_END}`);
console.log("🎥 Waiting for A-Frame scene to load...");
