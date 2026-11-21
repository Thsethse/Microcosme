# Écarts entre les illustrations et le programme

Lecture des six planches intégrées, **108 vignettes G/D**, à partir du code et des comparaisons contrôlées. La seconde A DE895… a aussi été inspectée : variations d’ombrage/visage et détails de mèches, pas une nouvelle numérotation. E v1 est B409… ; E v2/73–81 est hors inventaire.

Codes : **S** différence structurelle correctement reproduite selon les éléments décrits ; **P** partiellement reproduite ; **R** construction existante reprise à la place d’une construction propre ; **C** différence portée par la couleur ; **A** différence portée par un objet ; **N** non évaluable (zone cachée/ambiguë). Plusieurs codes peuvent coexister. R n’implique pas automatiquement une erreur ; C/A ne sont pas de nouveaux cheveux. Ce relevé n’est pas une validation artistique automatique.

Les visages, corps, expressions, ombres, barbes, marques et lunettes de visage des sources ne sont pas des objectifs de reproduction. La préservation du visage P4 explique certaines limites de front ; elle ne doit pas être interprétée comme un défaut à contourner par modification de ce visage. Les jugements portent sur les cheveux observables.

## Planche A

[Comparaison original / programme](planches/source-A.png). Les originaux sont des extraits de la planche existante ; les rendus sont monochromes sur le même habitant, sans objets.

| Référence | G : constat | D : constat | Cause technique identifiable / limite |
| --- | --- | --- | --- |
| 19 · Raie classique | **S/R** · La vague courte G est commune à 21-G dans les deux dessins ; mutualisation cohérente. | **P** · Le carré arrondi demeure, mais la grande mèche oblique devient le même balayage court placé au-dessus du visage. | bob(false) appelle swept(2) ; pas de panneau frontal descendant propre à 19-D. |
| 20 · Dégradé court | **S** · Pointes au sommet et côtés courts différencient G de D. | **P** · Frange irrégulière présente ; mèches balayées du poster remplacées par un contour polygonal assez horizontal. | spikes(crop/swept), tableaux de points fixes ; largeur/longueur de frange bornées au-dessus des sourcils. |
| 21 · Carré moderne | **S/R** · G reprend effectivement le G de 19 ; le poster montre la même organisation générale. | **P** · La ligne basse est plus nette que 19-D, mais le grand panneau oblique reste réduit à un balayage court. | bob(true) change la terminaison des côtés, sans créer une nouvelle grande frange. |
| 22 · Ondulations souples | **P** · Retournements latéraux esquissés ; le volume frontal reste très proche de 19-G. | **S/P** · Grandes longueurs et vagues présentes ; les grosses mèches frontales/lobes de la source sont simplifiés. | swept partagé, contours latéraux locaux et ribbon à amplitude/nombre de lobes fixes. |
| 23 · Effet coiffé-décoiffé | **P** · Pointes produites, mais le grand mouvement courbe de la source devient un polygone dentelé. | **P** · Chignon et deux mèches présents ; boucles et ampleur du balayage frontal réduites. | spikes(messy) ; chignon arrière et mèches étroites paramétrés en dur. |
| 24 · Queue-de-cheval | **S/P** · Queue basse conservée ; son implantation tirée et sa pointe sont stylisées. | **R/P** · Queue haute conservée, mais le grand balayage frontal propre au dessin est remplacé par le front classique P4. | 24-D reprend pony ; différence avec 12 limitée au traitement technique du lien, pas aux cheveux. |
| 25 · Undercut | **S/P** · Côtés courts et quiff distincts ; mèches dressées réduites à quelques pointes. | **P** · Asymétrie et long panneau présents ; le panneau contourne davantage le visage au lieu de le recouvrir. | clip du côté court ; swept et panneau dont les bords respectent les repères faciaux P4. |
| 26 · Frange et mèches | **P** · Frange déchiquetée présente ; direction diagonale et grosses mèches du poster moins lisibles. | **S/P** · Frange droite et côtés longs présents ; petits lobes répétés remplacent les grandes masses libres. | spikes(fringe) ; frange P4 réutilisée et rubans à amp=4, trois lobes. |
| 27 · Boucles volumineuses | **S/P** · Boucles courtes distinctes de 08, mais couronne plus régulière et masse frontale simplifiée. | **P** · Longueur bouclée conservée ; source très large et asymétrique devenue deux rubans répétitifs. | halo de 26/22 points ; deux ribbon symétriques à quatre lobes. |

