import {palette, swatch} from '../bio-col-01/palette.mjs';
import {choices, ordinaryChoices, choice} from '../bio-col-01/catalogue.mjs';
import {restoreSelection, selectOrdinary, exportSelection} from '../bio-col-01/selection.mjs';
import {controls, bodies, presets} from '../bio-vis-p5-i6/model.mjs';
import {priorityCase} from '../bio-vis-p5-i6/i5/i4/i3/i2/i1/base/r1/coverage.mjs';
import {character} from './render.mjs';
import {eyeControls, eyePresets, eyesFor, normalizeEyes, randomEyes} from './eyes.mjs';

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
let serial = 0, queued = false;

function options(selector, entries) {
  for (const [value, text] of entries) q(selector).add(new Option(text, value));
}

function sliders(selector, entries, step, changed, type) {
  for (const [key, range] of entries) {
    const label = document.createElement('label');
    label.className = 'slider';
    label.innerHTML = `<span>${range.label}<output for="${type}-${key}"></output></span><input id="${type}-${key}" type="range" min="${range.min}" max="${range.max}" step="${step}" aria-label="${escape(range.label)}">`;
    label.querySelector('input').addEventListener('input', event => changed(key, event.target.valueAsNumber));
    q(selector).append(label);
  }
}

function inputFor(key = selection.key) {
  const {style, arrangement} = choice(key);
  return {...selection.state, style, arrangement: arrangement === 'U' ? 'G' : arrangement,
    accessories: selection.raw.accessories !== false, contrast: selection.raw.contrast !== false};
}

