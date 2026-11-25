import {buildPagesPreview, makeupEntries} from './build-pages-preview.mjs';

const [output, pagesRef = 'origin/main', sourceRef = 'HEAD'] = process.argv.slice(2);
buildPagesPreview({
  output, pagesRef, sourceRef,
  entries: [...makeupEntries, 'eye-contour-study.mjs'],
  mission: 'BIO-YEUX-R01', contractCommit: '70e4f27',
  baseline: 'preview/bio-maquillage-01/', baselineCommit: '70ed8ae4b8ec6ebbc16b9fd761147df2fca88a67',
  transformHTML: html => html
    .replace('BIO-MAQUILLAGE-01 · Maquillage et peintures faciales', 'BIO-YEUX-R01 · Contour naturel des yeux')
    .replace('<span>BIO-MAQUILLAGE-01</span>', '<span>BIO-YEUX-R01</span>')
    .replace('<h1>Maquillage et peintures faciales</h1>', '<h1>Contour naturel des yeux</h1>')
    .replace('id="atelier" aria-label=', 'id="atelier" data-natural-eyes aria-label=')
});
