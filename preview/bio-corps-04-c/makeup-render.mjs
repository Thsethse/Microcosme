import {model} from '../bio-vis-p5-i6/model.mjs';
import {pointAt} from './bezier.mjs';
import {detailContourEdges, detailContourMarkup, detailFrame, solveDetails} from './details.mjs';
import {eyeStroke, eyesFor} from './eyes.mjs';
import {marksFrame} from './marks.mjs';
import {inheritedMouth, mouthMarkup, solveMouth} from './mouth.mjs';
import {solveNose} from './nose.mjs';
import {scarReserves} from './scars.mjs';
import {hasMakeup, inactiveFields, makeupMirrorUseful, normalizeMakeup} from './makeup.mjs';

const lerp = (a, b, t) => a + (b - a) * t;
const n = value => +value.toFixed(5);
const pair = point => point.map(n).join(',');
const lines = points => 'M' + points.map(pair).join('L');
const polygon = points => lines(points) + 'Z';
const tagPath = tag => tag.match(/\bd="([^"]+)"/)[1];
const black = tag => tag.replace(/\b(fill|stroke)="(?!none")[^"]+"/g, '$1="black"');
const tags = (markup, pattern) => [...markup.matchAll(pattern)].map(([tag]) => tag);
const path = (d, attrs) => `<path d="${d}" ${attrs}/>`;
const unit = value => value / 100;

const paintPosition = (plane, u, v) => plane.point(lerp(7, 93, unit(u)), lerp(11, 94, unit(v)));

export function makeupCoordinates(x, y) {
  return [Math.round((x - 7) * 100 / 86), Math.round((y - 11) * 100 / 83)];
}

function lipGeometry(face, options) {
  const {mouthResult, markup} = options;
  if (mouthResult) {
    const mouth = mouthMarkup(mouthResult);
    const paths = tags(mouth, /<path data-mouth-part="(?:upper|lower)"[^>]*\/>/g).map(tagPath);
    const seam = tagPath(mouth.match(/<path data-mouth-part="line"[^>]*\/>/)[0]);
    const {frame, effective} = mouthResult;
    const volumes = ['upper', 'lower'].filter(side => mouthResult.geometry[side])
      .map(side => frame[side] * unit(effective[side]));
    return {paths, volumes, separator: path(seam, 'fill="black"'), box: mouthResult.box};
  }
  const {curve, tag, stroke} = inheritedMouth(face, markup);
  const {ry} = face.base.head;
  const samples = Array.from({length: 25}, (_, i) => {
    const t = i / 24, [x, y] = pointAt(curve, t);
    const ends = Math.sin(Math.PI * t) ** .73;
    const cupid = .81 + .19 * Math.sin(2 * Math.PI * t) ** 2;
    return {x, y, upper: y - ends * (stroke * .55 + ry * .032 * cupid),
      lower: y + ends * (stroke * .55 + ry * .048)};
  });
  const paths = [polygon([...samples.map(p => [p.x, p.upper]), ...samples.slice().reverse().map(p => [p.x, p.y])]),
    polygon([...samples.map(p => [p.x, p.y]), ...samples.slice().reverse().map(p => [p.x, p.lower])])];
  return {paths, volumes: [ry * .032, ry * .048], separator: black(tag), box: {left: samples[0].x, right: samples.at(-1).x,
    top: Math.min(...samples.map(p => p.upper)), bottom: Math.max(...samples.map(p => p.lower))}};
}

