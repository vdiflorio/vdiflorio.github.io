"""Project the C-alpha trace of a PDB complex to 2D and write a smooth SVG line drawing.

usage: python3 -I backbone.py <file.pdb> <chainA,chainB> <out.svg>
Orthographic projection on the two principal axes (PCA via Jacobi), then Catmull-Rom -> cubic Bezier.
"""
import math
import sys

pdb, chains, out = sys.argv[1], sys.argv[2].split(','), sys.argv[3]

traces = {c: [] for c in chains}
for line in open(pdb):
    if line.startswith('ATOM') and line[12:16].strip() == 'CA' and line[21] in traces and line[16] in ' A':
        traces[line[21]].append((float(line[30:38]), float(line[38:46]), float(line[46:54])))

pts = [p for c in chains for p in traces[c]]
n = len(pts)
mean = [sum(p[i] for p in pts) / n for i in range(3)]
cov = [[sum((p[i] - mean[i]) * (p[j] - mean[j]) for p in pts) / n for j in range(3)] for i in range(3)]

# Jacobi eigen-decomposition of the symmetric 3x3 covariance
A = [row[:] for row in cov]
V = [[1.0 if i == j else 0.0 for j in range(3)] for i in range(3)]
for _ in range(60):
    p, q = max(((i, j) for i in range(3) for j in range(i + 1, 3)), key=lambda ij: abs(A[ij[0]][ij[1]]))
    if abs(A[p][q]) < 1e-12:
        break
    th = 0.5 * math.atan2(2 * A[p][q], A[q][q] - A[p][p])
    c, s = math.cos(th), math.sin(th)
    for k in range(3):
        akp, akq = A[k][p], A[k][q]
        A[k][p], A[k][q] = c * akp - s * akq, s * akp + c * akq
    for k in range(3):
        apk, aqk = A[p][k], A[q][k]
        A[p][k], A[q][k] = c * apk - s * aqk, s * apk + c * aqk
    for k in range(3):
        vkp, vkq = V[k][p], V[k][q]
        V[k][p], V[k][q] = c * vkp - s * vkq, s * vkp + c * vkq
order = sorted(range(3), key=lambda i: -A[i][i])
ax1 = [V[k][order[0]] for k in range(3)]
ax2 = [V[k][order[1]] for k in range(3)]

def proj(p):
    d = [p[i] - mean[i] for i in range(3)]
    return (sum(d[i] * ax1[i] for i in range(3)), sum(d[i] * ax2[i] for i in range(3)))

paths2d = {c: [proj(p) for p in traces[c]] for c in chains}
xs = [x for c in chains for x, _ in paths2d[c]]
ys = [y for c in chains for _, y in paths2d[c]]
pad = 4
minx, maxx, miny, maxy = min(xs) - pad, max(xs) + pad, min(ys) - pad, max(ys) + pad
scale = 10  # SVG units per angstrom

def fmt(v):
    return f'{v:.1f}'.rstrip('0').rstrip('.')

def path(points):
    P = [((x - minx) * scale, (y - miny) * scale) for x, y in points]
    d = [f'M{fmt(P[0][0])} {fmt(P[0][1])}']
    for i in range(len(P) - 1):
        p0 = P[i - 1] if i > 0 else P[i]
        p1, p2 = P[i], P[i + 1]
        p3 = P[i + 2] if i + 2 < len(P) else P[i + 1]
        c1 = (p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6)
        c2 = (p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6)
        d.append(f'C{fmt(c1[0])} {fmt(c1[1])} {fmt(c2[0])} {fmt(c2[1])} {fmt(p2[0])} {fmt(p2[1])}')
    return ''.join(d)

W, H = (maxx - minx) * scale, (maxy - miny) * scale
body = '\n'.join(f'  <path data-chain="{c}" d="{path(paths2d[c])}"/>' for c in chains)
svg = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {fmt(W)} {fmt(H)}" fill="none" stroke="currentColor" stroke-width="5" stroke-linecap="round" stroke-linejoin="round">
  <!-- C-alpha backbone of barnase (chain {chains[0]}) and barstar (chain {chains[1]}), PDB 1BRS (CC0), orthographic projection on the principal axes -->
{body}
</svg>
'''
open(out, 'w').write(svg)
print(out, f'{W:.0f}x{H:.0f}', {c: len(traces[c]) for c in chains})
