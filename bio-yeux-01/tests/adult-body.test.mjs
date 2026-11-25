import assert from 'node:assert/strict';
import {test} from 'node:test';
import {adultBodies, adultBodyGeometry, anatomyLevels} from '../adult-body.mjs';
import {appearanceDocument, characterInput, parseAppearance} from '../appearance.mjs';
import {beardPresets} from '../beard.mjs';
import {choices, exportSelection, restoreSelection} from '../catalogue.mjs';
import {character} from '../render.mjs';
import {bodies, controls, model, presets} from '../../preview/bio-vis-p5-i6/model.mjs';

const keys = Object.keys(adultBodies);
const scales = [{headOnly:true}, {}, {headOnly:true, smallScale:true}];
const bodyLayer = /<g class="body-shape"[^>]*>[^]*?<\/g>/;
const stripBody = svg => svg.replace(bodyLayer, '');
const base = {style:'p5-038', arrangement:'G', body:'standard'};
const neutral = {eyes:null, form:'historical', colour:'chatain-clair', flat:false};
const options = {naturalEyes:true, instance:'corps-01'};
const cosmetics = {liner:{enabled:true, colour:'#3f649b', top:67, wing:40}};

function points(path) {
  return [...path.matchAll(/[MC]([^MCZ]+)/g)].map(([, command]) =>
    command.trim().split(' ').map(pair => pair.split(',').map(Number)));
}
const delta = ([x,y], [u,v]) => [u-x, v-y];

test('sept repères, symétrie et tangentes continues jusqu’au point d’appui', () => {
  assert.equal(anatomyLevels.length, 7);
  const limits = field => Object.fromEntries(Object.entries(controls).map(([key, range]) => [key, range[field]]));
  for (const face of [{}, limits('min'), limits('max'), presets.tall.values, presets.broad.values]) {
    const chin = model({...base, ...face}).anchors.chin;
    for (const key of keys) {
      const {levels, ground, height, path} = adultBodyGeometry(key, chin);
      assert.equal(levels[0].y, chin[1]-4);
      assert.equal(ground.x, chin[0]);
      assert.equal(ground.y, 249);
      assert(Math.abs((ground.y-levels.at(-1).y)/height - 1/3) < 1e-12);
      assert(levels[4].y-levels[3].y < levels[3].y-levels[2].y);
      for (let i=1; i<levels.length; i++) assert(levels[i].y>levels[i-1].y);
      const [[start], ...curves] = points(path);
      assert(path.endsWith('Z'));
      assert.deepEqual(curves[7].at(-1), [ground.x, ground.y]);
      assert.deepEqual(curves.at(-1).at(-1), start);
      for (let i=0; i<curves.length; i++) {
        const curve = curves[i], next = curves[(i+1)%curves.length], point = curve[2];
        assert(curve.flat().every(Number.isFinite));
        assert(curve.every(([, y]) => y<=ground.y));
        const [x,y] = delta(curve[1], point), [u,v] = delta(point, next[0]);
        assert(x*u+y*v>0);
        assert(Math.abs(x*v-y*u)/(Math.hypot(x,y)*Math.hypot(u,v)) < .003, `${key} · jonction ${i}`);
      }
      const mirror = ([x,y]) => [Number((2*ground.x-x).toFixed(3)), y];
      const right = curves.slice(0,8).flat();
      const left = curves.slice(8,16).flat();
      assert.deepEqual(left, [start,...right].reverse().slice(1).map(mirror));
      for (const [i, landmark] of levels.entries()) {
        assert.deepEqual(i===0 ? start : curves[i-1][2], [
          Number((ground.x+landmark.width).toFixed(3)), Number(landmark.y.toFixed(3))
        ]);
      }
    }
  }
  const [h,f] = keys.map(key => adultBodyGeometry(key, [80,109]).levels.map(level => level.width));
  assert(h[1]>f[1] && h[2]>f[2] && h[5]<f[5] && h[3]/h[2]>f[3]/f[2]);
});

