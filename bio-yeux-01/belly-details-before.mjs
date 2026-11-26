import {rgb} from '../bio-col-01/palette.mjs';
import {referenceCorpulence, validateCorpulence} from './body-corpulence.mjs';

export const navelControls=Object.freeze({
  size:{label:'Taille',min:0,max:100,neutral:38},
  shape:{label:'Forme',min:0,max:100,neutral:36},
  relief:{label:'Relief',min:0,max:100,neutral:28}
});
export const referenceNavel=Object.freeze(Object.fromEntries(
  Object.entries(navelControls).map(([key,{neutral}])=>[key,neutral])));

export function validateNavel(values) {
  const keys=Object.keys(navelControls);
  if (!values || Object.keys(values).length!==keys.length || keys.some(key=>
    !Object.hasOwn(values,key) || !Number.isFinite(values[key]) || values[key]<0 || values[key]>100)) {
    throw new RangeError('Les trois réglages du nombril doivent être compris entre 0 et 100.');
  }
  return values;
}

const mix=(a,b,t)=>a+(b-a)*t;

export function abdominalFoldGeometry(body,corpulence=referenceCorpulence) {
  const fat=validateCorpulence(corpulence)/100;
  const [, , , , abdomen,hips]=body.levels;
  const center=mix(abdomen.y,hips.y,.12+.55*fat);
  const depth=body.height*(.008+.056*fat**1.25);
  const thickness=body.height*.023*fat**1.15;
  const reach=(body.minimumWidth(center-depth,center+thickness)-2.8)*(.19+.68*fat**.95);
  return {axis:body.ground.x,center,depth,thickness,reach,strength:fat**2.08};
}

export function navelGeometry(body,values,corpulence=referenceCorpulence) {
  const {size,shape,relief}=validateNavel(values);
  const fat=validateCorpulence(corpulence)/100;
  const [, , ,waist,abdomen,hips]=body.levels;
  const cy=mix(waist.y,abdomen.y,.34+.42*fat)+.06*fat*(hips.y-abdomen.y);
  const radius=mix(.70,3.85,size/100)*body.height/142;
  const allowed=(body.minimumWidth(cy-6,cy+6)-2.8)*.24;
  const limited=radius*allowed/Math.hypot(radius,allowed);
  const aspect=Math.sqrt(1+.94*shape/100);
  return {cx:body.ground.x,cy,rx:limited/aspect,ry:limited*aspect,relief:relief/100};
}

const format=value=>Number(value.toFixed(4));
const tone=(skin,target,weight)=>'#'+rgb(skin).map((channel,i)=>
  Math.round(255*mix(channel,target[i],weight)).toString(16).padStart(2,'0')).join('');

export function bellyDetailsMarkup(body,corpulence,skin,{fold,navel,smallScale}={}) {
  const shade=tone(skin,[.24,.14,.09],.46);
  let crease='', details='';
  if (fold) {
    const {axis,center,depth,thickness,reach,strength}=abdominalFoldGeometry(body,corpulence);
    if (strength>0) {
      const point=(x,y)=>`${format(axis+x*reach)},${format(center+y)}`;
      const edge=-depth;
      const path=`M${point(-1,edge)}C${point(-.72,edge*.36)} ${point(-.43,0)} ${point(0,0)}
        C${point(.43,0)} ${point(.72,edge*.36)} ${point(1,edge)}
        C${point(.78,edge*.31)} ${point(.43,thickness)} ${point(0,thickness)}
        C${point(-.43,thickness)} ${point(-.78,edge*.31)} ${point(-1,edge)}Z`;
      crease=`<path data-abdominal-fold="" d="${path}" fill="${shade}" opacity="${format(.64*strength)}"/>`;
    }
  }
  if (navel) {
    const {cx,cy,rx,ry,relief}=navelGeometry(body,navel,corpulence);
    const ellipse=(part,y,xRadius,yRadius,fill,opacity)=>
      `<ellipse data-navel-part="${part}" cx="${format(cx)}" cy="${format(y)}" rx="${format(xRadius)}" ry="${format(yRadius)}" fill="${fill}" opacity="${format(opacity)}"/>`;
    if (smallScale) {
      details=ellipse('form',cy,rx,ry,shade,.66-.33*relief);
    } else {
      const light=tone(skin,[1,.95,.84],.28);
      const centerTone=tone(skin,[mix(.23,1,relief),mix(.13,.95,relief),mix(.09,.84,relief)],.51);
      details=ellipse('form',cy+(relief-.5)*ry*.27,rx,ry*.87,shade,.63-.27*relief)+
        ellipse('center',cy-(relief-.5)*ry*.42,rx*.67,ry*.56,centerTone,.82)+
        ellipse('rim',cy+(1-2*relief)*ry*.60,rx*.54,ry*.20,light,.36+.19*relief);
    }
  }
  if (!crease && !details) return '';
  return `<g data-belly-details="" aria-hidden="true" pointer-events="none">${crease}${details}</g>`;
}
