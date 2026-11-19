import {layers as oldLayers} from './base/render.mjs';
import {coverageCap,halfWidthAt} from './base/r1/coverage.mjs';
import {contourPath} from './base/r1/model.mjs';
export function coveragePolicy(m){
 const n=m.reference.number,a=m.state.arrangement;
 return {mode:n===20&&a==='G'||n===25&&a==='G'?'top':n===25&&a==='D'?'right-shaved':'full',cutY:m.anchors.templeRight[1]-5};
}
export function hairLayers(m,instance='drawing'){
 const f=m.fit,c=m.cut,{cx:x,cy:y,rx:r,ry:h,top:t,forehead:fy,temple:tw,side:s,end,frontWidth:fw}=f;
 const n=m.reference.number,a=m.state.arrangement,old=oldLayers(m.baseState);
 if(n===24&&a==='D'){
  const tie=old.back.match(/<path[^>]*\/>$/)[0];
  return {...old,back:old.back.slice(0,-tie.length),accessories:'',backAccessories:m.state.accessories?tie:'',defs:'',policy:coveragePolicy(m)};
 }
 const draw=d=>`<path d="${d}" fill="${c.color}" stroke="${c.contour}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>`;
 const line=(d,w=1.2)=>`<path d="${d}" fill="none" stroke="${c.contour}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>`;
 const filledCap=coverageCap(m).match(/^<path[^>]*\/>/)[0];
 const policy=coveragePolicy(m),brow=m.base.anchors.browLeft[1],low=Math.min(fy+9,brow-4);
 let back='',volume=coverageCap(m),front='',sides='',texture='',lengths='',accessories='',backAccessories='',defs='';
 if(policy.mode!=='full'){
  const id='hair-'+instance.replace(/[^a-zA-Z0-9_-]/g,'-'),cut=policy.cutY;
  const d=policy.mode==='top'?`M-50,-100 H210 V${cut} H-50Z`:`M-50,-100 H210 V${cut} H${x+tw*.72} V270 H-50Z`;
  defs=`<defs><clipPath id="${id}"><path d="${d}"/></clipPath></defs>`;
  volume=`<g clip-path="url(#${id})">${volume}</g>`;
 }
 function shaved(signs,fade=true){
  if(!fade)return;
  for(const sign of signs)for(const u of [.23,.53,.82]){
   const yy=policy.cutY+(y-h*.12-policy.cutY)*u,edge=halfWidthAt(m,yy);
   texture+=line(`M${x+sign*(edge-5)},${yy} l${sign*3.8},-1`,.9);
  }
 }
 function swept(extra=0){
  // A broad S forelock: its root follows crown/forehead width; tips stay above brows.
  const tip=Math.min(low+extra,brow-3.5);
  front+=draw(`M${x+r*.58},${t+5} C${x+r*.13},${t-9} ${x-r*.55},${t-4} ${x-r*.94},${fy-8} Q${x-r*1.12},${fy-2} ${x-r*1.19},${fy-5} Q${x-r*1.03},${tip+1} ${x-r*.59},${tip-3} C${x-r*.2},${tip-7} ${x-fw*.09},${fy-18} ${x+fw*.24},${fy-12} Q${x+tw*.95},${fy-7} ${x+tw*.99},${y-h*.03} Q${x+r*1.05},${t+18} ${x+r*.58},${t+5}Z`);
  texture+=line(`M${x+r*.53},${t+8} C${x+r*.07},${t-3} ${x-r*.48},${t+4} ${x-r*.77},${fy-4} M${x+r*.51},${t+9} Q${x+r*.1},${fy-12} ${x-r*.54},${tip-6}`);
 }
 function bob(blunt=false){
  back=old.back;swept(blunt?0:2);
  for(const sign of [-1,1]){
   const edge=x+sign*(s+(sign<0?5:2)),inner=x+sign*(f.cheek+1.5),yy=end+(blunt?5:3),lower=x+sign*(f.lower+(blunt?5:0));
   sides+=draw(`M${x+sign*tw},${fy-2} Q${edge},${fy-4} ${edge},${y+h*.38} ${blunt?`L${edge},${yy} L${lower},${yy-1}`:`Q${edge+sign*5},${yy+3} ${lower},${yy}`} Q${x+sign*f.lower*.83},${yy-3} ${inner},${y+h*.34} Q${x+sign*r*.87},${y} ${x+sign*tw},${fy-2}Z`);
   texture+=line(`M${edge-sign*5},${fy+10} Q${edge-sign*1},${y+h*.65} ${lower},${yy-5}`);
  }
 }
 function spikes(kind){
  const crop=kind==='crop',messy=kind==='messy',fringed=kind==='fringe';
  const outline=messy?[[-1.02,20],[-1.27,7],[-.91,8],[-1.15,-5],[-.66,-1],[-.82,-17],[-.38,-8],[-.16,-23],[.22,-9],[.55,-18],[.67,-3],[1.08,-8],[.98,8],[1.21,10],[1,22]]:
   crop?[[-1.02,20],[-1.12,8],[-.78,10],[-.94,-4],[-.52,1],[-.57,-12],[-.1,-4],[-.18,-16],[.36,-5],[.48,-11],[.77,2],[1.04,10],[1.02,22]]:
   fringed?[[-1.03,24],[-1.12,9],[-.75,5],[-.92,-3],[-.43,0],[-.18,-9],[.3,-4],[.62,-6],[.94,8],[1.09,24]]:
   [[-1.02,24],[-1.09,8],[-.75,10],[-.9,-3],[-.38,1],[-.49,-10],[.05,-3],[.27,-9],[.71,0],[1.01,10],[1.05,24]];
  let d='M'+outline.map(([u,v])=>[x+(r+2)*u,t+v]).join(' L');
  const fringe=crop?[[.94,1],[.4,0],[-.3,1],[-.95,0]]:fringed?[[.98,-1],[.8,9],[.57,2],[.32,15],[.2,5],[-.04,13],[-.2,5],[-.43,17],[-.58,5],[-.86,10],[-1,-1]]:
   messy?[[1,-2],[.78,8],[.52,0],[.3,10],[.12,1],[-.18,8],[-.35,0],[-.61,10],[-.8,1],[-1,4]]:
   [[1,-1],[.8,3],[.51,13],[.36,2],[.07,10],[-.1,1],[-.44,15],[-.57,4],[-.9,9],[-1,0]];
  for(const [u,v]of fringe)d+=` L${x+fw*.88*u},${Math.min(fy+v,brow-3.5)}`;
  front+=draw(d+'Z');
  for(const u of [-.48,.05,.53])texture+=line(`M${x+r*u},${t+9} q7,-5 12,-3`);
 }
 function ribbon(sign,to,{amp=8,lobes=3,width=11,curl=false}={}){
  const root=x+sign*(tw+1),edge=x+sign*(s+8),inner=x+sign*(f.cheek+(curl?-2:2)),start=y+h*.35,step=(to-start)/lobes;
  let d=`M${root},${fy-2} Q${edge+sign*2},${fy-5} ${edge},${start}`;
  for(let i=0;i<lobes;i++){
   const yy=start+i*step;
   d+=` C${edge+sign*amp},${yy+step*.18} ${edge+sign*amp},${yy+step*.32} ${edge},${yy+step*.5} C${edge-sign*amp},${yy+step*.68} ${edge-sign*amp},${yy+step*.82} ${edge},${yy+step}`;
  }
  d+=` Q${edge-sign*3},${to+6} ${edge-sign*width},${to-1} C${inner-sign*6},${end+16} ${inner+sign*2},${end-2} ${inner},${y+h*.36} Q${x+sign*r*.9},${y} ${root},${fy-2}Z`;
  let detail='';
  for(let i=0;i<lobes;i++){
   const yy=start+(to-start)*i/lobes;
   detail+=line(curl?`M${edge-sign*5},${yy+2} c${sign*7},-5 ${sign*10},7 ${sign*2},9 q${-sign*6},1 ${-sign*4},-4`:`M${edge-sign*3},${yy+3} q${sign*(amp+4)},9 ${sign*2},${step*.68}`);
  }
  lengths+=`<g data-route="front-${sign<0?'left':'right'}">${draw(d)}${detail}</g>`;
 }
 function halo(long=false){
  const points=[];
  const count=long?22:26;
  for(let i=0;i<count;i++){
   const angle=2*Math.PI*i/count,bump=i%2?0:4;
   points.push([x+Math.cos(angle)*(s+6+bump),y-5+Math.sin(angle)*(h+8+bump)]);
  }
  back=draw(contourPath(points));volume=filledCap;
  for(let i=0;i<(long?7:9);i++){
   const angle=Math.PI+i/(long?6:8)*Math.PI,lx=x+Math.cos(angle)*(s+3),ly=y-5+Math.sin(angle)*(h+4);
   texture+=line(long?`M${lx-3},${ly+2} q7,-9 12,-1`:`M${lx-2},${ly+2} c-5,-9 11,-12 10,-2 c-1,8 -13,8 -9,1`,1.4);
  }
  if(long){
   for(const sign of [-1,1]){
    front+=draw(`M${x},${t+10} C${x+sign*fw*.5},${t-1} ${x+sign*(s+1)},${fy-9} ${x+sign*tw},${fy+3} Q${x+sign*fw*.55},${Math.min(fy+7,brow-4)} ${x+sign*fw*.33},${fy-6} Q${x+sign*fw*.12},${fy-13} ${x},${t+10}Z`);
    texture+=line(`M${x+sign*fw*.16},${t+12} Q${x+sign*fw*.5},${fy-8} ${x+sign*fw*.65},${fy-1}`);
   }
  }else for(const u of [-.5,.12,.68]){
   const xx=x+fw*u,yy=fy-8;
   front+=draw(`M${xx-7},${yy} C${xx-8},${yy-10} ${xx+11},${yy-11} ${xx+10},${yy} Q${xx+9},${Math.min(yy+9,brow-4)} ${xx-5},${yy+5}Z`);
   texture+=line(`M${xx-1},${yy-2} c7,-4 9,5 2,6 q-5,0 -3,-4`,1.3);
  }
 }
 if((n===19||n===21)&&a==='G'){
  back=old.back;swept();
 }else if((n===19||n===21)&&a==='D')bob(n===21);
 else if(n===20&&a==='G'){
  spikes('crop');shaved([-1,1]);
 }else if(n===20&&a==='D'){
  back=old.back;spikes('swept');
 }else if(n===22&&a==='G'){
  back=old.back;swept();
  for(const sign of [-1,1]){
   const xx=x+sign*(s-1),yy=fy+1;
   sides+=draw(`M${x+sign*tw},${yy-5} C${xx+sign*8},${yy+3} ${xx-sign*6},${yy+19} ${xx+sign*6},${yy+21} Q${xx-sign*2},${yy+29} ${xx-sign*7},${yy+18} Q${xx-sign*12},${yy+8} ${x+sign*tw},${yy-5}Z`);
   texture+=line(`M${xx},${yy+1} q${-sign*6},12 ${sign*1},18`);
  }
 }else if(n===22&&a==='D'){
  back=old.back;swept();for(const sign of [-1,1])ribbon(sign,end+53,{amp:8,lobes:3});
 }else if(n===23&&a==='G'){
  back=old.back;spikes('messy');
 }else if(n===23&&a==='D'){
  back=draw(`M${x-6},${t+5} C${x-28},${t-4} ${x-15},${t-25} ${x-3},${t-20} C${x+7},${t-34} ${x+20},${t-17} ${x+17},${t-10} Q${x+34},${t+1} ${x+13},${t+9}Z`);
  texture+=line(`M${x-6},${t-15} q-7,12 5,17 M${x+5},${t-21} q-4,13 5,19`);
  swept();
  for(const sign of [-1,1]){
   const xx=x+sign*(s-2);
   sides+=draw(`M${x+sign*tw},${fy-1} C${xx+sign*9},${y} ${xx-sign*8},${end-10} ${xx},${end+3} Q${xx+sign*8},${end+17} ${xx-sign*3},${end+22} Q${xx+sign*4},${end+9} ${xx-sign*5},${end} C${xx-sign*13},${end-11} ${xx+sign*3},${y+h*.2} ${x+sign*tw},${fy-1}Z`);
  }
  if(m.state.accessories)accessories=line(`M${x-5},${t+2} q11,4 21,1`,2.6);
 }else if(n===24&&a==='G'){
  const ax=x+f.lower*.5,ay=end-8;
  back=draw(`M${ax},${ay} C${x+s+28},${ay-5} ${x+s+31},${end+21} ${x+s+10},${end+59} L${x+s+1},${end+49} L${x+s-3},${end+59} C${x+s+9},${end+20} ${ax-9},${ay+14} ${ax},${ay}Z`);
  back+=line(`M${ax+5},${ay+3} Q${x+s+28},${end+22} ${x+s+9},${end+47}`);
  for(const u of [-.7,-.35,.35,.7])texture+=line(`M${x+fw*u},${fy-5} Q${x+fw*u*.8},${t+7} ${x},${t+4}`);
  if(m.state.accessories)backAccessories=line(`M${ax-4},${ay+1} l8,3`,2.6);
 }else if(n===25&&a==='G'){
  front=draw(`M${x-r*.95},${fy-3} Q${x-r*1.15},${t+12} ${x-r*.6},${t+7} L${x-r*.95},${t-5} Q${x-r*.48},${t-2} ${x-r*.4},${t-8} L${x-r*.45},${t-17} Q${x+r*.1},${t-12} ${x+r*.24},${t-1} Q${x+r*.8},${t-13} ${x+r*.75},${t+7} Q${x+r*1.09},${fy-9} ${x+r*.88},${fy-2} Q${x},${fy-7} ${x-r*.95},${fy-3}Z`);
  texture+=line(`M${x-r*.6},${fy-7} Q${x-r*.25},${t+2} ${x+r*.1},${t+5} M${x-r*.42},${fy-8} Q${x+r*.2},${t+6} ${x+r*.55},${t+11}`);
 }else if(n===25&&a==='D'){
  swept();shaved([1]);
  const edge=x-s-8,inner=x-f.cheek-2;
  sides+=draw(`M${x+r*.58},${t+8} C${x-r*.38},${t+4} ${edge},${fy+7} ${edge},${y+h*.45} Q${edge-5},${end+5} ${x-f.lower*.64},${end+24} Q${x-f.lower*.85},${end+5} ${inner},${y+h*.45} Q${x-r*.97},${y-h*.2} ${x+r*.58},${t+8}Z`);
  texture+=line(`M${x+r*.4},${t+11} Q${edge-1},${fy+13} ${edge+4},${end+6}`);
 }else if(n===26&&a==='G'){
  back=old.back;spikes('fringe');
 }else if(n===26&&a==='D'){
  back=old.back;front=old.front;
  for(let i=-2;i<=2;i++)texture+=line(`M${x+i*tw*.94/3},${fy-4} l1,${Math.min(brow-4,fy+10)-fy+1}`);
  for(const sign of [-1,1])ribbon(sign,end+55,{amp:4,lobes:3,width:11});
 }else if(n===27){
  halo(a==='D');
  if(a==='D')for(const sign of [-1,1])ribbon(sign,end+64,{amp:10,lobes:4,width:16,curl:true});
 }
 if(policy.mode!=='full')front=`<g clip-path="url(#hair-${instance.replace(/[^a-zA-Z0-9_-]/g,'-')})">${front}</g>`;
 return {back,volume,front,sides,texture,lengths,accessories,backAccessories,defs,policy};
}
