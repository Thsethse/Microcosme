const {test}=require('node:test'),assert=require('node:assert/strict'),cp=require('node:child_process');
const dir='../../experiments/bio-struct-t3-b1/',C=require(dir+'canonical-body'),B=require(dir+'body-projection'),P=require(dir+'biological-profile'),FM=require(dir+'facial-model'),FS=require(dir+'face-settings'),H=require(dir+'shape-grammar'),S=require(dir+'anatomical-skeleton');
const R3=require('../../experiments/bio-struct-t3-a/canonical-body'),R3B=require('../../experiments/bio-struct-t3-a/body-projection');
const make=(category='T',face={},parameters={},choices={},appearance={},fn=category==='F'?'female':'male')=>C.generateBodyB1('b1-contract',{category,reproductiveFunction:fn},parameters,choices,appearance,face);
const close=(a,b)=>assert.ok(Math.abs(a-b)<1e-7,`${a} != ${b}`);

test('B1-01 Quatre têtes seulement, angles carrés/rectangulaires arrondis',()=>{
 assert.deepEqual(Object.keys(H.schema[0].options),['round','oval','square','rectangle']);
 for(const category of ['M','F','T'])for(const headShape of Object.keys(FS.heads)){const b=make(category,{}, {},{headShape}),head=b.volumes.find(v=>v.id==='head');assert.equal(b.geometryChoices.headShape,headShape);if(['square','rectangle'].includes(headShape)){assert.ok(head.roundingRadius>0);assert.ok(head.vertices.length>=100);assert.ok(!head.localVertices.some(p=>Math.abs(p[0])===head.dimensions.width/2&&Math.abs(p[1])===head.dimensions.height/2));}else assert.equal(head.shape,'oval');assert.equal(C.validateBody(b).valid,true);}
 for(const headShape of ['triangle','invertedTriangle','diamond'])assert.throws(()=>make('T',{}, {},{headShape}));
});
test('B1-02 Migration des têtes retirées sans perte des données R3',()=>{
 for(const d of require('./fixtures/r3-exports.json')){const b=C.parseBody(JSON.stringify(d));assert.equal(b.version,4);assert.equal(b.geometryChoices.headShape,d.geometryChoices.headShape==='square'?'square':'round');assert.equal(b.migration.originalHeadShape,d.geometryChoices.headShape);for(const key of ['seed','biologicalProfile','requestedParameters','parameters','corrections','appearance'])assert.deepEqual(JSON.parse(C.serializeBody(b))[key],d[key]);assert.deepEqual(C.parseBody(JSON.stringify(d)),b);assert.deepEqual(C.parseBody(C.serializeBody(b)),b);}
 for(const d of require('../bio-struct-t3-a/fixtures/r1-v2-exports.json')){const b=C.parseBody(JSON.stringify(d));assert.equal(b.version,4);assert.equal(b.geometryChoices.headShape,'round');assert.equal(b.geometryChoices.pelvisShape,'rectangle');assert.deepEqual(b.parameters,d.parameters);assert.equal(b.migration.previous.originalPelvisShape,'oval');}
 const d=require('../bio-struct-t3-a/fixtures/t3-a-v1.json').profiles.F.export,b=C.parseBody(JSON.stringify(d));assert.equal(b.migration.fromVersion,1);assert.equal(b.geometryChoices.headShape,'oval');assert.deepEqual(b.parameters,d.parameters);
});
test('B1-03 Yeux sous médiane et écart égal à un œil sous toutes variations',()=>{
 for(const headShape of Object.keys(FS.heads))for(const eyeShape of Object.keys(FS.eyes))for(const eyeSize of [.5,1,1.5])for(const headHeight of [.8,1.2])for(const headWidth of [.75,1.3])for(const globalSize of [.75,1.3]){
  const b=make('T',{eyeShape,eyeSize},{headHeight,headWidth,globalSize},{headShape}),f=b.face,[left,right]=f.features.eyes;assert.ok(f.eyeTop<=f.medianY);assert.ok(f.eyeTop>f.medianY-f.height*.05);close(right.position[0]-right.width/2-(left.position[0]+left.width/2),left.width);close(left.width,right.width);close(left.top-left.height,left.bottom);assert.ok(f.eyeBottom>f.anchors.face_chin[1]);
  for(const e of f.features.eyes)assert.deepEqual(e.position,S.point(b.skeleton,b.skeleton.anchors[e.id]));
 }
});
test('B1-04 Sourcils bilatéraux au-dessus des yeux, formes/couleurs séparées',()=>{
 for(const browShape of Object.keys(FS.brows)){const b=make('T',{browShape,browColor:'#bb8833',irisColor:'#3377cc'});for(const brow of b.face.features.brows){assert.equal(brow.shape,browShape);assert.ok(brow.bottom>b.face.eyeTop);assert.ok(brow.bottom-b.face.eyeTop<b.face.height*.05);assert.deepEqual(brow.position,S.point(b.skeleton,b.skeleton.anchors[brow.id]));}assert.equal(b.faceSettings.browColor,'#bb8833');assert.equal(b.faceSettings.irisColor,'#3377cc');}
});
test('B1-05 Bouche au milieu exact entre bas des yeux et menton',()=>{
 for(const headShape of Object.keys(FS.heads))for(const eyeShape of Object.keys(FS.eyes))for(const eyeSize of [.5,1.5])for(const headHeight of [.8,1.2]){const b=make('F',{eyeShape,eyeSize},{headHeight,headWidth:1.3,trunkLength:1.25},{headShape}),f=b.face;close(f.features.mouth.position[1],(f.eyeBottom+f.anchors.face_chin[1])/2);assert.deepEqual(f.anchors.mouth,S.point(b.skeleton,b.skeleton.anchors.mouth));}
});
test('B1-06 Aucun nez, aucune ancre nasale ni point central supplémentaire',()=>{
 for(const headShape of Object.keys(FS.heads)){const b=make('F',{}, {},{headShape});assert.ok(!Object.keys(b.skeleton.anchors).some(k=>/nose|nasal|facial_axis/i.test(k)));assert.ok(!b.volumes.some(v=>/nose|nasal/i.test(v.id)));for(const view of ['front','profile','back'])assert.ok(!B.projectBody(b,view).facialCommands.some(c=>/nose|nasal/i.test(c.id)));}
});
test('B1-07 Catalogues concrets, cinq familles de bouche et couleurs indépendantes',()=>{
 assert.equal(Object.keys(FS.eyes).length,6);assert.deepEqual(Object.keys(FS.mouths),['lowerSemicircle','upperSemicircle','triangles','rectangle','reversedB']);
 for(const mouthShape of Object.keys(FS.mouths))for(const eyeShape of Object.keys(FS.eyes)){const b=make('T',{eyeShape,mouthShape,irisColor:'#286ead',browColor:'#613c28',lipColor:'#b14568'});assert.equal(b.faceSettings.mouthShape,mouthShape);assert.equal(b.faceSettings.eyeShape,eyeShape);const scene=B.projectBody(b);assert.ok(scene.facialCommands.some(c=>c.color==='#286ead'));assert.ok(scene.facialCommands.some(c=>c.color==='#b14568'));assert.ok(scene.facialCommands.some(c=>c.color==='#613c28'));}
});
test('B1-08 Cils attachés au bord supérieur, F présents, T libre sans lien à sa fonction',()=>{
 for(const category of ['F','T'])for(const lashes of category==='F'?['short','long']:['none','short','long'])for(const eyeShape of Object.keys(FS.eyes))for(const eyeSize of [.5,1.5]){
  const b=make(category,{lashes,eyeShape,eyeSize});assert.equal(b.face.features.lashes.length,lashes==='none'?0:6);for(const lash of b.face.features.lashes){const e=b.face.features.eyes.find(e=>e.id===lash.eyeId);close(lash.position[1],e.top-e.height*FM.upper(eyeShape,lash.u));assert.ok(lash.tip[1]>lash.position[1]);assert.deepEqual(lash.position,S.point(b.skeleton,b.skeleton.anchors[lash.id]));}
  if(category==='T'){const female=make(category,{lashes,eyeShape,eyeSize},{},{},{},'female');assert.deepEqual(female.face,b.face);assert.deepEqual(female.faceSettings,b.faceSettings);}
 }
 assert.equal(make('M').face.features.lashes.length,0);assert.throws(()=>make('M',{lashes:'short'}));
});
test('B1-09 Face/profil depuis le même canon, un œil de profil, aucun trait de dos',()=>{
 for(const category of ['M','F','T'])for(const headShape of Object.keys(FS.heads))for(const eyeShape of Object.keys(FS.eyes)){
  const b=make(category,{eyeShape},{},{headShape}),copy=JSON.stringify(b),front=B.projectBody(b,'front'),profile=B.projectBody(b,'profile'),back=B.projectBody(b,'back');assert.equal(front.facialGroups.filter(g=>g.role==='eye').length,2);assert.equal(profile.facialGroups.filter(g=>g.role==='eye').length,1);assert.equal(profile.facialGroups.find(g=>g.role==='eye').id,'eye_right');assert.deepEqual(back.facialGroups,[]);assert.deepEqual(back.facialCommands,[]);assert.deepEqual(back.faceGuides,[]);assert.ok(!back.debug.anchors.some(a=>/^(eye|brow|mouth|face|lash)/.test(a.id)));
  for(const scene of [front,profile])for(const g of scene.facialGroups)assert.ok(g.canonicalPosition.every(Number.isFinite));assert.equal(JSON.stringify(b),copy);
 }
});
test('B1-10 Déterminisme, JSON v4 et limitation N2 des yeux sans perte',()=>{
 const b=make('T',{eyeSize:9,mouthShape:'reversedB',lashes:'long'},{shoulderWidth:1.6},{headShape:'rectangle'});assert.equal(b.faceSettings.eyeSize,1.5);assert.equal(b.requestedFaceSettings.eyeSize,9);assert.deepEqual(b.faceCorrections.map(c=>[c.requested,c.applied]),[[9,1.5]]);assert.deepEqual(C.parseBody(C.serializeBody(b)),b);assert.deepEqual(b,make('T',{eyeSize:9,mouthShape:'reversedB',lashes:'long'},{shoulderWidth:1.6},{headShape:'rectangle'}));
 const low=make('M',{eyeSize:-5});assert.equal(low.faceSettings.eyeSize,.5);for(const value of [NaN,Infinity,'1',null])assert.throws(()=>make('T',{eyeSize:value}));for(const bad of [{eyeShape:'unknown'},{lipColor:'url(x)'},{nose:true}])assert.throws(()=>make('T',bad));
 const d=JSON.parse(C.serializeBody(b));d.faceSettings.eyeSize=1;assert.throws(()=>C.parseBody(JSON.stringify(d)));const reordered=JSON.parse(C.serializeBody(b));reordered.parameters=Object.fromEntries(Object.entries(reordered.parameters).reverse());assert.deepEqual(C.parseBody(JSON.stringify(reordered)),b);
});
test('B1-11 Corps/projections R3 identiques hors tête, anciennes sources protégées',()=>{
 for(const category of ['M','F','T'])for(const headShape of Object.keys(FS.heads))for(const extreme of ['min','max']){
  const p=Object.fromEntries(P.schema.map(s=>[s.key,s[extreme]])),choices={headShape,torsoShape:'hourglass',pelvisShape:'trapezoid',limbShape:'rounded'},appearance={fatVolume:.7,pectoralDefinition:.9,abdominalDefinition:.8,chestHairDensity:.5,bellyHairDensity:.6,pubicHairShape:'rectangle',pubicHairDensity:.9};
  const b=make(category,{},p,choices,appearance),old=R3.generateBodyR3(b.seed,b.biologicalProfile,p,choices,appearance);assert.deepEqual(b.volumes.filter(v=>v.id!=='head'),old.volumes.filter(v=>v.id!=='head'));assert.deepEqual(b.finish,old.finish);assert.deepEqual(b.parameters,old.parameters);assert.deepEqual(b.appearance,old.appearance);assert.deepEqual(b.skeleton.joints,old.skeleton.joints);assert.deepEqual(b.skeleton.segments,old.skeleton.segments);
  for(const view of ['front','profile','back'])assert.deepEqual(B.projectBody(b,view).commands.filter(c=>c.id!=='head'),R3B.projectBody(old,view).commands.filter(c=>c.id!=='head'));
 }
 assert.equal(cp.execFileSync('git',['diff','0749e4d4d54ea55a14cf63dda82b32e544e020e8','--','experiments/bio-struct-t3-a','tests/bio-struct-t3-a','preview','engine.js','cognition.js','graphics.js','renderer.js','storage.js','ui.js','interface.js','interface.css','index.html'],{encoding:'utf8'}),'');
});
test('B1-12 Réception esthétique et Safari iPad physique',{skip:'Captures comparatives et catalogues fournis ; validation artistique exclusivement utilisateur.'},()=>{});
