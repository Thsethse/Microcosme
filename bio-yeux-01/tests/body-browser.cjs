const assert = require('node:assert/strict');
const {createHash} = require('node:crypto');
const {mkdir, readFile, writeFile} = require('node:fs/promises');
const {createServer} = require('node:http');
const path = require('node:path');
const {chromium, webkit, devices} = require('playwright');

const mission = process.env.PREVIEW_MISSION ?? 'BIO-CORPS-01';
const chestPreview = mission === 'BIO-CORPS-04-A';
const chestR02 = mission === 'BIO-CORPS-04-A-R02';
const abdominalPreview = mission === 'BIO-CORPS-05-B';
const boneReliefPreview = mission === 'BIO-CORPS-05-A' || abdominalPreview;
const thoraxDetailsPreview = mission === 'BIO-CORPS-04-C' || boneReliefPreview;
const pectoralPreview = mission === 'BIO-CORPS-04-B' || thoraxDetailsPreview;
const chestCorrection = mission === 'BIO-CORPS-04-A-R01' || chestR02;
const corpulenceCorrection = mission === 'BIO-CORPS-03-R01' || chestPreview || chestCorrection || pectoralPreview;
const corpulencePreview = mission === 'BIO-CORPS-03' || corpulenceCorrection;
const structurePreview = mission === 'BIO-CORPS-02' || corpulencePreview;
const pages = 'https://thsethse.github.io/Microcosme/preview/';
const output = process.env.ARTIFACT_DIR ?? '/tmp/microcosme-' + mission.toLowerCase();
const published = pages + mission.toLowerCase() + '/';
const predecessors = {'BIO-CORPS-05-B':'bio-corps-05-a/', 'BIO-CORPS-05-A':'bio-corps-04-c/', 'BIO-CORPS-04-C':'bio-corps-04-b/', 'BIO-CORPS-04-B':'bio-corps-04-a-r02/', 'BIO-CORPS-04-A-R02':'bio-corps-04-a-r01/', 'BIO-CORPS-04-A-R01':'bio-corps-04-a/', 'BIO-CORPS-04-A':'bio-corps-03-r01/', 'BIO-CORPS-03-R01':'bio-corps-03/', 'BIO-CORPS-03':'bio-corps-02/', 'BIO-CORPS-02':'bio-corps-01/'};
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
  return page.locator(reference).evaluateAll((svgs,stripBoneReliefs) => Promise.all(svgs.map(async svg => {
    const {width,height} = svg.getBoundingClientRect();
    const clone = svg.cloneNode(true);
    if (stripBoneReliefs) clone.querySelector('[data-bone-reliefs]')?.remove();
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
    const body = silhouette.outerHTML.replace(/atelier-yeux-\d+/g,'fixed');
    silhouette.remove();
    return {width:Math.round(width),height,original,body,outside:serialize(),raster:canvas.toDataURL(),pixels};
  })),boneReliefPreview);
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
  const current=await import('../chest.mjs');
  const retired={divergence:{min:-100,max:100,neutral:0},position:{min:0,max:100,neutral:52}};
  const chestControls={...current.chestControls,...retired};
  const referenceChest={...current.referenceChest,divergence:0,position:52};
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
  const names=['round','drop','long','cone','divergent','low'];
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
  await panel.locator('[data-chest-case]').first().waitFor({state:'attached'});
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

async function checkChestOcclusion(page) {
  const proof=await page.locator('#structure-live svg').evaluate(async svg=>{
    const outline=svg.querySelector('.body-shape > path');
    const right=svg.querySelectorAll('[data-chest-surface]')[1];
    const stroke=svg.querySelector('[data-chest-occlusion]');
    const probes=[];
    for(let distance=0;distance<outline.getTotalLength();distance+=.9) {
      const {x,y}=outline.getPointAtLength(distance);
      if(x>80 && y>141 && y<183 && [[0,0],[3,0],[-3,0],[0,3],[0,-3]].every(([dx,dy])=>
        right.isPointInFill(new DOMPoint(x+dx,y+dy)))) probes.push([x,y]);
    }
    const raster=async visible=>{
      const picture=svg.cloneNode(true);
      picture.setAttribute('viewBox','0 115 160 100');
      picture.setAttribute('width','640'); picture.setAttribute('height','400');
      if(!visible) {
        picture.querySelector('[data-chest]').remove();
        picture.querySelector('[data-chest-occlusion]').removeAttribute('mask');
      }
      const image=new Image();
      image.src='data:image/svg+xml,'+encodeURIComponent(new XMLSerializer().serializeToString(picture));
      await image.decode();
      const canvas=document.createElement('canvas');canvas.width=640;canvas.height=400;
      const context=canvas.getContext('2d');context.drawImage(image,0,0);
      return probes.map(([x,y])=>Array.from(context.getImageData(Math.round(x*4),Math.round((y-115)*4),1,1).data));
    };
    const [first,second]=await Promise.all([raster(false),raster(true)]);
    const covered=second.filter(([r,g,b,a],i)=>a===255 && Math.abs(r-first[i][0])+Math.abs(g-first[i][1])+Math.abs(b-first[i][2])>14).length;
    return {probes:probes.length,covered,matchingPath:outline.getAttribute('d')===stroke.getAttribute('d')};
  });
  assert(proof.matchingPath && proof.covered>=5 && proof.covered===proof.probes,JSON.stringify(proof));
  return proof.covered;
}

