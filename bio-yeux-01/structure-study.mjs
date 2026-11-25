import {adultBodies} from './adult-body.mjs';
import {referenceStructure, structureControls} from './body-structure.mjs';

const axes = Object.entries(structureControls);
const profiles = [['adult-h', 'H'], ['adult-f', 'F']];
const percentages = get => Object.fromEntries(axes.map(([key, range]) => [key, get(key, range)]));

export const structureCombinations = [
  ['reference', 'Référence', referenceStructure],
  ['fine', 'Ossature fine', percentages(key => key === 'waist' ? 85 : 82)],
  ['wide', 'Ossature large', percentages(key => key === 'waist' ? 115 : 118)],
  ['min', 'Tous les minima', percentages((_, range) => range.min)],
  ['max', 'Tous les maxima', percentages((_, range) => range.max)],
  ['upper', 'Haut large, bassin étroit', percentages((key, range) =>
    ['neck','shoulders','thorax'].includes(key) ? range.max : range.min)],
  ['lower', 'Haut étroit, bassin large', percentages((key, range) =>
    ['neck','shoulders','thorax'].includes(key) ? range.min : range.max)]
];

export function renderStructureStudy(panel, {render, background}) {
  const view = panel.querySelector('#structure-study-scale').value;
  const compare = (body, structure, caption) => `<figure data-structure-specimen="${body}">
    <div class="surface ${view}">${render({body, structure, view})}</div><figcaption>${caption}</figcaption>
  </figure>`;

  const compound = panel.querySelector('#structure-combinations');
  compound.className = `structure-study-grid ${background}`;
  compound.innerHTML = structureCombinations.map(([id, label, structure]) => `
    <article class="card" data-structure-combination="${id}">
      <h4>${label}</h4><div class="structure-pair">${profiles.map(([body]) =>
        compare(body, structure, adultBodies[body].name)).join('')}</div>
    </article>`).join('');

  const isolated = panel.querySelector('#structure-extremes');
  isolated.className = `structure-study-grid ${background}`;
  isolated.innerHTML = axes.map(([key,{label,min,max}]) => `
    <article class="card" data-structure-extreme="${key}">
      <h4>${label}</h4><div class="structure-pair">${profiles.flatMap(([body, short]) =>
        [min,max].map(value => compare(body, {...referenceStructure, [key]:value}, `${short} · ${value} %`))).join('')}</div>
    </article>`).join('');
}
