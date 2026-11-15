// Optional review captures; no image is treated as an approved artistic reference.
const {chromium}=require('playwright'),path=require('node:path'),fs=require('node:fs');
(async()=>{
 const before=process.argv[2],after=process.argv[3],directory=path.resolve(process.argv[4]||'docs/bio-struct-t3-a/r1/captures');
 if(!before||!after)throw Error('Usage: node capture-r1.cjs BEFORE_URL AFTER_URL [OUTPUT_DIRECTORY]');
 fs.mkdirSync(directory,{recursive:true});const browser=await chromium.launch();const page=await browser.newPage({viewport:{width:1180,height:1100},deviceScaleFactor:1});
 for(const [state,url]of [['avant',before],['apres',after]]){await page.goto(url);await page.waitForFunction(()=>document.querySelector('#description').textContent.includes('microcosme.bio-struct-t3-a'));await page.locator('#resetAll').click();for(const view of ['front','profile','back']){await page.locator('#view').selectOption(view);await page.locator('.references').screenshot({path:path.join(directory,state+'-'+view+'.png')});}}
 await browser.close();console.log('Six captures comparatives M/F/T : '+directory);
})().catch(e=>{console.error(e);process.exit(1)});
