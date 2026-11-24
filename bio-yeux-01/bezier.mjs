// The inherited face contour and the new eyelids both use cubic Béziers.
export function outlineCurves(path) {
  const points = [...path.matchAll(/(-?[\d.eE+-]+),(-?[\d.eE+-]+)/g)]
    .map(([, x, y]) => [Number(x), Number(y)]);
  if (!/^M[^C]+(?:C[^CZ]+)+Z$/.test(path) || points.length % 3 !== 1) {
    throw new Error('Contour facial hérité incompatible');
  }
  const curves = [];
  for (let i = 0; i < points.length - 1; i += 3) curves.push(points.slice(i, i + 4));
  return curves;
}

export function pointAt(curve, t) {
  const u = 1 - t;
  return curve[0].map((value, axis) =>
    u ** 3 * value + 3 * u * u * t * curve[1][axis] +
    3 * u * t * t * curve[2][axis] + t ** 3 * curve[3][axis]);
}

export function extrema(curve, axis) {
  const [p0, p1, p2, p3] = curve.map(point => point[axis]);
  const c = p1 - p0;
  const b = 2 * (p2 - 2 * p1 + p0);
  const a = p3 - 3 * p2 + 3 * p1 - p0;
  const discriminant = b * b - 4 * a * c;
  const roots = Math.abs(a) < 1e-9
    ? (Math.abs(b) < 1e-9 ? [] : [-c / b])
    : (discriminant < 0 ? [] : [(-b - Math.sqrt(discriminant)) / (2 * a), (-b + Math.sqrt(discriminant)) / (2 * a)]);
  return roots.filter(t => t > 0 && t < 1).sort((a, b) => a - b);
}

export function bounds(curves, padding = 0) {
  return [0, 1].map(axis => {
    const values = curves.flatMap(curve =>
      [0, 1, ...extrema(curve, axis)].map(t => pointAt(curve, t)[axis]));
    return [Math.min(...values) - padding, Math.max(...values) + padding];
  });
}

function horizontalRoots(curve, y) {
  const stops = [0, ...extrema(curve, 1), 1];
  const roots = [];
  for (let i = 1; i < stops.length; i++) {
    let lo = stops[i - 1], hi = stops[i];
    const y0 = pointAt(curve, lo)[1], y1 = pointAt(curve, hi)[1];
    if (y < Math.min(y0, y1) || y > Math.max(y0, y1)) continue;
    if (y === y0) { roots.push(lo); continue; }
    if (y === y1) { roots.push(hi); continue; }
    for (let j = 0; j < 35; j++) {
      const mid = (lo + hi) / 2;
      if ((pointAt(curve, mid)[1] < y) === (y0 < y1)) lo = mid;
      else hi = mid;
    }
    roots.push((lo + hi) / 2);
  }
  return roots;
}

// X extrema of the portions of the actual outline inside a horizontal strip.
export function stripX(curves, top, bottom = top) {
  return curves.flatMap(curve => {
    const crossings = horizontalRoots(curve, top);
    if (bottom === top) return crossings.map(t => pointAt(curve, t)[0]);
    const internal = [0, 1, ...extrema(curve, 0)].filter(t => {
      const y = pointAt(curve, t)[1];
      return y >= top && y <= bottom;
    });
    return [...crossings, ...horizontalRoots(curve, bottom), ...internal]
      .map(t => pointAt(curve, t)[0]);
  });
}
