# BIO-STRUCT-T3-B1 — têtes et traits du visage

Preview : https://thsethse.github.io/Microcosme/preview/bio-struct-t3-b1/

R3 conservée : https://thsethse.github.io/Microcosme/preview/bio-struct-t3-a-r3/

Quatre têtes : rond, ovale, carré arrondi, rectangle arrondi. Yeux : six formes, taille bornée, couleur d’iris ; sourcils : trois formes et couleur ; bouche : cinq familles et couleur des lèvres ; cils F courts/accentués et T libres, aucun sélecteur M. Aucun nez. Les traits partagent les attaches du canon, se projettent en face/profil et sont masqués de dos. Deux portraits sont des agrandissements du même rendu ; médiane/écartement affichables en diagnostic.

La géométrie impose bord supérieur des yeux sous la médiane, écart bord-à-bord égal à une largeur d’œil, sourcils au-dessus et bouche au milieu du bas des yeux/menton. Le raster entier respecte également l’écartement et limite les iris au masque des yeux ; les cils rejoignent le premier pixel du bord supérieur visible.

JSON v4 : lecture des v1/v2/v3 avec migration explicite des anciennes têtes triangle/triangle inversé/losange vers rond ; ancien choix et traces conservés, paramètres corporels R3 intacts. Bornes faciales et P1 tracées. Génération déterministe et import/export sans perte des données reconnues. Dossier autonome également utilisable en file://.

Sources corporelles reprises de R3, sans changement des proportions, volumes corporels, ombres ou pilosité. Laboratoire indépendant dans un nouveau dossier ; aucune ancienne preview remplacée. Documentation, 18 captures et tableau B1-01…12 sous `docs/bio-struct-t3-b1/implementation/` sur `codex/bio-struct-t3-b1`.

Catalogue graphique proposé pour essai, non validé artistiquement. Safari iPad physique à tester par l’utilisateur. Aucun T3-B2 (cheveux, moustache, barbe, rouflaquettes), aucun jeu/sauvegarde modifié et aucune fusion.
