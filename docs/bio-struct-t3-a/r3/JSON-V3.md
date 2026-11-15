# JSON T3-A v3 — finition corporelle

Le schéma reste `microcosme.bio-struct-t3-a`, version **3** pour les corps R3. Export des paramètres P1 demandés/appliqués et corrections, catégorie/fonction, graine, formes, trace de migration et objet `appearance`. Les volumes, poils et ombres sont recalculés de manière déterministe depuis ces données, jamais sauvegardés comme coordonnées d’écran.

`appearance` contient `breastShape` (natural/round/drop pour F/T, null pour M), `pectoralDefinition`, `abdominalDefinition`, `fatVolume`, `shadowStrength`, `chestHairDensity`, `bellyHairDensity`, `pubicHairDensity`, `pubicHairShape` (none/triangle/square/rectangle selon catégorie), `hairColor` (#RRGGBB normalisé). Les nombres sont dans [0,1]. Une valeur hors intervalle, une clé inconnue, un objet v3 incomplet ou une combinaison interdite sont rejetés explicitement, sans remplacement du corps courant. Les bornes P1 continuent de produire leur rapport N2.

`generateBodyR3(seed, profile, parameters, geometryChoices, appearance)` accepte des réglages partiels et applique leurs défauts explicites. `serializeBody` exporte toujours l’objet complet. `parseBody` lit v1/v2/v3 ; `upgradeBody` réalise la migration des anciens canons vers R3. L’UI applique cette dernière étape à tout import ancien et affiche la trace. Les appels API historiques v2 gardent leur comportement R2, pour compatibilité et audit ; ils ne sont pas le chemin de rendu de l’UI R3.

Une ancienne forme de bassin ovale devient rectangle dans le corps v3, avec `migration.originalPelvisShape: "oval"`, origine/destination et politique visible. Les autres choix, paramètres, catégories, fonctions et corrections sont conservés. Une trace de migration v1 précédente est conservée dans `migration.previous`. Pour M, une ancienne valeur mammaire reste présente dans les paramètres sauvegardés mais ne génère pas de poitrine féminine R3 ; le message de migration le précise.

Les fichiers R1/R2 v2 ne sont jamais modifiés : export v3 distinct après import. La preview R2 reste disponible pour les anciens pixels. Un v3 réimporté produit le même canon et les mêmes pixels ; les générations par vue ne tirent aucun nouvel aléatoire.
