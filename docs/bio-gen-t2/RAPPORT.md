# BIO-GEN-T2 — laboratoire géométrique

Branche indépendante `codex/bio-gen-t2`. Base : main `5d33e923b1bde56de4b7c620f45fb6fa6c2f3ee8`. Référence artistique consultée : branche `docs/bio-gen-t2-reference`, PNG validé et notice au commit `bce2f70d0fcd19214366861267e3857a97cae9b0`.

## Livrable utilisable

Lien GitHub Pages : **https://thsethse.github.io/Microcosme/preview/bio-gen-t2/**. Publication isolée et preuves de déploiement/HTTPS dans [PUBLICATION.md](PUBLICATION.md). Le code de développement reste sur sa branche et sa PR ouverte ; aucune fusion ni intégration au jeu.

La page affiche immédiatement 20 personnages, sélectionnables au toucher. Elle propose 45 réglages regroupés en accordéons, quatre vues synchronisées (face, profil droit, dos, portrait), palettes, graine, réinitialisation, référence neutre à quatre têtes, rejeu et import/export JSON. Les modifications redessinent le personnage immédiatement, sans chargement distant. Le bouton 100 personnages mesure ce navigateur. Le panneau de référence contient la planche validée et une comparaison visuelle T2/B2 de même graine, avec indication que les deux modèles ont des paramètres différents.

Le [découpage source](ARCHITECTURE.md) sépare description, génération des formes, rasterisation Canvas et interface. [Inventaire et valeurs par défaut](PARAMETRES.md). Ressources originales locales, polices système, pas de personnage prédessiné, de génétique ou de modèle biologique concurrent. B1/B2 ne sont pas remplacés.

## Tests T2-01 à T2-15

| ID | Vérification technique exécutée | Résultat / réserve artistique |
|---|---|---|
| T2-01 | Référence : tête 20, tronc 25, bassin 10, jambes 25, soit 80 = 4 × 20 | Réussi ; contours et coiffures exclus de la mesure des segments |
| T2-02 | Étirements X/Y et dimensions des membres modifiés sans changer les autres dimensions | Réussi ; les ancrages sont recalculés pour maintenir les raccords |
| T2-03 | Cinq géométries et cinq portraits sans cheveux distincts par pixels | Réussi ; reconnaissance perceptive humaine ouverte |
| T2-04 | 1000 profils bornés, membres rectangulaires, 180 masques anatomiques connexes et non coupés (60 profils × 3 vues) | Réussi Chromium ; non équivalent à un jugement anatomique |
| T2-05 | Commandes musculaires carrées/rectangulaires, tailles et contrastes indépendants par cinq zones | Réussi ; musculature purement visuelle |
| T2-06 | Présence, volume, forme, étirement, position et écartement de poitrine indépendants des muscles et des signes | Réussi ; aucun détail explicite |
| T2-07 | Aucun paramètre ni commande nez/mâchoire/pommette ; yeux géométriques | Réussi ; formes simplifiées, pas de visage réaliste |
| T2-08 | Cils indépendants des commandes sourcils, formes et inclinaisons réglables | Réussi ; aucune identité déduite |
| T2-09 | 5 têtes × 7 coiffures × 4 vues rendues sans erreur et reproductibles | Réussi ; crédibilité/reconnaissance des coupes à auditer |
| T2-10 | Seulement barbe, moustache, favoris, pubis ; aucune autre carte pileuse | Réussi ; couches indépendantes |
| T2-11 | Quatre pigments indépendants, sans modification des autres couleurs | Réussi ; certaines combinaisons libres peuvent manquer de contraste |
| T2-12 | Même profil → mêmes pixels ; téléchargement export JSON relu, réimport et rejet JSON invalide sans perte | Réussi Chromium/Node ; v1 est propre à T2, pas une migration B1/B2 |
| T2-13 | Une géométrie/palette/description pour quatre projections, sans hasard au rendu | Réussi ; association portrait/sprite humaine ouverte |
| T2-14 | 35 tests historiques + 5 B1 + 4 B2, aucun fichier ancien modifié | Réussis localement ; parcours navigateur B1/B2 également prévus en CI |
| T2-15 | Sélection tactile simulée, accordéon, curseur, cases, forme, palette, reset, JSON, 100 personnages, 390/820/1180 px | Chromium local réussi ; Chromium/WebKit et HTTPS public exécutés par la CI de livraison |

