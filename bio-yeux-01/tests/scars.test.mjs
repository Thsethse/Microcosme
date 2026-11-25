import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {test} from 'node:test';
import {fileURLToPath} from 'node:url';
import {appearanceDocument,characterInput,parseAppearance} from '../appearance.mjs';
import {beardPresets} from '../beard.mjs';
import {choices,restoreSelection} from '../catalogue.mjs';
import {eyePresets,eyesFor} from '../eyes.mjs';
import {character} from '../render.mjs';
import {drawScar,normalizeScars,scarAxes,scarColours,scarPresets,scarStages,scarsFor,solveScars} from '../scars.mjs';
import {scarCases,scarCards} from '../scars-study.mjs';
import {bodies,controls,model,presets} from '../../preview/bio-vis-p5-i6/model.mjs';

const ref='a7735b01ad127badfb4613ec45c148afe186d4bd';
const root=fileURLToPath(new URL('../..',import.meta.url)).replace(/\/$/,'');
async function frozen(file) {
  const source=execFileSync('git',['-c','safe.directory='+root,'show',ref+':bio-yeux-01/'+file],{cwd:root,encoding:'utf8'});
  const module=source.replace(/(from )'([^']+)'/g,(_,from,path)=>from+JSON.stringify(new URL('../'+path,import.meta.url).href));
  return import('data:text/javascript;base64,'+Buffer.from(module).toString('base64'));
}
const variants=Object.values(scarPresets).map(({values},i)=>({id:'s'+(i+1),...values}));
const selections=restoreSelection({style:'p5-038',arrangement:'G',body:'standard'});
const config={eyes:null,form:'historical',colour:'chatain-clair',flat:true};
const optics={iris:{pupilSize:71},details:{lashes:{count:3,length:13}},brows:{arc:78},
  mouth:{width:124,upper:168,lower:159,thickness:88,intensity:74},
  nose:{length:102,tip:133,nostrils:180,lines:70},beard:beardPresets.full.values,
  marks:[{id:'m1',type:'freckles',seed:'Recette historique'},{id:'m2',type:'mole'}]};
const scale=[{headOnly:true},{},{headOnly:true,smallScale:true}];
const openings=[null,...Object.keys(eyePresets)];
const morph=mask=>Object.fromEntries(Object.entries(controls).map(([key,c],i)=>[key,mask>>i&1?c.max:c.min]));
const trace={id:'s1',x:50,y:62,length:29,width:23,traces:2,spacing:27,curve:30,angle:71,irregularity:38};
const cross=[{id:'s1',x:30,y:52,angle:88,length:80,width:37},{id:'s2',x:50,y:75,angle:90,length:71,width:40},
  {id:'s3',x:50,y:68,angle:0,length:62,width:48,irregularity:0}];
const signature=(input,scar,options={})=>character(input,{headOnly:true,instance:'signature',...options,scars:[scar]});
const projection=result=>result.items[0].geometry?.layers;
const centre=poly=>poly.reduce(([x,y],[a,b])=>[x+a/poly.length,y+b/poly.length],[0,0]);

test('T1 · 756 comparaisons historiques et huit versions d’archives',async()=>{
  const {character:legacy}=await frozen('render.mjs');
  const {appearanceDocument:archive}=await frozen('appearance.mjs');
  let svg=0;
  for(const {style,arrangement} of choices) for(const view of scale){
    const input={...presets.broad.values,style,arrangement};
    const options={...view,...optics,eyes:'almond',instance:'heritage'};
    const before=legacy(input,options);
    assert.equal(character(input,{...options,scars:[]}),before);
    assert.equal(character(input,{...options,scars:'historical'}),before);
    svg+=2;
  }
  const state={};
  for(const [i,key] of [null,'iris','details','brows','mouth','nose','beard','marks'].entries()){
    if(key) state[key]=optics[key];
    const old=archive(selections,{...config,...state});
    assert.equal(old.version,i+1);
    assert.deepEqual(appearanceDocument(selections,parseAppearance(JSON.stringify(old))),old);
  }
  console.log('T1',JSON.stringify({svg,archives:8}));
});

test('T2 · les deux géométries engendrent les six formes combinables',()=>{
  const result=scarsFor({},'almond',variants);
  assert.deepEqual([...new Set(result.requested.map(s=>s.mode))],['line','patch']);
  assert(result.items.every(s=>s.geometry));
  const signatures=variants.map(scar=>signature({}, {...scar,id:'s1',seed:'commun'}));
  assert.equal(new Set(signatures).size,6);
  const combined=character({}, {scars:variants});
  assert.equal((combined.match(/data-scar-id=/g)??[]).length,6);
  assert.throws(()=>normalizeScars([trace,trace]));
});

