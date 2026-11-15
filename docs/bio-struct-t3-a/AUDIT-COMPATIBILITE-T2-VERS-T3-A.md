# AUDIT-COMPATIBILITE-T2-VERS-T3-A — 2026-11-15
Statut : audit statique documentaire et code, favorable sous conditions ; aucun test T3-A exécuté.
Sources inspectées : PR #15 (ouverte, non fusionnée), head e057e5f906afba25ac943bcc617afb581eb8d296 ; experiments/bio-gen-t2/model.js, geometry.js, render.js ; docs/bio-gen-t2/ARCHITECTURE.md ; contrat docs/bio-struct-t3-a/CONTRAT.md. T2 est sur branche codex/bio-gen-t2, pas nécessairement sur main. Revalider HEAD avant travail.

## Matrice de compatibilité
| Élément T2 | Observation code | Décision T3-A |
|---|---|---|
| model.js hash/generate | Tirage déterministe par graine et index ; schéma graphique microcosme.bio-gen-t2 v1 | Réutiliser méthode, nouveau schéma biologique versionné ; ne pas inférer le sexe des exports T2 |
| model.js palettes | Peau/yeux/cheveux/pilosité indépendants | Réutiliser |
| geometry.js derive | Dimensions calculées directement : headH, bodyH, pelvisH, legH, armH ; aucun graphe articulaire complet | Remplacer par squelette canonique paramétrique |
| geometry.js project | Commandes inspectables {kind,x,y,w,h,color,tag,clip} ; quatre vues sans nouveau tirage | Préserver interface de commandes ; reconstruire projections depuis le même corps |
| geometry.js muscles | Rectangles calculés à partir de coordonnées de vue | Remplacer par volumes liés aux segments locaux |
| geometry.js chest/anatomy | chestPresent/chestVolume/chestY/anatomyMark indépendants et graphiques | Remplacer par caractères attachés au thorax/bassin, dissocier fonction reproductive |
| geometry.js profil | Facteurs fixes de largeur (ex. tête .64, tronc .52, bassin .65) | Remplacer par profondeurs corporelles issues du canon |
| render.js | Raster Canvas entier, imageSmoothingEnabled=false, primitives rectangles/ovales/triangles | Réutilisable, sous réserve des adaptations de commandes |
| lab.js/html/css | Galerie, vues, paramètres, export JSON | Adapter pour trois profils, T male/female, debug ancrages, sans dépendance externe |
| tests/workflow T2 | CI Node et navigateurs Chromium/WebKit, vérifications de non-régression | Préserver et étendre aux 23 tests T3-A ; test iPad physique distinct |

## Écarts et réserves
1. T2 : 80 unités (tête 20, tronc 25, bassin 10, jambes 25) ; T3-A : 100 unités (25/30/45). Échelle normalisée à convertir sans distorsion artificielle.
2. P1/P2 : préciser la composition des multiplicateurs et les contrôles finaux, puis consigner les corrections P3. Le contrat signale explicitement cette règle à auditer ; ne pas inventer une interprétation incompatible.
3. T2 exporte des profils purement graphiques sans catégorie/fonction ; aucune migration biologique automatique fiable.
4. Le document de référence T2 et son PNG ne remplacent pas les DEUX croquis de l'utilisateur (visage et squelette face/profil/dos). Confirmer présence et provenance des croquis avant implémentation visuelle ; si absents, signaler le blocage sans inventer leurs mesures.
5. Le troisième type possède une seule fonction reproductive, male OU female ; il doit être explicitement identifié dans les données. Son identification visuelle ne se réduit pas à une moyenne arithmétique M/F.
6. Le moteur principal, ses sauvegardes, T2 et autres laboratoires doivent rester inchangés.

## Verdict
FAVORABLE À LA PRÉPARATION d'une mission Codex T3-A indépendante, PAS à une fusion. Réutiliser déterminisme, palettes, primitives de rendu, commandes et infrastructure d'essai ; remplacer modèle anatomique et géométrie d'ancrage. La faisabilité de l'intégration finale et la qualité visuelle restent non vérifiées. Les 23 tests sont des exigences, pas des résultats.
## Conditions de réception
Trois silhouettes de référence (M/F/T, avec bascule male/female pour T), affichage squelette/ancrages, face/profil/dos, modifications interactives, rapport des corrections, 23 tests automatisés, non-régression, preview HTTPS GitHub Pages testable sur Safari iPad physique, PR de code ouverte NON fusionnée et rapport de traçabilité. Aucun déploiement preview ne vaut validation de fusion.
