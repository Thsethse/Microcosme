const assert = require('node:assert/strict');
const {createHash} = require('node:crypto');
const {mkdir, readFile, writeFile} = require('node:fs/promises');
const {createServer} = require('node:http');
const path = require('node:path');
const {chromium, webkit, devices} = require('playwright');
const {auditEyeContour} = require('./eye-contour-browser.cjs');

const root = path.resolve(__dirname, '../..');
const output = process.env.ARTIFACT_DIR ?? '/tmp/microcosme-maquillage';
const eyeRevision = process.env.PREVIEW_MISSION === 'BIO-YEUX-R01';
const mission = eyeRevision ? 'BIO-YEUX-R01' : 'BIO-MAQUILLAGE-01';
const preview = '/preview/' + mission.toLowerCase() + '/';
const publicURL = 'https://thsethse.github.io/Microcosme' + preview;
const local = process.env.PREVIEW_DIR;
const htmlTypes = {'.js':'text/javascript','.mjs':'text/javascript','.json':'application/json',
  '.css':'text/css','.html':'text/html'};
const digest = bytes => createHash('sha256').update(bytes).digest('hex');
const families = ['lips','shadow','liner','blush','paint'];
const shapeNames = ['point','circle','ring','line','stripe','triangle','diamond','crescent','arc','wave','zigzag','star'];
const after = '#comparison [data-side="after"]';

async function serve() {
  const server = createServer(async (request, response) => {
    const {pathname} = new URL(request.url, 'http://localhost');
    const directory = pathname.startsWith(preview) ? path.resolve(local) : root;
    const name = directory === root ? pathname.slice(1) : pathname.slice(preview.length);
    const asset = path.resolve(directory, name || 'index.html');
    try {
      if (!asset.startsWith(directory + path.sep)) throw new Error('Chemin invalide');
      response.writeHead(200, {'Content-Type':htmlTypes[path.extname(asset)]}).end(await readFile(asset));
    } catch {
      if (!response.headersSent) response.writeHead(404);
      response.end();
    }
  });
  await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
  return server;
}

function watch(page) {
  const errors = [], scripts = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
  page.on('requestfailed', request => errors.push(request.url() + ' · ' + request.failure()?.errorText));
  page.on('response', response => {
    if (response.status() >= 400) errors.push(response.status() + ' · ' + response.url());
    if (response.request().resourceType() === 'script') scripts.push(response);
  });
  return {errors, scripts};
}

async function ready(page, base) {
  const url = new URL('#atelier',base).href;
  const response = page.url() === url ? await page.reload({waitUntil:'load'}) :
    await page.goto(url, {waitUntil:'load'});
  assert.equal(response.status(),200);
  await page.waitForFunction(()=>document.querySelector('#atelier').dataset.startup !== 'pending');
  assert.equal(await page.locator('#atelier').getAttribute('data-startup'),'ready',
    await page.locator('#atelier-startup-detail').textContent());
  assert.equal(await page.locator('#atelier-startup-error').isVisible(),false);
}

async function snapshot(page, selector = after) {
  return page.locator(selector + ' svg').evaluateAll(async portraits => Promise.all(portraits.map(async svg => {
    const bounds = svg.getBoundingClientRect();
    const width = Math.round(bounds.width), height = Math.round(bounds.height);
    const serialized = new XMLSerializer().serializeToString(svg).replace(/atelier-yeux-\d+/g,'stable');
    const image = new Image();
    const sized = serialized.replace('<svg ',`<svg width="${width}" height="${height}" `);
    image.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(sized);
    await image.decode();
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext('2d');
    context.drawImage(image,0,0);
    const data = context.getImageData(0,0,width,height).data;
    let pixels = 0;
    for (let i = 3; i < data.length; i += 4) if (data[i] > 127) pixels++;
    const protectedPixels = [...svg.querySelectorAll('[data-pupil-shape] ellipse,[data-bio-nose] [data-nose-region="nostrils"]')]
      .map(ellipse => {
        const p = new DOMPoint(+ellipse.getAttribute('cx'),+ellipse.getAttribute('cy')).matrixTransform(svg.getScreenCTM());
        const x = Math.floor(p.x - bounds.x), y = Math.floor(p.y - bounds.y);
        return [...context.getImageData(x,y,1,1).data];
      });
    return {width,height,pixels,svg:serialized,raster:canvas.toDataURL(),protectedPixels};
  })));
}

