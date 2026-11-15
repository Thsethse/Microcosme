/* Orthographic projections of the canonical 3-axis body; no per-view generation. */
(function(root){
 'use strict';
 const S=typeof module!=='undefined'?require('./anatomical-skeleton.js'):root.AnatomicalSkeleton;
 const Surface=typeof module!=='undefined'?require('./surface-projection.js'):root.SurfaceProjection;
 const mix=(a,b,t)=>'#'+[1,3,5].map(i=>Math.round(parseInt(a.slice(i,i+2),16)*(1-t)+parseInt(b.slice(i,i+2),16)*t).toString(16).padStart(2,'0')).join('');
 function projectPoint(point,view){if(!['front','profile','back'].includes(view))throw Error('Vue inconnue.');return [view==='profile'?point[2]:view==='back'?-point[0]:point[0],point[1]];}
 function hull(points){const p=points.map(v=>v.slice()).sort((a,b)=>a[0]-b[0]||a[1]-b[1]);const cross=(o,a,b)=>(a[0]-o[0])*(b[1]-o[1])-(a[1]-o[1])*(b[0]-o[0]);
  const lower=[],upper=[];for(const x of p){while(lower.length>=2&&cross(lower.at(-2),lower.at(-1),x)<=0)lower.pop();lower.push(x);}for(const x of p.slice().reverse()){while(upper.length>=2&&cross(upper.at(-2),upper.at(-1),x)<=0)upper.pop();upper.push(x);}return lower.slice(0,-1).concat(upper.slice(0,-1));}
 function projectBody(body,view='front'){
  const scale=2,origin=[120,344],toScreen=p=>{const [x,y]=projectPoint(p,view);return [origin[0]+scale*x,origin[1]-scale*y];};
  const visible=v=>body.version===3&&view==='back'&&(/^(pectoralis_|abdominal_)/.test(v.id))?false:v.kind==='breast'?view!=='back':v.kind==='anatomical-marker'?view==='front'||(view==='profile'&&body.biologicalProfile.reproductiveFunction==='male'):true;
  const detailTone=mix(body.palette.skin,'#744548',.20);
  function breastMarks(v){
   if(!visible(v))return [];
   // All marks are points on the existing R1 ellipsoid, projected with the body.
   // No breast shape/size, pectoral or shading variant is introduced in R2.
   const {width:w,height:h,depth:d}=v.dimensions,local=(x,y,z)=>S.add(v.center,S.add(S.mul(v.basis.u,x),S.add(S.mul(v.basis.v,y),S.mul(v.basis.w,z))));
   const arc=[];
   for(let i=0;i<=12;i++){
    const a=Math.PI*i/12,x=w*.5*Math.cos(a),y=-h*.5*Math.sin(a);
    arc.push(toScreen(local(x,y,0)));
   }
   const profileArc=[];
   for(let i=0;i<=12;i++){const a=Math.PI*i/12;profileArc.push(toScreen(local(0,-h*.5*Math.sin(a),d*.5*Math.cos(a))));}
   const marks=[{id:v.id+'-lower-contour',kind:'polyline',points:view==='profile'?profileArc:arc,color:detailTone}];
   if(view==='front'){
    const point=toScreen(local(0,-h*.10,d*.5)),size=Math.min(w,h)*.16*scale;
    marks.push({id:v.id+'-surface-point',kind:'oval',x:point[0]-size/2,y:point[1]-size/2,w:size,h:size,color:body.palette.skin});
   }
   return marks;
  }
  const commands=body.volumes.map(v=>{
   const corners=v.vertices?v.vertices.slice():[];if(!v.vertices)for(const a of [-1,1])for(const b of [-1,1])for(const c of [-1,1]){
    corners.push(S.add(v.center,S.add(S.mul(v.basis.u,v.dimensions.width*a/2),S.add(S.mul(v.basis.v,v.dimensions.height*b/2),S.mul(v.basis.w,v.dimensions.depth*c/2)))));
   }
   const points=v.meshType==='prism'&&view!=='profile'?corners.filter((_,i)=>i%2===0).map(toScreen):hull(corners.map(toScreen)),xs=points.map(p=>p[0]),ys=points.map(p=>p[1]);
   const box={x:Math.min(...xs),y:Math.min(...ys),w:Math.max(...xs)-Math.min(...xs),h:Math.max(...ys)-Math.min(...ys)};
   const color=v.kind==='muscle'?mix(body.palette.skin,'#744548',.025+.055*body.parameters.muscleVolume):v.kind==='breast'?mix(body.palette.skin,'#744548',.085):v.kind==='anatomical-marker'&&body.biologicalProfile.reproductiveFunction!=='male'?detailTone:body.palette.skin;
   return {id:v.id,region:v.region,role:v.kind,kind:v.shape==='oval'?'oval':v.shape==='triangle'?'triangle':'polygon',points,...box,color,outline:body.palette.outline,
    visible:visible(v),surfaceMarks:v.kind==='breast'?breastMarks(v):[],
    anchor:toScreen(v.center),canonicalDimensions:v.dimensions,depth:view==='back'?-v.center[2]:view==='profile'?v.center[0]:v.center[2]};
  }).sort((a,b)=>a.depth-b.depth);
  Surface.decorate(body,commands,view,toScreen,scale);
  const debug={segments:Object.values(body.skeleton.segments).map(s=>({id:s.id,from:toScreen(s.origin),to:toScreen(s.end)})),
   joints:Object.values(body.skeleton.joints).map(j=>({id:j.id,point:toScreen(j.position)})),
   anchors:body.volumes.filter(visible).map(v=>({id:v.id,point:toScreen(S.point(body.skeleton,v.anchor))})).concat(Object.entries(body.skeleton.anchors).filter(([id])=>(view!=='back'||!(/^(eye|brow|mouth|face|facial)/.test(id)))&&(id!=='genital_anchor'||visible(body.volumes.find(v=>v.id==='sexual_marker')))).map(([id,a])=>({id,point:toScreen(S.point(body.skeleton,a))})))};
  const facialCommands=[];
  if(view!=='back'){
   for(const side of view==='profile'?['right']:['left','right']){
    const eye=toScreen(body.face.anchors['eye_'+side]),brow=toScreen(body.face.anchors['brow_'+side]),h=body.face.eyeHeight*scale;
    facialCommands.push({id:'face-eye-'+side,kind:'oval',x:eye[0]-h*.30,y:eye[1]-h/2,w:h*.60,h,color:body.palette.outline});
    facialCommands.push({id:'face-brow-'+side,kind:'rectangle',x:brow[0]-h*.45,y:brow[1]-.5,w:h*.90,h:1,color:body.palette.outline});
   }
   const mouth=toScreen(body.face.anchors.mouth),w=Math.max(2,body.face.width*.12*scale);facialCommands.push({id:'face-mouth',kind:'rectangle',x:mouth[0]-w/2,y:mouth[1]-.5,w,h:1,color:body.palette.outline});
  }
  return {facialCommands,outline:body.palette.outline,view,width:240,height:360,scale,origin,commands,debug,canonicalHeight:body.skeleton.height,bodyId:body.seed+':'+body.biologicalProfile.category};
 }
 const api={projectPoint,projectBody};if(typeof module!=='undefined')module.exports=api;root.BodyProjection=api;
})(globalThis);
