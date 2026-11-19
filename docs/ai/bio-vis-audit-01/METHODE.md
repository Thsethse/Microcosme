# Méthode, sources et vérifications

## Périmètre et révisions

- Dépôt : Thsethse/Microcosme. Branche documentaire indépendante `docs/bio-vis-audit-01`, issue de main **`4fb938ac3e7d4cbd76f1f05b9cd0ec67cdae86f5`**.
- Programme effectif : `preview/bio-vis-p5-i6/`. Ses **93 fichiers** sont comparés octet pour octet aux fichiers correspondants de la PR #39, **`6d476dc13b53647d561d8ea97bfd9ec93c470450`**, et leur SHA-256 est conservé dans [source-manifest.json](data/source-manifest.json).
- Documentation de référence : PR #33, **`0d8cc1dccea821c14c35ac4addf46bafa753bc86`** ; fiches 01–72, contrats artistique/technique et DOUBLONS. Leurs étiquettes « nouvelle/variante/doublon potentiel » n’ont pas servi de verdict automatique.
- Branches et PR #32 à #39 examinées avant le travail, toutes ouvertes en brouillon et non fusionnées. Continuité START_HERE, PROJECT_STATE, DECISION_REGISTER et WORK_LOG relue sur `docs/llm-project-memory`. Aucun AGENTS.md retrouvé dans `/workspace`, répertoires cachés inclus.
- Les 73–81 restent hors inventaire de code. La présence de leur planche documentaire ne signifie pas qu’elles sont programmées.

Les fichiers de source, tests historiques, workflows, jeu et sauvegardes ne sont jamais écrits par les outils d’audit. Aucune nouvelle preview n’est publiée. La PR contient seulement ce dossier documentaire et ses outils autonomes.

## Images effectivement retrouvées et inspectées

Les neuf fichiers de référence du prototype sont tous reliés par identité binaire à `docs/ai/visual-references/` :

| Référence | Fichier original | Usage |
| --- | --- | --- |
| V1, 01–12 | `a_clean_infographic_character_design_sheet_in_warm.png` | Référence historique ; pas de case illustrée propre à 13–18 |
| Habitants | `BIO-VIS-P1-planche-originale.png` | Direction des personnages, pas un catalogue P5 |
| P5-A | `C7BEACBF-323B-4D6F-ABFF-92A988EC909F.png` | 19–27, source principale |
| P5-A supplémentaire | `DE8951BB-1A2D-41E0-8542-7DDC8E392E27.png` | Même grille ; dessin/ombrage supplémentaire inspecté |
| P5-B | `0F3CDCE7-24D6-40E4-80D8-4BE2429238AF.png` | 28–36 |
| P5-C | `7C197DD6-3733-4B37-A0B0-B265FF034BD8.png` | 37–45 |
| P5-D | `FAC68E60-6567-4D1A-B299-46A07B836D27.png` | 46–54 |
| P5-E v1 | `B4099DCA-66B1-4415-8C50-53AA5CFA1C04.png` | 55–63, version confirmée par l’utilisateur |
| P5-F | `132E23ED-C1DE-4311-8BAF-B56E09277B56.png` | 64–72 |

Aucune image nécessaire à ce périmètre n’est manquante. E v2 `D9BC5231-48E8-4880-9A7B-46573494504D.png` est bien présente mais correspond aux références documentaires 73–81, non programmées ; elle n’est pas utilisée pour attribuer des géométries à 55–63. Les exemples supplémentaires 13–18 sont explicitement des explorations P4, pas des images inventées pour combler cette absence de cases V1.

## A · Disponibilité

Lecture des exports `styles`, des arrangements et des normaliseurs effectifs. 18 styles historiques uniques + 54 références G/D = **72 références / 126 choix**. Les aliases `p5-001`–`p5-018` de la documentation ne sont pas les IDs acceptés pour les 18 historiques. Toutes les entrées de l’inventaire se résolvent sur leur ID réel ; aucun comptage d’une fiche non programmée ou d’un retour silencieux à `classic`.

« Complet » signifie que le programme présente une construction complète, pas que les dos/profils et tous ses détails sont attestés par une source frontale. 122 choix sont complets, trois partiels (66-G/D, 67-D), un entièrement inconnu (63-G). Le crâne 01 est une absence de cheveux voulue et connue, pas une inconnue. Les paires G/D complètes sont conservées ; 72 signatures de référence différentes ne prouvent pas 72 bases nouvelles.

