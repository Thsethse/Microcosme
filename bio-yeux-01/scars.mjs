import {rgb} from '../bio-col-01/palette.mjs';
import {model} from '../preview/bio-vis-p5-i6/model.mjs';
import {headMarkup} from '../preview/bio-vis-p5-i6/i5/i4/i3/i2/i1/base/r1/p2/base/render.mjs';
import {palette} from '../preview/bio-vis-p5-i6/i5/i4/i3/i2/i1/base/r1/p2/base/model.mjs';
import {seededIndex} from './draw.mjs';
import {eyesFor} from './eyes.mjs';
import {cutaneousOutline,cutaneousRim,marksFrame} from './marks.mjs';
import {inheritedMouth,mouthMarkup,solveMouth} from './mouth.mjs';
import {noseMarkup,solveNose} from './nose.mjs';

const clamp=(n,min,max)=>Math.max(min,Math.min(max,n));
const mix=(a,b,t)=>a+(b-a)*t;
const τ=2*Math.PI;
const axis=(label,min,max,initial)=>Object.freeze({label,min,max,initial});
export const scarAxes=Object.freeze({
  x:axis('Position horizontale',0,100,31),y:axis('Position verticale',0,100,63),
  length:axis('Longueur',0,100,46),width:axis('Largeur',0,100,24),
  angle:axis('Orientation',0,360,72),curve:axis('Courbure',-100,100,0),
  irregularity:axis('Irrégularité',0,100,14),intensity:axis('Intensité chromatique',0,100,67),
  traces:axis('Nombre de traces',1,5,1),spacing:axis('Espacement des traces',0,100,34),
  maturity:axis('Maturation graphique',0,100,47)
});
const axes=Object.entries(scarAxes);
const example=(label,values)=>Object.freeze({label,values:Object.freeze(values)});
export const scarPresets=Object.freeze({
  linear:example('Linéaire',{x:27,y:68,length:48,width:24,angle:65,irregularity:0}),
  curved:example('Courbe',{x:65,y:57,length:59,width:23,angle:74,curve:59,irregularity:11}),
  irregular:example('Irrégulière',{x:37,y:59,length:65,width:28,angle:112,curve:-20,irregularity:81}),
  multiple:example('Multiple',{x:67,y:70,length:38,width:14,angle:109,curve:-17,irregularity:25,traces:3,spacing:40}),
  sutured:example('Suturée',{x:31,y:69,length:48,width:28,angle:48,curve:25,irregularity:19,sutures:true}),
  surface:example('Surfacique',{mode:'patch',x:71,y:68,length:39,width:54,angle:23,irregularity:59})
});
export const scarStages=Object.freeze([[0,'Récente'],[34,'Intermédiaire'],[72,'Ancienne'],[100,'Très ancienne']]);
export const scarDrawVersion='scar-uv-xoshiro128ss-v1';
const dimensions={line:{length:[3.8,51],width:[.32,4.6]},patch:{length:[3.9,32],width:[1.3,21]}};

export function normalizeScars(value) {
  if(value==null||value==='historical') return [];
  if(!Array.isArray(value)||value.length>16) throw new RangeError('L’atelier accepte jusqu’à seize cicatrices.');
  const ids=new Set();
  return value.map(scar=>{
    if(!scar||!/^s[1-9]\d{0,8}$/.test(scar.id)||typeof scar.id!=='string'||ids.has(scar.id)) {
      throw new RangeError('Identifiant de cicatrice invalide ou dupliqué.');
    }
    ids.add(scar.id);
    const {id,mode='line',seed='Microcosme '+id}=scar;
    if(!Object.hasOwn(dimensions,mode)||typeof seed!=='string'||seed.length>128) throw new RangeError('Cicatrice invalide.');
    const values=Object.fromEntries(axes.map(([key,{min,max,initial}])=>[key,
      Number.isFinite(scar[key])?clamp(scar[key],min,max):initial]));
    return {id,mode,seed,...values,traces:Math.round(values.traces),sutures:scar.sutures===true};
  });
}

