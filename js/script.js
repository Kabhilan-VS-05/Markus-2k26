// Navbar scroll behavior (unchanged)
// Navbar scroll behavior with BOUNCE
let isBouncing = false;

window.addEventListener("scroll", () => {
  const navbar = document.getElementById("navbar");
  
  // Toggle Scrolled State
  navbar.classList.toggle("scrolled", window.scrollY > 60);

  // Bounce on Top Reach
  if (window.scrollY === 0 && !isBouncing) {
    isBouncing = true;
    navbar.classList.add("navbar-bounce");
    
    // Remove class after animation to allow re-trigger
    setTimeout(() => {
      navbar.classList.remove("navbar-bounce");
      isBouncing = false;
    }, 600);
  }
});

// Mobile menu
document.getElementById("menuToggle").onclick = () => {
  document.getElementById("navLinks").classList.toggle("show");
};


// Countdown
const targetDate = new Date("February 27, 2026 09:00:00").getTime();

setInterval(() => {
  const now = new Date().getTime();
  const diff = targetDate - now;

  document.getElementById("days").innerText =
    Math.floor(diff / (1000 * 60 * 60 * 24));
  document.getElementById("hours").innerText =
    Math.floor((diff / (1000 * 60 * 60)) % 24);
  document.getElementById("mins").innerText =
    Math.floor((diff / (1000 * 60)) % 60);
  document.getElementById("secs").innerText =
    Math.floor((diff / 1000) % 60);
}, 1000);

// GUIDELINES 3D SPATIAL ZOOM (GSAP)
document.addEventListener('DOMContentLoaded', () => {
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);

    // UNIFIED 3D SPATIAL ZOOM (Events, Guidelines, Timeline, Team)
    // Applies 3D fly-in effect to multiple container types
    // REMOVED .stack-card TO PREVENT CONFLCIT WITH events.js
    const cards = document.querySelectorAll('.guideline-card, .zigzag-card, .person, .faculty-highlight');

    // Reset initial CSS state
    gsap.set(cards, { opacity: 0 });

    cards.forEach((card) => {
      gsap.fromTo(card, 
        { 
          opacity: 0, 
          z: -500,       // Start back
          rotationX: 30, // 3D Tilt
          y: 50         
        },
        {
          opacity: 1,
          z: 0,
          rotationX: 0,
          y: 0,
          duration: 1,
          ease: "none",   // LINEAR - "Linear Effect" as requested
          scrollTrigger: {
            trigger: card,
            start: "top 85%", 
            end: "bottom 70%",
            scrub: 1      // Smooth scrubbing
          }
        }
      );
    });
  }
});

// Smooth scroll with offset for event card navigation
document.addEventListener('DOMContentLoaded', () => {
  // Handle all anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      
      // Skip if it's just "#"
      if (href === '#') {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
      
      const targetId = href.substring(1);
      const targetElement = document.getElementById(targetId);
      
      if (targetElement) {
        e.preventDefault();
        
        // MANUAL SCROLL CALCULATION (More reliable for sticky elements)
        const navbarHeight = 100; // Approx navbar height
        const stickyOffset = window.innerHeight * 0.15; // 15vh
        const extraPadding = 20;

        // Get the element's true position in the document (ignoring sticky visual displacement)
        const elementTop = targetElement.getBoundingClientRect().top + window.scrollY;
        
        // Target scroll position: Element Top - (Navbar + Sticky Offset)
        const offsetPosition = elementTop - (navbarHeight + stickyOffset + extraPadding);

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
});
