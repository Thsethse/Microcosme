# MISSION CODEX — BIO-STRUCT-T3-B1
Dépôt : https://github.com/Thsethse/Microcosme
Branche documentaire : docs/bio-struct-t3-b1
Source de vérité : docs/bio-struct-t3-b1/CONTRAT-T3-B1.md

## Avant de coder
1. Lire ce contrat, les contrats T3-A et R1/R2/R3, le registre éventuel de décisions, et AGENTS.md s'il existe.
2. Inspecter les branches et PR de code R3, la preview https://thsethse.github.io/Microcosme/preview/bio-struct-t3-a-r3/ et les tests. Ne pas supposer R3 fusionné. Si R3 n'est pas prêt ou accessible, indiquer la dépendance avant d'implémenter B1.
3. Préserver le code et les previews précédentes ; travailler sur une branche dédiée et ouvrir une PR NON FUSIONNÉE.

## Travail autorisé
Implémenter B1-D1..D9 et les contrôles B1-01..12 :
- formes de tête crédibles, supprimer triangle/triangle inversé/losange, arrondir carré/rectangle ;
- yeux forme/taille/couleur avec contrainte stricte : bord supérieur jamais au-dessus de la ligne médiane du visage, écart bord-à-bord = une largeur d'œil ;
- sourcils juste au-dessus, forme/couleur réglables ;
- bouche au milieu entre bas des yeux et bas du visage, catalogue de formes demandé, couleur des lèvres ;
- cils sur bord supérieur des yeux F, sélection libre pour T ;
- aucun nez ;
- ancrages canoniques, projections face/profil/dos, sérialisation déterministe et migration des formes de tête obsolètes.
Proposer des formes graphiques concrètes dans la preview, sans prétendre qu'elles sont artistiquement validées avant essai utilisateur.

## Livraison obligatoire
PR code NON FUSIONNÉE, branche/SHA, preview GitHub Pages indépendante sur le dépôt https://thsethse.github.io/Microcosme/preview/bio-struct-t3-b1/ (ou URL exacte vérifiée), tests B1 + non-régression, captures des quatre formes de tête et catalogues yeux/bouches/sourcils, comparaisons M/F/T et face/profil/dos. Vérifier réellement que le lien et les assets répondent avant de le communiquer. Mentionner que l'iPad physique reste à tester par l'utilisateur.
Ne pas lancer T3-B2, ne pas toucher au jeu principal ni aux sauvegardes historiques, aucune fusion.
