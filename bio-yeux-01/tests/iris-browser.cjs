const assert = require('node:assert/strict');
const {createServer} = require('node:http');
const {execFileSync} = require('node:child_process');
const {readFile, mkdir, writeFile} = require('node:fs/promises');
const path = require('node:path');
const {chromium, webkit} = require('playwright');

const root = path.resolve(__dirname, '../..');
const output = process.env.ARTIFACT_DIR ?? '/tmp/microcosme-bio-yeux-02';
const baselineCommit = '2da4ea2729abf233973781c7b57d30e609e0fae9';
const engines = {chromium, webkit};
const types = {'.html':'text/html', '.mjs':'text/javascript', '.css':'text/css', '.json':'application/json'};

async function localSite() {
  const frozen = execFileSync('git', ['-c', 'safe.directory='+root, 'show',
    baselineCommit+':bio-yeux-01/render.mjs'],{cwd:root});
  const server = createServer(async (request,response) => {
    try {
      const url = new URL(request.url,'http://localhost');
      if (url.pathname==='/bio-yeux-01/baseline-render.mjs') {
        response.writeHead(200,{'Content-Type':'text/javascript'}).end(frozen);
        return;
      }
      const file = path.resolve(root,'.'+decodeURIComponent(url.pathname)+(url.pathname.endsWith('/')?'index.html':''));
      if (!file.startsWith(root+path.sep)) throw new Error('Ressource hors du dépôt.');
      response.writeHead(200,{'Content-Type':types[path.extname(file)]??'application/octet-stream'}).end(await readFile(file));
    } catch {
      if (!response.headersSent) response.writeHead(404);
      response.end();
    }
  });
  await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
  return server;
}

async function snapshots(page, selector='[data-side=after]') {
  return page.locator(selector+' svg').evaluateAll(async list=>{
    const bg=document.querySelector('#background').value==='dark'?'#474c55':'#fffdf8';
    return Promise.all(list.map(async (svg,i)=>{
      const size=[300,178,70][i];
      const text=new XMLSerializer().serializeToString(svg).replace(/atelier-yeux-\d+/g,'recette');
      const image=new Image();
      image.src='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(text.replace('<svg ',`<svg width="${size}" height="${size}" `));
      await image.decode();
      const canvas=document.createElement('canvas');
      canvas.width=canvas.height=size;
      const ctx=canvas.getContext('2d');
      ctx.fillStyle=bg;
      ctx.fillRect(0,0,size,size);
      ctx.drawImage(image,0,0);
      return {text,pixels:canvas.toDataURL()};
    }));
  });
}

