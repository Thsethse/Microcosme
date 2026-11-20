import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {styles,bodies,controls,model} from './model.mjs';
import {character,layers} from './render.mjs';
import {character as before} from './p4-render.mjs';
const keys=Object.keys(controls),states=Array.from({length:256},(_,mask)=>Object.fromEntries(keys.map((k,i)=>[k,controls[k][mask&(1<<i)?'max':'min']])));
test('base P4 publiée conservée à l’identique, géométrie, paramètres, ancrages et références inchangés',()=>{
 for(const file of ['model.mjs','catalogue.mjs','r1/model.mjs','r1/render.mjs','r1/coverage.mjs','r1/source-render.mjs','r1/p2/hair-model.mjs','r1/p2/hair-render.mjs','r1/p2/base/model.mjs','r1/p2/base/render.mjs','references/inhabitants.png','references/catalogue-v1.png'])assert.deepEqual(readFileSync(new URL(file,import.meta.url)),readFileSync(new URL('../preview/bio-vis-p4/'+file,import.meta.url)),file);
 assert.deepEqual(readFileSync(new URL('p4-render.mjs',import.meta.url)),readFileSync(new URL('../preview/bio-vis-p4/render.mjs',import.meta.url)));
 assert.equal(Object.keys(styles).length,18);assert.equal(keys.length,8);assert.equal(Object.keys(bodies).length,6);
});
test('4 608 états extrêmes : personnages entiers et miniatures identiques à P4, 16 autres gros plans inchangés',()=>{
 for(const style of Object.keys(styles))for(const values of states){
  const p={...values,style};
  assert.equal(character(p),before(p));
  assert.equal(character(p,{headOnly:true,smallScale:true}),before(p,{headOnly:true}));
  if(!['braids','waist_waves'].includes(style))assert.equal(character(p,{headOnly:true}),before(p,{headOnly:true}));
 }
});
test('512 gros plans corrigés réutilisent exactement toutes les longueurs du personnage entier',()=>{
 for(const style of ['braids','waist_waves'])for(const values of states){
  const p={...values,style},close=character(p,{headOnly:true});
  assert.ok(close.endsWith(`<g data-layer="lengths">${layers(p).lengths}</g></svg>`));
  assert.ok(!before(p,{headOnly:true}).includes('data-layer="lengths"'));
  assert.ok(close.includes('viewBox="0 0 160 205"'));
  assert.ok(!/NaN|Infinity|undefined/.test(close));
  // No new body or facial model: the original P4 head group remains verbatim.
  const m=model(p);assert.deepEqual(m.anchors,model({...p,body:'bust'}).anchors);
 }
});
