import {freckleCases,freckleViews,studySkin} from './marks-study.mjs';
import {character} from './render.mjs';
import {scarPresets,scarStages} from './scars.mjs';

export const scarCases=freckleCases;
export const scarViews=Object.freeze([['close','Gros plan','42 39 76 67',{headOnly:true}],...freckleViews.slice(1)]);

export function scarCards(study) {
  const reference={...scarPresets.sutured.values,x:28,y:64,length:52,width:36,angle:80};
  return [
    ...Object.values(scarPresets).map(({label,values})=>({label,values:{...values,seed:study.seed}})),
    ...scarStages.map(([maturity,label])=>({label,values:{...reference,maturity,intensity:82,seed:study.seed}}))
  ];
}

export function scarStudyPortrait(study,sample,view,naturalEyes=false) {
  const [key,,frame,scale]=view;
  const svg=character(study.face,{...scale,eyes:'almond',scarStudySkin:study.skin,naturalEyes,contourSkin:study.skin,
    scars:[{id:'s1',...sample.values}],instance:'planche-cicatrices-'+key})
    .replace(/viewBox="[^"]*"/,`viewBox="${frame}"`);
  return studySkin(svg,study.skin);
}

export function mountScarStudy(naturalEyes=false) {
  const list=document.getElementById('scar-study-case'), gallery=document.getElementById('scar-study');
  list.append(...scarCases.map((study,i)=>new Option(study.label,String(i))));
  function refresh(){
    const study=scarCases[Number(list.value)];
    gallery.innerHTML=scarCards(study).map((sample,i)=>`<article class="freckle-row" data-scar-study="${i}"><h3>${sample.label}</h3><div class="freckle-scales">`+
      scarViews.map(view=>`<figure class="freckle-${view[0]}">${scarStudyPortrait(study,sample,view,naturalEyes)}`+
        `<figcaption>${view[1]}</figcaption></figure>`).join('')+'</div></article>').join('');
  }
  const panel=document.getElementById('scar-study-panel');
  panel.addEventListener('toggle',()=>{if(panel.open&&!gallery.childElementCount) refresh();});
  list.addEventListener('change',refresh);
  if(location.hash==='#planche-cicatrices') panel.open=true;
  window.addEventListener('hashchange',()=>{if(location.hash==='#planche-cicatrices') panel.open=true;});
}
