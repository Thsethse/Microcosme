const {chromium,webkit}=require('playwright');
const assert=require('node:assert/strict'),http=require('node:http'),fs=require('node:fs'),path=require('node:path');
(async()=>{
 const root=path.resolve(__dirname,'..'),server=http.createServer((req,res)=>{
  const name=decodeURIComponent(new URL(req.url,'http://local').pathname),file=path.resolve(root,'.'+name+(name.endsWith('/')?'index.html':''));
  if(!file.startsWith(root+path.sep)||!fs.existsSync(file)){res.writeHead(404).end();return}
  res.setHeader('Content-Type',file.endsWith('.mjs')?'text/javascript':file.endsWith('.css')?'text/css':file.endsWith('.png')?'image/png':file.endsWith('.md')?'text/plain':'text/html');res.end(fs.readFileSync(file));
 });await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
 const base=process.env.BASE_URL||`http://127.0.0.1:${server.address().port}/bio-vis-p5-i2/`;
 try{for(const type of [chromium,webkit]){
  const browser=await type.launch();try{
   const page=await browser.newPage({viewport:{width:820,height:1180},hasTouch:true,isMobile:true,deviceScaleFactor:1}),errors=[],failures=[];
   page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text())});page.on('response',r=>{if(r.status()>=400)failures.push(r.url())});
   await page.goto(base);await page.locator('#portrait svg').waitFor();
   assert.equal(await page.locator('#style option').count(),36);assert.equal(await page.locator('#lot-gallery .reference-card').count(),9);assert.equal(await page.locator('.arrangement-tile').count(),36);assert.equal(await page.locator('#gallery .tile').count(),18);assert.equal(await page.locator('input[type=range]').count(),8);assert.equal(await page.locator('#body option').count(),6);
   for(const tile of await page.locator('.arrangement-tile').all()){
    const id=await tile.getAttribute('data-style'),a=await tile.getAttribute('data-arrangement');await tile.tap();assert.equal(await page.locator('#style').inputValue(),id);assert.equal(await page.locator('#whole .lot-head').getAttribute('data-arrangement'),a);
    assert.equal(await page.locator('.arrangement-tile[aria-pressed=true]').count(),1);
    for(const body of ['standard','slim','broad','narrow','shoulders','bust'])await page.locator('#body').selectOption(body);
   }
   for(const id of await page.locator('#gallery .tile').evaluateAll(es=>es.map(e=>e.dataset.style))){
    await page.locator('#style').selectOption(id);assert.ok(await page.locator('#arrangements').isHidden());assert.equal(await page.locator('#whole .lot-head').count(),0);
   }
   for(const [style,a]of [['p5-028','D'],['p5-029','D'],['p5-030','D'],['p5-031','D'],['p5-032','G'],['p5-033','D'],['p5-034','D'],['p5-036','D']]){
    await page.locator('#style').selectOption(style);await page.locator('#arrangements [data-arrangement='+a+']').tap();
    for(const key of await page.locator('input[type=range]').evaluateAll(es=>es.map(e=>e.id))){
     await page.locator('#'+key).scrollIntoViewIfNeeded();const b=await page.locator('#'+key).boundingBox();await page.touchscreen.tap(b.x+b.width*.9,b.y+b.height/2);await page.waitForFunction(()=>document.querySelector('#preset-name').textContent==='Combinaison libre');assert.notEqual(await page.locator('#'+key).inputValue(),'1');await page.locator('[data-preset=neutral]').tap();
    }
   }
   await page.locator('#priority').tap();assert.deepEqual(await page.locator('input[type=range]').evaluateAll(es=>es.map(e=>+e.value)),[1.18,1.18,1.14,1.18,.9,1.22,1.35,.82]);
   await page.locator('#construction').check();assert.equal(await page.locator('#portrait .anchors circle').count(),28);await page.locator('#construction').uncheck();
   await page.locator('#monochrome').check();assert.ok(await page.locator('#accessories').isDisabled());assert.equal(await page.locator('#whole [data-layer=accessories]').innerHTML(),'');assert.equal(await page.locator('#whole [data-layer=accessories-back]').innerHTML(),'');await page.locator('#monochrome').uncheck();
   console.log(type.name()+' tactile UI PASS; starting SVG matrix');
   const report=await page.evaluate(async()=>{
    const {model,lotB:references,styles,controls,bodies}=await import(new URL('./model.mjs',location.href)),{character}=await import(new URL('./render.mjs',location.href)),{character:oldCharacter}=await import(new URL('./i1/render.mjs',location.href)),{priorityCase}=await import(new URL('./i1/base/r1/coverage.mjs',location.href)),{halfWidthAt}=await import(new URL('./i1/base/r1/coverage.mjs',location.href));
    const keys=Object.keys(controls),box=document.createElement('div');box.style.cssText='position:absolute;left:-10000px;top:0;width:212px;height:310px;contain:strict';document.body.append(box);
    const corners=Array.from({length:256},(_,mask)=>Object.fromEntries(keys.map((k,i)=>[k,controls[k][mask&(1<<i)?'max':'min']]))),samples=[{},priorityCase,...corners.filter((_,i)=>i%17===0),...Array.from({length:12},(_,i)=>Object.fromEntries(keys.map((k,j)=>[k,controls[k].min+(controls[k].max-controls[k].min)*(.5+.5*Math.sin((i+1)*.67+j*.91))])))];
    const bad=[];let parsed=0,covered=0,coverageSamples=0,shaved=0,framed=0,legacy=0;
    const add=o=>{if(bad.length<300)bad.push(o)};
    function filledPaths(svg){return [...svg.querySelectorAll('[data-layer=volume] path,[data-layer=front] path,[data-layer=sides] path,[data-layer=lengths] path')].filter(e=>e.getAttribute('fill')!=='none').map(e=>{const attr=e.closest('[clip-path]')?.getAttribute('clip-path'),clip=attr?svg.querySelector(attr.slice(4,-1)+' path'):null;return {e,b:e.getBBox(),clip}})}
    const filled=(paths,x,y)=>paths.some(({e,b,clip})=>x>=b.x&&x<=b.x+b.width&&y>=b.y&&y<=b.y+b.height&&(!clip||clip.isPointInFill(new DOMPoint(x,y)))&&e.isPointInFill(new DOMPoint(x,y)));
    // Every min/max corner is parsed by the actual SVG engine. Coverage has an independent, smaller mixed-state matrix.
    for(const style of Object.keys(references))for(const arrangement of ['G','D'])for(const [mask,p]of corners.entries()){
     box.innerHTML=character({...p,style,arrangement});
     for(const e of box.querySelectorAll('path')){const L=e.getTotalLength();if(!Number.isFinite(L)||L<=0)add({style,arrangement,mask,reason:'invalid SVG path'});const q=e.getPointAtLength(L*.43);if(!Number.isFinite(q.x)||!Number.isFinite(q.y))add({style,arrangement,mask,reason:'invalid coordinate'});}
     parsed++;
    }
    for(const style of Object.keys(references))for(const arrangement of ['G','D'])for(const [i,p]of samples.entries()){
     const state={...p,style,arrangement},m=model(state);box.innerHTML=character(state);const svg=box.querySelector('svg'),face=svg.querySelector('[data-layer=face] path'),L=face.getTotalLength(),paths=filledPaths(svg),cutY=m.anchors.templeRight[1]-5,topOnly=(style==='p5-020'||style==='p5-025')&&arrangement==='G',half=style==='p5-025'&&arrangement==='D';
     for(let k=0;k<100;k++){
      const at=L*k/100,q=face.getPointAtLength(at);if(q.y>m.fit.cy-m.fit.ry*.22)continue;
      if((topOnly||half&&q.x>80+m.fit.temple*.72)&&q.y>cutY-2)continue;
      const a=face.getPointAtLength(Math.max(0,at-.01)),b=face.getPointAtLength(Math.min(L,at+.01)),dx=b.x-a.x,dy=b.y-a.y,n=Math.hypot(dx,dy);
      for(const off of [-.8,0,1.9]){coverageSamples++;if(!filled(paths,q.x+dy/n*off,q.y-dx/n*off))add({style,arrangement,i,reason:'scalp exposed'});}
     }
     for(const [key,[x,y]]of Object.entries(m.base.anchors))if(filled(paths,x,y))add({style,arrangement,i,key,reason:'face landmark hidden'});
     if(topOnly||half){
      const yy=cutY+(m.fit.cy-m.fit.ry*.12-cutY)*.8;
      for(const sign of topOnly?[-1,1]:[1]){if(filled(paths,80+sign*(halfWidthAt(m,yy)-2.5),yy))add({style,arrangement,i,reason:'shaved area hidden'});shaved++;}
     }
     // The first braid bundle must overlap the roots, not float beside the skull.
     const roots=filledPaths(svg).filter(({e})=>!e.closest('[data-layer=lengths]'));
     for(const braid of svg.querySelectorAll('[data-layer=lengths] [data-feature=braid]')){
      const [rx,ry]=braid.dataset.root.split(',').map(Number);
      if(!filled(roots,rx,ry))add({style,arrangement,i,reason:'braid root detached'});
     }
     // Curls and braided strands are actual filled paths, retained in the close-up.
     for(const g of svg.querySelectorAll('[data-feature=braid],[data-feature=open-curls]')){
      const b=g.getBBox();if(b.width<2||b.height<2)add({style,arrangement,i,reason:'invisible strand'});
     }
     covered++;
     // Identical front lengths in full body, portrait and tiny drawing, with valid clip references.
     const wholeLengths=svg.querySelector('[data-layer=lengths]').innerHTML;
     for(const options of [{headOnly:true},{headOnly:true,smallScale:true}]){
      box.innerHTML=character(state,options);const detail=box.querySelector('svg');if(detail.querySelector('[data-layer=lengths]').innerHTML!==wholeLengths)add({style,arrangement,i,reason:'different lengths by scale'});
      for(const g of detail.querySelectorAll('[clip-path]'))if(!detail.querySelector(g.getAttribute('clip-path').slice(4,-1)))add({style,arrangement,i,reason:'missing clip definition'});
      const view=detail.viewBox.baseVal;
      for(const g of detail.querySelectorAll('.lot-head,[data-layer=rear],[data-layer=lengths],[data-layer=accessories],[data-layer=accessories-back]')){if(!g.childElementCount)continue;const b=g.getBBox();if(b.x-2<view.x||b.y-2<view.y||b.x+b.width+2>view.x+view.width||b.y+b.height+2>view.y+view.height)add({style,arrangement,i,reason:'hair cropped',bbox:[b.x,b.y,b.width,b.height]});}
     }
    }
    for(const style of Object.keys(references))for(const arrangement of ['G','D'])for(const body of Object.keys(bodies))for(const p of [{},priorityCase,samples[17]]){
     box.innerHTML=character({...p,style,arrangement,body});const svg=box.querySelector('svg'),b=svg.getBBox(),v=svg.viewBox.baseVal;
     if(b.x-3<v.x||b.y-3<v.y||b.x+b.width+3>v.x+v.width||b.y+b.height+3>v.y+v.height)add({style,arrangement,body,reason:'body crop'});framed++;
    }
    for(const style of Object.keys(styles).filter(id=>!references[id]))for(const arrangement of style.startsWith('p5-')?['G','D']:['G'])for(const p of [{},priorityCase])for(const options of [{},{headOnly:true},{headOnly:true,smallScale:true}]){
     const state={...p,style,arrangement};if(character(state,options)!==oldCharacter(state,options))add({style,reason:'legacy regression'});legacy++;
    }
    box.remove();return {parsed,covered,coverageSamples,shaved,framed,legacy,bad};
   });console.log(type.name()+' matrix '+JSON.stringify(report));assert.deepEqual(report.bad,[]);assert.equal(report.parsed,4608);assert.equal(report.covered,540);assert.equal(report.framed,324);assert.equal(report.legacy,216);
   for(const viewport of [{width:820,height:1180},{width:1180,height:820},{width:768,height:1024},{width:390,height:844}]){
    await page.setViewportSize(viewport);assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));for(const id of ['whole','portrait','mini']){const b=await page.locator('#'+id+' svg').boundingBox();assert.ok(b.x>=0&&b.x+b.width<=viewport.width);}
   }
   await page.locator('#lot-sheet summary').tap();await page.locator('#lot-sheet img').scrollIntoViewIfNeeded();await page.waitForFunction(()=>{const e=document.querySelector('#lot-sheet img');return e.complete&&e.naturalWidth===1536});
   await page.evaluate(()=>localStorage.setItem('microcosme-v03','P5-preservation-sentinel'));await page.reload();await page.locator('#portrait svg').waitFor();assert.equal(await page.evaluate(()=>localStorage.getItem('microcosme-v03')),'P5-preservation-sentinel');
   await page.context().setOffline(true);await page.locator('#style').selectOption('p5-035');await page.locator('#arrangements [data-arrangement=D]').tap();await page.locator('#body').selectOption('bust');await page.locator('#priority').tap();await page.context().setOffline(false);
   await page.locator('#reset').tap();assert.equal(await page.locator('#style').inputValue(),'p5-028');assert.equal(await page.locator('#body').inputValue(),'standard');
   assert.ok(await page.evaluate(()=>{const ids=[...document.querySelectorAll('[id]')].map(e=>e.id);return new Set(ids).size===ids.length}));
   if(process.env.CAPTURE_DIR&&type===webkit){
    fs.mkdirSync(process.env.CAPTURE_DIR,{recursive:true});await page.setViewportSize({width:1180,height:820});await page.locator('#lot-gallery').screenshot({path:path.join(process.env.CAPTURE_DIR,type.name()+'-lot-b.png')});
    await page.locator('#monochrome').check();await page.locator('#lot-gallery').screenshot({path:path.join(process.env.CAPTURE_DIR,type.name()+'-lot-b-monochrome.png')});await page.locator('#monochrome').uncheck();
    await page.setViewportSize({width:820,height:1180});for(const [style,a]of [['p5-028','D'],['p5-032','D'],['p5-034','D']]){await page.locator('#style').selectOption(style);await page.locator('#arrangements [data-arrangement='+a+']').tap();await page.evaluate(()=>scrollTo(0,0));await page.screenshot({path:path.join(process.env.CAPTURE_DIR,type.name()+'-'+style+'-'+a+'-ipad.png')});}
   }
   await page.goto(new URL('comparison.html',base).href);await page.locator('.compare-case').last().waitFor();
   const refs=await page.locator('#reference option').evaluateAll(es=>es.map(e=>e.value).filter(id=>Number(id.slice(3))>=28));
   for(const ref of refs){
    await page.locator('#reference').selectOption(ref);assert.equal(await page.locator('.compare-case').count(),2);assert.equal(await page.locator('.body-compare .audit-card').count(),12);
    for(const morph of ['neutral','tall','broad','priority'])await page.locator('#morph').selectOption(morph);
    await page.locator('#mono').check();await page.locator('#mono').uncheck();await page.locator('#morph').selectOption('neutral');
    if(process.env.CAPTURE_DIR&&type===webkit){await page.setViewportSize({width:1180,height:820});for(const a of ['G','D'])await page.locator('#arrangement-'+a).screenshot({path:path.join(process.env.CAPTURE_DIR,type.name()+'-'+ref+'-'+a+'-comparison.png')});}
   }
   for(const width of [820,1180,390]){await page.setViewportSize({width,height:1180});assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));}
   assert.deepEqual(errors,[]);assert.deepEqual(failures,[]);console.log(type.name()+' PASS: 36 IDs, 36 P5 arrangements, tactile eight axes, six bodies, three scales, reference, storage and P5-I1 comparisons');
  }finally{await browser.close()}
 }}finally{await new Promise(resolve=>server.close(resolve))}
})().catch(e=>{console.error(e);process.exitCode=1});
