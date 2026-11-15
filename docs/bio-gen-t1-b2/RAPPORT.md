# BIO-GEN-T1 — révision B2

Branche indépendante `codex/bio-gen-t1-b2`, issue de `13cd877` (PR #13 conservée, non fusionnée). Architecture et décisions consultées dans la mission B2, les documents de transmission et la PR #13. Aucune modification de la simulation, des comportements, des sauvegardes ou de la biologie canonique.

## Livrables et architecture effective

- `experiments/bio-gen-t1-b2/model.js` : profil JSON v2, 18 paramètres conservés + 14 ajouts justifiés, migration v1 déterministe, géométrie/palettes/cartes pileuses communes. Voir [matrice avant implémentation](MATRICE.md) et [inventaire/migration](PARAMETRES.md).
- `render.js` : projection pixel art orthographique par lignes de pixels, portrait 128×144 et corps 80×128 avant/dos/profil. Crâne à rondeur interpolée, mâchoire effilée, contours du tronc et bassin, membres en segments effilés raccordés aux articulations. Peau sur tout le corps B2, sans vêtements, mamelons ni détail génital. Aucun tirage aléatoire dans le rendu.
- `lab.js`, `lab.css`, `index.html` : galerie B1/B2, 32 curseurs, sélection tactile, JSON, rejeu exact et huit exemples de propriétés. La colonne B1 montre la référence historique habillée, pas le rendu expérimental B2. Changer les 18 paramètres communs actualise aussi la référence B1 ; les nouveaux paramètres ne modifient que B2.
- `baseline/model.js`, `baseline/render.js` : instantané B1, seuls noms globaux modifiés pour coexistence. Aucun import des fichiers du jeu principal.
- `gallery.json` : 20 profils v2 de mêmes graines et mêmes 18 valeurs que B1. [Exemples capturés](EXEMPLES.png) : huit combinaisons sur la graine `examples-adult`. Les exemples modifient seulement les propriétés nommées, sans bloquer les autres curseurs.
- `tests/bio-gen-t1-b2/` et workflow dédié : modèle et parcours réels Chromium/WebKit ; conservation des suites B1 et historiques.
- [Principes capillaires](COIFFURE.md), mesures brutes et [publication](PUBLICATION.md).

Ouvrir `experiments/bio-gen-t1-b2/index.html` ou son dossier complet localement : pas de compilation, pas de requête applicative distante, pas de stockage historique. Les 18 champs initiaux gardent leurs bornes et leur génération exacte ; le flux des nouveaux champs est indépendant. Import v1 complété avec valeurs fixes documentées ; export v2 explicite. La compatibilité des données ne promet pas des pixels B2 identiques à B1.

## Matrice des expériences

| ID | Propriété vérifiée automatiquement | Résultat / limite humaine |
|---|---|---|
| B2-01 | Rondeurs continues et variation des pixels de chaque contour à hauteur inchangée | Réussi ; identification rond/ovale/triangle/trapèze/carré/rectangle à évaluer humainement |
| B2-02 | 2000 descriptions bornées, sommes des segments ; 180 masques anatomiques connexes et non coupés verticalement (60 profils dont extrêmes, 3 vues) | Réussi Chromium/WebKit ; connexité n'est pas une validation anatomique artistique |
| B2-03 | Trois intentions de coupe dérivées de propriétés, même profil → mêmes pixels, exemples appliqués par interface | Réussi techniquement ; reconnaissance et crédibilité ouvertes |
| B2-04 | Longueurs indépendantes du crâne, direction/densité/texture visibles, nuque en couche arrière | Réussi techniquement ; gravité et dégradés schématiques |
| B2-05 | Poitrine, épaules/bassin, mâchoire, volumes et pilosité indépendants ; aucune catégorie inférée | Réussi ; lecture perceptive des caractères corporels ouverte |
| B2-06 | Combinaisons intermédiaires possibles ; pas de champ genre/orientation/fertilité/comportement | Réussi techniquement ; androgynie perçue à évaluer humainement |
| B2-07 | Absence du pigment de vêtement B1 dans les quatre projections B2 ; dessin sans détail génital ni mamelons | Réussi pour les propriétés programmables ; lisibilité esthétique ouverte |
| B2-08 | Potentiel nul → cartes pileuses nulles ; densités faciale/corporelle indépendantes ; entretien ne modifie pas potentiel/distribution ; changements de pixels | Réussi ; qualité et implantation artistiques ouvertes |
| B2-09 | Quatre rendus depuis la même géométrie/palette/description, sans hasard par vue | Réussi ; association à l'aveugle portrait/sprite à faire humainement |
| B2-10 | Import v1 via interface, 18 champs exacts, aller-retour v2, pixels stables, export téléchargé relu, JSON invalide sans perte | Réussi Chromium/WebKit et Node |
| B2-11 | Suites Node historiques et B1 ; aucun fichier historique modifié | Exécutées séparément ; code B2 isolé |
| B2-12 | 100 paires B1/B2, cinq passes de 100 sprites B2, formats 390/820/1180, toucher simulé | Mesures ci-dessous ; Safari iPad physique non testé |

## Vérification et mesures locales

`node --test tests/bio-gen-t1-b2/model.test.cjs` : 4/4. `BIO_ENGINES=chromium node tests/bio-gen-t1-b2/browser.cjs` : parcours réussi Chromium 151.0.7922.34 / Playwright 1.62.1, VM Linux x86_64, 3 vCPU AMD EPYC 9V74, Node 24.22.1, viewport 820×1180, DPR2, toucher simulé. Exécution locale en file://. WebKit local reste indisponible faute de bibliothèques Linux ; le parcours complet est ensuite **réussi en CI dans Chromium 151 et WebKit 26.5 Linux** ([run 43709569685](https://github.com/Thsethse/Microcosme/actions/runs/43709569685)), avec dépendances installées. Aucun succès Safari iPad revendiqué.

Dernière mesure locale avant livraison : génération de 100 profils **1,0 ms** ; cinq passes de 100 sprites B2 **26,1–29,0 ms**, médiane **26,4 ms**. Galerie 100 paires B1/B2 : **54,2 ms** de génération/dessin/DOM et **115,2 ms** jusqu'à deux RAF. Les valeurs sont des mesures ponctuelles VM, sans garantie d'affichage physique, mémoire/GPU/batterie ou latence tactile ; elles ne sont pas directement comparables à la galerie B1 seule (deux rendus par fiche et résolution B2 accrue). Données brutes dans `MESURES-LOCAL.jsonl`.

## Corrections et limites observées

- La bouche de profil pouvait laisser deux pixels flottants à une combinaison extrême : repère ramené au contour et détails faciaux limités au masque cutané. Les 180 masques passent après correction.
- La première composition de la nuque dessinait une masse capillaire devant le torse, ressemblant à une longue barbe. L'inspection visuelle l'a révélé ; la nuque est désormais derrière le corps avant/profil, devant le dos en vue arrière. Les mèches latérales restent au premier plan.
- Formes construites par contours interpolés, pas modèle volumétrique 3D. Le profil reste une projection approximative ; symétrie gauche/droite hors asymétrie bornée. Mains/pieds schématiques, pas de doigts individualisés ni animation.
- Coiffures encore simplifiées : mèches répétées, dégradés suggérés par la différence de longueurs, pas de séparation de chaque cheveu. Une frange ou des mèches longues peuvent masquer des traits. Le carré n'est pas une coupe professionnelle certifiée ; les noms indiquent les intentions d'exemples.
- Poitrine indiquée par volume/projection et contour inférieur, sans détails explicites ; les faibles amplitudes peuvent rester peu lisibles au sprite. Formes et distribution musculaire/réserves sont graphiques, pas physiquement ou biologiquement validées.
- Pilosité projetée par petites marques ; forte densité parfois bruitée et faible contraste sur peau sombre. Les zones peuvent perdre des détails en petit format. Densité et entretien sont visuellement quantifiés : plusieurs valeurs voisines donnent les mêmes pixels.
- Baseline et B2 ont des résolutions natives différentes ; le couple de la galerie compare les profils, pas la qualité à budget de pixels identique. Le portrait B2 cadre visage et épaules, pas les volumes du bassin.
- 32 paramètres constituent un budget expérimental justifié, pas un minimum démontré ni un schéma biologique définitif. Aucun héritage, croissance, reproduction, physiologie ou psychologie simulés.

## Audit humain à effectuer

Sur Safari iPad physique : noter appareil, version iPadOS/Safari et orientation ; comparer 20 paires, sélectionner et modifier chaque groupe de curseurs, appliquer huit exemples, exporter vers Fichiers/réimporter les JSON v1 et v2, lancer trois galeries de 100 et relever les temps/réactivité. Vérifier que les commandes tactiles, le défilement et les cadres restent utilisables.

Évaluer séparément : formes à taille égale, continuité des articulations aux extrêmes, distinction des visages, reconnaissance des trois coupes, crédibilité implantation/tombé/dégradés, lecture des volumes corporels et combinaisons intermédiaires sans imposer une catégorie, cohérence avant/dos/profil/portrait. Conserver les graines et JSON de chaque incohérence. Une différence de pixels ou un masque connexe ne vaut pas validation humaine de ces qualités.

**PR pour audit, non fusionnée. Attendre validation utilisateur ; aucun passage automatique au lot C.**

## Preuves CI finales

Commit applicatif testé : `ebb11f97080c8b04dc2be8e340126ea96448404c`. CI Linux GitHub Actions `ubuntu-latest`, Playwright 1.62.1, mêmes viewport/DPR et file:// ; matériel exact non relevé. Chromium 151 et WebKit 26.5 réussissent les 180 masques, les 32 effets de paramètres, le parcours tactile simulé, les huit exemples, l’import v1 et l’export/import v2 réel. Temps pour 100 paires : Chromium **37,3 ms** travail JS/DOM et **78,4 ms** jusqu’à deux RAF ; WebKit **41,0 ms** et **86,0 ms**. Cinq rendus de 100 sprites : Chromium 18,4–20,1 ms ; WebKit 29–32 ms. Chronomètre WebKit grossier (génération seule = 0 ms, pas un coût nul). Mesures brutes dans `MESURES-CI.jsonl`. Aucune extrapolation iPad.

## Parcours de la publication HTTPS

Le [run 43709726776](https://github.com/Thsethse/Microcosme/actions/runs/43709726776) réussit aussi les parcours complets **Chromium 151 / WebKit 26.5 sur l’URL publique GitHub Pages**, en plus de file://. Commit vérifié `2a0d5886a25f17bf884c888613c68017c844c11b`, code applicatif inchangé depuis `ebb11f9`. Résultats et mesures du runner Linux dans `MESURES-HTTPS.jsonl`. Cette preuve HTTPS ne remplace pas l’essai iPad physique ni l’évaluation artistique.
