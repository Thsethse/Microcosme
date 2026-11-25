import {adultBodyMarkup, isAdultBody} from './adult-body.mjs';
import {character as inherited} from '../bio-col-01/render.mjs';
import {model} from '../preview/bio-vis-p5-i6/model.mjs';
import {headMarkup} from '../preview/bio-vis-p5-i6/i5/i4/i3/i2/i1/base/r1/p2/base/render.mjs';
import {palette} from '../preview/bio-vis-p5-i6/i5/i4/i3/i2/i1/base/r1/p2/base/model.mjs';
import {eyeStroke, eyesFor, normalizeEyes} from './eyes.mjs';
import {irisMarkup, pigmentCenters, solveIris} from './iris.mjs';
import {detailFrame, detailsMarkup, naturalOutlineMarkup, solveDetails} from './details.mjs';
import {browMarkup, solveBrows} from './brows.mjs';
import {inheritedMouth, inheritedNose, mouthMarkup, solveMouth} from './mouth.mjs';
import {noseMarkup, solveNose} from './nose.mjs';
import {beardCategoryOf, beardMarkup, solveBeard} from './beard.mjs';
import {marksMarkup, solveMarks} from './marks.mjs';
import {scarsMarkup, solveScars} from './scars.mjs';
import {hasMakeup, normalizeMakeup} from './makeup.mjs';
import {makeupMarkup} from './makeup-render.mjs';

function clipId(path, instance, index) {
  // Equal default IDs are safe for equal outlines. An explicit instance also
  // lets callers isolate SVGs shown side by side in the same document.
  let hash = 2166136261;
  for (const character of path) hash = Math.imul(hash ^ character.charCodeAt(0), 16777619);
  const prefix = String(instance ?? 'default').replace(/[^a-z0-9_-]/gi, '-');
  return 'bio-yeux-' + prefix + '-' + index + '-' + (hash >>> 0).toString(36);
}

function ellipsePath(ellipse) {
  const [,x,y,rx,ry]=ellipse.match(/cx="([^"]+)" cy="([^"]+)" rx="([^"]+)" ry="([^"]+)"/);
  return `M${x},${y}m${-rx},0 a${rx},${ry} 0 1 0 ${2*rx},0 a${rx},${ry} 0 1 0 ${-2*rx},0Z`;
}

function replaceOpenings(face, geometry, instance, drawIris, details, natural) {
  const {shapes}=geometry;
  const outlineFrame=natural&&!details?detailFrame(geometry):null;
  let index = 0;
  // Each historical white is immediately followed by its pupil ellipse in the
  // shared face renderer. Preserve the pupil tag byte for byte inside the clip.
  const pairs = new RegExp(
    '(<ellipse [^>]*fill="' + palette.white + '"[^>]*\\/>)(<ellipse [^>]*fill="' + palette.pupil + '"[^>]*\\/>)', 'g');
  const result = face.replace(pairs, (_, white, pupil) => {
    const shape = shapes[index];
    const ink = drawIris ? drawIris(index) : pupil;
    const id = clipId(shape?.path ?? white, instance, index);
    const aperture = shape ? `<path d="${shape.path}"/>` : white;
    const opening = shape?.path ?? (details || natural ? ellipsePath(white) : null);
    const outside = details ? detailsMarkup(details,index,opening,id,palette.skin,natural) :
      outlineFrame ? naturalOutlineMarkup(outlineFrame,index,opening,id,natural) : '';
    index++;
    if (!shape) {
      if (!drawIris) return outside + white + pupil;
      return `${outside}${white}<defs><clipPath id="${id}">${white}</clipPath></defs><g clip-path="url(#${id})">${ink}</g>`;
    }
    const stroke = details || natural ? '' : ` stroke="${palette.pupil}" stroke-width="${eyeStroke}" stroke-linejoin="round"`;
    return `<g data-bio-eye="${index === 1 ? 'left' : 'right'}"><defs><clipPath id="${id}">${aperture}</clipPath></defs>${outside}<path d="${shape.path}" fill="${palette.white}"${stroke}/><g clip-path="url(#${id})">${ink}</g></g>`;
  });
  if (index !== 2) throw new Error('Ouvertures historiques introuvables');
  return result;
}

function replaceBrows(face, model, markup) {
  const {head:{rx},anchors:{browLeft,browRight},parameters}=model.base;
  const sharp=parameters.eyes==='sharp', width=rx*.26;
  const starts=[browLeft,browRight].map(([x,y],i)=>sharp?
    `${x-width},${y-2*(i===0?1:-1)}`:`${x-width*.9},${y}`);
  let count=0;
  const result=face.replace(/<path d="M([^ ]+) [^"]+" fill="none" stroke="[^"]+" stroke-width="2\.[26]"[^>]*\/>/g,(tag,start)=>{
    if (!starts.includes(start)) return tag;
    return count++===0?markup:'';
  });
  if (count!==2) throw new Error('Sourcils historiques introuvables.');
  return result;
}

