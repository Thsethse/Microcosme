# MISSION CODEX — BIO-STRUCT-T3-A-R1 — PRÉPARÉE POUR EXÉCUTION
Dépôt : https://github.com/Thsethse/Microcosme
Source de vérité : branche docs/bio-struct-t3-a-r1.
Lire obligatoirement, dans cet ordre :
1. https://github.com/Thsethse/Microcosme/blob/docs/bio-struct-t3-a-r1/docs/bio-struct-t3-a/CONTRAT.md
2. https://github.com/Thsethse/Microcosme/blob/docs/bio-struct-t3-a-r1/docs/bio-struct-t3-a/AUDIT-COMPATIBILITE-T2-VERS-T3-A.md
3. https://github.com/Thsethse/Microcosme/blob/docs/bio-struct-t3-a-r1/docs/bio-struct-t3-a/R1-CORRECTIONS-VALIDEES.md
4. https://github.com/Thsethse/Microcosme/blob/docs/bio-struct-t3-a-r1/docs/bio-struct-t3-a/MISSION-CODEX-T3-A.md
5. Code de la PR T3-A en cours et preview https://thsethse.github.io/Microcosme/preview/bio-struct-t3-a/ ; T2 PR #15 et références artistiques de la branche docs/bio-gen-t2-reference.
Vérifier les AGENTS.md, branches et PR existantes, HEAD et déploiement avant modification. Le croquis utilisateur et sa capture d'écran sont dans la conversation ; s'ils ne sont pas accessibles à Codex et indispensables à une correction fidèle, signaler leur absence et demander leur dépôt, sans inventer la référence.

## Travail autorisé
Coder UNIQUEMENT la correction expérimentale T3-A-R1 sur une branche de code dédiée (ou sur la branche T3-A existante si cohérent et sans écraser des travaux). Créer/mettre à jour une PR de code NON FUSIONNÉE.
Priorité P0 : rectifier proportions et continuité thorax/pectoraux ; raccords cou-trapèzes-clavicules-épaules ; intégrer les muscles à la silhouette et aux tons de peau, éviter bordures très contrastées. Préserver le canon anatomique et les ancrages locaux.
Priorité P1 : rétablir le choix de morphologies indépendamment de M/F/T et les sept formes de tête du contrat ; ajouter les attaches faciales canoniques, yeux légèrement sous mi-hauteur du visage, sourcils immédiatement au-dessus, bouche à mi-distance entre le bas des yeux et le bas du visage. ZÉRO NEZ (ni dessin, ni ancrage). Une visualisation faciale minimale est permise pour vérifier les ancrages ; pas de finition T3-B.
Ne pas utiliser l'illustration de l'assistant comme référence artistique. Ne pas imposer de valeurs morphologiques non validées comme définitives. Documenter les ratios proposés et les présenter pour validation.

## Tests et preview
Conserver/exécuter les 23 tests T3-A et ajouter R1-01..R1-08. Tester le rendu en face/profil/dos, les variations extrêmes, le sélecteur de morphologie et de tête, les changements M/F/T, le JSON versionné, et la non-régression T2 et jeu. Publier une preview indépendante réellement vérifiée depuis NOTRE dépôt : https://thsethse.github.io/Microcosme/preview/bio-struct-t3-a/ (ou URL de révision indépendante si nécessaire). Vérifier chargement et scripts/assets, fonctionnement tactile prévu, fournir instructions de test Safari iPad physique. Ne pas déclarer le test physique réalisé à la place de l'utilisateur. Ne pas publier une preview uniquement sur un dépôt tiers ni se contenter d'un artefact CI.

## Livraison
Fournir PR/branche/SHA, URL HTTPS vérifiée, captures avant/après (M/F/T face/profil/dos) si possible, tableau des 23 tests + 8 contrôles R1, résultats Chromium/WebKit, fichiers modifiés, écarts et points d'arbitrage visuel. Aucun merge, aucune modification des sauvegardes, aucun lancement T3-B/C.
