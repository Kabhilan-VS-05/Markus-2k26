// GUIDELINES EXPANDING STRIP
// Logic to handle mobile interactions or specialized behavior if needed.
// Currently, the expanding effect is fully handled by CSS transitions.

document.addEventListener('DOMContentLoaded', () => {
    // Optional: Add tap functionality for mobile if hover isn't sufficient
    const cards = document.querySelectorAll('.guideline-card');
    
    cards.forEach(card => {
        card.addEventListener('click', () => {
            // Collapse others
            cards.forEach(c => {
                if (c !== card) c.classList.remove('active');
            });
            // Toggle current
            card.classList.toggle('active');
        });
    });
});
