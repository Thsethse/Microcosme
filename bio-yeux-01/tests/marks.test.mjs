import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {test} from 'node:test';
import {fileURLToPath} from 'node:url';
import {appearanceDocument,characterInput,parseAppearance} from '../appearance.mjs';
import {beardPresets} from '../beard.mjs';
import {choices,restoreSelection} from '../catalogue.mjs';
import {eyePresets,eyesFor} from '../eyes.mjs';
import {freckleCases,freckleDensities} from '../marks-study.mjs';
import {groupMarkAxes,individualMarkAxes,markPigment,marksFor,marksMarkup,markTones,markTypes,markZones,normalizeMarks,solveMarks} from '../marks.mjs';
import {character} from '../render.mjs';
import {bodies,controls,model,presets} from '../../preview/bio-vis-p5-i6/model.mjs';
import {luminance} from '../../bio-col-01/palette.mjs';

const ref='46b7f53330462d23593e6a2577e3cb086160df11';
const root=fileURLToPath(new URL('../..',import.meta.url)).replace(/\/$/,'');
async function frozen(file) {
  const source=execFileSync('git',['-c','safe.directory='+root,'show',ref+':bio-yeux-01/'+file],{cwd:root,encoding:'utf8'});
  const module=source.replace(/(from )'([^']+)'/g,(_,from,path)=>from+JSON.stringify(new URL('../'+path,import.meta.url).href));
  return import('data:text/javascript;base64,'+Buffer.from(module).toString('base64'));
}
const options={
  nose:{length:142,bridge:175,wings:155,tip:171,nostrils:180,tilt:-100,fills:85,lines:88},
  mouth:{width:130,upper:173,lower:171,thickness:88,intensity:75},
  brows:{arc:82},details:{lashes:{count:3,length:15}},iris:{pupilSize:73},
  beard:beardPresets.full.values,instance:'marks-proof'
};
const marks=normalizeMarks(Object.keys(markTypes).map((type,i)=>({id:'m'+(i+1),type})));
const freckles=normalizeMarks([{id:'m1',type:'freckles',seed:'Amande'}])[0];
const scale=[{headOnly:true},{},{headOnly:true,smallScale:true}];
const digest=result=>marksMarkup(result);
const sites=result=>result.effective[0].sites.map(({id,x,y})=>[id,x,y]);
const positions=result=>result.marks[0].points.map(({id,geometry})=>[id,geometry.x,geometry.y]);
const selection=restoreSelection({style:'p5-038',arrangement:'G',body:'standard'});
const settings={eyes:null,form:'historical',colour:'chatain-clair',flat:true};
const opening=[null,...Object.keys(eyePresets)];
const morph=mask=>Object.fromEntries(Object.entries(controls).map(([key,c],i)=>[key,mask>>i&1?c.max:c.min]));

test('T1 · SVG hérités et sept versions d’archives exactes',async()=>{
  const {character:before}=await frozen('render.mjs');
  const {appearanceDocument:legacy}=await frozen('appearance.mjs');
  let count=0;
  for(const {style,arrangement} of choices) for(const size of scale){
    const input={...presets.tall.values,style,arrangement};
    const config={...options,...size,eyes:'narrow'};
    const expected=before(input,config);
    assert.equal(character(input,{...config,marks:[]}),expected);
    assert.equal(character(input,{...config,marks:'historical'}),expected);
    count+=2;
  }
  const features={};
  for(const [i,key] of [null,'iris','details','brows','mouth','nose','beard'].entries()){
    if(key) features[key]=options[key];
    const data=legacy(selection,{...settings,...features});
    assert.equal(data.version,i+1);
    assert.deepEqual(appearanceDocument(selection,parseAppearance(JSON.stringify(data))),data);
  }
  console.log('T1',JSON.stringify({svg:count,archives:7}));
});

test('T2 · quatre familles combinées, deux modes pigmentaires et asymétrie',()=>{
  const result=marksFor({},null,marks,{withDomains:true});
  assert.equal(result.marks.length,5);
  assert(result.marks.every(mark=>mark.points.length));
  const tree=character({},{headOnly:true,marks});
  for(const type of Object.keys(markTypes)) assert(tree.includes('data-mark-family="'+type+'"'));
  assert.equal(result.marks[0].points.length,1);
  assert.equal(result.marks[1].points.length,1);
  assert.notEqual(result.marks[0].points[0].geometry.x,160-result.marks[1].points[0].geometry.x);
  assert.throws(()=>normalizeMarks([marks[0],marks[0]]));
});

