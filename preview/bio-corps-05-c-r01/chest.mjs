import {rgb} from '../bio-col-01/palette.mjs';

export const chestControls = Object.freeze({
  volume: {label:'Volume', min:0, max:100, neutral:0},
  width: {label:'Largeur', min:0, max:100, neutral:50},
  length: {label:'Allongement', min:0, max:100, neutral:46},
  roundness: {label:'Rondeur', min:0, max:100, neutral:62},
  spacing: {label:'Écartement', min:0, max:100, neutral:43},
  sag: {label:'Affaissement', min:0, max:100, neutral:24}
});
const axes = Object.entries(chestControls);
export const referenceChest = Object.freeze(Object.fromEntries(axes.map(([key, {neutral}])=>[key,neutral])));
export const chestStops = Object.freeze([[0,'Plate'],[25,'Petite'],[50,'Moyenne'],[75,'Volumineuse'],[100,'Très volumineuse']]);

export function validateChest(values) {
  if (!values || Object.keys(values).length !== axes.length || axes.some(([key,{min,max}])=>
    !Object.hasOwn(values,key) || !Number.isFinite(values[key]) || values[key]<min || values[key]>max)) {
    throw new RangeError('Les six réglages de poitrine doivent respecter leurs domaines.');
  }
  return values;
}

export function validateChestOrigin(values) {
  if (!values || Object.keys(values).length!==2 || !Number.isFinite(values.divergence) ||
      Math.abs(values.divergence)>100 || !Number.isFinite(values.position) || values.position<0 || values.position>100) {
    throw new RangeError('Les deux anciennes valeurs de poitrine sont invalides.');
  }
  return values;
}

export function chestGeometry(body, values, corpulence = 50) {
  const {volume,width,length,roundness,spacing,sag}=validateChest(values);
  if (volume===0) return null;
  const fullness=corpulence/100, v=volume/100, w=width/100, r=roundness/100, s=sag/100;
  const mass=v**.80*(.88+.12*fullness);
  const shoulder=body.levels[1].y, thorax=body.levels[2].y;
  const anchor=shoulder+.96*(thorax-shoulder);
  const support=body.minimumWidth(anchor,anchor);
  const depth=body.height*mass*(.135+.089*length/100+.075*s);

  // The upper edge is the same skin as the chest wall. The lower arc carries
  // the change of plane and extends independently of this attachment.
  const outline=[
    [.58,.035],[.95,.35+.20*s-.08*r],[.81+.12*r,.68+.10*s],
    [.36+.14*r,.91+.035*s],[-.19,.975],[-.62-.16*r,.80+.065*s],
    [-.88,.48+.12*s],[-.64,.175+.060*s],[-.12,0]
  ];
  const tension=.145+.025*r+.012*fullness;
  const segments=outline.map((point,index)=>{
    const n=outline.length;
    const previous=outline[(index+n-1)%n], next=outline[(index+1)%n], following=outline[(index+2)%n];
    return [point.map((value,i)=>value+tension*(next[i]-previous[i])),
      next.map((value,i)=>value-tension*(following[i]-point[i])),next];
  });
  const [upper,outer]=outline;
  const side=[[.71,.62+.12*s],[.79,.32+.12*s],upper];
  const lower=[[-.55,.86],[.44,.91+.035*s],outer];
  const extents=[...segments.flat(),...side,...lower].map(([x])=>x);
  const left=Math.min(...extents),right=Math.max(...extents);
  const gap=.50+support*(.027+.16*spacing/100)*(.70+.30*mass);
  const allowance=body.height*mass**2*(.082+.069*w);
  const capacity=(support+allowance-gap)/(right-left);
  const breadth=.77+.23*Math.sqrt(support/(.235*body.height));
  const preferred=body.height*(.072+.090*w)*mass**.87*breadth;
  const half=preferred/(1+(preferred/capacity)**4)**.25;
  const center=gap-left*half;
  const lobes=[-1,1].map(sign=>{
    const project=([x,y])=>[body.ground.x+sign*(center+half*x),anchor+depth*y];
    return {base:outline.map(project),segments:segments.map(points=>points.map(project)),
      side:side.map(project),lower:lower.map(project)};
  });
  return {anchor,depth,support,half,center,gap,fullness,lobes};
}

const point=([x,y])=>`${Number(x.toFixed(3))},${Number(y.toFixed(3))}`;
const trace=(start,segments)=>'M'+point(start)+segments.map(segment=>'C'+segment.map(point).join(' ')).join('');
const blend=(skin,tint,weight)=>'#'+rgb(skin).map((value,i)=>
  Math.round(255*(value*(1-weight)+tint[i]*weight)).toString(16).padStart(2,'0')).join('');

export function chestOverlay(body, chest, corpulence, {skin, contour}, studySkin, makeId) {
  const shape=chestGeometry(body,chest,corpulence);
  const paths=shape.lobes.map(({base,segments})=>trace(base[0],segments)+'Z');
  const id=makeId(body.path+paths.join(''));
  const cover=id+'-cover', outside=id+'-outside';
  const sideTone=blend(studySkin,[.24,.13,.09],.085-.018*shape.fullness);
  const lowerTone=blend(studySkin,[.24,.13,.09],.220-.035*shape.fullness);
  const limits='x="-900" y="-900" width="1800" height="1800"';
  const definitions=`<defs data-chest-definitions=""><mask id="${cover}" maskUnits="userSpaceOnUse" ${limits} style="mask-type:luminance"><rect ${limits} fill="white"/>${
    paths.map(d=>`<path d="${d}" fill="black"/>`).join('')}</mask>`+
    `<clipPath id="${outside}"><path d="M-900,-900H900V900H-900Z ${body.path}" clip-rule="evenodd"/></clipPath></defs>`;
  const markup=`<g data-chest="adult-f" aria-hidden="true">${shape.lobes.map(({base,segments,side,lower},i)=>
    `<path data-chest-surface d="${paths[i]}" fill="${skin}"/>`+
    `<path d="${trace(base[0],[...segments.slice(0,2),side])}Z" fill="${sideTone}"/>`+
    `<path d="${trace(base[1],[...segments.slice(1,6),lower])}Z" fill="${lowerTone}"/>`+
    `<path data-chest-edge d="${paths[i]}" fill="none" stroke="${contour}" stroke-width="4.2" stroke-linejoin="round" clip-path="url(#${outside})"/>`
  ).join('')}</g>`;
  return {definitions,cover,markup};
}
