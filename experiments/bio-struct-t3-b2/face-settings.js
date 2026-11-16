/* B1 catalogue proposals. Colours and shapes do not depend on reproductive function. */
(function(root){
 'use strict';
 const heads={round:'Rond',oval:'Ovale',square:'Carré arrondi',rectangle:'Rectangle arrondi'};
 const eyes={round:'Rond',oval:'Ovale',rectangle:'Rectangulaire',almond:'Amande',triangle:'Triangle vers le haut',invertedTriangle:'Triangle vers le bas'};
 const brows={straight:'Droit',arch:'Arqué',angled:'Incliné'};
 const mouths={lowerSemicircle:'Demi-cercle inférieur',upperSemicircle:'Demi-cercle supérieur',triangles:'Petits triangles',rectangle:'Rectangulaire',reversedB:'B inversé · deux lobes'};
 const lashStyles={none:'Sans cils',short:'Courts',long:'Accentués'};
 function normalize(category,input={}){
  if(!['M','F','T'].includes(category)||!input||typeof input!=='object'||Array.isArray(input))throw Error('Réglages du visage B1 requis.');
  const defaults={eyeShape:'oval',eyeSize:1,irisColor:'#54867f',browShape:'straight',browColor:'#503c32',mouthShape:'lowerSemicircle',lipColor:'#a3665e',lashes:category==='F'?'short':'none'};
  for(const key of Object.keys(input))if(!Object.hasOwn(defaults,key))throw Error('Réglage facial inconnu : '+key);
  const requested={...defaults,...input},applied={...requested},corrections=[];
  for(const [key,catalogue]of [['eyeShape',eyes],['browShape',brows],['mouthShape',mouths],['lashes',lashStyles]])if(!Object.hasOwn(catalogue,requested[key]))throw Error('Forme faciale inconnue : '+key);
  if(category==='M'&&requested.lashes!=='none'||category==='F'&&requested.lashes==='none')throw Error('Cils : M sans cils, F courts/accentués, T libre.');
  for(const key of ['irisColor','browColor','lipColor']){if(typeof requested[key]!=='string'||!/^#[0-9a-f]{6}$/i.test(requested[key]))throw Error('Couleur hexadécimale requise : '+key);requested[key]=requested[key].toLowerCase();applied[key]=requested[key];}
  if(typeof requested.eyeSize!=='number'||!Number.isFinite(requested.eyeSize))throw Error('Taille des yeux finie requise.');
  applied.eyeSize=Math.max(.5,Math.min(1.5,requested.eyeSize));if(applied.eyeSize!==requested.eyeSize)corrections.push({parameter:'eyeSize',requested:requested.eyeSize,applied:applied.eyeSize,reason:'N2 B1 : taille des yeux bornée [0.5, 1.5], attaches recalculées.'});
  return {requested,applied,corrections};
 }
 const api={heads,eyes,brows,mouths,lashStyles,normalize};if(typeof module!=='undefined')module.exports=api;root.FaceSettings=api;
})(globalThis);
