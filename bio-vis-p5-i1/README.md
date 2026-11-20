# BIO-VIS-P5-I1 — Lot A expérimental

Neuf références **19–27**, chacune sélectionnable avec **G et D** : 18 arrangements du lot A, en plus des **18 coiffures P4-R1 inchangées**. G/D désigne les deux illustrations de chaque case, sans catégorie de personnage. Le lot est expérimental, **non validé graphiquement** ; P4-R1 est la référence validée à 100 % par l’utilisateur dans la mission présente.

- [Preview P5-I1](https://thsethse.github.io/Microcosme/preview/bio-vis-p5-i1/)
- [Comparaisons avec P4-R1 et six corps](https://thsethse.github.io/Microcosme/preview/bio-vis-p5-i1/comparison.html)
- [Base validée conservée](https://thsethse.github.io/Microcosme/preview/bio-vis-p4-r1/)
- [Planche A principale](references/P5-A.png), [seconde image A](references/P5-A-alternative.png), [habitants](references/inhabitants.png), [V1](references/catalogue-v1.png).

## Audit et autorité

Base main : `f5cb1967cef8fa7d0d58c622502cb6f784188e1d`. Branches et PR actuelles vérifiées ; #32 et #33 sont ouvertes en brouillon et ne sont pas fusionnées. Aucun AGENTS.md retrouvé dans le dépôt/les checkouts ; la recherche de la préparation P5-DOC sur 40 arbres distants est également consignée dans son audit.

Les **sept documents #33** sont consultés directement sur `docs/p5-doc-catalogue-capillaire`, commit `0d8cc1dccea821c14c35ac4addf46bafa753bc86` : README, AUDIT, ANNEXE_RELEVE, CATALOGUE, DOUBLONS, CONTRAT_ARTISTIQUE, CONTRAT_TECHNIQUE. Ils restent intacts sur leur branche. Leur ancienne interdiction de programmation concernait P5-DOC ; la mission P5-I1 autorise uniquement l’implémentation du lot A. Aucun modèle B–F n’est ajouté.

Code et tests #32 examinés sur `codex/bio-vis-p4-r1`, commit `e9aadf830956dbfde172d25a30efa302f6bab7b1` : modèle, rendu, tests Node et navigateur. Le snapshot publié `preview/bio-vis-p4-r1/` provient de `6cc2750`. Les 15 modules de `base/` sont copiés **octet pour octet** de ce snapshot et restent vérifiés contre lui. L’extension ne remplace ni son modèle dynamique ni les personnages. Les contrats de continuité déjà consultés par P5-DOC restent applicables, sans programmation biologique.

Les **huit PNG P5** du dépôt ont été ouverts visuellement : A C7BE… et A DE895…, B 0F3C…, C 7C197…, D FAC68…, E v1 B409…, E v2 D9BC…, F 132E…. Aucune référence attendue n’est inaccessible. Les sept correspondances et SHA sont ceux de l’audit #33 ; les deux A servent au lot, les autres sont examinées mais pas programmées.

| Copie autonome | Source de `docs/ai/visual-references/` | SHA-256 |
| --- | --- | --- |
| `references/P5-A.png` | `C7BEACBF-323B-4D6F-ABFF-92A988EC909F.png` | `1720d4d5e26b6bcbebc1b20176bd3163090d8deea1af96061befd43cc60030ae` |
| `references/P5-A-alternative.png` | `DE8951BB-1A2D-41E0-8542-7DDC8E392E27.png` | `559099857af6fd418499bd0f1ab7bf933fff37c64a04a90c7621be39ffc126c6` |
| `references/inhabitants.png` | `BIO-VIS-P1-planche-originale.png` | `ddb6a8515fcedd0bdc4493bdc3fe3afb32322706012186f481efa764875c3e06` |
| `references/catalogue-v1.png` | `a_clean_infographic_character_design_sheet_in_warm.png` | `06dec2e59f34f195363cf482d51cae34808d4d3b3ff1e8863e8ba217bf571932` |

Copies vérifiées par comparaison binaire aux fichiers du dépôt, et PNG déjà décodés lors de l’audit des références. Les couleurs proviennent des palettes P4-R1 (dont sa palette monochrome), sans échantillonnage des posters. Aucune image n’est utilisée comme texture de rendu.

## Arrangements effectivement intégrés et mutualisations

| ID | G | D | Construction et réutilisation |
| --- | --- | --- | --- |
| `p5-019` · Raie classique | Grande vague courte à raie latérale | Carré arrondi à grand balayage latéral | Calotte et arrière court P3-R1 ; nouveau panneau S et côtés ajustés. |
| `p5-020` · Dégradé court | Dessus pointu sur tempes très courtes | Frange irrégulière balayée | Deux contours distincts ; bandes courtes aux tempes G et région découverte explicite. Calotte R1 conservée dans la région supérieure. |
| `p5-021` · Carré moderne | Même vague courte que 19-G | Carré à ligne basse plus nette | **19-G = 21-G**, construction mutualisée, car les vignettes G sont pratiquement équivalentes. Les deux références restent sélectionnables. D diffère par le contour et la terminaison, pas par un simple renommage. |
| `p5-022` · Ondulations souples | Ondulations courtes retournées aux tempes | Longs rubans à trois grandes vagues | Repères et principe de rubans latéraux P4 réutilisés ; nouveaux retours courts et courbes longues avec raccords tangents. |
| `p5-023` · Effet coiffé-décoiffé | Grandes pointes désordonnées | Chignon haut irrégulier avec deux mèches libres | Nouveau contour en pointes ; chignon à lobes construit localement depuis la couronne, mèches pendantes, lien amovible. |
| `p5-024` · Queue-de-cheval | Queue basse derrière la nuque, racines tirées | Queue haute décentrée | G : nouvelle queue et implantation tirée. D : **géométrie `pony` P4-R1 réutilisée**, lien séparé de la chevelure. Détails et lien de la queue arrière sont rendus avant le corps/visage. |
| `p5-025` · Undercut | Quiff relevé, deux tempes dégagées | Long panneau oblique à gauche, tempe droite dégagée | Nouveau quiff et panneau latéral ; calotte et frange limitées aux régions couvertes. Les tempes n’ont pas été remplies pour masquer leur exposition intentionnelle. |
| `p5-026` · Frange et mèches | Frange en pointes décalées | Frange droite sur longs côtés légèrement ondulés | G : nouveau contour/frange. D : **frange `fringe_bob` P4 réutilisée**, nouveaux côtés longs à ondulation faible. |
| `p5-027` · Boucles volumineuses | Macro-couronne à grosses boucles frontales | Implantation ouverte et cascade plus large à quatre vagues bouclées | Calotte de recouvrement R1 et repères P4 ; nouveau halo lobé et nouveaux volumes/traits de boucles. Les fronts G/D diffèrent, pas uniquement les longueurs. |

Le lot a **18 choix d’arrangement et 17 constructions géométriques distinctes en monochrome sans accessoires** : 19-G/21-G partagent la même construction. Parmi ces 17, la queue haute 24-D reprend celle de P4-R1. Les autres réutilisations portent sur des composants/repères, pas sur une coiffure générique renommée. Les rapprochements #33 sont documentaires : aucune référence n’est supprimée ni fusionnée.

## Architecture et dynamique

- `base/` : modules P4-R1 gelés ; `render.mjs` délègue intégralement les 18 anciens styles à leur rendu d’origine.
- `catalogue.mjs` : les neuf références, source/position, arrangements et bases ; aucune référence 28–81.
- `model.mjs` : réutilise normalisation, huit bornes, contour du visage, ancres et six corps P4-R1. Un ID inconnu déclenche une erreur au lieu de retomber silencieusement sur `classic`.
- `hair.mjs` : assemblages du lot, repères de couronne/front/tempes/joues/bajoues/mâchoire/nuque, longueurs locales, textures et accessoires séparés. Pas de transformation uniforme de toute la coiffure.
- `render.mjs` : masses arrière et accessoires arrière → corps existant → visage/calotte/front/côtés/texture → longueurs avant → accessoires avant. Les contours du visage et du corps ne sont pas modifiés.
- Gros plan et miniature du lot réutilisent **tous les mêmes chemins capillaires**, sans omission de la couche avant. Le cadrage varie selon la longueur ; les coiffures et cadrages existants restent inchangés.
- Les masques locaux 20-G, 25-G et 25-D ne couvrent pas le visage ; ils délimitent les cheveux sur les coupes rasées. La limite rasée est ancrée cinq unités au-dessus des tempes, et non à la hauteur du front : elle laisse le coin supérieur du crâne couvert même lorsque front et crâne s’élargissent. La calotte R1 conserve ses normales et marges dans les zones couvertes. IDs de clips distincts dans l’interface, pour éviter les interactions entre SVG.

Les paramètres ne changent pas : largeur/hauteur du crâne, largeur/hauteur du front, tempes, joues, bajoues, mâchoire. Les attaches se déplacent dans leur repère anatomique, les largeurs de côté suivent les passages des joues/bajoues, les terminaisons suivent la nuque/mâchoire. La répétition des mèches garde sa topologie pendant les variations.

## Interface et comparaisons

Galerie 19–27 avec deux boutons G/D par case ; sélecteur de 27 références/styles ; accès aux 18 existantes ; trois vues simultanées ; six corps ; presets visage et cas iPad combiné ; huit curseurs ; ancres ; reset ; monochrome sans accessoires et liens amovibles pour les nouveaux modèles. Les petits liens intégrés aux 18 modèles historiques restent dans leur rendu validé, sans ajout d’ornements. Aucun accessoire d’oreille, visage ou poster n’a été repris.

La page `comparison.html` compare chaque arrangement avec un modèle P4-R1 apparenté, avec trois échelles et six corps. Ce sont des **comparaisons de familles**, pas des « avant/après » d’un modèle auparavant existant ; le modèle P5 n’existait pas dans P4-R1. La mutualisation exacte 24-D est indiquée ci-dessus.

Captures WebKit, sans retouche : [galerie couleur](captures/webkit-lot-a.png), [galerie monochrome](captures/webkit-lot-a-monochrome.png), [20-G iPad](captures/webkit-p5-020-G-ipad.png), [25-D iPad](captures/webkit-p5-025-D-ipad.png), [27-D iPad](captures/webkit-p5-027-D-ipad.png).

| Référence | Comparaison G / P4-R1 + six corps | Comparaison D / P4-R1 + six corps |
| --- | --- | --- |
| 19 | [G](captures/webkit-p5-019-G-comparison.png) | [D](captures/webkit-p5-019-D-comparison.png) |
| 20 | [G](captures/webkit-p5-020-G-comparison.png) | [D](captures/webkit-p5-020-D-comparison.png) |
| 21 | [G](captures/webkit-p5-021-G-comparison.png) | [D](captures/webkit-p5-021-D-comparison.png) |
| 22 | [G](captures/webkit-p5-022-G-comparison.png) | [D](captures/webkit-p5-022-D-comparison.png) |
| 23 | [G](captures/webkit-p5-023-G-comparison.png) | [D](captures/webkit-p5-023-D-comparison.png) |
| 24 | [G](captures/webkit-p5-024-G-comparison.png) | [D](captures/webkit-p5-024-D-comparison.png) |
| 25 | [G](captures/webkit-p5-025-G-comparison.png) | [D](captures/webkit-p5-025-D-comparison.png) |
| 26 | [G](captures/webkit-p5-026-G-comparison.png) | [D](captures/webkit-p5-026-D-comparison.png) |
| 27 | [G](captures/webkit-p5-027-G-comparison.png) | [D](captures/webkit-p5-027-D-comparison.png) |

Captures complémentaires du cas combiné iPad : [25-G](captures/webkit-p5-025-G-priority.png), [25-D](captures/webkit-p5-025-D-priority.png), [27-D](captures/webkit-p5-027-D-priority.png).

## Tests reproductibles

```sh
npm ci
node --test bio-vis-p5-i1/model.test.mjs
npx playwright install --with-deps chromium webkit
node bio-vis-p5-i1/browser.test.cjs
npm test
```

- **8 tests Node** : 27 IDs ; neuf références et deux arrangements réels ; 17 signatures géométriques du lot en monochrome ; 15 modules de base et quatre images intacts ; **4 608 états existants** strictement identiques aux trois échelles ; **4 608 états nouveaux** avec coordonnées finies, mêmes visage/ancres et longueurs partagées ; **3 024 sondes locales de continuité** sur huit paramètres ; six corps ; mutualisations effectives et accessoires retirables.
- **Par navigateur (Chromium et WebKit)** : **4 608 états nouveaux interprétés par SVG**, **540 états** pour les zones couvertes et les visages (16 combinaisons extrêmes, neutre, cas iPad et 12 intermédiaires, par arrangement), **66 093 points de recouvrement**, **150 témoins de zones volontairement découvertes**, **324 cadrages corporels** et **108 comparaisons exactes des trois vues existantes**. Les clips sont pris en compte dans les tests de remplissage ; une tempe rasée n’est pas un trou à reboucher.
- Interface : 18 boutons G/D et 18 anciennes coiffures, six corps, huit contrôles tactiles sur huit arrangements représentatifs, ancres, trois échelles, quatre formats jusqu’au téléphone, références chargées, reset, contrôles hors réseau après chargement et sentinelle de sauvegarde intacte. Comparaisons des neuf références sur les presets de visage et les six corps.
- Les 256 coins sont interprétés par le moteur SVG ; le contrôle détaillé de recouvrement utilise la matrice plus petite de 540 états. Les résultats techniques ne prouvent pas l’identité artistique de toutes les combinaisons.
- Workflow dédié `.github/workflows/bio-vis-p5-i1.yml`, Ubuntu 24.04 ; workflow de non-régression du jeu conservé.

Régénérer les captures : `CAPTURE_DIR=bio-vis-p5-i1/captures node bio-vis-p5-i1/browser.test.cjs`. Le test du jeu est celui du dépôt (35 tests Node), sans modification de ses modules ou de ses tests.

## Limites et différences par rapport aux images

- Les proportions et les corps sont ceux de P4-R1 : les contours capillaires ont été reconstruits dans ce repère, sans reprendre les visages, expressions, bustes ou ombrages des posters. Les images ne montrent pas tous les dos/profils ou la longueur complète sous leur cadrage ; le prototype reste frontal.
- Les coupes courtes et les pointes sont volontairement simplifiées en contours peu nombreux. Le dégradé 20-G utilise de petites bandes de mèches, sans gradient tonal du poster. Sa lecture et celle de la frange 20-D/26-G sont à juger sur iPad.
- La raie 19-G/21-G est mutualisée ; les petites différences de tracé entre les deux dessins sources ne sont pas revendiquées comme deux constructions nouvelles.
- 27-D utilise de grands lobes/ondulations et de petits retours de boucle, sans la densité ni les ombres du poster. La séparation visuelle entre boucles et ondulations à petite échelle reste à valider par l’utilisateur.
- Les accessoires non capillaires, en particulier l’anneau d’oreille de 25-D, sont omis. Les liens 23-D et 24-G/D sont séparés et amovibles ; ils ne changent pas l’implantation.

## Observations corporelles réellement faites

Inspection des captures et de la page comparative sur les six corps, tête neutre, complétée par les cas combinés automatisés :

| Cas | Observation visible | Limite conservée |
| --- | --- | --- |
| 24-G, queue basse arrière | La silhouette mince révèle la queue ; le corps de référence et surtout les épaules larges en masquent une grande partie. Le buste volumineux en coupe aussi la lecture au passage derrière l’épaule. | Aucune projection de la queue autour de l’épaule. Ses traits et son lien sont désormais correctement derrière le corps/visage, sans ligne traversant le buste. |
| 22-D / 26-D | Les longues mèches avant restent verticales au passage des épaules et se superposent aux bords de poitrine sur les corps larges. | Pas d’écartement selon la largeur ou le volume du buste. |
| 25-D | Le panneau oblique gauche descend devant le haut de l’épaule et reste à côté du corps mince, alors qu’il recouvre davantage le haut du buste large. | La profondeur est fixée par mèche, sans gestion de collision. |
| 27-D | La masse de boucles couvre les contours latéraux du buste et masque une partie de la lecture des bras sur les épaules larges. | Pas de déformation du corps ni d’ajustement mécanique des boucles. |
| 23-D | Les deux mèches fines pendent près des épaules et du cou ; leur trajet ne change pas avec le corps. | Les attaches suivent la tête, pas une nouvelle anatomie corporelle. |

Un défaut de couche détecté pendant la comparaison 24-G (trait arrière dessiné devant le buste) a été corrigé dans la composition, sans nouveau système de collisions. Les occlusions restantes ci-dessus sont visibles et documentées, pas dissimulées par un changement du visage ou du corps.

WebKit Playwright avec format et événements tactiles iPad n’est pas Safari sur un iPad physique. La validation graphique et le confort réel sur l’appareil restent à faire. Aucun lot B–F ne doit commencer ni aucune PR être fusionnée sans la suite explicitement validée par l’utilisateur.

Branche indépendante `codex/bio-vis-p5-i1-lot-a`, PR sans fusion ; publication Pages séparée par ajout du seul dossier `preview/bio-vis-p5-i1/` sur main. Aucun fichier du jeu, sauvegarde, prototype précédent ou document #33 n’est modifié.
