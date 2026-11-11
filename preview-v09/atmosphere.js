/* Visual only: bounded effects, deterministic locations, no simulation RNG. */
(function(root) {
  'use strict';
  function draw(c, tiles, hour, time, reduced) {
    const G=root.MicrocosmeGraphics, light=G.light(hour), t=reduced?0:time;
    c.clearRect(0,0,G.WIDTH,G.HEIGHT);
    c.fillStyle=`rgba(${light.color.join(',')},${light.alpha})`; c.fillRect(0,0,G.WIDTH,G.HEIGHT);
    tiles.forEach((kind,i)=>{
      const x=i%12*32,y=Math.floor(i/12)*32;
      if((kind==='tree'||kind==='home') && hour>=16 && hour<=21) { const dusk=Math.max(0,1-Math.abs(hour-19)/3); c.fillStyle=`rgba(30,30,49,${dusk*.16})`; c.fillRect(x+16,y+27,Math.round(14*dusk),3); c.fillRect(x+22,y+29,Math.round(14*dusk),2); }
      if(kind==='tree' && !reduced) { const drift=Math.floor(Math.sin(t*.001+i)*1.5); c.fillStyle='#91a264'; c.fillRect(x+11+drift,y+6,3,1); c.fillRect(x+21-drift,y+12,2,1); }
      if(kind!=='home') return;
      // Only house lights use a soft gradient; terrain and sprites retain hard pixels.
      if(light.night>0) { const glow=c.createRadialGradient(x+16,y+23,2,x+16,y+23,28); glow.addColorStop(0,`rgba(255,194,98,${light.night*.30})`); glow.addColorStop(1,'rgba(255,194,98,0)'); c.fillStyle=glow; c.fillRect(x-13,y-6,58,58); c.fillStyle=`rgba(255,211,129,${light.night})`; c.fillRect(x+8,y+19,2,3); c.fillRect(x+22,y+19,2,3); }
      if(!reduced) for(let j=0;j<3;j++) { const age=(t*.00018+j/3+i*.07)%1; c.fillStyle=`rgba(206,205,183,${(1-age)*.34})`; c.fillRect(Math.round(x+24+Math.sin(age*5+i)*3),Math.round(y+1-age*16),2+Math.floor(age*3),2); }
    });
    if(reduced) return;
    for(let j=0;j<18;j++) { const seed=G.hash(j,98), x=seed%G.WIDTH+Math.sin(t*.0005+j)*4,y=(seed>>>9)%G.HEIGHT+Math.cos(t*.0004+j)*3; const glow=(.5+.5*Math.sin(t*.002+j)); c.fillStyle=light.night>.3?`rgba(226,237,143,${glow*light.night})`:`rgba(249,226,161,${glow*.32})`; c.fillRect(Math.round(x),Math.round(y),1,1); }
  }
  root.MicrocosmeAtmosphere={draw};
})(globalThis);
