const assert = require('node:assert/strict');
const {createHash} = require('node:crypto');
const {mkdir, readFile, writeFile} = require('node:fs/promises');
const {createServer} = require('node:http');
const path = require('node:path');
const {chromium, webkit, devices} = require('playwright');

const engines = {chromium, webkit};
const previewPath = '/preview/bio-cicatrices-01/';
const output = process.env.ARTIFACT_DIR ?? '/tmp/microcosme-cicatrices-startup';
const types = {'.html':'text/html','.css':'text/css','.js':'text/javascript','.json':'application/json'};

async function localSite(preview) {
  const root = path.resolve(preview);
  const server = createServer(async (request,response) => {
    const {pathname} = new URL(request.url,'http://127.0.0.1');
    const name = pathname.slice(previewPath.length) || 'index.html';
    const file = path.resolve(root,name);
    try {
      if(!pathname.startsWith(previewPath) || !file.startsWith(root+path.sep)) throw new Error('Ressource inconnue.');
      const data = await readFile(file);
      response.writeHead(200,{'Content-Type':types[path.extname(file)]??'application/octet-stream'}).end(data);
    } catch {
      response.writeHead(404).end();
    }
  });
  await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
  return server;
}

function watch(page) {
  const errors=[];
  page.on('pageerror',error=>errors.push(error.message));
  page.on('console',message=>{if(message.type()==='error') errors.push(message.text());});
  page.on('requestfailed',request=>errors.push(request.url()+' · '+request.failure()?.errorText));
  page.on('response',response=>{if(response.status()>=400) errors.push(response.status()+' · '+response.url());});
  return errors;
}

async function ready(page) {
  const atelier=page.locator('#atelier');
  await page.waitForFunction(()=>document.querySelector('#atelier').dataset.startup!=='pending');
  assert.equal(await atelier.getAttribute('data-startup'),'ready',await page.locator('#atelier-startup-detail').textContent());
  assert.equal(await page.locator('#atelier-startup').isVisible(),false);
  assert.equal(await page.locator('#atelier-startup-error').isVisible(),false);
}

async function visiblePortraits(page) {
  const views=await page.locator('#comparison article').evaluateAll(async articles=>{
    return await Promise.all(articles.map(async article=>Promise.all([...article.querySelectorAll('svg')].map(async svg=>{
      const size=svg.getBoundingClientRect();
      const w=Math.round(size.width), h=Math.round(size.height);
      const canvas=document.createElement('canvas');
      canvas.width=w;
      canvas.height=h;
      const pixels=canvas.getContext('2d');
      const copy=svg.cloneNode(true);
      copy.setAttribute('width',w);
      copy.setAttribute('height',h);
      const image=new Image();
      image.src='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(new XMLSerializer().serializeToString(copy));
      await image.decode();
      pixels.drawImage(image,0,0);
      const data=pixels.getImageData(0,0,w,h).data;
      let ink=0;
      for(let i=3;i<data.length;i+=4) if(data[i]>127) ink++;
      return {w,h,ink};
    }))));
  });
  assert.equal(views.length,2);
  for(const row of views){
    assert.deepEqual(row.map(view=>view.h),[300,178,70]);
    assert.equal(row[2].w,70);
    for(const view of row) assert(view.ink>100,'Portrait raster vide.');
  }
  return views;
}

