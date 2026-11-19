// P5-I2 braid primitive retained locally for curved C bundles; no change to the frozen parent.
export function strandFactory(draw,line){
 return function braid(points,width){
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
}
