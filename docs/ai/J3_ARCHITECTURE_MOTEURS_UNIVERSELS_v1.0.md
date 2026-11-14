# Microcosme — J3 : Architecture conceptuelle des moteurs universels v1.0

Date de validation explicite : 2026-11-14.
Statut : **J3-D1 à J3-D6 VALIDÉES explicitement par le porteur du projet**.
Portée : architecture conceptuelle des moteurs universels. **Aucune autorisation de programmer, tester le moteur, modifier C1–C4, fusionner ou valider C5/C6/C9**.

## Décisions explicitement validées

| ID | Décision | Statut |
| --- | --- | --- |
| J3-D1 | Six moteurs fonctionnels : Réguler, Percevoir, Comprendre, Décider, Agir, Apprendre, comme architecture conceptuelle commune. Pas nécessairement six modules de code. | **VALIDÉ** |
| J3-D2 | Les moteurs orchestrent les lois de C1–C4 sans les remplacer, les rouvrir ni les dupliquer. | **VALIDÉ** |
| J3-D3 | Boucles non séquentielles : activation à des rythmes différents ; aucun cycle rigide obligatoire. | **VALIDÉ** |
| J3-D4 | Autorité du monde : l'habitant choisit et tente ; le monde arbitre effets réels, ressources et transformations. | **VALIDÉ** |
| J3-D5 | Trois lacunes à contractualiser sans créer de nouveau moteur : génération de possibilités, composition des actions, inspection causale. | **VALIDÉ** |
| J3-D6 | Lois des moteurs non directement modifiables par le dieu ; carburants variables, éventuellement modifiables selon des permissions **encore à définir**. | **VALIDÉ** |

## Contrat conceptuel : six moteurs

| Moteur | Responsabilité | Frontière |
| --- | --- | --- |
| M1 Réguler | États biologiques, besoins, contraintes et capacités effectives ; C1 | La biologie ne choisit pas les actions |
| M2 Percevoir | Signaux internes, observations accessibles, messages reçus, sélection perceptive | Pas d'omniscience individuelle ; attention comme fonction à préserver sans nouvel état A validé |
| M3 Comprendre | Interprétations, croyances, représentations de soi/autrui, anticipations et hypothèses | Représentation subjective ≠ vérité ; créativité ouverte non démontrée |
| M4 Décider | Évaluer, arbitrer, former, maintenir, interrompre et reprendre des intentions ; C2 | Choix ≠ exécution ni résultat |
| M5 Agir | Tentatives d'actions individuelles et sociales, soumises à C5/C6 | Seul le monde applique et conserve les effets réels |
| M6 Apprendre | Révisions des croyances, souvenirs, habitudes et pratiques ; C2/C3 | Apprendre ≠ connaître le vrai ; transmettre ≠ apprentissage automatique |

Les interactions sociales, la transmission, l'attention, les projets et la continuité historique sont des fonctions et boucles composées, **pas de nouveaux moteurs imposés**. C4 conserve ses mécanismes spécifiques.

## Boucles conceptuelles (non séquentielles)
- Vitale : M1, M2, M4, M5.
- Cognitive : M2, M3, M4, M6.
- Projet : M3, M4, M5, M6, avec objectifs persistants.
- Sociale : M2, M3, M4, M5, M6 et lois C4.
- Historique : M5, monde persistant, perception/apprentissage d'autres habitants, reproduction/hérédité C1 lorsque pertinentes.

## Acquis C1–C4 à préserver
- C1 : variation/hérédité, ressources/équilibre, usure/réparation/plasticité, perception/réponse, reproduction/sélection ; patrimoine, organisme développé, état physiologique, capacités effectives. B1 : pas de jauge générale R sans justification ; attention A différée ; la biologie limite, ne décide pas.
- C2 : **ÉVALUER–DÉCIDER–APPRENDRE**, tempérament plastique approche/évitement/régulation, émotions valence/activation, mémoire associative/autobiographique, objectifs persistants, habitudes révisables, curiosité intrinsèque, représentation de soi.
- C3 : traces pratiques consolidées et transmission imparfaite ; ne pas confondre pratiques et simple mémoire.
- C4 : représentations d'autrui, liens, confiance, réputation, communication S, entraide/coopération, groupes, normes, autorité, organisations et continuité ; préserver D1, D2, L1, L2, G1-R, N1, N2 et les autres limites validées.

## Trois lacunes contractualisées — pas résolues techniquement
1. **J3-LAC-1 Génération de possibilités inédites** : M3 doit pouvoir produire des hypothèses/compositions nouvelles, testées par M5 et révisées par M6 ; ne pas prétendre à une invention ouverte démontrée.
2. **J3-LAC-2 Composition des actions** : M5/C5/C6 doivent fournir préconditions, transactions matérielles, effets persistants et échecs explicables ; dépendance D1 de C4.
3. **J3-LAC-3 Inspection causale** : les six moteurs doivent exposer les causes effectivement utilisées, les incertitudes et les effets ; dépendance C4-L1/C9. Ces IDs J3-LAC évitent la collision avec les réserves historiques L1/L2.

## Non validé par J3
- Les paramètres numériques, algorithmes, structures de données, contrats techniques, cadence d'exécution, choix de modules et coûts de calcul.
- La liste et les règles d'édition divine des carburants ; les « moteurs de vie ».
- L'architecture C5, C6, C9, la faisabilité technique et la capacité réelle d'inventer.
- L'implémentation Codex, les tests exécutés, toute fusion ou modification du moteur.

## Prochaine étape : J4 (non engagée)
Spécifier pour chaque moteur entrées/sorties, carburants, interfaces C1–C4/C5/C6/C9, états persistants, scénarios déterministes, cas d'échec et inspection divine ; distinguer spécification prête à coder de faisabilité vérifiée. Les textes historiques intégraux C1–C4 ne sont pas tous archivés : ne pas certifier une compatibilité exhaustive sans eux.

## Provenance
Décisions J3-D1…J3-D6 validées explicitement par message utilisateur dans la conversation Microcosme, le 14 novembre 2026. J1 et J2 sont des audits préparatoires, pas des validations autonomes. Référence du catalogue candidat : [MU_CATALOGUE_UNIVERSELS_v0.1.md](MU_CATALOGUE_UNIVERSELS_v0.1.md).
