# BIO-CORPS-03 — Corpulence globale

L’atelier présente un curseur de corpulence dans **Personnage et palette → Corps** pour les bases adultes H et F. La planche montre les neuf repères, les ossatures fines et larges et les combinaisons de bornes aux trois échelles. [Éditeur](https://thsethse.github.io/Microcosme/preview/bio-corps-03/#personnage) · [Planche de la corpulence](https://thsethse.github.io/Microcosme/preview/bio-corps-03/#planche-corpulence)

## Révisions

| Élément | Révision |
| --- | --- |
| Départ | `docs/bio-corps-03` à `d094efc31172f93ea54e604846b9f0815e6bf11b`. [Contrat](https://github.com/Thsethse/Microcosme/blob/d094efc31172f93ea54e604846b9f0815e6bf11b/docs/ai/bio-corps-03/CONTRAT.md) |
| Référence validée | BIO-CORPS-02, code `c6906c120c78cea8438f3713753be46e9a26ed70`, publication `e22acf8f12fa1181f8aa407e7d7526c01ba06932`. [Preview de référence](https://thsethse.github.io/Microcosme/preview/bio-corps-02/) |
| Code publié | `244dc7867eadab8df7d24d0e9c64aee47a850646`. [Arbre source](https://github.com/Thsethse/Microcosme/tree/244dc7867eadab8df7d24d0e9c64aee47a850646) |
| Publication Pages | `f5e68d4fe1df16e9f59fad0474da9a51140bd674`, ajout sous `preview/bio-corps-03/`. [Commit Pages](https://github.com/Thsethse/Microcosme/commit/f5e68d4fe1df16e9f59fad0474da9a51140bd674) · [Manifeste](https://thsethse.github.io/Microcosme/preview/bio-corps-03/version.json) |

## Géométrie et coefficients

Le contour résulte de l’ossature BIO-CORPS-02 et d’une courbe de variation horizontale. À chaque repère, l’amplitude proposée est la demi-largeur de **référence** H ou F multipliée par le coefficient de la région. Pour une corpulence `c`, on pose `t = (c − 50) / 50`. Le facteur de variation `0,78t + 0,22t²` vaut −0,56 à 0 %, 0 à 50 % et 1 à 100 %. Sa pente est strictement positive. Le contour reçoit l’amplitude multipliée par ce facteur. Les cubiques d’ossature et de corpulence partagent les mêmes ordonnées et leurs tangentes s’additionnent. À 50 %, le tracé d’ossature donne directement le SVG validé. [Coefficients et réponse](https://github.com/Thsethse/Microcosme/blob/244dc7867eadab8df7d24d0e9c64aee47a850646/bio-yeux-01/body-corpulence.mjs#L1-L26) · [Composition du contour](https://github.com/Thsethse/Microcosme/blob/244dc7867eadab8df7d24d0e9c64aee47a850646/bio-yeux-01/adult-body.mjs#L39-L108)

| Région | Base H | Base F |
| --- | ---: | ---: |
| Cou | 0,10 | 0,10 |
| Épaules | 0,10 | 0,10 |
| Thorax | 0,29 | 0,29 |
| Taille | 0,47 | 0,47 |
| Abdomen | 0,69 | 0,47 |
| Hanches | 0,47 | 0,69 |
| Base pelvienne | 0,40 | 0,50 |
| Base du pion | 0,29 | 0,29 |

La base pelvienne fait la transition entre les hanches et le flanc inférieur. Les coefficients décrivent le rendu proposé. Par exemple, à ossature de référence, la demi-largeur abdominale de H va de 23,32 à 64,22 unités SVG, en passant par 38 unités à 50 %. La demi-largeur des hanches de F va de 25,77 à 70,98 unités, en passant par 42 unités. À corpulence égale, l’écart horizontal entre deux ossatures est conservé puisque l’amplitude s’applique par profil de référence. Les essais confirment la croissance des surfaces visibles et la stabilité du raccord inférieur. [Demi-largeurs de référence](https://github.com/Thsethse/Microcosme/blob/244dc7867eadab8df7d24d0e9c64aee47a850646/bio-yeux-01/adult-body.mjs#L13-L22) · [Contrôles de continuité et d’indépendance](https://github.com/Thsethse/Microcosme/blob/244dc7867eadab8df7d24d0e9c64aee47a850646/bio-yeux-01/tests/body-corpulence.test.mjs)

Les six paramètres d’ossature et toutes les ordonnées gardent leurs valeurs pendant une variation de corpulence. Les sept niveaux, la hauteur, le point d’appui et la proportion du tiers inférieur suivent le calcul vertical déjà validé. L’intervalle complet 0–100 reste admissible sur les bases H et F. Les côtés progressent dans les mêmes intervalles verticaux et restent du même côté de l’axe jusqu’à la terminaison. L’interface expose un curseur continu et affiche le nom des repères lorsqu’ils sont atteints. [Repères, tangentes et fermeture](https://github.com/Thsethse/Microcosme/blob/244dc7867eadab8df7d24d0e9c64aee47a850646/bio-yeux-01/adult-body.mjs#L24-L102) · [Interface](https://github.com/Thsethse/Microcosme/blob/244dc7867eadab8df7d24d0e9c64aee47a850646/bio-yeux-01/app.mjs#L330-L360)

## Protection du visage

La livraison applique le repli corps seul prévu par BIO-CORPS-INV-02. Le trajet capillaire, la barbe et les surfaces de marques et de maquillage utilisent le contour facial dans leurs modèles. Un essai sur 61-G a augmenté les joues, les bajoues et la mâchoire à 1,08, 1,12 et 1,06. La coordonnée horizontale de l’ancrage capillaire droit est passée de 111,45 à 113,76 et le tracé des mèches longues a changé. Une variation appliquée uniquement au chemin de peau laisserait les masques calculés depuis leur contour précédent. La non-régression faciale d’une variation périphérique n’a donc pas pu être établie dans ce lot. Le rendu livré applique la corpulence au groupe `body-shape`, en prenant le repère de menton issu du visage validé. Les essais comparent le reste du SVG à l’octet, avec modules faciaux actifs. [Modèle et ancrages capillaires](https://github.com/Thsethse/Microcosme/blob/244dc7867eadab8df7d24d0e9c64aee47a850646/preview/bio-vis-p5-i6/i5/i4/i3/i2/i1/base/r1/model.mjs#L31-L50) · [Barbe](https://github.com/Thsethse/Microcosme/blob/244dc7867eadab8df7d24d0e9c64aee47a850646/bio-yeux-01/beard.mjs#L79-L103) · [Surface cutanée](https://github.com/Thsethse/Microcosme/blob/244dc7867eadab8df7d24d0e9c64aee47a850646/bio-yeux-01/surface.mjs#L1-L24) · [Masque de maquillage](https://github.com/Thsethse/Microcosme/blob/244dc7867eadab8df7d24d0e9c64aee47a850646/bio-yeux-01/makeup-render.mjs#L294-L313) · [Insertion dans le seul calque corporel](https://github.com/Thsethse/Microcosme/blob/244dc7867eadab8df7d24d0e9c64aee47a850646/bio-yeux-01/render.mjs#L83-L108)

## Persistance et planche

L’apparence complète v13 conserve `character.corpulence` en pourcentage, avec la base et les largeurs d’ossature lorsqu’elles ont été réglées. Le contrôle accepte les valeurs fractionnaires et restitue la valeur exacte du JSON. Les archives v1 à v12 retrouvent la référence 50 %. Réinitialiser la corpulence ramène la base active à 50 % et conserve ses largeurs. Les bases H et F mémorisent séparément leurs réglages pendant la session. La sélection historique brute garde ses données d’origine. Les six silhouettes historiques gardent leur sélecteur et archives usuels. [Export et validation](https://github.com/Thsethse/Microcosme/blob/244dc7867eadab8df7d24d0e9c64aee47a850646/bio-yeux-01/appearance.mjs#L146-L215) · [Sélection et états historiques](https://github.com/Thsethse/Microcosme/blob/244dc7867eadab8df7d24d0e9c64aee47a850646/bio-yeux-01/catalogue.mjs#L15-L27) · [Réinitialisation](https://github.com/Thsethse/Microcosme/blob/244dc7867eadab8df7d24d0e9c64aee47a850646/bio-yeux-01/app.mjs#L489-L503)

La planche expose 18 silhouettes de référence et 20 comparaisons de combinaisons. Les ossatures fines et larges sont montrées à 0, 50 et 100 %. Les ossatures à tous leurs minima ou maxima sont montrées à 0 et 100 %. Le menu d’échelle emploie les cadres historiques de tête 300 px, corps 178 px et miniature 70 × 70 px. Les témoins de la planche utilisent une coupe rasée pour laisser les flancs visibles. Les cadrages rapprochés peuvent masquer le bas du pion. [Construction de la planche](https://github.com/Thsethse/Microcosme/blob/244dc7867eadab8df7d24d0e9c64aee47a850646/bio-yeux-01/corpulence-study.mjs#L1-L31)

## Résultats

| Contrôle | Résultat |
| --- | --- |
| Géométrie et protection du visage | Six tests ciblés. 660 comparaisons de calques à 50 % avec le moteur de BIO-CORPS-02. 8 640 géométries couvrent les 64 coins de l’ossature et 32 tuples échantillonnés, croisés avec cinq visages, deux bases et neuf corpulences. Contrôle de la symétrie, des tangentes, de la monotonie des abscisses, des invariants verticaux et de l’ancrage. Les contrôles du visage et des modules hors corps comparent leur SVG sur des coiffures et des réglages actifs. |
| Suites Node | 126 tests des ateliers (`bio-col-01` et `bio-yeux-01`) et 35 tests du jeu, tous réussis. La suite des ateliers inclut les six tests ciblés de ce lot. |
| Balayage raster | Balayage à l’échelle corps (178 px) par pas de 0,5 point. Chromium 151 et WebKit 26.5 produisent chacun 1 206 rasters distincts au sein des six séries H/F, référence et toutes largeurs minimales ou maximales. Pour chacune des séries, la surface visible augmente à chaque repère. |
| Preview locale et publique | Chromium 151 et WebKit 26.5, profil iPad émulé. Par moteur et par distribution, 24 rendus historiques exacts, six comparaisons supplémentaires à 50 % avec des ossatures réglées, neuf rasters distincts par base et par échelle, 18 contrôles verticaux et deux restaurations d’apparence v13 à froid. Les 38 silhouettes de la planche sont vérifiées aux trois échelles, à des largeurs de 390, 820 et 1 180 px. Un essai public séparé confirme la saisie tactile, les touches Début et Fin et l’ouverture directe de la planche. |
| Suites navigateur héritées | Atelier et jeu sous Chromium et WebKit. L’atelier restaure ses archives aux trois échelles, rejoue 256 graines et restitue 144 entrées de catalogue par moteur. L’interface tactile du jeu, la mémoire restaurée et le mode hors ligne passent dans les deux moteurs. |
| Publication | GitHub Pages a construit la révision de publication. L’URL publique répond HTTP 200. Les empreintes SHA-256 des 42 fichiers du lot et des 484 dépendances héritées concordent avec le manifeste public. |

[Tests Node](https://github.com/Thsethse/Microcosme/blob/244dc7867eadab8df7d24d0e9c64aee47a850646/bio-yeux-01/tests/body-corpulence.test.mjs) · [Recette navigateur](https://github.com/Thsethse/Microcosme/blob/codex/bio-corps-03/bio-yeux-01/tests/body-browser.cjs) · [Construction Pages](https://github.com/Thsethse/Microcosme/blob/244dc7867eadab8df7d24d0e9c64aee47a850646/bio-yeux-01/build-corpulence-preview.mjs)

### Rejouer

```sh
npm ci
npx playwright install chromium webkit
npm test
npm run test:browser
node --test bio-col-01/tests/*.test.mjs bio-yeux-01/tests/*.test.mjs
node bio-yeux-01/build-corpulence-preview.mjs /tmp/microcosme-corpulence e22acf8f12fa1181f8aa407e7d7526c01ba06932 244dc7867eadab8df7d24d0e9c64aee47a850646
PREVIEW_MISSION=BIO-CORPS-03 PREVIEW_DIR=/tmp/microcosme-corpulence node bio-yeux-01/tests/body-browser.cjs
PREVIEW_MISSION=BIO-CORPS-03 node bio-yeux-01/tests/body-browser.cjs
```

La recette navigateur utilise un profil iPad émulé. La validation artistique des coefficients et de la lisibilité sur iPad physique revient au porteur avant BIO-CORPS-04.
