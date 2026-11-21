import {normalize as oldNormalize,model as oldModel} from './base/model.mjs';
import {styles,references,bodies,arrangements,geometryKey} from './catalogue.mjs';
export {styles,references,bodies,arrangements,geometryKey};
export {controls,presets,auditCases} from './base/model.mjs';
export function normalize(input={}){
 const style=input.style===undefined?'p5-019':input.style;
 if(!Object.hasOwn(styles,style))throw new RangeError('Coiffure inconnue : '+String(style));
 const arrangement=arrangements.includes(input.arrangement)?input.arrangement:'G';
 const baseStyle=references[style]?.bases[arrangement]||style;
 const p=oldNormalize({...input,style:baseStyle});
 return {...p,style,arrangement,accessories:input.accessories!==false&&!p.monochrome};
}
export function model(input={}){
 const state=normalize(input),ref=references[state.style],baseState={...state,style:ref?.bases[state.arrangement]||state.style};
 const m=oldModel(baseState);
 return {...m,state,baseState,reference:ref||null,geometryKey:ref?geometryKey(state.style,state.arrangement):state.style};
}
