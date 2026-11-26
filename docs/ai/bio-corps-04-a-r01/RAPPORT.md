# BIO-CORPS-04-A-R01 — Correction de la poitrine féminine adulte

Le panneau **Poitrine** de la base F adulte propose six réglages continus. La planche compare les deux moteurs à paramètres comparables. [Éditeur](https://thsethse.github.io/Microcosme/preview/bio-corps-04-a-r01/) · [Planche avant/après](https://thsethse.github.io/Microcosme/preview/bio-corps-04-a-r01/#planche-poitrine)

| Révision | SHA |
| --- | --- |
| Contrat | `006f56f8900dc71763d1ccc4f4dc2ffca5bd626a`. [Contrat de correction](https://github.com/Thsethse/Microcosme/blob/006f56f8900dc71763d1ccc4f4dc2ffca5bd626a/docs/ai/bio-corps-04-a-r01/CONTRAT.md) |
| Témoin 04-A | `c24b5b0dc93d3d650c91bd05726e0de9bff491a8`. [Preview précédente](https://thsethse.github.io/Microcosme/preview/bio-corps-04-a/) |
| Code publié | `be9df82007cd38dba02bac87d4a781b12a95b429`. [Arbre source](https://github.com/Thsethse/Microcosme/tree/be9df82007cd38dba02bac87d4a781b12a95b429) |
| Publication | `73e3aa8ebc1d00851477d9351b728e42425c9523`. [Commit Pages](https://github.com/Thsethse/Microcosme/commit/73e3aa8ebc1d00851477d9351b728e42425c9523) · [Manifeste](https://thsethse.github.io/Microcosme/preview/bio-corps-04-a-r01/version.json) |

## Causes et correction

04-A prenait la largeur minimale du thorax sur toute la hauteur du volume, retirait une marge de 2,3 unités SVG et partageait le reste entre deux empreintes. L’écrasement de la largeur réduisait l’amplitude des réglages et comprimait les formes à grand volume. Le moteur ajoutait ensuite le calque à un contour extérieur déjà tracé. La largeur apparente du personnage ne pouvait donc pas augmenter avec la poitrine. [Contrainte précédente](https://github.com/Thsethse/Microcosme/blob/c24b5b0dc93d3d650c91bd05726e0de9bff491a8/bio-yeux-01/chest.mjs#L36-L77) · [Composition précédente](https://github.com/Thsethse/Microcosme/blob/c24b5b0dc93d3d650c91bd05726e0de9bff491a8/bio-yeux-01/adult-body.mjs#L115-L121)

R01 sépare l’enveloppe corporelle issue de l’ossature et de la corpulence du contour de peau final. De 0 à 55 %, le réglage change l’empreinte intérieure. Au-delà de 55 %, une progression lisse élargit aussi les deux flancs. L’élargissement suit quatre points de raccord de largeur `0`, `0,82 × amplitude`, `amplitude` et `0`, sous l’attache. Le moteur découpe les cubiques du thorax à ces ordonnées et additionne déplacements et tangentes. La pente de l’élargissement vaut zéro aux extrémités. Le contour final est tracé une seule fois au-dessus du calque de peau et sert de limite aux aplats de poitrine. [Élargissement et raccords](https://github.com/Thsethse/Microcosme/blob/be9df82007cd38dba02bac87d4a781b12a95b429/bio-yeux-01/adult-body.mjs#L39-L88) · [Composition SVG](https://github.com/Thsethse/Microcosme/blob/be9df82007cd38dba02bac87d4a781b12a95b429/bio-yeux-01/adult-body.mjs#L151-L164)

L’attache se situe à 39 % de la distance verticale des épaules au repère thoracique. Le volume et l’affaissement étendent la forme sous cette attache. Le moteur conserve l’aire disponible de part et d’autre de l’axe, avec une marge médiane de 0,65 unité pour les contrôles. La largeur varie continûment lorsque l’espace se réduit. L’ajout de largeur tient aussi compte de la largeur souhaitée, de l’écartement, de la rondeur et de la corpulence. La corpulence agit sur la masse et adoucit les ombres. L’affaissement garde son réglage indépendant. La continuité du corps au-dessus et au-dessous de l’extension conserve la hauteur, les repères et le point d’appui. [Géométrie, implantation et aplats](https://github.com/Thsethse/Microcosme/blob/be9df82007cd38dba02bac87d4a781b12a95b429/bio-yeux-01/chest.mjs#L30-L90)

Mesures sur F en ossature standard, corpulence à 50 %, avec les autres réglages à leur défaut. La surface est celle de l’empreinte d’un côté, calculée sur sa courbe avant limitation par le contour final. La dernière colonne mesure l’extension horizontale maximale par côté.

| Volume | Surface 04-A (unités SVG²) | Surface R01 (unités SVG²) | Extension (unités SVG) |
| ---: | ---: | ---: | ---: |
| 0 % | 0 | 0 | 0 |
| 25 % | 66,86 | 69,74 | 0 |
| 50 % | 130,21 | 198,26 | 0 |
| 75 % | 187,14 | 359,69 | 4,84 |
| 100 % | 237,36 | 551,07 | 11,62 |

## Réglages et sauvegardes

| Réglage (0 à 100 %) | Défaut | Effet |
| --- | ---: | --- |
| Volume | 0 | Augmente la surface et, aux valeurs hautes, la projection extérieure. |
| Largeur | 50 | Change l’extension latérale souhaitée dans l’espace calculé. |
| Allongement | 46 | Étend verticalement l’empreinte. |
| Rondeur | 62 | Modifie l’apex, la courbure des flancs et la plénitude de la zone basse. |
| Écartement | 43 | Change le placement horizontal des empreintes. |
| Affaissement | 24 | Déplace le maximum et étend le volume vers le bas sous une attache fixe. |

À volume nul, les cinq axes de forme sont désactivés et gardent leurs valeurs pour une reprise ultérieure. Le moteur reproduit alors le rendu plat du corps. Le rendu H, les silhouettes historiques et les calques du visage et des cheveux sont vérifiés dans la recette. [Commandes](https://github.com/Thsethse/Microcosme/blob/be9df82007cd38dba02bac87d4a781b12a95b429/bio-yeux-01/app.mjs) · [Tests de géométrie et de persistance](https://github.com/Thsethse/Microcosme/blob/be9df82007cd38dba02bac87d4a781b12a95b429/bio-yeux-01/tests/body-chest.test.mjs)

Les archives v1 à v13 conservent leur format et leur rendu de référence. L’import v14 garde à l’identique les six axes actifs et affiche un message d’adaptation. Le nouvel export v15 enregistre la divergence et la position retirées dans `character.chestOrigin`. Ces données d’origine sont relues et réexportées, y compris lorsque le volume est ramené à zéro. Le placement à l’écran suit l’attache automatique. Réinitialiser explicitement tout le panneau revient aux valeurs par défaut de la base F, avec volume plat. [Import et export](https://github.com/Thsethse/Microcosme/blob/be9df82007cd38dba02bac87d4a781b12a95b429/bio-yeux-01/appearance.mjs)

## Planche et recette

La planche présente 29 paires avant/après. Les cinq premières couvrent les repères de volume. Quinze montrent les autres axes à 0, 50 et 100 %. Neuf croisent trois ossatures et trois corpulences à volume maximal. Le témoin 04-A utilise sa divergence neutre et son ancienne position par défaut. Chaque paire partage peau, cadrage, ossature, corpulence et valeurs communes. La vue **Thorax · détail** complète les trois cadrages historiques. Le cadrage de tête peut rogner le bas des volumes les plus descendants. [Planche comparative](https://thsethse.github.io/Microcosme/preview/bio-corps-04-a-r01/#planche-poitrine)

| Contrôle | Résultat |
| --- | --- |
| Géométrie | 36 864 combinaisons d’extrêmes avec deux hauteurs de menton, 64 ossatures, trois corpulences, trois volumes et 32 combinaisons des axes de forme. Contrôles de symétrie, tangence, limites, ancrage et contour hors thorax. Les six axes produisent chacun 21 géométries distinctes au balayage. 135 témoins avant ont été comparés au SVG de 04-A à l’octet. |
| Suites Node | 133 tests des ateliers et 35 tests du jeu réussis. La suite des ateliers comprend les cinq tests ciblés R01. |
| Navigateurs | Chromium 151 et WebKit 26.5, en local et sur l’URL publique, avec profil iPad émulé. Par moteur et distribution, six commandes, cinq niveaux de volume distincts dans les rasters à chacune des trois échelles, 29 paires avant/après et quatre teintes. Une archive v14 exportée depuis la preview 04-A migre avec les anciennes valeurs intactes. Deux restaurations v15 à froid couvrent le volume et l’état plat. Les 24 comparaisons historiques, les 126 paires de corpulence et les tests navigateur du jeu passent également. |
| Publication | L’éditeur public et son manifeste répondent HTTP 200. Les empreintes SHA-256 des 45 fichiers R01 et des 615 dépendances héritées concordent avec la publication. Deux constructions locales donnent le même contenu. |

### Rejouer

```sh
npm ci
npx playwright install chromium webkit
npm test
npm run test:browser
node --test bio-col-01/tests/*.test.mjs bio-yeux-01/tests/*.test.mjs
node bio-yeux-01/build-chest-r01-preview.mjs /tmp/microcosme-poitrine-r01 f6b5183050ccb2c836cacef1deb1b9ef4a53e58c be9df82007cd38dba02bac87d4a781b12a95b429
PREVIEW_MISSION=BIO-CORPS-04-A-R01 PREVIEW_DIR=/tmp/microcosme-poitrine-r01 node bio-yeux-01/tests/body-browser.cjs
PREVIEW_MISSION=BIO-CORPS-04-A-R01 node bio-yeux-01/tests/body-browser.cjs
```

Les résultats navigateur proviennent d’un profil iPad émulé. L’appréciation artistique des raccords et volumes sur iPad physique reste soumise à la validation du porteur.
