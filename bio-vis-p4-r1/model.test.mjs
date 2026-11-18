import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {styles,bodies,controls,normalize,model} from './model.mjs';
import {character,headGroup,layers} from './render.mjs';
import {model as r1Model} from './r1/model.mjs';
import {headGroup as r1Head} from './r1/render.mjs';
import {coverageCap,priorityCase} from './r1/coverage.mjs';
const keys=Object.keys(controls),numbers=s=>[...s.matchAll(/-?\d+(?:\.\d+)?(?:e[-+]?\d+)?/gi)].map(x=>+x[0]);
const corner=mask=>Object.fromEntries(keys.map((k,i)=>[k,controls[k][mask&(1<<i)?'max':'min']]));
test('12 modèles V1 uniques et six explorations distinctes, identifiables sans leur couleur',()=>{
 assert.equal(Object.keys(styles).length,18);assert.deepEqual(Object.values(styles).filter(s=>s.v1).map(s=>s.v1),Array.from({length:12},(_,i)=>i+1));
 const signatures=Object.keys(styles).map(style=>[...character({style,monochrome:true}).matchAll(/ d="([^"]+)"/g)].map(x=>x[1]).join('|'));
 assert.equal(new Set(signatures).size,18);assert.equal(Object.keys(bodies).length,6);
});
test('snapshot du moteur R1 et des références artistiques vérifié octet par octet',()=>{
 for(const file of ['model.mjs','render.mjs','coverage.mjs','source-render.mjs','p2/hair-model.mjs','p2/hair-render.mjs','p2/base/model.mjs','p2/base/render.mjs'])assert.deepEqual(readFileSync(new URL('./r1/'+file,import.meta.url)),readFileSync(new URL('../preview/bio-vis-p3-r1/'+file,import.meta.url)),file);
 for(const [file,hash]of [['inhabitants.png','ddb6a8515fcedd0bdc4493bdc3fe3afb32322706012186f481efa764875c3e06'],['catalogue-v1.png','06dec2e59f34f195363cf482d51cae34808d4d3b3ff1e8863e8ba217bf571932']])assert.equal(createHash('sha256').update(readFileSync(new URL('./references/'+file,import.meta.url))).digest('hex'),hash);
});
test('4 608 combinaisons extrêmes : tracés finis, ancrages et calotte corrigée inchangés',()=>{
 let count=0;
 for(const style of Object.keys(styles))for(let mask=0;mask<256;mask++){
  const p={...corner(mask),style},m=model(p),r=r1Model({...p,cut:styles[style].cap}),svg=character(p);
  assert.deepEqual(m.anchors,r.anchors);assert.deepEqual(m.hairAnchors,r.hairAnchors);assert.equal(m.outline,r.outline);
  assert.ok(!/NaN|Infinity|undefined/.test(svg),style+' '+mask);
  const topology=s=>[...s.matchAll(/ d="([^"]+)"/g)].map(x=>numbers(x[1]).length);
  assert.deepEqual(topology(svg),topology(character({style})),style+' extreme topology');
  for(const match of svg.matchAll(/ d="([^"]+)"/g)){assert.ok(numbers(match[1]).every(Number.isFinite));assert.ok(!/[^MmLlHhVvQqCcSsTtAaZzEe\d+.,\s-]/.test(match[1]));}
  if(style!=='shaved')assert.equal(layers(p).volume,coverageCap(m));else assert.equal(layers(p).volume,'');
  if(styles[style].kind==='original')assert.equal(headGroup(p),r1Head({...p,cut:style}));
  count++;
 }assert.equal(count,4608);
});
test('déformations continues : topologie stable et déplacements bornés sur 8 axes',()=>{
 for(const style of Object.keys(styles))for(const key of keys)for(let i=0;i<=40;i++){
  const value=controls[key].min+(controls[key].max-controls[key].min)*i/40;
  const a=character({style,[key]:value}),b=character({style,[key]:value+1e-6});
  const paths=s=>[...s.matchAll(/ d="([^"]+)"/g)].map(x=>numbers(x[1]));
  const aa=paths(a),bb=paths(b);assert.equal(aa.length,bb.length,style+' '+key);
  for(let j=0;j<aa.length;j++){
   assert.equal(aa[j].length,bb[j].length,style+' '+key+' topology');
   for(let k=0;k<aa[j].length;k++)assert.ok(Math.abs(aa[j][k]-bb[j][k])<.01,style+' '+key+' discontinuity');
  }
 }
});
test('le corps ne déplace ni la tête ni les points d’ancrage, y compris dans le cas iPad',()=>{
 for(const style of Object.keys(styles))for(const body of Object.keys(bodies)){
  const p={...priorityCase,style,body},a=model(p),b=model({...p,body:'standard'});
  assert.deepEqual(a.anchors,b.anchors);assert.deepEqual(a.hairAnchors,b.hairAnchors);assert.equal(headGroup(p),headGroup({...p,body:'standard'}));
  assert.equal(layers(p).lengths,layers({...p,body:'standard'}).lengths);
 }
 assert.deepEqual(normalize({skull_width:Infinity,style:'oops',body:'oops'}),normalize());
});
