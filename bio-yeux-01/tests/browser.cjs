const {chromium, webkit} = require('playwright');
const {createServer} = require('node:http');
const {readFile, mkdir, writeFile} = require('node:fs/promises');
const path = require('node:path');
const assert = require('node:assert/strict');

const root = path.resolve(__dirname, '../..');
const output = process.env.ARTIFACT_DIR || '/tmp/microcosme-bio-yeux-01';
const presets = ['round', 'oval', 'almond', 'narrow', 'upturned', 'downturned', 'heavy', 'crescent'];
const sizes = [{width: 820, height: 1180}, {width: 1180, height: 820}, {width: 390, height: 844}];
const types = {'.html': 'text/html', '.mjs': 'text/javascript', '.css': 'text/css', '.json': 'application/json'};

async function localServer() {
  const server = createServer(async (request, response) => {
    try {
      const url = new URL(request.url, 'http://localhost');
      const file = path.resolve(root, '.' + decodeURIComponent(url.pathname) + (url.pathname.endsWith('/') ? 'index.html' : ''));
      if (!file.startsWith(root + path.sep)) throw new Error('Path outside repository');
      const body = await readFile(file);
      response.writeHead(200, {'Content-Type': types[path.extname(file)] || 'application/octet-stream'}).end(body);
    } catch {
      response.writeHead(404).end();
    }
  });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  return server;
}

async function checkTouch(page, selector, position) {
  const slider = page.locator(selector);
  await slider.scrollIntoViewIfNeeded();
  const box = await slider.boundingBox();
  assert(box, selector);
  await page.touchscreen.tap(box.x + box.width * position, box.y + box.height / 2);
}

