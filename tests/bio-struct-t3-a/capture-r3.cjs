// R2/R3 review only: these screenshots do not constitute artistic approval.
const {chromium}=require('playwright'),path=require('node:path'),fs=require('node:fs');
(async()=>{
 const [before,after,directory='docs/bio-struct-t3-a/r3/captures']=process.argv.slice(2);if(!before||!after)throw Error('Usage: node capture-r3.cjs R2_URL R3_URL [DIRECTORY]');fs.mkdirSync(directory,{recursive:true});
 const browser=await chromium.launch(),page=await browser.newPage({viewport:{width:1180,height:1100},deviceScaleFactor:1});
 async function shots(prefix){for(const view of ['front','profile','back']){await page.locator('#view').selectOption(view);await page.locator('.references').screenshot({path:path.join(directory,prefix+'-'+view+'.png')});}}
 for(const [state,url]of [['avant',before],['apres',after]]){await page.goto(url);await page.waitForFunction(()=>document.querySelector('#description').textContent.includes('microcosme.bio-struct-t3-a'));await page.locator('#resetAll').click();for(const fn of ['male','female']){await page.locator('#thirdFunction').selectOption(fn);await shots(state+'-'+fn);}}
 const range=async(id,v)=>{await page.locator('#'+id).fill(String(v));await page.locator('#'+id).dispatchEvent('input');};
 for(const definition of ['souple','defini']){
  await page.locator('#resetAll').click();
  for(const category of ['M','F','T']){await page.locator('[data-category='+category+']').click();await range('a-pectoralDefinition',definition==='defini'?1:0);await range('a-abdominalDefinition',definition==='defini'?1:0);await range('a-fatVolume',definition==='defini'?.1:.85);await range('a-shadowStrength',.7);
   if(category!=='M'){await page.locator('#a-breastShape').selectOption(definition==='defini'?'drop':'round');await range('p-breastVolume',category==='F'?.75:.6);}
   await range('a-chestHairDensity',category==='F'?0:.65);await range('a-bellyHairDensity',category==='F'?0:.5);await page.locator('#a-pubicHairShape').selectOption(category==='M'?'rectangle':category==='F'?'triangle':'square');await range('a-pubicHairDensity',.7);
  }
  await shots('exemple-'+definition);
 }
 await browser.close();console.log('18 captures : R2/R3 M/F/T, deux fonctions T, trois vues ; exemples souples/définis et pilosité.');
})().catch(e=>{console.error(e);process.exit(1)});
