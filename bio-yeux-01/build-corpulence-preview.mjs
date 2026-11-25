import {buildPagesPreview, makeupEntries} from './build-pages-preview.mjs';

const [output, pagesRef = 'origin/main', sourceRef = 'HEAD'] = process.argv.slice(2);
buildPagesPreview({
  output, pagesRef, sourceRef,
  entries: [...makeupEntries, 'eye-contour-study.mjs', 'adult-body.mjs', 'body-study.mjs', 'body-structure.mjs',
    'structure-study.mjs', 'body-corpulence.mjs', 'corpulence-study.mjs'],
  mission: 'BIO-CORPS-03', contractCommit: 'd094efc31172f93ea54e604846b9f0815e6bf11b',
  baseline: 'preview/bio-corps-02/', baselineCommit: 'c6906c120c78cea8438f3713753be46e9a26ed70',
  transformHTML: html => html
    .replace('BIO-MAQUILLAGE-01 · Maquillage et peintures faciales', 'BIO-CORPS-03 · Corpulence des habitants')
    .replace('<span>BIO-MAQUILLAGE-01</span>', '<span>BIO-CORPS-03</span>')
    .replace('<h1>Maquillage et peintures faciales</h1>', '<h1>Corpulence des habitants</h1>')
    .replace('id="atelier" aria-label=', 'id="atelier" data-natural-eyes aria-label=')
    .replace('/blob/codex/bio-cicatrices-01/docs/ai/bio-cicatrices-01/RAPPORT.md',
      '/blob/codex/bio-corps-03/docs/ai/bio-corps-03/RAPPORT.md')
});
