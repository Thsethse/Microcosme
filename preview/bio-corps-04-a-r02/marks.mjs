import {rgb} from '../bio-col-01/palette.mjs';
import {model} from '../bio-vis-p5-i6/model.mjs';
import {palette} from '../bio-vis-p5-i6/i5/i4/i3/i2/i1/base/r1/p2/base/model.mjs';
import {seededIndex} from './draw.mjs';
import {eyesFor,eyeStroke} from './eyes.mjs';
import {auditHistoricalMouth,solveMouth} from './mouth.mjs';
import {solveNose} from './nose.mjs';
import {cutaneousSurface} from './surface.mjs';

const clamp=(n,min=0,max=100)=>Math.max(min,Math.min(max,n));
const mix=(a,b,t)=>a+(b-a)*t;
const precise=n=>+n.toFixed(4);
const rand=index=>index(1<<24)/(1<<24);
const random=seed=>seededIndex('marks-surface-v1\0'+seed);

export const markShapes=Object.freeze({circle:'Circulaire',oval:'Ovale',irregular:'Irrégulière',diffuse:'Diffuse'});
export const markTones=Object.freeze({brown:'Brune',dark:'Foncée',rose:'Rosée',light:'Claire'});
export const markZones=Object.freeze({
  forehead:'Front',temples:'Tempes',nose:'Nez',cheeks:'Joues',perioral:'Pourtour de la bouche',jaw:'Menton et mâchoire'
});
export const markTypes=Object.freeze({
  mole:{label:'Grain de beauté',form:'individual',shape:'circle',tone:'dark',size:28,x:30,y:70,radii:[.31,1.68]},
  birth:{label:'Tache de naissance',form:'individual',shape:'irregular',tone:'rose',size:44,x:76,y:71,radii:[.8,6.4]},
  pigment:{label:'Tache pigmentaire',form:'individual',shape:'diffuse',tone:'light',size:39,x:27,y:75,radii:[.6,5.4]},
  freckles:{label:'Groupe de taches de rousseur',form:'group',shape:'irregular',tone:'brown',size:45,capacity:44,
    radii:[.25,.78],zones:['nose','cheeks'],density:64,sizeVariation:65,intensity:58},
  pigmentGroup:{label:'Groupe de taches pigmentaires',form:'group',shape:'diffuse',tone:'light',size:35,capacity:12,
    radii:[.36,2.2],zones:['temples','cheeks'],density:42,sizeVariation:57,intensity:64}
});
export const individualMarkAxes=Object.freeze({
  x:'Position horizontale',y:'Position verticale',size:'Taille',elongation:'Allongement',
  irregularity:'Irrégularité',intensity:'Intensité chromatique',angle:'Orientation'
});
export const groupMarkAxes=Object.freeze({
  density:'Densité',extent:'Étendue',size:'Taille moyenne',sizeVariation:'Variation des tailles',intensity:'Intensité chromatique'
});

function option(table,key) {
  if (!Object.hasOwn(table,key)) throw new RangeError('Réglage de marque inconnu.');
  return key;
}

export function normalizeMarks(values) {
  if (values==null||values==='historical') return [];
  if (!Array.isArray(values)||values.length>24) throw new RangeError('L’atelier accepte jusqu’à 24 marques et groupes.');
  const identities=new Set();
  return values.map(item=>{
    if (!item||typeof item!=='object'||typeof item.id!=='string'||!/^m[1-9]\d{0,8}$/.test(item.id)||identities.has(item.id)) {
      throw new RangeError('Identité de marque invalide ou dupliquée.');
    }
    identities.add(item.id);
    const {id,type}=item, spec=markTypes[option(markTypes,type)];
    const value=(key,neutral,max=100)=>Number.isFinite(item[key])?clamp(item[key],0,max):neutral;
    const common={id,type,shape:option(markShapes,item.shape??spec.shape),tone:option(markTones,item.tone??spec.tone),
      size:value('size',spec.size),intensity:value('intensity',spec.intensity??68)};
    if (spec.form==='individual') return {...common,x:value('x',spec.x),y:value('y',spec.y),
      elongation:value('elongation',42),irregularity:value('irregularity',57),angle:value('angle',23,180)};
    if (item.zones!=null&&(!Array.isArray(item.zones)||item.zones.some(zone=>!Object.hasOwn(markZones,zone)))) {
      throw new RangeError('Zone cutanée inconnue.');
    }
    if (item.seed!=null&&(typeof item.seed!=='string'||item.seed.length>128)) throw new RangeError('Graine de marque invalide.');
    return {...common,seed:item.seed??'Microcosme '+id,
      zones:Object.keys(markZones).filter(key=>(item.zones??spec.zones).includes(key)),
      density:value('density',spec.density),extent:value('extent',72),sizeVariation:value('sizeVariation',spec.sizeVariation)};
  });
}

