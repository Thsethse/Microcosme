const {test}=require('node:test'),assert=require('node:assert/strict'),cp=require('node:child_process');
const root='../../experiments/bio-struct-t3-a/',C=require(root+'canonical-body'),P=require(root+'biological-profile'),S=require(root+'anatomical-skeleton'),H=require(root+'shape-grammar'),B=require(root+'body-projection'),F=require(root+'body-finish');
const make=(category='T',appearance={},parameters={},choices={},fn=category==='F'?'female':'male',seed='r3-test')=>C.generateBodyR3(seed,{category,reproductiveFunction:fn},parameters,choices,appearance);
const volume=(b,id)=>b.volumes.find(v=>v.id===id),close=(a,b)=>assert.ok(Math.abs(a-b)<1e-7,`${a} != ${b}`);
const details=(body,view,role)=>B.projectBody(body,view).commands.flatMap(c=>c.visible===false?[]:c.surfaceMarks.filter(m=>m.role===role));

test('R3-01 Taille et forme mammaires séparées F/T ; aucune option mammaire M',()=>{
 for(const category of ['F','T'])for(const breastShape of ['natural','round','drop'])for(const breastVolume of [0,.4,1]){const b=make(category,{breastShape},{breastVolume});assert.equal(b.parameters.breastVolume,breastVolume);assert.equal(b.appearance.breastShape,breastShape);assert.equal(b.volumes.filter(v=>v.kind==='breast').length,breastVolume?2:0);for(const v of b.volumes.filter(v=>v.kind==='breast')){assert.equal(v.anchor.segment,'thorax');assert.deepEqual(v.center,S.point(b.skeleton,v.anchor));}}
 assert.ok(!make('M',{}, {breastVolume:1}).volumes.some(v=>v.kind==='breast'));assert.throws(()=>make('M',{breastShape:'round'}));assert.throws(()=>make('F',{breastShape:'invented'}));
 const b=make('F',{breastShape:'round'},{breastVolume:.4});assert.equal(C.parseBody(C.serializeBody(b)).appearance.breastShape,'round');
});
test('R3-02 Pectoraux ronds à rectangulaires, volumes locaux attachés',()=>{
 for(const category of ['M','F','T']){const shapes=new Set();for(const pectoralDefinition of [0,.25,.5,.75,1]){const b=make(category,{pectoralDefinition},{muscleVolume:0,breastVolume:0});for(const side of ['left','right']){const v=volume(b,'pectoralis_'+side);assert.deepEqual(v.center,S.point(b.skeleton,v.anchor));assert.equal(v.region,'thorax');assert.ok(v.localVertices.length>32);assert.equal(v.surfaceDefinition,pectoralDefinition);}shapes.add(JSON.stringify(volume(b,'pectoralis_left').localVertices));}assert.equal(shapes.size,5);}
});
test('R3-03 Ventre rond à abdominaux définis ; graisse indépendante',()=>{
 for(const category of ['M','F','T']){const soft=make(category,{abdominalDefinition:0,fatVolume:1}),defined=make(category,{abdominalDefinition:1,fatVolume:0});assert.equal(soft.volumes.filter(v=>/^abdominal_(left|right)/.test(v.id)).length,0);assert.equal(defined.volumes.filter(v=>/^abdominal_(left|right)/.test(v.id)).length,6);assert.ok(volume(soft,'abdominal_surface').dimensions.depth>volume(defined,'abdominal_surface').dimensions.depth);
  for(const v of defined.volumes.filter(v=>v.id.startsWith('abdominal_'))){assert.equal(v.anchor.segment,'abdomen');assert.deepEqual(v.center,S.point(defined.skeleton,v.anchor));assert.ok(v.vertices.some(a=>a[2]!==v.vertices[0][2]));}
  assert.ok(volume(make(category,{abdominalDefinition:1,fatVolume:1}),'abdominal_surface').dimensions.depth>volume(defined,'abdominal_surface').dimensions.depth);
 }
});
test('R3-04 Ombres brunes locales, douces, six peaux et trois vues',()=>{
 const seen=new Set();for(let i=0;seen.size<6&&i<100;i++){const b=make('T',{shadowStrength:1,abdominalDefinition:1}, {},{},'male','skin-'+i);if(seen.has(b.palette.skin))continue;seen.add(b.palette.skin);
  for(const view of ['front','profile','back']){const scene=B.projectBody(b,view),shadows=details(b,view,'shadow');assert.ok(shadows.length>0);for(const c of scene.commands){if(c.surfaceMarks.some(m=>m.role==='shadow'))assert.equal(c.clipSurface,true);if(c.visible===false)assert.deepEqual(c.surfaceMarks,[]);}
   for(const mark of shadows)for(const k of [1,3,5]){const skin=parseInt(b.palette.skin.slice(k,k+2),16),shade=parseInt(mark.color.slice(k,k+2),16);assert.ok(shade<=skin&&skin-shade<=42);assert.ok(mark.points.every(p=>p.every(Number.isFinite)));}
   assert.ok(!shadows.some(m=>m.id.startsWith('head')||m.id.startsWith('sexual_marker')));
  }
 }
 assert.equal(seen.size,6);assert.equal(details(make('T',{shadowStrength:0}),'front','shadow').length,0);
});
test('R3-05 Pilosité M/F/T ancrée ; pubis au-dessus de la base du sexe',()=>{
 for(const category of ['M','F','T'])for(const pubicHairShape of category==='M'?['none','rectangle']:['none','triangle','square','rectangle']){
  const b=make(category,{pubicHairShape,pubicHairDensity:1,chestHairDensity:category==='F'?0:1,bellyHairDensity:category==='F'?0:1}),hair=b.finish.details.filter(d=>d.kind==='hair');
  assert.deepEqual(b,make(category,b.appearance));for(const d of hair){const owner=volume(b,d.owner);assert.deepEqual(d.position,F.local(owner,d.offsetLocal));if(d.owner==='pelvis'){const s=b.skeleton.segments.pelvis;assert.ok(d.position[1]-d.size/2>s.origin[1]+s.length*(.12+.86/2));assert.ok(d.position[1]+d.size/2<s.end[1]);}}
  assert.equal(hair.some(d=>d.owner==='pelvis'),pubicHairShape!=='none');if(category==='F')assert.ok(hair.every(d=>d.owner==='pelvis'));
  for(const view of ['profile','back'])assert.equal(details(b,view,'hair').length,0);
 }
 assert.throws(()=>make('M',{pubicHairShape:'triangle'}));assert.equal(make('F',{chestHairDensity:.5}).biologicalProfile.category,'F');assert.throws(()=>make('T',{hairColor:'url(x)'}));
});
test('R3-06 Nombril : un point canonique, jamais un tiret ni un détail dorsal',()=>{
 for(const category of ['M','F','T'])for(const globalSize of [.75,1.3]){const b=make(category,{}, {globalSize,trunkLength:1.25}),navel=b.finish.details.filter(d=>d.kind==='navel');assert.equal(navel.length,1);close(navel[0].position[1],S.point(b.skeleton,b.skeleton.anchors.navel)[1]);const m=details(b,'front','navel');assert.equal(m.length,1);assert.equal(m[0].kind,'oval');assert.equal(m[0].w,m[0].h);assert.ok(m[0].w<=2);for(const view of ['profile','back'])assert.equal(details(b,view,'navel').length,0);}
});
test('R3-07 Ancien bassin ovale : migration déterministe, volume et données conservés',()=>{
 for(const d of require('./fixtures/r1-v2-exports.json')){const legacy=C.parseBody(JSON.stringify(d)),b=C.upgradeBody(legacy);assert.equal(b.version,3);assert.equal(b.geometryChoices.pelvisShape,'rectangle');assert.equal(b.migration.originalPelvisShape,'oval');assert.deepEqual(b.parameters,d.parameters);assert.deepEqual(b.corrections,d.corrections);assert.ok(volume(b,'pelvis'));assert.deepEqual(C.parseBody(C.serializeBody(b)),b);assert.deepEqual(C.upgradeBody(legacy),b);}
 const v1=require('./fixtures/t3-a-v1.json').profiles.F.export,b=C.upgradeBody(C.parseBody(JSON.stringify(v1)));assert.equal(b.migration.fromVersion,1);assert.equal(b.migration.previous.fromVersion,1);assert.deepEqual(C.parseBody(C.serializeBody(b)),b);
});
test('R3-08 T libre : fonction indépendante de poitrine, muscles, graisse et poils',()=>{
 const appearance={breastShape:'drop',fatVolume:.8,pectoralDefinition:.9,abdominalDefinition:1,chestHairDensity:.8,bellyHairDensity:.5,pubicHairShape:'triangle',pubicHairDensity:.9,hairColor:'#9b7051'};
 const male=make('T',appearance,{breastVolume:.9}),female=make('T',appearance,{breastVolume:.9},{},'female');assert.deepEqual(male.appearance,female.appearance);assert.deepEqual(male.skeleton,female.skeleton);assert.deepEqual(male.finish,female.finish);assert.deepEqual(male.volumes.filter(v=>v.id!=='sexual_marker'),female.volumes.filter(v=>v.id!=='sexual_marker'));
 for(const view of ['front','profile','back'])assert.deepEqual(B.projectBody(male,view).commands.filter(c=>c.role==='breast'),B.projectBody(female,view).commands.filter(c=>c.role==='breast'));
 for(const invalid of [NaN,Infinity,-.1,1.1,'0.5'])assert.throws(()=>make('T',{fatVolume:invalid}));
});
test('R3-09 Extrêmes et morphologies : canon, attaches et attributs R2 préservés',()=>{
 for(const category of ['M','F','T'])for(const headShape of Object.keys(H.schema[0].options))for(const torsoShape of ['rectangle','hourglass','triangle'])for(const extreme of ['min','max']){
  const parameters=Object.fromEntries(P.schema.map(s=>[s.key,s[extreme]])),choices={headShape,torsoShape,pelvisShape:extreme==='min'?'rectangle':'trapezoid',limbShape:'rounded'};
  const b=make(category,{pectoralDefinition:extreme==='min'?0:1,abdominalDefinition:extreme==='min'?0:1,fatVolume:extreme==='min'?1:0,breastShape:category==='M'?null:'drop'},parameters,choices),old=C.generateBody('r3-test',b.biologicalProfile,parameters,choices);
  assert.equal(C.validateBody(b).valid,true);assert.deepEqual(b.skeleton,old.skeleton);assert.deepEqual(b.face,old.face);assert.deepEqual(volume(b,'head'),volume(old,'head'));assert.deepEqual(volume(b,'sexual_marker'),volume(old,'sexual_marker'));
  for(const v of b.volumes)assert.deepEqual(v.center,S.point(b.skeleton,v.anchor));
  for(const view of ['front','profile','back']){const scene=B.projectBody(b,view);assert.equal(scene.canonicalHeight,b.skeleton.height);assert.ok(scene.commands.every(c=>[c.x,c.y,c.w,c.h].every(Number.isFinite)));}
 }
});
test('R3-10 JSON v3 déterministe, corps anciens et fichiers protégés',()=>{
 const b=make('T',{breastShape:'round',pubicHairShape:'square',bellyHairDensity:.8},{shoulderWidth:1.6},{headShape:'triangle',torsoShape:'hourglass'}),d=JSON.parse(C.serializeBody(b));assert.deepEqual(C.parseBody(JSON.stringify(d)),b);d.parameters=Object.fromEntries(Object.entries(d.parameters).reverse());d.appearance=Object.fromEntries(Object.entries(d.appearance).reverse());assert.deepEqual(C.parseBody(JSON.stringify(d)),b);
 d.parameters.shoulderWidth=1.6;assert.throws(()=>C.parseBody(JSON.stringify(d)));const broken=structuredClone(b);broken.finish.details[0].position[1]=999;assert.equal(C.validateBody(broken).valid,false);
 assert.equal(cp.execFileSync('git',['diff','bf9f6d002bed891344dd2f954a33c4126baa84e1','--','engine.js','storage.js','cognition.js','graphics.js','renderer.js','ui.js','interface.js','interface.css','index.html','preview','tests/bio-struct-t3-a/contract.test.cjs','tests/bio-struct-t3-a/r1.test.cjs','tests/bio-struct-t3-a/r2.test.cjs'],{encoding:'utf8'}),'');
});
test('R3-11 Réception artistique et Safari iPad physique', {skip:'Contrôle humain exclusivement : captures fournies, retour utilisateur attendu.'},()=>{});
