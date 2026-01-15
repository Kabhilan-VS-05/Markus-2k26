// PREMIUM MULTI-LINE ZIG-ZAG TIMELINE

const wrapper = document.querySelector(".zigzag-wrapper");
const paths = document.querySelectorAll(".zigzag-path");
const items = document.querySelectorAll(".zigzag-item");

// Prepare all paths
paths.forEach(path => {
  const length = path.getTotalLength();
  path.dataset.length = length;
  path.style.strokeDasharray = length;
  path.style.strokeDashoffset = length;
});

window.addEventListener("scroll", () => {
  const rect = wrapper.getBoundingClientRect();
  const windowHeight = window.innerHeight;

  /* =========================
     DRAW / RETRACT ALL LINES
  ========================= */
  let progress = (windowHeight - rect.top) / rect.height;
  progress = Math.max(0, Math.min(1, progress));

  paths.forEach(path => {
    const length = path.dataset.length;
    path.style.strokeDashoffset =
      length - length * progress;
  });

  /* =========================
     CARD SEQUENCE ANIMATION
  ========================= */
  items.forEach((item, index) => {
    const itemRect = item.getBoundingClientRect();
    const trigger = windowHeight * 0.75;

    if (itemRect.top < trigger && itemRect.bottom > 0) {
      setTimeout(() => {
        item.classList.add("active");
      }, index * 160);
    } else {
      item.classList.remove("active");
    }
  });
});
