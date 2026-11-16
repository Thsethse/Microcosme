/* T3-A canonical description, scoped to the independent laboratory. No reproduction simulation. */
(function(root){
 'use strict';
 const profiles=Object.freeze({
  M:Object.freeze({shoulderWidth:1.15,pelvisWidth:.90,thoraxDepth:1.10,muscleVolume:.65,breastVolume:.05,trunkWidth:1.10}),
  F:Object.freeze({shoulderWidth:.90,pelvisWidth:1.15,thoraxDepth:1.00,muscleVolume:.40,breastVolume:.65,trunkWidth:.95}),
  T:Object.freeze({shoulderWidth:1.05,pelvisWidth:1.05,thoraxDepth:1.05,muscleVolume:.50,breastVolume:.50,trunkWidth:1.00})
 });
 const schema=[
 ['globalSize','Taille globale',.75,1,1.30],['headHeight','Hauteur tête',.80,1,1.20],['headWidth','Largeur tête',.75,1,1.30],
 ['trunkLength','Longueur tronc',.80,1,1.25],['armLength','Longueur bras',.80,1,1.20],['legLength','Longueur jambes',.80,1,1.25],
 ['shoulderWidth','Largeur épaules',.75,1,1.35],['pelvisWidth','Largeur bassin',.75,1,1.35],['thoraxDepth','Profondeur thorax',.75,1,1.35],
 ['muscleVolume','Volume musculaire',0,.50,1],['breastVolume','Volume mammaire',0,.50,1]
 ].map(([key,label,min,reference,max])=>Object.freeze({key,label,min,reference,max,step:.01}));
 function validateProfile(profile){
  if(!profile||!Object.hasOwn(profiles,profile.category))throw Error('Catégorie biologique requise : M, F ou T.');
  const {category,reproductiveFunction}=profile;
  if(!['male','female'].includes(reproductiveFunction))throw Error('Une seule fonction reproductive est requise : male OU female.');
  if(category==='M'&&reproductiveFunction!=='male'||category==='F'&&reproductiveFunction!=='female')throw Error('Fonction reproductive incompatible avec la catégorie '+category+'.');
  return {category,reproductiveFunction};
 }
 function reference(category,reproductiveFunction=category==='F'?'female':'male'){
  const profile=validateProfile({category,reproductiveFunction}),parameters=Object.fromEntries(schema.map(s=>[s.key,profiles[category][s.key]??s.reference]));
  return {biologicalProfile:profile,parameters};
 }
 function normalize(profile,input={}){
  const p=validateProfile(profile),defaults=reference(p.category,p.reproductiveFunction).parameters;
  if(!input||typeof input!=='object'||Array.isArray(input))throw Error('Paramètres numériques attendus.');
  for(const key of Object.keys(input))if(!schema.some(s=>s.key===key))throw Error('Paramètre inconnu : '+key);
  const requested={},applied={},corrections=[];
  for(const s of schema){const value=input[s.key]??defaults[s.key];
   if(Object.hasOwn(input,s.key)&&(typeof input[s.key]!=='number'||!Number.isFinite(input[s.key])))throw Error('Nombre fini requis : '+s.key);
   requested[s.key]=value;applied[s.key]=Math.min(s.max,Math.max(s.min,value));
   if(value!==applied[s.key])corrections.push({parameter:s.key,requested:value,applied:applied[s.key],reason:`N2 : borne P1 finale [${s.min}, ${s.max}]`});
  }
  return {biologicalProfile:p,requested,applied,corrections,trunkWidth:profiles[p.category].trunkWidth};
 }
 function hash(seed,index){let h=2166136261;for(const c of seed+':'+index)h=Math.imul(h^c.charCodeAt(0),16777619)>>>0;h^=h>>>16;h=Math.imul(h,0x45d9f3b);return ((h^(h>>>16))>>>0)/4294967296;}
 const api={profiles,schema,reference,validateProfile,normalize,hash};if(typeof module!=='undefined')module.exports=api;root.BiologicalProfile=api;
})(globalThis);