async function checkChestCorrection(page, old, url, name) {
  const {chestControls,chestStops,referenceChest}=await import('../chest.mjs');
  const {outlineCurves,stripX}=await import('../bezier.mjs');
  const q=selector=>page.locator(selector);
  const activePaths=()=>q('#structure-live [data-chest] path').evaluateAll(nodes=>nodes.map(node=>node.getAttribute('d')));
  const enabled=()=>q('#chest-controls input:enabled').count();
  const bodyPath=target=>target.locator('#structure-live .body-shape > path').first().getAttribute('d');
  const openAdult=async(target,href)=>{
    await ready(target,href);
    await target.locator('#historical').selectOption('shaved:U');
    await target.locator('#load-history').evaluate(button=>button.click());
    await target.locator('#body').selectOption('adult-f');
  };
  await page.setViewportSize({width:1180,height:820});
  await openAdult(page,url);
  assert.equal(await q('#chest-preset, #chest-divergence, #chest-position').count(),0);
  assert.equal(await q('#chest-controls input').count(),6);
  assert.equal(await enabled(),1);
  const base=await bodyPath(page);
  const images=[];
  for(const [volume,label] of chestStops) {
    await setRange(page,'chest-volume',volume);
    assert.equal(await q('#chest-volume').getAttribute('aria-valuetext'),`${volume} % · ${label}`);
    assert.equal(await enabled(),volume ? 6 : 1);
    const path=await bodyPath(page);
    if(chestR02 || volume<=50) assert.equal(path,base);
    else assert.notEqual(path,base);
    images.push(await compare(page));
  }
  assert.deepEqual([0,1,2].map(index=>new Set(images.map(image=>image[index].raster)).size),[5,5,5]);
  let covered;
  if(chestR02) {
    await setRange(page,'corpulence',0);
    await setRange(page,'chest-width',100);
    covered=await checkChestOcclusion(page);
    await setRange(page,'corpulence',50);
    await setRange(page,'chest-width',referenceChest.width);
  } else {
    const at=(path,y)=>Math.max(...stripX(outlineCurves(path),y));
    assert(at(await bodyPath(page),148)>at(base,148)+9);
    assert.equal(at(await bodyPath(page),217),at(base,217));
  }
  await setRange(page,'chest-volume',75);
  for(const [key,{min,max,neutral}] of Object.entries(chestControls)) {
    const slider=q('#chest-'+key);
    assert.equal(Number(await slider.getAttribute('min')),min);
    assert.equal(Number(await slider.getAttribute('max')),max);
    await slider.press('Home');
    assert.equal(Number(await slider.inputValue()),min);
    const before=await activePaths();
    await slider.press('End');
    assert.equal(Number(await slider.inputValue()),max);
    assert.notDeepEqual(await activePaths(),before,key);
    await setRange(page,'chest-'+key,key==='volume' ? 75 : neutral);
    if(chestR02) assert.equal(await bodyPath(page),base);
  }
  await q('#body').selectOption('adult-h');
  assert(!await q('#chest-panel').isVisible());
  await q('#body').selectOption('adult-f');
  assert.equal(await q('#chest-volume').inputValue(),'75');

  await openAdult(old,referenceURL);
  await setRange(old,'corpulence',83.125);
  await setRange(old,'structure-thorax',76);
  await setRange(old,'chest-volume',80);
  if(chestR02) {
    const previous=JSON.parse(await exportAppearance(old));
    Object.assign(previous,{version:14,renderer:'bio-corps-04-a-svg@1'});
    Object.assign(previous.character.chest,{divergence:-32.75,position:68.5});
    await importAppearance(old,JSON.stringify(previous));
  } else {
    await setRange(old,'chest-divergence',-32.75);
    await setRange(old,'chest-position',68.5);
  }
  const legacy=await exportAppearance(old);
  assert.equal(JSON.parse(legacy).version,chestR02 ? 15 : 14);
  await ready(page,url);
  await importAppearance(page,legacy);
  assert.match(await q('#appearance-message').textContent(),chestR02 ? /v15 ouverte avec le rendu R02/ : /v14 adaptée à R01/);
  assert.equal(await q('#chest-volume').inputValue(),'80');
  assert.equal(await q('#structure-thorax').inputValue(),'76');
  assert.equal(await q('#corpulence').inputValue(),'83.125');
  const active=await exportAppearance(page);
  const archive=JSON.parse(active);
  assert.equal(archive.version,chestR02 ? 16 : 15);
  assert.deepEqual(archive.character.chest,{...referenceChest,volume:80});
  assert.deepEqual(archive.character.chestOrigin,{divergence:-32.75,position:68.5});
  await ready(page,url);
  await importAppearance(page,active);
  assert.deepEqual(JSON.parse(await exportAppearance(page)),archive);
  await setRange(page,'chest-volume',0);
  assert.equal(await enabled(),1);
  const flat=await exportAppearance(page);
  await ready(page,url);
  await importAppearance(page,flat);
  assert.deepEqual(JSON.parse(await exportAppearance(page)),JSON.parse(flat));

  await q('nav a[href="#planche-poitrine"]').click();
  const panel=q('#planche-poitrine');
  await panel.locator('[data-chest-case]').first().waitFor({state:'attached'});
  const counts=chestR02 ? {volume:5,heavy:4,form:15,context:11} : {volume:5,form:15,context:9};
  const pairCount=Object.values(counts).reduce((a,b)=>a+b,0);
  assert.deepEqual(await Promise.all(Object.keys(counts).map(kind=>q(`#chest-${kind}-cases article`).count())),Object.values(counts));
  assert.equal(await panel.locator('[data-chest-phase="after"] [data-chest]').count(),pairCount-1);
  assert.equal(await panel.locator('[data-chest-phase="before"] [data-chest]').count(),pairCount-1);
  const palette=q('#chest-study-skin');
  const skins=await palette.locator('option').evaluateAll(options=>options.map(({value})=>value));
  assert.equal(skins.length,4);
  for(const skin of skins) {
    await palette.selectOption(skin);
    assert.equal(await panel.locator('.body-shape path').first().getAttribute('fill'),skin);
    for(const [scale,height] of [['head',300],['mini',70],['tile',178]]) {
      await q('#chest-study-scale').selectOption(scale);
      const heights=await panel.locator('svg').evaluateAll(nodes=>nodes.map(node=>node.getBoundingClientRect().height));
      assert.equal(heights.length,2*pairCount);
      assert(heights.every(value=>value===height));
    }
  }
  await q('#chest-study-scale').selectOption('detail');
  await palette.selectOption(skins[0]);
  const ids=['volume-25','volume-50','volume-75','volume-100','width-100','fine-0'];
  if(chestR02) {
    ids.push('heavy-25','heavy-100','extreme-min','extreme-max');
    assert.equal(await panel.locator('[data-chest-phase="after"] svg').first().getAttribute('viewBox'),'10 115 140 88');
  }
  for(const id of ids) {
    await panel.locator(`[data-chest-case="${id}"]`).screenshot({path:path.join(output,`${name}-chest-${chestR02 ? 'r02' : 'r01'}-${id}.png`)});
  }
  for(const width of [390,820,1180]) {
    await page.setViewportSize({width,height:920});
    assert(await page.evaluate(w=>document.documentElement.scrollWidth<=w+1,width));
  }
  return {edits:6, volumes:5, pairs:pairCount, skins:4, scales:3,
    ...(chestR02 ? {covered,v15Migrated:1,v16Restored:2} : {v14Migrated:1,v15Restored:2})};
}

