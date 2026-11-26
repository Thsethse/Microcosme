import assert from 'node:assert/strict';
import {test} from 'node:test';
import {adultBodyGeometry} from '../adult-body.mjs';
import {appearanceDocument, characterInput, parseAppearance} from '../appearance.mjs';
import {structureControls} from '../body-structure.mjs';
import {restoreSelection} from '../catalogue.mjs';
import {referenceChest} from '../chest.mjs';
import {pectoralControls, pectoralGeometry, pectoralMarkup, referencePectorals, validatePectorals} from '../pectorals.mjs';
import {character} from '../render.mjs';

const layer=/<g data-pectorals="adult-h"[^>]*>[^]*?<\/g>/;
const raw={style:'p5-061',arrangement:'G',body:'standard'};
const muscle={...referencePectorals,volume:75};
const bodyAxes=Object.entries(structureControls);
const skeletons=Array.from({length:64},(_,bits)=>
  Object.fromEntries(bodyAxes.map(([key,{min,max}],i)=>[key,bits&(1<<i) ? max : min])));
const settings={eyes:'almond',form:'almond',colour:'chatain-clair',flat:true,makeup:{blush:{enabled:true}}};

function pointArray(panel) { return [...panel.segments.flat(),...panel.lateral,...panel.lower]; }

test('cinq axes, palier plat et progression indépendante du volume et de la définition',()=>{
  const body=adultBodyGeometry('adult-h',[80,111]);
  assert.equal(pectoralGeometry(body,referencePectorals),null);
  const changed=new Set();
  for(const key of Object.keys(pectoralControls)) {
    const shapes=Array.from({length:21},(_,i)=>pectoralMarkup(body,{...muscle,[key]:i*5},50,'#dbbf88'));
    assert.equal(new Set(shapes).size,21,key);
    changed.add(shapes.at(-1));
  }
  assert.equal(changed.size,5);
  const volumes=[25,50,75,100].map(volume=>pectoralGeometry(body,{...muscle,volume}));
  for(const [i,shape] of volumes.slice(1).entries()) {
    assert.equal(shape.anchor,volumes[i].anchor);
    assert(shape.breadth>volumes[i].breadth && shape.depth>volumes[i].depth);
  }
});

test('la corpulence atténue angles et définition, les valeurs musculaires et l’attache restent stables',()=>{
  const values=Object.freeze({...muscle,angularity:100,definition:100});
  const shapes=[0,25,50,75,100].map(corpulence=>
    pectoralGeometry(adultBodyGeometry('adult-h',[80,111],undefined,corpulence),values,corpulence));
  for(const [i,shape] of shapes.slice(1).entries()) {
    assert.equal(shape.anchor,shapes[i].anchor);
    assert(shape.angle<shapes[i].angle && shape.definitionVisible<shapes[i].definitionVisible);
    assert(shape.depth>shapes[i].depth);
  }
  assert.equal(shapes[0].mass,shapes.at(-1).mass);
  assert.equal(values.angularity,100);
  assert.equal(values.definition,100);
  const fullBody=adultBodyGeometry('adult-h',[80,111],undefined,100);
  assert(pectoralGeometry(fullBody,{...values,volume:100},100).depth>2*pectoralGeometry(fullBody,{...values,volume:25},100).depth);
});

test('18 432 combinaisons de coins gardent les aplats dans le thorax et l’axe ouvert',()=>{
  const keys=Object.keys(pectoralControls).slice(1);
  const corners=Array.from({length:16},(_,bits)=>Object.fromEntries(keys.map((key,i)=>[key,bits&(1<<i) ? 100 : 0])));
  let count=0;
  for(const chin of [[80,103],[80,117]]) for(const structure of skeletons) for(const corpulence of [0,50,100]) {
    const body=adultBodyGeometry('adult-h',chin,structure,corpulence);
    for(const values of corners) for(const volume of [1,50,100]) {
      const shape=pectoralGeometry(body,{...values,volume},corpulence);
      const left=pointArray(shape.panels[0]),right=pointArray(shape.panels[1]);
      for(const [i,[x,y]] of right.entries()) {
        assert(Math.abs(x+left[i][0]-160)<1e-8 && y===left[i][1]);
        assert(x>82 && x<=80+shape.available && y>body.levels[1].y+5 && y<body.levels[3].y);
      }
      for(const panel of shape.panels) for(const [i,[,incoming,point]] of panel.segments.entries()) {
        const outgoing=panel.segments[(i+1)%panel.segments.length][0];
        const u=point.map((v,j)=>v-incoming[j]), v=outgoing.map((w,j)=>w-point[j]);
        assert(u[0]*v[0]+u[1]*v[1]>0 && Math.abs(u[0]*v[1]-u[1]*v[0])<1e-8);
      }
      if(count%61===0) for(const [x,y] of right) assert(x-80<body.minimumWidth(y,y)-2.9);
      count++;
    }
  }
  assert.equal(count,18432);
});

test('superposition H seule et identité du corps, du visage, des cheveux et du calque F',()=>{
  for(const body of ['adult-h','adult-f','standard','bust']) for(const scale of [{},{headOnly:true},{headOnly:true,smallScale:true}]) {
    const input={...raw,body,structure:skeletons[11],corpulence:87.75,chest:{...referenceChest,volume:90}};
    const opts={...scale,naturalEyes:true,makeup:{blush:{enabled:true}},instance:'pecs-check'};
    const base=character(input,opts);
    assert.equal(character({...input,pectorals:referencePectorals},opts),base);
    const changed=character({...input,pectorals:muscle},opts);
    assert.equal(changed.replace(layer,''),base);
    assert.equal(layer.test(changed),body==='adult-h');
  }
});

test('v17 conserve les cinq valeurs actives ou latentes et les versions antérieures restent exactes',()=>{
  const archive=selection=>appearanceDocument(selection,settings);
  const restore=document=>parseAppearance(JSON.stringify(document));
  for(const [body,structure,corpulence,chest] of [
    ['adult-h',undefined,undefined,undefined],['adult-h',skeletons[0],29.5,undefined],
    ['adult-f',skeletons[2],89.3,{...referenceChest,volume:91}],['standard',undefined,undefined,undefined]
  ]) {
    const initial=archive(restoreSelection({...raw,pectorals:muscle},body,structure,corpulence,chest));
    assert(initial.version<17);
    const replay=restore(initial);
    assert.equal(replay.selection.state.pectorals,undefined);
    assert.deepEqual(appearanceDocument(replay.selection,replay),initial);
  }
  for(const volume of [0,79.125]) for(const structure of [undefined,skeletons[0]]) for(const corpulence of [undefined,83.125]) {
    const pectorals={...muscle,volume,definition:87.5};
    const selection=restoreSelection(raw,'adult-h',structure,corpulence,undefined,undefined,pectorals);
    const document=archive(selection), replay=restore(document);
    assert.equal(document.version,17);
    assert.deepEqual(replay.selection.state.pectorals,pectorals);
    assert.deepEqual(appearanceDocument(replay.selection,replay),document);
    assert.equal(character(characterInput(replay.selection)),character(characterInput(selection)));
    assert.throws(()=>restore({...document,character:{...document.character,body:'adult-f'}}),/Pectoraux indisponibles/);
  }
  for(const invalid of [undefined,{...muscle,width:101},{...muscle,definition:'50'},{...muscle,physique:0}]) {
    assert.throws(()=>validatePectorals(invalid),/cinq réglages/);
  }
});
