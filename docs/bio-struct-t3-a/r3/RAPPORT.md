# BIO-STRUCT-T3-A-R3 — rapport de finition corporelle

Base R2 `bf9f6d002bed891344dd2f954a33c4126baa84e1`. Documents R3 `cf2e89f7e509713b3308ae9e72e7a7db9e2c3faa`. Branche indépendante `codex/bio-struct-t3-a-r3`, PR empilée sur #18 sans fusion. [Décisions et valeurs proposées](DECISIONS.md) · [Format JSON v3](JSON-V3.md) · [18 captures](COMPARAISON.md) · [Tableau des contrôles](RESULTATS.md) · [Publication](PUBLICATION.md).

## Fonctionnalités

Taille et forme de poitrine distinctes pour F/T ; absence des deux contrôles mammaires et de géométrie mammaire féminine pour M. Pectoraux continus du rond/souple au plus rectangulaire/musclé, abdominaux du ventre rond au défini, graisse séparée, ombrages bruns réglables. Les surfaces sont attachées aux régions du canon ; les ombres et poils sont limités au masque de leur volume et suivent l’ordre d’occlusion.

Torse/ventre : deux densités de poils, absentes par défaut pour tous. M : pubis absent/rectangle ; F/T : absent/triangle/carré/rectangle, densité et couleur indépendantes. Pour F, le choix volontaire de poils corporels reste disponible sans être imposé, conformément à l’indépendance des réglages R3-08 ; interprétation à confirmer à la réception. Région pubienne toujours au-dessus de la base du signe génital R2. Points antérieurs absents de dos et de profil tangent. Petit point de nombril attaché à l’abdomen, lisible après dessin des poils.

L’option de bassin ovale disparaît du sélecteur ; le bassin anatomique et la géométrie historique ne sont pas supprimés. Migration UI v1/v2 vers v3 annoncée, fallback déterministe ovale → rectangle ; anciennes valeurs conservées dans la trace. Les JSON v3 conservent tous les réglages et reproduisent le même canon/pixels. La bascule de fonction T ne change ni poitrine, ni muscles, ni graisse, ni poils.

Squelette, proportions, articulations, tête, visage et signe génital restent R2. Aucun nouveau trait facial ou changement de forme de tête. Les sept têtes restent disponibles telles quelles ; aucun T3-B1/B2.

## Tests locaux

**49 contrôles techniques réussis, 0 échec ; R3-11 non exécuté (réception humaine)**. Décompte : 23 T3-A + 8 R1 + 8 R2 + 10 R3, avec les trois suites Node historiques inchangées. Les 35 tests Node du jeu réussissent également. Commande : `node --test tests/bio-struct-t3-a/contract.test.cjs tests/bio-struct-t3-a/r1.test.cjs tests/bio-struct-t3-a/r2.test.cjs tests/bio-struct-t3-a/r3.test.cjs` ; puis `npm test`.

Le chemin d’API historique v2 conserve son canon exact, vérifié par les 39 tests précédents et leurs fixtures. Le nouveau canon v3 est testé séparément : R3-09 compare 126 cas de morphologies et extrêmes P1 aux squelettes, têtes/visages et signes génitaux R2 correspondants. Les contrôles R3 vérifient les volumes locaux, six tons de peau, densités/attaches, masquage des trois vues, défauts et rejets, exports v3, migrations v1/v2 et traces anciennes.

Chromium 151 local : les parcours T3-A, R1, R2 et R3 réussissent. Les parcours R1/R2 n’adaptent que leurs assertions d’import UI à la migration v3 ; le reste est conservé. L’interface R3 n’utilise pas le générateur v2 de compatibilité.

Parcours R3 :

- Cinq états pectoraux et cinq états abdominaux visuellement distincts ; trois états de graisse/ombres et trois formes mammaires par catégorie F/T distingués par pixels.
- Quatre formes pubiennes F/T distinctes ; effet réel des densités de torse, ventre et pubis (86, 32 et 80 pixels modifiés sur la référence de mesure, sans prétention universelle).
- **360 masques connexes/non coupés** couvrant catégories/fonctions, six morphologies, formes de poitrine et extrêmes P1.
- **24 comparaisons de masques** avec/sans détails : aucune extension d’alpha hors du volume ; nombril réellement visible de face et absent de profil/dos, y compris sous pilosité dense. Le point reste carré et limité à 1 ou 2 pixels à trois tailles globales (0.75, 1, 1.30).
- **21 comparaisons de têtes** (sept formes × trois vues) : pixels tête/visage identiques à R2.
- UI tactile simulée : M sans contrôles mammaires, F/T libres, anciens ovales migrés visiblement, bascule T sans changement thoracique, téléchargement export puis réimport identique, JSON invalide refusé sans perte, formats 390/820/1180 sans débordement ni erreur JavaScript.

