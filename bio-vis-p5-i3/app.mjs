import {normalize,styles,references,lotA,lotB,lotC,bodies,controls,presets} from './model.mjs';
import {character} from './render.mjs';
import {priorityCase} from './i2/i1/base/r1/coverage.mjs';
const $=id=>document.getElementById(id);let state=normalize(),pending=false,galleryKey='';
$('style').innerHTML=[[lotC,'P5-C · 37–45'],[lotB,'P5-B · 28–36'],[lotA,'P5-A · 19–27']].map(([lot,label])=>'<optgroup label="'+label+'">'+Object.values(lot).map(s=>`<option value="${s.id}">${s.number} · ${s.name}</option>`).join('')+'</optgroup>').join('')+'<optgroup label="P4-R1 · 18 coiffures validées">'+Object.values(styles).filter(s=>!s.number).map(s=>`<option value="${s.id}">${s.name}</option>`).join('')+'</optgroup>';
$('body').innerHTML=Object.entries(bodies).map(([id,b])=>`<option value="${id}">${b.name}</option>`).join('');
$('controls').innerHTML=Object.entries(controls).map(([id,c])=>`<label class="control" for="${id}"><span>${c.label}<output id="${id}-value" for="${id}">1,00</output></span><input id="${id}" type="range" min="${c.min}" max="${c.max}" step="0.01" value="1"></label>`).join('');
for(const [gallery,lot]of [['lot-gallery',lotC],['lot-b-gallery',lotB],['lot-a-gallery',lotA]])$(gallery).innerHTML=Object.values(lot).map(s=>`<article class="reference-card"><h3><span class="number">${s.number}</span>${s.name}</h3><div class="arrangement-pair">${['G','D'].map(a=>`<button class="arrangement-tile" data-style="${s.id}" data-arrangement="${a}" aria-label="${s.number} · ${s.name}, arrangement ${a}" aria-pressed="false"><span class="thumbnail"></span><strong>${a}</strong></button>`).join('')}</div><p>${s.note}</p></article>`).join('');
$('gallery').innerHTML=Object.values(styles).filter(s=>!s.number).map(s=>`<button class="tile" data-style="${s.id}" aria-pressed="false"><span class="thumbnail"></span><strong>${s.name}</strong></button>`).join('');
function render(){
 pending=false;const s=styles[state.style],isNew=Boolean(references[state.style]),options={construction:$('construction').checked};
 $('whole').innerHTML=character(state,{...options,instance:'whole'});$('portrait').innerHTML=character(state,{...options,headOnly:true,instance:'portrait'});$('mini').innerHTML=character(state,{headOnly:true,smallScale:true,instance:'mini'});
 $('portrait').dataset.long=String(isNew&&s.longArrangements.includes(state.arrangement));$('portrait').dataset.detail=String(!isNew&&['braids','waist_waves'].includes(state.style));
 $('style').value=state.style;$('body').value=state.body;$('arrangements').hidden=!isNew;
 for(const b of $('arrangements').querySelectorAll('button'))b.setAttribute('aria-pressed',String(b.dataset.arrangement===state.arrangement));
 $('monochrome').checked=state.monochrome;$('accessories').checked=state.accessories;$('accessories').disabled=state.monochrome||!isNew;
 $('style-name').textContent=s.name;$('style-note').textContent=s.note;$('origin').textContent=isNew?`${s.number} · ${s.source} · ${s.position} · arrangement ${state.arrangement}`:'P4-R1 · modèle validé';
 $('compare-link').href='comparison.html?reference='+(isNew?state.style:'p5-037');
 for(const k of Object.keys(controls)){$(k).value=state[k];$(k+'-value').value=state[k].toFixed(2).replace('.',',');}
 const key=JSON.stringify([state.body,state.monochrome,state.accessories,...Object.keys(controls).map(k=>state[k])]);
 for(const tile of document.querySelectorAll('[data-style]')){
  tile.setAttribute('aria-pressed',String(tile.dataset.style===state.style&&(!tile.dataset.arrangement||tile.dataset.arrangement===state.arrangement)));
  if(key!==galleryKey)tile.querySelector('.thumbnail').innerHTML=character({...state,style:tile.dataset.style,arrangement:tile.dataset.arrangement||'G'},{instance:'gallery-'+tile.dataset.style+'-'+(tile.dataset.arrangement||'old')});
 }galleryKey=key;
}
const schedule=()=>{if(!pending){pending=true;requestAnimationFrame(render)}};
$('style').addEventListener('change',e=>{state=normalize({...state,style:e.target.value});render()});
$('body').addEventListener('change',e=>{state=normalize({...state,body:e.target.value});render()});
$('arrangements').addEventListener('click',e=>{const b=e.target.closest('[data-arrangement]');if(b){state=normalize({...state,arrangement:b.dataset.arrangement});render()}});
for(const id of ['lot-gallery','lot-b-gallery','lot-a-gallery','gallery'])$(id).addEventListener('click',e=>{const tile=e.target.closest('button[data-style]');if(tile){state=normalize({...state,style:tile.dataset.style,arrangement:tile.dataset.arrangement||state.arrangement});render();$('style').scrollIntoView({block:'start'});$('style').focus({preventScroll:true})}});
for(const k of Object.keys(controls))$(k).addEventListener('input',e=>{state=normalize({...state,[k]:Number(e.target.value)});$('preset-name').textContent='Combinaison libre';schedule()});
for(const b of document.querySelectorAll('[data-preset]'))b.addEventListener('click',()=>{state=normalize({style:state.style,arrangement:state.arrangement,body:state.body,monochrome:state.monochrome,accessories:state.accessories,...presets[b.dataset.preset].values});$('preset-name').textContent=presets[b.dataset.preset].name;render()});
$('priority').addEventListener('click',()=>{state=normalize({...state,...priorityCase});$('preset-name').textContent='Combinaison iPad P5';render()});
$('monochrome').addEventListener('change',e=>{state=normalize({...state,monochrome:e.target.checked,accessories:!e.target.checked});render()});
$('accessories').addEventListener('change',e=>{state=normalize({...state,accessories:e.target.checked});render()});
$('construction').addEventListener('change',render);
$('reset').addEventListener('click',()=>{state=normalize();$('construction').checked=false;$('preset-name').textContent='Neutre';render()});
render();
