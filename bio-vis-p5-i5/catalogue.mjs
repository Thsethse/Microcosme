import {styles as prior,references as previous,lotA,lotB,lotC,lotD,bodies,arrangements,geometryKey as priorKey} from './i4/catalogue.mjs';
export {lotA,lotB,lotC,lotD,bodies,arrangements};
export const lotE=Object.freeze(Object.fromEntries([
 [55,'Tresses africaines','Rangées plaquées et six longs brins ; chignon de fines tresses et retombées courtes en D.',['G','D']],
 [56,'Chignon japonais','Petit chignon et front tiré ; grand chignon, raie centrale et deux mèches en D.',['D']],
 [57,'Coiffure égyptienne','Carré structuré à frange droite ; brins plus longs en D, ornements séparés.',['G','D']],
 [58,'Coiffure romaine','Couronne de boucles courtes ; chignon, rouleaux et mèches près des joues en D.',['D']],
 [59,'Coiffure médiévale','Couronne tressée ; grandes vagues libres à raie centrale sous un bandeau en D.',['D']],
 [60,'Coiffure nordique','Dessus relevé, tempe tressée et natte ; couronne et deux nattes avec mèches libres en D.',['G','D']],
 [61,'Coiffure asiatique','Chignon lisse avec deux mèches fines ; grand rouleau latéral et chignon décentré en D.',['G','D']],
 [62,'Coiffure punk','Crête centrale élargie ; balayage asymétrique à côté court et teinte amovible en D.',['D']],
 [63,'Coiffure nomade','G : foulard, cheveux non observables ; D : demi-attache torsadée haute et longueurs ondulées.',['G','D']]
].map(([number,name,note,longArrangements])=>{const id='p5-'+String(number).padStart(3,'0');return [id,Object.freeze({id,number,name,note,longArrangements,source:'P5-E v1',position:`L${Math.floor((number-55)/3)+1}C${(number-55)%3+1}`,bases:{G:number===58?'curls':'classic',D:'classic'},unknownArrangements:number===63?['G']:[]})];})));
export const references=Object.freeze({...previous,...lotE});
export const styles=Object.freeze({...prior,...lotE});
export function geometryKey(id,a){
 if(id==='p5-058')return a==='G'?'curls':priorKey('p5-031','D');
 if(id==='p5-059'&&a==='G')return priorKey('p5-028','G');
 if(id==='p5-062'&&a==='D')return priorKey('p5-049','G');
 if(id==='p5-063'&&a==='G')return 'unknown-under-scarf';
 return lotE[id]?id+'-'+a:priorKey(id,a);
}
