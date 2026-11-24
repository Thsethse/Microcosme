import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {test} from 'node:test';
import {fileURLToPath} from 'node:url';
import {appearanceDocument,characterInput,parseAppearance} from '../appearance.mjs';
import {beardControls,beardDrawVersion,beardFor,beardMarkup,beardPresets,beardZones,drawBeard,normalizeBeard,solveBeard} from '../beard.mjs';
import {choices,restoreSelection} from '../catalogue.mjs';
import {eyePresets,eyesFor} from '../eyes.mjs';
import {character} from '../render.mjs';
import {palette,swatch} from '../../bio-col-01/palette.mjs';
import {controls,model,presets} from '../../preview/bio-vis-p5-i6/model.mjs';

const reference='58d0b37a448ed5248b753a7c8e62fb1b4f77db4d';
const root=fileURLToPath(new URL('../..',import.meta.url)).replace(/\/$/,'');
async function frozen(file) {
  const source=execFileSync('git',['-c','safe.directory='+root,'show',reference+':bio-yeux-01/'+file],
    {cwd:root,encoding:'utf8'});
  const module=source.replace(/(from )'([^']+)'/g,(_,from,path)=>from+JSON.stringify(new URL('../'+path,import.meta.url).href));
  return import('data:text/javascript;base64,'+Buffer.from(module).toString('base64'));
}
const openings=[null,...Object.keys(eyePresets)];
const morph=mask=>Object.fromEntries(Object.entries(controls).map(([key,c],i)=>[key,mask>>i&1?c.max:c.min]));
const zones=Object.keys(beardZones);
const all=Object.fromEntries(zones.map(key=>[key,true]));
const full=normalizeBeard(beardPresets.full.values);
const nose={length:150,bridge:180,wings:160,tip:180,roundness:100,nostrils:180,tilt:100,fills:100,lines:100};
const shorter={length:55,tip:30};
const mouth={width:135,upper:180,lower:180,corners:65,cupid:100,intensity:100,thickness:100};
const details={contours:{upper:250,lower:200},lashes:{count:3,length:15,spacing:100},upper:{count:2,intensity:100},
  lower:{count:2,intensity:100},shadows:{intensity:87,volume:80}};
const brows={arc:82,colourMode:'independent',colour:'roux-cuivre'};
const iris={irisSize:142,pupilSize:62,primary:'gris',secondary:'vert',heterochromia:'complete'};
const stripBeard=svg=>svg.replace(/<g data-bio-facial-hair="">.*?<\/g>/,'');
const selection=restoreSelection({style:'p5-038',arrangement:'G',body:'standard'});
const settings={eyes:null,form:'historical',colour:'chatain-clair',flat:true};

test('T1 · identité des anciens SVG et des six versions d’archives',async ()=>{
  const {character:before}=await frozen('render.mjs');
  const {appearanceDocument:oldArchive}=await frozen('appearance.mjs');
  let checks=0;
  for (const {style,arrangement} of choices) for (const scale of [{headOnly:true},{},{headOnly:true,smallScale:true}]) {
    const input={...presets.tall.values,style,arrangement};
    const options={...scale,eyes:'narrow',iris,details,brows,mouth,nose,hairColor:'bleu-vif',instance:'historique'};
    const expected=before(input,options);
    assert.equal(character(input,{...options,beard:'historical'}),expected);
    assert.equal(character(input,{...options,beardCategory:'F',beard:full}),expected);
    checks+=2;
  }
  const features={};
  for (const [index,feature] of [null,'iris','details','brows','mouth','nose'].entries()) {
    if (feature) features[feature]={};
    const args={...settings,...features};
    const data=oldArchive(selection,args);
    assert.equal(data.version,index+1);
    assert.deepEqual(appearanceDocument(selection,parseAppearance(JSON.stringify(data))),data);
  }
  console.log('T1',JSON.stringify({checks,archives:6}));
});

test('T2 · douze silhouettes obtenues par les mêmes six zones',()=>{
  const signatures=new Set();
  for (const {values} of Object.values(beardPresets)) {
    const fromPreset=beardFor({},null,values);
    const rebuilt=beardFor({},null,normalizeBeard(values));
    assert.equal(beardMarkup(fromPreset),beardMarkup(rebuilt));
    signatures.add(fromPreset.path);
  }
  assert.equal(signatures.size,12);
  assert(signatures.has(''));
});

test('T3 · les 64 masques produisent les zones demandées, peintes en une fois',()=>{
  const distinct=new Set();
  for (let mask=0;mask<64;mask++) {
    const selected=Object.fromEntries(zones.map((key,i)=>[key,!!(mask>>i&1)]));
    const result=beardFor({},null,{...full,zones:selected,density:50});
    assert.deepEqual(result.effective.zones,selected);
    const svg=beardMarkup(result);
    assert.equal((svg.match(/<path /g)??[]).length,mask===0?0:1);
    assert.doesNotMatch(svg,/opacity|clip-path|mask=|gradient|<image/);
    distinct.add(result.path);
    assert.equal(result.paint.fill,beardFor({},null,{...full,density:50}).paint.fill);
  }
  assert.equal(distinct.size,64);
});

