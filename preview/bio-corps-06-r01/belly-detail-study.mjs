import {adultBodyGeometry} from './adult-body.mjs';
import {referenceAbdominals} from './abdominals.mjs';
import {abdominalFoldGeometry, pelvicLandmarks} from './belly-details.mjs';
import {corpulenceStops} from './body-corpulence.mjs';
import {studySkin} from './marks-study.mjs';
import {structureCombinations} from './structure-study.mjs';

export const pelvicDetailFrame='4 140 152 83';

const percent=new Intl.NumberFormat('fr-FR',{maximumFractionDigits:2});
const bases=[['adult-h','Base H'],['adult-f','Base F']];

export function renderBellyDetailStudy(panel,{render,background}) {
  const selected=id=>panel.querySelector('#belly-study-'+id).value;
  const scale=selected('scale');
  const skin=selected('skin');
  const [, , structure]=structureCombinations.find(([id])=>id===selected('structure'));
  const abdominals={...referenceAbdominals,volume:Number(selected('muscle'))};
  const detail=scale==='detail';
  const view=detail ? 'tile' : scale;
  const portrait=(body,corpulence,bellyFinish)=>studySkin(render({key:'shaved:U',body,corpulence,structure,abdominals,
    view,frame:detail ? pelvicDetailFrame : undefined,boneReliefs:true,bellyFinish,chestStudySkin:skin}),skin);
  const gallery=panel.querySelector('#belly-study-corpulence');
  gallery.className=`structure-study-grid ${background}`;
  gallery.innerHTML=corpulenceStops.map(({value,label})=>
    `<article class="card" data-belly-case="corpulence-${value}"><h4>${percent.format(value)} % · ${label}</h4>
      ${bases.map(([body,name])=>`<section class="corpulence-study-pair" data-belly-base="${body}"><h5>${name}</h5>
        <div class="structure-pair">${[['before','Avant · R01','r01'],['after','Après · R02',true]].map(([phase,caption,version])=>`
          <figure data-belly-phase="${phase}"><div class="surface ${detail ? 'pelvic-detail' : view}">${portrait(body,value,version)}</div>
            <figcaption>${caption}</figcaption></figure>`).join('')}</div></section>`).join('')}</article>`).join('');
}

export function renderPelvicStudy(panel,{render,chin,background}) {
  const corpulence=Number(panel.querySelector('#pelvic-study-corpulence').value);
  const [, , structure]=structureCombinations.find(([id])=>id===panel.querySelector('#pelvic-study-structure').value);
  const gallery=panel.querySelector('#pelvic-study-cases');
  gallery.className=`body-comparison ${background}`;
  gallery.innerHTML=bases.map(([body,label])=>{
    const shape=adultBodyGeometry(body,chin,structure,corpulence);
    const marks=pelvicLandmarks(shape);
    const fold=abdominalFoldGeometry(shape,corpulence);
    const guides=`<g class="pelvic-guides" data-pelvic-guides="" aria-hidden="true">${Object.entries(marks).map(([key,y])=>
      `<line data-pelvic-landmark="${key}" x1="12" x2="148" y1="${y}" y2="${y}"/>`).join('')}${
        corpulence ? `<path data-pelvic-margin="" d="M${shape.ground.x},${fold.bottom}V${marks.reservedTop}"/>` : ''}</g>`;
    const portrait=render({key:'shaved:U',body,structure,corpulence,view:'tile',frame:pelvicDetailFrame,bellyFinish:true,boneReliefs:true});
    const caption=corpulence ? `Marge sous le pli · ${percent.format(marks.reservedTop-fold.bottom)} unités SVG` : 'Pli abdominal absent à 0 %';
    return `<figure class="card" data-pelvic-case="${body}"><h4>${label}</h4><div class="surface pelvic-detail">${portrait.replace('</svg>',guides+'</svg>')}</div>
      <figcaption>${caption}</figcaption></figure>`;
  }).join('');
}
