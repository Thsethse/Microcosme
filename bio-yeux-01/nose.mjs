import {rgb} from '../bio-col-01/palette.mjs';
import {model} from '../preview/bio-vis-p5-i6/model.mjs';
import {palette} from '../preview/bio-vis-p5-i6/i5/i4/i3/i2/i1/base/r1/p2/base/model.mjs';
import {outlineCurves,stripX} from './bezier.mjs';
import {detailFootprints,solveDetails} from './details.mjs';
import {seededIndex} from './draw.mjs';
import {eyesFor} from './eyes.mjs';
import {pigmentCenters} from './iris.mjs';
import {auditHistoricalMouth,inheritedNoseBounds,mouthFrame,solveMouth} from './mouth.mjs';

const axis=(label,min,max,neutral)=>Object.freeze({label,min,max,neutral});
export const noseControls=Object.freeze({
  length:axis('Longueur',55,150,100),
  bridge:axis('Largeur de l’arête',40,180,100),
  wings:axis('Largeur des ailes',60,160,100),
  tip:axis('Volume de la pointe',30,180,100),
  roundness:axis('Arrondi de la pointe',0,100,50),
  nostrils:axis('Taille des narines',0,180,100),
  tilt:axis('Inclinaison des narines',-100,100,0),
  fills:axis('Intensité des aplats',0,100,45),
  lines:axis('Intensité des traits',0,100,40)
});
const example=(label,values)=>Object.freeze({label,values:Object.freeze(values)});
export const nosePresets=Object.freeze({
  thin:example('Fin',{bridge:51,wings:66,tip:68,roundness:37,nostrils:65}),
  wide:example('Large',{bridge:113,wings:153,tip:125,roundness:49,nostrils:112}),
  long:example('Long',{length:145,bridge:81,wings:90,tip:92,roundness:33}),
  short:example('Court',{length:60,bridge:111,wings:98,tip:86,nostrils:78}),
  rounded:example('Arrondi',{tip:152,roundness:100,wings:117,nostrils:88}),
  pointed:example('Pointu',{tip:107,roundness:0,wings:80,bridge:83,nostrils:60}),
  flat:example('Épaté',{length:71,bridge:124,wings:158,tip:126,roundness:83,nostrils:115}),
  broadBridge:example('Arête large',{bridge:177,wings:102,tip:93,roundness:50}),
  distinctNostrils:example('Narines marquées',{nostrils:163,tilt:56,wings:125,lines:79,fills:43})
});
export const noseDetailPresets=Object.freeze({
  minimal:example('Minimaliste',{fills:28,lines:0}),
  discreet:example('Discret',{fills:45,lines:40}),
  defined:example('Marqué',{fills:77,lines:83})
});
export const noseDrawVersion='nose-xoshiro128ss-v1';
export class NoseFitError extends Error {
  constructor() {
    super('Le nez ne tient pas dans l’enveloppe avec une bouche admissible à son ancrage. Arbitrage anatomique requis.');
    this.name='NoseFitError';
  }
}

const axes=Object.entries(noseControls);
const grids=Object.fromEntries(axes.map(([key,{min,max}])=>[key,Array.from({length:max-min+1},(_,i)=>min+i)]));
const clamp=(value,min,max)=>Math.max(min,Math.min(max,value));
const lerp=(a,b,t)=>a+(b-a)*t;
const ease=t=>t*t*(3-2*t);
const reserve=.00001;
const geometryAxes=['length','bridge','wings','tip','roundness','nostrils','tilt'];
const minimumMouth={width:60,upper:0,lower:0,corners:0,curvature:0,intensity:0,thickness:50};

export function normalizeNose(nose) {
  if(nose==null||nose==='historical') return null;
  if(typeof nose!=='object'||Array.isArray(nose)) throw new TypeError('Réglages de nez invalides.');
  return Object.fromEntries(axes.map(([key,{min,max,neutral}])=>
    [key,Number.isFinite(nose[key])?clamp(nose[key],min,max):neutral]));
}

export function eyeObstacles(opening,details,painted) {
  const {width,height}=opening.face.reference;
  const openings=opening.face.envelopes.map(({x,y},i)=>{
    const box=opening.shapes[i]?.bounds??[[x-width/2,x+width/2],[y-height/2,y+height/2]];
    return {left:box[0][0],right:box[0][1],top:box[1][0],bottom:box[1][1]};
  });
  return [...openings,...detailFootprints(painted??solveDetails(opening,details))];
}

