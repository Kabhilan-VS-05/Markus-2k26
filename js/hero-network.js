/**
 * MESCIA 26 - VOID NETWORK (HOME BACKGROUND)
 * Concept: A classic "Constellation/Neural" network that actively AVOIDS the center.
 * This ensures the main title text is always on a clean, dark background for maximum readability.
 * 
 * Features:
 * - Particles are spawned at edges.
 * - Strong central repulsion force ("The Void").
 * - Professional, clean connection lines.
 */

const canvas = document.getElementById('neural-canvas');
const ctx = canvas.getContext('2d');

let width, height;
let particles = [];

// DEVICE DETECTION
const isMobile = window.innerWidth < 768;

const config = {
    particleCount: isMobile ? 40 : 80,
    connectionDist: 120,
    voidRadius: isMobile ? 150 : 350, // Radius of clear text zone
    speed: 0.3,
    color: 'rgba(0, 245, 225, 0.7)', // Cyan
    lineColor: 'rgba(0, 245, 225, 0.15)' // Faint lines
};

// RESIZE HANDLER
function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    initParticles();
}
window.addEventListener('resize', resize);

// PARTICLE CLASS
class Particle {
    constructor() {
        this.reset(true); // True = random initial placement
    }

    reset(initial = false) {
        // Spawn randomly
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        
        // Velocity (Slow drift)
        this.vx = (Math.random() - 0.5) * config.speed;
        this.vy = (Math.random() - 0.5) * config.speed;
        this.size = Math.random() * 2 + 1;

        // If newly spawned inside Void, push out immediately
        if (initial) {
            this.pushFromVoid(); 
        }
    }

    pushFromVoid() {
        // Check distance to center
        const cx = width / 2;
        const cy = height / 2;
        const dx = this.x - cx;
        const dy = this.y - cy;
        const dist = Math.sqrt(dx*dx + dy*dy);

        // If inside void, move it to edge of void
        if (dist < config.voidRadius) {
            const angle = Math.atan2(dy, dx);
            this.x = cx + Math.cos(angle) * (config.voidRadius + 20);
            this.y = cy + Math.sin(angle) * (config.voidRadius + 20);
        }
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;

        // Bounce off screen edges
        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;

        // VOID LOGIC: Keep center clear
        const cx = width / 2;
        const cy = height / 2;
        const dx = this.x - cx;
        const dy = this.y - cy;
        const dist = Math.sqrt(dx*dx + dy*dy);

        if (dist < config.voidRadius) {
            // Push away gently but firmly
            const angle = Math.atan2(dy, dx);
            const force = (config.voidRadius - dist) * 0.05;
            this.vx += Math.cos(angle) * force;
            this.vy += Math.sin(angle) * force;
        }
    }

    draw() {
        ctx.fillStyle = config.color;
        ctx.globalAlpha = 0.6;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
    }
}

// INIT
function initParticles() {
    particles = [];
    for (let i = 0; i < config.particleCount; i++) {
        particles.push(new Particle());
    }
}

// ANIMATION LOOP
function animate() {
    requestAnimationFrame(animate);
    ctx.clearRect(0, 0, width, height);

    // Update Particles
    particles.forEach(p => p.update());

    // Draw Lines (Connections)
    ctx.lineWidth = 1;
    
    for (let a = 0; a < particles.length; a++) {
        const p1 = particles[a];
        
        // Draw Particle
        p1.draw();

        // Check connections
        for (let b = a + 1; b < particles.length; b++) {
            const p2 = particles[b];
            const dx = p1.x - p2.x;
            const dy = p1.y - p2.y;
            const dist = Math.sqrt(dx*dx + dy*dy);

            if (dist < config.connectionDist) {
                const opacity = 1 - (dist / config.connectionDist);
                // "Faint" lines
                ctx.strokeStyle = config.lineColor.replace('0.15)', `${opacity * 0.3})`); 
                ctx.beginPath();
                ctx.moveTo(p1.x, p1.y);
                ctx.lineTo(p2.x, p2.y);
                ctx.stroke();
            }
        }
    }
}

// START
resize();
animate();
