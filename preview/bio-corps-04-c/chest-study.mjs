import {chestControls, chestStops, referenceChest} from './chest.mjs';
import {freckleCases, studySkin} from './marks-study.mjs';
import {structureCombinations} from './structure-study.mjs';

const levels=[0,50,100];
const variants=['width','length','sag','roundness','spacing'];
const phases=[['before','Avant · R01'],['after','Après · R02']];
const contexts=structureCombinations.slice(0,3).flatMap(([id,label,structure])=>levels.map(corpulence=>({
  id:`${id}-${corpulence}`,label:`${id==='reference' ? 'Ossature standard' : label} · Corpulence ${corpulence} %`,structure,corpulence,
  chest:{...referenceChest,volume:100,width:80}
})));
const extremes=structureCombinations.slice(3,5).map(([id,label,structure])=>({
  id:`extreme-${id}`, label, structure, corpulence:id==='min' ? 0 : 100,
  chest:{...referenceChest,volume:100,width:100,length:100,sag:100,spacing:id==='min' ? 0 : 100}
}));
const cases=[
  ['chest-volume-cases',chestStops.map(([volume,label])=>({id:`volume-${volume}`,label:`${volume} % · ${label}`,chest:{...referenceChest,volume}}))],
  ['chest-heavy-cases',chestStops.slice(1).map(([volume,label])=>({id:`heavy-${volume}`,label:`${volume} % · ${label}`,corpulence:100,chest:{...referenceChest,volume}}))],
  ['chest-form-cases',variants.flatMap(key=>levels.map(value=>({id:`${key}-${value}`,label:`${chestControls[key].label} · ${value} %`,
    chest:{...referenceChest,volume:key==='width' ? 100 : 75,[key]:value}})))],
  ['chest-context-cases',[...contexts,...extremes]]
];
export const chestStudySkins=freckleCases.map(({skin,label})=>[skin,label.split(' · ')[1]]);

export function renderChestStudy(panel, {render, background}) {
  const choice=panel.querySelector('#chest-study-scale').value;
  const detail=choice==='detail';
  const view=detail ? 'tile' : choice;
  const frame=detail ? '10 115 140 88' : undefined;
  const skin=panel.querySelector('#chest-study-skin').value;
  panel.dataset.detail=String(detail);
  for (const [section,specimens] of cases) {
    const gallery=panel.querySelector('#'+section);
    gallery.className=`structure-study-grid ${background}`;
    gallery.innerHTML=specimens.map(({id,label,chest,structure,corpulence})=>`<article class="card" data-chest-case="${id}">
      <h4>${label}</h4><div class="structure-pair">${phases.map(([phase,caption])=>`<figure data-chest-phase="${phase}">
        <div class="surface ${detail ? 'chest-detail' : view}">${studySkin(render({key:'shaved:U',body:'adult-f',view,frame,structure,corpulence,chest,
          chestStudySkin:skin,chestRevision:phase==='before' ? 'r01' : undefined}),skin)}</div><figcaption>${caption}</figcaption>
      </figure>`).join('')}</div>
    </article>`).join('');
  }
}