const random=seed=>seededIndex(scarDrawVersion+'\0'+seed);
const entropy=index=>index(1<<24)/(1<<24);
const texture=seed=>{
  const index=random(seed);
  return {phase:entropy(index)*τ,rim:Array.from({length:15},()=>entropy(index))};
};

function axisLength(value,key) {
  return mix(...dimensions[value.mode][key],value[key]/100);
}

function period(value) {
  if(value.irregularity||value.mode==='line'&&value.curve) return 360;
  if(value.mode==='patch'&&Math.abs(axisLength(value,'width')-axisLength(value,'length'))<1e-5) return 0;
  return 180;
}

// All coordinates are authored once in a neutral head metric. Each vertex
// then follows the same two cutaneous coordinates through morphologies.
function chartTransform(value) {
  const modulus=period(value);
  const a=modulus?value.angle%modulus*τ/360:0;
  const c=Math.cos(a),s=Math.sin(a);
  return ([x,y])=>[value.x+(c*x-s*y)/.58,value.y+(s*x+c*y)/.88];
}

function tapered(spine) {
  return (fraction,shift=0)=>[
    ...spine.map(({x,y,nx,ny,r})=>[x+nx*(shift+fraction)*r,y+ny*(shift+fraction)*r]),
    ...[...spine].reverse().map(({x,y,nx,ny,r})=>[x+nx*(shift-fraction)*r,y+ny*(shift-fraction)*r])
  ];
}

function lineParts(value,detail,phase) {
  const L=axisLength(value,'length'),W=axisLength(value,'width');
  const amplitude=value.irregularity*.01*L;
  const rise=value.curve*.01*L*.255;
  const pitch=W*1.06+mix(.37,3.7,value.spacing/100);
  const wave=s=>rise*s*s+amplitude*(.043*(Math.sin(s*2.65+phase)-Math.sin(phase))+
    .018*(Math.sin(s*7.15-phase)-Math.sin(-phase)));
  const steps=Math.max(14,Math.ceil(L/1.2));
  const path=(s,lateral)=>{
    const dx=L/2,dy=(wave(s+.0001)-wave(s-.0001))/.0002;
    const theta=Math.atan2(dy,dx), nx=-Math.sin(theta),ny=Math.cos(theta);
    return {x:dx*s+nx*lateral,y:wave(s)+ny*lateral,nx,ny};
  };
  const parts=Array.from({length:value.traces},(_,i)=>{
    const offset=(i-(value.traces-1)/2)*pitch;
    const spine=Array.from({length:steps+1},(_,j)=>{
      const t=j/steps,s=2*t-1;
      const r=W*.5*(.09+.91*Math.sin(Math.PI*t)**.63)*
        (1+value.irregularity/100*.16*Math.sin(s*12+phase));
      return {...path(s,offset),r};
    });
    return {band:tapered(spine)(1),spine};
  });
  const stitches=[];
  if(value.sutures){
    const count=clamp(Math.floor(L/4.05),2,9);
    for(const {spine} of parts) for(let i=0;i<count;i++){
      const at=Math.round((.16+.68*(i+.5)/count)*steps);
      const {x,y,nx,ny,r}=spine[at];
      const reach=Math.min(L*.175,Math.max(.56,W*.77));
      const thickness=Math.max(.16,Math.min(W*.17,.48));
      for(const sign of [-1,1]) {
        const a=.72*r, b=r+reach;
        const point=(displacement,width)=>
          [x+nx*displacement*sign-ny*width,y+ny*displacement*sign+nx*width];
        stitches.push([point(a,0),point((a+b)*.5,thickness),
          point(b,0),point((a+b)*.5,-thickness*.76)]);
      }
    }
  }
  const age=value.maturity/100;
  return {
    rims:[...parts.map(({band})=>band),...stitches],
    layers:detail?{
      rim:parts.map(({band})=>band),centre:parts.map(({spine})=>tapered(spine)(mix(.46,.57,age),-.06)),
      light:parts.map(({spine})=>tapered(spine)(mix(.15,.25,age),.35)),
      suture:stitches
    }:null
  };
}

