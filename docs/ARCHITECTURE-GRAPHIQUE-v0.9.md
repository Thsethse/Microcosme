# Architecture graphique v0.9

## Responsabilités

| Couche | Fichiers | Rôle |
| --- | --- | --- |
| Monde | `engine.js`, `cognition.js`, `storage.js` | État, règles, cognition, persistance ; inchangés |
| Ressources | `graphics.js` | Palette, hachage, décors, sprites, orientation, coefficients lumineux purs |
| Atmosphère | `atmosphere.js` | Voile horaire, ombres, halos, fenêtres et particules ; aucune écriture dans le monde |
| Présentation | `renderer.js` | Cache des décors et atlas, animation visuelle, préférence système, démonstration |
| Interface | `ui.js`, `interface.js`, `interface.css` | Cases et habitants accessibles, scènes, fenêtres, sélection, caméra tactile |

`render()` transmet une référence en lecture au rendu via `MicrocosmeRenderer.sync(s)`. Les modules graphiques ne connaissent ni `engine.step`, ni `save`, ni le stockage. Position précédente, orientation, temps d'animation et cache sont exclusivement dans le rendu. Aucun champ graphique n'est ajouté à l'état sauvegardé.

## Composition Canvas + DOM

Deux Canvas de 384 × 288 pixels dans le monde transformé par la caméra existante. Le premier conserve le décor tant que la liste des terrains ne change pas. Le second redessine l'atmosphère. Les boutons des 108 cases restent au-dessus et transparents ; ils gardent les outils divins et le focus clavier. Les boutons des habitants utilisent un atlas généré en mémoire (48 × 96 pixels) sur leur élément visuel. Ils conservent le déplacement CSS et les gestionnaires de sélection v0.8.

Le rendu ne dépend pas de WebGL. `image-rendering: pixelated` agrandit les pixels de la grille, y compris sur Retina ; le backing store reste volontairement logique, indépendant du DPR. Il n'est donc pas doublé pour la densité de l'écran. Aux facteurs de zoom non entiers, certains pixels peuvent avoir des largeurs physiques différentes ; aucun lissage de texture n'est demandé. Le zoom v0.8 reste compris entre 1 et 3.

Les atlas sont bornés à 30 entrées, évincés par ancienneté ; la composition des identités se répète après 120. Les éléments d'habitants sont réutilisés et retirés lorsqu'ils ne correspondent plus à la population. Aucun élément DOM n'est créé par particule.

## Horloges et cycle de vie

La couleur et l'intensité lumineuses dépendent uniquement de `s.hour`. L'heure du jour n'utilise jamais `Date.now`, `performance.now` ni le temps d'animation. La fonction de lumière interpole les coefficients sur 24 h ; le jeu la consulte à son heure entière. Pause : même lumière, y compris si le navigateur continue à dessiner les particules.

Un seul `requestAnimationFrame` anime les effets et les poses. La boucle s'arrête hors Village sans démonstration, dans un onglet masqué, et après le rafraîchissement nécessaire au passage en mouvement réduit. Un observateur unique suit la visibilité de la scène. `dispose()` permet de libérer le rendu. Les fenêtres de démonstration libèrent leur référence à la fermeture ; leurs Canvas sont retirés avec le dialogue.

L'atelier utilise une carte locale, cinq personnages synthétiques et un curseur horaire indépendant. Aucun appel au moteur, à la sauvegarde ou à la navigation. Ouvrir l'atelier pendant une simulation active laisse cette simulation fonctionner comme auparavant. Le fermer ne change ni son état de marche ni son heure.

## Compatibilité

Les scripts et ressources sont locaux ; aucune requête graphique après chargement. Le fonctionnement hors réseau après chargement est conservé, sans garantie nouvelle de démarrage hors ligne. Canvas 2D, Pointer Events, dialogues natifs et MediaQueryList correspondent à Safari iPad récent. Les gestes et le centrage restent ceux de la v0.8, sans inertie ni ancrage du zoom sous les doigts. La réduction des animations doit aussi être validée sur matériel Apple.
