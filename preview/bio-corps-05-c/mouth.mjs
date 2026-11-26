import {rgb} from '../bio-col-01/palette.mjs';
import {model} from '../bio-vis-p5-i6/model.mjs';
import {palette} from '../bio-vis-p5-i6/i5/i4/i3/i2/i1/base/r1/p2/base/model.mjs';
import {headMarkup} from '../bio-vis-p5-i6/i5/i4/i3/i2/i1/base/r1/p2/base/render.mjs';
import {bounds, extrema, outlineCurves, stripX} from './bezier.mjs';
import {seededIndex} from './draw.mjs';
import {eyesFor} from './eyes.mjs';
import {pigmentCenters} from './iris.mjs';

const axis = (label,min,max,neutral) => Object.freeze({label,min,max,neutral});
export const mouthControls = Object.freeze({
  width:axis('Largeur',60,130,100),
  upper:axis('Volume supérieur',0,200,100),
  lower:axis('Volume inférieur',0,200,100),
  cupid:axis('Arc de Cupidon',0,100,45),
  peaks:axis('Écartement des sommets',15,55,35),
  corners:axis('Hauteur des commissures',-100,100,0),
  curvature:axis('Courbure de séparation',-100,100,0),
  intensity:axis('Intensité chromatique',0,100,55),
  thickness:axis('Épaisseur de séparation',50,200,100)
});
const example = (label,values) => Object.freeze({label,values:Object.freeze(values)});
export const mouthPresets = Object.freeze({
  fine:example('Fine',{upper:25,lower:34,thickness:79,intensity:54,cupid:34}),
  full:example('Charnue',{width:100,upper:173,lower:174,thickness:77,intensity:68,cupid:37}),
  wide:example('Large',{width:130,upper:84,lower:85,cupid:36,thickness:91}),
  small:example('Petite',{width:65,upper:56,lower:65,thickness:82,cupid:44}),
  upper:example('Supérieure dominante',{upper:169,lower:42,cupid:48,intensity:66}),
  lower:example('Inférieure dominante',{upper:41,lower:170,cupid:42,intensity:63}),
  cupid:example('Arc de Cupidon marqué',{upper:156,lower:74,cupid:100,peaks:28,intensity:66}),
  raised:example('Commissures relevées',{corners:88,upper:76,lower:90,curvature:6,intensity:54}),
  lowered:example('Commissures abaissées',{corners:-89,upper:77,lower:85,curvature:8,intensity:56})
});
export const mouthDrawVersion = 'mouth-xoshiro128ss-v1';
export class MouthFitError extends Error {
  constructor() {
    super('L’enveloppe ne permet aucune bouche personnalisée à l’ancrage actuel. Arbitrage anatomique requis.');
    this.name='MouthFitError';
  }
}

const axes=Object.entries(mouthControls);
const grids=Object.fromEntries(axes.map(([key,{min,max}])=>[key,Array.from({length:max-min+1},(_,i)=>min+i)]));
const clamp=(v,lo,hi)=>Math.min(hi,Math.max(lo,v));
const precision=1e-9;
const reserve=.00001;
const legacyStroke=1.9;
const empty={width:60,upper:0,lower:0,corners:0,curvature:0,thickness:50};
const recoveryOrder=['width','thickness','corners','curvature','upper','lower'];

export function normalizeMouth(mouth) {
  if (mouth==null||mouth==='historical') return null;
  if (typeof mouth!=='object'||Array.isArray(mouth)) throw new TypeError('Réglages de bouche invalides.');
  return Object.fromEntries(axes.map(([key,{min,max,neutral}])=>
    [key,Number.isFinite(mouth[key])?clamp(mouth[key],min,max):neutral]));
}

// The approved lineage renders a filled triangle. Read its actual path and
// painted extents. Future nose geometry can supply the same painted bounds.
export function inheritedNose(face, markup=headMarkup(face.base)) {
  const [anchorX,anchorY]=face.base.anchors.nose;
  const matches=[...markup.matchAll(/<path d="M([^, ]+),([^ ]+) l([^, ]+),([^ ]+) h([^ ]+)Z" fill="[^"]+" stroke="none"[^>]*\/>/g)]
    .map(([tag,...coordinates])=>({tag,coordinates:coordinates.map(Number)}))
    .filter(({coordinates:[x,y,dx,dy,length]})=>x===anchorX&&y<anchorY&&dx<0&&dy>0&&length>0);
  if (matches.length!==1) throw new Error('Limites du nez hérité introuvables. Arbitrage anatomique requis.');
  const {tag,coordinates:[x,y,dx,dy,length]}=matches[0];
  return {tag,bounds:{left:x+dx,right:x+dx+length,top:y,bottom:y+dy}};
}

export function inheritedNoseBounds(face, markup) {
  return inheritedNose(face,markup).bounds;
}

export function inheritedMouth(face, markup=headMarkup(face.base)) {
  const [mx,my]=face.base.anchors.mouth;
  const start=mx-face.base.head.rx*.25;
  const candidates=[...markup.matchAll(/<path d="M([^, ]+),([^ ]+) Q([^, ]+),([^ ]+) ([^, ]+),([^"]+)" fill="none" stroke="[^"]+" stroke-width="([^"]+)"[^>]*\/>/g)]
    .filter(match=>Number(match[1])===start&&Number(match[2])===my-1&&Number(match[5])>mx);
  if (candidates.length!==1) throw new Error('Bouche historique introuvable.');
  const [tag,...values]=candidates[0];
  const [x,y,qx,qy,endX,endY,stroke]=values.map(Number);
  const curve=[[x,y],[x+(qx-x)*2/3,y+(qy-y)*2/3],
    [endX+(qx-endX)*2/3,endY+(qy-endY)*2/3],[endX,endY]];
  return {tag,curve,stroke};
}

