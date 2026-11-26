import {abdominalDetailFrame} from './abdominal-study.mjs';
import {referenceAbdominals} from './abdominals.mjs';
import {corpulenceStops} from './body-corpulence.mjs';
import {navelControls, referenceNavel} from './belly-details.mjs';
import {studySkin} from './marks-study.mjs';
import {structureCombinations} from './structure-study.mjs';

const percent=new Intl.NumberFormat('fr-FR');
const references=corpulenceStops.map(({value,label})=>({
  id:'corpulence-'+value,caption:`${percent.format(value)} % · ${label}`,corpulence:value
}));
const variants=Object.entries(navelControls).flatMap(([key,{label}])=>[0,50,100].map(value=>({
  id:`${key}-${value}`,caption:`${label} · ${value} %`,corpulence:50,navel:{...referenceNavel,[key]:value}
})));

export function renderBellyDetailStudy(panel,{render,background}) {
  const selected=id=>panel.querySelector('#belly-study-'+id).value;
  const scale=selected('scale');
  const skin=selected('skin');
  const structure=structureCombinations.find(([id])=>id===selected('structure'))[2];
  const abdominals={...referenceAbdominals,volume:Number(selected('muscle'))};
  const detail=scale==='detail';
  const view=detail ? 'tile' : scale;
  const portrait=(body,corpulence,navel)=>studySkin(render({key:'shaved:U',body,corpulence,structure,abdominals,navel,
    view,frame:detail ? abdominalDetailFrame : undefined,boneReliefs:true,bellyFinish:true,chestStudySkin:skin}),skin);
  for (const [section,cases] of [['corpulence',references],['navel',variants]]) {
    const gallery=panel.querySelector('#belly-study-'+section);
    gallery.className=`structure-study-grid ${background}`;
    gallery.innerHTML=cases.map(({id,caption,corpulence,navel})=>
      `<article class="card" data-belly-case="${id}"><h4>${caption}</h4><div class="structure-pair">
        ${[['adult-h','Base H'],['adult-f','Base F']].map(([body,label])=>`
          <figure><div class="surface ${detail ? 'abdominal-detail' : view}">${portrait(body,corpulence,navel)}</div>
            <figcaption>${label}</figcaption></figure>`).join('')}</div></article>`).join('');
  }
}
