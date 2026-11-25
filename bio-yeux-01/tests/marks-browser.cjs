const assert = require('node:assert/strict');
const {createServer} = require('node:http');
const {execFileSync} = require('node:child_process');
const {readFile, mkdir, writeFile} = require('node:fs/promises');
const path = require('node:path');
const {chromium, webkit} = require('playwright');

const root = path.resolve(__dirname, '../..');
const output = process.env.ARTIFACT_DIR ?? '/tmp/microcosme-bio-marques-01';
const baselineCommit = '46b7f53330462d23593e6a2577e3cb086160df11';
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
    const [{character},{character:legacy},{freckleCases,freckleDensities,freckleViews,studyPortrait},
      {marksFor},{eyePresets},{beardPresets}]=await Promise.all([
      import(new URL('render.mjs',base)),import(baseline),import(new URL('marks-study.mjs',base)),
      import(new URL('marks.mjs',base)),import(new URL('eyes.mjs',base)),import(new URL('beard.mjs',base))
    ]);
    const canvas=document.createElement('canvas'), ctx=canvas.getContext('2d',{willReadFrequently:true});
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
    const frame=(svg,view)=>svg.replace(/viewBox="[^"]*"/,`viewBox="${view}"`);
    const sizes=[[294,300],[120,178],[70,70]];
    const rgbPixel=(a,b,p)=>a[p]!==b[p]||a[p+1]!==b[p+1]||a[p+2]!==b[p+2]||a[p+3]!==b[p+3];
    const differences=(a,b)=>a.reduce((n,v,p)=>n+(p%4===0&&rgbPixel(a,b,p)?1:0),0);
    const nose={length:144,bridge:178,wings:154,tip:170,nostrils:180,tilt:100,lines:90,fills:90};
    const mouth={width:130,upper:172,lower:175,thickness:87,intensity:77};
    const beard=beardPresets.full.values;
    const openings=[null,...Object.keys(eyePresets)];
    let historical=0;
    for(const eyes of openings) for(const [i,[width,height]] of sizes.entries()) for(const bg of ['#fffdf8','#474c55']){
      const view=freckleViews[i+1];
      const input={style:'p5-041',arrangement:'D'};
      const config={...view[3],eyes,nose,mouth,beard,brows:{arc:58},iris:{pupilSize:70},instance:'history'};
      const a=legacy(input,config),b=character(input,{...config,marks:'historical'});
      if(a!==b||differences(await raster(frame(a,view[2]),width,height,bg),await raster(frame(b,view[2]),width,height,bg))) {
        throw Error('Régression historique.');
      }
      historical++;
    }

    // Actual paint is checked against the old contour and the protected shapes.
    const wrap=inner=>`<svg xmlns="http://www.w3.org/2000/svg" viewBox="34 10 92 114">${inner}</svg>`;
    const parser=new DOMParser();
    const parse=svg=>parser.parseFromString(svg,'image/svg+xml');
    const rect=({left,right,top,bottom},pad)=>`<rect x="${left+pad}" y="${top+pad}" width="${right-left-2*pad}" height="${bottom-top-2*pad}"/>`;
    const groups=['forehead','temples','nose','cheeks','perioral','jaw'];
    const stress=[{id:'m1',type:'freckles',density:100,size:100,sizeVariation:100,zones:groups,extent:0},
      {id:'m2',type:'birth',size:100,shape:'diffuse',elongation:100,x:11,y:75},
      {id:'m3',type:'pigment',size:100,shape:'irregular',elongation:100,x:84,y:74}];
    let anatomical=0,outside=0,organ=0,painted=0;
    for(const {face} of freckleCases) for(const eyes of openings) for(const nasal of [null,nose]){
      const variants={headOnly:true,eyes,nose:nasal,mouth,marks:stress,instance:'limits'};
      const doc=parse(character(face,variants));
      const root=doc.querySelector('[data-bio-marks]');
      if(!root) throw Error('Cas sans marques.');
      const markPixels=await raster(wrap(root.outerHTML),276,342);
      const facePath=doc.querySelector('.head-shape > path').getAttribute('d');
      const cutaneous=await raster(wrap(`<path d="${facePath}"/>`),276,342);
      const limits=marksFor(face,eyes,stress,variants).frame;
      const reserves=limits.eyes.map(e=>rect(e,.53)).join('')+rect(limits.lips,.16)+limits.nostrils.map(e=>rect(e,.12)).join('');
      const anatomy=await raster(wrap(reserves),276,342);
      for(let p=3;p<markPixels.length;p+=4){
        if(markPixels[p]<64) continue;
        painted++;
        if(cutaneous[p]<32) outside++;
        if(anatomy[p]>=96) organ++;
      }
      anatomical++;
    }

    const freckles=[{id:'m1',type:'freckles',density:100,zones:groups},
      {id:'m2',type:'pigmentGroup',density:100,zones:groups},
      {id:'m3',type:'mole',x:30,y:66},{id:'m4',type:'mole',x:48,y:21}];
    const paint=async(style,haired,marks)=>await raster(frame(character({style},{headOnly:true,beard:haired,marks}),
      '34 12 92 111'),368,444);
    const revealed=await paint('shaved',null,freckles);
    const plain=await paint('shaved',null,null);
    const firstId=parse(character({style:'shaved'},{headOnly:true,marks:freckles})).querySelector('[data-bio-marks]').outerHTML;
    const hides={};
    for(const [name,style,facial] of [['cheveux','p5-038',null],['barbe','shaved',beard]]){
      const yes=await paint(style,facial,freckles),no=await paint(style,facial,null);
      let hidden=0;
      for(let p=0;p<revealed.length;p+=4) if(rgbPixel(revealed,plain,p)&&!rgbPixel(yes,no,p)) hidden++;
      const doc=parse(character({style},{headOnly:true,beard:facial,marks:freckles}));
      if(doc.querySelector('[data-bio-marks]').outerHTML!==firstId) throw Error('Le masque déplace les marques.');
      hides[name]=hidden;
    }
    if(differences(revealed,await paint('shaved',null,freckles))) throw Error('Restauration divergente.');

    const arts=[];
    const sheet=document.createElement('section');
    sheet.id='marks-proof';
    sheet.style.cssText='width:1610px;max-width:none;padding:24px;background:#f6f2e8;color:#382e21;font:16px system-ui';
    sheet.innerHTML='<h2 style="font-size:28px;margin:0 0 20px">Microcosme · Taches de rousseur</h2>';
    for(const study of freckleCases){
      const section=document.createElement('section');
      section.style.cssText='margin-bottom:20px';
      section.innerHTML='<h3 style="font-size:20px;margin-bottom:8px">'+study.label+'</h3>';
      const row=document.createElement('div');
      row.style.cssText='display:grid;grid-template-columns:repeat(3,1fr);gap:8px';
      const stats=[];
      for(const [density,label] of freckleDensities){
        const card=document.createElement('article');
        card.style.cssText='padding:8px;background:#fffdf8;border-radius:8px';
        const views=freckleViews.map(view=>studyPortrait(study,density,view));
        const measured=[];
        for(const [i,[w,h]] of sizes.entries()){
          const zero=await raster(studyPortrait(study,0,freckleViews[i+1]),w,h,'#f7f1e5');
          measured.push(differences(zero,await raster(views[i+1],w,h,'#f7f1e5')));
        }
        stats.push(measured);
        const figure=(markup,width,height,name)=>'<figure style="margin:0">'+
          markup.replace('<svg ',`<svg style="display:block;width:${width}px;height:${height}px;background:#f7f1e5;border-radius:6px" `)+
          '<figcaption style="font-size:12px;margin-top:3px">'+name+'</figcaption></figure>';
        card.innerHTML='<h4 style="font-size:16px;margin:0 0 6px">Densité '+label.toLowerCase()+'</h4>'+
          figure(views[0],480,168,'Gros plan')+'<div style="display:flex;gap:7px;margin-top:6px;align-items:end">'+
          views.slice(1).map((view,i)=>figure(view,...sizes[i],freckleViews[i+1][1])).join('')+'</div>';
        row.append(card);
      }
      arts.push({case:study.label,pixels:stats});
      section.append(row);
      sheet.append(section);
    }
    document.body.append(sheet);
    return {historical,anatomical,outside,organ,painted,hides,arts};
  },{base,baseline});
}

