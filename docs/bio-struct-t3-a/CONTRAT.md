# MICROCOSME — BIO-STRUCT-T3-A — Contrat anatomique unique
Date : 2026-11-15
Statut : D1–D4 et P1–P3 VALIDÉS par l'utilisateur ; document de conception, non implémenté.
Source : échanges de validation et deux croquis utilisateur (corps trois vues ; visage et attaches).
Interdictions : ne pas programmer, ne pas fusionner, ne pas remplacer T2 ni les autres laboratoires sans autorisation.

## 1. Objet et limites
Un corps biologique canonique, un squelette paramétrique commun, des volumes géométriques ancrés sur ce squelette et des projections cohérentes face/profil/dos. Le portrait découle du même corps. Le lot T3-A couvre squelette, proportions, volumes, caractères anatomiques, catégories biologiques et validation géométrique. Les catalogues détaillés de visages/coiffures sont prévus en T3-B ; animations, reproduction simulée, génétique, hérédité, intégration au jeu et finition artistique sont hors lot. La référence artistique et les deux croquis doivent rester des sources d'autorité visuelle ; leur dépôt binaire dans cette branche n'est pas attesté par ce document.

## 2. Décisions validées
- D1 : trois catégories biologiques distinctes : masculine (M), féminine (F), troisième type (T). M et F doivent être aisément reconnaissables sur leurs silhouettes de référence, sans coiffure ni vêtements. T est une catégorie biologique propre, non un mélange aléatoire.
- D2 : chaque T possède exactement UNE fonction reproductive, masculine OU féminine ; jamais les deux. M possède la fonction masculine, F la fonction féminine. Les fonctions reproductives ne sont pas déduites de la poitrine, de la coiffure ou de la musculature. La reproduction effective et la fertilité ne sont pas simulées dans T3-A.
- D3 : corps initial de quatre têtes ; hauteur normalisée 100 unités = tête 25, cou+thorax+abdomen 30, bassin+membres inférieurs 45. Les proportions de croquis sont la référence, avec variations autorisées.
- D4 : références morphologiques distinctes : M épaules relativement plus larges, bassin plus étroit, pectoraux dominants ; F épaules plus étroites, bassin plus large, poitrine développée ; T combinaison cohérente de caractères. Ces tendances ne sont pas des interdictions individuelles.
- Principe : squelette = position ; géométrie = forme ; biologie = caractères et fonction. Aucun élément ne se positionne indépendamment de sa région anatomique.

## 3. Référentiel et squelette
Espace corporel normalisé : X largeur (axe médian 0), Y hauteur (sol 0, sommet du crâne 100 pour le corps neutre), Z profondeur (orientation conventionnelle à figer dans le code). Ce repère interne n'implique pas de rendu 3D.
Repères : sommet/menton/base du crâne/axe facial ; cou ; clavicules/épaules/sternum/bas thorax ; coudes/poignets/mains ; nombril ; hanches/centre pelvien/ancrage génital ; genoux/chevilles/pieds.
Sous-repères Y **proposés pour implémentation et à calibrer visuellement**, non arbitrés séparément : sol 0, cheville 5, genou 26, hanche 45, nombril 53, bas thorax 63, épaule 72, base du crâne 75, sommet 100. Ne pas traiter ces sous-repères comme une validation artistique définitive.
Les segments ont origine, extrémité, longueur, largeur, profondeur et orientation ; tous les ancrages dérivent de leurs repères. Un point sur AB se calcule P(t)=(1-t)A+tB avec 0<=t<=1.

## 4. Volumes et ancrages
Formes géométriques carrées, rectangulaires ou composées, attachées aux régions :
- pectoraux : thorax supérieur sous clavicules ;
- abdominaux/ventre : thorax inférieur à bassin ;
- trapèzes : jonction cou/épaules ;
- biceps : épaule–coude ; avant-bras : coude–poignet ;
- cuisses : hanche–genou ; mollets : genou–cheville ;
- poitrine : deux attaches thoraciques, hauteur/forme/volume contraints ;
- organes sexuels : région pelvienne, jamais région ombilicale ;
- mains/pieds : extrémités des chaînes correspondantes.
Chaque volume porte id, région, ancrage local, type de forme, dimensions relatives, orientation, symétrie éventuelle et paramètres visuels. Exemple de schéma indicatif (ratios non validés) : {id:"pectoralis_left",anchor:"thorax_left",shape:"rectangle",widthRatio:0.35,heightRatio:0.25,depthRatio:0.12,offsetLocal:[0,0,0],symmetry:"paired"}.
La transformation d'un segment recalcule ses volumes et descendants ; interdiction de déplacer une poitrine vers le cou ou un pubis vers le nombril pour masquer une erreur.

## 5. P1 — bornes validées
Multiplicateurs [minimum, référence, maximum] :
- taille globale [0.75,1.00,1.30]
- hauteur tête [0.80,1.00,1.20]
- largeur tête [0.75,1.00,1.30]
- longueur tronc [0.80,1.00,1.25]
- longueur bras [0.80,1.00,1.20]
- longueur jambes [0.80,1.00,1.25]
- largeur épaules [0.75,1.00,1.35]
- largeur bassin [0.75,1.00,1.35]
- profondeur thoracique [0.75,1.00,1.35]
- volume musculaire [0.00,0.50,1.00]
- volume mammaire [0.00,variable selon profil,1.00].
La taille globale multiplie uniformément les dimensions finales ; les variations relatives modifient la hauteur résultante, qui n'est pas artificiellement ramenée à 100. Les transformations divines et mutations exceptionnelles restent hors de ces bornes ordinaires et hors T3-A.

