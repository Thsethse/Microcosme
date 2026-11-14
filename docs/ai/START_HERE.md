# Microcosme — Guide de reprise pour agents IA

Statut : documentation de continuité, créée le 14 novembre 2026. Ne vaut pas validation des architectures.

## Ordre de lecture
1. Lire PROJECT_STATE.md pour les autorités et statuts.
2. Lire DECISION_REGISTER.md pour les décisions et leurs sources.
3. Lire WORK_LOG.md pour le dernier état et la prochaine action.
4. Lire les spécifications du chantier concerné et le catalogue C5 lorsqu'ils existent.
5. Vérifier le code et les tests du dépôt avant toute affirmation de faisabilité.

## Règles
- Ne jamais transformer une hypothèse en décision validée.
- Les décisions conceptuelles du porteur de projet prévalent ; aucune modification silencieuse d'un autre chantier.
- Séparer état conceptuel cible et moteur actuellement présent sur main.
- Travailler de façon concise avec l'utilisateur : résultat, décision proposée, réserves, validation nécessaire.
- Conserver les raisons vérifiables, alternatives rejetées, dépendances, résultats de tests réellement exécutés, références et prochaine étape. Ne pas prétendre archiver le raisonnement interne intégral.
- Les modifications documentaires ne valent pas autorisation de modifier le moteur.
- Travail sur branche dédiée, avec revue avant intégration dans main.
- Toute étape B1 future vise un dossier prêt à coder : règles, données, algorithmes, interfaces, tests, inspection divine ; faisabilité réelle à vérifier.

## Transmission du directeur (13 novembre 2026)
Lire également [SNAPSHOT_TRANSMISSION_2026-11-13.md](SNAPSHOT_TRANSMISSION_2026-11-13.md) : index de huit snapshots, non verbatim. Le dernier DIRECTEUR-SNAPSHOT v1.0 établit C1–C4 clos, C5 ouvert et DIR-1–DIR-6 validées. Aucun F1–F4 sans audit réel.

## Audit d’intégration — 14 novembre 2026
Lire [le dossier d’audit et de proposition](integration-audit-2026-11-14/README.md). Code main inspecté au SHA 3c15d88 ; 35 tests Node passés. Architecture hybride, contrat et prompt I1 **candidats non validés**. Aucun moteur modifié ni Codex lancé ; C5 reste ouvert.
