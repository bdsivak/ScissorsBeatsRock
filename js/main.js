/* ============================================================
   SCISSORS BEATS ROCK — Main JavaScript
   ============================================================ */

(function () {
  'use strict';

  // ── Film Grain Effect ─────────────────────────────────────
  function initGrain() {
    const canvas = document.getElementById('grain-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;

    function resize() {
      canvas.width = window.innerWidth / 2;
      canvas.height = window.innerHeight / 2;
      canvas.style.width = '100%';
      canvas.style.height = '100%';
    }

    function render() {
      const w = canvas.width;
      const h = canvas.height;
      const imageData = ctx.createImageData(w, h);
      const data = imageData.data;

      for (let i = 0; i < data.length; i += 4) {
        const v = Math.random() * 255;
        data[i] = v;
        data[i + 1] = v;
        data[i + 2] = v;
        data[i + 3] = 255;
      }

      ctx.putImageData(imageData, 0, 0);
      animId = requestAnimationFrame(render);
    }

    window.addEventListener('resize', resize);
    resize();
    render();

    // Reduce CPU: only render grain every 3 frames
    let frameCount = 0;
    cancelAnimationFrame(animId);
    function renderThrottled() {
      frameCount++;
      if (frameCount % 3 === 0) {
        const w = canvas.width;
        const h = canvas.height;
        const imageData = ctx.createImageData(w, h);
        const data = imageData.data;
        for (let i = 0; i < data.length; i += 4) {
          const v = Math.random() * 255;
          data[i] = v;
          data[i + 1] = v;
          data[i + 2] = v;
          data[i + 3] = 255;
        }
        ctx.putImageData(imageData, 0, 0);
      }
      requestAnimationFrame(renderThrottled);
    }
    renderThrottled();
  }

  // ── Page Transition (VHS Static) ──────────────────────────
  function initPageTransition() {
    const overlay = document.getElementById('page-transition');
    if (!overlay) return;
    const canvas = overlay.querySelector('canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    function resizeTransition() {
      canvas.width = window.innerWidth / 3;
      canvas.height = window.innerHeight / 3;
    }
    resizeTransition();
    window.addEventListener('resize', resizeTransition);

    function drawStatic() {
      const w = canvas.width;
      const h = canvas.height;
      const imageData = ctx.createImageData(w, h);
      const data = imageData.data;
      for (let i = 0; i < data.length; i += 4) {
        const v = Math.random() * 255;
        data[i] = v;
        data[i + 1] = v;
        data[i + 2] = v;
        data[i + 3] = 255;
      }
      ctx.putImageData(imageData, 0, 0);
    }

    let staticInterval;

    function showStatic(callback) {
      overlay.classList.add('active');
      staticInterval = setInterval(drawStatic, 50);
      setTimeout(function () {
        if (callback) callback();
      }, 250);
    }

    function hideStatic() {
      setTimeout(function () {
        overlay.classList.remove('active');
        clearInterval(staticInterval);
      }, 150);
    }

    // Intercept navigation clicks
    document.querySelectorAll('a[href]').forEach(function (link) {
      const href = link.getAttribute('href');
      // Only intercept local page links
      if (
        href &&
        !href.startsWith('#') &&
        !href.startsWith('http') &&
        !href.startsWith('mailto:') &&
        href.endsWith('.html')
      ) {
        link.addEventListener('click', function (e) {
          e.preventDefault();
          showStatic(function () {
            window.location.href = href;
          });
        });
      }
    });

    // On page load, hide static
    hideStatic();
  }

  // ── Navigation ────────────────────────────────────────────
  function initNav() {
    const nav = document.querySelector('.nav');
    const toggle = document.querySelector('.nav-toggle');
    const mobileMenu = document.querySelector('.mobile-menu');

    // Scroll behavior
    if (nav) {
      window.addEventListener('scroll', function () {
        if (window.scrollY > 40) {
          nav.classList.add('scrolled');
        } else {
          nav.classList.remove('scrolled');
        }
      });
    }

    // Mobile menu
    if (toggle && mobileMenu) {
      toggle.addEventListener('click', function () {
        toggle.classList.toggle('open');
        mobileMenu.classList.toggle('open');
        document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
      });

      mobileMenu.querySelectorAll('a').forEach(function (link) {
        link.addEventListener('click', function () {
          toggle.classList.remove('open');
          mobileMenu.classList.remove('open');
          document.body.style.overflow = '';
        });
      });
    }

    // Set active nav link
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-links a, .mobile-menu a').forEach(function (link) {
      const href = link.getAttribute('href');
      if (href === currentPage || (currentPage === '' && href === 'index.html')) {
        link.classList.add('active');
      }
    });
  }

  // ── Scroll Reveal ─────────────────────────────────────────
  function initReveal() {
    const reveals = document.querySelectorAll('.reveal, .reveal-stagger');
    if (!reveals.length) return;

    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );

    reveals.forEach(function (el) {
      observer.observe(el);
    });
  }

  // ── Cassette Tape Player ──────────────────────────────────
  function initPlayer() {
    const player = document.querySelector('.tape-player');
    if (!player) return;

    const playBtn = player.querySelector('.player-btn-play');
    const prevBtn = player.querySelector('.player-btn-prev');
    const nextBtn = player.querySelector('.player-btn-next');
    const artistEl = player.querySelector('.player-artist');
    const trackEl = player.querySelector('.player-track');
    const progressFill = player.querySelector('.player-progress-fill');
    const progressBar = player.querySelector('.player-progress');
    const currentTimeEl = player.querySelector('.player-time-current');
    const totalTimeEl = player.querySelector('.player-time-total');

    const tracks = [
      { artist: 'Worn Photographs', title: 'Developing Slowly', duration: '4:23' },
      { artist: 'The Pale Hours', title: 'Signal & Noise', duration: '3:47' },
      { artist: 'Satellite Curfew', title: 'Parallax View', duration: '5:12' },
      { artist: 'Glass Patterns', title: 'Light Bends', duration: '3:55' },
      { artist: 'Minor Delays', title: 'Two Stops Past Home', duration: '4:41' },
      { artist: 'Weathervane Hearts', title: 'True North Drifts', duration: '6:08' },
    ];

    let currentTrack = 0;
    let isPlaying = false;
    let progress = 0;
    let progressInterval;

    function updateTrack() {
      const track = tracks[currentTrack];
      if (artistEl) artistEl.textContent = track.artist;
      if (trackEl) trackEl.textContent = track.title;
      if (totalTimeEl) totalTimeEl.textContent = track.duration;
      if (currentTimeEl) currentTimeEl.textContent = '0:00';
      progress = 0;
      updateProgress();
    }

    function updateProgress() {
      if (progressFill) {
        progressFill.style.width = progress + '%';
      }
      if (currentTimeEl) {
        const track = tracks[currentTrack];
        const parts = track.duration.split(':');
        const totalSec = parseInt(parts[0]) * 60 + parseInt(parts[1]);
        const currentSec = Math.floor((progress / 100) * totalSec);
        const min = Math.floor(currentSec / 60);
        const sec = currentSec % 60;
        currentTimeEl.textContent = min + ':' + (sec < 10 ? '0' : '') + sec;
      }
    }

    function togglePlay() {
      isPlaying = !isPlaying;
      player.classList.toggle('playing', isPlaying);

      if (playBtn) {
        playBtn.innerHTML = isPlaying
          ? '<svg viewBox="0 0 24 24"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>'
          : '<svg viewBox="0 0 24 24"><polygon points="5,3 19,12 5,21"/></svg>';
      }

      if (isPlaying) {
        progressInterval = setInterval(function () {
          progress += 0.15;
          if (progress >= 100) {
            nextTrack();
          }
          updateProgress();
        }, 100);
      } else {
        clearInterval(progressInterval);
      }
    }

    function nextTrack() {
      currentTrack = (currentTrack + 1) % tracks.length;
      progress = 0;
      updateTrack();
      if (!isPlaying) togglePlay();
    }

    function prevTrack() {
      if (progress > 5) {
        progress = 0;
        updateProgress();
      } else {
        currentTrack = (currentTrack - 1 + tracks.length) % tracks.length;
        updateTrack();
      }
    }

    if (playBtn) playBtn.addEventListener('click', togglePlay);
    if (nextBtn) nextBtn.addEventListener('click', nextTrack);
    if (prevBtn) prevBtn.addEventListener('click', prevTrack);

    if (progressBar) {
      progressBar.addEventListener('click', function (e) {
        const rect = progressBar.getBoundingClientRect();
        progress = ((e.clientX - rect.left) / rect.width) * 100;
        updateProgress();
      });
    }

    updateTrack();
  }

  // ── Radio Equalizer ───────────────────────────────────────
  function initEqualizer() {
    const container = document.querySelector('.radio-dial');
    if (!container) return;

    const barCount = 32;
    for (let i = 0; i < barCount; i++) {
      const bar = document.createElement('div');
      bar.className = 'eq-bar';
      const height = 10 + Math.random() * 40;
      bar.style.setProperty('--eq-height', height + 'px');
      bar.style.height = '8px';
      bar.style.animationDelay = (Math.random() * 0.5) + 's';
      bar.style.animationDuration = (0.4 + Math.random() * 0.6) + 's';
      container.appendChild(bar);
    }
  }

  // ── Filter Buttons ────────────────────────────────────────
  function initFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    if (!filterBtns.length) return;

    filterBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        filterBtns.forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');

        const filter = btn.dataset.filter;
        const items = document.querySelectorAll('[data-category]');
        items.forEach(function (item) {
          if (filter === 'all' || item.dataset.category === filter) {
            item.style.display = '';
            setTimeout(function () { item.style.opacity = '1'; item.style.transform = 'translateY(0)'; }, 50);
          } else {
            item.style.opacity = '0';
            item.style.transform = 'translateY(10px)';
            setTimeout(function () { item.style.display = 'none'; }, 300);
          }
        });
      });
    });
  }

  // ── Contact Form ──────────────────────────────────────────
  function initContactForm() {
    const form = document.querySelector('.contact-form');
    if (!form) return;

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      const btn = form.querySelector('button[type="submit"]');
      const originalText = btn.textContent;
      btn.textContent = 'SENT!';
      btn.style.background = 'var(--accent-teal)';
      btn.style.borderColor = 'var(--accent-teal)';
      setTimeout(function () {
        btn.textContent = originalText;
        btn.style.background = '';
        btn.style.borderColor = '';
        form.reset();
      }, 2000);
    });
  }

  // ── Newsletter Form ───────────────────────────────────────
  function initNewsletter() {
    const forms = document.querySelectorAll('.newsletter-form');
    forms.forEach(function (form) {
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        const btn = form.querySelector('button');
        const input = form.querySelector('input');
        const originalText = btn.textContent;
        btn.textContent = 'SUBSCRIBED!';
        input.value = '';
        setTimeout(function () {
          btn.textContent = originalText;
        }, 2000);
      });
    });
  }

  // ── Radio Toggle ──────────────────────────────────────────
  function initRadio() {
    const radioPlayer = document.querySelector('.radio-player');
    const radioToggle = document.querySelector('.radio-toggle');
    if (!radioPlayer || !radioToggle) return;

    radioToggle.addEventListener('click', function () {
      radioPlayer.classList.toggle('playing');
      const isPlaying = radioPlayer.classList.contains('playing');
      radioToggle.querySelector('span').textContent = isPlaying ? 'Pause' : 'Listen Live';
    });
  }

  // ── Smooth Scroll for Anchor Links ────────────────────────
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function (link) {
      link.addEventListener('click', function (e) {
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });
  }

  // ── Initialize Everything ─────────────────────────────────
  document.addEventListener('DOMContentLoaded', function () {
    initGrain();
    initPageTransition();
    initNav();
    initReveal();
    initPlayer();
    initEqualizer();
    initFilters();
    initContactForm();
    initNewsletter();
    initRadio();
    initSmoothScroll();
  });
})();
