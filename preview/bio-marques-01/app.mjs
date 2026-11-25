import {palette, swatch} from '../bio-col-01/palette.mjs';
import {choices, ordinaryChoices, choice, restoreSelection, selectOrdinary, exportSelection} from './catalogue.mjs';
import {controls, bodies, model, presets} from '../bio-vis-p5-i6/model.mjs';
import {priorityCase} from '../bio-vis-p5-i6/i5/i4/i3/i2/i1/base/r1/coverage.mjs';
import {character} from './render.mjs';
import {appearanceDocument, characterInput, parseAppearance} from './appearance.mjs';
import {currentDraw, drawEyes, legacyDraw} from './draw.mjs';
import {eyeChanges, eyeDomains, eyeProposal} from './eye-domain.mjs';
import {availableOptions} from './availability.mjs';
import {mountIrisEditor} from './iris-editor.mjs';
import {mountDetailsEditor} from './details-editor.mjs';
import {mountBrowsEditor} from './brows-editor.mjs';
import {mountMouthEditor} from './mouth-editor.mjs';
import {mountNoseEditor} from './nose-editor.mjs';
import {mountBeardEditor} from './beard-editor.mjs';
import {mountMarksEditor} from './marks-editor.mjs';
import {mountFreckleStudy} from './marks-study.mjs';
import {eyeControls, eyePresets, eyesFor, normalizeEyes} from './eyes.mjs';

const q = selector => document.querySelector(selector);
const format = new Intl.NumberFormat('fr-FR', {maximumFractionDigits: 2});
const escape = value => String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('"', '&quot;');
const neutral = normalizeEyes({});
const eyeEntries = Object.entries(eyePresets);
const otherLabels = {historical: 'Historique', minimum: 'Extrême minimum', maximum: 'Extrême maximum', custom: 'Personnalisé'};
const axes = Object.keys(controls);
const extrema = property => Object.fromEntries(Object.entries(eyeControls).map(([key, range]) => [key, range[property]]));
const morphs = {
  neutral: {name: 'Neutre', values: {}},
  ipad: {name: 'Cas iPad combiné', values: Object.fromEntries(axes.map(key => [key, priorityCase[key]]))},
  tall: presets.tall,
  broad: presets.broad,
  min: {name: 'Tous les minima', values: Object.fromEntries(axes.map(key => [key, controls[key].min]))},
  max: {name: 'Tous les maxima', values: Object.fromEntries(axes.map(key => [key, controls[key].max]))}
};
const variety = ['p5-038:G','p5-048:G','curls:U','waist_waves:U','braids:U','p5-041:G','p5-056:D','p5-061:D',
  'p5-071:G','p5-029:G','p5-034:G','p5-051:G','p5-058:G','p5-068:G','p5-024:D','p5-058:D'];
let selection = restoreSelection({style: 'p5-038', arrangement: 'G', body: 'standard', accessories: true, contrast: true});
let eyes = null, selectedForm = 'historical', colour = 'chatain-clair', category = 'natural';
let serial = 0, draw = null, morphForm = 'neutral';
let pending = null, editingValues, eyePoints = {}, available = {};
const fullPrecision = new Intl.NumberFormat('fr-FR', {maximumFractionDigits: 16});

function options(selector, entries) {
  for (const [value, text] of entries) q(selector).add(new Option(text, value));
}

function sliders(selector, entries, step, changed, type) {
  for (const [key, range] of entries) {
    const label = document.createElement('label');
    label.className = 'slider';
    label.innerHTML = `<span>${range.label}<output for="${type}-${key}"></output></span><input id="${type}-${key}" type="range" min="${range.min}" max="${range.max}" step="${step}" aria-label="${escape(range.label)}">`;
    const slider = label.querySelector('input');
    if (type === 'eye') {
      const hint = document.createElement('small');
      hint.id = 'eye-domain-' + key;
      hint.className = 'eye-domain';
      label.append(hint);
      slider.setAttribute('aria-describedby', hint.id);
    }
    slider.addEventListener('input', event => changed(key, event.target.valueAsNumber));
    q(selector).append(label);
  }
}

