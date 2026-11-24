const assert = require('node:assert/strict');
const {createServer} = require('node:http');
const {execFileSync} = require('node:child_process');
const {readFile, mkdir, writeFile} = require('node:fs/promises');
const path = require('node:path');
const {chromium, webkit} = require('playwright');

const root = path.resolve(__dirname, '../..');
const output = process.env.ARTIFACT_DIR ?? '/tmp/microcosme-bio-pilosite-01';
const baselineCommit = '58d0b37a448ed5248b753a7c8e62fb1b4f77db4d';
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
    const modelUrl=new URL(base.includes('/preview/')?'../bio-vis-p5-i6/model.mjs':'../preview/bio-vis-p5-i6/model.mjs',base);
    const [{character},{character:before},{eyePresets},{presets},
      {beardFor,beardMarkup,beardPresets,beardZones}]=await Promise.all([
      import(new URL('render.mjs',base)),import(baseline),import(new URL('eyes.mjs',base)),import(modelUrl),
      import(new URL('beard.mjs',base))
    ]);
    const canvas=document.createElement('canvas');
    const ctx=canvas.getContext('2d',{willReadFrequently:true});
    async function raster(text,width,height,bg=null) {
      canvas.width=width;
      canvas.height=height;
      const image=new Image();
      image.src='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(text.replace('<svg ',`<svg width="${width}" height="${height}" `));
      await image.decode();
      if(bg){ctx.fillStyle=bg;ctx.fillRect(0,0,width,height);}
      ctx.drawImage(image,0,0);
      return ctx.getImageData(0,0,width,height).data;
    }
    const frameOf=(svg,frame)=>svg.replace(/viewBox="[^"]*"/,`viewBox="${frame}"`);
    const scales=[
      ['-30 -65 220 225',300,{headOnly:true}],['-40 -85 240 355',178,{}],
      ['-35 -68 230 245',70,{headOnly:true,smallScale:true}],['36 42 88 100',440,{headOnly:true}]
    ];
    const openings=[null,...Object.keys(eyePresets)];
    const backgrounds=['#fffdf8','#474c55'];
    const iris={irisSize:144,pupilSize:72,primary:'gris',secondary:'vert',heterochromia:'complete'};
    const details={lashes:{count:3,length:15,spacing:100},contours:{upper:250,lower:200},
      upper:{count:2,intensity:100},lower:{count:2,intensity:100},shadows:{intensity:90,volume:80}};
    const brows={monobrow:true,slit:true,arc:82,colourMode:'independent',colour:'violet-amethyste'};
    const mouth={width:135,upper:180,lower:180,corners:65,cupid:100,intensity:100,thickness:100};
    const wideNose={length:150,bridge:180,wings:160,tip:180,roundness:100,nostrils:180,fills:100,lines:100};
    const full=beardPresets.full.values;
    let historic=0;
    for(const eyes of openings) for(const [frame,size,opts] of scales.slice(0,3)) for(const bg of backgrounds) {
      const input={...presets.tall.values,style:'p5-061',arrangement:'G',body:'bust'};
      const params={...opts,eyes,iris,details,brows,mouth,nose:wideNose,hairColor:'bleu-vif',instance:'beard-history'};
      const a=before(input,params), b=character(input,{...params,beardCategory:'F',beard:full});
      const first=await raster(frameOf(a,frame),size,size,bg),second=await raster(frameOf(b,frame),size,size,bg);
      if(a!==b||first.some((value,i)=>value!==second[i])) throw Error('Régression historique en '+size+' px');
      historic++;
    }

    const docs=new DOMParser();
    const tree=svg=>docs.parseFromString(svg,'image/svg+xml');
    const sheet=document.createElement('section');
    sheet.id='beard-proof';
    sheet.style.cssText='padding:18px;background:#f6f2e8;display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px';
    const signatures=scales.map(()=>new Set());
    for(const {label,values} of Object.values(beardPresets)){
      const face={style:'p5-038'};
      for(const [i,[frame,size,opts]] of scales.entries()){
        await raster(frameOf(character(face,{...opts,beard:values}),frame),size,size,backgrounds[0]);
        signatures[i].add(canvas.toDataURL());
      }
      const figure=document.createElement('figure');
      figure.style.cssText='margin:0;overflow:hidden;background:#fffdf7;border:1px solid #d7cdb7;border-radius:10px';
      figure.innerHTML=frameOf(character(face,{headOnly:true,beard:values}),'36 34 88 109');
      figure.querySelector('svg').style.cssText='width:100%;height:154px;display:block;background:#fffdf8';
      const caption=document.createElement('figcaption');
      caption.textContent=label;
      caption.style.cssText='padding:7px 10px;font-size:16px';
      figure.prepend(caption);
      sheet.append(figure);
    }
    document.querySelector('main').append(sheet);

    const width=360,height=360,s=4,x0=35,y0=45;
    const wrap=markup=>`<svg xmlns="http://www.w3.org/2000/svg" viewBox="${x0} ${y0} ${width/s} ${height/s}">${markup}</svg>`;
    const portraits=[{},presets.tall.values,presets.broad.values,
      {skull_width:1.18,skull_height:.82,forehead_width:.86,forehead_height:.84,temple_width:.9,cheek_width:.88,jowls:1.35,jaw_width:.82}];
    let cases=0,noseCollisions=0,mouthCollisions=0,eyeCollisions=0,protrusions=0;
    const beard={...full,length:95,volume:95,sideburnWidth:100,chinShape:96,moustacheThickness:100,moustacheCurl:-100};
    const rect=({left,right,top,bottom})=>`<rect x="${left}" y="${top}" width="${right-left}" height="${bottom-top}"/>`;
    for(const input of portraits) for(const eyes of openings) for(const nose of [null,wideNose,{length:55,tip:30}]) {
      const options={eyes,nose,details,mouth:cases%2?mouth:null,headOnly:true};
      const result=beardFor(input,eyes,beard,options);
      const g=tree(character(input,{...options,beard})).querySelector('[data-bio-facial-hair]');
      const opened=await raster(wrap(g.outerHTML),width,height);
      const nasal=await raster(wrap(rect(result.frame.nose)),width,height);
      const lips=await raster(wrap(rect(result.frame.mouth)),width,height);
      const ocular=await raster(wrap(result.frame.eyes.map(rect).join('')),width,height);
      let outside=false;
      for(let p=3;p<opened.length;p+=4) {
        if(opened[p]<32) continue;
        noseCollisions+=Number(nasal[p]>=32);
        mouthCollisions+=Number(lips[p]>=32);
        eyeCollisions+=Number(ocular[p]>=32);
        outside||=y0+((p-3)/4/width)*1/s>result.frame.chin+1;
      }
      protrusions+=Number(outside);
      cases++;
    }

    const joined={...beardPresets.full.values,density:49};
    const both=beardFor({},null,joined);
    const fill=both.paint.fill.match(/[0-9a-f]{2}/g).map(channel=>parseInt(channel,16));
    const union=await raster(wrap(beardMarkup(both)),width,height);
    const zoneAlpha=[];
    for(const zone of Object.keys(beardZones)) {
      const tint=both.polygons[zone].map(points=>'<polygon points="'+points.map(p=>p.join(',')).join(' ')+'"/>').join('');
      zoneAlpha.push(await raster(wrap(tint),width,height));
    }
    let intersections=0,internalStroke=0;
    for(let p=3;p<union.length;p+=4) {
      if(zoneAlpha.filter(patch=>patch[p]===255).length<2) continue;
      intersections++;
      if(union[p]!==255||fill.some((channel,i)=>channel!==union[p-3+i])) internalStroke++;
    }
    const subtle=[];
    for(const [frame,size,opts] of scales) {
      const view=roundness=>frameOf(character({style:'p5-038'},{...opts,beard:{...full,chinShape:roundness}}),frame);
      const a=await raster(view(40),size,size,backgrounds[0]);
      const b=await raster(view(41),size,size,backgrounds[0]);
      subtle.push(a.reduce((n,x,i)=>n+(i%4===3&&[1,2,3].some(d=>a[i-d]!==b[i-d])),0));
    }
    return {historic,cases,protrusions,noseCollisions,mouthCollisions,eyeCollisions,
      silhouettes:signatures.map(set=>set.size),intersections,internalStroke,subtle};
  },{base,baseline});
}

