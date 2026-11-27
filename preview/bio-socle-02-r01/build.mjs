import {execFileSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import {mkdirSync, readFileSync, writeFileSync} from 'node:fs';
import {join, resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {buildSync} from 'esbuild';

const root = fileURLToPath(new URL('../..', import.meta.url));
const directory = fileURLToPath(new URL('.', import.meta.url));
const output = process.argv[2] && resolve(process.argv[2]);
if (!output) throw new Error('Indiquez le répertoire de sortie.');

const entry = '<script id="atelier-entry" type="module" src="app.mjs"></script>';
const html = readFileSync(join(root, 'bio-yeux-01/index.html'), 'utf8');
if (!html.includes(entry)) throw new Error('Point d’entrée de l’atelier introuvable.');
const panel = readFileSync(join(directory, 'resident-panel.html'), 'utf8');

const bundle = buildSync({
  absWorkingDir: root, entryPoints: ['bio-yeux-01/app.mjs'], bundle: true, write: false,
  platform: 'browser', format: 'iife', target: 'safari15.4'
}).outputFiles[0].contents;
const hash = value => createHash('sha256').update(value).digest('hex');
const startup = `atelier-${hash(bundle).slice(0, 16)}.js`;
const files = {
  [startup]: bundle,
  'style.css': readFileSync(join(root, 'bio-yeux-01/style.css')),
  'index.html': html
    .replace('BIO-MAQUILLAGE-01 · Maquillage et peintures faciales', 'BIO-SOCLE-02-R01 · Recette du socle adulte')
    .replace('<span>BIO-MAQUILLAGE-01</span>', '<span>BIO-SOCLE-02-R01</span>')
    .replace('<h1>Maquillage et peintures faciales</h1>', '<h1>Recette du socle adulte</h1>')
    .replace('<nav aria-label="Navigation dans l’atelier">', `<nav aria-label="Navigation dans l’atelier">
    <a id="workshop-archive-link" href="#appearance-panel">Archive H/F</a>
    <a href="#resident-preview">Habitants témoins</a>`)
    .replace('id="atelier" aria-label=', 'id="atelier" data-natural-eyes aria-label=')
    .replace('<main class="shell">', '<main class="shell">\n' + panel)
    .replace(/<footer>.*?<\/footer>/, '<footer><a href="https://github.com/Thsethse/Microcosme/blob/codex/bio-socle-02-r01/docs/ai/bio-socle-02-r01/RAPPORT.md">Rapport de validation</a></footer>')
    .replace(entry, `<script id="atelier-entry" src="${startup}" defer></script>`)
};
const sourceCommit = execFileSync('git', ['rev-parse', 'HEAD'], {cwd: root, encoding: 'utf8'}).trim();
mkdirSync(output, {recursive: true});
for (const [name, content] of Object.entries(files)) writeFileSync(join(output, name), content);
writeFileSync(join(output, 'version.json'), JSON.stringify({
  mission: 'BIO-SOCLE-02-R01',
  sourceCommit,
  artisticReference: 'c18aa4d54873f19186d6c1af7e17aa22e566dda1',
  startup,
  files: Object.entries(files).map(([path, content]) => ({path, sha256: hash(content)}))
}, null, 2) + '\n');
