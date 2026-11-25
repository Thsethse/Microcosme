import {buildPagesPreview, makeupEntries} from './build-pages-preview.mjs';

const [output, pagesRef = 'origin/main', sourceRef = 'HEAD'] = process.argv.slice(2);
buildPagesPreview({
  output, pagesRef, sourceRef,
  entries: [...makeupEntries, 'eye-contour-study.mjs', 'adult-body.mjs', 'body-study.mjs'],
  mission: 'BIO-CORPS-01', contractCommit: '1bc0a6f83e356b07194a106be65d17f29e051f00',
  baseline: 'preview/bio-yeux-r01/', baselineCommit: '2535479ecc812f4cb3d20129ec064b4b3d18eb4a',
  transformHTML: html => html
    .replace('BIO-MAQUILLAGE-01 · Maquillage et peintures faciales', 'BIO-CORPS-01 · Bases anatomiques adultes')
    .replace('<span>BIO-MAQUILLAGE-01</span>', '<span>BIO-CORPS-01</span>')
    .replace('<h1>Maquillage et peintures faciales</h1>', '<h1>Bases anatomiques adultes</h1>')
    .replace('id="atelier" aria-label=', 'id="atelier" data-natural-eyes aria-label=')
    .replace('/blob/codex/bio-cicatrices-01/docs/ai/bio-cicatrices-01/RAPPORT.md',
      '/blob/codex/bio-corps-01/docs/ai/bio-corps-01/RAPPORT.md')
});
