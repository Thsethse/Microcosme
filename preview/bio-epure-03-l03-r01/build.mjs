import {execFileSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import {mkdirSync, readFileSync, writeFileSync} from 'node:fs';
import {join} from 'node:path';
import {fileURLToPath} from 'node:url';
import {buildSync} from 'esbuild';

const output = process.argv[2];
if (!output) throw new Error('Indiquer le dossier de sortie de la planche.');
const here = new URL('./', import.meta.url);
const sha = content => createHash('sha256').update(content).digest('hex');
const sourceCommit = execFileSync('git', ['rev-parse', 'HEAD'], {cwd: here, encoding: 'utf8'}).trim();
const bundle = buildSync({
  entryPoints: [fileURLToPath(new URL('app.mjs', here))],
  bundle: true, write: false, format: 'iife', minify: true, target: 'safari15.4'
}).outputFiles[0].contents;
const startup = `study-${sha(bundle).slice(0, 16)}.js`;
const html = readFileSync(new URL('index.html', here), 'utf8')
  .replace('type="module" src="app.mjs"', `defer src="${startup}"`);
const contents = {'index.html': html, 'style.css': readFileSync(new URL('style.css', here)), [startup]: bundle};
const files = Object.fromEntries(Object.entries(contents).map(([file, data]) => [file, sha(data)]));
mkdirSync(output, {recursive: true});
for (const [file, data] of Object.entries(contents)) writeFileSync(join(output, file), data);
writeFileSync(join(output, 'version.json'), JSON.stringify({
  mission: 'BIO-EPURE-03-L03-R01', sourceCommit, startup, files
}, null, 2) + '\n');
