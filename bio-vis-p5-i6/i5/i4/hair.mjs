import {hairLayers as priorHair} from './i3/hair.mjs';
import {coverageCap,halfWidthAt} from './i3/i2/i1/base/r1/coverage.mjs';
import {contourPath} from './i3/i2/i1/base/r1/model.mjs';
import {strandFactory} from './i3/strand.mjs';
import {lotD} from './catalogue.mjs';
export function rowRoutes(m){
 const {cx:x,rx:r,top:t,forehead:fy}=m.fit;
 return [-.88,-.44,0,.44,.88].map(u=>Array.from({length:5},(_,i)=>{
  const v=i/4,start=[x+r*u*.9,t-4+Math.abs(u)*r*.25],control=[x+r*u*1.05+4,start[1]+5],end=[x+r*u*.55,fy-7+Math.abs(u)*2];
  return start.map((z,j)=>(1-v)**2*z+2*(1-v)*v*control[j]+v*v*end[j]);
 }));
}
export function coveragePolicy(m){
 const n=m.reference.number,a=m.state.arrangement;
 return {mode:n===46?'crest':n===53&&a==='G'?'rows':[47,49,50].includes(n)||n===53&&a==='D'?'right-shaved':'full',cutY:m.anchors.templeRight[1]-5,crestWidth:m.fit.rx*(a==='G'?.31:.48)};
}
export function hairLayers(m,instance='drawing'){
 if(!lotD[m.state.style])return priorHair(m,instance);
 const f=m.fit,c=m.cut,{cx:x,cy:y,rx:r,ry:h,top:t,forehead:fy,temple:tw,side:s,end,frontWidth:fw}=f,n=m.reference.number,a=m.state.arrangement,brow=m.base.anchors.browLeft[1];
 const draw=d=>`<path d="${d}" fill="${c.color}" stroke="${c.contour}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>`;
 const line=(d,w=1.2)=>`<path d="${d}" fill="none" stroke="${c.contour}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>`;
 const feature=(name,markup)=>`<g data-feature="${name}">${markup}</g>`,braid=strandFactory(draw,line),policy=coveragePolicy(m);
 const id=instance.replace(/[^a-zA-Z0-9_-]/g,'-');
 let back='',volume=coverageCap(m).match(/^<path[^>]*\/>/)[0],front='',sides='',texture='',lengths='',accessories='',backAccessories='',defs='',color='';
 const seed=(number,arrangement)=>priorHair({...m,reference:{number},state:{...m.state,style:'p5-'+String(number).padStart(3,'0'),arrangement}},'seed-'+id);
 const ornament=d=>`<path d="${d}" fill="#d8bc7a" stroke="#91723c" stroke-width="1.5" stroke-linejoin="round"/>`;
 function swept(){const q=seed(19,'G');front+=q.front;texture+=q.texture;}
 function fade(){
  for(const u of [.25,.6,.85]){const yy=policy.cutY+(y-h*.12-policy.cutY)*u,edge=halfWidthAt(m,yy);texture+=line(`M${x+edge-5},${yy} l3.8,-1`,.9);}
 }
 function undercut(long=false,extreme=false){
  const tip=Math.min(fy+12,brow-4.5);
  front+=feature('oblique-root',draw(`M${x+r*.57},${t+5} C${x+3},${t-17} ${x-r*.8},${t-10} ${x-r*1.19},${t-13} Q${x-r*1.07},${t-1} ${x-r*.61},${t} L${x-r*1.16},${fy-6} Q${x-r*.73},${fy-9} ${x-r*.46},${fy-10} L${x-r*.75},${tip} Q${x-r*.23},${fy-1} ${x+fw*.21},${fy-14} Q${x+tw*.7},${fy-9} ${x+tw*.94},${fy-2} Q${x+r*1.01},${t+18} ${x+r*.57},${t+5}Z`));
  texture+=line(`M${x+r*.48},${t+7} Q${x-r*.22},${t-5} ${x-r*.69},${fy-6}`);
  if(long||extreme){
   const outer=x-s-(extreme?13:8),inner=x-s+2,to=end+(long?(extreme?53:21):5);
   sides+=feature('asymmetric-panel',draw(`M${x+r*.54},${t+7} C${x-r*.42},${t-2} ${outer},${fy+5} ${outer},${y+h*.2} L${outer-4},${to-10} L${outer+5},${to-20} L${outer+10},${to} L${outer+15},${to-11} L${outer+24},${to+3} C${inner-9},${end+3} ${inner+1},${y+h*.3} ${inner},${y+h*.15} Q${x-r*.5},${fy-7} ${x+r*.54},${t+7}Z`));
   texture+=line(`M${x+r*.36},${t+10} Q${outer+2},${fy+6} ${outer+8},${to-15}`);
  }
  fade();
 }
 function crest(){
  const w=policy.crestWidth,rootY=Math.min(fy+3,brow-6);
  const pts=a==='G'?[[x-w,rootY],[x-w-4,t-22],[x-w*.3,t-14],[x-w*.45,t-36],[x,t-29],[x+w*.4,t-40],[x+w*.48,t-24],[x+w+5,t-30],[x+w,rootY]]:
   [[x-w,rootY],[x-r*.93,fy-5],[x-r*.67,t+2],[x-r*1.02,t-4],[x-r*.47,t-9],[x-r*.75,t-21],[x-r*.17,t-15],[x-r*.32,t-34],[x+r*.18,t-26],[x+r*.4,t-34],[x+r*.55,t-16],[x+r*.78,t-22],[x+w,rootY]];
  const d=a==='G'?'M'+pts.join(' L')+'Z':`M${x-w},${rootY} Q${x-r*.73},${fy-6} ${x-r*1.13},${fy+1} Q${x-r*1.01},${t+1} ${x-r*.57},${t+2} Q${x-r*.98},${t-8} ${x-r*1.1},${t-11} Q${x-r*.57},${t-18} ${x-r*.23},${t-9} L${x-r*.49},${t-31} Q${x-r*.03},${t-28} ${x+r*.16},${t-11} L${x+r*.37},${t-31} Q${x+r*.64},${t-22} ${x+r*.45},${t-5} Q${x+r*.96},${t-14} ${x+r*.78},${t-24} Q${x+r*1.08},${t-10} ${x+w},${rootY}Z`;
  front+=feature('central-crest',draw(d));
  for(const u of [-.55,0,.55])texture+=line(`M${x+w*u*.5},${rootY-2} Q${x+w*u},${t-7} ${x+w*u},${t-(a==='G'?22:15)}`);
 }
 function highFan(){
  front+=feature('extravagant-fan',draw(`M${x-r-6},${fy-1} Q${x-r-19},${fy-7} ${x-r-5},${fy-13} Q${x-r-18},${t+3} ${x-r-11},${t-13} Q${x-r-7},${t+1} ${x-r*.5},${t-3} C${x-r*1.01},${t-22} ${x-r*.6},${t-34} ${x-r*.41},${t-39} Q${x-r*.53},${t-18} ${x-r*.1},${t-11} C${x-r*.25},${t-37} ${x+r*.13},${t-44} ${x+r*.35},${t-46} Q${x+r*.08},${t-24} ${x+r*.46},${t-16} Q${x+r*.65},${t-34} ${x+r*.78},${t-30} C${x+r*1.4},${t-19} ${x+r*1.21},${fy-10} ${x+tw},${fy+1} Q${x},${fy-7} ${x-r-6},${fy-1}Z`));
  for(const u of [-.75,-.2,.35,.75])texture+=line(`M${x+r*u*.3},${fy-8} C${x+r*u-10},${t-1} ${x+r*u-7},${t-18} ${x+r*u},${t-25}`);
 }
 function roll(px,py,ww,hh){
  return feature('closed-roll',draw(`M${px-ww},${py+3} C${px-ww-3},${py-hh} ${px+ww*.7},${py-hh-7} ${px+ww},${py-1} Q${px+ww+1},${py+hh} ${px-ww*.2},${py+hh} C${px-ww},${py+hh} ${px-ww*.8},${py-5} ${px+ww*.2},${py-5} C${px+ww*.8},${py-2} ${px+ww*.3},${py+7} ${px-ww*.2},${py+3}Z`));
 }
 function cylinder(points,width){
  const normal=points.map((p,i)=>{const aa=points[Math.max(0,i-1)],bb=points[Math.min(points.length-1,i+1)],dx=bb[0]-aa[0],dy=bb[1]-aa[1],l=Math.hypot(dx,dy);return [-dy/l,dx/l]});
  const sides=sign=>points.map((p,i)=>[p[0]+sign*normal[i][0]*width*.5,p[1]+sign*normal[i][1]*width*.5]);
  const aa=sides(1),bb=sides(-1),first=points[0],last=points.at(-1),tangent=[normal.at(-1)[1],-normal.at(-1)[0]];
  const shape=draw(contourPath([...aa,[last[0]+tangent[0]*width*.35,last[1]+tangent[1]*width*.35],...bb.reverse(),[first[0]-normal[0][1]*width*.35,first[1]+normal[0][0]*width*.35]]));
  let detail='';for(let i=2;i<points.length-1;i+=4){const p=points[i],nn=normal[i];detail+=line(`M${p[0]-nn[0]*width*.25},${p[1]-nn[1]*width*.25} q${nn[0]*width*.45+1},${nn[1]*width*.45+1} ${nn[0]*width*.5},${nn[1]*width*.5+2}`,.9);}
  return `<g data-feature="lock" data-root="${first}" data-end="${last}">${shape}${detail}</g>`;
 }
 function lockFan(long=false){
  const us=long?[-.83,-.42,-.05,.38,.8]:[-1,-.65,-.3,.08,.43,.75,1];
  for(const [i,u]of us.entries()){
   const root=[x+tw*u*.65,fy-6+Math.abs(u)*2],tip=[x+(r+14)*u,t-12+Math.abs(u)*39+(i%2?4:0)],points=Array.from({length:9},(_,j)=>{const z=j/8;return [root[0]+(tip[0]-root[0])*z+7*Math.sin(z*Math.PI),root[1]+(tip[1]-root[1])*z-7*Math.sin(z*Math.PI)];});front+=cylinder(points,long?8:9);
  }
  for(const sign of [-1,1])for(let i=0;i<(long?3:2);i++){
   const root=[x+sign*(tw+1+i*3),fy+6+i*5],to=end+(long?56+i*10+(sign<0?0:5):14+i*9),points=Array.from({length:17},(_,j)=>{const z=j/16;return [root[0]+sign*((s-tw+7+i*4)*Math.sin(Math.min(1,z*2)*Math.PI/2)+4*Math.sin(z*Math.PI*3+i*.4)),root[1]+(to-root[1])*z];});
   lengths+=cylinder(points,long?7.5:8.5);
   // The long strand root meets a local bundle, instead of floating outside the cap.
   sides+=draw(`M${root[0]-sign*6},${root[1]-15} Q${root[0]+sign*8},${root[1]-12} ${root[0]+sign*4},${root[1]+7} L${root[0]-sign*4},${root[1]+7}Z`);
   if(m.state.accessories){const q=points[long?12:10];accessories+=ornament(`M${q[0]-4},${q[1]-1} h8 v5 h-8Z`);}
  }
 }
 function hanging(sign,to,width=4,offset=0,rootY=fy+6){
  const root=[x+sign*(tw+3+offset),rootY],points=Array.from({length:11},(_,i)=>{const z=i/10;return [root[0]+sign*(s-tw+4)*Math.sin(Math.min(1,z*2)*Math.PI/2)+sign*3*Math.sin(z*Math.PI*2),root[1]+(to-root[1])*z];});
  sides+=feature('braid-root',draw(`M${root[0]-sign*6},${root[1]-15} Q${root[0]+sign*8},${root[1]-12} ${root[0]+sign*width},${root[1]+7} L${root[0]-sign*width},${root[1]+7}Z`));
  lengths+=braid(points,width);
  if(m.state.accessories){const q=points[8];accessories+=ornament(`M${q[0]-width},${q[1]-1} h${width*2} v5 h${-width*2}Z`);}
 }
 function feather(px,py,sign){
  if(!m.state.accessories)return '';
  return ornament(`M${px},${py} Q${px+sign*19},${py+14} ${px+sign*6},${py+35} Q${px-sign*12},${py+18} ${px},${py}Z`)+`<path d="M${px},${py+3} l${sign*5},25 m-1,-12 l${-sign*7},3" fill="none" stroke="#91723c" stroke-width="1.2"/>`;
 }
 if(n===46)crest();
 else if(n===47)undercut(a==='D');
 else if(n===48||n===54&&a==='G'){
  const q=seed(38,a);({back,volume,front,sides,texture,lengths}=q);
  if(a==='D'){
   front+=feature('radiating-tufts',draw(`M${x+r*.15},${t+13} Q${x-r*.4},${t-12} ${x-r*.58},${t-26} Q${x-r*.16},${t-25} ${x+r*.24},${t-5} L${x+r*.42},${t-31} Q${x+r*.82},${t-22} ${x+r*.65},${t+2} Q${x+r*1.3},${t-7} ${x+r*1.18},${t-18} Q${x+r*1.55},${t+4} ${x+r*.8},${t+19}Z`));
  }
  if(n===54&&m.state.accessories){
   const yy=fy-10;
   accessories+=ornament(`M${x-r-3},${yy-3} Q${x},${yy-10} ${x+r+3},${yy-3} l-1,5 Q${x},${yy-5} ${x-r-2},${yy+2}Z`);
   for(const sign of [-1,1])accessories+=`<ellipse cx="${x+sign*12}" cy="${yy}" rx="10" ry="7" fill="#ece0bd" stroke="#91723c" stroke-width="2.3"/>`;
   accessories+=feather(x-s-1,end-10,-1);
  }
 }else if(n===49||n===50){
  undercut(a==='D',n===49||a==='D');
  if(n===50&&a==='D')back+=draw(`M${x+tw},${fy-4} Q${x+s+12},${y} ${x+s+2},${end+44} L${x+s-7},${end+35} Q${x+s+1},${end-5} ${x+tw},${fy-4}Z`);
 }else if(n===51){
  if(a==='G')highFan();else{
   back+=draw(`M${x-r},${fy-8} Q${x-r-14},${t-12} ${x},${t-32} Q${x+r+27},${t-32} ${x+r+7},${fy-4}Z`);
   for(const [u,v,w,hh]of [[-.7,-13,13,18],[0,-25,15,19],[.68,-18,13,18],[1,-1,12,17]])back+=roll(x+r*u,t+v,w,hh);
   swept();const q=seed(31,'D');lengths=q.lengths;
   sides+=draw(`M${x+r*.57},${t+8} C${x-r*.4},${t-1} ${x-s-14},${fy+4} ${x-s-8},${y+h*.4} Q${x-s-19},${end+4} ${x-s+5},${end+24} Q${x-s-1},${end+2} ${x-s+1},${y+h*.34} Q${x-r*.9},${fy-3} ${x+r*.57},${t+8}Z`);
  }
 }else if(n===52)lockFan(a==='D');
 else if(n===53){
  if(a==='G'){
   volume='';for(const points of rowRoutes(m))front+=feature('scalp-row',braid(points,3.2));
   for(const sign of [-1,1])front+=feature('temple-row',braid([[x+sign*r*.73,t+10],[x+sign*tw,fy-6],[x+sign*(tw+3),fy+6]],3));
   hanging(-1,end+27,3.6,0);hanging(1,end+22,3.2,0);
  }else{
   swept();const crown=Array.from({length:11},(_,i)=>{const z=Math.PI+i*Math.PI*.72/10;return [x+Math.cos(z)*(r+5),y-h*.2+Math.sin(z)*(y-h*.2-t+9)];});front+=braid(crown,5);
   for(let i=0;i<3;i++){
    const yy=policy.cutY-14+i*3.7,points=Array.from({length:5},(_,j)=>[x+tw*.71+j*3.2,yy-2*Math.sin(j/4*Math.PI)]);front+=braid(points,1.4);
   }
   hanging(-1,end+67,4.8,1);hanging(-1,end+76,3.7,12,fy+19);const rootY=m.anchors.earRight[1]+6,rootX=x+tw+4;
   back+=draw(`M${x+tw},${policy.cutY-2} Q${x+s+6},${y+3} ${rootX+3},${rootY+5} L${rootX-3},${rootY+5} Q${x+tw+2},${y+5} ${x+tw-2},${policy.cutY-2}Z`);
   hanging(1,end+56,3.3,1,rootY);
  }
 }else if(n===54){
  highFan();swept();const q=seed(23,'D');sides=q.sides;
  if(m.state.accessories){accessories+=ornament(`M${x-r-4},${fy-13} Q${x},${fy-20} ${x+r+4},${fy-13} l-1,5 Q${x},${fy-16} ${x-r-3},${fy-8}Z`);accessories+=feather(x-s-1,end-10,-1);for(let i=0;i<4;i++)accessories+=`<circle cx="${x+r-4+i*1.5}" cy="${fy-6+i*4}" r="2" fill="#f4e5be" stroke="#91723c" stroke-width="1.1"/>`;}
 }
 if(policy.mode==='crest'||policy.mode==='right-shaved'){
  const clip='hair-'+id,cut=policy.cutY,cw=policy.crestWidth;
  const path=policy.mode==='crest'?`M${x-cw},-120 H${x+cw} V${Math.min(fy+3,brow-6)} H${x-cw}Z`:`M-60,-120 H220 V${cut} H${x+tw*.72} V280 H-60Z`;
  defs+=`<defs><clipPath id="${clip}"><path d="${path}"/></clipPath></defs>`;
  volume=`<g clip-path="url(#${clip})">${volume}</g>`;
  // A crest's projecting silhouette stays free above the head; only its implantation is limited.
  if(policy.mode==='right-shaved')front=`<g clip-path="url(#${clip})">${front}</g>`;
 }
 if(n===50&&m.state.contrast&&!m.state.monochrome){
  const clip='contrast-'+id;
  const silhouette=(volume+front+sides).replace(/<\/?g[^>]*>/g,'');
  defs+=`<defs><clipPath id="${clip}" clipPathUnits="userSpaceOnUse">${silhouette}</clipPath></defs>`;
  color=`<g clip-path="url(#hair-${id})"><g data-feature="contrast-color" clip-path="url(#${clip})"><path d="M${x-r*.2},${t-25} Q${x-r*.7},${fy-13} ${x-r*.65},${a==='G'?fy+4:end+66} l-12,-2 Q${x-r*.9},${fy-5} ${x-r*.72},${t-26}Z" fill="#dbc48a"/><path d="M${x+r*.4},${t-20} l12,3 Q${x+r*.7},${fy-7} ${x+tw},${fy+6} l-5,-2 Q${x+r*.4},${fy-12} ${x+r*.4},${t-20}Z" fill="#65421f"/></g></g>`;
 }
 return {back,volume,front,sides,texture,lengths,accessories,backAccessories,defs,color,policy};
}
