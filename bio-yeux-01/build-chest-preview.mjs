import {buildPagesPreview, makeupEntries} from './build-pages-preview.mjs';

const [output, pagesRef = 'origin/main', sourceRef = 'HEAD'] = process.argv.slice(2);
buildPagesPreview({
  output, pagesRef, sourceRef,
  entries: [...makeupEntries, 'eye-contour-study.mjs', 'adult-body.mjs', 'body-study.mjs', 'body-structure.mjs',
    'structure-study.mjs', 'body-corpulence.mjs', 'corpulence-study.mjs', 'chest.mjs', 'chest-study.mjs'],
  mission: 'BIO-CORPS-04-A', contractCommit: '54697be356804dc7b1518a58d5d479eec0e08c10',
  baseline: 'preview/bio-corps-03-r01/', baselineCommit: '34acdc6078d9189f596a8efce49aa319a9b05f9e',
  transformHTML: html => html
    .replace('BIO-MAQUILLAGE-01 · Maquillage et peintures faciales', 'BIO-CORPS-04-A · Poitrine féminine adulte')
    .replace('<span>BIO-MAQUILLAGE-01</span>', '<span>BIO-CORPS-04-A</span>')
    .replace('<h1>Maquillage et peintures faciales</h1>', '<h1>Poitrine féminine adulte</h1>')
    .replace('id="atelier" aria-label=', 'id="atelier" data-natural-eyes aria-label=')
    .replace(/<footer>.*?<\/footer>/, '<footer><a href="https://github.com/Thsethse/Microcosme/blob/codex/bio-corps-04-a/docs/ai/bio-corps-04-a/RAPPORT.md">Rapport d’implémentation</a></footer>')
});
