import {rgb} from '../bio-col-01/palette.mjs';
import {pointAt} from './bezier.mjs';
import {seededIndex} from './draw.mjs';
import {eyeStroke, eyesFor} from './eyes.mjs';

const axis = (label, min, max, neutral, step = 1, unit = '%') =>
  Object.freeze({label, min, max, neutral, step, unit});
const foldAxes = {
  count: axis('Nombre de plis', 0, 2, 1, 1, ''),
  distance: axis('Distance à l’œil', 0, 100, 34),
  length: axis('Longueur', 20, 100, 76),
  curve: axis('Courbure', 0, 100, 36),
  thickness: axis('Épaisseur', 10, 100, 33),
  intensity: axis('Intensité', 0, 100, 42)
};
export const detailControls = Object.freeze({
  upper: Object.freeze({...foldAxes}),
  lower: Object.freeze({...foldAxes, count: axis('Nombre de plis', 0, 2, 0, 1, '')}),
  lashes: Object.freeze({
    count: axis('Nombre de pointes', 0, 3, 1, 1, ''),
    length: axis('Longueur', 5, 15, 8),
    spacing: axis('Espacement', 0, 100, 48)
  }),
  shadows: Object.freeze({
    intensity: axis('Intensité des cernes', 0, 100, 0),
    width: axis('Largeur des cernes', 30, 100, 68),
    height: axis('Hauteur des cernes', 10, 100, 46),
    volume: axis('Volume des poches', 0, 100, 0),
    puffWidth: axis('Largeur des poches', 30, 100, 67)
  }),
  contours: Object.freeze({
    upper: axis('Contour supérieur', 50, 250, 115),
    lower: axis('Contour inférieur', 50, 200, 74)
  })
});
export const detailsDrawVersion = 'details-xoshiro128ss-v1';

const groups = Object.entries(detailControls);
const grids = Object.fromEntries(groups.map(([group, axes])=>[group,Object.fromEntries(
  Object.entries(axes).map(([key,{min,max,step}])=>[key,Array.from({length:(max-min)/step+1},(_,i)=>min+i*step)])
)]));
const clamp = (value, lo, hi) => Math.max(lo, Math.min(hi, value));
const ticks = Array.from({length:65},(_,i)=>i/64);

export function normalizeDetails(value) {
  if (value == null || value === 'historical') return null;
  if (typeof value !== 'object' || Array.isArray(value)) throw new TypeError('Détails des yeux invalides.');
  return Object.fromEntries(groups.map(([group, axes])=>[group,Object.fromEntries(
    Object.entries(axes).map(([key,{min,max,neutral,unit}])=>{
      const v=value[group]?.[key];
      return [key,Number.isFinite(v) ? clamp(unit ? v : Math.round(v),min,max) : neutral];
    })
  )]));
}

// Work in the temporal direction of the right eye. The same geometry is
// reflected about the existing left anchor, with common safe clearances.
export function detailFrame(opening) {
  const {envelopes:[left,right], nose, reference}=opening.face;
  const region={
    left:Math.max(right.left-right.x,left.x-left.right),
    right:Math.min(right.right-right.x,left.x-left.left),
    top:Math.max(right.top-right.y,left.top-left.y),
    bottom:Math.min(right.bottom-right.y,left.bottom-left.y),
    noseX:Math.max(nose.right-right.x,left.x-nose.left),
    noseY:Math.max(nose.top-right.y,nose.top-left.y)
  };
  const customized=opening.shapes[1];
  const arc = (dir, t) => {
    if (!customized) {
      const angle=Math.PI*t;
      return [-reference.width/2*Math.cos(angle),dir*reference.height/2*Math.sin(angle)];
    }
    const parameter=dir<0?t:1-t;
    const i=Math.min(1,Math.floor(parameter*2));
    const [x,y]=pointAt(customized.curves[(dir<0?0:2)+i],2*parameter-i);
    return [x-right.x,y-right.y];
  };
  const upper=ticks.map(t=>arc(-1,t)), lower=ticks.map(t=>arc(1,t));
  const [lo,hi]=customized?customized.bounds[0].map((x,i)=>x-right.x+(i?-1:1)*eyeStroke/2):
    [-reference.width/2,reference.width/2];
  return {region,arc,upper,lower,lo,hi,width:hi-lo,envelopes:[left,right]};
}

