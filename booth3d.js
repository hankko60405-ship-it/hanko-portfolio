/* ALIVE booth as a turntable model.
   Rebuilt from the booth renders, simplified: floor, walls, cases, the hall column,
   the folded feature wall, the reception desk and the PVC air-cushion wall.
   Units are metres; x runs left to right along the front, z from the back wall (0) to the aisle (6). */
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";

const BLUE = "#3567b0", INK = "#2b2a28";
const FONT = '"Noto Sans TC", "PingFang TC", sans-serif';

export function init(box, opts = {}) {
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 0.9;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  box.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;

  const camera = new THREE.PerspectiveCamera(32, 16 / 9, 0.1, 200);
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.08;
  controls.enablePan = false;
  controls.minDistance = 7;
  controls.maxDistance = 30;
  controls.minPolarAngle = 0.15;
  controls.maxPolarAngle = 1.42;          // never below the floor
  controls.autoRotate = !reduce;
  controls.autoRotateSpeed = 0.9;

  /* ---------- materials ---------- */
  const white = new THREE.MeshStandardMaterial({ color: "#f1f1ef", roughness: 0.8, envMapIntensity: 0.55 });
  const frame = new THREE.MeshStandardMaterial({ color: "#d9dbde", roughness: 0.4, metalness: 0.35 });
  const shelf = new THREE.MeshStandardMaterial({ color: "#ffffff", roughness: 0.6, emissive: "#ffffff", emissiveIntensity: 0.18 });
  const glass = new THREE.MeshPhysicalMaterial({ color: "#dfe9ef", roughness: 0.05, metalness: 0, transparent: true, opacity: 0.16, depthWrite: false, envMapIntensity: 1.2 });
  const carpet = new THREE.MeshStandardMaterial({ color: "#9a9a9d", roughness: 1, map: noiseTex("#ffffff", 0.16, 18, 8), envMapIntensity: 0.4 });
  const concrete = new THREE.MeshStandardMaterial({ color: "#a9abae", roughness: 0.95, map: noiseTex("#ffffff", 0.1) });
  const pvc = new THREE.MeshPhysicalMaterial({ color: "#f7f2ec", roughness: 0.45, transparent: true, opacity: 0.62, depthWrite: false, envMapIntensity: 0.8, emissive: "#fff6ee", emissiveIntensity: 0.08 });

  const edge = new THREE.LineBasicMaterial({ color: "#c4c7cc" });
  const root = new THREE.Group();
  scene.add(root);
  const add = (geo, mat, x, y, z, ry = 0) => {
    const m = new THREE.Mesh(geo, mat); m.position.set(x, y, z); m.rotation.y = ry;
    m.castShadow = true; m.receiveShadow = true; root.add(m); return m;
  };

  /* ---------- floor ---------- */
  const floor = add(new THREE.BoxGeometry(14.6, 0.04, 6.2), carpet, 7.3, 0.02, 3.1);
  floor.castShadow = false;

  /* ---------- a wall with a printed face ---------- */
  const T = 0.12, H = 2.5;
  function wall(x1, z1, x2, z2, h = H, face = null) {
    const len = Math.hypot(x2 - x1, z2 - z1), ang = Math.atan2(-(z2 - z1), x2 - x1);
    const g = new THREE.BoxGeometry(len, h, T);
    const mats = face ? [white, white, white, white, faceMat(face, len, h), white] : white;
    const m = add(g, mats, (x1 + x2) / 2, h / 2, (z1 + z2) / 2, ang);
    m.add(new THREE.LineSegments(new THREE.EdgesGeometry(g), edge));
    return m;
  }

  /* back wall with its intro panel, a blue arc and bubbles near the column */
  wall(0, 0, 9.0, 0, H, ctx => {
    arc(ctx, 0.55, 0.0, 0.38, 0.24);
    text(ctx, "關於呼吸存在", 0.03, 0.2, 0.05, INK, 600);
    for (let i = 0; i < 9; i++) bar(ctx, 0.03, 0.29 + i * 0.045, 0.13 - (i % 3) * 0.02, 0.012);
    blobs(ctx, [[0.92, 0.18, 0.05], [0.96, 0.27, 0.04], [0.89, 0.3, 0.035]]);
  });
  wall(0, 0, 0, 0.9);                                   // left return

  /* six back cases and five front cases, the aisle between them */
  for (let i = 0; i < 6; i++) vitrine(2.3 + i * 0.85, 0.42, 0.8, 0.7, 2.2, 0);
  for (let i = 0; i < 5; i++) vitrine(0.9 + i * 1.02, 3.1, 0.98, 0.75, 1.0, Math.PI, true);

  /* the hall column */
  add(new THREE.BoxGeometry(1.45, 5.2, 1.45), concrete, 10.2, 2.6, 0.35);

  /* folded feature wall around the column */
  wall(9.0, 0, 9.0, 2.5, H, ctx => {
    arc(ctx, 0.5, 0.0, 0.5, 0.2);
    vtext(ctx, "設計如息・凝鍊自我與世界的連結", 0.5, 0.18, 0.05, INK);
  });
  wall(9.0, 2.5, 9.7, 3.25, H, ctx => arc(ctx, 0.5, 1.0, 0.7, 0.25));
  wall(9.7, 3.25, 11.4, 3.25, H, ctx => {
    text(ctx, "呼吸", 0.12, 0.42, 0.11, INK, 600);
    text(ctx, "對你而言是什麼？", 0.42, 0.42, 0.05, INK);
    ["本能 INSTINCT", "存在 EXISTENCE", "連結 CONNECTION", "回應 RESPONSE"].forEach((s, i) =>
      text(ctx, s, 0.12 + (i % 2) * 0.45, 0.62 + Math.floor(i / 2) * 0.12, 0.034, INK));
  });
  wall(11.4, 3.25, 12.1, 2.5, H, ctx => {
    img(ctx, "b3d-logo.png", 0.08, 0.3, 0.84);
    img(ctx, "b3d-blob.png", 0.2, 0.08, 0.32); img(ctx, "b3d-blob.png", 0.55, 0.5, 0.3);
  });
  wall(12.1, 2.5, 14.2, 2.5, H, ctx => {
    vtext(ctx, "國立臺北商業大學 商業設計管理系", 0.9, 0.12, 0.05, INK);
    for (let r = 0; r < 4; r++) for (let c = 0; c < 6; c++) dot(ctx, 0.25 + c * 0.07, 0.25 + r * 0.06, 0.007);
  });
  wall(14.2, 2.5, 14.2, 0);
  wall(10.9, 0, 14.2, 0);

  /* reception desk */
  add(new THREE.BoxGeometry(1.5, 1.05, 0.55), white, 12.9, 0.55, 3.35);

  /* PVC air-cushion wall: translucent cubes, 12 across, 5 high */
  const cube = new THREE.BoxGeometry(0.4, 0.4, 0.4, 3, 3, 3);
  rounden(cube, 0.05);
  for (let c = 0; c < 12; c++) for (let r = 0; r < 5; r++) {
    const m = add(cube, pvc, 9.7 + c * 0.42, 0.22 + r * 0.42, 5.85); m.castShadow = false;
  }
  const sign = add(new THREE.PlaneGeometry(1.25, 0.9), faceMat(ctx => {
    text(ctx, "國立臺北商業大學", 0.04, 0.22, 0.13, INK, 600);
    text(ctx, "商業設計管理系", 0.04, 0.45, 0.13, INK, 600);
    text(ctx, "115級 畢業展", 0.04, 0.7, 0.13, INK, 600);
  }, 1.25, 0.9, true), 10.45, 1.55, 6.07);
  sign.castShadow = false;

  /* ---------- cases ---------- */
  function vitrine(x, z, w, d, h, ry, front = false) {
    const g = new THREE.Group(); g.position.set(x + w / 2, 0, z); g.rotation.y = ry; root.add(g);
    const put = (geo, mat, px, py, pz) => { const m = new THREE.Mesh(geo, mat); m.position.set(px, py, pz); m.castShadow = m.receiveShadow = true; g.add(m); };
    put(new THREE.BoxGeometry(w, 0.9, d), white, 0, 0.45, 0);                 // base
    put(new THREE.BoxGeometry(w * 0.96, 0.03, d * 0.92), shelf, 0, 0.92, 0);   // display shelf
    if (front) {                                                              // tall fin dividers, stepped
      put(new THREE.BoxGeometry(0.04, 2.2, d), white, -w / 2, 1.1, 0);
      put(new THREE.BoxGeometry(w, 1.25, 0.02), glass, 0, 1.55, d / 2 - 0.01);
    } else {                                                                  // glass hood with frame
      put(new THREE.BoxGeometry(w * 0.98, h - 0.9, d * 0.95), glass, 0, 0.9 + (h - 0.9) / 2, 0.02);
      [-1, 1].forEach(s => put(new THREE.BoxGeometry(0.025, h - 0.9, 0.025), frame, s * w * 0.49, 0.9 + (h - 0.9) / 2, d * 0.47));
      put(new THREE.BoxGeometry(w * 0.98, 0.04, d * 0.95), frame, 0, h, 0.02);
    }
  }

  /* ---------- printed graphics, drawn on canvases ---------- */
  function faceMat(draw, w, h, transparent = false) {
    const c = document.createElement("canvas"), k = 360;
    c.width = Math.round(w * k); c.height = Math.round(h * k);
    const ctx = c.getContext("2d"); ctx.W = c.width; ctx.H = c.height;
    if (!transparent) { ctx.fillStyle = "#f4f4f2"; ctx.fillRect(0, 0, c.width, c.height); }
    const tex = new THREE.CanvasTexture(c); tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = 8;
    ctx.done = () => { tex.needsUpdate = true; };
    draw(ctx); tex.needsUpdate = true;
    return new THREE.MeshStandardMaterial({ map: tex, roughness: 0.75, transparent });
  }
  function text(ctx, s, x, y, size, col, w = 400) { ctx.fillStyle = col; ctx.font = `${w} ${size * ctx.H}px ${FONT}`; ctx.fillText(s, x * ctx.W, y * ctx.H); }
  function vtext(ctx, s, x, y, size, col) { ctx.fillStyle = col; ctx.font = `${size * ctx.H}px ${FONT}`; [...s].forEach((ch, i) => ctx.fillText(ch, x * ctx.W, (y + i * size * 1.15) * ctx.H)); }
  function bar(ctx, x, y, w, h) { ctx.fillStyle = "#b9bcc2"; ctx.fillRect(x * ctx.W, y * ctx.H, w * ctx.W, h * ctx.H); }
  function dot(ctx, x, y, r) { ctx.fillStyle = "#c5c9d0"; ctx.beginPath(); ctx.arc(x * ctx.W, y * ctx.H, r * ctx.H, 0, 7); ctx.fill(); }
  function arc(ctx, x, y, rw, rh) { ctx.strokeStyle = BLUE; ctx.lineWidth = 0.022 * ctx.H; ctx.beginPath(); ctx.ellipse(x * ctx.W, y * ctx.H, rw * ctx.H, rh * ctx.H, 0, 0, Math.PI * 2); ctx.stroke(); }
  function blobs(ctx, list) { list.forEach(([x, y, r]) => img(ctx, "b3d-blob.png", x - r, y - r, r * 2 * ctx.H / ctx.W)); }
  function img(ctx, src, x, y, w) {
    const im = new Image(); im.onload = () => { const pw = w * ctx.W; ctx.drawImage(im, x * ctx.W, y * ctx.H, pw, pw * im.height / im.width); ctx.done(); }; im.src = (opts.base || "img/") + src;
  }
  function noiseTex(hex, amt, rx = 1, ry = 1) {
    const c = document.createElement("canvas"); c.width = c.height = 128; const x = c.getContext("2d");
    x.fillStyle = hex; x.fillRect(0, 0, 128, 128);
    for (let i = 0; i < 2600; i++) { x.fillStyle = `rgba(${Math.random() < .5 ? "0,0,0" : "255,255,255"},${Math.random() * amt})`; x.fillRect(Math.random() * 128, Math.random() * 128, 1, 1); }
    const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace;
    t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(rx, ry); return t;
  }
  function rounden(geo, r) {                       // soften cube edges like an inflated cushion
    const p = geo.attributes.position, v = new THREE.Vector3(), hw = 0.2;
    for (let i = 0; i < p.count; i++) {
      v.fromBufferAttribute(p, i);
      const c = v.clone().clampScalar(-hw + r, hw - r), d = v.clone().sub(c);
      if (d.length() > 0) v.copy(c.add(d.setLength(r + (hw - r) * 0)));
      p.setXYZ(i, v.x, v.y, v.z);
    }
    geo.computeVertexNormals();
  }

  /* ---------- light and ground shadow ---------- */
  scene.add(new THREE.HemisphereLight("#ffffff", "#b9bdc6", 0.35));
  const sun = new THREE.DirectionalLight("#fffaf2", 2.4);
  sun.position.set(4, 14, 10); sun.target.position.set(7.3, 0, 3);
  sun.castShadow = true; sun.shadow.mapSize.set(2048, 2048);
  Object.assign(sun.shadow.camera, { left: -11, right: 11, top: 11, bottom: -11, near: 1, far: 40 });
  sun.shadow.bias = -0.0004; sun.shadow.radius = 4;
  scene.add(sun, sun.target);
  const ground = new THREE.Mesh(new THREE.PlaneGeometry(80, 80), new THREE.ShadowMaterial({ opacity: 0.22 }));
  ground.rotation.x = -Math.PI / 2; ground.receiveShadow = true; scene.add(ground);

  /* centre the model like a product on a turntable */
  root.position.set(-7.3, 0, -3.1);
  controls.target.set(0, 1.1, 0);
  camera.position.set(9.5, 9, 13.5);
  controls.update();

  /* ---------- sizing, idle autoplay, render only while visible ---------- */
  const resize = () => {
    const w = box.clientWidth, h = box.clientHeight || w * 9 / 16;
    renderer.setSize(w, h, false); camera.aspect = w / h;
    camera.fov = w < 520 ? 42 : 32; camera.updateProjectionMatrix();
  };
  const ro = new ResizeObserver(resize); ro.observe(box); resize();
  let idle;
  controls.addEventListener("start", () => { controls.autoRotate = false; clearTimeout(idle); opts.onUse && opts.onUse(); });
  controls.addEventListener("end", () => { clearTimeout(idle); if (!reduce) idle = setTimeout(() => (controls.autoRotate = true), 3500); });
  let on = false;
  const loop = () => { controls.update(); renderer.render(scene, camera); };
  const io = new IntersectionObserver(es => es.forEach(e => { on = e.isIntersecting; renderer.setAnimationLoop(on ? loop : null); }));
  io.observe(box);

  return () => { renderer.setAnimationLoop(null); io.disconnect(); ro.disconnect(); controls.dispose(); pmrem.dispose(); renderer.dispose(); renderer.domElement.remove(); };
}
