// Regression of the published, unmodified R1 baseline. BASE_URL can target its public URL.
const {chromium,webkit}=require('playwright');
const assert=require('node:assert/strict');
const http=require('node:http'),fs=require('node:fs'),path=require('node:path');
(async()=>{
 const root=path.resolve(__dirname,'..');
 const server=http.createServer((req,res)=>{
  const name=decodeURIComponent(new URL(req.url,'http://local').pathname),file=path.resolve(root,'.'+name+(name.endsWith('/')?'index.html':''));
  if(!file.startsWith(root+path.sep)||!fs.existsSync(file)){res.writeHead(404).end();return}
  res.setHeader('Content-Type',file.endsWith('.mjs')?'text/javascript':file.endsWith('.css')?'text/css':file.endsWith('.png')?'image/png':'text/html');res.end(fs.readFileSync(file));
 });
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
 try{
  for(const type of [chromium,webkit]){
   const browser=await type.launch();
   try{
    const page=await browser.newPage({viewport:{width:820,height:1180},hasTouch:true,isMobile:true,deviceScaleFactor:1});
    const errors=[],failures=[];page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.status()>=400)failures.push(r.url())});
    const base=process.env.BASE_URL||`http://127.0.0.1:${server.address().port}/preview/bio-vis-p3-r1/`;
    await page.goto(base);await page.locator('#portrait svg').waitFor();
    const same=async()=>assert.deepEqual(await page.locator('#whole .p3-head,#portrait .p3-head,#mini .p3-head').evaluateAll(els=>els.map(e=>e.innerHTML)),Array(3).fill(await page.locator('#whole .p3-head').innerHTML()));
    assert.equal(await page.locator('input[type=range]').count(),8);await same();
    await page.locator('#priority').tap();assert.equal(await page.locator('#whole .p3-head').getAttribute('data-cut'),'bob');
    assert.deepEqual(await page.locator('input[type=range]').evaluateAll(els=>els.map(e=>Number(e.value))),[1.18,1.18,1.14,1.18,.9,1.22,1.35,.82]);await same();
    for(const cut of ['classic','bob','curls']){
     await page.locator(`#cuts button[data-cut=${cut}]`).tap();
     for(const preset of ['neutral','tall','broad']){await page.locator(`[data-preset=${preset}]`).tap();await same();assert.equal(await page.locator('#whole .p3-head').getAttribute('data-cut'),cut)}
     await page.locator('#reset').tap();
     for(const key of await page.locator('input[type=range]').evaluateAll(els=>els.map(e=>e.id))){
      const before=await page.locator('#portrait').innerHTML();await page.locator('#'+key).scrollIntoViewIfNeeded();
      const b=await page.locator('#'+key).boundingBox();await page.touchscreen.tap(b.x+b.width*.9,b.y+b.height/2);
      await page.waitForFunction(()=>document.querySelector('#preset-name').textContent==='Combinaison libre');
      assert.notEqual(await page.locator('#portrait').innerHTML(),before,key+' '+cut);await same();await page.locator('#reset').tap();
     }
    }
    // Render all corner combinations and audit the actual SVG geometry and protected face regions.
    const report=await page.evaluate(async()=>{
     const {controls,cuts,model}=await import(new URL('./model.mjs',location.href));
     const {character}=await import(new URL('./render.mjs',location.href));
     const {character:before}=await import(new URL('./source-render.mjs',location.href));
     const {priorityCase}=await import(new URL('./coverage.mjs',location.href));
     const holder=document.createElement('div');holder.style.cssText='position:absolute;left:-10000px;top:0;width:160px';document.body.append(holder);
     const bad=[],keys=Object.keys(controls);let count=0;
     function coverage(svg,m){
      const face=svg.querySelector('[data-layer=face] .head-shape>path'),L=face.getTotalLength();
      const paths=[...svg.querySelectorAll('[data-layer=volume] path,[data-layer=front] path,[data-layer=sides] path')].filter(p=>p.getAttribute('fill')!=='none').sort((a,b)=>Number(b.hasAttribute('data-coverage'))-Number(a.hasAttribute('data-coverage'))).map(p=>({p,box:p.getBBox()}));
      const filled=(x,y)=>paths.some(({p,box:b})=>x>=b.x&&x<=b.x+b.width&&y>=b.y&&y<=b.y+b.height&&p.isPointInFill(new DOMPoint(x,y)));
      let missed=0,samples=0;
      for(let k=0;k<100;k++){
       const at=L*k/100,q=face.getPointAtLength(at);if(q.y>m.fit.cy-m.fit.ry*.22)continue;
       const a=face.getPointAtLength(Math.max(0,at-.01)),b=face.getPointAtLength(Math.min(L,at+.01)),dx=b.x-a.x,dy=b.y-a.y,n=Math.hypot(dx,dy);
       for(const offset of [-.8,0,1.9]){samples++;if(!filled(q.x+dy/n*offset,q.y-dx/n*offset))missed++;}
      }
      return {missed,samples,foreheadOpen:!filled(m.fit.cx,m.fit.forehead+10)};
     }
     const priority={};
     for(const [name,render]of Object.entries({before,after:character})){
      holder.innerHTML=render(priorityCase,{headOnly:true});priority[name]=coverage(holder.querySelector('svg'),model(priorityCase));
     }
     if(priority.before.missed===0)bad.push({reason:'original iPad defect not reproduced'});
     if(priority.after.missed!==0)bad.push({reason:'iPad defect remains',priority});
     const cases=[];
     for(const cut of Object.keys(cuts)){
      for(let mask=0;mask<256;mask++)cases.push({cut,mask,p:{cut,...Object.fromEntries(keys.map((k,i)=>[k,controls[k][mask&(1<<i)?'max':'min']]))}});
      for(let i=1;i<=16;i++)cases.push({cut,mask:'mixed-'+i,p:{cut,...Object.fromEntries(keys.map((k,j)=>[k,controls[k].min+(controls[k].max-controls[k].min)*(.5+.5*Math.sin(i*.67+j*.91))]))}});
     }
     for(const {cut,mask,p} of cases){
      const m=model(p);
      holder.innerHTML=character(p,{headOnly:true});const svg=holder.querySelector('svg'),head=svg.querySelector('.p3-head'),box=head.getBBox(),view=svg.viewBox.baseVal;
      if(box.x-3<view.x||box.y-3<view.y||box.x+box.width+3>view.x+view.width||box.y+box.height+3>view.y+view.height)bad.push({cut,mask,reason:'crop',box:[box.x,box.y,box.width,box.height]});
      const cov=coverage(svg,m);if(cov.missed)bad.push({cut,mask,reason:'upper scalp not covered',cov});if(!cov.foreheadOpen)bad.push({cut,mask,reason:'forehead hidden'});
      const protectedPoints=Object.values(m.base.anchors).flatMap(([x,y])=>[{x,y},{x:x-2,y},{x:x+2,y}]);
      const hair=[...svg.querySelectorAll('[data-layer=volume] path,[data-layer=front] path,[data-layer=sides] path')].filter(e=>e.getAttribute('fill')!=='none');
      if(hair.some(e=>protectedPoints.some(pt=>e.isPointInFill(new DOMPoint(pt.x,pt.y)))))bad.push({cut,mask,reason:'face occlusion'});
      // The closed cubic outline must contain central facial landmarks.
      const face=svg.querySelector('[data-layer=face] .head-shape>path');
      if(!Object.values(m.base.anchors).every(([x,y])=>face.isPointInFill(new DOMPoint(x,y))))bad.push({cut,mask,reason:'landmark outside face'});
      for(const e of svg.querySelectorAll('path'))if(!Number.isFinite(e.getTotalLength())||e.getTotalLength()<=0)bad.push({cut,mask,reason:'invalid path'});
      count++;
     }
     holder.remove();return {count,priority,bad:bad.slice(0,25)};
    });assert.equal(report.count,816);assert.deepEqual(report.bad,[]);console.log(type.name()+' iPad coverage samples: '+JSON.stringify(report.priority));
    const values=await page.locator('input[type=range]').evaluateAll(els=>els.map(e=>e.value));
    await page.locator('#cuts button[data-cut=bob]').tap();assert.deepEqual(await page.locator('input[type=range]').evaluateAll(els=>els.map(e=>e.value)),values);
    await page.locator('#construction').check();assert.equal(await page.locator('#portrait .anchors circle').count(),28);await same();await page.locator('#construction').uncheck();
    for(const viewport of [{width:820,height:1180},{width:1180,height:820},{width:768,height:1024},{width:390,height:844}]){
     await page.setViewportSize(viewport);assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
     for(const sel of ['#whole svg','#portrait svg','#mini svg']){const box=await page.locator(sel).boundingBox();assert.ok(box.x>=0&&box.x+box.width<=viewport.width)}
    }
    await page.locator('#catalogue summary').tap();await page.locator('#catalogue-image').scrollIntoViewIfNeeded();await page.locator('#catalogue-image').evaluate(e=>e.decode());assert.deepEqual(await page.locator('#catalogue-image').evaluate(e=>[e.naturalWidth,e.naturalHeight]),[1536,1024]);await page.locator('#catalogue summary').tap();
    await page.evaluate(()=>localStorage.setItem('microcosme-v03','P3-preservation-sentinel'));
    await page.reload();await page.locator('#portrait svg').waitFor();assert.equal(await page.evaluate(()=>localStorage.getItem('microcosme-v03')),'P3-preservation-sentinel');
    await page.context().setOffline(true);await page.locator('[data-preset=broad]').tap();await same();await page.context().setOffline(false);
    if(process.env.CAPTURE_DIR){
     await page.setViewportSize({width:820,height:1180});await page.screenshot({path:path.join(process.env.CAPTURE_DIR,type.name()+'-p3-ipad.png'),fullPage:true});
    }
    if(process.env.GENERATE_AUDIT&&type===webkit){
     fs.mkdirSync(path.join(__dirname,'audit'),{recursive:true});
     for(const cut of ['classic','bob','curls']){
      const auditPage=await browser.newPage({viewport:{width:1180,height:3800},deviceScaleFactor:1});
      try{
       await auditPage.goto(new URL('comparison.html?cut='+cut,base).href);await auditPage.locator('.comparison-row').last().waitFor();assert.equal(await auditPage.locator('.comparison-row').count(),9);
       await auditPage.evaluate(()=>document.fonts.ready.then(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)))));
       await auditPage.screenshot({path:path.join(__dirname,'audit',cut+'-before-after.png'),fullPage:true});
       if(cut==='bob')await auditPage.locator('.comparison-row').first().screenshot({path:path.join(__dirname,'audit','ipad-priority-before-after.png')});
      }finally{await auditPage.close()}
     }
    }
    await page.locator('#p2-link').tap();await page.locator('.sample').last().waitFor();assert.equal(await page.locator('.sample').count(),9);
    assert.deepEqual(errors,[]);assert.deepEqual(failures,[]);
    console.log(type.name()+': 816 SVG states, scalp overlap and open forehead, protected face regions, tactile 8 controls × 3 cuts, presets, 3 scales, anchors, 4 viewports, catalogue, offline, storage and return P2: OK');
   }finally{await browser.close()}
  }
 }finally{await new Promise(resolve=>server.close(resolve))}
})().catch(e=>{console.error(e);process.exitCode=1});
