const assert = require('node:assert/strict');
const {createHash} = require('node:crypto');
const {readFile} = require('node:fs/promises');
const {createServer} = require('node:http');
const {join} = require('node:path');
const {chromium, webkit, devices} = require('playwright');

const studies = [
  'planche-corps', 'planche-ossature', 'planche-corpulence', 'planche-poitrine', 'planche-pectoraux',
  'planche-details-thorax', 'planche-reliefs-osseux', 'planche-abdominaux', 'planche-pli-nombril',
  'diagnostic-pelvien', 'planche-anatomie-pelvienne', 'planche-panel', 'eye-contour-panel',
  'scar-study-panel', 'planche-rousseur-panel', 'makeup-study-panel', 'series-panel', 'variety-panel'
];
const q = (page, id) => page.locator('#' + id);
const select = (page, id, value) => q(page, id).selectOption(value);
const tap = (page, id) => q(page, id).tap();

async function ready(page, url) {
  assert.equal((await page.goto(url))?.status(), 200);
  await page.waitForFunction(() => document.getElementById('atelier').dataset.startup !== 'pending');
  assert.equal(await q(page, 'atelier').getAttribute('data-startup'), 'ready', await q(page, 'atelier-startup-detail').textContent());
}

async function space(page, key) {
  if (await q(page, 'open-' + key).getAttribute('aria-pressed') !== 'true') await tap(page, 'open-' + key);
  assert.equal(await page.locator('[data-editor-space]:visible').count(), 1);
}

async function open(page, id) {
  const panel = q(page, id);
  if (!await panel.evaluate(node => node.open)) await panel.locator(':scope > summary').tap();
  return panel;
}

async function workshop(page) {
  await space(page, 'technique');
  await open(page, 'appearance-panel');
  await tap(page, 'appearance-export');
  assert.equal(await q(page, 'appearance-error').textContent(), '');
  return JSON.parse(await q(page, 'appearance-json').inputValue());
}

async function restore(page, archive) {
  await space(page, 'technique');
  await open(page, 'appearance-panel');
  await q(page, 'appearance-json').fill(JSON.stringify(archive));
  await tap(page, 'appearance-import');
  assert.equal(await q(page, 'appearance-error').textContent(), '');
}

async function range(page, id, value) {
  const node = q(page, id);
  assert.equal(await node.isVisible(), true, id);
  assert.equal(await node.isEnabled(), true, id);
  await node.evaluate((input, value) => {
    input.value = value;
    input.dispatchEvent(new Event('input', {bubbles: true}));
  }, value);
}
const visible = async (page, id, shown = true) => assert.equal(await q(page, id).isVisible(), shown, id);
const svg = (page, selector = '#editor-current [data-side=after] svg') =>
  page.locator(selector).evaluateAll(images => images.map(image => image.outerHTML.replace(/(?:atelier-yeux|resident)-\d+/g, 'instance')));

async function observeStudies(page) {
  await page.addInitScript(ids => {
    window.studyWrites = [];
    const descriptor = Object.getOwnPropertyDescriptor(Element.prototype, 'innerHTML');
    Object.defineProperty(Element.prototype, 'innerHTML', {
      ...descriptor,
      set(markup) {
        const panel = this.closest('details');
        if (ids.includes(panel?.id) && /<svg[\s>]/.test(markup)) {
          window.studyWrites.push([panel.id, panel.open, !panel.closest('[data-editor-space][hidden]')]);
        }
        descriptor.set.call(this, markup);
      }
    });
  }, studies);
}

async function verifyManifest(context, url) {
  const response = await context.request.get(new URL('version.json', url).href);
  assert.equal(response.status(), 200);
  const data = await response.json();
  assert.equal(data.mission, 'BIO-EPURE-03-L02-R01');
  if (process.env.PREVIEW_SOURCE) assert.equal(data.sourceCommit, process.env.PREVIEW_SOURCE);
  assert.deepEqual(data.files.map(file => file.path).sort(), [data.startup, 'index.html', 'style.css'].sort());
  for (const {path, sha256} of data.files) {
    const resource = await context.request.get(new URL(path, url).href);
    assert.equal(resource.status(), 200);
    assert.equal(createHash('sha256').update(await resource.body()).digest('hex'), sha256, path);
  }
  return data;
}

