import {controls,cuts,presets,normalize} from './model.mjs';
import {character} from './render.mjs';
import {priorityCase} from './coverage.mjs';
const $=s=>document.querySelector(s);
let state=normalize(),preset='neutral',construction=false;
let frame=null;
function update(){
 const options={construction};
 $('#whole').innerHTML=character(state,options);$('#portrait').innerHTML=character(state,{...options,headOnly:true});$('#mini').innerHTML=character(state,options);
 $('#current-name').textContent=cuts[state.cut].name;$('#preset-name').textContent=preset==='ipad'?'Cas signalé sur iPad':preset?presets[preset].name:'Combinaison libre';
 for(const key of Object.keys(controls)){
  $('#'+key).value=state[key];$(`output[for=${key}]`).textContent=state[key].toFixed(2)+' ×';
 }
 for(const b of document.querySelectorAll('#cuts button'))b.setAttribute('aria-pressed',String(b.dataset.cut===state.cut));
 for(const b of document.querySelectorAll('#presets button'))b.setAttribute('aria-pressed',String(b.dataset.preset===preset));
}
const schedule=()=>{if(frame!==null)return;frame=requestAnimationFrame(()=>{frame=null;update()})};
function gallery(){
 $('#gallery').innerHTML=Object.entries(presets).map(([id,p])=>`<div class="sample">${character({cut:state.cut,...p.values},{headOnly:true})}<strong>${p.name}</strong><small>${cuts[state.cut].name}</small></div>`).join('');
}
try{
 const published=location.pathname.includes('/preview/');
 const cat=new URL((published?'../../':'../')+'docs/ai/visual-references/a_clean_infographic_character_design_sheet_in_warm.png',location.href).href;
 $('#catalogue-image').src=cat;$('#catalogue-link').href=cat;
 $('#p2-link').href=new URL(published?'../bio-vis-p2/':'../preview/bio-vis-p2/',location.href).href;
 for(const [id,c]of Object.entries(cuts)){
  const b=document.createElement('button');b.textContent=c.name;b.dataset.cut=id;
  b.addEventListener('click',()=>{state=normalize({...state,cut:id});update();gallery()});$('#cuts').append(b);
 }
 for(const [key,c]of Object.entries(controls)){
  const label=document.createElement('label');label.className='range';label.htmlFor=key;
  label.innerHTML=`<span><span>${c.label}</span><output for="${key}"></output></span><input type="range" id="${key}" min="${c.min}" max="${c.max}" step="0.01">`;
  label.querySelector('input').addEventListener('input',e=>{state=normalize({...state,[key]:Number(e.target.value)});preset=null;schedule()});$('#sliders').append(label);
 }
 for(const [id,p]of Object.entries(presets)){
  const b=document.createElement('button');b.dataset.preset=id;b.textContent=p.name;
  b.addEventListener('click',()=>{state=normalize({cut:state.cut,...p.values});preset=id;update()});$('#presets').append(b);
 }
 $('#priority').addEventListener('click',()=>{state=normalize(priorityCase);preset='ipad';update();gallery()});
 $('#reset').addEventListener('click',()=>{state=normalize({cut:state.cut});preset='neutral';update()});
 $('#construction').addEventListener('change',e=>{construction=e.target.checked;update()});update();gallery();
}catch(error){$('#error').hidden=false;console.error(error)}
