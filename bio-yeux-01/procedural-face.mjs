import {historicalBrowAnchor} from './brow-height-control.mjs';
import {normalizeBrows} from './brows.mjs';
import {normalizeEyes} from './eyes.mjs';
import {normalizeMouth} from './mouth.mjs';
import {normalizeNose} from './nose.mjs';

// Only at creation, before edits or restoration. A future resident creator
// can use these face requests, with nose and mouth present from the start.
export function initialProceduralFace() {
  return {
    eyes: normalizeEyes('round'),
    brows: normalizeBrows({height: historicalBrowAnchor}),
    nose: normalizeNose({}),
    mouth: normalizeMouth({})
  };
}