## Planche B

[Comparaison original / programme](planches/source-B.png). Les originaux sont des extraits de la planche existante ; les rendus sont monochromes sur le même habitant, sans objets.

| Référence | G : constat | D : constat | Cause technique identifiable / limite |
| --- | --- | --- | --- |
| 28 · Couronne tressée | **S** · Couronne bien capillaire, entrelacs présents sans objet ajouté. | **S/P** · Couronne et deux mèches conservées ; finesse/volume différents du poster. | Même primitive d’arc tressé ; D ajoute des tendril étroits. |
| 29 · Chignon architectural | **P** · Relèvement présent ; gros rouleaux courbes du poster deviennent un éventail compact. | **S/P** · Attache haute et deux mèches conservées ; organisation des rouleaux simplifiée. | fan(false), puis bun paramétré et tendril ; aucune liberté d’agencement des rouleaux. |
| 30 · Boucles aristocratiques | **S/P** · Boucles ouvertes et rouleaux présents, mais silhouette plus étroite et périodique. | **S/P** · Chignon sur cascade bouclée conservé ; les grands balayages du sommet restent simplifiés. | sideRolls + curls trois/quatre tours ; bun ajouté en D. |
| 31 · Coiffure de cour | **S/P** · Sommet bombé et deux rouleaux visibles ; formes plus petites que la source. | **S/P** · Chignon, rouleaux et mèches présents ; détails répétitifs. | bun 22×12 ou 23×17, sideRolls et tendril ; géométrie D ensuite copiée par 58-D. |
| 32 · Tresse royale | **S/P** · Une natte avant et racines balayées présentes ; contour de natte plus fin et régulier. | **S/P** · Couronne et deux nattes présentes ; entremêlement supérieur moins ample. | Entrelacs sur courbes de 11/17 centres, mêmes paramètres fixes pour les deux côtés. |
| 33 · Chignon ornementé | **R/A/N** · Balayage partagé et ruban de nuque ; aucune attache cachée n’est déductible de la seule illustration frontale. | **S/P/A** · Chignon latéral et mèche conservés ; fleur/chaîne amovibles n’augmentent pas la diversité des cheveux. | G appelle swept de 19 ; D bun latéral et une tendril. |
| 34 · Haut volume sophistiqué | **S/P** · Volume haut distinct, mais source ondulée traduite en un éventail plus rigide. | **S/P** · Grand balayage, cascade latérale et chignon présents ; articulation simplifiée. | fan(true) ; highSweep + cascade + bun fixes. |
| 35 · Natte et bijoux | **P/A** · Natte plus fine que 32-G ; différence avec le poster vient aussi de perles retirées pour cet audit. | **S/P/A** · Deux brins et couronne basse conservés ; les bijoux ne créent pas une géométrie. | Même branche que 32 avec thin=true : largeur 4 au lieu de 6 et autre couronne. |
| 36 · Coiffure cérémonielle | **S/P/A** · Deux longueurs et raie conservées ; source paraît plus lisse que les cascades ondulées programmées. | **S/P/A** · Structure haute à deux étages présente ; diadème séparé, hors comptage. | Deux cascade ; D bun à deux étages et sideRolls. |

## Planche C

[Comparaison original / programme](planches/source-C.png). Les originaux sont des extraits de la planche existante ; les rendus sont monochromes sur le même habitant, sans objets.

