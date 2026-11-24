const assert = require('node:assert/strict');
const {createServer} = require('node:http');
const {execFileSync} = require('node:child_process');
const {readFile, mkdir, writeFile} = require('node:fs/promises');
const path = require('node:path');
const {chromium, webkit} = require('playwright');

const root = path.resolve(__dirname, '../..');
const output = process.env.ARTIFACT_DIR ?? '/tmp/microcosme-bio-bouche-01';
const baselineCommit = '14a93eefefa313b8daf5c08e5f64a869a26a4127';
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
    const [{character},{character:before},{eyePresets,eyesFor},{model,presets},
      {mouthPresets,mouthFor,mouthMarkup,inheritedNoseBounds},{pigmentCenters,pupilShapes}]=await Promise.all([
      import(new URL('render.mjs',base)),import(baseline),import(new URL('eyes.mjs',base)),import(modelUrl),
      import(new URL('mouth.mjs',base)),import(new URL('iris.mjs',base))
    ]);
    const canvas=document.createElement('canvas');
    const ctx=canvas.getContext('2d',{willReadFrequently:true});
    async function raster(text,width,height,bg=null) {
      canvas.width=width;
      canvas.height=height;
      const image=new Image();
      image.src='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(text.replace('<svg ',`<svg width="${width}" height="${height}" `));
      await image.decode();
      if (bg) {ctx.fillStyle=bg;ctx.fillRect(0,0,width,height);}
      ctx.drawImage(image,0,0);
      return ctx.getImageData(0,0,width,height).data;
    }
    const frameOv=(text,frame)=>text.replace(/viewBox="[^"]*"/,`viewBox="${frame}"`);
    const sizes=[['-30 -65 220 225',300,{headOnly:true}],['-40 -85 240 355',178,{}],
      ['-35 -68 230 245',70,{headOnly:true,smallScale:true}]];
    const openings=[null,...Object.keys(eyePresets)];
    const bgs=['#fffdf8','#474c55'];
    const iris={irisSize:140,irisRatio:1.25,pupilSize:73,pupilShape:'ring',primary:'vert',
      secondary:'orange',heterochromia:'central',secondarySize:74};
    const details={lashes:{count:3,length:15,spacing:100},contours:{upper:250,lower:200},
      upper:{count:2,intensity:100},lower:{count:2,intensity:100}};
    const brows={monobrow:true,slit:true,arc:82,colourMode:'independent',colour:'violet-amethyste'};
    let historic=0,historicMismatches=0;
    for(const eyes of openings) for(const [frame,size,opts] of sizes) for(const bg of bgs) {
      const input={...presets.tall.values,style:'p5-061',arrangement:'G',body:'bust'};
      const options={...opts,eyes,iris,details,brows,hairColor:'bleu-vif',instance:'mouth-history'};
      const a=before(input,options), b=character(input,{...options,mouth:'historical'});
      const first=await raster(frameOv(a,frame),size,size,bg), second=await raster(frameOv(b,frame),size,size,bg);
      if(a!==b||first.some((value,i)=>value!==second[i])) historicMismatches++;
      historic++;
    }

    const portraits=[{},presets.tall.values,presets.broad.values,
      {skull_width:1.18,skull_height:.82,forehead_width:.86,forehead_height:.84,
       temple_width:.9,cheek_width:.88,jowls:1.35,jaw_width:.82}];
    const variants=[{}, {width:130,upper:200,lower:200,cupid:100,peaks:55,corners:-100,curvature:100,intensity:100,thickness:200},
      {width:130,intensity:0,corners:-100,curvature:-100,thickness:200},
      {width:60,upper:200,lower:200,cupid:100,peaks:15,corners:100,curvature:-100,intensity:2,thickness:50}];
    const doc=new DOMParser();
    const load=text=>doc.parseFromString(text,'image/svg+xml');
    const width=232,height=190,worldW=46.4,worldH=38;
    let cases=0,faceOutside=0,faceStroke=0,underNose=0,pupilOverflow=0;
    for (const input of portraits) for (const eyes of openings) for(const mouth of variants) {
      const face=model(input), opening=eyesFor(input,eyes);
      const [{x:left},{x:right}]=pigmentCenters(opening);
      const nose=inheritedNoseBounds(face);
      const [mx,my]=face.base.anchors.mouth;
      const x0=mx-worldW/2,y0=my-worldH/2;
      const wrap=markup=>`<svg xmlns="http://www.w3.org/2000/svg" viewBox="${x0} ${y0} ${worldW} ${worldH}">${markup}</svg>`;
      const pupilShape=Object.keys(pupilShapes)[cases%6];
      const tree=load(character(input,{eyes,mouth,iris:{...iris,pupilShape},details,brows,instance:'mouth-safety'}));
      const detail=tree.querySelector('[data-bio-mouth]');
      const facePath=tree.querySelector('[data-layer=face] .head-shape > path').getAttribute('d');
      const patch=await raster(wrap(detail.outerHTML),width,height);
      const contained=await raster(wrap(`<path d="${facePath}"/>`),width,height);
      const outline=await raster(wrap(`<path d="${facePath}" fill="none" stroke="black" stroke-width="4.2"/>`),width,height);
      for (let n=0;n<patch.length/4;n++) {
        const p=4*n+3;
        if(!patch[p]) continue;
        const x=x0+(n%width+.5)*worldW/width,y=y0+(Math.floor(n/width)+.5)*worldH/height;
        if(!contained[p]) faceOutside++;
        if(outline[p]>=32&&patch[p]>=32) faceStroke++;
        if(y<=nose.bottom) underNose++;
        if(x<left||x>right) pupilOverflow++;
      }
      cases++;
    }

    const portrait={style:'shaved'};
    const zoom='59 78 42 33';
    const context=mouth=>frameOv(character(portrait,{headOnly:true,mouth}),zoom);
    const silhouettes=[];
    const sheet=document.createElement('section');
    sheet.id='mouth-proof';
    sheet.style.cssText='padding:18px;background:#f6f2e8;display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px';
    for (const {label,values} of Object.values(mouthPresets)) {
      const markup=context(values);
      await raster(markup,420,330,bgs[0]);
      silhouettes.push(canvas.toDataURL());
      const figure=document.createElement('figure');
      figure.style.cssText='margin:0;overflow:hidden;background:#fffdf7;border:1px solid #d7cdb7;border-radius:10px';
      figure.innerHTML=markup;
      figure.querySelector('svg').style.cssText='width:100%;height:150px;display:block;background:#fffdf8';
      const caption=document.createElement('figcaption');
      caption.textContent=label;
      caption.style.cssText='padding:7px 10px;font-size:16px';
      figure.prepend(caption);
      sheet.append(figure);
    }
    document.querySelector('main').append(sheet);
    const shadeSignatures=[];
    const colourFrame='67 87 26 15';
    const shape=mouthFor(portrait,null,{intensity:73});
    for(const skin of ['#dbbf88','#f4cfb6','#a57155','#573222']) {
      const lip=mouthMarkup(shape,skin);
      const macro=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="${colourFrame}"><rect x="67" y="87" width="26" height="15" fill="${skin}"/>${lip}</svg>`;
      const pixels=await raster(macro,260,150);
      const sample=(x,y)=>{
        const start=4*(Math.floor((y-87)*10)*260+Math.floor((x-67)*10));
        return [...pixels.slice(start,start+3)].reduce((sum,c)=>sum+c);
      };
      const centre=shape.frame.y;
      if(!(sample(80,centre)<sample(80,centre-1.2)&&sample(80,centre-1.2)<sample(80,centre+1.1))) {
        throw Error('Ordre des valeurs chromatiques incompatible · '+skin);
      }
      shadeSignatures.push(canvas.toDataURL());
    }
    const subtle=[];
    for (const [frame,size,options] of [...sizes,[zoom,440,{headOnly:true}]]) {
      const a=await raster(frameOv(character(portrait,{...options,mouth:{cupid:45}}),frame),size,size,bgs[0]);
      const b=await raster(frameOv(character(portrait,{...options,mouth:{cupid:46}}),frame),size,size,bgs[0]);
      subtle.push(a.reduce((n,x,i)=>n+(x!==b[i]),0));
    }
    return {historic,historicMismatches,cases,faceOutside,faceStroke,underNose,pupilOverflow,
      forms:new Set(silhouettes).size,skins:new Set(shadeSignatures).size,subtle};
  },{base,baseline});
}

async function verifyWorkshop(page,name,base) {
  const q=selector=>page.locator(selector);
  const save=async ()=>{
    await q('#appearance-export').tap();
    return JSON.parse(await q('#appearance-json').inputValue());
  };
  const load=async doc=>{
    await q('#appearance-json').fill(JSON.stringify(doc));
    await q('#appearance-import').tap();
    assert.equal(await q('#appearance-error').textContent(),'');
  };
  await q('#eye-preset').selectOption('narrow');
  if(await q('#eye-confirm').isVisible()) await q('#eye-confirm').tap();
  await q('#iris-active').tap();
  await q('#iris-hetero').selectOption('complete');
  await q('#details-active').tap();
  await q('#detail-lashes-count').press('End');
  await q('#brows-active').tap();
  await q('#brows-preset').selectOption('inflected');
  await q('#appearance-panel summary').tap();
  const initial=await snapshots(page), v4=await save();
  assert.equal(v4.version,4);
  await q('#mouth-active').tap();
  assert.deepEqual(await snapshots(page,'[data-side=before]'),initial);
  await q('#mouth-before-mode').selectOption('historical');
  assert((await snapshots(page,'[data-side=before]')).every(entry=>!entry.text.includes('data-bio-brows')));
  await q('#mouth-before-mode').selectOption('same');

  assert.equal(await q('#mouth-preset option').count(),10);
  await q('#mouth-preset').selectOption('cupid');
  const parts=()=>q('#mouth-zoom [data-mouth-part]').count();
  assert.equal(await parts(),3);
  const volumes=await q('#mouth-upper').getAttribute('aria-valuetext');
  await q('#mouth-intensity').press('Home');
  assert.equal(await parts(),1);
  assert.equal(await q('#mouth-upper').isDisabled(),true);
  assert.equal(await q('#mouth-cupid').isDisabled(),true);
  const plain=await save();
  assert.equal(plain.mouth.effective.upper,null);
  assert.equal(plain.mouth.requested.upper,156);
  await q('#mouth-intensity').press('End');
  assert.equal(await q('#mouth-upper').getAttribute('aria-valuetext'),volumes);
  await q('#mouth-cupid').press('Home');
  assert.equal(await q('#mouth-peaks').isDisabled(),true);
  await q('#mouth-cupid').press('End');
  assert.equal(await q('#mouth-peaks').getAttribute('aria-valuetext'),'28 %');
  await q('#mouth-width').tap({position:{x:26,y:19}});
  const touched=await q('#mouth-width').getAttribute('aria-valuetext');
  assert.notEqual(touched,'100 %');
  await q('#mouth-preset').selectOption('cupid');
  const v5=await save(), final=await snapshots(page);
  assert.equal(v5.version,5);
  for(const key of ['character','eyes','iris','details','brows','palette','historicalSelection']) assert.deepEqual(v5[key],v4[key]);
  await page.reload();
  await q('#appearance-panel summary').tap();
  await load(v5);
  assert.deepEqual(await snapshots(page),final);
  assert.deepEqual(await save(),v5);
  await q('#mouth-active').tap();
  assert.deepEqual(await snapshots(page),initial);
  assert.deepEqual((await save()).mouth.latent,v5.mouth.requested);
  await q('#mouth-active').tap();
  assert.deepEqual(await snapshots(page),final);
  await q('#mouth-seed').fill('Bouche ✦ recettée');
  await q('#mouth-random').tap();
  const random=await snapshots(page), drawn=await save();
  assert.equal(drawn.mouth.draw.seed,'Bouche ✦ recettée');
  for(const key of ['character','eyes','iris','details','brows','palette','historicalSelection']) assert.deepEqual(drawn[key],v4[key]);
  await q('#mouth-random').tap();
  assert.deepEqual(await snapshots(page),random);
  await q('#mouth-reset').tap();
  assert.deepEqual(await snapshots(page),initial);
  assert.deepEqual(await save(),v4);

  const constrained=await page.evaluate(async ({base,v5})=>{
    const [{appearanceDocument,parseAppearance},{restoreSelection},{controls}]=await Promise.all([
      import(new URL('appearance.mjs',base)),import(new URL('catalogue.mjs',base)),
      import(new URL(base.includes('/preview/')?'../bio-vis-p5-i6/model.mjs':'../preview/bio-vis-p5-i6/model.mjs',base))
    ]);
    const current=parseAppearance(JSON.stringify(v5));
    const morph=Object.fromEntries(Object.entries(controls).map(([k,c],i)=>[k,65>>i&1?c.max:c.min]));
    const selection=restoreSelection({...current.selection.raw,...morph});
    return appearanceDocument(selection,{...current,mouth:{width:130,upper:200,lower:100,
      cupid:100,peaks:55,corners:-100,curvature:100,intensity:100,thickness:200}});
  },{base,v5});
  await load(constrained);
  const range=await q('#mouth-lower-domain').textContent();
  assert.match(range,/190,18/);
  await q('#mouth-lower').press('End');
  const limit=(await save()).mouth.effective.lower;
  assert(limit>190&&limit<191);
  assert.match(await q('#mouth-lower').getAttribute('aria-valuetext'),/190,18/);

  await load(v5);
  const layouts=[];
  for(const [width,height] of [[820,1180],[1180,820],[390,844]]) {
    await page.setViewportSize({width,height});
    for(const background of ['light','dark']) {
      await q('#background').selectOption(background);
      const sizes=await q('[data-side=after] svg').evaluateAll(list=>list.map(svg=>{
        const box=svg.getBoundingClientRect();
        return [box.width,box.height];
      }));
      assert.deepEqual(sizes.map(s=>s[1]),[300,178,70]);
      assert.equal(sizes[2][0],70);
      assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth),width);
      layouts.push({width,height,background,sizes});
    }
  }
  await page.setViewportSize({width:820,height:1180});
  await q('#mouth').screenshot({path:path.join(output,name+'-atelier.png')});
  await q('#comparison').screenshot({path:path.join(output,name+'-trois-echelles.png')});
  return {cold:3,touched,fractionalLimit:limit,layouts};
}

(async ()=>{
  await mkdir(output,{recursive:true});
  const server=process.env.BASE_URL?null:await localSite();
  const base=process.env.BASE_URL??`http://127.0.0.1:${server.address().port}/bio-yeux-01/`;
  const baseline=new URL(server?'baseline-render.mjs':'../bio-sourcils-01/render.mjs',base).href;
  const result={base,engines:[]};
  try {
    for (const name of (process.env.AUDIT_ENGINES??'chromium,webkit').split(',')) {
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
        console.log('Raster '+name+' '+JSON.stringify(raster));
        const {historic,historicMismatches,cases,faceOutside,faceStroke,underNose,pupilOverflow,forms,skins,subtle}=raster;
        assert.deepEqual([historic,historicMismatches,cases,faceOutside,faceStroke,underNose,pupilOverflow,forms,skins],
          [54,0,144,0,0,0,0,9,4]);
        assert(subtle.at(-1)>0);
        await page.locator('#mouth-proof').screenshot({path:path.join(output,name+'-neuf-silhouettes.png')});
        await page.locator('#mouth-proof').evaluate(element=>element.remove());
        const workshop=await verifyWorkshop(page,name,base);
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
