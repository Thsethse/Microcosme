import assert from 'node:assert/strict';
import {test} from 'node:test';
import {execFileSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {appearanceDocument,characterInput,parseAppearance} from '../appearance.mjs';
import {bounds,outlineCurves,pointAt} from '../bezier.mjs';
import {browDrawVersion,drawBrows} from '../brows.mjs';
import {choices,restoreSelection} from '../catalogue.mjs';
import {detailsDrawVersion,drawDetails} from '../details.mjs';
import {drawEyes,legacyDraw} from '../draw.mjs';
import {eyePresets,eyesFor} from '../eyes.mjs';
import {drawIris,irisDrawVersion,pigmentCenters,pupilShapes} from '../iris.mjs';
import {MouthFitError,auditHistoricalMouth,drawMouth,inheritedMouth,inheritedNoseBounds,lipColours,mouthBreaches,
  mouthControls,mouthDrawVersion,mouthFor,mouthMarkup,mouthPresets,normalizeMouth,solveMouth} from '../mouth.mjs';
import {character} from '../render.mjs';
import {controls,model,presets} from '../../preview/bio-vis-p5-i6/model.mjs';
import {priorityCase} from '../../preview/bio-vis-p5-i6/i5/i4/i3/i2/i1/base/r1/coverage.mjs';

const root=fileURLToPath(new URL('../..',import.meta.url)).replace(/\/$/,'');
const reference='14a93eefefa313b8daf5c08e5f64a869a26a4127';
async function frozen(file) {
  const source=execFileSync('git',['-c','safe.directory='+root,'show',reference+':bio-yeux-01/'+file],
    {cwd:root,encoding:'utf8'});
  const module=source.replace(/(from )'([^']+)'/g,(_,from,path)=>from+JSON.stringify(new URL('../'+path,import.meta.url).href));
  return import('data:text/javascript;base64,'+Buffer.from(module).toString('base64'));
}

const eyesList=[null,...Object.keys(eyePresets)];
const scales=[{headOnly:true},{},{headOnly:true,smallScale:true}];
const morphCorner=mask=>Object.fromEntries(Object.entries(controls).map(([key,c],i)=>[key,mask>>i&1?c.max:c.min]));
const morphs=[{},presets.tall.values,presets.broad.values,priorityCase,morphCorner(0),morphCorner(255),
  {...morphCorner(0),forehead_width:1.14,jowls:1.35},{...morphCorner(0),forehead_width:1.14,jowls:1.35,skull_height:1.18}];
const iris={irisRatio:1.25,irisSize:140,pupilSize:80,pupilShape:'ring',primary:'gris',secondary:'bleu',
  heterochromia:'central',secondarySize:72};
const details={contours:{upper:250,lower:200},lashes:{count:3,length:15},upper:{count:2,intensity:100}};
const brows={monobrow:true,slit:true,arc:67,colourMode:'independent',colour:'violet-amethyste'};
const ink=/<g data-bio-mouth="custom">.+?<\/g>/g;
const paths=svg=>Object.fromEntries([...svg.matchAll(/data-mouth-part="([^"]+)" d="([^"]+)" fill="([^"]+)"/g)]
  .map(([,key,d,fill])=>[key,{d,fill}]));
const at=(curves,t)=>{
  const start=curves[0][0][0], end=curves.at(-1)[3][0], x=start+(end-start)*t;
  const curve=curves.find(c=>x<=c[3][0]+1e-10);
  return pointAt(curve,(x-curve[0][0])/(curve[3][0]-curve[0][0]));
};
const extreme={width:130,upper:200,lower:200,cupid:100,peaks:55,corners:-100,curvature:100,intensity:100,thickness:200};

