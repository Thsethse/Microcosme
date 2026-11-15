# Architecture expérimentale BIO-GEN-T2

Branche `codex/bio-gen-t2`, base main `5d33e923b1bde56de4b7c620f45fb6fa6c2f3ee8`. Uniquement nouveaux chemins T2 ; aucun changement de B1, B2, moteur ou sauvegardes.

1. `model.js` : schéma et bornes des contrôles, palettes locales, profil graphique v1, validation JSON et génération déterministe par hachage entier.
2. `geometry.js` : dérivation pure des dimensions/ancrages puis projection en commandes inspectables `{kind,x,y,w,h,color,tag,clip}`. Une description, une géométrie et une palette communes aux quatre vues. Chaque vue ne fait aucun tirage aléatoire.
3. `render.js` : rasterisation Canvas 2D entière par rectangles et lignes de pixels, formes ovales/triangulaires/composées. Pas de perspective ni d'images de personnages prédessinés. Lissage désactivé, grossissement CSS pixelisé.
4. `lab.js`, `index.html`, `lab.css` : galerie, sélection, accordéons de paramètres, palettes, quatre vues, graine, référence neutre et JSON. Pas de stockage ou de service requis ; le dossier complet s'ouvre aussi en file://.

## Proportions et raccords

La référence a une tête haute de 20 unités, un tronc de 25, un bassin de 10 et des jambes de 25 : **80 unités, soit exactement quatre têtes** avant étirements. Le calcul porte sur les dimensions corporelles, hors coiffure et contour d'un pixel. Les cinq formes de tête gardent cette hauteur ; cercle/carré commencent avec largeur 20, ovale/rectangle 16. Les étirements X/Y restent indépendants.

Bras/jambes sont rectangulaires, épaules/hanches utilisent des attaches partagées. La traverse d'épaules et le bassin assurent le raccord des formes ovales ou triangulaires. La tête triangulaire et le tronc triangulaire pointent vers le bas, un choix de projection stylisée (pas un réglage de mâchoire). Les membres suivent leurs propres longueurs ; le sol reste fixe, la tête se déplace lorsque la hauteur totale change.

Les muscles sont des rectangles de taille/intensité indépendantes par zone. Ils ne sont ni des capacités ni un modèle de matière. La poitrine est un couple de disques/ovales sans détails explicites. Les signes anatomiques sont de petits rectangles ou trait/triangle ; aucune texture réaliste. La pilosité est limitée à barbe, moustache, favoris et petite texture pubienne triangulaire. Les sept coiffures combinent calotte, frange, tempes, masse arrière ou chignon adaptées à la taille de tête.

## Référence et comparaison

`reference.png` est la copie exacte du PNG validé, depuis `docs/bio-gen-t2-reference` au commit `bce2f70d0fcd19214366861267e3857a97cae9b0`, SHA-256 `1a5b2d226f205066027e25bf930a9db6ea959ca5bfcba42f00fc5470d5c63a84`. Le titre BIO-GEN-T1 de la planche est conservé ; son usage pour T2 est explicitement validé dans la notice documentaire. L'image est consultable dans l'interface, mais n'est pas découpée ni utilisée comme personnage de rendu.

`comparison/` contient un instantané des trois fichiers nécessaires au rendu B2 de la révision `f85e584` (B2 model/render + son modèle de base B1), sans modification. Il sert seulement au panneau comparatif et ne pilote jamais un profil T2. Même graine, modèles et paramètres différents : cette comparaison montre le changement de grammaire graphique, pas la conservation d'une identité entre versions. La page B2 originale est également liée et reste indépendante.

Ressources et palettes locales, polices système ; aucune dépendance applicative distante, génétique ou physiologie simulée. Les seules écritures utilisateur sont les téléchargements JSON demandés.
