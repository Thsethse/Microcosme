# Reproduire les mesures BIO-INV-01

Les scripts de diagnostic sont exécutables depuis la racine de la branche d’audit. Ils lisent les sources de l’atelier et des laboratoires. Le diagnostic vectoriel réimporte le texte du module des yeux en mémoire pour inspecter le prédicat d’admissibilité, puis compare ses résultats au solveur et au tirage publics. Les sorties sont séparées du code du dépôt.

```sh
npm ci
npx playwright install chromium webkit
audit_dir=$(mktemp -d)
audit=docs/ai/bio-inv-01/preuves
node "$audit/vecteurs.mjs" > "$audit_dir/vecteurs.json"
node "$audit/laboratoires.cjs" > "$audit_dir/laboratoires.json"
node "$audit/rendus.mjs" "$audit_dir"
AUDIT_ENGINE=webkit node "$audit/rendus.mjs" "$audit_dir"
node "$audit/rendus-canvas.mjs" > "$audit_dir/rendus-canvas.json"
node --test tests/*.test.js bio-col-01/tests/model.test.mjs bio-yeux-01/tests/model.test.mjs
```

Relevés avec Node 24.22.3, Playwright 1.62.1, Chromium 151.0.7922.34 et WebKit 26.5, sous Linux. Les 49 tests Node de la commande ci-dessus passent. Les cinq preuves JSON et la planche ont été produites par les scripts. Le navigateur charge les modules sur un serveur loopback qui s’arrête en fin de parcours. Sur Linux, les deux moteurs exigent les bibliothèques système de Playwright. [Sources et résultats](preuves/)

## Fonds, dimensions et seuils

- 300 × 300 px pour la tête, 178 × 178 px pour le corps et 70 × 70 px pour la miniature, en pixels CSS à facteur de densité 1. Les viewBox et les modes `headOnly` et `smallScale` sont ceux de l’atelier. Les cadres carrés donnent une comparaison stable à largeur égale. Dans l’atelier, la largeur disponible peut varier selon l’écran.
- Fond ivoire `#fffdf8`, plus ardoise `#474c55` pour les comparaisons de palette. L’égalité exacte des images dans un moteur est l’égalité de l’empreinte SHA-256 du tampon RGBA. Deux chaînes SVG différentes peuvent donner la même image à cause des métadonnées, des couches vides ou du masquage. La comparaison des images ne remplace donc pas celle des SVG.
- Un pixel est compté si au moins un canal sRGB varie d’au moins 16/255. Une comparaison est signalée proche si au plus 1 % des pixels du premier plan atteignent ce seuil. Pour les yeux, le dénominateur est une zone fixe englobant les deux yeux sur la tête neutre. Le seuil filtre les faibles différences d’anticrénelage. Le rapport retient aussi le nombre absolu de pixels, la somme des écarts et l’égalité exacte, car le résultat dépend de l’étendue du personnage et de la zone étudiée. Ces seuils aident à sélectionner des exemples. L’utilité artistique d’un détail se décide à son échelle de lecture.
- Un pas de tracé devient numériquement équivalent lorsque le déplacement maximal des points de contrôle est au plus 0,000025 unité SVG (~0,000034 px à l’échelle tête). Ce seuil isole le jitter des 20 itérations du solveur. La preuve distingue ces paliers d’une égalité exacte des coordonnées.
- Pour les couleurs, la distance euclidienne en OKLab sert au classement, avec contrôle du raster sur deux fonds. Aucun seuil OKLab ne sert à déclarer une teinte inutile. Le rapport de luminance mesure le contraste aplat/contour local.

## Couverture

