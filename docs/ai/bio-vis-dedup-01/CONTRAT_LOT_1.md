# BIO-VIS-DEDUP-01 — Contrat de réalisation proposé, LOT 1 (sans exécution)

**État : contrat documentaire préparé, non autorisé pour exécution.**  
**Dépôt :** Thsethse/Microcosme · **Référence documentaire :** PR #41, branche `docs/bio-vis-dedup-01`.  
**Référence visuelle actuelle :** [P5-I6](https://thsethse.github.io/Microcosme/preview/bio-vis-p5-i6/).  
**Mission ultérieure pour Codex :** corriger quatre dossiers de formes capillaires **uniquement après une autorisation explicite distincte**. Le dépôt de ce contrat ne lance aucun travail de code, aucune branche de code, aucune preview et aucune fusion.

## 1. Sources faisant autorité

Avant toute exécution, lire dans ce dossier :
- [ARBITRAGES_UTILISATEUR.md](ARBITRAGES_UTILISATEUR.md) — décisions utilisateur validées, prioritaires sur les anciennes mentions « En attente » ;
- [COPIES_EXACTES.md](COPIES_EXACTES.md) — E01, E02, E03, E05, constats et limites des illustrations ;
- [METHODE.md](METHODE.md) — protocole de comparaison, trois tailles, références et limites ;
- [PLANCHES.md](PLANCHES.md) et les PNG `planches/E01.png`, `E02.png`, `E03.png`, `E05.png` ;
- catalogue et illustrations originales de la PR documentaire #33, liés depuis les dossiers ;
- état réel du générateur P5-I6 et instructions du dépôt (dont AGENTS.md, s'il existe à la date de réalisation).

Ne pas extrapoler les parties de cheveux cachées par des accessoires. Couleurs, bijoux, bandeaux et objets ne comptent pas comme géométrie capillaire distincte.

## 2. Périmètre et cibles graphiques

### E01 — 08 / 58-G : DIFFÉRENCIER
- **08** : préserver l'organisation historique en petites boucles ouvertes réparties autour du visage.
- **58-G** : dessiner une chevelure courte plus plaquée, avec quelques **larges vagues frontales jointives**, contour moins lobé.
- Ne pas gonfler uniformément la coupe ni inventer la densité sous les feuilles ; 58-D hors périmètre.
- **Critère visuel :** silhouettes/rythmes de boucles distincts en monochrome, accessoires désactivés.

### E02 — 12 / 24-D : DIFFÉRENCIER
- **12** : préserver balayage latéral et queue haute décentrée.
- **24-D** : conserver une queue haute, mais créer une **raie centrale**, deux grandes mèches frontales arrondies et des longueurs latérales ondulées visibles.
- Préserver les yeux, le front, les ancrages de P4-R1 et la continuité des mèches ; 24-G hors périmètre.
- **Critère visuel :** deux organisations frontales distinctes sans compter sur le lien de cheveux.

### E03 — 19-G / 21-G / 68-G : DIFFÉRENCIER 68-G SEULEMENT
- **19-G et 21-G** : préserver le balayage court compact actuel. Leur **regroupement en un seul choix visible est réservé au LOT 2** ; conserver les deux identifiants et références.
- **68-G** : ajouter une grande mèche frontale localement relevée, avec **deux ou trois retours courbes séparés**, rattachés à une racine commune suivant le crâne.
- Ne pas augmenter globalement le volume du crâne. 19-D, 21-D, 68-D hors périmètre.
- **Critère visuel :** balayage compact versus balayage frontal haut, lisibles sans accessoires.

### E05 — 31-D / 58-D : DIFFÉRENCIER
- **31-D** : préserver le chignon haut et les rouleaux latéraux étagés.
- **58-D** : créer un **grand rouleau frontal central unique**, avec les côtés remontant de façon plus continue vers l'arrière, moins de petits rouleaux séparés.
- Le bandeau masque des jonctions dans l'original : ne dessiner que les raccords justifiables, ne pas inventer sous le bandeau.
- **Dépendance Q04** : 68-D appartient au LOT 4 ; ne pas le modifier ni prétendre avoir résolu le trio.
- **Critère visuel :** une construction frontale identifiable en monochrome, même sans bandeau.

## 3. Exclusions impératives

Aucune modification des autres coiffures, de la biologie, du corps, du visage, du système de génération hors points strictement nécessaires aux quatre cibles, des règles du jeu ou des sauvegardes. Aucun changement de noms/IDs/provenances, aucune suppression de référence, aucune fusion de variantes G/D, aucun regroupement visible de catalogue dans ce lot. Aucun travail sur E08, V08, V12. Aucun changement des accessoires et couleurs comme substitut à la forme. Ne pas intégrer les coiffures 73–81 de E-v2.

Si un changement transversal semble nécessaire, **arrêter et documenter la dépendance** avant de l'effectuer.

## 4. Procédure demandée à Codex *après autorisation ultérieure*

1. Relever branche, commit de base, PR existantes, instructions et fichiers exacts concernés. Ne pas écraser les travaux non fusionnés ; créer une branche de code indépendante à partir de la base adéquate, à confirmer au démarrage.
2. Produire une petite PR de code **en brouillon**, strictement limitée au lot 1, sans fusion.
3. Préserver le rendu de référence et proposer une **preview indépendante sous le dépôt GitHub Pages Microcosme**, accessible par URL directe sur Safari iPad, sans remplacer P5-I6. Donner le lien exact et vérifier sa publication effective avant de le communiquer.
4. Présenter pour chacun des quatre dossiers une planche **original / avant / après**, avec noms/IDs, vue tête et vue entière ; mêmes conditions de tête, corps, orientation, couleur et échelle ; monochrome et sans accessoires pour le jugement de la forme. Prévoir aussi un contrôle avec accessoires, sans les compter comme différence.
5. Permettre une consultation sur iPad en portrait et paysage, sans dépendance à un outil de développement local. Les vues de référence à couvrir sont **178 px**, **300 px** et **70 × 70 px** (dimensions CSS du protocole, non promesse de taille physique).
6. Fournir un journal par dossier : fichiers modifiés, différences attendues, captures, tests, limites, liens PR et preview, régressions éventuelles.
7. Attendre la **validation artistique sur iPad physique** avant tout lot suivant ou fusion. Une CI verte ne vaut pas validation visuelle.

## 5. Vérifications minimales

- Comparaison avant/après de **08, 58-G, 12, 24-D, 19-G, 21-G, 68-G, 31-D, 58-D**.
- Les choix témoins **08, 12, 19-G, 21-G, 31-D** restent conformes aux originaux ; les cibles **58-G, 24-D, 68-G, 58-D** deviennent distinguables en monochrome sans accessoires.
- Aucun recouvrement involontaire des yeux ou des traits du visage ; continuité cheveux/crâne ; pas de coupure des longueurs dans la vue entière.
- Vérification des trois tailles et de plusieurs morphologies de tête disponibles ; comparer au rendu P5-I6.
- Tests existants de non-régression du générateur, du catalogue, des IDs et du rendu ; contrôles Chromium **et WebKit**, puis test manuel Safari sur iPad physique.
- Ne pas inventer de métrique de réussite chiffrée : toute mesure additionnelle doit être définie, calculée et explicitée dans le rapport.
- Si un test échoue ou une source est ambiguë, consigner le blocage et ne pas déclarer le lot terminé.

## 6. Critères de réception et décisions

Le lot est **présentable pour revue** seulement si les quatre dossiers sont consultables dans la preview, que les différences sont expliquées, que les tests et les limites sont documentés, et que la PR est toujours en brouillon. Le lot n'est **validé artistiquement** qu'après accord explicite de l'utilisateur sur iPad. Aucun passage automatique au LOT 2.

**Statut à la rédaction : documentation seule.** Aucune programmation, aucun déploiement de preview, aucune fusion ni autorisation de les lancer.