function guides({envelopes, nose, maxWidth, maxHeight}) {
  const lines = envelopes.map(({x, y, left, top, right, bottom}) => {
    const cross = `M${x - 1.6},${y}h3.2 M${x},${y - 1.6}v3.2`;
    const dimensions = `M${x - maxWidth / 2},${top - 1}h${maxWidth} M${left - 1},${y - maxHeight / 2}v${maxHeight}`;
    return `<rect x="${left}" y="${top}" width="${right - left}" height="${bottom - top}" stroke-dasharray="1.2 .8"/><path d="${cross} ${dimensions}"/>`;
  }).join('');
  return `<g data-eye-envelopes="" aria-hidden="true" fill="none" stroke="#146b9c" stroke-width=".48" pointer-events="none">${lines}<path d="M${nose.left},${nose.top + 2}v-2H${nose.right}v2" stroke-dasharray=".8 .6"/></g>`;
}

export function character(input = {}, options = {}) {
  const inheritedSvg = inherited(input, options);
  const adultFace = isAdultBody(input.body) ? model(input) : null;
  const svg = adultFace ? inheritedSvg.replace(/<g class="body-shape">[^]*?<\/g>/,
    () => adultBodyMarkup(input.body, adultFace.anchors.chin, palette)) : inheritedSvg;
  const selected = normalizeEyes(options.eyes);
  const hasIris = options.iris != null && options.iris !== 'historical';
  const hasDetails = options.details != null && options.details !== 'historical';
  const hasBrows = options.brows != null && options.brows !== 'historical';
  const hasMouth = options.mouth != null && options.mouth !== 'historical';
  const hasNose = options.nose != null && options.nose !== 'historical';
  const category = options.beardCategory ?? input.beardCategory;
  const hasBeard = options.beard != null && options.beard !== 'historical' && beardCategoryOf(category) !== 'F';
  const hasMarks = options.marks != null && options.marks !== 'historical' && options.marks.length !== 0;
  const hasScars = options.scars != null && options.scars !== 'historical' && options.scars.length !== 0;
  const makeup = options.makeup && normalizeMakeup(options.makeup);
  const hasCosmetics = hasMakeup(makeup);
  const natural = options.naturalEyes ? {skin:options.contourSkin??palette.skin, smallScale:options.smallScale===true} : null;
  if (!natural && !selected && !options.eyeEnvelopes && !hasIris && !hasDetails && !hasBrows && !hasMouth && !hasNose && !hasBeard && !hasMarks && !hasScars && !hasCosmetics) return svg;
  const geometry = eyesFor(input, selected);
  let result = svg;
  if (natural || selected || hasIris || hasDetails || hasBrows || hasMouth || hasNose || hasBeard || hasMarks || hasScars || hasCosmetics) {
    const face = adultFace ?? model(input);
    const originalFace = headMarkup(face.base).replace(/<path d="[^"]*"/, `<path d="${face.outline}"`);
    if (!svg.includes(originalFace)) throw new Error('Visage historique introuvable');
    const iris = hasIris ? solveIris(geometry, options.iris) : null;
    const centers = iris ? pigmentCenters(geometry) : [];
    const drawIris = iris ? index => irisMarkup(iris, centers[index], index) : null;
    const details = hasDetails ? solveDetails(geometry, options.details) : null;
    const brows = hasBrows ? solveBrows(face,geometry,options.brows,{...options,source:svg}) : null;
    let updatedFace = brows ? replaceBrows(originalFace,face,browMarkup(brows)) : originalFace;
    const nose = hasNose ? solveNose(face,geometry,options.nose,{mouth:options.mouth,eyeDetails:details,markup:originalFace}) : null;
    if (nose) updatedFace = updatedFace.replace(inheritedNose(face,originalFace).tag,noseMarkup(nose));
    const mouth = hasMouth ? solveMouth(face,geometry,options.mouth,
      {markup:originalFace,noseBounds:nose?.geometry.anatomy,preserveMouth:!!nose}) : null;
    if (mouth) updatedFace = updatedFace.replace(inheritedMouth(face,originalFace).tag,mouthMarkup(mouth));
    if (natural || selected || hasIris || hasDetails) {
      updatedFace = replaceOpenings(updatedFace,geometry,options.instance,drawIris,details,natural);
    }
    if (hasMarks) updatedFace += marksMarkup(solveMarks(face,geometry,options.marks,
      {markup:originalFace,noseResult:nose,mouthResult:mouth}),
      {skin:options.markStudySkin,scale:options.smallScale?'mini':options.headOnly?'head':'body'});
    if (hasScars) {
      const anatomy={markup:originalFace,noseResult:nose,mouthResult:mouth};
      updatedFace += scarsMarkup(solveScars(face,geometry,options.scars,anatomy),{
        face,opening:geometry,...anatomy,instance:options.instance,skin:options.scarStudySkin,
        scale:options.smallScale?'mini':options.headOnly?'head':'body'
      });
    }
    if (hasCosmetics) updatedFace += makeupMarkup(face, geometry, makeup, {
      markup: originalFace, painted: updatedFace, mouthResult: mouth, noseResult: nose, detailResult: details,
      instance: options.instance
    });
    if (hasBeard) updatedFace += beardMarkup(solveBeard(face,geometry,options.beard,
      {...options,category,source:svg,markup:originalFace,detailResult:details,noseResult:nose,mouthResult:mouth}));
    result = svg.replace(originalFace,updatedFace);
  }
  if (options.eyeEnvelopes) result = result.replace(/<\/svg>$/, guides(geometry.face) + '</svg>');
  return result;
}
