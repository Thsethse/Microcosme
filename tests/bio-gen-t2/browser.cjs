const {chromium,webkit}=require('playwright');
const assert=require('node:assert/strict'),path=require('node:path'),fs=require('node:fs'),os=require('node:os');
(async()=>{
 for(const name of (process.env.T2_ENGINES||'chromium,webkit').split(',')){
  const browser=await ({chromium,webkit})[name].launch({headless:true});
  const page=await browser.newPage({viewport:{width:820,height:1180},hasTouch:true,deviceScaleFactor:2});const errors=[];page.on('pageerror',e=>errors.push(String(e)));
  await page.goto(process.env.T2_URL||'file://'+path.resolve('experiments/bio-gen-t2/index.html'));
  await page.waitForFunction(()=>document.querySelectorAll('.card').length===20);
  const results=await page.evaluate(()=>{
   const M=T2Model,G=T2Geometry,R=T2Render;
   const draw=(d,view,options={})=>{const c=document.createElement('canvas');R.render(c,G.project(G.derive(d),view),options);return c;};
   const bytes=(d,view)=>draw(d,view).toDataURL(),views=['front','profile','back','portrait'];
   const base=M.reference('pixels');Object.assign(base.params,{chestPresent:true,chestVolume:.6,beard:1,moustache:1,sideburns:1,pubicHair:1});
   const differences={};for(const s of M.schema){const lo=structuredClone(base),hi=structuredClone(base);
    if(s.type==='number'){lo.params[s.key]=s.min;hi.params[s.key]=s.max;}else if(s.type==='boolean'){lo.params[s.key]=false;hi.params[s.key]=true;}else{lo.params[s.key]=Object.keys(s.options)[0];hi.params[s.key]=Object.keys(s.options).at(-1);}
    differences[s.key]=views.filter(view=>bytes(lo,view)!==bytes(hi,view));if(!differences[s.key].length)throw Error('Paramètre invisible '+s.key);
   }
   for(const view of views)if(bytes(base,view)!==bytes(M.parse(M.serialize(base)),view))throw Error('Pixels non déterministes '+view);
   const headPixels=new Set();for(const headShape of Object.keys(M.schema[0].options)){const d=M.reference('shape');d.params.headShape=headShape;d.params.hairStyle='shaved';headPixels.add(bytes(d,'portrait'));}if(headPixels.size!==5)throw Error('Têtes non distinctes');
   function connected(d,view){const c=draw(d,view,{transparent:true,anatomyOnly:true}),w=c.width,h=c.height,a=c.getContext('2d').getImageData(0,0,w,h).data,seen=new Uint8Array(w*h);let total=0,start=-1;
    for(let i=0;i<w*h;i++)if(a[i*4+3]){total++;start=i;}
    const q=[start];seen[start]=1;for(let n=0;n<q.length;n++){const i=q[n],x=i%w,y=Math.floor(i/w);for(const [dx,dy]of [[1,0],[-1,0],[0,1],[0,-1]]){const xx=x+dx,yy=y+dy,j=yy*w+xx;if(xx>=0&&xx<w&&yy>=0&&yy<h&&!seen[j]&&a[j*4+3]){seen[j]=1;q.push(j);}}}
    if(q.length!==total)throw Error('Masque non connexe '+d.seed+' '+view+' '+q.length+'/'+total);
    for(let x=0;x<w;x++)if(a[x*4+3]||a[((h-1)*w+x)*4+3])throw Error('Corps coupé verticalement');
    for(let y=0;y<h;y++)if(a[(y*w)*4+3]||a[(y*w+w-1)*4+3])throw Error('Corps coupé horizontalement');
   }
   const profiles=Array.from({length:60},(_,i)=>M.generate('mask-'+i));
   for(const d of profiles)for(const view of ['front','back','profile'])connected(d,view);
   let hairstyles=0;for(const headShape of Object.keys(M.schema[0].options))for(const hairStyle of Object.keys(M.schema.find(s=>s.key==='hairStyle').options)){const d=M.reference('hair');Object.assign(d.params,{headShape,hairStyle});for(const view of views){const c=draw(d,view);if(c.width<1)throw Error('Rendu absent');}hairstyles++;}
   const data=Array.from({length:100},(_,i)=>M.generate('perf-'+i)),times=[];for(let run=0;run<5;run++){const start=performance.now();for(const d of data)draw(d,'front');times.push(performance.now()-start);}
   return {differences,connectedMasks:180,headShapes:headPixels.size,hairstyles,times,userAgent:navigator.userAgent};
  });
  await page.locator('.card').nth(3).tap();assert.equal(await page.locator('.card[aria-pressed=true]').count(),1);
  const before=await page.locator('#front').evaluate(c=>c.toDataURL());await page.locator('#p-headX').fill('1.25');await page.locator('#p-headX').dispatchEvent('input');assert.notEqual(await page.locator('#front').evaluate(c=>c.toDataURL()),before);
  await page.locator('#reference').tap();assert.ok((await page.locator('#proportions').textContent()).includes('4.00'));
  const reference=await page.locator('#description').textContent();await page.locator('#regenerate').click();assert.notEqual(await page.locator('#description').textContent(),reference);
  // Accordion and touch choices, then expose all groups for the full control sweep.
  await page.getByText('Cheveux',{exact:true}).first().click();await page.locator('#p-hairStyle').selectOption('curly');
  await page.evaluate(()=>document.querySelectorAll('details.group').forEach(d=>d.open=true));
  await page.locator('#p-lashes').check();await page.locator('#p-chestPresent').check();await page.locator('#p-anatomyMark').selectOption('lineTriangle');await page.locator('#p-pubicHair').fill('1');await page.locator('#p-pubicHair').dispatchEvent('input');
  await page.getByRole('button',{name:'Peau #673d2f',exact:true}).tap();
  const d=await page.locator('#description').textContent(),image=await page.locator('#portrait').evaluate(c=>c.toDataURL());
  await page.locator('#replay').click();assert.equal(await page.locator('#portrait').evaluate(c=>c.toDataURL()),image);
  const downloadPromise=page.waitForEvent('download');await page.locator('#export').click();const file=await downloadPromise;assert.deepEqual(JSON.parse(fs.readFileSync(await file.path(),'utf8')),JSON.parse(d));
  await page.locator('#regenerate').click();await page.locator('#import').setInputFiles({name:'t2.json',mimeType:'application/json',buffer:Buffer.from(d)});await page.waitForFunction(()=>document.querySelector('#status').textContent==='Profil T2 importé.');assert.equal(await page.locator('#portrait').evaluate(c=>c.toDataURL()),image);
  await page.locator('#import').setInputFiles({name:'bad.json',mimeType:'application/json',buffer:Buffer.from('{}')});await page.waitForFunction(()=>document.querySelector('#status').textContent.includes('requis'));assert.equal(await page.locator('#description').textContent(),d);
  await page.locator('#generate100').click();await page.waitForFunction(()=>document.querySelectorAll('.card').length===100&&document.querySelector('#timing').textContent.startsWith('100 personnages'));results.galleryTiming=await page.locator('#timing').textContent();
  for(const width of [390,820,1180]){await page.setViewportSize({width,height:1000});assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'Débordement '+width);}
  await page.locator('#generate20').click();await page.evaluate(()=>{document.querySelectorAll('details.group').forEach(d=>d.open=false);window.scrollTo(0,0);});await page.screenshot({path:path.join(os.tmpdir(),'bio-t2-'+name+'.png'),fullPage:true});
  assert.deepEqual(errors,[]);console.log(JSON.stringify({name,version:browser.version(),url:process.env.T2_URL||'file://',...results}));await browser.close();
 }
})().catch(e=>{console.error(e);process.exit(1)});
