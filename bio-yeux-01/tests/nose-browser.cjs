const activeAppearance = require('./active-appearance.cjs');
const assert = require('node:assert/strict');
const {createServer} = require('node:http');
const {execFileSync} = require('node:child_process');
const {readFile, mkdir, writeFile} = require('node:fs/promises');
const path = require('node:path');
const {chromium, webkit} = require('playwright');

const root = path.resolve(__dirname, '../..');
const output = process.env.ARTIFACT_DIR ?? '/tmp/microcosme-bio-nez-01';
const baselineCommit = '00e6496a7dd9274917622ef54459d28375d6a3ed';
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
      {nosePresets,noseDetailPresets,noseFor,noseMarkup},{pigmentCenters,pupilShapes}]=await Promise.all([
      import(new URL('render.mjs',base)),import(baseline),import(new URL('eyes.mjs',base)),import(modelUrl),
      import(new URL('nose.mjs',base)),import(new URL('iris.mjs',base))
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
    const frameOv=(text,frame)=>text.replace(/viewBox="[^"]*"/,`viewBox="${frame}"`);
    const sizes=[['-30 -65 220 225',300,{headOnly:true}],['-40 -85 240 355',178,{}],
      ['-35 -68 230 245',70,{headOnly:true,smallScale:true}]];
    const openings=[null,...Object.keys(eyePresets)];
    const bgs=['#fffdf8','#474c55'];
    const iris={irisSize:140,irisRatio:1.25,pupilSize:73,pupilShape:'ring',primary:'vert',
      secondary:'orange',heterochromia:'central',secondarySize:74};
    const details={lashes:{count:3,length:15,spacing:100},contours:{upper:250,lower:200},
      upper:{count:2,intensity:100},lower:{count:2,intensity:100},shadows:{intensity:90,volume:80}};
    const brows={monobrow:true,slit:true,arc:82,colourMode:'independent',colour:'violet-amethyste'};
    const mouth={upper:173,lower:174,cupid:37,thickness:77,intensity:68};
    let historic=0,historicMismatches=0;
    for(const eyes of openings) for(const [frame,size,opts] of sizes) for(const bg of bgs) {
      const input={...presets.tall.values,style:'p5-061',arrangement:'G',body:'bust'};
      const params={...opts,eyes,iris,details,brows,mouth,hairColor:'bleu-vif',instance:'nose-history'};
      const a=before(input,params), b=character(input,{...params,nose:'historical'});
      const first=await raster(frameOv(a,frame),size,size,bg),second=await raster(frameOv(b,frame),size,size,bg);
      if(a!==b||first.some((value,i)=>value!==second[i])) historicMismatches++;
      historic++;
    }

    const portraits=[{},presets.tall.values,presets.broad.values,
      {skull_width:1.18,skull_height:.82,forehead_width:.86,forehead_height:.84,
       temple_width:.9,cheek_width:.88,jowls:1.35,jaw_width:.82}];
    const variants=[{}, {length:150,bridge:180,wings:160,tip:180,roundness:100,nostrils:180,tilt:100,fills:100,lines:100},
      {length:150,bridge:180,wings:60,tip:175,roundness:0,nostrils:180,tilt:-100,fills:0,lines:100},
      {length:55,bridge:40,wings:60,tip:30,roundness:100,nostrils:0,fills:100,lines:100}];
    const doc=new DOMParser();
    const load=text=>doc.parseFromString(text,'image/svg+xml');
    const width=232,height=180,worldW=46.4,worldH=36;
    let cases=0,faceOutside=0,faceStroke=0,inEyes=0,inMouth=0,pupilOverflow=0,nostrilOverflow=0;
    for(const input of portraits) for(const eyes of openings) for(const nose of variants) {
      const face=model(input), opening=eyesFor(input,eyes);
      const [{x:left},{x:right}]=pigmentCenters(opening);
      const [x,y]=face.base.anchors.nose;
      const x0=x-worldW/2,y0=y-worldH/2;
      const wrap=markup=>`<svg xmlns="http://www.w3.org/2000/svg" viewBox="${x0} ${y0} ${worldW} ${worldH}">${markup}</svg>`;
      const pupilShape=Object.keys(pupilShapes)[cases%6];
      const mouthState=cases%2?mouth:null;
      const tree=load(character(input,{eyes,mouth:mouthState,nose,iris:{...iris,pupilShape},details,brows,instance:'nose-safety'}));
      const part=tree.querySelector('[data-bio-nose]');
      const facePath=tree.querySelector('[data-layer=face] .head-shape > path').getAttribute('d');
      const {shapes,face:{envelopes,reference}}=opening;
      const openingsInk=envelopes.map(({x,y},i)=>shapes.length?`<path d="${shapes[i].path}"/>`:
        `<ellipse cx="${x}" cy="${y}" rx="${reference.width/2}" ry="${reference.height/2}"/>`).join('');
      const detailsInk=[...tree.querySelectorAll('[data-bio-details]')].map(node=>node.outerHTML).join('');
      const aperture=await raster(wrap(openingsInk+detailsInk),width,height);
      const lip=tree.querySelector('[data-bio-mouth]')?.outerHTML??
        [...tree.querySelectorAll('.head-shape > path')].find(path=>{
          const [mx,my]=face.base.anchors.mouth;
          return path.getAttribute('d').startsWith(`M${mx-face.base.head.rx*.25},${my-1} Q`);
        }).outerHTML;
      const lips=await raster(wrap(lip),width,height);
      const patch=await raster(wrap(part.outerHTML),width,height);
      const contained=await raster(wrap(`<path d="${facePath}"/>`),width,height);
      const outline=await raster(wrap(`<path d="${facePath}" fill="none" stroke="black" stroke-width="4.2"/>`),width,height);
      const solved=noseFor(input,eyes,{...nose,fills:100},{mouth:mouthState,details});
      const envelope=load(wrap(noseMarkup(solved))).querySelector('[data-nose-region=bridge]').outerHTML;
      const interior=await raster(wrap(envelope),width,height);
      const nostrils=await raster(wrap([...part.querySelectorAll('[data-nose-region=nostrils]')].map(node=>node.outerHTML).join('')),width,height);
      for(let n=0;n<patch.length/4;n++){
        const p=4*n+3;
        if(nostrils[p]&&!interior[p]) nostrilOverflow++;
        if(!patch[p]) continue;
        const xx=x0+(n%width+.5)*worldW/width;
        if(!contained[p]) faceOutside++;
        if(outline[p]>=32&&patch[p]>=32) faceStroke++;
        if(aperture[p]>=32&&patch[p]>=32) inEyes++;
        if(lips[p]>=32&&patch[p]>=32) inMouth++;
        if(xx<left||xx>right) pupilOverflow++;
      }
      cases++;
    }

    const portrait={style:'shaved'};
    const zoom='60 65 40 37';
    const view=nose=>frameOv(character(portrait,{headOnly:true,nose,mouth:{...mouth,upper:80,lower:90}}),zoom);
    const signatures=[], sheet=document.createElement('section');
    sheet.id='nose-proof';
    sheet.style.cssText='padding:18px;background:#f6f2e8;display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px';
    for(const {label,values} of Object.values(nosePresets)){
      const markup=view(values);
      await raster(markup,400,370,bgs[0]);
      signatures.push(canvas.toDataURL());
      const figure=document.createElement('figure');
      figure.style.cssText='margin:0;overflow:hidden;background:#fffdf7;border:1px solid #d7cdb7;border-radius:10px';
      figure.innerHTML=markup;
      figure.querySelector('svg').style.cssText='width:100%;height:154px;display:block;background:#fffdf8';
      const caption=document.createElement('figcaption');
      caption.textContent=label;
      caption.style.cssText='padding:7px 10px;font-size:16px';
      figure.prepend(caption);
      sheet.append(figure);
    }
    document.querySelector('main').append(sheet);
    const levels=[];
    for(const {values} of Object.values(noseDetailPresets)){
      await raster(view(values),400,370,bgs[0]);
      levels.push(canvas.toDataURL());
    }
    const shades=[];
    for(const skin of ['#dbbf88','#f4cfb6','#a57155','#573222']){
      const s=noseFor({},null,{fills:74,lines:79}), g=s.geometry;
      const x0=66,y0=69,r=12,width=280;
      const art=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="${x0} ${y0} 28 26"><rect x="${x0}" y="${y0}" width="28" height="26" fill="${skin}"/>${noseMarkup(s,skin)}</svg>`;
      const data=await raster(art,width,260);
      const sample=(x,y)=>{
        const start=4*(Math.floor((y-y0)*10)*width+Math.floor((x-x0)*10));
        return [...data.slice(start,start+3)].reduce((sum,v)=>sum+v,0);
      };
      if(!(sample(80+g.nostril.dx,g.nostril.y)<sample(80,g.y(.747))&&sample(80,g.y(.747))>sample(80+r,80))) {
        throw Error('Contraste nasal insuffisant · '+skin);
      }
      shades.push(canvas.toDataURL());
    }
    const subtle=[];
    for(const [frame,size,opts] of [...sizes,[zoom,440,{headOnly:true}]]){
      const a=await raster(frameOv(character(portrait,{...opts,nose:{roundness:50}}),frame),size,size,bgs[0]);
      const b=await raster(frameOv(character(portrait,{...opts,nose:{roundness:51}}),frame),size,size,bgs[0]);
      subtle.push(a.reduce((n,x,i)=>n+(x!==b[i]),0));
    }
    return {historic,historicMismatches,cases,faceOutside,faceStroke,inEyes,inMouth,pupilOverflow,nostrilOverflow,
      forms:new Set(signatures).size,levels:new Set(levels).size,skins:new Set(shades).size,subtle};
  },{base,baseline});
}

async function verifyWorkshop(page,name){
  const q=selector=>page.locator(selector);
  const save=async ()=>{
    await q('#appearance-export').tap();
    return activeAppearance(await q('#appearance-json').inputValue());
  };
  const load=async doc=>{
    await q('#appearance-json').fill(JSON.stringify(doc));
    await q('#appearance-import').tap();
    assert.equal(await q('#appearance-error').textContent(),'');
  };
  await q('#eye-preset').selectOption('narrow');
  if(await q('#eye-confirm').isVisible()) await q('#eye-confirm').tap();
  await q('#iris-active').tap();
  await q('#details-active').tap();
  await q('#detail-lashes-count').press('End');
  await q('#brows-active').tap();
  await q('#brows-preset').selectOption('inflected');
  await q('#mouth-active').tap();
  await q('#mouth-preset').selectOption('full');
  await q('#appearance-panel summary').tap();
  const before=await snapshots(page), v5=await save();
  assert.equal(v5.version,5);
  await q('#nose-active').tap();
  assert.deepEqual(await snapshots(page,'[data-side=before]'),before);
  await q('#nose-before-mode').selectOption('historical');
  assert((await snapshots(page,'[data-side=before]')).every(e=>!e.text.includes('data-bio-mouth')));
  await q('#nose-before-mode').selectOption('same');

  assert.equal(await q('#nose-preset optgroup[label=Morphologies] option').count(),9);
  assert.equal(await q('#nose-preset optgroup[label="Degrés de détail"] option').count(),3);
  await q('#nose-preset').selectOption('rounded');
  await q('#nose-tilt').press('End');
  const tilt=await q('#nose-tilt').getAttribute('aria-valuetext');
  await q('#nose-nostrils').press('Home');
  assert.equal(await q('#nose-tilt').isDisabled(),true);
  assert.equal(await q('#nose-zoom [data-nose-region=nostrils]').count(),0);
  await q('#nose-nostrils').press('ArrowRight');
  assert.equal(await q('#nose-tilt').getAttribute('aria-valuetext'),tilt);
  await q('#nose-preset').selectOption('long');
  await q('#nose-length').tap({position:{x:24,y:17}});
  const touched=await q('#nose-length').getAttribute('aria-valuetext');
  assert.notEqual(touched,'145 %');

  await q('#nose-length').press('Home');
  await q('#nose-tip').press('End');
  const short=await save();
  assert.deepEqual(short.mouth.effective,v5.mouth.effective);
  await q('#nose-length').press('End');
  const long=await save();
  assert(long.mouth.effective.upper<short.mouth.effective.upper);
  assert.deepEqual(long.mouth.requested,short.mouth.requested);
  assert.deepEqual({...long.mouth.effective,upper:short.mouth.effective.upper},short.mouth.effective);
  assert.match(await q('#mouth-status').textContent(),/Le nez limite/);
  assert.equal(await q('#mouth-upper').getAttribute('aria-valuetext'),
    `173 % demandé, ${new Intl.NumberFormat('fr-FR',{maximumFractionDigits:2}).format(long.mouth.effective.upper)} % effectif`);
  const upperDomain=await q('#mouth-upper-domain').textContent();
  await q('#nose-lines').press('Home');
  await q('#nose-fills').press('Home');
  const unpainted=await save();
  assert.deepEqual(unpainted.nose.anatomy,long.nose.anatomy);
  assert.deepEqual(unpainted.mouth,long.mouth);
  assert.equal(await q('#nose-zoom [data-nose-region]').count(),0);
  assert.equal(await q('#nose-length').isDisabled(),true);
  assert.equal(await q('#mouth-upper-domain').textContent(),upperDomain);
  await load(long);
  for(let i=0;i<3;i++){
    await q('#nose-length').press('Home');
    assert.deepEqual((await save()).mouth.effective,short.mouth.effective);
    await q('#nose-length').press('End');
    assert.deepEqual((await save()).mouth.effective,long.mouth.effective);
  }
  const exact=await snapshots(page);
  await page.reload();
  await q('#appearance-panel summary').tap();
  await load(long);
  assert.deepEqual(await snapshots(page),exact);
  assert.deepEqual(await save(),long);

  await q('#nose-active').tap();
  assert.deepEqual(await snapshots(page),before);
  assert.deepEqual((await save()).nose.latent,long.nose.requested);
  await q('#nose-active').tap();
  assert.deepEqual(await snapshots(page),exact);
  await q('#nose-seed').fill('Nez ✦ recetté');
  await q('#nose-random').tap();
  const random=await snapshots(page),drawn=await save();
  assert.equal(drawn.nose.draw.seed,'Nez ✦ recetté');
  assert.deepEqual(drawn.mouth.requested,v5.mouth.requested);
  for(const key of ['character','eyes','iris','details','brows','palette','historicalSelection']) assert.deepEqual(drawn[key],v5[key]);
  await q('#nose-random').tap();
  assert.deepEqual(await snapshots(page),random);
  await q('#nose-reset').tap();
  assert.deepEqual(await snapshots(page),before);
  assert.deepEqual(await save(),v5);

  await load(long);
  await q('#mouth-seed').fill('Bouche sous le nez');
  await q('#mouth-random').tap();
  const afterMouth=await save();
  assert.equal(afterMouth.mouth.draw.seed,'Bouche sous le nez');
  assert.deepEqual(afterMouth.nose,long.nose);
  for(const [key,value] of Object.entries(afterMouth.mouth.effective)){
    if(value!==null) assert.equal(value,afterMouth.mouth.requested[key]);
  }
  await load(long);
  const layouts=[];
  for(const [width,height] of [[820,1180],[1180,820],[390,844]]) {
    await page.setViewportSize({width,height});
    for(const background of ['light','dark']) {
      await q('#background').selectOption(background);
      const sizes=await q('[data-side=after] svg').evaluateAll(list=>list.map(svg=>{
        const box=svg.getBoundingClientRect();return [box.width,box.height];
      }));
      assert.deepEqual(sizes.map(s=>s[1]),[300,178,70]);
      assert.equal(sizes[2][0],70);
      assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth),width);
      layouts.push({width,height,background,sizes});
    }
  }
  await page.setViewportSize({width:820,height:1180});
  await q('#nose').screenshot({path:path.join(output,name+'-atelier.png')});
  await q('#comparison').screenshot({path:path.join(output,name+'-trois-echelles.png')});
  return {cold:3,touched,upperBefore:short.mouth.effective.upper,upperConstrained:long.mouth.effective.upper,upperDomain,layouts};
}

(async ()=>{
  await mkdir(output,{recursive:true});
  const server=process.env.BASE_URL?null:await localSite();
  const base=process.env.BASE_URL??`http://127.0.0.1:${server.address().port}/bio-yeux-01/`;
  const baseline=new URL(server?'baseline-render.mjs':'../bio-bouche-01/render.mjs',base).href;
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
        console.log('Raster '+name+' '+JSON.stringify(raster));
        const {historic,historicMismatches,cases,faceOutside,faceStroke,inEyes,inMouth,pupilOverflow,nostrilOverflow,forms,levels,skins,subtle}=raster;
        assert.deepEqual([historic,historicMismatches,cases,faceOutside,faceStroke,inEyes,inMouth,pupilOverflow,nostrilOverflow,forms,levels,skins],
          [54,0,144,0,0,0,0,0,0,9,3,4]);
        assert(subtle.at(-1)>0);
        await page.locator('#nose-proof').screenshot({path:path.join(output,name+'-neuf-morphologies.png')});
        await page.locator('#nose-proof').evaluate(element=>element.remove());
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
