# BIO-VIS-P1 — Les habitants

Prototype autonome de l'issue #26. Branche `codex/bio-vis-p1`, base `main` au SHA `c218e9fd90dee4bf4b1e2dcee010c36765c48cbc`. Aucun fichier du jeu ni de ses sauvegardes modifié.

Preview : https://thsethse.github.io/Microcosme/preview/bio-vis-p1/

## Référence originale vérifiée — validation artistique en attente

Le PNG déposé par l'utilisateur sur main est accessible au nom réel `docs/BIO-VIS-P1-planche-originale.png..png` (deux points avant la dernière extension, à la différence du chemin annoncé). Il provient du commit `100aae7705335d2de283ff4e4b17f19ef8c03c18`. Son original reste inchangé.

Copie exacte au chemin prévu : `docs/ai/visual-references/BIO-VIS-P1-planche-originale.png`.

- PNG RGBA 8 bits, 2480 × 3508 pixels, 942003 octets.
- SHA-256 : `ddb6a8515fcedd0bdc4493bdc3fe3afb32322706012186f481efa764875c3e06`.
- Signature PNG, structure/chunks, tous les CRC, flux IDAT décompressé et filtres de chaque ligne vérifiés. Vérification et décodage complet par Pillow exécutés localement. Un test Node sans dépendance externe reproduit les contrôles structurels, CRC, dimensions, flux raster et empreinte.

La planche a été examinée dans son format original. La preview permet de l'afficher et de l'ouvrir en grand. Les aplats sable `#dbbf88`, contour `#c2a873` et couleurs principales de cheveux sont échantillonnés parmi ses pixels opaques ; `reference.json` enregistre la provenance et les valeurs. Les contours sont renforcés, les boucles forment désormais une calotte dense avec frange, le regard incliné a une forme angulaire et Rose dispose d'une bouche pincée. Les ancres et le dessin de tête restent communs aux différentes échelles.

Aucune planche remplacée ou régénérée, aucun portrait réaliste distinct ni pixel art. Les personnages sont toujours dessinés par code. L'archivage manquant est résolu ; la validation de la fidélité artistique appartient toujours à l'utilisateur. Les courbes régulières et les détails simplifiés ne reproduisent pas exactement le trait manuscrit.

## Essayer sur iPad

1. Ouvrir « Comparer avec la planche originale » pour consulter la source, puis toucher l'un des six habitants de la galerie (Émile est le point de départ initial).
2. Choisir la silhouette et la tête, puis varier ventre, épaules et hanches.
3. Choisir yeux, nez, bouche, coiffure, buste et âge visuel.
4. Comparer corps et visage agrandi ; la vue divine reprend aussi le personnage modifié, marqué d'un trait ocre au sol.
5. Lancer les petits bonds, puis mettre en pause. Le mouvement reste arrêté au chargement, suit la préférence de réduction des mouvements et s'arrête lorsque la page est masquée.

Réinitialiser restaure le preset actuellement sélectionné. Les modifications ne sont pas persistées. Tous les personnages sont adultes ; « ancien » est un effet graphique, pas une simulation d'âge biologique. Aucun profil, enfant ou générateur d'hérédité implémenté.

## Ce qui est réellement modifiable

| Contrôle | Effet réel |
|---|---|
| Silhouette | Six familles paramétriques : T, poire, ronde, colonne, trapèze, sablier |
| Ventre | Déplacement des points latéraux du milieu du corps, borné à 0,72–1,30 |
| Épaules / hanches | Déplacement des points supérieurs / inférieurs, borné à 0,72–1,25 |
| Tête | Cinq contours ; les traits suivent les coordonnées locales de chaque tête |
| Yeux | Ouverture, paupière et inclinaison des sourcils |
| Nez / bouche | Petites courbes ou aplats ancrés dans la même tête |
| Coiffure | Cinq compositions de courbes : courte, carré, boucles, mèche, sans cheveux |
| Buste | Courbes, pectoraux ou tracé discret ; détails ajustés à la largeur du corps |
| Âge visuel | Sillons, plis et cheveux gris, sans changement d'identité |

