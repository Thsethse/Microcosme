const activeAppearance = require('./active-appearance.cjs');
const assert = require('node:assert/strict');
const {createServer} = require('node:http');
const {execFileSync} = require('node:child_process');
const {readFile, mkdir, writeFile} = require('node:fs/promises');
const path = require('node:path');
const {chromium, webkit} = require('playwright');

const root = path.resolve(__dirname, '../..');
const output = process.env.ARTIFACT_DIR ?? '/tmp/microcosme-bio-yeux-03';
const baselineCommit = 'a93a82c34fcfd9df6d5d9222efa957d2b756127e';
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

async function verifyRaster(page, base, baseline) {
  return page.evaluate(async ({base,baseline})=>{
    const [{character},{character:before},{eyePresets,eyesFor},{presets}]=await Promise.all([
      import(new URL('render.mjs',base)),import(baseline),import(new URL('eyes.mjs',base)),
      import(new URL(base.includes('/preview/')?'../bio-vis-p5-i6/model.mjs':'../preview/bio-vis-p5-i6/model.mjs',base))
    ]);
    const doc=new DOMParser();
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
    const openingList=[null,...Object.keys(eyePresets)];
    const bgs=['#fffdf8','#474c55'];
    const iris={irisSize:140,irisRatio:1.17,pupilSize:60,pupilShape:'ring',primary:'vert',
      secondary:'orange',heterochromia:'central',secondarySize:60};
    let historic=0, historicMismatches=0;
    for (const eyes of openingList) for (const [frame,size,opts] of sizes) for (const bg of bgs) {
      const input={...presets.tall.values,style:'p5-061',arrangement:'G',body:'bust'};
      const params={...opts,eyes,iris,hairColor:'bleu-vif',instance:'lids-histo'};
      const a=before(input,params), b=character(input,{...params,details:'historical'});
      const first=await raster(frameOv(a,frame),size,size,bg), second=await raster(frameOv(b,frame),size,size,bg);
      if (a!==b||first.some((value,i)=>value!==second[i])) historicMismatches++;
      historic++;
    }
    const width=138,height=138;
    function components(raster) {
      const seen=new Uint8Array(width*height);
      let count=0, largest=0, isolated=0;
      for (let i=0;i<seen.length;i++) {
        if (seen[i]||raster[4*i+3]<80) continue;
        const next=[i];
        seen[i]=1;
        for (let k=0;k<next.length;k++) {
          const point=next[k], x=point%width,y=Math.floor(point/width);
          for (let dy=-1;dy<=1;dy++) for (let dx=-1;dx<=1;dx++) {
            if (x+dx<0||x+dx>=width||y+dy<0||y+dy>=height) continue;
            const j=point+dx+dy*width;
            if (seen[j]||raster[4*j+3]<80) continue;
            seen[j]=1;
            next.push(j);
          }
        }
        largest=Math.max(largest,next.length);
        if (next.length>=4) count++;
        else isolated+=next.length;
      }
      return {count,largest,isolated};
    }
    const portraits=[{},presets.tall.values,presets.broad.values,
      {skull_width:.86,skull_height:1.18,forehead_width:1.14,forehead_height:.84,
       temple_width:.9,cheek_width:.88,jowls:1.35,jaw_width:.82}];
    const load=text=>doc.parseFromString(text,'image/svg+xml');
    let cases=0, outside=0, inAperture=0, apertureEdgePixels=0, maxIsolated=0;
    const failures=[], connected={};
    for (const [morph,input] of portraits.entries()) for (const eyes of openingList) for (const count of [0,1,2,3]) {
      const details={
        contours:count%2?{upper:250,lower:200}:{upper:50,lower:50},
        upper:{count:2,distance:100,length:100,curve:100,thickness:100,intensity:100},
        lower:{count:2,distance:100,length:100,curve:100,thickness:100,intensity:100},
        lashes:{count,spacing:count%2?100:0,length:15},
        shadows:{intensity:100,width:100,height:100,volume:100,puffWidth:100}
      };
      const tree=load(character(input,{eyes,details,iris,instance:'safety'}));
      const faceOutline=tree.querySelector('.head-shape > path').getAttribute('d');
      const {face:{envelopes,reference},shapes}=eyesFor(input,eyes);
      for (const [i,layer] of [...tree.querySelectorAll('[data-bio-details]')].entries()) {
        const {x,y}=envelopes[i], half=12;
        const wrap=markup=>`<svg xmlns="http://www.w3.org/2000/svg" viewBox="${x-half} ${y-half} ${half*2} ${half*2}">${markup}</svg>`;
        const aperture=shapes.length?`<path d="${shapes[i].path}"/>`:
          `<ellipse cx="${x}" cy="${y}" rx="${reference.width/2}" ry="${reference.height/2}"/>`;
        const aperturePixels=await raster(wrap(aperture),width,height);
        const facePixels=await raster(wrap(`<path d="${faceOutline}"/>`),width,height);
        const current=await raster(wrap(layer.outerHTML),width,height);
        for (let p=3;p<current.length;p+=4) {
          if (!facePixels[p]&&current[p]) outside++;
          if (aperturePixels[p]===255&&current[p]) {
            // Separate the independently antialiased clip edge from the
            // aperture interior, measured one device pixel inside the edge.
            const row=4*width;
            const neighbours=[p-row-4,p-row,p-row+4,p-4,p+4,p+row-4,p+row,p+row+4];
            if (neighbours.every(index=>aperturePixels[index]===255)) inAperture++;
            else apertureEdgePixels++;
          }
        }
        for (const mark of layer.querySelectorAll('[data-eye-detail]:not([data-lash-count])')) mark.remove();
        const contour=await raster(wrap(layer.outerHTML),width,height);
        const topology=components(contour);
        maxIsolated=Math.max(maxIsolated,topology.isolated);
        if (topology.count!==1||topology.largest<45) failures.push({morph,eyes,requestedCount:count,i,...topology});
        const key=layer.querySelector('[data-lash-count]').getAttribute('data-lash-count');
        connected[key]=(connected[key]??0)+1;
        cases++;
      }
    }
    const [left]=eyesFor({},'narrow').face.envelopes;
    const zoom=`${left.x-11} ${left.y-6} 22 12`;
    async function signature(details) {
      const output=character({},{eyes:'narrow',iris,details});
      await raster(frameOv(output,zoom),440,240,bgs[0]);
      return canvas.toDataURL();
    }
    const signatures=[];
    // Render sequentially to reuse the canvas safely.
    for (const count of [0,1,2,3]) signatures.push(await signature({lashes:{count,length:11}}));
    const variants=[];
    for (const shadows of [{intensity:0,volume:0},{intensity:90,volume:0},
      {intensity:0,volume:85},{intensity:90,volume:85}]) variants.push(await signature({shadows}));
    const subtle=[];
    for (const [frame,size,opts] of [...sizes,[zoom,440,{headOnly:true}]]) {
      const states=[54,55].map(intensity=>character({},{
        ...opts,eyes:'narrow',iris,details:{upper:{count:2,intensity,thickness:83}}
      }));
      const results=[];
      for (const state of states) results.push(await raster(frameOv(state,frame),size,size,bgs[0]));
      subtle.push(results[0].reduce((n,x,i)=>n+(x!==results[1][i]),0));
    }
    return {historic,historicMismatches,cases,outside,inAperture,apertureEdgePixels,maxIsolated,failures,connected,subtle,
      lashes:new Set(signatures).size,shadows:new Set(variants).size};
  },{base,baseline});
}

