# Architecture de l’interface v0.8

## État et navigation

`engine.js`, `cognition.js` et `storage.js` restent identiques à main v0.7. Le format sauvegardé reste version 7, sous la clé historique `microcosme-v03` ; aucune migration supplémentaire n’est nécessaire.

`ui.js` conserve l’adaptateur du moteur, les outils et l’inspecteur. `interface.js` possède les cinq scènes, les fenêtres et la caméra. Tous lisent le même `engine.state`, sans duplication lors de la navigation. Les sections HTML sont masquées avec `hidden` ; l’habitant sélectionné, la caméra et l’outil persistent en mémoire. Un rechargement revient au menu, simulation arrêtée ; seule la simulation est persistée, pas la navigation ni la sélection.

À la sortie de Village, la minuterie est supprimée, son état marche/arrêt mémorisé et le monde sauvegardé. Les passages entre scènes secondaires ne changent pas ce souvenir. Au retour au Village, la minuterie reprend à la vitesse précédente seulement si elle fonctionnait au départ. Une partie arrêtée reste arrêtée. Aucun rattrapage du temps écoulé. Nouvelle partie remet la minuterie et cette reprise à zéro. `step()` refuse aussi d’avancer hors Village. Une fiche ouverte au-dessus du Village ne constitue pas un changement de scène : la simulation continue et la fiche conserve son instantané.

## Fenêtres réutilisables

`windowPanel(title, content, actions, outside)` crée un `dialog` modal natif. Titres et contenu textuel passent par `textContent` ; des éléments DOM peuvent composer les paramètres. Chaque dialogue reçoit un titre accessible unique, un bouton Fermer et le focus initial. `showModal()` fournit le fond inerte et le fond modal. Un gestionnaire Tab/Maj+Tab boucle explicitement entre les contrôles du dialogue. Échap ferme le dialogue supérieur ; à la fermeture le DOM est retiré et le focus retourne au déclencheur encore présent. Les paramètres permettent de tester deux dialogues empilés.

La fiche capture `details(person)` à l’ouverture. La confirmation de nouvelle partie interdit la fermeture par toucher extérieur, mais Fermer et Échap permettent d’annuler sans mutation. Les autres fenêtres autorisent le toucher hors de leur rectangle. La fermeture est immédiate afin de restituer le focus sans délai ; les entrées et scènes ont une transition courte, désactivée par `prefers-reduced-motion`.

## Graphismes et caméra

`interface.css` dessine des ressources originales avec aplats, dégradés, trames et silhouettes découpées : prairie, culture, arbre, maison et personnages de couleur stable par identité. Aucun fichier distant ou police externe. Les 108 boutons de terrain et les éléments des habitants sont réutilisés ; seuls leurs attributs et positions évoluent. Les mouvements utilisent une transformation CSS, avec durée adaptée à la vitesse. La sélection ajoute un halo ; la destination conserve son cadre. Le toucher d’une case l’éclaire brièvement.

La caméra transforme seulement `.world` à l’intérieur d’un viewport rogné. Zoom borné de 1 à 3, boutons, pincement avec Pointer Events, glissement et recentrage. Translation bornée aux dimensions transformées ; resize recalcule les limites. Un déplacement supérieur à 8 pixels, un pincement ou une annulation supprime le clic de la séquence. La capture commence uniquement après reconnaissance du glissement ; les clics clavier restent possibles. Aucun état caméra n’entre dans le moteur ou les sauvegardes.

## Publication

Fichiers statiques, sans build : conserver aussi `interface.js` et `interface.css` au même niveau que `index.html`. Chemins relatifs compatibles GitHub Pages `/Microcosme/`. Playwright est seulement une dépendance de développement. La CI existante conserve les tests Node et les parcours Chromium/WebKit à chaque PR.