async function anatomy(page, old, url, oldURL, browser) {
  await ready(old, oldURL);
  const choices = await q(page, 'body').locator('option:enabled').evaluateAll(options => options.map(option => option.value));
  assert.deepEqual(choices, ['adult-h', 'adult-f']);
  assert.equal(await q(page, 'body').inputValue(), 'adult-h');
  assert.equal(await page.locator('[data-thorax-body], [data-pubic-body]').count(), 0);
  assert.deepEqual(await q(page, 'eye-preset').locator('option:enabled').evaluateAll(options => options.map(option => option.value)),
    ['round', 'oval', 'almond', 'narrow', 'upturned', 'downturned', 'heavy', 'crescent']);
  assert.equal(await q(page, 'eye-preset').inputValue(), 'reference');
  assert.equal(await q(page, 'open-creation').getAttribute('aria-pressed'), 'true');
  assert.deepEqual(await q(page, 'morph-skull_width').evaluate(node => [node.min, node.max]), ['86','118']);
  await select(old, 'body', 'adult-h');
  assert.deepEqual(await svg(page), await svg(old));
  await range(page, 'corpulence', 31.25);
  await select(page, 'body', 'adult-f');
  assert.equal(await q(page, 'beard-category').inputValue(), 'F');
  await select(old, 'body', 'adult-f');
  assert.deepEqual(await svg(page), await svg(old));
  await visible(page, 'chest-width', false);
  await range(page, 'chest-volume', 66);
  await range(page, 'chest-width', 75.5);
  await range(page, 'chest-volume', 0);
  await visible(page, 'chest-width', false);

  await space(page, 'laboratoire');
  await open(page, 'historical-settings');
  assert.equal(await q(page, 'historical-body').locator('option').count(), 6);
  assert.equal(await q(page, 'historical-morph').locator('option').count(), 5);
  assert.equal(await q(page, 'beard-category').isVisible(), true);
  await range(page, 'structure-base', 130);
  const archive = await workshop(page);
  assert.equal(archive.active.character.structure.base, 130);
  assert.equal(archive.active.character.chest.width, 75.5);
  assert.equal(archive.inactiveBodies['adult-h'].corpulence, 31.25);
  await space(page, 'creation');
  await tap(page, 'structure-reset');
  assert.equal((await workshop(page)).active.character.structure.base, 130);
  await space(page, 'creation');
  const width100 = await svg(page);
  await space(old, 'creation');
  await restore(old, archive);
  await space(old, 'creation');
  await range(old, 'structure-base', 100);
  assert.deepEqual(await svg(old), width100);
  await range(old, 'structure-base', 130);
  await space(page, 'laboratoire');
  const compare = await open(page, 'editor-comparison');
  await compare.locator('#comparison svg').first().waitFor();
  assert.deepEqual(await svg(page, '#comparison [data-side=after] svg'), await svg(old));

  const cold = await browser.newContext(devices['iPad Mini']);
  try {
    const copy = await cold.newPage();
    await ready(copy, url);
    await restore(copy, archive);
    assert.deepEqual(await workshop(copy), archive);
    await space(copy, 'creation');
    await visible(copy, 'chest-width', false);
    await range(copy, 'chest-volume', 80);
    assert.equal(await q(copy, 'chest-width').inputValue(), '75.5');
    await select(copy, 'body', 'adult-h');
    assert.equal(await q(copy, 'corpulence').inputValue(), '31.25');
  } finally { await cold.close(); }
  await ready(page, url);
  assert.equal(await q(page, 'body').inputValue(), 'adult-f');
  await space(page, 'laboratoire');
  await open(page, 'historical-settings');
  await select(page, 'historical-body', 'slim');
  await tap(page, 'apply-historical-body');
  assert.equal((await workshop(page)).active.character.body, 'slim');
  await space(page, 'creation');
  await visible(page, 'historical-body-notice');
  await visible(page, 'editor-current', false);
  await select(page, 'body', 'adult-h');
  assert.equal((await workshop(page)).active.character.body, 'adult-h');
  await space(page, 'laboratoire');
  await open(page, 'historical-settings');
  await select(page, 'historical-morph', 'ipad');
  await tap(page, 'apply-historical-morph');
  if (await q(page, 'eye-proposal').isVisible()) await tap(page, 'eye-confirm');
  await space(page, 'creation');
  assert.match(await q(page, 'morph-reference-note').textContent(), /iPad combiné/);
  await select(page, 'morph', 'neutral');
}

