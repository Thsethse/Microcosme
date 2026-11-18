import {cuts} from './p2/hair-model.mjs';
import {geometry as baseGeometry} from './p2/base/model.mjs';
export {cuts};
export const controls=Object.freeze({
 skull_width:{label:'Largeur du crâne',min:.86,max:1.18},
 skull_height:{label:'Hauteur du crâne',min:.88,max:1.18},
 forehead_width:{label:'Largeur du front',min:.88,max:1.14},
 forehead_height:{label:'Hauteur du front',min:.84,max:1.18},
 temple_width:{label:'Largeur des tempes',min:.9,max:1.16},
 cheek_width:{label:'Largeur des joues',min:.88,max:1.22},
 jowls:{label:'Volume des bajoues',min:.75,max:1.35},
 jaw_width:{label:'Largeur de la mâchoire',min:.82,max:1.22}
});
export const presets=Object.freeze({neutral:{name:'Neutre',values:{}},tall:{name:'Allongé · front haut',values:{skull_width:.94,skull_height:1.16,forehead_width:.96,forehead_height:1.17,temple_width:.95,cheek_width:.94,jowls:.88,jaw_width:.94}},broad:{name:'Large · joues et bajoues',values:{skull_width:1.16,skull_height:.95,forehead_width:1.08,forehead_height:.96,temple_width:1.12,cheek_width:1.2,jowls:1.32,jaw_width:1.12}}});
export function normalize(input={}){
 const result={cut:Object.hasOwn(cuts,input.cut)?input.cut:'classic'};
 for(const [key,{min,max}]of Object.entries(controls))result[key]=Math.max(min,Math.min(max,Number.isFinite(input[key])?input[key]:1));
 return result;
}
const smoothMax=(a,b)=>.5*(a+b+Math.sqrt((a-b)**2+.64));
export function contourPath(points){
 // Closed Catmull–Rom -> cubic Bézier: one continuous contour and shared tangents.
 let d=`M${points[0]}`;
 for(let i=0;i<points.length;i++){
  const p0=points[(i+points.length-1)%points.length],p1=points[i],p2=points[(i+1)%points.length],p3=points[(i+2)%points.length];
  const a=p1.map((v,j)=>v+(p2[j]-p0[j])/6),b=p2.map((v,j)=>v-(p3[j]-p1[j])/6);
  d+=` C${a} ${b} ${p2}`;
 }
 return d+'Z';
}
export function model(input={}){
 const parameters=normalize(input),p=parameters;
 const x=80,y=65,r=29*p.skull_width,h=44*p.skull_height,top=y-h;
 const fw=r*p.forehead_width,tw=r*.88*p.temple_width;
 const cheek=r*.98*p.cheek_width,jowl=r*(.82+.75*(p.jowls-1))*p.cheek_width,jaw=r*.62*p.jaw_width;
 const fy=y-h*.46-16*(p.forehead_height-1),end=y+h-2;
 const base=baseGeometry({head:'oval',hair:'none',mouth:'smile',nose:'triangle',silhouette:'tee',chest:'plain'});
 base.head={cx:x,cy:y,rx:r,ry:h};
 const eyeX=r*.42*(1+.08*(p.temple_width-1));
 base.anchors={eyeLeft:[x-eyeX,y+h*.13],eyeRight:[x+eyeX,y+h*.13],nose:[x,y+h*.4],mouth:[x,y+h*.67],browLeft:[x-eyeX,y-h*.09],browRight:[x+eyeX,y-h*.09]};
 const anchors={crown:[x,top],hairline:[x,fy],foreheadLeft:[x-fw*.96,y-h*.5],foreheadRight:[x+fw*.96,y-h*.5],
 templeLeft:[x-tw,y-h*.12],templeRight:[x+tw,y-h*.12],sideLeft:[x-r,y-h*.34],sideRight:[x+r,y-h*.34],
 earLeft:[x-tw*1.08,y+h*.18],earRight:[x+tw*1.08,y+h*.18],cheekLeft:[x-cheek,y+h*.35],cheekRight:[x+cheek,y+h*.35],
 jowlLeft:[x-jowl,y+h*.63],jowlRight:[x+jowl,y+h*.63],jawLeft:[x-jaw,y+h*.85],jawRight:[x+jaw,y+h*.85],chin:[x,y+h],nape:[x,y+h+3]};
 const half=[[x,top],[x+r*.72,y-h*.8],anchors.foreheadRight,[x+tw/.88*.97,y-h*.12],anchors.cheekRight,anchors.jowlRight,anchors.jawRight,anchors.chin];
 const outline=contourPath([...half,...half.slice(1,-1).reverse().map(([u,v])=>[2*x-u,v])]);
 const passage=smoothMax(cheek,jowl),side=smoothMax(r+5,passage+3),lower=smoothMax(r*.88,jaw+5);
 const fit={cx:x,cy:y,rx:r,ry:h,top,cap:r+5,forehead:fy,frontWidth:fw,temple:tw,side,end,cheek:passage,lower};
 const hairAnchors={capLeft:[x-fit.cap,top+12],capRight:[x+fit.cap,top+12],frontLeft:[x-fw*.55,fy-4],frontRight:[x+fw*.55,fy-4],attachLeft:anchors.templeLeft,attachRight:anchors.templeRight,passLeft:[x-passage-3,y+h*.45],passRight:[x+passage+3,y+h*.45],endLeft:[x-lower,end],endRight:[x+lower,end]};
 return {parameters,cut:cuts[p.cut],base,anchors,hairAnchors,outline,fit};
}
export function auditCases(){
 const allMin=Object.fromEntries(Object.entries(controls).map(([k,v])=>[k,v.min]));
 const allMax=Object.fromEntries(Object.entries(controls).map(([k,v])=>[k,v.max]));
 return [{name:'Neutre',values:{}},{name:'Tous les minimums',values:allMin},{name:'Tous les maximums',values:allMax},
 ...Object.entries(controls).flatMap(([key,c])=>[{name:c.label+' · min',values:{[key]:c.min}},{name:c.label+' · max',values:{[key]:c.max}}]),
 {name:presets.tall.name,values:presets.tall.values},{name:presets.broad.name,values:presets.broad.values}];
}