const frames = {head: '-30 -65 220 225', tile: '-40 -85 240 355', mini: '-35 -68 230 245'};
function svg({key, view = 'head', value = eyes, frame = frames[view], guides = false, hair = activeColour(), decorative = false} = {}) {
  const result = character(inputFor(key), {
    eyes: value, eyeEnvelopes: guides, hairColor: hair, headOnly: view !== 'tile',
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

function setEyes(form, value = normalizeEyes(form)) {
  selectedForm = form;
  eyes = value;
  renderEyes();
}

function renderEyes() {
  q('#eye-preset').value = selectedForm;
  const result = eyesFor(inputFor(), eyes);
  for (const [key, range] of Object.entries(eyeControls)) {
    const requested = eyes?.[key] ?? neutral[key];
    const input = q('#eye-' + key);
    input.value = requested;
    const current = displayValue(key, requested);
    const effective = result.corrected.includes(key) ? displayValue(key, result.effective[key]) : null;
    const taper = key === 'taper' ? requested === range.min ? 'Arrondi' : requested === range.max ? 'Pointu' : current : current;
    const text = effective ? `${current} → ${effective}` : taper;
    input.setAttribute('aria-valuetext', effective ? `${current} demandé, ${effective} effectif` : taper);
    q(`output[for="eye-${key}"]`).textContent = text;
  }
  const status = q('#eye-status');
  const text = !eyes ? 'Rendu historique actif.' : result.corrected.length ?
    'Les valeurs affichées à droite tiennent compte des limites du visage.' : 'Toutes les valeurs demandées sont appliquées.';
  if (status.textContent !== text) status.textContent = text;
  for (const button of document.querySelectorAll('[data-eye-form]')) {
    button.setAttribute('aria-pressed', String(button.dataset.eyeForm === selectedForm));
  }
  renderComparison();
}

function renderComparison() {
  const guides = q('#eye-guides').checked;
  const comparison = q('#comparison');
  comparison.dataset.eyes = selectedForm;
  comparison.className = 'comparison ' + q('#background').value;
  q('#guide-note').hidden = !guides;
  const sizes = value => [['head', 'Tête · 300 px'], ['tile', 'Corps · 178 px'], ['mini', 'Miniature · 70 × 70 px']]
    .map(([view, caption]) => `<figure><div class="surface ${view}">${svg({view, value, guides})}</div><figcaption>${caption}</figcaption></figure>`).join('');
  const title = eyePresets[selectedForm]?.label ?? otherLabels[selectedForm];
  comparison.innerHTML = `<article data-side="before"><h3>Historique</h3>${sizes(null)}</article><article data-side="after"><h3>${title}</h3>${sizes(eyes)}</article>`;
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

function syncSelection() {
  const entry = choice(selection.key);
  q('#ordinary').value = selection.visibleKey;
  q('#historical').value = selection.key;
  q('#identity-note').textContent = `Identifiant ouvert · ${entry.label} · ${entry.name}`;
  q('#body').value = selection.state.body;
  for (const key of ['accessories', 'contrast']) q('#' + key).checked = selection.raw[key] !== false;
  for (const key of axes) {
    q('#morph-' + key).value = selection.state[key];
    q(`output[for="morph-${key}"]`).textContent = format.format(selection.state[key]);
  }
  q('#selection-json').value = exportSelection(selection);
}

function refreshCharacter() {
  syncSelection();
  renderEyes();
  renderChart();
  renderPaletteStudies();
}

function setSelection(raw) {
  selection = restoreSelection(raw);
  q('#selection-error').textContent = '';
  refreshCharacter();
}

function renderSwatches() {
  q('#swatches').innerHTML = palette.filter(p => p.category === category).map(p =>
    `<button type="button" data-colour="${p.id}" aria-pressed="${p.id === colour}" style="--fill:${p.fill};--stroke:${p.stroke}"><span class="chip" aria-hidden="true"></span>${p.name}</button>`).join('');
  for (const tab of document.querySelectorAll('[data-category]')) tab.setAttribute('aria-pressed', String(tab.dataset.category === category));
  const p = swatch(colour);
  q('#colour-info').textContent = `${p.name} · Aplat ${p.fill} · Contour ${p.stroke}`;
}

function chooseColour(id) {
  colour = id;
  category = swatch(id).category;
  q('#flat-mode').checked = true;
  renderSwatches();
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
      return `<article class="card"><h3>${p.name}</h3><p class="hint">${p.fill} · ${p.stroke}</p>${surface('tile', settings)}<div class="twins">${surface('mini', settings, 'light')}${surface('mini', settings, 'dark')}</div><button type="button" data-pick="${p.id}">Choisir ${p.name}</button></article>`;
    }).join('');
  }
  if (q('#variety-panel').open) {
    q('#variety-grid').innerHTML = variety.map(key => {
      const entry = choice(key);
      return `<article class="card"><h3>${entry.label}</h3><p class="hint">${escape(entry.name)}</p>${surface('tile', {key})}${surface('mini', {key})}<button type="button" data-key="${key}">Inspecter ${entry.label}</button></article>`;
    }).join('');
  }
}

function nextFrame(callback) {
  if (queued) return;
  queued = true;
  requestAnimationFrame(() => { queued = false; callback(); });
}

options('#eye-preset', [['historical', otherLabels.historical], ...eyeEntries.map(([key, p]) => [key, p.label]),
  ...['minimum', 'maximum', 'custom'].map(key => [key, otherLabels[key]])]);
q('#eye-preset option[value=custom]').disabled = true;
options('#morph', [...Object.entries(morphs).map(([key, p]) => [key, p.name]), ['custom', 'Combinaison libre']]);
q('#morph option[value=custom]').disabled = true;
options('#ordinary', ordinaryChoices.map(e => [e.key, e.label + ' · ' + e.name]));
options('#historical', choices.map(e => [e.key, e.label + ' · ' + e.name]));
options('#body', Object.entries(bodies).map(([key, body]) => [key, body.name]));

sliders('#eye-controls', Object.entries(eyeControls), '1', (key, value) => {
  eyes = {...(eyes ?? neutral), [key]: value};
  selectedForm = 'custom';
  nextFrame(renderEyes);
}, 'eye');
sliders('#morph-controls', Object.entries(controls), '.01', (key, value) => {
  selection = restoreSelection({...selection.raw, [key]: value});
  q('#morph').value = 'custom';
  nextFrame(refreshCharacter);
}, 'morph');

function chooseForm(form) {
  if (form === 'minimum' || form === 'maximum') setEyes(form, extrema(form === 'minimum' ? 'min' : 'max'));
  else setEyes(form);
}
q('#eye-preset').addEventListener('change', event => chooseForm(event.target.value));
q('#shape-grid').addEventListener('click', event => {
  const button = event.target.closest('[data-eye-form]');
  if (button) {
    chooseForm(button.dataset.eyeForm);
    q('#atelier').scrollIntoView();
  }
});
q('#reset-eyes').addEventListener('click', () => setEyes('historical'));
q('#random-eyes').addEventListener('click', () => setEyes('custom', randomEyes(inputFor(), q('#seed').value)));
q('#eye-guides').addEventListener('change', renderComparison);
q('#background').addEventListener('change', () => { renderComparison(); renderPaletteStudies(); });
q('#flat-mode').addEventListener('change', () => { renderComparison(); renderChart(); renderPaletteStudies(); });

function chooseOrdinary() {
  selection = selectOrdinary(q('#ordinary').value, selection.raw);
  refreshCharacter();
}
q('#ordinary').addEventListener('change', chooseOrdinary);
q('#choose-ordinary').addEventListener('click', chooseOrdinary);
function openKey(key) {
  const {style, arrangement} = choice(key);
  setSelection({...selection.raw, style, arrangement: arrangement === 'U' ? 'G' : arrangement});
}
q('#load-history').addEventListener('click', () => openKey(q('#historical').value));
q('#body').addEventListener('change', event => setSelection({...selection.raw, body: event.target.value}));
q('#morph').addEventListener('change', event => {
  const raw = {...selection.raw};
  for (const key of axes) delete raw[key];
  setSelection({...raw, ...morphs[event.target.value].values});
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
    setSelection(JSON.parse(q('#selection-json').value));
    q('#morph').value = 'custom';
    q('#selection-message').textContent = 'Sélection historique relue.';
  } catch (error) {
    q('#selection-error').textContent = 'Sélection non chargée · ' + error.message;
  }
});

renderSwatches();
refreshCharacter();
