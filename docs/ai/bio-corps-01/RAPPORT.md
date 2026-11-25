# BIO-CORPS-01 — Deux bases anatomiques adultes

L’atelier frontal BIO-YEUX-R01 propose maintenant deux bases adultes, masculine H et féminine F, dans le sélecteur **Corps**. Les six silhouettes historiques restent disponibles. La **Planche des corps** affiche les repères sur les deux nouvelles bases et compare les huit choix à visage et coiffure identiques. [Ouvrir l’atelier](https://thsethse.github.io/Microcosme/preview/bio-corps-01/#personnage) · [Ouvrir la planche](https://thsethse.github.io/Microcosme/preview/bio-corps-01/#planche-corps)

## Révisions

| Élément | Révision |
| --- | --- |
| Départ et contrat | `docs/bio-corps-01`, `1bc0a6f83e356b07194a106be65d17f29e051f00`. [Contrat](https://github.com/Thsethse/Microcosme/blob/1bc0a6f83e356b07194a106be65d17f29e051f00/docs/ai/bio-corps-01/CONTRAT.md) |
| Audit et référence de rendu | [Audit BIO-CORPS-AUDIT-01, PR #59](https://github.com/Thsethse/Microcosme/pull/59) · [Preview BIO-YEUX-R01](https://thsethse.github.io/Microcosme/preview/bio-yeux-r01/) |
| Code de la preview | `7c756a9dab6b1fa21779cd247c5494c80a5e094c`. [Arbre source](https://github.com/Thsethse/Microcosme/tree/7c756a9dab6b1fa21779cd247c5494c80a5e094c) |
| Publication Pages | `4349e9386f24babf1f118ea32fd97e9a18311396`, ajout isolé sous `preview/bio-corps-01/`. [Commit Pages](https://github.com/Thsethse/Microcosme/commit/4349e9386f24babf1f118ea32fd97e9a18311396) · [Déploiement Pages](https://github.com/Thsethse/Microcosme/actions/runs/45697055462) · [Manifeste et empreintes](https://thsethse.github.io/Microcosme/preview/bio-corps-01/version.json) |

## Proportions proposées

Les deux bases utilisent les mêmes hauteurs de repère et deux jeux de demi-largeurs. La hauteur est mesurée de la base du cou jusqu’au point d’appui. Au visage neutre, cette longueur vaut 144 unités SVG. Les repères de taille et d’abdomen sont séparés de 10,08 unités. Les hanches se trouvent à 57 % de la hauteur et la base pelvienne à deux tiers. Les valeurs de largeur et les positions décrivent cette proposition graphique soumise à recette. [Repères et valeurs des deux profils](https://github.com/Thsethse/Microcosme/blob/7c756a9dab6b1fa21779cd247c5494c80a5e094c/bio-yeux-01/adult-body.mjs#L1-L18)

| Repère | Hauteur | Y au visage neutre | Demi-largeur H | Demi-largeur F |
| --- | ---: | ---: | ---: | ---: |
| Base du cou | 0 % | 105 | 12 | 10,5 |
| Épaules | 12 % | 122,28 | 48 | 37 |
| Thorax | 26 % | 142,44 | 44 | 35 |
| Taille | 40 % | 162,60 | 39 | 28 |
| Abdomen | 47 % | 172,68 | 38 | 31 |
| Hanches | 57 % | 187,08 | 36 | 42 |
| Base pelvienne | 66⅔ % | 201 | 34 | 39 |

La silhouette H privilégie les épaules et le thorax, avec une taille peu resserrée et un dessin plus anguleux. La silhouette F marque davantage la taille et ouvre la courbe des hanches. Les deux moitiés sont symétriques autour de l’axe du menton. Une suite de cubiques partage ses tangentes aux jonctions, et le même chemin fermé peint le tronc ainsi que la base. Le tiers inférieur se prolonge vers une demi-largeur de 32 unités pour H et de 36 pour F. La courbe terminale s’adoucit sur les huit dernières unités. Le point d’appui géométrique est `(80, 249)` dans le repère frontal. La planche montre ce point et l’étendue du tiers inférieur, séparément du dessin courant. [Courbes et point d’appui](https://github.com/Thsethse/Microcosme/blob/7c756a9dab6b1fa21779cd247c5494c80a5e094c/bio-yeux-01/adult-body.mjs#L20-L82) · [Guides de la planche](https://github.com/Thsethse/Microcosme/blob/7c756a9dab6b1fa21779cd247c5494c80a5e094c/bio-yeux-01/body-study.mjs#L1-L39)

## Intégration à l’atelier

- **Raccord au visage.** L’attache supérieure suit le menton du visage courant, quatre unités au-dessus de celui-ci. Le recouvrement se fait sous le calque facial. Le corps partage l’aplat `#dbbf88` et le contour `#c2a873` du visage historique. Le nouveau chemin remplace uniquement le groupe `body-shape` à sa position d’origine entre les calques existants. Les trois cadres historiques sont réutilisés. [Insertion SVG](https://github.com/Thsethse/Microcosme/blob/7c756a9dab6b1fa21779cd247c5494c80a5e094c/bio-yeux-01/render.mjs#L82-L107) · [Cadres de l’atelier](https://github.com/Thsethse/Microcosme/blob/7c756a9dab6b1fa21779cd247c5494c80a5e094c/bio-yeux-01/app.mjs#L74-L87)
- **Persistance.** L’apparence complète d’une base H ou F utilise `microcosme.appearance` v11 et `bio-corps-01-svg@1`. Elle enregistre `character.body` avec le reste du visage et conserve la sélection historique brute. Les archives des six corps continuent d’utiliser leurs versions habituelles. Un identifiant inconnu dans l’ancien JSON suit le repli historique `standard`, y compris lorsqu’il coïncide avec le nom d’une nouvelle base. L’interface indique d’utiliser l’apparence complète pour conserver H ou F. [Sélection historique](https://github.com/Thsethse/Microcosme/blob/7c756a9dab6b1fa21779cd247c5494c80a5e094c/bio-yeux-01/catalogue.mjs#L13-L20) · [Export et import](https://github.com/Thsethse/Microcosme/blob/7c756a9dab6b1fa21779cd247c5494c80a5e094c/bio-yeux-01/appearance.mjs#L140-L198) · [Vérification du rejeu](https://github.com/Thsethse/Microcosme/blob/7c756a9dab6b1fa21779cd247c5494c80a5e094c/bio-yeux-01/appearance.mjs#L254-L266)
- **BIO-INV-01.** Les deux entrées produisent des silhouettes distinctes aux tailles mesurées. Les repères et largeurs sont des données de construction déterministes. Les commandes disponibles restent les choix discrets de corps. Les essais de rejeu portent sur la silhouette et les réglages faciaux simultanément. [Invariant](https://github.com/Thsethse/Microcosme/blob/7c756a9dab6b1fa21779cd247c5494c80a5e094c/docs/ai/BIO-INV-01.md#L4-L11) · [Recette de géométrie et d’archives](https://github.com/Thsethse/Microcosme/blob/7c756a9dab6b1fa21779cd247c5494c80a5e094c/bio-yeux-01/tests/adult-body.test.mjs)

## Résultats des tests

| Contrôle | Résultat |
| --- | --- |
| Géométrie SVG, Node 24.22.3 | 4 tests ciblés réussis. Symétrie, sept niveaux, continuité des tangentes après sérialisation, cou et point d’appui vérifiés pour cinq visages témoins. 756 rendus H/F couvrent les 126 références et trois tailles avec préservation du SVG hors corps. Cas supplémentaires avec coiffures longues et modules faciaux actifs. Rejeu exact v11 pour H/F et contrôle des sauvegardes des six anciens corps. |
| Suites Node du jeu et des ateliers | `npm test` donne 35 réussites. Les suites BIO-COL et BIO-YEUX donnent 115 réussites, dont les quatre nouveaux tests. Aucun échec dans ces deux exécutions. |
| Preview locale et publique | Réussite sur la distribution locale et l’URL publique sous Chromium 151.0.7922.34 et WebKit 26.5. Par moteur et par distribution, 18 comparaisons SVG et raster à l’identique pour les anciens corps, huit rasters distincts à chacune des trois tailles, six raccords tête/corps, deux imports à froid et 14 repères visibles uniquement dans la planche. Contrôle du cadrage en largeurs de 390, 820 et 1 180 px. |
| Suites navigateur héritées | La suite de l’atelier (`corrections-browser.cjs`) et celle du jeu (`npm run test:browser`) réussissent sous Chromium 151 et WebKit 26.5. |
| Publication | 39 fichiers dans le dossier autonome, dont le manifeste. La construction vérifie les 404 ressources héritées par SHA-256. Les 442 entrées du manifeste public ont été téléchargées et leurs empreintes SHA-256 correspondent. |

[Tests Node ciblés](https://github.com/Thsethse/Microcosme/blob/7c756a9dab6b1fa21779cd247c5494c80a5e094c/bio-yeux-01/tests/adult-body.test.mjs) · [Recette navigateur](https://github.com/Thsethse/Microcosme/blob/7c756a9dab6b1fa21779cd247c5494c80a5e094c/bio-yeux-01/tests/body-browser.cjs) · [Construction Pages](https://github.com/Thsethse/Microcosme/blob/7c756a9dab6b1fa21779cd247c5494c80a5e094c/bio-yeux-01/build-body-preview.mjs)

### Rejouer la recette

```sh
npm ci
npx playwright install chromium webkit
npm test
node --test bio-col-01/tests/*.test.mjs bio-yeux-01/tests/*.test.mjs
node bio-yeux-01/build-body-preview.mjs /tmp/microcosme-corps-preview d5e5f765f92409a1353afdf57638097fee9ac189 7c756a9dab6b1fa21779cd247c5494c80a5e094c
PREVIEW_DIR=/tmp/microcosme-corps-preview node bio-yeux-01/tests/body-browser.cjs
node bio-yeux-01/tests/body-browser.cjs
```

Les essais navigateur utilisent un profil iPad émulé. La recette artistique des proportions, de la lisibilité en miniature et du raccord tête/épaules sur Safari iPad physique revient au porteur avant BIO-CORPS-02.