async function eyeAndVisibility(page) {
  await q(page, 'iris-active').check();
  await visible(page, 'iris-secondary', false);
  await select(page, 'iris-hetero', 'complete');
  await visible(page, 'iris-secondary');
  await visible(page, 'iris-secondarySize', false);
  await select(page, 'iris-secondary', 'bleu');
  await select(page, 'iris-hetero', 'central');
  await visible(page, 'iris-secondarySize');
  await select(page, 'iris-hetero', 'none');
  await visible(page, 'iris-secondary', false);
  await select(page, 'iris-hetero', 'central');
  assert.equal(await q(page, 'iris-secondary').inputValue(), 'bleu');

  await q(page, 'brows-active').check();
  await select(page, 'brows-colour-mode', 'independent');
  await visible(page, 'brows-colour');
  await select(page, 'brows-colour', 'roux-cuivre');
  await q(page, 'brows-absent').check();
  await visible(page, 'brows-colour', false);
  await q(page, 'brows-absent').uncheck();
  assert.equal(await q(page, 'brows-colour').inputValue(), 'roux-cuivre');
  const before = await workshop(page);
  await space(page, 'creation');
  await range(page, 'eye-width', 120);
  await visible(page, 'eye-proposal', false);
  assert.match(await q(page, 'eye-status').textContent(), /ajustement anatomique/i);
  assert.match(await page.locator('output[for=eye-width]').textContent(), /120,0/);
  const after = await workshop(page);
  assert.equal(after.active.eyes.requested.width, 120);
  assert.notDeepEqual(after.active.eyes.requested, after.active.eyes.effective);
  assert.deepEqual(after.active.brows.requested, before.active.brows.requested);
  assert.deepEqual(after.active.iris.requested, before.active.iris.requested);
  assert.deepEqual(after.active.character, before.active.character);
  await space(page, 'laboratoire');
  await open(page, 'eye-experiments');
  await open(page, 'eye-request-panel');
  await select(page, 'eye-request-axis', 'width');
  await q(page, 'eye-request-value').fill('120');
  await q(page, 'eye-request').locator('button').tap();
  await visible(page, 'eye-proposal');
  await tap(page, 'eye-cancel');
  assert.deepEqual(await workshop(page), after);

  await space(page, 'creation');
  await q(page, 'details-active').check();
  await visible(page, 'detail-lashes-spacing', false);
  await q(page, 'detail-lashes-count').press('End');
  await visible(page, 'detail-lashes-spacing');
  await q(page, 'detail-lashes-count').press('Home');
  await visible(page, 'detail-lashes-length', false);
  await visible(page, 'detail-lashes-count');
  for (const [field, activation, dependent] of [
    ['detail-axes-upper', 'detail-upper-count', 'detail-upper-length'],
    ['detail-axes-lower', 'detail-lower-count', 'detail-lower-length'],
    ['detail-axes-shadows', 'detail-shadows-intensity', 'detail-shadows-width'],
    ['detail-axes-shadows', 'detail-shadows-volume', 'detail-shadows-puffWidth']
  ]) {
    const panel = q(page, field).locator('..');
    if (!await panel.evaluate(element => element.open)) await panel.locator('summary').tap();
    await q(page, activation).press('End');
    await visible(page, dependent);
    await q(page, activation).press('Home');
    await visible(page, dependent, false);
  }
}

