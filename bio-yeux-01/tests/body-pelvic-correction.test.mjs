import assert from 'node:assert/strict';
import {test} from 'node:test';
import {adultBodyGeometry} from '../adult-body.mjs';
import {abdominalFoldGeometry, bellyDetailsMarkup, groinGeometry, navelGeometry, pelvicLandmarks} from '../belly-details.mjs';
import {abdominalFoldGeometry as oldFold, navelGeometry as oldNavel, referenceNavel} from '../belly-details-before.mjs';
import {outlineCurves, stripX} from '../bezier.mjs';
import {corpulenceStops} from '../body-corpulence.mjs';
import {structureControls} from '../body-structure.mjs';
import {referenceAbdominals} from '../abdominals.mjs';
import {character} from '../render.mjs';

const bodies=['adult-h','adult-f'];
const corners=Array.from({length:64},(_,bits)=>Object.fromEntries(
  Object.entries(structureControls).map(([key,{min,max}],i)=>[key,bits&(1<<i) ? max : min])));
const transpose=curves=>curves.map(curve=>curve.map(([x,y])=>[y,x]));

test('le nombril et le pli descendent continûment et la marge à 100 % vaut 1 % de la hauteur',()=>{
  for (const key of bodies) {
    let previous;
    for (let i=0;i<=1000;i++) {
      const fat=i/10, body=adultBodyGeometry(key,[80,111],undefined,fat);
      const fold=abdominalFoldGeometry(body,fat);
      const navel=navelGeometry(body,fat);
      assert.equal(navel.cx,body.ground.x);
      if (previous) {
        assert(fold.bottom>previous.fold.bottom && fold.bottom-previous.fold.bottom<.04);
        assert(fold.depth>previous.fold.depth && fold.reach>previous.fold.reach);
        assert(fold.strength>previous.fold.strength && fold.strength-previous.fold.strength<.0021);
        assert(navel.cy>previous.navel.cy && navel.cy-previous.navel.cy<.01);
      }
      if (fat>=50) {
        assert(fold.bottom>oldFold(body,fat).center+oldFold(body,fat).thickness+7);
        assert(navel.cy>oldNavel(body,referenceNavel,fat).cy+5);
      }
      assert(navel.cy+navel.ry<fold.center);
      if (fat===100) assert(Math.abs(pelvicLandmarks(body).reservedTop-fold.bottom-body.height*.010)<1e-9);
      previous={fold,navel};
    }
  }
});

test('2 304 configurations maintiennent la séparation du pli et des deux courbes de l’aine',()=>{
  let count=0, scanned=0;
  for (const key of bodies) for (const chin of [[80,103],[80,117]]) for (const structure of corners) {
    for (const {value:fat} of corpulenceStops) {
      const body=adultBodyGeometry(key,chin,structure,fat);
      const fold=abdominalFoldGeometry(body,fat);
      const marks=pelvicLandmarks(body);
      const groins=groinGeometry(body,fat);
      assert(marks.abdomen<marks.hips && marks.hips<marks.reservedTop && marks.reservedTop<marks.pelvicBase);
      assert(fold.bottom<marks.reservedTop);
      assert(fold.reach<body.minimumWidth(fold.center-fold.depth,fold.bottom)-2.79);
      const [,right]=groins;
      const points=([start,...segments])=>[start,...segments.flat()];
      const reflected=points(groins[0]);
      for(const [i,[x,y]] of points(right).entries()){
        assert(x>body.ground.x && x-body.ground.x<body.minimumWidth(y,y)-2.79);
        assert(y<marks.pelvicBase && y>marks.hips);
        assert(Math.abs(x+reflected[i][0]-2*body.ground.x)<1e-9 && y===reflected[i][1]);
      }
      const lowerX=right[1][2][0], upperX=Math.min(right[0][0],body.ground.x+fold.reach);
      if (fat && lowerX<upperX) {
        const svg=bellyDetailsMarkup(body,fat,'#dbbf88');
        const foldPath=svg.match(/data-abdominal-fold="" d="([^"]+)"/)[1];
        const f=transpose(outlineCurves(foldPath));
        const g=transpose([[right[0],...right[1]],[right[1][2],...right[2]]]);
        for (let i=0;i<=16;i++) {
          const x=lowerX+(upperX-lowerX)*i/16;
          const foldYs=stripX(f,x);
          const groinYs=stripX(g,x);
          if (foldYs.length && groinYs.length) {
            assert(Math.min(...groinYs)-Math.max(...foldYs)>.4,
              JSON.stringify({key,fat,structure,x,foldYs,groinYs}));
            scanned++;
          }
        }
      }
      count++;
    }
  }
  assert.equal(count,2304);
  assert(scanned>10000);
});

test('les plis conservent leur pigmentation et leur opacité pour toutes les corpulences et échelles',()=>{
  for (const skin of ['#dbbf88','#573222']) {
    const pigments=new Set(), paths=new Set();
    for(const key of bodies) for(const {value:fat} of corpulenceStops) for(const smallScale of [false,true]) {
      const body=adultBodyGeometry(key,[80,111],undefined,fat);
      const svg=bellyDetailsMarkup(body,fat,skin,{smallScale});
      const creases=[...svg.matchAll(/data-groin-crease="" d="([^"]+)" fill="([^"]+)" opacity="([^"]+)"/g)];
      assert.equal(creases.length,2);
      for (const [,path,colour,opacity] of creases) {
        paths.add(path);
        pigments.add(colour+'/'+opacity);
        assert.equal(opacity,'0.48');
      }
      assert.equal([...svg.matchAll(/data-navel-part=/g)].length,smallScale ? 1 : 2);
    }
    assert.equal(paths.size,36);
    assert.equal(pigments.size,1);
  }
});

test('seul le calque abdominal et pelvien diffère du témoin 05-C',()=>{
  const layer=/<g data-belly-details=""[^>]*>[^]*?<\/g>/;
  for (const body of [...bodies,'standard']) for(const corpulence of [0,50,100]) for(const scale of [
    {},{headOnly:true},{headOnly:true,smallScale:true}
  ]) {
    const input={style:'p5-061',arrangement:'G',body,corpulence,abdominals:{...referenceAbdominals,volume:82}};
    const options={...scale,boneReliefs:true,naturalEyes:true,instance:'pelvic-correction'};
    const before=character(input,{...options,bellyFinish:'before'});
    const after=character(input,{...options,bellyFinish:true});
    assert.equal(before.replace(layer,''),after.replace(layer,''));
    assert.equal(after.includes('data-groin-crease'),bodies.includes(body));
    assert(!before.includes('data-groin-crease'));
  }
});
