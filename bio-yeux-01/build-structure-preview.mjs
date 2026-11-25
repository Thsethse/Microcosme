import {buildPagesPreview, makeupEntries} from './build-pages-preview.mjs';

const [output, pagesRef = 'origin/main', sourceRef = 'HEAD'] = process.argv.slice(2);
buildPagesPreview({
  output, pagesRef, sourceRef,
  entries: [...makeupEntries, 'eye-contour-study.mjs', 'adult-body.mjs', 'body-study.mjs', 'body-structure.mjs', 'structure-study.mjs'],
  mission: 'BIO-CORPS-02', contractCommit: 'c2cc4d3c1e93c9e42fc75f326d9ebb11ac600739',
  baseline: 'preview/bio-corps-01/', baselineCommit: '7c756a9dab6b1fa21779cd247c5494c80a5e094c',
  transformHTML: html => html
    .replace('BIO-MAQUILLAGE-01 · Maquillage et peintures faciales', 'BIO-CORPS-02 · Ossature des habitants')
    .replace('<span>BIO-MAQUILLAGE-01</span>', '<span>BIO-CORPS-02</span>')
    .replace('<h1>Maquillage et peintures faciales</h1>', '<h1>Ossature des habitants</h1>')
    .replace('id="atelier" aria-label=', 'id="atelier" data-natural-eyes aria-label=')
    .replace('/blob/codex/bio-cicatrices-01/docs/ai/bio-cicatrices-01/RAPPORT.md',
      '/blob/codex/bio-corps-02/docs/ai/bio-corps-02/RAPPORT.md')
});
