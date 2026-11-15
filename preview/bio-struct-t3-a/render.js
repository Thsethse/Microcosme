/* T2 scanline primitive method, extended for segment-oriented polygon hulls and debug. */
(function(root){
 'use strict';
 function render(canvas,scene,options={}){
  canvas.width=scene.width;canvas.height=scene.height;const c=canvas.getContext('2d');c.imageSmoothingEnabled=false;
  const rect=(x,y,w,h)=>{if(w>0&&h>0)c.fillRect(Math.round(x),Math.round(y),Math.max(1,Math.round(w)),Math.max(1,Math.round(h)));};
  function primitive(cmd,dx=0,dy=0){
   if(cmd.kind==='oval'||cmd.kind==='triangle'){
    for(let j=0;j<Math.ceil(cmd.h);j++){const t=(j+.5)/cmd.h,half=cmd.kind==='oval'?cmd.w/2*Math.sqrt(Math.max(0,1-(2*t-1)**2)):cmd.w/2*(1-t);rect(cmd.x+cmd.w/2-half+dx,cmd.y+j+dy,half*2,1);}return;
   }
   const pts=cmd.points,min=Math.floor(Math.min(...pts.map(p=>p[1]))),max=Math.ceil(Math.max(...pts.map(p=>p[1])));
   for(let y=min;y<max;y++){const yy=y+.5,xs=[];for(let i=0;i<pts.length;i++){const a=pts[i],b=pts[(i+1)%pts.length];if((a[1]<=yy&&b[1]>yy)||(b[1]<=yy&&a[1]>yy))xs.push(a[0]+(b[0]-a[0])*(yy-a[1])/(b[1]-a[1]));}xs.sort((a,b)=>a-b);for(let i=0;i+1<xs.length;i+=2)rect(xs[i]+dx,y+dy,xs[i+1]-xs[i],1);}
  }
  if(options.volumes!==false)for(const cmd of scene.commands){c.fillStyle=cmd.outline;for(const [dx,dy]of [[-1,0],[1,0],[0,-1],[0,1]])primitive(cmd,dx,dy);c.fillStyle=cmd.color;primitive(cmd);}
  function line(a,b,color,width=1){c.strokeStyle=color;c.lineWidth=width;c.beginPath();c.moveTo(...a);c.lineTo(...b);c.stroke();}
  if(options.skeleton)for(const seg of scene.debug.segments)line(seg.from,seg.to,'#70dadd',1.6);
  if(options.joints)for(const j of scene.debug.joints){c.fillStyle='#ff9873';rect(j.point[0]-2,j.point[1]-2,4,4);}
  if(options.anchors)for(const a of scene.debug.anchors){line([a.point[0]-2,a.point[1]],[a.point[0]+2,a.point[1]],'#c6e57f');line([a.point[0],a.point[1]-2],[a.point[0],a.point[1]+2],'#c6e57f');}
  c.globalCompositeOperation='destination-over';
  if(!options.transparent){c.fillStyle='#4b3d51';c.fillRect(0,345,canvas.width,15);c.fillStyle='#292231';c.fillRect(0,0,canvas.width,canvas.height);}
  c.globalCompositeOperation='source-over';return canvas;
 }
 const api={render};if(typeof module!=='undefined')module.exports=api;root.T3Render=api;
})(globalThis);
