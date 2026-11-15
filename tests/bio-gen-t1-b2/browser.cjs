const {chromium,webkit}=require('playwright');
const assert=require('node:assert/strict'),path=require('node:path'),fs=require('node:fs'),os=require('node:os');
(async()=>{
 for(const name of (process.env.BIO_ENGINES||'chromium,webkit').split(',')){
  const browser=await ({chromium,webkit})[name].launch({headless:true});
  const page=await browser.newPage({viewport:{width:820,height:1180},hasTouch:true,deviceScaleFactor:2});const errors=[];
  page.on('pageerror',e=>errors.push(String(e)));
  await page.goto(process.env.BIO_B2_URL||'file://'+path.resolve('experiments/bio-gen-t1-b2/index.html'));
  await page.waitForFunction(()=>document.querySelectorAll('.card').length===20);
  const result=await page.evaluate(()=>{
   const M=BioMorphB2,R=BioRenderB2,modes=['portrait','front','back','profile'];
   const draw=(d,mode,options={})=>{const c=document.createElement('canvas');R.render(c,M.derive(d),mode,options);return c;};
   const bytes=(d,mode)=>draw(d,mode).toDataURL();
   const base=M.validate({...M.generate('pixel-b2'),params:{...M.generate('pixel-b2').params,density:.9,hairPotential:1,beard:.8,bodyHair:.8,grooming:0}});
   const differences={};
   for(const s of M.schema){const lo={...base,params:{...base.params,[s.key]:s.min}},hi={...base,params:{...base.params,[s.key]:s.max}};
    differences[s.key]=modes.filter(mode=>bytes(lo,mode)!==bytes(hi,mode));if(!differences[s.key].length)throw Error('Invisible '+s.key);}
   for(const mode of modes){if(bytes(base,mode)!==bytes(M.parse(M.serialize(base)),mode))throw Error('Roundtrip '+mode);}
   // Connected anatomical mask, without hair, for corners and combinations.
   function connected(d,mode){const c=draw(d,mode,{transparent:true,anatomyOnly:true}),w=c.width,h=c.height,data=c.getContext('2d').getImageData(0,0,w,h).data;
    let total=0,start=-1;const seen=new Uint8Array(w*h);
    for(let i=0;i<w*h;i++)if(data[i*4+3]){total++;start=i;}
    const queue=[start];seen[start]=1;
    for(let n=0;n<queue.length;n++){const i=queue[n],x=i%w,y=Math.floor(i/w);for(const [dx,dy]of [[1,0],[-1,0],[0,1],[0,-1]]){const xx=x+dx,yy=y+dy,j=yy*w+xx;if(xx>=0&&xx<w&&yy>=0&&yy<h&&!seen[j]&&data[j*4+3]){seen[j]=1;queue.push(j);}}}
    if(queue.length!==total)throw Error('Disconnected '+mode+' '+d.seed+' '+queue.length+'/'+total);
    for(let x=0;x<w;x++)if(data[x*4+3]||data[((h-1)*w+x)*4+3])throw Error('Clipped vertical '+mode);
    return total;
   }
   const extremes=[];for(let i=0;i<60;i++){const d=M.generate('extreme-'+i);if(i<4)for(const s of M.schema)d.params[s.key]=i%2?s.min:s.max;extremes.push(d);}
   for(const d of extremes)for(const mode of ['front','back','profile'])connected(d,mode);
   // Absence of B1 fabric pigment in every B2 projection.
   for(const mode of modes){const c=draw(base,mode),data=c.getContext('2d').getImageData(0,0,c.width,c.height).data;for(let i=0;i<data.length;i+=4)if(data[i]===71&&data[i+1]===121&&data[i+2]===125)throw Error('Clothing color');}
   const starts=performance.now(),data=Array.from({length:100},(_,i)=>M.generate('perf-b2-'+i)),generation=performance.now()-starts,times=[];
   for(let run=0;run<5;run++){const t=performance.now();for(const d of data)draw(d,'front');times.push(performance.now()-t);}
   return {differences,generation,times,userAgent:navigator.userAgent,connectedMasks:extremes.length*3};
  });
  await page.locator('#examples').selectOption('1');await page.locator('#applyExample').click();
  let before=await page.locator('#portrait').evaluate(c=>c.toDataURL());
  await page.locator('#p-hairSides').fill('0');await page.locator('#p-hairSides').dispatchEvent('input');
  assert.notEqual(await page.locator('#portrait').evaluate(c=>c.toDataURL()),before);
  const description=await page.locator('#description').textContent();before=await page.locator('#portrait').evaluate(c=>c.toDataURL());
  await page.locator('#replay').click();assert.equal(await page.locator('#portrait').evaluate(c=>c.toDataURL()),before);
  await page.locator('#import').setInputFiles({name:'b2.json',mimeType:'application/json',buffer:Buffer.from(description)});
  await page.waitForFunction(()=>document.querySelector('#status').textContent.startsWith('Description importée'));
  assert.equal(await page.locator('#portrait').evaluate(c=>c.toDataURL()),before);
  const downloadPromise=page.waitForEvent('download');await page.locator('#export').click();const download=await downloadPromise;
  assert.deepEqual(JSON.parse(fs.readFileSync(await download.path(),'utf8')),JSON.parse(description));
  const v1=require('../../experiments/bio-gen-t1/model').generate('v1-import');
  await page.locator('#import').setInputFiles({name:'v1.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(v1))});
  await page.waitForFunction(()=>JSON.parse(document.querySelector('#description').textContent).seed==='v1-import');
  let imported=JSON.parse(await page.locator('#description').textContent());assert.equal(imported.version,2);for(const [k,v]of Object.entries(v1.params))assert.equal(imported.params[k],v);
  const valid=await page.locator('#description').textContent();
  await page.locator('#import').setInputFiles({name:'bad.json',mimeType:'application/json',buffer:Buffer.from('{}')});await page.waitForFunction(()=>document.querySelector('#status').textContent.includes('requises'));assert.equal(await page.locator('#description').textContent(),valid);
  for(let i=0;i<8;i++){await page.locator('#examples').selectOption(String(i));await page.locator('#applyExample').click();}
  await page.screenshot({path:path.join(os.tmpdir(),'bio-b2-'+name+'.png'),fullPage:true});
  await page.locator('#hundred').click();await page.waitForFunction(()=>document.querySelectorAll('.card').length===100&&document.querySelector('#timing').textContent.startsWith('100 individus'));
  result.galleryTiming=await page.locator('#timing').textContent();
  await page.locator('.card').nth(5).tap();assert.equal(await page.locator('.card[aria-pressed=true]').count(),1);
  for(const width of [390,820,1180]){await page.setViewportSize({width,height:900});assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'overflow '+width);}
  assert.deepEqual(errors,[]);console.log(JSON.stringify({name,version:browser.version(),...result}));await browser.close();
 }
})().catch(e=>{console.error(e);process.exit(1)});