test('T3 · les douze paramètres ont un effet utile et des valeurs latentes',()=>{
  assert.equal(Object.keys(scarAxes).length+1,12);
  const input={};
  const reference=scarsFor(input,null,[trace],{withDomains:true});
  const ranges=reference.items[0].domains;
  let checked=0;
  for(const key of Object.keys(scarAxes)){
    const domain=ranges[key];
    assert(domain.length>1,key);
    const low=domain[0],high=domain.at(-1);
    const samples=['x','y','traces'].includes(key)?domain.filter((_,i)=>i%11===0||i===domain.length-1):
      Array.from({length:11},(_,i)=>low+(high-low)*i/10);
    const signatures=new Set(samples.map(value=>signature(input,{...trace,[key]:value})));
    assert.equal(signatures.size,samples.length,key);
    checked+=samples.length;
  }
  assert.notEqual(signature({},trace),signature({},{...trace,sutures:true}));
  assert.equal(signature({},{...trace,curve:0,irregularity:0,angle:25}),signature({},{...trace,curve:0,irregularity:0,angle:205}));
  assert.equal(signature({},{...trace,angle:0}),signature({},{...trace,angle:360}));
  const latent=scarsFor({},null,[{...trace,mode:'patch',sutures:true}],{withDomains:true});
  assert.deepEqual(latent.items[0].domains.curve,[]);
  assert.equal(latent.items[0].domains.sutures,false);
  assert.equal(latent.requested[0].curve,trace.curve);
  assert.equal(scarsFor({},null,[{...latent.requested[0],mode:'line'}]).effective[0].curve,trace.curve);
  const boundary={...trace,x:8,y:62,length:91,width:88,angle:25};
  const limited=scarsFor({},null,[boundary],{withDomains:true});
  assert.equal(limited.requested[0].length,91);
  assert(limited.effective[0].length===null||limited.effective[0].length<91);
  assert.equal(scarsFor({},null,[{...limited.requested[0],x:50,length:35,width:35}]).effective[0].length,35);
  console.log('T3',JSON.stringify({axes:12,sampled:checked+2,limited:limited.effective[0].length}));
});

test('T4 · traces parallèles, sutures cicatrisées et surface irrégulière',()=>{
  const input={...trace,traces:5,angle:90,width:19,curve:0,irregularity:0};
  const narrow=scarsFor({},null,[{...input,spacing:0}]);
  const wide=scarsFor({},null,[{...input,spacing:80}]);
  const separation=result=>Math.abs(centre(projection(result).rim[0])[0]-centre(projection(result).rim.at(-1))[0]);
  assert.equal(projection(narrow).rim.length,5);
  assert(separation(wide)>separation(narrow)+5);
  const sutured=scarsFor({},null,[{...input,traces:1,sutures:true}]);
  assert(projection(sutured).suture.length>=4);
  assert.equal(projection(sutured).rim.length,1);
  const patch=scarsFor({},null,[{...input,mode:'patch',sutures:true}]);
  assert.equal(projection(patch).rim.length,1);
  assert.equal(projection(patch).suture.length,0);
  assert.notDeepEqual(projection(patch).rim,projection(scarsFor({},null,[{...input,mode:'patch',irregularity:93}])).rim);
});

test('T5 · maturation chromatique et géométrique distincte de l’intensité',()=>{
  const recent=scarsFor({},null,[{...trace,maturity:0,intensity:30}]);
  const more=scarsFor({},null,[{...trace,maturity:0,intensity:85}]);
  const old=scarsFor({},null,[{...trace,maturity:70,intensity:30}]);
  assert.deepEqual(projection(recent),projection(more));
  assert.deepEqual(projection(recent).rim,projection(old).rim);
  assert.notDeepEqual(projection(recent).centre,projection(old).centre);
  const four=scarStages.map(([maturity])=>scarColours('#dbbf88',maturity,75).centre);
  assert.equal(new Set(four).size,4);
  assert.equal(scarCards(scarCases[0]).length,10);
  const zero=scarsFor({},null,[{...trace,intensity:0}],{withDomains:true});
  assert.equal(projection(zero),undefined);
  assert.deepEqual(zero.items[0].domains.maturity,[]);
});