`model.mjs` contient données, bornes, presets, géométrie et pose des bonds ; `render.mjs` dessine les primitives SVG. `headMarkup` est réutilisé à l'identique à toutes les échelles : corps, fiche et vue divine. Le rendu est déterministe, sans hasard ni sprite complet prédessiné ; les familles de silhouettes sont des chemins de base dont les points restent paramétriques. Les boucles sont un arrangement déterministe de petits tracés.

`app.mjs` gère uniquement le DOM et l'animation. Pas de framework, de dépendance graphique, de ressource hors du dépôt, de filtre, de dégradé, de Canvas ou de stockage. Chemins relatifs compatibles avec la sous-page GitHub Pages. Après chargement, les contrôles fonctionnent sans réseau ; le rechargement hors ligne n'est pas garanti.

## Ce qui est simulé et les limites

Les bonds sont un aller-retour décoratif sur une ligne, sans terrain, destination, collision, décision autonome ou animation anatomique. Le rythme et la hauteur sont des conventions graphiques, pas des paramètres biologiques. Les corps ne sont pas une anatomie exhaustive ; les courbes de buste et marques basses restent schématiques. Les expressions et coiffures sont un petit vocabulaire combinable, pas des modèles biologiques. Les contours réguliers ne reproduisent pas exactement le geste manuscrit de la planche. Aucun moteur biologique ou format de sauvegarde modifié ou proposé pour intégration.

## Vérifications exécutables

```sh
npm ci
node --test bio-vis-p1/*.test.mjs
npx playwright install --with-deps chromium webkit
node bio-vis-p1/browser.test.cjs
npm test
# Vérifier la vraie preview une fois publiée :
BASE_URL=https://thsethse.github.io/Microcosme/preview/bio-vis-p1/ node bio-vis-p1/browser.test.cjs
```

Le test navigateur démarre et arrête son serveur statique local. `BASE_URL` permet de viser la preview publique. `CAPTURE_DIR` active des captures de vérification.

- Huit tests Node : validité et intégrité du PNG original, palette issue de la source ; normalisation/entrées invalides ; 240 combinaisons silhouette × tête × bornes de largeur ; ordre et symétrie des ancres ; effets des trois largeurs ; distinction des variantes ; réutilisation exacte de la tête ; options du visage ; déterminisme et bornes des bonds.
- Chromium et WebKit : interactions tactiles, tous les contrôles et presets, identité de tête aux trois échelles, bounding boxes SVG (240 combinaisons et toutes coiffures/têtes), absence de découpe du cadre, ouverture et dimensions naturelles du PNG original, mouvement/pause, réduction des mouvements, absence de débordement aux formats 820×1180, 1180×820, 768×1024, 390×844, absence d'erreurs et de ressources manquantes, interactions hors ligne après chargement, préservation d'une sentinelle sous la clé de sauvegarde du jeu.
- Les 35 tests Node existants du jeu restent verts. La CI existante vérifie aussi sa non-régression navigateur.

Tests locaux Node, Chromium et WebKit réussis. WebKit Linux émulé n'est pas Safari sur un iPad physique. Dans l'environnement Cloud, les bibliothèques WebKit extraites pour le précédent prototype et son lanceur local ont été réutilisés, sans changement système ni modification correspondante du dépôt. La CI installe Playwright normalement.

## Inspection du dépôt et publication

Aucun `AGENTS.md` sur la base inspectée. `docs/ai/START_HERE.md` et `PROJECT_STATE.md` n'existent pas sur main ; leurs versions sur `docs/llm-project-memory` ont été consultées, avec le registre et le journal. Les anciennes BIO-DA-01/02 ont été lues sur leur branche documentaire ; leur orientation pixel art ne remplace pas la demande explicite de #26.

Pages est configuré sur `main:/`. Selon les publications existantes, les fichiers de cette étude sont copiés sous `preview/bio-vis-p1/` par un commit de publication isolé sur main. La copie canonique du PNG est également publiée sous `docs/ai/visual-references/`, sans supprimer ni modifier le fichier source déposé par l’utilisateur. Aucune fusion de PR ni changement de configuration Pages. PR de code indépendante en brouillon, en attente de comparaison artistique par l'utilisateur ; la planche est désormais archivée.
