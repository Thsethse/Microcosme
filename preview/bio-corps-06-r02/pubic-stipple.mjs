import {rgb} from '../bio-col-01/palette.mjs';
import {abdominalFoldGeometry} from './belly-details.mjs';

const round = value => Number(value.toFixed(3));

// The two envelopes share a rounded upper edge. F tapers to a lower point.
function halfWidth(x, t, male) {
  const taper = Math.sin(Math.PI*t)**.32*(1-(male ? .63 : .85)*t);
  return taper*(1+.035*Math.sin(31*t+2*x)+.026*Math.sin(52*t-3*x));
}

function dotPattern(male) {
  let seed = male ? 740 : 741;
  const next = () => ((seed=(Math.imul(seed,1664525)+1013904223)>>>0)/4294967296);
  const points = [];
  const candidate = () => {
    let x,y;
    do {
      x=2*next()-1;
      y=next();
    } while (Math.abs(x)>halfWidth(Math.sign(x),y,male));
    return {x,y};
  };
  // Farthest of a few candidates spaces points organically without a lattice.
  // Every prefix is already distributed over the whole zone.
  while (points.length<220) {
    let best, score=-1;
    for (let i=0;i<12;i++) {
      const point=candidate();
      let distance=Infinity;
      for (const other of points) {
        distance=Math.min(distance,((point.x-other.x)*1.65)**2+(point.y-other.y)**2);
      }
      if (distance>score) {
        score=distance;
        best=point;
      }
    }
    points.push({...best,tone:Math.floor(next()*3),size:.85+.30*next()});
  }
  return points;
}

const patterns = { 'adult-h':dotPattern(true), 'adult-f':dotPattern(false) };

export function pubicStippleGeometry(body, key, frame, corpulence, growth, smallScale) {
  const male=key==='adult-h';
  const height=frame.end-frame.top;
  const top=male ? Math.max(abdominalFoldGeometry(body,corpulence).bottom+body.height*.0038,
    frame.top-height*.12) : frame.top+height*.29;
  const end=frame.top+height*(male ? .36 : .89);
  const reach=frame.reach*(male ? 1.13 : 1.02);
  const project=({x,y})=>({x:frame.axis+x*reach,y:top+y*(end-top)});
  const boundary=side=>Array.from({length:25},(_,index)=>{
    const y=(side===1 ? index : 24-index)/24;
    const p=project({x:side*halfWidth(side,y,male),y});
    return [round(p.x),round(p.y)].join(',');
  });
  const outline='M'+[...boundary(1),...boundary(-1)].join('L')+'Z';
  const count=smallScale ? 85 : 220;
  const spacing=Math.sqrt(1.06*reach*(end-top)/count);
  const radius=spacing*.99*(growth/100)**1.18;
  const dots=patterns[key].slice(0,count).map(({x,y,tone,size})=>({...project({x,y}),tone,radius:size*radius}));
  return {outline,dots};
}

export function pubicStippleMarkup(body,key,frame,corpulence,hair,growth,smallScale,clipId) {
  const {outline,dots}=pubicStippleGeometry(body,key,frame,corpulence,growth,smallScale);
  const id=clipId(outline);
  const groups=['','',''];
  for (const {x,y,radius,tone} of dots) {
    const r=round(radius);
    if (!r) continue;
    const d=round(2*r);
    groups[tone]+=`M${round(x-r)},${round(y)}a${r},${r} 0 1 0 ${d},0a${r},${r} 0 1 0 -${d},0Z`;
  }
  const channels=rgb(hair);
  const paths=groups.map((commands,tone)=>{
    const fill='#'+channels.map((channel,index)=>Math.round(255*(.91*channel+.09*[.22+tone*.18,.16+tone*.16,.13+tone*.15][index])).toString(16).padStart(2,'0')).join('');
    return `<path fill="${fill}" d="${commands}"/>`;
  }).join('');
  return `<defs><clipPath id="${id}"><path d="${outline}"/></clipPath></defs><g data-pubic-hair="" clip-path="url(#${id})">${paths}</g>`;
}
