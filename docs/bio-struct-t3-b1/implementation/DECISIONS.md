# B1 — décisions, autorité et catalogue proposé

Autorité : branche `docs/bio-struct-t3-b1`, **`ffe9c5b5963deb122c1e46f0d7e5043233ed8f3c`**. CONTRAT-T3-B1.md et MISSION-CODEX-T3-B1.md lus intégralement, ainsi que les contrats T3-A/R1/R2/R3 et les décisions R3. Aucun AGENTS.md applicable trouvé. Les règles B1 remplacent explicitement les anciennes exigences de sept têtes et de simples repères faciaux.

R3 inspectée avant programmation : PR #19 ouverte/non fusionnée, HEAD **`0749e4d4d54ea55a14cf63dda82b32e544e020e8`**, code applicatif `be0779b`. Les dernières CI R3 [43765456578](https://github.com/Thsethse/Microcosme/actions/runs/43765456578) et historique [43765456600](https://github.com/Thsethse/Microcosme/actions/runs/43765456600) réussissent. Les 14 fichiers applicatifs R3 et 56 ressources antérieures ont été récupérés/vérifiés en HTTPS ([preuve de base](VERIFICATION-BASE-R3.json)). R3 est donc prête techniquement ; sa réception artistique/iPad n’est pas supposée acquise. La mission utilisateur autorise B1 depuis ce HEAD vérifié, sans fusion.

PR #16/#17/#18/#19 et branches existantes examinées. Main avant B1 : `9a0c47047c4ef03e16bbf452980965f3142ad2e4`. Nouvelle branche `codex/bio-struct-t3-b1`, nouveau laboratoire `experiments/bio-struct-t3-b1/` ; les anciennes sources R3 et leurs tests restent intacts. L’API B1 s’ajoute à une copie indépendante des modules R3. Aucun croquis d’assistant n’est ajouté comme autorité artistique.

## Catalogue concret, encore proposé

| Élément | Options |
|---|---|
| Tête | Rond, ovale, carré arrondi, rectangle arrondi |
| Yeux | Rond, ovale, rectangulaire, amande, triangle haut, triangle bas |
| Sourcils | Droit, arqué, incliné |
| Bouche | Demi-cercle inférieur, demi-cercle supérieur, petits triangles, rectangle, B inversé à deux lobes |
| Cils | M : sans sélecteur/sans cils ; F : courts ou accentués ; T : sans/courts/accentués |

Le « B inversé » est interprété ici comme deux lobes supérieurs arrondis avec échancrure centrale, accompagnés d’une lèvre inférieure courbe. Les triangles concernent les yeux/lèvres, jamais une nouvelle option de tête. Les couleurs d’iris, sourcils et lèvres sont indépendantes, avec mêmes défauts M/F/T. Les cils reprennent la couleur des sourcils ; aucune couleur n’est imposée par la fonction reproductive. Ce sont des tracés testables, pas un catalogue artistiquement approuvé. Les [six planches](COMPARAISONS.md) proviennent de la véritable interface.

## Mesures techniques proposées

- Tête carrée/rectangulaire : arrondi 3D de rayon `0.18 × min(largeur, hauteur, profondeur)`, projections face/profil issues des mêmes sommets. Dimensions et attache du crâne conservées ; aucune modification des autres volumes.
- Taille des yeux : multiplicateur [0.50, 1.50], défaut 1.00. Largeur d’un œil `0.12 × largeur réelle de tête × taille`. Centres X à ± une largeur d’œil : le vide entre bords internes vaut exactement cette largeur.
- Bord supérieur Y à `médiane − 0.015 × hauteur de tête` ; hauteur selon la famille de forme. L’agrandissement descend les yeux, sans déplacer leur bord supérieur au-dessus de la médiane.
- Sourcils : base à `haut des yeux + 0.025 × hauteur de tête`, hauteur `0.04 × hauteur de tête` ; largeur liée aux yeux. La médiane ne contraint pas les sourcils.
- Bouche : centre Y exactement `(bas des yeux + menton)/2`, largeur `0.25 × largeur de tête`, hauteur `0.12 × hauteur de tête`. La hauteur rend les petits triangles lisibles au raster. Les ratios sont révisables, pas déclarés validés.
- Profil : un seul œil (côté droit), profondeur du support oculaire `0.30 × largeur d’œil`, buccal `0.40 × largeur de bouche`. Les ancrages sont sur le segment crânien, ajustés à la surface du crâne ; les mêmes supports dimensionnels servent aux trois vues. Les profils restent stylisés et parfois très fins.
- Cils : trois attaches par œil sur la courbe supérieure exacte de la forme ; longueur limitée par la hauteur de l’œil et du visage. Le raster les accroche au premier pixel supérieur visible du masque oculaire, sans flottement sur les triangles/amandes.

Le raster quantifie les supports d’yeux à une largeur entière commune et place les deux bords internes avec exactement ce même intervalle entier ; le haut est arrondi vers le bas de l’image pour ne pas franchir la médiane. Une lecture minimale de deux pixels de face est conservée aux petites tailles. Les positions viennent des attaches et dimensions canoniques ; ces arrondis ne sont pas des placements d’écran indépendants. Iris et pupilles sont limités au masque de l’œil, tous les traits à celui de la tête. Les portraits agrandissent les pixels du même rendu, sans second générateur.

## Conservation et migrations

Les modules corporels R3 sont conservés ; les deux conditions de version de projection/décoration acceptent simplement v4. Les comparaisons vérifient l’identité des volumes/projections hors tête, des articulations et des surfaces corporelles. L’option ovale du bassin et les défauts corporels suivent toujours la politique R3. Aucun ombrage, muscle, poitrine, abdomen, pubis ou poil corporel n’est refait.

Les trois anciens types de tête retirés migrent tous vers `round`, sans changer les paramètres demandés/appliqués, corrections, catégorie, fonction, graine ou apparence corporelle. La forme source et les anciennes traces sont conservées dans la migration vers v4. Les carrés/rectangles deviennent arrondis ; rond/ovale sont conservés. Voir [JSON v4](JSON-V4.md).

Interprétation des cils : F en possède dans ce lot, avec deux intensités ; T peut les désactiver ; M n’a pas de sélecteur. Cette proposition respecte le périmètre indiqué, sans anticiper une option M ultérieure.

Aucun nez ni ancrage nasal ; la médiane est un cadre horizontal, pas un point central supplémentaire. Aucun T3-B2, aucune fusion, aucun jeu ou sauvegarde modifié. Les proportions fines, les tracés, le profil, la lecture aux petites tailles et les cils F restent soumis à l’essai iPad utilisateur.
