# BIO-VIS-P2 — Construction capillaire vectorielle

Preview : https://thsethse.github.io/Microcosme/preview/bio-vis-p2/

Branche indépendante `codex/bio-vis-p2`, base main `6c7e9d7`. Trois coiffures du catalogue V1 sur trois têtes de P1 : allongée, ronde, à bajoues. Neuf combinaisons visibles ensemble, sélection tactile, corps entier / tête agrandie / petite silhouette et retour direct vers P1.

## Référence artistique contrôlée avant programmation

Chemin exact : `docs/ai/visual-references/a_clean_infographic_character_design_sheet_in_warm.png`.

Seul nouveau catalogue capillaire candidat dans `docs/ai/` sur main ; son contenu montre le titre « Microcosme — Catalogue capillaire (V1) ». PNG RGB 1536 × 1024, 1697961 octets, vérifié avec Pillow (`verify` puis décodage complet), examiné visuellement. SHA-256 : `06dec2e59f34f195363cf482d51cae34808d4d3b3ff1e8863e8ba217bf571932`. `reference.json` documente la source. Aucun fichier source artistique modifié, aucune ancienne planche pixel art utilisée.

Les modèles sélectionnés sont **03 · Classique**, **04 · Carré court** et **08 · Boucles courtes**. « Classique courte » désigne ici le modèle 03 demandé par la mission ; le modèle 02 · Courte n'est pas implémenté. La planche originale P1 et la peau/les traits de P1 restent la base stylistique des personnages.

Aucun AGENTS.md trouvé dans les arbres consultés. Branches et PR ouvertes examinées ; PR P1 #27 conservée ouverte, non fusionnée. START_HERE, PROJECT_STATE, DECISION_REGISTER et WORK_LOG lus sur `docs/llm-project-memory`. L'autorisation de cette mission concerne uniquement l'expérimentation P2.

## Construction et adaptation

`hair-model.mjs` contient les identifiants, noms, numéros de catalogue, couleurs, textures et descriptions des trois modèles. L'état public se limite à `{cut, head}` : changer la morphologie conserve la coupe. Les données peuvent être enrichies ensuite de couleurs/variantes, sans créer ici les douze coiffures.

Les repères sont calculés depuis la tête de P1 : sommet, front, tempes, côtés du crâne, joues/bajoues, base et nuque. Le volume supérieur utilise le crâne ; les côtés utilisent séparément le dégagement des joues ; les longueurs suivent la base. Il n'y a pas de transformation globale `scaleX`. Les proportions locales des mèches restent liées à la coupe, au lieu de copier la silhouette complète d'une autre tête.

`hair-render.mjs` produit des courbes Bézier et volumes vectoriels organisés selon un ordre explicite :

1. `back` : masse arrière avant le visage ; le visage en masque la partie centrale.
2. `face` : peau et traits P1 sans ancienne coiffure.
3. `volume` : volume supérieur et bord d'implantation suivant le front/tempes.
4. `front` : balayage classique, panneaux du carré ou mèches bouclées au front.
5. `sides` : côtés adaptés aux joues, lorsqu'ils sont nécessaires ; les côtés courts de la classique appartiennent au volume supérieur.
6. `texture` : quelques lignes directionnelles ou spirales larges, sans image superposée.

La même chaîne `headGroup` est réutilisée exactement dans les trois tailles et les cases de galerie. Les repères turquoise et le sélecteur de couche servent à inspecter cette construction. L'isolation montre la couche sélectionnée sur le visage ; ce mode incomplet n'est pas le rendu artistique final.

Les deux modules `base/` sont des copies **octet pour octet** du snapshot publié P1 à la révision de base, contrôlées par test. Ils stabilisent cette étude sans toucher à P1. Toute mise à jour ultérieure de ce socle devra être explicite et vérifiée.

## Vérifications

Depuis la racine, `npm ci` puis :

