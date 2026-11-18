# BIO-VIS-P3 — Adaptation morphologique continue

Preview Safari iPad : https://thsethse.github.io/Microcosme/preview/bio-vis-p3/

Branche `codex/bio-vis-p3`, base main `41dfc2fc333ae6e300846bc797de92a8b0eba94b`. P2, P1, le jeu et les sauvegardes restent inchangés. Aucune fusion de branche.

## Références et préparation

Branches et PR ouvertes examinées, notamment P2 #28 et P1 #27, conservées ouvertes sans fusion. Aucun AGENTS.md trouvé sur la base. Documents de continuité START_HERE, PROJECT_STATE et journal consultés sur `docs/llm-project-memory`.

Catalogue V1 : `docs/ai/visual-references/a_clean_infographic_character_design_sheet_in_warm.png`, déjà vérifié et examiné en P2, réexaminé visuellement pour P3. PNG 1536×1024, SHA-256 `06dec2e59f34f195363cf482d51cae34808d4d3b3ff1e8863e8ba217bf571932`. Même palette sable/ocre et mêmes références : **03 · Classique**, **04 · Carré court**, **08 · Boucles courtes**. Aucun nouveau modèle ou ancienne référence pixel art.

## Essai tactile

Choisir une coupe, déplacer les huit curseurs, puis comparer les trois tailles. Le choix de coupe conserve toutes les proportions. Le bouton Réinitialiser ramène les huit valeurs à 1,00 en conservant la coupe. Les trois préréglages ne contiennent que des valeurs de curseurs : neutre, allongé/front haut, large/joues/bajoues. Toutes les combinaisons intermédiaires sont libres. Les repères turquoise montrent la morphologie, les repères ocres les attaches et passages des cheveux. La galerie compare les trois préréglages pour la coupe courante.

Pas de rechargement, de stockage ou d'animation autonome. Les événements tactiles `input` sont regroupés par `requestAnimationFrame`, au plus une mise à jour des trois SVG par image affichée. La fluidité sur un iPad physique reste à vérifier ; aucune mesure de FPS matériel n'est revendiquée.

## Calculs géométriques

Un seul contour continu est calculé, sans catalogue de têtes prédessinées, sans transformation globale scaleX/scaleY et sans choix discret de forme. Les unités sont celles du viewBox SVG.

| Paramètre | Min. | Neutre | Max. | Dépendances principales |
|---|---:|---:|---:|---|
| `skull_width` | 0,86 | 1 | 1,18 | Rayon crânien, volume supérieur, contour et implantation |
| `skull_height` | 0,88 | 1 | 1,18 | Sommet, niveaux du visage et longueur latérale |
| `forehead_width` | 0,88 | 1 | 1,14 | Largeur locale du front et contrôles des mèches frontales |
| `forehead_height` | 0,84 | 1 | 1,18 | Position verticale de la ligne capillaire, espace visible sous les cheveux |
| `temple_width` | 0,90 | 1 | 1,16 | Contour aux tempes, attaches latérales, faible ajustement des yeux |
| `cheek_width` | 0,88 | 1 | 1,22 | Joues et passage des mèches latérales |
| `jowls` | 0,75 | 1 | 1,35 | Bombement inférieur des joues et passage local des cheveux |
| `jaw_width` | 0,82 | 1 | 1,22 | Mâchoire ; fin des mèches du carré quand elles atteignent cette zone |

Avec le centre `(80,65)`, le demi-crâne vaut `r = 29 × skull_width`, `h = 44 × skull_height`. Le front et les tempes ont des largeurs indépendantes `fw = r × forehead_width` et `tw = 0,88 × r × temple_width`. La ligne capillaire est à `65 − 0,46h − 16 × (forehead_height − 1)` : un front haut remonte l'implantation sans déplacer les sourcils ou le sommet.

