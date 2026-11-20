# BIO-VIS-DEDUP-01 — Lot 3 : volumes, pointes et panneaux

## Autorisation et préflight

L’utilisateur a explicitement autorisé **la programmation du lot 3 le 20 novembre 2026** et demandé une preview indépendante, une PR brouillon et aucune fusion. Cette autorisation permet l’exécution du [contrat intégral du lot 3](https://github.com/Thsethse/Microcosme/blob/2b0fb7c8a47d19008263519a7cfc681ca6006fee/docs/ai/bio-vis-dedup-01/CONTRAT_LOT_3.md), dont la création documentaire n’autorisait pas seule l’exécution.

Avant modification : branches et PR ouvertes examinées ; **#42 et #43 restent en brouillon et non fusionnées**, respectivement aux commits `1ff931586776b3f7ed41bbdc5772b97e030aa4db` et `4156254ca5a9b4a52f138a558bd70d461f4d4c4e`. La branche documentaire #41 pointe sur `2b0fb7c8a47d19008263519a7cfc681ca6006fee`. Aucun `AGENTS.md` retrouvé dans l’espace de travail, ses répertoires cachés et les ancêtres. Les anciens documents `docs/llm-project-memory/` mentionnés dans la méthode historique ne sont pas présents dans l’arbre actuel ; aucune instruction de ces fichiers n’est inventée.

Lecture complète du contrat, des [arbitrages utilisateur](https://github.com/Thsethse/Microcosme/blob/2b0fb7c8a47d19008263519a7cfc681ca6006fee/docs/ai/bio-vis-dedup-01/ARBITRAGES_UTILISATEUR.md), de la méthode, du contrat du lot 2 et des dossiers/PNG **E06, E09, Q03, V02, V09**. Les anciennes mentions « En attente » des planches ne prévalent pas sur les arbitrages et l’autorisation actuelle. Les lots 1/2 sont artistiquement validés ; aucune autorisation de fusion n’en découle.

## Base indépendante et fichiers hérités

Branche : **`codex/bio-vis-dedup-lot-3`**, issue de `main` **`5b6e4019084ee302090656b2736efcce85adece8`**. Composition isolée à partir des artefacts déjà publiés :

| Composant | Provenance | Utilisation |
| --- | --- | --- |
| P5-I6 | `preview/bio-vis-p5-i6/` | Modèle, huit paramètres, corps, visage, ancrages, catalogue canonique et références originales |
| Lot 1 | Code publié `5ea862510b04904904241a09695be4c9141ce4a8` | Quatre corrections graphiques héritées, sans réécriture de leurs fichiers |
| Lot 2 | Code publié `94bffaf0cf6fddc5d0f40ebebf21c76ed5acaddf` | Même fonction de rendu de base ; catalogue, six regroupements et fonctions de sélection directement réexportés |

**106 fichiers hérités figés par SHA-256**, dont les PNG et manifestes : [manifeste](../../../bio-vis-dedup-lot-3/tests/frozen-manifest.json). Aucun fichier de ces répertoires n’est modifié. La nouvelle fonction de rendu délègue exactement au lot 2 pour **116 choix sur 126**. Les dix autres passent par des recettes capillaires locales, sans modifier les helpers partagés `rough`, `bob`, `fan`, `smoothBun` ni le modèle.

Le modèle conserve les mêmes valeurs, limites, corps, visages et ancrages. Les calques d’accessoires, de couleur et de contraste des cibles sont également conservés. Aucun nouvel accessoire ni nouveau réglage.

## Références originales retrouvées

Les six fichiers suivants sont des **PNG valides de 1536×1024**, identiques octet pour octet aux sources documentaires #33, commit `0d8cc1dccea821c14c35ac4addf46bafa753bc86` :

| Planche | Fichier source dans `docs/ai/visual-references/` | Dossiers |
| --- | --- | --- |
| P5-A | `C7BEACBF-323B-4D6F-ABFF-92A988EC909F.png` | Q03 |
| P5-B | `0F3CDCE7-24D6-40E4-80D8-4BE2429238AF.png` | V09 |
| P5-C | `7C197DD6-3733-4B37-A0B0-B265FF034BD8.png` | E06 |
| P5-D | `FAC68E60-6567-4D1A-B299-46A07B836D27.png` | E06, E09, V09 |
| P5-E v1 | `B4099DCA-66B1-4415-8C50-53AA5CFA1C04.png` | E09, V02 |
| P5-F | `132E23ED-C1DE-4311-8BAF-B56E09277B56.png` | E06, E09 |

Aucune image nécessaire à ces cinq dossiers ne manque. E-v1 correspond bien à **B409…**, selon l’arbitrage utilisateur. Aucun recours à E-v2 ni aux choix 73–81.

Quatorze extractions originales sont fournies pour les dix choix corrigés et les quatre témoins. Elles reprennent exactement les rectangles de la galerie documentaire, sans retouche des pixels. [Provenance et rectangles](../../../bio-vis-dedup-lot-3/references/provenance.json) : planche, ligne/colonne, G/D, chemin source, commit et empreintes de la planche et de l’extraction. Chaque original ouvre la planche entière et sa fiche documentaire. Les visages, corps, couleurs et objets des sources restent de la documentation ; ils ne sont pas reproduits dans les habitants Microcosme.

## Attribution E06 avant implémentation

Attribution minimale annoncée avant le code : **38-G → courbes souples ; 48-G → pointes rayonnantes ; 54-G et 69-G → géométrie historique conservée**.

Elle découle de C-38-G (grands retours courbes orientés), D-48-G (rayonnement plus anguleux), et de la limite des illustrations D-54-G/F-69-G dont les racines sont partiellement cachées sous les lunettes. Aucune distinction supplémentaire entre 54-G et 69-G n’a été arbitrée. Le lot n’impose donc pas quatre formes : il restitue deux organisations documentées, avec deux témoins historiques intacts. Les arrangements D ne changent pas.

## Corrections effectuées

| Dossier | Choix modifiés | Résultat et garde-fous |
| --- | --- | --- |
| **E06** | **38-G, 48-G** | Trois grands retours courbes orientés pour 38-G ; grandes pointes principales réparties irrégulièrement autour du sommet pour 48-G. Pas de multiplication de petites dents. 54-G/69-G restent inchangés. |
| **E09** | **71-G** | Nappe oblique continue, plus large, bord souple et deux départs de direction lisibles. Son bord intérieur passe à l’extérieur de l’œil. 49-G/62-D et leur regroupement ne changent pas. |
| **Q03** | **19-D, 21-D** | 19-D : panneaux bas pleins et arrondis, extrémités rentrantes. 21-D : panneaux plus rectilignes, ligne basse nette et panneau frontal oblique continu. Les G et 68-G restent intacts. |
| **V02** | **56-D, 61-D** | 56-D : raie médiane et deux panneaux symétriques. 61-D : grand retour frontal arrondi et déporté. Chignons arrière, supports, mèches historiques et accessoires hérités conservés. Aucun changement des G. |
| **V09** | **29-G, 34-G, 51-G** | 29-G : relèvement roulé bas à masses rondes ; 34-G : vague haute basculée latéralement ; 51-G : trois retours ouverts de directions et d’intervalles inégaux. Les différences portent sur l’organisation, pas seulement sur la hauteur. D inchangés. |

La couverture supérieure réutilise l’enveloppe analytique P3-R1 du crâne réel. Un premier contrôle a détecté **60 points exposés sur 19-D**, uniquement dans certaines combinaisons front large/tempes étroites. Correction locale de ses deux raccords latéraux par des petits pans suivant les normales du contour ; pas d’agrandissement uniforme, pas de modification de la tête. 21-D ne nécessitait pas ces pans.

## Préservation des lots 1 et 2

- **Lot 1** : 58-G, 24-D, 68-G, 58-D inchangés ; vue témoin avant/après lot 3 dans la preview.
- **Lot 2** : mêmes objets/fonctions importés pour le catalogue ordinaire et la sélection, mêmes six correspondances : 19-G/21-G → 19-G ; 28-G/59-G → 28-G ; 47-G/50-G → 47-G ; 49-G/62-D → 49-G ; 64-G/70-G → 64-G ; 56-G/61-G → 56-G.
- **72 références, 126 choix documentaires, 120 entrées ordinaires** confirmés. Seuls les dix choix graphiques ci-dessus changent ; aucun regroupement nouveau.
- Les 126 identifiants restent chargeables par le contrôle historique. Les secondaires restent secondaires dans les données et le rendu. **61-G garde ses deux mèches**, et le choix explicite du principal reste nécessaire pour le remplacer. Les informations de contraste de 50-G et 62-D sont conservées.
- Les versions opposées G/D, 54-G/69-G, les témoins 49-G/62-D et les choix des lots 4/5 restent intacts. Aucune fusion transitive, suppression d’identifiant, modification du jeu ou migration de sauvegarde.

## Preview et comparaisons

Adresse prévue : **https://thsethse.github.io/Microcosme/preview/bio-vis-dedup-lot-3/**

Les cinq dossiers sont accessibles par les boutons E06, E09, Q03, V02, V09 ou « Tous les dossiers ». Chaque choix montre **original / avant lot 3 / après lot 3**, dans la même morphologie, le même corps, la même palette neutre et sans accessoires. Les tailles sont simultanément accessibles : **tête 300 px**, **entier 178 px**, **miniature 70×70 px**.

Le panneau commun propose les huit paramètres, les minima/maxima autorisés, le cas iPad combiné et des morphologies étroite/allongée et large. Les comparaisons appliquent les mêmes réglages aux deux côtés, sans altérer la référence originale. Les contrôles natifs et boutons d’au moins 44 px sont tactiles ; les formats portrait/paysage/étroit sont vérifiés sans masquer les débordements avec un `overflow-x:hidden` global.

Le catalogue ordinaire se déplie avec ses **120 entrées** et ses boutons vers les historiques secondaires. L’inspecteur propose les 126 IDs, les trois tailles, les couleurs/accessoires historiques et l’aller-retour JSON sans perte. Il n’accède à aucune sauvegarde réelle, API de jeu ou stockage persistant ; tout reste dans la mémoire de cette page.

## Protocole de tests

Commandes et reproduction dans le [README du prototype](../../../bio-vis-dedup-lot-3/README.md).

| Contrôle | Portée |
| --- | --- |
| Non-régression du dépôt | `npm test` et tests navigateur du jeu sous Chromium/WebKit |
| Intégrité | 106 empreintes héritées, 14 extractions PNG, six empreintes de sources documentaires |
| Conservation du lot 2 | Identité des fonctions/objets réexportés, 72/126/120, six alias exacts, aller-retour sans perte |
| Hors correction | **116 choix**, **6 264 comparaisons exactes** : trois vues, neutre/iPad/étroit/large/min/max, deux états accessoires/couleur, puis six corps |
| Déterminisme / validité | Dix corrections, **256 coins extrêmes** et 38 états neutres/intermédiaires/axes isolés ; coordonnées finies, modèle/ancrages non mutés |
| Continuité | **480 paires** autour des valeurs intermédiaires/limites sur huit axes ; topologie stable et déplacement borné pour une variation de 10⁻⁶ |
| Géométrie navigateur | Yeux testés sur une grille elliptique, points nez/bouche/sourcils, contour couvert, corps/visage inchangés, cadres natifs, chignons et supports hérités inchangés |
| Consultation | 126 IDs chargés par moteur, 120 entrées ordinaires, six secondaires/contrastes/V01 ; contrôle tactile des huit axes, six corps, originaux décodés, 300/178/70 |
| Écrans | **820×1180**, **1180×820**, **390×844** ; Chromium et WebKit |
| Lots 1 et 2 | Rejeu de leurs **suites originales** aux commits inspectés, depuis des copies temporaires ; aucun résultat ni capture écrit dans les dossiers hérités |

Les vues avant/après ont des préfixes d’instance distincts pour les identifiants SVG. Les empreintes et comparaisons exactes portent sur les données/rendus, tandis que les contrôles aux points de mesure ne prouvent pas chaque pixel de tout le continuum.

## Limites et validation humaine

**Aucune validation artistique ni essai sur iPad physique n’est revendiqué.** Les orientations de volumes, la lecture des masses en miniature et le confort tactile doivent être validés par l’utilisateur dans Safari sur son iPad.

71-G laisse l’œil visible conformément au contrat ; sa nappe est donc plus dégagée que celle qui recouvre l’œil dans l’illustration originale. La proximité aux références reste à juger humainement. Les origines cachées sous les lunettes de 54-G/69-G ne sont pas inventées ; ces deux rendus restent historiques. Aucune amélioration du lot 4, ni des cas réservés E08/V08/V12.

Le rendu simplifié de P4-R1 reste le cadre artistique : aucun visage, corps ou proportion des planches P5 n’est repris. Les tests automatisés ne constituent pas une validation esthétique.

## Résultats locaux

**Tous les contrôles passent après la correction locale du raccord de 19-D.**

- Dépôt : **35 tests Node réussis** ; tests du jeu sous Chromium et WebKit réussis (interface tactile, inspecteur sans mutation, mémoire restaurée, hors ligne, contrôles v0.9).
- Lot 3 : **6 tests Node réussis**, dont les 6 264 comparaisons exactes hors correction et 480 paires de continuité.
- [Navigateurs lot 3](captures/local-results.json) : **Chromium et WebKit réussis**, chacun sur **2 950 SVG** ; **289 100 points d’œil**, **109 150 contrôles de couverture**, **10 915 contrôles de cadre**, **2 950 visages et corps comparés à l’identique**. Aucune anomalie aux points testés, erreur JS ou réponse HTTP en échec. Les 126 options historiques se chargent et les 120 entrées ordinaires sont présentes.
- [Suites originales des lots 1 et 2](captures/legacy-results.json) : **6 + 7 tests Node réussis**, ainsi que leurs deux suites navigateur originales sous **Chromium et WebKit**. Lot 1 : 1 080 états Node cibles et 816 SVG par moteur dans le contrôle géométrique d’origine. Lot 2 : 1 512 allers-retours historiques.
- Intégrité : **106/106 fichiers hérités conformes**, 14 extractions conformes aux six sources originales.

Comparaisons WebKit, originaux et trois tailles inclus :

| Dossier | Neutre | Cas iPad combiné |
| --- | --- | --- |
| E06 | [Voir](captures/webkit-E06-neutral.png) | [Voir](captures/webkit-E06-ipad.png) |
| E09 | [Voir](captures/webkit-E09-neutral.png) | [Voir](captures/webkit-E09-ipad.png) |
| Q03 | [Voir](captures/webkit-Q03-neutral.png) | [Voir](captures/webkit-Q03-ipad.png) |
| V02 | [Voir](captures/webkit-V02-neutral.png) | [Voir](captures/webkit-V02-ipad.png) |
| V09 | [Voir](captures/webkit-V09-neutral.png) | [Voir](captures/webkit-V09-ipad.png) |

Consultation : [portrait iPad](captures/webkit-ipad-portrait.png), [paysage iPad](captures/webkit-ipad-landscape.png), [format étroit](captures/webkit-narrow.png).

La CI dédiée utilise Playwright **1.62.1**, version du lockfile du dépôt, et installe ses moteurs. Le conteneur Noble fournit seulement les bibliothèques système. Elle rejoue également les suites originales des lots 1/2 dans des copies temporaires, sans fusion ni modification de leurs sources. Les captures et résultats sont disponibles comme artefact de CI.

La publication reste séparée de la PR de code : seuls les **23 fichiers** du nouvel artefact sont ajoutés dans `preview/bio-vis-dedup-lot-3/` sur la branche Pages. Le manifeste `version.json` épingle le commit source et les empreintes des 22 fichiers d’exécution/référence et des 106 fichiers hérités. Les liens exacts de PR, déploiement, CI et contrôles publics sont ajoutés à réception de ces vérifications.

## Livraison publique vérifiée

- **PR brouillon [#44](https://github.com/Thsethse/Microcosme/pull/44)**, branche indépendante `codex/bio-vis-dedup-lot-3`. Les PR #42 et #43 restent non fusionnées et inchangées.
- **Preview publiée et ouverte : https://thsethse.github.io/Microcosme/preview/bio-vis-dedup-lot-3/**.
- Source d’exécution **`f8c70e23cdea56cd506e837a9587035af9e2c81f`**, épinglée par le manifeste public. Les ajouts ultérieurs au journal et au lanceur de tests ne changent pas le rendu publié.
- Publication **`9590c809e8b1e316da4f8b11466ebd9e02e322fb`**, **23 nouveaux fichiers uniquement** dans `preview/bio-vis-dedup-lot-3/`. [Déploiement GitHub Pages réussi](https://github.com/Thsethse/Microcosme/actions/runs/44817243276), sans fusion de PR.
- [Empreintes publiques](captures/public-files.json) : **129/129 conformes**, soit 23 fichiers de preview et 106 fichiers hérités, téléchargés en HTTPS avec vérification TLS active.
- [Tests sur l’URL publique](captures/public-results.json) : **Chromium et WebKit réussis**, chacun avec les mêmes **2 950 SVG**, les contrôles d’yeux/couverture/cadres et les trois formats. Les originaux sont chargés, les 126 IDs se sélectionnent et les six regroupements sont conservés.
- [Non-régression initiale du dépôt réussie](https://github.com/Thsethse/Microcosme/actions/runs/44817161260). Suivi de la CI complète et de ses derniers résultats sur la **PR #44** ; les liens d’exécution finaux figurent aussi dans sa description.

Le premier passage de CI dédiée a réussi les tests du lot 3, puis a échoué lors du chargement des anciennes suites : Git signalait le propriétaire du répertoire dans le conteneur. Le lanceur et la commande de lecture Git ont été corrigés avec un `safe.directory` **limité au répertoire exact du dépôt**, sans exception globale ni modification du rendu. La CI rejoue ensuite les anciennes suites.

Le certificat du proxy de cet environnement n’est pas reconnu par les navigateurs headless locaux. Les tests publics acheminent donc les requêtes via `curl` avec sa chaîne de confiance configurée, en gardant l’origine Pages réelle et sans désactivation de TLS. La CI teste les mêmes fichiers directement via HTTP local. Cette particularité du banc de test n’impose aucun outil supplémentaire à l’utilisateur sur iPad.

**Réception attendue : validation artistique par l’utilisateur sur Safari iPad physique. Aucune fusion et aucune suite vers le lot 4 avant nouvelle autorisation.**
