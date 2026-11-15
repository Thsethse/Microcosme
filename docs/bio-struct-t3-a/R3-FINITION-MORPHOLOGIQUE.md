# BIO-STRUCT-T3-A-R3 — Contrat de finition morphologique du corps
Date : 2026-11-15
Statut : objectifs validés en conversation ; détails numériques et résultat artistique soumis à validation sur iPad.
Base : https://thsethse.github.io/Microcosme/preview/bio-struct-t3-a-r2/
Références : docs/bio-struct-t3-a/CONTRAT.md, R1-CORRECTIONS-VALIDEES.md, R2-CORRECTIONS-VALIDEES.md. Lire et respecter les contrats antérieurs.

## Périmètre R3 : CORPS UNIQUEMENT
R3-D1 Poitrine féminine : contrôle distinct de TAILLE et de FORME ; volumes continus attachés au thorax, face/profil cohérents, pas de détails de poitrine au dos. Interdite comme option de poitrine féminine pour M ; M conserve les variations de volume pectoral et de graisse. T : choix intégralement libre, indépendamment de la fonction reproductive.
R3-D2 Pectoraux : sélecteur continu ou paliers explicites, d'une forme arrondie et tombante associée à davantage de graisse à une forme plus rectangulaire et nettement dessinée associée au muscle. Le rendu suit les volumes du canon et n'ajoute pas de plaques flottantes. Pour M et F : disponibilité du réglage pectoral sous la poitrine selon cohérence géométrique ; T libre. Ne pas faire d'un genre une valeur musculaire fixe.
R3-D3 Abdominaux : sélecteur pour M/F/T, du ventre rond à des abdominaux très définis. Les volumes et ombres doivent changer ensemble ; ne pas simplement coller des rectangles sur la peau.
R3-D4 Ombrages : ombre brune légère, localisée sous les reliefs et aux raccords anatomiques pour lire poitrine, pectoraux, abdominaux, bassin, bras et jambes. Priorité au relief subtil et à la couleur de peau, sans contour sombre systématique ; si une zone reste illisible, autoriser un cerné local très discret, documenté. Garder lisibilité avec plusieurs tons de peau et en zoom.
R3-D5 Pilosité corporelle : pour M, pilosité torse et ventre réglable (présence/densité, teinte cohérente) ; pilosité pubienne rectangulaire, limitée au pubis sans empiéter sur la base du sexe. Pour F, pubis absent/triangulaire/carré/rectangulaire ; pas de pilosité de torse/ventre imposée. Pour T, toutes les options librement combinables, indépendamment de la fonction reproductive. Rendu stylisé non explicite, ancré sur le canon ; gérer face/profil/dos sans transpercement ou flottement.
R3-D6 Nombril : petit POINT discret (et non tiret), pour M/F/T, attaché à l'abdomen, visible seulement lorsque sa projection le permet.
R3-D7 Bassin : supprimer uniquement l'option de forme « ovale » du sélecteur si elle n'a aucun effet visible ; ne pas supprimer le volume anatomique du bassin, ni casser les anciennes sauvegardes/export. Prévoir une migration/fallback déterministe pour toute ancienne valeur « ovale ».
R3-D8 Préserver R2 : proportions, silhouette générale, position des attributs sexuels face/profil/dos, formes de tête, visage, choix de morphologie, génération déterministe, sérialisation versionnée et T2. Ne pas modifier le jeu principal.

## Contraintes d'architecture
- Une seule source de vérité biologique : paramètres -> volumes géométriques -> projection -> ombrage/détails ; aucune ombre détachée du corps.
- Séparer muscle, graisse, volume mammaire, pilosité, catégorie M/F/T et fonction reproductive ; aucune catégorie ne doit changer arbitrairement les autres réglages.
- Conserver une UI compréhensible : contrôles étiquetés et effets immédiatement visibles. Valeurs par défaut proches de R2.
- Ne pas inventer des ratios ou catalogues détaillés comme décisions validées : proposer des valeurs techniques documentées et révisables.
- Ne pas modifier le visage : yeux, lèvres, sourcils, cils, barbe, moustache, rouflaquettes, cheveux et formes de tête relèvent de T3-B1/B2. Même si les têtes triangle/losange sont contestées, leur retrait est programmé en B1, pas R3.

## Réception
R3-01 Poitrine taille/forme indépendantes ; M sans sélecteur de poitrine féminine ; T libre.
R3-02 Pectoraux graduellement lisibles du rond/tombant au rectangulaire/musclé ; sans volumes flottants.
R3-03 Abdominaux du rond au défini pour M/F/T ; pas de plaques superposées.
R3-04 Ombrages bruns doux et localisés, cohérents avec volumes, plusieurs tons de peau, face/profil/dos.
R3-05 Pilosité torse/ventre M, T libre ; choix pubiens F et M sans chevauchement du sexe.
R3-06 Nombril POINT pour les trois catégories, attaché au bon endroit.
R3-07 Option « ovale » du bassin retirée de l'UI, géométrie conservée et import ancien JSON sans erreur.
R3-08 Réglages indépendants de fonction reproductive et catégorie, sauf interdiction de sélecteur mammaire M.
R3-09 Stabilité géométrique sous bornes morphologiques et changements de projection.
R3-10 Non-régression : 23 tests T3-A, 8 R1, 8 R2, export/import, T2, Chromium/WebKit, jeu principal.
R3-11 Comparatifs avant/après et validation visuelle iPad physique par l'utilisateur ; ne pas prétendre automatiser la validation esthétique.

## Hors périmètre
T3-B1 : suppression têtes triangle/losange, arrondis carré/rectangle, yeux, bouches, sourcils, cils.
T3-B2 : cheveux, moustache, barbe, rouflaquettes et pilosité faciale.
Aucune fusion sans validation explicite de l'utilisateur.
