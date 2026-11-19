import {styles,bodies,controls} from './model.mjs';
import {character} from './render.mjs';
import {priorityCase} from './r1/coverage.mjs';
const cases=[
 ['long_straight','Longs lisses · derrière les épaules','Le corps masque la masse arrière. Comparer la disparition des longueurs latérales selon la largeur des épaules.'],
 ['waist_straight','Très longs lisses · devant le buste','Comparer les rideaux avant aux limites du buste et aux détails de poitrine.'],
 ['waist_curls','Très longues boucles · volume et poitrine','Comparer les gros lobes latéraux et les contours des bras, sans détour automatique.'],
 ['afro','Afro ample · masse autour des épaules','Comparer l’interruption du volume arrière par le haut du corps.'],
 ['side_braid','Natte sur l’épaule · attache et passage avant','La tresse est à droite de l’image. Observer sa position par rapport à l’épaule et au bras.'],
 ['asym_long','Asymétrique · court à gauche, long à droite','Observer séparément la pointe du carré court et la cascade avant.']
];
function render(){
 const choice=document.getElementById('morph').value,values=choice==='priority'?priorityCase:choice==='max'?Object.fromEntries(Object.entries(controls).map(([k,c])=>[k,c.max])):{};
 document.getElementById('comparisons').innerHTML=cases.map(([style,title,note])=>`<section class="audit-section" id="audit-${style}"><h2>${title}</h2><p>${note}</p><div class="audit-grid">${Object.entries(bodies).map(([body,b])=>`<article class="audit-card"><h3>${b.name}</h3>${character({...values,style,body,monochrome:document.getElementById('mono').checked})}<p>${styles[style].name}</p></article>`).join('')}</div></section>`).join('');
}
for(const id of ['morph','mono'])document.getElementById(id).addEventListener('change',render);render();
