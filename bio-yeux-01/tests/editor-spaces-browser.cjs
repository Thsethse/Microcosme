const assert = require('node:assert/strict');
const {createHash} = require('node:crypto');
const {readFile} = require('node:fs/promises');
const {createServer} = require('node:http');
const {join} = require('node:path');
const {chromium, webkit, devices} = require('playwright');

const body = [
  'planche-corps', 'planche-ossature', 'planche-corpulence', 'planche-poitrine', 'planche-pectoraux',
  'planche-details-thorax', 'planche-reliefs-osseux', 'planche-abdominaux', 'planche-pli-nombril',
  'diagnostic-pelvien', 'planche-anatomie-pelvienne'
];
const face = ['planche-panel', 'eye-contour-panel', 'scar-study-panel', 'planche-rousseur-panel', 'makeup-study-panel'];
const hair = ['series-panel', 'variety-panel'];
const studies = [...body, ...face, ...hair];
const current = '#editor-current [data-side=after] svg';
const reference = '#comparison [data-side=after] svg';
const views = (page, selector) => page.locator(selector).evaluateAll(nodes => nodes.map(node =>
  node.outerHTML.replace(/(?:resident|atelier-yeux)-\d+/g, 'instance-stable')));

async function ready(page, url) {
  assert.equal((await page.goto(url)).status(), 200);
  await page.waitForSelector('#atelier[data-startup=ready]', {state: 'attached'});
}

async function space(page, name) {
  const button = page.locator('#open-' + name);
  if (await button.getAttribute('aria-pressed') !== 'true') await button.tap();
  assert.equal(await page.locator('[data-editor-space]:visible').count(), 1);
  assert.equal(await page.locator('#espace-' + name).isVisible(), true);
}

async function open(page, id) {
  const panel = page.locator('#' + id);
  if (!await panel.evaluate(node => node.open)) await panel.locator(':scope > summary').tap();
  return panel;
}

async function archive(page) {
  await space(page, 'technique');
  await open(page, 'appearance-panel');
  await page.locator('#appearance-export').tap();
  assert.equal(await page.locator('#appearance-error').textContent(), '');
  return JSON.parse(await page.locator('#appearance-json').inputValue());
}

async function changeBody(page, key) {
  await page.locator('#body').selectOption('adult-' + key);
  const fields = key === 'f' ? ['chest-volume', 'chest-width'] : ['pectoral-volume', 'pectoral-width'];
  for (const id of [...fields, 'corpulence']) await page.locator('#' + id).press('End');
}

async function checkManifest(context, url) {
  const response = await context.request.get(new URL('version.json', url).href);
  assert.equal(response.status(), 200);
  const manifest = await response.json();
  assert.equal(manifest.mission, 'BIO-EPURE-03-L01-R01');
  if (process.env.PREVIEW_SOURCE) assert.equal(manifest.sourceCommit, process.env.PREVIEW_SOURCE);
  assert.deepEqual(manifest.files.map(({path}) => path).sort(), [manifest.startup, 'index.html', 'style.css'].sort());
  for (const {path, sha256} of manifest.files) {
    const file = await context.request.get(new URL(path, url).href);
    assert.equal(file.status(), 200, path);
    assert.equal(createHash('sha256').update(await file.body()).digest('hex'), sha256, path);
  }
  return manifest;
}

async function assertNoStudyRender(page) {
  assert.deepEqual(await page.evaluate(() => window.studyWrites), []);
  assert.equal(await page.locator('#planches-corps svg, #planches-visage svg, #planches-cheveux svg').count(), 0);
}

async function instrument(page) {
  await page.addInitScript(ids => {
    window.studyWrites = [];
    const descriptor = Object.getOwnPropertyDescriptor(Element.prototype, 'innerHTML');
    Object.defineProperty(Element.prototype, 'innerHTML', {
      ...descriptor,
      set(markup) {
        const panel = this.closest('details');
        if (ids.includes(panel?.id) && /<svg[\s>]/.test(markup)) {
          window.studyWrites.push({
            id: panel.id, open: panel.open, visibleSpace: !panel.closest('[data-editor-space][hidden]'),
            svg: [...markup.matchAll(/<svg[\s>]/g)].length
          });
        }
        return descriptor.set.call(this, markup);
      }
    });
  }, studies);
}

