import {character as historical} from '../preview/bio-vis-dedup-lot-3/render.mjs';
import {paint} from './paint.mjs';
import {swatch} from './palette.mjs';
export {hairLayers} from '../preview/bio-vis-dedup-lot-3/render.mjs';
// Colour is an explicit rendering option, independent of the historical payload.
export function character(input={},options={}){
 const colour=options.hairColor;
 if(colour===undefined||colour===null||colour==='historical')return historical(input,options);
 const p=swatch(colour);
 return paint(historical(input,options),input,p);
}
