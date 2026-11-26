import {referenceStructure, validateStructure} from './body-structure.mjs';
import {corpulenceEnvelope, previousCorpulence, referenceCorpulence} from './body-corpulence.mjs';
import {chestGeometry, chestMarkup} from './chest.mjs';
import {previousChestMarkup} from './chest-before.mjs';

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

// The horizontal controls of the cubic cropped to [lo, hi] bound the entire
// span. Its vertical coordinate is linear in t for all anatomical spans.
function sliceSpan({a,start,end,b}, from, to) {
  const lo = (from-a.y)/(b.y-a.y), hi = (to-a.y)/(b.y-a.y);
  const x0=a.width, x1=start.width, x2=end.width, x3=b.width;
  const at=t=>x0*(1-t)**3+3*x1*t*(1-t)**2+3*x2*t*t*(1-t)+x3*t**3;
  const thirdSlope=t=>(x1-x0)*(1-t)**2+2*(x2-x1)*t*(1-t)+(x3-x2)*t*t;
  return [at(lo), at(lo)+thirdSlope(lo)*(hi-lo), at(hi)-thirdSlope(hi)*(hi-lo), at(hi)];
}

function minimumWidth(spans, from, to) {
  return Math.min(...spans.filter(({a,b})=>a.y<=to && b.y>=from).flatMap(span=>
    sliceSpan(span,Math.max(from,span.a.y),Math.min(to,span.b.y))));
}

function chestDisplacement(y, spans, slopes) {
  if (y<=spans[0].y || y>=spans.at(-1).y) return [0,0];
  const end=spans.findIndex(point=>point.y>=y);
  const a=spans[end-1], b=spans[end], length=b.y-a.y;
  const t=(y-a.y)/length, k=t*(1-t);
  const m0=slopes[end-1], m1=slopes[end];
  return [a.width+(b.width-a.width)*t*t*(3-2*t)+length*k*(m0*(1-t)-m1*t),
    (b.width-a.width)*6*k/length + m0*(1-4*t+3*t*t)+m1*(3*t*t-2*t)];
}

function expandedSpans(spans,profile) {
  if (!profile.amplitude) return spans;
  const {start,rise,peak,end,amplitude}=profile;
  const expansion=[{y:start,width:0},{y:rise,width:.82*amplitude},{y:peak,width:amplitude},{y:end,width:0}];
  const slopes=tangents(expansion);
  slopes[slopes.length-1]=0;
  return spans.flatMap(span=>{
    const {a,b}=span;
    if (b.y<=start || a.y>=end) return [span];
    const stops=[a.y,...expansion.map(({y})=>y).filter(y=>y>a.y && y<b.y),b.y];
    return stops.slice(1).map((to,index)=>{
      const from=stops[index], step=(to-from)/3;
      const [startShift,startSlope]=chestDisplacement(from,expansion,slopes);
      const [endShift,endSlope]=chestDisplacement(to,expansion,slopes);
      const [x0,x1,x2,x3]=sliceSpan(span,from,to);
      return {a:{y:from,width:x0+startShift}, start:{y:from+step,width:x1+startShift+step*startSlope},
        end:{y:to-step,width:x2+endShift-step*endSlope}, b:{y:to,width:x3+endShift}};
    });
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
  const neck = levels[0];
  const baseY = ground.y - flank.y;
  const rim = {width: flank.width + dx.at(-1) * baseY * .7, y: flank.y + baseY * .7};
  const sole = {width: flank.width * .62, y: ground.y};

  const outline = sides=>[
    `M${at(1, neck)}`, ...sides.map(({start,end,b})=>cubic(1,start,end,b)),
    cubic(1, rim, sole, {width: 0, y: ground.y}),
    cubic(-1, sole, rim, flank), ...sides.slice().reverse().map(({start,end,a})=>cubic(-1,end,start,a)),
    `C${pair(axis - neck.width, neckY - 4)} ${pair(axis + neck.width, neckY - 4)} ${at(1, neck)}Z`
  ].join(' ');

  return {levels, ground, height, path:outline(spans), minimumWidth:(from,to)=>minimumWidth(spans,from,to),
    exteriorPath:profile=>outline(expandedSpans(spans,profile))};
}

export function adultBodyMarkup(key, chin, {skin, contour}, structure, corpulence, beforeCorrection,
    {chest, chestStudySkin = skin, beforeChestCorrection, clipId} = {}) {
  const body = adultBodyGeometry(key, chin, structure, corpulence, beforeCorrection);
  const start=`<g class="body-shape" data-adult-body="${key}">`;
  const perimeter=(path,fill)=>`<path d="${path}" fill="${fill}" stroke="${contour}" stroke-width="4.2" stroke-linejoin="round"/>`;
  const baseline=start+perimeter(body.path,skin)+'</g>';
  if (key!=='adult-f' || !chest?.volume) return baseline;
  if (beforeChestCorrection) return baseline+previousChestMarkup(body,{...chest,divergence:0,position:52},corpulence,chestStudySkin);
  const shape=chestGeometry(body,chest,corpulence);
  const path=shape.profile.amplitude ? body.exteriorPath(shape.profile) : body.path;
  const clip=clipId(path);
  return `${start}<path d="${path}" fill="${skin}"/><defs><clipPath id="${clip}"><path d="${path}"/></clipPath></defs>${
    chestMarkup(shape,chestStudySkin,clip)}${perimeter(path,'none')}</g>`;
}
