# Microcosme — J4 : décisions sur les réserves R1–R3 (v1.0)

Date : 2026-11-14
Statut : **J4-D1, J4-D2, J4-D3 VALIDÉES explicitement par le porteur du projet**.
Portée : arbitrages conceptuels de J4, sur la branche documentaire uniquement. **Aucune autorisation de programmer, fusionner, choisir des algorithmes ou modifier les lois C1–C4.**

## Décisions validées

### J4-D1 — Responsabilités de mémoire — VALIDÉ
- M3 Comprendre consulte les acquis et les interprète ; il peut formuler des hypothèses provisoires.
- M6 Apprendre applique la consolidation, la révision et l'oubli selon les règles C2/C3.
- C2, C3 et C4 conservent leurs représentations, contraintes et règles spécifiques.
- L'organisation conceptuelle des acquis communs **n'impose pas** un stockage technique unique ni une mémoire concurrente.
- Une hypothèse momentanée n'est pas automatiquement consolidée ; croyance et vérité restent distinctes.

### J4-D2 — Temporalité causale — VALIDÉ
- Temps de simulation commun ; déclenchements différenciés des moteurs, sans séquence rigide obligatoire.
- Les dépendances causales doivent être respectées : aucune information n'agit rétroactivement sur une décision passée, aucun apprentissage d'un résultat inaccessible.
- Le monde arbitre de manière cohérente les actions simultanées et les ressources finies.
- La reproductibilité des scénarios de test est exigée ; la politique précise de planification, d'arbitrage et de sauvegarde/reprise reste à spécifier.

### J4-D3 — Traçabilité causale — VALIDÉ
- Conserver les événements déterminants et leurs liens causaux, sans exiger un journal exhaustif de toutes les opérations internes.
- Les traces doivent permettre, selon pertinence, d'identifier acteur, moment, déclencheur, informations réellement accessibles, facteurs déterminants, tentative, résultat et conséquences.
- Ne pas confondre les souvenirs et oublis de l'habitant avec les données de l'inspection divine.
- Ne pas inventer d'explication rétrospective ; ne pas attribuer une délibération consciente à une action habituelle.
- Durée de conservation, granularité, coûts et interfaces C9 restent à spécifier et à auditer.

## Tests conceptuels à formaliser (non exécutés)
- R1 : croyance erronée, observation contradictoire, apprentissage transmis imparfaitement, souvenirs incompatibles.
- R2 : compétition sur dernière ration, sommeil pendant événement, information tardive, sauvegarde pendant projet, effets simultanés.
- R3 : mensonge, action habituelle, causes multiples, sauvegarde/reprise, oubli individuel distinct des traces divines.

## Limites et dépendances conservées
- Les six moteurs J3-D1…J3-D6 sont déjà validés, sans préjuger du découpage logiciel.
- C1–C4 restent conceptuellement clos ; C5/C6/C9 ouverts.
- C4 : D1 composition matérielle des actions, D2 objectifs vers autrui, L1 explication causale, L2 mémoire sélective, G1-R et autres réserves maintenues.
- Les textes intégraux historiques C1–C4 ne sont pas tous archivés : aucune certification de compatibilité exhaustive.
- **Non validés** : schémas de données, paramètres, ordonnanceur, choix de stockage, rétention des traces, interfaces, prototypes, faisabilité mesurée, programmation Codex et fusion.

## Prochaine étape suggérée (non autorisée par cette validation)
Rédiger les contrats techniques détaillés des six moteurs, avec entrées/sorties, carburants, interfaces C1–C4/C5/C6/C9, persistance, cas limites, tests déterministes et inspection divine ; puis audit de faisabilité du code réel avant implémentation.

## Provenance
Validation explicite par message du porteur du projet : « J4-D1 Responsabilités de mémoire : VALIDÉ ; J4-D2 Temporalité causale : VALIDÉ ; J4-D3 Traçabilité causale : VALIDÉ ». Référence : [J3_ARCHITECTURE_MOTEURS_UNIVERSELS_v1.0.md](J3_ARCHITECTURE_MOTEURS_UNIVERSELS_v1.0.md).
