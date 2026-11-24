# BIO-PILOSITE-01 — Rapport de recette

La pilosité faciale est disponible dans [la preview publique](https://thsethse.github.io/Microcosme/preview/bio-pilosite-01/). Le code de l’atelier correspond au commit `46b7f53` et les fichiers statiques au commit Pages `a3644c2`. La [PR #54](https://github.com/Thsethse/Microcosme/pull/54) est ouverte en brouillon pour validation.

## Géométrie et paramètres

Les six implantations partagent le contour Bézier du visage. Les favoris suivent le bord de la tempe, les joues rejoignent la mâchoire et la mâchoire est échantillonnée sur le contour inférieur réel. La forme du menton module l’arrondi du bas. Aux jonctions, le remplissage d’un seul tracé couvre les traits intérieurs. Les apports de densité ne se cumulent pas. Le contour de 0,62 unité SVG reprend le calcul chromatique de la palette capillaire. La densité interpole les aplats avec la couleur de peau.

La largeur des favoris à 50 % représente environ 13,8 % de la demi-largeur du visage à la coupe considérée, avant effilement. La longueur maximale fait avancer la barbe jusqu’à environ 45 % de la demi-hauteur du visage sous le menton selon le volume et la pointe. La moustache peut atteindre 62 % de la demi-largeur du visage de part et d’autre du centre, dans la limite de la section disponible. Une courbure positive relève les pointes. Les amplitudes d’épaisseur et de courbure sont recalculées d’après l’espace peint entre le nez et les lèvres. Si l’espace devient insuffisant, l’atelier indique que la moustache est en mémoire et la rétablit dès que les bornes le permettent.

Le catalogue de l’atelier ne fournit pas de catégorie H/F/T. L’atelier propose donc un sélecteur indépendant, initialisé à H. F désactive le rendu et les contrôles en conservant les demandes. Aucun seuil d’âge supplémentaire n’est appliqué. Les archives v7 stockent la catégorie, les demandes, les valeurs effectives et les métadonnées de tirage. Les archives v1 à v6 restent relisibles et identiques à la réexportation.

## Recette

| Test | Résultat |
| --- | --- |
| T1 · Historique | 756 comparaisons SVG et six versions d’archives identiques. 54 comparaisons raster par moteur, aux trois tailles et sur deux fonds. |
| T2 · Silhouettes | 12 signatures distinctes à 300, 178 et 70 px ainsi qu’en gros plan dans les deux moteurs. |
| T3 · Zones et raccords | 64 combinaisons de zones générées. Sur la barbe complète à 49 % de densité, les 4 974 pixels pleinement intérieurs à au moins deux zones ont la couleur d’aplat attendue dans chaque moteur. |
| T4 · Domaines et latence | 931 crans contrôlés sur les neuf axes. Dans la combinaison de contrainte, le domaine de la moustache se ferme, puis l’épaisseur maximale de 100 % revient à l’identique lorsque l’espace réapparaît. Deux cycles rejoués dans chaque moteur. |
| T5 · Pigments | 26 couleurs vérifiées, dont 14 naturelles et 12 fantaisie. Trois modes de coloration et quatre niveaux de densité, dont zéro. Les 26 changements de couleur indépendante laissent les SVG hérités des cheveux et des sourcils identiques. |
| T6 · Anatomie | 364 cas géométriques, dont 256 combinaisons aux bornes des morphologies. 108 cas raster par moteur avec neuf états d’ouverture et trois états de nez. Aucun pixel de recouvrement des yeux, du nez ou des lèvres au seuil de la recette. Les 108 barbes extrêmes dépassent le menton comme attendu. |
| T7 · Compatibilité | H et T donnent le même dessin, F restitue le visage sans pilosité et garde les demandes. Retour F → T identique, y compris après import à froid. Âge adulte et état âgé du modèle hérité vérifiés. |
| T8 · Reproductibilité | 768 graines admissibles et reproductibles, 64 masques, 26 couleurs et trois modes observés. Parmi les 384 cas permettant une moustache, elle est tirée 191 fois. Les archives custom et latentes sont rejouées à froid. |
| T9 · Atelier et héritage | 396 rendus avec pilosité, couvrant 126 références capillaires et six corps aux trois échelles. Interactions tactiles simulées et clavier sous Chromium 151 et WebKit 26.5, à 820 × 1180, 1180 × 820 et 390 × 844, sur fonds clair et sombre. 105 tests Node hérités et suites navigateur héritées réussis. |
| T10 · Publication | Déploiement GitHub Pages réussi et page publique atteinte en HTTP 200. Recette publique sous Chromium et WebKit, empreintes SHA-256 des 24 fichiers de la preview et des 247 dépendances héritées vérifiées. |

La variation d’un point de la forme du menton modifie 76 pixels à 300 px, 14 à 178 px, 6 à 70 px et 264 en gros plan dans le portrait mesuré. Aux petites échelles, d’autres variations fines peuvent se confondre. L’harmonie des contours et le rendu d’une silhouette longue à faible densité, dont l’aplat se rapproche de la peau, restent à apprécier sur iPad physique.

[Planche des douze silhouettes](silhouettes-webkit.png) · [Résultats et mesures de la preview publique](recette-publique.json) · [Empreintes vérifiées](publication.json) · [Déploiement Pages](https://github.com/Thsethse/Microcosme/actions/runs/45510376889)

## Rejouer la recette

```sh
npm ci
npx playwright install chromium webkit
node --test bio-yeux-01/tests/beard.test.mjs
ARTIFACT_DIR=/tmp/microcosme-pilosite node bio-yeux-01/tests/beard-browser.cjs
BASE_URL=https://thsethse.github.io/Microcosme/preview/bio-pilosite-01/ \
  ARTIFACT_DIR=/tmp/microcosme-pilosite-publique node bio-yeux-01/tests/beard-browser.cjs
```

L’automatisation de la PR exécute les recettes de la mission et les suites héritées, y compris les navigateurs. La vérification physique et la validation artistique sont réservées au porteur du projet.
