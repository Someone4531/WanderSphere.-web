/* =====================================================
   Life_in a Sphere — main.js
   Shared JavaScript for all pages
   ===================================================== */

/* ── 1. NAVBAR SCROLL EFFECT ── */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 60) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

/* ── 2. HAMBURGER / MOBILE MENU ── */
const hamburger  = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
if (hamburger && mobileMenu) {
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    mobileMenu.classList.toggle('open');
  });
  // Close on link click
  mobileMenu.querySelectorAll('a').forEach(a =>
    a.addEventListener('click', () => {
      hamburger.classList.remove('open');
      mobileMenu.classList.remove('open');
    })
  );
}

/* ── 3. SEARCH OVERLAY ── */
const searchBtn     = document.getElementById('searchBtn');
const searchOverlay = document.getElementById('searchOverlay');
const searchClose   = document.getElementById('searchClose');
const searchInput   = document.getElementById('searchInput');

function openSearch() {
  searchOverlay.classList.add('open');
  document.body.style.overflow = 'hidden';
  setTimeout(() => searchInput && searchInput.focus(), 200);
}
function closeSearch() {
  searchOverlay.classList.remove('open');
  document.body.style.overflow = '';
}

if (searchBtn)     searchBtn.addEventListener('click', openSearch);
if (searchClose)   searchClose.addEventListener('click', closeSearch);
if (searchOverlay) {
  searchOverlay.addEventListener('click', e => {
    if (e.target === searchOverlay) closeSearch();
  });
}
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeSearch();
  if (e.key === 'k' && (e.ctrlKey || e.metaKey)) { e.preventDefault(); openSearch(); }
});

// Hint tags fill search input
document.querySelectorAll('.hint-tag').forEach(tag => {
  tag.addEventListener('click', () => {
    if (searchInput) searchInput.value = tag.textContent;
  });
});

/* ── 4. DARK / LIGHT MODE ── */
const themeBtn = document.getElementById('themeBtn');
const stored   = localStorage.getItem('theme') || 'dark';

function applyTheme(mode) {
  document.body.classList.toggle('light-mode', mode === 'light');
  if (themeBtn) {
    themeBtn.innerHTML = mode === 'light'
      ? '<i class="fas fa-sun"></i>'
      : '<i class="fas fa-moon"></i>';
    themeBtn.title = mode === 'light' ? 'Switch to dark mode' : 'Switch to light mode';
  }
}

applyTheme(stored);
if (themeBtn) {
  themeBtn.addEventListener('click', () => {
    const next = document.body.classList.contains('light-mode') ? 'dark' : 'light';
    localStorage.setItem('theme', next);
    applyTheme(next);
  });
}

/* ── 5. BACK TO TOP ── */
const btt = document.getElementById('btt');
if (btt) {
  window.addEventListener('scroll', () => {
    btt.classList.toggle('show', window.scrollY > 400);
  });
  btt.addEventListener('click', () =>
    window.scrollTo({ top: 0, behavior: 'smooth' })
  );
}

/* ── 6. SCROLL REVEAL ── */
function initReveal() {
  const els = document.querySelectorAll('.reveal');
  if (!els.length) return;
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('shown');
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });
  els.forEach(el => obs.observe(el));
}
document.addEventListener('DOMContentLoaded', initReveal);

/* ── 7. LAZY IMAGE LOADING (native fallback) ── */
document.querySelectorAll('img[loading="lazy"]').forEach(img => {
  if (!('loading' in HTMLImageElement.prototype)) {
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        img.src = img.dataset.src || img.src;
        obs.disconnect();
      }
    });
    obs.observe(img);
  }
});

/* ── 8. NEWSLETTER ── */
function handleNewsletter(e) {
  e.preventDefault();
  const msg = document.getElementById('nl-msg');
  if (msg) {
    msg.textContent = '🎉 You\'re in! Welcome to the Life_in a Sphere family. Check your inbox.';
  }
  e.target.reset();
}

/* ── 9. ACTIVE NAV LINK HIGHLIGHT ── */
(function highlightNav() {
  const links = document.querySelectorAll('.nav-links a, .mobile-menu a');
  const current = location.pathname.split('/').pop() || 'index.html';
  links.forEach(a => {
    const href = a.getAttribute('href')?.split('?')[0].split('#')[0];
    if (href && href === current) a.classList.add('active');
    else a.classList.remove('active');
  });
})();

