const assert = require('node:assert/strict');
const {createHash} = require('node:crypto');
const {mkdir, readFile, writeFile} = require('node:fs/promises');
const {createServer} = require('node:http');
const path = require('node:path');
const {chromium, webkit, devices} = require('playwright');

const output = process.env.ARTIFACT_DIR ?? '/tmp/microcosme-corps-01';
const published = 'https://thsethse.github.io/Microcosme/preview/bio-corps-01/';
const referenceURL = process.env.REFERENCE_URL ?? 'https://thsethse.github.io/Microcosme/preview/bio-yeux-r01/';
const local = process.env.PREVIEW_DIR;
const engines = {chromium, webkit};
const specimens = ['standard','slim','broad','narrow','shoulders','bust','adult-h','adult-f'];
const reference = '#comparison [data-side="after"] svg';
const mime = {'.html':'text/html','.css':'text/css','.js':'text/javascript','.mjs':'text/javascript','.json':'application/json'};

async function serve(directory) {
  const root = path.resolve(directory);
  const server = createServer(async (request, response) => {
    const url = new URL(request.url,'http://localhost');
    const file = path.resolve(root, '.' + (url.pathname === '/' ? '/index.html' : url.pathname));
    try {
      if (!file.startsWith(root + path.sep)) throw new Error('Hors du dossier de preview.');
      const content = await readFile(file);
      response.writeHead(200, {'Content-Type':mime[path.extname(file)]}).end(content);
    } catch (error) {
      response.writeHead(404).end();
    }
  });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  return server;
}

async function ready(page, url) {
  assert.equal((await page.goto(url, {waitUntil:'load'})).status(), 200);
  await page.waitForFunction(() => document.querySelector('#atelier').dataset.startup !== 'pending');
  assert.equal(await page.locator('#atelier').getAttribute('data-startup'), 'ready',
    await page.locator('#atelier-startup-detail').textContent());
}

async function compare(page) {
  return page.locator(reference).evaluateAll(svgs => Promise.all(svgs.map(async svg => {
    const {width,height} = svg.getBoundingClientRect();
    const clone = svg.cloneNode(true);
    const serialize = () => new XMLSerializer().serializeToString(clone).replace(/atelier-yeux-\d+/g,'fixed');
    const original = serialize();
    const img = new Image();
    img.src = 'data:image/svg+xml,' + encodeURIComponent(original.replace('<svg ', `<svg width="${Math.round(width)}" height="${height}" `));
    await img.decode();
    const canvas = document.createElement('canvas');
    canvas.width = Math.round(width);
    canvas.height = height;
    canvas.getContext('2d').drawImage(img,0,0);
    const silhouette = clone.querySelector('.body-shape');
    if (!silhouette) throw new Error('Calque corporel introuvable.');
    const body = silhouette.outerHTML;
    silhouette.remove();
    return {width:Math.round(width),height,original,body,outside:serialize(),raster:canvas.toDataURL()};
  })));
}

async function exportAppearance(page) {
  await page.locator('#appearance-export').evaluate(button => button.click());
  return page.locator('#appearance-json').inputValue();
}

async function importAppearance(page, document) {
  await page.locator('#appearance-json').evaluate((textarea, value) => { textarea.value=value; }, document);
  await page.locator('#appearance-import').evaluate(button => button.click());
  assert.equal(await page.locator('#appearance-error').textContent(),'');
}

