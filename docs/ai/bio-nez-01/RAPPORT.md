# BIO-NEZ-01 — Rapport de recette

La branche `codex/bio-nez-01` part du contrat `c05af54` et de BIO-BOUCHE-01. L’atelier ajoute neuf paramètres, neuf morphologies frontales et trois réglages de détail. Le comparateur permet de reprendre le nez historique avec les personnalisations du reste du visage. [Contrat](CONTRAT.md)

## Géométrie et traitement graphique

Sept segments cubiques par côté décrivent les demi-largeurs du profil. Leur ordonnée est linéaire dans chaque segment et leurs abscisses sont monotones entre les nœuds. Leurs extrêmes sont donc déterminés par les extrémités de chaque segment. La racine, l’arête, la pointe, les ailes, les narines et la base exploitent les sections du même profil. L’enveloppe est symétrique autour de l’abscisse de l’ancrage hérité. Elle garde cet ancrage quelle que soit la longueur ou le volume choisi. [Planche des neuf morphologies](preuves/neuf-morphologies-webkit.png)

| Paramètre | Référence mesurable |
| --- | --- |
| Longueur | À 100 %, l’empan de référence vaut 26,5 % du demi-axe vertical de la tête. Le haut s’étend de 0,74 fois cet empan au-dessus de l’ancrage et le bas de 0,42 fois cet empan au-dessous, avant le volume de pointe. |
| Largeur de l’arête | La référence vaut 8,0 % du demi-axe horizontal. Cette demi-largeur pilote les premières sections jusqu’aux épaules. |
| Largeur des ailes | La référence à 100 % vaut 16,5 % du demi-axe horizontal, de chaque côté. Cette valeur contrôle la partie basse du contour. |
| Volume de la pointe | À partir du neutre, l’écart à 100 % multiplie 5,8 % du demi-axe vertical et déplace le bas de l’enveloppe. Le volume change aussi l’étendue de la pointe. |
| Arrondi de la pointe | Modifie la demi-largeur des sections proches du bas et la forme de l’aplat central. Il garde fixe la hauteur totale. |
| Taille des narines | Demi-axes de référence de 2,2 % du demi-axe horizontal et 1,05 % du demi-axe vertical. À zéro, les narines disparaissent. |
| Inclinaison des narines | De −28° à +28° pour la narine à droite de l’image dans le repère SVG. La rotation est en miroir à gauche. |
| Intensité des aplats | Force de la variation par canal sRGB depuis la couleur de peau. Elle règle principalement les plans de l’arête, de la racine, de la pointe et des ailes. |
| Intensité des traits | Force de l’assombrissement des narines, de la base et des accents d’arête. Les accents sont des bandes pleines à épaisseur géométrique incluse. |

La teinte de peau de l’atelier hérité est `#dbbf88`. L’arête l’assombrit légèrement, les ailes reçoivent une ombre douce et la pointe un éclaircissement local. Les trois degrés utilisent respectivement les couples aplats et traits 28/0, 45/40 et 77/83. Leur sélection conserve les réglages morphologiques existants, y compris la taille des narines. Trois autres tons ont vérifié la dérivation des couleurs et le contraste du relief.

## Enveloppes anatomiques et interaction avec la bouche

La limite horizontale se mesure séparément vers chacune des verticales des pupilles au repos. L’arête est vérifiée par tranche contre les ouvertures et les empreintes des détails d’yeux actifs. À chaque tranche concernée, le moteur évalue la demi-largeur maximale exacte du profil. La marge oculaire vaut le maximum de 0,18 unité SVG et 0,6 % du demi-axe vertical de la tête. Les rectangles des détails d’yeux sont conservateurs avant leur recadrage par l’ouverture.

Le contour facial est lu sur ses vraies cubiques, avec le demi-trait facial de 2,1 unités SVG et une marge du maximum de 0,40 unité et 1,2 % du demi-axe vertical. Un corridor analytique commun est utilisé quand il garantit le placement. Sinon le candidat est vérifié sur son propre intervalle vertical. L’ellipse de chaque narine, rotation comprise, est contrôlée sur le rectangle qui la contient. Le calcul réserve 0,13 unité latérale devant la silhouette et au moins 0,12 unité de chaque côté du milieu. Les accents intérieurs restent dans des rectangles inscrits dans les sections du même profil. Le SVG du nez ne comporte aucun masque correctif.