async function verifyWorkshop(page,name) {
  const q=selector=>page.locator(selector);
  await q('#eye-preset').selectOption('narrow');
  if(await q('#eye-confirm').isVisible()) await q('#eye-confirm').tap();
  await q('#brows-active').tap();
  await q('#mouth-active').tap();
  await q('#nose-active').tap();
  await q('#appearance-panel summary').tap();
  const save=async ()=>{
    await q('#appearance-export').tap();
    return JSON.parse(await q('#appearance-json').inputValue());
  };
  const load=async doc=>{
    await q('#appearance-json').fill(JSON.stringify(doc));
    await q('#appearance-import').tap();
    assert.equal(await q('#appearance-error').textContent(),'');
  };
  const old=await save();
  const clean=await snapshots(page);
  assert.equal(old.version,6);
  await q('#beard-active').tap();
  assert.equal(await q('#beard-preset option').count(),13);
  assert.equal(await q('#beard-colour option').count(),26);
  assert.equal(await q('#beard-zones input').count(),6);
  assert.equal(await q('#beard-axes input').count(),9);
  assert.deepEqual(await snapshots(page,'[data-side=before]'),clean);
  await q('#beard-preset').selectOption('full');
  await q('#beard-colour-mode').selectOption('independent');
  await q('#beard-colour').selectOption('turquoise-profond');
  await q('#beard-length').tap({position:{x:30,y:17}});
  const touch=await q('#beard-length').getAttribute('aria-valuetext');
  assert.notEqual(touch,'35 %');
  await q('#beard-length').press('End');
  const initial=await save();
  assert.equal(initial.version,7);
  assert.equal(initial.facialHair.requested.length,100);
  await q('#beard-colour-mode').selectOption('darker');
  assert(await q('#beard-colour').isDisabled());
  await q('#beard-colour-mode').selectOption('independent');
  assert.deepEqual(await save(),initial);
  const painted=await snapshots(page);
  await q('#beard-category').selectOption('F');
  assert(await q('#beard-preset').isDisabled());
  assert(await q('#beard-active').isDisabled());
  assert(await q('#beard-random').isDisabled());
  assert.deepEqual(await snapshots(page),clean);
  const blocked=await save();
  assert.deepEqual(blocked.facialHair.requested,initial.facialHair.requested);
  await q('#beard-category').selectOption('T');
  assert.deepEqual(await snapshots(page),painted);
  const restored=await save();
  await page.reload();
  await q('#appearance-panel summary').tap();
  await load(blocked);
  assert.deepEqual(await snapshots(page),clean);
  await q('#beard-category').selectOption('T');
  assert.deepEqual(await snapshots(page),painted);
  assert.deepEqual(await save(),restored);
  await q('#beard-density').press('Home');
  assert(await q('#beard-length').isDisabled());
  assert.deepEqual(await snapshots(page),clean);
  await q('#beard-density').press('End');
  assert.deepEqual(await snapshots(page),painted);
  await q('#beard-seed').fill('Pilosité ✦ recettée');
  await q('#beard-random').tap();
  const drawn=await save();
  await q('#beard-random').tap();
  assert.deepEqual(await save(),drawn);
  assert.equal(drawn.facialHair.draw.seed,'Pilosité ✦ recettée');
  for(const key of ['character','eyes','brows','mouth','nose','palette','historicalSelection']) assert.deepEqual(drawn[key],old[key]);
  await q('#mouth-preset').selectOption('full');
  await q('#nose-length').press('Home');
  await q('#nose-tip').press('Home');
  await q('#beard-preset').selectOption('full');
  await q('#beard-moustacheThickness').press('End');
  const loose=(await save()).facialHair;
  assert.equal(loose.effective.moustacheThickness,100);
  for(let attempt=0;attempt<2;attempt++){
    await q('#nose-tip').press('End');
    await q('#nose-length').press('End');
    const tight=(await save()).facialHair;
    assert.deepEqual(tight.requested,loose.requested);
    assert.equal(tight.effective.zones.moustache,false);
    assert(await q('#beard-moustacheThickness').isDisabled());
    assert.match(await q('#beard-status').textContent(),/Espace insuffisant/);
    await q('#nose-length').press('Home');
    await q('#nose-tip').press('Home');
    assert.deepEqual((await save()).facialHair,loose);
  }
  await load(old);
  assert.deepEqual(await snapshots(page),clean);
  await load(restored);
  const layouts=[];
  for(const [width,height] of [[820,1180],[1180,820],[390,844]]) {
    await page.setViewportSize({width,height});
    for(const background of ['light','dark']) {
      await q('#background').selectOption(background);
      const sizes=await q('[data-side=after] svg').evaluateAll(list=>list.map(svg=>{
        const b=svg.getBoundingClientRect();
        return [b.width,b.height];
      }));
      assert.deepEqual(sizes.map(s=>s[1]),[300,178,70]);
      assert.equal(sizes[2][0],70);
      assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth),width);
      assert.equal(await q('[data-side=after] [data-bio-facial-hair]').count(),3);
      layouts.push({width,height,background,sizes});
    }
  }
  await page.setViewportSize({width:820,height:1180});
  await q('#beard').screenshot({path:path.join(output,name+'-atelier.png')});
  await q('#comparison').screenshot({path:path.join(output,name+'-trois-echelles.png')});
  return {touch,layouts,cold:true,restoredMoustache:loose.effective.moustacheThickness};
}

