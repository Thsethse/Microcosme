const {chromium,webkit}=require('playwright');
const assert=require('node:assert/strict'),http=require('node:http'),fs=require('node:fs'),path=require('node:path');
(async()=>{
 const root=path.resolve(__dirname,'..'),server=http.createServer((req,res)=>{
  const name=decodeURIComponent(new URL(req.url,'http://local').pathname),file=path.resolve(root,'.'+name+(name.endsWith('/')?'index.html':''));
  if(!file.startsWith(root+path.sep)||!fs.existsSync(file)){res.writeHead(404).end();return}
  res.setHeader('Content-Type',file.endsWith('.mjs')?'text/javascript':file.endsWith('.css')?'text/css':file.endsWith('.png')?'image/png':file.endsWith('.md')?'text/plain':'text/html');res.end(fs.readFileSync(file));
 });await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
 const base=process.env.BASE_URL||`http://127.0.0.1:${server.address().port}/bio-vis-p4/`;
 try{for(const type of [chromium,webkit]){
  const browser=await type.launch();
  try{
   const page=await browser.newPage({viewport:{width:820,height:1180},hasTouch:true,isMobile:true,deviceScaleFactor:1});const errors=[],failures=[];
   page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text())});page.on('response',r=>{if(r.status()>=400)failures.push(r.url())});
   await page.goto(base);await page.locator('#portrait svg').waitFor();
   assert.equal(await page.locator('.tile').count(),18);assert.equal(await page.locator('#style option').count(),18);assert.equal(await page.locator('#body option').count(),6);assert.equal(await page.locator('input[type=range]').count(),8);
   const ids=await page.locator('.tile').evaluateAll(es=>es.map(e=>e.dataset.style));
   for(const style of ids){
    await page.locator(`.tile[data-style=${style}]`).tap();assert.equal(await page.locator('#style').inputValue(),style);assert.equal(await page.locator('.tile[aria-pressed=true]').count(),1);
    for(const body of ['slim','broad','narrow','shoulders','bust']){await page.locator('#body').selectOption(body);assert.ok(await page.locator('#whole .body-shape').count());}
   }
   for(const style of ['classic','bob','curls','waist_waves','side_braid','asym_long']){
    await page.locator('#style').selectOption(style);
    for(const key of await page.locator('input[type=range]').evaluateAll(es=>es.map(e=>e.id))){
     await page.locator('#'+key).scrollIntoViewIfNeeded();const b=await page.locator('#'+key).boundingBox();await page.touchscreen.tap(b.x+b.width*.9,b.y+b.height/2);
     await page.waitForFunction(()=>document.querySelector('#preset-name').textContent==='Combinaison libre');
     assert.notEqual(await page.locator('#'+key).inputValue(),'1');await page.locator('[data-preset=neutral]').tap();
    }
   }
   await page.locator('#style').selectOption('bob');await page.locator('#priority').tap();assert.deepEqual(await page.locator('input[type=range]').evaluateAll(es=>es.map(e=>+e.value)),[1.18,1.18,1.14,1.18,.9,1.22,1.35,.82]);
   await page.locator('#construction').check();assert.equal(await page.locator('#portrait .anchors circle').count(),28);await page.locator('#construction').uncheck();
   const report=await page.evaluate(async()=>{
    const {styles,bodies,controls,model}=await import(new URL('./model.mjs',location.href)),{character,headGroup}=await import(new URL('./render.mjs',location.href)),{headGroup:old}=await import(new URL('./r1/render.mjs',location.href));
    const {priorityCase}=await import(new URL('./r1/coverage.mjs',location.href));
    const keys=Object.keys(controls),box=document.createElement('div');box.style.cssText='position:absolute;left:-10000px;width:212px';document.body.append(box);
    const bad=[];let count=0,coverageSamples=0;
    const states=[{},priorityCase,...Array.from({length:16},(_,i)=>Object.fromEntries(keys.map((k,j)=>[k,controls[k][(i*17)&(1<<j)?'max':'min']]))),...Array.from({length:24},(_,i)=>Object.fromEntries(keys.map((k,j)=>[k,controls[k].min+(controls[k].max-controls[k].min)*(.5+.5*Math.sin((i+1)*.67+j*.91))])))];
    for(const style of Object.keys(styles))for(const [i,p]of states.entries()){
     const state={...p,style},m=model(state);box.innerHTML=character(state);const svg=box.querySelector('svg');
     if(styles[style].kind==='original'&&headGroup(state)!==old({...p,cut:style}))bad.push({style,i,reason:'original changed'});
     for(const e of svg.querySelectorAll('path')){
      const length=e.getTotalLength();if(!Number.isFinite(length)||length<=0)bad.push({style,i,reason:'invalid path'});
      for(const at of [0,.37,1]){const pt=e.getPointAtLength(length*at);if(!Number.isFinite(pt.x)||!Number.isFinite(pt.y))bad.push({style,i,reason:'invalid coordinate'});}
     }
     const paths=[...svg.querySelectorAll('[data-layer=volume] path,[data-layer=front] path,[data-layer=sides] path,[data-layer=lengths] path')].filter(e=>e.getAttribute('fill')!=='none').map(e=>({e,b:e.getBBox()}));
     const filled=(x,y)=>paths.some(({e,b})=>x>=b.x&&x<=b.x+b.width&&y>=b.y&&y<=b.y+b.height&&e.isPointInFill(new DOMPoint(x,y)));
     const face=svg.querySelector('[data-layer=face] .head-shape>path'),length=face.getTotalLength();
     if(style!=='shaved')for(let k=0;k<100;k++){
      const at=length*k/100,q=face.getPointAtLength(at);if(q.y>m.fit.cy-m.fit.ry*.22)continue;
      const a=face.getPointAtLength(Math.max(0,at-.01)),b=face.getPointAtLength(Math.min(length,at+.01)),dx=b.x-a.x,dy=b.y-a.y,n=Math.hypot(dx,dy);
      for(const offset of [-.8,0,1.9]){coverageSamples++;if(!filled(q.x+dy/n*offset,q.y-dx/n*offset))bad.push({style,i,reason:'scalp exposed'});}
     }
     for(const [key,[x,y]]of Object.entries(m.base.anchors))if(filled(x,y))bad.push({style,i,key,reason:'face landmark covered'});
     if(style!=='fringe_bob'&&style!=='shaved'&&filled(m.fit.cx,m.fit.forehead+10))bad.push({style,i,reason:'forehead closed'});
     if(style==='shaved'&&svg.querySelector('[data-coverage]'))bad.push({style,i,reason:'bald hidden'});
     count++;
    }
    let bodyCases=0;
    for(const style of Object.keys(styles))for(const body of Object.keys(bodies))for(const p of [{},states[17]]){
     box.innerHTML=character({...p,style,body});const svg=box.querySelector('svg'),v=svg.viewBox.baseVal,b=svg.getBBox();
     if(b.x-3<v.x||b.y-3<v.y||b.x+b.width+3>v.x+v.width||b.y+b.height+3>v.y+v.height)bad.push({style,body,reason:'full-body cropped',box:[b.x,b.y,b.width,b.height]});bodyCases++;
    }
    box.remove();return {count,bodyCases,coverageSamples,bad:bad.slice(0,40)};
   });console.log(type.name()+' geometry '+JSON.stringify(report));assert.deepEqual(report.bad,[]);assert.equal(report.count,756);assert.equal(report.bodyCases,216);
   for(const viewport of [{width:820,height:1180},{width:1180,height:820},{width:768,height:1024},{width:390,height:844}]){
    await page.setViewportSize(viewport);assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
    for(const id of ['whole','portrait','mini']){const b=await page.locator('#'+id+' svg').boundingBox();assert.ok(b.x>=0&&b.x+b.width<=viewport.width);}
   }
   await page.locator('#reset').tap();assert.equal(await page.locator('#style').inputValue(),'classic');assert.equal(await page.locator('#body').inputValue(),'standard');
   await page.locator('#monochrome').check();const before=await page.locator('#portrait').innerHTML();assert.notEqual(before,'');await page.locator('#monochrome').uncheck();
   await page.locator('#v1 summary').tap();await page.locator('#v1 img').evaluate(e=>e.decode());assert.deepEqual(await page.locator('#v1 img').evaluate(e=>[e.naturalWidth,e.naturalHeight]),[1536,1024]);
   await page.evaluate(()=>localStorage.setItem('microcosme-v03','P4-preservation-sentinel'));await page.reload();await page.locator('#portrait svg').waitFor();assert.equal(await page.evaluate(()=>localStorage.getItem('microcosme-v03')),'P4-preservation-sentinel');
   await page.context().setOffline(true);await page.locator('#style').selectOption('waist_waves');await page.locator('#body').selectOption('bust');await page.locator('[data-preset=broad]').tap();assert.equal(await page.locator('#style').inputValue(),'waist_waves');await page.context().setOffline(false);
   if(process.env.CAPTURE_DIR){fs.mkdirSync(process.env.CAPTURE_DIR,{recursive:true});await page.setViewportSize({width:820,height:1180});await page.evaluate(()=>scrollTo(0,0));await page.screenshot({path:path.join(process.env.CAPTURE_DIR,type.name()+'-p4-ipad.png')});}
   await page.goto(new URL('audit.html',base).href);await page.locator('.audit-card svg').first().waitFor();assert.equal(await page.locator('.audit-card').count(),36);
   for(const value of ['priority','max','neutral']){await page.locator('#morph').selectOption(value);assert.equal(await page.locator('.audit-card svg').count(),36);}
   await page.locator('#mono').check();await page.locator('#mono').uncheck();
   for(const width of [820,1180,390]){await page.setViewportSize({width,height:820});assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));}
   if(process.env.CAPTURE_DIR){await page.setViewportSize({width:1180,height:820});for(const id of ['long_straight','waist_straight','waist_curls','afro','side_braid','asym_long'])await page.locator('#audit-'+id).screenshot({path:path.join(process.env.CAPTURE_DIR,type.name()+'-'+id+'.png')});}
   assert.deepEqual(errors,[]);assert.deepEqual(failures,[]);console.log(type.name()+' PASS: tactile, galerie18, corps6, paramètres8, responsive, références et audit36');
  }finally{await browser.close()}
 }}finally{await new Promise(resolve=>server.close(resolve))}
})().catch(e=>{console.error(e);process.exitCode=1});
