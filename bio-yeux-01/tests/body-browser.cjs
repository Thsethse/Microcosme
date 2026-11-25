const assert = require('node:assert/strict');
const {createHash} = require('node:crypto');
const {mkdir, readFile, writeFile} = require('node:fs/promises');
const {createServer} = require('node:http');
const path = require('node:path');
const {chromium, webkit, devices} = require('playwright');

const mission = process.env.PREVIEW_MISSION ?? 'BIO-CORPS-01';
const chestPreview = mission === 'BIO-CORPS-04-A';
const corpulenceCorrection = mission === 'BIO-CORPS-03-R01' || chestPreview;
const corpulencePreview = mission === 'BIO-CORPS-03' || corpulenceCorrection;
const structurePreview = mission === 'BIO-CORPS-02' || corpulencePreview;
const pages = 'https://thsethse.github.io/Microcosme/preview/';
const output = process.env.ARTIFACT_DIR ?? '/tmp/microcosme-' + mission.toLowerCase();
const published = pages + mission.toLowerCase() + '/';
const predecessors = {'BIO-CORPS-04-A':'bio-corps-03-r01/', 'BIO-CORPS-03-R01':'bio-corps-03/', 'BIO-CORPS-03':'bio-corps-02/', 'BIO-CORPS-02':'bio-corps-01/'};
const referenceURL = process.env.REFERENCE_URL ?? pages + (predecessors[mission] ?? 'bio-yeux-r01/');
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
    const context = canvas.getContext('2d');
    context.drawImage(img,0,0);
    const rgba = context.getImageData(0,0,canvas.width,canvas.height).data;
    let pixels = 0;
    for (let index=3; index<rgba.length; index+=4) if (rgba[index]>127) pixels++;
    const silhouette = clone.querySelector('.body-shape');
    if (!silhouette) throw new Error('Calque corporel introuvable.');
    const body = silhouette.outerHTML;
    silhouette.remove();
    return {width:Math.round(width),height,original,body,outside:serialize(),raster:canvas.toDataURL(),pixels};
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

const bodyVertical = page => page.locator('#comparison [data-side="after"] .tile .body-shape path').evaluate(path => {
  const box = path.getBBox();
  const y = [...path.getAttribute('d').matchAll(/,-?([0-9]+(?:\.[0-9]+)?)/g)].map(match=>match[0]);
  return {height:box.height, top:box.y, controlsY:y};
});
const setRange = (page, id, value) => page.locator('#' + id).evaluate((input, number) => {
  input.value = number;
  input.dispatchEvent(new Event('input',{bubbles:true}));
},value);

