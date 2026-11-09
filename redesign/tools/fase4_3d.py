"""Data for the NextGenPB figure (phase 4): barnase-barstar standing on the plane of the mesh.

usage: python3 fase4_3d.py <run_dir> <out.js> [cluster_A]

<run_dir> is a NextGenPB run with `surf_potential = 1` (input.pqr + triangulatedSurf_phi.vtp, ASCII).
Used: presentazione-wade/data/results_forces/B/runs/NLPB_0.145_surf/D10 (NLPB, 0.145 M, barstar moved
10 A away from the crystal pose, h = 0.5 A).

Frame: x along the line between the centres of the two chains, y the principal axis of the atoms
orthogonal to it, z the normal; z = 0 is the plane of the mesh, through the centre of all atoms.
Only what lies above the plane is kept: the slab of the figure hides the rest.

The camera is fixed (CAM below) and written into the data, so the page and this script share it:
faces the viewer cannot see are dropped here, and the rest are written back to front.

Written to <out.js> as `window.NGPB = {...}`:
  cam:   [azimuth, elevation] in degrees
  loops: where the plane cuts the molecular surface, [[x, y, phi], ...] in A and kT/e, 0.1 precision
  atoms: base64, per heavy atom above the plane: int16 x, y, z (0.1 A), uint8 flags (bit 0: barstar, bits 1-2: C N O S)
  verts: base64, int16 x, y, z (0.1 A) of the surface vertices that visible faces use
  faces: base64, per visible triangle back to front: uint16 i, j, k, int8 phi (0.05 kT/e)
The surface is the NanoShaper triangulation of the run (110 k triangles), simplified by vertex clustering
on a cubic grid of cluster_A (default 2.5 A, phi averaged over each cluster) and clipped at z = 0.
"""
import base64
import json
import math
import os
import sys

import numpy as np

CAM = (24.0, 38.0)            # azimuth and elevation of the figure's camera, degrees
run, out = sys.argv[1], sys.argv[2]
G = float(sys.argv[3]) if len(sys.argv) > 3 else 2.5


def arrays(path):
    """ASCII VTP -> dict of named arrays."""
    res, nm, buf = {}, None, []
    with open(path) as f:
        for line in f:
            s = line.strip()
            if s.startswith('<DataArray'):
                nm = s.split('Name="')[1].split('"')[0] if 'Name="' in s else 'Points'
                buf = []
            elif s.startswith('</DataArray'):
                res[nm] = np.array(' '.join(buf).split(), dtype=float)
                nm = None
            elif nm is not None:
                buf.append(s)
    return res


# ---------------- atoms and frame
rows = []
for line in open(f'{run}/input.pqr'):
    if line.startswith('ATOM'):
        f = line.split()
        rows.append((f[2], f[4], float(f[-5]), float(f[-4]), float(f[-3]), float(f[-1])))
name = np.array([r[0] for r in rows]); chain = np.array([r[1] for r in rows])
xyz = np.array([r[2:5] for r in rows]); rad = np.array([r[5] for r in rows])
real = rad > 0.05
cA, cD = xyz[real & (chain == 'A')].mean(0), xyz[real & (chain == 'D')].mean(0)
centre = xyz[real].mean(0)
u = (cD - cA) / np.linalg.norm(cD - cA)
P = xyz[real] - centre
Pp = P - np.outer(P @ u, u)
_, V = np.linalg.eigh(Pp.T @ Pp)
v = V[:, -1] - (V[:, -1] @ u) * u
v /= np.linalg.norm(v)
n = np.cross(u, v)
F = np.stack([u, v, n])
loc = (xyz - centre) @ F.T

heavy = np.array([not (s[0] == 'H' or (s[0].isdigit() and 'H' in s)) for s in name])
ELEM = {'C': 0, 'N': 1, 'O': 2, 'S': 3}
keep = np.where(real & heavy & (loc[:, 2] > 0))[0]
atoms = bytearray()
for k in keep:
    atoms += np.round(loc[k] * 10).astype('<i2').tobytes()
    atoms += bytes([int(chain[k] == 'D') | (ELEM.get(name[k][0], 0) << 1)])
