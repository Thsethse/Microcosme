import {cuts,heads,normalize} from './hair-model.mjs';
import {character} from './hair-render.mjs';
const $=s=>document.querySelector(s);
let state=normalize(),construction=false,isolate='';
function update(){
 const options={construction,isolate};
 $('#whole').innerHTML=character(state,options);$('#portrait').innerHTML=character(state,{...options,headOnly:true});$('#mini').innerHTML=character(state,options);
 $('#current-name').textContent=cuts[state.cut].name;$('#catalog-number').textContent=cuts[state.cut].catalogue;$('#cut-note').textContent=cuts[state.cut].note;
 for(const button of document.querySelectorAll('[data-cut]')){
  if(button.tagName==='BUTTON')button.setAttribute('aria-pressed',String(button.dataset.cut===state.cut&&(!button.dataset.head||button.dataset.head===state.head)));
 }
 for(const button of document.querySelectorAll('#heads button'))button.setAttribute('aria-pressed',String(button.dataset.head===state.head));
}
try{
 const isPreview=location.pathname.includes('/preview/');
 const catalogue=new URL((isPreview?'../../':'../')+'docs/ai/visual-references/a_clean_infographic_character_design_sheet_in_warm.png',location.href).href;
 $('#catalogue-image').src=catalogue;$('#catalogue-link').href=catalogue;
 $('#p1-link').href=new URL(isPreview?'../bio-vis-p1/':'../preview/bio-vis-p1/',location.href).href;
 for(const [id,cut]of Object.entries(cuts)){
  const b=document.createElement('button');b.dataset.cut=id;b.textContent=cut.name;
  b.addEventListener('click',()=>{state=normalize({...state,cut:id});update()});$('#cuts').append(b);
 }
 for(const [id,label]of Object.entries(heads)){
  const b=document.createElement('button');b.dataset.head=id;b.textContent=label;
  b.addEventListener('click',()=>{state=normalize({...state,head:id});update()});$('#heads').append(b);
 }
 let i=0;
 for(const [cut,info]of Object.entries(cuts))for(const [head,label]of Object.entries(heads)){
  const b=document.createElement('button');b.className='sample';b.dataset.cut=cut;b.dataset.head=head;
  b.innerHTML=`<span class="number">0${++i}</span>${character({cut,head},{headOnly:true})}<strong>${info.name}</strong><small>Tête ${label.toLowerCase()}</small>`;
  b.addEventListener('click',()=>{state=normalize({cut,head});update()});$('#gallery').append(b);
 }
 $('#construction').addEventListener('change',e=>{construction=e.target.checked;update()});
 $('#layer').addEventListener('change',e=>{isolate=e.target.value;update()});update();
}catch(error){$('#error').hidden=false;console.error(error)}
