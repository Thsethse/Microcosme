import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,readdirSync} from 'node:fs';
import {styles,references,lotA,lotB,lotC,lotD,lotE,lotF,controls,bodies,normalize,model} from './model.mjs';
import {character,hairLayers} from './render.mjs';
import {character as priorCharacter} from './i5/render.mjs';
import {model as priorModel} from './i5/model.mjs';
import {hairLayers as priorHair} from './i5/hair.mjs';
import {model as baseModel} from './i5/i4/i3/i2/i1/base/model.mjs';
const keys=Object.keys(controls),corners=Array.from({length:256},(_,mask)=>Object.fromEntries(keys.map((k,i)=>[k,controls[k][mask&(1<<i)?'max':'min']])));
const paths=s=>[...s.matchAll(/ d="([^"]+)"/g)].map(x=>[...x[1].matchAll(/-?\d+(?:\.\d+)?(?:e[-+]?\d+)?/gi)].map(v=>+v[0]));
const hairKeys=['back','volume','front','sides','texture','lengths'];
test('72 références cumulées, 18 choix F, trois arrangements partiellement observés, aucun lot suivant',()=>{
 assert.equal(Object.keys(styles).length,72);assert.equal(Object.keys(lotA).length,9);assert.equal(Object.keys(lotF).length,9);assert.equal(Object.keys(controls).length,8);assert.equal(Object.keys(bodies).length,6);
 assert.deepEqual(Object.values(lotF).map(r=>r.number),Array.from({length:9},(_,i)=>64+i));
 for(const id of ['p5-073','p5-081','unknown'])assert.throws(()=>normalize({style:id}),RangeError);
 const signatures=[];
 for(const style of Object.keys(lotF))for(const arrangement of ['G','D']){
  const m=model({style,arrangement,monochrome:true}),h=hairLayers(m);
  signatures.push(JSON.stringify(hairKeys.map(k=>h[k])));
  assert.ok(character(m.state).includes(`data-reference="${style}" data-arrangement="${arrangement}"`));
 }
 assert.equal(new Set(signatures).size,16);
});
test('le socle P5-I5 et ses modules A/B/C/P4-R1 sont des copies exactes du snapshot publié',()=>{
 function walk(dir,prefix=''){
  for(const entry of readdirSync(dir,{withFileTypes:true})){
   const name=prefix+entry.name;
   if(entry.isDirectory())walk(new URL(entry.name+'/',dir),name+'/');
   else assert.deepEqual(readFileSync(new URL(name,new URL('./i5/',import.meta.url))),readFileSync(new URL('../preview/bio-vis-p5-i5/'+name,import.meta.url)),name);
  }
 }
 walk(new URL('./i5/',import.meta.url));
});
test('27 648 états antérieurs : les 18 coiffures P4 et 90 arrangements A/B/C/D/E v1 sont strictement inchangés aux trois échelles',()=>{
 for(const style of Object.keys(styles).filter(id=>!lotF[id]))for(const arrangement of style.startsWith('p5-')?['G','D']:['G'])for(const p of corners){
  const state={...p,style,arrangement};
  for(const options of [{},{headOnly:true},{headOnly:true,smallScale:true}])assert.equal(character(state,options),priorCharacter(state,options));
 }
});
test('4 608 états F : visage, ancres et huit axes inchangés, SVG finis, mêmes longueurs aux trois échelles',()=>{
 for(const style of Object.keys(lotF))for(const arrangement of ['G','D'])for(const p of corners){
  const state={...p,style,arrangement},m=model(state),old=baseModel({...p,style:'classic'}),h=hairLayers(m);
  assert.equal(m.outline,old.outline);assert.deepEqual(m.base.anchors,old.base.anchors);assert.deepEqual(m.anchors,old.anchors);assert.deepEqual(m.hairAnchors,old.hairAnchors);
  for(const options of [{},{headOnly:true},{headOnly:true,smallScale:true}]){
   const svg=character(state,options);assert.ok(!/NaN|Infinity|undefined/.test(svg));assert.ok(svg.includes(`<g data-layer="lengths">${h.lengths}</g>`));
   for(const ns of paths(svg))assert.ok(ns.every(Number.isFinite));
  }
 }
});
test('continuité locale des dix-huit arrangements sur huit axes et 21 points de chaque intervalle',()=>{
 for(const style of Object.keys(lotF))for(const arrangement of ['G','D'])for(const key of keys)for(let i=0;i<=20;i++){
  const v=controls[key].min+(controls[key].max-controls[key].min)*i/20,aa=paths(character({style,arrangement,[key]:v})),bb=paths(character({style,arrangement,[key]:v+1e-6}));
  assert.equal(aa.length,bb.length,style+arrangement+key);
  for(let j=0;j<aa.length;j++){assert.equal(aa[j].length,bb[j].length);for(let k=0;k<aa[j].length;k++)assert.ok(Math.abs(aa[j][k]-bb[j][k])<.01,style+arrangement+key);}
 }
});
test('tresses, couettes, couronne étagée et parties occultées sans calotte inventée',()=>{
 for(const p of corners){
  const layers=(n,a,accessories=true)=>hairLayers(model({...p,style:'p5-0'+n,arrangement:a,accessories}));
  for(const n of [64,66,67,71])assert.equal((layers(n,'D').lengths.match(/data-feature="braid"/g)||[]).length,2);
  assert.equal((layers(67,'G').lengths.match(/data-feature="low-pigtail"/g)||[]).length,2);
  assert.match(layers(72,'D').back,/tiered-crown/);assert.equal((layers(72,'D').back.match(/data-feature="braid"/g)||[]).length,3);
  assert.equal((layers(72,'G').front.match(/data-feature="temple-row"/g)||[]).length,3);
  for(const [n,a]of [[66,'G'],[66,'D'],[67,'D']])for(const accessories of [true,false]){
   const h=layers(n,a,accessories);assert.equal(h.volume,'');assert.equal(h.back,'');assert.equal(h.policy.mode,'partial');assert.match(h.front,/clip-path/);assert.match(character({...p,style:'p5-0'+n,arrangement:a,accessories}),/data-hair-status="partial"/);
   assert.equal(Boolean(h.cover||h.accessories||h.backAccessories),accessories);
  }
 }
});
test('quatre reprises intégrales existantes et équivalence capillaire 64-G / 70-G',()=>{
 for(const p of corners){
  for(const [n,a,old,oa]of [[65,'D',48,'D'],[68,'G',19,'G'],[69,'G',54,'G'],[71,'G',49,'G']]){
   const now=hairLayers(model({...p,style:'p5-0'+n,arrangement:a})),before=priorHair(priorModel({...p,style:'p5-0'+old,arrangement:oa}));for(const k of hairKeys)assert.equal(now[k],before[k]);
  }
  const aa=hairLayers(model({...p,style:'p5-064',arrangement:'G'})),bb=hairLayers(model({...p,style:'p5-070',arrangement:'G'}));for(const k of hairKeys)assert.equal(aa[k],bb[k]);
 }
});
test('six corps sans déplacement des attaches ; ornements amovibles sans altérer la chevelure',()=>{
 for(const style of Object.keys(lotF))for(const arrangement of ['G','D']){
  const p={style,arrangement},m=model(p),a=hairLayers(m),b=hairLayers(model({...p,accessories:false}));
  for(const body of Object.keys(bodies)){const v=model({...p,body});assert.deepEqual(v.anchors,m.anchors);assert.deepEqual(hairLayers(v),a);}
  for(const k of hairKeys)assert.equal(a[k],b[k],style+arrangement+k);
  for(const state of [{...p,accessories:false},{...p,monochrome:true}]){const h=hairLayers(model(state));assert.equal(h.accessories,'');assert.equal(h.backAccessories,'');assert.equal(h.cover,'');}
 }
 // Braided crowns are hair and must not disappear with ornaments.
 assert.match(hairLayers(model({style:'p5-064',arrangement:'D',monochrome:true})).front,/braided-crown/);
});
test('PNG de la planche F : signature, taille attendue et copie exacte du dépôt',()=>{
 const bytes=readFileSync(new URL('./references/P5-F.png',import.meta.url));
 assert.deepEqual(bytes.subarray(0,8),Buffer.from([137,80,78,71,13,10,26,10]));assert.equal(bytes.readUInt32BE(16),1536);assert.equal(bytes.readUInt32BE(20),1024);
 assert.deepEqual(bytes,readFileSync(new URL('../docs/ai/visual-references/132E23ED-C1DE-4311-8BAF-B56E09277B56.png',import.meta.url)));
});
