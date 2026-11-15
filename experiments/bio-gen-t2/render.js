/* Integer scanline rasterizer. No Canvas paths, image assets or smoothing needed. */
(function(root){
 'use strict';
 function render(canvas,scene,options={}){
  canvas.width=scene.width;canvas.height=scene.height;const c=canvas.getContext('2d');c.imageSmoothingEnabled=false;
  function span(x,y,w,h){if(w<=0||h<=0)return;c.fillRect(Math.round(x),Math.round(y),Math.max(1,Math.round(w)),Math.max(1,Math.round(h)));}
  for(const cmd of scene.commands){
   if(options.anatomyOnly&&(/hair|fur|eye|iris|brow|lash|mouth|muscle|chest|anatomy-mark/.test(cmd.tag)))continue;
   c.globalCompositeOperation=cmd.clip?'source-atop':'source-over';c.fillStyle=cmd.color;
   const {x,y,w,h,kind}=cmd;
   if(kind==='rectangle'||kind==='square'){span(x,y,w,h);continue;}
   for(let j=0;j<Math.ceil(h);j++){
    const t=(j+.5)/h;let half;
    if(kind==='circle'||kind==='oval')half=w/2*Math.sqrt(Math.max(0,1-Math.pow(2*t-1,2)));
    else if(kind==='triangle')half=w/2*t;
    else if(kind==='triangleDown')half=w/2*(1-t);
    else if(kind==='composite')half=w/2*(.58+.42*Math.abs(2*t-1));
    else throw Error('Forme inconnue : '+kind);
    span(x+w/2-half,y+j,2*half,1);
   }
  }
  c.globalCompositeOperation='destination-over';
  if(!options.transparent){c.fillStyle='#3c2c47';c.fillRect(0,136,canvas.width,8);c.fillStyle=scene.body.palette.background;c.fillRect(0,0,canvas.width,canvas.height);}
  c.globalCompositeOperation='source-over';return canvas;
 }
 const api={render};if(typeof module!=='undefined')module.exports=api;root.T2Render=api;
})(globalThis);
