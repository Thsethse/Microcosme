import {contour} from '../bio-col-01/palette.mjs';
import {pointAt} from './bezier.mjs';
import {eyesFor} from './eyes.mjs';
import {seededIndex} from './draw.mjs';

// The inherited pigment is a pupil ellipse (1.9 × 2.2 semi-axes). Its
// area-equivalent radius supplies the reference in the absence of a drawn iris.
export const referenceRadius = Math.sqrt(1.9 * 2.2);
export const irisDrawVersion = 'iris-xoshiro128ss-v1';
export const irisControls = Object.freeze({
  irisSize: Object.freeze({label:'Taille de l’iris', min:60,max:140,step:1,neutral:100,unit:'%'}),
  irisRatio: Object.freeze({label:'Rapport largeur/hauteur', min:.75,max:1.25,step:.01,neutral:1,unit:''}),
  pupilSize: Object.freeze({label:'Taille de la pupille', min:15,max:80,step:1,neutral:45,unit:'%'}),
  outline: Object.freeze({label:'Contour de l’iris', min:0,max:10,step:1,neutral:5,unit:'%'}),
  secondarySize: Object.freeze({label:'Zone secondaire', min:0,max:80,step:1,neutral:50,unit:'%'})
});
export const pupilShapes = Object.freeze({
  circle:'Circulaire', vertical:'Fente verticale', horizontal:'Fente horizontale',
  diamond:'Losange', star:'Étoile à cinq branches', ring:'Anneau'
});
export const heterochromias = Object.freeze({none:'Aucune',complete:'Complète',central:'Centrale'});
const swatches = [
  ['brun-sombre','Brun sombre','#4c3226'], ['marron','Marron','#82532f'], ['noisette','Noisette','#9b864a'],
  ['ambre','Ambre','#c18b36'], ['vert','Vert','#748b58'], ['gris','Gris','#929da4'], ['bleu','Bleu','#638cae'],
  ['bleu-clair','Bleu clair','#a2c9df'], ['rouge','Rouge','#b73943'], ['rose','Rose','#df83b1'],
  ['violet','Violet','#9668bc'], ['turquoise','Turquoise','#40b9b5'], ['or','Or','#e8bb39'],
  ['argent','Argent','#d5dbe0'], ['orange','Orange','#ed873c'], ['blanc','Blanc','#f4f2e9']
];
export const irisPalette = Object.freeze(swatches.map(([id,label,fill], i) =>
  Object.freeze({id,label,fill,outline:contour(fill),family:i<8?'natural':'fantasy'})));
const colours = Object.fromEntries(irisPalette.map(colour=>[colour.id,colour]));
const axes = Object.entries(irisControls);
const grid = ({min,max,step}) => Array.from({length:Math.round((max-min)/step)+1},
  (_,i)=>+(min+i*step).toFixed(2));
const grids = Object.fromEntries(axes.map(([key,control])=>[key,grid(control)]));

export function normalizeIris(value) {
  if (value == null || value === 'historical') return null;
  if (typeof value !== 'object' || Array.isArray(value)) throw new TypeError('Réglages d’iris invalides.');
  const numeric = Object.fromEntries(axes.map(([key,{min,max,neutral}])=>[
    key,Number.isFinite(value[key])?Math.min(max,Math.max(min,value[key])):neutral
  ]));
  const presets = {pupilShape:pupilShapes,heterochromia:heterochromias,primary:colours,secondary:colours};
  const defaults = {pupilShape:'circle',heterochromia:'none',primary:'noisette',secondary:'bleu'};
  for (const [key,values] of Object.entries(presets)) {
    if (value[key] === undefined) continue;
    if (!Object.hasOwn(values,value[key])) throw new RangeError('Choix d’iris inconnu · '+key);
    defaults[key]=value[key];
  }
  return {...numeric,...defaults};
}

export function pigmentCenters(opening) {
  return opening.face.envelopes.map(({x,y,side})=>({x:x+side*.5,y:y+.3,side}));
}

function insidePolygon(points,x,y) {
  let inside=false;
  for (let i=0,j=points.length-1;i<points.length;j=i++) {
    const [ax,ay]=points[i], [bx,by]=points[j];
    if ((ay>y)!==(by>y) && x<(bx-ax)*(y-ay)/(by-ay)+ax) inside=!inside;
  }
  return inside;
}

