(function(){
 'use strict';
 const M=T2Model,G=T2Geometry,R=T2Render,$=id=>document.getElementById(id);
 let people=[],selected=0,galleryRun=0;
 const controlNodes=new Map();
 const paint=(canvas,d,view)=>R.render(canvas,G.project(G.derive(d),view));
 function comparison(d){
  const old=document.createElement('canvas'),now=document.createElement('canvas');
  BioRenderB2.render(old,BioMorphB2.derive(BioMorphB2.generate(d.seed)),'front');paint(now,d,'front');
  const figures=[['B2 · même graine',old],['T2 · profil courant',now]].map(([label,c])=>{const f=document.createElement('figure'),caption=document.createElement('figcaption');caption.textContent=label;f.append(c,caption);return f;});
  $('comparison').replaceChildren(...figures);
 }
 function refresh(){
  const d=people[selected],body=G.derive(d);
  for(const view of ['front','profile','back','portrait'])R.render($(view),G.project(body,view));
  $('description').textContent=M.serialize(d);$('selectedLabel').textContent='N° '+(selected+1);
  $('proportions').textContent=`Hauteur courante : ${(body.geometry.height/body.geometry.headH).toFixed(2)} têtes. Le bouton « Référence · 4 têtes » rétablit la proportion initiale avant étirements.`;
  const card=$('gallery').children[selected];if(card){paint(card.querySelector('canvas'),d,'front');card.querySelector('span').textContent=d.seed;}
  comparison(d);
 }
 function sync(){
  const d=people[selected];$('seed').value=d.seed;
  for(const s of M.schema){const node=controlNodes.get(s.key),v=d.params[s.key];if(s.type==='boolean')node.input.checked=v;else node.input.value=v;
   node.output.textContent=s.type==='number'?v.toFixed(2):s.type==='boolean'?(v?'Oui':'Non'):s.group==='Palettes'?v:'';
   node.swatches?.querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.color===v)));
  }
  $('gallery').querySelectorAll('button.card').forEach((b,i)=>b.setAttribute('aria-pressed',String(i===selected)));refresh();
 }
 function card(d,i){const b=document.createElement('button');b.className='card';b.type='button';b.dataset.index=i;b.setAttribute('aria-pressed',String(i===selected));b.setAttribute('aria-label','Sélectionner le personnage '+(i+1));const c=document.createElement('canvas'),label=document.createElement('span');paint(c,d,'front');label.textContent=d.seed;b.append(c,label);b.onclick=()=>{selected=i;sync();};return b;}
 function gallery(n){const run=++galleryRun,t=performance.now();people=Array.from({length:n},(_,i)=>M.generate($('gallerySeed').value+'-'+String(i+1).padStart(3,'0')));selected=0;$('gallery').replaceChildren(...people.map(card));$('count').textContent=n;sync();const work=performance.now()-t;requestAnimationFrame(()=>requestAnimationFrame(()=>{if(run===galleryRun)$('timing').textContent=`${n} personnages : ${work.toFixed(1)} ms génération / Canvas / DOM ; ${(performance.now()-t).toFixed(1)} ms jusqu’à deux RAF. Mesure de ce navigateur, pas une certification iPad.`;}));}
 const groups=new Map();
 for(const s of M.schema){
  if(!groups.has(s.group)){const details=document.createElement('details');details.className='group';details.open=s.group==='Formes';const summary=document.createElement('summary');summary.textContent=s.group;const content=document.createElement('div');content.className='group-content';details.append(summary,content);$('controls').append(details);groups.set(s.group,content);}
  const box=document.createElement('div');box.className='control';const label=document.createElement('label');label.htmlFor='p-'+s.key;label.textContent=s.label;const output=document.createElement('output');label.append(output);
  let input;if(s.type==='choice'){input=document.createElement('select');for(const [value,text]of Object.entries(s.options)){const o=document.createElement('option');o.value=value;o.textContent=text;input.append(o);}}
  else{input=document.createElement('input');input.type=s.type==='boolean'?'checkbox':'range';if(s.type==='number')Object.assign(input,{min:s.min,max:s.max,step:s.step});}
  input.id='p-'+s.key;
  function update(){const value=s.type==='number'?Number(input.value):s.type==='boolean'?input.checked:input.value;people[selected]=M.validate({...people[selected],params:{...people[selected].params,[s.key]:value}});sync();}
  input.addEventListener(s.type==='number'?'input':'change',update);
  const help=document.createElement('small');help.textContent=s.type==='number'?`${s.min}…${s.max} · ${s.effect}`:s.effect;box.append(label,input);
  let swatches;if(s.group==='Palettes'){swatches=document.createElement('div');swatches.className='swatches';for(const color of Object.keys(s.options)){const b=document.createElement('button'),i=document.createElement('i');b.type='button';b.dataset.color=color;b.setAttribute('aria-label',s.label+' '+color);b.style.setProperty('--swatch',color);b.append(i);b.onclick=()=>{input.value=color;update();};swatches.append(b);}box.append(swatches);}
  box.append(help);groups.get(s.group).append(box);controlNodes.set(s.key,{input,output,swatches});
 }
 $('generate20').onclick=()=>gallery(20);$('generate100').onclick=()=>gallery(100);
 $('regenerate').onclick=()=>{people[selected]=M.generate($('seed').value);sync();$('status').textContent='Profil réinitialisé depuis sa graine.';};
 $('reference').onclick=()=>{people[selected]=M.reference($('seed').value);sync();$('status').textContent='Référence neutre rétablie : quatre têtes avant étirements.';};
 $('replay').onclick=()=>{try{people[selected]=M.validate({...people[selected],seed:$('seed').value});sync();$('status').textContent='Graine et paramètres rejoués à l’identique.';}catch(e){$('status').textContent=e.message;}};
 $('export').onclick=()=>{const url=URL.createObjectURL(new Blob([M.serialize(people[selected])],{type:'application/json'})),a=document.createElement('a');a.href=url;a.download='microcosme-t2.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1500);};
 $('import').onchange=async e=>{try{const file=e.target.files[0];if(!file)return;if(file.size>65536)throw Error('Fichier trop volumineux : 64 Ko maximum.');const d=M.parse(await file.text());people[selected]=d;sync();$('status').textContent='Profil T2 importé.';}catch(err){$('status').textContent=err.message;}finally{e.target.value='';}};
 gallery(20);
})();
