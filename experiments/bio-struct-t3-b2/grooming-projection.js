/* Orthographic commands from one set of canonical B2 parts; raster masks protect B1 features. */
(function(root){
 'use strict';
 const mix=(a,b,t)=>'#'+[1,3,5].map(i=>Math.round(parseInt(a.slice(i,i+2),16)*(1-t)+parseInt(b.slice(i,i+2),16)*t).toString(16).padStart(2,'0')).join('');
 function hull(points){const p=points.map(a=>a.slice()).sort((a,b)=>a[0]-b[0]||a[1]-b[1]),cross=(o,a,b)=>(a[0]-o[0])*(b[1]-o[1])-(a[1]-o[1])*(b[0]-o[0]),lower=[],upper=[];for(const q of p){while(lower.length>=2&&cross(lower.at(-2),lower.at(-1),q)<=0)lower.pop();lower.push(q);}for(const q of p.slice().reverse()){while(upper.length>=2&&cross(upper.at(-2),upper.at(-1),q)<=0)upper.pop();upper.push(q);}return lower.slice(0,-1).concat(upper.slice(0,-1));}
 function project(body,view,toScreen){
  const hair=[],facial=[],portrait=[];if(body.version<5)return {hair,facial,portrait};
  for(const part of body.grooming.parts){
   if(!part.views.includes(view)||part.kind==='facial-hair'&&(view==='back'||body.biologicalProfile.category==='F'))continue;
   const vertices=view==='profile'&&part.solidVertices?part.solidVertices:part.vertices;
   const points=view==='profile'?hull(vertices.map(toScreen)):vertices.map(toScreen),xs=points.map(p=>p[0]),ys=points.map(p=>p[1]);
   if(points.length<3)continue;
   const x=Math.min(...xs),y=Math.min(...ys),w=Math.max(...xs)-x,h=Math.max(...ys)-y;
   const depth=part.vertices.reduce((sum,p)=>sum+(view==='profile'?p[0]:view==='back'?-p[2]:p[2]),0)/part.vertices.length;
   const strandColor=mix(part.color,parseInt(part.color.slice(1,3),16)<130?'#e4c69c':'#251c2e',.24);
   const command={id:part.id,region:'head',role:part.kind,kind:'polygon',points,x,y,w,h,color:part.color,outline:body.palette.outline,visible:true,depth,clipSurface:true,
    surfaceMarks:part.marks.map(m=>({id:m.id,kind:'polyline',points:m.points.map(toScreen),color:strandColor})),canonicalRoots:part.roots,anchor:toScreen(part.roots[0])};
   (part.kind==='head-hair'?hair:facial).push(command);if(part.portrait)portrait.push(command);
  }
  return {hair,facial,portrait};
 }
 const api={project};if(typeof module!=='undefined')module.exports=api;root.GroomingProjection=api;
})(globalThis);
