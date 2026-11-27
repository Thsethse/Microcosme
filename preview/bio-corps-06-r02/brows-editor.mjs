import {palette} from '../bio-col-01/palette.mjs';
import {browColourModes, browControls, browDrawVersion, browPresets, browsFor, drawBrows, normalizeBrows} from './brows.mjs';
import {intervalsOf} from './iris.mjs';

const format = new Intl.NumberFormat('fr-FR',{maximumFractionDigits:2});
const features = ['absent','monobrow','slit'];

export function mountBrowsEditor({input, eyes, colours, render}) {
  const q=id=>document.getElementById(id);
  let current=null, latent=null, origin=null;
  const neutral=normalizeBrows({});
  const fields=[];
  const addOptions=(target, options)=>target.append(...options.map(([value,label])=>new Option(label,value)));
  addOptions(q('brows-preset'),[['custom','Personnalisés'],...Object.entries(browPresets).map(([key,preset])=>[key,preset.label])]);
  addOptions(q('brows-colour-mode'),Object.entries(browColourModes));
  for (const [category,label] of [['natural','Naturelles'],['fantasy','Fantaisie']]) {
    const group=document.createElement('optgroup');
    group.label=label;
    addOptions(group,palette.filter(c=>c.category===category).map(c=>[c.id,c.name]));
    q('brows-colour').append(group);
  }

  for (const [key,control] of Object.entries(browControls)) {
    const id='brow-'+key;
    const label=document.createElement('label');
    label.className='slider';
    label.innerHTML=`<span>${control.label}<output id="${id}-value" for="${id}"></output></span><input id="${id}" type="range" min="0" max="0" step="1" aria-label="${control.label}" aria-describedby="${id}-domain"><small class="eye-domain" id="${id}-domain"></small>`;
    q('brow-axes').append(label);
    const field={key,control,input:q(id),output:q(id+'-value'),domain:q(id+'-domain')};
    fields.push(field);
    field.input.addEventListener('input',()=>{
      const v=field.points[field.input.valueAsNumber];
      if (current&&v!==undefined) set({...current,[key]:v});
    });
  }

  function set(value, draw=null) {
    current=value;
    origin=draw;
    q('brows-error').textContent='';
    refresh();
    render();
  }

  function refresh() {
    const result=current?browsFor(input(),eyes(),current,colours(),true):null;
    const requested=result?.requested??latent??neutral;
    q('brows-active').checked=!!current;
    q('brows-parameters').disabled=!current;
    q('brows-before-wrap').hidden=!current;
    for (const key of features) {
      q('brows-'+key).checked=requested[key];
      q('brows-'+key).disabled=key!=='absent'&&requested.absent;
    }
    q('brows-preset').disabled=requested.absent;
    const preset=Object.entries(browPresets).find(([,example])=>{
      const values=normalizeBrows(example.values);
      return fields.every(({key})=>values[key]===requested[key]);
    });
    q('brows-preset').value=preset?.[0]??'custom';
    q('brows-colour-mode').value=requested.colourMode;
    q('brows-colour-mode').disabled=requested.absent;
    q('brows-colour').value=requested.colour;
    q('brows-colour').disabled=requested.absent||requested.colourMode!=='independent';
    const pigment=result?.pigment;
    q('brow-chip').hidden=!pigment;
    q('brow-chip').style.backgroundColor=pigment?.fill??'';
    q('brows-pigment').textContent=pigment?.source==='remembered'?'Teinte capillaire mémorisée.':
      pigment?.source==='historical'?'Teinte capillaire historique.':'';

    let adjusted=false;
    for (const field of fields) {
      const {key,control,input,output,domain}=field;
      const request=requested[key], applied=result?.effective[key]??null;
      const options=result?.domains[key]??[];
      const value=applied??request;
      field.points=options.includes(value)?options:[...options,value].sort((a,b)=>a-b);
      input.max=field.points.length-1;
      input.value=field.points.indexOf(value);
      input.disabled=!options.length||field.points.length<2;
      const pretty=n=>format.format(n)+(control.unit==='°'?'°':' %');
      const change=applied!==null&&request!==applied;
      adjusted ||= change;
      output.textContent=change?`${pretty(request)} → ${pretty(value)}`:pretty(value);
      input.setAttribute('aria-valuetext',change?`${pretty(request)} demandé, ${pretty(value)} effectif`:pretty(value));
      const ranges=intervalsOf(options,1);
      domain.textContent=!result?'':!ranges.length?'Valeur conservée en mémoire.':
        ranges.map(([a,b])=>a===b?pretty(a):`${format.format(a)} à ${pretty(b)}`).join(' ou ');
    }
    q('brows-status').textContent=!current?'Sourcils historiques actifs.':
      requested.absent?'Sourcils absents. Les autres réglages restent en mémoire.':
      adjusted?'L’enveloppe limite certains réglages. Les demandes restent en mémoire.':
      'Les réglages suivent l’enveloppe du visage.';
  }

  for (const key of features) q('brows-'+key).addEventListener('change',event=>set({...current,[key]:event.target.checked}));
  q('brows-colour-mode').addEventListener('change',event=>set({...current,colourMode:event.target.value}));
  q('brows-colour').addEventListener('change',event=>set({...current,colour:event.target.value}));
  q('brows-preset').addEventListener('change',event=>{
    const preset=browPresets[event.target.value];
    if (!preset) return;
    const values=normalizeBrows(preset.values);
    set({...current,...Object.fromEntries(fields.map(({key})=>[key,values[key]]))});
  });
  q('brows-active').addEventListener('change',event=>{
    if (event.target.checked) set(latent??neutral,origin);
    else {latent=current;set(null,origin);}
  });
  q('brows-reset').addEventListener('click',()=>{latent=null;set(null);});
  q('brows-random').addEventListener('click',()=>{
    const seed=q('brows-seed').value;
    try {set(drawBrows(input(),eyes(),seed),{seed,version:browDrawVersion});}
    catch(error) {q('brows-error').textContent=error.message;}
  });
  q('brows-before-mode').addEventListener('change',render);

  return {
    value:()=>current, refresh,
    archiveSettings:()=>({brows:current,browsLatent:current?null:latent,browsDraw:origin}),
    restore(data) {
      current=data.brows??null;
      latent=data.browsLatent??null;
      origin=data.browsDraw??null;
      q('brows-seed').value=origin?.seed??q('brows-seed').defaultValue;
      q('brows-error').textContent='';
    }
  };
}
