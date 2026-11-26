import {buildPagesPreview, makeupEntries} from './build-pages-preview.mjs';

const [output, pagesRef = 'origin/main', sourceRef = 'HEAD'] = process.argv.slice(2);
buildPagesPreview({
  output, pagesRef, sourceRef,
  entries: [...makeupEntries, 'eye-contour-study.mjs', 'adult-body.mjs', 'body-study.mjs', 'body-structure.mjs',
    'structure-study.mjs', 'body-corpulence.mjs', 'corpulence-study.mjs', 'chest.mjs', 'chest-study.mjs', 'chest-before.mjs', 'chest-r01.mjs', 'pectorals.mjs', 'pectorals-study.mjs', 'thorax-details.mjs', 'thorax-details-study.mjs', 'body-bone-reliefs.mjs', 'bone-relief-study.mjs', 'abdominals.mjs', 'abdominal-study.mjs', 'belly-details.mjs', 'belly-detail-study.mjs', 'belly-details-before.mjs'],
  mission: 'BIO-CORPS-05-C-R01', contractCommit: 'c59ddeba0899403c6dc3e4ceae63cd8ae1d6ba81',
  baseline: 'preview/bio-corps-05-c/', baselineCommit: '2d9fa49c8c381ccb37878e720f68f28374a60599',
  transformHTML: html => html
    .replace('BIO-MAQUILLAGE-01 · Maquillage et peintures faciales', 'BIO-CORPS-05-C-R01 · Reliefs abdominaux et pelviens')
    .replace('<span>BIO-MAQUILLAGE-01</span>', '<span>BIO-CORPS-05-C-R01</span>')
    .replace('<h1>Maquillage et peintures faciales</h1>', '<h1>Reliefs abdominaux et pelviens</h1>')
    .replace('id="atelier" aria-label=', 'id="atelier" data-natural-eyes aria-label=')
    .replace(/<footer>.*?<\/footer>/, '<footer><a href="https://github.com/Thsethse/Microcosme/blob/codex/bio-corps-05-c-r01/docs/ai/bio-corps-05-c-r01/RAPPORT.md">Rapport d’implémentation</a></footer>')
});
