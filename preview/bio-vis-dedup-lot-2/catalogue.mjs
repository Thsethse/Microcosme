// Presentation only. The canonical catalogue and renderer are not altered.
import {styles,references,normalize} from '../bio-vis-p5-i6/model.mjs';
export {styles,references};
export const groups=Object.freeze([
 ['E03','p5-019:G','p5-021:G','19-G','21-G','Même balayage court. Réserve sur 21-G acceptée ; aucune retouche graphique.'],
 ['E04','p5-028:G','p5-059:G','28-G','59-G','Couronne tressée commune ; les arrangements D restent indépendants.'],
 ['E07','p5-047:G','p5-050:G','47-G','50-G','La couleur de 50-G reste une information historique, sans nouvelle entrée biologique.'],
 ['E09','p5-049:G','p5-062:D','49-G','62-D','Contraste de 62-D conservé. 71-G garde son entrée et son rendu.'],
 ['E10','p5-064:G','p5-070:G','64-G','70-G','Chignon central commun ; les deux arrangements D restent indépendants.'],
 ['V01','p5-056:G','p5-061:G','56-G','61-G','Compromis de catalogue : 61-G garde ses deux mèches supplémentaires dans son rendu historique.']
].map(([id,primary,secondary,primaryLabel,secondaryLabel,note])=>Object.freeze({id,primary,secondary,primaryLabel,secondaryLabel,note})));
export const choices=Object.freeze(Object.entries(styles).flatMap(([style,s],i)=>{
 const number=s.number||i+1;
 return (s.number?['G','D']:['U']).map(arrangement=>Object.freeze({key:style+':'+arrangement,style,arrangement,number,name:s.name,label:String(number).padStart(2,'0')+(arrangement==='U'?'':'-'+arrangement),source:s.source||'P4 / V1',position:s.position||null}));
}));
const byKey=new Map(choices.map(e=>[e.key,e]));
const alias=new Map(groups.map(g=>[g.secondary,g.primary]));
export function choice(key){const e=byKey.get(key);if(!e)throw new RangeError('Choix historique inconnu : '+key);return e;}
export function primaryKey(key){choice(key);return alias.get(key)||key;}
export function groupFor(key){choice(key);return groups.find(g=>g.primary===key||g.secondary===key)||null;}
export const ordinaryChoices=Object.freeze(choices.filter(e=>!alias.has(e.key)));
export function keyFromSelection(raw){
 if(!raw||typeof raw!=='object'||Array.isArray(raw)||!Object.hasOwn(styles,raw.style))throw new RangeError('Identifiant historique inconnu.');
 if(references[raw.style]&&raw.arrangement!==undefined&&!['G','D'].includes(raw.arrangement))throw new RangeError('Arrangement historique inconnu.');
 const state=normalize(raw),key=state.style+':'+(references[state.style]?state.arrangement:'U');choice(key);return key;
}
export function counterpart(key){const e=choice(key);return e.arrangement==='U'?null:choice(e.style+':'+(e.arrangement==='G'?'D':'G'));}
export function provenance(key){const e=choice(key);return {...e,documentID:'p5-'+String(e.number).padStart(3,'0'),documentURL:'https://github.com/Thsethse/Microcosme/blob/0d8cc1dccea821c14c35ac4addf46bafa753bc86/docs/ai/p5-doc/CATALOGUE.md#p5-'+String(e.number).padStart(3,'0')};}
