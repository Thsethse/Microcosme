// Four local recipes only. All other choices delegate to the frozen P5-I6 renderer.
import {hairLayers as beforeLayers} from '../preview/bio-vis-p5-i6/hair.mjs';
import {coverageCap,scalpSamples} from '../preview/bio-vis-p5-i6/i5/i4/i3/i2/i1/base/r1/coverage.mjs';
export const targets=Object.freeze(['p5-058:G','p5-024:D','p5-068:G','p5-058:D']);
export const isTarget=m=>targets.includes(m.state.style+':'+m.state.arrangement);
export function hairLayers(m,instance='lot1'){
 const prior=beforeLayers(m,instance);
 if(!isTarget(m))return prior;
 const h={...prior},f=m.fit,{cx:x,cy:y,rx:r,ry:rh,top:t,forehead:fy,frontWidth:fw,temple:tw,side:s,end}=f;
 const brow=m.base.anchors.browLeft[1],low=Math.min(fy+7,brow-7);
 const draw=d=>`<path d="${d}" fill="${m.cut.color}" stroke="${m.cut.contour}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>`;
 const line=(d,w=1.2)=>`<path d="${d}" fill="none" stroke="${m.cut.contour}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>`;
 const feature=(name,s)=>`<g data-feature="${name}" data-anchor-reference="${m.hairAnchors.frontRight}">${s}</g>`;
 if(m.state.style==='p5-058'&&m.state.arrangement==='G'){
  // Short, close waves: remove the copied lobed halo, retain analytic scalp coverage.
  h.back='';h.volume=coverageCap(m);h.sides='';h.lengths='';
  // Seal only the two terminal joins of this short cut. The previous lobed curls hid
  // these wedges at wide-forehead extremes. Follow the real contour, not a global scale.
  const scalp=scalpSamples(m);
  for(const arc of [scalp.slice(0,4),scalp.slice(-4).reverse()]){
   const outer=arc.map(p=>[p.x+3.3*p.nx,p.y+3.3*p.ny]),inner=arc.map(p=>[p.x-p.nx,p.y-p.ny]);
   const points=[[outer[0][0],outer[0][1]+2],...outer,...inner.reverse(),[inner.at(-1)[0],inner.at(-1)[1]+2]];
   h.volume+=`<path data-coverage="short-wave-temple-join" d="M${points.join(' L')}Z" fill="${m.cut.color}" stroke="none"/>`;
  }
  h.front=feature('close-joined-waves',draw(`M${x-tw-2},${fy+2} C${x-r-5},${t+7} ${x-r*.6},${t-3} ${x-r*.23},${t+1} C${x-r*.02},${t-5} ${x+r*.35},${t-4} ${x+r*.54},${t+2} C${x+r*.96},${t+2} ${x+r+6},${fy-7} ${x+tw+2},${fy+2} Q${x+fw*.73},${low+2} ${x+fw*.38},${low-3} Q${x+fw*.18},${fy-3} ${x-fw*.04},${low-1} Q${x-fw*.35},${low+4} ${x-fw*.55},${low-2} Q${x-fw*.8},${fy+7} ${x-tw-2},${fy+2}Z`));
  h.texture=feature('broad-wave-rhythm',line(`M${x-r*.83},${fy-2} C${x-r*.64},${t+4} ${x-r*.12},${t+1} ${x-r*.12},${fy-4} Q${x-r*.08},${low+2} ${x-r*.39},${low-1} M${x-r*.06},${fy-4} C${x+r*.12},${t+4} ${x+r*.6},${t+5} ${x+r*.64},${fy-1} Q${x+r*.72},${fy+7} ${x+r*.4},${low-2}`));
  for(const sign of [-1,1])h.sides+=feature('short-temple-wave',draw(`M${x+sign*tw},${fy} C${x+sign*(r+5)},${fy-3} ${x+sign*(r+7)},${y+1} ${x+sign*(tw+2)},${y+rh*.18} Q${x+sign*(tw+3)},${y+1} ${x+sign*(tw-1)},${y-rh*.05} Q${x+sign*(tw+6)},${fy+5} ${x+sign*tw},${fy}Z`));
 }else if(m.state.style==='p5-024'){
  // The existing ponytail and its separate tie are untouched. Only the front/side hair changes.
  h.volume=coverageCap(m);h.front='';h.sides='';h.texture='';h.lengths='';
  for(const sign of [-1,1]){
   h.front+=feature('central-part-panel',draw(`M${x},${t+7} C${x+sign*r*.35},${t-1} ${x+sign*(r+6)},${fy-12} ${x+sign*(tw+3)},${fy+4} Q${x+sign*(tw+4)},${y-rh*.04} ${x+sign*(tw-3)},${y-rh*.08} Q${x+sign*(tw-5)},${fy+8} ${x+sign*fw*.57},${low} Q${x+sign*fw*.25},${fy-8} ${x},${t+7}Z`));
   h.texture+=line(`M${x+sign*2},${t+10} C${x+sign*r*.35},${t+2} ${x+sign*(r+1)},${fy-7} ${x+sign*(tw+1)},${fy+7}`);
   const outer=x+sign*(s+7),inner=x+sign*(f.cheek+3),start=y+rh*.28,to=end+34;
   h.lengths+=feature('side-wave-length',draw(`M${x+sign*(tw+1)},${fy+1} C${outer+sign*2},${fy-1} ${outer+sign*5},${start-8} ${outer},${start} C${outer-sign*9},${start+12} ${outer-sign*9},${end-4} ${outer+sign*2},${end+4} C${outer+sign*12},${end+13} ${outer+sign*9},${end+24} ${outer-sign*2},${to} Q${outer-sign*15},${to+4} ${outer-sign*13},${to-5} C${outer+sign*1},${end+20} ${inner-sign*6},${end+8} ${inner},${end-4} C${inner+sign*5},${y+rh*.18} ${x+sign*(tw-2)},${fy+7} ${x+sign*(tw+1)},${fy+1}Z`)+line(`M${x+sign*(tw+3)},${fy+6} C${outer+sign*4},${y+4} ${outer-sign*10},${end-6} ${outer+sign*3},${end+7} Q${outer+sign*10},${end+21} ${outer-sign*6},${to-3}`));
  }
 }else if(m.state.style==='p5-068'){
  // Only this front volume rises. The inherited cap, rear and temple anchors do not grow.
  h.front=feature('raised-three-returns',draw(`M${x+tw},${fy+2} C${x+r+3},${t+12} ${x+r*.72},${t-2} ${x+r*.2},${t-1} C${x+r*.44},${t-14} ${x+r*.1},${t-28} ${x-r*.32},${t-23} C${x-r*.05},${t-10} ${x-r*.54},${t-13} ${x-r*.98},${t-10} Q${x-r*1.2},${t-9} ${x-r*1.18},${t-5} Q${x-r*.9},${t+1} ${x-r*.63},${t-1} Q${x-r*.85},${t+12} ${x-r*1.23},${t+10} Q${x-r*1.17},${t+22} ${x-r*.73},${t+16} Q${x-r*.92},${fy-5} ${x-r*1.22},${fy-7} Q${x-r*1.14},${low+1} ${x-r*.63},${low-4} C${x-r*.2},${low-9} ${x+fw*.04},${fy-20} ${x+fw*.35},${fy-10} Q${x+tw*.92},${fy-5} ${x+tw},${fy+2}Z`));
  h.texture=feature('common-root-flow',line(`M${x+fw*.43},${fy-8} C${x+r*.32},${t+1} ${x-r*.03},${t-12} ${x-r*.22},${t-20} M${x+fw*.37},${fy-9} C${x-r*.03},${t-3} ${x-r*.5},${t-2} ${x-r*.87},${t-6} M${x+fw*.3},${fy-9} C${x-r*.07},${fy-9} ${x-r*.58},${t+15} ${x-r*.96},${t+15}`));
 }else{
  // 58-D alone: one frontal roll, continuous swept sides; 31-D and 68-D still delegate.
  h.front=feature('single-central-roll',draw(`M${x-tw},${fy+2} C${x-r*1.04},${t+5} ${x-r*.2},${t-6} ${x+r*.35},${t+2} C${x+r*.95},${t+11} ${x+r*.72},${fy+7} ${x+r*.11},${fy+7} C${x-r*.12},${fy+7} ${x-r*.18},${fy-3} ${x+r*.07},${fy-6} C${x-r*.36},${fy-10} ${x-r*.47},${fy+9} ${x-tw},${fy+2}Z`));
  h.sides='';h.texture='';h.lengths='';
  for(const sign of [-1,1]){
   h.sides+=feature('continuous-swept-side',draw(`M${x+sign*(tw-1)},${fy-4} C${x+sign*(r+9)},${fy-7} ${x+sign*(r+6)},${t-6} ${x+sign*r*.38},${t+1} Q${x+sign*r*.7},${t+8} ${x+sign*(tw+2)},${fy+1} Q${x+sign*(s+4)},${fy+9} ${x+sign*(tw+1)},${y+rh*.03} Q${x+sign*(tw+8)},${fy+12} ${x+sign*(tw-1)},${fy-4}Z`));
   const edge=x+sign*(s+1);
   h.lengths+=feature('short-rolled-end',draw(`M${x+sign*(tw+2)},${fy+4} C${edge+sign*7},${y+3} ${edge-sign*7},${end-15} ${edge+sign*2},${end-8} C${edge+sign*13},${end+1} ${edge-sign*7},${end+15} ${edge-sign*9},${end+4} Q${edge+sign*3},${end+9} ${edge-sign*1},${end-3} C${edge-sign*14},${end-13} ${edge+sign*1},${y+5} ${x+sign*(tw+2)},${fy+4}Z`));
  }
  h.texture=feature('central-roll-fold',line(`M${x-tw+3},${fy-2} C${x-r*.6},${t+5} ${x+r*.48},${t-2} ${x+r*.48},${fy-2} Q${x+r*.34},${fy+9} ${x+r*.1},${fy+2}`));
 }
 return h;
}
