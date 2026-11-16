/* B2 polygons and roots in canonical head space; never changes the B1 head, face or R3 body. */
(function(root){
 'use strict';
 const S=typeof module!=='undefined'?require('./anatomical-skeleton.js'):root.AnatomicalSkeleton;
 function build(body){
  const a=body.groomingSettings,head=body.volumes.find(v=>v.id==='head'),face=body.face,W=head.dimensions.width,H=head.dimensions.height,D=head.dimensions.depth,parts=[],constraints=[];
  const center=head.center,frame={segment:'head',t:.5,offsetLocal:[0,0,0]},world=p=>S.add(center,p),middle=face.medianY-center[1];
  function skinZ(x,y){const r=head.roundingRadius||0;if(!r)return D/2*Math.sqrt(Math.max(0,1-(2*x/W)**2-(2*y/H)**2));const dx=Math.max(0,Math.abs(x)-(W/2-r)),dy=Math.max(0,Math.abs(y)-(H/2-r));return D/2-r+Math.sqrt(Math.max(0,r*r-dx*dx-dy*dy));}
  function top(x){const r=head.roundingRadius||0;if(!r)return H/2*Math.sqrt(Math.max(0,1-(2*x/W)**2));const dx=Math.max(0,Math.abs(x)-(W/2-r));return H/2-r+Math.sqrt(Math.max(0,r*r-dx*dx));}
  function half(y){const r=head.roundingRadius||0;if(!r)return W/2*Math.sqrt(Math.max(0,1-(2*y/H)**2));const dy=Math.max(0,Math.abs(y)-(H/2-r));return W/2-r+Math.sqrt(Math.max(0,r*r-dy*dy));}
  function part(id,kind,points,roots,color,views=['front','profile','back'],portrait=false){
   const p={id,kind,anchor:{...frame,offsetLocal:frame.offsetLocal.slice()},localVertices:points,vertices:points.map(world),roots:roots.map(world),color,views,portrait,marks:[]};if(kind==='facial-hair')p.solidVertices=points.flatMap(v=>[world(v),world([v[0],v[1],v[2]-W*.035])]);parts.push(p);return p;
  }
  function mark(p,id,points){p.marks.push({id,localPoints:points,points:points.map(world)});}
  if(a.hairLength!=='bald'){
   const texture=a.hairTexture,bulk=H*({smooth:.035,straight:.05,frizzy:.10,curly:.09}[texture]);
   const ripple=t=>texture==='frizzy'?H*.025*(Math.floor(t*24)%2?1:-1):texture==='curly'?H*.035*Math.cos(t*Math.PI*12):0;
   const edge=t=>texture==='straight'?Math.round(t*6)/6:t;
   function fringe(u){let y=H*.23;
    if(a.hairCut==='swept')y+=H*.055*u;else if(a.hairCut==='crop')y=H*.22;
    else if(a.hairCut==='parted')y+=H*.055*(1-Math.abs(u));else if(a.hairCut==='layered')y+=H*.03*Math.cos(u*Math.PI*3);
    else if(a.hairCut==='balanced')y-=H*.025*Math.cos(u*Math.PI);else y+=H*.075*u;
    if(texture==='smooth')y+=H*.018*Math.sin(u*Math.PI);if(texture==='frizzy')y+=H*.018*(Math.floor((u+1)*12)%2?1:-1);if(texture==='curly')y+=H*.025*Math.cos(u*Math.PI*5);
    return Math.max(H*.14,y);
   }
   const crown=[];for(let i=0;i<=24;i++){const u=-.94+1.88*i/24,x=u*(W/2+bulk*.35),xx=u*W/2,y=top(xx)+bulk+ripple(i/24);crown.push([x,y,Math.max(0,skinZ(xx,Math.min(H/2,y-bulk)))+bulk*.20]);}
   const front=[];for(let i=24;i>=0;i--){const u=-.94+1.88*i/24,x=u*W/2,y=Math.min(fringe(edge(u)),top(x)+bulk*.30-H*.01);front.push([x,y,skinZ(x,y)+bulk*.18]);}
   const cap=part('hair-front-cap','head-hair',crown.concat(front),[front[0],front.at(-1),[0,fringe(0),skinZ(0,fringe(0))]],a.hairColor,['front','profile'],true);
   // Near-side cranial shell: the upper scalp must also be covered in a true profile.
   const profileTop=z=>{const r=head.roundingRadius||0;if(!r)return H/2*Math.sqrt(Math.max(0,1-(2*z/D)**2));const dz=Math.max(0,Math.abs(z)-(D/2-r));return H/2-r+Math.sqrt(Math.max(0,r*r-dz*dz));};
   const profileCrown=[],profileFringe=[];for(let i=0;i<=24;i++){const u=-.94+1.88*i/24,z=u*(D/2+bulk*.35);profileCrown.push([W*.48,profileTop(u*D/2)+bulk+ripple(i/24),z]);profileFringe.unshift([W*.48,Math.min(fringe(u),profileTop(u*D/2)+bulk*.25-H*.01),z]);}
   const profileCap=part('hair-profile-cap','head-hair',profileCrown.concat(profileFringe),[[W*.40,H*.28,0]],a.hairColor,['profile'],true);
   for(let i=0;i<9;i++){const z=(-.8+i*.2)*D/2,y0=profileTop(z)+bulk*.7,y1=fringe(i/4-1)+H*.015,points=[];for(let k=0;k<=10;k++){const t=k/10;points.push([W*.48,y0+(y1-y0)*t,z+(texture==='curly'?D*.04*Math.sin(t*Math.PI*5):texture==='frizzy'?D*.02*(k%2?1:-1):texture==='smooth'?D*.04*Math.sin(t*Math.PI):0)]);}mark(profileCap,'profile-strand-'+i,points);}
   const hem=({short:-H*.22,medium:-H*.60,long:-H*1.15,veryLong:-H*1.90})[a.hairLength];
   const familyWidth=({masculine:.50,feminine:.57,mixed:.54})[a.hairFamily],endWidth=familyWidth*W*(a.hairCut==='crop'?.83:a.hairCut==='layered'?.92:1);
   const rearCrown=crown.map(p=>[p[0],p[1],-Math.abs(p[2])-bulk*.2]),rear=[];
   for(let i=0;i<=24;i++){const u=.94-1.88*i/24;rear.push([u*endWidth,hem+(texture==='frizzy'?H*.018*(i%2?1:-1):texture==='curly'?H*.025*Math.cos(i*Math.PI/3):H*.025*(1-u*u)),-D*.52-bulk*.15]);}
   const back=part('hair-rear','head-hair',rearCrown.concat(rear),[[0,H*.40,-skinZ(0,H*.40)],[-W*.42,H*.12,-D*.20],[W*.42,H*.12,-D*.20]],a.hairColor);
   for(const sign of [-1,1]){
    const inner=W*.43,outer=W*(familyWidth+.02),sidePoints=[[sign*inner,H*.18,-D*.05],[sign*outer,H*.18,-D*.05],[sign*outer,hem,-D*.12],[sign*(inner+(outer-inner)*.25),hem,-D*.12]];
    if(a.hairLength==='short')part('hair-side-'+(sign<0?'left':'right'),'head-hair',sidePoints,[[sign*inner,H*.18,-D*.05]],a.hairColor);
    else for(let k=0;k<8;k++){
     const row=t=>{const y=H*.18+(hem-H*.18)*t,bend=Math.max(0,Math.min(1,(-H/2-y)/(H*.30))),z=D*.03+bend*(Math.max(D*.60,body.skeleton.segments.thorax.depth*.90)-D*.03),wave=texture==='frizzy'?H*.012*(Math.round(t*8)%2?1:-1):texture==='curly'?H*.025*Math.sin(t*Math.PI*6):0;return {y,z,inner:inner+wave*.3,outer:outer+wave};};
     const one=row(k/8),two=row((k+1)/8),sheet=part('hair-lock-'+sign+'-'+k,'head-hair',[[sign*one.inner,one.y,one.z],[sign*one.outer,one.y,one.z],[sign*two.outer,two.y,two.z],[sign*two.inner,two.y,two.z]],[[sign*inner,H*.18,D*.03]],a.hairColor);
     const x1=sign*(one.inner+one.outer)/2,x2=sign*(two.inner+two.outer)/2;mark(sheet,sheet.id+'-strand',[[x1,one.y,one.z],[x2,two.y,two.z]]);
    }
    // Depth-bearing side sheet, visible in profile, behind the anterior B1 features.
    const sheet=part('hair-depth-'+(sign<0?'left':'right'),'head-hair',[[sign*W*.45,H*.18,D*.06],[sign*W*.45,H*.18,-D*.53],[sign*W*.45,hem,-D*.53],[sign*W*.45,hem,D*.02]],[[sign*W*.45,H*.18,0]],a.hairColor,['profile','back']);
    for(let i=0;i<6;i++){const z=-D*.48+i*D*.09;mark(sheet,sheet.id+'-strand-'+i,[[sign*W*.45,H*.12,z],[sign*W*.45,(H*.12+hem)/2,z+(texture==='smooth'?D*.04:0)],[sign*W*.45,hem+H*.02,z]]);}
   }
   for(const p of [cap,back])for(let i=0;i<10;i++){
    const u=-.85+i*1.7/9,x=u*W*.5,y0=top(u*W/2)+bulk*.35,y1=p===cap?fringe(u)+H*.02:hem+H*.04,z=p===cap?D*.42:-D*.54;
    if(texture==='curly'||texture==='frizzy'){
     const count=texture==='frizzy'?5:3;for(let j=0;j<count;j++){const cy=y0+(y1-y0)*(j+.5)/count,rx=W*(texture==='frizzy'?.018:.035),ry=H*(texture==='frizzy'?.023:.045),points=[];for(let k=0;k<=10;k++){const t=k*Math.PI*1.8/10;points.push([x+rx*Math.cos(t),cy+ry*Math.sin(t),z]);}mark(p,p.id+'-curl-'+i+'-'+j,points);}
    }else{const drift=texture==='smooth'?W*.045*Math.sin(i+1):0;mark(p,p.id+'-strand-'+i,[[x,y0,z],[x+drift,(y0+y1)/2,z],[x+drift*.3,y1,z]]);}
   }
  }
  if(body.biologicalProfile.category!=='F'){
   const m=face.features.mouth,cy=m.position[1]-center[1],gap=H*.008,mouthTop=cy+m.height/2,mouthBottom=cy-m.height/2,z=m.position[2]+m.depth/2;
   if(a.moustachePresent){
    const target=H*(.025+.045*a.moustacheSize),available=Math.max(H*.003,face.eyeBottom-center[1]-H*.018-mouthTop-gap),height=Math.min(target,available),width=m.width*(.70+.55*a.moustacheSize),y=mouthTop+gap;
    if(height<target)constraints.push({part:'moustache',requestedHeight:target,appliedHeight:height,reason:'N1 : espace libre entre bouche et yeux B1 conservé.'});
    part('moustache','facial-hair',[[-width/2,y+height*.35,z],[-width*.28,y+height,z],[0,y+height*.70,z],[width*.28,y+height,z],[width/2,y+height*.35,z],[width*.23,y,z],[0,y+height*.18,z],[-width*.23,y,z]],[[-width*.20,y,z],[width*.20,y,z]],a.moustacheColor,['front','profile'],true);
   }
   if(a.beardPresent){const size=a.beardSize,height=H*(.06+.44*size),width=m.width*(.9+1.1*size),y=mouthBottom-gap;
    part('beard','facial-hair',[[-m.width*.43,y,z],[m.width*.43,y,z],[width*.5,y-height*.38,z*.72],[width*.30,y-height*.86,z*.40],[0,y-height,z*.25],[-width*.30,y-height*.86,z*.40],[-width*.5,y-height*.38,z*.72]],[[-m.width*.25,y,z],[m.width*.25,y,z]],a.beardColor,['front','profile'],true);
   }
   if(a.sideburnsPresent){const height=H*(.10+.30*a.sideburnsSize),width=W*(.025+.07*a.sideburnsSize);
    for(const sign of [-1,1]){const outer=[],inner=[];for(let i=0;i<=10;i++){const y=middle-height*i/10,x=half(y);outer.push([sign*(x+W*.012),y,Math.max(0,skinZ(sign*x,y))]);inner.unshift([sign*Math.max(0,x-width),y,skinZ(sign*Math.max(0,x-width),y)]);}part('sideburn-'+(sign<0?'left':'right'),'facial-hair',outer.concat(inner),[inner.at(-1)],a.sideburnsColor,['front','profile'],true);}
   }
  }
  return {frame,parts,constraints};
 }
 const api={build};if(typeof module!=='undefined')module.exports=api;root.GroomingModel=api;
})(globalThis);
