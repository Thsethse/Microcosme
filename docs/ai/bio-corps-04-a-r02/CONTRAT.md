# BIO-CORPS-04-A-R02 — Correction artistique adulte F
R01 refusée : https://thsethse.github.io/Microcosme/preview/bio-corps-04-a-r01/#planche-poitrine. Poitrine trop haute, protubérances du contour plutôt que recouvrement. Inspecter le code pour confirmer les causes.
## Ressources vérifiées
Lire les quatre images depuis main (ne pas fusionner main pour les obtenir), dossier docs/ai/visual-references :
- IMG_0612.webp, blob 7433437c0c68eee408d7e3a95db2682307edcd51 : neuf morphologies illustrées, implantation et courbes.
- IMG_0613.jpeg, blob ff34e3b6d3414a7234b96d5243ef6989bb2b6b5f : douze morphologies, reliefs et ombres.
- IMG_0614.jpeg, blob 9563bc93f58310cece6af24a7826e0e89bf73fce : seize paires de courbes schématiques.
- IMG_0730.png, blob c657ab08ee7a4297c1d3393cfdee7e60ecd798bd : croquis du porteur, huit pions, deux corpulences et quatre volumes. Intention artistique uniquement, pas gabarit normatif ni reproduction au trait près.
Les documents ne constituent pas des normes anatomiques. Ne pas réintroduire les catalogues de presets, asymétrie ou aréoles à cette étape.
## Correction
Abaisser implantation relative au thorax, dégager épaules et cou. Conserver attache anatomique distincte de l'extension du volume. Construire deux volumes symétriques indépendants superposés au corps, sans modifier le chemin ni les points du corps sous-jacent. Masquer localement le contour situé derrière les volumes ; le contour visible final peut dépasser latéralement, sans double trait ni rupture, sans déformer le thorax. Utiliser courbes ouvertes visuellement vers le haut, ombres inférieures et latérales, deux à trois nuances de peau en aplats, raccord supérieur naturel. Méthode SVG libre sous ces contraintes.
## Paramètres
Conserver six curseurs 0–100 : volume, largeur, allongement, rondeur, écartement, affaissement. Recalibrer amplitudes et interactions. Volume 0 plat, 25 petit, 50 moyen, 75 gros, 100 très gros ; dépassement latéral crédible possible. Petite poitrine possible sur corps très corpulent, grosse sur corps mince. Corpulence influence volume et douceur sans imposer affaissement. Respecter BIO-INV-01 et BIO-CORPS-INV-01/02/03 amendé : données, hauteur, ancrage, repères, visage et corps validés préservés. Aucun nouveau curseur.
## Recette
Comparer R01/R02 à paramètres comparables, planche de deux corpulences (standard et très obèse) x quatre volumes non nuls, plus volume nul, ossatures fines/larges, extrêmes admissibles, trois échelles, plusieurs peaux. Ajouter vue agrandie pour juger implantation et raccords. Démontrer invariance exacte du chemin du corps sous-jacent quand les six paramètres mammaires changent, et absence de contour parasite dans les zones recouvertes. Vérifier utilité des curseurs, continuité, sauvegardes, non-régression. Documenter consultation des quatre images et choix artistiques ; pas de copie obligatoire du croquis. Validation artistique iPad réservée au porteur.
## Livraison
Partir de docs/bio-corps-04-a-r02 issue de codex/bio-corps-04-a-r01. Branche codex/bio-corps-04-a-r02, PR ouverte sans fusion, rapport docs/ai/bio-corps-04-a-r02/RAPPORT.md, preview publique /preview/bio-corps-04-a-r02/, URL et SHA vérifiables. Aucun autre chantier, notamment pectoraux, aréoles, mamelons, âges, ventre, vêtements ou intégration jeu. Attendre validation.
