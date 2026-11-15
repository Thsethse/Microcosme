# Résultats T3-A / R1 / R2 / R3

Les 23 tests T3-A et 8 + 8 contrôles Node R1/R2 sont conservés sans modification. Les dix contrôles techniques R3 sont ajoutés ; R3-11 reste une réception humaine non exécutée. Les preuves CI/publiques sont consignées dans PUBLICATION.md après exécution.

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
| R3-01 | Taille et forme mammaires séparées F/T ; aucune option mammaire M | Réussi |
| R3-02 | Pectoraux ronds à rectangulaires, volumes locaux attachés | Réussi |
| R3-03 | Ventre rond à abdominaux définis ; graisse indépendante | Réussi |
| R3-04 | Ombres brunes locales, douces, six peaux et trois vues | Réussi |
| R3-05 | Pilosité M/F/T ancrée ; pubis au-dessus de la base du sexe | Réussi |
| R3-06 | Nombril : un point canonique, jamais un tiret ni un détail dorsal | Réussi |
| R3-07 | Ancien bassin ovale : migration déterministe, volume et données conservés | Réussi |
| R3-08 | T libre : fonction indépendante de poitrine, muscles, graisse et poils | Réussi |
| R3-09 | Extrêmes et morphologies : canon, attaches et attributs R2 préservés | Réussi |
| R3-10 | JSON v3 déterministe, corps anciens et fichiers protégés | Réussi |
| R3-11 | Réception artistique et Safari iPad physique | Non exécuté — utilisateur iPad / artistique |

**49 réussis, 0 échec, 1 contrôle humain explicitement ignoré par Node**, plus 35 tests historiques locaux réussis. La ligne R3-11 n’est pas un succès automatisé. Les captures sont disponibles, mais l’essai iPad physique et la validation artistique ne sont pas réalisés par Codex.

L’API v2 de compatibilité et les tests historiques vérifient le canon R2 préservé. Les tests R3 utilisent explicitement le canon v3 et vérifient les nouveaux volumes, contraintes, projections, import/export et réglages. R3-09 compare 126 cas aux squelettes, têtes/visages et signes génitaux R2 correspondants. Le parcours navigateur vérifie aussi les pixels et les interactions réelles du canon v3.