async function inspect(page, name, base) {
  const errors = [], failed = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
  page.on('requestfailed', request => failed.push(request.url() + ' ' + request.failure()?.errorText));
  page.on('response', response => { if (response.status() >= 400) failed.push(response.status() + ' ' + response.url()); });
  const response = await page.goto(base, {waitUntil: 'networkidle'});
  assert.equal(response.status(), 200);
  await page.waitForSelector('#comparison svg');
  const raw = () => page.locator('#selection-json').inputValue();
  const after = () => page.locator('#comparison [data-side=after] .head svg').evaluate(svg =>
    svg.outerHTML.replace(/atelier-yeux-\d+/g, 'same'));
  const before = () => page.locator('#comparison [data-side=before] .head svg').evaluate(svg =>
    svg.outerHTML.replace(/atelier-yeux-\d+/g, 'same'));
  const form = () => page.locator('#comparison').getAttribute('data-eyes');
  const select = async id => {
    await page.locator('#eye-preset').selectOption(id);
    assert.equal(await form(), id);
  };
  assert.equal(await page.locator('#eye-controls input[type=range]').count(), 8);
  assert.equal(await page.locator('#ordinary option').count(), 120);
  assert.equal(await page.locator('#historical option').count(), 126);
  assert.equal(await page.locator('#body option').count(), 6);
  assert.equal(await after(), await before());

  const inherited = await raw();
  for (const id of presets) {
    await select(id);
    assert.equal(await page.locator('#comparison [data-bio-eye]').count(), 6);
  }
  await select('round');
  const starting = await page.locator('#eye-width').inputValue();
  await checkTouch(page, '#eye-width', 0.1);
  await page.waitForFunction(() => document.querySelector('#comparison').dataset.eyes === 'custom');
  assert.notEqual(await page.locator('#eye-width').inputValue(), starting);
  await page.locator('#eye-taper').press('End');
  await page.waitForFunction(() => document.querySelector('output[for=eye-taper]').textContent === 'Pointu');
  await select('maximum');
  assert.match(await page.locator('output[for=eye-height]').textContent(), /130 % →/);
  assert.equal(await raw(), inherited);

  await page.locator('#seed').fill('Tirage Safari iPad');
  await page.locator('#random-eyes').tap();
  assert.equal(await form(), 'custom');
  const draw = await after();
  await page.locator('#reset-eyes').tap();
  assert.equal(await form(), 'historical');
  assert.equal(await after(), await before());
  await page.locator('#random-eyes').tap();
  assert.equal(await after(), draw);
  assert.equal(await raw(), inherited);

  await page.locator('#eye-guides').check();
  assert.equal(await page.locator('#comparison [data-eye-envelopes]').count(), 6);
  await page.locator('#eye-guides').uncheck();
  for (const morph of ['min', 'max', 'ipad', 'tall', 'broad', 'neutral']) {
    await page.locator('#morph').selectOption(morph);
    assert.equal(await form(), 'custom');
  }
  await page.locator('#morph-panel summary').tap();
  assert.equal(await page.locator('#morph-controls input[type=range]').count(), 8);
  await checkTouch(page, '#morph-cheek_width', 0.85);
  assert.notEqual(await page.locator('#morph-cheek_width').inputValue(), '1');
  await page.locator('#morph').selectOption('neutral');
  await page.locator('#morph-panel summary').tap();
  await page.locator('#historical').selectOption('p5-061:G');
  await page.locator('#load-history').tap();
  assert.equal(await page.locator('#ordinary').inputValue(), 'p5-056:G');
  assert.equal(await page.locator('#comparison [data-side=after] .head [data-feature=loose-lock]').count(), 2);
  await page.locator('#choose-ordinary').tap();
  assert.equal(JSON.parse(await raw()).style, 'p5-056');
  await page.locator('#body').selectOption('bust');
  await page.locator('#accessories').uncheck();
  await page.locator('#contrast').uncheck();
  await page.locator('[data-category=fantasy]').tap();
  assert.equal(await page.locator('#swatches button').count(), 12);
  await page.locator('[data-colour=bleu-vif]').tap();
  const coloured = await before(), saved = await raw();
  await page.locator('#reset-eyes').tap();
  assert.equal(await after(), coloured);
  assert.equal(await raw(), saved);
  await page.locator('#json-panel summary').tap();
  await page.locator('#reload').tap();
  assert.equal(await raw(), saved);
  await page.locator('#json-panel summary').tap();
  await page.locator('#series-panel summary').tap();
  await page.waitForSelector('#series-grid .card');
  assert.equal(await page.locator('#series-grid .card').count(), 26);
  await page.locator('#series-panel summary').tap();
  await page.locator('#variety-panel summary').tap();
  await page.waitForSelector('#variety-grid .card');
  assert.equal(await page.locator('#variety-grid .card').count(), 16);
  await page.locator('#variety-panel summary').tap();

  await page.locator('#ordinary').selectOption('p5-038:G');
  await page.locator('#body').selectOption('standard');
  await page.locator('#flat-mode').uncheck();
  await select('maximum');
  const layouts = [];
  for (const viewport of sizes) {
    await page.setViewportSize(viewport);
    const metrics = await page.evaluate(() => {
      const bounds = selector => document.querySelector(selector).getBoundingClientRect();
      return {
        width: innerWidth, documentWidth: document.documentElement.scrollWidth,
        head: bounds('[data-side=after] .head svg').height,
        body: bounds('[data-side=after] .tile svg').height,
        miniature: [bounds('[data-side=after] .mini svg').width, bounds('[data-side=after] .mini svg').height]
      };
    });
    assert(metrics.documentWidth <= viewport.width + 1, JSON.stringify(metrics));
    assert.deepEqual([metrics.head, metrics.body, metrics.miniature], [300, 178, [70, 70]]);
    layouts.push(metrics);
  }

  // Rasterise the actual openings at the three preview scales in each browser.
  // Retain only the eye groups so foreground hair cannot obscure the measurement.
  const raster = await page.evaluate(async () => {
    const selector = document.querySelector('#eye-preset');
    const options = ['round','oval','almond','narrow','upturned','downturned','heavy','crescent','minimum','maximum'];
    const dimensions = {head: [300, 300], tile: [178, 178], mini: [70, 70]};
    const signatures = {head: new Set(), tile: new Set(), mini: new Set()};
    const minPixels = {head: Infinity, tile: Infinity, mini: Infinity};
    const minPupilPixels = {head: Infinity, tile: Infinity, mini: Infinity};
    let cases = 0;
    for (const id of options) {
      selector.value = id;
      selector.dispatchEvent(new Event('change'));
      for (const [view, [width, height]] of Object.entries(dimensions)) {
        const svg = document.querySelector('#comparison [data-side=after] .' + view + ' svg').cloneNode(true);
        const eyes = [...svg.querySelectorAll('[data-bio-eye]')];
        svg.replaceChildren(...eyes);
        svg.setAttribute('width', width);
        svg.setAttribute('height', height);
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        const rasterize = async () => {
          const image = new Image();
          image.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(new XMLSerializer().serializeToString(svg));
          await image.decode();
          ctx.clearRect(0, 0, width, height);
          ctx.drawImage(image, 0, 0);
          return ctx.getImageData(0, 0, width, height).data;
        };
        const outline = await rasterize();
        signatures[view].add(canvas.toDataURL());
        let pixels = 0, pupilPixels = 0;
        for (let i = 3; i < outline.length; i += 4) if (outline[i] > 32) pixels++;
        // Keep clipPath geometry, remove only the painted whites and strokes.
        // The remaining dark pixels belong to the original, clipped pupils.
        svg.querySelectorAll('[data-bio-eye] > path').forEach(path => path.remove());
        const pupils = await rasterize();
        for (let i = 3; i < pupils.length; i += 4) if (pupils[i] > 96) pupilPixels++;
        minPixels[view] = Math.min(pixels, minPixels[view]);
        minPupilPixels[view] = Math.min(pupilPixels, minPupilPixels[view]);
        cases++;
      }
    }
    return {cases, minPixels, minPupilPixels, signatures: Object.fromEntries(Object.entries(signatures).map(([key, values]) => [key, values.size]))};
  });
  assert.deepEqual(raster.signatures, {head: 10, tile: 10, mini: 10});
  assert(Object.values(raster.minPixels).every(count => count >= 4));
  assert(Object.values(raster.minPupilPixels).every(count => count >= 1));

  await page.setViewportSize(sizes[1]);
  await page.locator('#planche').screenshot({path: path.join(output, name + '-planche.png')});
  await page.setViewportSize(sizes[0]);
  await select('maximum');
  await page.locator('#eye-guides').check();
  await page.locator('.comparison-panel').screenshot({path: path.join(output, name + '-extreme-maximum.png')});
  await select('minimum');
  await page.locator('#eye-guides').uncheck();
  await page.locator('.comparison-panel').screenshot({path: path.join(output, name + '-extreme-minimum.png')});
  await page.locator('[data-eye-form=upturned]').tap();
  assert.equal(await form(), 'upturned');
  assert.deepEqual(failed, []);
  assert.deepEqual(errors, []);
  return {layouts, raster, errors, failed};
}

(async () => {
  await mkdir(output, {recursive: true});
  const server = process.env.BASE_URL ? null : await localServer();
  const base = process.env.BASE_URL || `http://127.0.0.1:${server.address().port}/bio-yeux-01/`;
  const results = {url: base, engines: []};
  try {
    for (const [name, engine] of Object.entries({chromium, webkit})) {
      const browser = await engine.launch();
      try {
        const page = await browser.newPage({viewport: sizes[0], hasTouch: true, isMobile: true, deviceScaleFactor: 1});
        const result = {engine: name, version: browser.version(), ...await inspect(page, name, base)};
        results.engines.push(result);
        console.log(JSON.stringify(result));
      } finally {
        await browser.close();
      }
    }
    await writeFile(path.join(output, 'results.json'), JSON.stringify(results, null, 2) + '\n');
  } finally {
    server?.close();
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
