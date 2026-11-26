import {controls} from '../bio-vis-p5-i6/model.mjs';
import {character} from './render.mjs';

const views = [{headOnly: true}, {headOnly: false}, {headOnly: true, smallScale: true}];

export function availableOptions(input, hairColor) {
  // Keep instance and all other options fixed. Inspect the rendered layers
  // rather than enumerating styles that happen to carry them today.
  const changes = (a, b, first = hairColor, second = first) => views.some(view =>
    character(a, {...view, instance: 'check-options', hairColor: first}) !==
    character(b, {...view, instance: 'check-options', hairColor: second}));
  const toggles = Object.fromEntries(['accessories', 'contrast'].map(key => [key,
    changes({...input, [key]: false}, {...input, [key]: true})]));
  const front = controls.forehead_height;
  return {
    ...toggles,
    palette: changes(input, input, 'noir-profond', 'blanc-ivoire'),
    arrangement: changes({...input, arrangement: 'G'}, {...input, arrangement: 'D'}),
    forehead: changes({...input, forehead_height: front.min}, {...input, forehead_height: front.max})
  };
}
