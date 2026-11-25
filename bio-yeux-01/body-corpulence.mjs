export const referenceCorpulence = 50;

export const corpulenceStops = Object.freeze([
  'Très maigre', 'Maigre', 'Mince', 'Légèrement mince', 'Standard',
  'Enrobé', 'Corpulent', 'Obèse', 'Très obèse'
].map((label, index) => Object.freeze({label, value: index * 12.5})));

const shared = {neck:.10, shoulders:.10, thorax:.29, waist:.47, base:.29};
export const corpulenceCoefficients = Object.freeze({
  'adult-h': Object.freeze({...shared, abdomen:.69, hips:.47, pelvis:.40}),
  'adult-f': Object.freeze({...shared, abdomen:.47, hips:.69, pelvis:.50})
});

export function validateCorpulence(value) {
  if (!Number.isFinite(value) || value < 0 || value > 100) {
    throw new RangeError('Un pourcentage de corpulence entre 0 et 100 est requis.');
  }
  return value;
}

export function corpulenceResponse(value) {
  const t = (validateCorpulence(value) - referenceCorpulence) / referenceCorpulence;
  // The response passes through zero with a continuous slope. It reaches
  // -0.56 at 0 and +1 at 100, with a strictly positive slope throughout.
  return .78 * t + .22 * t * t;
}
