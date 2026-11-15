# Paramètres graphiques T2

45 contrôles répondent aux réglages demandés : 6 formes/proportions, 4 membres, 10 accents musculaires, 6 poitrine, 5 signes/pilosité, 9 visage, 1 coiffure, 4 pigments. Ils ne sont pas des statistiques biologiques.

|Clé|Groupe|Type / bornes|Défaut|Effet|
|---|---|---|---|---|
|headShape|Formes|circle : Cercle, oval : Ovale, triangle : Triangle, square : Carré, rectangle : Rectangle|square|Forme entière, sans nez ni mâchoire détaillée|
|headX|Formes|0.75…1.25 (pas 0,01)|1|Étirement horizontal indépendant|
|headY|Formes|0.75…1.25 (pas 0,01)|1|Étirement vertical indépendant|
|bodyShape|Formes|rectangle : Rectangle, square : Carré, oval : Ovale, triangle : Triangle, composite : Composée|rectangle|Contour du tronc, raccords communs|
|bodyX|Formes|0.75…1.3 (pas 0,01)|1|Largeur du tronc et du bassin|
|bodyY|Formes|0.75…1.25 (pas 0,01)|1|Longueur du tronc seulement|
|armWidth|Membres|0.7…1.5 (pas 0,01)|1|Bras rectangulaires|
|armLength|Membres|0.75…1.2 (pas 0,01)|1|Poignets déplacés depuis les épaules|
|legWidth|Membres|0.7…1.4 (pas 0,01)|1|Jambes rectangulaires|
|legLength|Membres|0.75…1.25 (pas 0,01)|1|Pieds déplacés depuis les hanches|
|pecsSize|Musculature|0…1 (pas 0,01)|0.35|Volume carré/rectangulaire purement visuel|
|pecsInk|Musculature|0…1 (pas 0,01)|0.35|Contraste graphique indépendant de la taille|
|shouldersSize|Musculature|0…1 (pas 0,01)|0.35|Volume carré/rectangulaire purement visuel|
|shouldersInk|Musculature|0…1 (pas 0,01)|0.35|Contraste graphique indépendant de la taille|
|armsSize|Musculature|0…1 (pas 0,01)|0.35|Volume carré/rectangulaire purement visuel|
|armsInk|Musculature|0…1 (pas 0,01)|0.35|Contraste graphique indépendant de la taille|
|thighsSize|Musculature|0…1 (pas 0,01)|0.35|Volume carré/rectangulaire purement visuel|
|thighsInk|Musculature|0…1 (pas 0,01)|0.35|Contraste graphique indépendant de la taille|
|calvesSize|Musculature|0…1 (pas 0,01)|0.35|Volume carré/rectangulaire purement visuel|
|calvesInk|Musculature|0…1 (pas 0,01)|0.35|Contraste graphique indépendant de la taille|
|chestPresent|Poitrine|booléen|false|Indépendant des signes anatomiques et de la pilosité|
|chestVolume|Poitrine|0…1 (pas 0,01)|0.4|Volume d’ovales sans détail explicite|
|chestShape|Poitrine|round : Ronde, oval : Ovale|round|Rapport initial des axes|
|chestStretch|Poitrine|0.7…1.4 (pas 0,01)|1|Étirement vertical des volumes|
|chestSpacing|Poitrine|0.6…1.3 (pas 0,01)|1|Ancrages bornés au tronc|
|chestY|Poitrine|0.2…0.65 (pas 0,01)|0.4|Position dans le tronc|
|anatomyMark|Signes et pilosité|neutral : Neutre, rectangle : Rectangle, lineTriangle : Trait fin + triangle|neutral|Symbole minimal, aucune identité de genre inférée|
|beard|Signes et pilosité|0…1 (pas 0,01)|0|Couche graphique indépendante ; aucune autre zone pileuse|
|moustache|Signes et pilosité|0…1 (pas 0,01)|0|Couche graphique indépendante ; aucune autre zone pileuse|
|sideburns|Signes et pilosité|0…1 (pas 0,01)|0|Couche graphique indépendante ; aucune autre zone pileuse|
|pubicHair|Signes et pilosité|0…1 (pas 0,01)|0|Couche graphique indépendante ; aucune autre zone pileuse|
|eyeShape|Visage|circle : Cercle, oval : Ovale, triangle : Triangle, square : Carré|square|Yeux géométriques, sans nez|
|eyeSize|Visage|0.7…1.3 (pas 0,01)|1|Iris et contours adaptés à la tête|
|eyeSpacing|Visage|0.7…1.2 (pas 0,01)|1|Distance entre yeux bornée au visage|
|eyeY|Visage|0.38…0.58 (pas 0,01)|0.48|Position dans la tête|
|lashes|Visage|booléen|false|Sans catégorie de genre|
|browShape|Visage|rectangle : Rectangle, triangle : Triangle|rectangle|Formes simples|
|browSize|Visage|0.6…1.4 (pas 0,01)|1|Longueur et épaisseur|
|browTilt|Visage|-0.6…0.6 (pas 0,01)|0|Inclinaison symétrique|
|browY|Visage|0.12…0.3 (pas 0,01)|0.22|Au-dessus des yeux|
|hairStyle|Cheveux|short : Courte, medium : Mi-longue, long : Longue, bob : Carré, curly : Bouclée, tied : Attachée, shaved : Rasée|short|Bibliothèque de couches adaptée à chaque tête|
|skinColor|Palettes|#f5d3ac, #edb98d, #d99b74, #bb7e58, #925a3e, #673d2f|#f5d3ac|Pigment indépendant des autres couleurs|
|eyeColor|Palettes|#69adf0, #527536, #978048, #59371f, #824b9b, #322638|#69adf0|Pigment indépendant des autres couleurs|
|hairColor|Palettes|#f4c34e, #bd5827, #80483c, #423039, #5b4267, #efe1d1, #ad5cdb, #3d713b, #70a5d4|#f4c34e|Pigment indépendant des autres couleurs|
|furColor|Palettes|#f4c34e, #bd5827, #80483c, #423039, #5b4267, #efe1d1, #ad5cdb|#f4c34e|Pigment indépendant des autres couleurs|

## Format et reproduction

JSON `{schema:"microcosme.bio-gen-t2", version:1, seed:"…", params:{…}}`. Graine texte de 128 caractères maximum ; import 64 Ko maximum. Types, bornes et valeurs des listes sont validés, les champs inconnus ignorés ; JSON invalide refusé sans perdre le profil courant. Aucun import silencieux B1/B2 : ces formats décrivent des modèles différents.

La graine génère les paramètres. Les modifications manuelles deviennent explicites dans le JSON ; rejouer exactement nécessite **la graine et les paramètres**, pas seulement la graine initiale. Le bouton de réinitialisation depuis la graine abandonne les modifications ; « Référence · 4 têtes » rétablit les réglages neutres. La graine fixe aussi les quelques marques graphiques de pilosité et reflets, sans hasard par vue.

Le modèle ne contient ni nez, mâchoire détaillée, pommettes, force, identité de genre, orientation, fertilité ou comportement. Les signes anatomiques neutre/rectangle/trait+triangle, la poitrine, les cils, les coiffures et la pilosité sont indépendants. Les pigments sont séparés. Le contraste de certaines combinaisons choisies librement peut rester faible ; voir le rapport artistique.
