import {normalize as priorNormalize,model as priorModel} from './i2/model.mjs';
import {normalize as baseNormalize,model as baseModel} from './i2/i1/base/model.mjs';
import {styles,references,lotA,lotB,lotC,bodies,arrangements,geometryKey} from './catalogue.mjs';
export {styles,references,lotA,lotB,lotC,bodies,arrangements,geometryKey};
export {controls,presets,auditCases} from './i2/model.mjs';
export function normalize(input={}){
 const style=input.style===undefined?'p5-037':input.style;
 if(!Object.hasOwn(styles,style))throw new RangeError('Coiffure inconnue : '+String(style));
 if(!lotC[style])return priorNormalize({...input,style});
 const arrangement=arrangements.includes(input.arrangement)?input.arrangement:'G';
 const p=baseNormalize({...input,style:'classic'});
 return {...p,style,arrangement,accessories:input.accessories!==false&&!p.monochrome};
}
export function model(input={}){
 const state=normalize(input);if(!lotC[state.style])return priorModel(state);
 const baseState={...state,style:'classic'},m=baseModel(baseState);
 return {...m,state,baseState,reference:lotC[state.style],geometryKey:geometryKey(state.style,state.arrangement)};
}
