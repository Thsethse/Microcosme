# BIO-STRUCT-T3-B2 — livraison technique

Preview : https://thsethse.github.io/Microcosme/preview/bio-struct-t3-b2/

## Base vérifiée et périmètre

Branche documentaire lue intégralement : `docs/bio-struct-t3-b2`, révision `682271c332f381ccd67d0f1350d9aba98853a77c`. Les contrats B1, R3, R2, R1 et T3-A ont également été lus intégralement. Aucun AGENTS.md trouvé dans l'espace de travail. Les règles du contrat sont respectées ; les dessins et calibrations numériques restent soumis à l'utilisateur.

B1 est techniquement exploitable : PR #20 ouverte, brouillon non fusionné, tête `6d5fcfdcbc0645515462c4bcb5dadeb447c6718b`. Ses CI dédiées et historiques sont réussies. Les 17 ressources de sa preview HTTPS ont été relues et comparées par SHA-256 avant développement ([preuve](VERIFICATION-BASE-B1.json)). Ce constat ne présume d'aucune validation artistique B1/R3.

La branche `codex/bio-struct-t3-b2` part de cette révision B1. La PR B2 cible la branche B1 pour rendre son seul delta B2 lisible ; aucune branche antérieure n'est écrasée ou fusionnée. Tout le code nouveau se trouve dans `experiments/bio-struct-t3-b2/`, ses tests, sa documentation et son workflow dédié. Le jeu, les sauvegardes, les laboratoires et les previews antérieures restent intacts. La publication ajoute exclusivement un nouveau dossier de preview sur main, selon la procédure déjà employée.

## Fonctionnalités

- Chauve, court, mi-long, long, très long. Chauve supprime les surfaces et désactive les réglages capillaires sans effet.
- Lisse (tombé souple et stries courbes), raide (implantation nette et mèches droites), frisé (petites ondulations), bouclé (boucles plus larges). Différences contrôlées sur les pixels des trois vues.
- Six dessins de coupes : balayée, nette, raie centrale, dégradée, équilibrée et asymétrique. Familles de présentation M/F correspondantes, T accède aux trois familles sans lien à sa fonction. Changement de famille incompatible avec une coupe : adaptation explicite N2.
- Cheveux attachés au repère canonique `head`, calotte antérieure et de profil, nappe dorsale, surfaces latérales et mèches longues. Les trois projections proviennent des mêmes coordonnées, sans nouveau squelette.
- M/T : moustache presque au-dessus des lèvres, barbe presque au-dessous, rouflaquettes latérales dont le sommet est au plus à la médiane. Chaque présence, taille et couleur est indépendante. Aucune pilosité faciale de dos.
- F : aucun dessin ni contrôle facial. L'import de demandes anciennes ou v5 interdites désactive les trois présences et produit un rapport explicite, en conservant corps, visage et couleurs.
- Corps R3, proportions et visage B1 conservés. Les pixels des yeux, sourcils, lèvres et cils sont protégés contre les couches capillaires, y compris le contour d'un profil.
- Galerie M/F/T, trois vues, portraits, commandes tactiles, export/import versionné, migrations explicites et génération déterministe.

## Choix graphiques à valider

Ces valeurs sont des propositions d'implémentation, pas des proportions imposées par le contrat : frange à environ 14–31 % de la hauteur crânienne au-dessus de la médiane ; ourlets courts/mi-longs/longs/très longs à −22/−60/−115/−190 % de cette hauteur depuis le centre du crâne. Les mèches antérieures s'infléchissent devant le thorax après le menton ; la nappe arrière reste derrière le corps en face et visible au dos.

Écart racine moustache/lèvres et barbe/lèvres : 0,8 % de la hauteur de tête. Au faible nombre de pixels du plein pied, il peut se confondre avec une ligne de pixels : les portraits et planches permettent l'examen. La taille de moustache est réduite explicitement (N1) si le visage B1 ne laisse pas assez d'espace entre yeux et bouche. Les rouflaquettes s'arrêtent sous la médiane. Les tailles sont bornées [0,1] avec demande conservée et rapport N2.

À arbitrer visuellement : silhouettes des six coupes, séparation lisse/raide, taille et fréquence des boucles, épaisseur du profil, trois hauteurs de pilosité, raccord barbe/menton et lecture de la moustache. La nappe longue utilise des surfaces géométriques à stries ; ce prototype n'ajoute pas de simulation physique de cheveux. Pas de nouvelle forme de tête, nez, yeux, bouche, cils, pilosité corporelle ou finition anatomique.

## Sérialisation

[JSON v5 et compatibilité](JSON-V5.md). [Douze contrôles](CONTROLES-B2.md). [Captures](COMPARAISONS.md). [Résultats et publication](PUBLICATION.md).

La réception artistique et le test Safari sur iPad physique sont exclusivement réservés à l'utilisateur. Les automatismes Chromium/WebKit ne remplacent pas cet essai. PR ouverte non fusionnée ; aucune phase supplémentaire engagée.
