import {character as inherited} from '../bio-col-01/render.mjs';
import {palette as hairPalette, rgb, swatch} from '../bio-col-01/palette.mjs';
import {model} from '../preview/bio-vis-p5-i6/model.mjs';
import {palette as historicalPalette} from '../preview/bio-vis-p5-i6/i5/i4/i3/i2/i1/base/r1/p2/base/model.mjs';
import {outlineCurves, stripX} from './bezier.mjs';
import {seededIndex} from './draw.mjs';
import {eyesFor} from './eyes.mjs';

const axis = (label, min, max, neutral, unit = '%') => Object.freeze({label,min,max,neutral,unit});
export const browControls = Object.freeze({
  length: axis('Longueur',50,125,100),
  thickness: axis('Épaisseur',20,220,100),
  arc: axis('Hauteur d’arc',0,100,35),
  summit: axis('Position du sommet',20,80,60),
  tilt: axis('Inclinaison',-20,20,0,'°'),
  angularity: axis('Angularité',0,100,20),
  height: axis('Hauteur sur le visage',0,100,50),
  taper: axis('Affinement de la pointe',0,100,65),
  spacing: axis('Écartement',0,100,50)
});
export const browColourModes = Object.freeze({
  linked:'Identique aux cheveux', darker:'Cheveux légèrement assombris', independent:'Indépendante'
});
export const browDrawVersion = 'brows-xoshiro128ss-v1';

const example = (label, values) => Object.freeze({label,values:Object.freeze(values)});
export const browPresets = Object.freeze({
  straight:example('Droits',{arc:0,thickness:93,taper:43}),
  round:example('Arrondis',{arc:64,summit:51,angularity:0,taper:38}),
  angular:example('Anguleux',{arc:66,summit:62,angularity:100,taper:60}),
  rising:example('Ascendants',{arc:10,tilt:17,height:40,taper:57}),
  falling:example('Descendants',{arc:12,tilt:-16,height:72,taper:59}),
  inflected:example('En S',{arc:88,summit:80,angularity:10,height:58,taper:67}),
  thick:example('Épais',{arc:30,thickness:213,height:64,taper:17}),
  fine:example('Effilés',{length:115,thickness:85,arc:52,taper:100,angularity:24}),
  short:example('Courts',{length:60,thickness:108,arc:23,taper:51})
});

const axes = Object.entries(browControls);
const grid = Object.fromEntries(axes.map(([key,{min,max}])=>[key,Array.from({length:max-min+1},(_,i)=>min+i)]));
const traits = ['absent','monobrow','slit'];
const baseTicks = Array.from({length:41},(_,i)=>i/40);
const clamp = (value,lo,hi) => Math.max(lo,Math.min(hi,value));
const lerp = (a,b,t) => a+(b-a)*t;

export function normalizeBrows(value) {
  if (value == null || value === 'historical') return null;
  if (typeof value !== 'object' || Array.isArray(value)) throw new TypeError('Réglages de sourcils invalides.');
  const geometry = Object.fromEntries(axes.map(([key,{min,max,neutral}])=>{
    const entry=value[key];
    return [key,Number.isFinite(entry)?clamp(entry,min,max):neutral];
  }));
  const colourMode=value.colourMode??'linked', colour=value.colour??'brun-chocolat';
  if (!Object.hasOwn(browColourModes,colourMode)) throw new RangeError('Mode chromatique des sourcils inconnu.');
  swatch(colour);
  return {...geometry,...Object.fromEntries(traits.map(key=>[key,value[key]===true])),colourMode,colour};
}

export function browFrame(face, opening) {
  const {head:{cx,rx,ry}, anchors:{browLeft,browRight}}=face.base;
  const {envelopes, reference}=opening.face;
  const historicTop=Math.min(...envelopes.map(e=>e.y-reference.height/2));
  const eyeTop=opening.shapes.length?Math.min(...opening.shapes.map(s=>s.bounds[1][0])):historicTop;
  const top=browRight[1]-.34*ry;
  // BIO-YEUX-03 keeps even its highest painted detail below this inherited limit.
  const bottom=Math.min(eyeTop,...envelopes.map(e=>e.top))-.48;
  const edges=stripX(outlineCurves(face.outline),top,bottom);
  const halfWidth=Math.min(...edges.map(x=>Math.abs(x-cx)))-2.35;
  const length=1.7*.26*rx;
  return {cx,top,bottom,halfWidth,length,thickness:2.2,arc:.125*ry,
    root:(browRight[0]-browLeft[0]-length)/2, low:bottom-.14, travel:.20*ry};
}

const rootAt = (f, spacing) => f.root*(.55+.009*spacing);
const bezierHeight = (a,b,t) => 3*(1-t)*t*((1-t)*a+t*b)+t**3;