async function studyCensus(page) {
  await space(page, 'laboratoire');
  await assertNoStudyRender(page);
  const census = {};
  for (const id of studies) {
    const panel = await open(page, id);
    await panel.locator('svg').first().waitFor({state: 'attached'});
    census[id] = await panel.locator('svg').count();
    await panel.locator(':scope > summary').tap();
    assert.equal(await panel.evaluate(node => node.open), false, id);
  }
  const writes = await page.evaluate(() => window.studyWrites);
  assert(writes.every(({open, visibleSpace}) => open && visibleSpace));
  for (const id of studies) {
    const total = writes.filter(write => write.id === id).reduce((sum, write) => sum + write.svg, 0);
    assert.equal(total, census[id], id);
  }
  assert.equal(census['planche-panel'], 11);
  assert.equal(census['planche-rousseur-panel'], 12);
  assert.equal(census['series-panel'], 78);
  assert.equal(census['variety-panel'], 32);
  return {census, writes: writes.length};
}

async function noOverflow(page, name) {
  for (const viewport of [{width: 768, height: 1024}, {width: 1024, height: 768}, {width: 390, height: 844}]) {
    await page.setViewportSize(viewport);
    assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), name + ' · ' + viewport.width);
    for (const button of await page.locator('#editor-navigation button').all()) {
      const bounds = await button.boundingBox();
      assert(bounds.width >= 44 && bounds.height >= 44);
    }
  }
  await page.setViewportSize({width: 768, height: 1024});
}

async function formats(page, saved) {
  await space(page, 'technique');
  assert.equal(saved.schema, 'microcosme.workshop');
  await open(page, 'json-panel');
  await page.locator('#export').tap();
  const raw = JSON.parse(await page.locator('#selection-json').inputValue());
  assert.equal(typeof raw.style, 'string');
  assert.equal(raw.schema, undefined);
  await page.locator('#reload').tap();
  assert.match(await page.locator('#selection-message').textContent(), /relue/i);
  await page.locator('#resident-export').tap();
  assert.equal(JSON.parse(await page.locator('#resident-archive').inputValue()).schema, 'microcosme.adult-resident');
  await page.locator('#makeup-export').tap();
  const makeup = await page.locator('#makeup-json').inputValue();
  assert.equal(JSON.parse(makeup).schema, 'microcosme.makeup');
  await page.locator('#makeup-import').tap();
  assert.match(await page.locator('#makeup-exchange-message').textContent(), /appliquée/i);
  await page.locator('#makeup-json').fill('{');
  await page.locator('#makeup-import').tap();
  const error = await page.locator('#makeup-exchange-error').textContent();
  assert(error);
  for (const destination of ['creation', 'laboratoire']) {
    await space(page, destination);
    assert.equal(await page.locator('#editor-alerts').textContent(), error);
  }
}

