# BIO-VIS-DEDUP-01 — Lot 3

Prototype isolé : dix corrections locales dans les cinq dossiers E06, E09, Q03, V02, V09. Aucun fichier des lots 1/2, du jeu, du moteur biologique ou des sauvegardes n’est modifié.

- [Rapport, attribution E06, provenance, comparaisons et résultats](../docs/ai/bio-vis-dedup-lot-3/README.md).
- Preview : https://thsethse.github.io/Microcosme/preview/bio-vis-dedup-lot-3/
- Contrat : `docs/bio-vis-dedup-01`, commit `2b0fb7c8a47d19008263519a7cfc681ca6006fee`, `docs/ai/bio-vis-dedup-01/CONTRAT_LOT_3.md`.

Depuis la racine, avec Node 22 et les dépendances verrouillées du dépôt :

```sh
npm ci
npm test
node --test bio-vis-dedup-lot-3/tests/model.test.mjs
npx playwright install --with-deps chromium webkit
node bio-vis-dedup-lot-3/tests/browser.cjs
npm run test:browser
```

Les tests navigateur servent automatiquement le dépôt et enregistrent les captures et résultats dans `/tmp/microcosme-dedup-lot3-browser`, ou `ARTIFACT_DIR`. `BASE_URL` permet de les lancer sur la preview publiée. Aucune dépendance d’exécution ni police distante n’est ajoutée.

Rejouer les **suites originales** des lots 1 et 2, depuis des copies temporaires qui ne modifient pas leurs fichiers :

```sh
git fetch --no-tags --depth=1 origin 1ff931586776b3f7ed41bbdc5772b97e030aa4db 4156254ca5a9b4a52f138a558bd70d461f4d4c4e
node bio-vis-dedup-lot-3/tests/legacy.cjs
```

Pour une consultation locale, servir la racine du dépôt par HTTP puis ouvrir `/bio-vis-dedup-lot-3/`. Le prototype réutilise les fichiers publiés des lots 1/2 et de P5-I6 dans `preview/` : 106 empreintes vérifiées. Le catalogue et les fonctions de sélection historique sont directement réexportés du lot 2, sans copie ni modification.

Construire l’artefact Pages **après commit** :

```sh
node bio-vis-dedup-lot-3/build-preview.mjs /tmp/microcosme-lot3-release
```

Le script lit les sources committées, ajuste uniquement les liens relatifs de publication et génère `version.json` : sept fichiers d’exécution, quatorze extractions PNG originales, leur provenance et le manifeste, soit **23 fichiers**. Publication séparée, limitée à `preview/bio-vis-dedup-lot-3/`, sans fusion de la PR de code. Les 106 fichiers hérités restent en place et inchangés.
