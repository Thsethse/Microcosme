# Contrat technique candidat v0.2
**NON VALIDÉ. Aucun code du noyau ci-dessous n’existe à ce jour.** Les constantes sont des paramètres de laboratoire proposés, pas des équations biologiques validées.

## 1. Périmètre borné
Noyau cible : 5 habitants maximum, grille expérimentale 12×9, 128 entités matérielles maximum, deux matériaux abstraits (ration, bois), objets rigides monocase, deux projets maximum, un seul type de structure (abri). Pas d’eau simulée, terrain déformable, empilement, combustion, maladie, reproduction, marché, norme ou autorité. Cette grille reprend le support existant ; elle ne valide ni le C5 insulaire ni G+.

Premier incrément I1 : seulement 2 habitants, 16 lots matériels actifs maximum de rations (quantity>0, tous emplacements confondus), aucune construction ni obstacle. Son contrat est le sous-ensemble défini ici ; le noyau cible complet arrive après I2–I4.

## 2. État autoritaire et représentation
Proposition de modules purs UMD/CommonJS compatibles avec les conventions observées :
- material-world.js : états, validations, transactions et observations ;
- material-actions.js : descripteurs et exécution des primitives ;
- material-cognition.js : décisions à partir de vues personnelles et pratiques bornées ;
- material-storage.js : schéma isolé, validation et round-trip ;
- material-lab.js/html : horloge, présentation et inspection du laboratoire.
Noms **proposés à créer**, pas fichiers existants.

World = {schemaVersion:1, tick, nextId, rngState, config, cells, entities, agents, projects, ledger, recentEvents}.
Toutes les identités sont stables et uniques dans leur type ; nextId est le compteur monotone des lots, augmenté à chaque création réussie ; tick entier. Les révisions d’entités changent seulement lors d’une mutation de leurs propriétés observables. Les unités matérielles sont entières et non négatives ; aucun flottant de masse dans ce laboratoire.

Cell = {id, basePassable, resourceRevision}. resourceRevision est un compteur entier par cellule, incrémenté une fois par transaction réussie modifiant les lots au sol de cette cellule (identité, matériau ou quantité), y compris leur arrivée/départ. Pas de propriétaire social dans cette structure.
Entity = {id, material, quantity, location, unitMass, blocking, revision}.
location est exactement l’une de {cellId}, {holderAgentId}, {projectId}. Un lot de quantité n est fongible ; un outil indivisible serait quantity=1 mais les outils sont exclus du noyau. Aucune liste secondaire d’inventaire faisant autorité : les index se dérivent des locations.

### Cycle de vie des lots — règle normative I1

- **Lot matériel actif** : entrée de entities avec quantity>0. Les lots au sol, portés et, plus tard, en projet comptent tous dans la limite (16 en I1, 128 dans le noyau ultérieur). Les quantités ne comptent pas comme des lots : une source de 40 rations est un lot.
- **Fractionnement partiel** (0<q<quantity) : la source garde son ID et reste positive ; le fragment reçoit nextId, uniquement lors du commit réussi. Aucun ID n’est réservé ou consommé par une tentative refusée.
- **Transfert total** (q=quantity) : déplacer le lot existant en conservant son ID ; aucune copie ni lot source vide. Le nombre de lots ne change pas.
- **Épuisement par ingestion** : si quantity devient zéro, retirer ce lot dans le même commit que l’ingestion et l’incrément de consumed. Un zéro transitoire peut exister dans le calcul du delta, jamais dans l’état publié ou sauvegardé. Aucun lot vide n’est conservé au sol, dans un inventaire ou ailleurs ; aucun nettoyage différé au prochain tick.
- **Capacité** : vérifier le nombre de lots actifs du delta final avant tout effet. Un split qui porterait le total de 16 à 17 échoue CAPACITY sans matière déplacée, coût d’action, allocation d’ID ou révision modifiée. À 16, un transfert total reste possible si les autres préconditions sont satisfaites. Pas de fusion automatique pour contourner la limite.
- **Identifiants** : compteur nextId sérialisé, incrémenté uniquement pour une création réussie, jamais décrémenté ni recalculé à partir des seuls lots survivants. IDs des lots retirés jamais réutilisés. IDs d’agents/projets sont typés séparément des IDs de lots. Entiers sûrs ; si une allocation ne permet plus un nextId entier sûr, refuser CAPACITY, sans réutilisation. Ne pas supprimer de matière pour libérer un identifiant.