async function verifyPublishedFiles(page, base, version) {
  const assets = [
    ...version.files.map(({path,sha256})=>[new URL(path,base).href,sha256]),
    ...version.inherited.map(({path,sha256})=>[new URL('../../'+path,base).href,sha256])
  ];
  let retries = 0;
  for (let i = 0; i < assets.length; i += 6) {
    const batch = assets.slice(i,i+6);
    const results = await page.evaluate(async urls => Promise.all(urls.map(async url => {
      for (let attempt = 1; attempt <= 4; attempt++) {
        try {
          const response = await fetch(url,{cache:attempt > 1 ? 'reload' : 'default',signal:AbortSignal.timeout(15000)});
          if (![429, 502, 503, 504].includes(response.status) || attempt === 4) {
            const bytes = await crypto.subtle.digest('SHA-256',await response.arrayBuffer());
            return {status:response.status, mime:response.headers.get('content-type'), retries:attempt - 1,
              sha:[...new Uint8Array(bytes)].map(n=>n.toString(16).padStart(2,'0')).join('')};
          }
        } catch (error) {
          if (attempt === 4) throw error;
        }
        await new Promise(resolve=>setTimeout(resolve,250 * attempt));
      }
    })),batch.map(([url])=>url));
    for (const [j, [url, sha]] of batch.entries()) {
      assert.equal(results[j].status,200,url);
      assert.equal(results[j].sha,sha,url);
      retries += results[j].retries;
      if (/\.m?js$/.test(url)) assert.match(results[j].mime,/javascript/,url);
    }
  }
  return {verified:assets.length,retries};
}