export function irisAperture(opening) {
  const polygon = opening.shapes[0]?.curves.flatMap(curve =>
    Array.from({length:20},(_,i)=>pointAt(curve,i/20)));
  const [center] = pigmentCenters(opening);
  const {width,height} = opening.face.reference;
  return {
    // Samples classify usefulness. The renderer uses the original cubic or
    // ellipse as its real clip, including between the sampled points.
    visible(dx,dy) {
      const x=center.x-dx, y=center.y+dy;
      if (polygon) return insidePolygon(polygon,x,y);
      const a=opening.face.envelopes[0];
      return ((x-a.x)/(width/2))**2+((y-a.y)/(height/2))**2 < 1;
    }
  };
}

const ringHole=.56, slitWidth=.27, diamondWidth=.8;
const star = Array.from({length:10},(_,i)=>{
  const angle=-Math.PI/2+i*Math.PI/5, radius=i%2?.45:1;
  return [radius*Math.cos(angle),radius*Math.sin(angle)];
});
const angles = Array.from({length:72},(_,i)=>[Math.cos(i*Math.PI/36),Math.sin(i*Math.PI/36)]);

function pupilContains(shape,x,y,r) {
  const u=x/r,v=y/r,squared=u*u+v*v;
  switch(shape) {
    case 'circle': return squared<=1;
    case 'vertical': return (u/slitWidth)**2+v*v<=1;
    case 'horizontal': return u*u+(v/slitWidth)**2<=1;
    case 'diamond': return Math.abs(u)/diamondWidth+Math.abs(v)<=1;
    case 'star': return insidePolygon(star,u,v);
    case 'ring': return squared<=1&&squared>=ringHole**2;
  }
}

function minorFactor(ratio) {
  const scale=Math.sqrt(ratio);
  return Math.min(scale,1/scale);
}

function fitsPupil(ratio,outline,size) {
  // A common inscribed circle contains every one of the six silhouettes.
  return (outline+size)/100 <= minorFactor(ratio)+1e-12;
}

export function irisGeometry(values) {
  const radius=referenceRadius*values.irisSize/100;
  const stretch=Math.sqrt(values.irisRatio);
  const rx=radius*stretch,ry=radius/stretch,outline=radius*values.outline/100;
  return {radius,rx,ry,innerRx:rx-outline,innerRy:ry-outline,pupil:radius*values.pupilSize/100,
    highlightX:.51*rx,highlightY:-.50*ry,highlightRadius:.106*radius};
}

function visibleBand(aperture, values, geometry, end) {
  const {rx,ry,pupil,highlightX,highlightY,highlightRadius}=geometry;
  // Probe each one-percent annulus with two interior radii. This detects an
  // increment hidden by a ring pupil as well as the initial hidden disk.
  for (const level of [end-.2,end-.65]) {
    if (level<=0) continue;
    for (const [cos,sin] of angles) {
      const x=rx*level/100*cos,y=ry*level/100*sin;
      if (!pupilContains(values.pupilShape,x,y,pupil) &&
          (x-highlightX)**2+(y-highlightY)**2 > highlightRadius**2 && aperture.visible(x,y)) return true;
    }
  }
  return false;
}

function visibleSteps(aperture, values, geometry) {
  return grids.secondarySize.filter(s=>s===0 || visibleBand(aperture,values,geometry,s));
}

export function solveIris(opening, value, withDomains=false) {
  const requested=normalizeIris(value);
  if (!requested) return null;
  const effective={...requested};
  const limit=Math.min(80,100*minorFactor(requested.irisRatio)-requested.outline);
  effective.pupilSize=Math.min(requested.pupilSize,limit);
  if (effective.primary===effective.secondary) effective.heterochromia='none';
  const geometry=irisGeometry(effective);
  let secondaryDomain=[0];
  if (effective.heterochromia==='central') {
    const aperture=irisAperture(opening);
    secondaryDomain=visibleSteps(aperture,effective,geometry);
    if (!secondaryDomain.includes(effective.secondarySize) &&
        !(effective.secondarySize%1 && visibleBand(aperture,effective,geometry,effective.secondarySize))) {
      effective.secondarySize=secondaryDomain.filter(size=>size<=requested.secondarySize).at(-1);
    }
  } else effective.secondarySize=0;
  if (effective.heterochromia==='central' && effective.secondarySize===0) effective.heterochromia='none';
  if (effective.heterochromia==='none') effective.secondary=effective.primary;

  const domains=withDomains?{
    irisSize:grids.irisSize,
    irisRatio:grids.irisRatio.filter(ratio=>fitsPupil(ratio,effective.outline,effective.pupilSize)),
    outline:grids.outline.filter(outline=>fitsPupil(effective.irisRatio,outline,effective.pupilSize)),
    pupilSize:grids.pupilSize.filter(size=>fitsPupil(effective.irisRatio,effective.outline,size)),
    secondarySize:secondaryDomain
  }:null;
  return {requested,effective,geometry,domains};
}

