# BIO-CORPS-03-R01 — Correction artistique de la corpulence

Dans l’atelier, choisir une base adulte H ou F dans **Personnage et palette → Corps**. La planche montre chaque paire avant/après à la même ossature et à la même échelle. [Éditeur public](https://thsethse.github.io/Microcosme/preview/bio-corps-03-r01/) · [Planche comparative](https://thsethse.github.io/Microcosme/preview/bio-corps-03-r01/#planche-corpulence)

| Révision | SHA |
| --- | --- |
| Contrat de départ | `c335903532d485baa3e08c2123285a4d5b6c7ee3`. [Contrat](https://github.com/Thsethse/Microcosme/blob/c335903532d485baa3e08c2123285a4d5b6c7ee3/docs/ai/bio-corps-03-r01/CONTRAT.md) |
| Témoin BIO-CORPS-03 | `244dc7867eadab8df7d24d0e9c64aee47a850646`. [Preview d’origine](https://thsethse.github.io/Microcosme/preview/bio-corps-03/) |
| Code R01 | `34acdc6078d9189f596a8efce49aa319a9b05f9e`. [Arbre source](https://github.com/Thsethse/Microcosme/tree/34acdc6078d9189f596a8efce49aa319a9b05f9e) |
| Publication R01 | `de99f48d30f5e220d8ff5d42d629f8c35bbb663e`. [Commit Pages](https://github.com/Thsethse/Microcosme/commit/de99f48d30f5e220d8ff5d42d629f8c35bbb663e) · [Manifeste](https://thsethse.github.io/Microcosme/preview/bio-corps-03-r01/version.json) |

## Diagnostic

BIO-CORPS-03 ajoutait au contour d’ossature une seconde courbe, interpolée à partir de gains locaux. Sur la base F standard à 100 %, l’abdomen recevait 14,57 unités SVG de demi-largeur et les hanches 28,98. La demi-largeur passait de 45,57 à l’abdomen à 70,98 aux hanches sur seulement un dixième de la hauteur du corps, puis redescendait à 58,50 à la base pelvienne. L’interpolation conservait tangentes et raccords, mais matérialisait ce maximum concentré. Le creux de la taille F restait proche de sa profondeur de référence. À 0 %, la faible réduction des épaules laissait un contraste marqué avec le tronc rétréci. [Interpolation précédente](https://github.com/Thsethse/Microcosme/blob/244dc7867eadab8df7d24d0e9c64aee47a850646/bio-yeux-01/adult-body.mjs#L40-L91) · [Coefficients précédents](https://github.com/Thsethse/Microcosme/blob/244dc7867eadab8df7d24d0e9c64aee47a850646/bio-yeux-01/body-corpulence.mjs#L9-L26)

## Correction du contour

Le moteur construit toujours le contour d’ossature. Selon la corpulence, il interpole ce contour avec une enveloppe fine ou généreuse. Les deux courbes partagent les mêmes ordonnées. Le mélange porte sur les demi-largeurs **et sur leurs tangentes**, à chaque repère et au flanc inférieur. Les raccords restent tangents jusqu’à la terminaison du pion. À 50 %, le moteur passe directement à la construction d’ossature de BIO-CORPS-02, pour toute combinaison admissible. [Construction SVG](https://github.com/Thsethse/Microcosme/blob/34acdc6078d9189f596a8efce49aa319a9b05f9e/bio-yeux-01/adult-body.mjs#L40-L99)

Avec `t = (corpulence − 50) / 50`, le poids de l’enveloppe fine est `−t × (1,24 + 0,24t)` pour `t < 0`, et celui de l’enveloppe généreuse `t × (1,50 − 0,50t)` pour `t ≥ 0`. Le passage par 50 % est continu. À 75 %, 87,5 % et 100 %, le poids de l’enveloppe généreuse vaut respectivement 62,5 %, 84,375 % et 100 %. Dans cette enveloppe, la moyenne des largeurs d’épaules, de thorax, de taille et de bassin continue d’agir sur la largeur du tronc, avec 32 % de sa variation relative. Le cou et le bas du flanc retiennent respectivement 55 % et 42 % de leur variation relative. L’enveloppe fine réduit les largeurs générales tout en combinant 55 % du réglage local et 45 % de la moyenne du tronc. [Enveloppes et pondérations](https://github.com/Thsethse/Microcosme/blob/34acdc6078d9189f596a8efce49aa319a9b05f9e/bio-yeux-01/body-corpulence.mjs#L7-L50)

| Demi-largeur de l’enveloppe standard (unités SVG) | H à 0 % | F à 0 % | H à 100 % | F à 100 % |
| --- | ---: | ---: | ---: | ---: |
| Cou | 7,8 | 7 | 14 | 12,7 |
| Épaules | 30,5 | 24 | 56 | 44,5 |
| Thorax | 24 | 19 | 61 | 53 |
| Taille | 21,2 | 16,6 | 68 | 63,2 |
| Abdomen | 20,8 | 18 | 70 | 67 |
| Hanches | 20,1 | 21,5 | 67 | 68 |
| Base pelvienne | 19,8 | 20,5 | 62 | 64 |
| Flanc inférieur | 18,6 | 19,5 | 42 | 45 |

À 100 %, H conserve un thorax plus développé et son maximum se situe à l’abdomen. F a un maximum plus bas et étalé entre abdomen et hanches. Pour F standard, la saillie locale des hanches au-dessus de la droite joignant abdomen et base pelvienne passe de 12,23 à 4,18 unités à 75 %, de 15,37 à 3,21 à 87,5 % et de 18,84 à 2,53 à 100 %. À 100 %, l’abdomen passe de 45,57 à 67 unités et la taille de 41,16 à 63,2. À 0 %, les deux enveloppes réduisent la surface visible du corps et la transition taille-abdomen se répartit sur un flanc plus fin. [Mesures de saillie et de continuité](https://github.com/Thsethse/Microcosme/blob/34acdc6078d9189f596a8efce49aa319a9b05f9e/bio-yeux-01/tests/body-corpulence.test.mjs)

## Invariants et archives

Le curseur unique et les six largeurs conservent leurs domaines et leurs réinitialisations indépendantes. Les ordonnées des sept repères, du bas du flanc et de la fermeture du pion sont conservées. Le point d’ancrage au sol garde ses deux coordonnées. Le calcul porte uniquement sur le calque du corps. Les traits et calques du visage, les cheveux et les anciens corps sont vérifiés par comparaison exacte du SVG. [Calque corporel](https://github.com/Thsethse/Microcosme/blob/34acdc6078d9189f596a8efce49aa319a9b05f9e/bio-yeux-01/render.mjs#L86-L100) · [Tests d’invariants](https://github.com/Thsethse/Microcosme/blob/34acdc6078d9189f596a8efce49aa319a9b05f9e/bio-yeux-01/tests/body-corpulence.test.mjs)

Les archives BIO-CORPS-03 v13 conservent leur format et leurs valeurs, y compris les pourcentages fractionnaires. À la restauration, ces valeurs alimentent l’enveloppe corrigée. Les silhouettes sauvegardées hors 50 % bénéficient ainsi de R01. Les versions antérieures retrouvent leur valeur de référence et leur rendu. [Format des archives](https://github.com/Thsethse/Microcosme/blob/34acdc6078d9189f596a8efce49aa319a9b05f9e/bio-yeux-01/appearance.mjs#L148-L215)

## Planche et résultats

La planche utilise des témoins rasés pour laisser voir les flancs. Elle propose sept ossatures, dont fine, standard, large, tous minima, tous maxima et deux combinaisons opposant haut et bassin. À chaque sélection, les neuf repères montrent H et F côte à côte avec leur témoin d’origine. Les cadrages historiques restent disponibles aux trois échelles. Le cadrage de corps à 178 px montre la silhouette complète. [Planche et sélecteurs](https://thsethse.github.io/Microcosme/preview/bio-corps-03-r01/#planche-corpulence)

| Contrôle | Résultat |
| --- | --- |
| Géométrie | 660 témoins à 50 % comparés à BIO-CORPS-02 à l’octet. 8 640 géométries contrôlées pour les invariants et la croissance de surface. 126 témoins « Avant » rejoués à l’identique avec le moteur publié. 14 séries de 201 positions distinctes en SVG. |
| Suites Node | 128 tests des ateliers et 35 tests du jeu réussis. La suite des ateliers comprend les huit tests ciblés de corpulence. |
| Navigateurs | Chromium 151 et WebKit 26.5, en local et sur la preview publique avec profil iPad émulé. Par moteur et par distribution, 24 rendus de référence exacts, six comparaisons supplémentaires à 50 % avec ossatures réglées, 18 contrôles verticaux et deux importations à froid de sauvegardes v13 issues de BIO-CORPS-03. Les 126 paires avant/après couvrent les sept ossatures et les trois échelles. Le jeu et les contrôles historiques de l’atelier passent sous les deux moteurs. La saisie tactile et au clavier et l’ouverture directe de la planche ont aussi été vérifiées sur l’URL publique. |
| Balayage raster | À l’échelle corps de 178 px, les 14 séries H/F et ossatures donnent chacune 201 rasters distincts, échantillonnés tous les 0,5 point, sous Chromium 151 et sous WebKit 26.5. La surface visible mesurée croît aux neuf repères dans chaque série. |
| Publication | GitHub Pages a construit le commit de publication. L’URL publique répond HTTP 200. Les empreintes SHA-256 des 42 fichiers R01 et des 527 dépendances héritées ont été vérifiées sur l’URL publique. |

### Rejouer la recette

```sh
npm ci
npx playwright install chromium webkit
npm test
npm run test:browser
node --test bio-col-01/tests/*.test.mjs bio-yeux-01/tests/*.test.mjs
node bio-yeux-01/tests/corrections-browser.cjs
node bio-yeux-01/build-corpulence-r01-preview.mjs /tmp/microcosme-corpulence-r01 f5e68d4fe1df16e9f59fad0474da9a51140bd674 34acdc6078d9189f596a8efce49aa319a9b05f9e
PREVIEW_MISSION=BIO-CORPS-03-R01 PREVIEW_DIR=/tmp/microcosme-corpulence-r01 node bio-yeux-01/tests/body-browser.cjs
PREVIEW_MISSION=BIO-CORPS-03-R01 node bio-yeux-01/tests/body-browser.cjs
```

Les navigateurs utilisent un profil iPad émulé. L’appréciation des volumes et des transitions sur iPad physique reste soumise à la recette artistique du porteur.
