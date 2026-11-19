import {styles as prior,references as lotA,bodies,arrangements,geometryKey as oldGeometryKey} from './i1/catalogue.mjs';
export {bodies,arrangements,lotA};
// G/D name source illustrations, never a restriction on inhabitants.
export const lotB=Object.freeze(Object.fromEntries([
 [28,'Couronne tressée','Anneau de cheveux entrelacés ; raie centrale et deux mèches libres en D.',['D'], 'braid-crown'],
 [29,'Chignon architectural','Éventail relevé en G ; chignon à grands rouleaux, attache haute et deux retombées en D.',['D'],'rolled-bun'],
 [30,'Boucles aristocratiques','Rouleaux ouverts et boucles à la nuque ; demi-attache sur une longue cascade en D.',['G','D'],'curls'],
 [31,'Coiffure de cour','Sommet bombé et rouleaux symétriques ; chignon haut et mèches pendantes en D.',['D'],'court-rolls'],
 [32,'Tresse royale','Racines balayées et grosse natte avant ; couronne et deux longues tresses en D.',['G','D'],'front-braids'],
 [33,'Chignon ornementé','Mèches courtes balayées et ruban de nuque ; chignon latéral et fleur en D.',[],'side-roll'],
 [34,'Haut volume sophistiqué','Quiff haut en grandes vagues ; balayage ample sur une cascade latérale en D.',['D'],'high-sweep'],
 [35,'Natte et bijoux','Natte avant plus fine et racines lissées ; couronne basse et deux brins fins en D.',['G','D'],'front-braids'],
 [36,'Coiffure cérémonielle','Raie centrale et longs côtés ; structure haute de rouleaux symétriques en D.',['G'],'ceremonial-rolls']
].map(([number,name,note,longArrangements,family])=>{
 const id='p5-'+String(number).padStart(3,'0');
 return [id,Object.freeze({id,number,name,note,longArrangements,family,source:'P5-B',position:`L${Math.floor((number-28)/3)+1}C${(number-28)%3+1}`,bases:{G:'classic',D:'classic'}})];
})));
export const references=Object.freeze({...lotA,...lotB});
export const styles=Object.freeze({...prior,...lotB});
export {geometryKey as priorGeometryKey} from './i1/catalogue.mjs';
export function geometryKey(id,a){return lotB[id]?id+'-'+a:oldGeometryKey(id,a)}
