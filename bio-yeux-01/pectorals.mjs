import {rgb} from '../bio-col-01/palette.mjs';

export const pectoralControls = Object.freeze({
  volume: {label:'Volume musculaire', min:0, max:100, neutral:0},
  width: {label:'Largeur', min:0, max:100, neutral:55},
  height: {label:'Hauteur', min:0, max:100, neutral:46},
  angularity: {label:'Angularité', min:0, max:100, neutral:62},
  definition: {label:'Définition', min:0, max:100, neutral:53}
});
const axes=Object.entries(pectoralControls);
export const referencePectorals=Object.freeze(Object.fromEntries(axes.map(([name,{neutral}])=>[name,neutral])));

export function validatePectorals(values) {
  if (!values || Object.keys(values).length!==axes.length || axes.some(([name,{min,max}])=>
    !Object.hasOwn(values,name) || !Number.isFinite(values[name]) || values[name]<min || values[name]>max)) {
    throw new RangeError('Les cinq réglages de pectoraux doivent respecter leurs domaines.');
  }
  return values;
}

export function pectoralGeometry(body, values, corpulence=50) {
  const {volume,width,height,angularity,definition}=validatePectorals(values);
  if (volume===0) return null;
  const fat=corpulence/100;
  const mass=(volume/100)**.62;
  const angle=(angularity/100)*(1-.70*fat);
  const definitionVisible=(definition/100)*(1-.66*fat);
  const shoulder=body.levels[1].y, thorax=body.levels[2].y;
  const anchor=shoulder+.47*(thorax-shoulder);
  const depth=body.height*mass*(.077+.114*height/100+.025*fat);

  // One broad muscle plane per side, with an almost horizontal inferior
  // border at high angularity and a small rise towards the shoulder.
  const outline=[
    [.045,.115],[.42,.018],[.865+.045*angle,.115-.055*angle],
    [1,.50+.115*angle],[.81+.125*angle,.82+.11*angle],
    [.46,.958+.027*fat],[.098-.046*angle,.80+.143*angle],[.008,.46]
  ];
  const tension=.163-.045*angle;
  const segments=outline.map((point,index)=>{
    const previous=outline[(index+7)%8], next=outline[(index+1)%8], following=outline[(index+2)%8];
    return [point.map((value,i)=>value+tension*(next[i]-previous[i])),
      next.map((value,i)=>value-tension*(following[i]-point[i])),next];
  });
  const lateral=[[.76,.70+.069*fat],[.82,.31+.06*angle],outline[2]];
  const lower=[[.26,.80+.046*fat-.12*definitionVisible],[.78,.73+.09*fat-.10*definitionVisible],outline[3]];
  const controls=[...segments.flat(),...lateral,...lower];
  const left=Math.min(...controls.map(([x])=>x)), right=Math.max(...controls.map(([x])=>x));
  const ys=controls.map(([,y])=>anchor+depth*y);
  const available=body.minimumWidth(Math.min(...ys),Math.max(...ys))-3;
  const origin=2.15+.70*fat;
  const breadth=(available-origin)*(.48+.49*width/100)*(.34+.66*mass);
  const panels=[-1,1].map(side=>{
    const project=([x,y])=>[body.ground.x+side*(origin+breadth*(x-left)/(right-left)),anchor+depth*y];
    return {base:outline.map(project),segments:segments.map(points=>points.map(project)),lateral:lateral.map(project),lower:lower.map(project)};
  });
  return {anchor,depth,breadth,available,mass,angle,definitionVisible,fat,panels};
}

const point=([x,y])=>`${Number(x.toFixed(3))},${Number(y.toFixed(3))}`;
const trace=(start,segments)=>'M'+point(start)+segments.map(segment=>'C'+segment.map(point).join(' ')).join('')+'Z';
const tint=(skin,tone,factor)=>'#'+rgb(skin).map((value,i)=>
  Math.round(255*(value*(1-factor)+tone[i]*factor)).toString(16).padStart(2,'0')).join('');

export function pectoralMarkup(body, values, corpulence, skin) {
  const shape=pectoralGeometry(body,values,corpulence);
  if (!shape) return '';
  const {mass,definitionVisible:d,fat}=shape;
  const surface=tint(skin,[1,.95,.80],(.035+.055*d)*mass*(1-.25*fat));
  const lateral=tint(skin,[.24,.14,.09],(.055+.065*d)*mass*(1-.26*fat));
  const inferior=tint(skin,[.24,.14,.09],(.105+.238*d)*mass*(1-.33*fat));
  return `<g data-pectorals="adult-h" aria-hidden="true">${shape.panels.map(({base,segments,lateral:side,lower})=>
    `<path data-pectoral-plane d="${trace(base[0],segments)}" fill="${surface}"/>`+
    `<path d="${trace(base[2],[...segments.slice(2,4),side])}" fill="${lateral}"/>`+
    `<path d="${trace(base[3],[...segments.slice(3,6),lower])}" fill="${inferior}"/>`
  ).join('')}</g>`;
}
