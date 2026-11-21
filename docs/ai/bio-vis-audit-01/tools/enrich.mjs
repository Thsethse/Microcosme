import{readFileSync,writeFileSync}from'node:fs';
import{createHash}from'node:crypto';
import{model,styles,controls,normalize}from'../../../../preview/bio-vis-p5-i6/model.mjs';
import{hairLayers}from'../../../../preview/bio-vis-p5-i6/hair.mjs';
import{layers}from'../../../../preview/bio-vis-p5-i6/i5/i4/i3/i2/i1/base/render.mjs';
import{character}from'../../../../preview/bio-vis-p5-i6/render.mjs';
import{priorityCase}from'../../../../preview/bio-vis-p5-i6/i5/i4/i3/i2/i1/base/r1/coverage.mjs';
const file=new URL('../data/generated.json',import.meta.url),d=JSON.parse(readFileSync(file));const sha=s=>createHash('sha256').update(s).digest('hex');
const counts={caps:{},coverageEnvelope:0,fixedForelock19:[],inputKeys:Object.keys(normalize()),accessories:[]};
const hFor=(e,extra={})=>{const p={style:e.style,arrangement:e.a,monochrome:true,accessories:false,contrast:false,...extra},m=model(p);return{m,h:m.reference?hairLayers(m,'audit'):layers(p)}};
const s19=hFor(d.entries.find(e=>e.key==='19-G')).h.front;
for(const e of d.entries){
 const{m,h}=hFor(e);e.cap=m.parameters.cut;counts.caps[e.cap]=(counts.caps[e.cap]||0)+1;
 if(h.volume?.includes('data-coverage="upper-cranium"'))counts.coverageEnvelope++;
 if(h.front?.includes(s19))counts.fixedForelock19.push(e.key);
 for(const k of['length','hairLength','density','volume','texture','fringe','part','hairColor','curliness'])if(k in normalize({style:e.style,[k]:123}))throw Error('Unexpected independent control '+k);
 const on=hFor(e,{monochrome:false,accessories:true}).h,off=hFor(e,{monochrome:false,accessories:false}).h;
 counts.accessories.push({key:e.key,separatePaths:(on.accessories?.match(/<(path|circle|ellipse)\b/g)||[]).length+(on.backAccessories?.match(/<(path|circle|ellipse)\b/g)||[]).length+(on.cover?.match(/<(path|circle|ellipse)\b/g)||[]).length,offPaths:(off.accessories?.match(/<(path|circle|ellipse)\b/g)||[]).length+(off.backAccessories?.match(/<(path|circle|ellipse)\b/g)||[]).length+(off.cover?.match(/<(path|circle|ellipse)\b/g)||[]).length,embeddedTiePaths:e.embeddedTiesRemoved});
 // Strip the same identified ties from all audit copies, never from the generator.
 e.originalViews=e.originalViews.map(s=>['pony','braids','side_braid'].includes(e.style)?s.replace(new RegExp('<path\\b[^>]*stroke-width="'+(e.style==='pony'?'4':'3\\.3')+'"[^>]*\\/>','g'),''):s);
}
writeFileSync(file,JSON.stringify(d));writeFileSync(new URL('../data/capabilities.json',import.meta.url),JSON.stringify(counts,null,2)+'\n');
const pairs=[['32-D','60-D'],['25-D','44-D'],['19-D','21-D'],['31-D','68-D']],members=[...new Set(pairs.flat())];
const states=[{name:'Neutre',values:{}},{name:'Cas iPad',values:priorityCase},...Object.entries(controls).flatMap(([k,c])=>[{name:k+' min',values:{[k]:c.min}},{name:k+' max',values:{[k]:c.max}}]),{name:'Tout min',values:Object.fromEntries(Object.entries(controls).map(([k,c])=>[k,c.min]))},{name:'Tout max',values:Object.fromEntries(Object.entries(controls).map(([k,c])=>[k,c.max]))},...Array.from({length:12},(_,i)=>({name:'Mix '+(i+1),values:Object.fromEntries(Object.entries(controls).map(([k,c],j)=>[k,c.min+(c.max-c.min)*(.5+.5*Math.sin((i+1)*.67+j*.91))]))}))];
const entries=members.flatMap(key=>{const e=d.entries.find(e=>e.key===key);return states.map((s,i)=>({key,state:i,svg:character({...s.values,style:e.style,arrangement:e.a,monochrome:true,accessories:false,contrast:false},{instance:'near-'+key+'-'+i}).replace(/viewBox="[^"]*"/,'viewBox="-40 -85 240 355"')}))});
writeFileSync(new URL('../data/near-states.json',import.meta.url),JSON.stringify({pairs,states,entries}));
console.log(JSON.stringify({caps:counts.caps,coverageEnvelope:counts.coverageEnvelope,forelock:counts.fixedForelock19,accessoryChoices:counts.accessories.filter(x=>x.separatePaths).length,embeddedTiePaths:counts.accessories.reduce((s,x)=>s+x.embeddedTiePaths,0),nearStates:states.length}));
