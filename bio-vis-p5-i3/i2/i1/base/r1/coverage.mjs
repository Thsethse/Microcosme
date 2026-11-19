// Local upper-cap envelope around the actual skin contour. Face and anchors are unchanged.
export const priorityCase=Object.freeze({cut:'bob',skull_width:1.18,skull_height:1.18,forehead_width:1.14,forehead_height:1.18,temple_width:.90,cheek_width:1.22,jowls:1.35,jaw_width:.82});
function upperSegments(outline){
 const n=[...outline.matchAll(/-?\d+(?:\.\d+)?(?:e[-+]?\d+)?/gi)].map(m=>Number(m[0]));
 const start=n.slice(0,2),segments=[];let previous=start;
 for(let i=2;i<20;i+=6){const next=[previous,n.slice(i,i+2),n.slice(i+2,i+4),n.slice(i+4,i+6)];segments.push(next);previous=next[3]}
 return segments;
}
function point(segment,t){
 const [a,b,c,d]=segment,u=1-t;
 const p=[0,1].map(i=>u*u*u*a[i]+3*u*u*t*b[i]+3*u*t*t*c[i]+t*t*t*d[i]);
 const v=[0,1].map(i=>3*u*u*(b[i]-a[i])+6*u*t*(c[i]-b[i])+3*t*t*(d[i]-c[i]));
 const length=Math.hypot(...v);return {x:p[0],y:p[1],nx:v[1]/length,ny:-v[0]/length};
}
export function scalpSamples(m,steps=6){
 const arcs=upperSegments(m.outline),right=[];
 for(let i=0;i<3;i++)for(let j=0;j<=steps;j++){
  if(i>0&&j===0)continue;
  // End at the actual temporal junction; brow centres stay well inside the open forehead.
  const t=j/steps;
  right.push(point(arcs[i],t));
 }
 const left=right.slice(1).map(p=>({x:160-p.x,y:p.y,nx:-p.nx,ny:p.ny})).reverse();
 return [...left,...right];
}
const fixed=n=>Number(n.toFixed(5));
function through(points){
 let d='M'+points[0];
 for(let i=0;i<points.length-1;i++){
  const a=points[Math.max(0,i-1)],b=points[i],c=points[i+1],e=points[Math.min(points.length-1,i+2)];
  const c1=b.map((v,j)=>fixed(v+(c[j]-a[j])/6)),c2=c.map((v,j)=>fixed(v-(e[j]-b[j])/6));
  d+=` C${c1} ${c2} ${c}`;
 }
 return d;
}
export function halfWidthAt(m,y){
 const arcs=upperSegments(m.outline);
 const segment=arcs.find(s=>y<=s[3][1])||arcs.at(-1);
 let lo=0,hi=1;
 for(let i=0;i<28;i++){const t=(lo+hi)/2;if(point(segment,t).y<y)lo=t;else hi=t}
 return point(segment,(lo+hi)/2).x-m.fit.cx;
}
export function coverageCap(m){
 const {fit:f,parameters:p,cut:c}=m,{cx:x,cy:y,rx:r,ry:h,top:t,forehead:fy,temple:tw,frontWidth:fw}=f;
 const samples=scalpSamples(m);
 // 4.2-unit skin stroke: 3.3 units cover its radius plus antialiasing margin.
 // Extra crown volume fades locally into the forehead/temple envelope.
 const outer=samples.map(point=>{
  const u=Math.max(0,Math.min(1,(y-h*.7-point.y)/(h*.3))),blend=u*u*(3-2*u),margin=3.3+3.2*blend;
  return [fixed(point.x+margin*point.nx),fixed(point.y+margin*point.ny)];
 });
 const join=Math.min(tw*(.9/.88),halfWidthAt(m,fy+2)-6.5);
 const rootY=y-h*.16,rootWidth=halfWidthAt(m,rootY)-6.5;
 const outerPath=through(outer);
 let d=outerPath;
 if(p.cut==='classic'){
  d+=` L${x+tw*(.87/.88)},${y+h*.08} L${x+Math.min(join,halfWidthAt(m,y-h*.36)-6.5)},${y-h*.36} Q${x+fw*.44},${fy+3} ${x+fw*.04},${fy-2} Q${x-fw*.55},${fy-9} ${x-join},${fy+4} L${x-tw*(.87/.88)},${y+h*.08}Z`;
 }else if(p.cut==='bob'){
  d+=` C${outer.at(-1)[0]},${outer.at(-1)[1]+1.5} ${x+rootWidth},${rootY+1.5} ${x+rootWidth},${rootY} C${x+rootWidth},${rootY-4} ${x+join},${fy+6} ${x+join},${fy+2} Q${x+fw*.43},${fy-1} ${x+fw*.19},${fy-8} L${x},${t+9} Q${x-fw*.16},${fy-1} ${x-join},${fy+2} L${x-rootWidth},${rootY}Z`;
 }else{
  d+=` C${outer.at(-1)[0]},${outer.at(-1)[1]+1.5} ${x+rootWidth},${rootY+1.5} ${x+rootWidth},${rootY} C${x+rootWidth},${rootY-4} ${x+join},${fy+5} ${x+join},${fy+1} Q${x+r*.35},${fy+4} ${x},${fy-2} Q${x-fw*.43},${fy+4} ${x-join},${fy+1} L${x-rootWidth},${rootY}Z`;
 }
 return `<path data-coverage="upper-cranium" d="${d}" fill="${c.color}" stroke="none"/><path d="${outerPath}" fill="none" stroke="${c.contour}" stroke-width="1.7" stroke-linejoin="round" stroke-linecap="round"/>`;
}
