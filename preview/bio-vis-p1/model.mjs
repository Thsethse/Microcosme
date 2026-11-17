export const palette = Object.freeze({skin:'#dcc18a',contour:'#bda46e',detail:'#bea66f',white:'#f6f5e9',pupil:'#33332c',hair:'#76501f'});
export const choices = Object.freeze({
  silhouette:['tee','pear','oval','column','trapezoid','hourglass'],
  head:['triangle','round','oval','square','pear'],
  eyes:['round','sleepy','sharp'], nose:['button','line','triangle'],
  mouth:['line','smile','lips','round'], hair:['short','bob','curls','swept','none'],
  chest:['plain','curves','pectoral'],age:['adult','elder']
});
export const bounds = Object.freeze({belly:[.72,1.3],shoulders:[.72,1.25],hips:[.72,1.25]});
export const defaults=Object.freeze({silhouette:'tee',belly:1,shoulders:1,hips:1,head:'triangle',eyes:'round',nose:'button',mouth:'line',hair:'short',chest:'pectoral',age:'adult'});
export const presets=Object.freeze([
  {name:'Émile',note:'Épaules carrées · tête en pointe',...defaults},
  {name:'Alma',note:'Courbes douces · carré court',...defaults,silhouette:'pear',head:'oval',hair:'bob',eyes:'sharp',mouth:'lips',chest:'curves',hips:1.1},
  {name:'Rose',note:'Silhouette ronde · boucles',...defaults,silhouette:'oval',head:'square',hair:'curls',chest:'curves',nose:'line',mouth:'round',belly:1.12},
  {name:'Lou',note:'Colonne fine · mèche',...defaults,silhouette:'column',head:'square',hair:'swept',chest:'plain',mouth:'smile'},
  {name:'Gustave',note:'Trapèze · visage rond',...defaults,silhouette:'trapezoid',head:'pear',hair:'none',age:'elder',belly:1.15,mouth:'smile',chest:'plain'},
  {name:'Ari',note:'Sablier · regard tranquille',...defaults,silhouette:'hourglass',head:'oval',hair:'none',eyes:'sleepy',chest:'curves',nose:'line'}
]);
export function normalize(input={}){
  const p={...defaults};
  for(const [key,values]of Object.entries(choices))if(values.includes(input[key]))p[key]=input[key];
  for(const [key,[lo,hi]]of Object.entries(bounds))if(Number.isFinite(input[key]))p[key]=Math.max(lo,Math.min(hi,input[key]));
  return p;
}
const forms={tee:[48,25,29],pear:[31,36,48],oval:[37,43,51],column:[18,17,18],trapezoid:[41,48,47],hourglass:[48,25,48]};
export function geometry(input){
  const p=normalize(input),[s,b,h]=forms[p.silhouette];
  const shoulders=s*p.shoulders,belly=b*p.belly,hips=h*p.hips;
  // All facial anchors are local to the selected head's bounding rectangle.
  const dims={triangle:[31,44],round:[36,40],oval:[29,44],square:[29,42],pear:[34,39]};
  const [rx,ry]=dims[p.head];
  const cy=p.head==='round'?68:65;
  const head={cx:80,cy,rx,ry};
  const anchor=(u,v)=>[80+rx*u,cy+ry*v];
  return {parameters:p,body:{shoulders,belly,hips,top:108,waist:171,bottom:249},head,
    anchors:{eyeLeft:anchor(-.42,.13),eyeRight:anchor(.42,.13),nose:anchor(0,.4),mouth:anchor(0,.67),browLeft:anchor(-.42,-.09),browRight:anchor(.42,-.09)}};
}
export function hopPose(progress,from=0,to=1){
  const t=Math.max(0,Math.min(1,Number.isFinite(progress)?progress:0));
  const phase=(t*4)%1,air=Math.sin(phase*Math.PI);
  return {x:from+(to-from)*t,y:-Math.max(0,air)*7,tilt:Math.sin(t*Math.PI*8)*2};
}
