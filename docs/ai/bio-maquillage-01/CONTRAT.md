# BIO-MAQUILLAGE-01 — Maquillage et peintures faciales
Validation utilisateur : accord pour continuer après présentation détaillée. Base codex/bio-cicatrices-01 ; vérifier présence du correctif R1 c13c722 avant implémentation, suspendre si absent.
## Périmètre
Cinq familles indépendantes et combinables, tous sexes et âges. Réutiliser géométries existantes. Aucun logiciel de dessin libre, peinture corporelle, fabrication de pigments, comportement autonome, traditions, usure ou simulation biologique.
## Paramètres
Tous pourcentages 0–100 sauf indication.
Lèvres : couleur, intensité, couverture, épaisseur contour, couleur contour. Géométrie naturelle inchangée, séparation visible.
Fard paupières : couleur principale, secondaire facultative, intensité, hauteur, étendue horizontale, concentration externe. Références discret, étendu, externe, bicolore. Suivre ouverture réelle et espace sous sourcil.
Eyeliner : couleur, épaisseurs supérieure et inférieure, longueur pointe externe, inclinaison −45 à +45°, intensité. Références fin, épais, allongé, complet. Distinguer cils naturels et contour anatomique.
Fard joues : couleur, intensité, positions verticale et horizontale, étendue, diffusion. Références discret, marqué, pommettes hautes. Rendu délicat, éviter disques rouges grossiers.
Peinture faciale : éléments multiples, superposition ordonnée, miroir facultatif, position, taille, allongement, orientation, épaisseur si pertinente, couleur, intensité. Douze primitives : point, cercle, anneau, ligne, bande, triangle, losange, croissant, arc, vague, zigzag, étoile. Exemples guerrier, rituel, décoratif, festif, symbolique, asymétrique : compositions illustratives, pas de catégories culturelles codées. Réutiliser placement cutané. Documenter unités et bornes géométriques effectives.
## Palette commune exacte
Naturelles : #e7c5a9 #c89a7c #ae785e #85543d #684331 #493026 #c88e80 #ad7467
Roses et rouges : #edb3ba #d78399 #cf526f #a52f47 #79243e #a83d30 #db7452 #733447
Fantaisie : #e0b43f #dc8437 #829e4d #397e62 #4d9eab #3f649b #79549e #ac65b2
Neutres et contrastes : #fff8e9 #e5e2d9 #b7b8bd #85858e #53545e #28272d #151519 #b38b4f
32 teintes, pas de simulation métallique. Aplats et diffusion subtile pour fards, cohérence avec style existant.
## BIO-MAQUILLAGE-INV-01
Couche temporaire indépendante : anatomie naturelle, marques/cicatrices, maquillage, cheveux/pilosité (ordre conceptuel ; respecter masques anatomiques réels). Maquillage peut atténuer marques sans effacer données. Aucun recouvrement globes oculaires ou intérieur narines. Adaptation morphologique sans déplacement d'ancrage. Retrait restitue exactement rendu naturel. Compositions enregistrables et transférables entre habitants, adaptées à morphologie cible, sans modifier identité naturelle. Masquage naturel par cheveux/pilosité. BIO-INV-01 : domaines dynamiques utiles, désactivation paramètres inapplicables, valeurs latentes, pas de saturation silencieuse. Intensité zéro invisible. Préserver tous invariants précédents.
## Intégration
Atelier cinq familles, édition ajout/suppression/ordre des primitives, miroir, retrait global, sauvegarde et réapplication composition, reset local, comparaison historique. Trois tailles tête 300 px, corps 178 px, miniature 70×70. Simplification déterministe miniature si nécessaire sans altérer données. Import ancien, export/rejeu à froid, historique exact. Aucun changement jeu racine.
## Recette
T1 non-régression historique et archives. T2 lèvres et contour, géométrie intacte. T3 fard paupières et eyeliner, interactions yeux/cils/sourcils. T4 fard joues et diffusion soignée. T5 douze primitives, superposition, miroir, compositions. T6 palette 32, toutes peaux, planche artistique cinq familles et combinaisons aux trois tailles. T7 invariants, retrait exact, masquage et adaptation morphologique, domaines utiles. T8 sauvegarde/import/export, transfert entre morphologies, déterminisme et latence. T9 sexes/âges/morphologies, tactile, Node/Chromium/WebKit, tests hérités. T10 test de la preview effectivement publiée : aucune erreur JS bloquante, listes alimentées, curseurs fonctionnels, personnages rendus aux trois tailles, modules hérités et nouveau opérationnels ; vérifier ressources publiées, rapport de preuves et URL. Ne pas se limiter aux tests locaux (régression BIO-CICATRICES-01-R1).
## Livraison
Créer codex/bio-maquillage-01 depuis docs/bio-maquillage-01. Preview indépendante https://thsethse.github.io/Microcosme/preview/bio-maquillage-01/ via mécanisme habituel. PR ouverte sans fusion, rapport, planche artistique, URL publique vérifiée. Validation artistique et iPad physique réservées au porteur. Suspendre conflits avec acquis. Aucune fusion ni chantier annexe.