function rayRoom({left,right,top,bottom,noseX,noseY},p,v) {
  const [x,y]=p, [dx,dy]=v;
  let limit=Math.min(
    dx>0?(right-x)/dx:dx<0?(left-x)/dx:Infinity,
    dy>0?(bottom-y)/dy:dy<0?(top-y)/dy:Infinity
  );
  // Intersection of the ray with the reserved nose quadrant.
  const enterX=dx<0?(noseX-x)/dx:x<=noseX?-Infinity:Infinity;
  const leaveX=dx>0?(noseX-x)/dx:Infinity;
  const enterY=dy>0?(noseY-y)/dy:y>=noseY?-Infinity:Infinity;
  const leaveY=dy<0?(noseY-y)/dy:Infinity;
  const enter=Math.max(0,enterX,enterY);
  if (enter<=Math.min(leaveX,leaveY)) limit=Math.min(limit,enter);
  return Math.max(0,limit);
}

const unit = ([x,y]) => {const d=Math.hypot(x,y);return [x/d,y/d];};
const cornerWidth = eyeStroke*.42;
const clearance = .055;
function contourWeight(t) {
  return Math.sin(Math.PI*t)**.7 * (.79+.21*t);
}
function contourDepth(t, value) {
  const weight=contourWeight(t);
  return cornerWidth*(1-weight)+eyeStroke*value/100*weight;
}
function contourRoom(frame, point) {
  return Math.max(0,rayRoom(frame.region,point,unit(point))-clearance);
}
function normalIncidence(frame, dir, t, point) {
  const incidence=side=>{
    const a=frame.arc(side,Math.max(0,t-.001)), b=frame.arc(side,Math.min(1,t+.001));
    const [dx,dy]=unit([b[0]-a[0],b[1]-a[1]]);
    const [x,y]=unit(point);
    return Math.abs(dy*x-dx*y);
  };
  const projected=incidence(dir);
  // Use the same join at both ends, where the tangent changes sides.
  const joined=t===0||t===1?Math.min(projected,incidence(-dir)):projected;
  return Math.max(.30,joined);
}
function fittedDepth(frame, dir, point, t, value) {
  return Math.min(contourDepth(t,value)/normalIncidence(frame,dir,t,point),contourRoom(frame,point));
}
function contourMaximum(frame, dir) {
  const points=dir<0?frame.upper:frame.lower;
  const maximum=dir<0?250:200;
  const limits=points.slice(12,55).map((point,i)=>{
    const t=ticks[i+12], weight=contourWeight(t);
    const room=contourRoom(frame,point)*normalIncidence(frame,dir,t,point);
    return 100*(room-cornerWidth*(1-weight))/(eyeStroke*weight);
  }).sort((a,b)=>a-b);
  // A tight brow can shorten the local band without erasing the effect
  // along the rest of the arc. Keep at least half the main span responsive.
  return clamp(limits[Math.floor(limits.length/2)],50,maximum);
}

function lashCenters(count, spacing) {
  if (count===0) return [];
  if (count===1) return [.83];
  const step=.077+.047*spacing/100;
  return Array.from({length:count},(_,i)=>.804+(i-(count-1)/2)*step);
}
const rootIn=.043, rootOut=.032;
function lashWeight(t, center) {
  const root=t<center?rootIn:rootOut;
  return Math.max(0,1-Math.abs(t-center)/root)**2;
}
function lashTicks(centers) {
  return [...new Set([...ticks,...centers.flatMap(center=>[center-rootIn,center,center+rootOut])])].sort((a,b)=>a-b);
}
function lashMaximum(frame, contour, centers) {
  if (centers.some(t=>frame.arc(-1,t)[0]<=0)) return 0;
  const probes=centers.flatMap(center=>[center,...ticks.filter(t=>t>center-rootIn&&t<center+rootOut)]);
  return probes.reduce((cap,t)=>{
    const weight=Math.max(...centers.map(center=>lashWeight(t,center)));
    if (weight<1e-9) return cap;
    const p=frame.arc(-1,t);
    const usable=contourRoom(frame,p)-fittedDepth(frame,-1,p,t,contour);
    return Math.min(cap,100*usable/(weight*frame.width));
  },15);
}
function lashOptions(frame, contour, count, spacing, withSpacing = true) {
  if (count<2) {
    const maximum=count===1?lashMaximum(frame,contour,lashCenters(count,0)):0;
    return {spacing:[], maximum};
  }
  const cap = value=>lashMaximum(frame,contour,lashCenters(count,value));
  const current=cap(spacing);
  if (current>=5&&!withSpacing) return {spacing:[],closest:spacing,maximum:current};
  const options=grids.lashes.spacing.map(value=>({value,limit:cap(value)})).filter(entry=>entry.limit>=5);
  if (!options.length) return {spacing:[],maximum:0};
  const closest=current>=5?spacing:options.reduce((a,b)=>Math.abs(b.value-spacing)<Math.abs(a.value-spacing)?b:a).value;
  return {spacing:options.map(entry=>entry.value),options,closest,maximum:closest===spacing?current:cap(closest)};
}

