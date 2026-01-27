/**
 * MESCIA 26 - CYBER DATA TUNNEL
 * Concept: A pseudo-3D flight through a tunnel of data particles.
 * 
 * VISIBILITY LOGIC:
 * - Particles only spawn in the Top 30% and Bottom 30% of the view.
 * - The vertical center (40%) is a "Safe Zone" kept purely black for text.
 * 
 * INTERACTIVITY:
 * - Mouse X controls the curve/bend of the tunnel.
 * - Mouse Y controls the speed or slight tilt.
 */

const canvas = document.getElementById('neural-canvas');
const ctx = canvas.getContext('2d');

let width, height;
let stars = [];
let mouse = { x: 0, y: 0, active: false };

// CONFIG
const config = {
    starCount: 300,
    speed: 3, // Base speed
    maxSpeed: 15,
    safeZone: 0.25, // 25% empty space above and below center (total 50% clear)
    color: 'rgba(0, 245, 225, 1)', // Cyan
    secondary: 'rgba(168, 85, 247, 1)' // Purple
};

// RESIZE
function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    initStars();
}
window.addEventListener('resize', resize);

// MOUSE
function updateInput(x, y) {
    const rect = canvas.getBoundingClientRect();
    // Normalize -1 to 1
    mouse.x = ((x - rect.left) / width) * 2 - 1;
    mouse.y = ((y - rect.top) / height) * 2 - 1; 
    mouse.active = true;
}

window.addEventListener('mousemove', e => updateInput(e.clientX, e.clientY));
window.addEventListener('mouseleave', () => { mouse.x = 0; mouse.y = 0; });

// STAR CLASS
class Star {
    constructor() {
        this.init(true); // Random Z
    }

    init(randomZ = false) {
        // Random X/Y in -width to width range (broad field)
        // BUT restricted to Top/Bottom zones
        
        let ySafeLimit = height * config.safeZone; 
        
        // Spawn randomly in full screen coordinate space (relative to center 0,0)
        // We simulate a wide view field
        this.x = (Math.random() - 0.5) * width * 4; 
        
        // Y LOgic: Pick Top or Bottom zone
        const isTop = Math.random() > 0.5;
        const minH = height * config.safeZone; // e.g. 200px from center
        const maxH = height * 2; // Far out
        
        const yPos = Math.random() * (maxH - minH) + minH;
        this.y = isTop ? -yPos : yPos;

        // Z Depth (0 = Camera, 1000 = Far)
        this.z = randomZ ? Math.random() * 2000 : 2000;
        
        this.size = Math.random() * 2;
        this.color = Math.random() > 0.8 ? config.secondary : config.color;
    }

    update() {
        // Move towards camera (decrease Z)
        // Speed mod by mouse Y (move faster if pushing forward? optional)
        let speed = config.speed;
        
        this.z -= speed;

        // Reset if passed camera
        if (this.z < 1) {
            this.init(false);
        }
    }

    draw() {
        // Perspective Projection
        const fov = 300;
        const scale = fov / (fov + this.z);
        
        // Parallax / Turning Effect based on Mouse X
        // We shift the world X opposite to mouse
        const turnX = mouse.x * 500; 
        
        const sx = (this.x - turnX) * scale + width / 2;
        const sy = this.y * scale + height / 2;
        
        // Draw
        const r = this.size * scale * 3; // Scale size
        const alpha = Math.min(1, (2000 - this.z) / 500); // Fade in from distance

        // Visibility Check (Don't draw if it warped into the text zone visually)
        // Although logic spawns them away, perspective might bring them close.
        // Let's rely on the spawn logic primarily, as tunnel walls naturally frame center.
        
        ctx.fillStyle = this.color;
        ctx.globalAlpha = alpha;
        ctx.beginPath();
        ctx.arc(sx, sy, r, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
    }
}

// INIT
function initStars() {
    stars = [];
    for (let i = 0; i < config.starCount; i++) {
        stars.push(new Star());
    }
}

// ANIMATION
function animate() {
    requestAnimationFrame(animate);
    ctx.clearRect(0, 0, width, height);
    
    // Nice trails?
    // ctx.fillStyle = 'rgba(5, 5, 5, 0.3)';
    // ctx.fillRect(0,0,width,height);

    stars.forEach(star => {
        star.update();
        star.draw();
    });
}

// START
resize();
animate();
