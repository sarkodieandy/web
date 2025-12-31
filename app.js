document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.querySelector(".nav-toggle");
  const links = document.querySelector(".nav-links");

  toggle?.addEventListener("click", () => {
    links?.classList.toggle("open");
    toggle.classList.toggle("active");
    if (links?.style.display === "flex") {
      links.style.display = "none";
    } else {
      links.style.display = "flex";
      links.style.flexDirection = "column";
      links.style.gap = "12px";
      links.style.background = "#0d162b";
      links.style.position = "absolute";
      links.style.top = "54px";
      links.style.left = "0";
      links.style.padding = "14px 20px";
      links.style.width = "100%";
      links.style.borderTop = "1px solid #1f2937";
    }
  });

  // Simple slider
  const slides = document.querySelectorAll(".slide");
  const dots = document.querySelectorAll(".dot");
  const prev = document.querySelector(".slider-btn.prev");
  const next = document.querySelector(".slider-btn.next");
  let current = 0;
  let intervalId;

  function showSlide(index) {
    slides.forEach((slide, i) => {
      slide.classList.toggle("active", i === index);
    });
    dots.forEach((dot, i) => {
      dot.classList.toggle("active", i === index);
    });
    current = index;
  }

  function nextSlide() {
    showSlide((current + 1) % slides.length);
  }

  function prevSlide() {
    showSlide((current - 1 + slides.length) % slides.length);
  }

  next?.addEventListener("click", nextSlide);
  prev?.addEventListener("click", prevSlide);
  dots.forEach((dot, i) => dot.addEventListener("click", () => showSlide(i)));

  if (slides.length > 0) {
    showSlide(0);
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!prefersReducedMotion) {
      intervalId = setInterval(nextSlide, 6000);
    }

    const slider = document.querySelector(".hero-slider");
    const pause = () => intervalId && clearInterval(intervalId);
    const resume = () => {
      if (!prefersReducedMotion) intervalId = setInterval(nextSlide, 6000);
    };
    slider?.addEventListener("mouseenter", pause);
    slider?.addEventListener("mouseleave", resume);
    slider?.addEventListener("focusin", pause);
    slider?.addEventListener("focusout", resume);

    window.addEventListener("keydown", (e) => {
      if (e.key === "ArrowRight") nextSlide();
      if (e.key === "ArrowLeft") prevSlide();
    });
  }

  // Search routing
  const searchForms = document.querySelectorAll("form.search");
  const routes = [
    { keys: ["update", "news"], url: "updates.html" },
    { keys: ["eat", "nausea", "meal", "food"], url: "eating.html" },
    { keys: ["hydration", "water", "drink", "ors"], url: "hydration.html" },
    { keys: ["muscle", "strength", "metabolic", "protein"], url: "muscle.html" },
    { keys: ["recipe", "protein", "cook", "meal prep"], url: "recipes.html" },
    { keys: ["home", "main"], url: "index.html" }
  ];

  function findRoute(query) {
    const q = query.toLowerCase();
    for (const route of routes) {
      if (route.keys.some((k) => q.includes(k))) return route.url;
    }
    return null;
  }

  searchForms.forEach((form) => {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const input = form.querySelector("input[type='search']");
      const value = input?.value?.trim() || "";
      if (!value) return;
      const target = findRoute(value);
      if (target) {
        window.location.href = target;
      } else {
        alert("No matching section found. Try: updates, nausea, hydration, muscle, recipes.");
      }
    });
  });

  // Back to top button
  const backBtn = document.createElement("button");
  backBtn.className = "back-to-top";
  backBtn.setAttribute("aria-label", "Back to top");
  backBtn.innerHTML = "↑";
  document.body.appendChild(backBtn);

  window.addEventListener("scroll", () => {
    if (window.scrollY > 220) {
      backBtn.classList.add("show");
    } else {
      backBtn.classList.remove("show");
    }
  });

  backBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  // Hero slider for content pages
  const heroSlides = document.querySelectorAll(".hero-slide");
  const heroDotsContainer = document.querySelector(".hero-slider-dots");
  const heroPrev = document.querySelector(".hero-slider-prev");
  const heroNext = document.querySelector(".hero-slider-next");
  let heroCurrentIndex = 0;
  let heroIntervalId;

  if (heroSlides.length > 0 && heroDotsContainer) {
    // Create dots
    heroSlides.forEach((_, i) => {
      const dot = document.createElement("button");
      dot.className = "hero-slider-dot";
      dot.setAttribute("aria-label", `Go to slide ${i + 1}`);
      if (i === 0) dot.classList.add("active");
      heroDotsContainer.appendChild(dot);
    });

    const heroDots = document.querySelectorAll(".hero-slider-dot");

    function showHeroSlide(index) {
      heroSlides.forEach((slide, i) => {
        slide.classList.toggle("active", i === index);
      });
      heroDots.forEach((dot, i) => {
        dot.classList.toggle("active", i === index);
      });
      heroCurrentIndex = index;
    }

    function nextHeroSlide() {
      showHeroSlide((heroCurrentIndex + 1) % heroSlides.length);
    }

    function prevHeroSlide() {
      showHeroSlide((heroCurrentIndex - 1 + heroSlides.length) % heroSlides.length);
    }

    heroNext?.addEventListener("click", nextHeroSlide);
    heroPrev?.addEventListener("click", prevHeroSlide);
    heroDots.forEach((dot, i) => dot.addEventListener("click", () => showHeroSlide(i)));

    showHeroSlide(0);

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!prefersReducedMotion) {
      heroIntervalId = setInterval(nextHeroSlide, 5000);
    }

    const heroSliderContainer = document.querySelector(".hero-slider-container");
    const pauseHero = () => heroIntervalId && clearInterval(heroIntervalId);
    const resumeHero = () => {
      if (!prefersReducedMotion) heroIntervalId = setInterval(nextHeroSlide, 5000);
    };
    heroSliderContainer?.addEventListener("mouseenter", pauseHero);
    heroSliderContainer?.addEventListener("mouseleave", resumeHero);
    heroSliderContainer?.addEventListener("focusin", pauseHero);
    heroSliderContainer?.addEventListener("focusout", resumeHero);

    window.addEventListener("keydown", (e) => {
      if (e.key === "ArrowRight") nextHeroSlide();
      if (e.key === "ArrowLeft") prevHeroSlide();
    });
  }
});