// Permanent profile, in a local frame rooted at the inner end. Drawing,
// reflection and slit/bridge construction consume this geometry separately.
export function browProfile(frame, value) {
  const length=frame.length*value.length/100;
  const rise=frame.arc*value.arc/100, summit=value.arc===0?.6:(value.summit??60)/100;
  const angle=(value.angularity??20)/100;
  const slope=-Math.tan(value.tilt*Math.PI/180)*length;
  const recurve=clamp((summit-.63)/.17,0,1)*(1-angle);
  const rootHandle=lerp(.48,1/3,angle)-1.88*recurve;
  const crownHandle=lerp(1,2/3,angle);
  const tailHandle=lerp(.48,1/3,angle);
  const thickness=frame.thickness*value.thickness/200;
  const taper=value.taper/100;
  const startHalf=thickness*.88;
  const section=t=>{
    const elevation=t<=summit?bezierHeight(rootHandle,crownHandle,t/summit):
      bezierHeight(tailHandle,crownHandle,(1-t)/(1-summit));
    const y=slope*t-rise*elevation;
    const root=value.monobrow?lerp(.74,1,Math.min(1,t/.12)):Math.min(1,Math.sqrt(t/.077));
    const tip=Math.min(1,Math.sqrt((1-t)/.085));
    const fullness=.88+.12*Math.sin(Math.PI*t);
    const half=thickness*fullness*root*tip*(1-taper*.91*t**1.24);
    return [length*t,y,half];
  };
  return {length, summit, section, startHalf:startHalf*.74};
}

function profileTicks(profile, from=0, to=1) {
  return [...new Set([from,...baseTicks.filter(t=>t>from&&t<to),
    ...(profile.summit>from&&profile.summit<to?[profile.summit]:[]),to])].sort((a,b)=>a-b);
}
const slitCenter=.76, slitRatio=.058;
function slitBounds(frame, profile) {
  const half=slitRatio*frame.length/(2*profile.length);
  return [slitCenter-half,slitCenter+half];
}
function availableHeight(frame, value, profile=browProfile(frame,value)) {
  const ticks=profileTicks(profile);
  if (value.slit) ticks.push(...slitBounds(frame,profile));
  let top=Infinity, bottom=-Infinity;
  for (const t of ticks) {
    const [,y,half]=profile.section(t);
    top=Math.min(top,y-half);
    bottom=Math.max(bottom,y+half);
  }
  const low=Math.max(0,100*(frame.low+bottom-frame.bottom)/frame.travel);
  const high=Math.min(100,100*(frame.low+top-frame.top)/frame.travel);
  return low<=high?[low,high]:null;
}
function fitsWidth(frame, value) {
  return rootAt(frame,value.spacing)+frame.length*value.length/100<=frame.halfWidth+1e-10;
}
function fits(frame, value) {
  if (!fitsWidth(frame,value)) return false;
  const range=availableHeight(frame,value);
  return !!range && value.height>=range[0]-1e-10 && value.height<=range[1]+1e-10;
}

function applyBounds(frame, requested) {
  const {length,halfWidth,root}=frame;
  const spacing=clamp(((halfWidth-length*.50)/root-.55)/.009,0,100);
  const applied={...requested,spacing:Math.min(requested.spacing,spacing)};
  applied.length=Math.min(requested.length,100*(halfWidth-rootAt(frame,applied.spacing))/length);
  let heightRange=availableHeight(frame,applied);
  if (!heightRange) {
    // Recover the requested amplitudes in a documented order from a safe
    // profile. Each amplitude has a convex feasibility interval along its axis.
    Object.assign(applied,{tilt:0,arc:0,thickness:20});
    for (const key of ['thickness','arc','tilt']) {
      const start=applied[key], goal=requested[key];
      let lo=0, hi=1;
      applied[key]=goal;
      if (availableHeight(frame,applied)) continue;
      for (let i=0;i<32;i++) {
        const middle=(lo+hi)/2;
        applied[key]=lerp(start,goal,middle);
        if (availableHeight(frame,applied)) lo=middle;
        else hi=middle;
      }
      applied[key]=lerp(start,goal,lo);
    }
    heightRange=availableHeight(frame,applied);
  }
  if (!heightRange || applied.length<50-1e-8) throw new Error('Enveloppe des sourcils insuffisante.');
  applied.height=clamp(requested.height,...heightRange);
  return applied;
}

export function hasRenderedHair(source) {
  return /<g data-layer="(?:back|rear|front|volume|texture|lengths|sides)">(?!<\/g>)/.test(source);
}

export function facialPigment(face, value, {hairColor, rememberedHairColor, source}) {
  if (value.colourMode==='independent') return {fill:swatch(value.colour).fill,source:'independent'};
  const applied=hairColor&&hairColor!=='historical'?hairColor:null;
  const visible=hasRenderedHair(source??inherited(face.state,{hairColor}));
  const memory=rememberedHairColor||applied;
  const base=visible?(applied?swatch(applied).fill:face.cut.color):
    memory?swatch(memory).fill:historicalPalette.hair;
  const fill=value.colourMode==='darker'?'#'+rgb(base).map(c=>
    Math.round(c*255*.88).toString(16).padStart(2,'0')).join(''):base;
  return {fill,source:visible?'hair':memory?'remembered':'historical'};
}

