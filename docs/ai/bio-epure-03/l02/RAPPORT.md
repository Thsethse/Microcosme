# BIO-EPURE-03-L02-R01 — Réorganisation des commandes

## Base

La branche `codex/bio-epure-03-l02-r01` part de `32c333507a56897b81c5c5c62e6be8a7a419c4d8`, tête de `docs/bio-epure-03-l02`. Elle descend de `e64c07efb5b50f1b7366dba3e503b5d29240fc01`, lot 01 validé sur iPad physique par le porteur. Le seul fichier ajouté entre ces deux révisions est la mission du lot 02. L’ascendance a été vérifiée avec Git et l’API GitHub. [Contrat maître](../CONTRAT_MAITRE.md) · [Mission](../MISSION_LOT_02.md) · [Rapport du lot 01](../l01/RAPPORT.md) · [Comparaison GitHub](https://github.com/Thsethse/Microcosme/compare/e64c07efb5b50f1b7366dba3e503b5d29240fc01...32c333507a56897b81c5c5c62e6be8a7a419c4d8)

## Répartition et décisions

La matrice reprend les **1 282 identifiants** des tableaux et des cas de l’inventaire, y compris les 42 boutons générés à l’ouverture des études capillaires. La table E-TRANS-01 documente les conditions, leurs effets indirects et les actions qui réactivent une demande. L’entrée dédiée du lot 02 active cette disposition sur la structure des trois espaces du lot 01. [Matrice des destinations](MATRICE.md) · [Table E-TRANS-01](DEPENDANCES_CONDITIONNELLES.md)

| Arbitrage | Réalisation |
| --- | --- |
| E02 · Bases | Un seul sélecteur H/F en Création. H au premier démarrage, puis dernière base adulte dans le stockage du navigateur. Les six bases héritées se chargent au Laboratoire. Lorsqu’une ancienne archive charge un gabarit historique, le comparatif du Laboratoire peut l’afficher et l’atelier conserve son état jusqu’au prochain choix H/F explicite. |
| E03 · Corps | Réglages H/F existants, volumes, ossature, corpulence, aréoles, abdominaux et pousse pelvienne. La projection du pied est à 100 % dans Création. La largeur demandée est disponible et éditable au Laboratoire, y compris après import puis réinitialisation des autres largeurs. Les ports de rendu et de sauvegarde conservent leurs domaines et valeurs. |
| E04 · Visage | Huit axes en pourcentages dans Création et préréglage Neutre. Combinaison libre indique l’édition des axes. Cinq cas historiques au Laboratoire et indication du cas chargé près du sélecteur de Création. |
| E05 · Yeux et sourcils | Formes ordinaires en Création, dessin historique et extrêmes au Laboratoire. Les demandes sur les huit axes ont leurs bornes nominales. Le solveur existant applique l’ajustement conjoint automatiquement en Création et affiche une information à une décimale. Les valeurs demandées et effectives restent précises dans les données et Technique. Les propositions manuelles du Laboratoire conservent confirmation et annulation. Iris, détails périoculaires et sourcils conservent leurs demandes et latences. |
| E06 · Nez et bouche | Nez et lèvres gardent leur activation explicite. Morphologie du nez et détail graphique se choisissent séparément. Minimaliste, Discret et Marqué agissent sur les aplats et les traits. L’ancienne référence complète « Narines marquées » est réapplicable au Laboratoire avec son couple historique 43/79. |
| E07 · Cheveux et pilosité | Les 119 entrées ordinaires et 126 historiques gardent leurs identifiants. Arrangement, contraste et accessoires restent disponibles dans leur contexte. Choisir H/F pilote la catégorie d’atelier. Les anciennes catégories H/F/T se restaurent telles quelles et restent sélectionnables au Laboratoire. Le potentiel et le rasage dans la fiche habitant restent séparés de cette catégorie graphique. |
| E08 · Marques et cicatrices | Les curseurs, références, listes, placement et garde-fous de capacité sont conservés. Les identifiants graphiques et valeurs masquées restent dans les archives. La fiche habitant garde la distinction naturelle/acquise. |
| E09 · Pigments et maquillage | 26 pigments capillaires et de pilosité, 16 pigments d’iris et 32 pigments de maquillage avec leurs clés. Les pigments du maquillage ont leur nom contractuel et leur aperçu. Les 31 paramètres, familles et presets restent accessibles dans leur contexte. La bibliothèque locale de compositions reste en Création et son échange JSON se fait en Technique. |
| E10 · Tirages | Un sélecteur expose les commandes de tirage ou de rejeu de chacun des dix modules au Laboratoire. Les règles sont celles des modules existants. La redistribution d’un groupe agit sur sa graine. Une cicatrice peut être tirée ou recevoir seulement une graine pour son irrégularité. |
| E-TRANS-01 · Visibilité | Les commandes secondaires suivent l’état et les domaines des éditeurs. Les demandes restent consultables au Laboratoire. L’intensité reste disponible pour récupérer une bouche avec deux volumes nuls ou un groupe de marques avec densité nulle, lorsque l’intensité est elle aussi nulle. |

## Limites et compatibilité

- Le dessin initial des yeux reste historique conformément à la mission, en attendant l’arbitrage de la forme initiale. Aucun nouveau préréglage initial n’est déduit des formes ordinaires.
- La catégorie H/F/T relue depuis une archive est préservée jusqu’à un choix explicite de base ou de catégorie. Un gabarit historique chargé reste accessible en comparaison. Choisir une base adulte rouvre ses réglages de Création.
- Le sélecteur de détail du nez est indépendant des morphologies dans Création. Le cas historique « Narines marquées » avait aussi ses propres aplats et traits. Il garde une action dédiée au Laboratoire pour retrouver exactement cette référence.
- Les archives portent les versions de tirage lorsque leur format le prévoit et les graines propres aux marques et aux cicatrices. Le format de composition de maquillage porte les valeurs produites. Sa dernière graine tirée est conservée dans le navigateur. La mémorisation de la dernière base utilise également le navigateur. Les réglages H/F se transportent à froid dans l’archive d’atelier.
- L’atelier reste un éditeur d’apparence. Les origines naturelle et acquise sont celles de la fiche habitant existante. L’attribution d’un événement de cicatrice et les arbitrages artistiques reportés restent hors du lot.
- Les comparaisons graphiques automatisées emploient la même configuration effective et normalisent seulement les noms internes des instances SVG. Safari sur iPad physique conserve sa recette propre pour les menus natifs, la stabilité tactile et l’observation graphique.

## Tests et publication

La PR #81 cible `docs/bio-epure-03-l02` et reste en brouillon. La distribution provient du commit source `dd94fa952280dafcf49c69a5db2955272c0e3ad6`. Le commit Pages `4a5f20174505aa9209d0041d6ccf1408c39c0fb6` a pour parent `f04197ec8857697848a956cc6801c472d68571b4` et ajoute uniquement les quatre fichiers statiques sous `preview/bio-epure-03-l02-r01/`. [PR #81](https://github.com/Thsethse/Microcosme/pull/81) · [Commit source](https://github.com/Thsethse/Microcosme/commit/dd94fa952280dafcf49c69a5db2955272c0e3ad6) · [Commit Pages](https://github.com/Thsethse/Microcosme/commit/4a5f20174505aa9209d0041d6ccf1408c39c0fb6)

Le déploiement Pages a réussi. Le HTML, la feuille de style, le bundle et le manifeste ont été récupérés en HTTPS et correspondent à l’octet avec le build local. Le script d’amorçage servi est `atelier-486a439ea4bf9ea8.js`. [Déploiement](https://github.com/Thsethse/Microcosme/actions/runs/46129380590) · [Preview](https://thsethse.github.io/Microcosme/preview/bio-epure-03-l02-r01/) · [Manifeste](https://thsethse.github.io/Microcosme/preview/bio-epure-03-l02-r01/version.json)

| Vérification | Résultat |
| --- | --- |
| Non-régression Node | **221 tests existants réussis** sous Node 24.22.3, dont la matrice de robustesse de 301 cas. **2 tests du lot 02 réussis** pour la matrice des 1 282 identifiants et la correspondance contractuelle des 32 noms et codes pigmentaires. |
| Non-régression des distributions précédentes | Recette du socle R02 et recette du lot 01 réussies sous Chromium 151.0.7922.34 et WebKit 26.5 sur des builds issus du code du lot 02 avec leur disposition d’origine. |
| Dimensions | Trois espaces accessibles sans débordement aux largeurs 390, 768 et 1 024 px sur les deux moteurs. Les boutons d’espace conservent des zones tactiles d’au moins 44 px de haut. |
| Comparaison au lot 01 | Égalité de 12 SVG par moteur, sur les trois échelles et les deux bases par défaut, le pied fixé à 100 % en Création et le même pied à 130 % restitué au Laboratoire. |
| Ajustement des yeux | Demande à 120 % automatiquement ajustée en Création, affichage à une décimale et précision des valeurs sauvegardées. Une proposition manuelle annulée laisse l’archive identique. Les demandes de l’iris, des sourcils et de la sélection du personnage sont comparées avant et après l’ajustement. |
| Latences et restauration | Réactivation des réglages du thorax, des cils, des plis, des cernes, des poches, de l’iris secondaire, de la nuance indépendante, des familles de maquillage et des deux cas de récupération à zéro. Archive H/F comparée après restauration dans un contexte neuf, avec restitution de largeur thoracique et de corpulence. |
| Archives historiques et habitant | Les 22 versions historiques sont importées via l’interface puis réexportées et comparées à leurs projections de sauvegarde attendues. Deux témoins H/F restaurés à froid avec comparaison de leurs trois SVG et du JSON. Relecture de sélection brute et échange séparé de maquillage. |
| Tirages et planches | Les dix modules sont rejoués sur une graine et une configuration fixes, y compris le rejeu de l’ancienne version des yeux. Les 18 planches sont vérifiées par instrumentation du DOM, zéro écriture de SVG avant ouverture et 646 SVG montés au total aux premières ouvertures. |

Le parcours du lot 02 a réussi sous Chromium 151.0.7922.34 et WebKit 26.5 sur le build local et sur les réponses de Pages. Pour le test des réponses publiques, un relais local a transmis les ressources récupérées en HTTPS avec vérification du certificat. Le runner vérifie le manifeste, son commit source et les empreintes, ainsi que les erreurs visibles après changement d’espace. [Recette navigateur](../../../../bio-yeux-01/tests/editor-lot02-browser.cjs) · [Tests de destination et de palette](../../../../bio-yeux-01/tests/editor-lot02.test.mjs) · [Workflow](../../../../.github/workflows/bio-yeux-01.yml) · [Vérifications GitHub Actions](https://github.com/Thsethse/Microcosme/actions/runs/46129350764/job/140930898455)

```sh
npm ci
npx playwright install chromium webkit
node --test tests/*.test.js bio-col-01/tests/*.test.mjs bio-yeux-01/tests/*.test.mjs
node preview/bio-epure-03-l02-r01/build.mjs /tmp/microcosme-l02
PREVIEW_DIR=/tmp/microcosme-l02 REFERENCE_DIR=/tmp/microcosme-l01 \
  node bio-yeux-01/tests/editor-lot02-browser.cjs
```

Le répertoire de référence contient le build du lot 01 validé, produit avec son script `preview/bio-epure-03-l01-r01/build.mjs`. Le runner accepte aussi `PREVIEW_URL` et `REFERENCE_URL`.

## Parcours sur iPad physique

1. Ouvrir la preview dans Safari. Contrôler l’arrivée sur Création et, sur un navigateur neuf pour la preview, la base H. Choisir F, fermer puis rouvrir la page et vérifier que F est proposée. En portrait puis en paysage, vérifier les trois vues et l’accès à chaque espace.
2. En F, augmenter le volume de poitrine, modifier la largeur puis remettre le volume à zéro. En H, modifier la corpulence et les pectoraux. Revenir en F et réactiver le volume pour contrôler la largeur. Dans Laboratoire, essayer une largeur de pied différente et vérifier la valeur de la demande dans le volet des mémoires. Comparer le corps dans Laboratoire et dans Création.
3. Dans Création, demander une largeur d’œil forte, vérifier le retour à une décimale et poursuivre l’édition. Dans Technique, comparer demande et valeur effective. Dans Laboratoire, examiner puis annuler une proposition manuelle. Essayer l’iris secondaire en hétérochromie centrale et la longueur des cils lorsque leur nombre passe de un à zéro puis revient à un.
4. Appliquer un détail du nez, changer la morphologie et vérifier que le détail est conservé. Choisir une nuance de maquillage par son nom, masquer puis réactiver la famille. Ajouter une marque et une cicatrice et vérifier leur placement tactile. Choisir un groupe de marques et rejouer sa graine depuis Laboratoire.
5. Ouvrir une planche de chaque famille au Laboratoire. Vérifier que la consultation conserve le personnage. Exporter l’archive H/F dans Notes, puis une fiche habitant dans un document séparé. Après fermeture de Safari, restaurer les deux fichiers dans Technique. Vérifier les mémoires, l’apparition des réglages latents après réactivation et les trois projections du témoin. Essayer la relecture d’une sélection historique et l’échange de maquillage.
6. Soumettre un JSON tronqué dans Technique. Vérifier que l’erreur reste lisible en changeant d’espace et que le dernier état valide est conservé. [Preview Safari](https://thsethse.github.io/Microcosme/preview/bio-epure-03-l02-r01/)
