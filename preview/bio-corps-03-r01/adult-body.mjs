import {referenceStructure, validateStructure} from './body-structure.mjs';
import {corpulenceEnvelope, previousCorpulence, referenceCorpulence} from './body-corpulence.mjs';

export const anatomyLevels = Object.freeze([
  {id: 'neck', label: 'Base du cou', height: 0},
  {id: 'shoulders', label: 'Épaules', height: .12},
  {id: 'thorax', label: 'Thorax', height: .26},
  {id: 'waist', label: 'Taille', height: .40},
  {id: 'abdomen', label: 'Abdomen', height: .47},
  {id: 'hips', label: 'Hanches', height: .57},
  {id: 'pelvis', label: 'Base pelvienne', height: 2 / 3}
].map(level => Object.freeze(level)));

export const adultBodies = Object.freeze({
  'adult-h': Object.freeze({
    name: 'Base adulte masculine (H)', widths: Object.freeze([12, 48, 44, 39, 38, 36, 34]), baseWidth: 32
  }),
  'adult-f': Object.freeze({
    name: 'Base adulte féminine (F)', widths: Object.freeze([10.5, 37, 35, 28, 31, 42, 39]), baseWidth: 36
  })
});

export const isAdultBody = key => typeof key === 'string' && Object.hasOwn(adultBodies, key);

const format = value => Number(value.toFixed(3));
const pair = (x, y) => `${format(x)},${format(y)}`;
const slope = (a, b) => (b.width - a.width) / (b.y - a.y);

// A shared tangent at each level keeps the sides smooth and limits the curve
// to the widths of the adjacent levels. At a local extremum the tangent is vertical.
function tangents(points) {
  const slopes = points.slice(1).map((point, index) => slope(points[index], point));
  return points.map((_, index) => {
    if (index === 0) return 0;
    const before = slopes[index - 1], after = slopes[index] ?? before;
    return before * after > 0 ? 2 * before * after / (before + after) : 0;
  });
}

const [, , , waist, abdomen, hips] = anatomyLevels;
const abdomenWeight = (abdomen.height - waist.height) / (hips.height - waist.height);
const regions = [...anatomyLevels.map(({id}) => id), 'base'];

export function adultBodyGeometry(key, [axis, chinY], structure = referenceStructure, corpulence = referenceCorpulence, beforeCorrection = false) {
  validateStructure(structure);
  const profile = adultBodies[key];
  const ground = {x: axis, y: 249};
  const neckY = chinY - 4;
  const height = ground.y - neckY;
  // The structural abdomen bridges the waist and the hips before applying corpulence.
  const abdomenScale = structure.waist + (structure.pelvis - structure.waist) * abdomenWeight;
  const scales = {...structure, abdomen: abdomenScale, hips: structure.pelvis};
  const levels = anatomyLevels.map((level, index) => ({
    ...level, y: neckY + level.height * height, width: profile.widths[index] * (scales[level.id] / 100)
  }));

  // The point on the lower flank controls the rounding. It is part of the
  // continuous pawn base and carries no anatomical landmark.
  const flank = {y: ground.y - 8, width: profile.baseWidth * (structure.base / 100)};
  const points = [...levels, flank];
  const dx = tangents(points);
  if (corpulence !== referenceCorpulence) {
    const {weight, widths} = beforeCorrection
      ? previousCorpulence(key, corpulence, [...profile.widths, profile.baseWidth], regions)
      : corpulenceEnvelope(key, corpulence, scales, regions);
    const envelope = points.map(({y}, index) => ({y, width:widths[index]}));
    const envelopeDx = tangents(envelope);
    // Both curves share the same vertical parameter. Interpolating both the
    // coordinates and the tangents softens the reliefs with increasing weight.
    const structureWeight = beforeCorrection ? 1 : 1 - weight;
    for (const [index, point] of points.entries()) {
      point.width = structureWeight * point.width + weight * envelope[index].width;
      dx[index] = structureWeight * dx[index] + weight * envelopeDx[index];
    }
  }
  const spans = points.slice(1).map((b, index) => {
    const a = points[index], step = (b.y - a.y) / 3;
    return {
      a, b,
      start: {width: a.width + dx[index] * step, y: a.y + step},
      end: {width: b.width - dx[index + 1] * step, y: b.y - step}
    };
  });

  const at = (side, {width, y}) => pair(axis + side * width, y);
  const cubic = (side, a, b, c) => `C${at(side, a)} ${at(side, b)} ${at(side, c)}`;
  const down = spans.map(({start, end, b}) => cubic(1, start, end, b));
  const up = spans.slice().reverse().map(({start, end, a}) => cubic(-1, end, start, a));
  const neck = levels[0];
  const baseY = ground.y - flank.y;
  const rim = {width: flank.width + dx.at(-1) * baseY * .7, y: flank.y + baseY * .7};
  const sole = {width: flank.width * .62, y: ground.y};

  const path = [
    `M${at(1, neck)}`, ...down,
    cubic(1, rim, sole, {width: 0, y: ground.y}),
    cubic(-1, sole, rim, flank), ...up,
    `C${pair(axis - neck.width, neckY - 4)} ${pair(axis + neck.width, neckY - 4)} ${at(1, neck)}Z`
  ].join(' ');

  return {levels, ground, height, path};
}

export function adultBodyMarkup(key, chin, {skin, contour}, structure, corpulence, beforeCorrection) {
  const {path} = adultBodyGeometry(key, chin, structure, corpulence, beforeCorrection);
  return `<g class="body-shape" data-adult-body="${key}"><path d="${path}" fill="${skin}" stroke="${contour}" stroke-width="4.2" stroke-linejoin="round"/></g>`;
}
