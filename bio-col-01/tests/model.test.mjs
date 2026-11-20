import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {palette,swatch,contour,oklab,luminance,contrast} from '../palette.mjs';
import {character,hairLayers} from '../render.mjs';
import {character as before,hairLayers as oldHair} from '../../preview/bio-vis-dedup-lot-3/render.mjs';
import {choices,ordinaryChoices,groups,primaryKey} from '../catalogue.mjs';
import * as baselineCatalogue from '../../preview/bio-vis-dedup-lot-3/catalogue.mjs';
import {restoreSelection,exportSelection} from '../selection.mjs';
import * as baselineSelection from '../../preview/bio-vis-dedup-lot-3/selection.mjs';
import {protectedTies} from '../paint.mjs';
import {controls,bodies,presets} from '../../preview/bio-vis-p5-i6/model.mjs';
import {priorityCase} from '../../preview/bio-vis-p5-i6/i5/i4/i3/i2/i1/base/r1/coverage.mjs';
const args=e=>({style:e.style,arrangement:e.arrangement==='U'?'G':e.arrangement});
const options=[{},{headOnly:true},{headOnly:true,smallScale:true}];
const morphs=[{},priorityCase,presets.tall.values,presets.broad.values,Object.fromEntries(Object.entries(controls).map(([k,c])=>[k,c.min])),Object.fromEntries(Object.entries(controls).map(([k,c])=>[k,c.max]))];
const withoutPaint=s=>s.replace(/\s(?:fill|stroke)="[^"]*"/g,'');
function groupsOf(svg){const tokens=[...svg.matchAll(/<g\b[^>]*>|<\/g>/g)],stack=[],found=[];for(const t of tokens){if(!t[0].startsWith('</')){if(!t[0].endsWith('/>'))stack.push(t);}else{const open=stack.pop();found.push({tag:open[0],text:svg.slice(open.index,t.index+t[0].length)});}}return found;}
function protectedMarkup(svg){return groupsOf(svg).filter(g=>/data-layer="(?:face|color|accessories[^"]*)"|class="body-shape"/.test(g.tag)).map(g=>g.text);}
test('129 fichiers hérités conservés avec leurs empreintes ; même API de géométrie et de catalogue',()=>{
 const files=JSON.parse(readFileSync(new URL('./frozen-manifest.json',import.meta.url)));assert.equal(files.length,129);for(const f of files)assert.equal(createHash('sha256').update(readFileSync(new URL('../../'+f.path,import.meta.url))).digest('hex'),f.sha256,f.path);
 assert.equal(hairLayers,oldHair);assert.equal(choices,baselineCatalogue.choices);assert.equal(ordinaryChoices,baselineCatalogue.ordinaryChoices);assert.equal(primaryKey,baselineCatalogue.primaryKey);assert.equal(restoreSelection,baselineSelection.restoreSelection);assert.equal(exportSelection,baselineSelection.exportSelection);assert.equal(choices.length,126);assert.equal(new Set(choices.map(e=>e.style)).size,72);assert.equal(ordinaryChoices.length,120);assert.equal(groups.length,6);
});
test('26 teintes finies : 14 naturelles, 12 fantaisie ; contour déterministe plus sombre et hue cohérente',()=>{
 assert.equal(palette.length,26);assert.equal(new Set(palette.map(p=>p.id)).size,26);assert.equal(palette.filter(p=>p.category==='natural').length,14);assert.equal(palette.filter(p=>p.category==='fantasy').length,12);assert.equal(new Set(palette.map(p=>p.family)).size,13);
 for(const p of palette){assert.equal(contour(p.fill),p.stroke);for(let i=0;i<10;i++)assert.equal(contour(p.fill),p.stroke);assert.match(p.stroke,/^#[0-9a-f]{6}$/);assert(luminance(p.stroke)<luminance(p.fill));assert(contrast(p.fill,p.stroke)>=1.35,p.id);const [L,a,b]=oklab(p.fill),[D,c,d]=oklab(p.stroke);assert(D<L-.1);if(Math.hypot(a,b)>.015)assert((a*c+b*d)/(Math.hypot(a,b)*Math.hypot(c,d))>.98,p.id+' hue');assert.equal(swatch(p.id),p);}
 assert.throws(()=>swatch('unknown'),RangeError);assert.throws(()=>contour('#fff'),RangeError);
});
test('sans couleur, historique explicite ou null : 2 268 rendus historiques conservés exactement',()=>{
 let n=0;for(const e of choices)for(const p of morphs)for(const o of options){const input={...args(e),...p,accessories:true,contrast:true},baseline=before(input,o);assert.equal(character(input,o),baseline);assert.equal(character(input,{...o,hairColor:'historical'}),baseline);assert.equal(character(input,{...o,hairColor:null}),baseline);n++;}assert.equal(n,2268);
});
test('6 552 colorations : seule la peinture change, aucun autre attribut ni calque protégé modifié',()=>{
 let count=0;for(const e of choices)for(const enabled of [true,false]){const input={...args(e),accessories:enabled,contrast:enabled,monochrome:false},snapshot=JSON.stringify(input),old=before(input),protectedOld=protectedMarkup(old),geometry=withoutPaint(old);for(const p of palette){const out=character(input,{hairColor:p.id});assert.equal(withoutPaint(out),geometry,e.key+' '+p.id);assert.deepEqual(protectedMarkup(out),protectedOld,e.key+' non-hair');for(const tie of protectedTies(input))if(old.includes(tie))assert(out.includes(tie),e.key+' tie');assert(!/NaN|Infinity|undefined/.test(out));assert.equal(JSON.stringify(input),snapshot);count++;}}assert.equal(count,6552);
});
test('trois tailles, six corps et huit paramètres : chemins et ancrages inchangés',()=>{
 const keys=['classic:U','braids:U','pony:U','side_braid:U','waist_waves:U','p5-058:G','p5-024:D','p5-068:G','p5-058:D','p5-071:G','p5-019:D','p5-021:D','p5-056:D','p5-061:D','p5-029:G','p5-034:G','p5-051:G'];
 let count=0;for(const key of keys){const e=choices.find(e=>e.key===key);for(const p of morphs)for(const body of Object.keys(bodies))for(const o of options){const input={...args(e),...p,body,accessories:true,contrast:true};assert.equal(withoutPaint(character(input,{...o,hairColor:'noir-profond'})),withoutPaint(before(input,o)),key);count++;}}assert.equal(count,1836);
});
test('les quatre liens P4 et les couches de contraste 50-G/62-D ne sont pas recolorés',()=>{
 for(const [style,expected]of [['braids',2],['pony',1],['side_braid',1]])for(const p of morphs){const input={...p,style,monochrome:false},ties=protectedTies(input);assert.equal(ties.size,expected);for(const o of options){const old=before(input,o),out=character(input,{...o,hairColor:'rose-clair'});for(const tie of ties)if(old.includes(tie))assert(out.includes(tie));}}
 for(const [style,arrangement]of [['p5-050','G'],['p5-062','D']])for(const contrast of [true,false]){const input={style,arrangement,contrast,accessories:true},old=before(input),out=character(input,{hairColor:'bleu-vif'});assert.equal((out.match(/data-feature="contrast-color"/g)||[]).length,contrast?1:0);assert.deepEqual(protectedMarkup(out),protectedMarkup(old));}
});
test('sélections historiques, alias et 61-G : aucun remplacement ni donnée de couleur écrite',()=>{
 for(const e of choices){const raw={...args(e),metadata:{origin:'historical',colour:'keep',unknown:[1,2]},contrast:true},s=restoreSelection(raw),old=JSON.stringify(raw);for(const id of ['noir-profond','blanc-ivoire','rouge-vif'])character(s.state,{hairColor:id});assert.equal(exportSelection(s),JSON.stringify(raw,null,2));assert.equal(JSON.stringify(raw),old);assert.equal(s.key,e.key);assert.equal(s.visibleKey,primaryKey(e.key));}
 for(const g of groups){assert.equal(primaryKey(g.secondary),g.primary);assert(!ordinaryChoices.some(e=>e.key===g.secondary));}
 const s=restoreSelection({style:'p5-061',arrangement:'G'});assert.equal(s.visibleKey,'p5-056:G');assert.equal((character(s.state,{hairColor:'turquoise-clair'}).match(/data-feature="loose-lock"/g)||[]).length,2);
});
