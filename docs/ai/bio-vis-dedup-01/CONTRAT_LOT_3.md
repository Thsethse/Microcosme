# BIO-VIS-DEDUP-01 — CONTRAT LOT 3 : volumes, pointes et panneaux

**Statut : contrat documentaire préparatoire. Aucun feu vert de programmation, de fusion ou de lancement du lot 4.**

Dépôt : https://github.com/Thsethse/Microcosme
Sources autorisées : [arbitrages utilisateur](ARBITRAGES_UTILISATEUR.md), [décisions et planches](DECISIONS.md), [méthode](METHODE.md), [contrat lot 2](CONTRAT_LOT_2.md). Consulter les PNG E06, E09, Q03, V02, V09 dans `planches/` et les illustrations sources reliées par ces dossiers avant de modifier une forme.

## 1. Prérequis, état et méthode

L'utilisateur a validé artistiquement le lot 1 (réserve non bloquante sur 21-G) et le lot 2 sur sa preview publique le 20 novembre 2026. La PR #42 contient le lot 1, la PR #43 le lot 2, et le contrat du lot 2 a été préparé sur la PR documentaire #41. **Une validation artistique n'est pas une autorisation de fusion.**

Avant tout code, vérifier le statut réel des PR, branches, commits, AGENTS.md et les instructions du dépôt. Composer une base de travail qui **inclut réellement les corrections du lot 1 et la couche de regroupement du lot 2**, sans fusionner les PR, sans réécrire leurs branches et sans remplacer leurs previews. Documenter précisément la provenance et les empreintes des fichiers réutilisés.

Les six regroupements du lot 2 doivent rester effectifs : 19-G/21-G, 28-G/59-G, 47-G/50-G, 49-G/62-D, 64-G/70-G et 56-G/61-G. Le catalogue ordinaire annoncé dans la PR #43 comporte 120 entrées, tandis que les 72 références et 126 choix documentaires sont préservés ; revérifier ces comptes sur la base effectivement utilisée.

## 2. Périmètre graphique exact

### E06 — 38-G / 48-G / 54-G / 69-G

Diagnostic documentaire : les quatre choix utilisent la même famille `rough(battle)`, avec reprises successives, sans différence de mèches dans le protocole de comparaison. **Objectif validé : au moins deux organisations lisibles**, l'une à courbes souples, l'autre à pointes rayonnantes. **Ne pas imposer quatre géométries distinctes.** Le couple 54-G/69-G n'a pas été arbitré individuellement : ne pas inventer une distinction obligatoire entre ces deux choix. Avant implémentation, proposer une attribution minimale argumentée des formes aux choix et vérifier qu'elle découle des planches ; en cas d'ambiguïté matérielle, conserver la géométrie historique et consigner le point plutôt que créer une coiffure sans source. Garder l'aspect graphique irrégulier sans multiplier artificiellement les dents ni les pointes. Ne pas toucher aux versions D.

### E09 — 71-G uniquement

Diagnostic : 49-G, 62-D et 71-G réutilisaient une composition proche ; **49-G et 62-D ont déjà été regroupés visuellement au lot 2**. Objectif : différencier **71-G** avec une nappe couvrante distincte de l'undercut à pointe représenté par 49-G. Protéger les yeux, le front et le contour dynamique de la tête. Ne pas modifier la correspondance historique 49-G/62-D, leurs rendus ou les arrangements 49-D/62-G. Vérifier la lisibilité de 71-G en miniature et sous plusieurs morphologies.

### Q03 — 19-D / 21-D

Diagnostic : les deux compositions `bob(false/true)` ont déjà des différences de bord inférieur et de longueur (`end+3` / `end+5`) mais restent trop proches visuellement. Objectif : **deux organisations de panneaux clairement identifiables** à la taille de catalogue, sans inventer de nouveaux accessoires. Éviter le défaut historique de recouvrement du crâne signalé dans l'audit P3. Ne pas modifier les variantes G : 19-G/21-G sont regroupées au lot 2, 68-G a été différenciée au lot 1.

### V02 — 56-D / 61-D

Diagnostic : chignons lisses apparentés, avec raie et balayage/déport frontal distincts. Objectif : renforcer **deux arrangements frontaux** reconnaissables sans épingle ni couleur. Préserver la continuité entre rouleau, implantation et chignon et éviter l'occlusion du visage. Ne pas modifier 56-G/61-G : leur regroupement visible appartient au lot 2, tandis que leurs identifiants et rendus historiques restent disponibles.

