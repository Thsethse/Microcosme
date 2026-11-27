import {contour,palette,rgb,swatch} from '../bio-col-01/palette.mjs';
import {character as inherited} from '../bio-col-01/render.mjs';
import {model} from '../bio-vis-p5-i6/model.mjs';
import {palette as facePalette} from '../bio-vis-p5-i6/i5/i4/i3/i2/i1/base/r1/p2/base/model.mjs';
import {outlineCurves,stripX} from './bezier.mjs';
import {facialPigment,hasRenderedHair} from './brows.mjs';
import {solveDetails} from './details.mjs';
import {seededIndex} from './draw.mjs';
import {eyesFor,eyeStroke} from './eyes.mjs';
import {auditHistoricalMouth,inheritedNoseBounds,solveMouth} from './mouth.mjs';
import {eyeObstacles,solveNose} from './nose.mjs';

export const beardZones=Object.freeze({
  sideburns:'Favoris',cheeks:'Joues',moustache:'Moustache',soulPatch:'Mouche',chin:'Menton',jaw:'Mâchoire'
});
const zoneKeys=Object.keys(beardZones);
const axis=(label,neutral,min=0)=>Object.freeze({label,neutral,min,max:100});
export const beardControls=Object.freeze({
  length:axis('Longueur de barbe',30),volume:axis('Volume de barbe',50),density:axis('Densité',100),
  chinShape:axis('Forme du menton',25),moustacheWidth:axis('Largeur de la moustache',60),
  moustacheThickness:axis('Épaisseur de la moustache',50),moustacheCurl:axis('Courbure de la moustache',0,-100),
  sideburnLength:axis('Longueur des favoris',60),sideburnWidth:axis('Largeur des favoris',50)
});
const axes=Object.entries(beardControls);
const example=(label,zones,values={})=>Object.freeze({
  label,values:Object.freeze({...values,zones:Object.freeze(Object.fromEntries(zones.map(key=>[key,true])))})
});
export const beardPresets=Object.freeze({
  clean:example('Imberbe',[]),
  stubble:example('Naissante',['cheeks','chin','jaw'],{length:0,volume:29,density:26,chinShape:10}),
  short:example('Courte',['sideburns','cheeks','chin','jaw'],{length:11,volume:44,chinShape:12}),
  full:example('Complète',zoneKeys,{length:35,volume:67,moustacheWidth:88}),
  long:example('Longue',zoneKeys,{length:93,volume:79,moustacheWidth:85,chinShape:15}),
  pointed:example('Pointue',['sideburns','cheeks','chin','jaw'],{length:76,volume:37,chinShape:98}),
  goatee:example('Bouc',['soulPatch','chin'],{length:35,volume:35,chinShape:48}),
  patch:example('Mouche',['soulPatch']),
  strap:example('Collier',['sideburns','cheeks','jaw'],{length:3,volume:6,sideburnWidth:16,sideburnLength:87}),
  moustache:example('Moustache',['moustache'],{moustacheWidth:70,moustacheThickness:58,moustacheCurl:35}),
  circle:example('Moustache et bouc',['moustache','soulPatch','chin'],{length:29,volume:43,moustacheWidth:56}),
  sideburns:example('Favoris',['sideburns'],{sideburnLength:78,sideburnWidth:62})
});
export const beardDrawVersion='beard-xoshiro128ss-v1';
export const beardStroke=.62;
const clamp=(n,min,max)=>Math.min(max,Math.max(min,n));
const lerp=(a,b,t)=>a+(b-a)*t;
const ease=t=>t*t*(3-2*t);

export function beardCategoryOf(category='H') {
  if (!['H','F','T'].includes(category)) throw new RangeError('Catégorie de pilosité inconnue.');
  return category;
}

export function normalizeBeard(beard) {
  if (beard==null||beard==='historical') return null;
  if (typeof beard!=='object'||Array.isArray(beard)) throw new TypeError('Réglages de pilosité invalides.');
  const colour=swatch(beard.colour??'brun-sombre').id;
  const colourMode=beard.colourMode??'hair';
  if (!['hair','darker','independent'].includes(colourMode)) throw new RangeError('Mode de coloration inconnu.');
  return {
    zones:Object.fromEntries(zoneKeys.map(key=>[key,beard.zones?.[key]===true])),
    ...Object.fromEntries(axes.map(([key,{min,max,neutral}])=>[key,
      Number.isFinite(beard[key])?clamp(beard[key],min,max):neutral])),
    colourMode,colour
  };
}

function expanded(box,pad) {
  return {left:box.left-pad,right:box.right+pad,top:box.top-pad,bottom:box.bottom+pad};
}

function cached(f) {
  const values=new Map();
  return key=>{
    if(!values.has(key)) values.set(key,f(key));
    return values.get(key);
  };
}

