import {character as beforeCharacter} from '../bio-vis-p5-i6/render.mjs';
import {model,normalize} from '../bio-vis-p5-i6/model.mjs';
import {bodyMarkup,headMarkup} from '../bio-vis-p5-i6/i5/i4/i3/i2/i1/base/r1/p2/base/render.mjs';
import {construction} from '../bio-vis-p5-i6/i5/i4/i3/i2/i1/base/r1/render.mjs';
import {hairLayers,isTarget} from './hair.mjs';
export {hairLayers};
export function character(input={},options={}){
 const state=normalize(input),m=model(state);
 if(!isTarget(m))return beforeCharacter(input,options);
 const instance=options.instance||'lot1-'+state.style+'-'+state.arrangement,h=hairLayers(m,instance);
 const face=headMarkup(m.base).replace(/<path d="[^"]*"/,`<path d="${m.outline}"`);
 const frame=options.headOnly?'-35 -68 230 245':'-40 -85 240 355';
 return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${frame}" role="img" aria-label="${m.reference.number} · ${m.reference.name} · arrangement ${state.arrangement}">${h.defs||''}<g data-layer="rear">${h.back}</g><g data-layer="accessories-back">${h.backAccessories||''}</g>${bodyMarkup(m.body)}<g class="lot-head" data-reference="${state.style}" data-arrangement="${state.arrangement}">${['face','volume','front','sides','color','texture'].map(k=>`<g data-layer="${k}">${k==='face'?face:h[k]||''}</g>`).join('')}${options.construction?construction(m):''}</g><g data-layer="accessories-cover">${h.cover||''}</g><g data-layer="lengths">${h.lengths||''}</g><g data-layer="accessories">${h.accessories||''}</g></svg>`;
}