function patchParts(value,detail,variation) {
  const rx=axisLength(value,'length')/2,ry=axisLength(value,'width')/2;
  const rim=cutaneousRim(rx,ry,value.irregularity,variation);
  const lift=value.maturity/100;
  const inset=(w,h,dx,dy)=>rim.map(([x,y])=>[x*w+rx*dx,y*h+ry*dy]);
  return {rims:[rim],layers:detail?{rim:[rim],centre:[inset(.72+lift*.08,.65,-.06,.04)],
    light:[inset(.51+lift*.12,.22+lift*.05,.10,-.29)],suture:[]}:null};
}

function build(frame,value,grain,detail=false) {
  const transform=chartTransform(value);
  const local=value.mode==='line'?lineParts(value,detail,grain.phase):patchParts(value,detail,grain.rim);
  const rims=local.rims.map(rim=>rim.map(transform));
  if(rims.some(rim=>rim.some(([u,v])=>u<=0||v<=0||u>=100||v>=100))) return null;
  const project=rim=>rim.map(([u,v])=>frame.plane.point(u,v));
  const outlines=rims.map(project);
  // Each quadratic lies inside the hull of three successive vertices. Test
  // the full strip traversed by that hull against the real facial contour.
  const admissible=box=>{
    const broad={...box,top:Math.floor(box.top),bottom:Math.ceil(box.bottom)};
    return frame.plane.contains(broad)||frame.plane.contains(box);
  };
  if(outlines.some(rim=>!admissible(span(rim))&&(rim.some(p=>!frame.plane.contains(span([p])))||
    rim.some((_,i)=>!admissible(span([rim[i],rim[(i+1)%rim.length],rim[(i+2)%rim.length]])))
  ))) return null;
  if(!detail) return true;
  const layers=Object.fromEntries(Object.entries(local.layers).map(([key,rims])=>
    [key,rims.map(rim=>project(rim.map(transform)))]));
  return {rims:outlines,layers};
}

export function scarFrame(face,opening,options={}) {
  return marksFrame(face,opening,options);
}

function span(points) {
  const xs=points.map(p=>p[0]),ys=points.map(p=>p[1]);
  return {left:Math.min(...xs),right:Math.max(...xs),top:Math.min(...ys),bottom:Math.max(...ys)};
}
const over=(a,b)=>a.left<b.right&&a.right>b.left&&a.top<b.bottom&&a.bottom>b.top;

function meetsReserve(rim,area) {
  const x=(area.left+area.right)/2,y=(area.top+area.bottom)/2;
  let inside=false;
  for(const [i,p] of rim.entries()){
    const q=rim[(i+1)%rim.length];
    if(over(span([p,q]),area)) return true;
    if((p[1]>y)!==(q[1]>y)&&x<p[0]+(q[0]-p[0])*(y-p[1])/(q[1]-p[1])) inside=!inside;
  }
  return inside;
}

