import assert from 'node:assert/strict';
import {test} from 'node:test';
import {execFileSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {appearanceDocument,characterInput,parseAppearance} from '../appearance.mjs';
import {bounds,outlineCurves} from '../bezier.mjs';
import {browDrawVersion,drawBrows} from '../brows.mjs';
import {choices,restoreSelection} from '../catalogue.mjs';
import {detailsDrawVersion,drawDetails} from '../details.mjs';
import {drawEyes,legacyDraw} from '../draw.mjs';
import {eyePresets,eyesFor} from '../eyes.mjs';
import {drawIris,irisDrawVersion,pigmentCenters,pupilShapes} from '../iris.mjs';
import {drawMouth,inheritedMouth,inheritedNose,mouthBreaches,mouthDrawVersion,mouthFor,solveMouth} from '../mouth.mjs';
import {NoseFitError,auditHistoricalNose,drawNose,normalizeNose,noseBreaches,noseColours,noseControls,
  noseDetailPresets,noseDrawVersion,noseFor,noseMarkup,nosePresets,solveNose} from '../nose.mjs';
import {character} from '../render.mjs';
import {controls,model,presets} from '../../preview/bio-vis-p5-i6/model.mjs';
import {priorityCase} from '../../preview/bio-vis-p5-i6/i5/i4/i3/i2/i1/base/r1/coverage.mjs';

const root=fileURLToPath(new URL('../..',import.meta.url)).replace(/\/$/,'');
const reference='00e6496a7dd9274917622ef54459d28375d6a3ed';
async function frozen(file) {
  const source=execFileSync('git',['-c','safe.directory='+root,'show',reference+':bio-yeux-01/'+file],
    {cwd:root,encoding:'utf8'});
  const module=source.replace(/(from )'([^']+)'/g,(_,from,path)=>from+JSON.stringify(new URL('../'+path,import.meta.url).href));
  return import('data:text/javascript;base64,'+Buffer.from(module).toString('base64'));
}
const openingKeys=[null,...Object.keys(eyePresets)];
const scales=[{headOnly:true},{},{headOnly:true,smallScale:true}];
const morph=mask=>Object.fromEntries(Object.entries(controls).map(([key,c],i)=>[key,mask>>i&1?c.max:c.min]));
const morphs=[{},presets.tall.values,presets.broad.values,priorityCase,morph(0),morph(255),
  {...morph(0),forehead_width:1.14,jowls:1.35},{...morph(0),forehead_width:1.14,jowls:1.35,skull_height:1.18}];
const iris={irisRatio:1.25,irisSize:140,pupilSize:80,pupilShape:'ring',primary:'gris',secondary:'bleu',
  heterochromia:'central',secondarySize:72};
const details={contours:{upper:250,lower:200},lashes:{count:3,length:15},upper:{count:2,intensity:100},
  lower:{count:2,intensity:100},shadows:{intensity:87,volume:80}};
const brows={monobrow:true,slit:true,arc:73,colourMode:'independent',colour:'violet-amethyste'};
const mouth={width:115,upper:173,lower:174,cupid:37,thickness:77,intensity:68};
const nose={length:150,bridge:180,wings:160,tip:180,roundness:100,nostrils:180,tilt:100,fills:100,lines:100};
const noseInk=/<g data-bio-nose="custom">.*?<\/g>/g;
const mouthInk=/<g data-bio-mouth="custom">.*?<\/g>/g;
const regions=svg=>[...svg.matchAll(/data-nose-region="([^"]+)"/g)].map(m=>m[1]);
const colours=css=>css.slice(4,-1).split(',').map(Number);

test('T1 · 126 références historiques exactes et 2 430 audits sans conflit', async ()=>{
  const {character:before}=await frozen('render.mjs');
  const conflicts=[];
  let checks=0;
  for (const {style,arrangement,key} of choices) {
    const input={...morphs[2],style,arrangement};
    const issues=auditHistoricalNose(model(input),eyesFor(input,null));
    checks++;
    if(issues.length) conflicts.push({key,issues});
    for (const scale of scales) for (const state of [{},{eyes:'upturned',hairColor:'bleu-vif'},
      {eyes:'narrow',iris,details,brows,mouth}]) {
      const params={...scale,...state,instance:'frozen-nose'};
      const expected=before(input,params);
      assert.equal(character(input,{...params,nose:null}),expected);
      assert.equal(character(input,{...params,nose:'historical'}),expected);
    }
  }
  for(let mask=0;mask<256;mask++) {
    const input=morph(mask), face=model(input);
    for(const eyes of openingKeys) {
      const issues=auditHistoricalNose(face,eyesFor(input,eyes),{details});
      checks++;
      if(issues.length) conflicts.push({mask,eyes,issues});
    }
  }
  assert.deepEqual(conflicts,[]);
  console.log('T1 '+JSON.stringify({checks,conflicts:conflicts.length}));
});

