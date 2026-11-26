# BIO-CORPS-05-A — Reliefs osseux et maigreur

- [Atelier interactif](https://thsethse.github.io/Microcosme/preview/bio-corps-05-a/#atelier-thorax)
- [Planche de contrôle](https://thsethse.github.io/Microcosme/preview/bio-corps-05-a/#planche-reliefs-osseux)
- [PR de recette #69](https://github.com/Thsethse/Microcosme/pull/69)
- [Manifeste public](https://thsethse.github.io/Microcosme/preview/bio-corps-05-a/version.json)

## Construction et direction artistique

Les quatre familles sont dessinées en aplats fermés et symétriques à partir des niveaux anatomiques existants. La largeur disponible est recalculée pour chaque bande verticale, avec une marge minimale de 2,4 unités SVG par rapport à l’enveloppe. Les points de contrôle des courbes restent à l’intérieur de cette bande. Les positions suivent la largeur effective du corps et les ancrages verticaux existants.

| Famille | Implantation | Rendu |
| --- | --- | --- |
| Clavicules | Autour du niveau des épaules, sous le cou | Deux lignes de relief allongées aux extrémités effilées, chacune en aplat fermé. |
| Côtes latérales | Sous le thorax, au-dessus de la taille | Deux surfaces latérales à inflexions irrégulières qui suggèrent la cage costale par un aplat continu de chaque côté. |
| Creux sous-costal | Entre le bas de la cage costale et le haut de l’abdomen | Un modelé concave de chaque côté, avec un léger reflet. |
| Crêtes iliaques | De la partie haute des hanches jusqu’au-dessus du niveau pelvien | Deux arêtes obliques affinées aux extrémités. |

L’ombre et le reflet sont calculés à partir de la couleur de peau. Le modèle utilise un maximum de deux aplats par relief et par côté. En miniature, il retient la surface principale pour garder une lecture simple. Les cadrages historiques sont conservés. Le cadrage **Tronc · détail** permet de contrôler notamment les reliefs du bassin, en dehors du champ des vues centrées sur la tête. [Géométrie et aplats](../../../bio-yeux-01/body-bone-reliefs.mjs)

## Réponse à la corpulence

L’atelier déduit le rendu du curseur **Corpulence** existant. Pour une corpulence normalisée `c` entre 0 et 1, l’opacité de base de chaque aplat est multipliée par `(1 − c)^p`. La courbe est continue et décroissante. Les quatre reliefs culminent à 0 %, s’atténuent dans la partie maigre du domaine, restent très discrets à 50 % et s’effacent à mesure que la corpulence augmente. Le calque est absent à 100 %.

| Famille | Exposant `p` | Opacité de départ ombre/reflet | Visibilité relative à 50 % |
| --- | ---: | ---: | ---: |
| Clavicules | 3,10 | 46 % / 48 % | 11,7 % |
| Côtes latérales | 3,55 | 32 % / 33 % | 8,5 % |
| Creux sous-costal | 3,35 | 41 % / 14 % | 9,8 % |
| Crêtes iliaques | 3,45 | 37 % / 43 % | 9,2 % |

À 75 %, la visibilité relative est comprise entre 0,73 % et 1,36 %. Les choix de contraste et de chute de visibilité restent soumis à la validation artistique. [Courbes de visibilité](../../../bio-yeux-01/body-bone-reliefs.mjs)

## Superposition, atelier et sauvegardes

Dans le SVG, le calque se place après la silhouette sous-jacente, avant les surfaces mammaires ou pectorales. Les surfaces existantes, opaques, recouvrent naturellement les parties superposées. Les aréoles et mamelons restent au-dessus de leurs surfaces porteuses. Le calque est interne et n’intervient ni dans le contour, ni dans la hauteur, ni dans le point d’appui. Les études historiques gardent leur propre rendu de référence. [Composition SVG](../../../bio-yeux-01/adult-body.mjs) · [Rendu dans l’atelier](../../../bio-yeux-01/app.mjs)

Dans l’atelier, les boutons H et F ouvrent la base adulte, puis le lien **Corpulence** rejoint le réglage existant et l’aperçu adjacent. Le calque est recalculé à la restauration à partir de la corpulence enregistrée ou de la référence à 50 %. Le format JSON et les valeurs des réglages sont conservés. Un même fichier d’apparence adulte affiche donc les nouveaux reliefs dans 05-A selon sa corpulence. [Atelier interactif](../../../bio-yeux-01/index.html) · [Sauvegardes](../../../bio-yeux-01/appearance.mjs)

## Planche et résultats

La planche présente 18 comparaisons avant/après, soit les neuf niveaux de corpulence sur les deux bases. Quatre témoins supplémentaires montrent le recouvrement sur les deux bases à 0 %, à plat puis à volume thoracique maximal. Les sélecteurs appliquent sept profils d’ossature, quatre teintes de peau et les trois échelles historiques à tous les cas. La vue rapprochée du tronc facilite la lecture des creux et des crêtes. [Planche et données de recette](../../../bio-yeux-01/bone-relief-study.mjs)

| Contrôle | Résultat |
| --- | --- |
| Géométrie | Quatre tests dédiés réussis. 2 304 configurations combinent deux bases, deux hauteurs de menton, 64 coins d’ossature et les neuf repères de corpulence. 1 001 valeurs par courbe vérifient la décroissance et la continuité. Le test de superposition compare le SVG complet avec et sans le nouveau calque aux trois échelles. |
| Suites Node | 147 tests des ateliers, dont les quatre tests dédiés, et 35 tests du jeu réussis. |
| Atelier public | Recette complète réussie sous Chromium 151 et WebKit 26.5. Les essais couvrent le curseur tactile, les neuf niveaux, les sept ossatures et quatre teintes de la planche, les trois échelles et les anciennes commandes des volumes et des détails thoraciques. Chaque moteur compare les pixels à 42 points sous les pectoraux H et 86 points sous la poitrine F. Aucun de ces pixels couverts ne change lorsque le calque est ajouté. Deux archives v18 se rouvrent avec tous leurs réglages et se réexportent à l’identique. Les résultats ciblés concordent entre le build local et la publication pour chaque moteur. |
| Jeu dans les navigateurs | Vérifications de non-régression réussies sous Chromium et WebKit. |
| GitHub Pages | 860 empreintes SHA-256 concordantes sur la version publique, dont 52 fichiers de la preview et 808 dépendances héritées. Deux constructions à révisions identiques donnent des dossiers identiques. |

Les tests d’interaction utilisent un profil iPad simulé. La validation artistique sur l’iPad du porteur reste à effectuer. [Tests unitaires](../../../bio-yeux-01/tests/body-bone-reliefs.test.mjs) · [Tests navigateur](../../../bio-yeux-01/tests/body-browser.cjs)

## Reproduire

```sh
npm ci
npx playwright install chromium webkit
node --test bio-col-01/tests/*.test.mjs bio-yeux-01/tests/*.test.mjs
npm test
npm run test:browser
PREVIEW_MISSION=BIO-CORPS-05-A node bio-yeux-01/tests/body-browser.cjs
node bio-yeux-01/build-bone-reliefs-preview.mjs /tmp/microcosme-bio-corps-05-a \
  5a5886da232018752573731d89e3c4da5cc8177b 01214c2bde568339d8b6618a648543360f8a6b56
```

Branche de départ `0c5f7e9b7475b7d7f836d443032bac2ad7ddbdfa`. Le manifeste épingle la révision source `01214c2bde568339d8b6618a648543360f8a6b56`. La publication Pages `57bf4390a6cca4fe24177e752afdcd96ff9e0649` porte uniquement sur la nouvelle preview. La PR reste ouverte sans fusion.
