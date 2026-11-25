# Recette de BIO-MAQUILLAGE-01

La branche `docs/bio-maquillage-01` contient le correctif `c13c722` de BIO-CICATRICES-01-R1. Git confirme cette filiation. La preview reprend son démarrage autonome avec un script différé et versionné par empreinte, compilé pour Safari 15.4. La publication initiale `1796315` crée le dossier `preview/bio-maquillage-01/`. Le déploiement final `4f51b99` sert les 36 fichiers de la preview issus de `70ed8ae`. [PR #57](https://github.com/Thsethse/Microcosme/pull/57) · [Déploiement Pages](https://github.com/Thsethse/Microcosme/actions/runs/45593397943) · [Preview](https://thsethse.github.io/Microcosme/preview/bio-maquillage-01/)

Recette du 25 novembre 2026 sous Node 24.22.3, Chromium 151.0.7922.34 et WebKit 26.5. La distribution locale et l’URL publique ont été testées avec un profil tactile iPad. Le manifeste public identifie le script `atelier-4bc7fbe90e6425cf.js`. Les 366 ressources déclarées ont été vérifiées par SHA-256, dont 331 ressources héritées. [Manifeste public](https://thsethse.github.io/Microcosme/preview/bio-maquillage-01/version.json) · [Recette locale](recette-locale.json) · [Recette publique](recette-publique.json)

## Les dix contrôles du contrat

| Contrôle | Vérification |
| --- | --- |
| T1 · Historique | Comparaison SVG exacte contre le moteur archivé, avec et sans réglages hérités, pour trois morphologies aux trois échelles. Relecture à l’identique des documents v1 à v9. |
| T2 · Lèvres | Couverture et contour testés sur la bouche historique et sur des lèvres personnalisées. La couture reste lisible. Le contour s’adapte au volume de chaque lèvre. |
| T3 · Paupières et eyeliner | Les tracés suivent l’ouverture historique et les huit formes personnalisées. Les cils naturels et les sourcils restent présents. Le bord du globe est réservé. |
| T4 · Joues | Les curseurs de position, d’étendue, de diffusion et d’intensité modifient le rendu. Le dégradé atteint une opacité nulle à son bord. |
| T5 · Peintures | Douze primitives rendues. Contrôle de l’ordre, du déplacement tactile, du miroir, de ses copies et de la superposition. |
| T6 · Palette et planche | Correspondance exacte des 32 valeurs hexadécimales. Contrôle des sept cas, des quatre teintes de peau, de plusieurs morphologies et des trois tailles historiques. Un détail agrandi accompagne chaque cas. [Capture de la planche](planche-maquillage.webp) · [Planche interactive](https://thsethse.github.io/Microcosme/preview/bio-maquillage-01/#planche-maquillage) |
| T7 · Invariants | Couche indépendante au-dessus des marques et des cicatrices et sous la pilosité. Contrôle des réserves du globe et du centre des narines. Après retrait, les trois SVG et leurs rasters correspondent exactement aux captures réalisées avant l’ajout du maquillage. |
| T8 · Persistance | Relecture v10 après rechargement, échange JSON de composition, bibliothèque locale, transfert sur une autre morphologie et régénération avec la même graine. Le retrait conserve les choix latents. |
| T9 · Compatibilité | Node et deux moteurs de navigateur avec profil tactile iPad. Matrice Node de 162 rendus sur six corps, trois catégories existantes, trois morphologies et trois échelles. L’atelier a aussi été testé en paysage iPad, en portrait iPad et à 390 px de large. La zone de placement tactile tient dans sa colonne et sa commande mesure 44 px. Le maquillage utilise la géométrie reçue quel que soit l’âge indiqué. L’atelier hérité expose six silhouettes et aucun modèle enfant distinct à vérifier. |
| T10 · URL publiée | Démarrage de la révision publique à froid, listes alimentées, 24 curseurs de maquillage, huit d’yeux et onze de cicatrices. Six portraits visibles à 300, 178 et 70 px. Activation des modules hérités et des cinq familles. Diagnostic visible puis reprise après une réponse 503 simulée du script de démarrage. |

## Suites héritées

Node a validé 35 tests du jeu v0.9, 97 tests des ateliers hérités et 9 tests dédiés au maquillage. Les vérifications sous Chromium et WebKit couvrent le jeu v0.9, les yeux avant les corrections A/B/C, les corrections A/B/C, les palettes, les iris, les détails, les sourcils, la bouche, le nez, la pilosité, les marques, les cicatrices et leur démarrage autonome R1. Les suites originales des lots de coiffures 1, 2 et 3 passent également sous Node (19 tests), Chromium et WebKit.

L’archive indépendante du jeu v0.8 a également été testée. Ses 31 tests Node passent. Son script navigateur échoue dans les deux moteurs à la ligne 90. Il lit la clé `microcosme-v03`, alors que le stockage historique de cette archive utilise `microcosme-preview-v08`. Un essai isolé avec la clé actuelle atteint ensuite une autre assertion de sauvegarde historique à la ligne 293. Les fichiers v0.8 correspondent à ceux de la branche de départ. [Script v0.8](../../../preview-v08/tests/browser.cjs) · [Stockage v0.8](../../../preview-v08/storage.js)

La validation de l’apparence et des interactions sur iPad physique revient au porteur du projet.

## Reproduction

```sh
npm ci
npx playwright install chromium webkit
npm test
node --test bio-col-01/tests/*.test.mjs bio-yeux-01/tests/*.test.mjs
node bio-yeux-01/tests/makeup-browser.cjs
```

Le dernier appel cible GitHub Pages. La variable `PREVIEW_DIR` sélectionne la distribution locale. La variable `EXPECT_COMMIT` permet de fixer la révision attendue du manifeste. Dans l’environnement de recette, `PAGES_TEST_PROXY=1` permet aux navigateurs d’utiliser le proxy HTTPS. Le manifeste répond aussi avec la vérification TLS normale de `curl`.

[Domaines et format des compositions](PARAMETRES.md) · [Contrat technique](CONTRAT.md)
