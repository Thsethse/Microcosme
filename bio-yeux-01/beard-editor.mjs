import {palette} from '../bio-col-01/palette.mjs';
import {beardControls,beardDrawVersion,beardFor,beardPresets,beardZones,drawBeard,normalizeBeard} from './beard.mjs';

const format=new Intl.NumberFormat('fr-FR',{maximumFractionDigits:6});
const percent=value=>format.format(value)+' %';

export function mountBeardEditor({input,eyes,context,render}) {
  const q=id=>document.getElementById('beard-'+id);
  const category=()=>q('category').value;
  const neutral=normalizeBeard(beardPresets.short.values);
  let current=null,latent=null,origin=null,result=null;
  let previousKey=null;
  const mode=q('colour-mode'), colours=q('colour'), preset=q('preset');
  preset.append(new Option('Personnalisé','custom'),...Object.entries(beardPresets).map(([key,item])=>new Option(item.label,key)));
  for (const [key,label] of [['natural','Naturelles'],['fantasy','Fantaisie']]) {
    const group=document.createElement('optgroup');
    group.label=label;
    group.append(...palette.filter(item=>item.category===key).map(item=>new Option(item.name,item.id)));
    colours.append(group);
  }
  for (const [key,zone] of Object.entries(beardZones)) {
    const label=document.createElement('label');
    label.className='check';
    label.innerHTML='<input type="checkbox" id="beard-zone-'+key+'"> '+zone;
    q('zones').append(label);
    q('zone-'+key).addEventListener('change',event=>{
      set({...current,zones:{...current.zones,[key]:event.target.checked}});
    });
  }
  const fields=Object.entries(beardControls).map(([key,control])=>{
    const id='beard-'+key, label=document.createElement('label');
    label.className='slider';
    label.innerHTML=`<span>${control.label}<output for="${id}" id="${id}-value"></output></span><input id="${id}" type="range" min="0" max="0" step="1" aria-label="${control.label}" aria-describedby="${id}-domain"><small class="eye-domain" id="${id}-domain"></small>`;
    q('axes').append(label);
    const field={key,input:q(key),output:q(key+'-value'),domain:q(key+'-domain'),points:[]};
    field.input.addEventListener('input',()=>{
      if (current) set({...current,[key]:field.points[field.input.valueAsNumber]});
    });
    return field;
  });

  function refresh() {
    const portrait=input(), opening=eyes(), options={...context(),category:category()};
    const memo=JSON.stringify([portrait,opening,options,current,latent]);
    if (memo===previousKey) return;
    previousKey=memo;
    const allowed=category()!=='F';
    try {
      result=current&&allowed?beardFor(portrait,opening,current,options):null;
      q('error').textContent='';
    } catch(error) {
      result=null;
      q('error').textContent=error.message;
    }
    const requested=current??latent??neutral;
    q('active').checked=!!current;
    q('active').disabled=!allowed;
    q('parameters').disabled=!current||!allowed;
    for (const name of ['seed','random','reset']) q(name).disabled=!allowed;
    q('before-wrap').hidden=!result?.path;
    const match=Object.entries(beardPresets).find(([,item])=>{
      const profile=normalizeBeard(item.values);
      return fields.every(({key})=>profile[key]===requested[key]) &&
        Object.keys(beardZones).every(key=>profile.zones[key]===requested.zones[key]);
    });
    preset.value=match?.[0]??'custom';
    mode.value=requested.colourMode;
    colours.value=requested.colour;
    mode.disabled=!result?.path;
    colours.disabled=mode.disabled||requested.colourMode!=='independent';
    for (const key of Object.keys(beardZones)) q('zone-'+key).checked=requested.zones[key];
    let adjusted=false;
    for (const field of fields) {
      const {key,input,output,domain}=field;
      const request=requested[key], applied=result?.effective[key]??request;
      const range=result?.domains[key]??[];
      const [min,max]=range;
      const points=range.length?[min,max,...Array.from({length:Math.floor(max)-Math.ceil(min)+1},
        (_,i)=>Math.ceil(min)+i),applied]:[applied];
      field.points=[...new Set(points)].sort((a,b)=>a-b);
      input.max=field.points.length-1;
      input.value=field.points.indexOf(applied);
      input.disabled=!range.length;
      adjusted ||= request!==applied;
      output.textContent=request!==applied?`${percent(request)} → ${percent(applied)}`:percent(applied);
      input.setAttribute('aria-valuetext',request!==applied?
        `${percent(request)} demandé, ${percent(applied)} effectif`:percent(applied));
      domain.textContent=range.length?`${format.format(min)} à ${percent(max)}`:
        current?'Valeur conservée en mémoire.':'';
    }
    q('status').textContent=!allowed?'Pilosité indisponible pour F. Les préférences restent en mémoire.':
      !current?'Rendu historique actif.':
      !result?'Pilosité suspendue.':
      requested.zones.moustache&&!result.available.moustache?'Espace insuffisant entre le nez et la bouche. La moustache reste en mémoire.':
      adjusted?'L’espace entre le nez et la bouche limite la moustache. Les demandes restent en mémoire.':
      !result.path?'Aucune pilosité visible.':'';
  }

  function set(value,draw=null) {
    current=value;
    origin=draw;
    render();
  }
  q('category').addEventListener('change',render);
  q('active').addEventListener('change',event=>{
    if (event.target.checked) set(latent??neutral,origin);
    else {latent=current;set(null,origin);}
  });
  preset.addEventListener('change',()=>{
    if (!beardPresets[preset.value]) return;
    const {values}=beardPresets[preset.value];
    set(normalizeBeard({...values,colour:current.colour,colourMode:current.colourMode}));
  });
  mode.addEventListener('change',()=>set({...current,colourMode:mode.value}));
  colours.addEventListener('change',()=>set({...current,colour:colours.value}));
  q('random').addEventListener('click',()=>{
    const seed=q('seed').value;
    try {set(drawBeard(input(),eyes(),seed,{...context(),category:category()}),{seed,version:beardDrawVersion});}
    catch(error) {q('error').textContent=error.message;}
  });
  q('reset').addEventListener('click',()=>{latent=null;set(null);});
  q('before-mode').addEventListener('change',render);
  return {
    refresh,category,value:()=>result?.path?current:null,
    archiveSettings:()=>({beard:current,beardLatent:current?null:latent,beardDraw:origin,beardCategory:category()}),
    restore(data){
      current=data.beard??null;
      latent=data.beardLatent??null;
      origin=data.beardDraw??null;
      q('category').value=data.beardCategory??'H';
      q('seed').value=origin?.seed??q('seed').defaultValue;
    }
  };
}