test('T3 · variations individuelles, formes et restauration des demandes',()=>{
  const value={...marks[1],x:25,y:75,size:30};
  const basis=marksFor({},null,[value],{withDomains:true});
  assert(Object.keys(individualMarkAxes).every(key=>basis.marks[0].domains[key].length>1));
  let ticks=0;
  for(const key of Object.keys(individualMarkAxes)){
    const domain=basis.marks[0].domains[key];
    const samples=['x','y','intensity'].includes(key)?domain: Array.from({length:1+Math.floor(domain.at(-1))},(_,i)=>i);
    const signatures=new Set();
    for(const step of samples){
      const withStep=marksFor({},null,[{...value,[key]:step}]);
      if(!['x','y','intensity'].includes(key)) assert.deepEqual(positions(withStep),positions(basis));
      signatures.add(digest(withStep));
      ticks++;
    }
    assert.equal(signatures.size,samples.length,key);
  }
  const forms=Object.keys({circle:0,oval:0,irregular:0,diffuse:0}).map(shape=>digest(marksFor({},null,[{...value,shape}])));
  assert.equal(new Set(forms).size,4);
  const circular=marksFor({},null,[{...value,shape:'circle',angle:134}],{withDomains:true});
  assert.deepEqual(circular.marks[0].domains.angle,[]);
  assert.equal(circular.requested[0].angle,134);
  assert.equal(marksFor({},null,[{...circular.requested[0],shape:'oval'}]).effective[0].angle,134);
  const oversized=marksFor({},null,[{...value,x:12,y:64,size:100}],{withDomains:true});
  assert(oversized.effective[0].size<100);
  assert.equal(oversized.requested[0].size,100);
  assert.equal(marksFor({},null,[{...oversized.requested[0],x:50,y:29}]).effective[0].size,100);
  const zero=marksFor({},null,[{...value,intensity:0}],{withDomains:true});
  assert.equal(digest(zero),'');
  assert.deepEqual(zero.marks[0].domains.x,[]);
  console.log('T3',JSON.stringify({ticks}));
});

test('T4 · densité sans cran inerte, six guides, répartition stable et écarts organiques',()=>{
  const maximum=marksFor({},null,[{...freckles,density:100}],{withDomains:true});
  const axis=maximum.marks[0].domains;
  assert(Object.keys(groupMarkAxes).every(key=>axis[key].length>1));
  let previous=0;
  for(const n of axis.density.slice(1)){
    const sample=marksFor({},null,[{...freckles,density:n}]);
    assert.equal(sample.effective[0].visible,++previous);
    assert.deepEqual(sites(sample),sites(maximum).slice(0,sample.effective[0].count));
  }
  const spread=marksFor({},null,[{...freckles,density:100,extent:0}]);
  assert.deepEqual(sites(spread).map(p=>p[0]),sites(maximum).map(p=>p[0]));
  assert.notDeepEqual(sites(spread),sites(maximum));
  for(const key of ['size','sizeVariation','intensity','tone']){
    const alternate=marksFor({},null,[{...freckles,density:100,[key]:key==='tone'?'light':100}]);
    assert.deepEqual(sites(alternate),sites(maximum));
    assert.notEqual(digest(alternate),digest(maximum));
  }
  for(const zone of Object.keys(markZones)){
    const result=marksFor({},null,[{...freckles,zones:[zone],density:100}]);
    assert(result.effective[0].visible>0,zone);
    assert(sites(result).every(([id])=>id.startsWith('m1-'+zone+'-')));
  }
  const paths=new Set(), counts={left:0,right:0,nose:0,cheeks:0};
  for(let seed=0;seed<128;seed++){
    const items=[{...freckles,seed:'Recette '+seed}];
    const sample=marksFor({},null,items);
    assert.deepEqual(sites(sample),sites(marksFor({},null,items)));
    paths.add(digest(sample));
    for(const [id,x] of sites(sample)){
      counts[x<50?'left':'right']++;
      counts[id.includes('-nose-')?'nose':'cheeks']++;
    }
  }
  assert.equal(paths.size,128);
  assert(Math.abs(counts.left-counts.right)<200);
  assert(counts.cheeks>1.7*counts.nose&&counts.cheeks<3*counts.nose);
  console.log('T4',JSON.stringify({densityTicks:previous,seeds:paths.size,counts}));
});