async function workstation(page,base) {
  const errors=watch(page);
  const scripts=[];
  page.on('response',response=>{if(response.request().resourceType()==='script') scripts.push(response);});
  assert.equal((await page.goto(new URL('#atelier',base).href)).status(),200);
  await ready(page);
  const manifest=await page.evaluate(async()=>{
    const response=await fetch(new URL('version.json',location.href));
    return {status:response.status,version:await response.json()};
  });
  assert.equal(manifest.status,200);
  const {version}=manifest;
  const entry=version.files.find(file=>file.path===version.startup);
  assert.match(entry.path,/^atelier-[a-f0-9]{16}\.js$/);
  assert.equal(scripts.length,1);
  const [asset]=scripts;
  assert.equal(asset.url(),new URL(entry.path,base).href);
  assert.equal(asset.status(),200);
  assert.match(asset.headers()['content-type'],/javascript/);
  assert.equal(createHash('sha256').update(await asset.body()).digest('hex'),entry.sha256);
  const q=selector=>page.locator(selector);
  const menus={};
  for(const [id,minimum] of Object.entries({ordinary:119,historical:126,body:6,morph:6,'eye-preset':12,
    'iris-primary':16,'brows-preset':9,'mouth-preset':9,'nose-preset':9,'beard-preset':12,'marks-type':5,'scars-preset':6})){
    const size=await q('#'+id+' option').count();
    assert(size>=minimum,id+' doit être alimenté.');
    menus[id]=size;
  }
  assert.equal(await q('#eye-controls input[type=range]').count(),8);
  assert.equal(await q('#scars-axes input[type=range]').count(),11);
  const portraits=await visiblePortraits(page);
  const after='[data-side=after]';
  await q('#body').selectOption('slim');
  await q('#eye-preset').selectOption('almond');
  if(await q('#eye-confirm').isVisible()) await q('#eye-confirm').click();
  const width=await q('#eye-width').inputValue();
  await q('#eye-width').press('Home');
  if(await q('#eye-confirm').isVisible()) await q('#eye-confirm').click();
  assert.notEqual(await q('#eye-width').inputValue(),width);
  assert.equal(await q(after+' [data-bio-eye]').count(),6);
  const modules={};
  for(const [section,layer] of [['iris','iris'],['details','details'],['brows','brows'],['mouth','mouth'],['nose','nose'],['beard','facial-hair']]){
    await q('#'+section+'-active').check();
    modules[section]=await q(after+' [data-bio-'+layer+']').count();
    assert(modules[section]>=3,section+' doit rendre son calque aux trois échelles.');
  }
  if(await q('#flat-mode').isEnabled()) await q('#flat-mode').check();
  else assert(await q('#flat-mode').isChecked());
  await q('#marks-add').click();
  assert.equal(await q(after+' [data-bio-marks]').count(),3);
  await q('#scars-preset').selectOption('sutured');
  await q('#scars-add').click();
  assert.equal(await q(after+' [data-bio-scars]').count(),3);
  const maturation=await q('#scars-maturity').inputValue();
  await q('#scars-maturity').press('End');
  assert.notEqual(await q('#scars-maturity').inputValue(),maturation);
  await q('#appearance-panel summary').press('Enter');
  await q('#appearance-export').click();
  const saved=JSON.parse(await q('#appearance-json').inputValue());
  assert.equal(saved.version,9);
  assert.equal(saved.character.body,'slim');
  assert.equal(saved.palette.mode,'flat');
  assert.equal(saved.scars.requested[0].maturity,100);
  assert.equal(saved.scars.requested[0].sutures,true);
  assert.equal(saved.marks.requested.length,1);
  assert.deepEqual(errors,[]);
  return {codeCommit:version.codeCommit,entry:entry.path,menus,portraits,modules,archive:saved.version,errors};
}

async function stoppedAsset(browser,options,base) {
  const page=await browser.newPage(options);
  let hits=0;
  try {
    await page.route('**/atelier-*.js',route=>{
      hits++;
      return hits===1?route.fulfill({status:503,contentType:'text/plain',body:'Recette de démarrage'}):route.continue();
    });
    assert.equal((await page.goto(new URL('#atelier',base).href)).status(),200);
    assert.equal(await page.locator('#atelier').getAttribute('data-startup'),'failed');
    assert.match(await page.locator('#atelier-startup-error').textContent(),/Script indisponible/);
    assert.equal(await page.locator('#atelier-startup-error').isVisible(),true);
    assert.equal(await page.locator('#comparison svg').count(),0);
    await Promise.all([page.waitForNavigation({waitUntil:'load'}),page.locator('#atelier-retry').click()]);
    await ready(page);
    assert.equal(await page.locator('#comparison svg').count(),6);
    assert.equal(hits,2);
    return {visibleDiagnostic:true,recoveredPortraits:6};
  } finally {
    await page.close();
  }
}

(async()=>{
  const server=process.env.PREVIEW_DIR?await localSite(process.env.PREVIEW_DIR):null;
  const base=process.env.BASE_URL??(server?`http://127.0.0.1:${server.address().port}${previewPath}`:
    'https://thsethse.github.io/Microcosme/preview/bio-cicatrices-01/');
  const proof={base,engines:[]};
  const {defaultBrowserType,...device}=devices['iPad (gen 7)'];
  const options={...device,ignoreHTTPSErrors:process.env.PAGES_TEST_PROXY==='1'};
  try {
    for(const name of (process.env.AUDIT_ENGINES??'chromium,webkit').split(',')){
      const browser=await engines[name].launch();
      try {
        const page=await browser.newPage(options);
        const result={name,version:browser.version(),startup:await workstation(page,base)};
        await page.close();
        result.recovery=await stoppedAsset(browser,options,base);
        proof.engines.push(result);
        console.log(JSON.stringify(result));
      } finally {
        await browser.close();
      }
    }
    await mkdir(output,{recursive:true});
    await writeFile(path.join(output,'demarrage.json'),JSON.stringify(proof,null,2)+'\n');
  } finally {
    server?.close();
  }
})().catch(error=>{console.error(error);process.exitCode=1;});
