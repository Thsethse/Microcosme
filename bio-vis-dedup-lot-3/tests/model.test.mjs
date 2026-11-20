import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {choices,ordinaryChoices,groups,primaryKey,dossiers} from '../catalogue.mjs';
import * as lot2 from '../../preview/bio-vis-dedup-lot-2/catalogue.mjs';
import {restoreSelection,exportSelection} from '../selection.mjs';
import * as lot2Selection from '../../preview/bio-vis-dedup-lot-2/selection.mjs';
import {character,hairLayers} from '../render.mjs';
import {character as before,hairLayers as priorHair} from '../../preview/bio-vis-dedup-lot-2/render.mjs';
import {model,controls,bodies} from '../../preview/bio-vis-p5-i6/model.mjs';
import {coverageCap} from '../../preview/bio-vis-p5-i6/i5/i4/i3/i2/i1/base/r1/coverage.mjs';
import {targets} from '../hair.mjs';
import {axes,corners,morphologies} from './cases.mjs';
const sha=b=>createHash('sha256').update(b).digest('hex');
const args=e=>({style:e.style,arrangement:e.arrangement==='U'?'G':e.arrangement});
const options=[{},{headOnly:true},{headOnly:true,smallScale:true}];
const pathNumbers=h=>[...['front','sides','texture','volume'].flatMap(k=>[...(h[k]||'').matchAll(/ d="([^"]*)"/g)].flatMap(m=>[...m[1].matchAll(/-?\d+(?:\.\d+)?(?:e[-+]?\d+)?/gi)].map(v=>+v[0])))];
test('106 fichiers hérités figés ; références PNG conformes aux empreintes originales',()=>{
 const files=JSON.parse(readFileSync(new URL('./frozen-manifest.json',import.meta.url)));assert.equal(files.length,106);
 for(const f of files)assert.equal(sha(readFileSync(new URL('../../'+f.path,import.meta.url))),f.sha256,f.path);
 const sources=JSON.parse(readFileSync(new URL('../references/provenance.json',import.meta.url)));assert.equal(Object.keys(sources).length,14);
 for(const s of Object.values(sources)){const crop=readFileSync(new URL('../'+s.crop,import.meta.url));assert.equal(crop.subarray(0,8).toString('hex'),'89504e470d0a1a0a');assert.equal(sha(crop),s.cropSHA256);assert.equal(sha(readFileSync(new URL('../'+s.runtimeBoard,import.meta.url))),s.sourceSHA256);assert.equal(s.sourceCommit,'0d8cc1dccea821c14c35ac4addf46bafa753bc86');}
});
test('72 références, 126 choix, 120 entrées : fonctions et alias du lot 2 réutilisés à l’identique',()=>{
 assert.equal(choices,lot2.choices);assert.equal(ordinaryChoices,lot2.ordinaryChoices);assert.equal(primaryKey,lot2.primaryKey);assert.equal(restoreSelection,lot2Selection.restoreSelection);assert.equal(exportSelection,lot2Selection.exportSelection);
 assert.equal(choices.length,126);assert.equal(new Set(choices.map(e=>e.style)).size,72);assert.equal(ordinaryChoices.length,120);assert.equal(groups.length,6);assert.equal(dossiers.length,5);
 for(const g of groups){const [style,arrangement]=g.secondary.split(':'),raw={style,arrangement,contrast:true,accessories:true,metadata:{keep:['original']}};const s=restoreSelection(raw);assert.equal(s.visibleKey,g.primary);assert.equal(s.key,g.secondary);assert.deepEqual(JSON.parse(exportSelection(s)),raw);}
 assert.equal(primaryKey('p5-071:G'),'p5-071:G');
});
test('116 choix hors corrections strictement identiques à la base combinée, dans les trois vues',()=>{
 let count=0;for(const e of choices.filter(e=>!targets.includes(e.key)))for(const p of morphologies.slice(0,6))for(const flags of [{monochrome:true,accessories:false,contrast:false},{monochrome:false,accessories:true,contrast:true}])for(const o of options){const input={...args(e),...p,...flags};assert.equal(character(input,o),before(input,o),e.key);count++;}
 for(const e of choices.filter(e=>!targets.includes(e.key)))for(const body of Object.keys(bodies))for(const o of options){const input={...args(e),body};assert.equal(character(input,o),before(input,o),e.key+' '+body);count++;}
 assert.equal(count,6264);
});
test('dix corrections seulement ; 54-G/69-G, lots 1/2 et versions opposées restent inchangés',()=>{
 assert.deepEqual(targets,['p5-038:G','p5-048:G','p5-071:G','p5-019:D','p5-021:D','p5-056:D','p5-061:D','p5-029:G','p5-034:G','p5-051:G']);
 for(const key of targets){const [style,arrangement]=key.split(':'),input={style,arrangement};assert.notEqual(character(input),before(input),key);const other={style,arrangement:arrangement==='G'?'D':'G'};assert.equal(character(other),before(other));}
 for(const key of ['p5-054:G','p5-069:G','p5-049:G','p5-062:D','p5-058:G','p5-024:D','p5-068:G','p5-058:D','p5-061:G']){const [style,arrangement]=key.split(':');assert.equal(character({style,arrangement}),before({style,arrangement}));}
 assert.equal((character({style:'p5-061',arrangement:'G'}).match(/data-feature="loose-lock"/g)||[]).length,2);
});
test('déterminisme, géométrie finie, cap analytique et ancrages inchangés sur les 256 coins et cas intermédiaires',()=>{
 for(const key of targets){const [style,arrangement]=key.split(':');for(const p of [...corners,...morphologies]){
  const input={...p,style,arrangement,monochrome:true,accessories:false},m=model(input),snapshot=JSON.stringify(m),a=hairLayers(m,'check'),b=hairLayers(m,'check');assert.deepEqual(a,b,key);assert.equal(JSON.stringify(m),snapshot,'model not mutated');assert.equal(a.volume,coverageCap(m));
  const coordinates=pathNumbers(a);assert(coordinates.length>0);assert(coordinates.every(Number.isFinite),key);assert(!/\b(?:NaN|Infinity|undefined)\b/.test(character(input)),key);
  const prior=priorHair(m,'check');for(const k of ['accessories','backAccessories','cover','color','defs'])assert.equal(a[k],prior[k],key+' unchanged '+k);
 }}
});
test('continuité des huit paramètres : topologie stable et déplacement borné autour des valeurs intermédiaires',()=>{
 let pairs=0;for(const key of targets){const [style,arrangement]=key.split(':');for(const p of morphologies.slice(0,6))for(const axis of axes){const value=p[axis]??1,delta=1e-6,aValue=Math.max(controls[axis].min,value-delta),bValue=Math.min(controls[axis].max,value+delta),a=pathNumbers(hairLayers(model({...p,[axis]:aValue,style,arrangement}))),b=pathNumbers(hairLayers(model({...p,[axis]:bValue,style,arrangement})));assert.equal(a.length,b.length,key+' '+axis);assert(Math.max(...a.map((v,i)=>Math.abs(v-b[i])))<.005,key+' '+axis);pairs++;}}
 assert.equal(pairs,480);
});
