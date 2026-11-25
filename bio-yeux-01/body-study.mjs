import {adultBodies, adultBodyGeometry, anatomyLevels} from './adult-body.mjs';

function guidesMarkup(body, chin) {
  const {levels, ground} = adultBodyGeometry(body, chin);
  const pelvis = levels.at(-1);
  const rules = levels.map(({id, y, width}, index) => `
    <g data-body-level="${id}">
      <line x1="14" y1="${y}" x2="146" y2="${y}" stroke-dasharray="3 2"/>
      <circle cx="${ground.x - width}" cy="${y}" r="1.7"/>
      <circle cx="${ground.x + width}" cy="${y}" r="1.7"/>
      <text x="6" y="${y}" dominant-baseline="middle">${index + 1}</text>
    </g>`).join('');
  return `<g class="body-guides" data-body-guides="" aria-hidden="true">
    ${rules}
    <path data-pawn-base="" d="M140,${pelvis.y}h6V${ground.y}h-6"/>
    <line x1="${ground.x}" y1="${ground.y}" x2="146" y2="${ground.y}" stroke-dasharray="3 2"/>
    <circle data-ground-anchor="" cx="${ground.x}" cy="${ground.y}" r="2.5"/>
  </g>`;
}

export function renderBodyStudy(panel, {render, chin, bodies, background}) {
  if (!panel.open) return;
  const diagrams = panel.querySelector('#body-diagrams');
  const comparisons = panel.querySelector('#body-comparison');
  diagrams.className = `body-diagrams ${background}`;
  comparisons.className = `body-comparison ${background}`;
  diagrams.innerHTML = Object.entries(adultBodies).map(([body, {name}]) => {
    const portrait = render({body, view: 'tile', frame: '-8 77 176 181'});
    return `<figure><div class="surface">${portrait.replace('</svg>', guidesMarkup(body, chin) + '</svg>')}</div>
      <figcaption>${name}</figcaption></figure>`;
  }).join('');

  const scales = [['head', 'Tête · 300 px'], ['tile', 'Corps · 178 px'], ['mini', 'Miniature · 70 × 70 px']];
  comparisons.innerHTML = Object.entries({...adultBodies, ...bodies}).map(([body, {name}]) => `
    <article class="card" data-body-specimen="${body}">
      <h3>${name}</h3>
      <div class="body-scales">${scales.map(([view, caption]) => `
        <figure><div class="surface ${view}">${render({body, view})}</div><figcaption>${caption}</figcaption></figure>
      `).join('')}</div>
    </article>`).join('');
}

export function mountBodyStudy(panel, repaint) {
  panel.querySelector('#body-level-list').replaceChildren(...anatomyLevels.map(({label}) => {
    const item = document.createElement('li');
    item.textContent = label;
    return item;
  }));
  panel.addEventListener('toggle', () => { if (panel.open) repaint(); });
  const link = document.querySelector('nav a[href="#planche-corps"]');
  link.addEventListener('click', () => { panel.open = true; });
  if (window.location.hash === '#planche-corps') panel.open = true;
}
