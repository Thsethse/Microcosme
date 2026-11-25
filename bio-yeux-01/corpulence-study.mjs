import {adultBodies} from './adult-body.mjs';
import {corpulenceStops} from './body-corpulence.mjs';
import {structureCombinations} from './structure-study.mjs';

const comparisonValues = {fine:[0, 50, 100], wide:[0, 50, 100], min:[0, 100], max:[0, 100]};
const combinations = structureCombinations.flatMap(([id, label, structure]) =>
  (comparisonValues[id] ?? []).map(value => ({
    id: `${id}-${value}`, value, label: `${label} · ${value} %`, structure
  })));

const references = corpulenceStops.map(({label,value}) => ({
  id: String(value), value, label: `${label} · ${String(value).replace('.', ',')} %`
}));

export function renderCorpulenceStudy(panel, {render, background}) {
  const view = panel.querySelector('#corpulence-study-scale').value;
  const card = ({id, value, label, structure}) => `
    <article class="card" data-corpulence-example="${id}">
      <h4>${label}</h4>
      <div class="structure-pair">${Object.entries(adultBodies).map(([body, {name}]) => `
        <figure data-corpulence-specimen="${body}">
          <div class="surface ${view}">${render({body, structure, corpulence:value, view})}</div>
          <figcaption>${name}</figcaption>
        </figure>`).join('')}</div>
    </article>`;
  for (const [id, examples] of [['corpulence-references',references],['corpulence-combinations',combinations]]) {
    const container = panel.querySelector('#' + id);
    container.className = `structure-study-grid ${background}`;
    container.innerHTML = examples.map(card).join('');
  }
}
