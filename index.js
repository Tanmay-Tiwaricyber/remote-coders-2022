/* Remote Coders — Global JS (black & white cyberpunk) */
(() => {
    'use strict';
  
    // Utils
    const $ = (s, ctx = document) => ctx.querySelector(s);
    const $$ = (s, ctx = document) => Array.from(ctx.querySelectorAll(s));
    const clamp = (n, a, b) => Math.max(a, Math.min(b, n));
    const on = (el, ev, fn, opt) => el && el.addEventListener(ev, fn, opt);
  
    // Motion preference
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    let motionEnabled = !mq.matches;
    mq.addEventListener?.('change', (e) => (motionEnabled = !e.matches));
  
    // Remove no-js class if present
    document.documentElement.classList.remove('no-js');
  
    // Mobile menu
    (() => {
      const hamburger = $('#hamburger');
      const overlay = $('#menuOverlay');
      if (!hamburger || !overlay) return;
  
      const toggleMenu = (open) => {
        const willOpen = open ?? !overlay.classList.contains('open');
        overlay.hidden = false;
        requestAnimationFrame(() => {
          overlay.classList.toggle('open', willOpen);
          hamburger.classList.toggle('is-open', willOpen);
          hamburger.setAttribute('aria-expanded', String(willOpen));
          if (!willOpen) setTimeout(() => (overlay.hidden = true), 220);
        });
      };
  
      on(hamburger, 'click', () => toggleMenu());
      on(overlay, 'click', (e) => {
        if (e.target.classList.contains('menu-overlay') || e.target.classList.contains('overlay-link')) {
          toggleMenu(false);
        }
      });
      on(document, 'keydown', (e) => {
        if (e.key === 'Escape' && overlay.classList.contains('open')) toggleMenu(false);
      });
    })();
  
    // Scroll progress (optional: only works if #progress exists)
    (() => {
      const bar = $('#progress');
      if (!bar) return;
      const update = () => {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        const pct = clamp((window.scrollY / (max || 1)) * 100, 0, 100);
        bar.style.width = pct + '%';
      };
      on(window, 'scroll', update, { passive: true });
      update();
    })();
  
    // Reveal on scroll
    (() => {
      const els = $$('[data-reveal]');
      if (!els.length) return;
      if (!('IntersectionObserver' in window) || !motionEnabled) {
        els.forEach((el) => el.classList.add('is-visible'));
        return;
      }
      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('is-visible');
              io.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.12 }
      );
      els.forEach((el) => io.observe(el));
    })();
  
    // Typewriter (hero)
    (() => {
      const el = $('#typed');
      if (!el) return;
  
      const words = [
        'Cybersecurity',
        'Programming',
        'THM Walkthroughs',
        'CTF Writeups',
        'Research & Tools'
      ];
  
      if (!motionEnabled) {
        el.textContent = words.join(' • ');
        return;
      }
  
      if (el.dataset.typingAttached === 'true') return;
      el.dataset.typingAttached = 'true';
  
      let w = 0, i = 0, del = false;
      const pause = 900;
  
      const loop = () => {
        const word = words[w];
        i = del ? i - 1 : i + 1;
        el.textContent = word.slice(0, i);
  
        if (!del && i === word.length) {
          setTimeout(() => (del = true), pause);
        } else if (del && i === 0) {
          del = false;
          w = (w + 1) % words.length;
        }
        setTimeout(loop, del ? 28 : 48);
      };
      loop();
    })();
  
    // Glitch pulse
    (() => {
      if (!motionEnabled) return;
      const els = $$('.glitch');
      if (!els.length) return;
  
      const tick = () => {
        els.forEach((el) => {
          el.classList.toggle('is-glitching', Math.random() < 0.08);
        });
        setTimeout(tick, 180);
      };
      tick();
    })();
  
    // 3D Tilt + glow follow
    (() => {
      if (!motionEnabled) return;
      const cards = $$('.tilt');
      if (!cards.length) return;
  
      cards.forEach((card) => {
        const rect = () => card.getBoundingClientRect();
        on(card, 'pointermove', (e) => {
          const r = rect();
          const x = e.clientX - r.left;
          const y = e.clientY - r.top;
          const px = x / r.width - 0.5;
          const py = y / r.height - 0.5;
  
          card.style.transform = `rotateX(${(-py * 6).toFixed(2)}deg) rotateY(${(px * 6).toFixed(2)}deg) translateZ(0)`;
          card.style.setProperty('--x', `${x}px`);
          card.style.setProperty('--y', `${y}px`);
        });
        on(card, 'pointerleave', () => {
          card.style.transform = 'rotateX(0) rotateY(0)';
          card.style.removeProperty('--x');
          card.style.removeProperty('--y');
        });
      });
    })();
  
    // Magnetic hover (for elements with [data-magnetic])
    (() => {
      if (!motionEnabled) return;
      const els = $$('[data-magnetic]');
      if (!els.length) return;
  
      els.forEach((el) => {
        const strength = 20;
        on(el, 'pointermove', (e) => {
          const r = el.getBoundingClientRect();
          const x = ((e.clientX - r.left) / r.width - 0.5) * 2;
          const y = ((e.clientY - r.top) / r.height - 0.5) * 2;
          el.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
        });
        on(el, 'pointerleave', () => {
          el.style.transform = 'translate(0,0)';
        });
      });
    })();
  
    // Parallax hero (elements with .parallax and data-depth)
    (() => {
      if (!motionEnabled) return;
      const layers = $$('.parallax');
      if (!layers.length) return;
  
      let tx = window.innerWidth / 2;
      let ty = window.innerHeight / 2;
  
      on(window, 'pointermove', (e) => {
        tx = e.clientX;
        ty = e.clientY;
      }, { passive: true });
  
      const cx = () => window.innerWidth / 2;
      const cy = () => window.innerHeight / 2;
  
      const tick = () => {
        layers.forEach((layer) => {
          const depth = parseFloat(layer.getAttribute('data-depth') || '0.2');
          const dx = (tx - cx()) / -40 * depth;
          const dy = (ty - cy()) / -40 * depth;
          layer.style.transform = `translate3d(${dx}px, ${dy}px, 0)`;
        });
        requestAnimationFrame(tick);
      };
      tick();
    })();
  
    // Custom cursor
    (() => {
      if (!motionEnabled) return;
      const cursor = $('#cursor');
      if (!cursor) return;
  
      let x = 0, y = 0, tx = 0, ty = 0;
      const speed = 0.22;
  
      on(window, 'pointermove', (e) => {
        x = e.clientX;
        y = e.clientY;
      }, { passive: true });
  
      const raf = () => {
        tx += (x - tx) * speed;
        ty += (y - ty) * speed;
        cursor.style.transform = `translate(${tx}px, ${ty}px) translate(-50%, -50%)`;
        requestAnimationFrame(raf);
      };
      raf();
  
      const hoverables = 'a, button, .card, .nav-link';
      on(document, 'mouseover', (e) => {
        if (e.target.closest(hoverables)) {
          cursor.style.width = '30px';
          cursor.style.height = '30px';
          cursor.style.background = 'rgba(255,255,255,0.08)';
          cursor.style.boxShadow = '0 0 18px rgba(255,255,255,0.2)';
        }
      });
      on(document, 'mouseout', (e) => {
        if (e.target.closest(hoverables)) {
          cursor.style.width = '22px';
          cursor.style.height = '22px';
          cursor.style.background = 'transparent';
          cursor.style.boxShadow = 'none';
        }
      });
    })();
  
    // Generic filter connector (for Blogs and THM pages)
    function connectFilters(toolbarSelector, cardSelector) {
      const toolbar = $(toolbarSelector);
      if (!toolbar) return;
  
      const input = $('input[type="search"]#search', toolbar) || $('input[type="search"]', toolbar);
      const tags = $$('.tag', toolbar);
      const cards = $$(cardSelector);
      if (!input || !cards.length) return;
  
      let activeTags = new Set();
      const norm = (s) => (s || '').toLowerCase().trim();
  
      const matches = (card, q, set) => {
        const hay = [
          card.dataset.title,
          card.dataset.tags,
          card.textContent
        ].join(' ').toLowerCase();
  
        const qOk = !q || hay.includes(q);
        const tOk = !set.size || [...set].every((t) => (card.dataset.tags || '').toLowerCase().includes(t));
        return qOk && tOk;
      };
  
      const apply = () => {
        const q = norm(input.value);
        cards.forEach((c) => {
          c.style.display = matches(c, q, activeTags) ? '' : 'none';
        });
      };
  
      on(input, 'input', apply);
      tags.forEach((btn) => {
        on(btn, 'click', () => {
          const t = (btn.dataset.tag || '').toLowerCase();
          const pressed = btn.getAttribute('aria-pressed') === 'true';
          btn.setAttribute('aria-pressed', String(!pressed));
          if (pressed) activeTags.delete(t);
          else activeTags.add(t);
          apply();
        });
      });
  
      apply();
    }
  
    // Wire up page-specific filters if present
    connectFilters('.blog-toolbar', '.blog-card');
    connectFilters('.thm-toolbar', '.room-card');
  
    // Contact: copy phone button
    (() => {
      const btn = $('#copyPhone');
      if (!btn) return;
      on(btn, 'click', async () => {
        try {
          await navigator.clipboard.writeText('+916306256015');
          const prev = btn.textContent;
          btn.textContent = '> Copied!';
          setTimeout(() => (btn.textContent = prev), 1200);
        } catch {
          const prev = btn.textContent;
          btn.textContent = '> Press Ctrl+C';
          setTimeout(() => (btn.textContent = prev), 1500);
        }
      });
    })();
  })();

  overlay.addEventListener('click', (e) => {
    const clickedLink = e.target.closest('.overlay-link');
    if (clickedLink || e.target === overlay) {
      // close overlay; navigation continues normally for links
      toggleMenu(false);
    }
  });
