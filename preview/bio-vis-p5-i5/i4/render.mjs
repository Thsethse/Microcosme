import {character as priorCharacter,headGroup as priorHead} from './i3/render.mjs';
import {bodyMarkup,headMarkup} from './i3/i2/i1/base/r1/p2/base/render.mjs';
import {construction} from './i3/i2/i1/base/r1/render.mjs';
import {model,normalize,lotD} from './model.mjs';
import {hairLayers} from './hair.mjs';
export {hairLayers};
export function headGroup(input={},options={}){
 const m=model(input);if(!lotD[m.state.style])return priorHead(m.state,options);
 const h=hairLayers(m,options.instance||'head'),face=headMarkup(m.base).replace(/<path d="[^"]*"/,`<path d="${m.outline}"`);
 return `<g class="lot-head" data-reference="${m.state.style}" data-arrangement="${m.state.arrangement}">${['face','volume','front','sides','color','texture'].map(k=>`<g data-layer="${k}">${k==='face'?face:h[k]}</g>`).join('')}${options.construction?construction(m):''}</g>`;
}
export function character(input={},options={}){
 const state=normalize(input);if(!lotD[state.style])return priorCharacter(state,options);
 const instance=options.instance||((options.smallScale?'mini':options.headOnly?'head':'whole')+'-'+state.style+'-'+state.arrangement);
 const m=model(state),h=hairLayers(m,instance),long=m.reference.longArrangements.includes(state.arrangement);
 // Include complete front braids/curls and high rolls at all three scales.
 const frame=options.headOnly?(long?'-36 -80 232 302':'-36 -80 232 228'):'-36 -80 232 347';
 return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${frame}" role="img" aria-label="${m.reference.number} · ${m.reference.name} · arrangement ${state.arrangement}">${h.defs}<g data-layer="rear">${h.back}</g><g data-layer="accessories-back">${h.backAccessories}</g>${bodyMarkup(m.body)}${headGroup(state,{...options,instance})}<g data-layer="lengths">${h.lengths}</g><g data-layer="accessories">${h.accessories}</g></svg>`;
}