async function checkPectoralEdition(page,old,url,name) {
  const {pectoralControls,referencePectorals}=await import('../pectorals.mjs');
  const {chestControls,referenceChest}=await import('../chest.mjs');
  const q=selector=>page.locator(selector);
  const torse=body=>q(`[data-thorax-body="adult-${body}"]`);
  const live=selector=>q('#structure-live '+selector);
  const bodyPath=()=>live('.body-shape > path').first().getAttribute('d');
  const layer=prefix=>live(prefix==='chest' ? '[data-chest]' : '[data-pectorals]');
  const open=async id=>{
    await page.goto('about:blank');
    await ready(page,url+'#'+id);
  };
  const touch=async(slider,ratio)=>{
    await slider.scrollIntoViewIfNeeded();
    const box=await slider.boundingBox();
    await slider.tap({position:{x:Math.round(box.width*ratio),y:Math.round(box.height/2)}});
    const value=Number(await slider.inputValue());
    assert(Math.abs(value-100*ratio)<19,`${value} au toucher`);
    return value;
  };
  const fields=async(prefix,controls)=>{
    assert.equal(await q(`#${prefix}-controls input:enabled`).count(),Object.keys(controls).length);
    for(const [key,{min,max,neutral}] of Object.entries(controls)) {
      const range=q(`#${prefix}-${key}`);
      assert.equal(Number(await range.getAttribute('min')),min);
      assert.equal(Number(await range.getAttribute('max')),max);
      await range.press('Home');
      const before=await layer(prefix).evaluateAll(nodes=>nodes.map(node=>node.innerHTML));
      await range.press('End');
      assert.equal(Number(await range.inputValue()),max);
      const after=await layer(prefix).evaluateAll(nodes=>nodes.map(node=>node.innerHTML));
      assert(before.join('')!==after.join(''),`${prefix} · ${key}`);
      await setRange(page,`${prefix}-${key}`,key==='volume' ? 75 : neutral);
    }
  };
  await page.setViewportSize({width:1180,height:820});
  await open('atelier-thorax');
  assert(await torse('h').isVisible() && await torse('f').isVisible());
  assert(!await q('#body-controls').isVisible());
  await torse('h').tap();
  assert.equal(await q('#body').inputValue(),'adult-h');
  assert(await q('#pectoral-panel').isVisible() && !await q('#chest-panel').isVisible());
  assert.equal(await q('#pectoral-controls input').count(),5);
  assert.equal(await q('#pectoral-controls input:enabled').count(),1);
  const base=await bodyPath();
  await touch(q('#pectoral-volume'),.70);
  assert.equal(await live('[data-pectorals] path').count(),6);
  await fields('pectoral',pectoralControls);
  assert.equal(await bodyPath(),base);
  const stages=[];
  for(const volume of [0,50,100]) {
    await setRange(page,'pectoral-volume',volume);
    stages.push(await compare(page));
    assert.equal(await bodyPath(),base);
  }
  assert.deepEqual([0,1,2].map(i=>new Set(stages.map(stage=>stage[i].raster)).size),[3,3,3]);
  await setRange(page,'structure-thorax',78);
  await setRange(page,'corpulence',91.25);
  await setRange(page,'pectoral-definition',81.125);
  const active=await exportAppearance(page), doc=JSON.parse(active);
  assert.equal(doc.version,17);
  assert.equal(doc.character.corpulence,91.25);
  assert.equal(doc.character.structure.thorax,78);
  assert.deepEqual(doc.character.pectorals,{...referencePectorals,volume:100,definition:81.125});
  const pectoralPaths=await layer('pectoral').evaluateAll(nodes=>nodes.map(node=>node.innerHTML));
  await open('atelier-thorax');
  await importAppearance(page,active);
  assert.deepEqual(await layer('pectoral').evaluateAll(nodes=>nodes.map(node=>node.innerHTML)),pectoralPaths);
  await setRange(page,'pectoral-volume',0);
  assert.equal(await q('#pectoral-controls input:enabled').count(),1);
  const flat=await exportAppearance(page);
  await open('atelier-thorax');
  await importAppearance(page,flat);
  assert.equal(await q('#pectoral-definition').inputValue(),'81.125');
  assert.equal(await layer('pectoral').count(),0);

  await torse('f').tap();
  assert.equal(await q('#body').inputValue(),'adult-f');
  assert(await q('#chest-panel').isVisible() && !await q('#pectoral-panel').isVisible());
  assert.equal(await q('#chest-controls input').count(),6);
  const order=await q('#chest-panel').evaluate(panel=>panel.compareDocumentPosition(document.querySelector('#structure-panel')));
  assert(order&4);
  assert.equal(await q('#chest-controls input:enabled').count(),1);
  await touch(q('#chest-volume'),.68);
  const width=await touch(q('#chest-width'),.76);
  assert(width!==referenceChest.width);
  await fields('chest',chestControls);
  const current=await compare(page);
  const portrait=await exportAppearance(page);
  assert.equal(JSON.parse(portrait).version,16);
  await old.setViewportSize({width:1180,height:820});
  await ready(old,referenceURL);
  await importAppearance(old,portrait);
  const digest=images=>images.map(({original,raster})=>createHash('sha256').update(original).update(raster).digest('hex'));
  assert.deepEqual(digest(await compare(old)),digest(current));
  const accepted=await exportAppearance(old);
  await open('atelier-thorax');
  await importAppearance(page,accepted);
  assert.deepEqual(digest(await compare(page)),digest(current));
  assert.deepEqual(JSON.parse(await exportAppearance(page)),JSON.parse(accepted));

  await open('planche-pectoraux');
  const panel=q('#planche-pectoraux');
  await panel.locator('[data-pectoral-case]').first().waitFor({state:'visible'});
  const counts={matrix:9,axes:15,structure:5,comparison:3};
  for(const [id,count] of Object.entries(counts)) assert.equal(await q(`#pectoral-${id} [data-pectoral-case]`).count(),count);
  assert.equal(await q('#pectoral-comparison [data-pectorals]').count(),3);
  assert.equal(await q('#pectoral-comparison [data-chest]').count(),3);
  const skin=q('#pectoral-study-skin');
  const colours=await skin.locator('option').evaluateAll(options=>options.map(option=>option.value));
  assert.equal(colours.length,4);
  for(const colour of colours) {
    await skin.selectOption(colour);
    assert.equal(await panel.locator('.body-shape path').first().getAttribute('fill'),colour);
    for(const [scale,height] of [['head',300],['mini',70],['tile',178]]) {
      await q('#pectoral-study-scale').selectOption(scale);
      const heights=await panel.locator('svg').evaluateAll(nodes=>nodes.map(svg=>svg.getBoundingClientRect().height));
      assert.equal(heights.length,35);
      assert(heights.every(value=>value===height));
    }
  }
  for(const id of ['matrix-25-0','matrix-50-50','matrix-100-100','axis-angularity-100','comparison-100']) {
    await panel.locator(`[data-pectoral-case="${id}"]`).screenshot({path:path.join(output,`${name}-pectoral-${id}.png`)});
  }
  for(const width of [390,820,1180]) {
    await page.setViewportSize({width,height:920});
    assert(await page.evaluate(w=>document.documentElement.scrollWidth<=w+1,width));
  }
  return {axesH:5,axesF:6,gestures:3,matrix:9,cases:32,skins:4,scales:3,versionH:17,versionF:16};
}

