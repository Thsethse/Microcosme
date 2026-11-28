import {irisDrawVersion} from './iris.mjs';
import {detailsDrawVersion} from './details.mjs';
import {browDrawVersion} from './brows.mjs';
import {noseDrawVersion} from './nose.mjs';
import {mouthDrawVersion} from './mouth.mjs';
import {beardDrawVersion} from './beard.mjs';
import {scarDrawVersion} from './scars.mjs';

const storedBase = 'microcosme.adult-editor.last-body';

export function initialAdultBody() {
  try {
    return localStorage.getItem(storedBase) === 'adult-f' ? 'adult-f' : 'adult-h';
  } catch {
    return 'adult-h';
  }
}

export function saveAdultBody(body) {
  try {
    localStorage.setItem(storedBase, body);
  } catch {
    // The editor also runs in browser contexts with storage disabled.
  }
}

const draws = [
  ['eyes', 'Ouverture des yeux', 'seed', 'random-eyes'],
  ['iris', 'Iris et pupilles', 'iris-seed', 'iris-random'],
  ['details', 'Détails des yeux', 'details-seed', 'details-random'],
  ['brows', 'Sourcils', 'brows-seed', 'brows-random'],
  ['nose', 'Nez', 'nose-seed', 'nose-random'],
  ['mouth', 'Bouche', 'mouth-seed', 'mouth-random'],
  ['beard', 'Pilosité faciale', 'beard-seed', 'beard-random'],
  ['marks', 'Groupes de marques', 'marks-seed', 'marks-redistribute'],
  ['scars', 'Cicatrices', 'scars-seed', 'scars-draw'],
  ['makeup', 'Maquillage', 'makeup-seed', 'makeup-draw']
];

const versions = {
  iris: irisDrawVersion, details: detailsDrawVersion, brows: browDrawVersion, nose: noseDrawVersion,
  mouth: mouthDrawVersion, beard: beardDrawVersion, marks: 'marks-surface-v1', scars: scarDrawVersion,
  makeup: 'bio-maquillage-01-v1'
};

const q = id => document.getElementById(id);

