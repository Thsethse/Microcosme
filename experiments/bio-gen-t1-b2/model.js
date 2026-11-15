/* B2 is a graphics experiment, never a canonical organism or gender model. */
(function (root) {
  'use strict';
  const V1 = typeof module !== 'undefined' ? require('./baseline/model.js') : root.BioMorphV1;
  const additions = [
    ['skullShape', 'Rondeur crâne', 0, 1, .6, 'Carré arrondi → ovale ; indépendant de son allongement'],
    ['torsoShape', 'Rondeur torse', 0, 1, .5, 'Transitions rectangulaires/trapézoïdales → ovales'],
    ['pelvisShape', 'Rondeur bassin', 0, 1, .6, 'Contour angulaire → rond sans déplacer les hanches'],
    ['shoulderHip', 'Rapport épaules / bassin', -1, 1, 0, 'Élargit les épaules en réduisant le bassin, ou inversement'],
    ['chest', 'Projection poitrine', 0, 1, .25, 'Volume indépendant ; forme liée aux volumes périphériques et centraux'],
    ['hairTop', 'Longueur dessus', 0, 1, .3, 'Longueur des mèches du dessus, fraction du crâne'],
    ['hairSides', 'Longueur côtés', 0, 1, .25, 'Longueur temporale indépendante'],
    ['hairNape', 'Longueur nuque', 0, 1, .25, 'Longueur occipitale indépendante'],
    ['hairPart', 'Direction / raie', -1, 1, 0, 'Orientation des racines ; pointes retombant par gravité'],
    ['hairPotential', 'Potentiel pileux graphique', 0, 1, .5, 'Plafond facial/corporel ; ne décrit aucune hormone'],
    ['beard', 'Densité faciale', 0, 1, 0, 'Moustache, barbe et favoris sans lien au genre'],
    ['bodyHair', 'Densité corporelle', 0, 1, .2, 'Torse, abdomen, bras, jambes, aisselles et pubis stylisé'],
    ['hairSpread', 'Distribution centrale / diffuse', 0, 1, .5, 'Répartit le même budget de densité entre zones'],
    ['grooming', 'Entretien / longueur tondue', 0, 1, .2, 'Raccourcit les poils visibles sans changer le potentiel']
  ].map(([key, label, min, max, initial, effect]) => Object.freeze({key, label, min, max, initial, effect, step: .01}));
  const schema = [...V1.schema, ...additions];
  function validate(input) {
    if (input?.version === 1) {
      const old = V1.validate(input), params = {...old.params};
      for (const s of additions) params[s.key] = s.initial;
      return {version: 2, seed: old.seed, params};
    }
    if (!input || input.version !== 2 || typeof input.seed !== 'string' || input.seed.length > 128 || !input.params) throw Error('Description v1/v2 et graine texte (128 caractères maximum) requises.');
    const params = {};
    for (const s of schema) {
      const v = input.params[s.key];
      if (typeof v !== 'number' || !Number.isFinite(v) || v < s.min || v > s.max) throw Error('Paramètre invalide : ' + s.key);
      params[s.key] = v;
    }
    return {version: 2, seed: input.seed, params};
  }
  function baseline(input) { const d = validate(input); return V1.validate({version: 1, seed: d.seed, params: d.params}); }
  function hash(seed, i) {
    let h = 2166136261;
    for (const c of seed + ':' + i) h = Math.imul(h ^ c.charCodeAt(0), 16777619) >>> 0;
    h ^= h >>> 16; h = Math.imul(h, 0x45d9f3b); h ^= h >>> 16;
    return (h >>> 0) / 4294967296;
  }
  function generate(seed) {
    const d = validate(V1.generate(String(seed)));
    additions.forEach((s, i) => d.params[s.key] = Math.round((s.min + hash(d.seed, i) * (s.max - s.min)) * 100) / 100);
    return validate(d);
  }
  // Continuous contours: same mathematical grammar for skull, trunk, pelvis and limbs.
  const lerp = (a, b, t) => a + (b - a) * t;
  function contour(t, roundness) {
    const square = Math.pow(Math.max(0, 1 - Math.pow(Math.abs(2 * t - 1), 6)), 1 / 6);
    const oval = Math.sqrt(Math.max(0, 1 - Math.pow(2 * t - 1, 2)));
    return lerp(square, oval, roundness);
  }
  function derive(input) {
    const d = validate(input), p = d.params, old = V1.derive(baseline(d));
    const height = 92 * p.height, headH = 18 * p.faceRatio, bodyH = height - headH;
    const legs = bodyH * p.legRatio, trunk = bodyH - legs;
    const geometry = {
      height, headH, headW: 18 / p.faceRatio, jaw: 8 + 7 * p.jaw,
      shoulders: (24 + 5 * p.muscle) * p.width * (1 + .18 * p.shoulderHip),
      hips: (20 + 9 * p.reserves) * p.width * (1 - .18 * p.shoulderHip),
      waist: (15 + 12 * p.reserves) * p.width,
      armWidth: 5 + 3 * p.muscle, legWidth: 6 + 3 * p.muscle + 2 * p.reserves,
      legs, trunk, armLength: trunk * .97, hand: 3.5 + p.muscle, foot: 6 + p.width,
      chestDepth: p.chest * (4 + 2 * p.reserves),
      limbRoundness: .35 + .5 * p.reserves - .2 * p.muscle
    };
    const zones = {
      face: p.hairPotential * p.beard,
      torso: p.hairPotential * p.bodyHair * (1 - .5 * p.hairSpread),
      abdomen: p.hairPotential * p.bodyHair * (1 - .35 * p.hairSpread),
      arms: p.hairPotential * p.bodyHair * (.2 + .8 * p.hairSpread),
      legs: p.hairPotential * p.bodyHair * (.4 + .6 * p.hairSpread),
      axilla: p.hairPotential * p.bodyHair * (.65 + .35 * p.hairSpread),
      pubic: p.hairPotential * p.bodyHair * (1 - .25 * p.hairSpread)
    };
    return {description: d, geometry, palette: old.palette, zones,
      hair: {top: p.hairTop, sides: p.hairSides, nape: p.hairNape, direction: p.hairPart,
        volume: p.density * (.12 + .22 * p.hairTop + .12 * p.texture),
        taper: Math.max(0, p.hairTop - p.hairSides), visibleLength: 1 - .8 * p.grooming},
      marks: Array.from({length: 160}, (_, i) => [hash(d.seed, 100 + 2 * i), hash(d.seed, 101 + 2 * i)])};
  }
  const examples = [
    ['Coupe courte dégradée', {hairTop: .18, hairSides: .02, hairNape: .04, hairPart: .4, texture: .1, density: .9}],
    ['Carré avec raie', {hairTop: .65, hairSides: .6, hairNape: .6, hairPart: -.6, texture: .1, density: .9}],
    ['Boucles et nuque longue', {hairTop: .7, hairSides: .5, hairNape: 1, hairPart: .2, texture: .95, density: .9}],
    ['Volume central, épaules étroites', {shoulderHip: -1, chest: .9, reserves: .8, muscle: .2, torsoShape: .9, pelvisShape: 1}],
    ['Épaules larges, contours angulaires', {shoulderHip: 1, chest: .1, reserves: .2, muscle: .9, torsoShape: .05, pelvisShape: .1}],
    ['Combinaison intermédiaire', {shoulderHip: 0, chest: .35, reserves: .4, muscle: .4, jaw: .5, beard: .25}],
    ['Pilosité diffuse, visage rasé', {hairPotential: 1, beard: 0, bodyHair: 1, hairSpread: 1, grooming: .1}],
    ['Barbe et moustache, corps peu pileux', {hairPotential: 1, beard: 1, bodyHair: .05, grooming: .1}]
  ].map(([label, params]) => ({label, params}));
  const api = {schema, additions, validate, generate, derive, baseline, contour, examples,
    serialize: d => JSON.stringify(validate(d), null, 2), parse: s => validate(JSON.parse(s))};
  if (typeof module !== 'undefined') module.exports = api;
  root.BioMorphB2 = api;
})(globalThis);
