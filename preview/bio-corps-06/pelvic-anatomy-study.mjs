import {pubicHairStops} from './pelvic-details.mjs';
import {studySkin} from './marks-study.mjs';
import {structureCombinations} from './structure-study.mjs';

export const pelvicCloseup = '48 180 64 42';
export const pelvicStudyHair = ['noir-profond','chatain-clair','roux-cuivre','blond-pale','blanc-ivoire'];
const pelvicViews = {
  detail: ['tile',pelvicCloseup,'pubic-detail'],
  tile: ['tile',undefined,'tile'],
  // Keep the historical dimensions and pan down to bring the pelvis into the frame.
  head: ['head','-30 26 220 225','head'],
  mini: ['mini','-35 6 230 245','mini']
};

export function renderPelvicAnatomyStudy(panel,{render,background}) {
  const selected = id => panel.querySelector('#pubic-study-'+id).value;
  const [view,frame,display] = pelvicViews[selected('scale')];
  const skin = selected('skin');
  const hair = selected('hair');
  const corpulence = Number(selected('corpulence'));
  const [, , structure] = structureCombinations.find(([id])=>id===selected('structure'));
  const gallery = panel.querySelector('#pubic-study-cases');
  gallery.className = `structure-study-grid ${background}`;
  gallery.innerHTML = pubicHairStops.map(([length,label])=>
    `<article class="card" data-pubic-case="${length}"><h4>${length} % · ${label}</h4><div class="structure-pair">${
      [['adult-h','Base H'],['adult-f','Base F']].map(([body,name])=>{
        const svg = studySkin(render({key:'p5-038:G',body,structure,corpulence,hair,chestStudySkin:skin,
          view,frame,bellyFinish:true,pelvicDetails:true,pubicHairLength:length}),skin);
        return `<figure data-pubic-base="${body}"><div class="surface ${display}">${svg}</div><figcaption>${name}</figcaption></figure>`;
      }).join('')}</div></article>`).join('');
}
