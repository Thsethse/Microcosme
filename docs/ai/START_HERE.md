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
