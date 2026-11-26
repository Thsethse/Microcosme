import assert from 'node:assert/strict';
import {test} from 'node:test';
import {adultBodyGeometry} from '../adult-body.mjs';
import {appearanceDocument, characterInput, parseAppearance} from '../appearance.mjs';
import {bounds, outlineCurves, pointAt, stripX} from '../bezier.mjs';
import {structureControls} from '../body-structure.mjs';
import {restoreSelection} from '../catalogue.mjs';
import {chestControls, chestGeometry, chestStops, referenceChest, validateChest} from '../chest.mjs';
import {previousChestMarkup} from '../chest-before.mjs';
import {character} from '../render.mjs';

const chestLayer=/<g data-chest="adult-f"[^>]*>[^]*?<\/g>/;
const bodyLayer=/<g class="body-shape"[^>]*>[^]*?<\/g>/;
const outside=svg=>svg.replace(chestLayer,'').replace(bodyLayer,'');
const path=svg=>svg.match(/<g class="body-shape"[^>]*><path d="([^"]+)"/)[1];
const neutral={...referenceChest,volume:75};
const raw={style:'p5-061',arrangement:'G',body:'standard'};
const axes=Object.entries(structureControls);
const skeletons=Array.from({length:64},(_,bits)=>
  Object.fromEntries(axes.map(([key,{min,max}],i)=>[key,bits&(1<<i) ? max : min])));
const options={eyes:'almond',form:'almond',colour:'chatain-clair',flat:true,makeup:{blush:{enabled:true}}};

function area(curves) {
  const points=curves.flatMap(curve=>Array.from({length:32},(_,i)=>pointAt(curve,i/32)));
  return Math.abs(points.reduce((sum,[x,y],i)=>{
    const [a,b]=points[(i+1)%points.length]; return sum+x*b-y*a;
  },0))/2;
}
const curvesFor=lobe=>lobe.segments.map((segment,i)=>[lobe.base[i],...segment]);

test('les cinq niveaux progressent et les volumes hauts gagnent en surface et en contour',()=>{
  const body=adultBodyGeometry('adult-f',[80,110]);
  assert.deepEqual(chestStops.map(([amount])=>amount),[0,25,50,75,100]);
  assert.equal(chestGeometry(body,referenceChest),null);
  const areas=[];
  for(const [volume] of chestStops.slice(1)) {
    const values={...referenceChest,volume};
    const shape=chestGeometry(body,values);
    const before=previousChestMarkup(body,{...values,divergence:0,position:52},50,'#dbbf88');
    const beforeCurves=outlineCurves(before.match(/<path d="([^"]+)"/)[1]);
    areas.push(area(curvesFor(shape.lobes[0])));
    if (volume>=50) assert(areas.at(-1)>area(beforeCurves)*1.45);
    const perimeter=body.exteriorPath(shape.profile);
    if(volume<=50) assert.equal(perimeter,body.path);
    else {
      const y=shape.profile.peak;
      const reach=Math.max(...stripX(outlineCurves(perimeter),y))-80;
      assert(Math.abs(reach-body.minimumWidth(y,y)-shape.profile.amplitude)<.002);
      if(volume===100) assert(shape.profile.amplitude>9);
    }
  }
  assert(areas.every((size,i)=>!i || size>areas[i-1]*1.20));
});

test('six axes distincts et continus, attache stable et interaction individuelle avec la corpulence',()=>{
  const body=adultBodyGeometry('adult-f',[80,110]);
  const variants=new Set();
  for(const [key,{max}] of Object.entries(chestControls)) {
    const shapes=Array.from({length:21},(_,i)=>JSON.stringify(chestGeometry(body,{...neutral,[key]:i*max/20})));
    assert.equal(new Set(shapes).size,21,key);
    variants.add(shapes.at(-1));
  }
  assert.equal(variants.size,6);
  const low=chestGeometry(body,{...neutral,sag:100}), firm=chestGeometry(body,{...neutral,sag:0});
  assert.equal(low.anchor,firm.anchor);
  assert(low.depth>firm.depth && low.profile.peak>firm.profile.peak);
  const thin=chestGeometry(adultBodyGeometry('adult-f',[80,110],undefined,0),{...neutral,volume:100},0);
  const full=chestGeometry(adultBodyGeometry('adult-f',[80,110],undefined,100),{...neutral,volume:25},100);
  assert.equal(thin.anchor,full.anchor);
  assert(area(curvesFor(thin.lobes[0]))>2*area(curvesFor(full.lobes[0])));
  const before=chestGeometry(body,{...neutral,volume:55}), after=chestGeometry(body,{...neutral,volume:55.001});
  assert.equal(before.profile.amplitude,0);
  assert(after.profile.amplitude>0 && after.profile.amplitude<1e-6);
});

