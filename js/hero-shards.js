/**
 * MESCIA 26 - MAGNETIC SHARDS INTERACTIVE CANVAS
 * Concept: A "Zero-Gravity Debris Field" where tech shards float and 
 * align positively/magnetically to the user's touch/cursor, creating a living field effect.
 * Optimized for maximum mobile performance (Low object count, simple geometry).
 */

const canvas = document.getElementById('neural-canvas');
const ctx = canvas.getContext('2d');

let width, height;
let shards = [];
// Mouse state: x, y, active
let mouse = { x: -1000, y: -1000, active: false };

// DEVICE DETECTION & CONFIG
const isMobile = window.innerWidth < 768;

const config = {
    shardCount: isMobile ? 30 : 60,   // Restored count slightly
    maxSize: isMobile ? 15 : 20,
    baseSpeed: 1.5,
    rotSpeed: 0.1,
    colors: ['rgba(0, 245, 225, 0.6)'] // Increased Opacity for better visibility
};

// RESIZE
function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
}
window.addEventListener('resize', () => {
    resize();
    initShards();
});
resize();

// INPUT HANDLING (Unified Mouse & Touch)
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

// SHARD CLASS
class Shard {
    constructor() {
        this.init(true);
    }

    init(randomY = false) {
        this.x = Math.random() * width;
        this.y = randomY ? Math.random() * height : height + 20; // Spawn from bottom if not random
        
        this.size = (Math.random() * 0.5 + 0.5) * config.maxSize; // Size variation
        this.color = config.colors[Math.floor(Math.random() * config.colors.length)];
        
        // Movement Vectors (Slow drift upwards/randomly)
        this.vx = (Math.random() - 0.5) * config.baseSpeed;
        this.vy = -(Math.random() * config.baseSpeed * 1.5 + 0.2); // Upward drift
        
        this.angle = Math.random() * Math.PI * 2;
        this.rotVel = (Math.random() - 0.5) * 0.02;
    }

    update() {
        // 1. Basic Movement
        this.x += this.vx;
        this.y += this.vy;
        this.angle += this.rotVel;

        // 2. Interactive "Magnetic" Alignment
        // If mouse/touch is active, shards rotate to face it and accelerate slightly towards it
        if (mouse.active) {
            const dx = mouse.x - this.x;
            const dy = mouse.y - this.y;
            const dist = Math.sqrt(dx*dx + dy*dy);
            
            // Interaction Radius (large enough to feel immersive)
            if (dist < 400) {
                // Calculate target angle (facing the cursor)
                const targetAngle = Math.atan2(dy, dx);
                
                // Smoothly rotate towards target
                // Lerp angle logic (handling the PI wraparound is tricky, simplified here)
                let diff = targetAngle - this.angle;
                // Normalize diff to -PI to PI
                while (diff > Math.PI) diff -= Math.PI * 2;
                while (diff < -Math.PI) diff += Math.PI * 2;
                
                this.angle += diff * 0.05; // 0.05 = Rotate speed strength

                // Slight attraction (Gravity)
                this.x += (dx / dist) * 0.5;
                this.y += (dy / dist) * 0.5;
            }
        }

        // 3. Central Content Avoidance (Self-Avoiding Logic)
        // Shards will gently steer away from the center of the screen to protect readability
        const centerX = width / 2;
        const centerY = height / 2;
        const distFromCenter = Math.sqrt((this.x - centerX)**2 + (this.y - centerY)**2);
        
        // Deadzone radius (shards will stay away from here)
        const deadzone = isMobile ? 150 : 250; // Slightly smaller deadzone
        if (distFromCenter < deadzone) {
            const pushX = (this.x - centerX) / distFromCenter;
            const pushY = (this.y - centerY) / distFromCenter;
            const pushFactor = (deadzone - distFromCenter) / deadzone;
            
            this.vx += pushX * pushFactor * 0.05;
            this.vy += pushY * pushFactor * 0.05;
        }

        // 4. Screen Wrap / Reset
        if (this.y < -50) this.y = height + 50;
        if (this.x > width + 50) this.x = -50;
        if (this.x < -50) this.x = width + 50;
    }

    draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);

        ctx.strokeStyle = this.color;
        ctx.lineWidth = 1.2; // Slightly thicker lines for visibility
        
        // Draw: A hollow futuristic triangle/shard
        ctx.beginPath();
        ctx.moveTo(-this.size, -this.size / 2);
        ctx.lineTo(this.size, 0); // Pointy end
        ctx.lineTo(-this.size, this.size / 2);
        ctx.closePath();
        
        // Glow effect (Expensive on mobile? Keep minimal)
        if (!isMobile) {
            ctx.shadowBlur = 10;
            ctx.shadowColor = this.color;
        }

        ctx.stroke();

        // Optional: Small center dot
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(0, 0, 1, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
    }
}

// INIT
function initShards() {
    shards = [];
    for (let i = 0; i < config.shardCount; i++) {
        shards.push(new Shard());
    }
}

// ANIM LOOP
function animate() {
    requestAnimationFrame(animate);
    
    // Clear with trail effect? No, clean clear for better performance
    ctx.clearRect(0, 0, width, height);
    
    // Global Composite for "Cyber" feel
    ctx.globalCompositeOperation = 'lighter'; // Addsitive blending for neon feel

    shards.forEach(shard => {
        shard.update();
        shard.draw();
    });
    
    ctx.globalCompositeOperation = 'source-over';
}

// Start
initShards();
animate();