test('T1 · identité SVG des 126 références et audit exact des bouches historiques', async ()=>{
  const {character:before}=await frozen('render.mjs');
  assert.equal(choices.length,126);
  const stats={checks:0,conflicts:[],pupil:Infinity,nose:Infinity,chin:Infinity};
  function audit(input,key) {
    const face=model(input),opening=eyesFor(input,null);
    const {box,violations}=auditHistoricalMouth(face,opening);
    const [left,right]=pigmentCenters(opening);
    const frame=solveMouth(face,opening,{}).frame;
    stats.checks++;
    stats.pupil=Math.min(stats.pupil,box.left-left.x,right.x-box.right);
    stats.nose=Math.min(stats.nose,box.top-frame.nose.bottom);
    stats.chin=Math.min(stats.chin,frame.faceLimits(box.left,box.right).bottom-box.bottom);
    if (violations.length) stats.conflicts.push({key,violations});
  }
  for (const {style,arrangement,key} of choices) {
    const input={...morphs[2],style,arrangement};
    audit(input,key);
    for (const scale of scales) for (const prior of [{},{eyes:'upturned',hairColor:'bleu-vif'},
      {eyes:'narrow',iris,details,brows}]) {
      const params={...scale,...prior,instance:'frozen-mouth'};
      const expected=before(input,params);
      assert.equal(character(input,{...params,mouth:null}),expected);
      assert.equal(character(input,{...params,mouth:'historical'}),expected);
    }
  }
  for (let mask=0;mask<256;mask++) audit(morphCorner(mask),'morphologie-'+mask);
  assert.deepEqual(stats.conflicts,[]);
  console.log('T1 '+JSON.stringify(stats));
});

test('T2 · neuf silhouettes et trois frontières communes sans croisement', ()=>{
  const shapes=new Set();
  for (const {values} of Object.values(mouthPresets)) {
    const out=mouthFor({},null,values), svg=mouthMarkup(out), {geometry:g}=out;
    shapes.add(svg);
    assert.deepEqual(Object.keys(paths(svg)),['upper','lower','line']);
    assert.doesNotMatch(svg,/clipPath|mask|gradient|<image|stroke=/);
    const endpoints=[g.centre,g.top,g.bottom,g.upper,g.lower].map(curves=>curves.at(-1)[3]);
    assert(endpoints.every(p=>Math.abs(p[0]-endpoints[0][0])<1e-12&&Math.abs(p[1]-endpoints[0][1])<1e-12));
    for (let j=0;j<100;j++) {
      const t=j/100;
      const y=[g.upper,g.top,g.centre,g.bottom,g.lower].map(curves=>at(curves,t)[1]);
      assert(y.every((v,i)=>i===0||v>=y[i-1]));
    }
  }
  assert.equal(shapes.size,9);
  const cupid=mouthFor({},null,mouthPresets.cupid.values);
  assert(at(cupid.geometry.upper,.28)[1]<at(cupid.geometry.upper,0)[1]-1.5);
});

test('T3 · neuf balayages, deux influences de ligne indépendantes et latence', ()=>{
  const neutral=mouthFor({},null,{}, {withDomains:true});
  let total=0;
  for (const key of Object.keys(mouthControls)) {
    const {points}=neutral.domains[key];
    const signatures=new Set(points.map(value=>mouthMarkup(mouthFor({},null,{[key]:value}))));
    assert.equal(signatures.size,points.length,key);
    total+=points.length;
  }
  const line=values=>mouthFor({},null,values).geometry;
  const plain=line({}), lifted=line({corners:100}), curved=line({curvature:100});
  assert.deepEqual(plain.centre[0],lifted.centre[0]);
  assert(at(lifted.centre,1)[1]<at(plain.centre,1)[1]);
  assert.equal(at(curved.centre,1)[1],at(plain.centre,1)[1]);
  assert(at(curved.centre,.4)[1]>at(plain.centre,.4)[1]);
  assert.deepEqual(paths(mouthMarkup(mouthFor({},null,{upper:160}))).lower,
    paths(mouthMarkup(mouthFor({},null,{upper:20}))).lower);
  assert.deepEqual(paths(mouthMarkup(mouthFor({},null,{lower:160}))).upper,
    paths(mouthMarkup(mouthFor({},null,{lower:20}))).upper);
  const remembered=mouthFor({},null,{...extreme,upper:129.437,intensity:0},{withDomains:true});
  for(const key of ['upper','lower','cupid','peaks']) {
    assert.equal(remembered.effective[key],null);
    assert.deepEqual(remembered.domains[key].points,[]);
  }
  assert.equal(remembered.requested.upper,129.437);
  const returned=mouthFor({},null,{...remembered.requested,intensity:74});
  assert.equal(returned.effective.upper,129.437);
  const noCupid=mouthFor({},null,{cupid:0,peaks:53},{withDomains:true});
  assert.deepEqual(noCupid.domains.peaks.points,[]);
  assert.equal(noCupid.requested.peaks,53);
  const noVolumes=mouthFor({},null,{upper:0,lower:0,intensity:55},{withDomains:true});
  assert.deepEqual(noVolumes.domains.intensity.points,[]);
  assert(noVolumes.domains.upper.points.length>1);
  console.log('T3 '+JSON.stringify({points:total}));
});

