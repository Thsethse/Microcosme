import {character as inherited} from '../bio-col-01/render.mjs';
import {model} from '../bio-vis-p5-i6/model.mjs';
import {headMarkup} from '../bio-vis-p5-i6/i5/i4/i3/i2/i1/base/r1/p2/base/render.mjs';
import {palette} from '../bio-vis-p5-i6/i5/i4/i3/i2/i1/base/r1/p2/base/model.mjs';
import {eyeStroke, eyesFor, normalizeEyes} from './eyes.mjs';

function clipId(path, instance, index) {
  // Equal default IDs are safe for equal outlines. An explicit instance also
  // lets callers isolate SVGs shown side by side in the same document.
  let hash = 2166136261;
  for (const character of path) hash = Math.imul(hash ^ character.charCodeAt(0), 16777619);
  const prefix = String(instance ?? 'default').replace(/[^a-z0-9_-]/gi, '-');
  return 'bio-yeux-' + prefix + '-' + index + '-' + (hash >>> 0).toString(36);
}

function replaceOpenings(face, shapes, instance) {
  let index = 0;
  // Each historical white is immediately followed by its pupil ellipse in the
  // shared face renderer. Preserve the pupil tag byte for byte inside the clip.
  const pairs = new RegExp(
    '(<ellipse [^>]*fill="' + palette.white + '"[^>]*\\/>)(<ellipse [^>]*fill="' + palette.pupil + '"[^>]*\\/>)', 'g');
  const result = face.replace(pairs, (_, white, pupil) => {
    const {path} = shapes[index];
    const id = clipId(path, instance, index++);
    return `<g data-bio-eye="${index === 1 ? 'left' : 'right'}"><defs><clipPath id="${id}"><path d="${path}"/></clipPath></defs><path d="${path}" fill="${palette.white}" stroke="${palette.pupil}" stroke-width="${eyeStroke}" stroke-linejoin="round"/><g clip-path="url(#${id})">${pupil}</g></g>`;
  });
  if (index !== 2) throw new Error('Ouvertures historiques introuvables');
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
  const svg = inherited(input, options);
  const selected = normalizeEyes(options.eyes);
  if (!selected && !options.eyeEnvelopes) return svg;
  const geometry = eyesFor(input, selected);
  let result = svg;
  if (selected) {
    const face = model(input);
    const originalFace = headMarkup(face.base).replace(/<path d="[^"]*"/, `<path d="${face.outline}"`);
    if (!svg.includes(originalFace)) throw new Error('Visage historique introuvable');
    result = svg.replace(originalFace, replaceOpenings(originalFace, geometry.shapes, options.instance));
  }
  if (options.eyeEnvelopes) result = result.replace(/<\/svg>$/, guides(geometry.face) + '</svg>');
  return result;
}
