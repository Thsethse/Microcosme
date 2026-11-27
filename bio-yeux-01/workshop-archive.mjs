import {appearanceDocument, appearanceSchema, identical, parseAppearance, pelvicAppearanceVersion} from './appearance.mjs';
import {isAdultBody} from './adult-body.mjs';
import {adultSettings, restoreAdultSettings} from './adult-settings.mjs';
import {r02RenderVersion, workshopRenderVersion} from './render-profile.mjs';

export const workshopSchema = 'microcosme.workshop';
export const workshopVersion = 1;

function validateInactiveBodies(data, selection) {
  if (!data || typeof data !== 'object' || Array.isArray(data)) {
    throw new Error('Préférences des bases inactives invalides.');
  }
  for (const [body, settings] of Object.entries(data)) {
    if (!isAdultBody(body) || body === selection.state.body || !settings ||
        typeof settings !== 'object' || Array.isArray(settings)) {
      throw new Error('Préférences de base inactive invalides.');
    }
    const restored = restoreAdultSettings(selection.raw, body, settings);
    if (!identical(adultSettings(restored.state), settings)) {
      throw new Error('Réglages de la base inactive incompatibles.');
    }
  }
}

export function workshopDocument(selection, settings, preferences, naturalEyes, historicalSource) {
  const inactiveBodies = Object.fromEntries([...preferences].filter(([body]) => body !== selection.state.body));
  validateInactiveBodies(inactiveBodies, selection);
  return {
    schema: workshopSchema,
    version: workshopVersion,
    renderProfile: naturalEyes ? r02RenderVersion : workshopRenderVersion,
    active: appearanceDocument(selection, settings),
    inactiveBodies: structuredClone(inactiveBodies),
    ...(historicalSource ? {historicalSource: structuredClone(historicalSource)} : {})
  };
}

export function parseWorkshop(text) {
  const data = JSON.parse(text);
  if (data?.schema === appearanceSchema) {
    const restored = parseAppearance(text);
    return {...restored, inactiveBodies: {}, legacy: true,
      ambiguousRender: data.version === pelvicAppearanceVersion,
      ...(restored.importedNavel || restored.importedThorax ? {historicalSource: data} : {})};
  }
  if (data?.schema !== workshopSchema || data.version !== workshopVersion) {
    throw new Error('Format d’archive atelier non pris en charge.');
  }
  if (![r02RenderVersion, workshopRenderVersion].includes(data.renderProfile)) {
    throw new Error('Profil graphique de l’archive atelier inconnu.');
  }
  const fields = ['schema', 'version', 'renderProfile', 'active', 'inactiveBodies'];
  if (fields.some(field => !Object.hasOwn(data, field)) ||
      Object.keys(data).some(field => field !== 'historicalSource' && !fields.includes(field))) {
    throw new Error('Champs de l’archive atelier incompatibles.');
  }
  if (Object.hasOwn(data, 'historicalSource')) {
    const historical = parseAppearance(JSON.stringify(data.historicalSource));
    if (!historical.importedNavel && !historical.importedThorax) {
      throw new Error('Source historique inattendue dans l’archive atelier.');
    }
  }
  const active = parseAppearance(JSON.stringify(data.active));
  validateInactiveBodies(data.inactiveBodies, active.selection);
  return {...active, inactiveBodies: data.inactiveBodies, renderProfile: data.renderProfile, historicalSource: data.historicalSource};
}
