import assert from 'node:assert/strict';
import {test} from 'node:test';
import {execFileSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {appearanceDocument, characterInput, parseAppearance} from '../appearance.mjs';
import {choices, restoreSelection} from '../catalogue.mjs';
import {detailControls, detailsDrawVersion, detailsFor, detailsMarkup, drawDetails, skinDetailColour} from '../details.mjs';
import {drawEyes, legacyDraw} from '../draw.mjs';
import {eyePresets, eyesFor} from '../eyes.mjs';
import {drawIris, intervalsOf, irisDrawVersion} from '../iris.mjs';
import {character} from '../render.mjs';
import {controls, presets} from '../../preview/bio-vis-p5-i6/model.mjs';
import {priorityCase} from '../../preview/bio-vis-p5-i6/i5/i4/i3/i2/i1/base/r1/coverage.mjs';

const root=fileURLToPath(new URL('../..',import.meta.url)).replace(/\/$/,'');
const previous='a93a82c34fcfd9df6d5d9222efa957d2b756127e';
async function frozen(file) {
  const source=execFileSync('git',['-c','safe.directory='+root,'show',previous+':bio-yeux-01/'+file],
    {cwd:root,encoding:'utf8'});
  const module=source.replace(/(from )'([^']+)'/g,(_,from,path)=>from+JSON.stringify(new URL('../'+path,import.meta.url).href));
  return import('data:text/javascript;base64,'+Buffer.from(module).toString('base64'));
}

const scales=[{headOnly:true},{},{headOnly:true,smallScale:true}];
const eyesList=[null,...Object.keys(eyePresets)];
const extremes=bound=>Object.fromEntries(Object.entries(controls).map(([k,range])=>[k,range[bound]]));
const morphs=[{},presets.tall.values,presets.broad.values,priorityCase,extremes('min'),extremes('max'),
  {...extremes('min'),forehead_width:1.14,jowls:1.35},
  {...extremes('min'),forehead_width:1.14,jowls:1.35,skull_height:1.18}];
const iris={irisSize:140,irisRatio:1.25,outline:9,pupilSize:80,pupilShape:'ring',primary:'vert',
  secondary:'violet',heterochromia:'central',secondarySize:78};
