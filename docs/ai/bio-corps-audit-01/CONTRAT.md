# BIO-CORPS-AUDIT-01
Audit uniquement. Base codex/bio-yeux-r01, identifier SHA exact. BIO-CONVERGENCE-01 global mis en attente dans la feuille de route, ne pas exécuter son contrat. Visage terminé, corps non terminé.
## Objectif
Établir l'existant réel et déterminer si une composition indépendante ossature/graisse/muscles peut réutiliser le système actuel. Ce modèle reste une hypothèse, pas une décision d'implémentation.
## Axes
A1 Inventorier morphologies réellement disponibles, noms, nombre, presets, paramètres, géométries, interpolation, génération, vues et échelles. Comparer aux anciennes décisions (dont huit morphologies de référence) sans supposer qu'elles sont toutes implémentées.
A2 Ossature : identifier paramètres structurels, largeur épaules/bassin, proportions et ancrages, indépendance de corpulence.
A3 Graisse : identifier paramètres de volume/répartition, zones, effets silhouette et ombrages, indépendance des muscles.
A4 Muscles : identifier volume et définition, zones, interactions graisse et ossature. Examiner maigreur comme résultat possible de faibles masses, sans imposer cette hypothèse.
A5 Attributs sexuels H/F/T : inventorier poitrine et zone pelvienne, restrictions et interactions morphologiques. Pas de nouvelle conception.
A6 Âges : inventorier cinq âges de référence, proportions, transformations effectivement disponibles, états discrets/interpolation, interactions avec composition et attributs. Pas de simulation biologique.
A7 Compatibilité : préserver rendu validé du visage, ancrages, cheveux, trois échelles, sauvegarde/import/export, déterminisme, BIO-INV-01. Identifier réutilisation et risques de régression.
## Rapport
Lire code réel, contrats historiques et tests. Citer chemins, symboles, lignes et SHA. Distinguer implémenté, partiel, absent, non vérifié. Inventaire exact des paramètres corporels : nom, domaine, défaut, effet, dépendances, disponibilité UI et génération. Distinguer anciennes références artistiques et implémentation actuelle. Si possible utiliser captures existantes ou tests non destructifs sans changer code. 
Comparer A conserver système actuel, B enrichir progressivement et conserver morphologies comme presets, C refondre seulement si nécessité démontrée. Pour chaque option préciser réutilisation, changements nécessaires, risques, effort relatif, impact sur visage et sauvegardes. Recommander chemin minimal et questions au porteur. Aucun arbitrage automatique.
## Livraison
Branche codex/bio-corps-audit-01 depuis docs/bio-corps-audit-01. Rapport docs/ai/bio-corps-audit-01/RAPPORT.md, PR documentaire ouverte sans fusion. Aucun code, test, donnée ou preview à modifier. Aucun développement ni correction. Attendre validation avant suite.