function inputFor(key) {
  return characterInput(selection, key);
}

const frames = {head: '-30 -65 220 225', tile: '-40 -85 240 355', mini: '-35 -68 230 245'};
function svg({key, view = 'head', value = eyes, frame = frames[view], guides = false, hair = activeColour(), decorative = false, pigment = null, details = null, brows = null, mouth = null, nose = null, beard = null, beardCategory, marks = null} = {}) {
  const result = character(inputFor(key), {
    eyes: value, iris:pigment, details, brows, mouth, nose, beard, beardCategory, marks, eyeEnvelopes: guides, hairColor: hair, rememberedHairColor: colour, headOnly: view !== 'tile',
    smallScale: view === 'mini', instance: 'atelier-yeux-' + (++serial)
  }).replace(/viewBox="[^"]*"/, `viewBox="${frame}"`);
  return decorative ? result.replace('<svg ', '<svg aria-hidden="true" focusable="false" ') : result;
}

function activeColour() {
  return q('#flat-mode').checked ? colour : 'historical';
}

function displayValue(key, value) {
  return format.format(value) + (eyeControls[key].unit === '°' ? '°' : ' %');
}

function clearProposal() {
  pending = null;
  q('#eye-proposal').hidden = true;
}

function showProposal(changes, apply, reason, trigger) {
  pending = {apply, trigger};
  q('#eye-proposal').hidden = false;
  q('#eye-proposal-status').textContent = reason;
  q('#eye-proposal-values').replaceChildren(...changes.map(({key, before, after}) => {
    const item = document.createElement('li');
    const unit = eyeControls[key].unit === '°' ? '°' : ' %';
    item.textContent = `${eyeControls[key].label} · ${fullPrecision.format(before)} → ${fullPrecision.format(after)}${unit}`;
    return item;
  }));
  q('#eye-confirm').focus({preventScroll: true});
  q('#eye-proposal').scrollIntoView({block: 'nearest'});
}

function setEyes(form, value, origin = null) {
  clearProposal();
  draw = origin;
  selectedForm = form;
  eyes = value;
  renderEyes();
}

function requestEyes(form, value, trigger, origin = null) {
  const face = eyesFor(inputFor(), null).face;
  const proposal = eyeProposal(face, value);
  const apply = () => setEyes(form, value, origin);
  if (!proposal.changes.length) {
    apply();
    return;
  }
  q('#eye-preset').value = selectedForm;
  showProposal(proposal.changes, apply,
    'La demande dépasse les limites du visage. Voici les écarts entre valeurs demandées et proposées.', trigger);
}

function intervalText(intervals, key) {
  return intervals.map(([min, max]) => min === max ? displayValue(key, min) :
    `${format.format(min)} à ${displayValue(key, max)}`).join(' ou ');
}

