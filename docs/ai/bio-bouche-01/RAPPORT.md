# BIO-BOUCHE-01 — Rapport de recette

La branche `codex/bio-bouche-01` part du contrat `a68ec6b` et de BIO-SOURCILS-01. L’atelier ajoute neuf réglages et neuf silhouettes de bouche fermée. Le comparateur permet de retrouver la bouche historique tout en conservant les personnalisations des autres éléments du visage. Le rétablissement local préserve les autres réglages. [Contrat](CONTRAT.md)

## Géométrie permanente

Le même profil produit la lèvre supérieure, le séparateur et la lèvre inférieure. Les bords suivent des courbes de Bézier cubiques monotones en largeur et sont réfléchis de part et d’autre de l’ancrage historique. Les trois aplats partagent exactement les commissures. Chaque lèvre va jusqu’à la ligne médiane sous le séparateur afin de couvrir le raccord à l’anticrénelage. Les aplats extérieurs sont sans trait périphérique. Le séparateur est une bande pleine dont l’épaisseur diminue vers les commissures. En intensité zéro, cette bande forme à elle seule le trait de bouche. Le calcul permanent du profil et sa conversion en SVG sont distincts. [Planche des neuf silhouettes](preuves/neuf-silhouettes-webkit.png)

| Paramètre | Unité et influence |
| --- | --- |
| Largeur | Pourcentage du empan historique entre les commissures sur la ligne, soit 0,50 fois le demi-axe horizontal de la tête. L’ancrage reste fixe. |
| Volume supérieur | À 100 %, amplitude de 5,5 % du demi-axe vertical de la tête, au-dessus de la bande de séparation. |
| Volume inférieur | À 100 %, amplitude de 6,7 % du demi-axe vertical, sous la bande de séparation. |
| Arc de Cupidon | Mélange entre le bombement simple et deux sommets. L’arc marqué creuse le milieu de la lèvre supérieure. |
| Écartement des sommets | Position symétrique sur chaque demi-empan, depuis le milieu de la bouche. |
| Hauteur des commissures | Déplacement jusqu’à ±4,8 % du demi-axe vertical. Les valeurs positives relèvent les extrémités. La moitié centrale de la ligne reste fixe sur cet axe. |
| Courbure de séparation | Amplitude de 3,4 % du demi-axe vertical. Elle agit sur les épaules de la ligne et s’annule au centre et aux extrémités. |
| Intensité chromatique | Interpolation de 0 à 100 % de la peau vers deux teintes plus sombres dérivées de la même peau. Le volume reste latent à zéro. |
| Épaisseur de séparation | 100 % vaut 0,76 unité SVG au centre, soit 40 % du trait historique de 1,9 unité. |

À intensité positive, la lèvre supérieure est légèrement plus sombre que la lèvre inférieure. La séparation est plus sombre que les deux aplats. Le calcul multiplie chaque canal sRGB de la peau par une proportion propre à la couche. Les proportions à intensité maximale sont 0,82 / 0,66 / 0,66 pour le haut et 0,91 / 0,79 / 0,79 pour le bas. Le séparateur prend 0,47 / 0,38 / 0,41. Le générateur hérité emploie la teinte de peau `#dbbf88`. Trois autres teintes ont servi à vérifier le calcul, sans ajouter de palette au personnage.

## Limites anatomiques et domaines

Les deux limites horizontales proviennent de `pigmentCenters`, les centres au repos utilisés pour les pupilles historiques et personnalisées. Chaque bord est testé par rapport à sa propre verticale. La géométrie calcule ses extrêmes en résolvant les racines de la dérivée de chaque cubique. Le séparateur peint entre dans cette mesure, y compris en mode trait seul.