```sh
node --test bio-vis-p2/model.test.mjs
npx playwright install --with-deps chromium webkit
node bio-vis-p2/browser.test.cjs
node bio-vis-p2/p1-regression.test.cjs
npm test
# Vérification de la vraie preview :
BASE_URL=https://thsethse.github.io/Microcosme/preview/bio-vis-p2/ node bio-vis-p2/browser.test.cjs
```

Les scripts navigateur démarrent et arrêtent leurs serveurs locaux. `CAPTURE_DIR` active des captures de contrôle.

Résultats locaux :

- **5 tests Node réussis** : intégrité du catalogue et copies P1, trois coupes/trois têtes, neuf géométries distinctes et déterministes sans NaN, stabilité du paramètre de coupe, adaptation des zones, ordre d'occlusion et isolation.
- **Chromium et WebKit P2 réussis** : neuf sélections tactiles, identité exacte du groupe SVG aux trois tailles, géométries dans leur viewBox avec marge, absence de formes capillaires remplies devant des points des yeux et sourcils, inspection des couches, quatre formats (820×1180, 1180×820, 768×1024, 390×844) sans débordement, chargement/dimensions du catalogue, interactions hors ligne après chargement et retour P1. Les contrôles d'occlusion échantillonnent des points du visage ; ils ne certifient pas tous ses pixels.
- **Parcours P1 complet Chromium/WebKit réussi** : six presets, contrôles, 240 cas géométriques, identité, planche, bonds/pause, réduction des mouvements, sauvegarde sentinelle inchangée et hors ligne. Le script de P1 est repris avec uniquement le chemin de départ adapté au snapshot publié.
- **35 tests existants du jeu réussis** ; CI existante inchangée.

WebKit Linux avec interaction tactile ne vaut pas une vérification sur iPad physique. L'environnement local réutilise les bibliothèques WebKit et le lanceur ajusté des études précédentes ; la CI utilise l'installation Playwright standard. La vérification publique passe par le transport HTTPS curl avec la CA du proxy Cloud lorsque le navigateur ne reconnaît pas cette CA ; validation TLS conservée.

## Limites et validation

La construction est **frontale seulement**. Les volumes arrière sont des couches d'occlusion vues de face, pas un modèle 3D ni des vues de profil/dos. Le catalogue contient ces vues, mais ce lot n'en développe pas la projection. Seules les trois morphologies demandées et les trois coiffures sont exposées. Pas de réglages biologiques, pousse, âge, physique, coiffage libre, douze coupes ou catalogue utilisateur.

Les couleurs sont fixées par modèle ; les variantes de couleur/texture futures ne sont pas développées. Les contours réguliers et les spirales sont une interprétation vectorielle contrôlée ; la fidélité artistique au catalogue V1 reste soumise à validation humaine après examen de la preview. Les vérifications techniques ne valident pas la qualité artistique.

Aucun fichier de P1, moteur du jeu, sauvegarde ni catalogue original modifié. Aucun stockage utilisé. Contrôles utilisables hors ligne après chargement ; pas de garantie de rechargement hors ligne.

## Fichiers ajoutés et publication

- `.github/workflows/bio-vis-p2.yml`
- `bio-vis-p2/index.html`
- `bio-vis-p2/style.css`
- `bio-vis-p2/app.mjs`
- `bio-vis-p2/hair-model.mjs`
- `bio-vis-p2/hair-render.mjs`
- `bio-vis-p2/base/model.mjs`
- `bio-vis-p2/base/render.mjs`
- `bio-vis-p2/reference.json`
- `bio-vis-p2/model.test.mjs`
- `bio-vis-p2/browser.test.cjs`
- `bio-vis-p2/p1-regression.test.cjs`
- `bio-vis-p2/README.md`

Pages reste sur `main:/`. Comme les autres études, un commit de publication séparé copie uniquement les ressources d'exécution, le README et la provenance dans le nouveau dossier `preview/bio-vis-p2/`. Les previews P1 et antérieures ne sont pas touchées. Aucune fusion de PR et aucune modification de la configuration Pages. La PR P2 reste en brouillon, en attente de validation artistique.