function renderEyes() {
  q('#eye-preset').value = selectedForm;
  const result = eyesFor(inputFor(), eyes);
  editingValues = result.effective ?? eyeProposal(result.face, neutral).effective;
  const domains = eyeDomains(result.face, editingValues);
  if (!q('#eye-request-panel').open) syncRequest();
  for (const [key, range] of Object.entries(eyeControls)) {
    const {intervals, points} = domains[key];
    const current = editingValues[key];
    const slider = q('#eye-' + key);
    // Range indices skip holes. Keep the exact currently applied value as
    // a selectable point, without rounding it to a potentially invalid integer.
    eyePoints[key] = points.includes(current) ? points : [...points, current].sort((a, b) => a - b);
    slider.min = 0;
    slider.max = eyePoints[key].length - 1;
    slider.value = eyePoints[key].indexOf(current);
    slider.disabled = eyePoints[key].length <= 1;
    q('#eye-domain-' + key).textContent = !intervals.length ? 'Aucun pas entier direct · ajustement conjoint possible.' :
      `Admissible en direct · ${intervalText(intervals, key)}${slider.disabled ? ' · valeur unique' : ''}`;

    const shown = key === 'taper' && current === range.min ? 'Arrondi' :
      key === 'taper' && current === range.max ? 'Pointu' : displayValue(key, current);
    const adjusted = result.corrected.includes(key);
    const requested = adjusted ? displayValue(key, result.requested[key]) : null;
    slider.setAttribute('aria-valuetext', adjusted ? `${requested} demandé, ${shown} effectif` : shown);
    q(`output[for="eye-${key}"]`).textContent = adjusted ? `${requested} → ${shown}` : shown;
  }
  const status = q('#eye-status');
  const text = !eyes ? 'Rendu historique actif. Déplacer un curseur démarre une forme personnalisée.' :
    result.corrected.length ? 'Les valeurs à droite sont les valeurs appliquées.' : 'Toutes les valeurs demandées sont appliquées.';
  if (status.textContent !== text) status.textContent = text;
  for (const button of document.querySelectorAll('[data-eye-form]')) {
    button.setAttribute('aria-pressed', String(button.dataset.eyeForm === selectedForm));
  }
  irisEditor.refresh();
  detailsEditor.refresh();
  browsEditor.refresh();
  noseEditor.refresh();
  mouthEditor.refresh();
  renderComparison();
}


