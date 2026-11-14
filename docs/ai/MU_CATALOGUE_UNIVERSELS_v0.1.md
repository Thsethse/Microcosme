# Microcosme — Catalogue des moteurs universels de l'habitant (MU-CATALOGUE v0.1)
Date : 2026-11-14
Statut : **proposition exhaustive au niveau fonctionnel, NON VALIDÉE moteur par moteur**. Document de conception uniquement, sans autorisation de programmation, de fusion ni de modification de C1–C4.

## Autorité et périmètre
Vision P1–P5 **explicitement validée** : autonomie des habitants ; émergence par peu de mécanismes ; transformation persistante du monde ; interventions divines coûteuses et réactions ; continuité historique et matérialisation finale du dieu.
C1 (biologie), C2 (psychologie), C3 (traces pratiques/transmission) et C4 (relations et société) sont **conceptuellement clos et préservés**. C5 (monde) est ouvert ; C6 (composition des actions) et C9 (inspection causale) sont des dépendances. Les originaux complets C1–C4 ne sont pas tous présents dans ce dépôt : ce catalogue **n'est pas une certification de couverture exhaustive des textes historiques**. Toute contradiction devra être démontrée avant réouverture.

**Définition** : un moteur universel est un processus commun à tous les habitants, même lorsque son activité est nulle faute d'entrées. Il ne désigne ni un organe, ni une statistique, ni un « métier », ni nécessairement un module logiciel séparé. Les « moteurs de vie » (curiosité, persévérance, imagination créatrice, attachement, identité vécue, spiritualité) sont des compositions ou spécialisations à étudier ultérieurement. Le dieu peut agir sur les carburants autorisés, **pas réécrire les lois**.

## Architecture des boucles
- **Boucle de présence** : état corporel + perceptions + signaux internes → représentation subjective.
- **Boucle de conduite C2 préservée** : **ÉVALUER → DÉCIDER → APPRENDRE**, avec intentions et objectifs persistants.
- **Boucle d'exécution** : intention → action admissible dans C5/C6 → effets réels et traces → retour perceptif.
- **Boucle sociale** : autrui perçu/interprété → communication, coopération ou conflit → révision des représentations et liens C4.
- **Boucle historique** : consolidation, transmission et traces matérielles → conditions différentes pour les générations suivantes.
Ces boucles se chevauchent, ne constituent pas une séquence unique imposée et ne nécessitent pas une exécution identique à chaque tick.

## Catalogue fonctionnel — 12 candidats à auditer
Les identifiants MU-01…MU-12 sont nouveaux ; **aucun n'est validé comme découpage logiciel**. Les dépendances C5/C6 sont des exigences candidates, non des choix d'architecture.

### MU-01 — Réguler l'état vivant
- **Loi** : le corps évolue selon son patrimoine, son état, ses échanges et le temps ; ses capacités limitent les actions sans les choisir.
- **Entrées/carburants** : besoins, réserves, blessures, fatigue, âge, apports.
- **Sorties** : signaux internes, capacités effectives, dégradation/récupération.
- **Héritage** : C1 ; B1 effort/récupération, sans créer une jauge globale interdite.
- **Monde minimal** : temps, ressources et échanges traçables, conditions d'accès.
- **Inspection** : état, contrainte actuelle, causes et changements.
- **Test discriminant** : affamé mais motivé, un habitant peut vouloir agir tout en étant physiquement empêché.

### MU-02 — Percevoir et recevoir
- **Loi** : seules des informations accessibles par des canaux définis peuvent atteindre l'habitant ; perception ≠ vérité complète.
- **Entrées** : signaux du monde, signaux internes, messages accessibles, capacités sensorielles.
- **Sorties** : observations locales datées, incertitude et provenance.
- **Héritage** : C1 perception/réponse, C2 subjectivité, C4 communication S.
- **Monde minimal** : événements observables, distances/obstacles/canaux, agents et objets localisables.
- **Inspection** : « a vu/entendu/appris par X », non « sait magiquement ».
- **Test** : disparition d'un stock hors de vue ne met pas à jour sa croyance à distance.

