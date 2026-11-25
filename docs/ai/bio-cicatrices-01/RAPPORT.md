# BIO-CICATRICES-01 — Rapport de recette initiale

Le [rapport R1](RAPPORT-R1.md) couvre le correctif de démarrage sur iPad et la publication actuelle.

La première publication de la [preview](https://thsethse.github.io/Microcosme/preview/bio-cicatrices-01/) servait le code `eb1a4d3`. Le commit Pages `681cc11` ajoute les 31 fichiers statiques du dossier de la preview. La [PR #56](https://github.com/Thsethse/Microcosme/pull/56) est ouverte en brouillon. Le [déploiement Pages](https://github.com/Thsethse/Microcosme/actions/runs/45581498740) et le manifeste vérifié identifient la version testée.

## Géométrie et domaines

Comme pour les marques cutanées, la position horizontale suit la largeur du contour Bézier à la hauteur demandée. La position verticale est interpolée entre la couronne, les yeux, le nez, la bouche et le menton, aux repères 0, 48, 64, 82 et 100 %. Le tracé, ses bandes de relief et les traces de suture sont projetés dans ces mêmes coordonnées. Les variations irrégulières reprennent la graine de la cicatrice. Les archives v9 conservent la graine, l’identifiant, les demandes et les valeurs effectives.

| Géométrie | Longueur nominale | Largeur nominale |
| --- | --- | --- |
| Tracé | 3,80 à 51 unités | 0,32 à 4,60 unités |
| Surface | 3,90 à 32 unités | 1,30 à 21 unités |

Ces valeurs sont les références du visage neutre avant projection dans le contour réel. Le tracé est une bande effilée à relief variable. La surface réemploie les points radiaux et le contour quadratique des marques irrégulières. Les couches emploient les mêmes sommets de référence. Pour les traces parallèles, l’écart nominal entre axes vaut 1,06 fois la largeur plus 0,37 à 3,70 unités selon l’espacement. Les sutures sont de petites traces transversales cicatrisées.

Le contour disponible limite la longueur, la largeur et l’espacement. L’atelier indique la valeur ajustée et conserve la demande. Si l’implantation minimale ne tient pas, les réglages restent en mémoire jusqu’au déplacement ou au changement de morphologie. L’orientation expose les crans distincts de 0 à 359°, ou de 0 à 179° lorsque la géométrie est symétrique. La courbure, le nombre de traces, l’espacement et les sutures restent en mémoire en mode surface. L’atelier accepte jusqu’à seize cicatrices par apparence.

## Réserves anatomiques

Le tracé complet est calculé selon le contour cutané. Les silhouettes SVG réelles des ouvertures oculaires, des lèvres et des narines réservées interrompent uniquement sa peinture. Le même tracé reste disponible de part et d’autre de la réserve. Le contour cutané est contrôlé par calcul avant peinture. L’indication « réserves anatomiques rencontrées » utilise les enveloppes des organes et peut s’afficher lorsque le tracé frôle leur silhouette. Le test raster contrôle les réserves effectivement peintes.

La cicatrice passe sur le sourcil pour y rendre la trace visible. Les données du sourcil et ses ancrages sont conservés. Les coiffures et la barbe passent devant la couche des cicatrices. Les preuves raster contrôlent la réapparition à l’identique au retrait de ces masques.

## Lecture artistique

La maturation fait évoluer la teinte du rosé vers une trace plus claire, puis estompée. Elle modifie aussi le profil du relief. L’intensité règle le contraste sur ce profil et à zéro rend la cicatrice invisible. La miniature simplifie le relief en omettant son reflet le plus fin et renforce légèrement le contraste. Elle conserve la même géométrie cutanée et les mêmes données.

La planche contient quatre morphologies et quatre carnations d’étude. Pour chaque portrait, elle présente les six formes et les quatre repères de maturation à 0, 34, 72 et 100 %, avec un gros plan et les trois échelles de l’atelier. Les carnations de la planche reprennent les teintes d’essai du générateur et n’affectent que ces portraits d’étude. L’atelier enregistre les cicatrices sur la carnation historique.

Sur les 40 exemples, les cicatrices modifient 61 à 290 pixels à 300 px, 16 à 50 pixels à 178 px et 8 à 18 pixels à 70 px selon le moteur et le portrait. Les détails fins des sutures et des aplats se jugent au gros plan. L’examen artistique et fonctionnel final sur iPad physique reste réservé au porteur du projet.

[Planche de contrôle WebKit](planche-cicatrices.webp) · [Planche interactive](https://thsethse.github.io/Microcosme/preview/bio-cicatrices-01/#planche-cicatrices)

## Résultats

| Test | Résultat |
| --- | --- |
| T1 · Héritage | 756 comparaisons SVG historiques exactes, 54 comparaisons raster par moteur et huit versions d’archives réexportées à l’identique. |
| T2 · Formes | Six signatures distinctes sur deux géométries communes. Composition des six formes sur un visage et identité indépendante vérifiées. |
| T3 · Paramètres | 112 valeurs vérifiées sur douze paramètres. Angles équivalents rendus à l’identique, limites affichées et préférences restaurées. |
| T4 · Traces | Cinq traces parallèles, variation effective de l’espacement, sutures cicatrisées et irrégularité de la surface vérifiées. |
| T5 · Maturation | Les quatre repères sont distincts. Le profil de relief répond à la maturation tandis que l’intensité en règle le contraste. Les 40 cas de la planche répondent à chaque échelle. |
| T6 · Teintes | Nuances évaluées sur les quatre carnations d’étude. L’aspect très ancien est plus estompé que le récent sur les quatre carnations. |
| T7 · Anatomie | 256 morphologies extrêmes et 201 920 sommets peints vérifiés. 72 cas raster par moteur, sans débordement ni recouvrement des yeux, des lèvres ou des narines au seuil de la recette. Une traversée reste visible sur le sourcil et de chaque côté de l’œil. Les deux masques, cheveux et barbe, restituent le dessin à l’identique. |
| T8 · Rejeu | 96 graines distinctes réexécutées avec les mêmes résultats admissibles. Archives v9 personnalisées et latentes rejouées à froid dans les deux moteurs. |
| T9 · Atelier | 396 rendus couvrant 126 références capillaires et six corps aux trois échelles. Placement tactile, clavier et fonds clair et sombre testés à 820 × 1180, 1180 × 820 et 390 × 844. 123 tests Node hérités et suites navigateur héritées réussis. |
| T10 · Publication | Preview en HTTP 200 et recette finale rejouée sous Chromium 151 et WebKit 26.5. Empreintes SHA-256 confirmées pour 330 fichiers, dont 299 dépendances héritées. |

[Mesures de la recette publique](recette-publique.json) · [Manifestes vérifiés](publication.json)

## Rejouer la recette

```sh
npm ci
npx playwright install chromium webkit
node --test bio-yeux-01/tests/scars.test.mjs
ARTIFACT_DIR=/tmp/microcosme-cicatrices node bio-yeux-01/tests/scars-browser.cjs
BASE_URL=https://thsethse.github.io/Microcosme/preview/bio-cicatrices-01/ \
  ARTIFACT_DIR=/tmp/microcosme-cicatrices-public node bio-yeux-01/tests/scars-browser.cjs
```