const expand=({left,right,top,bottom},pad)=>({left:left-pad,right:right+pad,top:top-pad,bottom:bottom+pad});
const over=(a,b)=>a.left<b.right&&a.right>b.left&&a.top<b.bottom&&a.bottom>b.top;

export function marksFrame(face,opening,{noseResult,mouthResult,markup}={}) {
  const {head:{rx,ry,cx},anchors:{eyeLeft,nose,mouth}}=face.base;
  const rows=[[0,face.anchors.crown[1]],[48,eyeLeft[1]],[64,nose[1]],[82,mouth[1]],[100,face.anchors.chin[1]]];
  const plane=cutaneousSurface(face.outline,rows);
  const {width,height}=opening.face.reference;
  const eyes=opening.face.envelopes.map(({x,y},i)=>{
    const [[left,right],[top,bottom]]=opening.shapes[i]?.bounds??[[x-width/2,x+width/2],[y-height/2,y+height/2]];
    return expand({left,right,top,bottom},eyeStroke/2+.13);
  });
  const lips=expand(mouthResult?.box??auditHistoricalMouth(face,opening,{markup}).box,.16);
  const g=noseResult?.geometry.nostril;
  const nostrils=g?.rx?[expand({left:cx+g.left,right:cx+g.right,top:g.top,bottom:g.bottom},.12),
    expand({left:cx-g.right,right:cx-g.left,top:g.top,bottom:g.bottom},.12)]:[];
  const obstacles=[...eyes,lips,...nostrils];
  const obstruction=box=>!plane.contains(box)?'contour':obstacles.some(ink=>over(ink,box))?'anatomie':null;
  return {rx,ry,plane,obstruction,eyes,lips,nostrils};
}

export function cutaneousOutline(points) {
  const xy=([x,y])=>precise(x)+','+precise(y);
  const mid=([x,y],[a,b])=>xy([(x+a)/2,(y+b)/2]);
  return 'M'+mid(points.at(-1),points[0])+points.map((p,i)=>
    'Q'+xy(p)+' '+mid(p,points[(i+1)%points.length])).join('')+'Z';
}

export function cutaneousRim(w,h,irregularity,variation) {
  return variation.map((n,i)=>{
    const t=i*2*Math.PI/variation.length;
    const scale=1+irregularity/100*.51*(n-.5);
    return [w*Math.cos(t)*scale,h*Math.sin(t)*scale];
  });
}

function silhouette(x,y,r,{shape,elongation,angle,irregularity},variation) {
  const ratio=shape==='circle'?1:mix(1,.48,elongation/100);
  const direction=shape==='irregular'&&irregularity?angle:angle%180;
  const tilt=direction*Math.PI/180, a=Math.cos(tilt), b=Math.sin(tilt);
  const w=r, h=r*ratio;
  const path=irregularity&&shape==='irregular'?cutaneousRim(w,h,irregularity,variation)
    .map(([u,v])=>[x+a*u-b*v,y+b*u+a*v]):null;
  const dx=Math.hypot(a*w,b*h),dy=Math.hypot(b*w,a*h);
  const box=path?{left:Math.min(...path.map(p=>p[0])),right:Math.max(...path.map(p=>p[0])),
      top:Math.min(...path.map(p=>p[1])),bottom:Math.max(...path.map(p=>p[1]))}:
    {left:x-dx,right:x+dx,top:y-dy,bottom:y+dy};
  return {x,y,r,box,ink:(fill,scale=1)=>path?`<path d="${cutaneousOutline(path)}" fill="${fill}"/>`:
    `<ellipse cx="${precise(x)}" cy="${precise(y)}" rx="${precise(w*scale)}" ry="${precise(h*scale)}"${ratio!==1&&direction?
      ` transform="rotate(${precise(direction)} ${precise(x)} ${precise(y)})"`:''} fill="${fill}"/>`};
}

