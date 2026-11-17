import {test} from 'node:test';
import assert from 'node:assert/strict';
import {normalize,geometry,choices,bounds,presets,hopPose} from './model.mjs';
import {bodyMarkup,headMarkup,character} from './render.mjs';
test('invalid values clamp or fall back; foreign fields discarded',()=>{
 const safe=normalize({belly:20,hips:-5,shoulders:NaN,head:'<script>',unknown:true});
 assert.equal(safe.belly,bounds.belly[1]);assert.equal(safe.hips,bounds.hips[0]);
 assert.equal(safe.shoulders,1);assert.equal(safe.head,'triangle');assert.ok(!('unknown'in safe));
});
test('all silhouettes, heads and width extremes: finite, ordered, deterministic, anchored',()=>{
 for(const silhouette of choices.silhouette)for(const head of choices.head)for(let mask=0;mask<8;mask++){
  const input={silhouette,head,...Object.fromEntries(Object.entries(bounds).map(([k,range],i)=>[k,range[(mask>>i)&1]]))};
  const g=geometry(input),a=g.anchors;
  assert.ok(g.body.shoulders>0&&g.body.belly>0&&g.body.hips>0);
  assert.equal(a.eyeLeft[1],a.eyeRight[1]);assert.equal(a.eyeLeft[0]+a.eyeRight[0],160);
  assert.ok(a.eyeLeft[1]<a.nose[1]&&a.nose[1]<a.mouth[1]);
  for(const [x,y]of Object.values(a))assert.ok(x>g.head.cx-g.head.rx&&x<g.head.cx+g.head.rx&&y>g.head.cy-g.head.ry&&y<g.head.cy+g.head.ry);
  const svg=character(input);assert.doesNotMatch(svg,/NaN|Infinity|undefined/);assert.equal(svg,character(input));
 }
});
test('each morphology control changes the outline and preserves the facial anchors',()=>{
 for(const silhouette of choices.silhouette){
  const original=geometry({silhouette});
  for(const key of Object.keys(bounds)){
   const changed=geometry({silhouette,[key]:bounds[key][1]});
   assert.notEqual(bodyMarkup(changed),bodyMarkup(original),silhouette+' '+key);
   assert.deepEqual(changed.anchors,original.anchors);
  }
 }
});
test('the exact same head markup is embedded at both scales for every variant',()=>{
 for(const preset of presets){
  const markup=headMarkup(geometry(preset));
  assert.ok(character(preset).includes(markup));assert.ok(character(preset,{headOnly:true}).includes(markup));
  for(const [key,values]of Object.entries(choices))for(const value of values){
   const g=geometry({...preset,[key]:value});assert.doesNotMatch(headMarkup(g),/NaN|undefined|Infinity/);
  }
 }
 assert.equal(new Set(presets.map(p=>character(p))).size,presets.length);
});
test('face and grooming options have a visible effect in the same head frame',()=>{
 for(const key of ['head','eyes','nose','mouth','hair','age']){
  const outputs=choices[key].map(value=>headMarkup(geometry({[key]:value})));
  assert.equal(new Set(outputs).size,choices[key].length,key);
 }
});
test('hopping is deterministic, bounded and lands at both endpoints',()=>{
 assert.deepEqual(hopPose(0,10,100),{x:10,y:-0,tilt:0});
 assert.equal(hopPose(1,10,100).x,100);assert.equal(hopPose(1,10,100).y,-0);
 let lifted=false;
 for(let i=0;i<=100;i++){
  const p=hopPose(i/100,10,100);assert.deepEqual(p,hopPose(i/100,10,100));
  assert.ok(p.x>=10&&p.x<=100&&p.y>=-7&&p.y<=0&&Math.abs(p.tilt)<=2);if(p.y<-1)lifted=true;
 }
 assert.ok(lifted);assert.equal(hopPose(NaN).x,0);
});
