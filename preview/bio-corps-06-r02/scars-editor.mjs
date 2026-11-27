import {drawScar,normalizeScars,scarAxes,scarPresets,scarsFor} from './scars.mjs';
import {sceneCoordinates} from './surface.mjs';

const format=new Intl.NumberFormat('fr-FR',{maximumFractionDigits:2});
const unit=(key,value)=>format.format(value)+(key==='angle'?'°':key==='traces'?'':' %');

export function mountScarsEditor({input,eyes,context,render}) {
  const q=id=>document.getElementById('scars-'+id);
  const presets=q('preset'), list=q('list');
  presets.append(...Object.entries(scarPresets).map(([key,{label}])=>new Option(label,key)));
  q('apply').addEventListener('click',()=>{
    if(active()) edit({...normalizeScars([{id:selected,seed:active().seed,...scarPresets[presets.value].values}])[0]});
  });
  let values=[],shown=true,selected=null,nextId=1,result=null,memo=null,placing=false,error='';
  const active=()=>values.find(item=>item.id===selected);
  const fields=Object.entries(scarAxes).map(([key,{label}])=>{
    const field=document.createElement('label'), id='scars-'+key;
    field.className='slider';
    field.innerHTML=`<span><span>${label}</span><output for="${id}"></output></span><input type="range" id="${id}" min="0" max="0" step="1" aria-label="${label}" aria-describedby="${id}-range"><small id="${id}-range" class="eye-domain"></small>`;
    q('axes').append(field);
    const control={key,input:field.querySelector('input'),output:field.querySelector('output'),range:field.querySelector('small'),points:[]};
    control.input.addEventListener('input',()=>{
      if(control.points[control.input.valueAsNumber]!==undefined) edit({[key]:control.points[control.input.valueAsNumber]});
    });
    return control;
  });

  function edit(changes) {
    values=normalizeScars(values.map(item=>item.id===selected?{...item,...changes}:item));
    render();
  }

  function refresh() {
    const portrait=input(), opening=eyes(), settings=context();
    const key=JSON.stringify([portrait,opening,settings,values,shown,selected,error]);
    if(key===memo) return;
    memo=key;
    result=values.length?scarsFor(portrait,opening,values,{...settings,withDomains:true,domainId:selected}):null;
    const item=active();
    const fit=result?.items.find(scar=>scar.requested.id===selected);
    list.replaceChildren(...values.map(({id,mode})=>new Option((mode==='patch'?'Surfacique':'Tracé')+' · '+id.slice(1),id)));
    list.value=selected??'';
    list.disabled=!values.length;
    q('show').checked=shown;
    q('show').disabled=!values.length;
    q('remove').disabled=!item;
    q('add').disabled=values.length===16;
    q('draw').disabled=!item&&values.length===16;
    q('apply').disabled=!item;
    q('reset').disabled=!values.length;
    q('edit').hidden=!item;
    q('edit').disabled=!shown;
    q('place').disabled=!shown||!item||!item.intensity;
    q('error').textContent=error;
    if(item){
      q('mode').value=item.mode;
      q('sutures').checked=item.sutures;
      q('sutures').disabled=!fit.domains.sutures;
      q('seed').value=item.seed;
    }
    const adjusted=[];
    for(const field of fields){
      const {key,input,output,range}=field;
      if(!item) continue;
      const request=item[key],applied=fit.effective[key];
      if(applied!=null&&applied!==request) adjusted.push(scarAxes[key].label);
      const domain=fit.domains[key]??[];
      const [min,max]=domain;
      const indexed=['x','y','traces'].includes(key);
      const grid=indexed?domain:domain.length&&max!=null?[min,max,
        ...Array.from({length:Math.floor(max)-Math.ceil(min)+1},(_,i)=>Math.ceil(min)+i)]:[];
      field.points=[...new Set([...grid,...(grid.length&&applied!=null?[applied]:[])])].sort((a,b)=>a-b);
      const value=applied??request;
      input.max=Math.max(0,field.points.length-1);
      input.value=Math.max(0,field.points.indexOf(value));
      input.disabled=field.points.length<2;
      const text=value===request?unit(key,value):`${unit(key,request)} → ${unit(key,value)}`;
      output.textContent=text;
      input.setAttribute('aria-valuetext',text);
      range.textContent=grid.length?`${unit(key,field.points[0])} à ${unit(key,field.points.at(-1))}`:'Valeur en mémoire.';
    }
    q('status').textContent=!shown?'Les cicatrices sont masquées et restent en mémoire.':!fit?'Aucune cicatrice.':
      fit.effective.reason==='contour'?'Placement en mémoire. Rapprochez le tracé du centre du visage.':
      fit.effective.reason==='intensité'?'Intensité nulle. Les réglages restent en mémoire.':
      [adjusted.length?'Réglages ajustés avec demande conservée · '+adjusted.join(', ')+'.':'',
        fit.effective.interruptions.length?'Réserves anatomiques rencontrées · '+fit.effective.interruptions.join(', ')+'.':''].filter(Boolean).join(' ');
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

  function availableId() {
    let id;
    do{
      id='s'+nextId;
      nextId=nextId%999999999+1;
    }while(values.some(item=>item.id===id));
    return id;
  }
  function insert(scar) {
    values=normalizeScars([...values,scar]);
    shown=true;
    selected=scar.id;
    stopPlacing();
    render();
    list.focus({preventScroll:true});
  }
  q('add').addEventListener('click',()=>insert({id:availableId(),...scarPresets[presets.value].values}));
  q('draw').addEventListener('click',()=>{
    const item=active(), id=item?.id??availableId();
    try{
      const seed=item?.seed??'Microcosme '+id;
      const sample=drawScar(input(),eyes(),id,seed,context());
      error='';
      if(item) edit(sample);
      else insert(sample);
    }catch(e){error=e.message;render();}
  });
  q('seed').addEventListener('change',event=>edit({seed:event.target.value}));
  q('sutures').addEventListener('change',event=>edit({sutures:event.target.checked}));
  q('mode').addEventListener('change',event=>edit({mode:event.target.value}));
  list.addEventListener('change',()=>{selected=list.value;stopPlacing();render();});
  q('remove').addEventListener('click',()=>{
    const at=values.findIndex(item=>item.id===selected);
    values=values.filter(item=>item.id!==selected);
    selected=(values[at]??values.at(-1))?.id??null;
    stopPlacing();
    render();
    (selected?list:q('add')).focus({preventScroll:true});
  });
  q('reset').addEventListener('click',()=>{values=[];shown=true;selected=null;nextId=1;error='';stopPlacing();render();});
  q('show').addEventListener('change',event=>{shown=event.target.checked;stopPlacing();render();});
  q('before-mode').addEventListener('change',render);

  return {
    refresh,value:()=>shown&&result?.items.some(item=>item.geometry)?values:null,
    archiveSettings:()=>({scars:shown?values:null,scarsLatent:shown?null:values}),
    restore(data){
      values=normalizeScars(data.scars??data.scarsLatent);
      shown=!data.scarsLatent;
      selected=values[0]?.id??null;
      nextId=Math.max(0,...values.map(item=>Number(item.id.slice(1))))%999999999+1;
      error='';
      stopPlacing();
    }
  };
}