const radii=(type,frame)=>markTypes[type].radii.map(r=>r*Math.sqrt(frame.rx*frame.ry/(29*44)));
const varies=index=>Array.from({length:9},()=>rand(index));

function solveIndividual(frame,item,withDomains) {
  const {plane,obstruction}=frame;
  const dims=radii(item.type,frame);
  const variations=varies(random(item.id));
  const draw=(x,y,size,style=item)=>silhouette(...plane.point(x,y),mix(...dims,size/100),style,variations);
  const reason=obstruction(draw(item.x,item.y,0).box);
  let max=100;
  if (!reason&&obstruction(draw(item.x,item.y,100).box)) {
    let lo=0,hi=100;
    for(let i=0;i<17;i++){
      const candidate=(lo+hi)/2;
      if(obstruction(draw(item.x,item.y,candidate).box)) hi=candidate;
      else lo=candidate;
    }
    max=Math.floor(lo*1000)/1000;
  }
  const active=!!item.intensity&&!reason;
  const size=Math.min(item.size,max);
  const geometry=reason?null:draw(item.x,item.y,size);
  const applied=active?geometry:null;
  const elongates=item.shape!=='circle';
  const rotates=elongates&&(item.elongation>0||item.shape==='irregular'&&item.irregularity>0);
  const domains={};
  if (withDomains) {
    const positions=(key,requested)=>{
      const axis=v=>key==='x'?[v,item.y]:[item.x,v];
      const allowed=Array.from({length:101},(_,i)=>i).filter(v=>!obstruction(draw(...axis(v),reason?0:size).box));
      // Keep the remembered cursor reachable. A row with no candidate
      // remains navigable so both coordinates can be edited independently.
      return allowed.length?[...new Set([...allowed,requested])].sort((a,b)=>a-b):null;
    };
    Object.assign(domains,{x:item.intensity?positions('x',item.x):[],y:item.intensity?positions('y',item.y):[],
      size:active?[0,max]:[],elongation:active&&elongates?[0,100]:[],
      irregularity:active&&item.shape==='irregular'?[0,100]:[],angle:active&&rotates?[0,item.shape==='irregular'&&item.irregularity>0?180:179]:[],
      intensity:intensitySteps(item,geometry?[1]:[])});
  }
  const effective={id:item.id,x:item.x,y:item.y,size:active?size:null,
    elongation:active&&elongates?item.elongation:null,irregularity:active&&item.shape==='irregular'?item.irregularity:null,
    angle:active&&rotates?(item.shape==='irregular'&&item.irregularity>0?item.angle:item.angle%180):null,reason:item.intensity?reason:'intensité'};
  return {requested:item,effective,domains,points:applied?[{id:item.id,geometry:applied,strength:1,variations}]:[]};
}

// [u,v, horizontal spread, vertical spread, slope]. These shapes are
// distributions on skin, not printed zone boundaries. The sloped clusters
// follow cheekbones while the narrow central cluster follows the nasal ridge.
const regions={
  forehead:[[50,28,36,11,0]],
  temples:[[12,38,9,12,-.18],[87,39,8,12,.18]],
  nose:[[50,57,8.3,9.4,.18]],
  cheeks:[[24,64,16,9,.28],[77,63,16,8,-.31]],
  perioral:[[29,80,9,10,-.12],[71,81,9,10,.12]],
  jaw:[[24,88,13,7,.12],[51,93,22,4,0],[77,88,12,7,-.12]]
};
const zoneWeight={forehead:.74,temples:.70,nose:.51,cheeks:1.19,perioral:.67,jaw:.76};

