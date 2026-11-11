# Microcosme v0.7

Simulation autonome locale, sans framework, service distant ou IA à l’exécution. Compatible avec un hébergement statique GitHub Pages et utilisable sans réseau après chargement complet de la page.

Servir le dossier avec `python3 -m http.server 8000`, puis ouvrir `http://localhost:8000`. Conserver les cinq fichiers `index.html`, `cognition.js`, `engine.js`, `storage.js`, `ui.js` au même niveau. Aucun build ; chemins relatifs compatibles avec `/Microcosme/`.

## Organisation

- `cognition.js` : besoins, solutions et décision à partir de la seule mémoire personnelle. Aucun accès au monde réel.
- `engine.js` : état, perception, déplacement, action, résultat et règles sociales. Aucun DOM ni stockage. `MicrocosmeEngine.create(state, random)` permet un hasard contrôlé ; `step()` avance une heure.
- `ui.js` : affichage, inspecteur, animation, outils divins, lois et minuterie.
- `storage.js` : validation et migration ; clé historique `microcosme-v03`, repli `microcosme-v02`. Les données invalides sont copiées sous une clé suffixée `-recovery` avant remplacement ; si cette copie échoue, les écritures sont bloquées pour la session. Les erreurs sont affichées.

L’habitant connaît les terrains à deux cases en distance de Manhattan et garde leur dernière observation. Il peut poursuivre un souvenir devenu faux, puis revoir son intention lorsqu’il observe le changement. L’inspecteur montre son besoin, sa raison et ses révisions. Les ressources restent inépuisables ; Prairie est une intervention manuelle du joueur.

## Vérifications

Node 22 ou ultérieur : `npm test` (aucune installation nécessaire pour les tests du moteur).
Tests navigateur : `npm ci`, `npx playwright install --with-deps chromium webkit`, puis `npm run test:browser`. Le serveur démarre et s’arrête automatiquement.

`BROWSERS=chromium` limite explicitement le parcours local à Chromium ; `CHROMIUM_PATH` permet d’utiliser un Chromium système. La CI exécute les deux moteurs à chaque Pull Request. Aucune validation Safari iPad réel n’est déduite de WebKit Linux.

- [Règles de décision et migration](docs/DECISIONS-v0.7.md)
- [Rapport des modifications, vérifications et limites](docs/RAPPORT-v0.7.md)
- [Procédure Safari iPad](docs/VERIFICATION-IPAD-v0.7.md)
- [Audit historique v0.6](docs/AUDIT-v0.6.md)