| Référence | G : constat | D : constat | Cause technique identifiable / limite |
| --- | --- | --- | --- |
| 37 · Coupe de travail | **P** · Pointes/mèche présentes ; le balayage source est morcelé en rough(work). | **S/P** · Queue basse latérale et panneau conservés ; passage derrière le corps masque une partie de l’attache. | rough + forelock ; queue inspirée de 24-G, orientée localement à gauche. |
| 38 · Cheveux en bataille | **P** · Pointes multidirectionnelles conservées, mais longues mèches courbes transformées en frange dentelée. | **S/P** · Nuque plus longue que G et frange irrégulière présentes. | rough(battle/fringe), shag de nuque en D ; G sera copié par 48/54/69. |
| 39 · Coupe rustique | **S/P** · Frange courte morcelée présente ; détails de mèches simplifiés. | **S/R** · Raie et deux nattes présentes ; suppression de la couronne de 32-D cohérente avec la source. | rough(rustic) ; D réutilise les racines/nattes de 32-D et une raie simple. |
| 40 · Longue chevelure sauvage | **S/P** · Longueur de nuque étagée conservée ; le mouvement souple est remplacé par des panneaux pointus. | **S/P** · Longues vagues et brins secondaires présents ; la masse centrale arrière du poster reste moins large. | shag(len=22), puis deux wave avec amplitudes 7/9 et fines tresses. |
| 41 · Natte de travail | **P** · Dessus tiré, côté court et natte présents ; le départ est à la nuque, mais la natte est bien peinte au premier plan. | **P/N** · Programme : une natte et une mèche libre. Fiche : deux nattes. L’illustration droite ne permet pas d’affirmer le tressage du second brin. | G tag data-attachment=rear, mais rendu dans lengths après le corps : ce tag ne change pas la profondeur. D emprunte seulement la natte de 32-G, puis loose opposée. Écart documentaire certain, lecture du second brin à arbitrer. |
| 42 · Demi-attaché naturel | **S/P** · Demi-attache et nuque libre présentes ; les grandes mèches souples deviennent shag pointus. | **S/P** · Demi-attache et longueurs ondulées présentes ; distribution plus symétrique et répétitive. | halfBun fixe + parted ; shag ou wave. |
| 43 · Cheveux ébouriffés et longs | **P** · Étagement et asymétrie présents ; proches des petits panneaux de 38-D/40-G. | **S/P** · Longues vagues dissymétriques présentes ; le frontal reste un swept réutilisé. | rough(oblique), shag(len=8) ; D deux wave déphasées + swept. |
| 44 · Coupe asymétrique simple | **S/P** · Frange oblique courte produite ; grandes mèches du poster simplifiées en dents. | **R/P** · Long panneau et côté court produits ; différence programmée avec 25-D surtout dans les petites tresses de tempe. | rough(oblique) ; D reprend panneau 25-D puis ajoute trois routes tressées. |
| 45 · Tresses sauvages | **S/P** · Brins supérieurs séparés reconnaissables, mais rangée en éventail assez régulière. | **S/P** · Couronne et brins irréguliers présents ; masses épaisses source réduites en faisceaux. | Primitive strandFactory ; trajets en éventail et nattes de longueur/largeur fixes. |

## Planche D

[Comparaison original / programme](planches/source-D.png). Les originaux sont des extraits de la planche existante ; les rendus sont monochromes sur le même habitant, sans objets.

