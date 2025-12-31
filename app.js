// Cookie Consent Management - MUST be in global scope for onclick handlers
function showCookieConsent() {
  const consent = localStorage.getItem('cookieConsent');
  if (!consent) {
    setTimeout(() => {
      document.getElementById('cookieConsent')?.classList.add('show');
    }, 1000); // Show after 1 second
  } else if (consent === 'accepted') {
    loadAdsense();
  }
}

function acceptCookies() {
  localStorage.setItem('cookieConsent', 'accepted');
  document.getElementById('cookieConsent')?.classList.remove('show');
  loadAdsense();
}

function rejectCookies() {
  localStorage.setItem('cookieConsent', 'rejected');
  document.getElementById('cookieConsent')?.classList.remove('show');
  // Don't load personalized ads
}

function manageCookies() {
  alert('Cookie preferences: You can accept all cookies for personalized content, or reject non-essential cookies. Essential cookies are always active to ensure site functionality.');
}

function loadAdsense() {
  // AdSense is already loaded in the head, this ensures ads are pushed
  try {
    if (window.adsbygoogle && window.adsbygoogle.loaded !== true) {
      (adsbygoogle = window.adsbygoogle || []).push({});
    }
  } catch (e) {
    console.log('AdSense not ready');
  }
}

// Show consent banner on page load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', showCookieConsent);
} else {
  showCookieConsent();
}

document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.querySelector(".nav-toggle");
  const links = document.querySelector(".nav-links");

  toggle?.addEventListener("click", () => {
    links?.classList.toggle("open");
    toggle.classList.toggle("active");
  });

  // Close menu when clicking outside
  document.addEventListener("click", (e) => {
    if (!toggle?.contains(e.target) && !links?.contains(e.target)) {
      links?.classList.remove("open");
      toggle?.classList.remove("active");
    }
  });

  // Close menu when clicking a link
  links?.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      links.classList.remove("open");
      toggle?.classList.remove("active");
    });
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
    { label: "Home", keys: ["home", "main"], url: "index.html" },
    { label: "GLP-1 Updates", keys: ["update", "news", "playbook"], url: "updates.html" },
    { label: "Nausea-Smart Eating", keys: ["eat", "nausea", "meal", "food"], url: "eating.html" },
    { label: "Hydration", keys: ["hydration", "water", "drink", "ors"], url: "hydration.html" },
    { label: "Muscle & Metabolic", keys: ["muscle", "strength", "metabolic", "protein"], url: "muscle.html" },
    { label: "Easy Protein Recipes", keys: ["recipe", "protein", "cook", "meal prep"], url: "recipes.html" },
    { label: "Tools & Calculators", keys: ["tool", "calculator", "protein calculator", "hydration calculator"], url: "tools.html" },
    { label: "Blog", keys: ["blog", "article", "tips", "guide"], url: "blog.html" },
    { label: "Daily Check-in", keys: ["check", "log", "track", "trend"], url: "checkin.html" },
  ];

  function findRoute(query) {
    const q = query.toLowerCase();
    for (const route of routes) {
      if (route.keys.some((k) => q.includes(k))) return route.url;
    }
    return null;
  }

  function buildSuggestions(form) {
    const container = document.createElement("div");
    container.className = "search-suggestions";
    container.style.display = "none";
    form.appendChild(container);
    return container;
  }

  function updateSuggestions(container, query) {
    if (!query) {
      container.style.display = "none";
      container.innerHTML = "";
      return;
    }
    const q = query.toLowerCase();
    const matches = routes.filter((r) => r.keys.some((k) => k.includes(q) || q.includes(k)));
    if (!matches.length) {
      container.style.display = "none";
      container.innerHTML = "";
      return;
    }
    container.innerHTML = matches
      .slice(0, 6)
      .map((m) => `<button type="button" data-url="${m.url}">${m.label}</button>`)
      .join("");
    container.style.display = "block";
  }

  searchForms.forEach((form) => {
    const input = form.querySelector("input[type='search']");
    const suggestions = buildSuggestions(form);

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const value = input?.value?.trim() || "";
      if (!value) return;
      const target = findRoute(value);
      if (target) {
        window.location.href = target;
      } else {
        alert("No matching section found. Try: updates, nausea, hydration, muscle, recipes, tools, blog, check-in.");
      }
    });

    input?.addEventListener("input", () => updateSuggestions(suggestions, input.value));

    suggestions.addEventListener("click", (e) => {
      const btn = e.target.closest("button");
      if (!btn) return;
      window.location.href = btn.dataset.url;
    });

    document.addEventListener("click", (e) => {
      if (!form.contains(e.target)) {
        suggestions.style.display = "none";
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

// Register Service Worker for PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('ServiceWorker registered:', registration.scope);
      })
      .catch((error) => {
        console.log('ServiceWorker registration failed:', error);
      });
  });
}

// Social Sharing Function
function shareArticle(title, url) {
  if (navigator.share) {
    navigator.share({
      title: title || 'GLP-1 Care Companion',
      text: 'Check out this helpful GLP-1 resource!',
      url: url || window.location.href
    }).catch((error) => console.log('Error sharing:', error));
  } else {
    // Fallback: copy URL to clipboard
    navigator.clipboard.writeText(url || window.location.href);
    alert('Link copied to clipboard!');
  }
}

// Install PWA prompt
let deferredPrompt;
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  // Show install button if you want
  console.log('PWA install available');
});