function eyeGeometry(face, opening, shadow, liner, detailResult) {
  const details = detailResult?.frame ?? detailFrame(opening);
  const {head, anchors} = face.base;
  const natural = detailResult ? detailContourEdges(detailResult) : null;
  const rail = (key, points) => natural?.[key] ?? points.map(([x, y]) => {
    const radius = Math.hypot(x, y);
    const offset = opening.shapes.length ? eyeStroke / 2 : 0;
    return [x * (1 + offset / radius), y * (1 + offset / radius)];
  });
  return details.envelopes.map((eye, index) => {
    const {x, y, side} = eye;
    const brow = index === 0 ? anchors.browLeft : anchors.browRight;
    const scene = ([u, v]) => [x + side * u, y + v];
    const along = (dir, t) => scene(details.arc(dir, t));
    const {region} = details;
    const [baseX, baseY] = details.arc(-1, 1);
    const availableWidth = Math.max(0, Math.min(head.rx * .29, region.right - baseX - .27));
    const radians = liner.slant * Math.PI / 180;
    const slope = Math.tan(radians);
    const yLimit = slope >= 0 ? baseY - region.top : region.bottom - baseY;
    const wingLength = Math.max(0, Math.min(availableWidth, yLimit / Math.max(Math.abs(slope), .001))) * unit(liner.wing);
    const thicknessBase = head.ry * .059;
    const topWidth = thicknessBase * unit(liner.top);
    const bottomWidth = thicknessBase * .67 * unit(liner.bottom);
    const wingBase = Math.max(topWidth * .63, Math.min(thicknessBase * .48, wingLength * .37));
    const wing = [
      scene([baseX - wingBase * .58, baseY + wingBase * .14]),
      scene([baseX - wingBase * .38, baseY - wingBase]),
      scene([baseX + wingLength, baseY - wingLength * slope])
    ];

    const count = 25;
    const extent = unit(shadow.extent);
    const outer = unit(shadow.outer);
    const start = (1 - extent) * lerp(.23, .93, outer);
    const end = start + extent;
    const eyelid = Array.from({length: count}, (_, i) => {
      const fraction = i / (count - 1);
      const [lx, ly] = along(-1, lerp(start, end, fraction));
      const room = Math.max(0, Math.min(head.ry * .145, ly - (brow[1] + 1.33)));
      const feather = Math.sin(Math.PI * fraction) ** .64;
      const weight = lerp(1, .46 + .54 * fraction, outer);
      return {x: lx, y: ly, top: ly - room * unit(shadow.height) * feather * weight};
    });
    return {side, eyelid, upper: lines(rail('upper', details.upper).map(scene)),
      lower: lines(rail('lower', details.lower).map(scene)), topWidth, bottomWidth, wing, wingLength};
  });
}

function facePaint(frame, item) {
  const {plane, rx, ry} = frame;
  const position = paintPosition(plane, item.x, item.y);
  const [left] = paintPosition(plane, 0, item.y);
  const [right] = paintPosition(plane, 100, item.y);
  const diameter = Math.min(rx * .78, ry * .68, (right - left) * .64);
  const size = item.shape === 'point' ? lerp(.34, 1.49, unit(item.size)) :
    lerp(diameter * .12, diameter * .5, unit(item.size));
  const inactive = inactiveFields('paint', {...item, intensity: 100});
  const stretch = inactive.includes('stretch') ? 1 : 1 + 1.35 * unit(item.stretch);
  const rotation = inactive.includes('rotation') ? 0 : item.rotation;
  const weight = inactive.includes('weight') ? null : lerp(.064, .49, unit(item.weight));
  const mirror = item.mirror && makeupMirrorUseful(item);
  const transforms = [[...position, 1]];
  if (mirror) transforms.push([...paintPosition(plane, 100 - item.x, item.y), -1]);
  // A centre can overlap a reserved feature on purpose. The SVG mask uses
  // its exact silhouette, while this fit describes the applied transform.
  return {transforms, size, stretch, rotation, weight, mirror};
}

function cheekGeometry(frame, value) {
  const {plane, rx, ry} = frame;
  const distance = lerp(16.8, 31.6, unit(value.x));
  const vertical = lerp(57.2, 72.2, unit(value.y));
  return {
    positions: [plane.point(50 - distance, vertical), plane.point(50 + distance, vertical)],
    width: rx * lerp(.17, .43, unit(value.extent)),
    height: ry * lerp(.058, .172, unit(value.extent))
  };
}

