const bodyStudies = [
  'planche-corps', 'planche-ossature', 'planche-corpulence', 'planche-poitrine', 'planche-pectoraux',
  'planche-details-thorax', 'planche-reliefs-osseux', 'planche-abdominaux', 'planche-pli-nombril',
  'diagnostic-pelvien', 'planche-anatomie-pelvienne'
];
const faceStudies = ['planche', 'planche-contours', 'planche-cicatrices', 'planche-rousseur', 'planche-maquillage'];
const createPanels = ['atelier', 'personnage', 'iris', 'details', 'brows', 'nose', 'mouth', 'beard', 'marks', 'scars', 'makeup'];

export function mountEditorSpaces(template, onEnter) {
  const q = id => document.getElementById(id);
  const footer = document.querySelector('main > footer');
  const legacyNav = document.querySelector('header > nav');
  footer.before(template.content.cloneNode(true));
  const creation = q('espace-creation'), lab = q('espace-laboratoire'), technique = q('espace-technique');
  const navigation = q('editor-navigation');
  document.querySelector('main').prepend(navigation, q('editor-feedback'));
  const move = (container, ids) => container.append(...ids.map(q));
  const link = (nav, id, label) => {
    const anchor = legacyNav.querySelector(`a[href="#${id}"]`) ?? document.createElement('a');
    anchor.href = '#' + id;
    if (label) anchor.textContent = label;
    nav.append(anchor);
  };

  move(creation, createPanels);
  const creationNav = creation.querySelector('nav');
  link(creationNav, 'atelier', 'Vues et réglages des yeux');
  link(creationNav, 'personnage');
  link(creationNav, 'atelier-thorax');
  link(creationNav, 'atelier-bassin');
  for (const id of createPanels.slice(2)) link(creationNav, id);

  for (const id of faceStudies) q('planches-visage').append(q(id));
  for (const id of bodyStudies) q('planches-corps').append(q(id).parentElement);
  move(q('planches-cheveux'), ['series-panel', 'variety-panel']);
  const labNav = lab.querySelector('nav');
  for (const [id, label] of [
    ['comparaisons', 'Comparaisons'], ['experiences', 'Expérimentations'], ['planches-visage', 'Visage'],
    ['planches-corps', 'Anatomie'], ['planches-cheveux', 'Cheveux']
  ]) link(labNav, id, label);

  for (const [section, target, summary] of [
    ['planche', q('shape-grid'), 'Comparer et appliquer les formes'],
    ['planche-rousseur', q('freckle-case').parentElement, 'Voir les densités aux différentes échelles']
  ]) {
    const panel = document.createElement('details');
    panel.id = section + '-panel';
    const title = document.createElement('summary');
    title.textContent = summary;
    const children = [...q(section).children];
    const contents = children.slice(children.indexOf(target));
    panel.append(title, ...contents);
    q(section).append(panel);
  }

  const comparePanel = q('editor-comparison');
  const createComparison = q('comparison');
  const current = document.createElement('div');
  current.id = 'editor-current';
  current.className = 'comparison';
  createComparison.before(current);
  const preview = createComparison.closest('.comparison-panel');
  preview.querySelector('h2').textContent = 'Personnage';
  const referenceControls = [...preview.querySelector('.toolbar').children].filter(label => !label.contains(q('background')));
  comparePanel.querySelector('.toolbar').append(...referenceControls);
  move(comparePanel, ['comparison', 'guide-note']);
  move(q('editor-feedback'), ['atelier-startup', 'atelier-startup-error', 'eye-proposal']);
  const eyeExperiments = q('eye-experiments');
  eyeExperiments.append(q('random-eyes'), q('draw-version').parentElement, q('seed').parentElement, q('draw-error'), q('eye-request-panel'));
  q('historical-choices').append(q('historical').parentElement, q('load-history'));
  q('makeup-experiments').append(q('makeup-seed').closest('.makeup-actions'));

  move(q('formats-atelier'), ['appearance-panel']);
  move(q('formats-habitant'), ['resident-preview']);
  move(q('formats-historique'), ['json-panel']);
  q('resident-title').textContent = 'Habitants témoins et restauration';
  q('appearance-panel').querySelector('summary').textContent = 'Exporter ou importer l’archive H/F';
  q('appearance-export').textContent = 'Exporter l’archive H/F';
  q('appearance-import').textContent = 'Importer l’archive H/F';
  const exchange = q('makeup-exchange');
  q('makeup-exchange-message').before(q('makeup-json').parentElement, q('makeup-import').closest('.makeup-actions'));
  const makeupError = document.createElement('p');
  makeupError.id = 'makeup-error';
  makeupError.setAttribute('role', 'alert');
  q('makeup-message').after(makeupError);

  const techniqueNav = technique.querySelector('nav');
  link(techniqueNav, 'appearance-panel', 'Archive H/F');
  link(techniqueNav, 'resident-preview', 'Fiche habitant');
  link(techniqueNav, 'json-panel', 'Sélection historique');
  link(techniqueNav, exchange.id, 'Maquillage JSON');
  link(techniqueNav, 'diagnostics', 'Diagnostics et rapports');
  q('diagnostics').append(footer.querySelector('a'));
  footer.remove();

  for (const anchor of creation.querySelectorAll('figure a[href="#atelier"]')) anchor.textContent = 'Voir aux trois échelles';
  legacyNav.remove();
  template.remove();
  document.body.classList.add('editor-spaces');

  const buttons = [...navigation.querySelectorAll('button[aria-controls]')];
  let active = creation;
  const alert = q('editor-alerts');
  const sources = [...document.querySelectorAll('[role="alert"]')].filter(node => node !== alert);
  function updateAlerts() {
    const messages = sources.filter(node => node.textContent.trim() && !node.hidden &&
      node.parentElement.closest('[hidden], details:not([open])'));
    const text = messages.map(node => node.textContent.trim()).join(' · ');
    if (alert.textContent !== text) alert.textContent = text;
  }
  const observer = new MutationObserver(updateAlerts);
  for (const source of sources) observer.observe(source, {characterData: true, childList: true, subtree: true});
  document.addEventListener('toggle', updateAlerts, true);
  updateAlerts();

  function show(space) {
    if (space === active) return;
    active.hidden = true;
    space.hidden = false;
    active = space;
    for (const button of buttons) button.setAttribute('aria-pressed', String(button.getAttribute('aria-controls') === space.id));
    updateAlerts();
    onEnter(space.dataset.editorSpace);
  }

  function openFragment(fragment) {
    const target = q(fragment.slice(1));
    const space = target?.closest('[data-editor-space]');
    if (!space) return;
    show(space);
    const panel = target.closest('details') ?? (faceStudies.includes(target.id) ? target.querySelector('details') : null);
    if (panel) panel.open = true;
    return target;
  }
  function showFragment() {
    const target = openFragment(location.hash);
    target?.scrollIntoView();
  }

  document.querySelector('main').addEventListener('click', event => {
    const anchor = event.target.closest('a[href^="#"]');
    if (anchor) openFragment(anchor.hash);
  });
  window.addEventListener('hashchange', showFragment);
  for (const button of buttons) button.addEventListener('click', () => {
    if (location.hash) history.replaceState(null, '', location.pathname + location.search);
    const space = q(button.getAttribute('aria-controls'));
    show(space);
    space.querySelector('nav').scrollIntoView();
  });
  return {showFragment};
}
