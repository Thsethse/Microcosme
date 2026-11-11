'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const G=require('../graphics.js');
function recording() { const commands=[]; return {commands,set fillStyle(v){commands.push(typeof v==='object'?'gradient':v)},fillRect(...args){assert.ok(args.every(Number.isFinite));commands.push(args)}}; }
test('resources are deterministic, original drawing commands and bounded per tile',()=>{
  for(const kind of ['grass','tree','field','home']) for(let i=0;i<108;i++) {
    const a=recording(),b=recording(); G.tile(a,kind,i);G.tile(b,kind,i);assert.deepEqual(a.commands,b.commands);
    assert.ok(a.commands.length<260);
    const x=i%12*32,y=Math.floor(i/12)*32;
    for(const r of a.commands.filter(Array.isArray)) { assert.ok(r[0]>=x && r[1]>=y);assert.ok(r[0]+r[2]<=x+32 && r[1]+r[3]<=y+32); }
  }
  assert.notDeepEqual(recordTile(0),recordTile(1));
  function recordTile(i){const c=recording();G.tile(c,'grass',i);return c.commands;}
});
test('lighting interpolates continuously, wraps at midnight and is independent of wall time',()=>{
  assert.deepEqual(G.light(0),G.light(24));assert.deepEqual(G.light(-1),G.light(23));
  assert.equal(G.light(8).phase,'Matin');assert.equal(G.light(12).phase,'Jour');assert.equal(G.light(19).phase,'Crépuscule');assert.equal(G.light(23).phase,'Nuit');
  for(let hour=0;hour<24;hour+=.1) { const a=G.light(hour),b=G.light(hour+.001);assert.ok(Math.abs(a.alpha-b.alpha)<.001);assert.ok(a.night>=0&&a.night<=1); }
  assert.ok(G.light(23).alpha>G.light(12).alpha);assert.deepEqual(G.light(19),G.light(19));
});
test('reusable characters vary by identity, frame and direction without random input',()=>{
  const snapshots=[];for(let id=1;id<=30;id++)for(let d=0;d<4;d++)for(let f=0;f<3;f++){const c=recording();G.person(c,id,0,0,d,f);snapshots.push(JSON.stringify(c.commands));}
  const identities=Array.from({length:30},(_,i)=>{const c=recording();G.person(c,i+1,0,0);return JSON.stringify(c.commands)});
  assert.equal(new Set(identities).size,30);
  assert.ok(new Set(snapshots).size>100);assert.equal(G.direction(14,13),1);assert.equal(G.direction(13,14),2);assert.equal(G.direction(24,12),3);assert.equal(G.direction(12,24),0);
});
test('atmosphere honors frozen inputs and reduced motion without changing terrain',()=>{
  global.MicrocosmeGraphics=G;require('../atmosphere.js');
  const tiles=Object.freeze(Array.from({length:108},(_,i)=>i%9===0?'home':i%3===0?'tree':'grass'));
  function render(t,reduced){const c=recording();c.clearRect=()=>{};c.createRadialGradient=()=>({addColorStop(){}});global.MicrocosmeAtmosphere.draw(c,tiles,23,t,reduced);return c.commands;}
  assert.deepEqual(render(0,true),render(3000,true));assert.notDeepEqual(render(0,false),render(3000,false));assert.deepEqual(render(1000,false),render(1000,false));
});
