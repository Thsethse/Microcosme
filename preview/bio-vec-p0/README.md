# BIO-VEC-P0 — Atelier des visages

Mission #24. Prototype autonome, aucun fichier du moteur du jeu modifié.

Preview : https://thsethse.github.io/Microcosme/preview/bio-vec-p0/

## Utilisation sur iPad

Les vues face/profil sont affichées ensemble. Toucher Neutre, A, B ou C ; déplacer les huit curseurs ; activer Ancien pour comparer l'identité à travers le temps. Construction affiche les rectangles transformés, centres en croix, ancres locales et relations entre yeux, nez, bouche et menton. Revenir au neutre réinitialise aussi l'âge. L'interface fonctionne hors ligne une fois ses ressources chargées (pas de cache pour un redémarrage hors ligne).

## Architecture et références

Base : branche documentaire `docs/bio-vec-std-01`, SHA `78d3f45514ae15b33ad63e8fb33020a292cde726`, PR #23, sans fusion. `reference.json` est une copie exacte du JSON de référence, vérifiée par test. Elle rend le dossier déplaçable tel quel dans `preview/`. Les fichiers d'origine de la PR #23 restent inchangés.

- `model.mjs` : normalisation bornée, projections des paramètres, conversion des points locaux en coordonnées globales.
- `render.mjs` : fonctions pures produisant courbes Bézier, plans, dégradés, yeux, cheveux et vêtements SVG. Aucun portrait préfabriqué, bitmap, image IA, bibliothèque de dessin ou ressource distante.
- `app.mjs` : un seul état identitaire pour les deux vues. Ancien est une couche visuelle ; aucun changement des paramètres ou ancres.

Les coordonnées anatomiques de base proviennent des rectangles et points du JSON. Les coefficients des courbes, choix de peinture, cadrage et vêtement sont des décisions graphiques. En profil, les largeurs deviennent profondeur ou relief : l'écartement des yeux déplace l'orbite ; la largeur du nez module la narine ; sa projection déplace la silhouette. En face, la projection module le relief ombré du nez. Les traits de construction représentent les repères, pas une reconstruction 3D.

### Incohérence dans la référence

Le JSON impose une bouche de largeur 28 pour des centres oculaires distants de 21, soit 1,33. Le texte prescrit environ 0,74 ±25 %. Ces contraintes sont incompatibles. Le JSON étant explicitement la source de vérité, sa géométrie est conservée, sans correction silencieuse ; le test documente ce rapport. Les bornes d'identité restent celles du JSON. Le menton peut dépasser le cadre canonique à longueur maximale (jusqu'à Y=101,5) ; le viewBox réserve une marge. Les vêtements et certains traits de cheveux débordent volontairement des rectangles anatomiques.

Proportions graphiques provisoires, sans validation anthropométrique. La validation artistique appartient à l'utilisateur ; les tests techniques ne la remplacent pas.

## Validation

Depuis la racine :

```sh
npm ci
node --test bio-vec-p0/model.test.mjs
npx playwright install --with-deps chromium webkit
python3 -m http.server 8765 --bind 127.0.0.1
# Dans un autre terminal :
node bio-vec-p0/browser.test.cjs
# Contrôle de la vraie preview après publication :
BASE_URL=https://thsethse.github.io/Microcosme/preview/bio-vec-p0/ node bio-vec-p0/browser.test.cjs
```

Sept tests de modèle : références, bornes/entrées invalides, symétrie initiale, 256 combinaisons extrêmes dans les deux vues et aux deux âges, ordre vertical, déterminisme, absence de NaN, distinction des presets, effet réel des huit paramètres et stabilité des ancres avec l'âge. Les tests navigateur couvrent Chromium et WebKit, gestes tactiles, huit curseurs sur les deux SVG, quatre presets, construction, vieillissement, absence d'erreurs et de ressources manquantes, interactions hors ligne et formats 820×1180, 1180×820, 768×1024 et 390×844. WebKit émulé n'est pas un test sur un iPad physique.

Vérification locale : sept tests de modèle, tests tactiles Chromium/WebKit et les 35 tests existants du jeu réussis. Dans cet environnement Cloud, les bibliothèques WebKit manquantes ont été extraites dans le dossier de travail et le lanceur local ajusté pour conserver LD_LIBRARY_PATH ; aucun changement système ni fichier du dépôt requis par cet ajustement. La CI utilise l'installation standard Playwright.

## Publication sans merge

Le dépôt utilise GitHub Pages legacy depuis `main:/`. Comme les previews précédentes, seul un snapshot statique des six fichiers exécutables et du présent README est publié dans un nouveau dossier `preview/bio-vec-p0/` par un commit séparé sur `main`. Aucune fusion de branche ni modification de configuration Pages ou du jeu. Le code proposé reste dans une PR distincte, en brouillon, en attente de validation artistique.
