import {residentSchema, residentVersion} from './resident.mjs';
import {referenceStructure} from './body-structure.mjs';
import {referenceChest} from './chest.mjs';
import {referencePectorals} from './pectorals.mjs';
import {referenceThoraxDetails} from './thorax-details.mjs';
import {referenceAbdominals} from './abdominals.mjs';
import {normalizeEyes} from './eyes.mjs';
import {normalizeIris} from './iris.mjs';
import {normalizeBeard} from './beard.mjs';
import {normalizeScars} from './scars.mjs';
import {normalizeMakeup} from './makeup.mjs';

export function residentWitnesses() {
  return [
    {
      schema: residentSchema, version: residentVersion, identity: {id: 'temoin-f-01'},
      biology: {
        body: 'adult-f', structure: {...referenceStructure}, morphology: {}, naturalHairColor: 'chatain-clair',
        face: {eyes: normalizeEyes({width: 108}), iris: normalizeIris({})}
      },
      physical: {corpulence: 81.125, chest: {...referenceChest, volume: 74.25},
        thoraxDetails: {...referenceThoraxDetails['adult-f']}, abdominals: {...referenceAbdominals},
        pubicHairLength: 36.125},
      acquired: {},
      voluntary: {hairstyle: {style: 'p5-061', arrangement: 'G'}, makeup: normalizeMakeup({lips: {enabled: true}})},
      history: [{target: 'voluntary.makeup', source: 'Choix explicite du témoin'}], generation: null
    },
    {
      schema: residentSchema, version: residentVersion, identity: {id: 'temoin-h-01'},
      biology: {
        body: 'adult-h', structure: {...referenceStructure}, morphology: {jaw_width: 1.1},
        naturalHairColor: 'brun-chocolat', face: {eyes: normalizeEyes({height: 82})}
      },
      physical: {corpulence: 43.25, pectorals: {...referencePectorals, volume: 57},
        thoraxDetails: {...referenceThoraxDetails['adult-h']}, abdominals: {...referenceAbdominals},
        pubicHairLength: 75, beard: normalizeBeard({zones: {chin: true}})},
      acquired: {scars: normalizeScars([{id: 's1', mode: 'line'}])},
      voluntary: {hairstyle: {style: 'p5-038', arrangement: 'G'}},
      history: [{target: 'acquired.scars.s1', source: 'Blessure ancienne, définie pour le témoin'}],
      generation: null
    }
  ];
}
