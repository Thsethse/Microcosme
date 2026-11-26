# BIO-CORPS-05-B — Musculature abdominale

- [Atelier interactif](https://thsethse.github.io/Microcosme/preview/bio-corps-05-b/#atelier-thorax)
- [Planche de contrôle](https://thsethse.github.io/Microcosme/preview/bio-corps-05-b/#planche-abdominaux)
- [PR de recette #70](https://github.com/Thsethse/Microcosme/pull/70)
- [Manifeste public](https://thsethse.github.io/Microcosme/preview/bio-corps-05-b/version.json)

## Géométrie et composition

H et F partagent un même tracé procédural symétrique, dont les dimensions s’adaptent à leur enveloppe. Un aplat continu de chaque côté dessine les grands droits. Deux ombres courbes en marquent les régions supérieure et inférieure quand la définition augmente. Les obliques suivent le flanc en s’effilant vers le bassin. Les nuances proviennent de la peau et les reliefs sont dessinés en aplats fermés. La miniature conserve les principaux volumes et ombres, avec un reflet interne de moins. [Géométrie et rendu](../../../bio-yeux-01/abdominals.mjs)

La bande de placement commence sous le repère du thorax et se termine au-dessus des hanches. Les décalages valent respectivement 7,7 % et 0,8 % de la hauteur du corps entre le cou et le sol. Sa largeur est bornée par la demi-largeur minimale du corps sur toute cette bande, avec une marge de 2,8 unités SVG. Les points de contrôle restent dans cette enveloppe. Les grands droits occupent jusqu’à 70 % de la demi-largeur disponible suivant le volume et la largeur demandée. Les obliques se raccordent à cette zone et atteignent au plus 96 % de la demi-largeur disponible. [Repères et emprise](../../../bio-yeux-01/abdominals.mjs) · [Silhouette porteuse](../../../bio-yeux-01/adult-body.mjs)

Le calque se place au-dessus du corps et sous les reliefs osseux, les pectoraux ou la poitrine, puis les détails thoraciques. Les tracés de 05-A continuent de fournir directement la silhouette, la hauteur, la base du pion et les ancrages. Le test de séparation rejoue exactement le SVG de départ après retrait du seul calque abdominal. [Ordre des calques](../../../bio-yeux-01/adult-body.mjs) · [Test de non-régression](../../../bio-yeux-01/tests/body-abdominals.test.mjs)

## Réglages et corpulence

Les quatre réglages couvrent 0–100 % et utilisent les mêmes valeurs de référence sur les deux bases.

| Réglage | Référence | Effet |
| --- | ---: | --- |
| Volume musculaire | 0 % | Fait varier l’emprise verticale et horizontale des reliefs ainsi que leur contraste. À zéro, le calque est absent. |
| Définition musculaire | 56 % | Dessine progressivement les ombres qui séparent les régions des grands droits. |
| Largeur | 52 % | Étend ou resserre les grands droits à l’intérieur de la largeur disponible. Le raccord latéral suit ce mouvement. |
| Développement des obliques | 46 % | Accroît l’extension latérale et le contraste du relief des obliques. |

La masse de calcul vaut `(volume / 100)^0,78`. Pour une corpulence normalisée `c`, la part de définition disponible est calculée avec `u = (1 − c)^1,30`. La visibilité générale est multipliée par `0,07 + 0,93 × u`, et la définition demandée par `0,20 + 0,80 × u`. À 100 % de corpulence, un volume musculaire positif garde un modelé diffus et la définition n’a plus qu’un effet très atténué. La graisse utilise le curseur de corpulence existant. Les quatre réglages musculaires demandés restent identiques quand la corpulence change. [Calcul des effets](../../../bio-yeux-01/abdominals.mjs)

## Atelier et sauvegarde

Après avoir choisi H ou F, le raccourci **Abdominaux** rejoint le panneau des quatre curseurs. Le volume doit être positif pour que les trois autres commandes puissent modifier le rendu. À volume nul, elles sont désactivées avec une indication et leurs dernières valeurs restent mémorisées. Le rendu et la vue rapprochée s’actualisent pendant le déplacement du curseur. Les trois échelles historiques conservent leur cadrage. La vue **Abdomen · détail** montre les régions inférieures que les vues centrées sur la tête peuvent rogner. [Atelier](../../../bio-yeux-01/index.html) · [Interactions](../../../bio-yeux-01/app.mjs)

Les apparences avec réglages abdominaux s’enregistrent en v19. Les quatre valeurs, y compris les fractions et les réglages latents à volume nul, s’ajoutent aux données déjà présentes. L’atelier garde une préférence distincte par base adulte pendant la session. Les archives antérieures retrouvent leur rendu et leur version d’origine, puis passent en v19 après édition abdominale. [Sauvegarde et restauration](../../../bio-yeux-01/appearance.mjs)

## Planche et résultats

La planche présente 42 rendus. Dix-huit combinent les volumes 0, 50 et 100 % avec les corpulences mince (25 %), standard (50 %) et très obèse (100 %) sur les deux bases. Vingt-quatre isolent les quatre axes à 0, 50 et 100 % sur H et F. Les sélecteurs s’appliquent à la planche entière et offrent sept ossatures, quatre teintes de peau, les trois échelles historiques et une vue rapprochée. [Cas de la planche](../../../bio-yeux-01/abdominal-study.mjs)

| Contrôle | Résultat |
| --- | --- |
| Géométrie et archives | Cinq tests dédiés réussis. 30 720 configurations contrôlent les marges entre thorax et hanches et la symétrie. Les tests exercent 21 valeurs par axe et 1 001 valeurs de corpulence, vérifient les SVG hors calque et restaurent des réglages v19 actifs ou à plat. |
| Suites Node | 152 tests des ateliers, dont les cinq tests dédiés, et 35 tests du jeu réussis. |
| Atelier public | Recette complète réussie sous Chromium 151 et WebKit 26.5. Chaque moteur vérifie les quatre curseurs sur les deux bases avec seize gestes tactiles, l’atténuation avec la corpulence, quatre restaurations v19 à plat ou en volume, les neuf combinaisons par base, les quatre peaux, sept ossatures et les trois échelles. Les commandes de volume et de forme du thorax, les détails 04-C et le masquage des reliefs 05-A passent aussi la recette. Les résultats ciblés concordent entre la construction locale et la publication pour chaque moteur. |
| Jeu dans les navigateurs | Vérifications de non-régression réussies sous Chromium et WebKit. |
| GitHub Pages | 915 empreintes SHA-256 concordantes sur la version publique, dont 54 fichiers de la preview et 861 dépendances héritées. Deux constructions à révisions identiques donnent des dossiers identiques. |

La recette tactile utilise un profil iPad simulé. La validation artistique et fonctionnelle sur l’iPad du porteur reste à effectuer. [Tests dédiés](../../../bio-yeux-01/tests/body-abdominals.test.mjs) · [Tests navigateurs](../../../bio-yeux-01/tests/body-browser.cjs)

## Reproduire

```sh
npm ci
npx playwright install chromium webkit
node --test bio-col-01/tests/*.test.mjs bio-yeux-01/tests/*.test.mjs
npm test
npm run test:browser
PREVIEW_MISSION=BIO-CORPS-05-B node bio-yeux-01/tests/body-browser.cjs
node bio-yeux-01/build-abdominal-preview.mjs /tmp/microcosme-bio-corps-05-b \
  57bf4390a6cca4fe24177e752afdcd96ff9e0649 3deff10178aff1d95ca580d45611ef0293e0adbb
```

Branche de départ `0c38479aa87770fafdfd55c3aac0358af94c3341`. Le manifeste épingle la révision source `3deff10178aff1d95ca580d45611ef0293e0adbb`. La publication Pages `c32043735d0027516cdc231dffff77610ff4908d` porte uniquement sur la nouvelle preview. La PR reste ouverte sans fusion.
