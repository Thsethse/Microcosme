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

## Fluidité des habitants et suivi visuel

Le diagnostic confirme deux cadences distinctes : `step()` modifie les coordonnées logiques toutes les **600 ms**, tandis que V3 affichait ces nouvelles coordonnées sans interpolation. Le suivi centrait directement la caméra sur chaque nouvelle case. La cadence de simulation reste strictement identique ; aucune loi de déplacement, décision, activité ou sauvegarde n’est modifiée.

`island-motion.js` est un module de présentation pur : un historique borné par identité, dernière cible logique copiée, départ visuel, instant de réception, direction et révision de discontinuité. Un déplacement cardinal est interpolé linéairement vers sa cible sur 600 ms. Une nouvelle cible repart de la position visuelle courante, sans saut ni extrapolation dans une case future. La position visuelle peut donc être décalée de **jusqu’à un pas de simulation** par rapport à la position logique inspectée ; ce décalage est explicite et ne modifie pas l’état du monde.

- Une seule chaîne requestAnimationFrame est partagée entre gestes, sprites et suivi. Les mises à jour graphiques ne font jamais avancer le moteur. La boucle continue uniquement tant qu’un sprite se déplace ou que la caméra termine son amortissement ; elle s’arrête ensuite.
- Le suivi utilise la position interpolée, avec un amortissement exponentiel de constante 45 ms, monotone, sans ressort ni dépassement. Le déplacement est borné à la région ; les écarts inférieurs à 0,001 case sont fixés à la cible pour éviter une oscillation ou une boucle infinie de micro-ajustements. La caméra est recalée directement lors d’un nouveau suivi, changement de région ou téléportation.
- L’adaptateur de vue `createView.sync(positionObservée)` accepte facultativement la position visuelle pour choisir la région suivie. Sans argument, son comportement antérieur reste identique. C’est la seule modification de `island-world.js` : elle concerne la vue, pas le monde ou `step()`.
- Les changements de plan, apparitions et sauts de plus d’une case sont recalés immédiatement ; aucune interpolation à travers la mer ou entre extérieur et grotte. Les changements de direction partent du point déjà dessiné. Les poses de marche et l’orientation sont calculées dans la présentation, indépendamment du temps logique.
- À pause, le monde s’arrête immédiatement ; le dernier segment visuel déjà engagé rejoint sa cible en au plus 600 ms, puis la caméra se stabilise. Un onglet masqué est recalé et ses animations arrêtées, sans rattrapage. Réduire les animations affiche directement les positions logiques et supprime l’amortissement.
- Les marqueurs de minicarte utilisent les mêmes positions visuelles. La fiche conserve les coordonnées logiques de l’habitant et affiche son identité/nom propres ; le suivi n’est plus codé en dur sur l’ID1. Les versions livrées conservent Alix seule : les populations supplémentaires appartiennent uniquement aux fixtures de test.
- Pour éviter de recomposer chaque tuile de terrain à chaque image suivie, une seule texture du terrain de la région courante est conservée (1024×768, environ 3 Mio). Le cadrage est une découpe de cette texture ; seuls les objets visibles sont dessinés en détail. Aucun cache de toutes les régions ni rendu détaillé de l’île entière ajouté. Les poses de sprites identiques ne sont pas redessinées inutilement.

### Tests supplémentaires

`npm test` : **48 tests** (44 antérieurs + 4 contrôles interpolation/sauts/direction/multipopulation/amortissement/vue sans mutation). Les tests purs couvrent 20 identités simultanées, retrait des pistes, conservation des données logiques et suivi monotone aux cadences théoriques de 30/60/120 images/s, sans annoncer de performance matérielle mesurée.

`npm run test:island:motion` est ajouté à la CI et exécuté dans Chromium/WebKit. Huit agents de test sont ajoutés au chargement via une fixture ; ils sont ensuite déplacés par le véritable `step()` inchangé. Le parcours observe de vraies images requestAnimationFrame : plusieurs positions DOM/visuelles et positions caméra pour un même état logique, fin d’animation à pause, disparition de la boucle une fois stabilisée, huit identités sans duplication, changement de plan discontinu et mouvement réduit. Le test contrôle le comportement ; la cadence irrégulière du WebKit Linux de cet environnement ne certifie pas un nombre d’images/s sur iPad.

Le parcours antérieur de navigation est conservé ; son horloge de test avance également le temps de présentation et contrôle la région correspondant à la position visuelle. Cela permet de parcourir rapidement l’itinéraire sans confondre temps simulé et temps d’animation. Un parcours séparé utilise les vraies horloges du navigateur. Les tests de moteur et d’application historique restent exécutés dans la CI.

Sur iPad physique, utiliser la prévisualisation `island.html?v=v3-motion1` (scripts et CSS versionnés), observer la marche globale puis suivre Alix : vérifier les lignes droites, les virages, le gué, les changements de région et la grotte. Mettre en pause pendant une marche : l’animation termine son segment, puis tout reste fixe. Glisser/pincer pour quitter le suivi, le réactiver, masquer la minicarte et revenir au monde ; les gestes ne doivent pas interrompre la simulation ni recréer Alix. Tester le verrouillage/changement d’app et Réduire les animations. Safari iPad physique, fluidité et consommation sur matériel Apple : **non exécutés/non mesurés**.