async function checkStructure(page, url, name) {
  const {referenceStructure, structureControls} = await import('../body-structure.mjs');
  const q = selector => page.locator(selector);
  const axes = Object.entries(structureControls);
  const values = async () => Object.fromEntries(await Promise.all(axes.map(async ([key]) =>
    [key,Number(await q('#structure-' + key).inputValue())])));
  const geometry = () => bodyVertical(page);
  const reset = () => q('#structure-reset').evaluate(button => button.click());
  const set = (key, value) => setRange(page,'structure-' + key,value);
  const sample = {neck:83, shoulders:129, thorax:78, waist:114, pelvis:128, base:72};
  const other = {neck:129, shoulders:73, thorax:130, waist:77, pelvis:72, base:130};
  let isolatedRasters = 0;
  let unchangedVertical = 0;
  let restored = 0;
  await ready(page,url);
  assert(!await q('#structure-panel').isVisible());
  await q('#historical').selectOption('p5-061:G');
  await q('#load-history').evaluate(button => button.click());
  await q('#morph').selectOption('tall');
  for (const body of specimens.slice(6)) {
    await q('#body').selectOption(body);
    assert(await q('#structure-panel').isVisible());
    assert.equal(await q('#structure-controls input:visible').count(),6);
    assert.deepEqual(await values(),referenceStructure);
    const baseline = await compare(page);
    const initial = await geometry();
    for (const [key,{min,max}] of axes) {
      const slider = q('#structure-' + key);
      assert.equal(await slider.getAttribute('min'),String(min));
      assert.equal(await slider.getAttribute('max'),String(max));
      const rasters = [];
      for (const [button,value] of [['Home',min],['End',max]]) {
        await slider.press(button);
        assert.deepEqual(await values(),{...referenceStructure,[key]:value});
        assert.equal(await slider.getAttribute('aria-valuetext'),value+' %');
        assert.equal(await q(`output[for="structure-${key}"]`).textContent(),value+' %');
        const images = await compare(page);
        for (let i=0; i<images.length; i++) assert.equal(images[i].outside,baseline[i].outside);
        assert.notEqual(images[1].raster,baseline[1].raster,`${body} · ${key} · ${value}`);
        rasters.push(images[1].raster);
        assert.deepEqual(await geometry(),initial);
        unchangedVertical++;
        isolatedRasters++;
      }
      assert.notEqual(...rasters);
      await reset();
      assert.deepEqual(await values(),referenceStructure);
    }
    assert.deepEqual(await compare(page),baseline);
    const picked = body==='adult-h' ? sample : other;
    for (const [key,value] of Object.entries(picked)) await set(key,value);
    assert.deepEqual(await values(),picked);
    assert.deepEqual(await geometry(),initial);
    unchangedVertical++;
    const saved = await exportAppearance(page);
    const archive = JSON.parse(saved);
    assert.equal(archive.version,12);
    assert.deepEqual(archive.character.structure,picked);
    const expected = await compare(page);

    await q('#body').selectOption('broad');
    assert(!await q('#structure-panel').isVisible());
    await q('#body').selectOption(body);
    assert.deepEqual(await values(),picked);
    assert.deepEqual(await compare(page),expected);
    await ready(page,url);
    await importAppearance(page,saved);
    assert.deepEqual(await values(),picked);
    assert.deepEqual(await compare(page),expected);
    assert.deepEqual(JSON.parse(await exportAppearance(page)),archive);
    restored++;
  }

  await q('#body').selectOption('adult-h');
  for (const [key,value] of Object.entries(sample)) await set(key,value);
  await q('#body').selectOption('adult-f');
  assert.deepEqual(await values(),other);
  await q('#body').selectOption('adult-h');
  assert.deepEqual(await values(),sample);
  await reset();
  assert.deepEqual(await values(),referenceStructure);
  assert.equal(JSON.parse(await exportAppearance(page)).version,11);
  await q('#body').selectOption('adult-f');
  assert.deepEqual(await values(),other);

  await q('nav a[href="#planche-ossature"]').click();
  await q('#structure-extremes [data-structure-specimen]').first().waitFor({state:'attached'});
  assert.equal(await q('#structure-extremes [data-structure-extreme]').count(),6);
  assert.equal(await q('#structure-extremes [data-structure-specimen]').count(),24);
  assert.equal(await q('#structure-combinations [data-structure-combination]').count(),7);
  assert.equal(await q('#structure-combinations [data-structure-specimen]').count(),14);
  for (const [scale,height] of [['head',300],['mini',70],['tile',178]]) {
    await q('#structure-study-scale').selectOption(scale);
    const sizes = await q('#structure-combinations svg').evaluateAll(nodes =>
      [...new Set(nodes.map(node=>node.getBoundingClientRect().height))]);
    assert.deepEqual(sizes,[height]);
  }
  await q('#structure-combinations [data-structure-combination="max"]').screenshot({path:path.join(output,`${name}-ossature-max.png`)});
  await q('#structure-extremes [data-structure-extreme="neck"]').screenshot({path:path.join(output,`${name}-ossature-cou.png`)});
  for (const width of [1180,820,390]) {
    await page.setViewportSize({width,height:920});
    assert(await page.evaluate(w => document.querySelector('#planche-ossature').getBoundingClientRect().right <= w &&
      document.documentElement.scrollWidth<=w+1,width));
  }
  return {isolatedRasters, unchangedVertical, restored, studySamples:38};
}