function faceFrame(face,opening,options) {
  const {head:{cx,rx,ry}}=face.base;
  const chin=face.anchors.chin[1];
  const curves=outlineCurves(face.outline);
  const transpose=curves.map(curve=>curve.map(([x,y])=>[y,x]));
  const side=cached(y=>{
    const xs=stripX(curves,y);
    return Math.max(0,Math.min(cx-Math.min(...xs),Math.max(...xs)-cx));
  });
  const jaw=cached(x=>Math.min(
    Math.max(...stripX(transpose,cx+x)),Math.max(...stripX(transpose,cx-x))));
  const gap=beardStroke/2+Math.max(.27,.007*ry);
  const nose=options.noseResult?.geometry.anatomy??inheritedNoseBounds(face,options.markup);
  const mouth=options.mouthResult?.box??auditHistoricalMouth(face,opening,{markup:options.markup}).box;
  const eyes=eyeObstacles(opening,null,options.detailResult).map(box=>expanded(box,eyeStroke/2));
  const obstacles=[nose,mouth,...eyes].map(box=>expanded(box,gap));
  const top=nose.bottom+gap, bottom=mouth.top-gap;
  const strip=top<bottom?stripX(curves,top,bottom):[];
  const left=strip.filter(x=>x<cx), right=strip.filter(x=>x>cx);
  const moustacheSpan=left.length&&right.length?
    Math.min(.62*rx,cx-Math.max(...left)-gap,Math.min(...right)-cx-gap):0;
  return {cx,rx,ry,chin,side,jaw,gap,obstacles,nose,mouth,eyes,
    hair:hasRenderedHair(options.source),
    temple:face.hairAnchors.attachRight[1],moustacheSpan,top,bottom};
}

function band(top,bottom,crossSection,breaks=[]) {
  if (top>=bottom) return [];
  const count=Math.ceil((bottom-top)/.62);
  const knots=[...new Set([...Array.from({length:count+1},(_,i)=>lerp(top,bottom,i/count)),
    ...breaks.filter(knot=>knot>top&&knot<bottom)])].sort((a,b)=>a-b);
  const sections=knots.map((y,i)=>crossSection(y,(y-top)/(bottom-top),i));
  return [...sections.map(section=>section[0]),...sections.reverse().map(section=>section[1])];
}

// Guard the complete swept band against the expanded obstacle boxes. Include
// all breakpoints so a straight SVG segment cannot cross a guarded corner.
function lateral(frame,top,bottom,profile) {
  const {cx,side,obstacles}=frame;
  const fade=1.2;
  const breaks=obstacles.flatMap(({top,bottom})=>[top-fade,top,bottom,bottom+fade]);
  const half=band(top,bottom,(y,t)=>{
    const edge=side(y);
    const guard=Math.max(0,...obstacles.map(box=>{
      const distance=Math.max(box.top-y,y-box.bottom,0);
      return (1-clamp(distance/fade,0,1))*Math.max(cx-box.left,box.right-cx);
    }));
    const {depth,extension}=profile(edge,t);
    const inner=Math.max(guard,edge-depth);
    return [[cx+inner,y],[cx+Math.max(edge+extension,inner),y]];
  },breaks);
  return [half,half.map(([x,y])=>[2*cx-x,y])];
}

function sideburns(frame,value) {
  const {ry,temple,hair,eyes,mouth}=frame;
  const top=Math.max(temple+(hair?0:.045*ry),Math.min(...eyes.map(box=>box.top))-.11*ry);
  const bottom=lerp(top+.10*ry,Math.max(top+.12*ry,mouth.bottom-.075*ry),value.sideburnLength/100);
  const depth=lerp(.041,.235,value.sideburnWidth/100);
  return {bottom,tipDepth:depth*.80,polygons:lateral(frame,top,bottom,(edge,t)=>({
    depth:edge*depth*lerp(.80,1,Math.sin(Math.PI*t)),
    extension:edge*lerp(.005,.053,value.sideburnWidth/100)*lerp(.78,.25,t)
  }))};
}

function beardLength(frame,value) {
  return frame.ry*value.length/100;
}

function cheeks(frame,value,burns) {
  const {ry,eyes,chin}=frame;
  const start=Math.max(...eyes.map(box=>box.bottom))+.023*ry;
  const top=burns?burns.bottom-.032*ry:start;
  const bottom=chin-.105*ry;
  const fullness=value.volume/100;
  return lateral(frame,top,bottom,(edge,t)=>({
    depth:edge*lerp(burns?burns.tipDepth*.92:.025,
      lerp(.085,.73,fullness)*lerp(.82,1,t),ease(clamp(t/.24,0,1))),
    extension:(frame.rx*.085*fullness+beardLength(frame,value)*.085)*Math.sin(Math.PI*t)**1.5
  }));
}

