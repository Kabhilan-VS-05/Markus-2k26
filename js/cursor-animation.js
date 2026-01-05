// Enhanced Cursor Glow Effect - Follows Mouse Smoothly
const cursorGlow = document.querySelector('.cursor-glow');
let mouseX = 0, mouseY = 0;
let glowX = 0, glowY = 0;

document.addEventListener('mousemove', (e) => {
    // Disable on touch devices
    if (!window.matchMedia("(pointer: fine)").matches) return;

    mouseX = e.clientX;
    mouseY = e.clientY;
    if (cursorGlow) cursorGlow.style.opacity = '1';
});

document.addEventListener('mouseleave', () => {
    if (cursorGlow) cursorGlow.style.opacity = '0';
});

// Smooth animation loop for cursor glow
function animateCursorGlow() {
    if (!cursorGlow) return;
    
    // Stop animation on touch devices
    if (!window.matchMedia("(pointer: fine)").matches) return;
    
    glowX += (mouseX - glowX) * 0.1;
    glowY += (mouseY - glowY) * 0.1;
    
    cursorGlow.style.left = glowX + 'px';
    cursorGlow.style.top = glowY + 'px';
    
    requestAnimationFrame(animateCursorGlow);
}
animateCursorGlow();

// Ripple effect on click
document.addEventListener('click', (e) => {
    const ripple = document.createElement('div');
    ripple.className = 'cursor-ripple';
    ripple.style.left = e.clientX + 'px';
    ripple.style.top = e.clientY + 'px';
    document.body.appendChild(ripple);
    
    setTimeout(() => ripple.remove(), 600);
});
