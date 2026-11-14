# Microcosme — Île V1

## Lancer et tester sur iPad

Point d’entrée indépendant : `island.html`. Aucun build, compte ou service distant.

```sh
git fetch origin
git switch codex/island-v1
python3 -m http.server 8000 --bind 0.0.0.0
```

Sur un iPad connecté au même réseau local, ouvrir dans Safari `http://ADRESSE_IP_DU_PC:8000/island.html` (autoriser le serveur dans le pare-feu local si nécessaire). `localhost` sur l’iPad désigne l’iPad, pas le PC. Un hébergement statique peut aussi servir les cinq fichiers `island.html`, `island.css`, `island.js`, `island-world.js`, `graphics.js` ensemble. Le lien Village historique suppose les fichiers historiques à côté.

Prévisualisation publique de cette branche : **pas disponible à la livraison**. GitHub Pages sert uniquement `main /` ; cette mission ne modifie ni `main` ni les prévisualisations historiques. Après une éventuelle publication indépendante, l’entrée à utiliser sera `island.html`. Ne pas confondre la prévisualisation PR7 avec celle de l’île.

### Parcours manuel Safari physique (à exécuter)

Noter modèle, iPadOS/Safari, orientation et éventuels défauts.

1. Ouvrir `island.html` : l’île entière doit tenir dans la vue, avec forêt, plaine, montagne, rivière et littoral. Alix est un petit sprite au centre. Attendre quelques secondes : sa position et le temps évoluent.
2. Toucher « La plaine » : retrouver Alix au même endroit relatif. Si Alix a quitté cette région, « Observer sa région » retrouve sa position actuelle sans activer durablement le suivi. La simulation continue pendant la navigation.
3. Toucher son sprite ou « Alix · ouvrir la fiche ». Vérifier identité #1, activité et position. Toucher « Suivre Alix » : la vue accompagne Alix, y compris les changements de région et ses entrées/sorties de la grotte (un cycle dure environ 90 secondes). L'identité reste #1.
4. Toucher « Carte de l’île » pour quitter le suivi, puis « Les sommets » en haut à droite. Toucher « Entrer dans la grotte » : voir un plan distinct, murs et cristaux. Toucher « Sortir » sur la carte ou « Sortir de la grotte » dans la barre : retrouver la même entrée extérieure. Revenir à la carte globale. Le regard du joueur n’ordonne aucun déplacement à Alix.
5. Répéter en portrait puis paysage. Vérifier boutons tactiles, fiche, fermeture et défilement. Avec un clavier, tester Tab/Maj+Tab et Échap dans la fiche. Activer Réduire les animations : le fondu et les poses animées sont supprimés.
6. Mettre en pause : positions et temps restent fixes. Reprendre, changer d’app puis revenir : la simulation reste arrêtée, sans rattrapage ; toucher Reprendre. Recharger : un nouveau monde commence (aucune sauvegarde du prototype).
7. Après chargement, couper le réseau : les scènes, la fiche et la simulation restent utilisables. Un démarrage à froid hors ligne n’est pas garanti. Revenir à l’application historique : ses parties doivent être intactes.

## Vérification préalable et choix d’intégration

- Base inspectée : `main` au SHA `413fa2a` (moteur historique au précédent `3c15d88`). PR ouvertes consultées : #5 documentaire et #7 laboratoire matériel. Aucun `AGENTS.md` dans les arbres main, mémoire et PR7 inspectés.
- Les guides `START_HERE`, `PROJECT_STATE`, `DECISION_REGISTER`, `WORK_LOG`, le registre des snapshots et le contrat I1 v0.2 ont été lus sur `origin/docs/llm-project-memory` : ils ne sont pas présents sur main. Les documents UI/graphisme et les sources moteur, rendu, caméra, stockage et tests de main ont été inspectés.
- La mission Île V1 fournie par l’utilisateur autorise ce prototype de scènes. Elle ne clôture pas C5 et n’autorise pas une refonte de la biologie ou du laboratoire.
- Le moteur historique fixe sa grille à 12×9, son déplacement suppose cette grille, et sa minuterie s’arrête hors du Village. Le reprendre directement imposerait une refonte à risque. `island-world.js` est donc un petit monde de démonstration isolé : un état autoritaire et une seule boucle pour toutes les vues.
- Réutilisation réelle : `graphics.js` (sprites originaux `person`, arbres `tile`, hachage déterministe), Canvas 2D, scripts statiques, CommonJS pour Node / global navigateur, Playwright déjà présent. Le moteur, cognition, stockage, caméra historique et ses règles ne sont pas repris ni modifiés. Aucune dépendance ajoutée.
- PR7 au SHA `8767f15` : sept fichiers `material-*`, deux tests et un rapport ; aucun besoin pour la navigation de l’île. Aucun de ces chemins, ni `preview-pr7/`, n’est modifié. Les anciennes clés `microcosme-v03`, `microcosme-v02`, `microcosme-material-lab-v1` restent intactes ; l’île ne lit ni n’écrit le stockage.
- L’illustration ChatGPT de référence n’est pas accessible dans le dépôt inspecté. Graphismes provisoires fondés sur les contraintes écrites ; aucune prétention de reproduction de cette illustration.

## Architecture livrée

