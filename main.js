/* =========================================================
   Robert Aranda — interacciones
   - un solo bucle de scroll con requestAnimationFrame
   - solo se animan transform / opacity
   - menos efectos en celulares y si el usuario prefiere poco movimiento
   ========================================================= */
(() => {
  'use strict';

  const D = window.PORTFOLIO || {};
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const REDUCE = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const FINE = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const small = () => innerWidth <= 820;

  const svg = (p, fill = false) => `<svg viewBox="0 0 24 24" fill="${fill ? 'currentColor' : 'none'}" stroke="${fill ? 'none' : 'currentColor'}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${p}</svg>`;
  const ICON = {
    web: svg('<rect x="2" y="4" width="20" height="16" rx="3"/><path d="M2 9h20"/><circle cx="6" cy="6.5" r=".5"/><path d="M7 14h5M7 17h8"/>'),
    shop: svg('<path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/>'),
    system: svg('<rect x="3" y="3" width="7" height="9" rx="1.5"/><rect x="14" y="3" width="7" height="5" rx="1.5"/><rect x="14" y="12" width="7" height="9" rx="1.5"/><rect x="3" y="16" width="7" height="5" rx="1.5"/>'),
    search: svg('<circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/><path d="M8 11h6M11 8v6"/>'),
    phone: svg('<rect x="6" y="2" width="12" height="20" rx="3"/><path d="M11 18h2"/>'),
    support: svg('<path d="M3 14v-2a9 9 0 0 1 18 0v2"/><path d="M21 15a2 2 0 0 1-2 2h-1v-6h1a2 2 0 0 1 2 2zM3 15a2 2 0 0 0 2 2h1v-6H5a2 2 0 0 0-2 2z"/><path d="M18 17v1a3 3 0 0 1-3 3h-2"/>'),
    bolt: svg('<path d="M13 2 3 14h9l-1 8 10-12h-9z"/>'),
    chat: svg('<path d="M21 11.5a8.4 8.4 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.4 8.4 0 0 1-3.8-.9L3 21l1.9-5.7a8.4 8.4 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.4 8.4 0 0 1 3.8-.9h.5a8.5 8.5 0 0 1 8 8z"/>'),
    shield: svg('<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/>'),
    hand: svg('<path d="M20 21v-2a4 4 0 0 0-3-3.9"/><path d="M4 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2"/><circle cx="10" cy="7" r="4"/><path d="M16 3.1a4 4 0 0 1 0 7.8"/>'),
    eye: svg('<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>'),
    ext: svg('<path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><path d="M15 3h6v6M10 14 21 3"/>'),
    mail: svg('<rect x="2" y="4" width="20" height="16" rx="3"/><path d="m22 7-10 6L2 7"/>'),
    wa: svg('<path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm5.3 14.1c-.2.6-1.3 1.2-1.8 1.2-.5.1-1 .2-3.4-.7-2.8-1.1-4.6-4-4.8-4.2-.1-.2-1.1-1.5-1.1-2.9s.7-2 1-2.3c.2-.3.5-.3.7-.3h.5c.2 0 .4 0 .6.5l.9 2.1c.1.2.1.3 0 .5l-.3.5-.4.5c-.1.1-.3.3-.1.6.2.3.8 1.3 1.6 2.1 1.1 1 2 1.3 2.3 1.4.3.1.5.1.6-.1l.9-1.1c.2-.3.4-.2.7-.1l2 1c.3.1.5.2.5.3.1.2.1.7-.1 1.4z"/>', true),
  };

  const projects = D.projects || [];
  const host = (u) => { try { return new URL(u).host.replace(/^www\./, ''); } catch { return ''; } };

  /* =======================================================
     1. Contenido desde data.js
     ======================================================= */
  $('#year').textContent = new Date().getFullYear();
  if (!D.available) $('#heroPill').hidden = true;

  // Titular con líneas que suben
  $('#heroTitle').innerHTML = (D.headline || [D.name]).map((t, i) =>
    `<span class="line"><span class="${i === 1 ? 'grad-text' : ''}" style="--i:${i}">${esc(t)}</span></span>`).join(' ');
  $('#heroIntro').textContent = D.intro || '';
  $('#trustList').innerHTML = projects.map((p) =>
    `<a class="trust-chip" href="${esc(p.url)}" target="_blank" rel="noopener"><i></i>${esc(p.title)}</a>`).join('');

  // Imágenes de la composición 3D del hero
  const p0 = projects[0] || {}, p1 = projects[1] || p0;
  if (p0.image) { $('#hvImg').src = p0.image; $('#hvUrl').textContent = '🔒 ' + host(p0.url); }
  if (p1.mobileImage) $('#hvPhone').src = p1.mobileImage;

  // Franja
  const words = ['Páginas web', 'Tiendas online', 'Catálogos', 'Sistemas a medida', 'Diseño moderno', 'Aparece en Google', 'WhatsApp integrado'];
  const bandHTML = (list) => { const s = `<span>${list.map((w) => `${esc(w)} <em>✦</em>`).join(' ')}</span>`; return s + s; };
  $('#band1').innerHTML = bandHTML(words);
  $('#band2').innerHTML = bandHTML([...words].reverse());

  // Servicios
  $('#services').innerHTML = (D.services || []).map((s, i) =>
    `<div data-reveal style="--d:${(i % 3) * 0.08}s"><article class="svc"><div class="svc-ico">${ICON[s.icon] || ICON.web}</div><h3>${esc(s.title)}</h3><p>${esc(s.text)}</p></article></div>`).join('');

  // Proyectos
  $('#shows').innerHTML = projects.map((p, i) => `
    <article class="show ${i % 2 ? 'rev' : ''}">
      <div class="show-visual" data-reveal>
        <div class="devices" style="--c:${esc(p.accent || '#3b82f6')}">
          <div class="dv-browser"><div class="dv-bar"><i></i><i></i><i></i><span>🔒 ${esc(host(p.url))}</span></div>
            <img src="${esc(p.image)}" alt="Página web de ${esc(p.title)}" loading="lazy" decoding="async"></div>
          ${p.mobileImage ? `<div class="dv-phone"><img src="${esc(p.mobileImage)}" alt="${esc(p.title)} en celular" loading="lazy" decoding="async"></div>` : ''}
          <div class="dv-badge">● En línea</div>
        </div>
      </div>
      <div class="show-text" data-reveal style="--d:.12s">
        <span class="show-num">0${i + 1}</span>
        <span class="show-type">${esc(p.type)}</span>
        <h3>${esc(p.title)}</h3>
        <p>${esc(p.description)}</p>
        <ul class="feats">${(p.features || []).map((f) => `<li>${esc(f)}</li>`).join('')}</ul>
        <div class="show-btns">
          <button class="btn primary" type="button" data-preview="${i}">${ICON.eye} Ver vista previa</button>
          <a class="btn ghost" href="${esc(p.url)}" target="_blank" rel="noopener">Visitar sitio ${ICON.ext}</a>
        </div>
      </div>
    </article>`).join('');

  // Sobre mí
  if (D.photo) $('#aboutPhoto').src = D.photo;
  $('#aboutText').innerHTML = (D.about || []).map((p) => `<p>${esc(p)}</p>`).join('');
  $('#aboutPoints').innerHTML = (D.aboutPoints || []).map((p) => `<li>${esc(p)}</li>`).join('');
  $('#phProjects').innerHTML = `<b>${projects.length}</b> webs en línea`;
  $('#aboutBtns').innerHTML = (D.whatsapp
    ? `<a class="btn wa magnetic" href="https://wa.me/${esc(D.whatsapp)}?text=${encodeURIComponent('Hola Robert, vi tu portfolio y quiero una web')}" target="_blank" rel="noopener">${ICON.wa} Hablemos por WhatsApp</a>`
    : '') + '<a class="btn ghost magnetic" href="#proceso">Cómo trabajo</a>';

  // Proceso
  const steps = D.process || [];
  $('#steps').innerHTML = '<div class="steps-fill" id="stepsFill"></div>' + steps.map((s, i) =>
    `<div class="step"><span class="n">${i + 1}</span><div><h3>${esc(s.title)}</h3><p>${esc(s.text)}</p></div></div>`).join('');
  $('#stepDots').innerHTML = steps.map(() => '<i></i>').join('');

  // Ventajas
  $('#benefits').innerHTML = (D.benefits || []).map((b, i) =>
    `<div data-reveal style="--d:${i * 0.08}s"><article class="bnf"><div class="svc-ico">${ICON[b.icon] || ICON.bolt}</div><h3>${esc(b.title)}</h3><p>${esc(b.text)}</p></article></div>`).join('');
  $('#stats').innerHTML = (D.stats || []).map((s) =>
    `<div class="stat"><b data-count="${+s.value || 0}" data-suffix="${esc(s.suffix)}">0${esc(s.suffix)}</b><span>${esc(s.label)}</span></div>`).join('');

  // Contacto
  const btns = [];
  if (D.whatsapp) btns.push(`<a class="btn wa magnetic" href="https://wa.me/${esc(D.whatsapp)}?text=${encodeURIComponent('Hola Robert, quiero una página web para mi negocio')}" target="_blank" rel="noopener">${ICON.wa} Escríbeme por WhatsApp</a>`);
  if (D.email) btns.push(`<a class="btn white magnetic" href="mailto:${esc(D.email)}?subject=${encodeURIComponent('Quiero una página web')}">${ICON.mail} Escríbeme un correo</a>`);
  const S = D.social || {};
  [['linkedin', 'LinkedIn'], ['instagram', 'Instagram'], ['facebook', 'Facebook']].forEach(([k, l]) => {
    if (S[k]) btns.push(`<a class="btn ghost" href="${esc(S[k])}" target="_blank" rel="noopener">${l}</a>`);
  });
  $('#ctaBtns').innerHTML = btns.join('');
  if (D.email) $('#ctaMail').innerHTML = `o directamente a <a href="mailto:${esc(D.email)}">${esc(D.email)}</a>`;

  /* =======================================================
     2. Carga inicial
     ======================================================= */
  function boot(done) {
    const L = $('#loader');
    let seen = false;
    try { seen = sessionStorage.getItem('ra-boot') === '1'; sessionStorage.setItem('ra-boot', '1'); } catch { /* sin storage */ }
    const finish = () => { document.body.classList.remove('loading'); done(); };
    if (REDUCE || seen) { L.remove(); finish(); return; }

    // Nombre letra por letra (el apellido con degradado azul)
    const parts = (D.name || '').split(' ');
    let n = 0;
    $('#ldName').innerHTML = parts.map((w, wi) =>
      Array.from(w).map((ch) => `<span class="${wi > 0 ? 'hl' : ''}" style="--i:${n++}">${esc(ch)}</span>`).join('')
    ).join('<span class="sp" style="--i:0"></span>');
    if (D.role) $('#ldRole').textContent = D.role;

    // Contador 0 → 100 % con mensajes
    const bar = $('#ldBar'), pct = $('#ldPct'), status = $('#ldStatus');
    const msgs = [[0, 'Cargando proyectos…'], [40, 'Preparando el diseño…'], [78, 'Activando efectos 3D…'], [100, '¡Todo listo! 🚀']];
    let shown = 0;
    const DUR = 1900, start = performance.now();
    (function tick(now) {
      const p = clamp((now - start) / DUR);
      const e = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
      const v = Math.round(e * 100);
      bar.style.transform = `scaleX(${e})`;
      pct.textContent = v;
      const m = msgs.filter(([at]) => v >= at).length - 1;
      if (m !== shown && m >= 0) {
        shown = m;
        status.textContent = msgs[m][1];
        status.classList.remove('swap'); void status.offsetWidth; status.classList.add('swap');
      }
      if (p < 1) requestAnimationFrame(tick);
      else setTimeout(() => { L.classList.add('done'); finish(); setTimeout(() => L.remove(), 1000); }, 280);
    })(start);
  }

  /* =======================================================
     3. Aparición al hacer scroll y contadores
     ======================================================= */
  function countUp(el) {
    const to = +el.dataset.count, suf = el.dataset.suffix || '';
    if (REDUCE) { el.textContent = to + suf; return; }
    const s = performance.now(), d = 1600;
    (function f(now) {
      const p = clamp((now - s) / d), e = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(to * e) + suf;
      if (p < 1) requestAnimationFrame(f);
    })(s);
  }
  const revealIO = new IntersectionObserver((entries) => {
    for (const e of entries) {
      if (!e.isIntersecting) continue;
      e.target.classList.add('in');
      revealIO.unobserve(e.target);
      $$('[data-count]', e.target).forEach(countUp);
    }
  }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
  $$('[data-reveal]').forEach((el) => revealIO.observe(el));

  /* =======================================================
     4. Bucle de scroll
     ======================================================= */
  const nav = $('#nav'), progress = $('#progress');
  const hero = $('#inicio'), stage = $('#hvStage');
  const devices = $$('.devices');
  const proc = $('#proceso'), build = $('#build'), stepEls = $$('.step'), dots = $$('#stepDots i'), stepsFill = $('#stepsFill');
  const navLinks = $$('#navLinks a');
  const sections = navLinks.map((a) => $(a.getAttribute('href'))).filter(Boolean);

  // Movimiento del hero: el ratón gira la escena, el scroll la "despega"
  const H = { rx: 6, ry: -14, trx: 6, try: -14, ex: 1, tex: 1 };
  let lastY = scrollY, ticking = false, curStep = -1;

  function onScroll() {
    ticking = false;
    const y = scrollY, vh = innerHeight;
    const max = document.documentElement.scrollHeight - vh;
    const heroR = hero.getBoundingClientRect();
    const devR = devices.map((d) => d.getBoundingClientRect());
    const pr = proc.getBoundingClientRect();
    let current = null;
    for (const s of sections) if (s.getBoundingClientRect().top < vh * 0.45) current = s.id;

    progress.style.transform = `scaleX(${max > 0 ? y / max : 0})`;
    nav.classList.toggle('scrolled', y > 20);
    if (!nav.classList.contains('open')) nav.classList.toggle('hide', y > lastY && y > 500);
    lastY = y;

    // hero: las piezas se separan al bajar
    H.tex = 1 + clamp(-heroR.top / heroR.height) * 2.2;

    // proyectos: los dispositivos giran mientras pasan
    devices.forEach((d, i) => {
      const r = devR[i];
      const p = clamp((vh - r.top) / (vh + r.height)) - 0.5; // -0.5 → 0.5
      const dir = d.closest('.show').classList.contains('rev') ? -1 : 1;
      d.style.setProperty('--dry', `${(-p * 26 + 8) * dir}deg`);
      d.style.setProperty('--drx', `${p * 10}deg`);
    });

    // proceso: la web se construye paso a paso
    const pp = clamp(-pr.top / (pr.height - vh));
    const n = stepEls.length || 4;
    const step = REDUCE ? n - 1 : Math.min(n - 1, Math.floor(pp * n));
    build.style.setProperty('--pp', pp.toFixed(3));
    build.style.setProperty('--sp', step >= 3 ? 1 : clamp(pp * n - 2).toFixed(3));
    if (stepsFill) stepsFill.style.setProperty('--sp', (step / (n - 1)).toFixed(3));
    if (step !== curStep) {
      curStep = step;
      build.dataset.step = step;
      build.classList.toggle('s1', step >= 1);
      build.classList.toggle('s2', step >= 2);
      build.classList.toggle('s3', step >= 3);
      stepEls.forEach((s, i) => { s.classList.toggle('on', i === step); s.classList.toggle('done', i < step); });
      dots.forEach((d, i) => d.classList.toggle('on', i === step));
    }

    navLinks.forEach((a) => a.classList.toggle('active', a.getAttribute('href') === `#${current}`));
    BAND.vel += (y - BAND.lastY) * 0.06;
    BAND.lastY = y;
  }
  const requestScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } };
  addEventListener('scroll', requestScroll, { passive: true });
  addEventListener('resize', requestScroll);

  /* =======================================================
     5. Animaciones continuas (hero 3D y franja)
     ======================================================= */
  const BAND = { x1: 0, x2: 0, vel: 0, lastY: scrollY, visible: true, el1: $('#band1'), el2: $('#band2') };
  new IntersectionObserver((e) => (BAND.visible = e[0].isIntersecting)).observe($('.band'));
  let heroVisible = true;
  new IntersectionObserver((e) => (heroVisible = e[0].isIntersecting)).observe(hero);

  if (FINE) {
    hero.addEventListener('pointermove', (e) => {
      const r = hero.getBoundingClientRect();
      H.try = -14 + ((e.clientX - r.left) / r.width - 0.5) * 22;
      H.trx = 6 - ((e.clientY - r.top) / r.height - 0.5) * 14;
    });
    hero.addEventListener('pointerleave', () => { H.try = -14; H.trx = 6; });
  }

  let t0 = performance.now();
  function loop(now) {
    const dt = Math.min(50, now - t0); t0 = now;
    if (heroVisible) {
      if (!FINE) { H.try = -7 + Math.sin(now / 2600) * 6; H.trx = 5 + Math.cos(now / 3100) * 3; }
      H.rx += (H.trx - H.rx) * 0.07; H.ry += (H.try - H.ry) * 0.07; H.ex += (H.tex - H.ex) * 0.1;
      stage.style.setProperty('--rx', H.rx.toFixed(2) + 'deg');
      stage.style.setProperty('--ry', H.ry.toFixed(2) + 'deg');
      stage.style.setProperty('--ex', H.ex.toFixed(3));
    }
    if (BAND.visible) {
      BAND.vel *= 0.92;
      const sp = (0.045 + Math.abs(BAND.vel) * 0.02) * dt;
      const w1 = BAND.el1.scrollWidth / 2, w2 = BAND.el2.scrollWidth / 2;
      BAND.x1 = (BAND.x1 - sp) % w1;
      BAND.x2 = (BAND.x2 + sp) % w2;
      BAND.el1.style.transform = `translate3d(${BAND.x1}px,0,0)`;
      BAND.el2.style.transform = `translate3d(${BAND.x2 - w2}px,0,0)`;
    }
    requestAnimationFrame(loop);
  }
  if (!REDUCE) requestAnimationFrame(loop);

  /* =======================================================
     6. Efectos con ratón: brillo, tarjetas 3D, botones imán
     ======================================================= */
  if (FINE && !REDUCE) {
    const glow = $('#glow');
    addEventListener('pointermove', (e) => { glow.style.transform = `translate3d(${e.clientX}px,${e.clientY}px,0)`; }, { passive: true });

    $$('.svc').forEach((c) => {
      c.addEventListener('pointermove', (e) => {
        const r = c.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
        c.style.setProperty('--ry', `${(px - 0.5) * 12}deg`);
        c.style.setProperty('--rx', `${(0.5 - py) * 12}deg`);
        c.style.setProperty('--mx', `${px * 100}%`);
        c.style.setProperty('--my', `${py * 100}%`);
      });
      c.addEventListener('pointerleave', () => { c.style.setProperty('--rx', '0deg'); c.style.setProperty('--ry', '0deg'); });
    });

    // Foto con giro 3D
    const ph = $('#phStage'), phBox = $('.about-photo');
    phBox.addEventListener('pointermove', (e) => {
      const r = phBox.getBoundingClientRect();
      ph.classList.add('tilting');
      ph.style.setProperty('--ry', `${((e.clientX - r.left) / r.width - 0.5) * 22}deg`);
      ph.style.setProperty('--rx', `${(0.5 - (e.clientY - r.top) / r.height) * 16}deg`);
    });
    phBox.addEventListener('pointerleave', () => { ph.classList.remove('tilting'); ph.style.setProperty('--rx', '0deg'); ph.style.setProperty('--ry', '0deg'); });

    $$('.magnetic').forEach((b) => {
      b.addEventListener('pointermove', (e) => {
        const r = b.getBoundingClientRect();
        b.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * 0.22}px, ${(e.clientY - r.top - r.height / 2) * 0.3}px)`;
      });
      b.addEventListener('pointerleave', () => (b.style.transform = ''));
    });
  }

  /* =======================================================
     7. Menú y vista previa
     ======================================================= */
  $('#menuBtn').addEventListener('click', () => nav.classList.toggle('open'));
  navLinks.forEach((a) => a.addEventListener('click', () => nav.classList.remove('open')));

  const modal = $('#modal'), frame = $('#modalFrame'), shot = $('#modalShot');
  let currentP = null;
  frame.addEventListener('load', () => { if (frame.getAttribute('src') && frame.getAttribute('src') !== 'about:blank') frame.classList.add('loaded'); });
  function showShot() {
    if (!currentP || currentP.embed) return;
    shot.src = modal.classList.contains('mobile') && currentP.mobileImage ? currentP.mobileImage : currentP.image;
  }
  function openPreview(p) {
    currentP = p;
    if (small()) modal.classList.add('mobile');
    modal.classList.toggle('shots', !p.embed);
    if (p.embed) { frame.classList.remove('loaded'); frame.src = p.url; } else showShot();
    $('#modalUrl').textContent = '🔒 ' + p.url.replace(/^https?:\/\//, '');
    $('#modalOpen').href = p.url;
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }
  function closePreview() {
    modal.classList.remove('open', 'mobile');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    $('#devToggle').textContent = '📱 Celular';
    setTimeout(() => { if (!modal.classList.contains('open')) frame.src = 'about:blank'; }, 350);
  }
  $('#shows').addEventListener('click', (e) => {
    const b = e.target.closest('[data-preview]');
    if (b) openPreview(projects[+b.dataset.preview]);
  });
  $('#modalClose').addEventListener('click', closePreview);
  modal.addEventListener('click', (e) => { if (e.target === modal) closePreview(); });
  addEventListener('keydown', (e) => { if (e.key === 'Escape' && modal.classList.contains('open')) closePreview(); });
  $('#devToggle').addEventListener('click', (e) => {
    const m = modal.classList.toggle('mobile');
    e.currentTarget.textContent = m ? '🖥 Computadora' : '📱 Celular';
    showShot();
  });

  /* =======================================================
     8. ¡Arrancar!
     ======================================================= */
  onScroll();
  boot(() => document.body.classList.add('ready'));
})();
