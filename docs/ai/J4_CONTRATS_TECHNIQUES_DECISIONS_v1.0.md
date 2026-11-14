# Microcosme — J4 : contrats techniques, arbitrages explicites v1.0

Date : 2026-11-14
Statut : **J4-T1 à J4-T5 VALIDÉES explicitement par le porteur du projet**.
Portée : principes contractuels, pas implémentation. Les six moteurs J3 et les décisions J4-D1 à J4-D3 demeurent acquis.

## Décisions explicitement validées

| ID | Décision | Portée | Statut |
| --- | --- | --- | --- |
| J4-T1 | Contrats logiques indépendants du code | Définir les entrées, sorties et responsabilités avant de choisir les modules JavaScript | **VALIDÉ** |
| J4-T2 | Autorité explicite des données | Chaque état a un système responsable ; les autres moteurs consultent cet état ou demandent sa modification | **VALIDÉ** |
| J4-T3 | Événements causaux identifiables | Prévoir références temporelles et causales pour tentatives, résultats et apprentissages | **VALIDÉ** |
| J4-T4 | Tests déterministes | Exiger des scénarios reproductibles couvrant échecs, concurrence, sauvegarde et reprise | **VALIDÉ** |
| J4-T5 | Interfaces évolutives C5/C6/C9 | Définir les besoins fonctionnels sans figer les systèmes du monde encore ouverts | **VALIDÉ** |

## Portée technique des principes (propositions de contrats, non validées ligne par ligne)

Les six moteurs conceptuels restent : M1 Réguler, M2 Percevoir, M3 Comprendre, M4 Décider, M5 Agir, M6 Apprendre.

Pour chacun, un contrat doit expliciter : déclenchement, entrées et provenance, transformation causale, sorties, responsabilité sur l'état, persistance, inspection divine et tests. Le temps est commun et les activations différenciées ; les conséquences matérielles sont arbitrées par le monde. M3 consulte et interprète les acquis ; M6 consolide et révise selon C2/C3 ; C4 conserve ses mécanismes spécifiques.

### Matrice de responsabilités candidates

| Moteur | Entrées principales | Sorties principales | Autorité à respecter |
| --- | --- | --- | --- |
| M1 Réguler | Patrimoine, développement, ressources, dommages, temps | États physiologiques, capacités, signaux internes | C1 et échanges matériels du monde |
| M2 Percevoir | Signaux accessibles, position, canaux, sélection | Observations datées et sourcées | Pas d'accès omniscient à l'état réel |
| M3 Comprendre | Observations, acquis, croyances, modèles d'autrui | Interprétations, anticipations, hypothèses | M6/C2/C3/C4 pour consolidation |
| M4 Décider | Besoins, émotions, objectifs, options | Choix, attentes, suspensions et reprises | C2 ÉVALUER et DÉCIDER distincts ; choix ≠ résultat |
| M5 Agir | Choix, capacités, préconditions, participants | Tentatives, résultats référencés, coûts et effets | C5/C6 arbitre les modifications matérielles |
| M6 Apprendre | Expériences accessibles, répétitions, surprises | Acquis, habitudes, croyances et pratiques révisés | C2/C3/C4 et mémoire sélective |

### Scénarios candidats à formaliser, non exécutés
INT-01 faim et projet ; INT-02 croyance fausse ; INT-03 ressource disputée ; INT-04 mensonge ; INT-05 transmission imparfaite ; INT-06 sauvegarde/reprise ; INT-07 oubli et inspection ; INT-08 expérimentation. Chaque scénario devra comporter état initial, stimuli contrôlés, résultats et assertions.

## Frontières et non-validations

La validation J4-T1…T5 **ne valide pas automatiquement** :
- les schémas de données et leurs champs précis, ni les algorithmes ou paramètres numériques ;
- les cadences d'activation, la politique d'ordonnancement, les transactions ou les formats de sauvegarde ;
- la portée effective de l'invention, la composition des actions et les détails d'inspection C9 ;
- les carburants et permissions divines détaillés, ni les moteurs de vie ;
- l'architecture C5/C6/C9, la faisabilité technique, les tests exécutés, la programmation ou une fusion.

Les textes intégraux historiques C1–C4 ne sont pas tous archivés : aucune certification d'exhaustivité ne doit être revendiquée.

## Suites envisagées (non autorisées par la présente validation)
Formaliser les contrats détaillés vérifiables et la matrice d'autorité, effectuer un audit de couverture puis un audit de faisabilité du code réel avant toute autorisation de Codex.

## Provenance
Validation explicite du porteur du projet dans le chat : « J4-T1 ... VALIDÉ ; J4-T2 ... VALIDÉ ; J4-T3 ... VALIDÉ ; J4-T4 ... VALIDÉ ; J4-T5 ... VALIDÉ ». Références : [J3_ARCHITECTURE_MOTEURS_UNIVERSELS_v1.0.md](J3_ARCHITECTURE_MOTEURS_UNIVERSELS_v1.0.md) et [J4_DECISIONS_R1_R3_v1.0.md](J4_DECISIONS_R1_R3_v1.0.md).
