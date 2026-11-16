/* R3 body-only controls; independent of reproductive function. */
(function(root){
 'use strict';
 const breastShapes={natural:'Référence R2',round:'Arrondie',drop:'Goutte stylisée'};
 const pubicShapes={none:'Absente',triangle:'Triangulaire',square:'Carrée',rectangle:'Rectangulaire'};
 const ranges=[
  {key:'pectoralDefinition',label:'Pectoraux · ronds et souples → rectangulaires et musclés',initial:.50},
  {key:'abdominalDefinition',label:'Abdominaux · ventre rond → relief défini',initial:.25},
  {key:'fatVolume',label:'Volume de graisse · léger → plus rond',initial:.15},
  {key:'shadowStrength',label:'Ombres brunes · absentes → plus lisibles',initial:.40},
  {key:'chestHairDensity',label:'Pilosité du torse · absente → dense',initial:0,bodyHair:true},
  {key:'bellyHairDensity',label:'Pilosité du ventre · absente → dense',initial:0,bodyHair:true},
  {key:'pubicHairDensity',label:'Densité de pilosité pubienne',initial:.5}
 ];
 function normalize(category,input={}){
  if(!['M','F','T'].includes(category)||!input||typeof input!=='object'||Array.isArray(input))throw Error('Réglages corporels R3 requis.');
  const allowed=[...ranges.map(s=>s.key),'breastShape','pubicHairShape','hairColor'];
  for(const key of Object.keys(input))if(!allowed.includes(key))throw Error('Réglage R3 inconnu : '+key);
  const values={};
  for(const s of ranges){const v=Object.hasOwn(input,s.key)?input[s.key]:s.initial;if(typeof v!=='number'||!Number.isFinite(v)||v<0||v>1)throw Error('Valeur R3 entre 0 et 1 requise : '+s.key);values[s.key]=v;}
  values.breastShape=Object.hasOwn(input,'breastShape')?input.breastShape:category==='M'?null:'natural';
  if(category==='M'?values.breastShape!==null:!Object.hasOwn(breastShapes,values.breastShape))throw Error('Forme mammaire réservée à F/T ; aucune option mammaire M.');
  values.pubicHairShape=Object.hasOwn(input,'pubicHairShape')?input.pubicHairShape:'none';
  if(!Object.hasOwn(pubicShapes,values.pubicHairShape)||(category==='M'&&!['none','rectangle'].includes(values.pubicHairShape)))throw Error('Forme de pilosité pubienne incompatible avec les options du contrat.');
  values.hairColor=Object.hasOwn(input,'hairColor')?input.hairColor:'#573c2d';if(typeof values.hairColor!=='string'||!/^#[0-9a-f]{6}$/i.test(values.hairColor))throw Error('Couleur de poils hexadécimale requise.');values.hairColor=values.hairColor.toLowerCase();
  return values;
 }
 const api={ranges,breastShapes,pubicShapes,normalize};if(typeof module!=='undefined')module.exports=api;root.MorphologySettings=api;
})(globalThis);