async function checkThoraxDetails(page,url,name) {
  const {thoraxDetailControls,referenceThoraxDetails}=await import('../thorax-details.mjs');
  const q=selector=>page.locator(selector);
  const layer=q('#structure-live [data-thorax-details]');
  const outline=()=>q('#structure-live svg').evaluate(svg=>{
    const clone=svg.cloneNode(true);
    clone.querySelector('[data-thorax-details]')?.remove();
    return new XMLSerializer().serializeToString(clone).replace(/atelier-yeux-\d+/g,'fixed');
  });
  const placement=()=>layer.locator('[data-areola]').last().evaluate(node=>[node.getAttribute('cx'),node.getAttribute('cy')]);
  const open=async fragment=>{
    await page.goto('about:blank');
    await ready(page,url+'#'+fragment);
  };
  await page.setViewportSize({width:810,height:1080});
  await open('atelier-thorax');
  assert(!await q('#thorax-details-link').isVisible());
  for (const key of ['adult-h','adult-f']) {
    const group=key==='adult-h' ? 'pectoral' : 'chest';
    await q(`[data-thorax-body="${key}"]`).tap();
    await q('#thorax-details-link').tap();
    assert.equal(await page.evaluate(()=>location.hash),'#thorax-details-panel');
    assert.equal(await q('#thorax-details-controls input:enabled').count(),7);
    assert.equal(await layer.count(),0);
    const baseline=await outline();
    const first=q('#thorax-detail-size');
    const box=await first.boundingBox();
    await first.tap({position:{x:Math.round(box.width*.68),y:Math.round(box.height/2)}});
    assert(Number(await first.inputValue())>50);
    assert.equal(await layer.getAttribute('data-thorax-details'),key);
    assert(await q('#thorax-live-detail [data-areola]').first().isVisible());
    assert.equal(await q(`#structure-live [data-${group==='chest' ? 'chest' : 'pectorals'}]`).count(),0);
    assert.equal(await outline(),baseline);
    for (const [id,{min,max}] of Object.entries(thoraxDetailControls)) {
      const range=q('#thorax-detail-'+id);
      assert.equal(Number(await range.getAttribute('min')),min);
      assert.equal(Number(await range.getAttribute('max')),max);
      await range.press('Home');
      const before=await layer.innerHTML();
      await range.press('End');
      assert.equal(Number(await range.inputValue()),100);
      assert.notEqual(await layer.innerHTML(),before,`${key} ${id}`);
      await setRange(page,'thorax-detail-'+id,referenceThoraxDetails[key][id]);
    }
    const flat=await placement();
    await setRange(page,group+'-volume',90);
    let last=await placement();
    assert.notDeepEqual(last,flat);
    for (const [id,value] of [[group+'-width',92],
      ...(group==='chest' ? [['chest-sag',93],['chest-spacing',94]] : [['pectoral-height',87]]),
      ['structure-thorax',71],['corpulence',100]]) {
      await setRange(page,id,value);
      const now=await placement();
      assert.notDeepEqual(now,last,id);
      last=now;
    }
    await setRange(page,'thorax-detail-pigment',46.125);
    const saved=await exportAppearance(page), data=JSON.parse(saved);
    assert.equal(data.version,18);
    assert.deepEqual(data.character.thoraxDetails,{...referenceThoraxDetails[key],pigment:46.125});
    assert.equal(data.character[group==='chest' ? 'chest' : 'pectorals'].width,92);
    const layerBefore=await layer.innerHTML(), carrierBefore=await outline();
    await open('atelier-thorax');
    await importAppearance(page,saved);
    assert.equal(await layer.innerHTML(),layerBefore);
    assert.equal(await outline(),carrierBefore);
    assert.deepEqual(JSON.parse(await exportAppearance(page)),data);
    await setRange(page,group+'-volume',0);
    const flatSaved=await exportAppearance(page), flatLayer=await layer.innerHTML();
    await open('atelier-thorax');
    await importAppearance(page,flatSaved);
    assert.equal(await layer.innerHTML(),flatLayer);
    assert.equal(await q('#thorax-detail-pigment').inputValue(),'46.125');
  }
  await open('planche-details-thorax');
  const panel=q('#planche-details-thorax');
  await panel.locator('[data-thorax-axis]').first().waitFor({state:'visible'});
  assert.equal(await panel.locator('[data-thorax-axis]').count(),21);
  assert.equal(await panel.locator('[data-thorax-carrier]').count(),7);
  assert.equal(await panel.locator('[data-areola]').count(),112);
  const skin=q('#thorax-details-study-skin');
  const colours=await skin.locator('option').evaluateAll(options=>options.map(option=>option.value));
  assert.equal(colours.length,4);
  const pigments=[];
  for (const colour of colours) {
    await skin.selectOption(colour);
    assert.equal(await panel.locator('.body-shape path').first().getAttribute('fill'),colour);
    pigments.push(await panel.locator('[data-areola]').first().getAttribute('fill'));
  }
  assert.equal(new Set(pigments).size,4);
  for (const [scale,height] of [['tile',178],['head',300],['mini',70]]) {
    await q('#thorax-details-study-scale').selectOption(scale);
    assert.deepEqual(await panel.locator('svg').evaluateAll(nodes=>[...new Set(nodes.map(svg=>svg.getBoundingClientRect().height))]),[height]);
    assert.equal(await panel.locator('[data-nipple-shadow]').count(),scale==='mini' ? 0 : 104);
  }
  await q('#thorax-details-study-scale').selectOption('detail');
  await skin.selectOption(colours[0]);
  for (const id of ['flat','wide','maximum']) {
    await panel.locator(`[data-thorax-carrier="${id}"]`).screenshot({path:path.join(output,`${name}-thorax-${id}.png`)});
  }
  for (const width of [390,810,1180]) {
    await page.setViewportSize({width,height:920});
    assert(await page.evaluate(w=>document.documentElement.scrollWidth<=w+1,width));
  }
  return {axesH:7,axesF:7,touch:2,archivesV18:4,pairedAxes:21,pairedCarriers:7,skins:4,scales:3};
}

