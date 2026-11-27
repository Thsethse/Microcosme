# BIO-CONVERGENCE-01 — Audit de convergence
Six axes validés par le porteur. Audit documentaire et lecture du code uniquement, sans développement, correction, fusion ni intégration.
Base éditeur : codex/bio-corps-06-r02 (preview validée). Identifier SHA exact et version du moteur réellement inspectée ; ne pas confondre prototype et jeu. Consulter code, contrats, tests, schémas et historique pertinents. Si une source manque, le signaler.
## C1 Architecture
Cartographier modules corps/visage/cheveux/maquillage, dépendances, fonctions de rendu, API, duplication, état UI versus logique autonome. Identifier si générateur unifié et utilisable hors atelier, preuves à l'appui.
## C2 Données
Inventorier représentation complète, types, unités, défauts, domaines contextuels, valeurs latentes, seeds, versions, sauvegarde/import/export et migrations. Distinguer identité biologique, histoire individuelle et expression personnelle sans présumer que cette séparation existe déjà dans le code. Vérifier persistance des compositions, stabilité des ancrages et BIO-INV-01.
## C3 Génération
Examiner génération procédurale sans UI, déterminisme, variété effective, contraintes, biais, compatibilités, échantillonnage, cohérence des habitants. Distinguer capacité existante et proposition.
## C4 Biologie
Examiner possibilités et limites de liaison avec hérédité, croissance, âges, vieillissement, morphologies, pigmentation, marques et cicatrices. Ne pas inventer de modèle génétique ni valider de nouvelles règles biologiques. Identifier données manquantes et décisions nécessaires.
## C5 Autonomie
Examiner interfaces potentielles entre apparence et moteurs universels M1–M6. Distinguer changement biologique, événement historique et action volontaire (coiffure, pilosité, maquillage). Examiner contraintes et possibilités de modification sans UI, conservation de l'identité, sauvegarde. Aucun comportement à implémenter.
## C6 Performances
Examiner coûts de génération, rendu, mémoire, DOM/SVG, cache, mises à jour, trois échelles et usage Safari iPad. Étudier scénarios 10, 100, 1000 habitants sans en faire des objectifs contractuels. Exécuter uniquement tests/mesures non destructifs déjà disponibles ou inspection ponctuelle sans modifier code ; documenter matériel, navigateur, méthode, limites. Séparer mesures, estimations et inconnues. Ne pas prétendre mesurer iPad physique à distance.
## Rapport
Pour chaque axe : état opérationnel / partiel / absent / décision requise ; preuves chemin fichier, symbole, lignes et SHA ; limites, risques, dépendances et recommandations. Distinguer vérifié, inféré, non vérifié. Examiner notamment non-régressions et invariants. Fournir matrice de synthèse, carte architecture, inventaire données, liste priorisée des écarts et questions au porteur.
Comparer options : corriger uniquement les écarts bloquants avant les âges, intégrer une tranche minimale maintenant, ou autre séquence justifiée. La création physique adulte est artistiquement clôturée ; ne pas rouvrir les choix esthétiques. Vérifier les anciennes réserves fonctionnelles thorax et inventorier les écarts face/corps par rapport aux contrats validés. Donner recommandation argumentée, sans décider à la place du porteur. Identifier ce qui peut rester hors périmètre pour éviter surcomplexification.
## Livraison
Branche codex/bio-convergence-01-r01 depuis docs/bio-convergence-01-r01. Rapport dans docs/ai/bio-convergence-01-r01/RAPPORT.md, PR documentaire ouverte sans fusion. Aucune preview nouvelle requise (aucun code changé). Aucun développement, refactor, changement de tests, modification de données ou intégration. Si anomalie détectée, la documenter sans la corriger. Attendre validation du porteur avant toute suite.
