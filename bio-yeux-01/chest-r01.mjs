import {rgb} from '../bio-col-01/palette.mjs';
import {validateChest} from './chest.mjs';

// Témoin de la planche comparative BIO-CORPS-04-A-R01.
export function chestGeometryR01(body, values, corpulence = 50) {
  const {volume,width,length,roundness,spacing,sag} = validateChest(values);
  if (volume === 0) return null;
  const fullness = corpulence/100, v = volume/100, w = width/100, r = roundness/100, s = sag/100;
  const mass = v ** .83 * (.89 + .11*fullness);
  const shoulder = body.levels[1].y, thorax = body.levels[2].y;
  const anchor = shoulder + .39*(thorax-shoulder);
  const depth = body.height*mass*(.155+.079*length/100+.068*s);
  const t = Math.max(0,(v-.55)/.45);
  const amplitude = body.height*t*t*(3-2*t)*(.042+.072*w+.022*spacing/100+.012*r)*(1-.30*fullness);
  const profile = {start:anchor-.026*body.height, rise:anchor+depth*(.23+.14*s),
    peak:anchor+depth*(.61+.10*s), end:anchor+depth*1.18, amplitude};

  // One footprint, mirrored at the sternum. The wider lower shelf and deeper
  // outer bend are independent of the vertical root of the volume.
  const outline = [
    [-.67,.19],[-.18,0],[.48+.20*r-.20*s,.13+.08*s],
    [.94,.43+.19*s-.13*r],[.70+.17*r,.71+.13*s],
    [.10-.08*r,.96],[-.48-.37*r+.07*s,.81+.06*s],[-.93,.48+.12*s]
  ];
  const tangent = .14+.035*r+.017*fullness;
  const segments = outline.map((point,index)=>{
    const previous=outline[(index+7)%8], next=outline[(index+1)%8], following=outline[(index+2)%8];
    return [point.map((value,i)=>value+tangent*(next[i]-previous[i])),
      next.map((value,i)=>value-tangent*(following[i]-point[i])), next];
  });
  const lateral = [[.55+.09*r,.67+.10*s],[.68,.33+.12*s],outline[2]];
  const underside = [[-.33,.74+.09*s],[.55,.79+.04*s],outline[3]];
  const extents = [...segments.flat(),...lateral,...underside].map(([x])=>x);
  const left=Math.min(...extents), right=Math.max(...extents);
  const available=body.minimumWidth(profile.rise,profile.peak)+amplitude*.86-1.4;
  const capacity=(available-.65)/(right-left);
  const preferred=body.height*(.082+.115*w)*mass;
  const half=preferred/Math.hypot(1,preferred/capacity);
  const inner=.65-left*half, outer=available-right*half;
  // Even on a wide torso small volumes remain near the anatomical root.
  const center=inner+(outer-inner)*(.31+.53*v)*(.08+.81*spacing/100);
  const lobes=[-1,1].map(side=>{
    const project=([x,y])=>[body.ground.x+side*(center+half*x), anchor+depth*y];
    return {base:outline.map(project),segments:segments.map(points=>points.map(project)),
      lateral:lateral.map(project),underside:underside.map(project)};
  });
  return {anchor,depth,half,center,profile,fullness,lobes};
}

const point=([x,y])=>`${Number(x.toFixed(3))},${Number(y.toFixed(3))}`;
const trace=(start,segments)=>'M'+point(start)+segments.map(segment=>'C'+segment.map(point).join(' ')).join('');
const blend=(skin,tint,weight)=>'#'+rgb(skin).map((value,i)=>
  Math.round(255*(value*(1-weight)+tint[i]*weight)).toString(16).padStart(2,'0')).join('');

export function chestMarkupR01(shape, skin, clip) {
  const light=blend(skin,[1,.93,.78],.125-.042*shape.fullness);
  const side=blend(skin,[.24,.13,.09],.115-.028*shape.fullness);
  const shadow=blend(skin,[.24,.13,.09],.235-.045*shape.fullness);
  return `<g data-chest="adult-f" clip-path="url(#${clip})" aria-hidden="true">${shape.lobes.map(({base,segments,lateral,underside})=>
    `<path d="${trace(base[0],segments)}Z" fill="${light}"/>`+
    `<path d="${trace(base[2],[...segments.slice(2,4),lateral])}Z" fill="${side}"/>`+
    `<path d="${trace(base[3],[...segments.slice(3,6),underside])}Z" fill="${shadow}"/>`
  ).join('')}</g>`;
}
