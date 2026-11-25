# BIO-MARQUES-01 — Rapport de recette

L’atelier BIO-MARQUES-01 est disponible dans la [preview publique](https://thsethse.github.io/Microcosme/preview/bio-marques-01/). La [PR #55](https://github.com/Thsethse/Microcosme/pull/55) est ouverte en brouillon. Le code publié correspond au commit `a7735b0`. Les 28 fichiers statiques de l’atelier sont servis depuis le commit Pages `2bd879e`. Le [déploiement Pages](https://github.com/Thsethse/Microcosme/actions/runs/45563900489) et les empreintes figurent dans les preuves ci-dessous.

## Placement et paramètres

La coordonnée horizontale représente un pourcentage de la largeur du contour Bézier à la hauteur demandée. La coordonnée verticale est interpolée entre la couronne, les yeux, le nez, la bouche et le menton, placés à 0, 48, 64, 82 et 100 %. Le contour réel varie avec la morphologie. Les marques gardent leurs coordonnées normalisées et leurs identifiants, puis suivent les nouveaux repères. Les limites tiennent compte de l’emprise de chaque forme, avec une marge de 0,90 unité SVG au contour. Les ouvertures des yeux, les lèvres peintes et les narines disposent de réserves distinctes. La peau de l’arête nasale reçoit les marques. Les cheveux et la barbe passent devant la couche cutanée. La disparition d’un masque révèle le même dessin.

L’échelle de taille individuelle est interpolée entre les rayons de référence ci-dessous, en unités SVG sur la tête neutre de demi-axes 29 et 44. Elle suit ensuite la moyenne géométrique du redimensionnement de ces deux axes. Le contour disponible localement peut réduire le plafond de taille. Une marque provisoirement incompatible conserve sa position et sa taille demandées. L’allongement fait varier le rapport des axes de 1 à 0,48. L’orientation est utile sur les ovales et les formes irrégulières ou allongées. L’ovale se répète à 180°, donc son dernier cran distinct est 179°. Les crans chromatiques de même valeur RVB sont regroupés dans l’atelier.

| Famille et mode | Rayon nominal sur le visage neutre |
| --- | --- |
| Grain de beauté | 0,31 à 1,68 |
| Tache de naissance | 0,80 à 6,40 |
| Tache pigmentaire individuelle | 0,60 à 5,40 |
| Groupe de rousseur | 0,25 à 0,78, avec variation et espace local |
| Groupe pigmentaire | 0,36 à 2,20, avec variation et espace local |

L’atelier accepte jusqu’à 24 marques et groupes par apparence. Les groupes disposent de 44 emplacements au maximum pour la rousseur et de 12 pour les taches pigmentaires. La densité ajoute des emplacements dans l’ordre déterminé par la graine. L’atelier propose les crans qui font effectivement apparaître une marque supplémentaire. Les sites occultés restent mémorisés. L’étendue fait varier les écarts aux centres des zones de 73 % à 100 %. Les six zones orientent le tirage sans frontière visible sur le visage.

## Lecture de la planche

La rousseur privilégie deux distributions inclinées le long des pommettes et un foyer central étroit sur l’arête du nez. Les points s’espacent et s’atténuent vers les bords. Des écarts locaux de taille, d’allongement et de contraste individualisent les marques. Une réserve dépendant de la distance entre voisins limite les contacts à forte densité. Sur les formats 178 et 70 px, les points les plus lisibles de la même répartition forment un sous-ensemble déterministe. Les repères et les données sauvegardées sont communs aux trois échelles.

La planche réunit quatre morphologies, quatre graines, trois densités et les trois tailles usuelles, avec un gros plan pour chaque cas. Les carnations alternatives reprennent les quatre teintes des essais du nez et de la bouche. Elles s’appliquent aux seules études chromatiques de la planche. L’atelier utilise la carnation historique du générateur pour les apparences enregistrées.

Sur les douze échantillons, les taches modifient 25 à 132 pixels à 300 px, 8 à 34 pixels à 178 px et 3 à 12 pixels à 70 px, selon la densité, la carnation et le moteur. La miniature présente une impression d’ensemble. Le gros plan est l’échelle de contrôle de la séparation des points et de la nuance sur les peaux foncées. Ces mesures établissent la lisibilité technique. L’appréciation artistique et la recette physique sur iPad sont réservées au porteur du projet.

[Planche de contrôle WebKit](planche-rousseur.webp) · [Planche interactive](https://thsethse.github.io/Microcosme/preview/bio-marques-01/#planche-rousseur)

## Résultats

| Test | Résultat |
| --- | --- |
| T1 · Historique | 756 comparaisons SVG exactes, 54 comparaisons raster par moteur et sept versions historiques d’archives réexportées à l’identique. |
| T2 · Composition | Les quatre familles peuvent cohabiter. Les taches pigmentaires sont disponibles seules ou en groupe. Les positions sont asymétriques et chaque marque possède son identifiant. |
| T3 · Marques individuelles | 681 crans utiles des sept axes contrôlés. Les quatre formes sont distinctes. La taille et l’orientation demandées sont restaurées lorsque leur domaine se rouvre. |
| T4 · Groupes | 43 incréments de densité visibles sur le cas de référence à 44 sites, six zones vérifiées et 128 graines distinctes rejouées. Parmi les 3 584 positions demandées dans cet échantillon, 2 513 relèvent des joues et 1 071 du nez. |
| T5 · Rousseur | 12 combinaisons de la planche, de 11 à 43 points visibles en grand format. Effet raster mesuré à chaque échelle dans Chromium et WebKit. |
| T6 · Pigments | Quatre familles chromatiques distinctes sur les quatre carnations d’étude. Intensité zéro sans peinture. |
| T7 · Anatomie et masques | 256 combinaisons géométriques de morphologie et 11 275 marques vérifiées. 72 cas raster par moteur, sans recouvrement des yeux, des lèvres ou des narines au seuil de la recette. Masquage et restitution exacte vérifiés au raster pour la barbe et les cheveux. |
| T8 · Archives | Les documents v8 conservent identités, coordonnées, graines et valeurs latentes. Export et restauration à froid identiques dans les deux navigateurs. |
| T9 · Atelier | 396 rendus avec marques, couvrant 126 références capillaires et six corps aux trois échelles. Le placement tactile, le clavier, les champs propres à chaque type de marque et les fonds clair et sombre sont testés à 820 × 1180, 1180 × 820 et 390 × 844 sous Chromium 151 et WebKit 26.5. Les 114 tests Node hérités et les suites navigateur héritées passent. |
| T10 · Publication | URL Pages vérifiée en HTTP 200, recette publique rejouée sous Chromium et WebKit et 299 fichiers confirmés par SHA-256, dont 271 dépendances héritées. |

[Mesures de la recette publique](recette-publique.json) · [Preuve des empreintes](publication.json)

## Rejouer la recette

```sh
npm ci
npx playwright install chromium webkit
node --test bio-yeux-01/tests/marks.test.mjs
ARTIFACT_DIR=/tmp/microcosme-marques node bio-yeux-01/tests/marks-browser.cjs
BASE_URL=https://thsethse.github.io/Microcosme/preview/bio-marques-01/ \
  ARTIFACT_DIR=/tmp/microcosme-marques-public node bio-yeux-01/tests/marks-browser.cjs
```
