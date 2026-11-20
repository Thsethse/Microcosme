# Audit des sources et de la base technique

Audit documentaire du 19 novembre 2026, heure de référence Europe/Paris. Base main : `f5cb1967cef8fa7d0d58c622502cb6f784188e1d` (huit PNG ajoutés par upload après la publication P4-R1). Branche documentaire : `docs/p5-doc-catalogue-capillaire`.

## Sept planches attendues : toutes retrouvées

Les fichiers ont été ouverts visuellement, décodés et vérifiés comme PNG valides, 1536 × 1024, RGB. Aucun nom de fichier ne suffit à attribuer la planche : l’identification ci-dessous vient du titre et des cases visibles. **Aucune des sept images attendues ne manque à la révision auditée.** Les deux versions E sont conservées. Leur attribution v1/v2 est confirmée explicitement par l’utilisateur pendant cette mission ; elle n’est pas déduite de l’ordre alphabétique des UUID.

| Planche | Numéros imprimés → inventaire | Fichier retrouvé | Octets | SHA-256 |
| --- | --- | --- | ---: | --- |
| P5-A | 19–27 | [C7BEACBF-323B-4D6F-ABFF-92A988EC909F.png](../visual-references/C7BEACBF-323B-4D6F-ABFF-92A988EC909F.png) | 1874314 | `1720d4d5e26b6bcbebc1b20176bd3163090d8deea1af96061befd43cc60030ae` |
| P5-B | 28–36 | [0F3CDCE7-24D6-40E4-80D8-4BE2429238AF.png](../visual-references/0F3CDCE7-24D6-40E4-80D8-4BE2429238AF.png) | 2040322 | `34dfc2fd739c14fcd08dd37d34a60b702d63d84c35fc4a9193f1616eb51927e0` |
| P5-C | 37–45 | [7C197DD6-3733-4B37-A0B0-B265FF034BD8.png](../visual-references/7C197DD6-3733-4B37-A0B0-B265FF034BD8.png) | 2086899 | `d8d6023dab3767e6ae7fe26e6c5354b750afa73e3b026f9addba686d125b0778` |
| P5-D | 46–54 | [FAC68E60-6567-4D1A-B299-46A07B836D27.png](../visual-references/FAC68E60-6567-4D1A-B299-46A07B836D27.png) | 2086198 | `73fdd8bf3475c636499abdd5690731bbd93cc4a140f2b67f9a698dafb0827db5` |
| P5-E v1 | 55–63 | [B4099DCA-66B1-4415-8C50-53AA5CFA1C04.png](../visual-references/B4099DCA-66B1-4415-8C50-53AA5CFA1C04.png) | 2205692 | `650f56f20c61d079939944f215751332a3fd07e578ea254aa2dbbcfb3a81f4f2` |
| P5-E v2 | 55–63 → 73–81 | [D9BC5231-48E8-4880-9A7B-46573494504D.png](../visual-references/D9BC5231-48E8-4880-9A7B-46573494504D.png) | 2023883 | `0dacb699db29bb5d80df7757906959ca981d11411a9bce025d3bf09b8a5507c8` |
| P5-F | 64–72 | [132E23ED-C1DE-4311-8BAF-B56E09277B56.png](../visual-references/132E23ED-C1DE-4311-8BAF-B56E09277B56.png) | 2206850 | `0a319475c39c7657ba37c65e4e6083d3778c7443ad23ebd5d5c0539688e6c5c7` |

## Image supplémentaire et références déjà validées

Une **huitième image P5**, [DE8951BB-1A2D-41E0-8542-7DDC8E392E27.png](../visual-references/DE8951BB-1A2D-41E0-8542-7DDC8E392E27.png), présente une seconde édition visuelle de P5-A : mêmes neuf cases 19–27, mêmes intitulés et arrangements G/D. Elle a davantage d’ombres et quelques détails de contours différents. Ce n’est pas un doublon binaire : les deux fichiers sont conservés. C7BE… sert de source principale documentaire pour A, sans prétention d’antériorité chronologique. Les neuf correspondances sont explicitées dans [DOUBLONS.md](DOUBLONS.md).