export function irisFor(input, eyes, iris, withDomains=false) {
  return solveIris(eyesFor(input,eyes),iris,withDomains);
}

export function intervalsOf(points, step) {
  const intervals=[];
  for (const value of points) {
    const last=intervals.at(-1);
    if (last && Math.abs(last[1]+step-value)<1e-8) last[1]=value;
    else intervals.push([value,value]);
  }
  return intervals;
}

export function drawIris(input, eyes, seed) {
  if (typeof seed!=='string') throw new TypeError('Graine textuelle requise.');
  const next=seededIndex(irisDrawVersion+'\0'+seed);
  const choose=values=>values[next(values.length)];
  const opening=eyesFor(input,eyes), aperture=irisAperture(opening);
  const ids=Object.keys(colours);
  const heterochromia=choose(Object.keys(heterochromias));
  // Keep the chosen mode across retries. Central combinations with no visible
  // annulus are rejected before drawing uniformly among its useful sizes.
  for (let i=0;i<4096;i++) {
    const values={
      irisSize:choose(grids.irisSize),irisRatio:choose(grids.irisRatio),
      outline:choose(grids.outline),pupilShape:choose(Object.keys(pupilShapes)),
      primary:choose(ids),heterochromia
    };
    values.pupilSize=choose(grids.pupilSize.filter(size=>fitsPupil(values.irisRatio,values.outline,size)));
    values.secondary=values.heterochromia==='none'?values.primary:choose(ids.filter(id=>id!==values.primary));
    values.secondarySize=0;
    if (values.heterochromia==='central') {
      const sizes=visibleSteps(aperture,values,irisGeometry(values)).slice(1);
      if (!sizes.length) continue;
      values.secondarySize=choose(sizes);
    }
    return values;
  }
  throw new Error('Budget de tirage des iris dépassé. Essayez une autre graine.');
}

const pupilInk='#171713';
const ellipse=(x,y,rx,ry,fill)=>`<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="${fill}"/>`;
const polygon=(points,x,y,r)=>`<polygon points="${points.map(([u,v])=>[x+r*u,y+r*v].join(',')).join(' ')}" fill="${pupilInk}"/>`;
function pupilMarkup(shape,x,y,r) {
  switch(shape) {
    case 'circle':return ellipse(x,y,r,r,pupilInk);
    case 'vertical':return ellipse(x,y,r*slitWidth,r,pupilInk);
    case 'horizontal':return ellipse(x,y,r,r*slitWidth,pupilInk);
    case 'diamond':return polygon([[0,-1],[diamondWidth,0],[0,1],[-diamondWidth,0]],x,y,r);
    case 'star':return polygon(star,x,y,r);
    case 'ring': {
      const circle = radius => `M${x-radius},${y} a${radius},${radius} 0 1 0 ${2*radius},0 a${radius},${radius} 0 1 0 ${-2*radius},0Z`;
      return `<path d="${circle(r)} ${circle(r*ringHole)}" fill="${pupilInk}" fill-rule="evenodd"/>`;
    }
  }
}

export function irisMarkup(result, center, index) {
  const {effective,geometry}=result;
  const {x,y,side}=center;
  const {rx,ry,innerRx,innerRy,pupil,highlightX,highlightY,highlightRadius}=geometry;
  const id=index===1&&effective.heterochromia==='complete'?effective.secondary:effective.primary;
  const colour=colours[id];
  const rim=effective.outline ? ellipse(x,y,rx,ry,colour.outline):'';
  const secondary=effective.heterochromia==='central' ?
    `<g data-iris-secondary="">${ellipse(x,y,rx*effective.secondarySize/100,ry*effective.secondarySize/100,colours[effective.secondary].fill)}</g>`:'';
  const highlight=ellipse(x+side*highlightX,y+highlightY,highlightRadius,highlightRadius,'#fffaf0');
  return `<g data-bio-iris="${index===0?'left':'right'}" data-iris-colour="${id}">${rim}${ellipse(x,y,innerRx,innerRy,colour.fill)}${secondary}<g data-pupil-shape="${effective.pupilShape}">${pupilMarkup(effective.pupilShape,x,y,pupil)}</g>${highlight}</g>`;
}