async function exercise(context, base, engine, browserVersion, assetReport) {
  const page = await context.newPage();
  const {errors, scripts} = watch(page);
  const q = selector => page.locator(selector);
  await ready(page,base);
  const manifest = await page.evaluate(async url => {
    const response = await fetch(url);
    return {status:response.status, text:await response.text()};
  },new URL('version.json',base).href);
  assert.equal(manifest.status,200);
  const version = JSON.parse(manifest.text);
  assert.equal(version.mission,mission);
  if (process.env.EXPECT_COMMIT) assert.equal(version.codeCommit,process.env.EXPECT_COMMIT);
  assert.equal(scripts.length,1);
  const script = scripts[0];
  assert.equal(script.url(),new URL(version.startup,base).href);
  assert.match(version.startup,/^atelier-[a-f0-9]{16}\.js$/);
  assert.match(script.headers()['content-type'],/javascript/);
  assert.equal(digest(await script.body()),version.files.find(file=>file.path===version.startup).sha256);
  const menus = {};
  for (const [id, count] of Object.entries({
    ordinary:119,historical:126,body:6,morph:6,'eye-preset':12,'iris-primary':16,'brows-preset':9,
    'mouth-preset':9,'nose-preset':9,'beard-preset':12,'marks-type':5,'scars-preset':6,
    'makeup-family':5,'makeup-paint-kind':12
  })) {
    menus[id] = await q('#'+id+' option').count();
    if (id.startsWith('makeup-')) assert.equal(menus[id],count,id);
    else assert(menus[id]>=count,id);
  }
  assert.equal(await q('#makeup-paint-panel').isVisible(),false);
  const sliders = {};
  for (const [name, selector, count] of [
    ['eyes','#eye-controls',8],['scars','#scars-axes',11],['makeup','#makeup-controls',24]
  ]) {
    sliders[name] = await q(selector+' input[type=range]').count();
    assert.equal(sliders[name],count,name);
  }
  const eyeContours = await q(after+' [data-eye-anatomy]').count();
  assert.equal(eyeContours,eyeRevision ? 12 : 0);
  const initialization = [];
  for (const side of ['before','after']) {
    const portraits = await snapshot(page,`#comparison [data-side="${side}"]`);
    assert.deepEqual(portraits.map(({height})=>height),[300,178,70]);
    assert.equal(portraits[2].width,70);
    assert(portraits.every(({pixels})=>pixels>100));
    initialization.push(portraits.map(({width,height,pixels})=>({width,height,pixels})));
  }

  await q('#body').selectOption('slim');
  await q('#eye-preset').selectOption('almond');
  if (await q('#eye-confirm').isVisible()) await q('#eye-confirm').click();
  const eyeWidth = await q('#eye-width').inputValue();
  await q('#eye-width').press('Home');
  if (await q('#eye-confirm').isVisible()) await q('#eye-confirm').click();
  assert.notEqual(await q('#eye-width').inputValue(),eyeWidth);
  assert.equal(await q(after+' [data-bio-eye]').count(),6);
  const inherited = {};
  for (const [section, layer] of [
    ['iris','iris'],['details','details'],['brows','brows'],['mouth','mouth'],['nose','nose'],['beard','facial-hair']
  ]) {
    await q('#'+section+'-active').check();
    inherited[section] = await q(after+' [data-bio-'+layer+']').count();
    assert(inherited[section]>=3,section);
  }
  if (await q('#flat-mode').isEnabled()) await q('#flat-mode').check();
  assert(await q('#flat-mode').isChecked());
  inherited.palette = true;
  await q('#marks-add').click();
  inherited.marks = await q(after+' [data-bio-marks]').count();
  assert.equal(inherited.marks,3);
  await q('#scars-preset').selectOption('sutured');
  await q('#scars-add').click();
  inherited.scars = await q(after+' [data-bio-scars]').count();
  assert.equal(inherited.scars,3);
  const maturation = await q('#scars-maturity').inputValue();
  await q('#scars-maturity').press('End');
  assert.notEqual(await q('#scars-maturity').inputValue(),maturation);
  const natural = await snapshot(page);
  assert.equal(natural[0].protectedPixels.length,4);
  const effects = {};
  let previous = natural;
  for (const family of families.slice(0,4)) {
    await q('#makeup-family').selectOption(family);
    await q('#makeup-enabled').check();
    const colour = q('#makeup-'+family+'-colour');
    assert.equal(await colour.locator('option').count(),32);
    await colour.selectOption({lips:'#cf526f',shadow:'#79549e',liner:'#3f649b',blush:'#db7452'}[family]);
    await q('#makeup-'+family+'-intensity').press('End');
    const rendered = await snapshot(page);
    effects[family] = rendered.map((item,i)=>item.raster !== previous[i].raster);
    assert(effects[family].every(Boolean),family+' visible aux trois tailles');
    assert.equal(await q(after+' [data-makeup-family="'+family+'"]').count(),3);
    previous = rendered;
  }

  await q('#makeup-family').selectOption('paint');
  assert.equal(await q('#makeup-paint-panel').isVisible(),true);
  for (const shape of shapeNames) {
    await q('#makeup-paint-kind').selectOption(shape);
    await q('#makeup-add').click();
  }
  await q('#makeup-paint-colour').selectOption('#397e62');
  assert.equal(await q('#makeup-paint-colour option').count(),32);
  const zoomShapes = '#makeup-zoom [data-makeup-shape]';
  const ordered = () => q(zoomShapes).evaluateAll(nodes=>nodes.map(node=>node.dataset.makeupShape));
  assert.deepEqual(await ordered(),shapeNames);
  await q('#makeup-down').click();
  assert.deepEqual(await ordered(),[...shapeNames.slice(0,-2),'star','zigzag']);
  await q('#makeup-up').click();
  assert.deepEqual(await ordered(),shapeNames);
  await q('#makeup-mirror').check();
  assert.equal(await q('#makeup-zoom [data-makeup-shape="star"] [data-makeup-mirror="true"]').count(),1);
  const xBefore = await q('#makeup-paint-x').inputValue();
  await q('#makeup-place').click();
  const view = q('#makeup-zoom svg');
  await view.scrollIntoViewIfNeeded();
  const point = await view.evaluate(svg => {
    const [x,y] = [86,76];
    const target = new DOMPoint(x,y).matrixTransform(svg.getScreenCTM());
    return {x:target.x,y:target.y};
  });
  await page.touchscreen.tap(point.x,point.y);
  assert.equal(await q('#makeup-message').textContent(),'Forme placée.');
  assert.notEqual(await q('#makeup-paint-x').inputValue(),xBefore);
  const painted = await snapshot(page);
  effects.paint = painted.map((item,i)=>item.raster !== previous[i].raster);
  assert(effects.paint.every(Boolean));
  assert.deepEqual(painted[0].protectedPixels, natural[0].protectedPixels);

  await q('#makeup-library summary').click();
  await q('#makeup-name').fill('Étude miroir');
  await q('#makeup-save').click();
  await q('#makeup-export').click();
  const compositionText = await q('#makeup-json').inputValue();
  assert.equal(JSON.parse(compositionText).makeup.paint.elements.length,12);
  await q('#appearance-panel summary').click();
  await q('#appearance-export').click();
  const archive = await q('#appearance-json').inputValue();
  assert.equal(JSON.parse(archive).version,10);
  await q('#makeup-remove-all').click();
  const removed = await snapshot(page);
  assert.deepEqual(removed,natural);
  assert.equal(await q(after+' [data-bio-makeup]').count(),0);
  await q('#appearance-export').click();
  assert.equal(JSON.parse(await q('#appearance-json').inputValue()).makeup.mode,'historical');

  await q('#body').selectOption('broad');
  await q('#morph').selectOption('broad');
  if (await q('#eye-confirm').isVisible()) await q('#eye-confirm').click();
  await q('#makeup-apply').click();
  await q('#appearance-export').click();
  const transferred = JSON.parse(await q('#appearance-json').inputValue());
  assert.equal(transferred.character.body,'broad');
  assert.deepEqual(transferred.makeup.requested,JSON.parse(archive).makeup.requested);
  assert.notDeepEqual(transferred.makeup.effective,JSON.parse(archive).makeup.effective);

  // Persisted composition is still selectable after loading a fresh document.
  await ready(page,base);
  await q('#makeup-library summary').click();
  assert.equal(await q('#makeup-saved option').count(),2);
  await q('#makeup-json').fill(compositionText);
  await q('#makeup-import').click();
  assert.deepEqual(await ordered(),shapeNames);
  await q('#appearance-panel summary').click();
  await q('#appearance-json').fill(archive);
  await q('#appearance-import').click();
  assert.deepEqual(await snapshot(page),painted);
  await q('#makeup-before-mode').selectOption('historical');
  assert.equal(await q('#comparison [data-side="before"] h3').textContent(),'Historique');

  await page.evaluate(()=>{location.hash='planche-maquillage';});
  await q('#makeup-study [data-makeup-study]').last().waitFor();
  const board = await q('#makeup-study [data-makeup-study]').count();
  assert.equal(board,7);
  assert.equal(await q('#makeup-study figure svg').count(),28);
  assert.equal(await q('#makeup-study-palette .makeup-chip').count(),32);
  if (engine === 'chromium' && !eyeRevision) {
    await q('#planche-maquillage').screenshot({path:path.join(output,'planche-maquillage.png')});
  }
  const eyeContour = eyeRevision ? await auditEyeContour(page,engine,output) : null;
  assert.deepEqual(errors,[]);
  const functionalErrors = [...errors];
  if (!assetReport.verified && !local) {
    Object.assign(assetReport,await verifyPublishedFiles(page,base,version));
    assetReport.manifestSha256 = digest(manifest.text);
  }
  await page.close();
  return {engine,browserVersion,menus,sliders,initialization,inherited,effects,board,
    protectedPixels:natural[0].protectedPixels.length,exactRemoval:true,coldReplay:true,touchPlacement:true,
    codeCommit:version.codeCommit,startup:version.startup,errors:functionalErrors,...(eyeRevision?{eyeContour}:{})};
}

