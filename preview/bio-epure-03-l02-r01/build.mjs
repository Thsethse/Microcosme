import {readFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {buildAdultPreview} from '../bio-socle-02-r01/build.mjs';

const mission = 'BIO-EPURE-03-L02-R01';
const spaces = readFileSync(new URL('../bio-epure-03-l01-r01/spaces.html', import.meta.url), 'utf8')
  .replace('<template id="editor-spaces">', '<template id="editor-spaces" data-command-layout>');
const report = 'https://github.com/Thsethse/Microcosme/blob/codex/bio-epure-03-l02-r01/docs/ai/bio-epure-03/l02/RAPPORT.md';

buildAdultPreview(process.argv[2] && resolve(process.argv[2]), {
  mission,
  adaptHTML: html => html
    .replace('<title>Microcosme · BIO-SOCLE-02-R02 · Recette du socle adulte</title>', '<title>Microcosme · Atelier adulte</title>')
    .replace('<span>BIO-SOCLE-02-R02</span>', `<span>${mission}</span>`)
    .replace('<h1>Recette du socle adulte</h1>', '<h1>Atelier adulte</h1>')
    .replace('</main>', spaces + '</main>')
    .replace(/<footer>.*?<\/footer>/, `<footer><a href="${report}">Rapport du lot 02 et recette iPad</a></footer>`)
});
