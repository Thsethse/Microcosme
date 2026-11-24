# BIO-YEUX-03 — Rapport de recette

L’atelier ajoute les paupières supérieure et inférieure, les cils, les cernes et poches, ainsi que les contours supérieur et inférieur. Il part du contrat `dd478cd` et du moteur BIO-YEUX-02 validé. Le comparateur peut conserver l’ouverture et les iris actuels en référence ou utiliser l’ouverture et les pigments historiques. Le rétablissement local des contours laisse les autres réglages actifs. [Contrat](CONTRAT.md)

## Construction vectorielle et limites locales

Le tracé d’ouverture provient du moteur existant. L’ellipse historique est réutilisée pour les pigments et sert de référence géométrique aux détails. Les huit formes personnalisées réutilisent leurs quatre Béziers. Le calcul travaille dans le repère de l’œil droit, puis réemploie les coordonnées en miroir sur l’ancrage de gauche.

La silhouette noire est un seul aplat par œil. La largeur du contour de référence vaut 0,8 unité SVG, l’épaisseur utilisée par BIO-YEUX-01. Elle donne aussi la référence commune à l’ellipse historique, qui était sans trait. Le profil varie entre les coins, qui partagent une même jonction, et le milieu des arcs. La projection sur la normale locale maintient une épaisseur lisible sur les arcs obliques. La place jusqu’à la limite anatomique borne le profil point par point. Le plafond de l’axe est calculé sur la médiane des limites estimées dans la partie centrale de l’arc pour que le réglage reste perceptible sur une part significative du tracé.

Les pointes modifient la frontière de cette même silhouette dans le quadrant supérieur externe. Leur extension radiale vaut 5 à 15 % de la largeur mesurée de l’ouverture, selon la place libre. Le nombre définit de zéro à trois pointes. L’espacement distribue leurs centres sur l’arc temporal. Sous deux pointes, cette valeur reste en mémoire. Les bases s’élargissent dans le contour puis se resserrent vers la pointe. Le principe graphique reprend le regard stylisé demandé pour Tifa sur PS1 à partir du tracé Microcosme. [Gros plan](preuves/gros-plan-webkit.png)

Le rectangle de sécurité provient de l’enveloppe héritée commune aux deux yeux. Il tient compte du bord facial, des marges du voisinage au-dessus et au-dessous de l’œil, et d’une encoche nasale. Deux découpes SVG imposent le rectangle avec son encoche et le complément exact de l’ouverture. Le tracé et la découpe propres à BIO-YEUX-02 restent identiques. Le décor se dessine dans la zone externe. Les aplats de paupière utilisent des bandes de même construction en haut et en bas. Le contour calculé, le premier raccord de cil et les marges du visage définissent une fenêtre d’implantation pour chaque paupière. Le calcul conserve les intervalles d’au moins neuf sondes contiguës sur 65.

| Réglage | Référence mesurable |
| --- | --- |
| Longueur des plis | Fraction de la largeur de la fenêtre utile. Les plis supérieurs courts se rapprochent de la tempe. |
| Distance, courbure et épaisseur | Profondeur utile mesurée sous ou au-dessus du contour. Elle est plafonnée à 29 % ou 35 % de la largeur de l’ouverture selon le côté. La distance ajoute jusqu’à 33 % de cette profondeur, la courbure module le bombement jusqu’à 13 % et l’épaisseur atteint 16,5 %. Un second pli nécessite au moins 0,90 unité de profondeur utile. |
| Cernes | Largeur relative à la fenêtre inférieure. La hauteur monte à 29 % de la profondeur utile. L’intensité joue sur l’assombrissement et la désaturation de la peau. |
| Poches | Largeur relative à la même fenêtre inférieure. Le volume modifie la profondeur de l’aplat jusqu’à 48 % de la profondeur utile et la force de l’ombre. Le pli inférieur reste réglable indépendamment. |
| Intensité des plis | Aplat dérivé de la teinte de peau, avec une intensité nulle qui laisse le pli en mémoire. |

### Domaines, archives et limites constatées

Les curseurs indexent les valeurs admissibles en direct, avec des intervalles distincts si nécessaire. Les réglages géométriques d’un pli sans tracé, la largeur ou la hauteur d’un cerne sans intensité et la largeur d’une poche sans volume restent latents. Pour un cil redimensionné, l’interface indique la demande et la valeur appliquée. L’archive v3 enregistre les deux à pleine précision. Les archives v1 et v2 gardent leurs formats et leurs graines. La graine des détails utilise le flux indépendant `details-xoshiro128ss-v1`.

Les 65 sondes et la projection locale décrivent la marge visible à la résolution du générateur. Les découpes géométriques contrôlent les bords entre les sondes. Dans une configuration serrée, la partie du contour proche du voisinage s’amincit. Selon le contour et la morphologie, un second pli supérieur peut rester latent. L’anticrénelage varie sur le premier pixel du bord entre les moteurs. Les essais de continuité évaluent le trait peint au-dessus d’un seuil d’alpha de 80/255, avec une composante comptée à partir de quatre pixels. Les nuances d’un cran qui restent mesurables en gros plan sont conservées.

L’atelier utilise la couleur de peau du moteur hérité. Les essais du calcul des ombres incluent trois tons de peau. La vérification tactile utilise Chromium et WebKit avec un profil mobile aux dimensions d’un iPad. La validation artistique et fonctionnelle sur iPad physique appartient au porteur du projet.

## Tirage de démonstration

