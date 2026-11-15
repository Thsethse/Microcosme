# Résultats techniques individuels R1

23 tests T3-A conservés, 8 contrôles R1 ajoutés. Les statuts ci-dessous portent sur leurs assertions techniques automatisées. **Validation visuelle et Safari iPad physique : non exécutés par Codex, à la charge de l’utilisateur.**

|ID|Vérification|Node local et CI|
|---|---|---|
|T3A-01|proportions initiales 25/30/45 total 100|Réussi|
|T3A-02|articulations toutes connectées|Réussi|
|T3A-03|allongement tronc suit volumes|Réussi|
|T3A-04|bras modifiés : biceps/avant-bras attachés|Réussi|
|T3A-05|jambes modifiées : cuisses/mollets attachés|Réussi|
|T3A-06|poitrine sur thorax|Réussi|
|T3A-07|organes sur bassin|Réussi|
|T3A-08|M : profil et fonction|Réussi|
|T3A-09|F : profil et fonction|Réussi|
|T3A-10|T : une fonction reproductive seulement|Réussi|
|T3A-11|reproductibilité|Réussi|
|T3A-12|variations extrêmes sans détachement|Réussi|
|T3A-13|projections cohérentes|Réussi|
|T3A-14|sérialisation export/import sans perte|Réussi|
|T3A-15|non-régression T2 et moteur|Réussi|
|T3A-16|bornes P1|Réussi|
|T3A-17|profils P2 reproductibles|Réussi|
|T3A-18|trois catégories et valeurs initiales|Réussi|
|T3A-19|rapport des corrections|Réussi|
|T3A-20|rejets des combinaisons interdites|Réussi|
|T3A-21|attaches après variations combinées|Réussi|
|T3A-22|dimensions cohérentes dans les trois vues|Réussi|
|T3A-23|export conserve valeurs appliquées et catégorie|Réussi|
|R1-01|Continuité thorax/abdomen et raccords cou/clavicules/épaules|Réussi|
|R1-02|Muscles attachés et rendu normal dans les tons de peau|Réussi|
|R1-03|Sept têtes indépendantes de la catégorie et de la fonction|Réussi|
|R1-04|Plusieurs morphologies disponibles dans chaque catégorie|Réussi|
|R1-05|Yeux sous mi-hauteur, sourcils au-dessus, bouche entre bas des yeux et menton|Réussi|
|R1-06|Aucun nez, ni géométrie ni ancrage nasal|Réussi|
|R1-07|Dos sans traits faciaux, projections depuis le même canon|Réussi|
|R1-08|Non-régression du contrat, JSON versionné et fichiers protégés|Réussi|

Les 31 lignes réussissent aussi dans la [CI finale](https://github.com/Thsethse/Microcosme/actions/runs/43754301274), sur la source `5dcac5795c408ab72607477eaeedc9641acd11d8`. Les 35 tests historiques et les 6 tests T2 réussissent, soit 72 tests Node au total. Les parcours T3-A et R1 réussissent sous Chromium 151 et WebKit 26.5 sur fichiers et sur l’URL HTTPS publique. La non-régression navigateur T2 réussit dans les deux moteurs.

Les preuves et limites détaillées figurent dans [RAPPORT.md](RAPPORT.md), [PUBLICATION.md](PUBLICATION.md) et [MESURES-CI.jsonl](MESURES-CI.jsonl). Les contrôles techniques R1-01/R1-02 ne valent pas approbation de la qualité anatomique ou artistique ; R1-08 ne vaut pas essai Safari iPad physique.
