# Transmission à Codex — prompt dormant
**Ce document ne lance pas Codex et n’autorise aucune programmation.** Il doit être transmis après validation explicite du périmètre I1 par François. La mission actuelle est exclusivement documentaire.

## État de passage
Code audité : main `3c15d88d1b5b2f3f0ce4d9a58207ef9b989bc479`.
Mémoire : `364c8ec0e62f54ae9ecdb16e791bfebea2ee94f5`.
Audit initial seulement : 35/35 tests existants sous Node 24.22.1 ; non relancés lors de la correction documentaire v0.2. Navigateur et Safari physique non exécutés. Contrat candidat non implémenté. Aucune capacité nouvelle n’est démontrée.

## Prompt opérationnel à activer seulement après accord
Tu interviens sur Microcosme pour **I1 seulement**, une tranche alimentaire autonome isolée. Avant toute écriture, vérifie l’autorisation explicite de François et les propositions P-A/P-B/P-C/P-D/P-E réellement acceptées. Si elles manquent, restitue le manque, ne code pas. Lis README, 01_AUDIT, 03_CONTRAT et 04_VALIDATION dans docs/ai/integration-audit-2026-11-14 ainsi que les six documents mémoire sources. Ne considère ni C5 ni les constantes de laboratoire comme validés sans l’accord joint.

Inspecte HEAD et les éventuels AGENTS.md, compare aux SHA audités ; si changement matériel de contrat ou moteur, rapporte-le avant d’adapter. Travaille sur une branche d’implémentation dédiée, aucune fusion automatique.

### Objectif
Deux habitants doivent pouvoir, sans commande d’action du joueur, observer une source alimentaire finie, s’en approcher, prélever, transporter et ingérer ; une ressource disputée ne doit jamais être dupliquée. Ils révisent leurs intentions après observation/échec. Le sol et le porteur sont des emplacements matériels persistants, consumed un puits comptable explicite. Ce laboratoire ne réalise pas encore C1–C4.

### Fichiers et surfaces autorisées pour I1
Créer uniquement :
- material-world.js : schéma, état, RNG sérialisé, vues et invariants ;
- material-actions.js : MOVE, TRANSFER, INGEST, REST ; aucune construction ;
- material-cognition.js : politique bornée I1, intentions et chaînes ;
- material-storage.js : clé isolée, validation, save/load/export/import ;
- material-lab.html, material-lab.js, material-lab.css : accès direct au labo, commande temps/pause, ressources, croyances et résultats inspectables ;
- tests/material.test.js et tests/material-browser.cjs : tests nouveaux ;
- docs/ai/integration-audit-2026-11-14/IMPLEMENTATION_I1.md : rapport de ce qui est réellement réalisé.
Ces chemins sont proposés à créer ; ne pas prétendre qu’ils existent dans main.

