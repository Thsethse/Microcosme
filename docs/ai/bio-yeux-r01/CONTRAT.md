# BIO-YEUX-R01 — Contour naturel des yeux
Base : codex/bio-maquillage-01, preview validée par le porteur. Correctif artistique uniquement.
## Objectif
Supprimer l'effet eyeliner automatique des yeux non maquillés, sans supprimer toute définition anatomique.
- Contour inférieur très fin, couleur dérivée de la peau.
- Contour supérieur discret, légèrement plus sombre que l'inférieur.
- Conserver le système des cils naturels, iris, pupilles, paupières, géométrie et ancrages.
- Eyeliner noir ou coloré indépendant, uniquement selon les paramètres de maquillage.
- Aucun nouveau paramètre utilisateur. Aucun changement des données anatomiques ou du format de sauvegarde.
- Ajuster les contrastes selon la peau et la lisibilité aux trois échelles existantes. Ne pas imposer de valeurs chromatiques arbitraires identiques à toutes les peaux.
## Recette
Identifier le contour anatomique distinct des cils et de l'eyeliner avant intervention. Comparaison avant/après à données identiques, yeux naturels et maquillés, plusieurs formes et teintes de peau, trois échelles. Vérifier que les cils gardent leur comportement, que le retrait du maquillage restitue le nouveau rendu naturel, que les autres modules restent inchangés. Respecter BIO-INV-01 et invariants existants. Exécuter tests hérités, Chromium/WebKit et smoke test de la preview publique réellement publiée (initialisation, contrôles et rendu).
## Livraison
Branche codex/bio-yeux-r01 depuis docs/bio-yeux-r01. Preview indépendante https://thsethse.github.io/Microcosme/preview/bio-yeux-r01/ selon mécanisme habituel. PR ouverte sans fusion, rapport et comparatifs visuels, URL vérifiée. Validation finale sur iPad par le porteur. Aucun chantier annexe ni intégration au jeu.