test('T4 · quatre peaux, aplats de valeurs distinctes et mode trait seul', ()=>{
  const skins=['#dbbf88','#f4cfb6','#a57155','#573222'];
  const tuned=mouthFor({},null,{intensity:71});
  const toChannels=css=>css.slice(4,-1).split(',').map(Number);
  const signatures=new Set();
  for (const skin of skins) {
    const {line,upper,lower}=paths(mouthMarkup(tuned,skin));
    for (const [i,c] of toChannels(line.fill).entries()) {
      assert(c<toChannels(upper.fill)[i]&&toChannels(upper.fill)[i]<toChannels(lower.fill)[i]);
    }
    assert.deepEqual([upper.fill,lower.fill,line.fill],Object.values(lipColours(skin,71)));
    signatures.add(upper.fill);
    const alone=mouthMarkup(mouthFor({},null,{intensity:0,upper:200,lower:200}),skin);
    assert.deepEqual(Object.keys(paths(alone)),['line']);
    assert.equal(paths(alone).line.fill,line.fill);
  }
  assert.equal(signatures.size,4);
});

test('T5 · verticales pupillaires au repos, six pupilles et exemple dissymétrique', ()=>{
  const style='shaved';
  let checks=0;
  for (const input of morphs) for (const eyes of eyesList) {
    const opening=eyesFor(input,eyes), centres=pigmentCenters(opening);
    for (const pupilShape of Object.keys(pupilShapes)) {
      const svg=character({...input,style},{eyes,iris:{...iris,pupilShape},mouth:extreme});
      const art=svg.match(ink)[0];
      for (const {d} of Object.values(paths(art))) {
        const [xs]=bounds(outlineCurves(d));
        assert(xs[0]>=centres[0].x&&xs[1]<=centres[1].x);
      }
      checks++;
    }
  }
  const face=model({}),opening=eyesFor({},'oval');
  const [cx]=face.base.anchors.mouth;
  opening.face.envelopes[0].x=cx-6.38+.5;
  opening.face.envelopes[1].x=cx+10.23-.5;
  const solved=solveMouth(face,opening,extreme,{withDomains:true});
  assert(solved.effective.width<100);
  assert(cx-solved.box.left<6.38&&solved.box.right-cx<10.23);
  assert(Math.abs(solved.domains.width.points.at(-1)-solved.effective.width)<1e-7);
  assert(auditHistoricalMouth(face,opening).violations.includes('pupille-gauche'));
  console.log('T5 '+JSON.stringify({checks,asymmetricWidth:solved.effective.width,centres:[solved.frame.left,solved.frame.right]}));
});

