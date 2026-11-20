const {chromium,webkit}=require('playwright');
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),http=require('node:http');
(async()=>{
 const root=path.resolve(__dirname,'../..'),out=path.resolve(__dirname,'../captures');fs.mkdirSync(out,{recursive:true});
 const server=http.createServer((req,res)=>{const p=decodeURIComponent(new URL(req.url,'http://local').pathname),file=path.resolve(root,'.'+p+(p.endsWith('/')?'index.html':''));if(!file.startsWith(root+path.sep)||!fs.existsSync(file)){res.writeHead(404).end();return;}res.setHeader('Content-Type',file.endsWith('.mjs')?'text/javascript':file.endsWith('.css')?'text/css':file.endsWith('.png')?'image/png':file.endsWith('.md')?'text/plain':'text/html');res.end(fs.readFileSync(file));});
 await new Promise(r=>server.listen(0,'127.0.0.1',r));const base=process.env.BASE_URL||`http://127.0.0.1:${server.address().port}/bio-vis-dedup-lot-1/`,baseline=new URL(process.env.BASE_URL?'../bio-vis-p5-i6/':'../preview/bio-vis-p5-i6/',base).href;
 const report={base,scope:'Lot 1 only; no artistic acceptance',engines:[]};
 try{for(const engine of [chromium,webkit]){
  const browser=await engine.launch();try{
   const page=await browser.newPage({viewport:{width:820,height:1180},deviceScaleFactor:1,hasTouch:true,isMobile:true}),errors=[],failed=[];
   page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.status()>=400)failed.push(r.url());});
   await page.goto(base);await page.locator('.reference-row[data-key="58-G"] .after svg').first().waitFor();
   assert.equal(await page.locator('#catalogue option').count(),72);assert.equal(await page.locator('#body option').count(),6);assert.equal(await page.locator('[data-control]').count(),8);assert.equal(await page.locator('[data-dossier]').count(),4);
   for(const id of ['E01','E02','E03','E05']){
    await page.locator('[data-dossier='+id+']').tap();assert.match(await page.locator('#case-number').innerText(),new RegExp(id));
    for(const preset of ['neutral','ipad']){await page.locator('#preset').selectOption(preset);await page.evaluate(()=>Promise.all([...document.querySelectorAll('image')].map(e=>{const image=new Image();image.src=new URL(e.getAttribute('href'),location.href).href;return image.decode();})));await page.locator('#rows').screenshot({path:path.join(out,engine.name()+'-'+id+'-'+preset+'.png')});}
   }
   await page.locator('#reset').tap();
   for(const [k,{min,max}]of Object.entries(await page.evaluate(async url=>(await import(url+'model.mjs')).controls,baseline))){
    const slider=page.locator('[data-control='+k+']');await slider.scrollIntoViewIfNeeded();const box=await slider.boundingBox();await page.touchscreen.tap(box.x+box.width*.82,box.y+box.height/2);assert.notEqual(await slider.inputValue(),'1');await page.locator('#reset').tap();
   }
   await page.locator('#accessories').check();assert(await page.locator('.after [data-layer^=accessories] path').count()>0);await page.locator('#accessories').uncheck();assert.equal(await page.locator('.after [data-layer^=accessories] path').count(),0);
   await page.locator('aside summary').tap();await page.locator('#catalogue').selectOption('p5-068');await page.locator('#arrangement').selectOption('D');await page.locator('#inspect').tap();assert.equal(await page.locator('.reference-row').getAttribute('data-key'),'68-D');
   const identical68D=await page.evaluate(()=>document.querySelector('.before .main-view svg').outerHTML.replace(/\d+-68-D-before/g,'same')===document.querySelector('.after .main-view svg').outerHTML.replace(/\d+-68-D-after/g,'same'));assert(identical68D,'68-D stays unchanged in browser');
   await page.locator('[data-dossier=E02]').tap();
   const layouts=[];for(const [name,width,height]of [['ipad-portrait',820,1180],['ipad-paysage',1180,820],['etroit',390,844]]){
    await page.setViewportSize({width,height});const sizes=await page.evaluate(()=>({scroll:document.documentElement.scrollWidth,width:innerWidth,main:document.querySelector('.after .main-view svg').getBoundingClientRect().height,tile:document.querySelector('.after .tile-view svg').getBoundingClientRect().height,mini:[document.querySelector('.after .mini-view svg').getBoundingClientRect().width,document.querySelector('.after .mini-view svg').getBoundingClientRect().height]}));
    assert(sizes.scroll<=width+1,'page overflow '+name);assert.equal(sizes.main,300);assert.equal(sizes.tile,178);assert.deepEqual(sizes.mini,[70,70]);layouts.push({name,...sizes});
    if(name!=='etroit'){await page.evaluate(()=>scrollTo(0,0));await page.screenshot({path:path.join(out,engine.name()+'-'+name+'.png')});}
   }
   console.log(engine.name(),'touch UI and layouts passed; starting geometry matrix');
   const geometry=await page.evaluate(async({baseline})=>{
    const {model,controls,auditCases}=await import(baseline+'model.mjs'),{character:before}=await import(baseline+'render.mjs'),{character}=await import(new URL('./render.mjs',location.href)),{scalpSamples,priorityCase}=await import(baseline+'i5/i4/i3/i2/i1/base/r1/coverage.mjs');
    const axes=Object.keys(controls),mix=Array.from({length:12},(_,i)=>Object.fromEntries(axes.map((k,j)=>[k,controls[k].min+(controls[k].max-controls[k].min)*(.5+.5*Math.sin((i+1)*.67+j*.91))]))),samples=[...auditCases().map(c=>c.values),priorityCase,...mix];
    const targets=[['p5-058','G'],['p5-024','D'],['p5-068','G'],['p5-058','D']],box=document.createElement('div');box.style.cssText='position:absolute;left:-10000px;top:0;width:500px;';document.body.append(box);
    const issues=[];let parsed=0,eyeSamples=0,scalpChecks=0,frameChecks=0,unchangedFaces=0,unchangedBodies=0;const bounds={};
    const note=o=>{if(issues.length<25)issues.push(o)};
    function shapes(svg){return [...svg.querySelectorAll('[data-layer=volume] path,[data-layer=front] path,[data-layer=sides] path,[data-layer=lengths] path')].filter(e=>e.getAttribute('fill')!=='none').map(e=>({e,b:e.getBBox()}));}
    function covers(paths,p,stroke=false){return paths.some(({e,b})=>p.x>=b.x-2&&p.x<=b.x+b.width+2&&p.y>=b.y-2&&p.y<=b.y+b.height+2&&(e.isPointInFill(p)||stroke&&e.getAttribute('stroke')!=='none'&&e.isPointInStroke(p)));}
    for(const [style,arrangement]of targets)for(const [sample,p]of samples.entries())for(const accessories of [false,true]){
     const input={...p,style,arrangement,accessories,monochrome:!accessories},m=model(input),old=before(input,{instance:'matrix-before'});
     for(const [view,o]of [{},{headOnly:true},{headOnly:true,smallScale:true}].entries()){
      const text=character(input,{...o,instance:'matrix-after'});box.innerHTML=text;const svg=box.querySelector('svg');parsed++;
      if(svg.querySelector('parsererror')||/NaN|Infinity|undefined/.test(text))note({type:'invalid',style,arrangement,sample,view});
      // Use the same HTML/SVG parser on both sides; XML and HTML serialize empty tags differently.
      const oldDoc=document.createElement('div');oldDoc.innerHTML=old;
      const face=svg.querySelector('[data-layer=face]')?.innerHTML,body=svg.querySelector('.body-shape')?.innerHTML;
      if(face!==oldDoc.querySelector('[data-layer=face]')?.innerHTML)note({type:'face-change',style,sample});else unchangedFaces++;
      if(body!==oldDoc.querySelector('.body-shape')?.innerHTML)note({type:'body-change',style,sample});else unchangedBodies++;
      const paths=shapes(svg);
      for(const [ex,ey]of [m.base.anchors.eyeLeft,m.base.anchors.eyeRight])for(let u=-1;u<=1;u+=.25)for(let v=-1;v<=1;v+=.25)if(u*u+v*v<=1){const pt=new DOMPoint(ex+u*m.fit.rx*.26,ey+v*m.fit.ry*.135);eyeSamples++;if(covers(paths,pt,true))note({type:'eye-covered',style,arrangement,sample,view,pt:[pt.x,pt.y]});}
      for(const key of ['nose','mouth','browLeft','browRight']){const a=m.base.anchors[key];if(covers(paths,new DOMPoint(...a),true))note({type:'feature-covered',key,style,arrangement,sample,view});}
      for(const p of scalpSamples(m)){scalpChecks++;if(!covers(paths,new DOMPoint(p.x+p.nx*2.1,p.y+p.ny*2.1)))note({type:'scalp-exposed',style,arrangement,sample,view,point:[p.x,p.y]});}
      if(view===0){const frame=svg.viewBox.baseVal;for(const path of [...svg.querySelectorAll('[data-layer=rear] path'),...paths.map(p=>p.e)]){if(path.getAttribute('fill')==='none')continue;const b=path.getBBox();frameChecks++;if(b.x<frame.x+1||b.y<frame.y+1||b.x+b.width>frame.x+frame.width-1||b.y+b.height>frame.y+frame.height-1)note({type:'whole-clipped',style,arrangement,sample,b:[b.x,b.y,b.width,b.height]});const key=style+':'+arrangement,prev=bounds[key]||[Infinity,Infinity,-Infinity,-Infinity];bounds[key]=[Math.min(prev[0],b.x),Math.min(prev[1],b.y),Math.max(prev[2],b.x+b.width),Math.max(prev[3],b.y+b.height)];}}
     }
    }
    box.remove();return {states:samples.length,parsed,eyeSamples,scalpChecks,frameChecks,unchangedFaces,unchangedBodies,bounds,issues};
   },{baseline});
   assert.deepEqual(geometry.issues,[],JSON.stringify(geometry.issues));assert.deepEqual(errors,[]);assert.deepEqual(failed,[]);report.engines.push({engine:engine.name(),layouts,geometry,errors,failed});console.log(engine.name(),JSON.stringify({parsed:geometry.parsed,eyeSamples:geometry.eyeSamples,scalpChecks:geometry.scalpChecks,issues:geometry.issues.length}));
  }finally{await browser.close();}
 }}finally{await new Promise(r=>server.close(r));}
 fs.writeFileSync(path.join(out,process.env.BASE_URL?'public-verification.json':'verification.json'),JSON.stringify(report,null,2)+'\n');
})().catch(e=>{console.error(e);process.exitCode=1;});
