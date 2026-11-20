// Read-only runtime verification plus isolated documentary checks. Writes only this dossier.
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),{createHash}=require('node:crypto'),{execFileSync}=require('node:child_process'),{pathToFileURL}=require('node:url');
const {chromium,webkit}=require('playwright');
const dir=path.resolve(__dirname,'..'),root=path.resolve(dir,'../../..'),read=p=>JSON.parse(fs.readFileSync(path.join(dir,p))),sha=b=>createHash('sha256').update(b).digest('hex');
const decisions=read('data/decisions.json'),provenance=read('data/provenance.json'),html=fs.readFileSync(path.join(dir,'GALERIE.html'),'utf8');
const cases=decisions.cases;
assert.equal(cases.length,26);assert.equal(new Set(cases.map(c=>c.id)).size,26);
assert.deepEqual(decisions.tally,{REGROUPER:4,'DIFFÉRENCIER':12,CONSERVER:7,'À ARBITRER':3});
assert.equal(decisions.regroupementsCibles.length,6);
assert.equal(cases.filter(c=>c.kind==='exact').length,10);assert.equal(cases.filter(c=>c.kind==='near').length,4);assert.equal(cases.filter(c=>c.kind==='variant').length,12);
for(const c of cases){assert.equal(c.decision,'En attente');assert.equal(c.choices.length,c.keys.length);for(const e of c.choices){assert(e.source,'original source '+e.key);assert(e.source.box.length===4);assert.equal(e.source.arrangement,e.arrangement);}}
function checkRuntime(){for(const f of provenance.runtime)assert.equal(sha(fs.readFileSync(path.join(root,'preview/bio-vis-p5-i6',f.path))),f.sha256,'unchanged runtime '+f.path);}
checkRuntime();
for(const s of provenance.sources)assert.equal(sha(execFileSync('git',['show',s.commit+':'+s.path],{cwd:root,maxBuffer:4*1024*1024})),s.sha256,'original '+s.path);
for(const d of provenance.auditDocuments)assert.equal(sha(execFileSync('git',['show',provenance.auditCommit+':docs/ai/bio-vis-audit-01/'+d.path],{cwd:root,maxBuffer:4*1024*1024})),d.sha256,'audit '+d.path);
assert(!/<script\b|<iframe\b|<form\b/i.test(html),'static gallery, no scripts or forms');
for(const m of html.matchAll(/<img\b[^>]*src="([^"]+)"/g))assert(m[1].startsWith('data:image/png;base64,'),'embedded PNG');
for(const p of fs.readdirSync(dir).filter(p=>p.endsWith('.md'))){const s=fs.readFileSync(path.join(dir,p),'utf8');for(const [,href]of s.matchAll(/\]\(([^)\n]+)\)/g)){if(/^(https?:|#)/.test(href))continue;const target=path.resolve(dir,href.split('#')[0]);assert(target.startsWith(dir+path.sep),'local link stays in dossier');if(target===path.join(dir,'data/verification.json'))continue;assert(fs.existsSync(target),'existing local link '+p+' '+href);}}
const output={cases:26,exactGroups:10,nearGroups:4,variantDossiers:12,tally:decisions.tally,regroupementsCibles:6,pending:26,reviewedChoices:126,completeFamilies:32,runtimeFilesVerified:provenance.runtime.length,originalBoardsVerified:provenance.sources.length,engines:[]};
(async()=>{
 for(const engine of [chromium,webkit]){
  console.log('Checking',engine.name());
  const browser=await engine.launch();try{
   const context=await browser.newContext({viewport:{width:820,height:1180},deviceScaleFactor:1,javaScriptEnabled:false});const page=await context.newPage(),errors=[],requests=[];
   page.on('pageerror',e=>errors.push(e.message));page.on('request',r=>{if(/^https?:/.test(r.url()))requests.push(r.url());});await page.route('**/*',route=>/^https?:/.test(route.request().url())?route.abort():route.continue());
   await page.goto(pathToFileURL(path.join(dir,'GALERIE.html')).href,{waitUntil:'load'});
   console.log(engine.name(),'gallery loaded');
   // Assign directly: addStyleTag waits for an event disabled by JavaScript-off mode.
   await page.evaluate(()=>document.documentElement.style.setProperty('scroll-behavior','auto','important'));
   console.log(engine.name(),'offline DOM ready');
   const metrics=await page.evaluate(()=>{
    const ids=[...document.querySelectorAll('[id]')].map(n=>n.id),all=[...document.querySelectorAll('svg')],selector='[data-layer=rear],[data-layer=back],[data-layer=volume],[data-layer=front],[data-layer=sides],[data-layer=texture],[data-layer=lengths]';
    const serial=n=>new XMLSerializer().serializeToString(n),faces=new Set(),bodies=new Set(),frames=new Set(),palettes=new Set();
    for(const svg of document.querySelectorAll('.controlled svg,.coverage svg')){faces.add(svg.querySelector('[data-layer=face]')?.innerHTML);bodies.add(svg.querySelector('.body-shape')?.innerHTML);frames.add(svg.getAttribute('viewBox'));}
    for(const svg of all)for(const n of svg.querySelectorAll('path,circle,ellipse,rect,polygon,line,polyline'))if(!n.closest('defs')&&n.closest(selector)){if(n.getAttribute('fill')!=='none')palettes.add(n.getAttribute('fill'));if(n.hasAttribute('stroke')&&n.getAttribute('stroke')!=='none')palettes.add(n.getAttribute('stroke'));}
    const geometry=svg=>{
     const attrs=['d','points','cx','cy','r','rx','ry','x','y','width','height','transform','stroke-width','fill-rule','clip-rule'];
     const shapes=[...svg.querySelectorAll('path,circle,ellipse,rect,polygon,line,polyline')].filter(n=>n.closest('defs')||n.closest(selector));
     return JSON.stringify(shapes.map(n=>[n.tagName,attrs.map(a=>n.getAttribute(a)),n.getAttribute('fill')==='none'?'none':'ink']));
    };
    const exact=[...document.querySelectorAll('.decision')].filter(s=>s.id.startsWith('E')).map(s=>({id:s.id,variants:new Set([...s.querySelectorAll('.controlled svg')].map(geometry)).size}));
    const missingClips=[];for(const svg of all)for(const e of svg.querySelectorAll('[clip-path]')){const id=e.getAttribute('clip-path').slice(5,-1);if(!svg.querySelector('[id="'+id+'"]'))missingClips.push(id);}
    const missingAnchors=[...document.querySelectorAll('a[href^="#"]')].map(a=>a.getAttribute('href').slice(1)).filter(id=>!document.getElementById(id));
    return {decisions:document.querySelectorAll('.decision').length,coverageChoices:document.querySelectorAll('.coverage').length,completeFamilies:[...document.querySelectorAll('.family')].filter(n=>/^F\d/.test(n.id)).length,coverageKeys:[...document.querySelectorAll('.coverage')].map(n=>n.dataset.key),images:[...document.images].length,imagesLoaded:[...document.images].every(i=>i.complete&&i.naturalWidth>0),ids:ids.length,uniqueIds:new Set(ids).size,faces:faces.size,bodies:bodies.size,frames:[...frames],palettes:[...palettes].sort(),accessoryLayers:document.querySelectorAll('[data-layer^=accessories],[data-layer=color]').length,invalidSVG:all.some(n=>/NaN|Infinity|undefined/.test(serial(n))),exact,missingClips,missingAnchors};
   });
   assert.equal(metrics.decisions,26);assert.equal(metrics.coverageChoices,126);assert.equal(new Set(metrics.coverageKeys).size,126);assert.equal(metrics.completeFamilies,32);assert(metrics.imagesLoaded);assert.equal(metrics.images,63);assert.equal(metrics.ids,metrics.uniqueIds);assert.equal(metrics.faces,1);assert.equal(metrics.bodies,1);assert.deepEqual(metrics.frames,['-40 -85 240 355']);assert.deepEqual(metrics.palettes,['#4c3822','#9d7b47']);assert.equal(metrics.accessoryLayers,0);assert(!metrics.invalidSVG);assert(metrics.exact.every(g=>g.variants===1),'all ten exact groups remain identical after display normalization');assert.deepEqual(metrics.missingClips,[]);assert.deepEqual(metrics.missingAnchors,[]);
   console.log(engine.name(),'source and display checks passed');
   const layouts=[];
   for(const [label,width,height]of [['ipad-portrait',820,1180],['ipad-paysage',1180,820],['etroit',390,844]]){
    await page.setViewportSize({width,height});await page.locator('#sommaire').scrollIntoViewIfNeeded();
    const layout=await page.evaluate(()=>({pageWidth:document.documentElement.clientWidth,scrollWidth:document.documentElement.scrollWidth,columns:getComputedStyle(document.querySelector('.choices')).gridTemplateColumns.split(' ').length}));
    assert(layout.scrollWidth<=width+1,'no horizontal page overflow '+label);assert.equal(layout.columns,width<650?1:2);
    await page.locator('a[href="#Q02"]').first().click();assert.equal(await page.evaluate(()=>location.hash),'#Q02');
    const summary=page.locator('#Q02 details summary').first();await summary.click();assert.equal(await page.locator('#Q02 details').first().getAttribute('open'),'');
    const sizes=await page.locator('#Q02 .choice').first().evaluate(n=>Object.fromEntries(['tile-view','head-view','mini-view'].map(cls=>{const r=n.querySelector('.'+cls+' svg').getBoundingClientRect();return [cls,{width:r.width,height:r.height}];})));
    assert.equal(sizes['tile-view'].height,178);assert.equal(sizes['head-view'].height,300);assert.deepEqual(sizes['mini-view'],{width:70,height:70});await summary.click();
    if(engine===webkit&&label!=='etroit'){await page.evaluate(()=>scrollTo(0,0));await page.screenshot({path:path.join(dir,'planches/verification-'+label+'.png')});}
    layouts.push({label,width,height,...layout,sizes});
    console.log(engine.name(),label,'passed');
   }
   assert.deepEqual(errors,[]);assert.deepEqual(requests,[]);output.engines.push({engine:engine.name(),offline:true,javaScriptDisabled:true,networkRequests:requests.length,...metrics,layouts});
  }finally{await browser.close();}
 }
 checkRuntime();fs.writeFileSync(path.join(dir,'data/verification.json'),JSON.stringify(output,null,2)+'\n');console.log(JSON.stringify({cases:26,allPending:true,runtimeUnchanged:true,exactDisplayGroups:10,reviewedChoices:126,offlineEngines:output.engines.map(x=>x.engine),viewportsPerEngine:3}));
})().catch(e=>{console.error(e);process.exitCode=1;});
