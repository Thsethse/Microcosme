import {pectoralControls, referencePectorals} from './pectorals.mjs';
import {referenceChest} from './chest.mjs';
import {studySkin} from './marks-study.mjs';
import {structureCombinations} from './structure-study.mjs';

const ticks=[0,50,100];
const fatCases=[[25,'Mince'],[50,'Standard'],[100,'Très obèse']];
const matrix=fatCases.flatMap(([corpulence,label])=>ticks.map(volume=>({id:`matrix-${corpulence}-${volume}`,
  label:`${label} · Volume ${volume} %`, corpulence, pectorals:{...referencePectorals,volume}})));
const axes=Object.entries(pectoralControls).flatMap(([key,{label}])=>ticks.map(value=>({id:`axis-${key}-${value}`,
  label:`${label} · ${value} %`, pectorals:{...referencePectorals,volume:75,[key]:value}})));
const structures=structureCombinations.slice(0,5).map(([id,label,structure])=>({id:`skeleton-${id}`,label,structure,
  pectorals:{...referencePectorals,volume:100,width:100,height:100,angularity:100,definition:100},corpulence:id==='min' ? 0 : 50}));
const comparisons=fatCases.map(([corpulence,label])=>({id:`comparison-${corpulence}`,label,corpulence,
  pectorals:{...referencePectorals,volume:75},chest:{...referenceChest,volume:75}}));

export function renderPectoralStudy(panel,{render,background}) {
  const view=panel.querySelector('#pectoral-study-scale').value;
  const skin=panel.querySelector('#pectoral-study-skin').value;
  const portrait=(body,{structure,corpulence,pectorals,chest})=>studySkin(render({key:'shaved:U',body,view,structure,corpulence,
    pectorals,chest,chestStudySkin:skin}),skin);
  for(const [region,examples] of [['matrix',matrix],['axes',axes],['structure',structures]]) {
    const gallery=panel.querySelector('#pectoral-'+region);
    gallery.className=`structure-study-grid ${background}`;
    gallery.innerHTML=examples.map(example=>`<figure class="card pectoral-specimen" data-pectoral-case="${example.id}">
      <div class="surface ${view}">${portrait('adult-h',example)}</div><figcaption>${example.label}</figcaption></figure>`).join('');
  }
  const compare=panel.querySelector('#pectoral-comparison');
  compare.className=`structure-study-grid ${background}`;
  compare.innerHTML=comparisons.map(example=>`<article class="card" data-pectoral-case="${example.id}"><h4>${example.label} · Volume 75 %</h4>
    <div class="structure-pair">${[['adult-h','Base H'],['adult-f','Base F']].map(([body,label])=>
      `<figure><div class="surface ${view}">${portrait(body,example)}</div><figcaption>${label}</figcaption></figure>`).join('')}</div></article>`).join('');
}