async function checkBoneReliefEdition(page,old,url,name) {
  const {corpulenceStops}=await import('../body-corpulence.mjs');
  const q=selector=>page.locator(selector);
  const relief=q('#structure-live [data-bone-reliefs]');
  const open=async fragment=>{
    await page.goto('about:blank');
    await ready(page,url+'#'+fragment);
  };
  const strength=()=>relief.locator('g').evaluateAll(families=>
    families.map(family=>Number(family.querySelector('path').getAttribute('opacity'))));
  await page.setViewportSize({width:810,height:1080});
  await open('atelier-thorax');
  assert(!await q('#corpulence-link').isVisible());
  const archives=[];
  for (const body of ['adult-h','adult-f']) {
    await q(`[data-thorax-body="${body}"]`).tap();
    await q('#corpulence-link').tap();
    assert.equal(await page.evaluate(()=>location.hash),'#structure-panel');
    const slider=q('#corpulence');
    await slider.scrollIntoViewIfNeeded();
    const box=await slider.boundingBox();
    await slider.tap({position:{x:Math.round(box.width*.17),y:Math.round(box.height/2)}});
    assert(Number(await slider.inputValue())<30);
    assert.equal(await relief.locator('g').count(),4);
    let previous=Array(4).fill(1);
    for (const {value} of corpulenceStops) {
      await setRange(page,'corpulence',value);
      if (value===100) assert.equal(await relief.count(),0);
      else {
        const current=await strength();
        assert.equal(current.length,4);
        assert(current.every((amount,i)=>amount<previous[i]));
        previous=current;
      }
    }
    await setRange(page,'corpulence',17.125);
    const positions=()=>relief.locator('g > path:first-child').evaluateAll(paths=>paths.map(path=>path.getAttribute('d')));
    const neutral=await positions();
    await setRange(page,'structure-thorax',77);
    await setRange(page,'structure-pelvis',129);
    const adjusted=await positions();
    assert.notEqual(adjusted[1],neutral[1]);
    assert.notEqual(adjusted[3],neutral[3]);
    await setRange(page,body==='adult-h' ? 'pectoral-volume' : 'chest-volume',95);
    await q('#thorax-details-reference').evaluate(button=>button.click());
    const legacy=await exportAppearance(page), document=JSON.parse(legacy);
    assert.equal(document.version,18);
    assert.equal(document.character.corpulence,17.125);
    assert.equal(document.character.structure.thorax,77);
    assert(!Object.hasOwn(document.character,'boneReliefs'));
    const savedLayer=await relief.innerHTML();
    await open('atelier-thorax');
    await importAppearance(page,legacy);
    assert.equal(await relief.innerHTML(),savedLayer);
    assert.deepEqual(JSON.parse(await exportAppearance(page)),document);
    archives.push({legacy,signature:await compare(page)});
    // Begin the next base with independent preferences.
    await open('atelier-thorax');
  }
  await old.setViewportSize(page.viewportSize());
  await ready(old,referenceURL);
  for (const {legacy,signature} of archives) {
    await importAppearance(old,legacy);
    assert.deepEqual(await compare(old),signature);
  }

  await open('planche-reliefs-osseux');
  const panel=q('#planche-reliefs-osseux');
  await panel.locator('[data-bone-study-level]').first().waitFor({state:'visible'});
  assert.equal(await panel.locator('[data-bone-study-level]').count(),9);
  assert.equal(await panel.locator('[data-bone-study-phase="before"] svg').count(),18);
  assert.equal(await panel.locator('[data-bone-study-phase="after"] svg').count(),18);
  assert.equal(await panel.locator('[data-bone-study-phase="before"] [data-bone-reliefs]').count(),0);
  assert.equal(await panel.locator('[data-bone-study-phase="after"] [data-bone-reliefs]').count(),16);
  const firstPath=q('[data-bone-study-level="0"] [data-bone-family="lateral-ribs"] path').first();
  const referencePath=await firstPath.getAttribute('d');
  const structures=q('#bone-relief-structure');
  assert.equal(await structures.locator('option').count(),7);
  for (const id of ['fine','wide','min','max']) {
    await structures.selectOption(id);
    assert.notEqual(await firstPath.getAttribute('d'),referencePath);
  }
  await structures.selectOption('reference');
  const skin=q('#bone-relief-skin');
  const colours=await skin.locator('option').evaluateAll(options=>options.map(option=>option.value));
  assert.equal(colours.length,4);
  const fills=[];
  for (const colour of colours) {
    await skin.selectOption(colour);
    assert.equal(await panel.locator('.body-shape path').first().getAttribute('fill'),colour);
    fills.push(await firstPath.getAttribute('fill'));
  }
  assert.equal(new Set(fills).size,4);
  await skin.selectOption(colours[0]);

  for (const [scale,height] of [['tile',178],['head',300],['mini',70]]) {
    await q('#bone-relief-scale').selectOption(scale);
    assert.deepEqual(await panel.locator('svg').evaluateAll(nodes=>[...new Set(nodes.map(svg=>svg.getBoundingClientRect().height))]),[height]);
    assert.equal(await panel.locator('[data-bone-family] path').count(),scale==='mini' ? 160 : 320);
    await q('[data-bone-study-level="0"]').screenshot({path:path.join(output,`${name}-bone-reliefs-${scale}.png`)});
  }
  await q('#bone-relief-scale').selectOption('detail');
  const coverage=[];
  for (const body of ['adult-h','adult-f']) {
    const card=q(`[data-bone-study-coverage="${body}"]`);
    const result=await card.locator('[data-bone-study-carrier="volume"] svg').evaluate(async(svg,body)=>{
      const frame=svg.viewBox.baseVal;
      const bones=[...svg.querySelectorAll('[data-bone-family] path')];
      const surfaces=[...svg.querySelectorAll(body==='adult-h' ? '[data-pectoral-plane]' : '[data-chest-surface]')];
      const scale=3;
      async function raster(withReliefs) {
        const copy=svg.cloneNode(true);
        if (!withReliefs) copy.querySelector('[data-bone-reliefs]').remove();
        const canvas=document.createElement('canvas');
        canvas.width=frame.width*scale;
        canvas.height=frame.height*scale;
        copy.setAttribute('width',canvas.width);
        copy.setAttribute('height',canvas.height);
        const image=new Image();
        image.src='data:image/svg+xml,'+encodeURIComponent(new XMLSerializer().serializeToString(copy));
        await image.decode();
        const ctx=canvas.getContext('2d');
        ctx.drawImage(image,0,0);
        return ctx.getImageData(0,0,canvas.width,canvas.height).data;
      }
      const [withReliefs,withoutReliefs]=await Promise.all([raster(true),raster(false)]);
      const filled=(paths,x,y)=>paths.some(path=>{
        const bounds=path.getBBox();
        return x>=bounds.x && x<=bounds.x+bounds.width && y>=bounds.y && y<=bounds.y+bounds.height &&
          path.isPointInFill(new DOMPoint(x,y));
      });
      let covered=0,changedUnderVolume=0,visible=0;
      for (let y=123;y<200;y++) for (let x=53;x<107;x++) {
        if (!filled(bones,x,y)) continue;
        const index=((y-frame.y)*scale*frame.width*scale+(x-frame.x)*scale)*4;
        const changed=[0,1,2,3].some(channel=>withReliefs[index+channel]!==withoutReliefs[index+channel]);
        // Stay one SVG unit away from the anti-aliased edge of the carrier.
        if ([[0,0],[-1,0],[1,0],[0,-1],[0,1]].every(([dx,dy])=>filled(surfaces,x+dx,y+dy))) {
          covered++;
          changedUnderVolume+=Number(changed);
        } else if (!filled(surfaces,x,y) && changed) visible++;
      }
      return {covered,changedUnderVolume,visible};
    },body);
    assert(result.covered>=5 && result.visible>=10,JSON.stringify({body,...result}));
    assert.equal(result.changedUnderVolume,0,JSON.stringify({body,...result}));
    coverage.push({body,...result});
    await card.screenshot({path:path.join(output,`${name}-bone-reliefs-coverage-${body}.png`)});
  }
  for (const width of [390,810,1180]) {
    await page.setViewportSize({width,height:920});
    assert(await page.evaluate(w=>document.documentElement.scrollWidth<=w+1,width));
  }
  return {families:4,levels:9,adultBases:2,references:36,coverage,archives:2,skins:4,structures:7,scales:3};
}

