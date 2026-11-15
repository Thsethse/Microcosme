// Unretouched review captures of R1 versus R2; never an artistic reference.
const {chromium}=require('playwright'),path=require('node:path'),fs=require('node:fs');
(async()=>{
 const [before,after,directory='docs/bio-struct-t3-a/r2/captures']=process.argv.slice(2);if(!before||!after)throw Error('Usage: node capture-r2.cjs R1_URL R2_URL [DIRECTORY]');fs.mkdirSync(directory,{recursive:true});
 const browser=await chromium.launch(),page=await browser.newPage({viewport:{width:1180,height:1100},deviceScaleFactor:1});
 for(const [state,url]of [['avant',before],['apres',after]]){
  await page.goto(url);await page.waitForFunction(()=>document.querySelector('#description').textContent.includes('microcosme.bio-struct-t3-a'));await page.locator('#resetAll').click();
  for(const fn of ['male','female']){await page.locator('#thirdFunction').selectOption(fn);for(const view of ['front','profile','back']){await page.locator('#view').selectOption(view);await page.locator('.references').screenshot({path:path.join(directory,`${state}-${fn}-${view}.png`)});}}
 }await browser.close();console.log('12 captures R1/R2 M/F/T, fonctions T male/female, face/profil/dos.');
})().catch(e=>{console.error(e);process.exit(1)});
