/**
 * MESCIA 26 - INVISIBLE GRID PATH (Light Tiles)
 * Concept: An invisible grid covers the screen. As the mouse moves, individual grid cells 
 * "light up" (fade in) and slowly fade out, creating a trailing light path.
 * 
 * - Grid is invisible by default.
 * - Reactive: Cells only appear when hovered.
 * - Lag-free: Mobile optimization (lower grid density).
 */

const canvas = document.getElementById('neural-canvas');
const ctx = canvas.getContext('2d');

let width, height;
let grid = [];
let mouse = { x: -1000, y: -1000 };
let lastMouse = { x: -1000, y: -1000 };

// DEVICE DETECTION & CONFIG
const isMobile = window.innerWidth < 768;

const config = {
    cellSize: isMobile ? 60 : 50,  // Larger cells on mobile for fewer draw calls
    fadeSpeed: 0.03,               // Speed of light fading out
    color: 'rgba(0, 245, 225, 1)', // Highlight Color (Cyan)
    baseColor: 'rgba(255, 255, 255, 0.05)', // Very faint border for active cells (optional)
    trailLength: isMobile ? 3 : 5  // Just for logic tuning if needed
};

// RESIZE HANDLER
function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    initGrid();
}
window.addEventListener('resize', resize);

// INPUT HANDLING
function updateInput(x, y) {
    const rect = canvas.getBoundingClientRect();
    mouse.x = x - rect.left;
    mouse.y = y - rect.top;
}

window.addEventListener('mousemove', e => updateInput(e.clientX, e.clientY));
window.addEventListener('touchmove', e => updateInput(e.touches[0].clientX, e.touches[0].clientY), {passive: true});
window.addEventListener('touchstart', e => updateInput(e.touches[0].clientX, e.touches[0].clientY), {passive: true});

// CELL CLASS
class Cell {
    constructor(x, y, w, h) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.alpha = 0; // Invisible start
    }

    update() {
        // Check collision with Mouse Point
        // We check if mouse is inside this cell
        if (mouse.x > this.x && mouse.x < this.x + this.w &&
            mouse.y > this.y && mouse.y < this.y + this.h) {
            this.alpha = 1; // Instant light up
        }

        // Fade out logic
        if (this.alpha > 0) {
            this.alpha -= config.fadeSpeed;
            if (this.alpha < 0) this.alpha = 0;
        }
    }

    draw() {
        if (this.alpha <= 0) return; // Skip drawing invisible cells

        // Draw Filled Box (The Light)
        // Using globalCompositeOperation 'lighter' in main loop gives a nice glow overlap
        ctx.fillStyle = `rgba(0, 245, 225, ${this.alpha * 0.4})`; // Soft fill
        ctx.fillRect(this.x, this.y, this.w, this.h);

        // Draw Border (The Structure)
        ctx.strokeStyle = `rgba(0, 245, 225, ${this.alpha})`; 
        ctx.lineWidth = 1;
        ctx.strokeRect(this.x, this.y, this.w, this.h);
    }
}

// INIT GRID
function initGrid() {
    grid = [];
    const cols = Math.ceil(width / config.cellSize);
    const rows = Math.ceil(height / config.cellSize);

    for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
            grid.push(new Cell(i * config.cellSize, j * config.cellSize, config.cellSize, config.cellSize));
        }
    }
}

// ANIMATION LOOP
function animate() {
    requestAnimationFrame(animate);
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Use 'lighter' blend mode for the glowing feel
    // Disabled on mobile if performance issues arise, but rects are cheap.
    // Let's keep it standard 'source-over' for crisp grid lines on mobile.
    if (!isMobile) ctx.globalCompositeOperation = 'lighter';

    // Update & Draw only visible or active cells? 
    // Optimization: Loop all is fine for grids < 4000 cells. 
    // Mobile grid ~300 cells. Desktop ~1000. It's safe.
    for (let cell of grid) {
        cell.update();
        cell.draw();
    }
    
    ctx.globalCompositeOperation = 'source-over';
}

// START
resize(); // This calls initGrid
animate();
