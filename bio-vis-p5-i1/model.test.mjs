import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,readdirSync} from 'node:fs';
import {styles,references,controls,bodies,normalize,model,geometryKey} from './model.mjs';
import {character,hairLayers} from './render.mjs';
import {character as oldCharacter,layers as oldLayers} from './base/render.mjs';
import {model as oldModel} from './base/model.mjs';
const keys=Object.keys(controls),corners=Array.from({length:256},(_,mask)=>Object.fromEntries(keys.map((k,i)=>[k,controls[k][mask&(1<<i)?'max':'min']])));
const paths=s=>[...s.matchAll(/ d="([^"]+)"/g)].map(x=>[...x[1].matchAll(/-?\d+(?:\.\d+)?(?:e[-+]?\d+)?/gi)].map(v=>+v[0]));
test('neuf références 19–27, deux arrangements accessibles, 18 styles validés et aucune planche B–F',()=>{
 assert.equal(Object.keys(styles).length,27);assert.equal(Object.keys(references).length,9);assert.equal(Object.keys(controls).length,8);assert.equal(Object.keys(bodies).length,6);
 assert.deepEqual(Object.values(references).map(r=>r.number),Array.from({length:9},(_,i)=>19+i));
 assert.throws(()=>normalize({style:'p5-028'}),RangeError);assert.throws(()=>normalize({style:'unknown'}),RangeError);
 const signatures=new Map();
 for(const id of Object.keys(references)){
  const pair=[];
  for(const arrangement of ['G','D']){
   const p={style:id,arrangement,monochrome:true,accessories:false},m=model(p),h=hairLayers(m);
   const signature=JSON.stringify(['back','volume','front','sides','texture','lengths'].map(k=>h[k]));
   pair.push(signature);signatures.set(geometryKey(id,arrangement),signature);
   assert.ok(character(p).includes(`data-reference="${id}" data-arrangement="${arrangement}"`));
  }
  assert.notEqual(pair[0],pair[1],id+' G/D must differ');
 }
 assert.equal(signatures.size,17);assert.equal(new Set(signatures.values()).size,17);
 assert.equal(geometryKey('p5-019','G'),geometryKey('p5-021','G'));
});
test('les 15 modules de base P4-R1 restent identiques aux fichiers publiés',()=>{
 function walk(dir,prefix=''){
  for(const entry of readdirSync(dir,{withFileTypes:true})){
   const name=prefix+entry.name;
   if(entry.isDirectory())walk(new URL(entry.name+'/',dir),name+'/');
   else assert.deepEqual(readFileSync(new URL(name,new URL('./base/',import.meta.url))),readFileSync(new URL('../preview/bio-vis-p4-r1/'+name,import.meta.url)),name);
  }
 }
 walk(new URL('./base/',import.meta.url));
});
test('4 608 états existants : SVG entiers, gros plans et miniatures strictement identiques à P4-R1',()=>{
 for(const style of Object.keys(styles).filter(id=>!references[id]))for(const p of corners){
  const state={...p,style};
  for(const options of [{},{headOnly:true},{headOnly:true,smallScale:true}])assert.equal(character(state,options),oldCharacter(state,options));
 }
});
test('4 608 états nouveaux : même visage et mêmes ancres, chemins valides, longueurs aux trois échelles',()=>{
 for(const style of Object.keys(references))for(const arrangement of ['G','D'])for(const p of corners){
  const state={...p,style,arrangement},m=model(state),old=oldModel({...p,style:'classic'});
  assert.equal(m.outline,old.outline);assert.deepEqual(m.base.anchors,old.base.anchors);assert.deepEqual(m.anchors,old.anchors);assert.deepEqual(m.hairAnchors,old.hairAnchors);
  const h=hairLayers(m),whole=character(state),portrait=character(state,{headOnly:true}),mini=character(state,{headOnly:true,smallScale:true});
  for(const svg of [whole,portrait,mini]){
   assert.ok(!/NaN|Infinity|undefined/.test(svg));assert.ok(svg.includes(`<g data-layer="lengths">${h.lengths}</g>`));
   for(const ns of paths(svg))assert.ok(ns.every(Number.isFinite));
  }
 }
});
test('continuité locale et topologie des dix-huit arrangements sur huit paramètres',()=>{
 for(const style of Object.keys(references))for(const arrangement of ['G','D'])for(const key of keys)for(let i=0;i<=20;i++){
  const v=controls[key].min+(controls[key].max-controls[key].min)*i/20;
  const aa=paths(character({style,arrangement,[key]:v})),bb=paths(character({style,arrangement,[key]:v+1e-6}));
  assert.equal(aa.length,bb.length,style+arrangement+key);
  for(let j=0;j<aa.length;j++){assert.equal(aa[j].length,bb[j].length);for(let k=0;k<aa[j].length;k++)assert.ok(Math.abs(aa[j][k]-bb[j][k])<.01,style+arrangement+key);}
 }
});
test('mutualisations effectives : 19-G/21-G, queue haute 24-D, frange 26-D',()=>{
 const a=hairLayers(model({style:'p5-019',arrangement:'G'})),b=hairLayers(model({style:'p5-021',arrangement:'G'}));assert.deepEqual(a,b);
 const m=model({style:'p5-024',arrangement:'D'}),p=hairLayers(m),old=oldLayers(m.baseState);
 for(const k of ['volume','front','sides','texture','lengths'])assert.equal(p[k],old[k]);
 assert.equal(p.back+p.backAccessories,old.back);
 const f=model({style:'p5-026',arrangement:'D'});assert.equal(hairLayers(f).front,oldLayers(f.baseState).front);
});
test('les six corps ne déplacent ni les attaches ni les mèches ; mode sans accessoires effectif',()=>{
 for(const style of Object.keys(references))for(const arrangement of ['G','D']){
  const p={style,arrangement},a=model(p);
  for(const body of Object.keys(bodies)){const b=model({...p,body});assert.deepEqual(a.anchors,b.anchors);assert.deepEqual(hairLayers(a),hairLayers(b));}
  assert.equal(hairLayers(model({...p,accessories:false})).accessories,'');
  assert.equal(hairLayers(model({...p,monochrome:true})).accessories,'');
  assert.equal(hairLayers(model({...p,accessories:false})).backAccessories,'');
  assert.equal(hairLayers(model({...p,monochrome:true})).backAccessories,'');
 }
});

test('les deux planches A et les références historiques sont des copies exactes du dépôt',()=>{
 for(const [copy,source]of [['P5-A.png','C7BEACBF-323B-4D6F-ABFF-92A988EC909F.png'],['P5-A-alternative.png','DE8951BB-1A2D-41E0-8542-7DDC8E392E27.png'],['inhabitants.png','BIO-VIS-P1-planche-originale.png'],['catalogue-v1.png','a_clean_infographic_character_design_sheet_in_warm.png']])assert.deepEqual(readFileSync(new URL('./references/'+copy,import.meta.url)),readFileSync(new URL('../docs/ai/visual-references/'+source,import.meta.url)));
});