export function noseFrame(face,opening,options={}) {
  const {head:{rx,ry},anchors:{nose:[x,y]}}=face.base;
  const [left,right]=pigmentCenters(opening).map(p=>p.x);
  const inherited=mouthFrame(face,opening,{markup:options.markup});
  // The anchored separator surrounds its centre by half the minimum
  // thickness. Solving that same minimum provides the exact mouth limit.
  const mouthTop=options.mouth!=null&&options.mouth!=='historical'?
    solveMouth(face,opening,minimumMouth,{markup:options.markup}).box.top:
    auditHistoricalMouth(face,opening,{markup:options.markup}).box.top;
  const outline=outlineCurves(face.outline);
  const pad=2.1+Math.max(.4,.012*ry);
  const cache=new Map();
  const faceSides=(top,bottom)=>{
    const key=top+';'+bottom;
    if(!cache.has(key)){
      const spans=stripX(outline,top-pad,bottom+pad);
      const l=spans.filter(value=>value<x), r=spans.filter(value=>value>x);
      cache.set(key,{left:l.length?Math.max(...l)+pad:Infinity,right:r.length?Math.min(...r)-pad:-Infinity});
    }
    return cache.get(key);
  };
  const length=.265*ry, tip=.058*ry;
  // A conservative common strip handles most widths. If it is too narrow,
  // check the actual candidate's strip before excluding it.
  const broadFace=faceSides(y-.74*length*1.5,y+.42*length*1.5+.8*tip);
  return {x,y,left,right,faceSides,broadFace,eyes:eyeObstacles(opening,options.details,options.eyeDetails),
    mouthTop,mouthGap:inherited.noseGap,maxBottom:mouthTop-inherited.noseGap-reserve,
    length,bridge:.080*rx,wings:.165*rx,tip,
    nostrilX:.022*rx,nostrilY:.0105*ry,eyeGap:Math.max(.18,.006*ry)};
}

// Cubics with linear y and flat x tangents at each knot define the outline.
// The same cross-sections place all six regions.
export function noseProfile(frame,value) {
  const span=frame.length*value.length/100;
  const top=frame.y-.74*span;
  const bottom=frame.y+.42*span+frame.tip*(value.tip/100-1);
  const height=bottom-top;
  const bridge=frame.bridge*value.bridge/100;
  const wings=frame.wings*value.wings/100;
  const volume=value.tip/100, round=value.roundness/100;
  const knots=[[0,0],[.17,bridge*.69],[.42,bridge*.87],
    [.62,lerp(bridge,wings,.30)],[.79,wings],
    [.90,wings*(.74+.10*round)],[.967,wings*(.24+.30*round+.075*volume)],[1,0]];
  const y=t=>top+height*t;
  const width=t=>{
    const i=knots.findIndex(([at])=>at>=t);
    if(i<=0) return 0;
    const [a,w]=knots[i-1], [b,z]=knots[i];
    return lerp(w,z,ease((t-a)/(b-a)));
  };
  const widthRange=(a,b)=>{
    const samples=[width(a),width(b),...knots.filter(([t])=>t>a&&t<b).map(([,w])=>w)];
    return [Math.min(...samples),Math.max(...samples)];
  };
  const curves=knots.slice(1).map(([b,z],i)=>{
    const [a,w]=knots[i], d=(b-a)/3;
    return [[frame.x+w,y(a)],[frame.x+w,y(a+d)],[frame.x+z,y(b-d)],[frame.x+z,y(b)]];
  });
  const half=Math.max(...knots.map(([,w])=>w));
  const anatomy={left:frame.x-half,right:frame.x+half,top,bottom};
  const theta=value.tilt*Math.PI*28/18000;
  const rx=frame.nostrilX*value.nostrils/100, ry=frame.nostrilY*value.nostrils/100;
  const t=.825, dx=width(t)*.51;
  const ex=Math.hypot(rx*Math.cos(theta),ry*Math.sin(theta));
  const ey=Math.hypot(rx*Math.sin(theta),ry*Math.cos(theta));
  const t0=t-ey/height, t1=t+ey/height;
  const nostril={dx,y:y(t),rx,ry,angle:value.tilt*.28,
    left:dx-ex,right:dx+ex,top:y(t)-ey,bottom:y(t)+ey};
  const nostrilFits=rx===0||t0>=.63&&t1<.964&&nostril.left>=.12&&
    nostril.right<=widthRange(t0,t1)[0]-.13;
  return {anatomy,top,bottom,height,width,widthRange,y,curves,nostril,nostrilFits,volume,round};
}