### MU-03 — Orienter l'attention
- **Loi** : les ressources d'attention sont sélectives ; plusieurs stimuli concurrencent les priorités.
- **Entrées** : saillance, besoin, émotion, intention, nouveauté, capacité.
- **Sorties** : informations traitées en priorité, informations ignorées.
- **Héritage** : C2 évaluation/émotions ; attention A de B1 différée, **aucune nouvelle variable A validée**.
- **Monde minimal** : événements différenciables dans le temps.
- **Inspection** : ce qui retient l'attention et pourquoi.
- **Test** : une tâche urgente peut faire ignorer une curiosité secondaire.

### MU-04 — Interpréter et représenter
- **Loi** : l'habitant forme des représentations imparfaites du monde, d'autrui et de soi à partir de perceptions et d'acquis.
- **Entrées** : observations, connaissances, croyances, souvenirs, catégories.
- **Sorties** : hypothèses, attentes, degré d'incertitude, modèles de soi/d'autrui.
- **Héritage** : C2 représentations et mémoire, C4.1 représentations d'autrui ; ne pas dupliquer les structures.
- **Monde minimal** : propriétés et identités observables, effets cohérents.
- **Inspection** : distinguer état réel, croyance et source.
- **Test** : deux habitants observent le même fait et l'interprètent différemment.

### MU-05 — Évaluer et éprouver
- **Loi** : les situations prennent une valeur subjective selon les besoins, émotions, tempérament, attentes et objectifs.
- **Entrées** : état vivant, représentations, tempérament approche/évitement/régulation, liens.
- **Sorties** : valence/activation, urgence, opportunités et risques évalués.
- **Héritage** : C2 **ÉVALUER** ; émotions valence/activation.
- **Monde minimal** : conséquences différenciées des actions.
- **Inspection** : facteurs majeurs d'une évaluation.
- **Test** : un danger identique suscite des priorités différentes.

### MU-06 — Former et maintenir des intentions
- **Loi** : des buts peuvent persister, être suspendus, concurrencés, révisés ou abandonnés.
- **Entrées** : besoins, intérêts, objectifs, possibilités perçues, historique d'échec.
- **Sorties** : intentions durables, priorités, conditions de reprise/abandon.
- **Héritage** : C2 objectifs persistants ; dépendance C4 D2 (objectifs vers autrui).
- **Monde minimal** : tâches et changements observables, ressources et obstacles persistants.
- **Inspection** : « veut X depuis Y, interrompu par Z ».
- **Test** : interruption par faim, puis reprise d'un ouvrage sans ordre externe.

### MU-07 — Anticiper et composer des possibilités
- **Loi candidate** : l'habitant peut estimer des conséquences et combiner des éléments connus avant d'agir, avec erreurs possibles.
- **Entrées** : représentations, mémoire associative, pratiques, buts, capacités.
- **Sorties** : options, prédictions et hypothèses à éprouver.
- **Héritage** : C2 évaluer/décider/apprendre, C3 traces pratiques ; **portée créative non validée**.
- **Monde minimal** : propriétés composables, interactions testables, retours d'échec.
- **Inspection** : hypothèse envisagée et connaissances mobilisées.
- **Test** : une nouvelle combinaison plausible peut être proposée sans recette préécrite ; la réussite n'est pas garantie.
- **Réserve** : ne pas confondre association de connaissances et invention fonctionnelle.

### MU-08 — Décider et arbitrer
- **Loi** : un habitant sélectionne ses propres actions selon évaluations, intentions, habitudes, informations et contraintes ; le dieu ne commande pas directement ce choix.
- **Entrées** : options, motivations, coûts anticipés, capacités et incertitude.
- **Sorties** : choix, renoncement, attente ou changement de but.
- **Héritage** : C2 **DÉCIDER**, C1 limite les actions sans les sélectionner.
- **Monde minimal** : ensemble d'actions disponibles et préconditions consultables.
- **Inspection** : facteurs décisifs et alternatives pertinentes, sans justification inventée.
- **Test** : illumination divine peut influencer, pas forcer une décision.

