document.addEventListener("DOMContentLoaded", () => {
    const guidelinesData = [
        {
            title: "Reporting Time",
            icon: "ri-time-line",
            desc: "Efficiency is key. All participants are required to report at the main registration desk by 08:45 AM. Ensure your presence to maintain the symposium schedule."
        },
        {
            title: "ID Card Required",
            icon: "ri-bank-card-line",
            desc: "Identity verification is mandatory. Your College ID card serves as your access key to all event venues and technical labs. No entry without a valid ID."
        },
        {
            title: "Personal Devices",
            icon: "ri-computer-line",
            desc: "Bring your own firepower. Personal laptops are permitted and encouraged for all Coding and Design events. Ensure all required software is pre-installed."
        },
        {
            title: "Mobile Phones",
            icon: "ri-smartphone-line",
            desc: "Maintain digital decorum. All mobile devices must be switched to silent mode throughout the sessions to ensure an uninterrupted technical environment."
        },
        {
            title: "Code of Conduct",
            icon: "ri-scales-3-line",
            desc: "Professionalism is expected. Strict adherence to the symposium's code of conduct is mandatory. Collaboration and competition must remain respectful."
        },
        {
            title: "Registration Pass",
            icon: "ri-ticket-line",
            desc: "Digital protocol ready. Keep your registration pass (digital or printed) accessible at all times for verification during event transitions."
        },
        {
            title: "Formal Attire",
            icon: "ri-shirt-line",
            desc: "Dress for success. Decent casual or formal attire is expected, especially for Paper and Project presentations. Present your best self."
        },
        {
            title: "Lunch & Refreshments",
            icon: "ri-restaurant-line",
            desc: "System recharging. Full lunch will be served in the cafeteria for all registered participants. Refreshments will be provided during session breaks."
        },
        {
            title: "Certificates",
            icon: "ri-award-line",
            desc: "Recognition of merit. Participation e-certificates will be generated and issued to all attendees via the registered email after the event completion."
        },
        {
            title: "Technical Help",
            icon: "ri-tools-line",
            desc: "Backend support. Our technical volunteer team is stationed at every venue to assist with software, hardware, or connectivity requirements."
        }
    ];

    const navItems = document.querySelectorAll(".nav-item");
    const screenTitle = document.getElementById("terminalTitle");
    const screenIcon = document.getElementById("terminalIcon");
    const screenBody = document.getElementById("terminalBody");
    const terminalScreen = document.querySelector(".terminal-screen");

    let isTyping = false;

    function typeWriter(text, element) {
        let i = 0;
        element.innerHTML = "";
        isTyping = true;
        
        function type() {
            if (i < text.length) {
                element.innerHTML += text.charAt(i);
                i++;
                setTimeout(type, 15);
            } else {
                isTyping = false;
            }
        }
        type();
    }

    function updateDisplay(index) {
        if (isTyping) return;

        const data = guidelinesData[index];

        // Flicker effect
        terminalScreen.classList.add("flicker");
        
        setTimeout(() => {
            screenIcon.innerHTML = `<i class="${data.icon}"></i>`;
            screenTitle.innerText = data.title;
            typeWriter(data.desc, screenBody);
            
            setTimeout(() => {
                terminalScreen.classList.remove("flicker");
            }, 300);
        }, 150);
    }

    navItems.forEach((item, index) => {
        item.addEventListener("click", () => {
            if (item.classList.contains("active") || isTyping) return;

            document.querySelector(".nav-item.active").classList.remove("active");
            item.classList.add("active");
            updateDisplay(index);
        });
    });

    // ==================== 3D CAROUSEL LOGIC ====================
    const carouselContainer = document.getElementById("carouselContainer");
    const blades = document.querySelectorAll(".data-blade");
    const indicatorsContainer = document.getElementById("carouselIndicators");
    
    let currentIndex = 0;
    let anglePerCard = 360 / blades.length;
    let startX = 0;
    let isDragging = false;

    // Create indicator dots
    blades.forEach((_, index) => {
        const dot = document.createElement("div");
        dot.className = "indicator-dot";
        if (index === 0) dot.classList.add("active");
        dot.addEventListener("click", () => goToSlide(index));
        indicatorsContainer.appendChild(dot);
    });

    function updateCarousel() {
        blades.forEach((blade, index) => {
            // Calculate effective angle difference considering infinite rotation
            const angle = anglePerCard * (index - currentIndex);
            
            // Normalize angle for visibility check
            let normalizedAngle = angle % 360;
            if (normalizedAngle > 180) normalizedAngle -= 360;
            if (normalizedAngle < -180) normalizedAngle += 360;

            // Only show cards within viewing range
            const isVisible = Math.abs(normalizedAngle) < 100;
            blade.style.opacity = isVisible ? (1 - Math.abs(normalizedAngle) / 100) : 0;
            
            const distance = 280; // Distance from center

            // 3D Transform
            blade.style.transform = `
                translate(-50%, -50%) 
                rotateY(${angle}deg) 
                translateZ(${distance}px)
            `;

            // Update active state (using modulo for circular indexing of the actual array)
            const realActiveIndex = ((currentIndex % blades.length) + blades.length) % blades.length;
            
            blade.classList.remove("active");
            if (index === realActiveIndex) {
                blade.classList.add("active");
                // Pop the active card forward
                blade.style.transform = `
                    translate(-50%, -50%) 
                    rotateY(${angle}deg) 
                    translateZ(${distance + 60}px)
                `;
            }
        });

        // Update indicators
        const realActiveIndex = ((currentIndex % blades.length) + blades.length) % blades.length;
        document.querySelectorAll(".indicator-dot").forEach((dot, index) => {
            dot.classList.toggle("active", index === realActiveIndex);
        });
    }

    function goToSlide(index) {
        // We accept the raw index (which might be huge or negative)
        // If coming from a click on a specific dot (0-9), we need to find the "nearest" usage of that index relative to current
        // But simply setting it for nav buttons (current +/- 1) is easiest.
        
        // If this is a specific index request (like clicking a dot), we find the closest "infinite" equivalent
        // Logic: if current is 10, and we want slide 2. 2 could be 2, 12, -8... closest to 10 is 12.
        
        if (Math.abs(index - currentIndex) > blades.length / 2) {
             // Heuristic: If jump is too big, it might be a "wrap" attempt, but let's just trust variable "delta" logic usually used.
             // For simplicity in this codebase, we'll assume goToSlide is mostly called with +/- 1 or initial.
             // If clicking dots, we might spin. That's acceptable for dots. For arrows, we need incremental.
        }
        
        currentIndex = index; 
        updateCarousel();
    }

    function nextSlide() {
        goToSlide(currentIndex + 1);
    }

    function prevSlide() {
        goToSlide(currentIndex - 1);
    }

    // Touch/Mouse events for swipe
    carouselContainer.addEventListener("mousedown", (e) => {
        isDragging = true;
        startX = e.clientX;
    });

    carouselContainer.addEventListener("touchstart", (e) => {
        isDragging = true;
        startX = e.touches[0].clientX;
    });

    carouselContainer.addEventListener("mousemove", (e) => {
        if (!isDragging) return;
        const diffX = e.clientX - startX;
        if (Math.abs(diffX) > 50) {
            if (diffX > 0) {
                prevSlide();
            } else {
                nextSlide();
            }
            isDragging = false;
        }
    });

    carouselContainer.addEventListener("touchmove", (e) => {
        if (!isDragging) return;
        const diffX = e.touches[0].clientX - startX;
        if (Math.abs(diffX) > 50) {
            if (diffX > 0) {
                prevSlide();
            } else {
                nextSlide();
            }
            isDragging = false;
        }
    });

    carouselContainer.addEventListener("mouseup", () => {
        isDragging = false;
    });

    carouselContainer.addEventListener("touchend", () => {
        isDragging = false;
    });

    // Click on card to rotate to it
    blades.forEach((blade, index) => {
        blade.addEventListener("click", () => {
            if (index !== currentIndex) {
                goToSlide(index);
            }
        });
    });

    // Initialize carousel
    updateCarousel();

    // Auto-rotate (optional, remove if not needed)
    let autoRotate = setInterval(nextSlide, 5000);

    // Navigation Buttons
    const nextBtn = document.getElementById("nextBtn");
    const prevBtn = document.getElementById("prevBtn");

    if (nextBtn) nextBtn.addEventListener("click", nextSlide);
    if (prevBtn) prevBtn.addEventListener("click", prevSlide);

    carouselContainer.addEventListener("mouseenter", () => {
        clearInterval(autoRotate);
    });

    carouselContainer.addEventListener("mouseleave", () => {
        autoRotate = setInterval(nextSlide, 5000);
    });

    // Initialize first item for desktop terminal
    if (navItems.length > 0) {
        updateDisplay(0);
    }
});
