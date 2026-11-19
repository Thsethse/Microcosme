# Copies exactes, quasi-doublons et variantes

## Dix groupes exacts : 24 choix, 14 choix supplémentaires sans nouvelle géométrie

Comparaison hors couleur, objets, IDs et métadonnées ; clips conservés. Égalité observée au neutre, au cas iPad, aux 256 sommets et dans 12 mélanges. Les appels communs/copies sont aussi localisés dans les recettes de [l’inventaire](INVENTAIRE.md). Aucune suppression n’est proposée comme décision acquise.

| Groupe | Choix identiques | Explication vérifiable |
| --- | --- | --- |
| 1 | 08 = 58-G | 58-G appelle exactement la chevelure curls de P4. |
| 2 | 12 = 24-D | 24-D reprend pony ; retrait du lien intégré P4 uniquement dans les copies d’audit. |
| 3 | 19-G = 21-G = 68-G | 19/21-G ont la même branche swept ; 68-G appelle 19-G. |
| 4 | 28-G = 59-G | 59-G appelle 28-G. |
| 5 | 31-D = 58-D | 58-D appelle 31-D. |
| 6 | 38-G = 48-G = 54-G = 69-G | 48/54-G appellent 38-G ; 69-G appelle 54-G. |
| 7 | 47-G = 50-G | 50-G utilise la même forme undercut que 47-G ; contraste exclu. |
| 8 | 48-D = 65-D | 65-D appelle 48-D. |
| 9 | 49-G = 62-D = 71-G | 62-D et 71-G appellent 49-G ; couleur de 62 exclue. |
| 10 | 64-G = 70-G | 64/70-G partagent la même branche chignon et côtés courts. |

[Planche des copies](planches/doublons.png). Les empreintes complètes sont dans [FAMILLES](FAMILLES.md) et [compositions.json](data/compositions.json). Les 19 paires exactes ne sont pas 19 nouveaux groupes : les groupes de trois/quatre génèrent plusieurs paires. 63-G ne rejoint jamais 01, même si aucun chemin de cheveux n’est émis dans les deux cas : l’un est inconnu, l’autre explicitement rasé.

## Quasi-doublons : cinq paires neutres, quatre rapprochements de compositions

Indice = intersection / union des pixels de silhouette de cheveux visibles, à cadre commun 480×710, sans détails internes ni objets, au neutre. Le seuil de 95 % repère des candidats ; **ce n’est pas un seuil de perception ni une égalité**. Cinq paires non exactes dépassent ce seuil dans les deux moteurs. 58-D est une copie de 31-D : les deux comparaisons avec 68-D représentent donc un seul rapprochement de compositions.

| Paire neutre | IoU Chromium | IoU WebKit | Différence restante |
| --- | ---: | ---: | --- |
| 32-D / 60-D | 97.28 % | 97.30 % | Deux mèches libres supplémentaires en 60-D. |
| 25-D / 44-D | 96.53 % | 96.55 % | Trois petites tresses de tempe et différences de calotte/masque. |
| 19-D / 21-D | 95.79 % | 95.79 % | Ligne basse et réglage de la mèche, end+3/end+5. |
| 31-D / 68-D | 95.18 % | 95.19 % | Type de chignon lisse/roulé ; rouleaux et mèches largement partagés. |
| 58-D / 68-D | 95.18 % | 95.19 % | Même comparaison que 31-D/68-D puisque 58-D = 31-D. |

Ces cinq paires ne sont pas fusionnées transitivement. Les quatre rapprochements ont été mesurés sur 32 états dans les deux moteurs (neutre, cas iPad, 16 extrêmes d’axes, tout min/max, 12 mélanges) :

| Rapprochement | Plage IoU Chromium | Plage IoU WebKit | Cas iPad Chromium |
| --- | ---: | ---: | ---: |
| 32-D / 60-D | 94.84–97.45 % | 94.92–97.45 % | 94.84 % |
| 25-D / 44-D | 95.39–97.47 % | 95.41–97.59 % | 95.87 % |
| 19-D / 21-D | 92.89–97.09 % | 92.99–97.15 % | 93.24 % |
| 31-D / 68-D | 94.70–95.84 % | 94.77–95.87 % | 95.84 % |

[Planche neutre / iPad](planches/quasi-doublons.png). Le cas 19-D/21-D descend sous 95 % : le qualificatif « quasi-doublon neutre » ne vaut pas égalité sur tout l’intervalle. Les plages ne couvrent que les 32 états testés, pas une borne mathématique du continuum.

## Variantes proches et contre-exemples

32-G/35-G partagent la topologie, mais la largeur de natte et son trajet changent ; 32-D/35-D ont aussi une autre couronne. 56-G/61-G ajoutent deux mèches au petit chignon. 56-D/61-D changent la raie, le déport et le balayage. Ces observations justifient des variantes, pas des copies exactes.

46-G/62-G restent des crêtes, mais l’implantation .31r/.69r et les contours diffèrent fortement. 49-D/50-D ont un arrière différent, pas seulement une couleur. 52-G/D restent des locks cylindriques et ne doivent pas être regroupées avec des tresses sur leur seul nombre de brins. 66-D/67-D partagent des chemins observés, mais leurs clips d’ouverture diffèrent : silhouettes partielles distinctes, racines toujours inconnues.

Le fichier des voisinages contient les paires IoU ≥80 % ([Chromium](data/visual-chromium.json), [WebKit](data/visual-webkit.json)). Leur nombre est sensible au moteur près du seuil (94/95 paires, dont 19 exactes). Il n’est pas utilisé pour fabriquer des familles par connexité ou pour supprimer des modèles.