export function solveBrows(face, opening, value, colours={}, withDomains=false) {
  const requested=normalizeBrows(value);
  if (!requested) return null;
  if (requested.absent) {
    const inactive=Object.fromEntries([...axes.map(([key])=>key),'monobrow','slit','colourMode','colour'].map(key=>[key,null]));
    return {requested,effective:{...inactive,absent:true},pigment:null,frame:null,
      domains:withDomains?Object.fromEntries(axes.map(([key])=>[key,[]])):null};
  }
  const frame=browFrame(face,opening);
  const applied=applyBounds(frame,requested);
  const noArc=applied.arc===0;
  const domains=withDomains?Object.fromEntries(axes.map(([key])=>[key,
    noArc&&(key==='summit'||key==='angularity')?[]:grid[key].filter(n=>fits(frame,{...applied,[key]:n}))
  ])):null;
  const effective={...applied,summit:noArc?null:applied.summit,angularity:noArc?null:applied.angularity,
    colour:applied.colourMode==='independent'?applied.colour:null};
  return {requested,effective,frame,domains,pigment:facialPigment(face,applied,colours)};
}

export function browsFor(input, eyes, value, colours={}, withDomains=false) {
  return solveBrows(model(input),eyesFor(input,eyes),value,colours,withDomains);
}

function gridHeight(frame, value) {
  const range=availableHeight(frame,value);
  return range?grid.height.filter(n=>n>=range[0]&&n<=range[1]):[];
}

export function drawBrows(input, eyes, seed) {
  if (typeof seed!=='string') throw new TypeError('Graine textuelle requise.');
  const next=seededIndex(browDrawVersion+'\0'+seed);
  const choose=list=>list[next(list.length)];
  const frame=browFrame(model(input),eyesFor(input,eyes));
  const trait=next(5);
  const value=normalizeBrows({absent:trait===4,monobrow:trait===1||trait===3,slit:trait===2||trait===3,
    colourMode:choose(Object.keys(browColourModes)),colour:choose(hairPalette).id,
    length:50,thickness:20,arc:0,tilt:0,taper:choose(grid.taper),
    summit:choose(grid.summit),angularity:choose(grid.angularity)});
  for (const key of ['spacing','length']) {
    value[key]=choose(grid[key].filter(n=>fitsWidth(frame,{...value,[key]:n})));
  }
  for (const key of ['tilt','thickness','arc']) {
    value[key]=choose(grid[key].filter(n=>gridHeight(frame,{...value,[key]:n}).length));
  }
  value.height=choose(gridHeight(frame,value));
  return value;
}

function silhouetteSegments(frame, effective) {
  const profile=browProfile(frame,effective);
  const root=rootAt(frame,effective.spacing);
  const base=frame.low-effective.height/100*frame.travel;
  const sample=(from,to,side)=>{
    const points=profileTicks(profile,from,to).map(t=>profile.section(t));
    return {
      upper:points.map(([x,y,half])=>[frame.cx+side*(root+x),base+y-half]),
      lower:points.map(([x,y,half])=>[frame.cx+side*(root+x),base+y+half])
    };
  };
  const [a,b]=slitBounds(frame,profile);
  const left=sample(0,1,-1), right=sample(0,effective.slit?a:1,1);
  const closed=p=>[...p.upper,...p.lower.reverse()];
  const pieces=effective.slit?[{side:'right-tip',points:closed(sample(b,1,1))}]:[];
  if (!effective.monobrow) return [{side:'left',points:closed(left)},{side:'right',points:closed(right)},...pieces];

  const bridge=direction=>baseTicks.slice(1,-1).map(t=>{
    const x=2*t-1;
    return [frame.cx+root*x,base+direction*profile.startHalf*(.61+.39*x*x)];
  });
  const together=[...left.upper.reverse(),...bridge(-1),...right.upper,
    ...right.lower.reverse(),...bridge(1).reverse(),...left.lower];
  return [{side:'joined',points:together},...pieces];
}

export function browMarkup(result) {
  if (result.effective.absent) return '<g data-bio-brows="absent"/>';
  const pieces=silhouetteSegments(result.frame,result.effective);
  const fill=result.pigment.fill;
  const paths=pieces.map(({side,points})=>{
    const d='M'+points.map(p=>p.map(v=>+v.toFixed(6)).join(',')).join('L')+'Z';
    return `<path data-brow-side="${side}" d="${d}" fill="${fill}"/>`;
  }).join('');
  return `<g data-bio-brows="custom">${paths}</g>`;
}