| Source complémentaire | Dimensions / format | SHA-256 | Rôle |
| --- | --- | --- | --- |
| [DE8951BB-1A2D-41E0-8542-7DDC8E392E27.png](../visual-references/DE8951BB-1A2D-41E0-8542-7DDC8E392E27.png) | 1536 × 1024, PNG, RGB | `559099857af6fd418499bd0f1ab7bf933fff37c64a04a90c7621be39ffc126c6` | P5-A supplémentaire, même grille ; conservée sans ajouter neuf IDs |
| [BIO-VIS-P1-planche-originale.png](../visual-references/BIO-VIS-P1-planche-originale.png) | 2480 × 3508, PNG, RGBA | `ddb6a8515fcedd0bdc4493bdc3fe3afb32322706012186f481efa764875c3e06` | Autorité des habitants ; ne pas remplacer les personnages P4-R1 |
| [a_clean_infographic_character_design_sheet_in_warm.png](../visual-references/a_clean_infographic_character_design_sheet_in_warm.png) | 1536 × 1024, PNG, RGB | `06dec2e59f34f195363cf482d51cae34808d4d3b3ff1e8863e8ba217bf571932` | V1, douze coiffures existantes 01–12 |

L’original au nom atypique `docs/BIO-VIS-P1-planche-originale.png..png` est également présent ; sa copie canonique ci-dessus est utilisée. Les copies `references/` des previews P4 et P4-R1 ne sont pas de nouvelles planches. Les captures avant/après sont des preuves de rendu, pas des modèles P5 supplémentaires.

## Audit Git et continuité

- **40 branches distantes** inspectées après `git fetch origin`, hors alias HEAD, avant la création de cette branche documentaire distante. Recherche d’`AGENTS.md` dans les arbres complets de ces 40 révisions : **aucun trouvé**. Recherche également dans les checkouts disponibles sous `/workspace` : aucun. Portée : branches distantes accessibles, pas des objets Git supprimés ou des branches non publiées.
- **30 PR examinées**, dont 25 ouvertes et cinq fusionnées, au relevé préalable. Les PR de prototypes #23, #25, #27–#32 sont ouvertes en brouillon ; les travaux P4/P4-R1 ne sont pas fusionnés. Aucune action de fusion, clôture ou modification de ces PR.
- La continuité n’est pas un répertoire `docs/llm-project-memory/` de main. Les documents se trouvent sur la branche `docs/llm-project-memory`, sous `docs/ai/`, révision `f416ab15c4367e8ced1f26d4ebd13813023d2434` : `START_HERE.md`, `PROJECT_STATE.md`, `DECISION_REGISTER.md`, `WORK_LOG.md` lus. Ils distinguent décisions conceptuelles et implémentation et n’autorisent pas une programmation biologique. La mission présente autorise uniquement la documentation P5.
- Les documents historiques de main `DIRECTION-ARTISTIQUE-v0.9.md` et `ARCHITECTURE-GRAPHIQUE-v0.9.md` ont été examinés. Ils décrivent notamment l’ancien rendu pixel art du jeu. Ils ne remplacent pas la direction vectorielle P4-R1 explicitement retenue par l’utilisateur pour P5.

## Fichiers de la référence P4-R1

