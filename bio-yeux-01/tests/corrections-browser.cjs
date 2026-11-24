const assert = require('node:assert/strict');
const {createServer} = require('node:http');
const {readFile, mkdir, writeFile} = require('node:fs/promises');
const path = require('node:path');
const {chromium, webkit} = require('playwright');

const root = path.resolve(__dirname, '../..');
const output = process.env.ARTIFACT_DIR ?? '/tmp/microcosme-inv-corrections';
const engines = {chromium, webkit};
const types = {'.html': 'text/html', '.mjs': 'text/javascript', '.css': 'text/css', '.json': 'application/json'};

async function localSite() {
  const server = createServer(async (request, response) => {
    try {
      const url = new URL(request.url, 'http://localhost');
      const file = path.resolve(root, '.' + decodeURIComponent(url.pathname) + (url.pathname.endsWith('/') ? 'index.html' : ''));
      if (!file.startsWith(root + path.sep)) throw new Error('Ressource hors du dépôt.');
      const body = await readFile(file);
      response.writeHead(200, {'Content-Type': types[path.extname(file)] ?? 'application/octet-stream'}).end(body);
    } catch {
      response.writeHead(404).end();
    }
  });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  return server;
}

async function snapshot(page, selector = '[data-side=after]') {
  return page.locator(selector + ' svg').evaluateAll(async svgList => {
    return Promise.all(svgList.map(async (svg, i) => {
      const text = new XMLSerializer().serializeToString(svg).replace(/atelier-yeux-\d+/g, 'inv');
      const size = [300, 178, 70][i];
      const content = text.replace('<svg ', `<svg width="${size}" height="${size}" `);
      const image = new Image();
      image.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(content);
      await image.decode();
      const c = document.createElement('canvas'); c.width = c.height = size;
      const ctx = c.getContext('2d');
      ctx.fillStyle = document.querySelector('#background').value === 'dark' ? '#474c55' : '#fffdf8';
      ctx.fillRect(0, 0, size, size);
      ctx.drawImage(image, 0, 0, size, size);
      return {text, pixels: c.toDataURL()};
    }));
  });
}

async function testArchive(page, base) {
  await page.locator('#historical').selectOption('p5-061:G');
  await page.locator('#load-history').tap();
  await page.locator('#body').selectOption('bust');
  await page.locator('#morph').selectOption('tall');
  await page.locator('[data-category=fantasy]').tap();
  await page.locator('[data-colour=bleu-vif]').tap();
  await page.locator('#seed').fill('archive-bio-inv');
  const tapStart = Date.now();
  await page.locator('#random-eyes').tap();
  await page.waitForFunction(() => document.querySelector('#comparison').dataset.eyes === 'custom');
  const buttonMs = Date.now() - tapStart;
  const prior = await snapshot(page);
  await page.locator('#appearance-panel summary').tap();
  await page.locator('#appearance-export').tap();
  const text = await page.locator('#appearance-json').inputValue();
  const saved = JSON.parse(text);
  assert.deepEqual([saved.character.style, saved.character.arrangement, saved.character.body], ['p5-061', 'G', 'bust']);
  assert.equal(saved.palette.colour, 'bleu-vif');
  assert.equal(saved.palette.mode, 'flat');
  assert.equal(saved.eyes.draw.seed, 'archive-bio-inv');
  await page.reload();
  await page.locator('#appearance-panel summary').tap();
  await page.locator('#appearance-json').fill(text);
  await page.locator('#appearance-import').tap();
  assert.deepEqual(await snapshot(page), prior);
  assert.equal(await page.locator('#ordinary').inputValue(), 'p5-056:G');
  assert.equal(await page.locator('#seed').inputValue(), 'archive-bio-inv');
  await page.locator('#appearance-export').tap();
  assert.deepEqual(JSON.parse(await page.locator('#appearance-json').inputValue()), saved);
  await page.locator('#appearance-json').fill(text.replace(saved.renderer, 'future-version'));
  await page.locator('#appearance-import').tap();
  assert.match(await page.locator('#appearance-error').textContent(), /version de rendu/i);
  assert.deepEqual(await snapshot(page), prior);

  await page.locator('#reset-eyes').tap();
  await page.locator('#flat-mode').uncheck();
  await page.locator('#appearance-export').tap();
  const historical = JSON.parse(await page.locator('#appearance-json').inputValue());
  assert.equal(historical.eyes.mode, 'historical');
  assert.deepEqual(historical.palette, {colour: 'bleu-vif', mode: 'historical'});
  assert.deepEqual(await snapshot(page), await snapshot(page, '[data-side=before]'));
  await page.locator('#json-panel summary').tap();
  await page.locator('#selection-json').fill('{"style":"shaved","body":"broad","forehead_height":1.16,"memo":"archive"}');
  await page.locator('#reload').tap();
  assert.equal(await page.locator('#historical').inputValue(), 'shaved:U');
  assert.equal(JSON.parse(await page.locator('#selection-json').inputValue()).memo, 'archive');

  const timing = await page.evaluate(async base => {
    const {drawEyes} = await import(new URL('draw.mjs', base));
    const {acceptsEyes, faceEnvelope} = await import(new URL('eyes.mjs', base));
    const input = {skull_width: .86, skull_height: 1.18, forehead_width: 1.14, forehead_height: .84,
      temple_width: .9, cheek_width: .88, jowls: 1.35, jaw_width: .82};
    const face = faceEnvelope(input), times = [];
    let errors = 0, maxAttempts = 0;
    for (let i = 0; i < 256; i++) {
      const start = performance.now();
      const {values, attempts} = drawEyes(input, 'bio-inv-' + i);
      times.push(performance.now() - start);
      if (!acceptsEyes(face, values)) errors++;
      maxAttempts = Math.max(maxAttempts, attempts);
    }
    times.sort((a,b) => a-b);
    return {seeds: times.length, errors, p50Ms: times[128], p95Ms: times[243], maxMs: times.at(-1), maxAttempts};
  }, base);
  assert.equal(timing.errors, 0);
  return {restoreScales: prior.length, buttonMs, timing};
}

(async () => {
  await mkdir(output, {recursive: true});
  const server = process.env.BASE_URL ? null : await localSite();
  const base = process.env.BASE_URL ?? `http://127.0.0.1:${server.address().port}/bio-yeux-01/`;
  const result = {base, engines: []};
  try {
    for (const name of (process.env.AUDIT_ENGINES ?? 'chromium,webkit').split(',')) {
      const browser = await engines[name].launch();
      try {
        const page = await browser.newPage({viewport:{width:820,height:1180}, hasTouch:true, isMobile:true,
          deviceScaleFactor:1, ignoreHTTPSErrors:process.env.PAGES_TEST_PROXY === '1'});
        const errors = [];
        page.on('pageerror', error => errors.push(error.message));
        page.on('response', response => {
          if (response.status() >= 400) errors.push(response.status() + ' ' + response.url());
        });
        assert.equal((await page.goto(base)).status(), 200);
        await page.locator('#comparison svg').first().waitFor();
        const archive = await testArchive(page, base);
        assert.deepEqual(errors, []);
        const entry = {name, version: browser.version(), archive};
        result.engines.push(entry);
        console.log(JSON.stringify(entry));
      } finally {
        await browser.close();
      }
    }
    await writeFile(path.join(output, 'results.json'), JSON.stringify(result, null, 2) + '\n');
  } finally {
    server?.close();
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
