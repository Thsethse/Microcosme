// Local Lot 3 recipes; shared helpers and all inherited files stay frozen.
import {hairLayers as previous} from '../bio-vis-dedup-lot-2/render.mjs';
import {coverageCap,scalpSamples} from '../bio-vis-p5-i6/i5/i4/i3/i2/i1/base/r1/coverage.mjs';
export const targets=Object.freeze(['p5-038:G','p5-048:G','p5-071:G','p5-019:D','p5-021:D','p5-056:D','p5-061:D','p5-029:G','p5-034:G','p5-051:G']);
export const isTarget=state=>targets.includes(state.style+':'+state.arrangement);
export function hairLayers(m,instance='lot3'){
 const prior=previous(m,instance);
 if(!isTarget(m.state))return prior;
 const h={...prior},f=m.fit,{cx:x,cy:y,rx:r,ry:rh,top:t,forehead:fy,frontWidth:fw,temple:tw,side:s,end}=f;
 const n=m.reference.number,brow=m.base.anchors.browLeft[1],low=Math.min(fy+8,brow-8);
 const draw=d=>`<path d="${d}" fill="${m.cut.color}" stroke="${m.cut.contour}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>`;
 const line=(d,w=1.2)=>`<path d="${d}" fill="none" stroke="${m.cut.contour}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>`;
 const feature=(name,markup)=>`<g data-feature="${name}" data-anchor-reference="${m.hairAnchors.frontRight}">${markup}</g>`;
 // Analytic P3-R1 envelope follows the actual skull, not a scaled coiffure.
 h.volume=coverageCap(m);h.front='';h.texture='';
 if(n===38){
  // C-38: three broad, same-direction returns, no comb of tiny teeth.
  h.front=feature('soft-directed-returns',draw(`M${x+tw+1},${fy+1} C${x+r+6},${t+7} ${x+r*.52},${t-8} ${x+r*.02},${t-7} Q${x+r*.33},${t+1} ${x+r*.1},${t+5} C${x-r*.13},${t-9} ${x-r*.77},${t-6} ${x-r*1.13},${t-10} Q${x-r*1.15},${t+3} ${x-r*.6},${t+7} Q${x-r*.91},${t+12} ${x-r*1.22},${t+8} Q${x-r*1.2},${t+23} ${x-r*.72},${t+24} Q${x-r*.93},${fy-1} ${x-r*1.18},${fy-4} Q${x-r*.98},${low+3} ${x-fw*.64},${low-1} C${x-fw*.28},${low-4} ${x-fw*.09},${fy-13} ${x+fw*.22},${fy-9} Q${x+tw*.8},${fy-5} ${x+tw+1},${fy+1}Z`));
  h.texture=feature('soft-return-flow',line(`M${x+fw*.22},${fy-7} C${x+r*.03},${t+4} ${x-r*.39},${t+3} ${x-r*.87},${t-3} M${x+fw*.15},${fy-7} Q${x-r*.29},${t+14} ${x-r*.96},${t+16} M${x+fw*.22},${fy-7} Q${x+r*.55},${t+4} ${x+r*.14},${t-3}`));
 }else if(n===48){
  // D-48: large outward tips, irregular spacing and a short open fringe.
  const pts=[[-1.04,25],[-1.32,12],[-1.02,13],[-1.2,-3],[-.76,3],[-.83,-20],[-.32,-5],[-.15,-25],[.2,-7],[.62,-18],[.64,-1],[1.12,-5],[.99,12],[1.27,17],[1.02,27]];
  let d='M'+pts.map(([u,v])=>[x+(r+1)*u,t+v]).join(' L');
  for(const [u,v]of [[1,0],[.65,3],[.41,-2],[.12,4],[-.12,-1],[-.5,4],[-.72,0],[-1,2]])d+=` L${x+fw*.92*u},${Math.min(fy+v,low)}`;
  h.front=feature('radial-large-tips',draw(d+'Z'));
  h.texture=feature('radial-tip-flow',line(`M${x-fw*.45},${fy-5} Q${x-r*.38},${t+7} ${x-r*.68},${t-9} M${x},${fy-7} Q${x+r*.01},${t+4} ${x-r*.08},${t-15} M${x+fw*.45},${fy-5} Q${x+r*.46},${t+8} ${x+r*.91},${t+2}`));
 }else if(n===71){
  // F-71: continuous oblique sheet and two wide returns, no copied undercut tip.
  // Its inner edge bends outside the eye; roots and endpoints remain parametric.
  h.sides='';h.lengths='';
  const eye=m.base.anchors.eyeLeft,inner=Math.min(x-f.cheek+2,eye[0]-8),outer=x-s-8;
  h.front=feature('oblique-covering-sheet',draw(`M${x+r*.68},${t+6} C${x+r*.17},${t-9} ${x-r*.59},${t-6} ${x-r*1.1},${t+2} Q${x-r*.72},${t+5} ${x-r*.48},${t+3} Q${outer-4},${fy-8} ${outer},${y+rh*.16} C${outer-1},${y+rh*.47} ${outer+5},${end-8} ${x-f.lower-2},${end+4} Q${inner-3},${y+rh*.37} ${inner},${eye[1]-7} C${inner+2},${low+3} ${x-fw*.24},${fy-10} ${x+fw*.27},${fy-12} Q${x+tw*.92},${fy-6} ${x+tw},${fy+1} Q${x+r+4},${t+15} ${x+r*.68},${t+6}Z`));
  h.texture=feature('sheet-two-origins',line(`M${x+r*.5},${t+8} C${x-r*.11},${t-1} ${outer+4},${fy+2} ${outer+5},${y+rh*.25} Q${outer+6},${end-6} ${x-f.lower-3},${end-2} M${x+r*.33},${t+10} C${x-r*.25},${t+8} ${inner-4},${fy+2} ${inner-5},${eye[1]-6}`));
 }else if(n===19||n===21){
  // Q03: rounded, inward lower panels vs continuous slanted straight panels.
  h.sides='';
  const blunt=n===21;
  // Local terminal wedges join the side panels to the analytic skull envelope.
  // In a wide forehead / narrow temple combination, an anchor-only join leaves
  // a small exposed skin triangle. Follow the contour normals at that join only.
  const scalp=scalpSamples(m);
  if(!blunt)for(const arc of [scalp.slice(0,4),scalp.slice(-4).reverse()]){
   const outer=arc.map(p=>[p.x+3.3*p.nx,p.y+3.3*p.ny]),inner=arc.map(p=>[p.x-p.nx,p.y-p.ny]);
   const points=[[outer[0][0],outer[0][1]+2],...outer,...inner.reverse(),[inner.at(-1)[0],inner.at(-1)[1]+2]];
   h.sides+=`<path data-coverage="bob-temple-join" d="M${points.join(' L')}Z" fill="${m.cut.color}" stroke="none"/>`;
  }
  for(const sign of [-1,1]){
   const outer=x+sign*(s+(blunt?4:10)),inner=x+sign*(f.cheek+2),bottom=end+(blunt?7:3),root=x+sign*(tw+1);
   h.sides+=feature(blunt?'straight-bob-panel':'inward-bob-panel',draw(`M${root},${fy-6} C${outer},${fy-8} ${outer+sign*(blunt?0:5)},${y+rh*.3} ${outer},${bottom-12} ${blunt?`L${outer},${bottom} L${x+sign*(f.lower+4)},${bottom}`:`Q${outer+sign*2},${bottom+8} ${x+sign*(f.lower-3)},${bottom-1}`} Q${inner-sign*2},${bottom-7} ${inner},${y+rh*.25} Q${x+sign*(tw-1)},${fy+5} ${root},${fy-6}Z`));
   h.texture+=line(`M${root+sign*3},${fy+1} ${blunt?`L${outer-sign*4},${bottom-4}`:`C${outer+sign*1},${y+5} ${outer+sign*4},${bottom-2} ${x+sign*(f.lower+1)},${bottom-4}`}`);
  }
  h.front=feature(blunt?'long-oblique-panel':'rounded-swept-panel',draw(blunt?
   `M${x+r*.65},${t+6} C${x-r*.06},${t-6} ${x-r*.92},${t+2} ${x-r-5},${fy+1} L${x-tw-3},${y+rh*.15} L${x-tw+1},${fy+6} Q${x-fw*.35},${low-1} ${x+fw*.17},${fy-15} Q${x+fw*.48},${fy-15} ${x+tw},${fy+1} Q${x+r+4},${t+18} ${x+r*.65},${t+6}Z`:
   `M${x+r*.6},${t+6} C${x+r*.08},${t-8} ${x-r*.63},${t-1} ${x-r-4},${fy-7} Q${x-r-9},${fy+5} ${x-r-8},${fy+1} Q${x-r*.91},${low+5} ${x-fw*.55},${low} C${x-fw*.12},${fy-9} ${x+fw*.12},${fy-15} ${x+fw*.33},${fy-10} Q${x+tw*.89},${fy-3} ${x+tw+1},${fy+1} Q${x+r+4},${t+17} ${x+r*.6},${t+6}Z`));
  h.texture+=line(blunt?`M${x+r*.48},${t+9} C${x-r*.12},${t+3} ${x-r*.84},${fy-6} ${x-tw-1},${fy+10}`:`M${x+r*.5},${t+9} C${x-r*.02},${t+1} ${x-r*.64},${fy-6} ${x-r*.97},${fy+1}`);
 }else if(n===56){
  // Keep the existing centred bun and hanging locks; strengthen two parted panels.
  for(const sign of [-1,1]){
   h.front+=feature('centred-bun-panel',draw(`M${x},${t+6} C${x+sign*r*.46},${t-4} ${x+sign*(r+8)},${fy-13} ${x+sign*(tw+3)},${fy+6} L${x+sign*(tw+1)},${y-rh*.03} Q${x+sign*(tw-3)},${fy+4} ${x+sign*fw*.64},${low-1} Q${x+sign*fw*.33},${fy-15} ${x},${t+6}Z`));
   h.texture+=line(`M${x+sign*2},${t+8} C${x+sign*r*.45},${t+3} ${x+sign*(r+3)},${fy-8} ${x+sign*(tw+2)},${fy+6}`);
  }
 }else if(n===61){
  // The off-centre bun and its connecting support are inherited, not moved.
  h.front=feature('broad-offset-frontal-roll',draw(`M${x+tw+2},${fy+1} C${x+r+7},${t+1} ${x+r*.22},${t-13} ${x-r*.36},${t-5} C${x-r*.84},${t-1} ${x-r*1.18},${fy-3} ${x-tw-2},${fy+3} Q${x-fw*.67},${low+5} ${x-fw*.2},${low} C${x+fw*.24},${low-4} ${x+fw*.1},${fy-13} ${x-fw*.16},${fy-12} C${x+fw*.3},${fy-18} ${x+fw*.61},${fy-11} ${x+tw+2},${fy+1}Z`));
  h.texture=feature('offset-roll-fold',line(`M${x-tw},${fy-1} C${x-r*.69},${t+7} ${x+r*.1},${t-3} ${x+r*.3},${fy-7} Q${x+r*.46},${low+2} ${x-fw*.14},${low-3} M${x+r*.38},${t+5} Q${x+r*.8},${t+12} ${x+tw},${fy-1}`));
 }else if(n===29){
  // B-29: a low continuous rolled lift, three broad rounded lobes.
  h.front=feature('low-rolled-lift',draw(`M${x-tw-3},${fy+1} C${x-r-16},${fy-7} ${x-r-7},${t-9} ${x-r*.46},${t-8} C${x-r*.18},${t-23} ${x+r*.48},${t-22} ${x+r*.61},${t-8} C${x+r+13},${t-9} ${x+r+15},${fy-5} ${x+tw+3},${fy+1} Q${x},${fy-8} ${x-tw-3},${fy+1}Z`));
  h.texture=feature('rounded-lift-folds',line(`M${x-1},${fy-8} C${x-r*.54},${fy-13} ${x-r*.9},${t+2} ${x-r*.56},${t-5} M${x+2},${fy-8} C${x+r*.17},${t+3} ${x-r*.05},${t-10} ${x-r*.25},${t-13} M${x+5},${fy-8} C${x+r*.72},${fy-15} ${x+r*.82},${t+4} ${x+r*.58},${t-4}`));
 }else if(n===34){
  // B-34: one flowing, sideways wave. Its open lip gives a direction, not just height.
  h.front=feature('tilted-high-wave',draw(`M${x-tw-3},${fy+1} Q${x-r-16},${fy-4} ${x-r-6},${t+7} Q${x-r-18},${t+6} ${x-r-13},${t-9} Q${x-r-2},${t+2} ${x-r*.56},${t-5} Q${x-r*1.06},${t-11} ${x-r*.89},${t-28} C${x-r*.73},${t-17} ${x-r*.25},${t-29} ${x+r*.19},${t-22} C${x+r*.72},${t-23} ${x+r*.91},${t-8} ${x+r*.8},${t-1} C${x+r+13},${t+1} ${x+r+13},${fy-5} ${x+tw+2},${fy+1} Q${x},${fy-7} ${x-tw-3},${fy+1}Z`));
  h.texture=feature('tilted-wave-flow',line(`M${x+fw*.25},${fy-8} C${x+r*.59},${t+4} ${x+r*.26},${t-22} ${x-r*.64},${t-20} M${x+fw*.2},${fy-8} C${x-r*.15},${t-2} ${x-r*.74},${t+5} ${x-r*.95},${t-2} M${x+fw*.28},${fy-8} Q${x+r*.8},${fy-16} ${x+r*.88},${t+6}`));
 }else if(n===51){
  // D-51: three open cylindrical returns with different directions and unequal gaps.
  h.front=feature('three-open-rolls',draw(`M${x-tw-4},${fy+1} Q${x-r-18},${fy-1} ${x-r-11},${fy-13} Q${x-r-23},${t+3} ${x-r-14},${t-15} C${x-r-15},${t-2} ${x-r*.56},${t+2} ${x-r*.48},${t-9} C${x-r*.86},${t-23} ${x-r*.55},${t-33} ${x-r*.34},${t-38} Q${x-r*.55},${t-18} ${x-r*.06},${t-12} C${x-r*.19},${t-36} ${x+r*.16},${t-47} ${x+r*.49},${t-40} C${x+r*.13},${t-42} ${x+r*.14},${t-26} ${x+r*.47},${t-15} C${x+r*.52},${t-33} ${x+r+16},${t-29} ${x+r+14},${t-11} Q${x+r+6},${t-22} ${x+r*.8},${t-9} Q${x+r+11},${fy-5} ${x+tw+2},${fy+1} Q${x},${fy-7} ${x-tw-4},${fy+1}Z`));
  h.texture=feature('open-roll-directions',line(`M${x-r*.2},${fy-8} C${x-r*.6},${t+1} ${x-r*1.02},${t-2} ${x-r-12},${t-8} M${x},${fy-9} C${x-r*.38},${t-4} ${x-r*.58},${t-22} ${x-r*.38},${t-29} M${x+r*.13},${fy-9} C${x-r*.08},${t-2} ${x+r*.04},${t-28} ${x+r*.32},${t-36} M${x+r*.26},${fy-8} C${x+r*.6},${t+1} ${x+r*.69},${t-20} ${x+r+9},${t-16}`));
 }
 return h;
}