async function verifyRaster(page,base,baseline) {
  return page.evaluate(async ({base,baseline})=>{
    const [{character},{character:before},{eyePresets,eyesFor},{pigmentCenters,irisPalette,pupilShapes},{presets}]=await Promise.all([
      import(new URL('render.mjs',base)),import(baseline),import(new URL('eyes.mjs',base)),
      import(new URL('iris.mjs',base)),
      import(new URL(base.includes('/preview/')?'../bio-vis-p5-i6/model.mjs':'../preview/bio-vis-p5-i6/model.mjs',base))
    ]);
    const dom = new DOMParser();
    const canvas=document.createElement('canvas');
    const ctx=canvas.getContext('2d',{willReadFrequently:true});
    async function raster(text, width, height, bg=null) {
      canvas.width=width;
      canvas.height=height;
      const image=new Image();
      image.src='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(text.replace('<svg ',`<svg width="${width}" height="${height}" `));
      await image.decode();
      if (bg) {ctx.fillStyle=bg;ctx.fillRect(0,0,width,height);}
      ctx.drawImage(image,0,0);
      return ctx.getImageData(0,0,width,height).data;
    }
    const square=(text,frame)=>text.replace(/viewBox="[^"]*"/,`viewBox="${frame}"`);
    const differences=(left,right)=>left.reduce((count,value,index)=>count+(value!==right[index]),0);
    const frame=[['-30 -65 220 225',300,{headOnly:true}],['-40 -85 240 355',178,{}],
      ['-35 -68 230 245',70,{headOnly:true,smallScale:true}]];
    const bgs=['#fffdf8','#474c55'];
    const portrait={...presets.tall.values,style:'p5-061',arrangement:'G',body:'bust'};
    const cases=[null,...Object.keys(eyePresets)];
    let historic=0, historicMismatches=0;
    for (const eyes of cases) for (const [crop,size,options] of frame) for (const bg of bgs) {
      const state={...options,eyes,hairColor:'bleu-vif',instance:'history'};
      const a=before(portrait,state), b=character(portrait,{...state,iris:'historical'});
      if (a!==b || differences(await raster(square(a,crop),size,size,bg),await raster(square(b,crop),size,size,bg))) historicMismatches++;
      historic++;
    }
    let clips=0,leaks=0;
    const wrap=(x,y,extra)=>`<svg xmlns="http://www.w3.org/2000/svg" viewBox="${x-5} ${y-5} 10 10">${extra}</svg>`;
    const clipInputs=[{},presets.tall.values,presets.broad.values,
      {skull_width:.86,skull_height:1.18,forehead_width:1.14,forehead_height:.84,temple_width:.9,cheek_width:.88,jowls:1.35,jaw_width:.82}];
    const variants=[{irisSize:140,irisRatio:.75,pupilSize:80,outline:10,pupilShape:'ring',heterochromia:'central',secondarySize:80},
      {irisSize:140,irisRatio:1.25,pupilSize:80,outline:0,pupilShape:'star',heterochromia:'complete',primary:'blanc',secondary:'orange'}];
    for (const input of clipInputs) for (const eyes of cases) for (const iris of variants) {
      const doc=dom.parseFromString(character(input,{eyeEnvelopes:false,eyes,iris}),'image/svg+xml');
      const centers=pigmentCenters(eyesFor(input,eyes));
      for (const [i,ink] of [...doc.querySelectorAll('[data-bio-iris]')].entries()) {
        const {x,y}=centers[i], parent=ink.parentElement;
        const clipName=parent.getAttribute('clip-path');
        const id=clipName.slice(5,-1);
        const def='<defs>'+doc.getElementById(id).outerHTML+'</defs>';
        const wc=wrap(x,y,def+`<g clip-path="${clipName}"><rect x="${x-5}" y="${y-5}" width="10" height="10" fill="white"/></g>`);
        const wt=wrap(x,y,def+parent.outerHTML);
        const expected=await raster(wc,100,100);
        const actual=await raster(wt,100,100);
        for (let p=3;p<expected.length;p+=4) {
          if (expected[p]===0&&actual[p]>0) leaks++;
        }
        clips++;
      }
    }
    const center=pigmentCenters(eyesFor({},null))[0];
    const zoom=`${center.x-4} ${center.y-4} 8 8`;
    const zoomSignatures=async (ids,key)=>{
      const signatures=[];
      for (const id of ids) {
        const text=character({},{iris:{irisSize:140,pupilSize:60,[key]:id}});
        await raster(square(text,zoom),160,160,'#fffdf8');
        signatures.push(canvas.toDataURL());
      }
      return new Set(signatures).size;
    };
    const subtle=[];
    for (const [crop,size,options] of [...frame,[zoom,160,{headOnly:true}]]) {
      const states=[24,25].map(secondarySize=>character({},{
        ...options,iris:{primary:'bleu',secondary:'ambre',heterochromia:'central',pupilShape:'ring',secondarySize}
      }));
      subtle.push(differences(await raster(square(states[0],crop),size,size,bgs[0]),
        await raster(square(states[1],crop),size,size,bgs[0])));
    }
    return {historic,historicMismatches,clips,leaks,
      forms:await zoomSignatures(Object.keys(pupilShapes),'pupilShape'),
      colours:await zoomSignatures(irisPalette.map(c=>c.id),'primary'),subtle};
  },{base,baseline});
}