function candidates(item) {
  const freckle=item.type==='freckles';
  const capacity=markTypes[item.type].capacity;
  const count=Math.round(item.density*capacity/100);
  const extent=mix(.73,1,item.extent/100);
  const byZone=item.zones.flatMap(zone=>{
    const index=random(item.seed+'\0'+zone);
    const patches=regions[zone];
    const phase=rand(index)*.85;
    // Independent random streams keep IDs, locations and shapes stable
    // when requesting more sites or switching a different zone on.
    const pool=[];
    for(let attempt=0;attempt<capacity*55&&pool.length<capacity;attempt++){
      const [u,v,w,h,slope]=patches[index(patches.length)];
      const theta=rand(index)*Math.PI*2;
      const distance=rand(index)**.68;
      const du=Math.cos(theta)*w*distance;
      const dv=Math.sin(theta)*h*distance+du*slope;
      const x=u+du, y=v+dv;
      const min=freckle?1.41:3.0;
      if (pool.some(p=>Math.hypot((p.x-x)*.68,(p.y-y)*.77)<min)) continue;
      const rank=pool.length;
      pool.push({id:item.id+'-'+zone+'-'+(rank+1),rank:(rank+phase)/zoneWeight[zone],
        x,y,du,dv,edge:distance,variation:rand(index)*2-1,contrast:rand(index),direction:rand(index)*180,
        elongation:rand(index),variations:varies(index)});
    }
    return pool;
  }).sort((a,b)=>a.rank-b.rank);
  const selected=[];
  const separation=freckle?1.32:2.8;
  for(const site of byZone){
    if(selected.some(other=>Math.hypot((other.x-site.x)*.68,(other.y-site.y)*.77)<separation)) continue;
    selected.push(site);
    if(selected.length===capacity) break;
  }
  return {sites:selected.map(site=>({...site,x:site.x+(extent-1)*site.du,y:site.y+(extent-1)*site.dv})),count,capacity};
}

function solveGroup(frame,item,withDomains) {
  const {sites,count,capacity}=candidates(item);
  const {plane,obstruction}=frame;
  const dims=radii(item.type,frame);
  const mean=mix(...dims,item.size/100);
  const mapped=sites.map(site=>plane.point(site.x,site.y));
  const show=(site,i)=>{
    const [x,y]=mapped[i];
    const near=Math.min(...mapped.map(([a,b],j)=>i===j?Infinity:Math.hypot(x-a,y-b)));
    // Share local spacing across the complete constellation, including latent
    // sites. A tighter budget scales every size value and never flattens an axis.
    const style={shape:item.shape,elongation:13+44*site.elongation,angle:site.direction,
      irregularity:30+site.elongation*32};
    const edge=mix(1.13,.66,site.edge);
    const bump=style.shape==='irregular'?1+.255*style.irregularity/100:1;
    const maximum=dims[1]*(1+Math.max(0,site.variation)*.5)*edge*bump;
    const space=Math.min(1,near*.47/maximum);
    const radius=space*mean*(1+site.variation*item.sizeVariation/100*.50)*edge;
    const geometry=silhouette(x,y,radius,style,site.variations);
    return {...site,geometry,strength:mix(.75,1.09,site.contrast)*mix(1.10,.68,site.edge),reason:obstruction(geometry.box)};
  };
  const surveyed=(withDomains?sites:sites.slice(0,count)).map(show);
  const chosen=surveyed.slice(0,count);
  const points=item.intensity?chosen.filter(p=>!p.reason):[];
  const domains={};
  if(withDomains) {
    const active=!!item.zones.length&&!!item.intensity;
    const indices=surveyed.flatMap((p,i)=>p.reason?[]:[(i+1)*100/capacity]);
    Object.assign(domains,{density:active?[0,...indices]:[],extent:active&&count?[0,100]:[],
      size:active&&count?[0,100]:[],sizeVariation:active&&count?[0,100]:[],
      intensity:item.zones.length?intensitySteps(item,chosen.filter(p=>!p.reason).map(p=>p.strength)):[]});
  }
  const effective={id:item.id,count:chosen.length,visible:points.length,sites:chosen.map(({id,x,y,reason})=>
    ({id,x:precise(x),y:precise(y),reason}))};
  return {requested:item,effective,domains,points};
}

