import {model as priorModel} from './i4/model.mjs';
import {hairLayers as priorHair} from './i4/hair.mjs';
import {layers as oldLayers} from './i4/i3/i2/i1/base/render.mjs';
import {coverageCap,halfWidthAt} from './i4/i3/i2/i1/base/r1/coverage.mjs';
import {contourPath} from './i4/i3/i2/i1/base/r1/model.mjs';
import {strandFactory} from './i4/i3/strand.mjs';
import {lotE} from './catalogue.mjs';
export function rowRoutes(m){
 const {cx:x,rx:r,top:t,forehead:fy}=m.fit,count=m.state.arrangement==='G'?7:9;
 return Array.from({length:count},(_,j)=>{
  const u=(j/(count-1)-.5)*2;
  const A=[x+r*u*.78,t-4+Math.abs(u)*r*.27],B=[x+r*u*.99,t+7+Math.abs(u)*4],cy=fy-6+Math.abs(u)*8,C=[x+halfWidthAt(m,cy)*u*.88,cy];
  return Array.from({length:6},(_,i)=>{const v=i/5;return A.map((z,k)=>(1-v)**2*z+2*(1-v)*v*B[k]+v*v*C[k]);});
 });
}
export function coveragePolicy(m){
 const n=m.reference.number,a=m.state.arrangement;
 return {mode:n===55?'rows':n===63&&a==='G'?'unknown':n===62&&a==='G'?'crest':n===60&&a==='G'||n===62&&a==='D'?'right-shaved':'full',cutY:m.anchors.templeRight[1]-5,crestWidth:m.fit.rx*.69};
}
export function hairLayers(m,instance='drawing'){
 if(!lotE[m.state.style])return priorHair(m,instance);
 const f=m.fit,c=m.cut,{cx:x,cy:y,rx:r,ry:h,top:t,forehead:fy,temple:tw,side:s,end}=f,n=m.reference.number,a=m.state.arrangement,brow=m.base.anchors.browLeft[1];
 const draw=d=>`<path d="${d}" fill="${c.color}" stroke="${c.contour}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>`;
 const line=(d,w=1.2)=>`<path d="${d}" fill="none" stroke="${c.contour}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>`;
 const feature=(name,s)=>`<g data-feature="${name}">${s}</g>`,braid=strandFactory(draw,line),fineBraid=strandFactory(d=>draw(d).replace('stroke-width="1.8"','stroke-width="1.2"'),(d,w)=>line(d,Math.min(w,.8))),policy=coveragePolicy(m),id=instance.replace(/[^a-zA-Z0-9_-]/g,'-');
 const seed=(number,arrangement)=>priorHair(priorModel({...m.state,style:'p5-'+String(number).padStart(3,'0'),arrangement}),instance);
 const unclip=s=>s.replace(/^<g clip-path="[^"]*">/,'').replace(/<\/g>$/,'');
 let back='',volume=coverageCap(m).match(/^<path[^>]*\/>/)[0],front='',sides='',texture='',lengths='',accessories='',backAccessories='',defs='',color='',reusedClip=false;
 const ornament=d=>`<path d="${d}" fill="#d8bc7a" stroke="#91723c" stroke-width="1.5" stroke-linejoin="round"/>`;
 const pearl=(px,py,rr=2.5)=>`<circle cx="${px}" cy="${py}" r="${rr}" fill="#f4e5be" stroke="#91723c" stroke-width="1.1"/>`;
 function parted(){front+=seed(28,'G').front.split('<g data-feature="braided-crown">')[0];}
 function pulled(){
  front+=feature('pulled-roots',draw(`M${x-tw},${fy-3} C${x-r-5},${t-6} ${x+r+5},${t-6} ${x+tw},${fy-3} Q${x+r*.5},${fy-8} ${x},${fy-5} Q${x-r*.5},${fy-8} ${x-tw},${fy-3}Z`));
  for(const u of [-.75,-.4,0,.4,.75])texture+=line(`M${x+r*u},${fy-5} Q${x+r*u*.9},${t+7} ${x+r*u*.3},${t+2}`);
 }
 function smoothBun(px,py,rx,ry){
  return feature('smooth-bun',draw(`M${px-rx*.5},${py+ry-3} Q${x-r*.5},${t-3} ${x-r*.45},${t+10} L${x+r*.45},${t+10} Q${x+r*.5},${t-3} ${px+rx*.5},${py+ry-3}Z`)+draw(`M${px-rx},${py} C${px-rx},${py-ry*1.35} ${px+rx},${py-ry*1.35} ${px+rx},${py} C${px+rx},${py+ry*1.35} ${px-rx},${py+ry*1.35} ${px-rx},${py}Z`)+line(`M${px-rx*.45},${py-ry*.85} Q${px-rx},${py} ${px},${py+ry-1} M${px+rx*.25},${py-ry*.95} Q${px+rx*.9},${py} ${px},${py+ry-1}`));
 }
 function pins(px,py,crossed=false,rx=23){
  if(!m.state.accessories)return;
  const clip='pins-'+id;
  defs+=`<defs><clipPath id="${clip}" clipPathUnits="userSpaceOnUse"><path d="M-80,-160 H${px-rx*.95} V260 H-80Z M${px+rx*.95},-160 H240 V260 H${px+rx*.95}Z"/></clipPath></defs>`;
  const bars=ornament(`M${px-29},${py-2} l57,${crossed?-11:0} 1,3 -57,${crossed?11:0}Z`)+(crossed?ornament(`M${px-25},${py-15} l54,12 -1,3 -54,-12Z`):'');
  backAccessories+=`<g data-feature="hair-pins" clip-path="url(#${clip})">${bars}</g>`;
 }
 function loose(sign,to=end+16){
  const root=x+sign*(tw+2),edge=x+sign*(s+1);
  lengths+=feature('loose-lock',draw(`M${root},${fy-2} C${edge+sign*8},${y+8} ${edge-sign*7},${end-5} ${edge+sign*2},${end+3} Q${edge+sign*8},${to} ${edge-sign*3},${to} Q${edge+sign*2},${end+9} ${edge-sign*3},${end+3} C${edge-sign*11},${end-5} ${edge+sign*2},${y+7} ${root},${fy-2}Z`));
 }
 function band(yy,central=false){
  if(!m.state.accessories)return;
  accessories+=ornament(`M${x-r-5},${yy} Q${x},${yy-8} ${x+r+5},${yy} l-1,3 Q${x},${yy-4} ${x-r-4},${yy+3}Z`);
  if(central)accessories+=pearl(x,yy-2,3.4);
 }
 function flower(px,py){
  if(!m.state.accessories)return;
  for(let i=0;i<5;i++){const z=i*Math.PI*2/5;accessories+=pearl(px+Math.cos(z)*4,py+Math.sin(z)*4,2.8)}accessories+=pearl(px,py,2);
 }
 function hangingFine(sign,to,offset=0,rootY=fy+10){
  const root=[x+sign*(tw+2+offset),rootY],points=Array.from({length:12},(_,i)=>{const z=i/11;return [root[0]+sign*(s-tw+5)*Math.sin(Math.min(1,z*2)*Math.PI/2)+sign*2*Math.sin(z*Math.PI*2+.2*offset),root[1]+(to-root[1])*z];});
  sides+=feature('braid-root',draw(`M${root[0]-sign*4},${root[1]-12} Q${root[0]+sign*6},${root[1]-9} ${root[0]+sign*3},${root[1]+5} L${root[0]-sign*3},${root[1]+5}Z`));
  lengths+=fineBraid(points,2.25);
  if(m.state.accessories){const q=points[10];accessories+=ornament(`M${q[0]-2.8},${q[1]-1} h5.6 v4 h-5.6Z`);}
 }
 function braidedBun(){
  const py=t-18,rx=23,ry=16;
  back+=feature('braided-bun',draw(`M${x-10},${t-6} L${x-13},${t+8} H${x+13} L${x+10},${t-6}Z`)+draw(contourPath(Array.from({length:32},(_,i)=>[x+Math.cos(i*Math.PI/16)*rx,py+Math.sin(i*Math.PI/16)*ry]))));
  for(const scale of [1,.62]){
   const points=Array.from({length:33},(_,i)=>{const z=i*Math.PI/16;return [x+Math.cos(z)*rx*scale,py+Math.sin(z)*ry*scale]});back+=fineBraid(points,1.75);
  }
  if(m.state.accessories)accessories+=ornament(`M${x-16},${t-4} Q${x},${t-10} ${x+16},${t-4} l-1,3 Q${x},${t-6} ${x-15},${t-1}Z`);
 }
 if(n===55){
  volume='';if(a==='D')braidedBun();
  for(const points of rowRoutes(m))front+=feature('scalp-row',fineBraid(points,a==='G'?2.1:1.65));
  for(const sign of [-1,1]){
   // A common root bundle connects the laid outer rows to each group of hanging braids.
   sides+=draw(`M${x+sign*(tw-2)},${fy-5} Q${x+sign*(s+9)},${fy-2} ${x+sign*(tw+14)},${fy+32} L${x+sign*(tw+2)},${fy+32} Q${x+sign*(tw-1)},${fy+10} ${x+sign*(tw-2)},${fy-5}Z`);
   for(let i=0;i<(a==='G'?3:2);i++)hangingFine(sign,end+(a==='G'?65-i*6:13-i*6),i*5,fy+10+i*7);
  }
 }else if(n===56||n===61){
  const large=a==='D',px=x+(n===61&&large?9:0),py=t-(large?18:12),rx=large?23:14,ry=large?15:10;
  back=smoothBun(px,py,rx,ry);
  if(!large)pulled();else if(n===56)parted();else{const q=seed(19,'G');front=q.front;texture=q.texture;}
  if(large||n===61)for(const sign of [-1,1])loose(sign,end+(n===56?12:19));
  if(n===56&&large)pins(px,py,true,rx);if(n===61){pins(px,py,false,rx);if(large)flower(px+rx-1,py+4);}
 }else if(n===57){
  // The validated P4 straight-fringe path is reused, repainted to the local hair palette.
  front=oldLayers({...m.baseState,style:'fringe_bob'}).front.replace(/fill="(?!none")[^"]+"/g,`fill="${c.color}"`).replace(/stroke="[^"]+"/g,`stroke="${c.contour}"`);
  const to=end+(a==='G'?12:28);
  for(const sign of [-1,1]){
   const outer=x+sign*(s+10),inner=x+sign*(s-4),root=x+sign*(tw+1);
   sides+=feature('geometric-bob',draw(`M${root},${fy-7} Q${outer},${fy-9} ${outer},${y+h*.2} L${outer},${to} L${inner},${to} L${inner},${y+h*.32} Q${x+sign*r*.83},${y-h*.2} ${root},${fy-7}Z`));
   for(const u of [.25,.6])texture+=line(`M${outer+(inner-outer)*u},${fy+4} V${to-3}`);
   if(m.state.accessories)for(let i=0;i<3;i++)for(let j=0;j<2;j++){const px=outer+(inner-outer)*(i+.5)/3;accessories+=ornament(`M${px-1.5},${to-12+j*6} h3 v4 h-3Z`);}
  }
  for(let i=-2;i<=2;i++)texture+=line(`M${x+i*tw*.94/3},${fy-4} l1,${Math.min(brow-4,fy+10)-fy+1}`);
  band(fy-16,a==='G');
 }else if(n===58){
  const q=a==='G'?oldLayers(m.baseState):seed(31,'D');({back,volume,front,sides,texture,lengths}=q);
  if(a==='G'&&m.state.accessories)for(const sign of [-1,1])for(let i=0;i<4;i++){
   const px=x+sign*(r-3-i*4),py=fy-2-i*5;accessories+=ornament(`M${px},${py} q${-sign*10},-1 ${-sign*9},-10 q${sign*11},0 ${sign*9},10 q${sign*10},-4 ${sign*8},-14 q${-sign*10},4 ${-sign*8},14Z`);
  }
  if(a==='D')band(t+1,false);
 }else if(n===59){
  if(a==='G'){const q=seed(28,'G');({back,volume,front,sides,texture,lengths}=q);}else{parted();lengths=seed(42,'D').lengths;band(fy-10,true);}
 }else if(n===60){
  if(a==='G'){
   const q=seed(32,'G');sides=q.sides;lengths=q.lengths;accessories=q.accessories;
   const top=seed(41,'G');front=unclip(top.front);texture='';
   for(const u of [-.6,-.2,.25,.6])texture+=line(`M${x+r*u},${fy-5} Q${x+r*u*.7},${t+8} ${x+r*u*.35},${t+2}`);
   const points=Array.from({length:8},(_,i)=>{const z=i/7;return [x-r*.72-(tw+4-r*.72)*z,t+7+(fy+19-t-7)*z]});front+=feature('temple-row',braid(points,3.1));
  }else{
   const q=seed(32,'D');({back,volume,front,sides,texture,lengths,accessories}=q);lengths+=seed(28,'D').lengths;
  }
 }else if(n===62){
  if(a==='G'){
   const w=policy.crestWidth,root=Math.min(fy+2,brow-6),points=[[x-w,root],[x-r*.95,t-4],[x-r*.63,t-9],[x-r*.84,t-23],[x-r*.31,t-16],[x-r*.37,t-38],[x,t-26],[x+r*.19,t-43],[x+r*.36,t-24],[x+r*.68,t-32],[x+r*.65,t-12],[x+r*.98,t-20],[x+w,root]];
   front=feature('central-crest',draw('M'+points.join(' L')+'Z'));
   for(const u of [-.5,0,.5])texture+=line(`M${x+w*u},${root-2} Q${x+w*u*1.1},${t-4} ${x+w*u*.9},${t-16}`);
  }else{
   const q=seed(49,'G');({back,volume,front,sides,texture,lengths,defs}=q);reusedClip=true;
   if(m.state.contrast&&!m.state.monochrome){
    const clip='contrast-'+id,silhouette=(volume+front+sides).replace(/<\/?g[^>]*>/g,'');
    defs+=`<defs><clipPath id="${clip}" clipPathUnits="userSpaceOnUse">${silhouette}</clipPath></defs>`;
    color=`<g clip-path="url(#hair-${id})"><g data-feature="contrast-color" clip-path="url(#${clip})"><path d="M${x+r*.4},${t-23} Q${x-r*.35},${t-13} ${x-r*.72},${end+12} l-13,-8 Q${x-r*.72},${fy-10} ${x-r*.7},${t-25}Z" fill="#bd806c"/></g></g>`;
   }
  }
 }else if(n===63){
  if(a==='G'){
   // No hidden hairstyle is inferred. With the accessory off, only the labelled P4 head support remains.
   volume='';
   if(m.state.accessories){
    backAccessories+=ornament(`M${x-r-5},${fy-2} Q${x-s-12},${end-7} ${x-s-5},${end+35} L${x-s+6},${end+27} L${x-s+13},${end+34} Q${x-s+3},${end+2} ${x-tw+3},${fy+3}Z`);
    accessories+=feature('headscarf',ornament(`M${x-r-7},${fy+4} Q${x-r-15},${t-9} ${x},${t-10} Q${x+r+17},${t-8} ${x+r+9},${fy+5} Q${x+r+4},${fy-7} ${x+r*.42},${fy-11} Q${x-r*.15},${fy-7} ${x-r-7},${fy+4}Z`)+`<path d="M${x-r-7},${fy-4} Q${x},${t-3} ${x+r+8},${fy-11} M${x-r-5},${fy+1} Q${x-r*.2},${fy-13} ${x+r+9},${fy-17}" fill="none" stroke="#91723c" stroke-width="1.5"/>`);
   }
  }else{
   back=feature('twisted-half-up',smoothBun(x+5,t-16,24,15)+smoothBun(x+10,t-37,18,12));parted();lengths=seed(42,'D').lengths;for(const sign of [-1,1])loose(sign,end+22);
   if(m.state.accessories){band(t+1,false);accessories+=ornament(`M${x-4},${t-24} q12,-5 28,1 l-1,3 q-15,-5 -26,-1Z`);}
  }
 }
 if(!reusedClip&&(policy.mode==='crest'||policy.mode==='right-shaved')){
  const clip='hair-'+id,cw=policy.crestWidth;
  const d=policy.mode==='crest'?`M${x-cw},-120 H${x+cw} V${Math.min(fy+2,brow-6)} H${x-cw}Z`:`M-60,-120 H220 V${policy.cutY} H${x+tw*.72} V280 H-60Z`;
  defs+=`<defs><clipPath id="${clip}"><path d="${d}"/></clipPath></defs>`;volume=`<g clip-path="url(#${clip})">${volume}</g>`;
  if(policy.mode==='right-shaved')front=`<g clip-path="url(#${clip})">${front}</g>`;
 }
 return {back,volume,front,sides,texture,lengths,accessories,backAccessories,defs,color,policy};
}
