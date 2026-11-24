# Microcosme · Audit BIO-INV-01

Audit de la révision `baecb1b419240ad3517711bae99fa14e607a5aef` sur `docs/bio-inv-01`. Les résultats distinguent l’atelier SVG actuel, ses ancêtres graphiques et les laboratoires Canvas indépendants. Les propositions ci-dessous sont soumises à validation. [Invariant validé](../BIO-INV-01.md) · [Matrice des paramètres](MATRICE.md) · [Protocole et preuves](REPRODUIRE.md)

## Décisions à prendre

| Ordre | Importance | Écart vérifié | Correction proposée | Risque pour les acquis |
| --- | --- | --- | --- | --- |
| 1 | Haute | **P1 · Export incomplet dans l’atelier SVG.** Les yeux et la palette se perdent à froid. | Définir un export d’apparence versionné et compléter l’import historique. | Élevé si des alias ou les valeurs historiques sont réécrits. |
| 2 | Haute | **P2 · Tirage des yeux biaisé par le repli.** Sur deux morphologies étroites, 17,8 % et 43,8 % des tirages atteignent la limite. | Échantillonner par domaine admissible et distinguer les versions du tirage. | Élevé pour le rejeu des anciennes graines si l’algorithme change sur place. |
| 3 | Haute | **P3 · Domaines des yeux fixes à l’écran, paliers et intervalles disjoints.** | Guider la saisie selon les autres valeurs, avec indication des corrections conjointes. | Moyen si le solveur, ses priorités ou les presets existants sont modifiés en même temps. |
| 4 | Moyenne | **P4/P5 · Contrôles inactifs présentés comme actifs.** Hauteur du front sans cheveux, contraste, accessoires et palette selon le choix. | Expliquer l’inactivité selon le contexte et conserver les valeurs latentes. | Faible avec une correction d’interface. Élevé si la géométrie cachée ou les accessoires sont retouchés. |
| 5 | Moyenne | **P6 · Équivalences de catalogue et différences perceptuelles locales.** | Conserver les alias historiques et mesurer les différences par échelle. | Élevé si un identifiant, des mèches ou une nuance sont supprimés à partir d’un seul seuil. |
| 6 | Conditionnelle | **L1–L4 · Limites propres aux laboratoires Canvas.** | Traiter dans leur laboratoire si sa réutilisation est décidée. | Élevé pour la compatibilité des archives si les formats sont regroupés. |

## Versions auditées

| Famille | Chaîne effectivement utilisée |
| --- | --- |
| Atelier SVG | `bio-yeux-01/app.mjs` et `render.mjs` au-dessus de BIO-COL-01 `af1da96`. Lots capillaires DEDUP 1–3 publiés via `9590c80` et ses ancêtres, puis P5-I6. L’ovale déformable et le corps des six presets proviennent de P4-R1 et P1, par leurs copies embarquées dans P5-I6. Le rendu Pages BIO-YEUX-01 de `9cd8b52` est construit depuis `13c57a9`. Les changements ultérieurs jusqu’à la base d’audit concernent les tests et la documentation. |
| Ancêtres SVG visibles séparément | P1 expose les paramètres primitifs. P2 propose trois têtes (`oval`, `round`, `pear`) avec les coupes classiques, carrées ou bouclées. P4-R1 fournit un seul type de contour déformable à l’atelier actif. Les cinq catégories de tête P1 ne sont pas des choix de cet atelier. |
| Laboratoires Canvas | BIO-GEN-T1, sa révision B2, puis BIO-GEN-T2 ont leurs schémas de graine et de représentation. BIO-STRUCT-T3-B2 est le dernier atelier parallèle de structure et prolonge R3 (corps) et B1 (visage). Son JSON v5 décrit ses réglages propres. |
| Microcosme à la racine | `graphics.js` dessine des sprites d’après l’identité, la direction et le cycle d’animation. L’atlas est alimenté par `renderer.js`. `storage.js` conserve l’identité du jeu. Cette chaîne ne charge ni les presets SVG, ni les réglages Canvas, ni leurs formats d’apparence. |

## Constats sur l’atelier SVG

### P1 · Reproduction incomplète de l’apparence