export function mouthFrame(face,opening,options={}) {
  const {head:{rx,ry},anchors:{mouth:[x,y]}}=face.base;
  const nose=options.noseBounds??inheritedNoseBounds(face,options.markup);
  if (!['left','right','top','bottom'].every(k=>Number.isFinite(nose[k]))||
      nose.left>nose.right||nose.top>nose.bottom) throw new TypeError('Limites peintes du nez invalides.');
  const [left,right]=pigmentCenters(opening).map(p=>p.x);
  const outline=outlineCurves(face.outline).map(curve=>curve.map(([x,y])=>[y,x]));
  const faceGap=Math.max(.65,ry*.015);
  const facePad=4.2/2+faceGap;
  const noseGap=Math.max(.62,ry*.016);
  const cache=new Map();
  const faceLimits=(lo,hi)=>{
    const key=lo+';'+hi;
    if (!cache.has(key)) {
      // Swap axes to read the crown/chin extrema across the painted width.
      const samples=stripX(outline,lo-facePad,hi+facePad);
      const above=samples.filter(at=>at<y),below=samples.filter(at=>at>y);
      cache.set(key,{top:above.length?Math.max(...above)+facePad:Infinity,
        bottom:below.length?Math.min(...below)-facePad:-Infinity});
    }
    return cache.get(key);
  };
  return {x,y,left,right,nose,noseGap,faceGap,faceLimits,width:rx*.5,upper:ry*.055,lower:ry*.067,
    corners:ry*.048,curvature:ry*.034,thickness:legacyStroke*.40};
}

const smooth=(t)=>t*t*(3-2*t);
const smoothSlope=t=>6*t*(1-t);

// Permanent mouth profile on a half-span, measured from centre to corner.
// Every boundary is cubic on its intervals and monotone in x.
export function mouthProfile(frame,value) {
  const {y}=frame;
  const half=frame.width*value.width/200;
  const camber=frame.curvature*value.curvature/100;
  const lift=frame.corners*value.corners/100;
  const thickness=frame.thickness*value.thickness/200;
  const upper=frame.upper*(value.upper??0)/100;
  const lower=frame.lower*(value.lower??0)/100;
  const cusp=(value.cupid??0)/100;
  const peak=(value.peaks??35)/100;
  const corner=t=>Math.max(0,2*t-1);
  const seam=t=>y+camber*6.75*t*t*(1-t)-lift*corner(t)**3;
  const seamSlope=t=>camber*6.75*t*(2-3*t)-6*lift*corner(t)**2;
  const halfLine=t=>thickness*(1-.38*t*t-.62*t**3);
  const halfSlope=t=>-thickness*t*(.76+1.86*t);
  const upperBase=t=>1-t*t;
  const upperBaseSlope=t=>-2*t;
  const sculpt=(t,inward)=>inward?.36+.64*smooth(t/peak):1-((t-peak)/(1-peak))**2;
  const sculptSlope=(t,inward)=>inward?.64*smoothSlope(t/peak)/peak:-2*(t-peak)/(1-peak)**2;
  const lowerBase=t=>1-.82*t*t-.18*t**3;
  const lowerBaseSlope=t=>-t*(1.64+.54*t);

  const segment=(fn,slope,a,b)=>{
    const d=(b-a)/3;
    const start=fn(a),end=fn(b);
    return [[frame.x+half*a,start],[frame.x+half*(a+d),start+d*slope(a)],
      [frame.x+half*(b-d),end-d*slope(b)],[frame.x+half*b,end]];
  };
  const boundary=(sign,volume=0)=>{
    const upperSide=sign<0;
    const knots=[0,...new Set(upperSide&&volume&&cusp?[.5,peak]:[.5]),1].sort((a,b)=>a-b);
    return knots.slice(1).map((b,i)=>{
      const a=knots[i];
      const inward=b<=peak;
      const shape=t=>upperSide?(1-cusp)*upperBase(t)+cusp*sculpt(t,inward):lowerBase(t);
      const slope=t=>upperSide?(1-cusp)*upperBaseSlope(t)+cusp*sculptSlope(t,inward):lowerBaseSlope(t);
      return segment(t=>seam(t)+sign*(halfLine(t)+volume*shape(t)),
        t=>seamSlope(t)+sign*(halfSlope(t)+volume*slope(t)),a,b);
    });
  };
  const top=boundary(-1), bottom=boundary(1);
  return {half,centre:[segment(seam,seamSlope,0,.5),segment(seam,seamSlope,.5,1)],top,bottom,
    upper:upper?boundary(-1,upper):null,lower:lower?boundary(1,lower):null};
}

