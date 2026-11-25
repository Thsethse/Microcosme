# BIO-CORPS-02 — Paramétrage de l’ossature

Les bases adultes H et F disposent de six curseurs dans **Personnage et palette → Ossature**. L’aperçu du corps suit le réglage courant. La planche compare les deux bases à la référence, aux extrêmes de chaque axe et dans six combinaisons, avec les trois échelles de l’atelier. [Éditeur](https://thsethse.github.io/Microcosme/preview/bio-corps-02/#personnage) · [Planche de l’ossature](https://thsethse.github.io/Microcosme/preview/bio-corps-02/#planche-ossature)

## Révisions

| Élément | Révision |
| --- | --- |
| Départ | `docs/bio-corps-02` à `c2cc4d3c1e93c9e42fc75f326d9ebb11ac600739`. [Contrat validé](https://github.com/Thsethse/Microcosme/blob/c2cc4d3c1e93c9e42fc75f326d9ebb11ac600739/docs/ai/bio-corps-02/CONTRAT.md) |
| Référence artistique | BIO-CORPS-01, code `7c756a9dab6b1fa21779cd247c5494c80a5e094c`, publication `4349e9386f24babf1f118ea32fd97e9a18311396`. [Référence H/F](https://thsethse.github.io/Microcosme/preview/bio-corps-01/#planche-corps) |
| Code de BIO-CORPS-02 | `c6906c120c78cea8438f3713753be46e9a26ed70`. [Arbre source](https://github.com/Thsethse/Microcosme/tree/c6906c120c78cea8438f3713753be46e9a26ed70) |
| Publication | `e22acf8f12fa1181f8aa407e7d7526c01ba06932`, dossier `preview/bio-corps-02/`. [Commit Pages](https://github.com/Thsethse/Microcosme/commit/e22acf8f12fa1181f8aa407e7d7526c01ba06932) · [Déploiement Pages](https://github.com/Thsethse/Microcosme/actions/runs/45700876960) · [Manifeste](https://thsethse.github.io/Microcosme/preview/bio-corps-02/version.json) |

## Largeurs et construction

| Réglage | Domaine et référence | Demi-largeur de référence H / F | Repère commandé |
| --- | --- | --- | --- |
| Cou `neck` | 70–130 %, 100 % | 12 / 10,5 | Base du cou. Le raccord suit le menton du visage courant. |
| Épaules `shoulders` | 70–130 %, 100 % | 48 / 37 | Épaules. |
| Thorax `thorax` | 70–130 %, 100 % | 44 / 35 | Thorax. |
| Taille `waist` | 75–125 %, 100 % | 39 / 28 | Taille. |
| Bassin `pelvis` | 70–130 %, 100 % | 36 et 34 / 42 et 39 | Hanches et base pelvienne, avec le même pourcentage appliqué à leurs deux demi-largeurs. |
| Base du pion `base` | 70–130 %, 100 % | 32 / 36 | Flanc inférieur à huit unités au-dessus du point d’appui. La terminaison reste arrondie et raccordée au bassin par le même tracé. |

Les demi-largeurs sont en unités SVG. Le facteur horizontal de l’abdomen interpole les facteurs de taille et de bassin selon la position du repère abdominal, à 7/17 de l’intervalle vertical taille–hanches. L’interpolation conserve la largeur validée de l’abdomen à la référence. Chaque curseur commande un repère propre. Les raccords adjacents suivent les nouvelles tangentes. La construction fournit les largeurs et la géométrie des repères pour une future couche de surface. [Domaines et validation](https://github.com/Thsethse/Microcosme/blob/c6906c120c78cea8438f3713753be46e9a26ed70/bio-yeux-01/body-structure.mjs#L1-L23) · [Géométrie et ancrage](https://github.com/Thsethse/Microcosme/blob/c6906c120c78cea8438f3713753be46e9a26ed70/bio-yeux-01/adult-body.mjs#L24-L87)

**BIO-CORPS-INV-01.** Le calcul vertical de BIO-CORPS-01 demeure la référence pour un visage donné. Depuis la base du cou, les sept repères restent à 0, 12, 26, 40, 47, 57 et 66⅔ % de la hauteur du corps. Les abscisses seules reçoivent les facteurs. Le point d’appui reste à `(80, 249)` et la base du pion occupe le tiers inférieur mesuré depuis la base du cou. La courbe terminale garde sa hauteur de huit unités. L’atelier réutilise le calque, l’aplat et le contour validés. [Tracé horizontal](https://github.com/Thsethse/Microcosme/blob/c6906c120c78cea8438f3713753be46e9a26ed70/bio-yeux-01/adult-body.mjs#L39-L92) · [Insertion SVG](https://github.com/Thsethse/Microcosme/blob/c6906c120c78cea8438f3713753be46e9a26ed70/bio-yeux-01/render.mjs#L83-L107)

## Domaines effectifs et recette de planche

Les domaines effectifs couvrent les plages validées au pas de 1 %. Le produit de ces intervalles reste admissible. Les demi-largeurs sont positives. Entre deux repères, les points de contrôle horizontaux restent à l’intérieur de l’intervalle de leurs demi-largeurs grâce aux tangentes partagées. L’ordonnée progresse d’un repère au suivant. Les deux côtés restent de part et d’autre de l’axe jusqu’au point d’appui, où la tangente est horizontale. Lorsque le corps est le plus court, à hauteur faciale maximale, la distance entre base pelvienne et flanc inférieur vaut 37,36 unités. Même à bassin maximal et base minimale, le premier point de contrôle du raccord terminal reste du côté attendu à plus de 19 unités de l’axe. La plus grande demi-largeur de repère est 62,4 unités, avec une marge dans les cadres frontaux. Les 64 coins de chaque base et des tuples échantillonnés ont confirmé les invariants. [Bornes du visage](https://github.com/Thsethse/Microcosme/blob/c6906c120c78cea8438f3713753be46e9a26ed70/preview/bio-vis-p5-i6/i5/i4/i3/i2/i1/base/r1/model.mjs#L4-L20) · [Tangentes et fermeture](https://github.com/Thsethse/Microcosme/blob/c6906c120c78cea8438f3713753be46e9a26ed70/bio-yeux-01/adult-body.mjs#L24-L85) · [Test de géométrie](https://github.com/Thsethse/Microcosme/blob/c6906c120c78cea8438f3713753be46e9a26ed70/bio-yeux-01/tests/body-structure.test.mjs)

La planche présente les références, 24 extrêmes isolés et deux variantes par combinaison. « Ossature fine » utilise 82 % et 85 % à la taille. « Ossature large » utilise 118 % et 115 % à la taille. Les témoins mixtes opposent les extrêmes du cou, des épaules et du thorax à ceux de la taille, du bassin et de la base. La planche des corps de BIO-CORPS-01 reste accessible pour les repères verticaux et les six corps historiques. [Cas de la planche](https://github.com/Thsethse/Microcosme/blob/c6906c120c78cea8438f3713753be46e9a26ed70/bio-yeux-01/structure-study.mjs#L1-L41) · [Planche des corps](https://thsethse.github.io/Microcosme/preview/bio-corps-02/#planche-corps)

## Persistance et BIO-INV-01

- Chaque curseur affiche son pourcentage effectif. Les deux bases mémorisent leurs réglages séparément pendant la session. La réinitialisation remet uniquement la base active à 100 %. Les six silhouettes historiques s’affichent avec le panneau Ossature masqué. [Interface](https://github.com/Thsethse/Microcosme/blob/c6906c120c78cea8438f3713753be46e9a26ed70/bio-yeux-01/app.mjs#L325-L359) · [Curseurs et remise à zéro](https://github.com/Thsethse/Microcosme/blob/c6906c120c78cea8438f3713753be46e9a26ed70/bio-yeux-01/app.mjs#L475-L481)
- L’apparence complète `microcosme.appearance` v12 enregistre la base active et ses six entiers sous `character.structure`. L’import valide les six clés et leurs bornes avant de restaurer l’apparence complète. Le rejeu des archives v1 à v11 conserve leur format. Une base v11 restaure les références à 100 %. La remise aux références rend à nouveau possible l’export dans ce format. La sélection brute historique reste opaque. [Sélection](https://github.com/Thsethse/Microcosme/blob/c6906c120c78cea8438f3713753be46e9a26ed70/bio-yeux-01/catalogue.mjs#L14-L26) · [Export et validation](https://github.com/Thsethse/Microcosme/blob/c6906c120c78cea8438f3713753be46e9a26ed70/bio-yeux-01/appearance.mjs#L145-L206)
- L’utilité et la non-redondance sont vérifiées sur les repères propres à chaque largeur. Le balayage par cran produit des rasters distincts pour chaque largeur à 178 px dans Chromium. WebKit distingue également tous les crans, avec une paire de valeurs de largeur du cou F qui donne le même raster à 178 px et se distingue à 300 px. Les 61 géométries et les 61 rasters agrandis du cou F restent distincts. Les 256 tuples de la recette sont échantillonnés directement par graine dans le produit des intervalles. La validation refuse une valeur hors domaine, ce qui écarte le rabattement silencieux sur une borne. [BIO-INV-01](https://github.com/Thsethse/Microcosme/blob/c6906c120c78cea8438f3713753be46e9a26ed70/docs/ai/BIO-INV-01.md#L4-L11) · [Contrôles ciblés](https://github.com/Thsethse/Microcosme/blob/c6906c120c78cea8438f3713753be46e9a26ed70/bio-yeux-01/tests/body-structure.test.mjs)

## Résultats

| Contrôle | Résultat |
| --- | --- |
| Node, géométrie et persistance | 5 tests ciblés. Les deux bases à 100 % reproduisent le calque validé à l’octet dans cinq configurations de visage. Au total, 3 200 géométries croisent 64 coins et 256 tuples échantillonnés avec deux bases et cinq visages. Les positions verticales de tous les points de contrôle, l’ancrage, la symétrie et les tangentes sont vérifiés. Les archives v11 et v12 font l’aller-retour à l’identique. |
| Suites Node | 35 réussites pour le jeu avec `npm test`. 120 réussites dans les ateliers BIO-COL et BIO-YEUX, dont les cinq nouveaux tests. Les deux exécutions comptent zéro échec. |
| Preview locale et publique | Recettes locale et publique réussies sous Chromium 151.0.7922.34 et WebKit 26.5. Par moteur et distribution, 24 comparaisons SVG et raster exactes avec BIO-CORPS-01 pour les huit corps aux trois tailles, six raccords avec les visages et coiffures témoins, 24 extrêmes isolés différents de leur référence à 178 px et 26 contrôles verticaux exacts. Les deux apparences v12 sont restaurées après rechargement. Les 38 exemples de la planche sont disponibles aux trois tailles. Le contrôle du débordement horizontal réussit à 390, 820 et 1 180 px. |
| Navigateurs, suites héritées | La suite de l’atelier (`corrections-browser.cjs`) et celle du jeu (`npm run test:browser`) réussissent sous Chromium 151 et WebKit 26.5. |
| Publication | 41 fichiers ajoutés sur Pages, dont le manifeste. Les 40 ressources de la preview et les 443 ressources héritées ont été téléchargées et vérifiées par SHA-256. |

[Suite Node ciblée](https://github.com/Thsethse/Microcosme/blob/c6906c120c78cea8438f3713753be46e9a26ed70/bio-yeux-01/tests/body-structure.test.mjs) · [Recette navigateur](https://github.com/Thsethse/Microcosme/blob/c6906c120c78cea8438f3713753be46e9a26ed70/bio-yeux-01/tests/body-browser.cjs) · [Construction Pages](https://github.com/Thsethse/Microcosme/blob/c6906c120c78cea8438f3713753be46e9a26ed70/bio-yeux-01/build-structure-preview.mjs)

### Rejouer

```sh
npm ci
npx playwright install chromium webkit
npm test
node --test bio-col-01/tests/*.test.mjs bio-yeux-01/tests/*.test.mjs
node bio-yeux-01/build-structure-preview.mjs /tmp/microcosme-ossature 4349e9386f24babf1f118ea32fd97e9a18311396 c6906c120c78cea8438f3713753be46e9a26ed70
PREVIEW_MISSION=BIO-CORPS-02 PREVIEW_DIR=/tmp/microcosme-ossature node bio-yeux-01/tests/body-browser.cjs
PREVIEW_MISSION=BIO-CORPS-02 node bio-yeux-01/tests/body-browser.cjs
```

Le balayage raster enregistre 712 images par moteur sur le visage 38-G neutre, une largeur à la fois. Il utilise un Canvas de 121 × 178 px avec le cadre historique corps. Le cou F est aussi balayé dans le cadre tête à 300 px sous WebKit. Les comparaisons de pixels utilisent les cadrages historiques. Une coupe à 70 px ou en vue tête peut masquer le bas du pion. La vue corps à 178 px permet d’évaluer les six effets. Les essais Chromium et WebKit utilisent un profil iPad émulé. Le jugement artistique des combinaisons et de leur lisibilité sur iPad physique appartient au porteur avant BIO-CORPS-03.