Le bas du nez provient du triangle peint dans le SVG hérité. Le solveur lit ses déplacements relatifs et calcule les extrema peints. Le fournisseur d’un futur nez pourra passer `noseBounds` dans les options de `solveMouth` ou `mouthFor`. L’objet attend `left`, `right`, `top` et `bottom` en unités SVG absolues, avec les épaisseurs de trait incluses. Le nez de production reste inchangé. La marge au nez vaut le maximum de 0,62 unité SVG et de 1,6 % du demi-axe vertical.

Pour la peau et le menton, le solveur lit le vrai contour de Bézier dans un corridor couvrant la largeur totale peinte. Il réserve la demi-épaisseur du trait facial, plus le maximum de 0,65 unité SVG et de 1,5 % du demi-axe vertical. Il prend le point le plus contraignant de ce corridor et vérifie que le rectangle de la bouche reste à l’intérieur. Cette méthode est conservatrice lorsque l’extrémité de la bouche est située plus haut que le point le plus bas de la lèvre. Les limites affichées incluent cette marge commune. Une réserve de `0,00001` unité couvre l’arrondi des coordonnées SVG au voisinage d’un plafond.

Les curseurs testent leurs crans à géométrie effective fixe et raffinent les frontières détectées pour conserver les limites fractionnaires. Ils peuvent associer plusieurs intervalles à un réglage. Une plage plus étroite qu’un cran et située entre deux échantillons peut échapper à la détection si elle ne contient pas non plus la valeur appliquée. L’anatomie reste vérifiée à chaque calcul. Si les réglages demandés deviennent incompatibles, le moteur récupère autant que possible la largeur, l’épaisseur, les commissures, la courbure, puis les volumes. L’atelier indique les écarts et conserve les demandes. Si même le trait minimal à l’ancrage ne tient pas, il suspend la personnalisation et indique qu’un arbitrage est requis.

### Vérification historique

Les 126 références et les 256 sommets des plages morphologiques ont été audités, soit 382 cas. Aucun conflit n’a été constaté. La mesure inclut les caps ronds du trait historique. Les plus petites distances mesurées atteignent 3,706 unités SVG jusqu’à une verticale pupillaire, 6,504 unités jusqu’au bas du nez et 2,635 unités au-delà de la marge déjà réservée devant le contour inférieur. Un essai avec des pupilles artificiellement décentrées et un essai au nez simulé déclenchent le diagnostic, tout en laissant le mode historique disponible.

## Archives et génération

L’archive v5 stocke les demandes, les valeurs appliquées et les états latents à pleine précision. Les versions v1 à v4 gardent leur contenu et leur capacité de rejeu. Le tirage local utilise `mouth-xoshiro128ss-v1`. Il choisit l’intensité et les réglages de Cupidon dans leurs plages nominales, puis tire uniformément chacun des six réglages de géométrie dans le domaine entier admissible au stade courant. Il conserve une géométrie latente admissible quand il tire le trait seul. Ces fréquences décrivent l’atelier de démonstration.

## Résultats

