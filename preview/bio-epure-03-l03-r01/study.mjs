import {browMarkup, solveBrows} from '../../bio-yeux-01/brows.mjs';
import {eyesFor} from '../../bio-yeux-01/eyes.mjs';
import {renderView} from '../../bio-yeux-01/render-profile.mjs';
import {model} from '../bio-vis-p5-i6/model.mjs';

export const historicalLevels = [0, 6, 25, 50, 75, 100];
export const proposedLevels = [0, 25, 50, 75, 100];
export const middleHistorical = 6;

// The existing travel is 20% of the head's vertical radius. One quarter
// of that travel is the experimental maximum rise above the 6% anchor.
export const upwardCap = 25;

export function prepareStudy(scenario) {
  const face = model(scenario.input);
  const opening = eyesFor(scenario.input, scenario.eyes);
  const request = height => ({...scenario.brows, height});
  const solve = height => solveBrows(face, opening, request(height), scenario.colours);
  const low = solve(0), centre = solve(middleHistorical), high = solve(100);
  const min = low.effective.height, anchor = centre.effective.height, max = high.effective.height;
  const limit = anchor === null ? null : Math.min(max, anchor + upwardCap);

  function carrier(level) {
    if (!Number.isFinite(level) || level < 0 || level > 100) throw new RangeError('Hauteur proposée entre 0 et 100 requise.');
    if (level === 50 || anchor === null) return middleHistorical;
    return level < 50 ? min + (anchor - min) * (level / 50) :
      anchor + (limit - anchor) * ((level - 50) / 50);
  }

  const {cx, cy, rx, ry} = face.base.head;
  const frame = centre.frame;
  const eyeBottom = Math.max(...opening.face.envelopes.map(eye => eye.bottom));
  const crops = {
    close: frame ? [cx - frame.halfWidth - 5, frame.top - 3, 2 * frame.halfWidth + 10, eyeBottom - frame.top + 7].join(' ') :
      [cx - rx, cy - ry / 2, 2 * rx, ry].join(' '),
    face: [cx - rx - 19, cy - ry - 17, 2 * rx + 38, 2 * ry + 24].join(' ')
  };

  function picture(height, crop, instance) {
    return renderView(scenario.input, {
      view: 'head', frame: crops[crop], instance, naturalEyes: true,
      eyes: scenario.eyes, brows: request(height), ...scenario.colours
    });
  }

  return {
    frame, min, anchor, max, limit, centre, solve, carrier, picture,
    descent: frame ? (anchor - min) * frame.travel / 100 : 0,
    rise: frame ? (limit - anchor) * frame.travel / 100 : 0,
    formerRise: frame ? (max - anchor) * frame.travel / 100 : 0
  };
}

// These are the vertices actually sent to the SVG renderer, rounded by the
// production brow markup to six decimal places.
export function inkPoints(result) {
  return [...browMarkup(result).matchAll(/(-?[\d.]+),(-?[\d.]+)/g)]
    .map(([, x, y]) => [Number(x), Number(y)]);
}
