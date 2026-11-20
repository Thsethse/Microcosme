# Sources, méthode et limites

## Autorités et périmètre

Travail sur branche `docs/bio-vis-dedup-01`, issue de main `4fb938ac3e7d4cbd76f1f05b9cd0ec67cdae86f5`. Les branches et PR ouvertes ont été examinées : #33 et #40 restent en brouillon et non fusionnées, comme les PR P4/P5 précédentes. Aucun AGENTS.md retrouvé dans `/workspace`, répertoires cachés inclus. Les documents START_HERE, PROJECT_STATE, DECISION_REGISTER et WORK_LOG de `docs/llm-project-memory` ont été relus. Ils ne transforment aucune recommandation en validation.

Sources obligatoires effectivement lues : DOUBLONS, INVENTAIRE, FAMILLES, ECARTS_REFERENCES et SYNTHESE, les planches et les données de la PR #40, au commit **`732b86489ac6dbf7fa714c0460d057083cff71da`**. Les empreintes des cinq documents sont archivées dans [provenance.json](data/provenance.json). Les égalités sur 270 états et les IoU sur 32 états sont les résultats de cet audit ; ils ne sont pas présentés comme de nouvelles mesures faites ici.

Les illustrations ont été relues dans la PR #33, commit **`0d8cc1dccea821c14c35ac4addf46bafa753bc86`**, avec le catalogue et les rapprochements documentaires. V1 et les six planches A/B/C/D/E-v1/F sont retrouvées et reliées octet pour octet aux copies de référence du prototype. **E-v1 = B409…**, conformément à la confirmation utilisateur. La seconde A DE895… a également été regardée comme référence supplémentaire, sans renuméroter les modèles. Les 73–81 de E-v2 sont hors programme et hors mission.

Chaque choix étudié renvoie à la planche originale et à sa fiche documentaire. La V1 illustre 01–12 ; 13–18 sont des explorations P4 sans case originale dédiée. Cette limite reste explicite dans la revue des familles. Aucun fichier de source nécessaire aux 26 dossiers n’est manquant.

## Nature des conclusions

- **Établi techniquement** : identité ou différence des compositions dans le protocole de #40, fonctions/branches communes, différences de chemins, fragments et occultations. Les 93 fichiers du programme effectif sont vérifiés avant et après les outils.
- **Observation graphique** : contours, distribution des mèches, attaches, longueurs visibles et organisation des tresses/boucles dans les sources et rendus.
- **Recommandation artistique** : REGROUPER, DIFFÉRENCIER, CONSERVER ou À ARBITRER. Toutes restent « En attente » ; aucune n’est enregistrée comme acceptée.

Un pourcentage de recouvrement ne voit pas toute la texture intérieure ; une tempe tressée peut être distincte malgré une silhouette externe très proche. Un helper commun peut produire des attaches différentes. Inversement, un nom ou une couleur ne crée pas une géométrie nouvelle. Les recommandations examinent ces critères ensemble.

Une proposition principale par dossier donne 4/12/7/3. E03 et E09 comportent aussi deux rapprochements ciblés ; les quatre dossiers principalement REGROUPER et ces deux sous-ensembles donnent **six rapprochements proposés**. E05 et Q04 se recoupent : ne pas cumuler leurs gains. Les chiffres portent sur des dossiers, pas un nouveau nombre de coiffures ni une quantité certaine de travaux à programmer.

## Comparaisons contrôlées

Les SVG viennent du `character()` effectivement livré de P5-I6 : tête neutre, corps `standard`, orientation frontale, `monochrome:true`, `accessories:false`, `contrast:false`. Mêmes aplats/contours de cheveux pour tous (`#9d7b47`/`#4c3822`). Les traits du visage et les formes du corps ne sont pas modifiés.

Les quatre traits de liens P4 identifiés par #40 (deux en 10, un en 12, un en 17) sont retirés **uniquement des chaînes SVG copiées dans le dossier**. Les calques d’objets et de contraste ne sont pas inclus dans la comparaison. Les clips d’ouverture de 66/67 sont conservés : enlever un tissu ne révèle pas magiquement une chevelure complète. 63-G reste inconnu, jamais rasé.

Deux cadres communs sont montrés par choix : zoom sur le haut des cheveux `-30 -65 220 225`, puis personnage entier `-40 -85 240 355`. Chaque cadre est identique pour tous les choix ; le premier peut couper les longues pointes, visibles dans le second. C’est une comparaison de cadrages, sans retouche de géométrie ni utilisation des rendus historiques amputés du calque de longueurs pour décider d’une copie.

Les quasi-doublons ont en plus les vrais SVG des trois vues à **178 px** (vignette), **300 px** (comparaison de tête) et **70 × 70 px** (miniature), dimensions CSS présentes dans P5-I6. La tête de comparaison à 300 px n’est pas une promesse que toutes les têtes de l’atelier ont cette taille. Les dimensions physiques sur iPad dépendent de l’écran et du zoom. Les PNG Q01–Q04 déplient ces trois vues ; dans le HTML elles sont accessibles par un panneau natif.

Les originaux sont recadrés sans modifier leurs pixels ; chaque extraction conserve sa planche, sa ligne/colonne, son arrangement et son rectangle de découpe. Les liens ouvrent aussi l’image entière. Les originaux gardent leurs teintes, visages et accessoires comme documents ; ces éléments ne participent pas à la décision. Aucune coiffure cachée sous un objet n’a été redessinée ou extrapolée.

## Galerie et consultation iPad

[PLANCHES](PLANCHES.md) donne accès aux PNG sur GitHub, sans publication Pages ni application supplémentaire. Le HTML est autonome : tous les PNG et SVG sont intégrés, aucune police distante, aucun script, aucun chargement réseau nécessaire. Il offre une navigation par ancres, un tableau, les études et les 35 groupes de revue (32 familles + P1/P2/X). Il ne contient aucun formulaire d’arbitrage, stockage local ou écriture de sauvegarde. Les liens de provenance nécessitent le réseau seulement si ouverts.

Le caractère « autonome » est testé depuis un fichier local avec réseau bloqué, dans Chromium et WebKit. Les vues portrait/paysage iPad et un écran étroit sont vérifiés. Cela ne remplace pas un essai sur Safari d’un iPad physique ni la validation artistique humaine. Voir [verification.json](data/verification.json) pour les contrôles réellement exécutés.

## Reproduction isolée

Node 22 ou ultérieur, dépendances du lockfile racine et Playwright Chromium/WebKit. Aucun paquet ou workflow n’est ajouté. Le clone doit posséder les deux commits documentaires épinglés ; au besoin :

```sh
git fetch origin docs/bio-vis-audit-01 docs/p5-doc-catalogue-capillaire
npm ci
npx playwright install --with-deps chromium webkit
node docs/ai/bio-vis-dedup-01/tools/build.mjs
node docs/ai/bio-vis-dedup-01/tools/verify.cjs
```

`cases.mjs` contient les recommandations et les observations humaines ; `build.mjs` vérifie les sources, génère les documents et la galerie puis photographie les seuls rendus actuels ; `verify.cjs` vérifie les invariants, la consultation autonome et l’intégrité. Leurs écritures restent dans ce dossier. Aucune écriture dans le prototype, ses tests ou le jeu ; aucun appel à une sauvegarde ou à Pages. La CI normale de la PR reste indépendante de la validation des recommandations.
