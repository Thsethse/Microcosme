# BIO-YEUX-01 — Contrat de réalisation : formes des yeux
Validé par le porteur du projet le 24 novembre 2026. Lot graphique indépendant, sans intégration au jeu ni fusion.

## Base et invariants
Partir de codex/bio-col-01 (PR #45), préserver intégralement les acquis corps, visages, cheveux et palettes. Réutiliser le générateur SVG et ses ancrages. Vue frontale uniquement. Ne modifier ni contours de tête, ni morphologies, ni positions des yeux, du nez, de la bouche, ni coiffures. Sans activation du nouveau lot, rendu historique strictement identique. Aucun accessoire. Ne pas modifier les iris, pupilles, cils, couleurs ou paupières détaillées existants ; leur masquage doit suivre la nouvelle ouverture. Aucun changement de simulation.

## Référence artistique
Le porteur du projet déposera dans ce dossier BIO-YEUX-01.png. Consulter cette planche avant implémentation ; si absente, signaler le blocage. Elle illustre les intentions, pas un asset à découper ni une source de coordonnées. Le présent contrat prime sur toute ambiguïté graphique.

## Huit préréglages
Rond (courbes prononcées), ovale (allongé équilibré), amande (coins effilés), étroit (faible ouverture), relevé (coin externe plus haut), tombant (coin externe plus bas), paupière lourde (courbe supérieure aplatie), demi-lune (courbe supérieure bombée, inférieure presque droite). Produire par une construction vectorielle commune paramétrable, pas huit images. Préserver un préréglage historique exact distinct. Les préréglages initialisent les curseurs ; combinaisons possibles sous contraintes.

## Paramètres et bornes validées
Les dimensions de l'œil historique propre à chaque visage constituent 100 %. Définir et documenter la mesure des courbures, de l'ouverture et des sommets ; les paramètres doivent avoir des effets lisibles et non redondants.
| Paramètre | Min | Max |
|---|---:|---:|
| Largeur | 75 % | 120 % |
| Hauteur d'ouverture | 40 % | 130 % |
| Courbure supérieure | 50 % | 150 % |
| Courbure inférieure | 30 % | 140 % |
| Inclinaison | -12° | +12° |
| Effilement des coins | Arrondi | Pointu |
| Décalage sommet supérieur | -20 % largeur | +20 % largeur |
| Décalage sommet inférieur | -20 % largeur | +20 % largeur |
| Déplacement centre | 0 | 0 |

Inclinaison et décalages définis en coordonnées anatomiques locales, miroir gauche/droite. Symétrie par défaut ; asymétrie personnalisable reportée. Les huit curseurs excluent le centre, verrouillé.

## Enveloppes et contraintes conjointes
Calculer une enveloppe par œil à partir du contour réel et des ancrages historiques. Largeur maximale 25 % de la largeur faciale au niveau des yeux ; hauteur maximale 12 % de la hauteur faciale ; rapport hauteur/largeur maximal 0,85. Mesurer l'étendue réelle du tracé incliné, trait inclus. Aucun débordement du visage, aucune intersection entre yeux ou avec le nez ; préserver la lisibilité et les marges vis-à-vis des autres éléments existants. Ne pas déplacer les ancrages pour résoudre une collision. Réduire automatiquement les amplitudes incompatibles ; ne pas se contenter de rogner un contour disgracieux. Si le visage historique dépasse un plafond, le préserver exactement et documenter une exception locale minimale, sans aggraver ce dépassement. Les limites conjointes priment sur les curseurs. Afficher les valeurs effectives si correction. Iris et pupille masqués par le tracé de l'ouverture ; pas de changement de leur géométrie propre. Pas de recouvrement ajouté sur les cheveux ; conserver l'ordre des couches historique.
Génération déterministe à paramètres identiques, aléatoire reproductible par graine, uniquement dans l'espace admissible. Pas de catalogue raster ni dépendance nouvelle injustifiée.

## Preview indépendante
Créer une branche d'implémentation issue de cette branche documentaire. Publier une preview indépendante dans le dépôt habituel, accessible sur iPad Safari par URL GitHub Pages (cible preview/bio-yeux-01/). Ne pas remplacer les previews existantes. Interface : sélection des huit formes + historique, huit curseurs, randomisation des yeux uniquement, réinitialisation exacte des yeux, sélection des visages/morphologies/coiffures existants, trois échelles historiques (tête 300 px, corps 178 px, miniature 70×70), comparaison avant/après et affichage optionnel des enveloppes. Conserver les contrôles hérités utiles.

## Recette obligatoire
- T1 : non-régression du rendu historique, y compris corps, cheveux et palettes ; comparaison déterministe avant/après, contrôles et tests hérités.
- T2 : huit préréglages distincts, reconnaissables, sans assets raster.
- T3 : huit paramètres effectifs, ancrages immuables, symétrie miroir.
- T4 : bornes individuelles et contraintes conjointes, tracés valides sans auto-intersection, y compris combinaisons extrêmes (256 coins du domaine numérique normalisé, plus échantillons intérieurs).
- T5 : tester sur toutes les formes de visage existantes et morphologies disponibles, y compris extrêmes ; vérifier contour, nez, séparation, masquage, exceptions historiques.
- T6 : randomisation reproductible, sans modification des autres attributs.
- T7 : réinitialisation exacte, aucun effet de bord sur les contrôles historiques.
- T8 : lisibilité aux trois échelles ; comparaison visuelle des huit formes et extrêmes.
- T9 : tests Node et navigateur Chromium/WebKit, interactions tactiles et absence d'erreurs ; exécuter la suite héritée.
- T10 : fournir URL réellement accessible, rapport des tests, limites/écarts, fichiers modifiés et captures comparatives. Validation artistique et essai iPad physique réservés au porteur du projet ; ne pas les déclarer acquis automatiquement.

## Livraison
PR de code ouverte sans fusion, rapport et lien preview. Aucune intégration au jeu, aucune fusion dans main ou dans les branches historiques. Ne pas entamer les iris, pupilles, cils, paupières détaillées, cernes, sourcils, maquillage ou asymétries avant validation explicite du lot.
