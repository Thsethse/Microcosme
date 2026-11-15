const {chromium,webkit}=require('playwright'),assert=require('node:assert/strict'),path=require('node:path');
(async()=>{for(const name of (process.env.T3_ENGINES||'chromium,webkit').split(',')){
 const browser=await ({chromium,webkit})[name].launch(),page=await browser.newPage({viewport:{width:820,height:1180},hasTouch:true,deviceScaleFactor:2}),errors=[],badResponses=[];
 page.on('pageerror',e=>errors.push(String(e)));page.on('response',r=>{if(r.status()>=400)badResponses.push(r.status()+' '+r.url());});
 await page.goto(process.env.T3_URL||'file://'+path.resolve('experiments/bio-struct-t3-a/index.html'));await page.waitForFunction(()=>document.querySelector('#description').textContent.includes('microcosme.bio-struct-t3-a'));
 const result=await page.evaluate(()=>{
  const C=CanonicalBody,B=BodyProjection,R=T3Render,P=BiologicalProfile,H=ShapeGrammar;
  const make=(category,fn,parameters={},choices={})=>C.generateBody('r2-pixels',{category,reproductiveFunction:fn},parameters,choices);
  const pixels=(body,view,without=()=>false,options={})=>{const scene=B.projectBody(body,view);scene.commands=scene.commands.filter(c=>!without(c));const canvas=document.createElement('canvas');R.render(canvas,scene,{transparent:true,...options});return canvas.getContext('2d').getImageData(0,0,canvas.width,canvas.height).data;};
  function changed(a,b){let n=0;for(let i=0;i<a.length;i+=4)if(a[i]!==b[i]||a[i+1]!==b[i+1]||a[i+2]!==b[i+2]||a[i+3]!==b[i+3])n++;return n;}
  const evidence=[];
  for(const [category,fn]of [['M','male'],['F','female'],['T','male'],['T','female']]){
   const b=make(category,fn),counts={category,fn,genital:{},breast:{}};
   for(const view of ['front','profile','back']){
    const normal=pixels(b,view);counts.genital[view]=changed(normal,pixels(b,view,c=>c.role==='anatomical-marker'));counts.breast[view]=changed(normal,pixels(b,view,c=>c.role==='breast'));
    const shouldGenital=view==='front'||(view==='profile'&&fn==='male');if((counts.genital[view]>0)!==shouldGenital)throw Error('Visibilité génitale '+category+' '+fn+' '+view+' '+counts.genital[view]);
    if(category!=='M'&&(counts.breast[view]>0)!==(view!=='back'))throw Error('Visibilité poitrine '+category+' '+view+' '+counts.breast[view]);
    if(view==='back')for(const options of [{volumeEdges:true},{skeleton:true,joints:true,anchors:true}])if(changed(pixels(b,view,()=>false,options),pixels(b,view,c=>c.role==='breast'||c.role==='anatomical-marker',options)))throw Error('Attribut de dos en diagnostic');
   }evidence.push(counts);
  }
  function connected(body,view){const a=pixels(body,view),w=240,h=360,seen=new Uint8Array(w*h);let total=0,start=-1;for(let i=0;i<w*h;i++)if(a[i*4+3]){total++;start=i;}const q=[start];seen[start]=1;
   for(let n=0;n<q.length;n++){const i=q[n],x=i%w,y=Math.floor(i/w);for(const [dx,dy]of [[1,0],[-1,0],[0,1],[0,-1]]){const xx=x+dx,yy=y+dy,j=yy*w+xx;if(xx>=0&&xx<w&&yy>=0&&yy<h&&!seen[j]&&a[j*4+3]){seen[j]=1;q.push(j);}}}if(total!==q.length)throw Error('Silhouette déconnectée '+body.biologicalProfile.category+' '+body.biologicalProfile.reproductiveFunction+' '+JSON.stringify(body.geometryChoices)+' '+view+' '+q.length+'/'+total);
   for(let x=0;x<w;x++)if(a[x*4+3]||a[((h-1)*w+x)*4+3])throw Error('Coupe verticale');for(let y=0;y<h;y++)if(a[(y*w)*4+3]||a[(y*w+w-1)*4+3])throw Error('Coupe horizontale');
  }
  let masks=0;
  for(const [category,fn]of [['M','male'],['F','female'],['T','male'],['T','female']])for(const torsoShape of Object.keys(H.schema[1].options))for(const pelvisShape of Object.keys(H.schema[2].options))for(const k of [0,1]){
   const parameters=Object.fromEntries(P.schema.map((s,j)=>[s.key,(j+k)%2?s.min:s.max]));const b=make(category,fn,parameters,{headShape:'diamond',torsoShape,pelvisShape,limbShape:'rounded'});
   for(const view of ['front','profile','back']){connected(b,view);masks++;}
  }
  return {visibilityPixels:evidence,connectedMasks:masks,userAgent:navigator.userAgent};
 });
 await page.locator('[data-category=T]').tap();await page.locator('#p-breastVolume').fill('0.8');await page.locator('#p-breastVolume').dispatchEvent('input');
 await page.locator('#choice-headShape').selectOption('diamond');await page.locator('#choice-torsoShape').selectOption('hourglass');
 const before=JSON.parse(await page.locator('#inspection').textContent()),chestBefore=await page.locator('#detail-front').evaluate(c=>Array.from(c.getContext('2d').getImageData(0,0,c.width,230).data)),backBefore=await page.locator('#detail-back').evaluate(c=>c.toDataURL());
 await page.locator('#thirdFunction').selectOption('female');const after=JSON.parse(await page.locator('#inspection').textContent());assert.deepEqual(before.skeleton,after.skeleton);assert.deepEqual(before.volumes.filter(v=>v.id!=='sexual_marker'),after.volumes.filter(v=>v.id!=='sexual_marker'));assert.deepEqual(await page.locator('#detail-front').evaluate(c=>Array.from(c.getContext('2d').getImageData(0,0,c.width,230).data)),chestBefore);assert.equal(await page.locator('#detail-back').evaluate(c=>c.toDataURL()),backBefore);
 for(const imported of require('./fixtures/r1-v2-exports.json')){
  await page.locator('#import').setInputFiles({name:'r1-v2.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(imported))});await page.waitForFunction(()=>document.querySelector('#status').textContent==='Corps T3-A importé.');assert.deepEqual(JSON.parse(await page.locator('#description').textContent()),imported);
 }
 await page.locator('#resetAll').tap();for(const view of ['front','profile','back'])await page.locator('#view').selectOption(view);for(const width of [390,820,1180]){await page.setViewportSize({width,height:1000});assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));}
 assert.deepEqual(errors,[]);assert.deepEqual(badResponses,[]);console.log(JSON.stringify({name,version:browser.version(),url:process.env.T3_URL||'file://',...result}));await browser.close();
}})().catch(e=>{console.error(e);process.exit(1)});