function renderComparison() {
  const guides = q('#eye-guides').checked;
  const comparison = q('#comparison');
  comparison.dataset.eyes = selectedForm;
  comparison.className = 'comparison ' + q('#background').value;
  q('#guide-note').hidden = !guides;
  const pigment=irisEditor.value();
  const details = detailsEditor.value();
  const brows = browsEditor.value();
  const mouth = mouthEditor.value();
  const nose = noseEditor.value();
  beardEditor.refresh();
  const beard=beardEditor.value(), beardCategory=beardEditor.category();
  marksEditor.refresh();
  const marks=marksEditor.value();
  const compareMarks=!!marks && q('#marks-before-mode').value==='same';
  q('#marks-before-wrap').hidden=!marks;
  q('#beard-before-wrap').hidden=!beard||!!marks;
  const compareBeard=!marks && !!beard && q('#beard-before-mode').value==='same';
  q('#nose-before-wrap').hidden=!nose || !!beard || !!marks;
  const compareNose = !marks && !beard && !!nose && q('#nose-before-mode').value === 'same';
  const compareMouth = !marks && !beard && !nose && !!mouth && q('#mouth-before-mode').value === 'same';
  const compareBrows = !marks && !beard && !nose && !mouth && !!brows && q('#brows-before-mode').value === 'same';
  const compareDetails = !marks && !beard && !nose && !mouth && !brows && !!details && q('#details-before-mode').value === 'same';
  const sameOpening = !marks && !beard && !nose && !mouth && !brows && !details && !!pigment && q('#iris-before-mode').value === 'same';
  q('#mouth-before-wrap').hidden = !mouth || !!nose || !!beard || !!marks;
  q('#brows-before-wrap').hidden = !brows || !!mouth || !!nose || !!beard || !!marks;
  q('#details-before-wrap').hidden = !details || !!brows || !!mouth || !!nose || !!beard || !!marks;
  q('#iris-before-mode').parentElement.hidden = !!details || !!brows || !!mouth || !!nose || !!beard || !!marks;
  const sizes = settings => [['head', 'Tête · 300 px'], ['tile', 'Corps · 178 px'], ['mini', 'Miniature · 70 × 70 px']]
    .map(([view, caption]) => `<figure><div class="surface ${view}">${svg({view, guides, ...settings})}</div><figcaption>${caption}</figcaption></figure>`).join('');
  const title = marks ? 'Marques cutanées' : beard ? 'Pilosité personnalisée' : nose ? 'Nez personnalisé' : mouth ? 'Bouche personnalisée' : brows ? 'Sourcils personnalisés' :
    details ? 'Détails personnalisés' : pigment ? 'Iris personnalisés' : eyePresets[selectedForm]?.label ?? otherLabels[selectedForm];
  const before = compareMarks ? 'Visage actuel sans marques' : compareBeard ? 'Visage actuel, imberbe' : compareNose ? 'Nez historique' : compareMouth ? 'Bouche historique' : compareBrows ? 'Sourcils historiques' :
    compareDetails ? 'Contours historiques' : sameOpening ? 'Pigments historiques' : 'Historique';
  const comparisonReference = {
    value:compareMarks||compareBeard||compareNose||compareMouth||compareBrows||compareDetails||sameOpening?eyes:null,
    pigment:compareMarks||compareBeard||compareNose||compareMouth||compareBrows||compareDetails?pigment:null,
    details:compareMarks||compareBeard||compareNose||compareMouth||compareBrows?details:null,
    brows:compareMarks||compareBeard||compareNose||compareMouth?brows:null,
    mouth:compareMarks||compareBeard||compareNose?mouth:null,
    nose:compareMarks||compareBeard?nose:null,
    beard:compareMarks?beard:null,
    beardCategory
  };
  comparison.innerHTML = `<article data-side="before"><h3>${before}</h3>${sizes(comparisonReference)}</article><article data-side="after"><h3>${title}</h3>${sizes({value:eyes,pigment,details,brows,mouth,nose,beard,beardCategory,marks})}</article>`;

  const {envelopes:[left,right],maxWidth,reference}=eyesFor(inputFor(),null).face;
  const x=left.x-maxWidth/2-2, width=right.x+maxWidth/2+2-x;
  const zoom=q('#iris-zoom');
  zoom.className='surface '+q('#background').value;
  zoom.innerHTML=svg({frame:`${x} ${left.y-8} ${width} 16`,pigment});
  const detailZoom=q('#details-zoom');
  detailZoom.className='surface '+q('#background').value;
  const top=Math.min(left.top,right.top)-1.5, bottom=Math.max(left.bottom,right.bottom)+.7;
  const pad=Math.max(maxWidth,reference.width)*.65+2.35;
  detailZoom.innerHTML=svg({frame:`${left.x-pad} ${top} ${right.x-left.x+2*pad} ${bottom-top}`,pigment,details});
  const browZoom=q('#brows-zoom');
  browZoom.className='surface '+q('#background').value;
  const browTop=left.y-reference.height*2.18, browBottom=left.y+reference.height*.36;
  browZoom.innerHTML=svg({frame:`${left.x-pad} ${browTop} ${right.x-left.x+2*pad} ${browBottom-browTop}`,pigment,details,brows});
  const mouthZoom=q('#mouth-zoom');
  mouthZoom.className='surface '+q('#background').value;
  const {base:{head,anchors},anchors:{chin}}=model(inputFor());
  const mouthTop=anchors.nose[1]-head.ry*.16, mouthBottom=chin[1]+2.5, mouthPad=head.rx*.68;
  mouthZoom.innerHTML=svg({frame:`${anchors.mouth[0]-mouthPad} ${mouthTop} ${mouthPad*2} ${mouthBottom-mouthTop}`,
    pigment,details,brows,mouth,nose});
  const noseZoom=q('#nose-zoom');
  noseZoom.className='surface '+q('#background').value;
  const noseTop=anchors.nose[1]-head.ry*.36, noseBottom=anchors.mouth[1]+head.ry*.16;
  noseZoom.innerHTML=svg({frame:`${anchors.nose[0]-mouthPad} ${noseTop} ${mouthPad*2} ${noseBottom-noseTop}`,
    pigment,details,brows,mouth,nose});
  const beardZoom=q('#beard-zoom');
  beardZoom.className='surface '+q('#background').value;
  const beardTop=head.cy-head.ry*.27, beardBottom=chin[1]+head.ry*.52, beardHalf=head.rx*1.25;
  beardZoom.innerHTML=svg({frame:`${head.cx-beardHalf} ${beardTop} ${beardHalf*2} ${beardBottom-beardTop}`,
    pigment,details,brows,mouth,nose,beard,beardCategory});
  const markZoom=q('#marks-zoom');
  markZoom.classList.toggle('dark',q('#background').value==='dark');
  markZoom.classList.toggle('light',q('#background').value==='light');
  const markHalf=head.rx*1.29, markTop=head.cy-head.ry*1.03;
  markZoom.innerHTML=svg({frame:`${head.cx-markHalf} ${markTop} ${markHalf*2} ${head.ry*2.17}`,
    pigment,details,brows,mouth,nose,beard,beardCategory,marks});
}

