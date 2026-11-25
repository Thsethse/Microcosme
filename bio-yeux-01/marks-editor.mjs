import {sceneCoordinates} from './surface.mjs';
import {groupMarkAxes,individualMarkAxes,marksFor,markShapes,markTones,markTypes,markZones,normalizeMarks} from './marks.mjs';

const format=new Intl.NumberFormat('fr-FR',{maximumFractionDigits:3});
const percent=(value,key)=>format.format(value)+(key==='angle'?'°':' %');

export function mountMarksEditor({input,eyes,context,render}) {
  const q=id=>document.getElementById('marks-'+id);
  const add=q('type'), list=q('list'), shape=q('shape'), tone=q('tone');
  const fields=new Map();
  let values=[],shown=true,selected=null,nextId=1,result=null,memo=null,placing=false;
  const active=()=>values.find(item=>item.id===selected);
  const options=(select,table)=>select.append(...Object.entries(table).map(([key,value])=>
    new Option(value.label??value,key)));
  options(add,markTypes);
  options(shape,markShapes);
  options(tone,markTones);
  for(const [zone,label] of Object.entries(markZones)){
    const field=document.createElement('label');
    field.className='check';
    field.innerHTML=`<input type="checkbox" value="${zone}"> ${label}`;
    field.querySelector('input').addEventListener('change',()=>{
      edit({zones:[...q('zones').querySelectorAll('input:checked')].map(input=>input.value)});
    });
    q('zones').append(field);
  }
  const axisEntries=[...Object.entries(individualMarkAxes),...Object.entries(groupMarkAxes).filter(([key])=>!Object.hasOwn(individualMarkAxes,key))];
  for(const [key,label] of axisEntries){
    const field=document.createElement('label'), id='marks-'+key;
    field.className='slider';
    field.innerHTML=`<span><span>${label}</span><output for="${id}"></output></span><input type="range" id="${id}" min="0" max="0" step="1" aria-label="${label}" aria-describedby="${id}-range"><small id="${id}-range" class="eye-domain"></small>`;
    const input=field.querySelector('input'), output=field.querySelector('output');
    const data={field,input,output,range:field.querySelector('small'),points:[]};
    input.addEventListener('input',()=>{
      if(data.points[input.valueAsNumber]!==undefined) edit({[key]:data.points[input.valueAsNumber]});
    });
    fields.set(key,data);
    q('axes').append(field);
  }

  function edit(changes) {
    values=normalizeMarks(values.map(item=>item.id===selected?{...item,...changes}:item));
    render();
  }

  function refresh() {
    const portrait=input(), opening=eyes(), settings=context();
    const key=JSON.stringify([portrait,opening,settings,values,shown,selected]);
    if(key===memo) return;
    memo=key;
    result=values.length?marksFor(portrait,opening,values,{...settings,withDomains:true,domainId:selected}):null;
    const item=active();
    const solved=result?.marks.find(mark=>mark.requested.id===selected);
    const grouped=!!item&&markTypes[item.type].form==='group';
    const axes=grouped?groupMarkAxes:individualMarkAxes;
    list.replaceChildren(...values.map(({id,type})=>new Option(markTypes[type].label+' · '+id.slice(1),id)));
    list.value=selected??'';
    list.disabled=!values.length;
    q('show').checked=shown;
    q('show').disabled=!values.length;
    q('remove').disabled=!item;
    q('add').disabled=values.length===24;
    q('reset').disabled=!values.length;
    q('edit').disabled=!shown||!item;
    q('edit').hidden=!item;
    q('place').disabled=!shown||!item||grouped||!item.intensity;
    q('seed-label').hidden=!grouped;
    q('zones-wrap').hidden=!grouped;
    if (item) {
      shape.value=item.shape;
      tone.value=item.tone;
      if(grouped){
        q('seed').value=item.seed;
        for(const check of q('zones').querySelectorAll('input')) check.checked=item.zones.includes(check.value);
      }
    }
    for(const [name,data] of fields){
      const {field,input,output,range}=data;
      field.hidden=!item||!Object.hasOwn(axes,name);
      if(field.hidden) continue;
      field.firstElementChild.firstElementChild.textContent=axes[name];
      input.setAttribute('aria-label',axes[name]);
      const requested=item[name];
      const applied=solved.effective[name]??requested;
      const domain=solved.domains[name];
      const indexed=['x','y','density','intensity'].includes(name);
      const fallback=domain===null;
      const allowed=fallback?Array.from({length:101},(_,i)=>i):domain??[];
      const [min,max]=allowed;
      const steps=indexed?allowed:allowed.length?[min,max,...Array.from({length:Math.floor(max)-Math.ceil(min)+1},
        (_,i)=>Math.ceil(min)+i)]:[];
      // A latent value remains listed but does not add a dead slider stop.
      // The index positions use only legal moves.
      data.points=[...new Set(steps)].sort((a,b)=>a-b);
      const closest=name==='density'?data.points.findLastIndex(step=>step<=solved.effective.count*100/markTypes[item.type].capacity):
        data.points.reduce((best,step,i)=>Math.abs(step-applied)<Math.abs(data.points[best]-applied)?i:best,0);
      input.max=Math.max(0,data.points.length-1);
      input.value=Math.max(0,closest);
      input.disabled=data.points.length<2;
      const text=name==='density'?`${solved.effective.visible} visible${solved.effective.visible>1?'s':''} sur ${solved.effective.count}`:
        applied===requested?percent(applied,name):`${percent(requested,name)} → ${percent(applied,name)}`;
      output.textContent=text;
      input.setAttribute('aria-valuetext',text);
      range.textContent=fallback?'Déplacez la marque sur les deux axes ou utilisez le placement sur le visage.':
        !steps.length?'Valeur en mémoire.':
        name==='density'?'Chaque cran admissible affiche une marque de plus.':
        `${percent(data.points[0],name)} à ${percent(data.points.at(-1),name)}`;
    }
    let message='';
    if(!shown) message='Les marques sont masquées et restent en mémoire.';
    else if(!item) message='Aucune marque cutanée.';
    else if(grouped&&!item.zones.length) message='Choisissez une zone pour afficher le groupe.';
    else if(!item.intensity) message='Intensité nulle. Les réglages restent en mémoire.';
    else if(!grouped&&solved.effective.reason) message='Emplacement en mémoire. La marque rencontre une limite du visage.';
    else if(!grouped&&solved.effective.size!==item.size) message='Taille ajustée à l’espace disponible. La taille demandée reste en mémoire.';
    else if(grouped&&solved.effective.visible<solved.effective.count) message='Les marques hors de l’espace cutané visible gardent leur emplacement.';
    q('status').textContent=message;
  }

  function stopPlacing() {
    placing=false;
    q('place').setAttribute('aria-pressed','false');
    q('zoom').classList.remove('placing');
  }
  q('place').addEventListener('click',()=>{
    if(placing){stopPlacing();return;}
    placing=true;
    q('place').setAttribute('aria-pressed','true');
    q('zoom').classList.add('placing');
    q('zoom').scrollIntoView({block:'nearest'});
  });
  q('zoom').addEventListener('click',event=>{
    const svg=q('zoom').querySelector('svg');
    if(!placing||!svg||!result) return;
    const coords=sceneCoordinates(svg,event.clientX,event.clientY,result.frame.plane);
    if(!coords) return;
    stopPlacing();
    edit({x:Math.round(coords[0]*10)/10,y:Math.round(coords[1]*10)/10});
  });
  q('add').addEventListener('click',()=>{
    let id;
    do {
      id='m'+nextId;
      nextId=nextId%999999999+1;
    } while(values.some(item=>item.id===id));
    values=normalizeMarks([...values,{id,type:add.value}]);
    shown=true;
    selected=id;
    stopPlacing();
    render();
    list.focus({preventScroll:true});
  });
  list.addEventListener('change',()=>{selected=list.value;stopPlacing();render();});
  q('remove').addEventListener('click',()=>{
    const at=values.findIndex(item=>item.id===selected);
    values=values.filter(item=>item.id!==selected);
    selected=(values[at]??values.at(-1))?.id??null;
    stopPlacing();
    render();
    (selected?list:q('add')).focus({preventScroll:true});
  });
  q('reset').addEventListener('click',()=>{values=[];shown=true;selected=null;nextId=1;stopPlacing();render();});
  q('show').addEventListener('change',event=>{shown=event.target.checked;stopPlacing();render();});
  shape.addEventListener('change',()=>edit({shape:shape.value}));
  tone.addEventListener('change',()=>edit({tone:tone.value}));
  q('seed').addEventListener('change',event=>edit({seed:event.target.value}));
  q('before-mode').addEventListener('change',render);

  return {
    refresh,value:()=>shown&&result?.marks.some(mark=>mark.points.length)?values:null,
    archiveSettings:()=>({marks:shown?values:null,marksLatent:shown?null:values}),
    restore(data){
      values=normalizeMarks(data.marks??data.marksLatent);
      shown=!data.marksLatent;
      selected=values[0]?.id??null;
      nextId=Math.max(0,...values.map(item=>Number(item.id.slice(1))))%999999999+1;
      stopPlacing();
    }
  };
}
