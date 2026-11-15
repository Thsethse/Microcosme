// Screenshots of the actual controls/portraits; no artistic reference is generated or substituted.
const {chromium}=require('playwright'),fs=require('node:fs'),path=require('node:path');
(async()=>{
 const [before,after,directory='docs/bio-struct-t3-b1/implementation/captures']=process.argv.slice(2);if(!before||!after)throw Error('Usage: node capture.cjs R3_URL B1_URL [DIRECTORY]');fs.mkdirSync(directory,{recursive:true});
 const browser=await chromium.launch(),page=await browser.newPage({viewport:{width:1180,height:1100},deviceScaleFactor:1});
 for(const [state,url]of [['avant',before],['apres',after]]){await page.goto(url);await page.waitForFunction(()=>document.querySelector('#description').textContent.includes('microcosme.bio-struct-t3-a'));await page.locator('#resetAll').click();for(const fn of ['male','female']){await page.locator('#thirdFunction').selectOption(fn);for(const view of ['front','profile','back']){await page.locator('#view').selectOption(view);await page.locator('.references').screenshot({path:path.join(directory,`${state}-${fn}-${view}.png`)});}}}
 async function setFace(id,value){const control=page.locator('#f-'+id);if(await control.evaluate(n=>n.tagName==='SELECT'))await control.selectOption(value);else{await control.fill(String(value));await control.dispatchEvent('input');}}
 async function sheet(name,title,options){
  await page.locator('#resetAll').click();await page.locator('[data-category=T]').click();await setFace('eyeSize',1.35);const tiles=[];
  for(const option of options){if(option.category){await page.locator('[data-category='+option.category+']').click();await setFace('eyeSize',1.35);}if(option.head)await page.locator('#choice-headShape').selectOption(option.head);for(const [key,value]of Object.entries(option.face||{}))await setFace(key,value);tiles.push({title:option.title,front:await page.locator('#portrait-front').evaluate(c=>c.toDataURL()),profile:await page.locator('#portrait-profile').evaluate(c=>c.toDataURL())});}
  await page.evaluate(({title,tiles})=>{document.getElementById('capture-catalogue')?.remove();const section=document.createElement('section');section.id='capture-catalogue';section.style.cssText='padding:16px;background:#302637;width:1020px;color:#efe2c9;';const heading=document.createElement('h2');heading.textContent=title;section.append(heading);const grid=document.createElement('div');grid.style.cssText='display:grid;grid-template-columns:repeat(3,1fr);gap:14px;';for(const tile of tiles){const card=document.createElement('div');card.style.cssText='padding:12px;border:1px solid #6e5c77;text-align:center;';const label=document.createElement('p');label.textContent=tile.title;card.append(label);for(const key of ['front','profile']){const img=document.createElement('img');img.src=tile[key];img.style.cssText='width:130px;height:130px;image-rendering:pixelated;';card.append(img);}grid.append(card);}section.append(grid);document.body.append(section);},{title,tiles});
  await page.locator('#capture-catalogue img').evaluateAll(images=>Promise.all(images.map(i=>i.decode())));await page.locator('#capture-catalogue').screenshot({path:path.join(directory,name+'.png')});await page.locator('#capture-catalogue').evaluate(n=>n.remove());
 }
 const catalogues=await page.evaluate(()=>({heads:FaceSettings.heads,eyes:FaceSettings.eyes,brows:FaceSettings.brows,mouths:FaceSettings.mouths}));
 await sheet('catalogue-tetes','Quatre têtes · face / profil',Object.entries(catalogues.heads).map(([head,title])=>({head,title})));
 await sheet('catalogue-yeux','Yeux proposés · face / profil',Object.entries(catalogues.eyes).map(([eyeShape,title])=>({title,face:{eyeShape}})));
 await sheet('catalogue-sourcils','Sourcils proposés · face / profil',Object.entries(catalogues.brows).map(([browShape,title])=>({title,face:{browShape}})));
 await sheet('catalogue-bouches','Cinq familles de bouche · face / profil',Object.entries(catalogues.mouths).map(([mouthShape,title])=>({title,face:{mouthShape}})));
 await sheet('catalogue-couleurs','Couleurs indépendantes · même géométrie',[
  {title:'Iris bleus · sourcils bruns · lèvres rosées',face:{irisColor:'#377ac1',browColor:'#57392b',lipColor:'#b95675'}},
  {title:'Iris verts · sourcils clairs · lèvres brunes',face:{irisColor:'#529257',browColor:'#a57947',lipColor:'#995a46'}},
  {title:'Iris ambrés · sourcils foncés · lèvres mauves',face:{irisColor:'#b88b35',browColor:'#352935',lipColor:'#956286'}}
 ]);
 await sheet('catalogue-cils','Cils sur le bord supérieur des yeux',[
  {title:'T · sans cils',category:'T',face:{lashes:'none'}},{title:'F · courts',category:'F',face:{lashes:'short'}},{title:'F · accentués',category:'F',face:{lashes:'long'}},{title:'T · accentués',category:'T',face:{lashes:'long'}}
 ]);
 await browser.close();console.log('18 captures : 12 comparaisons M/F/T et 6 catalogues des contrôles/portraits.');
})().catch(e=>{console.error(e);process.exit(1)});
