/* X lateral, Y up, Z anterior. All joints/segments share a connected root graph. */
(function(root){
 'use strict';
 const add=(a,b)=>a.map((v,i)=>v+b[i]),sub=(a,b)=>a.map((v,i)=>v-b[i]),mul=(a,s)=>a.map(v=>v*s),lerp=(a,b,t)=>add(mul(a,1-t),mul(b,t));
 const norm=a=>Math.hypot(...a);
 function build(p,trunkWidth){
  const s=p.globalSize,hip=5+40*p.legLength,base=hip+30*p.trunkLength,top=base+25*p.headHeight;
  const y=f=>hip+30*p.trunkLength*f,sw=32*p.shoulderWidth,pw=26*p.pelvisWidth,depth=13*p.thoraxDepth;
  const joints={},segments={};
  function joint(id,x,Y,z=0){joints[id]={id,position:[x*s,Y*s,z*s]};return id;}
  function segment(id,from,to,width,deep,parent=null,region=id){
   const a=joints[from].position,b=joints[to].position,delta=sub(b,a),length=norm(delta);
   const v=mul(delta,1/length),u=[v[1],-v[0],0];
   segments[id]={id,from,to,origin:a,end:b,length,width:width*s,depth:deep*s,orientation:v,basis:{u,v,w:[0,0,1]},parent,region};
  }
  joint('pelvis_root',0,hip);joint('pelvis_bottom',0,hip-8);joint('thorax_bottom',0,y(.4));joint('shoulder_center',0,y(.9));
  joint('skull_base',0,base);joint('head_top',0,top);

  segment('abdomen','pelvis_root','thorax_bottom',24*trunkWidth,depth*.85,null,'abdomen');
  segment('thorax','thorax_bottom','shoulder_center',sw*.86,depth,'abdomen','thorax');
  segment('neck','shoulder_center','skull_base',7,7,'thorax','neck');
  segment('head','skull_base','head_top',25*p.headWidth,17,'neck','head');
  segment('pelvis','pelvis_bottom','pelvis_root',pw,depth*.90,'abdomen','pelvis');
  for(const side of [-1,1]){const name=side<0?'left':'right',x=sw*.5*side,hx=pw*.36*side;
   joint('shoulder_'+name,x,y(.88));joint('elbow_'+name,x+side*2*p.armLength,y(.88)-15*p.armLength);joint('wrist_'+name,x+side*2.5*p.armLength,y(.88)-29*p.armLength);
   joint('hand_'+name,x+side*2.5*p.armLength,y(.88)-35*p.armLength);
   joint('hip_'+name,hx,hip);joint('knee_'+name,hx*.95,5+21*p.legLength);joint('ankle_'+name,hx*1.02,5);joint('toe_'+name,hx*1.02,1,6);
   segment('clavicle_'+name,'shoulder_center','shoulder_'+name,3,5,'thorax','clavicle');
   segment('upper_arm_'+name,'shoulder_'+name,'elbow_'+name,4.5+2*p.muscleVolume,6,'clavicle_'+name,'upper_arm');
   segment('forearm_'+name,'elbow_'+name,'wrist_'+name,4+1.3*p.muscleVolume,5,'upper_arm_'+name,'forearm');
   segment('hand_'+name,'wrist_'+name,'hand_'+name,5,3,'forearm_'+name,'hand');
   segment('hip_link_'+name,'pelvis_root','hip_'+name,4,5,'pelvis','hip');
   segment('thigh_'+name,'hip_'+name,'knee_'+name,6+3*p.muscleVolume,8,'hip_link_'+name,'thigh');
   segment('calf_'+name,'knee_'+name,'ankle_'+name,4.5+2*p.muscleVolume,6,'thigh_'+name,'calf');
   // Foot has an anterior axis; its box uses a world-aligned local basis.
   segment('foot_'+name,'ankle_'+name,'toe_'+name,7,10,'calf_'+name,'foot');
   segments['foot_'+name].basis={u:[1,0,0],v:[0,1,0],w:[0,0,1]};
  }
  const anchors={sternum:{segment:'thorax',t:.5,offsetLocal:[0,0,0]},neck:{segment:'neck',t:.5,offsetLocal:[0,0,0]},chin:{segment:'head',t:0,offsetLocal:[0,0,0]},facial_axis:{segment:'head',t:.5,offsetLocal:[0,0,8*s]},navel:{segment:'abdomen',t:8/12,offsetLocal:[0,0,depth*.5*s]},pelvic_center:{segment:'pelvis',t:.5,offsetLocal:[0,0,0]},genital_anchor:{segment:'pelvis',t:.35,offsetLocal:[0,0,depth*.5*s]}};
  // R2: move only the genital attachment towards the inferior pelvic edge.
  // Joints, segments, proportions and every other R1 attachment stay unchanged.
  anchors.genital_anchor.t=.12;
  anchors.genital_anchor.offsetLocal[2]=segments.pelvis.depth*.5;
  return {joints,segments,anchors,root:'pelvis_root',height:top*s,zConvention:'positive-anterior',zones:{head:25*p.headHeight*s,trunk:30*p.trunkLength*s,lower:hip*s}};
 }
 function point(skeleton,anchor){
  const s=skeleton.segments[anchor.segment];if(!s||!Number.isFinite(anchor.t)||anchor.t<0||anchor.t>1)throw Error('Ancrage ou segment invalide.');
  const o=anchor.offsetLocal||[0,0,0];if(!Array.isArray(o)||o.length!==3||!o.every(Number.isFinite))throw Error('Décalage local fini requis.');return add(lerp(s.origin,s.end,anchor.t),add(mul(s.basis.u,o[0]),add(mul(s.basis.v,o[1]),mul(s.basis.w,o[2]))));
 }
 const api={build,point,add,sub,mul,lerp,norm};if(typeof module!=='undefined')module.exports=api;root.AnatomicalSkeleton=api;
})(globalThis);
