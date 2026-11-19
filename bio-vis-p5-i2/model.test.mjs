import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,readdirSync} from 'node:fs';
import {styles,references,lotA,lotB,controls,bodies,normalize,model} from './model.mjs';
import {character,hairLayers} from './render.mjs';
import {character as priorCharacter} from './i1/render.mjs';
import {model as baseModel} from './i1/base/model.mjs';
const keys=Object.keys(controls),corners=Array.from({length:256},(_,mask)=>Object.fromEntries(keys.map((k,i)=>[k,controls[k][mask&(1<<i)?'max':'min']])));
const paths=s=>[...s.matchAll(/ d="([^"]+)"/g)].map(x=>[...x[1].matchAll(/-?\d+(?:\.\d+)?(?:e[-+]?\d+)?/gi)].map(v=>+v[0]));
const hairKeys=['back','volume','front','sides','texture','lengths'];
test('36 références cumulées, 18 arrangements B distincts sans bijoux, aucun lot suivant',()=>{
 assert.equal(Object.keys(styles).length,36);assert.equal(Object.keys(lotA).length,9);assert.equal(Object.keys(lotB).length,9);assert.equal(Object.keys(controls).length,8);assert.equal(Object.keys(bodies).length,6);
 assert.deepEqual(Object.values(lotB).map(r=>r.number),Array.from({length:9},(_,i)=>28+i));
 for(const id of ['p5-037','p5-055','p5-081','unknown'])assert.throws(()=>normalize({style:id}),RangeError);
 const signatures=[];
 for(const style of Object.keys(lotB))for(const arrangement of ['G','D']){
  const m=model({style,arrangement,monochrome:true}),h=hairLayers(m);
  signatures.push(JSON.stringify(hairKeys.map(k=>h[k])));
  assert.ok(character(m.state).includes(`data-reference="${style}" data-arrangement="${arrangement}"`));
 }
 assert.equal(new Set(signatures).size,18);
});
test('le socle P5-I1 et ses 15 modules P4-R1 sont des copies exactes du snapshot publié',()=>{
 function walk(dir,prefix=''){
  for(const entry of readdirSync(dir,{withFileTypes:true})){
   const name=prefix+entry.name;
   if(entry.isDirectory())walk(new URL(entry.name+'/',dir),name+'/');
   else assert.deepEqual(readFileSync(new URL(name,new URL('./i1/',import.meta.url))),readFileSync(new URL('../preview/bio-vis-p5-i1/'+name,import.meta.url)),name);
  }
 }
 walk(new URL('./i1/',import.meta.url));
});
test('9 216 états antérieurs : les 18 coiffures P4 et 18 arrangements A sont strictement inchangés aux trois échelles',()=>{
 for(const style of Object.keys(styles).filter(id=>!lotB[id]))for(const arrangement of lotA[style]?['G','D']:['G'])for(const p of corners){
  const state={...p,style,arrangement};
  for(const options of [{},{headOnly:true},{headOnly:true,smallScale:true}])assert.equal(character(state,options),priorCharacter(state,options));
 }
});
test('4 608 états B : visage, ancres et huit axes inchangés, SVG finis, mêmes longueurs aux trois échelles',()=>{
 for(const style of Object.keys(lotB))for(const arrangement of ['G','D'])for(const p of corners){
  const state={...p,style,arrangement},m=model(state),old=baseModel({...p,style:'classic'}),h=hairLayers(m);
  assert.equal(m.outline,old.outline);assert.deepEqual(m.base.anchors,old.base.anchors);assert.deepEqual(m.anchors,old.anchors);assert.deepEqual(m.hairAnchors,old.hairAnchors);
  for(const options of [{},{headOnly:true},{headOnly:true,smallScale:true}]){
   const svg=character(state,options);assert.ok(!/NaN|Infinity|undefined/.test(svg));assert.ok(svg.includes(`<g data-layer="lengths">${h.lengths}</g>`));
   for(const ns of paths(svg))assert.ok(ns.every(Number.isFinite));
  }
 }
});
test('continuité locale des dix-huit arrangements sur huit axes et 21 points de chaque intervalle',()=>{
 for(const style of Object.keys(lotB))for(const arrangement of ['G','D'])for(const key of keys)for(let i=0;i<=20;i++){
  const v=controls[key].min+(controls[key].max-controls[key].min)*i/20,aa=paths(character({style,arrangement,[key]:v})),bb=paths(character({style,arrangement,[key]:v+1e-6}));
  assert.equal(aa.length,bb.length,style+arrangement+key);
  for(let j=0;j<aa.length;j++){assert.equal(aa[j].length,bb[j].length);for(let k=0;k<aa[j].length;k++)assert.ok(Math.abs(aa[j][k]-bb[j][k])<.01,style+arrangement+key);}
 }
});
test('tresses continues : départs reliés aux tempes ; entrelacs, couronnes et boucles présents aux trois échelles',()=>{
 for(const p of corners)for(const n of [28,30,32,35])for(const arrangement of ['G','D']){
  const state={...p,style:'p5-0'+n,arrangement},m=model(state),h=hairLayers(m);
  if(n===28)assert.match(h.front,/data-feature="braided-crown"/);
  if(n===30)assert.equal((h.lengths.match(/data-feature="open-curls"/g)||[]).length,2);
  if(n===32||n===35){
   const roots=[...h.lengths.matchAll(/data-root="([^"]+)"/g)].map(x=>x[1].split(',').map(Number));
   assert.equal(roots.length,arrangement==='G'?1:2);
   for(const [rx,ry]of roots){assert.ok(Math.abs(Math.abs(rx-80)-m.fit.temple-3)<1e-10);assert.equal(ry,m.fit.forehead+6);}
  }
 }
});
test('six corps sans déplacement des attaches ; ornements amovibles sans altérer la chevelure',()=>{
 for(const style of Object.keys(lotB))for(const arrangement of ['G','D']){
  const p={style,arrangement},m=model(p),a=hairLayers(m),b=hairLayers(model({...p,accessories:false}));
  for(const body of Object.keys(bodies)){const v=model({...p,body});assert.deepEqual(v.anchors,m.anchors);assert.deepEqual(hairLayers(v),a);}
  for(const k of hairKeys)assert.equal(a[k],b[k],style+arrangement+k);
  for(const state of [{...p,accessories:false},{...p,monochrome:true}]){const h=hairLayers(model(state));assert.equal(h.accessories,'');assert.equal(h.backAccessories,'');}
 }
 // Braided crowns are hair and must not disappear with ornaments.
 assert.match(hairLayers(model({style:'p5-028',monochrome:true})).front,/braided-crown/);
});
test('PNG de la planche B : signature, taille attendue et copie exacte du dépôt',()=>{
 const bytes=readFileSync(new URL('./references/P5-B.png',import.meta.url));
 assert.deepEqual(bytes.subarray(0,8),Buffer.from([137,80,78,71,13,10,26,10]));assert.equal(bytes.readUInt32BE(16),1536);assert.equal(bytes.readUInt32BE(20),1024);
 assert.deepEqual(bytes,readFileSync(new URL('../docs/ai/visual-references/0F3CDCE7-24D6-40E4-80D8-4BE2429238AF.png',import.meta.url)));
});