## B · Géométries techniques : définition stricte et bornes

Une **composition technique** est l’ensemble ordonné des commandes des calques arrière, volume, front, côtés, texture et longueurs, avec les clips de cheveux nécessaires. Elle inclut les constantes de recette et les détails géométriques de texture. Les couleurs, opacités, calques de teinte, objets, noms, IDs techniques et attributs descriptifs sont exclus. Les groupes sans effet graphique sont supprimés ; les groupes portant un clip/transform restent. Les marqueurs plein/vide, largeurs de trait et règles de remplissage sont conservés.

Les quatre traits de liens P4 identifiés dans [ACCESSOIRES](ACCESSOIRES.md) sont retirés **uniquement des copies d’analyse**. Aucune masse de cheveux n’est retouchée. Les clips d’ouverture de 66/67 sont conservés, même sans tissu : les supprimer inventerait les parties cachées.

Les sorties sont canonisées puis concaténées dans un ordre fixe sur **270 états** par choix : neutre, cas iPad combiné, les 256 sommets des huit axes min/max, 12 mélanges sinusoïdaux déterministes. Une SHA-256 est calculée pour cette concaténation. Cela représente **34 020 évaluations** (126×270), dont 33 750 observables, toutes contrôlées pour des coordonnées non finies. Les 111 classes sont aussi 111 au neutre ; il n’y a pas ici d’égalité neutre supplémentaire qui se sépare ensuite dans cet échantillon.

**Indépendance au niveau B signifie seulement composition non identique après cette normalisation.** Deux constantes différentes dans le même helper comptent séparément. 111 n’est ni un nombre d’algorithmes sans partage, ni une mesure de créativité, ni un compte de familles perceptuelles. Une autre unité, par exemple les briques ou les modules, donnerait un autre nombre : on ne mélange pas ces niveaux.

Limites : l’égalité sur un ensemble fini ne constitue pas une preuve mathématique pour tout le continuum. Pour les groupes exacts, les mêmes branches/appels de génération et les copies sont également identifiés. Le protocole est conservateur : deux écritures différentes mais mathématiquement équivalentes pourraient être séparées. Ici, une mesure indépendante des silhouettes peintes retrouve la même partition au neutre. Les empreintes brutes de nombres sont liées à l’environnement de calcul ; un changement de moteur numérique doit vérifier les classes plutôt que supposer les mêmes octets de flottants.

## Conditions contrôlées des planches

Même tête neutre, même corps standard, même orientation frontale, **même viewBox `-40 -85 240 355` et même taille par carte**, même paire de teintes monochromes pour aplats/contours, aucun objet. Le rendu provient de `character()` ; seul le cadrage commun, la peinture de cheveux et l’exclusion documentée des objets sont appliqués dans les copies. Ni les traits du visage ni les formes du corps ne changent. Les deux moteurs vérifient **une seule variante de visage et une seule variante de corps** sur les 126 choix.

La planche principale conserve tous les détails des cheveux ; la mesure de silhouette retire les traits intérieurs et peint les aplats en noir, avec le visage et le corps en blanc pour respecter leur occultation des masses arrière. Les lignes seules de texture ne créent donc pas une autre macro-silhouette. La peau et le corps restent visibles et inchangés sur les planches destinées au lecteur ; leur blanchiment n’existe que dans les masques de calcul.

Le cadrage commun permet de voir les différences de longueur sans les confondre avec un zoom propre à un modèle. Une planche séparée conserve les trois cadrages réellement livrés et relève l’émission/omission du calque de longueurs. Les cadres historiques peuvent couper des pointes ; cela ne change pas le compte B des cheveux complets.

Pour 63-G, la carte est explicitement intitulée « cheveux inconnus, support seul ». Elle n’ajoute pas une famille de coiffure et n’est pas un doublon de 01. Les trois cartes de fragments sont marquées comme telles. Les extraits des sources conservent leurs propres visages uniquement à titre de document ; ces visages ne participent pas aux critères de fidélité des cheveux.

## Quasi-doublons et C · familles visuelles

