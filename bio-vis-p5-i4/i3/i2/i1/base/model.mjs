import {model as r1Model,normalize as r1Normalize} from './r1/model.mjs';
import {geometry} from './r1/p2/base/model.mjs';
import {styles,bodies} from './catalogue.mjs';
export {styles,bodies};
export {controls,presets,auditCases} from './r1/model.mjs';
export function normalize(input={}){
 const style=Object.hasOwn(styles,input.style)?input.style:'classic';
 return {...r1Normalize({...input,cut:styles[style].cap}),style,body:Object.hasOwn(bodies,input.body)?input.body:'standard',monochrome:input.monochrome===true};
}
export function model(input={}){
 const p=normalize(input),style=styles[p.style],m=r1Model(p);
 // Preserve the complete R1 head model. Only hair pigment and body preset are added.
 if(style.kind!=='original')m.cut={...m.cut,...style};
 if(p.monochrome)m.cut={...m.cut,color:'#94612d',contour:'#69451f',light:'#b38344'};
 return {...m,state:p,style,body:geometry(bodies[p.body].values)};
}
