# BIO-EPURE-03-L03-R02 — Sourcils et visage procédural initial

Le curseur de hauteur des sourcils utilise l’échelle validée sur la planche R01. **Le nouveau 50 % transmet exactement l’ancienne demande de 6 %.** Les données internes, les archives et les tirages continuent d’exprimer la hauteur sur l’échelle historique.

À l’ouverture d’un nouvel atelier H ou F, les yeux sont réglés sur **Rond**. Les sourcils utilisent la référence normalisée à l’ancien 6 %, le nez et la bouche leurs références normalisées existantes. Les quatre modules sont immédiatement modifiables. Les imports, les changements H/F et les témoins conservent des chemins distincts. [Preview de l’atelier](https://thsethse.github.io/Microcosme/preview/bio-epure-03-l03-r02/) · [PR nº 83 en brouillon](https://github.com/Thsethse/Microcosme/pull/83)

## Base et périmètre

`codex/bio-epure-03-l03-r02` a été créée depuis `24faa5456b1eb5f0c88499a546a05a8de3427d2f`, tête documentaire de `docs/bio-epure-03-l03-r02`. Git et l’API GitHub confirment un seul commit d’écart depuis la tête de la PR nº 82, `d1859196b294607cdb6f192db73f27148d8f012a`. Ce commit ajoute la mission R02. Le lot 02 et l’étude R01 font partie de cette ascendance. [Contrat maître](../CONTRAT_MAITRE.md) · [Contrat lot 03](../CONTRAT_LOT_03.md) · [Mission R02](../MISSION_LOT_03_R02.md) · [Rapport R01](RAPPORT_R01.md) · [Rapport lot 02](../l02/RAPPORT.md) · [Inventaire](../../bio-epure-01-r01/INVENTAIRE.md) · [Carte des dépendances](../../bio-epure-01-r01/DEPENDANCES.md)

Le code de transformation et l’initialisation sont séparés du solveur, du moteur graphique et des formats. La nouvelle preview active ces comportements dans la disposition complète des trois espaces. Les distributions antérieures gardent leur comportement et la planche R01 reste disponible. [Commande de hauteur](../../../../bio-yeux-01/brow-height-control.mjs) · [Initialisation](../../../../bio-yeux-01/procedural-face.mjs) · [Entrée de la preview](../../../../preview/bio-epure-03-l03-r02/build.mjs)

## Réglage et données

Pour le profil courant, le solveur donne `L = effet(ancien 0)`, `A = effet(ancien 6)` et `U = effet(ancien 100)`. Le haut validé est `B = min(U, A + 25)`. La moitié 0–50 interpole la position effective de `L` à `A`. La moitié 50–100 interpole de `A` à `B`. Au repère exact de 50 %, la demande écrite vaut 6. Les 25 points de course maximale au-dessus du repère correspondent à 5 % du rayon vertical du crâne. Les huit autres axes, les limites du contour et des yeux, le pigment et les traits de silhouette utilisent le solveur existant. [Transformation R02](../../../../bio-yeux-01/brow-height-control.mjs) · [Solveur](../../../../bio-yeux-01/brows.mjs)

| État | Lecture et édition dans Création |
| --- | --- |
| Position dans la plage | Le curseur affiche l’équivalent du tracé dans le contexte courant. La demande et la valeur effective historiques restent lisibles sous le curseur. |
| Position au repère et demande historique différente de 6 | L’équivalent affiche 50 % avec les chiffres historiques. Si la limite basse coïncide avec le repère, le texte signale le plateau de 0 à 50 %. La position d’origine et l’ancienne demande restent conservées. |
| Position hors plage, par exemple une demande de 94,875 qui reste effective au-delà de `B` | L’étiquette indique **Hors plage**. Le curseur se place à l’extrémité comme point de départ de l’édition. L’apparence et l’ancienne demande restent intactes jusqu’à un déplacement explicite. |
| Sourcils historiques, latents ou absents | La hauteur est suspendue et le contrôle masqué dans Création. Les demandes restent inspectables au Laboratoire et réapparaissent à la réactivation. |

Le curseur prend des pas entiers lors d’une édition et conserve la précision du point historique calculé. Dans un plateau, le curseur garde la graduation choisie le temps de l’interaction. À la sortie du contrôle, l’équivalent du dessin au repère redevient 50 %. Une plage dont l’extrémité est déjà atteinte demande un déplacement du curseur pour commencer une édition. Le contexte est recalculé après un changement de crâne, d’yeux, d’axe ou de base. Le recalcul modifie l’information affichée, tandis que le canon est rendu à partir de la demande conservée.

L’ancienne demande reste la source canonique pour les 22 versions d’apparence, l’archive atelier H/F, les valeurs latentes et le résident v1. Les neuf presets et les tirages `brows-xoshiro128ss-v1` continuent d’appliquer directement leurs réglages historiques. Sélectionner une référence ou rejouer un tirage applique donc sa demande complète, y compris si elle sort de la nouvelle plage. Ouvrir un panneau, changer un autre réglage, relire une archive ou exporter ne réécrit pas la hauteur. Aucun champ supplémentaire ni conversion de fichier n’est nécessaire. [Éditeur des sourcils](../../../../bio-yeux-01/brows-editor.mjs) · [Apparence](../../../../bio-yeux-01/appearance.mjs) · [Archive atelier](../../../../bio-yeux-01/workshop-archive.mjs) · [Résident](../../../../bio-yeux-01/resident.mjs)

## Création et restauration

| Action | Comportement de l’atelier |
| --- | --- |
| Initialisation d’un nouvel atelier | Base H lors de la première ouverture, ou dernière base adulte conservée par le navigateur. Yeux Rond, sourcils normalisés à la demande historique 6, nez et bouche normalisés. Les activations facultatives, les cheveux, les pigments et le corps suivent les règles existantes. |
| Restauration d’apparence ou d’archive complète | Les données du fichier fixent les rendus procéduraux ou historiques, les demandes, les tirages et les mémoires H/F selon le format. |
| Sélection ou restauration d’une fiche habitant | Technique conserve l’identité et les trois représentations de la fiche. Le personnage de Création est indépendant du témoin. |
| Changement de base H/F | Le visage courant reste commun. Les mémoires corporelles H/F, par exemple la corpulence, sont restaurées comme au lot 02. |
| Relecture du JSON de sélection historique | Ce format reste partiel. Il relit les clés du catalogue et la morphologie sur l’atelier courant. Une ancienne apparence complète se relit dans **Archive de l’atelier H/F**. |
| Remise explicite au dessin historique | Les commandes de chaque module sont disponibles dans **Laboratoire → Gabarits et références historiques**. La remise historique d’un module conserve son effet antérieur de réinitialisation de la valeur et du tirage de ce module. Décocher sa personnalisation dans Création conserve les réglages latents. Après une remise explicite des sourcils, une réactivation sans mémoire utilise la référence manuelle historique existante. |

Le stockage navigateur de la dernière base H/F reste distinct de l’archive complète. Après une réouverture sans restauration, l’atelier démarre sur un personnage neuf de cette base. L’export puis l’import sont le chemin de reprise d’un personnage complet.

Le point d’intégration pour une future création d’habitant est `initialProceduralFace()`, qui fournit les demandes anatomiques existantes. Un futur créateur doit poser des demandes normalisées pour `biology.face.nose` et `biology.face.mouth` dès la création de son canon. Les lecteurs et les fiches existantes gardent leur compatibilité avec l’absence de ces blocs. [Initialisation des demandes](../../../../bio-yeux-01/procedural-face.mjs) · [Format habitant](../../../../bio-yeux-01/resident.mjs)

## Tests et publication

| Vérification | Résultat |
| --- | --- |
| Suites historiques et R01 | **223 tests existants + 5 tests R01 réussis**, aucun échec. Elles incluent les distributions historiques, les archives, les presets et les contraintes anatomiques. |
| Suite R02 | **4 réussis, 0 échec**. Transformation comparée à R01 sur 1 404 configurations et 21 positions par configuration. Les 756 plateaux bas et les autres axes sont conservés. Le SVG au repère est identique sur les neuf témoins dans les deux cadrages. Le test exerce une borne anatomique haute restrictive et les références d’initialisation. |
| Recette navigateur locale | Réussie sous Chromium **151.0.7922.34** et WebKit **26.5** avec profil iPad Mini. Les démarrages H et F utilisent les quatre références. Trois comparaisons du personnage sur trois vues contrôlent l’égalité à demandes identiques, le retour historique et le maintien de la hauteur hors plage. Les parcours couvrent quatre éditions de hauteur et deux restaurations à froid de valeurs masquées. |
| Recette navigateur sur la publication | Même parcours complet réussi sous Chromium et WebKit sur les réponses de GitHub Pages, avec vérification des trois empreintes SHA-256 du manifeste. Un relais HTTP local a transmis au banc d’essai les ressources récupérées en HTTPS avec vérification du certificat. |
| Compatibilité navigateur | Les 22 versions d’apparence sont relues, réexportées et comparées au lot 02 sur les trois vues dans chaque moteur. Deux fiches habitants sont restaurées à froid sur leurs trois projections. L’archive vérifie les mémoires H/F, la demande hors plage 94,875, la demande saturée 3,125 et la relecture distincte du JSON de sélection historique. |
| Régression des trois espaces | Chaque moteur ouvre 18 planches à la demande et observe 646 SVG montés aux premières ouvertures, vérifie les dix modules de tirage et le rejeu historique des yeux, la visibilité conditionnelle et la persistance des erreurs. Contrôles complémentaires aux largeurs 768, 1 024 et 390 px, sans débordement, zones de navigation de 44 px minimum et déplacement du curseur par les flèches. |
| Déploiement Pages | Build `built` du commit `d4fc88d5f6bee6a84ca83790677f790435483629`. La branche source Pages `main` reçoit uniquement les quatre fichiers statiques sous le chemin demandé. Ils ont tous été récupérés directement en HTTPS et comparés octet pour octet avec le build local. |

Le manifeste fixe le commit source `7e9d00c6d9dfc334f30a3929f83a3a1bcf740621` et le bundle `atelier-afd32b558d7150b5.js`. [Manifeste public](https://thsethse.github.io/Microcosme/preview/bio-epure-03-l03-r02/version.json) · [Suite Node R02](../../../../bio-yeux-01/tests/editor-lot03.test.mjs) · [Recette navigateur](../../../../bio-yeux-01/tests/editor-lot02-browser.cjs)

Reproduction locale avec Node, les dépendances du dépôt et Playwright Chromium et WebKit.

```sh
npm ci
npx playwright install chromium webkit
node --test tests/*.test.js bio-col-01/tests/*.test.mjs bio-yeux-01/tests/*.test.mjs preview/bio-epure-03-l03-r01/study.test.mjs
node preview/bio-epure-03-l02-r01/build.mjs /tmp/microcosme-l02
node preview/bio-epure-03-l03-r02/build.mjs /tmp/microcosme-l03-r02
PREVIEW_MISSION=BIO-EPURE-03-L03-R02 PREVIEW_DIR=/tmp/microcosme-l03-r02 REFERENCE_DIR=/tmp/microcosme-l02 \
  node bio-yeux-01/tests/editor-lot02-browser.cjs
```

## Limites et anomalies

- Les plateaux restent imposés par l’enveloppe anatomique. Dans une configuration située au plateau bas, le repère 50 revient à l’affichage après l’édition parce que plusieurs graduations produisent le même tracé. Les chiffres historiques précisent la demande réellement stockée.
- Pour un tracé hors plage, le curseur attend une action sur l’une des graduations accessibles. La hauteur d’origine reste lisible et peut redevenir représentable si le contexte change.
- La recette Safari sur iPad physique reste à exécuter. Les vérifications navigateur utilisent un profil tactile émulé.

## Recette ciblée sur iPad physique

1. Ouvrir la preview dans Safari en portrait. Vérifier dans **Création** la forme **Rond**, **50 %** dans **Sourcils**, et les trois panneaux Sourcils, Nez et Bouche actifs. Ajuster un paramètre dans chacun. Passer en F et revenir en H. Les réglages du visage doivent suivre le personnage et les valeurs corporelles propres à chaque base doivent revenir.
2. Dans **Sourcils**, appliquer **Épais**. Si cette référence est **Hors plage**, garder un export de son archive avant édition. Déplacer le curseur vers 75, puis vers 50. Vérifier que 50 indique **6 % demandé** sur l’échelle historique. Balayer 0–50 % sur ce profil et vérifier le message de plateau et le tracé stable. Aller à 100 % et observer la remontée.
3. Dans **Technique**, exporter l’archive atelier et garder le JSON dans Notes. Rouvrir la preview, restaurer l’archive et comparer les trois vues. Relire ensuite l’export du preset **Épais** effectué avant édition, ou une ancienne archive dont la hauteur demandée vaut 94,875. Vérifier l’étiquette **Hors plage**, changer une forme d’œil puis réexporter. Vérifier que `active.brows.requested.height` conserve sa demande d’origine, 64 pour le preset **Épais**, jusqu’au déplacement du curseur.
4. Masquer les sourcils, exporter, restaurer et réactiver. La demande doit revenir. Dans **Laboratoire**, rétablir au besoin les dessins historiques avec les quatre commandes dédiées. Revenir dans Création et vérifier le rendu historique. Dans **Technique**, ouvrir un témoin et vérifier que le portrait de Création reste intact. Refaire les contrôles essentiels en paysage. [Ouvrir la preview](https://thsethse.github.io/Microcosme/preview/bio-epure-03-l03-r02/)
