import {isAdultBody} from './adult-body.mjs';
import {validateStructure} from './body-structure.mjs';
import {validateCorpulence} from './body-corpulence.mjs';
import {validateChest, validateChestOrigin} from './chest.mjs';
import {validatePectorals} from './pectorals.mjs';
import {validateThoraxDetails} from './thorax-details.mjs';
import {validateAbdominals} from './abdominals.mjs';
import {choice, restoreSelection} from './catalogue.mjs';
import {swatch} from '../bio-col-01/palette.mjs';
import {controls, model, normalize} from '../preview/bio-vis-p5-i6/model.mjs';
import {eyePresets, eyesFor} from './eyes.mjs';
import {currentDraw, legacyDraw} from './draw.mjs';
import {irisDrawVersion, normalizeIris, solveIris} from './iris.mjs';
import {detailsDrawVersion, normalizeDetails, solveDetails} from './details.mjs';
import {browDrawVersion, normalizeBrows, solveBrows} from './brows.mjs';
import {mouthDrawVersion, normalizeMouth, solveMouth} from './mouth.mjs';
import {noseDrawVersion, normalizeNose, solveNose} from './nose.mjs';
import {beardCategoryOf, beardDrawVersion, normalizeBeard, solveBeard} from './beard.mjs';
import {normalizeMarks, solveMarks} from './marks.mjs';
import {normalizeScars, solveScars} from './scars.mjs';
import {normalizeMakeup} from './makeup.mjs';
import {solveMakeup} from './makeup-render.mjs';

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
export const noseAppearanceVersion = 6;
export const noseRenderVersion = 'bio-nez-01-svg@1';
export const beardAppearanceVersion = 7;
export const beardRenderVersion = 'bio-pilosite-01-svg@1';
export const marksAppearanceVersion = 8;
export const marksRenderVersion = 'bio-marques-01-svg@1';
export const scarAppearanceVersion = 9;
export const scarRenderVersion = 'bio-cicatrices-01-svg@1';
export const makeupAppearanceVersion = 10;
export const makeupRenderVersion = 'bio-maquillage-01-svg@1';
export const bodyAppearanceVersion = 11;
export const bodyRenderVersion = 'bio-corps-01-svg@1';
export const structureAppearanceVersion = 12;
export const structureRenderVersion = 'bio-corps-02-svg@1';
export const corpulenceAppearanceVersion = 13;
export const corpulenceRenderVersion = 'bio-corps-03-svg@1';
const previousChestAppearanceVersion = 14;
const chestR01AppearanceVersion = 15;
export const chestAppearanceVersion = 16;
export const chestRenderVersion = 'bio-corps-04-a-r02-svg@1';
export const pectoralAppearanceVersion = 17;
export const pectoralRenderVersion = 'bio-corps-04-b-svg@1';
export const thoraxDetailsAppearanceVersion = 18;
export const abdominalAppearanceVersion = 19;
const renderers = {1:renderVersion, 2:irisRenderVersion, 3:detailsRenderVersion, 4:browRenderVersion, 5:mouthRenderVersion, 6:noseRenderVersion, 7:beardRenderVersion, 8:marksRenderVersion, 9:scarRenderVersion, 10:makeupRenderVersion, 11:bodyRenderVersion, 12:structureRenderVersion, 13:corpulenceRenderVersion, 14:'bio-corps-04-a-svg@1', 15:'bio-corps-04-a-r01-svg@1', 16:chestRenderVersion, 17:pectoralRenderVersion, 18:'bio-corps-04-c-svg@1', 19:'bio-corps-05-b-svg@1'};

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
  details, detailsLatent, detailsDraw, brows, browsLatent, browsDraw, mouth, mouthLatent, mouthDraw, nose, noseLatent, noseDraw, beard, beardLatent, beardDraw, beardCategory, marks, marksLatent, scars, scarsLatent, makeup, makeupLatent}) {
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
  const noseResult = nose == null || nose === 'historical' ? null : solveNose(model(input),result,nose,{mouth,eyeDetails:ornament});
  const noseMemory = !noseResult && normalizeNose(noseLatent);
  const noseAppearance = noseResult ? {mode:'custom',requested:noseResult.requested,effective:noseResult.effective,
    anatomy:noseResult.geometry.anatomy} : noseMemory ? {mode:'historical',latent:noseMemory} : null;
  if (noseDraw) {
    if (typeof noseDraw.seed !== 'string' || noseDraw.version !== noseDrawVersion || !noseAppearance) {
      throw new RangeError('Métadonnées du tirage du nez invalides.');
    }
    noseAppearance.draw = {seed:noseDraw.seed,version:noseDraw.version};
  }
  const mouthResult = mouth == null || mouth === 'historical' ? null : solveMouth(model(input),result,mouth,
    {noseBounds:noseResult?.geometry.anatomy,preserveMouth:!!noseResult});
  const mouthMemory = !mouthResult && normalizeMouth(mouthLatent);
  const mouthAppearance = mouthResult ? {mode:'custom',requested:mouthResult.requested,effective:mouthResult.effective} :
    mouthMemory ? {mode:'historical',latent:mouthMemory} : null;
  if (mouthDraw) {
    if (typeof mouthDraw.seed !== 'string' || mouthDraw.version !== mouthDrawVersion || !mouthAppearance) {
      throw new RangeError('Métadonnées du tirage de la bouche invalides.');
    }
    mouthAppearance.draw = {seed:mouthDraw.seed,version:mouthDraw.version};
  }
  const category = beardCategoryOf(beardCategory);
  const beardResult = normalizeBeard(beard) && solveBeard(model(input),result,beard,{
    category,hairColor:flat?colour:'historical',rememberedHairColor:colour,
    detailResult:ornament,noseResult,mouthResult
  });
  const beardMemory = !beardResult && normalizeBeard(beardLatent);
  const facialHair = beardResult ? {mode:'custom',category,requested:beardResult.requested,
    effective:beardResult.effective,pigment:beardResult.pigment} :
    beardMemory || category!=='H' ? {mode:'historical',category,...(beardMemory?{latent:beardMemory}:{})} : null;
  if (beardDraw) {
    if (typeof beardDraw.seed !== 'string' || beardDraw.version !== beardDrawVersion || !(beardMemory||beardResult)) {
      throw new RangeError('Métadonnées du tirage de la pilosité invalides.');
    }
    facialHair.draw = {seed:beardDraw.seed,version:beardDraw.version};
  }
  const marksResult = normalizeMarks(marks).length ? solveMarks(model(input),result,marks,{noseResult,mouthResult}) : null;
  const marksMemory = marksResult ? [] : normalizeMarks(marksLatent);
  const cutaneousMarks = marksResult ? {mode:'custom',requested:marksResult.requested,effective:marksResult.effective} :
    marksMemory.length ? {mode:'historical',latent:marksMemory} : null;
  const scarResult = normalizeScars(scars).length ? solveScars(model(input),result,scars,{noseResult,mouthResult}) : null;
  const scarMemory = scarResult ? [] : normalizeScars(scarsLatent);
  const healedScars = scarResult ? {mode:'custom',requested:scarResult.requested,effective:scarResult.effective} :
    scarMemory.length ? {mode:'historical',latent:scarMemory} : null;
  const cosmetics = makeup ? solveMakeup(model(input), result, makeup, {noseResult, mouthResult, detailResult: ornament}) : null;
  const cosmeticAppearance = cosmetics ? {mode:'custom', requested:cosmetics.requested, effective:cosmetics.effective} :
    makeupLatent ? {mode:'historical', latent:normalizeMakeup(makeupLatent)} : null;
  const adult = isAdultBody(input.body);
  const structure = adult && input.structure;
  const corpulence = adult ? input.corpulence : undefined;
  const chest = input.body === 'adult-f' ? input.chest : undefined;
  const pectorals = input.body === 'adult-h' ? input.pectorals : undefined;
  const thoraxDetails = adult ? input.thoraxDetails : undefined;
  const abdominals = adult ? input.abdominals : undefined;
  const version = abdominals ? abdominalAppearanceVersion : thoraxDetails ? thoraxDetailsAppearanceVersion : pectorals ? pectoralAppearanceVersion : chest ? chestAppearanceVersion : corpulence !== undefined ? corpulenceAppearanceVersion : structure ? structureAppearanceVersion : adult ? bodyAppearanceVersion : cosmeticAppearance ? makeupAppearanceVersion : healedScars ? scarAppearanceVersion : cutaneousMarks ? marksAppearanceVersion : facialHair ? beardAppearanceVersion : noseAppearance ? noseAppearanceVersion : mouthAppearance ? mouthAppearanceVersion : browAppearance ? browAppearanceVersion :
    eyeDetails ? detailsAppearanceVersion :
    ink ? irisAppearanceVersion : appearanceVersion;
  return {
    schema: appearanceSchema,
    version,
    renderer: renderers[version],
    character: {
      style: entry.style, arrangement: entry.arrangement, body: adult ? input.body : applied.body,
      ...(structure ? {structure: {...structure}} : {}),
      ...(corpulence !== undefined ? {corpulence} : {}),
      ...(chest ? {chest:{...chest}} : {}),
      ...(chest && input.chestOrigin ? {chestOrigin:{...input.chestOrigin}} : {}),
      ...(pectorals ? {pectorals:{...pectorals}} : {}),
      ...(thoraxDetails ? {thoraxDetails:{...thoraxDetails}} : {}),
      ...(abdominals ? {abdominals:{...abdominals}} : {}),
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
    ...(noseAppearance ? {nose:noseAppearance} : {}),
    ...(facialHair ? {facialHair} : {}),
    ...(cutaneousMarks ? {marks:cutaneousMarks} : {}),
    ...(healedScars ? {scars:healedScars} : {}),
    ...(cosmeticAppearance ? {makeup:cosmeticAppearance} : {}),
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
  if (!Number.isInteger(data.version) || !Object.hasOwn(renderers,data.version) ||
      (data.version === irisAppearanceVersion && !data.iris) || (data.version === detailsAppearanceVersion && !data.details) ||
      (data.version === browAppearanceVersion && !data.brows) || (data.version === mouthAppearanceVersion && !data.mouth) ||
      (data.version === noseAppearanceVersion && !data.nose) || (data.version === beardAppearanceVersion && !data.facialHair) || (data.version === marksAppearanceVersion && !data.marks) || (data.version === scarAppearanceVersion && !data.scars) || (data.version === makeupAppearanceVersion && !data.makeup)) {
    throw new Error('Version du document d’apparence non prise en charge.');
  }
  if (data.renderer !== renderers[data.version]) throw new Error('Version de rendu non prise en charge.');
  const adultFormat = data.version >= bodyAppearanceVersion;
  const adultBody = adultFormat ? data.character?.body : undefined;
  if (adultFormat && !isAdultBody(adultBody)) {
    throw new Error('Base adulte du document d’apparence inconnue.');
  }
  const hasStructure = data.version === structureAppearanceVersion ||
    (data.version >= corpulenceAppearanceVersion && Object.hasOwn(data.character, 'structure'));
  const structure = hasStructure ? validateStructure(data.character.structure) : undefined;
  const abdominalFormat = data.version === abdominalAppearanceVersion;
  const combinedFormat = data.version >= thoraxDetailsAppearanceVersion;
  const thoraxDetailsFormat = data.version === thoraxDetailsAppearanceVersion ||
    (abdominalFormat && Object.hasOwn(data.character,'thoraxDetails'));
  const chestFormat = (data.version >= previousChestAppearanceVersion && data.version <= chestAppearanceVersion) ||
    (combinedFormat && Object.hasOwn(data.character,'chest'));
  const pectoralFormat = data.version === pectoralAppearanceVersion ||
    (combinedFormat && Object.hasOwn(data.character,'pectorals'));
  const migratedChest = data.version === previousChestAppearanceVersion;
  const hasCorpulence = data.version === corpulenceAppearanceVersion ||
    ((chestFormat || pectoralFormat || combinedFormat) && Object.hasOwn(data.character,'corpulence'));
  const corpulence = hasCorpulence ? validateCorpulence(data.character.corpulence) : undefined;
  if (chestFormat && adultBody !== 'adult-f') throw new Error('Poitrine indisponible pour cette base.');
  if (pectoralFormat && adultBody !== 'adult-h') throw new Error('Pectoraux indisponibles pour cette base.');
  let chest, chestOrigin;
  if (migratedChest) {
    const {divergence,position,...remaining} = data.character.chest ?? {};
    chest=validateChest(remaining);
    chestOrigin=validateChestOrigin({divergence,position});
  } else if (chestFormat) {
    chest=validateChest(data.character.chest);
    chestOrigin=data.character.chestOrigin;
  }
  const pectorals=pectoralFormat ? validatePectorals(data.character.pectorals) : undefined;
  const thoraxDetails=thoraxDetailsFormat ? validateThoraxDetails(data.character.thoraxDetails) : undefined;
  const abdominals=abdominalFormat ? validateAbdominals(data.character.abdominals) : undefined;
  const selection = restoreSelection(data.historicalSelection, adultBody, structure, corpulence, chest, chestOrigin, pectorals, thoraxDetails, abdominals);
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
  if (data.version >= mouthAppearanceVersion && data.mouth) {
    if (!['custom','historical'].includes(data.mouth.mode)) throw new Error('Mode de bouche invalide.');
    settings.mouth = data.mouth.mode === 'custom' ? data.mouth.requested : null;
    settings.mouthLatent = data.mouth.mode === 'historical' ? data.mouth.latent : null;
    settings.mouthDraw = data.mouth.draw;
  }
  if (data.version >= noseAppearanceVersion && data.nose) {
    if (!['custom','historical'].includes(data.nose.mode)) throw new Error('Mode de nez invalide.');
    settings.nose = data.nose.mode === 'custom' ? data.nose.requested : null;
    settings.noseLatent = data.nose.mode === 'historical' ? data.nose.latent : null;
    settings.noseDraw = data.nose.draw;
  }
  if (data.version >= beardAppearanceVersion && data.facialHair) {
    if (!['historical','custom'].includes(data.facialHair.mode)) throw new Error('Mode de pilosité invalide.');
    settings.beard = data.facialHair.mode === 'custom' ? data.facialHair.requested : null;
    settings.beardLatent = data.facialHair.mode === 'historical' ? data.facialHair.latent : null;
    settings.beardDraw = data.facialHair.draw;
    settings.beardCategory = beardCategoryOf(data.facialHair.category);
  }
  if (data.version >= marksAppearanceVersion && data.marks) {
    if (!['historical','custom'].includes(data.marks.mode)) throw new Error('Mode des marques cutanées invalide.');
    settings.marks = data.marks.mode === 'custom' ? data.marks.requested : null;
    settings.marksLatent = data.marks.mode === 'historical' ? data.marks.latent : null;
  }
  if (data.version >= scarAppearanceVersion && data.scars) {
    if (!['historical','custom'].includes(data.scars.mode)) throw new Error('Mode des cicatrices invalide.');
    settings.scars = data.scars.mode === 'custom' ? data.scars.requested : null;
    settings.scarsLatent = data.scars.mode === 'historical' ? data.scars.latent : null;
  }
  if (data.version >= makeupAppearanceVersion && data.makeup) {
    if (!['historical','custom'].includes(data.makeup.mode)) throw new Error('Mode de maquillage invalide.');
    settings.makeup = data.makeup.mode === 'custom' ? data.makeup.requested : null;
    settings.makeupLatent = data.makeup.mode === 'historical' ? data.makeup.latent : null;
  }
  const rebuilt = appearanceDocument(selection, settings);
  const adoptedChest = migratedChest || data.version===chestR01AppearanceVersion;
  if (adoptedChest) {
    rebuilt.version=data.version;
    rebuilt.renderer=renderers[data.version];
  }
  if (migratedChest) {
    Object.assign(rebuilt.character.chest,rebuilt.character.chestOrigin);
    delete rebuilt.character.chestOrigin;
  }
  if (!identical(rebuilt, data)) throw new Error('Données effectives incompatibles avec la sélection et les demandes.');
  // Verify and retain the requests for editing. They replay the archived
  // effective values exactly under this supported renderer version.
  return {selection, ...settings, ...(adoptedChest ? {importedChestVersion:data.version} : {})};
}
