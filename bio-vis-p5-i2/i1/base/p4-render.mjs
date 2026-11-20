import {model,styles} from './model.mjs';
import {headGroup as r1Head,hairLayers as r1Layers,construction} from './r1/render.mjs';
import {coverageCap} from './r1/coverage.mjs';
import {contourPath} from './r1/model.mjs';
import {bodyMarkup,headMarkup} from './r1/p2/base/render.mjs';
const path=(d,fill,stroke,width=2)=>`<path d="${d}" fill="${fill}" stroke="${stroke}" stroke-width="${width}" stroke-linecap="round" stroke-linejoin="round"/>`;
function extraLayers(m){
 const {fit:f,cut:c,style:s}=m,{cx:x,cy:y,ry:h,rx:r,top:t,forehead:fy,side:w,end,temple:tw}=f;
 const draw=d=>path(d,c.color,c.contour),line=d=>path(d,'none',c.contour,1.35);
 const cap=coverageCap(m),old=r1Layers(m);let back='',front='',sides='',texture='',lengths='';
 const long=s.id.startsWith('waist_'),length=long?118:s.kind==='asym'?88:s.kind==='curls'?64:s.kind==='straight'?58:27;
 const bottom=end+length;
 // Side ribbons start at temporal/cheek anchors. Ends are local offsets from the nape,
 // never a uniform scale of the hairstyle. Body presets do not relocate hair.
 function ribbon(sign,to,kind='straight',front=false){
  const root=x+sign*(tw+2),edge=x+sign*(w+7),inner=x+sign*(f.cheek+3);
  const width=kind==='curls'?19:kind==='waves'?8:10,outer=edge+sign*width;
  let d=`M${root},${fy-2} Q${edge},${fy-5} ${edge},${y+h*.4}`;
  if(kind==='straight')d+=` C${outer},${end+10} ${outer},${to-10} ${edge+sign*2},${to} L${edge-sign*10},${to-4} Q${inner-sign*2},${end+10} ${inner},${y+h*.35}`;
  else{
   const steps=Math.max(2,Math.round((to-end+26)/(kind==='curls'?16:30))),span=(to-y-h*.4)/steps;
   for(let i=0;i<steps;i++){const yy=y+h*.4+i*span;d+=` C${edge+sign*(width+5)},${yy+span*.25} ${edge-sign*(i%2?3:1)},${yy+span*.65} ${edge+sign*(i%2?1:4)},${yy+span}`;}
   d+=` Q${edge-sign*5},${to+6} ${edge-sign*13},${to-2} C${inner-sign*7},${end+12} ${inner+sign*3},${end} ${inner},${y+h*.35}`;
  }
  d+=` Q${x+sign*r*.9},${y} ${root},${fy-2}Z`;
  const shape=draw(d);let detail='';
  if(kind==='straight')detail=line(`M${edge-sign*3},${y+h*.25} C${edge+sign*5},${end+10} ${edge+sign*2},${to-18} ${edge-sign*4},${to-8}`);
  else{
   const count=Math.max(2,Math.floor((to-end+25)/(kind==='curls'?13:26)));
   for(let i=0;i<count;i++){
    const yy=y+h*.42+(to-10-y-h*.42)*i/count;
    detail+=line(kind==='curls'?`M${edge-sign*3},${yy} c${sign*15},-9 ${sign*17},12 ${sign*4},10 q${-sign*9},-3 ${-sign*2},-7`:`M${edge-sign*4},${yy} q${sign*11},8 ${sign*3},19`);
   }
  }
  if(front)lengths+=`<g data-route="front-${sign<0?'left':'right'}">${shape}${detail}</g>`;
  else if(['long_straight','long_curls'].includes(s.id))back+=shape+detail;
  else{sides+=shape;texture+=detail;}
 }
 function braid(rootX,rootY,to,width,lean=0){
  const count=Math.round((to-rootY)/9),step=(to-rootY)/count;let out='';
  for(let i=0;i<count;i++){
   const yy=rootY+i*step,xx=rootX+lean*i/count,ww=width*(1-.48*i/count),sw=i%2?1:-1;
   out+=draw(`M${xx},${yy-2} C${xx+sw*ww*1.1},${yy-5} ${xx+sw*ww*1.15},${yy+step*.45} ${xx},${yy+step+1} C${xx-sw*ww*1.15},${yy+step*.45} ${xx-sw*ww*1.1},${yy-5} ${xx},${yy-2}Z`);
   out+=line(`M${xx-sw*ww*.65},${yy} Q${xx},${yy+2} ${xx+sw*ww*.6},${yy+step*.7}`);
  }
  const xx=rootX+lean;
  out+=path(`M${xx-width*.6},${to} h${width*1.2}`,'none',c.contour,3.3);
  out+=draw(`M${xx-width*.4},${to+2} L${xx+width*.4},${to+2} L${xx+width*.65},${to+10} Q${xx},${to+14} ${xx-width*.6},${to+10}Z`);
  return out;
 }
 if(s.kind==='bald')return {back:'',volume:'',front:'',sides:'',texture:'',lengths:''};
 if(s.kind==='short'){
  const points=[];
  for(let i=0;i<=16;i++){
   const a=Math.PI+i/16*Math.PI,spike=i%2?5:0;
   points.push([x+Math.cos(a)*(r+6+spike),y+Math.sin(a)*(h+5+spike)]);
  }
  points.push([x+tw,y-h*.18],[x-tw,y-h*.18]);back=draw('M'+points.join(' L')+'Z');
  front=draw(`M${x-r*.76},${fy-6} l${r*.3},-10 l${r*.15},6 l${r*.34},-8 l${r*.18},9 l${r*.48},-6 l-4,11 Q${x},${fy-4} ${x-r*.76},${fy-6}Z`);
  texture=line(`M${x-r*.55},${t+9} l7,-4 M${x+4},${t+8} l7,-4`);
 }else if(s.kind==='fringe'){
  back=draw(`M${x-w-4},${end} Q${x-w-11},${y} ${x-r*.65},${t-5} Q${x},${t-13} ${x+r*.65},${t-5} Q${x+w+11},${y} ${x+w+4},${end}Z`);
  for(const sign of [-1,1]){
   const inner=x+sign*(f.cheek+1),outer=x+sign*(w+5);
   sides+=draw(`M${x+sign*(tw+1)},${fy} L${outer},${fy} L${outer},${end} L${inner},${end} Q${inner-sign*6},${y+h*.5} ${x+sign*(tw+1)},${fy}Z`);
   texture+=line(`M${outer-sign*5},${fy+7} L${outer-sign*4},${end-5}`);
  }
  const by=Math.min(m.base.anchors.browLeft[1]-4,fy+10),a=tw*.94;
  front=draw(`M${x-a},${fy-7} Q${x},${t} ${x+a},${fy-7} L${x+a},${by} Q${x},${by+1} ${x-a},${by}Z`);
  for(let i=-2;i<=2;i++)texture+=line(`M${x+i*a/3},${fy-4} l1,${by-fy+1}`);
 }else if(['straight','waves','curls','asym'].includes(s.kind)){
  back=s.kind==='asym'?draw(`M${x-w-4},${fy} C${x-w-13},${t-12} ${x+w+13},${t-12} ${x+w+4},${fy} L${x+w+9},${bottom-9} Q${x+w-2},${bottom} ${x+w-10},${bottom-6} L${x+w-10},${end} L${x-w-4},${end}Z`):draw(`M${x-w-4},${fy} C${x-w-13},${t-12} ${x+w+13},${t-12} ${x+w+4},${fy} L${x+w+9},${bottom-9} Q80,${bottom+8} ${x-w-9},${bottom-9}Z`);
  // Retain the R1 part/curl hairline while extending the side volumes independently.
  front=old.front;
  if(s.kind==='curls')texture=old.texture;
  if(s.kind==='asym'){
   ribbon(-1,end+1,'straight');ribbon(1,bottom,'waves',true);
   front+=draw(`M${x-r*.38},${t+6} Q${x+r*.48},${fy-8} ${x+tw+1},${fy+3} L${x+tw+4},${fy-5} Q${x+r*.7},${t-2} ${x-r*.38},${t+6}Z`);
  }else for(const sign of [-1,1])ribbon(sign,bottom,s.kind,long||s.kind==='waves');
 }else if(s.kind==='afro'){
  // One scalloped macro-volume, not an enlargement of the short-curl model.
  const points=[];
  for(let i=0;i<40;i++){
   const a=2*Math.PI*i/40,lobe=i%2?2.5:-2.5;
   points.push([x+Math.cos(a)*(w+24+lobe),y-7+Math.sin(a)*(h+20+lobe)]);
  }
  back=draw(contourPath(points));front=old.front;
  for(let row=0;row<7;row++)for(let col=0;col<9;col++){
   const u=(col-4)/4,v=-.92+row*.27,px=x+u*(w+18),py=y-7+v*(h+15);
   // Restrained coils at crown/outer sides only, never over the face.
   if(u*u+v*v>.9||v>-.6&&Math.abs(u)<.78)continue;
   texture+=line(`M${px},${py} c-5,-6 7,-9 6,-2 c-1,7 -9,5 -6,0`);
  }
 }else if(s.kind==='braids'||s.kind==='braid'){
  back=old.back;front=old.front;
  for(const sign of s.kind==='braids'?[-1,1]:[1]){
   const root=x+sign*(w+1),yy=end-6;
   sides+=draw(`M${x+sign*tw},${fy} Q${root+sign*9},${y} ${root},${yy+4} L${root-sign*9},${yy} Q${root-sign*3},${y+h*.3} ${x+sign*tw},${fy}Z`);
   lengths+=`<g data-route="front-${sign<0?'left':'right'}">${braid(root,yy,s.kind==='braids'?end+67:end+111,s.kind==='braids'?7:10,s.kind==='braids'?sign*3:8)}</g>`;
  }
  if(s.kind==='braid'){
   sides+=draw(`M${x-tw},${fy} Q${x-w-4},${y+h*.1} ${x-w+4},${end-6} L${x-w+12},${end-10} Q${x-w},${y} ${x-tw},${fy}Z`);
   texture+=line(`M${x-r*.4},${t+9} Q${x+r*.2},${fy-6} ${x+tw},${fy+2}`);
  }
 }else if(s.kind==='bun'){
  back=draw(`M${x-14},${t+2} C${x-34},${t-29} ${x+30},${t-37} ${x+18},${t+2}Z`);
  back+=line(`M${x-13},${t-6} C${x-20},${t-24} ${x+20},${t-28} ${x+14},${t-9} Q${x-4},${t-17} ${x-10},${t-7}`);
  front=old.front;
  for(const sign of [-1,1]){
   sides+=draw(`M${x+sign*tw},${fy} Q${x+sign*(w+6)},${y+h*.4} ${x+sign*(w-5)},${end+8} Q${x+sign*(w+1)},${y+h*.3} ${x+sign*(tw-3)},${fy+4}Z`);
   texture+=line(`M${x+sign*r*.26},${t+8} Q${x+sign*r*.72},${fy-8} ${x+sign*(tw+1)},${fy}`);
  }
 }else if(s.kind==='pony'){
  const ax=x+r*.76,ay=t+12;
  back=draw(`M${ax},${ay} C${ax+40},${ay-16} ${x+w+42},${end-8} ${x+w+8},${end+42} Q${x+w+23},${end+16} ${x+w+7},${end-1} C${x+w-4},${y+h*.2} ${ax+13},${ay+9} ${ax},${ay}Z`);
  back+=line(`M${ax+12},${ay+6} Q${x+w+42},${y+h*.1} ${x+w+14},${end+24}`);
  back+=path(`M${ax+1},${ay-1} l7,10`,'none',c.contour,4);
  front=old.front;texture=old.texture;
 }
 return {back,volume:cap,front,sides,texture,lengths};
}
export function layers(input={}){const m=model(input);return m.style.kind==='original'?{...r1Layers(m),lengths:''}:extraLayers(m)}
export function headGroup(input={},options={}){
 const m=model(input);
 if(m.style.kind==='original'){
  let html=r1Head(m.parameters,options);
  if(m.state.monochrome){const c=model({...m.state,monochrome:false}).cut;for(const [old,next]of [[c.color,m.cut.color],[c.contour,m.cut.contour],[c.light,m.cut.light]])html=html.replaceAll(old,next)}
  return html;
 }
 const h=extraLayers(m),face=headMarkup(m.base).replace(/<path d="[^"]*"/,`<path d="${m.outline}"`);
 return `<g class="p4-head" data-cut="${m.style.id}">${['face','volume','front','sides','texture'].map(k=>`<g data-layer="${k}">${k==='face'?face:h[k]}</g>`).join('')}${options.construction?construction(m):''}</g>`;
}
export function character(input={},options={}){
 const m=model(input),h=layers(input),original=m.style.kind==='original';
 return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${options.headOnly?(m.style.id==='afro'?'-10 -38 180 174':'0 -32 160 165'):'-26 -43 212 310'}" role="img" aria-label="${styles[m.state.style].name} · ${options.headOnly?'tête agrandie':'personnage entier'}">${original?'':`<g data-layer="rear">${h.back}</g>`}${bodyMarkup(m.body)}${headGroup(input,options)}${options.headOnly?'':`<g data-layer="lengths">${h.lengths}</g>`}</svg>`;
}
