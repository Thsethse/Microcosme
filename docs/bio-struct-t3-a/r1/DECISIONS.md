# R1 — sources et ratios proposés

## Sources et périmètre vérifiés

Source de vérité : branche `docs/bio-struct-t3-a-r1`, commit `be97786aaeb574621e04a44c3319c7499e148ff5`. Contrat, audit de compatibilité, `R1-CORRECTIONS-VALIDEES.md`, mission R1 et mission T3-A d'origine ont été lus intégralement. L'autorisation de programmation est donnée explicitement par le message utilisateur actuel ; les interdictions de programmation de l'ancien document préparatoire n'empêchent donc pas ce lot autorisé.

Les croquis initiaux du corps et du visage, ainsi que l'annotation R1 jointe à la mission, sont visibles et consultés dans la conversation. Ils priment sur la planche de l'assistant et sur les captures générées ici. Les fichiers binaires de ces annotations ne sont pas dans la branche documentaire ; aucune reconstitution ou copie identique n'est revendiquée. Pas de référence indispensable absente visuellement.

PR #16 : `dfa56ba34c94de6bc80f3b2e4c58e584a2827c79`, ouverte, non fusionnée ; PR #15 : `e057e5f906afba25ac943bcc617afb581eb8d296`, inchangée. Main : `1c28b507684836d91021732420fa998009a74d99`. Aucun AGENTS.md applicable trouvé ; aucune modification locale préalable. Nouvelle branche `codex/bio-struct-t3-a-r1` issue de la branche T3-A, PR empilée sur #16. La branche et la preview T3-A antérieures restent disponibles. Aucun changement du jeu, des sauvegardes ou de T2.

## Calibration proposée, pas validation artistique

Les valeurs fines suivantes sont des choix d'implémentation pour rendre vérifiables les corrections validées. Elles ne sont **pas présentées comme des proportions définitivement approuvées**.

- Enveloppe 25/30/45 conservée. Dans les 30 unités du tronc : abdomen 12, thorax 15, cou 3 (avant : 18/9/3). Le bas du thorax passe de Y63 à Y57 à la référence. La région pectorale occupe 88 % de la longueur thoracique, contre 65 % auparavant. Le nombril reste Y53 à la référence et garde son attache abdominale.
- Les épaules sont à Y71,4 à la référence et le point central des clavicules à Y72. Les clavicules ont donc une légère pente. Les trapèzes ont une enveloppe triangulaire locale reliant la jonction haute du cou au repère d'épaule ; leurs sommets sont recalculés depuis le squelette. Le cou et les régions adjacentes se recouvrent légèrement pour assurer le raccord volumique.
- Les accents musculaires gardent leurs segments et dimensions inspectables ; l'enveloppe des membres augmente avec le volume musculaire. La couleur d'un muscle ne mélange que 2,5 à 8 % de la teinte d'ombre. Le contour sombre normal est calculé autour de l'union de la silhouette, pas autour de chaque muscle. Un mode de contours individuels reste disponible pour le diagnostic.
- La poitrine suit le thorax agrandi, avec attache cible à 42 % du segment depuis son bas ; si nécessaire, cette attache est dérivée plus haut pour conserver tout le volume dans la région. Ce recalcul géométrique N1 ne modifie pas la valeur P1 demandée. Largeur/écartement sont adaptés à la largeur disponible du contour choisi. Aucun détail explicite ajouté.
- Sept têtes : rond, carré, triangle inversé, ovale, triangle, rectangle, losange. Le cadre neutre est de 25 unités en hauteur et largeur, puis les contours ovales/rectangulaires ont leurs rapports d'aspect propres ; P1 étire ce cadre. Les morphologies du tronc, bassin et membres ne modifient jamais catégorie ou fonction.
- Yeux à 54 % de la hauteur depuis le sommet facial, région oculaire haute de 8 %. Sourcils à 46 %, juste au-dessus. La bouche est calculée par la moyenne exacte entre le bas des yeux et le menton, soit 79 % à la référence. Les écarts latéraux sont ajustés au contour pour rester dans les sept têtes. **Aucun nez ni ancrage nasal.** L’axe facial est défini par ses limites sommet/menton, sans point central supplémentaire qui pourrait être pris pour une attache nasale.

Le croquis fixe les relations et intentions ; les fractions numériques proposées ci-dessus restent à valider visuellement sur l'iPad. Elles sont inspectables dans le canon et documentées, sans prétendre avoir été mesurées exactement sur l'image utilisateur.

## Précisions de projection

Les contours canoniques sont extrudés selon leur profondeur. Les formes concaves de face/dos (sablier) conservent leur contour ordonné ; une enveloppe convexe ne doit pas effacer leur taille. Le profil utilise la profondeur réelle et l'enveloppe correspondante. Les traits minimaux sont ancrés au visage et limités au masque du corps ; aucune transparence faciale de dos, y compris dans les repères faciaux de diagnostic.

Aucun catalogue de traits, expressions, cheveux ou finition T3-B. Aucun T3-C. Les points nécessitant réception humaine sont consignés dans le rapport.
