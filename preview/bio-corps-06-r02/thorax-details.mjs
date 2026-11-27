import {rgb} from '../bio-col-01/palette.mjs';
import {pointAt, stripX} from './bezier.mjs';
import {chestGeometry} from './chest.mjs';
import {pectoralGeometry} from './pectorals.mjs';

export const thoraxDetailControls = Object.freeze(Object.fromEntries(Object.entries({
  size:'Taille de l’aréole', shape:'Forme de l’aréole', pigment:'Pigmentation',
  horizontal:'Position horizontale', vertical:'Position verticale'
}).map(([key,label])=>[key,{label,min:0,max:100}])));

export const referenceThoraxDetails = Object.freeze({
  'adult-h':Object.freeze({size:36,shape:13,pigment:44,horizontal:54,vertical:52}),
  'adult-f':Object.freeze({size:44,shape:19,pigment:48,horizontal:50,vertical:48})
});

export function validateThoraxDetails(values) {
  const keys=Object.keys(thoraxDetailControls);
  if (!values || Object.keys(values).length!==keys.length || keys.some(key=>
    !Object.hasOwn(values,key) || !Number.isFinite(values[key]) || values[key]<0 || values[key]>100)) {
    throw new RangeError('Les cinq réglages des détails du thorax doivent être compris entre 0 et 100.');
  }
  return values;
}

const mix=(a,b,t)=>a+(b-a)*t;
const smooth=t=>t*t*(3-2*t);
const clamp01=t=>Math.min(1,Math.max(0,t));

function surfaceMargin(curves,x,y,aspect) {
  const steps=8;
  let inside=false, distance=Infinity, error=0;
  for (const segment of curves) {
    // In this coordinate system the requested ellipse is a circle.
    const curve=segment.map(([cx,cy])=>[cx,(cy-y)/aspect]);
    const [a,b,c,d]=curve;
    // Linear interpolation on each subinterval errs by at most max(|B''|) / (8 * steps²).
    error=Math.max(error,.75*Math.max(
      Math.hypot(c[0]-2*b[0]+a[0],c[1]-2*b[1]+a[1]),
      Math.hypot(d[0]-2*c[0]+b[0],d[1]-2*c[1]+b[1]))/steps**2);
    let [x0,y0]=a;
    for (let step=1;step<=steps;step++) {
      const [x1,y1]=pointAt(curve,step/steps);
      const dx=x1-x0, dy=y1-y0;
      if ((y0>0)!==(y1>0) && x<x0-y0*dx/dy) inside=!inside;
      const t=clamp01(((x-x0)*dx-y0*dy)/(dx*dx+dy*dy));
      distance=Math.min(distance,Math.hypot(x-x0-t*dx,y0+t*dy));
      [x0,y0]=[x1,y1];
    }
  }
  return inside ? Math.max(0,distance-error-.12) : 0;
}

export function thoraxDetailsGeometry(body,key,requested,{chest,pectorals,corpulence}={}) {
  const {size,shape,pigment,horizontal,vertical}=validateThoraxDetails(requested);
  const female=key==='adult-f';
  const axis=body.ground.x, thorax=body.levels[2].y;
  const h=horizontal/100, v=vertical/100;
  const aspect=1-.40*shape/100;
  const flatY=thorax+body.height*((female ? .018 : -.013)+.046*(.5-v));
  const flatX=axis+body.minimumWidth(flatY,flatY)*(.34+.31*h);
  const volume=female ? chest?.volume : pectorals?.volume;
  let x=flatX, y=flatY, bound=0, attachment=0;

  if (volume>0) {
    const carrier=female ? chestGeometry(body,chest,corpulence) : pectoralGeometry(body,pectorals,corpulence);
    const {base,segments}=female ? carrier.lobes[1] : carrier.panels[1];
    const curves=segments.map((segment,i)=>[base[i],...segment]);
    const surfaceY=carrier.anchor+carrier.depth*(female ? .76-.39*v : .72-.37*v);
    const crossings=stripX(curves,surfaceY);
    const surfaceX=mix(Math.min(...crossings),Math.max(...crossings),.32+.36*h);
    attachment=smooth(clamp01(volume/30));
    x=mix(flatX,surfaceX,attachment);
    y=mix(flatY,surfaceY,attachment);
    bound=surfaceMargin(curves,x,y,aspect);
  }

  const maxRadius=(female ? 7 : 5.50)*body.height/142;
  const desired=mix((female ? 1.65 : 1.35)*body.height/142,maxRadius,size/100);
  const bodyBound=body.minimumWidth(y-maxRadius*aspect,y+maxRadius*aspect)-(x-axis)-2.3;
  const clearance=Math.min(x-axis-1.1,Math.max(bound,Math.sqrt(1-attachment)*bodyBound));
  const rx=desired*clearance/Math.hypot(desired,clearance);
  const ry=rx*aspect;
  const nippleRadius=Math.min(1.15,.27*ry);
  return {axis,x,y,rx,ry,nippleRadius,pigment:pigment/100,clearance,attachment};
}

const colour=(skin,target,weight)=>'#'+rgb(skin).map((channel,i)=>
  Math.round(255*channel*mix(1,target[i],weight)).toString(16).padStart(2,'0')).join('');
const number=value=>Number(value.toFixed(3));
const oval=(name,x,y,rx,ry,fill)=>`<ellipse data-${name}="" cx="${number(x)}" cy="${number(y)}" rx="${number(rx)}" ry="${number(ry)}" fill="${fill}"/>`;

export function thoraxDetailsMarkup(body,key,requested,skin,smallScale,carrier,previous=false) {
  const {axis,x,y,rx,ry,nippleRadius,pigment}=thoraxDetailsGeometry(body,key,requested,carrier);
  const areola=colour(skin,[.80,.40,.50],.18+.65*pigment+(smallScale ? .06 : 0));
  const [legacySize,legacyRelief]=key==='adult-h' ? [.34,.31] : [.42,.37];
  const radius=previous ? ry*mix(.17,.49,legacySize) : nippleRadius;
  const nipple=colour(areola,[.76,.57,.62],previous ? (smallScale ? .41+.19*legacyRelief : .42) : .40);
  const shadow=previous && !smallScale
    ? colour(areola,[.73,.50,.55],.22+.25*legacyRelief) : null;
  return `<g data-thorax-details="${key}" aria-hidden="true">${[2*axis-x,x].map(cx=>
    oval('areola',cx,y,rx,ry,areola)+
    (shadow ? oval('nipple-shadow',cx,y+radius*.62*legacyRelief,radius*(1+.23*legacyRelief),
      radius*(.72+.31*legacyRelief),shadow) : '')+
    oval('nipple',cx,y,radius,radius*(previous ? .83 : .90),nipple)).join('')}</g>`;
}
