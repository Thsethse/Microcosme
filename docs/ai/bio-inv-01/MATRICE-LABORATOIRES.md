# Matrices détaillées des laboratoires Canvas

Les valeurs indiquent le nombre de signatures de commandes par vue au pas testé. Pour T1/B2, le diagnostic enregistre les opérations Canvas du moteur. Pour T2/T3, il examine les commandes projetées. La projection de T3 élimine les volumes invisibles et les métadonnées géométriques qui ne servent pas au dessin. Ce comptage peut distinguer des instructions que le raster final recouvre. Les différences de commande ne servent donc pas à déduire une différence perceptuelle. [Méthode](REPRODUIRE.md) · [Résultats par contexte et par vue](preuves/laboratoires.json)

## BIO-GEN-T1 et B2

Face / profil / dos / portrait. Chaque axe est balayé avec les autres valeurs du profil généré par `bio-inv-b2`. Les domaines testés sont au pas 0,01. La version B2 reprend les 18 axes de T1 et en ajoute 14.

| Paramètre | Domaine | Valeurs | T1 | B2 |
| --- | --- | ---: | --- | --- |
| `height` | `0.8…1.2` | 41 | 41/41/41/1 | 41/41/41/1 |
| `legRatio` | `0.42…0.59` | 18 | 16/15/16/1 | 18/18/18/1 |
| `width` | `0.8…1.25` | 46 | 20/11/20/14 | 46/46/46/39 |
| `muscle` | `0…1` | 101 | 11/5/11/8 | 101/101/101/19 |
| `reserves` | `0…1` | 101 | 17/10/17/1 | 101/100/101/1 |
| `faceRatio` | `0.85…1.2` | 36 | 28/28/28/36 | 36/36/36/36 |
| `jaw` | `0…1` | 101 | 3/2/3/9 | 35/25/35/101 |
| `eyeSpacing` | `0.8…1.2` | 41 | 4/2/1/14 | 9/1/1/22 |
| `eyeShape` | `0…1` | 101 | 2/1/1/6 | 3/3/1/6 |
| `nose` | `0…1` | 101 | 2/3/1/6 | 2/6/1/4 |
| `mouth` | `0…1` | 101 | 4/3/1/18 | 4/4/1/13 |
| `skin` | `0…1` | 101 | 101/101/101/101 | 101/101/101/101 |
| `iris` | `0…1` | 101 | 101/101/1/101 | 101/101/1/101 |
| `hairColor` | `0…1` | 101 | 101/101/101/101 | 101/101/101/101 |
| `hairline` | `0…1` | 101 | 3/3/3/9 | 59/59/59/101 |
| `texture` | `0…1` | 101 | 2/2/1/5 | 73/70/83/101 |
| `density` | `0…1` | 101 | 8/6/14/78 | 93/93/93/97 |
| `asymmetry` | `-1…1` | 201 | 7/3/5/11 | 11/6/9/9 |
| `skullShape` | `0…1` | 101 | — | 40/26/40/101 |
| `torsoShape` | `0…1` | 101 | — | 54/33/49/1 |
| `pelvisShape` | `0…1` | 101 | — | 27/19/27/1 |
| `shoulderHip` | `-1…1` | 201 | — | 201/174/200/30 |
| `chest` | `0…1` | 101 | — | 64/57/1/1 |
| `hairTop` | `0…1` | 101 | — | 65/65/65/101 |
| `hairSides` | `0…1` | 101 | — | 52/52/52/101 |
| `hairNape` | `0…1` | 101 | — | 33/33/38/98 |
| `hairPart` | `-1…1` | 201 | — | 175/173/183/201 |
| `hairPotential` | `0…1` | 101 | — | 68/68/36/18 |
| `beard` | `0…1` | 101 | — | 20/20/1/20 |
| `bodyHair` | `0…1` | 101 | — | 32/32/19/1 |
| `hairSpread` | `0…1` | 101 | — | 28/28/17/1 |
| `grooming` | `0…1` | 101 | — | 2/2/2/6 |

## BIO-GEN-T2

Face / profil / dos / portrait. « Actif » allume les couches de poitrine, de pilosité et de cils. « Masqué » utilise la tête rasée, le sourcil triangulaire et l’encre pectorale nulle. La sortie JSON conserve la graine et tous les paramètres validés, y compris les valeurs latentes.

