// Subframe Media — interactions
// (1) sticky-header scroll state
// (2) mobile nav toggle
// (3) IntersectionObserver fade-up on `.reveal`
// (4) video-card hover preview (poster -> background Vimeo iframe -> back)
// (5) lightbox open/close with focus trap, Esc, click-outside, body scroll lock

(() => {
  const $  = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const supportsHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  // -- sticky header --------------------------------------------------------

  const header = $('[data-site-header]');
  if (header) {
    const onScroll = () => {
      header.classList.toggle('is-scrolled', window.scrollY > 24);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  // -- mobile nav -----------------------------------------------------------

  const navToggle = $('[data-nav-toggle]');
  const siteNav   = $('#site-nav');
  if (navToggle && siteNav) {
    navToggle.addEventListener('click', () => {
      const open = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', String(!open));
      siteNav.classList.toggle('is-open', !open);
      document.body.classList.toggle('nav-open', !open);
    });
    // close on link click
    $$('a', siteNav).forEach(a => a.addEventListener('click', () => {
      navToggle.setAttribute('aria-expanded', 'false');
      siteNav.classList.remove('is-open');
      document.body.classList.remove('nav-open');
    }));
  }

  // -- reveal-on-scroll -----------------------------------------------------

  const reveals = $$('.reveal');
  if (reveals.length && 'IntersectionObserver' in window && !prefersReducedMotion) {
    const io = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      }
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.05 });
    reveals.forEach(el => io.observe(el));
  } else {
    reveals.forEach(el => el.classList.add('is-visible'));
  }

  // -- video card hover preview --------------------------------------------

  const cards = $$('[data-video-card]');
  const HOVER_DELAY = 140;

  const buildPreviewSrc = (id) =>
    `https://player.vimeo.com/video/${id}?background=1&dnt=1&autopause=0&muted=1&playsinline=1`;

  const attachPreview = (card) => {
    if (card._preview) return;
    const media = $('[data-card-media]', card);
    const iframe = document.createElement('iframe');
    iframe.className = 'video-card__preview';
    iframe.setAttribute('allow', 'autoplay; picture-in-picture');
    iframe.setAttribute('aria-hidden', 'true');
    iframe.setAttribute('tabindex', '-1');
    iframe.setAttribute('loading', 'lazy');
    iframe.src = buildPreviewSrc(card.dataset.vimeoId);
    iframe.addEventListener('load', () => {
      iframe.classList.add('is-ready');
      card.classList.add('is-previewing');
    }, { once: true });
    media.appendChild(iframe);
    card._preview = iframe;
  };

  const detachPreview = (card) => {
    if (!card._preview) return;
    card._preview.remove();
    card._preview = null;
    card.classList.remove('is-previewing');
  };

  if (supportsHover) {
    for (const card of cards) {
      let timer;
      card.addEventListener('pointerenter', () => {
        clearTimeout(timer);
        timer = setTimeout(() => attachPreview(card), HOVER_DELAY);
      });
      card.addEventListener('pointerleave', () => {
        clearTimeout(timer);
        detachPreview(card);
      });
    }
  }

  // -- lightbox -------------------------------------------------------------

  const lightbox = $('[data-lightbox]');
  const lbStage  = $('[data-lightbox-stage]');
  const lbTitle  = $('[data-lightbox-title]');
  const lbDesc   = $('[data-lightbox-desc]');
  const lbPanel  = $('[data-lightbox-panel]');
  let lastFocus  = null;

  const openLightbox = (card) => {
    if (!lightbox) return;
    lastFocus = document.activeElement;

    const id    = card.dataset.vimeoId;
    const title = card.dataset.title || '';
    const desc  = card.dataset.description || '';
    const aspect = card.dataset.aspect || '16:9';

    lightbox.dataset.aspect = aspect;
    lbTitle.textContent = title;
    lbDesc.textContent  = desc;

    const iframe = document.createElement('iframe');
    iframe.setAttribute('allow', 'autoplay; fullscreen; picture-in-picture; clipboard-write');
    iframe.setAttribute('allowfullscreen', '');
    iframe.setAttribute('title', title);
    iframe.src = `https://player.vimeo.com/video/${id}?autoplay=1&dnt=1&playsinline=1&title=0&byline=0&portrait=0`;
    lbStage.innerHTML = '';
    lbStage.appendChild(iframe);

    lightbox.hidden = false;
    document.body.classList.add('lightbox-open');

    // shift focus into the dialog for keyboard users
    requestAnimationFrame(() => {
      const closer = $('.lightbox__close', lightbox);
      if (closer) closer.focus();
    });
  };

  const closeLightbox = () => {
    if (!lightbox || lightbox.hidden) return;
    lightbox.hidden = true;
    lbStage.innerHTML = '';  // removes iframe -> stops audio
    document.body.classList.remove('lightbox-open');
    if (lastFocus && typeof lastFocus.focus === 'function') {
      lastFocus.focus();
    }
  };

  if (lightbox) {
    for (const card of cards) {
      card.addEventListener('click', (e) => {
        // clicks bubble up from the inner button; intercept once
        const btn = e.target.closest('.video-card__hit');
        if (!btn) return;
        e.preventDefault();
        openLightbox(card);
      });
    }

    $$('[data-lightbox-close]', lightbox).forEach(el => {
      el.addEventListener('click', closeLightbox);
    });

    document.addEventListener('keydown', (e) => {
      if (lightbox.hidden) return;
      if (e.key === 'Escape') { e.preventDefault(); closeLightbox(); return; }

      // simple focus trap: keep tab inside the panel
      if (e.key === 'Tab' && lbPanel) {
        const focusables = $$('button, a, iframe, [tabindex]:not([tabindex="-1"])', lbPanel);
        if (!focusables.length) return;
        const first = focusables[0];
        const last  = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault(); last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault(); first.focus();
        }
      }
    });
  }
})();
