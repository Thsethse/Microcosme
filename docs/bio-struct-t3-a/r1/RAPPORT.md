# BIO-STRUCT-T3-A-R1 — rapport de correction

Branche de code indépendante `codex/bio-struct-t3-a-r1`, issue de T3-A `dfa56ba34c94de6bc80f3b2e4c58e584a2827c79`, PR parent #16 conservée ouverte et non fusionnée. Autorité documentaire R1 `be97786aaeb574621e04a44c3319c7499e148ff5` ; croquis et annotation utilisateur effectivement consultés dans la conversation. [Sources et calibration proposée](DECISIONS.md).

## Corrections livrées

P0 : thorax verticalement agrandi dans les mêmes 30 unités du tronc, région pectorale étendue, continuité de surface avec abdomen/épaules, clavicules légèrement inclinées et trapèzes reliés aux repères. Les muscles restent dans le canon mais leur ton est proche de la peau et leurs volumes contribuent à l'enveloppe des membres ; un seul contour de silhouette remplace les bordures systématiques. Les contours anatomiques individuels sont consultables en mode diagnostic.

P1 : sept têtes et choix séparés de tronc (six), bassin (trois), membres (deux) dans chaque catégorie. Les paramètres P1 et profils P2 restent disponibles et indépendants de ces formes. Choisir un contour, modifier la poitrine, changer les proportions ou basculer la fonction de T n'impose aucune autre catégorie.

Attaches faciales canoniques : yeux bilatéraux juste sous la moitié, sourcils au-dessus, bouche centrale calculée au milieu du bas des yeux et du menton. Elles suivent les dimensions et contours de tête ; les points de face/profil proviennent du même canon. Quelques points/traits minimaux permettent de les vérifier, sans catalogue graphique T3-B. **Aucun nez ni ancrage nasal** ; pas de traits faciaux de dos, même dans les ancrages de diagnostic.

[Comparaison avant/après M/F/T face/profil/dos](COMPARAISON.md) · [Format v2 et migration explicite](JSON-V2.md) · [Preview et preuves](PUBLICATION.md).

## Tests

- Les **23 tests T3-A sont conservés sans modification** dans `contract.test.cjs` et réussis.
- Les **8 contrôles R1-01…R1-08** sont ajoutés séparément dans `r1.test.cjs` et réussis en Node. Leur matrice individuelle figure dans RESULTATS.md. Les qualités artistiques et l'essai iPad physique ne sont pas considérés comme validés par ces succès techniques.
- Chromium local : parcours T3-A existant réussi, puis parcours R1. Sept têtes et six troncs distincts par pixels ; **144 masques connexes/non coupés** sur têtes/morphologies et extrêmes combinés ; sélection tactile simulée pour toutes les catégories, conservation de la catégorie, bascule T sans perte de formes, export v2 téléchargé/relu, réimport v2 et migration v1 signalée, refus de forme invalide sans perte, formats 390/820/1180 sans débordement.
- Contraste : sur la référence M, **979 pixels de contour sombre** en vue normale contre **2082** en mode de contours individuels, soit environ **53 % de moins**. Ce compteur caractérise ce rendu, pas une validation artistique ou une réduction universelle sur toute combinaison. Les muscles restent présents dans les données. Effets de pixels ≠ reconnaissance anatomique.
- Les 35 tests historiques et les 6 tests T2 sont préservés ; vérification navigateur T2 et Chromium/WebKit local/public dans la CI de livraison. Résultats finaux consignés après exécution effective.

Commandes : `node --test tests/bio-struct-t3-a/contract.test.cjs tests/bio-struct-t3-a/r1.test.cjs`, `node tests/bio-struct-t3-a/browser.cjs`, `node tests/bio-struct-t3-a/r1-browser.cjs`. WebKit local indisponible faute de bibliothèques système ; la CI installe ses dépendances.

Environnement local : VM Linux x86_64, 3 vCPU AMD EPYC 9V74, Node 24.22.1, Playwright 1.62.1, Chromium 151.0.7922.34 ; viewport 820×1180, DPR2, toucher simulé. Captures à DPR1, largeur 1180. `MESURES-R1-LOCAL.jsonl` et `MESURES-T3A-LOCAL.jsonl` contiennent les résultats bruts. Aucun succès Safari sur appareil physique revendiqué.

## Points observés et corrigés

L'ancienne enveloppe convexe de projection effaçait la concavité d'un contour sablier. Les contours ordonnés face/dos sont désormais conservés ; le profil reste issu du même volume extrudé. Un contrôle navigateur vérifie six morphologies visuellement distinctes. Les repères faciaux minimaux sont limités au masque du corps pour éviter un trait qui dépasserait accidentellement comme un nez.

## Fichiers et portée

Modifiés : `anatomical-skeleton.js`, `body-geometry.js`, `body-projection.js`, `canonical-body.js`, `render.js`, `lab.js`, `index.html`, `lab.css`. Nouveaux : `shape-grammar.js`, `facial-anchors.js`. Tous sous `experiments/bio-struct-t3-a/` sur la branche R1 ; branche et preview d'origine inchangées. Tests R1, fixture v1 d'origine et outil de captures ajoutés ; workflow T3-A étendu. Documents/captures dans le présent dossier `docs/bio-struct-t3-a/r1/`.

## Écarts et arbitrages visuels

Les corrections relationnelles sont implémentées ; les ratios fins proposés ne sont pas encore approuvés. Calibrations à juger : 12/15/3 à l'intérieur du tronc, ampleur/position des volumes pectoraux et mammaires, transition cou/trapèzes/clavicules, lisibilité musculaire sur peau sombre, contours extrêmes, et positions faciales relatives. Les 25/30/45, P1/P2/P3, les catégories et leurs fonctions sont conservés.

Les variantes polygonales sont des prismes stylisés ; les formes rondes/ovales restent des ellipsoïdes. Le profil de certains contours polygonaux paraît donc plus rectangulaire que leur face : il provient de leur profondeur canonique, pas d'un visage généré indépendamment. Pas de finition des yeux, sourcils, bouche ou cheveux, ni de nouvelle illustration approuvée. Les migrations v1 préservent les données, pas les anciens pixels corrigés ; la preview T3-A reste disponible pour les reproduire.

Validation humaine nécessaire : conformité aux annotations, équilibre thorax/abdomen, continuité et intégration des muscles, lisibilité des morphologies et des attaches faciales. **Aucun T3-B ou T3-C engagé, aucune fusion.**

## Essai Safari iPad

Ouvrir le lien R1, comparer les trois catégories, choisir plusieurs têtes et morphologies, modifier tronc/largeurs et volumes ; vérifier les raccords dans les trois vues. Activer « Ancrages », masquer/afficher les repères faciaux et contrôler les relations yeux/sourcils/bouche sans nez. Basculer T, essayer export/import et un ancien JSON v1. Comparer au lien T3-A précédent et aux captures. Noter appareil/iPadOS/Safari, graine et JSON des incohérences. L'essai physique et l'approbation artistique restent exclusivement à l'utilisateur.
