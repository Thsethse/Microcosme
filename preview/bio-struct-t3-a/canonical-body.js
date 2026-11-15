(function(root){
 'use strict';
 const P=typeof module!=='undefined'?require('./biological-profile.js'):root.BiologicalProfile;
 const S=typeof module!=='undefined'?require('./anatomical-skeleton.js'):root.AnatomicalSkeleton;
 const G=typeof module!=='undefined'?require('./body-geometry.js'):root.BodyGeometry;
 const schema='microcosme.bio-struct-t3-a';
 function validateBody(body){
  if(!body||typeof body!=='object')return {valid:false,errors:[{code:'STRUCTURE',message:'Corps canonique requis.'}]};
  const errors=[];const fail=(code,message)=>errors.push({code,message});
  try{P.validateProfile(body.biologicalProfile);}catch(e){fail('BIOLOGY',e.message);}
  if(!body.skeleton?.joints||!body.skeleton?.segments||!Array.isArray(body.volumes))return {valid:false,errors:[...errors,{code:'STRUCTURE',message:'Squelette et volumes requis.'}]};
  for(const s of P.schema){const v=body.parameters?.[s.key];if(typeof v!=='number'||!Number.isFinite(v)||v<s.min||v>s.max)fail('P1','Valeur finale hors bornes : '+s.key);}
  const sk=body.skeleton;
  if(!errors.length){
   const expected=S.build(body.parameters,P.profiles[body.biologicalProfile.category].trunkWidth);
   for(const [id,j] of Object.entries(expected.joints))if(!sk.joints[id]||S.norm(S.sub(sk.joints[id].position,j.position))>1e-7)fail('CANONICAL_JOINT','Articulation incompatible avec les paramètres : '+id);
   if(body.biologicalProfile.morphology?.trunkWidth!==P.profiles[body.biologicalProfile.category].trunkWidth)fail('P2','Largeur du tronc incompatible avec P2.');
   for(const [key,value]of Object.entries(body.parameters))if(body.biologicalProfile.morphology?.[key]!==value)fail('MORPHOLOGY','Caractère incompatible : '+key);
  }
  for(const seg of Object.values(sk.segments)){
   if(!sk.joints[seg.from]||!sk.joints[seg.to]||seg.length<=0||!Number.isFinite(seg.length))fail('SEGMENT','Segment non connecté : '+seg.id);
   else if(S.norm(S.sub(seg.origin,sk.joints[seg.from].position))>1e-8||S.norm(S.sub(seg.end,sk.joints[seg.to].position))>1e-8)fail('JOINT','Extrémité incohérente : '+seg.id);
  }
  const reached=new Set([sk.root]);for(let pass=0;pass<Object.keys(sk.joints).length;pass++)for(const seg of Object.values(sk.segments))if(reached.has(seg.from)||reached.has(seg.to)){reached.add(seg.from);reached.add(seg.to);}
  if(reached.size!==Object.keys(sk.joints).length)fail('CONNECTIVITY','Articulation isolée.');
  for(const v of body.volumes){
   if(!v||!v.dimensions||!v.relativeDimensions||!Array.isArray(v.center)||!v.center.every(Number.isFinite)){fail('VOLUME','Volume incomplet ou non fini.');continue;}
   const seg=sk.segments[v.anchor?.segment];
   if(!seg){fail('ANCHOR','Segment absent : '+v.id);continue;}
   try{if(S.norm(S.sub(v.center,S.point(sk,v.anchor)))>1e-7)fail('DETACHED','Volume détaché : '+v.id);}catch(e){fail('ANCHOR',v.id+' : '+e.message);}
   for(const [axis,size]of Object.entries(v.dimensions))if(!Number.isFinite(size)||size<=0)fail('DIMENSION',v.id+' '+axis);
   if(v.region!==seg.region)fail('REGION','Région incompatible avec le segment : '+v.id);
   const required=[['pectoralis_','thorax'],['biceps_','upper_arm'],['forearm_volume_','forearm'],['thigh_volume_','thigh'],['calf_volume_','calf'],['trapezius_','neck'],['gluteal_','pelvis']].find(([prefix])=>v.id.startsWith(prefix));
   if(required&&v.region!==required[1])fail('MUSCLE_REGION','Muscle hors région : '+v.id);
   const ratios=v.relativeDimensions;
   if(Math.abs(v.dimensions.width-seg.width*ratios.widthRatio)>1e-7||Math.abs(v.dimensions.height-seg.length*ratios.heightRatio)>1e-7||Math.abs(v.dimensions.depth-seg.depth*ratios.depthRatio)>1e-7)fail('RATIO','Dimensions relatives incohérentes : '+v.id);
   if(v.kind==='breast'){
    if(v.region!=='thorax'||v.anchor.t-v.dimensions.height/(2*seg.length)<0||v.anchor.t+v.dimensions.height/(2*seg.length)>1||Math.abs(v.anchor.offsetLocal[0])+v.dimensions.width/2>seg.width/2+1e-8)fail('BREAST_REGION','Poitrine hors thorax : '+v.id);
   }
   if(v.kind==='anatomical-marker'&&(v.region!=='pelvis'||v.center[1]<=seg.origin[1]||v.center[1]>=seg.end[1]||v.center[1]>=S.point(sk,sk.anchors.navel)[1]))fail('PELVIC_REGION','Signe anatomique hors bassin.');
   if(v.id.startsWith('biceps')&&v.region!=='upper_arm'||v.id.startsWith('calf_volume')&&v.region!=='calf')fail('MUSCLE_REGION','Muscle mal attaché : '+v.id);
  }
  return {valid:errors.length===0,errors};
 }
 function generateBody(seed,biologicalProfile,parameters={}){
  if(typeof seed!=='string'||seed.length>128)throw Error('Graine texte de 128 caractères maximum requise.');
  const normalized=P.normalize(biologicalProfile,parameters),p=normalized.applied;
  const skeleton=S.build(p,normalized.trunkWidth),volumes=G.build(skeleton,p,normalized.biologicalProfile);
  const skin=['#f5d3ac','#edb98d','#d99b74','#bb7e58','#925a3e','#673d2f'][Math.floor(P.hash(seed,0)*6)];
  const body={schema,version:1,seed,biologicalProfile:{...normalized.biologicalProfile,morphology:{...p,trunkWidth:normalized.trunkWidth}},
   requestedParameters:normalized.requested,parameters:p,corrections:normalized.corrections,skeleton,volumes,palette:{skin,outline:'#302336',skeleton:'#79d8dc',joint:'#e78861',anchor:'#c2d77d'}};
  const report=validateBody(body);if(!report.valid)throw Error('N3 : '+report.errors.map(e=>e.message).join(' '));return body;
 }
 function serializeBody(body){const v=validateBody(body);if(!v.valid)throw Error('Export refusé : corps invalide.');return JSON.stringify({schema,version:1,seed:body.seed,biologicalProfile:{category:body.biologicalProfile.category,reproductiveFunction:body.biologicalProfile.reproductiveFunction},requestedParameters:body.requestedParameters,parameters:body.parameters,corrections:body.corrections},null,2);}
 function parseBody(text){const d=JSON.parse(text);if(!d||d.schema!==schema||d.version!==1)throw Error('Format T3-A v1 requis ; aucune conversion T2 automatique.');
  const body=generateBody(d.seed,d.biologicalProfile,d.requestedParameters);
  const equal=(a,b)=>a===b||(a&&b&&typeof a==='object'&&typeof b==='object'&&Object.keys(a).length===Object.keys(b).length&&Object.keys(a).every(k=>Object.hasOwn(b,k)&&equal(a[k],b[k])));
  if(!equal(d.parameters,body.parameters)||!equal(d.corrections,body.corrections))throw Error('Rapport ou valeurs appliquées incompatibles avec la demande exportée.');return body;
 }
 const api={generateBody,validateBody,serializeBody,parseBody};if(typeof module!=='undefined')module.exports=api;root.CanonicalBody=api;
})(globalThis);