test('T6 · contour, nez hérité, replis d’enveloppe et réouverture des domaines', async ()=>{
  let cases=0,minPupil=Infinity,minNose=Infinity,minFace=Infinity;
  for (const input of morphs) for (const eyes of eyesList) {
    const face=model(input),opening=eyesFor(input,eyes);
    const real=inheritedNoseBounds(face);
    assert.equal(real.bottom,face.base.anchors.nose[1]+2);
    for (let i=0;i<16;i++) {
      const settings={...extreme,width:i&8?130:60,upper:i&1?200:0,lower:i&2?200:0,
        corners:i&4?100:-100,curvature:i&8?100:-100,thickness:i&4?200:50};
      const s=solveMouth(face,opening,settings);
      const box=s.box, envelope=s.frame.faceLimits(box.left,box.right);
      assert.deepEqual(mouthBreaches(s.frame,box),[]);
      const actual=Object.values(paths(mouthMarkup(s))).map(({d})=>outlineCurves(d)).flat();
      const [[left,right],[top,bottom]]=bounds(actual);
      assert(left>=s.frame.left&&right<=s.frame.right);
      assert(top>=s.frame.nose.bottom+s.frame.noseGap&&top>=envelope.top&&bottom<=envelope.bottom);
      minPupil=Math.min(minPupil,left-s.frame.left,s.frame.right-right);
      minNose=Math.min(minNose,top-s.frame.nose.bottom);
      minFace=Math.min(minFace,top-envelope.top,envelope.bottom-bottom);
      cases++;
    }
  }
  const face=model({}),opening=eyesFor({},'round');
  const testBase=solveMouth(face,opening,{upper:20,lower:77,thickness:100,corners:20,curvature:-10},{withDomains:true});
  const newNose={...testBase.frame.nose,bottom:testBase.frame.y-testBase.frame.noseGap-1.45};
  const fitted=solveMouth(face,opening,testBase.requested,{noseBounds:newNose,withDomains:true});
  assert(fitted.domains.upper.points.at(-1)<testBase.domains.upper.points.at(-1));
  const edge=fitted.domains.upper.points.at(-1);
  assert(!Number.isInteger(edge));
  const clamped=solveMouth(face,opening,{...testBase.requested,upper:200},{noseBounds:newNose});
  assert(Math.abs(clamped.effective.upper-edge)<1e-7);
  assert.equal(clamped.requested.upper,200);
  assert.equal(solveMouth(face,opening,clamped.requested).effective.upper,200);
  assert.throws(()=>solveMouth(face,opening,extreme,{noseBounds:{...newNose,bottom:testBase.frame.y}}),MouthFitError);
  assert.throws(()=>solveMouth(face,opening,extreme,{noseBounds:{top:10}}),/nez invalides/i);
  const old=auditHistoricalMouth(face,opening,{noseBounds:{...newNose,bottom:testBase.frame.y}});
  assert(old.violations.includes('nez'));

  const {character:before}=await frozen('render.mjs');
  for (const [i,{style,arrangement}] of choices.entries()) {
    const input={...morphs[3],style,arrangement};
    const options={eyes:eyesList[i%9],iris,details,brows,hairColor:'bleu-vif',instance:'only-mouth'};
    const expected=before(input,options).replace(inheritedMouth(model(input)).tag,'');
    assert.equal(character(input,{...options,mouth:extreme}).replace(ink,''),expected);
  }
  const corner=mouthFor(morphCorner(65),'upturned',{...extreme,lower:100},{withDomains:true});
  const fractional=corner.domains.lower.points.at(-1);
  assert(fractional>100&&fractional<200&&!Number.isInteger(fractional));
  assert.equal(corner.domains.lower.intervals.at(-1)[1],fractional);
  console.log('T6 '+JSON.stringify({cases,minPupil,minNose,minFace,upperSimulated:edge,lowerReal:fractional,compatible:126}));
});

