import {hairLayers as priorHair} from './i1/hair.mjs';
import {coverageCap} from './i1/base/r1/coverage.mjs';
import {contourPath} from './i1/base/r1/model.mjs';
import {lotB} from './catalogue.mjs';
export function hairLayers(m,instance='drawing'){
 if(!lotB[m.state.style])return priorHair(m,instance);
 const f=m.fit,c=m.cut,{cx:x,cy:y,rx:r,ry:h,top:t,forehead:fy,temple:tw,side:s,end,frontWidth:fw}=f;
 const n=m.reference.number,a=m.state.arrangement,brow=m.base.anchors.browLeft[1];
 const draw=d=>`<path d="${d}" fill="${c.color}" stroke="${c.contour}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>`;
 const line=(d,w=1.2)=>`<path d="${d}" fill="none" stroke="${c.contour}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>`;
 const feature=(name,markup)=>`<g data-feature="${name}">${markup}</g>`;
 // The inherited analytic envelope is kept; only the decorative outer contour is replaced.
 let back='',volume=coverageCap(m).match(/^<path[^>]*\/>/)[0],front='',sides='',texture='',lengths='',accessories='',backAccessories='';
 const ornament=d=>`<path d="${d}" fill="#d8bc7a" stroke="#91723c" stroke-width="1.5" stroke-linejoin="round"/>`;
 const pearl=(px,py,rr=2.5)=>`<circle cx="${px}" cy="${py}" r="${rr}" fill="#f4e5be" stroke="#91723c" stroke-width="1.1"/>`;
 function centrePart(){
  for(const sign of [-1,1])front+=draw(`M${x},${t+7} C${x+sign*r*.5},${t-2} ${x+sign*(s+4)},${fy-8} ${x+sign*(tw+3)},${y-h*.07} Q${x+sign*(tw-2)},${fy+6} ${x+sign*fw*.76},${Math.min(fy+1,brow-5)} Q${x+sign*fw*.33},${fy-10} ${x},${t+7}Z`);
 }
 function swept(){
  // Reuse the already reviewed Lot A forelock, with unchanged root/face constraints.
  const p={...m,reference:{number:19},state:{...m.state,arrangement:'G'}};
  const old=priorHair(p);front+=old.front;texture+=old.texture;
 }
 function fan(high=false){
  const rootY=fy-9,rootX=x+4;
  const d=high?`M${x-r-3},${fy+1} Q${x-r-14},${fy-8} ${x-r-5},${t+2} Q${x-r-10},${t-10} ${x-r-5},${t-27} C${x-r+1},${t-15} ${x-4},${t-24} ${x+8},${t-18} Q${x+r*.8},${t-15} ${x+r*.8},${t-4} Q${x+r+8},${t-4} ${x+r+5},${t+12} Q${x+r+8},${fy-3} ${x+tw},${fy+1} Q${x},${fy-7} ${x-r-3},${fy+1}Z`:
   `M${x-r-4},${fy+1} Q${x-r-12},${fy-4} ${x-r-7},${t+6} Q${x-r-4},${t-7} ${x-r*.4},${t-8} Q${x-r*.2},${t-19} ${x+8},${t-15} Q${x+r*.9},${t-15} ${x+r*.87},${t+1} Q${x+r+13},${t+4} ${x+r+9},${fy-5} Q${x+r+4},${fy+5} ${x+tw},${fy} Q${x},${fy-6} ${x-r-4},${fy+1}Z`;
  front+=feature(high?'high-quiff':'architectural-fan',draw(d));
  const tops=high?[[-.85,-19],[-.32,-19],[.25,-17],[.8,-3]]:[[-.9,1],[-.42,-6],[.13,-13],[.75,-2]];
  for(const [u,v]of tops)texture+=line(`M${rootX},${rootY} C${x+r*u*.7},${fy-20} ${x+r*u+9},${t+v} ${x+r*u},${t+v}`);
 }
 function bun(px=x,py=t-12,rx=22,ry=15,tiers=1){
  let out=draw(`M${px-rx*.52},${py+ry-6} Q${x},${t-3} ${x-r*.5},${t+14} L${x+r*.5},${t+14} Q${x+rx*.4},${t-3} ${px+rx*.52},${py+ry-6}Z`);
  for(let tier=0;tier<tiers;tier++){
   const yy=py-tier*13,ww=rx*(1-tier*.18),hh=ry*(1-tier*.12);
   const points=Array.from({length:48},(_,i)=>{const z=Math.PI*2*i/48,bump=1.8*Math.cos(z*5);return [px+Math.cos(z)*(ww+bump),yy+Math.sin(z)*(hh+bump)]});
   out+=draw(contourPath(points));
   for(const u of [-.55,0,.55])out+=line(`M${px+ww*u},${yy-hh+2} C${px+ww*(u-.38)},${yy-2} ${px+ww*(u+.45)},${yy+4} ${px},${yy+hh-1}`);
  }
  return feature(tiers>1?'stacked-rolls':'rolled-bun',out);
 }
 function sideRolls(large=false){
  for(const sign of [-1,1]){
   const xx=x+sign*(s-1),yy=fy-2,w=large?12:9;
   sides+=feature('side-roll',draw(`M${x+sign*tw},${yy-8} C${xx+sign*w},${yy-11} ${xx+sign*(w+7)},${yy+9} ${xx+sign*5},${yy+13} C${xx-sign*7},${yy+18} ${xx-sign*10},${yy+5} ${xx-sign*1},${yy+3} Q${xx+sign*7},${yy+7} ${xx+sign*4},${yy-1} Q${xx},${yy-5} ${x+sign*tw},${yy-8}Z`));
  }
 }
 // Interlaced strands follow a continuous centreline, not a row of disconnected beads.
 // Normals come from neighbouring centres, so crown and hanging braids share the same topology.
 function braid(points,width){
  const normal=points.map((p,i)=>{const aa=points[Math.max(0,i-1)],bb=points[Math.min(points.length-1,i+1)],dx=bb[0]-aa[0],dy=bb[1]-aa[1],l=Math.hypot(dx,dy);return [-dy/l,dx/l]});
  let out='';
  for(let i=0;i<points.length-1;i++){
   const p=points[i],q=points[i+1],dx=q[0]-p[0],dy=q[1]-p[1],sw=i%2?1:-1,ww=width*(1-.22*i/(points.length-1));
   const at=(u,v)=>[p[0]+dx*u+normal[i][0]*v,p[1]+dy*u+normal[i][1]*v];
   // Overlapping alternating bundles, generalised from the P4 braid to a curved centreline.
   out+=draw(`M${at(-.2,0)} C${at(-.5,sw*ww*1.1)} ${at(.45,sw*ww*1.15)} ${at(1.1,0)} C${at(.45,-sw*ww*1.15)} ${at(-.5,-sw*ww*1.1)} ${at(-.2,0)}Z`);
   out+=line(`M${at(0,-sw*ww*.65)} Q${at(.2,0)} ${at(.7,sw*ww*.6)}`,1.1);
  }
  return `<g data-feature="braid" data-root="${points[0]}" data-end="${points.at(-1)}">${out}</g>`;
 }
 function crown(low=false){
  const yy=y-h*.20,ry=yy-t+(low?0:8),rr=r+(low?3:5);
  const pts=Array.from({length:17},(_,i)=>{const angle=Math.PI+i*Math.PI/16;return [x+Math.cos(angle)*rr,yy+Math.sin(angle)*ry]});
  front+=feature('braided-crown',braid(pts,low?4.5:5.4));
 }
 function hangingBraid(sign,{thin=false,loose=false}={}){
  const from=fy+6,to=end+(thin?64:61),root=[x+sign*(tw+3),from],w=thin?4:6;
  const pts=Array.from({length:11},(_,i)=>{const u=i/10;return [root[0]+sign*(s-tw+2)*Math.sin(Math.PI*Math.min(1,u*2)/2)+sign*(loose?3:0)*Math.sin(u*Math.PI),from+(to-from)*u]});
  // A short root bundle bridges the swept forelock to the hanging braid,
  // including narrow-forehead / wide-temple extremes; the face is unchanged.
  const [ax,ay]=root;
  sides+=feature('braid-root',draw(`M${ax-sign*6},${ay-16} C${ax+sign*6},${ay-20} ${ax+sign*8},${ay-7} ${ax+sign*w*.8},${ay+5} L${ax-sign*w*.8},${ay+5} Q${ax-sign*4},${ay-5} ${ax-sign*6},${ay-16}Z`));
  lengths+=braid(pts,w);
  const tip=pts.at(-1);lengths+=draw(`M${tip[0]-w*.65},${tip[1]-1} Q${tip[0]},${tip[1]+12} ${tip[0]+w*.65},${tip[1]-1}Z`);
  if(m.state.accessories)accessories+=ornament(`M${tip[0]-w*.7},${tip[1]-1} h${w*1.4} v3 h${-w*1.4}Z`);
 }
 function tendril(sign,to=end+27,slender=true){
  const root=x+sign*(tw+4),edge=x+sign*(s+3),start=fy+3;
  const pts=Array.from({length:37},(_,i)=>{const u=i/36;return [root+(edge-root)*Math.min(1,u*4)+sign*4*Math.sin(u*Math.PI*6),start+(to-start)*u]});
  const w=slender?1.8:3;
  lengths+=feature('loose-lock',draw(contourPath([...pts.map(([px,py],i)=>[px+w*(1-i/pts.length*.65),py]),...pts.slice().reverse().map(([px,py],i)=>[px-w*(.35+i/pts.length*.65),py])])));
 }
 function curls(sign,to,turns=4,wide=10){
  const root=x+sign*(tw+3),edge=x+sign*(s+6),start=fy+4,step=(to-start)/turns;
  let d=`M${root},${start} Q${edge+sign*8},${start-5} ${edge},${start+step*.25}`;
  for(let i=0;i<turns;i++){
   const yy=start+i*step;
   d+=` C${edge+sign*(wide+2)},${yy+step*.25} ${edge+sign*(wide+2)},${yy+step*.75} ${edge},${yy+step} C${edge-sign*7},${yy+step+2} ${edge-sign*9},${yy+step*.75} ${edge-sign*5},${yy+step*.65}`;
  }
  d+=` Q${edge-sign*wide},${to+9} ${edge-sign*(wide+4)},${to-3} C${x+sign*(f.cheek+3)},${end+7} ${x+sign*(f.cheek+4)},${y+h*.2} ${root},${start}Z`;
  let out=draw(d);
  for(let i=0;i<turns;i++){
   const yy=start+(i+.48)*step;
   out+=line(`M${edge-sign*4},${yy} C${edge+sign*10},${yy-8} ${edge+sign*12},${yy+11} ${edge},${yy+9} Q${edge-sign*8},${yy+7} ${edge-sign*2},${yy+3}`,1.25);
  }
  lengths+=feature('open-curls',out);
 }
 function pearls(yy,span=20,count=7){
  if(!m.state.accessories)return;
  for(let i=0;i<count;i++){const u=(i/(count-1)-.5)*2;accessories+=pearl(x+u*span,yy+5*u*u)}
 }
 function flower(px,py){
  if(!m.state.accessories)return;
  for(let i=0;i<5;i++){const z=Math.PI*2*i/5;accessories+=pearl(px+Math.cos(z)*5,py+Math.sin(z)*5,3.1)}accessories+=pearl(px,py,2.5);
 }
 function cascade(sign){
  const root=x+sign*(tw+3),edge=x+sign*(s+5),inner=x+sign*(f.cheek+3),to=end+66;
  lengths+=feature('side-cascade',draw(`M${root},${fy} C${edge+sign*18},${fy+3} ${edge-sign*5},${y+h*.4} ${edge+sign*5},${end-2} C${edge+sign*20},${end+17} ${edge-sign*8},${end+29} ${edge+sign*6},${end+44} Q${edge+sign*16},${to} ${edge-sign*13},${to} Q${edge+sign*1},${end+43} ${edge-sign*12},${end+33} C${inner-sign*8},${end+17} ${inner+sign*6},${end-2} ${inner},${y+h*.3} Q${x+sign*r*.9},${y-h*.25} ${root},${fy}Z`)+line(`M${edge-sign*1},${fy+9} C${edge+sign*10},${end-7} ${edge-sign*15},${end+15} ${edge},${end+30} Q${edge+sign*10},${end+43} ${edge-sign*4},${to-6}`));
 }
 function highSweep(){
  front+=feature('high-sweep',draw(`M${x+r*.72},${t-13} C${x+7},${t-36} ${x-r-18},${t-21} ${x-r-9},${fy-9} Q${x-r-14},${fy+1} ${x-r-20},${fy-3} Q${x-r-16},${Math.min(fy+12,brow-4)} ${x-r*.65},${fy+3} C${x-r*.12},${fy-3} ${x-2},${t-7} ${x+fw*.32},${t+1} Q${x+r},${t+8} ${x+tw},${fy+7} Q${x+r+15},${fy-9} ${x+r*.72},${t-13}Z`));
  texture+=line(`M${x+r*.5},${t-10} C${x},${t-23} ${x-r-8},${t-10} ${x-r-4},${fy-4} M${x+r*.38},${t-4} Q${x-r*.5},${t-15} ${x-r*.6},${fy-1}`);
 }
 if(n===28){centrePart();crown();if(a==='D')for(const sign of [-1,1])tendril(sign,end+31);}
 else if(n===29){
  if(a==='G')fan();else{back=bun(x,t-18,24,16);centrePart();for(const sign of [-1,1])tendril(sign,end+35);if(m.state.accessories)accessories+=ornament(`M${x-15},${t-3} Q${x},${t-9} ${x+15},${t-3} l-1,3 Q${x},${t-5} ${x-14},${t}Z`);}
 }else if(n===30){
  if(a==='D')back=bun(x+3,t-13,21,13);
  centrePart();sideRolls(true);
  for(const sign of [-1,1])curls(sign,end+(a==='D'?63:19),a==='D'?4:3,a==='D'?10:8);
  // Open frontal loops, rather than wave marks on a smooth cap.
  front+=feature('frontal-curl',draw(`M${x-4},${t+5} C${x-19},${t-12} ${x-r-4},${t+2} ${x-r-2},${fy-3} Q${x-r-8},${fy+8} ${x-r-14},${fy-1} Q${x-r-11},${fy+13} ${x-r*.48},${fy+2} C${x-r*.1},${fy-8} ${x-r*.8},${t+2} ${x-4},${t+5}Z`));
  if(a==='D')pearls(t+2,13,5);
 }else if(n===31){
  if(a==='D'){back=bun(x,t-20,23,17);for(const sign of [-1,1])tendril(sign,end+28,false);pearls(t-4,20,7)}
  else back=bun(x,t+1,22,12);
  centrePart();sideRolls(a==='D');
 }else if(n===32||n===35){
  const thin=n===35;
  if(a==='G'){swept();hangingBraid(-1,{thin,loose:thin});if(thin)pearls(t+3,20,7)}
  else{centrePart();crown(thin);for(const sign of [-1,1])hangingBraid(sign,{thin,loose:thin});
   if(thin&&m.state.accessories){accessories+=ornament(`M${x},${fy-6} l4,6 -4,6 -4,-6Z`);for(const sign of [-1,1]){const px=x+sign*(s+8),yy=end+30;accessories+=ornament(`M${px},${yy} l4,8 -4,8 -4,-8Z`);}}
  }
 }else if(n===33){
  if(a==='G'){swept();if(m.state.accessories){const px=x-s+2,yy=end-10;backAccessories=ornament(`M${px},${yy} l-10,-4 v10 l10,-3 3,4 7,-8 -1,18 -6,-6Z`);}}
  else{back=bun(x+r*.8,t+2,20,20);swept();const px=x+s+3;flower(px,fy-10);if(m.state.accessories)for(let i=0;i<5;i++)accessories+=pearl(px+4+i*.4,fy+2+i*7,2.2);tendril(-1,end+15);}
 }else if(n===34){
  if(a==='G')fan(true);else{back=bun(x+8,t-13,23,15);cascade(1);highSweep();flower(x+s+2,fy-12)}
 }else if(n===36){
  if(a==='G'){centrePart();for(const sign of [-1,1])cascade(sign);if(m.state.accessories)for(const sign of [-1,1]){const px=x+sign*(r+1),yy=fy-5;accessories+=ornament(`M${px},${yy} q${-sign*12},-1 ${-sign*8},-15 q${sign*8},5 ${sign*8},15 q${sign*10},-6 ${sign*6},-19 q${-sign*9},10 ${-sign*6},19Z`);}}
  else{back=bun(x,t-12,24,14,2);centrePart();sideRolls(true);if(m.state.accessories)accessories+=ornament(`M${x-22},${t+4} l-3,-9 9,4 3,-13 7,8 6,-17 6,17 7,-8 3,13 9,-4 -3,9 Q${x},${t-1} ${x-22},${t+4}Z`);}
 }
 return {back,volume,front,sides,texture,lengths,accessories,backAccessories,defs:'',policy:{mode:'full'}};
}
