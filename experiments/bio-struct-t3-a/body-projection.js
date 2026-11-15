/* Orthographic projections of the canonical 3-axis body; no per-view generation. */
(function(root){
 'use strict';
 const S=typeof module!=='undefined'?require('./anatomical-skeleton.js'):root.AnatomicalSkeleton;
 const mix=(a,b,t)=>'#'+[1,3,5].map(i=>Math.round(parseInt(a.slice(i,i+2),16)*(1-t)+parseInt(b.slice(i,i+2),16)*t).toString(16).padStart(2,'0')).join('');
 function projectPoint(point,view){if(!['front','profile','back'].includes(view))throw Error('Vue inconnue.');return [view==='profile'?point[2]:view==='back'?-point[0]:point[0],point[1]];}
 function hull(points){const p=points.map(v=>v.slice()).sort((a,b)=>a[0]-b[0]||a[1]-b[1]);const cross=(o,a,b)=>(a[0]-o[0])*(b[1]-o[1])-(a[1]-o[1])*(b[0]-o[0]);
  const lower=[],upper=[];for(const x of p){while(lower.length>=2&&cross(lower.at(-2),lower.at(-1),x)<=0)lower.pop();lower.push(x);}for(const x of p.slice().reverse()){while(upper.length>=2&&cross(upper.at(-2),upper.at(-1),x)<=0)upper.pop();upper.push(x);}return lower.slice(0,-1).concat(upper.slice(0,-1));}
 function projectBody(body,view='front'){
  const scale=2,origin=[120,344],toScreen=p=>{const [x,y]=projectPoint(p,view);return [origin[0]+scale*x,origin[1]-scale*y];};
  const commands=body.volumes.map(v=>{
   const corners=[];for(const a of [-1,1])for(const b of [-1,1])for(const c of [-1,1]){
    corners.push(S.add(v.center,S.add(S.mul(v.basis.u,v.dimensions.width*a/2),S.add(S.mul(v.basis.v,v.dimensions.height*b/2),S.mul(v.basis.w,v.dimensions.depth*c/2)))));
   }
   const points=hull(corners.map(toScreen)),xs=points.map(p=>p[0]),ys=points.map(p=>p[1]);
   const box={x:Math.min(...xs),y:Math.min(...ys),w:Math.max(...xs)-Math.min(...xs),h:Math.max(...ys)-Math.min(...ys)};
   const color=v.kind==='muscle'?mix(body.palette.skin,'#744548',.15+.35*body.parameters.muscleVolume):v.kind==='anatomical-marker'?mix(body.palette.skin,'#744548',.3):body.palette.skin;
   return {id:v.id,region:v.region,kind:v.shape==='oval'?'oval':v.shape==='triangle'?'triangle':'polygon',points,...box,color,outline:body.palette.outline,
    anchor:toScreen(v.center),canonicalDimensions:v.dimensions,depth:view==='back'?-v.center[2]:view==='profile'?v.center[0]:v.center[2]};
  }).sort((a,b)=>a.depth-b.depth);
  const debug={segments:Object.values(body.skeleton.segments).map(s=>({id:s.id,from:toScreen(s.origin),to:toScreen(s.end)})),
   joints:Object.values(body.skeleton.joints).map(j=>({id:j.id,point:toScreen(j.position)})),
   anchors:body.volumes.map(v=>({id:v.id,point:toScreen(S.point(body.skeleton,v.anchor))})).concat(Object.entries(body.skeleton.anchors).map(([id,a])=>({id,point:toScreen(S.point(body.skeleton,a))})))};
  return {view,width:240,height:360,scale,origin,commands,debug,canonicalHeight:body.skeleton.height,bodyId:body.seed+':'+body.biologicalProfile.category};
 }
 const api={projectPoint,projectBody};if(typeof module!=='undefined')module.exports=api;root.BodyProjection=api;
})(globalThis);
