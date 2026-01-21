// GUIDELINES INTERACTION (Desktop vs Mobile)
document.addEventListener('DOMContentLoaded', () => {
    const cards = document.querySelectorAll('.guideline-card');
    
    // Bottom Sheet Elements
    const sheet = document.getElementById('guidelineSheet');
    const overlay = document.getElementById('sheetOverlay');
    const sheetContent = document.querySelector('.sheet-content');
    const sheetTitle = document.getElementById('sheetTitle');
    const sheetDesc = document.getElementById('sheetDesc');
    const sheetIcon = document.getElementById('sheetIcon');
    
    // State
    let currentIndex = 0;
    let guidelineData = [];

    // 1. Collect Data from DOM
    cards.forEach((card, index) => {
        guidelineData.push({
            icon: card.querySelector('.icon').innerHTML,
            title: card.querySelector('h4').textContent,
            desc: card.querySelector('p').textContent
        });
        
        // Add click listener
        card.addEventListener('click', () => handleCardClick(index, card));
    });

    // 2. Open Sheet Logic
    function handleCardClick(index, card) {
        const isMobile = window.innerWidth <= 768;

        if (isMobile && sheet) {
            currentIndex = index;
            updateSheetContent();
            openSheet();
        } else {
            // DESKTOP: Original Expand
            cards.forEach(c => {
                if (c !== card) c.classList.remove('active');
            });
            card.classList.toggle('active');
        }
    }

    function updateSheetContent() {
        const data = guidelineData[currentIndex];
        sheetIcon.innerHTML = data.icon;
        sheetTitle.textContent = data.title;
        sheetDesc.textContent = data.desc;
    }

    function openSheet() {
        sheet.classList.add('open');
        resetSheetPosition();
    }

    function closeSheet() {
        if(sheet) {
            sheet.classList.remove('open');
            // Wait for animation to finish before resetting transform
            setTimeout(resetSheetPosition, 300); 
        }
    }

    function resetSheetPosition() {
        if(sheetContent) {
            sheetContent.style.transform = `translateY(0)`;
            sheetContent.style.transition = `transform 0.3s cubic-bezier(0.2, 0.8, 0.2, 1), bottom 0.4s cubic-bezier(0.2, 0.8, 0.2, 1)`;
        }
    }

    // Close on Overlay Click
    if(overlay) {
        overlay.addEventListener('click', closeSheet);
    }

    // ==========================================
    // 3. MOBILE GESTURES (Drag & Swipe)
    // ==========================================
    
    let startY = 0;
    let startX = 0;
    let currentY = 0;
    let currentX = 0;
    let isDragging = false;

    if (sheetContent) {
        sheetContent.addEventListener('touchstart', (e) => {
            startY = e.touches[0].clientY;
            startX = e.touches[0].clientX;
            isDragging = true;
            sheetContent.style.transition = 'none'; // Disable transition for direct 1:1 movement
        }, { passive: true });

        sheetContent.addEventListener('touchmove', (e) => {
            if (!isDragging) return;

            currentY = e.touches[0].clientY;
            currentX = e.touches[0].clientX;
            
            const deltaY = currentY - startY;
            const deltaX = currentX - startX;

            // DRAG DOWN (Close) logic
            // Only allow dragging down (positive deltaY)
            if (deltaY > 0 && Math.abs(deltaY) > Math.abs(deltaX)) {
                // Resistance effect
                const translate = deltaY; 
                sheetContent.style.transform = `translateY(${translate}px)`;
            }
        }, { passive: true });

        sheetContent.addEventListener('touchend', (e) => {
            isDragging = false;
            const deltaY = currentY - startY;
            const deltaX = currentX - startX;

            // 1. Vertical Drag Check (Close)
            if (deltaY > 100 && Math.abs(deltaY) > Math.abs(deltaX)) {
                closeSheet();
            } 
            // 2. Horizontal Swipe Check (Navigation)
            else if (Math.abs(deltaX) > 50 && Math.abs(deltaX) > Math.abs(deltaY)) {
                // Swipe Left -> Next
                if (deltaX < 0) {
                    if (currentIndex < guidelineData.length - 1) {
                        currentIndex++;
                        animateSlide('left');
                    } else {
                        // Elastic bounce if at end
                        resetSheetPosition(); 
                    }
                } 
                // Swipe Right -> Prev
                else {
                    if (currentIndex > 0) {
                        currentIndex--;
                        animateSlide('right');
                    } else {
                        resetSheetPosition();
                    }
                }
            } 
            else {
                // Reset if threshold not met
                resetSheetPosition();
            }
        });
    }

    function animateSlide(direction) {
        // Simple slide visual: Fade out slightly, update, fade in
        // A full slide animation is complex without structural changes, 
        // so we'll do a quick opacity swap to indicate change.
        
        sheetContent.style.opacity = '0.5';
        sheetContent.style.transform = `translateX(${direction === 'left' ? '-20px' : '20px'})`;
        
        setTimeout(() => {
            updateSheetContent();
            sheetContent.style.opacity = '1';
            sheetContent.style.transform = `translateX(0)`;
            resetSheetPosition(); // Ensure Y is reset
        }, 150);
    }

});