Les automatismes testent les propriétés techniques, pas l'acceptation artistique de la référence. Aucun essai iPad physique déclaré réussi.

## Commandes et environnement local

- `node --test tests/bio-gen-t2/model.test.cjs` : **6/6**.
- `npm test` : **35/35** historiques.
- Suites Node de B1/B2 exécutées dans le checkout de leur révision `f85e584` : **9/9**. Total local **50 tests Node réussis**.
- `T2_ENGINES=chromium node tests/bio-gen-t2/browser.cjs` : parcours complet réussi sur fichiers locaux, Chromium 151.0.7922.34, Playwright 1.62.1. WebKit local indisponible faute de bibliothèques système ; la CI Linux installe ces dépendances et exécute les deux moteurs.

VM Linux x86_64, 3 vCPU AMD EPYC 9V74, Node 24.22.1, viewport 820×1180, DPR2, toucher simulé. Dernier relevé : cinq rendus de 100 sprites **18,8–21,4 ms**, médiane **19,5 ms** ; galerie complète de 100 **29,7 ms** génération/Canvas/DOM, **78,5 ms** jusqu'à deux RAF. Mesures brutes dans `MESURES-LOCAL.jsonl`. Mesures ponctuelles VM ; ni FPS continu, ni mémoire native/GPU, ni batterie, ni latence tactile physique mesurés. Aucune extrapolation iPad.

## Limites connues

- Le style est une interprétation procédurale de la planche : aucune promesse de correspondance artistique parfaite. Les volumes et raccords restent volontairement géométriques. Tronc triangulaire ou composé peut créer de grands espaces latéraux entre tronc et bras ; le raccord central reste continu via épaules et bassin.
- Proportion initiale de quatre têtes avant étirements ; une génération complète étire les parties et peut donc changer ce rapport. Le bouton dédié rétablit la référence exacte. Le portrait est un agrandissement/cadrage de la même construction, pas un second visage.
- Profil droit schématique : tête et tronc amincis, un œil et un membre visibles. Pas de reconstruction volumétrique, animation, poses ni locomotion. Les pieds et mains sont des rectangles simples.
- Des coiffures peuvent masquer des contours de tête ou du visage. Les rasés et cinq formes permettent de les inspecter séparément. Les grands yeux sur tête triangulaire peuvent paraître rapprochés ; le curseur d'écartement reste disponible.
- Les muscles sont des aplats rectangulaires, sans modèle de matière ou force. La poitrine et les signes anatomiques sont des symboles, sans texture réaliste ni détail intime. Certaines superpositions de volumes extrêmes nécessitent un arbitrage artistique.
- Pilosité de visage simplifiée en aplats/contours ; texture pubienne petite et quantifiée. Plusieurs valeurs proches peuvent donner les mêmes pixels. Le premier essai de pilosité faciale était trop moucheté à l'inspection ; remplacé par des formes plus lisibles avant livraison.
- Palettes finies indépendantes ; cheveux/poils clairs sur peau claire peuvent avoir un faible contraste. Les couleurs restent modifiables, sans imposer une relation entre pigments.
- Import JSON propre à T2 ; les JSON B1/B2 sont refusés explicitement. Aucun accès aux sauvegardes du jeu, stockage durable automatique ou synchronisation distante.
- La comparaison B2 utilise un instantané local de son rendu original ; même graine ne signifie pas même phénotype entre ces deux grammaires différentes.

## Essai humain attendu sur iPad

Ouvrir l'URL publique Safari, sélectionner plusieurs des 20 personnages, ouvrir les groupes, modifier tête/tronc/membres, muscles, poitrine, yeux, sourcils, cheveux, signes/pilosité et pigments. Tester les quatre vues, la référence quatre têtes et la réinitialisation. Exporter vers Fichiers, changer le profil, puis réimporter et comparer. Tester portrait/paysage et une galerie de 100 ; noter appareil, versions iPadOS/Safari, temps et réactivité.

L'utilisateur juge exclusivement la lisibilité, les proportions stylisées, la cohérence et la proximité de la référence artistique. Consigner les graines/JSON des incohérences. **PR ouverte, non fusionnée ; attendre l'audit utilisateur. Aucune phase supplémentaire.**