function moustacheLimits(frame,width,thickness) {
  const {top,bottom,ry,moustacheSpan}=frame;
  const room=bottom-top;
  const minThickness=.22, nominal=.105*ry;
  const maxThickness=Math.min(nominal,.86*room);
  if (maxThickness<=minThickness||moustacheSpan<=1.65) return null;
  const max=Math.floor(1e6*100*clamp((maxThickness-minThickness)/(nominal-minThickness),0,1))/1e6;
  const height=lerp(minThickness,nominal,Math.min(thickness,max)/100);
  const span=lerp(moustacheSpan*.29,moustacheSpan,width/100);
  const rise=.084*ry*lerp(.48,1,width/100);
  // The profile tapers towards either tip. The available headroom is checked
  // against the widest part as well, yielding a conservative curl bound.
  const curl=Math.min(100,Math.floor(1e6*100*(room-height)/(2*rise))/1e6);
  return {max,span,height,rise,curl};
}

function moustache(frame,value,limit) {
  const {cx,top,bottom}=frame;
  const middle=(top+bottom)/2;
  const tilt=value.moustacheCurl/100;
  return band(-limit.span,limit.span,(x)=>{
    const t=Math.abs(x)/limit.span;
    const lobe=Math.sin(Math.PI*t)**.73;
    const centre=middle-tilt*limit.rise*t*t;
    const half=limit.height/2*(.65*lobe+.35*(1-t));
    return [[cx+x,centre-half],[cx+x,centre+half]];
  },[0]);
}

function chinTop(frame) {
  const {mouth,gap,chin,ry}=frame;
  return Math.min(chin-.038*ry,Math.max(mouth.bottom+gap+.046*ry,chin-.185*ry));
}

function soulPatch(frame,value) {
  const {cx,rx,ry,mouth,gap}=frame;
  const top=mouth.bottom+gap;
  const bottom=value.zones.chin?Math.max(top+.06*ry,chinTop(frame)+.015*ry):top+.09*ry;
  return band(top,bottom,(y,t)=>{
    const half=rx*lerp(.107,.038,ease(t));
    return [[cx-half,y],[cx+half,y]];
  });
}

function chinPatch(frame,value) {
  const {cx,rx,ry,chin,side}=frame;
  const top=chinTop(frame);
  const volume=value.volume/100, point=value.chinShape/100;
  const half=Math.min(side(top)*.86,rx*lerp(.24,.59,volume));
  const length=beardLength(frame,value);
  return band(-half,half,(x)=>{
    const t=Math.abs(x)/half;
    const taper=lerp(Math.sqrt(Math.max(0,1-t*t)),1-t,point);
    return [[cx+x,top+ry*.027*t*t],
      [cx+x,lerp(top+ry*.04,chin+length*lerp(.19,.41,volume)+point*.038*ry,taper)]];
  },[0]);
}

function jawBand(frame,value) {
  const {cx,rx,ry,mouth,side,jaw,gap}=frame;
  const floor=mouth.bottom+gap;
  const span=side(floor+.029*ry)*.986;
  const fullness=value.volume/100, point=value.chinShape/100, length=beardLength(frame,value);
  return band(-span,span,(x)=>{
    const t=Math.abs(x)/span;
    const edge=jaw(Math.abs(x));
    const depth=ry*lerp(.061,.175,fullness)*lerp(1,.68,t*t);
    const extension=(.009*ry+length*lerp(.14,.32,fullness))*lerp(1-t**2,1-t,point);
    return [[cx+x*(1-.10*t*t),Math.max(floor,edge-depth)],
      [cx+x+Math.sign(x)*rx*(.017+.065*fullness)*t*t,Math.max(floor+.019*ry,edge)+extension]];
  },[0]);
}

function outline(points) {
  const area=points.reduce((sum,[x,y],i)=>{
    const [nx,ny]=points[(i+1)%points.length];
    return sum+x*ny-y*nx;
  },0);
  if (Math.abs(area)<1e-6) return '';
  const oriented=area>0?points:[...points].reverse();
  return 'M'+oriented.map(([x,y])=>x.toFixed(4)+','+y.toFixed(4)).join('L')+'Z';
}

function mix(skin,ink,amount) {
  const base=rgb(skin);
  return '#'+rgb(ink).map((channel,i)=>Math.round(lerp(base[i],channel,amount)*255).toString(16).padStart(2,'0')).join('');
}