Le nez fournit à `solveMouth` son rectangle anatomique par `noseBounds`. La même marge que BIO-BOUCHE-01 s’applique, soit le maximum de 0,62 unité SVG et 1,6 % du demi-axe vertical. L’enveloppe du nez reste constante quand seules les intensités changent. Une bouche historique réserve toute l’emprise de son dessin peint. Une bouche personnalisée réserve au minimum l’espace du trait admissible à son ancrage. Le nez est résolu en premier avec cette contrainte. Le solveur de bouche repart de la demande d’origine si le nez modifie l’espace disponible.

Une demande de bouche encore compatible conserve toutes ses valeurs effectives. En cas de conflit, le moteur essaie d’abord de modifier un seul axe, en donnant la priorité au volume supérieur, puis à l’épaisseur, aux commissures, à la courbure, au volume inférieur et à la largeur. Quand aucun changement unitaire ne suffit, il résout la combinaison puis retente les valeurs demandées. Les préférences et leurs graines ne sont pas écrasées. L’atelier affiche chaque valeur demandée et effective et rend de nouveau disponibles les crans libérés. En cas d’impossibilité, il signale l’arbitrage et suspend la personnalisation concernée. Les deux solveurs travaillent dans un seul sens, du nez vers la bouche, sans réinjecter de valeurs effectives dans les demandes.

Les domaines testent chaque cran, puis raffinent les transitions détectées pour afficher les bornes fractionnaires. L’inclinaison reste latente en l’absence de narines visibles. Quand le relief est entièrement masqué, les axes géométriques restent en mémoire et l’enveloppe continue de protéger la bouche. Comme pour BIO-BOUCHE-01, une île admissible plus étroite qu’un cran peut échapper à l’échantillonnage si elle ne contient pas non plus la valeur appliquée. Les valeurs utilisées font toujours l’objet d’un contrôle anatomique.

## Archives et tirage

Les archives v1 à v5 conservent leur format. La v6 ajoute les réglages du nez, leur enveloppe et les valeurs effectives de la bouche recalculées. Elle garde séparément les demandes initiales et les graines. Le tirage du nez utilise le flux `nose-xoshiro128ss-v1`. Il tire les intensités puis les valeurs géométriques dans les domaines entiers admissibles à chaque étape, avant la résolution de la bouche. La distribution décrit l’atelier et ne fixe aucune fréquence biologique.

## Résultats

| Recette | Résultat |
| --- | --- |
| T1 · Historique | 2 268 égalités SVG sur 126 références, trois tailles et trois états hérités. 54 comparaisons SVG et raster identiques par navigateur. 2 430 audits sans conflit, dont 256 sommets des plages morphologiques avec les neuf ouvertures. |
| T2 · Morphologies | Neuf signatures vectorielles et raster distinctes. Les six régions découlent de la même géométrie. Le test distingue notamment le volume de pointe de son arrondi. |
| T3 · Domaines | 1 174 crans distincts par axe sur le témoin. Exemple de plafond fractionnaire du volume à 163,23409447 % avec une bouche historique. L’inclinaison et la taille masquées restent latentes. |
| T4 · Couleurs | Trois degrés de détail distincts en raster. Quatre tons de peau vérifiés. Les narines disparaissent à taille zéro ou intensité des traits nulle. |
| T5 · Invariant nasal | 1 152 combinaisons extrêmes, huit morphologies et neuf ouvertures. Conservation des éléments hérités hors nez et bouche sur 126 références. Sur 144 cas raster par moteur, aucun chevauchement avec l’œil, ses détails, la bouche ou le trait facial, et aucun débordement des narines ni des verticales pupillaires. |
| T6 · Interaction | Dans le témoin Node, le haut de la bouche passe de 180 à 67,11153162 %, puis revient exactement à 180 % après 30 cycles. L’atelier reproduit le même plafond avec sa préférence initiale de 173 %. Les autres réglages restent identiques. Le relief masqué n’affecte pas la bouche. Cas sans solution, tirage des deux modules et ordre d’édition vérifiés. |
| T7 · Sauvegardes | Archives v1 à v5 identiques. Couplage, états latents, enveloppe et graines v6 reproduits à froid aux trois échelles. La modification d’une valeur effective enregistrée est détectée à l’import. |
| T8 · Tirage | 2 304 graines admissibles rejouées sur trois configurations. Les 96 longueurs discrètes ont été tirées dans chaque échantillon. Les 36 observations cumulées aux deux bornes se répartissent entre les trois échantillons sans repli ni concentration au plafond. |
| T9 · Atelier | Trois échelles de 300, 178 et 70 × 70 px, deux fonds, trois largeurs de fenêtre, clavier et toucher. Les 96 tests Node hérités et les 19 tests Node des anciens lots ont réussi, de même que leurs parcours Chromium et WebKit. Le catalogue actuel utilise l’état adulte. Le même solveur a aussi été vérifié sur l’état âgé du moteur frontal amont. |
| T10 · Preview | Vérification publique détaillée dans la section Publication. |