async function verifyWorkshop(page,name) {
  const q=selector=>page.locator(selector);
  const save=async ()=>{
    await q('#appearance-export').tap();
    return activeAppearance(await q('#appearance-json').inputValue());
  };
  async function load(document) {
    await q('#appearance-json').fill(JSON.stringify(document));
    await q('#appearance-import').tap();
    assert.equal(await q('#appearance-error').textContent(),'');
  }
  await q('#eye-preset').selectOption('narrow');
  if (await q('#eye-confirm').isVisible()) await q('#eye-confirm').tap();
  assert.equal(await q('#comparison').getAttribute('data-eyes'),'narrow');
  await q('#iris-active').tap();
  await q('#iris-hetero').selectOption('complete');
  await q('#iris-secondary').selectOption('violet');
  await q('#appearance-panel summary').tap();
  const initial=await snapshots(page);
  const v2=await save();
  assert.equal(v2.version,2);
  await q('#details-active').tap();
  assert.deepEqual(await snapshots(page,'[data-side=before]'),initial);
  await q('#details-before-mode').selectOption('historical');
  const allHistorical=await snapshots(page,'[data-side=before]');
  assert(allHistorical.every(entry=>!entry.text.includes('data-bio-iris')));
  await q('#details-before-mode').selectOption('same');
  assert.equal(await q('#detail-lashes-spacing').isDisabled(),true);
  await q('#detail-lashes-count').press('End');
  assert.equal(await q('#detail-lashes-count').getAttribute('aria-valuetext'),'3');
  assert.equal(await q('#detail-lashes-spacing').isDisabled(),false);
  await q('#detail-lashes-length').tap({position:{x:25,y:16}});
  const touched=await q('#detail-lashes-length').getAttribute('aria-valuetext');
  assert.notEqual(touched,'8 %');
  await q('#detail-lashes-length').press('End');
  assert.equal(await q('#details-zoom [data-lash-count="3"]').count(),2);
  await q('#detail-lashes-count').press('Home');
  assert.equal(await q('#detail-lashes-length').isDisabled(),true);
  await q('#detail-lashes-count').press('End');
  assert.equal(await q('#detail-lashes-length').getAttribute('aria-valuetext'),'15 %');
  await q('#detail-axes-shadows').locator('xpath=../summary').tap();
  assert.equal(await q('#detail-shadows-height').isDisabled(),true);
  await q('#detail-shadows-intensity').press('End');
  await q('#detail-shadows-volume').press('End');
  assert.equal(await q('#detail-shadows-height').isDisabled(),false);
  await q('#detail-axes-lower').locator('xpath=../summary').tap();
  await q('#detail-lower-count').press('End');
  assert.equal(await q('#detail-lower-curve').isDisabled(),false);
  const v3=await save();
  assert.equal(v3.version,3);
  for (const key of ['character','eyes','palette','historicalSelection','iris']) assert.deepEqual(v3[key],v2[key]);
  const details=await snapshots(page);
  assert(details.every((item,i)=>item.pixels!==initial[i].pixels));
  await page.reload();
  await q('#appearance-panel summary').tap();
  await load(v3);
  assert.deepEqual(await snapshots(page),details);
  assert.deepEqual(await save(),v3);
  await q('#details-active').tap();
  assert.deepEqual(await snapshots(page),initial);
  const latent=await save();
  assert.equal(latent.details.mode,'historical');
  assert.deepEqual(latent.details.latent,v3.details.requested);
  await q('#details-active').tap();
  assert.deepEqual(await snapshots(page),details);
  await q('#details-seed').fill('Microcosme ✦ détails');
  await q('#details-random').tap();
  const drawn=await save(), a=await snapshots(page);
  assert.equal(drawn.details.draw.seed,'Microcosme ✦ détails');
  for (const key of ['character','eyes','palette','historicalSelection','iris']) assert.deepEqual(drawn[key],v2[key]);
  await q('#details-random').tap();
  assert.deepEqual(await snapshots(page),a);
  await q('#details-reset').tap();
  assert.deepEqual(await snapshots(page),initial);
  assert.deepEqual(await save(),v2);
  await load(v3);
  const layouts=[];
  for (const [width,height] of [[820,1180],[1180,820],[390,844]]) {
    await page.setViewportSize({width,height});
    for (const background of ['light','dark']) {
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
  await q('#details').screenshot({path:path.join(output,name+'-atelier.png')});
  await q('#comparison').screenshot({path:path.join(output,name+'-trois-echelles.png')});
  await q('#details-zoom').evaluate(zoom=>{zoom.style.width='690px';zoom.querySelector('svg').style.height='380px';});
  await q('#details-zoom').screenshot({path:path.join(output,name+'-gros-plan.png')});
  return {cold:3,touched,layouts};
}

(async ()=>{
  await mkdir(output,{recursive:true});
  const server=process.env.BASE_URL?null:await localSite();
  const base=process.env.BASE_URL??`http://127.0.0.1:${server.address().port}/bio-yeux-01/`;
  const baseline=new URL(server?'baseline-render.mjs':'../bio-yeux-02/render.mjs',base).href;
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
        const {historic,historicMismatches,cases,outside,inAperture,lashes,shadows,subtle,failures}=raster;
        console.log('Raster '+name+' '+JSON.stringify(raster));
        assert.deepEqual([historic,historicMismatches,cases,outside,inAperture,lashes,shadows],[54,0,288,0,0,4,4]);
        assert.equal(failures.length,0,JSON.stringify(failures));
        assert(subtle.at(-1)>0);
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
