/**
 * AR MINE — ANIMATION & INTERACTION ENGINE
 * Built with Anime.js
 * Respects prefers-reduced-motion and provides purposeful micro-interactions.
 */
import anime from 'animejs';

export function setupSiteInteractions() {
  if (typeof window === 'undefined') return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // 1. Navbar Scroll State
  initNavbarScroll();

  // 2. Mobile Menu Toggle
  initMobileMenu();

  // 3. Hero Entrance Animations
  if (!prefersReducedMotion) {
    initHeroEntrance();
    initScrollReveals();
    initFloatingHUD();
  } else {
    // Show all elements immediately for reduced motion users
    document.querySelectorAll('.reveal-on-scroll').forEach(el => {
      el.style.opacity = '1';
      el.style.transform = 'none';
    });
  }

  // 4. Interactive AR HUD Viewport Switcher
  initARHUDControls();

  // 5. Interactive Timeline Steps
  initWorkflowTimeline();
}

function initNavbarScroll() {
  const navbar = document.getElementById('main-navbar');
  if (!navbar) return;

  const handleScroll = () => {
    if (window.scrollY > 24) {
      navbar.classList.add('navbar-scrolled');
    } else {
      navbar.classList.remove('navbar-scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
}

function initMobileMenu() {
  const toggleBtn = document.getElementById('mobile-menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu-drawer');
  if (!toggleBtn || !mobileMenu) return;

  let isOpen = false;

  const toggle = (force) => {
    isOpen = typeof force === 'boolean' ? force : !isOpen;
    toggleBtn.setAttribute('aria-expanded', String(isOpen));
    if (isOpen) {
      mobileMenu.classList.add('is-open');
      toggleBtn.classList.add('is-active');
      document.body.style.overflow = 'hidden';
    } else {
      mobileMenu.classList.remove('is-open');
      toggleBtn.classList.remove('is-active');
      document.body.style.overflow = '';
    }
  };

  toggleBtn.addEventListener('click', () => toggle());

  // Close when clicking nav links
  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => toggle(false));
  });

  // Close on Escape key
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isOpen) toggle(false);
  });
}

function initHeroEntrance() {
  const heroElements = document.querySelectorAll('.hero-animate-in');
  if (!heroElements.length) return;

  anime({
    targets: heroElements,
    translateY: [28, 0],
    opacity: [0, 1],
    delay: anime.stagger(120, { start: 150 }),
    duration: 850,
    easing: 'easeOutCubic'
  });
}

function initScrollReveals() {
  const revealElements = document.querySelectorAll('.reveal-on-scroll');
  if (!revealElements.length) return;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const delay = el.getAttribute('data-reveal-delay') || 0;

        anime({
          targets: el,
          translateY: [24, 0],
          opacity: [0, 1],
          duration: 750,
          delay: Number(delay),
          easing: 'easeOutCubic'
        });

        obs.unobserve(el);
      }
    });
  }, {
    rootMargin: '0px 0px -60px 0px',
    threshold: 0.1
  });

  revealElements.forEach(el => observer.observe(el));
}

function initFloatingHUD() {
  const floatingTags = document.querySelectorAll('.ar-floating-tag');
  if (!floatingTags.length) return;

  floatingTags.forEach((tag, index) => {
    const offset = (index % 2 === 0) ? 6 : -6;
    anime({
      targets: tag,
      translateY: [0, offset],
      direction: 'alternate',
      loop: true,
      easing: 'easeInOutSine',
      duration: 2600 + (index * 400),
      delay: index * 200
    });
  });
}

function initARHUDControls() {
  const buttons = document.querySelectorAll('[data-hud-mode]');
  const markers = document.querySelectorAll('[data-marker-type]');
  const modeStatus = document.getElementById('hud-mode-indicator');
  if (!buttons.length) return;

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      const mode = btn.getAttribute('data-hud-mode');

      // Update button active state
      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      // Update status text
      if (modeStatus) {
        modeStatus.textContent = mode ? mode.toUpperCase() : 'ACTIVE';
      }

      // Filter markers
      markers.forEach(marker => {
        const markerType = marker.getAttribute('data-marker-type');
        if (mode === 'all' || markerType === mode) {
          marker.classList.remove('hud-hidden');
          anime({
            targets: marker,
            scale: [0.85, 1],
            opacity: [0.4, 1],
            duration: 350,
            easing: 'easeOutBack'
          });
        } else {
          marker.classList.add('hud-hidden');
        }
      });
    });
  });
}

function initWorkflowTimeline() {
  const steps = document.querySelectorAll('.workflow-step-card');
  if (!steps.length) return;

  steps.forEach(card => {
    card.addEventListener('mouseenter', () => {
      anime({
        targets: card.querySelector('.step-num-badge'),
        scale: [1, 1.15],
        duration: 300,
        easing: 'easeOutBack'
      });
    });

    card.addEventListener('mouseleave', () => {
      anime({
        targets: card.querySelector('.step-num-badge'),
        scale: 1,
        duration: 200,
        easing: 'easeOutQuad'
      });
    });
  });
}

// Auto-run on DOM ready or Astro page load
if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', setupSiteInteractions);
  document.addEventListener('astro:page-load', setupSiteInteractions);
}
