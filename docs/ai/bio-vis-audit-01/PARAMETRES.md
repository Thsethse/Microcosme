# Paramètres : ce que le générateur permet réellement

Le prototype est un **catalogue de recettes fixes adaptées à la tête**, pas un produit libre « longueur × texture × frange × attache ». `style` sélectionne la recette, G/D une variante prévue. Les huit curseurs modifient la tête et recalculent ses ancrages ; ils ne remplacent pas des paramètres capillaires dédiés.

Statuts : **1** indépendant ; **2** fixé par coiffure/G-D ; **3** partiel ou couplé ; **4** absent. « Indépendant » désigne une commande du domaine considéré, pas une conséquence indirecte d’un changement de crâne.

| Propriété | Statut | Possibilités et limites vérifiées |
| --- | --- | --- |
| Longueur | **3 · couplée** | Choix de modèle/G-D et offsets fixes `end+N` ; l’étirement de la tête peut modifier le trajet apparent. Aucun curseur de longueur des cheveux. |
| Volume | **3 · couplé** | Largeur/hauteur du crâne modifient la base ; le surplus de volume et les dimensions des chignons restent codés par recette. |
| Densité apparente | **2** | Nombre de brins/rangées/lobes fixé : ex. 55 = sept/neuf rangées. L’espacement suit la tête, mais aucun paramètre de densité. |
| Texture | **2** | Lisse, ondulée, bouclée, tressée ou locks par recette. Impossible d’appliquer librement la texture locks à une coupe quelconque. |
| Implantation | **3 · couplée** | Front, tempes et crâne déplacent les ancres ; motif de calotte/masque et zones exposées restent choisis par style. |
| Frange | **2** | Présence, contour et terminaison codés ; les sourcils bornent plusieurs pointes. Pas d’ajout/retrait libre. |
| Raie | **2** | Centrale, latérale ou absente selon la recette ; pas de curseur de position ou de côté. |
| Asymétrie | **2** | Panneau, déport et orientation fixés ; pas de miroir libre gauche/droite. |
| Boucles | **2** | Amplitude, nombre de tours/lobes et trajectoires fixés, parfois répétitifs. |
| Tresses | **2** | Nombre, routes, épaisseur et attaches choisis par recette. Les primitives sont communes, mais non exposées comme réglages libres. |
| Locks | **2** | Deux arrangements de 52, cylindres et nombres de brins fixes ; pas de module sélectionnable sur toutes les coupes. |
| Attaches | **2** | Chignon, queue, couettes, couronne ou demi-attache fixés ; position liée aux ancres et constantes locales. |
| Zones rasées/courtes | **2** | Masques `top`, `right-shaved`, crête et rangées imposés par style/G-D ; recalage morphologique, sans interrupteur libre. |
| Couleur | **3** | Palettes fixes liées aux styles, monochrome commun et contraste facultatif sur 50-G/D et 62-D. Pas de teinte naturelle libre. |
| Couleur naturelle choisie indépendamment | **4** | Les neuf exemples de teinte de la planche V1 ne sont pas un sélecteur du programme. |
| Densité/texture/longueur libres combinées | **4** | Aucun schéma combinatoire ou produit cartésien de ces propriétés. |
| Orientation/profil/dos | **4** | Rendu frontal ; les schémas de profil de V1 ne sont pas des orientations programmées dans cet atelier. |

Les entrées `hairLength`, `length`, `density`, `volume`, `texture`, `fringe`, `part`, `hairColor` et `curliness` injectées dans `normalize()` ne deviennent pas des commandes reconnues. Cette vérification ne modifie aucun modèle.

## Ce qui est réellement combinable

- Style et G/D prévus, huit paramètres de tête, six corps, trois vues et affichage d’ancres.
- Monochrome ; accessoires présents/absents pour les éléments séparés ; contraste activé/désactivé dans les trois arrangements concernés.
- Tous les styles restent accessibles à tous les corps. Aucun filtre par origine, sexe, métier, croyance, statut ou personnalité.

Le catalogue P4 possède quatre palettes nommées ; trois palettes des constructions originales sont aussi héritées. Ce sont des couleurs fixées par le modèle, pas sept options naturelles indépendantes. Les aplats de contraste de 50/62 sont une autre couche de présentation.

Les formes sont déterministes : mêmes entrées, mêmes tracés. Les sinus des courbes/détails ne sont pas du hasard. Changer l’intitulé social/culturel ne change pas une géométrie. Les paramètres d’identité ne pilotent pas la disponibilité.

## Huit axes de tête conservés

| Paramètre | Minimum | Maximum |
| --- | ---: | ---: |
| Crâne : largeur | 0,86 | 1,18 |
| Crâne : hauteur | 0,88 | 1,18 |
| Front : largeur | 0,88 | 1,14 |
| Front : hauteur | 0,84 | 1,18 |
| Tempes : largeur | 0,90 | 1,16 |
| Joues : largeur | 0,88 | 1,22 |
| Bajoues | 0,75 | 1,35 |
| Mâchoire : largeur | 0,82 | 1,22 |

La forme du visage et les déplacements de ces ancres ne sont pas de nouvelles coiffures. Le protocole B compare tous les styles sur les mêmes 270 jeux de valeurs. Les familles C sont lues au neutre ; les quatre rapprochements sont aussi contrôlés sur 32 états, sans leur attribuer une égalité universelle.

## Trois échelles : différence de cadrage et omission de longueurs

Les vues P5 réutilisent les mêmes longueurs. Les 18 vues historiques ont été conservées avec leurs comportements d’origine. Dans P4, `character()` n’ajoute les longueurs que si `!headOnly`. La correction R1 les réinsère en gros plan pour **10 et 14 seulement**, et ne le fait pas en miniature.

| Référence | Entier | Tête agrandie | Miniature | Constat |
| --- | --- | --- | --- | --- |
| 06 · `mid_waves` | Longueurs présentes | Absentes | Absentes | Ondulations avant non reprises |
| 10 · `braids` | Présentes | Présentes | Absentes | Correction R1 limitée au gros plan |
| 13 · `waist_straight` | Présentes | Absentes | Absentes | Rideaux avant non repris |
| 14 · `waist_waves` | Présentes | Présentes | Absentes | Correction R1 limitée au gros plan ; pointes recadrées |
| 15 · `waist_curls` | Présentes | Absentes | Absentes | Cascades avant non reprises |
| 17 · `side_braid` | Présente | Absente | Absente | Longue natte avant non reprise |
| 18 · `asym_long` | Présente | Absente | Absente | Cascade avant non reprise |

Preuves : [planche des vues](planches/echelles.png), tableaux `scales` des [mesures Chromium](data/visual-chromium.json), fonctions `character` dans les liens de [FAMILLES](FAMILLES.md#modules-de-construction). Les nombres de chemins ne sont pas des nombres de mèches. Une coupe peut aussi avoir un arrière qui reste visible ; « longueurs absentes » signifie ici que le **calque avant** n’est pas émis, pas que tous les cheveux disparaissent.

Ce constat est rapporté **sans correction** : ce serait une modification du générateur, interdite pendant cet audit. Un ajustement éventuel de ces vues est distinct d’un chantier de nouvelles coiffures.
