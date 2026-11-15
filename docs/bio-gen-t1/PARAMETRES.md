# Paramètres graphiques expérimentaux

Valeurs réelles, pas de biologie canonique ; pas de fonctions reproductives ou psychologiques inférées. Les volumes sont purement graphiques.

| Clé | Libellé | Bornes (pas 0,01) | Effet |
|---|---|---|---|
| height | Taille | 0.8…1.2 | Échelle corporelle |
| legRatio | Ratio jambes | 0.42…0.59 | Répartit tronc et jambes à hauteur égale |
| width | Largeur | 0.8…1.25 | Épaules et bassin |
| muscle | Volume périphérique | 0…1 | Épaisseur bras et mollets, sans effet fonctionnel |
| reserves | Volume central | 0…1 | Abdomen et bassin, sans matière simulée |
| faceRatio | Allongement visage | 0.85…1.2 | Rapport hauteur/largeur du crâne |
| jaw | Mâchoire | 0…1 | Largeur du bas du visage |
| eyeSpacing | Écart des yeux | 0.8…1.2 | Distance entre yeux |
| eyeShape | Ouverture yeux | 0…1 | Hauteur des paupières |
| nose | Nez | 0…1 | Largeur frontale et projection de profil |
| mouth | Bouche | 0…1 | Largeur et épaisseur des lèvres |
| skin | Pigmentation peau | 0…1 | Palette partagée |
| iris | Pigmentation iris | 0…1 | Iris surtout visible au portrait |
| hairColor | Pigmentation cheveux | 0…1 | Palette partagée |
| hairline | Implantation | 0…1 | Ligne frontale |
| texture | Texture cheveux | 0…1 | Motif des mèches |
| density | Densité cheveux | 0…1 | Couverture du crâne |
| asymmetry | Asymétrie | -1…1 | Décalage borné yeux et épaules |

Les bras sont proportionnels au tronc (0,93), les mains au volume périphérique, les pieds à la largeur ; aucun curseur supplémentaire ne les rend indépendants. Les iris, textures et asymétries subissent une quantification sur les petits sprites. Les mêmes données alimentent toutes les vues ; aucune variation aléatoire propre au rendu.
