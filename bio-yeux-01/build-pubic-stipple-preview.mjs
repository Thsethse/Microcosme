import {buildPagesPreview, makeupEntries} from './build-pages-preview.mjs';

const [output, pagesRef = 'origin/main', sourceRef = 'HEAD'] = process.argv.slice(2);
buildPagesPreview({
  output, pagesRef, sourceRef,
  entries: [...makeupEntries, 'eye-contour-study.mjs', 'adult-body.mjs', 'body-study.mjs', 'body-structure.mjs',
    'structure-study.mjs', 'body-corpulence.mjs', 'corpulence-study.mjs', 'chest.mjs', 'chest-study.mjs',
    'chest-before.mjs', 'chest-r01.mjs', 'pectorals.mjs', 'pectorals-study.mjs', 'thorax-details.mjs',
    'thorax-details-study.mjs', 'body-bone-reliefs.mjs', 'bone-relief-study.mjs', 'abdominals.mjs', 'abdominal-study.mjs',
    'belly-details.mjs', 'belly-detail-study.mjs', 'belly-details-before.mjs', 'pelvic-details.mjs', 'pubic-stipple.mjs', 'pelvic-anatomy-study.mjs'],
  mission: 'BIO-CORPS-06-R02', contractCommit: '276654aa02cb8b09628b74427822139c6a44e131',
  baseline: 'preview/bio-corps-06-r01/', baselineCommit: 'e10009ce1402b9eb8e1ec8a66866371f9e965a05',
  transformHTML: html => html
    .replace('BIO-MAQUILLAGE-01 · Maquillage et peintures faciales', 'BIO-CORPS-06-R02 · État de pousse')
    .replace('<span>BIO-MAQUILLAGE-01</span>', '<span>BIO-CORPS-06-R02</span>')
    .replace('<h1>Maquillage et peintures faciales</h1>', '<h1>État de pousse</h1>')
    .replace('id="atelier" aria-label=', 'id="atelier" data-natural-eyes aria-label=')
    .replace(/<footer>.*?<\/footer>/, '<footer><a href="https://github.com/Thsethse/Microcosme/blob/codex/bio-corps-06-r02/docs/ai/bio-corps-06/RAPPORT.md">Rapport d’implémentation</a></footer>')
});
