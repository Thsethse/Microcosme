import {geometry} from './model.mjs';
const path=(d,fill,stroke='none',width=.25,extra='')=>`<path d="${d}" fill="${fill}" stroke="${stroke}" stroke-width="${width}" stroke-linecap="round" stroke-linejoin="round" ${extra}/>`;
const ellipse=(x,y,rx,ry,fill,extra='')=>`<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="${fill}" ${extra}/>`;
const line=(a,b,color,width=.25)=>path(`M${a} L${b}`,'none',color,width);
export function render(ref,view,input={},options={}) {
  const g=geometry(ref,view,input), e=g.elements,p=g.parameters,old=!!options.old;
  const id=`bio-${view}`, paint=n=>`url(#${id}-${n})`;
  const at=(name,u,v)=>{const [x,y,w,h]=e[name].rect;return [x+w*u,y+h*v]};
  const pt=(name,k)=>e[name].anchors[k];
  const ink='#553d35',shade='#9c6550',light='#edbb91',hair=old?'#89857b':'#3b3430';
  let out=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -9 100 139" role="img" aria-label="Portrait masculin ${view==='front'?'de face':'de profil'}${old?', ancien':''}" data-view="${view}"><defs>
  <linearGradient id="${id}-skin" x1="0" y1="0" x2="1" y2=".35"><stop stop-color="#b4785d"/><stop offset=".36" stop-color="#efc49e"/><stop offset=".62" stop-color="#dfaa83"/><stop offset="1" stop-color="#a76b54"/></linearGradient>
  <radialGradient id="${id}-glow"><stop stop-color="#f5d4b0" stop-opacity=".85"/><stop offset="1" stop-color="#edbd94" stop-opacity="0"/></radialGradient>
  <linearGradient id="${id}-shadow" x2="1" y2=".3"><stop stop-color="#80513e" stop-opacity=".02"/><stop offset="1" stop-color="#80513e" stop-opacity=".48"/></linearGradient>
  <linearGradient id="${id}-hair" x2=".7" y2="1"><stop stop-color="${old?'#b7b1a3':'#625046'}"/><stop offset="1" stop-color="${hair}"/></linearGradient>
  </defs>`;
  // A bust grounds the head; all attachment locations follow the jaw/chin.
  const chin=pt('chin','bottom'),jaw=e.jaw.rect, skull=e.skull.rect;
  let silhouette;
  if(view==='front') {
    const top=pt('skull','top'), l=pt('skull','left'),r=pt('skull','right');
    const jl=pt('jaw','left_angle'),jr=pt('jaw','right_angle');
    out+=path(`M${jl[0]+3},${jl[1]} Q${jl[0]+7},${chin[1]+7} ${jl[0]},${chin[1]+12} L8,128 L92,128 L${jr[0]},${chin[1]+12} Q${jr[0]-7},${chin[1]+7} ${jr[0]-3},${jr[1]}Z`,paint('skin'));
    out+=path(`M${jl} Q50,${chin[1]+19} ${jr} Q50,${chin[1]+7} ${jl}Z`,paint('shadow'));
    for(const side of ['left','right']) {
      const [x,y,w,h]=e[`ear_${side}`].rect;
      out+=path(`M${x+w*.65},${y+h*.05} C${x-w*.15},${y-h*.15} ${x},${y+h*.75} ${x+w*.5},${y+h} Q${x+w},${y+h*1.06} ${x+w*.85},${y+h*.1}Z`,paint('skin'),shade,.35);
      out+=path(`M${x+w*.65},${y+h*.22} Q${x+w*.05},${y+h*.05} ${x+w*.3},${y+h*.67} Q${x+w*.75},${y+h*.42} ${x+w*.65},${y+h*.8}`,'none',shade,.5);
    }
    silhouette=`M${top} C${l[0]},${top[1]-3} ${l[0]-2},${l[1]*.5} ${l} C${l[0]+1},${jl[1]} ${jl[0]-1},${jl[1]+9} ${jl[0]+4},${jl[1]+13} Q${chin[0]-8},${chin[1]+1} ${chin} Q${chin[0]+8},${chin[1]+1} ${jr[0]-4},${jr[1]+13} C${jr[0]+1},${jr[1]+9} ${r[0]-1},${jr[1]} ${r} C${r[0]+2},${r[1]*.5} ${r[0]},${top[1]-3} ${top}Z`;
    out+=path(silhouette,paint('skin'),ink,.38);
    // Symmetric planes of temple, cheek and mandible.
    for(const sign of [-1,1]) {
      out+=`<g transform="translate(50 0) scale(${sign} 1)">`;
      const cheek=at('face',.78,.59), orbit=at('eye_right',.72,.9), cheekInner=at('face',.68,.68);
      out+=path(`M${r[0]-50},${r[1]} Q${orbit[0]-50},${cheek[1]-e.nose.rect[3]*.2} ${cheekInner[0]-50},${cheek[1]} Q${cheek[0]-50},${jr[1]} ${jr[0]-50},${jr[1]} L${jr[0]-50-e.chin.rect[2]*.25},${jr[1]+e.jaw.rect[3]*.46} Q${cheek[0]-50},${e.mouth.center[1]} ${cheekInner[0]-50},${e.mouth.rect[1]} Q${r[0]-50},${cheek[1]} ${orbit[0]-50},${orbit[1]}Z`,paint('shadow'),'none',0,`opacity="${old?.95:.7}"`);
      out+=ellipse(cheek[0]-50,cheek[1],e.face.rect[2]*.17,e.nose.rect[3]*.27,paint('glow'));
      out+='</g>';
    }
    out+=ellipse(...at('face',.44,.15),e.face.rect[2]*.41,e.face.rect[3]*.29,paint('glow'));
    for(const side of ['left','right']) {
      const [x,y,w,h]=e[`eye_${side}`].rect, pupil=pt(`eye_${side}`,'pupil');
      out+=ellipse(x+w/2,y+h*.2,w*.57,h*.74,'#835c47','opacity=".18"');
      out+=path(`M${x},${pupil[1]} Q${x+w*.4},${y+h*.02} ${x+w},${pupil[1]} Q${x+w*.48},${y+h*.88} ${x},${pupil[1]}Z`,'#e6d4b6',ink,.32);
      out+=ellipse(...pupil,w*.15,h*.29,'#69756b');
      out+=ellipse(...pupil,w*.068,h*.24,'#28372f');
      out+=ellipse(pupil[0]-.5,pupil[1]-.5,.38,.38,'#fff2d7');
      out+=path(`M${x},${pupil[1]} Q${x+w*.4},${y+h*.02} ${x+w},${pupil[1]}`,'none',ink,.62);
      out+=path(`M${x+w*.07},${y+h*.15} Q${x+w*.5},${y-h*.28} ${x+w*.93},${y+h*.19}`,'none',shade,.3);
      const b=e[`brow_${side}`];
      out+=path(`M${pt(`brow_${side}`,'start')} Q${pt(`brow_${side}`,'arch')} ${pt(`brow_${side}`,'end')} L${at(`brow_${side}`,.9,.9)} Q${at(`brow_${side}`,.5,.48)} ${at(`brow_${side}`,.05,.9)}Z`,paint('hair'));
      if(old) {
        out+=path(`M${x},${y+h} Q${x+w*.5},${y+h*1.35} ${x+w},${y+h}`,'none',shade,.35);
        out+=path(`M${x},${y+h*.8} l${side==='left'?-2:2},1.2 m${side==='left'?1:-1},-2 l${side==='left'?-2:2},-.6`,'none',shade,.3);
      }
    }
    const [nx,ny,nw,nh]=e.nose.rect,tip=pt('nose','tip'),base=pt('nose','base');
    const relief=p.nose_projection;
    out+=path(`M${at('nose',.4,0)} Q${nx+nw*.27},${ny+nh*.45} ${nx+nw*.15},${tip[1]} Q${nx-nw*.1},${base[1]+1} ${nx+nw*.27},${base[1]} L${tip}Z`,shade,'none',0,`opacity="${.18+.2*relief}"`);
    out+=path(`M${at('nose',.56,0)} Q${nx+nw*.63},${ny+nh*.5} ${nx+nw*.75},${tip[1]} Q${tip[0]},${base[1]} ${nx+nw*.28},${tip[1]} Q${nx+nw*.48},${ny+nh*.3} ${at('nose',.56,0)}Z`,paint('glow'));
    out+=path(`M${pt('nose','left_alar')} Q${nx-nw*.05},${base[1]-2} ${nx+nw*.17},${tip[1]} M${pt('nose','right_alar')} Q${nx+nw*1.05},${base[1]-2} ${nx+nw*.83},${tip[1]}`,'none',shade,.4);
    out+=ellipse(nx+nw*.25,base[1],nw*.12,.48,ink)+ellipse(nx+nw*.75,base[1],nw*.12,.48,ink);
    out+=path(`M${nx+nw*.38},${base[1]+1} Q${base[0]},${base[1]+2} ${nx+nw*.62},${base[1]+1}`,'none',shade,.35);
    const [mx,my,mw,mh]=e.mouth.rect,lc=pt('mouth','left_corner'),rc=pt('mouth','right_corner');
    out+=path(`M${lc} Q${mx+mw*.2},${my+mh*.22} ${mx+mw*.4},${my+mh*.26} L${mx+mw*.5},${my+mh*.35} L${mx+mw*.6},${my+mh*.26} Q${mx+mw*.8},${my+mh*.22} ${rc} Q${mx+mw*.5},${my+mh*.55} ${lc}Z`,'#a46b5a');
    out+=path(`M${lc} Q${mx+mw*.5},${my+mh*1.03} ${rc} Q${mx+mw*.5},${my+mh*.55} ${lc}Z`,'#ce9278');
    out+=path(`M${lc} Q${mx+mw*.32},${my+mh*.42} ${mx+mw*.5},${my+mh*.53} Q${mx+mw*.65},${my+mh*.44} ${rc}`,'none',ink,.38);
    out+=path(`M${at('mouth',.27,.86)} Q${at('mouth',.5,1.13)} ${at('mouth',.73,.86)}`,'none',shade,.4);
    out+=ellipse(chin[0],chin[1]-3,e.chin.rect[2]*.45,2,paint('glow'));
    if(old) for(const sign of [-1,1]) {
      out+=`<g transform="translate(50 0) scale(${sign} 1)">`;
      out+=path(`M${nw*.6},${base[1]-1} Q${mw*.65},${my} ${mw*.58},${my+mh*.9} M${mw*.57},${my+mh*.9} q1,3 0,5`,'none',shade,.45);
      for(let i=0;i<3;i++){const y=e.hairline.rect[1]+e.hairline.rect[3]*(.85+i*.18);out+=path(`M${e.nose.rect[2]*.14},${y} Q${e.brow_right.rect[2]*.5},${y-e.brow_right.rect[3]*.33} ${e.brow_right.center[0]-50},${y}`,'none',shade,.25);}
      out+='</g>';
    }
    const ht=pt('hairline','midline'),hl=pt('hairline','left_temple'),hr=pt('hairline','right_temple');
    out+=path(`M${l} C${l[0]-5},${top[1]+12} ${l[0]+6},${top[1]-5} ${top[0]+4},${top[1]-2} Q${r[0]+5},${top[1]-4} ${r} L${hr[0]},${hr[1]+(old?7:0)} Q${hr[0]-3},${ht[1]-7} ${ht} Q${hl[0]+7},${ht[1]-6} ${hl[0]},${hl[1]+(old?7:0)}Z`,paint('hair'));
    for(let i=0;i<14;i++) {
      const t=i/14;
      out+=path(`M${hl[0]+(hr[0]-hl[0])*t},${ht[1]-2+Math.abs(t-.5)*8} Q${top[0]-7+(t-.5)*22},${top[1]+3} ${l[0]+4+t*24},${top[1]+9-Math.sin(t*Math.PI)*8}`,'none',old?'#d4caba':'#a38a71',.22,'opacity=".45"');
    }
  } else {
    const top=pt('skull','top'),back=pt('skull','left'),root=pt('nose','root'),tip=pt('nose','tip'),base=pt('nose','base');
    // The projection uses the outer alar point as the silhouette's forward tip.
    const noseTip=[e.nose.rect[0]+e.nose.rect[2],tip[1]];
    const brow=pt('brow','end'),mouth=pt('mouth','right_corner'),chinFront=[e.chin.rect[0]+e.chin.rect[2]*.83,chin[1]-3];
    out+=path(`M${at('ear',.2,.7)} Q${at('ear',.3,1.9)} ${at('ear',-.1,2.1)} L12,128 L95,128 L${chinFront[0]-6},${chin[1]+14} Q${chinFront[0]-10},${chin[1]+7} ${chinFront}Z`,paint('skin'));
    out+=path(`M${at('ear',.8,1)} Q${at('ear',.7,1.7)} ${chinFront[0]-6},${chin[1]+14} L${chinFront}Z`,paint('shadow'));
    silhouette=`M${top} C${back[0]+5},${top[1]-2} ${back[0]-8},${back[1]*.65} ${back} Q${back[0]-1},${back[1]+20} ${at('ear',.4,1.2)} Q${at('jaw',.2,.9)} ${chinFront} Q${chinFront[0]+3},${chinFront[1]-4} ${at('mouth',.76,.98)} Q${mouth[0]+2},${mouth[1]+1.5} ${mouth} Q${mouth[0]+1},${mouth[1]-1.5} ${at('mouth',.78,.2)} L${base} Q${noseTip[0]-2},${noseTip[1]+3} ${noseTip} C${noseTip[0]+1},${noseTip[1]-2} ${root[0]-2},${root[1]+2} ${root} Q${brow[0]-2},${brow[1]+3} ${brow} Q${brow[0]+1},${top[1]+3} ${top}Z`;
    out+=path(silhouette,paint('skin'),ink,.4);
    out+=ellipse(...at('face',.35,.51),e.face.rect[2]*.29,e.face.rect[3]*.21,paint('glow'));
    out+=path(`M${at('eye',0,.4)} Q${at('face',.2,.57)} ${at('jaw',.25,.86)} Q${at('jaw',.75,.65)} ${at('mouth',.1,.7)} Q${at('face',.45,.7)} ${at('eye',0,.4)}Z`,paint('shadow'));
    const [x,y,w,h]=e.eye.rect;
    out+=path(`M${x},${y+h*.56} Q${x+w*.5},${y+h*.02} ${x+w*.88},${y+h*.33} L${x+w*.88},${y+h*.73} Q${x+w*.5},${y+h*.85} ${x},${y+h*.56}Z`,'#dfcbb0',ink,.4);
    out+=ellipse(x+w*.81,y+h*.52,w*.07,h*.21,'#55665a');
    out+=path(`M${x-w*.08},${y+h*.16} Q${x+w*.5},${y-h*.15} ${x+w},${y+h*.2}`,'none',shade,.35);
    out+=path(`M${pt('brow','start')} Q${pt('brow','arch')} ${pt('brow','end')}`,'none',hair,1.25);
    const alar=at('nose',.36,.86);
    out+=path(`M${at('nose',.4,.57)} Q${at('nose',.12,.78)} ${alar} Q${at('nose',.58,.9)} ${at('nose',.66,.82)}`,'none',shade,.5);
    out+=ellipse(alar[0]+1,alar[1],e.nose.rect[2]*.095*p.nose_width,.65,ink);
    out+=path(`M${at('mouth',.14,.49)} Q${at('mouth',.58,.58)} ${mouth}`,'none',ink,.45);
    out+=path(`M${at('mouth',.45,1)} Q${at('mouth',.62,1.15)} ${at('mouth',.87,.97)}`,'none',shade,.4);
    const [ex,ey,ew,eh]=e.ear.rect;
    out+=path(`M${ex+ew*.8},${ey+eh*.1} C${ex-ew*.15},${ey-eh*.2} ${ex+ew*.04},${ey+eh*.7} ${ex+ew*.45},${ey+eh*.98} Q${ex+ew*.8},${ey+eh*1.06} ${ex+ew*.8},${ey+eh*.65} Q${ex+ew*1.1},${ey+eh*.1} ${ex+ew*.8},${ey+eh*.1}Z`,paint('skin'),shade,.4);
    out+=path(`M${at('ear',.67,.2)} Q${at('ear',.12,.02)} ${at('ear',.27,.65)} M${at('ear',.27,.65)} Q${at('ear',.55,.35)} ${at('ear',.7,.44)} L${at('ear',.5,.76)}`,'none',shade,.6);
    const ht=pt('hairline','midline'),hr=pt('hairline','right_temple');
    out+=path(`M${at('ear',.12,.35)} Q${back[0]-1},${back[1]+12} ${back} C${back[0]-8},${back[1]*.6} ${top[0]-25},${top[1]-7} ${top} Q${hr[0]+7},${top[1]-3} ${hr[0]+3},${hr[1]-(old?10:4)} Q${ht[0]+3},${ht[1]-4} ${at('ear',.9,-.3)} L${at('ear',.8,.1)} Q${at('ear',.25,-.12)} ${at('ear',.12,.35)}Z`,paint('hair'));
    for(let i=0;i<12;i++)out+=path(`M${hr[0]-i*1.8},${ht[1]-4+i*.8} Q${top[0]-12},${top[1]+i*.7} ${back[0]+2+i*.7},${back[1]-5+i*.8}`,'none',old?'#d4caba':'#a38a71',.22,'opacity=".45"');
    if(old) {
      out+=path(`M${at('nose',.22,.9)} Q${at('mouth',.04,.2)} ${at('mouth',.03,1.25)} M${at('eye',.04,1)} Q${at('eye',.5,1.35)} ${at('eye',.84,1)} M${at('eye',-.1,.65)} l-2,1 M${at('face',.58,.15)} q4,-1 8,0 M${at('face',.58,.19)} q4,-1 8,0`,'none',shade,.35);
    }
  }
  // Tailored dark collar, separated from the skin planes.
  out+=path(view==='front'?`M8,128 Q13,118 ${jaw[0]},${chin[1]+10} L46,124 L50,119 L54,124 L${jaw[0]+jaw[2]},${chin[1]+10} Q87,118 92,128Z`:`M12,128 Q17,120 ${at('ear',-.1,2.1)} L59,126 L${chin[0]+5},${chin[1]+10} Q91,121 95,128Z`,'#354a49');
  if(options.construction) {
    out+='<g class="construction" font-family="monospace" font-size="1.7" fill="#006d77" stroke="#008b94" stroke-width=".15">';
    for(const [name,a]of Object.entries(e)) {
      const [x,y,w,h]=a.rect;
      out+=`<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#00b7bb" fill-opacity=".025"/><text x="${x}" y="${y-.6}" stroke="none">${name}</text>`;
      out+=line([a.center[0]-1,a.center[1]],[a.center[0]+1,a.center[1]],'#006d77',.2)+line([a.center[0],a.center[1]-1],[a.center[0],a.center[1]+1],'#006d77',.2);
      for(const anchor of Object.values(a.anchors))out+=ellipse(...anchor,.4,.4,'#f8ffff', 'stroke="#008b94"');
    }
    const eyes=view==='front'?[pt('eye_left','pupil'),pt('eye_right','pupil')]:[pt('eye','pupil')];
    out+=path(`M${eyes.join(' L')} L${pt('nose','tip')} L${e.mouth.center} L${pt('chin','bottom')}`,'none','#008b94',.35,'stroke-dasharray="1 1"');
    out+='</g>';
  }
  return out+'</svg>';
}
