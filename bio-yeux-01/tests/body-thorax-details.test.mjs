import assert from 'node:assert/strict';
import {test} from 'node:test';
import {adultBodyGeometry} from '../adult-body.mjs';
import {appearanceDocument, characterInput, parseAppearance} from '../appearance.mjs';
import {structureControls} from '../body-structure.mjs';
import {restoreSelection} from '../catalogue.mjs';
import {chestGeometry, referenceChest} from '../chest.mjs';
import {pectoralGeometry, referencePectorals} from '../pectorals.mjs';
import {stripX} from '../bezier.mjs';
import {character} from '../render.mjs';
import {referenceThoraxDetails, thoraxDetailControls, thoraxDetailsGeometry, thoraxDetailsMarkup} from '../thorax-details.mjs';

const bodies=['adult-h','adult-f'];
const raw={style:'p5-061',arrangement:'G',body:'standard'};
const settings={eyes:null,form:'historical',colour:'chatain-clair',flat:true};
const layer=/<g data-thorax-details="adult-[hf]"[^>]*>[^]*?<\/g>/;
const skeletons=Array.from({length:64},(_,bits)=>
  Object.fromEntries(Object.entries(structureControls).map(([key,{min,max}],i)=>[key,bits&(1<<i) ? max : min])));
const carriers=(volume,corpulence,wide,overrides={})=>({
  corpulence,
  chest:{...referenceChest,volume,width:wide ? 100 : 0,length:wide ? 100 : 0,spacing:wide ? 100 : 0,sag:wide ? 100 : 0,...overrides.chest},
  pectorals:{...referencePectorals,volume,width:wide ? 100 : 0,height:wide ? 100 : 0,angularity:wide ? 100 : 0,...overrides.pectorals}
});

test('les sept axes ont un effet distinct sur H et F, y compris à plat',()=>{
  for (const key of bodies) for (const volume of [0,75]) {
    const body=adultBodyGeometry(key,[80,111]);
    const context=carriers(volume,50,true);
    const reference=referenceThoraxDetails[key];
    const finals=[];
    for (const axis of Object.keys(thoraxDetailControls)) {
      const variants=Array.from({length:11},(_,i)=>thoraxDetailsMarkup(body,key,{...reference,[axis]:i*10},'#dbbf88',false,context));
      assert.equal(new Set(variants).size,11,`${key} ${volume} ${axis}`);
      finals.push(variants.at(-1));
    }
    assert.equal(new Set(finals).size,7);
    const circular=thoraxDetailsGeometry(body,key,{...reference,shape:0},context);
    assert.equal(circular.rx,circular.ry);
  }
});

test('le volume et les transformations de surface déplacent les détails sans modifier les valeurs',()=>{
  const base=carriers(70,50,false);
  const changes={
    'adult-f':[{chest:{volume:90}},{chest:{width:85}},{chest:{sag:85}},{chest:{spacing:85}}],
    'adult-h':[{pectorals:{volume:90}},{pectorals:{width:85}},{pectorals:{height:85}}]
  };
  for (const key of bodies) {
    const body=adultBodyGeometry(key,[80,111]);
    const values=referenceThoraxDetails[key];
    const anchor=(model,context)=>{const {x,y}=thoraxDetailsGeometry(model,key,values,context);return [x,y];};
    const initial=anchor(body,base);
    for (const update of changes[key]) {
      assert.notDeepEqual(anchor(body,carriers(70,50,false,update)),initial);
    }
    assert.notDeepEqual(anchor(adultBodyGeometry(key,[80,111],skeletons[0]),base),initial);
    assert.notDeepEqual(anchor(adultBodyGeometry(key,[80,111],undefined,100),{...base,corpulence:100}),initial);
    for (const [a,b] of [[0,.00001],[29.99999,30]]) {
      const [x0,y0]=anchor(body,carriers(a,50,false)), [x1,y1]=anchor(body,carriers(b,50,false));
      assert(Math.hypot(x0-x1,y0-y1)<.0001);
    }
    assert.deepEqual(values,referenceThoraxDetails[key]);
  }
});

