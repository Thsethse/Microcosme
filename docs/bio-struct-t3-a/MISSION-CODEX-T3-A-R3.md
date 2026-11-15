# MISSION CODEX — BIO-STRUCT-T3-A-R3
Dépôt : https://github.com/Thsethse/Microcosme
Branche documentaire : docs/bio-struct-t3-a-r3
Source de vérité : docs/bio-struct-t3-a/R3-FINITION-MORPHOLOGIQUE.md sur cette branche.

## Avant toute programmation
Inspecter les AGENTS.md, branches, PR de code et preview R2, état du déploiement GitHub Pages, contrats T3-A/R1/R2 et tests existants. Conserver la version R2 comme référence de non-régression ; ne pas écraser le travail concurrent.

## Implémentation autorisée
Créer une branche de code R3 et une PR non fusionnée. Implémenter exactement R3-D1..D8 et R3-01..R3-11 :
1. Contrôles taille et forme de poitrine pour F/T, sans option de poitrine féminine pour M.
2. Sélecteur pectoraux (rond/tombant -> musclé/rectangulaire), et sélecteur abdominaux (rond -> défini), pour les trois catégories.
3. Ombrages bruns subtils dessinant les volumes réels ; contours localement discrets seulement si nécessaire, sans revenir aux plaques cernées de T3-A initial.
4. Pilosité corporelle torse/ventre, pilosité pubienne selon les options définies, sans masquer le sexe.
5. Nombril représenté par un point discret pour tous.
6. Retrait de l'option « ovale » du sélecteur bassin, sans supprimer la géométrie et sans casser import/export d'anciennes données.
7. Préserver entièrement les corrections R2 des attributs anatomiques et les proportions R1.

## Livraison
PR code NON FUSIONNÉE, branche et SHA ; preview indépendante depuis le dépôt Microcosme à https://thsethse.github.io/Microcosme/preview/bio-struct-t3-a-r3/ (ou autre URL GitHub Pages exacte vérifiée sur ce dépôt) ; captures M/F/T face/profil/dos avant/après ; tableau de tests existants et R3, CI Chromium/WebKit, liste d'écarts et arbitrages artistiques ; consignes de test Safari iPad. Vérifier que la preview et ses assets répondent réellement avant d'annoncer la disponibilité. Ne pas déclarer le test sur iPad physique effectué.
Ne pas programmer T3-B1/B2, ne pas fusionner, ne pas toucher au jeu principal ni aux sauvegardes historiques.
