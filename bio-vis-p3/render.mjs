import {model,cuts} from './model.mjs';
import {bodyMarkup,headMarkup} from './p2/base/render.mjs';
const path=(d,fill,stroke,width=1.6,extra='')=>`<path d="${d}" fill="${fill}" stroke="${stroke}" stroke-width="${width}" stroke-linecap="round" stroke-linejoin="round" ${extra}/>`;
export const layerOrder=Object.freeze(['back','face','volume','front','sides','texture']);
export function hairLayers(m){
 const {fit:f,parameters:p,cut:c}=m,{cx:x,cy:y,rx:r,ry:h,top:t,cap:w,forehead:fy,side:s,end,temple:tw,frontWidth:fw}=f;
 let back='',volume='',front='',sides='',texture='';
 const draw=d=>path(d,c.color,c.contour,1.7);
 const detail=d=>path(d,'none',c.contour,1.15,'opacity=".64"');
 if(p.cut==='classic'){
  back=draw(`M${x-tw*(.93/.88)},${y+h*.19} C${x-w-3},${y-h*.3} ${x-w},${t-7} ${x},${t-6} C${x+w},${t-10} ${x+w+3},${y-h*.25} ${x+tw*(.93/.88)},${y+h*.16} L${x+tw*(.82/.88)},${y-h*.16} L${x-tw*(.82/.88)},${y-h*.16}Z`);
  volume=draw(`M${x-tw*(.98/.88)},${y-h*.16} Q${x-w-4},${t+h*.33} ${x-r*.68},${t+h*.15} C${x-r*.38},${t-9} ${x+r*.25},${t-13} ${x+r*.66},${t-3} Q${x+r*.94},${t+2} ${x+w},${t-1} Q${x+w+2},${t+9} ${x+r*.83},${t+14} Q${x+tw*(.98/.88)},${y-h*.23} ${x+tw*(.87/.88)},${y+h*.08} L${x+tw*(.77/.88)},${y-h*.36} Q${x+fw*.44},${fy+3} ${x+fw*.04},${fy-2} Q${x-fw*.55},${fy-9} ${x-tw*(.78/.88)},${fy+4} L${x-tw*(.87/.88)},${y+h*.08}Z`);
  front=draw(`M${x-r*.67},${t+h*.17} C${x-r*.3},${t-9} ${x+r*.29},${t-9} ${x+r*.65},${t-2} Q${x+r*.94},${t+3} ${x+w},${t-1} Q${x+r*.86},${fy+4} ${x+fw*.25},${fy-1} Q${x-fw*.12},${fy-8} ${x-fw*.54},${fy-2}`);
  texture=detail(`M${x-r*.55},${t+12} Q${x-r*.18},${t+1} ${x+r*.27},${t+3} M${x-r*.44},${fy-5} Q${x-fw*.12},${fy-9} ${x+r*.2},${fy-4} Q${x+r*.55},${fy+1} ${x+r*.84},${fy-3}`);
 }else if(p.cut==='bob'){
  back=draw(`M${x-s*.8},${end-2} C${x-s-9},${end+2} ${x-s-7},${y+h*.1} ${x-w-3},${y-h*.13} C${x-w-5},${t-12} ${x+w+5},${t-12} ${x+w+3},${y-h*.13} C${x+s+7},${y+h*.1} ${x+s+9},${end+2} ${x+s*.8},${end-2} Q${x},${end+4} ${x-s*.8},${end-2}Z`);
  volume=draw(`M${x-tw*(.9/.88)},${y-h*.16} Q${x-w-3},${t+h*.22} ${x-r*.62},${t-1} Q${x},${t-12} ${x+r*.62},${t-1} Q${x+w+3},${t+h*.22} ${x+tw*(.9/.88)},${y-h*.16} Q${x+fw*.43},${fy-1} ${x+fw*.19},${fy-8} L${x},${t+9} Q${x-fw*.16},${fy-1} ${x-tw*(.9/.88)},${y-h*.16}Z`);
  // Forehead panels meet at the part and terminate above the brows.
  front=path(`M${x},${t+8} Q${x-r*.08},${fy-2} ${x-tw*(.9/.88)},${fy+2} L${x-tw*(.95/.88)},${fy-4} Q${x-fw*.32},${fy-11} ${x-r*.08},${t+7}Z M${x},${t+8} Q${x+r*.08},${fy-2} ${x+tw*(.9/.88)},${fy+2} L${x+tw*(.95/.88)},${fy-4} Q${x+fw*.32},${fy-11} ${x+r*.08},${t+7}Z`,c.color,'none',0);
  for(const sign of [-1,1]){
   const inner=x+sign*tw*(.9/.88),outer=x+sign*(s+3),cheek=x+sign*(f.lower+1),innerCheek=x+sign*(f.cheek+1);
   sides+=draw(`M${inner},${fy} Q${outer},${y-h*.21} ${outer},${y+h*.25} Q${x+sign*(s+6)},${end-1} ${cheek},${end} Q${x+sign*f.lower*.9},${end-4} ${innerCheek},${y+h*.36} Q${x+sign*r*.86},${y} ${inner},${fy}Z`);
   texture+=detail(`M${x+sign*(r+2)},${fy+5} Q${x+sign*(s+1)},${y+h*.75} ${cheek},${end-4} M${x+sign*r*.18},${t+12} Q${x+sign*fw*.38},${fy-3} ${x+sign*r*.81},${fy-1}`);
  }
 }else{
  // Scalloped ring with a nonuniform crown; large locks, rather than decoration noise.
  const locks=[];
  const rings=17;
  for(let i=0;i<rings;i++){
   const angle=Math.PI*.94+i/(rings-1)*Math.PI*1.12;
   const radius=1.0+.045*Math.sin(i*2.17);
   const ly=y+Math.sin(angle)*(h+7)*radius;
   const z=Math.max(0,Math.min(1,(ly-y+h*.2)/(h*.5))),blend=z*z*(3-2*z);
   const localWidth=(w+2)*(1-blend)+(s+2)*blend;
   locks.push({x:x+Math.cos(angle)*localWidth*radius,y:ly,
    r:6.6+1.15*Math.sin(i*1.7)});
  }
  // Back mass closes behind the cheeks and nape; skin occludes its middle.
  back=draw(`M${x-s+1},${y+h*.68} Q${x-s-10},${y+h*.38} ${x-w-3},${y-h*.13} C${x-w-6},${t-9} ${x+w+6},${t-9} ${x+w+3},${y-h*.13} Q${x+s+10},${y+h*.38} ${x+s-1},${y+h*.68} Q${x},${y+h*.54} ${x-s+1},${y+h*.68}Z`);
  volume=draw(`M${x-tw*(.9/.88)},${fy+1} Q${x-w-2},${t+2} ${x-r*.25},${t-3} Q${x+r*.43},${t-10} ${x+tw*(.95/.88)},${fy+1} Q${x+r*.35},${fy+4} ${x},${fy-2} Q${x-fw*.43},${fy+4} ${x-tw*(.9/.88)},${fy+1}Z`);
  for(const lock of locks){
   const {x:lx,y:ly,r:lr}=lock;
   front+=path(`M${lx-lr},${ly} C${lx-lr*1.1},${ly-lr} ${lx+lr*.55},${ly-lr*1.28} ${lx+lr},${ly-lr*.2} C${lx+lr*1.48},${ly+lr*.55} ${lx-lr*.3},${ly+lr*1.25} ${lx-lr},${ly}Z`,c.color,c.contour,1.5);
   texture+=path(`M${lx-lr*.4},${ly-lr*.1} C${lx-lr*.15},${ly-lr*.85} ${lx+lr*.85},${ly-lr*.4} ${lx+lr*.35},${ly+lr*.2} Q${lx-lr*.18},${ly+lr*.66} ${lx-lr*.1},${ly}`, 'none',c.contour,1.45);
  }
  // Three forehead locks follow the hairline and leave the brow/eye area open.
  for(let i=-1;i<=1;i++){
   const lx=x+i*fw*.5,ly=fy-5+(i===0?-2:0),lr=6.5;
   front+=draw(`M${lx-lr},${ly} C${lx-lr},${ly-8} ${lx+lr+1},${ly-7} ${lx+lr},${ly} Q${lx+lr-2},${ly+8} ${lx-lr+1},${ly+3}Z`);
   texture+=detail(`M${lx-2},${ly-1} q5,-4 5,1 q-1,5 -5,2`);
  }
  for(const sign of [-1,1]){
   const sx=x+sign*(s+1),sy=y+h*.45;
   sides+=draw(`M${sx},${sy-10} C${sx+sign*10},${sy-14} ${sx+sign*10},${sy+7} ${sx+sign*3},${sy+9} Q${sx-sign*8},${sy+8} ${sx},${sy-10}Z`);
   texture+=detail(`M${sx},${sy-3} q${sign*6},-3 ${sign*5},3 q${-sign*3},6 ${-sign*7},0`);
  }
 }
 return {back,volume,front,sides,texture};
}
export function construction(m){
 const points=(anchors,color,prefix)=>Object.entries(anchors).map(([key,[x,y]])=>`<circle cx="${x}" cy="${y}" r=".9" fill="#fff" stroke="${color}" stroke-width=".5"/><text x="${x+1.3}" y="${y-1.1}" font-size="2" fill="${color}">${prefix}${key}</text>`).join('');
 const a=m.anchors;
 return `<g class="anchors">${path(m.outline,'none','#168789',.6,'stroke-dasharray="1 1"')}${path(`M${a.templeLeft} Q${a.hairline} ${a.templeRight}`,'none','#168789',.7,'stroke-dasharray="2 1"')}${points(a,'#168789','')}${points(m.hairAnchors,'#b87524','h:')}</g>`;
}
export function headGroup(input={},options={}){
 const m=model(input),h=hairLayers(m),face=headMarkup(m.base).replace(/<path d="[^"]*"/,`<path d="${m.outline}"`);
 const blocks={back:h.back,face,volume:h.volume,front:h.front,sides:h.sides,texture:h.texture};
 return `<g class="p3-head" data-cut="${m.parameters.cut}">${layerOrder.map(name=>`<g data-layer="${name}">${options.isolate&&options.isolate!==name&&name!=='face'?'':blocks[name]}</g>`).join('')}${options.construction?construction(m):''}</g>`;
}
export function character(input={},options={}){
 const m=model(input),head=headGroup(input,options);
 const label=`${cuts[m.parameters.cut].name}, morphologie continue`;
 return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${options.headOnly?'0 -20 160 155':'0 -20 160 290'}" role="img" aria-label="${label}">${options.headOnly?'':bodyMarkup(m.base)}${head}</svg>`;
}
