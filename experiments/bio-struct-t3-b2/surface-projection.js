/* Body surface marks project from attached local coordinates, then clip to their owner. */
(function(root){
 'use strict';
 const F=typeof module!=='undefined'?require('./body-finish.js'):root.BodyFinish;
 const mix=(skin,t)=>'#'+[1,3,5].map((i,k)=>Math.round(parseInt(skin.slice(i,i+2),16)*(1-t)+[76,48,39][k]*t).toString(16).padStart(2,'0')).join('');
 function decorate(body,commands,view,toScreen,scale){
  if(body.version<3)return;
  const a=body.appearance,dark=parseInt(body.palette.skin.slice(1,3),16)<150;
  const intensity=(.05+.17*a.shadowStrength)*(dark?1.6:1),shade=mix(body.palette.skin,intensity);
  const byId=new Map(body.volumes.map(v=>[v.id,v]));
  for(const cmd of commands){
   const v=byId.get(cmd.id);cmd.clipSurface=true;
   if(cmd.visible===false)continue;
   const anterior=v.kind==='breast'||v.id.startsWith('pectoralis_')||v.id.startsWith('abdominal_');
   if(view==='back'&&anterior){cmd.visible=false;cmd.surfaceMarks=[];continue;}
   if(v.id.startsWith('pectoralis_')||v.id.startsWith('abdominal_'))cmd.color=body.palette.skin;
   if(!a.shadowStrength||v.region==='head'||v.region==='neck'||v.kind==='anatomical-marker')continue;
   const {width:w,height:h,depth:d}=v.dimensions;
   const coordinate=(x,y,z)=>toScreen(F.local(v,[x,y,z]));
   // A narrow band just inside the lower support, sized from this canonical volume.
   const horizontal=view==='profile'?d:w,normal=view==='back'?-1:1;
   const xy=(x,y)=>view==='profile'?coordinate(w*.25,y,x):coordinate(x,y,normal*d*.45);
   const fraction=v.id.startsWith('abdominal_')&&v.id!=='abdominal_surface'?.07+.12*a.abdominalDefinition:.08;
   const points=[xy(-horizontal*.40,-h*.31),xy(-horizontal*.22,-h*.45),xy(horizontal*.22,-h*.45),xy(horizontal*.42,-h*.30),xy(horizontal*.28,-h*(.45-fraction)),xy(-horizontal*.22,-h*(.45-fraction))];
   const definition=v.id.startsWith('abdominal_')&&v.id!=='abdominal_surface'?.35+.65*a.abdominalDefinition:v.id.startsWith('pectoralis_')?.55+.45*a.pectoralDefinition:1;
   cmd.surfaceMarks.push({id:v.id+'-brown-relief',kind:'polygon',points,color:definition===1?shade:mix(body.palette.skin,intensity*definition),role:'shadow'});
   if(v.kind==='breast'&&a.breastShape!=='natural'){
    // Replace R2's ellipse-only contour with a mark clipped to the actual new surface.
    cmd.surfaceMarks=cmd.surfaceMarks.filter(m=>!m.id.includes('-lower-contour'));
   }
  }
  const surfaceDetails=body.finish.details.filter(d=>d.kind!=='navel').concat(body.finish.details.filter(d=>d.kind==='navel'));
  for(const detail of surfaceDetails){
   // Anterior hair and navel are tangent to the profile, so remain invisible edge-on and from behind.
   if(view!=='front')continue;
   const cmd=commands.find(c=>c.id===detail.owner);if(!cmd||cmd.visible===false)continue;
   const p=toScreen(detail.position),size=Math.max(1,detail.kind==='navel'?Math.round(detail.size*scale):detail.size*scale);
   cmd.surfaceMarks.push({id:detail.id,kind:detail.kind==='navel'?'oval':'rectangle',x:p[0]-size/2,y:p[1]-size/2,w:size,h:size,color:detail.color||mix(body.palette.skin,.28),role:detail.kind,canonicalPosition:detail.position});
  }
 }
 const api={decorate,mix};if(typeof module!=='undefined')module.exports=api;root.SurfaceProjection=api;
})(globalThis);
