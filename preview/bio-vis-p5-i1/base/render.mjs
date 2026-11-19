import {character as p4Character,layers} from './p4-render.mjs';
import {normalize} from './model.mjs';
export {layers,headGroup} from './p4-render.mjs';
const details=new Set(['braids','waist_waves']);
export function character(input={},options={}){
 const svg=p4Character(input,options),state=normalize(input);
 // Preserve every full-body render, all small-scale renders and the other 16 portraits.
 if(!options.headOnly||options.smallScale||!details.has(state.style))return svg;
 // The very same front-length paths used on the full body, with the same stacking order.
 // Include complete plaits and the upper waves; lower waist tips remain outside this close-up.
 return svg.replace(/viewBox="[^"]*"/,'viewBox="0 0 160 205"')
  .replace('</svg>',`<g data-layer="lengths">${layers(input).lengths}</g></svg>`);
}