function outerArc(frame, dir, value, lashes = null) {
  const centers=dir<0&&lashes?lashCenters(lashes.count,lashes.spacing):[];
  const tValues=centers.length?lashTicks(centers):ticks;
  return tValues.map(t=>{
    const p=frame.arc(dir,t), direction=unit(p);
    const flare=centers.reduce((extra,center)=>extra+lashWeight(t,center),0)*frame.width*(lashes?.length??0)/100;
    const depth=fittedDepth(frame,dir,p,t,value)+flare;
    return [p[0]+direction[0]*depth,p[1]+direction[1]*depth];
  });
}

function verticalRange(polygon,x) {
  let top=Infinity,bottom=-Infinity;
  for (let i=0,j=polygon.length-1;i<polygon.length;j=i++) {
    const [a,y]=polygon[j], [b,z]=polygon[i];
    if ((a<=x&&x<b)||(b<=x&&x<a)) {
      const hit=y+(z-y)*(x-a)/(b-a);
      top=Math.min(top,hit);
      bottom=Math.max(bottom,hit);
    }
  }
  return [top,bottom];
}

function runWindow(frame, polygon, dir, lashes) {
  const {region,lo,width}=frame;
  // Leave the corner transitions clear. The superior folds end before the
  // first lash root, even when the requested length is maximal.
  const firstRoot=dir<0&&lashes.count?frame.arc(-1,lashCenters(lashes.count,lashes.spacing)[0]-rootIn)[0]:Infinity;
  const start=lo+width*.105, end=Math.min(lo+width*.895,firstRoot-.13);
  const profile=x=>verticalRange(polygon,x)[dir<0?0:1];
  const ceiling=x=>dir<0?region.top:(x<region.noseX?Math.min(region.bottom,region.noseY):region.bottom);
  const candidates = [];
  let run=[];
  for (const t of ticks) {
    const x=start+(end-start)*t;
    const room=dir*(ceiling(x)-profile(x))-.14;
    if (room>=.42&&end>start) run.push({x,room});
    else if (run.length) {candidates.push(run);run=[];}
  }
  if (run.length) candidates.push(run);
  const best=candidates.sort((a,b)=>b.length-a.length)[0];
  if (!best||best.length<9) return null;
  const height=Math.min(width*(dir<0?.29:.35),...best.map(p=>p.room));
  return {left:best[0].x,right:best.at(-1).x,height,profile,dir};
}

function foldCount(window) {
  if (!window) return 0;
  return window.height>=.90?2:1;
}
const below=(list,max)=>list.filter(value=>value<=max+1e-10);
const fields=(values, enabled, keys)=>Object.fromEntries(keys.map(key=>[key,enabled?values[key]:null]));
const countDomain=max=>Array.from({length:max+1},(_,i)=>i);
function lashSetup(frame, contours, requested, withDomains) {
  const compute=count=>lashOptions(frame,contours.upper,count,requested.spacing,withDomains);
  let applied=compute(requested.count), count=requested.count;
  while (count>0&&applied.maximum<5) applied=compute(--count);
  const effective={count,length:count?Math.min(requested.length,applied.maximum):null,
    spacing:count>=2?applied.closest:null};
  const direct=withDomains?[0,...[1,2,3].filter(n=>(n===count?applied:compute(n)).maximum>=5)]:[];
  return {effective,domains:withDomains?{count:direct,length:count?below(grids.lashes.length,applied.maximum):[],
    spacing:applied.options?.filter(entry=>entry.limit>=effective.length-1e-9).map(entry=>entry.value)??[]}:null};
}

