# Microcosme · BIO-SOCLE-02-R01

## Livraison

Branche `codex/bio-socle-02-r01` issue de `docs/bio-socle-01` à `ee2564f0b87be5cb91d2cab94a0bb3709c733c78`.

- [Preview publique sur GitHub Pages](https://thsethse.github.io/Microcosme/preview/bio-socle-02-r01/)
- [Contrat technique et correspondances](CONTRAT-TECHNIQUE.md)
- [Référence artistique BIO-CORPS-06-R02](https://thsethse.github.io/Microcosme/preview/bio-corps-06-r02/)

## Implémentation

- L’archive de travail réutilise le document d’apparence actif et sauvegarde les réglages mémorisés des bases inactives. Les préférences latentes restent dans les données des éditeurs et des bases concernées. L’import remplace la mémoire locale de l’atelier. Les archives v1–v22 passent par leur lecteur existant. Les commandes historiques retirées du thorax et du nombril sont conservées dans le document d’origine joint lorsqu’elles existent.
- Le document individuel possède une identité, des caractéristiques biologiques, un état physique, des marques acquises, des modifications volontaires, des provenances déclarées et une métadonnée de génération. Deux témoins explicites F et H démontrent l’aller-retour sans nouveau tirage. Le format, la génération et le rendu ont chacun leur version. Les anciens v22 ont une provenance graphique indéterminable et gardent la valeur de pousse à la précision d’origine.
- Le profil de rendu partage les cadrages avec l’atelier et appelle `character`, le compositeur SVG existant. Les solveurs des deux bases, du visage, des cheveux et palettes, la pilosité en pointillé et les finitions sont repris à partir de `c18aa4d54873f19186d6c1af7e17aa22e566dda1`. Le code des solveurs et du compositeur reste identique à la référence. Chaque SVG obtient son espace d’identifiants.
- La preview assemble l’atelier existant et un panneau de lecture des deux témoins. Le build sous `preview/bio-socle-02-r01/` produit HTML, CSS, un bundle identifié par empreinte et un manifeste de provenance. La distribution statique a été publiée séparément sur GitHub Pages par le commit `e74e218`. L’URL directe répond HTTP 200. Les quatre fichiers publics sont identiques aux fichiers de la distribution testée, dont le manifeste identifie la révision source `f69167e`. La PR [#78](https://github.com/Thsethse/Microcosme/pull/78) est ouverte en brouillon dans l’attente de la recette sur iPad.

## Validation sur Safari iPad

Les réglages modifiables de cette recette se trouvent dans **Atelier du thorax**. Les habitants témoins sont prédéfinis et consultables en lecture seule. Le champ **Archive de l’habitant** sert à copier ou à coller le JSON pour l’export et la restauration.

1. Ouvrir **Atelier du thorax**, puis toucher **Poitrine · F adulte**. Augmenter **Volume**, vérifier les six commandes, modifier **Largeur** et noter sa valeur. Ramener **Volume** à zéro pour mettre la largeur en réserve.
2. Toucher **Pectoraux · H adulte**, augmenter **Volume musculaire**, vérifier les cinq commandes et donner à **Largeur** une autre valeur. Alterner H et F. En F, remonter **Volume** pour vérifier la largeur mémorisée, puis le remettre à zéro.
3. Depuis H, ouvrir **Archive H/F**, toucher **Exporter l’apparence**, puis copier le contenu du champ **Archive JSON** dans Notes. Fermer l’onglet, rouvrir la preview, ouvrir **Archive H/F**, coller le JSON dans **Archive JSON** et toucher **Importer l’apparence**. Vérifier H, puis F en remontant **Volume** pour retrouver sa largeur. Refaire le parcours en exportant depuis F.
4. Ouvrir **Habitants témoins**. Dans le sélecteur **Habitant**, choisir **Témoin F** et toucher **Afficher le témoin**. Vérifier le **Portrait**, le **Corps / pion** et la **Miniature**. Choisir **Témoin H** et toucher à nouveau **Afficher le témoin**. Noter l’**Identité affichée** et ouvrir **Caractéristiques canoniques** pour consulter ses données.
5. Toucher **Exporter l’habitant** et copier le JSON du champ **Archive de l’habitant** dans Notes. Fermer l’onglet, rouvrir la preview et revenir à **Habitants témoins**. Coller le JSON tel quel dans **Archive de l’habitant** et toucher **Restaurer l’habitant**. Vérifier le retour de l’identité H, des trois vues et du message confirmant l’égalité des caractéristiques.
6. Pour tester le diagnostic, coller uniquement `{` dans **Archive de l’habitant** et toucher **Restaurer l’habitant**. Vérifier que le diagnostic s’affiche et que l’habitant courant reste visible.

## Résultats et limites

- **Tests automatisés sous Node 24.22.3.** Les 171 tests existants de l’atelier et les 8 tests du socle passent. Les nouveaux tests couvrent le rejeu historique, les données latentes, l’égalité des sauvegardes, la validation, l’absence de mutation, les trois échelles et l’isolation SVG. Les 35 tests du jeu v0.9 passent.
- **Simulations tactiles.** La recette dédiée passe sous Chromium 151 et WebKit 26.5 en profil iPad Mini simulé. Elle ouvre les commandes thoraciques au toucher, réinjecte des valeurs fractionnaires exactes, ferme le contexte puis restaure les deux bases. La sauvegarde de l’habitant H rétablit son identité et ses trois SVG. La suite navigateur du jeu et la suite historique de corrections de l’atelier passent avec les deux moteurs.
- **Contrôle graphique.** Les captures des trois représentations ont été inspectées. La comparaison automatisée avec le bundle statique publié R02 donne six SVG identiques, pour deux habitants et trois échelles, après normalisation des identifiants d’instance. Les réserves thoraciques précédemment reportées restent inscrites dans l’audit de convergence.
- **Appareil physique.** La vérification et les mesures Safari iPad relèvent de la recette du porteur. L’arbitrage du support de stockage reste ouvert.

## Prérequis pour BIO-SOCLE-03

- Définir la provenance des données du premier générateur, son contrat de graine, de version et de paramètres ainsi que le traitement des combinaisons inadmissibles.
- Arbitrer les distributions et dépendances conditionnelles des premières caractéristiques ainsi que les correspondances encore ouvertes, notamment la pigmentation cutanée globale et les propriétés naturelles représentées aujourd’hui par les gabarits capillaires.
- Valider les allers-retours et les choix de projection du présent socle sur l’iPad de référence avant de prendre l’étape de génération comme base de recette.
