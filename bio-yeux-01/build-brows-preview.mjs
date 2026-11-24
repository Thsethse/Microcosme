import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import {mkdirSync, writeFileSync} from 'node:fs';
import {isAbsolute, join} from 'node:path';
import {fileURLToPath} from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const [output, pagesRef = 'origin/main'] = process.argv.slice(2);
assert(output && isAbsolute(output), 'Usage: node bio-yeux-01/build-brows-preview.mjs /répertoire/absolu [révision-Pages]');
const git = (...args) => execFileSync('git', args, {cwd: root, maxBuffer: 32 * 1024 * 1024});
const revision = ref => git('rev-parse', '--verify', ref + '^{commit}').toString().trim();
const hash = bytes => createHash('sha256').update(bytes).digest('hex');
const codeCommit = revision('HEAD'), pagesCommit = revision(pagesRef);
const baseline = 'preview/bio-yeux-03/';
const previousVersion = git('show', pagesCommit + ':' + baseline + 'version.json');
const previous = JSON.parse(previousVersion);
assert.equal(previous.codeCommit, 'd17a21757ffee651154534e6c081656f873ecf1a');
const inherited = [...previous.inherited,
  ...previous.files.map(({path, sha256}) => ({path: baseline + path, sha256})),
  {path: baseline + 'version.json', sha256: hash(previousVersion)}
];
for (const {path, sha256} of inherited) assert.equal(hash(git('show', pagesCommit + ':' + path)), sha256, path);

mkdirSync(output, {recursive: true});
const entries = ['index.html', 'style.css', 'app.mjs', 'render.mjs', 'eyes.mjs', 'bezier.mjs',
  'appearance.mjs', 'draw.mjs', 'eye-domain.mjs', 'availability.mjs', 'catalogue.mjs', 'iris.mjs', 'iris-editor.mjs', 'details.mjs', 'details-editor.mjs', 'brows.mjs', 'brows-editor.mjs'];
const files = entries.map(path => {
  const source = git('show', codeCommit + ':bio-yeux-01/' + path).toString();
  const data = source.replaceAll('../preview/bio-vis-', '../bio-vis-');
  writeFileSync(join(output, path), data);
  return {path, sha256: hash(data)};
});
const version = {mission: 'BIO-SOURCILS-01', codeCommit, pagesBaseline: pagesCommit,
  contractCommit: '7a9d7e2', files, inherited};
writeFileSync(join(output, 'version.json'), JSON.stringify(version, null, 2) + '\n');
console.log(`${files.length + 1} fichiers pour ${codeCommit}. ${inherited.length} dépendances Pages vérifiées.`);
