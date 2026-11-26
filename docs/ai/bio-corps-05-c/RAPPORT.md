# BIO-CORPS-05-C — Pli abdominal et nombril

- [Atelier interactif](https://thsethse.github.io/Microcosme/preview/bio-corps-05-c/#atelier-thorax)
- [Planche de contrôle](https://thsethse.github.io/Microcosme/preview/bio-corps-05-c/#planche-pli-nombril)
- [PR de recette #71](https://github.com/Thsethse/Microcosme/pull/71)
- [Manifeste public](https://thsethse.github.io/Microcosme/preview/bio-corps-05-c/version.json)

## Pli sous-abdominal

Le curseur **Corpulence** pilote directement le pli sur H et F. Le calque dessine un seul aplat courbe, effilé sur les côtés, avec une ombre dérivée de la couleur de peau. Le tracé reste à l’intérieur de l’enveloppe depuis le premier repère jusqu’à forte corpulence. Le chemin de la silhouette, ses repères, sa hauteur et son point d’appui restent ceux de 05-B. Le nouveau calque suit celui des muscles abdominaux dans le SVG. Les reliefs osseux et les volumes du thorax conservent leur empilement. [Calcul du pli](../../../bio-yeux-01/belly-details.mjs) · [Composition](../../../bio-yeux-01/adult-body.mjs)

Pour une corpulence normalisée `c`, le centre du pli passe de 12 à 67 % de l’intervalle entre les repères de l’abdomen et des hanches. La profondeur de la courbe vaut `H × (0,008 + 0,056 × c^1,25)` et son épaisseur centrale vaut `H × 0,023 × c^1,15`, où `H` est la hauteur du corps hors tête. La demi-largeur progresse de 19 à 87 % de la demi-largeur disponible dans cette bande, avec une marge de 2,8 unités SVG. L’opacité vaut `0,64 × c^2,08` et le pli est absent à 0 %. Ces variations donnent une amorce discrète à 25 %, une courbe légère à 50 % et un pli plus large et profond aux valeurs hautes. [Domaines et courbes](../../../bio-yeux-01/belly-details.mjs)

## Nombril et atelier

Le nombril utilise la même géométrie sur les deux bases. Il reste sur l’axe médian. Son centre évolue du côté de la taille vers le repère abdominal à mesure que la corpulence augmente. La largeur disponible borne sa taille de façon progressive et le pli reste en dessous. Les lèvres claire et sombre changent de côté et d’intensité selon le relief. La miniature emploie un seul aplat, avec les mêmes dimensions, le même axe et une teinte adaptée au relief. La vue **Abdomen · détail** permet d’examiner le nombril et le pli quand les cadrages historiques centrés sur la tête les rognent. [Ancrage, limites et rendu](../../../bio-yeux-01/belly-details.mjs)

Le centre commence à 34 % de l’intervalle entre la taille et l’abdomen. Il descend jusqu’à 76 % de cet intervalle, puis reçoit un décalage égal à 6 % de l’intervalle abdomen–hanches à corpulence maximale. Pour un corps de 142 unités SVG, le rayon demandé va de 0,70 à 3,85 unités. Une compression continue le borne selon la demi-largeur disponible autour de l’ancrage. Le rapport vertical sur horizontal passe de 1 à 1,94. [Géométrie du nombril](../../../bio-yeux-01/belly-details.mjs)

| Curseur | Référence H/F | Effet sur 0–100 % |
| --- | ---: | --- |
| Taille | 38 % | Augmente le diamètre apparent à l’intérieur de la limite du support. |
| Forme | 36 % | Étire progressivement la forme verticale à surface constante. |
| Relief | 28 % | Passe d’un creux ombré à un relief saillant par inversion des lumières et des ombres. |

Dans l’atelier, choisir H ou F puis **Nombril** donne accès aux trois commandes, à côté de l’aperçu rapproché de l’abdomen. Chaque réglage agit immédiatement. Le bouton de réinitialisation remet le nombril de référence. Ce détail est visible par défaut dans le rendu adulte actuel. [Atelier](../../../bio-yeux-01/index.html) · [Commandes et préférences](../../../bio-yeux-01/app.mjs)

## Sauvegarde et compatibilité

Les réglages personnalisés du nombril sont conservés en v20, fractions comprises, avec la corpulence, l’ossature et les autres réglages déjà présents. Le pli et sa position sont recalculés à partir de l’apparence lors de la restauration. Les réglages de musculature restent indépendants. Une archive précédente garde sa version et ses valeurs au réexport. Dans 05-C, elle s’affiche avec le nombril de référence et le pli correspondant à sa corpulence. [Sauvegarde et restauration](../../../bio-yeux-01/appearance.mjs)

Cette livraison clôt le lot abdominal selon le périmètre simplifié validé. Le contrat acte l’abandon du volume abdominal indépendant, du ventre de grossesse et des lots séparés 05-D/E. [Contrat](CONTRAT.md)

## Planche et résultats

La planche présente 36 rendus appariés H/F, dont neuf niveaux de corpulence et neuf variantes qui isolent les trois réglages du nombril à 0, 50 et 100 %. Les sélecteurs appliquent à l’ensemble sept ossatures, quatre teintes de peau, trois niveaux de musculature et les trois échelles historiques. Le cadrage rapproché est proposé à l’ouverture. [Cas de recette](../../../bio-yeux-01/belly-detail-study.mjs)

| Contrôle | Résultat |
| --- | --- |
| Géométrie | Cinq tests dédiés réussis. Le balayage couvre 18 432 configurations pour les marges et l’ancrage médian, 1 001 valeurs de corpulence par base pour la continuité et 21 valeurs par axe pour l’effet des commandes. Le SVG hors calque correspond à 05-B aux trois échelles. |
| Suites Node | 157 tests des ateliers, dont les cinq tests dédiés, et 35 tests du jeu réussis. |
| Atelier public | Recette complète réussie sous Chromium 151 et WebKit 26.5. Chaque moteur vérifie les trois curseurs sur H et F avec douze gestes tactiles, les neuf repères du pli et du nombril, deux restaurations v20 et deux cas issus de 05-B, les quatre peaux, sept ossatures, trois niveaux de musculature et trois échelles. Les tests des commandes et des sauvegardes des étapes précédentes passent aussi. Les résultats ciblés concordent entre la construction locale et la publication. |
| Jeu dans les navigateurs | Vérifications de non-régression réussies sous Chromium et WebKit. |
| GitHub Pages | 972 empreintes SHA-256 concordantes sur la version publique, dont 56 fichiers de la preview et 916 dépendances héritées. Deux constructions à révisions identiques donnent des dossiers identiques. |

Les essais tactiles utilisent des profils iPad simulés. La validation artistique et fonctionnelle sur l’iPad du porteur reste à effectuer. [Tests dédiés](../../../bio-yeux-01/tests/body-belly-details.test.mjs) · [Tests navigateurs](../../../bio-yeux-01/tests/body-browser.cjs)

## Reproduire

```sh
npm ci
npx playwright install chromium webkit
node --test bio-col-01/tests/*.test.mjs bio-yeux-01/tests/*.test.mjs
npm test
npm run test:browser
PREVIEW_MISSION=BIO-CORPS-05-C node bio-yeux-01/tests/body-browser.cjs
node bio-yeux-01/build-belly-details-preview.mjs /tmp/microcosme-bio-corps-05-c \
  c32043735d0027516cdc231dffff77610ff4908d 2d9fa49c8c381ccb37878e720f68f28374a60599
```

Branche de départ `860c13f0c727dee162c5930d464f8b7831fe649e`. Le manifeste épingle la révision source `2d9fa49c8c381ccb37878e720f68f28374a60599`. La publication Pages `9248f1c0a486a3ad4aa196dfcf7d6baf966ed3c4` porte uniquement sur la nouvelle preview. La PR reste ouverte sans fusion.
