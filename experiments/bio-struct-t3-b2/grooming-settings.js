/* B2 appearance catalogue: never infers or changes reproductive function. */
(function(root){
 'use strict';
 const lengths={bald:'Chauve',short:'Court',medium:'Mi-long',long:'Long',veryLong:'Très long'};
 const textures={smooth:'Lisse · tombé souple',straight:'Raide · mèches droites',frizzy:'Frisé · petites ondulations',curly:'Bouclé · larges boucles'};
 const families={masculine:'Inspiration masculine',feminine:'Inspiration féminine',mixed:'Mixte'};
 const cuts={masculine:{swept:'Balayée',crop:'Coupe nette'},feminine:{parted:'Raie centrale',layered:'Dégradée'},mixed:{balanced:'Équilibrée',asymmetric:'Asymétrique'}};
 const facial=['moustache','beard','sideburns'];
 const familyFor=category=>category==='M'?'masculine':category==='F'?'feminine':'mixed';
 function normalize(category,input={}){
  if(!['M','F','T'].includes(category)||!input||typeof input!=='object'||Array.isArray(input))throw Error('Réglages capillaires B2 requis.');
  const family=familyFor(category),defaults={hairLength:'bald',hairTexture:'smooth',hairFamily:family,hairCut:Object.keys(cuts[family])[0],hairColor:'#49352e'};
  for(const part of facial){defaults[part+'Present']=false;defaults[part+'Size']=.5;defaults[part+'Color']='#49352e';}
  for(const key of Object.keys(input))if(!Object.hasOwn(defaults,key))throw Error('Réglage B2 inconnu : '+key);
  const requested={...defaults,...input},applied={...requested},corrections=[];
  const correction=(key,value,reason)=>{corrections.push({parameter:key,requested:requested[key],applied:value,reason});applied[key]=value;};
  for(const [key,options]of [['hairLength',lengths],['hairTexture',textures],['hairFamily',families]])if(!Object.hasOwn(options,requested[key]))throw Error('Choix capillaire inconnu : '+key);
  if(category!=='T'&&requested.hairFamily!==family)correction('hairFamily',family,'N2 B2 : famille du catalogue de présentation M/F ; catégorie conservée.');
  if(!Object.values(cuts).some(options=>Object.hasOwn(options,requested.hairCut)))throw Error('Coupe inconnue.');
  if(!Object.hasOwn(cuts[applied.hairFamily],requested.hairCut))correction('hairCut',Object.keys(cuts[applied.hairFamily])[0],'N2 B2 : coupe adaptée à la famille choisie.');
  for(const part of facial){
   const key=part+'Present';if(typeof requested[key]!=='boolean')throw Error('Présence booléenne requise : '+part);
   if(category==='F'&&requested[key])correction(key,false,'N2 B2 : pilosité faciale interdite pour F, y compris à l’import.');
   const size=part+'Size';if(typeof requested[size]!=='number'||!Number.isFinite(requested[size]))throw Error('Taille finie requise : '+part);
   const bounded=Math.max(0,Math.min(1,requested[size]));if(bounded!==requested[size])correction(size,bounded,'N2 B2 : taille bornée [0,1].');
  }
  for(const key of ['hairColor',...facial.map(p=>p+'Color')]){if(typeof requested[key]!=='string'||!/^#[0-9a-f]{6}$/i.test(requested[key]))throw Error('Couleur hexadécimale requise : '+key);requested[key]=requested[key].toLowerCase();applied[key]=requested[key];}
  return {requested,applied,corrections};
 }
 const api={lengths,textures,families,cuts,facial,familyFor,normalize};if(typeof module!=='undefined')module.exports=api;root.GroomingSettings=api;
})(globalThis);