async function exercise(context, url, name, version) {
  const [page, old] = await Promise.all([context.newPage(), context.newPage()]);
  const errors = [];
  for (const target of [page,old]) target.on('pageerror', error => errors.push(error.message));
  await Promise.all([ready(page,url),ready(old,referenceURL)]);
  const q = selector => page.locator(selector);
  const current = await q('#body option').evaluateAll(options => options.map(option => option.value));
  assert.deepEqual(current,specimens);
  assert.equal(await q('#body').inputValue(),'standard');
  assert(await q('a[href="#planche-contours"]').isVisible(), 'La planche BIO-YEUX-R01 reste accessible.');
  const original = [];
  for (const body of specimens.slice(0,6)) {
    await Promise.all([q('#body').selectOption(body),old.locator('#body').selectOption(body)]);
    const [before,after] = await Promise.all([compare(old),compare(page)]);
    assert.deepEqual(after,before);
    assert.deepEqual(JSON.parse(await exportAppearance(page)),JSON.parse(await exportAppearance(old)));
    original.push(after);
  }

  await q('#body').selectOption('standard');
  const legacy = await compare(page);
  const adult = [];
  for (const body of specimens.slice(6)) {
    await q('#body').selectOption(body);
    const images = await compare(page);
    assert.deepEqual(images.map(image=>image.height),[300,178,70]);
    assert.equal(images[2].width,70);
    for (let i=0; i<images.length; i++) {
      assert.notEqual(images[i].raster,legacy[i].raster);
      assert.equal(images[i].outside,legacy[i].outside);
    }
    assert.equal(await q('#comparison [data-body-guides]').count(),0);
    adult.push(images);
  }
  const all = [...original,...adult];
  assert.deepEqual([0,1,2].map(index => new Set(all.map(group => group[index].raster)).size),[8,8,8]);

  const cases = [
    ['shaved:U','min',.88], ['waist_waves:U','tall',1.16], ['p5-061:G','max',1.18]
  ];
  for (const [hair,morph,skull] of cases) {
    await q('#historical').selectOption(hair);
    await q('#load-history').evaluate(button => button.click());
    await q('#morph').selectOption(morph);
    for (const body of specimens.slice(6)) {
      await q('#body').selectOption(body);
      const joined = await q('#comparison [data-side="after"] .tile svg').evaluate((svg,chin) => {
        const head = svg.querySelector('.head-shape > path');
        const body = svg.querySelector('[data-adult-body] path');
        const overlap = new DOMPoint(80,chin-2);
        const frame = svg.viewBox.baseVal;
        const box = body.getBBox();
        return head.isPointInFill(overlap) && body.isPointInFill(overlap) &&
          box.x >= frame.x && box.x+box.width <= frame.x+frame.width && box.y+box.height <= frame.y+frame.height;
      },65+44*skull);
      assert(joined,`${hair} · ${morph} · ${body}`);
    }
  }

  await q('#makeup-family').selectOption('lips');
  await q('#makeup-enabled').evaluate(input => input.click());
  await q('#makeup-lips-colour').selectOption('#cf526f');
  for (const body of specimens.slice(6)) {
    await q('#body').selectOption(body);
    const expected = await compare(page);
    const json = await exportAppearance(page);
    const saved = JSON.parse(json);
    assert.equal(saved.version,11);
    assert.equal(saved.character.body,body);
    if (body==='adult-h') assert.equal(saved.makeup.mode,'custom');
    await ready(page,url);
    assert.equal(await q('#body').inputValue(),'standard');
    await importAppearance(page,json);
    assert.equal(await q('#body').inputValue(),body);
    assert.deepEqual(await compare(page),expected);
    assert.deepEqual(JSON.parse(await exportAppearance(page)),saved);
  }
  const raw = {style:'p5-061',arrangement:'G',body:'adult-f',shoulders:.72,chest:'pectoral'};
  await q('#selection-json').evaluate((input,value) => { input.value=value; },JSON.stringify(raw));
  await q('#reload').evaluate(button => button.click());
  assert.equal(await q('#body').inputValue(),'standard');
  assert.deepEqual(JSON.parse(await q('#selection-json').inputValue()),raw);

  await q('nav a[href="#planche-corps"]').click();
  await q('#body-diagrams [data-ground-anchor]').first().waitFor({state:'attached'});
  assert.equal(await q('#body-diagrams [data-body-level]').count(),14);
  assert.equal(await q('#body-diagrams [data-pawn-base]').count(),2);
  assert.equal(await q('#body-diagrams [data-ground-anchor]').count(),2);
  assert.equal(await q('#body-comparison [data-body-specimen]').count(),8);
  assert.equal(await q('#body-comparison svg').count(),24);
  assert.equal(await q('#body-comparison [data-body-guides]').count(),0);
  await q('#body-diagrams').screenshot({path:path.join(output,`${name}-reperes.png`)});
  await q('#body-comparison [data-body-specimen="adult-f"]').screenshot({path:path.join(output,`${name}-trois-echelles.png`)});
  for (const width of [1180,820,390]) {
    await page.setViewportSize({width,height:920});
    assert(await page.evaluate(w => document.querySelector('#planche-corps').getBoundingClientRect().right <= w &&
      document.documentElement.scrollWidth<=w+1,width));
  }
  assert.deepEqual(errors,[]);
  return {name, version, historicalExact:18, rasterBySize:[8,8,8], fittings:cases.length*2, coldImports:2, guidedLandmarks:14};
}

async function files(url) {
  const response = await fetch(new URL('version.json',url));
  assert.equal(response.status,200);
  const manifest = await response.json();
  assert.equal(manifest.mission,'BIO-CORPS-01');
  for (const {path,sha256} of manifest.files) {
    const resource = await fetch(new URL(path,url));
    assert.equal(resource.status,200,path);
    assert.equal(createHash('sha256').update(Buffer.from(await resource.arrayBuffer())).digest('hex'),sha256,path);
  }
  return {codeCommit:manifest.codeCommit, files:manifest.files.length, inherited:manifest.inherited.length};
}

(async () => {
  const server = local ? await serve(local) : null;
  const url = process.env.BASE_URL ?? (server ? `http://127.0.0.1:${server.address().port}/` : published);
  try {
    await mkdir(output,{recursive:true});
    const report = {url,...await files(url),engines:[]};
    for (const name of (process.env.AUDIT_ENGINES ?? 'chromium,webkit').split(',')) {
      const browser = await engines[name].launch();
      try {
        const context = await browser.newContext({
          ...devices['iPad (gen 7) landscape'], deviceScaleFactor:1,
          ignoreHTTPSErrors:process.env.PAGES_TEST_PROXY==='1'
        });
        report.engines.push(await exercise(context,url,name,browser.version()));
        await context.close();
      } finally {
        await browser.close();
      }
    }
    await writeFile(path.join(output,'recette.json'),JSON.stringify(report,null,2)+'\n');
    console.log(JSON.stringify(report));
  } finally {
    server?.close();
  }
})().catch(error=>{ console.error(error); process.exitCode=1; });
