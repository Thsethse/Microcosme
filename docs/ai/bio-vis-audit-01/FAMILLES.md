# Familles : code, compositions et lecture visuelle

## Modules de construction

Les wrappers délèguent aux lots précédents ; les fichiers ne sont pas 72 générateurs isolés. On localise huit modules de construction principaux ci-dessous, plus le modèle d’ancres, l’enveloppe de recouvrement et les helpers. Ce nombre de modules ne compte pas les géométries : plusieurs branches et recettes vivent dans chacun.

| Abréviation | Fonction / fichier effectif | Rôle |
| --- | --- | --- |
| P4 | [i5/i4/i3/i2/i1/base/p4-render.mjs](https://github.com/Thsethse/Microcosme/blob/4fb938ac3e7d4cbd76f1f05b9cd0ec67cdae86f5/preview/bio-vis-p5-i6/i5/i4/i3/i2/i1/base/p4-render.mjs) | Autres styles historiques, rubans/nattes/chignons/queue/afro |
| R1 | [i5/i4/i3/i2/i1/base/r1/render.mjs](https://github.com/Thsethse/Microcosme/blob/4fb938ac3e7d4cbd76f1f05b9cd0ec67cdae86f5/preview/bio-vis-p5-i6/i5/i4/i3/i2/i1/base/r1/render.mjs) | Trois coupes originales, volume remplacé par coverageCap |
| A | [i5/i4/i3/i2/i1/hair.mjs](https://github.com/Thsethse/Microcosme/blob/4fb938ac3e7d4cbd76f1f05b9cd0ec67cdae86f5/preview/bio-vis-p5-i6/i5/i4/i3/i2/i1/hair.mjs) | Recettes du lot A, puis délégation au parent |
| B | [i5/i4/i3/i2/hair.mjs](https://github.com/Thsethse/Microcosme/blob/4fb938ac3e7d4cbd76f1f05b9cd0ec67cdae86f5/preview/bio-vis-p5-i6/i5/i4/i3/i2/hair.mjs) | Recettes du lot B, puis délégation au parent |
| C | [i5/i4/i3/hair.mjs](https://github.com/Thsethse/Microcosme/blob/4fb938ac3e7d4cbd76f1f05b9cd0ec67cdae86f5/preview/bio-vis-p5-i6/i5/i4/i3/hair.mjs) | Recettes du lot C, puis délégation au parent |
| D | [i5/i4/hair.mjs](https://github.com/Thsethse/Microcosme/blob/4fb938ac3e7d4cbd76f1f05b9cd0ec67cdae86f5/preview/bio-vis-p5-i6/i5/i4/hair.mjs) | Recettes du lot D, puis délégation au parent |
| E | [i5/hair.mjs](https://github.com/Thsethse/Microcosme/blob/4fb938ac3e7d4cbd76f1f05b9cd0ec67cdae86f5/preview/bio-vis-p5-i6/i5/hair.mjs) | Recettes du lot E, puis délégation au parent |
| F | [hair.mjs](https://github.com/Thsethse/Microcosme/blob/4fb938ac3e7d4cbd76f1f05b9cd0ec67cdae86f5/preview/bio-vis-p5-i6/hair.mjs) | Recettes du lot F, puis délégation au parent |

Autres autorités : [modèle morphologique](https://github.com/Thsethse/Microcosme/blob/4fb938ac3e7d4cbd76f1f05b9cd0ec67cdae86f5/preview/bio-vis-p5-i6/i5/i4/i3/i2/i1/base/r1/model.mjs), [coverageCap / halfWidthAt](https://github.com/Thsethse/Microcosme/blob/4fb938ac3e7d4cbd76f1f05b9cd0ec67cdae86f5/preview/bio-vis-p5-i6/i5/i4/i3/i2/i1/base/r1/coverage.mjs), [sources des trois coupes](https://github.com/Thsethse/Microcosme/blob/4fb938ac3e7d4cbd76f1f05b9cd0ec67cdae86f5/preview/bio-vis-p5-i6/i5/i4/i3/i2/i1/base/r1/source-render.mjs), [braid/strandFactory](https://github.com/Thsethse/Microcosme/blob/4fb938ac3e7d4cbd76f1f05b9cd0ec67cdae86f5/preview/bio-vis-p5-i6/i5/i4/i3/strand.mjs), [rendu et correction des gros plans P4-R1](https://github.com/Thsethse/Microcosme/blob/4fb938ac3e7d4cbd76f1f05b9cd0ec67cdae86f5/preview/bio-vis-p5-i6/i5/i4/i3/i2/i1/base/render.mjs), [rendu F](https://github.com/Thsethse/Microcosme/blob/4fb938ac3e7d4cbd76f1f05b9cd0ec67cdae86f5/preview/bio-vis-p5-i6/render.mjs). Les modules gelés physiquement présents ne sont pas tous des constructions appelées : leur nombre brut ne mesure pas la diversité.

## Petit vocabulaire de construction partagé

- Contour du crâne et ancres : huit paramètres, aucune nouvelle coiffure par forme de visage.
- Trois socles de calotte : classic, bob, curls ; 102/17/7 états de socle dans les 126 choix. 63-G possède un socle de calcul mais ne dessine pas de cheveux.
- Enveloppe de recouvrement commune : utilisée dans 118 choix, parfois tronquée par un masque. L’absence de cette enveloppe dans les rangées ou sous tissu n’est pas un défaut de couverture en soi.
- Mèche en S, raie centrale et fronts relevés ; la mèche de 19-G est littéralement contenue dans 24 calques frontaux neutres, parfois recouverte par un volume supplémentaire.
- Tableaux de pointes/franges, contours de quiff/éventail, panneaux latéraux et mèches de nuque.
- Rubans/cascades/ondes, lobes de boucles, rouleaux fermés, macro-volume afro et texture de coils.
- Entrelacs sur une ligne de centres et leurs normales ; même principe dans couronne, rangées et brins pendants.
- Cylindres de locks, distincts des entrelacs.
- Chignons lisses, chignons à rouleaux, spirales tressées, demi-attaches et queues ; raccords locaux et masques de côté court.

Les noms de helpers ne définissent pas à eux seuls une structure indépendante : un helper change de constantes, une même recette peut être copiée, ou plusieurs helpers se combinent. Les couleurs et ornements sont hors du compte.

## B · 111 compositions techniques

Une composition est la suite canonisée des commandes géométriques de tous les calques de cheveux et des clips nécessaires, hors objets/couleurs/labels. Deux choix appartiennent à la même classe si cette suite est identique sur les 270 états communs. Changer une constante de bord ou la longueur d’une mèche suffit à créer une autre classe. C’est une définition stricte de géométries non identiques, **pas 111 algorithmes sans mutualisation**. Voir [METHODE](METHODE.md) pour ses limites.

| Classe | Choix | Empreinte composée SHA-256 (270 états) |
| --- | --- | --- |
| T001 | 01 | `04bd11c311f0107c20d95e65d9a593ee5c92c7cb53507e10b680ece3de7add1c` |
| T002 | 02 | `81afed059e4b8205a631892ba8f875c9e461a70b36a5a71027d7bfacf3a59323` |
| T003 | 03 | `492e2b79667cd39d13289a235792a565e9c8a6e947b87ac1bac8d72cbdb943a9` |
| T004 | 04 | `2bda93380e6c3d7f9387a29f27ee139740b49b66d7afff930fc58bfcbd504599` |
| T005 | 05 | `42591a7369be62714c865d4692ab292cb5bc3c91177ec001033b295a691e3753` |
| T006 | 06 | `1719c0ff89230ed40880a7352a76c465034305866c3293608a7389bb364e9e37` |
| T007 | 07 | `ceb3f2cc6638910a0f1406ac77a632e6e8446b40e43fb118b2309953763fec30` |
| T008 | 08, 58-G | `e85d22bfbaff32f807d55d1c7e3b16266dad7ae1dba0cd895198cab2de010498` |
| T009 | 09 | `1923dc6cefc72bc87f094ba3af887f3a56ecd743e4006ea61aa5d0418feadeb9` |
| T010 | 10 | `ffa247c06b5f9ac6b06570770f42a06ed2bcd522f7b432f280c96df36e07ce01` |
| T011 | 11 | `3d3587b7b9f0e3f317839f013328205ba647b20366b33890f9a37cde6065baac` |
| T012 | 12, 24-D | `6a4f4bc6d3922f439b7a61b51af114a2b08f9aec148d831044bba263f64ef21d` |
| T013 | 13 | `cc1c1a56bee448a370cf79bb3aeb776bfc730d92d9004b86d4d5abe04d2574aa` |
| T014 | 14 | `e4b5a2c55db19776fd281964492a7f77ea8711ec7483bc8b00b0ffa9674eabd0` |
| T015 | 15 | `0425892d35aa7626a70dd3a7bdf09116ce2320ba6ab2cb4d25078b32ae93200c` |
| T016 | 16 | `797fda0c5f962216af8631997b51cfafcd66386706dd5739b5c9fd95d15b7591` |
| T017 | 17 | `10668bbd7a9ed067bd1ab6c956a631b87977bba75f15876afcfb8b75496db48a` |
| T018 | 18 | `b6424bbb3dcc90e9967e63f8a02ea15eac49d911b46f06996ae28429084c3fea` |
| T019 | 19-G, 21-G, 68-G | `26c4f4d688c3c12d75e56f193a4c4c04bbe18427e0978eb4eeea40a218007119` |
| T020 | 19-D | `d819b5bf5c4537b511607a5c8557d2a78e1b8ca8902e57d856e9d0a1d077d34f` |
| T021 | 20-G | `5cdc71f8ec4b9af1fdbd8754500ac4092bd03845da0bce09e04e44f9efc65a42` |
| T022 | 20-D | `9bcc84292589ce62ac40d586ab918622da7fa443b22609bfe915d6f253ae8768` |
| T023 | 21-D | `52b742c4a0f230785cf43448a8d6e11cb78e6deb229ca6c1772e556e985e9941` |
| T024 | 22-G | `f057b1517942467389ffc16f014aa380b2ee0e0e9898ac14d2b21bb931f9c2bc` |
| T025 | 22-D | `d592543b1794289df92c3204059ce054bc71aad26a0e85a26a31145cceab6f4e` |
| T026 | 23-G | `728459879377537d9e907fe5cd501decbcb701f7f5c6303efa5515bbbc420542` |
| T027 | 23-D | `32692c6d6d65f0ca749b0708c1da521a64f23d46f7be635eb4f9fec065e310d2` |
| T028 | 24-G | `f998942df6c25f8f676081614649fbe4faa0867c981ea2498a1bb74c0d4f70ac` |
| T029 | 25-G | `f4f7a7b63d29a6331c20184a7b4d022552d0f2855bc63416def78793382c9d92` |
| T030 | 25-D | `dc3259590d36b5c0238d9dd4ee60f1a5f34ea480621266d5c6f80f2e26dab58e` |
| T031 | 26-G | `8bba51551166becce34354dae6d1d7c7f424a39693fed60653ea3a4cc46434f0` |
| T032 | 26-D | `2a743519e9f3895a6f4da3fccdc099e6ebbe0c19bf3d680303e3df141b7297b4` |
| T033 | 27-G | `faae351be3645298d04533856f9d30b6a07ac49d21792ff67622801263008b93` |
| T034 | 27-D | `231cc7838225f796f986c1bf958646a60883b2172b73980b1331295020cf7e82` |
| T035 | 28-G, 59-G | `df65eca40bf0e2e78788ffa4d2611903faf9fc0ca7d3312b3adce8816ef63e41` |
| T036 | 28-D | `2020dec3196df13710433bac573e79c16c1c3a2eb99a62c4c0e00691468a0f3e` |
| T037 | 29-G | `652d735af208aa92bb7769c62492b7b388802d68c1a5425c16c597fbb1ac74fc` |
| T038 | 29-D | `bd74a23345495fd5a165f5b1b49da9eb9ae7839c091866b2e653267df8063992` |
| T039 | 30-G | `b3963d1fa7a62331a67cbe1e600679d0e74f25199bb5a612ef52529a97e61aff` |
| T040 | 30-D | `6963dbe5e77d6f7579c11fc1cf0125feee327b8989a7befbfc45aeb4870aaf65` |
| T041 | 31-G | `a545f8d43577585ba05a5b50f312f317407442c08c8dc1eaea4e9693463b2571` |
| T042 | 31-D, 58-D | `03860afadb744734045e2442065ab72fe12b0320ee293aca1c977051bb54f569` |
| T043 | 32-G | `c39a970d0914fa1a5b6455923523494c80f67ad9f3d0b2b170b1824770492ef3` |
| T044 | 32-D | `efa789158297c75e088665a4bc485eaa1bc7c5000e30ecce5c1fab10a62083a2` |
| T045 | 33-G | `afeb3b52ebcc8573feecbdfff57ceb447078ba47885045225784fc79dd05c649` |
| T046 | 33-D | `d5a0f389d0f071dbf4f1eebeb16545ca3bc7dc1c7cae2cbdc944d57142cdd103` |
| T047 | 34-G | `30007a384dfcd88047be290952873c3e6e4655cc16d4e651744c85462a39d6da` |
| T048 | 34-D | `08975ddf1034a27252149daeacc0ea26f746650c7b98a9cf3714adf542bfb8d1` |
| T049 | 35-G | `a4a2d2ceda56eda651ebec660feea707773fafdaf1e716fde6836129a19a7cfb` |
| T050 | 35-D | `4f0ee1ef065b6cca0a060084b407a9879be47e01b7b49c129de025e91895bea9` |
| T051 | 36-G | `f0ea9acd8020186924dcc4fd5a7819c72eca25bfa0397ec02dceacf2d28aee17` |
| T052 | 36-D | `4227ee8eeb7e653e3245474df1e91870b41d55ca181d764f3e64f16291e910de` |
| T053 | 37-G | `3f6a4019f51da2ec00465cf9713143644e8caf815ff870d82a10f0a2e464a333` |
| T054 | 37-D | `e0277497257e2eea52b7ea5c73476600d3a2cfa75e4e17d68243bc5622db4287` |
| T055 | 38-G, 48-G, 54-G, 69-G | `aa22a68e2347a8d741bd357e2fb02169b78e1f2a1242bc657d15683e8bea052a` |
| T056 | 38-D | `3363f0274ac426e742dfe987155c1176ae41325cb8a6c8bd804ba99c72621760` |
| T057 | 39-G | `1e9122084abb528876ff5511b61c18eef7335984576cf84fdbf5c00622f4aa0a` |
| T058 | 39-D | `0b784cda550134905b3a9ae16ca9fde2070928c00a43984bf6a7ef172b84d776` |
| T059 | 40-G | `bcb0bb538abdad3db3c11416fc1c79b1a7175f89f89abfca335b69eaeb4fea85` |
| T060 | 40-D | `3ddd47377e26d2553666bce24f9da1f7cff7f9becdaf9145537431e0f3892be7` |
| T061 | 41-G | `2d46cccbd39e67e6f5baa0d62c6cd969076f622adfebbbd1f176cc442f3f75ff` |
| T062 | 41-D | `31980f457dee396657bc793b2233641e72bfd7b4a80745bf7fc54212c60095ee` |
| T063 | 42-G | `38a21de00e4b4dbe7c8643446eca74d7cc8133c16b7adae25a1acfbc88614d83` |
| T064 | 42-D | `84db6d9e8361c0c2b4ae02eeaf8f8c80a24865cbf48a31ec063b227b7e5489e4` |
| T065 | 43-G | `26a0b8221aadefb382967c36c8eff3b6e457eea32f6bb5fba0599968bd56c200` |
| T066 | 43-D | `979325258e66b5d762cb3c12a98b7e60d985c366a625076427e3cc31e9ff297d` |
| T067 | 44-G | `7da6230ffc614732e9543915f2a0be96bbaa460644e7f3bc9cd83cf762390a80` |
| T068 | 44-D | `1de24760588719e0825ebb7dabab4ff2a1af97537c25da2f7782407a229b02b9` |
| T069 | 45-G | `d82ace5e28eaec48834884d55305a9902a914d9c7ee5e712e9022b13fbc2c755` |
| T070 | 45-D | `e387a392ff4991d11a08e750c734acfc39c479438501e03ef45cf7e088d16d08` |
| T071 | 46-G | `9a3921b69359efb03d0356f3b6bbd942608d9183133c257619dabc2ab831ae4c` |
| T072 | 46-D | `8276cec23f9ec068cdddd57ae93e9f6164778d59f2a25b1561f50e535d132100` |
| T073 | 47-G, 50-G | `876eb13a82397d79ab047548df09667c38edf73d1f773643b49eff960787faca` |
| T074 | 47-D | `6e6db6c12e00a31fb80bdbc7dc48302efdf0b36e2b43c18dc1269cd4c0abec50` |
| T075 | 48-D, 65-D | `47bfbabda824ca13b3c3de7084abaadbb8bd6fe4899fb4329b883bba60fa467c` |
| T076 | 49-G, 62-D, 71-G | `8a2da2367b76812dce4f1e964273b98caa0ab2df6e76f7fd0281c0415ab08367` |
| T077 | 49-D | `b19ef539fc3a14500e5e6126955e3c101919ce2206ba386527fc49dc90fb6079` |
| T078 | 50-D | `e585658e52a7cb376bf19929ef63fcc0430d77f535f258a8cfac6ac3075ec9aa` |
| T079 | 51-G | `e4819f66f78a3dae26224c54181f85838b3952db22e3edafe2a084fbd3f61622` |
| T080 | 51-D | `5cff77d3e722e3fa93d51cec69e1b12f6f88627a45583472398b9f756b9be3f0` |
| T081 | 52-G | `ccd42c3a685848a3cd551afa8c22c92c4b90adbed6d4a3e57475c1811cc6e2d7` |
| T082 | 52-D | `13d111801db2a20550791fb93a3f20a87472e579c0f8b6fe32c196fee92979c0` |
| T083 | 53-G | `e9400163f9e8dae454e3fe75e26ddb520c3941bfdf6140c522171eb09dff8674` |
| T084 | 53-D | `0ee32252ca4b2da76ab5f582b476cfffae490cf6f07d52b19a49a806561061d3` |
| T085 | 54-D | `f5d79ceeb178adcc9a694b68563bfd7821c3f28263dbf32beaac8e9bf9058ab5` |
| T086 | 55-G | `ef7e827f971f2657083294edf0bf0dd01980aa9a67cbf93dfe7679f3e3dfc7cc` |
| T087 | 55-D | `92683053063b33c0dded1fa17034fa46430cc3cc568b16377fd3902bf57921d3` |
| T088 | 56-G | `106b9a4e1141c0ec45b8965b753b850d5f9675b96c2ef2fbd8255bcc0aba46ce` |
| T089 | 56-D | `0957d6920f62de96996253ada0393fa269418dd234292f8b3b0f6eb869348189` |
| T090 | 57-G | `21a46be0ff6332bdce370d33230bfe27ec94ba106b8038fd5b4512a61d2d9a02` |
| T091 | 57-D | `c0e063501d5821f9adf5855825c11c349069136c07e5bf4e7c7329886b8b94d9` |
| T092 | 59-D | `bd14119f9eda8a0624600093ceb5bffeb3945f0359139d4a413ad30e4e7d7eb4` |
| T093 | 60-G | `6d09c24876ade52af4b5dd9655a6176ec7312e7fcdf91d4b191ab496abebd500` |
| T094 | 60-D | `fff1075b8bcb16af743de9f294933b49a6810bdf4e05f2a5d6255e40641c826f` |
| T095 | 61-G | `5fc6879dfcc2b6369041f5ea8100149fdfafc125ab15101fc78e0eb89c76c233` |
| T096 | 61-D | `1a94d38987041f4994db8129f90174df0ca7de6b99e480d87700d4db92a05326` |
| T097 | 62-G | `dea92c21227f1833e1a2d3bf5c4adfea804afc91d417f6174b035f3a14750fb3` |
| T098 | 63-D | `95a177c51fcd2a874415fb33e20040f8048f7415d43d1ea3dbdf85112b07242c` |
| T099 | 64-G, 70-G | `9b9dc753076bb130444272e9386f2e667bae20547dcc576cd0b34370e59bf81c` |
| T100 | 64-D | `5ed5d723c44611bf07e5a54f6878384eeee2783a6727be94ae61552262a5eb78` |
| T101 | 65-G | `20c67157ec98c984da3260960f4ad61be93dcd95e9a1bca5fbf2962c1a7a380d` |
| T102 | 66-G | `edb82b34e71eafd34d5f9cf07eb7e11806aca123fa141444c021b36ddcff99f5` |
| T103 | 66-D | `6fb28ca21a021888c214a83076bdcbd0441af11511c3253f755852c38aab59ae` |
| T104 | 67-G | `a1eb53da62ce58c4ef4b868f70fce230c05dbfe98168b98a97bba672e6e74090` |
| T105 | 67-D | `62cc2dc42911cef9a029e5e6d42a1ca9dffc4681f616a3a6a46a7db561ba6bcc` |
| T106 | 68-D | `5b43f947e994a1597cf73d24295ac898624440626bfe2237217b52ebd88d340e` |
| T107 | 69-D | `818bea953acebbc9a75b77fb80f62e9e3a0a277107c06b68078f997d8838d6df` |
| T108 | 70-D | `a3d9e73a8307c0fef0a1d4386a0d739169eea273b9502ecae71e2211add640a5` |
| T109 | 71-D | `0fdfe5a03b473eb3a6f44972f4414ee9db4ad3b628024e27eb47f293eb8544e4` |
| T110 | 72-G | `fd559f7511f32f2932fa862c02929b51973210ef8b8668a04d40edfde50b49f0` |
| T111 | 72-D | `d50e9a7d7ecf404eb50119108b6aa00b156cd9d10bcd14f2ea0df5bc17acd4cd` |

Les trois classes de fragments ne sont pas des coupes complètes ; 63-G n’a pas de classe technique connue. [Données des compositions](data/compositions.json).

## C · 32 familles visuelles complètes proposées

Le classement privilégie la distribution des longueurs, le volume dominant, le type d’attache, la texture et les côtés dégagés. La ressemblance globale prime ici sur l’égalité des nombres. Ce sont des groupes de lecture avec variantes internes, pas 32 copies interchangeables ni un résultat de clustering automatique. Les familles 15/16 séparent queue unique et couettes ; les nattes à départ temporal ou de nuque de la famille 17 conservent leurs différences dans l’inventaire.

La longueur globale domine dans les familles de rideaux : 26-D garde sa frange comme variante interne de la famille 06. La latéralité et les détails de raie peuvent varier au sein d’une famille ; ils restent décrits dans l’inventaire. Des frontières restent discutables : 12/13 (chignon lisse/rouleaux), 02/31/32 (balayage/haut quiff/côté court), 18/27 (nattes seules/chignon supplémentaire), 24/25 (rangées libres/attachées). Les planches rendent ces arbitrages visibles. Une autre granularité changerait C, sans changer A, B ni les groupes exacts.

| Famille | Critère de forme | Choix présents | Planche |
| --- | --- | --- | --- |
| 01 | Crâne explicitement dégagé | 01 | [PNG](planches/famille-01.png) |
| 02 | Balayages courts et mèches en S | 03, 19-G, 21-G, 22-G, 33-G, 65-G, 68-G | [PNG](planches/famille-02.png) |
| 03 | Pointes courtes et franges irrégulières | 02, 20-D, 23-G, 26-G, 37-G, 38-G, 39-G, 44-G, 48-G, 54-G, 69-G | [PNG](planches/famille-03.png) |
| 04 | Carrés lisses à raie | 04, 19-D, 21-D | [PNG](planches/famille-04.png) |
| 05 | Carrés structurés à frange droite | 05, 57-G, 57-D | [PNG](planches/famille-05.png) |
| 06 | Longs rideaux lisses ou à faible ondulation | 07, 13, 26-D | [PNG](planches/famille-06.png) |
| 07 | Longueurs libres ondulées | 06, 14, 22-D, 36-G, 40-D, 43-D, 59-D | [PNG](planches/famille-07.png) |
| 08 | Couronnes de boucles courtes | 08, 27-G, 58-G | [PNG](planches/famille-08.png) |
| 09 | Longues boucles et rouleaux ouverts | 09, 15, 27-D, 30-G, 30-D | [PNG](planches/famille-09.png) |
| 10 | Masse afro ample | 16 | [PNG](planches/famille-10.png) |
| 11 | Couronnes tressées sans longue natte | 28-G, 28-D, 59-G | [PNG](planches/famille-11.png) |
| 12 | Chignons lisses et petites mèches | 11, 56-G, 56-D, 61-G, 61-D | [PNG](planches/famille-12.png) |
| 13 | Chignons, rouleaux et boucles latérales | 29-D, 31-G, 31-D, 33-D, 36-D, 51-D, 58-D, 68-D | [PNG](planches/famille-13.png) |
| 14 | Volumes ébouriffés hauts et mèches libres | 23-D, 54-D, 69-D | [PNG](planches/famille-14.png) |
| 15 | Queues uniques hautes ou basses | 12, 24-G, 24-D, 37-D | [PNG](planches/famille-15.png) |
| 16 | Deux petites couettes basses | 67-G | [PNG](planches/famille-16.png) |
| 17 | Une natte longue à départ temporal ou de nuque | 17, 32-G, 35-G, 41-G, 41-D, 60-G, 72-G | [PNG](planches/famille-17.png) |
| 18 | Deux longues nattes, avec ou sans couronne | 10, 32-D, 35-D, 39-D, 60-D | [PNG](planches/famille-18.png) |
| 19 | Crêtes centrales à côtés dégagés | 46-G, 46-D, 62-G | [PNG](planches/famille-19.png) |
| 20 | Longue mèche asymétrique et tempe courte | 25-D, 44-D, 47-D, 49-G, 49-D, 50-D, 62-D, 71-G | [PNG](planches/famille-20.png) |
| 21 | Longueurs fortement dissymétriques | 18, 34-D | [PNG](planches/famille-21.png) |
| 22 | Demi-attaches sur longueurs libres | 42-G, 42-D, 63-D, 70-D | [PNG](planches/famille-22.png) |
| 23 | Locks cylindriques rayonnantes ou longues | 52-G, 52-D | [PNG](planches/famille-23.png) |
| 24 | Rangées plaquées et retombées tressées | 53-G, 55-G | [PNG](planches/famille-24.png) |
| 25 | Rangées plaquées et chignon tressé | 55-D | [PNG](planches/famille-25.png) |
| 26 | Tresses en éventail et compositions irrégulières | 45-G, 45-D, 53-D | [PNG](planches/famille-26.png) |
| 27 | Chignon, couronne tressée et deux brins | 64-D, 71-D | [PNG](planches/famille-27.png) |
| 28 | Couronne tressée étagée sur vagues libres | 72-D | [PNG](planches/famille-28.png) |
| 29 | Mèches étagées et nuque ébouriffée | 38-D, 40-G, 43-G, 48-D, 65-D | [PNG](planches/famille-29.png) |
| 30 | Chignon central sur côtés courts | 64-G, 70-G | [PNG](planches/famille-30.png) |
| 31 | Éventails et quiffs très hauts | 29-G, 34-G, 51-G | [PNG](planches/famille-31.png) |
| 32 | Dessus court sur côtés dégagés | 20-G, 25-G, 47-G, 50-G | [PNG](planches/famille-32.png) |
| P1 | Fragments observés : frange sous capuche — hors familles complètes | 66-G | [PNG](planches/famille-P1.png) |
| P2 | Fragments observés : raie et deux nattes sous tissu — hors familles complètes | 66-D, 67-D | [PNG](planches/famille-P2.png) |
| X | Cheveux entièrement inconnus sous tissu — hors familles complètes | 63-G | [PNG](planches/famille-X.png) |

[Planche générale PNG](planches/planche-generale.png) · [SVG vectoriel](planches/planche-generale.svg). Les 32 groupes numériques couvrent exactement les 122 choix complets ; P1/P2 couvrent trois fragments et X l’inconnu. Le crâne rasé est dans C pour la disponibilité du catalogue ; en ne comptant que des familles portant des cheveux, C vaut 31.