test('T2 · neuf morphologies, six régions et même géométrie génératrice', ()=>{
  const paths=new Set();
  for(const {values} of Object.values(nosePresets)) {
    const result=noseFor({},null,values,{mouth}), svg=noseMarkup(result);
    paths.add(svg);
    assert.deepEqual(new Set(regions(svg)),new Set(['root','bridge','tip','wings','nostrils','base']));
    assert.equal(result.geometry.curves.length,7);
    assert.doesNotMatch(svg,/clipPath|mask|gradient|<image|stroke=/);
  }
  assert.equal(paths.size,9);
  const rounded=noseFor({},null,nosePresets.rounded.values,{mouth});
  const pointed=noseFor({},null,{...rounded.requested,roundness:0},{mouth});
  assert.equal(rounded.geometry.bottom,pointed.geometry.bottom);
  assert(rounded.geometry.width(.967)>pointed.geometry.width(.967));
  const lessVolume=noseFor({},null,{...rounded.requested,tip:70},{mouth});
  assert(lessVolume.geometry.bottom<rounded.geometry.bottom);
  assert.equal(lessVolume.geometry.top,rounded.geometry.top);
});

test('T3 · balayages directs, relief indépendant de l’enveloppe et valeurs latentes', ()=>{
  const reference=noseFor({},null,{}, {mouth,withDomains:true});
  let points=0;
  for(const key of Object.keys(noseControls)) {
    const crans=reference.domains[key].points;
    const signatures=new Set(crans.map(n=>noseMarkup(noseFor({},null,{[key]:n},{mouth}))));
    assert.equal(signatures.size,crans.length,key);
    points+=crans.length;
  }
  const hidden=noseFor({},null,{...nose,lines:0,fills:0},{mouth,withDomains:true});
  const visible=noseFor({},null,nose,{mouth});
  assert.deepEqual(hidden.geometry.anatomy,visible.geometry.anatomy);
  assert.equal(hidden.requested.tilt,100);
  for(const key of ['length','bridge','wings','tip','roundness','nostrils','tilt']) {
    assert.equal(hidden.effective[key],null);
    assert.equal(hidden.domains[key].points.length,0);
  }
  const masked=noseFor({},null,{nostrils:0,tilt:-72},{mouth,withDomains:true});
  assert.equal(masked.effective.tilt,null);
  assert(!regions(noseMarkup(masked)).includes('nostrils'));
  const restored=noseFor({},null,{...masked.requested,nostrils:90},{mouth});
  assert.equal(restored.effective.tilt,-72);
  const tight=noseFor(morph(0),'narrow',{...nose,nostrils:90},{withDomains:true});
  assert(tight.domains.tip.points.at(-1)<=180);
  console.log('T3 '+JSON.stringify({points,exampleTip:tight.applied.tip,domains:tight.domains.tip.intervals}));
});

