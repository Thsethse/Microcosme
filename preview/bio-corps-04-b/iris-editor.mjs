import {drawIris, heterochromias, intervalsOf, irisControls, irisDrawVersion, irisFor,
  irisPalette, normalizeIris, pupilShapes} from './iris.mjs';

export function mountIrisEditor({input, eyes, render}) {
  const q=id=>document.getElementById(id);
  const number=new Intl.NumberFormat('fr-FR',{maximumFractionDigits:2});
  const neutral=normalizeIris({});
  let current=null, latent=null, origin=null, result=null;
  const points={};
  const selectors={pupilShape:q('iris-shape'),heterochromia:q('iris-hetero'),
    primary:q('iris-primary'),secondary:q('iris-secondary')};

  const options=(select,entries)=>select.append(...entries.map(([id,label])=>new Option(label,id)));
  options(selectors.pupilShape,Object.entries(pupilShapes));
  options(selectors.heterochromia,Object.entries(heterochromias));
  for (const key of ['primary','secondary']) {
    for (const [family,label] of [['natural','Naturelles'],['fantasy','Fantaisie']]) {
      const group=document.createElement('optgroup');
      group.label=label;
      options(group,irisPalette.filter(c=>c.family===family).map(c=>[c.id,c.label]));
      selectors[key].append(group);
    }
  }

  function set(values, draw=null) {
    current=values;
    origin=draw;
    q('iris-error').textContent='';
    refresh();
    render();
  }

  for (const [key,control] of Object.entries(irisControls)) {
    const label=document.createElement('label');
    label.className='slider';
    label.innerHTML=`<span>${control.label}<output id="iris-output-${key}" for="iris-${key}"></output></span><input id="iris-${key}" type="range" min="0" max="0" step="1" aria-label="${control.label}" aria-describedby="iris-domain-${key}"><small class="eye-domain" id="iris-domain-${key}"></small>`;
    label.querySelector('input').addEventListener('input', event=>{
      const value=points[key]?.[event.target.valueAsNumber];
      if (!current || value===undefined) return;
      set({...current,[key]:value});
    });
    q('iris-sliders').append(label);
  }

  for (const [key,select] of Object.entries(selectors)) {
    select.addEventListener('change',()=>set({...current,[key]:select.value}));
  }

  const format=(value,key)=>number.format(value)+(irisControls[key].unit?' '+irisControls[key].unit:'');
  function refresh() {
    result=current ? irisFor(input(),eyes(),current,true):null;
    const requested=result?.requested??latent??neutral;
    const effective=result?.effective;
    q('iris-active').checked=!!current;
    q('iris-parameters').disabled=!current;
    q('iris-before-mode').disabled=!current;
    const central=requested.heterochromia==='central';
    const equal=requested.primary===requested.secondary;
    selectors.secondary.disabled=requested.heterochromia==='none';
    for (const [key,selector] of Object.entries(selectors)) selector.value=requested[key];
    for (const key of ['primary','secondary']) {
      const colour=irisPalette.find(c=>c.id===requested[key]);
      const chip=q('iris-chip-'+key);
      chip.style.backgroundColor=colour.fill;
      chip.style.borderColor=colour.outline;
    }
    for (const [key,control] of Object.entries(irisControls)) {
      const slider=q('iris-'+key);
      const inactive=key==='secondarySize'&&(!central||equal);
      const domain=result?.domains[key]??[];
      const value=inactive||!effective?requested[key]:effective[key];
      points[key]=domain.includes(value)?domain:[...domain,value].sort((a,b)=>a-b);
      slider.max=points[key].length-1;
      slider.value=points[key].indexOf(value);
      slider.disabled=inactive||points[key].length<2;
      const text=format(value,key);
      const request=requested[key]!==value?format(requested[key],key):null;
      q('iris-output-'+key).textContent=request?`${request} → ${text}`:text;
      slider.setAttribute('aria-valuetext',request?`${request} demandé, ${text} effectif`:text);
      const intervals=intervalsOf(domain,control.step);
      q('iris-domain-'+key).textContent=!result?'':inactive?'Réglage en mémoire.':
        key==='secondarySize'&&domain.length<=1?'Aucun accroissement visible sur cette ouverture.':
        intervals.map(([a,b])=>a===b?format(a,key):number.format(a)+' à '+format(b,key)).join(' ou ');
    }

    let message='Pigments historiques actifs.';
    if (current) {
      if (requested.heterochromia!=='none'&&equal) message='Les deux nuances sont identiques. La seconde nuance reste en mémoire.';
      else if (central&&effective.heterochromia==='none') message='La zone demandée est masquée. Sa taille reste en mémoire.';
      else if (central&&effective.secondarySize!==requested.secondarySize) message='Une portion de la zone est masquée. La valeur appliquée est indiquée.';
      else if (effective.pupilSize!==requested.pupilSize) message='La pupille a été ajustée pour rester dans l’iris.';
      else message='Les réglages affichés sont appliqués.';
    }
    q('iris-status').textContent=message;
  }

  q('iris-active').addEventListener('change',event=>{
    if (event.target.checked) set(latent??neutral,origin);
    else {latent=current; set(null,origin);}
  });
  q('iris-reset').addEventListener('click',()=>{latent=null;set(null);});
  q('iris-random').addEventListener('click',()=>{
    const seed=q('iris-seed').value;
    try {set(drawIris(input(),eyes(),seed),{seed,version:irisDrawVersion});}
    catch(error) {q('iris-error').textContent=error.message;}
  });
  q('iris-before-mode').addEventListener('change',render);

  return {
    value:()=>current,
    refresh,
    archiveSettings:()=>({iris:current,irisLatent:!current?latent:null,irisDraw:origin}),
    restore(data) {
      current=data.iris??null;
      latent=data.irisLatent??null;
      origin=data.irisDraw??null;
      q('iris-seed').value=origin?.seed??q('iris-seed').defaultValue;
      q('iris-error').textContent='';
    }
  };
}