### V09 — 29-G / 34-G / 51-G

Diagnostic : `fan(false)`, `fan(true)`, `highFan` offrent des volumes différents mais une silhouette générale d'éventail pointu trop proche. Objectif : **trois organisations de masses et de direction des pointes**, pas trois hauteurs d'un même éventail. Préserver les grands aplats lisibles, éviter la surcharge de détails et vérifier la silhouette sans couleurs ni accessoires. Ne pas étendre les corrections aux versions D.

## 3. Contraintes impératives

- Modifier **uniquement les compositions capillaires des choix ciblés**. Pas de modifications biologiques, morphologiques, de corps, visage, paramètres, accessoires, couleurs, sauvegardes, moteur du jeu, catalogue canonique ou identifiants.
- Préserver le rendu des quatre corrections du lot 1 : 58-G, 24-D, 68-G, 58-D.
- Préserver la couche de présentation/alias du lot 2, ses six regroupements, ses 120 entrées visibles si confirmées et les 126 choix historiques. Les choix secondaires doivent rester accessibles par ID et ne pas être remplacés dans les anciennes sélections.
- Ne pas modifier 71-G par un changement du helper partagé affectant 49-G/62-D ; isoler les corrections de manière locale. Même règle pour les helpers `rough`, `bob`, `fan` ou `smoothBun` utilisés ailleurs.
- Ne pas rouvrir les arbitrages des lots 1 et 2. Ne pas toucher à Q04, V07, V11 (lot 4), ni aux cas réservés E08, V08, V12.
- Ne pas inventer de volumes cachés sous les objets ou hors des illustrations sources. Les limites documentaires sont à signaler.
- Préférer la **solution minimale visuellement satisfaisante** à la multiplication de variantes, réglages ou abstractions.

## 4. Future livraison Codex — sous autorisation distincte

1. Créer une branche de code indépendante et une **PR brouillon**, sans fusion, avec liste explicite des fichiers changés et de la base retenue.
2. Publier une **preview indépendante GitHub Pages** `preview/bio-vis-dedup-lot-3/`, sans écraser les previews des lots 1 et 2.
3. Afficher pour chacun des cinq dossiers : **illustration originale / avant lot 3 / après lot 3** ; montrer les choix comparés côte à côte, même morphologie, couleur neutre, accessoires désactivés par défaut.
4. Fournir les trois échelles de comparaison **300 px, 178 px, 70×70 px**, vues tête et entier ; paramètres morphologiques, morphologies larges/étroites et cas extrêmes ; vérification portrait/paysage sur iPad.
5. Ajouter une vue du catalogue ordinaire **avec les regroupements du lot 2**, ainsi qu'un contrôle d'accès aux IDs historiques et une vue témoin des corrections du lot 1.
6. Exécuter les tests de non-régression du dépôt et des lots 1/2, ainsi que Chromium et WebKit. Vérifier déterminisme, continuité des huit paramètres, raccords, visage/yeux non occultés aux points de contrôle, limites des cadres et absence de débordement tactile.
7. Comparer exactement les rendus de **tous les choix hors cibles** à la base combinée ; documenter les comptes réels et les exceptions éventuelles. Ne pas prétendre qu'une mesure géométrique vaut validation esthétique.
8. Publier journal, captures, résultats CI, empreintes et liens directs PR/preview. L'essai sur **Safari iPad physique** et la validation artistique restent à la charge de l'utilisateur.

## 5. Critères de réception

- E06 : au moins deux directions capillaires réellement reconnaissables ; pas d'exigence arbitraire de quatre formes.
- E09 : 71-G distinguable de 49-G sans régression du regroupement 49-G/62-D.
- Q03 : 19-D et 21-D distinguables à la taille de catalogue, sans défaut de recouvrement.
- V02 : 56-D et 61-D distincts sans accessoires, continuité des chignons.
- V09 : trois masses/pointes lisibles, pas seulement une variation de hauteur.
- Les autres coiffures et les lots 1/2 restent intacts ; les références et sélections historiques sont préservées.
- Preview publiée, testée et utilisable sur iPad, puis revue artistique humaine.

**Arrêt obligatoire si une dépendance impose de modifier un choix hors périmètre ou une donnée historique.** Documenter le problème et demander arbitrage avant d'étendre la mission.

**Statut : préparation seulement. Aucune programmation ni fusion autorisée par ce document.**
