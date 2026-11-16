/* Integer raster supports derived from canonical feature widths; no independent portrait model. */
(function(root){
 'use strict';
 const FM=typeof module!=='undefined'?require('./facial-model.js'):root.FacialModel;
 function project(body,view,toScreen,scale){
  const groups=[],guides=[];if(view==='back')return {groups,commands:[],guides};
  const f=body.face,s=body.faceSettings,eyeBoxes=new Map(),axis=toScreen([0,f.medianY,0])[0];
  const rect=(id,x,y,w,h,color)=>({id,kind:'rectangle',x,y,w,h,color});
  const oval=(id,x,y,w,h,color)=>({id,kind:'oval',x,y,w,h,color});
  const polygon=(id,points,color)=>({id,kind:'polygon',points,color});
  const line=(id,points,color)=>({id,kind:'polyline',points,color});
  function contour(id,shape,b,color){
   if(shape==='round'||shape==='oval')return oval(id,b.x,b.y,b.w,b.h,color);
   if(shape==='rectangle')return rect(id,b.x,b.y,b.w,b.h,color);
   const point=(x,y)=>[b.x+x*b.w,b.y+y*b.h];
   if(shape==='triangle')return polygon(id,[[0,1],[.5,0],[1,1]].map(p=>point(...p)),color);
   if(shape==='invertedTriangle')return polygon(id,[[0,0],[1,0],[.5,1]].map(p=>point(...p)),color);
   const points=[];for(let i=0;i<=12;i++)points.push(point(i/12,.5*(1-Math.sin(Math.PI*i/12))));for(let i=12;i>=0;i--)points.push(point(i/12,.5*(1+Math.sin(Math.PI*i/12))));return polygon(id,points,color);
  }
  for(const e of f.features.eyes){
   if(view==='profile'&&e.side!=='right')continue;
   const w=Math.max(view==='profile'?1:2,Math.round((view==='profile'?e.depth:e.width)*scale)),h=Math.max(2,Math.round(e.height*scale));
   const x=view==='front'?Math.round(axis+(e.side==='left'?-1.5:.5)*w):Math.round(toScreen(e.position)[0]-w/2),y=Math.ceil(toScreen([0,e.top,0])[1]);
   const b={x,y,w,h},commands=[contour(e.id+'-rim',e.shape,b,body.palette.outline)];
   // Keep the support exactly w pixels wide, even when a tiny ellipse/triangle rounds inward.
   const row=e.shape==='triangle'?h-1:e.shape==='invertedTriangle'||e.shape==='rectangle'?0:Math.floor(h/2);
   commands.push(rect(e.id+'-support',x,y+row,w,1,body.palette.outline));
   if(w>2&&h>2)commands.push(contour(e.id+'-sclera',e.shape,{x:x+1,y:y+1,w:w-2,h:h-2},'#f9eddb'));
   const iw=Math.max(1,Math.round(w*.40)),ih=Math.max(1,h-2),ix=x+Math.floor((w-iw)/2),iy=y+Math.floor((h-ih)/2);
   commands.push(oval(e.id+'-iris',ix,iy,iw,ih,s.irisColor));
   if(iw>=3&&ih>=3)commands.push(rect(e.id+'-pupil',ix+Math.floor(iw/2),iy+1,1,Math.max(1,ih-2),body.palette.outline));
   groups.push({id:e.id,role:'eye',maskCount:2,bounds:b,canonicalPosition:e.position,commands});eyeBoxes.set(e.id,b);
  }
  for(const brow of f.features.brows){
   if(view==='profile'&&brow.side!=='right')continue;
   const eye=eyeBoxes.get('eye_'+brow.side),w=eye.w,h=Math.max(2,Math.round(brow.height*scale)),gap=Math.max(1,Math.round(f.height*.025*scale)),x=eye.x,y=eye.y-gap-h;
   const pt=(u,v)=>[x+u*(w-1),y+v*(h-1)];let command;
   if(brow.shape==='straight')command=rect(brow.id+'-shape',x,y+Math.floor(h/2),w,Math.max(1,Math.floor(h/2)),s.browColor);
   else if(brow.shape==='arch')command=line(brow.id+'-shape',[[0,1],[.25,.25],[.5,0],[.75,.25],[1,1]].map(p=>pt(...p)),s.browColor);
   else command=line(brow.id+'-shape',(brow.side==='left'?[[0,1],[1,0]]:[[0,0],[1,1]]).map(p=>pt(...p)),s.browColor);
   groups.push({id:brow.id,role:'brow',maskCount:0,bounds:{x,y,w,h},canonicalPosition:brow.position,commands:[command]});
  }
  const m=f.features.mouth,w=Math.max(3,Math.round((view==='profile'?m.depth:m.width)*scale)),h=Math.max(3,Math.round(m.height*scale)),center=toScreen(m.position),x=Math.round(center[0]-w/2),y=Math.round(center[1]-h/2),pt=(u,v)=>[x+u*(w-1),y+v*(h-1)],mouth=[];
  function semi(id,lower,left=0,right=1){const points=[pt(left,.5)];for(let i=0;i<=12;i++){const a=Math.PI*i/12,u=left+(right-left)*(1-Math.cos(a))/2,v=.5+(lower?1:-1)*.5*Math.sin(a);points.push(pt(u,v));}points.push(pt(right,.5));return polygon(id,points,s.lipColor);}
  if(m.shape==='lowerSemicircle'){mouth.push(rect('mouth-upper',x,y,w,1,s.lipColor),semi('mouth-lower',true));}
  else if(m.shape==='upperSemicircle'){mouth.push(semi('mouth-upper',false),rect('mouth-lower',x,y+h-1,w,1,s.lipColor));}
  else if(m.shape==='triangles'){mouth.push(polygon('mouth-upper-left',[[0,.45],[.25,0],[.5,.45]].map(p=>pt(...p)),s.lipColor),polygon('mouth-upper-right',[[.5,.45],[.75,0],[1,.45]].map(p=>pt(...p)),s.lipColor),polygon('mouth-lower',[[.15,.55],[.85,.55],[.5,1]].map(p=>pt(...p)),s.lipColor));}
  else if(m.shape==='rectangle'){mouth.push(rect('mouth-upper',x,y,w,1,s.lipColor),rect('mouth-lower',x,y+h-1,w,1,s.lipColor));}
  else {mouth.push(semi('mouth-upper-left',false,0,.5),semi('mouth-upper-right',false,.5,1),semi('mouth-lower',true));}
  groups.push({id:'mouth',role:'mouth',maskCount:0,bounds:{x,y,w,h},canonicalPosition:m.position,commands:mouth});
  for(const lash of f.features.lashes){
   const b=eyeBoxes.get(lash.eyeId);if(!b)continue;
   const xx=b.x+lash.u*(b.w-1),yy=b.y+FM.upper(s.eyeShape,lash.u)*Math.max(0,b.h-1),length=Math.max(1,Math.round((lash.tip[1]-lash.position[1])*scale)),out=(lash.u-.5)*Math.max(1,b.w*.35);
   groups.push({id:lash.id,role:'lash',eyeId:lash.eyeId,u:lash.u,maskCount:0,canonicalPosition:lash.position,commands:[line(lash.id+'-stroke',[[xx,yy],[xx+out,yy-length]],s.browColor)]});
  }
  if(view==='front'){
   const midY=toScreen([0,f.medianY,0])[1];guides.push({id:'face-median',from:[axis-f.width*scale*.46,midY],to:[axis+f.width*scale*.46,midY]});
   const left=eyeBoxes.get('eye_left'),right=eyeBoxes.get('eye_right');guides.push({id:'eye-gap',from:[left.x+left.w,left.y+left.h+2],to:[right.x,right.y+right.h+2]});
  }
  return {groups,commands:groups.flatMap(g=>g.commands),guides};
 }
 const api={project};if(typeof module!=='undefined')module.exports=api;root.FacialProjection=api;
})(globalThis);
