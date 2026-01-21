// OS DOCK MAGNIFICATION LOGIC
document.addEventListener('DOMContentLoaded', () => {
    const dockContainer = document.querySelector('.dock');
    const dockItems = document.querySelectorAll('.dock-item');

    if (!dockContainer || dockItems.length === 0) return;

    const baseScale = 1;
    const maxScale = 1.8;
    const range = 150; // Distance in pixels to start scaling

    document.addEventListener('mousemove', (e) => {
        const mouseX = e.clientX;
        const mouseY = e.clientY;

        dockItems.forEach(item => {
            const rect = item.getBoundingClientRect();
            const itemX = rect.left + rect.width / 2;
            const itemY = rect.top + rect.height / 2;

            // Calculate distance from mouse to icon center
            const distance = Math.sqrt(
                Math.pow(mouseX - itemX, 2) + Math.pow(mouseY - itemY, 2)
            );

            if (distance < range) {
                // Smoothly scale based on distance
                const scale = maxScale - (distance / range) * (maxScale - baseScale);
                item.style.transform = `scale(${scale})`;
                
                // Also adjust vertical offset to keep icons aligned at bottom
                // (transform-origin is set to bottom center in CSS, so scale handles this)
            } else {
                item.style.transform = `scale(${baseScale})`;
            }
        });
    });

    // Reset scales when mouse leaves the dock container area significantly
    dockContainer.addEventListener('mouseleave', () => {
        dockItems.forEach(item => {
            item.style.transform = `scale(${baseScale})`;
        });
    });

    // Handle click to scroll (standard behavior for dock items with href="#")
    dockItems.forEach(item => {
        item.addEventListener('click', (e) => {
            const href = item.getAttribute('href');
            if (href.startsWith('#')) {
                e.preventDefault();
                const targetId = href.substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth'
                    });
                } else if (href === '#') {
                   window.scrollTo({ top: 0, behavior: 'smooth' });
                }
            }
        });
    });
});
