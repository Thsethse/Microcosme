const assert = require('node:assert/strict');
const {createServer} = require('node:http');
const {execFileSync} = require('node:child_process');
const {readFile, mkdir, writeFile} = require('node:fs/promises');
const path = require('node:path');
const {chromium, webkit} = require('playwright');

const root = path.resolve(__dirname, '../..');
const output = process.env.ARTIFACT_DIR ?? '/tmp/microcosme-inv-corrections';
const engines = {chromium, webkit};
const types = {'.html': 'text/html', '.mjs': 'text/javascript', '.css': 'text/css', '.json': 'application/json'};

async function localSite() {
  const frozen = new Map(['render.mjs','eyes.mjs','bezier.mjs'].map(file => [
    '/baseline-eyes/' + file,
    execFileSync('git', ['show', '13c57a9e7424bef1fe92b71dd4c036072050f050:bio-yeux-01/' + file], {cwd:root})
  ]));
  const server = createServer(async (request, response) => {
    try {
      const url = new URL(request.url, 'http://localhost');
      if (frozen.has(url.pathname)) {
        response.writeHead(200, {'Content-Type':'text/javascript'}).end(frozen.get(url.pathname));
        return;
      }
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

  const baseline = process.env.BASE_URL ? new URL('../bio-yeux-01/', base).href :
    new URL('/baseline-eyes/', base).href;
  await page.evaluate(async ({base, baseline, text}) => {
    const {character} = await import(new URL('render.mjs', baseline));
    const {characterInput, parseAppearance} = await import(new URL('appearance.mjs', base));
    const restored = parseAppearance(text);
    const input = characterInput(restored.selection);
    const modes = [{frame:'-30 -65 220 225', headOnly:true},
      {frame:'-40 -85 240 355', headOnly:false}, {frame:'-35 -68 230 245', headOnly:true, smallScale:true}];
    const fixture = document.createElement('div');
    fixture.id = 'frozen-render';
    fixture.hidden = true;
    fixture.innerHTML = modes.map(({frame,...mode}) => character(input, {...mode, instance:'atelier-yeux-0',
      eyes:restored.eyes,hairColor:restored.colour}).replace(/viewBox="[^"]*"/, `viewBox="${frame}"`)).join('');
    document.body.append(fixture);
  }, {base, baseline, text});
  for (const background of ['light','dark']) {
    await page.locator('#background').selectOption(background);
    assert.deepEqual(await snapshot(page), await snapshot(page, '#frozen-render'));
  }
  await page.locator('#background').selectOption('light');

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

const isProposal = page => page.locator('#eye-proposal').isVisible();
const afterMode = page => page.locator('#comparison').getAttribute('data-eyes');
const openHistory = async (page, key) => {
  await page.locator('#historical').selectOption(key);
  await page.locator('#load-history').tap();
};
const applyProposal = async page => { if (await isProposal(page)) await page.locator('#eye-confirm').tap(); };
async function captureArchive(page) {
  await page.locator('#appearance-export').tap();
  return JSON.parse(await page.locator('#appearance-json').inputValue());
}

async function testDomains(page, base, engine) {
  const source = await page.evaluate(async base => {
    const {appearanceDocument} = await import(new URL('appearance.mjs', base));
    const {restoreSelection} = await import(new URL('../bio-col-01/selection.mjs', base));
    const corner = {skull_width:1.18, skull_height:1.18, forehead_width:1.14, forehead_height:1.18,
      temple_width:1.16, cheek_width:.88, jowls:.75, jaw_width:1.22};
    const eyes = {width:94,height:42,upper:78,lower:114,tilt:-10,taper:65,upperPeak:-13,lowerPeak:9};
    return JSON.stringify(appearanceDocument(restoreSelection({style:'p5-038',arrangement:'G',...corner}),
      {eyes,form:'custom',colour:'chatain-clair',flat:false}));
  }, base);
  await page.locator('#appearance-json').fill(source);
  await page.locator('#appearance-import').tap();
  const tilt = page.locator('#eye-tilt');
  assert.match(await page.locator('#eye-domain-tilt').textContent(), /-12 à -10° ou 10 à 12°/);
  await tilt.press('ArrowRight');
  assert.equal(await tilt.getAttribute('aria-valuetext'), '10°');
  await tilt.press('Home');
  assert.equal(await tilt.getAttribute('aria-valuetext'), '-12°');
  await tilt.press('End');
  assert.equal(await tilt.getAttribute('aria-valuetext'), '12°');
  assert.equal(await isProposal(page), false);
  await tilt.scrollIntoViewIfNeeded();
  const box = await tilt.boundingBox();
  await page.touchscreen.tap(box.x + 5, box.y + box.height/2);
  assert.equal(await tilt.getAttribute('aria-valuetext'), '-12°');

  await page.locator('#appearance-json').fill(source);
  await page.locator('#appearance-import').tap();
  const unchanged = await snapshot(page);
  await page.locator('#eye-request-panel summary').tap();
  await page.locator('#eye-request-axis').selectOption('tilt');
  await page.locator('#eye-request-value').fill('-9');
  await page.locator('#eye-request button').tap();
  assert.equal(await isProposal(page), true);
  assert.match(await page.locator('#eye-proposal-values').textContent(), /Largeur · 94 → 93,746/);
  assert.deepEqual(await snapshot(page), unchanged);
  await page.locator('#eye-proposal').screenshot({path:path.join(output, engine+'-confirmation.png')});
  await page.locator('#eye-cancel').press('Enter');
  assert.equal(await isProposal(page), false);
  assert.deepEqual(await snapshot(page), unchanged);
  await page.locator('#eye-request button').tap();
  await page.locator('#eye-confirm').press('Enter');
  const adjusted = await captureArchive(page);
  assert.equal(adjusted.eyes.requested.width, 94);
  assert.equal(adjusted.eyes.effective.width, 93.74603271484375);
  assert.equal(adjusted.eyes.effective.tilt, -9);

  await page.locator('#morph').selectOption('min');
  assert.equal(await isProposal(page), true);
  assert.equal((await captureArchive(page)).character.morphology.skull_width, 1.18);
  await page.locator('#eye-confirm').tap();
  assert.equal((await captureArchive(page)).character.morphology.skull_width, .86);

  let checkedPresets=0;
  for (const name of ['round','oval','almond','narrow','upturned','downturned','heavy','crescent','minimum','maximum']) {
    await page.locator('#eye-preset').selectOption(name);
    await applyProposal(page);
    assert.equal(await afterMode(page), name);
    checkedPresets++;
  }
  const emptySlice = await page.evaluate(async base => {
    const {appearanceDocument} = await import(new URL('appearance.mjs', base));
    const {restoreSelection} = await import(new URL('../bio-col-01/selection.mjs', base));
    const input = {style:'p5-038',arrangement:'G',skull_width:.86,skull_height:1.18,forehead_width:.88,
      forehead_height:.84,temple_width:.9,cheek_width:.88,jowls:.75,jaw_width:.82};
    return JSON.stringify(appearanceDocument(restoreSelection(input),
      {eyes:'round',form:'round',colour:'chatain-clair',flat:false}));
  }, base);
  await page.locator('#appearance-json').fill(emptySlice);
  await page.locator('#appearance-import').tap();
  assert(await page.locator('#eye-width').isDisabled());
  assert.match(await page.locator('#eye-domain-width').textContent(), /Aucun pas entier direct/);
  assert.equal((await captureArchive(page)).eyes.effective.width, 79.30454349517822);
  await page.locator('#reset-eyes').tap();
  assert.equal(await afterMode(page), 'historical');
  assert.deepEqual(await snapshot(page), await snapshot(page, '[data-side=before]'));
  return {checkedPresets, disjoint:'[-12,-10] ∪ [10,12]', confirmedWidth:adjusted.eyes.effective.width};
}

async function testAvailability(page) {
  await openHistory(page, 'p5-038:G');
  assert(await page.locator('#accessories').isDisabled());
  assert(await page.locator('#contrast').isDisabled());
  await openHistory(page, 'p5-050:D');
  assert(await page.locator('#contrast').isEnabled());
  await page.locator('#contrast').uncheck();
  await page.locator('#morph-panel summary').tap();
  const front = page.locator('#morph-forehead_height');
  await front.press('End');
  assert.equal(await front.inputValue(), '1.18');
  await page.locator('[data-category=fantasy]').tap();
  await page.locator('[data-colour=bleu-vif]').tap();
  const latent = (await captureArchive(page)).palette;
  await openHistory(page, 'p5-063:G');
  assert(await page.locator('#accessories').isEnabled());
  assert(await page.locator('#flat-mode').isDisabled());
  assert(await page.locator('[data-colour=bleu-vif]').isDisabled());

  await openHistory(page, 'p5-050:D');
  await openHistory(page, 'shaved:U');
  assert(await page.locator('#arrangement').isDisabled());
  assert.equal(await page.locator('#arrangement').inputValue(), 'U');
  assert(await front.isDisabled());
  assert.equal(await front.inputValue(), '1.18');
  assert.equal((await captureArchive(page)).historicalSelection.arrangement, 'D');
  assert.deepEqual((await captureArchive(page)).palette, latent);
  await openHistory(page, 'p5-050:D');
  assert(await page.locator('#arrangement').isEnabled());
  assert(await front.isEnabled());
  assert.equal(await front.inputValue(), '1.18');
  assert.equal(await page.locator('#contrast').isChecked(), false);
  assert.equal(await page.locator('#flat-mode').isChecked(), true);

  for (const body of await page.locator('#body option').evaluateAll(options => options.map(o => o.value))) {
    await page.locator('#body').selectOption(body);
    assert.equal((await captureArchive(page)).character.body, body);
  }
  let picked=0;
  for (const category of ['natural','fantasy']) {
    await page.locator('[data-category='+category+']').tap();
    for (const id of await page.locator('#swatches button').evaluateAll(buttons => buttons.map(b => b.dataset.colour))) {
      await page.locator('[data-colour='+id+']').tap();
      assert.equal((await captureArchive(page)).palette.colour, id);
      picked++;
    }
  }
  assert.equal(picked, 26);
  const layouts = [];
  for (const viewport of [{width:820,height:1180},{width:1180,height:820},{width:390,height:844}]) {
    await page.setViewportSize(viewport);
    const data = await page.evaluate(() => ({
      scrollWidth: document.documentElement.scrollWidth,
      dimensions: [...document.querySelectorAll('[data-side=after] svg')].map(el => {
        const {height,width} = el.getBoundingClientRect(); return [height,width];
      })
    }));
    assert(data.scrollWidth <= viewport.width+1, JSON.stringify(data));
    assert.deepEqual(data.dimensions.map(x => x[0]), [300,178,70]);
    assert.equal(data.dimensions[2][1], 70);
    layouts.push({...viewport,...data});
  }
  return {picked, layouts};
}

async function testCatalogue(page, base) {
  assert.equal(await page.locator('#ordinary option').count(), 119);
  assert.equal(await page.locator('#historical option').count(), 126);
  assert.equal(await page.locator('#ordinary option[value="p5-065:D"]').count(), 0);
  assert.equal(await page.locator('#ordinary option[value="p5-065:G"]').count(), 1);
  await openHistory(page, 'p5-065:D');
  assert.equal(await page.locator('#ordinary').inputValue(), 'p5-048:D');
  assert.match(await page.locator('#identity-note').textContent(), /65-D.*48-D/);
  const alias = await captureArchive(page);
  assert.equal(alias.historicalSelection.style, 'p5-065');
  assert.equal(alias.character.arrangement, 'D');
  const archivedPixels = (await snapshot(page)).map(x => x.pixels);
  await page.locator('#choose-ordinary').tap();
  assert.equal(await page.locator('#historical').inputValue(), 'p5-048:D');
  const ordinary = await captureArchive(page);
  assert.equal(ordinary.historicalSelection.style, 'p5-048');
  assert.equal(ordinary.character.arrangement, 'D');
  assert.deepEqual((await snapshot(page)).map(x => x.pixels), archivedPixels);
  for (const [archive, key] of [[alias,'p5-065:D'],[ordinary,'p5-048:D']]) {
    await page.locator('#appearance-json').fill(JSON.stringify(archive));
    await page.locator('#appearance-import').tap();
    assert.equal(await page.locator('#historical').inputValue(), key);
    assert.equal(await page.locator('#ordinary').inputValue(), 'p5-048:D');
    await page.locator('#selection-json').fill(JSON.stringify(archive.historicalSelection));
    await page.locator('#reload').tap();
    assert.equal(await page.locator('#historical').inputValue(), key);
  }
  await openHistory(page, 'p5-065:G');
  assert.equal(await page.locator('#ordinary').inputValue(), 'p5-065:G');
  assert.notDeepEqual((await snapshot(page)).map(x => x.pixels), archivedPixels);
  await openHistory(page, 'p5-061:G');
  assert.equal(await page.locator('#ordinary').inputValue(), 'p5-056:G');
  assert.equal(await page.locator('[data-side=after] .head [data-feature=loose-lock]').count(), 2);
  await page.locator('#choose-ordinary').tap();
  assert.equal(await page.locator('[data-side=after] .head [data-feature=loose-lock]').count(), 0);

  const model = new URL(process.env.BASE_URL ? '../bio-vis-p5-i6/model.mjs' : '../preview/bio-vis-p5-i6/model.mjs', base).href;
  const comparisons = await page.evaluate(async ({base, model}) => {
    const {character} = await import(new URL('render.mjs', base));
    const {presets} = await import(model);
    const views = [
      {size:300,frame:'-30 -65 220 225',headOnly:true},
      {size:178,frame:'-40 -85 240 355',headOnly:false},
      {size:70,frame:'-35 -68 230 245',headOnly:true,smallScale:true}
    ];
    const canvas = document.createElement('canvas'), ctx = canvas.getContext('2d');
    async function draw(style, input, {size,frame,...opts}, hairColor, bg) {
      const text = character({...input,style,arrangement:'D'}, {...opts,hairColor,instance:'test-c'})
        .replace(/viewBox="[^"]*"/, `viewBox="${frame}" width="${size}" height="${size}"`);
      const image = new Image();
      image.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(text);
      await image.decode();
      canvas.width = canvas.height = size;
      ctx.fillStyle = bg; ctx.fillRect(0,0,size,size); ctx.drawImage(image,0,0,size,size);
      return canvas.toDataURL();
    }
    let cases = 0, mismatches = 0;
    for (const morph of [{},presets.tall.values,presets.broad.values]) {
      for (const accessories of [false,true]) for (const contrast of [false,true]) {
        for (const view of views) for (const hairColor of ['historical','bleu-vif']) {
          for (const bg of ['#fffdf8','#474c55']) {
            const input = {...morph,accessories,contrast};
            if (await draw('p5-048',input,view,hairColor,bg) !== await draw('p5-065',input,view,hairColor,bg)) mismatches++;
            cases++;
          }
        }
      }
    }
    return {cases,mismatches};
  }, {base,model});
  assert.deepEqual(comparisons, {cases:144,mismatches:0});
  return comparisons;
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
        const domains = await testDomains(page, base, name);
        const options = await testAvailability(page);
        const catalogue = await testCatalogue(page, base);
        assert.deepEqual(errors, []);
        const entry = {name, version: browser.version(), archive, domains, options, catalogue};
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
