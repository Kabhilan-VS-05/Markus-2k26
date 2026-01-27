/**
 * MESCIA 26 - NEON SHOCKWAVE GRID
 * Concept: An invisible grid of particles that "wakes up" on interaction.
 * INTERACTIVITY:
 * 1. VISIBILITY: Particles light up when cursor is near (Flashlight effect).
 * 2. PHYSICS: Particles are physically pushed away by the cursor (Shockwave/Ripple).
 * 3. ELASTICITY: Particles spring back to their original position.
 * 
 * Optimized for mobile (lower density, simplified physics).
 */

const canvas = document.getElementById('neural-canvas');
const ctx = canvas.getContext('2d');

let width, height;
let points = [];
let mouse = { x: -1000, y: -1000, active: false };

// DEVICE DETECTION
const isMobile = window.innerWidth < 768;

const config = {
    spacing: isMobile ? 40 : 35,   // Grid spacing
    baseSize: 2,
    color: 'rgba(0, 245, 225, 1)', // Cyan
    secondaryColor: 'rgba(168, 85, 247, 1)', // Purple
    mouseRadius: isMobile ? 120 : 180,
    pushStrength: 30, // How hard the mouse pushes points
    friction: 0.9,    // Deceleration
    springd: 0.1      // Return speed
};

// POINT CLASS
class Point {
    constructor(x, y) {
        this.originX = x;
        this.originY = y;
        this.x = x;
        this.y = y;
        this.vx = 0;
        this.vy = 0;
        this.alpha = 0; // Invisible start
        this.targetAlpha = 0;
        this.color = Math.random() > 0.8 ? config.secondaryColor : config.color; // 20% Purple
    }

    update() {
        // 1. MOUSE INTERACTION
        let dx = 0;
        let dy = 0;
        let dist = 1000;

        if (mouse.active) {
            dx = mouse.x - this.x;
            dy = mouse.y - this.y;
            dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < config.mouseRadius) {
                // LIGHT UP: Calculate brightness based on proximity
                this.targetAlpha = 1 - (dist / config.mouseRadius);
                
                // PHYSICS PUSH: Repel points
                const angle = Math.atan2(dy, dx);
                const force = (config.mouseRadius - dist) / config.mouseRadius;
                const push = force * config.pushStrength;
                
                this.vx -= Math.cos(angle) * push * 0.5; // Add force to velocity
                this.vy -= Math.sin(angle) * push * 0.5;
            } else {
                this.targetAlpha = 0;
            }
        } else {
            this.targetAlpha = 0;
        }

        // Smooth Alpha Transition
        this.alpha += (this.targetAlpha - this.alpha) * 0.1;

        // 2. SPRING PHYSICS (Return to Origin)
        const springX = (this.originX - this.x) * config.springd;
        const springY = (this.originY - this.y) * config.springd;

        this.vx += springX;
        this.vy += springY;

        this.vx *= config.friction;
        this.vy *= config.friction;

        this.x += this.vx;
        this.y += this.vy;
    }

    draw() {
        // Skip invisible points
        if (this.alpha < 0.01) return;

        ctx.globalAlpha = this.alpha;
        ctx.fillStyle = this.color;
        
        // Draw Dot
        ctx.beginPath();
        // Dynamic size based on velocity (stretch effect)
        const speed = Math.abs(this.vx) + Math.abs(this.vy);
        const size = config.baseSize + (speed * 0.1); 
        
        ctx.arc(this.x, this.y, size, 0, Math.PI * 2);
        ctx.fill();

        // Optional: Draw connecting lines if moving fast (Energy streaks)
        if (speed > 2) {
             ctx.strokeStyle = this.color;
             ctx.lineWidth = 1;
             ctx.beginPath();
             ctx.moveTo(this.x, this.y);
             ctx.lineTo(this.x - this.vx * 2, this.y - this.vy * 2); // Trail
             ctx.stroke();
        }
        
        ctx.globalAlpha = 1;
    }
}

// SETUP GRID
function initGrid() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    
    points = [];
    const cols = Math.ceil(width / config.spacing);
    const rows = Math.ceil(height / config.spacing);

    // Center grid
    const startX = (width - (cols * config.spacing)) / 2;
    const startY = (height - (rows * config.spacing)) / 2;

    for (let i = 0; i <= cols; i++) {
        for (let j = 0; j <= rows; j++) {
            const x = startX + i * config.spacing;
            const y = startY + j * config.spacing;
            points.push(new Point(x, y));
        }
    }
}

window.addEventListener('resize', initGrid);

// INPUT
function updateInput(x, y) {
    const rect = canvas.getBoundingClientRect();
    mouse.x = x - rect.left;
    mouse.y = y - rect.top;
    mouse.active = true;
}

window.addEventListener('mousemove', e => updateInput(e.clientX, e.clientY));
window.addEventListener('touchmove', e => updateInput(e.touches[0].clientX, e.touches[0].clientY), {passive: true});
window.addEventListener('touchstart', e => updateInput(e.touches[0].clientX, e.touches[0].clientY), {passive: true});

window.addEventListener('mouseleave', () => { mouse.active = false; });
window.addEventListener('touchend', () => { mouse.active = false; }); // Tap and release

// ANIMATION
function animate() {
    requestAnimationFrame(animate);
    ctx.clearRect(0, 0, width, height);
    
    // Additive blending for glow
    // Optimized: Only enable if few points active? No, always looks better.
    // Check mobile perf: ctx state change is cheap.
    if (!isMobile) ctx.globalCompositeOperation = 'lighter';

    points.forEach(p => {
        p.update();
        p.draw();
    });
    
    ctx.globalCompositeOperation = 'source-over';
}

// BOOT
initGrid();
animate();