async function retry(context, base) {
  const page = await context.newPage();
  await page.route('**/atelier-*.js',route=>route.fulfill({status:503,body:'Indisponible'}),{times:1});
  await page.goto(base,{waitUntil:'load'});
  await page.waitForFunction(()=>document.querySelector('#atelier').dataset.startup==='failed');
  assert(await page.locator('#atelier-startup-error').isVisible());
  await Promise.all([page.waitForNavigation(),page.locator('#atelier-retry').click()]);
  await page.waitForFunction(()=>document.querySelector('#atelier').dataset.startup==='ready');
  assert.equal(await page.locator('#comparison svg').count(),6);
  await page.close();
}

(async () => {
  await mkdir(output,{recursive:true});
  const server = local ? await serve() : null;
  const base = process.env.BASE_URL ?? (server ? `http://127.0.0.1:${server.address().port}${preview}` : publicURL);
  const report = {url:base,resources:{},engines:[]};
  const engines = {chromium,webkit};
  try {
    for (const name of (process.env.AUDIT_ENGINES ?? 'chromium,webkit').split(',')) {
      const browser = await engines[name].launch();
      try {
        const context = await browser.newContext({...devices['iPad (gen 7) landscape'],deviceScaleFactor:1,
          ignoreHTTPSErrors:process.env.PAGES_TEST_PROXY==='1'});
        try {
          const results = await exercise(context,base,name,browser.version(),report.resources);
          await retry(context,base);
          report.engines.push({...results,retryAfter503:true});
          console.log(name,browser.version(),'· T1 à T10, montage, édition et reprise réussis');
        } finally {
          await context.close();
        }
      } finally {
        await browser.close();
      }
    }
    await writeFile(path.join(output,'recette.json'),JSON.stringify(report,null,2)+'\n');
  } finally {
    if (server) server.close();
  }
})().catch(error=>{ console.error(error); process.exitCode=1; });
