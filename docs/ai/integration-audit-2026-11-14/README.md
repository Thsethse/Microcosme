# Audit d’intégration — Microcosme
Date : 14 novembre 2026. Statut : **proposition pour revue, aucune architecture validée, aucune autorisation de programmer**.

## Lecture
1. [Audit factuel](01_AUDIT.md) — code, preuves, exécutions et limites.
2. [Comparaison contradictoire](02_ARCHITECTURES.md) — trois paradigmes, cinq situations.
3. [Contrat technique candidat](03_CONTRAT.md) — noyau, interactions, interfaces et invariants.
4. [Validation, dépendances et trajectoire](04_VALIDATION.md).
5. [Transmission et prompt Codex](05_CODEX.md) — à utiliser seulement après autorisation distincte.

## Conclusion proposée
Conserver les acquis de perception subjective et de stabilité des intentions, mais ajouter une couche matérielle autoritaire qui vérifie et applique chaque interaction. Recommander un hybride : interactions fondamentales bornées + pratiques composées et progressivement consolidées. La composition ne produit pas automatiquement l’invention.

Le premier incrément proposé est un laboratoire isolé de ressources alimentaires finies : deux habitants, déplacement, prélèvement, ingestion, repos, concurrence et sauvegarde. Construction et mémoire pratique avancée viennent ensuite. Aucune nouvelle simulation n’a été implémentée durant cette mission.

## Références figées
- Moteur : main, `3c15d88d1b5b2f3f0ce4d9a58207ef9b989bc479`.
- Mémoire : docs/llm-project-memory, `364c8ec0e62f54ae9ecdb16e791bfebea2ee94f5`.
- Branche documentaire proposée issue de cette mémoire ; PR vers docs/llm-project-memory pour isoler la revue de l’audit. Aucune fusion dans main.
- Les fichiers de production de la branche mémoire ont les mêmes blobs que main ; les ajouts de mémoire sont documentaires.
- Les six documents sources se trouvent dans [docs/ai](../). Leur registre est une synthèse, pas une archive intégrale.

## Autorité préservée
C1–C4 sont clos **conceptuellement** ; B1 reste une formalisation détaillée ouverte. C5 reste ouvert. DIR-1 à DIR-6 restent validées : cible insulaire provisoire ; G+ et réserves préservés sans grille imposée ; choix C5 suspendus pendant audit ; preuve avant classement ; priorité autonomie/matière/composition ; reprise par noyau borné. Ce dossier propose, il ne tranche pas ces choix.

## À valider explicitement
- P-A : architecture hybride et frontière entre décision subjective / exécution autoritaire.
- P-B : laboratoire isolé, taille et interactions bornées ; grille 12×9 comme support expérimental uniquement.
- P-C : transactions unitaires, arbitrage tournant, matière conservée dans des registres explicites et projets persistants.
- P-D : première tranche alimentaire, adaptateurs biologiques provisoires et exclusions détaillées.
- P-E : ordre des incréments et critères d’arrêt ; aucun passage automatique à la programmation.
La validation documentaire ne vaut ni validation exhaustive C5 ni permission de lancer Codex.

## Réaudit des deux blocages I1 — contrat v0.2
Le [contrat](03_CONTRAT.md) précise l’énergie requise pour TRANSFER et le retrait atomique des lots épuisés. [T22 et T23](04_VALIDATION.md) ajoutent énergie0/1, vingt cycles sans saturation artificielle, sauvegarde/reprise et mémoire d’un lot disparu ; T10 conserve la saturation réelle (T10-a couvre le transfert total).
**Prêt pour soumission à Codex**, au sens documentaire seulement : les blocages signalés sont levés dans le contrat, pas prouvés par une implémentation. Aucun test candidat exécuté ; aucun lancement de Codex ni fusion. Le [prompt final dormant](05_CODEX.md) exige toujours l’autorisation explicite de programmer I1 et n’autorise pas I2.
