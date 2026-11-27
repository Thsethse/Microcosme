const assert = require('node:assert/strict');
const {createHash} = require('node:crypto');
const {createServer} = require('node:http');
const {readFile, mkdir, writeFile} = require('node:fs/promises');
const {join, resolve} = require('node:path');
const {chromium, devices, webkit} = require('playwright');

const engines = {chromium, webkit};
const files = {'index.html': 'text/html', 'style.css': 'text/css', 'version.json': 'application/json'};
const prefix = '/preview/bio-socle-02-r01/';
const viewBoxes = ['-30 -65 220 225', '-40 -85 240 355', '-35 -68 230 245'];

async function ready(browser, url, startup) {
  const context = await browser.newContext({
    ...devices['iPad Mini'],
    ignoreHTTPSErrors: process.env.PAGES_TEST_PROXY === '1'
  });
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('response', response => {
    if (response.status() >= 400) errors.push(response.url() + ' ' + response.status());
  });
  assert.equal((await page.goto(url)).status(), 200);
  await page.waitForFunction(() => document.querySelector('#atelier').dataset.startup !== 'pending');
  assert.equal(await page.locator('#atelier').getAttribute('data-startup'), 'ready',
    await page.locator('#atelier-startup-detail').textContent());
  assert.equal(await page.locator('#atelier-entry').getAttribute('src'), startup);
  return {context, page, errors};
}

async function verifyBuild(browser, url) {
  const context = await browser.newContext({ignoreHTTPSErrors: process.env.PAGES_TEST_PROXY === '1'});
  try {
    const manifest = await context.request.get(new URL('version.json', url).href);
    assert.equal(manifest.status(), 200);
    const data = await manifest.json();
    assert.equal(data.mission, 'BIO-SOCLE-02-R02');
    assert.match(data.sourceCommit, /^[\da-f]{40}$/);
    if (process.env.PREVIEW_SOURCE) assert.equal(data.sourceCommit, process.env.PREVIEW_SOURCE);
    assert.match(data.startup, /^atelier-[\da-f]{16}\.js$/);
    assert.deepEqual(data.files.map(({path}) => path).sort(), [data.startup, 'index.html', 'style.css'].sort());
    for (const {path, sha256} of data.files) {
      const response = await context.request.get(new URL(path, url).href);
      assert.equal(response.status(), 200, path);
      assert.equal(createHash('sha256').update(await response.body()).digest('hex'), sha256, path);
    }
    return data;
  } finally {
    await context.close();
  }
}

const control = (page, id) => page.locator('#' + id);
const nav = (page, hash) => page.locator(`nav a[href="#${hash}"]`).tap();
const base = (page, body) => page.locator(`[data-thorax-body="adult-${body}"]`).tap();
const snapshots = locator => locator.evaluateAll(svgs => svgs.map(svg => ({
  viewBox: svg.getAttribute('viewBox'),
  markup: svg.outerHTML.replaceAll(/(?:resident|atelier-yeux)-\d+/g, 'stable')
})));

async function threeViews(locator) {
  const all = await snapshots(locator);
  assert.deepEqual(all.map(({viewBox}) => viewBox), viewBoxes);
  for (const {markup} of all) assert.match(markup, /data-adult-body="adult-[hf]"/);
  return all;
}

async function intermediate(page, id, fraction) {
  const range = control(page, id);
  const {width, height} = await range.boundingBox();
  await range.tap({position: {x: Math.round(width * fraction), y: Math.round(height / 2)}});
  const value = Number(await range.inputValue());
  assert(value > 0 && value < 100, id + ' · ' + value);
  return value;
}

async function exportWorkshop(page) {
  await control(page, 'workshop-archive-link').tap();
  await control(page, 'appearance-export').tap();
  assert.equal(await control(page, 'appearance-error').textContent(), '');
  assert.match(await control(page, 'appearance-message').textContent(), /archive atelier exportée/i);
  return JSON.parse(await control(page, 'appearance-json').inputValue());
}

async function importWorkshop(page, data) {
  await control(page, 'workshop-archive-link').tap();
  await control(page, 'appearance-json').fill(JSON.stringify(data));
  await control(page, 'appearance-import').tap();
  assert.equal(await control(page, 'appearance-error').textContent(), '');
}