**Paramètres et cause.** `exportSelection` sérialise `selection.raw`. Les axes de morphologie, le corps, l’identifiant de coiffure, les accessoires et le contraste y figurent si renseignés. `eyes`, `selectedForm`, `colour`, le mode d’aplat et la graine courante vivent dans des variables ou des contrôles de l’atelier. Les valeurs normalisées et les valeurs effectives du solveur ne sont pas exportées. Une valeur importée de `skull_width: 9` reste dans le JSON source et donne 1,18 au rendu, avec un curseur à 1,18. La valeur réellement appliquée est donc reproductible tant que la même normalisation est disponible.

**Preuve.** Charger 61-G, le corps `bust`, la morphologie `tall`, Bleu vif et un tirage de graine `archive-bio-inv`. Un aller-retour JSON dans la même page garde la même empreinte raster. Après actualisation, le même JSON restaure 61-G mais donne des yeux historiques et un aplat désactivé. Chromium et WebKit donnent ce résultat. À l’API, le rejeu du même visage en fournissant la couleur et les huit valeurs effectives à pleine précision redonne le SVG à l’octet pour le cas testé, avec `instance` constant. [Preuve modèle](preuves/vecteurs.json) · [Preuve navigateur](preuves/webkit-rendus.json)

**Correction et risque.** Ajouter un document d’apparence optatif séparé du JSON historique. Y enregistrer version de schéma et du rendu, identifiant exact G/D/U, choix et valeurs appliqués, mode historique ou personnalisé, couleur et mode de palette. Conserver demandes et graine en métadonnées si leur réédition ou leur rejeu est utile. Stocker les valeurs effectives sans l’arrondi de l’interface. Tester l’import ancien, le cycle à froid et les références de catalogue avant tout changement. Une conversion d’office de 61-G en 56-G ferait perdre un rendu historique.

### P2 · Biais du tirage conditionnel des yeux

**Paramètres et cause.** `randomEyes` propose des tuples de huit entiers issus d’un LCG initialisé par graine. Il rejette ceux qui ne tiennent pas dans l’enveloppe. Après 128 tentatives, il conserve le dernier profil de courbure et force largeur 75 %, hauteur 40 % et inclinaison 0°. Les deux morphologies les plus difficiles testées ont un domaine admissible réellement plus petit. À cela s’ajoute la masse créée par ce repli.

| Visage | Graines | Acceptation par proposition | 95e centile des essais | Replis |
| --- | ---: | ---: | ---: | ---: |
| Neutre | 4 096 | 15,67 % | 19 | 0 |
| Allongé `tall` | 4 096 | 7,24 % | 40 | 0 |
| Large `broad` | 4 096 | 31,29 % | 8 | 0 |
| Cas iPad combiné | 4 096 | 20,16 % | 14 | 0 |
| Étroit `narrow` | 4 096 | 1,35 % | 128 | 729 (17,8 %) |
| Étroit et haut `elongated` | 4 096 | 0,64 % | 128 | 1 793 (43,8 %) |

**Preuve.** Le diagnostic journalise les propositions avec le prédicat de production et vérifie les 24 576 sorties contre la fonction publique. Un tirage témoin, avec un autre PRNG et rejet sans repli, retrouve une préférence structurelle pour les faibles largeurs sur les visages étroits. L’écart maximal entre les fonctions de répartition empiriques de hauteur monte en revanche à 0,177 sur `narrow` et 0,412 sur `elongated`, contre au plus 0,032 sur les quatre visages sans repli. Le triplet (75, 40, 0) apparaît 732 fois sur le visage étroit contre 2 dans le témoin, puis 1 796 fois sur le visage étroit et haut contre 9. La graine `bio-inv-3` déclenche le repli dans les deux cas. Ces mesures ne prouvent pas l’uniformité des autres corrélations. [Comptages, graines témoins et histogrammes](preuves/vecteurs.json)

**Correction et risque.** Définir une mesure de référence pour l’espace admissible, par exemple les tuples entiers si la grille actuelle est conservée. Échantillonner directement dans cet espace ou construire des propositions conditionnelles dont les poids suivent le nombre de solutions admissibles. Ajouter un témoin de rejet et un test de la masse au triplet de repli. Versionner le tirage pour conserver le rejeu des graines existantes. Les limites anatomiques, les presets et la possibilité de distributions artistiques déclarées restent des contraintes de la future correction.

### P3 · Bornes effectives et corrections conjointes des yeux