### Lieu observé, mémoire et références disparues
Un **lieu de ressource** est une cellule identifiée par cellId, pas un lot immobile conservé à zéro. La quantité réelle disponible d’un matériau au sol se dérive des lots actifs de la cellule ; elle vaut zéro si aucun lot compatible n’y demeure. Pas de stock parallèle faisant autorité.
Une observation personnelle de source est {cellId, material, observedQuantity, observedLotIds, observedAt, observedRevision}. Elle remplace l’observation précédente du même couple (cellId,material), avec au plus 108 entrées par agent pour la ration I1 et au plus 16 IDs par entrée. Une cellule observée vide donne observedQuantity=0 et observedLotIds=[] : c’est le **souvenir d’une source épuisée**, pas une entité matérielle et pas une entrée dans la limite des 16 lots. Une observation ultérieure positive rend le lieu candidat à nouveau.
La suppression réelle d’un lot ne parcourt pas les mémoires pour les corriger. Un habitant éloigné peut garder une ancienne observation et une intention vers ce lieu ; son éventuel targetLotId est une référence épistémique pouvant être périmée, pas une référence d’emplacement dont la validité serait exigée en permanence.
Une intention I1 contient son lieu cible et éventuellement le lot connu ciblé ; un plan I1 conserve au plus trois étapes et une seule intention active. À la prochaine observation locale, remplacer la liste des lots observés, invalider l’étape visant un lot non disponible et réévaluer à partir de cette vue. Ne pas effacer tous les souvenirs historiques de cet ID ni suivre automatiquement le lot vers un lieu inconnu.
Si une commande déjà choisie rencontre au commit un lot retiré, ou absent de l’emplacement attendu, elle échoue EMPTY (« source indisponible ici ») après contrôle de la portée locale. Elle ne recherche pas ni ne révèle la nouvelle position ou la cause distante. L’acteur enregistre ce résultat accessible ; pas de mise à jour des connaissances d’autrui. Une commande vers un lieu hors portée échoue NOT_REACHABLE sans renseigner sur le lot. Une observation complète de la cellule, et non la seule disparition d’un ID, établit que tout le lieu est épuisé.
Les anciennes références restent de simples valeurs dans les observations bornées, l’intention, le plan et les événements récents. **Aucun registre de lots supprimés, aucune chaîne de fragments ni tombstone sans borne.** Les traces pratiques C3 restent différées ; ne pas créer en I1 une table d’expériences croissant par ID retiré.
La dernière ingestion produit un événement borné indiquant lotId, ancienne quantité, quantité finale zéro, retrait, flux consumed et cause. Le ledger garde les totaux matériels ; il ne garde pas l’historique des lots. Après purge de l’événement, annoncer que le détail historique n’est plus conservé. La matière courante et son bilan restent vérifiables sans cet historique.

Agent = {id, pos, body, knowledge, intention, plan, practicalTraces}. body utilise en I1 hunger/energy historiques comme adaptateur temporaire, pas comme C1 cible. Capacité portée = 4 unités, masse unitaire ration=1 (valeurs d’essai). knowledge contient seulement observations datées/révisions connues ; plan ne contient que des références connues.
Project = {id, cellId, recipeId, workDone, status, revision}. Les matériaux sont les entités situées dans le projet. Prototype abri : deux quanta bois et quatre quanta travail ; à chaque quantum de travail, 1 unité d’énergie d’essai dépensée ; à workDone=4, status=complete et lieu de repos amélioré. Le bois reste dans le projet achevé, jamais recopié en un nouvel objet. Un projet incomplet n’apporte aucun bénéfice de repos.

ledger = par matériau {initial, divineAdded, divineRemoved, consumed}. Il ne prétend pas représenter masse corporelle/assimilation : consumed est une destination comptable explicite. L’interface biologique réelle remplacera ce puits d’essai après formalisation autorisée. Toute intervention divine est une commande tracée avec source/destination, jamais une correction cachée.

