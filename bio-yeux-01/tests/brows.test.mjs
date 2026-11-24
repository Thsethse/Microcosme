import assert from 'node:assert/strict';
import {test} from 'node:test';
import {execFileSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {appearanceDocument, characterInput, parseAppearance} from '../appearance.mjs';
import {choices, restoreSelection} from '../catalogue.mjs';
import {browControls,browDrawVersion,browPresets,browProfile,browsFor,drawBrows,normalizeBrows,solveBrows} from '../brows.mjs';
import {detailsDrawVersion,drawDetails} from '../details.mjs';
import {drawEyes,legacyDraw} from '../draw.mjs';
import {eyePresets,eyesFor} from '../eyes.mjs';
import {drawIris,irisDrawVersion,intervalsOf} from '../iris.mjs';
import {character} from '../render.mjs';
import {palette,luminance,rgb} from '../../bio-col-01/palette.mjs';
import {controls,model,presets} from '../../preview/bio-vis-p5-i6/model.mjs';
import {priorityCase} from '../../preview/bio-vis-p5-i6/i5/i4/i3/i2/i1/base/r1/coverage.mjs';

const root=fileURLToPath(new URL('../..',import.meta.url)).replace(/\/$/,'');
const reference='d17a21757ffee651154534e6c081656f873ecf1a';
async function frozen(file) {
  const source=execFileSync('git',['-c','safe.directory='+root,'show',reference+':bio-yeux-01/'+file],
    {cwd:root,encoding:'utf8'});
  const module=source.replace(/(from )'([^']+)'/g,(_,from,path)=>from+JSON.stringify(new URL('../'+path,import.meta.url).href));
  return import('data:text/javascript;base64,'+Buffer.from(module).toString('base64'));
}

const eyeList=[null,...Object.keys(eyePresets)];
const scales=[{headOnly:true},{},{headOnly:true,smallScale:true}];
const portrait={style:'shaved'};
const iris={irisRatio:1.25,irisSize:140,pupilShape:'ring',primary:'gris',secondary:'bleu',heterochromia:'central',secondarySize:72};
const details={contours:{upper:250,lower:200},lashes:{count:3,length:15},upper:{count:2,intensity:100},
  lower:{count:2,intensity:90},shadows:{intensity:80,volume:84}};
const morphExtremes=bound=>Object.fromEntries(Object.entries(controls).map(([key,c])=>[key,c[bound]]));
const morphs=[{},presets.tall.values,presets.broad.values,priorityCase,morphExtremes('min'),morphExtremes('max'),
  {...morphExtremes('min'),forehead_width:1.14,jowls:1.35},
  {...morphExtremes('min'),forehead_width:1.14,jowls:1.35,skull_height:1.18}];
const render=(brows,input=portrait,other={})=>character(input,{brows,...other});
const inkPattern=/<g data-bio-brows="custom">.+?<\/g>|<g data-bio-brows="absent"\/>/g;
const pieces=svg=>[...svg.matchAll(/<path data-brow-side="([^"]+)" d="([^"]+)" fill="([^"]+)"\/>/g)]
  .map(([,side,d,fill])=>({side,d,fill,points:[...d.matchAll(/(-?[\d.]+),(-?[\d.]+)/g)].map(([,x,y])=>[+x,+y])}));

test('T1 · historique exact sur 126 références à instance et état constants', async ()=>{
  const {character:before}=await frozen('render.mjs');
  assert.equal(choices.length,126);
  for (const {style,arrangement} of choices) for (const scale of scales) {
    const input={...morphs[2],style,arrangement};
    for (const prior of [{},{eyes:'upturned',hairColor:'bleu-vif'},{eyes:'narrow',iris,details}]) {
      const options={...scale,...prior,instance:'brows-regression'};
      const expected=before(input,options);
      assert.equal(character(input,{...options,brows:null}),expected);
      assert.equal(character(input,{...options,brows:'historical'}),expected);
    }
  }
});

test('T2 · neuf profils distincts, dont une inflexion en S réelle', ()=>{
  const signatures=new Set();
  for (const {values} of Object.values(browPresets)) {
    const [left,right]=pieces(render(values));
    assert.equal(left.side,'left');
    signatures.add(right.d);
    assert.doesNotMatch(right.d,/M.*M/);
    assert.equal(right.points.length,left.points.length);
  }
  assert.equal(signatures.size,9);
  const profile=name=>{
    const solved=browsFor(portrait,null,browPresets[name].values);
    return browProfile(solved.frame,solved.effective).section;
  };
  assert.equal(Math.abs(profile('straight')(.36)[1]),0);
  assert(profile('rising')(1)[1]<-3);
  assert(profile('falling')(1)[1]>3);
  const s=profile('inflected');
  const sample=Array.from({length:41},(_,i)=>s(i/40)[1]);
  const curvature=sample.slice(1,-1).map((y,i)=>sample[i]-2*y+sample[i+2]);
  assert(Math.max(...sample)>1.5&&Math.min(...sample)<-4);
  assert(Math.max(...curvature)>.05&&Math.min(...curvature)<-.05);
  console.log('T2 '+JSON.stringify({distinct:signatures.size,recurve:[Math.min(...sample),Math.max(...sample)],
    secondDifference:[Math.min(...curvature),Math.max(...curvature)]}));
});

