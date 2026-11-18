import {controls,cuts,presets,normalize} from './model.mjs';
import {priorityCase} from './coverage.mjs';
import {character as before} from './source-render.mjs';
import {character as after} from './render.mjs';
export const cases=[
 {name:'Cas prioritaire signalé sur iPad',values:priorityCase},
 {name:'Neutre',values:{}},
 {name:'Tous les maximums',values:Object.fromEntries(Object.entries(controls).map(([k,v])=>[k,v.max]))},
 {name:'Tous les minimums',values:Object.fromEntries(Object.entries(controls).map(([k,v])=>[k,v.min]))},
 {name:'Front large et haut · tempes neutres',values:{forehead_width:1.14,forehead_height:1.18}},
 {name:'Front large · crâne court · tempes étroites',values:{forehead_width:1.14,skull_height:.88,temple_width:.9}},
 {name:'Combinaison intermédiaire',values:{skull_width:1.09,skull_height:1.08,forehead_width:1.09,forehead_height:1.12,temple_width:.95,cheek_width:1.1,jowls:1.2,jaw_width:.9}},
 {name:presets.tall.name,values:presets.tall.values},
 {name:presets.broad.name,values:presets.broad.values}
];
const cut=normalize({cut:new URLSearchParams(location.search).get('cut')||'bob'}).cut;
document.querySelector('#title').textContent=cuts[cut].name+' · recouvrement avant / après';
for(const [id,c]of Object.entries(cuts)){
 const a=document.createElement('a');a.href='comparison.html?cut='+id;a.textContent=c.name;a.style.cssText='display:inline-block;min-height:44px;padding:10px;color:#806432';document.querySelector('#comparison-cuts').append(a);
}
for(const item of cases){
 const p=normalize({...item.values,cut}),section=document.createElement('section');section.className='comparison-row';
 section.innerHTML=`<h2>${item.name}</h2><p class="case-values">${Object.entries(p).filter(([k])=>k!=='cut').map(([k,v])=>k+'='+v.toFixed(2)).join(' · ')}</p><div class="comparison-pair"><div class="comparison-card">${before(p,{headOnly:true})}<p>Avant · P3</p></div><div class="comparison-card">${after(p,{headOnly:true})}<p>Après · P3-R1</p></div></div>`;
 document.querySelector('#comparison').append(section);
}