export function solveMakeup(face, opening, value, options = {}) {
  const requested = normalizeMakeup(value);
  const effective = {};
  const geometry = {};
  const {lips, shadow, liner, blush, paint} = requested;
  if (lips.enabled && lips.intensity && (lips.coverage || lips.edge)) {
    geometry.lips = lipGeometry(face, options);
    const {paths, box, volumes} = geometry.lips;
    if (paths.length) effective.lips = {
      width: n(box.right - box.left), coverage: lips.coverage, edges: volumes.map(volume => n(volume * .60 * unit(lips.edge)))
    };
  }
  if (shadow.enabled && shadow.intensity && shadow.height && shadow.extent || liner.enabled && liner.intensity && (liner.top || liner.bottom || liner.wing)) {
    geometry.eyes = eyeGeometry(face, opening, shadow, liner, options.detailResult);
    if (shadow.enabled && shadow.intensity && shadow.height && shadow.extent) {
      effective.shadow = geometry.eyes.map(({eyelid}) => ({
        rise: n(Math.max(...eyelid.map(({y, top}) => y - top))),
        span: n(Math.abs(eyelid[0].x - eyelid.at(-1).x))
      }));
    }
    if (liner.enabled && liner.intensity && (liner.top || liner.bottom || liner.wing)) {
      effective.liner = geometry.eyes.map(({topWidth, bottomWidth, wingLength}) =>
        ({top: n(topWidth), bottom: n(bottomWidth), wing: n(wingLength)}));
    }
  }
  if (blush.enabled && blush.intensity || paint.enabled && paint.elements.some(item => item.intensity)) {
    geometry.cutaneous = marksFrame(face, opening, options);
    if (blush.enabled && blush.intensity) {
      const {positions, width, height} = cheekGeometry(geometry.cutaneous, blush);
      effective.blush = {positions: positions.map(point => point.map(n)), width: n(width), height: n(height)};
    }
    if (paint.enabled) effective.paint = paint.elements.map(item => {
      if (!item.intensity) return null;
      const {transforms, size, stretch, rotation, weight, mirror} = facePaint(geometry.cutaneous, item);
      return {transforms: transforms.map(point => point.map(n)), size: n(size), stretch: n(stretch),
        rotation, weight: weight == null ? null : n(weight), mirror};
    });
  }
  return {requested, effective, geometry};
}

export function makeupFor(input, eyes, makeup, {details, mouth, nose} = {}) {
  const face = model(input), opening = eyesFor(input, eyes);
  const detailResult = solveDetails(opening, details);
  const noseResult = solveNose(face, opening, nose, {mouth, eyeDetails: detailResult});
  const mouthResult = solveMouth(face, opening, mouth, {noseBounds: noseResult?.geometry.anatomy, preserveMouth: !!noseResult});
  return solveMakeup(face, opening, makeup, {noseResult, mouthResult, detailResult});
}

export function makeupPlane(input, eyes) {
  return marksFrame(model(input), eyesFor(input, eyes)).plane;
}

function drawLips(result, id, mask) {
  const {requested: {lips}, effective, geometry} = result;
  if (!effective.lips) return '';
  const {paths, box, separator} = geometry.lips;
  const cx = (box.left + box.right) / 2, cy = (box.top + box.bottom) / 2;
  const coverage = unit(lips.coverage);
  const transform = `translate(${cx} ${cy}) scale(${lerp(.41, 1, coverage)} ${lerp(.49, 1, coverage)}) translate(${-cx} ${-cy})`;
  const ink = paths.map((d, i) => path(d, `fill="${lips.colour}" opacity="${i ? .82 : .96}"`)).join('');
  const outline = paths.map((d, i) => path(d,
    `fill="none" stroke="${lips.edgeColour}" stroke-width="${2 * effective.lips.edges[i]}" stroke-linejoin="round"`)).join('');
  return `<g data-makeup-family="lips" mask="url(#${id}-base)"><defs><clipPath id="${id}-lips">${paths.map(d => path(d, '')).join('')}</clipPath>
    ${mask(id + '-seam', separator)}</defs><g clip-path="url(#${id}-lips)"><g mask="url(#${id}-seam)" opacity="${unit(lips.intensity)}">
    ${lips.coverage ? `<g transform="${transform}">${ink}</g>` : ''}${lips.edge ? outline : ''}</g></g></g>`;
}

