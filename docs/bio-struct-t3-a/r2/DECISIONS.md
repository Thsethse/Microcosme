# BIO-STRUCT-T3-A-R2 — portée et décisions

Autorité : branche `docs/bio-struct-t3-a-r2`, commit `2a93dbbe5f077d4c404ae1de936c5860d67fe350`. Les sept documents du dossier ont été lus intégralement : contrat, audit T2/T3-A, missions T3-A/R1/R2 et corrections validées R1/R2. L’autorisation de programmation/publication provient du message utilisateur R2 ; les restrictions historiques de lancement ne la remplacent pas. Aucun AGENTS.md applicable trouvé. Les PR #15/#16/#17 et les autres branches ouvertes ont été examinées ; aucune fusion.

Base exacte : PR #17, branche `codex/bio-struct-t3-a-r1`, `b05a3fe9b9ab0664fe1caf278bce9f5b10679520`. PR #16 et #15 conservées à `dfa56ba34c94de6bc80f3b2e4c58e584a2827c79` et `e057e5f906afba25ac943bcc617afb581eb8d296`.

## Lecture de l’image utilisateur

Le PNG « Illustration_sans_titre(2).png » est effectivement visible dans le message de mission : couple féminin avant/après à gauche, couple masculin avant/après à droite. Les cercles/flèches rouges sont des annotations. L’image est consultée comme référence qualitative de placement ; elle n’est pas remplacée par une image d’assistant. Aucun ratio précis n’est déclaré approuvé. Le binaire original n’est pas déposé dans la branche documentaire et cette mission ne prétend pas en fournir une copie identique.

La cible féminine présente une poitrine lisible sur le thorax et un signe pelvien discret près de l’entrejambe. La cible masculine descend le signe génital vers l’entrejambe. Le traitement pectoral et les ombres également visibles sur la cible sont expressément hors R2 : ils ne sont pas reproduits par cette correction.

## Choix techniques limités à R2-D1…D6

- Le squelette R1 reste identique, hormis `genital_anchor` : `t=0.12` depuis le bas du segment pelvien vers les hanches, Z sur la surface antérieure du bassin. Ni articulations ni proportions ne changent.
- Le signe masculin est un petit prisme à extrémité inférieure arrondie, ton de peau, qui recouvre le bord inférieur pelvien et descend entre les cuisses. Largeur/hauteur/profondeur relatives proposées : `0.14 / 0.86 / 0.30` du bassin. La largeur est limitée à 90 % de l’espace intérieur conservateur entre les cuisses pour éviter le chevauchement aux extrêmes.
- Le signe féminin reste un triangle discret, descendu au même ancrage : ratios proposés `0.16 / 0.50 / 0.12`, même adaptation de largeur. Il n’est visible que de face.
- Les volumes mammaires sont **strictement ceux de R1**, même position, forme, dimensions et couleur. Leur lecture est renforcée par un contour inférieur discret et un petit point de surface de la couleur de peau, dérivés de l’ellipsoïde existant. Le trait utilise le mélange de teinte déjà employé pour le signe anatomique R1 ; pas de nouvelle ombre ou de palette globale. Ces détails sont dessinés dans l’ordre d’occlusion du volume, jamais en surimpression finale à travers les bras.
- Les commandes portent un indicateur `visible` : poitrine face/profil ; signe masculin face/profil ; signe féminin face seulement ; aucun de ces attributs de dos. Les commandes masquées restent inspectables avec leurs dimensions canoniques, mais ne sont ni rasterisées ni entourées en diagnostic. Leurs ancrages de diagnostic sont également masqués selon l’orientation.
- Le changement de fonction T ne remplace que son signe génital : aucune modification de poitrine, de morphologie ou de paramètres.

Ces mesures sont une calibration technique présentée pour essai visuel, pas des proportions définitives validées par l’utilisateur. Les variantes mammaires, nouveaux pectoraux et nouvelles ombres sont exclus. Aucun R3, T3-B ou T3-C.

## JSON

Le schéma reste T3-A v2 : il sérialise les paramètres, catégories/fonctions, formes et corrections, pas les pixels ni les volumes dérivés. Les exports R1 v2 se réimportent/réexportent sans perte des données ; seules les projections des attributs corrigés changent. La migration explicite v1 existante est conservée. Pour retrouver les anciens pixels, utiliser la preview R1 préservée.
