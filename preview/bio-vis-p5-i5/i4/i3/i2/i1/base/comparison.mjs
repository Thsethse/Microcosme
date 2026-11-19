import {character as before} from './p4-render.mjs';
import {character as after} from './render.mjs';
import {styles,presets} from './model.mjs';
import {priorityCase} from './r1/coverage.mjs';
const cases=[['neutral','Neutre',{}],['priority','Combinaison iPad R1',priorityCase],['tall','Allongé · front haut',presets.tall.values]];
document.getElementById('comparisons').innerHTML=['braids','waist_waves'].flatMap(style=>cases.map(([id,name,values])=>{
 const state={...values,style};
 return `<section class="comparison-case" id="${style}-${id}"><h2>${styles[style].name} · ${name}</h2><div class="comparison-grid">${[['before','Avant · P4',before],['after','Après · P4-R1',after]].map(([version,label,render])=>`<article class="comparison-panel" data-version="${version}"><h3>${label}</h3><div class="comparison-views"><figure><figcaption>Personnage entier</figcaption>${render(state)}</figure><figure class="portrait"><figcaption>Tête agrandie</figcaption>${render(state,{headOnly:true})}</figure><figure class="mini"><figcaption>Petite échelle</figcaption>${render(state,{headOnly:true,smallScale:true})}</figure></div></article>`).join('')}</div></section>`;
})).join('');