test('T3 · balayages admissibles des neuf axes, contraintes et valeurs latentes', ()=>{
  const values={colourMode:'independent',height:63,spacing:47};
  const solved=browsFor(portrait,null,values,{},true);
  let points=0;
  for (const key of Object.keys(browControls)) {
    const domain=solved.domains[key];
    assert(domain.length>2,key);
    assert(intervalsOf(domain,1).length>=1);
    const rendered=domain.map(value=>pieces(render({...values,[key]:value}))[1].d);
    assert.equal(new Set(rendered).size,domain.length,key);
    points+=domain.length;
  }
  const start={length:125,spacing:100,thickness:220,arc:100,height:0,tilt:-20,summit:78,taper:0,colourMode:'independent'};
  const limited=browsFor({...portrait,...morphs[4]},'crescent',start,{},true);
  assert.equal(limited.requested.length,125);
  assert.equal(limited.requested.height,0);
  assert(limited.effective.length<125||limited.effective.height>0);
  const restored=browsFor(portrait,null,{...limited.requested,spacing:0,height:95,tilt:0});
  assert.equal(restored.effective.length,125);
  assert.equal(restored.effective.thickness,220);
  const straight=browsFor(portrait,null,{arc:0,summit:79,angularity:92},{},true);
  assert.deepEqual(straight.domains.summit,[]);
  assert.deepEqual(straight.domains.angularity,[]);
  assert.equal(straight.requested.summit,79);
  assert.equal(straight.effective.summit,null);
  assert.equal(render({arc:0,summit:22,angularity:1}),render({arc:0,summit:77,angularity:90}));
  const unlatched=browsFor(portrait,null,{...straight.requested,arc:51});
  assert.equal(unlatched.effective.summit,79);
  console.log('T3 '+JSON.stringify({points,limited:limited.effective,lengthDomain:intervalsOf(limited.domains.length,1)}));
});

test('T4 · 26 couleurs héritées, modes et fallback cheveux invisibles', ()=>{
  assert.equal(palette.length,26);
  const style={style:'p5-038',arrangement:'G'};
  for (const {id,fill} of palette) {
    assert.equal(pieces(render({colourMode:'independent',colour:id},style))[0].fill,fill);
    assert.equal(pieces(render({colourMode:'linked'},style,{hairColor:id}))[0].fill,fill);
    const darker=pieces(render({colourMode:'darker'},style,{hairColor:id}))[0].fill;
    assert(luminance(darker)<luminance(fill));
    assert.deepEqual(rgb(darker).map(n=>Math.round(n*255)),
      rgb(fill).map(n=>Math.round(n*255*.88)));
  }
  assert.equal(pieces(render({},style))[0].fill,model(style).cut.color);
  for (const hairless of [portrait,{style:'p5-063',arrangement:'G'}]) {
    const memory=browsFor(hairless,null,{}, {rememberedHairColor:'bleu-vif'});
    assert.equal(memory.pigment.fill,'#3b66e3');
    assert.equal(memory.pigment.source,'remembered');
    assert.equal(pieces(render({},hairless,{rememberedHairColor:'bleu-vif'}))[0].fill,memory.pigment.fill);
    assert.equal(pieces(render({},hairless))[0].fill,'#75470f');
  }
  const latent=browsFor(style,null,{colour:'violet-amethyste'});
  assert.equal(latent.effective.colour,null);
  assert.equal(latent.requested.colour,'violet-amethyste');
});