test('T4 · quatre teintes de peau, trois degrés et narines masquées', ()=>{
  const skins=['#dbbf88','#f4cfb6','#a57155','#573222'];
  const pigments=new Set();
  for(const skin of skins) {
    const p=noseColours(skin,74,79);
    pigments.add(p.bridge);
    for(const [i,value] of colours(p.nostrils).entries()){
      assert(value<colours(p.base)[i]&&colours(p.base)[i]<colours(p.bridge)[i]);
    }
    const x=noseMarkup(noseFor({},null,{lines:70,nostrils:0},{mouth}),skin);
    assert(!regions(x).includes('nostrils'));
    assert.doesNotMatch(x,/#000|gradient|mask|stroke="/);
  }
  assert.equal(pigments.size,4);
  const looks=Object.values(noseDetailPresets).map(({values})=>noseMarkup(noseFor({},null,values,{mouth})));
  assert.equal(new Set(looks).size,3);
  assert(!regions(looks[0]).includes('nostrils'));
});

test('T5 · répartition anatomique, limites pupillaires et ellipse de narine entière', async ()=>{
  let cases=0,minEye=Infinity,minPupil=Infinity,minMouth=Infinity,constrained=0;
  for(const input of morphs) for(const eyes of openingKeys) {
    const face=model(input),opening=eyesFor(input,eyes),pupils=pigmentCenters(opening);
    for(let mask=0;mask<16;mask++){
      const options={details,mouth:mask%2?mouth:null};
      const request={...nose,length:mask&1?150:55,bridge:mask&2?180:40,wings:mask&4?160:60,
        tip:mask&8?180:30,roundness:mask&2?100:0,tilt:mask&4?100:-100};
      const n=solveNose(face,opening,request,options);
      const g=n.geometry, frame=n.frame, box=g.anatomy;
      assert.deepEqual(noseBreaches(frame,g),[]);
      const envelope=frame.faceSides(box.top,box.bottom);
      assert(box.left>=envelope.left&&box.right<=envelope.right);
      assert(box.left>=pupils[0].x&&box.right<=pupils[1].x);
      assert(box.bottom<=frame.mouthTop-frame.mouthGap);
      minPupil=Math.min(minPupil,box.left-pupils[0].x,pupils[1].x-box.right);
      minMouth=Math.min(minMouth,frame.mouthTop-box.bottom);
      const nX=g.nostril, a=nX.angle*Math.PI/180;
      for(let sample=0;sample<64;sample++){
        const t=sample*Math.PI/32;
        const dx=nX.rx*Math.cos(t),dy=nX.ry*Math.sin(t);
        const x=nX.dx+dx*Math.cos(a)-dy*Math.sin(a);
        const y=nX.y+dx*Math.sin(a)+dy*Math.cos(a);
        assert(Math.abs(x)<=g.width((y-g.top)/g.height)+1e-10);
      }
      for(const eye of frame.eyes){
        const y0=Math.max(box.top,eye.top),y1=Math.min(box.bottom,eye.bottom);
        if(y0>y1) continue;
        const half=g.widthRange((y0-box.top)/g.height,(y1-box.top)/g.height)[1];
        const distance=Math.max(eye.left-frame.x-half,frame.x-half-eye.right);
        minEye=Math.min(minEye,distance);
      }
      const svg=noseMarkup(n);
      const d=svg.match(/data-nose-region="bridge" d="([^"]+)"/)[1];
      const [[lo,hi],[top,bottom]]=bounds(outlineCurves(d));
      assert(lo>=frame.left&&hi<=frame.right&&top>=box.top-1e-8&&bottom<=box.bottom+1e-8);
      assert.deepEqual(svg.match(/<ellipse data-nose-region="nostrils"/g)?.length??0,nX.rx?2:0);
      constrained+=Number(n.applied.nostrils!==180);
      cases++;
    }
  }
  const {character:before}=await frozen('render.mjs');
  for(const [i,{style,arrangement}] of choices.entries()) {
    const input={...morphs[3],style,arrangement};
    const options={eyes:openingKeys[i%9],details,brows,iris:{...iris,pupilShape:Object.keys(pupilShapes)[i%6]},
      mouth,hairColor:'bleu-vif',instance:'only-nose'};
    const face=model(input);
    const prior=before(input,options).replace(inheritedNose(face).tag,'').replace(mouthInk,'');
    const current=character(input,{...options,nose}).replace(noseInk,'').replace(mouthInk,'');
    assert.equal(current,prior);
  }
  const noMouth={eyes:'narrow',details,iris,brows,instance:'legacy-mouth'};
  const face=model({});
  const expected=before({},noMouth).replace(inheritedNose(face).tag,'');
  assert.equal(character({},{...noMouth,nose}).replace(noseInk,''),expected);
  assert(expected.includes(inheritedMouth(face).tag));
  console.log('T5 '+JSON.stringify({cases,constrained,minPupil,minEye,minMouth,compatible:126}));
});