function renderChart() {
  const {envelopes: [left, right], maxWidth} = eyesFor(inputFor(), null).face;
  const x = left.x - maxWidth / 2 - 3;
  const width = right.x + maxWidth / 2 + 3 - x;
  const frame = `${x} ${left.y - 13} ${width} 26`;
  const cards = [
    ['historical', otherLabels.historical, null],
    ...eyeEntries.map(([id, preset]) => [id, preset.label, preset.values]),
    ['minimum', otherLabels.minimum, extrema('min')],
    ['maximum', otherLabels.maximum, extrema('max')]
  ];
  q('#shape-grid').innerHTML = cards.map(([id, label, value]) =>
    `<button data-eye-form="${id}" type="button" aria-pressed="${id === selectedForm}">${svg({value, frame, decorative: true})}<span class="caption">${label}</span></button>`).join('');
}

function syncSelection(updateJSON = true) {
  const entry = choice(selection.key);
  q('#ordinary').value = selection.visibleKey;
  q('#historical').value = selection.key;
  const arrangements = entry.arrangement === 'U' ? [new Option('Unique', 'U')] : [new Option('G'), new Option('D')];
  q('#arrangement').replaceChildren(...arrangements);
  q('#arrangement').value = entry.arrangement;
  const ordinary = selection.visibleKey === selection.key ? '' : ` · Entrée ordinaire ${choice(selection.visibleKey).label}`;
  q('#identity-note').textContent = `Identifiant ouvert · ${entry.label} · ${entry.name}${ordinary}`;
  q('#body').value = selection.state.body;
  q('#morph').value = morphForm;
  for (const key of ['accessories', 'contrast']) q('#' + key).checked = selection.raw[key] !== false;
  for (const key of axes) {
    q('#morph-' + key).value = selection.state[key];
    q(`output[for="morph-${key}"]`).textContent = format.format(selection.state[key]);
  }
  if (updateJSON) q('#selection-json').value = exportSelection(selection);
}

function refreshAvailability() {
  available = availableOptions(inputFor(), activeColour());
  for (const key of ['accessories', 'contrast', 'arrangement']) {
    q('#' + key).disabled = !available[key];
    q('#' + key + '-note').hidden = available[key];
  }
  q('#morph-forehead_height').disabled = !available.forehead;
  q('#forehead-note').hidden = available.forehead;
  q('#flat-mode').disabled = !available.palette;
  q('#palette-note').hidden = available.palette;
  for (const tab of document.querySelectorAll('[data-category]')) tab.disabled = !available.palette;
  renderSwatches();
}

function refreshCharacter() {
  syncSelection();
  refreshAvailability();
  renderEyes();
  renderChart();
  renderPaletteStudies();
}

function setSelection(raw, form = morphForm, trigger = document.activeElement, onApply) {
  const next = restoreSelection(raw);
  const apply = () => {
    clearProposal();
    selection = next;
    morphForm = form;
    q('#selection-error').textContent = '';
    refreshCharacter();
    onApply?.();
  };
  const before = eyesFor(inputFor(), eyes).effective;
  const after = eyesFor(characterInput(next), eyes).effective;
  const changes = eyeChanges(before, after);
  if (!changes.length) {
    apply();
    return true;
  }
  syncSelection(false);
  showProposal(changes, apply,
    'Cette sélection change les valeurs effectives des yeux. Comparez les valeurs actuelles et proposées avant application.', trigger);
  return false;
}


