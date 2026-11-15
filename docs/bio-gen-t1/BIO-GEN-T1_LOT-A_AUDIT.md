# Microcosme — BIO-GEN-T1 : rapport d'audit de faisabilité, lot A
Date : 15 novembre 2026
Statut : audit de lecture du dépôt ; aucune modification, compilation ou réexécution des tests lors de l'audit.
Dépôt : https://github.com/Thsethse/Microcosme
Branche analysée : codex/v4-i1-foret-des-sources ; commit dd453c78b5b87f9f84c3b339d6a4d32a9de673ba
PR #10 : https://github.com/Thsethse/Microcosme/pull/10 (V3, non fusionnée)
PR #12 : https://github.com/Thsethse/Microcosme/pull/12 (V4, non fusionnée, basée sur #10)

## Constat vérifié par lecture
- `forest-renderer.js` : Canvas 2D, composition de terrain, volumes et personnages, tri d'occlusion ; un personnage est dessiné dans un canvas 16 x 24 puis affiché à 20 x 30 px.
- `graphics.js` : dessin de personnage existant ; insuffisant à lui seul pour établir un portrait paramétrique détaillé.
- `island-motion.js` : interpolation visuelle séparée de la simulation.
- `forest.js` : interactions tactiles, sélection et suivi, caméra.
- `forest-model.js` : objets visuels, variantes, profondeur ; pas un modèle biologique.
- `assets/forest/` : 38 ressources SVG locales, manifest et génération hors ligne ; méthode d'assets réutilisable, pas une bibliothèque de visages.
- `tests/forest.test.js` et tests navigateur : précédent utile de tests d'occlusion, d'identité, de non-mutation du monde.
- PR #12 rapporte 54 tests Node et des parcours Chromium/WebKit réussis ; ce sont des résultats déclarés par la PR, non réexécutés lors du lot A.
- Safari iPad physique non vérifié ; les performances sur WebKit Linux ne prouvent pas celles de l'iPad.

## Conclusions
Favorable conceptuellement : laboratoire autonome Canvas 2D, réemploi des conventions graphiques et séparation simulation/présentation.
Non démontré : diversité reconnaissable de visages, cohérence des différentes morphologies et poses, portrait détaillé, performances de 100 habitants sur iPad, biologie dynamique complète.

## Architecture conseillée (pas une obligation de réécriture du jeu)
Profil morphologique expérimental -> générateur de formes et couches -> projections de portrait et sprite ; réutiliser conventions V4 sans importer tout le moteur de simulation.

## Risques
R1 silhouettes trop similaires ; R2 déformations du pixel art ; R3 ancrages incompatibles entre poses ; R4 performances iPad inconnues ; R5 qualité artistique à évaluer humainement ; R6 PR #10/#12 non fusionnées, risque de dépendances.

## Conséquences pour le lot B
- Isoler code, données, page et sauvegarde du laboratoire.
- Les familles et âges éventuels sont des jeux de données fictifs, pas une validation de l'hérédité ou de la croissance.
- Ne pas toucher à `graphics.js`, `island-world.js`, sauvegardes ni comportements historiques.
- Produire tests reproductibles, rapports, PR non fusionnée et prévisualisation indépendante ; si publication requiert une modification de main, demander accord avant.
- Lot B = génération de morphologies/visages ; animation complexe et intégration réservées au lot C ou après audit.
- En cas de contradiction entre mission et code, arrêter et demander arbitrage, ne pas inventer des règles biologiques.