test('T7 · archives anciennes exactes, v5 à froid et graines indépendantes', async ()=>{
  const {appearanceDocument:before}=await frozen('appearance.mjs');
  const selection=restoreSelection({style:'p5-061',arrangement:'G',body:'bust',...morphCorner(65),extra:'précision'});
  const input=characterInput(selection);
  const draw={seed:'yeux historiques',version:legacyDraw};
  const irisDraw={seed:'iris ✦',version:irisDrawVersion};
  const detailsDraw={seed:'cils ✦',version:detailsDrawVersion};
  const browsDraw={seed:'sourcils ✦',version:browDrawVersion};
  const eyes=drawEyes(input,draw.seed,draw.version).values;
  const v1={eyes,form:'custom',draw,colour:'bleu-vif',flat:true};
  const v2={...v1,iris:drawIris(input,eyes,irisDraw.seed),irisDraw};
  const v3={...v2,details:drawDetails(input,eyes,detailsDraw.seed),detailsDraw};
  const v4={...v3,brows:drawBrows(input,eyes,browsDraw.seed),browsDraw};
  for(const settings of [v1,v2,v3,v4]) {
    const old=before(selection,settings);
    assert.deepEqual(appearanceDocument(selection,settings),old);
    const fresh=parseAppearance(JSON.stringify(old));
    assert.deepEqual(appearanceDocument(fresh.selection,fresh),old);
  }
  const mouthDraw={seed:'bouche ✦',version:mouthDrawVersion};
  const drawn=drawMouth(input,eyes,mouthDraw.seed);
  const precise={...extreme,width:129.9871,cupid:98.018,intensity:71.127};
  for(const extra of [{mouth:precise},{mouth:{...precise,intensity:0}},{mouth:drawn,mouthDraw},{mouthLatent:drawn,mouthDraw}]) {
    const settings={...v4,...extra};
    const archive=appearanceDocument(selection,settings);
    assert.equal(archive.version,5);
    const restored=parseAppearance(JSON.stringify(archive));
    assert.deepEqual(appearanceDocument(restored.selection,restored),archive);
    const portrait=(input,s,scale)=>character(input,{...scale,eyes:s.eyes,hairColor:s.colour,
      iris:s.iris,details:s.details,brows:s.brows,mouth:s.mouth,instance:'mouth-archive'});
    for(const scale of scales) assert.equal(portrait(characterInput(restored.selection),restored,scale),portrait(input,settings,scale));
    if (extra.mouthDraw) assert.deepEqual(drawMouth(input,eyes,restored.mouthDraw.seed),drawn);
    if (extra.mouth===precise) {
      assert.equal(archive.mouth.requested.intensity,71.127);
      const tampered=structuredClone(archive);
      tampered.mouth.effective.width=Math.round(tampered.mouth.effective.width);
      assert.throws(()=>parseAppearance(JSON.stringify(tampered)),/incompatibles/i);
    }
  }
});

test('T8 · 3 072 tirages admissibles rejoués et fréquence aux bornes', ()=>{
  for(const [name,input,eyes] of [['neutre',{},null],['étroit',morphCorner(65),'narrow'],['large',morphs[2],'upturned']]) {
    const seeds=1024, counts={plain:0,widthMin:0,widthMax:0}, widths=new Set();
    const face=model(input),opening=eyesFor(input,eyes);
    for(let i=0;i<seeds;i++) {
      const seed='mouth-'+name+'-'+i;
      const options=drawMouth(input,eyes,seed);
      assert.deepEqual(drawMouth(input,eyes,seed),options);
      const s=solveMouth(face,opening,options);
      assert.deepEqual(s.requested,normalizeMouth(options));
      for(const [key,value] of Object.entries(s.effective)) if(value!==null) assert.equal(value,options[key],seed+' '+key);
      assert.deepEqual(mouthBreaches(s.frame,s.box),[]);
      widths.add(options.width);
      counts.plain+=Number(options.intensity===0);
      counts.widthMin+=Number(options.width===60);
      counts.widthMax+=Number(options.width===130);
    }
    assert(widths.size>65);
    for(const [key,n] of Object.entries(counts)) {
      const expected=seeds/(key==='plain'?101:71);
      assert(Math.abs(n-expected)<5*Math.sqrt(expected),name+' '+key);
    }
    console.log('T8 '+JSON.stringify({name,seeds,counts,widths:widths.size,expectedWidth:seeds/71,expectedPlain:seeds/101}));
  }
});
