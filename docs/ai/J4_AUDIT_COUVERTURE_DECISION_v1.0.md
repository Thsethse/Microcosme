# Microcosme — J4 : audit de couverture, décision v1.0

Date : 2026-11-14
Statut : **J4-COUV-D1 VALIDÉ explicitement par le porteur du projet**.
Portée : orientation documentaire de complétude des contrats ; aucune programmation, aucun changement du moteur, aucune fusion.

## Décision explicitement validée

**J4-COUV-D1 — Compléter les contrats sans élargir l'architecture — VALIDÉ.**

Intégrer les sept exigences de couverture **COUV-01 à COUV-07** aux futurs contrats techniques, conserver les six moteurs J3 et les lois conceptuellement closes C1–C4, et ajouter les cinq tests de couverture **COUV-T1 à COUV-T5**.

### Exigences à intégrer (obligations de couverture, détails techniques non validés)

| ID | Point à couvrir | Frontière |
| --- | --- | --- |
| COUV-01 | Biologie complète : reproduction, hérédité, vieillissement, développement, maladies et blessures fonctionnelles | C1 garde ses cinq lois et quatre couches ; ne pas inventer de jauge R ou A |
| COUV-02 | Attention sélective : sélection, ignorance et concurrence des stimuli | Aucune jauge physiologique A nouvellement validée |
| COUV-03 | ÉVALUER et DÉCIDER distinguables au sein de M4 | Aucun nouveau moteur ou module imposé |
| COUV-04 | Actions sociales dirigées : demandes, refus, communication sélective S, coordination | Préserver C4 et dépendance D2 |
| COUV-05 | Transmission imparfaite et continuité : émission, réception, interprétation, consolidation, traces persistantes | Pas de transfert automatique des connaissances ; C3/C4 préservés |
| COUV-06 | Cycle de vie des actions, arbitrage concurrent, interruption et sauvegarde/reprise | Pas de double effet matériel ; ordonnanceur non choisi |
| COUV-07 | Inspection causale et carburants divins : droits, sources, causes, séparation mémoire individuelle/inspection | Permissions et architecture C9 non décidées |

### Tests supplémentaires à formaliser (non exécutés)

| ID | Scénario | Propriété attendue |
| --- | --- | --- |
| COUV-T1 | Naissance et développement | C1/M1 sans décision psychologique |
| COUV-T2 | Stimuli concurrents | Un signal accessible peut ne pas être traité |
| COUV-T3 | Demande refusée | Solliciter autrui ne commande pas sa décision |
| COUV-T4 | Transmission déformée | Une pratique peut changer entre individus |
| COUV-T5 | Projet interrompu et sauvegardé | Reprise ou échec sans duplication d'effets |

Ces tests complètent INT-01 à INT-08 déjà proposés ; leurs assertions, fixtures et implémentations restent à spécifier.

## Constat de l'audit (ne constitue pas une validation technique)
La couverture fonctionnelle des six moteurs paraît cohérente avec les synthèses C1–C4 consultées, mais elle est incomplète sur les sept points ci-dessus. Les trois lacunes J3 (possibilités inédites, composition des actions, inspection causale) restent à contractualiser et démontrer. Les textes originaux complets C1–C4 ne sont pas tous archivés : **aucune certification exhaustive**.

## Ce que cette décision ne valide pas
- Schémas, algorithmes, cadences, ordonnanceur, formats de sauvegarde, coûts ou paramètres numériques ;
- Architecture C5/C6/C9 et permissions divines détaillées ;
- Tests exécutés, faisabilité du moteur réel, capacités de créativité ouverte ;
- Programmation Codex, modifications du moteur, fusion ou clôture technique globale J4.

## Provenance
Validation explicite du porteur du projet dans le chat : « Arbitrage Microcosme J4-COUV-D1 : VALIDÉ. Enregistre uniquement la validation explicite sur la branche documentaire. Ne programme rien et ne fusionne rien. »

Références : [J3_ARCHITECTURE_MOTEURS_UNIVERSELS_v1.0.md](J3_ARCHITECTURE_MOTEURS_UNIVERSELS_v1.0.md), [J4_DECISIONS_R1_R3_v1.0.md](J4_DECISIONS_R1_R3_v1.0.md), [J4_CONTRATS_TECHNIQUES_DECISIONS_v1.0.md](J4_CONTRATS_TECHNIQUES_DECISIONS_v1.0.md).