## 6. P2 — profils morphologiques validés
Valeurs [M,F,T] ; multiplicateurs sauf volumes normalisés :
- largeur épaules [1.15,0.90,1.05]
- largeur bassin [0.90,1.15,1.05]
- profondeur thoracique [1.10,1.00,1.05]
- musculature initiale [0.65,0.40,0.50]
- développement mammaire [0.05,0.65,0.50]
- largeur relative tronc [1.10,0.95,1.00].
Les profils sont des valeurs de départ, non des limites rigides. T doit être identifiable dans les données même si son apparence ressemble à M ou F. La fonction reproductive de T est male OU female et ne modifie pas automatiquement poitrine/muscles/bassin. Variations corrélées autorisées mais déterministes.
IMPORTANT — règle d'application à auditer : les multiplicateurs P2 et les bornes P1 peuvent interagir. L'implémentation doit expliciter si P1 s'applique à l'écart individuel ou au multiplicateur final ; aucune combinaison ne doit contourner les invariants ni produire une correction silencieuse.

## 7. P3 — traitement des contraintes validé
Ordre : lire entrée ; valider catégorie ; valider fonction ; borner paramètres numériques ; construire squelette ; recalculer articulations ; placer volumes ; vérifier contraintes spatiales ; projeter ; produire rapport.
- N1 recalcul automatique des descendants et attaches après modification valide ;
- N2 limitation des valeurs numériques hors bornes (ex. 1.60 vers 1.35) AVEC rapport valeur demandée/appliquée/motif ;
- N3 rejet explicite des combinaisons anatomiques/biologiques impossibles, notamment fonction double chez T.
Aucune correction silencieuse. Les contraintes combinées sont vérifiées après les bornes : continuité épaule-bras, poitrine-thorax, organes-bassin, muscles-segments. Un rejet ne doit pas corrompre l'état précédent.

## 8. T3-B et projections
Le croquis facial définit sept contours de tête (rond, carré, triangle inversé, ovale, triangle, rectangle, losange), catalogues d'yeux, sourcils, bouches, attaches oculaires/sourcilières/buccales, nez central et implantation capillaire. Les catalogues masculins/féminins de coiffures sont des familles de style, accessibles à toutes catégories. Détail et finition reportés T3-B.
Face : largeur/symétrie/volumes ; profil : profondeurs ; dos : largeur/volumes dorsaux ; portrait : mêmes paramètres faciaux agrandis. Toutes les vues dérivent du MÊME corps canonique, jamais de tirages séparés.

## 9. Interfaces logiques proposées
generateBody(seed, biologicalProfile, parameters) -> canonicalBody
validateBody(canonicalBody) -> validationReport
projectBody(canonicalBody, view) -> drawingCommands
serializeBody(canonicalBody) -> versionedBodyData
Modules conceptuels : BiologicalProfile, AnatomicalSkeleton, BodyGeometry, BodyProjection. Pas d'état UI requis pour les calculs. Même graine + mêmes entrées = mêmes sorties. Sérialisation versionnée sans perte.

## 10. Tests contractuels (non exécutés)
T3A-01 proportions initiales 25/30/45 total 100.
T3A-02 articulations toutes connectées.
T3A-03 allongement tronc suit volumes.
T3A-04 bras modifiés : biceps/avant-bras attachés.
T3A-05 jambes modifiées : cuisses/mollets attachés.
T3A-06 poitrine sur thorax.
T3A-07 organes sur bassin.
T3A-08 M : profil et fonction.
T3A-09 F : profil et fonction.
T3A-10 T : une fonction reproductive seulement.
T3A-11 reproductibilité.
T3A-12 variations extrêmes sans détachement.
T3A-13 projections cohérentes.
T3A-14 sérialisation export/import sans perte.
T3A-15 non-régression T2 et moteur.
T3A-16 bornes P1.
T3A-17 profils P2 reproductibles.
T3A-18 trois catégories et valeurs initiales.
T3A-19 rapport des corrections.
T3A-20 rejets des combinaisons interdites.
T3A-21 attaches après variations combinées.
T3A-22 dimensions cohérentes dans les trois vues.
T3A-23 export conserve valeurs appliquées et catégorie.
La reconnaissance visuelle M/F/T n'est PAS démontrée par ces tests numériques ; validation artistique utilisateur requise. Essai Safari iPad physique requis avant approbation de preview.

## 11. Réception et conduite du chantier
Premier banc d'essai : trois corps de référence, T avec sélection fonction male/female, superposition facultative squelette/articulations/ancrages, vues face/profil/dos, réglages simples. Ne pas commencer par cent personnages. Préserver le moteur principal, les sauvegardes, les previews et les laboratoires T2/B1/B2.
Avant Codex : audit de compatibilité réel avec T2, examen des AGENTS.md et des branches ouvertes, décision explicite sur interfaces/ratios/échelles, vérification des croquis de référence et de leur disponibilité. Toute nouvelle programmation, PR de code ou fusion requiert autorisation distincte de l'utilisateur.
