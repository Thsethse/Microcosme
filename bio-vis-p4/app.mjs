import {normalize,styles,bodies,controls,presets} from './model.mjs';
import {character} from './render.mjs';
import {priorityCase} from './r1/coverage.mjs';
const $=id=>document.getElementById(id);let state=normalize(),pending=false;
$('style').innerHTML=Object.values(styles).map(s=>`<option value="${s.id}">${s.v1?String(s.v1).padStart(2,'0')+' · ':''}${s.name}</option>`).join('');
$('body').innerHTML=Object.entries(bodies).map(([id,b])=>`<option value="${id}">${b.name}</option>`).join('');
$('controls').innerHTML=Object.entries(controls).map(([id,c])=>`<label class="control" for="${id}"><span>${c.label}<output id="${id}-value" for="${id}">1,00</output></span><input id="${id}" type="range" min="${c.min}" max="${c.max}" step="0.01" value="1"></label>`).join('');
$('gallery').innerHTML=Object.values(styles).map(s=>`<button class="tile" data-style="${s.id}" aria-pressed="false"><span class="thumbnail"></span><small>${s.v1?'V1 · '+String(s.v1).padStart(2,'0'):'EXPLORATION'}</small><strong>${s.name}</strong></button>`).join('');
function render(){
 pending=false;const s=styles[state.style],options={construction:$('construction').checked};
 $('whole').innerHTML=character(state,options);$('portrait').innerHTML=character(state,{...options,headOnly:true});$('mini').innerHTML=character(state,{headOnly:true});
 $('style').value=state.style;$('body').value=state.body;$('monochrome').checked=state.monochrome;
 $('style-name').textContent=s.name;$('style-note').textContent=s.note;$('origin').textContent=s.v1?'Catalogue V1 · '+String(s.v1).padStart(2,'0'):'Exploration P4';
 for(const key of Object.keys(controls)){$(key).value=state[key];$(key+'-value').value=state[key].toFixed(2).replace('.',',');}
 for(const tile of document.querySelectorAll('.tile')){tile.setAttribute('aria-pressed',String(tile.dataset.style===state.style));tile.querySelector('.thumbnail').innerHTML=character({...state,style:tile.dataset.style});}
}
const schedule=()=>{if(!pending){pending=true;requestAnimationFrame(render)}};
$('style').addEventListener('change',e=>{state=normalize({...state,style:e.target.value});render()});
$('body').addEventListener('change',e=>{state=normalize({...state,body:e.target.value});render()});
$('gallery').addEventListener('click',e=>{const tile=e.target.closest('[data-style]');if(tile){state=normalize({...state,style:tile.dataset.style});render();$('style').scrollIntoView({block:'start',behavior:'auto'});$('style').focus({preventScroll:true})}});
for(const key of Object.keys(controls))$(key).addEventListener('input',e=>{state=normalize({...state,[key]:Number(e.target.value)});$('preset-name').textContent='Combinaison libre';schedule()});
for(const button of document.querySelectorAll('[data-preset]'))button.addEventListener('click',()=>{state=normalize({style:state.style,body:state.body,monochrome:state.monochrome,...presets[button.dataset.preset].values});$('preset-name').textContent=presets[button.dataset.preset].name;render()});
$('priority').addEventListener('click',()=>{state=normalize({...state,...priorityCase});$('preset-name').textContent='Combinaison iPad R1';render()});
$('monochrome').addEventListener('change',e=>{state=normalize({...state,monochrome:e.target.checked});render()});
$('construction').addEventListener('change',render);
$('reset').addEventListener('click',()=>{state=normalize();$('construction').checked=false;$('preset-name').textContent='Neutre';render()});
render();