async function verifyWorkshop(page,name) {
  const q=selector=>page.locator(selector);
  await q('#beard-active').tap();
  await q('#appearance-panel summary').tap();
  const save=async ()=>{
    await q('#appearance-export').tap();
    return JSON.parse(await q('#appearance-json').inputValue());
  };
  const load=async data=>{
    await q('#appearance-json').fill(JSON.stringify(data));
    await q('#appearance-import').tap();
    assert.equal(await q('#appearance-error').textContent(),'');
  };
  const clean=await snapshots(page);
  const old=await save();
  assert.equal(old.version,7);
  await q('#marks-type').selectOption('freckles');
  await q('#marks-add').tap();
  assert.deepEqual(await snapshots(page,'[data-side=before]'),clean);
  await q('#marks-seed').fill('Recette ✦ iPad');
  await q('#marks-seed').press('Tab');
  const added=await save();
  assert.equal(added.version,8);
  assert.equal(added.marks.requested[0].seed,'Recette ✦ iPad');
  await q('#marks-density').press('ArrowRight');
  const growth=await save();
  assert.equal(growth.marks.effective[0].visible,added.marks.effective[0].visible+1);
  assert.deepEqual(growth.marks.effective[0].sites.slice(0,added.marks.effective[0].sites.length),added.marks.effective[0].sites);
  assert.deepEqual(growth.facialHair,old.facialHair);
  await q('#marks-type').selectOption('mole');
  await q('#marks-add').tap();
  assert(await q('#marks-angle').isDisabled());
  await q('#marks-shape').selectOption('oval');
  await q('#marks-angle').press('End');
  const beforePosition=await save();
  assert.equal(beforePosition.marks.requested[1].angle,179);
  await q('#marks-place').tap();
  const zoom=q('#marks-zoom svg');
  const spot=await zoom.evaluate(svg=>{
    const p=svg.createSVGPoint();
    p.x=70;
    p.y=54;
    const translated=p.matrixTransform(svg.getScreenCTM());
    const b=svg.getBoundingClientRect();
    return {x:translated.x-b.left,y:translated.y-b.top};
  });
  await zoom.tap({position:spot});
  const composed=await save();
  assert.notEqual(beforePosition.marks.requested[1].y,composed.marks.requested[1].y);
  const final=await snapshots(page);
  await q('#marks-show').tap();
  assert.deepEqual(await snapshots(page),clean);
  const latent=await save();
  assert.deepEqual(latent.marks.latent,composed.marks.requested);
  await page.reload();
  await q('#appearance-panel summary').tap();
  await load(latent);
  assert.deepEqual(await snapshots(page),clean);
  await q('#marks-show').tap();
  assert.deepEqual(await snapshots(page),final);
  assert.deepEqual(await save(),composed);
  await q('#marks-remove').tap();
  assert.equal((await save()).marks.requested.length,1);
  await q('#marks-reset').tap();
  assert.deepEqual(await save(),old);
  await load(old);
  assert.deepEqual(await snapshots(page),clean);
  await load(composed);
  const layouts=[];
  for(const [width,height] of [[820,1180],[1180,820],[390,844]]){
    await page.setViewportSize({width,height});
    for(const background of ['light','dark']){
      await q('#background').selectOption(background);
      const dimensions=await q('[data-side=after] svg').evaluateAll(nodes=>nodes.map(node=>{
        const box=node.getBoundingClientRect();
        return [box.width,box.height];
      }));
      assert.deepEqual(dimensions.map(([,h])=>h),[300,178,70]);
      assert.equal(dimensions[2][0],70);
      assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth),width);
      layouts.push({width,height,background,dimensions});
    }
  }
  await page.setViewportSize({width:820,height:1180});
  await q('#freckle-case').selectOption('3');
  assert.equal(await q('#freckle-study svg').count(),12);
  await q('#marks').screenshot({path:path.join(output,name+'-atelier.png')});
  return {layouts,cold:true,tactile:true};
}

