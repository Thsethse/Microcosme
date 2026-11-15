const {test}=require('node:test'),assert=require('node:assert/strict');
const M=require('../../experiments/bio-gen-t2/model'),G=require('../../experiments/bio-gen-t2/geometry');
const change=(d,p)=>M.validate({...d,params:{...d.params,...p}});
const ref=M.reference('test');
test('T2-01/02: quatre têtes et étirements indépendants',()=>{
 const a=G.derive(ref).geometry;assert.equal(a.height,4*a.headH);
 for(const [field,dimension]of [['headX','headW'],['headY','headH'],['bodyX','bodyW'],['bodyY','bodyH'],['armLength','armH'],['armWidth','armW'],['legLength','legH'],['legWidth','legW']]){
  const b=G.derive(change(ref,{[field]:M.schema.find(s=>s.key===field).max})).geometry;assert.notEqual(b[dimension],a[dimension]);
  for(const independent of ['headW','headH','bodyW','bodyH','armW','armH','legW','legH'].filter(k=>k!==dimension))assert.equal(b[independent],a[independent],field+' changes '+independent);
 }
});
test('T2-03/04: cinq têtes, membres rectangulaires et géométries bornées',()=>{
 const signatures=new Set();for(const headShape of Object.keys(M.schema.find(s=>s.key==='headShape').options)){const scene=G.project(G.derive(change(ref,{headShape})));signatures.add(JSON.stringify(scene.commands.filter(c=>c.tag==='head')));}
 assert.equal(signatures.size,5);
 for(let i=0;i<1000;i++){const d=M.generate('bounds-'+i),b=G.derive(d),g=b.geometry;assert.ok(g.height<=98);assert.ok(g.top>25);assert.equal(g.legY+g.legH,132);assert.ok(Math.abs(g.height-g.headH-g.bodyH-g.pelvisH-g.legH)<1e-10);
  for(const view of ['front','back','profile'])for(const c of G.project(b,view).commands){assert.ok([c.x,c.y,c.w,c.h].every(Number.isFinite));assert.ok(c.w>0&&c.h>0);if(/^(arm|leg)-/.test(c.tag))assert.equal(c.kind,'rectangle');}
 }
});
test('T2-05/06: muscles rectangulaires et poitrine indépendante',()=>{
 const d=change(ref,{chestPresent:true,chestVolume:1,anatomyMark:'neutral'}),a=G.derive(d);
 const muscles=G.project(a).commands.filter(c=>c.tag.startsWith('muscle-'));assert.ok(muscles.length);assert.ok(muscles.every(c=>c.kind==='rectangle'));
 const c=G.project(a).commands.filter(c=>c.tag.startsWith('chest-'));assert.equal(c.filter(c=>!c.tag.endsWith('outline')).length,2);assert.ok(c.every(c=>c.kind==='oval'));
 const before=JSON.stringify(G.project(a).commands.filter(c=>c.tag.startsWith('muscle-')));
 assert.equal(JSON.stringify(G.project(G.derive(change(d,{chestSpacing:1.3,chestStretch:1.4}))).commands.filter(c=>c.tag.startsWith('muscle-'))),before);
 for(const anatomyMark of ['neutral','rectangle','lineTriangle'])assert.equal(G.project(G.derive(change(d,{anatomyMark}))).commands.filter(c=>c.tag==='chest--1').length,1);
});
test('T2-07/08: visage sans nez, cils et sourcils indépendants',()=>{
 assert.ok(!M.schema.some(s=>/nose|jaw|cheek|gender|fertil|strength/i.test(s.key)));
 const a=G.project(G.derive(ref));assert.ok(!a.commands.some(c=>/nose/.test(c.tag)));
 const eyebrow=scene=>scene.commands.filter(c=>c.tag.startsWith('brow'));
 assert.deepEqual(eyebrow(a),eyebrow(G.project(G.derive(change(ref,{lashes:true})))));
 assert.ok(G.project(G.derive(change(ref,{lashes:true}))).commands.some(c=>c.tag.startsWith('lash')));
});
test('T2-09/10/11: coiffures, pilosité limitée et palettes indépendantes',()=>{
 for(const headShape of Object.keys(M.schema[0].options))for(const hairStyle of Object.keys(M.schema.find(s=>s.key==='hairStyle').options)){
  const d=change(ref,{headShape,hairStyle});assert.deepEqual(G.project(G.derive(d)),G.project(G.derive(d)));
 }
 const a=G.project(G.derive(change(ref,{beard:1,moustache:1,sideburns:1,pubicHair:1})));
 assert.deepEqual(new Set(a.commands.filter(c=>c.tag.startsWith('fur-')).map(c=>c.tag)),new Set(['fur-beard','fur-moustache','fur-sideburns','fur-pubic']));
 const palette=G.derive(ref).palette;
 for(const [field,color]of [['skinColor','skin'],['eyeColor','eye'],['hairColor','hair'],['furColor','fur']]){
  const options=Object.keys(M.schema.find(s=>s.key===field).options),b=G.derive(change(ref,{[field]:options.at(-1)}));assert.notEqual(b.palette[color],palette[color]);for(const other of ['skin','eye','hair','fur'].filter(k=>k!==color))assert.equal(b.palette[other],palette[other]);
 }
});
test('T2-12/13: déterminisme, validation stricte et quatre vues sans mutation',()=>{
 const gallery=require('../../experiments/bio-gen-t2/gallery.json');assert.equal(gallery.length,20);
 for(const d of gallery){assert.deepEqual(M.generate(d.seed),d);assert.deepEqual(M.parse(M.serialize(d)),d);const before=M.serialize(d),body=G.derive(d);for(const view of ['front','back','profile','portrait']){const s=G.project(body,view);assert.equal(s.body,body);assert.deepEqual(s,G.project(body,view));}assert.equal(M.serialize(d),before);}
 for(const invalid of [NaN,Infinity,'1',null,-5])assert.throws(()=>change(ref,{headX:invalid}));
 assert.throws(()=>M.parse('{}'));assert.throws(()=>M.parse('{'));assert.throws(()=>change(ref,{hairStyle:'unknown'}));assert.throws(()=>change(ref,{lashes:1}));
 assert.throws(()=>M.validate({version:1,seed:'B1',params:ref.params}));
});
