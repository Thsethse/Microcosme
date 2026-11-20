const {chromium,webkit}=require('playwright');
const {createServer}=require('node:http');
const {readFile,mkdir,writeFile}=require('node:fs/promises');
const path=require('node:path');
const assert=require('node:assert/strict');
const root=path.resolve(__dirname,'../..'),out=process.env.ARTIFACT_DIR||'/tmp/microcosme-dedup-lot3-browser';
let server;
(async()=>{
 await mkdir(out,{recursive:true});let base=process.env.BASE_URL;
 if(!base){server=createServer(async(req,res)=>{try{const url=new URL(req.url,'http://local'),file=path.resolve(root,'.'+decodeURIComponent(url.pathname)+(url.pathname.endsWith('/')?'index.html':''));if(!file.startsWith(root+path.sep))throw Error('scope');const data=await readFile(file);res.writeHead(200,{'Content-Type':{'.mjs':'text/javascript','.css':'text/css','.html':'text/html','.json':'application/json','.png':'image/png'}[path.extname(file)]||'text/plain'}).end(data);}catch{res.writeHead(404).end();}});await new Promise(r=>server.listen(0,'127.0.0.1',r));base=`http://127.0.0.1:${server.address().port}/bio-vis-dedup-lot-3/`;}
 const baseline=new URL(process.env.BASE_URL?'../':'../preview/',base).href,report={url:base,engines:[]};
 for(const [name,engine]of [['chromium',chromium],['webkit',webkit]]){
  const browser=await engine.launch();try{
   const page=await browser.newPage({viewport:{width:820,height:1180},deviceScaleFactor:1,hasTouch:true,isMobile:true}),errors=[],failed=[];
   page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.status()>=400)failed.push(r.url()+' '+r.status());});
   await page.goto(base,{waitUntil:'networkidle'});await page.waitForSelector('.case-card .after svg');
   const count=s=>page.locator(s).count(),raw=()=>page.locator('#selection-json').inputValue().then(JSON.parse),key=()=>page.locator('#selected-render').getAttribute('data-key');
   const load=async data=>{await page.locator('#json-panel').evaluate(e=>e.open=true);await page.locator('#selection-json').fill(JSON.stringify(data));await page.locator('#reload').click();assert.equal(await page.locator('#selection-error').textContent(),'');};
   assert.equal(await count('#ordinary option'),120);assert.equal(await count('#historical option'),126);assert.equal(await count('[data-control]'),8);assert.equal(await count('#body option'),6);
   const pairs=[['p5-019:G','p5-021:G'],['p5-028:G','p5-059:G'],['p5-047:G','p5-050:G'],['p5-049:G','p5-062:D'],['p5-064:G','p5-070:G'],['p5-056:G','p5-061:G']];
   const ordinary=await page.locator('#ordinary option').evaluateAll(es=>es.map(e=>e.value));
   for(const [primary,secondary]of pairs){assert(ordinary.includes(primary)&&!ordinary.includes(secondary));const [style,arrangement]=secondary.split(':'),data={style,arrangement,body:'bust',contrast:true,accessories:true,monochrome:false,metadata:{origin:'before-lot3',preserve:[1,2]}};await load(data);assert.equal(await key(),secondary);assert.equal(await page.locator('#ordinary').inputValue(),primary);assert.deepEqual(await raw(),data);await page.locator('#export').click();await page.locator('#reload').click();assert.deepEqual(await raw(),data);await page.locator('#show-original').check();assert.deepEqual(await raw(),data);if(['p5-050:G','p5-062:D'].includes(secondary))assert(await count('#selected-render .after [data-feature="contrast-color"]')>0);if(secondary==='p5-061:G'){assert.equal(await count('#selected-render .after .head [data-feature="loose-lock"]'),2);await page.locator('#choose-ordinary').click();assert.equal(await key(),primary);assert.equal(await count('#selected-render .after .head [data-feature="loose-lock"]'),0);await load(data);}await page.locator('#show-original').uncheck();}
   // All historical references remain reachable through the actual controls.
   await page.locator('#preset').selectOption('neutral');
   const historic=await page.locator('#historical option').evaluateAll(es=>es.map(e=>e.value));
   for(const k of historic){await page.locator('#historical').selectOption(k);await page.locator('#load-history').click();assert.equal(await key(),k);}
   await load({style:'p5-071',arrangement:'G',body:'standard',origin:'preserved'});
   await page.locator('#dossier-select').selectOption('all');assert.equal(await count('.case-card'),14);assert.equal(await count('.case-card[data-changed=true]'),10);
   assert(await page.locator('.original img').evaluateAll(async es=>{await Promise.all(es.map(e=>e.decode()));return es.every(e=>e.naturalWidth>0&&e.naturalHeight===256);}));
   await page.locator('#dossier-select').selectOption('E06');
   await page.locator('#catalogue-panel').evaluate(e=>e.open=true);await page.waitForSelector('#catalogue-grid .catalogue-card');assert.equal(await count('#catalogue-grid .catalogue-card'),120);
   const visible=await page.locator('#catalogue-grid .catalogue-card').evaluateAll(es=>es.map(e=>e.dataset.key));assert.deepEqual(visible,ordinary);assert(visible.includes('p5-071:G'));await page.locator('#catalogue-panel').evaluate(e=>e.open=false);
   // Record all five dossiers, at neutral and the user's priority morphology.
   for(const preset of ['neutral','ipad']){await page.locator('#preset').selectOption(preset);for(const id of ['E06','E09','Q03','V02','V09']){await page.locator('#dossier-select').selectOption(id);await page.locator('.original img').evaluateAll(es=>Promise.all(es.map(e=>e.decode())));await page.locator('#case-cards').screenshot({path:path.join(out,`${name}-${id}-${preset}.png`)});}}
   for(const preset of ['min','max','tall','broad']){await page.locator('#preset').selectOption(preset);assert.equal(await key(),'p5-071:G');}
   for(const body of ['standard','slim','broad','narrow','shoulders','bust']){await page.locator('#body').selectOption(body);assert.equal((await raw()).body,body);}
   await page.locator('#morph-panel').evaluate(e=>e.open=true);
   for(const axis of await page.locator('[data-control]').evaluateAll(es=>es.map(e=>e.dataset.control))){const slider=page.locator(`[data-control="${axis}"]`);await slider.scrollIntoViewIfNeeded();const b=await slider.boundingBox();await page.touchscreen.tap(b.x+b.width*.82,b.y+b.height/2);assert.notEqual(await slider.inputValue(),'1');assert.equal(await key(),'p5-071:G');}
   await page.locator('#preset').selectOption('neutral');await page.locator('#body').selectOption('standard');await page.locator('#morph-panel').evaluate(e=>e.open=false);
   const saved=await raw();await page.locator('#selection-json').fill('{"style":"unknown"}');await page.locator('#reload').click();assert.match(await page.locator('#selection-error').textContent(),/non chargée/);await page.locator('#export').click();assert.deepEqual(await raw(),saved);
   assert.equal(await count('#lot1-cards article'),4);
   const layouts=[];
   for(const [width,height,label]of [[820,1180,'ipad-portrait'],[1180,820,'ipad-landscape'],[390,844,'narrow']]){
    await page.setViewportSize({width,height});await page.locator('#dossier-select').selectOption('Q03');
    const data=await page.evaluate(()=>({width:innerWidth,scroll:document.documentElement.scrollWidth,head:document.querySelector('.case-card .after .head svg').getBoundingClientRect().height,tile:document.querySelector('.case-card .after .tile svg').getBoundingClientRect().height,mini:[document.querySelector('.case-card .after .mini svg').getBoundingClientRect().width,document.querySelector('.case-card .after .mini svg').getBoundingClientRect().height]}));
    assert(data.scroll<=width+1,JSON.stringify(data));assert.equal(data.head,300);assert.equal(data.tile,178);assert.deepEqual(data.mini,[70,70]);layouts.push(data);await page.locator('#compare').screenshot({path:path.join(out,name+'-'+label+'.png')});
   }
   const geometry=await page.evaluate(async({baseline,base})=>{
    const {character,hairLayers}=await import(base+'render.mjs'),{targets}=await import(base+'hair.mjs'),{character:before}=await import(baseline+'bio-vis-dedup-lot-2/render.mjs'),{model,controls,bodies}=await import(baseline+'bio-vis-p5-i6/model.mjs'),{scalpSamples}=await import(baseline+'bio-vis-p5-i6/i5/i4/i3/i2/i1/base/r1/coverage.mjs');
    const axes=Object.keys(controls),corners=Array.from({length:256},(_,mask)=>Object.fromEntries(axes.map((k,i)=>[k,controls[k][mask&(1<<i)?'max':'min']]))),intermediate=Array.from({length:16},(_,i)=>Object.fromEntries(axes.map((k,j)=>[k,controls[k].min+(controls[k].max-controls[k].min)*(.5+.46*Math.sin((i+1)*.67+j*.91))])));
    const samples=[{},...corners,...intermediate],box=document.createElement('div');box.style.cssText='position:absolute;left:-10000px;top:0;width:400px';document.body.append(box);
    const issues=[],issueCounts={};let parsed=0,eyeSamples=0,scalpChecks=0,frameChecks=0,faces=0,bodyChecks=0;const bounds={};
    const note=o=>{const k=o.tag.split(' ')[0]+' '+o.type;issueCounts[k]=(issueCounts[k]||0)+1;if(issues.length<30)issues.push(o);};
    function shapes(svg){return [...svg.querySelectorAll('[data-layer=volume] path,[data-layer=front] path,[data-layer=sides] path,[data-layer=lengths] path')].filter(e=>e.getAttribute('fill')!=='none').map(e=>({e,b:e.getBBox()}));}
    function covers(paths,p,stroke=false){return paths.some(({e,b})=>p.x>=b.x-2&&p.x<=b.x+b.width+2&&p.y>=b.y-2&&p.y<=b.y+b.height+2&&(e.isPointInFill(p)||stroke&&e.getAttribute('stroke')!=='none'&&e.isPointInStroke(p)));}
    function inspect(input,tag,options={}){
     const m=model(input),text=character(input,{...options,instance:'geometry'}),old=document.createElement('div');old.innerHTML=before(input,{...options,instance:'geometry'});box.innerHTML=text;const svg=box.querySelector('svg');parsed++;
     if(/NaN|Infinity|undefined/.test(text)||!svg)note({type:'invalid',tag});
     if(svg.querySelector('[data-layer=face]').innerHTML!==old.querySelector('[data-layer=face]').innerHTML)note({type:'face-changed',tag});else faces++;
     if(svg.querySelector('.body-shape')?.innerHTML!==old.querySelector('.body-shape')?.innerHTML)note({type:'body-changed',tag});else bodyChecks++;
     const paths=shapes(svg);
     for(const [ex,ey]of [m.base.anchors.eyeLeft,m.base.anchors.eyeRight])for(let u=-1;u<=1;u+=.25)for(let v=-1;v<=1;v+=.25)if(u*u+v*v<=1){const p=new DOMPoint(ex+u*m.fit.rx*.26,ey+v*m.fit.ry*.135);eyeSamples++;if(covers(paths,p,true))note({type:'eye-covered',tag,point:[p.x,p.y]});}
     for(const k of ['nose','mouth','browLeft','browRight'])if(covers(paths,new DOMPoint(...m.base.anchors[k]),true))note({type:'feature-covered',tag,feature:k});
     for(const p of scalpSamples(m)){scalpChecks++;if(!covers(paths,new DOMPoint(p.x+p.nx*2.1,p.y+p.ny*2.1)))note({type:'scalp-exposed',tag,point:[p.x,p.y]});}
     const frame=svg.viewBox.baseVal;for(const e of [...svg.querySelectorAll('[data-layer=rear] path'),...paths.map(p=>p.e)]){if(e.getAttribute('fill')==='none')continue;const b=e.getBBox();frameChecks++;if(b.x<frame.x+1||b.y<frame.y+1||b.x+b.width>frame.x+frame.width-1||b.y+b.height>frame.y+frame.height-1)note({type:'frame-clipped',tag,bounds:[b.x,b.y,b.width,b.height]});const prev=bounds[input.style+':'+input.arrangement]||[Infinity,Infinity,-Infinity,-Infinity];bounds[input.style+':'+input.arrangement]=[Math.min(prev[0],b.x),Math.min(prev[1],b.y),Math.max(prev[2],b.x+b.width),Math.max(prev[3],b.y+b.height)];}
     // The bun's support, original locks and accessories stay exactly those of the previous recipe.
     if(['p5-056','p5-061'].includes(input.style)){const a=hairLayers(m,'geometry');if(a.back!==beforeLayers(m,'geometry').back)note({type:'bun-changed',tag});}
    }
    const {hairLayers:beforeLayers}=await import(baseline+'bio-vis-dedup-lot-2/render.mjs');
    for(const key of targets){const [style,arrangement]=key.split(':');for(const [i,p]of samples.entries())inspect({...p,style,arrangement,body:'standard',monochrome:true,accessories:false},key+' sample '+i);
     for(const body of Object.keys(bodies))for(const [i,p]of [{},corners[0],corners[255]].entries())inspect({...p,style,arrangement,body,monochrome:true,accessories:false},key+' body '+body+' '+i);
     for(const accessories of [true,false])for(const [view,o]of [{headOnly:true},{headOnly:true,smallScale:true}].entries())inspect({style,arrangement,body:'standard',monochrome:!accessories,accessories},key+' view '+view+' objects '+accessories,o);
    }
    box.remove();return {morphologies:samples.length,parsed,eyeSamples,scalpChecks,frameChecks,faces,bodyChecks,bounds,issueCounts,issues};
   },{baseline,base});
   await writeFile(path.join(out,name+'-geometry.json'),JSON.stringify(geometry,null,2)+'\n');
   assert.deepEqual(geometry.issues,[],JSON.stringify(geometry.issues));assert.deepEqual(errors,[]);assert.deepEqual(failed,[]);
   report.engines.push({engine:name,version:browser.version(),layouts,geometry,errors,failed});
   console.log(name+': PASS '+JSON.stringify({parsed:geometry.parsed,eyeSamples:geometry.eyeSamples,scalpChecks:geometry.scalpChecks,frames:geometry.frameChecks,historicalOptionsLoaded:126,ordinaryEntries:120}));
  }finally{await browser.close();}
 }
 await writeFile(path.join(out,'results.json'),JSON.stringify(report,null,2)+'\n');
})().catch(e=>{console.error(e);process.exitCode=1;}).finally(()=>{if(server)server.close();});