- `island-world.js` : surface 48×36, neuf régions 16×12, terrain déterministe, rivière avec gué, une grotte 16×12, une habitante stable. `pos = {space,x,y}` est l’unique position autoritaire. Chemin cardinal par recherche en largeur, respect des murs/eau. Franchissement des portails uniquement depuis leur case correspondante.
- Alix suit seule un itinéraire cyclique plaine → forêt → grotte → contreforts. Les libellés d’activité décrivent ces déplacements et attentes. Il s’agit d’un comportement autonome simplifié, sans simulation biologique, récolte ou décisions C1–C4. Aucune commande de déplacement du joueur.
- `createView` : état d’observation séparé, sélection par ID, suivi par ID. Passer de vue n’avance ni ne réinitialise le monde. Les vues ne possèdent jamais leurs propres habitants. Entrer manuellement dans la grotte déplace seulement le regard ; le suivi suit les portails qu’Alix franchit effectivement.
- `bounds` / `project` : même transformation des coordonnées pour le terrain, sprites et cibles tactiles. La sortie du plan intérieur revient à la région de l’entrée extérieure, à la même position affichée.
- `island.js` : un tick toutes les 600 ms sur la page visible, quelle que soit la scène ou la fiche. L’onglet masqué arrête explicitement la simulation ; reprise manuelle sans rattrapage. L’état d’observation n’est pas une simulation supplémentaire. La boucle d’agents est le point d’extension d’une future planification hors écran, sans optimisation complexe actuelle.
- Décor Canvas mis en cache jusqu’au changement de scène, un bouton DOM par habitant, sprites miniatures/rapprochés issus du même ID, cibles minimales 44×44, fondu bref respectant la préférence de mouvement réduit. Aucun zoom continu ni isométrie.
- Diagnostic navigateur `IslandDiagnostics.snapshot()` : copie détachée en lecture, sans commande de mutation de la simulation.

## Vérifications automatisées

```sh
npm ci
npm test
npx playwright install --with-deps chromium webkit
npm run test:browser
npm run test:island:browser
```

La CI existante conserve les tests historiques et ajoute le parcours île pour les deux navigateurs. `BROWSERS=chromium` ou `BROWSERS=webkit` permet un diagnostic ciblé.

- Node : **40/40** (35 historiques et 5 nouveaux). Identité/référence stable sur 3 000 ticks, cases praticables, déplacements unitaires, portails dans les deux sens, projections globales/locales inversibles pour chaque case, navigation complète sans mutation, activité hors écran identique à un monde observé et suivi interrégional/intérieur sans duplication.
- Navigateur : parcours tactile complet, suivi autonome jusqu’à l’entrée/sortie réelle, temps hors écran, pause, retour exact dans la région d’entrée, unicité DOM, isolation de stockage, trois tailles d’écran avec carte entièrement visible, fiche/Échap, hors ligne après chargement, arrêt sur visibilité simulée et reprise manuelle. Le parcours rapide contrôle l’horloge de test ; un second chargement vérifie séparément la vraie minuterie.
- Résultats Chromium/WebKit et limites de l’environnement : voir la section finale ci-dessous.

## Limites et suite

Un habitant, itinéraire d’essai, une grotte, neuf régions fixes, terrain non modifiable. Pas de sauvegarde/import/export du prototype ; navigation et simulation repartent au rechargement. Le fleuve est décoratif et infranchissable sauf au gué ; relief praticable, pas de simulation hydrologique ou d’altitude. Pas de contrôle physique iPad ni de mesures de batterie, mémoire ou fluidité sur matériel Apple. WebKit Linux ne constitue pas une certification Safari iPad.

Reste à développer dans des missions ultérieures : autres biotopes, graphismes à partir de la référence accessible, comportements plus riches, éventuelle connexion au noyau matériel après validation, persistance isolée si demandée, optimisations hors écran mesurées. Aucun de ces éléments n’est ajouté à cette V1.

## Résultats exécutés le 14 novembre 2026

- `npm test` : 40 tests réussis, aucun échec.
- `npm run test:island:browser` : réussi dans **Chromium 151** et **WebKit 26.5 Linux** ; navigation tactile, suivi jusqu’au franchissement autonome de la grotte et retour, activité hors écran, pause réelle, isolement de stockage, tailles 820×1180 / 1180×820 / 390×844, carte entièrement visible, hors ligne et cycle de visibilité simulé.
- `npm run test:browser` : non-régression historique réussie dans les deux moteurs (rendu v0.9, mémoire, sauvegardes, interface tactile, démonstration et hors ligne).
- Inspection visuelle de captures globale et locale Chromium effectuée ; l’ajustement de hauteur de carte a ensuite été validé par le parcours automatisé dans les deux moteurs.
- Environnement : Node 24.22.1, Playwright 1.62.1 déjà verrouillé dans le dépôt. Cache npm et navigateurs placés sous `/tmp`, car le dossier personnel n’était pas inscriptible. Bibliothèques WebKit manquantes extraites de paquets Debian dans le dossier de travail, sans installation système ni changement des dépendances du dépôt. Le lanceur WebKit local remplace `LD_LIBRARY_PATH` : sa copie temporaire a été adaptée pour conserver le chemin des bibliothèques extraites. Validation préalable de dépendances Playwright ignorée dans ce seul lancement local ; **WebKit a réellement démarré et exécuté les assertions**, y compris avec sa minuterie réelle. La CI utilise l’installation officielle `--with-deps`.
- Safari iPad physique : **non exécuté**. Performance, consommation et échauffement sur iPad : **non mesurés**. Aucun résultat de bureau ne leur est substitué.
