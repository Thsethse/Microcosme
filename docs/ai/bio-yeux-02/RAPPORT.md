# BIO-YEUX-02 — Rapport de recette

La branche `codex/bio-yeux-02` part du contrat `651b9da` et du moteur validé `2da4ea2`. L’atelier propose six formes de pupille, seize teintes en aplats et deux formes d’hétérochromie. Il permet de comparer les pigments historiques sur la même ouverture ou sur l’ouverture historique. Le rétablissement local conserve le personnage, sa coiffure, sa palette capillaire et ses réglages d’ouverture. [Contrat](CONTRAT.md) · [PR #49](https://github.com/Thsethse/Microcosme/pull/49)

## Géométrie et valeurs utiles

Le moteur hérité dessine une pupille elliptique de demi-axes 1,9 et 2,2 unités SVG. La référence à 100 % est le diamètre du cercle de même aire, `2 × √(1,9 × 2,2)`, soit environ 4,089 unités. À diamètre nominal constant, les demi-axes de l’iris sont multipliés respectivement par `√q` et `1/√q` pour un rapport largeur/hauteur `q`. Les centres correspondent exactement à ceux des pupilles héritées. Le masque reprend l’ouverture SVG existante pour les huit formes et l’ouverture historique. Le contour est intérieur et sa couleur provient de la fonction OKLab utilisée par la palette capillaire. Chaque iris reçoit un reflet fixe, symétrique de celui de l’autre œil.

La silhouette de pupille s’inscrit dans le cercle intérieur de l’iris. Avec un rapport de 0,75 et un contour à 10 %, la pupille demandée à 80 % s’applique à 76,60254037844386 %. Avec un contour à 10 % et une pupille à 80 %, le rapport directement accessible va de 0,81 à 1,23. L’interface utilise des crans de 1 % et de 0,01 pour le rapport. L’archive conserve les valeurs demandées et leur précision effective.

En hétérochromie complète, le second œil reçoit la nuance secondaire. En mode central, celle-ci apparaît dans une zone concentrique des deux yeux. Les valeurs qui correspondent à une couleur identique ou à une zone masquée restent en mémoire. À géométrie neutre avec une pupille en anneau, le curseur affiche deux intervalles utiles, 0–25 % et 46–80 %. Une demande à 32 % s’applique à 25 % jusqu’à ce qu’un changement de géométrie rende la demande visible. [Capture de l’atelier WebKit](preuves/atelier-webkit.png)

### Limites mesurées

- Le cercle inscrit est une borne commune aux six formes. Pour les fentes et le losange aux rapports extrêmes, cette borne peut être plus restrictive que leur tracé.
- L’utilité d’un cran central est estimée sur deux rayons par bande de 1 % et 72 directions. Pour cette mesure, chaque courbe de Bézier est échantillonnée à 20 points. Une portion extrêmement fine peut échapper aux sondes. Le découpage du rendu emploie le tracé SVG exact.
- Passer de 24 à 25 % de zone centrale en anneau modifie 197 canaux RGBA en gros plan dans Chromium et 192 dans WebKit. En miniature, un canal change dans chaque moteur. Ce cran reste accessible. [Mesures](preuves/recette-locale.json)
- Les essais tactiles automatisent WebKit sous Linux avec un profil mobile aux dimensions d’un iPad. Le porteur du projet réalise la validation artistique et l’essai sur iPad physique.

## Tirage de démonstration

Le tirage emploie le flux indépendant et versionné `iris-xoshiro128ss-v1`. Le mode d’hétérochromie est tiré uniformément et conservé lors des reprises de propositions centrales. Les formes et les couleurs sont échantillonnées uniformément à chaque proposition. La taille de la pupille est tirée parmi les crans admissibles pour le rapport et le contour choisis. En mode central, seules les tailles visibles non nulles sont tirées. Une proposition centrale sans taille visible est rejetée. Le moteur signale explicitement un épuisement du budget. Ces distributions s’appliquent à l’atelier de démonstration.

| Ouverture | Aucune / complète / centrale | Effectif par forme | Effectif par teinte principale | Plafond pupille observé / attendu | Plafond zone centrale observé / attendu |
| --- | --- | --- | --- | --- | --- |
| Historique | 673 / 690 / 685 | 326–358 | 104–157 | 24 / 31,06 | 9 / 15,68 |
| Ronde, visage haut | 682 / 633 / 733 | 325–362 | 101–153 | 35 / 31,06 | 16 / 15,73 |
| Étroite, visage étroit | 682 / 682 / 684 | 325–358 | 104–142 | 29 / 31,06 | 13 / 14,59 |

Chaque ligne utilise 2 048 graines distinctes. Les 6 144 résultats ont été rejoués à l’identique et sont admissibles. L’effectif attendu au plafond additionne, pour chaque tirage, l’inverse du nombre de crans de son domaine conditionnel. [Effectifs complets](preuves/recette-locale.json)

## Résultats du contrat

| Test | Résultat |
| --- | --- |
| T1 · Historique | 2 268 égalités SVG exactes avec le moteur figé sur 126 références, trois échelles et deux états hérités. Égalité SVG et raster sur 54 cas par navigateur, couvrant les neuf ouvertures et les deux fonds. |
| T2 · Diversité | Six signatures raster distinctes pour les pupilles et seize pour les teintes par navigateur. Le rapport de contraste minimal entre contour et aplat est de 1,626. |
| T3 · Domaines | 290 crans nominaux balayés, plafonds de pupille et de rapport vérifiés, intervalles disjoints et valeurs latentes vérifiés dans le moteur et l’atelier. |
| T4 · Compatibilité | 6 912 combinaisons extrêmes sur huit morphologies et neuf ouvertures. Centres et tracés hérités identiques sur 1 134 paires de référence et d’ouverture. Zéro pixel hors masque sur 144 découpes par navigateur. |
| T5 · Hétérochromie | Nuance du second œil et zone concentrique bilatérale vérifiées. Égalité de rendu avec des nuances identiques ou une zone entièrement cachée. Réactivation des réglages latents quand la géométrie ou la couleur le permet. |
| T6 · Sauvegardes | Archives v1 comparées au moteur figé et graine historique rejouée. Archives v2 personnalisées et latentes, graine des iris et précision numérique vérifiées. Import à froid comparé aux trois échelles dans les deux navigateurs. |
| T7 · Tirage | 6 144 tirages admissibles et rejoués à l’identique. Les fréquences aux plafonds concordent avec le nombre de crans disponibles. |
| T8 · Interface et héritage | Node 24.22.3, Chromium 151.0.7922.34 et WebKit 26.5. Deux fonds, trois échelles de 300, 178 et 70 × 70 px, fenêtres de 820, 1180 et 390 px, toucher et clavier vérifiés. Les 65 tests Node hérités et les 19 tests Node des trois lots historiques ont réussi. Les suites navigateur des formes d’yeux, des corrections A/B/C, des palettes, des trois lots historiques et du jeu ont réussi sous Chromium et WebKit. |
| T9 · Preuves | Commandes, mesures brutes, captures et limites consignées dans ce rapport. |
| T10 · Preview | Vérification publique détaillée dans la section Publication. |

[Comparaison WebKit aux trois échelles](preuves/trois-echelles-webkit.png) · [Tests Node](../../../bio-yeux-01/tests/iris.test.mjs) · [Tests navigateur](../../../bio-yeux-01/tests/iris-browser.cjs)

## Rejouer la recette

```sh
npm ci
npx playwright install chromium webkit
node --test tests/*.test.js bio-col-01/tests/model.test.mjs bio-yeux-01/tests/model.test.mjs bio-yeux-01/tests/corrections-*.test.mjs bio-yeux-01/tests/iris.test.mjs
node bio-yeux-01/tests/iris-browser.cjs
node bio-yeux-01/tests/corrections-browser.cjs
node bio-col-01/tests/browser.cjs
node bio-col-01/tests/legacy.cjs
npm run test:browser
BASE_URL=https://thsethse.github.io/Microcosme/preview/bio-yeux-02/ node bio-yeux-01/tests/iris-browser.cjs
```

Le workflow de la PR récupère les références historiques des coiffures et rejoue aussi l’atelier des formes d’yeux figé avant A/B/C. [Workflow](../../../.github/workflows/bio-yeux-01.yml)

## Publication

La preview publique a répondu en HTTPS et l’intégralité de la recette navigateur a été rejouée à cette adresse sous Chromium et WebKit. Les 14 fichiers de la preview et les 157 ressources héritées correspondent aux empreintes SHA-256 du manifeste. Le commit Pages `4ca8255` ajoute uniquement `preview/bio-yeux-02/` sur `main`. Les sources de la preview proviennent du commit `a93a82c` sur la branche d’implémentation. La PR est ouverte en brouillon pour validation.

[Preview publique](https://thsethse.github.io/Microcosme/preview/bio-yeux-02/) · [Recette publique](preuves/recette-publique.json) · [Empreintes vérifiées](preuves/ressources-pages.json) · [Déploiement GitHub Pages](https://github.com/Thsethse/Microcosme/actions/runs/45456801807)