Relevés bruts : MESURES-T3A-LOCAL.jsonl, MESURES-R1-LOCAL.jsonl, MESURES-R2-LOCAL.jsonl et MESURES-R3-LOCAL.jsonl. VM Linux, Node 24.22.1, Playwright 1.62.1, Chromium 151.0.7922.34, viewport 820×1180, DPR2 et toucher simulé ; captures DPR1. WebKit local manque de bibliothèques système ; la CI installe ses dépendances. **CI finale réussie sur `be0779be4809ea321ab4485bf66ff9c7900b1e65` : 90 tests Node réussis, aucun échec, un contrôle humain non exécuté (R3-11)**. Les quatre parcours T3-A/R1/R2/R3 passent sous Chromium 151 et WebKit 26.5 sur fichiers puis sur l’URL publique HTTPS. Le nombril reste un point carré aux trois tailles dans les deux moteurs. T2 passe ses tests Node et navigateurs ; les workflows historiques de la branche et de main réussissent. [Preuves et liens](PUBLICATION.md) · [18 relevés CI](MESURES-CI.jsonl).

## Problèmes détectés et corrigés

Une forme mammaire goutte atteignait exactement la limite thoracique : marge de support locale ajoutée, sans déplacement libre de l’attache. Les niveaux abdominaux supérieurs devenaient identiques au raster : intensité de relief liée à la définition pour conserver cinq états lisibles. Une pilosité dense pouvait recouvrir le nombril : celui-ci est maintenant dessiné après les poils, à la même attache canonique. Ces cas sont vérifiés par les contrôles et parcours R3.

## Fichiers et non-régression

Modifiés sous `experiments/bio-struct-t3-a/` : `canonical-body.js` (API/JSON v3 et validation), `body-projection.js` (décoration des surfaces), `render.js` (masques de détails), `lab.js`, `index.html`, `lab.css`, `README.md` (contrôles/liens R3). Nouveaux : `morphology-settings.js`, `body-finish.js`, `surface-projection.js`.

Les modules `biological-profile.js`, `anatomical-skeleton.js`, `body-geometry.js`, `shape-grammar.js` et `facial-anchors.js` restent identiques à R2. Tests R3 et outil de captures ajoutés ; workflow étendu. Aucun fichier de jeu principal, sauvegarde ou laboratoire antérieur modifié. Publication : nouveau dossier preview R3 uniquement, sans reconfiguration Pages, sans fusion. Les quatorze ressources R3 et les 56 ressources des previews antérieures ont été récupérées en HTTPS et comparées octet pour octet à leurs sources ; toutes répondent HTTP 200. Empreintes et déploiement dans PUBLICATION.md et RESSOURCES-HTTPS.json.

## Arbitrages visuels et limites

Les proportions fines des superellipsoïdes, formes mammaires, graisse et ombres sont proposées ; elles ne constituent pas une nouvelle validation artistique. Les formes R2 des membres et le tri par profondeur moyenne sont conservés. Les reliefs inférieurs et raccords sont stylisés ; ils peuvent paraître répétitifs ou trop discrets sur certaines peaux ou à petite échelle. Les volumes corporels restent géométriques, sans simulation de tissus mous. La pilosité est faite de points, antérieure et volontairement absente dans les vues tangentes/dorsales ; aucun nouveau catalogue de poils dorsaux ou faciaux.

À juger sur iPad : différence taille/forme mammaire, transition graisse/muscle, lecture des pectoraux sous poitrine, définition abdominale sans aspect de plaques, intensité brune sur six peaux, densités/teinte des poils, marge pubienne, taille du point de nombril. Confirmer aussi l’ergonomie F avec pilosité corporelle optionnelle et la pertinence des trois formes techniques de poitrine. Les tests de pixels ne démontrent pas la qualité anatomique ou esthétique.

## Essai Safari iPad physique

Ouvrir la preview R3, garder R2 dans un autre onglet. Sélectionner F/T, modifier séparément taille et forme de poitrine ; vérifier face/profil/dos. Sélectionner M et confirmer l’absence de choix mammaire féminin ; essayer pectoraux, graisse et abdominaux. Monter/modérer les ombres, les deux densités de poils et le pubis ; contrôler le nombril et l’espace au-dessus du sexe. Basculer T male/female sans perdre les choix. Essayer plusieurs morphologies, le zoom Safari et export/import d’un JSON R2 ovale puis d’un v3. Noter iPad/iPadOS/Safari, graine, JSON et capture pour tout défaut.

**Safari iPad physique et validation artistique non réalisés par Codex : R3-11 attend le retour utilisateur. Aucune fusion, aucun T3-B1/B2 ni phase suivante.**
