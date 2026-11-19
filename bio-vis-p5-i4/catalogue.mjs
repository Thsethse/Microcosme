import {styles as prior,references as previous,lotA,lotB,lotC,bodies,arrangements,geometryKey as priorKey} from './i3/catalogue.mjs';
export {lotA,lotB,lotC,bodies,arrangements};
export const lotD=Object.freeze(Object.fromEntries([
 [46,'Crête / Iroquois','Bande centrale en longues pointes ; éventail incliné en D. Côtés découverts.',[]],
 [47,'Côtés rasés et longue mèche','Dessus pointu rabattu ; long panneau oblique en D. Tempe opposée courte.',['D']],
 [48,'Pointes ébouriffées','Pointes courtes multidirectionnelles ; mèches plus longues et rayonnantes en D.',['D']],
 [49,'Coupe asymétrique extrême','Longue pointe frontale et côté court ; panneau sous le menton en D.',['G','D']],
 [50,'Couleurs et mèches contrastées','Pointes et zones contrastées ; panneau long avec mèche de couleur en D.',['D']],
 [51,'Volume extravagant','Très haut éventail souple ; rouleaux fermés et retombées en D.',['D']],
 [52,'Dreadlocks / Locks','Cylindres courts rayonnants ; longs brins souples et certains relevés en D.',['G','D']],
 [53,'Tresses créatives','Rangées séparées et deux brins ; implantation asymétrique et longues tresses en D.',['G','D']],
 [54,'Accessoires et ornements','Pointes courtes et lunettes amovibles ; grande touffe et plumes indépendantes en D.',['D']]
].map(([number,name,note,longArrangements])=>{const id='p5-'+String(number).padStart(3,'0');return [id,Object.freeze({id,number,name,note,longArrangements,source:'P5-D',position:`L${Math.floor((number-46)/3)+1}C${(number-46)%3+1}`,bases:{G:'classic',D:'classic'}})];})));
export const references=Object.freeze({...previous,...lotD});
export const styles=Object.freeze({...prior,...lotD});
export function geometryKey(id,a){
 if((id==='p5-048'||id==='p5-054')&&a==='G')return priorKey('p5-038','G');
 if(id==='p5-050'&&a==='G')return 'p5-047-G';
 return lotD[id]?id+'-'+a:priorKey(id,a);
}
