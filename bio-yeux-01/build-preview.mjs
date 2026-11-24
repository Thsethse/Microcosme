import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import {mkdirSync, writeFileSync} from 'node:fs';
import {isAbsolute, join} from 'node:path';
import {fileURLToPath} from 'node:url';

const repository = fileURLToPath(new URL('..', import.meta.url));
const [output, pagesRef = 'origin/main'] = process.argv.slice(2);
assert(output && isAbsolute(output), 'Usage: node bio-yeux-01/build-preview.mjs /répertoire/absolu [révision-Pages]');
const git = (...args) => execFileSync('git', args, {cwd: repository, maxBuffer: 32 * 1024 * 1024});
const revision = ref => git('rev-parse', '--verify', ref + '^{commit}').toString().trim();
const hash = data => createHash('sha256').update(data).digest('hex');
const codeCommit = revision('HEAD');
const pagesCommit = revision(pagesRef);
const website = 'preview/bio-col-01/';
const paletteVersion = JSON.parse(git('show', pagesCommit + ':' + website + 'version.json'));
const frozen = JSON.parse(git('show', codeCommit + ':bio-col-01/tests/frozen-manifest.json'));

const inherited = [
  ...frozen,
  ...paletteVersion.files.map(({path, sha256}) => ({path: website + path, sha256})),
  {path: website + 'version.json', sha256: hash(git('show', pagesCommit + ':' + website + 'version.json'))}
];
for (const {path, sha256} of inherited) {
  assert.equal(hash(git('show', pagesCommit + ':' + path)), sha256, path);
}
for (const {path, sha256} of frozen) {
  assert.equal(hash(git('show', codeCommit + ':' + path)), sha256, path);
}

// Existing palette modules use the same imports relative to the published preview.
for (const {path, sha256} of paletteVersion.files) {
  const source = git('show', codeCommit + ':bio-col-01/' + path).toString();
  assert.equal(hash(source.replaceAll('../preview/bio-vis-', '../bio-vis-')), sha256, path);
}

mkdirSync(output, {recursive: true});
const files = ['index.html', 'style.css', 'app.mjs', 'render.mjs', 'eyes.mjs', 'bezier.mjs'].map(path => {
  const source = git('show', codeCommit + ':bio-yeux-01/' + path).toString();
  const data = source.replaceAll('../preview/bio-vis-', '../bio-vis-');
  writeFileSync(join(output, path), data);
  return {path, sha256: hash(data)};
});
const version = {
  mission: 'BIO-YEUX-01',
  codeCommit,
  pagesBaseline: pagesCommit,
  contractCommit: '1e233664a046b0421f6c5d0269c39cf5e182fe7c',
  files,
  inherited
};
writeFileSync(join(output, 'version.json'), JSON.stringify(version, null, 2) + '\n');
console.log(`${files.length + 1} fichiers pour ${codeCommit}, ${inherited.length} dépendances Pages vérifiées.`);
