import {normalize} from './model.mjs';
import {render} from './render.mjs';
const labels={eye_spacing:'Écartement des yeux',eye_width:'Largeur des yeux',nose_width:'Largeur du nez',nose_length:'Longueur du nez',nose_projection:'Projection du nez',mouth_width:'Largeur de la bouche',jaw_width:'Largeur de la mâchoire',chin_length:'Longueur du menton'};
try {
  const response=await fetch(new URL('./reference.json',import.meta.url));
  if(!response.ok)throw new Error(`Reference: ${response.status}`);
  const ref=await response.json();let parameters=normalize(ref),preset='neutral';
  const old=document.querySelector('#old'),construction=document.querySelector('#construction');
  const update=()=>{
    for(const view of ['front','profile'])document.querySelector(`#${view}`).innerHTML=render(ref,view,parameters,{old:old.checked,construction:construction.checked});
    for(const [key,value]of Object.entries(parameters)) {
      document.querySelector(`#${key}`).value=value;
      document.querySelector(`output[for=${key}]`).textContent=value.toFixed(2)+' ×';
    }
    document.querySelector('#identity').textContent=`Identité ${preset==='neutral'?'neutre':preset||'personnalisée'} · ${old.checked?'ancien':'adulte'}`;
    document.querySelector('#construction-note').hidden=!construction.checked;
    for(const button of document.querySelectorAll('[data-preset]'))button.setAttribute('aria-pressed',String(button.dataset.preset===preset));
  };
  for(const [key,[min,,max]]of Object.entries(ref.parameters)) {
    const label=document.createElement('label');label.className='control';label.htmlFor=key;
    label.innerHTML=`<span class="control-head"><span>${labels[key]}</span><output for="${key}"></output></span><input type="range" id="${key}" min="${min}" max="${max}" step="0.01">`;
    label.querySelector('input').addEventListener('input',event=>{parameters=normalize(ref,{...parameters,[key]:Number(event.target.value)});preset=null;update()});
    document.querySelector('#sliders').append(label);
  }
  const select=name=>{parameters=normalize(ref,ref.presets[name]);preset=name;update()};
  for(const button of document.querySelectorAll('[data-preset]'))button.addEventListener('click',()=>select(button.dataset.preset));
  document.querySelector('#reset').addEventListener('click',()=>{old.checked=false;select('neutral')});
  old.addEventListener('change',update);construction.addEventListener('change',update);update();
}catch(error){document.querySelector('#error').hidden=false;console.error(error)}
