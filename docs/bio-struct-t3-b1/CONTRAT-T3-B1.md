# BIO-STRUCT-T3-B1 — Contrat : formes de tête et détails du visage
Date : 2026-11-15
Statut : exigences utilisateur validées ; réglages numériques et catalogue de dessins à proposer puis tester visuellement.
Base : prototype T3-A-R3 lorsqu'il sera disponible et validé ; ne pas présumer que R3 est fusionné. Si R3 est encore en cours, créer B1 depuis le HEAD de code R3 vérifié, sans l'écraser, ou signaler la dépendance bloquante.
Références : docs/bio-struct-t3-a/CONTRAT.md, R1-CORRECTIONS-VALIDEES.md, R2-CORRECTIONS-VALIDEES.md, R3-FINITION-MORPHOLOGIQUE.md ; règles faciales explicites du 15/11/2026.

## Décisions validées
B1-D1 Formes de tête : RETIRER les options « triangle », « triangle inversé » et « losange » si présentes, jugées non crédibles ; garder rond, ovale, carré et rectangle ; ARRONDIR visiblement les angles de carré et rectangle. Ne pas remplacer par de nouvelles formes non approuvées. Conserver les contours cohérents en face et profil. Pour import JSON ancien avec forme retirée, conversion déterministe documentée, sans erreur et sans altérer le reste du personnage.
B1-D2 Géométrie du visage : tous les traits dérivent des dimensions et attaches du corps canonique, jamais de positions fixes à l'écran. YEUX : juste SOUS la ligne horizontale médiane du visage ; même en agrandissant, le BORD SUPÉRIEUR des yeux ne doit JAMAIS franchir cette ligne. ÉCART entre les deux yeux = largeur d'un œil (mesure bord interne à bord interne). Les sourcils sont immédiatement AU-DESSUS des yeux, sans contradiction avec la contrainte de médiane ; la contrainte de médiane porte sur les yeux, pas les sourcils. BOUCHE : centrée verticalement à mi-distance entre le bas des yeux et le bas du visage. ZÉRO NEZ : aucun dessin ni ancrage nasal.
B1-D3 Yeux : choix de FORMES, TAILLES et COULEURS ; la taille doit respecter en permanence les contraintes B1-D2. Formes visuellement différenciées mais stylisées ; documenter le catalogue proposé avant de le qualifier de définitif. Couleurs d'iris indépendantes de la forme et taille.
B1-D4 Sourcils : choix de FORMES et COULEURS, position au-dessus des yeux, attache bilatérale ; la couleur n'est pas forcée par le type M/F/T.
B1-D5 Bouches : choix de FORMES et COULEURS de lèvres ; inclure les familles demandées : demi-cercle pour lèvre inférieure, demi-cercle pour lèvre supérieure, petits triangles, rectangle, « B inversé » pour la lèvre supérieure. Ces termes décrivent des inspirations de tracé, non des formes finales déjà approuvées ; proposer un catalogue visuel testable, sans dessiner de nez. La bouche suit le visage en taille et forme.
B1-D6 Cils : sur la LIGNE SUPÉRIEURE des yeux pour les modèles F ; pour T, cils librement sélectionnables indépendamment de fonction reproductive. Pour M, ne pas ajouter de sélecteur de cils féminins dans ce lot sauf décision ultérieure. Les cils doivent suivre forme et taille des yeux.
B1-D7 M/F/T : les choix de tête, yeux, bouches, sourcils et couleurs restent indépendants de la fonction reproductive ; T autorise toutes les caractéristiques d'apparence prévues. Préserver la compatibilité avec les profils M/F/T.
B1-D8 Rendu face/profil/dos : traits faciaux lisibles en face, cohérents en profil et invisibles au dos. Ne pas dessiner les yeux/bouche par transparence. Pas de changement des volumes corporels R3, des attributs sexuels R2, ni des proportions R1.
B1-D9 Contrôles : libellés intelligibles et retours visibles immédiatement ; options sélectionnables indépendamment ; export/import versionné et déterministe, valeurs hors limites bornées et anciennes options de tête migrées.

## Contrôles de réception
B1-01 Choix tête rond/ovale/carré arrondi/rectangle arrondi ; pas de triangle/triangle inversé/losange dans l'UI.
B1-02 Import ancien JSON avec forme supprimée : fallback stable et documenté, sans perte des autres attributs.
B1-03 Variation taille/forme yeux : bord supérieur toujours sous ou sur la médiane, écart interoculaire toujours une largeur d'œil.
B1-04 Sourcils au-dessus des yeux, indépendants en forme et couleur.
B1-05 Bouche au milieu de l'intervalle bas des yeux/bas du visage sous variations morphologiques.
B1-06 Aucun nez, volume ou ancrage nasal.
B1-07 Catalogue yeux et bouches proposant effectivement plusieurs formes distinctes ; couleurs réglables.
B1-08 Cils sur bord supérieur des yeux pour F ; T libre ; aucun décalage sous changement de forme.
B1-09 Face/profil/dos : traits visibles uniquement là où anatomiquement projetables.
B1-10 Génération déterministe et export/import préservés ; test bornes morphologiques et sélecteurs.
B1-11 Non-régression T3-A/R1/R2/R3, T2, jeu principal et CI Chromium/WebKit.
B1-12 Captures comparatives M/F/T, variations de formes et couleurs ; validation esthétique par utilisateur sur iPad physique.

## Hors périmètre
T3-B2 : cheveux (chauve, court, mi-long, long, très long ; textures lisse, raide, frisé, bouclé ; couleurs ; inspirations masculine/féminine/mixte), moustache, barbe, rouflaquettes et pilosité faciale.
Pas de modifications des ombrages, pectoraux, poitrine, abdominaux, bassin ou pilosité corporelle de R3.
Aucun merge sans accord explicite de l'utilisateur.
