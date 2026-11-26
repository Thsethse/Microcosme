# BIO-CORPS-05-C-R01 — Correction abdominale et pelvienne

- [Atelier interactif](https://thsethse.github.io/Microcosme/preview/bio-corps-05-c-r01/#atelier-thorax)
- [Planche avant/après](https://thsethse.github.io/Microcosme/preview/bio-corps-05-c-r01/#planche-pli-nombril)
- [Diagnostic pelvien](https://thsethse.github.io/Microcosme/preview/bio-corps-05-c-r01/#diagnostic-pelvien)
- [PR de recette #72](https://github.com/Thsethse/Microcosme/pull/72)
- [Manifeste public](https://thsethse.github.io/Microcosme/preview/bio-corps-05-c-r01/version.json)

## Nombril standard et archives

Le nombril H/F est un petit aplat médian dont le rayon de référence vaut 0,85 % de la hauteur du corps hors tête. Un reflet discret complète le rendu aux grandes échelles. La miniature garde l’aplat principal. Le centre suit l’intervalle entre l’abdomen et les hanches, de 1 % de cet intervalle à corpulence nulle à 50 % à corpulence maximale. À partir de 50 %, il est plus bas d’au moins cinq unités SVG dans les témoins H/F contrôlés. Les trois curseurs, leur raccourci et leur réinitialisation ont été retirés de l’atelier. [Ancrage du nombril](../../../bio-yeux-01/belly-details.mjs) · [Atelier](../../../bio-yeux-01/index.html)

Les fichiers v20 de 05-C restent lisibles. L’import vérifie les anciennes valeurs au même titre que le reste de l’archive, puis applique le nombril standard et indique le changement dans le message de restauration. Le prochain export retire les trois anciens paramètres et utilise la version correspondant aux autres réglages présents, par exemple v19 pour un personnage dont la musculature abdominale est enregistrée. L’ossature, la corpulence, la musculature et les autres réglages sont repris à l’identique. Les archives v11 à v19 continuent d’utiliser les mêmes règles de réexport, y compris la conversion déjà en place de v14 et v15 en v16. [Lecture et conversion](../../../bio-yeux-01/appearance.mjs)

## Pli sous-abdominal et limite pelvienne

Le pli garde un seul aplat dérivé de la peau. Sa courbure, son épaisseur, sa largeur et son opacité augmentent avec la corpulence. Son point inférieur descend continûment et se situe au moins sept unités SVG plus bas que le témoin 05-C à partir de 50 % dans les cas de comparaison. Le pli est absent à 0 %. La silhouette sous-jacente fournit tous les repères et reste le seul support du contour. [Tracé et composition](../../../bio-yeux-01/belly-details.mjs) · [Silhouette](../../../bio-yeux-01/adult-body.mjs)

La limite haute réservée se trouve à 80 % de l’intervalle entre les hanches et la base pelvienne. À corpulence maximale, le point inférieur du pli s’arrête à 1 % de la hauteur du corps au-dessus de cette limite. Pour une hauteur de 144 unités SVG, cela donne 1,44 unité. La demi-largeur est limitée par la largeur minimale de la silhouette sur la hauteur occupée par le pli. Le diagnostic présente quatre lignes de repère et mesure la marge sur H et F, avec sélecteurs de corpulence et d’ossature. Les guides appartiennent à cette planche distincte. [Géométrie et repères](../../../bio-yeux-01/belly-details.mjs) · [Diagnostic](../../../bio-yeux-01/belly-detail-study.mjs)

## Plis de l’aine

Les deux plis sont des aplats symétriques, effilés et légèrement courbés. Ils partent sur les côtés et convergent vers le bas, avec une terminaison au-dessus de la base pelvienne. Leur emprise latérale et leur point haut s’adaptent aux repères et à la largeur effective du corps. La séparation du pli abdominal se fait par les tracés. À peau identique, leur teinte et leur opacité de 48 % sont constantes sur toutes les corpulences, musculatures et échelles. [Géométrie et pigmentation](../../../bio-yeux-01/belly-details.mjs)

## Planche et résultats

La planche compare les deux bases aux neuf niveaux de corpulence, soit 36 rendus avant/après. Les sélecteurs couvrent sept ossatures, quatre peaux, trois volumes musculaires, les trois échelles historiques et un cadrage rapproché de l’abdomen et du bassin. Le témoin **Avant · 05-C** utilise le tracé précédent avec ses valeurs de référence. Les cadrages centrés sur la tête gardent leur champ historique. Le cadrage rapproché montre les plis qui sortent de ce champ. [Planche comparative](../../../bio-yeux-01/belly-detail-study.mjs)

| Contrôle | Résultat |
| --- | --- |
| Géométrie | Neuf tests ciblés réussis. La suite R01 contrôle 2 304 configurations d’ossature, de base, de hauteur et de corpulence. Un sondage complémentaire sur 6 000 profils intermédiaires mesure une séparation verticale minimale d’environ 3,95 unités SVG entre le pli et l’aine aux abscisses communes échantillonnées. Les tests vérifient la descente continue sur 1 001 valeurs par base, la marge pelvienne positive et l’identité du SVG hors nouveau calque. Les anciens cas et la migration v20 sont rejoués. |
| Suites Node | 161 tests des ateliers et 35 tests du jeu réussis. |
| Atelier public | Recette complète réussie sous Chromium 151 et WebKit 26.5. Les 18 témoins avant reproduisent le calque 05-C publié. Chaque moteur vérifie la suppression des commandes du nombril, deux migrations v20, les neuf corpulences et la marge de 1,44 unité SVG sur les deux témoins à 100 %. Le comparatif d’images avec et sans les plis de l’aine détecte leur présence sur H et F à 0, 50 et 100 %, sur les peaux claire et foncée testées en vue rapprochée. Les commandes et les sauvegardes précédentes passent aussi la recette. Les résultats ciblés concordent entre la construction locale et la publication. |
| Jeu dans les navigateurs | Vérifications de non-régression réussies sous Chromium et WebKit. |
| GitHub Pages | 1 030 empreintes SHA-256 concordantes sur la version publique, dont 57 fichiers de la preview et 973 dépendances héritées. Deux constructions à révisions identiques donnent des dossiers identiques. |

Les navigateurs utilisent un profil iPad simulé. La validation artistique et fonctionnelle sur l’iPad du porteur reste à effectuer. [Tests géométriques](../../../bio-yeux-01/tests/body-pelvic-correction.test.mjs) · [Tests navigateur](../../../bio-yeux-01/tests/body-browser.cjs)

## Reproduire

```sh
npm ci
npx playwright install chromium webkit
node --test bio-col-01/tests/*.test.mjs bio-yeux-01/tests/*.test.mjs
npm test
npm run test:browser
PREVIEW_MISSION=BIO-CORPS-05-C-R01 node bio-yeux-01/tests/body-browser.cjs
node bio-yeux-01/build-pelvic-preview.mjs /tmp/microcosme-bio-corps-05-c-r01 \
  9248f1c0a486a3ad4aa196dfcf7d6baf966ed3c4 7fc4ab1a40eaee3659fdc383f6186e28bf408341
```

Branche de départ `c59ddeba0899403c6dc3e4ceae63cd8ae1d6ba81`. Le manifeste épingle la révision source `7fc4ab1a40eaee3659fdc383f6186e28bf408341`. La publication Pages `649f67c928a34e1841c64d2cd9bf52132b3dcb3f` porte sur la nouvelle preview. La PR reste ouverte sans fusion.
