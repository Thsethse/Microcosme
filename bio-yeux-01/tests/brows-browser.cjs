const assert = require('node:assert/strict');
const {createServer} = require('node:http');
const {execFileSync} = require('node:child_process');
const {readFile, mkdir, writeFile} = require('node:fs/promises');
const path = require('node:path');
const {chromium, webkit} = require('playwright');

const root = path.resolve(__dirname, '../..');
const output = process.env.ARTIFACT_DIR ?? '/tmp/microcosme-bio-sourcils-01';
const baselineCommit = 'd17a21757ffee651154534e6c081656f873ecf1a';
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
    const paletteUrl=new URL('../bio-col-01/palette.mjs',base);
    const [{character},{character:before},{eyePresets,eyesFor},{presets},{browPresets},{palette},{choices}]=await Promise.all([
      import(new URL('render.mjs',base)),import(baseline),import(new URL('eyes.mjs',base)),import(modelUrl),
      import(new URL('brows.mjs',base)),import(paletteUrl),import(new URL('catalogue.mjs',base))
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
      upper:{count:2,intensity:100},lower:{count:2,intensity:100},shadows:{intensity:90,volume:90}};
    let historic=0, historicMismatches=0;
    for (const eyes of openings) for (const [frame,size,opts] of sizes) for (const bg of bgs) {
      const input={...presets.tall.values,style:'p5-061',arrangement:'G',body:'bust'};
      const params={...opts,eyes,iris,details,hairColor:'bleu-vif',instance:'brow-histo'};
      const a=before(input,params), b=character(input,{...params,brows:'historical'});
      const first=await raster(frameOv(a,frame),size,size,bg), second=await raster(frameOv(b,frame),size,size,bg);
      if (a!==b||first.some((value,i)=>value!==second[i])) historicMismatches++;
      historic++;
    }

    const portraits=[{},presets.tall.values,presets.broad.values,
      {skull_width:.86,skull_height:1.18,forehead_width:1.14,forehead_height:.84,
       temple_width:.9,cheek_width:.88,jowls:1.35,jaw_width:.82}];
    const variants=[{}, {monobrow:true,slit:true}, {absent:true}, {length:125,thickness:220,arc:100,summit:80,
      tilt:-20,angularity:100,height:0,taper:0,spacing:100}];
    const doc=new DOMParser();
    const load=text=>doc.parseFromString(text,'image/svg+xml');
    const band='39 36 82 47';
    const svg=markup=>`<svg xmlns="http://www.w3.org/2000/svg" viewBox="${band}">${markup}</svg>`;
    const width=205,height=118;
    let cases=0,outside=0,inEyes=0;
    for (const input of portraits) for (const eyes of openings) for (const brows of variants) {
      const tree=load(character({...input,style:'shaved'},{eyes,brows,iris,details,instance:'eyebrow-safety'}));
      const brow=tree.querySelector('[data-bio-brows]');
      const outline=tree.querySelector('[data-layer=face] .head-shape > path').getAttribute('d');
      const {shapes,face}=eyesFor(input,eyes);
      const eyesMarkup=face.envelopes.map(({x,y},i)=>shapes.length?`<path d="${shapes[i].path}"/>`:
        `<ellipse cx="${x}" cy="${y}" rx="${face.reference.width/2}" ry="${face.reference.height/2}"/>`).join('');
      const outsideDetails=[...tree.querySelectorAll('[data-bio-details]')].map(layer=>layer.outerHTML).join('');
      const browPixels=await raster(svg(brow.outerHTML),width,height);
      const facePixels=await raster(svg(`<path d="${outline}"/>`),width,height);
      const eyePixels=await raster(svg(eyesMarkup+outsideDetails),width,height);
      for (let p=3;p<browPixels.length;p+=4) {
        if (!browPixels[p]) continue;
        if (facePixels[p]===0) outside++;
        if (browPixels[p]>=80&&eyePixels[p]>=80) inEyes++;
      }
      cases++;
    }

    const inputs={style:'shaved'}, opts={eyes:'narrow',details,iris,headOnly:true};
    const result=[];
    const browZoom='49 45 62 31';
    const context=state=>frameOv(character(inputs,{...opts,brows:state}),browZoom);
    for (const {values} of Object.values(browPresets)) {
      await raster(context(values),520,260,bgs[0]);
      result.push(canvas.toDataURL());
    }
    const paletteDraws=[];
    for (const {id} of palette) {
      await raster(context({colourMode:'independent',colour:id}),400,200,bgs[0]);
      paletteDraws.push(canvas.toDataURL());
    }
    function countMarks(pixels,w,h) {
      const seen=new Uint8Array(w*h);
      let n=0;
      for (let p=0;p<seen.length;p++) {
        if(seen[p]||pixels[4*p+3]<80) continue;
        const queue=[p];
        seen[p]=1;
        for(let i=0;i<queue.length;i++) {
          const x=queue[i]%w,y=Math.floor(queue[i]/w);
          for (let dy=-1;dy<=1;dy++) for (let dx=-1;dx<=1;dx++) {
            if(x+dx<0||x+dx>=w||y+dy<0||y+dy>=h) continue;
            const q=queue[i]+dx+dy*w;
            if(seen[q]||pixels[4*q+3]<80) continue;
            seen[q]=1;
            queue.push(q);
          }
        }
        if(queue.length>=5) n++;
      }
      return n;
    }
    const topology=[];
    for(const state of [{},{slit:true},{monobrow:true},{monobrow:true,slit:true},{absent:true}]) {
      const layer=load(context(state)).querySelector('[data-bio-brows]').outerHTML;
      const text=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="${browZoom}">${layer}</svg>`;
      topology.push(countMarks(await raster(text,400,200),400,200));
    }

    const paint={colourMode:'independent',colour:'violet-amethyste',height:62,thickness:140};
    const visibility={visible:0,partial:0,hidden:[],candidates:0};
    const h=114,w=228;
    for (const {style,arrangement,key} of choices) {
      const input={style,arrangement};
      const on=character(input,{headOnly:true,brows:paint});
      const off=character(input,{headOnly:true,brows:{absent:true}});
      const node=load(on).querySelector('[data-bio-brows]');
      const isolated=await raster(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="${browZoom}">${node.outerHTML}</svg>`,w,h);
      const full=await raster(frameOv(on,browZoom),w,h), blank=await raster(frameOv(off,browZoom),w,h);
      let sampled=0,visible=0;
      for (let p=0;p<isolated.length;p+=4) {
        if(isolated[p+3]!==255) continue;
        sampled++;
        visible+=Number([0,1,2].some(channel=>Math.abs(full[p+channel]-blank[p+channel])>8));
      }
      if(visible) visibility.visible++;
      else visibility.hidden.push(key);
      if(visible>0&&visible<sampled*.97) visibility.partial++;
      visibility.candidates++;
    }
    const subtle=[];
    for (const [frame,size,opts] of [...sizes,[browZoom,460,{headOnly:true}]]) {
      const pair=[65,66].map(taper=>character(inputs,{...opts,brows:{taper}}));
      const a=await raster(frameOv(pair[0],frame),size,size,bgs[0]), b=await raster(frameOv(pair[1],frame),size,size,bgs[0]);
      subtle.push(a.reduce((n,x,i)=>n+(x!==b[i]),0));
    }
    const sheet=document.createElement('section');
    sheet.id='brow-proof';
    sheet.style.cssText='padding:18px;background:#f6f2e8;display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px';
    for (const {label,values} of Object.values(browPresets)) {
      const figure=document.createElement('figure');
      figure.style.cssText='margin:0;overflow:hidden;background:#fffdf7;border:1px solid #d7cdb7;border-radius:10px';
      const title=document.createElement('figcaption');
      title.textContent=label;
      title.style.cssText='padding:6px 10px;font-size:16px';
      figure.innerHTML=context(values);
      figure.querySelector('svg').style.cssText='width:100%;height:124px;display:block;background:#dbbf88';
      figure.prepend(title);
      sheet.append(figure);
    }
    document.querySelector('main').append(sheet);
    return {historic,historicMismatches,cases,outside,inEyes,forms:new Set(result).size,
      colours:new Set(paletteDraws).size,topology,visibility,subtle};
  },{base,baseline});
}

