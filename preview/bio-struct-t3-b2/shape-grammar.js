/* Shape choices are independent of biological category and reproductive function. */
(function(root){
 'use strict';
 const schema=[
  {key:'headShape',label:'Forme de tête',initial:'round',options:{round:'Rond',oval:'Ovale',square:'Carré arrondi',rectangle:'Rectangle arrondi'}},
  {key:'torsoShape',label:'Morphologie du tronc',initial:'rectangle',options:{rectangle:'Rectangulaire',oval:'Ovale',invertedTriangle:'Triangle inversé',triangle:'Triangulaire',hourglass:'Sablier',trapezoid:'Trapèze'}},
  {key:'pelvisShape',label:'Forme du bassin',initial:'trapezoid',options:{rectangle:'Rectangulaire',oval:'Ovale',trapezoid:'Trapèze'}},
  {key:'limbShape',label:'Contour des membres',initial:'rectangle',options:{rectangle:'Rectangulaire',rounded:'Arrondi et effilé'}}
 ];
 function validate(input={}){
  if(!input||typeof input!=='object'||Array.isArray(input))throw Error('Choix de formes attendus.');
  for(const key of Object.keys(input))if(!schema.some(s=>s.key===key))throw Error('Choix de forme inconnu : '+key);
  return Object.fromEntries(schema.map(s=>{const value=Object.hasOwn(input,s.key)?input[s.key]:s.initial;if(!Object.hasOwn(s.options,value))throw Error('Forme inconnue : '+s.key);return [s.key,value];}));
 }
 const headWidthRatio=shape=>shape==='oval'?.78:shape==='rectangle'?.76:1;
 function halfWidth(shape,fraction){const t=Math.max(0,Math.min(1,fraction));
  if(shape==='round'||shape==='oval')return .5*Math.sqrt(Math.max(0,1-(2*t-1)**2));
  if(shape==='triangle')return t*.5;
  if(shape==='invertedTriangle')return (1-t)*.5;
  if(shape==='diamond')return .5*(1-Math.abs(2*t-1));
  return .5;
 }
 function torsoFactor(shape,u){const t=Math.max(0,Math.min(1,u));
  if(shape==='oval')return .78+.22*Math.sin(Math.PI*t);
  if(shape==='invertedTriangle')return .65+.35*t;
  if(shape==='triangle')return 1-.30*t;
  if(shape==='hourglass')return 1-.24*Math.sin(Math.PI*t)**2;
  if(shape==='trapezoid')return .80+.20*t;
  return 1;
 }
 const api={schema,validate,headWidthRatio,halfWidth,torsoFactor};if(typeof module!=='undefined')module.exports=api;root.ShapeGrammar=api;
})(globalThis);
