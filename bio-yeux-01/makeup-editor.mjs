import {
  drawMakeup, hasMakeup, inactiveFields, makeupDocument, makeupFamilies, makeupMirrorUseful, makeupPalette,
  maxPaintElements, normalizeMakeup, paintShapes, parseMakeup
} from './makeup.mjs';
import {makeupCoordinates, makeupFor, makeupPlane} from './makeup-render.mjs';
import {sceneCoordinates} from './surface.mjs';
import {makeupColourNames} from './makeup-colour-names.mjs';

const drawSeedKey = 'microcosme.adult-editor.makeup-seed';
const storageKey = 'microcosme.bio-maquillage-01.compositions';
const references = {
  shadow: [
    ['Discret', {intensity: 35, height: 41, extent: 74, outer: 21, accent: null}],
    ['Étendu', {intensity: 63, height: 89, extent: 98, outer: 14, accent: null}],
    ['Externe', {intensity: 67, height: 72, extent: 51, outer: 93, accent: null}],
    ['Bicolore', {intensity: 77, height: 79, extent: 93, outer: 56, accent: '#ac65b2'}]
  ],
  liner: [
    ['Fin', {top: 23, bottom: 0, wing: 0, slant: 0}],
    ['Épais', {top: 80, bottom: 0, wing: 15, slant: 8}],
    ['Allongé', {top: 48, bottom: 0, wing: 92, slant: 18}],
    ['Complet', {top: 67, bottom: 55, wing: 40, slant: 11}]
  ],
  blush: [
    ['Discret', {intensity: 37, x: 49, y: 36, extent: 48, diffusion: 82}],
    ['Marqué', {intensity: 84, x: 49, y: 49, extent: 73, diffusion: 65}],
    ['Pommettes hautes', {intensity: 66, x: 67, y: 8, extent: 58, diffusion: 73}]
  ]
};

