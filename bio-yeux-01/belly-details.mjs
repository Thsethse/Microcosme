import {rgb} from '../bio-col-01/palette.mjs';
import {referenceCorpulence, validateCorpulence} from './body-corpulence.mjs';

const mix=(a,b,t)=>a+(b-a)*t;
const format=value=>Number(value.toFixed(4));
const tone=(skin,target,weight)=>'#'+rgb(skin).map((channel,i)=>
  Math.round(255*mix(channel,target[i],weight)).toString(16).padStart(2,'0')).join('');

export function pelvicLandmarks(body) {
  const [, , , , abdomen,hips,pelvis]=body.levels;
  return {abdomen:abdomen.y,hips:hips.y,pelvicBase:pelvis.y,reservedTop:mix(hips.y,pelvis.y,.80)};
}

export function abdominalFoldGeometry(body,corpulence=referenceCorpulence) {
  const fat=validateCorpulence(corpulence)/100;
  const {abdomen,reservedTop}=pelvicLandmarks(body);
  const bottom=mix(abdomen,reservedTop-body.height*.010,.38+.62*fat**1.15);
  const thickness=body.height*.020*fat**1.15;
  const center=bottom-thickness;
  const depth=body.height*(.010+.045*fat**1.25);
  const reach=(body.minimumWidth(center-depth,bottom)-2.8)*(.18+.66*fat**.96);
  return {axis:body.ground.x,bottom,center,depth,thickness,reach,strength:fat**2.05};
}

export function navelGeometry(body,corpulence=referenceCorpulence) {
  const fat=validateCorpulence(corpulence)/100;
  const {abdomen,hips}=pelvicLandmarks(body);
  const cy=mix(abdomen,hips,.01+.49*fat**1.15);
  const radius=body.height*.0085;
  return {cx:body.ground.x,cy,rx:radius*.86,ry:radius*1.05};
}

export function groinGeometry(body,corpulence=referenceCorpulence) {
  const fat=validateCorpulence(corpulence)/100;
  const {reservedTop,pelvicBase}=pelvicLandmarks(body);
  const top=reservedTop-body.height*(.043-.005*fat);
  const bottom=pelvicBase-body.height*.004;
  const reach=body.minimumWidth(top,bottom)-2.8;
  const outer=.80-.04*fat;
  const inner=.29+.12*fat;
  const span=outer-inner;
  return [-1,1].map(side=>{
    const point=([x,y])=>[body.ground.x+side*(outer-span*x)*reach,mix(top,bottom,y)];
    return [
      point([0,0]),
      [[.13,.23],[.54,.58],[1,1]].map(point),
      [[.57,.82],[.17,.45],[0,0]].map(point)
    ];
  });
}

export function bellyDetailsMarkup(body,corpulence,skin,{smallScale}={}) {
  const shade=tone(skin,[.24,.14,.09],.46);
  const trace=([first,...curves])=>'M'+first.map(format).join(',')+
    curves.map(curve=>'C'+curve.map(point=>point.map(format).join(',')).join(' ')).join('')+'Z';
  const {axis,center,depth,thickness,reach,strength}=abdominalFoldGeometry(body,corpulence);
  const point=(x,y)=>[axis+x*reach,center+y];
  const edge=-depth;
  const fold=trace([
    point(-1,edge),[point(-.72,edge*.36),point(-.43,0),point(0,0)],
    [point(.43,0),point(.72,edge*.36),point(1,edge)],
    [point(.78,edge*.31),point(.43,thickness),point(0,thickness)],
    [point(-.43,thickness),point(-.78,edge*.31),point(-1,edge)]
  ]);
  const {cx,cy,rx,ry}=navelGeometry(body,corpulence);
  const ellipse=(part,y,xRadius,yRadius,fill,opacity)=>
    `<ellipse data-navel-part="${part}" cx="${format(cx)}" cy="${format(y)}" rx="${format(xRadius)}" ry="${format(yRadius)}" fill="${fill}" opacity="${opacity}"/>`;
  const navel=ellipse('form',cy,rx,ry,shade,.6)+
    (smallScale ? '' : ellipse('rim',cy+ry*.53,rx*.54,ry*.21,tone(skin,[1,.95,.84],.28),.55));
  const creaseTone=tone(skin,[.10,.055,.035],.45);
  const creases=groinGeometry(body,corpulence).map(shape=>
    `<path data-groin-crease="" d="${trace(shape)}" fill="${creaseTone}" opacity="0.48"/>`).join('');
  return `<g data-belly-details="" aria-hidden="true" pointer-events="none">${strength>0 ?
    `<path data-abdominal-fold="" d="${fold}" fill="${shade}" opacity="${format(.64*strength)}"/>` : ''}${navel}${creases}</g>`;
}