async function faceAndPalette(page) {
  await space(page, 'creation');
  await q(page, 'nose-active').check();
  await select(page, 'nose-detail-preset', 'defined');
  await select(page, 'nose-preset', 'distinctNostrils');
  const nose = (await workshop(page)).active.nose.requested;
  assert.equal(nose.fills, 77);
  assert.equal(nose.lines, 83);
  assert.equal(nose.nostrils, 163);
  await space(page, 'laboratoire');
  await open(page, 'historical-settings');
  await tap(page, 'historical-nose');
  const legacy = (await workshop(page)).active.nose.requested;
  assert.deepEqual([legacy.fills, legacy.lines], [43, 79]);
  await space(page, 'creation');
  assert.equal(await q(page, 'ordinary').locator('option').count(), 119);
  assert.equal(await q(page, 'historical').locator('option').count(), 126);
  assert.equal(await q(page, 'historical').evaluate(node => node.closest('[data-editor-space]').dataset.editorSpace), 'laboratoire');
  assert.equal(await q(page, 'iris-primary').locator('option').count(), 16);
  assert.equal(await q(page, 'beard-colour').locator('option').count(), 26);
  await visible(page, 'makeup-lips-colour', false);
  await q(page, 'makeup-enabled').check();
  await visible(page, 'makeup-lips-colour');
  const labels = Object.fromEntries(await q(page, 'makeup-lips-colour').locator('option').evaluateAll(options =>
    options.map(option => [option.value, option.textContent])));
  const {makeupColourNames} = await import('../makeup-colour-names.mjs');
  assert.deepEqual(labels, makeupColourNames);
  await range(page, 'makeup-lips-intensity', 0);
  await visible(page, 'makeup-lips-colour', false);
  await visible(page, 'makeup-lips-intensity');
  await range(page, 'makeup-lips-intensity', 60);
  await visible(page, 'makeup-lips-colour');
  await select(page, 'makeup-family', 'shadow');
  await visible(page, 'makeup-shadow-colour', false);
  await q(page, 'makeup-enabled').check();
  await visible(page, 'makeup-shadow-colour');
  await select(page, 'makeup-family', 'lips');
  await visible(page, 'makeup-shadow-colour', false);
  await visible(page, 'makeup-lips-colour');
  await tap(page, 'marks-add');
  await tap(page, 'marks-place');
  const zoom = page.locator('#marks-zoom svg');
  const {width, height} = await zoom.boundingBox();
  await zoom.tap({position: {x: Math.round(width * .46), y: Math.round(height * .42)}});
  assert.equal(await q(page, 'marks-place').getAttribute('aria-pressed'), 'false');
  await select(page, 'marks-type', 'freckles');
  await tap(page, 'marks-add');
  assert.equal(await q(page, 'marks-seed').isVisible(), false);
}

