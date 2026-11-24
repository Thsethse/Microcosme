# BIO-SOURCILS-01 — Rapport de recette

La branche `codex/bio-sourcils-01` part du contrat `7a9d7e2` et du moteur BIO-YEUX-03. L’atelier ajoute les neuf paramètres géométriques, les neuf silhouettes de référence, les trois modes chromatiques et les trois particularités. Le comparateur conserve la coiffure, les yeux, les iris, les paupières et les cils courants lorsqu’il affiche les sourcils historiques. [Contrat](CONTRAT.md)

## Géométrie permanente

Les neuf silhouettes utilisent la même bande pleine. Le profil relie la racine, le sommet et la pointe avec deux cubiques en hauteur. Les bords suivent une épaisseur variable et se rejoignent aux extrémités. L’angularité agit sur les poignées au sommet. Un sommet tardif et une angularité basse permettent à la première cubique de se creuser avant de remonter, ce qui produit la contre-courbure de la forme en S. Sur le témoin, la ligne médiane passe de +1,803 à −4,840 unités SVG par rapport à la droite entre la racine et la pointe. La variation locale de courbure change aussi de signe. [Planche des neuf silhouettes](preuves/neuf-silhouettes-webkit.png)

Le profil permanent est calculé en coordonnées locales. Une étape distincte le place dans le visage, le reflète et construit la jonction ou la fente. L’archive stocke la morphologie et les choix de placement permanents.

| Paramètre | Référence dans le visage |
| --- | --- |
| Longueur | Projection horizontale de la racine à la pointe. La référence historique vaut 1,7 fois le demi-empan de l’œil historique, soit `1,7 × 0,26 × rx`, où `rx` est le demi-axe horizontal de la tête. |
| Épaisseur | Hauteur maximale de référence de 2,2 unités SVG issue du trait historique, modulée le long du profil. |
| Hauteur d’arc | Amplitude de 0 à 12,5 % du demi-axe vertical de la tête. |
| Position du sommet | Fraction de la longueur depuis la racine interne, mesurée avant l’inclinaison. |
| Inclinaison | Pente de la ligne reliant les extrémités au moyen de la tangente de l’angle. Une valeur positive relève la pointe extérieure. |
| Angularité | Poignées des deux cubiques au sommet, du raccord arrondi à l’angle marqué. |
| Hauteur sur le visage | Translation verticale sur 20 % du demi-axe vertical de la tête depuis la limite inférieure locale. |
| Affinement de la pointe | Réduction progressive de l’épaisseur vers l’extérieur. |
| Écartement | Position horizontale des racines par rapport à la distance de référence au centre du visage. Le facteur varie de 0,55 à 1,45 et vaut 1 au neutre. |

Le profil reste dans un corridor mesuré sur le tracé facial hérité. Son sommet est à 34 % du demi-axe vertical au-dessus de l’ancrage historique du sourcil. Son bord inférieur garde 0,48 unité SVG de marge au-dessus de l’ouverture et de l’enveloppe des détails BIO-YEUX-03. La limite latérale est le minimum des distances au bord facial dans cette bande, avec une marge intérieure de 2,35 unités SVG.

Les domaines directs fixent les autres valeurs appliquées et testent chaque cran. L’atelier affiche les intervalles utiles et signale les écarts entre demande et application. En cas de demandes incompatibles après un changement de contexte, le solveur conserve l’écartement et la longueur autant que le permet la place horizontale. Il recale ensuite la hauteur disponible. Si la silhouette est trop haute pour toute position, les amplitudes sont récupérées par ordre d’épaisseur, d’arc et d’inclinaison. Les demandes initiales restent latentes.

Le profil est échantillonné à 41 positions, avec ajout du sommet et des bords de la fente. Les segments restent à l’intérieur de l’enveloppe mesurée. La limite latérale commune est conservatrice aux hauteurs où le visage est plus large. Les cheveux peuvent occulter une partie de la silhouette selon la coiffure et la hauteur. Les 126 références de la recette laissent une partie du témoin visible et 21 en couvrent partiellement la surface. Les captures locales de Chromium et WebKit utilisent un profil mobile aux dimensions d’un iPad. La validation artistique et fonctionnelle sur iPad physique appartient au porteur du projet.

## Couleurs et particularités

Les 26 nuances conservent les identifiants de BIO-COL-01. Le mode lié emploie l’aplat capillaire appliqué ou la couleur de base de la coiffure historique. Si le rendu ne contient pas de couche capillaire visible, il prend la teinte mémorisée par l’atelier. À défaut, il emploie le brun historique `#75470f` du moteur. Le mode assombri multiplie chaque canal sRGB de la même teinte par 0,88 et arrondit à l’octet. Le mode indépendant emploie directement le nuancier capillaire et son choix reste latent en mode lié.

L’absence est prioritaire et garde toutes les demandes en mémoire. Le monosourcil relie les racines dans une seule silhouette, avec une épaisseur réduite au centre. Le mode fendu retire une bande verticale à 76 % de la longueur sur le sourcil à droite de l’image. Sa largeur vaut 5,8 % de la longueur historique de référence, soit environ 0,74 unité SVG sur le visage neutre. La fente est compatible avec la jonction centrale.

## Archives et tirage de démonstration

Les archives v1 à v3 gardent leurs formats et leurs graines. L’archive v4 ajoute les demandes, valeurs effectives, états latents, pigment résolu et métadonnées du flux `brows-xoshiro128ss-v1`. La palette capillaire de l’archive fournit également la mémoire de teinte pour les coiffures sans couleur visible.