Références existantes lues, **à conserver inchangées dans I1** : engine.js (create/step/perceive/travel/act), cognition.js (choose/eligible/solutions), storage.js (normalize/load/save), ui.js (step/details/tap), interface.js (navigate), renderer.js, graphics.js, atmosphere.js, index.html, interface.css, package.json, package-lock.json, .github/workflows/tests.yml, tests existants, preview-v08 et preview-v09. Reprendre les conventions CommonJS/UMD, pas de framework ni dépendance nouvelle. Ne pas réutiliser normalize v7 pour de la matière finie. Le script npm test inclut déjà tests/*.test.js ; le test navigateur nouveau est lancé séparément.

### Interfaces et règles
Implémenter exactement le sous-ensemble I1 de 03_CONTRAT : World/Entity/Agent/ActionResult, snapshot par tick, une primitive par acteur, arbitrage tournant, commit atomique et contrôle de matière. Exposer createLab(config,seed), stepLab(state), observeAgent(state,id), decideAgent(personalView,rng), executeCommand(state,command), validateState, serialize/deserialize et inspect ; ces signatures sont des interfaces nouvelles proposées.
Le décideur ne reçoit pas World. L’exécuteur a accès au vrai monde mais ne lui invente pas de motivation. Le renderer ne modifie rien. RNG doit être explicite, borné et sérialisé ; choisir et documenter un algorithme stable. Sauvegarde à frontière de tick ; reprise exacte. Conservation et locations uniques sont des assertions testables, pas des commentaires.

I1 : 2 agents, 16 lots actifs positifs max (tous emplacements), ration seule, cases partagées permises, rayon2 sans occlusion, MOVE1/transfert1 en énergie, INGEST -38 faim, repos+6, faim+2/tick ; capacités 4 rations. Aucun coût horaire général ajouté. Config exposée dans l’inspecteur et identifiée comme paramètres d’essai. Pas de seuil C1–C2 modifié. UI explique « adaptateur biologique provisoire ».

Appliquer le contrat v0.2 corrigé :
- TRANSFER exige energy≥1 avant commit. Sinon NO_CAPACITY : aucun déplacement de matière, création/retrait de lot, coût, changement de nextId ou de révision. À énergie1, succès légal et énergie finale0 si toutes les autres préconditions sont satisfaites. La faim+2 de début de tick est indépendante.
- Ne conserver aucun lot vide dans entities. À la dernière ingestion, retirer le lot et incrémenter consumed dans la même transaction. Un transfert total conserve ID et nombre de lots ; un transfert partiel garde la source positive et crée un fragment seulement au commit.
- Vérifier le total de lots actifs final : split à 16→17 refusé CAPACITY sans effet, mais transfert total à16 autorisable. Ne pas fusionner/détruire de matière pour libérer une place.
- nextId sérialisé, incrémenté seulement à création réussie, jamais recyclé/recalculé vers le bas. Refuser une allocation dépassant les entiers sûrs.
- Distinguer lot, cellule de ressource et souvenir : observations par (cellId,material), bornées à108 en I1, ≤16 IDs chacune ; resourceRevision par cellule ; souvenir vide={quantité0, IDs[]}. Une intention, plan≤3 ; aucun registre de lots retirés ni expérience par ID croissant sans borne.
- Retirer un lot ne corrige jamais les connaissances d’un habitant distant. Une référence épistémique ancienne reste admise à la sauvegarde ; à réobservation locale, invalider l’étape périmée puis réévaluer. Commande locale vers lot disparu/absent de l’emplacement attendu : EMPTY ; hors portée : NOT_REACHABLE, sans révélation distante. Suivre l’ordre de validation de 03_CONTRAT.
- Sauvegarder nextId, resourceRevision, ledger, RNG, observations/intention/plan et événements≤256. Rejeter un lot zéro à l’import ; ne pas ressusciter un lot cité en mémoire. L’événement borné conserve la cause d’épuisement, le ledger son total ; aucune archive de suppressions sans borne.

Inclure un initialiseur déterministe avec au moins une source visible et assez proche pour T05. Ne pas coder une succession d’actions spécifique à cette scène : la politique doit répondre aux stocks/positions/besoins, pas aux noms/IDs des fixtures. Ajouter des fixtures source épuisée/concurrence en tests.

### Acceptation
T01–T14 (dont T10-a), T22-a/b et T23-a à T23-e doivent passer ; aucune nouvelle action n’exige une intervention du joueur pour le parcours alimentaire ; aucun apport fantôme ; échecs et choix expliqués séparément ; chargement identique au déroulement continu ; saturation et corruption refusées sans mutation ; anciennes sauvegardes inchangées ; source épuisée reste vide après reload.
Panneau : quantité par lieu, consommation cumulée, bilan, action/intention, raison, cause d’échec, état perçu vs réel, paramètres biologiques provisoires. Pas besoin de pixel art nouveau.
Pause lorsque document caché, reprise sans rattrapage implicite ; test visibilité, navigation, export/import et stockage bloqué. Aucune garantie physique iPad sans essai sur l’appareil.

Tester aussi 20 cycles de prélèvement partiel puis ingestion depuis 40 rations, sans saturation artificielle ; source20/consumed20, au plus 2 lots actifs, IDs non réutilisés. Inclure une reprise après transfert et après ingestion, une mémoire visant un lot retiré, une vraie saturation à16 lots positifs et les cas énergie 0/1. Ces tests de contrat ne remplacent pas T05, test autonome. Tous sont candidats non exécutés à la date du dossier.

### Tests à exécuter
- npm test (suite existante + tests/material.test.js).
- npm run test:browser pour non-régression si navigateurs installés ; ne pas convertir une absence de navigateur en succès.
- node tests/material-browser.cjs : Chromium puis WebKit sur le labo, avec serveur d’essai local créé dans ce nouveau fichier.
- Refaire les vérifications Safari physiques adaptées avant toute déclaration compatible iPad. Si indisponibles, état NON EXÉCUTÉ dans rapport.
Ne pas modifier les anciens tests pour obtenir du vert. Consigner versions, commandes, résultats, limites ; mesurer séparément si un benchmark est fait. Relire git diff : seulement les nouveaux chemins autorisés. Ouvrir une PR de revue, ne pas fusionner.

### Explicitement exclus
Obstacles/BFS, projets/construction, bois, outils, échange/don/vol, héritage, blessures/maladies, reproduction/mort, nouveaux modèles B1.14, implémentation complète T, communication S, normes/autorité, invention autonome, génération LLM en runtime, simulation hors ligne, service worker, serveur/cloud, migration des anciennes parties, modification des previews, refonte graphique et augmentation de population. Ne pas lancer I2 après I1 sans nouvelle autorisation.
