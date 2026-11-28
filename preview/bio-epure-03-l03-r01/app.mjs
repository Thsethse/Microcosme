import {visualCases} from './cases.mjs';
import {historicalLevels, middleHistorical, prepareStudy, proposedLevels} from './study.mjs';

const select = document.querySelector('#scenario');
const cropButtons = [...document.querySelectorAll('[data-crop]')];
const number = new Intl.NumberFormat('fr-FR', {maximumFractionDigits: 3});
const percent = value => `${number.format(value)} %`;
let crop = 'close';

for (const scenario of visualCases) select.add(new Option(scenario.label, scenario.id));

function tile(study, level, historical, instance, anchor = false) {
  const height = historical ? level : study.carrier(level);
  const effective = study.solve(height).effective.height;
  const displacement = (effective - study.anchor) * study.frame.travel / 100;
  const position = Math.abs(displacement) < 1e-8 ? 'Au niveau du repère' :
    `${number.format(Math.abs(displacement))} u. SVG plus ${displacement > 0 ? 'haut' : 'bas'}`;
  const label = `${anchor ? (historical ? 'Ancien ' : 'Nouveau ') : ''}${percent(level)}`;
  return `<figure id="${instance}">
    <div class="art" aria-hidden="true">${study.picture(height, crop, instance)}</div>
    <figcaption><strong>${label}</strong><span>${percent(effective)} effectifs, échelle historique</span><span>${position}</span></figcaption>
  </figure>`;
}

function render() {
  const study = prepareStudy(visualCases.find(scenario => scenario.id === select.value));
  document.querySelector('#anchors').innerHTML =
    tile(study, middleHistorical, true, 'anchor-old', true) + tile(study, 50, false, 'anchor-new', true);
  document.querySelector('#historical').innerHTML =
    historicalLevels.map(level => tile(study, level, true, `old-${level}`)).join('');
  document.querySelector('#proposed').innerHTML =
    proposedLevels.map(level => tile(study, level, false, `new-${level}`)).join('');
  const lower = study.descent === 0 ? 'Le 6 % historique atteint la limite basse. Le nouveau 0–50 % forme un plateau.' :
    `Vers le bas, la course depuis le repère est de ${number.format(study.descent)} u. SVG.`;
  document.querySelector('#range').textContent =
    `${lower} Vers le haut, la proposition monte de ${number.format(study.rise)} u. SVG au maximum.`;
}

select.addEventListener('change', render);
for (const button of cropButtons) {
  button.addEventListener('click', () => {
    crop = button.dataset.crop;
    for (const choice of cropButtons) choice.setAttribute('aria-pressed', String(choice === button));
    render();
  });
}
render();
