import {styles,model,controls,presets,bodies} from '../preview/bio-vis-p5-i6/model.mjs';
import {character as before} from '../preview/bio-vis-p5-i6/render.mjs';
import {character as after} from './render.mjs';
import {priorityCase} from '../preview/bio-vis-p5-i6/i5/i4/i3/i2/i1/base/r1/coverage.mjs';
export const dossiers=[
 {id:'E01',title:'Petites boucles et larges vagues',note:'08 reste inchangé. 58-G devient plus court et plaqué, avec de larges vagues frontales jointives. Le dessin ne reconstitue pas les zones cachées sous les feuilles.',keys:['08','58-G']},
 {id:'E02',title:'Deux organisations de queue haute',note:'12 conserve son balayage latéral et sa queue haute décentrée. 24-D conserve la queue, avec une raie centrale, deux grandes mèches arrondies et des longueurs latérales ondulées.',keys:['12','24-D']},
 {id:'E03',title:'Balayage compact et mèche haute',note:'19-G et 21-G restent deux choix visibles et inchangés. 68-G reçoit trois grands retours courbes locaux ; le crâne et la calotte ne sont pas agrandis.',keys:['19-G','21-G','68-G']},
 {id:'E05',title:'Rouleaux étagés et rouleau central',note:'31-D conserve son chignon haut et ses rouleaux latéraux. 58-D reçoit un grand rouleau frontal et des côtés relevés plus continus. 68-D reste inchangé et hors de cette correction.',keys:['31-D','58-D']}
];
const entries=Object.entries(styles).flatMap(([style,s],i)=>{const n=s.number||i+1;return (s.number?['G','D']:['U']).map(a=>({key:String(n).padStart(2,'0')+(a==='U'?'':'-'+a),style,a,number:n,name:s.name}));});
const map=new Map(entries.map(e=>[e.key,e])),q=s=>document.querySelector(s),esc=s=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('"','&quot;');
let active=dossiers.find(d=>d.id===location.hash.slice(1))||dossiers[0],custom=null,parameters={},serial=0;
for(const d of dossiers){const b=document.createElement('button');b.textContent=d.id+' · '+d.title;b.dataset.dossier=d.id;b.addEventListener('click',()=>{active=d;custom=null;history.replaceState(null,'','#'+d.id);render();});q('#dossiers').append(b);}
for(const [key,b]of Object.entries(bodies)){const o=document.createElement('option');o.value=key;o.textContent=b.name;q('#body').append(o);}q('#body').value='standard';
for(const [style,s]of Object.entries(styles)){const o=document.createElement('option');o.value=style;o.textContent=(s.number?String(s.number).padStart(2,'0')+' · ':'')+s.name;q('#catalogue').append(o);}
const allMin=Object.fromEntries(Object.entries(controls).map(([k,c])=>[k,c.min])),allMax=Object.fromEntries(Object.entries(controls).map(([k,c])=>[k,c.max]));
const morphs={neutral:{name:'Neutre',values:{}},ipad:{name:'Cas iPad combiné',values:priorityCase},min:{name:'Tous les minimums',values:allMin},max:{name:'Tous les maximums',values:allMax},tall:presets.tall,broad:presets.broad};
for(const [key,p]of Object.entries(morphs)){const o=document.createElement('option');o.value=key;o.textContent=p.name;q('#preset').append(o);}
for(const [key,c]of Object.entries(controls)){const label=document.createElement('label');label.innerHTML=esc(c.label)+`<output id="value-${key}">1,00</output><input data-control="${key}" type="range" min="${c.min}" max="${c.max}" step="0.01" value="1" aria-label="${esc(c.label)}">`;label.querySelector('input').addEventListener('input',e=>{parameters[key]=Number(e.target.value);q('#preset').value='';render();});q('#controls').append(label);}
q('#preset').addEventListener('change',()=>{parameters={...morphs[q('#preset').value].values};render();});
q('#reset').addEventListener('click',()=>{parameters={};q('#preset').value='neutral';render();});
for(const id of ['view','body','accessories'])q('#'+id).addEventListener('change',render);
q('#inspect').addEventListener('click',()=>{const style=q('#catalogue').value,a=q('#arrangement').value;custom=entries.find(e=>e.style===style&&(e.a===a||e.a==='U'));render();});
function original(e,id){
 const boards=[['A',19,'P5-A.png'],['B',28,'P5-B.png'],['C',37,'P5-C.png'],['D',46,'P5-D.png'],['E v1',55,'P5-E-v1.png'],['F',64,'P5-F.png']];
 if(e.number>12&&e.number<19)return '<p class="source-note">Exploration P4 sans case dédiée dans la planche V1.</p>';
 const b=e.number<=12?['V1',1,'catalogue-v1.png']:boards.find(b=>e.number>=b[1]&&e.number<b[1]+9),i=e.number-b[1];
 const box=e.number<=12?[20+i%4*195,120+Math.floor(i/4)*285,193,280]:[5+i%3*512+(e.a==='G'?120:310),107+Math.floor(i/3)*288+24,e.a==='G'?200:193,256];
 const [x,y,w,h]=box,url='../preview/bio-vis-p5-i6/references/'+b[2];
 return `<svg class="original" role="img" aria-label="Source ${b[0]} · ${e.key}" viewBox="${box.join(' ')}"><defs><clipPath id="${id}"><rect x="${x}" y="${y}" width="${w}" height="${h}"/></clipPath></defs><image href="${url}" width="1536" height="1024" clip-path="url(#${id})"/></svg><p class="source-note">Planche ${b[0]} · ${e.a==='U'?'référence historique':e.a==='G'?'illustration gauche':'illustration droite'}. Extrait original sans retouche.<br><a href="${url}" target="_blank" rel="noopener">Voir la planche entière ↗</a></p>`;
}
function figure(fn,input,tag,options,frame){
 const parsed=new DOMParser().parseFromString(fn(input,{...options,instance:tag}),'image/svg+xml'),svg=parsed.documentElement;
 svg.setAttribute('viewBox',frame);
 // Only display paint is shared. Original accessory geometry and colours remain untouched.
 const hair='[data-layer=rear],[data-layer=back],[data-layer=volume],[data-layer=front],[data-layer=sides],[data-layer=texture],[data-layer=lengths]';
 for(const n of svg.querySelectorAll('path,circle,ellipse,rect,polygon,polyline,line'))if(!n.closest('defs')&&n.closest(hair)){if(n.getAttribute('fill')!=='none')n.setAttribute('fill','#9d7b47');if(n.hasAttribute('stroke')&&n.getAttribute('stroke')!=='none')n.setAttribute('stroke','#4c3822');}
 // P4 pony's incorporated tie is excluded only in the visual comparison, as in the audit.
 if(input.style==='pony'&&!q('#accessories').checked)svg.querySelectorAll('[data-layer=rear] path[stroke-width="4"]').forEach(n=>n.remove());
 return new XMLSerializer().serializeToString(svg);
}
function render(){
 serial++;for(const [key]of Object.entries(controls)){const val=parameters[key]??1;q(`[data-control="${key}"]`).value=val;q('#value-'+key).textContent=val.toFixed(2).replace('.',',');}
 for(const b of document.querySelectorAll('[data-dossier]'))b.setAttribute('aria-pressed',String(!custom&&b.dataset.dossier===active.id));
 q('#case-number').textContent=custom?'CATALOGUE · CONTRÔLE':active.id+' · LOT 1';q('#case-title').textContent=custom?custom.name:active.title;q('#case-note').textContent=custom?'Seuls 58-G, 24-D, 68-G et 58-D sont modifiés dans ce lot. Tous les autres choix sont délégués au prototype P5-I6.':active.note;
 const keys=custom?[custom.key]:active.keys,head=q('#view').value==='head',accessories=q('#accessories').checked;
 q('#rows').innerHTML=keys.map(key=>{const e=map.get(key),input={...parameters,style:e.style,arrangement:e.a,body:q('#body').value,monochrome:!accessories,accessories,contrast:false};
  const cells=[['before','Avant · P5-I6',before],['after','Après · Lot 1',after]].map(([type,title,fn])=>{const tag=`${serial}-${key}-${type}`,main=figure(fn,input,tag+'-main',{headOnly:head},head?'-30 -65 220 225':'-40 -85 240 355'),tile=figure(fn,input,tag+'-tile',{},'-40 -85 240 355'),mini=figure(fn,input,tag+'-mini',{headOnly:true,smallScale:true},'-35 -68 230 245');return `<section class="panel ${type}" aria-label="${title}"><h4>${title}</h4><div class="main-view">${main}</div><div class="scales"><div class="tile-view">${tile}</div><p class="scale-caption">Vignette · 178 px</p><div class="mini-view">${mini}</div><p class="scale-caption">Miniature · 70 × 70 px</p></div></section>`;}).join('');
  return `<article class="reference-row" data-key="${key}"><div class="row-heading"><h3>${key} · ${esc(e.name)}</h3><p>${e.style} · ${e.a==='U'?'référence historique unique':'arrangement '+e.a} · ${['58-G','24-D','68-G','58-D'].includes(key)?'cible corrigée':'témoin inchangé'}</p></div><div class="columns"><section class="panel source-panel"><h4>Illustration originale</h4>${original(e,'source-'+serial+'-'+key)}</section>${cells}</div></article>`;
 }).join('');
 q('#status').textContent=(accessories?'Contrôle avec accessoires.':'Jugement des formes : sans accessoires.')+' Les deux rendus partagent la même morphologie.';
}
render();