export function noseBreaches(frame,shape) {
  const issues=[];
  const box=shape.anatomy;
  if(box.left<frame.left+reserve||box.right>frame.right-reserve) issues.push('verticales-pupillaires');
  if(box.bottom>frame.maxBottom) issues.push('bouche');
  const within=face=>box.left>=face.left+reserve&&box.right<=face.right-reserve;
  if(!within(frame.broadFace)&&!within(frame.faceSides(box.top,box.bottom))) issues.push('contour-facial');
  if(frame.eyes.some(eye=>{
    if(box.left>=eye.right+frame.eyeGap||box.right<=eye.left-frame.eyeGap) return false;
    const top=Math.max(box.top,eye.top-frame.eyeGap), bottom=Math.min(box.bottom,eye.bottom+frame.eyeGap);
    if(top>bottom) return false;
    const half=shape.widthRange((top-box.top)/shape.height,(bottom-box.top)/shape.height)[1];
    return frame.x-half<eye.right+frame.eyeGap&&frame.x+half>eye.left-frame.eyeGap;
  })) issues.push('yeux');
  if(!shape.nostrilFits) issues.push('narines');
  return issues;
}

export function auditHistoricalNose(face,opening,options={}) {
  const frame=noseFrame(face,opening,{...options,mouth:null});
  const box=inheritedNoseBounds(face,options.markup);
  // The historical triangle tapers linearly from the apex to its base.
  const height=box.bottom-box.top, half=(box.right-box.left)/2;
  return noseBreaches(frame,{anatomy:box,height,widthRange:(a,b)=>[half*a,half*b],nostrilFits:true});
}

const baseline={length:55,bridge:40,wings:60,tip:30,roundness:50,nostrils:0,tilt:0};
const fits=(frame,value)=>noseBreaches(frame,noseProfile(frame,value)).length===0;
function withBounds(frame,requested) {
  if(fits(frame,requested)) return {...requested};
  const safe={...requested,...baseline};
  if(!fits(frame,safe)) throw new NoseFitError();
  // A tilted ellipse can regain room on the other side of a gap. Restore
  // tilt before sizing it, without making the width depend on visibility.
  for(const key of ['length','bridge','wings','tip','roundness','tilt','nostrils']){
    const start=safe[key],goal=requested[key];
    safe[key]=goal;
    if(fits(frame,safe)) continue;
    let lo=0,hi=1;
    for(let i=0;i<33;i++){
      const middle=(lo+hi)/2;
      safe[key]=lerp(start,goal,middle);
      if(fits(frame,safe)) lo=middle;
      else hi=middle;
    }
    safe[key]=lerp(start,goal,lo);
  }
  return safe;
}

function domain(frame,applied,key) {
  const allows=n=>fits(frame,{...applied,[key]:n});
  const samples=[...new Set([...grids[key],applied[key]])].sort((a,b)=>a-b);
  const flags=samples.map(allows),points=[],intervals=[];
  const edge=(valid,invalid)=>{
    for(let i=0;i<32;i++){
      const mid=(valid+invalid)/2;
      if(allows(mid)) valid=mid;
      else invalid=mid;
    }
    return valid;
  };
  const add=value=>{if(!points.length||Math.abs(points.at(-1)-value)>1e-7) points.push(value);};
  let start=null;
  for(const [i,n] of samples.entries()){
    if(!flags[i]) continue;
    if(start===null) {
      start=i===0?n:edge(n,samples[i-1]);
      add(start);
    }
    add(n);
    if(i===samples.length-1||!flags[i+1]){
      const stop=i===samples.length-1?n:edge(n,samples[i+1]);
      add(stop);
      intervals.push([start,stop]);
      start=null;
    }
  }
  return {points,intervals};
}

export function solveNose(face,opening,nose,options={}) {
  const requested=normalizeNose(nose);
  if(!requested) return null;
  const frame=noseFrame(face,opening,options), applied=withBounds(frame,requested);
  const visibility=applied.fills>0||applied.lines>0;
  const effective={...applied};
  for(const key of geometryAxes){
    if(!visibility||key==='nostrils'&&!applied.lines||key==='tilt'&&(!applied.lines||!applied.nostrils)) effective[key]=null;
  }
  const domains=options.withDomains?Object.fromEntries(axes.map(([key,{min,max}])=>[key,
    effective[key]===null?{points:[],intervals:[]}:geometryAxes.includes(key)?domain(frame,applied,key):
      {points:grids[key],intervals:[[min,max]]}])):null;
  return {requested,applied,effective,geometry:noseProfile(frame,applied),frame,domains};
}

