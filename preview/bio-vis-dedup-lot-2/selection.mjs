import {normalize} from '../bio-vis-p5-i6/model.mjs';
import {keyFromSelection,primaryKey,choice,groupFor} from './catalogue.mjs';
const clone=raw=>JSON.parse(JSON.stringify(raw));
// raw is the historical payload. state is only the existing renderer's normalised view.
// No alias is ever written back into raw, nor passed to the renderer as a replacement.
export function restoreSelection(raw){
 const key=keyFromSelection(raw),copy=clone(raw);
 return {raw:copy,key,visibleKey:primaryKey(key),state:normalize(copy),group:groupFor(key)};
}
export function exportSelection(selection){return JSON.stringify(selection.raw,null,2);}
export function selectOrdinary(key,previous={}){
 if(primaryKey(key)!==key)throw new RangeError('Utiliser le contrôle historique pour un identifiant secondaire.');
 const e=choice(key);
 return restoreSelection({...clone(previous),style:e.style,arrangement:e.arrangement==='U'?'G':e.arrangement});
}
