# Microcosme v0.8

Simulation autonome locale, sans framework, service distant ou IA à l’exécution. Compatible avec un hébergement statique GitHub Pages et utilisable sans réseau après chargement complet de la page.

Servir le dossier avec `python3 -m http.server 8000`, puis ouvrir `http://localhost:8000`. Conserver les sept fichiers `index.html`, `cognition.js`, `engine.js`, `storage.js`, `ui.js`, `interface.js`, `interface.css` au même niveau. Aucun build ; chemins relatifs compatibles avec `/Microcosme/`.

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

## Interface v0.8

Cinq scènes, fenêtres modales et caméra tactile sans modifier les règles v0.7. La simulation se met en pause hors du Village et reprend au retour seulement si elle tournait avant le départ. Le rechargement revient au menu, temps arrêté.

- [Architecture UI](docs/ARCHITECTURE-UI-v0.8.md)
- [Rapport et limites](docs/RAPPORT-v0.8.md)
- [Validation Safari iPad physique à réaliser](docs/VERIFICATION-IPAD-v0.8.md)

## Expérimentation graphique v0.9

Pixel art original généré en Canvas 2D, personnages animés, lumière liée à l’heure du moteur et atelier de démonstration indépendant (bouton « Démonstration graphique »). Aucun changement du moteur ou du format de sauvegarde.

- [Direction artistique et aperçus](docs/DIRECTION-ARTISTIQUE-v0.9.md)
- [Architecture graphique](docs/ARCHITECTURE-GRAPHIQUE-v0.9.md)
- [Rapport de validation](docs/RAPPORT-v0.9.md)
- [Vérification Safari iPad](docs/VERIFICATION-IPAD-v0.9.md)

## Prototype Île V1

Ouvrir [island.html](island.html) sur le même serveur statique : monde indépendant, carte globale, régions, suivi d’Alix et grotte accessible. Aucune migration des parties existantes.

- [Lancement, parcours iPad, architecture, tests et limites](docs/ISLAND-V1.md)
- Tests : `npm test` puis `npm run test:island:browser` (Chromium et WebKit).

## Île V2

La branche V2 agrandit les régions, ajoute une caméra tactile et 14 biotopes. [Guide V2, atlas et procédure iPad](docs/ISLAND-V2.md). La prévisualisation V1 demeure figée et accessible à son URL précédente.
