# MISSION CODEX — BIO-STRUCT-T3-B2 — Cheveux et pilosité faciale
Dépôt : https://github.com/Thsethse/Microcosme
Branche documentaire : docs/bio-struct-t3-b2
Source de vérité : docs/bio-struct-t3-b2/CONTRAT-T3-B2.md

## Préparation obligatoire
Lire intégralement ce contrat et les contrats B1, R3 et antérieurs. Examiner AGENTS.md, les branches/PR en cours, HEAD du prototype B1, CI et publication GitHub Pages. Ne pas présumer que B1 ou R3 sont fusionnés ; si B1 n'est pas utilisable, signaler la dépendance avant de coder. Travailler sur branche de code dédiée, PR non fusionnée, sans écraser les autres chantiers.

## Implémentation
- Cheveux : 5 longueurs, 4 textures, couleurs, familles de coupes d'inspiration masculine/féminine et mixte T, implantées sur la tête canonique, cohérentes face/profil/dos.
- Pilosité faciale EXCLUSIVEMENT M et T : moustache immédiatement au-dessus de la bouche, barbe immédiatement dessous, rouflaquettes sur joues jusqu'à la médiane au maximum ; réglages taille et couleur indépendants ; pas de moustache/barbe/rouflaquettes sur F, même par import.
- Contrôles visuels lisibles et non inertes ; export/import déterministe ; aucun nez ; préserver contraintes des yeux et bouche B1.
- Respecter B2-D1..D11, ajouter B2-01..B2-12 ; préserver toutes les régressions R3/B1.

## Livraison
Créer une PR de code NON FUSIONNÉE et une preview indépendante dans le dépôt Microcosme à https://thsethse.github.io/Microcosme/preview/bio-struct-t3-b2/ (ou URL exacte vérifiée). Vérifier chargement, scripts et assets. Captures M/F/T face/profil/dos, exemples de 5 longueurs et 4 textures, variations de pilosité faciale, résultats des tests B2 et non-régression, rapport des écarts. Fournir lien utilisable sur Safari iPad et mentionner que le test iPad physique est réservé à l'utilisateur. Aucune fusion, aucun changement au jeu principal ni aux sauvegardes.