| Référence | G : constat | D : constat | Cause technique identifiable / limite |
| --- | --- | --- | --- |
| 46 · Crête / Iroquois | **S** · Crête étroite à côtés dégagés réellement distincte des calottes pleines. | **S/P** · Éventail incliné distinct de G ; contours courbes/pointes simplifiés. | Implantation .31r/.48r et masque local, pas simple grossissement de G. |
| 47 · Côtés rasés et longue mèche | **S/P** · Undercut et mèche latérale présents, grands rouleaux source simplifiés. | **S/P** · Panneau long et tempe courte présents ; règle faciale limite sa descente frontale. | undercut(long=false/true) ; tracés obliques partagés avec 49/50. |
| 48 · Pointes ébouriffées | **R/P** · Reprise exacte de 38-G ; le poster 48-G présente de grandes mèches courbes dont l’orientation propre n’a pas de réglage. | **S/P** · Pointes rayonnantes supplémentaires et nuque présentes, frange toujours générique. | seed(38,a), puis radiating-tufts uniquement en D. |
| 49 · Coupe asymétrique extrême | **S/P** · Panneau extrême et côté court présents ; recouvrement du visage moins important que sur le poster. | **S/P** · Prolongement et grande pointe présents ; organisation du sommet partagée avec G. | undercut(extreme=true), fin locale du panneau plus longue ; borne liée aux sourcils. |
| 50 · Couleurs et mèches contrastées | **C/R** · Différence essentiellement colorée : mêmes cheveux que 47-G une fois la teinte retirée. | **S/P/C** · Grand panneau et masse arrière supplémentaire présents ; les mèches de couleur restent un calque distinct. | G identique à 47-G ; D ajoute un arrière end+44, donc n’est pas un doublon de 49-D. |
| 51 · Volume extravagant | **S/P** · Haut volume présent, mais un éventail anguleux remplace des mèches en larges rouleaux. | **S/P** · Rouleaux fermés et longues mèches présents, structure distincte de 34-D malgré parenté. | highFan et quatre closed-roll ; mèches de 31-D réutilisées. |
| 52 · Dreadlocks / Locks | **S/P** · Locks distinctes des tresses par leurs cylindres ; pointes/densité simplifiées. | **S/P** · Longs cylindres et certains relevés conservés, pas de remplacement par une natte ordinaire. | cylinder, sept/cinq départs supérieurs et deux/trois brins par côté. |
| 53 · Tresses créatives | **S/P** · Rangées plaquées et deux brins présents ; la répartition source plus organique est régularisée. | **S/P** · Asymétrie, couronne et plusieurs tresses présentes ; petit tressage temporal simplifié. | rowRoutes cinq rangées ; D couronne partielle et nattes à trajets fixes. |
| 54 · Accessoires et ornements | **R/P/A** · Lunettes/plume retirées, reste exactement 38-G ; le grand mouvement de mèches du poster n’a pas de construction propre. | **S/P/A** · Touffe haute et mèches présentes ; silhouette sans ornements distincte de 23-D. | G seed(38,G) ; D highFan+swept+sides(23,D). |

## Planche E v1

[Comparaison original / programme](planches/source-E.png). Les originaux sont des extraits de la planche existante ; les rendus sont monochromes sur le même habitant, sans objets.

| Référence | G : constat | D : constat | Cause technique identifiable / limite |
| --- | --- | --- | --- |
| 55 · Tresses africaines | **S/P** · Rangées plaquées et six retombées présentes ; densité et courbure plus espacées que dans le poster. | **S/P** · Chignon tressé et quatre brins courts présents ; masse source remplacée par deux spirales et un volume simple. | Sept/neuf rowRoutes, fineBraid ; spirales de chignon concentriques à deux échelles. |
| 56 · Chignon japonais | **S/P** · Petit chignon et racines relevées présents, front tiré simplifié. | **S/P/A** · Grand chignon, raie et deux mèches présents ; épingles séparées ne comptent pas. | smoothBun 14×10 / 23×15, pulled / parted ; tailles fixes. |
| 57 · Coiffure égyptienne | **S/P/A** · Carré rigide et frange présents, mais mèches regroupées en deux panneaux ; bijoux séparés. | **S/P/A** · Panneaux plus longs que G ; même frange et même forme générale. | Frange P4 réutilisée, côtés end+12/end+28 ; lignes verticales fixes. |
| 58 · Coiffure romaine | **R/P/A** · G reprend exactement 08 : pas de disposition de grosses boucles propre au poster 58-G ; feuilles seules ajoutées. | **R/P/A** · D reprend exactement 31-D : pas de réglage de rouleau frontal propre à 58-D. | Réutilisations explicites oldLayers(curls) et seed(31,D). La nécessité artistique d’une base différente reste une décision humaine. |
| 59 · Coiffure médiévale | **S/R** · Couronne très proche de 28-G dans la source ; mutualisation cohérente, pas une perte prouvée. | **S/P/A** · Vagues libres et raie présentes, bijou séparé ; ces wave sont celles de 42-D sans le chignon. | G seed(28,G) ; D parted + seed(42,D).lengths. |
| 60 · Coiffure nordique | **S/P** · Dessus tiré, tempe tressée et une natte présents ; grandes mèches du sommet réduites. | **R/P** · Couronne et deux nattes présentes ; différence avec 32-D limitée à deux mèches libres. | 41-G/32-G recombinés ; D cheveux 32-D + longueurs 28-D. |
| 61 · Coiffure asiatique | **S/P/A** · Chignon proche de 56-G, deux mèches ajoutées ; épingle indépendante. | **S/P/A** · Décentrage et balayage présents ; le grand rouleau source devient la mèche S déjà utilisée ailleurs. | smoothBun ; D front de 19-G et déport x+9. |
| 62 · Coiffure punk | **S/P** · Crête effectivement plus large que 46-G ; rayonnement simplifié en pointes polygonales. | **C/R** · Cheveux identiques à 49-G ; teinte rose/cuivre indépendante et facultative, donc aucune nouvelle base. | Implantation .69r en G ; copie de 49-G et calque contrast-color en D. |
| 63 · Coiffure nomade | **N/A** · Cheveux entièrement cachés : aucun type de coupe ne peut être déduit. Le support sans foulard n’est pas une coupe rasée. | **S/P** · Haute demi-attache et vagues présentes ; torsades source réduites à deux volumes lisses et rubans. | G n’émet aucun chemin capillaire ; D smoothBun doubles + wave de 42-D. |

