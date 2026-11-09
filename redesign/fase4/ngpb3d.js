// NextGenPB in four steps, 3D variant: the molecule stands above the slice plane in 3D (ball and stick,
// then its molecular surface), the octree mesh stays on the plane in 2D.
// Data: window.NGPB, written by redesign/tools/fase4_3d.py from a NextGenPB run (camera included:
// the script drops the faces this camera cannot see and orders the rest back to front).
// Motion: transform and opacity only.
(() => {
  const D = window.NGPB;
  const fig = document.querySelector('.ngpb');
  if (!D || !fig) return;
  const NS = 'http://www.w3.org/2000/svg';
  const art = fig.querySelector('.ngpb__art');
  const bin = (b64) => { const s = atob(b64), u = new Uint8Array(s.length); for (let i = 0; i < s.length; i++) u[i] = s.charCodeAt(i); return new DataView(u.buffer); };

  // ---------- camera: plan (x, y) in angstrom, z up ----------
  const AZ = D.cam[0] * Math.PI / 180, EL = D.cam[1] * Math.PI / 180;
  const ca = Math.cos(AZ), sa = Math.sin(AZ), se = Math.sin(EL), ce = Math.cos(EL);
  const X = (x, y) => x * ca - y * sa;
  const Y = (x, y, z = 0) => -(x * sa + y * ca) * se - z * ce;
  const W = [-sa * ce, -ca * ce, se];                 // towards the viewer
  const depth = (x, y, z) => x * W[0] + y * W[1] + z * W[2];
  const Lt = (() => { const r = [ca, -sa, 0], up = [sa * se, ca * se, ce]; const l = [-0.45 * r[0] + 0.75 * up[0] + 0.5 * W[0], -0.45 * r[1] + 0.75 * up[1] + 0.5 * W[1], 0.75 * up[2] + 0.5 * W[2]]; const n = Math.hypot(...l); return l.map((c) => c / n); })();
  const Mx = `matrix(${ca} ${-sa * se} ${-sa} ${-ca * se} 0 0)`;
  const f1 = (v) => Math.round(v * 100) / 100;

  // ---------- the slice and the domain (as in the 2D figure) ----------
  const area = (L) => L.reduce((s, p, i) => { const q = L[(i + 1) % L.length]; return s + p[0] * q[1] - q[0] * p[1]; }, 0) / 2;
  const loops = D.loops.map((L) => (area(L) > 0 ? L : L.slice().reverse()));
  const all = loops.flat();
  const bx = [Math.min(...all.map((p) => p[0])), Math.max(...all.map((p) => p[0]))];
  const by = [Math.min(...all.map((p) => p[1])), Math.max(...all.map((p) => p[1]))];
  const H = 3.75, S = H * 32, T = 6;
  const ox = Math.round(((bx[0] + bx[1]) / 2 - S / 2) / H) * H;
  const oy = Math.round(((by[0] + by[1]) / 2 - S / 2) / H) * H;
  const grow = (a, b) => { const c = (a + b) / 2, h = (b - a) / 2 / 0.9; return [c - h, c + h]; };
  const fx = grow(...bx), fy = grow(...by);

  const root = { x: ox, y: oy, s: S, k: null };
  const split = (n) => { const h = n.s / 2; n.k = [[0, 0], [h, 0], [0, h], [h, h]].map(([a, b]) => ({ x: n.x + a, y: n.y + b, s: h, k: null })); };
  const hits = (n) => n.x < fx[1] && n.x + n.s > fx[0] && n.y < fy[1] && n.y + n.s > fy[0];
  (function refine(n) { if (n.s > H && hits(n)) { split(n); n.k.forEach(refine); } })(root);
  const find = (x, y) => { let n = root; while (n.k) n = n.k[(x >= n.x + n.s / 2 ? 1 : 0) + (y >= n.y + n.s / 2 ? 2 : 0)]; return n; };
  const leaves = () => { const out = []; (function w(n) { if (n.k) n.k.forEach(w); else out.push(n); })(root); return out; };
  for (let changed = true; changed;) {
    changed = false;
    for (const n of leaves()) {
      const e = H / 4, pts = [];
      for (let t = e; t < n.s; t += H / 2) pts.push([n.x - e, n.y + t], [n.x + n.s + e, n.y + t], [n.x + t, n.y - e], [n.x + t, n.y + n.s + e]);
      pts.push([n.x - e, n.y - e], [n.x + n.s + e, n.y - e], [n.x - e, n.y + n.s + e], [n.x + n.s + e, n.y + n.s + e]);
      if (pts.some(([x, y]) => x > ox && y > oy && x < ox + S && y < oy + S && find(x, y).s < n.s / 2)) { split(n); changed = true; }
    }
  }
  const cells = leaves();
  const sizes = [...new Set(cells.map((n) => n.s))].sort((a, b) => b - a);
  const cut = new Map();
  for (const L of loops) L.forEach((p, i) => {
    const q = L[(i + 1) % L.length], len = Math.hypot(q[0] - p[0], q[1] - p[1]), m = Math.max(1, Math.ceil(len / 0.4));
    for (let j = 0; j < m; j++) {
      const t = j / m, n = find(p[0] + t * (q[0] - p[0]), p[1] + t * (q[1] - p[1]));
      const c = cut.get(n) || { s: 0, w: 0 };
      c.s += p[2] + t * (q[2] - p[2]); c.w += 1; cut.set(n, c);
    }
  });

  // ---------- svg ----------
  const el = (name, attrs = {}, parent) => {
    const e = document.createElementNS(NS, name);
    for (const k in attrs) e.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(e);
    return e;
  };
  const poly = (pts) => 'M' + pts.map((p) => f1(p[0]) + ' ' + f1(p[1])).join('L') + 'Z';
  const PHI = 5;
  const tint = (phi) => ({ cls: phi < 0 ? 'neg' : 'pos', a: Math.min(1, Math.abs(phi) / PHI) });

  const vd = bin(D.verts), V = [];
  for (let o = 0; o < vd.byteLength; o += 6) V.push([vd.getInt16(o, true) / 10, vd.getInt16(o + 2, true) / 10, vd.getInt16(o + 4, true) / 10]);
  const corners = [[ox, oy], [ox + S, oy], [ox + S, oy + S], [ox, oy + S]];
  const xs = corners.map(([x, y]) => X(x, y)).concat(V.map((p) => X(p[0], p[1])));
  const ys = corners.flatMap(([x, y]) => [Y(x, y, 0), Y(x, y, -T)]).concat(V.map((p) => Y(p[0], p[1], p[2])));
  const pad = 2;
  const vb = [Math.min(...xs) - pad, Math.min(...ys) - pad, Math.max(...xs) - Math.min(...xs) + 2 * pad, Math.max(...ys) - Math.min(...ys) + 2 * pad];
  const svg = el('svg', { viewBox: vb.map(f1).join(' '), role: 'img', 'aria-labelledby': 'ngpb-desc', focusable: 'false' }, art);
  el('desc', { id: 'ngpb-desc' }, svg).textContent = fig.dataset.desc || '';

  const facing = (nx, ny) => -(nx * sa + ny * ca) * se;
  const tone = (nx, ny) => { const l = (nx * -0.6 + ny * 0.8); return l > 0.35 ? 'w1' : l > -0.35 ? 'w2' : 'w3'; };

  // 1. slab
  const g0 = el('g', { class: 'ngpb__slab' }, svg);
  corners.forEach((p, i) => {
    const q = corners[(i + 1) % 4], nx = q[1] - p[1], ny = p[0] - q[0], l = Math.hypot(nx, ny);
    if (facing(nx / l, ny / l) <= 0) return;
    el('path', { class: 's ' + tone(nx / l, ny / l), d: poly([[X(...p), Y(...p)], [X(...q), Y(...q)], [X(...q), Y(...q, -T)], [X(...p), Y(...p, -T)]]) }, g0);
  });
  el('rect', { class: 'ngpb__plate', x: ox, y: oy, width: S, height: S }, el('g', { transform: Mx }, g0));

  // 2. potential on the cut cells
  const gPot = el('g', { class: 'ngpb__pot', transform: Mx }, svg);
  for (const [n, c] of cut) { const t = tint(c.s / c.w); el('rect', { class: t.cls, 'fill-opacity': f1(t.a), x: n.x, y: n.y, width: n.s, height: n.s }, gPot); }

  // 3. mesh
  const gMesh = el('g', { class: 'ngpb__mesh' }, svg);
  sizes.forEach((s, i) => {
    const g = el('g', { class: 'lvl', style: `--i:${i}` }, gMesh);
    el('path', { d: cells.filter((n) => n.s === s).map((n) => `M${n.x} ${n.y}h${s}v${s}h${-s}Z`).join(''), transform: Mx, class: s === H ? 'fine' : '' }, g);
    const ticks = [];
    cells.filter((n) => n.s === s).forEach((n) => {
      for (const [x, y] of [[n.x, n.y], [n.x + n.s, n.y], [n.x, n.y + n.s], [n.x + n.s, n.y + n.s]]) {
        const onX = x === ox || x === ox + S, onY = y === oy || y === oy + S;
        if (onX === onY) continue;
        const nx = onX ? (x === ox ? -1 : 1) : 0, ny = onY ? (y === oy ? -1 : 1) : 0;
        if (facing(nx, ny) > 0) ticks.push([x, y]);
      }
    });
    if (ticks.length) el('path', { class: 'tick', d: ticks.map(([x, y]) => `M${f1(X(x, y))} ${f1(Y(x, y))}V${f1(Y(x, y, -T * 0.55))}`).join('') }, g);
  });

  // 4. atoms, ball and stick, painted back to front with their bonds
  const gAtoms = el('g', { class: 'ngpb__atoms' }, svg);
  const items = [];
  const ad = bin(D.atoms), at = [];
  for (let o = 0; o < ad.byteLength; o += 7) {
    const fl = ad.getUint8(o + 6);
    at.push({ p: [ad.getInt16(o, true) / 10, ad.getInt16(o + 2, true) / 10, ad.getInt16(o + 4, true) / 10], c: fl & 1, e: fl >> 1 });
  }
  // bonds from distances (heavy atoms: < 1.95 A, < 2.1 A with sulphur), found on a 2.2 A grid
  const grid = new Map(), cell = (p) => p.map((v) => Math.floor(v / 2.2));
  at.forEach((a, i) => { const k = cell(a.p).join(','); (grid.get(k) || grid.set(k, []).get(k)).push(i); });
  at.forEach((a, i) => {
    items.push({ k: 'ball', a: a.p, r: a.e === 3 ? 0.62 : 0.48, c: a.c, d: depth(...a.p) });
    const [gx, gy, gz] = cell(a.p);
    for (let dx = -1; dx <= 1; dx++) for (let dy = -1; dy <= 1; dy++) for (let dz = -1; dz <= 1; dz++) {
      for (const j of grid.get(`${gx + dx},${gy + dy},${gz + dz}`) || []) {
        if (j <= i) continue;
        const b = at[j].p, lim = (a.e === 3 || at[j].e === 3) ? 2.1 : 1.95;
        if (Math.hypot(b[0] - a.p[0], b[1] - a.p[1], b[2] - a.p[2]) < lim) items.push({ k: 'stick', a: a.p, b, w: 0.3, c: a.c, d: depth((a.p[0] + b[0]) / 2, (a.p[1] + b[1]) / 2, (a.p[2] + b[2]) / 2) - 0.01 });
      }
    }
  });
  items.sort((p, q) => p.d - q.d);
  const span = bx[1] - bx[0];
  for (const it of items) {
    const delay = `--d:${f1(((it.a[0] - bx[0]) / span) * 1.2)}s`;
    if (it.k === 'stick') {
      el('line', { class: 'stick c' + it.c, x1: f1(X(it.a[0], it.a[1])), y1: f1(Y(...it.a)), x2: f1(X(it.b[0], it.b[1])), y2: f1(Y(...it.b)), 'stroke-width': it.w, style: delay }, gAtoms);
    } else {
      const cx = X(it.a[0], it.a[1]), cy = Y(...it.a);
      const g = el('g', { class: 'ball c' + it.c, style: delay }, gAtoms);
      el('circle', { cx: f1(cx), cy: f1(cy), r: it.r }, g);
      el('circle', { class: 'hl', cx: f1(cx - it.r * 0.3), cy: f1(cy - it.r * 0.32), r: f1(it.r * 0.42) }, g);
    }
  }

  // 5. molecular surface: faces seen by the viewer, flat shaded, back to front; a grey set and a set
  //    coloured by the potential (solid colours), which fades in as one piece
  const fd = bin(D.faces), faces = [];
  for (let o = 0; o < fd.byteLength; o += 7) {
    const p = [fd.getUint16(o, true), fd.getUint16(o + 2, true), fd.getUint16(o + 4, true)].map((i) => V[i]);
    const e1 = [p[1][0] - p[0][0], p[1][1] - p[0][1], p[1][2] - p[0][2]], e2 = [p[2][0] - p[0][0], p[2][1] - p[0][1], p[2][2] - p[0][2]];
    let nx = e1[1] * e2[2] - e1[2] * e2[1], ny = e1[2] * e2[0] - e1[0] * e2[2], nz = e1[0] * e2[1] - e1[1] * e2[0];
    const l = Math.hypot(nx, ny, nz) || 1;
    const lit = (nx * Lt[0] + ny * Lt[1] + nz * Lt[2]) / l;
    faces.push({ g: Math.max(0, Math.min(5, Math.round((1 - lit) * 3.2))), phi: fd.getInt8(o + 6) / 20, s: poly(p.map((a) => [X(a[0], a[1]), Y(a[0], a[1], a[2])])) });
  }
  const gSurf = el('g', { class: 'ngpb__surf' }, svg);
  // under the faces, all of them in one path with a wide stroke: it closes the small gaps the
  // simplification leaves between faces and gives the molecule its outline
  el('path', { class: 'ngpb__under', d: faces.map((f) => f.s).join('') }, gSurf);
  const gGrey = el('g', {}, gSurf), gCol = el('g', { class: 'ngpb__wallpot' }, gSurf);
  for (const f of faces) {
    el('path', { class: 'f g' + f.g, d: f.s }, gGrey);
    const t = tint(f.phi);
    el('path', { class: 'f', d: f.s, style: `--c:color-mix(in srgb,var(--g${f.g}),var(--${t.cls}) ${Math.round(t.a * 100)}%)` }, gCol);
  }

  // ---------- steps, autoplay, pause, reduced motion (as in the 2D figure) ----------
  const steps = [...fig.querySelectorAll('[data-go]')];
  const says = [...fig.querySelectorAll('.ngpb__say p')];
  const playBtn = fig.querySelector('.ngpb__play');
  const still = matchMedia('(prefers-reduced-motion: reduce)');
  let step = 0, timer = null, playing = false, onScreen = false;
  const live = () => onScreen && !document.hidden;
  const show = (s) => {
    step = s;
    for (let i = 1; i <= 4; i++) fig.classList.toggle('s' + i, s >= i);
    steps.forEach((b) => (+b.dataset.go === s ? b.setAttribute('aria-current', 'step') : b.removeAttribute('aria-current')));
    says.forEach((p, i) => p.classList.toggle('on', i + 1 === s));
  };
  const HOLD = [800, 3400, 3600, 4000, 6500];
  let left = 0, since = 0;
  const tick = (resume = false) => {
    stop();
    if (!playing || !live()) return;
    if (!resume || left <= 0) left = HOLD[step];
    since = performance.now();
    timer = setTimeout(() => { left = 0; show(step >= 4 ? 0 : step + 1); tick(); }, left);
  };
  const stop = () => { if (timer) { clearTimeout(timer); left -= performance.now() - since; } timer = null; };
  const setPlaying = (p) => {
    playing = p;
    playBtn.textContent = p ? 'Pause' : 'Play';
    playBtn.setAttribute('aria-pressed', String(!p));
    stop();
    if (p) tick();
  };
  steps.forEach((b) => b.addEventListener('click', () => { setPlaying(false); show(+b.dataset.go); }));
  playBtn.addEventListener('click', () => setPlaying(!playing));
  const init = () => {
    stop();
    if (still.matches) { playing = false; fig.classList.add('still'); show(4); return; }
    fig.classList.remove('still');
    show(0);
    setPlaying(true);
  };
  still.addEventListener('change', init);
  new IntersectionObserver(([e]) => {
    if (onScreen === e.isIntersecting) return;
    onScreen = e.isIntersecting;
    if (onScreen && playing) tick(true); else stop();
  }, { threshold: 0.25 }).observe(fig);
  document.addEventListener('visibilitychange', () => { stop(); if (playing) tick(true); });
  fig.classList.add('ready');
  init();
})();
