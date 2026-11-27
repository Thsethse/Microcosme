const assert = require('node:assert/strict');
const {createServer} = require('node:http');
const {readFile, mkdir} = require('node:fs/promises');
const {join, resolve} = require('node:path');
const {chromium, devices, webkit} = require('playwright');

const engines = {chromium, webkit};
const files = {'index.html': 'text/html', 'style.css': 'text/css', 'version.json': 'application/json'};
const prefix = '/preview/bio-socle-02-r01/';

async function ready(context, url) {
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('response', response => { if (!response.ok()) errors.push(response.url() + ' ' + response.status()); });
  assert.equal((await page.goto(url)).status(), 200);
  await page.waitForFunction(() => document.querySelector('#atelier').dataset.startup === 'ready');
  return {page, errors};
}

async function change(page, id, value) {
  await page.locator('#' + id).evaluate((input, value) => {
    input.value = value;
    input.dispatchEvent(new Event('input', {bubbles: true}));
  }, value);
}

async function run(name, url) {
  const browser = await engines[name].launch();
  try {
    let context = await browser.newContext(devices['iPad Mini']);
    const first = await ready(context, url);
    const page = first.page;
    const base = (page, body) => page.locator(`[data-thorax-body="adult-${body}"]`).tap();
    await base(page, 'f');
    await page.locator('#chest-volume').tap();
    assert.equal(await page.locator('#chest-controls input:enabled').count(), 6);
    await change(page, 'chest-width', 38.125);
    await change(page, 'chest-volume', 0);
    assert.equal(await page.locator('#chest-controls input:disabled').count(), 5);
    await base(page, 'h');
    await page.locator('#pectoral-volume').tap();
    assert.equal(await page.locator('#pectoral-controls input:enabled').count(), 5);
    await change(page, 'pectoral-volume', 61.25);
    await change(page, 'pectoral-width', 76.25);
    await base(page, 'f');
    assert.equal(await page.locator('#chest-width').inputValue(), '38.125');
    await base(page, 'h');
    await page.locator('#workshop-archive-link').tap();
    await page.locator('#appearance-export').tap();
    const archive = await page.locator('#appearance-json').inputValue();
    const saved = JSON.parse(archive);
    assert.equal(saved.active.character.pectorals.width, 76.25);
    assert.equal(saved.inactiveBodies['adult-f'].chest.width, 38.125);
    assert.equal(saved.renderProfile, 'bio-corps-06-r02-svg@1');

    const panel = page.locator('#resident-preview');
    await panel.locator('select').selectOption('1');
    await panel.locator('#resident-open').tap();
    await panel.locator('#resident-export').tap();
    const resident = await panel.locator('textarea').inputValue();
    const snapshot = panel => panel.locator('.resident-views svg').evaluateAll(svgs =>
      svgs.map(svg => svg.outerHTML.replaceAll(/resident-\d+/g, 'stable')));
    const original = await snapshot(panel);
    assert.equal(original.length, 3);
    assert.deepEqual(first.errors, []);
    await context.close();

    context = await browser.newContext(devices['iPad Mini']);
    const second = await ready(context, url);
    const cold = second.page;
    await cold.locator('#workshop-archive-link').tap();
    await cold.locator('#appearance-json').fill(archive);
    await cold.locator('#appearance-import').tap();
    assert.equal(await cold.locator('#appearance-error').textContent(), '');
    assert.equal(await cold.locator('#pectoral-width').inputValue(), '76.25');
    await base(cold, 'f');
    assert.equal(await cold.locator('#chest-width').inputValue(), '38.125');
    assert.equal(await cold.locator('#chest-width').isDisabled(), true);
    await change(cold, 'chest-volume', 65);
    assert.equal(await cold.locator('#chest-width').isEnabled(), true);
    await base(cold, 'h');
    assert.equal(await cold.locator('#pectoral-width').inputValue(), '76.25');

    const restored = cold.locator('#resident-preview');
    assert.equal(await restored.locator('output').textContent(), 'temoin-f-01');
    await restored.locator('textarea').fill(resident);
    await restored.locator('#resident-import').tap();
    assert.equal(await restored.locator('output').textContent(), 'temoin-h-01');
    assert.match(await restored.locator('[role=status]').textContent(), /identité et caractéristiques identiques/i);
    assert.deepEqual(await snapshot(restored), original);
    await restored.locator('textarea').fill('{"schema":"microcosme.adult-resident"}');
    await restored.locator('#resident-import').tap();
    assert.match(await restored.locator('[role=alert]').textContent(), /habitant non chargé/i);
    assert.deepEqual(await snapshot(restored), original);
    if (process.env.ARTIFACT_DIR) {
      await mkdir(process.env.ARTIFACT_DIR, {recursive: true});
      await restored.locator('.resident-views').screenshot({path: join(process.env.ARTIFACT_DIR, name + '-habitants.png')});
    }
    assert.deepEqual(second.errors, []);
    console.log(name + ' ' + browser.version() + ' · profil tactile iPad Mini simulé · recette réussie');
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
    for (const name of (process.env.BROWSER ?? 'chromium,webkit').split(',')) await run(name, baseURL);
  } finally {
    server.close();
  }
}

main().catch(error => { console.error(error); process.exitCode = 1; });
