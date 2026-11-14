# Contrat technique candidat v0.1
**NON VALIDÉ. Aucun code du noyau ci-dessous n’existe à ce jour.** Les constantes sont des paramètres de laboratoire proposés, pas des équations biologiques validées.

## 1. Périmètre borné
Noyau cible : 5 habitants maximum, grille expérimentale 12×9, 128 entités matérielles maximum, deux matériaux abstraits (ration, bois), objets rigides monocase, deux projets maximum, un seul type de structure (abri). Pas d’eau simulée, terrain déformable, empilement, combustion, maladie, reproduction, marché, norme ou autorité. Cette grille reprend le support existant ; elle ne valide ni le C5 insulaire ni G+.

Premier incrément I1 : seulement 2 habitants, 16 lots maximum de rations, aucune construction ni obstacle. Son contrat est le sous-ensemble défini ici ; le noyau cible complet arrive après I2–I4.

## 2. État autoritaire et représentation
Proposition de modules purs UMD/CommonJS compatibles avec les conventions observées :
- material-world.js : états, validations, transactions et observations ;
- material-actions.js : descripteurs et exécution des primitives ;
- material-cognition.js : décisions à partir de vues personnelles et pratiques bornées ;
- material-storage.js : schéma isolé, validation et round-trip ;
- material-lab.js/html : horloge, présentation et inspection du laboratoire.
Noms **proposés à créer**, pas fichiers existants.

World = {schemaVersion:1, tick, nextId, rngState, config, cells, entities, agents, projects, ledger, recentEvents}.
Toutes les identités sont stables et uniques ; nextId strictement monotone ; tick entier. Les révisions d’entités changent seulement lors d’une mutation de leurs propriétés observables. Les unités matérielles sont entières et non négatives ; aucun flottant de masse dans ce laboratoire.

Cell = {id, basePassable}. Pas de propriétaire social dans cette structure.
Entity = {id, material, quantity, location, unitMass, blocking, revision}.
location est exactement l’une de {cellId}, {holderAgentId}, {projectId}. Un lot de quantité n est fongible ; un outil indivisible serait quantity=1 mais les outils sont exclus du noyau. Aucune liste secondaire d’inventaire faisant autorité : les index se dérivent des locations.
Fractionnement : la source garde son ID même à zéro ; le fragment reçoit nextId. Transfert total : ID conservé. Pas de fusion automatique ; à la limite d’entités, action refusée avec CAPACITY et aucun prélèvement. La saturation des IDs n’est jamais résolue par suppression matérielle.

Agent = {id, pos, body, knowledge, intention, plan, practicalTraces}. body utilise en I1 hunger/energy historiques comme adaptateur temporaire, pas comme C1 cible. Capacité portée = 4 unités, masse unitaire ration=1 (valeurs d’essai). knowledge contient seulement observations datées/révisions connues ; plan ne contient que des références connues.
Project = {id, cellId, recipeId, workDone, status, revision}. Les matériaux sont les entités situées dans le projet. Prototype abri : deux quanta bois et quatre quanta travail ; à chaque quantum de travail, 1 unité d’énergie d’essai dépensée ; à workDone=4, status=complete et lieu de repos amélioré. Le bois reste dans le projet achevé, jamais recopié en un nouvel objet. Un projet incomplet n’apporte aucun bénéfice de repos.

ledger = par matériau {initial, divineAdded, divineRemoved, consumed}. Il ne prétend pas représenter masse corporelle/assimilation : consumed est une destination comptable explicite. L’interface biologique réelle remplacera ce puits d’essai après formalisation autorisée. Toute intervention divine est une commande tracée avec source/destination, jamais une correction cachée.

## 3. Catalogue d’interactions
Toutes **à développer**. Les interactions actuelles analogues dans engine.js sont indiquées, elles ne satisfont pas ce contrat.