| Paramètre | Domaine | Valeurs | Neutre | Actif | Masqué |
| --- | --- | ---: | --- | --- | --- |
| `headShape` | `circle`, `oval`, `triangle`, `square`, `rectangle` | 5 | 5/5/5/5 | 5/5/5/5 | 5/5/5/5 |
| `headX` | `0.75…1.25` | 51 | 51/51/51/51 | 51/51/51/51 | 51/51/51/51 |
| `headY` | `0.75…1.25` | 51 | 51/51/51/51 | 51/51/51/51 | 51/51/51/51 |
| `bodyShape` | `rectangle`, `square`, `oval`, `triangle`, `composite` | 5 | 5/5/5/5 | 5/5/5/5 | 5/5/5/5 |
| `bodyX` | `0.75…1.3` | 56 | 56/56/56/56 | 56/56/56/56 | 56/56/56/56 |
| `bodyY` | `0.75…1.25` | 51 | 51/51/51/51 | 51/51/51/51 | 51/51/51/51 |
| `armWidth` | `0.7…1.5` | 81 | 81/81/81/81 | 81/81/81/81 | 81/81/81/81 |
| `armLength` | `0.75…1.2` | 46 | 46/46/46/46 | 46/46/46/46 | 46/46/46/46 |
| `legWidth` | `0.7…1.4` | 71 | 71/71/71/71 | 71/71/71/71 | 71/71/71/71 |
| `legLength` | `0.75…1.25` | 51 | 51/51/51/51 | 51/51/51/51 | 51/51/51/51 |
| `pecsSize` | `0…1` | 101 | 101/101/1/101 | 101/101/1/101 | 1/1/1/1 |
| `pecsInk` | `0…1` | 101 | 54/54/1/54 | 54/54/1/54 | 54/54/1/54 |
| `shouldersSize` | `0…1` | 101 | 101/101/101/101 | 101/101/101/101 | 101/101/101/101 |
| `shouldersInk` | `0…1` | 101 | 54/54/54/54 | 54/54/54/54 | 54/54/54/54 |
| `armsSize` | `0…1` | 101 | 101/101/101/101 | 101/101/101/101 | 101/101/101/101 |
| `armsInk` | `0…1` | 101 | 54/54/54/54 | 54/54/54/54 | 54/54/54/54 |
| `thighsSize` | `0…1` | 101 | 101/101/101/101 | 101/101/101/101 | 101/101/101/101 |
| `thighsInk` | `0…1` | 101 | 54/54/54/54 | 54/54/54/54 | 54/54/54/54 |
| `calvesSize` | `0…1` | 101 | 101/101/101/101 | 101/101/101/101 | 101/101/101/101 |
| `calvesInk` | `0…1` | 101 | 54/54/54/54 | 54/54/54/54 | 54/54/54/54 |
| `chestPresent` | `false`, `true` | 2 | 2/2/1/2 | 2/2/1/2 | 2/2/1/2 |
| `chestVolume` | `0…1` | 101 | 1/1/1/1 | 101/101/1/101 | 1/1/1/1 |
| `chestShape` | `round`, `oval` | 2 | 1/1/1/1 | 2/2/1/2 | 1/1/1/1 |
| `chestStretch` | `0.7…1.4` | 71 | 1/1/1/1 | 71/71/1/71 | 1/1/1/1 |
| `chestSpacing` | `0.6…1.3` | 71 | 1/1/1/1 | 71/1/1/71 | 1/1/1/1 |
| `chestY` | `0.2…0.65` | 46 | 1/1/1/1 | 46/46/1/46 | 1/1/1/1 |
| `anatomyMark` | `neutral`, `rectangle`, `linetriangle` | 3 | 3/1/1/3 | 3/1/1/3 | 3/1/1/3 |
| `beard` | `0…1` | 101 | 101/101/1/101 | 101/101/1/101 | 101/101/1/101 |
| `moustache` | `0…1` | 101 | 101/101/1/101 | 101/101/1/101 | 101/101/1/101 |
| `sideburns` | `0…1` | 101 | 101/101/1/101 | 101/101/1/101 | 101/101/1/101 |
| `pubicHair` | `0…1` | 101 | 22/1/1/22 | 22/1/1/22 | 22/1/1/22 |
| `eyeShape` | `circle`, `oval`, `triangle`, `square` | 4 | 4/4/1/4 | 4/4/1/4 | 4/4/1/4 |
| `eyeSize` | `0.7…1.3` | 61 | 61/61/1/61 | 61/61/1/61 | 61/61/1/61 |
| `eyeSpacing` | `0.7…1.2` | 51 | 51/1/1/51 | 51/1/1/51 | 51/1/1/51 |
| `eyeY` | `0.38…0.58` | 21 | 21/21/1/21 | 21/21/1/21 | 21/21/1/21 |
| `lashes` | `false`, `true` | 2 | 2/2/1/2 | 2/2/1/2 | 2/2/1/2 |
| `browShape` | `rectangle`, `triangle` | 2 | 2/2/1/2 | 2/2/1/2 | 2/2/1/2 |
| `browSize` | `0.6…1.4` | 81 | 81/81/1/81 | 81/81/1/81 | 81/81/1/81 |
| `browTilt` | `-0.6…0.6` | 121 | 121/121/1/121 | 121/121/1/121 | 1/1/1/1 |
| `browY` | `0.12…0.3` | 19 | 19/19/1/19 | 19/19/1/19 | 19/19/1/19 |
| `hairStyle` | `short`, `medium`, `long`, `bob`, `curly`, `tied`, `shaved` | 7 | 7/7/7/7 | 7/7/7/7 | 7/7/7/7 |
| `skinColor` | `#f5d3ac`, `#edb98d`, `#d99b74`, `#bb7e58`, `#925a3e`, `#673d2f` | 6 | 6/6/6/6 | 6/6/6/6 | 6/6/6/6 |
| `eyeColor` | `#69adf0`, `#527536`, `#978048`, `#59371f`, `#824b9b`, `#322638` | 6 | 6/6/1/6 | 6/6/1/6 | 6/6/1/6 |
| `hairColor` | `#f4c34e`, `#bd5827`, `#80483c`, `#423039`, `#5b4267`, `#efe1d1`, `#ad5cdb`, `#3d713b`, `#70a5d4` | 9 | 9/9/9/9 | 9/9/9/9 | 9/9/1/9 |
| `furColor` | `#f4c34e`, `#bd5827`, `#80483c`, `#423039`, `#5b4267`, `#efe1d1`, `#ad5cdb` | 7 | 1/1/1/1 | 7/7/1/7 | 1/1/1/1 |

