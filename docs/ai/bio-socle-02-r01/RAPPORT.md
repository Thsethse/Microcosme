# Microcosme · BIO-SOCLE-02-R01

## Livraison

Branche `codex/bio-socle-02-r01` issue de `docs/bio-socle-01` à `ee2564f0b87be5cb91d2cab94a0bb3709c733c78`.

- [Preview de validation](https://thsethse.github.io/Microcosme/preview/bio-socle-02-r01/)
- [Contrat technique et correspondances](CONTRAT-TECHNIQUE.md)
- [Référence artistique BIO-CORPS-06-R02](https://thsethse.github.io/Microcosme/preview/bio-corps-06-r02/)

## Implémentation

- L’archive de travail réutilise le document d’apparence actif et sauvegarde les réglages mémorisés des bases inactives. Les préférences latentes restent dans les données des éditeurs et des bases concernées. L’import remplace la mémoire locale de l’atelier. Les archives v1–v22 passent par leur lecteur existant. Les commandes historiques retirées du thorax et du nombril sont conservées dans le document d’origine joint lorsqu’elles existent.
- Le document individuel possède une identité, des caractéristiques biologiques, un état physique, des marques acquises, des modifications volontaires, des provenances déclarées et une métadonnée de génération. Deux témoins explicites F et H démontrent l’aller-retour sans nouveau tirage. Le format, la génération et le rendu ont chacun leur version. Les anciens v22 ont une provenance graphique indéterminable et gardent la valeur de pousse à la précision d’origine.
- Le profil de rendu partage les cadrages avec l’atelier et appelle `character`, le compositeur SVG existant. Les solveurs des deux bases, du visage, des cheveux et palettes, la pilosité en pointillé et les finitions sont repris à partir de `c18aa4d54873f19186d6c1af7e17aa22e566dda1`. Le code des solveurs et du compositeur reste identique à la référence. Chaque SVG obtient son espace d’identifiants.
- La preview assemble l’atelier existant et un panneau de lecture des deux témoins. Le build sous `preview/bio-socle-02-r01/` produit HTML, CSS, un bundle identifié par empreinte et un manifeste de provenance. La distribution statique prévue sur GitHub Pages suit le précédent R02 et est indépendante de la PR.

## Validation sur Safari iPad

1. Ouvrir la preview, puis **Atelier du thorax**. Toucher **Poitrine · F adulte**. Augmenter le volume et vérifier que six commandes sont utilisables. Modifier une largeur, puis ramener le volume à zéro pour mettre la valeur en réserve.
2. Toucher **Pectoraux · H adulte**, augmenter le volume, vérifier les cinq commandes, puis régler une largeur différente. Passer de H à F puis de F à H et retrouver les réglages. En F, remonter le volume pour réactiver le réglage latent.
3. Rester en H, ouvrir **Archive H/F**, exporter et copier le JSON dans Notes. Fermer l’onglet, rouvrir la preview dans un nouvel onglet, coller le JSON et importer. Vérifier d’abord H, puis F, y compris la valeur latente. Refaire en exportant depuis F.
4. Ouvrir **Habitants témoins** et afficher F puis H. Vérifier que les trois représentations correspondent au même habitant et que l’identité change lorsque le témoin change. Sur H, noter l’identité et consulter ses caractéristiques, puis exporter le JSON dans Notes. Fermer, rouvrir, coller et restaurer. Vérifier le retour de l’identité H, des trois vues et du message d’égalité des caractéristiques.
5. Coller un JSON tronqué dans le panneau habitant et tenter la restauration. Vérifier le diagnostic et la conservation de l’habitant affiché.

## Résultats et limites

Les vérifications Node couvrent le rejeu historique, l’égalité des documents, les données latentes, la validation, l’absence de mutation, la cohérence des trois échelles, l’isolation SVG et la comparaison des appels au moteur R02. La comparaison porte sur les deux configurations explicites et les régressions couvertes par les suites historiques. Les réserves thoraciques précédemment reportées restent inscrites dans l’audit de convergence.

La vérification sur iPad physique relève de la recette du porteur. Les mesures Safari iPad et l’arbitrage du support de stockage restent ouverts.

## Prérequis pour BIO-SOCLE-03

- Définir la provenance des données du premier générateur, son contrat de graine, de version et de paramètres ainsi que le traitement des combinaisons inadmissibles.
- Arbitrer les distributions et dépendances conditionnelles des premières caractéristiques ainsi que les correspondances encore ouvertes, notamment la pigmentation cutanée globale et les propriétés naturelles représentées aujourd’hui par les gabarits capillaires.
- Valider les allers-retours et les choix de projection du présent socle sur l’iPad de référence avant de prendre l’étape de génération comme base de recette.