test('T6 · priorité au nez, adaptation ciblée et restauration après 30 allers-retours', ()=>{
  const face=model({}), opening=eyesFor({},'narrow');
  const preferred={...mouth,width:100,upper:180,lower:130};
  const resolve=(settings,prefs=preferred)=>{
    const n=solveNose(face,opening,settings,{mouth:prefs,details});
    const m=solveMouth(face,opening,prefs,{noseBounds:n.geometry.anatomy,preserveMouth:true});
    assert.deepEqual(mouthBreaches(m.frame,m.box),[]);
    return {n,m};
  };
  const small={length:55,tip:180}, large={length:150,tip:180};
  const first=resolve(small), last=resolve(large);
  assert.deepEqual(first.m.effective,first.m.requested);
  assert(last.m.effective.upper<preferred.upper);
  assert.equal(last.n.applied.length,150);
  const changed=Object.keys(preferred).filter(key=>last.m.effective[key]!==last.m.requested[key]);
  assert.deepEqual(changed,['upper']);
  for(let i=0;i<30;i++){
    const one=resolve(large), two=resolve(small);
    assert.deepEqual(one.m.effective,last.m.effective);
    assert.deepEqual(two.m.effective,first.m.effective);
    assert.deepEqual(two.m.requested,first.m.requested);
    assert.deepEqual(one.n.geometry.anatomy,last.n.geometry.anatomy);
  }
  const noPaint=resolve({...large,lines:0,fills:0});
  assert.deepEqual(noPaint.n.geometry.anatomy,last.n.geometry.anatomy);
  assert.deepEqual(noPaint.m.effective,last.m.effective);
  const edited={...preferred,upper:195,lower:86};
  const pre=resolve(small,edited);
  const post=resolve(large,edited);
  assert.deepEqual(resolve(large,pre.m.requested).m.effective,post.m.effective);
  assert.deepEqual(resolve(small,post.m.requested).m.effective,pre.m.effective);
  const narrow=solveNose(face,opening,nose,{details,withDomains:true});
  assert(narrow.applied.tip<180);
  assert(narrow.geometry.anatomy.bottom<=narrow.frame.maxBottom);
  const impossible=model({});
  impossible.base.anchors.mouth[1]=impossible.base.anchors.nose[1]-.5;
  assert.throws(()=>solveNose(impossible,opening,large),NoseFitError);
  assert(auditHistoricalNose(impossible,opening).includes('bouche'));
  console.log('T6 '+JSON.stringify({cycles:30,upperBefore:first.m.effective.upper,upperConstrained:last.m.effective.upper,
    upperRestored:resolve(small,last.m.requested).m.effective.upper,restrictedHistoricTip:narrow.applied.tip}));
});

test('T7 · archives v1 à v5 inchangées et reconstruction v6 indépendante de l’ordre', async ()=>{
  const {appearanceDocument:before}=await frozen('appearance.mjs');
  const selection=restoreSelection({style:'p5-061',arrangement:'G',body:'bust',...morphs[2],memo:'nez'});
  const input=characterInput(selection);
  const draw={seed:'yeux historiques',version:legacyDraw}, eyes=drawEyes(input,draw.seed,draw.version).values;
  const irisDraw={seed:'iris ✦',version:irisDrawVersion}, detailsDraw={seed:'cils ✦',version:detailsDrawVersion};
  const browsDraw={seed:'sourcils ✦',version:browDrawVersion}, mouthDraw={seed:'lèvres ✦',version:mouthDrawVersion};
  const v1={eyes,form:'custom',draw,colour:'bleu-vif',flat:true};
  const v2={...v1,iris:drawIris(input,eyes,irisDraw.seed),irisDraw};
  const v3={...v2,details:drawDetails(input,eyes,detailsDraw.seed),detailsDraw};
  const v4={...v3,brows:drawBrows(input,eyes,browsDraw.seed),browsDraw};
  const v5={...v4,mouth:drawMouth(input,eyes,mouthDraw.seed),mouthDraw};
  for(const settings of [v1,v2,v3,v4,v5]){
    const old=before(selection,settings);
    assert.deepEqual(appearanceDocument(selection,settings),old);
    const restored=parseAppearance(JSON.stringify(old));
    assert.deepEqual(appearanceDocument(restored.selection,restored),old);
  }
  const noseDraw={seed:'nez ✦',version:noseDrawVersion};
  const drawn=drawNose(input,eyes,noseDraw.seed,{mouth:v5.mouth,details:v5.details});
  const precise={...nose,length:149.217,tip:172.643,nostrils:171.313,tilt:58.141};
  for(const extra of [{nose:precise},{nose:{...precise,fills:0,lines:0}},{nose:drawn,noseDraw},{noseLatent:drawn,noseDraw}]){
    const settings={...v5,...extra};
    const archive=appearanceDocument(selection,settings);
    assert.equal(archive.version,6);
    const restored=parseAppearance(JSON.stringify(archive));
    assert.deepEqual(appearanceDocument(restored.selection,restored),archive);
    const render=(input,s,scale)=>character(input,{...scale,eyes:s.eyes,iris:s.iris,details:s.details,
      brows:s.brows,mouth:s.mouth,nose:s.nose,hairColor:s.colour,instance:'nose-archive'});
    for(const scale of scales) assert.equal(render(characterInput(restored.selection),restored,scale),render(input,settings,scale));
    if(extra.noseDraw) assert.deepEqual(drawNose(input,eyes,restored.noseDraw.seed,
      {mouth:restored.mouth,details:restored.details}),drawn);
    if(extra.nose===precise){
      assert.equal(archive.nose.requested.length,149.217);
      assert.deepEqual(archive.mouth.requested,v5.mouth);
      const changed=structuredClone(archive);
      changed.nose.anatomy.bottom+=.001;
      assert.throws(()=>parseAppearance(JSON.stringify(changed)),/incompatibles/i);
    }
  }
});

