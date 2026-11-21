import {geometry as baseGeometry} from './base/model.mjs';
export const cuts=Object.freeze({
 classic:{name:'Classique courte',catalogue:'03 · Classique',texture:'lisse',color:'#a7742e',contour:'#79501f',light:'#bc8b43',note:'Volume supérieur balayé, tempes dégagées.'},
 bob:{name:'Carré court',catalogue:'04 · Carré court',texture:'lisse',color:'#9a692d',contour:'#70491d',light:'#b3813c',note:'Raie centrale, mèches courbes et côtés arrondis.'},
 curls:{name:'Boucles courtes',catalogue:'08 · Boucles courtes',texture:'bouclée',color:'#bc7b2c',contour:'#935b20',light:'#d69948',note:'Boucles larges, volume irrégulier autour du crâne.'}
});
export const heads=Object.freeze({oval:'Allongée',round:'Ronde',pear:'À bajoues'});
export const defaults=Object.freeze({cut:'classic',head:'oval'});
export function normalize(input={}){
 return {cut:Object.hasOwn(cuts,input.cut)?input.cut:defaults.cut,head:Object.hasOwn(heads,input.head)?input.head:defaults.head};
}
export function model(input={}){
 const parameters=normalize(input);
 const base=baseGeometry({head:parameters.head,hair:'none',mouth:'smile',nose:'triangle',silhouette:'tee',chest:'plain'});
 const {cx,cy,rx,ry}=base.head;
 const cheekFactor=parameters.head==='pear'?1.12:parameters.head==='round'?1.02:.98;
 const top=cy-ry;
 const anchors={
  crown:[cx,top],forehead:[cx,cy-ry*.46],
  templeLeft:[cx-rx*.88,cy-ry*.12],templeRight:[cx+rx*.88,cy-ry*.12],
  sideLeft:[cx-rx,cy-ry*.34],sideRight:[cx+rx,cy-ry*.34],
  cheekLeft:[cx-rx*cheekFactor,cy+ry*.5],cheekRight:[cx+rx*cheekFactor,cy+ry*.5],
  base:[cx,cy+ry*(parameters.head==='pear'?1.14:1)],nape:[cx,cy+ry+3]
 };
 // Skull volume is bounded separately from cheek clearance and nape length.
 // No global horizontal transform: different zones respond to their own anchors.
 const fit={cx,cy,rx,ry,top,cap:rx+5,temple:rx*.88,side:Math.max(rx+5,rx*cheekFactor+3),
  forehead:anchors.forehead[1],end:anchors.base[1]-2,cheek:rx*cheekFactor};
 return {parameters,cut:cuts[parameters.cut],base,anchors,fit};
}
