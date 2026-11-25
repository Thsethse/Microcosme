import {buildPagesPreview, scarEntries} from './build-pages-preview.mjs';

const [output, pagesRef = 'origin/main', sourceRef = 'c13c722'] = process.argv.slice(2);
buildPagesPreview({
  output, pagesRef, sourceRef, entries: scarEntries,
  mission: 'BIO-CICATRICES-01', contractCommit: '5905fa5',
  baseline: 'preview/bio-marques-01/', baselineCommit: 'a7735b01ad127badfb4613ec45c148afe186d4bd'
});
