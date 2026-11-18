import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {model,controls,cuts} from './model.mjs';
import {hairLayers,character} from './render.mjs';
import {hairLayers as beforeLayers,character as beforeCharacter} from './source-render.mjs';
import {coverageCap,scalpSamples,halfWidthAt,priorityCase} from './coverage.mjs';
const hash=file=>createHash('sha256').update(readFileSync(new URL(file,import.meta.url))).digest('hex');
test('face, normalized controls, anchors, source renderer and P2 geometry are unchanged copies',()=>{
 for(const file of ['model.mjs','p2/hair-model.mjs','p2/hair-render.mjs','p2/base/model.mjs','p2/base/render.mjs'])assert.equal(hash('./'+file),hash('../preview/bio-vis-p3/'+file));
 assert.equal(hash('./source-render.mjs'),hash('../preview/bio-vis-p3/render.mjs'));
});
test('only the upper-volume layer changes, including the exact iPad reproduction',()=>{
 const keys=Object.keys(controls);
 for(const cut of Object.keys(cuts))for(let mask=0;mask<256;mask++){
  const m=model({cut,...Object.fromEntries(keys.map((k,i)=>[k,controls[k][mask&(1<<i)?'max':'min']]))}),old=beforeLayers(m),next=hairLayers(m);
  for(const layer of ['back','front','sides','texture'])assert.equal(next[layer],old[layer]);
  const face=s=>s.split('data-layer="face">')[1].split('<g data-layer="volume">')[0];
  assert.equal(face(character(m.parameters)),face(beforeCharacter(m.parameters)));
  assert.notEqual(next.volume,old.volume);assert.doesNotMatch(next.volume,/NaN|Infinity|undefined/);
  for(const p of scalpSamples(m))assert.ok(Number.isFinite(p.x)&&Number.isFinite(p.y)&&Math.abs(Math.hypot(p.nx,p.ny)-1)<1e-10);
 }
 const m=model(priorityCase);assert.equal(m.parameters.cut,'bob');assert.ok(halfWidthAt(m,m.fit.forehead+2)>0);assert.ok(coverageCap(m).includes('data-coverage="upper-cranium"'));
});
test('intermediate combined deformations preserve continuous cap coordinates and positive side clearance',()=>{
 const keys=Object.keys(controls),nums=s=>[...s.matchAll(/-?\d+(?:\.\d+)?(?:e[-+]?\d+)?/gi)].map(m=>Number(m[0]));
 for(const cut of Object.keys(cuts)){
  let previous;
  for(let step=0;step<=200;step++){
   const t=step/200,m=model({cut,...Object.fromEntries(keys.map(k=>[k,controls[k].min+(controls[k].max-controls[k].min)*t]))});
   const current=nums(coverageCap(m));assert.ok(current.every(Number.isFinite));
   if(previous){assert.equal(current.length,previous.length);assert.ok(current.every((x,i)=>Math.abs(x-previous[i])<1));}
   previous=current;
  }
 }
});