async function thorax(page) {
  await nav(page, 'atelier-thorax');
  await base(page, 'f');
  assert.equal(await control(page, 'chest-volume').evaluate(el => el === document.activeElement), true);
  const fVolume = await intermediate(page, 'chest-volume', .61);
  assert.equal(await page.locator('#chest-controls input:enabled').count(), 6);
  const fWidth = await intermediate(page, 'chest-width', .34);
  assert.notEqual(fWidth, 50);
  await control(page, 'chest-volume').press('End');
  assert.equal(await control(page, 'chest-volume').inputValue(), '100');
  await control(page, 'chest-volume').press('Home');
  assert.equal(await control(page, 'chest-volume').inputValue(), '0');
  assert.equal(await page.locator('#chest-controls input:disabled').count(), 5);

  await base(page, 'h');
  const hVolume = await intermediate(page, 'pectoral-volume', .65);
  assert.equal(await page.locator('#pectoral-controls input:enabled').count(), 5);
  const hWidth = await intermediate(page, 'pectoral-width', .78);
  assert.notEqual(hWidth, 55);
  await control(page, 'pectoral-volume').press('Home');
  assert.equal(await page.locator('#pectoral-controls input:disabled').count(), 4);
  await control(page, 'pectoral-volume').press('End');
  assert.equal(await control(page, 'pectoral-volume').inputValue(), '100');
  for (let cycle = 0; cycle < 3; cycle++) {
    await base(page, 'f');
    assert.equal(Number(await control(page, 'chest-width').inputValue()), fWidth);
    assert.equal(await control(page, 'chest-width').isDisabled(), true);
    await control(page, 'chest-volume').press('End');
    assert.equal(await control(page, 'chest-width').isEnabled(), true);
    assert.equal(Number(await control(page, 'chest-width').inputValue()), fWidth);
    await control(page, 'chest-volume').press('Home');
    await base(page, 'h');
    assert.equal(Number(await control(page, 'pectoral-width').inputValue()), hWidth);
  }

  const archives = [];
  for (const body of ['h', 'f']) {
    await base(page, body);
    const document = await exportWorkshop(page);
    assert.equal(document.schema, 'microcosme.workshop');
    assert.equal(document.renderProfile, 'bio-corps-06-r02-svg@1');
    assert.equal(document.active.character.body, 'adult-' + body);
    const h = body === 'h' ? document.active.character : document.inactiveBodies['adult-h'];
    const f = body === 'f' ? document.active.character : document.inactiveBodies['adult-f'];
    assert.equal(h.pectorals.width, hWidth);
    assert.equal(h.pectorals.volume, 100);
    assert.equal(f.chest.width, fWidth);
    assert.equal(f.chest.volume, 0);
    archives.push({body, document, views: await threeViews(page.locator('#comparison [data-side=after] svg'))});
  }
  return {archives, fWidth, hWidth, fVolume, hVolume};
}

async function restoreThorax(browser, url, startup, thoraxState) {
  for (const {body, document, views} of thoraxState.archives) {
    const {page, context, errors} = await ready(browser, url, startup);
    try {
      await importWorkshop(page, document);
      assert.equal(await control(page, 'body').inputValue(), 'adult-' + body);
      assert.deepEqual(await threeViews(page.locator('#comparison [data-side=after] svg')), views);
      assert.deepEqual(await exportWorkshop(page), document);
      await base(page, 'f');
      assert.equal(await control(page, 'chest-width').isDisabled(), true);
      await control(page, 'chest-volume').press('End');
      assert.equal(await control(page, 'chest-width').isEnabled(), true);
      assert.equal(Number(await control(page, 'chest-width').inputValue()), thoraxState.fWidth);
      await control(page, 'chest-volume').press('Home');
      await base(page, 'h');
      assert.equal(Number(await control(page, 'pectoral-width').inputValue()), thoraxState.hWidth);

      const active = await exportWorkshop(page);
      for (const text of ['{', JSON.stringify({...active, inactiveBodies: {'adult-h': {}}}),
        JSON.stringify({...active, active: {...active.active, facialHair: {mode:'historical', category:''}}})]) {
        await control(page, 'appearance-json').fill(text);
        await control(page, 'appearance-import').tap();
        assert.match(await control(page, 'appearance-error').textContent(), /apparence non chargée/i);
        assert.deepEqual(await exportWorkshop(page), active);
      }
      await importWorkshop(page, document.active);
      assert.match(await control(page, 'appearance-message').textContent(), /archive historique/i);
      assert.deepEqual((await exportWorkshop(page)).inactiveBodies, {});
      assert.deepEqual(errors, []);
    } finally {
      await context.close();
    }
  }
}

