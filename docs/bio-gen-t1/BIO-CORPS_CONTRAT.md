# Microcosme — BIO-CORPS : contrat conceptuel de transmission
Date : 15 novembre 2026
Statut : synthèse de décisions issues des échanges, non déposée précédemment dans GitHub. Ne pas traiter comme spécification biologique complète prête à coder.

## Principe canonique
Un seul organisme biologique canonique détermine les caractéristiques corporelles, les capacités et l'apparence. Les représentations graphiques sont dérivées du corps et ne modifient jamais les données biologiques. Le modèle doit produire des individus différents, apparentés, reconnaissables et évolutifs, en minimisant les propriétés indépendantes.

## BIO-COR-A1 à A5 — validées
- A1 : mains, pieds et structures reproductives intégrés à l'anatomie, avec conséquences fonctionnelles ; pas de détail microscopique.
- A2 : visage standard détaillé (tête, yeux, bouche, nez, oreilles, cheveux, etc.), traits héritables, expressions distinctes des traits permanents ; portrait plus détaillé que sprite.
- A3 : reproduction multidimensionnelle (anatomie, maturation, fertilité, caractères sexuels secondaires), sans champ unique « sexe » déterminant tout.
- A4 : inspection divine complète des caractéristiques biologiques, y compris intimes, sans nécessité de représentation anatomique explicite.
- A5 : attraction, désir et préférences relèvent de la psychologie et des relations, non d'une déduction déterministe du corps.

## BIO-CORPS v0.2 — dimensions conceptuelles
COR-01 Organisation : hiérarchie anatomique extensible.
COR-02 Géométrie : dimensions et proportions.
COR-03 Composition : distribution de matière, dépendante de B1.14.
COR-04 État structurel : développement, blessures, état fonctionnel.
Ces quatre dimensions ne sont pas quatre objets de stockage indépendants obligatoires.

## BIO-COR-R1 à R4 — validées
R1 anatomie hiérarchique extensible ; R2 rôles fonctionnels/morphologiques/physiologiques potentiellement multiples ; R3 distinguer trait physique, fonction biologique et manifestation observable ; R4 ajouter tests COR-T13 à COR-T18 : proportions à taille égale ; main lésée sans atteinte locomotrice ; visages distincts ; caractères sexuels secondaires similaires et fonctions reproductives différentes ; coupe de cheveux non héréditaire ; attraction unilatérale indépendante de l'anatomie.

## BIO-ANAT-D1 à D6 — validées
D1 référence humanoïde extensible : tête/face, tronc, bras/mains, jambes/pieds, structures internes et reproductives ; systèmes internes transversaux non dupliqués.
D2 distinguer gauche/droite lorsque causalement nécessaire (mains, pieds, yeux, oreilles, etc.).
D3 visage composé de structure, traits, tégument et expressions dérivées.
D4 structures physiques distinctes des systèmes fonctionnels.
D5 contrat conceptuel de partie : part_id, parent_id, role_set, geometry, composition, structural_state, functional_links, appearance_links, heritability_links, history_refs ; champs optionnels selon rôle, pas un schéma de code figé.
D6 maintenir dépendances ANAT-DEP-01 à 10 et tests ANAT-T01 à 10 comme exigences de clôture.

Dépendances principales : B1.14 et C5 pour matière/croissance ; BIO-PATRIMOINE pour hérédité ; BIO-PHYSIO pour blessure/réparation ; BIO-CAPACITES pour effets fonctionnels ; BIO-REPRODUCTION ; psychologie/relations ; moteur graphique ; histoire causale ; M2 sens ; M5 manipulation.

## BIO-GEN-D1 à D6 — validées
D1 générateur unique ; D2 six opérations génériques Hériter, Développer, Répartir, Transformer, Exprimer, Dériver (pas six moteurs) ; D3 dispositions globales corrélées + variation locale + histoire ; D4 déterminisme, identité persistante, ressemblance familiale causale ; D5 trois échelles île / scène / portrait ; D6 tests biologiques, statistiques, visuels, techniques avant intégration.

## BIO-GEN-PARAM-D1 à D5 — validées
D1 distinguer dispositions génératives, corps développé, résultats dérivés ; D2 budget expérimental de 18 paramètres morphologiques visibles, non minimum démontré ni plafond : échelle, ratio tronc/jambes, largeur ; développement contractile, distribution réserves ; six paramètres du visage (ratio hauteur/largeur, mâchoire, espacement yeux, forme yeux, projection nez, forme bouche) ; pigmentation peau/iris/cheveux ; implantation/texture/densité cheveux ; asymétrie bornée. D3 contraintes anatomiques, matérielles et développementales ; D4 dispositions corrélées et variantes locales héritables, règles définitives non arrêtées ; D5 biologie interne/reproductive hors budget des 18 paramètres.

## BIO-GEN-RENDER-D1 à D6 — validées
D1 trois échelles dérivées du corps ; D2 composition hybride avec gabarits limités, proportions bornées, ancrages, variantes, palettes, couches et poses réutilisées ; D3 priorité silhouette / sprite identitaire et action / portrait facial ; D4 identité stable dans poses et transformations ; D5 limite de résolution n'altère pas biologie ; D6 validation visuelle et technique sur Safari iPad physique.

## Réserves importantes
- BIO-COR-D1 à D7 de l'ancienne version n'ont pas été explicitement validées.
- BIO-GEN-AUD-D1 à D6 (graphe de dépendances, contrat d'hérédité, projection discrète, tests additionnels, laboratoire fictif, report croissance) ont été proposés mais pas ratifiés explicitement. Ne pas les présenter comme des décisions approuvées ; les appliquer uniquement lorsqu'ils sont déjà couverts par BIO-GEN-T1 validé.
- B1.14 (composition corporelle/réserves) et C5 (ressources environnementales) ne sont pas clos ; aucune simulation complète de croissance ou reproduction ne doit être inventée.
