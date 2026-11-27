const activeAppearance = require('./active-appearance.cjs');
const assert = require('node:assert/strict');
const {createServer} = require('node:http');
const {execFileSync} = require('node:child_process');
const {readFile, mkdir, writeFile} = require('node:fs/promises');
const path = require('node:path');
const {chromium, webkit} = require('playwright');

const root = path.resolve(__dirname, '../..');
const output = process.env.ARTIFACT_DIR ?? '/tmp/microcosme-bio-cicatrices-01';
const baselineCommit = 'a7735b01ad127badfb4613ec45c148afe186d4bd';
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
    const [{character},{character:before},{scarCases,scarCards,scarViews,scarStudyPortrait},{eyePresets},{beardPresets}]=await Promise.all([
      import(new URL('render.mjs',base)),import(baseline),import(new URL('scars-study.mjs',base)),
      import(new URL('eyes.mjs',base)),import(new URL('beard.mjs',base))
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
    const rgba=(a,b,p)=>a[p]!==b[p]||a[p+1]!==b[p+1]||a[p+2]!==b[p+2]||a[p+3]!==b[p+3];
    const diffs=(a,b)=>a.reduce((sum,v,p)=>sum+(p%4===0&&rgba(a,b,p)?1:0),0);
    const sizes=[[294,300],[120,178],[70,70]];
    const openings=[null,...Object.keys(eyePresets)];
    const nose={length:102,tip:133,nostrils:180,lines:70};
    const mouth={width:125,upper:173,lower:168,thickness:81,intensity:82};
    const brows={arc:67,thickness:55};
    const beard=beardPresets.full.values;
    const marks=[{id:'m1',type:'freckles',seed:'Traits'}];
    let historic=0;
    for(const eyes of openings) for(const [i,[w,h]] of sizes.entries()) for(const bg of ['#fffdf8','#474c55']){
      const view=scarViews[i+1], input={style:'p5-041',arrangement:'G'};
      const options={...view[3],eyes,nose,mouth,brows,beard,marks,instance:'historique'};
      const a=before(input,options),b=character(input,{...options,scars:'historical'});
      if(a!==b||diffs(await raster(frame(a,view[2]),w,h,bg),await raster(frame(b,view[2]),w,h,bg))) throw Error('Régression historique.');
      historic++;
    }

    const cross=[{id:'s1',x:30,y:52,angle:88,length:80,width:37},{id:'s2',x:50,y:75,angle:90,length:71,width:40},
      {id:'s3',x:50,y:68,angle:0,length:62,width:48,irregularity:0},{id:'s4',mode:'patch',x:72,y:57,length:85,width:86}];
    const xml=new DOMParser();
    const tree=svg=>xml.parseFromString(svg,'image/svg+xml');
    const width=400,height=440,s=4,x0=30,y0=12;
    const wrap=inner=>`<svg xmlns="http://www.w3.org/2000/svg" viewBox="${x0} ${y0} ${width/s} ${height/s}">${inner}</svg>`;
    const paint=async markup=>raster(wrap(markup),width,height);
    let anatomical=0,outside=0,forbidden=0,painted=0;
    const removed={eyes:0,lips:0,nostrils:0};
    let brow=0,beforeEye=0,afterEye=0;
    for(const {face} of scarCases) for(const eyes of openings) for(const nasal of [null,nose]){
      const options={headOnly:true,eyes,mouth,nose:nasal,brows,scars:cross,instance:'réserves'};
      const doc=tree(character(face,options));
      const layer=doc.querySelector('[data-bio-scars]');
      const visible=await paint(layer.outerHTML);
      const raw=await paint(layer.querySelector('g[mask]').innerHTML);
      const outline=await paint('<path d="'+doc.querySelector('.head-shape > path').getAttribute('d')+'"/>');
      const masks=[...layer.querySelector('mask').children].slice(1);
      const organGroups={
        eyes:masks.slice(0,2),
        lips:masks.filter(node=>node.hasAttribute('data-mouth-part')),
        nostrils:masks.filter(node=>node.hasAttribute('data-nose-region'))
      };
      for(const [name,nodes] of Object.entries(organGroups)){
        const mask=await paint(nodes.map(n=>n.outerHTML).join(''));
        for(let p=3;p<mask.length;p+=4) if(mask[p]>=240&&raw[p]>=128){
          if(visible[p]>=64) forbidden++;
          if(visible[p]<=32) removed[name]++;
        }
      }
      for(let p=3;p<visible.length;p+=4) if(visible[p]>=64){
        painted++;
        if(outline[p]<64) outside++;
      }
      if(anatomical===0) {
        const eyebrow=await paint(doc.querySelector('[data-bio-brows]').outerHTML);
        const first=layer.querySelector('[data-scar-id=s1]');
        const stencil=layer.querySelector('defs').outerHTML;
        const one=await paint(stencil+'<g mask="'+layer.querySelector('g[mask]').getAttribute('mask')+'">'+first.outerHTML+'</g>');
        for(let p=3;p<one.length;p+=4) if(one[p]>=110){
          if(eyebrow[p]>=128) brow++;
          const y=y0+Math.floor((p-3)/4/width)/s;
          if(y<65) beforeEye++;
          if(y>77.5) afterEye++;
        }
      }
      anatomical++;
    }

    const set=[...cross,{id:'s5',x:47,y:26,length:56,angle:11,width:32},{id:'s6',x:31,y:83,length:34,angle:113}];
    const skin=(style,facial,scars)=>character({style},{headOnly:true,beard:facial,instance:'voiles',scars});
    const exposed=await paint(tree(skin('shaved',null,set)).firstElementChild.innerHTML);
    const bare=await paint(tree(skin('shaved',null,null)).firstElementChild.innerHTML);
    const scars=tree(skin('shaved',null,set)).querySelector('[data-bio-scars]').outerHTML;
    const hiding={};
    for(const [name,style,facial] of [['cheveux','p5-038',null],['barbe','shaved',beard]]){
      const shown=skin(style,facial,set), clean=skin(style,facial,null);
      if(tree(shown).querySelector('[data-bio-scars]').outerHTML!==scars) throw Error('Un masque a déplacé la cicatrice.');
      const a=await paint(tree(shown).firstElementChild.innerHTML),b=await paint(tree(clean).firstElementChild.innerHTML);
      let pixels=0;
      for(let p=0;p<a.length;p+=4) if(rgba(exposed,bare,p)&&!rgba(a,b,p)) pixels++;
      hiding[name]=pixels;
    }
    if(diffs(exposed,await paint(tree(skin('shaved',null,set)).firstElementChild.innerHTML))) throw Error('Restauration divergente.');

    const gallery=document.createElement('section');
    gallery.id='scars-proof';
    gallery.style.cssText='width:1600px;padding:24px;background:#f6f2e8;color:#322b22;font:16px system-ui;';
    gallery.innerHTML='<h2 style="font-size:29px;margin-top:0">Microcosme · Cicatrices faciales</h2>';
    const artist=[];
    for(const study of scarCases){
      const heading=document.createElement('h3');
      heading.textContent=study.label;
      gallery.append(heading);
      const group=document.createElement('div');
      group.style.cssText='display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px;';
      const measurement=[];
      for(const sample of scarCards(study)){
        const art=scarViews.map(v=>scarStudyPortrait(study,sample,v));
        const pixels=[];
        for(const [i,[w,h]] of sizes.entries()){
          const empty=await raster(scarStudyPortrait(study,{values:{intensity:0}},scarViews[i+1]),w,h,'#f7f1e5');
          pixels.push(diffs(empty,await raster(art[i+1],w,h,'#f7f1e5')));
        }
        measurement.push({name:sample.label,pixels});
        const card=document.createElement('article');
        card.style.cssText='padding:8px;background:#fffdf8;border-radius:8px';
        const figure=(markup,w,h,label)=>'<figure style="margin:0">'+markup.replace('<svg ',
          `<svg style="display:block;width:${w}px;height:${h}px;background:#f7f1e5;border-radius:6px" `)+
          '<figcaption style="font-size:12px">'+label+'</figcaption></figure>';
        card.innerHTML='<h4 style="margin:0 0 6px">'+sample.label+'</h4>'+figure(art[0],476,170,'Gros plan')+
          '<div style="display:flex;align-items:end;gap:7px;margin-top:8px">'+art.slice(1)
            .map((markup,i)=>figure(markup,...sizes[i],scarViews[i+1][1])).join('')+'</div>';
        group.append(card);
      }
      artist.push({portrait:study.label,measurement});
      gallery.append(group);
    }
    document.body.append(gallery);
    return {historic,anatomical,outside,forbidden,painted,removed,brow,beforeEye,afterEye,hiding,artist};
  },{base,baseline});
}

