import {character} from './render.mjs';

export const r02RenderVersion = 'bio-corps-06-r02-svg@1';
export const workshopRenderVersion = 'bio-corps-06-r02-svg@1/historical-eyes';
const frames = {head: '-30 -65 220 225', tile: '-40 -85 240 355', mini: '-35 -68 230 245'};

export function renderView(input, {view = 'head', frame = frames[view], ...options}) {
  return character(input, {...options, headOnly: view !== 'tile', smallScale: view === 'mini'})
    .replace(/viewBox="[^"]*"/, `viewBox="${frame}"`);
}
