// Read-only audit of the pinned delivered generator. Writes only under this dossier.
import {createHash} from 'node:crypto';
import {readFileSync,writeFileSync,mkdirSync,readdirSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {execFileSync} from 'node:child_process';
import {styles,model,controls,normalize} from '../../../../preview/bio-vis-p5-i6/model.mjs';
import {hairLayers} from '../../../../preview/bio-vis-p5-i6/hair.mjs';
import {character} from '../../../../preview/bio-vis-p5-i6/render.mjs';
import {layers as originalLayers} from '../../../../preview/bio-vis-p5-i6/i5/i4/i3/i2/i1/base/render.mjs';
import {priorityCase} from '../../../../preview/bio-vis-p5-i6/i5/i4/i3/i2/i1/base/r1/coverage.mjs';
const out=new URL('../data/',import.meta.url),repo=new URL('../../../../',import.meta.url),runtime=new URL('../../../../preview/bio-vis-p5-i6/',import.meta.url);
const sha=s=>createHash('sha256').update(s).digest('hex');
const keys=Object.keys(controls),states=[{},priorityCase,...Array.from({length:256},(_,mask)=>Object.fromEntries(keys.map((k,i)=>[k,controls[k][mask&(1<<i)?'max':'min']]))),...Array.from({length:12},(_,i)=>Object.fromEntries(keys.map((k,j)=>[k,controls[k].min+(controls[k].max-controls[k].min)*(.5+.5*Math.sin((i+1)*.67+j*.91))])))];
const attrs=new Set(['d','points','cx','cy','r','rx','ry','x','y','width','height','transform','clip-path','clipPathUnits','fill-rule','clip-rule','stroke-width','stroke-linecap','stroke-linejoin','stroke-dasharray','id']);
function canonical(xml){
 const ids=new Map([...xml.matchAll(/<clipPath\b[^>]*id="([^"]+)"/g)].map((m,i)=>[m[1],'clip'+i]));
 for(const [a,b]of ids)xml=xml.replaceAll('id="'+a+'"','id="'+b+'"').replaceAll('url(#'+a+')','url(#'+b+')');
 let result='',stack=[];
 for(const m of xml.matchAll(/<([^>]+)>/g)){
  const tag=m[1],close=tag.startsWith('/'),name=tag.replace(/^\//,'').match(/^\w+/)?.[0];
  if(!name)continue;
  if(close){if(name==='g'){if(stack.pop())result+='</g>';}else result+='</'+name+'>';continue;}
  const all=[...tag.matchAll(/([\w-]+)="([^"]*)"/g)].map(m=>[m[1],m[2]]),a=all.filter(([k])=>attrs.has(k));
  if(name==='g'){
   const keep=a.some(([k])=>k==='clip-path'||k==='transform');stack.push(keep);if(!keep)continue;
  }
  if(['path','circle','ellipse','rect','polygon','polyline','line'].includes(name)){
   a.push(['fill',all.find(([k])=>k==='fill')?.[1]==='none'?'none':'ink']);
   a.push(['stroke',all.find(([k])=>k==='stroke')?.[1]==='none'||!all.some(([k])=>k==='stroke')?'none':'ink']);
  }
  result+='<'+name+a.sort(([a],[b])=>a.localeCompare(b)).map(([k,v])=>' '+k+'="'+v.replace(/,/g,' ').replace(/\s+/g,' ').trim()+'"').join('')+(tag.endsWith('/')?'/':'')+'>';
 }
 return result;
}
export function extract(entry,p={}){
 const input={...p,style:entry.style,arrangement:entry.a,body:'standard',monochrome:true,accessories:false,contrast:false},m=model(input),h={...(m.reference?hairLayers(m,'audit'):originalLayers(input))};
 const removed=[];
 // Existing P4 has non-removable ties in the hair markup: remove only identified tie strokes in audit copies.
 if(entry.style==='pony')h.back=h.back.replace(/<path\b[^>]*stroke-width="4"[^>]*\/>/g,v=>{removed.push(v);return ''});
 if(['braids','side_braid'].includes(entry.style))h.lengths=h.lengths.replace(/<path\b[^>]*stroke-width="3\.3"[^>]*\/>/g,v=>{removed.push(v);return ''});
 const parts=['back','volume','front','sides','texture','lengths'].map(k=>'<g>'+String(h[k]||'')+'</g>').join('');
 return {m,h,removed,canonical:canonical((h.defs||'')+parts),input};
}
const entries=[];
for(const [i,[style,s]]of Object.entries(styles).entries()){
 const number=s.number||i+1;
 for(const a of s.number?['G','D']:['U'])entries.push({key:String(number).padStart(2,'0')+(a==='U'?'':'-'+a),number,style,a,name:s.name,status:s.unknownArrangements?.includes(a)?'unknown':s.partialArrangements?.includes(a)?'partial':'known'});
}
for(const [i,e]of entries.entries()){
 const roll=createHash('sha256');let neutral,flags=[];
 for(const [j,p]of states.entries()){
  const x=extract(e,p);roll.update(x.canonical+'\0');
  if(!j){neutral=x;e.neutralHash=sha(x.canonical);}
  if(/NaN|Infinity|undefined/.test(x.canonical))flags.push(j);
 }
 const {m,h,removed,input}=neutral;e.geometryHash=roll.digest('hex');e.base=m.baseState?.style||m.style.id;e.geometryKey=m.geometryKey||e.style;e.policy=h.policy||{};
 e.paths=Object.fromEntries(['back','volume','front','sides','texture','lengths'].map(k=>[k,(h[k]?.match(/<path\b/g)||[]).length]));
 e.features=[...new Set([...(Object.values(h).filter(v=>typeof v==='string').join('').matchAll(/data-feature="([^"]+)"/g))].map(m=>m[1]))];e.embeddedTiesRemoved=removed.length;
 let svg=character(input,{instance:'audit-'+e.key});for(const x of removed)svg=svg.replace(x,'');
 e.svg=svg.replace(/viewBox="[^"]*"/,'viewBox="-40 -85 240 355"');e.originalViews=[{},{headOnly:true},{headOnly:true,smallScale:true}].map(options=>removed.reduce((s,t)=>s.replace(t,''),character(input,{...options,instance:'scale-'+e.key})));
 if(flags.length)throw new Error(e.key+' invalid SVG states '+flags);
 if(i%18===0)console.log('Collected',i+1,'/',entries.length);
}
const observable=entries.filter(e=>e.status!=='unknown'),groups=key=>Object.values(Object.groupBy(observable,e=>e[key])).map(g=>g.map(e=>e.key));
const files=[];function walk(u,prefix=''){for(const d of readdirSync(u,{withFileTypes:true})){const name=prefix+d.name;if(d.isDirectory())walk(new URL(d.name+'/',u),name+'/');else files.push({path:name,sha256:sha(readFileSync(new URL(d.name,u)))});}}walk(runtime);
const result={runtime:'preview/bio-vis-p5-i6',runtimeCommit:'4fb938ac3e7d4cbd76f1f05b9cd0ec67cdae86f5',codeCommit:'6d476dc13b53647d561d8ea97bfd9ec93c470450',documentCommit:'0d8cc1dccea821c14c35ac4addf46bafa753bc86',controls,states:states.length,stateDescription:'neutral + priority + 256 corners + 12 deterministic mixtures',counts:{references:Object.keys(styles).length,arrangements:entries.length,known:entries.filter(e=>e.status==='known').length,partial:entries.filter(e=>e.status==='partial').length,unknown:entries.filter(e=>e.status==='unknown').length,technical:groups('geometryHash').length,neutralTechnical:groups('neutralHash').length},groups:groups('geometryHash'),entries,files};
mkdirSync(out,{recursive:true});writeFileSync(new URL('generated.json',out),JSON.stringify(result));writeFileSync(new URL('source-manifest.json',out),JSON.stringify(files,null,2)+'\n');
console.log(JSON.stringify(result.counts));console.log('Exact technical groups:',JSON.stringify(result.groups.filter(g=>g.length>1)));
