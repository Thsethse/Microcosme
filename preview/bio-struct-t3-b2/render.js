/* T2 scanline primitive method, extended for segment-oriented polygon hulls and debug. */
(function(root){
 'use strict';
 function render(canvas,scene,options={}){
  canvas.width=scene.width;canvas.height=scene.height;let c=canvas.getContext('2d');c.imageSmoothingEnabled=false;
  let protectedBase;if(options.protectBase!==false&&(scene.groomingFacial?.length||scene.commands.some(c=>c.role==='head-hair'))&&scene.protectedFeatures?.length){protectedBase=document.createElement('canvas');render(protectedBase,{...scene,commands:scene.commands.filter(c=>c.role!=='head-hair'),groomingFacial:[]},{...options,protectBase:false,transparent:true,skeleton:false,joints:false,anchors:false,faceGuides:false});}
  const rect=(x,y,w,h)=>{if(w>0&&h>0)c.fillRect(Math.round(x),Math.round(y),Math.max(1,Math.round(w)),Math.max(1,Math.round(h)));};
  function primitive(cmd,dx=0,dy=0){
   if(cmd.kind==='polyline'){
    for(let i=1;i<cmd.points.length;i++){const a=cmd.points[i-1],b=cmd.points[i],steps=Math.max(1,Math.ceil(Math.max(Math.abs(b[0]-a[0]),Math.abs(b[1]-a[1]))));for(let j=0;j<=steps;j++)rect(a[0]+(b[0]-a[0])*j/steps+dx,a[1]+(b[1]-a[1])*j/steps+dy,1,1);}return;
   }
   if(cmd.kind==='rectangle'){rect(cmd.x+dx,cmd.y+dy,cmd.w,cmd.h);return;}
   if(cmd.kind==='oval'||cmd.kind==='triangle'){
    for(let j=0;j<Math.ceil(cmd.h);j++){const t=(j+.5)/cmd.h,half=cmd.kind==='oval'?cmd.w/2*Math.sqrt(Math.max(0,1-(2*t-1)**2)):cmd.w/2*(1-t);rect(cmd.x+cmd.w/2-half+dx,cmd.y+j+dy,half*2,1);}return;
   }
   const pts=cmd.points,min=Math.floor(Math.min(...pts.map(p=>p[1]))),max=Math.ceil(Math.max(...pts.map(p=>p[1])));
   for(let y=min;y<max;y++){const yy=y+.5,xs=[];for(let i=0;i<pts.length;i++){const a=pts[i],b=pts[(i+1)%pts.length];if((a[1]<=yy&&b[1]>yy)||(b[1]<=yy&&a[1]>yy))xs.push(a[0]+(b[0]-a[0])*(yy-a[1])/(b[1]-a[1]));}xs.sort((a,b)=>a-b);for(let i=0;i+1<xs.length;i+=2)rect(xs[i]+dx,y+dy,xs[i+1]-xs[i],1);}
  }
  if(options.volumes!==false){
   let surface;
   for(const cmd of scene.commands){if(cmd.visible===false)continue;const hair=cmd.role==='head-hair';if(options.volumeEdges&&!hair){c.fillStyle=cmd.outline;for(const [dx,dy]of [[-1,0],[1,0],[0,-1],[0,1]])primitive(cmd,dx,dy);}
    if(hair||cmd.clipSurface&&cmd.surfaceMarks?.length){
     if(!surface){surface=document.createElement('canvas');surface.width=canvas.width;surface.height=canvas.height;}
     const target=c;c=surface.getContext('2d');c.clearRect(0,0,surface.width,surface.height);c.fillStyle=cmd.color;primitive(cmd);c.globalCompositeOperation='source-atop';
     for(const mark of cmd.surfaceMarks){c.fillStyle=mark.color;primitive(mark);}c.globalCompositeOperation='source-over';if(hair)for(const b of scene.protectedFeatures||[])c.clearRect(b.x,b.y,b.w,b.h);c=target;c.drawImage(surface,0,0);
    }else{c.fillStyle=cmd.color;primitive(cmd);for(const mark of cmd.surfaceMarks||[]){c.fillStyle=mark.color;primitive(mark);}}
   }
   if(scene.groomingFacial?.length){
    const layer=document.createElement('canvas');layer.width=canvas.width;layer.height=canvas.height;const target=c;c=layer.getContext('2d');
    for(const cmd of scene.groomingFacial){c.fillStyle=cmd.color;primitive(cmd);}for(const b of scene.protectedFeatures||[])c.clearRect(b.x,b.y,b.w,b.h);c=target;c.drawImage(layer,0,0);
   }
   if(options.face!==false){
    if(scene.facialGroups){
     const feature=document.createElement('canvas'),eyeRasters=new Map();feature.width=canvas.width;feature.height=canvas.height;
     for(const group of scene.facialGroups){const target=c;c=feature.getContext('2d');c.clearRect(0,0,feature.width,feature.height);
      for(let i=0;i<group.commands.length;i++){if(group.maskCount&&i===group.maskCount)c.globalCompositeOperation='source-atop';let cmd=group.commands[i];
       if(group.role==='lash'&&eyeRasters.has(group.eyeId)){const eye=eyeRasters.get(group.eyeId),col=Math.max(0,Math.min(eye.bounds.w-1,Math.round(group.u*(eye.bounds.w-1))));let index=col;if(eye.tops[index]===null)index=eye.tops.findIndex(y=>y!==null);if(index<0)continue;const [a,b]=cmd.points,x=eye.bounds.x+index,y=eye.tops[index];cmd={...cmd,points:[[x,y],[x+b[0]-a[0],y+b[1]-a[1]]]};}
       c.fillStyle=cmd.color;primitive(cmd);
      }
      c.globalCompositeOperation='source-over';
      if(group.role==='eye'){const b=group.bounds,own=c.getImageData(b.x,b.y,b.w,b.h).data,head=target.getImageData(b.x,b.y,b.w,b.h).data,tops=[];for(let x=0;x<b.w;x++){let first=null;for(let y=0;y<b.h;y++)if(own[(y*b.w+x)*4+3]&&head[(y*b.w+x)*4+3]){first=b.y+y;break;}tops.push(first);}eyeRasters.set(group.id,{bounds:b,tops});}
      c=target;c.globalCompositeOperation='source-atop';c.drawImage(feature,0,0);c.globalCompositeOperation='source-over';
     }
    }else{c.globalCompositeOperation='source-atop';for(const cmd of scene.facialCommands){c.fillStyle=cmd.color;primitive(cmd);}c.globalCompositeOperation='source-over';}
   }
   // One outline for the union, never a compulsory border around every muscle.
   if(!options.volumeEdges){const data=c.getImageData(0,0,canvas.width,canvas.height),src=data.data,out=new Uint8ClampedArray(src),w=canvas.width,h=canvas.height,rgb=[1,3,5].map(i=>parseInt(scene.outline.slice(i,i+2),16));
    for(let y=1;y<h-1;y++)for(let x=1;x<w-1;x++){const i=y*w+x;if(src[i*4+3]===0&&[i-1,i+1,i-w,i+w].some(j=>src[j*4+3]>0)){out.set([...rgb,255],i*4);}}
    data.data.set(out);c.putImageData(data,0,0);
   }
  }
  if(protectedBase){const base=protectedBase.getContext('2d');for(const b of scene.protectedFeatures)c.putImageData(base.getImageData(b.x,b.y,b.w,b.h),b.x,b.y);}
  function line(a,b,color,width=1){c.strokeStyle=color;c.lineWidth=width;c.beginPath();c.moveTo(...a);c.lineTo(...b);c.stroke();}
  if(options.faceGuides)for(const g of scene.faceGuides||[])line(g.from,g.to,'#70dadd',1);
  if(options.skeleton)for(const seg of scene.debug.segments)line(seg.from,seg.to,'#70dadd',1.6);
  if(options.joints)for(const j of scene.debug.joints){c.fillStyle='#ff9873';rect(j.point[0]-2,j.point[1]-2,4,4);}
  if(options.anchors)for(const a of scene.debug.anchors){line([a.point[0]-2,a.point[1]],[a.point[0]+2,a.point[1]],'#c6e57f');line([a.point[0],a.point[1]-2],[a.point[0],a.point[1]+2],'#c6e57f');}
  c.globalCompositeOperation='destination-over';
  if(!options.transparent){c.fillStyle='#4b3d51';c.fillRect(0,345,canvas.width,15);c.fillStyle='#292231';c.fillRect(0,0,canvas.width,canvas.height);}
  c.globalCompositeOperation='source-over';return canvas;
 }
 const api={render};if(typeof module!=='undefined')module.exports=api;root.T3Render=api;
})(globalThis);
