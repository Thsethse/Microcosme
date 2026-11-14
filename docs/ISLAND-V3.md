# Île V3 — navigation et ressources graphiques

Base : branche V2 `9d75601`, PR9 inchangée ; les PR7/8/9 et les prévisualisations V1/V2 restent préservées. Moteur de monde, terrain, itinéraires, positions et lois de simulation de V2 strictement inchangés. Pas de stockage ni migration ; les clés historiques ne sont ni lues ni écrites. La mémoire IA consultée lors des missions précédentes reste applicable : aucune clôture C5 prétendue. Aucun AGENTS.md trouvé dans les arbres inspectés.

## Corrections de navigation

La V2 arrondissait la caméra à chaque case et relançait son fondu sur chaque déplacement ; elle ne gérait qu’un pointeur et ne possédait pas de pincement. V3 sépare la géométrie continue dans `island-camera.js`, sans nouvelle dépendance. Les transformations terrain/sprites/portail partagent la même fenêtre de coordonnées.

- Glissement à un doigt, seuil de 8 pixels, capture des pointeurs après reconnaissance. Coordonnées fractionnaires ; rendu regroupé par requestAnimationFrame. Fondu uniquement au changement de scène.
- Pincement : deux pointeurs, distance normalisée au ratio 4/3, ancrage du point du monde sous le centre du geste. Lever un doigt recalcule la référence de glissement sans saut ; annulation/perte de capture retirent les pointeurs. Le bornage peut déplacer l’ancre à la limite de région, comportement attendu.
- Zoom local de 75 à 300 %, pincement et boutons accessibles +/−/100 %. À 100 %, mêmes proportions que V1/V2 ; agrandissement uniforme du terrain et des habitants. Les miniatures globales et le plan intérieur gardent leur échelle.
- Un glissement/pincement abandonne le suivi, réactivable par la fiche ; le zoom par boutons conserve le suivi. La caméra suivie conserve son niveau de zoom aux changements de région.
- Un toucher bref est activé à pointerup. Le clic de compatibilité émis après ce même toucher est neutralisé, même si le contrôle disparaît et qu’un autre bouton passe sous le doigt (sortie de grotte, fermeture de fiche). Un nouveau pointerdown réarme l’interaction ; clavier et souris restent utilisables.
- Portail : cible 64×64 pixels CSS, premier plan et position bornée visuellement pour éviter le rognage aux bords. Entrée par toucher ; sortie restaure la fenêtre extérieure et le zoom. Les autres cavités décoratives restent sans intérieur.

La caméra zoomable concerne les scènes locales extérieures. Vue globale et intérieur restent fixes ; défilement de la page hors carte conservé. Pas d’inertie ni de zoom de navigateur imposé. Le document n’interdit pas le zoom d’accessibilité hors de la carte.

## Inventaire vérifié avant modification

- `graphics.js` : palette historique, hachage déterministe, quatre terrains procéduraux, sprites d’habitants 16×24 avec poses/directions, coefficients lumineux. Sprites et hachage réutilisés sans modification.
- `atmosphere.js` et `renderer.js` : rendu/atmosphère du village historique ; inchangés, non importés dans l’île.
- `island.js` V2 : palettes et rectangles propres aux biotopes, dessins de 41 marqueurs. Les motifs terrain ont été extraits/remplacés ; les marqueurs et leurs positions sont conservés.
- Les PNG sous `docs/apercus-v09/` sont des captures de documentation, pas des spritesheets. Aucun atlas artistique externe ni illustration ChatGPT de référence disponible dans le dépôt.
- Aucun fichier image distant ni police externe à l’exécution. Aucune bibliothèque de navigation ajoutée.

## Bibliothèque V3 originale

`island-art.js` expose `biomes` (nom, palette, motif) et `tile(ctx,kind,x,y)` : tuiles locales de 32×32, originales, déterministes, Canvas 2D, compatibles CommonJS pour les tests. Le renderer conserve jusqu’à huit variantes par terrain ; cache fini (au plus 160 petites tuiles), indépendant du nombre de régions visitées. Seules les tuiles visibles sont composées localement ; même bibliothèque miniaturisée sur la carte globale. Pas de Canvas ou image par objet du monde.

| Biotope | Identité visuelle livrée |
|---|---|
| Forêt tempérée | Sol vert, feuillus, clairières et champignons |
| Jungle tropicale | Verts profonds, grandes feuilles, lianes, fruits |
| Marécages | Sol olive, flaques sombres, roseaux |
| Plaines et prairies | Herbes et fleurs de teintes variées |
| Plages | Sable clair, lignes de marée, coquillages et galets |
| Falaises côtières | Roches stratifiées, base d’eau, corniches |
| Montagnes | Pics et roches claires/ombrées, zones ouvertes |
| Neige/glaciers | Blancs froids, bancs de neige et fractures bleues |
| Volcan | Basalte sombre, fissures, lave et évents espacés |
| Désert/dunes | Crêtes de dunes, ombres chaudes, cactus ponctuels |
| Canyons | Strates rouges, bandes de gorge et fissures |
| Landes/collines | Touffes de bruyère mauve, reliefs bas |
| Toundra alpine | Pierres froides, lichens clairs et herbes rases |
| Mangroves | Eau verte, arbres et racines apparentes |

Variations de texture, décalages de motifs, clairières et espacement des reliefs réduisent la répétition ; la bibliothèque demeure un tileset procédural schématique. Les proportions des habitants et leur identité sont conservées. Aucun effet biologique/géologique associé aux motifs.

