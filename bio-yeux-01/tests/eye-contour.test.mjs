import assert from 'node:assert/strict';
import {test} from 'node:test';
import {luminance} from '../../bio-col-01/palette.mjs';
import {appearanceDocument,parseAppearance} from '../appearance.mjs';
import {beardPresets} from '../beard.mjs';
import {restoreSelection} from '../catalogue.mjs';
import {anatomicalEyeColours,solveDetails} from '../details.mjs';
import {eyeContourCases} from '../eye-contour-study.mjs';
import {eyePresets,eyesFor} from '../eyes.mjs';
import {normalizeMakeup} from '../makeup.mjs';
import {character} from '../render.mjs';

const scales = [{headOnly:true},{},{headOnly:true,smallScale:true}];
const input = {style:'p5-038',arrangement:'G',body:'standard'};
const inherited = {
  iris:{}, details:{lashes:{count:3,length:10,spacing:50}}, brows:{}, mouth:{}, nose:{},
  beard:beardPresets.full.values, marks:[{id:'m1',type:'mole'}], scars:[{id:'s1'}]
};
const cosmetics = {
  liner:{enabled:true,colour:'#3f649b',top:67,bottom:26,wing:80,slant:25},
  shadow:{enabled:true}, lips:{enabled:true}, blush:{enabled:true},
  paint:{enabled:true,elements:[{shape:'star',size:70,mirror:true}]}
};
const layer = (svg, name) => [...svg.matchAll(new RegExp('<path '+name+'[^>]*\\/>','g'))].map(match=>match[0]);
const colour = path=>path.match(/fill="([^"]+)"/)[1];
const points = path=>path.match(/ d="M([^"]+)"/)[1].replace(/Z$/,'').split('L');
const luma = ink => luminance('#' + [...ink.matchAll(/[\d.]+/g)]
  .map(([n])=>Math.round(Number(n)).toString(16).padStart(2,'0')).join(''));

function withoutNaturalContour(svg) {
  return svg
    .replace(/<g data-eye-natural="[^"]+">.*?<\/g><\/g><\/g>/g,'')
    .replace(/<path data-eye-detail="contour"[^>]*fill="#171713"\/>/g,'')
    .replace(/<path data-eye-anatomy="[^"]+"[^>]*\/>/g,'')
    .replace(/<g data-lash-count="[^"]+">(?:<path data-eye-lash=""[^>]*\/>)+<\/g>/g,'')
    .replace(/fill="#ebebeb" stroke="#171713" stroke-width="0.8" stroke-linejoin="round"/g,'fill="#ebebeb"');
}

test('la teinte dérivée de la peau différencie les deux bords aux trois tailles',()=>{
  const skins = new Set(eyeContourCases.map(sample=>sample.skin));
  const uppers = new Set(), lowers = new Set();
  for(const skin of skins) {
    const ink=anatomicalEyeColours(skin);
    assert(luma(ink.upper)<luma(ink.lower));
    assert(luma(ink.lower)<luminance(skin));
    uppers.add(ink.upper);
    lowers.add(ink.lower);
    for(const scale of scales) {
      const actual=character(input,{...scale,eyes:'almond',naturalEyes:true,contourSkin:skin});
      const top=layer(actual,'data-eye-anatomy="upper"');
      const bottom=layer(actual,'data-eye-anatomy="lower"');
      assert.equal(top.length,2);
      assert.equal(bottom.length,2);
      assert(top.every(tag=>colour(tag)===ink.upper));
      assert(bottom.every(tag=>colour(tag)===ink.lower));
      assert.equal(layer(actual,'data-eye-lash=').length,0);
    }
  }
  assert.equal(uppers.size,4);
  assert.equal(lowers.size,4);
});

test('toutes les ouvertures et les autres dessins restent identiques à anatomie égale',()=>{
  for(const eyes of [null,...Object.keys(eyePresets)]) {
    for(const scale of scales) {
      for (const options of [{},{...inherited,makeup:cosmetics}]) {
        const settings={...scale,...options,eyes,instance:'r01-comparaison'};
        const before=character(input,settings);
        const after=character(input,{...settings,naturalEyes:true});
        assert.notEqual(after,before);
        assert(withoutNaturalContour(after)===withoutNaturalContour(before),
          String(eyes)+' '+JSON.stringify(scale)+' '+String(!!options.makeup));
      }
    }
  }
});

test('les cils peints gardent leur encre et chaque point de leur silhouette extérieure',()=>{
  let tested=0;
  for(const eyes of [null,'almond','narrow','upturned','downturned']) {
    for(const count of [0,1,2,3]) {
      const details={lashes:{count,length:8,spacing:52}};
      const effective=solveDetails(eyesFor(input,eyes),details).effective.lashes.count;
      const before=character(input,{eyes,details});
      const after=character(input,{eyes,details,naturalEyes:true});
      const oldContour = new Set(layer(before,'data-eye-detail="contour"').flatMap(points));
      const lashes=layer(after,'data-eye-lash=');
      assert.equal(lashes.length,effective*2);
      for(const lash of lashes) {
        const border=points(lash);
        const outside=border.slice(0,border.length/2);
        assert(outside.length>2);
        assert(outside.every(point=>oldContour.has(point)));
        assert.equal(colour(lash),'#171713');
      }
      tested+=lashes.length;
    }
  }
  assert(tested>30);
});

test('les réglages de contour restent utiles et le retrait restitue le nouveau rendu naturel',()=>{
  const detail = n => ({contours:{upper:n,lower:n},lashes:{count:0}});
  for(const scale of scales) {
    const settings={...scale,...inherited,eyes:'almond',naturalEyes:true};
    const bare=character(input,settings);
    const made=character(input,{...settings,makeup:cosmetics});
    assert.notEqual(made,bare);
    assert.equal(character(input,{...settings,makeup:normalizeMakeup()}),bare);
    const small=character(input,{...settings,details:detail(50)});
    const large=character(input,{...settings,details:detail(200)});
    for(const key of ['upper','lower']) {
      assert.notDeepEqual(layer(small,'data-eye-anatomy="'+key+'"'),layer(large,'data-eye-anatomy="'+key+'"'));
    }
  }
});

test('les archives d’apparence conservent leur schéma et leur replay v10',()=>{
  const selection=restoreSelection(input);
  const args={...inherited,makeup:cosmetics,eyes:'almond',form:'almond',colour:'chatain-clair',flat:false};
  const document=appearanceDocument(selection,args);
  assert.equal(document.version,10);
  assert.deepEqual(appearanceDocument(selection,{...args,naturalEyes:true}),document);
  assert.deepEqual(appearanceDocument(selection,parseAppearance(JSON.stringify(document))),document);
});
