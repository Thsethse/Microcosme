import {buildPagesPreview, makeupEntries} from './build-pages-preview.mjs';

const [output, pagesRef = 'origin/main', sourceRef = 'HEAD'] = process.argv.slice(2);
buildPagesPreview({
  output, pagesRef, sourceRef,
  entries: [...makeupEntries, 'eye-contour-study.mjs', 'adult-body.mjs', 'body-study.mjs', 'body-structure.mjs',
    'structure-study.mjs', 'body-corpulence.mjs', 'corpulence-study.mjs', 'chest.mjs', 'chest-study.mjs', 'chest-before.mjs'],
  mission: 'BIO-CORPS-04-A-R01', contractCommit: '006f56f8900dc71763d1ccc4f4dc2ffca5bd626a',
  baseline: 'preview/bio-corps-04-a/', baselineCommit: 'c24b5b0dc93d3d650c91bd05726e0de9bff491a8',
  transformHTML: html => html
    .replace('BIO-MAQUILLAGE-01 · Maquillage et peintures faciales', 'BIO-CORPS-04-A-R01 · Poitrine féminine adulte')
    .replace('<span>BIO-MAQUILLAGE-01</span>', '<span>BIO-CORPS-04-A-R01</span>')
    .replace('<h1>Maquillage et peintures faciales</h1>', '<h1>Poitrine féminine adulte</h1>')
    .replace('id="atelier" aria-label=', 'id="atelier" data-natural-eyes aria-label=')
    .replace(/<footer>.*?<\/footer>/, '<footer><a href="https://github.com/Thsethse/Microcosme/blob/codex/bio-corps-04-a-r01/docs/ai/bio-corps-04-a-r01/RAPPORT.md">Rapport de correction</a></footer>')
});