function yRange(curves) {
  let low=Infinity,high=-Infinity;
  for (const curve of curves) {
    const a=curve[0][1],b=curve[1][1],c=curve[2][1],d=curve[3][1];
    for (const t of [0,1,...extrema(curve,1)]) {
      const u=1-t,y=u**3*a+3*u*u*t*b+3*u*t*t*c+t**3*d;
      low=Math.min(low,y);
      high=Math.max(high,y);
    }
  }
  return [low,high];
}

export function mouthBounds(frame,profile) {
  const [top,bottom]=yRange([...(profile.upper??profile.top),...(profile.lower??profile.bottom)]);
  return {left:frame.x-profile.half,right:frame.x+profile.half,top,bottom};
}

export function mouthBreaches(frame,box) {
  const outside=[];
  if (box.left<frame.left+reserve-precision) outside.push('pupille-gauche');
  if (box.right>frame.right-reserve+precision) outside.push('pupille-droite');
  if (box.top<frame.nose.bottom+frame.noseGap+reserve-precision) outside.push('nez');
  const face=frame.faceLimits(box.left,box.right);
  if (box.top<face.top+reserve-precision||box.bottom>face.bottom-reserve+precision) outside.push('contour-facial');
  return outside;
}

export function auditHistoricalMouth(face,opening,options={}) {
  const frame=mouthFrame(face,opening,options);
  const {curve,stroke}=inheritedMouth(face,options.markup);
  const [[left,right],[top,bottom]]=bounds([curve],stroke/2);
  const box={left,right,top,bottom};
  return {box,violations:mouthBreaches(frame,box)};
}

const visibleValues=value=>value.intensity===0?{...value,upper:0,lower:0}:value;
const shapeBox=(frame,value)=>mouthBounds(frame,mouthProfile(frame,visibleValues(value)));
const fits=(frame,value)=>mouthBreaches(frame,shapeBox(frame,value)).length===0;

function approach(frame,fitted,key,goal) {
  const start=fitted[key];
  fitted[key]=goal;
  if (fits(frame,fitted)) return;
  let lo=0,hi=1;
  // The feasible segment for each amplitude is convex. Face clearance
  // also decreases monotonically as the half-span grows.
  for (let i=0;i<34;i++) {
    const middle=(lo+hi)/2;
    fitted[key]=start+(goal-start)*middle;
    if (fits(frame,fitted)) lo=middle;
    else hi=middle;
  }
  fitted[key]=start+(goal-start)*lo;
}

function recover(frame,request,preserveMouth) {
  if (fits(frame,request)) return {...request};
  if (preserveMouth) {
    // Try a single change before solving a joint conflict. Reduce upper
    // volume first to retain the commissures and lower lip wherever possible.
    for (const [key,anchor] of [['upper',0],['thickness',50],['corners',0],
      ['curvature',100],['lower',0],['width',60]]) {
      const candidate={...request,[key]:anchor};
      if (!fits(frame,candidate)) continue;
      approach(frame,candidate,key,request[key]);
      return candidate;
    }
  }
  const fitted={...request,...empty};
  if (!fits(frame,fitted)) throw new MouthFitError();
  for (const key of recoveryOrder) approach(frame,fitted,key,request[key]);
  if (preserveMouth) {
    for (const key of recoveryOrder) {
      if (fitted[key]!==request[key]) approach(frame,fitted,key,request[key]);
    }
  }
  return fitted;
}

