import {identical} from './appearance.mjs';
import {parseResident, renderResident, serializeResident} from './resident.mjs';
import {residentWitnesses} from './resident-witnesses.mjs';

const representations = [
  ['portrait', 'head', 'Portrait'],
  ['pawn', 'tile', 'Corps / pion'],
  ['thumbnail', 'mini', 'Miniature']
];

export function mountResidentPreview(panel) {
  if (!panel) return;
  const witnesses = residentWitnesses();
  const select = panel.querySelector('select');
  const archive = panel.querySelector('textarea');
  const status = panel.querySelector('[role=status]');
  const error = panel.querySelector('[role=alert]');
  const views = panel.querySelector('.resident-views');
  let resident;

  function show(next) {
    views.innerHTML = representations.map(([representation, scale, caption]) =>
      `<figure><div class="surface ${scale}">${renderResident(next, {representation})}</div><figcaption>${caption}</figcaption></figure>`).join('');
    resident = next;
    panel.querySelector('output').textContent = resident.identity.id;
    panel.querySelector('pre').textContent = serializeResident(resident);
    error.textContent = '';
  }

  panel.querySelector('#resident-open').addEventListener('click', () => {
    const witness = witnesses.find((_, index) => String(index) === select.value);
    if (!witness) {
      status.textContent = '';
      error.textContent = 'Habitant non chargé · Choisissez un témoin.';
      return;
    }
    show(witness);
    status.textContent = 'Témoin chargé.';
  });
  panel.querySelector('#resident-export').addEventListener('click', () => {
    archive.value = serializeResident(resident);
    status.textContent = 'Copiez le JSON pour une restauration après réouverture.';
  });
  panel.querySelector('#resident-import').addEventListener('click', () => {
    try {
      const restored = parseResident(archive.value);
      const witness = witnesses.find(candidate => candidate.identity.id === restored.identity.id);
      show(restored);
      status.textContent = witness
        ? identical(witness, restored)
          ? 'Habitant restauré. Identité et caractéristiques identiques au témoin.'
          : 'Habitant restauré. Les caractéristiques diffèrent du témoin portant cet identifiant.'
        : 'Habitant restauré. Les trois représentations ont été reconstruites.';
    } catch (cause) {
      status.textContent = '';
      error.textContent = 'Habitant non chargé · ' + cause.message;
    }
  });
  show(witnesses[0]);
}
