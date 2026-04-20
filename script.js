// disable auto restore scroll
if ("scrollRestoration" in history) {
  history.scrollRestoration = "manual";
}

// TUTORIAL

const hint = document.getElementById("hint");

document.body.addEventListener("click", () => {
    hint.classList.add("hide");
});

// === DATA TEXT ===
const text1 = "Halo Temanku, aku inget hari ini hari yang spesial buat kamu...";
const text2 = "Dan aku cuma mau bilang, aku bersyukur banget bisa ketemu sama kamu";
const text3 = "Seseorang yang istimewa, yang selalu punya cara sederhana buat bikin semuanya terasa indah";
const text4 = "Yang tanpa sadar jadi orang yang berarti dalam hidup aku";
const text5 = "Dan dari semua itu, aku belajar banyak hal baik dari kamu";
const lastText = "Kalau boleh aku bilang satu hal, jangan terlalu keras sama diri sendiri yaaa";

// === ELEMENT ===
const el1 = document.getElementById("typing1");
const el2 = document.getElementById("typing2");
const el3 = document.getElementById("typing3");
const el4 = document.getElementById("typing4");
const el5 = document.getElementById("typing5");
const elLast = document.getElementById("typing-last");
const finalText = document.getElementById("final-text");
const closingText = document.getElementById("closing-text");

let typed1 = false;
let typed2 = false;
let typed3 = false;
let typed4 = false;
let typed5 = false;

// BACKGROUND COLOR
const bg = document.getElementById("bg");

// daftar warna (atas → bawah)
const colors = [
  ["#020617", "#0f172a"], // section 1
  ["#0f172a", "#1e3a8a"], // section 2
  ["#1e3a8a", "#2563eb"], // section 3
  ["#2563eb", "#7c3aed"], // section 4
  ["#7c3aed", "#db2777"], // section 5
  ["#db2777", "#f472b6"], // section 6
];

// helper: hex → rgb
function hexToRgb(hex) {
  let bigint = parseInt(hex.replace("#", ""), 16);
  return {
    r: (bigint >> 16) & 255,
    g: (bigint >> 8) & 255,
    b: bigint & 255,
  };
}

// helper: mix warna
function lerpColor(c1, c2, t) {
  return {
    r: Math.round(c1.r + (c2.r - c1.r) * t),
    g: Math.round(c1.g + (c2.g - c1.g) * t),
    b: Math.round(c1.b + (c2.b - c1.b) * t),
  };
}

// convert ke css
function rgbToCss(c) {
  return `rgb(${c.r}, ${c.g}, ${c.b})`;
}

function updateBackground() {
  const scrollY = window.scrollY;
  const maxScroll = document.body.scrollHeight - window.innerHeight;

  const progress = scrollY / maxScroll;

  const sectionProgress = progress * (colors.length - 1);
  const index = Math.floor(sectionProgress);
  const t = sectionProgress - index;

  const current = colors[index];
  const next = colors[index + 1] || current;

  const c1Start = hexToRgb(current[0]);
  const c1End = hexToRgb(current[1]);

  const c2Start = hexToRgb(next[0]);
  const c2End = hexToRgb(next[1]);

  const topColor = lerpColor(c1Start, c2Start, t);
  const bottomColor = lerpColor(c1End, c2End, t);

  bg.style.background = `linear-gradient(to bottom, ${rgbToCss(topColor)}, ${rgbToCss(bottomColor)})`;
}

window.addEventListener("scroll", updateBackground);

// === FUNCTION TYPING (REUSABLE) ===
function typeText(element, text, speed = 40) {
  let i = 0;
  element.textContent = ""; // reset dulu

  function typing() {
    if (i < text.length) {
      element.textContent += text[i];
      i++;
      setTimeout(typing, speed);
    }
  }

  typing();
}

// === ANIMASI SMOOTH SCROOL ===
function smoothScrollTo(targetY, duration = 1200) {
  const startY = window.scrollY;
  const distance = targetY - startY;
  let startTime = null;

  function animation(currentTime) {
    if (!startTime) startTime = currentTime;
    let timeElapsed = currentTime - startTime;

    // easing (easeInOutCubic biar halus)
    let progress = Math.min(timeElapsed / duration, 1);
    let ease =
      progress < 0.5
        ? 4 * progress * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 3) / 2;

    window.scrollTo(0, startY + distance * ease);

    if (timeElapsed < duration) {
      requestAnimationFrame(animation);
    }
  }

  requestAnimationFrame(animation);
}

// === AUTO SCROLL SAAT KLIK ===
let currentSection = 0;
let isScrolling = false;
const sections = document.querySelectorAll("section");

document.body.addEventListener("click", (e) => {
  if (isScrolling) return;

  const clickY = e.clientY;
  const screenHeight = window.innerHeight;

  // klik bawah → turun
  if (clickY > screenHeight / 2) {
    if (currentSection < sections.length - 1) {
      isScrolling = true;
      currentSection++;

      const target = sections[currentSection].offsetTop;
      smoothScrollTo(target, 1800);

      setTimeout(() => {
        isScrolling = false;
      }, 1800);
    }
  }
  // klik atas → naik
  else {
    if (currentSection > 0) {
      isScrolling = true;
      currentSection--;

      const target = sections[currentSection].offsetTop;
      smoothScrollTo(target, 1800);

      setTimeout(() => {
        isScrolling = false;
      }, 1800);
    }
  }
});

// TYPING ENDING

let endingPlayed = false;

function playEnding() {
  if (endingPlayed) return;
  endingPlayed = true;

  let i = 0;

  function typing() {
    if (i < lastText.length) {
      elLast.textContent += lastText[i];
      i++;
      setTimeout(typing, 40);
    } else {
      // setelah typing selesai → munculin ucapan
      setTimeout(() => {
        finalText.classList.add("show");

        // munculin closing
        setTimeout(() => {
          closingText.classList.remove("opacity-0");
        }, 800);
      }, 800);
    }
  }

  typing();
}

const lastSectionText = document.getElementById("typing-last");

// === TRIGGER TYPING SAAT SECTION TERLIHAT ===
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        if (entry.target.id === "typing2" && !typed2) {
          typed2 = true;
          typeText(el2, text2);
        }
        if (entry.target.id === "typing3" && !typed3) {
          typed3 = true;
          typeText(el3, text3);
        }
        if (entry.target.id === "typing4" && !typed4) {
          typed4 = true;
          typeText(el4, text4);
        }
        if (entry.target.id === "typing5" && !typed5) {
          typed5 = true;
          typeText(el5, text5);
        }
        if (entry.target.id === "typing-last") {
          playEnding();
        }
      }
    });
  },
  {
    threshold: 0.6, // 60% terlihat baru trigger
  },
);

// observe elemen
observer.observe(el1);
observer.observe(el2);
observer.observe(el3);
observer.observe(el4);
observer.observe(el5);
observer.observe(lastSectionText);

// === JALANKAN AWAL (SECTION 1) ===
window.addEventListener("load", () => {
  window.scrollTo(0, 0);
  currentSection = 0;

  updateBackground(); // wajib
  typeText(el1, text1);
});