**Paramètres et cause.** Les curseurs utilisent les plages contractuelles fixes. Le solveur vérifie le tracé incliné trait compris, avec les plafonds, le rapport et les marges du visage. Il réserve l’ouverture minimale, privilégie l’inclinaison puis la largeur et rétablit autant de hauteur que possible. Cette stratégie donne une forme admissible et laisse des zones du curseur presque équivalentes. Avec le profil neutre, la largeur demandée atteint 120 %. Elle plafonne à environ 89,52 % sur un visage neutre et 75,40 % sur le visage étroit testé. À largeur demandée fixe de 100 %, la hauteur sature vers 82,15 % sur visage neutre. En Chromium, les 46 demandes de largeur ne donnent que 16 images exactes distinctes à chacune des trois tailles. Les paliers calculés sont détaillés dans la matrice.

**Preuve d’intervalles disjoints.** Fixer largeurs et hauteur des yeux à 94 % et 42 %, courbures à 78 % et 114 %, effilement à 65 %, sommets à −13 % et 9 %. Sur le coin morphologique 159, les angles entiers admissibles sont `[-12,-10] ∪ [10,12]`. À −9°, le solveur conserve l’angle et ramène la largeur à 93,7460 %. La rotation peut réduire l’étendue horizontale de l’ouverture. Une seule paire min/max ne représente pas ce domaine. Les tranches balayées ont montré ce cas pour l’inclinaison. Le diagnostic ne conclut pas à l’absence d’autres îlots. [Paramètres complets et tranches](preuves/vecteurs.json)

**Correction et risque.** Montrer la zone admissible, la valeur demandée et la valeur effective avec la cause de la limite et les axes qui ont bougé. Gérer les plages disjointes ou une tranche sans solution, par exemple en signalant les corrections de width/height avant application. Rejouer les presets, l’historique et les anciens imports à l’octet avant de modifier la priorité du solveur. Aucun élargissement des bornes anatomiques n’est nécessaire pour traiter l’interface.

### P4 · Hauteur du front, corps et paramètres masqués

**Paramètres et cause.** Dans P4-R1, `forehead_height` produit `fy`, une hauteur d’implantation des cheveux. Le contour facial prend ses ordonnées depuis la hauteur du crâne et des fractions fixes. À crâne rasé, les 35 valeurs 0,84–1,18 donnent le même SVG. Avec cinq coiffures testées, elles donnent 35 SVG différents. Le libellé suggère une hauteur faciale que ce paramètre ne change pas. Les multiplicateurs de corps `shoulders`, `belly`, `hips` sont actifs dans P1. Dans l’atelier courant, ils proviennent du preset `body` et les mêmes clés ajoutées au JSON brut ne pilotent pas le corps. Les six presets restent distincts aux trois échelles.

**Correction et risque.** Expliquer le rôle d’implantation et rendre le contrôle inactif avec une tête rasée, tout en gardant sa valeur lors d’un changement de coupe. Signaler les clés de corps non pilotées et conserver leurs données anciennes. Modifier les proportions du visage pour rendre le libellé littéral déplacerait le contour validé, ainsi que des recouvrements et des limites d’yeux. [Matrice des axes](MATRICE.md) · [SVG et projections](preuves/vecteurs.json)

### P5 · Palette, contraste et accessoires conditionnels

**Paramètres et cause.** Sur les 126 identifiants, `accessories` change le SVG pour 56 choix, `contrast` pour trois (50-G, 50-D et 62-D). Le contraste de 50-D se voit également aux trois échelles. Les 18 références d’arrangement U ignorent G/D. Les 26 aplats sont sans effet sur la Rasée et 63-G, où aucune surface de cheveu colorable n’est dessinée dans l’état testé. Le sélecteur accepte pourtant les couleurs et active le mode aplat. Le champ historique `monochrome`, qui n’a pas de curseur dans cet atelier, modifie 120 SVG sans palette et est neutralisé avec Châtain clair dans 64 cas. Dans les autres cas, des différences de contraste ou d’accessoires peuvent subsister, car la peinture de BIO-COL-01 intervient après la sélection des couches.