## Planche F

[Comparaison original / programme](planches/source-F.png). Les originaux sont des extraits de la planche existante ; les rendus sont monochromes sur le même habitant, sans objets.

| Référence | G : constat | D : constat | Cause technique identifiable / limite |
| --- | --- | --- | --- |
| 64 · Coiffure de guerrier | **S/P** · Chignon central et côtés courts présents ; étagement/rouleaux du poster réduits à un petit chignon lisse. | **S/P** · Couronne, chignon et deux nattes présents ; épaisseur et entrecroisement source simplifiés. | 56-G tronqué localement ; D couronne 28-G + chignon 56-D + hanging. |
| 65 · Coiffure d’aventurier | **P/A** · Grand balayage source partiellement perdu : mèche 19-G et quelques pointes latérales, bandeau séparé. | **R/P** · Reprise 48-D pour pointes et nuque ; pas de réglage propre aux mèches de cette vignette. | G projected-tufts + 19-G ; D seed(48,D). Lunettes non importées conformément à la mission I6. |
| 66 · Coiffure de rôdeur | **P/N/A** · Frange visible conservée mais géométrie de racine sous capuche inconnue ; direction en grandes mèches simplifiée. | **S/P/N/A** · Raie et deux nattes visibles ; couronne et arrière inconnus, pas une nouvelle base complète. | Frange 26-G ou parted+hanging, limitée par un clip d’ouverture ; aucune calotte sous le tissu. |
| 67 · Coiffure de voyageur | **S/P** · Deux petites couettes réellement distinctes, mais balayage supérieur partagé avec 19-G. | **R/N/A** · Fragments connus mutualisés avec 66-D ; ouverture et foulard différents, racines cachées toujours inconnues. | Nouveaux smallTail et raccords en G ; en D même raie/nattes, clip limité à fy−6. |
| 68 · Coiffure de savant | **R/P** · Grande mèche source remplacée par 19-G sans supplément de volume/séparation des mèches. | **S/P/A** · Chignon et boucles latérales présents ; seulement le type de chignon diffère nettement de 31-D. | G seed(19,G) ; D chignon 56-D et mèches/rouleaux 31-D. Lunettes de visage exclues, pas une perte capillaire. |
| 69 · Coiffure d’alchimiste | **R/P/A** · Même construction pointue que 54-G/38-G ; accessoires ne démontrent pas une différence de cheveux. | **S/P/A** · Chignon irrégulier et mèches présents ; désordre libre remplacé par masses et courbes fixes. | G seed(54,G) ; D 23-D + irregular-bun + mèches 31-D. |
| 70 · Coiffure spirituelle | **S/R** · Chignon et côtés courts presque identiques à 64-G dans la source ; partage cohérent. | **S/P/A** · Chignon et longueurs libres présents ; parure frontale exclue du compte capillaire. | G même branche que 64-G ; D bun 56-D, parted et wave 42-D. Peinture/collier exclus. |
| 71 · Coiffure mystique | **R/P** · Longue mèche source reprise depuis 49-G ; son masquage de l’œil n’est pas reproduit, visage P4 préservé. | **S/P/A** · Haut tressage et deux brins présents ; couronne et chignon réemploient 28/55. | undercut limite la frange par brow−4,5 ; D braidedBun 55-D + couronne 28-G + deux hanging fins. |
| 72 · Coiffure héroïque | **S/P** · Natte, balayage et côté tressé présents ; grandes mèches frontales source réduites au panneau 25-D. | **S/P** · Trois étages présents ; grosses tresses imbriquées du poster deviennent arcs concentriques sur support conique. | G 60-G + 25-D + trois routes de tempe ; D crestBraid(3), parted et wave 42-D. |

