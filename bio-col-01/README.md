# BIO-COL-01 — Palettes capillaires

Prototype indépendant après le lot 3. **26 teintes proposées** : 14 naturelles et 12 fantaisie. Couleur en aplat, contour dérivé plus sombre, géométrie inchangée.

- [Rapport, méthode, palette, tests et limites](../docs/ai/bio-col-01/README.md).
- Preview : https://thsethse.github.io/Microcosme/preview/bio-col-01/
- Contrat : branche `docs/bio-vis-dedup-01`, commit `e6fd39680bfe43e801069c9046f75f09d9ade1ff`, `docs/ai/bio-vis-dedup-01/CONTRAT_BIO_COL_01.md`.

## API de rendu

```js
import {character} from './bio-col-01/render.mjs';
const input={style:'p5-071',arrangement:'G',body:'standard'};
character(input); // Rendu historique exact, sans option ajoutée aux données.
character(input,{headOnly:true,hairColor:'blond-pale'}); // Aplat + contour.
character(input,{hairColor:'historical'}); // Rendu historique exact.
```

`hairColor` est une **nouvelle option de rendu explicite**, pas un champ biologique ni une valeur écrite dans les données historiques. Elle accepte les 26 IDs de `palette.mjs`, `undefined`, `null` ou `historical`. Un ID inconnu provoque une erreur. `hairLayers`, le catalogue et les fonctions de sélection restent les exports d’origine du lot 3.

La coloration remplace seulement les valeurs `fill` et `stroke` existantes des formes capillaires identifiées. Aucun attribut de géométrie, épaisseur, opacité, clip, ancre ou ordre d’élément ne change. Les accessoires, corps, visage, yeux et calques historiques de contraste restent intacts. Les quatre liens anciens intégrés aux tracés sont protégés par leurs fragments générés exacts.

## Reproduire

Depuis la racine, Node 22 et le lockfile du dépôt :

```sh
npm ci
npm test
node --test bio-col-01/tests/model.test.mjs
npx playwright install --with-deps chromium webkit
node bio-col-01/tests/browser.cjs
npm run test:browser
```

Le test navigateur sert automatiquement le dépôt. `ARTIFACT_DIR` choisit le dossier de captures et résultats (par défaut `/tmp/microcosme-bio-col01-browser`). `BASE_URL` permet de tester la preview publiée.

Suites originales des lots 1–3, sans écrire dans leurs sources :

```sh
git fetch --no-tags --depth=1 origin 1ff931586776b3f7ed41bbdc5772b97e030aa4db 4156254ca5a9b4a52f138a558bd70d461f4d4c4e 576ee961b5be385e6cceb2f357ffe74341b0d05f
node bio-col-01/tests/legacy.cjs
```

Consultation locale : servir la racine par HTTP, ouvrir `/bio-col-01/`. Les 129 fichiers hérités des artefacts P5-I6 et lots 1–3 restent dans `preview/`, vérifiés par empreinte.

Construction après commit :

```sh
node bio-col-01/build-preview.mjs /tmp/microcosme-bio-col01-release
```

Le script lit les huit sources d’exécution committées, ajuste leurs liens relatifs puis ajoute `version.json`. Il ne publie rien. La publication séparée ajoute uniquement ces **neuf fichiers** dans `preview/bio-col-01/`, sans fusion ni modification d’un ancien prototype.
