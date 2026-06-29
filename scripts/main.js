/* ============================================================
   NT JADE — main.js
   - Navbar scroll effect
   - Hero parallax + particles
   - Scroll reveal (Intersection Observer)
   - UTM parameter capture
   - Form handling
   ============================================================ */

(function () {
  'use strict';

  // ── NAVBAR SCROLL ──────────────────────────────────────────
  const navbar = document.getElementById('navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 60);
    }, { passive: true });
  }

  // ── HERO PARALLAX ──────────────────────────────────────────
  const heroBg = document.getElementById('hero-bg');
  if (heroBg) {
    window.addEventListener('scroll', () => {
      const scrolled = window.scrollY;
      heroBg.style.transform = `scale(1.08) translateY(${scrolled * 0.25}px)`;
    }, { passive: true });

    // Trigger scale in on load
    setTimeout(() => {
      heroBg.style.transform = 'scale(1) translateY(0)';
    }, 100);
  }

  // ── PARTICLE CANVAS ────────────────────────────────────────
  const canvas = document.getElementById('particles');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let particles = [];
    let animFrameId;

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize, { passive: true });

    function createParticle() {
      return {
        x: Math.random() * canvas.width,
        y: canvas.height + 10,
        size: Math.random() * 2.5 + 0.5,
        speedY: Math.random() * 0.8 + 0.3,
        speedX: (Math.random() - 0.5) * 0.4,
        opacity: Math.random() * 0.5 + 0.1,
        color: Math.random() > 0.6 ? '#C9A84C' : '#52B788',
      };
    }

    function initParticles() {
      particles = Array.from({ length: 40 }, createParticle).map(p => {
        p.y = Math.random() * canvas.height;
        return p;
      });
    }
    initParticles();

    function animateParticles() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p, i) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.opacity;
        ctx.fill();

        p.y -= p.speedY;
        p.x += p.speedX;
        p.opacity -= 0.001;

        if (p.y < -10 || p.opacity <= 0) {
          particles[i] = createParticle();
        }
      });
      ctx.globalAlpha = 1;
      animFrameId = requestAnimationFrame(animateParticles);
    }

    // Only animate when hero is visible
    const heroSection = document.getElementById('hero');
    const heroObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateParticles();
        } else {
          cancelAnimationFrame(animFrameId);
        }
      });
    });
    if (heroSection) heroObserver.observe(heroSection);
  }

  // ── SCROLL REVEAL ──────────────────────────────────────────
  const revealElements = document.querySelectorAll('.reveal');
  if (revealElements.length > 0 && 'IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -60px 0px',
    });

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    // Fallback: show all immediately
    revealElements.forEach(el => el.classList.add('visible'));
  }

  // ── UTM CAPTURE ────────────────────────────────────────────
  function captureUTM() {
    const params = new URLSearchParams(window.location.search);
    const utmKeys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'];

    utmKeys.forEach(key => {
      const value = params.get(key) || sessionStorage.getItem(key) || '';
      // Save to sessionStorage for persistence across pages
      if (params.get(key)) {
        sessionStorage.setItem(key, params.get(key));
      }
      // Fill hidden form fields
      const field = document.getElementById(key);
      if (field) field.value = value;
    });
  }
  captureUTM();

  // ── FORM HANDLING ──────────────────────────────────────────
  const form = document.getElementById('contact-form');
  const submitBtn = document.getElementById('form-submit-btn');

  if (form && submitBtn) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      // Basic validation
      const name = document.getElementById('field-name');
      const phone = document.getElementById('field-phone');

      if (!name.value.trim()) {
        name.style.borderColor = '#ef4444';
        name.focus();
        return;
      }
      if (!phone.value.trim()) {
        phone.style.borderColor = '#ef4444';
        phone.focus();
        return;
      }

      // Reset borders
      name.style.borderColor = '';
      phone.style.borderColor = '';

      // Collect form data
      const formData = new FormData(form);
      const data = Object.fromEntries(formData.entries());

      // Loading state
      submitBtn.textContent = 'Đang gửi...';
      submitBtn.disabled = true;
      submitBtn.style.opacity = '0.7';

      // Simulate submission (replace with actual endpoint)
      setTimeout(() => {
        submitBtn.textContent = '✓ Đã Nhận Yêu Cầu!';
        submitBtn.style.background = 'linear-gradient(135deg, var(--jade-mid), var(--jade-glow))';

        // Log data for dev (remove in production)
        console.log('[NT Jade Form]', data);

        // Show success message
        const formBox = document.querySelector('.form-box');
        if (formBox) {
          const successMsg = document.createElement('div');
          successMsg.style.cssText = `
            margin-top: 20px;
            padding: 16px 20px;
            background: rgba(82, 183, 136, 0.08);
            border: 1px solid rgba(82, 183, 136, 0.3);
            border-radius: 6px;
            font-size: 0.88rem;
            color: var(--jade-light);
            line-height: 1.7;
            text-align: center;
          `;
          successMsg.innerHTML = `
            <strong>Cảm ơn ${data.name || 'bạn'}!</strong><br />
            Chúng tôi sẽ liên hệ qua Zalo <strong>${data.phone || ''}</strong> trong vòng 2 giờ để xác nhận lịch hẹn.
          `;
          formBox.appendChild(successMsg);
        }
      }, 1200);
    });

    // Reset border on input
    ['field-name', 'field-phone'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.addEventListener('input', () => { el.style.borderColor = ''; });
    });
  }

  // ── SMOOTH ANCHOR SCROLL ───────────────────────────────────
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = 80;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  // ── CLICKABLE SKU CARDS ─────────────────────────────────────
  document.querySelectorAll('.sku-card').forEach(card => {
    const link = card.querySelector('.btn-sku');
    if (link) {
      card.style.cursor = 'pointer';
      card.addEventListener('click', (e) => {
        // If clicked element is already a link or button (or inside one), do nothing
        if (e.target.closest('a') || e.target.closest('button')) {
          return;
        }
        const href = link.getAttribute('href');
        if (href) {
          window.location.href = href;
        }
      });
    }
  });

  // ── VIDEO PLAY BUTTON ──────────────────────────────────────
  const playBtn = document.getElementById('play-btn');
  if (playBtn) {
    playBtn.addEventListener('click', () => {
      // Placeholder — replace with actual video embed logic
      playBtn.innerHTML = `<svg viewBox="0 0 24 24" fill="currentColor" width="28" height="28"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>`;
      console.log('[NT Jade] Video play triggered');
    });
  }

})();