async function checkCorrectionStudy(page, name) {
  const {structureCombinations} = await import('../structure-study.mjs');
  const panel = page.locator('#planche-corpulence');
  const select = panel.locator('#corpulence-study-structure');
  const expected = ['reference','fine','wide','min','max','upper','lower'];
  assert.deepEqual(await select.locator('option').evaluateAll(options=>options.map(({value})=>value)),expected);
  const neutralShapes = new Set();
  for (const [structure] of structureCombinations) {
    await select.selectOption(structure);
    assert.equal(await panel.locator('svg[aria-label^="Rasée ·"]').count(),36);
    for (const [scale,height] of [['head',300],['mini',70],['tile',178]]) {
      await panel.locator('#corpulence-study-scale').selectOption(scale);
      const sizes = await panel.locator('svg').evaluateAll(nodes=>
        [...new Set(nodes.map(node=>node.getBoundingClientRect().height))]);
      assert.deepEqual(sizes,[height]);
    }
    const pairs = await panel.locator('[data-corpulence-specimen]').evaluateAll(nodes=>nodes.map(node=>({
      body:node.dataset.corpulenceSpecimen,
      value:Number(node.closest('[data-corpulence-example]').dataset.corpulenceExample),
      shapes:['before','after'].map(phase=>node.querySelector(`[data-corpulence-phase="${phase}"] .body-shape path`).getAttribute('d'))
    })));
    for (const {body,value,shapes:[before,after]} of pairs) {
      if (value===50) {
        assert.equal(before,after,`${structure} · ${body}`);
        neutralShapes.add(after);
      } else assert.notEqual(before,after,`${structure} · ${body} · ${value}`);
    }
    const witnesses = structure === 'reference' ? ['0','75','87.5','100'] : ['max','lower'].includes(structure) ? ['100'] : [];
    for (const value of witnesses) await panel.locator(`[data-corpulence-example="${value}"]`).screenshot({
      path:path.join(output,`${name}-corpulence-${structure}-${value}.png`)
    });
  }
  assert.equal(neutralShapes.size,14);
  return {structures:expected.length, pairs:18*expected.length, scales:3};
}