function renderSwatches() {
  q('#swatches').innerHTML = palette.filter(p => p.category === category).map(p =>
    `<button type="button" data-colour="${p.id}" ${available.palette === false ? 'disabled' : ''} aria-pressed="${p.id === colour}" style="--fill:${p.fill};--stroke:${p.stroke}"><span class="chip" aria-hidden="true"></span>${p.name}</button>`).join('');
  for (const tab of document.querySelectorAll('[data-category]')) tab.setAttribute('aria-pressed', String(tab.dataset.category === category));
  const p = swatch(colour);
  q('#colour-info').textContent = `${p.name} · Aplat ${p.fill} · Contour ${p.stroke}`;
}

function chooseColour(id) {
  if (!available.palette) return;
  colour = id;
  category = swatch(id).category;
  q('#flat-mode').checked = true;
  refreshAvailability();
  browsEditor.refresh();
  renderComparison();
  renderChart();
  renderPaletteStudies();
}

function surface(view, settings, background = q('#background').value) {
  return `<div class="surface ${view} ${background}">${svg({view, value: null, ...settings})}</div>`;
}

function renderPaletteStudies() {
  if (q('#series-panel').open) {
    q('#series-grid').innerHTML = palette.map(p => {
      const settings = {hair: p.id};
      return `<article class="card"><h3>${p.name}</h3><p class="hint">${p.fill} · ${p.stroke}</p>${surface('tile', settings)}<div class="twins">${surface('mini', settings, 'light')}${surface('mini', settings, 'dark')}</div><button type="button" data-pick="${p.id}" ${available.palette ? '' : 'disabled'}>Choisir ${p.name}</button></article>`;
    }).join('');
  }
  if (q('#variety-panel').open) {
    q('#variety-grid').innerHTML = variety.map(key => {
      const entry = choice(key);
      return `<article class="card"><h3>${entry.label}</h3><p class="hint">${escape(entry.name)}</p>${surface('tile', {key})}${surface('mini', {key})}<button type="button" data-key="${key}">Inspecter ${entry.label}</button></article>`;
    }).join('');
  }
}

options('#eye-preset', [['historical', otherLabels.historical], ...eyeEntries.map(([key, p]) => [key, p.label]),
  ...['minimum', 'maximum', 'custom'].map(key => [key, otherLabels[key]])]);
q('#eye-preset option[value=custom]').disabled = true;
options('#morph', [...Object.entries(morphs).map(([key, p]) => [key, p.name]), ['custom', 'Combinaison libre']]);
q('#morph option[value=custom]').disabled = true;
options('#ordinary', ordinaryChoices.map(e => [e.key, e.label + ' · ' + e.name]));
options('#historical', choices.map(e => [e.key, e.label + ' · ' + e.name]));
options('#body', Object.entries(bodies).map(([key, body]) => [key, body.name]));

sliders('#eye-controls', Object.entries(eyeControls), '1', (key, index) => {
  const value = eyePoints[key]?.[index];
  if (value !== undefined) setEyes('custom', {...editingValues, [key]: value});
}, 'eye');
const morphControls = Object.entries(controls).map(([key, range]) => [
  key, key === 'forehead_height' ? {...range, label: 'Implantation capillaire'} : range
]);
sliders('#morph-controls', morphControls, '.01', (key, value) => {
  setSelection({...selection.raw, [key]: value}, 'custom', q('#morph-' + key));
}, 'morph');
q('#morph-forehead_height').setAttribute('aria-describedby', 'forehead-note');

options('#eye-request-axis', Object.entries(eyeControls).map(([key, range]) => [key, range.label]));
function syncRequest() {
  const key = q('#eye-request-axis').value;
  const {min, max, neutral: defaultValue} = eyeControls[key];
  const input = q('#eye-request-value');
  input.min = min;
  input.max = max;
  input.value = Math.round(editingValues?.[key] ?? defaultValue);
}
q('#eye-request-axis').addEventListener('change', syncRequest);
q('#eye-request').addEventListener('submit', event => {
  event.preventDefault();
  const key = q('#eye-request-axis').value;
  requestEyes('custom', {...editingValues, [key]: q('#eye-request-value').valueAsNumber}, event.submitter);
});
q('#eye-confirm').addEventListener('click', () => {
  const approval = pending;
  approval?.apply();
  approval?.trigger?.focus({preventScroll: true});
});
q('#eye-cancel').addEventListener('click', () => {
  const trigger = pending?.trigger;
  clearProposal();
  if (trigger === q('#reload')) q('#selection-message').textContent = 'Import annulé.';
  trigger?.focus();
});

