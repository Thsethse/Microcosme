const {test}=require('node:test'),assert=require('node:assert/strict'),cp=require('node:child_process');
const root='../../experiments/bio-struct-t3-a/',P=require(root+'biological-profile'),S=require(root+'anatomical-skeleton'),C=require(root+'canonical-body'),B=require(root+'body-projection'),H=require(root+'shape-grammar');
const old=require('./fixtures/t3-a-v1.json');
const make=(category='T',parameters={},geometryChoices={},fn=category==='F'?'female':'male')=>C.generateBody('r1',{category,reproductiveFunction:fn},parameters,geometryChoices);
const close=(a,b)=>assert.ok(Math.abs(a-b)<1e-7,`${a} != ${b}`);
test('R1-01 Continuité thorax/abdomen et raccords cou/clavicules/épaules',()=>{
 for(const category of ['M','F','T']){
  const ref=make(category),s=ref.skeleton.segments;assert.ok(s.thorax.length>old.profiles[category].thoraxLength);
  assert.ok(ref.volumes.find(v=>v.id==='pectoralis_left').dimensions.height>old.profiles[category].pectoralHeight*1.5);
  for(let i=0;i<64;i++){const p={};P.schema.forEach((s,j)=>p[s.key]=(i>>j%6)&1?s.min:s.max);const b=make(category,p),sk=b.skeleton;
   assert.equal(C.validateBody(b).valid,true);assert.deepEqual(sk.segments.abdomen.end,sk.segments.thorax.origin);assert.deepEqual(sk.segments.thorax.end,sk.segments.neck.origin);
   for(const side of ['left','right']){assert.deepEqual(sk.segments['clavicle_'+side].end,sk.segments['upper_arm_'+side].origin);const trap=b.volumes.find(v=>v.id==='trapezius_'+side);assert.ok(trap.vertices.length>=6);assert.ok(trap.supports.includes('shoulder_'+side));}
  }
 }
});
test('R1-02 Muscles attachés et rendu normal dans les tons de peau',()=>{
 for(const category of ['M','F','T'])for(const muscleVolume of [0,.5,1]){
  const b=make(category,{muscleVolume}),scene=B.projectBody(b);for(const v of b.volumes.filter(v=>v.kind==='muscle'))assert.deepEqual(v.center,S.point(b.skeleton,v.anchor));
  for(const c of scene.commands.filter(c=>c.role==='muscle'))for(const i of [1,3,5])assert.ok(Math.abs(parseInt(c.color.slice(i,i+2),16)-parseInt(b.palette.skin.slice(i,i+2),16))<15);
 }
 const small=make('T',{muscleVolume:0}),large=make('T',{muscleVolume:1});assert.ok(large.volumes.find(v=>v.id==='upper_arm_left').dimensions.width>small.volumes.find(v=>v.id==='upper_arm_left').dimensions.width);
});
test('R1-03 Sept têtes indépendantes de la catégorie et de la fonction',()=>{
 assert.equal(Object.keys(H.schema[0].options).length,7);
 for(const category of ['M','F','T'])for(const headShape of Object.keys(H.schema[0].options))for(const fn of category==='T'?['male','female']:[category==='F'?'female':'male']){
  const b=make(category,{}, {headShape},fn);assert.equal(b.geometryChoices.headShape,headShape);assert.equal(b.biologicalProfile.category,category);assert.equal(b.biologicalProfile.reproductiveFunction,fn);assert.equal(C.validateBody(b).valid,true);
 }
});
test('R1-04 Plusieurs morphologies disponibles dans chaque catégorie',()=>{
 for(const category of ['M','F','T'])for(const torsoShape of Object.keys(H.schema[1].options))for(const pelvisShape of Object.keys(H.schema[2].options)){
  const b=make(category,{shoulderWidth:1.22,breastVolume:.25},{torsoShape,pelvisShape,limbShape:'rounded'});assert.equal(b.biologicalProfile.category,category);assert.equal(b.parameters.shoulderWidth,1.22);assert.equal(b.geometryChoices.torsoShape,torsoShape);assert.equal(C.validateBody(b).valid,true);
 }
});
test('R1-05 Yeux sous mi-hauteur, sourcils au-dessus, bouche entre bas des yeux et menton',()=>{
 for(const headShape of Object.keys(H.schema[0].options))for(const headHeight of [.8,1,1.2])for(const headWidth of [.75,1.3]){
  const b=make('T',{headHeight,headWidth,globalSize:1.3,trunkLength:1.25},{headShape}),f=b.face,a=f.anchors,top=a.face_top[1],chin=a.face_chin[1];
  for(const side of ['left','right']){const eye=a['eye_'+side],brow=a['brow_'+side],bottom=a['eye_bottom_'+side];assert.ok(eye[1]<(top+chin)/2);assert.ok((top+chin)/2-eye[1]<(top-chin)*.1);assert.ok(brow[1]>eye[1]&&brow[1]-eye[1]<(top-chin)*.12);close(a.mouth[1],(bottom[1]+chin)/2);assert.deepEqual(eye,S.point(b.skeleton,b.skeleton.anchors['eye_'+side]));}
  close(a.eye_left[0],-a.eye_right[0]);close(a.mouth[0],0);
 }
});
test('R1-06 Aucun nez, ni géométrie ni ancrage nasal',()=>{
 for(const headShape of Object.keys(H.schema[0].options)){
  const b=make('T',{}, {headShape});assert.ok(!Object.keys(b.skeleton.anchors).some(id=>/nose|nasal/i.test(id)));assert.ok(!b.volumes.some(v=>/nose|nasal/i.test(v.id)));
  for(const view of ['front','profile','back'])assert.ok(![...B.projectBody(b,view).commands,...B.projectBody(b,view).facialCommands].some(c=>/nose|nasal/i.test(c.id)));
 }
});
test('R1-07 Dos sans traits faciaux, projections depuis le même canon',()=>{
 const b=make(),copy=JSON.stringify(b);assert.equal(B.projectBody(b,'back').facialCommands.length,0);assert.ok(!B.projectBody(b,'back').debug.anchors.some(a=>/^(eye|brow|mouth|face|facial)/.test(a.id)));
 for(const view of ['front','profile'])assert.ok(B.projectBody(b,view).facialCommands.some(c=>c.id==='face-mouth'));
 assert.equal(JSON.stringify(b),copy);
});
test('R1-08 Non-régression du contrat, JSON versionné et fichiers protégés',()=>{
 for(const category of ['M','F','T']){const b=make(category,{shoulderWidth:1.6},{headShape:'diamond',torsoShape:'hourglass'});assert.deepEqual(C.parseBody(C.serializeBody(b)),b);
  const migrated=C.parseBody(JSON.stringify(old.profiles[category].export));assert.equal(migrated.version,2);assert.equal(migrated.migration.fromVersion,1);assert.deepEqual(migrated.parameters,old.profiles[category].export.parameters);assert.deepEqual(C.parseBody(C.serializeBody(migrated)),migrated);
 }
 assert.throws(()=>make('T',{}, {headShape:'unknown'}));assert.throws(()=>C.parseBody('{"schema":"microcosme.bio-gen-t2","version":1}'));
 assert.equal(cp.execFileSync('git',['diff','dfa56ba34c94de6bc80f3b2e4c58e584a2827c79','--','engine.js','storage.js','preview/bio-gen-t2','preview/bio-struct-t3-a'],{encoding:'utf8'}),'');
});
