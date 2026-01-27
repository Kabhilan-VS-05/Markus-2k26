/**
 * MESCIA 26 - HEX PULSE GRID (HOME BACKGROUND)
 * Concept: An automatic, breathing hexagonal grid.
 * NO CURSOR INTERACTION (Purely decorative background).
 * 
 * Features:
 * - Hexagonal tiling.
 * - Random "Data Pulses" (cells lighting up).
 * - Breathing animation (scale/opacity).
 */

const canvas = document.getElementById('neural-canvas');
const ctx = canvas.getContext('2d');

let width, height;
let hexGrid = [];

// CONFIG
const config = {
    hexSize: 30, // Radius
    color: 'rgba(0, 245, 225, 0.1)', // Base grid color (very faint)
    pulseColor: 'rgba(0, 245, 225, 0.8)', // Active pulse color
    pulseSpeed: 0.02,
    pulseChance: 0.005 // Chance per frame to start pulsing
};

// RESIZE
function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    initHexGrid();
}
window.addEventListener('resize', resize);

// HEXAGON MATH
function drawHex(x, y, r) {
    ctx.beginPath();
    for (let i = 0; i < 6; i++) {
        const angle = (Math.PI / 3) * i;
        const hx = x + r * Math.cos(angle);
        const hy = y + r * Math.sin(angle);
        if (i === 0) ctx.moveTo(hx, hy);
        else ctx.lineTo(hx, hy);
    }
    ctx.closePath();
    ctx.stroke();
}

// HEX CELL CLASS
class HexCell {
    constructor(x, y, r) {
        this.x = x;
        this.y = y;
        this.r = r;
        this.pulse = 0; // 0 to 1
        this.pulsing = false;
        this.pulseDir = 1;
    }

    update() {
        // Randomly start pulsing
        if (!this.pulsing && Math.random() < config.pulseChance) {
            this.pulsing = true;
            this.pulse = 0;
            this.pulseDir = 1;
        }

        if (this.pulsing) {
            this.pulse += config.pulseSpeed * this.pulseDir;
            if (this.pulse >= 1) {
                this.pulse = 1;
                this.pulseDir = -1;
            } else if (this.pulse <= 0) {
                this.pulse = 0;
                this.pulsing = false;
            }
        }
    }

    draw() {
        // Base Grid (Subtle)
        ctx.strokeStyle = config.color;
        ctx.lineWidth = 1;
        drawHex(this.x, this.y, this.r);

        // Pulse (Highlight)
        if (this.pulsing) {
            ctx.fillStyle = `rgba(0, 245, 225, ${this.pulse * 0.4})`;
            ctx.strokeStyle = `rgba(0, 245, 225, ${this.pulse})`;
            ctx.lineWidth = 2;
            
            // Filled glow
            ctx.beginPath();
            for (let i = 0; i < 6; i++) {
                const angle = (Math.PI / 3) * i;
                const hx = this.x + this.r * Math.cos(angle);
                const hy = this.y + this.r * Math.sin(angle);
                if (i === 0) ctx.moveTo(hx, hy);
                else ctx.lineTo(hx, hy);
            }
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
        }
    }
}

// INIT GRID
function initHexGrid() {
    hexGrid = [];
    const r = config.hexSize;
    const w = r * 2; // Width of one hex
    const h = Math.sqrt(3) * r; // Height of one hex
    
    // Offset for hex layout
    const cols = Math.ceil(width / (w * 0.75)) + 1;
    const rows = Math.ceil(height / h) + 1;

    for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
            let x = i * w * 0.75;
            let y = j * h;
            if (i % 2 === 1) y += h / 2; // Offset odd columns
            
            hexGrid.push(new HexCell(x, y, r));
        }
    }
}

// ANIM LOOP
function animate() {
    requestAnimationFrame(animate);
    ctx.clearRect(0, 0, width, height);
    
    hexGrid.forEach(hex => {
        hex.update();
        hex.draw();
    });
}

// START
resize();
animate();