async function checkCorpulence(page, old, url, name) {
  const {referenceStructure} = await import('../body-structure.mjs');
  const {corpulenceStops} = await import('../body-corpulence.mjs');
  const q = selector => page.locator(selector);
  const inputs = page => page.locator('#structure-controls input').evaluateAll(elements =>
    Object.fromEntries(elements.map(input=>[input.id.replace('structure-',''),input.valueAsNumber])));
  const choices = [
    {neck:72, shoulders:129, thorax:82, waist:121, pelvis:73, base:123},
    {neck:130, shoulders:130, thorax:130, waist:125, pelvis:130, base:130}
  ];
  const amounts = [37.125,87.5];
  const styles = ['p5-061:G','waist_waves:U'];
  const samples = [];
  let neutralExact=0, unchangedVertical=0, restored=0;
  const slider = q('#corpulence');

  await page.setViewportSize(old.viewportSize());
  await Promise.all([ready(page,url),ready(old,referenceURL)]);
  assert(!await slider.isVisible());
  assert.deepEqual(await q('#corpulence-stops option').evaluateAll(options =>
    options.map(option=>Number(option.value))),corpulenceStops.map(({value})=>value));
  for (const [index,body] of specimens.slice(6).entries()) {
    const structure=choices[index], amount=amounts[index];
    for (const target of [page,old]) {
      await target.locator('#historical').selectOption(styles[index]);
      await target.locator('#load-history').evaluate(button=>button.click());
      await target.locator('#morph').selectOption(index ? 'max' : 'tall');
      await target.locator('#body').selectOption(body);
      for (const [key,value] of Object.entries(structure)) await setRange(target,'structure-'+key,value);
    }
    assert(await slider.isVisible());
    assert.equal(await slider.inputValue(),'50');
    assert.equal(await slider.getAttribute('step'),'any');
    const [base, reference] = await Promise.all([compare(page),compare(old)]);
    const fingerprints = images => images.map(({original,raster,width,height}) => ({
      svg: createHash('sha256').update(original).digest('hex'),
      raster: createHash('sha256').update(raster).digest('hex'), width, height
    }));
    assert.deepEqual(fingerprints(base),fingerprints(reference),`Rendu de référence ${body}`);
    neutralExact += base.length;
    const geometry = await bodyVertical(page);
    const profile=[];
    for (const {value,label} of corpulenceStops) {
      await setRange(page,'corpulence',value);
      assert.equal(Number(await slider.inputValue()),value);
      assert.match(await slider.getAttribute('aria-valuetext'),new RegExp(label));
      assert.deepEqual(await inputs(page),structure);
      assert.deepEqual(await bodyVertical(page),geometry);
      unchangedVertical++;
      const images = await compare(page);
      for (let i=0; i<images.length; i++) assert.equal(images[i].outside,base[i].outside);
      if (value===50) assert.deepEqual(images,base);
      profile.push(images);
    }
    const bodyPixels = profile.map(images=>images[1].pixels);
    assert(bodyPixels.every((pixels,i)=>i===0 || pixels>bodyPixels[i-1]));
    const distinct = base.map((_,i)=>new Set(profile.map(images=>images[i].raster)).size);
    assert.deepEqual(distinct,[9,9,9]);
    samples.push({body,distinct,bodyPixels});

    await setRange(page,'corpulence',amount);
    const image = await compare(page);
    const json = await exportAppearance(page);
    let previousArchive = json;
    if (corpulenceCorrection) {
      await setRange(old,'corpulence',amount);
      previousArchive = await exportAppearance(old);
      assert.deepEqual(JSON.parse(previousArchive),JSON.parse(json));
    }
    const archive=JSON.parse(json);
    assert.equal(archive.version,13);
    assert.deepEqual(archive.character.structure,structure);
    assert.equal(archive.character.corpulence,amount);
    await q('#body').selectOption('broad');
    assert(!await slider.isVisible());
    await q('#body').selectOption(body);
    assert.deepEqual(await compare(page),image);
    await ready(page,url);
    await importAppearance(page,previousArchive);
    assert.equal(Number(await slider.inputValue()),amount);
    assert.deepEqual(await inputs(page),structure);
    assert.deepEqual(await compare(page),image);
    assert.deepEqual(JSON.parse(await exportAppearance(page)),archive);
    restored++;

    await q('#corpulence-reset').evaluate(button=>button.click());
    assert.equal(await slider.inputValue(),'50');
    assert.deepEqual(await inputs(page),structure);
    assert.deepEqual(await compare(page),base);
    assert.equal(JSON.parse(await exportAppearance(page)).version,12);
    await setRange(page,'corpulence',amount);
    await q('#structure-reset').evaluate(button=>button.click());
    assert.equal(Number(await slider.inputValue()),amount);
    assert.deepEqual(await inputs(page),referenceStructure);
  }

  await q('#body').selectOption('adult-h');
  await setRange(page,'corpulence',amounts[0]);
  await q('#body').selectOption('adult-f');
  assert.equal(Number(await slider.inputValue()),amounts[1]);
  await q('#body').selectOption('adult-h');
  assert.equal(Number(await slider.inputValue()),amounts[0]);
  await q('nav a[href="#planche-corpulence"]').click();
  await q('#corpulence-references [data-corpulence-specimen]').first().waitFor({state:'attached'});
  assert.equal(await q('#corpulence-references [data-corpulence-example]').count(),9);
  assert.equal(await q('#corpulence-references [data-corpulence-specimen]').count(),18);
  let studySamples = 38;
  if (corpulenceCorrection) studySamples = await checkCorrectionStudy(page,name);
  else {
    assert.equal(await q('#corpulence-combinations [data-corpulence-example]').count(),10);
    assert.equal(await q('#corpulence-combinations [data-corpulence-specimen]').count(),20);
    assert.equal(await q('#planche-corpulence svg[aria-label^="Rasée ·"]').count(),38);
    for (const [scale,height] of [['head',300],['mini',70],['tile',178]]) {
      await q('#corpulence-study-scale').selectOption(scale);
      const sizes = await q('#corpulence-references svg').evaluateAll(nodes =>
        [...new Set(nodes.map(node=>node.getBoundingClientRect().height))]);
      assert.deepEqual(sizes,[height]);
    }
    for (const [container,id] of [['references','0'],['references','100'],['combinations','max-100']]) {
      await q(`#corpulence-${container} [data-corpulence-example="${id}"]`).screenshot({
        path:path.join(output,`${name}-corpulence-${id}.png`)
      });
    }
  }
  for (const width of [1180,820,390]) {
    await page.setViewportSize({width,height:920});
    assert(await page.evaluate(w => document.querySelector('#planche-corpulence').getBoundingClientRect().right <= w &&
      document.documentElement.scrollWidth<=w+1,width));
  }
  return {samples,neutralExact,unchangedVertical,restored,studySamples};
}

