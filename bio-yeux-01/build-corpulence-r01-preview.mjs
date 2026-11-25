import {buildPagesPreview, makeupEntries} from './build-pages-preview.mjs';

const [output, pagesRef = 'origin/main', sourceRef = 'HEAD'] = process.argv.slice(2);
buildPagesPreview({
  output, pagesRef, sourceRef,
  entries: [...makeupEntries, 'eye-contour-study.mjs', 'adult-body.mjs', 'body-study.mjs', 'body-structure.mjs',
    'structure-study.mjs', 'body-corpulence.mjs', 'corpulence-study.mjs'],
  mission: 'BIO-CORPS-03-R01', contractCommit: 'c335903532d485baa3e08c2123285a4d5b6c7ee3',
  baseline: 'preview/bio-corps-03/', baselineCommit: '244dc7867eadab8df7d24d0e9c64aee47a850646',
  transformHTML: html => html
    .replace('BIO-MAQUILLAGE-01 · Maquillage et peintures faciales', 'BIO-CORPS-03-R01 · Corpulence des habitants')
    .replace('<span>BIO-MAQUILLAGE-01</span>', '<span>BIO-CORPS-03-R01</span>')
    .replace('<h1>Maquillage et peintures faciales</h1>', '<h1>Corpulence des habitants</h1>')
    .replace('id="atelier" aria-label=', 'id="atelier" data-natural-eyes aria-label=')
    .replace(/<footer>.*?<\/footer>/, '<footer><a href="https://github.com/Thsethse/Microcosme/blob/codex/bio-corps-03-r01/docs/ai/bio-corps-03-r01/RAPPORT.md">Rapport de correction</a></footer>')
});
