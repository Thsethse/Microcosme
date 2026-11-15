const {test}=require('node:test'),assert=require('node:assert/strict'),crypto=require('node:crypto'),cp=require('node:child_process');
const root='../../experiments/bio-struct-t3-a/',C=require(root+'canonical-body'),S=require(root+'anatomical-skeleton'),B=require(root+'body-projection'),P=require(root+'biological-profile'),H=require(root+'shape-grammar');
const make=(category='T',fn=category==='F'?'female':'male',parameters={},choices={})=>C.generateBody('r2-regression',{category,reproductiveFunction:fn},parameters,choices);
const volume=(b,id)=>b.volumes.find(v=>v.id===id),command=(b,view,id)=>B.projectBody(b,view).commands.find(c=>c.id===id),close=(a,b)=>assert.ok(Math.abs(a-b)<1e-7,`${a} != ${b}`);

test('R2-01 Poitrine thoracique lisible face/profil, absente dos',()=>{
 const body=make('F');for(const side of ['left','right']){
  const v=volume(body,'breast_'+side),thorax=body.skeleton.segments.thorax;assert.equal(v.anchor.segment,'thorax');assert.deepEqual(v.center,S.point(body.skeleton,v.anchor));
  assert.ok(v.center[1]-v.dimensions.height/2>=thorax.origin[1]);assert.ok(v.center[1]+v.dimensions.height/2<=thorax.end[1]);
  for(const view of ['front','profile']){const c=command(body,view,v.id);assert.equal(c.visible,true);assert.ok(c.w>0&&c.h>0);assert.ok(c.surfaceMarks.some(m=>m.kind==='polyline'));}
  assert.equal(command(body,'back',v.id).visible,false);assert.deepEqual(command(body,'back',v.id).surfaceMarks,[]);
 }
});
test('R2-02 Attribut masculin attaché à l’entrejambe face/profil, absent dos',()=>{
 const body=make('M'),v=volume(body,'sexual_marker'),pelvis=body.skeleton.segments.pelvis;
 assert.deepEqual(v.center,S.point(body.skeleton,body.skeleton.anchors.genital_anchor));assert.equal(v.anchor.segment,'pelvis');assert.ok(v.anchor.t<.2);
 assert.ok(v.center[1]-v.dimensions.height/2<pelvis.origin[1]);assert.ok(v.center[1]+v.dimensions.height/2>pelvis.origin[1]);
 assert.ok(v.center[2]-v.dimensions.depth/2<pelvis.depth/2&&v.center[2]+v.dimensions.depth/2>pelvis.depth/2);
 assert.ok(v.center[1]<S.point(body.skeleton,body.skeleton.anchors.navel)[1]-pelvis.length);
 for(const view of ['front','profile'])assert.equal(command(body,view,v.id).visible,true);assert.equal(command(body,'back',v.id).visible,false);
 assert.ok(v.localVertices.length>8);assert.equal(command(body,'front',v.id).color,body.palette.skin);
});
test('R2-03 Fonction féminine : signe discret de face, aucun en profil',()=>{
 for(const category of ['F','T']){const body=make(category,'female'),v=volume(body,'sexual_marker');assert.equal(v.shape,'triangle');assert.ok(v.dimensions.width<body.skeleton.segments.pelvis.width*.2);assert.ok(v.anchor.t<.2);assert.equal(command(body,'front',v.id).visible,true);for(const view of ['profile','back'])assert.equal(command(body,view,v.id).visible,false);}
});
test('R2-04 T : génital selon fonction, poitrine et morphologie inchangées',()=>{
 for(const breastVolume of [0,.5,1]){
  const male=make('T','male',{breastVolume}),female=make('T','female',{breastVolume});assert.deepEqual(male.skeleton,female.skeleton);assert.deepEqual(male.parameters,female.parameters);assert.deepEqual(male.face,female.face);
  assert.deepEqual(male.volumes.filter(v=>v.id!=='sexual_marker'),female.volumes.filter(v=>v.id!=='sexual_marker'));
  for(const view of ['front','profile','back'])assert.deepEqual(B.projectBody(male,view).commands.filter(c=>c.role==='breast'),B.projectBody(female,view).commands.filter(c=>c.role==='breast'));
  assert.equal(command(male,'profile','sexual_marker').visible,true);assert.equal(command(female,'profile','sexual_marker').visible,false);
 }
});
test('R2-05 Extrêmes P1 et morphologies : attaches et raccord pelvien conservés',()=>{
 for(const category of ['M','F','T'])for(const fn of category==='T'?['male','female']:[category==='F'?'female':'male'])for(const torsoShape of Object.keys(H.schema[1].options))for(const pelvisShape of Object.keys(H.schema[2].options))for(let i=0;i<8;i++){
  const parameters=Object.fromEntries(P.schema.map((s,j)=>[s.key,(i>>j%3)&1?s.min:s.max]));const body=make(category,fn,parameters,{torsoShape,pelvisShape,limbShape:'rounded'}),marker=volume(body,'sexual_marker'),pelvis=body.skeleton.segments.pelvis;
  assert.equal(C.validateBody(body).valid,true);assert.deepEqual(marker.center,S.point(body.skeleton,body.skeleton.anchors.genital_anchor));assert.ok(marker.center[1]-marker.dimensions.height/2<pelvis.origin[1]);assert.ok(marker.center[1]+marker.dimensions.height/2>pelvis.origin[1]);
  const thigh=volume(body,'thigh_right');assert.ok(marker.dimensions.width/2<thigh.center[0]-thigh.dimensions.width/2,'signe entre les cuisses');
  for(const v of body.volumes.filter(v=>v.kind==='breast'))assert.deepEqual(v.center,S.point(body.skeleton,v.anchor));
 }
});
test('R2-06 Projections du même canon, masquage aussi en diagnostic',()=>{
 for(const fn of ['male','female']){const body=make('T',fn),before=JSON.stringify(body);
  for(const view of ['front','profile','back']){const scene=B.projectBody(body,view);assert.equal(scene.bodyId,body.seed+':T');
   for(const c of scene.commands){const v=volume(body,c.id);assert.deepEqual(c.canonicalDimensions,v.dimensions);close(c.anchor[1],scene.origin[1]-scene.scale*v.center[1]);if(c.visible===false){assert.deepEqual(c.surfaceMarks,[]);assert.ok(!scene.debug.anchors.some(a=>a.id===c.id));}}
   if(view==='back'||(view==='profile'&&fn==='female'))assert.ok(!scene.debug.anchors.some(a=>a.id==='genital_anchor'));
  }assert.equal(JSON.stringify(body),before);
 }
});
test('R2-07 Identité stricte des champs R1 hors seul attribut et ancrage génital',()=>{
 const fixture=require('./fixtures/r1-preserved.json');assert.equal(fixture.records.length,378);
 for(const r of fixture.records){const b=make(r.category,r.category==='F'?'female':'male',r.parameters,r.choices);
  for(const view of ['front','profile','back']){const scene=B.projectBody(b,view),commands=scene.commands.filter(c=>c.role!=='breast'&&c.role!=='anatomical-marker').map(c=>{const {visible,surfaceMarks,...rest}=c;return rest;});assert.equal(crypto.createHash('sha256').update(JSON.stringify({commands,facialCommands:scene.facialCommands})).digest('hex'),r.projected[view]);}
  delete b.skeleton.anchors.genital_anchor;b.volumes=b.volumes.filter(v=>v.id!=='sexual_marker');assert.equal(crypto.createHash('sha256').update(JSON.stringify(b)).digest('hex'),r.sha256);
 }
});
test('R2-08 JSON R1/R2 et fichiers protégés sans régression',()=>{
 for(const category of ['M','F','T']){const b=make(category,category==='F'?'female':'male',{shoulderWidth:1.6},{headShape:'diamond',torsoShape:'hourglass'});assert.deepEqual(C.parseBody(C.serializeBody(b)),b);const d=JSON.parse(C.serializeBody(b));assert.equal(d.version,2);assert.equal(d.parameters.shoulderWidth,1.35);assert.equal(d.corrections[0].requested,1.6);}
 for(const exported of require('./fixtures/r1-v2-exports.json'))assert.deepEqual(JSON.parse(C.serializeBody(C.parseBody(JSON.stringify(exported)))),exported);
 const paths=['engine.js','storage.js','cognition.js','graphics.js','renderer.js','interface.js','interface.css','index.html','ui.js','preview','experiments/bio-gen-t2','tests/bio-struct-t3-a/contract.test.cjs','tests/bio-struct-t3-a/r1.test.cjs'];
 assert.equal(cp.execFileSync('git',['diff','b05a3fe9b9ab0664fe1caf278bce9f5b10679520','--',...paths],{encoding:'utf8'}),'');
});
