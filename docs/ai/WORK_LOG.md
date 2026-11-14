# Journal de travail IA — append-only logique

## 2026-11-14 — Mise en place de la mémoire
- But : rendre la reprise par les futurs chats autonome, sans obliger le porteur du projet à relire les analyses.
- Action : création sur branche docs/llm-project-memory d'un point d'entrée, d'un état, d'un registre de décisions et de ce journal.
- Source : conversation de conception B1 et inspection en lecture de la racine du dépôt et du README.
- Aucun fichier moteur modifié. Aucun test de simulation exécuté.
- Limite : la documentation historique complète des chantiers C1-C4 et le snapshot de migration B1 n'ont pas été importés ; le présent registre est une synthèse partielle, non une archive exhaustive.
- Prochaine action : faire relire la proposition documentaire, puis poursuivre l'audit B1.14 et alimenter le catalogue C5.

## B1.14 — État de départ
- Objectif : modèle matériel minimal expliquant croissance, amaigrissement, mobilisation énergétique, réparation et dépérissement.
- Contradictions initiales : énergie sans matière ; réserves épuisées et survie ; croissance sans matériaux ; réparation/croissance concurrentes ; masse identique et constitutions différentes ; cycles artificiels de gain d'énergie.
- Test conceptuel recommandé : organisme vivant après épuisement des réserves, en tentant de réfuter M2.
- Aucune simulation exécutée ; aucun modèle validé.

## 2026-11-14 — Consolidation des huit snapshots de passation
- Autorisation utilisateur : « Prochaine étape validée », après proposition de consolider la mémoire GitHub.
- Création de SNAPSHOT_TRANSMISSION_2026-11-13.md : index fidèle aux statuts et décisions des huit snapshots reçus, **pas archive intégrale**.
- Mise à jour des points d'entrée, état directeur et décisions ; aucun code moteur modifié.
- État directeur : C1–C4 clos conceptuellement ; C5 ouvert ; DIR-1–DIR-6 validées ; audit phase 1 à engager après vérification du dépôt.
- À faire : import verbatim des originaux via une source fiable, puis audit technique en lecture seule. Ne pas prétendre que les textes complets sont déjà archivés.

## 2026-11-14 — Mission Work : audit d’intégration et proposition d’architecture
- Mandat explicite : lire mémoire et main, comparer trois paradigmes sur cinq situations, proposer noyau/contrat/tests, documenter en PR sans modifier moteur ni lancer Codex.
- Références : mémoire 364c8ec0e62f54ae9ecdb16e791bfebea2ee94f5 ; main 3c15d88d1b5b2f3f0ce4d9a58207ef9b989bc479.
- Lecture : modules moteur/cognition/stockage/interface/rendu et tests. Exécution sur copie vérifiée des blobs : 35/35 tests Node v24.22.1 ; sondes déplétion absente, arbre traversable, plafond normalisation. Préparation initiale incomplète corrigée par récupération du fichier source manquant, sans correctif au moteur.
- Navigateur/Safari physique et performances : non exécutés/non mesurées. Aucun F1–F4 attribué.
- Livrables : [dossier d’intégration](integration-audit-2026-11-14/README.md), audit factuel, comparaison, contrat, dépendances/tests, prompt dormant Codex I1.
- Recommandation NON VALIDÉE : interactions transactionnelles + pratiques ; premier laboratoire alimentaire isolé. Textes conceptuels complets encore manquants, pas de certification exhaustive C1–C4.
- Prochaine étape : revue des propositions P-A à P-E par François ; une revue documentaire ne vaut pas autorisation de programmer.

## 2026-11-14 — Corrections bloquantes I1 et réaudit documentaire PR6
- Autorisation explicite de François : corriger énergie TRANSFER et cycle de vie des lots, mettre à jour la PR6, réauditer ; aucune programmation, aucun lancement de Codex et aucune fusion.
- Tête contrôlée : 7bc1edbaa50abe2ef7d8ecfaac189f4681e41fad, identique à la dernière révision auditée ; base docs/llm-project-memory, tête docs/integration-architecture-audit-2026-11-14 ; aucun AGENTS.md dans l’arborescence complète inspectée.
- Contrat v0.2 : energy≥1 sinon NO_CAPACITY sans effet d’action, faim indépendante ; seuls lots positifs comptés, retrait atomique à épuisement, transfert total sans création, split contrôlé, nextId persistant non réutilisé.
- Séparation lot/lieu observé/souvenir vide ; références épistémiques périmées admises, révision locale seulement ; observation, plan et événements bornés, aucun historique de lots supprimés.
- Tests candidats : T10 renforcé + T10-a ; T22-a/b énergie0/1 ; T23-a à e cycles, reprise, ancien ID et bornes. Identifiants antérieurs conservés. Prompt Codex et points d’entrée alignés.
- Vérification : relecture croisée des contrats, invariants, erreurs, oracles et prompt ; contrôle documentaire des IDs, liens et du diff Markdown. Raisonnement manuel sur vingt cycles, pas exécution du laboratoire. Aucun test moteur/navigateur relancé ; les 35/35 du précédent audit restent un résultat historique.
- Verdict : prêt pour soumission à Codex, sans autorisation implicite de programmation. Aucun blocage documentaire restant identifié pour I1 isolé ; textes conceptuels incomplets et performances/Safari non démontrés demeurent réservés.
- C1–C4 clos conceptuellement, C5 ouvert, paramètres biologiques expérimentaux, aucun F1–F4. Prochaine action : autorisation explicite de programmer I1, si souhaitée, avant activation du prompt.
