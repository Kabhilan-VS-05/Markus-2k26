/**
 * MESCIA 26 - CYBER KINETIC WAVES
 * Concept: A series of flowing, neon energy waves that react to user input.
 * The waves represent data streams or sound waves (symposium vibration).
 * Highly optimized for mobile (low point count).
 */

const canvas = document.getElementById('neural-canvas');
const ctx = canvas.getContext('2d');

let width, height;
let waves = [];
let mouse = { x: -1000, y: -1000, active: false };

// DEVICE DETECTION & CONFIG
const isMobile = window.innerWidth < 768;

const config = {
    waveCount: isMobile ? 3 : 5,      // Fewer waves on mobile
    pointCount: isMobile ? 50 : 100,  // Fewer points per wave on mobile
    amplitude: 50,
    frequency: 0.01,
    speed: 0.02,
    colors: [
        'rgba(0, 245, 225, 0.5)',   // Cyan
        'rgba(168, 85, 247, 0.4)',  // Purple
        'rgba(0, 245, 225, 0.2)'    // Faint Cyan
    ]
};

// RESIZE HANDLER
function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
}
window.addEventListener('resize', () => {
    resize();
    initWaves();
});
resize();

// INPUT HANDLING
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
window.addEventListener('touchend', () => { mouse.active = false; });

// WAVE CLASS
class Wave {
    constructor(yOffset, color, speedModifier, phaseOffset) {
        this.yOffset = yOffset;
        this.color = color;
        this.speedModifier = speedModifier;
        this.phase = phaseOffset;
        this.points = [];
        this.initPoints();
    }

    initPoints() {
        this.points = [];
        const gap = width / (config.pointCount - 1);
        for (let i = 0; i < config.pointCount; i++) {
            this.points.push({
                x: i * gap,
                y: this.yOffset,
                originY: this.yOffset,
                vy: 0 // Velocity for spring physics
            });
        }
    }
    
    update() {
        this.phase += config.speed * this.speedModifier;
        
        let i = 0;
        const gap = width / (config.pointCount - 1); // Recalculate gap in case of slight resize drift

        for (let point of this.points) {
            // 1. Natural Sine Movement
            // Calculate a base Y position using sine waves
            const naturalY = this.yOffset + Math.sin(i * config.frequency + this.phase) * config.amplitude;
            
            // 2. Interactive Distortion (Mouse Interaction)
            let force = 0;
            if (mouse.active) {
                const dx = mouse.x - point.x;
                const dy = mouse.y - point.y; // Correct: compare to current point Y, not mouse vs wave center
                const dist = Math.sqrt(dx*dx + dy*dy);
                
                // Interaction Radius
                if (dist < 200) {
                    force = (200 - dist) / 200;
                    // Push away from mouse
                    if (mouse.y > point.y) {
                         force = -force * 100; // Mouse is below, push up
                    } else {
                         force = force * 100; // Mouse is above, push down
                    }
                }
            }
            
            // 3. Apply Spring Physics (Smooth restoration)
            const targetY = naturalY + force;
            const dy = targetY - point.y;
            point.vy += dy * 0.05; // Spring Stiffness
            point.vy *= 0.9;       // Friction/Damping
            point.y += point.vy;
            
            // Reset X (just to be safe)
            point.x = i * gap;
            
            i++;
        }
    }

    draw() {
        ctx.beginPath();
        ctx.strokeStyle = this.color;
        ctx.lineWidth = 2;
        
        // Draw the curve using points
        // Start at first point
        ctx.moveTo(this.points[0].x, this.points[0].y);
        
        // Use quadratic curves for smoothness between points
        for (let i = 0; i < this.points.length - 1; i++) {
            const p0 = this.points[i];
            const p1 = this.points[i + 1];
            const midX = (p0.x + p1.x) / 2;
            const midY = (p0.y + p1.y) / 2;
            ctx.quadraticCurveTo(p0.x, p0.y, midX, midY);
        }
        
        // Connect to last point
        const last = this.points[this.points.length - 1];
        ctx.lineTo(last.x, last.y);
        
        ctx.stroke();
    }
}

// INIT
function initWaves() {
    waves = [];
    const step = height / (config.waveCount + 1);
    
    for (let i = 0; i < config.waveCount; i++) {
        const y = step * (i + 1);
        const color = config.colors[i % config.colors.length];
        const speed = 1 + Math.random() * 0.5; // Random speed variation
        const phase = Math.random() * Math.PI * 20; // Random start phase
        
        waves.push(new Wave(y, color, speed, phase));
    }
}

// ANIMATION LOOP
function animate() {
    requestAnimationFrame(animate);
    
    ctx.clearRect(0, 0, width, height);
    
    // Global Composite for neon glow effect (Performance ok for strokes)
    if (!isMobile) {
        ctx.globalCompositeOperation = 'lighter';
    }

    waves.forEach(wave => {
        wave.update();
        wave.draw();
    });
    
    ctx.globalCompositeOperation = 'source-over';
}

// Start
initWaves();
animate();
