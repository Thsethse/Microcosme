import {seededIndex} from './draw.mjs';

export const makeupPalette = Object.freeze([
  ['Naturelles', ['#e7c5a9', '#c89a7c', '#ae785e', '#85543d', '#684331', '#493026', '#c88e80', '#ad7467']],
  ['Roses et rouges', ['#edb3ba', '#d78399', '#cf526f', '#a52f47', '#79243e', '#a83d30', '#db7452', '#733447']],
  ['Fantaisie', ['#e0b43f', '#dc8437', '#829e4d', '#397e62', '#4d9eab', '#3f649b', '#79549e', '#ac65b2']],
  ['Neutres et contrastes', ['#fff8e9', '#e5e2d9', '#b7b8bd', '#85858e', '#53545e', '#28272d', '#151519', '#b38b4f']]
]);
const pigments = makeupPalette.flatMap(([, colours]) => colours);

const percent = (label, initial) => ({label, initial, min: 0, max: 100, unit: '%'});
const angle = (label, min, max) => ({label, initial: 0, min, max, unit: '°'});
const pigment = (label, initial) => ({label, initial, pigment: true});

export const makeupFamilies = {
  lips: {label: 'Lèvres', fields: {
    colour: pigment('Couleur', '#a52f47'), intensity: percent('Intensité', 66),
    coverage: percent('Couverture', 76), edge: percent('Épaisseur du contour', 0),
    edgeColour: pigment('Couleur du contour', '#79243e')
  }},
  shadow: {label: 'Fard à paupières', fields: {
    colour: pigment('Couleur principale', '#79549e'), accent: pigment('Couleur secondaire', null),
    intensity: percent('Intensité', 57), height: percent('Hauteur', 66),
    extent: percent('Étendue horizontale', 82), outer: percent('Concentration externe', 38)
  }},
  liner: {label: 'Eyeliner', fields: {
    colour: pigment('Couleur', '#151519'), top: percent('Épaisseur supérieure', 43),
    bottom: percent('Épaisseur inférieure', 0), wing: percent('Longueur de la pointe externe', 37),
    slant: angle('Inclinaison de la pointe', -45, 45), intensity: percent('Intensité', 89)
  }},
  blush: {label: 'Fard à joues', fields: {
    colour: pigment('Couleur', '#d78399'), intensity: percent('Intensité', 65),
    x: percent('Position horizontale', 50), y: percent('Position verticale', 35),
    extent: percent('Étendue', 62), diffusion: percent('Diffusion', 72)
  }},
  paint: {label: 'Peintures faciales', fields: {
    x: percent('Position horizontale', 28), y: percent('Position verticale', 62),
    size: percent('Taille', 35), stretch: percent('Allongement', 30),
    rotation: angle('Orientation', -180, 179), weight: percent('Épaisseur', 38),
    colour: pigment('Couleur', '#397e62'), intensity: percent('Intensité', 84)
  }}
};

export const paintShapes = {
  point: 'Point', circle: 'Cercle', ring: 'Anneau', line: 'Ligne', stripe: 'Bande',
  triangle: 'Triangle', diamond: 'Losange', crescent: 'Croissant', arc: 'Arc',
  wave: 'Vague', zigzag: 'Zigzag', star: 'Étoile'
};
const roundShapes = ['circle', 'ring'];
const variableWeight = ['ring', 'line', 'stripe', 'crescent', 'arc', 'wave', 'zigzag'];
export const maxPaintElements = 36;

function fieldsFor(values, fields) {
  return Object.fromEntries(Object.entries(fields).map(([key, field]) => {
    const value = Object.hasOwn(values, key) ? values[key] : field.initial;
    const valid = field.pigment ? pigments.includes(value) || (field.initial === null && value === null) :
      Number.isFinite(value) && value >= field.min && value <= field.max;
    if (!valid) throw new RangeError(field.label + ' hors du domaine du maquillage.');
    return [key, value];
  }));
}

export function normalizeMakeup(value = {}) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new TypeError('Composition de maquillage invalide.');
  const result = {};
  for (const [key, {fields}] of Object.entries(makeupFamilies)) {
    if (key === 'paint') continue;
    const family = value[key] ?? {};
    if (typeof family !== 'object' || Array.isArray(family)) throw new TypeError('Famille de maquillage invalide.');
    result[key] = {enabled: family.enabled === true, ...fieldsFor(family, fields)};
  }
  const paint = value.paint ?? {};
  const elements = paint.elements ?? [];
  if (typeof paint !== 'object' || Array.isArray(paint) || !Array.isArray(elements) || elements.length > maxPaintElements) {
    throw new RangeError('Liste de peintures faciales invalide (36 éléments au maximum).');
  }
  result.paint = {enabled: paint.enabled === true, elements: elements.map((item, index) => {
    const shape = item?.shape;
    if (!Object.hasOwn(paintShapes, shape)) throw new RangeError('Forme de peinture faciale inconnue.');
    return {shape, mirror: item.mirror === true, ...fieldsFor(item, makeupFamilies.paint.fields),
      ...(!Object.hasOwn(item, 'x') ? {x: 24 + (index % 5) * 13} : {})};
  })};
  return result;
}