export function solveBeard(face,opening,beard,options={}) {
  const requested=normalizeBeard(beard);
  if (!requested) return null;
  const category=beardCategoryOf(options.category);
  const source=options.source??inherited(face.state,options);
  const frame=faceFrame(face,opening,{...options,source});
  const effective={...requested,zones:{...requested.zones}};
  if (category==='F') for(const key of zoneKeys) effective.zones[key]=false;
  const limit=moustacheLimits(frame,requested.moustacheWidth,requested.moustacheThickness);
  const zones=effective.zones;
  zones.moustache&&=!!limit;
  if (zones.moustache) {
    effective.moustacheThickness=Math.min(requested.moustacheThickness,limit.max);
    effective.moustacheCurl=clamp(requested.moustacheCurl,-limit.curl,limit.curl);
  }
  const lower=zones.cheeks||zones.chin||zones.jaw;
  const active=Object.values(zones).includes(true);
  const hasVisibleDensity=requested.density>0;
  const domain=(key,enabled,max=beardControls[key].max,min=beardControls[key].min)=>
    hasVisibleDensity&&enabled&&max>min?[min,max]:[];
  const domains={
    length:domain('length',lower),volume:domain('volume',lower),
    density:active?[0,100]:[],chinShape:domain('chinShape',zones.chin||zones.jaw),
    moustacheWidth:domain('moustacheWidth',zones.moustache),
    moustacheThickness:domain('moustacheThickness',zones.moustache,limit?.max),
    moustacheCurl:domain('moustacheCurl',zones.moustache,limit?.curl,-(limit?.curl??0)),
    sideburnLength:domain('sideburnLength',zones.sideburns),sideburnWidth:domain('sideburnWidth',zones.sideburns)
  };
  const burns=zones.sideburns&&sideburns(frame,effective);
  const polygons={
    sideburns:burns?burns.polygons:[],
    cheeks:zones.cheeks?cheeks(frame,effective,burns):[],
    moustache:zones.moustache?[moustache(frame,effective,limit)]:[],
    soulPatch:zones.soulPatch?[soulPatch(frame,effective)]:[],
    chin:zones.chin?[chinPatch(frame,effective)]:[],
    jaw:zones.jaw?[jawBand(frame,effective)]:[]
  };
  const path=hasVisibleDensity?Object.values(polygons).flat().map(outline).join(''):'';
  const base=facialPigment(face,effective,{...options,source});
  const pigment={...base,stroke:contour(base.fill)};
  const density=effective.density/100;
  const paint={fill:mix(facePalette.skin,pigment.fill,density),stroke:mix(facePalette.skin,pigment.stroke,density)};
  for (const [key,range] of Object.entries(domains)) if (!range.length) effective[key]=null;
  return {category,requested,effective,pigment,paint,domains,frame,polygons,path,available:{moustache:!!limit}};
}

function context(input,eyes,options) {
  const face=model(input), opening=eyesFor(input,eyes);
  const detailResult=solveDetails(opening,options.details);
  const noseResult=solveNose(face,opening,options.nose,{mouth:options.mouth,eyeDetails:detailResult});
  const mouthResult=solveMouth(face,opening,options.mouth,{noseBounds:noseResult?.geometry.anatomy,preserveMouth:!!noseResult});
  return {face,opening,options:{...options,detailResult,noseResult,mouthResult}};
}

export function beardFor(input,eyes,beard,options={}) {
  const portrait=context(input,eyes,options);
  return solveBeard(portrait.face,portrait.opening,beard,portrait.options);
}

export function drawBeard(input,eyes,seed,options={}) {
  if (beardCategoryOf(options.category)==='F') throw new RangeError('Tirage de pilosité indisponible pour F.');
  const {face,opening,options:resolved}=context(input,eyes,options);
  const frame=faceFrame(face,opening,{...resolved,source:inherited(input,options)});
  const index=seededIndex(beardDrawVersion+'\0'+seed);
  const moustacheFits=!!moustacheLimits(frame,0,0);
  const zones=Object.fromEntries(zoneKeys.map(key=>[key,(key!=='moustache'||moustacheFits)&&index(2)===1]));
  const draw=Object.fromEntries(axes.map(([key,{min,max}])=>[key,min+index(max-min+1)]));
  if (zones.moustache) {
    const limit=moustacheLimits(frame,draw.moustacheWidth,0);
    draw.moustacheThickness=index(Math.floor(limit.max)+1);
    const curl=Math.floor(moustacheLimits(frame,draw.moustacheWidth,draw.moustacheThickness).curl);
    draw.moustacheCurl=index(2*curl+1)-curl;
  }
  return normalizeBeard({...draw,zones,colourMode:['hair','darker','independent'][index(3)],colour:palette[index(palette.length)].id});
}

export function beardMarkup(result) {
  if (!result?.path) return '';
  const {fill,stroke}=result.paint;
  // Single nonzero fill of consistently wound regions. It covers the stroke
  // wherever two regions overlap. Only the exterior rim remains visible.
  return '<g data-bio-facial-hair=""><path d="'+result.path+'" fill="'+fill+'" stroke="'+stroke+
    '" stroke-width="'+beardStroke+'" stroke-linejoin="round" paint-order="stroke fill"/></g>';
}
