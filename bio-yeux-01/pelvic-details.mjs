import {rgb} from '../bio-col-01/palette.mjs';
import {abdominalFoldGeometry, pelvicLandmarks} from './belly-details.mjs';

export const referencePubicHairLength = 0;
export const pubicHairStops = Object.freeze([
  [0, 'Rasé'], [10, 'Début de repousse'], [25, 'Tonte courte'],
  [50, 'Pilosité courte'], [75, 'Pilosité naturelle'], [100, 'Pilosité longue']
]);

export function validatePubicHairLength(value) {
  if (!Number.isFinite(value) || value < 0 || value > 100) {
    throw new RangeError('La longueur de la pilosité pubienne doit être comprise entre 0 et 100 %.');
  }
  return value;
}

export function hasAdultPelvis(body, age = 'adult') {
  return (body === 'adult-h' || body === 'adult-f') && ['adult','mature','elder'].includes(age);
}

const number = value => Number(value.toFixed(4));
const mix = (a,b,amount) => a+(b-a)*amount;
const blend = (base,target,amount) => '#'+rgb(base).map((channel,index)=>
  Math.round(255*mix(channel,target[index],amount)).toString(16).padStart(2,'0')).join('');

export function pelvicDetailFrame(body, corpulence) {
  const {reservedTop,pelvicBase} = pelvicLandmarks(body);
  const {bottom} = abdominalFoldGeometry(body,corpulence);
  const top = Math.max(reservedTop-body.height*.065,bottom+body.height*.0038);
  const end = pelvicBase-body.height*.002;
  const reach = Math.min(.285*(body.minimumWidth(top,end)-2.8),3+1.26*(end-top));
  return {axis:body.ground.x,top,end,reach};
}

// The reference places the details between the converging creases, with
// the H form extending farther down. The floor and body path stay independent.
export function pelvicAnatomyFrame(body, key, corpulence) {
  const original = pelvicDetailFrame(body,corpulence);
  const {pelvicBase} = pelvicLandmarks(body);
  const male = key === 'adult-h';
  const height = body.height;
  const top = Math.max(original.top, pelvicBase-height*(male ? .048 : .069));
  const end = pelvicBase+height*(male ? .069 : .028);
  const reach = Math.max(original.reach*1.10,Math.min(body.minimumWidth(top,end)*(male ? .35 : .48),height*(male ? .08 : .111)));
  return {axis:original.axis,top,end,reach};
}

// Staggered roots with small, fixed offsets. Length cannot move a root or
// change its pigment. All scales use the same rows and the same root count.
const roots = [7,7,6,4].flatMap((count,row)=>Array.from({length:count},(_,column)=>{
  const phase = (row*37+column*17)%23/22;
  const spread = 1-row*.103;
  const x = ((column+.5+(row%2 ? .14 : -.10))/count*2-1)*spread;
  return {x:.90*x+(phase-.5)*.065,y:.12+row*.108+(phase-.5)*.042,phase,tone:(row+column*2)%3};
}));

export function pubicHairGeometry(frame, length) {
  const amount = validatePubicHairLength(length)/100;
  const height = frame.end-frame.top;
  return roots.map(({x,y,phase,tone})=>{
    const root = [frame.axis+x*frame.reach,frame.top+y*height];
    const direction = x > 0 ? -1 : 1;
    const spread = frame.reach*amount*(.11+.13*phase);
    const width = frame.reach*amount*(.17+.18*phase);
    const depth = height*amount*(.26+.21*phase);
    const curl = (.34+amount*.83)*direction*spread;
    // Each tapered ribbon starts at its root, leans towards the centre, then
    // curls outward at the tip. Two fitted sides give it an irregular width.
    const point = (dx,dy) => [root[0]+dx,root[1]+dy];
    const tip = point(curl*.45+direction*width*.18,depth);
    return {root,tone,tip,curves:[
      [point(-width*.8,depth*.19),point(curl-width*.54,depth*.66),tip],
      [point(curl+width*.57,depth*.79),point(curl*.45+width*.71,depth*.13),root]
    ]};
  });
}

function path(start, curves) {
  const pair = point => point.map(number).join(',');
  return `M${pair(start)}${curves.map(curve=>'C'+curve.map(pair).join(' ')).join('')}Z`;
}

function anatomy(frame, body, skin, smallScale) {
  const shadow = blend(skin,[.27,.16,.12],.31);
  const warm = blend(skin,[.62,.38,.30],.18);
  const light = blend(skin,[1,.92,.80],.31);
  const {axis,top,end,reach} = frame;
  const point = ([x,y]) => [axis+x*reach,mix(top,end,y)];
  const draw = (id,fill,start,...curves) =>
    `<path data-pelvic-part="${id}" fill="${fill}" d="${path(point(start),curves.map(curve=>curve.map(point)))}"/>`;
  if (body === 'adult-f') {
    return draw('triangle',warm,[-.65,.36],
      [[-.34,.24],[.34,.24],[.65,.36]],[[.52,.55],[.19,.84],[0,.91]],
      [[-.19,.84],[-.52,.55],[-.65,.36]])+
      draw('median',shadow,[0,.51],[[.07,.57],[.09,.79],[0,.86]],
        [[-.09,.79],[-.07,.57],[0,.51]]);
  }
  const sides = [-1,1].map(side=>draw('rounded',warm,[0,.64],
    [[side*.23,.45],[side*.62,.49],[side*.65,.68]],
    [[side*.70,.88],[side*.40,1],[side*.19,.92]],
    [[side*.06,.89],[0,.78],[0,.64]])).join('');
  const form = draw('u',shadow,[-.29,.30],[[-.36,.41],[-.38,.63],[-.31,.76]],
    [[-.22,.94],[.22,.94],[.31,.76]],[[.38,.63],[.36,.41],[.29,.30]],
    [[.21,.37],[.25,.55],[.19,.68]],[[.12,.78],[-.12,.78],[-.19,.68]],
    [[-.25,.55],[-.21,.37],[-.29,.30]]);
  return sides+form+(smallScale ? '' : draw('light',light,[-.12,.46],
    [[-.05,.39],[.05,.39],[.12,.46]],[[.11,.62],[.06,.70],[0,.71]],
    [[-.06,.70],[-.11,.62],[-.12,.46]]));
}

export function pelvicDetailsMarkup(body, key, corpulence, skin, hair, length = referencePubicHairLength, smallScale = false, previous = false) {
  const original = pelvicDetailFrame(body,corpulence);
  const frame = previous ? original : pelvicAnatomyFrame(body,key,corpulence);
  const offset = (frame.top-original.top)*.65+(frame.end-original.end)*.12;
  const hairFrame = {...original,top:original.top+offset,end:original.end+offset};
  const geometry = length === 0 ? [] : pubicHairGeometry(hairFrame,length);
  const texture = length === 0 ? '' : `<g data-pubic-hair="">${
    [[.18,.10,.075],[.31,.23,.19],[.86,.77,.65]].map((target,tone)=>{
      const fill = blend(hair,target,smallScale ? .16 : .22);
      const strands = geometry.filter(root=>root.tone===tone);
      return `<path fill="${fill}" d="${strands.map(({root,curves})=>path(root,curves)).join('')}"/>`;
    }).join('')}</g>`;
  return `<g data-pelvic-details="${key}" aria-hidden="true" pointer-events="none">${anatomy(frame,key,skin,smallScale)}${texture}</g>`;
}
