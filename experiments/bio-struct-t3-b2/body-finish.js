/* R3 volumes and surface attachments. Never changes the R2 skeleton or genital volume. */
(function(root){
 'use strict';
 const S=typeof module!=='undefined'?require('./anatomical-skeleton.js'):root.AnatomicalSkeleton;
 const P=typeof module!=='undefined'?require('./biological-profile.js'):root.BiologicalProfile;
 function local(v,a){return S.add(v.center,S.add(S.mul(v.basis.u,a[0]),S.add(S.mul(v.basis.v,a[1]),S.mul(v.basis.w,a[2]))));}
 function relative(v,sk){const s=sk.segments[v.anchor.segment];v.relativeDimensions={widthRatio:v.dimensions.width/s.width,heightRatio:v.dimensions.height/s.length,depthRatio:v.dimensions.depth/s.depth};}
 function surface(v,sk,definition=0,drop=0){
  const {width:w,height:h,depth:d}=v.dimensions,points=[],power=2/(2+definition*6),signed=(n,p)=>Math.sign(n)*Math.abs(n)**p;
  for(let i=0;i<=12;i++){
   const latitude=-Math.PI/2+Math.PI*i/12,y=signed(Math.sin(latitude),power),radius=Math.abs(Math.cos(latitude))**power,taper=1-drop*.25*y;
   for(let j=0;j<16;j++){const a=2*Math.PI*j/16;points.push([w*.5*radius*signed(Math.cos(a),power)*taper,h*.5*y,d*.5*radius*signed(Math.sin(a),power)]);}
  }
  // Restore the declared support dimensions after tapering; all derived vertices stay local.
  const extents=[0,1,2].map(k=>Math.max(...points.map(a=>Math.abs(a[k]))));
  v.localVertices=points.map(a=>a.map((n,k)=>n/extents[k]*[w,h,d][k]/2));v.vertices=v.localVertices.map(a=>local(v,a));v.shape='mesh';delete v.meshType;v.surfaceDefinition=definition;v.surfaceDrop=drop;relative(v,sk);return v;
 }
 function add(body,id,segment,dimensions,t,offset,kind='muscle'){
  const sk=body.skeleton,s=sk.segments[segment],anchor={segment,t,offsetLocal:offset};
  const v={id,region:s.region,anchor,shape:'oval',dimensions,orientation:s.orientation,basis:s.basis,center:S.point(sk,anchor),symmetry:id.includes('left')||id.includes('right')?'paired':null,kind};relative(v,sk);body.volumes.push(v);return v;
 }
 function apply(body,a){
  body.version=3;body.appearance=a;const sk=body.skeleton,p=body.parameters,scale=p.globalSize;
  const originalBreasts=body.volumes.filter(v=>v.kind==='breast');
  if(body.biologicalProfile.category==='M')body.volumes=body.volumes.filter(v=>v.kind!=='breast');
  else for(const v of originalBreasts){
   if(a.breastShape==='natural')continue;
   const s=sk.segments.thorax,oldHeight=v.dimensions.height;
   v.dimensions.height=Math.min(oldHeight*(a.breastShape==='round'?.85:1.05),2*Math.min(v.center[1]-s.origin[1],s.end[1]-v.center[1])-s.length*.002);
   const factor=Math.sqrt(oldHeight/v.dimensions.height);v.dimensions.width*=factor;v.dimensions.depth*=factor;
   surface(v,sk,0,a.breastShape==='drop'?1:0);
  }
  const thorax=sk.segments.thorax,skinThorax=body.volumes.find(v=>v.id==='thorax');
  const available=Math.min(...skinThorax.localVertices.map(v=>Math.abs(v[0])))*2;
  for(const name of ['left','right']){
   const side=name==='left'?-1:1;let v=body.volumes.find(v=>v.id==='pectoralis_'+name);
   if(!v)v=add(body,'pectoralis_'+name,'thorax',{width:available*.47,height:thorax.length*.88,depth:thorax.depth*.18},.5,[side*available*.235,0,thorax.depth*.53]);
   v.dimensions.depth*=.85+.30*a.pectoralDefinition+.40*a.fatVolume*(1-a.pectoralDefinition);
   v.anchor.t=.5-.025*a.fatVolume*(1-a.pectoralDefinition);v.center=S.point(sk,v.anchor);
   surface(v,sk,a.pectoralDefinition);
  }
  const abdomen=sk.segments.abdomen,skinAbdomen=body.volumes.find(v=>v.id==='abdomen'),width=Math.min(...skinAbdomen.localVertices.map(v=>Math.abs(v[0])))*2;
  const roundness=.30*a.fatVolume+.20*(1-a.abdominalDefinition);
  const belly=add(body,'abdominal_surface','abdomen',{width:width*.96,height:abdomen.length*.98,depth:abdomen.depth*(.10+roundness)},.5,[0,0,abdomen.depth*.46],'soft-tissue');
  surface(belly,sk,0);
  if(a.abdominalDefinition>0)for(const name of ['left','right'])for(let row=0;row<3;row++){
   const side=name==='left'?-1:1,t=.19+row*.29;
   const v=add(body,'abdominal_'+name+'_'+row,'abdomen',{width:width*.35,height:abdomen.length*.245,depth:abdomen.depth*(.05+.16*a.abdominalDefinition)},t,[side*width*.205,0,abdomen.depth*.5+belly.dimensions.depth*.22]);
   surface(v,sk,a.abdominalDefinition*.65);
  }
  const details=[],point=(id,owner,offsetLocal,kind,color,size)=>details.push({id,owner:owner.id,offsetLocal,position:local(owner,offsetLocal),normal:[0,0,1],kind,color,size});
  const navelY=S.point(sk,sk.anchors.navel)[1],navelOffset=navelY-belly.center[1],ny=navelOffset/(belly.dimensions.height/2),nz=belly.dimensions.depth/2*Math.sqrt(Math.max(0,1-ny*ny));
  point('navel',belly,[0,navelOffset,nz],'navel',null,.60*scale);
  function hairs(owner,density,width,height,yOffset,zOffset,shape,salt){
   const cols=12,rows=10;
   for(let row=0;row<rows;row++)for(let col=0;col<cols;col++){
    const key=salt+row*cols+col;if(P.hash(body.seed,key)>=density)continue;
    const x=((col+.2+.6*P.hash(body.seed,key+8000))/cols-.5)*width,y=((row+.2+.6*P.hash(body.seed,key+12000))/rows-.5)*height+yOffset;
    if(shape==='triangle'&&Math.abs(x)>width/2*((y-yOffset)/height+.5))continue;
    if(shape==='ellipse'&&(x/(width/2))**2+((y-yOffset)/(height/2))**2>.85)continue;
    let z=zOffset;
    if(owner.surfaceDefinition!==undefined){const n=2+6*owner.surfaceDefinition;z=owner.dimensions.depth/2*Math.max(0,1-Math.abs(x/(owner.dimensions.width/2))**n-Math.abs(y/(owner.dimensions.height/2))**n)**(1/n);}
    point('hair-'+salt+'-'+row+'-'+col,owner,[x,y,z],'hair',a.hairColor,scale*(.35+.25*P.hash(body.seed,key+16000)));
   }
  }
  if(a.chestHairDensity)for(const name of ['left','right']){
   const v=body.volumes.find(v=>v.id==='pectoralis_'+name);hairs(v,a.chestHairDensity,v.dimensions.width*.84,v.dimensions.height*.78,0,v.dimensions.depth*.35,'ellipse',name==='left'?20000:30000);
  }
  if(a.bellyHairDensity)hairs(belly,a.bellyHairDensity,belly.dimensions.width*.60,belly.dimensions.height*.80,0,belly.dimensions.depth*.40,'ellipse',40000);
  if(a.pubicHairShape!=='none'&&a.pubicHairDensity){
   const pelvis=body.volumes.find(v=>v.id==='pelvis'),s=sk.segments.pelvis;
   // Same area for both reproductive functions, entirely above the R2 male attachment base.
   const floor=s.origin[1]+s.length*(.12+.86/2)+.4*scale,ceiling=s.end[1]-.3*scale,h=ceiling-floor,w=a.pubicHairShape==='square'?h:Math.min(s.width*.38,h*2.6);
   hairs(pelvis,a.pubicHairDensity,w,h,(floor+ceiling)/2-pelvis.center[1],s.depth*.5,a.pubicHairShape,50000);
  }
  body.finish={details,navel:details.find(v=>v.id==='navel').position};return body;
 }
 const api={apply,local};if(typeof module!=='undefined')module.exports=api;root.BodyFinish=api;
})(globalThis);
