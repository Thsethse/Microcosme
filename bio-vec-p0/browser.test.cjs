// Start a static server at repo root first, or set BASE_URL to the deployed preview.
const {chromium,webkit}=require('playwright');
const assert=require('node:assert/strict');
(async()=>{
  for(const type of [chromium,webkit]){
    const browser=await type.launch();
    try{
      const page=await browser.newPage({viewport:{width:820,height:1180},hasTouch:true,isMobile:true,deviceScaleFactor:2});
      const errors=[],failures=[];
      page.on('pageerror',e=>errors.push(e.message));
      page.on('response',r=>{if(r.status()>=400)failures.push(r.url()+': '+r.status())});
      await page.goto(process.env.BASE_URL||'http://127.0.0.1:8765/bio-vec-p0/');
      await page.locator('#front svg').waitFor();
      assert.equal(await page.locator('input[type=range]').count(),8);
      assert.equal(await page.locator('svg').count(),2);
      assert.equal(await page.locator('.construction').count(),0);
      const state=()=>page.locator('.portraits').innerHTML();
      const neutral=await state(),snapshots=[];
      for(const name of ['A','B','C']){
        await page.locator(`[data-preset="${name}"]`).tap();
        snapshots.push(await state());
      }
      assert.equal(new Set([neutral,...snapshots]).size,4);
      await page.locator('#reset').tap();assert.equal(await state(),neutral);
      // Actual touch slider gesture must update the SVG, not merely an input property.
      const track=await page.locator('#jaw_width').boundingBox();
      await page.touchscreen.tap(track.x+track.width*.8,track.y+track.height/2);
      assert.notEqual(await state(),neutral);
      await page.locator('#reset').tap();
      for(const key of await page.locator('input[type=range]').evaluateAll(els=>els.map(e=>e.id))){
        const before=await page.locator('#front').innerHTML(),profile=await page.locator('#profile').innerHTML();
        await page.locator('#'+key).evaluate(el=>{el.value=el.max;el.dispatchEvent(new Event('input',{bubbles:true}))});
        assert.notEqual(await page.locator('#front').innerHTML(),before,key+' front');
        assert.notEqual(await page.locator('#profile').innerHTML(),profile,key+' profile');
        assert.match(await page.locator('#identity').textContent(),/personnalisée/);
        await page.locator('#reset').tap();
      }
      await page.locator('#old').check();assert.notEqual(await state(),neutral);
      assert.ok((await page.locator('input[type=range]').evaluateAll(els=>els.map(e=>Number(e.value)))).every(x=>x===1));
      await page.locator('#construction').check();assert.equal(await page.locator('.construction').count(),2);
      for(const view of ['front','profile']){
        assert.ok(await page.locator(`#${view} .construction rect`).count()>=10);
        assert.ok(await page.locator(`#${view} .construction ellipse`).count()>30);
      }
      for(const viewport of [{width:820,height:1180},{width:1180,height:820},{width:768,height:1024},{width:390,height:844}]){
        await page.setViewportSize(viewport);
        assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
        for(const view of ['front','profile']){
          const rect=await page.locator('#'+view+' svg').boundingBox();
          assert.ok(rect.width>150&&rect.x>=0&&rect.x+rect.width<=viewport.width);
        }
      }
      await page.setViewportSize({width:820,height:1180});
      await page.locator('#construction').uncheck();await page.locator('#old').uncheck();
      // Once loaded, controls have no network dependency.
      await page.context().setOffline(true);
      await page.locator('[data-preset="B"]').tap();
      assert.notEqual(await state(),neutral);
      await page.context().setOffline(false);
      const name=type.name();
      if(process.env.CAPTURE_DIR){
        await page.screenshot({path:process.env.CAPTURE_DIR+'/'+name+'-ipad.png',fullPage:true});
        await page.locator('#old').check();await page.locator('#construction').check();
        await page.screenshot({path:process.env.CAPTURE_DIR+'/'+name+'-construction.png',fullPage:true});
      }
      assert.deepEqual(errors,[]);assert.deepEqual(failures,[]);
      console.log(`${name}: presets, 8 sliders in both views, touch, age, construction, 4 viewports, offline: OK`);
    }finally{await browser.close()}
  }
})().catch(e=>{console.error(e);process.exitCode=1});
