import {model,cuts} from './model.mjs';
import {bodyMarkup,headMarkup} from './p2/base/render.mjs';
import {hairLayers as sourceLayers,construction,layerOrder} from './source-render.mjs';
import {coverageCap} from './coverage.mjs';
export {construction,layerOrder};
export function hairLayers(m){
 const layers=sourceLayers(m);
 return {...layers,volume:coverageCap(m)};
}
export function headGroup(input={},options={}){
 const m=model(input),h=hairLayers(m),face=headMarkup(m.base).replace(/<path d="[^"]*"/,`<path d="${m.outline}"`);
 const blocks={back:h.back,face,volume:h.volume,front:h.front,sides:h.sides,texture:h.texture};
 return `<g class="p3-head" data-cut="${m.parameters.cut}">${layerOrder.map(name=>`<g data-layer="${name}">${options.isolate&&options.isolate!==name&&name!=='face'?'':blocks[name]}</g>`).join('')}${options.construction?construction(m):''}</g>`;
}
export function character(input={},options={}){
 const m=model(input),head=headGroup(input,options);
 return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${options.headOnly?'0 -20 160 155':'0 -20 160 290'}" role="img" aria-label="${cuts[m.parameters.cut].name}, recouvrement corrigé">${options.headOnly?'':bodyMarkup(m.base)}${head}</svg>`;
}
