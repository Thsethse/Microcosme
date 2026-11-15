/* Anatomical volumes have only local segment anchors; all positions are derived. */
(function(root){
 'use strict';
 const S=typeof module!=='undefined'?require('./anatomical-skeleton.js'):root.AnatomicalSkeleton;
 function build(skeleton,p,profile){
  const volumes=[];
  function add(id,segment,shape,ratios,t=.5,offset=[0,0,0],kind='skin',symmetry=null){
   const s=skeleton.segments[segment],anchor={segment,t,offsetLocal:offset};
   const dimensions={width:s.width*ratios[0],height:s.length*ratios[1],depth:s.depth*ratios[2]};
   const v={id,region:s.region,anchor,shape,relativeDimensions:{widthRatio:ratios[0],heightRatio:ratios[1],depthRatio:ratios[2]},dimensions,
    orientation:s.orientation,basis:s.basis,center:S.point(skeleton,anchor),symmetry,kind};volumes.push(v);return v;
  }
  add('head','head','oval',[1,1,1]);add('neck','neck','box',[1,1.04,1]);
  add('thorax','thorax','box',[1,1.06,1]);add('abdomen','abdomen','box',[1,1.04,1]);add('pelvis','pelvis','pelvis',[1,1.06,1]);
  for(const name of ['left','right']){
   const side=name==='left'?-1:1,thorax=skeleton.segments.thorax,neck=skeleton.segments.neck;
   add('clavicle_'+name,'clavicle_'+name,'box',[1,1.05,1]);
   add('trapezius_'+name,'neck','triangle',[2.1,.7,1],.35,[side*neck.width*.65,0,0],'muscle','paired');
   for(const part of ['upper_arm','forearm','hand','thigh','calf'])add(part+'_'+name,part+'_'+name,'box',[1,1.04,1]);
   const foot=skeleton.segments['foot_'+name];
   // Local foot center at Y=2.5, Z=2; all ratios computed from the ankle/toe chain.
   const target=[foot.origin[0],2.5*p.globalSize,2*p.globalSize],mid=S.lerp(foot.origin,foot.end,.5);
   add('foot_'+name,'foot_'+name,'box',[1,5*p.globalSize/foot.length,1],.5,S.sub(target,mid));
   if(p.muscleVolume>0){
    add('pectoralis_'+name,'thorax','box',[.43,.65,.14],.6,[side*thorax.width*.23,0,thorax.depth*.49],'muscle','paired');
    for(const [part,label]of [['upper_arm','biceps'],['forearm','forearm_volume'],['thigh','thigh_volume'],['calf','calf_volume']]){
     const seg=skeleton.segments[part+'_'+name];add(label+'_'+name,part+'_'+name,'box',[.72,.70,.16],.5,[0,0,seg.depth*.47],'muscle','paired');
    }
   }
   if(p.breastVolume>0){
    const r=[.03+.38*p.breastVolume,.03+.90*p.breastVolume,.02+.65*p.breastVolume],deep=thorax.depth*r[2];
    add('breast_'+name,'thorax','oval',r,.5,[side*thorax.width*.25,0,thorax.depth*.5+deep*.45],'breast','paired');
   }
   const pelvis=skeleton.segments.pelvis;
   add('gluteal_'+name,'pelvis','oval',[.46,.72,.35],.43,[side*pelvis.width*.24,0,-pelvis.depth*.52],'muscle','paired');
  }
  const pelvis=skeleton.segments.pelvis;
  add('sexual_marker','pelvis',profile.reproductiveFunction==='male'?'box':'triangle',
   profile.reproductiveFunction==='male'?[.10,.48,.23]:[.16,.35,.12],.35,skeleton.anchors.genital_anchor.offsetLocal.slice(),'anatomical-marker');
  return volumes;
 }
 const api={build};if(typeof module!=='undefined')module.exports=api;root.BodyGeometry=api;
})(globalThis);
