import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import {mkdirSync, mkdtempSync, rmSync, writeFileSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {isAbsolute, join} from 'node:path';
import {fileURLToPath} from 'node:url';
import {buildSync} from 'esbuild';

const root = fileURLToPath(new URL('..', import.meta.url));
const git = (...args) => execFileSync('git', args, {cwd: root, maxBuffer: 32 * 1024 * 1024});
const revision = ref => git('rev-parse', '--verify', ref + '^{commit}').toString().trim();
const hash = bytes => createHash('sha256').update(bytes).digest('hex');

export function buildPagesPreview({
  output, pagesRef, sourceRef, baseline, baselineCommit, mission, contractCommit, entries, transformHTML = html => html
}) {
  assert(output && isAbsolute(output), 'Indiquez un répertoire de sortie absolu.');
  const codeCommit = revision(sourceRef), pagesCommit = revision(pagesRef);
  const previousVersion = git('show', pagesCommit + ':' + baseline + 'version.json');
  const previous = JSON.parse(previousVersion);
  assert.equal(previous.codeCommit, baselineCommit);
  const inherited = [...previous.inherited,
    ...previous.files.map(({path, sha256}) => ({path: baseline + path, sha256})),
    {path: baseline + 'version.json', sha256: hash(previousVersion)}
  ];
  for (const {path, sha256} of inherited) assert.equal(hash(git('show', pagesCommit + ':' + path)), sha256, path);

  // Read the editor from one committed tree and make the cold start use one
  // content-addressed script, as in BIO-CICATRICES-01-R1.
  const sourceTree = mkdtempSync(join(tmpdir(), 'microcosme-pages-'));
  const sharedModules = inherited.map(({path}) => path).filter(path => /^preview\/bio-vis-.*\.mjs$/.test(path));
  let bundle;
  try {
    execFileSync('tar', ['-x', '-C', sourceTree], {input:
      git('archive', codeCommit, 'bio-yeux-01', 'bio-col-01', ...new Set(sharedModules))});
    const {outputFiles} = buildSync({
      absWorkingDir: sourceTree,
      entryPoints: ['bio-yeux-01/app.mjs'],
      bundle: true,
      write: false,
      platform: 'browser',
      format: 'iife',
      target: 'safari15.4'
    });
    bundle = outputFiles[0].contents;
  } finally {
    rmSync(sourceTree, {recursive: true, force: true});
  }
  const digest = hash(bundle);
  const startup = {path: `atelier-${digest.slice(0, 16)}.js`, sha256: digest};

  mkdirSync(output, {recursive: true});
  const files = entries.map(path => {
    const source = git('show', codeCommit + ':bio-yeux-01/' + path).toString();
    const portable = source.replaceAll('../preview/bio-vis-', '../bio-vis-');
    const entry = '<script id="atelier-entry" type="module" src="app.mjs"></script>';
    if (path === 'index.html') assert(portable.includes(entry), 'Point d’entrée de l’atelier introuvable.');
    const data = path === 'index.html' ?
      transformHTML(portable.replace(entry, `<script id="atelier-entry" src="${startup.path}" defer></script>`)) : portable;
    writeFileSync(join(output, path), data);
    return {path, sha256: hash(data)};
  });
  writeFileSync(join(output, startup.path), bundle);
  files.push(startup);
  const version = {mission, codeCommit, pagesBaseline: pagesCommit, startup: startup.path, contractCommit, files, inherited};
  writeFileSync(join(output, 'version.json'), JSON.stringify(version, null, 2) + '\n');
  console.log(`${files.length + 1} fichiers pour ${codeCommit}. ${inherited.length} dépendances Pages vérifiées.`);
}

export const scarEntries = ['index.html', 'style.css', 'app.mjs', 'render.mjs', 'eyes.mjs', 'bezier.mjs',
  'appearance.mjs', 'draw.mjs', 'eye-domain.mjs', 'availability.mjs', 'catalogue.mjs', 'iris.mjs', 'iris-editor.mjs',
  'details.mjs', 'details-editor.mjs', 'brows.mjs', 'brows-editor.mjs', 'mouth.mjs', 'mouth-editor.mjs',
  'nose.mjs', 'nose-editor.mjs', 'beard.mjs', 'beard-editor.mjs', 'surface.mjs', 'marks.mjs', 'marks-editor.mjs',
  'marks-study.mjs', 'scars.mjs', 'scars-editor.mjs', 'scars-study.mjs'];

export const makeupEntries = [...scarEntries, 'makeup.mjs', 'makeup-render.mjs', 'makeup-editor.mjs', 'makeup-study.mjs'];
