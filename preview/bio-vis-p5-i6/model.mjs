import {normalize as priorNormalize,model as priorModel} from './i5/model.mjs';
import {normalize as baseNormalize,model as baseModel} from './i5/i4/i3/i2/i1/base/model.mjs';
import {styles,references,lotA,lotB,lotC,lotD,lotE,lotF,bodies,arrangements,geometryKey} from './catalogue.mjs';
export {styles,references,lotA,lotB,lotC,lotD,lotE,lotF,bodies,arrangements,geometryKey};
export {controls,presets,auditCases} from './i5/model.mjs';
export function normalize(input={}){
 const style=input.style===undefined?'p5-064':input.style;
 if(!Object.hasOwn(styles,style))throw new RangeError('Coiffure inconnue : '+String(style));
 if(!lotF[style])return priorNormalize({...input,style});
 const arrangement=arrangements.includes(input.arrangement)?input.arrangement:'G';
 const p=baseNormalize({...input,style:lotF[style].bases[arrangement]});
 return {...p,style,arrangement,accessories:input.accessories!==false&&!p.monochrome,contrast:input.contrast!==false};
}
export function model(input={}){
 const state=normalize(input);if(!lotF[state.style])return priorModel(state);
 const baseState={...state,style:lotF[state.style].bases[state.arrangement]},m=baseModel(baseState);
 return {...m,state,baseState,reference:lotF[state.style],geometryKey:geometryKey(state.style,state.arrangement)};
}