Le contour passe par les nœuds sommet, haut du crâne, front, tempes, joues, bajoues, mâchoire et menton ; la moitié opposée est symétrique. Les points sont convertis en Béziers cubiques fermées par Catmull–Rom : contrôles `P1+(P2−P0)/6` et `P2−(P3−P1)/6`. Les tangentes sont partagées entre segments (continuité C1). Les paramètres déplacent ces nœuds, pas un dessin complet.

Le volume des bajoues agit au niveau `y = 65 + 0,63h`, avec une largeur `r × (0,82 + 0,75 × (jowls−1)) × cheek_width`. La mâchoire agit plus bas, à `65+0,85h`. Le menton reste centré. Les yeux, sourcils, nez et bouche suivent le repère crânien, en conservant leur ordre vertical et leur symétrie.

Le passage latéral des cheveux utilise une enveloppe lisse des joues/bajoues. `smoothMax(a,b)=(a+b+sqrt((a−b)²+0,64))/2` évite les cassures de pente d'un maximum strict. Le volume supérieur reste basé sur le crâne ; les attaches suivent les tempes, les mèches du front suivent `fw` et la ligne capillaire. Pour les boucles, la transition entre largeur du crâne et largeur latérale utilise `u²(3−2u)` dans une zone verticale ; la taille des boucles reste fixe, seuls leurs centres sont déplacés. Il n'y a pas d'étirement global de leur texture.

Les repères anatomiques comprennent aussi côtés du crâne, zone des oreilles et nuque. L'ordre des couches P2 est conservé : arrière → visage → volume/implantation → avant → côtés → texture. Le même groupe de tête est repris octet pour octet dans les trois tailles.

## Réutilisation de P2

`p2/` est un snapshot exact des quatre modules P2 (deux modules capillaires et deux modules de base P1), avec test de concordance sur le snapshot publié. P3 importe les trois descriptions de coupe, les couleurs, les primitives de visage et le corps de cette base ; `render.mjs` adapte les points de contrôle du rendu P2 au modèle continu. P2 lui-même n'est jamais édité. Le contour de peau P1 est remplacé dans P3 par le contour continu ; les primitives des traits restent communes. La position neutre de P3 est une morphologie continue, pas un quatrième preset P2.

## Tests et audit visuel

```sh
npm ci
node --test bio-vis-p3/model.test.mjs
npx playwright install --with-deps chromium webkit
node bio-vis-p3/browser.test.cjs
node bio-vis-p3/p2-regression.test.cjs
npm test
# Contrôle de la vraie preview :
BASE_URL=https://thsethse.github.io/Microcosme/preview/bio-vis-p3/ node bio-vis-p3/browser.test.cjs
# Régénérer les trois planches, uniquement après examen des changements :
GENERATE_AUDIT=1 node bio-vis-p3/browser.test.cjs
```

Les scripts démarrent/arrêtent leur serveur local. `CAPTURE_DIR` active une capture de la page sur iPad émulé.

Résultats locaux :

- **7 tests Node** réussis : conservation P2 et coupes ; bornes/entrées invalides ; 256 combinaisons de bornes × 3 coupes = **768 cas** ; validité numérique/déterminisme ; stabilité des repères locaux et ordre d'occlusion ; effet des paramètres ; variations progressives de chaque contrôle sur 120 pas (24 parcours, déplacement de chaque coordonnée <0,7 unité par pas) ; interpolation combinée et identité aux trois échelles. Le contour Catmull–Rom et le maximum lisse fournissent la continuité analytique locale ; l'échantillonnage numérique contrôle les chemins produits.
- **Chromium et WebKit P3** réussis : gestes tactiles des 8 curseurs × 3 coupes et préréglages ; 768 chemins SVG assemblés dans le navigateur, longueurs finies/positives et groupes dans le viewBox avec marge ; repères du visage dans le contour de peau ; points échantillonnés des yeux/sourcils/nez/bouche dégagés des formes capillaires avant remplies ; identité exacte du groupe SVG aux trois tailles, stabilité de la coupe/proportions, repères, catalogue, quatre formats (820×1180, 1180×820, 768×1024, 390×844), hors ligne après chargement, sentinelle de sauvegarde intacte et retour P2.
- **Parcours complet P2 Chromium/WebKit** réussi : neuf combinaisons, géométrie, sélection, couches, catalogue, quatre formats et retour P1. Script P2 repris avec uniquement le chemin initial adapté au snapshot publié.
- **35 tests existants du jeu** réussis. CI générale inchangée.