test('T5 · absence prioritaire, pont continu, fente fixe entièrement découpée', ()=>{
  const request={...browPresets.round.values,colourMode:'independent',colour:'brun-chocolat'};
  const absence={...request,absent:true,monobrow:true,slit:true};
  const hidden=browsFor(portrait,null,absence,{},true);
  assert.equal(hidden.effective.monobrow,null);
  assert.equal(hidden.effective.slit,null);
  assert.equal(hidden.requested.monobrow,true);
  assert(Object.values(hidden.domains).every(domain=>domain.length===0));
  assert.equal(pieces(render(absence)).length,0);
  assert.equal(render(absence),render({absent:true}));
  const bounds=points=>[Math.min(...points.map(p=>p[0])),Math.max(...points.map(p=>p[0]))];
  for (const monobrow of [false,true]) {
    const normal=pieces(render({...request,monobrow}));
    const cut=browsFor(portrait,null,{...hidden.requested,absent:false,slit:true,monobrow});
    assert.equal(cut.effective.colour,request.colour);
    const split=pieces(render(cut.requested));
    assert.equal(normal.length,monobrow?1:2);
    assert.equal(split.length,normal.length+1);
    assert.equal(split.at(-1).side,'right-tip');
    const gap=bounds(split.at(-1).points)[0]-bounds(split.at(-2).points)[1];
    assert(Math.abs(gap-cut.frame.length*.058)<2e-6);
    assert.equal(bounds(split[0].points)[0],bounds(normal[0].points)[0]);
    if (monobrow) {
      const center=split[0].points.filter(p=>Math.abs(p[0]-cut.frame.cx)<1e-7);
      assert.equal(center.length,2);
      assert(Math.abs(center[0][1]-center[1][1])>.5);
    }
  }
});

function corners() {
  const names=Object.keys(browControls);
  const out=[];
  for (let i=0;i<24;i++) {
    out.push(Object.fromEntries(names.map((key,axis)=>{
      const bounds=browControls[key];
      return [key,((i*19+axis*3+(i>>>(axis%5)))%7)<3?bounds.min:bounds.max];
    })));
  }
  return out;
}

function oldBrowsRemoved(svg,input) {
  const {head:{rx},anchors:{browLeft,browRight}}=model(input).base;
  const starts=new Set([browLeft,browRight].map(([x,y])=>`${x-(rx*.26)*.9},${y}`));
  let count=0;
  const result=svg.replace(/<path d="M([^ ]+) Q[^"]+" fill="none" stroke="[^"]+" stroke-width="2\.2"[^>]*\/>/g,(tag,start)=>{
    if (!starts.has(start)) return tag;
    count++;
    return '';
  });
  assert.equal(count,2);
  return result;
}

test('T6 · contraintes dans les extrêmes, intégrité des yeux et des 126 coiffures', async ()=>{
  const {character:before}=await frozen('render.mjs');
  let tested=0;
  for (const input of morphs) for (const eyes of eyeList) {
    const face=model(input), opening=eyesFor(input,eyes);
    for (const [i,values] of corners().entries()) {
      const request={...values,monobrow:!!(i%2),slit:i%3===0,colourMode:'independent'};
      const r=solveBrows(face,opening,request);
      assert(r.frame.bottom<opening.face.nose.top);
      const from=pieces(render(request,input,{eyes}));
      assert(from.length>=1);
      for (const piece of from) for (const [x,y] of piece.points) {
        assert(Number.isFinite(x)&&Number.isFinite(y));
        assert(Math.abs(x-r.frame.cx)<=r.frame.halfWidth+6e-7);
        assert(y>=r.frame.top-6e-7&&y<=r.frame.bottom+6e-7);
      }
      if (!request.monobrow&&!request.slit) {
        for (const [j,[x,y]] of from[0].points.entries()) {
          const [xx,yy]=from[1].points[j];
          assert(Math.abs(x+xx-2*r.frame.cx)<1.1e-6);
          assert.equal(y,yy);
        }
      }
      tested++;
    }
  }
  for (const {style,arrangement} of choices) {
    const input={...morphs[3],style,arrangement};
    const opts={eyes:eyeList[tested%eyeList.length],iris:{...iris,heterochromia:tested%2?'central':'complete'},
      details,hairColor:'bleu-vif',instance:'compat-sourcils'};
    const svg=before(input,opts);
    const actual=render({monobrow:tested%2===0,slit:true},input,opts);
    assert.equal(actual.replace(inkPattern,''),oldBrowsRemoved(svg,input));
    const face=actual.indexOf('data-layer="face"');
    const brow=actual.indexOf('data-bio-brows');
    const front=actual.indexOf('data-layer="front"');
    assert(face<brow&&brow<front);
    tested++;
  }
  console.log('T6 '+JSON.stringify({extremes:tested-126,compatible:126}));
});

