import {chestPresets, referenceChest} from './chest.mjs';
import {freckleCases, studySkin} from './marks-study.mjs';
import {structureCombinations} from './structure-study.mjs';

const volumes = [[26,'Petite'],[53,'Moyenne'],[88,'Grosse']];
export const chestStudySkins = freckleCases.map(({skin,label})=>[skin,label.split(' · ')[1]]);
const cases = [
  ['chest-form-cases', [
    ...chestPresets.flatMap(([id,label,form])=>volumes.map(([volume,size])=>({
      id:`${id}-${volume}`, label:`${label} · ${size}`, chest:{...form,volume}
    }))),
    {id:'flat', label:'Plate · 0 %', chest:referenceChest}
  ]],
  ['chest-corpulence-cases', [0,50,100].flatMap(corpulence=>volumes.map(([volume,size])=>({
    id:`corpulence-${corpulence}-${volume}`, label:`${size} · Corpulence ${corpulence} %`, chest:{...referenceChest,volume}, corpulence
  })))],
  ['chest-structure-cases', structureCombinations.slice(0,3).flatMap(([id,label,structure])=>volumes.map(([volume,size])=>({
    id:`structure-${id}-${volume}`, label:`${size} · ${id==='reference' ? 'Ossature standard' : label}`, chest:{...referenceChest,volume}, structure
  })))]
];

export function renderChestStudy(panel, {render, background}) {
  const choice = panel.querySelector('#chest-study-scale').value;
  const view = choice === 'detail' ? 'tile' : choice;
  const frame = choice === 'detail' ? '17 106 126 81' : undefined;
  const skin = panel.querySelector('#chest-study-skin').value;
  for (const [section,specimens] of cases) {
    const gallery = panel.querySelector('#'+section);
    gallery.className = `structure-study-grid ${background}`;
    gallery.innerHTML = specimens.map(({id,label,chest,structure,corpulence})=>`<figure class="card chest-specimen" data-chest-case="${id}">
      <div class="surface ${view}">${studySkin(render({key:'shaved:U', body:'adult-f', view, frame, structure, corpulence, chest, chestStudySkin:skin}),skin)}</div>
      <figcaption>${label}</figcaption>
    </figure>`).join('');
  }
}