Le tirage sélectionne d’abord les contours parmi leurs crans admissibles. Il choisit le nombre de pointes, puis l’espacement et la longueur parmi les valeurs autorisées. Une fois les fenêtres calculées, il tire le nombre de plis et leurs paramètres, puis les ombres. Chaque tirage de valeur utilise une distribution uniforme dans son domaine conditionnel. Les paramètres inactifs gardent des valeurs latentes. Cette politique d’atelier fait varier les apparences sans définir de fréquence biologique.

## Résultats de recette

| Recette | Résultat |
| --- | --- |
| T1 · Historique | 2 268 égalités SVG sur 126 références, trois formats et trois états hérités. 54 comparaisons SVG et raster identiques par navigateur, avec les deux fonds et les neuf ouvertures. |
| T2 · Paupières | Les neuf combinaisons indépendantes de zéro à deux plis passent sur la forme étroite. Six variantes supérieures et les extrêmes de distance, longueur, courbure, épaisseur et intensité donnent des tracés distincts. |
| T3 · Cils et contours | 576 cas vectoriels contrôlés pour le raccord, le miroir et l’orientation. Les quatre nombres de pointes produisent quatre silhouettes raster distinctes. Sur 288 découpes par navigateur, le trait peint forme une composante continue avec au plus un pixel isolé d’anticrénelage. |
| T4 · Cernes et poches | Quatre rendus raster distincts couvrent la combinaison, l’absence et l’activation indépendante des deux ombres. Trois couleurs de peau vérifiées dans le calcul des aplats. |
| T5 · Domaines | 1 859 crans admissibles balayés sur une ouverture étroite et autant d’états SVG distincts. Dans onze cas sur 72, la longueur maximale de cil descend sous 15 %. Dans le témoin serré, une demande de 15 % s’applique à 10,080675330156817 %, puis revient à 15 % dans une enveloppe plus ample. |
| T6 · Compatibilité | Huit morphologies × neuf ouvertures × trois états de pigments, soit 216 états. Les comparaisons confirment les ancrages et le SVG hérité hors ajout. Zéro pixel hors du visage et zéro pénétration dans l’intérieur de l’ouverture au-delà du premier pixel d’anticrénelage, sur 288 découpes par navigateur. |
| T7 · Archives | Documents v1 et v2 identiques à la base. Documents v3 actifs ou latents, valeurs fractionnaires et graine reconstruits exactement. Import à froid vérifié aux trois échelles sous Chromium et WebKit, avec iris et hétérochromie hérités. |
| T8 · Tirage | 3 072 graines distinctes sur trois configurations, toutes admissibles et rejouées à l’identique. Effectifs des plis, des pointes et des plafonds comparés aux attentes conditionnelles. |
| T9 · Atelier et suites héritées | Tête 300 px, corps 178 px et miniature 70 × 70 px. Portrait, paysage et fenêtre 390 px, deux fonds, interactions tactiles et clavier. 72 tests Node hérités, 19 tests Node des anciens lots et tous les parcours Chromium et WebKit hérités ont réussi. |
| T10 · Preuves et publication | Exécution et vérification publique détaillées ci-dessous. |

La variation d’intensité d’un pli de 54 à 55 % modifie 2 166 canaux RGBA en gros plan, 17 à l’échelle tête, un à l’échelle corps et zéro en miniature dans la recette locale. Les deux navigateurs conservent ce cran pour le gros plan. [Mesures locales](preuves/recette-locale.json) · [Atelier WebKit](preuves/atelier-webkit.png) · [Comparaison aux trois échelles](preuves/trois-echelles-webkit.png)

## Rejouer la recette

```sh
npm ci
npx playwright install chromium webkit
node --test tests/*.test.js bio-col-01/tests/model.test.mjs bio-yeux-01/tests/model.test.mjs bio-yeux-01/tests/corrections-*.test.mjs bio-yeux-01/tests/iris.test.mjs bio-yeux-01/tests/details.test.mjs
node bio-yeux-01/tests/details-browser.cjs
node bio-yeux-01/tests/iris-browser.cjs
node bio-yeux-01/tests/corrections-browser.cjs
node bio-col-01/tests/browser.cjs
node bio-col-01/tests/legacy.cjs
npm run test:browser
BASE_URL=https://thsethse.github.io/Microcosme/preview/bio-yeux-03/ node bio-yeux-01/tests/details-browser.cjs
```

Le workflow récupère les trois références historiques des coiffures et rejoue la version des formes d’yeux antérieure aux corrections A/B/C. Les essais locaux utilisent Node 24.22.3, Chromium 151.0.7922.34 et WebKit 26.5. [Workflow](../../../.github/workflows/bio-yeux-01.yml) · [Recette Node](../../../bio-yeux-01/tests/details.test.mjs) · [Recette navigateur](../../../bio-yeux-01/tests/details-browser.cjs)

## Publication

La recette Chromium et WebKit a réussi également à l’URL publique. Le contrôle HTTPS a vérifié les empreintes SHA-256 des 16 fichiers de la preview et des 171 ressources héritées. Le commit `f01b5ef` sur `main` ajoute uniquement le dossier statique `preview/bio-yeux-03/`, conformément à l’autorisation de publication. Les fichiers dérivent du commit d’implémentation `d17a217`. La PR reste ouverte en brouillon pour la validation sur iPad physique.

[Preview publique](https://thsethse.github.io/Microcosme/preview/bio-yeux-03/) · [PR #50](https://github.com/Thsethse/Microcosme/pull/50) · [Déploiement Pages](https://github.com/Thsethse/Microcosme/actions/runs/45489648974) · [Recette publique](preuves/recette-publique.json) · [Empreintes vérifiées](preuves/ressources-pages.json)
