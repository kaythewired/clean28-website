const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');
const themeToggle = document.querySelector('.theme-toggle');

document.documentElement.classList.add('has-enhanced-motion');

function applyTheme(theme) {
  document.body.dataset.theme = theme;
  if (!themeToggle) return;
  const isDark = theme === 'dark';
  themeToggle.textContent = isDark ? '☀' : '☾';
  themeToggle.setAttribute('aria-pressed', String(isDark));
  themeToggle.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
}

let savedTheme = null;
try { savedTheme = localStorage.getItem('clean28-theme'); } catch (_) {}
applyTheme(savedTheme || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'));

if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const nextTheme = document.body.dataset.theme === 'dark' ? 'light' : 'dark';
    applyTheme(nextTheme);
    try { localStorage.setItem('clean28-theme', nextTheme); } catch (_) {}
  });
}

if (menuToggle && navLinks) {
  menuToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', String(isOpen));
    menuToggle.textContent = isOpen ? '×' : '☰';
  });
}

const carousel = document.querySelector('.hero-carousel');
if (carousel) {
  const slides = Array.from(carousel.querySelectorAll('[data-carousel-slide]'));
  const dots = Array.from(carousel.querySelectorAll('[data-carousel-to]'));
  const previousButton = carousel.querySelector('[data-carousel-prev]');
  const nextButton = carousel.querySelector('[data-carousel-next]');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let currentSlide = 0;
  let autoAdvance;
  let interactionPaused = false;

  const showSlide = index => {
    currentSlide = (index + slides.length) % slides.length;
    slides.forEach((slide, slideIndex) => {
      const isActive = slideIndex === currentSlide;
      slide.classList.toggle('is-active', isActive);
      slide.setAttribute('aria-hidden', String(!isActive));
      slide.toggleAttribute('inert', !isActive);
    });
    dots.forEach((dot, dotIndex) => {
      const isActive = dotIndex === currentSlide;
      dot.classList.toggle('is-active', isActive);
      dot.toggleAttribute('aria-current', isActive);
    });
  };

  const stopAutoAdvance = () => {
    if (autoAdvance) window.clearInterval(autoAdvance);
    autoAdvance = undefined;
  };

  const startAutoAdvance = () => {
    if (reduceMotion || interactionPaused || autoAdvance) return;
    autoAdvance = window.setInterval(() => showSlide(currentSlide + 1), 6500);
  };

  previousButton?.addEventListener('click', () => showSlide(currentSlide - 1));
  nextButton?.addEventListener('click', () => showSlide(currentSlide + 1));
  dots.forEach((dot, index) => dot.addEventListener('click', () => showSlide(index)));

  carousel.addEventListener('mouseenter', () => {
    interactionPaused = true;
    stopAutoAdvance();
  });
  carousel.addEventListener('mouseleave', () => {
    interactionPaused = false;
    startAutoAdvance();
  });
  carousel.addEventListener('focusin', () => {
    interactionPaused = true;
    stopAutoAdvance();
  });
  carousel.addEventListener('focusout', event => {
    if (carousel.contains(event.relatedTarget)) return;
    interactionPaused = false;
    startAutoAdvance();
  });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) stopAutoAdvance();
    else startAutoAdvance();
  });

  showSlide(0);
  startAutoAdvance();
}

const ctaQuote = document.querySelector('[data-cta-quote]');
if (ctaQuote) {
  const ctaSection = ctaQuote.closest('.cta');
  const cleaningQuotes = [
    { text: 'A cleaner space is only a few clicks away.', theme: 'cta--blue' },
    { text: 'Clean space. Clear mind.', theme: 'cta--lime' },
    { text: 'Fresh spaces make room for easier days.', theme: 'cta--navy' },
    { text: 'Care for your space. Respect for your people.', theme: 'cta--lime' },
    { text: 'A welcoming space starts with Clean28.', theme: 'cta--blue' }
  ];
  const reduceQuoteMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let quoteIndex = 0;

  window.setInterval(() => {
    quoteIndex = (quoteIndex + 1) % cleaningQuotes.length;
    if (!reduceQuoteMotion) ctaQuote.classList.add('is-changing');
    window.setTimeout(() => {
      ctaQuote.textContent = cleaningQuotes[quoteIndex].text;
      ctaSection.classList.remove('cta--blue', 'cta--lime', 'cta--navy');
      ctaSection.classList.add(cleaningQuotes[quoteIndex].theme);
      ctaQuote.classList.remove('is-changing');
    }, reduceQuoteMotion ? 0 : 260);
  }, 5200);
}

const plans = {
  home: {
    title: 'Home cleaning, your way',
    description: 'A flexible clean that brings your rooms back to their best, whether you need a regular rhythm or a one-off reset.',
    includes: ['Kitchens and bathrooms', 'Vacuuming and mopping', 'Dusting and surfaces', 'Your priority areas']
  },
  lease: {
    title: 'Community spaces, safe and welcoming',
    description: 'Thoughtful cleaning for shared spaces, with safe products, clear communication and care for everyone who uses them.',
    includes: ['Shared areas and entry points', 'Washrooms and touchpoints', 'Floors and common surfaces', 'Flexible community scheduling']
  },
  workplace: {
    title: 'A better office day starts clean',
    description: 'A reliable, after-hours-friendly service that helps your team and visitors walk into a welcoming space every day.',
    includes: ['Desks and shared areas', 'Kitchens and washrooms', 'Floors and entry points', 'Schedule around your hours']
  }
};

