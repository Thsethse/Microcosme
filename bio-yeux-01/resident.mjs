import {controls} from '../preview/bio-vis-p5-i6/model.mjs';
import {swatch} from '../bio-col-01/palette.mjs';
import {isAdultBody} from './adult-body.mjs';
import {adultSettings, restoreAdultSettings} from './adult-settings.mjs';
import {characterInput, identical} from './appearance.mjs';
import {normalizeEyes} from './eyes.mjs';
import {normalizeIris} from './iris.mjs';
import {normalizeDetails} from './details.mjs';
import {normalizeBrows} from './brows.mjs';
import {normalizeMouth} from './mouth.mjs';
import {normalizeNose} from './nose.mjs';
import {normalizeBeard} from './beard.mjs';
import {normalizeMarks} from './marks.mjs';
import {normalizeScars} from './scars.mjs';
import {normalizeMakeup} from './makeup.mjs';
import {renderView, r02RenderVersion} from './render-profile.mjs';

export const residentSchema = 'microcosme.adult-resident';
export const residentVersion = 1;
export {r02RenderVersion} from './render-profile.mjs';

const views = {portrait: 'head', pawn: 'tile', thumbnail: 'mini'};
const facialTraits = {
  eyes: normalizeEyes, iris: normalizeIris, details: normalizeDetails, brows: normalizeBrows,
  mouth: normalizeMouth, nose: normalizeNose
};
let serial = 0;

function record(value, allowed, required, label) {
  if (!value || ![Object.prototype, null].includes(Object.getPrototypeOf(value)) ||
      Object.keys(value).some(key => !allowed.includes(key)) ||
      required.some(key => !Object.hasOwn(value, key))) {
    throw new Error(label + ' · structure invalide.');
  }
}

function nonempty(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

function validSetting(value, normalize, field) {
  if (value === undefined || value === null || !identical(value, normalize(value))) {
    throw new Error('Réglage individuel invalide · ' + field);
  }
}

function residentProjection(data) {
  const sections = ['schema','version','identity','biology','physical','acquired','voluntary','history','generation'];
  record(data, sections, sections, 'Habitant');
  if (data.schema !== residentSchema || data.version !== residentVersion) {
    throw new Error('Format de sauvegarde habitant non pris en charge.');
  }
  const {identity, biology, physical, acquired, voluntary, history, generation} = data;
  record(identity, ['id'], ['id'], 'Identité');
  if (!nonempty(identity.id)) throw new Error('Identité persistante requise.');
  record(biology, ['body','structure','morphology','naturalHairColor','face','marks'],
    ['body','morphology','naturalHairColor','face'], 'Biologie');
  if (!isAdultBody(biology.body)) throw new Error('Base adulte H/F requise.');
  if (swatch(biology.naturalHairColor).category !== 'natural') throw new Error('Teinte naturelle requise.');
  record(biology.face, Object.keys(facialTraits), [], 'Visage');
  for (const [field, value] of Object.entries(biology.face)) validSetting(value, facialTraits[field], field);
  record(biology.morphology, Object.keys(controls), [], 'Morphologie');
  for (const [axis, value] of Object.entries(biology.morphology)) {
    const {min, max} = controls[axis];
    if (!Number.isFinite(value) || value < min || value > max) throw new Error('Axe morphologique invalide · ' + axis);
  }

  record(physical, ['corpulence','chest','pectorals','thoraxDetails','abdominals','pubicHairLength','beard'], [], 'État physique');
  record(acquired, ['marks','scars'], [], 'Caractéristiques acquises');
  record(voluntary, ['hairstyle','dye','shaved','makeup'], ['hairstyle'], 'Modifications volontaires');
  const {hairstyle, dye, shaved, makeup} = voluntary;
  record(hairstyle, ['style','arrangement','accessories','contrast','monochrome'], ['style','arrangement'], 'Coiffure');
  if (!nonempty(hairstyle.style) || !['G','D','U'].includes(hairstyle.arrangement) ||
      ['accessories','contrast','monochrome'].some(key => Object.hasOwn(hairstyle, key) && typeof hairstyle[key] !== 'boolean')) {
    throw new Error('Coiffure invalide.');
  }
  if (Object.hasOwn(voluntary, 'dye')) swatch(dye);
  if (Object.hasOwn(voluntary, 'shaved') && typeof shaved !== 'boolean') throw new Error('État de rasage invalide.');
  if (Object.hasOwn(voluntary, 'makeup')) validSetting(makeup, normalizeMakeup, 'makeup');
  const {beard, ...bodySettings} = physical;
  if (Object.hasOwn(physical, 'beard')) validSetting(beard, normalizeBeard, 'beard');
  for (const group of [biology, acquired]) {
    if (Object.hasOwn(group, 'marks')) validSetting(group.marks, normalizeMarks, 'marks');
  }
  const marks = normalizeMarks([...(biology.marks ?? []), ...(acquired.marks ?? [])]);
  if (Object.hasOwn(acquired, 'scars')) validSetting(acquired.scars, normalizeScars, 'scars');

  if (!Array.isArray(history)) throw new Error('Provenance des transformations invalide.');
  for (const event of history) {
    const fields = ['target', 'source'];
    record(event, fields, fields, 'Transformation');
    if (!fields.every(key => nonempty(event[key]))) throw new Error('Provenance de transformation incomplète.');
  }
  if (generation !== null) {
    const fields = ['seed', 'generatorVersion'];
    record(generation, fields, fields, 'Génération');
    if (typeof generation.seed !== 'string' || !nonempty(generation.generatorVersion)) {
      throw new Error('Métadonnées de génération invalides.');
    }
  }

  if (Object.hasOwn(biology, 'structure')) bodySettings.structure = biology.structure;
  const selection = restoreAdultSettings({...biology.morphology, ...hairstyle, body: 'standard'}, biology.body, bodySettings);
  if (!identical(adultSettings(selection.state), bodySettings) ||
      selection.key !== `${hairstyle.style}:${hairstyle.arrangement}`) {
    throw new Error('Réglages corporels ou coiffure incompatibles.');
  }
  return {
    input: characterInput(selection),
    options: {
      ...biology.face, marks, scars: acquired.scars, makeup,
      beard: shaved ? null : beard,
      hairColor: dye ?? biology.naturalHairColor, rememberedHairColor: dye ?? biology.naturalHairColor
    }
  };
}

export function serializeResident(resident) {
  residentProjection(resident);
  const text = JSON.stringify(resident, null, 2);
  if (!identical(resident, JSON.parse(text))) throw new Error('Données individuelles incompatibles avec JSON.');
  return text;
}

export function parseResident(text) {
  const resident = JSON.parse(text);
  residentProjection(resident);
  return resident;
}

export function renderResident(resident, {representation = 'portrait', instance, renderVersion = r02RenderVersion} = {}) {
  if (renderVersion !== r02RenderVersion) throw new Error('Version de rendu habitant non prise en charge.');
  if (!Object.hasOwn(views, representation)) throw new Error('Représentation inconnue.');
  if (instance !== undefined && (typeof instance !== 'string' || !/^[A-Za-z0-9_-]+$/.test(instance))) {
    throw new Error('Identifiant d’instance SVG invalide.');
  }
  const {input, options} = residentProjection(resident);
  return renderView(input, {
    ...options, view: views[representation], naturalEyes: true, boneReliefs: true, bellyFinish: true,
    pelvicDetails: true, instance: instance === undefined ? `resident-${++serial}` : `resident-explicit-${instance}`
  });
}
