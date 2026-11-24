// Contrôles raster ciblés des laboratoires historiques, par leurs moteurs natifs.
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
import {chromium} from 'playwright';

const path = (lab, file) => fileURLToPath(new URL('../../../../preview/' + lab + '/' + file, import.meta.url));
const browser = await chromium.launch();
try {
  const page = await browser.newPage();
  for (const [lab, modules] of Object.entries({
    'bio-gen-t1-b2':['baseline/model.js','baseline/render.js','model.js','render.js'],
    'bio-gen-t2':['model.js','geometry.js','render.js'],
    'bio-struct-t3-b2':['biological-profile.js','anatomical-skeleton.js','shape-grammar.js','facial-anchors.js',
      'body-geometry.js','morphology-settings.js','body-finish.js','face-settings.js','facial-model.js',
      'grooming-settings.js','grooming-model.js','canonical-body.js','surface-projection.js','facial-projection.js',
      'grooming-projection.js','body-projection.js','render.js']
  })) for (const module of modules) await page.addScriptTag({path: path(lab, module)});
  const result = await page.evaluate(() => {
    const scales = [300,178,70];
    function signature(canvas, size, crop = [0,0,canvas.width,canvas.height]) {
      const image = document.createElement('canvas');
      image.width = image.height = size;
      const c = image.getContext('2d');
      c.imageSmoothingEnabled = false;
      const [, , width, height] = crop, zoom = Math.min(size / width, size / height);
      const w = width * zoom, h = height * zoom;
      c.drawImage(canvas, ...crop, (size-w)/2, (size-h)/2, w, h);
      return image.toDataURL();
    }
    const canvas = () => document.createElement('canvas');
    const pair = (a,b) => a.map((value, i) => value === b[i]);
    const b2ref = BioMorphB2.generate('bio-inv-b2');
    const b2 = patch => {
      const body = BioMorphB2.derive({...b2ref,params:{...b2ref.params,...patch}});
      return scales.map(size => signature(BioRenderB2.render(canvas(),body,size===300?'portrait':'front'),size));
    };
    const b2Equivalent = pair(b2({hairPotential:.5, bodyHair:.8, beard:.4, hairSpread:.5}),
      b2({hairPotential:.8, bodyHair:.5, beard:.25, hairSpread:.5}));
    const t2ref = T2Model.reference('bio-inv');
    const t2 = patch => {
      const body = T2Geometry.derive({...t2ref, params:{...t2ref.params,...patch}});
      return scales.map(size => signature(T2Render.render(canvas(),T2Geometry.project(body,size===300?'portrait':'front')),size));
    };
    const chest = {chestPresent:true,chestVolume:.65};
    const t2Chest = pair(t2({...chest,chestShape:'round',chestStretch:.84}), t2({...chest,chestShape:'oval',chestStretch:1.2}));
    const t2Fur = pair(t2({furColor:'#f4c34e'}),t2({furColor:'#ad5cdb'}));
    const t2Eyes = {};
    for (const kind of ['circle','oval','triangle','square']) t2Eyes[kind] = t2({eyeShape:kind});
    const t2Unique = scales.map((_,i) => new Set(Object.values(t2Eyes).map(series => series[i])).size);

    const p = BiologicalProfile.reference('T').biologicalProfile;
    function t3(body) {
      const scene = BodyProjection.projectBody(body,'front');
      const input = T3Render.render(canvas(),scene,{volumes:true,face:true});
      const head = scene.commands.find(item => item.id === 'head');
      const crop = [head.x-3,head.y-3,head.w+6,head.h+6];
      return scales.map(size=>signature(input,size,size===300?crop:undefined));
    }
    const make = (eyeSize, density=.5) => CanonicalBody.generateBodyB2('bio-inv-t3',p,{},{},
      {pubicHairShape:'none',pubicHairDensity:density},{eyeSize});
    const profiles = Array.from({length:101},(_,i)=>make(+(0.5+i*.01).toFixed(2)));
    const draws = profiles.map(t3);
    const eyeDistinct = scales.map((_,i)=>new Set(draws.map(series=>series[i])).size);
    const t3Dormant = pair(t3(make(1,0)),t3(make(1,1)));
    const before = profiles[61], after = CanonicalBody.parseBody(CanonicalBody.serializeBody(before));
    return {scales,b2Equivalent,t2Chest,t2Fur,t2EyeShapes:t2Unique,t3EyeSize:{tested:profiles.length,unique:eyeDistinct},
      t3Dormant,t3Restored:pair(t3(before),t3(after))};
  });
  assert(result.b2Equivalent.every(Boolean));
  assert(result.t2Chest.every(Boolean));
  assert(result.t2Fur.every(Boolean));
  assert(result.t3Dormant.every(Boolean));
  assert(result.t3Restored.every(Boolean));
  console.log(JSON.stringify({engine:browser.version(),...result},null,2));
} finally {
  await browser.close();
}
