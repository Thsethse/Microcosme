import {choices,ordinaryChoices,groups,choice,primaryKey,provenance,dossiers} from './catalogue.mjs';
import {restoreSelection,exportSelection,selectOrdinary} from './selection.mjs';
import {character as after} from './render.mjs';
import {character as before} from '../preview/bio-vis-dedup-lot-2/render.mjs';
import {controls,bodies,presets} from '../preview/bio-vis-p5-i6/model.mjs';
import {priorityCase} from '../preview/bio-vis-p5-i6/i5/i4/i3/i2/i1/base/r1/coverage.mjs';
import {targets} from './hair.mjs';
const sources=await fetch('./references/provenance.json').then(r=>{if(!r.ok)throw Error('Références indisponibles');return r.json();});
const q=s=>document.querySelector(s),esc=s=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('"','&quot;'),axes=Object.keys(controls);
let selection=restoreSelection({style:'p5-061',arrangement:'G',body:'standard',contrast:true,accessories:true,monochrome:false,origin:'Exemple historique conservé'}),morph={},body='standard',serial=0,queued=false;
const label=e=>e.label+' · '+e.name;
function options(id,entries){for(const [value,text]of entries){const o=document.createElement('option');o.value=value;o.textContent=text;q(id).append(o);}}
options('#ordinary',ordinaryChoices.map(e=>[e.key,label(e)]));options('#historical',choices.map(e=>[e.key,label(e)]));options('#body',Object.entries(bodies).map(([k,v])=>[k,v.name]));
const morphs={neutral:{name:'Neutre',values:{}},ipad:{name:'Cas iPad combiné',values:Object.fromEntries(axes.map(k=>[k,priorityCase[k]]))},tall:presets.tall,broad:presets.broad,min:{name:'Tous les minima',values:Object.fromEntries(axes.map(k=>[k,controls[k].min]))},max:{name:'Tous les maxima',values:Object.fromEntries(axes.map(k=>[k,controls[k].max]))}};
options('#preset',Object.entries(morphs).map(([k,p])=>[k,p.name]));options('#preset',[['free','Combinaison libre']]);q('#preset option[value=free]').disabled=true;
options('#dossier-select',[...dossiers.map(d=>[d.id,d.id+' · '+d.title]),['all','Tous les dossiers']]);
for(const d of dossiers){const b=document.createElement('button');b.dataset.dossier=d.id;b.textContent=d.id;b.addEventListener('click',()=>{q('#dossier-select').value=d.id;renderComparisons();q('#compare').scrollIntoView();});q('#dossier-buttons').append(b);}
for(const [id,c]of Object.entries(controls)){
 const l=document.createElement('label');l.innerHTML=esc(c.label)+`<output id="out-${id}"></output><input type="range" data-control="${id}" min="${c.min}" max="${c.max}" step="0.01" value="1" aria-label="${esc(c.label)}">`;
 l.querySelector('input').addEventListener('input',e=>{q('#preset').value='free';selection=restoreSelection({...selection.raw,[id]:+e.target.value});syncMorph();schedule();});q('#controls').append(l);
}
function syncMorph(){morph=Object.fromEntries(axes.map(k=>[k,selection.state[k]]));body=selection.state.body;q('#body').value=body;for(const k of axes){q(`[data-control="${k}"]`).value=morph[k];q('#out-'+k).textContent=morph[k].toFixed(2).replace('.',',');}}
function svg(key,renderer,view='head',input={},historic=false){
 const e=choice(key),state={...input,style:e.style,arrangement:e.arrangement==='U'?'G':e.arrangement};
 if(!historic)Object.assign(state,{monochrome:true,accessories:false,contrast:false});
 const frame=view==='head'?'-30 -65 220 225':view==='mini'?'-35 -68 230 245':'-40 -85 240 355';
 const doc=new DOMParser().parseFromString(renderer(state,{headOnly:view!=='tile',smallScale:view==='mini',instance:'lot3-ui-'+(++serial)}),'image/svg+xml'),root=doc.documentElement;root.setAttribute('viewBox',frame);
 if(!historic){const hair='[data-layer=rear],[data-layer=back],[data-layer=volume],[data-layer=front],[data-layer=sides],[data-layer=texture],[data-layer=lengths]';for(const n of root.querySelectorAll('path,circle,ellipse,rect,polygon,line,polyline'))if(!n.closest('defs')&&n.closest(hair)){if(n.getAttribute('fill')!=='none')n.setAttribute('fill','#9d7b47');if(n.hasAttribute('stroke')&&n.getAttribute('stroke')!=='none')n.setAttribute('stroke','#4c3822');}if(['pony','braids','side_braid'].includes(e.style)){const w=e.style==='pony'?'4':'3.3';root.querySelectorAll(`[data-layer=rear] path[stroke-width="${w}"],[data-layer=lengths] path[stroke-width="${w}"]`).forEach(n=>n.remove());}}
 return new XMLSerializer().serializeToString(root);
}
function sizes(key,renderer,input,historic=false){return `<div class="head">${svg(key,renderer,'head',input,historic)}</div><p class="meta">Tête · 300 px</p><div class="sizes"><div class="tile">${svg(key,renderer,'tile',input,historic)}</div><p class="meta">Entier · 178 px</p><div class="mini">${svg(key,renderer,'mini',input,historic)}</div><p class="meta">Miniature · 70 × 70 px</p></div>`;}
function original(key){const e=choice(key),s=sources[e.label],p=provenance(key);return `<figure class="original"><a href="${s.runtimeBoard}" target="_blank" rel="noopener"><img src="${s.crop}" width="${s.rectangle[2]}" height="${s.rectangle[3]}" alt="Illustration capillaire originale ${e.label}, ${s.board} ${s.position}"></a><figcaption>Original · ${s.board} ${s.position}, vignette ${s.arrangement==='G'?'gauche':'droite'}<br>Seuls les cheveux servent de référence.</figcaption></figure><p class="source"><a href="${p.documentURL}" target="_blank" rel="noopener">Fiche originale ${e.label} ↗</a></p>`;}
function renderComparisons(){
 const id=q('#dossier-select').value,shown=dossiers.filter(d=>id==='all'||d.id===id),input={...morph,body};
 q('#dossier-note').textContent=id==='all'?'Les cinq dossiers sont affichés. 54-G, 69-G, 49-G et 62-D sont des témoins inchangés.':shown[0].note;
 for(const b of document.querySelectorAll('[data-dossier]'))b.setAttribute('aria-pressed',String(b.dataset.dossier===id));
 q('#case-cards').innerHTML=shown.map(d=>`<section class="dossier" data-case="${d.id}"><h3>${d.id} · ${d.title}</h3>${id==='all'?'<p class="notice">'+d.note+'</p>':''}<div class="case-grid">${d.keys.map(key=>{const e=choice(key),changed=targets.includes(key);return `<article class="case-card" data-key="${key}" data-changed="${changed}"><h3>${esc(label(e))}</h3><p class="meta">${e.style} / ${e.arrangement} · ${changed?'Correction locale du lot 3':'Témoin historique inchangé'}</p>${original(key)}<div class="before-after"><div class="before"><h4>Avant le lot 3</h4>${sizes(key,before,input)}</div><div class="after"><h4>${changed?'Après le lot 3':'Après · inchangé'}</h4>${sizes(key,after,input)}</div></div><button data-history="${key}" type="button">Ouvrir ${e.label} dans le contrôle historique</button></article>`;}).join('')}</div></section>`).join('');
}
function renderSelection(){
 const e=choice(selection.key),p=choice(selection.visibleKey),historic=q('#show-original').checked;
 q('#ordinary').value=p.key;q('#historical').value=e.key;q('#selected-render').dataset.key=e.key;
 q('#selection-info').textContent=`Identifiant conservé : ${e.style} / ${e.arrangement} (${e.label}). Entrée ordinaire affichée : ${p.label}. Le rendu reste celui de ${e.label}.`+(e.key==='p5-061:G'?' Ses deux mèches historiques restent présentes.':'');
 q('#selected-render').innerHTML=`<div><h3>Avant le lot 3 · ${e.label}</h3>${sizes(e.key,before,selection.state,historic)}</div><div class="after"><h3>Après le lot 3 · ${e.label}</h3>${sizes(e.key,after,selection.state,historic)}</div>`;
 q('#selection-json').value=exportSelection(selection);
}
function renderCatalogue(){if(!q('#catalogue-panel').open)return;const input={...morph,body};q('#catalogue-grid').innerHTML=ordinaryChoices.map(e=>{const group=groups.find(g=>g.primary===e.key);return `<article class="catalogue-card" data-key="${e.key}"><h4>${esc(label(e))}</h4>${svg(e.key,after,'tile',input)}<p class="meta">${group?'Principal '+group.primaryLabel+' · historique '+group.secondaryLabel:'Choix indépendant'}</p><button data-history="${e.key}" type="button">Ouvrir ${e.label}</button>${group?'<button data-history="'+group.secondary+'" type="button">Historique '+group.secondaryLabel+'</button>':''}</article>`;}).join('');}
function renderWitnesses(){const input={...morph,body};q('#lot1-cards').innerHTML=['p5-058:G','p5-024:D','p5-068:G','p5-058:D'].map(key=>`<article data-key="${key}"><h3>${choice(key).label}</h3><div class="before-after"><div><h4>Lot 1 avant le lot 3</h4><div class="head">${svg(key,before,'head',input)}</div></div><div><h4>Lot 1 après le lot 3</h4><div class="head">${svg(key,after,'head',input)}</div></div></div></article>`).join('');}
function render(){renderComparisons();renderSelection();renderCatalogue();renderWitnesses();}
function schedule(){if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;render();});}
function setSelection(raw){selection=restoreSelection(raw);syncMorph();q('#selection-error').textContent='';render();}
q('#dossier-select').addEventListener('change',renderComparisons);
q('#preset').addEventListener('change',()=>{const raw={...selection.raw};for(const k of axes)delete raw[k];setSelection({...raw,...morphs[q('#preset').value].values});});
q('#body').addEventListener('change',()=>setSelection({...selection.raw,body:q('#body').value}));
q('#ordinary').addEventListener('change',()=>{selection=selectOrdinary(q('#ordinary').value,selection.raw);renderSelection();});
q('#choose-ordinary').addEventListener('click',()=>{selection=selectOrdinary(q('#ordinary').value,selection.raw);renderSelection();q('#selection-message').textContent='Nouveau choix du principal effectué explicitement.';});
q('#load-history').addEventListener('click',()=>{const e=choice(q('#historical').value);setSelection({...selection.raw,style:e.style,arrangement:e.arrangement==='U'?'G':e.arrangement});});
q('#show-original').addEventListener('change',renderSelection);
q('#export').addEventListener('click',()=>{q('#selection-json').value=exportSelection(selection);q('#selection-message').textContent='Données historiques conservées, sans remplacer l’identifiant.';});
q('#reload').addEventListener('click',()=>{try{setSelection(JSON.parse(q('#selection-json').value));q('#selection-message').textContent='Aller-retour réussi, identifiant conservé.';}catch(e){q('#selection-error').textContent='Sélection non chargée : '+e.message;}});
q('#catalogue-panel').addEventListener('toggle',renderCatalogue);
q('#case-cards').addEventListener('click',openHistory);q('#catalogue-grid').addEventListener('click',openHistory);
function openHistory(event){const b=event.target.closest('[data-history]');if(!b)return;const e=choice(b.dataset.history);setSelection({...selection.raw,style:e.style,arrangement:e.arrangement==='U'?'G':e.arrangement});q('#history').scrollIntoView();}
const hash=location.hash.slice(1);if(dossiers.some(d=>d.id===hash))q('#dossier-select').value=hash;
syncMorph();render();
