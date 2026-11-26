import {buildPagesPreview, makeupEntries} from './build-pages-preview.mjs';

const [output, pagesRef = 'origin/main', sourceRef = 'HEAD'] = process.argv.slice(2);
buildPagesPreview({
  output, pagesRef, sourceRef,
  entries: [...makeupEntries, 'eye-contour-study.mjs', 'adult-body.mjs', 'body-study.mjs', 'body-structure.mjs',
    'structure-study.mjs', 'body-corpulence.mjs', 'corpulence-study.mjs', 'chest.mjs', 'chest-study.mjs', 'chest-before.mjs', 'chest-r01.mjs'],
  mission: 'BIO-CORPS-04-A-R02', contractCommit: 'b5eb1793155f1516a9d7b817906d0541a2332ffc',
  baseline: 'preview/bio-corps-04-a-r01/', baselineCommit: 'be9df82007cd38dba02bac87d4a781b12a95b429',
  transformHTML: html => html
    .replace('BIO-MAQUILLAGE-01 · Maquillage et peintures faciales', 'BIO-CORPS-04-A-R02 · Poitrine féminine adulte')
    .replace('<span>BIO-MAQUILLAGE-01</span>', '<span>BIO-CORPS-04-A-R02</span>')
    .replace('<h1>Maquillage et peintures faciales</h1>', '<h1>Poitrine féminine adulte</h1>')
    .replace('id="atelier" aria-label=', 'id="atelier" data-natural-eyes aria-label=')
    .replace(/<footer>.*?<\/footer>/, '<footer><a href="https://github.com/Thsethse/Microcosme/blob/codex/bio-corps-04-a-r02/docs/ai/bio-corps-04-a-r02/RAPPORT.md">Rapport de correction</a></footer>')
});
