# Île V2 — géographie et caméra locale

Branche `codex/island-v2`, issue de la tête inchangée de la PR8 `7d041e2`. Les guides mémoire IA ont été consultés lors de V1 et restent applicables : ce prototype autorisé ne clôture pas C5. Main `413d89d`, PR7 `8767f15`, PR8 `7d041e2` inspectés ; aucun AGENTS.md dans les arbres déjà inspectés. Les PR7/8, le moteur historique et leurs sauvegardes restent inchangés.

## Accès

Servir le dépôt avec `python3 -m http.server 8000 --bind 0.0.0.0`, ouvrir `http://IP_DU_PC:8000/island.html` depuis l’iPad du même réseau.

Prévisualisation dédiée : https://thsethse.github.io/Microcosme/preview/island-v2/island.html

La publication copie uniquement les cinq ressources statiques et un lien de retour vers le village, sous un nouveau sous-chemin de main ; aucun écrasement de `/preview/island/`, aucun changement de configuration Pages, aucune fusion de PR. Le snapshot publié est figé sur le commit de code indiqué dans son README.

## Livré

Surface 96×72 (quatre fois la surface V1), neuf régions 32×24. Une fenêtre locale demeure à 16×12 cases : habitants et objets conservent leur taille V1, régions deux fois plus larges et hautes que cette fenêtre. Carte globale toujours entière dans le viewport. Sprites DOM identiques (9×14 miniature, 32×48 rapproché), cibles tactiles 44px. Les zones globales n’ont aucun texte visible ; leurs noms accessibles restent disponibles au clavier/lecteur d’écran.

Les 14 biotopes occupent réellement des cases : forêt tempérée, jungle, marécages, prairies, plages, falaises, montagnes, neige/glaciers, volcan, désert/dunes, canyons, landes/collines, toundra, mangroves. Répartition par distances aux foyers géographiques perturbées, littoral irrégulier, îlots, lac et lagune, rivière avec gué. Les contours ne suivent pas les neuf rectangles d’observation.

L’atlas secondaire liste 41 éléments : toutes les eaux, reliefs, végétation/ressources et lieux singuliers demandés. Chaque entrée centre la caméra sur une position déterministe et un motif dessiné. Les pictogrammes restent schématiques : plusieurs cavités/reliefs et ressources partagent un motif de famille. Cascades, sources chaudes, arches, lave, fruits, épave, arbre monumental et cratère possèdent des variantes. Mer côtière observable librement à la caméra ; Alix ne nage pas. Aucun système écologique, géologique ou économique ajouté. Glaciers représentés par le terrain neigeux, sans dynamique glaciaire.

Caméra : Pointer Events avec seuil de glissement 8px, capture, bornage dans chaque région, coordonnées arrondies à la case (pas de déplacement subpixel). Glissement tactile ou souris, flèches au clavier. Un glissement abandonne le suivi pour rendre la main au joueur ; réactiver via la fiche. Le suivi centre Alix en respectant les limites, change de région et traverse la grotte. Le nom de région apparaît environ 2,2s à l’entrée, puis disparaît ; les noms restent consultables dans l’atlas et la fiche.

Une seule simulation et une seule identité #1. Les coordonnées extérieures et l’itinéraire V1 ont été doublés pour la nouvelle géographie ; le plan de grotte reste 16×12. Les portails sont catalogués par `interiors` avec identifiant, entrée et sortie, en préparation d’autres plans ; seul le portail existant est actif. Les autres grottes/cavernes sont décoratives, comme indiqué dans l’atlas.

## Rendu et limites

Vue globale : 6 912 cases de terrain simplifié ; pas de rendu des 41 objets détaillés. Vue locale : seulement 192 cases et les marqueurs dans la caméra. Un Canvas fixe 768×576, un bouton par habitant ; pas de Canvas par région ni de cache illimité. Les données géographiques sont communes au rendu et aux déplacements. Le fond n’est recalculé que si scène/caméra change. Recherche de chemin simple conservée ; aucun nouveau framework ni dépendance.

Aucune sauvegarde de l’île, aucune lecture/écriture des clés historiques. Arrêt lors du masquage de l’onglet, reprise manuelle sans rattrapage. L’itinéraire reste autonome mais prédéfini. Graphismes provisoires procéduraux ; illustration ChatGPT non accessible, aucune reproduction prétendue. Contrôles synthétiques de bureau ≠ essai physique Safari iPad ; fluidité, mémoire et batterie sur iPad non mesurées.

## Vérifications et parcours physique à réaliser

`npm test` : 42 tests, incluant les 40 de V1 et deux contrôles V2 (occupation réelle des 14 biotopes, catégories/positions, dimensions, limites et projections caméra). `npm run test:browser` conserve la non-régression historique ; `npm run test:island:browser` conserve navigation, suivi, portails, activité hors écran, pause, stockage isolé et hors ligne, et ajoute noms globaux absents, nom transitoire, glissement, bornage et échelle. Chromium teste également une séquence tactile native via CDP ; WebKit utilise les Pointer Events via glissement souris et les taps tactiles. Tester les deux moteurs avec les navigateurs Playwright installés ; détails des bibliothèques locales dans le rapport V1.

Sur iPad physique, consigner modèle et iPadOS :

1. Ouvrir l’URL V2 en portrait puis paysage : île entière, biotopes distincts, aucun nom permanent sur la carte.
2. Toucher une région, vérifier le nom transitoire puis son effacement. Glisser dans les quatre directions jusqu’aux limites ; taille des personnages/objets constante. Aucun toucher de fiche/portail ne doit être déclenché après glissement.
3. Ouvrir l’atlas et visiter les 41 lieux. Les marqueurs sont des représentations provisoires, pas des systèmes simulés.
4. Observer Alix, ouvrir sa fiche, activer le suivi. Attendre changements de région et grotte, vérifier identité #1 et position. Glisser pour reprendre la caméra ; réactiver le suivi.
5. Carte → Les sommets → entrée de grotte → sortie → carte. Revenir V1 et au village historique : leurs URL et parties restent intactes.
6. Pause/reprise, changement d’app, réduction des animations et fonctionnement hors réseau après chargement. Rechargement = nouvelle simulation, sans sauvegarde.

Résultats réellement exécutés : Node 42/42 ; non-régression historique Chromium151/WebKit26.5 Linux réussie. Le parcours V2 est consigné dans la PR après son exécution finale. Safari iPad physique : NON EXÉCUTÉ.