async function drawsAndStudies(page) {
  await space(page, 'laboratoire');
  assert.deepEqual(await page.evaluate(() => window.studyWrites), []);
  const labs = [];
  for (const id of studies) {
    const panel = await open(page, id);
    await panel.locator('svg').first().waitFor({state: 'attached'});
    labs.push(await panel.locator('svg').count());
    await panel.locator(':scope > summary').tap();
  }
  const writes = await page.evaluate(() => window.studyWrites);
  assert(writes.every(([, open, visible]) => open && visible));
  assert.equal(new Set(writes.map(([id]) => id)).size, 18);
  const draws = [
    ['eyes','seed','random-eyes','eyes'], ['iris','iris-seed','iris-random','iris'],
    ['details','details-seed','details-random','details'], ['brows','brows-seed','brows-random','brows'],
    ['nose','nose-seed','nose-random','nose'], ['mouth','mouth-seed','mouth-random','mouth'],
    ['beard','beard-seed','beard-random','facialHair'], ['marks','marks-seed','marks-redistribute','marks'],
    ['scars','scars-seed','scars-draw','scars'], ['makeup','makeup-seed','makeup-draw','makeup']
  ];
  for (const [module, seed, action, key] of draws) {
    await space(page, 'laboratoire');
    await open(page, 'editor-draws');
    await select(page, 'draw-module', module);
    assert.equal(await page.locator('[data-draw-module]:visible').count(), 1);
    await q(page, seed).fill('Microcosme · L02 ' + module);
    await tap(page, action);
    const one = (await workshop(page)).active[key];
    assert(one, module + ' est exporté dans ' + key);
    await space(page, 'laboratoire');
    assert.equal(await q(page, seed).inputValue(), 'Microcosme · L02 ' + module);
    await tap(page, action);
    assert.deepEqual((await workshop(page)).active[key], one, module);
  }
  await space(page, 'laboratoire');
  await open(page, 'editor-latent');
  await page.waitForFunction(() => document.getElementById('editor-latent-json').textContent.length > 0);
  assert.match(await q(page, 'editor-latent-json').textContent(), /L02 scars/);
  assert.equal(await page.evaluate(() => window.studyWrites.length), writes.length);
  const {legacyDraw} = await import('../draw.mjs');
  await open(page, 'editor-draws');
  await select(page, 'draw-module', 'eyes');
  await select(page, 'draw-version', legacyDraw);
  await q(page, 'seed').fill('Microcosme');
  await tap(page, 'random-eyes');
  const legacy = (await workshop(page)).active.eyes;
  assert.equal(legacy.draw.version, legacyDraw);
  await space(page, 'laboratoire');
  await tap(page, 'random-eyes');
  assert.deepEqual((await workshop(page)).active.eyes, legacy);
  return {studies: labs.length, svg: labs.reduce((sum, count) => sum + count, 0), draws: draws.length};
}

async function legacyArchives(page) {
  const {historicalDocuments} = await import('./legacy-appearance-fixtures.mjs');
  const {parseWorkshop, workshopDocument} = await import('../workshop-archive.mjs');
  const fixtures = historicalDocuments();
  assert.deepEqual(fixtures.map(fixture => fixture.version), Array.from({length: 22}, (_, i) => i + 1));
  for (const document of fixtures) {
    const state = parseWorkshop(JSON.stringify(document));
    const expected = workshopDocument(state.selection, state, new Map(), true, state.historicalSource);
    await restore(page, document);
    assert.deepEqual(await workshop(page), expected, 'apparence v' + document.version);
  }
  return fixtures.length;
}

async function activationAndArchives(page, browser, url) {
  const {historicalDocuments} = await import('./legacy-appearance-fixtures.mjs');
  const {parseWorkshop, workshopDocument} = await import('../workshop-archive.mjs');
  const base = parseWorkshop(JSON.stringify(historicalDocuments()[10]));
  const archive = workshopDocument(base.selection, {
    ...base, mouth: {upper: 0, lower: 0, intensity: 0},
    marks: [{id: 'm1', type: 'freckles', density: 0, intensity: 0, zones: ['cheeks'], seed: 'Récupération'}]
  }, new Map(), true);
  await restore(page, archive);
  await space(page, 'creation');
  await visible(page, 'mouth-intensity');
  await visible(page, 'mouth-upper', false);
  await q(page, 'mouth-intensity').press('End');
  await visible(page, 'mouth-upper');
  await visible(page, 'marks-intensity');
  await visible(page, 'marks-density', false);
  await q(page, 'marks-intensity').press('End');
  await visible(page, 'marks-density');
  await space(page, 'technique');

  const witnesses = [];
  for (const [value, id] of [['0', 'temoin-f-01'], ['1', 'temoin-h-01']]) {
    await page.locator('#resident-preview select').selectOption(value);
    await tap(page, 'resident-open');
    await tap(page, 'resident-export');
    const json = await q(page, 'resident-archive').inputValue();
    assert.equal(JSON.parse(json).identity.id, id);
    witnesses.push({json, svg: await svg(page, '.resident-views svg')});
  }
  const cold = await browser.newContext(devices['iPad Mini']);
  try {
    const copy = await cold.newPage();
    await ready(copy, url);
    await space(copy, 'technique');
    for (const witness of witnesses) {
      await q(copy, 'resident-archive').fill(witness.json);
      await tap(copy, 'resident-import');
      assert.deepEqual(await svg(copy, '.resident-views svg'), witness.svg);
      await tap(copy, 'resident-export');
      assert.equal(await q(copy, 'resident-archive').inputValue(), witness.json);
    }
  } finally { await cold.close(); }
  await tap(page, 'makeup-export');
  const composition = await q(page, 'makeup-json').inputValue();
  assert.equal(JSON.parse(composition).schema, 'microcosme.makeup');
  await tap(page, 'makeup-import');
  assert.match(await q(page, 'makeup-exchange-message').textContent(), /appliquée/);
  await open(page, 'json-panel');
  await tap(page, 'export');
  const historical = JSON.parse(await q(page, 'selection-json').inputValue());
  assert.equal(historical.schema, undefined);
  await tap(page, 'reload');
  assert.match(await q(page, 'selection-message').textContent(), /relue/);
}

