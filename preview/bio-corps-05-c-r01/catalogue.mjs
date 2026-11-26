import {isAdultBody} from './adult-body.mjs';
import {validateStructure} from './body-structure.mjs';
import {validateCorpulence} from './body-corpulence.mjs';
import {validateChest, validateChestOrigin} from './chest.mjs';
import {validatePectorals} from './pectorals.mjs';
import {validateThoraxDetails} from './thorax-details.mjs';
import {validateAbdominals} from './abdominals.mjs';
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

export function restoreSelection(raw, body, structure, corpulence, chest, chestOrigin, pectorals, thoraxDetails, abdominals) {
  const selection = restoreHistorical(raw);
  // Only an explicit editor choice or a versioned appearance can select an adult base.
  if (isAdultBody(body)) {
    selection.state.body = body;
    if (structure != null) selection.state.structure = Object.freeze({...validateStructure(structure)});
    if (corpulence != null) selection.state.corpulence = validateCorpulence(corpulence);
    if (body === 'adult-f' && chest != null) {
      selection.state.chest = Object.freeze({...validateChest(chest)});
      if (chestOrigin !== undefined) selection.state.chestOrigin = Object.freeze({...validateChestOrigin(chestOrigin)});
    }
    if (body === 'adult-h' && pectorals != null) selection.state.pectorals=Object.freeze({...validatePectorals(pectorals)});
    if (thoraxDetails != null) selection.state.thoraxDetails=Object.freeze({...validateThoraxDetails(thoraxDetails)});
    if (abdominals != null) selection.state.abdominals=Object.freeze({...validateAbdominals(abdominals)});
  }
  if (selection.key !== alias.secondary) return selection;
  return {...selection, visibleKey: alias.primary, group: alias};
}

export function selectOrdinary(key, previous) {
  if (key === alias.secondary) throw new RangeError('Utilisez les identifiants historiques pour ouvrir 65-D.');
  return selectHistoricalOrdinary(key, previous);
}
