# BIO-VIS-P4 — Catalogue capillaire

Prototype frontal autonome, basé sur **P3-R1 validé graphiquement par l’utilisateur dans la mission P4**. Les nouveautés P4 restent à valider artistiquement. Aucun moteur, sauvegarde ou autre prototype modifié. Branche `codex/bio-vis-p4`, PR distincte, sans fusion.

- [Preview Safari iPad](https://thsethse.github.io/Microcosme/preview/bio-vis-p4/)
- [36 comparaisons interactives](https://thsethse.github.io/Microcosme/preview/bio-vis-p4/audit.html) : six coiffures × six corps, tête neutre, combinaison iPad R1 ou tous les maximums.
- [R1 inchangé](https://thsethse.github.io/Microcosme/preview/bio-vis-p3-r1/)

## Catalogue : 18 modèles

| ID | Coiffure | Origine / caractère |
| --- | --- | --- |
| shaved | Rasée | V1 01 · crâne volontairement dégagé |
| short | Courte ébouriffée | V1 02 · petites pointes irrégulières |
| classic | Classique courte | V1 03 · modèle R1 inchangé |
| bob | Carré court | V1 04 · modèle R1 inchangé |
| fringe_bob | Carré à frange | V1 05 · frange pleine et coupe droite |
| mid_waves | Mi-longs ondulés | V1 06 · vagues aux épaules |
| long_straight | Longs lisses | V1 07 · raie centrale et longueurs arrière |
| curls | Boucles courtes | V1 08 · modèle R1 inchangé |
| long_curls | Boucles longues | V1 09 · boucles épaisses, poitrine |
| braids | Tresses | V1 10 · deux tresses avant |
| bun | Attaché · chignon | V1 11 · chignon haut et mèches latérales |
| pony | Queue de cheval | V1 12 · attache haute et queue arrière décentrée |
| waist_straight | Très longs lisses | Exploration · rideaux avant, taille |
| waist_waves | Très longs ondulés | Exploration · vagues épaisses, taille |
| waist_curls | Très longues boucles | Exploration · cascade de boucles, taille |
| afro | Afro ample | Exploration · couronne large à contour lobé |
| side_braid | Natte sur l’épaule | Exploration · une natte épaisse devant l’épaule droite de l’image |
| asym_long | Asymétrique · carré et cascade | Exploration · carré à gauche, cascade à droite de l’image |

Les coiffures se distinguent par leurs contours, implantation, texture, attache ou trajet, pas seulement par leur couleur. La case « Une seule couleur » facilite cette appréciation. La distinction artistique reste à juger par l’utilisateur ; la présence de signatures SVG différentes ne la prouve pas.

## Références et préparation

Branches et PR ouvertes examinées, dont #23 et #27–#30 ; aucune fusion. Aucun `AGENTS.md` trouvé. La mémoire n’est pas sur main sous `docs/llm-project-memory/` : lecture de `docs/ai/START_HERE.md`, `PROJECT_STATE.md`, `DECISION_REGISTER.md`, `WORK_LOG.md` sur la branche **docs/llm-project-memory**. Elle ne valide aucune modification du moteur biologique. Base main : `7536db13262e1c9eec23484949ea8f82c83c3203`.

Copies autonomes des deux PNG du dépôt, vérifiées par décodage et SHA-256 :

| Référence | Source du dépôt | SHA-256 |
| --- | --- | --- |
| [Habitants](references/inhabitants.png) | `docs/ai/visual-references/BIO-VIS-P1-planche-originale.png` | `ddb6a8515fcedd0bdc4493bdc3fe3afb32322706012186f481efa764875c3e06` |
| [Catalogue V1](references/catalogue-v1.png) | `docs/ai/visual-references/a_clean_infographic_character_design_sheet_in_warm.png` | `06dec2e59f34f195363cf482d51cae34808d4d3b3ff1e8863e8ba217bf571932` |

La planche originale n’est pas manquante. Contours ocres, aplats chauds, volumes simples et corps schématiques conservés. Pas de pixel art, de dégradés, de nouvelle anatomie ou de physique capillaire.

## Construction et préservation de R1

`r1/` contient huit modules **copiés à l’identique** de la preview R1 publiée, issue du code `ec531c6`. Le test compare leurs octets au snapshot existant `preview/bio-vis-p3-r1/`. Le modèle R1 calcule toujours le contour du visage, les huit paramètres bornés, les ancrages anatomiques et les ancrages capillaires. Les corps utilisent les formes P1 déjà présentes dans cette dépendance.

Les trois modèles existants rendent exactement le même groupe de tête que R1, vérifié sur les 256 sommets du domaine pour chacun. Les autres coiffures utilisent cette même géométrie et la calotte locale `coverageCap`, basée sur les normales du contour réel du crâne, avec sa marge de recouvrement R1. La rasée laisse intentionnellement le crâne apparent.

Les nouveaux volumes se construisent à partir de la calotte, des tempes, du passage des joues/bajoues et de la nuque ; longueurs et attaches sont des offsets locaux. Les côtés et la couronne ne subissent pas une transformation globale unique. Les répétitions de tresses, vagues et boucles gardent leur topologie pendant la déformation ; les textures ne tirent aucun nombre aléatoire.

Ordre de dessin des nouveaux modèles : masse arrière → corps existant → visage → calotte R1 → frange et côtés → texture → longueurs explicitement avant. Les longueurs avant ne sont pas redessinées dans le détail de tête, où les cheveux longs sont recadrés avec le haut des épaules ; le personnage entier permet de suivre leur trajet complet. Les corps ne déplacent jamais les ancrages de tête et n’ajustent jamais les mèches.

## Constats d’intégration réellement observés

Inspection des captures WebKit sur les six corps, complétée par la page interactive. Ces constats décrivent ce rendu frontal schématique, sans simuler une anatomie ou une collision en profondeur.

| Comparaison | Constat visible | Limite à décider ultérieurement |
| --- | --- | --- |
| [Longs lisses arrière](captures/webkit-long_straight.png) | Les épaules larges coupent horizontalement la lecture de la masse arrière ; les longueurs disparaissent entièrement derrière le corps de référence et les épaules larges. Sur le corps mince, une grande partie de la chevelure déborde de la silhouette. | Un ordre arrière fixe ne décrit pas un passage progressif autour de l’épaule. |
| [Très longs lisses avant](captures/webkit-waist_straight.png) | Les deux rideaux restent presque verticaux : ils flottent à côté du corps mince et se superposent aux côtés du buste large. Le haut des épaules larges dépasse latéralement. | Le volume du buste ne repousse pas les longueurs ; leur contact n’est pas résolu. |
| [Très longues boucles](captures/webkit-waist_curls.png) | Les gros lobes avant recouvrent les contours latéraux et une partie des extrémités des traits de poitrine ; la zone centrale du visage et du buste reste lisible. | Des intersections avec la lecture du bras et du sein sont visibles ; les boucles ne contournent pas le corps. |
| [Afro ample](captures/webkit-afro.png) | Le volume arrière descend de chaque côté du cou sur le corps mince ; sa base disparaît derrière la ligne horizontale des épaules larges. | Contact raide au niveau des épaules, sans transition spécifique. |
| [Natte avant](captures/webkit-side_braid.png) | La natte est entièrement à l’extérieur du corps mince ; avec les épaules larges elle se dessine sur le bras supérieur, puis continue à l’extérieur du tronc. Sur le corps large, elle longe puis recouvre le côté du ventre. | Le libellé « sur l’épaule » décrit l’intention ; la position n’est pas recalée sur chaque épaule. |
| [Asymétrique](captures/webkit-asym_long.png) | Le carré reste court à gauche. La cascade droite est extérieure sur le corps mince et coupe visuellement le bord du bras sur les épaules larges. | La profondeur avant/arrière est choisie pour toute la mèche, sans changement au point de contact. |

Aucun moteur de collisions n’a été développé pour ces problèmes, aucun corps ou visage n’a été déformé pour les dissimuler. Pas de traversée animée évaluée : il n’y a pas d’animation corporelle. Le cou des habitants reste la jonction tête/corps schématique héritée de P1 ; aucune nouvelle structure anatomique n’est introduite.

## Vérifications reproductibles

Depuis la racine :

```sh
npm ci
node --test bio-vis-p4/model.test.mjs
npx playwright install --with-deps chromium webkit
node bio-vis-p4/browser.test.cjs
node bio-vis-p4/r1-regression.test.cjs
npm test
```

- **5 tests Node P4** : présence et signatures des 18 modèles ; intégrité R1/références ; **4 608** combinaisons extrêmes avec coordonnées finies, ancrages et calotte identiques au modèle R1 ; **5 904** sondes locales de continuité sur les huit axes (topologie et déplacements bornés) ; invariance des ancrages selon les six corps.
- **Par navigateur (Chromium et WebKit)** : **756** états SVG (neutre, cas iPad R1, 16 combinaisons extrêmes, 24 mélanges déterministes, pour les 18 coiffures), chemins interprétés par le navigateur, recouvrement du haut du crâne, zones faciales protégées, front naturellement ouvert sauf frange, puis **216** contrôles de cadrage du personnage entier.
- Interface : 18 cartes tactiles, six corps, huit curseurs sur six modèles représentatifs, réinitialisation, trois échelles, points d’ancrage, couleur commune, quatre formats jusqu’au téléphone, références, fonctionnement des contrôles hors réseau après chargement, sentinelle de sauvegarde intacte, 36 comparaisons interactives.
- **Régression R1 : 816 états par navigateur**, cas iPad avant 26/117 points manqués puis après 0/117, front ouvert, ancrages et trois échelles.
- **Jeu existant : 35 tests Node** ; workflow navigateur existant conservé.

La CI dédiée `.github/workflows/bio-vis-p4.yml` exécute les suites P4 et R1. Pour régénérer les captures : `CAPTURE_DIR=bio-vis-p4/captures node bio-vis-p4/browser.test.cjs`. Les PNG livrés sont des captures WebKit de la comparaison neutre, pas des retouches. [Capture tactile iPad](captures/webkit-p4-ipad.png). Le jeu n’est ni importé ni lancé par le prototype.

## Limites de validation

WebKit Playwright avec format et événements tactiles iPad n’est pas Safari exécuté sur un iPad physique. Le dernier contrôle artistique, le confort tactile et les performances sur l’appareil réel restent à confirmer. Pas de mesures 60 images/s ni de certification de toutes les versions Safari. Les frontales ne valident pas les profils ou les vues arrière du catalogue V1. La rasée n’a pas de recouvrement attendu. Les très longues mèches sont volontairement recadrées dans le détail de tête ; leur forme entière est visible sur le personnage entier.

Les tests techniques ne remplacent pas la validation artistique : lisibilité des textures à petite échelle, aplats des masses longues, frange très géométrique et qualité du passage cou/épaules restent des sujets de revue visuelle.

Publication : snapshot statique uniquement sous `preview/bio-vis-p4/` sur main pour GitHub Pages, séparé de la branche et de la PR de code. Aucun autre prototype ni fichier du jeu n’entre dans ce commit de publication. La PR de code reste non fusionnée.
