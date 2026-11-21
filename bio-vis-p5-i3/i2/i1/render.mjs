import {character as oldCharacter,headGroup as oldHead} from './base/render.mjs';
import {bodyMarkup,headMarkup} from './base/r1/p2/base/render.mjs';
import {construction} from './base/r1/render.mjs';
import {model,normalize,references} from './model.mjs';
import {hairLayers} from './hair.mjs';
export {hairLayers};
export function headGroup(input={},options={}){
 const m=model(input);if(!m.reference)return oldHead(m.baseState,options);
 const h=hairLayers(m,options.instance||'head'),face=headMarkup(m.base).replace(/<path d="[^"]*"/,`<path d="${m.outline}"`);
 return `<g class="lot-head" data-reference="${m.state.style}" data-arrangement="${m.state.arrangement}">${['face','volume','front','sides','texture'].map(k=>`<g data-layer="${k}">${k==='face'?face:h[k]}</g>`).join('')}${options.construction?construction(m):''}</g>`;
}
export function character(input={},options={}){
 const state=normalize(input);if(!references[state.style])return oldCharacter(state,options);
 const m=model(state),long=m.reference.longArrangements.includes(state.arrangement),h=hairLayers(m,options.instance||((options.smallScale?'mini':options.headOnly?'head':'whole')+'-'+state.style+'-'+state.arrangement));
 const frame=options.headOnly?(long?'-10 -32 180 225':'0 -26 160 160'):'-26 -43 212 310';
 return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${frame}" role="img" aria-label="${m.reference.number} · ${m.reference.name} · arrangement ${state.arrangement}">${h.defs}<g data-layer="rear">${h.back}</g><g data-layer="accessories-back">${h.backAccessories}</g>${bodyMarkup(m.body)}${headGroup(state,{...options,instance:options.instance||((options.smallScale?'mini':options.headOnly?'head':'whole')+'-'+state.style+'-'+state.arrangement)})}<g data-layer="lengths">${h.lengths}</g><g data-layer="accessories">${h.accessories}</g></svg>`;
}
