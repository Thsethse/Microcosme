import {choice, restoreSelection} from './catalogue.mjs';
import {swatch} from '../bio-col-01/palette.mjs';
import {controls, model, normalize} from '../bio-vis-p5-i6/model.mjs';
import {eyePresets, eyesFor} from './eyes.mjs';
import {currentDraw, legacyDraw} from './draw.mjs';
import {irisDrawVersion, normalizeIris, solveIris} from './iris.mjs';
import {detailsDrawVersion, normalizeDetails, solveDetails} from './details.mjs';
import {browDrawVersion, normalizeBrows, solveBrows} from './brows.mjs';
import {mouthDrawVersion, normalizeMouth, solveMouth} from './mouth.mjs';

export const appearanceSchema = 'microcosme.appearance';
export const appearanceVersion = 1;
export const renderVersion = 'bio-yeux-01-svg@1';
export const irisAppearanceVersion = 2;
export const irisRenderVersion = 'bio-yeux-02-svg@1';
export const detailsAppearanceVersion = 3;
export const detailsRenderVersion = 'bio-yeux-03-svg@1';
export const browAppearanceVersion = 4;
export const browRenderVersion = 'bio-sourcils-01-svg@1';
export const mouthAppearanceVersion = 5;
export const mouthRenderVersion = 'bio-bouche-01-svg@1';
const renderers = {1:renderVersion, 2:irisRenderVersion, 3:detailsRenderVersion, 4:browRenderVersion, 5:mouthRenderVersion};

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

export function appearanceDocument(selection, {eyes, form, draw, colour, flat, iris, irisLatent, irisDraw,
  details, detailsLatent, detailsDraw, brows, browsLatent, browsDraw, mouth, mouthLatent, mouthDraw}) {
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
  const ornament = solveDetails(result,details);
  const remembered = !ornament && normalizeDetails(detailsLatent);
  const eyeDetails = ornament ? {mode:'custom',requested:ornament.requested,effective:ornament.effective} :
    remembered ? {mode:'historical',latent:remembered} : null;
  if (detailsDraw) {
    if (typeof detailsDraw.seed !== 'string' || detailsDraw.version !== detailsDrawVersion || !eyeDetails) {
      throw new RangeError('Métadonnées du tirage des détails invalides.');
    }
    eyeDetails.draw = {seed:detailsDraw.seed,version:detailsDraw.version};
  }
  const browResult = brows == null || brows === 'historical' ? null : solveBrows(model(input),result,brows,
    {hairColor:flat?colour:'historical',rememberedHairColor:colour});
  const browMemory = !browResult && normalizeBrows(browsLatent);
  const browAppearance = browResult ? {mode:'custom',requested:browResult.requested,
    effective:browResult.effective,pigment:browResult.pigment} :
    browMemory ? {mode:'historical',latent:browMemory} : null;
  if (browsDraw) {
    if (typeof browsDraw.seed !== 'string' || browsDraw.version !== browDrawVersion || !browAppearance) {
      throw new RangeError('Métadonnées du tirage des sourcils invalides.');
    }
    browAppearance.draw = {seed:browsDraw.seed,version:browsDraw.version};
  }
  const mouthResult = mouth == null || mouth === 'historical' ? null : solveMouth(model(input),result,mouth);
  const mouthMemory = !mouthResult && normalizeMouth(mouthLatent);
  const mouthAppearance = mouthResult ? {mode:'custom',requested:mouthResult.requested,effective:mouthResult.effective} :
    mouthMemory ? {mode:'historical',latent:mouthMemory} : null;
  if (mouthDraw) {
    if (typeof mouthDraw.seed !== 'string' || mouthDraw.version !== mouthDrawVersion || !mouthAppearance) {
      throw new RangeError('Métadonnées du tirage de la bouche invalides.');
    }
    mouthAppearance.draw = {seed:mouthDraw.seed,version:mouthDraw.version};
  }
  const version = mouthAppearance ? mouthAppearanceVersion : browAppearance ? browAppearanceVersion :
    eyeDetails ? detailsAppearanceVersion :
    ink ? irisAppearanceVersion : appearanceVersion;
  return {
    schema: appearanceSchema,
    version,
    renderer: renderers[version],
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
    ...(eyeDetails ? {details:eyeDetails} : {}),
    ...(browAppearance ? {brows:browAppearance} : {}),
    ...(mouthAppearance ? {mouth:mouthAppearance} : {}),
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
  if (![appearanceVersion, irisAppearanceVersion, detailsAppearanceVersion, browAppearanceVersion, mouthAppearanceVersion].includes(data.version) ||
      (data.version === irisAppearanceVersion && !data.iris) || (data.version === detailsAppearanceVersion && !data.details) ||
      (data.version === browAppearanceVersion && !data.brows) || (data.version === mouthAppearanceVersion && !data.mouth)) {
    throw new Error('Version du document d’apparence non prise en charge.');
  }
  if (data.renderer !== renderers[data.version]) throw new Error('Version de rendu non prise en charge.');
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
  if (data.version >= irisAppearanceVersion && data.iris) {
    if (!data.iris || !['custom','historical'].includes(data.iris.mode)) throw new Error('Mode des iris invalide.');
    settings.iris = data.iris.mode === 'custom' ? data.iris.requested : null;
    settings.irisLatent = data.iris.mode === 'historical' ? data.iris.latent : null;
    settings.irisDraw = data.iris.draw;
  }
  if (data.version >= detailsAppearanceVersion && data.details) {
    if (!['custom','historical'].includes(data.details.mode)) throw new Error('Mode des détails invalide.');
    settings.details = data.details.mode === 'custom' ? data.details.requested : null;
    settings.detailsLatent = data.details.mode === 'historical' ? data.details.latent : null;
    settings.detailsDraw = data.details.draw;
  }
  if (data.version >= browAppearanceVersion && data.brows) {
    if (!['custom','historical'].includes(data.brows.mode)) throw new Error('Mode des sourcils invalide.');
    settings.brows = data.brows.mode === 'custom' ? data.brows.requested : null;
    settings.browsLatent = data.brows.mode === 'historical' ? data.brows.latent : null;
    settings.browsDraw = data.brows.draw;
  }
  if (data.version === mouthAppearanceVersion) {
    if (!['custom','historical'].includes(data.mouth.mode)) throw new Error('Mode de bouche invalide.');
    settings.mouth = data.mouth.mode === 'custom' ? data.mouth.requested : null;
    settings.mouthLatent = data.mouth.mode === 'historical' ? data.mouth.latent : null;
    settings.mouthDraw = data.mouth.draw;
  }
  const rebuilt = appearanceDocument(selection, settings);
  if (!identical(rebuilt, data)) throw new Error('Données effectives incompatibles avec la sélection et les demandes.');
  // Verify and retain the requests for editing. They replay the archived
  // effective values exactly under this supported renderer version.
  return {selection, ...settings};
}