### MU-09 — Exécuter et subir les conséquences
- **Loi** : l'intention n'est pas un résultat ; le monde arbitre la faisabilité, les coûts, les collisions et les effets.
- **Entrées** : action choisie, capacités, position, matériaux et participants.
- **Sorties** : réussite/échec/effets partiels, modifications persistantes, traces.
- **Héritage** : C1 capacités, C5 monde, C6 D1 composition matérielle des actions.
- **Monde minimal** : transactions autoritaires, objets/ressources/lieux persistants, temps et interactions.
- **Inspection** : intention → tentative → résultat → cause.
- **Test** : deux habitants veulent la même ressource finie ; le monde n'en crée pas deux.

### MU-10 — Apprendre et consolider
- **Loi** : les résultats révisent associations, attentes, habitudes et pratiques ; mémoire et oubli sont sélectifs.
- **Entrées** : observations, erreurs de prédiction, émotions, répétition, conséquences.
- **Sorties** : souvenirs, connaissances, habitudes, compétences ou révisions.
- **Héritage** : C2 **APPRENDRE**, mémoire associative/autobiographique, C3 traces pratiques, C4 L2.
- **Monde minimal** : résultats observables, persistance et répétition possibles.
- **Inspection** : avant/après, source et fiabilité de l'acquis.
- **Test** : un échec répété change la conduite sans supprimer arbitrairement tout souvenir.

### MU-11 — Interagir et se coordonner
- **Loi** : les interactions avec autrui sont des actions subjectivement motivées, communiquées de façon imparfaite, pouvant modifier les liens et la coordination.
- **Entrées** : représentations d'autrui, confiance, liens, messages, buts, normes.
- **Sorties** : échanges, coopération, conflits, réputation, coordination.
- **Héritage** : C4.1–C4.7 ; S sélection intentionnelle des contenus, T transformation différée ; réserves D1/D2/G1-R/N1/N2/L1/L2.
- **Monde minimal** : autres agents, canaux de communication, actions partagées, biens et traces sociales.
- **Inspection** : qui a demandé quoi, à qui, et ce qui a été compris.
- **Test** : demande non reçue, mal interprétée ou refusée ; pas de synchronisation omnisciente.

### MU-12 — Transmettre et laisser des traces
- **Loi** : l'existence d'un individu peut modifier les conditions de vie d'autres individus et générations, sans garantie de transmission fidèle.
- **Entrées** : pratiques, souvenirs partageables, objets, constructions, relations, descendants.
- **Sorties** : enseignements, imitation, héritages matériels et sociaux, pertes et transformations.
- **Héritage** : C1 reproduction/hérédité, C3 transmission imparfaite, C4 continuité ; P5.
- **Monde minimal** : temps long, persistance des objets/constructions/traces, naissance/mort/succession possibles.
- **Inspection** : origine d'un savoir, d'un objet ou d'une pratique et ses transformations.
- **Test** : disparition d'une communauté laissant des traces réinterprétables par une autre.

## Frontières : ce qui n'est PAS un moteur universel supplémentaire
- **Curiosité, persévérance, exploration, vocation, attachement, ambition, foi, spiritualité, créativité** : moteurs de vie candidats à construire à partir des MU et de carburants spécifiques ; ne pas leur attribuer automatiquement un module séparé.
- **Conscience / inconscient** : modes d'accès et de traitement à étudier sur MU-03/04/07/10, sans prétendre simuler une conscience phénoménale ; pas de nouveau moteur validé.
- **Identité** : représentation de soi alimentée par MU-04 et MU-10, plus trajectoire de vie ; approfondissement à concevoir.
- **Statistiques** : dispositions et états utilisés par les moteurs, pas les moteurs eux-mêmes.
- **Foi/puissance divine, opposition du monde, matérialisation du dieu** : systèmes transversaux du jeu à concevoir, pas des lois internes universelles de l'habitant.
- **Inventions** : conséquences possibles de MU-07/09/10/11/12 avec propriétés du monde ; ne pas prévalider un arbre technologique.