async function checkChest(page, url, name) {
  const {chestControls,chestPresets,referenceChest}=await import('../chest.mjs');
  const q=selector=>page.locator(selector);
  const layer=/<g data-chest="adult-f"[^>]*>[^]*?<\/g>/;
  const paths=()=>q('#structure-live [data-chest] path').evaluateAll(nodes=>nodes.map(node=>node.getAttribute('d')));
  const enabled=()=>q('#chest-controls input:enabled').count();
  await page.setViewportSize({width:1180,height:820});
  await ready(page,url);
  for(const body of specimens.filter(body=>body!=='adult-f')) {
    await q('#body').selectOption(body);
    assert(!await q('#chest-panel').isVisible());
  }
  await q('#historical').selectOption('p5-061:G');
  await q('#load-history').evaluate(button=>button.click());
  await q('#body').selectOption('adult-f');
  assert(await q('#chest-panel').isVisible());
  assert.equal(await q('#chest-controls input').count(),8);
  assert.equal(await enabled(),1);
  const baseline=await compare(page);
  const names=chestPresets.map(([id])=>id);
  assert.deepEqual(await q('#chest-preset option').evaluateAll(options=>options.slice(1).map(({value})=>value)),names);
  const variants=new Set();
  for(const preset of names) {
    await q('#chest-preset').selectOption(preset);
    const shape=await paths();
    assert.equal(shape.length,8);
    variants.add(shape.join(' '));
    assert.equal(await enabled(),8);
    assert.equal(await q('#chest-volume').inputValue(),'53');
  }
  assert.equal(variants.size,6);
  await q('#chest-reset').evaluate(button=>button.click());
  await setRange(page,'chest-volume',53);
  let edits=0;
  for(const [key,{min,max,neutral}] of Object.entries(chestControls)) {
    const slider=q('#chest-'+key);
    assert.equal(Number(await slider.getAttribute('min')),min);
    assert.equal(Number(await slider.getAttribute('max')),max);
    await slider.press('Home');
    assert.equal(Number(await slider.inputValue()),min);
    const low=await paths();
    await slider.press('End');
    assert.equal(Number(await slider.inputValue()),max);
    assert.notDeepEqual(await paths(),low,key);
    await setRange(page,'chest-'+key,key==='volume' ? 53 : neutral);
    edits++;
  }
  const changed=await compare(page);
  assert(changed.every((image,i)=>image.original.replace(layer,'')===baseline[i].original));
  assert(changed.every((image,i)=>image.raster!==baseline[i].raster));
  await setRange(page,'corpulence',83.125);
  await setRange(page,'structure-thorax',76);
  await setRange(page,'chest-divergence',-32.75);
  await setRange(page,'chest-volume',0);
  assert.equal(await enabled(),1);
  const flat=await exportAppearance(page), document=JSON.parse(flat);
  assert.equal(document.version,14);
  assert.deepEqual(document.character.chest,{...referenceChest,divergence:-32.75});
  assert.equal(document.character.structure.thorax,76);
  assert.equal(document.character.corpulence,83.125);
  await q('#body').selectOption('adult-h');
  await q('#body').selectOption('adult-f');
  assert.equal(await q('#chest-divergence').inputValue(),'-32.75');
  await ready(page,url);
  await importAppearance(page,flat);
  assert.equal(await enabled(),1);
  assert.equal(await q('#chest-divergence').inputValue(),'-32.75');
  await setRange(page,'chest-volume',92);
  const raised=await paths();
  const active=await exportAppearance(page);
  await ready(page,url);
  await importAppearance(page,active);
  assert.deepEqual(await paths(),raised);
  assert.equal(await q('#chest-volume').inputValue(),'92');

  await q('nav a[href="#planche-poitrine"]').click();
  const panel=q('#planche-poitrine');
  assert.deepEqual(await Promise.all(['form','corpulence','structure'].map(kind=>q(`#chest-${kind}-cases figure`).count())),[19,9,9]);
  assert.equal(await panel.locator('[data-chest]').count(),36);
  assert.equal(await panel.locator('[data-chest-case="flat"] [data-chest]').count(),0);
  const palette=q('#chest-study-skin');
  const skins=await palette.locator('option').evaluateAll(options=>options.map(({value})=>value));
  assert.equal(skins.length,4);
  const colours=new Set();
  for(const skin of skins) {
    await palette.selectOption(skin);
    assert.equal(await panel.locator('.body-shape path').first().getAttribute('fill'),skin);
    colours.add(await panel.locator('[data-chest] path').first().getAttribute('fill'));
    for(const [scale,height] of [['head',300],['mini',70],['tile',178]]) {
      await q('#chest-study-scale').selectOption(scale);
      const heights=await panel.locator('svg').evaluateAll(nodes=>nodes.map(node=>node.getBoundingClientRect().height));
      assert.equal(heights.length,37);
      assert(heights.every(value=>value===height));
    }
  }
  assert.equal(colours.size,4);
  await q('#chest-study-scale').selectOption('detail');
  await palette.selectOption(skins[0]);
  for(const id of ['round-88','cone-53','low-88','corpulence-0-88','corpulence-100-26']) {
    await panel.locator(`[data-chest-case="${id}"]`).screenshot({path:path.join(output,`${name}-chest-${id}.png`)});
  }
  for(const width of [390,820,1180]) {
    await page.setViewportSize({width,height:920});
    assert(await page.evaluate(w=>document.documentElement.scrollWidth<=w+1,width));
  }
  return {edits,presets:variants.size,cases:37,skins:skins.length,scales:3,restored:2};
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
  const historicalBodies = structurePreview ? specimens : specimens.slice(0,6);
  for (const body of historicalBodies) {
    await Promise.all([q('#body').selectOption(body),old.locator('#body').selectOption(body)]);
    const [before,after] = await Promise.all([compare(old),compare(page)]);
    assert.deepEqual(after,before);
    assert.deepEqual(JSON.parse(await exportAppearance(page)),JSON.parse(await exportAppearance(old)));
    if (original.length<6) original.push(after);
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
  const structure = structurePreview ? await checkStructure(page,url,name) : undefined;
  const corpulence = corpulencePreview ? await checkCorpulence(page,old,url,name) : undefined;
  const chest = chestPreview ? await checkChest(page,url,name) : undefined;
  assert.deepEqual(errors,[]);
  return {name, version, historicalExact:historicalBodies.length*3, rasterBySize:[8,8,8],
    fittings:cases.length*2, coldImports:2, guidedLandmarks:14, ...(structure ? {structure} : {}),
    ...(corpulence ? {corpulence} : {}), ...(chest ? {chest} : {})};
}

async function files(url) {
  const response = await fetch(new URL('version.json',url));
  assert.equal(response.status,200);
  const manifest = await response.json();
  assert.equal(manifest.mission,mission);
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
