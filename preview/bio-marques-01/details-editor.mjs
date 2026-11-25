import {detailControls, detailsDrawVersion, detailsFor, drawDetails, normalizeDetails} from './details.mjs';
import {intervalsOf} from './iris.mjs';

const format = new Intl.NumberFormat('fr-FR',{maximumFractionDigits:2});

export function mountDetailsEditor({input, eyes, render}) {
  const q=id=>document.getElementById(id);
  let current=null, latent=null, origin=null;
  const neutral=normalizeDetails({});
  const fields=[];
  for (const [group,axes] of Object.entries(detailControls)) {
    for (const [axis,control] of Object.entries(axes)) {
      const id='detail-'+group+'-'+axis;
      const label=document.createElement('label');
      label.className='slider';
      label.innerHTML=`<span>${control.label}<output id="${id}-value" for="${id}"></output></span><input id="${id}" type="range" min="0" max="0" step="1" aria-label="${control.label}" aria-describedby="${id}-domain"><small class="eye-domain" id="${id}-domain"></small>`;
      q('detail-axes-'+group).append(label);
      const field={group,axis,control,input:q(id),output:q(id+'-value'),domain:q(id+'-domain')};
      fields.push(field);
      field.input.addEventListener('input',()=>{
        const value=field.points[field.input.valueAsNumber];
        if (!current||value===undefined) return;
        set({...current,[group]:{...current[group],[axis]:value}});
      });
    }
  }

  function set(value, draw = null) {
    current=value;
    origin=draw;
    q('details-error').textContent='';
    refresh();
    render();
  }

  function refresh() {
    const result=current?detailsFor(input(),eyes(),current,true):null;
    const requested=result?.requested??latent??neutral;
    q('details-active').checked=!!current;
    q('details-parameters').disabled=!current;
    q('details-before-wrap').hidden=!current;
    let adjusted=false;
    for (const field of fields) {
      const {group,axis,control,input,output,domain}=field;
      const request=requested[group][axis];
      const effective=result?.effective[group][axis]??null;
      const options=result?.domains[group][axis]??[];
      const value=effective??request;
      field.points=options.includes(value)?options:[...options,value].sort((a,b)=>a-b);
      input.max=field.points.length-1;
      input.value=field.points.indexOf(value);
      input.disabled=options.length===0||field.points.length<2;
      const pretty=n=>format.format(n)+(control.unit?' '+control.unit:'');
      const change=effective!==null&&request!==effective;
      adjusted ||= change;
      output.textContent=change?`${pretty(request)} → ${pretty(value)}`:pretty(value);
      input.setAttribute('aria-valuetext',change?`${pretty(request)} demandé, ${pretty(value)} effectif`:pretty(value));
      const ranges=intervalsOf(options,control.step);
      domain.textContent=!result?'':!ranges.length?'Valeur conservée en mémoire.':
        ranges.map(([a,b])=>a===b?pretty(a):`${format.format(a)} à ${pretty(b)}`).join(' ou ');
    }
    const status=!current?'Rendu des contours historiques actif.':adjusted?
      'L’enveloppe limite certains réglages. Les valeurs demandées restent en mémoire.':
      'Les détails actifs suivent l’ouverture actuelle.';
    q('details-status').textContent=status;
  }

  q('details-active').addEventListener('change',event=>{
    if (event.target.checked) set(latent??neutral,origin);
    else {latent=current;set(null,origin);}
  });
  q('details-reset').addEventListener('click',()=>{latent=null;set(null);});
  q('details-random').addEventListener('click',()=>{
    const seed=q('details-seed').value;
    try {set(drawDetails(input(),eyes(),seed),{seed,version:detailsDrawVersion});}
    catch (error) {q('details-error').textContent=error.message;}
  });
  q('details-before-mode').addEventListener('change',render);

  return {
    value:()=>current,
    refresh,
    archiveSettings:()=>({details:current,detailsLatent:current?null:latent,detailsDraw:origin}),
    restore(data) {
      current=data.details??null;
      latent=data.detailsLatent??null;
      origin=data.detailsDraw??null;
      q('details-seed').value=origin?.seed??q('details-seed').defaultValue;
      q('details-error').textContent='';
    }
  };
}
