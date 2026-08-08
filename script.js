/**
 * ODICab Travels — Ocean & Rust Interactive Script
 * Matches: index.html (skill.md redesign, Cormorant + DM Sans)
 */

document.addEventListener('DOMContentLoaded', () => {

  /* ──────────────────────────────────────────────
     1. STICKY NAV — transparent → blur glass
  ────────────────────────────────────────────── */
  const navbar    = document.getElementById('navbar');
  const navLinks  = document.getElementById('nav-links');
  const hamburger = document.getElementById('hamburger');
  const navItems  = navLinks ? navLinks.querySelectorAll('.nav-link') : [];
  const sections  = document.querySelectorAll('section[id], footer[id]');

  function onScroll() {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
    highlightNav();
  }

  function highlightNav() {
    const mid = window.scrollY + 120;
    sections.forEach(sec => {
      if (mid >= sec.offsetTop && mid < sec.offsetTop + sec.offsetHeight) {
        navItems.forEach(a => {
          a.classList.toggle('active', a.getAttribute('href') === `#${sec.id}`);
        });
      }
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ──────────────────────────────────────────────
     2. HAMBURGER MOBILE MENU
  ────────────────────────────────────────────── */
  if (hamburger && navLinks) {
    const toggleMenu = (force) => {
      const open = typeof force === 'boolean'
        ? force
        : !navLinks.classList.contains('mobile-open');

      navLinks.classList.toggle('mobile-open', open);
      hamburger.classList.toggle('open', open);
      hamburger.setAttribute('aria-expanded', String(open));
      document.body.style.overflow = open ? 'hidden' : '';
    };

    hamburger.addEventListener('click', () => toggleMenu());
    hamburger.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleMenu(); }
    });

    // Close on link click
    navItems.forEach(link => {
      link.addEventListener('click', () => toggleMenu(false));
    });

    // Close on outside click
    document.addEventListener('click', e => {
      if (
        navLinks.classList.contains('mobile-open') &&
        !navLinks.contains(e.target) &&
        !hamburger.contains(e.target)
      ) toggleMenu(false);
    });
  }

  /* ──────────────────────────────────────────────
     3. SCROLL REVEAL — IntersectionObserver
  ────────────────────────────────────────────── */
  const revealEls = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    const revealObs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          revealObs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -32px 0px' });

    revealEls.forEach(el => revealObs.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('in-view'));
  }

  /* ──────────────────────────────────────────────
     4. FLEET FILTER TABS
  ────────────────────────────────────────────── */
  const tabs      = document.querySelectorAll('.tab[data-filter]');
  const cards     = document.querySelectorAll('.fleet-card[data-category]');

  if (tabs.length && cards.length) {
    // Set base transition on all cards
    cards.forEach(c => {
      c.style.transition = 'opacity 0.32s cubic-bezier(0.16,1,0.3,1), transform 0.32s cubic-bezier(0.16,1,0.3,1)';
    });

    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        // Update tab state
        tabs.forEach(t => { t.classList.remove('active'); t.setAttribute('aria-selected', 'false'); });
        tab.classList.add('active');
        tab.setAttribute('aria-selected', 'true');

        const filter = tab.getAttribute('data-filter');

        cards.forEach(card => {
          const match = filter === 'all' || card.getAttribute('data-category') === filter;

          if (match) {
            card.style.display = 'flex';
            requestAnimationFrame(() => requestAnimationFrame(() => {
              card.style.opacity   = '1';
              card.style.transform = 'translateY(0) scale(1)';
            }));
          } else {
            card.style.opacity   = '0';
            card.style.transform = 'translateY(14px) scale(0.97)';
            setTimeout(() => { card.style.display = 'none'; }, 320);
          }
        });
      });
    });
  }

  /* ──────────────────────────────────────────────
     5. QUICK BOOK — WhatsApp deep link
  ────────────────────────────────────────────── */
  const qbBtn = document.getElementById('qb-submit-btn');

  if (qbBtn) {
    qbBtn.addEventListener('click', () => {
      const pickup  = document.getElementById('pickup')?.value      || 'Bhubaneswar Airport (BBI)';
      const dest    = document.getElementById('destination')?.value  || 'Puri & Konark Tour';
      const vehicle = document.getElementById('vehicle-type')?.value || 'Sedan';

      const msg = [
        'Hello ODICab Travels! 🚖',
        '',
        `📍 *From:* ${pickup}`,
        `🏁 *To:* ${dest}`,
        `🚗 *Vehicle:* ${vehicle}`,
        '',
        'Please confirm the fare and availability. Thank you!'
      ].join('\n');

      window.open(`https://wa.me/918018759229?text=${encodeURIComponent(msg)}`, '_blank', 'noopener,noreferrer');
    });
  }

  /* ──────────────────────────────────────────────
     6. SMOOTH SCROLL — all anchor links
  ────────────────────────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const id  = anchor.getAttribute('href');
      if (!id || id === '#') return;
      const el  = document.querySelector(id);
      if (el) { e.preventDefault(); el.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
    });
  });

  /* ──────────────────────────────────────────────
     7. HERO PARALLAX — subtle image drift
  ────────────────────────────────────────────── */
  const heroImg = document.querySelector('.hero-img');
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (heroImg && !prefersReducedMotion) {
    window.addEventListener('scroll', () => {
      if (window.scrollY < window.innerHeight * 1.5) {
        heroImg.style.transform = `translateY(${window.scrollY * 0.18}px)`;
      }
    }, { passive: true });
  }

  /* ──────────────────────────────────────────────
     8. FLOATING WA — hide when CTA in view
  ────────────────────────────────────────────── */
  const floatBtn  = document.getElementById('floating-wa-btn');
  const ctaBand   = document.getElementById('book-now');

  if (floatBtn && ctaBand && 'IntersectionObserver' in window) {
    new IntersectionObserver((entries) => {
      const inView = entries[0].isIntersecting;
      floatBtn.style.opacity       = inView ? '0' : '1';
      floatBtn.style.pointerEvents = inView ? 'none' : 'auto';
      floatBtn.style.transform     = inView ? 'scale(0.8)' : 'scale(1)';
    }, { threshold: 0.3 }).observe(ctaBand);
  }

  /* ──────────────────────────────────────────────
     9. ROUTE LINE — re-trigger animation on
        quick-book card when scrolled into view
  ────────────────────────────────────────────── */
  const routeFill = document.querySelector('.route-line-fill');

  if (routeFill && 'IntersectionObserver' in window) {
    new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        routeFill.style.animation = 'none';
        routeFill.getBoundingClientRect(); // reflow
        routeFill.style.animation = 'route-fill 1.8s cubic-bezier(0.16,1,0.3,1) 0.3s forwards';
      }
    }, { threshold: 0.5 }).observe(routeFill);
  }

});