function drawShadow(eyes, value, id, bounds) {
  return eyes.map(({eyelid, side}, index) => {
    const key = id + '-shadow-' + index;
    const top = Math.min(...eyelid.map(p => p.top)), bottom = Math.max(...eyelid.map(p => p.y));
    if (top === bottom) return '';
    const ink = path(polygon([...eyelid.map(p => [p.x, p.top]), ...eyelid.slice().reverse().map(p => [p.x, p.y])]),
      `fill="url(#${key}-pigment)"`);
    const outer = unit(value.outer), centre = 1 - outer * .66;
    return `<defs><linearGradient id="${key}-fade" gradientUnits="userSpaceOnUse" x1="0" x2="0" y1="${top}" y2="${bottom}">
      <stop stop-color="white" stop-opacity="0"/><stop offset=".36" stop-color="white" stop-opacity=".52"/><stop offset="1" stop-color="white"/>
      </linearGradient><mask id="${key}-soft" maskUnits="userSpaceOnUse" ${bounds}><rect ${bounds} fill="url(#${key}-fade)"/></mask>
      <linearGradient id="${key}-pigment" x1="${side < 0 ? 1 : 0}" x2="${side < 0 ? 0 : 1}" y1="0" y2="0">
      <stop stop-color="${value.colour}" stop-opacity="${centre}"/><stop offset=".38" stop-color="${value.colour}" stop-opacity="${lerp(centre, 1, .5)}"/>
      <stop offset="1" stop-color="${value.accent ?? value.colour}"/></linearGradient></defs>
      <g mask="url(#${key}-soft)" opacity="${.85 * unit(value.intensity)}">${ink}</g>`;
  }).join('');
}

function drawLiner(eyes, value) {
  return eyes.map(({upper, lower, topWidth, bottomWidth, wing, wingLength}) => {
    const trace = (d, width) => width ? path(d, `fill="none" stroke="${value.colour}" stroke-width="${2 * width}" stroke-linejoin="round" stroke-linecap="round"`) : '';
    return `<g opacity="${unit(value.intensity)}">${trace(upper, topWidth)}${trace(lower, bottomWidth)}
      ${wingLength > 0 ? path(polygon(wing), `fill="${value.colour}"`) : ''}</g>`;
  }).join('');
}

function drawBlush(geometry, value, id) {
  const {width, height, positions} = geometry;
  const diffusion = unit(value.diffusion), centre = .61 * unit(value.intensity);
  return `<defs><radialGradient id="${id}-cheek"><stop stop-color="${value.colour}" stop-opacity="${centre}"/>
    <stop offset="${lerp(.66, .10, diffusion)}" stop-color="${value.colour}" stop-opacity="${centre * .77}"/>
    <stop offset="${lerp(.88, .63, diffusion)}" stop-color="${value.colour}" stop-opacity="${centre * .26}"/>
    <stop offset="1" stop-color="${value.colour}" stop-opacity="0"/></radialGradient></defs>` +
    positions.map(([x, y], i) => `<ellipse cx="${x}" cy="${y}" rx="${width}" ry="${height}" transform="rotate(${i ? -23 : 23} ${x} ${y})" fill="url(#${id}-cheek)"/>`).join('');
}

const star = polygon(Array.from({length: 10}, (_, i) => {
  const radius = i % 2 === 0 ? .97 : .41, angle = (i / 5 - .5) * Math.PI;
  return [radius * Math.cos(angle), radius * Math.sin(angle)];
}));
const closedPaint = {
  triangle: 'M0,-.96 L.95,.75 L-.95,.75Z',
  diamond: 'M0,-.98 L.77,0 L0,.98 L-.77,0Z',
  star
};
const tracedPaint = {
  line: 'M-.87,0 H.87',
  arc: 'M-.83,.48 A.90,.95 0 0 1 .83,.48',
  wave: 'M-.92,.29 C-.60,.29 -.62,-.51 -.29,-.51 S.02,.51 .32,.51 S.61,-.29 .92,-.29',
  zigzag: 'M-.9,.39 L-.48,-.43 L-.05,.39 L.40,-.43 L.90,.39'
};

function paintPrimitive(item, geom) {
  const {shape, colour} = item;
  const fill = `fill="${colour}"`;
  const stroke = `fill="none" stroke="${colour}" stroke-width="${geom.weight}" stroke-linejoin="round" stroke-linecap="round"`;
  if (shape === 'point' || shape === 'circle') return `<circle r=".95" ${fill}/>`;
  if (shape === 'ring') return `<circle r="${n(.95 - geom.weight / 2)}" ${stroke}/>`;
  if (shape === 'stripe') {
    const thickness = geom.weight * 2.16;
    return `<rect x="-.96" y="${-thickness / 2}" width="1.92" height="${thickness}" rx=".07" ${fill}/>`;
  }
  if (shape === 'crescent') {
    const inner = n(lerp(-.64, .68, geom.weight / .49));
    return path(`M.67,-.72 C-1.33,-1.59 -1.33,1.59 .67,.72 C${inner},.43 ${inner},-.43 .67,-.72Z`, fill);
  }
  if (closedPaint[shape]) return path(closedPaint[shape], fill);
  return path(tracedPaint[shape], stroke);
}