## BIO-STRUCT-T3-B2

Face / profil / dos. Les nombres ci-dessous correspondent à T. Le JSON de preuves contient les mêmes balayages M et F. « Actif » ajoute les zones pileuses et la chevelure longue lorsque les règles de la catégorie le permettent. Pour les couleurs, le domaine d’entrée est sRGB hexadécimal. Deux valeurs témoins sont balayées. Les valeurs latentes ou corrigées sont conservées selon le format v5.

| Paramètre | Domaine testé pour T | Valeurs | Neutre | Actif |
| --- | --- | ---: | --- | --- |
| `morph:globalSize` | `0.75…1.3` | 56 | 56/56/56 | 56/56/56 |
| `morph:headHeight` | `0.8…1.2` | 41 | 41/41/41 | 41/41/41 |
| `morph:headWidth` | `0.75…1.3` | 56 | 56/9/56 | 56/56/56 |
| `morph:trunkLength` | `0.8…1.25` | 46 | 46/46/46 | 46/46/46 |
| `morph:armLength` | `0.8…1.2` | 41 | 41/41/41 | 41/41/41 |
| `morph:legLength` | `0.8…1.25` | 46 | 46/46/46 | 46/46/46 |
| `morph:shoulderWidth` | `0.75…1.35` | 61 | 61/61/61 | 61/61/61 |
| `morph:pelvisWidth` | `0.75…1.35` | 61 | 61/61/61 | 61/61/61 |
| `morph:thoraxDepth` | `0.75…1.35` | 61 | 61/61/1 | 61/61/4 |
| `morph:muscleVolume` | `0…1` | 101 | 101/101/101 | 101/101/101 |
| `morph:breastVolume` | `0…1` | 101 | 101/101/1 | 101/101/1 |
| `shape:headShape` | `round`, `oval`, `square`, `rectangle` | 4 | 4/4/4 | 4/4/4 |
| `shape:torsoShape` | `rectangle`, `oval`, `invertedtriangle`, `triangle`, `hourglass`, `trapezoid` | 6 | 6/2/6 | 6/2/6 |
| `shape:pelvisShape` | `rectangle`, `oval`, `trapezoid` | 3 | 2/1/2 | 2/1/2 |
| `shape:limbShape` | `rectangle`, `rounded` | 2 | 2/2/2 | 2/2/2 |
| `finish:pectoralDefinition` | `0…1` | 101 | 101/101/1 | 101/101/1 |
| `finish:abdominalDefinition` | `0…1` | 101 | 101/101/1 | 101/101/1 |
| `finish:fatVolume` | `0…1` | 101 | 101/101/1 | 101/101/1 |
| `finish:shadowStrength` | `0…1` | 101 | 63/63/35 | 63/63/35 |
| `finish:chestHairDensity` | `0…1` | 101 | 77/1/1 | 77/1/1 |
| `finish:bellyHairDensity` | `0…1` | 101 | 59/1/1 | 59/1/1 |
| `finish:pubicHairDensity` | `0…1` | 101 | 1/1/1 | 75/1/1 |
| `finish:breastShape` | `natural`, `round`, `drop` | 3 | 3/3/1 | 3/3/1 |
| `finish:pubicHairShape` | `none`, `triangle`, `square`, `rectangle` | 4 | 4/1/1 | 4/1/1 |
| `finish:hairColor` | `#731d03`, `#346b27` | 2 | 1/1/1 | 2/1/1 |
| `face:eyeShape` | `round`, `oval`, `rectangle`, `almond`, `triangle`, `invertedtriangle` | 6 | 6/6/1 | 6/6/1 |
| `face:eyeSize` | `0.5…1.5` | 101 | 12/11/1 | 101/101/1 |
| `face:browShape` | `straight`, `arch`, `angled` | 3 | 3/3/1 | 3/3/1 |
| `face:mouthShape` | `lowersemicircle`, `uppersemicircle`, `triangles`, `rectangle`, `reversedb` | 5 | 5/5/1 | 5/5/1 |
| `face:lashes` | `none`, `short`, `long` | 3 | 3/3/1 | 3/3/1 |
| `face:irisColor` | `#731d03`, `#346b27` | 2 | 2/2/1 | 2/2/1 |
| `face:browColor` | `#731d03`, `#346b27` | 2 | 2/2/1 | 2/2/1 |
| `face:lipColor` | `#731d03`, `#346b27` | 2 | 2/2/1 | 2/2/1 |
| `groom:hairLength` | `bald`, `short`, `medium`, `long`, `verylong` | 5 | 5/5/5 | 5/5/5 |
| `groom:hairTexture` | `smooth`, `straight`, `frizzy`, `curly` | 4 | 1/1/1 | 4/4/4 |
| `groom:hairFamily` | `masculine`, `feminine`, `mixed` | 3 | 1/1/1 | 3/3/3 |
| `groom:hairCut` | `swept`, `crop`, `parted`, `layered`, `balanced`, `asymmetric` | 6 | 1/1/1 | 2/2/1 |
| `groom:hairColor` | `#731d03`, `#346b27` | 2 | 1/1/1 | 2/2/2 |
| `groom:moustachePresent` | `false`, `true` | 2 | 2/2/1 | 2/2/1 |
| `groom:moustacheSize` | `0…1` | 101 | 1/1/1 | 101/101/1 |
| `groom:moustacheColor` | `#731d03`, `#346b27` | 2 | 1/1/1 | 2/2/1 |
| `groom:beardPresent` | `false`, `true` | 2 | 2/2/1 | 2/2/1 |
| `groom:beardSize` | `0…1` | 101 | 1/1/1 | 101/101/1 |
| `groom:beardColor` | `#731d03`, `#346b27` | 2 | 1/1/1 | 2/2/1 |
| `groom:sideburnsPresent` | `false`, `true` | 2 | 2/2/1 | 2/2/1 |
| `groom:sideburnsSize` | `0…1` | 101 | 1/1/1 | 101/101/1 |
| `groom:sideburnsColor` | `#731d03`, `#346b27` | 2 | 1/1/1 | 2/2/1 |