async function verifyWorkshop(page, name) {
  const q=selector=>page.locator(selector);
  const exportAppearance=async ()=>{
    await q('#appearance-export').tap();
    return JSON.parse(await q('#appearance-json').inputValue());
  };
  await q('#eye-preset').selectOption('round');
  if (await q('#eye-confirm').isVisible()) await q('#eye-confirm').tap();
  assert.equal(await q('#comparison').getAttribute('data-eyes'),'round');
  await q('[data-category=fantasy]').tap();
  await q('[data-colour=bleu-vif]').tap();
  await q('#appearance-panel summary').tap();
  const initial=await snapshots(page);
  const v1=await exportAppearance();
  assert.equal(v1.version,1);
  await q('#iris-active').tap();
  assert.equal(await q('#iris-secondary').isDisabled(),true);
  for (const key of ['primary','secondary']) {
    for (const family of ['Naturelles','Fantaisie']) {
      assert.equal(await q(`#iris-${key} optgroup[label="${family}"] option`).count(),8);
    }
  }
  assert.deepEqual(await snapshots(page,'[data-side=before]'),initial);
  await q('#iris-before-mode').selectOption('historical');
  const historical=await snapshots(page,'[data-side=before]');
  assert(historical.some((entry,i)=>entry.text!==initial[i].text),'La référence bascule vers l’ouverture historique.');
  await q('#iris-before-mode').selectOption('same');
  await q('#iris-shape').selectOption('ring');
  await q('#iris-hetero').selectOption('central');
  const secondary=q('#iris-secondarySize');
  const domain=await q('#iris-domain-secondarySize').textContent();
  assert.match(domain,/ ou /);
  const upper=+(domain.match(/ ou (\d+)/)?.[1]);
  assert(upper>25);
  await secondary.press('Home');
  assert.equal(await secondary.getAttribute('aria-valuetext'),'0 %');
  for (let i=0;i<25;i++) await secondary.press('ArrowRight');
  assert.equal(await secondary.getAttribute('aria-valuetext'),'25 %');
  await secondary.press('ArrowRight');
  assert.equal(await secondary.getAttribute('aria-valuetext'),upper+' %');
  await q('#iris-secondary').selectOption('noisette');
  assert.equal(await secondary.isDisabled(),true);
  assert.match(await q('#iris-status').textContent(),/identiques/);
  await q('#iris-secondary').selectOption('bleu');
  assert.equal(await secondary.getAttribute('aria-valuetext'),upper+' %');
  await q('#iris-hetero').selectOption('complete');
  assert.equal(await secondary.isDisabled(),true);
  assert.equal(await q('#iris-zoom [data-bio-iris=right]').getAttribute('data-iris-colour'),'bleu');
  await q('#iris-hetero').selectOption('central');
  await q('#iris-irisSize').tap({position:{x:22,y:14}});
  const irisAfterTouch=await q('#iris-irisSize').getAttribute('aria-valuetext');
  assert.notEqual(irisAfterTouch,'100 %');
  await q('#iris-irisSize').press('End');
  await q('#iris-zoom').screenshot({path:path.join(output,name+'-anneau.png')});
  const v2=await exportAppearance();
  assert.equal(v2.version,2);
  for (const key of ['character','eyes','palette','historicalSelection']) assert.deepEqual(v2[key],v1[key]);
  const custom=await snapshots(page);
  assert(custom.every((entry,i)=>entry.pixels!==initial[i].pixels));
  await page.reload();
  await q('#appearance-panel summary').tap();
  await q('#appearance-json').fill(JSON.stringify(v2));
  await q('#appearance-import').tap();
  assert.deepEqual(await snapshots(page),custom);
  assert.deepEqual(await exportAppearance(),v2);
  await q('#iris-active').tap();
  assert.deepEqual(await snapshots(page),initial);
  const latent=await exportAppearance();
  assert.equal(latent.iris.mode,'historical');
  assert.deepEqual(latent.iris.latent,v2.iris.requested);
  await q('#iris-active').tap();
  assert.deepEqual(await snapshots(page),custom);
  await q('#iris-seed').fill('aperçu ✦ 2026');
  await q('#iris-random').tap();
  const seed=await exportAppearance();
  assert.equal(seed.iris.draw.seed,'aperçu ✦ 2026');
  for (const key of ['character','eyes','palette','historicalSelection']) assert.deepEqual(seed[key],v1[key]);
  const drawn=await snapshots(page);
  await q('#iris-random').tap();
  assert.deepEqual(await snapshots(page),drawn);
  await q('#iris-reset').tap();
  assert.deepEqual(await snapshots(page),initial);
  assert.deepEqual(await exportAppearance(),v1);
  await q('#appearance-json').fill(JSON.stringify(v2));
  await q('#appearance-import').tap();
  const layouts=[];
  for (const [width,height] of [[820,1180],[1180,820],[390,844]]) {
    await page.setViewportSize({width,height});
    for (const background of ['light','dark']) {
      await q('#background').selectOption(background);
      const sizes=await q('[data-side=after] svg').evaluateAll(list=>list.map(s=>{
        const box=s.getBoundingClientRect();
        return [box.width,box.height];
      }));
      const scrollWidth=await page.evaluate(()=>document.documentElement.scrollWidth);
      assert.deepEqual(sizes.map(s=>s[1]),[300,178,70]);
      assert.equal(sizes[2][0],70);
      assert.equal(scrollWidth,width);
      layouts.push({width,height,background,sizes});
    }
  }
  await page.setViewportSize({width:820,height:1180});
  await q('#iris').screenshot({path:path.join(output,name+'-atelier.png')});
  await q('#comparison').screenshot({path:path.join(output,name+'-trois-echelles.png')});
  return {cold:3,domain,irisAfterTouch,layouts};
}

