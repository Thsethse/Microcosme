const {chromium,webkit}=require('playwright');
const assert=require('node:assert/strict');
const http=require('node:http'),fs=require('node:fs'),path=require('node:path');
(async()=>{
 const root=path.resolve(__dirname,'..');
 const server=http.createServer((req,res)=>{
  const name=decodeURIComponent(new URL(req.url,'http://local').pathname);
  const relative=name.endsWith('/')?name+'index.html':name;
  const file=path.resolve(root,'.'+relative);
  if(!file.startsWith(root+path.sep)||!fs.existsSync(file)){res.writeHead(404).end();return}
  res.setHeader('Content-Type',file.endsWith('.mjs')?'text/javascript':file.endsWith('.css')?'text/css':file.endsWith('.png')?'image/png':'text/html');res.end(fs.readFileSync(file));
 });
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
 try{
  for(const engine of [chromium,webkit]){
   const browser=await engine.launch();
   try{
    const page=await browser.newPage({viewport:{width:820,height:1180},isMobile:true,hasTouch:true,deviceScaleFactor:2});
    const errors=[],failed=[];page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.status()>=400)failed.push(r.url())});
    await page.goto(process.env.BASE_URL||`http://127.0.0.1:${server.address().port}/preview/bio-vis-p1/`);
    await page.locator('#body svg').waitFor();
    assert.equal(await page.locator('.specimen').count(),6);
    assert.match(await page.locator('.reference-notice').textContent(),/vérifiée et archivée/);
    await page.locator('#reference-panel summary').tap();
    await page.locator('#reference-image').scrollIntoViewIfNeeded();
    await page.locator('#reference-image').evaluate(img=>img.decode());
    assert.deepEqual(await page.locator('#reference-image').evaluate(img=>[img.naturalWidth,img.naturalHeight]),[2480,3508]);
    assert.equal(await page.locator('#reference-link').getAttribute('href'),await page.locator('#reference-image').getAttribute('src'));
    await page.locator('#reference-panel summary').tap();
    const equalHeads=async()=>assert.equal(await page.locator('#body .head-shape').innerHTML(),await page.locator('#face .head-shape').innerHTML());
    await equalHeads();
    const base=await page.locator('#body').innerHTML();
    for(let i=0;i<6;i++){
     await page.locator(`[data-preset="${i}"]`).tap();await equalHeads();
     assert.equal(await page.locator('.walker.selected .head-shape').innerHTML(),await page.locator('#face .head-shape').innerHTML());
    }
    await page.locator('[data-preset="0"]').tap();assert.equal(await page.locator('#body').innerHTML(),base);
    for(const id of ['belly','shoulders','hips']){
     const before=await page.locator('#body .body-shape').innerHTML(),face=await page.locator('#face').innerHTML();
     await page.locator('#'+id).scrollIntoViewIfNeeded();
     const box=await page.locator('#'+id).boundingBox();await page.touchscreen.tap(box.x+box.width*.88,box.y+box.height/2);
     assert.notEqual(await page.locator('#body .body-shape').innerHTML(),before,id);
     assert.equal(await page.locator('#face').innerHTML(),face);await equalHeads();
     await page.locator('#reset').tap();
    }
    for(const id of ['silhouette','head','eyes','nose','mouth','hair','chest','age']){
     const before=await page.locator('#body').innerHTML();
     const options=await page.locator('#'+id+' option').evaluateAll(els=>els.map(e=>e.value));
     const current=await page.locator('#'+id).inputValue();
     await page.locator('#'+id).selectOption(options.find(v=>v!==current));
     assert.notEqual(await page.locator('#body').innerHTML(),before,id);await equalHeads();await page.locator('#reset').tap();
    }
    // Real SVG bounding boxes across the morphology/head extremes must fit their viewBox.
    const clipped=await page.evaluate(async()=>{
     const {choices,bounds}=await import(new URL('./model.mjs',location.href));
     const {character}=await import(new URL('./render.mjs',location.href));
     const holder=document.createElement('div');document.body.append(holder);const bad=[];
     for(const silhouette of choices.silhouette)for(const head of choices.head)for(let mask=0;mask<8;mask++){
      const p={silhouette,head,...Object.fromEntries(Object.entries(bounds).map(([k,r],i)=>[k,r[(mask>>i)&1]]))};
      holder.innerHTML=character(p);const b=holder.querySelector('.ink').getBBox();
      if(b.x<1||b.y<1||b.x+b.width>159||b.y+b.height>269)bad.push({p,box:[b.x,b.y,b.width,b.height]});
     }
     // All coiffures also need to fit the enlarged crop.
     for(const hair of choices.hair)for(const head of choices.head){
      holder.innerHTML=character({hair,head},{headOnly:true});const b=holder.querySelector('.ink').getBBox();
      if(b.x<33||b.y<6||b.x+b.width>127||b.y+b.height>124)bad.push({hair,head,box:[b.x,b.y,b.width,b.height]});
     }
     holder.remove();return bad;
    });assert.deepEqual(clipped,[]);
    for(const viewport of [{width:820,height:1180},{width:1180,height:820},{width:768,height:1024},{width:390,height:844}]){
     await page.setViewportSize(viewport);
     assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
     for(const selector of ['#body svg','#face svg']){
      const b=await page.locator(selector).boundingBox();assert.ok(b.width>100&&b.x>=0&&b.x+b.width<=viewport.width);
     }
    }
    await page.setViewportSize({width:820,height:1180});
    await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
    const poses=()=>page.locator('.walker').evaluateAll(els=>els.map(el=>el.style.transform));
    const stopped=await poses();await page.waitForTimeout(100);assert.deepEqual(await poses(),stopped);
    await page.locator('#hop').tap();assert.equal(await page.locator('#hop').getAttribute('aria-pressed'),'true');
    await page.waitForTimeout(150);assert.notDeepEqual(await poses(),stopped);
    await page.locator('#hop').tap();const paused=await poses();await page.waitForTimeout(100);assert.deepEqual(await poses(),paused);
    await page.emulateMedia({reducedMotion:'reduce'});await page.locator('#hop').tap();
    assert.equal(await page.locator('#hop').getAttribute('aria-pressed'),'false');assert.match(await page.locator('#motion-status').textContent(),/désactivée/);
    await page.evaluate(()=>localStorage.setItem('microcosme-v03','unmodified-sentinel'));
    await page.reload();await page.locator('#body svg').waitFor();
    assert.equal(await page.evaluate(()=>localStorage.getItem('microcosme-v03')),'unmodified-sentinel');
    await page.context().setOffline(true);await page.locator('[data-preset="2"]').tap();await equalHeads();await page.context().setOffline(false);
    if(process.env.CAPTURE_DIR){
     await page.screenshot({path:path.join(process.env.CAPTURE_DIR,engine.name()+'-vis-ipad.png'),fullPage:true});
     await page.setViewportSize({width:1180,height:820});await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));await page.screenshot({path:path.join(process.env.CAPTURE_DIR,engine.name()+'-vis-landscape.png'),fullPage:true});
    }
    assert.deepEqual(errors,[]);assert.deepEqual(failed,[]);
    console.log(engine.name()+': touch, head identity at 3 scales, all controls, 240 SVG bounds, hair bounds, hopping/pause, reduced motion, 4 viewports, storage, offline: OK');
   }finally{await browser.close()}
  }
 }finally{await new Promise(resolve=>server.close(resolve))}
})().catch(e=>{console.error(e);process.exitCode=1});
