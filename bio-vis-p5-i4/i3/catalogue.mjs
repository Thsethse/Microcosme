import {styles as prior,references as previous,lotA,lotB,bodies,arrangements,geometryKey as priorKey} from './i2/catalogue.mjs';
export {lotA,lotB,bodies,arrangements};
export const lotC=Object.freeze(Object.fromEntries([
 [37,'Coupe de travail','Pointes courtes courbées ; grand balayage et queue basse latérale en D.',['D']],
 [38,'Cheveux en bataille','Pointes multidirectionnelles ; frange déchiquetée et nuque libre en D.',['D']],
 [39,'Coupe rustique','Frange courte morcelée ; raie centrale et deux nattes simples en D.',['D']],
 [40,'Longue chevelure sauvage','Mèches de nuque étagées ; longues vagues libres et brins fins en D.',['G','D']],
 [41,'Natte de travail','Rouleau tiré sur tempes courtes et natte ; raie simple, une natte et mèche libre en D.',['G','D']],
 [42,'Demi-attaché naturel','Petit chignon sur nuque libre ; demi-attache et longue masse ondulée en D.',['G','D']],
 [43,'Cheveux ébouriffés et longs','Grandes mèches étagées ; balayage ample et cascade asymétrique en D.',['G','D']],
 [44,'Coupe asymétrique simple','Frange oblique en pointes ; panneau long et petite tempe tressée en D.',['D']],
 [45,'Tresses sauvages','Gros brins courts orientés en éventail ; départs tressés et longues nattes irrégulières en D.',['G','D']]
].map(([number,name,note,longArrangements])=>{const id='p5-'+String(number).padStart(3,'0');return [id,Object.freeze({id,number,name,note,longArrangements,source:'P5-C',position:`L${Math.floor((number-37)/3)+1}C${(number-37)%3+1}`,bases:{G:'classic',D:'classic'}})];})));
export const references=Object.freeze({...previous,...lotC});
export const styles=Object.freeze({...prior,...lotC});
export function geometryKey(id,a){return lotC[id]?id+'-'+a:priorKey(id,a)}
