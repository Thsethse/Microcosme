# BIO-YEUX-01 — Rapport de réalisation

La branche `codex/bio-yeux-01` part de `docs/bio-yeux-01` à `1e23366`, au-dessus de BIO-COL-01. La PR #46 reste ouverte en brouillon sur la branche documentaire. [PR #46](https://github.com/Thsethse/Microcosme/pull/46) · [Contrat validé](CONTRAT_BIO_YEUX_01.md) · [Planche artistique](https://github.com/Thsethse/Microcosme/blob/main/docs/ai/visual-references/6584ACFB-4D31-4837-B06B-9A86C1357CD2.png)

## Géométrie et mesures

Le générateur actif emploie le contour frontal P4-R1. Son ovale est déformable par huit paramètres morphologiques. La preview reprend ses six choix de morphologie nommés, sa combinaison libre, ses six corps et ses 126 identifiants historiques de coiffure, dont 120 entrées ordinaires. Les formes du prototype antérieur P2 appartiennent à un autre rendu. Dans P4-R1, l’ancrage du visage et le contour restent ceux du modèle actif pour chaque choix.

Chaque œil utilise quatre Béziers cubiques. Chaque paupière est composée de deux arcs qui se rejoignent avec une tangente horizontale à son sommet, avant inclinaison. Le milieu du segment entre les coins reste à l’ancrage historique. Le point de vue est de face. L’axe horizontal local croît du nez vers la tempe et son miroir s’applique à l’autre œil.

| Réglage | Mesure |
| --- | --- |
| Largeur · 75 à 120 % | Longueur du segment reliant les deux coins, rapportée au diamètre horizontal de l’ellipse historique. |
| Hauteur d’ouverture · 40 à 130 % | Somme des distances perpendiculaires des deux sommets au segment des coins, rapportée au diamètre vertical historique. |
| Courbure supérieure · 50 à 150 % | Pondère la part supérieure de la hauteur selon `0,56 × valeur supérieure`, et la longueur de la poignée horizontale à son sommet. |
| Courbure inférieure · 30 à 140 % | Pondère la part inférieure de la hauteur selon `0,44 × valeur inférieure`, et la longueur de sa propre poignée au sommet. La somme des deux parts donne la hauteur demandée. |
| Inclinaison · −12 à +12° | Rotation autour de l’ancrage. Une valeur positive remonte le coin externe. |
| Effilement · 0 à 100 % | Agit sur les poignées des deux coins. À 0 %, les tangentes y sont verticales. À 100 %, elles forment des pointes. |
| Sommet supérieur · −20 à +20 % | Déplacement horizontal du sommet supérieur, en proportion de la largeur avant inclinaison. Une valeur positive va vers la tempe. |
| Sommet inférieur · −20 à +20 % | Même mesure pour le sommet inférieur, indépendamment du supérieur. |

Les maxima s’appliquent à la boîte du tracé après inclinaison, avec son trait arrondi de 0,8 unité SVG. Les extrema des Béziers sont calculés sur les dérivées. Le plafond de largeur vaut 25 % de la section horizontale du contour facial au niveau des ancrages. Le plafond de hauteur vaut 12 % de la hauteur réelle de ce contour. Le rapport hauteur sur largeur reste au plus de 0,85. La zone de sécurité est calculée par œil à partir des bords du contour sur toute la bande utile, avec une marge intérieure au trait du visage, une séparation médiane et des marges aux sourcils et à la bouche. Le test du nez utilise son rectangle englobant agrandi de 0,25 unité.

Le solveur vérifie les deux yeux avec les mêmes paramètres. Lorsque la forme demandée dépasse, il ajuste largeur, hauteur ou inclinaison autour des ancrages. Il réserve l’ouverture minimale, conserve autant d’inclinaison et de largeur que possible, puis rétablit la hauteur dans l’enveloppe disponible. Les valeurs demandées et effectives sont affichées dans la preview. Le profil des deux paupières et leurs décalages restent ceux de la demande. Le tirage par graine sélectionne des combinaisons admissibles et agit sur les yeux seuls.

Seules les ouvertures historiques et leur regroupement SVG sont remplacés quand le lot est activé. Chaque pupille est reprise octet pour octet et masquée par le tracé de sa nouvelle ouverture. Corps, contour du visage, bouche, nez, sourcils, ordre des couches, accessoires et peintures capillaires restent identiques. Les contours des nouvelles ouvertures reprennent la couleur sombre historique. Les réglages des yeux restent des options de rendu séparées de la sélection historique.

## Exceptions et limites

- L’ellipse historique dépasse déjà certains plafonds. Sur le visage neutre, surlargeur de 0,781 unité SVG et surhauteur de 1,320. Sur les morphologies testées, maxima de 3,280 en largeur, de 1,558 en hauteur et de 0,231 au-dessus du rapport 0,85. Ces exceptions s’appliquent uniquement au rendu historique. Les nouvelles formes respectent les plafonds stricts.
- Avec un trait de 0,9 unité, huit coins du domaine morphologique laissaient moins de place que la largeur minimale trait compris. Le trait des nouvelles formes est fixé à 0,8 pour conserver la largeur relative minimale dans ces cas.
- Le contour du nez est protégé par une marge conservatrice. Une demande peut être réduite avant qu’un contact avec le triangle lui-même soit visible.
- Les gros plans de la planche servent à examiner les silhouettes. À 70 × 70 px, la différence peut tenir à quelques pixels. La recette navigateur mesure la présence et la distinction des tracés, y compris les pupilles masquées. Le jugement artistique et l’essai de Safari sur un iPad physique restent réservés au porteur du projet.

## Recette

