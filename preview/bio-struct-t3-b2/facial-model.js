/* All B1 landmarks and feature support dimensions live in canonical head space. */
(function(root){
 'use strict';
 const S=typeof module!=='undefined'?require('./anatomical-skeleton.js'):root.AnatomicalSkeleton;
 const H=typeof module!=='undefined'?require('./shape-grammar.js'):root.ShapeGrammar;
 function upper(shape,u){if(shape==='rectangle'||shape==='invertedTriangle')return 0;if(shape==='triangle')return Math.abs(2*u-1);if(shape==='almond')return .5*(1-Math.sin(Math.PI*u));return .5-.5*Math.sqrt(Math.max(0,1-(2*u-1)**2));}
 function attach(sk,choices,settings){
  const head=sk.segments.head,w=head.width*H.headWidthRatio(choices.headShape),h=head.length,d=head.depth,r=['square','rectangle'].includes(choices.headShape)?Math.min(w,h,d)*.18:0;
  const middle=(head.origin[1]+head.end[1])/2,eyeWidth=w*.12*settings.eyeSize;
  const aspects={round:1,oval:.65,rectangle:.70,almond:.62,triangle:.90,invertedTriangle:.90},eyeHeight=eyeWidth*aspects[settings.eyeShape];
  const eyeTop=middle-h*.015,eyeBottom=eyeTop-eyeHeight,browHeight=h*.04,browBottom=eyeTop+h*.025,mouthY=(eyeBottom+head.origin[1])/2;
  function surfaceZ(x,y){
   const yy=y-(head.origin[1]+h/2);
   if(!r)return d/2*Math.sqrt(Math.max(0,1-(2*x/w)**2-(2*yy/h)**2));
   const dx=Math.max(0,Math.abs(x)-(w/2-r)),dy=Math.max(0,Math.abs(yy)-(h/2-r));return d/2-r+Math.sqrt(Math.max(0,r*r-dx*dx-dy*dy));
  }
  function anchor(id,x,y,z=surfaceZ(x,y)){const a={segment:'head',t:(y-head.origin[1])/h,offsetLocal:[x,0,z]};sk.anchors[id]=a;return S.point(sk,a);}
  // The median is a horizontal frame; never a central point that could suggest a nasal anchor.
  const anchors={};anchors.face_top=anchor('face_top',0,head.end[1],0);anchors.face_chin=anchor('face_chin',0,head.origin[1],0);delete sk.anchors.facial_axis;
  const features={eyes:[],brows:[],lashes:[]};
  for(const side of ['left','right']){
   const sign=side==='left'?-1:1,x=sign*eyeWidth,y=(eyeTop+eyeBottom)/2,depth=eyeWidth*.30;
   const position=anchor('eye_'+side,x,y,surfaceZ(x,y)-depth/2);anchors['eye_'+side]=position;
   anchors['eye_top_'+side]=anchor('eye_top_'+side,x,eyeTop);anchors['eye_bottom_'+side]=anchor('eye_bottom_'+side,x,eyeBottom);
   const by=browBottom+browHeight/2;anchors['brow_'+side]=anchor('brow_'+side,x,by,surfaceZ(x,by)-eyeWidth*.2);
   features.eyes.push({id:'eye_'+side,side,position,width:eyeWidth,height:eyeHeight,depth,top:eyeTop,bottom:eyeBottom,shape:settings.eyeShape});
   features.brows.push({id:'brow_'+side,side,position:anchors['brow_'+side],width:eyeWidth,height:browHeight,depth:eyeWidth*.4,shape:settings.browShape,bottom:browBottom});
   if(settings.lashes!=='none')for(const [index,u]of [.20,.50,.80].entries()){
    const dx=(u-.5)*eyeWidth,baseY=eyeTop-eyeHeight*upper(settings.eyeShape,u),z=position[2]+(u-.5)*depth,length=Math.min(eyeHeight*(settings.lashes==='long'?.55:.35),h*(settings.lashes==='long'?.055:.035)),out=(u-.5)*eyeWidth*.35;
    const id='lash_'+side+'_'+index,base=anchor(id,x+dx,baseY,z);anchors[id]=base;features.lashes.push({id,eyeId:'eye_'+side,u,position:base,tip:[base[0]+out,base[1]+length,base[2]+out*.30]});
   }
  }
  const mouthWidth=w*.25,mouthHeight=h*.12,mouthDepth=mouthWidth*.4;
  anchors.mouth=anchor('mouth',0,mouthY,surfaceZ(0,mouthY)-mouthDepth/2);
  features.mouth={id:'mouth',position:anchors.mouth,width:mouthWidth,height:mouthHeight,depth:mouthDepth,shape:settings.mouthShape};
  return {axis:{top:'face_top',bottom:'face_chin'},headShape:choices.headShape,width:w,height:h,eyeHeight,eyeWidth,medianY:middle,eyeTop,eyeBottom,interocularGap:eyeWidth,browHeight,anchors,features,roundingRadius:r};
 }
 function roundHead(body){
  const v=body.volumes.find(v=>v.id==='head');if(!['square','rectangle'].includes(body.geometryChoices.headShape))return;
  const {width:w,height:h,depth:d}=v.dimensions,r=Math.min(w,h,d)*.18,points=[];
  for(const sx of [-1,1])for(const sy of [-1,1])for(const sz of [-1,1])for(let i=0;i<=4;i++)for(let j=0;j<=4;j++){
   const t=i*Math.PI/8,a=j*Math.PI/8;points.push([sx*(w/2-r+r*Math.sin(t)*Math.cos(a)),sy*(h/2-r+r*Math.cos(t)),sz*(d/2-r+r*Math.sin(t)*Math.sin(a))]);
  }
  v.localVertices=points;v.vertices=points.map(p=>S.add(v.center,S.add(S.mul(v.basis.u,p[0]),S.add(S.mul(v.basis.v,p[1]),S.mul(v.basis.w,p[2])))));v.shape='mesh';v.roundingRadius=r;
 }
 const api={attach,roundHead,upper};if(typeof module!=='undefined')module.exports=api;root.FacialModel=api;
})(globalThis);
