# T3-A — architecture et format

Nouveaux fichiers du laboratoire autonome `experiments/bio-struct-t3-a/` :

- `biological-profile.js` : catégorie/fonction et profils P2 ; 11 paramètres P1, bornes et rapport N2 ; hachage entier déterministe et palette de peau reprise des principes T2.
- `anatomical-skeleton.js` : 22 articulations reliées, segments, chaînes, orientations et bases locales ; repères/ancrages anatomiques dérivés.
- `body-geometry.js` : volumes avec id, région, segment/t/décalage local, type, dimensions relatives, orientation, symétrie et caractère visuel. Centre recalculé depuis l'ancrage ; aucun positionnement UI libre.
- `canonical-body.js` : `generateBody`, `validateBody`, `serializeBody`, `parseBody` ; données canoniques du laboratoire et contrôles combinés N3. Aucun import T2 automatique.
- `body-projection.js` : `projectBody` face/profil/dos à partir des mêmes volumes ; projection orthographique des huit coins et profondeur utilisée pour l'ordre de dessin. Le profil utilise les profondeurs réelles, pas un coefficient réducteur de largeur.
- `render.js` : méthode de rasterisation par lignes de pixels T2 adaptée aux enveloppes polygonales orientées ; Canvas 2D local ; superpositions de diagnostic.
- `lab.js`, `index.html`, `lab.css` : trois profils, sélection, 11 couples curseur/saisie, fonction de T, debug, corrections et JSON. Aucun stockage historique, framework ou ressource distante.

Le `canonicalBody` contient profil/fonction/morphologie, demandes, valeurs finales, corrections, squelette, volumes et palette. Même graine + mêmes entrées = même corps. La graine fixe seulement le pigment de peau de ce banc de référence ; les variations de morphologie sont demandées par les contrôles, pas inventées aléatoirement. Une graine commune donne une couleur commune aux trois profils pour éviter de masquer les différences anatomiques.

## Transformations et projections

Tous les segments pointent vers leurs articulations d'origine/extrémité. Un volume a un centre `P(t) + u*offsetX + v*offsetY + w*offsetZ`, où les bases sont celles de son segment et les offsets ont l'échelle du corps. Les pieds utilisent une base locale orientée selon le sol. Les repères nominaux non articulaires sont dérivés de la même façon.

Après toute modification : catégorie/fonction validées, valeurs bornées avec trace, squelette reconstruit, articulations et repères recalculés, volumes replacés, contraintes vérifiées puis projections produites. Le recalcul est complet, pur et déterministe ; aucune accumulation d'erreur de transformation entre deux déplacements.

Les trois vues ont **la même échelle fixe** (2 pixels/unité, sol commun), y compris entre M/F/T. Une augmentation de la taille globale est donc visible et n'est pas annulée par un recadrage individuel. Les bornes P1 combinées restent dans le cadre, hauteur maximale 159,25 unités. Les contours d'un pixel n'ont pas de dimension biologique.

## Contraintes et échecs

N1 recalcule ; N2 limite et rapporte ; N3 rejette profil incompatible, fonction double/absente, valeur non numérique/non finie, ancrage invalide, volume détaché ou hors région. Une entrée rejetée conserve les corps valides précédents. Un test navigateur couvre le maintien de la trace de limitation après perte de focus : les événements de formulaire en double ne doivent pas réécrire une demande 1,60 en 1,35 silencieusement.

## JSON T3-A v1

Schéma `microcosme.bio-struct-t3-a`, version 1 ; graine texte (128 caractères maximum), catégorie/fonction, `requestedParameters`, `parameters` appliqués et `corrections` explicites. Export d'un corps valide seulement. Import limité à 64 Ko ; reconstruction déterministe et contrôle que valeurs finales/rapport correspondent aux demandes. L'ordre des clés JSON n'a pas d'effet. La reconstruction restitue le squelette et tous les volumes sans perte ; aucun corps graphique T2 n'est converti en catégorie biologique.

## Dépendances et préservation

Aucune modification de T2, B1/B2 ou du moteur. Les principes de hash/palettes, commandes, rasterisation et tests de T2 sont réutilisés dans des fichiers nouveaux ; ses coordonnées anatomiques indépendantes et coefficients de profil sont remplacés. Révision T2 auditée et testée : `e057e5f906afba25ac943bcc617afb581eb8d296`.

La CI dédiée lance les 23 tests contractuels, les 35 tests historiques, Chromium/WebKit local et HTTPS public, puis les 6 tests et parcours Chromium/WebKit du T2 original dans un checkout séparé. Aucun changement de configuration Pages requis : publication uniquement du nouveau dossier `preview/bio-struct-t3-a/` de main, sans fusion.
