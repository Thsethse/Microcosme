import {cuts,auditCases,normalize} from './model.mjs';
import {character} from './render.mjs';
const cut=normalize({cut:new URLSearchParams(location.search).get('cut')}).cut;
document.querySelector('#title').textContent=cuts[cut].name+' · limites morphologiques';
for(const item of auditCases()){
 const card=document.createElement('article');card.className='audit-card';
 const p=normalize({cut,...item.values});
 card.innerHTML=character(p,{headOnly:true})+`<p>${item.name}</p><code>${Object.entries(item.values).map(([k,v])=>k+'='+v.toFixed(2)).join(' · ')||'Tous les paramètres à 1,00'}</code>`;
 document.querySelector('#audit-grid').append(card);
}
