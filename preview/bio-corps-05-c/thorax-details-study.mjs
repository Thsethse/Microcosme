import {referenceChest} from './chest.mjs';
import {referencePectorals} from './pectorals.mjs';
import {studySkin} from './marks-study.mjs';
import {structureCombinations} from './structure-study.mjs';
import {referenceThoraxDetails, thoraxDetailControls} from './thorax-details.mjs';

export const thoraxDetailFrame='5 116 150 80';

const axes=Object.entries(thoraxDetailControls);
const bodies=[['adult-h','H'],['adult-f','F']];
const [,fine,wide,narrowest,broadest]=structureCombinations;
const contexts=[
  {id:'flat',label:'Thorax plat · deux bases',volumeH:0,volumeF:0},
  {id:'lean',label:'Ossature fine · corpulence 0 %',volumeH:25,volumeF:25,corpulence:0,structure:fine[2]},
  {id:'standard',label:'Ossature et corpulence standards',volumeH:50,volumeF:50},
  {id:'wide',label:'Ossature large · corpulence 75 %',volumeH:80,volumeF:75,corpulence:75,structure:wide[2]},
  {id:'heavy',label:'Corpulence 100 % · volumes 100 %',volumeH:100,volumeF:100,corpulence:100},
  {id:'minimum',label:'Limites basses · détails petits et hauts',volumeH:100,volumeF:100,corpulence:0,structure:narrowest[2],
    chest:{width:0,length:0,spacing:0,sag:0},pectorals:{width:0,height:0},
    details:{size:0,shape:0,pigment:0,horizontal:0,vertical:100,nippleSize:0,relief:0}},
  {id:'maximum',label:'Limites hautes · détails ovales et bas',volumeH:100,volumeF:100,corpulence:100,structure:broadest[2],
    chest:{width:100,length:100,spacing:100,sag:100},pectorals:{width:100,height:100},
    details:{size:100,shape:100,pigment:100,horizontal:100,vertical:0,nippleSize:100,relief:100}}
];

export function renderThoraxDetailsStudy(panel,{render,background}) {
  const scale=panel.querySelector('#thorax-details-study-scale').value;
  const skin=panel.querySelector('#thorax-details-study-skin').value;
  const detail=scale==='detail';
  const view=detail ? 'tile' : scale;
  const pair=example=>`<div class="structure-pair">${bodies.map(([body,label])=>{
    const svg=render({key:'shaved:U',body,view,frame:detail ? thoraxDetailFrame : undefined,
      chest:{...referenceChest,...example.chest,volume:example.volumeF ?? 65},
      pectorals:{...referencePectorals,...example.pectorals,volume:example.volumeH ?? 65},
      thoraxDetails:{...referenceThoraxDetails[body],...example.details},
      chestStudySkin:skin,structure:example.structure,corpulence:example.corpulence});
    return `<figure><div class="surface ${detail ? 'thorax-detail' : view}">${studySkin(svg,skin)}</div><figcaption>${label}</figcaption></figure>`;
  }).join('')}</div>`;
  panel.querySelector('#thorax-details-axes').innerHTML=axes.map(([key,{label}])=>
    `<section><h4>${label}</h4><div class="structure-study-grid ${background}">${[0,50,100].map(value=>
      `<article class="card" data-thorax-axis="${key}-${value}"><h5>${value} %</h5>${pair({details:{[key]:value}})}</article>`
    ).join('')}</div></section>`).join('');
  const gallery=panel.querySelector('#thorax-details-carriers');
  gallery.className=`structure-study-grid ${background}`;
  gallery.innerHTML=contexts.map(example=>`<article class="card" data-thorax-carrier="${example.id}">
    <h4>${example.label}</h4>${pair(example)}</article>`).join('');
}