test('46 080 combinaisons conservent la marge du support, la symétrie et le mamelon dans l’aréole',()=>{
  const requests=[[0,0],[0,100],[100,0],[100,100],[50,50]].map(([horizontal,vertical])=>
    ({size:100,shape:100,pigment:100,horizontal,vertical,nippleSize:100,relief:100}));
  let count=0;
  for (const key of bodies) for (const chin of [[80,103],[80,117]]) for (const structure of skeletons) for (const corpulence of [0,50,100]) {
    const body=adultBodyGeometry(key,chin,structure,corpulence);
    for (const wide of [false,true]) for (const volume of [0,5,15,25,30,100]) {
      const context=carriers(volume,corpulence,wide);
      for (const values of requests) {
        const {axis,x,y,rx,ry,nippleRadius,clearance}=thoraxDetailsGeometry(body,key,values,context);
        const caseLabel=`${key} ${corpulence} ${wide} ${volume} ${values.horizontal}/${values.vertical} ${JSON.stringify(structure)}`;
        assert(Number.isFinite(rx) && rx>.65 && rx<=clearance,caseLabel);
        assert(x-rx>=axis+1 && ry>nippleRadius*1.66,caseLabel);
        const right=body.minimumWidth(y-ry,y+ry)+axis;
        if (count%53===0 && (volume>=30 || x+rx>right-2)) {
          const geometry=key==='adult-f' ? chestGeometry(body,context.chest,corpulence) : pectoralGeometry(body,context.pectorals,corpulence);
          const {base,segments}=(geometry.lobes ?? geometry.panels)[1];
          const curves=segments.map((segment,i)=>[base[i],...segment]);
          for (const amount of [-.99,-.5,0,.5,.99]) {
            const crossings=stripX(curves,y+ry*amount);
            const offset=rx*Math.sqrt(1-amount*amount);
            assert(x-offset>Math.min(...crossings) && x+offset<Math.max(...crossings),caseLabel);
          }
        }
        count++;
      }
    }
  }
  assert.equal(count,46080);
});

test('les trois échelles gardent le même ancrage et le calque reste indépendant',()=>{
  const context=carriers(72,83.5,true);
  for (const body of [...bodies,'standard','bust']) for (const scale of [{},{headOnly:true},{headOnly:true,smallScale:true}]) {
    const input={...raw,...context,body,structure:skeletons[11]};
    const opts={...scale,naturalEyes:true,makeup:{blush:{enabled:true}},instance:'thorax-detail-test'};
    const base=character(input,opts);
    const details={...(referenceThoraxDetails[body] ?? referenceThoraxDetails['adult-h']),relief:80};
    const rendered=character({...input,thoraxDetails:details},opts);
    assert.equal(rendered.replace(layer,''),base);
    if (!bodies.includes(body)) assert.equal(rendered,base);
    else {
      const ellipses=[...rendered.matchAll(/data-areola="" cx="([^"]+)" cy="([^"]+)"/g)];
      assert.equal(ellipses.length,2);
      assert(Math.abs(Number(ellipses[0][1])+Number(ellipses[1][1])-160)<.003);
      assert.equal(ellipses[0][2],ellipses[1][2]);
      assert.equal(rendered.includes('data-nipple-shadow'),!scale.smallScale);
    }
  }
});

test('les archives v18 conservent des valeurs fractionnaires et les archives v11, v16 et v17 restent exactes',()=>{
  const archive=selection=>appearanceDocument(selection,settings);
  const read=doc=>parseAppearance(JSON.stringify(doc));
  for (const [key,volume] of bodies.flatMap(key=>[0,73.625].map(volume=>[key,volume]))) {
    const {chest,pectorals,corpulence}=carriers(volume,71.5,true);
    const values={...referenceThoraxDetails[key],nippleSize:38.125,horizontal:0,vertical:100};
    const context=[raw,key,skeletons[5],corpulence,chest,undefined,pectorals];
    const legacy=archive(restoreSelection(...context));
    assert.equal(legacy.version,key==='adult-h' ? 17 : 16);
    assert.equal(read(legacy).selection.state.thoraxDetails,undefined);
    assert.deepEqual(appearanceDocument(read(legacy).selection,read(legacy)),legacy);
    const authored=archive(restoreSelection(...context,values));
    const restored=read(authored);
    assert.equal(authored.version,18);
    assert.deepEqual(restored.selection.state.thoraxDetails,values);
    assert.deepEqual(appearanceDocument(restored.selection,restored),authored);
    assert.equal(character(characterInput(restored.selection)),character(characterInput(restoreSelection(...context,values))));
    assert.throws(()=>read({...authored,character:{...authored.character,body:'standard'}}),/Base adulte/);
    assert.throws(()=>read({...authored,character:{...authored.character,thoraxDetails:{...values,pigment:101}}}),/sept réglages/);
  }
  const flat=archive(restoreSelection(raw,'adult-f'));
  assert.equal(flat.version,11);
  assert.deepEqual(appearanceDocument(read(flat).selection,read(flat)),flat);
});