async function checkAbdominalEdition(page,old,url,name) {
  const {abdominalControls,referenceAbdominals}=await import('../abdominals.mjs');
  const q=selector=>page.locator(selector);
  const layer=q('#structure-live [data-abdominals]');
  const open=async fragment=>{
    await page.goto('about:blank');
    await ready(page,url+'#'+fragment);
  };
  const outline=()=>q('#structure-live svg').evaluate(svg=>{
    const clone=svg.cloneNode(true);
    clone.querySelector('[data-abdominals]')?.remove();
    return new XMLSerializer().serializeToString(clone).replace(/atelier-yeux-\d+/g,'fixed');
  });
  const tap=async(slider,fraction)=>{
    await slider.scrollIntoViewIfNeeded();
    const {width,height}=await slider.boundingBox();
    await slider.tap({position:{x:Math.round(width*fraction),y:Math.round(height/2)}});
    return Number(await slider.inputValue());
  };
  await page.setViewportSize({width:810,height:1080});
  await open('atelier-thorax');
  assert(!await q('#abdominal-link').isVisible());
  const legacy=[];
  for (const body of ['adult-h','adult-f']) {
    await q(`[data-thorax-body="${body}"]`).tap();
    await q('#abdominal-link').tap();
    assert.equal(await page.evaluate(()=>location.hash),'#abdominal-panel');
    assert.equal(await q('#abdominal-controls input').count(),4);
    assert.equal(await q('#abdominal-controls input:enabled').count(),1);
    assert(await q('#abdominal-flat-note').isVisible());
    const baseline=await outline();
    legacy.push({archive:await exportAppearance(page),signature:await compare(page)});
    for (const [key,{min,max,neutral}] of Object.entries(abdominalControls)) {
      const slider=q('#abdominal-'+key);
      assert.equal(Number(await slider.getAttribute('min')),min);
      assert.equal(Number(await slider.getAttribute('max')),max);
      assert(await tap(slider,.22)<35);
      const before=await layer.innerHTML();
      assert(await tap(slider,.82)>66);
      assert.notEqual(await layer.innerHTML(),before,key);
      await setRange(page,'abdominal-'+key,key==='volume' ? 85 : neutral);
    }
    assert.equal(await q('#abdominal-controls input:enabled').count(),4);
    assert(await q('#abdominal-live-detail [data-abdominals]').isVisible());
    assert.equal(await outline(),baseline);

    await setRange(page,'corpulence',25);
    const opacity=async()=>Number(await layer.locator('[data-abdominal-part="rectus"]').first().getAttribute('opacity'));
    const slim=await opacity();
    await setRange(page,'corpulence',100);
    assert(await opacity()<slim*.25);
    const beforeStructure=await layer.locator('[data-abdominal-part="rectus"]').first().getAttribute('d');
    await setRange(page,'corpulence',40.125);
    await setRange(page,'structure-waist',77);
    assert.notEqual(await layer.locator('[data-abdominal-part="rectus"]').first().getAttribute('d'),beforeStructure);
    const carrier=body==='adult-h' ? 'pectoral' : 'chest';
    await setRange(page,carrier+'-volume',80);
    await q('#thorax-details-reference').evaluate(button=>button.click());
    await setRange(page,'abdominal-width',77.875);
    const archive=await exportAppearance(page), doc=JSON.parse(archive);
    assert.equal(doc.version,19);
    assert.deepEqual(doc.character.abdominals,{...referenceAbdominals,volume:85,width:77.875});
    assert.equal(doc.character.corpulence,40.125);
    assert.equal(doc.character.structure.waist,77);
    assert.equal(doc.character[carrier==='chest' ? 'chest' : 'pectorals'].volume,80);
    assert(doc.character.thoraxDetails);
    const rendered=await layer.innerHTML(), underlying=await outline();
    await open('atelier-thorax');
    await importAppearance(page,archive);
    assert.equal(await layer.innerHTML(),rendered);
    assert.equal(await outline(),underlying);
    assert.deepEqual(JSON.parse(await exportAppearance(page)),doc);
    await setRange(page,'abdominal-volume',0);
    assert.equal(await layer.count(),0);
    assert(await q('#abdominal-width').isDisabled());
    const flat=await exportAppearance(page);
    await open('atelier-thorax');
    await importAppearance(page,flat);
    assert.equal(await layer.count(),0);
    assert.equal(await q('#abdominal-width').inputValue(),'77.875');
    await setRange(page,'abdominal-volume',85);
    assert.equal(await layer.innerHTML(),rendered);
    await open('atelier-thorax');
  }
  await old.setViewportSize(page.viewportSize());
  await ready(old,referenceURL);
  for (const {archive,signature} of legacy) {
    await importAppearance(old,archive);
    assert.deepEqual(await compare(old),signature);
  }

  await open('planche-abdominaux');
  const panel=q('#planche-abdominaux');
  await panel.locator('[data-abdominal-case]').first().waitFor({state:'visible'});
  assert.equal(await q('#abdominal-study-matrix [data-abdominal-case]').count(),9);
  assert.equal(await q('#abdominal-study-axes [data-abdominal-case]').count(),12);
  assert.equal(await panel.locator('svg').count(),42);
  assert.equal(await panel.locator('[data-abdominals]').count(),34);
  assert.equal(await q('[data-abdominal-case="matrix-100-100"] [data-abdominals]').count(),2);
  const rectusPath=panel.locator('[data-abdominal-part="rectus"]').first();
  const initial=await rectusPath.getAttribute('d');
  assert.equal(await q('#abdominal-study-structure option').count(),7);
  for (const id of ['fine','wide','min','max']) {
    await q('#abdominal-study-structure').selectOption(id);
    assert.notEqual(await rectusPath.getAttribute('d'),initial);
  }
  await q('#abdominal-study-structure').selectOption('reference');
  const skins=await q('#abdominal-study-skin option').evaluateAll(options=>options.map(option=>option.value));
  assert.equal(skins.length,4);
  const tones=[];
  for (const skin of skins) {
    await q('#abdominal-study-skin').selectOption(skin);
    assert.equal(await panel.locator('.body-shape path').first().getAttribute('fill'),skin);
    tones.push(await rectusPath.getAttribute('fill'));
  }
  assert.equal(new Set(tones).size,4);
  await q('#abdominal-study-skin').selectOption(skins[0]);
  for (const [scale,height] of [['tile',178],['head',300],['mini',70]]) {
    await q('#abdominal-study-scale').selectOption(scale);
    assert.deepEqual(await panel.locator('svg').evaluateAll(nodes=>[...new Set(nodes.map(svg=>svg.getBoundingClientRect().height))]),[height]);
    assert.equal(await panel.locator('[data-abdominal-part="surface"]').count(),scale==='mini' ? 0 : 68);
    await q('[data-abdominal-case="matrix-50-100"]').screenshot({path:path.join(output,`${name}-abdominal-${scale}.png`)});
  }
  await q('#abdominal-study-scale').selectOption('detail');
  for (const id of ['matrix-25-0','matrix-25-100','matrix-100-100','axis-definition-100']) {
    await q(`[data-abdominal-case="${id}"]`).screenshot({path:path.join(output,`${name}-abdominal-${id}.png`)});
  }
  for (const width of [390,810,1180]) {
    await page.setViewportSize({width,height:920});
    assert(await page.evaluate(w=>document.documentElement.scrollWidth<=w+1,width));
  }
  return {axesH:4,axesF:4,touch:16,matrixPerBase:9,axisPairs:12,archives:4,skins:4,structures:7,scales:3};
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
  const chest = chestCorrection ? await checkChestCorrection(page,old,url,name) : chestPreview ? await checkChest(page,url,name) : undefined;
  const pectorals = pectoralPreview ? await checkPectoralEdition(page,old,url,name) : undefined;
  const thoraxDetails=thoraxDetailsPreview ? await checkThoraxDetails(page,url,name) : undefined;
  const boneReliefs=boneReliefPreview ? await checkBoneReliefEdition(page,old,url,name) : undefined;
  const abdominals=abdominalPreview ? await checkAbdominalEdition(page,old,url,name) : undefined;
  assert.deepEqual(errors,[]);
  return {name, version, historicalExact:historicalBodies.length*3, rasterBySize:[8,8,8],
    fittings:cases.length*2, coldImports:2, guidedLandmarks:14, ...(structure ? {structure} : {}),
    ...(corpulence ? {corpulence} : {}), ...(chest ? {chest} : {}), ...(pectorals ? {pectorals} : {}),
    ...(thoraxDetails ? {thoraxDetails} : {}), ...(boneReliefs ? {boneReliefs} : {}), ...(abdominals ? {abdominals} : {})};
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
