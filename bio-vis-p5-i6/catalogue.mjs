import {styles as prior,references as previous,lotA,lotB,lotC,lotD,lotE,bodies,arrangements,geometryKey as priorKey} from './i5/catalogue.mjs';
export {lotA,lotB,lotC,lotD,lotE,bodies,arrangements};
export const lotF=Object.freeze(Object.fromEntries([
 [64,'Coiffure de guerrier','Chignon central à côtés courts ; couronne, chignon et deux longues nattes en D.',['D']],
 [65,'Coiffure d’aventurier','Courtes mèches projetées vers un côté ; pointes rayonnantes jusqu’à la nuque en D.',['D']],
 [66,'Coiffure de rôdeur','Frange irrégulière G, raie et deux nattes D ; parties cachées sous la capuche inconnues.',['G','D']],
 [67,'Coiffure de voyageur','Frange balayée et deux petites couettes basses ; deux nattes sous un foulard en D.',['G','D']],
 [68,'Coiffure de savant','Grande mèche courte balayée ; chignon haut et deux boucles latérales en D.',['D']],
 [69,'Coiffure d’alchimiste','Pointes courtes ; chignon irrégulier et nombreuses mèches libres en D.',['D']],
 [70,'Coiffure spirituelle','Chignon central à côtés courts ; chignon haut, longueurs libres et parure séparée en D.',['D']],
 [71,'Coiffure mystique','Longue mèche latérale et tempe courte ; structure tressée haute et deux brins en D.',['G','D']],
 [72,'Coiffure héroïque','Grand balayage, côté tressé et natte ; couronne étagée sur longueurs ondulées en D.',['G','D']]
].map(([number,name,note,longArrangements])=>{const id='p5-'+String(number).padStart(3,'0');return [id,Object.freeze({id,number,name,note,longArrangements,source:'P5-F',position:`L${Math.floor((number-64)/3)+1}C${(number-64)%3+1}`,bases:{G:'classic',D:'classic'},partialArrangements:number===66?['G','D']:number===67?['D']:[]})];})));
export const references=Object.freeze({...previous,...lotF});
export const styles=Object.freeze({...prior,...lotF});
export function geometryKey(id,a){
 if(id==='p5-065'&&a==='D')return priorKey('p5-048','D');
 if(id==='p5-068'&&a==='G')return priorKey('p5-019','G');
 if(id==='p5-069'&&a==='G')return priorKey('p5-054','G');
 if(id==='p5-070'&&a==='G')return 'p5-064-G';
 if(id==='p5-071'&&a==='G')return priorKey('p5-049','G');
 return lotF[id]?id+'-'+a:priorKey(id,a);
}
