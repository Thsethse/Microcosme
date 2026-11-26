# BIO-CORPS-04-B — Pectoraux masculins adultes

- [Atelier interactif du thorax](https://thsethse.github.io/Microcosme/preview/bio-corps-04-b/#atelier-thorax)
- [Planche de contrôle des pectoraux](https://thsethse.github.io/Microcosme/preview/bio-corps-04-b/#planche-pectoraux)
- [PR de recette #67](https://github.com/Thsethse/Microcosme/pull/67)
- [Manifeste de la preview](https://thsethse.github.io/Microcosme/preview/bio-corps-04-b/version.json)

## Référence et implantation

La photographie de référence a été consultée avant le développement. Les cas A–C ont guidé les faibles reliefs, les cas D–H la largeur du muscle et la fermeté du bord inférieur, et les cas I–L l’arrondi inférieur et la diminution du contraste avec la corpulence. La construction utilise des courbes calculées à partir du thorax et des réglages. La photographie est conservée dans la documentation du projet. [IMG_0732.jpeg à la révision consultée](https://github.com/Thsethse/Microcosme/blob/319797dad3675a7ee0682d3d6635cef65a5b7a93/docs/ai/visual-references/IMG_0732.jpeg), blob `ca9e7ee9b3bbfcf5399afb3d4b105ac3f3206906`.

Chaque côté du thorax H reçoit un plan musculaire large. Huit points reliés par des cubiques en déterminent la surface. Le bord inférieur devient plus horizontal aux fortes angularités. La teinte de peau sert à calculer trois aplats, pour la surface, le relief latéral et l’ombre inférieure. L’écart sternal laisse le thorax apparent à l’axe. Des ombres peu contrastées adoucissent le raccord aux faibles volumes et aux corpulences élevées. La poitrine F conserve les volumes de la version R02, dont l’implantation est plus basse et le relief davantage concentré dans le bas de chaque volume. [Géométrie des pectoraux](../../../bio-yeux-01/pectorals.mjs) · [Géométrie mammaire R02](../../../bio-yeux-01/chest.mjs)

Le point d’attache est à 47 % de l’intervalle vertical entre les repères des épaules et du thorax. Le volume peut descendre à partir de ce point. La largeur disponible est calculée sur toute la hauteur occupée par la courbe et ses points de contrôle, après l’ossature et la corpulence. Une marge de trois unités SVG protège la transition au bord du thorax. Cette limite dynamique permet aux cinq commandes de rester utilisables sur une ossature étroite. Le calque est superposé au corps H et le chemin de l’enveloppe sous-jacente est indépendant des valeurs pectorales. Les niveaux anatomiques, la hauteur, la base du pion et l’appui au sol suivent la géométrie corporelle existante. [Superposition et géométrie corporelle](../../../bio-yeux-01/adult-body.mjs) · [Rendu du personnage](../../../bio-yeux-01/render.mjs)

## Réglages et corpulence

Les cinq curseurs H ont pour domaine 0–100. La valeur entière affichée dans le tableau donne le réglage de référence par curseur.

| Curseur | Référence | Effet |
| --- | ---: | --- |
| Volume musculaire | 0 | Augmente la hauteur, la largeur occupée et le contraste du relief. À 0 %, le thorax est plat et le calque est absent. |
| Largeur | 55 | Étend horizontalement les plans musculaires dans la largeur disponible du thorax. |
| Hauteur | 46 | Prolonge le volume vers le bas à partir de la même implantation. |
| Angularité | 62 | Rend le bord inférieur plus horizontal et précise les angles latéraux. |
| Définition | 53 | Change la délimitation et le contraste des aplats internes, à enveloppe musculaire constante. |

Pour une corpulence normalisée `f` entre 0 et 1, l’angularité visible est multipliée par `1 − 0,70 × f` et la définition visible par `1 − 0,66 × f`. La corpulence augmente légèrement la profondeur inférieure, arrondit le dessous et réduit le contraste des aplats. Le facteur de volume musculaire `(volume / 100)^0,62` dépend du seul réglage de volume. Les valeurs stockées de volume, forme et définition restent constantes lors d’un changement de corpulence. Un thorax mince peut porter un volume élevé et un thorax très corpulent peut rester plat. [Calcul des paramètres et des aplats](../../../bio-yeux-01/pectorals.mjs)

## Accès dans l’atelier et sauvegardes

Dans R02, les six curseurs F n’apparaissaient qu’après avoir choisi la base « Féminine adulte » dans **Corps**. Ils suivaient les sept réglages d’ossature et de corpulence. Le lien **Atelier du thorax** mène désormais directement au sélecteur. Les boutons **Pectoraux · H adulte** et **Poitrine · F adulte** ouvrent le panneau correspondant et placent le focus sur le curseur de volume. Le panneau est placé avant les commandes d’ossature et de corpulence, avec un aperçu du personnage à côté des curseurs. Le panneau F propose toujours le volume, la largeur, l’allongement, la rondeur, l’écartement et l’affaissement. Les cinq réglages de forme F et les quatre H s’activent dès que le volume devient positif. Une indication le précise et les valeurs de forme sont conservées lorsque le volume revient à zéro. [Atelier et panneaux](../../../bio-yeux-01/index.html) · [Comportement des curseurs et aperçu](../../../bio-yeux-01/app.mjs)

L’atelier garde les préférences de chaque base en mémoire quand on passe de H à F. L’archive d’un personnage H ayant des réglages pectoraux utilise la version 17 et conserve les cinq valeurs demandées, fractions comprises, même avec un volume nul. Le format F de R02 reste la version 16. Les archives antérieures et les six corps historiques sont pris en charge. Les archives H antérieures ouvrent le thorax plat avec la géométrie qu’elles avaient à l’export. [Sélection du corps](../../../bio-yeux-01/catalogue.mjs) · [Export et restauration](../../../bio-yeux-01/appearance.mjs)

## Planche de contrôle

La planche présente 32 cas et 35 rendus. La matrice associe les niveaux de corpulence 25 % (mince), 50 % (standard) et 100 % (très obèse) aux volumes musculaires 0 %, 50 % et 100 %. Quinze études isolent les cinq axes à 0 %, 50 % et 100 %. Cinq cas font varier l’ossature, y compris des limites admissibles. Trois comparaisons montrent H et F côte à côte à corpulence et réglages d’ossature relatifs comparables, avec un volume nominal de 75 %. Les sélecteurs appliquent quatre teintes de peau et les trois échelles historiques à l’ensemble des cas (tête 300 px, corps 178 px et miniature 70 × 70 px). [Données et rendu de la planche](../../../bio-yeux-01/pectorals-study.mjs)

## Résultats des tests

Les cinq tests dédiés passent. Le balayage de 18 432 combinaisons vérifie la marge thoracique, la continuité tangentielle des courbes extérieures et l’ouverture sternale. Les tests contrôlent l’effet indépendant des curseurs, l’atténuation progressive de l’angularité et de la définition, l’invariance du corps, du visage, des cheveux et du rendu F, et les archives nouvelles et historiques. [Tests géométriques et archives](../../../bio-yeux-01/tests/body-pectorals.test.mjs)

| Contrôle | Résultat |
| --- | --- |
| Suites Node | 138 tests des ateliers, dont les cinq tests dédiés, et 35 tests du jeu réussis. |
| Atelier sur la preview publique | Recette complète réussie sous Chromium 151 et WebKit 26.5, avec des résultats identiques en local et sur Pages pour chaque moteur. Les tests exercent les onze curseurs et l’aperçu, trois gestes tactiles, les neuf combinaisons de la matrice et les 32 cas, les quatre teintes et les trois échelles. Ils restaurent les archives H v17 en volume et à plat, échangent une archive F v16 avec R02 et comparent les SVG et les images matricielles F aux trois échelles. La suite couvre aussi les corps historiques, les raccords avec les cheveux et les acquis de l’ossature et de la corpulence. |
| Navigateurs du jeu | Vérifications de non-régression réussies sous Chromium et WebKit. |
| Publication | L’atelier public démarre avec la révision annoncée. Les empreintes SHA-256 des 48 fichiers du manifeste courant et de ses 708 dépendances héritées correspondent à leur contenu public, soit 756 fichiers contrôlés. Deux constructions à partir des mêmes révisions produisent des dossiers identiques. |

Les contrôles tactiles automatisés utilisent WebKit et Chromium avec un profil iPad simulé. Sous WebKit en portrait (810 × 1 080 px), la distance entre le bas du sélecteur **Corps** et le curseur **Volume** F passe de 870 à 258 px. Le bouton F place le focus sur **Volume** et un toucher active l’aperçu ainsi que les cinq autres commandes. La recette artistique et fonctionnelle sur l’iPad du porteur reste à effectuer.

## Reproduire la recette

```sh
npm ci
npx playwright install chromium webkit
node --test bio-col-01/tests/*.test.mjs bio-yeux-01/tests/*.test.mjs
npm test
npm run test:browser
PREVIEW_MISSION=BIO-CORPS-04-B node bio-yeux-01/tests/body-browser.cjs
node bio-yeux-01/build-pectorals-preview.mjs /tmp/microcosme-bio-corps-04-b \
  319797dad3675a7ee0682d3d6635cef65a5b7a93 1250a54ff6538a5e94ac7f16c3ea5ab665245bcc
```

Source de la preview `1250a54ff6538a5e94ac7f16c3ea5ab665245bcc`, sur la base contractuelle `1588f1b9ad7e00b41066c9c965014a7e5e44a43f`. Le commit de publication GitHub Pages `8765e81f4e6acbc169b4420031480166688453c6` contient les fichiers statiques de la seule nouvelle preview. La PR de recette reste ouverte, sans fusion.