La [preview validée](https://thsethse.github.io/Microcosme/preview/bio-vis-p4-r1/) est publiée par `6cc2750c7a2caae406fd371de915170221baa9a8`. Le code et les tests de la [PR #32](https://github.com/Thsethse/Microcosme/pull/32), branche `codex/bio-vis-p4-r1`, sont à `e9aadf830956dbfde172d25a30efa302f6bab7b1`. Cette mission ne les modifie pas.

| Chemin, sous `preview/bio-vis-p4-r1/` | Fonction observée |
| --- | --- |
| `catalogue.mjs` | 18 identifiants existants, métadonnées, six corps ; liste fermée |
| `model.mjs` | Normalisation du style et du corps ; délégation au modèle P3-R1 |
| `p4-render.mjs` | Construction des coiffures et couches avant/arrière ; coordonnées locales |
| `render.mjs` | Adaptateur P4-R1 ; restaure les longueurs avant pour `braids` et `waist_waves` en gros plan, miniature préservée |
| `r1/model.mjs` | Huit contrôles, contour du crâne et ancrages anatomiques/capillaires |
| `r1/coverage.mjs` | Recouvrement local du haut du crâne à partir de son contour réel |
| `r1/render.mjs`, `r1/source-render.mjs` | Trois modèles de tête validés et composition de couches |
| `r1/p2/hair-model.mjs`, `r1/p2/hair-render.mjs` | Dépendances capillaires héritées |
| `r1/p2/base/model.mjs`, `r1/p2/base/render.mjs` | Formes des habitants et des corps héritées ; pas d’import d’un corps P5 |
| `app.mjs`, `style.css`, `index.html` | Atelier tactile, sélection et trois échelles |
| `comparison.html`, `comparison.mjs` | Six comparaisons avant/après P4-R1 |
| `audit.html`, `audit.mjs` | 36 comparaisons corporelles P4 |
| `references/`, `captures/`, `README.md`, `P4-BASELINE.md` | Deux références, quinze captures et documentation |

Total publié : 38 fichiers, dont 15 modules `.mjs`. Sur la branche de code #32, les tests sont `bio-vis-p4-r1/model.test.mjs`, `closeup.test.mjs`, `browser.test.cjs`, avec `.github/workflows/bio-vis-p4-r1.yml`. Ils ne sont pas dans le snapshot Pages. Le [contrat technique](CONTRAT_TECHNIQUE.md) décrit les limitations observées de la liste de styles et du sélecteur de gros plans.

Les résultats précédents mentionnés par #32 (8 tests Node, 512 gros plans par navigateur, etc.) sont historiques. **Aucun nouveau test de coiffure, aucun rendu P5 et aucun essai Safari physique n’est exécuté dans cette mission documentaire.**

## Autres ressources documentaires inventoriées

Le relevé exhaustif des chemins d’images/PDF sous `docs/` dans les 40 arbres contient **82 chemins uniques**, dont 15 présents dans main et 67 dans les autres branches. Les 10 images de `docs/ai/visual-references/` incluent les huit P5 et les deux références P1/V1. Aucun PDF documentaire n’a été trouvé dans ce relevé.

| Groupe | Nombre de chemins uniques | Usage dans cet audit |
| --- | ---: | --- |
| `docs/BIO-VIS-P1-planche-originale.png..png` | 1 | Original des habitants, alias canonique vérifié |
| `docs/ai/visual-references/` | 10 | Inventaire des sources, images ouvertes et identifiées |
| `docs/apercus-v09/` | 4 | Captures du jeu ancien : jour, nuit, crépuscule, village ; hors source capillaire P5 |
| `docs/bio-gen-t1-b2/EXEMPLES.png` | 1 | Capture ancienne inspectée : pixel art, hors autorité P5 |
| `docs/bio-gen-t2/REFERENCE_ARTISTIQUE_T2.png` | 1 | Planche conceptuelle ancienne inspectée : pixel art, hors autorité P5 |
| `docs/bio-struct-t3-a/` | 36 | Captures d’itérations antérieures ; pas de nouvelles planches P5 |
| `docs/bio-struct-t3-b1/` | 18 | Captures d’itérations antérieures ; pas de nouvelles planches P5 |
| `docs/bio-struct-t3-b2/` | 9 | Captures de textures/coupes/tailles ; hors contrat P4-R1 retenu |
| `docs/v4-i1/` | 2 | Photographies clairière/grotte ; hors source capillaire |

Les chemins et leurs branches accessibles figurent dans [ANNEXE_RELEVE.md](ANNEXE_RELEVE.md). Les captures anciennes y sont classées par contexte documentaire ; elles ne sont pas toutes réévaluées artistiquement pour P5. Les assets SVG de forêt et les previews non capillaires ont aussi été repérés et exclus du catalogue. Leur existence ne constitue pas une planche capillaire manquante ou substitutive.