function chooseForm(form, trigger) {
  const value = form === 'minimum' || form === 'maximum' ? extrema(form === 'minimum' ? 'min' : 'max') : normalizeEyes(form);
  requestEyes(form, value, trigger);
}
q('#eye-preset').addEventListener('change', event => chooseForm(event.target.value, event.target));
q('#shape-grid').addEventListener('click', event => {
  const button = event.target.closest('[data-eye-form]');
  if (button) {
    q('#atelier').scrollIntoView();
    chooseForm(button.dataset.eyeForm, button);
  }
});
q('#reset-eyes').addEventListener('click', () => setEyes('historical', null));
options('#draw-version', [[currentDraw, 'Admissible · version actuelle'], [legacyDraw, 'Historique · rejeu v1']]);
q('#random-eyes').addEventListener('click', () => {
  const seed = q('#seed').value, version = q('#draw-version').value;
  try {
    const result = drawEyes(inputFor(), seed, version);
    q('#draw-error').textContent = '';
    setEyes('custom', result.values, {seed, version});
  } catch (error) {
    q('#draw-error').textContent = error.message;
  }
});
q('#eye-guides').addEventListener('change', renderComparison);
q('#background').addEventListener('change', () => { renderComparison(); renderPaletteStudies(); });
q('#flat-mode').addEventListener('change', () => { refreshAvailability(); browsEditor.refresh(); renderComparison(); renderChart(); renderPaletteStudies(); });

function retainedArrangement(arrangement) {
  return arrangement === 'U' ? (selection.raw.arrangement === 'D' ? 'D' : 'G') : arrangement;
}

function chooseOrdinary(event) {
  const entry = choice(q('#ordinary').value);
  const next = selectOrdinary(entry.key, selection.raw);
  setSelection({...next.raw, arrangement: retainedArrangement(entry.arrangement)}, morphForm, event.currentTarget);
}
q('#ordinary').addEventListener('change', chooseOrdinary);
q('#choose-ordinary').addEventListener('click', chooseOrdinary);
function openKey(key, trigger) {
  const {style, arrangement} = choice(key);
  setSelection({...selection.raw, style, arrangement: retainedArrangement(arrangement)}, morphForm, trigger);
}
q('#load-history').addEventListener('click', event => openKey(q('#historical').value, event.currentTarget));
q('#arrangement').addEventListener('change', event => openKey(selection.state.style + ':' + event.target.value, event.target));
q('#body').addEventListener('change', event => setSelection({...selection.raw, body: event.target.value}, morphForm, event.target));
q('#morph').addEventListener('change', event => {
  const form = event.target.value;
  const raw = {...selection.raw};
  for (const key of axes) delete raw[key];
  setSelection({...raw, ...morphs[form].values}, form, event.target);
});
for (const flag of ['accessories', 'contrast']) {
  q('#' + flag).addEventListener('change', event => setSelection({...selection.raw, [flag]: event.target.checked}));
}
q('#palette-tabs').addEventListener('click', event => {
  const tab = event.target.closest('[data-category]');
  if (tab) { category = tab.dataset.category; renderSwatches(); }
});
q('#swatches').addEventListener('click', event => {
  const button = event.target.closest('[data-colour]');
  if (button) chooseColour(button.dataset.colour);
});
q('#series-grid').addEventListener('click', event => {
  const button = event.target.closest('[data-pick]');
  if (button) { chooseColour(button.dataset.pick); q('#atelier').scrollIntoView(); }
});
q('#variety-grid').addEventListener('click', event => {
  const button = event.target.closest('[data-key]');
  if (button) { openKey(button.dataset.key); q('#atelier').scrollIntoView(); }
});
for (const panel of ['#series-panel', '#variety-panel']) q(panel).addEventListener('toggle', renderPaletteStudies);
q('#export').addEventListener('click', () => {
  q('#selection-json').value = exportSelection(selection);
  q('#selection-message').textContent = 'Sélection historique affichée.';
});
q('#reload').addEventListener('click', () => {
  try {
    const message = q('#selection-message');
    const applied = setSelection(JSON.parse(q('#selection-json').value), 'custom', q('#reload'), () => {
      message.textContent = 'Sélection historique relue.';
    });
    if (!applied) message.textContent = 'Sélection en attente de confirmation.';
  } catch (error) {
    q('#selection-error').textContent = 'Sélection non chargée · ' + error.message;
  }
});

