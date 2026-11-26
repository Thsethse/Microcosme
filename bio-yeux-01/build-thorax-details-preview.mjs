import {buildPagesPreview, makeupEntries} from './build-pages-preview.mjs';

const [output, pagesRef = 'origin/main', sourceRef = 'HEAD'] = process.argv.slice(2);
buildPagesPreview({
  output, pagesRef, sourceRef,
  entries: [...makeupEntries, 'eye-contour-study.mjs', 'adult-body.mjs', 'body-study.mjs', 'body-structure.mjs',
    'structure-study.mjs', 'body-corpulence.mjs', 'corpulence-study.mjs', 'chest.mjs', 'chest-study.mjs', 'chest-before.mjs', 'chest-r01.mjs', 'pectorals.mjs', 'pectorals-study.mjs', 'thorax-details.mjs', 'thorax-details-study.mjs'],
  mission: 'BIO-CORPS-04-C', contractCommit: '6a959f123c1d664b6fb212da89caa093c0bc668e',
  baseline: 'preview/bio-corps-04-b/', baselineCommit: '1250a54ff6538a5e94ac7f16c3ea5ab665245bcc',
  transformHTML: html => html
    .replace('BIO-MAQUILLAGE-01 · Maquillage et peintures faciales', 'BIO-CORPS-04-C · Atelier du thorax')
    .replace('<span>BIO-MAQUILLAGE-01</span>', '<span>BIO-CORPS-04-C</span>')
    .replace('<h1>Maquillage et peintures faciales</h1>', '<h1>Atelier du thorax</h1>')
    .replace('id="atelier" aria-label=', 'id="atelier" data-natural-eyes aria-label=')
    .replace(/<footer>.*?<\/footer>/, '<footer><a href="https://github.com/Thsethse/Microcosme/blob/codex/bio-corps-04-c/docs/ai/bio-corps-04-b/RAPPORT.md">Rapport d’implémentation</a></footer>')
});
