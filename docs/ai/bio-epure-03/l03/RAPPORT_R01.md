# BIO-EPURE-03-L03-R01 — Hauteur des sourcils

Le **nouveau 50 % reproduit exactement l’ancien 6 %**. Le prototype transmet la valeur historique `6` au moteur, avec les mêmes entrées pour tout le reste. Le résultat est identique, y compris lorsqu’une contrainte remonte le sourcil au-dessus de la position demandée. Le balayage de 1 404 configurations révèle que, dans 756 cas, cette image à conserver est déjà à la limite basse. Le nouveau 0–50 % y reste visuellement constant. Dans les 648 autres cas, on dispose d’une descente de 0,027 à 0,623 unité SVG.

La proposition conserve le bas admissible propre à chaque profil et limite le haut à une remontée maximale de 5 % du rayon vertical du crâne, dans les limites du solveur. Cette borne haute est une hypothèse à examiner visuellement sur iPad. Les conclusions R01 portent sur l’étude comparative. [Planche publique](https://thsethse.github.io/Microcosme/preview/bio-epure-03-l03-r01/) · [PR brouillon nº 82](https://github.com/Thsethse/Microcosme/pull/82)

## Base et périmètre

La branche de travail a été créée à la tête documentaire `41c846b8bed3be9fb95483844eac22896904107a` de `docs/bio-epure-03-l03`. Les deux commits au-dessus de `3dbc27e4930edb92ef38f2851acf94e11c7a1e31` sont documentaires. Cette dernière révision est la tête du lot 02 déclaré validé sur iPad dans le contrat, issue de la PR nº 81. Le prototype, sa compilation et ses tests résident sous `preview/bio-epure-03-l03-r01/`. Il appelle les modules de rendu et de résolution existants à travers une page distincte, sans connexion aux commandes ou au stockage de l’éditeur. Le périmètre de la PR couvre les fichiers du prototype et ce rapport. [Contrat maître](../CONTRAT_MAITRE.md) · [Contrat du lot 03](../CONTRAT_LOT_03.md) · [Mission R01](../MISSION_LOT_03_R01.md) · [Rapport du lot 02](../l02/RAPPORT.md) · [PR nº 81](https://github.com/Thsethse/Microcosme/pull/81)

Les commandes et dépendances ont été vérifiées dans l’inventaire C4, C.forme et C.sourcil et dans la carte BIO-EPURE-01. En plus de la hauteur, le profil a huit axes géométriques distincts. L’étude garde aussi le pigment, les préréglages, les modes historique et absent, les marques du sourcil, le pipeline du visage et l’enveloppe oculaire. Les décisions A02 à A05 et l’implémentation définitive d’A01 relèvent du contrat R02. [Inventaire](../../bio-epure-01-r01/INVENTAIRE.md) · [Dépendances](../../bio-epure-01-r01/DEPENDANCES.md) · [Code du prototype](../../../../preview/bio-epure-03-l03-r01)

## Comment le moteur place le sourcil

- Le calcul part des ancrages de l’arcade. En y SVG, l’enveloppe du sourcil s’étend de `frame.top = y_arcade_droite − 0,34 × ry` à `frame.bottom = min(haut de l’ouverture, hauts des enveloppes oculaires) − 0,48`. L’ouverture provient des chemins oculaires procéduraux ou du repère historique issu des enveloppes et de la hauteur de référence. La largeur disponible suit le contour du visage sur cette bande, avec une réserve de 2,35 unités SVG. Les détails oculaires partagent cette enveloppe. Une coiffure peut masquer le dessin sans déplacer les bornes.
- Le profil local dépend de la longueur, de l’épaisseur, de l’arc, de la position du sommet, de l’inclinaison, de l’angularité, de l’affinement de la pointe et de l’écartement. Le solveur réduit d’abord l’écartement et la longueur si la largeur l’exige. Si la plage verticale est vide, il récupère l’épaisseur, l’arc puis l’inclinaison à partir d’un profil admissible. Cela fixe la forme avant le bornage de la hauteur. Le calcul des extrêmes tient compte des échantillons du contour, du sommet et des bords de la fente s’il y en a une.
- Avec `base0 = frame.bottom − 0,14` et `course = 0,20 × ry`, le dessin applique `y = base0 − course × h_effective / 100 + y_local`. L’intervalle effectif est `[L, U]` avec `L = max(0, 100 × (base0 + y_local_bas − frame.bottom) / course)` et `U = min(100, 100 × (base0 + y_local_haut − frame.top) / course)`. À profil fixé, modifier la hauteur translate le tracé verticalement. Une demande à 6 % peut donc avoir une hauteur effective supérieure à 6.
- Le réglage de référence de `normalizeBrows({})` vaut 50 % sur l’échelle historique. Le **6 % demandé** est le repère graphique du contrat. La planche le distingue du préréglage de référence et affiche les valeurs effectives anciennes sous chaque SVG. [Solveur des sourcils](../../../../bio-yeux-01/brows.mjs) · [Ouverture des yeux](../../../../bio-yeux-01/eyes.mjs) · [Profil de rendu](../../../../bio-yeux-01/render-profile.mjs)

## Bornes proposées

Pour des entrées données, le prototype obtient `L = effet(ancien 0)`, `A = effet(ancien 6)`, `U = effet(ancien 100)`, puis propose `B = min(U, A + 25)`. Les valeurs intermédiaires interpolent la **position effective** entre ces points. La demande historique émise à 50 est toujours 6, ce qui laisse au solveur le même travail qu’à l’origine.

| Nouveau % | Demande émise sur l’échelle historique | Effet sur l’échelle historique |
| ---: | --- | --- |
| 0 | `L` | `L`, point le plus bas admissible |
| 25 | `(L + A) / 2` | Mi-course entre la limite basse et le repère |
| 50 | `6` exactement | `A`, résultat de l’ancien 6 % |
| 75 | `(A + B) / 2` | Mi-course entre le repère et le haut proposé |
| 100 | `B` | `B`, le plus bas des deux plafonds `U` et `A + 25` |

Comme `L ≤ A ≤ B ≤ U`, la position graphique progresse sans inversion. Dans un plateau, par exemple quand `A = L > 6`, la demande historique à 50 peut être numériquement inférieure à celles autour d’elle. Le solveur donne la même position effective dans tous ces cas. La moitié basse utilise la course admissible mesurée. Elle évite d’étaler les anciennes demandes 0–6 sur 50 graduations quand certaines sont déjà écrasées par le solveur.

La borne haute de +25 points historiques donne une translation de `0,25 × 0,20 × ry = 0,05 × ry`. Elle suit la taille du crâne au lieu d’imposer un nombre fixe d’unités SVG. Elle offre **1,936 à 2,596 unités SVG** dans l’échantillon, contre **4,142 à 9,761** si le nouveau 100 % reprenait l’ancien haut admissible. Dans les témoins non saturés, le maximum proposé équivaut à l’ancien 31. Dans les témoins saturés, le plafond avance avec le repère effectif et la remontée reste de même ordre de grandeur. L’ancien 25, l’ancien 50 et l’ancien 100 de la planche donnent trois repères pour juger cette amplitude. Le plafond anatomique `U` resterait prioritaire sur des profils plus contraints. Le seuil de 5 % est une hypothèse graphique R01. [Transformation expérimentale](../../../../preview/bio-epure-03-l03-r01/study.mjs)

Avec le même tracé au centre et la même enveloppe, une descente perceptible sur toute la moitié basse est impossible lorsque `A = L`. Les points les plus bas touchent alors la limite verticale du tracé à la précision du SVG. Sur les 108 profils où `L = 0`, sortir de l’échelle historique ne gagnerait au plus que 0,14 unité SVG sous l’ancien 0, selon la distance du tracé à l’enveloppe. Cette possibilité ne résout pas les plateaux à la limite anatomique. R01 conserve ces plateaux et les indique sur la planche. Une exigence de course basse perceptible partout nécessiterait de revoir le repère exact ou l’enveloppe, ce qui changerait une contrainte de l’étude.

## Planche et mesures

La planche est calculée par `renderView` et `solveBrows` avec le moteur de Microcosme. Pour chaque témoin, les treize cartes affichent la paire ancien 6 / nouveau 50, les six valeurs historiques 0, 6, 25, 50, 75, 100, puis les cinq valeurs proposées 0, 25, 50, 75, 100. Le cadrage commute entre un gros plan des yeux et sourcils et le visage entier. Les entrées diffèrent uniquement par la hauteur dans une configuration donnée. Chaque carte indique la position effective et l’écart signé au repère. Les deux cartes centrales ont la même échelle visuelle. [Planche publique](https://thsethse.github.io/Microcosme/preview/bio-epure-03-l03-r01/)

Le balayage croise 2 bases adultes, 6 morphologies, 9 configurations oculaires (historique et 8 presets) et 13 profils de sourcils (référence normalisée, 9 presets et 3 variantes). Il est déterministe. Les bases H/F sont représentées pour la recette de l’atelier et partagent le solveur frontal. Les effectifs décrivent cette grille, dont le visage est dégagé pour lire l’enveloppe, et ne constituent pas une fréquence dans une population. Sur la grille, `A` s’étend de 6 à 50,459 et le plafond anatomique `U` ne réduit jamais la remontée proposée de 25 points. [Témoins et grille](../../../../preview/bio-epure-03-l03-r01/cases.mjs) · [Mesures reproductibles](../../../../preview/bio-epure-03-l03-r01/measure.mjs)

| Témoin | L | A | U | B | Descente depuis A (u. SVG) | Remontée depuis A (u. SVG) |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| H neutre · yeux historiques · référence | 5,633 | 6 | 100 | 31 | 0,032 | 2,200 |
| F neutre · yeux ronds · arrondis, avec coiffure | 1,889 | 6 | 100 | 31 | 0,362 | 2,200 |
| H allongé · yeux relevés · ascendants | 4,317 | 6 | 100 | 31 | 0,172 | 2,552 |
| F large · yeux lourds · épais | 20,104 | 20,104 | 100 | 45,104 | 0 | 2,090 |
| F cas iPad combiné · amande · en S | 28,422 | 28,422 | 100 | 53,422 | 0 | 2,596 |
| H maxima · yeux tombants · descendants | 41,190 | 41,190 | 100 | 66,190 | 0 | 2,596 |
| F minima · croissant · épais et fendu | 21,956 | 21,956 | 100 | 46,956 | 0 | 1,936 |
| H neutre · yeux étroits · aminci et relevé | 0 | 6 | 100 | 31 | 0,528 | 2,200 |
| F large · ovale · arrondi, joint et fendu | 6,894 | 6,894 | 100 | 31,894 | 0 | 2,090 |

Les presets Droits, Descendants, En S, Épais et Courts sont saturés en bas dans les 108 configurations chacun. Les Arrondis, Anguleux, Effilés et la variante amincie/relevée y gardent tous une course basse. Les autres profils dépendent de la morphologie et des yeux. L’écart de 0,032 unité du témoin H neutre peut passer inaperçu sur écran même en gros plan. Le témoin aminci est plus utile pour juger la moitié basse et le témoin En S montre à quoi ressemble un plateau exact.

## Compatibilité et hypothèse de migration

| Donnée existante | Lecture et préservation proposées pour une mise en œuvre ultérieure |
| --- | --- |
| Apparence v1 à v3 | Absence du bloc sourcils. Conserver le rendu historique déclenché par cette absence. |
| Apparence v4 et suivantes | Conserver `brows.requested.height` en échelle historique avec sa précision. Le bloc actif contient également l’effectif calculé et le pigment. Le parseur actuel recalcule et vérifie la cohérence de ces valeurs. Au réexport sans modification, le document et son rendu doivent rester identiques. |
| Mode historique et profil masqué | `mode: historical` peut transporter un `latent.height` même sans sourcil procédural actif. Avec `absent: true` le profil reste demandé et sa hauteur effective est `null`. Conserver la demande au moment du masquage et la réutiliser lors de la réactivation, en laissant le solveur l’ajuster au contexte présent. |
| Archive atelier et mémoires H/F | L’atelier v1 encapsule l’apparence active, un profil de rendu, les réglages corporels des bases inactives et, dans certains cas, la source historique. La hauteur des sourcils appartient à l’apparence. Conserver la demande ainsi que les mémoires corporelles H/F et le profil de rendu. Au changement de morphologie ou d’yeux, recalculer le contexte sans remplacer la demande historique. |
| Résident v1 | Le canon `biology.face.brows` est facultatif et stocke la demande normalisée. La projection utilise ce canon et le profil de rendu existant. Préserver la représentation en portrait, pion et vignette. |
| Références et préréglages | Conserver les neuf vecteurs historiques, dont les valeurs explicites Ascendants 40, Descendants 72, En S 58, Épais 64. Les cinq autres prennent la valeur de référence historique 50. Une référence initiale à l’ancien 6 est une décision distincte d’une conversion des préréglages. |
| Tirages versionnés | Conserver la graine, `brows-xoshiro128ss-v1` et les valeurs demandées, actives ou latentes. Le tirage filtre successivement les axes et choisit la hauteur sur la grille admissible entière historique. Changer les grilles ou l’ordre des choix compromet la reproduction. Une future distribution révisée aurait son propre identifiant. |

Pour une mise en œuvre ultérieure, la solution compatible la plus simple est de garder la demande historique comme valeur canonique et d’interpréter la nouvelle échelle à l’édition seulement. Pour un ancien profil, afficher éventuellement l’équivalent dans le contexte courant et conserver la demande en mémoire. Une valeur effective dans la nouvelle plage ne suffit pas pour reconstruire la demande historique. Si plusieurs demandes ont le même dessin à cause du solveur, afficher cette saturation et garder les chiffres d’origine. Réserver l’indication exacte « 50 % » au repère graphique, avec mention de l’ancienne demande si elle diffère de 6. Les autres points de la moitié basse d’un plateau n’admettent pas d’inverse unique.

Une ancienne hauteur peut dépasser le haut proposé, par exemple une demande de 94,875 qui reste effective au-dessus de `B`. Sous la nouvelle limite basse, les demandes anciennes peuvent se retrouver dans un plateau de la plage admissible pour un contexte et réapparaître quand le profil change. L’interface d’édition pourrait afficher « hors plage proposée » pour un tracé visible au-delà de la borne, ou « demande historique saturée » pour une demande bloquée par le solveur. À l’ouverture, au changement d’un autre axe et au réexport sans édition de hauteur, le rendu et le canon historiques restent ceux du solveur existant. Si l’utilisateur actionne la hauteur, convertir uniquement cette édition selon la transformation retenue et enregistrer la demande correspondant à cette action. Si un futur format doit stocker une valeur nouvelle directement, ajouter un discriminant d’échelle ou une version et conserver la demande historique pour les états hérités. La migration des données existantes n’est pas exécutée dans R01. [Apparence](../../../../bio-yeux-01/appearance.mjs) · [Archives atelier](../../../../bio-yeux-01/workshop-archive.mjs) · [Résident](../../../../bio-yeux-01/resident.mjs) · [Préréglages et tirages](../../../../bio-yeux-01/brows.mjs)

## Tests et publication

| Vérification | Résultat |
| --- | --- |
| Suites Node existantes `tests/`, `bio-col-01/tests/` et `bio-yeux-01/tests/` | **223 réussis, 0 échec**. Les suites couvrent notamment les SVG historiques, les contraintes anatomiques, les tirages et les imports d’archives. |
| Suite R01 | **5 réussis, 0 échec**. Égalité stricte du résultat du solveur et du SVG entier au repère sur les neuf témoins dans les deux cadrages. Progression à 21 positions sur chacun des 1 404 cas, points de tracé vérifiés aux cinq repères, conservation des formes et pigments, archives et mémoires H/F, neuf presets, deux résidents et rejeu actif ou latent de trois graines historiques. |
| Planche locale et publique | Chromium **151.0.7922.34** et WebKit **26.5** avec profil tactile iPad Mini. Les neuf contextes et deux cadrages passent sur les deux moteurs, avec une vérification des dispositions 768 × 1 024, 1 024 × 768 et 390 × 844. SVG centraux strictement égaux après normalisation des identifiants techniques propres à chaque carte. Deux cas vérifient l’affichage d’une descente mesurable et d’un plateau. |
| Non-régression de l’atelier lot 02 | Suite navigateur passée sur la distribution L02 livrée, sous Chromium et WebKit. Dans chaque moteur, 22 versions d’archives, 2 restaurations de résidents à froid, 18 planches et 10 tirages. |
| Déploiement Pages | Build **built** pour `486b91d015c5a15209bf605d94ec38fab1e50643`. Une avance directe de la source Pages `main` ajoute uniquement les quatre fichiers sous le chemin demandé. La réponse publique HTTPS de chaque fichier correspond octet pour octet à sa sortie locale. Les trois SHA-256 du manifeste ont été vérifiés par la suite navigateur contre les ressources produites par Pages, accessibles au banc d’essai via un relais HTTP local. |

Le [manifeste public](https://thsethse.github.io/Microcosme/preview/bio-epure-03-l03-r01/version.json) fixe la révision source `2e5ff87b2cea2bb69c513094d87a77ab486bc381` et le bundle `study-149e87a31a28069e.js`. Le commit du rapport vient après cette révision source. La version Safari de l’iPad physique et la perception artistique des bornes restent à vérifier dans la recette ci-dessous. Le balayage couvre les témoins et variantes décrits, avec des entrées déterministes. Il ne prétend pas épuiser l’espace continu de l’atelier.

Reproduction avec Node 24, les dépendances du projet et les navigateurs Playwright Chromium et WebKit installés.

```sh
node --test tests/*.test.js bio-col-01/tests/*.test.mjs bio-yeux-01/tests/*.test.mjs
node --test preview/bio-epure-03-l03-r01/study.test.mjs
node preview/bio-epure-03-l03-r01/measure.mjs
node preview/bio-epure-03-l03-r01/build.mjs /tmp/microcosme-l03-r01
PREVIEW_DIR=/tmp/microcosme-l03-r01 node preview/bio-epure-03-l03-r01/browser.test.cjs
```

## Parcours court sur iPad physique

1. Ouvrir la planche dans Safari en portrait. Sur **H · Neutre · Yeux historiques · Référence normalisée**, comparer ancien 6 et nouveau 50 dans **Repère commun**. Vérifier la même position par rapport aux yeux, le même contour et la même couleur. Passer à **Visage entier** et refaire la comparaison.
2. Choisir **H · Neutre · Étroit · Aminci et relevé** et revenir au **Gros plan**. Comparer le nouveau 0, le 25 et le 50. Le 0 doit être légèrement plus bas. Sur **F · Cas iPad combiné · Amande · En S**, la planche doit signaler un plateau et les trois tracés doivent se superposer visuellement.
3. Sur ces deux cas, comparer le nouveau 100 avec l’ancien 25, 50 et 100. Juger si le nouveau haut laisse une distance crédible au front, en gros plan et dans le visage entier. Vérifier en paysage que la paire centrale reste côte à côte.
4. Revoir **F neutre** (coiffure) et un témoin extrême. Relever le nom de la configuration, le cadrage et la valeur concernés si le haut paraît trop bas, trop haut, ou si un écart apparaît dans la paire centrale. La validation graphique des bornes est une décision distincte de la vérification de l’égalité. [Ouvrir la planche sur iPad](https://thsethse.github.io/Microcosme/preview/bio-epure-03-l03-r01/)
