# BIO-CORPS-05-C-R02 — Courbe abdominale et détail aréolaire

- [Atelier interactif](https://thsethse.github.io/Microcosme/preview/bio-corps-05-c-r02/#atelier-thorax)
- [Comparaison abdominale H/F](https://thsethse.github.io/Microcosme/preview/bio-corps-05-c-r02/#planche-pli-nombril)
- [Comparaison aréolaire H/F](https://thsethse.github.io/Microcosme/preview/bio-corps-05-c-r02/#planche-details-thorax)
- [Diagnostic pelvien](https://thsethse.github.io/Microcosme/preview/bio-corps-05-c-r02/#diagnostic-pelvien)
- [PR de recette #73](https://github.com/Thsethse/Microcosme/pull/73)
- [Manifeste public](https://thsethse.github.io/Microcosme/preview/bio-corps-05-c-r02/version.json)

## Courbe et nombril

Le croquis du porteur a guidé la forme du U et la proximité du nombril. Les points de contrôle cubiques arrondissent les extrémités et donnent une tangente horizontale au centre. Les extrémités suivent leur propre repère, à `0,53 − 0,09 × c` de l’intervalle abdomen–hanches, où `c` désigne la corpulence normalisée. Elles remontent légèrement à mesure que le centre s’abaisse. La largeur et l’intensité continuent de croître à partir de la corpulence existante. [Courbe et projection](../../../bio-yeux-01/belly-details.mjs)

Sur les témoins de hauteur 144 unités SVG à 100 %, l’écart vertical entre les extrémités et le centre supérieur passe de 7,92 à 14,88 unités, soit environ **1,88 fois** la profondeur R01. Le bas du pli conserve sa marge de **1,44 unité SVG** au-dessus de la limite réservée. Celle-ci reste calculée entre les hanches et la base pelvienne. Le calque se compose sur la silhouette existante. [Calcul de la marge](../../../bio-yeux-01/belly-details.mjs) · [Composition corporelle](../../../bio-yeux-01/adult-body.mjs)

Le nombril standard s’aligne sur l’axe médian. Sa hauteur suit le centre du pli, avec un écart de `(0,030 − 0,009 × c) × H` au-dessus du centre, où `H` est la hauteur du corps. Cette référence s’applique aussi lorsque le pli est absent à 0 %. Le nombril se place environ 8 unités SVG plus bas qu’en R01 à 0 % et 11 unités plus bas à 100 % sur les témoins. Les plis de l’aine reprennent exactement leurs tracés et leurs couleurs R01, avec une opacité constante de 48 %. [Ancrage médian et plis de l’aine](../../../bio-yeux-01/belly-details.mjs)

## Détail aréolaire et sauvegardes

Le détail standard a exactement le même centre que l’aréole. Son rayon vaut 27 % du demi-axe vertical de l’aréole, avec un plafond de 1,15 unité SVG. Une nuance dérivée de la couleur de l’aréole le rend visible aux trois échelles. Les cinq commandes de taille, forme, pigmentation, position horizontale et position verticale de l’aréole gardent les mêmes bornes et valeurs. Les deux commandes de taille et de relief du mamelon sont retirées. Le bouton commun applique les cinq valeurs aréolaires de référence. Les contours mammaires et pectoraux restent ceux des versions précédentes. [Géométrie et centrage](../../../bio-yeux-01/thorax-details.mjs) · [Atelier](../../../bio-yeux-01/index.html)

Les apparences avec aréoles personnalisées s’exportent en **v21**. Les archives v18, v19 et v20 avec les sept anciennes valeurs thoraciques se relisent. L’import vérifie le document complet et affiche le détail standard. Le prochain export conserve les cinq valeurs aréolaires, les réglages du personnage et les autres éléments d’apparence. Les anciennes valeurs de taille et de relief du mamelon quittent le fichier réexporté. La conversion du nombril v20 reste applicable. Les personnages sans personnalisations aréolaires continuent à utiliser leur version habituelle. [Migration et export](../../../bio-yeux-01/appearance.mjs)

## Planche et résultats

La planche abdominale propose 36 rendus avant/après sur H/F aux neuf corpulences, avec sept ossatures, quatre teintes et trois volumes musculaires. La planche aréolaire présente R01 et R02, les variations isolées des cinq commandes et les contextes anatomiques. Les deux planches proposent les trois échelles historiques et un cadrage rapproché pour les détails qui sortent du champ de la miniature. Le diagnostic pelvien montre le point inférieur du pli et sa marge. [Planche abdominale et diagnostic](../../../bio-yeux-01/belly-detail-study.mjs) · [Planche aréolaire](../../../bio-yeux-01/thorax-details-study.mjs)

| Contrôle | Résultat |
| --- | --- |
| Géométrie et sauvegardes | 27 tests ciblés réussis. La recette échantillonne 1 001 corpulences par base et vérifie le centrage, la marge, la séparation des plis, les témoins R01 et les archives v18 à v21. Les contrôles de support aréolaire couvrent 46 080 configurations. |
| Suites Node | 165 tests d’atelier et 35 tests du jeu réussis. |
| Atelier public | Recette complète réussie sous Chromium 151.0.7922.34 et WebKit 26.5. Chaque moteur retrouve 24 témoins historiques identiques, huit par échelle, et vérifie les neuf corpulences H/F, les cinq commandes aréolaires, 20 gestes tactiles et deux migrations depuis R01. Les mesures locales et publiques du U et de sa marge concordent. |
| Jeu dans les navigateurs | Vérifications de non-régression réussies sous Chromium et WebKit. |
| GitHub Pages | 1 088 empreintes SHA-256 concordantes sur la version publique, dont 57 fichiers de la preview et 1 031 dépendances héritées. Deux constructions à révisions identiques donnent des dossiers identiques. |

Les essais tactiles utilisent un profil iPad simulé. La validation artistique et fonctionnelle sur l’iPad du porteur reste à effectuer. [Tests ciblés](../../../bio-yeux-01/tests/body-pelvic-r02.test.mjs) · [Tests navigateur](../../../bio-yeux-01/tests/body-browser.cjs)

## Reproduire

```sh
npm ci
npx playwright install chromium webkit
node --test bio-col-01/tests/*.test.mjs bio-yeux-01/tests/*.test.mjs
npm test
npm run test:browser
PREVIEW_MISSION=BIO-CORPS-05-C-R02 node bio-yeux-01/tests/body-browser.cjs
node bio-yeux-01/build-pelvic-r02-preview.mjs /tmp/microcosme-bio-corps-05-c-r02 \
  649f67c928a34e1841c64d2cd9bf52132b3dcb3f f320ac04583421f11c9dddff53659b7bfd08de67
```

Branche de départ `4b08202a720ca8f39ed2a10892e6edd3bb77e975`. Le manifeste épingle la révision source `f320ac04583421f11c9dddff53659b7bfd08de67`. La publication Pages `491410b3e57a199f0eee75ecdc004dbbe0a126eb` porte sur la nouvelle preview. La PR reste ouverte sans fusion.
