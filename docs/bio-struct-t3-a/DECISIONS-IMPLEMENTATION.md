# T3-A — vérifications préalables et décisions d'implémentation

## Sources consultées dans l'ordre demandé

1. [CONTRAT.md](https://github.com/Thsethse/Microcosme/blob/docs/bio-struct-t3-a-contract/docs/bio-struct-t3-a/CONTRAT.md).
2. [AUDIT-COMPATIBILITE-T2-VERS-T3-A.md](https://github.com/Thsethse/Microcosme/blob/docs/bio-struct-t3-a-contract/docs/bio-struct-t3-a/AUDIT-COMPATIBILITE-T2-VERS-T3-A.md).
3. [MISSION-CODEX-T3-A.md](https://github.com/Thsethse/Microcosme/blob/docs/bio-struct-t3-a-contract/docs/bio-struct-t3-a/MISSION-CODEX-T3-A.md).

Révision documentaire vérifiée : `b7f9192e630b9506be3f8a659ca533b21e141a2b`. Leurs anciennes mentions « programmation non autorisée » préparent une future mission ; l'instruction explicite de l'utilisateur jointe au présent travail autorise désormais T3-A. Aucune autorisation de fusion, intégration ou lots suivants n'en découle.

4. PR #15 ouverte, en brouillon et non fusionnée, HEAD `e057e5f906afba25ac943bcc617afb581eb8d296`, **identique à la révision auditée** : aucun delta T2 à réauditer.
5. Notice et PNG T2 sur `docs/bio-gen-t2-reference`, commit `bce2f70d0fcd19214366861267e3857a97cae9b0`, planche consultée auparavant et retrouvée lors de la mission.
6. Les deux croquis utilisateur sont **effectivement visibles dans le message de mission** : corps face/profil/dos avec articulations et volumes régionaux ; construction du visage avec attaches. Ils ont été consultés distinctement du PNG T2. Leur binaire n'est pas présent dans la branche documentaire ; aucune copie ou identité binaire n'est revendiquée. Les éléments détaillés du croquis facial sont réservés à T3-B.

Aucun AGENTS.md applicable trouvé dans le workspace et les arbres Git inspectés. Branches/PR parallèles #7 à #15 inspectées, conservées non fusionnées ; aucun changement de leurs sources. Main à `80421a8900eb5d4d9e16db22a760122d4db352a0`. Pages publie main à la racine, build legacy ; aucune reconfiguration nécessaire. Nouvelle branche `codex/bio-struct-t3-a`, nouveaux chemins seulement.

## P1 et P2 : composition explicite

**P2 définit les valeurs initiales effectives ; P1 borne les valeurs finales.** Les nombres P2 ne sont pas multipliés une seconde fois par les saisies utilisateur. Exemple : M commence avec largeur d'épaules 1,15 ; saisir 1,35 donne 1,35, et non 1,5525. Saisir 1,60 produit 1,35 avec rapport demandé/appliqué/motif. F et T peuvent atteindre les mêmes bornes ordinaires ; les tendances P2 ne sont pas des interdictions individuelles.

Le facteur P2 de largeur relative du tronc (M 1,10, F 0,95, T 1,00), non doté d'une borne P1 propre, reste un caractère de référence de la catégorie dans ce lot : pas de curseur supplémentaire ni de borne biologique inventée. Tous les autres paramètres P1 sont réglables. Les fonctions de M/F sont imposées par D2 ; T accepte exactement une fonction male/female, indépendamment des réglages morphologiques.

## Repère et calibration technique

X = latéral, Y = vertical vers le haut, Z = profondeur positive vers l'avant. `left` correspond au côté X négatif du repère du corps ; face conserve X, dos inverse X, profil projette Z vers la droite. Ce repère ne constitue pas un rendu perspectif 3D.

Les sous-repères proposés par le contrat sont repris pour la référence : sol 0, cheville 5, genou 26, hanche 45, nombril 53, bas thorax 63, épaules 72, base du crâne 75, sommet 100. Ils sont une **calibration d'implémentation à auditer visuellement**, pas une décision artistique validée séparément.

Avant taille globale : hanche = 5 + 40 × longueurJambes ; base du crâne = hanche + 30 × longueurTronc ; sommet = base + 25 × hauteurTête. La taille globale multiplie ensuite toutes les positions et dimensions. La hauteur résultante n'est jamais ramenée artificiellement à 100. Les proportions 25/30/45 et les quatre têtes sont exactes aux références.

Les ancrages nommés se calculent sur segments par interpolation et décalage dans leur repère local. Les articulations portent des positions dérivées, les marqueurs (nombril, axe facial, attaches pelviennes) sont des ancrages dérivés : aucune articulation isolée artificielle. Pied : boîte locale allant du sol à la cheville, rattachée à la chaîne cheville/orteil. La hauteur et profondeur d'un pied ne sont pas une statistique de locomotion.

## Volumes et représentation

Boîtes orientées attachées aux segments pour tronc, membres et accents musculaires ; triangles pour trapèzes et signe pelvien féminin ; ovales pour crâne, poitrine et volumes fessiers. Les dimensions sont des ratios explicites du segment. Les ratios internes de dessin (largeurs, profondeur, tailles des accents) sont des choix techniques de ce banc, **pas de nouvelles lois biologiques**.

La poitrine est entièrement dans la plage longitudinale et latérale du thorax ; sa profondeur part de sa surface antérieure. Le signe anatomique est ancré au bassin, sous les hanches et le nombril, avec forme minimale dérivée de la fonction explicite. Aucun détail génital réaliste. Les images ne déduisent ni genre, désir, psychologie ou fertilité. Aucune simulation reproductive.

## Portée et écarts

Aucune différence fonctionnelle volontaire aux décisions D1–D4/P1–P3. Les choix de composition P1/P2, de calibration et de ratios restent explicitement à auditer. Le portrait est facultatif et n'est pas ajouté ; visages/coiffures/nez détaillés restent T3-B. Aucune animation ou phase T3-C.

La reconnaissance visuelle des silhouettes M/F/T et l'essai Safari iPad physique restent **ouverts**. Les catégories sont toujours conservées dans les données, même si des variations rendent des silhouettes proches.
