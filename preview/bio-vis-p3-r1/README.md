# BIO-VIS-P3-R1 — Correction du recouvrement capillaire

Preview indépendante : https://thsethse.github.io/Microcosme/preview/bio-vis-p3-r1/

Branche dédiée `codex/bio-vis-p3-r1`, issue de main `568450fedcb5984c4ac8bb84576fe22a9098014b`. La PR P3 #29 reste ouverte et son prototype publié reste inchangé. Aucune fusion. Aucun fichier des autres prototypes, du moteur, des sauvegardes ou du catalogue modifié.

## Reproduction prioritaire

Dans la page, toucher **Reproduire le cas signalé sur iPad**. Cela sélectionne le carré court et applique exactement :

| Paramètre | Valeur |
|---|---:|
| Largeur du crâne | 1,18 |
| Hauteur du crâne | 1,18 |
| Largeur du front | 1,14 |
| Hauteur du front | 1,18 |
| Largeur des tempes | 0,90 |
| Largeur des joues | 1,22 |
| Volume des bajoues | 1,35 |
| Largeur de la mâchoire | 0,82 |

Les trois coiffures, huit curseurs et bornes, trois préréglages P3, réinitialisation, déformation dynamique par requestAnimationFrame, repères et trois échelles sont conservés. Le bouton de reproduction et l'audit avant/après sont des ajouts de contrôle.

## Cause vérifiée

Dans P3, les nœuds du front (`forehead_width`) et leurs tangentes évoluent indépendamment des attaches temporales (`temple_width`). Le volume supérieur des cheveux était encore construit principalement autour du rayon crânien et de ces attaches. Avec un front large/haut et des tempes étroites, la courbe de peau dépassait le volume capillaire : des bandes sable réapparaissaient au-dessus des côtés du carré.

Une marge supplémentaire était aussi nécessaire pour couvrir le **trait de peau de largeur 4,2**, pas seulement l'axe de sa courbe. Un raccord d'implantation calculé seulement depuis la tempe pouvait rester à l'extérieur de la vraie section du front dans des combinaisons inverses (front plus étroit, tempes plus larges).

L'ordre SVG était déjà correct et reste inchangé : arrière → visage → volume supérieur → avant → côtés → texture. Les anciens tests de validité des SVG, bounding boxes et protection des traits ne contrôlaient pas que le bord supérieur du crâne était effectivement couvert ; ils n'auraient donc pas détecté le défaut.

## Correction locale

`coverage.mjs` lit les trois premiers segments cubiques du contour de peau P3, du sommet à la jonction temporale, sans modifier ce contour. Le côté opposé est symétrique. La tangente cubique donne une normale extérieure `(dy,-dx)/hypot(dx,dy)`.

