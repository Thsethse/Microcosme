/* Shared, inspectable geometry. Units are source pixels; reference head height = 20. */
(function(root){
 'use strict';
 const M=typeof module!=='undefined'?require('./model.js'):root.T2Model;
 const mix=(hex,other,t)=>'#'+[1,3,5].map(i=>Math.round(parseInt(hex.slice(i,i+2),16)*(1-t)+parseInt(other.slice(i,i+2),16)*t).toString(16).padStart(2,'0')).join('');
 function derive(input){
  const description=M.validate(input),p=description.params;
  const headW=(['oval','rectangle'].includes(p.headShape)?16:20)*p.headX,headH=20*p.headY;
  const bodyW=({rectangle:32,square:25,oval:30,triangle:34,composite:30})[p.bodyShape]*p.bodyX;
  const bodyH=25*p.bodyY,pelvisH=10,legH=25*p.legLength,armH=35*p.armLength;
  const height=headH+bodyH+pelvisH+legH,top=132-height,headBottom=top+headH;
  const torsoY=headBottom,pelvisY=torsoY+bodyH,legY=pelvisY+pelvisH;
  const pelvisW=22*p.bodyX,legW=8*p.legWidth,armW=6*p.armWidth;
  const g={headW,headH,bodyW,bodyH,pelvisW,pelvisH,legW,legH,armW,armH,height,top,headBottom,torsoY,pelvisY,legY,
   shoulderY:torsoY+3,hipX:Math.max(pelvisW*.25,legW*.55),chestY:torsoY+bodyH*p.chestY};
  return {description,geometry:g,palette:{skin:p.skinColor,eye:p.eyeColor,hair:p.hairColor,fur:p.furColor,
   shade:mix(p.skinColor,'#512f34',.27),light:mix(p.skinColor,'#fff0cc',.25),outline:'#302336',background:'#281f35'},
   marks:Array.from({length:48},(_,i)=>[M.hash(description.seed,300+2*i),M.hash(description.seed,301+2*i)])};
 }
 function project(body,view='front'){
  if(!['front','back','profile','portrait'].includes(view))throw Error('Vue inconnue');
  const p=body.description.params,g=body.geometry,k=body.palette,cx=48;
  const back=view==='back',profile=view==='profile',portrait=view==='portrait';
  const commands=[];
  function shape(kind,x,y,w,h,color,tag,clip=false){commands.push({kind,x,y,w,h,color,tag,clip});}
  function outlined(kind,x,y,w,h,color,tag){shape(kind,x-1,y-1,w+2,h+2,k.outline,tag+'-outline');shape(kind,x,y,w,h,color,tag);}
  function rect(x,y,w,h,color,tag,clip=false){shape('rectangle',x,y,w,h,color,tag,clip);}
  const headW=g.headW*(profile?.64:1),left=cx-headW/2,headTop=g.top;
  const hair=p.hairStyle,hasHair=hair!=='shaved',long=['long','medium','bob'].includes(hair);
  const hairDrop=hair==='long'?17:hair==='medium'?9:hair==='bob'?5:0;
  // Rear hair first: it cannot obscure the bare torso in the front projection.
  if(hasHair&&(long||hair==='curly'))outlined('rectangle',left-1,headTop+4,headW+2,g.headH-3+hairDrop,k.hair,'hair-rear');
  if(hair==='tied')outlined('circle',cx-4,headTop-7,8,8,k.hair,'hair-bun');
  const torsoW=g.bodyW*(profile?.52:1),pelvisW=g.pelvisW*(profile?.65:1);
  const sides=profile?[1]:[-1,1];
  // Rectangular legs and feet remain connected to the shared hip anchors.
  for(const side of sides){const x=cx+side*(profile?0:g.hipX);
   outlined('rectangle',x-g.legW/2,g.legY-2,g.legW,g.legH+2,k.skin,'leg-'+side);
   outlined('rectangle',x-g.legW/2-(profile?0:1),130,g.legW+3,2,k.skin,'foot-'+side);
  }
  for(const side of sides){const x=cx+side*(profile?torsoW*.38:torsoW/2+g.armW*.25);
   outlined('rectangle',x-g.armW/2,g.shoulderY,g.armW,g.armH,k.skin,'arm-'+side);
   rect(x-g.armW/2,g.shoulderY+g.armH-3,g.armW,3,k.light,'hand-'+side);
  }
  // The narrow neck and pelvis connect simple forms without adding realistic anatomy.
  rect(cx-3,g.headBottom-2,6,7,k.skin,'neck');
  outlined(p.bodyShape==='triangle'?'triangleDown':p.bodyShape,cx-torsoW/2,g.torsoY+3,torsoW,g.bodyH-3,k.skin,'torso');
  rect(cx-torsoW/2,g.shoulderY+1,torsoW,3,k.skin,'shoulder-bridge');
  outlined('rectangle',cx-pelvisW/2,g.pelvisY-2,pelvisW,g.pelvisH+2,k.skin,'pelvis');
  // Square/rectangular muscle accents, clipped to the figure's existing pixels.
  function muscle(key,x,y,w,h){const size=p[key+'Size'],ink=p[key+'Ink'];if(size===0||ink===0)return;
   const factor=.3+.7*size;rect(x-w*factor/2,y,w*factor,h*factor,mix(k.skin,k.shade,ink),'muscle-'+key,true);
   if(ink>.3)rect(x-w*factor/2,y,w*factor,1,k.light,'muscle-highlight-'+key,true);
  }
  if(!back)for(const side of sides)muscle('pecs',cx+side*torsoW*.24,g.torsoY+g.bodyH*.20,torsoW*.42,g.bodyH*.28);
  for(const side of sides){
   muscle('shoulders',cx+side*torsoW*.44,g.shoulderY,7,6);
   muscle('arms',cx+side*(profile?torsoW*.38:torsoW/2+g.armW*.25),g.shoulderY+g.armH*.22,g.armW,g.armH*.42);
   muscle('thighs',cx+side*(profile?0:g.hipX),g.legY+2,g.legW,g.legH*.42);
   muscle('calves',cx+side*(profile?0:g.hipX),g.legY+g.legH*.60,g.legW,g.legH*.3);
  }
  if(p.chestPresent&&p.chestVolume>0&&!back){
   const rx=1.5+4*p.chestVolume,ry=rx*(p.chestShape==='oval'?.7:1)*p.chestStretch;
   const spacing=Math.min(torsoW*.32,torsoW*.22*p.chestSpacing);
   for(const side of sides){const x=profile?cx+torsoW*.45:cx+side*spacing;
    outlined('oval',x-rx,g.chestY-ry,rx*2,ry*2,k.skin,'chest-'+side);
    // No nipples, skin texture or anatomical details.
   }
  }
  if(!back&&!profile){
   if(p.anatomyMark==='rectangle')outlined('rectangle',cx-1,g.pelvisY+3,2,4,k.skin,'anatomy-mark');
   if(p.anatomyMark==='lineTriangle'){
    rect(cx,g.pelvisY+2,1,3,k.shade,'anatomy-mark-line');shape('triangleDown',cx-2,g.pelvisY+4,4,3,k.shade,'anatomy-mark-triangle');
   }
  }
  function texture(x,y,w,h,density,tag){if(density<=0)return;body.marks.forEach(([u,v],i)=>{
   if((tag!=='fur-pubic'||Math.abs(u-.5)<(1-v)*.5)&&body.marks[(i+11)%body.marks.length][0]<density)rect(x+u*w,y+v*h,1,1,k.fur,tag,true);
  });}
  if(!back&&!profile)texture(cx-4,g.pelvisY+1,8,4,p.pubicHair,'fur-pubic');
  // Head: five geometric choices with independent X/Y stretches. No nose layer exists.
  outlined(p.headShape==='triangle'?'triangleDown':p.headShape,left,headTop,headW,g.headH,k.skin,'head');
  if(!back){
   const eyeW=3.2*p.eyeSize,eyeH=(p.eyeShape==='oval'?2.2:3.2)*p.eyeSize,eyeY=headTop+g.headH*p.eyeY;
   const spacing=headW*.23*p.eyeSpacing;
   for(const side of sides){const x=profile?cx+headW*.22:cx+side*spacing;
    shape(p.eyeShape,x-eyeW/2,eyeY,eyeW,eyeH,k.outline,'eye-outline-'+side,true);
    shape(p.eyeShape,x-eyeW/2+.6,eyeY+.6,Math.max(1,eyeW-1),Math.max(1,eyeH-1),k.eye,'iris-'+side,true);
    rect(x-eyeW/2,eyeY,1,1,k.light,'eye-glint-'+side,true);
    if(p.lashes){rect(x-eyeW/2-1,eyeY-1,eyeW+2,1,k.outline,'lashes-'+side,true);rect(x+side*eyeW/2,eyeY-2,1,1,k.outline,'lash-tip-'+side,true);}
    const bw=4*p.browSize,by=headTop+g.headH*p.browY;
    if(p.browShape==='triangle')shape('triangle',x-bw/2,by,bw,2+p.browSize,k.hair,'brow-'+side,true);
    else for(let i=0;i<Math.ceil(bw);i++)rect(x-bw/2+i,by+side*p.browTilt*(i-bw/2),1,Math.max(1,p.browSize),k.hair,'brow-'+side,true);
   }
   rect(profile?cx+headW*.10:cx-2,headTop+g.headH*.76,profile?2:4,1,k.shade,'mouth',true);
   // Independent facial hair components; no body-hair distribution model.
   if(p.beard>0)shape('triangleDown',cx-headW*.37,headTop+g.headH*(.92-.20*p.beard),headW*.74,g.headH*(.08+.20*p.beard),k.fur,'fur-beard',true);
   if(p.moustache>0)for(const side of sides)rect(cx+side*headW*.12-headW*.11,headTop+g.headH*.69,headW*.22,1+2*p.moustache,k.fur,'fur-moustache',true);
   if(p.sideburns>0)for(const side of sides)rect(cx+side*headW*.43-1,headTop+g.headH*.40,1+1.5*p.sideburns,g.headH*.32*p.sideburns,k.fur,'fur-sideburns',true);
   // Keep the simple mouth legible above the beard/moustache layer.
   rect(profile?cx+headW*.10:cx-1,headTop+g.headH*.76,profile?1:3,1,k.shade,'mouth',true);
  }
  if(hasHair){
   const capH=hair==='short'?4:5;
   outlined('rectangle',left-1,headTop-2,headW+2,capH,k.hair,'hair-cap');
   if(hair==='curly'){
    for(let i=0;i<8;i++){const x=left-2+i*(headW+4)/7;outlined('circle',x-2,headTop-3+(i%2)*2,5,5,k.hair,'hair-curl-'+i);}
    for(const side of [-1,1])for(let i=0;i<3;i++)outlined('circle',cx+side*headW*.51-2,headTop+3+i*4,5,5,k.hair,'hair-curl-side');
   }else{
    // A small set of layers: scalp cap, angular fringe, temples, rear curtain/bun.
    for(let i=0;i<5;i++)shape('triangleDown',left+headW*i/5,headTop+1,headW/5+1,3+(i%2),k.hair,'hair-fringe');
    const drop=hair==='bob'?g.headH*.65:hair==='long'?g.headH*.85+hairDrop:hair==='medium'?g.headH*.65+hairDrop:hair==='tied'?g.headH*.3:3;
    for(const side of [-1,1])rect(cx+side*(headW/2)-1,headTop+2,3,drop,k.hair,'hair-temple');
   }
   if(back&&(long||hair==='curly'))outlined('rectangle',left,headTop+2,headW,g.headH+hairDrop-2,k.hair,'hair-back');
   // Deterministic highlight flecks, shared across views and scales.
   for(let i=0;i<5;i++){const [u]=body.marks[i];rect(left+u*headW,headTop-1,1,1,mix(k.hair,'#f5d3ac',.2),'hair-highlight');}
  }
  if(portrait){const scale=3.2,offsetY=22-g.top*scale;for(const cmd of commands){cmd.x=64+(cmd.x-cx)*scale;cmd.y=offsetY+cmd.y*scale;cmd.w*=scale;cmd.h*=scale;}}
  return {view,width:portrait?128:96,height:144,commands,body};
 }
 const api={derive,project,mix};if(typeof module!=='undefined')module.exports=api;root.T2Geometry=api;
})(globalThis);
