import {freckleCases, freckleViews, studySkin} from './marks-study.mjs';
import {makeupPalette} from './makeup.mjs';
import {character} from './render.mjs';

const [honey, rosy, copper, brown] = freckleCases;
const lips = {enabled: true, colour: '#a52f47', intensity: 76, coverage: 91, edge: 33};
const shadow = {enabled: true, colour: '#79549e', accent: '#ac65b2', height: 89, intensity: 85, extent: 93};
const liner = {enabled: true, colour: '#151519', top: 59, bottom: 26, wing: 89, slant: 18};
const blush = {enabled: true, colour: '#cf526f', intensity: 77, x: 68, y: 13, diffusion: 77};
const elements = [
  {shape: 'crescent', x: 27, y: 59, size: 30, stretch: 0, rotation: 23, mirror: true, colour: '#3f649b'},
  {shape: 'diamond', x: 50, y: 27, size: 17, stretch: 0, colour: '#4d9eab'},
  {shape: 'point', x: 19, y: 57, size: 59, mirror: true, colour: '#fff8e9'}
];

const examples = [
  ['Lèvres · contour de prune', rosy, {lips}],
  ['Fard à paupières · dégradé bicolore', honey, {shadow}],
  ['Eyeliner · pointe montante', copper, {liner}],
  ['Fard à joues · pommettes hautes', brown, {blush}],
  ['Peintures · croissants en miroir', rosy, {paint: {enabled: true, elements}}],
  ['Lèvres, paupières, eyeliner et joues', honey, {lips, shadow, liner, blush}],
  ['Cinq familles · composition asymétrique', brown, {
    lips: {...lips, colour: '#db7452'}, shadow: {...shadow, colour: '#dc8437', accent: '#e0b43f'},
    liner: {...liner, colour: '#493026'}, blush: {...blush, colour: '#a83d30'}, paint: {enabled: true, elements: [
      {shape: 'stripe', x: 29, y: 62, size: 43, stretch: 28, rotation: -25, colour: '#397e62', intensity: 92},
      {shape: 'wave', x: 30, y: 62, size: 28, rotation: -25, colour: '#fff8e9', intensity: 96},
      {shape: 'star', x: 74, y: 67, size: 23, stretch: 0, rotation: 17, colour: '#e0b43f'},
      {shape: 'ring', x: 50, y: 26, size: 24, stretch: 0, colour: '#e0b43f'}
    ]}
  }]
];

export function mountMakeupStudy() {
  const gallery = document.getElementById('makeup-study');
  const panel = document.getElementById('makeup-study-panel');
  const openFromLink = () => { if (location.hash === '#planche-maquillage') panel.open = true; };
  window.addEventListener('hashchange', openFromLink);
  openFromLink();
  document.getElementById('makeup-study-palette').innerHTML = makeupPalette.map(([label, colours]) =>
    `<div><span>${label}</span><div>${colours.map(colour =>
      `<span class="makeup-chip" title="${colour}" aria-label="${colour}" style="background:${colour}"></span>`).join('')}</div></div>`).join('');
  function refresh() {
    if (gallery.firstElementChild || !panel.open) return;
    gallery.innerHTML = examples.map(([label, study, makeup], i) =>
      `<article class="freckle-row" data-makeup-study="${i}"><header><h3>${label}</h3><p>${study.label.split(' · ').slice(0, 2).join(' · ')}</p></header>
      <div class="freckle-scales">${freckleViews.slice(1).map(([key, caption, frame, scale]) => {
        const svg = character(study.face, {
          ...scale, eyes: ['almond', 'round', 'narrow'][i % 3], makeup,
          instance: 'planche-maquillage-' + i + '-' + key
        }).replace(/viewBox="[^"]*"/, `viewBox="${frame}"`);
        return `<figure class="freckle-${key}">${studySkin(svg, study.skin)}<figcaption>${caption}</figcaption></figure>`;
      }).join('')}</div></article>`).join('');
  }
  panel.addEventListener('toggle', refresh);
  refresh();
}
