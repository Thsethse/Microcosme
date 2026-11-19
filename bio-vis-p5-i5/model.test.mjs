import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,readdirSync} from 'node:fs';
import {styles,references,lotA,lotB,lotC,lotD,lotE,controls,bodies,normalize,model} from './model.mjs';
import {character,hairLayers} from './render.mjs';
import {character as priorCharacter} from './i4/render.mjs';
import {model as priorModel} from './i4/model.mjs';
import {hairLayers as priorHair} from './i4/hair.mjs';
import {layers as legacyLayers} from './i4/i3/i2/i1/base/render.mjs';
import {model as baseModel} from './i4/i3/i2/i1/base/model.mjs';
const keys=Object.keys(controls),corners=Array.from({length:256},(_,mask)=>Object.fromEntries(keys.map((k,i)=>[k,controls[k][mask&(1<<i)?'max':'min']])));
const paths=s=>[...s.matchAll(/ d="([^"]+)"/g)].map(x=>[...x[1].matchAll(/-?\d+(?:\.\d+)?(?:e[-+]?\d+)?/gi)].map(v=>+v[0]));
const hairKeys=['back','volume','front','sides','texture','lengths'];
test('63 références cumulées, 18 choix E v1, dont un foulard sans coiffure déduite, aucun lot suivant',()=>{
 assert.equal(Object.keys(styles).length,63);assert.equal(Object.keys(lotA).length,9);assert.equal(Object.keys(lotE).length,9);assert.equal(Object.keys(controls).length,8);assert.equal(Object.keys(bodies).length,6);
 assert.deepEqual(Object.values(lotE).map(r=>r.number),Array.from({length:9},(_,i)=>55+i));
 for(const id of ['p5-064','p5-073','p5-081','unknown'])assert.throws(()=>normalize({style:id}),RangeError);
 const signatures=[];
 for(const style of Object.keys(lotE))for(const arrangement of ['G','D']){
  const m=model({style,arrangement,monochrome:true}),h=hairLayers(m);
  signatures.push(JSON.stringify(hairKeys.map(k=>h[k])));
  assert.ok(character(m.state).includes(`data-reference="${style}" data-arrangement="${arrangement}"`));
 }
 assert.equal(new Set(signatures).size,18);
});
test('le socle P5-I4 et ses modules A/B/C/P4-R1 sont des copies exactes du snapshot publié',()=>{
 function walk(dir,prefix=''){
  for(const entry of readdirSync(dir,{withFileTypes:true})){
   const name=prefix+entry.name;
   if(entry.isDirectory())walk(new URL(entry.name+'/',dir),name+'/');
   else assert.deepEqual(readFileSync(new URL(name,new URL('./i4/',import.meta.url))),readFileSync(new URL('../preview/bio-vis-p5-i4/'+name,import.meta.url)),name);
  }
 }
 walk(new URL('./i4/',import.meta.url));
});
test('23 040 états antérieurs : les 18 coiffures P4 et 72 arrangements A/B/C/D sont strictement inchangés aux trois échelles',()=>{
 for(const style of Object.keys(styles).filter(id=>!lotE[id]))for(const arrangement of (lotA[style]||lotB[style]||lotC[style]||lotD[style])?['G','D']:['G'])for(const p of corners){
  const state={...p,style,arrangement};
  for(const options of [{},{headOnly:true},{headOnly:true,smallScale:true}])assert.equal(character(state,options),priorCharacter(state,options));
 }
});
test('4 608 états E v1 : visage, ancres et huit axes inchangés, SVG finis, mêmes longueurs aux trois échelles',()=>{
 for(const style of Object.keys(lotE))for(const arrangement of ['G','D'])for(const p of corners){
  const state={...p,style,arrangement},m=model(state),old=baseModel({...p,style:'classic'}),h=hairLayers(m);
  assert.equal(m.outline,old.outline);assert.deepEqual(m.base.anchors,old.base.anchors);assert.deepEqual(m.anchors,old.anchors);assert.deepEqual(m.hairAnchors,old.hairAnchors);
  for(const options of [{},{headOnly:true},{headOnly:true,smallScale:true}]){
   const svg=character(state,options);assert.ok(!/NaN|Infinity|undefined/.test(svg));assert.ok(svg.includes(`<g data-layer="lengths">${h.lengths}</g>`));
   for(const ns of paths(svg))assert.ok(ns.every(Number.isFinite));
  }
 }
});
test('continuité locale des dix-huit arrangements sur huit axes et 21 points de chaque intervalle',()=>{
 for(const style of Object.keys(lotE))for(const arrangement of ['G','D'])for(const key of keys)for(let i=0;i<=20;i++){
  const v=controls[key].min+(controls[key].max-controls[key].min)*i/20,aa=paths(character({style,arrangement,[key]:v})),bb=paths(character({style,arrangement,[key]:v+1e-6}));
  assert.equal(aa.length,bb.length,style+arrangement+key);
  for(let j=0;j<aa.length;j++){assert.equal(aa[j].length,bb[j].length);for(let k=0;k<aa[j].length;k++)assert.ok(Math.abs(aa[j][k]-bb[j][k])<.01,style+arrangement+key);}
 }
});
test('rangées, chignon tressé, carré structuré et absence de chevelure inventée sous le foulard',()=>{
 for(const p of corners){
  for(const arrangement of ['G','D']){
   const h=hairLayers(model({...p,style:'p5-055',arrangement}));
   assert.equal((h.front.match(/data-feature="scalp-row"/g)||[]).length,arrangement==='G'?7:9);assert.equal((h.lengths.match(/data-feature="braid"/g)||[]).length,arrangement==='G'?6:4);assert.equal(h.volume,'');
   if(arrangement==='D')assert.match(h.back,/braided-bun/);
   assert.match(hairLayers(model({...p,style:'p5-057',arrangement})).sides,/geometric-bob/);
  }
  for(const accessories of [true,false]){
   const h=hairLayers(model({...p,style:'p5-063',arrangement:'G',accessories}));
   for(const k of hairKeys)assert.equal(h[k],'');assert.equal(h.policy.mode,'unknown');
   assert.equal(Boolean(h.accessories),accessories);assert.equal(Boolean(h.backAccessories),accessories);
   assert.match(character({...p,style:'p5-063',arrangement:'G',accessories}),/data-hair-status="unknown"/);
  }
 }
});
test('couleur séparée de 62-D, quatre reprises documentées et détails conservés',()=>{
 for(const p of corners){
  const a=hairLayers(model({...p,style:'p5-062',arrangement:'D'})),b=hairLayers(model({...p,style:'p5-062',arrangement:'D',contrast:false}));
  assert.ok(a.color);assert.equal(b.color,'');assert.equal(hairLayers(model({...p,style:'p5-062',arrangement:'D',monochrome:true})).color,'');for(const k of hairKeys)assert.equal(a[k],b[k]);
  for(const [number,arrangement,old,oa]of [[58,'G','curls','G'],[58,'D','p5-031','D'],[59,'G','p5-028','G'],[62,'D','p5-049','G']]){const now=hairLayers(model({...p,style:'p5-0'+number,arrangement})),before=old==='curls'?legacyLayers({...p,style:old}):priorHair(priorModel({...p,style:old,arrangement:oa}));for(const k of hairKeys)assert.equal(now[k],before[k]);}
 }
});
test('six corps sans déplacement des attaches ; ornements amovibles sans altérer la chevelure',()=>{
 for(const style of Object.keys(lotE))for(const arrangement of ['G','D']){
  const p={style,arrangement},m=model(p),a=hairLayers(m),b=hairLayers(model({...p,accessories:false}));
  for(const body of Object.keys(bodies)){const v=model({...p,body});assert.deepEqual(v.anchors,m.anchors);assert.deepEqual(hairLayers(v),a);}
  for(const k of hairKeys)assert.equal(a[k],b[k],style+arrangement+k);
  for(const state of [{...p,accessories:false},{...p,monochrome:true}]){const h=hairLayers(model(state));assert.equal(h.accessories,'');assert.equal(h.backAccessories,'');}
 }
 // Braided crowns are hair and must not disappear with ornaments.
 assert.match(hairLayers(model({style:'p5-055',arrangement:'G',monochrome:true})).front,/scalp-row/);
});
test('PNG de la planche E v1 : signature, taille attendue et copie exacte du dépôt',()=>{
 const bytes=readFileSync(new URL('./references/P5-E-v1.png',import.meta.url));
 assert.deepEqual(bytes.subarray(0,8),Buffer.from([137,80,78,71,13,10,26,10]));assert.equal(bytes.readUInt32BE(16),1536);assert.equal(bytes.readUInt32BE(20),1024);
 assert.deepEqual(bytes,readFileSync(new URL('../docs/ai/visual-references/B4099DCA-66B1-4415-8C50-53AA5CFA1C04.png',import.meta.url)));
});
