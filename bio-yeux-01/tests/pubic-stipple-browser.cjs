const assert = require('node:assert/strict');
const {chromium,webkit,devices} = require('playwright');

async function coverage(figure) {
  return figure.evaluate(async node=>{
    const clip=node.querySelector('[data-pelvic-details] clipPath');
    const dots=node.querySelector('[data-pubic-hair]');
    if (!dots) return 0;
    const area=async markup=>{
      const image=new Image();
      const svg='<svg xmlns="http://www.w3.org/2000/svg" width="450" height="360" viewBox="56 175 48 38">'+markup+'</svg>';
      image.src='data:image/svg+xml,'+encodeURIComponent(svg);
      await image.decode();
      const canvas=document.createElement('canvas');
      canvas.width=450;
      canvas.height=360;
      const ctx=canvas.getContext('2d');
      ctx.drawImage(image,0,0);
      const data=ctx.getImageData(0,0,450,360).data;
      let sum=0;
      for(let i=3;i<data.length;i+=4) sum+=data[i];
      return sum;
    };
    return await area('<defs>'+clip.outerHTML+'</defs>'+dots.outerHTML)/await area(clip.innerHTML);
  });
}

(async()=>{
  const url=process.argv[2];
  for(const engine of [chromium,webkit]){
    const browser=await engine.launch();
    try {
      const page=await browser.newPage({...devices['iPad (gen 7) landscape'],ignoreHTTPSErrors:process.env.PAGES_TEST_PROXY==='1'});
      await page.goto(url+'#planche-anatomie-pelvienne');
      await page.locator('[data-pubic-case="0"]').waitFor();
      const numbers={};
      for (const body of ['adult-h','adult-f']){
        const values=[];
        for(const level of [0,10,25,50,75,100]){
          const fig=page.locator(`[data-pubic-case="${level}"] [data-pubic-base="${body}"][data-pubic-revision="r02"]`);
          values.push(await coverage(fig));
        }
        assert(values.every((value,index)=>index===0 ? value===0 : value>values[index-1]));
        assert(values[1]<.07 && values[2]<.30 && values[4]>.68 && values[5]>.94, JSON.stringify(values));
        numbers[body]=values.map(value=>Math.round(value*100));
      }
      for(const scale of ['head','tile','mini']){
        await page.locator('#pubic-study-scale').selectOption(scale);
        assert.equal(await page.locator('[data-pubic-case] [data-pelvic-details]').count(),24);
        const current=page.locator('[data-pubic-case="75"] [data-pubic-revision="r02"]');
        for(const shape of await current.all()){
          const paths=shape.locator('[data-pubic-hair] path');
          assert.equal(await paths.count(),3);
          assert.equal(await paths.evaluateAll(elements=>elements.map(p=>p.getAttribute('d')).join('').match(/M/g).length),scale==='mini'?85:220);
        }
      }
      for(const [id,values] of Object.entries({structure:['min','max'],corpulence:['0','100'],skin:['#f4cfb6','#573222'],hair:['blond-pale','noir-profond']})){
        for(const value of values){
          await page.locator('#pubic-study-'+id).selectOption(value);
          assert.equal(await page.locator('[data-pubic-case="100"] [data-pubic-revision="r02"] [data-pubic-hair]').count(),2);
        }
      }
      await page.goto('about:blank');
      await page.goto(url+'#atelier-bassin');
      await page.locator('[data-pubic-body="adult-f"]').tap();
      const slider=page.getByRole('slider',{name:/État de pousse/});
      for(const value of ['0','10','63.375','100','63.375']){
        await slider.fill(value);
        assert.equal(await slider.inputValue(),value);
      }
      await page.locator('#appearance-export').evaluate(button=>button.click());
      const saved=await page.locator('#appearance-json').inputValue();
      assert.equal(JSON.parse(saved).version,22);
      assert.equal(JSON.parse(saved).character.pubicHairLength,63.375);
      const texture=page.locator('#pubic-live-detail [data-pubic-hair]');
      const original=await texture.innerHTML();
      await page.reload();
      await page.locator('#appearance-panel summary').click();
      await page.locator('#appearance-json').fill(saved);
      await page.locator('#appearance-import').evaluate(button=>button.click());
      assert.equal(await slider.inputValue(),'63.375');
      assert.equal(await texture.innerHTML(),original);
      console.log(JSON.stringify({engine:engine.name(),version:browser.version(),coverage:numbers,pathsPerTexture:3}));
    } finally {
      await browser.close();
    }
  }
})().catch(error=>{console.error(error);process.exitCode=1;});
