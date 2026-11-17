import {geometry,palette as c} from './model.mjs';
const path=(d,fill=c.skin,stroke=c.contour,width=4.2,extra='')=>`<path d="${d}" fill="${fill}" stroke="${stroke}" stroke-width="${width}" stroke-linejoin="round" stroke-linecap="round" ${extra}/>`;
const ellipse=(x,y,rx,ry,fill,extra='')=>`<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="${fill}" ${extra}/>`;
const stroke=d=>path(d,'none',c.detail,1.9);
export function bodyMarkup(g){
 const {parameters:p,body:{shoulders:s,belly:b,hips:h,top:t,waist:w,bottom:d}}=g;
 let outline;
 const L=x=>80-x,R=x=>80+x;
 if(p.silhouette==='tee')outline=`M${L(s)},${t} L${R(s)},${t} L${R(s)},164 L${R(b)},164 L${R(h)},${d} L${L(h)},${d} L${L(b)},164 L${L(s)},164Z`;
 if(p.silhouette==='column')outline=`M${L(s)},${t} L${R(s)},${t-2} Q${R(b)},171 ${R(h)},${d} L${L(h)},${d+1} Q${L(b)},171 ${L(s)},${t}Z`;
 if(p.silhouette==='hourglass')outline=`M${L(s)},${t} L${R(s)},${t} L${R(b)},${w} L${R(h)},${d} L${L(h)},${d} L${L(b)},${w}Z`;
 if(p.silhouette==='trapezoid')outline=`M${L(s*.8)},${t} L${R(s*.8)},${t} L${R(s*1.25)},163 L${R(b)},163 L${R(h)},${d} Q80,${d-3} ${L(h)},${d} L${L(b)},163 L${L(s*1.25)},163Z`;
 if(p.silhouette==='pear')outline=`M80,${t-4} C${L(s*.8)},${t-6} ${L(s*1.13)},145 ${L(b*.86)},${w} C${L(h*1.26)},197 ${L(h*1.2)},${d+4} 80,${d+3} C${R(h*1.2)},${d+4} ${R(h*1.26)},197 ${R(b*.86)},${w} C${R(s*1.13)},145 ${R(s*.8)},${t-6} 80,${t-4}Z`;
 if(p.silhouette==='oval')outline=`M80,${t-3} C${L(s*1.25)},${t-5} ${L(s*1.3)},148 ${L(b*.82)},${w} C${L(h*1.35)},198 ${L(h*1.3)},${d+5} 80,${d+4} C${R(h*1.3)},${d+5} ${R(h*1.35)},198 ${R(b*.82)},${w} C${R(s*1.3)},148 ${R(s*1.25)},${t-5} 80,${t-3}Z`;
 let out=path(outline);
 const chestWidth=Math.min(s,b*1.2)*.79;
 if(p.chest==='pectoral'){
  out+=stroke(`M${80-chestWidth},137 q-7,8 0,14 Q72,158 80,149 Q88,158 ${80+chestWidth},151 q7,-5 0,-14 M80,153 v32 M72,169 q8,-4 16,0 M73,179 q7,-4 14,0`);
 }else if(p.chest==='curves'){
  for(const sign of [-1,1]){
   const x=80+sign*chestWidth*.55;
   out+=stroke(`M${x-sign*chestWidth*.48},139 Q${x-sign*chestWidth*.65},166 ${x},166 Q${x+sign*chestWidth*.67},169 ${x+sign*chestWidth*.58},147`);
   out+=ellipse(x+sign*chestWidth*.29,157,1.7,1.9,c.detail);
  }
 }else{
  out+=stroke(`M${80-chestWidth},146 Q${80-chestWidth*.8},161 76,157 M${80+chestWidth},146 Q${80+chestWidth*.8},161 84,157`);
 }
 const navelY=p.silhouette==='trapezoid'?199:191;
 out+=ellipse(80,navelY,1.9,3.4,c.detail);
 if(p.silhouette==='trapezoid')out+=stroke(`M${80-b*.72},198 Q80,218 ${80+b*.72},198`);
 // Deliberately schematic lower-body mark, matching the drawing's vocabulary.
 out+=stroke(`M${80-Math.min(h*.24,9)},221 q4,10 9,0 q5,10 ${Math.min(h*.24,9)},0`);
 if(p.age==='elder')out+=stroke(`M${80-b*.57},184 q4,5 8,5 M${80+b*.57},184 q-4,5 -8,5`);
 return `<g class="body-shape">${out}</g>`;
}
export function headMarkup(g){
 const {head:{cx:x,cy:y,rx,ry},anchors:a,parameters:p}=g;
 const hair=p.age==='elder'?'#b6ae94':p.hair==='swept'?'#d5a917':p.hair==='curls'?'#cb7916':p.hair==='bob'?'#6c521d':c.hair;
 const point=(u,v)=>[x+rx*u,y+ry*v];
 let out='';
 if(p.hair==='bob')out+=path(`M${point(-1.03,1.05)} Q${point(-1.48,-.4)} ${point(-.5,-1.13)} Q${point(.3,-1.6)} ${point(1,-.6)} L${point(1.12,1.06)} L${point(.66,1.02)} L${point(-.7,1.02)}Z`,hair,hair,2);
 let d;
 if(p.head==='triangle')d=`M${point(0,-1)} C${point(-1,-1)} ${point(-1.3,-.13)} ${point(-.86,.45)} L${point(0,1.18)} L${point(.86,.45)} C${point(1.3,-.13)} ${point(1,-1)} ${point(0,-1)}Z`;
 else if(p.head==='square')d=`M${point(-.9,-.1)} Q${point(-.97,-1.08)} ${point(0,-1.08)} Q${point(1.02,-1.08)} ${point(.94,-.1)} L${point(.94,.98)} L${point(-.94,.98)}Z`;
 else if(p.head==='pear')d=`M${point(-.84,.18)} C${point(-1.2,-.45)} ${point(-.65,-1.12)} ${point(0,-1.06)} C${point(.65,-1.12)} ${point(1.2,-.45)} ${point(.84,.18)} C${point(1.55,.92)} ${point(.9,1.13)} ${point(0,1.14)} C${point(-.9,1.13)} ${point(-1.55,.92)} ${point(-.84,.18)}Z`;
 else d=`M${point(0,-1)} C${point(-1.36,-1)} ${point(-1.3,1)} ${point(0,1)} C${point(1.3,1)} ${point(1.36,-1)} ${point(0,-1)}Z`;
 out+=path(d);
 // Eyes, brows, nose and mouth all follow the local head frame.
 for(const [i,anchor]of [a.eyeLeft,a.eyeRight].entries()){
  const [ex,ey]=anchor,ew=rx*.26,eh=ry*(p.eyes==='sleepy'?.105:.135);
  if(p.eyes==='sharp'){
   const sign=i===0?1:-1;
   out+=path(`M${ex-ew},${ey-eh-sign*2} L${ex+ew},${ey-eh+sign*2} L${ex+ew},${ey+eh} L${ex-ew},${ey+eh}Z`,c.white,c.pupil,.9);
  }else out+=ellipse(ex,ey,ew,eh,c.white);
  out+=ellipse(ex+(i===0?-1:1)*.5,ey+.3,1.9,2.2,c.pupil);
  if(p.eyes==='sleepy')out+=path(`M${ex-ew-1},${ey-eh*.6} Q${ex},${ey-eh*.25} ${ex+ew+1},${ey-eh*.6}`,'none',c.contour,2.7);
  const [bx,by]=i===0?a.browLeft:a.browRight;
  out+=path(p.eyes==='sharp'?`M${bx-ew},${by-2*(i===0?1:-1)} L${bx+ew},${by+2*(i===0?1:-1)}`:`M${bx-ew*.9},${by} Q${bx},${by-1.3} ${bx+ew*.8},${by+.2}`,'none',p.hair==='none'?c.contour:hair,p.eyes==='sharp'?2.6:2.2);
  if(p.age==='elder')out+=stroke(`M${ex-ew},${ey+eh+2.2} q${ew},2 ${ew*2},0`);
 }
 const [nx,ny]=a.nose;
 if(p.nose==='button')out+=stroke(`M${nx-3},${ny-1} q-2,-3 0,-3 q3,1 6,0 q3,2 -1,3 M${nx},${ny-1} v3`);
 if(p.nose==='line')out+=stroke(`M${nx},${ny-5} l-2,7 h5`);
 if(p.nose==='triangle')out+=path(`M${nx},${ny-5} l-4,7 h8Z`,c.detail,'none');
 const [mx,my]=a.mouth,mw=rx*.25;
 if(p.mouth==='line')out+=stroke(`M${mx-mw},${my} q${mw},1 ${mw*2},0`);
 if(p.mouth==='smile')out+=stroke(`M${mx-mw},${my-1} Q${mx},${my+5} ${mx+mw},${my-1}`);
 if(p.mouth==='lips')out+=path(`M${mx-mw},${my} l${mw*.7},-3 l${mw*.3},1 l${mw*.3},-1 l${mw*.7},3 Q${mx},${my+7} ${mx-mw},${my}Z`,'#af4b32','none');
 if(p.mouth==='round')out+=ellipse(mx,my,2.6,3.3,c.detail);
 if(p.mouth==='pout')out+=path(`M${mx},${my-1} C${mx-mw},${my-7} ${mx-mw},${my+2} ${mx},${my+4} C${mx+mw},${my+2} ${mx+mw},${my-7} ${mx},${my-1}Z`,c.detail,'none');
 if(p.age==='elder')out+=stroke(`M${mx-mw-2},${my-2} l-1,5 M${mx+mw+2},${my-2} l1,5 M${point(-.45,-.34)} q${rx*.45},-1 ${rx*.9},0`);
 if(p.hair==='short'){
  out+=path(`M${point(-1,.02)} Q${point(-1.4,-.85)} ${point(-.6,-1.13)} Q${point(-.12,-1.53)} ${point(.55,-1.13)} Q${point(1.2,-.98)} ${point(.95,-.45)} L${point(.89,-.02)} L${point(.7,-.58)} Q${point(.27,-.82)} ${point(0,-.64)} Q${point(-.7,-.94)} ${point(-.82,-.38)} L${point(-.85,.02)}Z`,hair,hair,2);
 }else if(p.hair==='bob'){
  out+=path(`M${point(-.94,-.3)} Q${point(-.95,-1.4)} ${point(0,-1.23)} Q${point(.8,-1.38)} ${point(.94,-.3)} Q${point(.3,-.38)} ${point(.05,-.86)} Q${point(-.3,-.12)} ${point(-.94,-.3)}Z`,hair,hair,1.5);
  for(let i=0;i<5;i++)out+=path(`M${point(-.5+i*.2,-1.06)} Q${point(-.3+i*.12,-.65)} ${point(0,-.45)}`,'none','#a48a39',.8);
 }else if(p.hair==='swept'){
  out+=path(`M${point(-1.05,1.02)} Q${point(-1.27,-.25)} ${point(-.98,-.72)} Q${point(-.48,-1.35)} ${point(.18,-1.1)} Q${point(.72,-1.46)} ${point(1,-.57)} L${point(1.04,1.03)} L${point(.83,1.03)} L${point(.77,-.52)} Q${point(.5,-.8)} ${point(.04,-.91)} Q${point(.12,-.13)} ${point(-.9,.04)} Q${point(-.42,-.44)} ${point(-.42,-.76)} Q${point(-.88,-.19)} ${point(-.85,.17)} L${point(-.8,1.02)}Z`,hair,hair,1.7);
 }else if(p.hair==='curls'){
  // The original has a dense curly cap and a short fringe, not an empty forehead.
  out+=path(`M${point(-1.06,.03)} Q${point(-1.26,-1.22)} ${point(0,-1.13)} Q${point(1.26,-1.22)} ${point(1.06,.03)} L${point(.84,-.35)} Q${point(.15,-.5)} ${point(-.84,-.35)}Z`,hair,hair,1.5);
  for(let row=0;row<5;row++)for(let col=0;col<11;col++){
   const u=-.86+col*.172,v=-.84+row*.118;
   if(u*u+v*v>1.45)continue;
   const [px,py]=point(u,v);
   out+=path(`M${px},${py} c-4,-4 5,-6 3,-1 c-1,5 -6,0 -2,-1`,'none',p.age==='elder'?'#d6c8a6':(row+col)%2?'#9b5b13':'#e5a044',1.1);
  }
  // Small deterministic locks along the cap and sides, never across the eyes.
  for(let i=0;i<66;i++){
   const angle=Math.PI+(i%22)/21*Math.PI,layer=Math.floor(i/22);
   const px=x+Math.cos(angle)*(rx*(1.03+layer*.06)),py=y+Math.sin(angle)*ry*(1.03+layer*.065)-layer*.6;
   out+=path(`M${px},${py} c-5,-7 6,-8 4,-2 c-2,6 -8,0 -3,-1`,'none',p.age==='elder'?'#c6baa1':i%3?'#a9681f':'#d39135',2.6);
  }
  for(const sign of [-1,1])for(let i=0;i<14;i++){
   const px=x+sign*(rx*(.98+(i%3)*.07)),py=y-ry*.25+i*3.4;
   out+=path(`M${px},${py} c${sign*7},-5 ${sign*7},7 0,5 c${-sign*5},-1 ${-sign*4},-6 0,-4`,'none',p.age==='elder'?'#b6ae94':i%2?hair:'#9f681f',2.4);
  }
 }
 return `<g class="head-shape">${out}</g>`;
}
export function character(input,options={}){
 const g=geometry(input),view=options.headOnly?'32 5 96 120':'0 0 160 270';
 const head=headMarkup(g);
 return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${view}" role="img" aria-label="${options.headOnly?'Visage agrandi':'Habitant entier'}"><g class="ink"${options.headOnly?'':' data-body="true"'}>${options.headOnly?'':bodyMarkup(g)}${head}</g></svg>`;
}
