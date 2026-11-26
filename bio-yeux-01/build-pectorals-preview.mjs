import {buildPagesPreview, makeupEntries} from './build-pages-preview.mjs';

const [output, pagesRef = 'origin/main', sourceRef = 'HEAD'] = process.argv.slice(2);
buildPagesPreview({
  output, pagesRef, sourceRef,
  entries: [...makeupEntries, 'eye-contour-study.mjs', 'adult-body.mjs', 'body-study.mjs', 'body-structure.mjs',
    'structure-study.mjs', 'body-corpulence.mjs', 'corpulence-study.mjs', 'chest.mjs', 'chest-study.mjs', 'chest-before.mjs', 'chest-r01.mjs', 'pectorals.mjs', 'pectorals-study.mjs'],
  mission: 'BIO-CORPS-04-B', contractCommit: '1588f1b9ad7e00b41066c9c965014a7e5e44a43f',
  baseline: 'preview/bio-corps-04-a-r02/', baselineCommit: 'c9dbbd58316139fa87721ccfc30cb83102145ae4',
  transformHTML: html => html
    .replace('BIO-MAQUILLAGE-01 · Maquillage et peintures faciales', 'BIO-CORPS-04-B · Atelier du thorax')
    .replace('<span>BIO-MAQUILLAGE-01</span>', '<span>BIO-CORPS-04-B</span>')
    .replace('<h1>Maquillage et peintures faciales</h1>', '<h1>Atelier du thorax</h1>')
    .replace('id="atelier" aria-label=', 'id="atelier" data-natural-eyes aria-label=')
    .replace(/<footer>.*?<\/footer>/, '<footer><a href="https://github.com/Thsethse/Microcosme/blob/codex/bio-corps-04-b/docs/ai/bio-corps-04-b/RAPPORT.md">Rapport d’implémentation</a></footer>')
});
