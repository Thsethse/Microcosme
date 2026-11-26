import {buildPagesPreview, makeupEntries} from './build-pages-preview.mjs';

const [output, pagesRef = 'origin/main', sourceRef = 'HEAD'] = process.argv.slice(2);
buildPagesPreview({
  output, pagesRef, sourceRef,
  entries: [...makeupEntries, 'eye-contour-study.mjs', 'adult-body.mjs', 'body-study.mjs', 'body-structure.mjs',
    'structure-study.mjs', 'body-corpulence.mjs', 'corpulence-study.mjs', 'chest.mjs', 'chest-study.mjs', 'chest-before.mjs', 'chest-r01.mjs', 'pectorals.mjs', 'pectorals-study.mjs', 'thorax-details.mjs', 'thorax-details-study.mjs', 'body-bone-reliefs.mjs', 'bone-relief-study.mjs', 'abdominals.mjs', 'abdominal-study.mjs', 'belly-details.mjs', 'belly-detail-study.mjs'],
  mission: 'BIO-CORPS-05-C', contractCommit: '860c13f0c727dee162c5930d464f8b7831fe649e',
  baseline: 'preview/bio-corps-05-b/', baselineCommit: '3deff10178aff1d95ca580d45611ef0293e0adbb',
  transformHTML: html => html
    .replace('BIO-MAQUILLAGE-01 · Maquillage et peintures faciales', 'BIO-CORPS-05-C · Pli abdominal et nombril')
    .replace('<span>BIO-MAQUILLAGE-01</span>', '<span>BIO-CORPS-05-C</span>')
    .replace('<h1>Maquillage et peintures faciales</h1>', '<h1>Pli abdominal et nombril</h1>')
    .replace('id="atelier" aria-label=', 'id="atelier" data-natural-eyes aria-label=')
    .replace(/<footer>.*?<\/footer>/, '<footer><a href="https://github.com/Thsethse/Microcosme/blob/codex/bio-corps-05-c/docs/ai/bio-corps-05-c/RAPPORT.md">Rapport d’implémentation</a></footer>')
});