function directDomain(frame,applied,key) {
  const allowed=n=>fits(frame,{...applied,[key]:n});
  const samples=[...new Set([...grids[key],applied[key]])].sort((a,b)=>a-b);
  const points=[], intervals=[];
  const transition=(valid,invalid)=>{
    for (let i=0;i<33;i++) {
      const mid=(valid+invalid)/2;
      if (allowed(mid)) valid=mid;
      else invalid=mid;
    }
    return valid;
  };
  const add=value=>{
    if (!points.length||Math.abs(points.at(-1)-value)>1e-7) points.push(value);
  };
  let start=null;
  const flags=samples.map(allowed);
  for (const [i,value] of samples.entries()) {
    if (!flags[i]) continue;
    if (start===null) {
      start=i===0?value:transition(value,samples[i-1]);
      add(start);
    }
    add(value);
    if (i===samples.length-1||!flags[i+1]) {
      const end=i===samples.length-1?value:transition(value,samples[i+1]);
      add(end);
      intervals.push([start,end]);
      start=null;
    }
  }
  return {points,intervals};
}

export function solveMouth(face,opening,mouth,options={}) {
  const requested=normalizeMouth(mouth);
  if (!requested) return null;
  const frame=mouthFrame(face,opening,options);
  const recovered=recover(frame,requested,options.preserveMouth);
  const applied=visibleValues(recovered);
  const upperVisible=applied.upper>0, hasPigment=upperVisible||applied.lower>0;
  const effective={...applied,upper:requested.intensity===0?null:applied.upper,
    lower:requested.intensity===0?null:applied.lower,cupid:upperVisible?applied.cupid:null,
    peaks:upperVisible&&applied.cupid>0?applied.peaks:null,
    intensity:hasPigment||requested.intensity===0?applied.intensity:null};
  // Zero tint retains the lip geometry. Returning to a positive tint can
  // restore the stored shapes or report a geometric adjustment.
  const active=key=> {
    if (key==='intensity') return hasPigment||requested.intensity===0&&(requested.upper>0||requested.lower>0);
    if (key==='upper'||key==='lower') return requested.intensity>0;
    if (key==='cupid'||key==='peaks') return effective[key]!==null;
    return true;
  };
  const domains=options.withDomains?Object.fromEntries(axes.map(([key,{min,max}])=>[key,
    !active(key)?{points:[],intervals:[]}:key==='intensity'?{points:grids[key],intervals:[[min,max]]}:
      directDomain(frame,applied,key)
  ])):null;
  const geometry=mouthProfile(frame,effective);
  return {requested,effective,frame,geometry,domains,box:mouthBounds(frame,geometry)};
}

export function mouthFor(input,eyes,mouth,options={}) {
  return solveMouth(model(input),eyesFor(input,eyes),mouth,options);
}

export function drawMouth(input,eyes,seed,options={}) {
  if (typeof seed!=='string') throw new TypeError('Graine textuelle requise.');
  const frame=mouthFrame(model(input),eyesFor(input,eyes),options);
  const next=seededIndex(mouthDrawVersion+'\0'+seed);
  const choose=values=>values[next(values.length)];
  const tint=choose(grids.intensity);
  const values={...empty,cupid:choose(grids.cupid),peaks:choose(grids.peaks),intensity:tint||55};
  if (!fits(frame,values)) throw new MouthFitError();
  for (const key of recoveryOrder) values[key]=choose(grids[key].filter(n=>fits(frame,{...values,[key]:n})));
  return {...values,intensity:tint};
}

export function lipColours(skin,intensity) {
  const source=rgb(skin).map(v=>v*255);
  const tint=(ratios,strength)=>'rgb('+source.map((c,i)=>+(c*(1-strength*(1-ratios[i]))).toFixed(3)).join(',')+')';
  return {
    upper:tint([.82,.66,.66],intensity/100),
    lower:tint([.91,.79,.79],intensity/100),
    line:tint([.47,.38,.41],1)
  };
}

const reverse=curves=>[...curves].reverse().map(curve=>[...curve].reverse());
function mirrored(curves,x) {
  const left=reverse(curves).map(curve=>curve.map(([xx,y])=>[2*x-xx,y]));
  return [...left,...curves];
}
function ribbon(upper,lower,x) {
  const curves=[...mirrored(upper,x),...reverse(mirrored(lower,x))];
  const format=point=>point.map(n=>+n.toFixed(8)).join(',');
  return 'M'+format(curves[0][0])+curves.map(curve=>' C'+curve.slice(1).map(format).join(' ')).join('')+'Z';
}

export function mouthMarkup(result,skin=palette.skin) {
  const {effective,frame:{x},geometry}=result;
  const colour=lipColours(skin,effective.intensity??0);
  const path=(layer,top,bottom)=>`<path data-mouth-part="${layer}" d="${ribbon(top,bottom,x)}" fill="${colour[layer]}"/>`;
  // The lip fills meet at the centreline under the separator. This underpaint
  // avoids an antialiasing gap while keeping all three commissures identical.
  const upper=geometry.upper?path('upper',geometry.upper,geometry.centre):'';
  const lower=geometry.lower?path('lower',geometry.centre,geometry.lower):'';
  return `<g data-bio-mouth="custom">${upper}${lower}${path('line',geometry.top,geometry.bottom)}</g>`;
}
