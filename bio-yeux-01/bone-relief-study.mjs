import {corpulenceStops} from './body-corpulence.mjs';
import {referenceChest} from './chest.mjs';
import {referencePectorals} from './pectorals.mjs';
import {studySkin} from './marks-study.mjs';
import {structureCombinations} from './structure-study.mjs';

const bases=[['adult-h','Base H'],['adult-f','Base F']];
const contrasts=[['before','Avant · 04-C'],['after','Après · 05-A']];
const carriers=[
  ['flat','Thorax plat',0],
  ['volume','Volume thoracique à 100 %',100]
];
const percent=new Intl.NumberFormat('fr-FR');

export function renderBoneReliefStudy(panel,{render,background}) {
  const scale=panel.querySelector('#bone-relief-scale').value;
  const skin=panel.querySelector('#bone-relief-skin').value;
  const [, , structure]=structureCombinations.find(([id])=>id===panel.querySelector('#bone-relief-structure').value);
  const zoom=scale==='detail';
  const view=zoom ? 'tile' : scale;
  const portrait=(body,corpulence,boneReliefs,volume=0)=>`<div class="surface ${zoom ? 'bone-relief-detail' : view}">${studySkin(render({
    key:'shaved:U',body,corpulence,structure,boneReliefs,view,frame:zoom ? '2 111 156 109' : undefined,chestStudySkin:skin,
    ...(body==='adult-h' ? {pectorals:{...referencePectorals,volume,width:83,height:76}}
      : {chest:{...referenceChest,volume,width:78}})
  }),skin)}</div>`;
  const references=panel.querySelector('#bone-relief-references');
  references.className=`structure-study-grid ${background}`;
  references.innerHTML=corpulenceStops.map(({value,label})=>`
    <article class="card" data-bone-study-level="${value}">
      <h4>${percent.format(value)} % · ${label}</h4>
      ${bases.map(([body,name])=>`<section class="corpulence-study-pair" data-bone-study-body="${body}"><h5>${name}</h5>
        <div class="structure-pair">${contrasts.map(([phase,caption])=>`<figure data-bone-study-phase="${phase}">
          ${portrait(body,value,phase==='after')}<figcaption>${caption}</figcaption></figure>`).join('')}</div></section>`).join('')}
    </article>`).join('');
  const coverage=panel.querySelector('#bone-relief-coverage');
  coverage.className=`body-comparison ${background}`;
  coverage.innerHTML=bases.map(([body,label])=>`
    <article class="card" data-bone-study-coverage="${body}">
      <h4>${label} · Corpulence 0 %</h4>
      <div class="structure-pair">${carriers.map(([id,caption,volume])=>`<figure data-bone-study-carrier="${id}">
        ${portrait(body,0,true,volume)}<figcaption>${caption}</figcaption></figure>`).join('')}</div>
    </article>`).join('');
}