export function mountMakeupEditor({commandLayout, input, eyes, context, render, updateVisibility}) {
  const q = id => document.getElementById('makeup-' + id);
  const family = q('family'), show = q('show'), enabled = q('enabled'), zoom = q('zoom');
  const paintPanel = q('paint-panel'), kind = q('paint-kind'), shape = q('paint-shape'), list = q('paint-list');
  const mirror = q('mirror'), presets = q('reference'), saved = q('saved');
  const message = q('message'), json = q('json'), name = q('name');
  const entries = Object.entries(makeupFamilies);
  const seed = q('seed');
  if (commandLayout) {
    try { seed.value = localStorage.getItem(drawSeedKey) ?? seed.defaultValue; }
    catch { /* A restricted browser session can still draw with its own seed. */ }
  }
  let values = normalizeMakeup(), selected = 0, shown = true, placing = false, touched = false;

  family.append(...entries.map(([key, {label}]) => new Option(label, key)));
  for (const select of [kind, shape]) {
    select.append(...Object.entries(paintShapes).map(([value, label]) => new Option(label, value)));
  }

  const familyValue = () => values[family.value];
  const edited = () => family.value === 'paint' ? values.paint.elements[selected] : familyValue();
  const commit = () => {
    touched = true;
    render();
  };

  function control(key, definition, group) {
    const {label, min, max, unit, pigment, initial} = definition;
    const field = document.createElement('label'), id = 'makeup-' + group + '-' + key;
    field.className = pigment ? 'makeup-pigment' : 'slider';
    const title = document.createElement('span');
    title.textContent = label;
    field.append(title);
    const element = document.createElement(pigment ? 'select' : 'input');
    element.id = id;
    element.setAttribute('aria-label', label);
    let output;
    if (pigment) {
      output = document.createElement('span');
      output.className = 'makeup-chip';
      output.setAttribute('aria-hidden', 'true');
      title.append(output);
      if (initial === null) element.add(new Option('Aucune', ''));
      for (const [name, colours] of makeupPalette) {
        const options = document.createElement('optgroup');
        options.label = name;
        options.append(...colours.map(colour => new Option(commandLayout ? makeupColourNames[colour] : colour, colour)));
        element.append(options);
      }
    } else {
      element.type = 'range';
      element.min = min;
      element.max = max;
      element.step = 1;
      output = document.createElement('output');
      output.htmlFor = id;
      title.append(output);
    }
    field.append(element);
    element.addEventListener(pigment ? 'change' : 'input', () => {
      edited()[key] = pigment ? element.value || null : element.valueAsNumber;
      commit();
    });
    return {key, field, element, output, pigment, unit};
  }

  const panels = Object.fromEntries(entries.map(([group, {fields}]) => {
    const panel = document.createElement('div');
    const controls = Object.entries(fields).map(([key, definition]) => control(key, definition, group));
    panel.append(...controls.map(({field}) => field));
    q('controls').append(panel);
    return [group, {panel, controls}];
  }));

  function stopPlacing() {
    placing = false;
    q('place').setAttribute('aria-pressed', 'false');
    zoom.classList.remove('placing');
  }

  function refresh() {
    const key = family.value, isPaint = key === 'paint';
    const element = edited(), active = shown && familyValue().enabled;
    let off = element ? inactiveFields(key, element) : [];
    if (key === 'lips' && active) {
      const layout = makeupFor(input(), eyes(), {lips: {...element, intensity: 100, coverage: 100}}, context());
      if (!layout.effective.lips) off = Object.keys(makeupFamilies.lips.fields);
    }
    show.checked = shown;
    enabled.checked = familyValue().enabled;
    q('enabled-text').textContent = isPaint ? 'Afficher les peintures faciales' : 'Afficher cette famille';
    paintPanel.hidden = !isPaint;
    for (const [group, {panel, controls}] of Object.entries(panels)) {
      panel.hidden = group !== key || !element;
      if (panel.hidden) continue;
      for (const {key: field, element: input, output, pigment, unit} of controls) {
        input.value = element[field] ?? '';
        input.disabled = !active || off.includes(field);
        if (pigment) output.style.backgroundColor = element[field] ?? '';
        else {
          output.value = element[field] + (unit === '°' ? '°' : ' %');
          input.setAttribute('aria-valuetext', output.value);
        }
      }
    }
    presets.parentElement.hidden = !references[key];
    presets.disabled = !active;
    if (isPaint) {
      const elements = values.paint.elements;
      list.replaceChildren(...elements.map((item, i) => new Option((i + 1) + ' · ' + paintShapes[item.shape], String(i))));
      list.value = String(selected);
      list.disabled = !elements.length;
      q('add').disabled = !shown || elements.length >= maxPaintElements;
      q('remove').disabled = !element;
      q('down').disabled = !element || selected === 0;
      q('up').disabled = !element || selected === elements.length - 1;
      q('place').disabled = !element || !active || element.intensity === 0;
      shape.disabled = !element || !active;
      mirror.disabled = !element || !active || element.intensity === 0 || !makeupMirrorUseful(element);
      if (element) {
        shape.value = element.shape;
        mirror.checked = element.mirror;
      }
    }
  }

  function updatePresets() {
    presets.replaceChildren(new Option('Personnalisé', ''), ...(references[family.value] ?? [])
      .map(([label], i) => new Option(label, String(i))));
  }
  family.addEventListener('change', () => { stopPlacing(); updatePresets(); refresh(); updateVisibility?.(); });
  show.addEventListener('change', () => { shown = show.checked; stopPlacing(); commit(); });
  enabled.addEventListener('change', () => { familyValue().enabled = enabled.checked; stopPlacing(); commit(); });
  presets.addEventListener('change', () => {
    if (presets.value === '') return;
    Object.assign(familyValue(), references[family.value][Number(presets.value)][1]);
    commit();
  });
  q('reset').addEventListener('click', () => {
    values[family.value] = normalizeMakeup()[family.value];
    selected = 0;
    stopPlacing();
    updatePresets();
    commit();
  });
  q('remove-all').addEventListener('click', () => {
    shown = false;
    stopPlacing();
    commit();
  });
  q('draw').addEventListener('click', () => {
    values = drawMakeup(seed.value);
    if (commandLayout) {
      try { localStorage.setItem(drawSeedKey, seed.value); }
      catch { /* The current session retains the input value. */ }
    }
    shown = true;
    selected = 0;
    stopPlacing();
    updatePresets();
    commit();
  });

  q('add').addEventListener('click', () => {
    const {elements} = values.paint;
    if (elements.length >= maxPaintElements) return;
    selected = elements.length;
    values.paint = normalizeMakeup({paint: {enabled: true, elements: [...elements, {shape: kind.value}]}}).paint;
    stopPlacing();
    commit();
  });
  q('remove').addEventListener('click', () => {
    const {elements} = values.paint;
    elements.splice(selected, 1);
    selected = Math.max(0, Math.min(selected, elements.length - 1));
    stopPlacing();
    commit();
  });
  list.addEventListener('change', () => { selected = Number(list.value); stopPlacing(); refresh(); updateVisibility?.(); });
  shape.addEventListener('change', () => { edited().shape = shape.value; commit(); });
  mirror.addEventListener('change', () => { edited().mirror = mirror.checked; commit(); });
  for (const [button, step] of [['down', -1], ['up', 1]]) {
    q(button).addEventListener('click', () => {
      const {elements} = values.paint, next = selected + step;
      [elements[selected], elements[next]] = [elements[next], elements[selected]];
      selected = next;
      commit();
    });
  }
  q('place').addEventListener('click', () => {
    if (placing) return stopPlacing();
    placing = true;
    q('place').setAttribute('aria-pressed', 'true');
    zoom.classList.add('placing');
    message.textContent = 'Touchez la peau pour placer la forme.';
  });
  zoom.addEventListener('click', event => {
    const svg = zoom.querySelector('svg');
    if (!placing || !svg || !edited()) return;
    const location = sceneCoordinates(svg, event.clientX, event.clientY, makeupPlane(input(), eyes()));
    const position = location && makeupCoordinates(...location);
    if (!position || position.some(value => value < 0 || value > 100)) {
      message.textContent = 'Choisissez une zone de peau à l’intérieur du visage.';
      return;
    }
    [edited().x, edited().y] = position;
    stopPlacing();
    message.textContent = 'Forme placée.';
    commit();
  });

  const readLibrary = () => new Map(JSON.parse(localStorage.getItem(storageKey) ?? '[]'));
  function refreshLibrary(selection = saved.value) {
    const library = readLibrary();
    saved.replaceChildren(new Option('Choisir une composition', ''),
      ...[...library.keys()].sort((a, b) => a.localeCompare(b, 'fr')).map(key => new Option(key, key)));
    if (library.has(selection)) saved.value = selection;
    q('apply').disabled = !saved.value;
  }
  const exchangeStatus = q('exchange-message') ?? message;
  const exchangeError = q('exchange-error') ?? message;
  function perform(action, errorTarget = q('error') ?? message) {
    if (errorTarget !== message) errorTarget.textContent = '';
    try {
      action();
    } catch (error) {
      errorTarget.textContent = error.message;
    }
  }
  function apply(composition, feedback, status = message) {
    values = composition;
    shown = true;
    selected = 0;
    stopPlacing();
    updatePresets();
    status.textContent = feedback;
    commit();
  }
  q('save').addEventListener('click', () => perform(() => {
    const title = name.value.trim();
    if (!title) throw new Error('Indiquez un nom pour enregistrer la composition.');
    const library = readLibrary();
    library.set(title, makeupDocument(values));
    localStorage.setItem(storageKey, JSON.stringify([...library]));
    refreshLibrary(title);
    message.textContent = 'Composition enregistrée sur cet appareil.';
  }));
  saved.addEventListener('change', () => { q('apply').disabled = !saved.value; });
  q('apply').addEventListener('click', () => perform(() => {
    const document = readLibrary().get(saved.value);
    apply(parseMakeup(JSON.stringify(document)), 'Composition appliquée au visage actuel.');
  }));
  q('export').addEventListener('click', () => {
    json.value = JSON.stringify(makeupDocument(values), null, 2);
    if (exchangeError !== message) exchangeError.textContent = '';
    exchangeStatus.textContent = 'Composition exportée en JSON.';
  });
  q('import').addEventListener('click', () => {
    exchangeStatus.textContent = '';
    perform(() => apply(parseMakeup(json.value), 'Composition importée et appliquée au visage actuel.', exchangeStatus), exchangeError);
  });

  updatePresets();
  perform(() => refreshLibrary());
  return {
    refresh,
    value: () => shown && hasMakeup(values) ? values : null,
    archiveSettings: () => !touched ? {} : shown ? {makeup: values} : {makeupLatent: values},
    restore({makeup, makeupLatent}) {
      touched = !!(makeup || makeupLatent);
      values = normalizeMakeup(makeup ?? makeupLatent ?? {});
      selected = 0;
      shown = !makeupLatent;
      stopPlacing();
      updatePresets();
    }
  };
}
