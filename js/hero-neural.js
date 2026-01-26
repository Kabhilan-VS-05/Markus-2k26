/**
 * MESCIA 26 - NEURAL NETWORK CANVAS
 * A lightweight, interactive particle system with custom shapes (Hexagons & Crosses).
 * Optimized for mobile performance.
 */

const canvas = document.getElementById('neural-canvas');
const ctx = canvas.getContext('2d');

let width, height;
let particles = [];
let mouse = { x: null, y: null, radius: 150 };

// DEVICE DETECTION
const isMobile = window.innerWidth < 768;

// CONFIGURATION
const config = {
    particleCount: isMobile ? 35 : 90, // Reduced for mobile
    connectionDist: isMobile ? 90 : 130, // Reduced for mobile
    baseSpeed: isMobile ? 0.3 : 0.6,
    color: 'rgba(0, 245, 225, 1)', // Accent Color (Cyan)
    secondaryColor: 'rgba(168, 85, 247, 1)' // Secondary (Purple)
};

// RESIZE HANDLER
function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
}
window.addEventListener('resize', () => {
    resize();
    initParticles(); // Re-init on resize to adjust density
});
resize();

// MOUSE HANDLER
window.addEventListener('mousemove', (e) => {
    // Correct for canvas position if needed (usually 0,0 in fixed/absolute)
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
});

window.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
});

// PARTICLE CLASS
class Particle {
    constructor() {
        this.init();
    }

    init() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * config.baseSpeed;
        this.vy = (Math.random() - 0.5) * config.baseSpeed;
        this.size = Math.random() * 2 + 1; // 1 to 3
        this.type = Math.random() > 0.5 ? 'hex' : 'cross'; // Unique shapes
        this.color = Math.random() > 0.7 ? config.secondaryColor : config.color;
        this.alpha = Math.random() * 0.5 + 0.2;
    }

    draw() {
        ctx.beginPath();
        // ctx.globalAlpha = this.alpha;
        
        // UNIQUE VISUALS: Draws shapes instead of just circles
        if (this.type === 'hex') {
            this.drawHexagon(this.x, this.y, this.size * 2);
            ctx.fillStyle = this.color.replace('1)', `${this.alpha})`);
            ctx.fill();
        } else {
            this.drawCross(this.x, this.y, this.size * 2);
            ctx.strokeStyle = this.color.replace('1)', `${this.alpha})`);
            ctx.lineWidth = 1.5;
            ctx.stroke();
        }
    }

    drawHexagon(x, y, r) {
        ctx.moveTo(x + r * Math.cos(0), y + r * Math.sin(0));
        for (let i = 1; i <= 6; i += 1) {
            ctx.lineTo(x + r * Math.cos(i * 2 * Math.PI / 6), y + r * Math.sin(i * 2 * Math.PI / 6));
        }
    }

    drawCross(x, y, s) {
        ctx.moveTo(x - s, y);
        ctx.lineTo(x + s, y);
        ctx.moveTo(x, y - s);
        ctx.lineTo(x, y + s);
    }

    update() {
        // Move
        this.x += this.vx;
        this.y += this.vy;

        // Bounce
        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;

        // Interaction (Mouse Repulsion) - SKIP ON MOBILE to save cycles if needed, 
        // but simple distance check is usually okay.
        if (mouse.x != null) {
            let dx = mouse.x - this.x;
            let dy = mouse.y - this.y;
            let distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < mouse.radius) {
                const forceDirectionX = dx / distance;
                const forceDirectionY = dy / distance;
                const force = (mouse.radius - distance) / mouse.radius;
                const directionX = forceDirectionX * force * 3; // Push strength
                const directionY = forceDirectionY * force * 3;

                this.x -= directionX;
                this.y -= directionY;
            }
        }
    }
}

// MANAGING PARTICLES
function initParticles() {
    particles = [];
    for (let i = 0; i < config.particleCount; i++) {
        particles.push(new Particle());
    }
}

// CONNECT PARTICLES
function connect() {
    let opacity = 1;
    for (let a = 0; a < particles.length; a++) {
        for (let b = a; b < particles.length; b++) {
            let dx = particles[a].x - particles[b].x;
            let dy = particles[a].y - particles[b].y;
            let distance = dx * dx + dy * dy; // Squared distance is faster

            let distThreshold = config.connectionDist * config.connectionDist;

            if (distance < distThreshold) {
                // Calculate opacity based on distance
                opacity = 1 - (distance / distThreshold);
                
                ctx.strokeStyle = 'rgba(0, 245, 225,' + (opacity * 0.2) + ')'; // Low opacity lines
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(particles[a].x, particles[a].y);
                ctx.lineTo(particles[b].x, particles[b].y);
                ctx.stroke();
            }
        }
    }
}

// ANIMATION LOOP
function animate() {
    requestAnimationFrame(animate);
    ctx.clearRect(0, 0, width, height);

    // Update and Draw Particles
    for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();
    }
    
    // Draw Connections
    connect();
}

// START
initParticles();
animate();

// CLICK INTERACTION (Pulse)
window.addEventListener('click', (e) => {
    // Add 2 temporary particles on click for fun feedback
    for(let i=0; i<3; i++){
        let p = new Particle();
        p.x = e.clientX;
        p.y = e.clientY;
        p.vx *= 4; // Fast burst
        p.vy *= 4;
        particles.push(p);
        // Remove them after a bit to prevent overflow
        setTimeout(() => {
            particles.splice(particles.indexOf(p), 1);
        }, 1000);
    }
});
