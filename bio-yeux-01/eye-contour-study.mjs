import {model, presets} from '../preview/bio-vis-p5-i6/model.mjs';
import {eyePresets} from './eyes.mjs';
import {freckleViews, studySkin} from './marks-study.mjs';
import {character} from './render.mjs';

const pale = {face:{style:'shaved',...presets.broad.values}, skin:'#f4cfb6', tone:'Rosée claire'};
const honey = {face:{style:'p5-038'}, skin:'#dbbf88', tone:'Miel'};
const copper = {face:{style:'p5-041',...presets.broad.values}, skin:'#a57155', tone:'Cuivrée'};
const deep = {face:{style:'shaved',...presets.tall.values}, skin:'#573222', tone:'Brune profonde'};
const dense = {lashes:{count:3,length:10,spacing:50}};
const withLiner = colour => ({
  liner:{enabled:true,colour,top:63,bottom:24,wing:87,slant:23,intensity:100}
});

export const eyeContourCases = [
  {label:'Ouverture historique', ...honey, eyes:null},
  {label:'Contour seul', ...pale, eyes:'round', details:{lashes:{count:0}}},
  {label:'Cils naturels · faible densité', ...copper, eyes:'almond', details:{lashes:{count:1,length:9}}},
  {label:'Cils naturels · forte densité', ...deep, eyes:'upturned', details:dense},
  {label:'Cils et eyeliner noir', ...deep, eyes:'upturned', details:dense, makeup:withLiner('#151519')},
  {label:'Eyeliner bleu', ...pale, eyes:'narrow', details:{lashes:{count:0}}, makeup:withLiner('#3f649b')}
];

function views(sample) {
  const {eyeLeft:[left,y],eyeRight:[right]} = model(sample.face).base.anchors;
  return [['eye-close','Détail des yeux',`${left - 14} ${y - 15} ${right - left + 28} 31`,{headOnly:true}],
    ...freckleViews.slice(1)];
}

function portrait(sample, view, naturalEyes, instance) {
  const [key,caption,frame,scale] = view;
  const svg = character(sample.face,{
    ...scale,eyes:sample.eyes,details:sample.details,makeup:sample.makeup,
    naturalEyes,contourSkin:sample.skin,instance
  }).replace(/viewBox="[^"]*"/,`viewBox="${frame}"`);
  return `<figure class="freckle-${key}" data-eye-scale="${key}">${studySkin(svg,sample.skin)}<figcaption>${caption}</figcaption></figure>`;
}

export function mountEyeContourStudy() {
  const section = document.getElementById('planche-contours');
  const panel = document.getElementById('eye-contour-panel');
  const gallery = document.getElementById('eye-contour-study');
  section.hidden = false;
  document.querySelector('a[href="#planche-contours"]').hidden = false;

  function refresh() {
    if (gallery.firstElementChild || !panel.open) return;
    gallery.innerHTML = eyeContourCases.map((sample,i)=>{
      const form = eyePresets[sample.eyes]?.label ?? 'Historique';
      const pair = [['before','Avant',false],['after','Après',true]].map(([key,label,revised])=>
        `<section data-eye-revision="${key}"><h4>${label}</h4><div class="eye-contour-views">${views(sample).map(view=>
          portrait(sample,view,revised,`contours-${i}-${key}-${view[0]}`)).join('')}</div></section>`).join('');
      return `<article data-eye-contour-case="${i}" class="freckle-row"><h3>${sample.label}</h3>
        <p><span class="makeup-chip" aria-hidden="true" style="background:${sample.skin}"></span> ${sample.tone} · ${form}</p>
        <div class="eye-contour-pair">${pair}</div></article>`;
    }).join('');
  }

  function openFromLink() {
    if (location.hash === '#planche-contours') panel.open = true;
  }
  panel.addEventListener('toggle',refresh);
  window.addEventListener('hashchange',openFromLink);
  openFromLink();
  refresh();
}