test('T5 · contrastes et emprises des taches de rousseur aux quatre cas de la planche',()=>{
  const report=[];
  for(const study of freckleCases) for(const [density] of freckleDensities) {
    const result=marksFor(study.face,null,[{...freckles,id:'m1',seed:study.seed,density}]);
    const points=result.marks[0].points;
    assert(points.length>6);
    assert(new Set(points.map(p=>p.geometry.r.toFixed(3))).size>=Math.min(7,points.length));
    assert(points.some(p=>p.id.includes('-nose-'))&&points.some(p=>p.id.includes('-cheeks-')));
    assert(points.every(p=>p.geometry.r<=.82));
    report.push(points.length);
  }
  console.log('T5',JSON.stringify({counts:report}));
});

test('T6 · les quatre teintes sont dérivées des quatre teintes d’étude héritées',()=>{
  const asHex=css=>'#'+css.match(/\d+/g).map(n=>Number(n).toString(16).padStart(2,'0')).join('');
  for(const {skin} of freckleCases){
    const colors=Object.keys(markTones).map(tone=>asHex(markPigment(skin,tone,.47)));
    assert.equal(new Set(colors).size,4);
    assert(luminance(colors[3])>luminance(skin));
    assert(luminance(colors[1])<luminance(colors[0]));
    for(const tone of Object.keys(markTones)) assert.equal(asHex(markPigment(skin,tone,0)),skin);
  }
});

test('T7 · contour réel, ouvertures, lèvres et narines, ancrages stables',()=>{
  const stress=[{...freckles,density:100,extent:0,size:100,sizeVariation:100,zones:Object.keys(markZones)},
    {...marks[1],id:'m2',size:100,elongation:100,angle:52},{...marks[2],id:'m3',shape:'diffuse',size:100,elongation:100}];
  const reference=sites(marksFor({},null,stress));
  let rendered=0;
  for(let k=0;k<256;k++){
    const input=morph(k);
    const result=marksFor(input,opening[k%opening.length],stress,k%8===0?options:{});
    assert.deepEqual(sites(result),reference);
    for(const mark of result.marks) for(const point of mark.points){
      assert.equal(result.frame.obstruction(point.geometry.box),null);
      rendered++;
    }
  }
  const portrait={style:'shaved'};
  const held=[{id:'m1',type:'mole',x:29,y:73},{id:'m2',type:'mole',x:80,y:17}];
  const captured=character(portrait,{headOnly:true,marks:held});
  const masked=character({style:'p5-038'},{headOnly:true,marks:held,beard:options.beard});
  assert(masked.indexOf('data-bio-marks')<masked.indexOf('data-bio-facial-hair'));
  assert.equal(character(portrait,{headOnly:true,marks:held}),captured);
  console.log('T7',JSON.stringify({morphs:256,points:rendered}));
});

test('T8 · archives v8, graine et identifiants après restauration à froid',()=>{
  const input=characterInput(selection);
  const selected=[...marks,{...freckles,id:'m6',seed:'Amande ✦',zones:['cheeks','perioral']},{...marks[0],id:'m7',x:0,y:0}];
  for(const mode of ['custom','historical']){
    const source=appearanceDocument(selection,{...settings,...options,[mode==='custom'?'marks':'marksLatent']:selected});
    const restored=parseAppearance(JSON.stringify(source));
    assert.equal(source.version,8);
    assert.deepEqual(appearanceDocument(restored.selection,restored),source);
    const render={...options,marks:mode==='custom'?selected:null};
    assert.equal(character(characterInput(restored.selection),{...render,marks:restored.marks}),character(input,render));
  }
  const doc=appearanceDocument(selection,{...settings,marks:selected});
  doc.marks.effective[0].id='m999';
  assert.throws(()=>parseAppearance(JSON.stringify(doc)));
});

test('T9 · trois tailles, catalogue, six corps et compatibilité du modèle âgé',()=>{
  let renders=0;
  for(const input of [...choices,...Object.keys(bodies).map(body=>({body}))]) for(const size of scale){
    const svg=character(input,{...size,marks});
    assert(svg.includes('data-bio-marks'));
    renders++;
  }
  const face=model({});
  const aged={...face,base:{...face.base,parameters:{...face.base.parameters,age:'elder'}}};
  assert.equal(digest(solveMarks(aged,eyesFor({},null),marks)),digest(solveMarks(face,eyesFor({},null),marks)));
  for(const beardCategory of ['H','F','T']) assert(character({},{headOnly:true,marks,beardCategory}).includes('data-bio-marks'));
  console.log('T9',JSON.stringify({renders}));
});