/* ── 10. STICKY NAV HIDE/SHOW ON SCROLL ── */
let lastScroll = 0;
window.addEventListener('scroll', () => {
  const current = window.scrollY;
  if (current > lastScroll && current > 150) {
    // Scrolling down — keep sticky, just add background
  }
  lastScroll = current;
}, { passive: true });

/* ── 11. SMOOTH SECTION TRANSITIONS ── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - 90;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

/* ── 12. IMAGE GALLERY LIGHTBOX ── */
(function initGallery() {
  const items = document.querySelectorAll('.gi');
  if (!items.length) return;

  // Create lightbox
  const lb = document.createElement('div');
  lb.style.cssText = `
    position:fixed;inset:0;z-index:9999;background:rgba(0,0,0,0.94);
    display:flex;align-items:center;justify-content:center;padding:20px;
    opacity:0;visibility:hidden;transition:all 0.3s ease;cursor:zoom-out;
  `;
  const lbImg = document.createElement('img');
  lbImg.style.cssText = `max-width:90vw;max-height:88vh;object-fit:contain;border-radius:12px;box-shadow:0 30px 80px rgba(0,0,0,0.7);`;
  const lbClose = document.createElement('button');
  lbClose.innerHTML = '&times;';
  lbClose.style.cssText = `
    position:absolute;top:20px;right:24px;background:none;border:none;
    color:#fff;font-size:2.4rem;cursor:pointer;line-height:1;
  `;
  lb.appendChild(lbImg);
  lb.appendChild(lbClose);
  document.body.appendChild(lb);

  items.forEach(item => {
    item.addEventListener('click', () => {
      const src = item.querySelector('img')?.src;
      if (src) {
        lbImg.src = src;
        lb.style.opacity = '1';
        lb.style.visibility = 'visible';
        document.body.style.overflow = 'hidden';
      }
    });
  });
  function closeLb() {
    lb.style.opacity = '0';
    lb.style.visibility = 'hidden';
    document.body.style.overflow = '';
  }
  lb.addEventListener('click', closeLb);
  lbClose.addEventListener('click', closeLb);
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLb(); });
})();

/* ── 13. READING PROGRESS BAR (Blog page) ── */
(function readingProgress() {
  if (!document.querySelector('.blog-article, .ba-body')) return;
  const bar = document.createElement('div');
  bar.style.cssText = `
    position:fixed;top:0;left:0;height:3px;width:0;z-index:2000;
    background:linear-gradient(90deg,#E8894A,#C9A84C);
    transition:width 0.1s ease;
  `;
  document.body.prepend(bar);
  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    const total = document.body.scrollHeight - window.innerHeight;
    bar.style.width = total > 0 ? (scrolled / total * 100) + '%' : '0';
  }, { passive: true });
})();

/* ── 14. COUNTER ANIMATION ── */
function animateCount(el) {
  const target = parseInt(el.textContent.replace(/\D/g, ''));
  const suffix = el.textContent.replace(/[\d]/g, '');
  if (isNaN(target)) return;
  let start = 0;
  const duration = 1600;
  const step = target / (duration / 16);
  const timer = setInterval(() => {
    start += step;
    if (start >= target) {
      el.textContent = target + suffix;
      clearInterval(timer);
    } else {
      el.textContent = Math.floor(start) + suffix;
    }
  }, 16);
}

// Observe stat numbers
const statObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      animateCount(e.target);
      statObs.unobserve(e.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.stat-num').forEach(el => statObs.observe(el));

/* ── 15. SHARE BUTTONS ── */
document.querySelectorAll('.share-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const url = encodeURIComponent(location.href);
    const title = encodeURIComponent(document.title);
    const text = btn.textContent.trim().toLowerCase();
    let shareUrl = '';
    if (text.includes('twitter')) shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${title}`;
    if (text.includes('facebook')) shareUrl = `https://facebook.com/sharer/sharer.php?u=${url}`;
    if (text.includes('whatsapp')) shareUrl = `https://api.whatsapp.com/send?text=${title}%20${url}`;
    if (shareUrl) window.open(shareUrl, '_blank', 'width=600,height=400');
  });
});

console.log('%c🌍 Life_in a Sphere', 'font-size:22px;color:#E8894A;font-weight:bold;');
console.log('%cExplore the world. One story at a time.', 'font-size:13px;color:#9EB3C8;');