const ink=svg=>[...svg.matchAll(/<g data-bio-details="[^"]+".+?<\/g><\/g><\/g>/g)].map(m=>m[0]);
const layer=(svg,key)=>ink(svg).flatMap(mark=>[...mark.matchAll(new RegExp('<path data-eye-detail="'+key+'"[^>]+/>','g'))].map(m=>m[0]));
const artwork=svg=>ink(svg).flatMap(mark=>[...mark.matchAll(/<path data-eye-detail="[^"]+"[^>]*? d="([^"]+)" fill="([^"]+)"\/>/g)]
  .map(([,d,fill])=>[d,fill]));
const maxValues=bound=>Object.fromEntries(Object.entries(detailControls).map(([group,axes])=>[group,
  Object.fromEntries(Object.entries(axes).map(([key,control])=>[key,control[bound]]))]));
const withAxis=(data,group,key,value)=>({...data,[group]:{...data[group],[key]:value}});
const active={...maxValues('max'),contours:{upper:90,lower:80},lashes:{count:3,length:9,spacing:40}};
const parsePoints=d=>[...d.matchAll(/(-?[\d.]+),(-?[\d.]+)/g)].map(([,x,y])=>[+x,+y]);

test('T1 · historique SVG exact sur 126 références, trois échelles et trois états hérités', async ()=>{
  const {character:before}=await frozen('render.mjs');
  assert.equal(choices.length,126);
  for (const {style,arrangement} of choices) {
    const input={...morphs[2],style,arrangement:arrangement==='U'?'G':arrangement};
    for (const scale of scales) for (const opts of [{},{eyes:'round',hairColor:'bleu-vif',eyeEnvelopes:true},{eyes:'narrow',iris}]) {
      const settings={...scale,...opts,instance:'frozen-details'};
      const expected=before(input,settings);
      assert.equal(character(input,{...settings,details:null}),expected);
      assert.equal(character(input,{...settings,details:'historical'}),expected);
    }
  }
});

test('T2 · géométrie commune et indépendance des plis 0, 1 et 2', ()=>{
  for (const upper of [0,1,2]) for (const lower of [0,1,2]) {
    const details={...active,upper:{...active.upper,count:upper},lower:{...active.lower,count:lower}};
    const svg=character({}, {eyes:'narrow',details});
    assert.equal(layer(svg,'upper-fold').length,2*upper);
    assert.equal(layer(svg,'lower-fold').length,2*lower);
  }
  for (const group of ['upper','lower']) {
    const mark=group+'-fold';
    for (const axis of ['distance','length','curve','thickness','intensity']) {
      const {min,max}=detailControls[group][axis];
      const render=value=>layer(character({}, {eyes:'narrow',details:withAxis(active,group,axis,value)}),mark);
      assert.notDeepEqual(render(min),render(max),group+' '+axis);
    }
  }
  const distinct=[];
  for (const set of [{count:0},{count:1,length:53,thickness:21,intensity:25},{count:1,length:92,thickness:49,intensity:79},
    {count:1,length:94,thickness:100,intensity:93},{count:1,length:22,thickness:65,intensity:72},{count:2,length:85}]) {
    distinct.push(JSON.stringify(layer(character({}, {eyes:'narrow',details:{upper:set}}),'upper-fold')));
  }
  assert.equal(new Set(distinct).size,6);
});

function radiusAt(points,theta) {
  const direction=[Math.cos(theta),Math.sin(theta)];
  const cross=(a,b)=>a[0]*b[1]-a[1]*b[0];
  let radius=0;
  for (let i=0,j=points.length-1;i<points.length;j=i++) {
    const a=points[j], b=points[i], segment=[b[0]-a[0],b[1]-a[1]];
    const denominator=cross(direction,segment);
    if (Math.abs(denominator)<1e-12) continue;
    const t=cross(a,direction)/denominator;
    if (t>=-1e-10&&t<=1+1e-10) radius=Math.max(radius,cross(a,segment)/denominator);
  }
  return radius;
}

test('T3 · un contour noir fermé, pointes intégrées, effilées et en miroir', ()=>{
  let cases=0;
  for (const morph of morphs) for (const eyes of eyesList) {
    const contours={upper:98,lower:79};
    const plain=detailsFor(morph,eyes,{contours,lashes:{count:0}});
    for (const spacing of [0,100]) for (const count of [0,1,2,3]) {
      const result=detailsFor(morph,eyes,{contours,lashes:{count,spacing,length:15}});
      const ring=result.scene.polygon;
      const applied=result.effective.lashes.count;
      const effects=ring.slice(0,-65).map(([x,y])=>[x,Math.hypot(x,y)-radiusAt(plain.scene.polygon,Math.atan2(y,x))]);
      const added=effects.map(([x,d])=>x>0&&d>.05);
      const tips=added.filter((yes,i)=>yes&&!added[i-1]).length;
      assert.equal(tips,applied,JSON.stringify({eyes,spacing,count,applied}));
      assert(effects.every(([x,d])=>d<.05||x>0),'Une pointe doit suivre la direction de la tempe');
      const shape=[];
      for (const i of [0,1]) {
        const html=detailsMarkup(result,i,'M0,0Z','t3-'+i,'#dbbf88');
        const path=html.match(/data-eye-detail="contour" data-lash-count="(\d+)" d="([^"]+)" fill="#171713"/);
        assert.equal(+path[1],applied);
        assert.match(path[2],/^M[^M]+Z$/);
        assert.doesNotMatch(html,/<line|stroke=|gradient|animation|<image/);
        shape.push(parsePoints(path[2]));
      }
      assert.equal(shape[0].length,shape[1].length);
      const [left,right]=result.frame.envelopes;
      for (const [i,[x,y]] of shape[0].entries()) {
        const [otherX,otherY]=shape[1][i];
        assert(Math.abs((left.x-x)-(otherX-right.x))<1.1e-5);
        assert(Math.abs(y-otherY)<1.1e-5);
      }
      cases++;
    }
  }
  console.log('T3 '+JSON.stringify({cases}));
});

test('T4 · cernes et poches indépendants, aplats dérivés de trois tons de peau', ()=>{
  const shade=(intensity,volume)=>character({},{details:{shadows:{intensity,volume}}});
  assert.equal(layer(shade(84,0),'puff').length,0);
  assert.equal(layer(shade(0,79),'dark-circle').length,0);
  assert.equal(layer(shade(84,0),'dark-circle').length,2);
  assert.equal(layer(shade(0,79),'puff').length,2);
  const dark=layer(shade(84,79),'dark-circle'),puff=layer(shade(84,79),'puff');
  assert.notEqual(dark[0].match(/d="([^"]+)"/)[1],puff[0].match(/d="([^"]+)"/)[1]);
  const skins=['#f4cfb6','#dbbf88','#573222'];
  const result=detailsFor({},null,{shadows:{intensity:80,volume:90}});
  const colours=skins.map(skin=>{
    const svg=detailsMarkup(result,0,'M0,0Z','test',skin);
    const payload=[...svg.matchAll(/data-eye-detail="(dark-circle|puff)" d="[^"]+" fill="(rgb[^"]+)"/g)].map(m=>m[2]);
    assert.equal(payload.length,2);
    assert.notEqual(payload[0],payload[1]);
    for (const fill of payload) {
      const sum=fill.slice(4,-1).split(',').map(Number).reduce((a,b)=>a+b);
      const base=(skin.match(/[0-9a-f]{2}/g)).map(c=>parseInt(c,16)).reduce((a,b)=>a+b);
      assert(sum<base);
    }
    return payload.join('/');
  });
  assert.equal(new Set(colours).size,3);
  assert.equal(skinDetailColour('#f4cfb6',0,.5),'rgb(244,207,182)');
});

test('T5 · balayage des crans utiles et restauration des valeurs latentes', ()=>{
  let ticks=0, visibleChanges=0, narrowed=0;
  for (const [group,axes] of Object.entries(detailControls)) for (const [key,axis] of Object.entries(axes)) {
    const start=detailsFor({},'narrow',active,true);
    const seen=new Set();
    for (const n of start.domains[group][key]) {
      const request=withAxis(active,group,key,n);
      const width=detailsFor({},'narrow',request,true);
      const actual=width.effective[group][key];
      if (actual!==null&&Math.abs(actual-n)<1e-8) {
        const draw=character({}, {eyes:'narrow',details:request});
        seen.add(JSON.stringify(artwork(draw)));
      }
      ticks++;
    }
    assert(seen.size>=Math.min(2,start.domains[group][key].length),group+' '+key);
    visibleChanges+=seen.size;
  }
  const request={...active,upper:{...active.upper,count:2,distance:91.375,intensity:82},
    lashes:{count:3,length:15,spacing:48},contours:{upper:250,lower:200}};
  const tight=detailsFor(morphs[4],null,request,true);
  const ample=detailsFor(morphs[2],'narrow',tight.requested,true);
  assert(tight.effective.lashes.length<tight.requested.lashes.length);
  assert.equal(ample.effective.lashes.length,15);
  assert.equal(ample.effective.upper.distance,91.375);
  assert.equal(tight.requested.upper.count,2);
  for (const morph of morphs) for (const eyes of eyesList) {
    const result=detailsFor(morph,eyes,request,true);
    if (result.domains.lashes.length.length<11) narrowed++;
    const intervals=intervalsOf(result.domains.lashes.spacing,1);
    for (const [min,max] of intervals) assert(min<=max);
  }
  const inactive=detailsFor({},'narrow',{upper:{count:0,curve:77},lower:{count:1,intensity:0},
    lashes:{count:1,spacing:71},shadows:{intensity:0,puffWidth:61}},true);
  assert.deepEqual(inactive.domains.upper.curve,[]);
  assert.deepEqual(inactive.domains.lower.thickness,[]);
  assert.deepEqual(inactive.domains.lashes.spacing,[]);
  assert.deepEqual(inactive.domains.shadows.width,[]);
  assert.deepEqual(inactive.domains.shadows.puffWidth,[]);
  assert.equal(inactive.requested.upper.curve,77);
  assert.equal(inactive.requested.lashes.spacing,71);
  console.log('T5 '+JSON.stringify({ticks,visibleChanges,narrowed,tightLength:tight.effective.lashes.length,
    tightSpacing:intervalsOf(tight.domains.lashes.spacing,1)}));
});

test('T6 · 72 combinaisons morphologie/ouverture et masque BIO-YEUX-02 intact', async ()=>{
  const {character:before}=await frozen('render.mjs');
  let cases=0;
  for (const morph of morphs) for (const eyes of eyesList) {
    const input={...morph,style:'p5-061',arrangement:'G'};
    for (const pigment of [null,{...iris,heterochromia:'complete'},iris]) {
      const options={eyes,iris:pigment,instance:'detail-mask',hairColor:'bleu-vif'};
      const old=before(input,options), now=character(input,{...options,details:maxValues('max')});
      assert.equal(ink(now).length,2);
      const beforeGeometry=eyesFor(input,eyes);
      for (const [i,markup] of ink(now).entries()) {
        const protect=markup.match(/clip-rule="evenodd" d="[^"]+Z (M[^"]+Z)"/);
        assert(protect,'découpage extérieur');
        if (eyes) assert.equal(protect[1],beforeGeometry.shapes[i].path);
        else {
          const {x,y}=beforeGeometry.face.envelopes[i], {width,height}=beforeGeometry.face.reference;
          assert.equal(protect[1],`M${x},${y}m${-width/2},0 a${width/2},${height/2} 0 1 0 ${width},0 a${width/2},${height/2} 0 1 0 ${-width},0Z`);
        }
      }
      let stripped=now.replace(/<g data-bio-details="[^"]+".+?<\/g><\/g><\/g>/g,'');
      if (eyes) stripped=stripped.replace(/(<path d="[^"]+" fill="#ebebeb")\/>/g,'$1 stroke="#171713" stroke-width="0.8" stroke-linejoin="round"/>');
      assert.equal(stripped,old);
      const result=detailsFor(input,eyes,maxValues('max'));
      assert(result.scene.polygon.every(p=>p.every(Number.isFinite)));
      const opening=eyesFor(input,eyes);
      const [left,right]=opening.face.envelopes;
      assert.deepEqual(result.frame.envelopes,[left,right]);
      cases++;
    }
  }
  console.log('T6 '+JSON.stringify({cases}));
});

test('T7 · précision, état latent, graine dédiée et archives v1/v2 exactes', async ()=>{
  const {appearanceDocument:before}=await frozen('appearance.mjs');
  const selection=restoreSelection({style:'p5-061',arrangement:'G',...morphs[4],body:'bust',memo:'un'});
  const input=characterInput(selection);
  const seed='anciens yeux', eyeDraw={seed,version:legacyDraw};
  const base={eyes:drawEyes(input,seed,legacyDraw).values,form:'custom',draw:eyeDraw,colour:'bleu-vif',flat:true};
  const seeded={seed:'iris ✧',version:irisDrawVersion};
  for (const extra of [{},{iris:drawIris(input,base.eyes,seeded.seed),irisDraw:seeded}]) {
    const settings={...base,...extra};
    const old=before(selection,settings);
    assert.deepEqual(appearanceDocument(selection,settings),old);
    const restored=parseAppearance(JSON.stringify(old));
    assert.deepEqual(appearanceDocument(restored.selection,restored),old);
  }
  const detailsDraw={seed:'paupières ✧',version:detailsDrawVersion};
  const random=drawDetails(input,base.eyes,detailsDraw.seed);
  const precise={...active,lashes:{count:3,length:15,spacing:49.517},
    upper:{...active.upper,distance:17.314159},shadows:{intensity:76.999,width:67.678,height:83,volume:98,puffWidth:58.11}};
  for (const extra of [{details:precise},{details:random,detailsDraw},{detailsLatent:random,detailsDraw}]) {
    const settings={...base,iris,...extra};
    const doc=appearanceDocument(selection,settings);
    assert.equal(doc.version,3);
    const restored=parseAppearance(JSON.stringify(doc));
    assert.deepEqual(appearanceDocument(restored.selection,restored),doc);
    const render=(portrait,s,scale)=>character(portrait,{...scale,eyes:s.eyes,details:s.details,
      iris:s.iris,hairColor:s.colour,instance:'archive-details'});
    for (const scale of scales) assert.equal(render(characterInput(restored.selection),restored,scale),render(input,settings,scale));
    if (extra.details===precise) {
      assert.equal(doc.details.requested.shadows.volume,98);
      assert.equal(doc.details.effective.shadows.puffWidth,58.11);
      const altered=structuredClone(doc);
      altered.details.effective.shadows.puffWidth=58;
      assert.throws(()=>parseAppearance(JSON.stringify(altered)),/incompatibles/i);
    }
    if (extra.detailsDraw) assert.deepEqual(drawDetails(input,restored.eyes,restored.detailsDraw.seed),random);
  }
});

test('T8 · 3 072 graines, échantillonnage dans les domaines disponibles sans repli', ()=>{
  for (const [name,portrait,eyes] of [['historique',morphs[4],null],['étroit',morphs[1],'narrow'],
    ['demi-lune',morphs[3],'crescent']]) {
    const seeds=1024;
    const observed={upper:[0,0,0],lower:[0,0,0],lashes:[0,0,0,0],topMax:0,bottomMax:0,lengthMax:0};
    const expected=structuredClone(observed);
    for (let i=0;i<seeds;i++) {
      const seed='detail-'+name+'-'+i;
      const draw=drawDetails(portrait,eyes,seed);
      assert.deepEqual(drawDetails(portrait,eyes,seed),draw);
      const {effective,domains}=detailsFor(portrait,eyes,draw,true);
      for (const [group,axes] of Object.entries(effective)) for (const [axis,value] of Object.entries(axes)) {
        if (value===null) continue;
        assert.equal(value,draw[group][axis],seed+' '+group+' '+axis);
        assert(domains[group][axis].includes(value),seed+' '+group+' '+axis);
      }
      for (const key of ['upper','lower','lashes']) {
        const points=domains[key].count;
        observed[key][draw[key].count]++;
        for (const v of points) expected[key][v]+=1/points.length;
      }
      for (const [measure,group,key] of [['topMax','contours','upper'],['bottomMax','contours','lower'],['lengthMax','lashes','length']]) {
        const points=domains[group][key];
        if (!points.length) continue;
        if (draw[group][key]===points.at(-1)) observed[measure]++;
        expected[measure]+=1/points.length;
      }
    }
    for (const key of ['upper','lower','lashes']) observed[key].forEach((n,i)=>assert(Math.abs(n-expected[key][i])<=5*Math.sqrt(expected[key][i]),key));
    for (const key of ['topMax','bottomMax','lengthMax']) assert(Math.abs(observed[key]-expected[key])<=5*Math.sqrt(expected[key]),key);
    console.log('T8 '+JSON.stringify({name,seeds,observed,expected}));
  }
});