print('heavy atoms above the plane:', len(keep))

# ---------------- surface
A = arrays(f'{run}/triangulatedSurf_phi.vtp')
pts = (A['Points'].reshape(-1, 3) - centre) @ F.T
phi = A['phi']
tri = A['connectivity'].astype(int).reshape(-1, 3)
offs = A['offsets'].astype(int)
assert np.all(np.diff(np.concatenate([[0], offs])) == 3), 'triangles only'

# outward orientation: the normal of a triangle should point away from the nearest atom
tc = pts[tri].mean(1)
nrm = np.cross(pts[tri[:, 1]] - pts[tri[:, 0]], pts[tri[:, 2]] - pts[tri[:, 0]])
sample = np.arange(0, len(tri), 50)
near = np.array([loc[real][np.argmin(((loc[real] - tc[i]) ** 2).sum(1))] for i in sample])
if np.mean(((tc[sample] - near) * nrm[sample]).sum(1)) < 0:
    tri = tri[:, ::-1]
    print('triangles flipped to point outwards')

# ---- slice of the full-resolution surface at z = 0 (for the cells the surface cuts)
d = pts[:, 2].copy()
d[np.abs(d) < 1e-7] = 1e-7
val, segs = {}, []
for a, b, c in tri:
    s = (d[a] > 0, d[b] > 0, d[c] > 0)
    if all(s) or not any(s):
        continue
    ends = []
    for i, j in ((a, b), (b, c), (c, a)):
        if (d[i] > 0) != (d[j] > 0):
            key = (min(i, j), max(i, j))
            t = d[key[0]] / (d[key[0]] - d[key[1]])
            p = pts[key[0]] + t * (pts[key[1]] - pts[key[0]])
            val[key] = (p[0], p[1], phi[key[0]] + t * (phi[key[1]] - phi[key[0]]))
            ends.append(key)
    segs.append(tuple(ends))
nbr = {}
for e1, e2 in segs:
    nbr.setdefault(e1, []).append(e2)
    nbr.setdefault(e2, []).append(e1)
seen, loops = set(), []
for start in nbr:
    if start in seen:
        continue
    loop, prev, cur = [start], None, start
    seen.add(start)
    while True:
        nxt = [e for e in nbr[cur] if e != prev]
        if not nxt or nxt[0] == start or nxt[0] in seen:
            break
        prev, cur = cur, nxt[0]
        seen.add(cur)
        loop.append(cur)
    loops.append([val[k] for k in loop])


def dp(Pl, tol):
    if len(Pl) < 3:
        return Pl
    a, b = np.array(Pl[0][:2]), np.array(Pl[-1][:2])
    ab = b - a
    L = np.linalg.norm(ab)
    best, idx = 0, 0
    for k in range(1, len(Pl) - 1):
        p = np.array(Pl[k][:2]) - a
        dist = abs(ab[0] * p[1] - ab[1] * p[0]) / L if L > 0 else np.linalg.norm(p)
        if dist > best:
            best, idx = dist, k
    if best <= tol:
        return [Pl[0], Pl[-1]]
    return dp(Pl[:idx + 1], tol)[:-1] + dp(Pl[idx:], tol)


def area(L):
    x, y = np.array([p[0] for p in L]), np.array([p[1] for p in L])
    return 0.5 * (x @ np.roll(y, -1) - y @ np.roll(x, -1))


out_loops = []
for L in loops:
    if len(L) < 8 or abs(area(L)) < 20:          # leaves out a 6 A^2 cavity inside barnase
        continue
    k = len(L) // 2
    S = dp(L[:k + 1], 0.15)[:-1] + dp(L[k:] + [L[0]], 0.15)[:-1]
    out_loops.append([[round(p[0], 1), round(p[1], 1), round(p[2], 1)] for p in S])
