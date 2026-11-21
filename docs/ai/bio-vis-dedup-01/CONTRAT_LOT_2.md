# BIO-VIS-DEDUP-01 — Contrat proposé LOT 2 : regroupements visibles

**Statut : préparation documentaire uniquement ; programmation NON autorisée par cette préparation.**
**Références :** PR documentaire #41, [arbitrages](ARBITRAGES_UTILISATEUR.md), [décisions](DECISIONS.md), [planches](PLANCHES.md), [méthode](METHODE.md).
**Prérequis de revue :** lot 1 réalisé dans [PR #42](https://github.com/Thsethse/Microcosme/pull/42), preview indépendante https://thsethse.github.io/Microcosme/preview/bio-vis-dedup-lot-1/ . L'utilisateur a validé artistiquement les quatre corrections du lot 1 avec une réserve non bloquante sur 21-G ; **aucune fusion de #42 n'est déduite de cette validation**.

## 1. Objectif

Éviter six répétitions visibles dans la **liste de choix capillaires** tout en préservant toutes les identités documentaires, la compatibilité des anciennes sélections et les arrangements hors périmètre. **REGROUPER signifie une seule entrée visible principale, pas effacer un ID ni réécrire automatiquement les données de sauvegarde.**

Ne pas confondre catalogue visible, identifiant de référence et moteur de rendu. L'objectif est la lisibilité du choix, pas une réduction prouvée du nombre de styles biologiques ni une modification de leurs sources.

## 2. Les six regroupements autorisés artistiquement

| Dossier | Choix regroupés dans le catalogue | Entrée visible principale | Références préservées et précautions |
| --- | --- | --- | --- |
| **E03** | 19-G et 21-G | **19-G** | Conserver 21-G comme référence/alias documentaire et sélection historique résoluble ; ne pas toucher à 19-D, 21-D ou 68-G. **21-G** : réserve esthétique mineure acceptée par l'utilisateur ; ne pas relancer une retouche graphique. |
| **E04** | 28-G et 59-G | **28-G** | 28-D et 59-D restent indépendants ; garder la provenance de 59-G. |
| **E07** | 47-G et 50-G | **47-G** | Ne pas effacer les informations de couleur/contraste de 50-G ; ne pas en faire une nouvelle coiffure biologique. |
| **E09** | 49-G et 62-D | **49-G** | Conserver 62-D et sa provenance ; ne pas modifier 71-G, dont la différenciation graphique relève du lot 3. Ne pas inférer un regroupement de 49-D/62-G. |
| **E10** | 64-G et 70-G | **64-G** | Garder 70-G comme référence ; versions D indépendantes. |
| **V01** | 56-G et 61-G | **56-G** | Cas **non exactement identique** : 61-G possède deux mèches supplémentaires visibles. L'orientation artistique accepte ce compromis **dans le catalogue**, mais les deux géométries historiques doivent rester disponibles en interne ; ne pas effacer ni réécrire 61-G. 56-D/61-D indépendants (lot 3). |

Les six regroupements sont des paires de **choix/arrangements**, pas des fusions de références complètes. Les sources, IDs, noms historiques, fiches et liens doivent rester traçables. Éviter toute fusion transitive.

## 3. Comportement fonctionnel à concevoir et vérifier

1. La grille ordinaire affiche **une seule entrée principale par paire**. Les autres choix non ciblés gardent leur visibilité et leur ordre relatif, sauf déplacement strictement nécessaire à la déduplication.
2. Chaque entrée principale permet de retrouver dans un panneau de détail ou une table de correspondance les **deux IDs historiques**, leurs variantes et leurs provenances. L'interface ne doit pas laisser croire que la référence secondaire a été détruite.
3. Une sélection ancienne portant sur un ID secondaire doit être **reconnue sans perte**. Ne pas modifier une sauvegarde existante ; documenter si l'interface affiche le principal tout en conservant l'ID secondaire dans les données.
4. Pour V01, si l'ancienne géométrie 61-G reste distincte, son affichage historique doit demeurer possible via son ID, même si l'interface de choix propose 56-G.
5. Le nombre de choix visibles peut diminuer de **six dans la vue ordinaire concernée**, à condition que les six paires y figurent initialement comme entrées distinctes. **Ne pas annoncer un nouveau total sans le mesurer sur la preview et expliquer le périmètre.** Le catalogue de référence conserve ses 72 références et 126 choix documentaires, selon le relevé du lot 1.
6. Les corrections du lot 1 (58-G, 24-D, 68-G, 58-D) doivent rester présentes dans la preview du lot 2 ; elles ne sont pas à reprogrammer.

## 4. Stratégie technique exigée lors d'une future autorisation

- Inspecter l'état réel des branches/PR #41 et #42 et des instructions du dépôt avant toute programmation. Ne jamais présumer que #42 est fusionnée ; utiliser une base **intégrant les corrections du lot 1 sans écraser ni fusionner les branches** (branche de travail dérivée ou composition isolée clairement documentée).
- Créer une **PR de code brouillon indépendante** et une **preview GitHub Pages indépendante**, sans remplacer la preview du lot 1.
- Privilégier une couche explicite de présentation/alias réversible plutôt qu'une suppression ou mutation du catalogue canonique. Si les APIs ne permettent pas de préserver l'ID secondaire et son rendu, documenter le blocage et demander un arbitrage avant d'aller plus loin.
- Ne modifier ni le moteur biologique, ni le corps, ni les accessoires/couleurs, ni le jeu/sauvegardes, ni les coiffures des lots 3 à 5.
- Ne pas fusionner les PR, ni lancer le lot 3, sans validation distincte.

## 5. Preview indépendante et tests iPad

La preview doit présenter :
- Une grille **AVANT / APRÈS** du catalogue visible, avec les six regroupements identifiés et le principal clairement nommé.
- Un contrôle par paire ouvrant les **deux références historiques** et leur rendu individuel (indispensable pour V01).
- Une démonstration de la sélection d'un ID secondaire préexistant, avec indication claire de l'ID conservé et de l'entrée principale montrée.
- Une vue des quatre corrections graphiques du lot 1 pour vérifier leur maintien.
- Une consultation tactile en Safari iPad, portrait et paysage, sans téléchargement local ni outil de développement.

Tests minimaux :
- Six paires : une entrée visible chacune dans le sélecteur ordinaire, deux identifiants documentaires conservés.
- 72 références et 126 choix documentaires inchangés si la base est identique à celle du lot 1 ; vérifier le total réel et signaler tout écart.
- Tous les choix hors six paires restent accessibles et non modifiés ; G/D non visés indépendants.
- ID secondaire : aller-retour de sélection sans perte de l'ID ; géométrie historique 61-G accessible par ID.
- Corrections du lot 1 non régressées, notamment 68-G et 58-D.
- Tests de non-régression du dépôt et de la preview sous Chromium et WebKit, formats portrait/paysage/étroit ; essai final **sur iPad physique** par l'utilisateur.
- Journal de résultats et liens exacts PR/preview, CI et limites. Tests automatisés réussis ≠ validation artistique.

## 6. Réception et autorisations

Le lot 2 sera prêt à revoir lorsque les six regroupements seront visibles dans une preview publiée et testée, les IDs historiques préservés et les tests documentés. La **validation artistique de l'utilisateur** reste nécessaire.

**Ce document est un contrat préparatoire, non un feu vert Codex.** Ne programmer, déployer ou fusionner aucune modification sur la seule base de sa création.
