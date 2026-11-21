import {hairLayers as priorHair} from './i2/hair.mjs';
import {hairLayers as lotAHair} from './i2/i1/hair.mjs';
import {coverageCap,halfWidthAt} from './i2/i1/base/r1/coverage.mjs';
import {contourPath} from './i2/i1/base/r1/model.mjs';
import {strandFactory} from './strand.mjs';
import {lotC} from './catalogue.mjs';
export function coveragePolicy(m){
 const n=m.reference.number,a=m.state.arrangement;
 return {mode:n===41&&a==='G'?'top':n===44&&a==='D'?'right-shaved':'full',cutY:m.anchors.templeRight[1]-5};
}
export function hairLayers(m,instance='drawing'){
 if(!lotC[m.state.style])return priorHair(m,instance);
 const f=m.fit,c=m.cut,{cx:x,cy:y,rx:r,ry:h,top:t,forehead:fy,temple:tw,side:s,end,frontWidth:fw}=f;
 const n=m.reference.number,a=m.state.arrangement,brow=m.base.anchors.browLeft[1];
 const draw=d=>`<path d="${d}" fill="${c.color}" stroke="${c.contour}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>`;
 const line=(d,w=1.2)=>`<path d="${d}" fill="none" stroke="${c.contour}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>`;
 const feature=(name,markup)=>`<g data-feature="${name}">${markup}</g>`;
 const braid=strandFactory(draw,line),policy=coveragePolicy(m);
 let back='',volume=coverageCap(m).match(/^<path[^>]*\/>/)[0],front='',sides='',texture='',lengths='',accessories='',backAccessories='',defs='';
 const ornament=d=>`<path d="${d}" fill="#d8bc7a" stroke="#91723c" stroke-width="1.5" stroke-linejoin="round"/>`;
 const seed=(number,arrangement)=>priorHair({...m,reference:{number},state:{...m.state,style:'p5-'+String(number).padStart(3,'0'),arrangement}});
 const seedA=(number,arrangement)=>lotAHair({...m,reference:{number},state:{...m.state,style:'p5-'+String(number).padStart(3,'0'),arrangement}});
 function parted(){front+=seed(28,'G').front.split('<g data-feature="braided-crown">')[0];}
 function swept(){const q=seedA(19,'G');front+=q.front;texture+=q.texture;}
 function rough(kind){
  const tops={work:[[-1.04,24],[-1.22,14],[-.94,12],[-1.1,1],[-.72,5],[-.83,-10],[-.35,-4],[-.47,-17],[.07,-9],[.37,-15],[.52,-1],[.72,-9],[.8,5],[1.06,5],[1,16],[1.18,23]],
   battle:[[-1.02,25],[-1.34,16],[-1.07,9],[-1.25,-3],[-.78,2],[-.95,-15],[-.45,-7],[-.64,-24],[-.08,-14],[.25,-20],[.45,-4],[.78,-12],[.83,1],[1.23,-5],[1.1,11],[1.34,20],[1.01,23]],
   fringe:[[-1.01,27],[-1.17,19],[-1.02,11],[-1.18,5],[-.82,7],[-.9,-7],[-.35,-5],[-.53,-13],[.04,-6],[.4,-9],[.6,0],[.95,-2],[.85,8],[1.15,19],[1.01,28]],
   shag:[[-1.02,28],[-1.25,19],[-1.08,11],[-1.25,5],[-.87,7],[-1.05,-3],[-.51,1],[-.7,-14],[-.21,-8],[.1,-17],[.41,-6],[.77,-8],[.79,3],[1.09,6],[1,17],[1.26,24]],
   oblique:[[-1.03,25],[-1.18,16],[-.97,11],[-1.12,2],[-.74,4],[-.94,-6],[-.4,-4],[-.56,-14],[-.06,-8],[.31,-10],[.65,-2],[.9,2],[1.11,17],[1.02,26]]};
  const base=kind==='rustic'?'fringe':kind,top=tops[base];
  let d=`M${x+(r+1)*top[0][0]},${t+top[0][1]}`;
  for(let i=1;i<top.length;i++){const [u,v]=top[i],prev=top[i-1];d+=` Q${x+(r+1)*(i%2?prev[0]*.7+u*.3:prev[0]*.2+u*.8)},${t+(prev[1]+v)*.5+5} ${x+(r+1)*u},${t+v}`;}
  const fringes=kind==='rustic'?[[1,1],[.84,4],[.71,0],[.48,5],[.32,0],[.06,5],[-.12,0],[-.41,5],[-.49,0],[-.77,5],[-.83,0],[-1,3]]:
   kind==='oblique'?[[1,0],[.75,5],[.57,1],[.33,8],[.12,3],[-.16,13],[-.22,3],[-.57,15],[-.55,1],[-.89,10],[-1,2]]:
   kind==='work'?[[1,1],[.78,-3],[.57,-5],[.42,4],[.25,1],[.07,10],[-.04,1],[-.37,10],[-.33,0],[-.67,8],[-.8,2],[-1,7]]:
   [[1,2],[.79,8],[.64,1],[.42,10],[.3,0],[.09,13],[-.1,4],[-.31,12],[-.42,3],[-.73,13],[-.7,1],[-1,7]];
  for(const [u,v]of fringes)d+=` L${x+fw*.9*u},${Math.min(fy+v,brow-4.5)}`;
  front+=feature('irregular-fringe',draw(d+'Z'));
  for(const [u,v]of [[-.64,5],[-.15,-1],[.53,6]])texture+=line(`M${x+r*u},${t+v+9} q7,-4 12,0`);
 }
 function forelock(){
  const low=Math.min(fy+10,brow-4.5);
  front+=feature('swept-lock',draw(`M${x+r*.38},${t+6} C${x-r*.13},${t-4} ${x-r*.88},${t+7} ${x-fw*.83},${fy-1} Q${x-fw*.93},${low-3} ${x-fw*1.06},${low} Q${x-fw*.68},${low+1} ${x-fw*.48},${fy} C${x-fw*.14},${fy-11} ${x-fw*.15},${t+9} ${x+r*.38},${t+6}Z`));
 }
 function shag(sign,len=15){
  const edge=x+sign*(s+5),inner=x+sign*(s-5),root=x+sign*(tw+1),yy=end+len+(sign<0?0:5);
  sides+=feature('layered-lock',draw(`M${root},${fy-6} Q${edge+sign*6},${fy-7} ${edge+sign*3},${y+2} L${edge+sign*9},${y-3} Q${edge+sign*4},${y+11} ${edge+sign*11},${y+18} L${edge+sign*3},${y+15} Q${edge+sign*6},${end-9} ${edge+sign*12},${yy-7} L${edge+sign*3},${yy-10} Q${edge+sign*4},${yy+2} ${inner},${yy} L${inner+sign*3},${yy-10} Q${inner-sign*1},${end-5} ${inner},${y+h*.32} Q${x+sign*r*.88},${y-h*.18} ${root},${fy-6}Z`));
  texture+=line(`M${edge-sign*2},${y+3} Q${edge-sign*5},${end-3} ${edge+sign*4},${yy-7}`);
 }
 function wave(sign,to,{phase=0,amp=6,width=13,offset=0}={}){
  const start=fy-3,pts=[],N=36;
  for(let i=0;i<=N;i++){
   const u=i/N,z=Math.min(1,u*3),mix=z*z*(3-2*z),yy=start+(to-start)*u;
   let v=tw+3+(s+9+offset-tw-3)*mix+amp*Math.sin(u*Math.PI*5+phase)*mix;
   const w=width*(.4+.6*Math.sin(Math.PI*u)**.4);
   // Continuous transition from facial clearance to free lengths around the nape.
   // A hard yy<end branch would jump when a sampled knot crosses the chin line.
   const clearance=s+w/2+1.5-(s-tw)*Math.max(0,1-u*6),blend=Math.max(0,Math.min(1,(end+8-yy)/16));
   v+=(Math.max(v,clearance)-v)*blend;
   pts.push({x:x+sign*v,y:yy,w:i===N?1:w});
  }
  const outline=[...pts.map(p=>[p.x+p.w/2,p.y]),...pts.slice().reverse().map(p=>[p.x-p.w/2,p.y])];
  let detail='';for(let i=3;i<N-3;i+=7){const p=pts[i],q=pts[Math.min(N,i+5)];detail+=line(`M${p.x-sign*2},${p.y} Q${p.x+sign*5},${p.y+8} ${q.x-sign*2},${q.y}`);}
  lengths+=feature('free-wave',draw(contourPath(outline))+detail);
 }
 function loose(sign,to=end+20){
  const edge=x+sign*(s+2),root=x+sign*(tw+2);
  lengths+=feature('loose-lock',draw(`M${root},${fy-2} C${edge+sign*9},${y+8} ${edge-sign*6},${end-5} ${edge+sign*3},${end+4} Q${edge+sign*8},${to} ${edge-sign*3},${to} Q${edge+sign*2},${end+9} ${edge-sign*3},${end+4} C${edge-sign*11},${end-5} ${edge+sign*2},${y+7} ${root},${fy-2}Z`));
 }
 function halfBun(){
  const px=x+(a==='D'?7:3),py=t-11;
  back+=feature('half-up-knot',draw(`M${px-14},${py+10} C${px-25},${py+5} ${px-14},${py-13} ${px-3},${py-9} C${px+8},${py-15} ${px+24},${py} ${px+13},${py+10} L${x+12},${t+15} L${x-13},${t+15}Z`)+line(`M${px-4},${py-8} q-10,10 8,17 M${px+5},${py-7} q-5,10 7,15`));
  if(m.state.accessories)backAccessories+=ornament(`M${px-11},${py+7} q12,-3 24,1 l-1,3 q-12,-4 -22,-1Z`);
 }
 function hanging(sign,to,width=5,offset=0,rootY=fy+6){
  const root=[x+sign*(tw+3+offset),rootY],pts=Array.from({length:11},(_,i)=>{const u=i/10;return [root[0]+sign*(s-tw+3)*Math.sin(Math.PI*Math.min(1,u*2)/2)+sign*(n===45?6:3)*Math.sin(u*Math.PI*(n===45?3:1)),rootY+(to-rootY)*u]});
  const [ax,ay]=root;
  sides+=feature('braid-root',draw(`M${ax-sign*6},${ay-16} C${ax+sign*6},${ay-20} ${ax+sign*8},${ay-7} ${ax+sign*width*.8},${ay+5} L${ax-sign*width*.8},${ay+5} Q${ax-sign*4},${ay-5} ${ax-sign*6},${ay-16}Z`));
  lengths+=braid(pts,width);
  const tip=pts.at(-1);lengths+=draw(`M${tip[0]-width*.6},${tip[1]-1} Q${tip[0]},${tip[1]+10} ${tip[0]+width*.6},${tip[1]-1}Z`);
  if(m.state.accessories)accessories+=ornament(`M${tip[0]-width*.7},${tip[1]-1} h${width*1.4} v3 h${-width*1.4}Z`);
 }
 if(n===37){
  if(a==='G'){rough('work');forelock();}else{
   const ax=x-f.lower*.5,ay=end-8;
   // Same low-tail construction as A-24-G, oriented locally toward the source's left tie.
   back=draw(`M${ax},${ay} C${x-s-28},${ay-5} ${x-s-31},${end+21} ${x-s-10},${end+59} L${x-s-1},${end+49} L${x-s+3},${end+59} C${x-s-9},${end+20} ${ax+9},${ay+14} ${ax},${ay}Z`)+line(`M${ax-5},${ay+3} Q${x-s-28},${end+22} ${x-s-9},${end+47}`);
   if(m.state.accessories)backAccessories=ornament(`M${ax-4},${ay+1} l8,-3 1,3 -8,3Z`);
   // Low side tie copied from A-24-G; no upper bun. Forelock extends toward the left jaw.
   swept();
   const edge=x-s-8,inner=x-s+1;
   sides+=draw(`M${x+r*.5},${t+8} C${x-r*.4},${t+3} ${edge},${fy+6} ${edge},${y+h*.35} Q${edge-3},${end+2} ${x-f.lower*.65},${end+7} Q${x-f.lower*.85},${end} ${inner},${y+h*.36} Q${x-r*.97},${y-h*.2} ${x+r*.5},${t+8}Z`);
  }
 }else if(n===38){rough(a==='G'?'battle':'fringe');if(a==='D')for(const sign of [-1,1])shag(sign,12);}
 else if(n===39){
  if(a==='G')rough('rustic');else{parted();const q=seed(32,'D');sides=q.sides;lengths=q.lengths;accessories=q.accessories;}
 }else if(n===40){
  if(a==='G'){rough('shag');forelock();for(const sign of [-1,1])shag(sign,22)}
  else{parted();for(const sign of [-1,1])wave(sign,end+(sign<0?60:70),{phase:sign<0?.4:-.6,amp:sign<0?7:9});
   for(const sign of [-1,1]){hanging(sign,end+(sign<0?48:54),2.1,12,fy+23);if(m.state.accessories)for(let i=0;i<3;i++)accessories+=`<circle cx="${x+sign*(s+15)}" cy="${end-3+i*6}" r="2" fill="#f4e5be" stroke="#91723c" stroke-width="1.1"/>`;}
  }
 }else if(n===41){
  if(a==='D'){
   parted();const q=seed(32,'G');sides=q.sides;lengths=q.lengths;accessories=q.accessories;loose(1,end+10);
  }else{
   front+=feature('pulled-roll',draw(`M${x-r*.82},${fy-3} C${x-r*.96},${t-7} ${x+r*.78},${t-11} ${x+r*.84},${fy-4} Q${x},${fy+1} ${x-r*.82},${fy-3}Z`));
   for(const u of [-.6,-.2,.3,.65])texture+=line(`M${x+r*u},${fy-5} Q${x+r*u*.8},${t+6} ${x+r*u*.5},${t+2}`);
   const root=[x+s+2,end-9],pts=Array.from({length:11},(_,i)=>[root[0]+3*Math.sin(i/10*Math.PI),root[1]+i/10*78]);
   back+=draw(`M${x+tw+1},${policy.cutY-4} Q${x+s+9},${y} ${root[0]+3},${root[1]+6} L${root[0]-4},${root[1]+6} Q${x+s+1},${y} ${x+tw-2},${policy.cutY-3}Z`);
   lengths+=`<g data-attachment="rear">${braid(pts,5.5)}</g>`;
   if(m.state.accessories)accessories+=ornament(`M${root[0]-2},${root[1]+77} h5 v3 h-5Z`);
  }
 }else if(n===42){
  halfBun();parted();if(a==='G'){for(const sign of [-1,1])shag(sign,16)}else for(const sign of [-1,1])wave(sign,end+(sign<0?62:69),{phase:sign*.4,amp:6,width:14});
 }else if(n===43){
  if(a==='G'){rough('oblique');forelock();for(const sign of [-1,1])shag(sign,8)}else{for(const sign of [-1,1])wave(sign,end+(sign<0?71:63),{phase:sign<0?1:-.6,amp:8,width:14});swept();}
 }else if(n===44){
  if(a==='G')rough('oblique');else{
   const q=seedA(25,'D');front=q.front.replace(/^<g clip-path="[^"]*">/,'').replace(/<\/g>$/,'');sides=q.sides;texture=q.texture;
   // Three short laid braids sit above the exposed temple, separately from the long panel.
   for(let i=0;i<3;i++){
    const yy=policy.cutY-13+i*3.3;
    const pts=Array.from({length:5},(_,j)=>[x+tw*.72+j*2,yy-2*Math.sin(j/4*Math.PI)]);
    front+=braid(pts,1.5);
   }
  }
 }else if(n===45){
  if(a==='G'){
   for(const [i,u]of [-.94,-.63,-.31,.05,.37,.66,.92].entries()){
    const root=[x+tw*u,fy-6+Math.abs(u)*3],tip=[x+(r+12)*u,t-15+Math.abs(u)*29+(i%2?3:0)],pts=Array.from({length:3},(_,j)=>{const z=j/2;return [root[0]+(tip[0]-root[0])*z+3*Math.sin(z*Math.PI),root[1]+(tip[1]-root[1])*z]});front+=braid(pts,4.3);
   }
   hanging(-1,end+25,3.4,4);hanging(1,end+15,3,5);
  }else{
   const yy=y-h*.2,pts=Array.from({length:15},(_,i)=>{const z=Math.PI+i*Math.PI/14;return [x+Math.cos(z)*(r+7),yy+Math.sin(z)*(yy-t+10)]});
   front+=feature('braided-crown',braid(pts,6));swept();
   for(const [sign,offset,extra,width]of [[-1,3,69,4.7],[1,4,59,4.2],[-1,14,76,3],[1,15,79,2.9]])hanging(sign,end+extra,width,offset,fy+(offset>10?20:6));
  }
 }
 if(policy.mode!=='full'){
  const id='hair-'+instance.replace(/[^a-zA-Z0-9_-]/g,'-'),cut=policy.cutY;
  const d=policy.mode==='top'?`M-50,-100 H210 V${cut} H-50Z`:`M-50,-100 H210 V${cut} H${x+tw*.72} V270 H-50Z`;
  defs=`<defs><clipPath id="${id}"><path d="${d}"/></clipPath></defs>`;
  volume=`<g clip-path="url(#${id})">${volume}</g>`;front=`<g clip-path="url(#${id})">${front}</g>`;
  if(n===41)for(const sign of [-1,1])for(const u of [.25,.6,.85]){const yy=cut+(y-h*.12-cut)*u,edge=halfWidthAt(m,yy);texture+=line(`M${x+sign*(edge-5)},${yy} l${sign*3.8},-1`,.9);}
 }
 return {back,volume,front,sides,texture,lengths,accessories,backAccessories,defs,policy};
}
