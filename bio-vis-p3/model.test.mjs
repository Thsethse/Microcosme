import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {model,normalize,controls,cuts,presets,auditCases} from './model.mjs';
import {character,hairLayers,layerOrder} from './render.mjs';
const keys=Object.keys(controls),hash=s=>createHash('sha256').update(s).digest('hex');
const numbers=s=>[...s.matchAll(/-?\d+(?:\.\d+)?(?:e[-+]?\d+)?/gi)].map(m=>Number(m[0]));
test('P2 snapshots and the three catalogue identities remain unchanged',()=>{
 for(const file of ['hair-model.mjs','hair-render.mjs','base/model.mjs','base/render.mjs'])assert.equal(hash(readFileSync(new URL('./p2/'+file,import.meta.url))),hash(readFileSync(new URL('../preview/bio-vis-p2/'+file,import.meta.url))));
 assert.deepEqual(Object.keys(cuts),['classic','bob','curls']);assert.equal(keys.length,8);
});
test('eight normalized controls: minimum/neutral/maximum and invalid inputs',()=>{
 for(const [key,c]of Object.entries(controls)){
  assert.equal(normalize()[key],1);assert.equal(normalize({[key]:-100})[key],c.min);assert.equal(normalize({[key]:100})[key],c.max);
  for(const v of [NaN,Infinity,null,'1'])assert.equal(normalize({[key]:v})[key],1);
 }
 assert.equal(normalize({cut:'alien'}).cut,'classic');
});
test('all 768 combined corner cases: deterministic finite geometry, stable layers and landmarks',()=>{
 assert.deepEqual(layerOrder,['back','face','volume','front','sides','texture']);
 for(const cut of Object.keys(cuts))for(let mask=0;mask<256;mask++){
  const p={cut,...Object.fromEntries(keys.map((k,i)=>[k,controls[k][mask&(1<<i)?'max':'min']]))};
  const m=model(p),svg=character(p);
  assert.equal(svg,character(p));assert.doesNotMatch(svg,/NaN|Infinity|undefined/);assert.ok(numbers(svg).every(Number.isFinite));
  assert.deepEqual(m.parameters,normalize(p));
  assert.ok(m.anchors.crown[1]<m.anchors.hairline[1]);assert.ok(m.anchors.hairline[1]<m.base.anchors.browLeft[1]-7);
  assert.ok(m.base.anchors.eyeLeft[1]<m.base.anchors.nose[1]&&m.base.anchors.nose[1]<m.base.anchors.mouth[1]&&m.base.anchors.mouth[1]<m.anchors.chin[1]);
  assert.equal(m.anchors.cheekLeft[0]+m.anchors.cheekRight[0],160);
  let at=-1;for(const layer of layerOrder){const next=svg.indexOf(`data-layer="${layer}"`);assert.ok(next>at);at=next}
 }
});
test('all controls deform the actual face; local changes preserve unrelated landmarks and the cut',()=>{
 const original=model();
 for(const [key,c]of Object.entries(controls)){
  const m=model({[key]:c.max,cut:'bob'});assert.notEqual(character({[key]:c.max}),character(),key);assert.equal(m.parameters.cut,'bob');
 }
 for(const key of ['forehead_width','forehead_height','temple_width','cheek_width','jowls','jaw_width'])assert.deepEqual(model({[key]:controls[key].max}).anchors.crown,original.anchors.crown);
 for(const key of ['cheek_width','jowls','jaw_width']){
  const m=model({[key]:controls[key].max});assert.deepEqual(m.anchors.hairline,original.anchors.hairline);assert.deepEqual(m.anchors.templeLeft,original.anchors.templeLeft);
  // A short cut that does not reach the cheek or jaw should stay in place.
  assert.deepEqual(hairLayers(m),hairLayers(original));
 }
});
test('hairline height and width respond; bob passage responds to cheeks and jaw',()=>{
 for(const cut of Object.keys(cuts))for(const key of ['skull_width','skull_height','forehead_width','forehead_height','temple_width']){
  assert.notDeepEqual(hairLayers(model({cut,[key]:controls[key].max})),hairLayers(model({cut})),cut+' '+key);
 }
 for(const key of ['cheek_width','jowls','jaw_width'])assert.notDeepEqual(hairLayers(model({cut:'bob',[key]:controls[key].max})),hairLayers(model({cut:'bob'})),key);
});
test('progressive deformation has bounded, continuous anchor and control-point motion',()=>{
 for(const cut of Object.keys(cuts))for(const key of keys){
  let previous;
  for(let i=0;i<=120;i++){
   const value=controls[key].min+(controls[key].max-controls[key].min)*i/120,m=model({cut,[key]:value});
   const current=[...Object.values(m.anchors).flat(),...Object.values(m.hairAnchors).flat(),...numbers(m.outline),...numbers(Object.values(hairLayers(m)).join(''))];
   if(previous){assert.equal(current.length,previous.length);assert.ok(current.every((v,j)=>Math.abs(v-previous[j])<.7),cut+' '+key+' step '+i)}
   previous=current;
  }
 }
});
test('combined interpolation and preset values preserve normalized state and shared head',()=>{
 for(const cut of Object.keys(cuts)){
  for(let i=0;i<=50;i++){
   const p={cut,...Object.fromEntries(keys.map(k=>[k,controls[k].min+(controls[k].max-controls[k].min)*i/50]))};
   const a=character(p),b=character(p,{headOnly:true});assert.equal(a.split('class="p3-head"')[1],b.split('class="p3-head"')[1]);
  }
  for(const p of Object.values(presets))assert.equal(model({cut,...p.values}).parameters.cut,cut);
 }
 assert.equal(auditCases().length,21);
});
