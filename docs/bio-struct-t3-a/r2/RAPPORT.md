# BIO-STRUCT-T3-A-R2 — rapport de correction ciblée

Base de code : R1 `b05a3fe9b9ab0664fe1caf278bce9f5b10679520`. Autorité documentaire R2 `2a93dbbe5f077d4c404ae1de936c5860d67fe350`. [Lecture du PNG et décisions](DECISIONS.md). Branche dédiée `codex/bio-struct-t3-a-r2`, PR empilée sur R1 ; aucune fusion.

## Résultat et portée

Le signe génital masculin rejoint le bord inférieur du bassin et descend entre les cuisses, avec une petite extrémité arrondie ; sa profondeur canonique le rend visible de profil. Le signe féminin descend aussi vers l’entrejambe mais reste discret de face et n’est pas rasterisé de profil. Les deux sont absents de dos. Les attaches se recalculent avec P1, et leur largeur tient compte de l’espace entre les cuisses.

La poitrine utilise les volumes R1 inchangés, avec un contour inférieur et un point de surface discrets pour en clarifier la lecture. Face et profil projettent les mêmes ellipsoïdes attachés au thorax ; aucun détail mammaire de dos. Les marques sont dessinées avec leur volume, avant les éléments qui l’occultent. Les superpositions de diagnostic respectent également les masquages.

Pour T, seule la représentation génitale dépend de sa fonction ; poitrine, paramètres et autres volumes ne changent pas. Proportions, palette, morphologies, sept têtes, attaches faciales sans nez et muscles restent ceux de R1. Aucun réglage de variante mammaire, nouveau développement pectoral ou nouvelle ombre. Les ratios de l’attribut sont des calibrations proposées pour essai, pas des mesures artistiques approuvées.

## Vérifications locales

- **23 tests T3-A + 8 contrôles R1 + 8 contrôles R2 = 39 réussis**, plus **35 tests historiques**. Les suites T3-A et R1 sont inchangées.
- Non-régression stricte : 378 corps comparés à des références R1, en excluant seulement le signe génital et son ancrage. Les volumes mammaires, muscles, squelette restant, palette, visages et paramètres sont identiques. 1 134 projections des autres volumes et des traits faciaux sont également identiques.
- R2-05 couvre 576 combinaisons catégorie/fonction, morphologies et extrêmes P1 : attaches cohérentes et largeur génitale comprise entre les cuisses.
- Chromium 151 : parcours historique T3-A (108 masques), R1 (144 masques) et R2 (**432 masques connexes/non coupés**), trois vues et quatre cas M/F/T male/T female, interaction tactile simulée et largeurs 390/820/1180 sans débordement. Pas d’erreur JavaScript.
- R2 vérifie l’effet réel des attributs en pixels : poitrine F/T de face et profil, zéro effet de dos ; signe masculin de face/profil, zéro effet de dos ; signe féminin de face uniquement. La bascule T laisse les pixels thoraciques et le dos identiques.
- Import de vrais exports R1 v2, conservation des paramètres/corrections/formes ; export/import et migration v1 également couverts par les parcours conservés. Schéma v2 inchangé, pas de conservation promise des anciens pixels des attributs.

Mesures brutes : MESURES-T3A-LOCAL.jsonl, MESURES-R1-LOCAL.jsonl, MESURES-R2-LOCAL.jsonl. Node 24.22.1, Playwright 1.62.1, Chromium 151.0.7922.34 Linux ; viewport tactile 820×1180, DPR2. WebKit local manque de bibliothèques système ; la CI installe ses dépendances. **CI réussie sur `0f08780e4c3505c828f18a01ad99aae8858e32b3` : 80 tests Node, 0 échec** (39 T3-A/R1/R2 + 35 historiques + 6 T2). Les parcours T3-A, R1 et R2 réussissent sous Chromium 151 et WebKit 26.5, sur fichiers puis sur l’URL HTTPS publique. T2 réussit également dans les deux moteurs. Le workflow historique du jeu et celui de main après publication réussissent. [Publication et liens CI](PUBLICATION.md) · [14 relevés bruts](MESURES-CI.jsonl).

Intégrité des previews : onze fichiers applicatifs R2 et 45 ressources B1/B2/T2/T3-A/R1 ont été récupérés en HTTPS et comparés octet pour octet à leurs sources/snapshots. Aucun remplacement d’une preview antérieure ; empreintes dans RESSOURCES-HTTPS.json.

## Fichiers modifiés

Sous `experiments/bio-struct-t3-a/` : `anatomical-skeleton.js` (seul ancrage génital), `body-geometry.js` (seul signe génital), `body-projection.js` (visibilité et détails mammaires ancrés), `render.js` (masquage et raster de contour), `index.html` et `README.md` (identification R2/liens). Les modules BiologicalProfile, CanonicalBody, ShapeGrammar, FacialAnchors, CSS et logique de réglages sont inchangés.

Tests : `r2.test.cjs`, `r2-browser.cjs`, `capture-r2.cjs`, fixtures R1 et extension du workflow T3-A. Documents et 12 captures dans ce dossier. La publication ajoute seulement un nouveau dossier preview R2 à main. Aucun fichier de jeu, sauvegarde ou laboratoire précédent modifié.

## Limites et réception Safari iPad

La référence PNG est qualitative et frontale : la profondeur de l’attribut masculin est une calibration canonique proposée, à examiner en profil. Les volumes et perspectives stylisés de R1 sont conservés ; la poitrine n’est pas refaçonnée en R2. Les captures rendent visibles les changements de détail et masquage ; les tests ne remplacent pas l’appréciation artistique, notamment sur peau sombre ou petits pixels.

Ouvrir la preview R2 sur Safari iPad, comparer M/F/T puis les trois vues. Vérifier le raccord à l’entrejambe, l’attribut masculin de profil, le profil féminin sans marqueur et le dos sans attribut antérieur. Basculer la fonction T : la poitrine doit rester identique. Essayer une autre morphologie, un bassin étroit, P1, export/import, puis comparer à R1. Signaler appareil/iPadOS/Safari, graine et JSON de tout problème.

**Safari iPad physique non testé par Codex ; validation artistique et retour utilisateur attendus avant toute fusion. Aucun R3, T3-B ou T3-C engagé.**
