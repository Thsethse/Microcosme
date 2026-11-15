# BIO-STRUCT-T3-B1 — rapport de livraison

Base : R3 `0749e4d4d54ea55a14cf63dda82b32e544e020e8`, techniquement vérifiée, PR #19 ouverte/non fusionnée. Autorité B1 `ffe9c5b5963deb122c1e46f0d7e5043233ed8f3c`. Nouveau laboratoire `experiments/bio-struct-t3-b1/`, branche `codex/bio-struct-t3-b1`, PR empilée sur R3. [Décisions](DECISIONS.md) · [Douze contrôles](RESULTATS.md) · [18 captures/catalogues](COMPARAISONS.md) · [JSON v4](JSON-V4.md) · [Publication](PUBLICATION.md).

## Résultat

Quatre formes de tête : rond, ovale, carré arrondi, rectangle arrondi. Les deux dernières ont des arrondis tridimensionnels visibles de face/profil. Les anciennes têtes triangle/triangle inversé/losange ne sont plus dans l’UI ou le canon B1 ; leurs imports sont convertis vers rond et tracés, sans changer le reste des données corporelles.

Six formes d’yeux et un contrôle taille/couleur d’iris ; trois sourcils et leur couleur ; cinq familles de bouche et couleur des lèvres. Le bord supérieur oculaire reste sous la médiane, l’écart intérieur vaut une largeur d’œil, les sourcils sont au-dessus et la bouche au milieu exact du bas des yeux/menton. Tout dérive du crâne canonique. Le raster maintient lui aussi l’écart entier exact et masque les iris au contour de l’œil. Les deux portraits sont des agrandissements du même rendu ; repères de médiane/écartement optionnels.

Cils sur la courbe supérieure : F courts/accentués, T sans/courts/accentués indépendamment de sa fonction, aucun sélecteur M. Le raster accroche les cils au premier pixel supérieur visible de l’œil, pour éviter un flottement sous changement de forme. Un seul œil de profil, aucun trait de dos, y compris les ancrages faciaux de diagnostic. Aucun nez, volume ou ancre nasale.

Corps, proportions, ombres, muscles, poitrine, abdomen, pubis et pilosité corporelle R3 conservés. Aucun changement de fonction de T ne remplace ses choix d’apparence. Export/import v4 déterministe, bornes faciales avec rapport N2, anciens v1/v2/v3 migrés explicitement. Aucune conversion T2 automatique.

## Vérifications locales

**11/11 contrôles techniques B1 réussis ; B1-12 reste une réception humaine non exécutée.** Les 23 tests T3-A, 8 R1, 8 R2 et 10 R3 techniques restent réussis, R3-11 toujours humain. Total des suites de laboratoire : 60 réussis, 0 échec, 2 contrôles humains ignorés ; les 35 tests du jeu réussissent également. Les anciennes suites et sources n’ont pas été adaptées pour faire passer B1 : elles restent dans leur dossier R3 intact.

Commandes : `node --test tests/bio-struct-t3-a/contract.test.cjs tests/bio-struct-t3-a/r1.test.cjs tests/bio-struct-t3-a/r2.test.cjs tests/bio-struct-t3-a/r3.test.cjs tests/bio-struct-t3-b1/contract.test.cjs`, `npm test`, `node tests/bio-struct-t3-b1/browser.cjs`.

Chromium 151 local réussit le parcours B1 et le parcours R3 préservé. B1 vérifie notamment :

- **432 masques d’yeux**, avec variations des quatre têtes, six formes, trois tailles et extrêmes morphologiques : bord supérieur sous la médiane et écart natif exactement égal à une largeur d’œil.
- **72 yeux de profil** effectivement visibles ; deux yeux de face, un seul de profil ; **12 vues de dos** identiques avec/sans traits.
- Quatre têtes, six yeux, trois sourcils et cinq bouches distincts par pixels. Couleurs d’iris/sourcils/lèvres avec effet visible indépendant, sans prétendre que chaque forme est toujours distinguable à la plus petite résolution.
- **108 raccords de cils** au bord supérieur réel, sous formes/tailles différentes et dans les deux vues utiles.
- **108 silhouettes connexes/non coupées** sous variations ; **4 comparaisons de coins** face/profil montrant l’arrondi face au carré/rectangle R3 ; **36 régions corporelles** aux pixels identiques à R3.
- UI tactile simulée : sélection des quatre têtes pour M/F/T, absence de sélecteur M de cils, choix F/T, couleurs séparées, limitation 9 → 1.5 avec demande conservée, réglage morphologique conservant le visage, fonction T inchangée pour le visage et le corps hors signe génital.
- Export téléchargé/relu puis import identique ; vieux triangle R3 migré avec paramètres/apparence conservés ; JSON facial invalide refusé sans perte ; largeurs 390/820/1180 sans débordement ni erreur JavaScript.