## P4 et limites des sources

[Comparaison V1 / programme](planches/source-V1.png). La planche V1 couvre 01–12. 13–18 sont des explorations du prototype P4, sans case dédiée dans cette image : elles ne sont pas comparées à une illustration inventée. Les constats détaillés V1 sont :

| Référence | Constat de structure | Limite ou cause identifiable |
| --- | --- | --- |
| 01 | S · Crâne explicitement dégagé | Aucune chevelure, pas une inconnue sous tissu |
| 02 | S/P · Masse courte à pointes | Contour en points alternés et petite frange polygonale, plus dentelé que les grandes mèches arrondies |
| 03 | S/P · Sommet balayé latéralement | Front issu de classic, adapté aux repères P4 ; mouvement simplifié |
| 04 | S · Raie centrale et panneaux arrondis | Les corrections de recouvrement suivent le visage ; pas un nouveau modèle par tête |
| 05 | S · Frange droite et côtés géométriques | Bord frontal borné par les sourcils |
| 06 | S/P · Deux ondulations jusqu’aux épaules | Rubans répétitifs ; calque avant omis dans les vues headOnly |
| 07 | S/P · Rideaux lisses et masse arrière | Longueur fixe et trajectoire partagée ; pointes de gros plan recadrées |
| 08 | S/P · Couronne bouclée courte | 17 lobes et trois boucles frontales, plus réguliers que les boucles de la source |
| 09 | S/P · Boucles longues | Rubans épais et détails répétés plutôt qu’une distribution libre de grosses mèches |
| 10 | S/P · Deux tresses | Liens incorporés aux chemins historiques ; longueurs absentes de la miniature |
| 11 | S/P · Petit chignon et mèches près du visage | Volume cubique fixe, pas de réglage de position libre |
| 12 | S/P · Queue haute décentrée | Grand trajet arrière conservé ; lien incorporé et front classique réutilisé |

Les principes rasée/court/carré/frange/longueurs/boucles/nattes/chignon/queue existent réellement ; l’enveloppe corporelle des posters n’a pas été importée. Les palettes naturelles et les vues de profil/dos dessinées comme exemples sur V1 ne sont pas des commandes exécutables de l’atelier.

La plupart des posters coupent les cheveux au buste : pointes hors champ, dos et profils sont non évaluables. Les longueurs ajoutées sous le champ sont des choix de prototype, pas une mesure certaine des dessins. 63-G ne spécifie aucune coupe ; 66 et 67-D ne spécifient pas les racines sous tissu.

Point d’attention documentaire : 41-D est décrit avec deux nattes dans #33, mais le code ne dessine qu’une natte et une mèche libre. Le second brin du poster frontal est ambigu. Ne pas transformer cette contradiction en demande automatique d’inventer une natte ou de modifier le générateur.

Les différences perdues ont des causes géométriques localisées dans les recettes ; aucun motif de temps, d’intention psychologique ou de préférence du développeur n’est inventé. Lorsqu’une différence n’est pas identifiable dans la source, elle est signalée N au lieu d’être déduite d’un intitulé.
