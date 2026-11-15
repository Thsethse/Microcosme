# JSON T3-A v2 — formes et attaches R1

Le schéma reste `microcosme.bio-struct-t3-a` ; la version exportée est **2**. `geometryChoices` contient quatre choix indépendants des données biologiques : `headShape`, `torsoShape`, `pelvisShape`, `limbShape`. Les valeurs admises sont celles de `shape-grammar.js`. Catégorie, fonction, paramètres P1 demandés/appliqués et corrections sont conservés.

Le canon reconstruit contient le squelette et ses attaches, les volumes (dont contours/vertices locaux), `face` et ses repères calculés. Les ancrages sont dans `skeleton.anchors`, jamais en coordonnées d'écran. Les sept têtes et les quatre familles de choix sont disponibles pour M/F/T et les deux fonctions de T. Changer une forme ne change pas de catégorie, de fonction, de paramètre numérique ou de graine.

Les exports **v1** de T3-A restent importables via une migration signalée dans `migration` et visible sous les contraintes de l'interface. Les paramètres biologiques et la trace des corrections ne sont pas réécrits ; la géométrie R1 est recalculée et la tête ovale/les autres choix neutres sont explicitement attribués. La migration ne garantit pas les anciens pixels ni les anciens ratios de régions : la preview T3-A originale reste disponible pour ceux-ci. L'export suivant est v2 et conserve la trace de migration.

Un v2 sans choix de formes, une forme inconnue, des valeurs numériques non finies, une fonction incompatible/double ou un rapport de valeurs appliquées incohérent sont rejetés sans écraser les corps courants. Les JSON T2 restent refusés : pas de conversion biologique automatique.

Déterminisme : mêmes graine, catégorie/fonction, paramètres et choix de formes donnent le même corps et les mêmes projections. Toutes les valeurs nécessaires sont exportées. La trace de migration est documentaire et ne pilote pas la morphologie.
