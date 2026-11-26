import assert from 'node:assert/strict';
import {test} from 'node:test';
import {adultBodyGeometry} from '../adult-body.mjs';
import {appearanceDocument, characterInput, parseAppearance} from '../appearance.mjs';
import {bounds, outlineCurves, pointAt, stripX} from '../bezier.mjs';
import {structureControls} from '../body-structure.mjs';
import {restoreSelection} from '../catalogue.mjs';
import {chestControls, chestGeometry, chestStops, referenceChest, validateChest} from '../chest.mjs';
import {chestGeometryR01} from '../chest-r01.mjs';
import {character} from '../render.mjs';

const layer=/<g class="body-shape"[^>]*>[^]*?<\/g>/;
const volumeLayer=/<g data-chest="adult-f"[^>]*>[^]*?<\/g>/;
const chestDefs=/<defs data-chest-definitions="">[^]*?<\/defs>/;
const withoutBody=svg=>svg.replace(chestDefs,'').replace(volumeLayer,'').replace(layer,'');
const neutral={...referenceChest,volume:75};
const raw={style:'p5-061',arrangement:'G',body:'standard'};
const axes=Object.entries(structureControls);
const skeletons=Array.from({length:64},(_,bits)=>
  Object.fromEntries(axes.map(([key,{min,max}],i)=>[key,bits&(1<<i) ? max : min])));
const settings={eyes:'almond',form:'almond',colour:'chatain-clair',flat:true,makeup:{blush:{enabled:true}}};
const curvesFor=lobe=>lobe.segments.map((segment,i)=>[lobe.base[i],...segment]);

function area(curves) {
  const points=curves.flatMap(curve=>Array.from({length:32},(_,i)=>pointAt(curve,i/32)));
  return Math.abs(points.reduce((sum,[x,y],i)=>{
    const [a,b]=points[(i+1)%points.length]; return sum+x*b-y*a;
  },0))/2;
}

test('implantation abaissée, cinq volumes perceptibles et dépassement par le calque seul',()=>{
  const body=adultBodyGeometry('adult-f',[80,110]);
  assert.equal(chestGeometry(body,referenceChest),null);
  assert.deepEqual(chestStops.map(([level])=>level),[0,25,50,75,100]);
  const areas=[];
  for(const [volume] of chestStops.slice(1)) {
    const shape=chestGeometry(body,{...referenceChest,volume});
    const old=chestGeometryR01(body,{...referenceChest,volume});
    assert(shape.anchor-old.anchor>body.height*.075);
    const curves=curvesFor(shape.lobes[1]);
    areas.push(area(curves));
    if(volume===100) {
      const [[,right]]=bounds(curves);
      const samples=curves.flatMap(curve=>Array.from({length:31},(_,i)=>pointAt(curve,i/30)));
      const torso=outlineCurves(body.path);
      assert(right-Math.max(...samples.map(([x])=>x))<.04);
      assert(samples.some(([x,y])=>x-Math.max(...stripX(torso,y))>2));
      const broad=chestGeometry(body,{...referenceChest,volume,width:100});
      const broadSamples=curvesFor(broad.lobes[1]).flatMap(curve=>Array.from({length:31},(_,i)=>pointAt(curve,i/30)));
      assert(broadSamples.some(([x,y])=>x-Math.max(...stripX(torso,y))>8));
    }
  }
  assert(areas.every((size,i)=>!i || size>areas[i-1]*1.30));
});

test('six axes utiles, attache indépendante et volume individuel prioritaire',()=>{
  const body=adultBodyGeometry('adult-f',[80,110]);
  const variants=new Set();
  for(const key of Object.keys(chestControls)) {
    const shapes=Array.from({length:21},(_,i)=>JSON.stringify(chestGeometry(body,{...neutral,[key]:i*5})));
    assert.equal(new Set(shapes).size,21,key);
    variants.add(shapes.at(-1));
  }
  assert.equal(variants.size,6);
  const low=chestGeometry(body,{...neutral,sag:100}), firm=chestGeometry(body,{...neutral,sag:0});
  assert.equal(low.anchor,firm.anchor);
  assert(low.depth>firm.depth);
  const thin=chestGeometry(adultBodyGeometry('adult-f',[80,110],undefined,0),{...neutral,volume:100},0);
  const full=chestGeometry(adultBodyGeometry('adult-f',[80,110],undefined,100),{...neutral,volume:25},100);
  assert.equal(thin.anchor,full.anchor);
  assert(area(curvesFor(thin.lobes[0]))>2*area(curvesFor(full.lobes[0])));
});

