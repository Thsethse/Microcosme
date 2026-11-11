# Rapport v0.9 — 11 novembre 2026

## Base vérifiée avant modification

La PR #3 (`codex/microcosme-v0.8`, tête `1d6229ca8b72537fa81fecb52bb6083b9b826c84`) était **déjà fusionnée** à l'ouverture de cette mission. GitHub indiquait une fusion le 11 novembre 2026 à 18 h 32 (Europe/Paris), commit `a2be23970f7d9b7fc49685fb34d80932d9ac6a36`. Le travail part de ce commit de `main`, qui contient le code de la PR #3 et l'aperçu v0.8 déjà présent. Aucune fusion de la PR #3 n'a été effectuée pendant cette mission. L'aperçu isolé `preview-v08/` est conservé.

Livraison : branche `codex/microcosme-v0.9`, nouvelle PR vers `main`, sans fusion automatique.

## Résultat

Bibliothèque procédurale originale : quatre variantes de prairie, herbes, fleurs, pierres, buissons, arbres détaillés, cultures en sillons, maisons à toits de tuiles, fenêtres et cheminées. Silhouettes individuelles, marche, attente, quatre orientations et anneau de sélection. Cycle lumineux sur l'heure du moteur, ombres du crépuscule, lumières chaudes, feuillage, fumée, poussières et lucioles. L'atelier indépendant compare quatre phases et la marche, avec curseur horaire.

`engine.js`, `cognition.js` et `storage.js` sont inchangés. Aucune évolution de format de sauvegarde. Les interactions v0.8 restent en place ; seul un appel de synchronisation graphique est ajouté à `ui.js`. Pas de dépendance de production ajoutée, pas d'accès réseau pour les images. Quatre documents de conception et vérification accompagnent les captures dans `docs/apercus-v09/`.

## Tests réalisés

- `npm test` : **35 tests Node réussis**, dont les 31 existants et 4 tests graphiques : décor déterministe et borné, lumière continue/périodique, sprites distincts et orientations, atmosphère pure et mouvement réduit.
- `npm run test:browser` : parcours complet **Chromium 151 et WebKit 26.5 Linux réussis** via Playwright 1.62.1, viewport tactile 820 × 1180 puis 1180 × 820.
- Régressions conservées : cinq scènes, fenêtres et focus, sélection, outils, mémoire cognitive, sauvegarde/restauration, stockage hostile, déplacement/pincement synthétique, absence de mutation pendant observation, hors réseau après chargement.
- Ajouts navigateur : différence des rendus jour/crépuscule/nuit, démonstration sans changement de la partie en pause ni du texte stocké, rendu figé en mouvement réduit, cache et nombre de Canvas bornés après huit allers-retours scène/atelier, arrêt de la boucle hors scène, démonstration hors réseau.
- Inspection visuelle de captures à DPR 2 : village et atelier nocturne ; captures des quatre vues jointes à la direction artistique.

### Mesure de coût de rendu

60 appels synchrones de `render()` par population, après initialisation et échauffement du cache, avec habitants synthétiques, sur l'exécuteur Linux. Préférence de mouvement réduit active pour cette mesure. Les données synthétiques sont ensuite retirées et l'état initial restauré, sans sauvegarde. Valeurs représentatives d'une exécution, en millisecondes :

| Navigateur | Population | Médiane | P95 |
| --- | ---: | ---: | ---: |
| Chromium | 5 | 0,3 | 0,6 |
| Chromium | 30 | 1,2 | 2,5 |
| WebKit | 5 | < 1 | 1 |
| WebKit | 30 | 1 | 3 |

La granularité de l'horloge WebKit arrondit certains échantillons à zéro. Ces chiffres mesurent le coût JavaScript de synchronisation, **pas les FPS**, le coût du compositing, ni la performance d'un iPad. Les parcours avec animations actives passent ; une mesure prolongée de fluidité sur matériel reste à effectuer.

Les bibliothèques WebKit manquantes ont été téléchargées depuis Debian et extraites dans le répertoire de travail, sans modification système. Leurs liens ont été ajoutés au bundle navigateur de test. La validation automatique des dépendances Playwright utilise le cache système `ldconfig`, ignorant ces bibliothèques locales : elle a été désactivée pour le lancement WebKit après vérification des dépendances effectives. Aucun script ou contournement de ce type n'est intégré au jeu ou à la CI ; la CI conserve `playwright install --with-deps`.

## Limites explicites

- Aucun iPad physique testé. La procédure dédiée est une étape de validation avant fusion.
- Lumière interpolée en fonction de l'heure, mais affichée aux pas horaires du moteur. Une pause fige immédiatement sa valeur ; aucun fondu commandé par une horloge réelle.
- Pixels agrandis sans lissage. Aux zooms fractionnaires, largeur physique des pixels parfois inégale. Pas d'ajustement automatique du zoom sur un multiple entier.
- Personnages toujours au-dessus du décor : compromis de lisibilité ; pas d'occlusion par profondeur. Des habitants partageant la même case peuvent se recouvrir, comme en v0.8.
- Animations décoratives continuent pendant la pause, sauf mouvement réduit. Elles ne modifient pas la lumière ni les données.
- Contrôle mémoire par ressources et éléments bornés, sans profilage exhaustif du tas ni mesure prolongée sur Safari. Pas de fuite manifeste observée dans les allers-retours automatisés.
- Le test de performance est un microbenchmark local et ne constitue pas une garantie de fluidité sur tablette.
- Hors ligne après chargement, sans nouveau service worker ni promesse de démarrage hors réseau.
