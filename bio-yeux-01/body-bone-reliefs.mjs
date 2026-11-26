import {rgb} from '../bio-col-01/palette.mjs';
import {referenceCorpulence, validateCorpulence} from './body-corpulence.mjs';

// Each relief is a pair of closed surfaces. The two sides share the same
// geometry, projected into the anatomical band of the current body.
const regions = [
  {
    id:'clavicles', from:[1,-.025], to:[1,.065], falloff:3.1,
    shadow:[
      [.105,.52], [[.26,.43],[.40,.45],[.55,.35]], [[.71,.23],[.81,.17],[.91,.18]],
      [[.76,.24],[.70,.46],[.56,.54]], [[.40,.65],[.26,.58],[.105,.52]]
    ],
    light:[
      [.10,.51], [[.25,.36],[.39,.39],[.54,.30]], [[.70,.20],[.80,.14],[.90,.18]],
      [[.75,.23],[.67,.32],[.54,.42]], [[.39,.51],[.25,.47],[.10,.51]]
    ],
    contrast:[.46,.48]
  },
  {
    id:'lateral-ribs', from:[2,.015], to:[3,-.006], falloff:3.55,
    shadow:[
      [.89,.06], [[.76,.11],[.61,.20],[.49,.34]], [[.60,.32],[.72,.27],[.80,.23]],
      [[.76,.38],[.62,.48],[.48,.53]], [[.59,.57],[.74,.51],[.81,.45]],
      [[.81,.61],[.74,.75],[.63,.82]], [[.78,.80],[.88,.66],[.91,.51]],
      [[.94,.32],[.92,.15],[.89,.06]]
    ],
    light:[
      [.88,.12], [[.72,.16],[.60,.25],[.52,.32]], [[.64,.30],[.77,.28],[.85,.22]],
      [[.81,.39],[.65,.49],[.53,.53]], [[.70,.52],[.82,.47],[.86,.39]],
      [[.90,.30],[.89,.21],[.88,.12]]
    ],
    contrast:[.32,.33]
  },
  {
    id:'subcostal', from:[2,.101], to:[4,-.018], falloff:3.35,
    shadow:[
      [.84,.10], [[.68,.30],[.42,.45],[.15,.29]], [[.24,.46],[.38,.65],[.53,.67]],
      [[.67,.67],[.77,.47],[.84,.10]]
    ],
    light:[
      [.80,.18], [[.64,.31],[.44,.47],[.21,.35]], [[.31,.49],[.46,.54],[.57,.48]],
      [[.68,.43],[.75,.31],[.80,.18]]
    ],
    contrast:[.41,.14]
  },
  {
    id:'iliac-crests', from:[5,-.036], to:[6,-.017], falloff:3.45,
    shadow:[
      [.91,.13], [[.73,.09],[.56,.22],[.40,.52]], [[.34,.65],[.31,.77],[.29,.87]],
      [[.38,.80],[.49,.66],[.59,.53]], [[.73,.37],[.85,.31],[.91,.13]]
    ],
    light:[
      [.91,.13], [[.72,.08],[.54,.21],[.40,.51]], [[.36,.60],[.32,.71],[.30,.80]],
      [[.42,.65],[.49,.52],[.59,.43]], [[.74,.29],[.85,.22],[.91,.13]]
    ],
    contrast:[.37,.43]
  }
];

export function boneReliefGeometry(body, corpulence=referenceCorpulence) {
  const leanness=1-validateCorpulence(corpulence)/100;
  const at=([index,offset])=>body.levels[index].y+offset*body.height;
  return regions.map(({id,from,to,falloff,shadow,light,contrast})=>{
    const top=at(from), bottom=at(to);
    const reach=body.minimumWidth(top,bottom)-2.4;
    return {id,top,bottom,reach,contrast,visibility:leanness**falloff,shadow,light};
  });
}

const round=value=>Number(value.toFixed(4));
const pigment=(skin,transform)=>'#'+rgb(skin).map((channel,index)=>
  Math.round(255*transform(channel,index)).toString(16).padStart(2,'0')).join('');
const shade=(skin)=>pigment(skin,(channel,index)=>channel*[.62,.52,.48][index]);
const sheen=(skin)=>pigment(skin,(channel,index)=>channel+([1,.96,.86][index]-channel)*.20);

export function boneReliefMarkup(body,corpulence,skin,smallScale=false) {
  const shadowTone=shade(skin), lightTone=sheen(skin);
  const shapes=boneReliefGeometry(body,corpulence).filter(({visibility})=>round(visibility)>0);
  if (!shapes.length) return '';
  return `<g data-bone-reliefs="" aria-hidden="true" pointer-events="none">${shapes.map(region=>{
    const {id,top,bottom,reach,visibility,contrast,shadow,light}=region;
    return `<g data-bone-family="${id}">${[-1,1].map(side=>{
      const project=([x,y])=>`${round(body.ground.x+side*x*reach)},${round(top+y*(bottom-top))}`;
      const patch=([start,...curves],fill,opacity)=>`<path d="M${project(start)}${curves.map(curve=>'C'+curve.map(project).join(' ')).join('')}Z" fill="${fill}" opacity="${round(visibility*opacity)}"/>`;
      return patch(shadow,shadowTone,contrast[0])+(smallScale ? '' : patch(light,lightTone,contrast[1]));
    }).join('')}</g>`;
  }).join('')}</g>`;
}
