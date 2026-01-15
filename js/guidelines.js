// PROFESSIONAL GUIDELINES SCROLL ANIMATIONS
document.addEventListener('DOMContentLoaded', () => {
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);

    // STAGGERED REVEAL ANIMATION
    const guidelineCards = gsap.utils.toArray('.guideline-card');
    
    // Set initial state
    gsap.set(guidelineCards, { 
      opacity: 0,
      y: 80,
      rotationY: -15,
      scale: 0.8
    });

    // Stagger animation - cards appear one after another
    gsap.to(guidelineCards, {
      opacity: 1,
      y: 0,
      rotationY: 0,
      scale: 1,
      duration: 1,
      ease: "back.out(1.2)",
      stagger: {
        amount: 1.2, // Total time to stagger all cards
        from: "start", // Start from first card
        ease: "power2.inOut"
      },
      scrollTrigger: {
        trigger: '.guidelines-section',
        start: 'top 70%',
        end: 'bottom 70%',
        toggleActions: 'play none none reverse'
      }
    });

    // PARALLAX BACKGROUND EFFECT
    gsap.to('.guidelines-section::before', {
      yPercent: 30,
      ease: "none",
      scrollTrigger: {
        trigger: '.guidelines-section',
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1
      }
    });

    // INDIVIDUAL CARD MICRO-INTERACTIONS
    guidelineCards.forEach((card, index) => {
      // Floating animation on hover
      card.addEventListener('mouseenter', () => {
        gsap.to(card, {
          y: -8,
          duration: 0.4,
          ease: "power2.out"
        });
      });

      card.addEventListener('mouseleave', () => {
        gsap.to(card, {
          y: 0,
          duration: 0.4,
          ease: "power2.out"
        });
      });

      // Icon pulse on scroll into view
      ScrollTrigger.create({
        trigger: card,
        start: 'top 85%',
        onEnter: () => {
          const icon = card.querySelector('.icon');
          gsap.fromTo(icon, 
            { scale: 0.5, rotation: -180 },
            { 
              scale: 1, 
              rotation: 0,
              duration: 0.8,
              ease: "back.out(2)"
            }
          );
        }
      });
    });
  }
});