export function noseFor(input,eyes,nose,options={}) {
  return solveNose(model(input),eyesFor(input,eyes),nose,options);
}

export function drawNose(input,eyes,seed,options={}) {
  if(typeof seed!=='string') throw new TypeError('Graine textuelle requise.');
  const next=seededIndex(noseDrawVersion+'\0'+seed), choose=list=>list[next(list.length)];
  const frame=noseFrame(model(input),eyesFor(input,eyes),options);
  const value={...baseline,fills:choose(grids.fills),lines:choose(grids.lines)};
  if(!fits(frame,value)) throw new NoseFitError();
  for(const key of ['length','bridge','wings','tip','roundness','tilt','nostrils']){
    value[key]=choose(grids[key].filter(n=>fits(frame,{...value,[key]:n})));
  }
  return value;
}

export function noseColours(skin,fills,lines) {
  const source=rgb(skin).map(v=>v*255);
  const tone=(ratios,level)=>'rgb('+source.map((c,i)=>+Math.min(255,c*(1+level/100*(ratios[i]-1))).toFixed(3)).join(',')+')';
  return {bridge:tone([.95,.91,.88],fills),root:tone([1.035,1.023,1.013],fills),
    tip:tone([1.105,1.074,1.038],fills),wings:tone([.91,.85,.80],fills),base:tone([.76,.67,.62],lines),
    nostrils:tone([.53,.43,.40],lines),ridge:tone([.82,.74,.65],lines)};
}

const format=p=>p.map(value=>+value.toFixed(8)).join(',');
const reverse=curves=>[...curves].reverse().map(curve=>[...curve].reverse());
function outline(profile,x) {
  const curves=[...profile.curves,...reverse(profile.curves).map(curve=>curve.map(([xx,y])=>[2*x-xx,y]))];
  return 'M'+format(curves[0][0])+curves.map(curve=>' C'+curve.slice(1).map(format).join(' ')).join('')+'Z';
}

export function noseMarkup(result,skin=palette.skin) {
  const {applied,geometry:g,frame:{x}}=result;
  const pigments=noseColours(skin,applied.fills,applied.lines);
  const path=(region,d,fill)=>`<path data-nose-region="${region}" d="${d}" fill="${fill}"/>`;
  const ellipse=(region,cx,cy,rx,ry,fill,tilt=0)=>
    `<ellipse data-nose-region="${region}" cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="${fill}"${tilt?` transform="rotate(${tilt} ${cx} ${cy})"`:''}/>`;
  // Each interior mark fits in a guaranteed inscribed rectangle from the
  // same outline profile. Intensity controls change paint only.
  const oval=(region,t,depth,wide,offset=0)=>{
    const room=g.widthRange(t-depth,t+depth)[0], rx=room*wide, ry=g.height*depth;
    return ellipse(region,x+offset*room,g.y(t),rx,ry,pigments[region]);
  };
  const layers=[];
  if(applied.fills){
    layers.push(path('bridge',outline(g,x),pigments.bridge),oval('root',.28,.126,.52),
      oval('wings',.81,.075,.22,-.66),oval('wings',.81,.075,.22,.66),
      oval('tip',.747,.072+.043*g.round,.42+.095*g.volume));
  }
  if(applied.lines){
    // Filled bands give the accents a real width with no cap projecting
    // outside the anatomical outline.
    const room=g.widthRange(.911,.966)[0];
    const xx=.81*room, y=g.y(.926), depth=g.height*(.012+.009*g.round+.007*(g.volume-1));
    const d=`M${format([x-xx,y])} Q${format([x,y+depth*1.8])} ${format([x+xx,y])} Q${format([x,y+depth*.72])} ${format([x-xx,y])}Z`;
    layers.push(path('base',d,pigments.base));
    const ridge=(side)=> {
      const a=.228,b=.599, room=g.widthRange(a,b)[0], u=side*room;
      const d=`M${format([x+u*.43,g.y(a)])} Q${format([x+u*.55,g.y(.41)])} ${format([x+u*.82,g.y(b)])} Q${format([x+u*.33,g.y(.42)])} ${format([x+u*.43,g.y(a)])}Z`;
      return path('bridge',d,pigments.ridge);
    };
    layers.push(ridge(-1),ridge(1));
    const n=g.nostril;
    if(n.rx) layers.push(...[-1,1].map(side=>ellipse('nostrils',x+side*n.dx,n.y,n.rx,n.ry,pigments.nostrils,side*n.angle)));
  }
  return `<g data-bio-nose="custom">${layers.join('')}</g>`;
}