(async ()=>{
  await mkdir(output,{recursive:true});
  const server=process.env.BASE_URL?null:await localSite();
  const base=process.env.BASE_URL??`http://127.0.0.1:${server.address().port}/bio-yeux-01/`;
  const baseline=new URL(server?'baseline-render.mjs':'../bio-nez-01/render.mjs',base).href;
  const result={base,engines:[]};
  try {
    for(const name of (process.env.AUDIT_ENGINES??'chromium,webkit').split(',')){
      const browser=await engines[name].launch();
      try {
        const page=await browser.newPage({viewport:{width:820,height:1180},hasTouch:true,isMobile:true,
          deviceScaleFactor:1,ignoreHTTPSErrors:process.env.PAGES_TEST_PROXY==='1'});
        const errors=[];
        page.on('pageerror',error=>errors.push(error.message));
        page.on('response',response=>{if(response.status()>=400) errors.push(response.status()+' '+response.url());});
        assert.equal((await page.goto(base)).status(),200);
        await page.locator('#comparison svg').first().waitFor();
        const raster=await verifyRaster(page,base,baseline);
        console.log('Raster '+name,JSON.stringify(raster));
        assert.equal(raster.historic,54);
        assert.deepEqual(raster.silhouettes.slice(0,2),[12,12]);
        assert(raster.silhouettes[2]>=10);
        assert.equal(raster.silhouettes[3],12);
        assert.equal(raster.protrusions,raster.cases);
        assert.equal(raster.noseCollisions+raster.mouthCollisions+raster.eyeCollisions,0);
        assert(raster.intersections>100);
        assert.equal(raster.internalStroke,0);
        assert(raster.subtle.at(-1)>0);
        await page.locator('#beard-proof').screenshot({path:path.join(output,name+'-silhouettes.png')});
        await page.locator('#beard-proof').evaluate(node=>node.remove());
        const workshop=await verifyWorkshop(page,name);
        assert.deepEqual(errors,[]);
        const proof={name,version:browser.version(),raster,workshop,errors};
        result.engines.push(proof);
        console.log(JSON.stringify(proof));
      } finally {
        await browser.close();
      }
    }
    await writeFile(path.join(output,'rapport.json'),JSON.stringify(result,null,2)+'\n');
  } finally {
    server?.close();
  }
})().catch(error=>{
  console.error(error);
  process.exitCode=1;
});
