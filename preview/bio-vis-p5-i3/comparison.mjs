import {references,styles,bodies,presets} from './model.mjs';
import {character} from './render.mjs';
import {character as oldCharacter} from './i2/render.mjs';
import {priorityCase} from './i2/i1/base/r1/coverage.mjs';
const closest={19:['classic','bob'],20:['short','short'],21:['classic','bob'],22:['classic','mid_waves'],23:['short','bun'],24:['pony','pony'],25:['classic','asym_long'],26:['short','fringe_bob'],27:['curls','long_curls'],28:['braids','braids'],29:['p5-019','p5-023'],30:['p5-027','p5-027'],31:['bun','p5-023'],32:['side_braid','braids'],33:['p5-019','bun'],34:['p5-025','p5-022'],35:['side_braid','braids'],36:['long_straight','bun'],37:['p5-020','p5-024'],38:['p5-023','p5-026'],39:['p5-026','p5-032'],40:['p5-022','p5-022'],41:['p5-025','p5-032'],42:['p5-023','p5-030'],43:['p5-026','p5-022'],44:['p5-026','p5-025'],45:['braids','p5-032']};
const $=id=>document.getElementById(id);
$('reference').innerHTML=Object.values(references).map(s=>`<option value="${s.id}">${s.number} · ${s.name}</option>`).join('');
const requested=new URLSearchParams(location.search).get('reference');$('reference').value=references[requested]?requested:'p5-037';
function render(){
 const ref=references[$('reference').value],morph=$('morph').value,values=morph==='priority'?priorityCase:presets[morph].values,monochrome=$('mono').checked;
 $('comparisons').innerHTML=['G','D'].map((arrangement,i)=>{
  const p={...values,style:ref.id,arrangement,monochrome,accessories:!monochrome},old=closest[ref.number][i];
  const panel=(title,fn,state,instance)=>`<article class="compare-panel"><h3>${title}</h3><div class="compare-views"><figure><figcaption>Personnage entier</figcaption>${fn(state,{instance:instance+'-whole'})}</figure><figure><figcaption>Tête agrandie</figcaption>${fn(state,{headOnly:true,instance:instance+'-head'})}</figure><figure class="mini"><figcaption>Petite échelle</figcaption>${fn(state,{headOnly:true,smallScale:true,instance:instance+'-mini'})}</figure></div></article>`;
  return `<section class="compare-case" id="arrangement-${arrangement}"><h2>${ref.number} · ${ref.name} · ${arrangement}</h2><div class="compare-grid">${panel('P5-I2 · parenté : '+styles[old].name,oldCharacter,{...p,style:old,arrangement:ref.number===37&&arrangement==='D'?'G':arrangement},'old-'+arrangement)}${panel('P5-I3 · arrangement '+arrangement,character,p,'new-'+arrangement)}</div><div class="body-compare">${Object.entries(bodies).map(([body,b])=>`<article class="audit-card"><h3>${b.name}</h3>${character({...p,body},{instance:'body-'+arrangement+'-'+body})}</article>`).join('')}</div></section>`;
 }).join('');
}
for(const id of ['reference','morph','mono'])$(id).addEventListener('change',render);render();
