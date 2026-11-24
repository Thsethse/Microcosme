import {choice, restoreSelection} from './catalogue.mjs';
import {swatch} from '../bio-col-01/palette.mjs';
import {controls, normalize} from '../bio-vis-p5-i6/model.mjs';
import {eyePresets, eyesFor} from './eyes.mjs';
import {currentDraw, legacyDraw} from './draw.mjs';
import {irisDrawVersion, normalizeIris, solveIris} from './iris.mjs';

export const appearanceSchema = 'microcosme.appearance';
export const appearanceVersion = 1;
export const renderVersion = 'bio-yeux-01-svg@1';
export const irisAppearanceVersion = 2;
export const irisRenderVersion = 'bio-yeux-02-svg@1';

export function characterInput(selection, key = selection.key) {
  const {style, arrangement} = choice(key);
  return {
    ...selection.state, style, arrangement: arrangement === 'U' ? 'G' : arrangement,
    accessories: selection.raw.accessories !== false, contrast: selection.raw.contrast !== false
  };
}

function validDraw(draw) {
  return draw && typeof draw.seed === 'string' && [currentDraw, legacyDraw].includes(draw.version);
}

export function appearanceDocument(selection, {eyes, form, draw, colour, flat, iris, irisLatent, irisDraw}) {
  const entry = choice(selection.key);
  const input = characterInput(selection);
  const applied = normalize(input);
  const result = eyesFor(input, eyes);
  if (result.effective && !Object.hasOwn(eyePresets, form) && !['custom', 'minimum', 'maximum'].includes(form)) {
    throw new RangeError('Forme d’yeux inconnue.');
  }
  swatch(colour);
  if (draw && !validDraw(draw)) throw new RangeError('Métadonnées du tirage invalides.');
  const pigment = solveIris(result, iris);
  const latent = !pigment && normalizeIris(irisLatent);
  if (irisDraw && (typeof irisDraw.seed !== 'string' || irisDraw.version !== irisDrawVersion || !(pigment || latent))) {
    throw new RangeError('Métadonnées du tirage des iris invalides.');
  }
  const ink = pigment ? {mode:'custom', requested:pigment.requested, effective:pigment.effective} :
    latent ? {mode:'historical', latent} : null;
  if (ink && irisDraw) ink.draw = {seed:irisDraw.seed, version:irisDraw.version};
  return {
    schema: appearanceSchema,
    version: ink ? irisAppearanceVersion : appearanceVersion,
    renderer: ink ? irisRenderVersion : renderVersion,
    character: {
      style: entry.style, arrangement: entry.arrangement, body: applied.body,
      morphology: Object.fromEntries(Object.keys(controls).map(key => [key, applied[key]])),
      options: {accessories: input.accessories, contrast: input.contrast, monochrome: input.monochrome === true},
      effectiveOptions: {accessories: applied.accessories !== false, contrast: applied.contrast !== false,
        monochrome: applied.monochrome === true}
    },
    eyes: result.effective ? {
      mode: 'custom', form, effective: {...result.effective}, requested: {...result.requested},
      ...(draw ? {draw: {seed: draw.seed, version: draw.version}} : {})
    } : {mode: 'historical'},
    palette: {colour, mode: flat ? 'flat' : 'historical'},
    ...(ink ? {iris:ink} : {}),
    historicalSelection: structuredClone(selection.raw)
  };
}

function identical(a, b) {
  if (a === b) return true;
  if (!a || !b || typeof a !== 'object' || typeof b !== 'object' || Array.isArray(a) !== Array.isArray(b)) return false;
  const keys = Object.keys(a);
  return keys.length === Object.keys(b).length && keys.every(key => Object.hasOwn(b, key) && identical(a[key], b[key]));
}

export function parseAppearance(text) {
  const data = JSON.parse(text);
  if (data?.schema !== appearanceSchema) throw new Error('Document d’apparence requis. Utilisez la sélection historique pour un ancien JSON.');
  if (![appearanceVersion, irisAppearanceVersion].includes(data.version) || (data.version === irisAppearanceVersion && !data.iris)) {
    throw new Error('Version du document d’apparence non prise en charge.');
  }
  const v2 = data.version === irisAppearanceVersion;
  if (data.renderer !== (v2 ? irisRenderVersion : renderVersion)) throw new Error('Version de rendu non prise en charge.');
  const selection = restoreSelection(data.historicalSelection);
  if (!data.eyes || !['historical', 'custom'].includes(data.eyes.mode) ||
      !data.palette || !['flat', 'historical'].includes(data.palette.mode)) {
    throw new Error('Mode des yeux ou de la palette invalide.');
  }
  const settings = {
    eyes: data.eyes.mode === 'historical' ? null : data.eyes.requested,
    form: data.eyes.mode === 'historical' ? 'historical' : data.eyes.form,
    draw: data.eyes.draw,
    colour: data.palette.colour,
    flat: data.palette.mode === 'flat'
  };
  if (v2) {
    if (!data.iris || !['custom','historical'].includes(data.iris.mode)) throw new Error('Mode des iris invalide.');
    settings.iris = data.iris.mode === 'custom' ? data.iris.requested : null;
    settings.irisLatent = data.iris.mode === 'historical' ? data.iris.latent : null;
    settings.irisDraw = data.iris.draw;
  }
  const rebuilt = appearanceDocument(selection, settings);
  if (!identical(rebuilt, data)) throw new Error('Données effectives incompatibles avec la sélection et les demandes.');
  // Verify and retain the requests for editing. They replay the archived
  // effective values exactly under this supported renderer version.
  return {selection, ...settings};
}
