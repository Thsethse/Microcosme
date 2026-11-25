import {rgb} from '../bio-col-01/palette.mjs';
import {presets} from '../bio-vis-p5-i6/model.mjs';
import {palette} from '../bio-vis-p5-i6/i5/i4/i3/i2/i1/base/r1/p2/base/model.mjs';
import {character} from './render.mjs';

// These four colours also exercise the inherited mouth and nose palettes.
// The comparison varies the study skin independently of the archived model.
export const freckleCases=Object.freeze([
  {label:'Neutre · Miel · Amande',skin:'#dbbf88',seed:'Amande',face:{style:'p5-038'}},
  {label:'Visage long · Rosée · Iris',skin:'#f4cfb6',seed:'Iris',face:{...presets.tall.values,style:'shaved'}},
  {label:'Visage large · Cuivrée · Argile',skin:'#a57155',seed:'Argile',face:{...presets.broad.values,style:'p5-041'}},
  {label:'Pommettes marquées · Brune · Sienne',skin:'#573222',seed:'Sienne',face:{cheek_width:1.14,temple_width:.84,
    jaw_width:.83,skull_height:1.14,skull_width:.92,style:'p5-024'}}
]);
export const freckleDensities=Object.freeze([[27,'Faible'],[59,'Moyenne'],[100,'Forte']]);
export const freckleViews=Object.freeze([
  ['close','Gros plan','48 60 64 38',{headOnly:true}],
  ['head','Tête · 300 px','-30 -65 220 225',{headOnly:true}],
  ['body','Corps · 178 px','-40 -85 240 355',{}],
  ['mini','Miniature · 70 × 70 px','-35 -68 230 245',{headOnly:true,smallScale:true}]
]);

export function studyPortrait(study,density,view) {
  const [key,,frame,scale]=view;
  const marks=[{id:'m1',type:'freckles',seed:study.seed,density}];
  const svg=character(study.face,{...scale,marks,markStudySkin:study.skin,instance:'planche-'+key})
    .replace(/viewBox="[^"]*"/,`viewBox="${frame}"`);
  return studySkin(svg,study.skin);
}

export function studySkin(svg,skin) {
  if(skin===palette.skin) return svg;
  const reference=rgb(palette.skin), next=rgb(skin);
  const tint=hex=>'#'+rgb(hex).map((channel,i)=>
    Math.round(255*channel*next[i]/reference[i]).toString(16).padStart(2,'0')).join('');
  // Replace the inherited skin fills only on the study portrait. Marks
  // already use the chosen study pigment from the same renderer.
  return svg.replaceAll(palette.skin,skin).replaceAll(palette.contour,tint(palette.contour));
}

export function mountFreckleStudy() {
  const list=document.getElementById('freckle-case'), gallery=document.getElementById('freckle-study');
  list.append(...freckleCases.map((study,i)=>new Option(study.label,String(i))));
  function refresh(){
    const study=freckleCases[Number(list.value)];
    gallery.innerHTML=freckleDensities.map(([density,label])=>
      `<article class="freckle-row" data-density="${density}"><h3>Densité ${label.toLowerCase()}</h3><div class="freckle-scales">`+
      freckleViews.map(view=>`<figure class="freckle-${view[0]}">${studyPortrait(study,density,view)}`+
        `<figcaption>${view[1]}</figcaption></figure>`).join('')+'</div></article>').join('');
  }
  list.addEventListener('change',refresh);
  refresh();
}