async function run(engine, url, referenceURL) {
  const browser = await engine.launch();
  try {
    const context = await browser.newContext(devices['iPad Mini']);
    const page = await context.newPage(), old = await context.newPage();
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    const manifest = await verifyManifest(context, url);
    await observeStudies(page);
    await ready(page, url);
    assert.deepEqual(await page.evaluate(() => window.studyWrites), []);
    await anatomy(page, old, url, referenceURL, browser);
    await space(page, 'creation');
    await eyeAndVisibility(page);
    await faceAndPalette(page);
    const coverage = await drawsAndStudies(page);
    const archiveVersions = await legacyArchives(page);
    await space(page, 'technique');
    for (const id of ['resident-preview', 'json-panel', 'makeup-exchange']) await visible(page, id);
    await activationAndArchives(page, browser, url);
    await open(page, 'appearance-panel');
    await q(page, 'appearance-json').fill('{');
    await tap(page, 'appearance-import');
    assert.match(await q(page, 'appearance-error').textContent(), /non chargée/);
    await space(page, 'creation');
    assert.match(await q(page, 'editor-alerts').textContent(), /non chargée/);
    assert.deepEqual(errors, []);
    return {engine:engine.name(), version:browser.version(), source:manifest.sourceCommit, archiveVersions, residentColdRestores: 2, ...coverage};
  } finally { await browser.close(); }
}

async function main() {
  const {PREVIEW_DIR, REFERENCE_DIR, PREVIEW_URL, REFERENCE_URL, BROWSER = 'chromium,webkit'} = process.env;
  const directories = {preview: PREVIEW_DIR, reference: REFERENCE_DIR};
  const types = {html: 'text/html', css: 'text/css', json: 'application/json', js: 'text/javascript'};
  const server = createServer(async (request, response) => {
    const match = request.url.match(/^\/(preview|reference)\/(index\.html|style\.css|version\.json|atelier-[\da-f]{16}\.js)?$/);
    if (!match || !directories[match[1]]) return response.writeHead(404).end();
    const file = match[2] ?? 'index.html';
    try {
      const data = await readFile(join(directories[match[1]], file));
      response.writeHead(200, {'Content-Type': types[file.split('.').at(-1)]}).end(data);
    } catch { response.writeHead(404).end(); }
  });
  assert((PREVIEW_DIR || PREVIEW_URL) && (REFERENCE_DIR || REFERENCE_URL));
  if (!PREVIEW_URL || !REFERENCE_URL) await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const local = name => 'http://127.0.0.1:' + server.address().port + '/' + name + '/';
  try {
    for (const engine of BROWSER.split(',')) {
      console.log(JSON.stringify(await run({chromium, webkit}[engine], PREVIEW_URL ?? local('preview'), REFERENCE_URL ?? local('reference'))));
    }
  } finally { if (server.listening) server.close(); }
}
main().catch(error => { console.error(error); process.exitCode = 1; });
