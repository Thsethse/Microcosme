const {chromium,webkit}=require('playwright');
const {createServer}=require('node:http');
const {readFile,mkdir,writeFile}=require('node:fs/promises');
const path=require('node:path');
const assert=require('node:assert/strict');
const root=path.resolve(__dirname,'../..');
const output=process.env.ARTIFACT_DIR||path.join('/tmp','microcosme-dedup-lot2-browser');
const pairs=[['E03','p5-019:G','p5-021:G'],['E04','p5-028:G','p5-059:G'],['E07','p5-047:G','p5-050:G'],['E09','p5-049:G','p5-062:D'],['E10','p5-064:G','p5-070:G'],['V01','p5-056:G','p5-061:G']];
const results=[];
let server;
(async()=>{
 await mkdir(output,{recursive:true});
 let base=process.env.BASE_URL;
 if(!base){
  const types={'.mjs':'text/javascript','.js':'text/javascript','.css':'text/css','.html':'text/html','.json':'application/json','.png':'image/png'};
  server=createServer(async(req,res)=>{try{let file=path.resolve(root,'.'+decodeURIComponent(new URL(req.url,'http://localhost').pathname));if(!file.startsWith(root+path.sep))throw Error('scope');if(new URL(req.url,'http://localhost').pathname.endsWith('/'))file=path.join(file,'index.html');const data=await readFile(file);res.writeHead(200,{'Content-Type':types[path.extname(file)]||'application/octet-stream'}).end(data);}catch{res.writeHead(404).end('Not found');}});
  await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));base=`http://127.0.0.1:${server.address().port}/bio-vis-dedup-lot-2/`;
 }
 const inherited=new URL(process.env.BASE_URL?'../':'../preview/',base).href;
 for(const [name,engine]of [['chromium',chromium],['webkit',webkit]]){
  const browser=await engine.launch();
  try{
   const page=await browser.newPage({viewport:{width:820,height:1180},hasTouch:true,isMobile:true,deviceScaleFactor:1});
   const errors=[],failed=[];page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.status()>=400)failed.push(r.url()+' '+r.status());});
   await page.goto(base,{waitUntil:'networkidle'});
   await page.waitForSelector('#selected-render svg');
   const count=async s=>page.locator(s).count();
   const raw=()=>page.locator('#selection-json').inputValue().then(JSON.parse);
   const key=()=>page.locator('#selected-render').getAttribute('data-key');
   const load=async payload=>{if(!await page.locator('#json-panel').evaluate(e=>e.open))await page.locator('#json-panel summary').click();await page.locator('#selection-json').fill(JSON.stringify(payload));await page.locator('#reload').click();assert.equal(await page.locator('#selection-error').textContent(),'');};
   const clean=async()=>{
    assert.deepEqual(await page.evaluate(()=>[...document.querySelectorAll('svg [d],svg [points],svg [transform],svg [viewBox]')].filter(e=>[...e.attributes].some(a=>/\b(?:NaN|Infinity|undefined)\b/.test(a.value))).map(e=>e.outerHTML.slice(0,150))),[],'finite SVG');
    const ids=await page.locator('svg [id]').evaluateAll(es=>es.map(e=>e.id));assert.equal(new Set(ids).size,ids.length,'unique SVG IDs');
    assert.deepEqual(errors,[]);assert.deepEqual(failed,[]);
   };
   assert.equal(await count('#ordinary option'),120);assert.equal(await count('#historical option'),126);assert.equal(await count('#body option'),6);assert.equal(await count('[data-control]'),8);
   assert.equal(await key(),'p5-061:G');assert.equal(await page.locator('#ordinary').inputValue(),'p5-056:G');
   await page.evaluate(()=>localStorage.setItem('lot2-test-sentinel','unchanged'));
   await page.locator('#catalogue-filter').selectOption('all');
   assert.equal(await count('#before-grid .tile-card'),126);assert.equal(await count('#after-grid .tile-card'),120);
   const before=await page.locator('#before-grid .tile-card').evaluateAll(es=>es.map(e=>e.dataset.key)),after=await page.locator('#after-grid .tile-card').evaluateAll(es=>es.map(e=>e.dataset.key));
   assert.deepEqual(after,before.filter(k=>!pairs.some(p=>p[2]===k)));
   assert(after.includes('p5-071:G'));
   for(const [,primary,secondary]of pairs){assert(before.includes(primary)&&before.includes(secondary));assert(after.includes(primary)&&!after.includes(secondary));for(const k of [primary,secondary]){const [s,a]=k.split(':');assert(after.includes(s+':'+(a==='G'?'D':'G')));}}
   await clean();
   await page.locator('#catalogue-filter').selectOption('groups');
   assert.equal(await count('#before-grid .tile-card'),12);assert.equal(await count('#after-grid .tile-card'),6);
   await page.locator('#compare').screenshot({path:path.join(output,name+'-before-after.png')});
   for(const [id,primary,secondary]of pairs){
    await page.locator(`[data-group="${id}"]`).click();
    assert.deepEqual(await page.locator('#pair-cards .history-card').evaluateAll(es=>es.map(e=>e.dataset.key)),[primary,secondary]);
    await page.locator('#pair').screenshot({path:path.join(output,name+'-'+id+'.png')});
    await page.locator(`#pair-cards [data-history="${secondary}"]`).click();
    assert.equal(await key(),secondary);assert.equal(await page.locator('#ordinary').inputValue(),primary);
    const [style,arrangement]=secondary.split(':');
    const input={style,arrangement,body:'bust',monochrome:false,contrast:true,accessories:true,forehead_width:1.2,metadata:{source:'historical',colour:'preserved',nested:[1,2]}};
    await load(input);assert.deepEqual(await raw(),input);
    await page.locator('#export').click();await page.locator('#reload').click();assert.deepEqual(await raw(),input);assert.equal(await key(),secondary);
    await page.locator('#show-original').check();assert.deepEqual(await raw(),input);
    if(['p5-050:G','p5-062:D'].includes(secondary))assert(await count('#selected-render [data-feature="contrast-color"]')>0,'historical contrast visible');
    if(id==='V01'){
     assert.equal(await count('#selected-render .head [data-feature="loose-lock"]'),2);
     await page.locator('#history').screenshot({path:path.join(output,name+'-V01-history.png')});
     await page.locator('#confirm-ordinary').click();assert.equal(await key(),primary);assert.equal(await count('#selected-render .head [data-feature="loose-lock"]'),0);assert.deepEqual((await raw()).metadata,input.metadata);
     await load(input);
    }
    await page.locator('#show-original').uncheck();assert.deepEqual(await raw(),input);assert.equal(await count('#selected-render [data-feature="contrast-color"]'),0);
    await clean();
   }
   // Every canonical option must actually load through the public UI.
   for(const k of before){await page.locator('#historical').selectOption(k);await page.locator('#load-history').click();assert.equal(await key(),k);}
   await load({style:'p5-061',arrangement:'G',body:'standard',keep:'still here'});
   for(const b of ['standard','slim','broad','narrow','shoulders','bust']){await page.locator('#body').selectOption(b);assert.equal((await raw()).body,b);assert.equal(await key(),'p5-061:G');}
   await page.locator('#preset').selectOption('ipad');
   const expected={skull_width:1.18,skull_height:1.18,forehead_width:1.14,forehead_height:1.18,temple_width:.9,cheek_width:1.22,jowls:1.35,jaw_width:.82};
   for(const [k,v]of Object.entries(expected))assert.equal((await raw())[k],v);
   if(!await page.locator('aside details').evaluate(e=>e.open))await page.locator('aside details summary').click();
   for(const k of Object.keys(expected)){await page.locator(`[data-control="${k}"]`).evaluate(e=>{e.value=(+e.min+(+e.max-+e.min)*.82).toFixed(2);e.dispatchEvent(new Event('input',{bubbles:true}));});assert.equal(await key(),'p5-061:G');}
   const saved=await raw();await page.locator('#selection-json').fill('{"style":"deleted-id"}');await page.locator('#reload').click();assert.match(await page.locator('#selection-error').textContent(),/non chargée/);assert.equal(await key(),'p5-061:G');await page.locator('#export').click();assert.deepEqual(await raw(),saved);
   assert.equal(await count('#lot1-cards article'),4);
   assert(await page.evaluate(async url=>{const a=await import('./render.mjs'),b=await import(url+'bio-vis-dedup-lot-1/render.mjs');return a.character===b.character&&a.hairLayers===b.hairLayers;},inherited),'exact inherited lot 1 renderer');
   await page.locator('#preset').selectOption('neutral');
   // The three reference dimensions are retained in each layout.
   for(const [width,height,label]of [[820,1180,'ipad-portrait'],[1180,820,'ipad-landscape'],[390,844,'narrow']]){
    await page.setViewportSize({width,height});await page.locator('#history').scrollIntoViewIfNeeded();
    const overflow=await page.evaluate(()=>({width:innerWidth,scroll:document.documentElement.scrollWidth,nodes:[...document.querySelectorAll('body *')].filter(e=>e.getBoundingClientRect().right>innerWidth+1&&getComputedStyle(e).position!=='absolute').slice(0,12).map(e=>e.tagName+'.'+e.className)}));
    assert(overflow.scroll<=width+1,JSON.stringify(overflow));
    assert.equal(Math.round((await page.locator('#selected-render .head svg').boundingBox()).height),300);
    assert.equal(Math.round((await page.locator('#selected-render .tile svg').boundingBox()).height),178);
    const mini=await page.locator('#selected-render .mini svg').boundingBox();assert.equal(mini.height,70);assert.equal(mini.width,70);
    await page.locator('#history').screenshot({path:path.join(output,name+'-'+label+'.png')});await clean();
   }
   assert.equal(await page.evaluate(()=>localStorage.getItem('lot2-test-sentinel')),'unchanged');
   await page.setViewportSize({width:1180,height:820});await page.locator('#lot1').screenshot({path:path.join(output,name+'-lot1-maintained.png')});
   results.push({engine:name,passed:true,url:base,canonical:126,ordinary:120,historicalOptionsLoaded:126,groups:6,viewports:['820×1180','1180×820','390×844'],errors,failed});
   console.log(name+': PASS — 126 identifiants chargés, 6 regroupements, aller-retour, contraste, V01, 8 paramètres, 6 corps, 3 tailles et 3 viewports');
  }finally{await browser.close();}
 }
 await writeFile(path.join(output,'results.json'),JSON.stringify(results,null,2)+'\n');
})().catch(e=>{console.error(e);process.exitCode=1;}).finally(()=>{if(server)server.close();});
