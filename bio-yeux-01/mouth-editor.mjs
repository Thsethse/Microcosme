import {model} from '../preview/bio-vis-p5-i6/model.mjs';
import {eyesFor} from './eyes.mjs';
import {auditHistoricalMouth, drawMouth, mouthControls, mouthDrawVersion, mouthPresets,
  normalizeMouth, solveMouth} from './mouth.mjs';

const format=new Intl.NumberFormat('fr-FR',{maximumFractionDigits:2});
const pretty=value=>format.format(value)+' %';

export function mountMouthEditor({commandLayout,input,eyes,noseBounds,noseBoundsForDraw,refreshNose,render}) {
  const q=id=>document.getElementById(id);
  const neutral=normalizeMouth({});
  let current=null, latent=null, origin=null, blocked=false;
  const fields=[];
  q('mouth-preset').append(new Option('Personnalisée','custom'),...Object.entries(mouthPresets)
    .map(([key,{label}])=>new Option(label,key)));

  for (const [key,control] of Object.entries(mouthControls)) {
    const id='mouth-'+key;
    const label=document.createElement('label');
    label.className='slider';
    label.innerHTML=`<span>${control.label}<output id="${id}-value" for="${id}"></output></span><input id="${id}" type="range" min="0" max="0" step="1" aria-label="${control.label}" aria-describedby="${id}-domain"><small class="eye-domain" id="${id}-domain"></small>`;
    q('mouth-axes').append(label);
    const field={key,input:q(id),output:q(id+'-value'),domain:q(id+'-domain')};
    fields.push(field);
    field.input.addEventListener('input',()=>{
      const value=field.points[field.input.valueAsNumber];
      if (current&&value!==undefined) set({...current,[key]:value});
    });
  }

  function set(mouth,draw=null) {
    current=mouth;
    origin=draw;
    refreshNose();
    refresh();
    render();
  }

  function refresh() {
    let result=null,historical=[],adjustedByNose=false;
    const face=model(input()), opening=eyesFor(input(),eyes());
    const nose=noseBounds();
    const fit={noseBounds:nose,preserveMouth:!!nose};
    blocked=false;
    q('mouth-error').textContent='';
    try {
      if(current) {
        result=solveMouth(face,opening,current,{...fit,withDomains:true});
        if(nose&&fields.some(({key})=>result.effective[key]!==null&&result.effective[key]!==result.requested[key])) {
          const previous=solveMouth(face,opening,current).effective;
          adjustedByNose=fields.some(({key})=>previous[key]!==result.effective[key]);
        }
      } else historical=auditHistoricalMouth(face,opening,fit).violations;
    } catch(error) {
      blocked=!!current;
      q('mouth-error').textContent=error.message;
    }
    const requested=result?.requested??current??latent??neutral;
    q('mouth-active').checked=!!current;
    q('mouth-parameters').disabled=!current;
    q('mouth-before-wrap').hidden=!result;
    const preset=Object.entries(mouthPresets).find(([,example])=>{
      const values=normalizeMouth(example.values);
      return fields.every(({key})=>values[key]===requested[key]);
    });
    q('mouth-preset').value=preset?.[0]??'custom';

    let adjusted=false;
    for (const field of fields) {
      const {key,input,output,domain}=field;
      const request=requested[key], applied=result?.effective[key]??null;
      // A zero-intensity, zero-volume mouth needs an intensity control to make
      // the two volume controls editable again.
      const recover = commandLayout && result && key === 'intensity' && !requested.intensity && !requested.upper && !requested.lower;
      const options = recover ? Array.from({length: 101}, (_, n) => n) : (result?.domains[key]?.points ?? []);
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
      const ranges=recover ? [[0,100]] : (result?.domains[key]?.intervals??[]);
      domain.textContent=!result?'':!ranges.length?'Valeur conservée en mémoire.':
        ranges.map(([a,b])=>a===b?pretty(a):`${format.format(a)} à ${pretty(b)}`).join(' ou ');
    }
    let status='Bouche historique active.';
    if (historical.length) status='Bouche historique conservée. Écart anatomique à arbitrer · '+historical.join(', ')+'.';
    if (result) {
      status='La bouche respecte les limites du visage.';
      if (!result.geometry.upper&&!result.geometry.lower) {
        status='Trait seul. Une silhouette de référence permet de rétablir les aplats.';
      }
      if (adjusted) status=adjustedByNose?'Le nez limite certains réglages de bouche. Les préférences restent en mémoire.':
        'L’enveloppe limite certains réglages. Les demandes restent en mémoire.';
    }
    if (blocked) status='Personnalisation suspendue. La bouche historique reste affichée.';
    q('mouth-status').textContent=status;
  }

  q('mouth-preset').addEventListener('change',event=>{
    const preset=mouthPresets[event.target.value];
    if (preset) set(normalizeMouth(preset.values));
  });
  q('mouth-active').addEventListener('change',event=>{
    if (event.target.checked) set(latent??neutral,origin);
    else {latent=current;set(null,origin);}
  });
  q('mouth-reset').addEventListener('click',()=>{latent=null;set(null);});
  q('mouth-random').addEventListener('click',()=>{
    const seed=q('mouth-seed').value;
    try {set(drawMouth(input(),eyes(),seed,{noseBounds:noseBoundsForDraw()}),{seed,version:mouthDrawVersion});}
    catch(error) {q('mouth-error').textContent=error.message;}
  });
  q('mouth-before-mode').addEventListener('change',render);

  return {
    value:()=>blocked?null:current,
    intent:()=>current,
    refresh,
    archiveSettings:()=>({mouth:blocked?null:current,mouthLatent:blocked?current:current?null:latent,mouthDraw:origin}),
    restore(data) {
      current=data.mouth??null;
      latent=data.mouthLatent??null;
      origin=data.mouthDraw??null;
      q('mouth-seed').value=origin?.seed??q('mouth-seed').defaultValue;
      q('mouth-error').textContent='';
    }
  };
}