| ID | Commande et préconditions au commit | Effets exacts d’un succès | Échec / interruption |
|---|---|---|---|
| MOVE | acteur existant ; voisin cardinal ; cellule praticable ; coût disponible | pos devient voisin ; energy -1 d’essai ; événement avec anciennes/nouvelles positions | BLOCKED, OUT_OF_BOUNDS, NO_CAPACITY ; pas de téléportation. Analogue existant travel, sans obstacles |
| TRANSFER | quantité q>0 entière ; source accessible sur même case ou portée ; source.quantity≥q ; destination même case/porteur/projet accessible ; capacité compatible | q quitte source et arrive destination atomiquement, split si partiel ; masse globale inchangée ; energy -1 | EMPTY, NOT_REACHABLE, CAPACITY, CONFLICT ; aucun effet partiel. Pas d’équivalent générique actuel |
| INGEST | ration portée ; quantité≥1 ; corps autorise ingestion | quantité -1 ; ledger.consumed.ration +1 ; hunger=max(0,hunger-38), sans ajout d’énergie implicite | INCOMPATIBLE, EMPTY ; analogue eat actuel mais sans bilan |
| REST | acteur valide, aucun déplacement/travail concurrent | energy=min(100,energy+6), ou +18 à abri complet sur case | N’altère aucun dommage ni matière ; analogue repos existant, adapter C1 futur |
| START_PROJECT | case atteinte, non bloquée, sans projet ; recette connue ; limite de projets non atteinte | nouveau projet workDone=0, status=open ; ni matière ni construction gratuite | OCCUPIED, UNKNOWN_RECIPE, CAPACITY ; interaction ajoutée, aucune actuelle |
| WORK | projet local open ; deux bois présents ; capacité disponible ; acteur connaît pratique | workDone +1, au plus 4 ; energy -1 ; à 4 : complete, effet repos activé | MISSING_INPUT, NO_CAPACITY, ALREADY_COMPLETE ; chantier reste en place après échec |

Pour déplacer un obstacle transportable : TRANSFER case→porteur→autre case ; sa propriété blocking ne bloque que lorsqu’il est au sol. Destinations bloquantes interdites sur un habitant, un projet ou autre objet bloquant. TRANSFER ne prend rien à un autre porteur : don consensuel et échange sont une extension, pas un vol implicite. Déposer dans un projet open immobilise les matériaux ; retrait/démontage exclus du noyau. Cette limite est visible et doit être validée.

L’exploration est une stratégie de sélection de déplacements, pas un verbe qui crée une découverte à distance. Observer au début du tick est automatique et sans coût séparé dans le laboratoire.

## 4. Transaction et temps
Un tick logique = une heure d’essai, sans rattrapage à partir de l’horloge murale. Ordre normatif :
1. Appliquer commandes divines en file, contrôlées et journalisées ; elles peuvent invalider des intentions.
2. Horloge +1 ; en I1, faim +2 (max130). Pas de perte générale d’énergie en plus des coûts d’action : simplification explicite distincte de main, à valider.
3. Percevoir pour tous depuis le même état matériel, rayon Manhattan 2 sans occlusion en I1.
4. Chaque acteur choisit au plus une primitive à partir de sa vue personnelle, de son état et des résultats déjà connus ; aucune lecture du monde caché dans le décideur.
5. Trier IDs croissants puis rotation de départ par tick modulo nombre d’acteurs ; exécuter les commandes l’une après l’autre. Revalider toutes les préconditions contre l’état courant.
6. Calculer un delta temporaire, vérifier invariants, appliquer le delta en bloc, publier résultat. Une exception ou un échec laisse matière et coût d’action inchangés.
7. Apprendre du résultat accessible ; publier événements pour inspection divine. Sauvegarder uniquement un état à frontière de tick.

Le vieillissement faim de l’étape 2 subsiste même si l’action échoue ; ce n’est pas un effet partiel de l’action. Pour I1 les habitants peuvent partager une case : collision entre personnes exclue, concurrence porte sur les ressources.
Pas de verrou tenu entre ticks, ni de réservation donnant un droit de propriété. Révision différente = revalider ; si la précondition reste satisfaite, réussir est permis. Les arbitrages simultanés sont reproductibles, sans promettre justice ni absence de famine.

ActionResult = {id, tick, actorId, intentId, command, outcome, causeCode, checkedRevisions, delta, cost, causalParents}.
Causes bornées : SUCCESS, EMPTY, NOT_REACHABLE, BLOCKED, OUT_OF_BOUNDS, NO_CAPACITY, CAPACITY, CONFLICT, INCOMPATIBLE, OCCUPIED, UNKNOWN_RECIPE, MISSING_INPUT, ALREADY_COMPLETE, INVALID.
Les raisons de choix sont enregistrées **au choix**, les effets **au commit**. Ne jamais reconstruire a posteriori une justification psychologique à partir de l’issue.
Événements récents bornés à 256 ; chaque entité conserve référence du dernier changement et cause résumée. Historique illimité exclu ; si un parent ancien est purgé, indiquer « détail historique non conservé », jamais inventer sa chaîne. État constitutif courant toujours entièrement inspectable.

