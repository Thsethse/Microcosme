import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {choices,ordinaryChoices,groups,choice,primaryKey,counterpart,provenance} from '../catalogue.mjs';
import {restoreSelection,exportSelection,selectOrdinary} from '../selection.mjs';
import {character,hairLayers} from '../render.mjs';
import {character as lot1,hairLayers as lot1Hair} from '../../preview/bio-vis-dedup-lot-1/render.mjs';
import {character as p5} from '../../preview/bio-vis-p5-i6/render.mjs';
import {bodies,controls} from '../../preview/bio-vis-p5-i6/model.mjs';
test('99 fichiers hérités inchangés ; aucune fusion ni réécriture de géométrie',()=>{
 const files=JSON.parse(readFileSync(new URL('./frozen-manifest.json',import.meta.url)));assert.equal(files.length,99);
 for(const f of files)assert.equal(createHash('sha256').update(readFileSync(new URL('../../'+f.path,import.meta.url))).digest('hex'),f.sha256,f.path);
 assert.equal(character,lot1);assert.equal(hairLayers,lot1Hair);
});
test('72 références / 126 choix documentaires ; 120 entrées ordinaires exactement, ordre inchangé hors six retraits',()=>{
 assert.equal(choices.length,126);assert.equal(new Set(choices.map(e=>e.style)).size,72);assert.equal(ordinaryChoices.length,120);assert.equal(groups.length,6);
 const secondary=new Set(groups.map(g=>g.secondary));assert.equal(secondary.size,6);
 assert.deepEqual(ordinaryChoices,choices.filter(e=>!secondary.has(e.key)));
 assert.equal(new Set(groups.flatMap(g=>[g.primary,g.secondary])).size,12);
 for(const g of groups){assert.equal(primaryKey(g.primary),g.primary);assert.equal(primaryKey(g.secondary),g.primary);assert(ordinaryChoices.includes(choice(g.primary)));assert(!ordinaryChoices.includes(choice(g.secondary)));assert(choice(g.secondary));}
});
test('six correspondances précises, G/D indépendants et aucune fusion transitive vers 71-G',()=>{
 assert.deepEqual(groups.map(g=>[g.id,g.primary,g.secondary]),[['E03','p5-019:G','p5-021:G'],['E04','p5-028:G','p5-059:G'],['E07','p5-047:G','p5-050:G'],['E09','p5-049:G','p5-062:D'],['E10','p5-064:G','p5-070:G'],['V01','p5-056:G','p5-061:G']]);
 for(const g of groups)for(const key of [g.primary,g.secondary]){const e=counterpart(key);assert.equal(primaryKey(e.key),e.key);assert(ordinaryChoices.includes(e));}
 assert.equal(primaryKey('p5-071:G'),'p5-071:G');assert(ordinaryChoices.includes(choice('p5-071:G')));
 for(const e of choices){const p=provenance(e.key);assert.equal(p.style,e.style);assert.equal(p.name,e.name);assert(p.documentURL.includes('p5-'+String(e.number).padStart(3,'0')));}
});
test('1 512 sélections historiques : aller-retour sans perte des IDs, flags de contraste, champs supplémentaires et six corps',()=>{
 let count=0;for(const e of choices)for(const body of Object.keys(bodies))for(const contrast of [true,false]){
  const raw={style:e.style,arrangement:e.arrangement==='U'?'G':e.arrangement,body,contrast,accessories:true,monochrome:false,forehead_width:1.2,metadata:{origin:'historique',revision:7,colour:'rose',unknown:[1,'conservé']}},snapshot=JSON.stringify(raw),s=restoreSelection(raw);
  assert.deepEqual(JSON.parse(exportSelection(s)),raw);assert.equal(JSON.stringify(raw),snapshot);assert.equal(s.key,e.key);assert.equal(s.state.style,e.style);assert.equal(s.visibleKey,primaryKey(e.key));assert.equal(s.state.forehead_width,controls.forehead_width.max);assert.equal(s.raw.forehead_width,1.2);
  const again=restoreSelection(JSON.parse(exportSelection(s)));assert.deepEqual(again.raw,raw);assert.equal(again.state.style,e.style);count++;
 }assert.equal(count,1512);
 for(const style of ['curls','pony']){const raw={style};assert.deepEqual(restoreSelection(JSON.parse(exportSelection(restoreSelection(raw)))).raw,raw);}
});
test('V01 : rendu historique 61-G distinct toujours accessible, remplacement seulement sur choix explicite',()=>{
 const raw={style:'p5-061',arrangement:'G',contrast:true,body:'bust',note:{keep:'oui'}},s=restoreSelection(raw);
 assert.equal(s.visibleKey,'p5-056:G');assert.equal(s.state.style,'p5-061');assert.equal((character(s.state).match(/data-feature="loose-lock"/g)||[]).length,2);
 const primary=selectOrdinary(s.visibleKey,s.raw);assert.equal(primary.raw.style,'p5-056');assert.deepEqual(primary.raw.note,raw.note);assert.equal((character(primary.state).match(/data-feature="loose-lock"/g)||[]).length,0);assert.equal(s.raw.style,'p5-061');
 assert.throws(()=>selectOrdinary('p5-061:G',s.raw),RangeError);
});
test('quatre corrections du lot 1 présentes, corps et huit paramètres toujours ceux du rendu figé',()=>{
 const morphs=[{},Object.fromEntries(Object.entries(controls).map(([k,c])=>[k,c.min])),Object.fromEntries(Object.entries(controls).map(([k,c])=>[k,c.max]))];
 for(const [style,arrangement]of [['p5-058','G'],['p5-024','D'],['p5-068','G'],['p5-058','D']])for(const p of morphs)for(const body of Object.keys(bodies))for(const options of [{},{headOnly:true},{headOnly:true,smallScale:true}]){const raw={...p,style,arrangement,body},s=restoreSelection(raw);assert.equal(character(s.state,options),lot1(s.state,options));assert.notEqual(character(s.state,options),p5(s.state,options));assert.equal(s.key,style+':'+arrangement);}
});
test('sélections invalides rejetées sans modifier les données précédentes',()=>{
 const old=restoreSelection({style:'p5-061',arrangement:'G',keep:42}),before=exportSelection(old);
 for(const raw of [null,[],{}, {style:'p5-081'},{style:'__proto__'}, {style:'p5-061',arrangement:'X'}])assert.throws(()=>restoreSelection(raw),RangeError);
 assert.equal(exportSelection(old),before);
});
