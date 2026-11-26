import assert from 'node:assert/strict';
import {test} from 'node:test';
import {adultBodyGeometry} from '../adult-body.mjs';
import {abdominalFoldGeometry, bellyDetailsMarkup, navelGeometry, pelvicLandmarks} from '../belly-details.mjs';
import {appearanceDocument, characterInput, parseAppearance} from '../appearance.mjs';
import {restoreSelection} from '../catalogue.mjs';
import {referenceAbdominals} from '../abdominals.mjs';
import {referenceChest} from '../chest.mjs';
import {referencePectorals} from '../pectorals.mjs';
import {referenceThoraxDetails, thoraxDetailsMarkup} from '../thorax-details.mjs';
import {character} from '../render.mjs';

const bodies=['adult-h','adult-f'];
const chin=[80,109];
const skin='#dbbf88';
const raw={style:'p5-061',arrangement:'G',body:'standard'};
const settings={eyes:null,form:'historical',colour:'chatain-clair',flat:true};
const groins=svg=>[...svg.matchAll(/<path data-groin-crease=""[^>]+\/>/g)].map(match=>match[0]);

test('R02 creuse le U, avec bords relevés et centre descendant, et synchronise le nombril',()=>{
  for (const key of bodies) {
    let previous;
    for (let i=0;i<=1000;i++) {
      const fat=i/10;
      const body=adultBodyGeometry(key,chin,undefined,fat);
      const old=abdominalFoldGeometry(body,fat,true);
      const fold=abdominalFoldGeometry(body,fat);
      const navel=navelGeometry(body,fat);
      const edge=fold.center-fold.depth;
      const gap=fold.center-navel.cy;
      assert(fold.depth>old.depth+body.height*.02);
      assert(navel.cy>navelGeometry(body,fat,true).cy+7);
      assert.equal(navel.cx,body.ground.x);
      assert(navel.ry<gap && gap<body.height*.031);
      if (previous) {
        assert(edge<previous.edge);
        assert(fold.center>previous.fold.center && fold.depth>previous.fold.depth);
        assert(navel.cy>previous.navel.cy && gap<previous.gap);
        assert(fold.reach>previous.fold.reach && fold.strength>previous.fold.strength);
      }
      if (fat===100) {
        assert.equal(old.bottom,fold.bottom);
        assert(Math.abs(pelvicLandmarks(body).reservedTop-fold.bottom-1.44)<1e-8);
        assert(fold.depth>old.depth*1.85);
      }
      previous={edge,fold,navel,gap};
    }
  }
});

test('les deux plis de l’aine reprennent exactement les tracés et couleurs R01',()=>{
  for (const key of bodies) for (const skin of ['#dbbf88','#573222']) for (const fat of [0,12.5,25,37.5,50,62.5,75,87.5,100]) {
    const body=adultBodyGeometry(key,chin,undefined,fat);
    const before=groins(bellyDetailsMarkup(body,fat,skin,{previous:true}));
    const after=groins(bellyDetailsMarkup(body,fat,skin));
    assert.equal(after.length,2);
    assert.deepEqual(after,before);
  }
});

test('les cinq réglages aréolaires donnent des aréoles identiques au témoin R01 et un détail centré',()=>{
  for(const key of bodies) for (const fat of [0,25,50,100]) for (const volume of [0,20,73,100]) for (const smallScale of [false,true]) {
    const body=adultBodyGeometry(key,chin,undefined,fat);
    const carrier={chest:{...referenceChest,volume},pectorals:{...referencePectorals,volume},corpulence:fat};
    const values={...referenceThoraxDetails[key],size:80,shape:90,vertical:15,horizontal:90};
    const before=thoraxDetailsMarkup(body,key,values,skin,smallScale,carrier,true);
    const after=thoraxDetailsMarkup(body,key,values,skin,smallScale,carrier);
    const areolas=svg=>[...svg.matchAll(/<ellipse data-areola=""[^>]+\/>/g)].map(match=>match[0]);
    assert.deepEqual(areolas(after),areolas(before));
    const centers=part=>[...after.matchAll(new RegExp(`data-${part}="" cx="([^"]+)" cy="([^"]+)"`,'g'))].map(match=>match.slice(1));
    assert.equal(centers('areola').length,2);
    assert.deepEqual(centers('areola'),centers('nipple'));
    assert(!after.includes('data-nipple-shadow'));
  }
});

test('les archives v18, v19 et v20 migrent vers v21 sans réactiver les anciens réglages',()=>{
  for (const key of bodies) for (const version of [18,19,20]) {
    const abdominals=version===18 ? undefined : {...referenceAbdominals,volume:61.75};
    const areola={...referenceThoraxDetails[key],size:34.5,vertical:89.125};
    const selection=restoreSelection(raw,key,undefined,81.125,{...referenceChest,volume:80},undefined,
      {...referencePectorals,volume:70},areola,abdominals);
    const current=appearanceDocument(selection,settings);
    const renderer={18:'bio-corps-04-c-svg@1',19:'bio-corps-05-b-svg@1',20:'bio-corps-05-c-svg@1'}[version];
    const characterData={...current.character,thoraxDetails:{...areola,nippleSize:100,relief:0}};
    if(version===20) characterData.navel={size:80,shape:70,relief:60};
    const old={...current,version,renderer,character:characterData};
    const restored=parseAppearance(JSON.stringify(old));
    assert(restored.importedThorax);
    assert.equal(Boolean(restored.importedNavel),version===20);
    assert.deepEqual(restored.selection.state.thoraxDetails,areola);
    assert.equal(current.version,21);
    assert.deepEqual(appearanceDocument(restored.selection,restored),current);
    const replay=character(characterInput(restored.selection),{bellyFinish:true});
    assert.equal(replay,character(characterInput(selection),{bellyFinish:true}));
  }
});