async function verifyWorkshop(page,name) {
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
  const confirm=async ()=>{if(await q('#eye-confirm').isVisible()) await q('#eye-confirm').tap();};
  await q('#eye-preset').selectOption('narrow');
  await confirm();
  await q('#iris-active').tap();
  await q('#iris-hetero').selectOption('complete');
  await q('#details-active').tap();
  await q('#detail-lashes-count').press('End');
  await q('[data-category=fantasy]').tap();
  await q('[data-colour=bleu-vif]').tap();
  await q('#appearance-panel summary').tap();
  const initial=await snapshots(page), v3=await save();
  assert.equal(v3.version,3);
  await q('#brows-active').tap();
  assert.deepEqual(await snapshots(page,'[data-side=before]'),initial);
  await q('#brows-before-mode').selectOption('historical');
  assert((await snapshots(page,'[data-side=before]')).every(entry=>!entry.text.includes('data-bio-iris')));
  await q('#brows-before-mode').selectOption('same');
  assert.equal(await q('#brows-preset option').count(),10);
  await q('#brows-preset').selectOption('inflected');
  assert.equal(await q('#brow-summit').getAttribute('aria-valuetext'),'80 %');
  await q('#brow-arc').press('Home');
  assert.equal(await q('#brow-summit').isDisabled(),true);
  assert.equal(await q('#brow-angularity').isDisabled(),true);
  await q('#brow-arc').press('ArrowRight');
  assert.equal(await q('#brow-summit').getAttribute('aria-valuetext'),'80 %');
  await q('#brow-length').tap({position:{x:25,y:16}});
  const touched=await q('#brow-length').getAttribute('aria-valuetext');
  assert.notEqual(touched,'100 %');
  await q('#brows-preset').selectOption('inflected');
  const fills=()=>q('#brows-zoom [data-brow-side]').evaluateAll(list=>list.map(e=>e.getAttribute('fill')));
  assert.deepEqual(await fills(),['#3b66e3','#3b66e3']);
  assert.equal(await q('#brows-colour').isDisabled(),true);
  await q('#brows-colour-mode').selectOption('darker');
  assert.deepEqual(await fills(),['#345ac8','#345ac8']);
  await q('#brows-colour-mode').selectOption('independent');
  assert.equal(await q('#brows-colour option').count(),26);
  await q('#brows-colour').selectOption('violet-amethyste');
  assert.deepEqual(await fills(),['#9756bf','#9756bf']);
  await q('#brows-monobrow').tap();
  await q('#brows-slit').tap();
  await q('#brows-absent').tap();
  assert.equal(await q('#brows-zoom [data-bio-brows=absent]').count(),1);
  assert.equal(await q('#brows-colour-mode').isDisabled(),true);
  await q('#brows-absent').tap();
  assert.equal(await q('#brows-zoom [data-brow-side=joined]').count(),1);
  assert.equal(await q('#brows-zoom [data-brow-side=right-tip]').count(),1);
  assert.equal(await q('#brows-colour').inputValue(),'violet-amethyste');
  const v4=await save(), final=await snapshots(page);
  assert.equal(v4.version,4);
  for(const key of ['character','eyes','details','iris','palette','historicalSelection']) assert.deepEqual(v4[key],v3[key]);
  await page.reload();
  await q('#appearance-panel summary').tap();
  await load(v4);
  assert.deepEqual(await snapshots(page),final);
  assert.deepEqual(await save(),v4);
  await q('#brows-active').tap();
  assert.deepEqual(await snapshots(page),initial);
  const latent=await save();
  assert.equal(latent.brows.mode,'historical');
  assert.deepEqual(latent.brows.latent,v4.brows.requested);
  await q('#brows-active').tap();
  assert.deepEqual(await snapshots(page),final);
  await q('#brows-seed').fill('Sourcils ✦ recettés');
  await q('#brows-random').tap();
  const a=await snapshots(page), drawn=await save();
  assert.equal(drawn.brows.draw.seed,'Sourcils ✦ recettés');
  for(const key of ['character','eyes','details','iris','palette','historicalSelection']) assert.deepEqual(drawn[key],v3[key]);
  await q('#brows-random').tap();
  assert.deepEqual(await snapshots(page),a);
  await q('#brows-reset').tap();
  assert.deepEqual(await snapshots(page),initial);
  assert.deepEqual(await save(),v3);
  await load(v4);
  await q('#brows-colour-mode').selectOption('linked');
  await q('#historical').selectOption('shaved:U');
  await q('#load-history').tap();
  await confirm();
  assert.match(await q('#brows-pigment').textContent(),/mémorisée/);
  assert.deepEqual(await fills(),['#3b66e3','#3b66e3']);
  await load(v4);
  const layouts=[];
  for(const [width,height] of [[820,1180],[1180,820],[390,844]]) {
    await page.setViewportSize({width,height});
    for(const background of ['light','dark']) {
      await q('#background').selectOption(background);
      const sizes=await q('[data-side=after] svg').evaluateAll(list=>list.map(svg=>{
        const rect=svg.getBoundingClientRect();
        return [rect.width,rect.height];
      }));
      assert.deepEqual(sizes.map(s=>s[1]),[300,178,70]);
      assert.equal(sizes[2][0],70);
      assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth),width);
      layouts.push({width,height,background,sizes});
    }
  }
  await page.setViewportSize({width:820,height:1180});
  await q('#brows-monobrow').tap();
  await q('#brows-slit').tap();
  await q('#brows-preset').selectOption('inflected');
  await q('#brows').screenshot({path:path.join(output,name+'-atelier.png')});
  await q('#comparison').screenshot({path:path.join(output,name+'-trois-echelles.png')});
  return {cold:3,touched,layouts};
}

(async ()=>{
  await mkdir(output,{recursive:true});
  const server=process.env.BASE_URL?null:await localSite();
  const base=process.env.BASE_URL??`http://127.0.0.1:${server.address().port}/bio-yeux-01/`;
  const baseline=new URL(server?'baseline-render.mjs':'../bio-yeux-03/render.mjs',base).href;
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
        const {historic,historicMismatches,cases,outside,inEyes,forms,colours,topology,visibility,subtle}=raster;
        assert.deepEqual([historic,historicMismatches,cases,outside,inEyes,forms,colours],[54,0,144,0,0,9,26]);
        assert.deepEqual(topology,[2,3,1,2,0]);
        assert.equal(visibility.candidates,126);
        assert(visibility.partial>0);
        assert(subtle.at(-1)>0);
        await page.locator('#brow-proof').screenshot({path:path.join(output,name+'-neuf-silhouettes.png')});
        // The proof sheet has been captured. Workshop layout uses the shipped DOM.
        await page.locator('#brow-proof').evaluate(element=>element.remove());
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
