// Event Filtering Logic
document.addEventListener('DOMContentLoaded', () => {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('.stack-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Toggle Active State
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      cards.forEach(card => {
        if (filterValue === 'all') {
          card.style.display = 'flex';
        } else {
          if (card.classList.contains(filterValue)) {
            card.style.display = 'flex';
          } else {
            card.style.display = 'none';
          }
        }
      });
      
      // Refresh ScrollTrigger after layout change
      if(typeof ScrollTrigger !== 'undefined') {
          ScrollTrigger.refresh();
      }
    });
  });

  // GSAP Stack Animation - THE LEVEL SCROLL EFFECT
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);

    const stackCards = gsap.utils.toArray('.stack-card');
    
    stackCards.forEach((card, i) => {
      // 1. Enter Animation (Fade Up)
      gsap.fromTo(card, 
        { scale: 0.9, opacity: 0, y: 50 },
        {
          scale: 1, 
          opacity: 1,
          y: 0,
          duration: 0.5,
          ease: "power2.out",
          scrollTrigger: {
            trigger: card,
            start: "top 95%",
            toggleActions: "play none none reverse"
          }
        }
      );

      // 2. Level Stacking Effect (Scale Down as you scroll past)
      // This creates the "Depth" effect where top cards shrink as new ones arrive
      ScrollTrigger.create({
        trigger: card,
        start: "top 15%", // When card hits the sticky top
        end: "bottom 15%", // Until it's fully scrolled past
        scrub: true,
        onUpdate: (self) => {
          // Calculate scale based on progress (shrink slightly)
          const scale = 1 - (self.progress * 0.05); // Scales down to 0.95
          // Removed opacity fade as requested by user ("remove Transparency in container")
          
          gsap.to(card, { scale: scale, ease: "none", overwrite: "auto" });
        }
      });
    });
  }
});