## 3. Catalogue d’interactions
Toutes **à développer**. Les interactions actuelles analogues dans engine.js sont indiquées, elles ne satisfont pas ce contrat.

| ID | Commande et préconditions au commit | Effets exacts d’un succès | Échec / interruption |
|---|---|---|---|
| MOVE | acteur existant ; voisin cardinal ; cellule praticable ; coût disponible | pos devient voisin ; energy -1 d’essai ; événement avec anciennes/nouvelles positions | BLOCKED, OUT_OF_BOUNDS, NO_CAPACITY ; pas de téléportation. Analogue existant travel, sans obstacles |
| TRANSFER | acteur existant ; energy≥coût (coût=1 en I1) avant commit ; quantité q>0 entière ; source accessible sur même case ou portée ; source.quantity≥q ; destination différente de la source, même case/porteur/projet accessible ; capacité compatible | q quitte source et arrive destination atomiquement, split si partiel, ID conservé si total ; masse globale inchangée ; energy -1 | NO_CAPACITY si énergie insuffisante ; EMPTY, NOT_REACHABLE, CAPACITY, CONFLICT ; refus sans déplacement de matière, création de lot ni coût d’action. Pas d’équivalent générique actuel |
| INGEST | ration portée ; quantité≥1 ; corps autorise ingestion | quantité -1 ; retrait atomique du lot si zéro ; ledger.consumed.ration +1 ; hunger=max(0,hunger-38), sans ajout d’énergie implicite | INCOMPATIBLE, EMPTY ; analogue eat actuel mais sans bilan |
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
6. Calculer un delta temporaire incluant créations/retraits de lots, nextId, révisions, coût et ledger ; vérifier invariants, appliquer le delta en bloc, publier résultat. Une exception ou un échec laisse ces éléments inchangés (hors événement de refus et traitement cognitif du résultat).
7. Apprendre du résultat accessible ; publier événements pour inspection divine. Sauvegarder uniquement un état à frontière de tick.

Le vieillissement faim de l’étape 2 subsiste même si l’action échoue ; ce n’est pas un effet partiel de l’action. Pour I1 les habitants peuvent partager une case : collision entre personnes exclue, concurrence porte sur les ressources.
Ordre des contrôles TRANSFER I1 : commande/acteur valides (sinon INVALID), énergie disponible≥1 (sinon NO_CAPACITY), portée du lieu source/destination (sinon NOT_REACHABLE), disponibilité du lot à l’emplacement attendu et quantité suffisante (sinon EMPTY), compatibilité (sinon INCOMPATIBLE), capacités porteur/compte de lots/allocation d’ID (sinon CAPACITY). Aucun effet avant la réussite de tous ces contrôles. En I1, une perte de disponibilité due à la concurrence utilise EMPTY, sans second code CONFLICT ambigu ; CONFLICT reste réservé aux extensions. L’énergie égale à 1 suffit pour TRANSFER et devient 0 après succès. Un refus NO_CAPACITY ne signifie pas que la source a été observée vide et ne doit pas invalider sa disponibilité mémorisée. La politique peut préférer REST avant ce seuil ; l’exécuteur reste obligé de vérifier toute commande reçue.

Pas de verrou tenu entre ticks, ni de réservation donnant un droit de propriété. Révision différente = revalider ; si la précondition reste satisfaite, réussir est permis. Les arbitrages simultanés sont reproductibles, sans promettre justice ni absence de famine.

ActionResult = {id, tick, actorId, intentId, command, outcome, causeCode, checkedRevisions, delta, cost, causalParents}.
Causes bornées : SUCCESS, EMPTY, NOT_REACHABLE, BLOCKED, OUT_OF_BOUNDS, NO_CAPACITY, CAPACITY, CONFLICT, INCOMPATIBLE, OCCUPIED, UNKNOWN_RECIPE, MISSING_INPUT, ALREADY_COMPLETE, INVALID.
Les raisons de choix sont enregistrées **au choix**, les effets **au commit**. Ne jamais reconstruire a posteriori une justification psychologique à partir de l’issue.
Événements récents bornés à 256 ; chaque entité conserve référence du dernier changement et cause résumée. Historique illimité exclu ; si un parent ancien est purgé, indiquer « détail historique non conservé », jamais inventer sa chaîne. État constitutif courant toujours entièrement inspectable.

