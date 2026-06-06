/* ═══ RAYS & RZILSS — script.js ═══ */
'use strict';

/* ── THEME ─────────────────────────────────────── */
const html = document.documentElement;
const toggle = document.getElementById('themeToggle');
html.setAttribute('data-theme', localStorage.getItem('rr-theme') || 'light');
toggle.addEventListener('click', () => {
  const next = html.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
  html.setAttribute('data-theme', next);
  localStorage.setItem('rr-theme', next);
});

/* ── NAVBAR ────────────────────────────────────── */
const navbar = document.getElementById('navbar');
const burger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
  updateActive();
}, { passive: true });

burger.addEventListener('click', () => {
  const open = navLinks.classList.toggle('open');
  const s = burger.querySelectorAll('span');
  if (open) {
    s[0].style.transform = 'translateY(7px) rotate(45deg)';
    s[1].style.opacity = '0';
    s[2].style.transform = 'translateY(-7px) rotate(-45deg)';
  } else {
    s.forEach(x => { x.style.transform = ''; x.style.opacity = ''; });
  }
});

navLinks.querySelectorAll('.nav-link').forEach(l =>
  l.addEventListener('click', () => {
    navLinks.classList.remove('open');
    burger.querySelectorAll('span').forEach(x => { x.style.transform = ''; x.style.opacity = ''; });
  })
);

function updateActive() {
  const sy = window.scrollY + 130;
  document.querySelectorAll('section[id]').forEach(sec => {
    const link = document.querySelector(`.nav-link[href="#${sec.id}"]`);
    if (link) link.classList.toggle('active', sy >= sec.offsetTop && sy < sec.offsetTop + sec.offsetHeight);
  });
}
updateActive();

/* ── SCROLL REVEAL ─────────────────────────────── */
const ro = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.11 });
document.querySelectorAll('.reveal').forEach(el => ro.observe(el));

/* ── COUNTER ANIMATION ─────────────────────────── */
function animCounter(el) {
  const target = +el.dataset.target;
  if (target === 0) { el.textContent = '0'; return; }
  const dur = 2200, start = performance.now();
  (function step(now) {
    const p = Math.min((now - start) / dur, 1);
    const ease = 1 - Math.pow(1 - p, 3);
    el.textContent = Math.round(ease * target).toLocaleString();
    if (p < 1) requestAnimationFrame(step);
  })(start);
}
const co = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) { animCounter(e.target); co.unobserve(e.target); }
  });
}, { threshold: 0.6 });
document.querySelectorAll('[data-target]').forEach(el => co.observe(el));

/* ── FAQ ACCORDION ─────────────────────────────── */
document.querySelectorAll('.faq-item').forEach(item => {
  item.querySelector('.faq-q').addEventListener('click', () => {
    const isOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item.open').forEach(o => o.classList.remove('open'));
    if (!isOpen) item.classList.add('open');
    const btn = item.querySelector('.faq-q');
    btn.setAttribute('aria-expanded', String(!isOpen));
  });
});

/* ── TIMELINE DOTS ─────────────────────────────── */
const tlObs = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.tl-dot:not(.tl-dot--final)').forEach((dot, i) => {
        setTimeout(() => {
          dot.style.background = 'var(--brand-blue-2)';
          dot.style.borderColor = 'var(--brand-blue-2)';
          dot.style.boxShadow = '0 0 0 4px rgba(38,66,181,.22)';
          dot.style.transition = 'all 0.4s ease';
        }, i * 280);
      });
      tlObs.unobserve(entry.target);
    }
  });
}, { threshold: 0.4 });
document.querySelectorAll('.timeline-wrap').forEach(el => tlObs.observe(el));

/* ── MODULE CARD TILT ──────────────────────────── */
document.querySelectorAll('.mod').forEach(card => {
  card.addEventListener('mousemove', e => {
    const r = card.getBoundingClientRect();
    const dx = (e.clientX - r.left - r.width / 2) / (r.width / 2);
    const dy = (e.clientY - r.top - r.height / 2) / (r.height / 2);
    card.style.transform = `translateY(-5px) rotateX(${-dy * 4}deg) rotateY(${dx * 4}deg)`;
  });
  card.addEventListener('mouseleave', () => { card.style.transform = ''; });
});

/* ── CONTACT FORM ──────────────────────────────── */
const form = document.getElementById('contactForm');
const toast = document.getElementById('toast');
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const btn = form.querySelector('.cf-submit');
  const orig = btn.textContent;
  btn.textContent = 'Sending…';
  btn.disabled = true;

  const formData = new FormData(form);
  const name = formData.get('name');
  const phone = formData.get('phone');
  const email = formData.get('email') || 'Not provided';
  const track = formData.get('track');
  const qualification = formData.get('qualification') || 'Not provided';
  const message = formData.get('message') || 'No message';

  try {
    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      body: formData
    });

    const result = await response.json();

    if (result.success) {
      form.reset();
      toast.classList.add('show');
      setTimeout(() => toast.classList.remove('show'), 3800);

      // WhatsApp Redirect
      const ownerPhone = "919073542257";
      const text = `Hello RAYS & RZILSS, I have submitted an enquiry:\n\n` +
                   `• *Name:* ${name}\n` +
                   `• *Phone:* ${phone}\n` +
                   `• *Email:* ${email}\n` +
                   `• *Track:* ${track}\n` +
                   `• *Qualification:* ${qualification}\n` +
                   `• *Message:* ${message}`;

      const waUrl = `https://wa.me/${ownerPhone}?text=${encodeURIComponent(text)}`;
      window.open(waUrl, '_blank');
    }

  } catch (error) {
    alert("Failed to send enquiry. Please try again or contact us directly.");
  }
  btn.textContent = orig;
  btn.disabled = false;
});
