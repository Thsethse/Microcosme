import {isAdultBody} from './adult-body.mjs';
import {groups as inheritedGroups, ordinaryChoices as inheritedOrdinary} from '../bio-col-01/catalogue.mjs';
import {restoreSelection as restoreHistorical, selectOrdinary as selectHistoricalOrdinary} from '../bio-col-01/selection.mjs';

export {choices, choice} from '../bio-col-01/catalogue.mjs';
export {exportSelection} from '../bio-col-01/selection.mjs';

const alias = Object.freeze({
  id: 'BIO-INV-01-C', primary: 'p5-048:D', secondary: 'p5-065:D',
  primaryLabel: '48-D', secondaryLabel: '65-D'
});
export const groups = Object.freeze([...inheritedGroups, alias]);
export const ordinaryChoices = Object.freeze(inheritedOrdinary.filter(entry => entry.key !== alias.secondary));

export function restoreSelection(raw, body) {
  const selection = restoreHistorical(raw);
  // Only an explicit editor choice or a versioned appearance can select an adult base.
  if (isAdultBody(body)) selection.state.body = body;
  if (selection.key !== alias.secondary) return selection;
  return {...selection, visibleKey: alias.primary, group: alias};
}

export function selectOrdinary(key, previous) {
  if (key === alias.secondary) throw new RangeError('Utilisez les identifiants historiques pour ouvrir 65-D.');
  return selectHistoricalOrdinary(key, previous);
}
