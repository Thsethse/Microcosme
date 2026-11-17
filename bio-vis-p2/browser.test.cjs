const {chromium,webkit}=require('playwright');
const assert=require('node:assert/strict');
const http=require('node:http'),fs=require('node:fs'),path=require('node:path');
(async()=>{
 const root=path.resolve(__dirname,'..');
 const server=http.createServer((req,res)=>{
  const pathname=decodeURIComponent(new URL(req.url,'http://local').pathname),file=path.resolve(root,'.'+pathname+(pathname.endsWith('/')?'index.html':''));
  if(!file.startsWith(root+path.sep)||!fs.existsSync(file)){res.writeHead(404).end();return}
  res.setHeader('Content-Type',file.endsWith('.mjs')?'text/javascript':file.endsWith('.css')?'text/css':file.endsWith('.png')?'image/png':'text/html');res.end(fs.readFileSync(file));
 });
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
 try{
  for(const type of [chromium,webkit]){
   const browser=await type.launch();
   try{
    const page=await browser.newPage({viewport:{width:820,height:1180},hasTouch:true,isMobile:true,deviceScaleFactor:2});
    const errors=[],failures=[];page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.status()>=400)failures.push(r.url())});
    await page.goto(process.env.BASE_URL||`http://127.0.0.1:${server.address().port}/bio-vis-p2/`);
    await page.locator('.sample').last().waitFor();assert.equal(await page.locator('.sample').count(),9);
    const same=async()=>{
     const whole=await page.locator('#whole .p2-head').innerHTML();
     assert.equal(await page.locator('#portrait .p2-head').innerHTML(),whole);assert.equal(await page.locator('#mini .p2-head').innerHTML(),whole);
    };
    await same();
    for(let i=0;i<9;i++){
     await page.locator('.sample').nth(i).tap();await same();
     const b=page.locator('.sample').nth(i),head=await b.getAttribute('data-head'),cut=await b.getAttribute('data-cut');
     assert.equal(await page.locator('#whole .p2-head').getAttribute('data-head'),head);assert.equal(await page.locator('#whole .p2-head').getAttribute('data-cut'),cut);
     const problems=await page.locator('#portrait svg').evaluate(svg=>{
      const box=svg.querySelector('.p2-head').getBBox(),v=svg.viewBox.baseVal,bad=[];
      if(box.x-3<v.x||box.y-3<v.y||box.x+box.width+3>v.x+v.width||box.y+box.height+3>v.y+v.height)bad.push('cropped');
      // Painted foreground hair must not occlude eyes, brows, nose or mouth.
      const face=svg.querySelector('[data-layer=face] .head-shape');
      const eyes=[...face.querySelectorAll('ellipse')].filter(e=>e.getAttribute('fill')==='#ebebeb');
      const points=eyes.flatMap(e=>{const x=e.cx.baseVal.value,y=e.cy.baseVal.value;return [{x,y},{x:x-2,y},{x:x+2,y},{x,y:y-12}]});
      for(const p of svg.querySelectorAll('[data-layer=volume] path,[data-layer=front] path,[data-layer=sides] path')){
       if(p.getAttribute('fill')==='none')continue;
       if(points.some(pt=>p.isPointInFill(new DOMPoint(pt.x,pt.y))))bad.push('face occluded');
      }
      if(svg.innerHTML.match(/NaN|Infinity|undefined/))bad.push('invalid');return bad;
     });assert.deepEqual(problems,[],cut+' '+head);
    }
    await page.locator('#heads button[data-head=round]').tap();
    const before=await page.locator('#whole .p2-head').getAttribute('data-cut');
    await page.locator('#heads button[data-head=pear]').tap();assert.equal(await page.locator('#whole .p2-head').getAttribute('data-cut'),before);
    await page.locator('#construction').check();assert.equal(await page.locator('#portrait .anchors circle').count(),10);await same();
    for(const value of ['back','volume','front','sides','texture','']){await page.locator('#layer').selectOption(value);await same()}
    await page.locator('#construction').uncheck();
    for(const viewport of [{width:820,height:1180},{width:1180,height:820},{width:768,height:1024},{width:390,height:844}]){
     await page.setViewportSize(viewport);assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
     assert.equal(await page.locator('.sample').count(),9);
     for(const select of ['#whole svg','#portrait svg','#mini svg']){const b=await page.locator(select).boundingBox();assert.ok(b.x>=0&&b.x+b.width<=viewport.width)}
    }
    await page.locator('#catalogue summary').tap();await page.locator('#catalogue-image').scrollIntoViewIfNeeded();await page.locator('#catalogue-image').evaluate(img=>img.decode());
    assert.deepEqual(await page.locator('#catalogue-image').evaluate(img=>[img.naturalWidth,img.naturalHeight]),[1536,1024]);
    await page.locator('#catalogue summary').tap();
    await page.context().setOffline(true);await page.locator('#cuts button[data-cut=bob]').tap();await same();await page.context().setOffline(false);
    if(process.env.CAPTURE_DIR){
     await page.setViewportSize({width:820,height:1180});await page.screenshot({path:path.join(process.env.CAPTURE_DIR,type.name()+'-p2-ipad.png'),fullPage:true});
     await page.setViewportSize({width:1180,height:820});await page.screenshot({path:path.join(process.env.CAPTURE_DIR,type.name()+'-p2-landscape.png'),fullPage:true});
    }
    await page.locator('#p1-link').tap();await page.locator('#body svg').waitFor();assert.equal(await page.locator('.specimen').count(),6);
    assert.deepEqual(errors,[]);assert.deepEqual(failures,[]);
    console.log(type.name()+': 9 combinations, tactile selection, 3 scales identical, no hair over eyes/brows, bounds, layers, 4 viewports, catalogue, offline, return to P1: OK');
   }finally{await browser.close()}
  }
 }finally{await new Promise(resolve=>server.close(resolve))}
})().catch(e=>{console.error(e);process.exitCode=1});