(async ()=>{
  await mkdir(output,{recursive:true});
  const server=process.env.BASE_URL?null:await localSite();
  const base=process.env.BASE_URL??`http://127.0.0.1:${server.address().port}/bio-yeux-01/`;
  const baseline=new URL(server?'baseline-render.mjs':'../bio-inv-01-corrections/render.mjs',base).href;
  const result={base,engines:[]};
  try {
    for (const name of (process.env.AUDIT_ENGINES??'chromium,webkit').split(',')) {
      const browser=await engines[name].launch();
      try {
        const page=await browser.newPage({viewport:{width:820,height:1180},hasTouch:true,isMobile:true,
          deviceScaleFactor:1,ignoreHTTPSErrors:process.env.PAGES_TEST_PROXY==='1'});
        const errors=[];
        page.on('pageerror',error=>errors.push(error.message));
        page.on('response',response=>{
          if (response.status()>=400) errors.push(response.status()+' '+response.url());
        });
        assert.equal((await page.goto(base)).status(),200);
        await page.locator('#comparison svg').first().waitFor();
        const raster=await verifyRaster(page,base,baseline);
        assert.deepEqual([raster.historic,raster.historicMismatches,raster.clips,raster.leaks,raster.forms,raster.colours],
          [54,0,144,0,6,16],JSON.stringify(raster));
        assert(raster.subtle.at(-1)>0,JSON.stringify(raster));
        const workshop=await verifyWorkshop(page,name);
        assert.deepEqual(errors,[]);
        const entry={name,version:browser.version(),raster,workshop};
        result.engines.push(entry);
        console.log(JSON.stringify(entry));
      } finally {
        await browser.close();
      }
    }
    await writeFile(path.join(output,'results.json'),JSON.stringify(result,null,2)+'\n');
  } finally {
    server?.close();
  }
})().catch(error=>{console.error(error);process.exitCode=1;});
