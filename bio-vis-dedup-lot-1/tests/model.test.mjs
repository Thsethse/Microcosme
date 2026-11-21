import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {styles,model,controls,auditCases,bodies} from '../../preview/bio-vis-p5-i6/model.mjs';
import {character as before} from '../../preview/bio-vis-p5-i6/render.mjs';
import {hairLayers as oldLayers} from '../../preview/bio-vis-p5-i6/hair.mjs';
import {character} from '../render.mjs';
import {hairLayers,targets} from '../hair.mjs';
import {priorityCase} from '../../preview/bio-vis-p5-i6/i5/i4/i3/i2/i1/base/r1/coverage.mjs';
const axes=Object.keys(controls),corners=Array.from({length:256},(_,mask)=>Object.fromEntries(axes.map((k,i)=>[k,controls[k][mask&(1<<i)?'max':'min']])));
export const states=[{},priorityCase,...corners,...Array.from({length:12},(_,i)=>Object.fromEntries(axes.map((k,j)=>[k,controls[k].min+(controls[k].max-controls[k].min)*(.5+.5*Math.sin((i+1)*.67+j*.91))])))];
const options=[{},{headOnly:true},{headOnly:true,smallScale:true}],targetStates=targets.map(k=>{const [style,arrangement]=k.split(':');return {style,arrangement};});
function layer(s,name){const start=s.indexOf(`<g data-layer="${name}">`);if(start<0)return '';let depth=0;for(const m of s.slice(start).matchAll(/<g\b[^>]*>|<\/g>/g)){depth+=m[0].startsWith('</')?-1:1;if(depth===0)return s.slice(start,start+m.index+m[0].length);}throw Error('unclosed '+name);}
const paths=s=>[...s.matchAll(/ d="([^"]+)"/g)].map(m=>[...m[1].matchAll(/-?\d+(?:\.\d+)?(?:e[-+]?\d+)?/gi)].map(v=>+v[0]));
test('P5-I6 : 93 fichiers inchangés, 72 références et 126 choix, aucun identifiant retiré',()=>{
 const manifest=JSON.parse(readFileSync(new URL('./baseline-manifest.json',import.meta.url)));
 assert.equal(manifest.length,93);for(const f of manifest)assert.equal(createHash('sha256').update(readFileSync(new URL('../../preview/bio-vis-p5-i6/'+f.path,import.meta.url))).digest('hex'),f.sha256,f.path);
 assert.equal(Object.keys(styles).length,72);assert.equal(Object.values(styles).reduce((n,s)=>n+(s.number?2:1),0),126);assert.equal(targets.length,4);
});
test('122 choix hors cible identiques octet pour octet aux trois vues, 22 morphologies et deux états accessoires',()=>{
 let checked=0;for(const [style,s]of Object.entries(styles))for(const arrangement of s.number?['G','D']:['G']){
  if(targets.includes(style+':'+arrangement))continue;checked++;
  for(const p of [...auditCases().map(c=>c.values),priorityCase])for(const accessories of [false,true])for(const o of options){const input={...p,style,arrangement,accessories};assert.equal(character(input,o),before(input,o),style+arrangement);}
 }assert.equal(checked,122);
});
test('1 080 états cibles : SVG finis, déterminisme, corps/visage inchangés aux trois vues',()=>{
 for(const state of targetStates)for(const p of states){const input={...p,...state,monochrome:true},a=character(input),b=before(input);
  assert.equal(layer(a,'face'),layer(b,'face'));assert.notEqual(a,b);assert.equal(a,character(input));
  for(const o of options){const svg=character(input,o);assert(!/NaN|Infinity|undefined/.test(svg));for(const ns of paths(svg))assert(ns.every(Number.isFinite));assert.equal(layer(svg,'lengths'),layer(a,'lengths'));}
 }
});
test('accessoires, queue haute et chignon arrière hérités préservés, aucune propagation vers 68-D',()=>{
 for(const state of targetStates)for(const p of states)for(const accessories of [false,true]){
  const m=model({...p,...state,accessories}),a=hairLayers(m,'same'),b=oldLayers(m,'same');
  for(const k of ['accessories','backAccessories','defs','color','cover'])assert.equal(a[k],b[k],state.style+state.arrangement+k);
  if(!(state.style==='p5-058'&&state.arrangement==='G'))assert.equal(a.back,b.back,'rear unchanged');
  if(state.style==='p5-068')assert.equal(a.volume,b.volume,'cap unchanged');
 }
 for(const p of states)for(const o of options)assert.equal(character({...p,style:'p5-068',arrangement:'D'},o),before({...p,style:'p5-068',arrangement:'D'},o));
});
test('une identité de forme propre pour les quatre cibles, ancrages non mutés et six corps',()=>{
 for(const p of states)for(const state of targetStates){const m=model({...p,...state}),anchors=structuredClone({skin:m.anchors,hair:m.hairAnchors}),h=hairLayers(m);assert.notEqual(h.front,oldLayers(m).front);assert.deepEqual({skin:m.anchors,hair:m.hairAnchors},anchors);}
 for(const body of Object.keys(bodies))for(const state of targetStates){const input={...state,body};const a=character(input),b=before(input);const bodyA=a.match(/<g class="body-shape">[\s\S]*?<\/g>/)?.[0],bodyB=b.match(/<g class="body-shape">[\s\S]*?<\/g>/)?.[0];assert(bodyA);assert.equal(bodyA,bodyB);}
});
test('continuité numérique locale sur huit axes, 21 positions, sans changement de topologie',()=>{
 let largestDelta=0;for(const state of targetStates)for(const key of axes)for(let i=0;i<=20;i++){
  const v=controls[key].min+(controls[key].max-controls[key].min)*i/20,a=paths(character({...state,[key]:v})),b=paths(character({...state,[key]:v+1e-6}));assert.equal(a.length,b.length);
  for(let j=0;j<a.length;j++){assert.equal(a[j].length,b[j].length);for(let k=0;k<a[j].length;k++){const delta=Math.abs(a[j][k]-b[j][k]);largestDelta=Math.max(largestDelta,delta);assert(delta<.001,'numeric discontinuity');}}
 }console.log('Continuity: perturbation 1e-6, largest coordinate delta',largestDelta,'SVG units; numeric guard .001, not an artistic score.');
});