function makeScene(frame, contours, lashes) {
  const polygon=[...outerArc(frame,-1,contours.upper,lashes),...outerArc(frame,1,contours.lower).reverse()];
  return {polygon, upper:runWindow(frame,polygon,-1,lashes),lower:runWindow(frame,polygon,1,lashes)};
}

export function solveDetails(opening, value, withDomains = false) {
  const requested=normalizeDetails(value);
  if (!requested) return null;
  const frame=detailFrame(opening);
  const max={upper:contourMaximum(frame,-1),lower:contourMaximum(frame,1)};
  const contours={upper:Math.min(requested.contours.upper,max.upper),lower:Math.min(requested.contours.lower,max.lower)};
  const lashes=lashSetup(frame,contours,requested.lashes,withDomains);
  const scene=makeScene(frame,contours,lashes.effective);
  const effective={contours,lashes:lashes.effective};
  const domains=withDomains?{contours:{upper:below(grids.contours.upper,max.upper),lower:below(grids.contours.lower,max.lower)},
    lashes:lashes.domains}:null;
  for (const key of ['upper','lower']) {
    const limit=foldCount(scene[key]);
    const count=Math.min(requested[key].count,limit), intensity=count?requested[key].intensity:null;
    const active=!!(count&&intensity);
    const geometry=['distance','length','curve','thickness'];
    effective[key]={count,intensity,...fields(requested[key],active,geometry)};
    if (domains) domains[key]={count:countDomain(limit),intensity:count?grids[key].intensity:[],
      ...Object.fromEntries(geometry.map(axis=>[axis,active?grids[key][axis]:[]]))};
  }
  const hasLower=!!scene.lower, {shadows}=requested;
  effective.shadows={intensity:hasLower?shadows.intensity:0,volume:hasLower?shadows.volume:0,
    ...fields(shadows,hasLower&&shadows.intensity,['width','height']),
    ...fields(shadows,hasLower&&shadows.volume,['puffWidth'])};
  if (domains) domains.shadows=Object.fromEntries(Object.keys(detailControls.shadows)
    .map(key=>[key,hasLower&&effective.shadows[key]!==null?grids.shadows[key]:[]]));
  return {requested,effective,domains,frame,scene};
}

export function detailsFor(input, eyes, value, withDomains = false) {
  return solveDetails(eyesFor(input,eyes),value,withDomains);
}

export function drawDetails(input, eyes, seed) {
  if (typeof seed!=='string') throw new TypeError('Graine textuelle requise.');
  const next=seededIndex(detailsDrawVersion+'\0'+seed);
  const choose=domain=>domain[next(domain.length)];
  const frame=detailFrame(eyesFor(input,eyes)), result=normalizeDetails({});
  result.contours={upper:choose(below(grids.contours.upper,contourMaximum(frame,-1))),
    lower:choose(below(grids.contours.lower,contourMaximum(frame,1)))};
  const available=[1,2,3].map(n=>lashOptions(frame,result.contours.upper,n,0));
  const count=choose([0,...[1,2,3].filter(n=>available[n-1].maximum>=5)]);
  result.lashes.count=count;
  if (count>=2) result.lashes.spacing=choose(available[count-1].spacing);
  if (count) {
    const maximum=lashMaximum(frame,result.contours.upper,lashCenters(count,result.lashes.spacing));
    result.lashes.length=choose(below(grids.lashes.length,maximum));
  }
  const scene=makeScene(frame,result.contours,result.lashes);
  for (const key of ['upper','lower']) {
    const count=choose(countDomain(foldCount(scene[key])));
    result[key].count=count;
    if (!count) continue;
    for (const axis of ['intensity','distance','length','curve','thickness']) result[key][axis]=choose(grids[key][axis]);
  }
  if (scene.lower) {
    for (const key of ['intensity','volume','width','height','puffWidth']) result.shadows[key]=choose(grids.shadows[key]);
  }
  return result;
}

