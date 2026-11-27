import {buildPagesPreview, makeupEntries} from './build-pages-preview.mjs';

const [output, pagesRef = 'origin/main', sourceRef = 'HEAD'] = process.argv.slice(2);
buildPagesPreview({
  output, pagesRef, sourceRef,
  entries: [...makeupEntries, 'eye-contour-study.mjs', 'adult-body.mjs', 'body-study.mjs', 'body-structure.mjs',
    'structure-study.mjs', 'body-corpulence.mjs', 'corpulence-study.mjs', 'chest.mjs', 'chest-study.mjs',
    'chest-before.mjs', 'chest-r01.mjs', 'pectorals.mjs', 'pectorals-study.mjs', 'thorax-details.mjs',
    'thorax-details-study.mjs', 'body-bone-reliefs.mjs', 'bone-relief-study.mjs', 'abdominals.mjs', 'abdominal-study.mjs',
    'belly-details.mjs', 'belly-detail-study.mjs', 'belly-details-before.mjs', 'pelvic-details.mjs', 'pelvic-anatomy-study.mjs'],
  mission: 'BIO-CORPS-06-R01', contractCommit: '33afa297720f174405186bf21362a2201b4b3ba1',
  baseline: 'preview/bio-corps-06/', baselineCommit: '8930757309c3ff0382e4745a6676ec1c3d42f7bf',
  transformHTML: html => html
    .replace('BIO-MAQUILLAGE-01 · Maquillage et peintures faciales', 'BIO-CORPS-06-R01 · Anatomie pelvienne adulte')
    .replace('<span>BIO-MAQUILLAGE-01</span>', '<span>BIO-CORPS-06-R01</span>')
    .replace('<h1>Maquillage et peintures faciales</h1>', '<h1>Anatomie pelvienne adulte</h1>')
    .replace('id="atelier" aria-label=', 'id="atelier" data-natural-eyes aria-label=')
    .replace(/<footer>.*?<\/footer>/, '<footer><a href="https://github.com/Thsethse/Microcosme/blob/codex/bio-corps-06-r01/docs/ai/bio-corps-06/RAPPORT.md">Rapport d’implémentation</a></footer>')
});
