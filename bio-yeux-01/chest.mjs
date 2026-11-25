import {rgb} from '../bio-col-01/palette.mjs';

export const chestControls = Object.freeze({
  volume: {label:'Volume', min:0, max:100, neutral:0},
  width: {label:'Largeur', min:0, max:100, neutral:50},
  length: {label:'Allongement', min:0, max:100, neutral:46},
  roundness: {label:'Rondeur', min:0, max:100, neutral:62},
  spacing: {label:'Écartement', min:0, max:100, neutral:43},
  divergence: {label:'Divergence', min:-100, max:100, neutral:0},
  position: {label:'Position verticale', min:0, max:100, neutral:52},
  sag: {label:'Affaissement', min:0, max:100, neutral:24}
});
const axes = Object.entries(chestControls);
export const referenceChest = Object.freeze(Object.fromEntries(axes.map(([key, {neutral}])=>[key,neutral])));
export const chestPresets = Object.freeze([
  ['round', 'Arrondie', {width:76, length:28, roundness:94, spacing:38, divergence:0, position:61, sag:12}],
  ['drop', 'En goutte', {width:56, length:57, roundness:78, spacing:42, divergence:8, position:55, sag:56}],
  ['long', 'Allongée', {width:23, length:98, roundness:57, spacing:44, divergence:-8, position:53, sag:33}],
  ['cone', 'Conique', {width:46, length:44, roundness:4, spacing:38, divergence:11, position:62, sag:8}],
  ['divergent', 'Divergente', {width:55, length:52, roundness:65, spacing:74, divergence:90, position:57, sag:38}],
  ['low', 'Affaissée', {width:68, length:58, roundness:64, spacing:48, divergence:18, position:47, sag:96}]
]);

export function validateChest(values) {
  if (!values || Object.keys(values).length !== axes.length || axes.some(([key,{min,max}])=>
    !Object.hasOwn(values,key) || !Number.isFinite(values[key]) || values[key]<min || values[key]>max)) {
    throw new RangeError('Les huit réglages de poitrine doivent respecter leurs domaines.');
  }
  return values;
}

// The vertical root stays independent of volume and sag. Horizontal room is
// shared between the two footprints and their interval at every setting.
export function chestGeometry(body, values, corpulence = 50) {
  const {volume,width,length,roundness,spacing,divergence,position,sag} = validateChest(values);
  if (volume === 0) return null;
  const fullness = corpulence / 100;
  const mass = (volume / 100) ** .56 * (.87 + .13 * fullness);
  const shoulder = body.levels[1].y, thorax = body.levels[2].y;
  const anchor = shoulder + (.72 - .40 * position/100) * (thorax - shoulder);
  const depth = body.height * mass * (.108 + .087 * length/100 + .055 * sag/100);
  const available = body.minimumWidth(anchor - .10 * depth, anchor + 1.02 * depth) - 2.3;
  const r = roundness/100, s = sag/100, tilt = divergence/100;
  const outline = [
    [-.51,.14], [-.08,0], [.48+.23*r-.15*s,.12+.09*s],
    [.91,.43+.20*s-.14*r], [.49+.30*r,.74+.08*s],
    [.03+.11*(1-r),.94], [-.47-.31*r+.08*s,.73+.10*s], [-.88,.42+.16*s]
  ];
  const segments = outline.map((point,index)=>{
    const previous = outline[(index+7)%8], next = outline[(index+1)%8], following = outline[(index+2)%8];
    const tangent = .14 + .035 * r + .014 * fullness;
    return [point.map((value,i)=>value+tangent*(next[i]-previous[i])),
      next.map((value,i)=>value-tangent*(following[i]-point[i])), next];
  });
  const lateral = [[.43+.19*tilt,.59+.06*s],[.43+.14*tilt,.36+.12*s],outline[2]];
  const underside = [[-.24,.79],[.49,.71+.06*s],outline[3]];
  const shear = ([x,y])=>x + .27 * tilt * (y-.2);
  const extents = [...segments.flat(), ...lateral, ...underside].map(shear);
  const left = Math.min(...extents), right = Math.max(...extents);
  const capacity = (available-.65)/(right-left);
  const preferredHalf = body.height * (.04 + .082 * width/100) * mass ** .85;
  // As the room narrows, compress the preferred width smoothly. This keeps
  // the slider effective and lets individual volume dominate a broad torso.
  const half = preferredHalf / Math.hypot(1,preferredHalf/capacity);
  const inner = .65-left*half;
  const outer = available-right*half;
  const center = inner + (outer-inner) * (.065 + .76 * spacing/100) ** 1.32;
  const lobes = [-1,1].map(side=>{
    const project = offset=>[body.ground.x + side * (center + half * shear(offset)), anchor + depth*offset[1]];
    return {base:outline.map(project), segments:segments.map(points=>points.map(project)),
      lateral:lateral.map(project), underside:underside.map(project)};
  });
  return {anchor, depth, center, half, available, fullness, lobes};
}

const point = ([x,y])=>`${Number(x.toFixed(3))},${Number(y.toFixed(3))}`;
const bezier = segment=>'C'+segment.map(point).join(' ');
const trace = (start,segments)=>'M'+point(start)+segments.map(bezier).join('');
const blend = (skin, tint, weight)=>'#'+rgb(skin).map((value,i)=>
  Math.round(255*(value*(1-weight)+tint[i]*weight)).toString(16).padStart(2,'0')).join('');

export function chestMarkup(body, chest, corpulence, skin) {
  const shape = chestGeometry(body,chest,corpulence);
  if (!shape) return '';
  const lift = blend(skin,[1,.94,.78],.14-.042*shape.fullness);
  const side = blend(skin,[.22,.11,.09],.13-.035*shape.fullness);
  const shadow = blend(skin,[.22,.11,.09],.285-.05*shape.fullness);
  const line = .82-.24*shape.fullness;
  return `<g data-chest="adult-f" aria-hidden="true">${shape.lobes.map(({base,segments,lateral,underside})=>
    `<path d="${trace(base[0],segments)}Z" fill="${lift}"/>`+
    `<path d="${trace(base[2],[...segments.slice(2,4),lateral])}Z" fill="${side}"/>`+
    `<path d="${trace(base[3],[...segments.slice(3,6),underside])}Z" fill="${shadow}"/>`+
    `<path d="${trace(base[4],segments.slice(4,6))}" fill="none" stroke="${shadow}" stroke-width="${line}" stroke-linecap="round"/>`
  ).join('')}</g>`;
}