L’arrondi de 50 à 51 % change 415 canaux RGBA en gros plan dans Chromium et 420 dans WebKit, contre 19 à l’échelle tête, 4 à l’échelle corps et zéro en miniature. La variation reste disponible pour la vue détaillée. La vérification tactile emploie un profil mobile sur Chromium et WebKit sous Linux. La validation artistique et fonctionnelle sur iPad physique reste réservée au porteur du projet. [Mesures](preuves/recette-locale.json) · [Atelier WebKit](preuves/atelier-webkit.png) · [Comparaison aux trois tailles](preuves/trois-echelles-webkit.png)

## Rejouer la recette

```bash
npm ci
npx playwright install chromium webkit
node --test tests/*.test.js bio-col-01/tests/model.test.mjs bio-yeux-01/tests/model.test.mjs bio-yeux-01/tests/corrections-*.test.mjs bio-yeux-01/tests/{iris,details,brows,mouth,nose}.test.mjs
node bio-yeux-01/tests/nose-browser.cjs
node bio-yeux-01/tests/mouth-browser.cjs
node bio-yeux-01/tests/brows-browser.cjs
node bio-yeux-01/tests/details-browser.cjs
node bio-yeux-01/tests/iris-browser.cjs
node bio-yeux-01/tests/corrections-browser.cjs
node bio-col-01/tests/browser.cjs
node bio-col-01/tests/legacy.cjs
npm run test:browser
BASE_URL=https://thsethse.github.io/Microcosme/preview/bio-nez-01/ node bio-yeux-01/tests/nose-browser.cjs
```

Le workflow rejoue aussi les références originales de coiffures et l’atelier des yeux avant les corrections A/B/C. Les versions locales sont Node 24.22.3, Chromium 151.0.7922.34 et WebKit 26.5. [Workflow](../../../.github/workflows/bio-yeux-01.yml) · [Recette Node](../../../bio-yeux-01/tests/nose.test.mjs) · [Recette navigateur](../../../bio-yeux-01/tests/nose-browser.cjs)

## Publication

La recette Chromium et WebKit a réussi sur la preview publique. Le contrôle HTTPS a confirmé les empreintes SHA-256 des 22 fichiers de la preview et des 225 ressources héritées. Le commit `2455280` sur `main` ajoute uniquement le dossier statique `preview/bio-nez-01/`. La preview dérive du commit d’implémentation `58d0b37`. La PR reste ouverte en brouillon pour validation.

[Preview publique](https://thsethse.github.io/Microcosme/preview/bio-nez-01/) · [PR #53](https://github.com/Thsethse/Microcosme/pull/53) · [Déploiement Pages](https://github.com/Thsethse/Microcosme/actions/runs/45502441321) · [Recette publique](preuves/recette-publique.json) · [Empreintes vérifiées](preuves/ressources-pages.json)
