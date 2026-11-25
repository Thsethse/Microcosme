import assert from 'node:assert/strict';
import {test} from 'node:test';
import {adultBodyGeometry} from '../adult-body.mjs';
import {appearanceDocument, characterInput, parseAppearance} from '../appearance.mjs';
import {structureControls} from '../body-structure.mjs';
import {restoreSelection} from '../catalogue.mjs';
import {chestControls, chestGeometry, chestMarkup, chestPresets, referenceChest, validateChest} from '../chest.mjs';
import {character} from '../render.mjs';

const chestLayer = /<g data-chest="adult-f"[^>]*>[^]*?<\/g>/;
const neutral = {...referenceChest, volume:53};
const raw = {style:'p5-061', arrangement:'G', body:'standard'};
const axes = Object.entries(structureControls);
const skeletons = Array.from({length:64},(_,bits)=>
  Object.fromEntries(axes.map(([key,{min,max}], index)=>[key,bits&(1<<index) ? max : min])));
const parameters = Object.entries(chestControls).slice(1);
const landmarks = [0,25,50,75,100];
const widthAt = (body,y)=>body.minimumWidth(y,y);
const options = {eyes:'almond',form:'almond',colour:'chatain-clair',flat:true,makeup:{blush:{enabled:true}}};

test('six préréglages et trois volumes suivent la même construction symétrique',()=>{
  const body=adultBodyGeometry('adult-f',[80,108]);
  assert.equal(chestGeometry(body,referenceChest),null);
  const shapes=new Set();
  for(const [, , preset] of chestPresets) {
    let previous=0;
    for(const volume of [26,53,88]) {
      const values={...preset,volume};
      const {depth,half,lobes}=chestGeometry(body,values);
      assert(depth*half>previous);
      previous=depth*half;
      assert(lobes.every(lobe=>lobe.segments.length===8));
      for(const [i,[x,y]] of lobes[0].segments.flat().entries()) {
        const [otherX,otherY]=lobes[1].segments.flat()[i];
        assert(Math.abs(x+otherX-160)<1e-10);
        assert.equal(y,otherY);
      }
      shapes.add(chestMarkup(body,values,50,'#dbbf88'));
    }
  }
  assert.equal(shapes.size,18);
});

test('axes continus, empreintes distinctes et attache indépendante du volume et de l’affaissement',()=>{
  const body=adultBodyGeometry('adult-f',[80,112]);
  const names=Object.keys(chestControls), results=new Set();
  for(const key of names) {
    const {min,max}=chestControls[key];
    const values=Array.from({length:21},(_,i)=>min+(max-min)*i/20);
    const markup=values.map(value=>chestMarkup(body,{...neutral,[key]:value},50,'#dbbf88'));
    assert.equal(new Set(markup).size,21,key);
    results.add(markup.at(-1));
  }
  assert.equal(results.size,8);
  const firm=chestGeometry(body,{...neutral,sag:0}), low=chestGeometry(body,{...neutral,sag:100,volume:100});
  assert.equal(firm.anchor,low.anchor);
  assert(low.depth>firm.depth);
  assert(chestGeometry(body,{...neutral,position:0}).anchor>chestGeometry(body,{...neutral,position:100}).anchor);
  const thin=chestGeometry(adultBodyGeometry('adult-f',[80,112],undefined,0),{...neutral,volume:100},0);
  const heavy=chestGeometry(adultBodyGeometry('adult-f',[80,112],undefined,100),{...neutral,volume:26},100);
  assert(thin.depth>heavy.depth);
  assert(thin.depth*thin.half>heavy.depth*heavy.half);
  const curves=landmarks.map(corpulence=>chestGeometry(adultBodyGeometry('adult-f',[80,112],undefined,corpulence),neutral,corpulence));
  assert(curves.every(({anchor})=>anchor===curves[0].anchor));
  assert(curves.every(({depth},i)=>!i || depth>curves[i-1].depth));
});

test('les extrêmes laissent un espace au cou, restent dans le tronc et ne croisent pas l’axe',()=>{
  const corners=Array.from({length:128},(_,bits)=>
    Object.fromEntries(parameters.map(([key,{min,max}],i)=>[key,bits&(1<<i) ? max : min])));
  let count=0;
  for(const chin of [[80,103],[80,117]]) for(const structure of skeletons) for(const corpulence of [0,50,100]) {
    const body=adultBodyGeometry('adult-f',chin,structure,corpulence);
    for(const axes of corners) for(const volume of [1,53,100]) {
      const shape=chestGeometry(body,{...axes,volume},corpulence);
      const {segments, lateral, underside}=shape.lobes[1];
      const controls=[...segments.flat(),...lateral,...underside];
      const ys=controls.map(([,y])=>y);
      const xLimit=body.minimumWidth(Math.min(...ys),Math.max(...ys));
      assert(Math.min(...ys)>body.levels[1].y+3);
      assert(Math.max(...ys)<body.levels[4].y);
      assert(controls.every(([x])=>x>=80.64 && x-80+.44<xLimit));
      if (count%479===0) for(const [x,y] of controls) assert(x-80<widthAt(body,y));
      count++;
    }
  }
  assert.equal(count,147456);
});

test('hors nouveau calque, visage et corps sont identiques aux trois échelles',()=>{
  for(const body of ['adult-f','adult-h','standard','bust']) for(const scale of [{},{headOnly:true},{headOnly:true,smallScale:true}]) {
    const input={...raw,body,corpulence:88,structure:skeletons[11]};
    const props={...scale,naturalEyes:true,makeup:{blush:{enabled:true}},instance:'chest-check'};
    const before=character(input,props);
    assert.equal(character({...input,chest:referenceChest},props),before);
    const after=character({...input,chest:neutral},props);
    assert.equal(after.replace(chestLayer,''),before);
    assert.equal(chestLayer.test(after),body==='adult-f');
  }
});

test('les exports antérieurs restent exacts et v14 restaure aussi les paramètres latents à plat',()=>{
  const archive=(selection)=>appearanceDocument(selection,options);
  const restore=document=>parseAppearance(JSON.stringify(document));
  for(const body of ['adult-f','adult-h','standard']) {
    const legacy=archive(restoreSelection({...raw,chest:neutral},body,skeletons[0],29.5));
    const replay=restore(legacy);
    assert.equal(replay.selection.state.chest,undefined);
    assert.deepEqual(appearanceDocument(replay.selection,replay),legacy);
    const picked=archive(restoreSelection(raw,body,skeletons[0],29.5,neutral));
    assert.equal(picked.version===14,body==='adult-f');
  }
  for(const volume of [0,53.125]) for(const structure of [undefined,skeletons[0]]) for(const corpulence of [undefined,83.125]) {
    const values={...referenceChest,volume,divergence:-42.75,roundness:98};
    const selection=restoreSelection(raw,'adult-f',structure,corpulence,values);
    const document=archive(selection), replay=restore(document);
    assert.equal(document.version,14);
    assert.deepEqual(replay.selection.state.chest,values);
    assert.deepEqual(appearanceDocument(replay.selection,replay),document);
    assert.equal(character(characterInput(replay.selection)),character(characterInput(selection)));
    assert.throws(()=>restore({...document, character:{...document.character,body:'adult-h'}}),/Poitrine indisponible/);
  }
  for(const invalid of [undefined,{...neutral,width:101},{...neutral,divergence:'-20'},{...neutral,extra:40}]) {
    assert.throws(()=>validateChest(invalid),/huit réglages/);
  }
});