async function beardArchives(page) {
  await base(page, 'h');
  await nav(page, 'beard');
  await control(page, 'beard-seed').fill('BIO-SOCLE-02-R02 · pilosité');
  await control(page, 'beard-random').tap();
  const original = (await exportWorkshop(page)).active.facialHair;
  assert.equal(original.category, 'H');
  assert.equal(original.mode, 'custom');
  assert.equal(original.draw.seed, 'BIO-SOCLE-02-R02 · pilosité');
  const archives = [];

  for (const body of ['h', 'f']) {
    await base(page, body);
    for (const category of ['H', 'F', 'T']) {
      await control(page, 'beard-category').selectOption(category);
      const document = await exportWorkshop(page);
      const hair = document.active.facialHair;
      assert.equal(hair.category, category);
      assert.deepEqual(hair.requested, original.requested);
      assert.deepEqual(hair.draw, original.draw);
      if (category === 'F') {
        assert.equal(await control(page, 'beard-active').isDisabled(), true);
        assert(Object.values(hair.effective.zones).every(value => !value));
      }
      archives.push(document);
    }
  }

  const category = control(page, 'beard-category');
  await category.selectOption('F');
  const intact = await exportWorkshop(page);
  // Reproduce the two observed failure paths at the DOM boundary.
  await category.evaluate(select => { select.options[select.selectedIndex].textContent = 'Libellé traduit'; });
  assert.equal(await category.inputValue(), 'F');
  assert.deepEqual(await exportWorkshop(page), intact);
  await category.evaluate(select => { select.selectedIndex = -1; });
  assert.equal(await category.inputValue(), '');
  assert.deepEqual(await exportWorkshop(page), intact);
  assert.equal(await category.inputValue(), 'F');

  await category.selectOption('T');
  await control(page, 'beard-active').uncheck();
  const latent = await exportWorkshop(page);
  assert.deepEqual(latent.active.facialHair.latent, original.requested);
  assert.deepEqual(latent.active.facialHair.draw, original.draw);
  archives.push(latent);
  return archives;
}

async function restoreBeards(browser, url, startup, archives) {
  const {page, context, errors} = await ready(browser, url, startup);
  try {
    for (const archive of archives) {
      await importWorkshop(page, archive);
      assert.equal(await control(page, 'beard-category').inputValue(), archive.active.facialHair.category);
      assert.deepEqual(await exportWorkshop(page), archive);
    }
    await control(page, 'beard-active').check();
    const active = (await exportWorkshop(page)).active.facialHair;
    assert.deepEqual(active.requested, archives.at(-1).active.facialHair.latent);
    assert.deepEqual(errors, []);
  } finally {
    await context.close();
  }
}

async function residentArchives(page) {
  await nav(page, 'resident-preview');
  const panel = control(page, 'resident-preview');
  const archives = [];
  for (const [value, id] of [['0', 'temoin-f-01'], ['1', 'temoin-h-01']]) {
    await panel.locator('select').selectOption(value);
    await control(page, 'resident-open').tap();
    assert.equal(await panel.locator('output').textContent(), id);
    await panel.locator('summary').tap();
    assert.equal(await panel.locator('pre').isVisible(), true);
    await control(page, 'resident-export').tap();
    const json = await control(page, 'resident-archive').inputValue();
    assert.equal(JSON.parse(json).identity.id, id);
    assert.deepEqual(JSON.parse(await panel.locator('pre').textContent()), JSON.parse(json));
    archives.push({id, json, views: await threeViews(panel.locator('.resident-views svg'))});
    await panel.locator('summary').tap();
  }
  await panel.locator('select').evaluate(select => { select.selectedIndex = -1; });
  await control(page, 'resident-open').tap();
  assert.match(await panel.locator('[role=alert]').textContent(), /choisissez un témoin/i);
  assert.equal(await panel.locator('output').textContent(), archives.at(-1).id);
  assert.deepEqual(await threeViews(panel.locator('.resident-views svg')), archives.at(-1).views);
  return archives;
}

