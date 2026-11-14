/* Original procedural pixel resources. No engine data is written here. */
(function (root) {
  'use strict';
  const TILE = 32, WIDTH = 384, HEIGHT = 288;
  const palette = { grass:['#59794b','#60824e','#668650','#6b8954'], moss:'#82965c', shade:'#344d3e', earth:'#79583e', wood:'#684735', stone:'#9a9e87', amber:'#ffcb78' };
  function hash(x, salt=0) { let n = Math.imul(x + 1, 374761393) ^ Math.imul(salt + 1, 668265263); n = Math.imul(n ^ n >>> 13, 1274126177); return (n ^ n >>> 16) >>> 0; }
  function rect(c,x,y,w,h,color) { c.fillStyle=color; c.fillRect(Math.round(x),Math.round(y),w,h); }
  function tile(c, kind, index) {
    const x=index%12*TILE,y=Math.floor(index/12)*TILE, n=hash(index);
    rect(c,x,y,32,32,palette.grass[n%4]);
    for(let j=0;j<23;j++) { const v=hash(index,j); rect(c,x+v%30,y+(v>>>8)%31,1+(v>>>16)%3,1,j%3 ? '#789155':'#4f7145'); }
    // Deterministic tufts, wildflowers, pebbles and fallen leaves.
    for(let j=0;j<3;j++) { const v=hash(index,j+30), a=x+2+v%27,b=y+3+(v>>>9)%25; rect(c,a,b,1,3,'#3f6546'); rect(c,a-1,b,3,1,'#95a968'); if(v%4===0) rect(c,a,b-1,2,1,v%2?'#e4c587':'#c4b4c6'); }
    if(n%7===0) { rect(c,x+23,y+25,5,3,'#566d59'); rect(c,x+23,y+24,4,2,palette.stone); }
    if(n%9===0) { rect(c,x+3,y+23,7,4,'#3f6846'); rect(c,x+4,y+22,4,2,'#799957'); }
    if(kind==='field') {
      rect(c,x+2,y+2,28,28,'#513f32'); rect(c,x+3,y+3,26,26,'#946c46');
      for(let row=0;row<4;row++) { rect(c,x+4,y+5+row*6,24,2,'#684f36'); for(let col=0;col<5;col++) { const a=x+5+col*5,b=y+4+row*6; rect(c,a,b,1,4,'#b3a154'); rect(c,a-1,b,3,2,'#d6b967'); rect(c,a+1,b+2,2,1,'#789153'); } }
    }
    if(kind==='tree') {
      rect(c,x+8,y+25,21,4,'#3e5b3d'); rect(c,x+15,y+16,5,13,'#573f31'); rect(c,x+16,y+18,2,9,'#9c7650'); rect(c,x+12,y+28,11,1,'#5d5137');
      rect(c,x+5,y+8,23,12,'#284f3d'); rect(c,x+8,y+3,17,19,'#335e42'); rect(c,x+3,y+10,27,7,'#335e42'); rect(c,x+10,y+1,12,3,'#416d48'); rect(c,x+5,y+8,17,8,'#47784c'); rect(c,x+10,y+4,12,8,'#56824e');
      for(let j=0;j<12;j++) { const v=hash(index,j+70); rect(c,x+7+v%17,y+5+(v>>>8)%12,3,1,j%3?'#638c52':'#739654'); }
      rect(c,x+21,y+19,5,3,'#274e3b');
    }
    if(kind==='home') {
      rect(c,x+5,y+27,26,4,'#3f593d'); rect(c,x+5,y+13,23,16,'#947858'); rect(c,x+6,y+14,20,13,'#d0b88a'); rect(c,x+6,y+26,21,3,'#777761');
      rect(c,x+7,y+13,2,14,'#73563d'); rect(c,x+24,y+13,2,14,'#73563d'); rect(c,x+6,y+19,20,1,'#aa936b');
      rect(c,x+13,y+21,6,8,'#523e32'); rect(c,x+14,y+22,3,6,'#76553a'); rect(c,x+17,y+25,1,1,'#dfba74');
      rect(c,x+22,y+3,4,8,'#69645a'); rect(c,x+23,y+3,2,6,'#a0a08b');
      for(let row=0;row<6;row++) { const left=x+3+(5-row)*2; rect(c,left,y+3+row*2,6+row*4,3,row%2?'#975845':'#a9664a'); rect(c,left,y+5+row*2,6+row*4,1,'#714735'); }
      rect(c,x+2,y+15,28,2,'#553e33'); rect(c,x+7,y+18,4,5,'#594b39'); rect(c,x+21,y+18,4,5,'#594b39'); rect(c,x+8,y+19,2,3,'#bbc296'); rect(c,x+22,y+19,2,3,'#bbc296');
      rect(c,x+12,y+29,9,2,'#b0a17b'); rect(c,x+5,y+24,5,2,'#706a40'); rect(c,x+6,y+23,3,1,'#a6a762');
    }
  }
  const coats=['#b65e50','#527c9b','#9773a4','#c49955','#4c8a78','#ad6c88','#8d995c','#737da3'];
  function person(c,id,x,y,direction=0,frame=0) {
    const coat=coats[(id-1)%coats.length], skin=['#e4bd91','#c79570','#93664e'][(id-1)%3], hair=['#4d3b31','#a67949','#54433c','#c1b28a'][(id-1)%4];
    const bob=frame===1?-1:0, stride=frame===1?-1:frame===2?1:0;
    x=Math.round(x); y=Math.round(y);
    rect(c,x+3,y+22,11,2,'#304839');
    rect(c,x+5,y+16+bob,3,6+stride,'#3b4548'); rect(c,x+10,y+16+bob,3,6-stride,'#3b4548');
    rect(c,x+4,y+22+stride,4,1,'#493e34'); rect(c,x+10,y+22-stride,4,1,'#493e34');
    rect(c,x+4,y+10+bob,9,8,coat); rect(c,x+4,y+16+bob,9,2,'#655340'); rect(c,x+3,y+11+bob,2,6-stride,skin); rect(c,x+13,y+11+bob,2,6+stride,skin);
    rect(c,x+5,y+3+bob,7,7,skin); rect(c,x+4,y+2+bob,9,4,hair); rect(c,x+5,y+1+bob,6,1,hair);
    if(direction===3) rect(c,x+5,y+5+bob,7,5,hair);
    else { const eye=direction===1?5:direction===2?11:7; rect(c,x+eye,y+6+bob,1,1,'#343736'); if(direction===0) rect(c,x+10,y+6+bob,1,1,'#343736'); }
    rect(c,x+6,y+11+bob,1,4,'#e3cd9b'); if(Math.floor((id-1)/24)%5) rect(c,x+5,y+12+bob,7,1,'#dfcf9a'); if(id%5===0) { rect(c,x+3,y+3+bob,11,2,'#b9a170'); rect(c,x+5,y+bob,7,3,'#c8b47d'); }
  }
  // Continuous interpolation on the simulation clock; no wall-clock input.
  const keys=[ [0,34,40,76,.58,1], [5,49,55,91,.48,.8], [8,211,195,132,.08,0], [12,255,224,152,.025,0], [16,226,174,104,.08,0], [19,123,65,91,.30,.65], [22,34,40,76,.58,1], [24,34,40,76,.58,1] ];
  function light(hour) {
    const h=((hour%24)+24)%24; let i=0; while(keys[i+1][0]<h) i++;
    const a=keys[i],b=keys[i+1],t=(h-a[0])/(b[0]-a[0]);
    const v=a.slice(1).map((n,k)=>n+(b[k+1]-n)*t);
    return { color:v.slice(0,3).map(Math.round), alpha:v[3], night:v[4], phase:h<6?'Nuit':h<10?'Matin':h<17?'Jour':h<21?'Crépuscule':'Nuit' };
  }
  function direction(from,to) { const dx=to%12-from%12,dy=Math.floor(to/12)-Math.floor(from/12); return Math.abs(dx)>Math.abs(dy)?dx<0?1:2:dy<0?3:0; }
  const api={TILE,WIDTH,HEIGHT,palette,hash,tile,person,light,direction};
  if(typeof module==='object') module.exports=api; else root.MicrocosmeGraphics=api;
})(globalThis);