Les tests Node comparent en outre les volumes et projections R3 hors tête sur trois catégories, quatre têtes et extrêmes P1. Les références JSON v3 proviennent du vrai code R3 antérieur. Relevés bruts : MESURES-B1-LOCAL.jsonl et MESURES-R3-LOCAL.jsonl. VM Linux, Node 24.22.1, Playwright 1.62.1, Chromium 151.0.7922.34 ; navigateur tactile simulé 820×1180 DPR2, captures 1180×1100 DPR1. WebKit local manque de bibliothèques système ; **CI finale réussie sur `dfee4e87c7bc7a5c6cda4d1c025bcbb078fb3f7e` : 101 tests Node réussis, aucun échec, deux réceptions humaines non exécutées (R3-11/B1-12)**. Chromium 151 et WebKit 26.5 passent le parcours B1 sur fichiers puis sur l’URL publique HTTPS. Les quatre parcours antérieurs passent dans les deux moteurs, ainsi que T2 ; les workflows historiques du jeu et de main réussissent. Les 17 ressources B1 et 70 ressources antérieures répondent HTTP 200 et sont identiques à leurs sources/snapshots. [Preuves et liens CI](PUBLICATION.md) · [14 relevés bruts](MESURES-CI.jsonl) · [Empreintes HTTPS](RESSOURCES-HTTPS.json).

## Fichiers et portée

Tous les fichiers applicatifs B1 sont dans un nouveau dossier. Modules corporels de R3 copiés sans changement : `biological-profile.js`, `anatomical-skeleton.js`, `body-geometry.js`, `body-finish.js`, `morphology-settings.js` ; `facial-anchors.js` reste pour la compatibilité interne R3. Les deux conditions de version dans `body-projection.js` / `surface-projection.js` admettent simplement v4 pour conserver le même corps. Leur identité effective hors tête est vérifiée, pas supposée.

Ajouts faciaux : `face-settings.js`, `facial-model.js`, `facial-projection.js`. Adaptations de la copie B1 : `canonical-body.js`, `shape-grammar.js`, `render.js`, `lab.js`, HTML/CSS et README. Nouveaux tests, fixtures, outil de captures et workflow B1. Aucune source ou test T3-A/R1/R2/R3 existant, moteur, sauvegarde historique ou ancienne preview modifié. Publication indépendante dans un nouveau dossier Pages uniquement, sans reconfiguration ni fusion.

## Arbitrages et limites

Les familles proposées sont géométriques et stylisées ; elles ne sont pas artistiquement approuvées. Confirmer les quatre contours arrondis, les rapports taille/hauteur des yeux, les trois sourcils, les cinq bouches, l’interprétation du « B inversé » en deux lobes et les intensités de cils F/T. Les petites bouches triangulaires ont une hauteur suffisante pour distinguer les deux lèvres au raster ; le centre reste strictement anatomique.

Les profils sont plus fins : leurs supports de profondeur viennent du canon, puis les traits sont limités au masque réel de tête. Certains profils de rond/ovale ou carré/rectangle peuvent être semblables car la largeur frontale change sans changer la profondeur. Les couleurs et contours perdent des détails aux tailles minimales ; zoomer sur les portraits ne crée pas de pixels supplémentaires. Les repères optionnels sont des guides, pas des traits anatomiques. Aucun nez n’est introduit pour combler le centre du visage.

Les cils F sont présents dans ce lot, avec deux intensités ; T peut les désactiver. Aucun choix féminin de cils M n’est anticipé. Ni cheveux, moustache, barbe, rouflaquettes, ni autre pilosité faciale. Aucun T3-B2.

## Essai Safari iPad

Ouvrir B1 et garder R3 dans un autre onglet. Essayer les quatre têtes, les formes/taille/couleurs d’yeux puis les sourcils et les cinq bouches. Agrandir le portrait ; activer la médiane pour vérifier le haut des yeux et l’intervalle. Tester cils F/T, puis basculer la fonction T : visage et corps hors signe génital doivent rester identiques. Regarder profil/dos, changer hauteur/largeur de tête et importer un ancien JSON triangulaire ; exporter/réimporter un v4. Signaler iPad/iPadOS/Safari, graine, JSON et capture des défauts.

**B1-12 : Safari iPad physique et réception esthétique non réalisés par Codex. Les captures et tests ne remplacent pas ton accord. Aucune fusion avant retour utilisateur.**
