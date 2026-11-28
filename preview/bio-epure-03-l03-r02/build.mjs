import {resolve} from 'node:path';
import {buildCommandPreview} from '../bio-epure-03-l02-r01/build.mjs';

buildCommandPreview(process.argv[2] && resolve(process.argv[2]), {
  mission: 'BIO-EPURE-03-L03-R02',
  proceduralFace: true,
  report: 'https://github.com/Thsethse/Microcosme/blob/codex/bio-epure-03-l03-r02/docs/ai/bio-epure-03/l03/RAPPORT_R02.md',
  reportLabel: 'Rapport du lot 03 R02 et recette iPad'
});
