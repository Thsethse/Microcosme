# BIO-VIS-DEDUP-01 — Lot 2

Prototype isolé de présentation du catalogue. Il utilise directement le rendu publié du lot 1, sans le modifier, et conserve les 126 choix historiques des 72 références. Seule la liste ordinaire passe à 120 entrées.

- [Journal, correspondances, arbitrages, tests et limites](../docs/ai/bio-vis-dedup-lot-2/README.md)
- Preview : https://thsethse.github.io/Microcosme/preview/bio-vis-dedup-lot-2/
- Contrat : branche documentaire `docs/bio-vis-dedup-01`, `CONTRAT_LOT_2.md`.

Depuis la racine, après `npm ci` :

```sh
npm test
node --test bio-vis-dedup-lot-2/tests/model.test.mjs
npx playwright install --with-deps chromium webkit
node bio-vis-dedup-lot-2/tests/browser.cjs
```

Le test navigateur sert automatiquement le dépôt ; `BASE_URL` permet de vérifier la preview publiée. Les captures et `results.json` vont dans `/tmp/microcosme-dedup-lot2-browser`, ou dans `ARTIFACT_DIR`.

Pour une consultation locale, servir la racine du dépôt par HTTP puis ouvrir `/bio-vis-dedup-lot-2/`. Les dépendances restent dans `preview/bio-vis-dedup-lot-1/` et `preview/bio-vis-p5-i6/` ; leur manifeste de 99 empreintes est testé. Aucune installation n’est nécessaire pour consulter la preview publiée sur iPad.

Construction de l’artefact, après commit :

```sh
node bio-vis-dedup-lot-2/build-preview.mjs /tmp/microcosme-lot2-release
```

Le script lit les six sources d’exécution **committées**, ajuste uniquement leurs liens relatifs pour GitHub Pages, puis génère `version.json`. Il ne publie rien, ne copie aucune dépendance et ne modifie pas les autres prototypes. Seuls ces sept fichiers vont dans le nouveau répertoire `preview/bio-vis-dedup-lot-2/` de la branche de publication, sans fusion de la PR de code.
