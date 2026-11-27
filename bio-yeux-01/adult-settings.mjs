import {restoreSelection} from './catalogue.mjs';

const fields = ['structure', 'corpulence', 'chest', 'chestOrigin', 'pectorals', 'thoraxDetails', 'abdominals', 'pubicHairLength'];

export function adultSettings(state) {
  return Object.fromEntries(fields.filter(key => state[key] !== undefined).map(key => [key, state[key]]));
}

export function restoreAdultSettings(raw, body, settings) {
  return restoreSelection(raw, body, ...fields.map(key => settings[key]));
}
