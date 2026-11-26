import {buildPagesPreview, makeupEntries} from './build-pages-preview.mjs';

const [output, pagesRef = 'origin/main', sourceRef = 'HEAD'] = process.argv.slice(2);
buildPagesPreview({
  output, pagesRef, sourceRef,
  entries: [...makeupEntries, 'eye-contour-study.mjs', 'adult-body.mjs', 'body-study.mjs', 'body-structure.mjs',
    'structure-study.mjs', 'body-corpulence.mjs', 'corpulence-study.mjs', 'chest.mjs', 'chest-study.mjs', 'chest-before.mjs', 'chest-r01.mjs', 'pectorals.mjs', 'pectorals-study.mjs', 'thorax-details.mjs', 'thorax-details-study.mjs', 'body-bone-reliefs.mjs', 'bone-relief-study.mjs', 'abdominals.mjs', 'abdominal-study.mjs', 'belly-details.mjs', 'belly-detail-study.mjs', 'belly-details-before.mjs'],
  mission: 'BIO-CORPS-05-C-R02', contractCommit: '4b08202a720ca8f39ed2a10892e6edd3bb77e975',
  baseline: 'preview/bio-corps-05-c-r01/', baselineCommit: '7fc4ab1a40eaee3659fdc383f6186e28bf408341',
  transformHTML: html => html
    .replace('BIO-MAQUILLAGE-01 · Maquillage et peintures faciales', 'BIO-CORPS-05-C-R02 · Reliefs abdominaux et pelviens')
    .replace('<span>BIO-MAQUILLAGE-01</span>', '<span>BIO-CORPS-05-C-R02</span>')
    .replace('<h1>Maquillage et peintures faciales</h1>', '<h1>Reliefs abdominaux et pelviens</h1>')
    .replace('id="atelier" aria-label=', 'id="atelier" data-natural-eyes aria-label=')
    .replace(/<footer>.*?<\/footer>/, '<footer><a href="https://github.com/Thsethse/Microcosme/blob/codex/bio-corps-05-c-r02/docs/ai/bio-corps-05-c-r02/RAPPORT.md">Rapport d’implémentation</a></footer>')
});
