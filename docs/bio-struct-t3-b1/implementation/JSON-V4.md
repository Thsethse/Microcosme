# JSON v4 — visage B1 sur corps R3

Schéma conservé `microcosme.bio-struct-t3-a`, version **4**. Paramètres corporels demandés/appliqués, corrections, catégorie/fonction, graine, morphologies et `appearance` R3 sont conservés. Ajout de `requestedFaceSettings`, `faceSettings`, `faceCorrections` ; les ancrages, sommets et commandes sont recalculés de manière déterministe, jamais sauvegardés comme coordonnées d’écran.

Réglages faciaux : `eyeShape`, `eyeSize`, `irisColor`, `browShape`, `browColor`, `mouthShape`, `lipColor`, `lashes`. Couleurs hexadécimales normalisées ; les choix de familles sont validés. Seule la taille finie des yeux est limitée à [0.5,1.5], avec valeur demandée/appliquée/motif N2 explicite. NaN, valeurs non numériques, choix inconnus et rapports incompatibles sont rejetés sans remplacer le corps courant.

`generateBodyB1(seed, profile, parameters, geometryChoices, appearance, faceInput)` accepte des entrées partielles et donne leurs défauts explicites. L’export v4 est complet ; l’import v4 vérifie les demandes, valeurs appliquées et rapports. Les autres fonctions corporelles de R3 restent disponibles pour compatibilité et audit du corps ; l’UI B1 utilise exclusivement la génération B1.

Import utilisateur v1/v2/v3 : migration vers v4, signalée dans l’UI, sans conversion de catégorie/fonction. `triangle`, `invertedTriangle`, `diamond` deviennent `round` ; `migration.originalHeadShape` garde l’ancien choix, `migration.previous` les traces R3 antérieures. Un ancien bassin ovale suit toujours son fallback R3 vers rectangle, avec l’ancienne valeur tracée. Les données corporelles reconnues sont conservées ; les nouveaux traits reçoivent les défauts B1 documentés. Aucune conversion automatique T2.

Un v4 ne peut pas réintroduire une tête obsolète. Un v4 exporté/réimporté redonne le même canon et les mêmes pixels. Pour retrouver les anciens pixels de tête/visage, ouvrir la preview R3 conservée ; les fichiers historiques eux-mêmes ne sont jamais modifiés. Aucun choix nouveau de cheveux ou de pilosité faciale n’est ajouté.
