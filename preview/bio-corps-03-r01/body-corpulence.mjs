export const referenceCorpulence = 50;

export const corpulenceStops = Object.freeze([
  'Très maigre', 'Maigre', 'Mince', 'Légèrement mince', 'Standard',
  'Enrobé', 'Corpulent', 'Obèse', 'Très obèse'
].map((label, index) => Object.freeze({label, value: index * 12.5})));

const shared = {neck:.10, shoulders:.10, thorax:.29, waist:.47, base:.29};
const previousCoefficients = {
  'adult-h': {...shared, abdomen:.69, hips:.47, pelvis:.40},
  'adult-f': {...shared, abdomen:.47, hips:.69, pelvis:.50}
};

// Half-widths from the neck down to the lower flank. The full envelopes have
// a broad maximum across the middle, with a slightly lower peak on base F.
const envelopes = {
  'adult-h': {slim:[7.8,30.5,24,21.2,20.8,20.1,19.8,18.6], full:[14,56,61,68,70,67,62,42]},
  'adult-f': {slim:[7,24,19,16.6,18,21.5,20.5,19.5], full:[12.7,44.5,53,63.2,67,68,64,45]}
};

export function validateCorpulence(value) {
  if (!Number.isFinite(value) || value < 0 || value > 100) {
    throw new RangeError('Un pourcentage de corpulence entre 0 et 100 est requis.');
  }
  return value;
}

export function previousCorpulence(key, value, widths, regions) {
  const t = (validateCorpulence(value) - referenceCorpulence) / referenceCorpulence;
  const coefficients = previousCoefficients[key];
  return {weight:.78 * t + .22 * t * t, widths:widths.map((width, i) => width * coefficients[regions[i]])};
}

export function corpulenceEnvelope(key, value, scales, regions) {
  const t = (validateCorpulence(value) - referenceCorpulence) / referenceCorpulence;
  const {neck, shoulders, thorax, waist, pelvis, base} = scales;
  const trunk = (shoulders + thorax + waist + pelvis) / 400;
  const profile = envelopes[key];
  if (t < 0) {
    const weight = -t * (1.24 + .24 * t);
    const widths = profile.slim.map((width, i) => width * (.55 * scales[regions[i]] / 100 + .45 * trunk));
    return {weight, widths};
  }
  const weight = t * (1.50 - .50 * t);
  const widths = profile.full.map((width, i) => {
    const region = regions[i];
    if (region === 'neck') return width * (1 + .55 * (neck / 100 - 1));
    if (region === 'base') return width * (1 + .42 * (base / 100 - 1));
    return width * (1 + .32 * (trunk - 1));
  });
  return {weight, widths};
}
