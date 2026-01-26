// Register GSAP Plugins
gsap.registerPlugin(ScrollTrigger);

// 1. MARQUEE ANIMATION (Parallax Stream Effect)
const marqueeFront = document.querySelector('.BlockIntro_streamWrapper.front');
const marqueeBack = document.querySelector('.BlockIntro_streamWrapper.back');

if (marqueeFront && marqueeBack && window.innerWidth > 900) {
  // Front Layer - Fast Scroll
  gsap.to(marqueeFront, {
    x: -300, // Move left
    ease: "none",
    scrollTrigger: {
      trigger: ".about-icons-section",
      start: "top bottom",
      end: "bottom top",
      scrub: 1
    }
  });

  // Back Layer - Slower/Reverse Scroll (Parallax Depth)
  gsap.to(marqueeBack, {
    x: -100, // Move less (slower)
    ease: "none",
    scrollTrigger: {
      trigger: ".about-icons-section",
      start: "top bottom",
      end: "bottom top",
      scrub: 1.5
    }
  });
}


// 2. ABOUT CARDS - STAGGERED REVEAL
const aboutCards = document.querySelectorAll('.about-card');

if (aboutCards.length > 0) {
  const isMobile = window.innerWidth < 900;
  
  gsap.fromTo(aboutCards, 
    { 
      y: 100, 
      opacity: 0,
      rotateX: isMobile ? 0 : -15 // SKIP 3D ON MOBILE
    },
    {
      y: 0,
      opacity: 1,
      rotateX: 0,
      duration: 1,
      stagger: 0.15,
      ease: "power3.out",
      scrollTrigger: {
        trigger: ".about-icons-grid",
        start: "top 85%", 
        toggleActions: "play none none reverse"
      }
    }
  );
}

// 3. 3D HOVER EFFECT (Mouse Move)
// Adds a subtle tilt following the mouse for that "Apple TV" feel
// 3. 3D HOVER EFFECT (Mouse Move) - DESKTOP ONLY
if (window.innerWidth > 900) {
    aboutCards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = ((y - centerY) / centerY) * -10;
        const rotateY = ((x - centerX) / centerX) * 10;
        
        gsap.to(card, {
          rotateX: rotateX,
          rotateY: rotateY,
          duration: 0.5,
          ease: "power2.out"
        });
      });
    
      card.addEventListener('mouseleave', () => {
        gsap.to(card, {
          rotateX: 0,
          rotateY: 0,
          duration: 0.5,
          ease: "power2.out"
        });
      });
    });
}


// 5. BLUR SCROLL EFFECT (Focus on Center)
// 5. BLUR SCROLL EFFECT - DESKTOP ONLY
if (window.innerWidth > 900) {
    aboutCards.forEach(card => {
      gsap.fromTo(card,
        { filter: "blur(5px)", opacity: 0.6, scale: 0.95 }, 
        {
          filter: "blur(0px)",
          opacity: 1,
          scale: 1,
          duration: 1,
          scrollTrigger: {
            trigger: card,
            start: "top 70%", 
            end: "top 30%", 
            scrub: 1
          }
        }
      );
      
      gsap.to(card, {
        filter: "blur(5px)",
        opacity: 0.6,
        scale: 0.95,
        scrollTrigger: {
          trigger: card,
          start: "bottom 30%",
          end: "bottom 0%",
          scrub: 1
        }
      });
    });
}

// 6. PARALLAX COLUMNS (Restored Logic)
const gridContainer = document.querySelector('.about-icons-grid');
if (gridContainer && window.innerWidth > 900) {
  // Middle Column (2nd Child)
  const middleCol = gridContainer.children[1];
  // Right Column (3rd Child)
  const rightCol = gridContainer.children[2];

  if (middleCol) {
    gsap.to(middleCol, {
      y: -80, // Moves UP faster
      ease: "none",
      scrollTrigger: {
        trigger: ".about-icons-grid",
        start: "top bottom",
        end: "bottom top",
        scrub: 1
      }
    });
  }

  if (rightCol) {
    gsap.to(rightCol, {
      y: 40, // Moves DOWN slower (Lag)
      ease: "none",
      scrollTrigger: {
        trigger: ".about-icons-grid",
        start: "top bottom",
        end: "bottom top",
        scrub: 1
      }
    });
  }
}