export function inactiveFields(family, values) {
  if (family === 'lips') return [
    ...(values.intensity === 0 ? ['coverage', 'edge'] : []),
    ...(values.intensity === 0 || values.coverage === 0 ? ['colour'] : []),
    ...(values.intensity === 0 || values.edge === 0 ? ['edgeColour'] : [])
  ];
  if (family === 'shadow') {
    if (values.intensity === 0) return ['colour', 'accent', 'height', 'extent', 'outer'];
    return values.height === 0 || values.extent === 0 ? ['colour', 'accent', 'outer'] : [];
  }
  if (family === 'liner') return [
    ...(values.intensity === 0 ? ['colour', 'top', 'bottom', 'wing'] : []),
    ...(values.intensity === 0 || values.wing === 0 ? ['slant'] : []),
    ...(values.intensity > 0 && values.top === 0 && values.bottom === 0 && values.wing === 0 ? ['colour'] : [])
  ];
  if (family === 'blush') return values.intensity === 0 ? ['colour', 'x', 'y', 'extent', 'diffusion'] : [];
  return [
    ...(values.intensity === 0 ? ['colour', 'x', 'y', 'size'] : []),
    ...(values.intensity === 0 || values.shape === 'point' ? ['stretch'] : []),
    ...(values.intensity === 0 || values.shape === 'point' || roundShapes.includes(values.shape) && values.stretch === 0 ? ['rotation'] : []),
    ...(values.intensity === 0 || !variableWeight.includes(values.shape) ? ['weight'] : [])
  ];
}

export function makeupMirrorUseful(item) {
  if (item.x !== 50) return true;
  const locked = inactiveFields('paint', {...item, intensity: 100}).includes('rotation');
  const symmetric = ['point', 'circle', 'ring', 'triangle', 'diamond', 'arc', 'star', 'stripe', 'line'].includes(item.shape);
  return !symmetric || !locked && item.rotation % 180 !== 0;
}

export function hasMakeup(makeup) {
  return !!makeup && (
    makeup.lips.enabled && makeup.lips.intensity > 0 && (makeup.lips.coverage > 0 || makeup.lips.edge > 0) ||
    makeup.shadow.enabled && makeup.shadow.intensity > 0 && makeup.shadow.height > 0 && makeup.shadow.extent > 0 ||
    makeup.liner.enabled && makeup.liner.intensity > 0 && (makeup.liner.top > 0 || makeup.liner.bottom > 0 || makeup.liner.wing > 0) ||
    makeup.blush.enabled && makeup.blush.intensity > 0 ||
    makeup.paint.enabled && makeup.paint.elements.some(item => item.intensity > 0)
  );
}

const compositionSchema = 'microcosme.makeup';
export function makeupDocument(value) {
  return {schema: compositionSchema, version: 1, makeup: normalizeMakeup(value)};
}

export function parseMakeup(text) {
  const data = JSON.parse(text);
  if (data?.schema !== compositionSchema || data.version !== 1 || !data.makeup) {
    throw new Error('Composition de maquillage version 1 requise.');
  }
  return normalizeMakeup(data.makeup);
}

export function drawMakeup(seed) {
  const choose = seededIndex('bio-maquillage-01-v1\0' + seed);
  const colour = pigments[8 + choose(16)];
  const contrast = pigments[choose(pigments.length)];
  const shapes = Object.keys(paintShapes);
  return normalizeMakeup({
    lips: {enabled: true, colour, intensity: 38 + choose(44), coverage: 53 + choose(42)},
    shadow: {enabled: true, colour, accent: contrast, intensity: 25 + choose(47), height: 18 + choose(65)},
    liner: {enabled: true, top: 16 + choose(58), wing: 16 + choose(57), slant: -25 + choose(51)},
    blush: {enabled: true, colour, intensity: 28 + choose(46), diffusion: 52 + choose(48)},
    paint: {enabled: true, elements: [{
      shape: shapes[choose(shapes.length)], x: 20 + choose(12), y: 59 + choose(11),
      size: 14 + choose(23), rotation: -35 + choose(71), colour: contrast,
      intensity: 47 + choose(44), mirror: choose(2) === 0
    }]}
  });
}
