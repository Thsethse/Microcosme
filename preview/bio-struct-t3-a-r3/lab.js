(function(){
 'use strict';
 const P=BiologicalProfile,C=CanonicalBody,B=BodyProjection,R=T3Render,A=MorphologySettings,$=id=>document.getElementById(id);
 let selected='M',bodies={};const controls=new Map(),choiceControls=new Map(),appearanceControls=new Map();
 const options=()=>({volumes:$('showVolumes').checked,skeleton:$('showSkeleton').checked,joints:$('showJoints').checked,anchors:$('showAnchors').checked,volumeEdges:$('showVolumeEdges').checked,face:$('showFace').checked});
 function reference(category,fn){const r=P.reference(category,fn);return C.generateBodyR3($('seed').value,r.biologicalProfile,r.parameters);}
 function rebuild(old,change={}){
  const b=C.generateBodyR3(change.seed??old.seed,change.profile??old.biologicalProfile,change.parameters??old.requestedParameters,change.choices??old.geometryChoices,change.appearance??old.appearance);b.migration=old.migration;return b;
 }
 function render(){
  for(const category of ['M','F','T']){
   const body=bodies[category];R.render($('canvas-'+category),B.projectBody(body,$('view').value),options());$('metric-'+category).textContent=`${body.skeleton.height.toFixed(1)} unités · ${(body.skeleton.height/body.skeleton.zones.head).toFixed(2)} têtes`;$('card-'+category).classList.toggle('selected',category===selected);document.querySelector(`[data-category="${category}"]`).setAttribute('aria-pressed',String(category===selected));
  }
  const body=bodies[selected];$('selected').textContent=selected;$('thirdFunction').value=bodies.T.biologicalProfile.reproductiveFunction;
  for(const s of P.schema){const n=controls.get(s.key),v=body.parameters[s.key];n.range.value=v;n.number.value=v;n.output.textContent=`P1 ${s.min}…${s.max}`;n.box.hidden=s.key==='breastVolume'&&selected==='M';n.range.disabled=n.number.disabled=n.box.hidden;}
  for(const s of ShapeGrammar.schema)choiceControls.get(s.key).value=body.geometryChoices[s.key];
  for(const s of A.ranges){const n=appearanceControls.get(s.key);n.input.value=body.appearance[s.key];n.output.textContent=Math.round(body.appearance[s.key]*100)+' %';n.box.hidden=false;n.input.disabled=false;}
  $('breastShapeControl').hidden=selected==='M';$('a-breastShape').disabled=selected==='M';$('a-breastShape').value=body.appearance.breastShape||'natural';
  const pubis=$('a-pubicHairShape');pubis.replaceChildren();for(const [value,title]of Object.entries(A.pubicShapes)){if(selected==='M'&&!['none','rectangle'].includes(value))continue;const option=document.createElement('option');option.value=value;option.textContent=title;pubis.append(option);}pubis.value=body.appearance.pubicHairShape;$('a-hairColor').value=body.appearance.hairColor;
  $('migration').textContent=body.migration?`Migration explicite v${body.migration.fromVersion} → v${body.migration.toVersion} : ${body.migration.policy}`:'';
  for(const view of ['front','profile','back'])R.render($('detail-'+view),B.projectBody(body,view),options());
  const report=C.validateBody(body);$('validity').textContent=report.valid?'Contraintes anatomiques vérifiées.':report.errors.map(e=>e.message).join(' ');
  $('description').textContent=C.serializeBody(body);$('inspection').textContent=JSON.stringify({geometryChoices:body.geometryChoices,appearance:body.appearance,face:body.face,skeleton:body.skeleton,volumes:body.volumes,finish:body.finish},null,2);
  if(!body.corrections.length)$('corrections').textContent='Aucune limitation numérique appliquée au profil courant.';
  else{const table=document.createElement('table'),head=document.createElement('tr');for(const title of ['Paramètre','Demandé','Appliqué','Motif']){const th=document.createElement('th');th.textContent=title;head.append(th);}table.append(head);for(const correction of body.corrections){const tr=document.createElement('tr');for(const value of [correction.parameter,correction.requested,correction.applied,correction.reason]){const td=document.createElement('td');td.textContent=value;tr.append(td);}table.append(tr);}$('corrections').replaceChildren(table);}
 }
 function transact(work,message){try{const next=work();bodies=next;$('error').textContent='';$('status').textContent=message;render();}catch(e){$('error').textContent='Rejet : '+e.message;$('status').textContent='Corps précédents conservés.';render();}}
 function changeAppearance(key,value){transact(()=>({...bodies,[selected]:rebuild(bodies[selected],{appearance:{...bodies[selected].appearance,[key]:value}})}),'Finition modifiée ; proportions et fonction conservées.');}
 for(const s of P.schema){
  const box=document.createElement('div');box.className='control';const label=document.createElement('label');label.htmlFor='n-'+s.key;label.textContent=s.key==='breastVolume'?'Taille de poitrine (F / T)':s.label;const output=document.createElement('output');label.append(output);const pair=document.createElement('div');pair.className='pair';const range=document.createElement('input'),number=document.createElement('input');Object.assign(range,{type:'range',id:'p-'+s.key,min:s.min,max:s.max,step:s.step});Object.assign(number,{type:'number',id:'n-'+s.key,min:s.min,max:s.max,step:s.step});range.setAttribute('aria-label',s.label+' curseur');number.setAttribute('aria-label',s.label+' valeur');
  const apply=v=>transact(()=>({...bodies,[selected]:rebuild(bodies[selected],{parameters:{...bodies[selected].requestedParameters,[s.key]:v}})}),'Descendants et attaches recalculés.');
  range.oninput=()=>apply(Number(range.value));number.oninput=()=>{number.dataset.dirty='true';};number.onchange=()=>{if(number.dataset.dirty!=='true')return;number.dataset.dirty='false';apply(number.value===''?NaN:Number(number.value));};pair.append(range,number);const hint=document.createElement('small');hint.textContent='Une saisie numérique hors bornes est limitée avec rapport explicite.';box.append(label,pair,hint);$('controls').append(box);controls.set(s.key,{box,range,number,output});
 }
 for(const s of ShapeGrammar.schema){
  const label=document.createElement('label');label.className='shape-control';label.textContent=s.label;const select=document.createElement('select');select.id='choice-'+s.key;
  for(const [value,title]of Object.entries(s.options)){if(s.key==='pelvisShape'&&value==='oval')continue;const option=document.createElement('option');option.value=value;option.textContent=title;select.append(option);}
  select.onchange=()=>transact(()=>({...bodies,[selected]:rebuild(bodies[selected],{choices:{...bodies[selected].geometryChoices,[s.key]:select.value}})}),'Forme modifiée ; catégorie et fonction conservées.');label.append(select);$('shapeControls').append(label);choiceControls.set(s.key,select);
 }
 for(const s of A.ranges){const box=document.createElement('div');box.className='control';const label=document.createElement('label');label.htmlFor='a-'+s.key;label.textContent=s.label;const output=document.createElement('output');label.append(output);const input=document.createElement('input');Object.assign(input,{id:'a-'+s.key,type:'range',min:0,max:1,step:.01});input.oninput=()=>changeAppearance(s.key,Number(input.value));box.append(label,input);$('bodyControls').append(box);appearanceControls.set(s.key,{box,input,output});}
 for(const [value,title]of Object.entries(A.breastShapes)){const option=document.createElement('option');option.value=value;option.textContent=title;$('a-breastShape').append(option);}
 $('a-breastShape').onchange=()=>changeAppearance('breastShape',$('a-breastShape').value);$('a-pubicHairShape').onchange=()=>changeAppearance('pubicHairShape',$('a-pubicHairShape').value);$('a-hairColor').oninput=()=>changeAppearance('hairColor',$('a-hairColor').value);
 for(const category of ['M','F','T']){const select=()=>{selected=category;render();};document.querySelector(`[data-category="${category}"]`).onclick=select;$('canvas-'+category).onclick=select;}
 for(const id of ['view','showVolumes','showSkeleton','showJoints','showAnchors','showVolumeEdges','showFace'])$(id).onchange=render;
 $('thirdFunction').onchange=()=>{const fn=$('thirdFunction').value;selected='T';transact(()=>({...bodies,T:rebuild(bodies.T,{profile:{category:'T',reproductiveFunction:fn}})}),'Fonction de T modifiée ; morphologie conservée.');};
 $('replay').onclick=()=>transact(()=>Object.fromEntries(Object.entries(bodies).map(([k,b])=>[k,rebuild(b,{seed:$('seed').value})])),'Trois corps rejoués avec la même graine.');
 $('resetAll').onclick=()=>transact(()=>Object.fromEntries(['M','F','T'].map(k=>[k,reference(k)])),'Trois profils P2 réinitialisés.');
 $('resetOne').onclick=()=>transact(()=>({...bodies,[selected]:reference(selected,bodies[selected].biologicalProfile.reproductiveFunction)}),'Profil P2 réinitialisé.');
 $('export').onclick=()=>{const url=URL.createObjectURL(new Blob([C.serializeBody(bodies[selected])],{type:'application/json'})),a=document.createElement('a');a.href=url;a.download='microcosme-t3-a-'+selected+'.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1500);};
 $('import').onchange=async e=>{try{const file=e.target.files[0];if(!file)return;if(file.size>65536)throw Error('64 Ko maximum.');const body=C.upgradeBody(C.parseBody(await file.text()));selected=body.biologicalProfile.category;bodies={...bodies,[selected]:body};$('seed').value=body.seed;$('error').textContent='';$('status').textContent='Corps T3-A importé.';render();}catch(err){$('error').textContent='Rejet : '+err.message;$('status').textContent='Corps précédents conservés.';}finally{e.target.value='';}};
 bodies=Object.fromEntries(['M','F','T'].map(k=>[k,reference(k)]));render();
})();
