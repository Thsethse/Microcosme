# BIO-COL-01 — Palettes capillaires

## Autorisation et base vérifiée

L’utilisateur autorise explicitement BIO-COL-01 : programmation, branche indépendante, PR brouillon, tests et preview Pages. Cette autorisation permet l’exécution du [contrat intégral au commit demandé](https://github.com/Thsethse/Microcosme/blob/e6fd39680bfe43e801069c9046f75f09d9ade1ff/docs/ai/bio-vis-dedup-01/CONTRAT_BIO_COL_01.md), dont le dépôt documentaire ne suffisait pas à autoriser le code.

Avant modification : inspection de `main`, des branches et PR ouvertes et recherche d’instructions `AGENTS.md` dans l’espace de travail, ses répertoires cachés et les ancêtres ; aucun `AGENTS.md` retrouvé. Lecture du README du dépôt, du contrat du lot 3, du rapport et du README complets de la branche du lot 3, ainsi que des composants P5-I6 et lots 1/2 effectivement importés.

Les PR **#42, #43 et #44 restent en brouillon et non fusionnées**, aux têtes respectives `1ff931586776b3f7ed41bbdc5772b97e030aa4db`, `4156254ca5a9b4a52f138a558bd70d461f4d4c4e`, `576ee961b5be385e6cceb2f357ffe74341b0d05f`. Une validation graphique n’autorise aucune fusion.

Branche indépendante : **`codex/bio-col-01`**, issue de `main` **`9590c809e8b1e316da4f8b11466ebd9e02e322fb`**. Elle utilise directement le rendu publié après lot 3 :

| Composant réutilisé | Provenance |
| --- | --- |
| Lot 3 | Source d’exécution `f8c70e23cdea56cd506e837a9587035af9e2c81f`, dans `preview/bio-vis-dedup-lot-3/` |
| Lot 2 | Source publiée `94bffaf0cf6fddc5d0f40ebebf21c76ed5acaddf` |
| Lot 1 | Source publiée `5ea862510b04904904241a09695be4c9141ce4a8` |
| P5-I6 | Modèle, catalogue canonique, corps, visage, ancrages et références hérités par ces rendus |

**129 fichiers hérités inchangés**, vérifiés par SHA-256 : [manifeste complet](../../../bio-col-01/tests/frozen-manifest.json). Aucun artefact précédent n’est remplacé.

## Périmètre et API

Une couche de peinture isolée s’ajoute au rendu existant. Aucun changement de moteur biologique, gènes, hérédité, vieillesse, simulation, sauvegarde, interface principale ou géométrie. Aucun lot 4 ou 5, aucune intégration au jeu.

```js
character(input);                         // Historique exact.
character(input,{hairColor:'blond-pale'}); // Aplat + contour explicite.
character(input,{hairColor:'historical'}); // Historique exact.
```

La nouvelle option **`options.hairColor`** accepte les 26 identifiants finis proposés. Elle reste séparée du contenu historique `input` et n’est pas écrite dans une sauvegarde. `undefined`, `null` et `historical` délèguent directement au rendu historique, avec les mêmes octets. Un identifiant inconnu est rejeté.

Les exports du catalogue, de sélection et de géométrie `hairLayers` sont **les mêmes fonctions/objets** que ceux du lot 3. Les **72 références**, **126 choix historiques**, **120 entrées ordinaires** et les six regroupements du lot 2 sont conservés. 61-G reste chargeable avec ses deux mèches, sans remplacement silencieux par 56-G. Aucun champ historique de couleur/contraste ni métadonnée inconnue n’est perdu à la relecture.

## Séparation des surfaces et accessoires

Le rendu utilise des calques explicites : `rear`, `back`, `volume`, `front`, `sides`, `texture`, `lengths`. La coloration parcourt les balises du SVG produit par cette base figée et remplace **uniquement les valeurs des attributs `fill` et `stroke` existants** des formes capillaires. Elle conserve `none`, les attributs absents, l’opacité, les largeurs de trait, les clips, les coordonnées, les ancres, le nombre et l’ordre des éléments. Les tracés internes gardent la même géométrie et reçoivent la teinte du contour.

Le visage, le corps, les yeux, les vêtements, les bijoux, bandeaux et tous les calques `accessories*`, `color`, ainsi que les définitions SVG, ne sont pas recolorés. Aucune substitution globale des anciennes couleurs dans tout le SVG.

L’audit des 126 rendus entiers avec accessoires a trouvé **3 335 formes dans les calques capillaires**, dont les **quatre liens P4 intégrés** aux tracés (deux dans `braids`, un dans `pony`, un dans `side_braid`). Ces liens sont isolables par leurs fragments exacts issus du générateur historique, avec leur morphologie courante ; ils sont exclus de la coloration. Ils ne sont ni supprimés ni transformés. Les 19 opacités de tracés internes historiques restent inchangées.

Les **calques de contraste de 50-G et 62-D** sont préservés tels quels, avec leur flag d’activation historique. La nouvelle teinte principale n’ajoute aucune zone multicolore ; une bande historique peut donc conserver sa teinte originale sur ces deux choix. Le contrôle « Contrastes historiques » permet d’examiner l’aplat principal seul en désactivant leur couche existante. Il ne constitue pas un nouveau système de coloration par zone.

Les quatre liens P4 intégrés restent visibles selon le comportement historique, même lorsque leur ancien modèle ignore le flag d’accessoires. Les autres accessoires suivent leur activation habituelle. Pour les références rasées, inconnues ou sous objet, la coloration ne crée aucun volume ni cheveu caché.

## Calcul du contour

Méthode simple, déterministe, sans éclairage :

1. Conversion du sRGB de l’aplat vers **OKLab** (gamma sRGB retiré, matrices puis racines cubiques).
2. Calcul de la clarté du contour : **`L_contour = max(0,035 ; 0,64 × L_aplat − 0,045)`**.
3. Conservation de la direction chromatique `(a,b)` ; chroma réduite à 80 % au maximum, puis réduite davantage par **20 étapes fixes** de recherche si la teinte sort du gamut sRGB.
4. Conversion sRGB et arrondi déterministe en six chiffres hexadécimaux.

La teinte de contour reste de la même famille chromatique. Les blancs produisent des gris chauds, les blonds des contours bruns/ocres, les couleurs saturées des contours apparentés plus profonds. Aucun contour noir imposé à toute la palette, aucun dégradé, reflet, texture ajoutée ou effet lumineux.

Le garde-fou concerne la **palette finie effectivement offerte**, pas toutes les couleurs RGB imaginables : contours plus sombres, différence de clarté OKLab supérieure à 0,10 et rapport de luminance aplat/contour d’au moins **1,35**. Ce rapport sert d’indice pour les traits fins ; **ce n’est pas un seuil WCAG de texte ni une validation artistique**. Le noir absolu ne pourrait pas recevoir un contour plus sombre : le noir profond proposé est légèrement relevé pour garder une différence utile.

Limite pertinente : le noir profond reste le cas de contraste interne le plus faible (**1,36**), contre environ **3,97** pour le blanc ivoire. Les traces internes qui héritent d’une opacité historique restent plus discrètes. La palette et le calcul restent soumis à la revue artistique, notamment en miniature et sur fond sombre.

## Palette proposée, non encore validée artistiquement

26 nuances finies : **14 naturelles et 12 fantaisie**, regroupées en 13 familles de navigation. Les noms n’ont aucun sens biologique ni restriction liée au corps, à l’origine ou au statut. Les usages fantaisie (teinture, naissance, transmission) ne sont pas définis par ce prototype.

| Famille | Nuance | Identifiant | Aplat | Contour | Rapport indicatif |
| --- | --- | --- | --- | --- | --- |
| Naturelle · Noirs | Noir profond | `noir-profond` | `#29272f` | `#08070c` | 1,36 |
| Naturelle · Noirs | Noir ébène | `noir-ebene` | `#3a3035` | `#120b0f` | 1,53 |
| Naturelle · Bruns | Brun sombre | `brun-sombre` | `#4b2f25` | `#1c0904` | 1,59 |
| Naturelle · Bruns | Brun chocolat | `brun-chocolat` | `#694332` | `#2e1407` | 2,01 |
| Naturelle · Châtains | Châtain | `chatain` | `#875435` | `#3f1c04` | 2,43 |
| Naturelle · Châtains | Châtain clair | `chatain-clair` | `#a57950` | `#503112` | 3,05 |
| Naturelle · Blonds | Blond cendré | `blond-cendre` | `#b7a17a` | `#59492d` | 3,47 |
| Naturelle · Blonds | Blond doré | `blond-dore` | `#d7b966` | `#6c5612` | 3,70 |
| Naturelle · Blonds | Blond pâle | `blond-pale` | `#f0dfad` | `#786c48` | 3,93 |
| Naturelle · Roux | Roux cuivré | `roux-cuivre` | `#b95d32` | `#5a2000` | 2,85 |
| Naturelle · Roux | Roux auburn | `roux-auburn` | `#853d2d` | `#3f0b02` | 2,14 |
| Naturelle · Gris | Gris acier | `gris-acier` | `#737a83` | `#2f343b` | 2,89 |
| Naturelle · Gris | Gris perle | `gris-perle` | `#cbd0d4` | `#616467` | 3,83 |
| Naturelle · Blancs | Blanc ivoire | `blanc-ivoire` | `#f5f1e7` | `#797770` | 3,97 |
| Fantaisie · Rouges | Rouge vif | `rouge-vif` | `#ed344f` | `#74001b` | 2,96 |
| Fantaisie · Rouges | Rouge profond | `rouge-profond` | `#a12746` | `#490017` | 2,23 |
| Fantaisie · Roses | Rose clair | `rose-clair` | `#f0b6ce` | `#7b5364` | 3,77 |
| Fantaisie · Roses | Rose framboise | `rose-framboise` | `#d74691` | `#6d0042` | 2,99 |
| Fantaisie · Violets | Violet améthyste | `violet-amethyste` | `#9756bf` | `#481564` | 2,81 |
| Fantaisie · Violets | Violet profond | `violet-profond` | `#643c92` | `#2b0849` | 2,11 |
| Fantaisie · Bleus | Bleu vif | `bleu-vif` | `#3b66e3` | `#0b207d` | 2,77 |
| Fantaisie · Bleus | Bleu nuit | `bleu-nuit` | `#304680` | `#08153e` | 1,95 |
| Fantaisie · Turquoises | Turquoise clair | `turquoise-clair` | `#6dcfc8` | `#136661` | 3,68 |
| Fantaisie · Turquoises | Turquoise profond | `turquoise-profond` | `#238f96` | `#003f43` | 3,04 |
| Fantaisie · Verts | Vert émeraude | `vert-emeraude` | `#2c9b70` | `#00462f` | 3,15 |
| Fantaisie · Verts | Vert sauge | `vert-sauge` | `#99b57a` | `#43562c` | 3,55 |

## Preview

Cible : **https://thsethse.github.io/Microcosme/preview/bio-col-01/**

- Pastilles tactiles, familles naturelles/fantaisie, noms et codes exacts ; aplat et contour affichés pour la teinte sélectionnée.
- Comparateur **historique / aplat + contour** : même coiffure, visage, corps, morphologie et accessoires. Le contrôle explicite revient au rendu historique exact ; aucune variante ombrée.
- Trois tailles : **tête 300 px**, **entier 178 px**, **miniature 70×70 px**. Fonds **ivoire clair `#fffdf8`** et **ardoise sombre `#474c55`**.
- Une planche des **26 teintes sur la même coiffure**, avec miniatures sur les deux fonds ; une vue de **16 coiffures avec la teinte courante** (courtes, longues, boucles, tresses, chignons, nappes, corrections des lots 1 et 3).
- Six corps, huit paramètres morphologiques et les presets neutre, minima, maxima, iPad combiné, étroit/allongé et large. Aucun nouveau réglage biologique.
- Les 120 entrées ordinaires et 126 identifiants historiques restent sélectionnables. La couleur est une option de rendu en mémoire et n’altère pas l’aller-retour JSON des anciennes données.

Aucun accès aux sauvegardes réelles, à une API du jeu ni à un stockage persistant. Le choix de teinte n’est pas enregistré entre deux chargements.

## Fichiers de cette mission

Tous les ajouts restent dans trois emplacements nouveaux :

| Fichiers | Rôle |
| --- | --- |
| `bio-col-01/palette.mjs` | 26 teintes, calcul OKLab du contour et mesures de contrôle |
| `bio-col-01/paint.mjs` | Peinture limitée aux formes capillaires ; protection des liens intégrés |
| `bio-col-01/render.mjs` | Adaptateur de rendu optionnel ; historique inchangé sans couleur |
| `bio-col-01/catalogue.mjs`, `selection.mjs` | Réexports directs de la base validée |
| `bio-col-01/index.html`, `style.css`, `app.mjs` | Atelier tactile, comparaisons, fonds et planches |
| `bio-col-01/tests/` | Déterminisme, intégrité, géométrie, peinture, historique, navigateurs et rejeu des anciennes suites |
| `bio-col-01/build-preview.mjs`, `README.md` | Construction reproductible et documentation de l’API |
| `.github/workflows/bio-col-01.yml` | CI dédiée avec moteurs Playwright verrouillés et artefacts de comparaison |
| `docs/ai/bio-col-01/` | Rapport et preuves |

La publication séparée ajoute uniquement **neuf fichiers** dans `preview/bio-col-01/` : les huit fichiers d’exécution et `version.json`. Les 129 fichiers hérités restent inchangés. Aucune fusion de la PR de code.

## Tests et limites de preuve

Commandes dans le [README du prototype](../../../bio-col-01/README.md).

- **7 tests Node BIO-COL-01** : 129 empreintes ; 26 contours déterministes ; **2 268 cas de rendu historique exact** sans couleur ; **6 552 colorations** (126 choix × 26 teintes × 2 états d’accessoires/contraste) où seuls `fill`/`stroke` peuvent changer, avec calques protégés strictement identiques ; **1 836 cas** supplémentaires couvrant les trois vues, six corps et extrêmes morphologiques sur les coiffures représentatives ; liens P4 et contrastes 50-G/62-D ; historique/alias/61-G et absence de mutation des données.
- **Dépôt** : 35 tests Node et parcours du jeu Chromium/WebKit.
- **Lots 1–3** : suites originales épinglées aux commits inspectés, exécutées dans des copies temporaires ; **6 + 7 + 6 tests Node**, ainsi que leurs tests Chromium/WebKit d’origine. Aucune écriture dans les sources ou artefacts précédents.
- **Navigateurs BIO-COL-01** : inspection DOM indépendante de la coloration sur les 126 choix et 26 teintes, accessoires/contrastes activés et désactivés ; contrôle de tous les attributs hors peinture et des couleurs hors cheveux. Test des 126 options, des six alias, des contrastes, des mèches de 61-G, de l’aller-retour JSON, du mode historique exact et des contrôles tactiles.
- **Miniatures** : rasterisation de copies temporaires des seuls cheveux à **70×70 px**, sur six familles × 26 teintes ; comptage de pixels proches de l’aplat et du contour. Cette mesure prouve leur présence après échantillonnage, pas leur qualité artistique ni leur visibilité sur tout écran.
- **Écrans** : formats **820×1180**, **1180×820**, **390×844** ; absence de débordement horizontal, trois dimensions de rendu et miniatures doubles contenues dans leur cadre.

La CI emploie Playwright **1.62.1**, version du lockfile du dépôt. Le conteneur Noble fournit uniquement les bibliothèques système ; les moteurs correspondant au lockfile sont installés. Les opérations Git de lecture des suites historiques ne font confiance qu’au chemin exact du dépôt du conteneur.

## Réception artistique attendue

Les tests automatisés ne valent pas validation esthétique ni essai Safari sur un **iPad physique**. L’utilisateur doit juger les nuances exactes, le contour des noirs profonds, les blancs sur fond clair, les couleurs saturées et la lecture des détails en miniature.

Aucun obstacle structurel nécessitant une modification des géométries ou du jeu principal n’a été rencontré. Les exceptions historiques (liens intégrés et couches de contraste) sont isolées et préservées. Aucune fusion, aucun lot 4 ou 5, aucune intégration au jeu. **Le chantier capillaire attend le retour utilisateur, puis sera mis en pause après validation.**

## Résultats locaux

**Tous les contrôles exécutés passent.**

- **61 tests Node réussis** : 35 dépôt + 7 BIO-COL-01 + 6 lot 1 + 7 lot 2 + 6 lot 3.
- [Chromium et WebKit BIO-COL-01](captures/local-results.json) : chacun **6 552 SVG** inspectés, **380 614 contrôles de structure/attributs hors peinture**, **253 500 contrôles de peinture capillaire**, **207 402 contrôles de zones protégées** ; aucune anomalie détectée. Les 126 IDs historiques sont effectivement chargés.
- Rasterisation : **156 essais à 70×70 px par moteur**, aplats et contours présents dans chaque échantillon. Minimum constaté : **62 pixels proches de l’aplat** et **2 pixels proches du contour** (WebKit ; 4 pour Chromium). Ce résultat reste un contrôle de présence, pas une validation artistique.
- [Suites originales des lots 1–3](captures/legacy-results.json) : Node et Chromium/WebKit réussis dans les copies temporaires. Les tests navigateur du jeu réussissent également.
- **129/129 empreintes héritées conformes**, trois tailles, six corps, huit paramètres et extrêmes disponibles. Formats portrait/paysage/étroit sans débordement ; les miniatures doubles restent dans leur cadre.

Captures WebKit :

- [Les 26 teintes sur une coiffure](captures/webkit-palette-chart.png) · [Une teinte sur 16 coiffures](captures/webkit-variety.png).
- Noir profond : [fond clair](captures/webkit-noir-profond-light.png), [fond sombre](captures/webkit-noir-profond-dark.png).
- [Brun sombre](captures/webkit-brun-sombre-light.png), [blond pâle](captures/webkit-blond-pale-light.png), blanc ivoire sur [clair](captures/webkit-blanc-ivoire-light.png) et [sombre](captures/webkit-blanc-ivoire-dark.png), [gris perle](captures/webkit-gris-perle-dark.png).
- [Rouge vif](captures/webkit-rouge-vif-light.png), [bleu nuit](captures/webkit-bleu-nuit-dark.png), [rose clair](captures/webkit-rose-clair-dark.png), [turquoise clair](captures/webkit-turquoise-clair-dark.png), [vert émeraude](captures/webkit-vert-emeraude-light.png).
- [iPad portrait](captures/webkit-ipad-portrait.png), [iPad paysage](captures/webkit-ipad-landscape.png), [format étroit](captures/webkit-narrow.png).

La publication et ses contrôles sur l’URL publique sont consignés ci-dessous après déploiement. Le manifeste public permet de relier les huit fichiers d’exécution au commit source exact et aux 129 fichiers hérités.

## Livraison publique vérifiée

- **PR brouillon [#45](https://github.com/Thsethse/Microcosme/pull/45)**, branche `codex/bio-col-01` ; aucune fusion, aucune intégration au jeu.
- **Preview publiée et ouverte : https://thsethse.github.io/Microcosme/preview/bio-col-01/**.
- Source d’exécution **`af1da966517bd23c4a713e60dba70c8eebbc5b2c`**, épinglée par le manifeste public. Les ajouts ultérieurs de documentation ne changent pas ce code.
- Publication **`d8d39402ad0e0eff812c697f32988056abb86b31`** : **neuf nouveaux fichiers uniquement**, dans `preview/bio-col-01/`. [Déploiement Pages réussi](https://github.com/Thsethse/Microcosme/actions/runs/44824302194).
- [Empreintes publiques](captures/public-files.json) : **138/138 conformes**, neuf fichiers publiés et 129 fichiers hérités, téléchargements HTTPS avec vérification TLS active.
- [Navigateurs sur l’URL réelle](captures/public-results.json) : **Chromium et WebKit réussis**, chacun sur les 6 552 colorations et les 156 rasterisations en miniature, avec les mêmes résultats que localement ; les 126 IDs historiques se chargent et les six regroupements sont conservés. Portrait, paysage et format étroit vérifiés.
- [Non-régression du dépôt sur le code publié](https://github.com/Thsethse/Microcosme/actions/runs/44824200483) réussie. La CI complète rejoue aussi les suites originales des lots 1–3 ; ses résultats finaux et liens d’exécution sont visibles sur la PR #45 et dans sa description.

Les requêtes publiques du banc de test passent par `curl` avec la chaîne de confiance configurée, car les navigateurs headless de cet environnement ne reconnaissent pas le certificat du proxy. **Aucune désactivation de TLS** ; l’origine reste l’URL Pages réelle et les fichiers reçus sont vérifiés par empreinte. La CI teste directement les mêmes fichiers via son serveur local. Aucun outil supplémentaire n’est nécessaire pour ouvrir la preview sur iPad.

**La livraison attend maintenant le retour artistique de l’utilisateur sur Safari iPad physique. Aucun travail supplémentaire sur les cheveux, aucun lot 4/5 et aucune fusion ne sont déduits de cette livraison.**