test('T7 · archives v1 à v3 inchangées, v4 à froid avec graines et précision', async ()=>{
  const {appearanceDocument:before}=await frozen('appearance.mjs');
  const selection=restoreSelection({style:'shaved',body:'bust',...morphs[4],memo:'un'});
  const input=characterInput(selection);
  const draw={seed:'yeux historiques ✦',version:legacyDraw};
  const irisDraw={seed:'iris archivés',version:irisDrawVersion};
  const detailsDraw={seed:'cils archivés',version:detailsDrawVersion};
  const eyes=drawEyes(input,draw.seed,draw.version).values;
  const base={eyes,form:'custom',draw,colour:'bleu-vif',flat:false};
  const pigments={iris:drawIris(input,eyes,irisDraw.seed),irisDraw};
  const ornament={details:drawDetails(input,eyes,detailsDraw.seed),detailsDraw};
  for (const settings of [base,{...base,...pigments},{...base,...pigments,...ornament}]) {
    const old=before(selection,settings);
    assert.deepEqual(appearanceDocument(selection,settings),old);
    const restored=parseAppearance(JSON.stringify(old));
    assert.deepEqual(appearanceDocument(restored.selection,restored),old);
  }
  const browsDraw={seed:'sourcils ✦',version:browDrawVersion};
  const drawn=drawBrows(input,eyes,browsDraw.seed);
  const precise={length:124.333333,thickness:132.946,spacing:97.54,height:0,tilt:-18.82,summit:59.831,slit:true};
  for (const extra of [{brows:precise},{brows:drawn,browsDraw},{browsLatent:drawn,browsDraw},{brows:{...precise,absent:true}}]) {
    const settings={...base,...pigments,...ornament,...extra};
    const doc=appearanceDocument(selection,settings);
    assert.equal(doc.version,4);
    const restored=parseAppearance(JSON.stringify(doc));
    assert.deepEqual(appearanceDocument(restored.selection,restored),doc);
    const portraitOf=(p,s,scale)=>character(p,{...scale,eyes:s.eyes,iris:s.iris,details:s.details,brows:s.brows,
      hairColor:s.flat?s.colour:'historical',rememberedHairColor:s.colour,instance:'brows-archive'});
    for (const scale of scales) assert.equal(portraitOf(characterInput(restored.selection),restored,scale),portraitOf(input,settings,scale));
    if (extra.browsDraw) assert.deepEqual(drawBrows(input,eyes,restored.browsDraw.seed),drawn);
    if (extra.brows===precise) {
      assert.equal(doc.brows.requested.summit,59.831);
      assert(doc.brows.effective.height>0);
      assert.equal(doc.brows.pigment.source,'remembered');
      const broken=structuredClone(doc);
      broken.brows.effective.height=+doc.brows.effective.height.toFixed(2);
      assert.throws(()=>parseAppearance(JSON.stringify(broken)),/incompatibles/i);
    }
  }
});

test('T8 · tirages reproductibles, distributions des états et des bornes utiles', ()=>{
  for (const [name,input,eyes] of [['rasé',portrait,null],['étroit',{...morphs[6],style:'p5-071'},'crescent'],
    ['large',{...morphs[2],style:'p5-063',arrangement:'G'},'upturned']]) {
    const seeds=1024, modes={linked:0,darker:0,independent:0}, combinations=[0,0,0,0,0];
    const colours=Object.fromEntries(palette.map(p=>[p.id,0]));
    let maxHeight=0, expectedMax=0;
    const face=model(input), opening=eyesFor(input,eyes);
    for (let i=0;i<seeds;i++) {
      const seed='brows-'+name+'-'+i;
      const draw=drawBrows(input,eyes,seed);
      assert.deepEqual(drawBrows(input,eyes,seed),draw);
      modes[draw.colourMode]++;
      colours[draw.colour]++;
      combinations[draw.absent?4:Number(draw.monobrow)+2*Number(draw.slit)]++;
      const v=solveBrows(face,opening,draw,{},!draw.absent&&(i%3===0));
      if (draw.absent) {assert.equal(v.effective.absent,true);continue;}
      assert.deepEqual(v.effective,{...normalizeBrows(draw),
        summit:draw.arc===0?null:draw.summit,angularity:draw.arc===0?null:draw.angularity,
        colour:draw.colourMode==='independent'?draw.colour:null});
      if (v.domains) {
        const possible=v.domains.height;
        assert(possible.includes(draw.height));
        if(draw.height===possible.at(-1)) maxHeight++;
        expectedMax+=1/possible.length;
      }
    }
    for (const distribution of [Object.values(modes),combinations,Object.values(colours)]) {
      const e=seeds/distribution.length;
      assert(distribution.every(n=>n>0&&Math.abs(n-e)<5*Math.sqrt(e)));
    }
    assert(Math.abs(maxHeight-expectedMax)<5*Math.sqrt(expectedMax));
    console.log('T8 '+JSON.stringify({name,seeds,modes,combinations,colours,maxHeight,expectedMax}));
  }
});
