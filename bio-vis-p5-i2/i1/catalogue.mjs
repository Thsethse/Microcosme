import {styles as existing,bodies} from './base/catalogue.mjs';
export {bodies};
export const references=Object.freeze(Object.fromEntries([
 [19,'Raie classique','classic','bob','Vague courte et carré arrondi à raie latérale.'],
 [20,'Dégradé court','classic','classic','Dessus court pointu, puis frange balayée.'],
 [21,'Carré moderne','classic','bob','Vague courte mutualisée avec 19-G ; carré à ligne basse nette.'],
 [22,'Ondulations souples','classic','mid_waves','Vagues courtes retournées, puis grandes ondulations libres.'],
 [23,'Effet coiffé-décoiffé','classic','bun','Pointes libres, puis chignon irrégulier et mèches pendantes.'],
 [24,'Queue-de-cheval','classic','pony','Queue basse derrière la nuque, puis queue haute décentrée.'],
 [25,'Undercut','classic','bob','Quiff sur côtés rasés, puis longue mèche et une tempe dégagée.'],
 [26,'Frange et mèches','classic','fringe_bob','Frange morcelée, puis frange droite sur de longues mèches.'],
 [27,'Boucles volumineuses','curls','long_curls','Couronne de grandes boucles, puis cascade épaisse.']
].map(([number,name,G,D,note])=>{
 const id='p5-'+String(number).padStart(3,'0');
 return [id,Object.freeze({id,number,name,note,source:'P5-A',position:`L${Math.floor((number-19)/3)+1}C${(number-19)%3+1}`,bases:{G,D},longArrangements:number===24?['G','D']:[22,23,25,26,27].includes(number)?['D']:[]})];
})));
export const styles=Object.freeze({...existing,...references});
export const arrangements=Object.freeze(['G','D']);
export function geometryKey(id,arrangement){
 if((id==='p5-019'||id==='p5-021')&&arrangement==='G')return 'side-wave-short';
 if(id==='p5-024'&&arrangement==='D')return 'p4-pony';
 return id+'-'+arrangement;
}