print('slice loops:', [len(L) for L in out_loops])

# ---- simplified surface above the plane
key = np.floor(pts / G).astype(int)
_, cid = np.unique(key, axis=0, return_inverse=True)
cid = cid.ravel()
cnt = np.bincount(cid)
cp = np.stack([np.bincount(cid, pts[:, i]) for i in range(3)], 1) / cnt[:, None]
cphi = np.bincount(cid, phi) / cnt
Tq = cid[tri]
Tq = Tq[(Tq[:, 0] != Tq[:, 1]) & (Tq[:, 1] != Tq[:, 2]) & (Tq[:, 0] != Tq[:, 2])]
_, first = np.unique(np.sort(Tq, 1), axis=0, return_index=True)
Tq = Tq[np.sort(first)]
print(f'clustered at {G} A: {len(cp)} vertices, {len(Tq)} triangles')

verts = [list(p) + [f] for p, f in zip(cp.tolist(), cphi.tolist())]
cache = {}


def cutv(i, j):
    k = (min(i, j), max(i, j))
    if k not in cache:
        a, b = np.array(verts[i]), np.array(verts[j])
        t = a[2] / (a[2] - b[2])
        p = a + t * (b - a)
        p[2] = 0.0
        cache[k] = len(verts)
        verts.append(p.tolist())
    return cache[k]


tris = []
for t in Tq.tolist():
    zs = [verts[i][2] for i in t]
    if min(zs) >= 0:
        tris.append(t)
        continue
    if max(zs) <= 0:
        continue
    poly = []
    for a, b in zip(t, t[1:] + t[:1]):
        ina, inb = verts[a][2] >= 0, verts[b][2] >= 0
        if ina:
            poly.append(a)
        if ina != inb:
            poly.append(cutv(a, b))
    tris += [[poly[0], poly[i], poly[i + 1]] for i in range(1, len(poly) - 1)]

# ---- camera: drop the faces turned away, paint the rest back to front
az, el = (math.radians(c) for c in CAM)
W = np.array([-math.sin(az) * math.cos(el), -math.cos(az) * math.cos(el), math.sin(el)])   # towards the viewer
Vx = np.array([p[:3] for p in verts])
Vx[:, 2] = np.maximum(Vx[:, 2], 0)
Tr = np.array(tris)
nn = np.cross(Vx[Tr[:, 1]] - Vx[Tr[:, 0]], Vx[Tr[:, 2]] - Vx[Tr[:, 0]])
seenf = (nn @ W) > 1e-9
Tr = Tr[seenf]
order = np.argsort((Vx[Tr].mean(1)) @ W, kind='stable')
Tr = Tr[order]
fphi = np.array([np.mean([verts[i][3] for i in t]) for t in Tr])
used = np.unique(Tr)
remap = -np.ones(len(verts), int)
remap[used] = np.arange(len(used))
vb = np.round(Vx[used] * 10).astype('<i2').tobytes()
fb = bytearray()
for t, f in zip(remap[Tr], fphi):
    fb += t.astype('<u2').tobytes() + np.clip(np.round(f * 20), -127, 127).astype('i1').tobytes()
print(f'visible: {len(Tr)} of {len(tris)} faces, {len(used)} vertices; phi on them {fphi.min():.1f} .. {fphi.max():.1f} kT/e')

b64 = lambda b: base64.b64encode(bytes(b)).decode()
data = dict(source='NextGenPB, barnase-barstar (PDB 1BRS, chains A and D), NLPB 0.145 M, barstar 10 A from the crystal pose; '
                   f'surface clustered at {G} A',
            cam=list(CAM), loops=out_loops, atoms=b64(atoms), verts=b64(vb), faces=b64(fb))
with open(out, 'w') as f:
    f.write('window.NGPB=' + json.dumps(data, separators=(',', ':')) + ';\n')
print('wrote', out, os.path.getsize(out), 'bytes')
