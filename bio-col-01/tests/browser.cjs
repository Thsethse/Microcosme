const {chromium,webkit}=require('playwright');
const {createServer}=require('node:http');
const {readFile,mkdir,writeFile}=require('node:fs/promises');
const path=require('node:path');
const assert=require('node:assert/strict');
const root=path.resolve(__dirname,'../..'),out=process.env.ARTIFACT_DIR||'/tmp/microcosme-bio-col01-browser';let server;
(async()=>{
 await mkdir(out,{recursive:true});let base=process.env.BASE_URL;
 if(!base){server=createServer(async(req,res)=>{try{const u=new URL(req.url,'http://local'),file=path.resolve(root,'.'+decodeURIComponent(u.pathname)+(u.pathname.endsWith('/')?'index.html':''));if(!file.startsWith(root+path.sep))throw Error('scope');const data=await readFile(file);res.writeHead(200,{'Content-Type':{'.mjs':'text/javascript','.css':'text/css','.html':'text/html','.json':'application/json','.png':'image/png'}[path.extname(file)]||'text/plain'}).end(data);}catch{res.writeHead(404).end();}});await new Promise(r=>server.listen(0,'127.0.0.1',r));base=`http://127.0.0.1:${server.address().port}/bio-col-01/`;}
 const inherited=new URL(process.env.BASE_URL?'../':'../preview/',base).href,report={url:base,engines:[]};
 for(const [name,engine]of [['chromium',chromium],['webkit',webkit]]){
  const browser=await engine.launch();try{
   const page=await browser.newPage({viewport:{width:820,height:1180},hasTouch:true,isMobile:true,deviceScaleFactor:1}),errors=[],failed=[];
   page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.status()>=400)failed.push(r.url()+' '+r.status());});
   await page.goto(base,{waitUntil:'networkidle'});await page.waitForSelector('#selected-comparison svg');
   const count=s=>page.locator(s).count(),raw=()=>page.locator('#selection-json').inputValue().then(JSON.parse),key=()=>page.locator('#selected-comparison').getAttribute('data-key');
   const load=async data=>{await page.locator('#json-panel').evaluate(e=>e.open=true);await page.locator('#selection-json').fill(JSON.stringify(data));await page.locator('#reload').click();assert.equal(await page.locator('#selection-error').textContent(),'');};
   const choose=async id=>{const category=['rouge','rose','violet','bleu','turquoise','vert'].some(s=>id.startsWith(s+'-'))?'fantasy':'natural';await page.locator('[data-category='+category+']').tap();await page.locator('.swatch[data-colour='+id+']').tap();assert.equal(await page.locator('#selected-comparison').getAttribute('data-colour'),id);};
   assert.equal(await count('#ordinary option'),120);assert.equal(await count('#historical option'),126);assert.equal(await count('[data-control]'),8);assert.equal(await count('#body option'),6);
   for(const [category,expected]of [['natural',14],['fantasy',12]]){await page.locator('[data-category='+category+']').tap();assert.equal(await count('.swatch'),expected);const ids=await page.locator('.swatch').evaluateAll(es=>es.map(e=>e.dataset.colour));for(const id of ids){await page.locator('.swatch[data-colour='+id+']').tap();assert.equal(await page.locator('#selected-comparison').getAttribute('data-colour'),id);assert.match(await page.locator('#colour-info').textContent(),/#[0-9a-f]{6}/);}}
   // Swatch and mode changes never alter the historical payload.
   const saved=await raw();await choose('noir-profond');assert.deepEqual(await raw(),saved);await page.locator('#flat-mode').uncheck();
   assert(await page.evaluate(()=>{const norm=s=>s.replaceAll(/bio-col-\d+/g,'same');return norm(document.querySelector('.historical .head svg').outerHTML)===norm(document.querySelector('.coloured .head svg').outerHTML);}));await page.locator('#flat-mode').check();
   const pairs=[['p5-019:G','p5-021:G'],['p5-028:G','p5-059:G'],['p5-047:G','p5-050:G'],['p5-049:G','p5-062:D'],['p5-064:G','p5-070:G'],['p5-056:G','p5-061:G']],ordinary=await page.locator('#ordinary option').evaluateAll(es=>es.map(e=>e.value));
   for(const [primary,secondary]of pairs){assert(ordinary.includes(primary)&&!ordinary.includes(secondary));const [style,arrangement]=secondary.split(':'),data={style,arrangement,body:'bust',contrast:true,accessories:true,monochrome:false,metadata:{origin:'historical',colour:'keep',nested:[1,2]}};await load(data);assert.equal(await key(),secondary);assert.equal(await page.locator('#ordinary').inputValue(),primary);await choose('blanc-ivoire');assert.deepEqual(await raw(),data);await page.locator('#export').click();await page.locator('#reload').click();assert.deepEqual(await raw(),data);
    if(['p5-050:G','p5-062:D'].includes(secondary)){assert(await count('.coloured [data-feature="contrast-color"]')>0);await page.locator('#contrast').uncheck();assert.equal(await count('.coloured [data-feature="contrast-color"]'),0);await page.locator('#contrast').check();}
    if(secondary==='p5-061:G'){assert.equal(await count('.coloured .head [data-feature="loose-lock"]'),2);await page.locator('#choose-ordinary').click();assert.equal(await key(),primary);assert.equal(await count('.coloured .head [data-feature="loose-lock"]'),0);}
   }
   const ids=await page.locator('#historical option').evaluateAll(es=>es.map(e=>e.value));for(const id of ids){await page.locator('#historical').selectOption(id);await page.locator('#load-history').click();assert.equal(await key(),id);}
   await load({style:'p5-071',arrangement:'G',body:'standard',contrast:true,accessories:true,origin:'same historical data'});
   await page.locator('#series-panel').evaluate(e=>e.open=true);await page.waitForSelector('.series-card');assert.equal(await count('.series-card'),26);assert.equal(await count('.variety-card'),16);await page.locator('#series').screenshot({path:path.join(out,name+'-palette-chart.png')});
   for(const [id,background]of [['noir-profond','light'],['noir-profond','dark'],['brun-sombre','light'],['blond-pale','light'],['blanc-ivoire','light'],['blanc-ivoire','dark'],['gris-perle','dark'],['rouge-vif','light'],['bleu-nuit','dark'],['rose-clair','dark'],['turquoise-clair','dark'],['vert-emeraude','light']]){await choose(id);await page.locator('#background').selectOption(background);await page.locator('#comparison').screenshot({path:path.join(out,`${name}-${id}-${background}.png`)});}
   await page.locator('#variety').screenshot({path:path.join(out,name+'-variety.png')});await page.locator('#series-panel').evaluate(e=>e.open=false);
   for(const preset of ['min','max','ipad','tall','broad','neutral']){await page.locator('#preset').selectOption(preset);assert.equal(await key(),'p5-071:G');}
   for(const b of ['standard','slim','broad','narrow','shoulders','bust']){await page.locator('#body').selectOption(b);assert.equal((await raw()).body,b);}
   await page.locator('#morph-panel').evaluate(e=>e.open=true);for(const axis of await page.locator('[data-control]').evaluateAll(es=>es.map(e=>e.dataset.control))){const slider=page.locator('[data-control='+axis+']');await slider.scrollIntoViewIfNeeded();const b=await slider.boundingBox();await page.touchscreen.tap(b.x+b.width*.82,b.y+b.height/2);assert.notEqual(await slider.inputValue(),'1');}
   await page.locator('#preset').selectOption('neutral');await page.locator('#body').selectOption('standard');await page.locator('#morph-panel').evaluate(e=>e.open=false);
   const previous=await raw();await page.locator('#selection-json').fill('{"style":"unknown"}');await page.locator('#reload').click();assert.match(await page.locator('#selection-error').textContent(),/non chargée/);await page.locator('#export').click();assert.deepEqual(await raw(),previous);
   const layouts=[];for(const [width,height,label]of [[820,1180,'ipad-portrait'],[1180,820,'ipad-landscape'],[390,844,'narrow']]){await page.setViewportSize({width,height});await choose('blanc-ivoire');const sizes=await page.evaluate(()=>({width:innerWidth,scroll:document.documentElement.scrollWidth,head:document.querySelector('.coloured .head svg').getBoundingClientRect().height,tile:document.querySelector('.coloured .tile svg').getBoundingClientRect().height,mini:[document.querySelector('.coloured .mini svg').getBoundingClientRect().width,document.querySelector('.coloured .mini svg').getBoundingClientRect().height]}));assert(sizes.scroll<=width+1,JSON.stringify(sizes));assert.equal(sizes.head,300);assert.equal(sizes.tile,178);assert.deepEqual(sizes.mini,[70,70]);layouts.push(sizes);await page.locator('#series-panel').evaluate(e=>e.open=true);assert(await page.locator('.series-card .twins .mini').evaluateAll(es=>es.every(e=>{const a=e.getBoundingClientRect(),b=e.querySelector('svg').getBoundingClientRect();return b.x>=a.x&&b.x+b.width<=a.x+a.width+.01;})),'70px swatches fit both backgrounds');await page.locator('#series-panel').evaluate(e=>e.open=false);await page.locator('#atelier').screenshot({path:path.join(out,name+'-'+label+'.png')});}
   const geometry=await page.evaluate(async({base,inherited})=>{
    const {palette}=await import(base+'palette.mjs'),{character}=await import(base+'render.mjs'),{character:before}=await import(inherited+'bio-vis-dedup-lot-3/render.mjs'),{choices}=await import(base+'catalogue.mjs');
    const hair=new Set(['rear','back','volume','front','sides','texture','lengths']),shapes=new Set(['path','circle','ellipse','rect','line','polyline','polygon']),host=document.createElement('div');host.style.cssText='position:absolute;left:-10000px;width:400px';document.body.append(host);
    let parsed=0,hairPaintChecks=0,protectedChecks=0,geometryChecks=0;const issues=[],issueCounts={},note=(type,key)=>{issueCounts[type]=(issueCounts[type]||0)+1;if(issues.length<20)issues.push({type,key});};
    const noPaint=n=>[...n.attributes].filter(a=>!['fill','stroke'].includes(a.name)).map(a=>[a.name,a.value]);
    for(const e of choices)for(const enabled of [false,true]){
     const input={style:e.style,arrangement:e.arrangement==='U'?'G':e.arrangement,accessories:enabled,contrast:enabled,monochrome:false},oldDoc=document.createElement('div');oldDoc.innerHTML=before(input,{instance:'dom-check'});const old=[...oldDoc.querySelectorAll('*')];
     for(const p of palette){host.innerHTML=character(input,{instance:'dom-check',hairColor:p.id});const nodes=[...host.querySelectorAll('*')];parsed++;if(old.length!==nodes.length){note('node-count',e.key);continue;}
      for(let i=0;i<old.length;i++){
       const a=old[i],b=nodes[i];geometryChecks++;if(a.tagName!==b.tagName||JSON.stringify(noPaint(a))!==JSON.stringify(noPaint(b)))note('geometry-or-other-attribute',e.key);
       const layer=a.closest('[data-layer]')?.getAttribute('data-layer'),tie=(e.style==='pony'&&layer==='rear'&&a.getAttribute('stroke-width')==='4')||(['braids','side_braid'].includes(e.style)&&layer==='lengths'&&a.getAttribute('stroke-width')==='3.3');
       const eligible=shapes.has(a.tagName)&&hair.has(layer)&&!a.closest('defs,clipPath,mask')&&!tie;
       if(eligible){for(const attr of ['fill','stroke']){const value=a.getAttribute(attr);if(value&&value!=='none'&&value!=='transparent'){hairPaintChecks++;if(b.getAttribute(attr)!==(attr==='fill'?p.fill:p.stroke))note('hair-paint',e.key);}}}
       else{protectedChecks++;for(const attr of ['fill','stroke'])if(a.getAttribute(attr)!==b.getAttribute(attr))note('protected-paint',e.key);}
      }
     }
    }
    // Rasterise only a disposable hair copy at the actual 70 px scale. This verifies
    // that fill and contour survive sampling; it is not an aesthetic acceptance test.
    const raster=[];for(const key of ['p5-038:G','curls:U','waist_waves:U','p5-041:G','p5-056:D','p5-071:G'])for(const p of palette){
     const [style,arrangement]=key.split(':'),text=character({style,arrangement:arrangement==='U'?'G':arrangement,accessories:false,contrast:false},{headOnly:true,smallScale:true,instance:'raster',hairColor:p.id});host.innerHTML=text;const svg=host.querySelector('svg');svg.setAttribute('viewBox','-35 -68 230 245');svg.setAttribute('width','70');svg.setAttribute('height','70');svg.querySelectorAll('[data-layer=face],.body-shape,[data-layer=color],[data-layer^=accessories]').forEach(n=>n.remove());
     const im=new Image();im.src='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(new XMLSerializer().serializeToString(svg));await im.decode();const canvas=document.createElement('canvas');canvas.width=70;canvas.height=70;const ctx=canvas.getContext('2d');ctx.drawImage(im,0,0,70,70);const data=ctx.getImageData(0,0,70,70).data;
     const rgb=h=>[1,3,5].map(i=>parseInt(h.slice(i,i+2),16)),f=rgb(p.fill),s=rgb(p.stroke);let fill=0,stroke=0;for(let i=0;i<data.length;i+=4)if(data[i+3]>=64){if(Math.hypot(...f.map((v,j)=>v-data[i+j]))<=18)fill++;if(Math.hypot(...s.map((v,j)=>v-data[i+j]))<=18)stroke++;}if(fill<5||stroke<1)note('raster-paint-missing',key+' '+p.id);raster.push({key,colour:p.id,fillPixels:fill,contourPixels:stroke});
    }
    host.remove();return {parsed,hairPaintChecks,protectedChecks,geometryChecks,rasterCases:raster.length,rasterMinFill:Math.min(...raster.map(r=>r.fillPixels)),rasterMinContour:Math.min(...raster.map(r=>r.contourPixels)),issueCounts,issues};
   },{base,inherited});
   await writeFile(path.join(out,name+'-geometry.json'),JSON.stringify(geometry,null,2)+'\n');assert.deepEqual(geometry.issues,[],JSON.stringify(geometry));assert.deepEqual(errors,[]);assert.deepEqual(failed,[]);
   report.engines.push({engine:name,version:browser.version(),layouts,geometry,errors,failed});console.log(name+': PASS '+JSON.stringify(geometry));
  }finally{await browser.close();}
 }
 await writeFile(path.join(out,'results.json'),JSON.stringify(report,null,2)+'\n');
})().catch(e=>{console.error(e);process.exitCode=1;}).finally(()=>{if(server)server.close();});
