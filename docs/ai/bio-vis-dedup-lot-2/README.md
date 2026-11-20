# BIO-VIS-DEDUP-01 — Lot 2 : six regroupements visibles

## Périmètre et références vérifiées

L’autorisation utilisateur porte explicitement sur la programmation et la preview du **lot 2 uniquement**. Elle permet l’exécution du [contrat intégral](https://github.com/Thsethse/Microcosme/blob/0fbbc3eb4e8896284fedd855c9841ac95f2fe31a/docs/ai/bio-vis-dedup-01/CONTRAT_LOT_2.md), dont la création documentaire ne constituait pas à elle seule une autorisation.

Avant modification : examen des branches et PR ouvertes, notamment #41 et **#42, toujours ouverte en brouillon et non fusionnée**, ainsi que des instructions `AGENTS.md` (aucune trouvée dans les répertoires de travail ou leurs ancêtres). Lecture des documents de continuité `START_HERE`, `PROJECT_STATE`, `DECISION_REGISTER`, `WORK_LOG`, du contrat complet et des références suivantes sur la branche documentaire `0fbbc3e` :

- [Arbitrages utilisateur](https://github.com/Thsethse/Microcosme/blob/0fbbc3eb4e8896284fedd855c9841ac95f2fe31a/docs/ai/bio-vis-dedup-01/ARBITRAGES_UTILISATEUR.md).
- [Méthode](https://github.com/Thsethse/Microcosme/blob/0fbbc3eb4e8896284fedd855c9841ac95f2fe31a/docs/ai/bio-vis-dedup-01/METHODE.md), [décisions](https://github.com/Thsethse/Microcosme/blob/0fbbc3eb4e8896284fedd855c9841ac95f2fe31a/docs/ai/bio-vis-dedup-01/DECISIONS.md), [planches et originaux](https://github.com/Thsethse/Microcosme/blob/0fbbc3eb4e8896284fedd855c9841ac95f2fe31a/docs/ai/bio-vis-dedup-01/PLANCHES.md), dossiers E03, E04, E07, E09, E10 et V01, comparaison des copies exactes et fiches originales du catalogue P5.

Les anciennes mentions « En attente » dans la galerie ne remplacent pas les arbitrages utilisateur ni le contrat du lot 2. La réserve sur 21-G est acceptée, sans nouvelle retouche.

## Composition indépendante, sans fusion du lot 1

Branche : `codex/bio-vis-dedup-lot-2`, créée depuis `main` **`5bcda0dd2fdae799ef3f7779109660bfbee988f1`**. PR du lot 1 : [#42](https://github.com/Thsethse/Microcosme/pull/42), tête examinée `1ff931586776b3f7ed41bbdc5772b97e030aa4db`.

La branche principale contient déjà l’artefact de preview du lot 1, issu du code **`5ea862510b04904904241a09695be4c9141ce4a8`**. Le nouveau prototype réexporte directement sa fonction de rendu depuis `preview/bio-vis-dedup-lot-1/render.mjs`. Il utilise le catalogue canonique de `preview/bio-vis-p5-i6/`. **Aucun fichier de ces deux répertoires n’est modifié** ; leurs 99 fichiers sont vérifiés par SHA-256, y compris leurs dépendances, images et manifeste de version.

La réutilisation concerne la même fonction JavaScript, sans copie ni réimplémentation des corrections. Les quatre formes 58-G, 24-D, 68-G et 58-D restent présentes, ainsi que les huit paramètres et les six corps. Aucun changement du jeu, moteur biologique, sauvegardes, accessoires, couleurs ou autres prototypes.

## Table complète du lot 2

Les identifiants de style `p5-###` et l’arrangement `G` ou `D` sont conservés séparément. La clé composée ci-dessous est seulement celle du sélecteur de cette preview.

| Dossier | Entrée ordinaire principale | Identifiant historique secondaire | Éléments indépendants préservés |
| --- | --- | --- | --- |
| E03 | `p5-019:G` · 19-G | `p5-021:G` · 21-G | 19-D, 21-D, correction 68-G ; aucune retouche de 21-G |
| E04 | `p5-028:G` · 28-G | `p5-059:G` · 59-G | 28-D, 59-D et provenance de 59-G |
| E07 | `p5-047:G` · 47-G | `p5-050:G` · 50-G | 47-D, 50-D, données de couleur/contraste et rendu original de 50-G |
| E09 | `p5-049:G` · 49-G | `p5-062:D` · 62-D | 49-D, 62-G et **71-G** ; contraste de 62-D conservé |
| E10 | `p5-064:G` · 64-G | `p5-070:G` · 70-G | 64-D, 70-D |
| V01 | `p5-056:G` · 56-G | `p5-061:G` · 61-G | 56-D, 61-D ; les **deux mèches de 61-G** restent dans son rendu historique |

Pas de regroupement transitif. Aucun identifiant, nom, arrangement ou provenance supprimé ; aucun lot 3 engagé.

## Comportement mesuré dans la preview

Le catalogue canonique conserve **72 références et 126 choix documentaires** : 18 coiffures historiques à choix unique et 54 références P5 avec deux arrangements. Le sélecteur ordinaire contient **120 entrées**, dans le même ordre relatif, après retrait des seules six entrées secondaires. Il ne s’agit pas d’une réduction du nombre de coiffures biologiques prouvées distinctes.

La grille avant/après peut afficher le catalogue complet **126 → 120**, ou les seuls groupes concernés **12 → 6**, avec son périmètre explicitement indiqué. Les six principaux ouvrent un panneau à deux références avec identifiants, noms, planches, positions, fiches originales et liens vers les arrangements opposés indépendants.

Le contrôle historique charge les 126 identifiants. Pour un secondaire, le sélecteur ordinaire indique le principal, mais les données conservées et le rendu gardent **l’identifiant secondaire**. Exemple : 61-G affiche 56-G dans le sélecteur ordinaire tout en montrant ses deux mèches. Le bouton « Choisir cette entrée ordinaire » permet un **nouveau choix explicite** du principal, même s’il est déjà indiqué par le sélecteur. Aucun remplacement silencieux.

L’aller-retour JSON conserve style, arrangement, flags de couleur/contraste, champs inconnus et métadonnées imbriquées. Les valeurs normalisées pour l’affichage restent séparées de la donnée brute : une largeur de front historique de 1,20 est conservée dans les données et affichée à la limite autorisée 1,14. Le contrôle monochrome/sans accessoires agit uniquement sur la présentation. Le mode « couleurs et accessoires historiques » permet de constater le maintien des rendus colorés de 50-G et 62-D.

Cette démonstration n’accède à **aucune sauvegarde réelle**, aucun service de persistance ni stockage du jeu. Elle ne migre pas les sauvegardes du moteur principal. Les données restent en mémoire et peuvent être relues dans la page.

## Comparaisons et consultation sur iPad

Preview indépendante : **https://thsethse.github.io/Microcosme/preview/bio-vis-dedup-lot-2/**

Ouvrir « Comparer les listes », puis les boutons E03, E04, E07, E09, E10 et V01. Chaque paire donne accès aux deux rendus historiques, aux provenances et aux variantes. La section de sélection affiche une tête à **300 px**, le personnage entier à **178 px** et une miniature **70 × 70 px**. Les contrôles natifs et boutons tactiles d’au moins 44 px sont utilisables en portrait/paysage sans téléchargement.

Les comparaisons utilisent un même cadrage, la morphologie neutre et un rendu monochrome sans accessoires. La section distincte de maintien du lot 1 compare P5-I6 avant correction et le rendu corrigé hérité ; elle conserve les palettes des deux prototypes.

Captures WebKit :

- [Catalogue avant/après](captures/webkit-before-after.png).
- [E03](captures/webkit-E03.png), [E04](captures/webkit-E04.png), [E07](captures/webkit-E07.png), [E09](captures/webkit-E09.png), [E10](captures/webkit-E10.png), [V01](captures/webkit-V01.png).
- [Sélection historique 61-G](captures/webkit-V01-history.png).
- [Portrait](captures/webkit-ipad-portrait.png), [paysage](captures/webkit-ipad-landscape.png), [format étroit](captures/webkit-narrow.png).
- [Quatre corrections du lot 1 maintenues](captures/webkit-lot1-maintained.png).

## Vérifications et limites

Exécution locale :

| Contrôle | Résultat |
| --- | --- |
| `npm test` du dépôt | **35 tests réussis** |
| `node --test bio-vis-dedup-lot-2/tests/model.test.mjs` | **7 tests réussis** |
| Fichiers hérités | **99/99 empreintes identiques** ; identité des fonctions de rendu lot 1/lot 2 |
| Aller-retour historique déterministe | **1 512 cas** : 126 choix × 6 corps × 2 états de contraste ; aucune perte de données |
| Quatre corrections du lot 1 | 3 morphologies (neutre/min/max), 6 corps et 3 échelles ; rendu identique au lot 1 et distinct de P5-I6 |
| Chromium + WebKit | 126 options chargées par moteur, six regroupements exacts, G/D hors périmètre et 71-G indépendants, aller-retour JSON, contrastes 50-G/62-D, deux mèches 61-G |
| Affichage | 8 paramètres, 6 corps, tailles 300/178/70, formats **820×1180**, **1180×820**, **390×844** ; aucun débordement horizontal, erreur JS/HTTP, coordonnée SVG invalide ou doublon d’ID SVG détecté |

Commandes reproductibles dans le [README du prototype](../../../bio-vis-dedup-lot-2/README.md). La CI dédiée installe la version Playwright verrouillée par le dépôt (**1.62.1**) et ses moteurs Chromium/WebKit. Son conteneur Noble fournit uniquement les bibliothèques système, évitant l’installation `apt` qui a dépassé 30 minutes lors du dernier contrôle documentaire de #42. Ce dernier contrôle a été annulé ; les tests du **code publié du lot 1** avaient réussi : [CI dédiée](https://github.com/Thsethse/Microcosme/actions/runs/44717265858), [CI dépôt](https://github.com/Thsethse/Microcosme/actions/runs/44717265852). Ce constat ne donne aucune autorisation de fusion de #42.

Les résultats finaux de CI du lot 2, le commit exact de publication et la vérification de la preview sont liés dans la PR de code. Le manifeste public `version.json` contient le commit source, les empreintes des six fichiers d’exécution et celles des 99 fichiers hérités. La publication ajoute seulement sept fichiers dans le nouveau répertoire de preview sur la branche Pages : aucun merge de PR, aucun remplacement du lot 1.

**Validation humaine encore nécessaire** : essai Safari sur iPad physique, confort tactile et lecture artistique du compromis V01. WebKit automatisé et captures ne constituent pas un essai matériel ni une validation artistique. La réserve acceptée sur 21-G n’a pas fait l’objet d’une nouvelle correction. Aucune autre réserve artistique ni intervention du lot 3 n’est traitée ici.