Les contrôles par points et les bounding boxes ne constituent pas un test exhaustif de chaque pixel ni une validation artistique. WebKit Linux ne remplace pas un iPad physique. L'environnement local réutilise les bibliothèques WebKit et le lanceur ajusté des études précédentes ; la CI installe normalement Playwright.

### Captures comparatives fournies

`audit.html?cut=classic`, `audit.html?cut=bob` et `audit.html?cut=curls` calculent les mêmes géométries que la preview. Chaque planche contient **21 cas** : neutre, tous les minimums, tous les maximums, les 16 minimums/maximums individuels, et les deux préréglages combinés. Les captures WebKit sont enregistrées dans :

- `audit/classic-extremes.png`
- `audit/bob-extremes.png`
- `audit/curls-extremes.png`

Les trois planches ont été ouvertes et examinées avant publication. Elles sont consultables depuis la preview. Aucun PNG de coiffure n'est utilisé pour dessiner les personnages ; ces PNG sont uniquement des captures d'audit.

## Limites et paramètres conditionnels

Les huit paramètres sont exposés et modifient le dessin dans leurs bornes. Aucun n'est désactivé. Les bornes ne sont pas une loi anthropométrique ; elles cadrent cette expérimentation. La hauteur du front modifie l'espace par l'implantation, et ne redessine pas à elle seule le contour du crâne.

Une coupe courte qui ne touche pas les joues ou la mâchoire ne bouge pas quand ces zones changent : c'est explicitement testé pour la Classique. Les boucles n'atteignent pas la mâchoire ; ce réglage peut donc laisser leurs courbes inchangées. Le carré gère les joues/bajoues et adapte sa terminaison à la mâchoire. L'ajustement lisse peut être faible tant qu'une zone n'atteint pas le passage des cheveux. Pas de déformation arbitraire de toute la coupe pour rendre artificiellement chaque curseur visible dans les cheveux.

Vue frontale seulement, couleurs fixes par coupe, pas de physique, pousse, profil/dos, asymétrie, inclinaison de tête, cheveux supplémentaires ou biologie. Les tracés capillaires et les détails restent stylisés. Certaines combinaisons extrêmes peuvent produire un visage très caricatural malgré une géométrie valide ; elles demandent l'examen humain. Le rafraîchissement hors ligne n'est pas garanti. Aucun FPS sur iPad physique revendiqué.

La **fidélité artistique n'est pas définitivement validée**. Les essais sur iPad et l'avis de l'utilisateur décident de la suite.

## Fichiers ajoutés et publication

Uniquement : `.github/workflows/bio-vis-p3.yml` et le nouveau dossier `bio-vis-p3/` :

- `model.mjs`, `render.mjs`, `app.mjs`, `index.html`, `style.css` : géométrie, dessin et interface.
- `p2/hair-model.mjs`, `p2/hair-render.mjs`, `p2/base/model.mjs`, `p2/base/render.mjs` : snapshot P2 inchangé.
- `model.test.mjs`, `browser.test.cjs`, `p2-regression.test.cjs` : tests.
- `audit.html`, `audit.mjs`, `audit/classic-extremes.png`, `audit/bob-extremes.png`, `audit/curls-extremes.png` : audit visuel.
- `reference.json`, `README.md` : provenance et explication.

Pages reste configuré sur `main:/`. Publication séparée des ressources d'exécution et d'audit dans le nouveau dossier `preview/bio-vis-p3/`, sans fusion de PR. P2, P1, leurs previews, le catalogue, le moteur et les sauvegardes ne sont pas modifiés. PR P3 en brouillon, attente de validation artistique.
