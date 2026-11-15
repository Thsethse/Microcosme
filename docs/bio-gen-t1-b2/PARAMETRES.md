# Paramètres B2

32 paramètres expérimentaux. Tous bornés, pas 0,01. Aucun effet biologique ou psychologique inféré.

|Clé|Libellé|Bornes|Effet|
|---|---|---|---|
|height|Taille|0.8…1.2|Échelle corporelle|
|legRatio|Ratio jambes|0.42…0.59|Répartit tronc et jambes à hauteur égale|
|width|Largeur|0.8…1.25|Épaules et bassin|
|muscle|Volume périphérique|0…1|Épaisseur bras et mollets, sans effet fonctionnel|
|reserves|Volume central|0…1|Abdomen et bassin, sans matière simulée|
|faceRatio|Allongement visage|0.85…1.2|Rapport hauteur/largeur du crâne|
|jaw|Mâchoire|0…1|Largeur du bas du visage|
|eyeSpacing|Écart des yeux|0.8…1.2|Distance entre yeux|
|eyeShape|Ouverture yeux|0…1|Hauteur des paupières|
|nose|Nez|0…1|Largeur frontale et projection de profil|
|mouth|Bouche|0…1|Largeur et épaisseur des lèvres|
|skin|Pigmentation peau|0…1|Palette partagée|
|iris|Pigmentation iris|0…1|Iris surtout visible au portrait|
|hairColor|Pigmentation cheveux|0…1|Palette partagée|
|hairline|Implantation|0…1|Ligne frontale|
|texture|Texture cheveux|0…1|Motif des mèches|
|density|Densité cheveux|0…1|Couverture du crâne|
|asymmetry|Asymétrie|-1…1|Décalage borné yeux et épaules|
|skullShape|Rondeur crâne|0…1|Carré arrondi → ovale ; indépendant de son allongement|
|torsoShape|Rondeur torse|0…1|Transitions rectangulaires/trapézoïdales → ovales|
|pelvisShape|Rondeur bassin|0…1|Contour angulaire → rond sans déplacer les hanches|
|shoulderHip|Rapport épaules / bassin|-1…1|Élargit les épaules en réduisant le bassin, ou inversement|
|chest|Projection poitrine|0…1|Volume indépendant ; forme liée aux volumes périphériques et centraux|
|hairTop|Longueur dessus|0…1|Longueur des mèches du dessus, fraction du crâne|
|hairSides|Longueur côtés|0…1|Longueur temporale indépendante|
|hairNape|Longueur nuque|0…1|Longueur occipitale indépendante|
|hairPart|Direction / raie|-1…1|Orientation des racines ; pointes retombant par gravité|
|hairPotential|Potentiel pileux graphique|0…1|Plafond facial/corporel ; ne décrit aucune hormone|
|beard|Densité faciale|0…1|Moustache, barbe et favoris sans lien au genre|
|bodyHair|Densité corporelle|0…1|Torse, abdomen, bras, jambes, aisselles et pubis stylisé|
|hairSpread|Distribution centrale / diffuse|0…1|Répartit le même budget de densité entre zones|
|grooming|Entretien / longueur tondue|0…1|Raccourcit les poils visibles sans changer le potentiel|

## Migration v1 → v2

Les 18 valeurs v1 sont validées et conservées exactement. Les nouveaux champs prennent les valeurs fixes suivantes (aucun hasard dans la migration) :

- skullShape : 0.6
- torsoShape : 0.5
- pelvisShape : 0.6
- shoulderHip : 0
- chest : 0.25
- hairTop : 0.3
- hairSides : 0.25
- hairNape : 0.25
- hairPart : 0
- hairPotential : 0.5
- beard : 0
- bodyHair : 0.2
- hairSpread : 0.5
- grooming : 0.2

Les exports sont toujours v2. Le rendu évolue intentionnellement ; la compatibilité v1 garantit les valeurs de profil et la référence B1 côte à côte, pas des pixels B2 identiques à B1. Les v2 incomplets, hors bornes ou non finis sont rejetés sans modifier le profil sélectionné. La graine d’un nouveau profil B2 conserve les 18 valeurs obtenues par B1 ; les 14 nouvelles valeurs utilisent un flux de hachage séparé.
