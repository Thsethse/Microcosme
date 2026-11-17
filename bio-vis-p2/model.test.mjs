import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {cuts,heads,model,normalize} from './hair-model.mjs';
import {character,headGroup,hairLayers,layerOrder} from './hair-render.mjs';
const hash=data=>createHash('sha256').update(data).digest('hex');
test('the unique catalogue is an intact PNG; P1 source snapshots remain exact',()=>{
 const ref=JSON.parse(readFileSync(new URL('./reference.json',import.meta.url))),png=readFileSync(new URL('../'+ref.path,import.meta.url));
 assert.equal(hash(png),ref.sha256);assert.equal(png.readUInt32BE(16),1536);assert.equal(png.readUInt32BE(20),1024);
 for(const file of ['model.mjs','render.mjs'])assert.equal(hash(readFileSync(new URL('./base/'+file,import.meta.url))),hash(readFileSync(new URL('../preview/bio-vis-p1/'+file,import.meta.url))));
});
test('exactly three catalogue cuts and three morphologies; invalid inputs fall back',()=>{
 assert.deepEqual(Object.keys(cuts),['classic','bob','curls']);assert.deepEqual(Object.keys(heads),['oval','round','pear']);
 assert.deepEqual(normalize({head:'bad',cut:'12',x:NaN}),{cut:'classic',head:'oval'});
});
test('all nine assemblies are finite, distinct, deterministic and share head markup across scales',()=>{
 const all=[];
 for(const cut of Object.keys(cuts))for(const head of Object.keys(heads)){
  const input={cut,head},g=model(input),layers=hairLayers(g),svg=character(input),group=headGroup(input);
  assert.doesNotMatch(svg,/NaN|Infinity|undefined/);assert.equal(svg,character(input));all.push(svg);
  assert.ok(svg.includes(group));assert.ok(character(input,{headOnly:true}).includes(group));
  for(const name of ['back','volume','front','texture'])assert.ok(layers[name].length>0);
  assert.ok(g.anchors.crown[1]<g.anchors.forehead[1]&&g.anchors.forehead[1]<g.base.anchors.browLeft[1]);
  assert.ok(g.anchors.cheekLeft[0]<g.base.anchors.eyeLeft[0]&&g.anchors.cheekRight[0]>g.base.anchors.eyeRight[0]);
 }
 assert.equal(new Set(all).size,9);
});
test('morphology changes preserve the cut and adapt zones independently of uniform scale',()=>{
 for(const cut of Object.keys(cuts)){
  const states=Object.keys(heads).map(head=>model({cut,head}));
  assert.ok(states.every(m=>m.parameters.cut===cut));
  assert.notEqual(states[1].fit.cap/states[0].fit.cap,states[1].fit.cheek/states[0].fit.cheek);
  assert.ok(states[2].fit.cheek>states[2].fit.rx);
 }
});
test('occlusion order is explicit and stable; layer isolation leaves the face visible',()=>{
 assert.deepEqual(layerOrder,['back','face','volume','front','sides','texture']);
 for(const cut of Object.keys(cuts)){
  const markup=headGroup({cut});let index=-1;
  for(const layer of layerOrder){const next=markup.indexOf(`data-layer="${layer}"`);assert.ok(next>index);index=next;}
  for(const isolate of layerOrder.filter(x=>x!=='face')){
   const isolated=headGroup({cut},{isolate});assert.match(isolated,/class="head-shape"/);assert.doesNotMatch(isolated,/NaN|undefined/);
  }
 }
});
