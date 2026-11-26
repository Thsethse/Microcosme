# BIO-CORPS-04-A-R02 — Implantation et recouvrement de la poitrine adulte F

Le panneau **Poitrine** conserve ses six réglages. La planche compare R01 et R02 avec les mêmes paramètres, à quatre teintes et aux trois échelles historiques. [Éditeur](https://thsethse.github.io/Microcosme/preview/bio-corps-04-a-r02/) · [Planche comparative](https://thsethse.github.io/Microcosme/preview/bio-corps-04-a-r02/#planche-poitrine)

| Révision | SHA |
| --- | --- |
| Contrat | `b5eb1793155f1516a9d7b817906d0541a2332ffc`. [Contrat de correction](https://github.com/Thsethse/Microcosme/blob/b5eb1793155f1516a9d7b817906d0541a2332ffc/docs/ai/bio-corps-04-a-r02/CONTRAT.md) |
| Témoin R01 | `be9df82007cd38dba02bac87d4a781b12a95b429`. [Preview R01](https://thsethse.github.io/Microcosme/preview/bio-corps-04-a-r01/) |
| Code publié | `c9dbbd58316139fa87721ccfc30cb83102145ae4`. [Arbre source](https://github.com/Thsethse/Microcosme/tree/c9dbbd58316139fa87721ccfc30cb83102145ae4) |
| Publication | `b780cf3062c5423b3f83afc230d3a0268ac0787d`. [Commit Pages](https://github.com/Thsethse/Microcosme/commit/b780cf3062c5423b3f83afc230d3a0268ac0787d) · [Manifeste](https://thsethse.github.io/Microcosme/preview/bio-corps-04-a-r02/version.json) |

## Références consultées

Les quatre fichiers ci-dessous ont été ouverts et examinés avant la première modification du code. Leurs empreintes Git correspondent aux blobs du contrat sur la révision `349fa64771d254b5df316380edd28564e2ad90ca` de `main`.

- **IMG_0612.webp** montre le dégagement sous les épaules et les clavicules et la variété des appuis latéraux et médians. R02 abaisse l’attache et conserve un espace au sternum modulé par l’écartement. [Planche d’implantation](https://github.com/Thsethse/Microcosme/blob/349fa64771d254b5df316380edd28564e2ad90ca/docs/ai/visual-references/IMG_0612.webp)
- **IMG_0613.jpeg** situe le relief principalement sous le volume et le long de ses flancs. R02 traduit ces plans par deux ombres mates dérivées de la peau. [Planche de reliefs](https://github.com/Thsethse/Microcosme/blob/349fa64771d254b5df316380edd28564e2ad90ca/docs/ai/visual-references/IMG_0613.jpeg)
- **IMG_0614.jpeg** fait varier la largeur, la remontée latérale et la courbure basse avec des lignes souvent ouvertes en haut. R02 utilise ces principes dans une empreinte procédurale dont le haut rejoint l’aplat du thorax. [Schémas de courbes](https://github.com/Thsethse/Microcosme/blob/349fa64771d254b5df316380edd28564e2ad90ca/docs/ai/visual-references/IMG_0614.jpeg)
- **IMG_0730.png** présente deux rangées de pions, chacune avec quatre volumes. La première rangée illustre un dépassement possible aux grands volumes. Dans la seconde, un corps plus large reçoit la même progression avec davantage de surface disponible. La planche R02 reprend cette comparaison. Les proportions, l’attache et les courbes sont calculées par le moteur. [Croquis du porteur](https://github.com/Thsethse/Microcosme/blob/349fa64771d254b5df316380edd28564e2ad90ca/docs/ai/visual-references/IMG_0730.png)

## Implantation et dessin

R01 plaçait l’attache à 39 % de la distance des épaules au repère thoracique. Aux forts volumes, elle ajoutait aussi un déplacement à la courbe du thorax. L’attache R02 se trouve à 96 % de cette distance. Pour le témoin standard rasé de la planche, son ordonnée passe de 130,14 à 141,63, soit 11,49 unités SVG plus bas. L’affaissement augmente l’extension et descend le relief sous ce repère. [Témoin R01](https://github.com/Thsethse/Microcosme/blob/c9dbbd58316139fa87721ccfc30cb83102145ae4/bio-yeux-01/chest-r01.mjs) · [Géométrie R02](https://github.com/Thsethse/Microcosme/blob/c9dbbd58316139fa87721ccfc30cb83102145ae4/bio-yeux-01/chest.mjs#L30-L75)

Chaque volume est construit à partir d’une empreinte de neuf cubiques avec tangentes communes, puis placé en miroir de l’autre côté de l’axe. L’aplat supérieur prend exactement la couleur du thorax. Les deux autres aplats donnent le relief latéral et inférieur. Les contours des volumes restent ouverts visuellement en haut grâce au raccord de couleur. La corpulence influence doucement la taille apparente, les tangentes et la densité des ombres. L’affaissement garde sa commande propre. [Construction et aplats](https://github.com/Thsethse/Microcosme/blob/c9dbbd58316139fa87721ccfc30cb83102145ae4/bio-yeux-01/chest.mjs)

Le corps produit son chemin `d` indépendamment des volumes. Lorsque la poitrine est active, le remplissage du corps conserve ce chemin et son trait utilise exactement le même. Un masque retire du trait les zones couvertes par les empreintes. Le remplissage reste sous les volumes, ce qui évite un liseré clair au bord de l’aplat de même couleur. Le bord des volumes n’est tracé que dans l’extérieur de la peau de base. Le dépassement vient du recouvrement et la découpe du trait n’altère ni les points du chemin ni les repères. Le moteur R01, avec son étirement local, sert uniquement au témoin comparatif R01. [Composition du corps](https://github.com/Thsethse/Microcosme/blob/c9dbbd58316139fa87721ccfc30cb83102145ae4/bio-yeux-01/adult-body.mjs) · [Masque et bord extérieur](https://github.com/Thsethse/Microcosme/blob/c9dbbd58316139fa87721ccfc30cb83102145ae4/bio-yeux-01/chest.mjs)

## Amplitudes et archives

Les six domaines restent 0–100. Le volume commande la masse apparente avec `volume normalisé^0,80 × (0,88 + 0,12 × corpulence normalisée)`. La largeur agit sur la demi-largeur souhaitée et la marge de placement. L’allongement et l’affaissement augmentent la profondeur verticale, avec un déplacement distinct de la rondeur basse pour l’affaissement. La rondeur agit sur la transition des flancs et la courbe du dessous. L’écartement place la paire dans la largeur calculée à partir du thorax. Une compression continue limite le débordement maximal en fonction de la place disponible. À zéro, les autres axes gardent leurs valeurs et sont désactivés. [Domaines et calcul](https://github.com/Thsethse/Microcosme/blob/c9dbbd58316139fa87721ccfc30cb83102145ae4/bio-yeux-01/chest.mjs)

Sur le témoin de corpulence standard à 100 % de volume, le bord du volume dépasse l’enveloppe de base de 3,12 unités SVG par côté à largeur 50 %, et de 11,86 unités à largeur 100 %, hors épaisseur de trait. À volume 25 % sur la silhouette très obèse, le volume reste nettement à l’intérieur de l’enveloppe. La planche présente huit témoins non plats sur ces deux corpulences, une poitrine plate, quinze variantes de forme et onze combinaisons d’ossature et de corpulence. La vue **Thorax · détail** cadre l’attache et les raccords. Les vues historiques peuvent rogner la partie basse des volumes les plus descendants. [Cas de la planche](https://github.com/Thsethse/Microcosme/blob/c9dbbd58316139fa87721ccfc30cb83102145ae4/bio-yeux-01/chest-study.mjs)

Les archives v1 à v13 gardent leur format et le rendu de référence. Les corps F avec poitrine explicite s’enregistrent en v16. Les archives v14 et v15 s’ouvrent avec le placement R02 en conservant les six valeurs actives, les largeurs d’ossature, la corpulence et les données d’origine. Le message de restauration indique le passage au nouveau rendu. L’export v16 garde les réglages latents quand le volume revient à zéro. [Restauration des archives](https://github.com/Thsethse/Microcosme/blob/c9dbbd58316139fa87721ccfc30cb83102145ae4/bio-yeux-01/appearance.mjs)

## Tests

| Contrôle | Résultat |
| --- | --- |
| Géométrie | 36 864 combinaisons aux coins des paramètres. Les contrôles vérifient la géométrie symétrique et les tangentes et comparent à l’octet les deux chemins du corps dans 858 états échantillonnés. Les six commandes donnent chacune 21 géométries distinctes au balayage. Les 135 SVG témoins R01 sont reproduits à l’octet. |
| Suites Node | 133 tests des ateliers et 35 tests du jeu réussis. Les 22 tests corporels, dont les cinq tests R02, ont aussi été rejoués sur la révision publique. |
| Navigateurs | Suite complète sous Chromium 151 et WebKit 26.5 sur la preview publique avec profil iPad émulé. Par moteur, six axes, cinq volumes qui se distinguent en raster aux trois échelles, 35 paires et quatre teintes. Sur un corps très mince à largeur et volume maximaux, 21 points échantillonnés sur l’ancien trait sont recouverts en raster. Une archive v15 issue de R01 migre et deux reprises v16 à froid couvrent les états actif et plat. La première recette complète locale, puis la recette ciblée de la révision publiée, donnent les mêmes résultats que la suite publique. Les tests navigateur du jeu passent aussi. |
| Publication | L’éditeur et son manifeste publics répondent HTTP 200. Les empreintes SHA-256 des 46 fichiers R02 et des 661 dépendances héritées sont vérifiées. Deux constructions de la révision publiée donnent le même contenu. |

### Rejouer

```sh
npm ci
npx playwright install chromium webkit
npm test
npm run test:browser
node --test --test-concurrency=2 bio-col-01/tests/*.test.mjs bio-yeux-01/tests/*.test.mjs
node bio-yeux-01/build-chest-r02-preview.mjs /tmp/microcosme-poitrine-r02 349fa64771d254b5df316380edd28564e2ad90ca c9dbbd58316139fa87721ccfc30cb83102145ae4
PREVIEW_MISSION=BIO-CORPS-04-A-R02 PREVIEW_DIR=/tmp/microcosme-poitrine-r02 node bio-yeux-01/tests/body-browser.cjs
PREVIEW_MISSION=BIO-CORPS-04-A-R02 node bio-yeux-01/tests/body-browser.cjs
```

Les navigateurs utilisent un profil iPad émulé. L’appréciation des proportions et des ombres sur iPad physique reste soumise à la validation du porteur.