## 5. Invariants
I-01 : quantité des lots actifs entière >0 à toute frontière publiée ; travail entier ≥0 et workDone≤4 ; données numériques finies, energy≥0. Les zéros sont des observations ou des valeurs transitoires de delta, pas des lots persistants.
I-02 : chaque entité a un seul emplacement valide ; absence de détenteur orphelin.
I-03 : pour chaque matériau, somme des quantités de toutes locations + consumed = initial + divineAdded - divineRemoved.
I-04 : échec = zéro mutation matérielle, zéro création/retrait de lot, nextId et révisions inchangés, zéro coût d’action ; faim de début de tick indépendante et explicitement tracée. TRANSFER requiert energy≥1, sinon NO_CAPACITY ; pas d’énergie négative ni de clamp masquant un découvert.
I-05 : une primitive maximum par acteur/tick ; un quantum ne peut être prélevé deux fois.
I-06 : progression de projet indépendante de l’intention, de l’acteur et du chargement.
I-07 : décideur incapable d’accéder à vérité cachée ; omniscience réservée à inspection divine.
I-08 : sauvegarder/recharger à tick identique conserve matière, projets, connaissances (y compris références périmées), intentions, IDs, nextId, resourceRevision, ledger, événements bornés, ordre et rngState ; aucune résurrection de lot vide.
I-09 : le rendu et le panneau divin en lecture ne mutent ni état ni RNG.
I-10 : limites atteintes donnent un résultat explicite, jamais un clamp qui perd de la matière.
I-11 : connaissance d’une révision ne s’actualise que par observation ou résultat directement accessible (ou communication autorisée ultérieure) ; pas par l’échec distant d’un autre. Un simple refus ne donne pas une observation complète du lieu.
I-12 : intervention divine ne contourne pas les invariants ; suppression future d’un porteur devra déposer ou retirer explicitement son contenu.
I-13 : seuls les lots actifs comptent dans la limite ; épuisement retire le lot atomiquement, sans ID réutilisé ni registre historique non borné.
I-14 : références matérielles (emplacement/détenteur) valides ; références épistémiques à un ancien lot permises et bornées, corrigées seulement par observation/résultat accessible. Retirer un lot ne divulgue aucune information à distance.

## 6. Sélection, composition et autonomie
En I1, un contrôleur borné réutilise l’esprit de cognition.choose, sans modifier ses fonctions : manger si faim≥45 et ration portée ; repos si energy<3 ; acquérir si food<2 ou faim≥40 sans ration ; sinon exploration. food est la somme dérivée des rations portées, pas un compteur supplémentaire. L’acquisition priorise lieu observé à quantité positive, distance connue et échec contextualisé ; maximum trois alternatives comparables et tirage RNG sérialisé. Porter déjà quatre rations exclut prélèvement.
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
Sauver seed/rngState, nextId, resourceRevision, ledger, observations bornées (y compris sources observées vides et anciens IDs), intentions, plans et événements bornés. Refuser à l’import un lot actif de quantité zéro ; ne pas le nettoyer silencieusement et ne pas recréer les lots absents cités par les souvenirs. Distinguer référence matérielle orpheline (erreur) et référence épistémique périmée (valide). nextId doit dépasser tous les IDs de lots encore présents ou cités dans le snapshot ; ne jamais le recalculer vers le bas. Les IDs historiques déjà purgés ne peuvent être vérifiés sans archive, mais le compteur sauvegardé conserve la progression du parcours normal. Une nouvelle simulation peut repartir d’un compteur neuf ; une reprise ne le peut pas. Ne pas sauver les index dérivés ni données Canvas. Aux frontières de tick, aucune transaction partielle n’existe ; aucun journal d’événements infini nécessaire au redémarrage.
