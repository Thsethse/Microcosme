import {normalize as priorNormalize,model as priorModel} from './i4/model.mjs';
import {normalize as baseNormalize,model as baseModel} from './i4/i3/i2/i1/base/model.mjs';
import {styles,references,lotA,lotB,lotC,lotD,lotE,bodies,arrangements,geometryKey} from './catalogue.mjs';
export {styles,references,lotA,lotB,lotC,lotD,lotE,bodies,arrangements,geometryKey};
export {controls,presets,auditCases} from './i4/model.mjs';
export function normalize(input={}){
 const style=input.style===undefined?'p5-055':input.style;
 if(!Object.hasOwn(styles,style))throw new RangeError('Coiffure inconnue : '+String(style));
 if(!lotE[style])return priorNormalize({...input,style});
 const arrangement=arrangements.includes(input.arrangement)?input.arrangement:'G';
 const p=baseNormalize({...input,style:lotE[style].bases[arrangement]});
 return {...p,style,arrangement,accessories:input.accessories!==false&&!p.monochrome,contrast:input.contrast!==false};
}
export function model(input={}){
 const state=normalize(input);if(!lotE[state.style])return priorModel(state);
 const baseState={...state,style:lotE[state.style].bases[state.arrangement]},m=baseModel(baseState);
 return {...m,state,baseState,reference:lotE[state.style],geometryKey:geometryKey(state.style,state.arrangement)};
}