function solve(frame,request,withDomains) {
  const grain=texture(request.seed);
  const value={...request};
  const line=value.mode==='line';
  const parallel=line&&value.traces>1;
  const fit=props=>build(frame,props,grain);
  const proposals=['length','width',...(parallel?['spacing']:[])];
  const start={...value,...Object.fromEntries(proposals.map(key=>[key,0]))};
  let canDraw=fit(value);
  function maximum(base,key,max=100) {
    if(fit({...base,[key]:max})) return max;
    if(!fit({...base,[key]:0})) return null;
    let lo=0,hi=max;
    for(let i=0;i<10;i++){
      const middle=(lo+hi)/2;
      if(fit({...base,[key]:middle})) lo=middle;
      else hi=middle;
    }
    return Math.floor(lo*100)/100;
  }
  if(!canDraw&&fit(start)) {
    Object.assign(value,start);
    for(const key of proposals) value[key]=maximum(value,key,request[key]);
    canDraw=true;
  }
  const geometry=canDraw&&value.intensity?build(frame,value,grain,true):null;
  const anglePeriod=period(value);
  const domains={};
  if(withDomains){
    const active=!!geometry;
    const allowed=(enabled,min,max)=>enabled?[min,max]:[];
    // A placement is selectable if its minimum footprint fits. A remembered
    // position remains reachable so the user can recover by moving either axis.
    const placement=key=>{
      if(!value.intensity) return [];
      const measured=Array.from({length:101},(_,i)=>i);
      const usable=measured.filter(n=>fit({...start,[key]:n}));
      return [...new Set([...(usable.length?usable:measured),request[key]])].sort((a,b)=>a-b);
    };
    Object.assign(domains,{x:placement('x'),y:placement('y'),
      length:active?[0,maximum(value,'length')]:[],width:active?[0,maximum(value,'width')]:[],
      angle:allowed(active&&anglePeriod>0,0,anglePeriod-1),curve:allowed(active&&line,-100,100),
      irregularity:allowed(active,0,100),intensity:[0,100],maturity:allowed(active,0,100),
      traces:active&&line?[1,2,3,4,5].filter(traces=>traces===value.traces||fit({...start,traces})):[],
      spacing:active&&parallel?[0,maximum(value,'spacing')]:[],
      sutures:active&&line&&(value.sutures||fit({...start,sutures:true}))});
  }
  const interruptions=geometry?Object.entries({yeux:frame.eyes,lèvres:[frame.lips],narines:frame.nostrils})
    .filter(([,areas])=>areas.some(area=>geometry.rims.some(rim=>meetsReserve(rim,area)))).map(([key])=>key):[];
  const applied={...value,angle:anglePeriod?value.angle%anglePeriod:null,
    curve:line?value.curve:null,traces:line?value.traces:null,
    spacing:parallel?value.spacing:null,sutures:line?value.sutures:null};
  if(!geometry) for(const key of Object.keys(scarAxes)) if(!['x','y','intensity'].includes(key)) applied[key]=null;
  return {requested:request,effective:{...applied,reason:!request.intensity?'intensité':geometry?null:'contour',interruptions},
    domains,geometry};
}

export function solveScars(face,opening,scars,options={}) {
  const requested=normalizeScars(scars);
  if(!requested.length) return null;
  const frame=scarFrame(face,opening,options);
  const items=requested.map(scar=>solve(frame,scar,options.withDomains&&(!options.domainId||options.domainId===scar.id)));
  return {requested,effective:items.map(item=>item.effective),items,frame};
}

function portrait(input,eyes,options) {
  const face=model(input),opening=eyesFor(input,eyes);
  const noseResult=solveNose(face,opening,options.nose,{mouth:options.mouth,details:options.details});
  const mouthResult=solveMouth(face,opening,options.mouth,{noseBounds:noseResult?.geometry.anatomy,preserveMouth:!!noseResult});
  return {face,opening,options:{...options,noseResult,mouthResult}};
}

export function scarsFor(input,eyes,scars,options={}) {
  const context=portrait(input,eyes,options);
  return solveScars(context.face,context.opening,scars,context.options);
}

export function drawScar(input,eyes,id,seed,options={}) {
  if(typeof seed!=='string') throw new TypeError('Graine textuelle requise.');
  const index=random(seed),presets=Object.values(scarPresets);
  const context=portrait(input,eyes,options);
  const frame=scarFrame(context.face,context.opening,context.options);
  for(let attempt=0;attempt<96;attempt++){
    const {values}=presets[index(presets.length)];
    const [request]=normalizeScars([{...values,id,seed,x:24+index(53),y:27+index(58),
      angle:index(360),length:17+index(46),width:10+index(36),maturity:index(101),intensity:39+index(54)}]);
    const geometry=build(frame,request,texture(seed),true);
    if(!geometry) continue;
    const covered=[...frame.eyes,frame.lips,...frame.nostrils];
    if(!geometry.rims.some(rim=>rim.some(([x,y])=>
      !covered.some(area=>x>=area.left&&x<=area.right&&y>=area.top&&y<=area.bottom)))) continue;
    return request;
  }
  throw new RangeError('Aucun placement admissible pour cette graine.');
}

// Offsets pair darkening (fraction of the skin channel) and lightening
// (fraction of the available headroom). Maturity follows a colour trajectory
// and changes the width of the central relief. Intensity scales contrast.
const pigment=[
  {at:0,core:[.083,-.27,-.25],edge:[-.10,-.18,-.16],lift:[.18,.048,.04]},
  {at:34,core:[.047,-.16,-.147],edge:[-.08,-.13,-.12],lift:[.20,.12,.083]},
  {at:72,core:[.21,.18,.132],edge:[-.058,-.09,-.087],lift:[.26,.22,.17]},
  {at:100,core:[.052,.056,.052],edge:[-.025,-.034,-.032],lift:[.078,.080,.071]}
];

