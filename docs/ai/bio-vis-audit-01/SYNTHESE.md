# Conclusions et scénarios

## Réponse chiffrée

**A = 72 références, avec 126 choix effectifs. B = 111 compositions géométriques distinctes selon le protocole strict ci-dessous. C = 32 familles visuelles complètes proposées par l’audit.** Ces nombres ne sont pas trois mesures de la même chose.

B porte sur 125 choix observables : 122 complets, dont le crâne rasé, et trois fragments. Il comprend **107 compositions complètes avec cheveux, une absence explicite de cheveux et trois compositions partielles**. Le choix 63-G, intégralement occulté, n’ajoute aucune géométrie connue. La partie complète seule comprend donc 108 compositions, rasée incluse.

La comparaison des commandes sur 270 états (neutre, cas iPad, 256 sommets et 12 mélanges) donne **dix groupes de copies**, soit 24 choix impliqués et 14 choix supplémentaires sans nouvelle géométrie. Ces dix groupes représentent 19 paires exactes, sans compter deux fois les membres des groupes de trois/quatre. Les silhouettes noires au neutre, à cadre constant, donnent aussi 111 classes dans Chromium et WebKit ; cette confirmation raster ne remplace pas la comparaison des commandes.

À ce niveau très strict, deux recettes proches mais numériquement différentes restent séparées. **111 n’est donc pas un décompte d’algorithmes indépendants ni de différences artistiques fortes.** Le niveau B est celui des compositions évaluées ; le niveau C regroupe leurs résultats par macro-forme. Aucun nombre unique de « briques indépendantes » n’est intrinsèquement défini dans ce code, qui combine des helpers, des constantes et des copies entre modules.

Le classement C contient **31 familles de cheveux complets et une famille sans cheveux**. Les deux groupes de fragments sous tissu et le cas totalement inconnu restent hors de ces 32. La frontière entre familles est qualitative : attaches, distribution des longueurs, volume dominant, texture et zones courtes. Une classification plus fine ou plus large est possible ; l’audit ne présente pas 32 comme une vérité perceptuelle exacte ni comme 32 modèles interchangeables.

Les 72 signatures de référence complète (choix unique ou paire G/D) sont différentes. On ne peut donc pas retrancher les 14 choix redondants de 72 pour annoncer « 58 coiffures » : les dénominateurs seraient mélangés et les D distincts disparaîtraient dans le raisonnement.

## Pourquoi le nombre de formes perçues est plus faible

1. Les mêmes structures reviennent sous plusieurs alias : 38-G/48-G/54-G/69-G ; 49-G/62-D/71-G ; 08/58-G, entre autres.
2. L’enveloppe d’implantation est commune à presque tout le catalogue. La mèche 19-G est réutilisée dans 24 calques frontaux au neutre, y compris des chignons et des variantes longues.
3. Beaucoup de variations sont de petites modifications de longueur, d’épaisseur, de position de chignon ou de mèches supplémentaires. Exemple : **32-D/60-D : 97,28 % de recouvrement au neutre**, mais deux mèches libres réellement différentes.
4. Les grands mouvements courbes des posters deviennent souvent des polygones de pointes ou une mèche en S déjà existante. La diversité de silhouette dessinée dans les sources n’est pas entièrement transmise.
5. Objets et couleurs créent une diversité de présentation sans toujours ajouter de cheveux. 47-G/50-G ne diffèrent que par la couche de contraste ; 64-G/70-G ont les mêmes cheveux.
6. Les cadrages et l’omission de certaines longueurs dans les vues historiques atténuent les écarts visibles. Ce phénomène est distinct d’une copie de géométrie.

## Différences conservées et différences perdues

La diversité n’est pas inexistante : afro, locks cylindriques, crêtes, rangées plaquées, chignons, queues, couettes, doubles nattes et longueurs libres sont réellement construits. Une lock n’est pas codée comme une tresse avec une autre étiquette. 46-G/62-G ne sont pas des copies : leurs implantations et leurs pointes diffèrent. 49-D/50-D ont une différence d’arrière, même sans couleur.