async function restoreResidents(browser, url, startup, archives) {
  for (const {id, json, views} of archives) {
    const {page, context, errors} = await ready(browser, url, startup);
    try {
      await nav(page, 'resident-preview');
      const panel = control(page, 'resident-preview');
      const archive = control(page, 'resident-archive');
      await archive.fill(json);
      await control(page, 'resident-import').tap();
      assert.equal(await panel.locator('output').textContent(), id);
      assert.match(await panel.locator('[role=status]').textContent(), /identité et caractéristiques identiques/i);
      assert.deepEqual(await threeViews(panel.locator('.resident-views svg')), views);
      await control(page, 'resident-export').tap();
      assert.deepEqual(JSON.parse(await archive.inputValue()), JSON.parse(json));
      for (const invalid of ['{', '{"schema":"microcosme.adult-resident"}']) {
        await archive.fill(invalid);
        await control(page, 'resident-import').tap();
        assert.match(await panel.locator('[role=alert]').textContent(), /habitant non chargé/i);
        assert.equal(await panel.locator('output').textContent(), id);
        assert.deepEqual(await threeViews(panel.locator('.resident-views svg')), views);
      }
      assert.deepEqual(errors, []);
    } finally {
      await context.close();
    }
  }
}

async function run(name, url) {
  const browser = await engines[name].launch();
  try {
    const manifest = await verifyBuild(browser, url);
    const {page, context, errors} = await ready(browser, url, manifest.startup);
    const body = await thorax(page);
    const beard = await beardArchives(page);
    const residents = await residentArchives(page);
    assert.deepEqual(errors, []);
    await context.close();

    await restoreThorax(browser, url, manifest.startup, body);
    await restoreBeards(browser, url, manifest.startup, beard);
    await restoreResidents(browser, url, manifest.startup, residents);
    return {
      name, version: browser.version(), device: 'iPad Mini simulé', sourceCommit: manifest.sourceCommit,
      startFile: manifest.startup, bodyColdRestores: body.archives.length,
      beardArchives: beard.length, residentColdRestores: residents.length,
      invalidWorkshopImports: body.archives.length * 3, invalidResidentImports: residents.length * 2,
      recoveredSelects: 2, rejectedEmptyWitnessSelection: 1,
      thorax: {fVolume: body.fVolume, fWidth: body.fWidth, hVolume: body.hVolume, hWidth: body.hWidth}
    };
  } finally {
    await browser.close();
  }
}

async function main() {
  const directory = process.env.PREVIEW_DIR && resolve(process.env.PREVIEW_DIR);
  let baseURL = process.env.PREVIEW_URL;
  if (!baseURL && !directory) throw new Error('Indiquez PREVIEW_DIR ou PREVIEW_URL.');
  const server = createServer(async (request, response) => {
    const pathname = new URL(request.url, 'http://localhost').pathname;
    const name = pathname === prefix ? 'index.html' : pathname.slice(prefix.length);
    const type = files[name] ?? (/^atelier-[\da-f]+\.js$/.test(name) ? 'text/javascript' : null);
    if (!pathname.startsWith(prefix) || !type) return response.writeHead(404).end();
    try {
      const data = await readFile(join(directory, name));
      response.writeHead(200, {'Content-Type': type}).end(data);
    } catch {
      response.writeHead(404).end();
    }
  });
  if (!baseURL) {
    await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
    baseURL = 'http://127.0.0.1:' + server.address().port + prefix;
  }
  try {
    const report = [];
    for (const name of (process.env.BROWSER ?? 'chromium,webkit').split(',')) report.push(await run(name, baseURL));
    const result = JSON.stringify(report, null, 2) + '\n';
    if (process.env.ARTIFACT_DIR) {
      await mkdir(process.env.ARTIFACT_DIR, {recursive: true});
      await writeFile(join(process.env.ARTIFACT_DIR, 'recette.json'), result);
    }
    console.log(result);
  } finally {
    if (server.listening) server.close();
  }
}

main().catch(error => { console.error(error); process.exitCode = 1; });
