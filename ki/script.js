// ===========================================================
// KI-Agentur Netpartner — interactions
// ===========================================================

// Starfield generation
(function starfield() {
  const field = document.querySelector('.starfield');
  if (!field) return;
  const count = 60;
  for (let i = 0; i < count; i++) {
    const s = document.createElement('span');
    s.style.left = Math.random() * 100 + '%';
    s.style.top = Math.random() * 100 + '%';
    s.style.animationDelay = (Math.random() * 4) + 's';
    s.style.width = s.style.height = (Math.random() * 1.5 + 1) + 'px';
    field.appendChild(s);
  }
})();

// Nav scroll state
(function navScroll() {
  const nav = document.querySelector('header.nav');
  if (!nav) return;
  const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 20);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
})();

// Mobile menu toggle
(function mobileMenu() {
  const toggle = document.querySelector('.menu-toggle');
  const links = document.querySelector('nav.links');
  if (!toggle || !links) return;
  toggle.addEventListener('click', () => {
    links.classList.toggle('mobile-open');
    toggle.classList.toggle('active');
  });
})();

// Scroll reveal
(function reveal() {
  const els = document.querySelectorAll('.reveal');
  if (!els.length) return;
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add('in');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.15 });
  els.forEach((el) => io.observe(el));
})();

// FAQ accordion
(function faq() {
  document.querySelectorAll('.faq-item').forEach((item) => {
    const q = item.querySelector('.faq-q');
    if (!q) return;
    q.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      item.parentElement.querySelectorAll('.faq-item').forEach((i) => i.classList.remove('open'));
      if (!isOpen) item.classList.add('open');
    });
  });
})();

// Orb parallax tilt on mouse move (hero)
(function orbParallax() {
  const wrap = document.querySelector('.hero-orb-wrap');
  if (!wrap) return;
  const orb = wrap.querySelector('.orb');
  document.addEventListener('mousemove', (e) => {
    const x = (e.clientX / window.innerWidth - 0.5) * 24;
    const y = (e.clientY / window.innerHeight - 0.5) * 24;
    if (orb) orb.style.transform = `translate(${x}px, ${y}px)`;
  });
})();

// Active nav link by current page
(function activeLink() {
  const path = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('nav.links a').forEach((a) => {
    const href = a.getAttribute('href');
    if (href === path) a.classList.add('active');
  });
})();

// Kontaktformular → https://lead.netpartner.cloud/contact (Server der Lead Machine)
(function contactForm() {
  const form = document.querySelector('#contact-form');
  if (!form) return;
  const status = document.createElement('p');
  status.className = 'form-status';
  status.style.cssText = 'margin-top:1rem;font-size:.92rem;color:#c9cfdb';
  form.appendChild(status);

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    const original = btn.innerHTML;
    btn.innerHTML = 'Wird gesendet…';
    btn.disabled = true;
    status.textContent = '';
    try {
      const data = new URLSearchParams();
      for (const [k, v] of new FormData(form).entries()) data.append(k, v);
      const res = await fetch('https://lead.netpartner.cloud/contact', { method: 'POST', body: data });
      const out = await res.json().catch(() => ({}));
      if (res.ok && out.ok) {
        btn.innerHTML = 'Nachricht gesendet ✓';
        status.textContent = 'Danke — Ihre Nachricht ist angekommen. Wir melden uns persönlich zurück.';
        form.reset();
      } else {
        btn.innerHTML = original;
        btn.disabled = false;
        status.textContent = out.error || 'Das hat leider nicht geklappt. Bitte schreiben Sie an info@netpartnersystem.com.';
      }
    } catch (err) {
      btn.innerHTML = original;
      btn.disabled = false;
      status.textContent = 'Keine Verbindung zum Server. Bitte schreiben Sie an info@netpartnersystem.com.';
    }
    setTimeout(() => { btn.innerHTML = original; btn.disabled = false; }, 4000);
  });
})();
