# Microcosme v0.6

Simulation autonome locale, sans framework, service distant ou IA à l’exécution.
Ouvrir le site via GitHub Pages ou servir le dossier : `python3 -m http.server 8000`.
Les quatre fichiers `index.html`, `engine.js`, `storage.js`, `ui.js` doivent rester au même niveau. Aucun build requis ; chemins relatifs compatibles avec `/Microcosme/`.

- `engine.js` : état, besoins, perception, mémoire, choix et déplacement ; aucun accès au DOM ou au stockage. `MicrocosmeEngine.create(state, random)` permet des tests déterministes ; `step()` avance une heure.
- `ui.js` : affichage, animation, sélection, minuterie et orchestration des interventions divines.
- `storage.js` : validation, migration et lecture/écriture ; clé historique `microcosme-v03`, repli `microcosme-v02`. Les données invalides sont conservées sous une clé suffixée `-recovery` avant remplacement. Si cette copie échoue, les écritures sont bloquées pour la session. Un message signale les erreurs de stockage.

## Vérifications

Node 22 ou ultérieur : `npm test` (aucune installation nécessaire pour le moteur).
Tests navigateur : `npm ci`, `npx playwright install --with-deps chromium webkit`, puis `npm run test:browser`.
`BROWSERS=chromium` limite explicitement le parcours local à Chromium (la CI teste les deux moteurs).
`CHROMIUM_PATH` permet d’utiliser un Chromium système. Le serveur de test démarre et s’arrête automatiquement.
La CI exécute les deux suites à chaque Pull Request.

Voir [l’audit v0.6](docs/AUDIT-v0.6.md) pour les corrections, limites et vérifications iPad.
