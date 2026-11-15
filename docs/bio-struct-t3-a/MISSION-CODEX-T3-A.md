# MISSION-CODEX-BIO-STRUCT-T3-A — PRÉPARÉE, NON LANCÉE
Dépôt : https://github.com/Thsethse/Microcosme
Références obligatoires :
- docs/bio-struct-t3-a/CONTRAT.md (branche docs/bio-struct-t3-a-contract)
- docs/bio-struct-t3-a/AUDIT-COMPATIBILITE-T2-VERS-T3-A.md (même branche)
- PR #15 BIO-GEN-T2 : https://github.com/Thsethse/Microcosme/pull/15 ; révision auditée e057e5f906afba25ac943bcc617afb581eb8d296
- deux croquis utilisateur de référence : squelette face/profil/dos et construction du visage ; vérifier qu'ils sont effectivement accessibles, ne pas les inventer.

## AUTORISATION
Ce fichier prépare une future mission ; SA PRÉSENCE N'AUTORISE PAS SON EXÉCUTION. Attendre instruction explicite de l'utilisateur pour coder. Ne fusionner AUCUNE PR sans validation utilisateur, y compris PR documentaire. Ne pas écraser T2, les autres previews, le moteur ou les sauvegardes.

## Étape 0 — Vérification préalable
Vérifier HEAD de main, de la PR #15 et de la branche documentaire ; AGENTS.md applicables ; autres PR ouvertes et règles de publication GitHub Pages. Si les sources de T2 ont changé, réauditer le delta. Vérifier présence effective des croquis et des paramètres contractuels. Si une ambiguïté bloque la conformité, demander arbitrage AVANT d'inventer une règle.

## Objectif T3-A
Implémenter un banc d'essai anatomique INDÉPENDANT : un seul corps canonique (catégorie, fonction reproductive, squelette, volumes attachés), trois vues face/profil/dos cohérentes et portrait seulement si dérivable sans élargissement du lot ; trois références M/F/T avec choix de fonction male/female pour T ; variations bornées P1, profils P2, corrections et rejets tracés P3. Les 25/30/45 unités pour quatre têtes sont la base ; conserver les proportions des croquis et les ancrages anatomiques.

## Architecture demandée
- BiologicalProfile : catégorie M/F/T et exactement une fonction reproductive compatible ; pas de sexe inféré du dessin.
- AnatomicalSkeleton : repères 3 axes internes, segments, articulations, recalcul des descendants.
- BodyGeometry : volumes carrés/rectangulaires/composés sur ancrages locaux (pectoraux, abdominaux, bras, cuisses, mollets, poitrine, bassin et attaches sexuelles stylisées) ; aucune géométrie libre flottante.
- BodyProjection : commandes inspectables pour vues cohérentes ; aucune randomisation par vue.
- Réutiliser si possible hash/palettes/raster Canvas T2 sans modifier ses fichiers originaux ; export T3 versionné et déterministe. Ne pas migrer les JSON T2 automatiquement.
- Séparer logique biologique, squelette, projection et UI ; conserver une interface d'inspection lisible.

## Exigence impérative : PREVIEW depuis NOTRE dépôt
Créer une branche de code indépendante et une PR de code ouverte, NON FUSIONNÉE. Publier une preview HTTPS accessible directement depuis https://thsethse.github.io/Microcosme/preview/bio-struct-t3-a/ (ou autre chemin explicite réellement publié sous le même dépôt si contrainte de déploiement). Ne PAS se contenter d'un fichier local, d'un lien d'artefact CI, ni d'une preview d'un dépôt tiers. Vérifier HTTP 200, chargement des scripts/assets et interaction de base. Fournir URL exacte, branche, PR, SHA, état CI, instructions simples de test sur Safari iPad physique. Si GitHub Pages ne publie pas automatiquement la branche, proposer une stratégie de publication isolée sur le dépôt et demander l'autorisation nécessaire avant tout changement sensible ; ne jamais annoncer un lien comme fonctionnel sans l'avoir vérifié.

## Banc de réception visible
- trois silhouettes M/F/T clairement étiquetées ; T : bascule fonction reproductive masculine/féminine sans transformation automatique poitrine/bassin ;
- vues face, profil et dos, même identité et dimensions ; portrait facultatif si déjà fiable ;
- afficher/masquer squelette, articulations, ancrages, volumes ;
- réglages de longueurs/largeurs/profondeurs/volumes ; rapport visible valeur demandée/appliquée/raison ;
- retour rapide aux références et paramètres, ergonomie tactile iPad ;
- comparaison visuelle simple des références sans coiffures ni vêtements pour vérifier la reconnaissance M/F.
Le caractère visuel distinct de T est un objectif à évaluer par l'utilisateur, pas une affirmation que les tests numériques suffisent à établir.

## Tests
Implémenter et exécuter T3A-01 à T3A-23 EXACTEMENT selon le contrat. Tests déterministes des segments, attaches, catégories, fonctions, limites P1, profils P2, corrections P3, projections et export/import. Tester non-régression T2 et moteur principal ; Chromium et WebKit via CI. Documenter commandes, résultats et limites ; Safari iPad physique à valider par l'utilisateur (ne pas prétendre l'avoir testé).

## Livraison
PR de code ouverte non fusionnée ; README de laboratoire ; lien preview HTTPS vérifié ; matrice des 23 tests (réussi/échoué/non testé) ; rapport CI ; liste des fichiers modifiés ; liste des écarts au contrat ; captures ou références de comparaison si possibles. Aucune fusion, aucune modification silencieuse des contrats, aucun lancement de T3-B/C ni du générateur biologique complet. Arrêt si croquis indisponibles ou règle bloquante, avec demande d'arbitrage ciblée.