async function verifyWorkshop(page,name) {
  const q=selector=>page.locator(selector);
  await q('#marks-add').tap();
  await q('#appearance-panel summary').tap();
  const save=async()=>{
    await q('#appearance-export').tap();
    return activeAppearance(await q('#appearance-json').inputValue());
  };
  const load=async data=>{
    await q('#appearance-json').fill(JSON.stringify(data));
    await q('#appearance-import').tap();
    assert.equal(await q('#appearance-error').textContent(),'');
  };
  const old=await save(),clean=await snapshots(page);
  assert.equal(old.version,8);
  assert.equal(await q('#scars-preset option').count(),6);
  await q('#scars-preset').selectOption('sutured');
  await q('#scars-add').tap();
  assert.deepEqual(await snapshots(page,'[data-side=before]'),clean);
  assert(await q('#scars-sutures').isChecked());
  await q('#scars-mode').selectOption('patch');
  assert(await q('#scars-sutures').isDisabled());
  assert(await q('#scars-curve').isDisabled());
  await q('#scars-mode').selectOption('line');
  assert(await q('#scars-sutures').isChecked());
  const initial=await save();
  assert.equal(initial.version,9);
  assert.deepEqual(initial.marks,old.marks);
  await q('#scars-place').tap();
  const zoom=q('#scars-zoom svg');
  const spot=await zoom.evaluate(svg=>{
    const p=svg.createSVGPoint();
    p.x=89;
    p.y=84;
    const transformed=p.matrixTransform(svg.getScreenCTM());
    const b=svg.getBoundingClientRect();
    return {x:transformed.x-b.left,y:transformed.y-b.top};
  });
  await zoom.tap({position:spot});
  const moved=await save();
  assert.notEqual(moved.scars.requested[0].x,initial.scars.requested[0].x);
  // Return to the seeded draw and check deterministic replacement.
  await q('#scars-seed').fill('Cicatrice ✦ iPad');
  await q('#scars-seed').press('Tab');
  await q('#scars-draw').tap();
  const drawn=await save();
  await q('#scars-draw').tap();
  assert.deepEqual(await save(),drawn);
  await q('#scars-preset').selectOption('linear');
  await q('#scars-add').tap();
  await q('#scars-maturity').press('Home');
  await q('#scars-intensity').press('End');
  const complete=await save(), composed=await snapshots(page);
  assert.equal(complete.scars.requested.length,2);
  assert.equal(complete.scars.requested[1].maturity,0);
  assert.equal(complete.scars.requested[1].intensity,100);
  await q('#scars-show').tap();
  assert.deepEqual(await snapshots(page),clean);
  const latent=await save();
  assert.deepEqual(latent.scars.latent,complete.scars.requested);
  await page.reload();
  await q('#appearance-panel summary').tap();
  await load(latent);
  assert.deepEqual(await snapshots(page),clean);
  await q('#scars-show').tap();
  assert.deepEqual(await snapshots(page),composed);
  assert.deepEqual(await save(),complete);
  await q('#scars-remove').tap();
  assert.equal((await save()).scars.requested.length,1);
  await q('#scars-reset').tap();
  assert.deepEqual(await save(),old);
  await load(old);
  assert.deepEqual(await snapshots(page),clean);
  await load(complete);
  const layouts=[];
  for(const [width,height] of [[820,1180],[1180,820],[390,844]]){
    await page.setViewportSize({width,height});
    for(const background of ['light','dark']){
      await q('#background').selectOption(background);
      const dimensions=await q('[data-side=after] svg').evaluateAll(nodes=>nodes.map(node=>{
        const b=node.getBoundingClientRect();
        return [b.width,b.height];
      }));
      assert.deepEqual(dimensions.map(([,h])=>h),[300,178,70]);
      assert.equal(dimensions[2][0],70);
      assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth),width);
      layouts.push({width,height,background,dimensions});
    }
  }
  await page.setViewportSize({width:820,height:1180});
  await q('#scar-study-panel summary').press('Enter');
  await q('#scar-study-case').selectOption('3');
  assert.equal(await q('#scar-study svg').count(),40);
  await q('#scars').screenshot({path:path.join(output,name+'-atelier.png')});
  return {layouts,cold:true,tactile:true};
}

