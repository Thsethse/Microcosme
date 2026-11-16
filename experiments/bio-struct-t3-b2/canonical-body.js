(function(root){
 'use strict';
 const P=typeof module!=='undefined'?require('./biological-profile.js'):root.BiologicalProfile;
 const S=typeof module!=='undefined'?require('./anatomical-skeleton.js'):root.AnatomicalSkeleton;
 const G=typeof module!=='undefined'?require('./body-geometry.js'):root.BodyGeometry;
 const H=typeof module!=='undefined'?require('./shape-grammar.js'):root.ShapeGrammar;
 const F=typeof module!=='undefined'?require('./facial-anchors.js'):root.FacialAnchors;
 const A=typeof module!=='undefined'?require('./morphology-settings.js'):root.MorphologySettings;
 const Finish=typeof module!=='undefined'?require('./body-finish.js'):root.BodyFinish;
 const FS=typeof module!=='undefined'?require('./face-settings.js'):root.FaceSettings;
 const FM=typeof module!=='undefined'?require('./facial-model.js'):root.FacialModel;
 const GS=typeof module!=='undefined'?require('./grooming-settings.js'):root.GroomingSettings;
 const GM=typeof module!=='undefined'?require('./grooming-model.js'):root.GroomingModel;
 const schema='microcosme.bio-struct-t3-a';
 const same=(a,b)=>a===b||(a&&b&&typeof a==='object'&&typeof b==='object'&&Object.keys(a).length===Object.keys(b).length&&Object.keys(a).every(k=>Object.hasOwn(b,k)&&same(a[k],b[k])));
 function validateBody(body){
  if(!body||typeof body!=='object')return {valid:false,errors:[{code:'STRUCTURE',message:'Corps canonique requis.'}]};
  const errors=[];const fail=(code,message)=>errors.push({code,message});
  try{P.validateProfile(body.biologicalProfile);}catch(e){fail('BIOLOGY',e.message);}
  if(!body.skeleton?.joints||!body.skeleton?.segments||!Array.isArray(body.volumes))return {valid:false,errors:[...errors,{code:'STRUCTURE',message:'Squelette et volumes requis.'}]};
  for(const s of P.schema){const v=body.parameters?.[s.key];if(typeof v!=='number'||!Number.isFinite(v)||v<s.min||v>s.max)fail('P1','Valeur finale hors bornes : '+s.key);}
  const sk=body.skeleton;
  if(body.version>=3){
   try{const normalized=A.normalize(body.biologicalProfile.category,body.appearance);if(Object.keys(normalized).length!==Object.keys(body.appearance).length||Object.entries(normalized).some(([key,value])=>body.appearance[key]!==value))fail('APPEARANCE','Réglages R3 complets et normalisés requis.');}catch(e){fail('APPEARANCE',e.message);}
   if(!body.finish||!Array.isArray(body.finish.details))fail('SURFACE','Attaches de surface R3 requises.');
   else for(const d of body.finish.details){const owner=body.volumes.find(v=>v.id===d.owner);if(!owner||!Array.isArray(d.offsetLocal)||!Array.isArray(d.position)||d.position.some(n=>!Number.isFinite(n))||S.norm(S.sub(Finish.local(owner,d.offsetLocal),d.position))>1e-7)fail('SURFACE','Détail de surface détaché : '+d.id);}
  }
  if(body.version===5){try{const n=GS.normalize(body.biologicalProfile.category,body.requestedGroomingSettings);if(!same(n.requested,body.requestedGroomingSettings)||!same(n.applied,body.groomingSettings)||!same(n.corrections,body.groomingCorrections)||!same(GM.build(body),body.grooming))fail('GROOMING','Implantation ou réglages B2 incohérents.');}catch(e){fail('GROOMING',e.message);}}
  try{H.validate(body.geometryChoices);}catch(e){fail('SHAPES',e.message);}
  if(body.version>=4){try{const n=FS.normalize(body.biologicalProfile.category,body.requestedFaceSettings);if(!same(n.applied,body.faceSettings)||!same(n.corrections,body.faceCorrections))fail('FACE','Réglages ou rapports faciaux incohérents.');}catch(e){fail('FACE',e.message);}}
  if(!errors.length){
   const expected=S.build(body.parameters,P.profiles[body.biologicalProfile.category].trunkWidth);
   const expectedFace=body.version>=4?FM.attach(expected,H.validate(body.geometryChoices),body.faceSettings):F.attach(expected,H.validate(body.geometryChoices));
   if(body.version>=4){try{const n=FS.normalize(body.biologicalProfile.category,body.requestedFaceSettings);if(!same(n.applied,body.faceSettings)||!same(n.corrections,body.faceCorrections)||!same(expectedFace,body.face))fail('FACE','Réglages ou géométrie faciale B1 incohérents.');}catch(e){fail('FACE',e.message);}}
   for(const [id,position]of Object.entries(expectedFace.anchors)){try{if(S.norm(S.sub(S.point(sk,sk.anchors[id]),position))>1e-7||S.norm(S.sub(body.face.anchors[id],position))>1e-7)fail('FACE','Attache faciale incohérente : '+id);}catch(e){fail('FACE','Attache faciale manquante : '+id);}}
   if(Object.keys(sk.anchors).some(id=>/nose|nasal/i.test(id)))fail('FACE','Ancrage nasal interdit en R1.');
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
   if(v.vertices&&v.localVertices){const expectedVertices=v.localVertices.map(a=>S.add(v.center,S.add(S.mul(v.basis.u,a[0]),S.add(S.mul(v.basis.v,a[1]),S.mul(v.basis.w,a[2])))));if(expectedVertices.some((a,i)=>S.norm(S.sub(a,v.vertices[i]))>1e-7))fail('MESH','Contour non attaché : '+v.id);}
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
 function generateBody(seed,biologicalProfile,parameters={},geometryChoices={}){
  if(typeof seed!=='string'||seed.length>128)throw Error('Graine texte de 128 caractères maximum requise.');
  const normalized=P.normalize(biologicalProfile,parameters),p=normalized.applied;
  const choices=H.validate(geometryChoices),skeleton=S.build(p,normalized.trunkWidth),face=F.attach(skeleton,choices),volumes=G.build(skeleton,p,normalized.biologicalProfile,choices);
  const skin=['#f5d3ac','#edb98d','#d99b74','#bb7e58','#925a3e','#673d2f'][Math.floor(P.hash(seed,0)*6)];
  const body={schema,version:2,seed,geometryChoices:choices,face,migration:null,biologicalProfile:{...normalized.biologicalProfile,morphology:{...p,trunkWidth:normalized.trunkWidth}},
   requestedParameters:normalized.requested,parameters:p,corrections:normalized.corrections,skeleton,volumes,palette:{skin,outline:'#302336',skeleton:'#79d8dc',joint:'#e78861',anchor:'#c2d77d'}};
  const report=validateBody(body);if(!report.valid)throw Error('N3 : '+report.errors.map(e=>e.message).join(' '));return body;
 }
 function generateBodyR3(seed,profile,parameters={},geometryChoices={},appearance={}){
  const choices=H.validate(geometryChoices),oldOval=choices.pelvisShape==='oval';if(oldOval)choices.pelvisShape='rectangle';
  const body=generateBody(seed,profile,parameters,choices);Finish.apply(body,A.normalize(profile.category,appearance));
  if(oldOval)body.migration={fromVersion:2,toVersion:3,policy:'Bassin ovale → rectangulaire, volume anatomique conservé.',originalPelvisShape:'oval',previous:null};
  const report=validateBody(body);if(!report.valid)throw Error('N3 : '+report.errors.map(e=>e.message).join(' '));return body;
 }
 function upgradeBody(body){
  if(body.version===3)return body;
  const upgraded=generateBodyR3(body.seed,body.biologicalProfile,body.requestedParameters,body.geometryChoices);
  upgraded.migration={fromVersion:body.migration?.fromVersion||body.version,toVersion:3,policy:'Données P1/P2 et fonction conservées ; finitions R3 ajoutées. '+(body.geometryChoices.pelvisShape==='oval'?'Bassin ovale → rectangulaire, volume anatomique conservé.':'Forme du bassin conservée.')+(body.biologicalProfile.category==='M'?' Ancien volume mammaire conservé dans le JSON ; rendu M par pectoraux et graisse.':''),originalPelvisShape:body.geometryChoices.pelvisShape,previous:body.migration};return upgraded;
 }
 function generateBodyB1(seed,profile,parameters={},choices={},appearance={},faceInput={}){
  const body=generateBodyR3(seed,profile,parameters,choices,appearance),n=FS.normalize(profile.category,faceInput);
  body.version=4;body.requestedFaceSettings=n.requested;body.faceSettings=n.applied;body.faceCorrections=n.corrections;FM.roundHead(body);body.face=FM.attach(body.skeleton,body.geometryChoices,body.faceSettings);
  const report=validateBody(body);if(!report.valid)throw Error('N3 : '+report.errors.map(e=>e.message).join(' '));return body;
 }
 function generateBodyB2(seed,profile,parameters={},choices={},appearance={},faceInput={},groomingInput={}){
  const body=generateBodyB1(seed,profile,parameters,choices,appearance,faceInput),n=GS.normalize(profile.category,groomingInput);
  body.version=5;body.requestedGroomingSettings=n.requested;body.groomingSettings=n.applied;body.groomingCorrections=n.corrections;body.grooming=GM.build(body);
  const report=validateBody(body);if(!report.valid)throw Error('N3 : '+report.errors.map(e=>e.message).join(' '));return body;
 }
 function serializeBody(body){const v=validateBody(body);if(!v.valid)throw Error('Export refusé : corps invalide.');return JSON.stringify({schema,version:body.version,seed:body.seed,geometryChoices:body.geometryChoices,migration:body.migration,biologicalProfile:{category:body.biologicalProfile.category,reproductiveFunction:body.biologicalProfile.reproductiveFunction},requestedParameters:body.requestedParameters,parameters:body.parameters,corrections:body.corrections,...(body.version>=3?{appearance:body.appearance}:{}),...(body.version>=4?{requestedFaceSettings:body.requestedFaceSettings,faceSettings:body.faceSettings,faceCorrections:body.faceCorrections}:{}),...(body.version===5?{requestedGroomingSettings:body.requestedGroomingSettings,groomingSettings:body.groomingSettings,groomingCorrections:body.groomingCorrections}:{})},null,2);}
 function parseBodyLegacy(text){const d=JSON.parse(text);if(!d||d.schema!==schema||![1,2,3].includes(d.version))throw Error('Format T3-A v1/v2/v3 requis ; aucune conversion T2 automatique.');
  const equal=(a,b)=>a===b||(a&&b&&typeof a==='object'&&typeof b==='object'&&Object.keys(a).length===Object.keys(b).length&&Object.keys(a).every(k=>Object.hasOwn(b,k)&&equal(a[k],b[k])));
  if(d.version===3){
   if(!d.appearance||!d.geometryChoices)throw Error('Formes et réglages R3 requis.');
   if(d.geometryChoices.pelvisShape==='oval')throw Error('Bassin ovale v3 interdit ; importer le JSON historique pour migration explicite.');
   const b=generateBodyR3(d.seed,d.biologicalProfile,d.requestedParameters,d.geometryChoices,d.appearance);
   if(!equal(d.appearance,b.appearance))throw Error('Réglages R3 complets et normalisés requis.');
   if(d.migration){if(![1,2].includes(d.migration.fromVersion)||d.migration.toVersion!==3||typeof d.migration.policy!=='string')throw Error('Trace de migration R3 invalide.');b.migration=structuredClone(d.migration);}
   if(!equal(d.parameters,b.parameters)||!equal(d.corrections,b.corrections))throw Error('Rapport ou valeurs appliquées incompatibles avec la demande exportée.');return b;
  }
  if(d.version===2&&!d.geometryChoices)throw Error('Choix de formes v2 requis.');
  const body=generateBody(d.seed,d.biologicalProfile,d.requestedParameters,d.version===1?{headShape:'oval'}:d.geometryChoices);
  if(d.version===1)body.migration={fromVersion:1,toVersion:2,policy:'P1/P2 et fonction conservés ; géométrie R1 recalculée, tête ovale et choix neutres explicites.'};
  else if(d.migration){if(d.migration.fromVersion!==1||d.migration.toVersion!==2||typeof d.migration.policy!=='string')throw Error('Trace de migration invalide.');body.migration={...d.migration};}
  if(!equal(d.parameters,body.parameters)||!equal(d.corrections,body.corrections))throw Error('Rapport ou valeurs appliquées incompatibles avec la demande exportée.');return body;
 }
 function parseBodyB1(text){
  const d=JSON.parse(text);if(!d||d.schema!==schema||![1,2,3,4].includes(d.version))throw Error('Format T3-A/B1 v1…v4 requis ; aucune conversion T2 automatique.');
  if(d.version===4){
   if(!d.appearance||!d.geometryChoices||!d.requestedFaceSettings||!d.faceSettings||!Array.isArray(d.faceCorrections))throw Error('Paramètres corporels et faciaux v4 complets requis.');
   if(d.geometryChoices.pelvisShape==='oval')throw Error('Importer l’ancien JSON pour migrer le bassin ovale.');
   const b=generateBodyB1(d.seed,d.biologicalProfile,d.requestedParameters,d.geometryChoices,d.appearance,d.requestedFaceSettings);
   if(!same(b.parameters,d.parameters)||!same(b.corrections,d.corrections)||!same(b.appearance,d.appearance)||!same(b.faceSettings,d.faceSettings)||!same(b.faceCorrections,d.faceCorrections)||!same(b.requestedFaceSettings,d.requestedFaceSettings))throw Error('Valeurs appliquées ou rapports v4 incompatibles avec les demandes.');
   if(d.migration){if(![1,2,3].includes(d.migration.fromVersion)||d.migration.toVersion!==4||typeof d.migration.policy!=='string')throw Error('Trace de migration B1 invalide.');b.migration=structuredClone(d.migration);}return b;
  }
  const oldHead=d.geometryChoices?.headShape||(d.version===1?'oval':'round'),removed=['triangle','invertedTriangle','diamond'].includes(oldHead);
  if(removed)d.geometryChoices={...d.geometryChoices,headShape:'round'};
  const old=upgradeBody(parseBodyLegacy(JSON.stringify(d))),b=generateBodyB1(old.seed,old.biologicalProfile,old.requestedParameters,old.geometryChoices,old.appearance);
  b.migration={fromVersion:d.version,toVersion:4,policy:'Corps R3 et données conservés ; visage B1 ajouté. '+(removed?'Ancienne tête '+oldHead+' → rond.':'Tête conservée ; angles carrés/rectangulaires arrondis.'),originalHeadShape:oldHead,previous:old.migration};return b;
 }
 function parseBody(text){
  const d=JSON.parse(text);if(!d||d.schema!==schema||![1,2,3,4,5].includes(d.version))throw Error('Format T3 v1…v5 requis ; aucune conversion T2 automatique.');
  if(d.version===5){
   if(!d.requestedGroomingSettings||!d.groomingSettings||!Array.isArray(d.groomingCorrections))throw Error('Réglages B2 v5 complets requis.');
   if(!d.geometryChoices||!d.appearance||!d.requestedParameters||!d.requestedFaceSettings||!d.faceSettings||!Array.isArray(d.faceCorrections))throw Error('Données corporelles et faciales v5 complètes requises.');
   const requested={...d.requestedGroomingSettings};
   if(d.biologicalProfile?.category==='F')for(const part of GS.facial)if(d.groomingSettings[part+'Present']===true&&!requested[part+'Present'])requested[part+'Present']=true;
   const b=generateBodyB2(d.seed,d.biologicalProfile,d.requestedParameters,d.geometryChoices,d.appearance,d.requestedFaceSettings,requested);
   for(const key of ['geometryChoices','requestedParameters','parameters','corrections','appearance','requestedFaceSettings','faceSettings','faceCorrections'])if(!same(b[key],d[key]))throw Error('Données corporelles/faciales v5 incompatibles.');
   if(!same(b.requestedGroomingSettings,requested))throw Error('Demandes B2 v5 complètes et normalisées requises.');
   const sanitized={...d.groomingSettings};if(d.biologicalProfile.category==='F')for(const part of GS.facial)sanitized[part+'Present']=false;
   if(!same(sanitized,b.groomingSettings)||d.biologicalProfile.category!=='F'&&!same(b.groomingCorrections,d.groomingCorrections))throw Error('Rapport capillaire incompatible avec la demande.');
   if(d.migration){if(![1,2,3,4].includes(d.migration.fromVersion)||d.migration.toVersion!==5||typeof d.migration.policy!=='string')throw Error('Trace de migration B2 invalide.');b.migration=structuredClone(d.migration);}return b;
  }
  const old=parseBodyB1(text),input=d.requestedGroomingSettings||d.groomingSettings||{},b=generateBodyB2(old.seed,old.biologicalProfile,old.requestedParameters,old.geometryChoices,old.appearance,old.requestedFaceSettings,input);
  b.migration={fromVersion:d.version,toVersion:5,policy:'Corps R3 et visage B1 conservés ; réglages B2 ajoutés. Anciens profils sans chevelure : chauves. Pilosité faciale F toujours désactivée.',previous:old.migration};return b;
 }
 const api={generateBody,generateBodyR3,generateBodyB1,generateBodyB2,upgradeBody,validateBody,serializeBody,parseBody};if(typeof module!=='undefined')module.exports=api;root.CanonicalBody=api;
})(globalThis);
