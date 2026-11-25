# BIO-CORPS-04-A — Poitrine féminine adulte

Le panneau **Poitrine** apparaît dans **Personnage et palette → Corps**, quand la base F adulte est sélectionnée. Les six formes sont des préréglages des mêmes huit axes. La planche permet de changer l’échelle ou la teinte pour tous les témoins. [Preview publique](https://thsethse.github.io/Microcosme/preview/bio-corps-04-a/) · [Planche de contrôle](https://thsethse.github.io/Microcosme/preview/bio-corps-04-a/#planche-poitrine)

| Révision | SHA |
| --- | --- |
| Contrat de départ | `54697be356804dc7b1518a58d5d479eec0e08c10`. [Contrat](https://github.com/Thsethse/Microcosme/blob/54697be356804dc7b1518a58d5d479eec0e08c10/docs/ai/bio-corps-04-a/CONTRAT.md) |
| Référence validée | `34acdc6078d9189f596a8efce49aa319a9b05f9e`. [Preview BIO-CORPS-03-R01](https://thsethse.github.io/Microcosme/preview/bio-corps-03-r01/) |
| Code de la preview | `c24b5b0dc93d3d650c91bd05726e0de9bff491a8`. [Arbre source](https://github.com/Thsethse/Microcosme/tree/c24b5b0dc93d3d650c91bd05726e0de9bff491a8) |
| Publication | `f6b5183050ccb2c836cacef1deb1b9ef4a53e58c`. [Commit Pages](https://github.com/Thsethse/Microcosme/commit/f6b5183050ccb2c836cacef1deb1b9ef4a53e58c) · [Manifeste](https://thsethse.github.io/Microcosme/preview/bio-corps-04-a/version.json) |

## Paramètres et préréglages

| Axe | Domaine (%) | Défaut (%) | Effet |
| --- | ---: | ---: | --- |
| Volume | 0 à 100 | 0 | Masse apparente des deux volumes. À 0 %, le moteur omet le calque. |
| Largeur | 0 à 100 | 50 | Demi-largeur souhaitée avant adaptation continue au thorax. |
| Allongement | 0 à 100 | 46 | Extension verticale de l’empreinte. |
| Rondeur | 0 à 100 | 62 | Épaississement des flancs inférieurs et modification des tangentes et de l’apex. |
| Écartement | 0 à 100 | 43 | Place les deux volumes dans l’espace horizontal disponible. |
| Divergence | −100 à +100 | 0 | Incline les volumes vers l’intérieur ou vers l’extérieur et déplace la démarcation de l’ombre latérale. |
| Position verticale | 0 à 100 | 52 | Déplace l’attache entre les épaules et le repère thoracique. |
| Affaissement | 0 à 100 | 24 | Étend le bas et déplace les parties les plus larges vers le bas, sous une attache stable. |

À plat, les sept axes sans effet sont désactivés et leurs valeurs restent mémorisées. Un préréglage conserve un volume non nul déjà choisi. Depuis le volume plat, il ouvre la forme à 53 %. La planche utilise 26 %, 53 % et 88 %. [Domaines et préréglages](https://github.com/Thsethse/Microcosme/blob/c24b5b0dc93d3d650c91bd05726e0de9bff491a8/bio-yeux-01/chest.mjs#L3-L27) · [Commande de l’atelier](https://github.com/Thsethse/Microcosme/blob/c24b5b0dc93d3d650c91bd05726e0de9bff491a8/bio-yeux-01/app.mjs)

| Forme | Largeur | Allongement | Rondeur | Écartement | Divergence | Position | Affaissement |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Arrondie | 76 | 28 | 94 | 38 | 0 | 61 | 12 |
| En goutte | 56 | 57 | 78 | 42 | 8 | 55 | 56 |
| Allongée | 23 | 98 | 57 | 44 | −8 | 53 | 33 |
| Conique | 46 | 44 | 4 | 38 | 11 | 62 | 8 |
| Divergente | 55 | 52 | 65 | 74 | 90 | 57 | 38 |
| Affaissée | 68 | 58 | 64 | 48 | 18 | 47 | 96 |

## Implantation et rendu

L’attache est calculée de 32 % à 72 % du trajet entre les repères des épaules et du thorax. L’allongement, le volume et l’affaissement agissent sous cette attache. Le calcul de masse apparente `volume normalisé^0,56 × (0,87 + 0,13 × corpulence normalisée)` donne un effet progressif à la corpulence. Celle-ci augmente légèrement la souplesse des tangentes, réduit le contraste des ombres et affaiblit le trait inférieur. L’affaissement suit son réglage propre. Sur l’ossature standard, les tests comparent une poitrine volumineuse à 0 % de corpulence et une petite à 100 %. [Géométrie et rendu](https://github.com/Thsethse/Microcosme/blob/c24b5b0dc93d3d650c91bd05726e0de9bff491a8/bio-yeux-01/chest.mjs#L30-L95)

Le moteur borne horizontalement le contour courant de BIO-CORPS-03-R01 sur toute la tranche verticale occupée. Il découpe les cubiques d’ossature et de corpulence à la hauteur utile et utilise la borne de leurs points de contrôle. Une marge de 2,3 unités SVG reste disponible du côté du contour. Une compression continue de la largeur souhaitée répartit l’espace entre chaque empreinte et son écartement. Le placement garantit une marge de 0,65 unité au voisinage de l’axe médian pour l’enveloppe des points de contrôle. Les valeurs d’édition demeurent dans leurs domaines nominaux tandis que les limites spatiales s’adaptent à chaque configuration. [Borne du thorax](https://github.com/Thsethse/Microcosme/blob/c24b5b0dc93d3d650c91bd05726e0de9bff491a8/bio-yeux-01/adult-body.mjs#L40-L54) · [Répartition de la largeur](https://github.com/Thsethse/Microcosme/blob/c24b5b0dc93d3d650c91bd05726e0de9bff491a8/bio-yeux-01/chest.mjs#L45-L76)

Chaque volume utilise huit cubiques raccordées. Trois aplats dérivent de la teinte de peau, avec un relief clair, une ombre latérale orientée et une ombre inférieure. Le seul trait suit une portion du contour inférieur. Le calque est posé devant la peau du corps, sous le visage et les mèches de premier plan. Le corps, les ancrages, la hauteur, le visage et le tracé des cheveux gardent leur SVG. [Insertion du calque](https://github.com/Thsethse/Microcosme/blob/c24b5b0dc93d3d650c91bd05726e0de9bff491a8/bio-yeux-01/render.mjs#L85-L91)

## Sauvegardes et planche

Le volume plat par défaut reprend exactement le rendu validé. Les archives v1 à v13 restent compatibles. Le format v14 ajoute `character.chest` dès qu’un réglage de poitrine est enregistré pour F adulte, y compris à plat. Il conserve les valeurs fractionnaires, la corpulence et les largeurs d’ossature enregistrées. Les anciennes clés de la sélection historique restent inertes. [Export et import](https://github.com/Thsethse/Microcosme/blob/c24b5b0dc93d3d650c91bd05726e0de9bff491a8/bio-yeux-01/appearance.mjs#L148-L226)

La planche propose 18 variations de forme et de volume, un témoin plat, neuf combinaisons volume–corpulence et neuf combinaisons volume–ossature. Les témoins portent une coupe rasée pour dégager le thorax. Quatre teintes sont disponibles sur la planche. Le cadrage **Thorax · détail** permet d’examiner les ombres, tandis que les trois cadrages historiques servent à vérifier l’intégration dans le personnage. Le cadrage rapproché historique peut rogner la partie basse d’un volume très descendant. [Cas de la planche](https://github.com/Thsethse/Microcosme/blob/c24b5b0dc93d3d650c91bd05726e0de9bff491a8/bio-yeux-01/chest-study.mjs)

| Contrôle | Résultat |
| --- | --- |
| Géométrie | 147 456 combinaisons testées aux extrêmes de l’ossature et des axes de poitrine, avec trois volumes, trois corpulences et deux hauteurs de menton. Le contrôle vérifie les marges au thorax et l’écart médian. Balayage de 21 valeurs distinctes pour chacun des huit axes. |
| Suites Node | 133 tests des ateliers et 35 tests du jeu réussis. Les 22 tests de géométrie corporelle, dont les cinq nouveaux tests de poitrine, ont aussi été rejoués avec le code de la preview. |
| Navigateurs | Recette locale et publique sous Chromium 151 et WebKit 26.5 avec un profil iPad émulé. Chaque moteur vérifie les huit commandes, les six préréglages, 37 cas, quatre teintes et trois échelles. Deux importations v14 à froid préservent la poitrine à plat et en volume. Les 24 rendus historiques et les 126 paires de la planche de corpulence conservent leurs résultats. Les suites navigateur du jeu et de l’atelier passent sous les deux moteurs. |
| Balayage raster | Les 18 variantes de forme et de volume et le témoin plat produisent 19 rasters distincts pour chacun des douze couples teinte–échelle, sous Chromium et sous WebKit. |
| Publication | GitHub Pages a construit la révision de publication. L’URL publique répond HTTP 200. Les empreintes SHA-256 des 44 fichiers de la preview et des 570 dépendances héritées concordent avec le manifeste public. |

### Rejouer la recette

```sh
npm ci
npx playwright install chromium webkit
npm test
npm run test:browser
node --test bio-col-01/tests/*.test.mjs bio-yeux-01/tests/*.test.mjs
node bio-yeux-01/tests/corrections-browser.cjs
node bio-yeux-01/build-chest-preview.mjs /tmp/microcosme-poitrine de99f48d30f5e220d8ff5d42d629f8c35bbb663e c24b5b0dc93d3d650c91bd05726e0de9bff491a8
PREVIEW_MISSION=BIO-CORPS-04-A PREVIEW_DIR=/tmp/microcosme-poitrine node bio-yeux-01/tests/body-browser.cjs
PREVIEW_MISSION=BIO-CORPS-04-A node bio-yeux-01/tests/body-browser.cjs
```

La recette automatisée utilise un profil iPad émulé. La validation artistique des formes et de leurs ombres est réservée au porteur sur iPad physique avant BIO-CORPS-04-B.
