# BIO-STRUCT-T3-B2 — Contrat cheveux et pilosité faciale
Date : 2026-11-15
Statut : règles utilisateur validées ; formes graphiques et paramètres techniques à valider en preview.
Dépendance : T3-B1 et R3. Ne pas présumer de leur fusion. Inspecter leurs branches et leur état réel avant de coder.

## Périmètre et décisions
B2-D1 Cheveux : catalogue avec longueurs **chauve, court, mi-long, long, très long**, textures **lisse, raide, frisé, bouclé**, couleurs sélectionnables. Les libellés « lisse » et « raide » sont tous deux demandés : les garder distinguables dans le prototype (p. ex. tombé/implantation) ou documenter un besoin d'arbitrage si l'implémentation ne les distingue pas visuellement. Aucune option inerte.
B2-D2 Coupes : familles d'inspiration masculine et féminine, et choix mixte. Pour T, catalogue complet et combinable ; pour M/F, proposer les familles correspondantes sans confondre sexe reproducteur et mécanisme capillaire. L'utilisateur a demandé des coupes distinctes pour M et F, mixtes pour T ; ne pas attribuer de valeurs biologiques obligatoires à une coiffure.
B2-D3 Ancrage : implantation sur le crâne canonique, respect des contours de tête B1 et des variations de taille ; les mèches suivent la tête en face, profil, dos ; pas de cheveux flottants ni de traversée des yeux, sourcils ou bouche. La chevelure longue doit être visible de dos ; chauve ne doit pas créer de mèches.
B2-D4 Pilosité faciale : UNIQUEMENT pour M et T. F : aucun sélecteur ni dessin de moustache, barbe ou rouflaquettes. Pour T, toutes les combinaisons sont permises indépendamment de la fonction reproductive.
B2-D5 Moustache : placée immédiatement AU-DESSUS de la bouche, presque accolée ; variations de taille et couleur.
B2-D6 Barbe : placée immédiatement SOUS la bouche, presque accolée ; variations de taille et couleur. Une barbe peut prolonger le menton mais ne doit pas couvrir arbitrairement la bouche.
B2-D7 Rouflaquettes : sur les joues, avec extension maximale jusqu'à la ligne horizontale médiane du visage, sans dépasser vers les yeux ; variations de taille et couleur. Cohérence en face/profil ; ne pas dessiner les éléments de face au dos.
B2-D8 Pilosité faciale et cheveux : réglages indépendants de présence, taille/longueur et couleur ; combinaisons moustache seule, barbe seule, rouflaquettes seules ou combinées ; aucune dépendance forcée entre couleur des cheveux et pilosité faciale.
B2-D9 Préserver les contraintes B1 : pas de nez ; bord supérieur des yeux ne dépasse pas la médiane ; écart interoculaire d'un œil ; bouche et sourcils à leurs ancrages ; traits faciaux invisibles de dos.
B2-D10 Sérialisation : versionnée, déterministe, compatible anciens profils ; valeurs hors bornes corrigées explicitement ; l'absence de pilosité faciale F doit être appliquée aussi à l'import, sans corrompre les autres paramètres.
B2-D11 Conserver les rendus et contrôles de R3 et B1, les trois projections, la simulation et les sauvegardes historiques ; ne pas modifier le jeu principal.

## Contrôles de réception
B2-01 Les 5 longueurs de cheveux sont distinctes et fonctionnelles ; chauve est effectivement chauve.
B2-02 Les 4 textures produisent des différences lisibles ou une réserve explicitement documentée à arbitrer.
B2-03 Couleurs indépendantes, choix de coupes d'inspiration M/F et catalogue mixte T.
B2-04 Attache au crâne en face/profil/dos, variations de taille et formes B1, cheveux longs visibles au dos.
B2-05 M/T : moustache juste au-dessus de la bouche ; barbe juste au-dessous ; rouflaquettes sur joues au plus jusqu'à médiane.
B2-06 M/T : taille et couleur de chaque pilosité réglables séparément ; combinaisons indépendantes.
B2-07 F : aucune pilosité faciale ni contrôle de pilosité faciale, y compris import d'un JSON antérieur.
B2-08 T : liberté totale indépendamment de la fonction reproductive.
B2-09 Absence d'artefacts d'occlusion, d'éléments flottants, de traits faciaux visibles de dos ; aucun nez ajouté.
B2-10 Export/import déterministe, anciens profils et bornes robustes.
B2-11 Non-régression T3-A, R1, R2, R3, B1, T2 et jeu ; tests Chromium/WebKit.
B2-12 Captures de chaque longueur/texture, couleurs et variantes M/F/T, face/profil/dos ; validation artistique sur Safari iPad par utilisateur.

## Hors périmètre
Pas de nouvelle forme de visage, yeux, sourcils, lèvres, cils ; pas de correction du corps, poitrine, abdominaux, ombrages ou pilosité corporelle ; pas de nouveaux mécanismes de vieillissement, croissance ou génétique. Pas de fusion sans accord explicite.