export function scarColours(skin,maturity,intensity,scale='head') {
  const base=rgb(skin);
  const stop=Math.max(1,pigment.findIndex(item=>item.at>=maturity));
  const a=pigment[stop-1],b=pigment[stop];
  const progress=(maturity-a.at)/(b.at-a.at);
  const strength=intensity/100*(scale==='mini'?1.16:1);
  const colour=(key,factor=1)=>'rgb('+base.map((channel,i)=>{
    const change=mix(a[key][i],b[key][i],progress)*strength*factor;
    return +(255*clamp(channel+(change<0?channel:1-channel)*change,0,1)).toFixed(2);
  }).join(',')+')';
  return {rim:colour('edge'),centre:colour('core'),light:colour('lift'),suture:colour('core',.73)};
}

function black(markup) {
  return markup.replace(/\bfill="(?!none)[^"]*"/g,'fill="black"').replace(/\bstroke="(?!none)[^"]*"/g,'stroke="black"');
}

export function scarReserves(face,opening,{markup=headMarkup(face.base),mouthResult,noseResult}={}) {
  const eyes=opening.shapes.length?opening.shapes.map(shape=>
    `<path d="${shape.path}" fill="black" stroke="black" stroke-width=".12"/>`):
    [...markup.matchAll(/<ellipse\b[^>]*\/>/g)].map(([tag])=>tag).filter(tag=>tag.includes('fill="'+palette.white+'"')).map(black);
  const lips=mouthResult?[...mouthMarkup(mouthResult).matchAll(/<path\b[^>]*\/>/g)].map(([tag])=>black(tag)):
    [black(inheritedMouth(face,markup).tag)];
  // The inherited triangular nose has no nostril interior. Hidden custom
  // nasal relief keeps its mathematical openings in the same positions.
  const nose=noseResult?{...noseResult,applied:{...noseResult.applied,fills:0,lines:1}}:null;
  const nostrils=nose?[...noseMarkup(nose).matchAll(/<ellipse data-nose-region="nostrils"[^>]*\/>/g)].map(([tag])=>black(tag)):[];
  return {eyes,lips,nostrils};
}

export function scarsMarkup(result,{skin=palette.skin,scale='head',face,opening,instance,...options}) {
  if(!result?.items.some(item=>item.geometry)) return '';
  const {cx,cy,rx,ry}=face.base.head;
  const left=cx-2*rx,top=cy-2*ry,width=4*rx,height=4*ry;
  const carve=Object.values(scarReserves(face,opening,options)).flat().join('');
  let hash=2166136261;
  for(const ch of carve+face.outline) hash=Math.imul(hash^ch.charCodeAt(0),16777619);
  const key='scar-'+String(instance??'default').replace(/[^a-z0-9_-]/gi,'-')+'-'+(hash>>>0).toString(36);
  const mask=`<mask id="${key}" maskUnits="userSpaceOnUse" x="${left}" y="${top}" width="${width}" height="${height}" style="mask-type:luminance"><rect x="${left}" y="${top}" width="${width}" height="${height}" fill="white"/>${carve}</mask>`;
  const paths=result.items.filter(item=>item.geometry).map(({requested,geometry})=>{
    const colours=scarColours(skin,requested.maturity,requested.intensity,scale);
    const ink=Object.entries(geometry.layers).flatMap(([layer,parts])=>scale==='mini'&&layer==='light'?[]:
      parts.map(poly=>`<path data-scar-relief="${layer}" d="${cutaneousOutline(poly)}" fill="${colours[layer]}"/>`));
    return `<g data-scar-id="${requested.id}" data-scar-mode="${requested.mode}">${ink.join('')}</g>`;
  }).join('');
  return `<g data-bio-scars=""><defs>${mask}</defs><g mask="url(#${key})">${paths}</g></g>`;
}