export function skinDetailColour(skin, strength, desaturate) {
  const channels=rgb(skin).map(c=>c*255);
  const mean=channels[0]*.25+channels[1]*.6+channels[2]*.15;
  const shadow=channels.map(c=>+((c+(mean-c)*desaturate*strength)*(1-strength)).toFixed(3));
  return 'rgb('+shadow.join(',')+')';
}
const bandTicks=Array.from({length:29},(_,i)=>i/28);
function ribbon(window, span, center, position, thickness) {
  const width=window.right-window.left, left=window.left+width*center-width*span/2;
  const near=[], far=[];
  for (const t of bandTicks) {
    const x=left+width*span*t, y=window.profile(x), swell=Math.sin(Math.PI*t)**.72;
    const depth=position(swell);
    near.push([x,y+window.dir*window.height*depth]);
    far.push([x,y+window.dir*window.height*(depth+thickness*swell)]);
  }
  return [...near,...far.reverse()];
}

function folds(window, value, skin, upper) {
  if (!value.intensity) return [];
  const span=value.length/100, center=upper?.5+.21*(1-span):.5;
  const colour=skinDetailColour(skin,.37*value.intensity/100,.18);
  return Array.from({length:value.count},(_,i)=>({
    name:upper?'upper-fold':'lower-fold', colour,
    points:ribbon(window,span,center,swell=>.11+.33*value.distance/100+.13*value.curve/100*swell+.24*i,
      .165*value.thickness/100)
  }));
}
function shading(window, value, skin) {
  const result=[];
  if (value.intensity) result.push({name:'dark-circle',colour:skinDetailColour(skin,.21*value.intensity/100,.48),
    points:ribbon(window,value.width/100,.5,()=>.065,.29*value.height/100)});
  if (value.volume) result.push({name:'puff',colour:skinDetailColour(skin,.24*(value.volume/100)**.7,.11),
    points:ribbon(window,value.puffWidth/100,.5,swell=>.23+.09*swell,.48*value.volume/100)});
  return result;
}

// The nose solver uses these painted footprints before its own rendering.
export function detailContourEdges({frame, effective:{contours}}) {
  return {upper: outerArc(frame, -1, contours.upper), lower: outerArc(frame, 1, contours.lower)};
}

export function detailFootprints(result) {
  if (!result) return [];
  const {frame,scene,effective}=result;
  const shapes=[scene.polygon,...shading(scene.lower,effective.shadows,'#dbbf88').map(mark=>mark.points),
    ...folds(scene.lower,effective.lower,'#dbbf88',false).map(mark=>mark.points),
    ...folds(scene.upper,effective.upper,'#dbbf88',true).map(mark=>mark.points)];
  return frame.envelopes.flatMap(eye=>shapes.map(points=> {
    const xx=points.map(([x])=>eye.x+eye.side*x), yy=points.map(([,y])=>eye.y+y);
    return {left:Math.min(...xx),right:Math.max(...xx),top:Math.min(...yy),bottom:Math.max(...yy)};
  }));
}

function plot(points, eye) {
  return 'M'+points.map(([x,y])=>[eye.x+eye.side*x,eye.y+y].map(n=>+n.toFixed(5)).join(',')).join('L')+'Z';
}

export function detailsMarkup(result, index, aperture, instance, skin) {
  const {frame,scene,effective}=result, eye=frame.envelopes[index];
  const {left,right,top,bottom,noseX,noseY}=frame.region;
  const notchX=clamp(noseX,left,right), notchY=clamp(noseY,top,bottom);
  const box=plot([[left,top],[right,top],[right,bottom],[notchX,bottom],[notchX,notchY],[left,notchY]],eye);
  const id='details-'+instance;
  const details=[...shading(scene.lower,effective.shadows,skin),
    ...folds(scene.lower,effective.lower,skin,false),...folds(scene.upper,effective.upper,skin,true)];
  const marks=details.map(mark=>`<path data-eye-detail="${mark.name}" d="${plot(mark.points,eye)}" fill="${mark.colour}"/>`).join('');
  const contour=plot(scene.polygon,eye);
  // Intersect the conservative eye region with the complement of the
  // opening. Both are geometric clips, including on Safari.
  return `<g data-bio-details="${index===0?'left':'right'}"><defs><clipPath id="${id}-safe"><path d="${box}"/></clipPath><clipPath id="${id}-outside"><path clip-rule="evenodd" d="${box} ${aperture}"/></clipPath></defs><g clip-path="url(#${id}-safe)"><g clip-path="url(#${id}-outside)">${marks}<path data-eye-detail="contour" data-lash-count="${effective.lashes.count}" d="${contour}" fill="#171713"/></g></g></g>`;
}