- Le volume supérieur est reconstruit autour de ce bord réel : marge extérieure locale de **3,3 unités** au front/tempes (rayon du trait 2,1 + marge d'anticrénelage), portée progressivement à 6,5 au sommet pour conserver le volume de la coupe. Ce n'est pas un agrandissement uniforme de la coiffure.
- Six subdivisions par segment donnent une enveloppe interpolée en Béziers cubiques ; le nombre et l'ordre des points sont fixes pendant les déformations.
- Les raccords intérieurs utilisent la largeur réelle du contour à leur hauteur. Cette section est calculée par bissection sur les cubiques ; un recouvrement de 6,5 unités assure la jonction avec les panneaux capillaires. Les retours près des tempes sont arrondis.
- Le dessin du contour extérieur est séparé du remplissage pour ne pas ajouter un double trait artificiel dans la jonction d'implantation. Les mèches frontales et leur texture viennent toujours du dessin P3.

Seule la couche `volume` change. `back`, `front`, `sides` et `texture` restent **octet pour octet** identiques au rendu P3 pour les mêmes valeurs. Le centre du front reste ouvert, y compris avec une implantation haute : le bord de recouvrement est local, sans masque global, clipPath, filtre, scaleX/scaleY ou déplacement de visage.

`model.mjs` et les quatre modules `p2/` sont des copies exactes du snapshot P3. `source-render.mjs` est le rendu P3 original, conservé à l'identique pour l'audit. `render.mjs` assemble le même visage et les mêmes couches, en substituant uniquement le volume supérieur. Un test compare aussi le markup complet de la couche de visage avant/après dans les 768 combinaisons de bornes.

Les repères anatomiques et capillaires du modèle sont strictement conservés. Une variation des joues peut légèrement modifier la tangente du contour au-dessus de la tempe (le contour P3 est C1) ; seule l'enveloppe de recouvrement suit cette influence locale, pas la mèche avant, le volume arrière ou la texture. Les anciens tests de stabilité sont précisés pour distinguer cette jonction locale des couches inchangées.

## Audit visuel avant / après

[Ouvrir la comparaison du carré](https://thsethse.github.io/Microcosme/preview/bio-vis-p3-r1/comparison.html?cut=bob).

`comparison.html?cut=classic|bob|curls` montre le rendu P3 original à gauche et R1 à droite, avec le même modèle de visage et les mêmes paramètres. Neuf cas par coupe : le cas iPad, neutre, tous les maximums, tous les minimums, front large/haut, front large/crâne court/tempes étroites, combinaison intermédiaire et deux préréglages combinés.

Captures comparatives WebKit accessibles dans la page et fournies dans :

- `audit/ipad-priority-before-after.png` : détail du cas exact.
- `audit/bob-before-after.png`
- `audit/classic-before-after.png`
- `audit/curls-before-after.png`

Ces captures ont été ouvertes et examinées. Elles sont des captures d'audit ; les personnages restent entièrement dessinés par code SVG. La limite extérieure du capuchon peut légèrement différer même au neutre, car sa marge couvre désormais le trait de peau. Le visage et les autres couches ne changent pas.

## Tests déterministes

Depuis la racine :

```sh
npm ci
node --test bio-vis-p3-r1/*.test.mjs
npx playwright install --with-deps chromium webkit
node bio-vis-p3-r1/browser.test.cjs
node bio-vis-p3-r1/p2-regression.test.cjs
npm test
# Contrôle de la vraie preview :
BASE_URL=https://thsethse.github.io/Microcosme/preview/bio-vis-p3-r1/ node bio-vis-p3-r1/browser.test.cjs
# Régénération des comparaisons après examen des changements :
GENERATE_AUDIT=1 node bio-vis-p3-r1/browser.test.cjs
```

Les scripts gèrent leur serveur statique ; `CAPTURE_DIR` active une capture de la page. La CI R1 installe Playwright normalement. L'environnement Cloud local réutilise les bibliothèques WebKit des missions précédentes ; pour la vérification publique, le transport curl conserve la validation TLS avec la CA du proxy.

Résultats locaux :

- **10 tests Node réussis** : empreintes des copies P3, identité des trois modèles et des huit paramètres, modèle/visage/repères inchangés, invariance des quatre autres couches, 768 combinaisons de bornes, absence de valeurs invalides, ordre SVG, stabilité des repères, continuité de chaque curseur sur 120 pas et interpolation combinée de l'enveloppe sur 200 pas.
- **Chromium et WebKit** : 768 combinaisons de bornes + 48 combinaisons intermédiaires déterministes = **816 états**. Vérification des chemins, dimensions, traits du visage dégagés, mêmes paramètres aux trois échelles et couverture de la zone supérieure du contour de peau. Ce nouveau contrôle parcourt le chemin SVG effectivement dessiné, indépendamment du calcul de la correction : 100 abscisses curvilignes, zone au-dessus de `cy−0,22h`, trois décalages normaux (−0,8 ; 0 ; +1,9). Les formes remplies des cheveux au premier plan doivent les contenir. Le contrôle vérifie aussi qu'un point central du front reste découvert.
- Sur le **cas iPad exact**, les deux moteurs trouvent **26 points non recouverts sur 117 avant correction, 0 après**, avec le centre du front découvert avant/après. Les tests exigent que la référence P3 reproduise réellement le défaut, pour éviter une régression silencieuse du scénario.
- Gestes tactiles des 8 curseurs × 3 coupes, bouton de reproduction iPad, réinitialisation et préréglages, conservation de la coupe, repères, catalogue, quatre formats iPad/mobile, sentinelle de sauvegarde inchangée, interactions hors ligne après chargement et retour P2.
- Parcours complet P2 Chromium/WebKit réussi ; **35 tests existants du jeu réussis**. La CI générale n'est pas modifiée.

## Limites restantes

Les tests de recouvrement sont des contrôles géométriques **échantillonnés** du bord supérieur : ils ne prouvent pas tous les pixels ou tous les états continus. Le contour de peau P3 doit conserver sa topologie cubique actuelle ; un futur changement structurel demandera d'adapter l'extraction des trois segments et ses tests.

L'étude reste frontale, aux couleurs fixes, avec les mêmes bornes et simplifications graphiques de P3. Les cheveux sous la zone d'implantation laissent naturellement apparaître le front et le visage ; il ne s'agit pas de couvrir toute la peau. Aucune nouvelle coupe ou correction biologique ajoutée. La validité technique ne vaut pas validation artistique, et WebKit Linux ne remplace pas le contrôle sur un iPad physique. Le rendu corrigé attend votre examen sur iPad.

## Fichiers et publication

Ajouts uniquement : `.github/workflows/bio-vis-p3-r1.yml` et `bio-vis-p3-r1/` : modèle P3 et modules P2 inchangés, rendu original de comparaison, correction `coverage.mjs`, assembleur `render.mjs`, interface, tests, page de comparaison, quatre PNG d'audit, provenance et ce README. Aucun fichier existant n'est édité.

Pages reste sur `main:/`. Un commit de publication séparé ajoute seulement `preview/bio-vis-p3-r1/`, sans fusion ni modification du réglage Pages. La preview P3 d'origine et les autres prototypes restent inchangés. PR R1 dédiée, en brouillon, sans auto-merge et sans fusion.