q('#appearance-export').addEventListener('click', () => {
  const document = appearanceDocument(selection, {eyes, form: selectedForm, draw, colour, flat: q('#flat-mode').checked, ...irisEditor.archiveSettings(), ...detailsEditor.archiveSettings(), ...browsEditor.archiveSettings(), ...mouthEditor.archiveSettings(), ...noseEditor.archiveSettings(), ...beardEditor.archiveSettings(), ...marksEditor.archiveSettings()});
  q('#appearance-json').value = JSON.stringify(document, null, 2);
  q('#appearance-error').textContent = '';
  q('#appearance-message').textContent = 'Apparence complète exportée.';
});
q('#appearance-import').addEventListener('click', () => {
  try {
    const restored = parseAppearance(q('#appearance-json').value);
    clearProposal();
    irisEditor.restore(restored);
    detailsEditor.restore(restored);
    browsEditor.restore(restored);
    mouthEditor.restore(restored);
    noseEditor.restore(restored);
    beardEditor.restore(restored);
    marksEditor.restore(restored);
    ({selection, eyes, form: selectedForm, draw, colour} = restored);
    q('#flat-mode').checked = restored.flat;
    q('#seed').value = draw?.seed ?? q('#seed').defaultValue;
    q('#draw-version').value = draw?.version ?? currentDraw;
    morphForm = 'custom';
    category = swatch(colour).category;
    q('#appearance-error').textContent = '';
    q('#appearance-message').textContent = 'Apparence complète restaurée.';
    refreshCharacter();
  } catch (error) {
    q('#appearance-message').textContent = '';
    q('#appearance-error').textContent = 'Apparence non chargée · ' + error.message;
  }
});

const irisEditor=mountIrisEditor({input:inputFor,eyes:()=>eyes,render:renderComparison});
const detailsEditor=mountDetailsEditor({input:inputFor,eyes:()=>eyes,render:()=>{
  noseEditor.refresh();
  mouthEditor.refresh();
  renderComparison();
}});
const browsEditor=mountBrowsEditor({input:inputFor,eyes:()=>eyes,
  colours:()=>({hairColor:activeColour(),rememberedHairColor:colour}),render:renderComparison});
const mouthEditor=mountMouthEditor({input:inputFor,eyes:()=>eyes,noseBounds:()=>noseEditor.bounds(),
  noseBoundsForDraw:()=>noseEditor.boundsForCustomMouth(),refreshNose:()=>noseEditor.refresh(),render:renderComparison});
const noseEditor=mountNoseEditor({input:inputFor,eyes:()=>eyes,details:()=>detailsEditor.value(),
  mouth:()=>mouthEditor.intent(),render:()=>{
    mouthEditor.refresh();
    renderComparison();
  }});
const beardEditor=mountBeardEditor({input:inputFor,eyes:()=>eyes,
  context:()=>({details:detailsEditor.value(),nose:noseEditor.value(),mouth:mouthEditor.value(),
    hairColor:activeColour(),rememberedHairColor:colour}),render:renderComparison});
const marksEditor=mountMarksEditor({input:inputFor,eyes:()=>eyes,
  context:()=>({details:detailsEditor.value(),nose:noseEditor.value(),mouth:mouthEditor.value()}),
  render:renderComparison});
mountFreckleStudy();
refreshCharacter();
