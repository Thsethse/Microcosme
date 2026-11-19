import {model as priorModel} from './i5/model.mjs';
import {hairLayers as priorHair} from './i5/hair.mjs';
import {coverageCap,halfWidthAt} from './i5/i4/i3/i2/i1/base/r1/coverage.mjs';
import {contourPath} from './i5/i4/i3/i2/i1/base/r1/model.mjs';
import {strandFactory} from './i5/i4/i3/strand.mjs';
import {lotF} from './catalogue.mjs';
export function coveragePolicy(m){
 const n=m.reference.number,a=m.state.arrangement;
 return {mode:m.reference.partialArrangements?.includes(a)?'partial':(n===64||n===70)&&a==='G'?'top':(n===71||n===72)&&a==='G'?'right-shaved':'full',cutY:m.anchors.templeRight[1]-5};
}
export function hairLayers(m,instance='drawing'){
 if(!lotF[m.state.style])return priorHair(m,instance);
 const {cx:x,cy:y,rx:r,ry:h,top:t,forehead:fy,temple:tw,side:s,end}=m.fit,c=m.cut,n=m.reference.number,a=m.state.arrangement,id=instance.replace(/[^a-zA-Z0-9_-]/g,'-'),policy=coveragePolicy(m);
 const draw=d=>`<path d="${d}" fill="${c.color}" stroke="${c.contour}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>`;
 const line=(d,w=1.2)=>`<path d="${d}" fill="none" stroke="${c.contour}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>`;
 const feature=(name,markup,root)=>`<g data-feature="${name}"${root?` data-root="${root}"`:""}>${markup}</g>`,braid=strandFactory(draw,line);
 const seed=(number,arrangement)=>priorHair(priorModel({...m.state,style:'p5-'+String(number).padStart(3,'0'),arrangement}),instance);
 const hairKeys=['back','volume','front','sides','texture','lengths'];
 let back='',volume=coverageCap(m).match(/^<path[^>]*\/>/)[0],front='',sides='',texture='',lengths='',accessories='',backAccessories='',defs='',color='',cover='';
 function copy(q){[back,volume,front,sides,texture,lengths]=hairKeys.map(k=>q[k]||'');defs=q.defs||'';}
 const ornament=d=>`<path d="${d}" fill="#d8bc7a" stroke="#91723c" stroke-width="1.5" stroke-linejoin="round"/>`;
 const bead=(px,py,rr=2.8)=>`<circle cx="${px}" cy="${py}" r="${rr}" fill="#f4e5be" stroke="#91723c" stroke-width="1.1"/>`;
 function band(yy){if(m.state.accessories)accessories+=ornament(`M${x-r-4},${yy} Q${x},${yy-8} ${x+r+4},${yy} l-1,3 Q${x},${yy-4} ${x-r-3},${yy+3}Z`);}
 function bun(){const q=seed(56,'G');back=q.back;front=q.front;texture=q.texture;}
 function parted(){front=seed(28,'G').front.split('<g data-feature="braided-crown">')[0];}
 function hanging(sign,to,width=5){
  const root=[x+sign*(tw+3),fy+7],points=Array.from({length:12},(_,i)=>{const z=i/11;return [root[0]+sign*(s-tw+6)*Math.sin(Math.min(1,z*2)*Math.PI/2)+sign*3*Math.sin(z*Math.PI*2),root[1]+(to-root[1])*z];});
  sides+=feature('braid-root',draw(`M${root[0]-sign*6},${root[1]-15} Q${root[0]+sign*8},${root[1]-12} ${root[0]+sign*width},${root[1]+7} L${root[0]-sign*width},${root[1]+7}Z`));lengths+=braid(points,width);
  if(m.state.accessories){const p=points[9];accessories+=ornament(`M${p[0]-width},${p[1]-1} h${width*2} v5 h${-width*2}Z`);}
 }
 function pins(){
  if(!m.state.accessories)return;
  const px=x,py=t-18,clip='pins-'+id;
  defs+=`<defs><clipPath id="${clip}" clipPathUnits="userSpaceOnUse"><path d="M-80,-160 H${px-22} V260 H-80Z M${px+22},-160 H240 V260 H${px+22}Z"/></clipPath></defs>`;
  backAccessories+=`<g data-feature="hair-pins" clip-path="url(#${clip})">${ornament(`M${px-29},${py+1} l59,-12 1,3 -59,12Z`)+ornament(`M${px-29},${py-4} l59,1 v3 l-59,-1Z`)}</g>`;
 }
 function smallTail(sign){
  const px=x+sign*(s+3),py=end-5;
  lengths+=feature('low-pigtail',draw(`M${px-sign*4},${py-5} Q${px+sign*13},${py-3} ${px+sign*18},${py+20} L${px+sign*9},${py+16} L${px+sign*7},${py+29} Q${px-sign*6},${py+15} ${px-sign*4},${py-5}Z`)+line(`M${px},${py} q${sign*10},9 ${sign*8},18`),[px,py]);
  // A short nape bundle overlaps the cap and the low tie; no floating pigtail.
  sides+=feature("pigtail-root",draw(`M${x+sign*(tw+1)},${fy-3} Q${x+sign*(s+4)},${fy+9} ${px+sign*4},${py+3} L${px-sign*5},${py+3} Q${x+sign*(s-8)},${y+h*.2} ${x+sign*(tw-3)},${fy+3}Z`));
  if(m.state.accessories)accessories+=ornament(`M${px-5},${py-1} h10 v3 h-10Z`);
 }
 function hood(){
  if(!m.state.accessories)return;
  const outer=`M${x},${t-36} Q${x-r-25},${t-17} ${x-r-31},${fy+13} Q${x-r-34},${end+18} ${x-s-7},${end+33} Q${x},${end+24} ${x+s+7},${end+33} Q${x+r+34},${end+18} ${x+r+31},${fy+13} Q${x+r+25},${t-17} ${x},${t-36}Z`;
  const inner=`M${x},${t+5} Q${x-r-3},${t+10} ${x-r-13},${fy+10} Q${x-s-17},${end+2} ${x-s-4},${end+16} Q${x},${end+23} ${x+s+4},${end+16} Q${x+s+17},${end+2} ${x+r+13},${fy+10} Q${x+r+3},${t+10} ${x},${t+5}Z`;
  backAccessories+=`<path d="${outer}" fill="#b58c50" stroke="#91723c" stroke-width="1.8"/>`;
  cover+=`<g data-feature="hood"><path d="${outer} ${inner}" fill="#b58c50" fill-rule="evenodd" stroke="#91723c" stroke-width="1.8" stroke-linejoin="round"/></g>`;
 }
 function scarf(){
  if(!m.state.accessories)return;
  backAccessories+=ornament(`M${x+r+3},${fy-2} Q${x+s+16},${end-5} ${x+s+13},${end+36} L${x+s+4},${end+28} L${x+s-1},${end+33} Q${x+s+4},${end-5} ${x+tw-3},${fy+3}Z`);
  accessories+=feature('headscarf',ornament(`M${x-r-7},${fy+4} Q${x-r-15},${t-12} ${x},${t-13} Q${x+r+17},${t-9} ${x+r+9},${fy+5} Q${x+r+4},${fy-7} ${x+r*.42},${fy-11} Q${x-r*.15},${fy-7} ${x-r-7},${fy+4}Z`)+`<path d="M${x-r-6},${fy-2} Q${x},${t-4} ${x+r+8},${fy-11}" fill="none" stroke="#91723c" stroke-width="1.4"/>`);
 }
 function crestBraid(levels){
  // Filled support joins every tier to the crown; tier arcs use the existing alternating bundle primitive.
  back+=feature('tiered-crown',draw(`M${x-r*.85},${t+12} Q${x-r*.92},${t-43} ${x},${t-46} Q${x+r*.92},${t-43} ${x+r*.85},${t+12}Z`));
  for(let j=0;j<levels;j++){
   const rr=r*(1.03-j*.19),yy=t+10-j*12,points=Array.from({length:15},(_,i)=>{const z=Math.PI+i*Math.PI/14;return [x+Math.cos(z)*rr,yy+Math.sin(z)*(15-j*1.2)];});back+=braid(points,5-j*.45);
  }
 }
 if((n===64||n===70)&&a==='G'){
  bun();
  const clip='hair-'+id;defs+=`<defs><clipPath id="${clip}"><path d="M-60,-120 H220 V${policy.cutY} H-60Z"/></clipPath></defs>`;volume=`<g clip-path="url(#${clip})">${volume}</g>`;front=`<g clip-path="url(#${clip})">${front}</g>`;
  for(const sign of [-1,1])for(const u of [.25,.6,.85]){const yy=policy.cutY+(y-h*.12-policy.cutY)*u,edge=halfWidthAt(m,yy);texture+=line(`M${x+sign*(edge-5)},${yy} l${sign*3.8},-1`,.9);}
  if(m.state.accessories)accessories+=ornament(`M${x-10},${t-5} q10,-3 20,0 v3 q-10,-3 -20,0Z`);
 }else if(n===64){
  const q=seed(28,'G');front=q.front;back=seed(56,'D').back;
  for(const sign of [-1,1])hanging(sign,end+72,5.5);
  if(m.state.accessories){band(t+1);for(const sign of [-1,1])for(let i=0;i<2;i++)accessories+=bead(x+sign*(s+9),end+29+i*8,2.4);}
 }else if(n===65){
  copy(seed(a==='G'?19:48,a==='G'?'G':'D'));
  if(a==='G'){
   back+=feature('projected-tufts',draw(`M${x+r*.5},${t+9} Q${x-r*.5},${t-21} ${x-r*1.15},${t-15} Q${x-r*1.04},${t-8} ${x-r*.7},${t-6} L${x-r*1.45},${t-1} L${x-r*1.13},${t+10} L${x-r*1.6},${t+15} Q${x-r*1.3},${t+24} ${x-r*.95},${fy-4}Z`));band(fy-10);
  }
 }else if(n===66||n===67&&a==='D'){
  volume='';back='';
  if(n===66&&a==='G'){const q=seed(26,'G');front=q.front;texture=q.texture;}
  else{parted();for(const sign of [-1,1])hanging(sign,end+72,5.4);}
  // Only the observed aperture is drawn. Hidden crown/back contours are absent even with the fabric removed.
  const clip='visible-'+id,yy=n===66?t+5:fy-6;
  defs+=`<defs><clipPath id="${clip}" clipPathUnits="userSpaceOnUse"><path d="M${x-r-13},${yy} H${x+r+13} V${end+100} H${x-r-13}Z"/></clipPath></defs>`;
  front=`<g clip-path="url(#${clip})">${front}</g>`;texture=`<g clip-path="url(#${clip})">${texture}</g>`;
  if(n===66)hood();else scarf();
 }else if(n===67){
  const q=seed(19,'G');copy(q);for(const sign of [-1,1])smallTail(sign);
 }else if(n===68){
  if(a==='G')copy(seed(19,'G'));else{copy(seed(56,'D'));defs='';const q=seed(31,'D');sides=q.sides;lengths=q.lengths;pins();}
 }else if(n===69){
  if(a==='G')copy(seed(54,'G'));else{
   copy(seed(23,'D'));const q=seed(31,'D');lengths=q.lengths;
   back+=feature('irregular-bun',draw(`M${x-14},${t+1} Q${x-35},${t-9} ${x-19},${t-26} Q${x-8},${t-39} ${x+2},${t-28} Q${x+28},${t-35} ${x+30},${t-13} Q${x+38},${t+3} ${x+15},${t+6}Z`)+line(`M${x-22},${t-12} Q${x-17},${t-32} ${x},${t-15} M${x+4},${t-24} Q${x+30},${t-26} ${x+20},${t-5}`));
   if(m.state.accessories){band(t+2);for(const sign of [-1,1])for(let i=0;i<3;i++)accessories+=bead(x+sign*(s+5),end+3+i*7,2);}
  }
 }else if(n===70){
  back=seed(56,'D').back;parted();lengths=seed(42,'D').lengths;
  if(m.state.accessories){for(let j=-3;j<=3;j++)accessories+=bead(x+j*r/3,fy-10+Math.abs(j)*1.5,3);accessories+=ornament(`M${x},${fy-7} l3,5 -3,4 -3,-4Z`);}
 }else if(n===71){
  if(a==='G')copy(seed(49,'G'));else{
   const q=seed(55,'D');back=q.back;front=seed(28,'G').front;for(const sign of [-1,1])hanging(sign,end+38,3.4);
   if(m.state.accessories){for(let i=-2;i<=2;i++)accessories+=bead(x+i*r*.4,fy-12+Math.abs(i)*2,2.8);accessories+=ornament(`M${x},${fy-8} l4,5 -4,5 -4,-5Z`);}
  }
 }else if(n===72){
  if(a==='G'){
   const q=seed(60,'G');copy(q);const swept=seed(25,'D');front=swept.front;defs=swept.defs;texture=swept.texture;sides+=swept.sides;
   for(let j=0;j<3;j++){const yy=fy-11+j*4,edge=halfWidthAt(m,yy)-4,start=Math.min(tw*.55,edge-3),points=Array.from({length:6},(_,i)=>[x+start+(edge-start)*i/5,yy-2*Math.sin(i/5*Math.PI)]);front+=feature('temple-row',braid(points,1.5));}
  }else{parted();crestBraid(3);lengths=seed(42,'D').lengths;}
 }
 return {back,volume,front,sides,texture,lengths,accessories,backAccessories,defs,color,cover,policy};
}
