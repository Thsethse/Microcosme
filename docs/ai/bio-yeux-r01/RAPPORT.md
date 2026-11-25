# Recette de BIO-YEUX-R01

Le correctif part de `docs/bio-yeux-r01` et reprend la révision `70ed8ae` de la preview BIO-MAQUILLAGE-01 validée par le porteur. GitHub Pages sert les 37 fichiers de la preview indépendante issus de `2535479`. La publication statique `d5e5f76` crée uniquement le dossier `preview/bio-yeux-r01/`. [PR #58](https://github.com/Thsethse/Microcosme/pull/58) · [Déploiement Pages](https://github.com/Thsethse/Microcosme/actions/runs/45596992518) · [Preview](https://thsethse.github.io/Microcosme/preview/bio-yeux-r01/)

Recette du 25 novembre 2026. La distribution locale et l’URL publique ont été testées sous Chromium 151.0.7922.34 et WebKit 26.5 avec un profil tactile iPad. Les deux moteurs ont démarré sans erreur JavaScript. Le script autonome `atelier-5442772f8062c9fb.js` correspond à son empreinte. Les 403 ressources déclarées, dont 367 héritées, ont été vérifiées par SHA-256. [Recette locale](recette-locale.json) · [Recette publique](recette-publique.json)

## Contour, cils et eyeliner

Le SVG de départ peignait le contour des formes personnalisées avec un trait noir continu. Lorsque les détails des yeux étaient actifs, un même polygone noir contenait le contour et les pointes des cils. L’eyeliner du maquillage avait déjà son propre calque, son tracé et ses réserves.

Le contour R01 suit les arcs existants. Deux bandes extérieures plus fines dérivent leur encre de la luminance de la peau. La bande supérieure est légèrement plus sombre. La miniature reçoit un trait un peu moins réduit pour compenser le sous-échantillonnage. Les cils conservent leur encre, leur nombre, leur longueur, leur placement et tous les points du bord externe. La racine rejoint le nouveau trait par une transition effilée. Le tracé de l’eyeliner et ses masques sont reproduits à l’identique.

## Comparatif artistique

Six cas illustrent l’ouverture historique, un œil naturel sans cils ajoutés, deux densités de cils et l’eyeliner noir ou bleu. Chaque paire garde la même morphologie, la même ouverture, la même peau, les mêmes cils et les mêmes réglages de maquillage. La planche comporte quatre teintes de peau, quatre formes d’ouverture personnalisées et l’ouverture historique. Chaque côté présente un détail agrandi, une tête à 300 px, un corps à 178 px et une miniature de 70 × 70 px. [Planche interactive](https://thsethse.github.io/Microcosme/preview/bio-yeux-r01/#planche-contours) · [Capture du comparatif](comparatif-contours.webp)

## Contrôles

| Contrôle | Vérification |
| --- | --- |
| Préservation des modules | 54 comparaisons SVG sous Node couvrent l’ouverture historique et les huit ouvertures personnalisées aux trois échelles, avec et sans les modules hérités. Le dessin est identique en dehors du tracé révisé. 378 rendus couvrent les 126 entrées du catalogue. Les 18 portraits « avant » correspondent au moteur de BIO-MAQUILLAGE-01. |
| Cils et contraste | Les quatre peaux produisent des encres distinctes. Contrôle des points du bord externe et du pigment des cils pour les densités 0 à 3. Les réglages existants des contours gardent un effet sur les bandes révisées. |
| Archives et maquillage | Relecture des archives v10 sans paramètre additionnel. Le retrait du maquillage restitue le nouveau rendu naturel, SVG et raster, aux trois échelles. |
| Recette publique | Démarrage à froid, listes alimentées, curseurs utilisables, six portraits visibles, activation des modules hérités et des familles de maquillage. Simulation d’une réponse 503 sur le fichier de démarrage, diagnostic visible et réussite au rechargement. |
| Rendu avant/après | Mesure raster sur les trois tailles pour les six paires. Le cas de peau brune avec cils denses a aussi été comparé à la variante avec eyeliner en conservant les mêmes paramètres anatomiques. L’eyeliner change respectivement 323, 78 et 34 pixels sous Chromium et 299, 69 et 29 sous WebKit dans ce cas. |

Le contrôle final de l’apparence et des interactions sur iPad physique revient au porteur du projet.

## Suites héritées

Sous Node 24.22.3, les 35 tests du jeu et les 106 tests des ateliers hérités passent, ainsi que les cinq nouveaux tests R01. Les 19 tests originaux des lots de coiffures 1 à 3 passent. Sous Chromium et WebKit, les suites héritées des ateliers, des lots de coiffures, du jeu v0.9 et le démarrage autonome des previews des cicatrices et du maquillage passent.

Les 31 tests Node de l’archive indépendante v0.8 passent. Son script navigateur rencontre sous Chromium et WebKit la même erreur héritée en lisant la clé `microcosme-v03`, alors que le stockage de cette archive utilise `microcosme-preview-v08`. Les fichiers v0.8 correspondent à ceux de la branche de départ. [Script v0.8](../../../preview-v08/tests/browser.cjs#L86) · [Stockage v0.8](../../../preview-v08/storage.js#L7)

## Reproduction

```sh
npm ci
npx playwright install chromium webkit
npm test
node --test bio-col-01/tests/*.test.mjs bio-yeux-01/tests/*.test.mjs
PREVIEW_MISSION=BIO-YEUX-R01 node bio-yeux-01/tests/makeup-browser.cjs
```

Le dernier appel cible GitHub Pages. `PREVIEW_DIR` permet de rejouer la recette sur une distribution construite par `build-eye-contour-preview.mjs`. `PAGES_TEST_PROXY=1` utilise le réglage du proxy HTTPS de l’environnement de recette. Le manifeste est également accessible avec la vérification TLS normale de `curl`. [Contrat](CONTRAT.md) · [Manifeste public](https://thsethse.github.io/Microcosme/preview/bio-yeux-r01/version.json)