test('T6 · nuances et relief adaptés aux carnations',()=>{
  const channels=value=>value.match(/[\d.]+/g).map(Number);
  for(const {skin} of scarCases){
    const recent=scarColours(skin,0,85);
    const faded=scarColours(skin,100,85);
    const base=scarColours(skin,35,0);
    assert.equal(new Set(Object.values(base)).size,1);
    assert.equal(new Set(Object.values(recent)).size,4);
    const delta=ink=>channels(ink).reduce((sum,n,i)=>sum+Math.abs(n-channels(base.centre)[i]),0);
    assert(delta(recent.centre)>delta(faded.centre));
    assert.notEqual(recent.rim,faded.rim);
  }
});

test('T7 · placement cutané, réserves, morphologies et ordre du masquage',()=>{
  const reserve=scarsFor({},'almond',cross,{nose:optics.nose,mouth:{}});
  assert(reserve.effective[0].interruptions.includes('yeux'));
  assert(reserve.effective[1].interruptions.includes('lèvres'));
  assert(reserve.effective[2].interruptions.includes('narines'));
  const extreme=[{...trace,x:18,y:74,width:100,length:100,spacing:100,traces:5,sutures:true,irregularity:100,angle:135},
    {id:'s2',mode:'patch',x:69,y:68,width:100,length:100,angle:123,irregularity:100}];
  let painted=0,reduced=0;
  for(let mask=0;mask<256;mask++){
    const input=morph(mask);
    const result=scarsFor(input,openings[mask%openings.length],extreme,mask%11===0?optics:{});
    assert.deepEqual(result.requested,normalizeScars(extreme));
    for(const item of result.items){
      if(!item.geometry) continue;
      if(item.effective.length<item.requested.length||item.effective.width<item.requested.width) reduced++;
      for(const part of Object.values(item.geometry.layers).flat()) for(const [x,y] of part) {
        assert(result.frame.plane.contains({left:x,right:x,top:y,bottom:y}),JSON.stringify({mask,id:item.requested.id}));
        painted++;
      }
    }
  }
  const p={style:'p5-038'};
  const svg=character(p,{...optics,scars:cross});
  assert(svg.indexOf('data-bio-brows')<svg.indexOf('data-bio-scars'));
  assert(svg.indexOf('data-bio-scars')<svg.indexOf('data-bio-facial-hair'));
  assert(svg.indexOf('data-bio-scars')<svg.indexOf('data-layer="front"'));
  console.log('T7',JSON.stringify({morphs:256,vertices:painted,reduced}));
});

test('T8 · huit archives héritées, v9 à froid et tirages admissibles',()=>{
  const input=characterInput(selections);
  const scars=[...variants,{id:'s7',x:0,y:0,seed:'mémoire'}];
  for(const mode of ['custom','historical']){
    const data=appearanceDocument(selections,{...config,...optics,[mode==='custom'?'scars':'scarsLatent']:scars});
    const restored=parseAppearance(JSON.stringify(data));
    assert.equal(data.version,9);
    assert.deepEqual(appearanceDocument(restored.selection,restored),data);
    assert.equal(character(characterInput(restored.selection),{...optics,scars:restored.scars}),
      character(input,{...optics,scars:mode==='custom'?scars:null}));
  }
  const doc=appearanceDocument(selections,{...config,scars});
  doc.scars.effective[0].id='s88';
  assert.throws(()=>parseAppearance(JSON.stringify(doc)));
  const signatures=new Set(),count=96;
  for(let n=0;n<count;n++){
    const seed='Trace ✦ '+n, face=morph(n), eyes=openings[n%openings.length];
    const draw=drawScar(face,eyes,'s1',seed);
    assert.deepEqual(drawScar(face,eyes,'s1',seed),draw);
    const {effective:[result]}=scarsFor(face,eyes,[draw]);
    assert.equal(result.reason,null);
    assert.equal(result.length,draw.length);
    assert.equal(result.width,draw.width);
    if(draw.traces>1) assert.equal(result.spacing,draw.spacing);
    signatures.add(JSON.stringify(draw));
  }
  assert.equal(signatures.size,count);
  console.log('T8',JSON.stringify({seeds:count}));
});

test('T9 · compatibilité aux trois échelles, corps, coiffures et états hérités',()=>{
  let renders=0;
  for(const input of [...choices,...Object.keys(bodies).map(body=>({body}))]) for(const view of scale){
    assert(character(input,{...view,scars:variants.slice(0,1)}).includes('data-bio-scars'));
    renders++;
  }
  const face=model({}),opening=eyesFor({},null);
  const elder={...face,base:{...face.base,parameters:{...face.base.parameters,age:'elder'}}};
  assert.deepEqual(solveScars(face,opening,variants).effective,solveScars(elder,opening,variants).effective);
  for(const beardCategory of ['H','F','T']) assert(character({},{scars:variants,beardCategory}).includes('data-bio-scars'));
  console.log('T9',JSON.stringify({renders}));
});
