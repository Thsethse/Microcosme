// A bounded token walk over the generator's frozen SVG syntax. Only existing
// fill/stroke values of hair shapes are replaced; original SVG bytes survive elsewhere.
import {layers as legacyLayers} from '../bio-vis-p5-i6/i5/i4/i3/i2/i1/base/render.mjs';
const hair=new Set(['rear','back','volume','front','sides','texture','lengths']);
const shapes=new Set(['path','circle','ellipse','rect','line','polyline','polygon']);
const attrs=s=>Object.fromEntries([...s.matchAll(/([\w:-]+)="([^"]*)"/g)].map(m=>[m[1],m[2]]));
export function protectedTies(input){
 if(!['pony','braids','side_braid'].includes(input.style))return new Set();
 const h=legacyLayers(input),width=input.style==='pony'?'4':'3.3',source=input.style==='pony'?h.back:h.lengths;
 return new Set([...source.matchAll(/<path\b[^>]*\/>/g)].map(m=>m[0]).filter(tag=>attrs(tag)['stroke-width']===width));
}
export function paint(svg,input,colour){
 const ties=protectedTies(input),stack=[];
 return svg.replace(/<\/?[\w:-]+\b[^>]*>/g,tag=>{
  if(tag.startsWith('</')){stack.pop();return tag;}
  const name=tag.match(/^<([\w:-]+)/)[1],a=attrs(tag),parent=stack.at(-1),layer=a['data-layer']||parent?.layer;
  const blocked=parent?.blocked||['defs','clipPath','mask','pattern','filter','marker'].includes(name);
  if(!tag.endsWith('/>'))stack.push({layer,blocked});
  if(blocked||!hair.has(layer)||!shapes.has(name)||ties.has(tag))return tag;
  return tag.replace(/(\s)(fill|stroke)="([^"]*)"/g,(match,space,key,value)=>value==='none'||value==='transparent'?match:`${space}${key}="${key==='fill'?colour.fill:colour.stroke}"`);
 });
}