test('liaisons tangentes, symétrie et étendue locale aux coins de l’ossature et des cinq axes de forme',()=>{
  const variables=Object.keys(chestControls).slice(1);
  const corners=Array.from({length:32},(_,bits)=>Object.fromEntries(variables.map((key,i)=>[key,bits&(1<<i) ? 100 : 0])));
  let count=0;
  for(const chin of [[80,103],[80,117]]) for(const structure of skeletons) for(const corpulence of [0,50,100]) {
    const body=adultBodyGeometry('adult-f',chin,structure,corpulence);
    const base=outlineCurves(body.path);
    for(const values of corners) for(const volume of [1,75,100]) {
      const shape=chestGeometry(body,{...values,volume},corpulence);
      const {profile,lobes}=shape;
      assert(profile.start>body.levels[1].y+2 && profile.end<body.levels[5].y);
      const perimeter=body.exteriorPath(profile);
      const curves=outlineCurves(perimeter);
      const peak=curves.findIndex(curve=>curve[3][1]===249);
      const right=curves.slice(0,peak+1);
      assert(right.every(curve=>curve.every(([x,y],i)=>x>=80 && (!i || y>=curve[i-1][1]))));
      const left=curves.slice(peak+1,-1);
      for(const [i,[x,y]] of right.flat().reverse().entries()) {
        const [otherX,otherY]=left.flat()[i];
        assert(Math.abs(x+otherX-160)<.002 && Math.abs(y-otherY)<.002);
      }
      for(const [i,a] of right.slice(0,-1).entries()) {
        const b=right[i+1], dx=a[3][0]-a[2][0], dy=a[3][1]-a[2][1];
        const ux=b[1][0]-b[0][0], uy=b[1][1]-b[0][1];
        if(Math.min(Math.hypot(dx,dy),Math.hypot(ux,uy))>.15) {
          assert(Math.abs(dx*uy-dy*ux)/(Math.hypot(dx,dy)*Math.hypot(ux,uy))<.012);
        }
      }
      assert.deepEqual(right.at(-1),base[7]);
      assert(lobes[1].segments.flat().every(([x])=>x>=80.64));
      if(count%191===0) {
        const box=bounds(curves);
        assert.deepEqual(box[1],bounds(base)[1]);
        assert(box[0][0]>-30 && box[0][1]<190);
        assert.equal(Math.max(...stripX(curves,218)),Math.max(...stripX(base,218)));
      }
      count++;
    }
  }
  assert.equal(count,36864);
});

test('un seul trait extérieur, calque borné au contour et SVG du visage inchangé aux trois échelles',()=>{
  for(const body of ['adult-f','adult-h','standard','bust']) for(const scale of [{},{headOnly:true},{headOnly:true,smallScale:true}]) {
    const input={...raw,body,corpulence:88,structure:skeletons[11]};
    const props={...scale,naturalEyes:true,makeup:{blush:{enabled:true}},instance:'chest-check'};
    const baseline=character(input,props);
    assert.equal(character({...input,chest:referenceChest},props),baseline);
    const result=character({...input,chest:{...neutral,volume:100}},props);
    if(body==='adult-f') {
      assert.equal(outside(result),outside(baseline));
      assert.notEqual(path(result),path(baseline));
      const bodyMarkup=result.replace(chestLayer,'').match(bodyLayer)[0];
      assert.equal((bodyMarkup.match(/stroke-width="4\.2"/g)??[]).length,1);
      assert(chestLayer.test(result));
    } else assert.equal(result,baseline);
  }
});

test('v14 migre sans perte des anciennes valeurs, v15 conserve les valeurs latentes et v13 reste exact',()=>{
  const archive=selection=>appearanceDocument(selection,options);
  const restore=document=>parseAppearance(JSON.stringify(document));
  const historical=archive(restoreSelection({...raw,chest:neutral},'adult-f',skeletons[0],29.5));
  const old=restore(historical);
  assert.equal(historical.version,13);
  assert.equal(old.selection.state.chest,undefined);
  assert.deepEqual(appearanceDocument(old.selection,old),historical);
  for(const volume of [0,53.125]) for(const structure of [undefined,skeletons[0]]) for(const corpulence of [undefined,83.125]) {
    const values={...referenceChest,volume,roundness:98};
    const original={divergence:-42.75,position:79.25};
    const selection=restoreSelection(raw,'adult-f',structure,corpulence,values);
    const v14=archive(selection);
    Object.assign(v14,{version:14,renderer:'bio-corps-04-a-svg@1'});
    Object.assign(v14.character.chest,original);
    const migrated=restore(v14);
    assert(migrated.migratedChest);
    assert.deepEqual(migrated.selection.state.chest,values);
    assert.deepEqual(migrated.selection.state.chestOrigin,original);
    const document=appearanceDocument(migrated.selection,migrated), replay=restore(document);
    assert.equal(document.version,15);
    assert.deepEqual(replay.selection.state.chestOrigin,original);
    assert.deepEqual(appearanceDocument(replay.selection,replay),document);
    assert.equal(character(characterInput(replay.selection)),character(characterInput(selection)));
    assert.throws(()=>restore({...document,character:{...document.character,body:'adult-h'}}),/Poitrine indisponible/);
    assert.throws(()=>restore({...v14,character:{...v14.character,chest:{...v14.character.chest,position:105}}}),/anciennes valeurs/);
  }
  for(const invalid of [undefined,{...neutral,width:101},{...neutral,sag:'20'},{...neutral,divergence:0}]) {
    assert.throws(()=>validateChest(invalid),/six réglages/);
  }
});
