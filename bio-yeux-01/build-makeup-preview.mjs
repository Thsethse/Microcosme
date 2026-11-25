import {buildPagesPreview, makeupEntries} from './build-pages-preview.mjs';

const [output, pagesRef = 'origin/main', sourceRef = '70ed8ae'] = process.argv.slice(2);
buildPagesPreview({
  output, pagesRef, sourceRef,
  entries: makeupEntries,
  mission: 'BIO-MAQUILLAGE-01', contractCommit: 'a267b5c',
  baseline: 'preview/bio-cicatrices-01/', baselineCommit: 'c13c722a60362dcdfbe08a7db544a41819faa618'
});
