/* =========================================================
   Fondo 3D: formas flotantes que representan el mundo web
   (ventanas, celulares, engranajes, cursores, gráficos, cubos)
   Se mueven con el ratón y con el scroll.
   ========================================================= */
import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';

const canvas = document.getElementById('webgl');
const REDUCE = matchMedia('(prefers-reduced-motion: reduce)').matches;
const FINE = matchMedia('(hover: hover) and (pointer: fine)').matches;

function hasWebGL() {
  try { const c = document.createElement('canvas'); return !!(c.getContext('webgl2') || c.getContext('webgl')); } catch { return false; }
}

if (canvas && hasWebGL()) {
  try { init(); } catch (e) { console.warn('Fondo 3D desactivado:', e); }
}

function init() {
  const small = innerWidth <= 820;
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: !small, alpha: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, small ? 1.25 : 1.6));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(42, innerWidth / innerHeight, 0.1, 100);
  camera.position.set(0, 0, 16);

  // Luces
  scene.add(new THREE.HemisphereLight(0xc4dcff, 0x020617, 1.4));
  const key = new THREE.DirectionalLight(0xffffff, 2.2);
  key.position.set(6, 8, 10);
  scene.add(key);
  const rim = new THREE.DirectionalLight(0x3b82f6, 2.5);
  rim.position.set(-8, -4, -2);
  scene.add(rim);
  const cyan = new THREE.PointLight(0x22d3ee, 2.5, 0, 0);
  cyan.position.set(8, 3, 4);
  scene.add(cyan);

  // Materiales (azules)
  const M = {
    blue: new THREE.MeshStandardMaterial({ color: 0x2f6bff, metalness: 0.35, roughness: 0.22 }),
    sky: new THREE.MeshStandardMaterial({ color: 0x60a5fa, metalness: 0.25, roughness: 0.3 }),
    white: new THREE.MeshStandardMaterial({ color: 0xe8f0ff, metalness: 0.1, roughness: 0.35 }),
    navy: new THREE.MeshStandardMaterial({ color: 0x10245a, metalness: 0.5, roughness: 0.28 }),
    screen: new THREE.MeshStandardMaterial({ color: 0x1d4ed8, emissive: 0x1d4ed8, emissiveIntensity: 0.35, roughness: 0.4 }),
    wire: new THREE.MeshBasicMaterial({ color: 0x60a5fa, wireframe: true, transparent: true, opacity: 0.25 }),
    red: new THREE.MeshBasicMaterial({ color: 0xff5f57 }),
    yellow: new THREE.MeshBasicMaterial({ color: 0xfebc2e }),
    green: new THREE.MeshBasicMaterial({ color: 0x28c840 }),
  };
  const seg = small ? 2 : 4;
  const rbox = (w, h, d, r, mat) => new THREE.Mesh(new RoundedBoxGeometry(w, h, d, seg, r), mat);
  const at = (m, x, y, z) => { m.position.set(x, y, z); return m; };

  // ---------- Formas ----------
  function webWindow() {
    const g = new THREE.Group();
    g.add(rbox(3, 2, 0.14, 0.07, M.navy));
    [M.red, M.yellow, M.green].forEach((m, i) => g.add(at(new THREE.Mesh(new THREE.CircleGeometry(0.06, 16), m), -1.3 + i * 0.2, 0.8, 0.08)));
    g.add(at(rbox(1.3, 0.75, 0.05, 0.03, M.blue), -0.62, 0.12, 0.09));
    g.add(at(rbox(1.1, 0.1, 0.04, 0.02, M.white), 0.72, 0.38, 0.09));
    g.add(at(rbox(0.8, 0.1, 0.04, 0.02, M.sky), 0.57, 0.18, 0.09));
    g.add(at(rbox(0.5, 0.18, 0.04, 0.05, M.blue), 0.42, -0.06, 0.09));
    for (let i = 0; i < 3; i++) g.add(at(rbox(0.82, 0.48, 0.05, 0.04, M.white), -0.93 + i * 0.93, -0.58, 0.09));
    return g;
  }
  function phone() {
    const g = new THREE.Group();
    g.add(rbox(1, 2, 0.12, 0.12, M.navy));
    g.add(at(rbox(0.84, 1.74, 0.03, 0.08, M.screen), 0, 0, 0.065));
    for (let r = 0; r < 3; r++) for (let c = 0; c < 2; c++)
      g.add(at(rbox(0.28, 0.28, 0.04, 0.06, (r + c) % 2 ? M.white : M.sky), -0.18 + c * 0.36, 0.5 - r * 0.42, 0.09));
    return g;
  }
  function appCube(mat) { return rbox(1, 1, 1, 0.22, mat); }
  function cursor() {
    const s = new THREE.Shape();
    s.moveTo(0, 0); s.lineTo(0, -1.6); s.lineTo(0.42, -1.2); s.lineTo(0.72, -1.82); s.lineTo(0.98, -1.7);
    s.lineTo(0.7, -1.08); s.lineTo(1.2, -1.08); s.lineTo(0, 0);
    const geo = new THREE.ExtrudeGeometry(s, { depth: 0.22, bevelEnabled: true, bevelThickness: 0.05, bevelSize: 0.05, bevelSegments: 2 });
    geo.center();
    return new THREE.Mesh(geo, M.white);
  }
  function gear() {
    const s = new THREE.Shape(), n = 10;
    for (let i = 0; i < n * 2; i++) {
      const a0 = (i / (n * 2)) * Math.PI * 2, a1 = ((i + 1) / (n * 2)) * Math.PI * 2, r = i % 2 ? 0.74 : 0.95;
      if (i === 0) s.moveTo(Math.cos(a0) * r, Math.sin(a0) * r);
      s.lineTo(Math.cos(a0) * r, Math.sin(a0) * r);
      s.lineTo(Math.cos(a1) * r, Math.sin(a1) * r);
    }
    const hole = new THREE.Path();
    hole.absarc(0, 0, 0.3, 0, Math.PI * 2, true);
    s.holes.push(hole);
    const geo = new THREE.ExtrudeGeometry(s, { depth: 0.3, bevelEnabled: true, bevelThickness: 0.04, bevelSize: 0.04, bevelSegments: 2 });
    geo.center();
    return new THREE.Mesh(geo, M.sky);
  }
  function chart() {
    const g = new THREE.Group();
    [0.5, 0.85, 0.7, 1.3].forEach((h, i) => g.add(at(rbox(0.32, h, 0.32, 0.06, i === 3 ? M.blue : M.sky), -0.6 + i * 0.4, h / 2 - 0.65, 0)));
    return g;
  }
  const ring = () => new THREE.Mesh(new THREE.TorusGeometry(0.75, 0.18, 20, 64), M.blue);
  const wireBall = () => new THREE.Mesh(new THREE.IcosahedronGeometry(1.1, 1), M.wire);
  const ball = () => new THREE.Mesh(new THREE.SphereGeometry(0.38, 32, 32), M.white);

  const KINDS = [webWindow, () => appCube(M.blue), gear, cursor, phone, chart, ring, wireBall, ball, () => appCube(M.sky),
    webWindow, gear, ring, cursor, chart, ball, phone, wireBall];
  const count = small ? 10 : KINDS.length;

  const K = 0.0024; // cuánto baja la cámara por cada px de scroll
  const objs = [];
  for (let i = 0; i < count; i++) {
    const mesh = KINDS[i % KINDS.length]();
    mesh.rotation.set(Math.random() * 0.8 - 0.4, Math.random() * 1.2 - 0.6, Math.random() * 0.6 - 0.3);
    const s = (small ? 0.62 : 0.85) + Math.random() * 0.3;
    mesh.scale.setScalar(s);
    scene.add(mesh);
    objs.push({
      mesh,
      side: i % 2 ? 1 : -1,
      xr: Math.random(),
      y: 0,
      z: -1 - Math.random() * 6,
      ph: Math.random() * Math.PI * 2,
      fs: 0.4 + Math.random() * 0.5,
      rs: (Math.random() * 0.25 + 0.08) * (Math.random() < 0.5 ? -1 : 1),
    });
  }

  // Reparte las formas a lo largo de toda la página
  function layout() {
    const w = innerWidth, h = innerHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    const range = (document.documentElement.scrollHeight - h) * K + 4;
    const halfW = Math.tan((camera.fov * Math.PI) / 360) * 16 * camera.aspect;
    objs.forEach((o, i) => {
      // empiezan al final del hero para no tapar el titular
      o.y = -4.2 - (i / objs.length) * (range - 2) - Math.random() * 0.8;
      // siempre en los bordes de la pantalla, para enmarcar el contenido sin taparlo
      const f = small ? 1.0 + o.xr * 0.12 : 0.84 + o.xr * 0.18;
      o.x = o.side * f * halfW * ((16 - o.z) / 16);
      o.mesh.position.set(o.x, o.y, o.z);
    });
  }
  layout();

  // Interacción
  let mx = 0, my = 0, cx = 0, cy = 0, vel = 0, lastY = scrollY, running = true, frame = 0;
  if (FINE) addEventListener('pointermove', (e) => { mx = e.clientX / innerWidth - 0.5; my = e.clientY / innerHeight - 0.5; }, { passive: true });
  let rT;
  addEventListener('resize', () => { clearTimeout(rT); rT = setTimeout(() => { layout(); if (REDUCE) render(0); }, 200); });
  addEventListener('load', layout);

  const clock = new THREE.Clock();
  function render(t) {
    const y = scrollY;
    vel += (y - lastY) * 0.002; vel *= 0.9; lastY = y;
    cx += (mx * 1.6 - cx) * 0.04; cy += (-my * 1.0 - cy) * 0.04;
    camera.position.set(cx, -y * K + cy, 16);
    camera.lookAt(cx * 0.3, -y * K, 0);
    for (const o of objs) {
      o.mesh.position.y = o.y + Math.sin(t * o.fs + o.ph) * 0.3;
      o.mesh.rotation.y += (o.rs + vel * 0.6) * 0.016;
      o.mesh.rotation.x += (o.rs * 0.5 + vel * 0.3) * 0.016;
    }
    renderer.render(scene, camera);
  }

  function loop() {
    if (!running) return;
    requestAnimationFrame(loop);
    frame++;
    if (small && frame % 2) return; // 30 FPS en celulares
    render(clock.getElapsedTime());
  }

  canvas.classList.add('on');
  if (REDUCE) {
    render(0);
    addEventListener('scroll', () => requestAnimationFrame(() => render(0)), { passive: true });
  } else {
    loop();
    document.addEventListener('visibilitychange', () => {
      const was = running;
      running = !document.hidden;
      if (running && !was) loop();
    });
  }
}
