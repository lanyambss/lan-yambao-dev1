/* ══════════════════════════
   PARTICLES
══════════════════════════ */
const canvas = document.getElementById('particles');
const ctx = canvas.getContext('2d');
let particles = [];

function resize() {
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
}
resize();
window.addEventListener('resize', resize);

function rand(a, b) { return a + Math.random() * (b - a); }

function createParticles() {
  particles = [];
  const count = Math.floor(window.innerWidth / 10);
  for (let i = 0; i < count; i++) {
    particles.push({
      x:     Math.random() * canvas.width,
      y:     Math.random() * canvas.height,
      r:     rand(0.4, 2.4),
      dx:    rand(-0.2, 0.2),
      dy:    rand(-0.28, -0.05),
      alpha: rand(0.15, 0.85),
      blue:  Math.random() < 0.55
    });
  }
}
createParticles();
window.addEventListener('resize', createParticles);

function drawParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (const p of particles) {
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = p.blue
      ? `rgba(79,142,247,${p.alpha})`
      : `rgba(6,182,212,${p.alpha * 0.6})`;
    ctx.fill();

    p.x += p.dx;
    p.y += p.dy;
    if (p.y < -4) { p.y = canvas.height + 4; p.x = Math.random() * canvas.width; }
    if (p.x < -4)              p.x = canvas.width + 4;
    if (p.x > canvas.width + 4) p.x = -4;
  }
  requestAnimationFrame(drawParticles);
}
drawParticles();


/* ══════════════════════════
   CUSTOM CURSOR
══════════════════════════ */
const dot  = document.getElementById('cursorDot');
const ring = document.getElementById('cursorRing');
let mouseX = 0, mouseY = 0;
let ringX  = 0, ringY  = 0;

document.addEventListener('mousemove', e => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  dot.style.left = mouseX + 'px';
  dot.style.top  = mouseY + 'px';
});

// Ring lags behind for smooth trailing effect
function animateRing() {
  ringX += (mouseX - ringX) * 0.12;
  ringY += (mouseY - ringY) * 0.12;
  ring.style.left = ringX + 'px';
  ring.style.top  = ringY + 'px';
  requestAnimationFrame(animateRing);
}
animateRing();

// Expand cursor on interactive elements
const hoverTargets = 'a, button, .skill-card, .project-card, .about-stat-card, .btn, input, textarea, .nav-logo, .social-link';
document.querySelectorAll(hoverTargets).forEach(el => {
  el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
  el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
});

// Hide cursor when leaving window
document.addEventListener('mouseleave', () => {
  dot.style.opacity = '0';
  ring.style.opacity = '0';
});
document.addEventListener('mouseenter', () => {
  dot.style.opacity = '1';
  ring.style.opacity = '1';
});


/* ══════════════════════════
   3D TILT + SPOTLIGHT
══════════════════════════ */
const tiltCards = document.querySelectorAll('.skill-card, .project-card, .about-stat-card');

tiltCards.forEach(card => {
  // Inject spotlight div
  const spotlight = document.createElement('div');
  spotlight.classList.add('card-spotlight');
  card.appendChild(spotlight);

  card.addEventListener('mousemove', e => {
    const rect   = card.getBoundingClientRect();
    const cx     = rect.left + rect.width  / 2;
    const cy     = rect.top  + rect.height / 2;
    const dx     = e.clientX - cx;
    const dy     = e.clientY - cy;
    const maxTilt = 12;
    const tiltX  = (-dy / (rect.height / 2)) * maxTilt;
    const tiltY  =  (dx / (rect.width  / 2)) * maxTilt;

    card.style.transform = `perspective(800px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateY(-8px) scale(1.02)`;
    card.style.transition = 'transform 0.08s ease';

    // Move spotlight
    const sx = e.clientX - rect.left;
    const sy = e.clientY - rect.top;
    spotlight.style.left = sx + 'px';
    spotlight.style.top  = sy + 'px';
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform  = '';
    card.style.transition = 'transform 0.5s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.4s ease, border-color 0.35s ease';
  });
});


/* ══════════════════════════
   BUTTON RIPPLE
══════════════════════════ */
document.querySelectorAll('.btn').forEach(btn => {
  btn.addEventListener('click', function(e) {
    const rect   = btn.getBoundingClientRect();
    const ripple = document.createElement('span');
    ripple.classList.add('ripple');
    const size = Math.max(rect.width, rect.height);
    ripple.style.width  = size + 'px';
    ripple.style.height = size + 'px';
    ripple.style.left   = (e.clientX - rect.left - size / 2) + 'px';
    ripple.style.top    = (e.clientY - rect.top  - size / 2) + 'px';
    btn.appendChild(ripple);
    ripple.addEventListener('animationend', () => ripple.remove());
  });
});


/* ══════════════════════════
   SCROLL REVEAL
══════════════════════════ */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// Also reveal individual cards with staggered delay
document.querySelectorAll('.skill-card, .project-card, .about-stat-card').forEach((card, i) => {
  card.classList.add('reveal');
  card.style.transitionDelay = `${i * 0.08}s`;
  revealObserver.observe(card);
});


/* ══════════════════════════
   MOBILE NAV TOGGLE
══════════════════════════ */
const toggle   = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');

toggle.addEventListener('click', () => navLinks.classList.toggle('open'));
document.querySelectorAll('.nav-links a').forEach(a => {
  a.addEventListener('click', () => navLinks.classList.remove('open'));
});


/* ══════════════════════════
   ACTIVE NAV ON SCROLL
══════════════════════════ */
const sections = document.querySelectorAll('section[id]');
const links    = document.querySelectorAll('.nav-links a');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      links.forEach(l => l.classList.remove('active-link'));
      const active = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
      if (active) active.classList.add('active-link');
    }
  });
}, { threshold: 0.4 });

sections.forEach(s => sectionObserver.observe(s));


/* ══════════════════════════
   CONTACT FORM
══════════════════════════ */
const form = document.querySelector('.contact-form');
form.addEventListener('submit', e => {
  e.preventDefault();
  const btn = form.querySelector('button');
  btn.textContent = '✓ Message Sent!';
  btn.style.background   = 'linear-gradient(135deg,#16a34a,#22c55e)';
  btn.style.borderColor  = '#22c55e';
  btn.style.boxShadow    = '0 8px 24px rgba(34,197,94,0.4)';
  setTimeout(() => {
    btn.textContent       = 'Send Message';
    btn.style.background  = '';
    btn.style.borderColor = '';
    btn.style.boxShadow   = '';
    form.reset();
  }, 3000);
});
