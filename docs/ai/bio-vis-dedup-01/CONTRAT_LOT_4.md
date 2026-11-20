# BIO-VIS-DEDUP-01 — LOT 4 : contrat conditionnel de gain visuel

**Statut : préparation documentaire seulement. Aucun code, aucune PR de code, aucune fusion ni lot 5 autorisés.**

## Principe de décision

Le lot 4 n'est justifié **que si le rendu gagne réellement en lisibilité à la taille du catalogue**, notamment 178 px et miniature 70×70 px, sans accessoires ni variation de couleur. Ne pas poursuivre des micro-corrections dont le gain n'est visible qu'à 300 px ou en zoom. La comparaison doit être faite avec le rendu **après les lots 1–3**, et non avec la base historique seule.

Les lots 1, 2 et 3 ont été validés artistiquement par l'utilisateur ; cette validation ne vaut pas fusion des PR #42, #43, #44.

Sources : [arbitrages](ARBITRAGES_UTILISATEUR.md), [décisions](DECISIONS.md), planches [Q04](planches/Q04.png), [V07](planches/V07.png), [V11](planches/V11.png), et rapport du lot 1 pour 58-D.

## Dossiers à évaluer

### Q04 — 31-D / 58-D / 68-D

Le lot 1 a **déjà différencié 58-D de 31-D** par un grand rouleau frontal et des côtés relevés. Ne pas refaire cette correction. Examiner si **68-D**, dont le chignon lisse diffère mais dont les mèches/rouleaux sont proches des anciens témoins, reste insuffisamment distinct **dans la version actuelle**. Si oui, viser un arrangement frontal propre à 68-D, lisible en miniature et conforme à la source. Si la différence des trois choix est déjà suffisante, **classer Q04 sans modification**. Ne pas inventer les raccords sous le bandeau.

### V07 — 53-G / 55-G / 55-D

Les compositions sont déjà distinctes : 53-G cinq rangées/deux retombées, 55-G sept rangées/six nattes, 55-D neuf rangées/chignon de spirales/quatre brins. Examiner la **lisibilité des attaches et des masses** à 178 et 70 px. Ne corriger que si la silhouette ou l'organisation des racines est effectivement ambiguë. Pas de multiplication de micro-tresses invisibles ni de suppression des différences existantes.

### V11 — 27-D / 30-G / 30-D

Les coiffures sont déjà distinctes : 27-D halo/ribbon ; 30-G rouleaux latéraux et boucles ; 30-D ajoute un chignon. Examiner si le **type et l'organisation des boucles** sont réellement confondus en taille de catalogue. Corriger seulement la composition nécessaire à la reconnaissance, pas la longueur pour elle-même. Préserver les variantes et les attaches.

## Étape préalable obligatoire : audit d'utilité

Avant de programmer des modifications, établir une planche comparative sur la base combinée lots 1–3, à tailles 300/178/70 px, mêmes paramètres, sans accessoires ni contraste. Pour chaque dossier, fournir :

1. Ce qui est déjà perceptiblement distinct.
2. Ce qui reste ambigu **à 178 px et 70 px**.
3. La correction minimale envisageable, avec un avant/après ou croquis si elle est techniquement justifiée.
4. Une conclusion **CORRIGER** ou **CONSERVER TEL QUEL**, motivée par le gain visuel attendu.

**Arrêter le lot si les trois dossiers sont déjà assez lisibles**. Ne pas créer artificiellement des tâches pour remplir le lot. En cas d'ambiguïté de source, conserver le rendu plutôt qu'inventer.

## Conditions d'une future programmation — autorisation distincte requise

Si l'audit démontre un gain suffisant, demander l'accord de l'utilisateur sur les seules cibles retenues. Ensuite seulement : PR de code brouillon indépendante, preview Pages `preview/bio-vis-dedup-lot-4/`, comparaison original/avant/après, tests Chromium/WebKit, non-régression de tous les autres choix, préservation de 72 références / 126 choix historiques / six regroupements du lot 2, compatibilité iPad physique, aucune fusion.

Ne modifier ni moteur, ni sauvegardes, ni accessoires, ni corps, ni choix hors cibles. Ne pas lancer le lot 5. **Ce document ne constitue pas un feu vert Codex.**