## 5. Invariants
I-01 : quantité et travail entiers ≥0 ; workDone≤4 ; données numériques finies.
I-02 : chaque entité a un seul emplacement valide ; absence de détenteur orphelin.
I-03 : pour chaque matériau, somme des quantités de toutes locations + consumed = initial + divineAdded - divineRemoved.
I-04 : échec = zéro mutation matérielle et zéro coût d’action ; coût vital indépendant explicitement tracé.
I-05 : une primitive maximum par acteur/tick ; un quantum ne peut être prélevé deux fois.
I-06 : progression de projet indépendante de l’intention, de l’acteur et du chargement.
I-07 : décideur incapable d’accéder à vérité cachée ; omniscience réservée à inspection divine.
I-08 : sauvegarder/recharger à tick identique conserve matière, projets, connaissances, intentions, IDs, ordre et rngState.
I-09 : le rendu et le panneau divin en lecture ne mutent ni état ni RNG.
I-10 : limites atteintes donnent un résultat explicite, jamais un clamp qui perd de la matière.
I-11 : connaissance d’une révision ne s’actualise que par observation ou communication autorisée ; pas par l’échec distant d’un autre.
I-12 : intervention divine ne contourne pas les invariants ; suppression future d’un porteur devra déposer ou retirer explicitement son contenu.

## 6. Sélection, composition et autonomie
En I1, un contrôleur borné réutilise l’esprit de cognition.choose, sans modifier ses fonctions : manger si faim≥45 et ration portée ; repos si energy<3 ; acquérir si food<2 ou faim≥40 sans ration ; sinon exploration. L’acquisition priorise source connue à stock positif, distance connue et échec contextualisé ; maximum trois alternatives comparables et tirage RNG sérialisé. Porter déjà quatre rations exclut prélèvement.
Approcher puis transférer puis ingérer sont trois décisions/primitives distinctes ; une intention peut rester active sur plusieurs ticks. Aucune récompense avant commit.
Sans source : explorer un voisin accessible connu ou une frontière inconnue ; après observation d’une source vide, éviter de la rechoisir jusqu’à observation positive. Si aucune action possible : REST avec cause d’attente inspectable. Aucune régénération automatique pour débloquer.
En I2 : route BFS sur connaissances seulement ; inconnu supposé praticable pour exploration, pas de nature cachée ; pas exécuté rejeté si obstacle réel. Budget : au plus 108 cellules visitées par recherche, recomputation sur invalidation.
En I3 : proposer pratique d’abri seulement si fatigue, abri connu absent et matériaux/recette connus ; faim interrompt, progrès demeure ; ce critère est expérimental, non règle C2 validée.
En I4 : traces T contextualisées bornées, proposition initiale plafond 8, seulement après récupération du contrat C3. Aucune mémorisation illimitée de toutes les séquences. Les pratiques initiales sont fournies au laboratoire, pas « inventées » par ses habitants.

## 7. Interfaces C1–C4 et inspection
| Chantier | Entrée / sortie candidate | Réserve d’intégration |
|---|---|---|
| C1 | capabilities(actor,interaction,context) → autorisation/coût ; applyExposure(result) et acceptIntake(material,q) | Corps limite l’action, ne choisit pas. L/M/S, récupération distincte et bilan futur préservés ; adaptateur hunger/energy provisoire, sans prétention d’équivalence |
| C2 | decide(personalView,bodyView,memories) → intention/raison/commande ; receiveOutcome(perceivedResult) | Pas de seuil ajouté à C2 comme loi validée. Évaluation subjective complète et émotion non démontrées |
| C3 | estimateExecution(trace,context) ; consolidate(observedOutcome,context) | Ne change jamais conservation ni droit d’accès ; formule et sélection des traces à récupérer avant I4 |
| C4 | observedEvents accessibles ; message S optionnel fournit un contenu connu, pas accès au monde | D1 via primitives/projets ; D2 reste ouvert ; aucun partage, devoir ou confiance imposé par la couche matérielle |
| C9 / L1 | inspectWorld, inspectAgent, inspectTransaction, inspectProject ; commandes divines contrôlées | Afficher vérité et croyance séparément, préconditions, coûts, arbitrage, objets, révisions, seuils et limites ; interface à développer |

## 8. Persistance
Schéma et clé dédiés `microcosme-material-lab-v1`. Ne jamais lire-écrire microcosme-v03/v02 dans le labo. Pas de migration automatique de main ni conversion prétendument neutre du compteur s.food.
Valider le snapshot entier avant remplacement ; données inconnues ou invalides refusées avec erreur précise, version future refusée. Stockage impossible : conserver l’état en mémoire, avertissement persistant et export JSON disponible. Import valide uniquement à pause, restauration atomique. Export/import et sauvegarde locale utilisent le même validateur.
Sauver seed/rngState, compteurs, commandes persistantes éventuelles et plans. Ne pas sauver les index dérivés ni données Canvas. Aux frontières de tick, aucune transaction partielle n’existe ; aucun journal d’événements infini nécessaire au redémarrage.