### Ressources artistiques encore nécessaires

Pour atteindre une finition artistique détaillée : tuiles de transition entre couples de terrains (sols, rivages, neige/roche), grandes pièces de falaises/cascades, sprites uniques pour les 41 lieux (ruines, fossiles, sanctuaire, épave, arche, cratère, grandes cavernes), variantes de grands arbres et formations glaciaires, puis une passe de composition inspirée de la référence une fois fournie. Ces illustrations n’existent pas ici ; les motifs V3 ne prétendent pas les remplacer à qualité finale.

## Validation et test iPad

`npm test` : 44 tests, soit les 42 de V2 et deux contrôles V3 (géométrie continue, ancrage, zoom répété et bornage ; présence, déterminisme et distinction des 14 ressources). `npm run test:browser` : non-régression historique Chromium/WebKit. `npm run test:island:browser` : parcours V1/V2 conservé, glissement, pincements natifs répétés via CDP Chromium, zoom par boutons dans les deux moteurs, toucher après glissement, caméra extérieure restaurée, suivi et intérieur, dimensions portrait/paysage, stockage intact, hors ligne. Capture globale/locale inspectée. Le glissement WebKit est testé via Pointer Events souris et taps tactiles ; pincement Safari physique reste à vérifier.

Pas d’iPad physique disponible. Aucune affirmation de fluidité mesurée, consommation, mémoire ou certification Safari sur matériel Apple. Les bibliothèques WebKit locales et le proxy HTTPS sont propres à cet environnement ; les tests CI utilisent les dépendances officielles Playwright.

Sur iPad, ouvrir l’URL publiée sous `/preview/island-v3/island.html` :

1. Toucher une région. Glisser longtemps et dans toutes les directions ; franchir les limites et repartir immédiatement.
2. Répéter dix pincements/dézoom, déplacer leur centre, lever un doigt puis continuer le glissement. Vérifier l’absence de saut et de déclenchement involontaire de fiche/portail. Comparer avec +/−/100 %.
3. Après chaque geste, toucher une fiche et un bouton de navigation. Aucun toucher ne doit être perdu ou appliqué deux fois.
4. Carte → Les sommets → toucher Entrer → sortir. Comparer position de caméra et zoom extérieurs ; répéter près des bords.
5. Suivre Alix jusque dans la grotte, glisser pour reprendre la main, réactiver le suivi. Identité #1 et temps continus.
6. Observer les 14 biotopes via les régions et l’atlas, portrait/paysage, Réduire les animations, pause/reprise et réseau coupé après chargement.
7. Revenir aux URL V1/V2 et au village : aucune modification de ces versions ou des parties.

Prévisualisation : snapshot figé du commit de la PR sous un nouveau dossier de main, sans fusion ni changement Pages. Ressources locales : island.html/css/js, island-world.js, graphics.js, island-camera.js et island-art.js. Un fichier index de retour renvoie au village historique.

## Correctif prioritaire — navigation permanente

Le bouton **Carte du monde** est placé dans une interface `position:fixed` en haut à droite, hors du viewport de caméra et du contenu défilant, avec prise en compte des zones sûres iPad. Il est présent dans les scènes globale, locale et intérieure ; masquer la minicarte ne le masque jamais. Les commandes mesurent au moins 48 pixels de haut. La fiche modale offre également un retour Carte du monde, qui ferme la fiche et rend le focus au bouton fixe.

La minicarte représente **la région courante**, pas l’île entière : fond simplifié, rectangle de caméra tenant compte du zoom, croix au centre de la vue, position d’Alix en orange lorsqu’elle est dans ce plan. Dans la grotte, elle représente le plan intérieur. Les coordonnées indiquent le centre de la vue (observateur), pas une nouvelle position d’habitant. Le bouton Masquer/Afficher conserve sa préférence durant les changements de scène, pour la session seulement. Le fond est mis en cache par région ; seuls le cadre et les marqueurs sont redessinés. Le panneau dessiné laisse passer les gestes, afin de ne pas intercepter la caméra ou les commandes placées en dessous.

Le retour monde abandonne le suivi et les gestes en cours, ferme la fiche éventuelle, affiche la vue globale et remet la carte visible dans la page si elle avait défilé. Il ne met pas en pause, ne réinitialise pas et ne fait pas avancer la simulation. Aucune modification du moteur ou des sauvegardes.

Tests ajoutés au parcours navigateur, dans Chromium et WebKit : trois cycles de cinq zooms, glissement de caméra, vérification du repère actualisé, masquage, défilement jusqu’au bas de page, stabilité des coordonnées du bouton fixe, visibilité réelle par hit-test et taille tactile, retour global avec minicarte masquée, passage par la grotte puis retour global direct, réaffichage de la minicarte et retour depuis la fiche. Comparaison exacte du monde avant/après ces navigations à pause ; les tests précédents conservent le contrôle de simulation active. Test physique iPad restant nécessaire : répéter ces cycles en portrait/paysage, notamment avec les barres Safari ouvertes puis rétractées.

Les URL des scripts et du CSS portent le suffixe `?v=v3-nav1` pour éviter de mélanger la nouvelle interface avec des ressources V3 précédemment mises en cache dans Safari. Pour forcer également le nouveau document, ouvrir `island.html?v=v3-nav1` sur la prévisualisation.