test('T9 · profils d’âge hérités du moteur frontal et tous les habitants du catalogue', ()=>{
  const input={style:'shaved'},opening=eyesFor(input,'narrow');
  const adult=model(input);
  const elder=structuredClone(adult);
  elder.base.parameters.age='elder';
  assert.deepEqual(new Set(choices.map(({style,arrangement})=>model({style,arrangement}).base.parameters.age)),
    new Set(['adult']));
  for (const face of [adult,elder]) {
    assert.deepEqual(auditHistoricalNose(face,opening,{details}),[]);
    const solved=solveNose(face,opening,nose,{mouth,details});
    assert.deepEqual(noseBreaches(solved.frame,solved.geometry),[]);
    assert.equal(inheritedNose(face).tag,inheritedNose(adult).tag);
    assert.equal(noseMarkup(solved),noseMarkup(solveNose(adult,opening,nose,{mouth,details})));
  }
});

test('T8 · graines déterministes admissibles, distribution des longueurs et intensités', ()=>{
  for(const [name,input,eyes] of [['neutre',{},null],['étroit',morph(65),'narrow'],['large',morphs[2],'upturned']]){
    const seeds=768, counts={lengthMin:0,lengthMax:0,hiddenFills:0,hiddenLines:0};
    const face=model(input),opening=eyesFor(input,eyes),widths=new Set();
    let mouthAdjusted=0;
    for(let i=0;i<seeds;i++){
      const seed='nose-'+name+'-'+i;
      const s=drawNose(input,eyes,seed,{mouth});
      assert.deepEqual(drawNose(input,eyes,seed,{mouth}),s);
      const n=solveNose(face,opening,s,{mouth});
      assert.deepEqual(n.applied,normalizeNose(s));
      assert.deepEqual(noseBreaches(n.frame,n.geometry),[]);
      const lips=solveMouth(face,opening,mouth,{noseBounds:n.geometry.anatomy,preserveMouth:true});
      assert.deepEqual(mouthBreaches(lips.frame,lips.box),[]);
      mouthAdjusted+=Number(lips.effective.upper!==mouth.upper);
      widths.add(s.length);
      counts.lengthMin+=Number(s.length===55);counts.lengthMax+=Number(s.length===150);
      counts.hiddenFills+=Number(s.fills===0);counts.hiddenLines+=Number(s.lines===0);
    }
    assert(widths.size>=90);
    for(const [key,count] of Object.entries(counts)){
      const expected=seeds/(key.startsWith('length')?96:101);
      assert(Math.abs(count-expected)<5*Math.sqrt(expected),name+' '+key);
    }
    console.log('T8 '+JSON.stringify({name,seeds,counts,lengths:widths.size,mouthAdjusted,
      expectedLength:seeds/96,expectedIntensity:seeds/101}));
  }
});