test('T4 · paramètres indépendants, balayage utile et valeurs latentes',()=>{
  const base=beardFor({},null,full);
  let points=0;
  const changedZones={
    length:['cheeks','chin','jaw'],volume:['cheeks','chin','jaw'],chinShape:['chin','jaw'],
    sideburnLength:['sideburns','cheeks'],sideburnWidth:['sideburns','cheeks'],
    moustacheWidth:['moustache'],moustacheThickness:['moustache'],moustacheCurl:['moustache'],density:[]
  };
  for (const key of Object.keys(beardControls)) {
    const [min,max]=base.domains[key];
    const samples=Array.from({length:Math.floor(max)-Math.ceil(min)+1},(_,i)=>Math.ceil(min)+i);
    const seen=new Set();
    for (const value of samples) {
      const view=beardFor({},null,{...full,[key]:value});
      assert.equal(view.requested[key],value);
      assert.equal(view.effective[key],value);
      if (value>0||key!=='density') for(const zone of zones) if(!changedZones[key].includes(zone)) {
        assert.deepEqual(view.polygons[zone],base.polygons[zone],key+' / '+zone);
      }
      seen.add(beardMarkup(view));
      points++;
    }
    assert.equal(seen.size,samples.length,key);
  }
  const request={...full,moustacheThickness:95,moustacheCurl:42};
  const tight=beardFor({},null,request,{nose,mouth});
  assert(tight.effective.moustacheThickness<95||!tight.effective.zones.moustache);
  assert.deepEqual(tight.requested,request);
  const opened=beardFor({},null,tight.requested,{nose:shorter});
  assert.equal(opened.effective.moustacheThickness,95);
  const off=beardFor({},null,{...request,zones:{moustache:true},density:0});
  assert.deepEqual(off.domains.moustacheCurl,[]);
  assert.deepEqual(off.domains.density,[0,100]);
  assert.equal(off.requested.moustacheCurl,42);
  const restored=beardFor({},null,{...off.requested,density:100},{nose:shorter});
  assert.equal(restored.effective.moustacheCurl,42);
  console.log('T4',JSON.stringify({points,tight:tight.domains.moustacheThickness,open:opened.domains.moustacheThickness}));
});

test('T5 · densités, palette complète et isolation des cheveux et sourcils',()=>{
  const natural=palette.filter(s=>s.category==='natural').length;
  assert.equal(natural,14);
  assert.equal(palette.length-natural,12);
  const input={style:'p5-038',arrangement:'G'};
  const options={hairColor:'bleu-vif',rememberedHairColor:'bleu-vif',brows,instance:'pigments'};
  const untreated=character(input,options);
  for (const item of palette) {
    const beard={...full,colourMode:'independent',colour:item.id};
    const {paint}=beardFor(input,null,beard,options);
    assert.deepEqual(paint,{fill:item.fill,stroke:item.stroke});
    assert.equal(stripBeard(character(input,{...options,beard})),untreated);
  }
  const linked=beardFor(input,null,full,options);
  const darker=beardFor(input,null,{...full,colourMode:'darker',colour:'rose-clair'},options);
  assert.equal(linked.pigment.fill,swatch('bleu-vif').fill);
  assert.notEqual(linked.pigment.fill,darker.pigment.fill);
  assert.equal(darker.requested.colour,'rose-clair');
  const densities=new Set([0,17,52,100].map(density=>beardMarkup(beardFor(input,null,{...full,density},options))));
  assert.equal(densities.size,4);
  assert(densities.has(''));
});

function polygonOverlaps(polygon,box) {
  // Intersect each edge with the inset safety box. The polygons trace a
  // narrow implanted band, and the box corners also check containment.
  const inset=.00011;
  const l=box.left+inset,r=box.right-inset,t=box.top+inset,b=box.bottom-inset;
  const crosses=(x,y,dx,dy)=>{
    let low=0,high=1;
    for (const [p,q] of [[-dx,x-l],[dx,r-x],[-dy,y-t],[dy,b-y]]) {
      if (!p&&q<0) return false;
      if (p<0) low=Math.max(low,q/p);
      if (p>0) high=Math.min(high,q/p);
    }
    return low<=high;
  };
  let containsCorner=false;
  for (const [[x,y],[a,c]] of polygon.map((point,i)=>[point,polygon[(i+1)%polygon.length]])) {
    if (crosses(x,y,a-x,c-y)) return true;
    if ((y>t)!==(c>t)&&l<(a-x)*(t-y)/(c-y)+x) containsCorner=!containsCorner;
  }
  return containsCorner;
}

