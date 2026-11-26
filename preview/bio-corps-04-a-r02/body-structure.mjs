export const structureControls = Object.freeze({
  neck: Object.freeze({label:'Largeur du cou', min:70, max:130}),
  shoulders: Object.freeze({label:'Largeur des épaules', min:70, max:130}),
  thorax: Object.freeze({label:'Largeur du thorax', min:70, max:130}),
  waist: Object.freeze({label:'Largeur de la taille', min:75, max:125}),
  pelvis: Object.freeze({label:'Largeur du bassin', min:70, max:130}),
  base: Object.freeze({label:'Largeur de la base du pion', min:70, max:130})
});
const axes = Object.entries(structureControls);

export const referenceStructure = Object.freeze(Object.fromEntries(axes.map(([key]) => [key, 100])));

export function validateStructure(values) {
  if (!values || typeof values !== 'object' || Array.isArray(values) || Object.keys(values).length !== axes.length) {
    throw new TypeError('Les six largeurs d’ossature sont requises.');
  }
  for (const [key, {label, min, max}] of axes) {
    if (!Object.hasOwn(values,key) || !Number.isInteger(values[key]) || values[key] < min || values[key] > max) {
      throw new RangeError(`${label} · pourcentage entier entre ${min} et ${max} requis.`);
    }
  }
  return values;
}
