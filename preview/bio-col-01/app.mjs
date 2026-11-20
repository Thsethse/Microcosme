import {palette,swatch} from './palette.mjs';
import {character} from './render.mjs';
import {character as historical} from '../bio-vis-dedup-lot-3/render.mjs';
import {choices,ordinaryChoices,choice,groups} from './catalogue.mjs';
import {restoreSelection,selectOrdinary,exportSelection} from './selection.mjs';
import {controls,bodies,presets} from '../bio-vis-p5-i6/model.mjs';
import {priorityCase} from '../bio-vis-p5-i6/i5/i4/i3/i2/i1/base/r1/coverage.mjs';
const q=s=>document.querySelector(s),esc=s=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('"','&quot;'),axes=Object.keys(controls);
let selection=restoreSelection({style:'p5-071',arrangement:'G',body:'standard',accessories:true,contrast:true,monochrome:false,origin:'Exemple historique conservé'}),colour='chatain-clair',category='natural',serial=0,queued=false;
const label=e=>e.label+' · '+e.name;
function options(id,entries){for(const [value,text]of entries){const o=document.createElement('option');o.value=value;o.textContent=text;q(id).append(o);}}
options('#ordinary',ordinaryChoices.map(e=>[e.key,label(e)]));options('#historical',choices.map(e=>[e.key,label(e)]));options('#body',Object.entries(bodies).map(([id,b])=>[id,b.name]));
const morphs={neutral:{name:'Neutre',values:{}},ipad:{name:'Cas iPad combiné',values:Object.fromEntries(axes.map(k=>[k,priorityCase[k]]))},tall:presets.tall,broad:presets.broad,min:{name:'Tous les minima',values:Object.fromEntries(axes.map(k=>[k,controls[k].min]))},max:{name:'Tous les maxima',values:Object.fromEntries(axes.map(k=>[k,controls[k].max]))}};
options('#preset',Object.entries(morphs).map(([id,p])=>[id,p.name]));options('#preset',[['free','Combinaison libre']]);q('#preset option[value=free]').disabled=true;
for(const [id,c]of Object.entries(controls)){const l=document.createElement('label');l.innerHTML=esc(c.label)+`<output id="out-${id}"></output><input type="range" data-control="${id}" min="${c.min}" max="${c.max}" step="0.01" value="1" aria-label="${esc(c.label)}">`;l.querySelector('input').addEventListener('input',e=>{q('#preset').value='free';selection=restoreSelection({...selection.raw,[id]:+e.target.value});sync();schedule();});q('#controls').append(l);}
function input(){return {...selection.state,accessories:selection.raw.accessories!==false,contrast:selection.raw.contrast!==false};}
function svg(key,view='head',id=colour,historic=false){
 const e=choice(key),state={...input(),style:e.style,arrangement:e.arrangement==='U'?'G':e.arrangement},opts={headOnly:view!=='tile',smallScale:view==='mini',instance:'bio-col-'+(++serial)};
 const text=historic?historical(state,opts):character(state,{...opts,hairColor:id});
 const frame=view==='head'?'-30 -65 220 225':view==='mini'?'-35 -68 230 245':'-40 -85 240 355';
 return text.replace(/viewBox="[^"]*"/,`viewBox="${frame}"`);
}
function sizes(key,historic=false){return `<figure><div class="surface head">${svg(key,'head',colour,historic)}</div><figcaption>Tête · 300 px</figcaption></figure><figure><div class="surface tile">${svg(key,'tile',colour,historic)}</div><figcaption>Entier · 178 px</figcaption></figure><figure><div class="surface mini">${svg(key,'mini',colour,historic)}</div><figcaption>Miniature · 70 × 70 px</figcaption></figure>`;}
function sync(){q('#ordinary').value=selection.visibleKey;q('#historical').value=selection.key;q('#body').value=selection.state.body;q('#accessories').checked=selection.raw.accessories!==false;q('#contrast').checked=selection.raw.contrast!==false;for(const k of axes){q(`[data-control="${k}"]`).value=selection.state[k];q('#out-'+k).textContent=selection.state[k].toFixed(2).replace('.',',');}}
function renderSwatches(){q('#swatches').innerHTML=palette.filter(p=>p.category===category).map(p=>`<button class="swatch" type="button" data-colour="${p.id}" aria-pressed="${p.id===colour}" aria-label="${p.name}, ${p.fill}" style="--fill:${p.fill};--stroke:${p.stroke}"><span class="chip" aria-hidden="true"></span><span>${p.name}</span><code>${p.fill}</code></button>`).join('');for(const b of document.querySelectorAll('[data-category]'))b.setAttribute('aria-pressed',String(b.dataset.category===category));}
function renderSelection(){
 const e=choice(selection.key),principal=choice(selection.visibleKey),p=swatch(colour),flat=q('#flat-mode').checked;
 q('#identity-note').textContent=`Identifiant conservé : ${e.style} / ${e.arrangement}. Entrée ordinaire : ${principal.label}.`+(e.key==='p5-061:G'?' Les deux mèches de 61-G restent présentes.':'');
 q('#colour-info').innerHTML=`<strong>${p.name} · ${p.category==='natural'?'Naturelle':'Fantaisie'}</strong>Aplat <code>${p.fill}</code> · contour <code>${p.stroke}</code>${flat?'':'<br>Comparateur en rendu historique : la teinte proposée reste sélectionnée.'}`;
 q('#selected-comparison').className='comparison '+q('#background').value;q('#selected-comparison').dataset.key=e.key;q('#selected-comparison').dataset.colour=colour;
 q('#selected-comparison').innerHTML=`<article class="historical"><h3>Historique · ${e.label}</h3>${sizes(e.key,true)}</article><article class="coloured"><h3>${flat?p.name:'Historique'} · ${e.label}</h3>${sizes(e.key,!flat)}</article>`;
 q('#visibility-note').textContent=e.style==='shaved'?'Cette référence ne montre pas de cheveux à colorer. La teinte reste disponible pour un autre choix.':e.style==='p5-063'&&e.arrangement==='G'?'Les cheveux sont masqués dans cette référence. La couleur n’invente aucun volume sous les objets.':'Les calques de contraste et les accessoires gardent leur rendu historique. La teinte proposée concerne uniquement les surfaces capillaires.';
 q('#selection-json').value=exportSelection(selection);for(const b of document.querySelectorAll('.swatch[data-colour]'))b.setAttribute('aria-pressed',String(b.dataset.colour===colour));
}
function renderSeries(){if(!q('#series-panel').open)return;q('#series-grid').innerHTML=palette.map(p=>`<article class="series-card" data-swatch="${p.id}"><h3>${p.name}</h3><p class="meta">Aplat ${p.fill}<br>Contour ${p.stroke}</p><div class="surface light tile">${svg(selection.key,'tile',p.id)}</div><div class="twins"><div class="surface light mini">${svg(selection.key,'mini',p.id)}</div><div class="surface dark mini">${svg(selection.key,'mini',p.id)}</div></div><button data-pick="${p.id}" type="button">Choisir ${p.name}</button></article>`).join('');}
const variety=['p5-038:G','p5-048:G','curls:U','waist_waves:U','braids:U','p5-041:G','p5-056:D','p5-061:D','p5-071:G','p5-029:G','p5-034:G','p5-051:G','p5-058:G','p5-068:G','p5-024:D','p5-058:D'];
function renderVariety(){const flat=q('#flat-mode').checked,bg=q('#background').value;q('#variety-grid').innerHTML=variety.map(key=>{const e=choice(key);return `<article class="variety-card" data-key="${key}"><h3>${e.label}</h3><p class="meta">${esc(e.name)}</p><div class="surface ${bg} tile">${svg(key,'tile',colour,!flat)}</div><div class="surface ${bg} mini">${svg(key,'mini',colour,!flat)}</div><button data-history="${key}" type="button">Inspecter ${e.label}</button></article>`;}).join('');}
function render(){renderSelection();renderVariety();renderSeries();}
function schedule(){if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;render();});}
function setSelection(raw){selection=restoreSelection(raw);q('#selection-error').textContent='';sync();render();}
function chooseColour(id){swatch(id);colour=id;q('#flat-mode').checked=true;renderSelection();renderVariety();}
q('#palette-tabs').addEventListener('click',e=>{const b=e.target.closest('[data-category]');if(b){category=b.dataset.category;renderSwatches();}});
q('#swatches').addEventListener('click',e=>{const b=e.target.closest('[data-colour]');if(b)chooseColour(b.dataset.colour);});
q('#series-grid').addEventListener('click',e=>{const b=e.target.closest('[data-pick]');if(b){chooseColour(b.dataset.pick);category=swatch(colour).category;renderSwatches();q('#comparison').scrollIntoView();}});
q('#variety-grid').addEventListener('click',e=>{const b=e.target.closest('[data-history]');if(b){const c=choice(b.dataset.history);setSelection({...selection.raw,style:c.style,arrangement:c.arrangement==='U'?'G':c.arrangement});q('#comparison').scrollIntoView();}});
q('#ordinary').addEventListener('change',()=>{selection=selectOrdinary(q('#ordinary').value,selection.raw);sync();render();});
q('#choose-ordinary').addEventListener('click',()=>{selection=selectOrdinary(q('#ordinary').value,selection.raw);sync();render();q('#selection-message').textContent='Entrée principale choisie explicitement.';});
q('#load-history').addEventListener('click',()=>{const e=choice(q('#historical').value);setSelection({...selection.raw,style:e.style,arrangement:e.arrangement==='U'?'G':e.arrangement});});
q('#body').addEventListener('change',()=>setSelection({...selection.raw,body:q('#body').value}));
q('#preset').addEventListener('change',()=>{const raw={...selection.raw};for(const k of axes)delete raw[k];setSelection({...raw,...morphs[q('#preset').value].values});});
for(const flag of ['accessories','contrast'])q('#'+flag).addEventListener('change',()=>setSelection({...selection.raw,[flag]:q('#'+flag).checked}));
q('#flat-mode').addEventListener('change',()=>{renderSelection();renderVariety();});q('#background').addEventListener('change',()=>{renderSelection();renderVariety();});
q('#series-panel').addEventListener('toggle',renderSeries);
q('#export').addEventListener('click',()=>{q('#selection-json').value=exportSelection(selection);q('#selection-message').textContent='Données historiques conservées ; la couleur reste une option de rendu indépendante.';});
q('#reload').addEventListener('click',()=>{try{setSelection(JSON.parse(q('#selection-json').value));q('#selection-message').textContent='Sélection relue, identifiant historique conservé.';}catch(e){q('#selection-error').textContent='Sélection non chargée : '+e.message;}});
sync();renderSwatches();render();
