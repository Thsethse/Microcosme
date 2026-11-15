# B2 — matrice avant implémentation

Les 18 paramètres B1 restent inchangés en noms, bornes et valeurs pour une même graine. Les nouvelles propriétés sont expérimentales, sans catégorie de genre ni biologie canonique. Choix : v2 explicite, migration v1 conservant les 18 valeurs et complétant des valeurs neutres fixes. L'ancien rendu reste embarqué comme référence B1, jamais comme moteur du jeu.

| Exigence | Paramètres existants réutilisés | Dérivation | Ajout nécessaire et indépendance |
|---|---|---|---|
| Crâne rond/ovale/carré/rectangle | faceRatio | Rapport largeur/hauteur | skullShape : rondeur indépendante du rapport |
| Mâchoire triangulaire/trapézoïdale/carrée | jaw, faceRatio | Contour inférieur continu | Aucun |
| Torse et bassin, transitions de formes | width, muscle, reserves | Contour interpolé, attaches partagées | torsoShape, pelvisShape : rondeur locale indépendante des volumes |
| Membres continus, mains et pieds | muscle, reserves, legRatio, height | Segments effilés, articulations communes, rondeur dérivée du volume | Aucun |
| Rapport épaules/bassin | width | Largeurs opposées bornées | shoulderHip : proportions indépendantes de la largeur totale |
| Volume et forme poitrine | reserves, muscle | Forme/aplatissement dérivés des volumes | chest : projection indépendante du bassin et de la pilosité |
| Visage et mâchoire | six paramètres faciaux existants | Contours et repères partagés entre vues | Aucun autre |
| Implantation, densité, texture, volume cheveux | hairline, density, texture, hairColor | Volume lié à densité, longueur et texture | Aucun pour ces propriétés |
| Longueur et répartition par zones | Aucun | Longueurs en unités du crâne, gravité vers le bas | hairTop, hairSides, hairNape : trois zones indépendantes pour distinguer coupe courte, dégradé, carré, nuque longue |
| Direction et tombé | Aucun | Raie, tangente puis gravité | hairPart : direction indépendante de la texture ; dégradé dérivé des écarts entre longueurs, pas de curseur redondant |
| Potentiel de pilosité | Aucun | Plafond graphique, aucune hormone/fonction inférée | hairPotential : distinct de densité demandée et entretien |
| Densité faciale et corporelle | hairColor (pigment seulement) | Moustache/barbe/favoris, torse/abdomen/membres/aisselles/pubis selon cartes de zones | beard, bodyHair : densités indépendantes du scalp et l'une de l'autre |
| Distribution régionale | Aucun | Interpolation de cartes continues, mêmes coordonnées dans les vues | hairSpread : distribution centrale/périphérique indépendante de densité totale |
| Entretien | Aucun | Réduction de la longueur visible sans modifier le potentiel | grooming : potentiel/densité conservés lors de la taille |
| Corps non habillé, non explicite | Tous paramètres corporels | Palette peau sur tout le corps, poitrine sans mamelons, bassin lisse sans organes génitaux | Aucun |
| Comparaison avant/après | 18 valeurs B1 | Projection ancienne conservée, même graine et mêmes 18 valeurs actuelles | Aucun paramètre |

Total : **18 existants + 14 nouveaux = 32 paramètres**. Ajouts : trois formes, proportions épaules/bassin, poitrine, trois longueurs capillaires, direction, potentiel, deux densités pileuses, distribution et entretien. Les exemples sont des configurations de curseurs, pas des personnages prédessinés. Les qualificatifs de formes ne deviennent pas des catégories stockées ; interpolation continue, quantification aux pixels seulement au rendu.