const planOptions = document.querySelectorAll('[data-plan]');
if (planOptions.length) {
  const planTitle = document.querySelector('#plan-title');
  const planDescription = document.querySelector('#plan-description');
  const planIncludes = document.querySelector('#plan-includes');
  const planCta = document.querySelector('#plan-cta');
  const selectPlan = key => {
    const plan = plans[key];
    planOptions.forEach(option => {
      const isSelected = option.dataset.plan === key;
      option.classList.toggle('is-selected', isSelected);
      option.setAttribute('aria-pressed', String(isSelected));
    });
    planTitle.textContent = plan.title;
    planDescription.textContent = plan.description;
    planIncludes.replaceChildren(...plan.includes.map(item => {
      const listItem = document.createElement('li');
      listItem.textContent = item;
      return listItem;
    }));
    planCta.href = `contact.html?service=${key}`;
  };
  planOptions.forEach(option => option.addEventListener('click', () => selectPlan(option.dataset.plan)));
}

const enquiryForm = document.querySelector('#enquiry-form');
const serviceSelect = document.querySelector('#service-select');
const formHelper = document.querySelector('#form-helper');
const helperMessages = {
  home: '<strong>Home care selected.</strong> Tell us how often you would like help and which rooms matter most.',
  lease: '<strong>Community-space cleaning selected.</strong> Share the space type, opening hours and anything your visitors need.',
  workplace: '<strong>Office cleaning selected.</strong> Let us know your business hours, space type and ideal schedule.',
  custom: '<strong>Custom clean selected.</strong> Describe what you would like refreshed and we will tailor the plan.'
};

const updateFormHelper = () => {
  if (!serviceSelect || !formHelper) return;
  formHelper.innerHTML = helperMessages[serviceSelect.value] || '<strong>Start with the essentials.</strong> Tell us what you need and we will shape a clear quote around your space.';
};

if (serviceSelect) {
  const selectedService = new URLSearchParams(window.location.search).get('service');
  if (selectedService && plans[selectedService]) serviceSelect.value = selectedService;
  serviceSelect.addEventListener('change', updateFormHelper);
  updateFormHelper();
}

if (enquiryForm) {
  enquiryForm.addEventListener('submit', event => {
    event.preventDefault();
    const message = document.querySelector('#form-message');
    message.classList.add('visible');
    enquiryForm.reset();
    updateFormHelper();
  });
}

document.querySelectorAll('[data-year]').forEach(element => {
  element.textContent = new Date().getFullYear();
});

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const scrollProgress = document.createElement('div');
scrollProgress.className = 'scroll-progress';
scrollProgress.setAttribute('aria-hidden', 'true');
document.body.prepend(scrollProgress);

const backToTop = document.createElement('button');
backToTop.className = 'back-to-top';
backToTop.type = 'button';
backToTop.setAttribute('aria-label', 'Back to the top of the page');
backToTop.innerHTML = '<span aria-hidden="true">↑</span><span>Top</span>';
document.body.append(backToTop);

const updateScrollEffects = () => {
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  const progress = maxScroll > 0 ? Math.min(window.scrollY / maxScroll, 1) : 0;
  scrollProgress.style.transform = `scaleX(${progress})`;
  backToTop.classList.toggle('is-visible', window.scrollY > 620);
};

window.addEventListener('scroll', updateScrollEffects, { passive: true });
window.addEventListener('resize', updateScrollEffects);
backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' }));
updateScrollEffects();

const revealGroups = document.querySelectorAll('.card-grid, .scope-grid, .steps, .service-detail-grid, .practice-grid, .standard-grid, .journey-grid');
const revealSingles = document.querySelectorAll('.carousel-followup, .cta-inner, .planner-shell, .review-main, .form-card, .reason, .contact-detail, .assurance-list > div, .next-step-list > div');
const staticSectionTargets = document.querySelectorAll('main > section:not(.home-hero):not(.cta), .home-hero .hero-grid > :first-child');
const imageRevealTargets = document.querySelectorAll('.page-hero-photo, .photo-panel, .visual-story');
const revealTargets = [];

revealGroups.forEach(group => {
  Array.from(group.children).forEach((element, index) => {
    element.classList.add('reveal');
    element.style.setProperty('--reveal-delay', `${Math.min(index * 80, 240)}ms`);
    revealTargets.push(element);
  });
});

revealSingles.forEach(element => {
  element.classList.add('reveal');
  revealTargets.push(element);
});

staticSectionTargets.forEach(element => {
  if (element.classList.contains('reveal')) return;
  element.classList.add('reveal');
  revealTargets.push(element);
});

imageRevealTargets.forEach((element, index) => {
  element.classList.add('image-reveal');
  if (element.matches('.page-hero-photo, .visual-story') || index % 2 === 1) {
    element.classList.add('image-reveal-from-right');
  }
  element.style.setProperty('--reveal-delay', `${Math.min(index * 70, 210)}ms`);
  revealTargets.push(element);
});

if (prefersReducedMotion || !('IntersectionObserver' in window)) {
  revealTargets.forEach(element => element.classList.add('is-visible'));
} else {
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      revealObserver.unobserve(entry.target);
    });
  }, { threshold: .12, rootMargin: '0px 0px -32px' });
  revealTargets.forEach(element => revealObserver.observe(element));
}