| Diagnostic | Étendue |
| --- | --- |
| Vecteurs et modèle | 290 valeurs morphologiques élémentaires sur six coiffures. 126 coupes × 26 aplats, contrôles historiques et arrangements U. 8 morphologies × 9 profils oculaires × 557 valeurs élémentaires, soit 40 104 évaluations en variant un axe à la fois. Tranches conditionnelles sur 256 coins morphologiques, puis recherche déterministe d’intervalles disjoints. |
| Tirage des yeux | 4 096 graines `bio-inv-0` à `bio-inv-4095` par visage, six visages. Les refus et les replis sont recalculés et comparés à chaque sortie de production. Le témoin utilise un PRNG distinct et le même prédicat avec rejet sans repli. Le diagnostic compare surtout les marginales et le triplet de repli. |
| Raster SVG Chromium | 126 coiffures à chacune des trois tailles, soit 7 875 paires par taille. 6 corps, 6 morphologies, 9 modes d’yeux dont l’historique. Les 26 palettes plus l’historique sont comparées sur 4 coiffures et 2 fonds. Les balayages de curseurs couvrent quatre coiffures pour le visage et deux contextes pour les yeux. |
| Raster SVG WebKit | 14 identifiants témoins capillaires, 6 corps, 6 morphologies, 9 modes d’yeux et 27 états de palette sur 38-G avec deux fonds. Comparaisons ciblées du contraste et des accessoires. Le parcours JSON à froid est exécuté dans les deux moteurs. |
| Laboratoires | 18 axes T1 et 32 B2, 45 axes T2 dans trois contextes et 47 axes T3-B2 pour chacune des trois catégories dans deux contextes. Les preuves calculent des commandes sur leurs vues natives, sans assimiler ces rendus au cadrage SVG actuel. 256 rejeux T1/B2, 128 T2 et 36 T3 v5. Les témoins raster Chromium reprennent les moteurs Canvas existants. Le rendu natif est redimensionné sans lissage aux trois tailles pour les équivalences B2 et T2, les formes d’yeux T2, 101 tailles d’yeux T3 et un import T3. |
| Limites | Le raster complet des 126 coiffures utilise le visage neutre et les valeurs historiques par défaut. Les tests ciblés et tranches ne couvrent pas toutes les interactions de couleurs, de visages et d’enveloppes. Les preuves ne constituent pas un test d’iPad physique. |

## Exemples ciblés

### 48-D et 65-D

Le cas figure dans les égalités RGBA Chromium sur les trois échelles. Le test ci-dessous vérifie aussi l’équivalence des balises qui dessinent, pour 72 contextes. La réutilisation de 48-D est documentée par le lot capillaire P5-I6. [Source P5-I6](../../../preview/bio-vis-p5-i6/README.md) · [Comparaison raster](preuves/chromium-rendus.json)

```sh
node --input-type=module <<'JS'
import assert from 'node:assert/strict';
import {character} from './bio-yeux-01/render.mjs';
import {presets} from './preview/bio-vis-p5-i6/model.mjs';

function dessin(style, morph, accessories, contrast, headOnly, smallScale, hairColor) {
  return character(
    {style, arrangement: 'D', ...morph, accessories, contrast},
    {instance: 'inv', headOnly, smallScale, hairColor}
  ).replace(/ (aria-label|data-reference|data-hair-status)="[^"]*"/g, '')
    .replace(/<g data-layer="[^"]*"><\/g>/g, '');
}
let n = 0;
for (const morph of [{}, presets.tall.values, presets.broad.values])
for (const accessories of [false, true])
for (const contrast of [false, true])
for (const [headOnly, smallScale] of [[true,false],[false,false],[true,true]])
for (const couleur of ['historical', 'bleu-vif']) {
  const args = [morph, accessories, contrast, headOnly, smallScale, couleur];
  assert.equal(dessin('p5-048', ...args), dessin('p5-065', ...args));
  n++;
}
console.log(n); // 72
JS
```

### Perte à froid et repli de tirage

Les sections `persistenceUI` des deux preuves navigateur incluent le JSON exact, les deux empreintes identiques dans la page ouverte et l’empreinte différente après actualisation. La section `persistence` de la preuve modèle donne un cas distinct où les valeurs effectives explicites et la palette suffisent à recréer le SVG. [Chromium](preuves/chromium-rendus.json) · [WebKit](preuves/webkit-rendus.json) · [Vecteurs](preuves/vecteurs.json)

La graine `bio-inv-3` déclenche le repli sur la morphologie étroite, obtenue en fixant les huit paramètres faciaux à leurs minima sauf `forehead_width: 1.14`, `jowls: 1.35`. La variante étroite et haute relève aussi `skull_height` à 1,18. Le triplet de repli et les histogrammes indépendants sont consignés dans `random.narrow` et `random.elongated`. Le cas d’angles disjoints est sous `eyes.sliceExample.tilt`. [Preuve vectorielle](preuves/vecteurs.json)
