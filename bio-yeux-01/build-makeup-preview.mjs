import {buildPagesPreview, scarEntries} from './build-pages-preview.mjs';

const [output, pagesRef = 'origin/main', sourceRef = 'HEAD'] = process.argv.slice(2);
buildPagesPreview({
  output, pagesRef, sourceRef,
  entries: [...scarEntries, 'makeup.mjs', 'makeup-render.mjs', 'makeup-editor.mjs', 'makeup-study.mjs'],
  mission: 'BIO-MAQUILLAGE-01', contractCommit: 'a267b5c',
  baseline: 'preview/bio-cicatrices-01/', baselineCommit: 'c13c722a60362dcdfbe08a7db544a41819faa618'
});
