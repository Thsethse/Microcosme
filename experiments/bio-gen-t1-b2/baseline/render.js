(function(root){'use strict';
function render(canvas,b,mode='front'){
const portrait=mode==='portrait',w=portrait?96:48,h=portrait?96:64;canvas.width=w;canvas.height=h;const c=canvas.getContext('2d');c.imageSmoothingEnabled=false;const {geometry:g,palette:k,description:{params:p},marks}=b;
const rect=(x,y,w,h,color)=>{c.fillStyle=color;c.fillRect(Math.round(x),Math.round(y),Math.max(1,Math.round(w)),Math.max(1,Math.round(h)));};
const poly=(pts,color)=>{c.fillStyle=color;c.beginPath();pts.forEach(([x,y],i)=>i?c.lineTo(Math.round(x),Math.round(y)):c.moveTo(Math.round(x),Math.round(y)));c.closePath();c.fill();};
rect(0,0,w,h,'#e9e4d4');rect(0,h-6,w,6,'#d2cebb');
function face(cx,top,s,back=false,profile=false){const hw=g.headW*s,hh=g.headH*s,base=top+hh;
rect(cx-hw*.18,base-1,hw*.36,3*s,k.shade);
poly([[cx-hw*.48,top+hh*.18],[cx-hw*.32,top],[cx+hw*.32,top],[cx+hw*.48,top+hh*.18],[cx+hw*.45,top+hh*.67],[cx+g.jaw*s*.4,base-2*s],[cx,base],[cx-g.jaw*s*.4,base-2*s],[cx-hw*.45,top+hh*.67]],k.skin);
rect(cx-hw*.54,top+hh*.43,s,hh*.23,k.shade);if(!profile)rect(cx+hw*.45,top+hh*.43,s,hh*.23,k.skin);
if(!back){const ey=top+hh*.45,spacing=hw*.20*p.eyeSpacing,ew=hw*.19,eh=(.65+p.eyeShape)*s;
for(const side of profile?[1]:[-1,1]){const x=cx+side*spacing,dy=side*p.asymmetry*.25*s;rect(x-ew/2,ey+dy,ew,eh,k.light);rect(x,ey+dy,s,eh,k.iris);rect(x-ew/2,ey-s+dy,ew,s*.4,k.hair);}
if(profile)rect(cx+hw*.40,ey+s,s*(1+2*p.nose),2*s,k.skin);else{rect(cx-s*.4,ey+s,s*(.6+p.nose),2*s,k.shade);rect(cx-s*.5,ey+s,s*.6,s,k.skin);}
const mw=(2+2*p.mouth)*s,mx=profile?cx+hw*.22:cx;rect(mx-mw/2,top+hh*.79,mw,(.4+.45*p.mouth)*s,k.shade);
if(portrait)marks.slice(0,6).forEach(([x,y])=>rect(cx+(x-.5)*hw*.65,top+hh*(.58+y*.13),1,1,k.shade));}
if(p.density>.05){const hairH=hh*(.08+.28*p.density),line=top+hh*(.05+.16*p.hairline);rect(cx-hw*.46,top,hw*.92,hairH,k.hair);rect(cx-hw*.48,line,s,hh*.3*p.density,k.hair);if(back)rect(cx-hw*.44,top,hw*.88,hh*.75*p.density,k.hair);else if(p.texture>.4)for(let i=0;i<5;i++)rect(cx-hw*.4+i*hw*.17,line,hw*.12,s*(.5+p.density),k.hair);if(portrait)marks.forEach(([x,y])=>rect(cx+(x-.5)*hw*.8,top+y*hairH,1,1+Math.round(3*p.texture),p.hairColor>.5?'#514039':'#b49668'));}}
if(portrait){poly([[0,96],[8,80],[48-g.shoulders*2,73],[48,66],[48+g.shoulders*2,73],[88,80],[96,96]],k.cloth);face(48,12,5);}
else{const profile=mode==='profile',back=mode==='back',cx=24,bottom=59,top=bottom-g.height,neck=top+g.headH,hip=neck+g.trunk,shoulder=profile?g.shoulders*.50:g.shoulders,hips=profile?g.hips*.65:g.hips,waist=profile?g.waist*.7:g.waist;
for(const side of profile?[1]:[-1,1]){const x=cx+side*hips*.25-g.legWidth/2;rect(x,hip,g.legWidth,g.legs-2,k.shade);rect(x+(back?1:0),hip,g.legWidth-1,g.legs-2,k.skin);rect(x-1,bottom-2,g.foot,3,k.dark);}
poly([[cx-shoulder/2,neck+1],[cx+shoulder/2,neck+1],[cx+waist/2,hip-3],[cx+hips/2,hip+2],[cx-hips/2,hip+2],[cx-waist/2,hip-3]],k.cloth);rect(cx-hips/2,hip,hips,2,k.dark);
for(const side of profile?[1]:[-1,1]){const x=cx+side*(shoulder/2+g.armWidth*.2)-g.armWidth/2,y=neck+2+side*p.asymmetry*.5;rect(x,y,g.armWidth,g.armLength,k.skin);rect(x,y,g.armWidth,4,k.cloth);rect(x,y+g.armLength-1,g.hand,g.hand,k.shade);}face(cx,top,profile?.85:1,back,profile);}
return canvas;}
const api={render};if(typeof module!=='undefined')module.exports=api;root.BioRenderV1=api;
})(globalThis);