## Matrice de dépendances minimales
| Moteurs | Exigences communes du monde | Dépendances critiques |
|---|---|---|
| MU-01/02/03 | temps, signaux locaux, ressources et contraintes | C1, C5 |
| MU-04/05/06 | identité stable, faits observables, effets et persistance | C2, C5 |
| MU-07/08/09 | propriétés matérielles, préconditions, actions composables, transactions | C2, C5, **C6 D1** |
| MU-10/11 | retours causaux, mémoire bornée, communication et autres agents | C2, C3, C4 |
| MU-12 | traces persistantes, générations, transmission imparfaite | C1, C3, C4, C5 |
**C9 L1** : tous les moteurs doivent exposer des causes fidèles à l'inspection divine ; une narration a posteriori non traçable ne suffit pas.

## Contrat commun exigé avant Codex (à remplir pour chaque MU)
1. Loi causale et frontière avec les autres moteurs ; rattachement aux décisions historiques.
2. Carburants : dispositions, états, acquis, opportunités ; type, provenance, durée, bornes et modification divine permise/interdite.
3. Entrées, sorties, événements et conditions de déclenchement ; coût de calcul ; ordre de résolution.
4. Interfaces C1/C2/C3/C4/C5/C6/C9 ; données persistantes et règles de migration.
5. Scénarios : nominal, conflit, information fausse, manque de ressources, interruption, sauvegarde/reprise, temps long.
6. Tests déterministes et tests d'émergence ; critères de réussite/échec ; anti-régression.
7. Inspection divine minimale : état actuel, déclencheur, cause, conséquence, incertitude.
8. Statut : proposition → audit contradictoire → validation explicite → spécification prête à coder → faisabilité vérifiée → autorisation Codex distincte.
Un moteur « tournant à vide » doit disposer d'un **harnais de données simulées reproductibles**, pas d'une implémentation impossible à tester.

## Audit de complétude à mener AVANT de figer le catalogue
- **Cohérence** : vérifier MU-01…12 contre les textes intégraux C1–C4 (manquants ici) ; noter couvert / doublon / contradiction / lacune.
- **Minimalité** : chercher si MU-03, MU-07, MU-11 et MU-12 sont des compositions des autres moteurs plutôt que des moteurs indépendants.
- **Scénarios contradictoires** : survie sans projet ; curiosité malgré peur ; projet interrompu/repris ; connaissance fausse ; invention non scriptée ; coopération refusée ; dieu ignoré ; génération héritant de ruines.
- **Faisabilité** : ne pas attribuer F1–F4 ni promettre créativité ouverte avant prototypes mesurés.
- **Arrêt** : aucune nouvelle loi sans scénario impossible à expliquer avec le catalogue existant.

## Plan de travail documentaire proposé
**Phase A** : récupérer les sources complètes C1–C4 et dresser la matrice d'héritage, sans les rouvrir.  
**Phase B** : audit contradictoire des 12 candidats, regroupements et lacunes ; validation explicite du catalogue révisé.  
**Phase C** : fiches contractuelles moteur par moteur, exigences cumulatives C5/C6, carburants et feedback personnage.  
**Phase D** : prototypes isolés avec données de test, après autorisation spécifique ; revue GitHub et tests iPad, sans fusion automatique.  
**Phase E** : catalogue distinct des moteurs de vie, uniquement après stabilisation des universels.

## Décision attendue
Le porteur du projet doit arbitrer le nombre et les frontières des moteurs, en particulier MU-03/07/11/12, **avant** toute validation du catalogue comme architecture. La validation P1–P5 ne vaut pas validation des 12 candidats. Aucun code, aucune fusion, aucune exécution de test demandés par ce document.
