import {buildPagesPreview, makeupEntries} from './build-pages-preview.mjs';

const [output, pagesRef = 'origin/main', sourceRef = 'HEAD'] = process.argv.slice(2);
buildPagesPreview({
  output, pagesRef, sourceRef,
  entries: [...makeupEntries, 'eye-contour-study.mjs', 'adult-body.mjs', 'body-study.mjs', 'body-structure.mjs',
    'structure-study.mjs', 'body-corpulence.mjs', 'corpulence-study.mjs', 'chest.mjs', 'chest-study.mjs', 'chest-before.mjs', 'chest-r01.mjs', 'pectorals.mjs', 'pectorals-study.mjs', 'thorax-details.mjs', 'thorax-details-study.mjs', 'body-bone-reliefs.mjs', 'bone-relief-study.mjs'],
  mission: 'BIO-CORPS-05-A', contractCommit: '0c5f7e9b7475b7d7f836d443032bac2ad7ddbdfa',
  baseline: 'preview/bio-corps-04-c/', baselineCommit: '9d2963a1fabb027b71a6a661b10efa70648133ce',
  transformHTML: html => html
    .replace('BIO-MAQUILLAGE-01 · Maquillage et peintures faciales', 'BIO-CORPS-05-A · Reliefs osseux et maigreur')
    .replace('<span>BIO-MAQUILLAGE-01</span>', '<span>BIO-CORPS-05-A</span>')
    .replace('<h1>Maquillage et peintures faciales</h1>', '<h1>Reliefs osseux et maigreur</h1>')
    .replace('id="atelier" aria-label=', 'id="atelier" data-natural-eyes aria-label=')
    .replace(/<footer>.*?<\/footer>/, '<footer><a href="https://github.com/Thsethse/Microcosme/blob/codex/bio-corps-05-a/docs/ai/bio-corps-05-a/RAPPORT.md">Rapport d’implémentation</a></footer>')
});
