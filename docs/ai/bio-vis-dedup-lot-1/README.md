# BIO-VIS-DEDUP-01 — Lot 1 : revue artistique à préparer

**[Preview indépendante vérifiée](https://thsethse.github.io/Microcosme/preview/bio-vis-dedup-lot-1/)** · **[PR de code #42 en brouillon](https://github.com/Thsethse/Microcosme/pull/42)**. Code publié : `609ae96da608f45dbd82a4c373d2d8a1d6d36b4f`. Artefact Pages : `9b8aaaab10f6ad6cd5dc6b008d361832eb37ec70`, uniquement six fichiers neufs dans `preview/bio-vis-dedup-lot-1/` ; aucune fusion de la branche de code.

Autorisation de programmation : message explicite de l’utilisateur du **20 novembre 2026**, limité à E01, E02, E03 et E05. Cette autorisation remplace les mentions « non autorisé pour exécution » du contrat documentaire antérieur ; elle ne vaut ni validation du rendu ni autorisation de fusion.

Sources : [contrat intégral](https://github.com/Thsethse/Microcosme/blob/bfc914c2853e997443bea8ba36f48e7205dcb494/docs/ai/bio-vis-dedup-01/CONTRAT_LOT_1.md), [arbitrages utilisateur](https://github.com/Thsethse/Microcosme/blob/bfc914c2853e997443bea8ba36f48e7205dcb494/docs/ai/bio-vis-dedup-01/ARBITRAGES_UTILISATEUR.md), branche documentaire #41 au commit **`bfc914c2853e997443bea8ba36f48e7205dcb494`**. Les quatre PNG E01/E02/E03/E05 et les planches originales V1, A, B, E-v1 et F ont été consultés. E-v1 est bien B409… ; la seconde E n’est pas intégrée.

Base : main **`4fb938ac3e7d4cbd76f1f05b9cd0ec67cdae86f5`**, P5-I6 publié. PR #33 à `0d8cc1d`, audit #40 à `732b864`. Branches et PR ouvertes examinées avant édition ; aucun AGENTS.md retrouvé dans `/workspace`. Aucun travail non fusionné écrasé.

## Corrections du lot

| Dossier | Cible locale | Différence livrée | Préservation |
| --- | --- | --- | --- |
| E01 | 58-G | Couronne courte plus plaquée, larges vagues jointives et courts retours aux tempes ; retrait du halo copié de petites boucles | 08, accessoires et implantation dynamique inchangés ; aucune densité inventée sous les feuilles |
| E02 | 24-D | Raie centrale, deux panneaux arrondis et deux longueurs latérales ondulées | Queue haute et lien arrière inchangés ; 12 et 24-G intacts |
| E03 | 68-G | Trois retours courbes dans un volume frontal local relevé, avec flux vers l’implantation commune | Calotte et arrière inchangés ; 19-G/21-G toujours séparés, 19-D/21-D/68-D intacts |
| E05 | 58-D | Grand rouleau frontal unique, côtés remontés en continu et petites terminaisons roulées | Chignon arrière et bandeau inchangés ; 31-D et 68-D intacts ; Q04 reste ouvert pour un lot ultérieur |

Fichiers de géométrie : [hair.mjs](../../../bio-vis-dedup-lot-1/hair.mjs) (quatre branches), [render.mjs](../../../bio-vis-dedup-lot-1/render.mjs) (composition locale pour les quatre cibles). Le modèle, les huit paramètres, les ancrages, le corps et le visage viennent de P5-I6 et ne sont pas modifiés. Les 122 choix hors cible délèguent au rendu antérieur. Aucune recette héritée n’est changée : les appels internes d’autres coiffures gardent leur ancienne forme, y compris 68-D et toutes les reprises des témoins.

## Comparer sur iPad

La preview expose quatre dossiers : originaux, avant et après, pour **08, 58-G, 12, 24-D, 19-G, 21-G, 68-G, 31-D et 58-D**. Neutre, cas iPad, tous les minimums/maximums, profils allongé/large et huit curseurs sont disponibles. Un catalogue de contrôle garde les 72 références et leurs arrangements, sans fusion visible.

Même tête, corps, orientation et couleur de cheveux dans chaque paire. Vue principale de tête ou d’entier à 300 px, vignette entière à 178 px, miniature à 70×70 px CSS. Les cadres comparatifs avant/après sont communs : tête `-30 -65 220 225`, entier `-40 -85 240 355`, miniature `-35 -68 230 245`. Le cadrage est commun, la géométrie des témoins n’est pas retouchée. Les trois vues réutilisent les mêmes longueurs corrigées.

Les accessoires sont désactivés par défaut ; un contrôle permet de les voir, sans changer leurs chemins ou leur palette. Le lien incorporé à la queue historique 12 est exclu seulement de la copie de comparaison sans accessoires, comme dans l’audit ; le rendu historique exporté reste inchangé. Aucun nouvel objet ni couleur.

Les captures réelles des quatre dossiers, au neutre et dans le cas iPad, sont dans [captures](../../../bio-vis-dedup-lot-1/captures/). Elles montrent les illustrations et les programmes avant/après, pas des simulations d’une correction à venir.

## Vérifications et lecture des résultats

Tests reproductibles et commandes : [README du prototype](../../../bio-vis-dedup-lot-1/README.md). Le résultat mécanique du navigateur est enregistré dans [verification.json](../../../bio-vis-dedup-lot-1/captures/verification.json).

Les tests Node vérifient les 93 fichiers de P5-I6 par SHA-256, les 72 références/126 choix et les 122 choix hors cible aux trois vues sur 22 morphologies et deux états d’accessoires. Les quatre cibles sont parcourues sur 270 états chacune : neutre, cas iPad, 256 sommets et 12 mélanges déterministes. Corps, face, accessoires, volumes à préserver, coordonnées finies et déterminisme sont contrôlés.

La continuité locale est un garde-fou numérique : chaque axe est échantillonné à 21 positions puis perturbé de `1e-6`, avec topologie identique et variation de coordonnée inférieure à `0,001` unité SVG. **Ce seuil détecte un saut numérique ; il n’est pas une métrique de réussite artistique.**

Chromium et WebKit vérifient le parcours tactile, les trois tailles CSS et les formats 820×1180, 1180×820 et 390×844. La matrice géométrique teste quatre cibles, 34 morphologies, deux états d’accessoires et trois vues : **816 SVG par moteur**. Les points de chaque disque oculaire sont échantillonnés, ainsi que les centres nez/bouche/sourcils ; aucun aplat ou contour capillaire avant ne doit les recouvrir. Les points du contour supérieur, décalés de 2,1 unités (rayon du trait de peau), doivent être couverts. Les boîtes de cheveux doivent tenir dans la vue entière. Les comptes sont des contrôles techniques définis, pas des notes esthétiques.

Deux défauts du premier script de vérification ont été corrigés avant validation : ouvrir le panneau natif du catalogue avant d’interagir, et comparer le visage/corps avec le même parseur HTML/SVG (les sérialisations XML et HTML diffèrent sur les balises vides). Ce sont des corrections du protocole de test ; aucune modification du visage ou du corps n’a été faite pour les contourner.

La matrice a aussi détecté un défaut réel de recouvrement de **58-G** : certains raccords terminaux du contour supérieur restaient visibles dans les combinaisons larges/extrêmes après retrait du halo de boucles. La correction ajoute seulement deux raccords locaux suivant les normales du contour réel aux tempes. Aucun agrandissement uniforme, aucune retouche du visage et aucun changement du helper partagé. Les contrôles Chromium/WebKit repassent ensuite sans ouverture aux points testés.

Résultats locaux obtenus :

- **6/6 tests du lot 1** ; 16 104 comparaisons exactes des choix hors cible (122 × 22 morphologies × deux états d’accessoires × trois vues).
- **9/9 tests existants P5-I6** à la source #39 inchangée, dont ses non-régressions cumulatives ; aucune réécriture de leurs attentes.
- **35/35 tests Node du jeu** sur la branche du lot 1.
- **Chromium et WebKit réussis**, chacun avec 816 SVG analysés, 79 968 points oculaires et 30 192 points de couverture supérieure contrôlés ; pas de coordonnées invalides, d’occlusion aux points définis ou de coupure dans le cadre entier.
- Plus grande variation locale observée pour une perturbation de `1e-6` : **0,00005 unité SVG**, sous le garde-fou numérique défini ; aucune conclusion esthétique tirée de cette mesure.

Comparaisons directes, avec les originaux : [E01 neutre](../../../bio-vis-dedup-lot-1/captures/webkit-E01-neutral.png), [E02 neutre](../../../bio-vis-dedup-lot-1/captures/webkit-E02-neutral.png), [E03 neutre](../../../bio-vis-dedup-lot-1/captures/webkit-E03-neutral.png), [E05 neutre](../../../bio-vis-dedup-lot-1/captures/webkit-E05-neutral.png). Les versions `-ipad.png` et les captures Chromium se trouvent dans le même dossier.

## Vérification de la publication

Le [déploiement Pages](https://github.com/Thsethse/Microcosme/actions/runs/44715611279) et la [non-régression du commit de publication](https://github.com/Thsethse/Microcosme/actions/runs/44715611441) sont réussis. La [CI normale de la PR sur le code publié](https://github.com/Thsethse/Microcosme/actions/runs/44714972432) est réussie. Le [workflow dédié du lot 1](https://github.com/Thsethse/Microcosme/actions/runs/44714972606) doit également être consulté ; son installation de navigateurs était encore en cours lors de l’ajout de ce relevé. Le résultat final est reporté dans la description de PR.

Contrôles réellement exécutés sur l’URL publique :

- [99 fichiers servis vérifiés](validation-publique/fichiers.json) : les six fichiers de l’artefact et les 93 fichiers de P5-I6 correspondent aux SHA-256 attendus. TLS vérifié, aucune option insecure.
- [Chromium et WebKit sur Pages](validation-publique/navigateurs.json) : mêmes contrôles tactiles, trois formats et matrice de 816 SVG par moteur ; zéro erreur de chargement, d’occlusion aux points testés ou de couverture.
- [Capture publique Chromium portrait](validation-publique/chromium-ipad-portrait.png) et [paysage](validation-publique/chromium-ipad-paysage.png). Les images comparatives sont identiques à celles du contrôle local ; seules ces captures d’en-tête diffèrent légèrement.

Particularité de l’environnement Cloud : les navigateurs headless ne reconnaissent pas son certificat de proxy. Les requêtes HTTPS publiques ont donc été relayées par curl, avec vérification des certificats configurés, sans désactiver TLS ; la navigation et les modules gardent l’URL Pages réelle. Cela ne constitue pas un essai sur Safari d’un iPad physique.

## Limites artistiques et réception

Les originaux sont frontaux et coupés au buste : ils ne prouvent pas le dos, les pointes hors champ ni les raccords sous les feuilles/bandeau. Les raccords restent limités aux volumes visibles et aux ancrages existants ; aucune reconstitution historique ou racine cachée n’est revendiquée. Les longueurs ondulées et leurs pointes sont une interprétation du prototype, pas une mesure du poster.

Les nouveaux retours et plis restent simplifiés dans le style SVG des habitants. La miniature réduit la lecture des détails intérieurs ; les silhouettes et grandes masses doivent être jugées sur l’iPad physique. Les accessoires inchangés peuvent masquer certains plis : le contrôle sans accessoires est la référence. L’intégration actuelle ne résout pas le trio Q04, puisque 68-D est volontairement intact.

**Statut : publication vérifiée et proposition soumise à la revue artistique ; aucun accord artistique enregistré.** Aucun lot 2, regroupement visible, changement de nom/ID/provenance, suppression, modification du jeu/sauvegardes ou fusion. Attendre l’arbitrage de l’utilisateur sur Safari iPad physique avant toute suite.