test('T6 · bords peints, nez et bouche à leurs ancrages et dépassements admissibles',()=>{
  let cases=0,protrusions=0;
  const extreme={...full,length:100,volume:100,chinShape:100,sideburnLength:0,sideburnWidth:100,
    moustacheWidth:100,moustacheThickness:100,moustacheCurl:100,zones:all};
  function verify(input,eyes,settings) {
    const {frame,polygons,path}=beardFor(input,eyes,extreme,settings);
    const segments=Object.values(polygons).flat();
    assert.ok(path);
    for (const poly of segments) {
      assert(poly.length>2&&poly.every(point=>point.every(Number.isFinite)));
      assert(!frame.obstacles.some(box=>polygonOverlaps(poly,box)),JSON.stringify({input,eyes,settings}));
    }
    if(segments.some(poly=>poly.some(([,y])=>y>frame.chin+1))) protrusions++;
    assert.equal(stripBeard(character(input,{...settings,eyes,beard:extreme})),character(input,{...settings,eyes}));
    cases++;
  }
  for(let mask=0;mask<256;mask++) verify(morph(mask),openings[mask%9],{});
  for(const input of [{},presets.tall.values,presets.broad.values,morph(0),morph(255),morph(83)]) {
    for(const eyes of openings) {
      verify(input,eyes,{nose,mouth,details});
      verify(input,eyes,{nose:shorter,details});
    }
  }
  assert.equal(protrusions,cases);
  console.log('T6',JSON.stringify({cases,protrusions}));
});

test('T7 · autorisations H/F/T et aucune règle d’âge',()=>{
  const input={style:'p5-038',beardCategory:'F'};
  const render=beardCategory=>character(input,{beard:full,beardCategory});
  assert.equal(render('F'),character(input));
  assert.equal(render(undefined),character(input));
  assert.equal(render('H'),render('T'));
  assert.notEqual(render('H'),render('F'));
  const blocked=beardFor(input,null,full,{category:'F'});
  assert.deepEqual(blocked.requested,full);
  assert(Object.values(blocked.domains).every(values=>values.length===0));
  assert.throws(()=>drawBeard(input,null,'F',{category:'F'}));
  const face=model(input), opening=eyesFor(input,null);
  const elder={...face,base:{...face.base,parameters:{...face.base.parameters,age:'elder'}}};
  assert.equal(solveBeard(elder,opening,full).path,solveBeard(face,opening,full).path);
});

test('T8 · sauvegarde froide, graines reproductibles et échantillonnage conditionnel',()=>{
  const seed='Retour de l’atelier';
  const input=characterInput(selection);
  const args={nose,mouth,details,brows,iris};
  const draw=drawBeard(input,null,seed,{...args,category:'T'});
  const archive={...settings,...args,beard:draw,beardDraw:{version:beardDrawVersion,seed}};
  for (const beardCategory of ['H','F','T']) {
    const data=appearanceDocument(selection,{...archive,beardCategory});
    const loaded=parseAppearance(JSON.stringify(data));
    assert.deepEqual(appearanceDocument(loaded.selection,loaded),data);
    assert.equal(loaded.beardCategory,beardCategory);
    assert.deepEqual(loaded.beard,draw);
    const renderOptions={...args,hairColor:settings.colour,beardCategory};
    assert.equal(character(characterInput(loaded.selection),{...renderOptions,beard:loaded.beard}),
      character(input,{...renderOptions,beard:draw}));
    assert.throws(()=>parseAppearance(JSON.stringify({...data,facialHair:{...data.facialHair,effective:{}}})));
  }
  const latent=appearanceDocument(selection,{...settings,beardLatent:draw,beardDraw:archive.beardDraw});
  assert.deepEqual(parseAppearance(JSON.stringify(latent)).beardLatent,draw);
  assert.deepEqual(drawBeard(input,null,seed,{...args,category:'T'}),draw);
  const observed=Object.fromEntries(zones.map(key=>[key,0]));
  const masks=new Set(), colours=new Set(), modes=new Set();
  const count=768;
  let eligibleMoustaches=0;
  for(let i=0;i<count;i++) {
    const opts=i%2?{nose,mouth}:{nose:shorter};
    const request=drawBeard(input,null,String(i),opts);
    const solved=beardFor(input,null,request,opts);
    eligibleMoustaches+=Number(solved.available.moustache);
    assert.deepEqual(solved.effective.zones,request.zones);
    for(const key of Object.keys(beardControls)) {
      if(solved.domains[key].length) assert.equal(solved.effective[key],request[key]);
    }
    masks.add(Object.values(request.zones).join(','));
    modes.add(request.colourMode);
    colours.add(request.colour);
    for(const key of zones) observed[key]+=Number(request.zones[key]);
  }
  assert.equal(masks.size,64);
  assert.equal(modes.size,3);
  assert.equal(colours.size,26);
  for(const [key,n] of Object.entries(observed)) {
    const eligible=key==='moustache'?eligibleMoustaches:count;
    assert(Math.abs(n-eligible/2)<3.5*Math.sqrt(eligible/4),key);
  }
  console.log('T8',JSON.stringify({count,masks:masks.size,colours:colours.size,eligibleMoustaches,zones:observed}));
});
