import {rgb} from '../bio-col-01/palette.mjs';
import {referenceCorpulence, validateCorpulence} from './body-corpulence.mjs';

export const abdominalControls=Object.freeze({
  volume:{label:'Volume musculaire',min:0,max:100,neutral:0},
  definition:{label:'Définition musculaire',min:0,max:100,neutral:56},
  width:{label:'Largeur',min:0,max:100,neutral:52},
  obliques:{label:'Développement des obliques',min:0,max:100,neutral:46}
});
export const referenceAbdominals=Object.freeze(Object.fromEntries(
  Object.entries(abdominalControls).map(([key,{neutral}])=>[key,neutral])));

export function validateAbdominals(values) {
  const keys=Object.keys(abdominalControls);
  if (!values || Object.keys(values).length!==keys.length || keys.some(key=>
    !Object.hasOwn(values,key) || !Number.isFinite(values[key]) || values[key]<0 || values[key]>100)) {
    throw new RangeError('Les quatre réglages abdominaux doivent être compris entre 0 et 100.');
  }
  return values;
}

// The rectus is continuous. Two short inferior curves distinguish its upper
// and lower regions while the oblique follows the flank towards the pelvis.
const flank=[
  [.98,.08],[[.84,.19],[.91,.37],[.75,.52]],[[.64,.67],[.45,.76],[.36,.91]],
  [[.30,.81],[.33,.64],[.44,.53]],[[.57,.36],[.79,.24],[.98,.08]]
];
const rectus=[
  [.09,.065],[[.36,.075],[.76,.02],[.83,.17]],[[.94,.28],[.96,.42],[.83,.54]],
  [[.80,.67],[.74,.86],[.42,.96]],[[.22,.94],[.13,.83],[.095,.66]],
  [[.06,.49],[.16,.37],[.105,.25]],[[.065,.17],[.065,.12],[.09,.065]]
];
const light=[
  [.24,.19],[[.39,.08],[.66,.13],[.71,.23]],[[.74,.36],[.58,.44],[.53,.57]],
  [[.51,.71],[.47,.84],[.37,.88]],[[.32,.76],[.33,.65],[.37,.53]],
  [[.41,.41],[.31,.28],[.24,.19]]
];
const upper=[
  [.18,.36],[[.36,.42],[.66,.43],[.88,.32]],[[.80,.44],[.67,.49],[.48,.49]],
  [[.33,.48],[.24,.43],[.18,.36]]
];
const lower=[
  [.17,.64],[[.34,.71],[.60,.74],[.78,.61]],[[.68,.77],[.54,.81],[.39,.79]],
  [[.29,.77],[.22,.71],[.17,.64]]
];

export function abdominalGeometry(body,values,corpulence=referenceCorpulence) {
  const {volume,definition,width,obliques}=validateAbdominals(values);
  if (volume===0) return null;
  const fat=validateCorpulence(corpulence)/100;
  const mass=(volume/100)**.78;
  const uncovered=(1-fat)**1.30;
  const visibility=.07+.93*uncovered;
  const definitionVisible=(definition/100)*(.20+.80*uncovered);
  const oblique=obliques/100;
  const top=body.levels[2].y+.077*body.height;
  const bottom=body.levels[5].y-.008*body.height;
  const reach=body.minimumWidth(top,bottom)-2.8;
  const rectusWidth=reach*(.43+.27*width/100)*(.78+.22*mass);
  const flankRoot=.88*rectusWidth;
  const flankWidth=reach*(.78+.18*oblique)-flankRoot;
  const project=(profile,side,offset,span)=>{
    const point=([x,y])=>[
      body.ground.x+side*(offset+span*x),
      top+(bottom-top)*(.07+(y-.07)*(.73+.27*mass))
    ];
    return [point(profile[0]),...profile.slice(1).map(curve=>curve.map(point))];
  };
  const sides=[-1,1].map(side=>({
    flank:project(flank,side,flankRoot,flankWidth),
    rectus:project(rectus,side,0,rectusWidth),
    light:project(light,side,0,rectusWidth),
    upper:project(upper,side,0,rectusWidth),
    lower:project(lower,side,0,rectusWidth)
  }));
  return {top,bottom,reach,mass,visibility,definitionVisible,oblique,sides};
}

const tint=(skin,target,weight)=>'#'+rgb(skin).map((value,i)=>
  Math.round(255*(value+(target[i]-value)*weight)).toString(16).padStart(2,'0')).join('');
const format=value=>Number(value.toFixed(4));

export function abdominalMarkup(body,values,corpulence,skin,smallScale) {
  const shape=abdominalGeometry(body,values,corpulence);
  if (!shape) return '';
  const {mass,visibility,definitionVisible,oblique,sides}=shape;
  const shadow=tint(skin,[.25,.17,.13],.46);
  const highlight=tint(skin,[1,.97,.86],.19);
  const intensity=mass*visibility;
  const patch=(kind,[start,...curves],fill,opacity)=>{
    const point=coordinates=>coordinates.map(format).join(',');
    const path='M'+point(start)+curves.map(curve=>'C'+curve.map(point).join(' ')).join('')+'Z';
    return `<path data-abdominal-part="${kind}" d="${path}" fill="${fill}" opacity="${format(opacity)}"/>`;
  };
  return `<g data-abdominals="" aria-hidden="true" pointer-events="none">${sides.map(side=>
    (oblique>0 ? patch('oblique',side.flank,shadow,intensity*.50*oblique) : '')+
    patch('rectus',side.rectus,highlight,intensity*.72)+
    (smallScale ? '' : patch('surface',side.light,highlight,intensity*.28))+
    (definitionVisible>0 ? patch('upper',side.upper,shadow,intensity*definitionVisible*.77)+
      patch('lower',side.lower,shadow,intensity*definitionVisible*.72) : '')
  ).join('')}</g>`;
}
