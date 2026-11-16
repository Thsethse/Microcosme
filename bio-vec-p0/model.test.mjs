import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {geometry,normalize} from './model.mjs';
import {render} from './render.mjs';
const ref=JSON.parse(readFileSync(new URL('./reference.json',import.meta.url)));
test('snapshot of PR #23 remains exact',()=>assert.deepEqual(ref,JSON.parse(readFileSync(new URL('../docs/bio-vec-std-01/BIO_VEC_STD_01.json',import.meta.url)))));
test('reference rectangles and local anchors stay in their parents',()=>{
  for(const elements of Object.values(ref.views))for(const e of Object.values(elements)){
    const [x,y,w,h]=e.rect;assert.ok(x>=0&&y>=0&&w>0&&h>0&&x+w<=100&&y+h<=100);
    for(const a of Object.values(e.points))assert.ok(a.every(v=>Number.isFinite(v)&&v>=0&&v<=100));
  }
});
test('input bounds and invalid input fallbacks',()=>{
  for(const [k,[lo,def,hi]]of Object.entries(ref.parameters)){
    assert.equal(normalize(ref,{[k]:-Infinity})[k],def);
    assert.equal(normalize(ref,{[k]:NaN})[k],def);
    assert.equal(normalize(ref,{[k]:'1'})[k],def);
    assert.equal(normalize(ref,{[k]:-100})[k],lo);
    assert.equal(normalize(ref,{[k]:100})[k],hi);
  }
});
test('default symmetry, mouth/eye convention, vertical order',()=>{
  const {elements:e}=geometry(ref,'front');
  for(const part of ['eye','brow','ear']){
    assert.equal(e[part+'_left'].center[0]+e[part+'_right'].center[0],100);
    assert.equal(e[part+'_left'].center[1],e[part+'_right'].center[1]);
  }
  const ratio=e.mouth.rect[2]/(e.eye_right.center[0]-e.eye_left.center[0]);
  // The supplied JSON's baseline is 28/21 = 1.33, not the prose's 0.74.
  // Preserve the source of truth rather than silently changing the artwork.
  assert.equal(ratio,28/21);
});
test('all 256 extreme combinations: finite, ordered, deterministic in both views, age preserves identity',()=>{
  const keys=Object.keys(ref.parameters);
  for(let bits=0;bits<256;bits++){
    const p=Object.fromEntries(keys.map((k,i)=>[k,ref.parameters[k][bits&(1<<i)?2:0]]));
    for(const view of ['front','profile']){
      const g=geometry(ref,view,p),e=g.elements;
      assert.deepEqual(g.parameters,p);
      assert.ok((e.eye||e.eye_left).center[1]<e.nose.anchors.tip[1]);
      assert.ok(e.nose.anchors.base[1]<e.mouth.center[1]);
      assert.ok(e.mouth.center[1]<e.chin.anchors.bottom[1]);
      for(const old of [false,true]){
        const svg=render(ref,view,p,{old,construction:true});
        assert.doesNotMatch(svg,/NaN|Infinity|undefined/);
        assert.equal(svg,render(ref,view,p,{old,construction:true}));
      }
    }
  }
});
test('all eight controls alter each projection; four distinct presets; aging keeps anchor geometry',()=>{
  for(const view of ['front','profile']){
    const baseline=render(ref,view);
    for(const [k,[,,hi]]of Object.entries(ref.parameters))assert.notEqual(render(ref,view,{[k]:hi}),baseline,k+' '+view);
    assert.equal(new Set(Object.values(ref.presets).map(p=>render(ref,view,p))).size,4);
    const young=render(ref,view,ref.presets.B,{construction:true});
    const aged=render(ref,view,ref.presets.B,{old:true,construction:true});
    assert.notEqual(young,aged);
    assert.equal(young.split('<g class="construction"')[1],aged.split('<g class="construction"')[1]);
  }
});
test('reference anchors actually drive curves, not only debug overlay',()=>{
  const edited=structuredClone(ref);edited.views.front.eye_left.points.pupil[1]+=10;
  assert.notEqual(render(ref,'front'),render(edited,'front'));
  edited.views.profile.nose.points.tip[1]+=10;
  assert.notEqual(render(ref,'profile'),render(edited,'profile'));
});
