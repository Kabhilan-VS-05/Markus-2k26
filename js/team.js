// TEAM COMPARE – DESKTOP + MOBILE SUPPORT (FINAL FIXED)

document.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById("compareBox");
    const beforePanel = document.getElementById("beforePanel");
    const afterPanel = document.getElementById("afterPanel");
    const handle = document.getElementById("handle");

    if (!container || !beforePanel || !afterPanel || !handle) {
        console.warn("Team compare elements missing");
        return;
    }

    let locked = false;
    let activeSide = null; // "before" | "after" | null

    function update(clientX) {
        if (locked) return;

        const rect = container.getBoundingClientRect();
        let x = clientX - rect.left;
        x = Math.max(0, Math.min(x, rect.width));
        const percent = (x / rect.width) * 100;

        beforePanel.style.transition = "none";
        afterPanel.style.transition = "none";

        beforePanel.style.clipPath = `inset(0 ${100 - percent}% 0 0)`;
        afterPanel.style.clipPath = `inset(0 0 0 ${percent}%)`;

        handle.style.left = `${percent}%`;
    }

    /* ==========================
       DRAG EVENTS
    ========================== */
    
    // Desktop Mouse Move
    container.addEventListener("mousemove", (e) => {
        update(e.clientX);
    });

    // Mobile Touch Move
    container.addEventListener("touchmove", (e) => {
        update(e.touches[0].clientX);
    }, { passive: true });
    
    // Initial touch start for instantaneous jump
    container.addEventListener("touchstart", (e) => {
        update(e.touches[0].clientX);
    }, { passive: true });


    /* ==========================
       FACULTY CONTACT HOVER
    ========================== */
    document.querySelectorAll(".before-panel .contact").forEach((btn) => {
        btn.addEventListener("mouseenter", () => {
            locked = true;
            activeSide = "before";

            beforePanel.style.clipPath = "inset(0 0 0 0)";
            afterPanel.style.clipPath = "inset(0 0 0 100%)";
            handle.style.opacity = "0";
        });

        btn.addEventListener("mouseleave", () => {
            locked = false;
            activeSide = null;
            handle.style.opacity = "1";
        });
    });

    /* ==========================
       STUDENT CONTACT HOVER
    ========================== */
    document.querySelectorAll(".after-panel .contact").forEach((btn) => {
        btn.addEventListener("mouseenter", () => {
            locked = true;
            activeSide = "after";

            beforePanel.style.clipPath = "inset(0 100% 0 0)";
            afterPanel.style.clipPath = "inset(0 0 0 0)";
            handle.style.opacity = "0";
        });

        btn.addEventListener("mouseleave", () => {
            locked = false;
            activeSide = null;
            handle.style.opacity = "1";
        });
    });

    /* ==========================
       MOBILE TAP CONTACT FIX
    ========================== */
    // Ensure tapping contact buttons doesn't just move the slider
    document.querySelectorAll(".contact").forEach(btn => {
        btn.addEventListener("touchstart", (e) => {
            e.stopPropagation(); // Prevent slider update
        });
    });
});
