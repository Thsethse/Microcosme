import {presets,defaults,choices,bounds,normalize,hopPose} from './model.mjs';
import {character} from './render.mjs';
const $=selector=>document.querySelector(selector);
let parameters=normalize(presets[0]),selected=0,custom=false,running=false,frame=null,elapsed=0,last=null;
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
const duration=6400;
function paint(){
 $('#body').innerHTML=character(parameters);$('#face').innerHTML=character(parameters,{headOnly:true});
 for(const key of Object.keys(choices))$('#'+key).value=parameters[key];
 for(const key of Object.keys(bounds)){
  $('#'+key).value=parameters[key];$(`output[for=${key}]`).textContent=parameters[key].toFixed(2)+' ×';
 }
 $('#identity').textContent=presets[selected].name+(custom?' · variation':'');
 for(const button of document.querySelectorAll('[data-preset]'))button.setAttribute('aria-pressed',String(Number(button.dataset.preset)===selected));
 for(const [i,node]of [...document.querySelectorAll('.walker')].entries()){
  node.innerHTML=character(i===selected?parameters:presets[i]);node.classList.toggle('selected',i===selected);
 }
 layout();
}
function layout(){
 const area=$('#walkers'),width=area.clientWidth;
 for(const [i,node]of [...area.children].entries()){
  const margin=4,available=Math.max(0,width-node.clientWidth-margin*2);
  const initial=i/(presets.length-1);
  const progress=elapsed>0?((elapsed/duration+initial)%2):initial;
  const t=progress>1?2-progress:progress;
  const pose=hopPose(t,margin,available+margin);
  node.style.transform=`translate(${pose.x}px,${running?pose.y:0}px) rotate(${running?pose.tilt:0}deg)`;
 }
}
function tick(time){
 if(!running)return;
 if(last!==null)elapsed+=Math.min(time-last,60);last=time;layout();frame=requestAnimationFrame(tick);
}
function stop(message='Déplacements en pause.'){
 running=false;if(frame!==null)cancelAnimationFrame(frame);frame=null;last=null;
 $('#hop').setAttribute('aria-pressed','false');$('#hop').textContent='Lancer les déplacements';
 $('#motion-status').textContent=message;layout();
}
function start(){
 if(reduced.matches){stop('Animation désactivée : votre appareil demande une réduction des mouvements.');return}
 running=true;last=null;$('#hop').setAttribute('aria-pressed','true');$('#hop').textContent='Mettre en pause';
 $('#motion-status').textContent='Petits bonds en cours · déplacement de démonstration, sans moteur de jeu.';frame=requestAnimationFrame(tick);
}
try{
 const names={belly:'Largeur du ventre',shoulders:'Largeur des épaules',hips:'Largeur des hanches'};
 for(const [key,[min,max]]of Object.entries(bounds)){
  const label=document.createElement('label');label.className='range';label.htmlFor=key;
  label.innerHTML=`<span><span>${names[key]}</span><output for="${key}"></output></span><input id="${key}" type="range" min="${min}" max="${max}" step="0.01">`;
  label.querySelector('input').addEventListener('input',event=>{parameters=normalize({...parameters,[key]:Number(event.target.value)});custom=true;paint()});
  $('#ranges').append(label);
 }
 for(const key of Object.keys(choices))$('#'+key).addEventListener('change',event=>{parameters=normalize({...parameters,[key]:event.target.value});custom=true;paint()});
 presets.forEach((preset,i)=>{
  const button=document.createElement('button');button.className='specimen';button.dataset.preset=i;button.setAttribute('aria-pressed',String(i===selected));
  button.innerHTML=`<span class="specimen-number">0${i+1}</span>${character(preset)}<b>${preset.name}</b><small>${preset.note}</small>`;
  button.addEventListener('click',()=>{selected=i;parameters=normalize(preset);custom=false;paint()});$('#gallery').append(button);
  const node=document.createElement('div');node.className='walker';node.setAttribute('aria-hidden','true');$('#walkers').append(node);
 });
 $('#reset').addEventListener('click',()=>{parameters=normalize(presets[selected]);custom=false;paint()});
 $('#hop').addEventListener('click',()=>running?stop():start());
 reduced.addEventListener('change',()=>{if(reduced.matches)stop('Animation désactivée : réduction des mouvements activée.')});
 document.addEventListener('visibilitychange',()=>{if(document.hidden)stop('Déplacements suspendus pendant votre absence.')});
 window.addEventListener('pagehide',()=>stop());
 new ResizeObserver(layout).observe($('#walkers'));
 paint();if(reduced.matches)stop('Animation désactivée : votre appareil demande une réduction des mouvements.');
}catch(error){$('#error').hidden=false;console.error(error)}