(async ()=>{
  await mkdir(output,{recursive:true});
  const server=process.env.BASE_URL?null:await localSite();
  const base=process.env.BASE_URL??`http://127.0.0.1:${server.address().port}/bio-yeux-01/`;
  const baseline=new URL(server?'baseline-render.mjs':'../bio-pilosite-01/render.mjs',base).href;
  const proof={base,engines:[]};
  try{
    for(const name of (process.env.AUDIT_ENGINES??'chromium,webkit').split(',')){
      const browser=await engines[name].launch();
      try{
        const page=await browser.newPage({viewport:{width:820,height:1180},hasTouch:true,isMobile:true,
          deviceScaleFactor:1,ignoreHTTPSErrors:process.env.PAGES_TEST_PROXY==='1'});
        const errors=[];
        page.on('pageerror',error=>errors.push(error.message));
        page.on('response',response=>{if(response.status()>=400) errors.push(response.status()+' '+response.url());});
        assert.equal((await page.goto(base)).status(),200);
        await page.locator('#comparison svg').first().waitFor();
        const raster=await verifyRaster(page,base,baseline);
        console.log('Raster '+name,JSON.stringify(raster));
        assert.equal(raster.historical,54);
        assert.equal(raster.anatomical,72);
        assert.equal(raster.outside+raster.organ,0);
        assert(raster.hides.cheveux>15&&raster.hides.barbe>15);
        for(const study of raster.arts) for(const sizes of study.pixels) assert(sizes.every(changed=>changed>=3));
        const sheet=await page.locator('#marks-proof').evaluate(node=>{
          const markup=node.outerHTML;
          node.remove();
          return markup;
        });
        const workshop=await verifyWorkshop(page,name);
        const art=await browser.newPage({viewport:{width:1660,height:1100}});
        try{
          await art.setContent('<!doctype html><meta charset="utf-8">'+sheet);
          await art.locator('#marks-proof').screenshot({path:path.join(output,name+'-planche-rousseur.png')});
        }finally{
          await art.close();
        }
        assert.deepEqual(errors,[]);
        const sample={name,version:browser.version(),raster,workshop,errors};
        console.log(JSON.stringify(sample));
        proof.engines.push(sample);
      }finally{
        await browser.close();
      }
    }
    await writeFile(path.join(output,'rapport.json'),JSON.stringify(proof,null,2)+'\n');
  }finally{
    server?.close();
  }
})().catch(error=>{console.error(error);process.exitCode=1;});
