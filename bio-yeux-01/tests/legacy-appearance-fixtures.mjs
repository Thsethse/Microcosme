import {restoreAdultSettings} from '../adult-settings.mjs';
import {appearanceDocument} from '../appearance.mjs';
import {referenceAbdominals} from '../abdominals.mjs';
import {normalizeBrows} from '../brows.mjs';
import {referenceStructure} from '../body-structure.mjs';
import {referenceChest} from '../chest.mjs';
import {normalizeDetails} from '../details.mjs';
import {normalizeIris} from '../iris.mjs';
import {normalizeMakeup} from '../makeup.mjs';
import {normalizeMarks} from '../marks.mjs';
import {mouthPresets, normalizeMouth} from '../mouth.mjs';
import {nosePresets, normalizeNose} from '../nose.mjs';
import {referencePectorals} from '../pectorals.mjs';
import {normalizeScars} from '../scars.mjs';
import {referenceThoraxDetails} from '../thorax-details.mjs';

const raw = {style:'p5-061', arrangement:'G', body:'standard'};
const colour = 'chatain-clair';
const basic = {eyes:null, form:'historical', colour, flat:true};
const iris = normalizeIris({heterochromia:'complete'});
const details = normalizeDetails({});
const brows = normalizeBrows({arc:0});
const mouth = normalizeMouth(mouthPresets.fine.values);
const nose = normalizeNose(nosePresets.short.values);
const marks = normalizeMarks([{id:'m1',type:'freckles',seed:'marque'}]);
const scars = normalizeScars([{id:'s1',seed:'cicatrice'}]);
const makeup = normalizeMakeup({lips:{enabled:true}});

export const legacyAppearanceDefaults = {raw, basic, iris, details, brows, mouth, nose, marks, scars, makeup};

export function historicalDocuments() {
  const plain = restoreAdultSettings(raw,'standard',{});
  const adult = (body, values) => appearanceDocument(restoreAdultSettings(raw,body,values),basic);
  const facial = [{},{irisLatent:iris},{detailsLatent:details},{browsLatent:brows},{mouthLatent:mouth},
    {noseLatent:nose},{beardCategory:'T'},{marks},{scars},{makeup}]
    .map(settings => appearanceDocument(plain,{...basic,...settings}));
  const chest = adult('adult-f',{chest:referenceChest});
  const oldChest = {...chest,version:14,renderer:'bio-corps-04-a-svg@1',
    character:{...chest.character,chest:{...chest.character.chest,divergence:-9,position:37.125}}};
  const oldAreola = {thoraxDetails:{...referenceThoraxDetails['adult-h'],nippleSize:22.5,relief:14.125}};
  const details18 = adult('adult-h',{thoraxDetails:referenceThoraxDetails['adult-h']});
  const abs = adult('adult-h',{abdominals:referenceAbdominals});
  return [
    ...facial,
    adult('adult-h',{}),
    adult('adult-h',{structure:referenceStructure}),
    adult('adult-f',{corpulence:37.125}),
    oldChest,{...chest,version:15,renderer:'bio-corps-04-a-r01-svg@1'},chest,
    adult('adult-h',{pectorals:referencePectorals}),
    {...details18,version:18,renderer:'bio-corps-04-c-svg@1',character:{...details18.character,...oldAreola}},
    {...abs,character:{...abs.character,...oldAreola}},
    {...abs,version:20,renderer:'bio-corps-05-c-svg@1',
      character:{...abs.character,...oldAreola,navel:{size:38,shape:36,relief:28}}},
    details18,
    adult('adult-f',{pubicHairLength:36.125})
  ];
}
