/* Canvas resources + DOM hit targets. All state below belongs to presentation. */
(function(root) {
  'use strict';
  const G=MicrocosmeGraphics, A=MicrocosmeAtmosphere;
  const atlas=new Map();
  function sprite(id) {
    const key=(id-1)%120+1;
    if(!atlas.has(key)) { if(atlas.size>=30) atlas.delete(atlas.keys().next().value); const c=document.createElement('canvas'); c.width=48;c.height=96; const ctx=c.getContext('2d'); for(let d=0;d<4;d++)for(let f=0;f<3;f++) G.person(ctx,key,f*16,d*24,d,f); atlas.set(key,c.toDataURL()); }
    return atlas.get(key);
  }
  const terrain=document.getElementById('terrain'), effects=document.getElementById('atmosphere');
  const context=terrain.getContext('2d'), fx=effects.getContext('2d');
  let signature='', state=null, actors=new Map(), request=0, last=0, visualTime=0, demo=null, disposed=false;
  let reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
  const preference=matchMedia('(prefers-reduced-motion: reduce)');
  function onPreference(e) { reduced=e.matches; sync(state); }
  preference.addEventListener('change',onPreference);
  function sync(next) {
    if(!next) return; if(state!==next) actors.clear(); state=next;
    const key=next.tiles.join(',');
    if(key!==signature) { signature=key; context.clearRect(0,0,G.WIDTH,G.HEIGHT); next.tiles.forEach((kind,i)=>G.tile(context,kind,i)); }
    const ids=new Set(next.people.map(p=>p.id)); for(const id of actors.keys()) if(!ids.has(id))actors.delete(id);
    next.people.forEach(p=>{
      const el=document.querySelector('#actors [data-id="'+p.id+'"]'); if(!el)return;
      let a=actors.get(p.id); if(!a) { a={pos:p.pos,direction:0,until:0}; actors.set(p.id,a); }
      if(a.pos!==p.pos) { a.direction=G.direction(a.pos,p.pos); a.pos=p.pos; a.until=visualTime+520/(typeof rate==='number'?rate:1); }
      const b=el.querySelector('b'); b.style.filter='brightness('+(1-G.light(next.hour).night*.30)+')'; b.style.backgroundImage=`url("${sprite(p.id)}")`; b.style.backgroundPositionY=(a.direction/3*100)+'%';
    });
    document.getElementById('lightPhase').textContent=G.light(next.hour).phase+' · lumière du moteur';
    A.draw(fx,next.tiles,next.hour,visualTime,reduced);
    schedule();
  }
  function active() { return !document.hidden && (Boolean(demo) || document.querySelector('[data-scene="village"]').hidden===false); }
  function schedule() { if(!disposed && !request && active()) request=requestAnimationFrame(frame); }
  function frame(now) {
    request=0; const dt=last?Math.min(now-last,60):0;last=now;
    if(!active()) {last=0;return;}
    visualTime+=dt;
    if(state) {
      if(!document.querySelector('[data-scene="village"]').hidden) {
        A.draw(fx,state.tiles,state.hour,visualTime,reduced);
        actors.forEach((a,id)=>{const b=document.querySelector('#actors [data-id="'+id+'"] b');if(b) { const walking=!reduced&&visualTime<a.until; const f=walking?1+Math.floor(visualTime/130)%2:0; b.style.backgroundPositionX=f/2*100+'%'; b.style.translate=!reduced&&!walking&&Math.floor(visualTime/900+id)%4===0?'0 -1px':'0 0'; }});
      }
    }
    if(demo) drawDemo();
    if(!reduced) schedule();
  }
  function drawDemo() {
    const {c,tiles,hour}=demo; c.clearRect(0,0,G.WIDTH,G.HEIGHT); c.drawImage(demo.ground,0,0);
    for(let id=1;id<=5;id++) { const progress=reduced||!demo.moving?0:visualTime*.018; const x=70+((id*43+progress)%240),y=155+(id%3)*26; G.person(c,id,x,y,2,reduced||!demo.moving?0:1+Math.floor(visualTime/150)%2); }
    A.draw(demo.fx,tiles,hour,visualTime,reduced); c.drawImage(demo.overlay,0,0);
  }
  function openDemo() {
    if(demo)return;
    const body=document.createElement('div');
    body.innerHTML='<p>Un village indépendant. Ta partie et son heure restent intactes.</p><div class="demo-controls" role="group" aria-label="Éclairage de démonstration"></div><label>Heure visuelle : <output id="demoHour">12 h</output><input aria-label="Heure visuelle" type="range" min="0" max="23.9" step="0.1" value="12"></label><label><input type="checkbox" checked> Personnages en déplacement</label><canvas class="demo-canvas" width="384" height="288" role="img" aria-label="Village pixel art de démonstration"></canvas><p>Les effets et la marche respectent « Réduire les animations ».</p>';
    const canvas=body.querySelector('canvas'),ground=document.createElement('canvas'),overlay=document.createElement('canvas');
    ground.width=overlay.width=G.WIDTH; ground.height=overlay.height=G.HEIGHT;
    const tiles=Array.from({length:108},(_,i)=>i%12<2||i%12>9||i<12||i>95?'tree':'grass');
    [28,31,64,67].forEach(i=>tiles[i]='home'); [42,43,54,55,78,79].forEach(i=>tiles[i]='field');
    tiles.forEach((kind,i)=>G.tile(ground.getContext('2d'),kind,i));
    demo={c:canvas.getContext('2d'),ground,overlay,fx:overlay.getContext('2d'),tiles,hour:12,moving:true};
    const range=body.querySelector('input[type=range]');
    function hour(h) { demo.hour=Number(h); range.value=h; body.querySelector('output').textContent=Number(h).toFixed(1)+' h · '+G.light(Number(h)).phase;drawDemo(); }
    [['Matin',8],['Jour',12],['Crépuscule',19],['Nuit',23]].forEach(([name,h])=>{const b=document.createElement('button');b.textContent=name;b.onclick=()=>hour(h);body.querySelector('.demo-controls').append(b);});
    range.oninput=()=>hour(range.value);body.querySelector('[type=checkbox]').onchange=e=>{demo.moving=e.target.checked;drawDemo();schedule();};
    const dialog=windowPanel('Atelier de lumière',body); dialog.classList.add('demo-window'); dialog.addEventListener('close',()=>{demo=null;}); drawDemo();schedule();
  }
  document.addEventListener('visibilitychange',()=>{last=0;schedule();});
  // Observe scene visibility only, never the world state or save data.
  const observer=new MutationObserver(()=>{last=0;schedule();});observer.observe(document.querySelector('[data-scene="village"]'),{attributes:true,attributeFilter:['hidden']});
  root.MicrocosmeRenderer={sync,openDemo,metrics:()=>({atlases:atlas.size,actors:actors.size,scheduled:Boolean(request),reduced}),dispose(){disposed=true;cancelAnimationFrame(request);request=0;observer.disconnect();preference.removeEventListener('change',onPreference);actors.clear();atlas.clear();}};
})(globalThis);
