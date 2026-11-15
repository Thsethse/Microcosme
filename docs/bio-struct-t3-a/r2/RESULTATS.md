# Résultats individuels T3-A / R1 / R2

Les statuts ci-dessous concernent les assertions techniques exécutées en Node local. La CI et les parcours HTTPS sont détaillés dans PUBLICATION.md après leur exécution. Les 23 tests T3-A et 8 contrôles R1 restent inchangés.

| ID | Contrôle | Node local |
|---|---|---|
| T3A-01 | proportions initiales 25/30/45 total 100 | Réussi |
| T3A-02 | articulations toutes connectées | Réussi |
| T3A-03 | allongement tronc suit volumes | Réussi |
| T3A-04 | bras modifiés : biceps/avant-bras attachés | Réussi |
| T3A-05 | jambes modifiées : cuisses/mollets attachés | Réussi |
| T3A-06 | poitrine sur thorax | Réussi |
| T3A-07 | organes sur bassin | Réussi |
| T3A-08 | M : profil et fonction | Réussi |
| T3A-09 | F : profil et fonction | Réussi |
| T3A-10 | T : une fonction reproductive seulement | Réussi |
| T3A-11 | reproductibilité | Réussi |
| T3A-12 | variations extrêmes sans détachement | Réussi |
| T3A-13 | projections cohérentes | Réussi |
| T3A-14 | sérialisation export/import sans perte | Réussi |
| T3A-15 | non-régression T2 et moteur | Réussi |
| T3A-16 | bornes P1 | Réussi |
| T3A-17 | profils P2 reproductibles | Réussi |
| T3A-18 | trois catégories et valeurs initiales | Réussi |
| T3A-19 | rapport des corrections | Réussi |
| T3A-20 | rejets des combinaisons interdites | Réussi |
| T3A-21 | attaches après variations combinées | Réussi |
| T3A-22 | dimensions cohérentes dans les trois vues | Réussi |
| T3A-23 | export conserve valeurs appliquées et catégorie | Réussi |
| R1-01 | Continuité thorax/abdomen et raccords cou/clavicules/épaules | Réussi |
| R1-02 | Muscles attachés et rendu normal dans les tons de peau | Réussi |
| R1-03 | Sept têtes indépendantes de la catégorie et de la fonction | Réussi |
| R1-04 | Plusieurs morphologies disponibles dans chaque catégorie | Réussi |
| R1-05 | Yeux sous mi-hauteur, sourcils au-dessus, bouche entre bas des yeux et menton | Réussi |
| R1-06 | Aucun nez, ni géométrie ni ancrage nasal | Réussi |
| R1-07 | Dos sans traits faciaux, projections depuis le même canon | Réussi |
| R1-08 | Non-régression du contrat, JSON versionné et fichiers protégés | Réussi |
| R2-01 | Poitrine thoracique lisible face/profil, absente dos | Réussi |
| R2-02 | Attribut masculin attaché à l’entrejambe face/profil, absent dos | Réussi |
| R2-03 | Fonction féminine : signe discret de face, aucun en profil | Réussi |
| R2-04 | T : génital selon fonction, poitrine et morphologie inchangées | Réussi |
| R2-05 | Extrêmes P1 et morphologies : attaches et raccord pelvien conservés | Réussi |
| R2-06 | Projections du même canon, masquage aussi en diagnostic | Réussi |
| R2-07 | Identité stricte des champs R1 hors seul attribut et ancrage génital | Réussi |
| R2-08 | JSON R1/R2 et fichiers protégés sans régression | Réussi |

**39/39 réussis, 0 échec**, plus les 35 tests historiques locaux. R2-01…R2-06 vérifient attaches et commandes de projection ; le parcours navigateur vérifie aussi l’effet réel dans les pixels. R2-07 compare 378 corps R1 et 1 134 projections non concernées par la correction ; les références sont générées depuis le code R1 `b05a3fe`, pas depuis l’implémentation R2. R2-08 vérifie notamment la lecture/réexport des JSON v2 R1.

Les contrôles R1/R2 de non-régression iPad ne valent pas essai physique : **Safari iPad et approbation artistique non réalisés par Codex, attendus de l’utilisateur**. Les nombres de pixels et masques connexes ne prouvent pas la qualité du dessin ni l’absence de toute superposition possible.
