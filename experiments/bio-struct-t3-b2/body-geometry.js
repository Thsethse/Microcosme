/* R1: regional surfaces and accents remain attached to canonical segments. */
(function(root){
 'use strict';
 const S=typeof module!=='undefined'?require('./anatomical-skeleton.js'):root.AnatomicalSkeleton;
 const H=typeof module!=='undefined'?require('./shape-grammar.js'):root.ShapeGrammar;
 function build(skeleton,p,profile,choices=H.validate()){
  const volumes=[];
  function add(id,segment,shape,ratios,t=.5,offset=[0,0,0],kind='skin',symmetry=null){
   const s=skeleton.segments[segment],anchor={segment,t,offsetLocal:offset},dimensions={width:s.width*ratios[0],height:s.length*ratios[1],depth:s.depth*ratios[2]};
   const v={id,region:s.region,anchor,shape,relativeDimensions:{widthRatio:ratios[0],heightRatio:ratios[1],depthRatio:ratios[2]},dimensions,orientation:s.orientation,basis:s.basis,center:S.point(skeleton,anchor),symmetry,kind};volumes.push(v);return v;
  }
  function mesh(v,points){
   const seg=skeleton.segments[v.anchor.segment];v.localVertices=points;
   v.vertices=points.map(a=>S.add(v.center,S.add(S.mul(v.basis.u,a[0]),S.add(S.mul(v.basis.v,a[1]),S.mul(v.basis.w,a[2])))));
   const sizes=[0,1,2].map(i=>Math.max(...points.map(a=>a[i]))-Math.min(...points.map(a=>a[i])));
   v.dimensions={width:sizes[0],height:sizes[1],depth:sizes[2]};v.relativeDimensions={widthRatio:sizes[0]/seg.width,heightRatio:sizes[1]/seg.length,depthRatio:sizes[2]/seg.depth};v.shape='mesh';return v;
  }
  function prism(v,contour){v.meshType='prism';const deep=v.dimensions.depth/2;return mesh(v,contour.flatMap(([x,y])=>[[x,y,-deep],[x,y,deep]]));}
  const head=add('head','head',['round','oval'].includes(choices.headShape)?'oval':'box',[H.headWidthRatio(choices.headShape),1,1]);
  head.contour=choices.headShape;
  if(!['round','oval','square','rectangle'].includes(choices.headShape)){
   const w=head.dimensions.width/2,h=head.dimensions.height/2;
   prism(head,choices.headShape==='triangle'?[[0,h],[-w,-h],[w,-h]]:choices.headShape==='invertedTriangle'?[[-w,h],[w,h],[0,-h]]:[[0,h],[w,0],[0,-h],[-w,0]]);
  }
  add('neck','neck','oval',[1,1.15,1]);
  const abdomen=skeleton.segments.abdomen,thorax=skeleton.segments.thorax;
  const hip=abdomen.origin[1],top=thorax.end[1];
  function widthAt(y){const u=Math.max(0,Math.min(1,(y-hip)/(top-hip)));return (abdomen.width+(thorax.width-abdomen.width)*u)*H.torsoFactor(choices.torsoShape,u)*(1+.04*p.muscleVolume*u);}
  for(const id of ['thorax','abdomen']){
   const v=add(id,id,'box',[1,1.06,1]),half=v.dimensions.height/2,rows=[];
   for(let i=0;i<=12;i++){const y=-half+2*half*i/12;rows.push([widthAt(v.center[1]+y)/2,y]);}
   prism(v,rows.map(([w,y])=>[-w,y]).concat(rows.slice().reverse()));
   v.contour=choices.torsoShape;
  }
  const pelvic=add('pelvis','pelvis',choices.pelvisShape==='oval'?'oval':'box',[1,1.06,1]);pelvic.contour=choices.pelvisShape;
  if(choices.pelvisShape==='trapezoid'){const w=pelvic.dimensions.width/2,h=pelvic.dimensions.height/2;prism(pelvic,[[-w,h],[w,h],[w*.8,-h],[-w*.8,-h]]);}
  for(const name of ['left','right']){
   const side=name==='left'?-1:1,neck=skeleton.segments.neck;
   add('clavicle_'+name,'clavicle_'+name,'box',[.9,1.04,1]);
   const trap=add('trapezius_'+name,'neck','box',[1,1,1],.35,[0,0,0],'muscle','paired');
   const shoulder=skeleton.joints['shoulder_'+name].position;
   const outline=[[side*neck.width*.34,neck.end[1]-neck.length*.08],[shoulder[0],shoulder[1]+neck.width*.05],[0,neck.origin[1]-neck.length*.1]];
   prism(trap,outline.map(([x,y])=>[x-trap.center[0],y-trap.center[1]]));trap.supports=['skull_base','shoulder_'+name,'shoulder_center'];
   for(const part of ['upper_arm','forearm','hand','thigh','calf']){
    const m=part==='hand'?0:p.muscleVolume,v=add(part+'_'+name,part+'_'+name,'box',[1+.18*m,1.05,1+.10*m]);
    if(choices.limbShape==='rounded'&&part!=='hand'){
     const rows=[];for(let i=0;i<=10;i++){const u=i/10;rows.push([v.dimensions.width/2*(.76+.24*Math.sin(Math.PI*u)),v.dimensions.height*(u-.5)]);}
     prism(v,rows.map(([w,y])=>[-w,y]).concat(rows.slice().reverse()));
    }
   }
   const foot=skeleton.segments['foot_'+name],target=[foot.origin[0],2.5*p.globalSize,2*p.globalSize],mid=S.lerp(foot.origin,foot.end,.5);
   add('foot_'+name,'foot_'+name,'box',[1,5*p.globalSize/foot.length,1],.5,S.sub(target,mid));
   if(p.muscleVolume>0){
    const hRatio=.88,t=.50,available=Math.min(...[.06,.50,.94].map(f=>widthAt(thorax.origin[1]+f*thorax.length)));
    add('pectoralis_'+name,'thorax','box',[available/thorax.width*.47,hRatio,.18+.16*p.muscleVolume],t,[side*available*.235,0,thorax.depth*.53],'muscle','paired');
    for(const [part,label]of [['upper_arm','biceps'],['forearm','forearm_volume'],['thigh','thigh_volume'],['calf','calf_volume']]){
     const seg=skeleton.segments[part+'_'+name];add(label+'_'+name,part+'_'+name,'box',[.80,.82,.14],.5,[0,0,seg.depth*.50],'muscle','paired');
    }
   }
   if(p.breastVolume>0){
    const heightRatio=.03+.90*p.breastVolume,t=Math.max(.42,heightRatio/2+.01);
    const available=Math.min(...[t-heightRatio/2,t,t+heightRatio/2].map(f=>widthAt(thorax.origin[1]+f*thorax.length)));
    const widthRatio=available/thorax.width*(.03+.38*p.breastVolume),deepRatio=.02+.65*p.breastVolume,deep=thorax.depth*deepRatio;
    add('breast_'+name,'thorax','oval',[widthRatio,heightRatio,deepRatio],t,[side*available*.25,0,thorax.depth*.5+deep*.45],'breast','paired');
   }
   const pelvis=skeleton.segments.pelvis;add('gluteal_'+name,'pelvis','oval',[.46,.72,.35],.43,[side*pelvis.width*.24,0,-pelvis.depth*.52],'muscle','paired');
  }
  const pelvis=skeleton.segments.pelvis;
  const male=profile.reproductiveFunction==='male',attachment=skeleton.anchors.genital_anchor;
  const marker=add('sexual_marker','pelvis',male?'box':'triangle',male?[.14,.86,.30]:[.16,.50,.12],attachment.t,attachment.offsetLocal.slice(),'anatomical-marker');
  const thigh=volumes.find(v=>v.id==='thigh_right'),gap=2*(thigh.center[0]-thigh.dimensions.width/2);
  marker.dimensions.width=Math.min(marker.dimensions.width,gap*.9);
  marker.relativeDimensions.widthRatio=marker.dimensions.width/pelvis.width;
  if(male){
   // A small attached silhouette with a rounded inferior end, not an abdominal badge.
   const w=marker.dimensions.width/2,h=marker.dimensions.height/2;
   prism(marker,[[-w,h],[w,h],[w,-h*.45],[w*.7,-h*.85],[0,-h],[-w*.7,-h*.85],[-w,-h*.45]]);
  }
  return volumes;
 }
 const api={build};if(typeof module!=='undefined')module.exports=api;root.BodyGeometry=api;
})(globalThis);
