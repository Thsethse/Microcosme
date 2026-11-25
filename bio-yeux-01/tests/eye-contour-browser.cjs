const assert = require('node:assert/strict');
const path = require('node:path');

async function auditEyeContour(page, engine, output) {
  await page.evaluate(()=>{location.hash='planche-contours';});
  const board = page.locator('#planche-contours');
  await board.locator('[data-eye-contour-case]').last().waitFor();
  const evidence = await board.evaluate(async section=>{
    const cases = [...section.querySelectorAll('[data-eye-contour-case]')];
    async function raster(svg) {
      const bounds=svg.getBoundingClientRect();
      const width=Math.round(bounds.width), height=Math.round(bounds.height);
      const copy=svg.cloneNode(true);
      copy.setAttribute('width',width);
      copy.setAttribute('height',height);
      const image=new Image();
      image.src='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(new XMLSerializer().serializeToString(copy));
      await image.decode();
      const canvas=document.createElement('canvas');
      canvas.width=width;
      canvas.height=height;
      const ctx=canvas.getContext('2d');
      ctx.drawImage(image,0,0);
      return {width,height,data:ctx.getImageData(0,0,width,height).data};
    }
    function changed(a,b) {
      let changes=0;
      for (let p=0;p<a.length;p+=4) {
        if (a[p]!==b[p]||a[p+1]!==b[p+1]||a[p+2]!==b[p+2]||a[p+3]!==b[p+3]) changes++;
      }
      return changes;
    }
    const outcomes=[];
    for(const [index,item] of cases.entries()) {
      const scales=[];
      for (const key of ['head','body','mini']) {
        const figure=side=>item.querySelector(`[data-eye-revision="${side}"] [data-eye-scale="${key}"] svg`);
        const [a,b]=await Promise.all([raster(figure('before')),raster(figure('after'))]);
        const eyeliner=index===4 ?
          raster(cases[index-1].querySelector(`[data-eye-revision="after"] [data-eye-scale="${key}"] svg`)) : null;
        scales.push({key,width:b.width,height:b.height,changed:changed(a.data,b.data),
          linerDelta:eyeliner ? changed((await eyeliner).data,b.data) : null});
      }
      const after=item.querySelector('[data-eye-revision="after"] [data-eye-scale="head"]');
      outcomes.push({label:item.querySelector('h3').textContent,scales,
        anatomical:after.querySelectorAll('path[data-eye-anatomy]').length,
        lashes:after.querySelectorAll('path[data-eye-lash]').length,
        eyeliner:after.querySelector('[data-makeup-family="liner"]')!==null});
    }
    return outcomes;
  });
  assert.equal(evidence.length,6);
  assert.equal(await board.locator('figure svg').count(),48);
  assert.deepEqual(evidence.map(row=>row.anatomical),[4,4,4,4,4,4]);
  assert.deepEqual(evidence.map(row=>row.lashes),[0,0,2,6,6,0]);
  assert.deepEqual(evidence.map(row=>row.eyeliner),[false,false,false,false,true,true]);
  for(const row of evidence) {
    assert.deepEqual(row.scales.map(scale=>scale.height),[300,178,70]);
    assert(row.scales.every(scale=>scale.changed>0),row.label);
  }
  assert(evidence[4].scales.every(scale=>scale.linerDelta>0));
  if (engine==='chromium') await board.screenshot({path:path.join(output,'comparatif-contours.png')});
  return evidence;
}

module.exports = {auditEyeContour};
