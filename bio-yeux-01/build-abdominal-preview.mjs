import {buildPagesPreview, makeupEntries} from './build-pages-preview.mjs';

const [output, pagesRef = 'origin/main', sourceRef = 'HEAD'] = process.argv.slice(2);
buildPagesPreview({
  output, pagesRef, sourceRef,
  entries: [...makeupEntries, 'eye-contour-study.mjs', 'adult-body.mjs', 'body-study.mjs', 'body-structure.mjs',
    'structure-study.mjs', 'body-corpulence.mjs', 'corpulence-study.mjs', 'chest.mjs', 'chest-study.mjs', 'chest-before.mjs', 'chest-r01.mjs', 'pectorals.mjs', 'pectorals-study.mjs', 'thorax-details.mjs', 'thorax-details-study.mjs', 'body-bone-reliefs.mjs', 'bone-relief-study.mjs', 'abdominals.mjs', 'abdominal-study.mjs'],
  mission: 'BIO-CORPS-05-B', contractCommit: '0c38479aa87770fafdfd55c3aac0358af94c3341',
  baseline: 'preview/bio-corps-05-a/', baselineCommit: '01214c2bde568339d8b6618a648543360f8a6b56',
  transformHTML: html => html
    .replace('BIO-MAQUILLAGE-01 · Maquillage et peintures faciales', 'BIO-CORPS-05-B · Musculature abdominale')
    .replace('<span>BIO-MAQUILLAGE-01</span>', '<span>BIO-CORPS-05-B</span>')
    .replace('<h1>Maquillage et peintures faciales</h1>', '<h1>Musculature abdominale</h1>')
    .replace('id="atelier" aria-label=', 'id="atelier" data-natural-eyes aria-label=')
    .replace(/<footer>.*?<\/footer>/, '<footer><a href="https://github.com/Thsethse/Microcosme/blob/codex/bio-corps-05-b/docs/ai/bio-corps-05-b/RAPPORT.md">Rapport d’implémentation</a></footer>')
});