**Preuve.** Basculer contraste ou accessoires sur 38-G donne des pixels exactement identiques aux trois tailles. Sur 50-D, le contraste modifie 1 333, 212 et 81 pixels au seuil de 16 en WebKit. Sur 63-G, masquer les accessoires modifie le rendu, tandis que changer la palette n’ajoute aucun cheveu sous la couverture. [Matrice des 126 identifiants](preuves/vecteurs.json) · [Vérifications raster](preuves/webkit-rendus.json)

**Correction et risque.** Présenter la disponibilité d’une option pour le choix courant et conserver la sélection latente. Documenter la priorité monochrome, aplat et contraste, ainsi que le cas des liens historiques incorporés aux tracés. Ne pas rendre les liens recolorables ou créer des cheveux sous l’accessoire pour rendre le contrôle actif. Une disponibilité fondée sur les seules étiquettes du catalogue manquerait 50-D et des autres couches héritées.

### P6 · Redondances graphiques et finesse utile

Sur les 126 identifiants testés dans le contexte neutre, Chromium donne 122 images distinctes à chaque échelle. Les paires 19-G/21-G, 28-G/59-G, 64-G/70-G et **48-D/65-D** sont identiques aux trois tailles. 48-D/65-D se trouve encore en double dans le catalogue ordinaire. La branche D de 65 réutilise les couches de 48-D. Le document P5-I6 l’indiquait déjà. Le contrôle ciblé donne 72 paires SVG équivalentes après retrait des seules métadonnées et des groupes de calques vides, sur trois morphologies, les combinaisons d’accessoires et de contraste, trois vues et deux modes de palette. Les groupes 47-G/50-G et 49-G/62-D gardent des contrastes historiques visibles. 56-G/61-G reste visiblement distinct à toutes les échelles avec ses mèches et ses ornements d’origine. 54-G/69-G diffère aussi avec ses accessoires. Le test ne permet pas de reconstituer l’implantation sous les lunettes. Ces résultats ne justifient pas de supprimer un identifiant ni de masquer une différence visible.

Les huit formes d’yeux et l’historique restent distincts à l’octet raster dans les trois vues du visage neutre rasé. En WebKit, Rond/Ovale ne produit aucun pixel au-dessus du seuil en miniature, mais 22 pixels à 178 px et 211 à 300 px. Relevé/Tombant est un autre exemple, avec 0 pixel au seuil à 70 px et un écart visible sur le gros plan. Les 26 aplats et les 26 contours sont distincts. Noir ébène et Brun sombre forment la paire la plus proche en OKLab mesurée sur les aplats (`Δ = 0,0403`). Sur 38-G, ils produisent pourtant 2 730 pixels au seuil en tête et 97 en miniature sur fond clair dans WebKit.

**Correction et risque.** Garder les groupes validés et la possibilité de rouvrir le rendu par son identifiant exact. Si une réduction du catalogue ordinaire est souhaitée, examiner 65-D comme alias de 48-D en préservant 65-G et les identifiants historiques. Afficher le gros plan quand la différence compte. Une simplification éventuelle doit se limiter à la navigation ou à la présentation d’un groupe, après vérification sur le rendu complet avec les deux fonds et les contrôles actifs. Un seuil global de miniature risquerait d’éliminer des profils utiles à 300 px. [Comparaisons aux trois tailles](preuves/webkit-comparaisons.png) · [Données WebKit](preuves/webkit-rendus.json)

## Laboratoires historiques et limites de couverture

Les laboratoires historiques ont leurs propres constats et formats. Ils ne sont pas utilisés pour rendre BIO-YEUX-01. La matrice donne leurs plages, les contextes où des réglages deviennent inactifs et les résultats de rejeu. Les conclusions raster du SVG ne sont pas extrapolées aux Canvas. Des témoins ont été rendus par leurs moteurs natifs puis présentés aux trois tailles pour vérifier certains paliers et équivalences. [Matrice des laboratoires](MATRICE.md#laboratoires-canvas)

L’audit est frontal pour l’atelier SVG. Il compare des cadres carrés fixes de 300, 178 et 70 pixels avec les viewBox historiques. Le profil et le dos restent couverts dans les projections des laboratoires Canvas. Les balayages par axe gardent les autres réglages constants et les tirages utilisent des graines numérotées. Les 256 coins du domaine morphologique et les échantillons intérieurs n’épuisent pas le domaine continu. Les seuils ne constituent pas une validation artistique ou un essai sur iPad physique. [Méthode et étendue](REPRODUIRE.md)
