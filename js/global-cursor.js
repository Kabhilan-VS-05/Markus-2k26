/**
 * MESCIA 26 - GLOBAL FLUID CURSOR
 * 
 * DESKTOP: "Fluid Splash" Effect (Mimics React Bits Reference).
 * - High density particles.
 * - Rainbow/Neon gradient cycling.
 * - Fluid drag physics (Cohesion/Trail).
 * 
 * MOBILE: Touch Ripple (Lag-free).
 */

const iCanvas = document.getElementById('cursor-canvas') || document.createElement('canvas');
if (!document.getElementById('cursor-canvas')) {
    iCanvas.id = 'cursor-canvas';
    iCanvas.style.position = 'fixed';
    iCanvas.style.top = '0';
    iCanvas.style.left = '0';
    iCanvas.style.width = '100%';
    iCanvas.style.height = '100%';
    iCanvas.style.zIndex = '9999';
    iCanvas.style.pointerEvents = 'none';
    document.body.appendChild(iCanvas);
}

const iCtx = iCanvas.getContext('2d');
let iWidth, iHeight;
let particles = [];
let ripples = [];

// DEVICE CHECK
const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

// RESIZE
function resizeInteraction() {
    iWidth = iCanvas.width = window.innerWidth;
    iHeight = iCanvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeInteraction);
resizeInteraction();

// FLUID PARTICLE (Desktop)
class FluidParticle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = Math.random() * 20 + 10; // Large, soft blobs
        this.life = 1; 
        this.decay = Math.random() * 0.03 + 0.01;
        
        // Fluid Motion
        this.vx = (Math.random() - 0.5) * 2;
        this.vy = (Math.random() - 0.5) * 2;
        
        // Rainbow Cycle based on position
        const hue = (Date.now() / 10) % 360; 
        this.color = `hsla(${hue}, 80%, 60%,`;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.life -= this.decay;
        this.size *= 0.96; // Shrink
    }

    draw() {
        // Soft Radial Gradient for "Blob" look
        const gradient = iCtx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size);
        gradient.addColorStop(0, this.color + this.life + ')');
        gradient.addColorStop(1, this.color + '0)'); // Transparent edge

        iCtx.fillStyle = gradient;
        iCtx.beginPath();
        iCtx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        iCtx.fill();
    }
}

// RIPPLE CLASS (Mobile)
class Ripple {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.radius = 0;
        this.alpha = 1;
    }

    update() {
        this.radius += 3;
        this.alpha -= 0.03;
    }

    draw() {
        iCtx.strokeStyle = `rgba(0, 245, 225, ${this.alpha})`;
        iCtx.lineWidth = 2;
        iCtx.beginPath();
        iCtx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        iCtx.stroke();
    }
}

// MOUSE HANDLER
if (!isTouchDevice) {
    let lastX = 0;
    let lastY = 0;
    
    window.addEventListener('mousemove', (e) => {
        // Interpolate for smoother stream
        const dist = Math.hypot(e.clientX - lastX, e.clientY - lastY);
        const steps = Math.min(dist / 2, 10); // Max interpolation points
        
        for (let i = 0; i < steps; i++) {
            const ix = lastX + (e.clientX - lastX) * (i / steps);
            const iy = lastY + (e.clientY - lastY) * (i / steps);
            particles.push(new FluidParticle(ix, iy));
        }
        
        lastX = e.clientX;
        lastY = e.clientY;
    });
} else {
    window.addEventListener('touchstart', (e) => {
        for (let i = 0; i < e.touches.length; i++) {
            ripples.push(new Ripple(e.touches[i].clientX, e.touches[i].clientY));
        }
    }, {passive: true});
}

// ANIMATION LOOP
function animateInteraction() {
    requestAnimationFrame(animateInteraction);
    iCtx.clearRect(0, 0, iWidth, iHeight);

    // Desktop: Use "lighter" composite for glowy splash
    if (!isTouchDevice) iCtx.globalCompositeOperation = 'lighter';

    for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();
        if (particles[i].life <= 0) {
            particles.splice(i, 1);
            i--;
        }
    }
    
    iCtx.globalCompositeOperation = 'source-over';

    // Mobile Ripples
    for (let i = 0; i < ripples.length; i++) {
        ripples[i].update();
        ripples[i].draw();
        if (ripples[i].alpha <= 0) {
            ripples.splice(i, 1);
            i--;
        }
    }
}

animateInteraction();