La silhouette visible est rasterisée en **480×710**, au cadre commun, avec seuil noir <128. La SHA-256 du masque confirme les classes peintes. L’indice IoU est l’intersection divisée par l’union des pixels de cheveux, corps/visage occultants. 95 % au neutre est un **repère exploratoire**, pas un seuil d’identité artistique. Les paires ≥80 % sont conservées comme voisinages. Les différences d’anticrénelage près du seuil expliquent 94 paires dans Chromium contre 95 dans WebKit ; les classes exactes et les cinq paires ≥95 % concordent.

Quatre rapprochements de compositions (cinq paires avec l’alias 58-D) sont examinés au neutre et dans le cas iPad, puis mesurés sur **32 états par moteur** : neutre, cas iPad, extrêmes des huit axes pris séparément, tout min/max, 12 mélanges. Ces 128 comparaisons par moteur sont des mesures d’échantillon, pas des bornes globales.

Les **32 familles C sont un classement qualitatif explicite de l’audit**, fondé sur la distribution des longueurs, le volume dominant, les attaches, la texture et les côtés dégagés. Elles regroupent exactement les 122 choix complets. Les fragments et l’inconnu sont hors de ces familles. Des frontières voisines sont nommées dans FAMILLES ; le lecteur peut contester le niveau de regroupement en regardant les planches. Aucune partition par noms culturels, couleurs, accessoires ou identité du personnage. Aucune connexité transitive du graphe des ressemblances n’est utilisée pour fusionner des coiffures.

Le classement « structure unique » de l’inventaire indique le premier témoin d’une macro-structure dans cet inventaire ; un autre témoin peut être une variante structurelle significative. « Doublon visuel » y désigne une copie exacte du premier membre d’un groupe, tandis que les variantes mineures et les quatre rapprochements ne sont jamais présentés comme égaux. Les inconnues restent hors de ces quatre niveaux ou explicitement limitées au fragment observé.

## Reproduction et artefacts

Utiliser un clone Git possédant aussi le commit source de #39 (au besoin, `git fetch origin codex/bio-vis-p5-i6-lot-f`). Le manifeste impose le snapshot audité ; il signale toute autre version au lieu de l’auditer silencieusement.

Prérequis : Node 22 ou ultérieur, dépendances déjà décrites dans le `package-lock.json` racine, Playwright 1.62.1 et navigateurs Chromium/WebKit. Aucun paquet n’est ajouté par l’audit.

```sh
npm ci
npx playwright install --with-deps chromium webkit
node docs/ai/bio-vis-audit-01/tools/collect.mjs
node docs/ai/bio-vis-audit-01/tools/enrich.mjs
node docs/ai/bio-vis-audit-01/tools/render.cjs
node docs/ai/bio-vis-audit-01/tools/near.cjs
node docs/ai/bio-vis-audit-01/tools/report.mjs
node docs/ai/bio-vis-audit-01/tools/validate.mjs
# Option de lecture seule pour comparer les fichiers servis :
node docs/ai/bio-vis-audit-01/tools/validate.mjs --public
```

Tous les outils n’écrivent que dans ce dossier. Le serveur temporaire de `render.cjs` est local et fermé à la fin. Les gros intermédiaires `data/generated.json` et `data/near-states.json` sont reproductibles et ignorés par Git ; ils ne sont pas nécessaires pour lire les rapports. Les empreintes, CSV/JSON des 126 choix, mesures, HTML, PNG et SVG vectoriel sont conservés dans la PR.

[verification.json](data/verification.json) donne les vérifications réellement exécutées et la version Node. Le manifeste compare aussi le source de #39 avec la publication main. L’option publique récupère les fichiers avec curl et vérification TLS active, sans option insecure. Elle ne modifie pas Pages. La comparaison du générateur au manifeste est refaite après génération des figures pour démontrer l’absence de modification.

Les PNG et le SVG général sont autonomes ; les HTML généraux et de doublons contiennent leurs SVG. Les HTML « source-X » utilisent les PNG déjà présents dans l’arborescence du dépôt ; les PNG « source-X » sont autonomes. Le SVG général permet un zoom sans pixellisation sur iPad. Les chemins locaux relatifs et la syntaxe des artefacts sont vérifiés.

Les contrôles de cet audit concernent l’inventaire, les égalités, les conditions de comparaison, les liens et l’intégrité des sources. Les tests du jeu et du générateur n’ont pas été réécrits ni transformés en verdict artistique. La CI normale de la PR reste indépendante de la validation humaine des familles et des scénarios. Aucun essai sur un iPad physique n’est prétendu par les captures Chromium/WebKit.
