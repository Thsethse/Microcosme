const assert = require('node:assert/strict');
const {createHash} = require('node:crypto');
const {readFile} = require('node:fs/promises');
const {createServer} = require('node:http');
const {join} = require('node:path');
const {chromium, webkit, devices} = require('playwright');

const types = {html: 'text/html', css: 'text/css', json: 'application/json', js: 'text/javascript'};
const prefix = '/Microcosme/preview/bio-epure-03-l03-r01/';
const assets = /^(index\.html|style\.css|version\.json|study-[\da-f]{16}\.js)$/;

async function manifest(context, url) {
  const response = await context.request.get(new URL('version.json', url).href);
  assert.equal(response.status(), 200);
  const data = await response.json();
  assert.equal(data.mission, 'BIO-EPURE-03-L03-R01');
  assert.match(data.sourceCommit, /^[a-f\d]{40}$/);
  if (process.env.PREVIEW_SOURCE) assert.equal(data.sourceCommit, process.env.PREVIEW_SOURCE);
  assert.match(data.startup, /^study-[\da-f]{16}\.js$/);
  assert.deepEqual(Object.keys(data.files).sort(), ['index.html', 'style.css', data.startup].sort());
  for (const [file, digest] of Object.entries(data.files)) {
    const resource = await context.request.get(new URL(file, url).href);
    assert.equal(resource.status(), 200, file);
    assert.equal(createHash('sha256').update(await resource.body()).digest('hex'), digest, file);
  }
  return data;
}

async function verifyFrame(page) {
  const old = page.locator('#anchor-old svg'), recent = page.locator('#anchor-new svg');
  const markup = (locator, id) => locator.evaluate((svg, id) => svg.outerHTML.replaceAll(id, 'anchor-shared'), id);
  assert.equal(await markup(old, 'anchor-old'), await markup(recent, 'anchor-new'));
  assert(await old.locator('[data-brow-side]').count() > 0);
  const first = await old.boundingBox(), second = await recent.boundingBox();
  assert(Math.abs(first.width - second.width) < 0.05);
  assert(Math.abs(first.height - second.height) < 0.05);
  assert(Math.abs(first.y - second.y) < 0.05);
  assert(first.width > 120 && second.x > first.x);
  assert(await page.evaluate(() => document.documentElement.scrollWidth === window.innerWidth));
}

async function run(engine, url) {
  const browser = await engine.launch();
  try {
    const context = await browser.newContext(devices['iPad Mini']);
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    page.on('requestfailed', request => errors.push(request.url() + ' ' + request.failure().errorText));
    const info = await manifest(context, url);
    assert.equal((await page.goto(url)).status(), 200);
    await page.locator('#anchor-old svg').waitFor();
    const selection = page.locator('#scenario');
    const scenarios = await selection.locator('option').evaluateAll(options => options.map(option => option.value));
    assert.equal(scenarios.length, 9);
    const close = page.getByRole('button', {name: 'Gros plan'});
    const face = page.getByRole('button', {name: 'Visage entier'});
    for (const scenario of scenarios) {
      await selection.selectOption(scenario);
      await close.tap();
      assert.equal(await close.getAttribute('aria-pressed'), 'true');
      await verifyFrame(page);
      assert.deepEqual(await page.locator('#historical strong').allTextContents(), ['0', '6', '25', '50', '75', '100'].map(n => n + ' %'));
      assert.deepEqual(await page.locator('#proposed strong').allTextContents(), ['0', '25', '50', '75', '100'].map(n => n + ' %'));
      const closeBox = await page.locator('#anchor-old svg').getAttribute('viewBox');
      await face.tap();
      assert.equal(await face.getAttribute('aria-pressed'), 'true');
      assert.notEqual(await page.locator('#anchor-old svg').getAttribute('viewBox'), closeBox);
      await verifyFrame(page);
    }
    for (const viewport of [{width: 1024, height: 768}, {width: 390, height: 844}]) {
      await page.setViewportSize(viewport);
      await selection.selectOption('thin-h');
      assert.match(await page.locator('#range').textContent(), /0,528.*Vers/);
      await close.tap();
      await verifyFrame(page);
      await selection.selectOption('ipad-f');
      assert.match(await page.locator('#range').textContent(), /plateau/);
      await verifyFrame(page);
    }
    assert.deepEqual(errors, []);
    return {engine: engine.name(), version: browser.version(), scenarios: scenarios.length, crops: 2,
      viewports: [devices['iPad Mini'].viewport, {width: 1024, height: 768}, {width: 390, height: 844}],
      source: info.sourceCommit, checksums: Object.keys(info.files).length};
  } finally {
    await browser.close();
  }
}

async function main() {
  const {PREVIEW_DIR, PREVIEW_URL} = process.env;
  if (!PREVIEW_DIR && !PREVIEW_URL) throw new Error('Indiquez PREVIEW_DIR ou PREVIEW_URL.');
  const server = createServer(async (request, response) => {
    if (!request.url.startsWith(prefix)) return response.writeHead(404).end();
    const file = request.url.slice(prefix.length) || 'index.html';
    if (!assets.test(file)) return response.writeHead(404).end();
    try {
      const content = await readFile(join(PREVIEW_DIR, file));
      response.writeHead(200, {'Content-Type': types[file.split('.').at(-1)]}).end(content);
    } catch {
      response.writeHead(404).end();
    }
  });
  if (!PREVIEW_URL) await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const url = PREVIEW_URL ?? `http://127.0.0.1:${server.address().port}${prefix}`;
  try {
    for (const engine of [chromium, webkit]) console.log(JSON.stringify(await run(engine, url)));
  } finally {
    if (server.listening) server.close();
  }
}

main().catch(error => { console.error(error); process.exitCode = 1; });
