import {model} from '../bio-vis-p5-i6/model.mjs';
import {eyesFor} from './eyes.mjs';
import {auditHistoricalNose,drawNose,normalizeNose,noseControls,noseDetailPresets,
  noseDrawVersion,nosePresets,solveNose} from './nose.mjs';

const format=new Intl.NumberFormat('fr-FR',{maximumFractionDigits:2});
const pretty=value=>format.format(value)+' %';

export function mountNoseEditor({input,eyes,details,mouth,render}) {
  const q=id=>document.getElementById(id);
  const neutral=normalizeNose({});
  let current=null,latent=null,origin=null,result=null;
  const fields=[];
  q('nose-preset').append(new Option('Personnalisé','custom'));
  for(const [label,items] of [['Morphologies',nosePresets],['Degrés de détail',noseDetailPresets]]) {
    const group=document.createElement('optgroup');
    group.label=label;
    group.append(...Object.entries(items).map(([key,v])=>new Option(v.label,key)));
    q('nose-preset').append(group);
  }
  for(const [key,control] of Object.entries(noseControls)) {
    const id='nose-'+key;
    const label=document.createElement('label');
    label.className='slider';
    label.innerHTML=`<span>${control.label}<output id="${id}-value" for="${id}"></output></span><input id="${id}" type="range" min="0" max="0" step="1" aria-label="${control.label}" aria-describedby="${id}-domain"><small class="eye-domain" id="${id}-domain"></small>`;
    q('nose-axes').append(label);
    const field={key,input:q(id),output:q(id+'-value'),domain:q(id+'-domain')};
    fields.push(field);
    field.input.addEventListener('input',()=>{
      const value=field.points[field.input.valueAsNumber];
      if(current&&value!==undefined) set({...current,[key]:value});
    });
  }

  function solve(mouthMode,withDomains=false){
    const portrait=input();
    return solveNose(model(portrait),eyesFor(portrait,eyes()),current,
      {details:details(),mouth:mouthMode,withDomains});
  }

  function refresh(){
    result=null;
    let issues=[];
    q('nose-error').textContent='';
    try {
      if(current) result=solve(mouth(),true);
      else {
        const portrait=input();
        issues=auditHistoricalNose(model(portrait),eyesFor(portrait,eyes()),{details:details()});
      }
    } catch(error) {
      q('nose-error').textContent=error.message;
    }
    const requested=result?.requested??current??latent??neutral;
    q('nose-active').checked=!!current;
    q('nose-parameters').disabled=!current;
    q('nose-before-wrap').hidden=!result;
    const preset=Object.entries(nosePresets).find(([,example])=>{
      const values=normalizeNose(example.values);
      return fields.every(({key})=>values[key]===requested[key]);
    });
    q('nose-preset').value=preset?.[0]??'custom';

    let adjusted=false;
    for(const field of fields){
      const {key,input,output,domain}=field;
      const request=requested[key], applied=result?.effective[key]??null;
      const options=result?.domains[key]?.points??[];
      const value=applied??request;
      const matching=options.findIndex(n=>Math.abs(n-value)<1e-7);
      field.points=matching>=0?options:[...options,value].sort((a,b)=>a-b);
      input.max=field.points.length-1;
      input.value=matching>=0?matching:field.points.indexOf(value);
      input.disabled=!options.length||field.points.length<2;
      const change=applied!==null&&request!==applied;
      adjusted ||= change;
      output.textContent=change?`${pretty(request)} → ${pretty(value)}`:pretty(value);
      input.setAttribute('aria-valuetext',change?`${pretty(request)} demandé, ${pretty(value)} effectif`:pretty(value));
      const ranges=result?.domains[key]?.intervals??[];
      domain.textContent=!result?'':!ranges.length?'Valeur conservée en mémoire.':
        ranges.map(([a,b])=>a===b?pretty(a):`${format.format(a)} à ${pretty(b)}`).join(' ou ');
    }
    const status=q('nose-status');
    if (!current) status.textContent=issues.length?
      'Nez historique conservé. Écart anatomique à arbitrer · '+issues.join(', ')+'.':'Nez historique actif.';
    else if (!result) status.textContent='Personnalisation suspendue. Le nez historique reste affiché.';
    else if (!requested.fills&&!requested.lines) status.textContent='Relief masqué. Les limites anatomiques restent actives.';
    else if(adjusted) status.textContent='L’enveloppe limite certains réglages. Les demandes restent en mémoire.';
    else status.textContent='Le nez respecte les limites du visage.';
  }

  function set(value,draw=null){
    current=value;
    origin=draw;
    refresh();
    render();
  }

  q('nose-preset').addEventListener('change',event=>{
    const key=event.target.value;
    if(nosePresets[key]) set(normalizeNose(nosePresets[key].values));
    else if(noseDetailPresets[key]) set({...current,...noseDetailPresets[key].values});
  });
  q('nose-active').addEventListener('change',event=>{
    if(event.target.checked) set(latent??neutral,origin);
    else {latent=current;set(null,origin);}
  });
  q('nose-reset').addEventListener('click',()=>{latent=null;set(null);});
  q('nose-random').addEventListener('click',()=>{
    const seed=q('nose-seed').value;
    try {set(drawNose(input(),eyes(),seed,{mouth:mouth(),details:details()}),{seed,version:noseDrawVersion});}
    catch(error) {q('nose-error').textContent=error.message;}
  });
  q('nose-before-mode').addEventListener('change',render);
  return {
    value:()=>result?current:null,
    bounds:()=>result?.geometry.anatomy,
    boundsForCustomMouth:()=>current?solve({})?.geometry.anatomy:undefined,
    refresh,
    archiveSettings:()=>({nose:result?current:null,noseLatent:result?null:current??latent,noseDraw:origin}),
    restore(data){
      current=data.nose??null;
      latent=data.noseLatent??null;
      origin=data.noseDraw??null;
      q('nose-seed').value=origin?.seed??q('nose-seed').defaultValue;
    }
  };
}
