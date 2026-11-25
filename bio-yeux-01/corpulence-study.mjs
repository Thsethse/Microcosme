import {adultBodies} from './adult-body.mjs';
import {corpulenceStops} from './body-corpulence.mjs';
import {structureCombinations} from './structure-study.mjs';

export const corpulenceStudyStructures = structureCombinations.map(([id, label]) =>
  [id, id === 'reference' ? 'Ossature standard' : label]);
const phases = [['before', 'Avant · BIO-CORPS-03'], ['after', 'Après · R01']];
const percentage = new Intl.NumberFormat('fr-FR');

export function renderCorpulenceStudy(panel, {render, background}) {
  const view = panel.querySelector('#corpulence-study-scale').value;
  const selected = panel.querySelector('#corpulence-study-structure').value;
  const [, , structure] = structureCombinations.find(([id]) => id === selected);
  const container = panel.querySelector('#corpulence-references');
  container.className = `structure-study-grid ${background}`;
  container.innerHTML = corpulenceStops.map(({value, label}) => `
    <article class="card" data-corpulence-example="${value}">
      <h4>${percentage.format(value)} % · ${label}</h4>
      ${Object.entries(adultBodies).map(([body, {name}]) => `
        <section class="corpulence-study-pair" data-corpulence-specimen="${body}">
          <h5>${name}</h5>
          <div class="structure-pair">${phases.map(([phase, caption]) => `
            <figure data-corpulence-phase="${phase}">
              <div class="surface ${view}">${render({key:'shaved:U', body, structure, corpulence:value, view,
                beforeCorpulenceCorrection:phase === 'before'})}</div>
              <figcaption>${caption}</figcaption>
            </figure>`).join('')}</div>
        </section>`).join('')}
    </article>`).join('');
}
