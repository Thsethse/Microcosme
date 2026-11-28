import {browPresets} from '../../bio-yeux-01/brows.mjs';
import {eyePresets} from '../../bio-yeux-01/eyes.mjs';
import {controls, presets} from '../bio-vis-p5-i6/model.mjs';
import {priorityCase} from '../bio-vis-p5-i6/i5/i4/i3/i2/i1/base/r1/coverage.mjs';

const extrema = side => Object.fromEntries(Object.entries(controls).map(([key, axis]) => [key, axis[side]]));
const morphologies = {
  neutral: {label: 'Neutre', values: {}},
  tall: {label: 'Allongé, front haut', values: presets.tall.values},
  broad: {label: 'Large, joues et bajoues', values: presets.broad.values},
  ipad: {label: 'Cas iPad combiné', values: priorityCase},
  min: {label: 'Minima du visage', values: extrema('min')},
  max: {label: 'Maxima du visage', values: extrema('max')}
};
const profiles = {
  reference: {label: 'Référence normalisée', values: {}},
  ...browPresets,
  thinRising: {label: 'Aminci et relevé', values: {thickness: 20, arc: 60, tilt: 17}},
  thickSlit: {label: 'Épais et fendu', values: {...browPresets.thick.values, slit: true}},
  joined: {label: 'Arrondi, joint et fendu', values: {...browPresets.round.values, monobrow: true, slit: true}}
};

function scenario(id, base, morph, eyes, profile, style = 'shaved') {
  return {
    id,
    label: [base, morphologies[morph].label, eyes ? eyePresets[eyes].label : 'Yeux historiques', profiles[profile].label].join(' · '),
    input: {...morphologies[morph].values, style, arrangement: 'G', body: base === 'H' ? 'adult-h' : 'adult-f'},
    eyes,
    brows: profiles[profile].values,
    colours: {rememberedHairColor: 'chatain-clair'}
  };
}

export const visualCases = [
  scenario('neutral-h', 'H', 'neutral', null, 'reference'),
  scenario('neutral-f', 'F', 'neutral', 'round', 'round', 'p5-038'),
  scenario('tall-h', 'H', 'tall', 'upturned', 'rising'),
  scenario('broad-f', 'F', 'broad', 'heavy', 'thick'),
  scenario('ipad-f', 'F', 'ipad', 'almond', 'inflected'),
  scenario('extreme-h', 'H', 'max', 'downturned', 'falling'),
  scenario('extreme-f', 'F', 'min', 'crescent', 'thickSlit'),
  scenario('thin-h', 'H', 'neutral', 'narrow', 'thinRising'),
  scenario('joined-f', 'F', 'broad', 'oval', 'joined')
];

export function* studyCases() {
  for (const base of ['H', 'F']) {
    for (const morph of Object.keys(morphologies)) {
      for (const eyes of [null, ...Object.keys(eyePresets)]) {
        for (const profile of Object.keys(profiles)) {
          const id = [base, morph, eyes ?? 'historical', profile].join('-');
          yield {profile, ...scenario(id, base, morph, eyes, profile)};
        }
      }
    }
  }
}