| Recette | Résultat |
| --- | --- |
| T1 · Historique | 2 268 égalités SVG avec la base sur 126 références, trois tailles et trois états hérités. 54 comparaisons SVG et raster identiques par moteur, avec 382 audits anatomiques historiques sans conflit. |
| T2 · Silhouettes | Neuf rasters distincts. Les frontières des trois parties partagent leurs commissures et conservent leur ordre sur le tracé. |
| T3 · Domaines | 1 269 crans directs distincts sur le témoin. Indépendance des volumes et des deux influences sur la séparation, arrêt fractionnaire, trait seul et réactivation des valeurs latentes vérifiés. |
| T4 · Couleurs | Valeurs supérieure, inférieure et séparation vérifiées sur quatre teintes de peau, dans le moteur et en raster. Intensité zéro rend un trait unique. |
| T5 · Horizontale | 432 comparaisons sur huit morphologies, neuf formes d’œil et six silhouettes de pupille. Le cas décentré simulé borne la largeur à 87,99986208265 % sur son côté limitant. |
| T6 · Verticale | 1 152 cas extrêmes et 126 comparaisons SVG hors bouche. 144 cas raster par navigateur sans débordement, recouvrement du trait facial ou intrusion dans la zone du nez. Le nez simulé ramène le haut à 44,98125264444 %. Dans un visage étroit réel, le curseur atteint la borne fractionnaire de 190,17957904155 % pour le bas. |
| T7 · Sauvegardes | Archives v1 à v4 identiques et v5 reproduites à froid aux trois tailles, y compris trait seul, réglages latents, précision et graines indépendantes. |
| T8 · Tirage | 3 072 graines rejouées à l’identique. Les 71 largeurs ont été atteintes dans chaque échantillon. Entre 14 et 16 tirages par échantillon atteignent le plafond de largeur, pour une attente de 14,42. |
| T9 · Interface et héritage | Tête 300 px, corps 178 px et miniature 70 × 70 px, deux fonds, trois largeurs de fenêtre, toucher et clavier. Suites Node, Chromium et WebKit héritées exécutées. |
| T10 · Publication | Vérification publique détaillée ci-dessous. |

Passer de 45 à 46 % d’arc de Cupidon modifie 215 canaux RGBA en gros plan, 15 à l’échelle tête, 4 à l’échelle corps et zéro en miniature sur le témoin. Le détail reste disponible en gros plan. Les essais tactiles ont utilisé Chromium et WebKit sous Linux avec un profil mobile. La validation artistique et fonctionnelle sur iPad physique reste réservée au porteur du projet. [Mesures](preuves/recette-locale.json) · [Atelier](preuves/atelier-webkit.png) · [Comparaison aux trois tailles](preuves/trois-echelles-webkit.png)

## Rejouer la recette

```bash
npm ci
npx playwright install chromium webkit
node --test tests/*.test.js bio-col-01/tests/model.test.mjs bio-yeux-01/tests/model.test.mjs bio-yeux-01/tests/corrections-*.test.mjs bio-yeux-01/tests/{iris,details,brows,mouth}.test.mjs
node bio-yeux-01/tests/mouth-browser.cjs
node bio-yeux-01/tests/brows-browser.cjs
node bio-yeux-01/tests/details-browser.cjs
node bio-yeux-01/tests/iris-browser.cjs
node bio-yeux-01/tests/corrections-browser.cjs
node bio-col-01/tests/browser.cjs
node bio-col-01/tests/legacy.cjs
npm run test:browser
BASE_URL=https://thsethse.github.io/Microcosme/preview/bio-bouche-01/ node bio-yeux-01/tests/mouth-browser.cjs
```

Le workflow rejoue aussi les références historiques des coiffures et l’atelier des yeux avant A/B/C. Les versions locales sont Node 24.22.3, Chromium 151.0.7922.34 et WebKit 26.5. [Workflow](../../../.github/workflows/bio-yeux-01.yml) · [Recette Node](../../../bio-yeux-01/tests/mouth.test.mjs) · [Recette navigateur](../../../bio-yeux-01/tests/mouth-browser.cjs)

## Publication

La recette Chromium et WebKit a réussi sur l’URL publique. Le contrôle HTTPS a confirmé les empreintes SHA-256 des 20 fichiers de la preview et des 205 ressources héritées. Le commit autorisé `5a3816e` sur `main` ajoute uniquement `preview/bio-bouche-01/`. La version publiée est issue du commit d’implémentation `00e6496`. La PR reste ouverte en brouillon.

[Preview publique](https://thsethse.github.io/Microcosme/preview/bio-bouche-01/) · [PR #52](https://github.com/Thsethse/Microcosme/pull/52) · [Déploiement Pages](https://github.com/Thsethse/Microcosme/actions/runs/45498181744) · [Recette publique](preuves/recette-publique.json) · [Empreintes vérifiées](preuves/ressources-pages.json)