| Test | Résultat |
| --- | --- |
| T1 · Historique | Réussi. 129 fichiers hérités contrôlés par SHA-256. Comparaison à l’octet sur 2 268 rendus par mode historique, couvrant 126 sélections, six corps et trois tailles, avec rotation des 26 teintes. |
| T2 · Formes | Réussi. Huit tracés distincts. Les rapports d’ouverture, la direction des coins, la forme des sommets et l’effilement distinguent les préréglages. Aucun asset matriciel dans le rendu. |
| T3 · Paramètres | Réussi. Huit variations indépendantes, centres des segments des coins inchangés, symétrie miroir et bornes d’entrée vérifiées. |
| T4 · Extrêmes | Réussi. Les 256 coins des paramètres des yeux sur les 256 coins morphologiques, soit 65 536 couples, et 1 024 couples intérieurs. Bornes, trait inclus, et absence d’auto-intersection pour les deux yeux. |
| T5 · Compatibilité | Réussi. Contours réels, marges au nez, séparation, masques et exceptions historiques contrôlés. 3 024 rendus actifs couvrent les 126 identifiants et les huit formes aux trois tailles, avec rotation des corps, morphologies et palettes. |
| T6 · Tirage | Réussi. 256 graines reproductibles et immédiatement admissibles. La sélection est inchangée après le tirage. |
| T7 · Réinitialisation | Réussi. Retour exact au rendu historique courant sur les deux moteurs. Les choix de personnage, de couleur et de fond restent disponibles. |
| T8 · Échelles | Réussi. 300 px, 178 px et 70 × 70 px. Dix signatures raster distinctes par échelle et par moteur pour les huit formes et les deux extrêmes. |
| T9 · Interaction et héritage | Réussi. Chromium et WebKit ont exécuté la preview tactile et les contrôles hérités, avec les tailles 820 × 1180, 1180 × 820 et 390 × 844. 68 tests Node réussis au total, dont 35 du dépôt, 7 BIO-COL-01, 19 des lots 1 à 3 et 7 BIO-YEUX-01. Les suites navigateur du jeu, de BIO-COL-01 et des trois lots ont également été rejouées. |
| T10 · Publication et preuves | Réussi. L’URL publique répond en HTTPS et la preview a été parcourue dans Chromium 151.0.7922.34 et WebKit 26.5. Les 145 fichiers contrôlés correspondent aux octets attendus, dont sept fichiers de la preview et 138 fichiers hérités. [Preview publique](https://thsethse.github.io/Microcosme/preview/bio-yeux-01/) · [Déploiement GitHub Pages](https://github.com/Thsethse/Microcosme/actions/runs/45368080968) |

## Publication et captures

Le commit source publié est `13c57a9e7424bef1fe92b71dd4c036072050f050`. Le commit Pages `9cd8b523ee851ec1d8caf7c37e06d3853c1a9770` ajoute uniquement les sept fichiers statiques dans `preview/bio-yeux-01/`. Le code de la PR reste sur sa branche. [Manifeste de la preview](https://thsethse.github.io/Microcosme/preview/bio-yeux-01/version.json) · [Vérification SHA-256](captures/pages-proof.json)

Les captures viennent de l’URL publique. Les vérifications de statut et de SHA-256 ont utilisé le magasin de certificats système. Pour les parcours navigateur publics, le banc Playwright du cloud a utilisé une exception de confiance liée à son proxy HTTPS. [Résultats Chromium et WebKit](captures/navigateurs-publics.json) · [Exécution CI](https://github.com/Thsethse/Microcosme/actions/runs/45368104528)

| Moteur | Planche | Extrême minimum | Extrême maximum et enveloppes |
| --- | --- | --- | --- |
| Chromium | [Huit formes et extrêmes](captures/chromium-planche.png) | [Avant / après aux trois tailles](captures/chromium-extreme-minimum.png) | [Avant / après aux trois tailles](captures/chromium-extreme-maximum.png) |
| WebKit | [Huit formes et extrêmes](captures/webkit-planche.png) | [Avant / après aux trois tailles](captures/webkit-extreme-minimum.png) | [Avant / après aux trois tailles](captures/webkit-extreme-maximum.png) |

## Fichiers de la mission

| Chemin | Contenu |
| --- | --- |
| `bio-yeux-01/eyes.mjs`, `bezier.mjs` | Préréglages, bornes, enveloppes, tracés et tirage. |
| `bio-yeux-01/render.mjs` | Adaptateur SVG qui préserve le générateur historique. |
| `bio-yeux-01/index.html`, `style.css`, `app.mjs` | Atelier indépendant, comparateur, planche et contrôles hérités. |
| `bio-yeux-01/build-preview.mjs` | Génération des fichiers Pages depuis Git et vérification des dépendances figées. |
| `bio-yeux-01/tests/model.test.mjs`, `browser.cjs`, `.github/workflows/bio-yeux-01.yml` | Recette Node, Chromium et WebKit et suites héritées. |
| `docs/ai/bio-yeux-01/RAPPORT.md`, `captures/` | Rapport, captures et résultats publics. |

```sh
npm ci
npm test
node --test bio-col-01/tests/model.test.mjs bio-yeux-01/tests/model.test.mjs
npx playwright install chromium webkit
node bio-yeux-01/tests/browser.cjs
node bio-col-01/tests/browser.cjs
git fetch --no-tags origin 1ff931586776b3f7ed41bbdc5772b97e030aa4db 4156254ca5a9b4a52f138a558bd70d461f4d4c4e 576ee961b5be385e6cceb2f357ffe74341b0d05f
node bio-col-01/tests/legacy.cjs
npm run test:browser
```
