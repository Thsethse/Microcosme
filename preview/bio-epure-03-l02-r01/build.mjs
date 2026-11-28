import {readFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {buildAdultPreview} from '../bio-socle-02-r01/build.mjs';

const spaces = readFileSync(new URL('../bio-epure-03-l01-r01/spaces.html', import.meta.url), 'utf8')
  .replace('<template id="editor-spaces">', '<template id="editor-spaces" data-command-layout>');
const lot02Report = 'https://github.com/Thsethse/Microcosme/blob/codex/bio-epure-03-l02-r01/docs/ai/bio-epure-03/l02/RAPPORT.md';

export function buildCommandPreview(output, {
  mission = 'BIO-EPURE-03-L02-R01',
  proceduralFace = false,
  report = lot02Report,
  reportLabel = 'Rapport du lot 02 et recette iPad'
} = {}) {
  const template = proceduralFace
    ? spaces.replace('data-command-layout>', 'data-command-layout data-procedural-face>')
    : spaces;
  buildAdultPreview(output, {
    mission,
    adaptHTML: html => html
      .replace('<title>Microcosme · BIO-SOCLE-02-R02 · Recette du socle adulte</title>', '<title>Microcosme · Atelier adulte</title>')
      .replace('<span>BIO-SOCLE-02-R02</span>', `<span>${mission}</span>`)
      .replace('<h1>Recette du socle adulte</h1>', '<h1>Atelier adulte</h1>')
      .replace('</main>', template + '</main>')
      .replace(/<footer>.*?<\/footer>/, `<footer><a href="${report}">${reportLabel}</a></footer>`)
  });
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  buildCommandPreview(process.argv[2] && resolve(process.argv[2]));
}
