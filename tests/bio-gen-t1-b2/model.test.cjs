const {test} = require('node:test'), assert = require('node:assert/strict');
const M = require('../../experiments/bio-gen-t1-b2/model'), V1 = require('../../experiments/bio-gen-t1/model');
const update = (d, values) => M.validate({...d, params: {...d.params, ...values}});
test('B2-01/02: bounded continuous contour grammar and shared proportions', () => {
  for (let i=0;i<=100;i++) for (const t of [.05,.2,.5,.8,.95]) {
    const a=M.contour(t,i/100),b=M.contour(t,Math.min(1,(i+1)/100));
    assert.ok(a>=0&&a<=1);assert.ok(Math.abs(a-b)<.011);
  }
  const d=M.generate('shapes'), g=M.derive(d).geometry;
  for (const key of ['skullShape','torsoShape','pelvisShape']) assert.equal(M.derive(update(d,{[key]:1})).geometry.height,g.height);
  for(let i=0;i<2000;i++) {
    const d=M.generate('bounds-'+i),g=M.derive(d).geometry;
    for(const [key,v] of Object.entries(g)) assert.ok(Number.isFinite(v)&&v>=0,key);
    assert.ok(Math.abs(g.height-g.headH-g.trunk-g.legs)<1e-10);
    assert.ok(g.armLength<g.trunk+g.legs);assert.ok(g.shoulders<44);assert.ok(g.hips<44);
  }
});
test('B2-03/04: zone lengths, density and direction are independent of skull geometry',()=>{
  const d=M.generate('hair'),a=M.derive(d);
  for(const key of ['hairTop','hairSides','hairNape','hairPart','texture','density','hairline']) assert.deepEqual(M.derive(update(d,{[key]:1})).geometry,a.geometry);
  const b=M.derive(update(d,{hairSides:0,hairNape:1,hairTop:1}));assert.equal(b.hair.sides,0);assert.equal(b.hair.nape,1);assert.equal(b.hair.taper,1);
});
test('B2-05/06/08: secondary traits independent; no category, behavior or fertility',()=>{
  const d=M.generate('independent'),a=M.derive(d),b=M.derive(update(d,{chest:1}));
  assert.deepEqual(b.zones,a.zones);assert.equal(b.geometry.shoulders,a.geometry.shoulders);assert.equal(b.geometry.jaw,a.geometry.jaw);
  assert.deepEqual(M.derive(update(d,{beard:1,bodyHair:1})).geometry,a.geometry);
  assert.notEqual(M.derive(update(d,{shoulderHip:-1})).geometry.hips,M.derive(update(d,{shoulderHip:1})).geometry.hips);
  const c=M.derive(update(d,{hairPotential:0,beard:1,bodyHair:1}));assert.ok(Object.values(c.zones).every(v=>v===0));
  assert.deepEqual(M.derive(update(d,{grooming:1})).zones,a.zones);
  assert.ok(!M.schema.some(s=>/gender|sex|fertil|orientation|psych/i.test(s.key)));
  for(const chest of [0,1])for(const beard of [0,1])M.validate(update(d,{chest,beard,shoulderHip:0}));
});
test('B2-09/10: v1 migration, v2 roundtrip, seed stability and immutable derivation',()=>{
  assert.equal(M.schema.length,32);
  for(let i=0;i<20;i++){
    const seed='microcosme-b-'+String(i+1).padStart(3,'0'),v1=V1.generate(seed),d=M.generate(seed);
    assert.deepEqual(M.baseline(d),v1);assert.deepEqual(M.baseline(M.validate(v1)),v1);
    for(const s of M.additions)assert.equal(M.validate(v1).params[s.key],s.initial);
    assert.deepEqual(M.parse(M.serialize(d)),d);assert.deepEqual(M.generate(seed),d);
    const before=M.serialize(d);M.derive(d);assert.equal(before,M.serialize(d));
  }
  assert.deepEqual(require('../../experiments/bio-gen-t1-b2/gallery.json'),Array.from({length:20},(_,i)=>M.generate('microcosme-b-'+String(i+1).padStart(3,'0'))));
  for(const v of [NaN,Infinity,-3,'0.5',null])assert.throws(()=>update(M.generate('bad'),{chest:v}));
  assert.throws(()=>M.parse('{}'));assert.throws(()=>M.parse('{'));
});
