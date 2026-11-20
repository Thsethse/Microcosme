import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,readdirSync} from 'node:fs';
import {styles,references,lotA,lotB,lotC,lotD,controls,bodies,normalize,model} from './model.mjs';
import {character,hairLayers} from './render.mjs';
import {character as priorCharacter} from './i3/render.mjs';
import {model as baseModel} from './i3/i2/i1/base/model.mjs';
const keys=Object.keys(controls),corners=Array.from({length:256},(_,mask)=>Object.fromEntries(keys.map((k,i)=>[k,controls[k][mask&(1<<i)?'max':'min']])));
const paths=s=>[...s.matchAll(/ d="([^"]+)"/g)].map(x=>[...x[1].matchAll(/-?\d+(?:\.\d+)?(?:e[-+]?\d+)?/gi)].map(v=>+v[0]));
const hairKeys=['back','volume','front','sides','texture','lengths'];
test('54 références cumulées, 18 arrangements D et mutualisations sans bijoux, aucun lot suivant',()=>{
 assert.equal(Object.keys(styles).length,54);assert.equal(Object.keys(lotA).length,9);assert.equal(Object.keys(lotD).length,9);assert.equal(Object.keys(controls).length,8);assert.equal(Object.keys(bodies).length,6);
 assert.deepEqual(Object.values(lotD).map(r=>r.number),Array.from({length:9},(_,i)=>46+i));
 for(const id of ['p5-055','p5-056','p5-081','unknown'])assert.throws(()=>normalize({style:id}),RangeError);
 const signatures=[];
 for(const style of Object.keys(lotD))for(const arrangement of ['G','D']){
  const m=model({style,arrangement,monochrome:true}),h=hairLayers(m);
  signatures.push(JSON.stringify(hairKeys.map(k=>h[k])));
  assert.ok(character(m.state).includes(`data-reference="${style}" data-arrangement="${arrangement}"`));
 }
 assert.equal(new Set(signatures).size,16);
});
test('le socle P5-I3 et ses modules A/B/P4-R1 sont des copies exactes du snapshot publié',()=>{
 function walk(dir,prefix=''){
  for(const entry of readdirSync(dir,{withFileTypes:true})){
   const name=prefix+entry.name;
   if(entry.isDirectory())walk(new URL(entry.name+'/',dir),name+'/');
   else assert.deepEqual(readFileSync(new URL(name,new URL('./i3/',import.meta.url))),readFileSync(new URL('../preview/bio-vis-p5-i3/'+name,import.meta.url)),name);
  }
 }
 walk(new URL('./i3/',import.meta.url));
});
test('18 432 états antérieurs : les 18 coiffures P4 et 54 arrangements A/B/C sont strictement inchangés aux trois échelles',()=>{
 for(const style of Object.keys(styles).filter(id=>!lotD[id]))for(const arrangement of (lotA[style]||lotB[style]||lotC[style])?['G','D']:['G'])for(const p of corners){
  const state={...p,style,arrangement};
  for(const options of [{},{headOnly:true},{headOnly:true,smallScale:true}])assert.equal(character(state,options),priorCharacter(state,options));
 }
});
test('4 608 états D : visage, ancres et huit axes inchangés, SVG finis, mêmes longueurs aux trois échelles',()=>{
 for(const style of Object.keys(lotD))for(const arrangement of ['G','D'])for(const p of corners){
  const state={...p,style,arrangement},m=model(state),old=baseModel({...p,style:'classic'}),h=hairLayers(m);
  assert.equal(m.outline,old.outline);assert.deepEqual(m.base.anchors,old.base.anchors);assert.deepEqual(m.anchors,old.anchors);assert.deepEqual(m.hairAnchors,old.hairAnchors);
  for(const options of [{},{headOnly:true},{headOnly:true,smallScale:true}]){
   const svg=character(state,options);assert.ok(!/NaN|Infinity|undefined/.test(svg));assert.ok(svg.includes(`<g data-layer="lengths">${h.lengths}</g>`));
   for(const ns of paths(svg))assert.ok(ns.every(Number.isFinite));
  }
 }
});
test('continuité locale des dix-huit arrangements sur huit axes et 21 points de chaque intervalle',()=>{
 for(const style of Object.keys(lotD))for(const arrangement of ['G','D'])for(const key of keys)for(let i=0;i<=20;i++){
  const v=controls[key].min+(controls[key].max-controls[key].min)*i/20,aa=paths(character({style,arrangement,[key]:v})),bb=paths(character({style,arrangement,[key]:v+1e-6}));
  assert.equal(aa.length,bb.length,style+arrangement+key);
  for(let j=0;j<aa.length;j++){assert.equal(aa[j].length,bb[j].length);for(let k=0;k<aa[j].length;k++)assert.ok(Math.abs(aa[j][k]-bb[j][k])<.01,style+arrangement+key);}
 }
});
test('locks cylindriques distinctes des tresses, crêtes centrales, rangées séparées et asymétries',()=>{
 for(const p of corners){
  for(const arrangement of ['G','D']){
   const locks=hairLayers(model({...p,style:'p5-052',arrangement}));
   assert.equal((locks.front+locks.lengths).match(/data-feature="lock"/g).length,11);
   assert.ok(!(locks.front+locks.lengths).includes('data-feature="braid"'));
   const crest=hairLayers(model({...p,style:'p5-046',arrangement}));assert.match(crest.front,/central-crest/);assert.equal(crest.policy.mode,'crest');
   for(const n of [47,49,50]){const h=hairLayers(model({...p,style:'p5-0'+n,arrangement}));assert.equal(h.policy.mode,'right-shaved');if(arrangement==='D')assert.match(h.sides,/asymmetric-panel/);}
  }
  const rows=hairLayers(model({...p,style:'p5-053',arrangement:'G'}));assert.equal(rows.volume,'');assert.equal((rows.front.match(/data-feature="scalp-row"/g)||[]).length,5);assert.equal((rows.lengths.match(/data-feature="braid"/g)||[]).length,2);
  const side=hairLayers(model({...p,style:'p5-053',arrangement:'D'}));assert.equal((side.lengths.match(/data-feature="braid"/g)||[]).length,3);
 }
});
test('couleurs et ornements indépendants ; réutilisations 48-G/54-G/38-G et 50-G/47-G',()=>{
 for(const arrangement of ['G','D']){
  const p={style:'p5-050',arrangement},a=hairLayers(model(p)),b=hairLayers(model({...p,contrast:false}));
  assert.ok(a.color.length);assert.equal(b.color,'');assert.equal(hairLayers(model({...p,monochrome:true})).color,'');
  for(const k of hairKeys)assert.equal(a[k],b[k]);
 }
 for(const p of corners){
  for(const [a,b]of [['p5-048','p5-054'],['p5-047','p5-050']]){
   const aa=hairLayers(model({...p,style:a,arrangement:'G'})),bb=hairLayers(model({...p,style:b,arrangement:'G'}));
   for(const k of hairKeys)assert.equal(aa[k],bb[k]);
  }
 }
});
test('six corps sans déplacement des attaches ; ornements amovibles sans altérer la chevelure',()=>{
 for(const style of Object.keys(lotD))for(const arrangement of ['G','D']){
  const p={style,arrangement},m=model(p),a=hairLayers(m),b=hairLayers(model({...p,accessories:false}));
  for(const body of Object.keys(bodies)){const v=model({...p,body});assert.deepEqual(v.anchors,m.anchors);assert.deepEqual(hairLayers(v),a);}
  for(const k of hairKeys)assert.equal(a[k],b[k],style+arrangement+k);
  for(const state of [{...p,accessories:false},{...p,monochrome:true}]){const h=hairLayers(model(state));assert.equal(h.accessories,'');assert.equal(h.backAccessories,'');}
 }
 // Braided crowns are hair and must not disappear with ornaments.
 assert.match(hairLayers(model({style:'p5-053',arrangement:'G',monochrome:true})).front,/scalp-row/);
});
test('PNG de la planche D : signature, taille attendue et copie exacte du dépôt',()=>{
 const bytes=readFileSync(new URL('./references/P5-D.png',import.meta.url));
 assert.deepEqual(bytes.subarray(0,8),Buffer.from([137,80,78,71,13,10,26,10]));assert.equal(bytes.readUInt32BE(16),1536);assert.equal(bytes.readUInt32BE(20),1024);
 assert.deepEqual(bytes,readFileSync(new URL('../docs/ai/visual-references/FAC68E60-6567-4D1A-B299-46A07B836D27.png',import.meta.url)));
});
