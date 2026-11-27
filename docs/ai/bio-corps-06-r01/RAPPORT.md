# BIO-CORPS-06-R01 — Proportions et placement pelviens

- [Atelier du bassin](https://thsethse.github.io/Microcosme/preview/bio-corps-06-r01/#atelier-bassin)
- [Comparaison H/F avant et après](https://thsethse.github.io/Microcosme/preview/bio-corps-06-r01/#planche-anatomie-pelvienne)
- [PR nº 75](https://github.com/Thsethse/Microcosme/pull/75)

## Référence et mise en œuvre

Le montage IMG_0740.png, consulté avant modification et vérifié contre le blob du contrat, place le U H plus bas que le triangle F. R01 transpose ce placement par rapport à la hauteur du corps et aux plis de l’aine. Sur les témoins standards, le cadre H gagne 29 % en largeur, descend et s’étend vers le bas. Le cadre F gagne 55 % en largeur. Son extension inférieure abaisse le triangle et allonge le trait médian. Les tracés, leurs aplats et leurs ombres conservent le traitement de BIO-CORPS-06. [Montage](https://github.com/Thsethse/Microcosme/blob/main/docs/ai/visual-references/IMG_0740.png) · [Calcul des cadres](../../../bio-yeux-01/pelvic-details.mjs)

Le bord supérieur tient compte du bas du pli abdominal. La largeur dépend de l’ossature et de la corpulence. Le dessin H se prolonge dans la transition haute de la base du pion, comme sur le montage, avec le quart inférieur dégagé. Le contour et l’ancrage de la base sont préservés. La pilosité accompagne le repositionnement par une translation verticale. Les 24 points et les formes des mèches gardent leurs écarts relatifs ainsi que leur réponse au curseur. Le format v22 est conservé. [Composition](../../../bio-yeux-01/adult-body.mjs) · [Sauvegarde](../../../bio-yeux-01/appearance.mjs)

## Recette

- **Node** · 59 tests corporels réussis, dont 5 tests pelviens. Les comparaisons SVG contrôlent 70 configurations de corps H/F aux états rasé et long. Hors du nouveau calque, les rendus avant et après sont identiques.
- **Chromium 151 et WebKit 26.5** · Comparaison avant/après vérifiée aux trois échelles historiques et en gros plan, sur les corpulences et ossatures extrêmes. Les boutons H/F et le curseur ont été actionnés au profil tactile iPad simulé. Les 24 implantations restent présentes à 100 %.
- La comparaison au montage a été revue sur la planche en gros plan. La validation artistique et fonctionnelle sur iPad physique reste à effectuer.

[Tests pelviens](../../../bio-yeux-01/tests/body-pelvic-anatomy.test.mjs) · [Planche](../../../bio-yeux-01/pelvic-anatomy-study.mjs)

Rejouer les tests avec `node --test bio-yeux-01/tests/adult-body.test.mjs bio-yeux-01/tests/body-*.test.mjs`. La preview épingle la source `e10009ce1402b9eb8e1ec8a66866371f9e965a05`. La publication Pages `ad162a808f48db4b587c11b62db2591edd07d300` porte seulement sur la nouvelle preview.
