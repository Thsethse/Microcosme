# BIO-VIS-DEDUP-01 — Lot 1

Prototype isolé, basé sur P5-I6 publié. Quatre recettes locales : 58-G, 24-D, 68-G et 58-D. Aucun regroupement visible, aucun changement d’ID, aucun lot 2. Les autres choix délèguent exactement à P5-I6 ; 68-D reste inchangé.

Ouvrir `index.html` avec un serveur HTTP à la racine du dépôt. La preview Pages utilisera le chemin `preview/bio-vis-dedup-lot-1/` ; [journal](../docs/ai/bio-vis-dedup-lot-1/README.md).

```sh
npm ci
python -m http.server 8000
# http://localhost:8000/bio-vis-dedup-lot-1/
node --test bio-vis-dedup-lot-1/tests/model.test.mjs
npx playwright install --with-deps chromium webkit
node bio-vis-dedup-lot-1/tests/browser.cjs
```

Les tests du prototype sont aussi exécutés par son workflow de PR. Les tests existants du jeu ne sont pas changés.

`build-preview.mjs` produit un artefact dans un répertoire neuf passé en argument. Il exige des fichiers runtime déjà commités. L’unique transformation est le préfixe d’import des dépendances : `../preview/bio-vis-p5-i6` devient `../bio-vis-p5-i6`, car l’artefact Pages et le snapshot P5-I6 sont voisins. Les 93 fichiers de la dépendance sont vérifiés par SHA-256, jamais écrits. Aucun algorithme n’est transformé par la publication. `version.json` décrit les fichiers et leurs empreintes. Le script ne publie pas lui-même.

Les contrôles du navigateur peuvent viser une publication avec `BASE_URL=https://thsethse.github.io/Microcosme/preview/bio-vis-dedup-lot-1/`. Les captures et résultats restent dans `captures/` ; aucune sauvegarde n’est lue ou écrite.

Les options d’accessoires et le corps valent pour les deux colonnes. Les cheveux partagent une paire de teintes dans les comparaisons. Les originaux restent intacts et leurs objets/visages ne comptent pas dans l’évaluation. Les racines cachées sous les feuilles ou le bandeau ne sont pas reconstituées.

La validation artistique demeure à faire par l’utilisateur sur Safari iPad physique. Aucune fusion autorisée.