Le tirage choisit uniformément cinq états de démonstration, la paire, le monosourcil, la fente, la combinaison monosourcil et fente, et l’absence. Il choisit les trois modes chromatiques et les 26 identifiants dans leurs domaines. L’écartement et la longueur sont tirés dans la place disponible, puis l’inclinaison, l’épaisseur et l’arc en maintenant une hauteur entière admissible. La hauteur est choisie dans son domaine final. Ce tirage est conditionnel et ne rabat aucun résultat sur un plafond. Les fréquences décrivent l’atelier de démonstration.

## Résultats de recette

| Recette | Résultat |
| --- | --- |
| T1 · Historique | 2 268 égalités SVG sur 126 références, trois tailles et trois états hérités. Sous chaque navigateur, 54 comparaisons SVG et raster identiques avec les neuf ouvertures et les deux fonds. |
| T2 · Silhouettes | Neuf silhouettes distinctes dans les tracés comme dans les rasters. Une inflexion en S mesurée sur le contour médian commun. |
| T3 · Domaines | 878 crans utiles balayés et autant d’états SVG distincts par axe. Dans le témoin étroit, une demande de longueur à 125 % s’applique à 108,46525270409394 %. La hauteur demandée à 0 % s’applique à 58,41868133538199 %. Le changement de place rétablit 125 %. À arc nul, sommet et angularité restent latents. |
| T4 · Couleurs | Les 26 nuances héritées produisent 26 rasters distincts. Modes liés, assombris et indépendants vérifiés. Le rasé et la référence 63-G utilisent la mémoire capillaire, puis le brun historique en l’absence de mémoire. |
| T5 · Particularités | Le comptage des composantes peintes donne 2 pour la paire, 3 pour la paire fendue, 1 pour le monosourcil, 2 pour la jonction fendue et 0 pour l’absence. L’atelier restaure les réglages après l’absence. |
| T6 · Compatibilité | 1 728 combinaisons extrêmes, couvrant huit morphologies et neuf ouvertures. Le SVG hérité hors sourcils est identique sur les 126 références avec iris, paupières et cils actifs. Sur 144 cas raster par navigateur, aucun pixel de sourcil hors du visage ni en conflit avec les yeux ou leurs détails. |
| T7 · Archives | Documents v1 à v3 comparés à la base. Documents v4 actifs, absents ou latents restaurés à froid aux trois tailles. Réglages à précision complète, pigmentation et graines contrôlés. |
| T8 · Tirage | 3 072 graines admissibles et reproduites à l’identique sur trois configurations. Dans le sous-échantillon contrôlé, les plafonds de hauteur ont été tirés 4, 4 et 1 fois pour des attentes de 3,39, 3,41 et 3,70. |
| T9 · Interface et héritage | Tête 300 px, corps 178 px, miniature 70 × 70. Deux fonds, trois tailles de fenêtre, toucher et clavier. Les 80 tests Node hérités, les 19 tests Node des lots figés et les parcours navigateur hérités ont réussi. |
| T10 · Preview | Contrôles publics détaillés dans la section Publication. |

Un cran d’affinement de la pointe, de 65 à 66 %, change 408 canaux RGBA en gros plan, 24 à l’échelle tête, zéro à l’échelle corps et 6 en miniature sur le témoin. Ce réglage reste disponible pour la vue détaillée. [Mesures locales](preuves/recette-locale.json) · [Atelier WebKit](preuves/atelier-webkit.png) · [Comparaison aux trois tailles](preuves/trois-echelles-webkit.png)

## Rejouer la recette

```bash
npm ci
npx playwright install chromium webkit
node --test tests/*.test.js bio-col-01/tests/model.test.mjs bio-yeux-01/tests/model.test.mjs bio-yeux-01/tests/corrections-*.test.mjs bio-yeux-01/tests/{iris,details,brows}.test.mjs
node bio-yeux-01/tests/brows-browser.cjs
node bio-yeux-01/tests/details-browser.cjs
node bio-yeux-01/tests/iris-browser.cjs
node bio-yeux-01/tests/corrections-browser.cjs
node bio-col-01/tests/browser.cjs
node bio-col-01/tests/legacy.cjs
npm run test:browser
BASE_URL=https://thsethse.github.io/Microcosme/preview/bio-sourcils-01/ node bio-yeux-01/tests/brows-browser.cjs
```

Le workflow récupère les références historiques des coiffures et rejoue aussi l’atelier des formes d’yeux figé avant A/B/C. La recette locale utilise Node 24.22.3, Chromium 151.0.7922.34 et WebKit 26.5. [Workflow](../../../.github/workflows/bio-yeux-01.yml) · [Recette Node](../../../bio-yeux-01/tests/brows.test.mjs) · [Recette navigateur](../../../bio-yeux-01/tests/brows-browser.cjs)

## Publication

La recette Chromium et WebKit a réussi sur l’URL publique. La vérification HTTPS a confirmé les empreintes SHA-256 des 18 fichiers de la nouvelle preview et des 187 ressources héritées. Le commit autorisé `c14209f` ajoute uniquement `preview/bio-sourcils-01/` sur `main`. Le manifeste identifie le moteur publié au commit `14a93ee`. La PR reste ouverte en brouillon pour validation.

[Preview publique](https://thsethse.github.io/Microcosme/preview/bio-sourcils-01/) · [PR #51](https://github.com/Thsethse/Microcosme/pull/51) · [Déploiement Pages](https://github.com/Thsethse/Microcosme/actions/runs/45493729050) · [Recette publique](preuves/recette-publique.json) · [Empreintes vérifiées](preuves/ressources-pages.json)