function drawPaint(elements, geometry) {
  return elements.map((item, i) => {
    const geom = geometry[i];
    if (!geom) return '';
    const primitive = paintPrimitive(item, geom);
    // Bind mirrored copies to the same ink layer. Overlap between the two
    // sides therefore shares one opacity, while distinct elements accumulate.
    const copies = geom.transforms.map(([x, y, side]) =>
      `<g data-makeup-mirror="${side < 0}" transform="translate(${x} ${y}) scale(${side} 1) rotate(${geom.rotation}) scale(${geom.size * geom.stretch} ${geom.size})">${primitive}</g>`).join('');
    return `<g data-makeup-shape="${item.shape}" data-makeup-index="${i}" opacity="${unit(item.intensity)}">${copies}</g>`;
  }).join('');
}

export function makeupMarkup(face, opening, value, {instance, painted, ...options}) {
  if (!hasMakeup(value)) return '';
  const result = solveMakeup(face, opening, value, options);
  const {requested, effective, geometry} = result;
  if (!Object.keys(effective).length) return '';
  const reserve = scarReserves(face, opening, options);
  // Reserve the same anatomical geometry regardless of how it is painted.
  const details = options.detailResult;
  const contour = details ? [0,1].map(index=>black(detailContourMarkup(details,index))).join('') : '';
  const browPattern = painted.includes('data-bio-brows=') ? /<path data-brow-side="[^"]+"[^>]*\/>/g :
    /<path d="[^"]+" fill="none" stroke="[^"]+" stroke-width="2\.[26]"[^>]*\/>/g;
  const brows = tags(painted, browPattern).map(black).join('');
  const openings = reserve.eyes.join('');
  // Keep the antialiased rim of the tiny nostril interiors intact at
  // the inherited body and thumbnail scales as well.
  const nostrils = reserve.nostrils.map(tag => tag.replace('/>', ' stroke="black" stroke-width=".92"/>')).join('');
  const lipReserve = (geometry.lips?.paths ?? lipGeometry(face, options).paths).map(d => path(d, 'fill="black"')).join('');
  // The border stroke is kept visible. The original mouth and eye anatomy,
  // hair, and facial hair remain in their inherited layers.
  const border = path(face.outline, 'fill="white" stroke="black" stroke-width="4.2" stroke-linejoin="round"');
  const {cx, cy, rx, ry} = face.base.head;
  const bounds = `x="${cx - 2 * rx}" y="${cy - 2 * ry}" width="${4 * rx}" height="${4 * ry}"`;
  let hash = 2166136261;
  for (const ch of face.outline + openings + nostrils + lipReserve + contour + brows + JSON.stringify(requested)) {
    hash = Math.imul(hash ^ ch.charCodeAt(0), 16777619);
  }
  const id = 'bio-makeup-' + String(instance ?? 'default').replace(/[^a-z0-9_-]/gi, '-') + '-' + (hash >>> 0).toString(36);
  const mask = (key, ink, base = `<rect ${bounds} fill="white"/>`) =>
    `<mask id="${key}" maskUnits="userSpaceOnUse" ${bounds} style="mask-type:luminance">${base}${ink}</mask>`;
  const family = (key, stencil, ink) => `<g data-makeup-family="${key}" mask="url(#${id}-${stencil})">${ink}</g>`;
  const base = openings + nostrils;
  const skin = base + lipReserve + reserve.lips.join('') + contour + brows;
  return `<g data-bio-makeup="" pointer-events="none"><defs>${mask(id + '-base', base, border)}${mask(id + '-skin', skin, border)}
    ${mask(id + '-eye', base + contour + brows, border)}</defs>
    ${effective.blush ? family('blush', 'skin', drawBlush(effective.blush, requested.blush, id)) : ''}
    ${effective.paint?.some(Boolean) ? family('paint', 'skin', drawPaint(requested.paint.elements, effective.paint)) : ''}
    ${effective.shadow ? family('shadow', 'eye', drawShadow(geometry.eyes, requested.shadow, id, bounds)) : ''}
    ${effective.liner ? family('liner', 'eye', drawLiner(geometry.eyes, requested.liner)) : ''}
    ${drawLips(result, id, mask)}</g>`;
}
