// REALISTIC WATER RIPPLE EFFECT - LIGHT MODE ONLY

// Create water ripple canvas
function createRealisticWaterCanvas() {
    // Only create in light mode
    if (document.documentElement.getAttribute('data-theme') !== 'light') {
        return;
    }
    
    // Check if canvas already exists
    if (document.getElementById('waterCanvas')) {
        return;
    }
    
    const canvas = document.createElement('canvas');
    canvas.id = 'waterCanvas';
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '9995';
    canvas.style.mixBlendMode = 'multiply';
    document.body.appendChild(canvas);
    
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    // Ripple storage with multiple waves
    const ripples = [];
    
    // Mouse position tracking
    let mouseX = 0;
    let mouseY = 0;
    let lastX = 0;
    let lastY = 0;
    let isMoving = false;
    
    // Create ripple on mouse move with velocity
    document.addEventListener('mousemove', (e) => {
        if (document.documentElement.getAttribute('data-theme') === 'light') {
            const dx = e.clientX - lastX;
            const dy = e.clientY - lastY;
            const velocity = Math.sqrt(dx * dx + dy * dy);
            
            mouseX = e.clientX;
            mouseY = e.clientY;
            
            // Create ripple based on movement speed
            if (velocity > 2) {
                ripples.push({
                    x: mouseX,
                    y: mouseY,
                    radius: 0,
                    maxRadius: 80 + velocity * 2,
                    opacity: 0.6,
                    speed: 1.5 + velocity * 0.1,
                    frequency: 3, // Multiple waves
                    phase: 0
                });
            }
            
            lastX = mouseX;
            lastY = mouseY;
            isMoving = true;
        }
    });
    
    // Create larger ripple on click
    document.addEventListener('click', (e) => {
        if (document.documentElement.getAttribute('data-theme') === 'light') {
            // Create multiple concentric ripples for splash effect
            for (let i = 0; i < 3; i++) {
                setTimeout(() => {
                    ripples.push({
                        x: e.clientX,
                        y: e.clientY,
                        radius: 0,
                        maxRadius: 200,
                        opacity: 0.8 - i * 0.2,
                        speed: 3 - i * 0.5,
                        frequency: 5,
                        phase: i * Math.PI / 3
                    });
                }, i * 100);
            }
        }
    });
    
    // Animation loop with realistic water physics
    function animate() {
        // Clear canvas with slight trail for water effect
        ctx.fillStyle = 'rgba(240, 253, 250, 0.1)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Only animate in light mode
        if (document.documentElement.getAttribute('data-theme') === 'light') {
            // Update and draw ripples
            for (let i = ripples.length - 1; i >= 0; i--) {
                const ripple = ripples[i];
                
                // Update ripple with wave physics
                ripple.radius += ripple.speed;
                ripple.phase += 0.1;
                ripple.opacity -= 0.008;
                ripple.speed *= 0.98; // Deceleration
                
                // Remove if faded
                if (ripple.opacity <= 0 || ripple.radius >= ripple.maxRadius) {
                    ripples.splice(i, 1);
                    continue;
                }
                
                // Draw multiple concentric waves
                for (let w = 0; w < ripple.frequency; w++) {
                    const waveRadius = ripple.radius - w * 15;
                    if (waveRadius <= 0) continue;
                    
                    const waveOpacity = ripple.opacity * (1 - w / ripple.frequency);
                    
                    // Draw wave with gradient
                    ctx.beginPath();
                    ctx.arc(ripple.x, ripple.y, waveRadius, 0, Math.PI * 2);
                    
                    // Realistic water gradient
                    const gradient = ctx.createRadialGradient(
                        ripple.x, ripple.y, waveRadius * 0.5,
                        ripple.x, ripple.y, waveRadius
                    );
                    
                    gradient.addColorStop(0, `rgba(6, 182, 212, ${waveOpacity * 0.4})`);
                    gradient.addColorStop(0.5, `rgba(139, 92, 246, ${waveOpacity * 0.3})`);
                    gradient.addColorStop(0.8, `rgba(6, 182, 212, ${waveOpacity * 0.2})`);
                    gradient.addColorStop(1, 'transparent');
                    
                    ctx.fillStyle = gradient;
                    ctx.fill();
                    
                    // Wave crest (white foam)
                    ctx.strokeStyle = `rgba(255, 255, 255, ${waveOpacity * 0.8})`;
                    ctx.lineWidth = 2;
                    ctx.stroke();
                    
                    // Wave trough (darker water)
                    if (waveRadius > 5) {
                        ctx.beginPath();
                        ctx.arc(ripple.x, ripple.y, waveRadius - 5, 0, Math.PI * 2);
                        ctx.strokeStyle = `rgba(6, 182, 212, ${waveOpacity * 0.6})`;
                        ctx.lineWidth = 1;
                        ctx.stroke();
                    }
                }
                
                // Add shimmer effect at wave peak
                const shimmerAngle = ripple.phase;
                const shimmerX = ripple.x + Math.cos(shimmerAngle) * ripple.radius * 0.7;
                const shimmerY = ripple.y + Math.sin(shimmerAngle) * ripple.radius * 0.7;
                
                const shimmerGradient = ctx.createRadialGradient(
                    shimmerX, shimmerY, 0,
                    shimmerX, shimmerY, 20
                );
                shimmerGradient.addColorStop(0, `rgba(255, 255, 255, ${ripple.opacity * 0.5})`);
                shimmerGradient.addColorStop(1, 'transparent');
                
                ctx.fillStyle = shimmerGradient;
                ctx.fillRect(shimmerX - 20, shimmerY - 20, 40, 40);
            }
        } else {
            // Clear ripples in dark mode
            ripples.length = 0;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
        
        requestAnimationFrame(animate);
    }
    
    animate();
    
    // Handle window resize
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', createRealisticWaterCanvas);
} else {
    createRealisticWaterCanvas();
}

// Recreate canvas when theme changes
const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
        if (mutation.attributeName === 'data-theme') {
            const theme = document.documentElement.getAttribute('data-theme');
            const canvas = document.getElementById('waterCanvas');
            
            if (theme === 'light' && !canvas) {
                createRealisticWaterCanvas();
            } else if (theme === 'dark' && canvas) {
                canvas.remove();
            }
        }
    });
});

observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-theme']
});
