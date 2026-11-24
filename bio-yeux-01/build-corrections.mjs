import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import {mkdirSync, writeFileSync} from 'node:fs';
import {isAbsolute, join} from 'node:path';
import {fileURLToPath} from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const [output, pagesRef = 'origin/main'] = process.argv.slice(2);
assert(output && isAbsolute(output), 'Usage: node bio-yeux-01/build-corrections.mjs /répertoire/absolu [révision-Pages]');
const git = (...args) => execFileSync('git', args, {cwd: root, maxBuffer: 32 * 1024 * 1024});
const revision = ref => git('rev-parse', '--verify', ref + '^{commit}').toString().trim();
const hash = bytes => createHash('sha256').update(bytes).digest('hex');
const codeCommit = revision('HEAD'), pagesCommit = revision(pagesRef);
const baseline = 'preview/bio-yeux-01/';
const previousVersion = git('show', pagesCommit + ':' + baseline + 'version.json');
const previous = JSON.parse(previousVersion);
assert.equal(previous.codeCommit, '13c57a9e7424bef1fe92b71dd4c036072050f050');
const inherited = [...previous.inherited,
  ...previous.files.map(({path, sha256}) => ({path: baseline + path, sha256})),
  {path: baseline + 'version.json', sha256: hash(previousVersion)}
];
for (const {path, sha256} of inherited) assert.equal(hash(git('show', pagesCommit + ':' + path)), sha256, path);

mkdirSync(output, {recursive: true});
const entries = ['index.html', 'style.css', 'app.mjs', 'render.mjs', 'eyes.mjs', 'bezier.mjs',
  'appearance.mjs', 'draw.mjs', 'eye-domain.mjs', 'availability.mjs', 'catalogue.mjs'];
const files = entries.map(path => {
  const source = git('show', codeCommit + ':bio-yeux-01/' + path).toString();
  const data = source.replaceAll('../preview/bio-vis-', '../bio-vis-');
  writeFileSync(join(output, path), data);
  return {path, sha256: hash(data)};
});
const version = {mission: 'BIO-INV-01 A/B/C', codeCommit, pagesBaseline: pagesCommit,
  contractCommit: '52293e9', files, inherited};
writeFileSync(join(output, 'version.json'), JSON.stringify(version, null, 2) + '\n');
console.log(`${files.length + 1} fichiers pour ${codeCommit}. ${inherited.length} dépendances Pages vérifiées.`);
