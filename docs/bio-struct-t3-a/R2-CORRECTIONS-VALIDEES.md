# BIO-STRUCT-T3-A-R2 — Correction ciblée des attributs anatomiques
Date : 2026-11-15
Statut : périmètre validé par l'utilisateur, correction de code NON lancée par dépôt documentaire.
Références : contrat T3-A, R1-CORRECTIONS-VALIDEES.md sur branche docs/bio-struct-t3-a-r2 ; preview R1 https://thsethse.github.io/Microcosme/preview/bio-struct-t3-a-r1/ ; PNG annoté « Illustration_sans_titre(2).png » fourni par l'utilisateur dans la conversation. **Le PNG n'est pas inclus dans ce commit** : Codex doit demander le fichier original si inaccessible ; ne pas le remplacer par une illustration de l'assistant.

## Lecture précise du PNG
Le PNG présente 4 silhouettes face, groupées en deux couples avant/après, avec cercles rouges et flèches :
- couple gauche : silhouette féminine avant -> après ; correction du dessin de la poitrine sur le thorax et du signe anatomique dans la région pelvienne. La cible est la silhouette après, non les traits rouges d'annotation.
- couple droit : silhouette masculine avant -> après ; correction du traitement pectoral et du placement du sexe masculin, qui descend au niveau de l'entrejambe et ne doit pas flotter sur l'abdomen. Les marques rouges sont des annotations, pas des traits à dessiner.
Le dessin est une référence qualitative de placement et de silhouette ; aucun ratio précis n'y est validé.

## Décisions validées
R2-D1 : conserver la base R1 sans changer ses proportions générales, ses morphologies, les sept formes de tête, les détails faciaux ni les couleurs et muscles existants.
R2-D2 : la poitrine féminine est ancrée au thorax, lisible de FACE et de PROFIL, pas dessinée au DOS. La poitrine ne doit pas se comporter comme deux objets flottants ; représentation stylisée, cohérente avec le volume et la perspective orthographique.
R2-D3 : l'attribut masculin est ancré à la région pelvienne, placé à l'entrejambe, visible de FACE et de PROFIL, pas au DOS ; ne pas le dessiner sur le nombril ou comme un marqueur flottant.
R2-D4 : pour la fonction reproductive féminine, ne pas dessiner de marqueur génital distinct en PROFIL ; seule la poitrine y est représentée comme caractère visible. En FACE, respecter le placement discret du croquis.
R2-D5 : pour T, la fonction reproductive détermine le caractère génital, indépendamment du volume de poitrine. Aucune transformation automatique de la morphologie lorsqu'on change cette fonction.
R2-D6 : préserver le caractère stylisé, non explicite, et éviter des contours noirs disproportionnés. Le réglage des formes de poitrine, degrés musculaires des pectoraux et ombrage brun subtil sera une ÉTAPE ULTÉRIEURE, NON comprise dans R2.

## Tests de réception R2
R2-01 référence féminine : poitrine attachée au thorax et lisible face/profil, absente dos.
R2-02 référence masculine : attribut placé à l'entrejambe, lisible face/profil, absent dos.
R2-03 fonction féminine : aucun marqueur génital en profil ; en face placement discret et cohérent avec croquis.
R2-04 T male/female : caractère génital suit la fonction ; poitrine inchangée par bascule.
R2-05 variation extrême P1 et morphologies : les attaches restent cohérentes, aucun flottement/chevauchement anatomique aberrant.
R2-06 les trois projections partagent le même canon ; les caractères masqués par orientation ne transparaissent pas.
R2-07 non-régression R1 : proportions, musculature, visage sans nez, formes de tête, morphologies, contrôles, JSON.
R2-08 non-régression T3-A (23 tests), R1 (8 contrôles), T2, moteur et CI Chromium/WebKit.
Validation artistique : captures comparatives M/F/T face/profil/dos, inspection et accord explicite de l'utilisateur. Les tests géométriques ne prouvent pas la qualité graphique.

## Conditions de livraison
Branche de code et PR ouvertes NON FUSIONNÉES ; preview indépendante sous https://thsethse.github.io/Microcosme/preview/bio-struct-t3-a-r2/ (ou URL GitHub Pages vérifiée sur le même dépôt) ; URL testée, assets fonctionnels, consignes Safari iPad ; rapport tests et captures avant/après. Aucune fusion ni modification du jeu principal. Ne pas démarrer R3 (choix des formes mammaires, pectoraux, ombres).