export function solveMarks(face,opening,values,options={}) {
  const requested=normalizeMarks(values);
  if(!requested.length) return null;
  const frame=marksFrame(face,opening,options);
  const marks=requested.map(item=>{
    const withDomains=options.withDomains&&(!options.domainId||options.domainId===item.id);
    return markTypes[item.type].form==='individual'?
      solveIndividual(frame,item,withDomains):solveGroup(frame,item,withDomains);
  });
  return {requested,effective:marks.map(mark=>mark.effective),marks,frame};
}

export function marksFor(input,eyes,values,options={}) {
  const face=model(input), opening=eyesFor(input,eyes);
  const noseResult=solveNose(face,opening,options.nose,{mouth:options.mouth,details:options.details});
  const mouthResult=solveMouth(face,opening,options.mouth,{noseBounds:noseResult?.geometry.anatomy,preserveMouth:!!noseResult});
  return solveMarks(face,opening,values,{...options,noseResult,mouthResult});
}

export function markPigment(skin,tone,intensity) {
  const tones={brown:[.57,.37,.25],dark:[.30,.23,.21],rose:[.89,.41,.42],light:[1.0,.90,.79]};
  const base=rgb(skin);
  const target=tones[option(markTones,tone)];
  const values=base.map((channel,i)=>{
    const ink=tone==='light'?mix(channel,1,target[i]*.48):channel*target[i];
    return Math.round(255*mix(channel,ink,clamp(intensity,0,1)));
  });
  return 'rgb('+values.join(',')+')';
}

const familyStrength={mole:.63,birth:.56,pigment:.50,freckles:.53,pigmentGroup:.48};
function colourLevels(item,skin,strength,intensity) {
  const richness=item.type==='freckles'?mix(1.28,1,clamp((Math.max(...rgb(skin))-.27)/.45,0,1)):1;
  const amount=familyStrength[item.type]*strength*intensity/100*richness;
  return (item.shape==='diffuse'?[.44,.79]:[1]).map(level=>markPigment(skin,item.tone,amount*level));
}

function intensitySteps(item,strengths) {
  // When a colour rounds to the same RGB channels, keep a single stop.
  if (!strengths.length) return [0,100];
  const points=[0];
  let previous=strengths.flatMap(strength=>colourLevels(item,palette.skin,strength,0)).join();
  for(let v=1;v<=100;v++){
    const colour=strengths.flatMap(strength=>colourLevels(item,palette.skin,strength,v)).join();
    if(colour!==previous) points.push(v);
    else if(v===100&&points.length>1) points[points.length-1]=100;
    previous=colour;
  }
  return points;
}

export function marksMarkup(result,{skin=palette.skin,scale='head'}={}) {
  if (!result) return '';
  const inner=result.marks.map(({requested:item,points})=>{
    const freckle=item.type==='freckles';
    const detail=freckle&&scale!=='head';
    const selected=detail?[...points].sort((a,b)=>
      b.geometry.r*b.strength-a.geometry.r*a.strength).slice(0,Math.ceil(points.length*(scale==='mini'?.31:.56))):points;
    return selected.map(({id,geometry,strength,variations})=>{
      const build=(radius)=>silhouette(geometry.x,geometry.y,radius,{...item,shape:'circle'},variations);
      if(detail&&geometry.r<(scale==='mini'?.98:.68)){
        const reserve=Math.min(...selected.map(other=>other.id===id?Infinity:
          Math.hypot(geometry.x-other.geometry.x,geometry.y-other.geometry.y)/2));
        const larger=build(Math.max(geometry.r,Math.min(reserve,scale==='mini'?.98:.68)));
        if(!result.frame.obstruction(larger.box)) geometry=larger;
      }
      const [outer,core]=colourLevels(item,skin,strength,item.intensity);
      const ink=geometry.ink(outer)+(core?geometry.ink(core,.61):'');
      return `<g data-mark-id="${id}" data-mark-family="${item.type}">${ink}</g>`;
    }).join('');
  }).join('');
  return inner?`<g data-bio-marks="">${inner}</g>`:'';
}