(async ()=>{
  await mkdir(output,{recursive:true});
  const server=process.env.BASE_URL?null:await localSite();
  const base=process.env.BASE_URL??`http://127.0.0.1:${server.address().port}/bio-yeux-01/`;
  const baseline=new URL(server?'baseline-render.mjs':'../bio-marques-01/render.mjs',base).href;
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
        assert.equal(raster.historic,54);
        assert.equal(raster.anatomical,72);
        assert.equal(raster.outside+raster.forbidden,0);
        assert(Object.values(raster.removed).every(p=>p>30));
        assert(raster.brow>10&&raster.beforeEye>20&&raster.afterEye>20);
        assert(raster.hiding.cheveux>20&&raster.hiding.barbe>20);
        for(const {measurement} of raster.artist) for(const {pixels} of measurement) assert(pixels.every(n=>n>0));
        const sheet=await page.locator('#scars-proof').evaluate(node=>{
          const html=node.outerHTML;
          node.remove();
          return html;
        });
        const workshop=await verifyWorkshop(page,name);
        const art=await browser.newPage({viewport:{width:1660,height:1000}});
        try{
          await art.setContent('<!doctype html><meta charset="utf-8">'+sheet);
          await art.locator('#scars-proof').screenshot({path:path.join(output,name+'-planche-cicatrices.png')});
        }finally{
          await art.close();
        }
        assert.deepEqual(errors,[]);
        const sample={name,version:browser.version(),raster,workshop,errors};
        console.log(JSON.stringify({name,version:sample.version,workshop}));
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