test('les deux bases changent uniquement le tronc, sur les 126 références et les trois échelles', () => {
  let count=0;
  for (const {style, arrangement} of choices) for (const scale of scales) {
    const input = {...base, style, arrangement:arrangement==='U' ? 'G' : arrangement};
    const opts = {...options, ...scale, hairColor:'chatain-clair'};
    const legacy = character(input, opts);
    const next = keys.map(body => character({...input,body}, opts));
    for (const [i,svg] of next.entries()) {
      const layer = svg.match(bodyLayer)[0];
      assert(layer.includes(`data-adult-body="${keys[i]}"`));
      assert.equal([...layer.matchAll(/<path /g)].length, 1);
      assert.match(layer, /fill="#dbbf88" stroke="#c2a873"/);
      assert.equal(stripBody(svg), stripBody(legacy), `${style} · ${arrangement} · ${keys[i]}`);
      assert(!svg.includes('data-body-guides'));
    }
    assert.notEqual(next[0], next[1]);
    count += 2;
  }
  assert.equal(count, 756);
});

test('trois cadrages et modules du visage actifs sur des coiffures longues', () => {
  const modules = {
    eyes:'almond', iris:{}, details:{lashes:{count:3}}, brows:{}, nose:{}, mouth:{},
    beard:beardPresets.full.values, beardCategory:'T',
    marks:[{id:'m1',type:'mole'}], scars:[{id:'s1'}], makeup:cosmetics
  };
  for (const style of ['p5-029','p5-061','waist_waves']) for (const scale of scales) {
    const input = {...base,style,...presets.tall.values};
    const opts = {...options,...scale,...modules};
    const reference = stripBody(character(input,opts));
    for (const body of keys) assert.equal(stripBody(character({...input,body},opts)), reference);
  }
});

test('le format v11 rejoue H et F à froid et garde les anciennes clés inertes', () => {
  const raw = {...base, style:'p5-061', body:'adult-h', shoulders:.72, chest:'pectoral', physique:'F'};
  const old = restoreSelection(raw);
  assert.equal(old.state.body,'standard');
  assert.deepEqual(JSON.parse(exportSelection(old)),raw);
  const older = appearanceDocument(old, {...neutral,makeup:cosmetics});
  assert.equal(older.version,10);
  assert.deepEqual(appearanceDocument(old,neutral).character,older.character);
  const oldReplay = parseAppearance(JSON.stringify(older));
  assert.equal(oldReplay.selection.state.body,'standard');
  assert.deepEqual(appearanceDocument(oldReplay.selection,oldReplay),older);
  for (const body of keys) for (const settings of [neutral, {...neutral,makeup:cosmetics,beardCategory:'T'}]) {
    const chosen = restoreSelection(raw,body);
    const document = appearanceDocument(chosen,settings);
    assert.equal(document.version,11);
    assert.equal(document.renderer,'bio-corps-01-svg@1');
    assert.equal(document.character.body,body);
    assert.deepEqual(document.historicalSelection,raw);
    const restored = parseAppearance(JSON.stringify(document));
    assert.equal(restored.selection.state.body,body);
    assert.deepEqual(appearanceDocument(restored.selection,restored),document);
    for (const scale of scales) {
      const opts = {...options,...scale,makeup:settings.makeup};
      assert.equal(character(characterInput(restored.selection),opts),character(characterInput(chosen),opts));
    }
    for (const bad of ['standard','adult-t',['adult-h'],null]) {
      const modified = {...document,character:{...document.character,body:bad}};
      assert.throws(() => parseAppearance(JSON.stringify(modified)), /Base adulte/);
    }
  }
  for (const body of Object.keys(bodies)) {
    const document = appearanceDocument(restoreSelection({...raw,body}),neutral);
    assert.equal(document.version,1);
    assert.equal(parseAppearance(JSON.stringify(document)).selection.state.body,body);
  }
});
