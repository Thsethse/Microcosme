import {abdominalControls, referenceAbdominals} from './abdominals.mjs';
import {studySkin} from './marks-study.mjs';
import {structureCombinations} from './structure-study.mjs';

export const abdominalDetailFrame='10 137 140 75';

const stops=[0,50,100];
const corps=[[25,'Mince'],[50,'Standard'],[100,'Très obèse']];
const matrix=corps.flatMap(([corpulence,label])=>stops.map(volume=>({
  id:`matrix-${corpulence}-${volume}`,caption:`${label} · Volume ${volume} %`,corpulence,
  values:{...referenceAbdominals,volume}
})));
const axes=Object.entries(abdominalControls).flatMap(([key,{label}])=>stops.map(value=>({
  id:`axis-${key}-${value}`,caption:`${label} · ${value} %`,corpulence:25,
  values:{...referenceAbdominals,volume:82,[key]:value}
})));

export function renderAbdominalStudy(panel,{render,background}) {
  const scale=panel.querySelector('#abdominal-study-scale').value;
  const skin=panel.querySelector('#abdominal-study-skin').value;
  const chosen=panel.querySelector('#abdominal-study-structure').value;
  const [, , structure]=structureCombinations.find(([id])=>id===chosen);
  const detail=scale==='detail';
  const view=detail ? 'tile' : scale;
  const portrait=(body,corpulence,abdominals)=>studySkin(render({key:'shaved:U',body,corpulence,structure,abdominals,
    view,frame:detail ? abdominalDetailFrame : undefined,boneReliefs:true,chestStudySkin:skin}),skin);
  for (const [name,cases] of [['matrix',matrix],['axes',axes]]) {
    const gallery=panel.querySelector('#abdominal-study-'+name);
    gallery.className=`structure-study-grid ${background}`;
    gallery.innerHTML=cases.map(({id,caption,corpulence,values})=>
      `<article class="card" data-abdominal-case="${id}"><h4>${caption}</h4><div class="structure-pair">
        ${[['adult-h','Base H'],['adult-f','Base F']].map(([body,label])=>`
          <figure><div class="surface ${detail ? 'abdominal-detail' : view}">${portrait(body,corpulence,values)}</div>
            <figcaption>${label}</figcaption></figure>`).join('')}</div></article>`).join('');
  }
}