Les pertes les plus nettes concernent les **grandes mèches frontales** (19-D, 21-D, 24-D, 61-D, 65-G, 68-G, 71-G, 72-G), les **boucles/rouleaux peu réguliers** des posters et la **densité/organisation des tresses fines** de 55. Les rapprochements 58-G/08 et 58-D/31-D n’ont aucun réglage propre aux formes de 58 une fois les ornements retirés. Leur nécessité artistique reste à décider, sans considérer toute mutualisation comme une erreur.

La source de 62-D est surtout différenciée par sa teinte : une copie de 49-G y est cohérente avec l’interdiction de créer une géométrie sur une couleur. Les rapprochements 19-G/21-G, 28-G/59-G et 64-G/70-G sont également compatibles avec les ressemblances des sources.

Le cas 41 comporte un écart documentaire précis : la fiche annonce deux nattes D, le programme en trace une plus une mèche. L’image frontale ne prouve pas clairement que le second brin soit tressé. L’audit ne transforme pas cette ambiguïté en défaut artistique certain. Les racines masquées de 63-G, 66 et 67-D restent inconnues.

## Familles peu représentées ou peu différenciées

- Grandes mèches souples et balayages à dessin propre : beaucoup de variantes retombent sur 19-G.
- Rouleaux ouverts, torsades et boucles non périodiques : petit vocabulaire répété, avec plusieurs références rassemblées autour de 31-D.
- Rangées de tresses fines denses et répartitions moins régulières : nombre et trajet fixés, notamment 55.
- Différences graduées entre pointes courtes, mèches souples et nuques étagées : les tableaux de pointes rapprochent des intentions graphiques distinctes.
- Variété des queues/couettes, des masses afro et des locks : plusieurs intentions existent, mais peu de types et aucun réglage libre de densité/texture/attache.
- Longueurs caractéristiques dans les vues historiques : sous-représentées dans certaines vues, alors qu’elles sont présentes dans le corps entier.

Ces constats portent sur les formes disponibles, sans catégorie d’origine, de métier, de croyance ou de sexe. Les références 73–81 n’ont pas été inspectées comme code ni proposées comme nouveau lot.

## Trois scénarios, aucun mis en œuvre

| Scénario | Bénéfice visuel attendu | Complexité estimée | Risque de régression | Travail nécessaire |
| --- | --- | --- | --- | --- |
| **A · Conserver l’existant** et envisager plus tard les couleurs naturelles | Diversité de présentation accrue, mêmes silhouettes | Faible à moyenne si palette séparée ; estimation qualitative, pas chiffrage de délai | Faible à moyen : contrastes, calques de teinte et lisibilité | Accepter explicitement les copies/variantes ; définir ultérieurement une palette et ses règles ; tester contrastes et Safari. Aucune couleur ajoutée ici. |
| **B · Rationaliser le catalogue** en gardant toutes les références documentaires | Navigation plus claire, différences réelles plus faciles à trouver | Moyenne : données d’alias, présentation par familles et continuité des IDs | Moyen : résolution des IDs, G/D et liens de provenance | Faire valider les dix groupes exacts et les quatre rapprochements ; conserver les D distincts et les inconnues ; aucun effacement de référence ; revoir la présentation seulement après décision. |
| **C · Améliorer la diversité structurelle** de quelques constructions ciblées | Plus forte différence de silhouette, surtout balayages, rouleaux et tresses fines | Moyenne à élevée selon les cibles ; aucune refonte imposée | Moyen à élevé : recouvrement, attaches, huit axes, trois vues | Choisir quelques vignettes précises avec le porteur du projet ; comparer leurs contours en monochrome ; améliorer localement les routes/volumes et, séparément, traiter les omissions de vues ; validations humaines par étapes. |

Aucune préférence n’est décidée pour l’utilisateur. Une couleur, un objet ou un nouvel intitulé ne doit pas être compté comme une nouvelle structure de cheveux. Les accessoires potentiellement fabriqués par les habitants doivent rester des objets distincts dans une éventuelle mission future, sans décision d’équipement prise par cet audit.