test('raccords, limites et corps sous-jacent aux extrêmes',()=>{
  const keys=Object.keys(chestControls).slice(1);
  const corners=Array.from({length:32},(_,bits)=>Object.fromEntries(keys.map((key,i)=>[key,bits&(1<<i) ? 100 : 0])));
  let count=0;
  for(const chin of [[80,103],[80,117]]) for(const structure of skeletons) for(const corpulence of [0,50,100]) {
    const body=adultBodyGeometry('adult-f',chin,structure,corpulence);
    for(const values of corners) for(const volume of [1,50,100]) {
      const {lobes}=chestGeometry(body,{...values,volume},corpulence);
      const right=curvesFor(lobes[1]), left=curvesFor(lobes[0]).flat();
      for(const [i,[x,y]] of right.flat().entries()) {
        const [leftX,leftY]=left[i];
        assert(Math.abs(x+leftX-160)<1e-8 && y===leftY);
        assert(x>80.49 && x<186 && y>body.levels[1].y+7 && y<body.levels[6].y);
      }
      for(const [i,a] of right.entries()) {
        const b=right[(i+1)%right.length];
        assert.deepEqual(a[3],b[0]);
        const u=a[3].map((v,j)=>v-a[2][j]);
        const v=b[1].map((w,j)=>w-b[0][j]);
        assert(u[0]*v[0]+u[1]*v[1]>0 && Math.abs(u[0]*v[1]-u[1]*v[0])<1e-8);
      }
      if(count%43===0) {
        const input={...raw,body:'adult-f',structure,corpulence};
        const svg=character({...input,chest:{...values,volume}});
        const baseline=character(input).match(layer)[0].match(/ d="([^"]+)"/)[1];
        const paths=[...svg.match(layer)[0].matchAll(/ d="([^"]+)"/g)].map(([,d])=>d);
        assert.deepEqual(paths,[baseline,baseline]);
      }
      count++;
    }
  }
  assert.equal(count,36864);
});

test('masque sur le trait seul, bord extérieur limité et identité du reste du SVG',()=>{
  for(const body of ['adult-f','adult-h','standard','bust']) for(const scale of [{},{headOnly:true},{headOnly:true,smallScale:true}]) {
    const input={...raw,body,corpulence:88,structure:skeletons[11]};
    const props={...scale,naturalEyes:true,makeup:{blush:{enabled:true}},instance:'chest-check'};
    const baseline=character(input,props);
    assert.equal(character({...input,chest:referenceChest},props),baseline);
    const result=character({...input,chest:{...neutral,volume:100}},props);
    if(body==='adult-f') {
      assert.equal(withoutBody(result),withoutBody(baseline));
      const plainPath=baseline.match(layer)[0].match(/ d="([^"]+)"/)[1];
      const placed=result.match(layer)[0];
      assert.deepEqual([...placed.matchAll(/ d="([^"]+)"/g)].map(([,d])=>d),[plainPath,plainPath]);
      assert.equal((placed.match(/ mask=/g)??[]).length,1);
      assert.match(placed,/fill="none"[^>]*mask="url\(#.*-cover\)"/);
      const surfaces=[...result.match(volumeLayer)[0].matchAll(/data-chest-surface d="([^"]+)"/g)].map(([,d])=>d);
      const masked=[...result.match(chestDefs)[0].matchAll(/d="([^"]+)" fill="black"/g)].map(([,d])=>d);
      assert.deepEqual(surfaces,masked);
      assert.equal((result.match(/data-chest-edge[^>]*clip-path/g)??[]).length,2);
    } else assert.equal(result,baseline);
  }
  const subject={...raw,body:'adult-f',chest:{...neutral,volume:100}};
  const rendered=[character(subject),character({...subject,structure:{neck:100,shoulders:100,thorax:100,waist:100,pelvis:100,base:130}})];
  const covers=rendered.map(svg=>svg.match(chestDefs)[0].match(/<mask id="([^"]+)"/)[1]);
  assert.notEqual(covers[0],covers[1]);
});

test('migrations v14 et v15, données d’origine et reprise v16 à plat ou en volume',()=>{
  const archive=selection=>appearanceDocument(selection,settings);
  const restore=document=>parseAppearance(JSON.stringify(document));
  const historical=archive(restoreSelection({...raw,chest:neutral},'adult-f',skeletons[0],29.5));
  const old=restore(historical);
  assert.equal(historical.version,13);
  assert.equal(old.selection.state.chest,undefined);
  assert.deepEqual(appearanceDocument(old.selection,old),historical);
  for(const volume of [0,53.125]) for(const structure of [undefined,skeletons[0]]) for(const corpulence of [undefined,83.125]) {
    const values={...referenceChest,volume,roundness:98};
    const original={divergence:-42.75,position:79.25};
    const selection=restoreSelection(raw,'adult-f',structure,corpulence,values,original);
    const current=archive(selection);
    const v15={...structuredClone(current),version:15,renderer:'bio-corps-04-a-r01-svg@1'};
    const v14={...structuredClone(current),version:14,renderer:'bio-corps-04-a-svg@1'};
    delete v14.character.chestOrigin;
    Object.assign(v14.character.chest,original);
    for(const inherited of [v14,v15]) {
      const migrated=restore(inherited);
      assert.equal(migrated.importedChestVersion,inherited.version);
      assert.deepEqual(migrated.selection.state.chest,values);
      assert.deepEqual(migrated.selection.state.chestOrigin,original);
      assert.deepEqual(appearanceDocument(migrated.selection,migrated),current);
    }
    const replay=restore(current);
    assert.equal(current.version,16);
    assert.deepEqual(appearanceDocument(replay.selection,replay),current);
    assert.equal(character(characterInput(replay.selection)),character(characterInput(selection)));
    assert.throws(()=>restore({...current,character:{...current.character,body:'adult-h'}}),/Poitrine indisponible/);
  }
  for(const invalid of [undefined,{...neutral,width:101},{...neutral,sag:'20'},{...neutral,divergence:0}]) {
    assert.throws(()=>validateChest(invalid),/six réglages/);
  }
});