async function run(engine, url, oldURL) {
  const browser = await engine.launch();
  try {
    const context = await browser.newContext(devices['iPad Mini']);
    const page = await context.newPage(), old = await context.newPage();
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await instrument(page);
    const manifest = await checkManifest(context, url);
    await ready(page, url);
    await ready(old, oldURL);
    assert.equal(await page.locator('#atelier-entry').getAttribute('src'), manifest.startup);
    assert.equal(await page.locator('#open-creation').getAttribute('aria-pressed'), 'true');
    assert.equal(await page.locator('#editor-current').isVisible(), true);
    const sizes = await page.locator(current).evaluateAll(svgs => svgs.map(svg => {
      const {width, height} = svg.getBoundingClientRect();
      return [Math.round(width), Math.round(height)];
    }));
    assert.deepEqual(sizes.map(([, height]) => height), [300, 178, 70]);
    assert.equal(sizes.at(-1)[0], 70);
    assert.deepEqual(await views(page, current), await views(old, reference));
    await noOverflow(page, 'Création');
    await assertNoStudyRender(page);

    for (const key of ['h', 'f']) {
      await changeBody(page, key);
      await changeBody(old, key);
      assert.deepEqual(await views(page, current), await views(old, reference));
    }
    const matchingViews = await views(page, current);
    await page.locator('#background').selectOption('dark');
    assert.equal(await page.locator('#editor-current.dark').count(), 1);
    assert.deepEqual(await views(page, current), matchingViews);
    await assertNoStudyRender(page);
    const before = await archive(page);
    assert(before.inactiveBodies['adult-h'].pectorals);
    await noOverflow(page, 'Technique');
    const {census, writes} = await studyCensus(page);
    await noOverflow(page, 'Laboratoire');
    const comparison = await open(page, 'editor-comparison');
    await comparison.locator('#comparison svg').first().waitFor();
    await page.locator('#eye-guides').check();
    assert.equal(await page.locator('#guide-note').isVisible(), true);
    assert.deepEqual(await views(page, current), matchingViews);
    await comparison.locator('summary').tap();
    await open(page, 'eye-experiments');
    await open(page, 'eye-request-panel');
    await page.locator('#eye-request-value').fill('120');
    await page.locator('#eye-request button').tap();
    assert.equal(await page.locator('#eye-proposal').isVisible(), true);
    await page.locator('#eye-cancel').tap();
    assert.deepEqual(await archive(page), before);
    assert.equal(await page.evaluate(() => window.studyWrites.length), writes);
    await space(page, 'laboratoire');
    assert.equal(await page.evaluate(() => window.studyWrites.length), writes);

    await open(page, 'series-panel');
    await page.locator('#series-panel [data-pick="noir-profond"]').tap();
    const applied = await archive(page);
    assert.notDeepEqual(applied.active.palette, before.active.palette);
    assert.deepEqual(applied.inactiveBodies, before.inactiveBodies);
    const writesBeforeHiddenChange = await page.evaluate(() => window.studyWrites.length);
    await space(page, 'creation');
    await page.locator('#background').selectOption('light');
    assert.equal(await page.evaluate(() => window.studyWrites.length), writesBeforeHiddenChange);
    await page.locator('#marks-add').tap();
    const mark = page.locator('#marks-place');
    await mark.tap();
    const zoom = page.locator('#marks-zoom svg');
    const {width, height} = await zoom.boundingBox();
    await zoom.tap({position: {x: Math.round(width * .46), y: Math.round(height * .42)}});
    assert.equal(await mark.getAttribute('aria-pressed'), 'false');
    const withMark = await archive(page);
    assert.equal(withMark.active.marks.requested[0].id, 'm1');
    await formats(page, withMark);

    const link = new URL('#planche-corps', url);
    await page.goto('about:blank');
    await ready(page, link.href);
    assert.equal(await page.locator('#open-laboratoire').getAttribute('aria-pressed'), 'true');
    await page.locator('#planche-corps svg').first().waitFor();
    const direct = new Set(await page.evaluate(() => window.studyWrites.map(write => write.id)));
    assert.deepEqual([...direct], ['planche-corps']);
    assert.deepEqual(errors, []);

    const startup = '**/' + manifest.startup;
    await page.route(startup, route => route.abort());
    await page.goto(url);
    await page.locator('#atelier-retry').waitFor();
    assert.match(await page.locator('#atelier-startup-error').textContent(), /script indisponible/i);
    await page.unroute(startup);
    await page.locator('#atelier-retry').tap();
    await page.waitForSelector('#atelier[data-startup=ready]', {state: 'attached'});
    return {engine: engine.name(), version: browser.version(), sourceCommit: manifest.sourceCommit,
      matchingSVG: 9, studies: census, writes, viewports: [768, 1024, 390]};
  } finally {
    await browser.close();
  }
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
    } catch {
      response.writeHead(404).end();
    }
  });
  assert((PREVIEW_DIR || PREVIEW_URL) && (REFERENCE_DIR || REFERENCE_URL), 'Indiquez les deux distributions à comparer.');
  if (!PREVIEW_URL || !REFERENCE_URL) await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const local = name => 'http://127.0.0.1:' + server.address().port + '/' + name + '/';
  try {
    for (const name of BROWSER.split(',')) {
      console.log(JSON.stringify(await run({chromium, webkit}[name], PREVIEW_URL ?? local('preview'), REFERENCE_URL ?? local('reference'))));
    }
  } finally {
    if (server.listening) server.close();
  }
}

main().catch(error => { console.error(error); process.exitCode = 1; });
