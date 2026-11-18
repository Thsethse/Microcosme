# BIO-VIS-P4-R1 — Finitions capillaires

Correction isolée des gros plans des **Tresses** et des **Très longs ondulés**, à partir de P4 publié sur main (`1d3395e`, code P4 `61809d5`, PR #31). P4 est graphiquement validé à 99 % par l’utilisateur ; les deux corrections présentes restent à apprécier sur iPad. Branche `codex/bio-vis-p4-r1`, sans fusion.

- [Preview P4-R1](https://thsethse.github.io/Microcosme/preview/bio-vis-p4-r1/)
- [Avant / après interactif : deux coiffures × trois morphologies](https://thsethse.github.io/Microcosme/preview/bio-vis-p4-r1/comparison.html)
- [Base P4 conservée](https://thsethse.github.io/Microcosme/preview/bio-vis-p4/)
- [Documentation originale P4](P4-BASELINE.md), [planche des habitants](references/inhabitants.png), [catalogue V1](references/catalogue-v1.png).

## Cause et correction

P4 rendait les longueurs placées devant le corps uniquement lorsque `headOnly` était faux. Les tresses et les deux rubans ondulés sont précisément dans cette couche `lengths`. Le gros plan supprimait donc leurs chemins, **sans utiliser de géométrie simplifiée**. Son ancien cadrage `0 -32 160 165`, finissant à y=133, aurait de plus coupé les tresses.

`p4-render.mjs` est le moteur P4 publié, copié sans modification. Le petit adaptateur `render.mjs` réutilise son SVG et ajoute au gros plan des deux coiffures **la même couche de longueurs avant que sur le personnage entier**, à la même place dans l’ordre de dessin. Aucun point, contour, détail ou ancrage capillaire n’est déplacé.

Le cadrage devient `0 0 160 205` pour ces deux gros plans. Il contient les deux tresses, leurs attaches et leurs pointes sur toute la plage morphologique autorisée. Pour les très longs ondulés, il montre plusieurs vagues jusqu’au buste : les pointes à la taille restent hors du gros plan, visibles sur le personnage entier. La hauteur du panneau passe à 300 px seulement pour ces deux coiffures, pour conserver un visage agrandi.

`smallScale:true` garde les miniatures à l’identique. Les seize autres gros plans, tous les personnages entiers, la galerie, les corps, les couleurs, les huit paramètres continus, le système P3-R1 et les deux références artistiques restent inchangés. Aucun nouveau système d’interaction coiffure–corps.

## Comparaisons visuelles

Captures WebKit, sans retouche, produites par le test navigateur :

| Coiffure | Neutre | Combinaison iPad R1 | Allongé / front haut |
| --- | --- | --- | --- |
| Tresses | [Avant / après](captures/webkit-braids-neutral-before-after.png) | [Avant / après](captures/webkit-braids-priority-before-after.png) | [Avant / après](captures/webkit-braids-tall-before-after.png) |
| Très longs ondulés | [Avant / après](captures/webkit-waist_waves-neutral-before-after.png) | [Avant / après](captures/webkit-waist_waves-priority-before-after.png) | [Avant / après](captures/webkit-waist_waves-tall-before-after.png) |

Captures de l’interface tactile : [Tresses](captures/webkit-braids-ipad.png), [Très longs ondulés](captures/webkit-waist_waves-ipad.png). Les anciennes captures corporelles P4 sont conservées, puisque leurs personnages entiers restent strictement identiques.

## Vérifications

```sh
npm ci
node --test bio-vis-p4-r1/*.test.mjs
npx playwright install --with-deps chromium webkit
node bio-vis-p4-r1/browser.test.cjs
npm test
```

- **8 tests Node** : intégrité de la base P4 et des modules P3-R1 ; 18 coiffures, six corps et huit paramètres ; 4 608 combinaisons extrêmes pour les coordonnées, ancrages et calottes ; 5 904 sondes de continuité ; personnages entiers et miniatures identiques à P4 sur 4 608 états ; seize autres gros plans inchangés ; 512 gros plans corrigés réutilisant exactement les mêmes longueurs.
- **Chromium et WebKit, par navigateur** : suite P4 conservée (756 états SVG, 88 026 points de recouvrement, 216 cadrages corporels), puis **512 gros plans extrêmes** ; tresses entières sans coupe des attaches ; au moins trois détails d’ondulation entièrement dans le cadrage par côté ; géométrie avant identique à celle du personnage entier et ordre de superposition préservé.
- Contrôles tactiles des huit paramètres sur sept coiffures représentatives, galerie 18, six corps, trois échelles, quatre formats, ancres, références, sauvegarde sentinelle intacte et contrôles hors réseau après chargement. Six comparaisons interactives ; personnage entier et miniature avant/après identiques.
- Workflow dédié `bio-vis-p4-r1.yml`. Les tests du jeu restent dans le workflow existant, sans changement.

Régénérer les captures : `CAPTURE_DIR=bio-vis-p4-r1/captures node bio-vis-p4-r1/browser.test.cjs`.

## Périmètre et limites

Branches et PR ouvertes examinées avant la correction, notamment #31 ; aucun AGENTS.md trouvé. Mémoire de continuité consultée sur `docs/llm-project-memory` (fichiers sous `docs/ai/`, absents à ce chemin sur main). La correction ne touche ni le jeu, ni les sauvegardes, ni les autres prototypes, ni les formes du visage. Les copies artistiques et les modules dynamiques sont vérifiés contre les fichiers déjà publiés.

Les réserves corporelles exploratoires de P4 restent valables et visibles : pas de nouvelle collision, déformation corporelle ou physique capillaire. WebKit Playwright avec format tactile iPad ne remplace pas Safari sur l’appareil physique. Les captures et tests techniques ne valent pas validation artistique de cette finition.

La publication Pages ajoute uniquement `preview/bio-vis-p4-r1/` à main, par snapshot statique indépendant. La PR de code n’est pas fusionnée.