export function mountCommandLayout() {
  document.body.classList.add('editor-commands');
  const creation = q('espace-creation');
  const body = document.createElement('section');
  body.id = 'adult-base';
  body.className = 'card';
  body.innerHTML = `<p id="historical-body-notice" class="hint" hidden>
    Un gabarit historique est chargé. Retrouvez son rendu dans
    <a href="#editor-comparison">Comparaisons au Laboratoire</a> ou choisissez une base adulte pour reprendre la création.
  </p>`;
  body.prepend(q('body').closest('label'));
  creation.querySelector('nav').after(body);
  q('body-note').remove();
  q('body').removeAttribute('aria-describedby');
  for (const button of creation.querySelectorAll('[data-thorax-body], [data-pubic-body]')) {
    const group = button.parentElement;
    button.remove();
    if (!group.childElementCount) group.remove();
  }

  const experiments = q('experiences');
  const lab = document.createElement('details');
  lab.id = 'historical-settings';
  lab.innerHTML = `<summary>Gabarits et références historiques</summary>
    <label>Gabarit historique<select id="historical-body"></select></label>
    <button type="button" id="apply-historical-body">Ouvrir ce gabarit</button>
    <label>Référence de morphologie du visage<select id="historical-morph"></select></label>
    <button type="button" id="apply-historical-morph">Appliquer la référence</button>
    <p id="historical-morph-current" class="hint" role="status"></p>
    <button type="button" id="historical-nose">Appliquer la référence historique « Narines marquées »</button>
    <p id="historical-nose-status" class="hint" role="status"></p>`;
  const baseWidth = q('structure-base').closest('label');
  lab.append(q('beard-category').closest('label'), baseWidth, q('reset-eyes'));
  experiments.append(lab);

  const drawPanel = document.createElement('details');
  drawPanel.id = 'editor-draws';
  drawPanel.innerHTML = `<summary>Tirages et rejeu</summary>
    <label>Module<select id="draw-module"></select></label>
    <p id="draw-module-note" class="hint" role="status"></p>
    <p id="draw-module-version" class="hint"></p>`;
  experiments.prepend(drawPanel);
  const selector = q('draw-module');
  const modules = new Map();
  for (const [key, name, seed, action] of draws) {
    const area = document.createElement('div');
    area.dataset.drawModule = key;
    if (key === 'marks') {
      const button = document.createElement('button');
      button.type = 'button';
      button.id = action;
      button.textContent = 'Redistribuer le groupe';
      area.append(button);
    }
    area.prepend(q(seed).closest('label'));
    if (key !== 'marks') area.append(q(action));
    if (key === 'scars') area.insertAdjacentHTML('beforeend',
      '<button type="button" id="scars-apply-seed">Appliquer la graine seule</button>');
    if (key === 'eyes') area.append(q('draw-version').closest('label'), q('draw-error'));
    drawPanel.append(area);
    modules.set(key, area);
    selector.add(new Option(name, key));
  }
  q('makeup-experiments').remove();
  q('eye-experiments').querySelector('summary').textContent = 'Ajustement manuel des yeux';
  function showDraw() {
    for (const [key, area] of modules) area.hidden = key !== selector.value;
    const version = versions[selector.value];
    q('draw-module-version').textContent = version ? 'Version du rejeu · ' + version : '';
    q('draw-module-version').hidden = !version;
    q('draw-module-note').textContent = selector.value === 'marks'
      ? 'Sélectionnez un groupe de marques dans Création. La graine redistribue ses marques sans changer ses réglages.'
      : selector.value === 'scars' ? 'La graine rejoue la cicatrice sélectionnée ou crée une cicatrice si la liste est vide.' : '';
  }
  selector.addEventListener('change', showDraw);
  showDraw();

  const latent = document.createElement('details');
  latent.id = 'editor-latent';
  latent.innerHTML = `<summary>Valeurs en mémoire et provenance des tirages</summary>
    <p class="hint">Demandes et graines de l’atelier, dont les réglages suspendus et la mémoire de chaque base.</p>
    <pre id="editor-latent-json"></pre>`;
  experiments.append(latent);

  q('morph').closest('label').after(Object.assign(document.createElement('p'), {id: 'morph-reference-note', className: 'hint'}));
}

const conditionalLabels = [
  '#chest-controls input', '#pectoral-controls input', '#abdominal-controls input',
  '#morph-forehead_height', '#arrangement', '#accessories', '#contrast', '#flat-mode',
  '#iris-parameters input', '#iris-parameters select',
  '#details-parameters input', '#brows-parameters input', '#brows-parameters select',
  '#nose-parameters input', '#nose-parameters select', '#mouth-parameters input', '#mouth-parameters select',
  '#beard-parameters input', '#beard-parameters select',
  '#marks-edit input', '#marks-edit select', '#scars-edit input', '#scars-edit select',
  '#makeup-controls input', '#makeup-controls select', '#makeup-reference', '#makeup-mirror',
  '#makeup-paint-shape'
].join(', ');

export function syncConditionalCommands() {
  const creation = q('espace-creation');
  for (const control of creation.querySelectorAll(conditionalLabels)) {
    const label = control.closest('label');
    if (label) label.toggleAttribute('data-inactive-command', control.matches(':disabled'));
  }
  for (const selector of ['#details-parameters details', '#brows-parameters details', '#beard-parameters fieldset']) {
    for (const group of creation.querySelectorAll(selector)) {
      const controls = [...group.querySelectorAll('input, select')];
      group.toggleAttribute('data-inactive-command', controls.length > 0 && controls.every(control => control.matches(':disabled')));
    }
  }
  q('palette-tabs').toggleAttribute('data-inactive-command', q('flat-mode').disabled);
  q('swatches').toggleAttribute('data-inactive-command', q('flat-mode').disabled);
}
